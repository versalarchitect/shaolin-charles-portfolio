import type p5 from 'p5'
import { useRef, useCallback } from 'react'
import { useP5Sketch, type SketchFactory } from '../shared/use-p5-sketch'
import { RGB } from '../shared/palette'

interface Props {
  preview?: boolean
  mouseX?: number
  mouseY?: number
}

interface Boid {
  x: number
  y: number
  vx: number
  vy: number
  history: { x: number; y: number }[]
}

/**
 * Emergence - Flocking Behavior Visualization
 *
 * Implements Craig Reynolds' Boids algorithm to simulate
 * emergent flocking behavior. Individual agents following
 * simple rules create complex, organic group dynamics.
 */
export function EmergenceCanvas({ preview = false, mouseX = 0.5, mouseY = 0.5 }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)

  const sketchFactory: SketchFactory = useCallback((p: p5, getConfig) => {
    let boids: Boid[] = []
    let time = 0

    const getSettings = () => {
      const config = getConfig()
      return {
        boidCount: config.preview ? 80 : 200,
        maxSpeed: config.preview ? 3 : 2.5,
        maxForce: 0.05,
        perceptionRadius: config.preview ? 50 : 60,
        separationWeight: 1.5,
        alignmentWeight: 1.0,
        cohesionWeight: 1.0,
        trailLength: config.preview ? 8 : 15,
        mouseInfluence: config.preview ? 100 : 150,
      }
    }

    const createBoid = (): Boid => {
      const config = getConfig()
      const angle = p.random(p.TWO_PI)
      const speed = p.random(1, 2)
      return {
        x: p.random(config.width),
        y: p.random(config.height),
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        history: [],
      }
    }

    const initializeBoids = () => {
      const settings = getSettings()
      boids = []
      for (let i = 0; i < settings.boidCount; i++) {
        boids.push(createBoid())
      }
    }

    // Limit vector magnitude
    const limit = (vx: number, vy: number, max: number): { vx: number; vy: number } => {
      const mag = Math.sqrt(vx * vx + vy * vy)
      if (mag > max) {
        return { vx: (vx / mag) * max, vy: (vy / mag) * max }
      }
      return { vx, vy }
    }

    // Set vector magnitude
    const setMag = (vx: number, vy: number, mag: number): { vx: number; vy: number } => {
      const currentMag = Math.sqrt(vx * vx + vy * vy)
      if (currentMag === 0) return { vx: 0, vy: 0 }
      return { vx: (vx / currentMag) * mag, vy: (vy / currentMag) * mag }
    }

    // Separation: steer to avoid crowding local flockmates
    const separate = (boid: Boid): { x: number; y: number } => {
      const settings = getSettings()
      let steerX = 0
      let steerY = 0
      let count = 0

      for (const other of boids) {
        const dx = boid.x - other.x
        const dy = boid.y - other.y
        const dist = Math.sqrt(dx * dx + dy * dy)

        if (dist > 0 && dist < settings.perceptionRadius * 0.5) {
          // Weight by distance (closer = stronger)
          const weight = 1 / (dist + 0.1)
          steerX += (dx / dist) * weight
          steerY += (dy / dist) * weight
          count++
        }
      }

      if (count > 0) {
        steerX /= count
        steerY /= count
        const mag = setMag(steerX, steerY, settings.maxSpeed)
        steerX = mag.vx - boid.vx
        steerY = mag.vy - boid.vy
        const limited = limit(steerX, steerY, settings.maxForce)
        return { x: limited.vx, y: limited.vy }
      }

      return { x: 0, y: 0 }
    }

    // Alignment: steer towards the average heading of local flockmates
    const align = (boid: Boid): { x: number; y: number } => {
      const settings = getSettings()
      let avgVx = 0
      let avgVy = 0
      let count = 0

      for (const other of boids) {
        const dx = boid.x - other.x
        const dy = boid.y - other.y
        const dist = Math.sqrt(dx * dx + dy * dy)

        if (dist > 0 && dist < settings.perceptionRadius) {
          avgVx += other.vx
          avgVy += other.vy
          count++
        }
      }

      if (count > 0) {
        avgVx /= count
        avgVy /= count
        const mag = setMag(avgVx, avgVy, settings.maxSpeed)
        let steerX = mag.vx - boid.vx
        let steerY = mag.vy - boid.vy
        const limited = limit(steerX, steerY, settings.maxForce)
        return { x: limited.vx, y: limited.vy }
      }

      return { x: 0, y: 0 }
    }

    // Cohesion: steer to move toward the average position of local flockmates
    const cohere = (boid: Boid): { x: number; y: number } => {
      const settings = getSettings()
      let avgX = 0
      let avgY = 0
      let count = 0

      for (const other of boids) {
        const dx = boid.x - other.x
        const dy = boid.y - other.y
        const dist = Math.sqrt(dx * dx + dy * dy)

        if (dist > 0 && dist < settings.perceptionRadius) {
          avgX += other.x
          avgY += other.y
          count++
        }
      }

      if (count > 0) {
        avgX /= count
        avgY /= count

        let steerX = avgX - boid.x
        let steerY = avgY - boid.y
        const mag = setMag(steerX, steerY, settings.maxSpeed)
        steerX = mag.vx - boid.vx
        steerY = mag.vy - boid.vy
        const limited = limit(steerX, steerY, settings.maxForce)
        return { x: limited.vx, y: limited.vy }
      }

      return { x: 0, y: 0 }
    }

    // Mouse influence: attract or repel based on distance
    const mouseForce = (boid: Boid, mouseX: number, mouseY: number): { x: number; y: number } => {
      const settings = getSettings()
      const dx = mouseX - boid.x
      const dy = mouseY - boid.y
      const dist = Math.sqrt(dx * dx + dy * dy)

      if (dist < settings.mouseInfluence && dist > 0) {
        // Gentle attraction towards mouse
        const strength = (1 - dist / settings.mouseInfluence) * 0.02
        return { x: dx * strength, y: dy * strength }
      }

      return { x: 0, y: 0 }
    }

    const updateBoid = (boid: Boid, mouseWorldX: number, mouseWorldY: number) => {
      const config = getConfig()
      const settings = getSettings()

      // Calculate flocking forces
      const sep = separate(boid)
      const ali = align(boid)
      const coh = cohere(boid)
      const mouse = mouseForce(boid, mouseWorldX, mouseWorldY)

      // Apply weighted forces
      boid.vx += sep.x * settings.separationWeight
      boid.vy += sep.y * settings.separationWeight
      boid.vx += ali.x * settings.alignmentWeight
      boid.vy += ali.y * settings.alignmentWeight
      boid.vx += coh.x * settings.cohesionWeight
      boid.vy += coh.y * settings.cohesionWeight
      boid.vx += mouse.x
      boid.vy += mouse.y

      // Add very subtle noise for organic movement
      boid.vx += (p.noise(boid.x * 0.01, time) - 0.5) * 0.02
      boid.vy += (p.noise(boid.y * 0.01, time + 100) - 0.5) * 0.02

      // Limit speed
      const limited = limit(boid.vx, boid.vy, settings.maxSpeed)
      boid.vx = limited.vx
      boid.vy = limited.vy

      // Store history for trail
      boid.history.push({ x: boid.x, y: boid.y })
      if (boid.history.length > settings.trailLength) {
        boid.history.shift()
      }

      // Update position
      boid.x += boid.vx
      boid.y += boid.vy

      // Wrap around edges with smooth transition
      const margin = 20
      if (boid.x < -margin) boid.x = config.width + margin
      if (boid.x > config.width + margin) boid.x = -margin
      if (boid.y < -margin) boid.y = config.height + margin
      if (boid.y > config.height + margin) boid.y = -margin
    }

    p.setup = () => {
      const config = getConfig()
      const canvas = p.createCanvas(config.width, config.height)
      canvas.style('display', 'block')

      p.colorMode(p.RGB)
      initializeBoids()

      if (config.preview) {
        p.frameRate(30)
      }
    }

    p.draw = () => {
      const config = getConfig()
      const settings = getSettings()

      p.background(RGB.bg[0], RGB.bg[1], RGB.bg[2])

      time += 0.01

      const mouseWorldX = config.mouseX * config.width
      const mouseWorldY = config.mouseY * config.height

      // Update all boids
      for (const boid of boids) {
        updateBoid(boid, mouseWorldX, mouseWorldY)
      }

      // Draw trails
      for (const boid of boids) {
        if (boid.history.length > 1) {
          p.noFill()

          for (let i = 1; i < boid.history.length; i++) {
            const prev = boid.history[i - 1]
            const curr = boid.history[i]

            // Skip if points are too far (wrapped around)
            const dx = curr.x - prev.x
            const dy = curr.y - prev.y
            if (Math.abs(dx) > 100 || Math.abs(dy) > 100) continue

            // Fade based on position in trail
            const alpha = (i / boid.history.length) * 0.3
            const weight = (i / boid.history.length) * 1.5

            p.strokeWeight(weight)
            p.stroke(255, 255, 255, alpha * 255)
            p.line(prev.x, prev.y, curr.x, curr.y)
          }
        }
      }

      // Draw boids
      p.noStroke()
      for (const boid of boids) {
        // Heading angle
        const heading = Math.atan2(boid.vy, boid.vx)
        const speed = Math.sqrt(boid.vx * boid.vx + boid.vy * boid.vy)

        // Size based on speed
        const size = 2 + speed * 0.5

        // Draw as elongated ellipse oriented to heading
        p.push()
        p.translate(boid.x, boid.y)
        p.rotate(heading)

        // Outer glow
        p.fill(255, 255, 255, 15)
        p.ellipse(0, 0, size * 3, size * 1.5)

        // Core
        p.fill(255, 255, 255, 80)
        p.ellipse(0, 0, size * 2, size)

        // Bright center
        p.fill(255, 255, 255, 180)
        p.ellipse(size * 0.3, 0, size * 0.8, size * 0.5)

        p.pop()
      }

      // Draw subtle mouse influence indicator
      if (config.mouseX > 0 && config.mouseX < 1 && config.mouseY > 0 && config.mouseY < 1) {
        p.noFill()
        p.stroke(255, 255, 255, 8)
        p.strokeWeight(1)
        p.circle(mouseWorldX, mouseWorldY, settings.mouseInfluence * 2)
      }
    }

    p.windowResized = () => {
      const config = getConfig()
      p.resizeCanvas(config.width, config.height)
      initializeBoids()
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

export default EmergenceCanvas
