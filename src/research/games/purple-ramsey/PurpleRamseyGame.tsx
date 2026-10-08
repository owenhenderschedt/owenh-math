import { useMemo, useState } from 'react'
import { avoidingColoring } from './avoidingColorings'
import {
  CHALLENGES, PATTERNS, findViolation, graphEdges,
  type Challenge, type Colors, type GraphShape, type Tool,
} from './purpleRamseyMath'

type Snapshot = { colors: Colors; history: Colors[]; recent: string | null }
const newBoard = (): Snapshot => ({ colors: {}, history: [], recent: null })
const START_N = 3
const MAX_N = 10
const RED = '#c65355'
const BLUE = '#527ab2'
const VIOLET = '#9257d6'

function MiniGraph({ shape, color }: { shape: GraphShape; color: string }) {
  const pattern = PATTERNS[shape]
  const points = Array.from({ length: pattern.order }, (_, i) => {
    if (shape === 'CLAW') {
      return i === 0 ? { x: 32, y: 29 } : {
        x: 32 + 23 * Math.cos(-Math.PI / 2 + (i - 1) * (2 * Math.PI / 3)),
        y: 29 + 23 * Math.sin(-Math.PI / 2 + (i - 1) * (2 * Math.PI / 3)),
      }
    }
    const theta = -Math.PI / 2 + (i * 2 * Math.PI) / pattern.order
    return { x: 32 + 23 * Math.cos(theta), y: 29 + 23 * Math.sin(theta) }
  })
  return (
    <span className="pr-mini" aria-label={pattern.label}>
      <svg viewBox="0 0 64 58" aria-hidden="true">
        {pattern.edges.map(([a, b], i) => (
          <line key={i} x1={points[a].x} y1={points[a].y} x2={points[b].x} y2={points[b].y}
            stroke={color} strokeWidth="3.2" strokeLinecap="round" />
        ))}
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="4" fill="#fffdf8" stroke={color} strokeWidth="2" />
        ))}
      </svg>
      <small>{pattern.label}</small>
    </span>
  )
}

function PaintIcon({ color }: { color: 'red' | 'blue' }) {
  return (
    <svg width="31" height="31" viewBox="0 0 36 36" aria-hidden="true">
      <g transform="translate(18 17) rotate(-28) translate(-18 -17)">
        <path d="M10 12 L25 12 L29 23 L21 29 L8 21 Z" fill={color === 'red' ? RED : BLUE} stroke="#fff" strokeWidth="1.5" />
        <path d="M13 9 L26 9 L27 14 L12 14 Z" fill="#f9f6ec" stroke="#6d746a" strokeWidth="1.6" />
        <path d="M16 5 L24 5 L25 9 L15 9 Z" fill="#7f897c" />
        <path d="M29 23 Q32 27 29 30 Q26 31 26 28 Z" fill={color === 'red' ? RED : BLUE} />
      </g>
    </svg>
  )
}

function EraserIcon() {
  return (
    <svg width="29" height="29" viewBox="0 0 36 36" aria-hidden="true">
      <g transform="rotate(-35 18 18)">
        <rect x="10" y="7" width="17" height="23" rx="4" fill="#d6bbb1" stroke="#937970" strokeWidth="1.8" />
        <path d="M10 19 H27" stroke="#fff9ef" strokeWidth="2" />
      </g>
    </svg>
  )
}

export default function PurpleRamseyGame() {
  const [challengeIndex, setChallengeIndex] = useState(0)
  const [n, setN] = useState(START_N)
  const [boards, setBoards] = useState<Record<number, Snapshot>>({ [START_N]: newBoard() })
  const [tool, setTool] = useState<Tool>('red')
  const [checkedImpossible, setCheckedImpossible] = useState(false)
  const [notice, setNotice] = useState('')
  const [flash, setFlash] = useState(0)
  const [hovered, setHovered] = useState<string | null>(null)
  const [revealed, setRevealed] = useState(false)

  const challenge: Challenge = CHALLENGES[challengeIndex]
  const board = boards[n] ?? newBoard()
  const edges = useMemo(() => graphEdges(n), [n])
  const editable = edges.filter((e) => !e.wild)
  const count = editable.filter((e) => board.colors[e.id] !== undefined).length
  const allColored = count === editable.length
  const violation = useMemo(
    () => findViolation(n, board.colors, challenge, board.recent),
    [n, board.colors, board.recent, challenge],
  )
  const success = allColored && !violation
  const canReveal = checkedImpossible || count >= Math.min(3, editable.length)
  const highlighted = useMemo(() => new Set(violation?.edges ?? []), [violation])
  const positions = useMemo(() => {
    // Keep the regular n-gon, but rotate it to maximize its square footprint.
    // Then uniformly scale and center its bounding box; no distortion.
    let best: { x: number; y: number }[] = []
    let bestBalance = -1

    for (let trial = 0; trial < 96; trial++) {
      const phase = -Math.PI / 2 + (2 * Math.PI * trial) / (96 * n)
      const candidate = Array.from({ length: n }, (_, i) => {
        const angle = phase + (i * 2 * Math.PI) / n
        return { x: Math.cos(angle), y: Math.sin(angle) }
      })
      const xs = candidate.map((p) => p.x)
      const ys = candidate.map((p) => p.y)
      const width = Math.max(...xs) - Math.min(...xs)
      const height = Math.max(...ys) - Math.min(...ys)
      const balance = Math.min(width, height) / Math.max(width, height)
      if (balance > bestBalance) {
        bestBalance = balance
        best = candidate
      }
    }

    const xs = best.map((p) => p.x)
    const ys = best.map((p) => p.y)
    const minX = Math.min(...xs), maxX = Math.max(...xs)
    const minY = Math.min(...ys), maxY = Math.max(...ys)
    const scale = 502 / Math.max(maxX - minX, maxY - minY)
    const midX = (minX + maxX) / 2
    const midY = (minY + maxY) / 2

    return best.map((p) => ({
      x: 280 + (p.x - midX) * scale,
      y: 280 + (p.y - midY) * scale,
    }))
  }, [n])

  function updateBoard(colors: Colors, previous: Snapshot, recent: string | null, keepHistory = false) {
    setBoards((current) => ({
      ...current,
      [n]: {
        colors,
        history: keepHistory ? previous.history : [...previous.history, previous.colors],
        recent,
      },
    }))
  }

  function editEdge(id: string) {
    const [a, b] = id.split('-').map(Number)
    if (Math.min(a, b) % 2 === 0 && Math.abs(a - b) === 1) return
    const before = board.colors[id]
    const after = tool === 'erase' ? undefined : tool
    if (after === before) return
    const next = { ...board.colors }
    if (after) next[id] = after
    else delete next[id]
    updateBoard(next, board, id)
    const found = findViolation(n, next, challenge, id)
    if (found) setFlash((x) => x + 1)
    setNotice('')
    setCheckedImpossible(false)
    setRevealed(false)
  }

  function changeN(next: number) {
    if (next < START_N || next > MAX_N) return
    setBoards((current) => {
      if (current[next]) return current
      // Each graph size starts fresh on its first visit.
      // Previously visited graph sizes retain their own colorings.
      return { ...current, [next]: newBoard() }
    })
    setN(next)
    setNotice('')
    setCheckedImpossible(false)
    setRevealed(false)
    setHovered(null)
  }

  function changeChallenge(index: number) {
    if (index === challengeIndex) return
    setChallengeIndex(index)
    setN(START_N)
    setBoards({ [START_N]: newBoard() })
    setTool('red')
    setNotice('')
    setCheckedImpossible(false)
    setRevealed(false)
    setHovered(null)
  }

  function undo() {
    if (!board.history.length) return
    const previous = board.history[board.history.length - 1]
    setBoards((current) => ({ ...current, [n]: {
      colors: previous,
      history: board.history.slice(0, -1),
      recent: null,
    } }))
    setNotice('')
    setCheckedImpossible(false)
    setRevealed(false)
  }

  function resetCurrent() {
    setBoards((current) => ({ ...current, [n]: newBoard() }))
    setNotice('')
    setCheckedImpossible(false)
    setRevealed(false)
  }

  function resetAll() {
    setBoards({ [START_N]: newBoard() })
    setN(START_N)
    setNotice('')
    setCheckedImpossible(false)
    setRevealed(false)
  }

  function claimImpossible() {
    setCheckedImpossible(true)
    setRevealed(false)
    if (n < challenge.threshold) {
      setNotice(`Not quite — an avoiding coloring of K${n} exists. Can you find it?`)
    } else if (n === challenge.threshold) {
      setNotice(`Exactly right! K${n} is the smallest impossible graph for this pair. You've found its purple Ramsey number!`)
    } else {
      setNotice(`You're right: no avoiding coloring of K${n} exists. Could you make the same claim for a smaller graph?`)
    }
  }

  function revealColoring() {
    const witness = avoidingColoring(challenge.id, n)
    if (!witness) {
      setNotice(`No avoiding coloring of K${n} exists for this pair. Try a smaller graph.`)
      setCheckedImpossible(true)
      return
    }
    setBoards((current) => ({ ...current, [n]: { colors: witness, history: [], recent: null } }))
    setNotice(`Here is one avoiding coloring of K${n}. It's now yours to edit or extend.`)
    setCheckedImpossible(false)
    setRevealed(true)
  }

  const alertText = notice || (violation
    ? `Forbidden ${violation.color} ${violation.label} found — change an edge to repair it.`
    : success
      ? `Success! You've found an avoiding coloring of K${n}. ${n < MAX_N ? `Can you extend it to K${n + 1}?` : 'Nicely done!'}`
      : 'Paint the edges red or blue. Purple edges count as both colors.')

  return (
    <section className="pr-game">
      <header className="pr-top">
        <div className="pr-heading">
          <p className="pr-eyebrow">AN INTERACTIVE RAMSEY CHALLENGE</p>
          <h1>Purple Ramsey</h1>
        </div>
        <div className="pr-related">
          <span>RELATED PAPER</span>
          <strong>Purple maximum matching Ramsey numbers</strong>
          <small>Research manuscript in preparation</small>
        </div>
        
      </header>

      <div className="pr-workspace">
        <aside className="pr-challenge-column">
          <div className="pr-challenge-heading">
        <span>CHOOSE THE GRAPHS TO AVOID</span>
        
      </div>
      <div className="pr-challenge-rail" aria-label="Select forbidden graph pair">
        {CHALLENGES.map((item, index) => (
          <button key={item.id} type="button" className={`pr-challenge ${challengeIndex === index ? 'active' : ''}`}
            aria-pressed={challengeIndex === index} onClick={() => changeChallenge(index)}>
            <span className="pr-challenge-number">{index + 1}.</span>
            <span className="pr-mini-pair">
              <MiniGraph shape={item.red} color={RED} />
              <span className="pr-versus">/</span>
              <MiniGraph shape={item.blue} color={BLUE} />
            </span>
          </button>
        ))}
      </div>

        </aside>
        <section className="pr-board-card">
          <div className="pr-board-header">
            <div className="pr-order-control" aria-label="Complete graph size">
              <button type="button" onClick={() => changeN(n - 1)} disabled={n <= START_N} aria-label="Previous complete graph">‹</button>
              <span>K<sub>{n}</sub></span>
              <button type="button" onClick={() => changeN(n + 1)} disabled={n >= MAX_N} aria-label="Next complete graph">›</button>
            </div>
            <span className="pr-progress">{count} / {editable.length} colored</span>
          </div>
          <div className={`pr-message ${notice ? 'message' : violation ? 'bad' : success ? 'good' : ''}`} role="status" aria-live="polite">
            {violation && !notice && <span className="pr-alert-dot" />}
            {alertText}
          </div>
          <div className="pr-graph-stage" key={`layout-${n}`}>
            <div className="pr-graph-wrap">
            <svg key={`flash-${flash}`} className={`pr-graph ${violation && flash > 0 ? 'pr-graph-shake' : ''}`}
              viewBox="0 0 560 560" data-density={n <= 4 ? 'sparse' : n <= 7 ? 'medium' : 'dense'} role="img" aria-label={`Complete graph on ${n} vertices, with a fixed purple matching`}>
              <defs>
                <filter id="pr-purple-glow" x="-100%" y="-100%" width="300%" height="300%">
                  <feGaussianBlur stdDeviation="4" />
                </filter>
              </defs>
              {edges.filter((e) => !e.wild).map((edge) => {
                const a = positions[edge.a], b = positions[edge.b]
                const paint = board.colors[edge.id]
                const selected = highlighted.has(edge.id)
                return (
                  <g key={edge.id} className={violation && !selected ? 'pr-edge-dim' : ''}>
                    {selected && <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} className="pr-violation-halo" />}
                    <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={paint === 'red' ? RED : paint === 'blue' ? BLUE : '#b7c0ba'}
                      className={`pr-visible-edge ${selected ? 'pr-offending-edge' : ''} ${hovered === edge.id ? 'hovered' : ''}`} />
                  </g>
                )
              })}
              {edges.filter((e) => e.wild).map((edge) => {
                const a = positions[edge.a], b = positions[edge.b]
                const selected = highlighted.has(edge.id)
                return (
                  <g key={edge.id}>
                    <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={VIOLET} className="pr-wild-glow" opacity=".25" filter="url(#pr-purple-glow)" />
                    {selected && <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} className="pr-violation-halo" />}
                    <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={VIOLET} className={`pr-wild-edge ${selected ? 'pr-wild-offending' : ''}`} />
                  </g>
                )
              })}
              {edges.filter((e) => !e.wild).map((edge) => {
                const a = positions[edge.a], b = positions[edge.b]
                return (
                  <line key={`hit-${edge.id}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                    className="pr-edge-hit" onPointerEnter={() => setHovered(edge.id)} onPointerLeave={() => setHovered(null)}
                    onClick={() => editEdge(edge.id)} role="button" aria-label={`Paint edge ${edge.a + 1} to ${edge.b + 1}`} />
                )
              })}
              {positions.map((p, i) => (
                <g key={i} className="pr-vertex">
                  <circle cx={p.x} cy={p.y} r="17.5" />
                  
                </g>
              ))}
            </svg>
            </div>
            <aside className="pr-graph-dock" aria-label="Paint edges">
              <div className="pr-tools" role="group" aria-label="Choose paint tool">
                {(['red', 'blue', 'erase'] as const).map((choice) => (
                  <button key={choice} type="button" onClick={() => setTool(choice)}
                    className={`pr-tool ${choice} ${tool === choice ? 'active' : ''}`}
                    aria-pressed={tool === choice}
                    title={choice === 'erase' ? 'Erase' : `Paint ${choice}`}>
                    {choice === 'erase' ? <EraserIcon /> : <PaintIcon color={choice} />}
                    <span>{choice === 'erase' ? 'Erase' : choice === 'red' ? 'Red' : 'Blue'}</span>
                  </button>
                ))}
              </div>
              <button className="pr-dock-undo" type="button" onClick={undo}
                disabled={!board.history.length} title="Undo last edge change">
                ↶ Undo
              </button>
            </aside>
          </div>
          <div className="pr-board-footer">
            <span><i className="pr-purple-key" /> Purple edges are wild: they count as red <em>and</em> blue.</span>
            
          </div>
        </section>

        <aside className="pr-side-card">
          <div className="pr-goal">
            <span className="pr-side-kicker">YOUR CHALLENGE</span>
            <p>Avoid both of these subgraphs.</p>
            <div className="pr-goal-graphs">
              <div><MiniGraph shape={challenge.red} color={RED} /><small>RED</small></div>
              <div><MiniGraph shape={challenge.blue} color={BLUE} /><small>BLUE</small></div>
            </div>
          </div>
          <div className="pr-edit-actions">
            <button type="button" onClick={resetCurrent}>↻ Reset this K<sub>{n}</sub></button>
            <button type="button" onClick={resetAll}>Reset all</button>
          </div>
          <div className="pr-investigate">
            
            
            <button type="button" className="pr-impossible" onClick={claimImpossible}>I don't think it's possible</button>
            {canReveal && (
              <button type="button" className="pr-reveal" onClick={revealColoring}>
                Reveal avoiding coloring <span>↗</span>
              </button>
            )}
            {revealed && <small className="pr-reveal-note">This construction has replaced your previous coloring.</small>}
          </div>
        </aside>
      </div>
    </section>
  )
}
