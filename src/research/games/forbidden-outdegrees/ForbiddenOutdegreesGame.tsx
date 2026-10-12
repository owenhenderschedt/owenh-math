import { useEffect, useMemo, useRef, useState } from 'react'
import type { CSSProperties, PointerEvent as ReactPointerEvent } from 'react'
import { newLists, newPuzzle, outdegrees, solved, EDGE_COUNT, type Edge, type Puzzle } from './orientationMath'
import './ForbiddenOutdegreesGame.css'

type Difficulty = 1 | 2 | 3
type Flash = { id: number; amount: 1 | -1 }
type Flying = { edge: number; source: number; id: number }
type Point = { x: number; y: number }

// The graph and its label anchors are generated together as a planar layout.
const BOARD_W = 1600
const BOARD_H = 820
const VERTEX_R = 33
// OOM source buttons and locked arrowheads always sit this many SVG units
// from the vertex center, regardless of the length of the edge.
const SOURCE_OFFSET = 139.5
const COMET_MS = 475
const DELTA_MS = 860
const SUCCESS_COLORS = ['#4d9967', '#76bf88', '#9dd8a3', '#bee6bb', '#65ad83', '#d4edc9']

function distanceToSegment(p: Point, a: Point, b: Point): number {
  const dx = b.x - a.x, dy = b.y - a.y
  const ratio = Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.y - a.y) * dy) / (dx * dx + dy * dy)))
  return Math.hypot(p.x - (a.x + ratio * dx), p.y - (a.y + ratio * dy))
}
function interpolate(a: Point, b: Point, t: number): Point {
  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t }
}
function sourceAnchor(a: Point, b: Point): Point {
  const distance = Math.hypot(a.x - b.x, a.y - b.y)
  // The shortest edge is 339 units; two 27-unit targets remain separate
  // even with both sources 139.5 SVG units from their vertices.
  return interpolate(a, b, SOURCE_OFFSET / distance)
}
function arrowhead(a: Point, b: Point) {
  const p = sourceAnchor(a, b)
  const degrees = Math.atan2(b.y - a.y, b.x - a.x) * 180 / Math.PI
  return `translate(${p.x} ${p.y}) rotate(${degrees})`
}
function pointFromEvent(svg: SVGSVGElement, event: ReactPointerEvent<SVGSVGElement>): Point | null {
  const matrix = svg.getScreenCTM()
  if (!matrix) return null
  const local = svg.createSVGPoint()
  local.x = event.clientX
  local.y = event.clientY
  const p = local.matrixTransform(matrix.inverse())
  return { x: p.x, y: p.y }
}

export default function ForbiddenOutdegreesGame() {
  const [difficulty, setDifficulty] = useState<Difficulty>(1)
  const [puzzle, setPuzzle] = useState<Puzzle>(() => newPuzzle(1))
  const [sources, setSources] = useState<(number | null)[]>(() => Array(EDGE_COUNT).fill(null))
  const [hovered, setHovered] = useState<number | null>(null)
  const [flash, setFlash] = useState<Record<number, Flash>>({})
  const [flight, setFlight] = useState<Flying | null>(null)
  const [flightProgress, setFlightProgress] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [won, setWon] = useState(false)
  const [celebrating, setCelebrating] = useState(false)
  const [celebrationRound, setCelebrationRound] = useState(0)
  const svgRef = useRef<SVGSVGElement | null>(null)
  const flashTimers = useRef<Record<number, ReturnType<typeof setTimeout>>>({})
  const celebrationTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const flightSequence = useRef(0)
  const celebrated = useRef(false)

  const positions = puzzle.positions
  const listPositions = puzzle.listPositions
  const degrees = useMemo(() => outdegrees(puzzle.edges, sources), [puzzle.edges, sources])
  const completeCount = sources.filter(s => s !== null).length
  const isSolved = useMemo(() => solved(puzzle, sources), [puzzle, sources])
  const isVictory = isSolved && (won || revealed)
  const currentHover = hovered === null ? null : puzzle.edges[hovered]

  useEffect(() => {
    if (!flight) return
    const stamp = performance.now()
    let frame = 0
    const animate = (now: number) => {
      const t = Math.min(1, (now - stamp) / COMET_MS)
      setFlightProgress(1 - Math.pow(1 - t, 1.55))
      if (t < 1) frame = requestAnimationFrame(animate)
      else setFlight(null)
    }
    frame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frame)
  }, [flight])

  useEffect(() => () => {
    Object.values(flashTimers.current).forEach(clearTimeout)
    if (celebrationTimer.current) clearTimeout(celebrationTimer.current)
  }, [])

  function clearAnimations() {
    Object.values(flashTimers.current).forEach(clearTimeout)
    flashTimers.current = {}
    setFlash({})
    flightSequence.current++
    setFlight(null)
    setFlightProgress(0)
    if (celebrationTimer.current) clearTimeout(celebrationTimer.current)
    setCelebrating(false)
  }
  function freshBoard(next: Puzzle, nextDifficulty = difficulty) {
    clearAnimations()
    setDifficulty(nextDifficulty)
    setPuzzle(next)
    setSources(Array(next.edges.length).fill(null))
    setHovered(null)
    setRevealed(false)
    setWon(false)
    celebrated.current = false
  }
  function changeDifficulty(next: Difficulty) {
    if (next === difficulty) return
    freshBoard({ ...puzzle, ...newLists(puzzle.edges, next) }, next)
  }
  function rerollLists() {
    freshBoard({ ...puzzle, ...newLists(puzzle.edges, difficulty) })
  }
  function rerollGraph() {
    freshBoard(newPuzzle(difficulty))
  }
  function reset() { freshBoard(puzzle) }
  function launchCelebration() {
    if (celebrationTimer.current) clearTimeout(celebrationTimer.current)
    celebrated.current = true
    setCelebrationRound(round => round + 1)
    setCelebrating(true)
    celebrationTimer.current = setTimeout(() => setCelebrating(false), 3400)
  }
  function showSolution() {
    clearAnimations()
    setSources([...puzzle.witness])
    setRevealed(true)
    setWon(false)
    setHovered(null)
    launchCelebration()
  }
  function degreeFlash(vertex: number, amount: 1 | -1) {
    clearTimeout(flashTimers.current[vertex])
    const id = Date.now() + Math.random()
    setFlash(previous => ({ ...previous, [vertex]: { id, amount } }))
    flashTimers.current[vertex] = setTimeout(() => {
      setFlash(previous => {
        if (previous[vertex]?.id !== id) return previous
        const next = { ...previous }
        delete next[vertex]
        return next
      })
    }, DELTA_MS)
  }
  function orient(edge: Edge, source: number) {
    const previousSource = sources[edge.id]
    if (previousSource === source) return
    const next = [...sources]
    next[edge.id] = source
    setSources(next)
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!reduced) {
      degreeFlash(source, 1)
      if (previousSource !== null) degreeFlash(previousSource, -1)
      setFlight({ edge: edge.id, source, id: ++flightSequence.current })
      setFlightProgress(0)
    }
    const wonNow = solved(puzzle, next)
    setWon(wonNow && !revealed)
    if (wonNow && !celebrated.current) launchCelebration()
    if (!wonNow) {
      celebrated.current = false
      if (celebrationTimer.current) clearTimeout(celebrationTimer.current)
      setCelebrating(false)
    }
  }

  function nearestEdge(p: Point): number | null {
    // Keep the active button stable even when it overlaps a vertex's larger
    // proximity zone or a crossing edge. This preserves the locked OOM hover.
    if (currentHover) {
      const a = positions[currentHover.u], b = positions[currentHover.v]
      for (const button of [sourceAnchor(a, b), sourceAnchor(b, a)]) {
        if (Math.hypot(p.x - button.x, p.y - button.y) < 33) return currentHover.id
      }
    }
    if (positions.some(pos => Math.hypot(pos.x - p.x, pos.y - p.y) < VERTEX_R + 11)) return null
    let closest = 23
    let id: number | null = null
    for (const edge of puzzle.edges) {
      const dist = distanceToSegment(p, positions[edge.u], positions[edge.v])
      if (dist < closest) { id = edge.id; closest = dist }
    }
    return id
  }
  function onPointerMove(event: ReactPointerEvent<SVGSVGElement>) {
    if (event.pointerType === 'touch') return
    const svg = svgRef.current
    if (!svg) return
    const p = pointFromEvent(svg, event)
    if (p) setHovered(nearestEdge(p))
  }
  function onPointerDown(event: ReactPointerEvent<SVGSVGElement>) {
    if (event.pointerType !== 'touch') return
    const svg = svgRef.current
    if (!svg) return
    const p = pointFromEvent(svg, event)
    if (p) setHovered(nearestEdge(p))
  }

  const flyEdge = flight ? puzzle.edges[flight.edge] : null
  const flyStart = flight && flyEdge ? positions[flight.source] : null
  const flyEnd = flight && flyEdge ? positions[flyEdge.u === flight.source ? flyEdge.v : flyEdge.u] : null
  const cometStart = flyStart && flyEnd ? interpolate(flyStart, flyEnd, VERTEX_R / Math.hypot(flyStart.x - flyEnd.x, flyStart.y - flyEnd.y)) : null
  const cometEnd = flyStart && flyEnd ? interpolate(flyEnd, flyStart, VERTEX_R / Math.hypot(flyStart.x - flyEnd.x, flyStart.y - flyEnd.y)) : null
  const cometHead = cometStart && cometEnd ? interpolate(cometStart, cometEnd, flightProgress) : null
  const cometTail = cometStart && cometEnd ? interpolate(cometStart, cometHead ?? cometStart,
    Math.max(0, 1 - 84 / Math.max(1, Math.hypot((cometHead?.x ?? cometStart.x) - cometStart.x, (cometHead?.y ?? cometStart.y) - cometStart.y)))) : null

  return (
    <section className="fo-game">
      <header className="fo-top">
        <div className="fo-title"><span>AN INTERACTIVE GRAPH ORIENTATION CHALLENGE</span><h1>Forbidden Outdegrees</h1></div>
        <div className="fo-header-related">
          <div className="fo-related-paper">
            <span>RELATED PAPER</span>
            <a href="https://doi.org/10.1016/j.dam.2026.02.048" target="_blank" rel="noreferrer">
              On orientations with forbidden out-degrees
            </a>
            <small>with Jessica McDonald</small>
          </div>
          <a className="fo-website-link" href="https://f-avoiding.owenh-math.com" target="_blank" rel="noreferrer">
            F-avoiding website <span aria-hidden="true">↗</span>
          </a>
        </div>
        <div className="fo-meta"><span className="fo-kicker">THE CHALLENGE</span><p>Direct every edge. Keep each vertex's outdegree off its forbidden list.</p></div>
        <div className="fo-progress" aria-live="polite"><strong>{completeCount} / {EDGE_COUNT}</strong><span>EDGES ORIENTED</span></div>
      </header>
      <div className="fo-workspace">
        <div className={`fo-board ${hovered !== null ? 'fo-board-focusing' : ''} ${isVictory ? 'fo-board-won' : ''}`}>
          <div className="fo-board-top"><span>{won && isSolved ? 'Beautifully done. Every outdegree is allowed!' : 'Hover over an edge, then choose which vertex sends it outward.'}</span><span>4-REGULAR · 8 VERTICES</span></div>
          <svg ref={svgRef} viewBox={`0 0 ${BOARD_W} ${BOARD_H}`} preserveAspectRatio="xMidYMid meet" role="group" aria-label="planar 4-regular graph on eight vertices with outdegree counts and forbidden lists. Hover an edge to show two direction choices."
            onPointerMove={onPointerMove} onPointerLeave={() => setHovered(null)} onPointerDown={onPointerDown}>
            <rect x="0" y="0" width={BOARD_W} height={BOARD_H} fill="transparent" pointerEvents="all" />
            <g className="fo-edges">
              {puzzle.edges.map(edge => {
                const a = positions[edge.u], b = positions[edge.v]
                return <line key={edge.id} className={`fo-edge ${sources[edge.id] !== null ? 'is-directed' : ''} ${hovered === edge.id ? 'is-hovered' : ''}`}
                  x1={a.x} y1={a.y} x2={b.x} y2={b.y} />
              })}
            </g>
            {currentHover && <line className={`fo-focused-edge ${sources[currentHover.id] !== null ? 'is-directed' : ''}`}
              x1={positions[currentHover.u].x} y1={positions[currentHover.u].y}
              x2={positions[currentHover.v].x} y2={positions[currentHover.v].y} />}
            {puzzle.edges.map(edge => {
              const src = sources[edge.id]
              if (src === null) return null
              const a = positions[src], b = positions[src === edge.u ? edge.v : edge.u]
              const edgeLength = Math.hypot(a.x - b.x, a.y - b.y)
              const lockProgress = (SOURCE_OFFSET - VERTEX_R) / (edgeLength - 2 * VERTEX_R)
              const visible = !flight || flight.edge !== edge.id || flightProgress >= lockProgress
              return <g key={edge.id} className={`fo-locked-arrow ${visible ? 'visible' : ''} ${hovered === edge.id ? 'is-hovered' : ''}`} transform={arrowhead(a, b)}>
                <polygon points="23,0 -17,-19 -17,19" />
              </g>
            })}
            {cometHead && cometTail && <g className="fo-comet">
              <line x1={cometTail.x} y1={cometTail.y} x2={cometHead.x} y2={cometHead.y} />
              <circle cx={cometHead.x} cy={cometHead.y} r="9" />
              <circle className="fo-comet-glint" cx={cometHead.x - 2} cy={cometHead.y - 2} r="3.1" />
            </g>}
            {puzzle.order.map(vertex => {
              const p = positions[vertex]
              return <g key={vertex} className="fo-vertex" transform={`translate(${p.x} ${p.y})`}>
                <circle r={VERTEX_R} />
                {flash[vertex] ? <text key={flash[vertex].id} className={`fo-delta ${flash[vertex].amount > 0 ? 'plus' : 'minus'}`} y="2">{flash[vertex].amount > 0 ? '+1' : '−1'}</text> :
                  <text className={`fo-degree ${puzzle.forbidden[vertex].includes(degrees[vertex]) && !isVictory ? 'invalid' : ''}`} y="2">{degrees[vertex]}</text>}
              </g>
            })}
            {currentHover && [currentHover.u, currentHover.v].map(vertex => {
              if (sources[currentHover.id] === vertex) return null
              const from = positions[vertex], to = positions[vertex === currentHover.u ? currentHover.v : currentHover.u]
              const p = sourceAnchor(from, to)
              const angle = Math.atan2(to.y - from.y, to.x - from.x) * 180 / Math.PI
              return <g key={`${currentHover.id}-${vertex}`} className="fo-choice" transform={`translate(${p.x} ${p.y})`} role="button" tabIndex={0}
                aria-label={`Give the vertex at this end one outgoing edge`}
                onClick={event => { event.stopPropagation(); orient(currentHover, vertex) }}
                onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); orient(currentHover, vertex) } }}>
                <circle className="fo-choice-disc" r="20" />
                <g transform={`rotate(${angle})`}><path className="fo-choice-chevron" d="M-6 -8 L7 0 L-6 8" /></g>
                <circle className="fo-choice-hit" r="27" />
              </g>
            })}
            {puzzle.order.map((vertex, order) => {
              const pos = listPositions[vertex]
              const forbidden = puzzle.forbidden[vertex]
              const badValue = forbidden.includes(degrees[vertex]) && !isVictory ? degrees[vertex] : null
              const step = 40
              const braceX = forbidden.length * step / 2 + 16
              const listWidth = 2 * (braceX + 9)
              return <g key={`list-${vertex}-${celebrationRound}`} className={`fo-forbidden ${isVictory ? 'solved' : ''} ${celebrating ? 'celebrating' : ''}`} style={{ '--fo-delay': `${order * 44}ms` } as CSSProperties} transform={`translate(${pos.x} ${pos.y})`}>
                <rect x={-listWidth / 2} y="-36" width={listWidth} height="64" rx="11" />
                <text className="fo-list-brace" x={-braceX} y="5">{'{'}</text>
                {forbidden.map((value, i) => {
                  const x = (i - (forbidden.length - 1) / 2) * step
                  const bad = badValue === value
                  return <g key={value} className={`fo-list-item ${bad ? 'bad' : ''}`}>
                    {bad && <text className="fo-list-x" x={x} y="-20">×</text>}
                    <text className="fo-list-number" x={x} y="5">{value}</text>
                  </g>
                })}
                <text className="fo-list-brace" x={braceX} y="5">{'}'}</text>
              </g>
            })}
          </svg>
          {celebrating && <div key={celebrationRound} className="fo-confetti" aria-hidden="true">
            {Array.from({ length: 58 }, (_, i) => <span key={i} style={{
              '--x': `${(i * 71 + (i % 7) * 11) % 100}%`,
              '--delay': `${(i % 13) * 77}ms`,
              '--duration': `${1.6 + (i % 6) * .23}s`,
              '--twist': `${(i % 2 === 0 ? 1 : -1) * (220 + (i % 6) * 65)}deg`,
              background: SUCCESS_COLORS[i % SUCCESS_COLORS.length],
            } as CSSProperties} />)}
          </div>}
        </div>
        <aside className="fo-sidebar">
          <div className="fo-panel fo-difficulty"><span className="fo-panel-label">DIFFICULTY</span>
            <div className="fo-options">{([{ label: 'Easy', value: 1 }, { label: 'Medium', value: 2 }, { label: 'Hard', value: 3 }] as const).map(item =>
              <button key={item.value} type="button" className={difficulty === item.value ? 'active' : ''} aria-pressed={difficulty === item.value} onClick={() => changeDifficulty(item.value)}>
                <strong>{item.label}</strong><small>{item.value} forbidden</small>
              </button>)}</div>
          </div>
          <div className="fo-panel fo-actions"><span className="fo-panel-label">YOUR PUZZLE</span>
            <button type="button" className="fo-primary" onClick={rerollLists}>New forbidden lists <span aria-hidden="true">↻</span></button>
            <button type="button" onClick={rerollGraph}>New graph <span aria-hidden="true">↗</span></button>
            <button type="button" onClick={reset}>Reset orientations <span aria-hidden="true">↶</span></button>
            <button type="button" className="fo-reveal" onClick={showSolution}>Reveal solution <span aria-hidden="true">→</span></button>
            {won && isSolved && <p className="fo-success-note" role="status">You found an F-avoiding orientation!</p>}
          </div>
        </aside>
      </div>
    </section>
  )
}
