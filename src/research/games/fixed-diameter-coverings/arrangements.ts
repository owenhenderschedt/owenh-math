export type Point = {
  x: number
  y: number
}

export type Arrangement = {
  id: string
  name: string
  makePoints: () => Point[]
  extremalFor?: 'quarter' | 'half' | 'jung'
}

const N = 1000
const TAU = 2 * Math.PI
const SQRT3 = Math.sqrt(3)

function seededRandom(seed: number) {
  let state = seed >>> 0

  return () => {
    state = (1664525 * state + 1013904223) >>> 0
    return state / 4294967296
  }
}

/*
 * If every point lies in the radius-1/2 disk, the diameter is
 * at most 1. Adding these two antipodal points makes it exactly 1.
 */
export function findDiameterPair(
  points: Point[],
): [Point, Point] {
  if (points.length < 2) {
    throw new Error('A point arrangement needs at least two points.')
  }

  let bestA = points[0]
  let bestB = points[1]
  let bestDistanceSquared = -1

  for (let i = 0; i < points.length; i += 1) {
    for (let j = i + 1; j < points.length; j += 1) {
      const dx = points[i].x - points[j].x
      const dy = points[i].y - points[j].y

      const distanceSquared = dx * dx + dy * dy

      if (distanceSquared > bestDistanceSquared) {
        bestDistanceSquared = distanceSquared
        bestA = points[i]
        bestB = points[j]
      }
    }
  }

  return [bestA, bestB]
}


/*
 * Preserve the arrangement exactly up to translation and
 * uniform scaling, but make its TRUE diameter equal to 1.
 *
 * No artificial points are introduced.
 */
function normalizeDiameter(points: Point[]): Point[] {
  const [a, b] = findDiameterPair(points)

  const diameter = Math.hypot(
    a.x - b.x,
    a.y - b.y,
  )

  if (diameter === 0) {
    throw new Error('Cannot normalize a zero-diameter arrangement.')
  }

  /*
   * Center the bounding box so the configuration remains
   * naturally placed inside the square playing region.
   */
  let minX = Infinity
  let maxX = -Infinity
  let minY = Infinity
  let maxY = -Infinity

  for (const point of points) {
    minX = Math.min(minX, point.x)
    maxX = Math.max(maxX, point.x)
    minY = Math.min(minY, point.y)
    maxY = Math.max(maxY, point.y)
  }

  const centerX = (minX + maxX) / 2
  const centerY = (minY + maxY) / 2

  return points.map((point) => ({
    x: (point.x - centerX) / diameter,
    y: (point.y - centerY) / diameter,
  }))
}

function addCluster(
  points: Point[],
  center: Point,
  count: number,
  radius: number,
  random: () => number,
) {
  for (let i = 0; i < count; i += 1) {
    const angle = TAU * random()
    const localRadius = radius * Math.sqrt(random())

    points.push({
      x: center.x + localRadius * Math.cos(angle),
      y: center.y + localRadius * Math.sin(angle),
    })
  }
}


/* =========================================================
   1. RANDOM CLOUD
   Truly new every time the arrangement is loaded.
   ========================================================= */

function randomCloud(): Point[] {
  const points: Point[] = []

  for (let i = 0; i < N; i += 1) {
    const angle = TAU * Math.random()
    const radius = 0.48 * Math.sqrt(Math.random())

    points.push({
      x: radius * Math.cos(angle),
      y: radius * Math.sin(angle),
    })
  }

  return normalizeDiameter(points)
}


/* =========================================================
   2. THREE CITIES
   Three obvious targets, but with different populations.
   ========================================================= */

function threeCities(): Point[] {
  const random = seededRandom(31173)
  const points: Point[] = []

  addCluster(
    points,
    { x: -0.24, y: -0.12 },
    390,
    0.095,
    random,
  )

  addCluster(
    points,
    { x: 0.24, y: -0.12 },
    330,
    0.095,
    random,
  )

  addCluster(
    points,
    { x: 0.02, y: 0.245 },
    280,
    0.10,
    random,
  )

  return normalizeDiameter(points)
}


/* =========================================================
   3. CROWN
   Unequal densities on the three sides of a Reuleaux triangle.
   Five nearby bands keep the dots visually discrete.
   ========================================================= */

function crown(): Point[] {
  const points: Point[] = []

  const A = { x: -0.5, y: -SQRT3 / 6 }
  const B = { x: 0.5, y: -SQRT3 / 6 }
  const C = { x: 0, y: SQRT3 / 3 }

  const bands = [1, 0.95, 0.90, 0.85, 0.80]

  function addArc(
    center: Point,
    start: number,
    end: number,
    total: number,
  ) {
    const base = Math.floor(total / bands.length)
    let remainder = total % bands.length

    bands.forEach((scale) => {
      const count = base + (remainder-- > 0 ? 1 : 0)

      for (let i = 0; i < count; i += 1) {
        const t = count === 1 ? 0.5 : i / (count - 1)
        const angle = start + t * (end - start)

        const boundary = {
          x: center.x + Math.cos(angle),
          y: center.y + Math.sin(angle),
        }

        points.push({
          x: scale * boundary.x,
          y: scale * boundary.y,
        })
      }
    })
  }

  // AB arc centered at C
  addArc(C, 4 * Math.PI / 3, 5 * Math.PI / 3, 430)

  // BC arc centered at A
  addArc(A, 0, Math.PI / 3, 330)

  // CA arc centered at B
  addArc(B, 2 * Math.PI / 3, Math.PI, 240)

  return normalizeDiameter(points)
}


/* =========================================================
   4. ORBIT + MOONS
   A sparse halo competes with three unequal dense satellites.
   ========================================================= */

function orbitAndMoons(): Point[] {
  const random = seededRandom(77713)
  const points: Point[] = []

  for (let i = 0; i < 220; i += 1) {
    const angle = TAU * i / 220

    points.push({
      x: 0.44 * Math.cos(angle),
      y: 0.44 * Math.sin(angle),
    })
  }

  addCluster(
    points,
    { x: 0.25, y: 0.15 },
    300,
    0.065,
    random,
  )

  addCluster(
    points,
    { x: -0.26, y: 0.10 },
    260,
    0.065,
    random,
  )

  addCluster(
    points,
    { x: 0.02, y: -0.27 },
    220,
    0.065,
    random,
  )

  return normalizeDiameter(points)
}


/* =========================================================
   5. BRIDGE
   Two dense lobes joined by a thick curved bridge.
   ========================================================= */

function bridge(): Point[] {
  const random = seededRandom(49201)
  const points: Point[] = []

  addCluster(
    points,
    { x: -0.285, y: 0.08 },
    350,
    0.075,
    random,
  )

  addCluster(
    points,
    { x: 0.285, y: -0.07 },
    340,
    0.075,
    random,
  )

  const bridgeCount = 310

  for (let i = 0; i < bridgeCount; i += 1) {
    const lane = (i % 5) - 2
    const index = Math.floor(i / 5)
    const laneCount = Math.ceil(bridgeCount / 5)

    const t =
      laneCount <= 1 ? 0 : index / (laneCount - 1)

    const x = -0.23 + 0.46 * t
    const curve = 0.075 * Math.sin(Math.PI * t)

    points.push({
      x,
      y: curve + lane * 0.012,
    })
  }

  return normalizeDiameter(points)
}


/* =========================================================
   6. HEXAGON RIM
   KEEP THIS ONE:
   four concentric hexagons, 250 points each.
   The puzzle is inner density versus multi-layer overlap.
   ========================================================= */

function pointOnHexagon(t: number): Point {
  const vertices = Array.from({ length: 6 }, (_, i) => {
    const angle = TAU * i / 6

    return {
      x: 0.5 * Math.cos(angle),
      y: 0.5 * Math.sin(angle),
    }
  })

  const position = 6 * t
  const side = Math.floor(position) % 6
  const local = position - Math.floor(position)

  const a = vertices[side]
  const b = vertices[(side + 1) % 6]

  return {
    x: a.x + local * (b.x - a.x),
    y: a.y + local * (b.y - a.y),
  }
}

function hexagonRim(): Point[] {
  const scales = [1, 0.82, 0.64, 0.46]
  const points: Point[] = []

  scales.forEach((scale, layer) => {
    for (let i = 0; i < 250; i += 1) {
      const t =
        (i + (layer % 2 === 0 ? 0 : 0.5)) / 250

      const outer = pointOnHexagon(t % 1)

      points.push({
        x: scale * outer.x,
        y: scale * outer.y,
      })
    }
  })

  return normalizeDiameter(points)
}


/* =========================================================
   7. PINWHEEL
   Four curved arms with deliberately unequal populations.
   ========================================================= */

function pinwheel(): Point[] {
  const counts = [310, 270, 230, 190]
  const points: Point[] = []

  counts.forEach((count, arm) => {
    for (let i = 0; i < count; i += 1) {
      const t = count === 1 ? 0 : i / (count - 1)

      const lane = (i % 5) - 2

      const radius = 0.055 + 0.395 * t

      const angle =
        arm * Math.PI / 2 +
        1.05 * t +
        lane * 0.018

      points.push({
        x: radius * Math.cos(angle),
        y: radius * Math.sin(angle),
      })
    }
  })

  return normalizeDiameter(points)
}


/* =========================================================
   8. CONSTELLATION
   Nine recognizable clusters with unequal weights.
   ========================================================= */

function constellation(): Point[] {
  const random = seededRandom(20261007)

  const counts = [
    150, 135, 125, 115,
    105, 95, 85, 75,
  ]

  const points: Point[] = []

  counts.forEach((count, i) => {
    const angle = TAU * i / counts.length

    addCluster(
      points,
      {
        x: 0.335 * Math.cos(angle),
        y: 0.335 * Math.sin(angle),
      },
      count,
      0.038,
      random,
    )
  })

  addCluster(
    points,
    { x: 0, y: 0 },
    115,
    0.045,
    random,
  )

  return normalizeDiameter(points)
}


/* =========================================================
   9. CENTER VS RIM
   Central density competes with combinations of rim clusters.
   ========================================================= */

function centerVsRim(): Point[] {
  const random = seededRandom(55109)
  const points: Point[] = []

  addCluster(
    points,
    { x: 0, y: 0 },
    330,
    0.085,
    random,
  )

  const rimCounts = [155, 140, 125, 115, 135]

  rimCounts.forEach((count, i) => {
    const angle =
      -Math.PI / 2 + TAU * i / rimCounts.length

    addCluster(
      points,
      {
        x: 0.34 * Math.cos(angle),
        y: 0.34 * Math.sin(angle),
      },
      count,
      0.048,
      random,
    )
  })

  return normalizeDiameter(points)
}


/* =========================================================
   10. BROKEN LATTICE
   A rigid triangular lattice with strategically missing regions.
   ========================================================= */

function brokenLattice(): Point[] {
  const candidates: Point[] = []

  const step = 0.018
  const vertical = step * SQRT3 / 2

  let row = 0

  for (let y = -0.48; y <= 0.48; y += vertical) {
    const offset = row % 2 === 0 ? 0 : step / 2

    for (let x = -0.48; x <= 0.48; x += step) {
      const xx = x + offset

      /*
       * Start with a genuine triangular lattice inside a disk.
       */
      if (xx * xx + y * y > 0.47 * 0.47) {
        continue
      }

      /*
       * Remove a broad diagonal "crack".
       *
       * Its slight waviness prevents the two surviving pieces
       * from being trivially symmetric.
       */
      const crackCenter =
        0.58 * xx +
        0.035 * Math.sin(12 * xx)

      const inMainCrack =
        Math.abs(y - crackCenter) < 0.055

      /*
       * A smaller secondary fracture near the upper-left region.
       */
      const inSecondaryCrack =
        xx < -0.08 &&
        y > 0.11 &&
        Math.abs(y + 0.8 * xx - 0.24) < 0.035

      if (!inMainCrack && !inSecondaryCrack) {
        candidates.push({ x: xx, y })
      }
    }

    row += 1
  }

  /*
   * Sample evenly through the surviving lattice so the final
   * arrangement has exactly 1000 points while preserving the
   * rigid lattice appearance.
   */
  const points: Point[] = []

  for (let i = 0; i < N; i += 1) {
    const index = Math.floor(
      i * candidates.length / N,
    )

    points.push(candidates[index])
  }

  return normalizeDiameter(points)
}


/* =========================================================
   11. TWO CRESCENTS
   Unequal thick crescent bands with overlap competition.
   ========================================================= */

function twoCrescents(): Point[] {
  const points: Point[] = []

  function addMoon(
    count: number,
    centerX: number,
    direction: number,
  ) {
    const bands = [0.245, 0.265, 0.285, 0.305, 0.325]

    for (let i = 0; i < count; i += 1) {
      const band = i % bands.length
      const index = Math.floor(i / bands.length)
      const bandCount = Math.ceil(count / bands.length)

      const t =
        bandCount <= 1 ? 0 : index / (bandCount - 1)

      const angle =
        -0.70 * Math.PI +
        1.40 * Math.PI * t

      const radius = bands[band]

      points.push({
        x:
          centerX +
          direction * radius * Math.cos(angle),
        y: radius * Math.sin(angle),
      })
    }
  }

  addMoon(560, -0.125, 1)
  addMoon(440, 0.125, -1)

  const maxNorm = Math.max(
    ...points.map((point) =>
      Math.hypot(point.x, point.y),
    ),
  )

  const scale =
    maxNorm > 0.47 ? 0.47 / maxNorm : 1

  const scaled = points.map((point) => ({
    x: scale * point.x,
    y: scale * point.y,
  }))

  return normalizeDiameter(scaled)
}


/* =========================================================
   12. PERFECT RING
   Deliberately symmetric baseline.
   ========================================================= */

function perfectRing(): Point[] {
  const radii = [0.5, 0.42, 0.34, 0.26, 0.18]
  const points: Point[] = []

  radii.forEach((radius, ring) => {
    for (let i = 0; i < 200; i += 1) {
      const angle =
        TAU * i / 200 +
        (ring % 2 === 0 ? 0 : Math.PI / 200)

      points.push({
        x: radius * Math.cos(angle),
        y: radius * Math.sin(angle),
      })
    }
  })

  return normalizeDiameter(points)
}


/* =========================================================
   13. QUARTER EXTREMAL
   ========================================================= */

function quarterExtremal(): Point[] {
  const innerCount = 143
  const outerCount = N - innerCount

  const outerRadius =
    0.5 / Math.cos(Math.PI / (2 * outerCount))

  const innerRadius = 0.07

  /*
   * Spread the 143 central points through the tiny disk rather
   * than putting them all on one circumference.  This makes
   * them visibly individual points while keeping the entire
   * central population inside the same epsilon-neighborhood.
   */
  const goldenAngle =
    Math.PI * (3 - Math.sqrt(5))

  const inner = Array.from(
    { length: innerCount },
    (_, i) => {
      const radius =
        innerRadius *
        Math.sqrt((i + 0.5) / innerCount)

      const angle = i * goldenAngle

      return {
        x: radius * Math.cos(angle),
        y: radius * Math.sin(angle),
      }
    },
  )

  const outer = Array.from(
    { length: outerCount },
    (_, i) => {
      const angle = TAU * i / outerCount

      return {
        x: outerRadius * Math.cos(angle),
        y: outerRadius * Math.sin(angle),
      }
    },
  )

  return normalizeDiameter([...inner, ...outer])
}


/* =========================================================
   14. JUNG EXTREMAL
   ========================================================= */

function jungExtremal(): Point[] {
  /*
   * The three vertices alone force equality in Jung's theorem.
   *
   * Instead of piling the other 997 points almost directly on
   * those vertices, spread them through three visible triangular
   * corner clouds.  Every point remains inside the unit
   * equilateral triangle, so the diameter is still exactly 1.
   */
  const vertices: Point[] = [
    { x: -0.5, y: -SQRT3 / 6 },
    { x: 0.5, y: -SQRT3 / 6 },
    { x: 0, y: SQRT3 / 3 },
  ]

  const points: Point[] = [...vertices]

  const counts = [333, 332, 332]
  const depth = 0.28

  const randoms = [
    seededRandom(173),
    seededRandom(271),
    seededRandom(419),
  ]

  vertices.forEach((vertex, corner) => {
    const firstOther =
      vertices[(corner + 1) % 3]

    const secondOther =
      vertices[(corner + 2) % 3]

    const random = randoms[corner]

    for (let i = 0; i < counts[corner]; i += 1) {
      /*
       * Uniformly sample a small triangular region adjacent
       * to this vertex using barycentric coordinates.
       */
      let u = random()
      let v = random()

      if (u + v > 1) {
        u = 1 - u
        v = 1 - v
      }

      const a = depth * u
      const b = depth * v

      points.push({
        x:
          vertex.x +
          a * (firstOther.x - vertex.x) +
          b * (secondOther.x - vertex.x),

        y:
          vertex.y +
          a * (firstOther.y - vertex.y) +
          b * (secondOther.y - vertex.y),
      })
    }
  })

  return normalizeDiameter(points)
}


/* =========================================================
   14. HALF EXTREMAL

   Visual version of the sharp r = 1/2 construction.

   The true construction places non-equally-spaced points on
   three corresponding pieces of the boundary of a unit
   Reuleaux triangle, with 3-fold rotational symmetry.

   Here we preserve that geometry and recursive-looking
   concentration, but give each boundary arm a very small
   inward thickness so that 1000 points remain visually
   distinguishable on screen.
   ========================================================= */

function halfExtremal(): Point[] {
  const vertices: Point[] = [
    { x: -0.5, y: -SQRT3 / 6 },
    { x: 0.5, y: -SQRT3 / 6 },
    { x: 0, y: SQRT3 / 3 },
  ]

  const points: Point[] = [...vertices]
  const counts = [333, 332, 332]
  const random = seededRandom(42719)

  for (let side = 0; side < 3; side += 1) {
    const center = vertices[side]
    const a = vertices[(side + 1) % 3]
    const b = vertices[(side + 2) % 3]

    const startAngle = Math.atan2(
      a.y - center.y,
      a.x - center.x,
    )

    const endAngle = Math.atan2(
      b.y - center.y,
      b.x - center.x,
    )

    let sweep = endAngle - startAngle

    while (sweep > Math.PI) sweep -= 2 * Math.PI
    while (sweep < -Math.PI) sweep += 2 * Math.PI

    for (let i = 0; i < counts[side]; i += 1) {
      const t = (i + 0.5) / counts[side]
      const theta = startAngle + sweep * t

      // Narrow inward ribbon following the genuine arc.
      const inset = 0.018 * random()
      const radius = 1 - inset

      points.push({
        x: center.x + radius * Math.cos(theta),
        y: center.y + radius * Math.sin(theta),
      })
    }
  }

  return normalizeDiameter(points)
}

export const arrangements: Arrangement[] = [
  {
    id: 'random-cloud',
    name: 'Random Cloud',
    makePoints: randomCloud,
  },
  {
    id: 'three-cities',
    name: 'Three Cities',
    makePoints: threeCities,
  },
  {
    id: 'crown',
    name: 'Crown',
    makePoints: crown,
  },
  {
    id: 'orbit-and-moons',
    name: 'Orbit + Moons',
    makePoints: orbitAndMoons,
  },
  {
    id: 'bridge',
    name: 'Bridge',
    makePoints: bridge,
  },
  {
    id: 'hexagon-rim',
    name: 'Hexagon Rim',
    makePoints: hexagonRim,
  },
  {
    id: 'pinwheel',
    name: 'Pinwheel',
    makePoints: pinwheel,
  },
  {
    id: 'constellation',
    name: 'Constellation',
    makePoints: constellation,
  },
  {
    id: 'center-vs-rim',
    name: 'Center vs Rim',
    makePoints: centerVsRim,
  },
  {
    id: 'broken-lattice',
    name: 'Broken Lattice',
    makePoints: brokenLattice,
  },
  {
    id: 'two-crescents',
    name: 'Two Crescents',
    makePoints: twoCrescents,
  },
  {
    id: 'perfect-ring',
    name: 'Perfect Ring',
    makePoints: perfectRing,
  },
  {
    id: 'quarter-extremal',
    name: 'Quarter Extremal',
    makePoints: quarterExtremal,
    extremalFor: 'quarter',
  },
  {
    id: 'half-extremal',
    name: 'Reuleaux Triangle',
    makePoints: halfExtremal,
  },
  {
    id: 'jung-extremal',
    name: 'Jung Extremal',
    makePoints: jungExtremal,
    extremalFor: 'jung',
  },
]
