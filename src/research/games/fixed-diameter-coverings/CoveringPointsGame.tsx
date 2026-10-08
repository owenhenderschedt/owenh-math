import { useEffect, useMemo, useRef, useState } from 'react'
import type { PointerEvent as ReactPointerEvent } from 'react'
import {
  arrangements,
  findDiameterPair,
  type Point,
} from './arrangements'
import type { OptimalCovering } from './optimalCovering'

type RadiusKey = 'quarter' | 'half' | 'jung'

const BOARD_SIZE = 620
const BOARD_CENTER = BOARD_SIZE / 2
const WORLD_SCALE = 555

const RADII: {
  key: RadiusKey
  label: string
  value: number
}[] = [
  {
    key: 'quarter',
    label: String.raw`r=\frac14`,
    value: 1 / 4,
  },
  {
    key: 'half',
    label: String.raw`r=\frac12`,
    value: 1 / 2,
  },
  {
    key: 'jung',
    label: String.raw`r=\frac1{\sqrt3}`,
    value: 1 / Math.sqrt(3),
  },
]

function RadiusLabel({ kind }: { kind: RadiusKey }) {
  const denominator =
    kind === 'quarter'
      ? '4'
      : kind === 'half'
        ? '2'
        : '√3'

  return (
    <span className="fd-radius-math" aria-label={
      kind === 'quarter'
        ? 'r equals one fourth'
        : kind === 'half'
          ? 'r equals one half'
          : 'r equals one over square root of three'
    }>
      <span className="fd-radius-r">r</span>
      <span className="fd-radius-equals">=</span>
      <span className="fd-radius-fraction">
        <span className="fd-radius-numerator">1</span>
        <span className="fd-radius-denominator">{denominator}</span>
      </span>
    </span>
  )
}

function toSvg(point: Point) {
  return {
    x: BOARD_CENTER + WORLD_SCALE * point.x,
    y: BOARD_CENTER - WORLD_SCALE * point.y,
  }
}

function insideDisk(point: Point, center: Point, radius: number) {
  const dx = point.x - center.x
  const dy = point.y - center.y

  return dx * dx + dy * dy <= radius * radius + 1e-12
}

export default function CoveringPointsGame() {
  const svgRef = useRef<SVGSVGElement | null>(null)
  const optimalWorkerRef = useRef<Worker | null>(null)
  const optimalJobRef = useRef(0)

  useEffect(() => {
    return () => optimalWorkerRef.current?.terminate()
  }, [])

  const [arrangementIndex, setArrangementIndex] = useState(0)

  const [points, setPoints] = useState<Point[]>(
    () => arrangements[0].makePoints(),
  )

  const arrangement = arrangements[arrangementIndex]

  const [radiusKey, setRadiusKey] =
    useState<RadiusKey>('quarter')

  const [hoverCenter, setHoverCenter] =
    useState<Point | null>(null)

  const [castCenter, setCastCenter] =
    useState<Point | null>(null)

  const [castNumber, setCastNumber] = useState(0)
  const [optimal, setOptimal] = useState<OptimalCovering | null>(null)
  const [findingOptimal, setFindingOptimal] = useState(false)
  const [optimalError, setOptimalError] = useState<string | null>(null)
  const [showDiameter, setShowDiameter] = useState(false)

  const radius =
    RADII.find((candidate) => candidate.key === radiusKey) ??
    RADII[0]

  const activeCenter = castCenter ?? hoverCenter

  const captured = useMemo(() => {
    if (!activeCenter) return new Set<number>()

    const result = new Set<number>()

    points.forEach((point, index) => {
      if (insideDisk(point, activeCenter, radius.value)) {
        result.add(index)
      }
    })

    return result
  }, [activeCenter, points, radius.value])

  const castScore = castCenter ? captured.size : null

  const optimalCaptured = useMemo(() => {
    const result = new Set<number>()
    if (!optimal) return result
    points.forEach((point, index) => {
      if (insideDisk(point, optimal.center, radius.value)) result.add(index)
    })
    return result
  }, [optimal, points, radius.value])

  /*
   * The displayed diameter belongs to the CURRENT arrangement.
   * Because every arrangement is normalized to diameter 1,
   * this farthest pair is genuinely a pair of arrangement
   * points at distance exactly 1.
   */
  const diameterPair = useMemo(
    () => findDiameterPair(points),
    [points],
  )

  const diameterLeft = toSvg(diameterPair[0])
  const diameterRight = toSvg(diameterPair[1])

  /*
   * Put the "1" beside the actual diameter segment rather
   * than at the center of the board.
   */
  const diameterDx =
    diameterRight.x - diameterLeft.x

  const diameterDy =
    diameterRight.y - diameterLeft.y

  const diameterSvgLength =
    Math.hypot(diameterDx, diameterDy)

  const diameterMidX =
    (diameterLeft.x + diameterRight.x) / 2

  const diameterMidY =
    (diameterLeft.y + diameterRight.y) / 2

  const diameterLabelOffset = 13

  const diameterLabelX =
    diameterMidX -
    diameterLabelOffset *
      diameterDy / diameterSvgLength

  const diameterLabelY =
    diameterMidY +
    diameterLabelOffset *
      diameterDx / diameterSvgLength

  function pointerToWorld(
    event: ReactPointerEvent<HTMLDivElement>,
  ): Point | null {
    const svg = svgRef.current
    if (!svg) return null

    const rect = svg.getBoundingClientRect()

    const svgX =
      ((event.clientX - rect.left) / rect.width) * BOARD_SIZE

    const svgY =
      ((event.clientY - rect.top) / rect.height) * BOARD_SIZE

    return {
      x: (svgX - BOARD_CENTER) / WORLD_SCALE,
      y: (BOARD_CENTER - svgY) / WORLD_SCALE,
    }
  }

  function handlePointerMove(
    event: ReactPointerEvent<HTMLDivElement>,
  ) {
    if (castCenter) return

    const point = pointerToWorld(event)
    if (!point) return

    setHoverCenter(point)
  }

  function handlePointerLeave() {
    if (!castCenter) {
      setHoverCenter(null)
    }
  }

  function handleCast(
    event: ReactPointerEvent<HTMLDivElement>,
  ) {
    if (castCenter) return

    const point = pointerToWorld(event)
    if (!point) return

    setCastCenter(point)
    setHoverCenter(null)
    setCastNumber((current) => current + 1)
  }

  function clearOptimal() {
    optimalJobRef.current += 1
    optimalWorkerRef.current?.terminate()
    optimalWorkerRef.current = null
    setOptimal(null)
    setFindingOptimal(false)
    setOptimalError(null)
  }

  function showOptimalCovering() {
    if (!castCenter || optimal || findingOptimal) return
    clearOptimal()
    setFindingOptimal(true)

    const job = optimalJobRef.current
    const worker = new Worker(
      new URL('./optimalCoverWorker.ts', import.meta.url),
      { type: 'module' },
    )
    optimalWorkerRef.current = worker

    worker.onmessage = (event: MessageEvent<OptimalCovering | { error: string }>) => {
      if (optimalJobRef.current !== job) return
      setFindingOptimal(false)
      if ('error' in event.data) {
        setOptimalError(event.data.error)
      } else {
        setOptimal(event.data)
      }
      worker.terminate()
      if (optimalWorkerRef.current === worker) optimalWorkerRef.current = null
    }

    worker.onerror = () => {
      if (optimalJobRef.current !== job) return
      setFindingOptimal(false)
      setOptimalError('Could not calculate the optimal covering. Please retry.')
      worker.terminate()
      if (optimalWorkerRef.current === worker) optimalWorkerRef.current = null
    }

    worker.postMessage({ points, radius: radius.value, playerCenter: castCenter })
  }

  function tryAgain() {
    clearOptimal()

    // Every retry on Random Cloud creates a fresh challenge.
    // All other arrangements keep their existing points.
    if (arrangement.id === 'random-cloud') {
      setPoints(arrangement.makePoints())
    }

    setCastCenter(null)
    setHoverCenter(null)
  }

  function loadArrangement(index: number) {
    clearOptimal()
    const count = arrangements.length
    const nextIndex = ((index % count) + count) % count

    setArrangementIndex(nextIndex)
    setPoints(arrangements[nextIndex].makePoints())

    setCastCenter(null)
    setHoverCenter(null)
  }

  function previousArrangement() {
    loadArrangement(arrangementIndex - 1)
  }

  function nextArrangement() {
    loadArrangement(arrangementIndex + 1)
  }

  function changeRadius(next: RadiusKey) {
    clearOptimal()
    setRadiusKey(next)
    setCastCenter(null)
    setHoverCenter(null)
  }

  const diskCenter = activeCenter
    ? toSvg(activeCenter)
    : null


  return (
    <section className="fd-game">
      <div className="fd-top">
        <div className="fd-heading">
          <h1>Covering Points of Fixed Diameter</h1>
        </div>

        <div className="fd-related-paper">
          <span>RELATED PAPER</span>

          <a
            href="https://arxiv.org/abs/2407.03553"
            target="_blank"
            rel="noreferrer"
          >
            Shrinking the Jung radius: Maximizing partial coverage
            of finite point sets
          </a>

          <small>with András Bezdek</small>
        </div>

        <div className="fd-radius-control">
          <span>RADIUS</span>

          <div
            className="fd-radius-buttons"
            aria-label="Choose covering radius"
          >
            {RADII.map((candidate) => (
              <button
                key={candidate.key}
                type="button"
                className={
                  candidate.key === radiusKey ? 'active' : ''
                }
                onClick={() => changeRadius(candidate.key)}
              >
                <RadiusLabel kind={candidate.key} />
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="fd-workspace">
        <section className="fd-board-card">
          <div className="fd-board-heading">
            <div>
              <div
                className="fd-arrangement-carousel"
                aria-label="Point arrangement"
              >
                <button
                  type="button"
                  className="fd-arrangement-arrow"
                  onClick={previousArrangement}
                  aria-label="Previous arrangement"
                >
                  ‹
                </button>

                <span className="fd-arrangement-name">
                  {arrangement.name}
                </span>

                <button
                  type="button"
                  className="fd-arrangement-arrow"
                  onClick={nextArrangement}
                  aria-label="Next arrangement"
                >
                  ›
                </button>
              </div>

              <strong>1000 points · diameter 1</strong>

              <small className="fd-board-instruction">
                {castCenter
                  ? (optimal
                      ? 'Compare both coverings, or try again.'
                      : 'Your circle is fixed. Try again to place another.')
                  : 'Move the circle over the points. Click to cast.'}
              </small>
            </div>

            <button
              type="button"
              className={
                showDiameter
                  ? 'fd-diameter-button active'
                  : 'fd-diameter-button'
              }
              onClick={() => setShowDiameter((current) => !current)}
            >
              {showDiameter ? 'Hide diameter' : 'Show diameter'}
            </button>
          </div>

          <div
            className={
              castCenter
                ? 'fd-board-wrap fd-board-wrap-cast'
                : 'fd-board-wrap'
            }
            onPointerMove={handlePointerMove}
            onPointerLeave={handlePointerLeave}
            onPointerDown={handleCast}
          >
            <svg
              ref={svgRef}
              className={
                castCenter
                  ? 'fd-board fd-board-cast'
                  : 'fd-board'
              }
              viewBox={`0 0 ${BOARD_SIZE} ${BOARD_SIZE}`}
              role="img"
              aria-label="Diameter-one point set"
            >
              <rect
                x="0"
                y="0"
                width={BOARD_SIZE}
                height={BOARD_SIZE}
                className="fd-board-background"
              />

              {showDiameter && (
                <>
                  <line
                    x1={diameterLeft.x}
                    y1={diameterLeft.y}
                    x2={diameterRight.x}
                    y2={diameterRight.y}
                    className="fd-diameter-line"
                  />

                  <text
                    x={diameterLabelX}
                    y={diameterLabelY}
                    textAnchor="middle"
                    className="fd-diameter-label"
                  >
                    1
                  </text>
                </>
              )}

              {diskCenter && (
                <circle
                  cx={diskCenter.x}
                  cy={diskCenter.y}
                  r={WORLD_SCALE * radius.value}
                  className={
                    castCenter
                      ? optimal
                          ? 'fd-cover-disk fd-cover-disk-cast fd-cover-disk-compared'
                          : 'fd-cover-disk fd-cover-disk-cast'
                      : 'fd-cover-disk fd-cover-disk-preview'
                  }
                />
              )}

              {optimal && (
                <circle
                  cx={toSvg(optimal.center).x}
                  cy={toSvg(optimal.center).y}
                  r={WORLD_SCALE * radius.value}
                  className="fd-cover-disk fd-cover-disk-optimal"
                />
              )}

              {castCenter && diskCenter && !optimal && (
                <circle
                  key={castNumber}
                  cx={diskCenter.x}
                  cy={diskCenter.y}
                  r={WORLD_SCALE * radius.value}
                  className="fd-net-cast"
                />
              )}

              <g className="fd-points">
                {points.map((point, index) => {
                  const position = toSvg(point)
                  const isCaptured = captured.has(index)

                  let className = 'fd-point'

                  if (optimal) {
                    const inOptimal = optimalCaptured.has(index)
                    if (isCaptured && inOptimal) {
                      className += ' fd-point-both'
                    } else if (inOptimal) {
                      className += ' fd-point-optimal'
                    } else if (isCaptured) {
                      className += ' fd-point-player-only'
                    } else {
                      className += ' fd-point-muted'
                    }
                  } else if (activeCenter && isCaptured) {
                    className += castCenter
                      ? ' fd-point-captured'
                      : ' fd-point-preview'
                  } else if (castCenter) {
                    className += ' fd-point-muted'
                  }

                  const isQuarterOuter =
                    arrangement.id === 'quarter-extremal' &&
                    index >= 143

                  if (isQuarterOuter) {
                    className += ' fd-point-quarter-outer'
                  }

                  const pointRadius =
                    isQuarterOuter ? 1.35 : 2.25

                  return (
                    <circle
                      key={index}
                      cx={position.x}
                      cy={position.y}
                      r={pointRadius}
                      className={className}
                    />
                  )
                })}
              </g>
            </svg>
          </div>

        </section>

        <aside className="fd-side-card">
          <div className="fd-side-heading">
            <span>YOUR COVERING</span>

            <strong>
              {castScore === null ? '—' : castScore}
            </strong>

            <small>
              {castScore === null
                ? 'Place a disk to reveal your score.'
                : 'of 1000 points covered'}
            </small>
          </div>

          {optimal && (
            <div className="fd-optimal-result" aria-live="polite">
              <span>OPTIMAL COVERING</span>
              <strong>{optimalCaptured.size}</strong>
              <small>of 1000 points covered</small>
            </div>
          )}

          <div className="fd-side-rule">
            <span>SELECTED RADIUS</span>
            <strong>
              <RadiusLabel kind={radius.key} />
            </strong>
          </div>

          <div className="fd-side-copy">
            <p>
              Find a center for the disk that captures as many
              points as possible.
            </p>

            <p>
              Every arrangement in this game has diameter exactly
              <strong> 1</strong>.
            </p>

            {radiusKey === 'jung' && (
              <p className="fd-jung-note">
                <strong>Jung's theorem guarantees</strong> that
                a disk of this radius can always cover
                all <strong>1,000 points.</strong>
              </p>
            )}
          </div>

          {castCenter && (
            <div className="fd-side-actions">
              {!optimal && (
                <button
                  type="button"
                  className="fd-optimal-button"
                  disabled={findingOptimal}
                  onClick={showOptimalCovering}
                >
                  {findingOptimal ? 'Finding optimal covering…' : 'Show optimal covering'}
                </button>
              )}
              {optimalError && (
                <small className="fd-optimal-error" role="alert">
                  {optimalError}
                </small>
              )}
              <button
                type="button"
                className="fd-try-again"
                onClick={tryAgain}
              >
                Try again
              </button>
            </div>
          )}
        </aside>
      </div>
    </section>
  )
}
