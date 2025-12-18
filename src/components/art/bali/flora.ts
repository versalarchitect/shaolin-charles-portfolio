import * as THREE from 'three'
import { BaliMaterials } from './materials'

/**
 * Balinese Flora
 *
 * Tropical plants that define the Bali landscape:
 * - Coconut Palm Trees
 * - Banana Plants
 * - Frangipani (Plumeria) Trees
 * - Lotus Flowers
 */

/**
 * Coconut Palm Tree
 *
 * The iconic leaning palm tree of tropical Bali
 */
export function createCoconutPalm(
  materials: BaliMaterials,
  height: number = 12,
  lean: number = 0.3, // How much the trunk leans (0-1)
  position: THREE.Vector3 = new THREE.Vector3()
): THREE.Group {
  const palm = new THREE.Group()

  // Curved trunk using multiple segments
  const trunkSegments = 12
  const segmentHeight = height / trunkSegments

  let currentPos = new THREE.Vector3(0, 0, 0)
  let currentAngle = 0

  // Create trunk segments that curve naturally
  for (let i = 0; i < trunkSegments; i++) {
    const t = i / trunkSegments

    // Trunk gets thinner at top
    const bottomRadius = 0.25 * (1 - t * 0.4)
    const topRadius = 0.25 * (1 - (t + 1 / trunkSegments) * 0.4)

    // Add some natural bend/lean
    const bendAmount = lean * Math.sin(t * Math.PI * 0.8)

    const segmentGeometry = new THREE.CylinderGeometry(
      topRadius,
      bottomRadius,
      segmentHeight,
      8
    )

    const segment = new THREE.Mesh(segmentGeometry, materials.palmTrunk)
    segment.position.copy(currentPos)
    segment.position.y += segmentHeight / 2
    segment.rotation.z = bendAmount * 0.3

    segment.castShadow = true
    segment.receiveShadow = true
    palm.add(segment)

    // Calculate next position
    currentPos.y += segmentHeight * Math.cos(bendAmount * 0.3)
    currentPos.x += segmentHeight * Math.sin(bendAmount * 0.3)
    currentAngle = bendAmount * 0.3
  }

  // Crown position at top of trunk
  const crownPos = new THREE.Vector3(currentPos.x, currentPos.y, currentPos.z)

  // Palm fronds
  const frondCount = 12
  const frondLength = height * 0.4

  for (let i = 0; i < frondCount; i++) {
    const frond = createPalmFrond(materials, frondLength)

    // Arrange in a spiral pattern
    const angle = (i / frondCount) * Math.PI * 2
    const droop = Math.PI / 4 + (i % 3) * 0.1 // Varying droop angles

    frond.rotation.y = angle
    frond.rotation.x = droop

    // Older (outer) fronds droop more
    if (i < 3) {
      frond.rotation.x += 0.3
    }

    frond.position.copy(crownPos)

    palm.add(frond)
  }

  // Coconuts cluster at crown
  const coconutCount = Math.floor(Math.random() * 4) + 2

  for (let i = 0; i < coconutCount; i++) {
    const coconutGeometry = new THREE.SphereGeometry(0.15, 8, 8)
    const coconutMaterial = new THREE.MeshStandardMaterial({
      color: 0x5a4a2a,
      roughness: 0.85,
    })
    const coconut = new THREE.Mesh(coconutGeometry, coconutMaterial)

    const angle = (i / coconutCount) * Math.PI * 2
    coconut.position.set(
      crownPos.x + Math.cos(angle) * 0.3,
      crownPos.y - 0.3,
      crownPos.z + Math.sin(angle) * 0.3
    )
    coconut.scale.y = 1.2

    palm.add(coconut)
  }

  palm.position.copy(position)

  return palm
}

/**
 * Single palm frond with leaflets
 */
function createPalmFrond(materials: BaliMaterials, length: number): THREE.Group {
  const frond = new THREE.Group()

  // Central spine of frond
  const spineGeometry = new THREE.CylinderGeometry(0.02, 0.04, length, 4)
  spineGeometry.rotateX(Math.PI / 2)
  spineGeometry.translate(0, 0, length / 2)

  const spine = new THREE.Mesh(spineGeometry, materials.palmTrunk)
  frond.add(spine)

  // Leaflets along the spine
  const leafletCount = 20
  const leafletLength = length * 0.25

  for (let i = 0; i < leafletCount; i++) {
    const t = (i + 2) / (leafletCount + 2) // Start a bit from base
    const z = t * length * 0.9

    // Leaflet tapers at tip
    const localLength = leafletLength * (1 - Math.abs(t - 0.5) * 0.5)

    // Create simple leaflet geometry
    const leafletShape = new THREE.Shape()
    leafletShape.moveTo(0, 0)
    leafletShape.quadraticCurveTo(localLength * 0.3, 0.02, localLength, 0)
    leafletShape.quadraticCurveTo(localLength * 0.3, -0.02, 0, 0)

    const leafletGeometry = new THREE.ShapeGeometry(leafletShape, 2)

    // Leaflet on each side
    for (const side of [-1, 1]) {
      const leaflet = new THREE.Mesh(leafletGeometry, materials.palmFronds)
      leaflet.position.set(0, 0, z)
      leaflet.rotation.y = (side * Math.PI) / 2.2 // Angle outward
      leaflet.rotation.z = (side * Math.PI) / 8 // Slight droop

      frond.add(leaflet)
    }
  }

  return frond
}

/**
 * Banana Plant
 */
export function createBananaPlant(
  materials: BaliMaterials,
  height: number = 3,
  position: THREE.Vector3 = new THREE.Vector3()
): THREE.Group {
  const plant = new THREE.Group()

  // Short thick trunk (actually pseudostem)
  const trunkGeometry = new THREE.CylinderGeometry(0.2, 0.3, height * 0.4, 12)
  const trunkMaterial = new THREE.MeshStandardMaterial({
    color: 0x6a8a4a,
    roughness: 0.8,
  })
  const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial)
  trunk.position.y = height * 0.2
  trunk.castShadow = true
  plant.add(trunk)

  // Large leaves
  const leafCount = 6

  for (let i = 0; i < leafCount; i++) {
    const angle = (i / leafCount) * Math.PI * 2 + Math.random() * 0.3
    const leafLength = height * 0.8

    const leaf = createBananaLeaf(materials, leafLength)
    leaf.rotation.y = angle
    leaf.rotation.x = Math.PI / 6 + Math.random() * 0.2
    leaf.position.y = height * 0.4

    plant.add(leaf)
  }

  plant.position.copy(position)

  return plant
}

/**
 * Banana leaf
 */
function createBananaLeaf(_materials: BaliMaterials, length: number): THREE.Group {
  const leaf = new THREE.Group()

  // Leaf shape - broad and slightly curved
  const leafWidth = length * 0.25

  const shape = new THREE.Shape()
  shape.moveTo(0, 0)
  shape.quadraticCurveTo(leafWidth / 2, length * 0.3, leafWidth / 2, length * 0.5)
  shape.quadraticCurveTo(leafWidth / 2, length * 0.7, 0, length)
  shape.quadraticCurveTo(-leafWidth / 2, length * 0.7, -leafWidth / 2, length * 0.5)
  shape.quadraticCurveTo(-leafWidth / 2, length * 0.3, 0, 0)

  const leafGeometry = new THREE.ShapeGeometry(shape, 8)
  leafGeometry.rotateX(-Math.PI / 2)

  const leafMaterial = new THREE.MeshStandardMaterial({
    color: 0x4a8a3a,
    roughness: 0.7,
    side: THREE.DoubleSide,
  })

  const leafMesh = new THREE.Mesh(leafGeometry, leafMaterial)
  leaf.add(leafMesh)

  return leaf
}

/**
 * Frangipani Tree (Plumeria)
 *
 * Iconic fragrant flowering tree of Bali temples
 */
export function createFrangipaniTree(
  materials: BaliMaterials,
  height: number = 4,
  position: THREE.Vector3 = new THREE.Vector3()
): THREE.Group {
  const tree = new THREE.Group()

  // Thick gnarled trunk
  const trunkGeometry = new THREE.CylinderGeometry(0.15, 0.25, height * 0.5, 8)
  const trunkMaterial = new THREE.MeshStandardMaterial({
    color: 0x5a4a3a,
    roughness: 0.9,
  })
  const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial)
  trunk.position.y = height * 0.25
  trunk.castShadow = true
  tree.add(trunk)

  // Branching structure
  const branchCount = 4

  for (let i = 0; i < branchCount; i++) {
    const angle = (i / branchCount) * Math.PI * 2
    const branchLength = height * 0.4

    const branchGeometry = new THREE.CylinderGeometry(0.05, 0.1, branchLength, 6)
    const branch = new THREE.Mesh(branchGeometry, trunkMaterial)

    branch.position.set(
      Math.cos(angle) * 0.3,
      height * 0.5,
      Math.sin(angle) * 0.3
    )
    branch.rotation.z = Math.PI / 4
    branch.rotation.y = angle

    tree.add(branch)

    // Flower clusters at branch tips
    const flowerCluster = createFrangipaniCluster(materials, 0.5)

    const tipX = Math.cos(angle) * (0.3 + branchLength * 0.7)
    const tipZ = Math.sin(angle) * (0.3 + branchLength * 0.7)
    flowerCluster.position.set(tipX, height * 0.5 + branchLength * 0.7, tipZ)

    tree.add(flowerCluster)
  }

  tree.position.copy(position)

  return tree
}

/**
 * Cluster of frangipani flowers
 */
function createFrangipaniCluster(
  materials: BaliMaterials,
  radius: number
): THREE.Group {
  const cluster = new THREE.Group()

  const flowerCount = Math.floor(Math.random() * 5) + 5

  for (let i = 0; i < flowerCount; i++) {
    const flower = createFrangipaniFlower(materials)

    const angle = (i / flowerCount) * Math.PI * 2
    const r = Math.random() * radius
    const y = (Math.random() - 0.5) * radius * 0.5

    flower.position.set(
      Math.cos(angle) * r,
      y,
      Math.sin(angle) * r
    )
    flower.rotation.set(
      Math.random() * 0.3,
      Math.random() * Math.PI * 2,
      Math.random() * 0.3
    )

    cluster.add(flower)
  }

  return cluster
}

/**
 * Single frangipani flower
 */
function createFrangipaniFlower(materials: BaliMaterials): THREE.Group {
  const flower = new THREE.Group()

  // 5 petals arranged in spiral
  const petalCount = 5

  for (let i = 0; i < petalCount; i++) {
    const angle = (i / petalCount) * Math.PI * 2

    // Petal shape
    const petalGeometry = new THREE.SphereGeometry(0.06, 4, 4)
    petalGeometry.scale(1, 0.3, 2)

    const petal = new THREE.Mesh(petalGeometry, materials.frangipaniWhite)
    petal.position.set(
      Math.cos(angle) * 0.05,
      0,
      Math.sin(angle) * 0.05
    )
    petal.rotation.y = angle
    petal.rotation.x = 0.3

    flower.add(petal)
  }

  // Yellow center
  const centerGeometry = new THREE.SphereGeometry(0.03, 8, 8)
  const center = new THREE.Mesh(centerGeometry, materials.frangipaniYellow)
  center.position.y = 0.02
  flower.add(center)

  return flower
}

/**
 * Lotus flower (for ponds and offerings)
 */
export function createLotusFlower(
  materials: BaliMaterials,
  scale: number = 1,
  position: THREE.Vector3 = new THREE.Vector3()
): THREE.Group {
  const lotus = new THREE.Group()

  // Lotus pad (lily pad)
  const padGeometry = new THREE.CircleGeometry(0.4 * scale, 16)
  const padMaterial = new THREE.MeshStandardMaterial({
    color: 0x2a5a2a,
    roughness: 0.8,
    side: THREE.DoubleSide,
  })
  const pad = new THREE.Mesh(padGeometry, padMaterial)
  pad.rotation.x = -Math.PI / 2
  pad.receiveShadow = true
  lotus.add(pad)

  // Flower petals - multiple layers
  const petalLayers = 3

  for (let layer = 0; layer < petalLayers; layer++) {
    const petalCount = 8 - layer * 2
    const layerRadius = (0.15 - layer * 0.03) * scale
    const layerHeight = layer * 0.05 * scale

    for (let i = 0; i < petalCount; i++) {
      const angle = (i / petalCount) * Math.PI * 2 + layer * 0.2

      const petalGeometry = new THREE.SphereGeometry(0.08 * scale, 6, 6)
      petalGeometry.scale(0.6, 0.4, 1.5)

      const petalMaterial = new THREE.MeshBasicMaterial({
        color: layer === 0 ? 0xffccdd : 0xffeef4,
        transparent: true,
        opacity: 0.9,
      })

      const petal = new THREE.Mesh(petalGeometry, petalMaterial)
      petal.position.set(
        Math.cos(angle) * layerRadius,
        0.1 * scale + layerHeight,
        Math.sin(angle) * layerRadius
      )
      petal.rotation.y = angle
      petal.rotation.x = -Math.PI / 4 - layer * 0.2

      lotus.add(petal)
    }
  }

  // Yellow center
  const centerGeometry = new THREE.SphereGeometry(0.05 * scale, 8, 8)
  const center = new THREE.Mesh(centerGeometry, materials.frangipaniYellow)
  center.position.y = 0.2 * scale
  lotus.add(center)

  lotus.position.copy(position)

  return lotus
}

/**
 * Create a grove of mixed tropical trees
 */
export function createTropicalGrove(
  materials: BaliMaterials,
  count: number,
  radius: number,
  position: THREE.Vector3 = new THREE.Vector3()
): THREE.Group {
  const grove = new THREE.Group()

  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2
    const distance = Math.random() * radius

    const treePos = new THREE.Vector3(
      Math.cos(angle) * distance,
      0,
      Math.sin(angle) * distance
    )

    // Random tree type
    const treeType = Math.random()

    if (treeType < 0.5) {
      // Coconut palm
      const palmHeight = 8 + Math.random() * 6
      const lean = 0.2 + Math.random() * 0.4
      grove.add(createCoconutPalm(materials, palmHeight, lean, treePos))
    } else if (treeType < 0.8) {
      // Banana plant
      const height = 2 + Math.random() * 2
      grove.add(createBananaPlant(materials, height, treePos))
    } else {
      // Frangipani
      const height = 3 + Math.random() * 2
      grove.add(createFrangipaniTree(materials, height, treePos))
    }
  }

  grove.position.copy(position)

  return grove
}
