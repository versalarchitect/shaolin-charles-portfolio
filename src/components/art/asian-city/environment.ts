import * as THREE from 'three'
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js'
import { Materials } from './materials'

/**
 * Create water plane - single mesh, no transparency for performance
 */
export function createWater(): THREE.Mesh {
  const geometry = new THREE.PlaneGeometry(150, 150, 1, 1) // Minimal segments
  const material = new THREE.MeshStandardMaterial({
    color: 0x0a1828,
    roughness: 0.15,
    metalness: 0.85,
  })

  const water = new THREE.Mesh(geometry, material)
  water.rotation.x = -Math.PI / 2
  water.position.y = -0.3
  water.receiveShadow = true

  return water
}

/**
 * Create ground island - optimized cylinder
 */
export function createGround(): THREE.Mesh {
  const geometry = new THREE.CylinderGeometry(25, 28, 1.5, 24) // Reduced segments
  const material = new THREE.MeshStandardMaterial({
    color: 0x1a1a22,
    roughness: 0.95,
  })

  const ground = new THREE.Mesh(geometry, material)
  ground.position.y = 0.5
  ground.receiveShadow = true

  return ground
}

/**
 * Create stone paths - merged into single mesh
 */
export function createStonePaths(materials: Materials): THREE.Mesh {
  const geometries: THREE.BufferGeometry[] = []
  const stoneGeom = new THREE.BoxGeometry(1.1, 0.12, 1.6)

  // Main path
  for (let i = -8; i <= 8; i++) {
    const stone = stoneGeom.clone()
    stone.translate(i * 1.4, 1.32, 12)
    stone.rotateY(Math.random() * 0.08 - 0.04)
    geometries.push(stone)
  }

  // Cross path
  const smallStone = new THREE.BoxGeometry(0.9, 0.12, 1.3)
  for (let i = -5; i <= 5; i++) {
    const stone = smallStone.clone()
    stone.translate(0, 1.32, i * 1.8)
    stone.rotateY(Math.random() * 0.08 - 0.04)
    geometries.push(stone)
  }

  const merged = mergeGeometries(geometries)!
  const mesh = new THREE.Mesh(merged, materials.stone)
  mesh.receiveShadow = true

  return mesh
}

/**
 * Create starfield - optimized Points with pre-computed attributes
 */
export function createStars(): THREE.Points {
  const count = 1200
  const positions = new Float32Array(count * 3)
  const sizes = new Float32Array(count)

  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 350
    positions[i * 3 + 1] = Math.random() * 90 + 35
    positions[i * 3 + 2] = (Math.random() - 0.5) * 350
    sizes[i] = 0.1 + Math.random() * 0.2
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))

  const material = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.2,
    transparent: true,
    opacity: 0.85,
    sizeAttenuation: true,
  })

  return new THREE.Points(geometry, material)
}

/**
 * Create moon with glow - simplified geometry
 */
export function createMoon(): THREE.Group {
  const group = new THREE.Group()

  // Main moon - reduced segments
  const moonGeom = new THREE.SphereGeometry(12, 32, 32)
  const moonMat = new THREE.MeshBasicMaterial({ color: 0xfffff8 })
  group.add(new THREE.Mesh(moonGeom, moonMat))

  // Single glow layer for performance
  const glowGeom = new THREE.SphereGeometry(18, 16, 16)
  const glowMat = new THREE.MeshBasicMaterial({
    color: 0xffffee,
    transparent: true,
    opacity: 0.08,
  })
  group.add(new THREE.Mesh(glowGeom, glowMat))

  // Outer glow
  const outerGlowGeom = new THREE.SphereGeometry(28, 12, 12)
  const outerGlowMat = new THREE.MeshBasicMaterial({
    color: 0xeeeeff,
    transparent: true,
    opacity: 0.03,
  })
  group.add(new THREE.Mesh(outerGlowGeom, outerGlowMat))

  group.position.set(-55, 58, -95)

  return group
}

/**
 * Create clouds - merged geometry for all clouds
 */
export function createClouds(): THREE.Mesh {
  const geometries: THREE.BufferGeometry[] = []
  const cloudPartGeom = new THREE.SphereGeometry(4, 6, 6)

  for (let i = 0; i < 8; i++) {
    const baseX = -70 + i * 20 + Math.random() * 10
    const baseY = 42 + Math.random() * 18
    const baseZ = -75 - Math.random() * 35

    // 4 parts per cloud (reduced from 5)
    for (let j = 0; j < 4; j++) {
      const part = cloudPartGeom.clone()
      part.scale(1 + Math.random() * 0.5, 0.4, 1 + Math.random() * 0.3)
      part.translate(
        baseX + j * 4.5,
        baseY + Math.random() * 1.5,
        baseZ + Math.random() * 3
      )
      geometries.push(part)
    }
  }

  const merged = mergeGeometries(geometries)!
  const material = new THREE.MeshBasicMaterial({
    color: 0x1a1a2a,
    transparent: true,
    opacity: 0.35,
  })

  return new THREE.Mesh(merged, material)
}

/**
 * Create distant mountains - merged silhouettes
 */
export function createMountains(): THREE.Mesh {
  const geometries: THREE.BufferGeometry[] = []

  const configs = [
    { x: -75, z: -55, scale: 1.1, ry: 0.3 },
    { x: -35, z: -65, scale: 0.75, ry: 0.8 },
    { x: 5, z: -75, scale: 1.4, ry: 0.5 },
    { x: 55, z: -60, scale: 0.9, ry: 1.2 },
    { x: 85, z: -68, scale: 1.2, ry: 0.1 },
  ]

  configs.forEach(({ x, z, scale, ry }) => {
    const geom = new THREE.ConeGeometry(18 * scale, 38 * scale, 4)
    geom.rotateY(ry)
    geom.translate(x, 12 * scale, z)
    geometries.push(geom)
  })

  const merged = mergeGeometries(geometries)!
  const material = new THREE.MeshBasicMaterial({
    color: 0x0a0a12,
    transparent: true,
    opacity: 0.75,
  })

  return new THREE.Mesh(merged, material)
}

/**
 * Create complete environment as single optimized group
 */
export function createEnvironment(materials: Materials): {
  group: THREE.Group
  water: THREE.Mesh
} {
  const group = new THREE.Group()

  const water = createWater()
  group.add(water)
  group.add(createGround())
  group.add(createStonePaths(materials))
  group.add(createStars())
  group.add(createMoon())
  group.add(createClouds())
  group.add(createMountains())

  return { group, water }
}
