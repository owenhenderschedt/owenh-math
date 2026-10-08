import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

type GameId =
  | 'total-coloring'
  | 'odd-ramsey'
  | 'short-path-algorithms'
  | 'fixed-diameter-coverings'
  | 'purple-ramsey'

type Guide = {
  title: string
  kicker: string
  imageTitle: string
  imageCaption: string
  steps: readonly { title: string; description: string }[]
  takeaway: string
}

const GUIDES: Record<GameId, Guide> = {
  'total-coloring': {
    title: 'Total Coloring',
    kicker: 'Give nearby objects different colors.',
    imageTitle: 'Vertices and edges both receive colors',
    imageCaption: 'Choose an object, then choose its color.',
    steps: [
      { title: 'Select a vertex or an edge', description: 'Click directly on the graph to open its color palette.' },
      { title: 'Avoid conflicts', description: 'Adjacent vertices, incident edges, and edges meeting at a vertex must have different colors.' },
      { title: 'Try to use fewer colors', description: 'Watch the color counter, reset your coloring, or generate a new graph.' },
    ],
    takeaway: 'The challenge is to properly color everything using as few colors as possible.',
  },
  'odd-ramsey': {
    title: 'Odd Ramsey',
    kicker: 'Explore colorful copies of a small square.',
    imageTitle: 'Focus on the four edges of a square',
    imageCaption: 'Each little square uses two vertices from each side.',
    steps: [
      { title: 'Color the large graph', description: 'Click an edge of K₄,₄ and choose a color from the pop-up palette.' },
      { title: 'Study the 36 smaller graphs', description: 'The panel on the right shows every choice of two vertices from each side.' },
      { title: 'Check your coloring', description: 'An acceptable square has some color appearing an odd number of times. Use Check my coloring to inspect your work.' },
    ],
    takeaway: 'Can you make all 36 copies satisfy the odd-color condition?',
  },
  'short-path-algorithms': {
    title: 'Short Path Algorithms',
    kicker: 'Navigate a forest of square obstacles.',
    imageTitle: 'Draw a route without touching any square',
    imageCaption: 'Your path and the research algorithm can be compared.',
    steps: [
      { title: 'Drag from S toward T', description: 'Hold the point and move it through the gaps. Obstacles cannot be crossed.' },
      { title: 'Watch your path length', description: 'Try to reach the target while keeping your path below 150 mm.' },
      { title: 'Race our algorithm', description: 'After reaching T, reveal the algorithm’s route and compare its length with yours.' },
    ],
    takeaway: 'Try New arrangement, or challenge the specially designed extremal arrangement.',
  },
  'fixed-diameter-coverings': {
    title: 'Covering Points',
    kicker: 'Catch as many points as you can with one disk.',
    imageTitle: 'Move the disk, then cast it',
    imageCaption: 'The highlighted points are the ones inside the disk.',
    steps: [
      { title: 'Choose your radius', description: 'Select ¼, ½, or 1/√3 using the radius controls.' },
      { title: 'Cast your covering', description: 'Move the disk over the point arrangement, then click once to lock in your attempt.' },
      { title: 'Compare with the best', description: 'Reveal an optimal covering after your cast. Both disks and their scores remain visible.' },
    ],
    takeaway: 'Every arrangement has 1,000 points and diameter exactly 1.',
  },
  'purple-ramsey': {
    title: 'Purple Ramsey',
    kicker: 'Can you avoid two forbidden graphs?',
    imageTitle: 'Purple matching edges count as two colors',
    imageCaption: 'The violet edges are permanently both red and blue.',
    steps: [
      { title: 'Pick a pair and a graph size', description: 'Choose the red and blue graphs to avoid, then use the arrows to move between K₃ and K₁₀.' },
      { title: 'Paint the remaining edges', description: 'Select the red bucket, blue bucket, or eraser; click edges to paint. Undo reverses a move.' },
      { title: 'Test your conjecture', description: 'A forbidden graph lights up when it appears. Try claiming impossibility, or reveal an avoiding coloring if one exists.' },
    ],
    takeaway: 'Each Kₙ remembers your work, but a new graph size begins with a fresh coloring.',
  },
}

const RED = '#bc615d'
const BLUE = '#527eac'
const GREEN = '#608b6b'
const GOLD = '#c29a56'
const PURPLE = '#965bd5'

function TutorialPicture({ gameId }: { gameId: GameId }) {
  if (gameId === 'total-coloring') {
    return (
      <svg viewBox="0 0 400 300" role="img" aria-label="Illustration of colored edges and vertices">
        <path d="M96 225 L200 54 L310 225 Z" fill="none" stroke="#d6dfd5" strokeWidth="9" strokeLinecap="round" />
        <path className="gi-draw-line" d="M96 225 L200 54" fill="none" stroke={BLUE} strokeWidth="10" strokeLinecap="round" />
        <path className="gi-draw-line gi-delay" d="M200 54 L310 225" fill="none" stroke={GOLD} strokeWidth="10" strokeLinecap="round" />
        <circle cx="96" cy="225" r="17" fill={GREEN} stroke="#fff" strokeWidth="5" />
        <circle cx="200" cy="54" r="17" fill={RED} stroke="#fff" strokeWidth="5" />
        <circle cx="310" cy="225" r="17" fill={PURPLE} stroke="#fff" strokeWidth="5" />
        <circle cx="96" cy="225" r="27" fill="none" stroke={GREEN} strokeWidth="2" opacity=".3" className="gi-pulse" />
        <g transform="translate(151 118)">
          <rect width="101" height="31" rx="15" fill="#fffefa" stroke="#dfe3d8" />
          {[RED, BLUE, GOLD, GREEN].map((color, i) => (
            <circle key={color} cx={17 + i * 22} cy="15" r="7" fill={color} />
          ))}
        </g>
      </svg>
    )
  }

  if (gameId === 'odd-ramsey') {
    return (
      <svg viewBox="0 0 400 300" role="img" aria-label="An illustrated four-cycle in a bipartite graph">
        <path d="M105 79 L298 79 L298 219 L105 219 Z" fill="none" stroke="#d4c8b8" strokeWidth="1.4" strokeDasharray="5 7" />
        <g className="gi-pulse">
          <path d="M105 79 L298 79" stroke={RED} strokeWidth="7" strokeLinecap="round" />
          <path d="M105 79 L298 219" stroke={BLUE} strokeWidth="7" strokeLinecap="round" />
          <path d="M105 219 L298 79" stroke={GREEN} strokeWidth="7" strokeLinecap="round" />
          <path d="M105 219 L298 219" stroke={RED} strokeWidth="7" strokeLinecap="round" />
        </g>
        {[79, 219].map((y) => (
          <g key={y}>
            <circle cx="105" cy={y} r="17" fill="#dbc181" stroke="#fff" strokeWidth="4" />
            <circle cx="298" cy={y} r="17" fill="#bbc6d5" stroke="#fff" strokeWidth="4" />
          </g>
        ))}
        <rect x="138" y="131" width="125" height="37" rx="18" fill="#fffefa" stroke="#dce4d9" />
        <text x="200" y="154" textAnchor="middle" fill="#58755c" fontSize="13" fontWeight="700">ODD ✓</text>
      </svg>
    )
  }

  if (gameId === 'short-path-algorithms') {
    return (
      <svg viewBox="0 0 400 300" role="img" aria-label="A path from S to T winding around square obstacles">
        <rect x="123" y="66" width="57" height="57" rx="5" fill="#d7dcd6" stroke="#9ba69d" strokeWidth="2" />
        <rect x="211" y="147" width="65" height="65" rx="5" fill="#d7dcd6" stroke="#9ba69d" strokeWidth="2" />
        <rect x="108" y="181" width="46" height="46" rx="5" fill="#d7dcd6" stroke="#9ba69d" strokeWidth="2" />
        <path d="M52 151 L91 151 L105 139 L105 52 L198 52 L198 129 L293 129 L293 247 L349 247" stroke={GREEN} strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity=".25" />
        <path className="gi-draw-line gi-path-line" d="M52 151 L91 151 L105 139 L105 52 L198 52 L198 129 L293 129 L293 247 L349 247" stroke={GREEN} strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M52 151 L76 151 L92 48 L202 48 L203 126 L289 126 L290 246 L349 247" stroke={GOLD} strokeWidth="2.5" strokeDasharray="5 7" fill="none" strokeLinecap="round" />
        <circle cx="52" cy="151" r="15" fill="#fffefa" stroke={GREEN} strokeWidth="3" />
        <circle cx="349" cy="247" r="15" fill="#fffefa" stroke={GOLD} strokeWidth="3" />
        <text x="52" y="156" textAnchor="middle" fontWeight="800" fontSize="13" fill={GREEN}>S</text>
        <text x="349" y="252" textAnchor="middle" fontWeight="800" fontSize="13" fill="#8b6b37">T</text>
      </svg>
    )
  }

  if (gameId === 'fixed-diameter-coverings') {
    const points = Array.from({ length: 59 }, (_, i) => {
      const a = i * 2.39996
      const r = 18 + Math.sqrt(i / 59) * 118
      return { x: 200 + Math.cos(a) * r * 1.05, y: 150 + Math.sin(a) * r * .76 }
    })
    return (
      <svg viewBox="0 0 400 300" role="img" aria-label="A disk moving over a cloud of points">
        <g>
          {points.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r="3.5" fill={GOLD} opacity=".8" />
          ))}
        </g>
        <g className="gi-disk-glide">
          <circle cx="190" cy="143" r="99" fill="#83b79b" fillOpacity=".18" stroke={GREEN} strokeWidth="3.5" />
          <circle cx="190" cy="143" r="3" fill={GREEN} />
        </g>
        <path d="M78 264 H322" stroke="#e7ddd0" strokeWidth="1.5" strokeDasharray="5 7" />
      </svg>
    )
  }

  const vertices = Array.from({ length: 6 }, (_, i) => ({
    x: 200 + Math.cos(-Math.PI / 2 + i * Math.PI / 3) * 112,
    y: 150 + Math.sin(-Math.PI / 2 + i * Math.PI / 3) * 112,
  }))
  const drawn = [[0, 2, RED], [1, 4, BLUE], [3, 5, RED]] as const
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label="A complete graph with glowing purple matching edges and red and blue edges">
      {vertices.flatMap((a, i) => vertices.slice(i + 1).map((b, offset) => (
        <line key={`${i}-${i+offset+1}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y}
          stroke="#d9e0d8" strokeWidth="2.2" />
      )))}
      {drawn.map(([a, b, color]) => (
        <line key={`${a}-${b}`} x1={vertices[a].x} y1={vertices[a].y} x2={vertices[b].x} y2={vertices[b].y}
          stroke={color} strokeWidth="6" strokeLinecap="round" />
      ))}
      {[[0, 1], [2, 3], [4, 5]].map(([a, b]) => (
        <g key={`${a}-${b}`} className="gi-purple-glimmer">
          <line x1={vertices[a].x} y1={vertices[a].y} x2={vertices[b].x} y2={vertices[b].y}
            stroke={PURPLE} strokeOpacity=".20" strokeWidth="18" strokeLinecap="round" />
          <line x1={vertices[a].x} y1={vertices[a].y} x2={vertices[b].x} y2={vertices[b].y}
            stroke={PURPLE} strokeWidth="8" strokeLinecap="round" />
        </g>
      ))}
      {vertices.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="11" fill="#fffefa" stroke="#768b7a" strokeWidth="3" />
      ))}
    </svg>
  )
}

export default function GameInstructions({ gameId }: { gameId: string }) {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const guide = GUIDES[gameId as GameId]

  useEffect(() => {
    if (!open) return
    const oldOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
      if (event.key !== 'Tab') return
      const panel = document.querySelector<HTMLElement>('.gi-dialog')
      if (!panel) return
      const buttons = Array.from(panel.querySelectorAll<HTMLElement>('button:not(:disabled)'))
      if (!buttons.length) return
      const first = buttons[0]
      const last = buttons[buttons.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = oldOverflow
      triggerRef.current?.focus()
    }
  }, [open])

  if (!guide) return null

  return (
    <>
      <button ref={triggerRef} className="gi-trigger" type="button" onClick={() => setOpen(true)}
        aria-haspopup="dialog" aria-expanded={open} aria-label="How to play this game">
        <span className="gi-trigger-icon" aria-hidden="true">?</span>
        <span className="gi-trigger-label">How to Play</span>
      </button>
      {open && createPortal(
        <div className="gi-overlay" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setOpen(false)
        }}>
          <section className="gi-dialog" role="dialog" aria-modal="true" aria-labelledby="gi-title" aria-describedby="gi-subtitle">
            <button ref={closeRef} type="button" className="gi-close" aria-label="Close instructions"
              onClick={() => setOpen(false)}>×</button>
            <div className="gi-header">
              <span className="gi-eyebrow">A QUICK FIELD GUIDE</span>
              <h2 id="gi-title">How to Play <span>{guide.title}</span></h2>
              <p id="gi-subtitle">{guide.kicker}</p>
            </div>
            <div className="gi-content">
              <div className="gi-picture-card">
                <span className="gi-picture-label">IN ACTION</span>
                <div className="gi-art"><TutorialPicture gameId={gameId as GameId} /></div>
                <strong>{guide.imageTitle}</strong>
                <small>{guide.imageCaption}</small>
              </div>
              <div className="gi-steps">
                {guide.steps.map((step, index) => (
                  <div key={step.title} className="gi-step">
                    <span className="gi-step-number">{index + 1}</span>
                    <div><h3>{step.title}</h3><p>{step.description}</p></div>
                  </div>
                ))}
                <p className="gi-takeaway">{guide.takeaway}</p>
              </div>
            </div>
            <div className="gi-footer">
              <span>Nothing in your game changes while this guide is open.</span>
              <button type="button" className="gi-done" onClick={() => setOpen(false)}>Back to the game <span aria-hidden="true">→</span></button>
            </div>
          </section>
        </div>, document.body,
      )}
    </>
  )
}
