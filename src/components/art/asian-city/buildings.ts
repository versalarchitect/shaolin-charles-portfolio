import * as THREE from 'three'
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js'
import { Materials, getCachedGeometry } from './materials'

// Reusable vector for transforms - avoids allocations
const _tempVec = new THREE.Vector3()
const _tempMatrix = new THREE.Matrix4()

/**
 * Create curved pagoda roof geometry (cached)
 */
function createRoofGeometry(baseWidth: number, height: number, overhang: number): THREE.BufferGeometry {
  const cacheKey = `roof_${baseWidth}_${height}_${overhang}`

  return getCachedGeometry(cacheKey, () => {
    const roofPoints: THREE.Vector2[] = []
    const segments = 12 // Reduced from 20 for performance

    for (let i = 0; i <= segments; i++) {
      const t = i / segments
      const x = (t - 0.5) * (baseWidth + overhang * 2)
      const curve = Math.pow(Math.abs(t - 0.5) * 2, 1.5) * overhang * 0.8
      roofPoints.push(new THREE.Vector2(x, -height * 0.3 + curve))
    }

    const roofShape = new THREE.Shape()
    roofShape.moveTo(roofPoints[0].x, roofPoints[0].y)
    roofPoints.slice(1).forEach(p => roofShape.lineTo(p.x, p.y))
    roofShape.lineTo(roofPoints[roofPoints.length - 1].x, height * 0.2)
    roofShape.lineTo(roofPoints[0].x, height * 0.2)
    roofShape.closePath()

    const geometry = new THREE.ExtrudeGeometry(roofShape, {
      depth: baseWidth + overhang * 2,
      bevelEnabled: false,
    })
    geometry.center()
    geometry.rotateY(Math.PI / 2)

    return geometry
  })
}

export interface PagodaConfig {
  x: number
  z: number
  floors: number
  baseSize: number
  floorHeight: number
}

/**
 * Create optimized pagoda - merges all static geometry into single mesh per material
 */
export function createPagoda(materials: Materials, config: PagodaConfig): THREE.Group {
  const { x, z, floors, baseSize, floorHeight } = config
  const pagoda = new THREE.Group()

  // Collect geometries by material for merging
  const woodGeometries: THREE.BufferGeometry[] = []
  const roofGeometries: THREE.BufferGeometry[] = []
  const goldGeometries: THREE.BufferGeometry[] = []
  const glowGeometries: THREE.BufferGeometry[] = []

  let currentY = 0
  let currentSize = baseSize

  // Base
  const baseGeom = new THREE.BoxGeometry(baseSize * 1.3, 0.8, baseSize * 1.3)
  baseGeom.translate(0, 0.4, 0)
  woodGeometries.push(baseGeom)
  currentY = 0.8

  // Build floors
  for (let floor = 0; floor < floors; floor++) {
    const sizeMultiplier = 1 - floor * 0.12
    const heightMultiplier = 1 - floor * 0.08
    currentSize = baseSize * sizeMultiplier
    const height = floorHeight * heightMultiplier

    // Floor body
    const bodyGeom = new THREE.BoxGeometry(currentSize, height, currentSize)
    bodyGeom.translate(0, currentY + height / 2, 0)
    woodGeometries.push(bodyGeom)

    // Corner columns (4 per floor)
    const colRadius = currentSize * 0.04
    const colGeom = getCachedGeometry(`col_${colRadius.toFixed(2)}_${height.toFixed(2)}`, () =>
      new THREE.CylinderGeometry(colRadius, colRadius, height, 6)
    )

    const colOffset = currentSize / 2 - colRadius * 2
    const colPositions = [[-colOffset, colOffset], [colOffset, colOffset], [-colOffset, -colOffset], [colOffset, -colOffset]]

    colPositions.forEach(([cx, cz]) => {
      const col = colGeom.clone()
      col.translate(cx, currentY + height / 2, cz)
      goldGeometries.push(col)
    })

    // Windows (skip top floor)
    if (floor < floors - 1) {
      const winW = currentSize * 0.18
      const winH = height * 0.5
      const winGeom = new THREE.PlaneGeometry(winW, winH)
      const winY = currentY + height / 2
      const winOffset = currentSize / 2 + 0.02

      // 4 sides
      const sides = [
        { x: 0, z: winOffset, ry: 0 },
        { x: 0, z: -winOffset, ry: Math.PI },
        { x: winOffset, z: 0, ry: Math.PI / 2 },
        { x: -winOffset, z: 0, ry: -Math.PI / 2 },
      ]

      sides.forEach(({ x: wx, z: wz, ry }) => {
        const win = winGeom.clone()
        win.rotateY(ry)
        win.translate(wx, winY, wz)
        glowGeometries.push(win)
      })
    }

    currentY += height

    // Roof
    const roofGeom = createRoofGeometry(currentSize, height * 0.5, currentSize * 0.3).clone()
    roofGeom.translate(0, currentY + height * 0.15, 0)
    roofGeometries.push(roofGeom)

    // Gold trim on roof edges
    const trimGeom = new THREE.BoxGeometry(currentSize * 1.6, 0.06, 0.12)
    const trimY = currentY + height * 0.05
    const trimZ = currentSize * 0.8

    const frontTrim = trimGeom.clone()
    frontTrim.translate(0, trimY, trimZ)
    goldGeometries.push(frontTrim)

    const backTrim = trimGeom.clone()
    backTrim.translate(0, trimY, -trimZ)
    goldGeometries.push(backTrim)

    currentY += height * 0.35
  }

  // Spire
  for (let i = 0; i < 4; i++) {
    const tierH = 0.5 - i * 0.08
    const tierR = 0.2 - i * 0.04
    const tierGeom = new THREE.CylinderGeometry(tierR * 0.7, tierR, tierH, 6)
    tierGeom.translate(0, currentY + 0.3 + i * 0.4, 0)
    goldGeometries.push(tierGeom)
  }

  // Orb
  const orbGeom = new THREE.SphereGeometry(0.12, 8, 8)
  orbGeom.translate(0, currentY + 2, 0)
  goldGeometries.push(orbGeom)

  // Merge and create meshes
  if (woodGeometries.length > 0) {
    const merged = mergeGeometries(woodGeometries)
    if (merged) {
      const mesh = new THREE.Mesh(merged, materials.darkWood)
      mesh.castShadow = true
      mesh.receiveShadow = true
      pagoda.add(mesh)
    }
  }

  if (roofGeometries.length > 0) {
    const merged = mergeGeometries(roofGeometries)
    if (merged) {
      const mesh = new THREE.Mesh(merged, materials.roof)
      mesh.castShadow = true
      mesh.receiveShadow = true
      pagoda.add(mesh)
    }
  }

  if (goldGeometries.length > 0) {
    const merged = mergeGeometries(goldGeometries)
    if (merged) {
      const mesh = new THREE.Mesh(merged, materials.goldTrim)
      pagoda.add(mesh)
    }
  }

  if (glowGeometries.length > 0) {
    const merged = mergeGeometries(glowGeometries)
    if (merged) {
      const mesh = new THREE.Mesh(merged, materials.windowGlow)
      pagoda.add(mesh)
    }
  }

  // Single point light per pagoda for window glow effect
  const light = new THREE.PointLight(0xffaa55, 1.5, 15)
  light.position.set(0, floors * floorHeight * 0.5, 0)
  pagoda.add(light)

  pagoda.position.set(x, 0, z)
  return pagoda
}

export interface HouseConfig {
  x: number
  z: number
  width: number
  height: number
  depth: number
}

/**
 * Create optimized house - merges geometry
 */
export function createHouse(materials: Materials, config: HouseConfig): THREE.Group {
  const { x, z, width, height, depth } = config
  const house = new THREE.Group()

  const woodGeometries: THREE.BufferGeometry[] = []
  const glowGeometries: THREE.BufferGeometry[] = []

  // Foundation
  const foundGeom = new THREE.BoxGeometry(width + 0.3, 0.25, depth + 0.3)
  foundGeom.translate(0, 0.125, 0)

  // Body
  const bodyGeom = new THREE.BoxGeometry(width, height, depth)
  bodyGeom.translate(0, 0.25 + height / 2, 0)
  woodGeometries.push(bodyGeom)

  // Roof
  const roofGeom = createRoofGeometry(width, height * 0.35, width * 0.2).clone()
  roofGeom.translate(0, 0.25 + height + height * 0.12, 0)

  // Windows
  const winW = width * 0.18
  const winH = height * 0.32
  const winGeom = new THREE.PlaneGeometry(winW, winH)
  const winY = 0.25 + height * 0.5
  const winZ = depth / 2 + 0.02

  for (let i = 0; i < 2; i++) {
    const win = winGeom.clone()
    win.translate((i - 0.5) * width * 0.45, winY, winZ)
    glowGeometries.push(win)
  }

  // Door
  const doorGeom = new THREE.PlaneGeometry(width * 0.18, height * 0.45)
  doorGeom.translate(0, 0.25 + height * 0.28, winZ)
  glowGeometries.push(doorGeom)

  // Merge and create
  const foundMesh = new THREE.Mesh(foundGeom, materials.foundation)
  foundMesh.receiveShadow = true
  house.add(foundMesh)

  if (woodGeometries.length > 0) {
    const merged = mergeGeometries(woodGeometries)
    if (merged) {
      const mesh = new THREE.Mesh(merged, materials.darkWood)
      mesh.castShadow = true
      mesh.receiveShadow = true
      house.add(mesh)
    }
  }

  const roofMesh = new THREE.Mesh(roofGeom, materials.roof)
  roofMesh.castShadow = true
  house.add(roofMesh)

  if (glowGeometries.length > 0) {
    const merged = mergeGeometries(glowGeometries)
    if (merged) {
      const mesh = new THREE.Mesh(merged, materials.windowGlow)
      house.add(mesh)
    }
  }

  // Single light per house
  const light = new THREE.PointLight(0xffaa55, 0.8, 10)
  light.position.set(0, height * 0.5, depth / 2 + 1)
  house.add(light)

  house.position.set(x, 0, z)
  return house
}

/**
 * Create all buildings as a single optimized group
 * Further merges pagodas/houses where possible
 */
export function createBuildingsGroup(
  materials: Materials,
  pagodas: PagodaConfig[],
  houses: HouseConfig[]
): THREE.Group {
  const group = new THREE.Group()

  // Create individual buildings (already optimized internally)
  pagodas.forEach(config => group.add(createPagoda(materials, config)))
  houses.forEach(config => group.add(createHouse(materials, config)))

  return group
}
