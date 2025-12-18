import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'

// Singleton loaders - reuse across loads
let gltfLoader: GLTFLoader | null = null
let dracoLoader: DRACOLoader | null = null

/**
 * Get or create the GLTF loader with Draco support
 */
function getLoader(): GLTFLoader {
  if (!gltfLoader) {
    dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/')

    gltfLoader = new GLTFLoader()
    gltfLoader.setDRACOLoader(dracoLoader)
  }
  return gltfLoader
}

export interface ModelConfig {
  path: string
  position?: { x: number; y: number; z: number }
  rotation?: { x: number; y: number; z: number }
  scale?: number | { x: number; y: number; z: number }
  castShadow?: boolean
  receiveShadow?: boolean
  name?: string
}

export interface LoadedModel {
  scene: THREE.Group
  animations: THREE.AnimationClip[]
  name: string
}

/**
 * Load a single GLTF/GLB model
 */
export async function loadModel(config: ModelConfig): Promise<LoadedModel> {
  const loader = getLoader()

  console.log(`[ModelLoader] Starting load: ${config.path}`)

  return new Promise((resolve, reject) => {
    loader.load(
      config.path,
      (gltf) => {
        console.log(`[ModelLoader] Successfully loaded: ${config.path}`)
        const model = gltf.scene

        // Apply position
        if (config.position) {
          model.position.set(config.position.x, config.position.y, config.position.z)
        }

        // Apply rotation (in radians)
        if (config.rotation) {
          model.rotation.set(config.rotation.x, config.rotation.y, config.rotation.z)
        }

        // Apply scale
        if (config.scale !== undefined) {
          if (typeof config.scale === 'number') {
            model.scale.setScalar(config.scale)
          } else {
            model.scale.set(config.scale.x, config.scale.y, config.scale.z)
          }
        }

        // Apply shadows
        model.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            if (config.castShadow !== false) {
              child.castShadow = true
            }
            if (config.receiveShadow !== false) {
              child.receiveShadow = true
            }
          }
        })

        // Set name for debugging
        model.name = config.name || config.path.split('/').pop() || 'model'

        resolve({
          scene: model,
          animations: gltf.animations,
          name: model.name,
        })
      },
      // Progress callback
      (progress) => {
        if (progress.total > 0) {
          const percent = Math.round((progress.loaded / progress.total) * 100)
          console.log(`[ModelLoader] Loading ${config.path}: ${percent}%`)
        }
      },
      // Error callback
      (error) => {
        console.error(`[ModelLoader] Failed to load: ${config.path}`, error)
        reject(error)
      }
    )
  })
}

/**
 * Load multiple models in parallel
 */
export async function loadModels(configs: ModelConfig[]): Promise<LoadedModel[]> {
  return Promise.all(configs.map(loadModel))
}

/**
 * Preload models without adding to scene
 * Useful for caching models before they're needed
 */
export function preloadModel(path: string): Promise<void> {
  return loadModel({ path }).then(() => {})
}

/**
 * Create instanced copies of a loaded model
 * Useful for placing many copies efficiently
 */
export function createModelInstances(
  model: LoadedModel,
  positions: Array<{ x: number; y: number; z: number; rotationY?: number; scale?: number }>
): THREE.Group {
  const group = new THREE.Group()
  group.name = `${model.name}-instances`

  positions.forEach((pos, i) => {
    const clone = model.scene.clone()
    clone.position.set(pos.x, pos.y, pos.z)
    if (pos.rotationY !== undefined) {
      clone.rotation.y = pos.rotationY
    }
    if (pos.scale !== undefined) {
      clone.scale.setScalar(pos.scale)
    }
    clone.name = `${model.name}-${i}`
    group.add(clone)
  })

  return group
}

/**
 * Dispose loader resources
 */
export function disposeLoader(): void {
  if (dracoLoader) {
    dracoLoader.dispose()
    dracoLoader = null
  }
  gltfLoader = null
}

/**
 * Model paths for the asian-city scene
 * Kenney Nature Kit: CC0 (no attribution required)
 * Khronos samples: CC-BY 4.0
 */
export const ASIAN_CITY_MODELS = {
  // Khronos sample models (for testing)
  test: {
    duck: '/models/khronos/duck.glb',
    lantern: '/models/khronos/lantern.glb',
  },

  // Kenney Nature Kit - CC0 licensed
  kenney: {
    trees: {
      defaultFall: '/models/kenney/tree_default_fall.glb',
      oakFall: '/models/kenney/tree_oak_fall.glb',
      detailedFall: '/models/kenney/tree_detailed_fall.glb',
      smallFall: '/models/kenney/tree_small_fall.glb',
      pineRound: '/models/kenney/tree_pineRoundA.glb',
    },
    flowers: {
      red: '/models/kenney/flower_redA.glb',
      purple: '/models/kenney/flower_purpleA.glb',
    },
    plants: {
      bush: '/models/kenney/plant_bush.glb',
      bushLarge: '/models/kenney/plant_bushLarge.glb',
      grass: '/models/kenney/grass.glb',
    },
    props: {
      bridgeStone: '/models/kenney/bridge_stone.glb',
      cliffRock: '/models/kenney/cliff_rock.glb',
      cliffLargeRock: '/models/kenney/cliff_large_rock.glb',
      campfireStones: '/models/kenney/campfire_stones.glb',
    },
  },
} as const
