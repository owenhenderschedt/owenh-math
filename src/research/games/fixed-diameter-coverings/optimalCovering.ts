import type { Point } from './arrangements'

export type OptimalCovering = { center: Point; count: number }

type Event = { angle: number; change: 1 | -1 }

const TAU = 2 * Math.PI
// Match the tolerance used by insideDisk() in CoveringPointsGame.
const SCORE_TOLERANCE = 1e-12

function scoreAt(points: Point[], center: Point, radiusSquared: number) {
  let count = 0
  for (const point of points) {
    const dx = point.x - center.x
    const dy = point.y - center.y
    if (dx * dx + dy * dy <= radiusSquared + SCORE_TOLERANCE) count++
  }
  return count
}

function normalizeAngle(angle: number) {
  return ((angle % TAU) + TAU) % TAU
}

function sweepEvents(points: Point[], pivot: Point, radius: number) {
  const events: Event[] = []
  const allowableRadius = Math.sqrt(radius * radius + SCORE_TOLERANCE)
  let baseline = 1 // Pivot is inside every candidate disk on this circle.

  for (const point of points) {
    if (point === pivot) continue

    const dx = point.x - pivot.x
    const dy = point.y - pivot.y
    const distance = Math.hypot(dx, dy)

    if (distance + radius <= allowableRadius) {
      baseline++
      continue
    }
    if (distance > radius + allowableRadius) continue

    const cosine =
      (distance * distance + radius * radius - allowableRadius * allowableRadius) /
      (2 * distance * radius)
    const halfWidth = Math.acos(Math.max(-1, Math.min(1, cosine)))
    const direction = Math.atan2(dy, dx)
    const start = normalizeAngle(direction - halfWidth)
    const end = normalizeAngle(direction + halfWidth)

    if (start > end) baseline++
    events.push({ angle: start, change: 1 })
    events.push({ angle: end, change: -1 })
  }
  events.sort((a, b) => a.angle - b.angle)
  return { events, baseline }
}

function closestAngle(bearing: number, from: number, to: number) {
  let closest = from
  let closestDistance = Infinity
  for (const candidate of [bearing - TAU, bearing, bearing + TAU]) {
    const clamped = Math.max(from, Math.min(to, candidate))
    const separation = Math.abs(candidate - clamped)
    if (separation < closestDistance) {
      closestDistance = separation
      closest = clamped
    }
  }
  return closest
}

/**
 * Exact fixed-radius maximum-overlap search by angular sweeps.
 * For an optimal disk there is an equally good one with a point on
 * its boundary.  Each such disk is described by one angle around a
 * point, with coverage changing only at the event angles below.
 *
 * After finding the maximum, a second sweep chooses the nearest
 * optimal boundary center to the user's center.  If the user's disk
 * is already optimal, its center is returned unchanged.
 */
export function findOptimalCovering(
  points: Point[],
  radius: number,
  playerCenter: Point,
): OptimalCovering {
  if (!points.length) return { center: playerCenter, count: 0 }

  let maximum = 0
  for (const pivot of points) {
    const { events, baseline } = sweepEvents(points, pivot, radius)
    let active = baseline
    if (active > maximum) maximum = active

    let i = 0
    while (i < events.length) {
      const angle = events[i].angle
      let starts = 0
      let ends = 0
      while (i < events.length && events[i].angle === angle) {
        if (events[i].change > 0) starts++
        else ends++
        i++
      }
      if (active + starts > maximum) maximum = active + starts
      active += starts - ends
      if (active > maximum) maximum = active
    }
  }

  const playerScore = scoreAt(points, playerCenter, radius * radius)
  if (playerScore >= maximum) return { center: playerCenter, count: playerScore }

  let bestCenter: Point | null = null
  let bestDistanceSquared = Infinity
  const squaredRadius = radius * radius

  for (const pivot of points) {
    const { events, baseline } = sweepEvents(points, pivot, radius)
    const bearing = normalizeAngle(Math.atan2(
      playerCenter.y - pivot.y,
      playerCenter.x - pivot.x,
    ))
    let active = baseline
    let lastAngle = 0

    function consider(angle: number) {
      const x = pivot.x + radius * Math.cos(angle)
      const y = pivot.y + radius * Math.sin(angle)
      const d2 = (x - playerCenter.x) ** 2 + (y - playerCenter.y) ** 2
      if (d2 >= bestDistanceSquared - 1e-20) return

      const center = { x, y }
      // Guard against angular-rounding errors at boundary events.
      if (scoreAt(points, center, squaredRadius) !== maximum) return
      bestCenter = center
      bestDistanceSquared = d2
    }

    function considerInterval(from: number, to: number) {
      if (active !== maximum || to < from) return
      const angle = closestAngle(bearing, from, to)
      consider(angle)
      if (to - from > 1e-12) {
        // An event endpoint may be rounded to the outside of a closed disk.
        const shift = Math.min(1e-8, (to - from) / 4)
        consider(Math.min(to - shift, Math.max(from + shift, angle)))
      }
    }

    let i = 0
    while (i < events.length) {
      const angle = events[i].angle
      considerInterval(lastAngle, angle)

      let starts = 0
      let ends = 0
      while (i < events.length && events[i].angle === angle) {
        if (events[i].change > 0) starts++
        else ends++
        i++
      }
      if (active + starts === maximum) consider(angle)
      active += starts - ends
      lastAngle = angle
    }
    considerInterval(lastAngle, TAU)
  }

  if (!bestCenter) {
    // Numerical degeneracy: never claim an unverified optimal score.
    throw new Error('Could not verify the optimal disk numerically.')
  }
  return { center: bestCenter, count: maximum }
}
