import * as THREE from 'three'

/**
 * Cached materials singleton - prevents duplicate material creation
 * Materials are expensive to create and should be shared across meshes
 */
let cachedMaterials: Materials | null = null

export interface Materials {
  darkWood: THREE.MeshStandardMaterial
  roof: THREE.MeshStandardMaterial
  goldTrim: THREE.MeshStandardMaterial
  windowGlow: THREE.MeshBasicMaterial
  lanternRed: THREE.MeshBasicMaterial
  lanternGold: THREE.MeshBasicMaterial
  stone: THREE.MeshStandardMaterial
  foundation: THREE.MeshStandardMaterial
  // Emissive variants for glowing elements
  warmGlow: THREE.MeshBasicMaterial
  coolGlow: THREE.MeshBasicMaterial
}

export function createMaterials(): Materials {
  // Return cached if exists
  if (cachedMaterials) return cachedMaterials

  cachedMaterials = {
    darkWood: new THREE.MeshStandardMaterial({
      color: 0x2a2030,
      roughness: 0.85,
      metalness: 0.05,
    }),

    roof: new THREE.MeshStandardMaterial({
      color: 0x1a1a25,
      roughness: 0.7,
      metalness: 0.1,
    }),

    goldTrim: new THREE.MeshStandardMaterial({
      color: 0xcc9944,
      roughness: 0.4,
      metalness: 0.6,
      emissive: 0x221100,
      emissiveIntensity: 0.15,
    }),

    windowGlow: new THREE.MeshBasicMaterial({
      color: 0xffbb66,
    }),

    lanternRed: new THREE.MeshBasicMaterial({
      color: 0xff5533,
    }),

    lanternGold: new THREE.MeshBasicMaterial({
      color: 0xffaa44,
    }),

    stone: new THREE.MeshStandardMaterial({
      color: 0x3a3a45,
      roughness: 0.85,
    }),

    foundation: new THREE.MeshStandardMaterial({
      color: 0x2a2a35,
      roughness: 0.9,
    }),

    warmGlow: new THREE.MeshBasicMaterial({
      color: 0xffdd88,
    }),

    coolGlow: new THREE.MeshBasicMaterial({
      color: 0xaaccff,
    }),
  }

  return cachedMaterials
}

/**
 * Dispose all cached materials - call on unmount
 */
export function disposeMaterials(): void {
  if (!cachedMaterials) return

  Object.values(cachedMaterials).forEach(material => {
    material.dispose()
  })
  cachedMaterials = null
}

/**
 * Cached geometries for reuse
 */
const geometryCache = new Map<string, THREE.BufferGeometry>()

export function getCachedGeometry(key: string, factory: () => THREE.BufferGeometry): THREE.BufferGeometry {
  let geom = geometryCache.get(key)
  if (!geom) {
    geom = factory()
    geometryCache.set(key, geom)
  }
  return geom
}

export function disposeGeometryCache(): void {
  geometryCache.forEach(geom => geom.dispose())
  geometryCache.clear()
}
