import * as THREE from 'three'

// Pre-allocated vectors to avoid GC during animation loop
const _forward = new THREE.Vector3()
const _right = new THREE.Vector3()
const _direction = new THREE.Vector3()

export interface ControlsState {
  keys: Record<string, boolean>
  isFlying: boolean
  velocityX: number
  velocityY: number
  velocityZ: number
  yaw: number
  pitch: number
  isPointerLocked: boolean
}

export interface ControlsConfig {
  moveSpeed: number
  flySpeed: number
  jumpForce: number
  gravity: number
  groundLevel: number
  friction: number
  bounds: { min: number; max: number }
  heightBounds: { min: number; max: number }
}

const DEFAULT_CONFIG: ControlsConfig = {
  moveSpeed: 0.18,
  flySpeed: 0.25,
  jumpForce: 0.35,
  gravity: 0.018,
  groundLevel: 2.0,
  friction: 0.85,
  bounds: { min: -35, max: 35 },
  heightBounds: { min: 1, max: 60 },
}

/**
 * Create controls state - single allocation
 */
export function createControlsState(): ControlsState {
  return {
    keys: {},
    isFlying: false,
    velocityX: 0,
    velocityY: 0,
    velocityZ: 0,
    yaw: Math.PI, // Start facing the city
    pitch: 0,
    isPointerLocked: false,
  }
}

/**
 * Setup event listeners - returns cleanup function
 */
export function setupControls(
  container: HTMLElement,
  state: ControlsState
): () => void {
  const onKeyDown = (e: KeyboardEvent) => {
    state.keys[e.code] = true
    if (e.code === 'KeyE') {
      state.isFlying = !state.isFlying
    }
  }

  const onKeyUp = (e: KeyboardEvent) => {
    state.keys[e.code] = false
  }

  const onMouseMove = (e: MouseEvent) => {
    if (!state.isPointerLocked) return
    state.yaw -= e.movementX * 0.002
    state.pitch -= e.movementY * 0.002
    // Clamp pitch
    if (state.pitch < -1.47) state.pitch = -1.47
    if (state.pitch > 1.47) state.pitch = 1.47
  }

  const onPointerLockChange = () => {
    state.isPointerLocked = document.pointerLockElement === container
  }

  window.addEventListener('keydown', onKeyDown)
  window.addEventListener('keyup', onKeyUp)
  document.addEventListener('mousemove', onMouseMove)
  document.addEventListener('pointerlockchange', onPointerLockChange)

  return () => {
    window.removeEventListener('keydown', onKeyDown)
    window.removeEventListener('keyup', onKeyUp)
    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('pointerlockchange', onPointerLockChange)
  }
}

/**
 * Update camera - zero allocations per frame
 */
export function updateControls(
  camera: THREE.PerspectiveCamera,
  state: ControlsState,
  config: ControlsConfig = DEFAULT_CONFIG
): void {
  const { keys, isFlying, yaw, pitch } = state
  const { moveSpeed, flySpeed, jumpForce, gravity, groundLevel, friction, bounds, heightBounds } = config

  // Calculate forward/right vectors using pre-allocated objects
  const sinYaw = Math.sin(yaw)
  const cosYaw = Math.cos(yaw)

  _forward.set(-sinYaw, 0, -cosYaw)
  _right.set(-Math.sin(yaw - Math.PI / 2), 0, -Math.cos(yaw - Math.PI / 2))

  // Reset direction
  _direction.set(0, 0, 0)

  // WASD input
  if (keys['KeyW']) _direction.add(_forward)
  if (keys['KeyS']) _direction.sub(_forward)
  if (keys['KeyA']) _direction.add(_right)
  if (keys['KeyD']) _direction.sub(_right)

  // Apply horizontal movement
  const dirLength = _direction.length()
  if (dirLength > 0.001) {
    const invLength = 1 / dirLength
    _direction.x *= invLength
    _direction.z *= invLength

    const speed = isFlying ? flySpeed : moveSpeed
    state.velocityX = _direction.x * speed
    state.velocityZ = _direction.z * speed
  } else {
    state.velocityX *= friction
    state.velocityZ *= friction
  }

  // Vertical movement
  if (isFlying) {
    if (keys['Space']) {
      state.velocityY = flySpeed
    } else if (keys['ShiftLeft']) {
      state.velocityY = -flySpeed
    } else {
      state.velocityY *= 0.9
    }
  } else {
    // Jump
    if (keys['Space'] && camera.position.y <= groundLevel + 0.1) {
      state.velocityY = jumpForce
    }
    state.velocityY -= gravity

    // Ground collision
    const nextY = camera.position.y + state.velocityY
    if (nextY < groundLevel) {
      camera.position.y = groundLevel
      state.velocityY = 0
    }
  }

  // Apply velocity
  camera.position.x += state.velocityX
  camera.position.y += state.velocityY
  camera.position.z += state.velocityZ

  // Clamp position
  if (camera.position.x < bounds.min) camera.position.x = bounds.min
  if (camera.position.x > bounds.max) camera.position.x = bounds.max
  if (camera.position.z < bounds.min) camera.position.z = bounds.min
  if (camera.position.z > bounds.max) camera.position.z = bounds.max

  if (isFlying) {
    if (camera.position.y < heightBounds.min) camera.position.y = heightBounds.min
    if (camera.position.y > heightBounds.max) camera.position.y = heightBounds.max
  }

  // Apply rotation
  camera.rotation.order = 'YXZ'
  camera.rotation.y = yaw
  camera.rotation.x = pitch
}

/**
 * Request pointer lock
 */
export function requestPointerLock(container: HTMLElement): void {
  container.requestPointerLock()
}
