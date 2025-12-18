import * as THREE from 'three'
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js'
import { Materials } from './materials'

// Reusable objects to avoid allocations
const _matrix = new THREE.Matrix4()
const _position = new THREE.Vector3()
const _quaternion = new THREE.Quaternion()
const _scale = new THREE.Vector3(1, 1, 1)

export interface LanternData {
  x: number
  y: number
  z: number
  color?: number
}

/**
 * Create instanced lanterns - single draw call for all lanterns
 * Uses InstancedMesh for the glowing bodies, merged geometry for caps
 */
export function createLanternSystem(
  materials: Materials,
  lanternData: LanternData[]
): { group: THREE.Group; lightPositions: THREE.Vector3[] } {
  const group = new THREE.Group()
  const count = lanternData.length
  const lightPositions: THREE.Vector3[] = []

  // Lantern body - instanced for glow effect
  const bodyGeom = new THREE.CylinderGeometry(0.18, 0.22, 0.55, 8)
  const bodyMesh = new THREE.InstancedMesh(bodyGeom, materials.lanternRed, count)

  // Caps geometry - merged for all lanterns
  const topCapGeom = new THREE.CylinderGeometry(0.12, 0.16, 0.08, 8)
  const bottomCapGeom = new THREE.CylinderGeometry(0.16, 0.12, 0.08, 8)
  const cordGeom = new THREE.CylinderGeometry(0.015, 0.015, 0.25, 4)

  const capGeometries: THREE.BufferGeometry[] = []

  lanternData.forEach((data, i) => {
    const { x, y, z } = data

    // Instance matrix for body
    _position.set(x, y, z)
    _matrix.compose(_position, _quaternion, _scale)
    bodyMesh.setMatrixAt(i, _matrix)

    // Top cap
    const top = topCapGeom.clone()
    top.translate(x, y + 0.32, z)
    capGeometries.push(top)

    // Bottom cap
    const bottom = bottomCapGeom.clone()
    bottom.translate(x, y - 0.32, z)
    capGeometries.push(bottom)

    // Cord
    const cord = cordGeom.clone()
    cord.translate(x, y + 0.52, z)
    capGeometries.push(cord)

    // Store light position
    lightPositions.push(new THREE.Vector3(x, y, z))
  })

  bodyMesh.instanceMatrix.needsUpdate = true
  group.add(bodyMesh)

  // Merge all caps into single mesh
  if (capGeometries.length > 0) {
    const merged = mergeGeometries(capGeometries)
    if (merged) {
      const capMesh = new THREE.Mesh(merged, materials.darkWood)
      group.add(capMesh)
    }
  }

  // Add fewer point lights - every 3rd lantern
  for (let i = 0; i < lightPositions.length; i += 3) {
    const light = new THREE.PointLight(0xff6644, 2.5, 15)
    light.position.copy(lightPositions[i])
    group.add(light)
  }

  group.userData = { type: 'lanterns', bodyMesh, lightPositions }
  return { group, lightPositions }
}

export interface LotusData {
  x: number
  z: number
}

/**
 * Create instanced lotus lights on water
 */
export function createLotusSystem(lotusData: LotusData[]): {
  group: THREE.Group
  positions: THREE.Vector3[]
} {
  const group = new THREE.Group()
  const count = lotusData.length
  const positions: THREE.Vector3[] = []

  // Petal material
  const petalMat = new THREE.MeshBasicMaterial({ color: 0xffccdd })
  const centerMat = new THREE.MeshBasicMaterial({ color: 0xffee88 })
  const leafMat = new THREE.MeshBasicMaterial({
    color: 0x224422,
    side: THREE.DoubleSide,
  })

  // Instanced center glow
  const centerGeom = new THREE.SphereGeometry(0.12, 8, 8)
  const centerMesh = new THREE.InstancedMesh(centerGeom, centerMat, count)

  // Instanced leaf
  const leafGeom = new THREE.CircleGeometry(0.4, 12)
  leafGeom.rotateX(-Math.PI / 2)
  const leafMesh = new THREE.InstancedMesh(leafGeom, leafMat, count)

  // Merged petals
  const petalGeometries: THREE.BufferGeometry[] = []
  const petalBaseGeom = new THREE.SphereGeometry(0.15, 6, 6)

  lotusData.forEach((data, i) => {
    const { x, z } = data
    const y = 0.08

    positions.push(new THREE.Vector3(x, y, z))

    // Center instance
    _position.set(x, y + 0.12, z)
    _matrix.compose(_position, _quaternion, _scale)
    centerMesh.setMatrixAt(i, _matrix)

    // Leaf instance
    _position.set(x, y - 0.02, z)
    _matrix.compose(_position, _quaternion, _scale)
    leafMesh.setMatrixAt(i, _matrix)

    // Petals (8 per lotus)
    for (let p = 0; p < 8; p++) {
      const angle = (p / 8) * Math.PI * 2
      const petal = petalBaseGeom.clone()
      petal.scale(1, 0.5, 0.6)
      petal.rotateY(angle)
      petal.translate(
        x + Math.cos(angle) * 0.2,
        y + 0.08,
        z + Math.sin(angle) * 0.2
      )
      petalGeometries.push(petal)
    }
  })

  centerMesh.instanceMatrix.needsUpdate = true
  leafMesh.instanceMatrix.needsUpdate = true

  group.add(centerMesh)
  group.add(leafMesh)

  // Merge petals
  if (petalGeometries.length > 0) {
    const merged = mergeGeometries(petalGeometries)
    if (merged) {
      group.add(new THREE.Mesh(merged, petalMat))
    }
  }

  // Fewer lights - every 4th lotus
  for (let i = 0; i < positions.length; i += 4) {
    const light = new THREE.PointLight(0xffdd66, 1.5, 8)
    light.position.copy(positions[i])
    light.position.y += 0.15
    group.add(light)
  }

  group.userData = { type: 'lotus', centerMesh, leafMesh, positions }
  return { group, positions }
}

export interface StreetLampData {
  x: number
  z: number
}

/**
 * Create street lamps with merged geometry
 */
export function createStreetLampSystem(
  materials: Materials,
  lampData: StreetLampData[],
  enableShadows: boolean
): THREE.Group {
  const group = new THREE.Group()

  const postMat = new THREE.MeshStandardMaterial({
    color: 0x1a1a1a,
    roughness: 0.7,
    metalness: 0.3,
  })

  // Merged geometries
  const postGeometries: THREE.BufferGeometry[] = []
  const lanternGeometries: THREE.BufferGeometry[] = []

  const postGeom = new THREE.CylinderGeometry(0.06, 0.1, 4.5, 6)
  const baseGeom = new THREE.CylinderGeometry(0.25, 0.3, 0.15, 6)
  const armGeom = new THREE.TorusGeometry(0.4, 0.04, 6, 6, Math.PI / 2)
  const housingGeom = new THREE.CylinderGeometry(0.15, 0.2, 0.4, 6)
  const glowGeom = new THREE.CylinderGeometry(0.12, 0.14, 0.35, 6)

  lampData.forEach(({ x, z }) => {
    const baseY = 1.0

    // Post
    const post = postGeom.clone()
    post.translate(x, baseY + 2.25, z)
    postGeometries.push(post)

    // Base
    const base = baseGeom.clone()
    base.translate(x, baseY + 0.08, z)
    postGeometries.push(base)

    // Arm
    const arm = armGeom.clone()
    arm.rotateZ(-Math.PI / 2)
    arm.rotateY(Math.PI / 2)
    arm.translate(x + 0.4, baseY + 4.3, z)
    postGeometries.push(arm)

    // Housing
    const housing = housingGeom.clone()
    housing.translate(x + 0.65, baseY + 4.0, z)
    postGeometries.push(housing)

    // Glowing lantern
    const glow = glowGeom.clone()
    glow.translate(x + 0.65, baseY + 4.0, z)
    lanternGeometries.push(glow)

    // Light - no shadow casting on point lights (uses too many texture units)
    // The moon directional light provides the main shadows
    const light = new THREE.PointLight(0xffaa44, 2.5, 18)
    light.position.set(x + 0.65, baseY + 4.0, z)
    group.add(light)
  })

  // Merge posts
  if (postGeometries.length > 0) {
    const merged = mergeGeometries(postGeometries)
    if (merged) {
      const mesh = new THREE.Mesh(merged, postMat)
      mesh.castShadow = enableShadows
      group.add(mesh)
    }
  }

  // Merge lanterns
  if (lanternGeometries.length > 0) {
    const merged = mergeGeometries(lanternGeometries)
    if (merged) {
      group.add(new THREE.Mesh(merged, materials.lanternGold))
    }
  }

  return group
}

export interface TreeData {
  x: number
  z: number
  height: number
}

/**
 * Create cherry blossom trees with instancing
 */
export function createTreeSystem(treeData: TreeData[]): THREE.Group {
  const group = new THREE.Group()

  const trunkMat = new THREE.MeshStandardMaterial({ color: 0x2a1a15, roughness: 0.9 })
  const foliageMat = new THREE.MeshBasicMaterial({
    color: 0xffaacc,
    transparent: true,
    opacity: 0.75,
  })

  const trunkGeometries: THREE.BufferGeometry[] = []
  const foliageGeometries: THREE.BufferGeometry[] = []

  treeData.forEach(({ x, z, height }) => {
    // Trunk
    const trunk = new THREE.CylinderGeometry(0.12, 0.2, height * 0.55, 6)
    trunk.translate(x, height * 0.28, z)
    trunkGeometries.push(trunk)

    // Foliage clusters (6 per tree, reduced from 8)
    for (let i = 0; i < 6; i++) {
      const cluster = new THREE.SphereGeometry(0.7 + Math.random() * 0.3, 6, 6)
      cluster.scale(1, 0.7, 1)
      cluster.translate(
        x + (Math.random() - 0.5) * 1.8,
        height * 0.65 + Math.random() * 1.2,
        z + (Math.random() - 0.5) * 1.8
      )
      foliageGeometries.push(cluster)
    }
  })

  // Merge trunks
  if (trunkGeometries.length > 0) {
    const merged = mergeGeometries(trunkGeometries)
    if (merged) {
      const mesh = new THREE.Mesh(merged, trunkMat)
      mesh.castShadow = true
      group.add(mesh)
    }
  }

  // Merge foliage
  if (foliageGeometries.length > 0) {
    const merged = mergeGeometries(foliageGeometries)
    if (merged) {
      group.add(new THREE.Mesh(merged, foliageMat))
    }
  }

  return group
}

/**
 * Create firefly particle system using Points for maximum performance
 */
export function createFireflySystem(bounds: { x: number; z: number }, count: number): {
  points: THREE.Points
  basePositions: Float32Array
  phases: Float32Array
  speeds: Float32Array
} {
  const positions = new Float32Array(count * 3)
  const basePositions = new Float32Array(count * 3)
  const phases = new Float32Array(count)
  const speeds = new Float32Array(count)

  for (let i = 0; i < count; i++) {
    const x = (Math.random() - 0.5) * bounds.x * 2
    const y = 1.5 + Math.random() * 4
    const z = (Math.random() - 0.5) * bounds.z * 2

    positions[i * 3] = x
    positions[i * 3 + 1] = y
    positions[i * 3 + 2] = z

    basePositions[i * 3] = x
    basePositions[i * 3 + 1] = y
    basePositions[i * 3 + 2] = z

    phases[i] = Math.random() * Math.PI * 2
    speeds[i] = 0.5 + Math.random() * 0.5
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

  const material = new THREE.PointsMaterial({
    color: 0xffffaa,
    size: 0.15,
    transparent: true,
    opacity: 0.8,
    sizeAttenuation: true,
  })

  const points = new THREE.Points(geometry, material)
  points.userData = { type: 'fireflies' }

  return { points, basePositions, phases, speeds }
}

/**
 * Update firefly positions - call in animation loop
 */
export function updateFireflies(
  points: THREE.Points,
  basePositions: Float32Array,
  phases: Float32Array,
  speeds: Float32Array,
  time: number
): void {
  const positions = points.geometry.attributes.position.array as Float32Array
  const count = phases.length

  for (let i = 0; i < count; i++) {
    const phase = phases[i]
    const speed = speeds[i]
    const idx = i * 3

    positions[idx] = basePositions[idx] + Math.sin(time * speed + phase) * 0.3
    positions[idx + 1] = basePositions[idx + 1] + Math.sin(time * speed * 0.7 + phase) * 0.5
    positions[idx + 2] = basePositions[idx + 2] + Math.cos(time * speed + phase) * 0.3
  }

  points.geometry.attributes.position.needsUpdate = true
}
