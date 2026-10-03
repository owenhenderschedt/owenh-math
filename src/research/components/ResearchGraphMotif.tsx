type GraphNode = {
  id: string
  x: number
  y: number
  color: string
  core: boolean
}

const cx = 220
const cy = 165
const cycleRadius = 64
const outerRadius = 143

const colors = {
  one: '#769078',
  two: '#c69a4b',
  three: '#557c96',
  four: '#a86662',
}

function mod5(i: number) {
  return ((i - 1 + 5) % 5) + 1
}

function point(radius: number, angle: number) {
  return {
    x: cx + radius * Math.cos(angle),
    y: cy + radius * Math.sin(angle),
  }
}

function colorFor(id: string) {
  const classes: Record<string, string> = {
    c1: colors.one,
    yp2: colors.one,
    ym5: colors.one,

    c2: colors.two,
    c5: colors.two,
    yp1: colors.two,
    ym1: colors.two,

    c3: colors.three,
    yp4: colors.three,
    ym4: colors.three,
    ym2: colors.three,

    c4: colors.four,
    yp3: colors.four,
    ym3: colors.four,
    yp5: colors.four,
  }

  return classes[id]
}

const nodes: GraphNode[] = []

for (let i = 1; i <= 5; i += 1) {
  const angle = -Math.PI / 2 + ((i - 1) * 2 * Math.PI) / 5
  const core = point(cycleRadius, angle)

  nodes.push({
    id: `c${i}`,
    ...core,
    color: colorFor(`c${i}`),
    core: true,
  })

  const plus = point(outerRadius, angle - 0.085)
  const minus = point(outerRadius, angle + 0.085)

  nodes.push({
    id: `yp${i}`,
    ...plus,
    color: colorFor(`yp${i}`),
    core: false,
  })

  nodes.push({
    id: `ym${i}`,
    ...minus,
    color: colorFor(`ym${i}`),
    core: false,
  })
}

const nodeMap = new Map(nodes.map((node) => [node.id, node]))

type Edge = {
  a: string
  b: string
  kind: 'cycle' | 'spoke' | 'outer' | 'matching'
}

const edges: Edge[] = []

// The central induced C5.
for (let i = 1; i <= 5; i += 1) {
  edges.push({
    a: `c${i}`,
    b: `c${mod5(i + 1)}`,
    kind: 'cycle',
  })
}

// Every vertex of Y_i sees c_i, c_{i-2}, c_{i+2}.
for (let i = 1; i <= 5; i += 1) {
  for (const sign of ['yp', 'ym']) {
    for (const j of [i, mod5(i - 2), mod5(i + 2)]) {
      edges.push({
        a: `${sign}${i}`,
        b: `c${j}`,
        kind: 'spoke',
      })
    }
  }
}

// Y_i is complete to Y_{i+1}.
for (let i = 1; i <= 5; i += 1) {
  const next = mod5(i + 1)

  for (const a of ['yp', 'ym']) {
    for (const b of ['yp', 'ym']) {
      edges.push({
        a: `${a}${i}`,
        b: `${b}${next}`,
        kind: 'outer',
      })
    }
  }
}

// y_i^+ y_{i+2}^-.
for (let i = 1; i <= 5; i += 1) {
  edges.push({
    a: `yp${i}`,
    b: `ym${mod5(i + 2)}`,
    kind: 'matching',
  })
}

export default function ResearchGraphMotif() {
  return (
    <div className="research-graph-figure" aria-hidden="true">
      <svg
        viewBox="0 0 440 330"
        className="research-graph-svg"
        focusable="false"
      >
        <g className="research-motif-edges">
          {edges.map((edge, index) => {
            const a = nodeMap.get(edge.a)
            const b = nodeMap.get(edge.b)

            if (!a || !b) return null

            return (
              <line
                key={`${edge.a}-${edge.b}-${index}`}
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                className={`research-motif-edge research-motif-${edge.kind}`}
              />
            )
          })}
        </g>

        <g className="research-motif-nodes">
          {nodes.map((node) => (
            <circle
              key={node.id}
              cx={node.x}
              cy={node.y}
              r={node.core ? 9 : 7}
              fill={node.color}
              className={node.core ? 'research-motif-core' : 'research-motif-node'}
            />
          ))}
        </g>
      </svg>
    </div>
  )
}
