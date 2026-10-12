/** Fixed-geometry, crossing-free, 4-regular orientation puzzles. */
export type Point = { x: number; y: number }
export type Edge = { id: number; u: number; v: number }
export type Puzzle = {
  edges: Edge[]
  order: number[]
  positions: Point[]
  listPositions: Point[]
  forbidden: number[][]
  /** witness[edge.id] is the source vertex of a valid full orientation. */
  witness: number[]
}
export const N = 8
export const DEGREE = 4
export const EDGE_COUNT = N * DEGREE / 2
export const VALUES = [0, 1, 2, 3, 4] as const

const shuffle = <T,>(values: readonly T[]): T[] => {
  const result = [...values]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

/**
 * The four outer vertices are an exact rectangle centered at (800,410).
 * The four inner vertices are its exact 0.535-scale homothetic copy.
 * The board never rearranges its vertices between rounds.
 *
 * Vertex order for each rectangle: top-left, top-right, bottom-right,
 * bottom-left. Both possible ways of triangulating the annular region
 * yield crossing-free, 4-regular square-antiprism graphs.
 */
const OUTER: Point[] = [
  { x: 145, y: 88 }, { x: 1455, y: 88 },
  { x: 1455, y: 732 }, { x: 145, y: 732 },
]
const CENTER = { x: 800, y: 410 }
const INNER_SCALE = 0.535
const POSITIONS: Point[] = [
  ...OUTER,
  ...OUTER.map(p => ({
    x: CENTER.x + (p.x - CENTER.x) * INNER_SCALE,
    y: CENTER.y + (p.y - CENTER.y) * INNER_SCALE,
  })),
]

/** Consistent outside labels for the outer four; inside-facing labels for
 * the inner four. All positions avoid all edges in both variants. */
const LABELS: Point[] = [
  { x: 300, y: 40 }, { x: 1300, y: 40 },
  { x: 1300, y: 780 }, { x: 300, y: 780 },
  { x: 600, y: 330 }, { x: 1000, y: 330 },
  { x: 1000, y: 490 }, { x: 600, y: 490 },
]

// Toggle rather than independently choose a variant, so New Graph always
// produces a visibly different straight-line planar edge arrangement.
let previousVariant = Math.random() < .5 ? -1 : 1
export function newGraph(): Pick<Puzzle, 'edges' | 'order' | 'positions' | 'listPositions'> {
  previousVariant = -previousVariant
  const cycle: [number, number][] = []
  for (let i = 0; i < 4; i++) {
    cycle.push([i, (i + 1) % 4])
    cycle.push([i + 4, ((i + 1) % 4) + 4])
  }
  const spokes: [number, number][] = []
  for (let i = 0; i < 4; i++) {
    spokes.push([i, 4 + i])
    spokes.push([i, 4 + ((i + previousVariant + 4) % 4)])
  }
  const edges = shuffle([...cycle, ...spokes]).map(([u, v], id) => ({ id, u, v }))
  return {
    edges, order: Array.from({ length: N }, (_, i) => i),
    positions: POSITIONS, listPositions: LABELS,
  }
}

export function newLists(edges: readonly Edge[], size: 1 | 2 | 3): Pick<Puzzle, 'witness' | 'forbidden'> {
  const witness = edges.map(e => Math.random() < .5 ? e.u : e.v)
  const degrees = outdegrees(edges, witness)
  const forbidden = degrees.map(d => shuffle(VALUES.filter(x => x !== d)).slice(0, size).sort((a, b) => a - b))
  return { witness, forbidden }
}
export function newPuzzle(size: 1 | 2 | 3): Puzzle {
  const graph = newGraph()
  return { ...graph, ...newLists(graph.edges, size) }
}
/** sources[id] is the source vertex, or null if the edge is unoriented. */
export function outdegrees(edges: readonly Edge[], sources: readonly (number | null)[]): number[] {
  const degrees = Array(N).fill(0) as number[]
  edges.forEach((edge, index) => {
    const source = sources[index]
    if (source === edge.u || source === edge.v) degrees[source]++
  })
  return degrees
}
export function solved(puzzle: Puzzle, sources: readonly (number | null)[]): boolean {
  if (sources.length !== puzzle.edges.length || sources.some(s => s === null)) return false
  const degrees = outdegrees(puzzle.edges, sources)
  return degrees.every((d, v) => !puzzle.forbidden[v].includes(d))
}
