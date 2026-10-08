import { findOptimalCovering } from './optimalCovering'
import type { Point } from './arrangements'

self.onmessage = (event: MessageEvent<{
  points: Point[]
  radius: number
  playerCenter: Point
}>) => {
  const { points, radius, playerCenter } = event.data
  try {
    self.postMessage(findOptimalCovering(points, radius, playerCenter))
  } catch (error) {
    self.postMessage({ error: error instanceof Error ? error.message : String(error) })
  }
}
