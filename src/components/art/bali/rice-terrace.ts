import * as THREE from 'three'
import { BaliMaterials, createPaddyWaterShader } from './materials'

/**
 * Rice Terrace Generator
 *
 * Creates the iconic Balinese rice terraces (sawah) with:
 * - Stepped contour-following paddies
 * - Reflective flooded water
 * - Instanced rice plant geometry
 * - Earth walls between levels
 *
 * Based on the Tegallalang rice terraces in Ubud
 */

export interface RiceTerraceConfig {
  width: number           // Width of terrace system
  depth: number           // Depth of terrace system
  levels: number          // Number of terrace steps
  curvature: number       // How curved the terrace edges are (0-1)
  waterLevel: number      // How full the paddies are (0-1)
  riceDensity: number     // Plants per unit area
  position: THREE.Vector3
}

// Create a single rice plant mesh (simplified for instancing)
function createRicePlantGeometry(): THREE.BufferGeometry {
  const geometry = new THREE.BufferGeometry()

  // Multiple blades of grass-like rice stalks
  const positions: number[] = []
  const normals: number[] = []

  const bladesPerPlant = 5
  const height = 0.4

  for (let i = 0; i < bladesPerPlant; i++) {
    const angle = (i / bladesPerPlant) * Math.PI * 2
    const offsetX = Math.cos(angle) * 0.03
    const offsetZ = Math.sin(angle) * 0.03

    // Each blade is a thin quad
    const bendX = Math.cos(angle) * 0.08
    const bendZ = Math.sin(angle) * 0.08

    // Bottom vertices
    positions.push(offsetX - 0.01, 0, offsetZ)
    positions.push(offsetX + 0.01, 0, offsetZ)

    // Top vertices (bent outward)
    positions.push(offsetX + bendX - 0.005, height, offsetZ + bendZ)
    positions.push(offsetX + bendX + 0.005, height, offsetZ + bendZ)

    // Normals pointing outward
    const nx = Math.cos(angle)
    const nz = Math.sin(angle)
    normals.push(nx, 0.5, nz)
    normals.push(nx, 0.5, nz)
    normals.push(nx, 0.5, nz)
    normals.push(nx, 0.5, nz)
  }

  // Create indices for the quads
  const indices: number[] = []
  for (let i = 0; i < bladesPerPlant; i++) {
    const base = i * 4
    // First triangle
    indices.push(base, base + 1, base + 2)
    // Second triangle
    indices.push(base + 1, base + 3, base + 2)
  }

  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3))
  geometry.setIndex(indices)

  return geometry
}

// Generate terrace level curve based on contour
function generateTerraceContour(
  width: number,
  depth: number,
  level: number,
  totalLevels: number,
  curvature: number
): THREE.Vector2[] {
  const points: THREE.Vector2[] = []
  const segments = 32

  // Level offset (higher levels are further back and higher)
  const levelDepth = (level / totalLevels) * depth
  const levelWidth = width * (1 - level * 0.05) // Slight narrowing at top

  for (let i = 0; i <= segments; i++) {
    const t = i / segments
    const x = (t - 0.5) * levelWidth

    // Curved edge using sine wave with noise
    const curve = Math.sin(t * Math.PI) * curvature * 2
    const noise = Math.sin(t * Math.PI * 4) * curvature * 0.3
    const z = levelDepth + curve + noise

    points.push(new THREE.Vector2(x, z))
  }

  return points
}

// Create the earth wall between terrace levels
function createTerraceWall(
  upperContour: THREE.Vector2[],
  lowerContour: THREE.Vector2[],
  upperY: number,
  lowerY: number,
  material: THREE.Material
): THREE.Mesh {
  const geometry = new THREE.BufferGeometry()

  const positions: number[] = []
  const normals: number[] = []
  const uvs: number[] = []
  const indices: number[] = []

  // Create wall geometry between contours
  const segments = Math.min(upperContour.length, lowerContour.length)

  for (let i = 0; i < segments; i++) {
    const upperPoint = upperContour[i]
    const lowerPoint = lowerContour[i]
    const t = i / segments

    // Upper vertex
    positions.push(upperPoint.x, upperY, upperPoint.y)
    // Lower vertex
    positions.push(lowerPoint.x, lowerY, lowerPoint.y)

    // Calculate normal (pointing outward from slope)
    let nx = 0, nz = 1
    if (i < segments - 1) {
      const nextUpper = upperContour[i + 1]
      const dx = nextUpper.x - upperPoint.x
      const dz = nextUpper.y - upperPoint.y
      // Perpendicular to edge
      const len = Math.sqrt(dx * dx + dz * dz)
      nx = -dz / len
      nz = dx / len
    }

    normals.push(nx, 0.3, nz)
    normals.push(nx, 0.3, nz)

    uvs.push(t, 1)
    uvs.push(t, 0)
  }

  // Create triangle indices
  for (let i = 0; i < segments - 1; i++) {
    const base = i * 2
    // First triangle
    indices.push(base, base + 2, base + 1)
    // Second triangle
    indices.push(base + 1, base + 2, base + 3)
  }

  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3))
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2))
  geometry.setIndex(indices)

  const mesh = new THREE.Mesh(geometry, material)
  mesh.castShadow = true
  mesh.receiveShadow = true

  return mesh
}

// Create water surface for a paddy level
function createPaddyWater(
  contour: THREE.Vector2[],
  width: number,
  depth: number,
  y: number,
  material: THREE.Material | THREE.ShaderMaterial
): THREE.Mesh {
  // Create a shape from the contour
  const shape = new THREE.Shape()

  // Start from back-left corner
  shape.moveTo(-width / 2, 0)

  // Follow contour
  contour.forEach((point, i) => {
    if (i === 0) {
      shape.lineTo(point.x, point.y)
    } else {
      shape.lineTo(point.x, point.y)
    }
  })

  // Close to back-right
  shape.lineTo(width / 2, 0)
  shape.closePath()

  const geometry = new THREE.ShapeGeometry(shape, 16)
  geometry.rotateX(-Math.PI / 2)

  const mesh = new THREE.Mesh(geometry, material)
  mesh.position.y = y
  mesh.receiveShadow = true

  return mesh
}

// Create instanced rice plants for a paddy
function createRicePlants(
  contour: THREE.Vector2[],
  width: number,
  y: number,
  density: number,
  material: THREE.Material
): THREE.InstancedMesh {
  const plantGeometry = createRicePlantGeometry()

  // Calculate approximate area and number of plants
  const area = width * 4 // Rough estimate
  const plantCount = Math.floor(area * density)

  const instancedMesh = new THREE.InstancedMesh(
    plantGeometry,
    material,
    plantCount
  )

  const matrix = new THREE.Matrix4()
  const position = new THREE.Vector3()
  const quaternion = new THREE.Quaternion()
  const scale = new THREE.Vector3()

  // Find bounds from contour
  let minZ = Infinity, maxZ = -Infinity
  contour.forEach(p => {
    minZ = Math.min(minZ, p.y)
    maxZ = Math.max(maxZ, p.y)
  })

  let placed = 0
  let attempts = 0
  const maxAttempts = plantCount * 10

  while (placed < plantCount && attempts < maxAttempts) {
    attempts++

    // Random position within bounds
    const x = (Math.random() - 0.5) * width * 0.9
    const z = minZ + Math.random() * (maxZ - minZ) * 0.8

    // Check if inside contour (simplified)
    const t = (x + width / 2) / width
    const idx = Math.floor(t * (contour.length - 1))
    if (idx >= 0 && idx < contour.length) {
      const contourZ = contour[idx].y

      if (z < contourZ - 0.5) {
        position.set(x, y + 0.02, z)

        // Random rotation
        quaternion.setFromAxisAngle(
          new THREE.Vector3(0, 1, 0),
          Math.random() * Math.PI * 2
        )

        // Slight scale variation
        const s = 0.8 + Math.random() * 0.4
        scale.set(s, s, s)

        matrix.compose(position, quaternion, scale)
        instancedMesh.setMatrixAt(placed, matrix)

        placed++
      }
    }
  }

  instancedMesh.count = placed
  instancedMesh.instanceMatrix.needsUpdate = true

  return instancedMesh
}

/**
 * Create complete rice terrace system
 */
export function createRiceTerrace(
  materials: BaliMaterials,
  config: RiceTerraceConfig,
  timeUniform: { value: number }
): THREE.Group {
  const group = new THREE.Group()

  const {
    width,
    depth,
    levels,
    curvature,
    waterLevel,
    riceDensity,
    position,
  } = config

  const levelHeight = 1.5 // Height difference between levels

  // Generate all contours first
  const contours: THREE.Vector2[][] = []
  for (let i = 0; i <= levels; i++) {
    contours.push(generateTerraceContour(width, depth, i, levels, curvature))
  }

  // Create each terrace level
  for (let level = 0; level < levels; level++) {
    const y = level * levelHeight

    // Earth wall from this level to next
    if (level < levels - 1) {
      const wall = createTerraceWall(
        contours[level + 1],
        contours[level],
        (level + 1) * levelHeight,
        y,
        materials.terraceEarth
      )
      group.add(wall)
    }

    // Water surface with shader
    const waterShader = createPaddyWaterShader(timeUniform)
    const water = createPaddyWater(
      contours[level],
      width,
      depth,
      y + 0.02,
      waterShader
    )
    group.add(water)

    // Rice plants (denser at lower levels)
    const levelDensity = riceDensity * (1 - level * 0.1)
    const plants = createRicePlants(
      contours[level],
      width,
      y,
      levelDensity,
      materials.riceGreen
    )
    group.add(plants)
  }

  // Base/ground level
  const groundGeometry = new THREE.PlaneGeometry(width * 1.5, depth * 1.5)
  groundGeometry.rotateX(-Math.PI / 2)
  const ground = new THREE.Mesh(groundGeometry, materials.terraceEarth)
  ground.position.y = -0.1
  ground.receiveShadow = true
  group.add(ground)

  group.position.copy(position)

  return group
}

/**
 * Simplified rice terrace for performance (fewer instances)
 */
export function createSimpleRiceTerrace(
  materials: BaliMaterials,
  position: THREE.Vector3,
  scale: number = 1
): THREE.Group {
  const group = new THREE.Group()

  const levels = 5
  const width = 20 * scale
  const levelHeight = 1.2 * scale

  for (let level = 0; level < levels; level++) {
    const y = level * levelHeight
    const levelWidth = width * (1 - level * 0.08)
    const levelDepth = 4 * scale

    // Terrace platform (simplified)
    const paddyGeometry = new THREE.BoxGeometry(
      levelWidth,
      0.1,
      levelDepth
    )
    const paddy = new THREE.Mesh(paddyGeometry, materials.paddyWater)
    paddy.position.set(0, y + 0.05, level * levelDepth * 0.8)
    paddy.receiveShadow = true
    group.add(paddy)

    // Earth wall
    const wallGeometry = new THREE.BoxGeometry(
      levelWidth,
      levelHeight,
      0.3
    )
    const wall = new THREE.Mesh(wallGeometry, materials.terraceEarth)
    wall.position.set(0, y - levelHeight / 2 + 0.1, level * levelDepth * 0.8 + levelDepth / 2)
    wall.castShadow = true
    wall.receiveShadow = true
    group.add(wall)

    // Rice plants (using simple green boxes for performance)
    const riceCount = 50
    for (let i = 0; i < riceCount; i++) {
      const riceGeometry = new THREE.ConeGeometry(0.15, 0.5, 4)
      const rice = new THREE.Mesh(riceGeometry, materials.riceGreen)
      rice.position.set(
        (Math.random() - 0.5) * levelWidth * 0.85,
        y + 0.3,
        level * levelDepth * 0.8 + (Math.random() - 0.5) * levelDepth * 0.7
      )
      rice.rotation.y = Math.random() * Math.PI * 2
      group.add(rice)
    }
  }

  group.position.copy(position)

  return group
}
