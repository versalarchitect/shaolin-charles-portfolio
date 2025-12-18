import type p5 from 'p5'
import { useRef, useCallback } from 'react'
import { useP5Sketch, type SketchFactory } from '../shared/use-p5-sketch'
import { RGB } from '../shared/palette'

interface Props {
  preview?: boolean
  mouseX?: number
  mouseY?: number
}

interface Particle {
  x: number
  y: number
  prevX: number
  prevY: number
  vx: number
  vy: number
  life: number
  maxLife: number
}

interface Vortex {
  x: number
  y: number
  strength: number
  radius: number
  rotation: number // 1 or -1
  decay: number
}

/**
 * Currents - Magnetic Vortex Field
 *
 * Particles flow through a dynamic magnetic field with mouse-controlled
 * vortices. Click creates swirling vortices that attract and spin particles.
 * Velocity creates luminosity - faster particles glow brighter.
 */
export function CurrentsCanvas({ preview = false, mouseX = 0.5, mouseY = 0.5 }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)

  const sketchFactory: SketchFactory = useCallback((p: p5, getConfig) => {
    let particles: Particle[] = []
    let vortices: Vortex[] = []
    let time = 0
    let lastMouseX = 0.5
    let lastMouseY = 0.5
    let mouseVelocity = 0

    const getSettings = () => {
      const config = getConfig()
      return {
        particleCount: config.preview ? 800 : 3000,
        maxVortices: config.preview ? 3 : 8,
        baseSpeed: config.preview ? 1.5 : 1,
        trailFade: config.preview ? 15 : 8,
      }
    }

    const createParticle = (): Particle => {
      const config = getConfig()
      return {
        x: p.random(config.width),
        y: p.random(config.height),
        prevX: 0,
        prevY: 0,
        vx: p.random(-0.5, 0.5),
        vy: p.random(-0.5, 0.5),
        life: 0,
        maxLife: p.random(200, 600),
      }
    }

    const spawnVortex = (x: number, y: number, strength: number) => {
      const settings = getSettings()
      vortices.push({
        x,
        y,
        strength: strength * (p.random() < 0.5 ? 1 : -1), // random rotation
        radius: p.random(100, 200),
        rotation: p.random() < 0.5 ? 1 : -1,
        decay: 0.995,
      })

      if (vortices.length > settings.maxVortices) {
        vortices.shift()
      }
    }

    p.setup = () => {
      const config = getConfig()
      const canvas = p.createCanvas(config.width, config.height)
      canvas.style('display', 'block')

      p.colorMode(p.RGB)
      p.background(RGB.bg[0], RGB.bg[1], RGB.bg[2])

      const settings = getSettings()
      for (let i = 0; i < settings.particleCount; i++) {
        const particle = createParticle()
        particle.prevX = particle.x
        particle.prevY = particle.y
        particles.push(particle)
      }

      // Initial vortices for visual interest
      spawnVortex(config.width * 0.3, config.height * 0.4, 3)
      spawnVortex(config.width * 0.7, config.height * 0.6, -2.5)

      if (config.preview) {
        p.frameRate(30)
      }
    }

    p.draw = () => {
      const config = getConfig()
      const settings = getSettings()

      // Fade trail
      p.noStroke()
      p.fill(RGB.bg[0], RGB.bg[1], RGB.bg[2], settings.trailFade)
      p.rect(0, 0, config.width, config.height)

      time += 0.01

      // Track mouse movement for interaction
      const mouseWorldX = config.mouseX * config.width
      const mouseWorldY = config.mouseY * config.height
      const mouseDx = config.mouseX - lastMouseX
      const mouseDy = config.mouseY - lastMouseY
      mouseVelocity = Math.sqrt(mouseDx * mouseDx + mouseDy * mouseDy)

      // Spawn vortex on significant mouse movement
      if (mouseVelocity > 0.015) {
        spawnVortex(mouseWorldX, mouseWorldY, mouseVelocity * 100)
      }

      lastMouseX = config.mouseX
      lastMouseY = config.mouseY

      // Update vortices
      for (let i = vortices.length - 1; i >= 0; i--) {
        vortices[i].strength *= vortices[i].decay
        if (Math.abs(vortices[i].strength) < 0.1) {
          vortices.splice(i, 1)
        }
      }

      // Ambient vortex spawning in preview
      if (config.preview && p.frameCount % 120 === 0) {
        spawnVortex(
          p.random(config.width * 0.2, config.width * 0.8),
          p.random(config.height * 0.2, config.height * 0.8),
          p.random(2, 4)
        )
      }

      // Update and draw particles
      for (const particle of particles) {
        particle.prevX = particle.x
        particle.prevY = particle.y

        // Base flow field
        const noiseScale = 0.002
        const noiseVal = p.noise(
          particle.x * noiseScale,
          particle.y * noiseScale,
          time * 0.5
        )
        const baseAngle = noiseVal * p.TWO_PI * 2

        let fx = Math.cos(baseAngle) * 0.1
        let fy = Math.sin(baseAngle) * 0.1

        // Vortex influence
        for (const vortex of vortices) {
          const dx = particle.x - vortex.x
          const dy = particle.y - vortex.y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < vortex.radius * 3 && dist > 1) {
            // Tangential force (creates spin)
            const tangentX = -dy / dist
            const tangentY = dx / dist
            const spinStrength = vortex.strength * Math.exp(-dist / vortex.radius) * 0.5
            fx += tangentX * spinStrength
            fy += tangentY * spinStrength

            // Inward pull
            const pullStrength = vortex.strength * 0.3 * Math.exp(-dist / (vortex.radius * 0.5))
            fx -= (dx / dist) * pullStrength * 0.1
            fy -= (dy / dist) * pullStrength * 0.1
          }
        }

        // Mouse repulsion (gentle)
        const mouseDx = particle.x - mouseWorldX
        const mouseDy = particle.y - mouseWorldY
        const mouseDist = Math.sqrt(mouseDx * mouseDx + mouseDy * mouseDy)
        if (mouseDist < 100 && mouseDist > 1) {
          const repel = (1 - mouseDist / 100) * 0.3
          fx += (mouseDx / mouseDist) * repel
          fy += (mouseDy / mouseDist) * repel
        }

        // Apply forces with momentum
        particle.vx = particle.vx * 0.95 + fx * settings.baseSpeed
        particle.vy = particle.vy * 0.95 + fy * settings.baseSpeed

        // Update position
        particle.x += particle.vx
        particle.y += particle.vy
        particle.life++

        // Calculate velocity for brightness
        const speed = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy)
        const speedGlow = Math.min(speed * 15, 1)

        // Life-based fade
        const lifeFade = particle.life < 30
          ? particle.life / 30
          : particle.life > particle.maxLife - 50
            ? (particle.maxLife - particle.life) / 50
            : 1

        // Draw with velocity-based glow
        const alpha = (0.15 + speedGlow * 0.6) * lifeFade
        const weight = 0.5 + speed * 2

        p.strokeWeight(Math.min(weight, 3))
        p.stroke(255, 255, 255, alpha * 255)
        p.line(particle.prevX, particle.prevY, particle.x, particle.y)

        // Bright core for fast particles
        if (speed > 0.8) {
          p.strokeWeight(1)
          p.stroke(255, 255, 255, alpha * 0.8 * 255)
          p.point(particle.x, particle.y)
        }

        // Reset if out of bounds or dead
        if (
          particle.x < -50 || particle.x > config.width + 50 ||
          particle.y < -50 || particle.y > config.height + 50 ||
          particle.life > particle.maxLife
        ) {
          particle.x = p.random(config.width)
          particle.y = p.random(config.height)
          particle.prevX = particle.x
          particle.prevY = particle.y
          particle.vx = p.random(-0.5, 0.5)
          particle.vy = p.random(-0.5, 0.5)
          particle.life = 0
          particle.maxLife = p.random(200, 600)
        }
      }

      // Draw vortex cores (subtle)
      p.noFill()
      for (const vortex of vortices) {
        const alpha = Math.abs(vortex.strength) * 5
        p.stroke(255, 255, 255, Math.min(alpha, 30))
        p.strokeWeight(1)

        // Spiral indicator
        for (let r = 10; r < vortex.radius * 0.5; r += 15) {
          const angle = time * 2 * (vortex.strength > 0 ? 1 : -1) + r * 0.05
          const x = vortex.x + Math.cos(angle) * r
          const y = vortex.y + Math.sin(angle) * r
          p.point(x, y)
        }
      }
    }

    p.windowResized = () => {
      const config = getConfig()
      p.resizeCanvas(config.width, config.height)
      p.background(RGB.bg[0], RGB.bg[1], RGB.bg[2])
    }
  }, [])

  useP5Sketch(sketchFactory, containerRef, { preview, mouseX, mouseY })

  return (
    <div
      ref={containerRef}
      className="w-full h-full"
      style={{ background: '#0a0a0a' }}
    />
  )
}

export default CurrentsCanvas
