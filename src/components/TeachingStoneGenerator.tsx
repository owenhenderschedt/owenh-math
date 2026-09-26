import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { ConvexGeometry } from 'three/addons/geometries/ConvexGeometry.js'

type Coordinate = {
  theta: number
  phi: number
  point: [number, number, number]
}

type BuildPhase =
  | 'idle'
  | 'revealing'
  | 'pause'
  | 'placing'
  | 'settling'
  | 'hullFade'
  | 'hullEdges'
  | 'hullFaces'
  | 'signingPause'
  | 'signing'
  | 'presenting'
  | 'complete'

type FaceData = {
  a: THREE.Vector3
  b: THREE.Vector3
  c: THREE.Vector3
  normal: THREE.Vector3
  area: number
}

type SignaturePlacement = {
  position: THREE.Vector3
  normal: THREE.Vector3
  quaternion: THREE.Quaternion
  width: number
  height: number
}

const POINT_COUNT = 20
const REVEAL_TIME = 115
const PAUSE_TIME = 1100
const STEP_TIME = 840
const IMPACT_TIME = 700
const SETTLE_TIME = 850
const SPHERE_FADE_TIME = 1000
const EDGE_DRAW_TIME = 1800
const FACE_FADE_TIME = 1000

const SIGNING_PAUSE_TIME = 700
const SIGN_TURN_TIME = 430
const SIGN_WRITE_TIME = 620
const SIGN_HOLD_TIME = 120
const SIGN_STEP_TIME =
  SIGN_TURN_TIME + SIGN_WRITE_TIME + SIGN_HOLD_TIME

const PRESENTATION_TIME = 2200

const SPHERE_RADIUS = 1.55

const NAMES = [
  'Emma',
  'Lucy',
  'Rosie',
  'Katherine',
  'Kelly',
  'Ann Marie',
  'Priya',
  'Zuri',
  'Hannah',
  'Olivia',
  'Owen',
  'Jim',
  'Dan',
  'Jack',
  'Ben',
  'Mateo',
  'Henry',
  'Jamal',
  'Alex',
  'Amir',
]

function handwritingFont(size: number) {
  return (
    `italic 700 ${size}px "Bradley Hand", ` +
    `"Segoe Print", "Comic Sans MS", cursive`
  )
}

function measureNameAspect(name: string) {
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')

  if (!context) return 2.6

  const fontSize = 150
  context.font = handwritingFont(fontSize)

  const textWidth = context.measureText(name).width + 70
  const textHeight = 205

  return THREE.MathUtils.clamp(
    textWidth / textHeight,
    1.35,
    4.7,
  )
}

function makeSignatureTexture(name: string) {
  const fontSize = 150

  const measuringCanvas = document.createElement('canvas')
  const measuringContext = measuringCanvas.getContext('2d')

  let measuredWidth = 500

  if (measuringContext) {
    measuringContext.font = handwritingFont(fontSize)
    measuredWidth =
      measuringContext.measureText(name).width + 70
  }

  const width = Math.ceil(
    THREE.MathUtils.clamp(
      measuredWidth,
      280,
      960,
    ),
  )

  const height = 205

  const sourceCanvas = document.createElement('canvas')
  sourceCanvas.width = width
  sourceCanvas.height = height

  const source = sourceCanvas.getContext('2d')

  if (source) {
    source.clearRect(0, 0, width, height)
    source.textAlign = 'left'
    source.textBaseline = 'middle'
    source.fillStyle = '#14271d'
    source.font = handwritingFont(fontSize)

    source.fillText(
      name,
      30,
      height / 2,
    )
  }

  const visibleCanvas = document.createElement('canvas')
  visibleCanvas.width = width
  visibleCanvas.height = height

  const visible = visibleCanvas.getContext('2d')

  const texture = new THREE.CanvasTexture(visibleCanvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.minFilter = THREE.LinearFilter
  texture.magFilter = THREE.LinearFilter

  return {
    sourceCanvas,
    visibleCanvas,
    visible,
    texture,
  }
}

function makeCoordinates(): Coordinate[] {
  return Array.from({ length: POINT_COUNT }, () => {
    const z = 2 * Math.random() - 1
    const theta = Math.acos(z)
    const phi = 2 * Math.PI * Math.random()

    const x =
      SPHERE_RADIUS *
      Math.sin(theta) *
      Math.cos(phi)

    const y =
      SPHERE_RADIUS *
      Math.sin(theta) *
      Math.sin(phi)

    const pointZ =
      SPHERE_RADIUS * Math.cos(theta)

    return {
      theta,
      phi,
      point: [x, y, pointZ],
    }
  })
}

function extractFaces(
  hullGeometry: ConvexGeometry,
): FaceData[] {
  const positions =
    hullGeometry.getAttribute('position')

  const faces: FaceData[] = []

  for (
    let i = 0;
    i < positions.count;
    i += 3
  ) {
    const a = new THREE.Vector3()
      .fromBufferAttribute(positions, i)

    const b = new THREE.Vector3()
      .fromBufferAttribute(positions, i + 1)

    const c = new THREE.Vector3()
      .fromBufferAttribute(positions, i + 2)

    const normal = new THREE.Vector3()
      .crossVectors(
        new THREE.Vector3().subVectors(b, a),
        new THREE.Vector3().subVectors(c, a),
      )
      .normalize()

    const centroid = new THREE.Vector3()
      .copy(a)
      .add(b)
      .add(c)
      .multiplyScalar(1 / 3)

    if (centroid.dot(normal) < 0) {
      normal.negate()
    }

    faces.push({
      a,
      b,
      c,
      normal,
      area: new THREE.Triangle(
        a,
        b,
        c,
      ).getArea(),
    })
  }

  return faces
}

function pointInsideTriangleWithMargin(
  point: THREE.Vector2,
  a: THREE.Vector2,
  b: THREE.Vector2,
  c: THREE.Vector2,
  margin = 0.028,
) {
  const denominator =
    (b.y - c.y) * (a.x - c.x) +
    (c.x - b.x) * (a.y - c.y)

  if (Math.abs(denominator) < 1e-8) {
    return false
  }

  const alpha =
    ((b.y - c.y) * (point.x - c.x) +
      (c.x - b.x) * (point.y - c.y)) /
    denominator

  const beta =
    ((c.y - a.y) * (point.x - c.x) +
      (a.x - c.x) * (point.y - c.y)) /
    denominator

  const gamma = 1 - alpha - beta

  return (
    alpha >= margin &&
    beta >= margin &&
    gamma >= margin
  )
}

function fitSignatureToFace(
  face: FaceData,
  aspect: number,
): SignaturePlacement | null {
  const { a, b, c, normal } = face

  const u = new THREE.Vector3()
    .subVectors(b, a)
    .normalize()

  const v = new THREE.Vector3()
    .crossVectors(normal, u)
    .normalize()

  const to2D = (point: THREE.Vector3) => {
    const offset =
      new THREE.Vector3().subVectors(point, a)

    return new THREE.Vector2(
      offset.dot(u),
      offset.dot(v),
    )
  }

  const a2 = new THREE.Vector2(0, 0)
  const b2 = to2D(b)
  const c2 = to2D(c)

  const candidates: THREE.Vector2[] = []

  const centroid2 = new THREE.Vector2()
    .copy(a2)
    .add(b2)
    .add(c2)
    .multiplyScalar(1 / 3)

  candidates.push(centroid2)

  const sideA = b.distanceTo(c)
  const sideB = a.distanceTo(c)
  const sideC = a.distanceTo(b)
  const perimeter =
    sideA + sideB + sideC

  if (perimeter > 0) {
    const incenter2 = new THREE.Vector2(
      (
        sideA * a2.x +
        sideB * b2.x +
        sideC * c2.x
      ) / perimeter,
      (
        sideA * a2.y +
        sideB * b2.y +
        sideC * c2.y
      ) / perimeter,
    )

    candidates.push(incenter2)
  }

  const steps = 7

  for (let i = 1; i < steps; i += 1) {
    for (
      let j = 1;
      j < steps - i;
      j += 1
    ) {
      const first = i / steps
      const second = j / steps
      const third = 1 - first - second

      if (third <= 0) continue

      candidates.push(
        new THREE.Vector2(
          first * a2.x +
            second * b2.x +
            third * c2.x,
          first * a2.y +
            second * b2.y +
            third * c2.y,
        ),
      )
    }
  }

  const maxEdge = Math.max(
    a.distanceTo(b),
    b.distanceTo(c),
    c.distanceTo(a),
  )

  let bestHeight = 0
  let bestCenter: THREE.Vector2 | null = null
  let bestAngle = 0

  const angleCount = 18

  for (const center of candidates) {
    for (
      let angleIndex = 0;
      angleIndex < angleCount;
      angleIndex += 1
    ) {
      const angle =
        (Math.PI * angleIndex) /
        angleCount

      const xDirection =
        new THREE.Vector2(
          Math.cos(angle),
          Math.sin(angle),
        )

      const yDirection =
        new THREE.Vector2(
          -Math.sin(angle),
          Math.cos(angle),
        )

      const fits = (height: number) => {
        const halfHeight = height / 2
        const halfWidth =
          (height * aspect) / 2

        const corners = [
          center
            .clone()
            .addScaledVector(
              xDirection,
              halfWidth,
            )
            .addScaledVector(
              yDirection,
              halfHeight,
            ),

          center
            .clone()
            .addScaledVector(
              xDirection,
              halfWidth,
            )
            .addScaledVector(
              yDirection,
              -halfHeight,
            ),

          center
            .clone()
            .addScaledVector(
              xDirection,
              -halfWidth,
            )
            .addScaledVector(
              yDirection,
              halfHeight,
            ),

          center
            .clone()
            .addScaledVector(
              xDirection,
              -halfWidth,
            )
            .addScaledVector(
              yDirection,
              -halfHeight,
            ),
        ]

        return corners.every((corner) =>
          pointInsideTriangleWithMargin(
            corner,
            a2,
            b2,
            c2,
          ),
        )
      }

      let low = 0
      let high = maxEdge

      for (
        let iteration = 0;
        iteration < 15;
        iteration += 1
      ) {
        const middle = (low + high) / 2

        if (fits(middle)) {
          low = middle
        } else {
          high = middle
        }
      }

      if (low > bestHeight) {
        bestHeight = low
        bestCenter = center.clone()
        bestAngle = angle
      }
    }
  }

  if (!bestCenter || bestHeight <= 0) {
    return null
  }

  const safeHeight =
    bestHeight * 0.975

  const safeWidth =
    safeHeight * aspect

  const worldPosition = a
    .clone()
    .addScaledVector(
      u,
      bestCenter.x,
    )
    .addScaledVector(
      v,
      bestCenter.y,
    )
    .addScaledVector(
      normal,
      0.038,
    )

  const xAxis = u
    .clone()
    .multiplyScalar(
      Math.cos(bestAngle),
    )
    .addScaledVector(
      v,
      Math.sin(bestAngle),
    )
    .normalize()

  const yAxis = new THREE.Vector3()
    .crossVectors(normal, xAxis)
    .normalize()

  const rotationMatrix =
    new THREE.Matrix4().makeBasis(
      xAxis,
      yAxis,
      normal,
    )

  const quaternion =
    new THREE.Quaternion()
      .setFromRotationMatrix(
        rotationMatrix,
      )

  return {
    position: worldPosition,
    normal: normal.clone(),
    quaternion,
    width: safeWidth,
    height: safeHeight,
  }
}

function makeSignaturePlacements(
  hullGeometry: ConvexGeometry,
) {
  const faces =
    extractFaces(hullGeometry)

  const namesByDifficulty =
    NAMES.map((name, index) => ({
      name,
      index,
      aspect: measureNameAspect(name),
    })).sort(
      (first, second) =>
        second.aspect - first.aspect,
    )

  const unusedFaces =
    new Set(
      faces.map((_, index) => index),
    )

  const placements =
    new Array<SignaturePlacement | null>(
      NAMES.length,
    ).fill(null)

  for (const item of namesByDifficulty) {
    let bestFaceIndex = -1
    let bestPlacement:
      | SignaturePlacement
      | null = null

    let bestScore = -Infinity

    for (const faceIndex of unusedFaces) {
      const placement =
        fitSignatureToFace(
          faces[faceIndex],
          item.aspect,
        )

      if (!placement) continue

      /*
       * Height controls actual handwriting size.
       * This deliberately favors faces where the
       * name can be written large, rather than
       * merely favoring raw triangular area.
       */
      const score =
        placement.height

      if (score > bestScore) {
        bestScore = score
        bestFaceIndex = faceIndex
        bestPlacement = placement
      }
    }

    if (
      bestPlacement &&
      bestFaceIndex >= 0
    ) {
      placements[item.index] =
        bestPlacement

      unusedFaces.delete(
        bestFaceIndex,
      )
    }
  }

  return placements.map(
    (placement, index) => {
      if (placement) return placement

      /*
       * Convex hulls generated here have more
       * than enough triangular faces, so this
       * branch is only a defensive fallback.
       */
      const face =
        faces[index % faces.length]

      return (
        fitSignatureToFace(
          face,
          measureNameAspect(
            NAMES[index],
          ),
        ) as SignaturePlacement
      )
    },
  )
}

function AnimatedVertex({
  position,
  newest,
}: {
  position: [number, number, number]
  newest: boolean
}) {
  const ref =
    useRef<THREE.Mesh>(null)

  const glowRef =
    useRef<THREE.Mesh>(null)

  useEffect(() => {
    if (ref.current) {
      ref.current.scale.setScalar(0.01)
    }

    if (glowRef.current) {
      glowRef.current.scale.setScalar(
        0.01,
      )
    }
  }, [])

  useFrame(() => {
    if (
      !ref.current ||
      !glowRef.current
    ) {
      return
    }

    const target =
      newest ? 1.3 : 1

    const scale =
      THREE.MathUtils.lerp(
        ref.current.scale.x,
        target,
        0.16,
      )

    ref.current.scale.setScalar(scale)

    const glowTarget =
      newest ? 2.5 : 0.01

    const glowScale =
      THREE.MathUtils.lerp(
        glowRef.current.scale.x,
        glowTarget,
        newest ? 0.2 : 0.1,
      )

    glowRef.current.scale.setScalar(
      glowScale,
    )
  })

  return (
    <group position={position}>
      <mesh ref={glowRef}>
        <sphereGeometry
          args={[0.05, 20, 20]}
        />

        <meshBasicMaterial
          color="#d8b45a"
          transparent
          opacity={
            newest ? 0.28 : 0
          }
          depthWrite={false}
        />
      </mesh>

      <mesh ref={ref}>
        <sphereGeometry
          args={[0.047, 24, 24]}
        />

        <meshStandardMaterial
          color={
            newest
              ? '#263d2d'
              : '#4f6557'
          }
          emissive={
            newest
              ? '#d8b45a'
              : '#000000'
          }
          emissiveIntensity={
            newest ? 0.55 : 0
          }
          roughness={0.3}
        />
      </mesh>
    </group>
  )
}

function Signature({
  name,
  placement,
  index,
  signingIndex,
  phase,
}: {
  name: string
  placement: SignaturePlacement
  index: number
  signingIndex: number
  phase: BuildPhase
}) {
  const penRef =
    useRef<THREE.Group>(null)

  const elapsedRef =
    useRef(0)

  const previousProgressRef =
    useRef(-1)

  const signature =
    useMemo(
      () =>
        makeSignatureTexture(name),
      [name],
    )

  useEffect(() => {
    return () => {
      signature.texture.dispose()
    }
  }, [signature])

  useEffect(() => {
    if (
      phase === 'signing' &&
      index === signingIndex
    ) {
      elapsedRef.current = 0
      previousProgressRef.current =
        -1
    }
  }, [
    phase,
    signingIndex,
    index,
  ])

  useFrame((_, delta) => {
    const finished =
      phase === 'presenting' ||
      phase === 'complete' ||
      (
        phase === 'signing' &&
        index < signingIndex
      )

    const active =
      phase === 'signing' &&
      index === signingIndex

    let progress = 0

    if (finished) {
      progress = 1
    } else if (active) {
      elapsedRef.current += delta

      const elapsedMilliseconds =
        elapsedRef.current * 1000

      progress =
        THREE.MathUtils.clamp(
          (
            elapsedMilliseconds -
            SIGN_TURN_TIME
          ) /
            SIGN_WRITE_TIME,
          0,
          1,
        )
    }

    if (
      Math.abs(
        progress -
          previousProgressRef.current,
      ) > 0.003
    ) {
      const {
        sourceCanvas,
        visibleCanvas,
        visible,
        texture,
      } = signature

      if (visible) {
        visible.clearRect(
          0,
          0,
          visibleCanvas.width,
          visibleCanvas.height,
        )

        if (progress > 0) {
          const revealWidth =
            Math.max(
              1,
              Math.floor(
                sourceCanvas.width *
                  progress,
              ),
            )

          visible.drawImage(
            sourceCanvas,
            0,
            0,
            revealWidth,
            sourceCanvas.height,
            0,
            0,
            revealWidth,
            sourceCanvas.height,
          )
        }

        texture.needsUpdate = true
      }

      previousProgressRef.current =
        progress
    }

    if (penRef.current) {
      const writing =
        active &&
        progress > 0 &&
        progress < 0.995

      penRef.current.visible =
        writing

      if (writing) {
        const x =
          -placement.width / 2 +
          placement.width *
            progress

        const strokeOne =
          Math.sin(
            progress * Math.PI * 8,
          )

        const strokeTwo =
          Math.sin(
            progress * Math.PI * 17,
          )

        const y =
          (
            strokeOne * 0.07 +
            strokeTwo * 0.025
          ) *
          placement.height

        penRef.current.position.set(
          x,
          y,
          0.085,
        )

        penRef.current.rotation.z =
          -0.58 +
          Math.sin(
            progress * Math.PI * 6,
          ) *
            0.055
      }
    }
  })

  return (
    <group
      position={placement.position}
      quaternion={
        placement.quaternion
      }
    >
      <mesh
        position={[0, 0, 0.018]}
      >
        <planeGeometry
          args={[
            placement.width,
            placement.height,
          ]}
        />

        <meshBasicMaterial
          map={signature.texture}
          transparent
          opacity={1}
          alphaTest={0.035}
          depthTest
          depthWrite={false}
          side={THREE.FrontSide}
        />
      </mesh>

      <group
        ref={penRef}
        position={[
          -placement.width / 2,
          0,
          0.085,
        ]}
        visible={false}
      >
        <mesh
          position={[
            0.075,
            0.105,
            0,
          ]}
          rotation={[
            0,
            0,
            -0.58,
          ]}
        >
          <cylinderGeometry
            args={[
              0.022,
              0.026,
              0.29,
              14,
            ]}
          />

          <meshStandardMaterial
            color="#244734"
            roughness={0.3}
          />
        </mesh>

        <mesh
          position={[
            0.004,
            0.012,
            0,
          ]}
          rotation={[
            0,
            0,
            -0.58,
          ]}
        >
          <coneGeometry
            args={[
              0.027,
              0.095,
              14,
            ]}
          />

          <meshStandardMaterial
            color="#c5a35e"
            roughness={0.26}
            metalness={0.08}
          />
        </mesh>

        <mesh
          position={[
            0,
            0,
            0.006,
          ]}
        >
          <sphereGeometry
            args={[
              0.018,
              12,
              12,
            ]}
          />

          <meshBasicMaterial
            color="#15261d"
          />
        </mesh>
      </group>
    </group>
  )
}

function ConvexHull({
  hullGeometry,
  edgeGeometry,
  signaturePlacements,
  phase,
  signingIndex,
}: {
  hullGeometry:
    | ConvexGeometry
    | null

  edgeGeometry:
    | THREE.EdgesGeometry
    | null

  signaturePlacements:
    SignaturePlacement[]

  phase: BuildPhase
  signingIndex: number
}) {
  const faceMaterialRef =
    useRef<THREE.MeshPhysicalMaterial>(
      null,
    )

  const edgeProgress =
    useRef(0)

  useEffect(() => {
    if (phase === 'hullEdges') {
      edgeProgress.current = 0

      if (edgeGeometry) {
        edgeGeometry.setDrawRange(
          0,
          0,
        )
      }
    }
  }, [phase, edgeGeometry])

  useFrame((_, delta) => {
    if (!edgeGeometry) return

    const totalVertices =
      edgeGeometry.attributes.position
        .count

    if (phase === 'hullEdges') {
      edgeProgress.current =
        Math.min(
          1,
          edgeProgress.current +
            delta /
              (
                EDGE_DRAW_TIME /
                1000
              ),
        )

      const visibleVertices =
        Math.floor(
          (
            totalVertices *
            edgeProgress.current
          ) /
            2,
        ) * 2

      edgeGeometry.setDrawRange(
        0,
        visibleVertices,
      )
    }

    if (
      phase === 'hullFaces' ||
      phase === 'signingPause' ||
      phase === 'signing' ||
      phase === 'presenting' ||
      phase === 'complete'
    ) {
      edgeGeometry.setDrawRange(
        0,
        totalVertices,
      )
    }

    if (faceMaterialRef.current) {
      const showFaces =
        phase === 'hullFaces' ||
        phase ===
          'signingPause' ||
        phase === 'signing' ||
        phase === 'presenting' ||
        phase === 'complete'

      /*
       * A brighter white surface gives
       * signatures enough contrast while
       * retaining the translucent 3D effect.
       */
      const targetOpacity =
        showFaces ? 0.46 : 0

      faceMaterialRef.current.opacity =
        THREE.MathUtils.lerp(
          faceMaterialRef.current
            .opacity,
          targetOpacity,
          phase === 'hullFaces'
            ? 0.06
            : 0.14,
        )
    }
  })

  if (
    !hullGeometry ||
    !edgeGeometry
  ) {
    return null
  }

  const hullVisible =
    phase === 'hullEdges' ||
    phase === 'hullFaces' ||
    phase === 'signingPause' ||
    phase === 'signing' ||
    phase === 'presenting' ||
    phase === 'complete'

  if (!hullVisible) {
    return null
  }

  const showSignatures =
    phase === 'signingPause' ||
    phase === 'signing' ||
    phase === 'presenting' ||
    phase === 'complete'

  return (
    <>
      <mesh geometry={hullGeometry}>
        <meshPhysicalMaterial
          ref={faceMaterialRef}
          color="#fffdf8"
          transparent
          opacity={0}
          roughness={0.8}
          metalness={0}
          side={THREE.FrontSide}
          depthWrite
        />
      </mesh>

      <lineSegments
        geometry={edgeGeometry}
      >
        <lineBasicMaterial
          color="#25382c"
          transparent
          opacity={0.9}
        />
      </lineSegments>

      {showSignatures &&
        signaturePlacements.map(
          (
            placement,
            index,
          ) => (
            <Signature
              key={`${NAMES[index]}-${index}`}
              name={NAMES[index]}
              placement={
                placement
              }
              index={index}
              signingIndex={
                signingIndex
              }
              phase={phase}
            />
          ),
        )}
    </>
  )
}

function SphereScene({
  coordinates,
  activeIndex,
  placedCount,
  phase,
  signingIndex,
}: {
  coordinates: Coordinate[]
  activeIndex: number
  placedCount: number
  phase: BuildPhase
  signingIndex: number
}) {
  const group =
    useRef<THREE.Group>(null)

  const sphereMaterial =
    useRef<THREE.MeshPhysicalMaterial>(
      null,
    )

  const gridMaterial =
    useRef<THREE.MeshBasicMaterial>(
      null,
    )

  const presentationBase =
    useRef(new THREE.Quaternion())

  const presentationElapsed =
    useRef(0)

  const hullGeometry =
    useMemo(() => {
      if (
        coordinates.length < 4
      ) {
        return null
      }

      return new ConvexGeometry(
        coordinates.map(
          (coordinate) =>
            new THREE.Vector3(
              ...coordinate.point,
            ),
        ),
      )
    }, [coordinates])

  const edgeGeometry =
    useMemo(() => {
      if (!hullGeometry) {
        return null
      }

      return new THREE.EdgesGeometry(
        hullGeometry,
        1,
      )
    }, [hullGeometry])

  const signaturePlacements =
    useMemo(() => {
      if (!hullGeometry) {
        return []
      }

      return makeSignaturePlacements(
        hullGeometry,
      )
    }, [hullGeometry])

  useEffect(() => {
    return () => {
      hullGeometry?.dispose()
      edgeGeometry?.dispose()
    }
  }, [
    hullGeometry,
    edgeGeometry,
  ])

  const pointTargetQuaternion =
    useMemo(() => {
      if (
        activeIndex < 0 ||
        activeIndex >=
          coordinates.length
      ) {
        return new THREE.Quaternion()
      }

      const point =
        new THREE.Vector3(
          ...coordinates[
            activeIndex
          ].point,
        ).normalize()

      return new THREE.Quaternion()
        .setFromUnitVectors(
          point,
          new THREE.Vector3(
            0,
            0.18,
            1,
          ).normalize(),
        )
    }, [
      activeIndex,
      coordinates,
    ])

  const signatureTargetQuaternion =
    useMemo(() => {
      if (
        signingIndex < 0 ||
        signingIndex >=
          signaturePlacements.length
      ) {
        return new THREE.Quaternion()
      }

      const placement =
        signaturePlacements[
          signingIndex
        ]

      const radial =
        placement.position
          .clone()
          .normalize()

      const aim =
        radial
          .lerp(
            placement.normal,
            0.34,
          )
          .normalize()

      const presentationPoint =
        new THREE.Vector3(
          0,
          0.08,
          1,
        ).normalize()

      return new THREE.Quaternion()
        .setFromUnitVectors(
          aim,
          presentationPoint,
        )
    }, [
      signingIndex,
      signaturePlacements,
    ])

  useEffect(() => {
    if (
      phase === 'presenting' &&
      group.current
    ) {
      presentationBase.current.copy(
        group.current.quaternion,
      )

      presentationElapsed.current = 0
    }
  }, [phase])

  useFrame((_, delta) => {
    if (!group.current) return

    if (
      phase === 'placing' &&
      activeIndex >= 0
    ) {
      group.current.quaternion.slerp(
        pointTargetQuaternion,
        0.14,
      )
    }

    if (
      phase === 'signing' &&
      signingIndex >= 0
    ) {
      group.current.quaternion.slerp(
        signatureTargetQuaternion,
        0.13,
      )
    }

    if (phase === 'presenting') {
      presentationElapsed.current += delta

      const progress = THREE.MathUtils.clamp(
        presentationElapsed.current /
          (PRESENTATION_TIME / 1000),
        0,
        1,
      )

      const envelope =
        Math.pow(1 - progress, 1.35)

      const angle =
        Math.sin(progress * Math.PI * 4.5) *
        0.16 *
        envelope

      const wiggle =
        new THREE.Quaternion().setFromAxisAngle(
          new THREE.Vector3(0, 1, 0),
          angle,
        )

      group.current.quaternion.copy(
        presentationBase.current,
      )

      group.current.quaternion.multiply(
        wiggle,
      )
    }

    const hideSphere =
      phase === 'hullFade' ||
      phase === 'hullEdges' ||
      phase === 'hullFaces' ||
      phase === 'signingPause' ||
      phase === 'signing' ||
      phase === 'presenting' ||
      phase === 'complete'

    const sphereTarget =
      hideSphere ? 0 : 0.28

    const gridTarget =
      hideSphere ? 0 : 0.18

    if (
      sphereMaterial.current
    ) {
      sphereMaterial.current.opacity =
        THREE.MathUtils.lerp(
          sphereMaterial.current
            .opacity,
          sphereTarget,
          phase === 'hullFade'
            ? 0.045
            : 0.12,
        )
    }

    if (gridMaterial.current) {
      gridMaterial.current.opacity =
        THREE.MathUtils.lerp(
          gridMaterial.current
            .opacity,
          gridTarget,
          phase === 'hullFade'
            ? 0.045
            : 0.12,
        )
    }
  })

  const building =
    phase !== 'idle' &&
    phase !== 'complete'

  return (
    <>
      <ambientLight
        intensity={1.75}
      />

      <directionalLight
        position={[4, 5, 6]}
        intensity={2.45}
      />

      <directionalLight
        position={[-3, 1, 4]}
        intensity={0.7}
      />

      <group ref={group}>
        <mesh>
          <sphereGeometry
            args={[
              SPHERE_RADIUS,
              64,
              64,
            ]}
          />

          <meshPhysicalMaterial
            ref={sphereMaterial}
            color="#d9e0da"
            transparent
            opacity={0.28}
            roughness={0.6}
            depthWrite={false}
          />
        </mesh>

        <mesh scale={1.002}>
          <sphereGeometry
            args={[
              SPHERE_RADIUS,
              32,
              32,
            ]}
          />

          <meshBasicMaterial
            ref={gridMaterial}
            color="#76877b"
            transparent
            opacity={0.18}
            wireframe
            depthWrite={false}
          />
        </mesh>

        <ConvexHull
          hullGeometry={
            hullGeometry
          }
          edgeGeometry={
            edgeGeometry
          }
          signaturePlacements={
            signaturePlacements
          }
          phase={phase}
          signingIndex={
            signingIndex
          }
        />

        {coordinates
          .slice(
            0,
            placedCount,
          )
          .map(
            (
              coordinate,
              index,
            ) => (
              <AnimatedVertex
                key={index}
                position={
                  coordinate.point
                }
                newest={
                  index ===
                    placedCount -
                      1 &&
                  phase ===
                    'placing'
                }
              />
            ),
          )}
      </group>

      <OrbitControls
        enablePan={false}
        enableZoom={false}
        enableRotate={!building}
        autoRotate={
          phase === 'idle' ||
          phase ===
            'revealing' ||
          phase === 'pause'
        }
        autoRotateSpeed={0.38}
      />
    </>
  )
}

function TeachingStoneGenerator() {
  const [
    coordinates,
    setCoordinates,
  ] =
    useState<Coordinate[]>([])

  const [
    revealedCount,
    setRevealedCount,
  ] = useState(0)

  const [
    activeIndex,
    setActiveIndex,
  ] = useState(-1)

  const [
    placedCount,
    setPlacedCount,
  ] = useState(0)

  const [
    signingIndex,
    setSigningIndex,
  ] = useState(0)

  const [phase, setPhase] =
    useState<BuildPhase>(
      'idle',
    )

  useEffect(() => {
    if (
      phase !== 'revealing'
    ) {
      return
    }

    if (
      revealedCount >=
      coordinates.length
    ) {
      setPhase('pause')
      return
    }

    const timer =
      window.setTimeout(() => {
        setRevealedCount(
          (current) =>
            current + 1,
        )
      }, REVEAL_TIME)

    return () =>
      window.clearTimeout(timer)
  }, [
    phase,
    revealedCount,
    coordinates.length,
  ])

  useEffect(() => {
    if (phase !== 'pause') {
      return
    }

    const timer =
      window.setTimeout(() => {
        setActiveIndex(0)
        setPhase('placing')
      }, PAUSE_TIME)

    return () =>
      window.clearTimeout(timer)
  }, [phase])

  useEffect(() => {
    if (
      phase !== 'placing' ||
      activeIndex < 0 ||
      coordinates.length === 0
    ) {
      return
    }

    const impactTimer =
      window.setTimeout(() => {
        setPlacedCount(
          activeIndex + 1,
        )
      }, IMPACT_TIME)

    const nextTimer =
      window.setTimeout(() => {
        if (
          activeIndex >=
          coordinates.length -
            1
        ) {
          setPhase('settling')
          return
        }

        setActiveIndex(
          (current) =>
            current + 1,
        )
      }, STEP_TIME)

    return () => {
      window.clearTimeout(
        impactTimer,
      )

      window.clearTimeout(
        nextTimer,
      )
    }
  }, [
    activeIndex,
    coordinates,
    phase,
  ])

  useEffect(() => {
    if (
      phase !== 'settling'
    ) {
      return
    }

    const timer =
      window.setTimeout(() => {
        setPhase('hullFade')
      }, SETTLE_TIME)

    return () =>
      window.clearTimeout(timer)
  }, [phase])

  useEffect(() => {
    if (
      phase !== 'hullFade'
    ) {
      return
    }

    const timer =
      window.setTimeout(() => {
        setPhase('hullEdges')
      }, SPHERE_FADE_TIME)

    return () =>
      window.clearTimeout(timer)
  }, [phase])

  useEffect(() => {
    if (
      phase !== 'hullEdges'
    ) {
      return
    }

    const timer =
      window.setTimeout(() => {
        setPhase('hullFaces')
      }, EDGE_DRAW_TIME)

    return () =>
      window.clearTimeout(timer)
  }, [phase])

  useEffect(() => {
    if (
      phase !== 'hullFaces'
    ) {
      return
    }

    const timer =
      window.setTimeout(() => {
        setPhase(
          'signingPause',
        )
      }, FACE_FADE_TIME)

    return () =>
      window.clearTimeout(timer)
  }, [phase])

  useEffect(() => {
    if (
      phase !==
      'signingPause'
    ) {
      return
    }

    const timer =
      window.setTimeout(() => {
        setSigningIndex(0)
        setPhase('signing')
      }, SIGNING_PAUSE_TIME)

    return () =>
      window.clearTimeout(timer)
  }, [phase])

  useEffect(() => {
    if (
      phase !== 'signing'
    ) {
      return
    }

    const timer =
      window.setTimeout(() => {
        if (
          signingIndex >=
          NAMES.length - 1
        ) {
          setPhase('presenting')
          return
        }

        setSigningIndex(
          (current) =>
            current + 1,
        )
      }, SIGN_STEP_TIME)

    return () =>
      window.clearTimeout(timer)
  }, [
    phase,
    signingIndex,
  ])

  useEffect(() => {
    if (phase !== 'presenting') {
      return
    }

    const timer =
      window.setTimeout(() => {
        setPhase('complete')
      }, PRESENTATION_TIME)

    return () =>
      window.clearTimeout(timer)
  }, [phase])

  const generate = () => {
    const nextCoordinates =
      makeCoordinates()

    setCoordinates(
      nextCoordinates,
    )

    setRevealedCount(0)
    setPlacedCount(0)
    setActiveIndex(-1)
    setSigningIndex(0)
    setPhase('revealing')
  }

  const activeCoordinate =
    activeIndex >= 0 &&
    activeIndex <
      coordinates.length
      ? coordinates[
          activeIndex
        ]
      : null

  const building =
    phase !== 'idle' &&
    phase !== 'complete'

  return (
    <section className="stone-generator">
      <div className="stone-generator-stage">
        <div className="stone-canvas-wrap">
          {(phase === 'presenting' ||
            phase === 'complete') && (
            <div className="stone-explore-hint">
              Click and drag to explore the stone
            </div>
          )}

          <Canvas
            camera={{
              position: [
                0,
                0,
                5.15,
              ],
              fov: 42,
            }}
          >
            <SphereScene
              coordinates={
                coordinates
              }
              activeIndex={
                activeIndex
              }
              placedCount={
                placedCount
              }
              phase={phase}
              signingIndex={
                signingIndex
              }
            />
          </Canvas>
        </div>

        <aside className="coordinate-tray">
          {coordinates.length ===
          0 ? (
            <div className="coordinate-empty">
              Coordinates will
              appear here.
            </div>
          ) : (
            <div className="coordinate-tray-inner">
              <div className="coordinate-heading">
                Class size: 20
              </div>

              <div className="coordinate-grid">
                {coordinates
                  .slice(
                    0,
                    revealedCount,
                  )
                  .map(
                    (
                      coordinate,
                      index,
                    ) => (
                      <div
                        className={[
                          'coordinate-row',

                          index ===
                              activeIndex &&
                          phase ===
                            'placing'
                            ? 'active'
                            : '',

                          index <
                          placedCount
                            ? 'placed'
                            : '',
                        ]
                          .filter(
                            Boolean,
                          )
                          .join(
                            ' ',
                          )}
                        key={
                          index
                        }
                      >
                        <strong>
                          (
                          {coordinate.theta.toFixed(
                            2,
                          )}
                          ,{' '}
                          {coordinate.phi.toFixed(
                            2,
                          )}
                          )
                        </strong>
                      </div>
                    ),
                  )}
              </div>
            </div>
          )}
        </aside>

        {phase ===
          'placing' &&
          activeCoordinate && (
            <div
              className="coordinate-flight"
              key={
                activeIndex
              }
            >
              (
              {activeCoordinate.theta.toFixed(
                2,
              )}
              ,{' '}
              {activeCoordinate.phi.toFixed(
                2,
              )}
              )
            </div>
          )}
      </div>

      <button
        className="stone-generate-button"
        type="button"
        onClick={generate}
        disabled={building}
      >
        {phase ===
        'revealing'
          ? 'Gathering Class Coordinates…'
          : phase === 'pause'
            ? 'Coordinates Ready…'
            : phase ===
                'placing'
              ? 'Building Teaching Stone…'
              : phase ===
                  'settling'
                ? 'Points Placed…'
                : phase ===
                      'hullFade' ||
                    phase ===
                      'hullEdges' ||
                    phase ===
                      'hullFaces'
                  ? 'Forming Convex Hull…'
                  : phase ===
                        'signingPause' ||
                      phase ===
                        'signing'
                    ? 'Signing Teaching Stone…'
                    : phase ===
                        'presenting'
                      ? 'Teaching Stone Complete'
                      : 'Generate a Teaching Stone'}
      </button>
    </section>
  )
}

export default TeachingStoneGenerator
