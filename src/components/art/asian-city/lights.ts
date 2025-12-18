import * as THREE from 'three'

export interface SceneLights {
  ambient: THREE.AmbientLight
  moon: THREE.DirectionalLight
  fill: THREE.HemisphereLight
}

/**
 * Create optimized scene lighting
 * Uses minimal light count for performance:
 * - 1 ambient light (cheap)
 * - 1 directional light with shadows (main illumination)
 * - 1 hemisphere light (fill)
 *
 * Point lights are added by buildings/decorations where needed
 */
export function createSceneLights(enableShadows: boolean): SceneLights {
  // Ambient - provides base illumination
  const ambient = new THREE.AmbientLight(0x445577, 1.8)

  // Moon directional light - main shadow caster
  const moon = new THREE.DirectionalLight(0x99aadd, 2.2)
  moon.position.set(-30, 50, -30)

  if (enableShadows) {
    moon.castShadow = true
    moon.shadow.mapSize.width = 1024 // Reduced from 2048 for performance
    moon.shadow.mapSize.height = 1024
    moon.shadow.camera.near = 10
    moon.shadow.camera.far = 100
    moon.shadow.camera.left = -35
    moon.shadow.camera.right = 35
    moon.shadow.camera.top = 35
    moon.shadow.camera.bottom = -35
    moon.shadow.bias = -0.0005
    moon.shadow.normalBias = 0.02
  }

  // Hemisphere fill - sky/ground bounce light
  const fill = new THREE.HemisphereLight(0x445566, 0x222233, 0.7)

  return { ambient, moon, fill }
}

/**
 * Add lights to scene
 */
export function addLightsToScene(scene: THREE.Scene, lights: SceneLights): void {
  scene.add(lights.ambient)
  scene.add(lights.moon)
  scene.add(lights.fill)
}

/**
 * Dispose lights
 */
export function disposeLights(lights: SceneLights): void {
  if (lights.moon.shadow.map) {
    lights.moon.shadow.map.dispose()
  }
}
