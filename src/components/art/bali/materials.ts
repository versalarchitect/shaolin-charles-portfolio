import * as THREE from 'three'

/**
 * Bali Scene Material System
 *
 * Color palette inspired by the natural and cultural elements of Bali:
 * - Lush greens of rice terraces
 * - Volcanic stone grays and blacks
 * - Golden temple ornaments
 * - Warm sunset oranges and pinks
 * - Deep tropical ocean blues
 */

// Reusable shader chunks for optimization
const noiseChunk = /* glsl */ `
  // Simplex 2D noise
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                       -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m; m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
    vec3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }
`

export function createBaliMaterials() {
  return {
    // Rice paddy water - subtle reflective, NOT metallic
    paddyWater: new THREE.MeshStandardMaterial({
      color: 0x3a5a4a,
      roughness: 0.3,
      metalness: 0.1, // Low metalness - water is not metal!
      transparent: true,
      opacity: 0.75,
    }),

    // Rice plants - vibrant green
    riceGreen: new THREE.MeshStandardMaterial({
      color: 0x4a8a3a,
      roughness: 0.75,
      metalness: 0.0,
    }),

    // Young rice - lighter green
    riceYoung: new THREE.MeshStandardMaterial({
      color: 0x7ab85a,
      roughness: 0.8,
      metalness: 0.0,
    }),

    // Terrace earth walls - brown volcanic soil
    terraceEarth: new THREE.MeshStandardMaterial({
      color: 0x5a4535,
      roughness: 0.95,
      metalness: 0.0,
    }),

    // Volcanic stone - dark gray/black
    volcanicStone: new THREE.MeshStandardMaterial({
      color: 0x2a2a2a,
      roughness: 0.85,
      metalness: 0.05,
    }),

    // Weathered temple stone - gray with moss hints
    templeStone: new THREE.MeshStandardMaterial({
      color: 0x4a4a4a,
      roughness: 0.9,
      metalness: 0.02,
    }),

    // Moss-covered stone
    mossStone: new THREE.MeshStandardMaterial({
      color: 0x3a4a3a,
      roughness: 0.95,
      metalness: 0.0,
    }),

    // Gold temple ornaments
    templeGold: new THREE.MeshStandardMaterial({
      color: 0xd4a544,
      roughness: 0.25,
      metalness: 0.85,
      emissive: 0x332200,
      emissiveIntensity: 0.15,
    }),

    // Black & white checkered cloth (Poleng) - base white
    polengWhite: new THREE.MeshBasicMaterial({
      color: 0xeeeeee,
    }),

    // Black & white checkered cloth (Poleng) - base black
    polengBlack: new THREE.MeshBasicMaterial({
      color: 0x1a1a1a,
    }),

    // Palm tree trunk
    palmTrunk: new THREE.MeshStandardMaterial({
      color: 0x5a4a3a,
      roughness: 0.95,
      metalness: 0.0,
    }),

    // Palm fronds - deep green
    palmFronds: new THREE.MeshStandardMaterial({
      color: 0x2a5a2a,
      roughness: 0.7,
      metalness: 0.0,
      side: THREE.DoubleSide,
    }),

    // Frangipani flower - white/cream
    frangipaniWhite: new THREE.MeshBasicMaterial({
      color: 0xfffaf0,
      transparent: true,
      opacity: 0.95,
    }),

    // Frangipani center - yellow
    frangipaniYellow: new THREE.MeshBasicMaterial({
      color: 0xffd700,
    }),

    // Offering basket (Canang) - woven palm leaf
    canangBasket: new THREE.MeshStandardMaterial({
      color: 0x8a7a5a,
      roughness: 0.85,
      metalness: 0.0,
    }),

    // Marigold flowers for offerings
    marigoldOrange: new THREE.MeshBasicMaterial({
      color: 0xff8c00,
    }),

    // Incense stick
    incenseStick: new THREE.MeshStandardMaterial({
      color: 0x4a3a2a,
      roughness: 0.9,
    }),

    // Incense ember - glowing tip
    incenseEmber: new THREE.MeshBasicMaterial({
      color: 0xff4400,
      transparent: true,
      opacity: 0.9,
    }),

    // Bamboo - for Penjor poles
    bamboo: new THREE.MeshStandardMaterial({
      color: 0x9a8a5a,
      roughness: 0.7,
      metalness: 0.05,
    }),

    // Dried palm decoration on Penjor
    driedPalm: new THREE.MeshStandardMaterial({
      color: 0xc4a464,
      roughness: 0.85,
      metalness: 0.0,
      side: THREE.DoubleSide,
    }),

    // Ceremonial umbrella (Tedung) fabric
    tedungRed: new THREE.MeshStandardMaterial({
      color: 0xcc2222,
      roughness: 0.6,
      metalness: 0.0,
      side: THREE.DoubleSide,
    }),

    tedungGold: new THREE.MeshStandardMaterial({
      color: 0xd4a544,
      roughness: 0.4,
      metalness: 0.3,
      side: THREE.DoubleSide,
    }),

    // Thatched roof
    thatch: new THREE.MeshStandardMaterial({
      color: 0x7a6a4a,
      roughness: 0.95,
      metalness: 0.0,
    }),

    // Ocean water - deep turquoise, natural look
    oceanWater: new THREE.MeshStandardMaterial({
      color: 0x2a7a8a,
      roughness: 0.2,
      metalness: 0.15, // Water is not metallic
      transparent: true,
      opacity: 0.85,
    }),

    // Beach sand
    sand: new THREE.MeshStandardMaterial({
      color: 0xe4d4b4,
      roughness: 0.95,
      metalness: 0.0,
    }),
  }
}

export type BaliMaterials = ReturnType<typeof createBaliMaterials>

/**
 * Custom water shader for rice paddy reflections
 * Creates animated ripples and reflections
 */
export function createPaddyWaterShader(time: { value: number }) {
  return new THREE.ShaderMaterial({
    uniforms: {
      uTime: time,
      uColor: { value: new THREE.Color(0x2a4a3a) },
      uReflectionColor: { value: new THREE.Color(0x8ab87a) },
      uSkyColor: { value: new THREE.Color(0xffaa66) },
    },
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      varying vec3 vPosition;
      varying vec3 vNormal;
      uniform float uTime;

      ${noiseChunk}

      void main() {
        vUv = uv;
        vNormal = normalize(normalMatrix * normal);

        vec3 pos = position;

        // Gentle wave displacement
        float wave1 = snoise(uv * 8.0 + uTime * 0.2) * 0.02;
        float wave2 = snoise(uv * 12.0 - uTime * 0.15) * 0.015;
        pos.z += wave1 + wave2;

        vPosition = pos;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      uniform float uTime;
      uniform vec3 uColor;
      uniform vec3 uReflectionColor;
      uniform vec3 uSkyColor;

      varying vec2 vUv;
      varying vec3 vPosition;
      varying vec3 vNormal;

      ${noiseChunk}

      void main() {
        // Fresnel effect for reflections
        vec3 viewDir = normalize(cameraPosition - vPosition);
        float fresnel = pow(1.0 - max(dot(viewDir, vNormal), 0.0), 3.0);

        // Animated caustics pattern
        float caustics = snoise(vUv * 15.0 + uTime * 0.3) * 0.5 + 0.5;
        caustics *= snoise(vUv * 20.0 - uTime * 0.2) * 0.5 + 0.5;

        // Base water color with caustics
        vec3 waterColor = mix(uColor, uReflectionColor, caustics * 0.3);

        // Sky reflection based on fresnel
        vec3 finalColor = mix(waterColor, uSkyColor, fresnel * 0.4);

        // Add shimmer
        float shimmer = snoise(vUv * 30.0 + uTime) * 0.1;
        finalColor += vec3(shimmer) * fresnel;

        gl_FragColor = vec4(finalColor, 0.88);
      }
    `,
    transparent: true,
    side: THREE.DoubleSide,
  })
}

/**
 * Sunset sky gradient shader
 */
export function createSkyShader(time: { value: number }) {
  return new THREE.ShaderMaterial({
    uniforms: {
      uTime: time,
      uTopColor: { value: new THREE.Color(0x1a0a2a) },      // Deep purple
      uMiddleColor: { value: new THREE.Color(0xcc5544) },   // Sunset orange
      uHorizonColor: { value: new THREE.Color(0xffcc77) },  // Golden horizon
      uSunColor: { value: new THREE.Color(0xffeecc) },      // Sun glow
      uSunPosition: { value: new THREE.Vector2(0.5, 0.15) },
    },
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      uniform float uTime;
      uniform vec3 uTopColor;
      uniform vec3 uMiddleColor;
      uniform vec3 uHorizonColor;
      uniform vec3 uSunColor;
      uniform vec2 uSunPosition;

      varying vec2 vUv;

      ${noiseChunk}

      void main() {
        // Vertical gradient
        float t = vUv.y;
        vec3 skyColor;

        if (t < 0.3) {
          skyColor = mix(uHorizonColor, uMiddleColor, t / 0.3);
        } else {
          skyColor = mix(uMiddleColor, uTopColor, (t - 0.3) / 0.7);
        }

        // Sun glow
        float sunDist = distance(vUv, uSunPosition);
        float sunGlow = smoothstep(0.3, 0.0, sunDist);
        skyColor = mix(skyColor, uSunColor, sunGlow * 0.8);

        // Soft sun core
        float sunCore = smoothstep(0.08, 0.02, sunDist);
        skyColor = mix(skyColor, uSunColor, sunCore);

        // Animated clouds
        float cloud1 = snoise(vec2(vUv.x * 3.0 + uTime * 0.02, vUv.y * 2.0)) * 0.5 + 0.5;
        float cloud2 = snoise(vec2(vUv.x * 5.0 - uTime * 0.015, vUv.y * 3.0 + 0.5)) * 0.5 + 0.5;
        float clouds = cloud1 * cloud2;
        clouds = smoothstep(0.4, 0.6, clouds) * (1.0 - t) * 0.3;

        vec3 cloudColor = mix(uMiddleColor, uSunColor, 0.5);
        skyColor = mix(skyColor, cloudColor, clouds);

        gl_FragColor = vec4(skyColor, 1.0);
      }
    `,
    side: THREE.BackSide,
  })
}

/**
 * Mist/fog particle shader for atmosphere
 */
export function createMistShader(time: { value: number }) {
  return new THREE.ShaderMaterial({
    uniforms: {
      uTime: time,
      uColor: { value: new THREE.Color(0xaabbcc) }, // Subtle blue-gray
      uOpacity: { value: 0.08 }, // Much more subtle
    },
    vertexShader: /* glsl */ `
      attribute float aScale;
      attribute float aRandom;

      varying float vRandom;

      uniform float uTime;

      void main() {
        vRandom = aRandom;

        vec3 pos = position;

        // Gentle drifting motion
        pos.x += sin(uTime * 0.1 + aRandom * 6.28) * 2.0;
        pos.z += cos(uTime * 0.08 + aRandom * 6.28) * 2.0;
        pos.y += sin(uTime * 0.15 + aRandom * 3.14) * 0.5;

        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_PointSize = aScale * (300.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 uColor;
      uniform float uOpacity;

      varying float vRandom;

      void main() {
        // Soft circular particle
        float dist = length(gl_PointCoord - vec2(0.5));
        float alpha = smoothstep(0.5, 0.2, dist) * uOpacity;

        // Slight color variation
        vec3 color = uColor * (0.9 + vRandom * 0.2);

        gl_FragColor = vec4(color, alpha);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })
}

/**
 * Firefly particle shader
 */
export function createFireflyShader(time: { value: number }) {
  return new THREE.ShaderMaterial({
    uniforms: {
      uTime: time,
      uColor: { value: new THREE.Color(0xffee88) },
    },
    vertexShader: /* glsl */ `
      attribute float aScale;
      attribute float aPhase;

      varying float vPhase;

      uniform float uTime;

      void main() {
        vPhase = aPhase;

        vec3 pos = position;

        // Erratic firefly movement
        float t = uTime * 0.5 + aPhase * 6.28;
        pos.x += sin(t * 1.3) * cos(t * 0.7) * 1.5;
        pos.y += sin(t * 0.9) * 0.8;
        pos.z += cos(t * 1.1) * sin(t * 0.8) * 1.5;

        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_PointSize = aScale * (150.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform float uTime;
      uniform vec3 uColor;

      varying float vPhase;

      void main() {
        // Pulsing glow
        float pulse = sin(uTime * 3.0 + vPhase * 6.28) * 0.5 + 0.5;
        pulse = pow(pulse, 2.0);

        // Soft circular glow
        float dist = length(gl_PointCoord - vec2(0.5));
        float alpha = smoothstep(0.5, 0.0, dist) * pulse;

        // Warm glow color
        vec3 color = uColor;

        gl_FragColor = vec4(color, alpha);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })
}

/**
 * Incense smoke particle shader
 */
export function createIncenseShader(time: { value: number }) {
  return new THREE.ShaderMaterial({
    uniforms: {
      uTime: time,
      uColor: { value: new THREE.Color(0xcccccc) },
    },
    vertexShader: /* glsl */ `
      attribute float aScale;
      attribute float aLife;

      varying float vLife;

      uniform float uTime;

      void main() {
        vLife = aLife;

        vec3 pos = position;

        // Rising spiral motion
        float age = mod(uTime * 0.5 + aLife, 1.0);
        pos.y += age * 4.0;
        pos.x += sin(age * 6.28 + aLife * 3.14) * age * 0.8;
        pos.z += cos(age * 6.28 + aLife * 3.14) * age * 0.8;

        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        float scale = aScale * (1.0 + age * 2.0); // Expand as it rises
        gl_PointSize = scale * (100.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform float uTime;
      uniform vec3 uColor;

      varying float vLife;

      void main() {
        float age = mod(uTime * 0.5 + vLife, 1.0);

        // Fade out as it rises
        float alpha = (1.0 - age) * 0.4;

        // Soft circular particle
        float dist = length(gl_PointCoord - vec2(0.5));
        alpha *= smoothstep(0.5, 0.2, dist);

        gl_FragColor = vec4(uColor, alpha);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.NormalBlending,
  })
}

// Dispose all materials properly
export function disposeBaliMaterials(materials: BaliMaterials) {
  Object.values(materials).forEach((material) => {
    if (material instanceof THREE.Material) {
      material.dispose()
    }
  })
}
