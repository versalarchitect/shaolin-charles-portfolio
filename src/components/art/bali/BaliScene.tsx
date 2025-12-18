import { useEffect, useRef, useCallback } from 'react'
import * as THREE from 'three'

// Materials
import { createBaliMaterials, disposeBaliMaterials } from './materials'

// Scene components
import { createSimpleRiceTerrace } from './rice-terrace'
import {
  createCandiBentar,
  createMeruTower,
  createGuardianStatue,
} from './temple'
import {
  createCoconutPalm,
  createBananaPlant,
  createFrangipaniTree,
  createLotusFlower,
  createTropicalGrove,
} from './flora'
import { createVolcano, createVolcanicHaze } from './volcano'
import { createBaliAtmosphere } from './atmosphere'
import {
  createCanangSari,
  createPenjor,
  createTedung,
  createOfferingPath,
} from './cultural'

interface BaliSceneProps {
  preview?: boolean
  mouseX?: number
  mouseY?: number
}

/**
 * Bali Scene - Interactive Three.js Art Piece
 *
 * A sophisticated representation of Bali, Indonesia featuring:
 * - Rice terraces with reflective water
 * - Balinese temple architecture
 * - Mount Agung volcano backdrop
 * - Tropical flora (palms, frangipani, lotus)
 * - Cultural elements (offerings, penjor, ceremonial umbrellas)
 * - Atmospheric effects (sunset sky, mist, fireflies)
 *
 * Controls:
 * - WASD: Move
 * - Mouse: Look around (click to capture)
 * - Space: Jump / Fly up
 * - Shift: Fly down
 * - E: Toggle fly mode
 */
export function BaliScene({
  preview = false,
  mouseX = 0.5,
  mouseY = 0.5,
}: BaliSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<{
    scene: THREE.Scene
    camera: THREE.PerspectiveCamera
    renderer: THREE.WebGLRenderer
    animationId: number
    timeUniform: { value: number }
    materials: ReturnType<typeof createBaliMaterials>
    // Camera state
    targetCameraX: number
    targetCameraY: number
    targetCameraZ: number
    // Controls
    keys: { [key: string]: boolean }
    isFlying: boolean
    velocity: THREE.Vector3
    yaw: number
    pitch: number
    isPointerLocked: boolean
  } | null>(null)

  // Update camera target when mouse moves (preview mode)
  useEffect(() => {
    if (sceneRef.current && preview) {
      sceneRef.current.targetCameraX = (mouseX - 0.5) * 30
      sceneRef.current.targetCameraY = 12 + (mouseY - 0.5) * 8
    }
  }, [mouseX, mouseY, preview])

  // Pointer lock for first-person controls
  const handlePointerLock = useCallback(() => {
    if (!containerRef.current || preview) return
    containerRef.current.requestPointerLock()
  }, [preview])

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    const width = container.clientWidth
    const height = container.clientHeight

    // ============================================
    // SCENE SETUP
    // ============================================
    const scene = new THREE.Scene()

    // Background color (will be covered by sky dome)
    scene.background = new THREE.Color(0x1a0a2a)

    // Fog for depth
    scene.fog = new THREE.FogExp2(
      0x667788,
      preview ? 0.015 : 0.008
    )

    // ============================================
    // CAMERA
    // ============================================
    const camera = new THREE.PerspectiveCamera(
      preview ? 60 : 70,
      width / height,
      0.1,
      500
    )

    // Initial position - overlooking the scene
    if (preview) {
      camera.position.set(0, 15, 40)
    } else {
      camera.position.set(0, 3, 25)
    }

    // ============================================
    // RENDERER
    // ============================================
    const renderer = new THREE.WebGLRenderer({
      antialias: !preview,
      alpha: false,
      powerPreference: 'high-performance',
    })
    renderer.setSize(width, height)
    renderer.setPixelRatio(preview ? 1 : Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = !preview
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.2
    container.appendChild(renderer.domElement)

    // ============================================
    // MATERIALS
    // ============================================
    const materials = createBaliMaterials()

    // Shared time uniform for all animated shaders
    const timeUniform = { value: 0 }

    // ============================================
    // ATMOSPHERE (Sky, Lighting, Particles)
    // ============================================
    const atmosphere = createBaliAtmosphere(scene, timeUniform, {
      mistEnabled: !preview,
      firefliesEnabled: !preview,
      starsEnabled: true,
    })

    // ============================================
    // VOLCANO BACKDROP
    // ============================================
    const volcano = createVolcano(
      materials,
      40,
      60,
      new THREE.Vector3(0, 0, -120)
    )
    scene.add(volcano)

    // Atmospheric haze between viewer and volcano
    const haze = createVolcanicHaze(200, 30, 1, new THREE.Vector3(0, 0, -80))
    scene.add(haze)

    // ============================================
    // RICE TERRACES
    // ============================================
    // Main terrace system (left side)
    const terraceLeft = createSimpleRiceTerrace(
      materials,
      new THREE.Vector3(-25, 0, -20),
      1.2
    )
    scene.add(terraceLeft)

    // Secondary terrace (right side)
    const terraceRight = createSimpleRiceTerrace(
      materials,
      new THREE.Vector3(25, 0, -15),
      1.0
    )
    terraceRight.rotation.y = Math.PI * 0.1
    scene.add(terraceRight)

    // Background terraces (smaller, distant)
    const terraceBack = createSimpleRiceTerrace(
      materials,
      new THREE.Vector3(0, 5, -50),
      0.8
    )
    scene.add(terraceBack)

    // ============================================
    // TEMPLE COMPLEX
    // ============================================
    // Main entrance gate (Candi Bentar)
    const mainGate = createCandiBentar(
      materials,
      10,
      4,
      new THREE.Vector3(0, 0, 10)
    )
    scene.add(mainGate)

    // Guardian statues
    const leftGuardian = createGuardianStatue(
      materials,
      2.5,
      new THREE.Vector3(-6, 0, 8),
      true
    )
    scene.add(leftGuardian)

    const rightGuardian = createGuardianStatue(
      materials,
      2.5,
      new THREE.Vector3(6, 0, 8),
      false
    )
    scene.add(rightGuardian)

    // Main Meru tower (11 tiers - highest significance)
    const mainMeru = createMeruTower(
      materials,
      11,
      4,
      new THREE.Vector3(0, 0, -25)
    )
    scene.add(mainMeru)

    // Secondary Meru towers
    const leftMeru = createMeruTower(
      materials,
      7,
      3,
      new THREE.Vector3(-12, 0, -20)
    )
    scene.add(leftMeru)

    const rightMeru = createMeruTower(
      materials,
      7,
      3,
      new THREE.Vector3(12, 0, -20)
    )
    scene.add(rightMeru)

    // Smaller shrines
    const smallMeru1 = createMeruTower(
      materials,
      5,
      2.5,
      new THREE.Vector3(-18, 0, -10)
    )
    scene.add(smallMeru1)

    const smallMeru2 = createMeruTower(
      materials,
      5,
      2.5,
      new THREE.Vector3(18, 0, -10)
    )
    scene.add(smallMeru2)

    // ============================================
    // TROPICAL FLORA
    // ============================================
    // Palm trees around the scene
    const palmPositions = [
      { x: -20, z: 5, height: 14, lean: 0.3 },
      { x: 22, z: 8, height: 12, lean: -0.2 },
      { x: -30, z: -5, height: 10, lean: 0.4 },
      { x: 28, z: -8, height: 13, lean: -0.35 },
      { x: -15, z: 15, height: 11, lean: 0.25 },
      { x: 18, z: 18, height: 9, lean: -0.15 },
      { x: -35, z: -30, height: 12, lean: 0.3 },
      { x: 35, z: -25, height: 11, lean: -0.25 },
    ]

    palmPositions.forEach(({ x, z, height, lean }) => {
      const palm = createCoconutPalm(
        materials,
        height,
        Math.abs(lean),
        new THREE.Vector3(x, 0, z)
      )
      if (lean < 0) palm.scale.x = -1
      scene.add(palm)
    })

    // Banana plants
    const bananaPositions = [
      { x: -8, z: 5 },
      { x: 10, z: 6 },
      { x: -22, z: -8 },
      { x: 24, z: -5 },
    ]

    bananaPositions.forEach(({ x, z }) => {
      const banana = createBananaPlant(
        materials,
        2.5 + Math.random(),
        new THREE.Vector3(x, 0, z)
      )
      scene.add(banana)
    })

    // Frangipani trees near temples
    const frangipaniPositions = [
      { x: -10, z: -15 },
      { x: 10, z: -15 },
      { x: -5, z: 5 },
      { x: 5, z: 5 },
    ]

    frangipaniPositions.forEach(({ x, z }) => {
      const tree = createFrangipaniTree(
        materials,
        3 + Math.random() * 2,
        new THREE.Vector3(x, 0, z)
      )
      scene.add(tree)
    })

    // Tropical grove in background
    const grove = createTropicalGrove(
      materials,
      15,
      20,
      new THREE.Vector3(-40, 0, -40)
    )
    scene.add(grove)

    const grove2 = createTropicalGrove(
      materials,
      12,
      18,
      new THREE.Vector3(40, 0, -35)
    )
    scene.add(grove2)

    // ============================================
    // LOTUS POND
    // ============================================
    // Create a small pond with lotus flowers
    const pondGeometry = new THREE.CircleGeometry(6, 32)
    const pond = new THREE.Mesh(pondGeometry, materials.paddyWater)
    pond.rotation.x = -Math.PI / 2
    pond.position.set(15, 0.05, 0)
    pond.receiveShadow = true
    scene.add(pond)

    // Lotus flowers in pond
    const lotusPositions = [
      { x: 14, z: 1, scale: 1 },
      { x: 16, z: -1, scale: 0.8 },
      { x: 13, z: -2, scale: 1.2 },
      { x: 17, z: 2, scale: 0.9 },
      { x: 15, z: 0, scale: 1.1 },
    ]

    lotusPositions.forEach(({ x, z, scale }) => {
      const lotus = createLotusFlower(
        materials,
        scale,
        new THREE.Vector3(x, 0.1, z)
      )
      scene.add(lotus)
    })

    // ============================================
    // CULTURAL ELEMENTS
    // ============================================
    // Offerings along the temple path
    const offerings = createOfferingPath(
      materials,
      15,
      2.5,
      new THREE.Vector3(-2, 0, 0)
    )
    scene.add(offerings)

    // Penjor poles (Galungan decoration)
    const penjorPositions = [
      { x: -4, z: 15 },
      { x: 4, z: 15 },
      { x: -4, z: 20 },
      { x: 4, z: 20 },
    ]

    penjorPositions.forEach(({ x, z }, i) => {
      const penjor = createPenjor(
        materials,
        7 + Math.random(),
        new THREE.Vector3(x, 0, z)
      )
      penjor.rotation.y = i % 2 === 0 ? Math.PI / 6 : -Math.PI / 6
      if (i % 2 !== 0) penjor.scale.x = -1
      scene.add(penjor)
    })

    // Ceremonial umbrellas (Tedung)
    const tedung1 = createTedung(
      materials,
      3,
      3,
      new THREE.Vector3(-3, 0, -22)
    )
    scene.add(tedung1)

    const tedung2 = createTedung(
      materials,
      3,
      3,
      new THREE.Vector3(3, 0, -22)
    )
    scene.add(tedung2)

    // Individual offerings at key locations
    const singleOfferings = [
      { x: 0, z: 8 },  // At gate entrance
      { x: 0, z: -22 }, // At main Meru
      { x: -12, z: -17 }, // At left Meru
      { x: 12, z: -17 }, // At right Meru
    ]

    singleOfferings.forEach(({ x, z }) => {
      const canang = createCanangSari(
        materials,
        1.2,
        new THREE.Vector3(x, 0.02, z)
      )
      scene.add(canang)
    })

    // ============================================
    // GROUND PLANE
    // ============================================
    const groundGeometry = new THREE.PlaneGeometry(200, 200)
    const ground = new THREE.Mesh(groundGeometry, materials.terraceEarth)
    ground.rotation.x = -Math.PI / 2
    ground.position.y = -0.1
    ground.receiveShadow = true
    scene.add(ground)

    // Temple courtyard (stone)
    const courtyardGeometry = new THREE.PlaneGeometry(40, 50)
    const courtyard = new THREE.Mesh(courtyardGeometry, materials.volcanicStone)
    courtyard.rotation.x = -Math.PI / 2
    courtyard.position.set(0, 0.01, -5)
    courtyard.receiveShadow = true
    scene.add(courtyard)

    // ============================================
    // COLLISION BOXES
    // ============================================
    // Define collision boxes for major structures (x, z, width, depth)
    const collisionBoxes: Array<{ x: number; z: number; w: number; d: number; h?: number }> = [
      // Main gate pillars
      { x: -3.5, z: 10, w: 3.5, d: 3.5 },
      { x: 3.5, z: 10, w: 3.5, d: 3.5 },
      // Guardian statues
      { x: -6, z: 8, w: 1.5, d: 1.5 },
      { x: 6, z: 8, w: 1.5, d: 1.5 },
      // Main Meru tower
      { x: 0, z: -25, w: 7, d: 7 },
      // Secondary Meru towers
      { x: -12, z: -20, w: 5, d: 5 },
      { x: 12, z: -20, w: 5, d: 5 },
      // Small shrines
      { x: -18, z: -10, w: 4, d: 4 },
      { x: 18, z: -10, w: 4, d: 4 },
      // Palm trees (approximate)
      { x: -20, z: 5, w: 1, d: 1 },
      { x: 22, z: 8, w: 1, d: 1 },
      { x: -30, z: -5, w: 1, d: 1 },
      { x: 28, z: -8, w: 1, d: 1 },
      { x: -15, z: 15, w: 1, d: 1 },
      { x: 18, z: 18, w: 1, d: 1 },
      // Penjor poles
      { x: -4, z: 15, w: 0.5, d: 0.5 },
      { x: 4, z: 15, w: 0.5, d: 0.5 },
      { x: -4, z: 20, w: 0.5, d: 0.5 },
      { x: 4, z: 20, w: 0.5, d: 0.5 },
      // Tedung umbrellas
      { x: -3, z: -22, w: 1.5, d: 1.5 },
      { x: 3, z: -22, w: 1.5, d: 1.5 },
      // Frangipani trees
      { x: -10, z: -15, w: 1.5, d: 1.5 },
      { x: 10, z: -15, w: 1.5, d: 1.5 },
      { x: -5, z: 5, w: 1.5, d: 1.5 },
      { x: 5, z: 5, w: 1.5, d: 1.5 },
      // Banana plants
      { x: -8, z: 5, w: 1.2, d: 1.2 },
      { x: 10, z: 6, w: 1.2, d: 1.2 },
      { x: -22, z: -8, w: 1.2, d: 1.2 },
      { x: 24, z: -5, w: 1.2, d: 1.2 },
      // More distant palm trees
      { x: -35, z: -30, w: 1, d: 1 },
      { x: 35, z: -25, w: 1, d: 1 },
    ]

    // Collision detection function
    function checkCollision(
      newX: number,
      newZ: number,
      playerRadius: number = 0.5
    ): boolean {
      for (const box of collisionBoxes) {
        const halfW = box.w / 2 + playerRadius
        const halfD = box.d / 2 + playerRadius

        if (
          newX > box.x - halfW &&
          newX < box.x + halfW &&
          newZ > box.z - halfD &&
          newZ < box.z + halfD
        ) {
          return true // Collision detected
        }
      }
      return false
    }

    // ============================================
    // CONTROLS
    // ============================================
    const keys: { [key: string]: boolean } = {}
    let isFlying = false
    const velocity = new THREE.Vector3()
    let yaw = 0
    let pitch = 0
    let isPointerLocked = false

    const moveSpeed = 0.15
    const flySpeed = 0.22
    const jumpForce = 0.28
    const gravity = 0.012
    const groundLevel = 2

    function onKeyDown(e: KeyboardEvent) {
      keys[e.code] = true
      if (e.code === 'KeyE' && !preview) {
        isFlying = !isFlying
      }
    }

    function onKeyUp(e: KeyboardEvent) {
      keys[e.code] = false
    }

    function onMouseMove(e: MouseEvent) {
      if (!isPointerLocked || preview) return
      yaw -= e.movementX * 0.002
      pitch -= e.movementY * 0.002
      pitch = Math.max(-Math.PI / 2 + 0.1, Math.min(Math.PI / 2 - 0.1, pitch))
    }

    function onPointerLockChange() {
      isPointerLocked = document.pointerLockElement === container
    }

    if (!preview) {
      window.addEventListener('keydown', onKeyDown)
      window.addEventListener('keyup', onKeyUp)
      document.addEventListener('mousemove', onMouseMove)
      document.addEventListener('pointerlockchange', onPointerLockChange)
    }

    // ============================================
    // ANIMATION LOOP
    // ============================================
    let currentCameraX = 0
    let currentCameraY = 15
    let currentCameraZ = 40

    function animate() {
      sceneRef.current!.animationId = requestAnimationFrame(animate)

      // Update time for shaders
      timeUniform.value += 0.016 // ~60fps

      if (preview) {
        // Preview mode - smooth camera movement following mouse
        const targetX = sceneRef.current!.targetCameraX
        const targetY = sceneRef.current!.targetCameraY

        currentCameraX += (targetX - currentCameraX) * 0.05
        currentCameraY += (targetY - currentCameraY) * 0.05

        camera.position.x = currentCameraX
        camera.position.y = currentCameraY
        camera.position.z = 40

        camera.lookAt(0, 5, -10)
      } else {
        // First-person controls
        const direction = new THREE.Vector3()

        // Forward is negative Z (into the scene), so negate sin/cos
        const forward = new THREE.Vector3(-Math.sin(yaw), 0, -Math.cos(yaw))
        const right = new THREE.Vector3(
          -Math.sin(yaw - Math.PI / 2),
          0,
          -Math.cos(yaw - Math.PI / 2)
        )

        if (keys['KeyW']) direction.add(forward)
        if (keys['KeyS']) direction.sub(forward)
        if (keys['KeyA']) direction.add(right)
        if (keys['KeyD']) direction.sub(right)

        if (direction.length() > 0) {
          direction.normalize()
          const speed = isFlying ? flySpeed : moveSpeed
          velocity.x = direction.x * speed
          velocity.z = direction.z * speed
        } else {
          velocity.x *= 0.85
          velocity.z *= 0.85
        }

        if (isFlying) {
          if (keys['Space']) velocity.y = flySpeed
          else if (keys['ShiftLeft']) velocity.y = -flySpeed
          else velocity.y *= 0.9
        } else {
          if (keys['Space'] && camera.position.y <= groundLevel + 0.1) {
            velocity.y = jumpForce
          }
          velocity.y -= gravity
          if (camera.position.y + velocity.y < groundLevel) {
            camera.position.y = groundLevel
            velocity.y = 0
          }
        }

        // Apply movement with collision detection
        const newX = camera.position.x + velocity.x
        const newZ = camera.position.z + velocity.z

        // Try moving both X and Z
        if (!checkCollision(newX, newZ)) {
          camera.position.x = newX
          camera.position.z = newZ
        } else {
          // Try sliding along X axis only
          if (!checkCollision(newX, camera.position.z)) {
            camera.position.x = newX
          }
          // Try sliding along Z axis only
          if (!checkCollision(camera.position.x, newZ)) {
            camera.position.z = newZ
          }
        }

        // Apply vertical movement (no collision for Y)
        camera.position.y += velocity.y

        // Bounds
        camera.position.x = Math.max(-80, Math.min(80, camera.position.x))
        camera.position.z = Math.max(-80, Math.min(60, camera.position.z))
        if (isFlying) {
          camera.position.y = Math.max(1, Math.min(80, camera.position.y))
        }

        // Apply rotation
        camera.rotation.order = 'YXZ'
        camera.rotation.y = yaw
        camera.rotation.x = pitch
      }

      renderer.render(scene, camera)
    }

    // Store references
    sceneRef.current = {
      scene,
      camera,
      renderer,
      animationId: 0,
      timeUniform,
      materials,
      targetCameraX: 0,
      targetCameraY: 15,
      targetCameraZ: 40,
      keys,
      isFlying,
      velocity,
      yaw,
      pitch,
      isPointerLocked,
    }

    animate()

    // ============================================
    // RESIZE HANDLER
    // ============================================
    function handleResize() {
      if (!containerRef.current || !sceneRef.current) return
      const w = containerRef.current.clientWidth
      const h = containerRef.current.clientHeight
      sceneRef.current.camera.aspect = w / h
      sceneRef.current.camera.updateProjectionMatrix()
      sceneRef.current.renderer.setSize(w, h)
    }

    window.addEventListener('resize', handleResize)

    // ============================================
    // CLEANUP
    // ============================================
    return () => {
      window.removeEventListener('resize', handleResize)

      if (!preview) {
        window.removeEventListener('keydown', onKeyDown)
        window.removeEventListener('keyup', onKeyUp)
        document.removeEventListener('mousemove', onMouseMove)
        document.removeEventListener('pointerlockchange', onPointerLockChange)
      }

      if (sceneRef.current) {
        cancelAnimationFrame(sceneRef.current.animationId)

        // Dispose materials
        disposeBaliMaterials(sceneRef.current.materials)

        // Dispose renderer
        sceneRef.current.renderer.dispose()

        // Traverse and dispose geometries/materials
        sceneRef.current.scene.traverse((object) => {
          if (object instanceof THREE.Mesh) {
            object.geometry.dispose()
            if (Array.isArray(object.material)) {
              object.material.forEach((m) => m.dispose())
            } else {
              object.material.dispose()
            }
          }
        })
      }

      container.innerHTML = ''
    }
  }, [preview])

  return (
    <div
      ref={containerRef}
      className="w-full h-full cursor-crosshair"
      onClick={handlePointerLock}
    />
  )
}

export default BaliScene
