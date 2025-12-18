import * as THREE from 'three'
import {
  createSkyShader,
  createMistShader,
  createFireflyShader,
} from './materials'

/**
 * Atmospheric Elements for Bali Scene
 *
 * Creates the magical atmosphere:
 * - Sunset sky dome
 * - Valley mist particles
 * - Fireflies at dusk
 * - Stars appearing
 */

/**
 * Create sunset sky dome
 */
export function createSkyDome(
  timeUniform: { value: number },
  radius: number = 200
): THREE.Mesh {
  const geometry = new THREE.SphereGeometry(radius, 32, 32)
  const material = createSkyShader(timeUniform)

  const sky = new THREE.Mesh(geometry, material)

  return sky
}

/**
 * Create valley mist particle system
 */
export function createMistSystem(
  timeUniform: { value: number },
  area: { width: number; depth: number; height: number },
  density: number = 0.5,
  position: THREE.Vector3 = new THREE.Vector3()
): THREE.Points {
  const particleCount = Math.floor(area.width * area.depth * density)

  const positions = new Float32Array(particleCount * 3)
  const scales = new Float32Array(particleCount)
  const randoms = new Float32Array(particleCount)

  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3

    // Random position within area
    positions[i3] = (Math.random() - 0.5) * area.width
    positions[i3 + 1] = Math.random() * area.height
    positions[i3 + 2] = (Math.random() - 0.5) * area.depth

    // Vary particle size
    scales[i] = 2 + Math.random() * 4

    // Random phase for animation
    randoms[i] = Math.random()
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('aScale', new THREE.BufferAttribute(scales, 1))
  geometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1))

  const material = createMistShader(timeUniform)

  const mist = new THREE.Points(geometry, material)
  mist.position.copy(position)

  return mist
}

/**
 * Create firefly particle system
 */
export function createFireflies(
  timeUniform: { value: number },
  count: number = 100,
  area: { width: number; depth: number; height: number },
  position: THREE.Vector3 = new THREE.Vector3()
): THREE.Points {
  const positions = new Float32Array(count * 3)
  const scales = new Float32Array(count)
  const phases = new Float32Array(count)

  for (let i = 0; i < count; i++) {
    const i3 = i * 3

    // Clustered around foliage areas
    positions[i3] = (Math.random() - 0.5) * area.width
    positions[i3 + 1] = 0.5 + Math.random() * area.height
    positions[i3 + 2] = (Math.random() - 0.5) * area.depth

    // Fireflies are small points
    scales[i] = 1 + Math.random() * 2

    // Random blinking phase
    phases[i] = Math.random()
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('aScale', new THREE.BufferAttribute(scales, 1))
  geometry.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1))

  const material = createFireflyShader(timeUniform)

  const fireflies = new THREE.Points(geometry, material)
  fireflies.position.copy(position)

  return fireflies
}

/**
 * Create stars for night sky
 */
export function createStars(count: number = 1000, radius: number = 180): THREE.Points {
  const positions = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)
  const sizes = new Float32Array(count)

  for (let i = 0; i < count; i++) {
    const i3 = i * 3

    // Distribute on upper hemisphere
    const theta = Math.random() * Math.PI * 2
    const phi = Math.random() * Math.PI * 0.5 // Upper hemisphere only

    const r = radius * (0.9 + Math.random() * 0.1)

    positions[i3] = r * Math.sin(phi) * Math.cos(theta)
    positions[i3 + 1] = r * Math.cos(phi) + radius * 0.2 // Offset up
    positions[i3 + 2] = r * Math.sin(phi) * Math.sin(theta)

    // Star color variation (white to slight blue/yellow)
    const colorVariation = Math.random()
    if (colorVariation < 0.7) {
      // White stars
      colors[i3] = 0.9 + Math.random() * 0.1
      colors[i3 + 1] = 0.9 + Math.random() * 0.1
      colors[i3 + 2] = 0.95 + Math.random() * 0.05
    } else if (colorVariation < 0.85) {
      // Blue-ish stars
      colors[i3] = 0.8
      colors[i3 + 1] = 0.85
      colors[i3 + 2] = 1.0
    } else {
      // Yellow-ish stars
      colors[i3] = 1.0
      colors[i3 + 1] = 0.95
      colors[i3 + 2] = 0.8
    }

    // Star sizes (most small, few large)
    sizes[i] = Math.random() < 0.95 ? 0.3 + Math.random() * 0.3 : 0.8 + Math.random() * 0.4
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))

  const material = new THREE.ShaderMaterial({
    uniforms: {
      uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
    },
    vertexShader: /* glsl */ `
      attribute float size;
      attribute vec3 color;
      varying vec3 vColor;

      uniform float uPixelRatio;

      void main() {
        vColor = color;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = size * uPixelRatio * (300.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: /* glsl */ `
      varying vec3 vColor;

      void main() {
        // Soft circular star
        float dist = length(gl_PointCoord - vec2(0.5));
        float alpha = smoothstep(0.5, 0.1, dist);

        // Twinkle effect (static for now, could be animated)
        gl_FragColor = vec4(vColor, alpha * 0.8);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })

  return new THREE.Points(geometry, material)
}

/**
 * Create sun for sunset scene
 */
export function createSun(
  position: THREE.Vector3 = new THREE.Vector3(0, 10, -100)
): THREE.Group {
  const sun = new THREE.Group()

  // Main sun disc
  const sunGeometry = new THREE.CircleGeometry(8, 32)
  const sunMaterial = new THREE.MeshBasicMaterial({
    color: 0xffeecc,
    transparent: true,
    opacity: 0.95,
  })
  const sunDisc = new THREE.Mesh(sunGeometry, sunMaterial)
  sun.add(sunDisc)

  // Glow layers
  for (let i = 1; i <= 4; i++) {
    const glowGeometry = new THREE.CircleGeometry(8 + i * 6, 32)
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: i < 2 ? 0xffeeaa : 0xffaa66,
      transparent: true,
      opacity: 0.15 / i,
    })
    const glow = new THREE.Mesh(glowGeometry, glowMaterial)
    glow.position.z = -0.1 * i
    sun.add(glow)
  }

  sun.position.copy(position)

  // Face the camera
  sun.lookAt(0, position.y, 0)

  return sun
}

/**
 * Create atmospheric lighting setup for Bali sunset
 */
export function createBaliLighting(scene: THREE.Scene): {
  sun: THREE.DirectionalLight
  ambient: THREE.AmbientLight
  hemisphere: THREE.HemisphereLight
  fill: THREE.DirectionalLight
} {
  // Main sun light (warm golden)
  const sunLight = new THREE.DirectionalLight(0xffaa55, 2.5)
  sunLight.position.set(-30, 25, -60)
  sunLight.castShadow = true
  sunLight.shadow.mapSize.width = 2048
  sunLight.shadow.mapSize.height = 2048
  sunLight.shadow.camera.near = 10
  sunLight.shadow.camera.far = 150
  sunLight.shadow.camera.left = -50
  sunLight.shadow.camera.right = 50
  sunLight.shadow.camera.top = 50
  sunLight.shadow.camera.bottom = -50
  sunLight.shadow.bias = -0.0001
  scene.add(sunLight)

  // Ambient light (warm but subtle)
  const ambientLight = new THREE.AmbientLight(0x665544, 0.4)
  scene.add(ambientLight)

  // Hemisphere light (sky to ground gradient)
  const hemisphereLight = new THREE.HemisphereLight(
    0xffaa77, // Sky color (sunset)
    0x445533, // Ground color (earth/foliage)
    0.6
  )
  scene.add(hemisphereLight)

  // Fill light from opposite side (cooler blue for shadow areas)
  const fillLight = new THREE.DirectionalLight(0x6688aa, 0.8)
  fillLight.position.set(40, 15, 30)
  scene.add(fillLight)

  return {
    sun: sunLight,
    ambient: ambientLight,
    hemisphere: hemisphereLight,
    fill: fillLight,
  }
}

/**
 * Complete atmosphere setup for Bali scene
 */
export function createBaliAtmosphere(
  scene: THREE.Scene,
  timeUniform: { value: number },
  options: {
    mistEnabled?: boolean
    firefliesEnabled?: boolean
    starsEnabled?: boolean
  } = {}
): {
  sky: THREE.Mesh
  mist?: THREE.Points
  fireflies?: THREE.Points
  stars?: THREE.Points
  sun: THREE.Group
  lighting: ReturnType<typeof createBaliLighting>
} {
  const {
    mistEnabled = true,
    firefliesEnabled = true,
    starsEnabled = true,
  } = options

  // Sky dome
  const sky = createSkyDome(timeUniform, 250)
  scene.add(sky)

  // Sun
  const sun = createSun(new THREE.Vector3(-80, 25, -150))
  scene.add(sun)

  // Stars (visible at edges of sky)
  let stars: THREE.Points | undefined
  if (starsEnabled) {
    stars = createStars(800, 200)
    scene.add(stars)
  }

  // Valley mist - very sparse, only in valleys
  let mist: THREE.Points | undefined
  if (mistEnabled) {
    mist = createMistSystem(
      timeUniform,
      { width: 60, depth: 60, height: 3 },
      0.02, // Very low density - just a hint of mist
      new THREE.Vector3(0, 1, -30) // Positioned in the valley near volcano
    )
    scene.add(mist)
  }

  // Fireflies - reduced count
  let fireflies: THREE.Points | undefined
  if (firefliesEnabled) {
    fireflies = createFireflies(
      timeUniform,
      40, // Reduced from 150
      { width: 30, depth: 30, height: 6 },
      new THREE.Vector3(0, 0, 5)
    )
    scene.add(fireflies)
  }

  // Lighting
  const lighting = createBaliLighting(scene)

  return {
    sky,
    mist,
    fireflies,
    stars,
    sun,
    lighting,
  }
}
