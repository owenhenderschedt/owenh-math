import { useMemo, useState } from 'react'

type Edge = {
  id: string
  u: number
  v: number
}

type Selection =
  | { type: 'vertex'; id: number }
  | { type: 'edge'; id: string }

type ExtensionPrecoloring = {
  vertexColors: Record<number, number>
  edgeColors: Record<string, number>
}

const PALETTE = [
  '#b85c57',
  '#d3a13b',
  '#5b8c65',
  '#4f76a8',
  '#7d6a9f',
  '#c67a5b',
  '#4f918c',
]

const POSITIONS = [
  { x: 250, y: 35 },
  { x: 420, y: 115 },
  { x: 462, y: 305 },
  { x: 345, y: 462 },
  { x: 155, y: 462 },
  { x: 38, y: 305 },
  { x: 80, y: 115 },
  { x: 250, y: 250 },
]

const VERTICES = [0, 1, 2, 3, 4, 5, 6, 7]

const EDGES: Edge[] = [
  { id: '0-1', u: 0, v: 1 },
  { id: '1-2', u: 1, v: 2 },
  { id: '2-3', u: 2, v: 3 },
  { id: '3-4', u: 3, v: 4 },
  { id: '4-5', u: 4, v: 5 },
  { id: '5-6', u: 5, v: 6 },
  { id: '6-0', u: 6, v: 0 },
  { id: '0-7', u: 0, v: 7 },
  { id: '2-7', u: 2, v: 7 },
  { id: '4-7', u: 4, v: 7 },
  { id: '6-7', u: 6, v: 7 },
]

function edgesTouch(a: Edge, b: Edge) {
  return a.u === b.u || a.u === b.v || a.v === b.u || a.v === b.v
}


function makeRandomGraph(): Edge[] {
  const outerCycle: Edge[] = [
    { id: '0-1', u: 0, v: 1 },
    { id: '1-2', u: 1, v: 2 },
    { id: '2-3', u: 2, v: 3 },
    { id: '3-4', u: 3, v: 4 },
    { id: '4-5', u: 4, v: 5 },
    { id: '5-6', u: 5, v: 6 },
    { id: '0-6', u: 0, v: 6 },
  ]

  const extras: Edge[] = [
    { id: '0-7', u: 0, v: 7 },
    { id: '1-7', u: 1, v: 7 },
    { id: '2-7', u: 2, v: 7 },
    { id: '3-7', u: 3, v: 7 },
    { id: '4-7', u: 4, v: 7 },
    { id: '5-7', u: 5, v: 7 },
    { id: '6-7', u: 6, v: 7 },
    { id: '0-2', u: 0, v: 2 },
    { id: '1-3', u: 1, v: 3 },
    { id: '2-4', u: 2, v: 4 },
    { id: '3-5', u: 3, v: 5 },
    { id: '4-6', u: 4, v: 6 },
  ]

  const shuffled = [...extras].sort(() => Math.random() - 0.5)
  const numberOfExtras = 4 + Math.floor(Math.random() * 3)

  // Guarantee that the center vertex is part of the graph.
  const centerEdge = shuffled.find((edge) => edge.u === 7 || edge.v === 7)!

  const chosen = [
    centerEdge,
    ...shuffled
      .filter((edge) => edge.id !== centerEdge.id)
      .slice(0, numberOfExtras - 1),
  ]

  return [...outerCycle, ...chosen]
}

function RulePicture({
  kind,
}: {
  kind: 'vertices' | 'incident' | 'edges'
}) {
  const bad = '#b85c57'

  if (kind === 'vertices') {
    return (
      <svg viewBox="0 0 70 34" aria-hidden="true">
        <line x1="18" y1="17" x2="52" y2="17" className="tc-rule-line" />
        <circle cx="16" cy="17" r="8" fill={bad} className="tc-rule-node" />
        <circle cx="54" cy="17" r="8" fill={bad} className="tc-rule-node" />
      </svg>
    )
  }

  if (kind === 'incident') {
    return (
      <svg viewBox="0 0 70 34" aria-hidden="true">
        <line
          x1="17"
          y1="17"
          x2="57"
          y2="17"
          stroke={bad}
          className="tc-rule-colored-line"
        />
        <circle cx="16" cy="17" r="8" fill={bad} className="tc-rule-node" />
        <circle cx="58" cy="17" r="8" className="tc-rule-empty-node" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 70 34" aria-hidden="true">
      <line
        x1="8"
        y1="28"
        x2="35"
        y2="10"
        stroke={bad}
        className="tc-rule-colored-line"
      />
      <line
        x1="35"
        y1="10"
        x2="62"
        y2="28"
        stroke={bad}
        className="tc-rule-colored-line"
      />
      <circle cx="35" cy="10" r="6" className="tc-rule-empty-node" />
    </svg>
  )
}


function totalChromaticNumber(edges: Edge[]) {
  const vertexCount = VERTICES.length
  const objectCount = vertexCount + edges.length

  const adjacency = Array.from(
    { length: objectCount },
    () => new Set<number>(),
  )

  function connect(a: number, b: number) {
    adjacency[a].add(b)
    adjacency[b].add(a)
  }

  // Adjacent vertices.
  edges.forEach((edge) => {
    connect(edge.u, edge.v)
  })

  // Each edge is adjacent to its two endpoints.
  edges.forEach((edge, index) => {
    const edgeObject = vertexCount + index
    connect(edgeObject, edge.u)
    connect(edgeObject, edge.v)
  })

  // Adjacent edges.
  for (let i = 0; i < edges.length; i += 1) {
    for (let j = i + 1; j < edges.length; j += 1) {
      if (edgesTouch(edges[i], edges[j])) {
        connect(vertexCount + i, vertexCount + j)
      }
    }
  }

  const colors = Array(objectCount).fill(-1)

  function canColorWith(k: number): boolean {
    colors.fill(-1)

    function search(coloredCount: number): boolean {
      if (coloredCount === objectCount) {
        return true
      }

      let chosen = -1
      let bestSaturation = -1
      let bestDegree = -1

      for (let object = 0; object < objectCount; object += 1) {
        if (colors[object] !== -1) continue

        const neighborColors = new Set<number>()

        adjacency[object].forEach((neighbor) => {
          if (colors[neighbor] !== -1) {
            neighborColors.add(colors[neighbor])
          }
        })

        const saturation = neighborColors.size
        const degree = adjacency[object].size

        if (
          saturation > bestSaturation ||
          (saturation === bestSaturation && degree > bestDegree)
        ) {
          chosen = object
          bestSaturation = saturation
          bestDegree = degree
        }
      }

      const forbidden = new Set<number>()

      adjacency[chosen].forEach((neighbor) => {
        if (colors[neighbor] !== -1) {
          forbidden.add(colors[neighbor])
        }
      })

      for (let color = 0; color < k; color += 1) {
        if (forbidden.has(color)) continue

        colors[chosen] = color

        if (search(coloredCount + 1)) {
          return true
        }

        colors[chosen] = -1
      }

      return false
    }

    return search(0)
  }

  const degrees = Array(vertexCount).fill(0)

  edges.forEach((edge) => {
    degrees[edge.u] += 1
    degrees[edge.v] += 1
  })

  const maximumDegree = Math.max(...degrees)

  for (
    let numberOfColors = maximumDegree + 1;
    numberOfColors <= objectCount;
    numberOfColors += 1
  ) {
    if (canColorWith(numberOfColors)) {
      return numberOfColors
    }
  }

  return objectCount
}

function makeExtensionPrecoloring(
  edges: Edge[],
  numberOfColors: number,
): ExtensionPrecoloring | null {
  const availableColors = Array.from(
    { length: Math.min(numberOfColors, PALETTE.length) },
    (_, index) => index,
  )

  if (availableColors.length < 3) {
    return null
  }

  const pairs: [Edge, Edge][] = []

  for (let i = 0; i < edges.length; i += 1) {
    for (let j = i + 1; j < edges.length; j += 1) {
      if (!edgesTouch(edges[i], edges[j])) {
        pairs.push([edges[i], edges[j]])
      }
    }
  }

  const shuffledPairs = [...pairs].sort(() => Math.random() - 0.5)

  for (const [first, second] of shuffledPairs) {
    const objects: Selection[] = [
      { type: 'vertex', id: first.u },
      { type: 'edge', id: first.id },
      { type: 'vertex', id: first.v },
      { type: 'vertex', id: second.u },
      { type: 'edge', id: second.id },
      { type: 'vertex', id: second.v },
    ]

    const vertexColors: Record<number, number> = {}
    const edgeColors: Record<string, number> = {}

    function legal(selection: Selection, color: number) {
      if (selection.type === 'vertex') {
        const vertex = selection.id

        const adjacentVertexConflict = edges.some((edge) => {
          if (edge.u === vertex) {
            return vertexColors[edge.v] === color
          }

          if (edge.v === vertex) {
            return vertexColors[edge.u] === color
          }

          return false
        })

        const incidentEdgeConflict = edges.some(
          (edge) =>
            (edge.u === vertex || edge.v === vertex) &&
            edgeColors[edge.id] === color,
        )

        return !adjacentVertexConflict && !incidentEdgeConflict
      }

      const edge = edges.find(
        (candidate) => candidate.id === selection.id,
      )

      if (!edge) return false

      const endpointConflict =
        vertexColors[edge.u] === color ||
        vertexColors[edge.v] === color

      const adjacentEdgeConflict = edges.some(
        (other) =>
          other.id !== edge.id &&
          edgesTouch(edge, other) &&
          edgeColors[other.id] === color,
      )

      return !endpointConflict && !adjacentEdgeConflict
    }

    function assign(index: number): boolean {
      if (index === objects.length) {
        return true
      }

      const object = objects[index]
      const shuffledColors = [...availableColors].sort(
        () => Math.random() - 0.5,
      )

      for (const color of shuffledColors) {
        if (!legal(object, color)) continue

        if (object.type === 'vertex') {
          vertexColors[object.id] = color
        } else {
          edgeColors[object.id] = color
        }

        if (assign(index + 1)) {
          return true
        }

        if (object.type === 'vertex') {
          delete vertexColors[object.id]
        } else {
          delete edgeColors[object.id]
        }
      }

      return false
    }

    if (assign(0)) {
      return {
        vertexColors: { ...vertexColors },
        edgeColors: { ...edgeColors },
      }
    }
  }

  return null
}

export default function TotalColoringGame() {
  const [edges, setEdges] = useState<Edge[]>(EDGES)
  const [selection, setSelection] = useState<Selection | null>(null)
  const [vertexColors, setVertexColors] = useState<Record<number, number>>({})
  const [edgeColors, setEdgeColors] = useState<Record<string, number>>({})
  const [warning, setWarning] = useState('')
  const [lastMove, setLastMove] = useState('Pick any vertex or edge to begin.')
  const [precoloredVertexColors, setPrecoloredVertexColors] =
    useState<Record<number, number>>({})
  const [precoloredEdgeColors, setPrecoloredEdgeColors] =
    useState<Record<string, number>>({})
  const [showExtensionHelp, setShowExtensionHelp] = useState(false)

  const totalItems = VERTICES.length + edges.length

  const coloredItems =
    Object.keys(vertexColors).length + Object.keys(edgeColors).length

  const colorsUsed = useMemo(() => {
    const used = new Set<number>()

    Object.values(vertexColors).forEach((color) => used.add(color))
    Object.values(edgeColors).forEach((color) => used.add(color))

    return used.size
  }, [vertexColors, edgeColors])

  const complete = coloredItems === totalItems

  const optimalColors = useMemo(
    () => totalChromaticNumber(edges),
    [edges],
  )

  const scoreDifference = complete ? colorsUsed - optimalColors : null
  const optimalFinish = complete && scoreDifference === 0

  const challengeActive =
    Object.keys(precoloredVertexColors).length > 0 ||
    Object.keys(precoloredEdgeColors).length > 0

  function choose(selection: Selection) {
    const locked =
      selection.type === 'vertex'
        ? precoloredVertexColors[selection.id] !== undefined
        : precoloredEdgeColors[selection.id] !== undefined

    if (locked) {
      setSelection(null)
      setWarning('')
      setLastMove('That color is fixed by the precoloring.')
      return
    }

    setSelection(selection)
    setWarning('')
    setLastMove(
      selection.type === 'vertex'
        ? 'Choose a color for this vertex.'
        : 'Choose a color for this edge.',
    )
  }

  function colorSelected(color: number) {
    if (!selection) return

    if (selection.type === 'vertex') {
      const vertex = selection.id

      const adjacentVertexConflict = edges.some((edge) => {
        if (edge.u === vertex) {
          return vertexColors[edge.v] === color
        }

        if (edge.v === vertex) {
          return vertexColors[edge.u] === color
        }

        return false
      })

      const incidentEdgeConflict = edges.some(
        (edge) =>
          (edge.u === vertex || edge.v === vertex) &&
          edgeColors[edge.id] === color,
      )

      if (adjacentVertexConflict || incidentEdgeConflict) {
        setWarning('Not proper — that color already touches this vertex.')
        return
      }

      setVertexColors((current) => ({
        ...current,
        [vertex]: color,
      }))

      setWarning('')
      setLastMove('Legal move. Nice.')
      setSelection(null)
      return
    }

    const edge = edges.find((candidate) => candidate.id === selection.id)

    if (!edge) return

    const endpointConflict =
      vertexColors[edge.u] === color || vertexColors[edge.v] === color

    const adjacentEdgeConflict = edges.some(
      (other) =>
        other.id !== edge.id &&
        edgesTouch(edge, other) &&
        edgeColors[other.id] === color,
    )

    if (endpointConflict || adjacentEdgeConflict) {
      setWarning('Not proper — that color already meets this edge.')
      return
    }

    setEdgeColors((current) => ({
      ...current,
      [edge.id]: color,
    }))

    setWarning('')
    setLastMove('Legal move. Nice.')
    setSelection(null)
  }

  function eraseSelected() {
    if (!selection) return

    const locked =
      selection.type === 'vertex'
        ? precoloredVertexColors[selection.id] !== undefined
        : precoloredEdgeColors[selection.id] !== undefined

    if (locked) {
      setSelection(null)
      setWarning('')
      setLastMove('That color is fixed by the precoloring.')
      return
    }

    if (selection.type === 'vertex') {
      setVertexColors((current) => {
        const next = { ...current }
        delete next[selection.id]
        return next
      })
    } else {
      setEdgeColors((current) => {
        const next = { ...current }
        delete next[selection.id]
        return next
      })
    }

    setWarning('')
    setLastMove('Color removed.')
    setSelection(null)
  }

  function clearBoard() {
    setVertexColors({ ...precoloredVertexColors })
    setEdgeColors({ ...precoloredEdgeColors })
    setSelection(null)
    setWarning('')

    setLastMove(
      challengeActive
        ? 'Precoloring restored. Extend it from here.'
        : 'Fresh board. Go for a lower score.',
    )
  }


  function newGraph() {
    setEdges(makeRandomGraph())
    setVertexColors({})
    setEdgeColors({})
    setPrecoloredVertexColors({})
    setPrecoloredEdgeColors({})
    setShowExtensionHelp(false)
    setSelection(null)
    setWarning('')
    setLastMove('New graph. See how few colors you can use.')
  }

  function startExtensionChallenge() {
    const precoloring = makeExtensionPrecoloring(edges, optimalColors)

    if (!precoloring) {
      setWarning('Could not build an extension challenge for this graph.')
      return
    }

    setPrecoloredVertexColors(precoloring.vertexColors)
    setPrecoloredEdgeColors(precoloring.edgeColors)

    setVertexColors({ ...precoloring.vertexColors })
    setEdgeColors({ ...precoloring.edgeColors })

    setSelection(null)
    setWarning('')
    setShowExtensionHelp(false)
    setLastMove(
      'Two copies of K₂ are precolored and locked. Extend the coloring.',
    )
  }

  function selectionPoint() {
    if (!selection) return null

    if (selection.type === 'vertex') {
      return POSITIONS[selection.id]
    }

    const edge = edges.find((candidate) => candidate.id === selection.id)

    if (!edge) return null

    const a = POSITIONS[edge.u]
    const b = POSITIONS[edge.v]

    return {
      x: (a.x + b.x) / 2,
      y: (a.y + b.y) / 2,
    }
  }

  function currentSelectionColor() {
    if (!selection) return undefined

    return selection.type === 'vertex'
      ? vertexColors[selection.id]
      : edgeColors[selection.id]
  }

  const point = selectionPoint()
  const currentColor = currentSelectionColor()

  return (
    <section className="tc-game">
      <div className="tc-top">
        <div className="tc-heading">

          <h1>Total Coloring</h1>
          <span>Low score wins.</span>
        </div>

        <div className="tc-scoreboard" aria-label="Game scoreboard">
          <div className="tc-scoreboard-light">
            <span
              className={
                complete
                  ? 'complete'
                  : coloredItems > 0
                    ? 'active'
                    : ''
              }
            />
            {optimalFinish
              ? 'OPTIMAL!'
              : complete
                ? 'FINISHED'
                : coloredItems > 0
                  ? 'IN PLAY'
                  : 'READY'}
          </div>

          <div className="tc-score-main">
            <span>COLORS</span>
            <strong>{colorsUsed}</strong>
          </div>

          <div className="tc-score-divider" />

          <div className="tc-score-progress">
            <span>TARGET</span>
            <strong>{optimalColors}</strong>
          </div>
        </div>
      </div>

      <div className="tc-layout">
        <div className="tc-board">
          <div className="tc-board-label">
            <small>
              {challengeActive
                ? 'Extension challenge · fixed colors are locked'
                : 'Click a vertex or an edge'}
            </small>
          </div>

          <svg
            className="tc-graph"
            viewBox="0 0 500 500"
            aria-label="Graph to total color"
          >
            {edges.map((edge) => {
              const a = POSITIONS[edge.u]
              const b = POSITIONS[edge.v]
              const color = edgeColors[edge.id]
              const locked = precoloredEdgeColors[edge.id] !== undefined

              const selected =
                selection?.type === 'edge' && selection.id === edge.id

              return (
                <g key={edge.id}>
                  {selected && (
                    <line
                      x1={a.x}
                      y1={a.y}
                      x2={b.x}
                      y2={b.y}
                      className="tc-edge-selection"
                    />
                  )}

                  <line
                    x1={a.x}
                    y1={a.y}
                    x2={b.x}
                    y2={b.y}
                    className={
                      locked
                        ? 'tc-edge-hit tc-locked-hit'
                        : 'tc-edge-hit'
                    }
                    onClick={() => choose({ type: 'edge', id: edge.id })}
                  />

                  <line
                    x1={a.x}
                    y1={a.y}
                    x2={b.x}
                    y2={b.y}
                    stroke={
                      color === undefined ? '#9ca79d' : PALETTE[color]
                    }
                    className={locked ? 'tc-edge tc-locked' : 'tc-edge'}
                  />
                </g>
              )
            })}

            {VERTICES.map((vertex) => {
              const position = POSITIONS[vertex]
              const color = vertexColors[vertex]
              const locked = precoloredVertexColors[vertex] !== undefined

              const selected =
                selection?.type === 'vertex' && selection.id === vertex

              return (
                <g key={vertex}>
                  {selected && (
                    <circle
                      cx={position.x}
                      cy={position.y}
                      r="27"
                      className="tc-vertex-selection"
                    />
                  )}

                  <circle
                    cx={position.x}
                    cy={position.y}
                    r="19"
                    fill={
                      color === undefined ? '#fffdf8' : PALETTE[color]
                    }
                    className={
                      locked
                        ? 'tc-vertex tc-locked'
                        : 'tc-vertex'
                    }
                    onClick={() => choose({ type: 'vertex', id: vertex })}
                  />
                </g>
              )
            })}
          </svg>

          {selection && point && (
            <div
              className={[
                'tc-popover',
                point.x > 310 ? 'tc-popover-left' : '',
                point.y > 255 ? 'tc-popover-up' : '',
                warning ? 'tc-popover-warning' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              style={{
                left: `${(point.x / 500) * 100}%`,
                top: `${(point.y / 500) * 100}%`,
              }}
            >
              <div className="tc-popover-title">
                <strong>
                  {selection.type === 'vertex' ? 'Color vertex' : 'Color edge'}
                </strong>
                <button
                  type="button"
                  onClick={() => {
                    setSelection(null)
                    setWarning('')
                  }}
                  aria-label="Close color picker"
                >
                  ×
                </button>
              </div>

              <div className="tc-popover-colors">
                {PALETTE.map((color, index) => (
                  <button
                    key={color}
                    type="button"
                    className={
                      currentColor === index
                        ? 'tc-color-button current'
                        : 'tc-color-button'
                    }
                    style={{ backgroundColor: color }}
                    onClick={() => colorSelected(index)}
                    aria-label={`Use color ${index + 1}`}
                  />
                ))}
              </div>

              {warning && (
                <div className="tc-warning">
                  <span>!</span>
                  {warning}
                </div>
              )}

              {currentColor !== undefined && (
                <button
                  type="button"
                  className="tc-erase"
                  onClick={eraseSelected}
                >
                  Remove color
                </button>
              )}
            </div>
          )}
        </div>

        <aside className="tc-side">
          <div className="tc-left-stack">
            <section className="tc-rules">
            <div className="tc-rules-heading">
              <span>THE RULE</span>
              <h2>Close objects get different colors.</h2>
            </div>

            <div className="tc-rule-list">
              <div className="tc-rule-item">
                <RulePicture kind="vertices" />
                <div>
                  <strong>Vertex + vertex</strong>
                  <span>Adjacent vertices need different colors.</span>
                </div>
                <b>×</b>
              </div>

              <div className="tc-rule-item">
                <RulePicture kind="incident" />
                <div>
                  <strong>Vertex + edge</strong>
                  <span>An edge cannot match either endpoint.</span>
                </div>
                <b>×</b>
              </div>

              <div className="tc-rule-item">
                <RulePicture kind="edges" />
                <div>
                  <strong>Edge + edge</strong>
                  <span>Edges meeting at a vertex cannot match.</span>
                </div>
                <b>×</b>
              </div>
            </div>
            </section>

            <div className="tc-extension">
              <div className="tc-extension-actions">
                <button
                  type="button"
                  className="tc-extension-button"
                  onClick={startExtensionChallenge}
                >
                  {challengeActive
                    ? 'New precoloring'
                    : 'Extension challenge'}
                </button>

                <button
                  type="button"
                  className="tc-extension-help-button"
                  onClick={() =>
                    setShowExtensionHelp((current) => !current)
                  }
                  aria-label="What is an extension challenge?"
                  aria-expanded={showExtensionHelp}
                >
                  ?
                </button>

                {showExtensionHelp && (
                  <div className="tc-extension-help" role="note">
                    <strong>What is an extension?</strong>
                    <p>
                      An extension problem begins with a proper
                      precoloring already fixed. Here, two disjoint
                      copies of K₂ are total-colored in advance.
                      Those colors are locked; your job is to color
                      the rest of the graph without changing them.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <section
            className={
              complete ? 'tc-status tc-status-complete' : 'tc-status'
            }
          >
            <span>{complete ? 'GRAPH COMPLETE' : 'GAME STATUS'}</span>
            <p>
              {optimalFinish
                ? `Perfect — ${colorsUsed} colors is optimal for this graph.`
                : complete
                  ? `Finished with ${colorsUsed} colors — ${scoreDifference} over the target of ${optimalColors}.`
                  : lastMove}
            </p>
          </section>

          <div className="tc-side-bottom">
            <div className="tc-mini-progress">
              <span
                style={{
                  width: `${(coloredItems / totalItems) * 100}%`,
                }}
              />
            </div>

            <div className="tc-game-buttons">
              <button
                type="button"
                className="tc-reset"
                onClick={clearBoard}
              >
                ↻ Reset colors
              </button>

              <button
                type="button"
                className="tc-new-graph"
                onClick={newGraph}
              >
                New graph →
              </button>
            </div>
          </div>
        </aside>
      </div>

      <section className="tc-related-research">
        <h2>Related Papers</h2>

        <div className="tc-paper-row">
          <a
            href="https://arxiv.org/abs/2509.18940"
            target="_blank"
            rel="noreferrer"
            className="tc-paper-title"
          >
            Extending total colorings in planar graphs
          </a>
          <div className="tc-paper-authors">
            Owen Henderschedt · Jessica McDonald
          </div>
        </div>

        <div className="tc-paper-row">
          <a
            href="https://arxiv.org/abs/2507.05548"
            target="_blank"
            rel="noreferrer"
            className="tc-paper-title"
          >
            Total coloring graphs with large minimum degree
          </a>
          <div className="tc-paper-authors">
            Owen Henderschedt · Jessica McDonald · Songling Shan
          </div>
        </div>
      </section>
    </section>
  )
}
