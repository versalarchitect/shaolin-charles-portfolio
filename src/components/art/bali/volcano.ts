import * as THREE from 'three'
import { BaliMaterials } from './materials'

/**
 * Mount Agung - Sacred Volcano of Bali
 *
 * The highest point and most sacred mountain in Bali
 * Creates the dramatic backdrop silhouette
 */

/**
 * Create volcanic mountain silhouette
 */
export function createVolcano(
  materials: BaliMaterials,
  height: number = 30,
  baseRadius: number = 40,
  position: THREE.Vector3 = new THREE.Vector3()
): THREE.Group {
  const volcano = new THREE.Group()

  // Main volcanic cone
  const volcanoGeometry = createVolcanoGeometry(height, baseRadius)

  // Dark volcanic material with subtle detail
  const volcanoMaterial = new THREE.MeshStandardMaterial({
    color: 0x1a1a2a,
    roughness: 0.95,
    metalness: 0.0,
    flatShading: true, // Gives rocky appearance
  })

  const volcanoCone = new THREE.Mesh(volcanoGeometry, volcanoMaterial)
  volcanoCone.castShadow = true
  volcanoCone.receiveShadow = true
  volcano.add(volcanoCone)

  // Snow cap at peak (during certain seasons)
  const snowCapGeometry = createSnowCapGeometry(height * 0.15, height * 0.85)
  const snowMaterial = new THREE.MeshStandardMaterial({
    color: 0xeeeeff,
    roughness: 0.8,
    metalness: 0.0,
  })
  const snowCap = new THREE.Mesh(snowCapGeometry, snowMaterial)
  volcano.add(snowCap)

  // Crater at top
  const craterGeometry = new THREE.CylinderGeometry(
    height * 0.08,
    height * 0.1,
    height * 0.05,
    16,
    1,
    true
  )
  const craterMaterial = new THREE.MeshStandardMaterial({
    color: 0x0a0a0a,
    roughness: 1.0,
    side: THREE.DoubleSide,
  })
  const crater = new THREE.Mesh(craterGeometry, craterMaterial)
  crater.position.y = height * 0.97
  volcano.add(crater)

  // Subtle smoke from crater
  const smokeGroup = createVolcanicSmoke(height)
  volcano.add(smokeGroup)

  volcano.position.copy(position)

  return volcano
}

/**
 * Generate volcanic cone geometry with natural irregularity
 */
function createVolcanoGeometry(
  height: number,
  baseRadius: number
): THREE.BufferGeometry {
  const segments = 32
  const rings = 16

  const positions: number[] = []
  const normals: number[] = []
  const indices: number[] = []

  // Generate vertices
  for (let ring = 0; ring <= rings; ring++) {
    const t = ring / rings
    const y = t * height

    // Radius decreases non-linearly towards top
    const ringRadius = baseRadius * Math.pow(1 - t, 0.7)

    for (let seg = 0; seg <= segments; seg++) {
      const angle = (seg / segments) * Math.PI * 2

      // Add noise for natural irregularity
      const noise = (
        Math.sin(angle * 5 + t * 10) * 0.05 +
        Math.sin(angle * 13 + t * 7) * 0.03
      ) * ringRadius

      const x = Math.cos(angle) * (ringRadius + noise)
      const z = Math.sin(angle) * (ringRadius + noise)

      positions.push(x, y, z)

      // Calculate normal
      const nx = Math.cos(angle)
      const nz = Math.sin(angle)
      const ny = ringRadius / height * 2
      const len = Math.sqrt(nx * nx + ny * ny + nz * nz)
      normals.push(nx / len, ny / len, nz / len)
    }
  }

  // Generate indices
  for (let ring = 0; ring < rings; ring++) {
    for (let seg = 0; seg < segments; seg++) {
      const current = ring * (segments + 1) + seg
      const next = current + segments + 1

      indices.push(current, next, current + 1)
      indices.push(current + 1, next, next + 1)
    }
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3))
  geometry.setIndex(indices)

  return geometry
}

/**
 * Create snow cap geometry
 */
function createSnowCapGeometry(height: number, startY: number): THREE.BufferGeometry {
  const segments = 24
  const rings = 8

  const positions: number[] = []
  const normals: number[] = []
  const indices: number[] = []

  const peakRadius = height * 0.5

  for (let ring = 0; ring <= rings; ring++) {
    const t = ring / rings
    const y = startY + t * height

    // Snow follows volcanic slope but slightly offset
    const ringRadius = peakRadius * (1 - t)

    for (let seg = 0; seg <= segments; seg++) {
      const angle = (seg / segments) * Math.PI * 2

      // Irregular snow edge
      const edgeNoise = Math.sin(angle * 8) * 0.1 * ringRadius

      const x = Math.cos(angle) * (ringRadius + edgeNoise)
      const z = Math.sin(angle) * (ringRadius + edgeNoise)

      positions.push(x, y, z)
      normals.push(Math.cos(angle) * 0.3, 0.9, Math.sin(angle) * 0.3)
    }
  }

  for (let ring = 0; ring < rings; ring++) {
    for (let seg = 0; seg < segments; seg++) {
      const current = ring * (segments + 1) + seg
      const next = current + segments + 1

      indices.push(current, next, current + 1)
      indices.push(current + 1, next, next + 1)
    }
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3))
  geometry.setIndex(indices)

  return geometry
}

/**
 * Create volcanic smoke particles (static, for distant volcano)
 */
function createVolcanicSmoke(volcanoHeight: number): THREE.Group {
  const smokeGroup = new THREE.Group()

  // Wispy smoke geometry
  const particleCount = 100
  const positions: number[] = []

  for (let i = 0; i < particleCount; i++) {
    const angle = Math.random() * Math.PI * 2
    const radius = Math.random() * volcanoHeight * 0.1
    const height = volcanoHeight + Math.random() * volcanoHeight * 0.3

    positions.push(
      Math.cos(angle) * radius,
      height,
      Math.sin(angle) * radius
    )
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))

  const material = new THREE.PointsMaterial({
    color: 0x888888,
    size: 1.5,
    transparent: true,
    opacity: 0.3,
    sizeAttenuation: true,
  })

  const smoke = new THREE.Points(geometry, material)
  smokeGroup.add(smoke)

  return smokeGroup
}

/**
 * Create secondary volcanic hills/mountains for layered background
 */
export function createVolcanicRange(
  materials: BaliMaterials,
  position: THREE.Vector3 = new THREE.Vector3()
): THREE.Group {
  const range = new THREE.Group()

  // Main peak (Mount Agung)
  const agung = createVolcano(
    materials,
    35,
    45,
    new THREE.Vector3(0, 0, 0)
  )
  range.add(agung)

  // Secondary peak (Mount Batur style)
  const batur = createVolcano(
    materials,
    20,
    30,
    new THREE.Vector3(-50, 0, 20)
  )
  range.add(batur)

  // Smaller foothills
  for (let i = 0; i < 5; i++) {
    const hill = createVolcano(
      materials,
      8 + Math.random() * 6,
      15 + Math.random() * 10,
      new THREE.Vector3(
        -70 + i * 30 + Math.random() * 15,
        0,
        30 + Math.random() * 20
      )
    )
    range.add(hill)
  }

  range.position.copy(position)

  return range
}

/**
 * Create atmospheric haze between viewer and volcano
 */
export function createVolcanicHaze(
  width: number,
  height: number,
  depth: number,
  position: THREE.Vector3 = new THREE.Vector3()
): THREE.Mesh {
  const geometry = new THREE.PlaneGeometry(width, height)

  const material = new THREE.ShaderMaterial({
    uniforms: {
      uColor: { value: new THREE.Color(0x667788) },
      uOpacity: { value: 0.15 },
    },
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 uColor;
      uniform float uOpacity;
      varying vec2 vUv;

      void main() {
        // Gradient opacity - thicker at bottom
        float gradient = 1.0 - pow(vUv.y, 0.5);

        // Horizontal variation
        float horizontal = 1.0 - abs(vUv.x - 0.5) * 0.5;

        float alpha = gradient * horizontal * uOpacity;

        gl_FragColor = vec4(uColor, alpha);
      }
    `,
    transparent: true,
    side: THREE.DoubleSide,
    depthWrite: false,
  })

  const haze = new THREE.Mesh(geometry, material)
  haze.position.copy(position)
  haze.position.y = height / 2

  return haze
}
