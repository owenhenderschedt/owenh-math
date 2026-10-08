export type Paint = 'red' | 'blue'
export type Tool = Paint | 'erase'
export type Colors = Record<string, Paint>
export type GraphShape = 'K3' | 'P4' | 'C4' | 'P5' | 'C5' | 'DIAMOND' | 'CLAW' | 'K4'
export type GraphPattern = { order: number; edges: readonly (readonly [number, number])[]; label: string }

export const PATTERNS: Record<GraphShape, GraphPattern> = {
  K3: { order: 3, edges: [[0, 1], [1, 2], [0, 2]], label: 'K₃' },
  P4: { order: 4, edges: [[0, 1], [1, 2], [2, 3]], label: 'P₄' },
  C4: { order: 4, edges: [[0, 1], [1, 2], [2, 3], [3, 0]], label: 'C₄' },
  P5: { order: 5, edges: [[0, 1], [1, 2], [2, 3], [3, 4]], label: 'P₅' },
  C5: { order: 5, edges: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 0]], label: 'C₅' },
  DIAMOND: { order: 4, edges: [[0, 1], [1, 2], [0, 2], [1, 3], [2, 3]], label: 'K₄−e' },
  CLAW: { order: 4, edges: [[0, 1], [0, 2], [0, 3]], label: 'K₁,₃' },
  K4: { order: 4, edges: [[0, 1], [0, 2], [0, 3], [1, 2], [1, 3], [2, 3]], label: 'K₄' },
}

export type Challenge = { id: string; red: GraphShape; blue: GraphShape; threshold: number }
// Thresholds and avoiding witnesses verified offline via exact 0–1 integer feasibility.
export const CHALLENGES: readonly Challenge[] = [
  { id: 'K3-P4', red: 'K3', blue: 'P4', threshold: 4 },
  { id: 'K3-K3', red: 'K3', blue: 'K3', threshold: 5 },
  { id: 'C4-C4', red: 'C4', blue: 'C4', threshold: 5 },
  { id: 'C4-P5', red: 'C4', blue: 'P5', threshold: 6 },
  { id: 'P5-C5', red: 'P5', blue: 'C5', threshold: 6 },
  { id: 'K3-DIAMOND', red: 'K3', blue: 'DIAMOND', threshold: 7 },
  { id: 'K4-CLAW', red: 'K4', blue: 'CLAW', threshold: 7 },
  { id: 'K3-K4', red: 'K3', blue: 'K4', threshold: 8 },
]

export function edgeKey(a: number, b: number) { return a < b ? `${a}-${b}` : `${b}-${a}` }
export function isWild(a: number, b: number) { return Math.min(a, b) % 2 === 0 && Math.abs(a - b) === 1 }
export function graphEdges(n: number) {
  const edges: { a: number; b: number; id: string; wild: boolean }[] = []
  for (let a = 0; a < n; a++) for (let b = a + 1; b < n; b++) {
    edges.push({ a, b, id: edgeKey(a, b), wild: isWild(a, b) })
  }
  return edges
}

// Copies are ordinary subgraphs, never induced subgraphs. Edges of a pattern
// need only be present in the chosen color; extra edges play no role.
const copyCache = new Map<string, string[][]>()
export function copiesOf(n: number, shape: GraphShape): string[][] {
  const cacheKey = `${n}:${shape}`
  const existing = copyCache.get(cacheKey)
  if (existing) return existing
  const { order, edges } = PATTERNS[shape]
  if (order > n) return []
  const copies = new Map<string, string[]>()
  const chosen: number[] = []
  function explore() {
    if (chosen.length === order) {
      const ids = edges.map(([a, b]) => edgeKey(chosen[a], chosen[b])).sort()
      const key = ids.join('|')
      if (!copies.has(key)) copies.set(key, ids)
      return
    }
    for (let vertex = 0; vertex < n; vertex++) {
      if (!chosen.includes(vertex)) { chosen.push(vertex); explore(); chosen.pop() }
    }
  }
  explore()
  const result = [...copies.values()]
  copyCache.set(cacheKey, result)
  return result
}

export type Violation = { color: Paint; edges: string[]; label: string }
export function findViolation(n: number, colors: Colors, challenge: Challenge, recent: string | null): Violation | null {
  const options: { color: Paint; shape: GraphShape }[] = [
    { color: 'red', shape: challenge.red },
    { color: 'blue', shape: challenge.blue },
  ]
  // First seek a copy involving the most recent edit. If another violation
  // persists, display that one instead, rather than claiming it was repaired.
  for (const prioritize of [true, false]) {
    for (const { color, shape } of options) {
      for (const edges of copiesOf(n, shape)) {
        if (prioritize && (!recent || !edges.includes(recent))) continue
        if (edges.every((id) => {
          const [a, b] = id.split('-').map(Number)
          return isWild(a, b) || colors[id] === color
        })) return { color, edges, label: PATTERNS[shape].label }
      }
    }
  }
  return null
}
