import { useMemo, useState } from 'react'
import { InlineMath } from 'react-katex'

type Vertex = 1 | 2 | 3 | 4
type Difficulty = 3 | 4 | 5
type Pair = readonly [Vertex, Vertex]

type Edge = {
  id: string
  gold: Vertex
  silver: Vertex
}

type CellStatus = 'good' | 'bad' | 'incomplete'

const VERTICES: Vertex[] = [1, 2, 3, 4]

const PAIRS: Pair[] = [
  [1, 2],
  [1, 3],
  [1, 4],
  [2, 3],
  [2, 4],
  [3, 4],
]

const PALETTE = [
  { name: 'Red', color: '#b85c57' },
  { name: 'Blue', color: '#4f76a8' },
  { name: 'Green', color: '#5b8c65' },
  { name: 'Purple', color: '#7d6a9f' },
  { name: 'Orange', color: '#c67a5b' },
]

const DIFFICULTIES: {
  colors: Difficulty
  label: string
}[] = [
  { colors: 5, label: 'Easy' },
  { colors: 4, label: 'Medium' },
  { colors: 3, label: 'Hard' },
]

const GOLD_X = 26
const SILVER_X = 474

const Y: Record<Vertex, number> = {
  1: 44,
  2: 188,
  3: 332,
  4: 476,
}

function edgeId(gold: Vertex, silver: Vertex) {
  return `g${gold}-s${silver}`
}

const EDGES: Edge[] = VERTICES.flatMap((gold) =>
  VERTICES.map((silver) => ({
    id: edgeId(gold, silver),
    gold,
    silver,
  })),
)

function cellEdges(goldPair: Pair, silverPair: Pair) {
  return [
    edgeId(goldPair[0], silverPair[0]),
    edgeId(goldPair[0], silverPair[1]),
    edgeId(goldPair[1], silverPair[0]),
    edgeId(goldPair[1], silverPair[1]),
  ]
}

const CELLS = PAIRS.flatMap((goldPair, goldIndex) =>
  PAIRS.map((silverPair, silverIndex) => ({
    id: `${goldIndex}-${silverIndex}`,
    goldPair,
    silverPair,
    edges: cellEdges(goldPair, silverPair),
  })),
)

function cellStatus(
  ids: string[],
  colors: Record<string, number>,
): CellStatus {
  if (ids.some((id) => colors[id] === undefined)) {
    return 'incomplete'
  }

  const counts: Record<number, number> = {}

  ids.forEach((id) => {
    const color = colors[id]
    counts[color] = (counts[color] ?? 0) + 1
  })

  const everyColorEven = Object.values(counts).every(
    (count) => count % 2 === 0,
  )

  return everyColorEven ? 'bad' : 'good'
}

function pairLabel(pair: Pair) {
  return `${pair[0]}${pair[1]}`
}

function MiniK22({
  goldPair,
  silverPair,
  edgeIds,
  edgeColors,
  checker,
  affected,
  onEnter,
  onLeave,
}: {
  goldPair: Pair
  silverPair: Pair
  edgeIds: string[]
  edgeColors: Record<string, number>
  checker: boolean
  affected: boolean
  onEnter: () => void
  onLeave: () => void
}) {
  const status = cellStatus(edgeIds, edgeColors)

  const miniEdges = [
    { id: edgeIds[0], x1: 16, y1: 14, x2: 54, y2: 14 },
    { id: edgeIds[1], x1: 16, y1: 14, x2: 54, y2: 46 },
    { id: edgeIds[2], x1: 16, y1: 46, x2: 54, y2: 14 },
    { id: edgeIds[3], x1: 16, y1: 46, x2: 54, y2: 46 },
  ]

  const classes = [
    'or-mini-cell',
    affected ? 'or-mini-affected' : '',
    checker ? `or-mini-${status}` : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div
      className={classes}
      tabIndex={0}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onFocus={onEnter}
      onBlur={onLeave}
      aria-label={`Gold ${pairLabel(goldPair)}, silver ${pairLabel(
        silverPair,
      )}: ${checker ? status : 'unchecked'}`}
    >
      <svg
        viewBox="0 0 70 60"
        className="or-mini-graph"
        aria-hidden="true"
      >
        {miniEdges.map((edge) => {
          const color = edgeColors[edge.id]

          return (
            <line
              key={edge.id}
              x1={edge.x1}
              y1={edge.y1}
              x2={edge.x2}
              y2={edge.y2}
              stroke={
                color === undefined
                  ? '#c7cec7'
                  : PALETTE[color].color
              }
              className="or-mini-edge"
            />
          )
        })}

        <circle cx="16" cy="14" r="5.3" className="or-mini-gold" />
        <circle cx="16" cy="46" r="5.3" className="or-mini-gold" />

        <circle cx="54" cy="14" r="5.3" className="or-mini-silver" />
        <circle cx="54" cy="46" r="5.3" className="or-mini-silver" />
      </svg>
    </div>
  )
}

export default function OddRamseyGame() {
  const [difficulty, setDifficulty] = useState<Difficulty>(4)
  const [edgeColors, setEdgeColors] =
    useState<Record<string, number>>({})
  const [selection, setSelection] = useState<string | null>(null)

  const [hoveredEdge, setHoveredEdge] = useState<string | null>(null)
  const [hoveredMiniEdges, setHoveredMiniEdges] =
    useState<string[] | null>(null)

  const [checker, setChecker] = useState(false)

  const coloredEdges = Object.keys(edgeColors).length

  const selectedEdge = selection
    ? EDGES.find((edge) => edge.id === selection) ?? null
    : null

  const selectionPoint = selectedEdge
    ? {
        x: (GOLD_X + SILVER_X) / 2,
        y: (Y[selectedEdge.gold] + Y[selectedEdge.silver]) / 2,
      }
    : null

  const stats = useMemo(() => {
    const result = {
      good: 0,
      bad: 0,
      incomplete: 0,
    }

    CELLS.forEach((cell) => {
      result[cellStatus(cell.edges, edgeColors)] += 1
    })

    return result
  }, [edgeColors])

  const solved =
    coloredEdges === EDGES.length &&
    stats.bad === 0 &&
    stats.incomplete === 0

  function selectEdge(id: string) {
    setSelection(id)
  }

  function colorSelected(color: number) {
    if (!selection) return

    setEdgeColors((current) => ({
      ...current,
      [selection]: color,
    }))

    setSelection(null)
  }

  function eraseSelected() {
    if (!selection) return

    setEdgeColors((current) => {
      const next = { ...current }
      delete next[selection]
      return next
    })

    setSelection(null)
  }

  function clearBoard() {
    setEdgeColors({})
    setSelection(null)
    setHoveredEdge(null)
    setHoveredMiniEdges(null)
    setChecker(false)
  }

  function changeDifficulty(colors: Difficulty) {
    setDifficulty(colors)
    clearBoard()
  }

  const currentColor =
    selection === null ? undefined : edgeColors[selection]

  function showSolution() {
    const solutions: Record<Difficulty, number[][]> = {
      5: [
        [4, 0, 0, 0],
        [0, 1, 2, 3],
        [0, 2, 3, 1],
        [0, 3, 1, 2],
      ],
      4: [
        [0, 0, 0, 0],
        [0, 1, 2, 3],
        [0, 2, 3, 1],
        [0, 3, 1, 2],
      ],
      3: [
        [0, 0, 0, 1],
        [0, 1, 2, 2],
        [1, 2, 0, 2],
        [2, 0, 1, 2],
      ],
    }

    const matrix = solutions[difficulty]
    const solution: Record<string, number> = {}

    EDGES.forEach((edge) => {
      solution[edge.id] = matrix[edge.gold - 1][edge.silver - 1]
    })

    setEdgeColors(solution)
    setSelection(null)
    setChecker(false)
  }

  return (
    <section className="or-game">
      <div className="or-top">
        <div className="or-heading">
          <h1>Odd Ramsey</h1>
        </div>

        <div className="or-related-paper">
          <span>RELATED PAPER</span>
          <a
            href="https://arxiv.org/abs/2507.19456"
            target="_blank"
            rel="noreferrer"
          >
            Odd Ramsey numbers of multipartite graphs and hypergraphs
          </a>
          <small>
            with Nicholas Crawford · Emily Heath · Coy Schwieder · Shira Zerbib
          </small>
        </div>

        <div className="or-difficulty">
          <span>DIFFICULTY</span>

          <div className="or-mode-buttons">
            {DIFFICULTIES.map((mode) => (
              <button
                key={mode.colors}
                type="button"
                className={
                  difficulty === mode.colors ? 'active' : ''
                }
                onClick={() => changeDifficulty(mode.colors)}
                aria-pressed={difficulty === mode.colors}
              >
                <strong>{mode.colors}</strong>
                <small>{mode.label}</small>
              </button>
            ))}
          </div>
        </div>

        <div className="or-actions">
          <button
            type="button"
            className={
              checker
                ? 'or-check-button active'
                : 'or-check-button'
            }
            onClick={() => setChecker((current) => !current)}
          >
            {checker ? 'Hide checker' : 'Check my coloring'}
          </button>

          <button
            type="button"
            className="or-reset-button"
            onClick={clearBoard}
          >
            ↻ Reset
          </button>
        </div>
      </div>

      <div className="or-workspace">
        <section className="or-board-card">
          <div className="or-board-heading">
            <div>
              <strong className="or-board-instruction">
                Click an edge of the <InlineMath math="K_{4,4}" /> and pick a color.
              </strong>
            </div>

            <div className="or-edge-progress">
              {coloredEdges} / 16 edges
            </div>
          </div>

          <div className="or-board-graph-wrap">
            <svg
              className="or-main-graph"
              viewBox="0 0 500 520"
              aria-label="Complete bipartite graph K four four"
            >
              {EDGES.map((edge) => {
                const color = edgeColors[edge.id]
                const selected = selection === edge.id

                const highlightedFromMini =
                  hoveredMiniEdges?.includes(edge.id) ?? false

                const locallyHovered = hoveredEdge === edge.id

                const highlighted =
                  selected ||
                  highlightedFromMini ||
                  locallyHovered

                return (
                  <g key={edge.id}>
                    {highlighted && (
                      <line
                        x1={GOLD_X}
                        y1={Y[edge.gold]}
                        x2={SILVER_X}
                        y2={Y[edge.silver]}
                        className="or-edge-focus"
                      />
                    )}

                    <line
                      x1={GOLD_X}
                      y1={Y[edge.gold]}
                      x2={SILVER_X}
                      y2={Y[edge.silver]}
                      className="or-edge-hit"
                      onClick={() => selectEdge(edge.id)}
                      onMouseEnter={() =>
                        setHoveredEdge(edge.id)
                      }
                      onMouseLeave={() =>
                        setHoveredEdge(null)
                      }
                    />

                    <line
                      x1={GOLD_X}
                      y1={Y[edge.gold]}
                      x2={SILVER_X}
                      y2={Y[edge.silver]}
                      stroke={
                        color === undefined
                          ? '#aeb7af'
                          : PALETTE[color].color
                      }
                      className="or-edge"
                    />
                  </g>
                )
              })}

              {VERTICES.map((vertex) => (
                <g key={`gold-${vertex}`}>
                  <circle
                    cx={GOLD_X}
                    cy={Y[vertex]}
                    r="24"
                    className="or-gold-vertex"
                  />
                  <text
                    x={GOLD_X}
                    y={Y[vertex] + 6}
                    textAnchor="middle"
                    className="or-vertex-label"
                  >
                    {vertex}
                  </text>
                </g>
              ))}

              {VERTICES.map((vertex) => (
                <g key={`silver-${vertex}`}>
                  <circle
                    cx={SILVER_X}
                    cy={Y[vertex]}
                    r="24"
                    className="or-silver-vertex"
                  />
                  <text
                    x={SILVER_X}
                    y={Y[vertex] + 6}
                    textAnchor="middle"
                    className="or-vertex-label"
                  >
                    {vertex}
                  </text>
                </g>
              ))}

            </svg>

            {selection && selectedEdge && selectionPoint && (
              <div
                className={[
                  'or-popover',
                  selectionPoint.y > 270
                    ? 'or-popover-up'
                    : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                style={{
                  left: `${(selectionPoint.x / 500) * 100}%`,
                  top: `${(selectionPoint.y / 520) * 100}%`,
                }}
              >
                <div className="or-popover-title">
                  <strong className="or-popover-edge-name">
                    <span className="or-popover-vertex gold">
                      {selectedEdge.gold}
                    </span>
                    <span className="or-popover-dash">–</span>
                    <span className="or-popover-vertex silver">
                      {selectedEdge.silver}
                    </span>
                  </strong>

                  <button
                    type="button"
                    onClick={() => setSelection(null)}
                    aria-label="Close color picker"
                  >
                    ×
                  </button>
                </div>

                <div className="or-popover-colors">
                  {PALETTE.slice(0, difficulty).map(
                    (swatch, index) => (
                      <button
                        key={swatch.name}
                        type="button"
                        className={
                          currentColor === index
                            ? 'or-color-button current'
                            : 'or-color-button'
                        }
                        style={{
                          backgroundColor: swatch.color,
                        }}
                        onClick={() => colorSelected(index)}
                        aria-label={`Use ${swatch.name}`}
                        title={swatch.name}
                      />
                    ),
                  )}
                </div>

                {currentColor !== undefined && (
                  <button
                    type="button"
                    className="or-erase"
                    onClick={eraseSelected}
                  >
                    Remove color
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="or-board-footer">
            <div className="or-coloring-rule">
              <p>
                A <InlineMath math="K_{2,2}" /> is{' '}
                <strong>good</strong> if some color appears an odd number of times.
              </p>
            </div>
          </div>
        </section>

        <section className="or-constraint-card">
          <div className="or-constraint-heading">
            <div>
              <span>
                ALL 36 COPIES OF <InlineMath math="K_{2,2}" />
              </span>
            </div>

            <button
              type="button"
              className="or-solution-button"
              onClick={showSolution}
            >
              Show solution
            </button>

            {checker && (
              <div
                className={
                  solved
                    ? 'or-check-summary solved'
                    : 'or-check-summary'
                }
              >
                {solved ? (
                  <strong>All 36 good — solved!</strong>
                ) : (
                  <>
                    <span className="good">
                      {stats.good} good
                    </span>
                    <span className="bad">
                      {stats.bad} bad
                    </span>
                    <span>
                      {stats.incomplete} incomplete
                    </span>
                  </>
                )}
              </div>
            )}
          </div>

          <div className="or-pair-grid">
            <div className="or-grid-corner" aria-hidden="true">
              <span className="or-grid-corner-vertex gold" />
              <i>/</i>
              <span className="or-grid-corner-vertex silver" />
            </div>

            {PAIRS.map((pair) => (
              <div
                key={`silver-header-${pairLabel(pair)}`}
                className="or-grid-header or-grid-header-silver"
              >
                {pairLabel(pair)}
              </div>
            ))}

            {PAIRS.map((goldPair) => (
              <div
                className="or-grid-row"
                key={`gold-row-${pairLabel(goldPair)}`}
              >
                <div className="or-grid-header or-grid-header-gold">
                  {pairLabel(goldPair)}
                </div>

                {PAIRS.map((silverPair) => {
                  const ids = cellEdges(
                    goldPair,
                    silverPair,
                  )

                  const affected =
                    hoveredEdge !== null &&
                    ids.includes(hoveredEdge)

                  return (
                    <MiniK22
                      key={`${pairLabel(
                        goldPair,
                      )}-${pairLabel(silverPair)}`}
                      goldPair={goldPair}
                      silverPair={silverPair}
                      edgeIds={ids}
                      edgeColors={edgeColors}
                      checker={checker}
                      affected={affected}
                      onEnter={() =>
                        setHoveredMiniEdges(ids)
                      }
                      onLeave={() =>
                        setHoveredMiniEdges(null)
                      }
                    />
                  )
                })}
              </div>
            ))}
          </div>

          <div className="or-check-key">
            <span>
              <i className="good" />
              good
            </span>
            <span>
              <i className="bad" />
              even / bad
            </span>
            <span>
              <i className="incomplete" />
              incomplete
            </span>
          </div>
        </section>
      </div>
    </section>
  )
}
