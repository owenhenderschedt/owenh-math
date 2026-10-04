import { useMemo, useRef, useState } from 'react'
import type { PointerEvent as ReactPointerEvent } from 'react'

type Point = {
  x: number
  y: number
}

type SquareObstacle = {
  id: number
  cx: number
  cy: number
  size: number
  angle: number
}

const VIEW_WIDTH = 1000
const VIEW_HEIGHT = 560

const START: Point = { x: 100, y: 280 }
const TARGET: Point = { x: 900, y: 280 }

const ZONE_RADIUS = 36
const RUNNER_RADIUS = 9
const COLLISION_RADIUS = 0.8

const DISTANCE_MM = 100
const BOUND_MM = 1.5 * DISTANCE_MM

/*
 * The centers of S and T are our fixed d = 100 mm apart.
 * This gives us one permanent scale for every arrangement.
 */
const MM_PER_UNIT =
  DISTANCE_MM / Math.hypot(TARGET.x - START.x, TARGET.y - START.y)

function distance(a: Point, b: Point) {
  return Math.hypot(a.x - b.x, a.y - b.y)
}

function clamp(value: number, low: number, high: number) {
  return Math.max(low, Math.min(high, value))
}

function clampToArena(point: Point): Point {
  return {
    x: clamp(
      point.x,
      COLLISION_RADIUS + 4,
      VIEW_WIDTH - COLLISION_RADIUS - 4,
    ),
    y: clamp(
      point.y,
      COLLISION_RADIUS + 4,
      VIEW_HEIGHT - COLLISION_RADIUS - 4,
    ),
  }
}

function randomBetween(low: number, high: number) {
  return low + Math.random() * (high - low)
}

function localCoordinates(point: Point, square: SquareObstacle) {
  const dx = point.x - square.cx
  const dy = point.y - square.cy

  const cos = Math.cos(square.angle)
  const sin = Math.sin(square.angle)

  return {
    x: cos * dx + sin * dy,
    y: -sin * dx + cos * dy,
  }
}

/*
 * Exact circle-versus-rotated-square test.
 *
 * Visually we draw the actual square, but mathematically the center
 * of the moving disk is forbidden from the square enlarged by the
 * disk radius.
 */
function circleHitsSquare(
  point: Point,
  square: SquareObstacle,
  radius = COLLISION_RADIUS,
) {
  const local = localCoordinates(point, square)
  const half = square.size / 2

  const closestX = clamp(local.x, -half, half)
  const closestY = clamp(local.y, -half, half)

  const dx = local.x - closestX
  const dy = local.y - closestY

  if (Math.abs(local.x) <= half && Math.abs(local.y) <= half) {
    return true
  }

  return dx * dx + dy * dy <= radius * radius
}

function collisionNormal(point: Point, square: SquareObstacle): Point {
  const local = localCoordinates(point, square)
  const half = square.size / 2

  const closestX = clamp(local.x, -half, half)
  const closestY = clamp(local.y, -half, half)

  let nx = local.x - closestX
  let ny = local.y - closestY

  let length = Math.hypot(nx, ny)

  /*
   * This is only a numerical fallback. With our tiny movement steps,
   * contact normally occurs outside the actual square and length > 0.
   */
  if (length < 0.0001) {
    const right = half - local.x
    const left = half + local.x
    const bottom = half - local.y
    const top = half + local.y

    const smallest = Math.min(right, left, bottom, top)

    if (smallest === right) {
      nx = 1
      ny = 0
    } else if (smallest === left) {
      nx = -1
      ny = 0
    } else if (smallest === bottom) {
      nx = 0
      ny = 1
    } else {
      nx = 0
      ny = -1
    }

    length = 1
  }

  nx /= length
  ny /= length

  const cos = Math.cos(square.angle)
  const sin = Math.sin(square.angle)

  return {
    x: cos * nx - sin * ny,
    y: sin * nx + cos * ny,
  }
}

function hitsAnySquare(point: Point, obstacles: SquareObstacle[]) {
  return obstacles.some((square) => circleHitsSquare(point, square))
}

/*
 * Move toward the cursor in tiny steps.
 *
 * When a step meets an obstacle we remove the inward component of
 * the movement. What remains is tangent to the obstacle, producing
 * the smooth "slide along the square" behavior.
 *
 * The tiny steps also prevent a fast mouse motion from jumping
 * through an obstacle.
 */
function moveLegally(
  from: Point,
  rawTarget: Point,
  obstacles: SquareObstacle[],
) {
  const target = clampToArena(rawTarget)

  const totalDistance = distance(from, target)

  if (totalDistance < 0.01) {
    return from
  }

  const steps = Math.max(1, Math.ceil(totalDistance / 2.2))

  const intended = {
    x: (target.x - from.x) / steps,
    y: (target.y - from.y) / steps,
  }

  let position = { ...from }

  for (let step = 0; step < steps; step += 1) {
    const candidate = clampToArena({
      x: position.x + intended.x,
      y: position.y + intended.y,
    })

    const collision = obstacles.find((square) =>
      circleHitsSquare(candidate, square),
    )

    if (!collision) {
      position = candidate
      continue
    }

    const normal = collisionNormal(candidate, collision)

    const normalComponent =
      intended.x * normal.x + intended.y * normal.y

    const slide =
      normalComponent < 0
        ? {
            x: intended.x - normalComponent * normal.x,
            y: intended.y - normalComponent * normal.y,
          }
        : intended

    /*
     * Near a rotated corner, the full projected slide can occasionally
     * be a fraction too large and still intersect the rounded collision
     * boundary. Rather than stopping for a frame, try progressively
     * shorter versions of the same slide.
     */
    let movedAlongBoundary = false

    for (const scale of [1, 0.75, 0.5, 0.25]) {
      const slideCandidate = clampToArena({
        x: position.x + slide.x * scale,
        y: position.y + slide.y * scale,
      })

      if (!hitsAnySquare(slideCandidate, obstacles)) {
        position = slideCandidate
        movedAlongBoundary = true
        break
      }
    }

    if (movedAlongBoundary) {
      continue
    }

    /*
     * At an especially tight corner, try the pure tangent direction
     * at several small scales. This keeps the motion flowing around
     * the corner instead of momentarily sticking.
     */
    const tangent = {
      x: -normal.y,
      y: normal.x,
    }

    const tangentAmount =
      intended.x * tangent.x + intended.y * tangent.y

    for (const scale of [0.75, 0.5, 0.25, 0.125]) {
      const tangentCandidate = clampToArena({
        x: position.x + tangentAmount * tangent.x * scale,
        y: position.y + tangentAmount * tangent.y * scale,
      })

      if (!hitsAnySquare(tangentCandidate, obstacles)) {
        position = tangentCandidate
        break
      }
    }
  }

  return position
}

function makeObstacles() {
  const desiredCount = 13 + Math.floor(Math.random() * 4)
  const obstacles: SquareObstacle[] = []

  let attempts = 0

  while (obstacles.length < desiredCount && attempts < 4000) {
    attempts += 1

    const size = randomBetween(46, 84)
    const angle = randomBetween(0, Math.PI / 2)

    const candidate: SquareObstacle = {
      id: obstacles.length,
      cx: randomBetween(215, 785),
      cy:
        Math.random() < 0.82
          ? randomBetween(185, 375)
          : randomBetween(105, 455),
      size,
      angle,
    }

    const candidateRadius = (Math.sqrt(2) * size) / 2

    /*
     * Keep a generous neighborhood around the two zones clear.
     */
    if (
      distance({ x: candidate.cx, y: candidate.cy }, START) <
        candidateRadius + ZONE_RADIUS + 36 ||
      distance({ x: candidate.cx, y: candidate.cy }, TARGET) <
        candidateRadius + ZONE_RADIUS + 36
    ) {
      continue
    }

    /*
     * Avoid visually messy overlapping squares. This is deliberately
     * conservative: we use the circumscribed circles as a quick test.
     */
    const overlapsExisting = obstacles.some((other) => {
      const otherRadius = (Math.sqrt(2) * other.size) / 2

      return (
        distance(
          { x: candidate.cx, y: candidate.cy },
          { x: other.cx, y: other.cy },
        ) <
        candidateRadius + otherRadius + 5
      )
    })

    if (overlapsExisting) {
      continue
    }

    obstacles.push(candidate)
  }

  return obstacles
}

/*
 * Extremal arrangement:
 * vertical stacks of congruent squares, with consecutive
 * columns shifted vertically by half a square-spacing.
 *
 * A small positive gap remains between squares so the
 * mathematical point can still squeeze through.
 */
function makeExtremalObstacles(): SquareObstacle[] {
  const obstacles: SquareObstacle[] = []

  /*
   * Use the same spacing horizontally and vertically.
   */
  const size = 57
  const gap = 10
  const pitch = size + gap

  /*
   * Eleven columns fit almost exactly between the boundaries
   * of S and T:
   *
   *   11(57) + 10(10) = 727
   *
   * while the available horizontal distance is 728.
   */
  const numberOfColumns = 11
  const firstColumnX =
    START.x + ZONE_RADIUS + size / 2

  const top = 22
  const bottom = 453

  let id = 0

  for (let column = 0; column < numberOfColumns; column += 1) {
    const cx = firstColumnX + column * pitch

    /*
     * Alternate columns are shifted vertically by half
     * of the square-spacing.
     */
    const shift =
      column % 2 === 0
        ? 0
        : pitch / 2

    let cy = top + size / 2 + shift

    while (cy + size / 2 <= bottom) {
      obstacles.push({
        id,
        cx,
        cy,
        size,
        angle: 0,
      })

      id += 1
      cy += pitch
    }
  }

  return obstacles
}

export default function ShortPathGame() {
  const svgRef = useRef<SVGSVGElement | null>(null)
  const runnerRef = useRef<Point>({ ...START })

  const [obstacles, setObstacles] =
    useState<SquareObstacle[]>(makeObstacles)

  const [runner, setRunner] = useState<Point>({ ...START })
  const [path, setPath] = useState<Point[]>([{ ...START }])

  const [pathLengthUnits, setPathLengthUnits] = useState(0)
  const [dragging, setDragging] = useState(false)
  const [complete, setComplete] = useState(false)

  const pathLengthMm = pathLengthUnits * MM_PER_UNIT

  const ratio = pathLengthMm / DISTANCE_MM

  const pathString = useMemo(
    () => path.map((point) => `${point.x},${point.y}`).join(' '),
    [path],
  )

  function pointerToArena(
    event: ReactPointerEvent<SVGSVGElement>,
  ): Point {
    const svg = svgRef.current

    if (!svg) {
      return runnerRef.current
    }

    const rectangle = svg.getBoundingClientRect()

    return {
      x:
        ((event.clientX - rectangle.left) / rectangle.width) *
        VIEW_WIDTH,
      y:
        ((event.clientY - rectangle.top) / rectangle.height) *
        VIEW_HEIGHT,
    }
  }

  function beginDrag(
    event: ReactPointerEvent<SVGCircleElement>,
  ) {
    if (complete) {
      return
    }

    event.preventDefault()

    event.currentTarget.setPointerCapture(event.pointerId)
    setDragging(true)
  }

  function moveRunner(
    event: ReactPointerEvent<SVGSVGElement>,
  ) {
    if (!dragging || complete) {
      return
    }

    event.preventDefault()

    const current = runnerRef.current
    const desired = pointerToArena(event)

    const next = moveLegally(current, desired, obstacles)
    const movement = distance(current, next)

    if (movement < 0.04) {
      return
    }

    runnerRef.current = next
    setRunner(next)

    setPath((currentPath) => [...currentPath, next])
    setPathLengthUnits((currentLength) => currentLength + movement)

    const reachedTarget =
      distance(next, TARGET) <=
      ZONE_RADIUS - COLLISION_RADIUS

    if (reachedTarget) {
      setComplete(true)
      setDragging(false)
    }
  }

  function resetPath() {
    runnerRef.current = { ...START }

    setRunner({ ...START })
    setPath([{ ...START }])
    setPathLengthUnits(0)
    setDragging(false)
    setComplete(false)
  }

  function newArrangement() {
    setObstacles(makeObstacles())
    resetPath()
  }

  function showExtremalArrangement() {
    setObstacles(makeExtremalObstacles())
    resetPath()
  }

  const resultMessage = complete
    ? pathLengthMm <= BOUND_MM
      ? `Reached T in ${pathLengthMm.toFixed(1)} mm — below 3d/2.`
      : `Reached T in ${pathLengthMm.toFixed(1)} mm — try to beat 150 mm.`
    : 'Drag the point from S to T without crossing a square.'

  return (
    <section className="sp-game">
      <div className="sp-top">
        <div className="sp-heading">
          <h1>Short Path Algorithms</h1>
          <p>{complete ? resultMessage : '\u00A0'}</p>
        </div>

        <div className="sp-scoreboard" aria-label="Path measurements">
          <div>
            <span>PATH</span>
            <strong>{pathLengthMm.toFixed(1)}</strong>
            <small>mm</small>
          </div>

          <div>
            <span>TARGET</span>
            <strong>{BOUND_MM.toFixed(0)}</strong>
            <small>mm</small>
          </div>

          <div>
            <span>RATIO</span>
            <strong>{ratio.toFixed(3)}</strong>
            <small>L / d</small>
          </div>
        </div>
      </div>

      <section className="sp-paper-banner">
        <div className="sp-paper-banner-label">Related Paper</div>

        <div className="sp-paper-banner-copy">
          <div className="sp-paper-banner-title">
            Short path and short chain problems in the plane
          </div>

          <div className="sp-paper-banner-authors">
            András Bezdek · Owen Henderschedt
          </div>
        </div>

        <div className="sp-paper-banner-links">
          <a
            href="https://link.springer.com/book/9783032259288"
            target="_blank"
            rel="noreferrer"
          >
            Book ↗
          </a>

          <a
            href="/papers/short-path-and-short-chain-problems-in-the-plane.pdf"
            target="_blank"
            rel="noreferrer"
          >
            PDF ↗
          </a>
        </div>
      </section>

      <div className="sp-arena-wrap">
        <div className="sp-board-label">
          <small>Click and drag the point from S to T, avoiding the squares</small>
        </div>

        <svg
          ref={svgRef}
          className={[
            'sp-arena',
            dragging ? 'sp-arena-dragging' : '',
            complete ? 'sp-arena-complete' : '',
          ]
            .filter(Boolean)
            .join(' ')}
          viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
          role="img"
          aria-label="Drag a point from zone S to zone T while avoiding rotated square obstacles."
          onPointerMove={moveRunner}
          onPointerUp={() => setDragging(false)}
          onPointerCancel={() => setDragging(false)}
        >
          <defs>
            <marker
              id="sp-arrow"
              viewBox="0 0 10 10"
              refX="5"
              refY="5"
              markerWidth="5"
              markerHeight="5"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" />
            </marker>
          </defs>

          <rect
            x="0"
            y="0"
            width={VIEW_WIDTH}
            height={VIEW_HEIGHT}
            className="sp-arena-background"
          />

          <line
            x1={START.x}
            y1="530"
            x2={TARGET.x}
            y2="530"
            className="sp-distance-line"
            markerStart="url(#sp-arrow)"
            markerEnd="url(#sp-arrow)"
          />

          <text
            x={(START.x + TARGET.x) / 2}
            y="521"
            textAnchor="middle"
            className="sp-distance-label"
          >
            d = 100 mm
          </text>

          <circle
            cx={START.x}
            cy={START.y}
            r={ZONE_RADIUS}
            className="sp-zone sp-zone-start"
          />

          <circle
            cx={TARGET.x}
            cy={TARGET.y}
            r={ZONE_RADIUS}
            className="sp-zone sp-zone-target"
          />

          <text
            x={START.x}
            y={START.y - ZONE_RADIUS - 13}
            textAnchor="middle"
            className="sp-zone-label"
          >
            S
          </text>

          <text
            x={TARGET.x}
            y={TARGET.y - ZONE_RADIUS - 13}
            textAnchor="middle"
            className="sp-zone-label"
          >
            T
          </text>

          {obstacles.map((square) => (
            <rect
              key={square.id}
              x={square.cx - square.size / 2}
              y={square.cy - square.size / 2}
              width={square.size}
              height={square.size}
              rx="2"
              className="sp-obstacle"
              transform={`rotate(${
                (square.angle * 180) / Math.PI
              } ${square.cx} ${square.cy})`}
            />
          ))}

          {path.length > 1 && (
            <polyline
              points={pathString}
              className="sp-trace"
            />
          )}

          <circle
            cx={runner.x}
            cy={runner.y}
            r={RUNNER_RADIUS}
            className="sp-runner-halo"
          />

          <circle
            cx={runner.x}
            cy={runner.y}
            r={RUNNER_RADIUS}
            className="sp-runner"
            onPointerDown={beginDrag}
          />
        </svg>
      </div>

      <div className="sp-controls">
        <div className="sp-theorem-note">
          <strong>
            The sharp benchmark is <span className="sp-math">3d/2</span>.
          </strong>
          <span>
            Here <span className="sp-math">d = 100 mm</span>, so the target is
            always <span className="sp-math">150 mm</span>.
          </span>
        </div>

        <div className="sp-buttons">
          <button
            type="button"
            className="sp-reset"
            onClick={resetPath}
          >
            ↻ Reset path
          </button>

          <button
            type="button"
            className="sp-new"
            onClick={newArrangement}
          >
            New arrangement →
          </button>

          <button
            type="button"
            className="sp-extremal"
            onClick={showExtremalArrangement}
          >
            See extremal arrangement
          </button>
        </div>
      </div>
    </section>
  )
}
