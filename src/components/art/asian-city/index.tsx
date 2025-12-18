import { useEffect, useRef, useCallback } from 'react'
import * as THREE from 'three'

import { createMaterials, disposeMaterials, disposeGeometryCache } from './materials'
import { createPagoda, createHouse, PagodaConfig, HouseConfig } from './buildings'
import {
  createLanternSystem,
  createLotusSystem,
  createStreetLampSystem,
  createTreeSystem,
  createFireflySystem,
  updateFireflies,
  LanternData,
  LotusData,
  StreetLampData,
  TreeData,
} from './decorations'
import { createEnvironment } from './environment'
import { createSceneLights, addLightsToScene, disposeLights } from './lights'
import { createControlsState, setupControls, updateControls, requestPointerLock, ControlsState } from './controls'
import { loadModels, disposeLoader, ASIAN_CITY_MODELS, ModelConfig } from './model-loader'

interface AsianCityCanvasProps {
  preview?: boolean
  mouseX?: number
  mouseY?: number
  /** Enable loading external GLB models */
  loadExternalModels?: boolean
}

// Scene configuration
const CONFIG = {
  background: 0x080815,
  fog: { color: 0x080815, previewDensity: 0.018, fullDensity: 0.006 },
  exposure: 1.4,
  camera: {
    fov: 70,
    near: 0.1,
    far: 500,
    previewPos: { x: 0, y: 18, z: 35 },
    fullPos: { x: 0, y: 2.5, z: 25 },
  },
}

// Building configurations
const PAGODAS: PagodaConfig[] = [
  { x: 0, z: -12, floors: 6, baseSize: 6, floorHeight: 4 },
  { x: -15, z: -8, floors: 4, baseSize: 4.5, floorHeight: 3.2 },
  { x: 16, z: -5, floors: 5, baseSize: 5, floorHeight: 3.5 },
  { x: -10, z: 8, floors: 3, baseSize: 3.5, floorHeight: 2.8 },
  { x: 12, z: 10, floors: 3, baseSize: 3, floorHeight: 2.5 },
]

const HOUSES: HouseConfig[] = [
  { x: -6, z: 3, width: 3.5, height: 4.5, depth: 3.5 },
  { x: 7, z: 4, width: 3, height: 4, depth: 3 },
  { x: 5, z: -6, width: 2.5, height: 3.5, depth: 2.5 },
  { x: -12, z: 0, width: 3, height: 3.5, depth: 3 },
  { x: 14, z: 2, width: 2.5, height: 3, depth: 2.5 },
  { x: -4, z: 10, width: 2.5, height: 3, depth: 2.5 },
  { x: 0, z: 6, width: 2, height: 2.5, depth: 2 },
  { x: -8, z: -5, width: 2, height: 2.5, depth: 2 },
]

const LANTERNS: LanternData[] = [
  { x: -3, y: 4, z: 6 }, { x: 4, y: 3.5, z: 4 }, { x: -7, y: 5, z: -1 },
  { x: 8, y: 4.5, z: 2 }, { x: 1, y: 6, z: -4 }, { x: -5, y: 4, z: 9 },
  { x: 6, y: 5, z: 8 }, { x: -2, y: 3.5, z: 11 }, { x: 10, y: 4, z: -2 },
  { x: -10, y: 5, z: 5 }, { x: 3, y: 4, z: -8 }, { x: -6, y: 3.5, z: -6 },
  { x: 15, y: 4.5, z: 6 }, { x: -14, y: 4, z: -4 },
]

const LOTUS: LotusData[] = [
  { x: -28, z: 10 }, { x: -30, z: -5 }, { x: -26, z: -18 },
  { x: -20, z: -25 }, { x: -8, z: -28 }, { x: 5, z: -30 },
  { x: 18, z: -26 }, { x: 28, z: -15 }, { x: 30, z: 2 },
  { x: 28, z: 18 }, { x: 18, z: 26 }, { x: 5, z: 28 },
  { x: -10, z: 27 }, { x: -22, z: 22 }, { x: -32, z: 0 },
  { x: 32, z: -8 }, { x: -25, z: 15 }, { x: 25, z: 22 },
]

const STREET_LAMPS: StreetLampData[] = [
  { x: -10, z: 12 }, { x: -5, z: 12 }, { x: 0, z: 12 }, { x: 5, z: 12 }, { x: 10, z: 12 },
  { x: -12, z: 5 }, { x: 12, z: 5 }, { x: -8, z: -3 }, { x: 8, z: -3 },
  { x: -15, z: -10 }, { x: 15, z: -10 }, { x: 0, z: 18 }, { x: -18, z: 0 }, { x: 18, z: 0 },
]

const TREES: TreeData[] = [
  { x: -18, z: 5, height: 6 }, { x: 20, z: 0, height: 5.5 }, { x: -14, z: 12, height: 5 },
  { x: 10, z: 14, height: 4.5 }, { x: 3, z: 15, height: 5 }, { x: -8, z: -10, height: 4 },
  { x: 18, z: -8, height: 5 }, { x: -20, z: -5, height: 4.5 }, { x: 22, z: 8, height: 5 },
]

interface SceneState {
  scene: THREE.Scene
  camera: THREE.PerspectiveCamera
  renderer: THREE.WebGLRenderer
  animationId: number
  // Preview camera
  targetX: number
  targetY: number
  currentX: number
  currentY: number
  // Animated systems
  lanternBodyMesh: THREE.InstancedMesh | null
  lotusPositions: THREE.Vector3[]
  lotusCenterMesh: THREE.InstancedMesh | null
  fireflies: { points: THREE.Points; basePositions: Float32Array; phases: Float32Array; speeds: Float32Array } | null
  // Controls
  controls: ControlsState | null
}

// Helper to generate random positions within bounds
function generatePositions(
  count: number,
  xRange: [number, number],
  zRange: [number, number],
  yBase: number,
  seed: number
): Array<{ x: number; y: number; z: number; rotationY: number; scale: number }> {
  const positions = []
  // Simple seeded random for reproducibility
  let s = seed
  const random = () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }

  for (let i = 0; i < count; i++) {
    positions.push({
      x: xRange[0] + random() * (xRange[1] - xRange[0]),
      y: yBase,
      z: zRange[0] + random() * (zRange[1] - zRange[0]),
      rotationY: random() * Math.PI * 2,
      scale: 0.8 + random() * 0.4,
    })
  }
  return positions
}

// Procedurally generated model configurations
const TREE_POSITIONS = [
  // Cherry blossom trees around the perimeter
  ...generatePositions(4, [-25, -18], [-20, 15], 0, 42),
  ...generatePositions(4, [18, 25], [-20, 15], 0, 73),
  // A few near the center paths
  { x: -8, y: 0, z: 14, rotationY: 0.5, scale: 1.2 },
  { x: 10, y: 0, z: 16, rotationY: 1.2, scale: 1.0 },
  { x: -14, y: 0, z: -12, rotationY: 2.3, scale: 1.1 },
]

const FLOWER_POSITIONS = [
  // Near water edges
  ...generatePositions(8, [-28, -22], [-15, 15], 0.1, 101),
  ...generatePositions(8, [22, 28], [-15, 15], 0.1, 202),
  // Along paths
  ...generatePositions(6, [-10, 10], [10, 14], 0.1, 303),
]

const BUSH_POSITIONS = [
  // Fill around buildings
  ...generatePositions(5, [-15, -8], [5, 12], 0, 501),
  ...generatePositions(5, [8, 15], [5, 12], 0, 502),
  ...generatePositions(4, [-10, 10], [-8, -5], 0, 503),
]

const ROCK_POSITIONS = [
  // Decorative rocks near water
  { x: -26, y: 0.2, z: 8, rotationY: 0.8, scale: 1.5 },
  { x: 27, y: 0.2, z: -5, rotationY: 1.5, scale: 1.8 },
  { x: -24, y: 0.2, z: -12, rotationY: 2.1, scale: 1.3 },
  { x: 25, y: 0.2, z: 12, rotationY: 0.3, scale: 1.6 },
]

// External model configurations - loaded asynchronously
const EXTERNAL_MODELS: ModelConfig[] = [
  // Cherry blossom trees (fall colored trees work great)
  ...TREE_POSITIONS.map((pos, i) => ({
    path: [
      ASIAN_CITY_MODELS.kenney.trees.defaultFall,
      ASIAN_CITY_MODELS.kenney.trees.oakFall,
      ASIAN_CITY_MODELS.kenney.trees.detailedFall,
    ][i % 3],
    position: { x: pos.x, y: pos.y, z: pos.z },
    rotation: { x: 0, y: pos.rotationY, z: 0 },
    scale: pos.scale * 2.5,
    name: `tree-${i}`,
  })),

  // Red and purple flowers
  ...FLOWER_POSITIONS.map((pos, i) => ({
    path: i % 2 === 0
      ? ASIAN_CITY_MODELS.kenney.flowers.red
      : ASIAN_CITY_MODELS.kenney.flowers.purple,
    position: { x: pos.x, y: pos.y, z: pos.z },
    rotation: { x: 0, y: pos.rotationY, z: 0 },
    scale: pos.scale * 1.5,
    name: `flower-${i}`,
  })),

  // Bushes for ground cover
  ...BUSH_POSITIONS.map((pos, i) => ({
    path: i % 2 === 0
      ? ASIAN_CITY_MODELS.kenney.plants.bush
      : ASIAN_CITY_MODELS.kenney.plants.bushLarge,
    position: { x: pos.x, y: pos.y, z: pos.z },
    rotation: { x: 0, y: pos.rotationY, z: 0 },
    scale: pos.scale * 2,
    name: `bush-${i}`,
  })),

  // Decorative rocks
  ...ROCK_POSITIONS.map((pos, i) => ({
    path: i % 2 === 0
      ? ASIAN_CITY_MODELS.kenney.props.cliffRock
      : ASIAN_CITY_MODELS.kenney.props.cliffLargeRock,
    position: { x: pos.x, y: pos.y, z: pos.z },
    rotation: { x: 0, y: pos.rotationY, z: 0 },
    scale: pos.scale * 1.2,
    name: `rock-${i}`,
  })),

  // Stone bridge across the scene
  {
    path: ASIAN_CITY_MODELS.kenney.props.bridgeStone,
    position: { x: 0, y: 0.8, z: 12 },
    rotation: { x: 0, y: Math.PI / 2, z: 0 },
    scale: 3,
    name: 'bridge-main',
  },
]

export function AsianCityCanvas({ preview = false, mouseX = 0.5, mouseY = 0.5, loadExternalModels = false }: AsianCityCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const stateRef = useRef<SceneState | null>(null)

  // Update preview camera target
  useEffect(() => {
    if (stateRef.current && preview) {
      stateRef.current.targetX = (mouseX - 0.5) * 20
      stateRef.current.targetY = 15 + (mouseY - 0.5) * 10
    }
  }, [mouseX, mouseY, preview])

  const handlePointerLock = useCallback(() => {
    if (!containerRef.current || preview) return
    requestPointerLock(containerRef.current)
  }, [preview])

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    const width = container.clientWidth
    const height = container.clientHeight

    // Scene
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(CONFIG.background)
    scene.fog = new THREE.FogExp2(
      CONFIG.fog.color,
      preview ? CONFIG.fog.previewDensity : CONFIG.fog.fullDensity
    )

    // Camera
    const camera = new THREE.PerspectiveCamera(CONFIG.camera.fov, width / height, CONFIG.camera.near, CONFIG.camera.far)
    const camPos = preview ? CONFIG.camera.previewPos : CONFIG.camera.fullPos
    camera.position.set(camPos.x, camPos.y, camPos.z)

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: !preview,
      powerPreference: 'high-performance',
    })
    renderer.setSize(width, height)
    renderer.setPixelRatio(preview ? 1 : Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = !preview
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = CONFIG.exposure
    container.appendChild(renderer.domElement)

    // Materials
    const materials = createMaterials()

    // Lights
    const lights = createSceneLights(!preview)
    addLightsToScene(scene, lights)

    // Environment
    const { group: envGroup } = createEnvironment(materials)
    scene.add(envGroup)

    // Buildings
    PAGODAS.forEach(c => scene.add(createPagoda(materials, c)))
    HOUSES.forEach(c => scene.add(createHouse(materials, c)))

    // Decorations
    const { group: lanternGroup } = createLanternSystem(materials, LANTERNS)
    scene.add(lanternGroup)
    const lanternBodyMesh = lanternGroup.userData.bodyMesh as THREE.InstancedMesh

    const { group: lotusGroup, positions: lotusPositions } = createLotusSystem(LOTUS)
    scene.add(lotusGroup)
    const lotusCenterMesh = lotusGroup.userData.centerMesh as THREE.InstancedMesh

    scene.add(createStreetLampSystem(materials, STREET_LAMPS, !preview))
    scene.add(createTreeSystem(TREES))

    // Fireflies (full mode only)
    let fireflies: SceneState['fireflies'] = null
    if (!preview) {
      fireflies = createFireflySystem({ x: 25, z: 25 }, 25)
      scene.add(fireflies.points)
    }

    // Load external models asynchronously (if enabled)
    console.log(`[AsianCity] loadExternalModels=${loadExternalModels}, preview=${preview}`)
    if (loadExternalModels && !preview) {
      console.log('[AsianCity] Loading external models...', EXTERNAL_MODELS)
      loadModels(EXTERNAL_MODELS)
        .then((loadedModels) => {
          console.log(`[AsianCity] All models loaded: ${loadedModels.length}`)
          loadedModels.forEach((model) => {
            scene.add(model.scene)
            console.log(`[AsianCity] Added model to scene: ${model.name}`)
          })
        })
        .catch((error) => {
          console.error('[AsianCity] Failed to load external models:', error)
        })
    }

    // Controls
    let cleanupControls: (() => void) | null = null
    let controls: ControlsState | null = null

    if (!preview) {
      controls = createControlsState()
      cleanupControls = setupControls(container, controls)
    }

    // Animation state
    let time = 0
    const matrix = new THREE.Matrix4()
    const position = new THREE.Vector3()
    const quaternion = new THREE.Quaternion()
    const scale = new THREE.Vector3(1, 1, 1)

    function animate() {
      if (!stateRef.current) return
      stateRef.current.animationId = requestAnimationFrame(animate)

      time += 0.008

      // Camera
      if (preview) {
        const s = stateRef.current
        s.currentX += (s.targetX - s.currentX) * 0.06
        s.currentY += (s.targetY - s.currentY) * 0.06
        camera.position.x = s.currentX
        camera.position.y = s.currentY
        camera.position.z = 30
        camera.lookAt(0, 6, 0)
      } else if (controls) {
        updateControls(camera, controls)
      }

      // Animate lanterns - gentle sway using instance matrices
      if (lanternBodyMesh) {
        for (let i = 0; i < LANTERNS.length; i++) {
          const { x, y, z } = LANTERNS[i]
          position.set(x, y, z)
          quaternion.setFromEuler(new THREE.Euler(0, 0, Math.sin(time * 2 + i) * 0.05))
          matrix.compose(position, quaternion, scale)
          lanternBodyMesh.setMatrixAt(i, matrix)
        }
        lanternBodyMesh.instanceMatrix.needsUpdate = true
      }

      // Animate lotus - bob on water
      if (lotusCenterMesh && lotusPositions.length > 0) {
        for (let i = 0; i < lotusPositions.length; i++) {
          const p = lotusPositions[i]
          position.set(p.x, 0.08 + Math.sin(time * 1.5 + i * 0.5) * 0.04 + 0.12, p.z)
          matrix.compose(position, quaternion.identity(), scale)
          lotusCenterMesh.setMatrixAt(i, matrix)
        }
        lotusCenterMesh.instanceMatrix.needsUpdate = true
      }

      // Animate fireflies
      if (fireflies) {
        updateFireflies(fireflies.points, fireflies.basePositions, fireflies.phases, fireflies.speeds, time)
      }

      renderer.render(scene, camera)
    }

    // Initialize state
    stateRef.current = {
      scene,
      camera,
      renderer,
      animationId: 0,
      targetX: 0,
      targetY: 18,
      currentX: 0,
      currentY: 18,
      lanternBodyMesh,
      lotusPositions,
      lotusCenterMesh,
      fireflies,
      controls,
    }

    animate()

    // Resize
    const handleResize = () => {
      if (!containerRef.current || !stateRef.current) return
      const w = containerRef.current.clientWidth
      const h = containerRef.current.clientHeight
      stateRef.current.camera.aspect = w / h
      stateRef.current.camera.updateProjectionMatrix()
      stateRef.current.renderer.setSize(w, h)
    }

    window.addEventListener('resize', handleResize)

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize)
      cleanupControls?.()

      if (stateRef.current) {
        cancelAnimationFrame(stateRef.current.animationId)
        stateRef.current.renderer.dispose()
      }

      disposeLights(lights)
      disposeMaterials()
      disposeGeometryCache()
      disposeLoader()

      // Dispose all scene objects
      scene.traverse(obj => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry?.dispose()
          if (Array.isArray(obj.material)) {
            obj.material.forEach(m => m.dispose())
          } else {
            obj.material?.dispose()
          }
        }
      })

      container.innerHTML = ''
      stateRef.current = null
    }
  }, [preview, loadExternalModels])

  return (
    <div
      ref={containerRef}
      className="w-full h-full cursor-crosshair"
      onClick={handlePointerLock}
    />
  )
}
