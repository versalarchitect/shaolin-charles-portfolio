import type p5 from 'p5'
import { useRef, useCallback } from 'react'
import { useP5Sketch, type SketchFactory } from '../shared/use-p5-sketch'
import { RGB } from '../shared/palette'

interface Props {
  preview?: boolean
  mouseX?: number
  mouseY?: number
}

interface Point3D {
  x: number
  y: number
  z: number
}

interface Trail {
  points: Point3D[]
  hue: number
}

/**
 * Attractor - Strange Attractor Visualization
 *
 * Renders the Lorenz attractor and other chaotic systems.
 * Multiple trails trace through 3D phase space, projected
 * with subtle depth and rotation based on mouse position.
 */
export function AttractorCanvas({ preview = false, mouseX = 0.5, mouseY = 0.5 }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)

  const sketchFactory: SketchFactory = useCallback((p: p5, getConfig) => {
    let trails: Trail[] = []
    let time = 0
    let rotationX = 0
    let rotationZ = 0

    // Lorenz system parameters
    const sigma = 10
    const rho = 28
    const beta = 8 / 3
    const dt = 0.005

    const getSettings = () => {
      const config = getConfig()
      return {
        trailCount: config.preview ? 3 : 8,
        maxTrailLength: config.preview ? 300 : 800,
        stepsPerFrame: config.preview ? 3 : 5,
        scale: config.preview ? 6 : 8,
        fadeAlpha: config.preview ? 0.08 : 0.04,
      }
    }

    // Lorenz attractor differential equations
    const lorenz = (point: Point3D): Point3D => {
      return {
        x: sigma * (point.y - point.x),
        y: point.x * (rho - point.z) - point.y,
        z: point.x * point.y - beta * point.z,
      }
    }

    // Rössler attractor (alternative chaotic system)
    const rossler = (point: Point3D, a = 0.2, b = 0.2, c = 5.7): Point3D => {
      return {
        x: -point.y - point.z,
        y: point.x + a * point.y,
        z: b + point.z * (point.x - c),
      }
    }

    // Project 3D point to 2D with rotation
    const project = (point: Point3D, config: ReturnType<typeof getConfig>): { x: number; y: number; depth: number } => {
      const settings = getSettings()

      // Apply rotations based on mouse
      let x = point.x
      let y = point.y
      let z = point.z

      // Rotate around Z axis
      const cosZ = Math.cos(rotationZ)
      const sinZ = Math.sin(rotationZ)
      const tempX = x * cosZ - y * sinZ
      const tempY = x * sinZ + y * cosZ
      x = tempX
      y = tempY

      // Rotate around X axis
      const cosX = Math.cos(rotationX)
      const sinX = Math.sin(rotationX)
      const tempY2 = y * cosX - z * sinX
      const tempZ = y * sinX + z * cosX
      y = tempY2
      z = tempZ

      // Perspective projection
      const fov = 300
      const distance = fov / (fov + z * 0.5)

      return {
        x: config.width / 2 + x * settings.scale * distance,
        y: config.height / 2 + y * settings.scale * distance,
        depth: z,
      }
    }

    const initializeTrails = () => {
      const settings = getSettings()
      trails = []

      for (let i = 0; i < settings.trailCount; i++) {
        // Start each trail at slightly different positions
        const offset = i * 0.5
        trails.push({
          points: [{
            x: 0.1 + offset,
            y: 0.1 + offset * 0.3,
            z: 0.1 + offset * 0.7,
          }],
          hue: i * (360 / settings.trailCount), // for potential color variation
        })
      }
    }

    const updateTrails = () => {
      const settings = getSettings()

      for (const trail of trails) {
        // Take multiple integration steps per frame for smoother curves
        for (let step = 0; step < settings.stepsPerFrame; step++) {
          const current = trail.points[trail.points.length - 1]

          // 4th order Runge-Kutta integration for accuracy
          const k1 = lorenz(current)
          const k2 = lorenz({
            x: current.x + k1.x * dt * 0.5,
            y: current.y + k1.y * dt * 0.5,
            z: current.z + k1.z * dt * 0.5,
          })
          const k3 = lorenz({
            x: current.x + k2.x * dt * 0.5,
            y: current.y + k2.y * dt * 0.5,
            z: current.z + k2.z * dt * 0.5,
          })
          const k4 = lorenz({
            x: current.x + k3.x * dt,
            y: current.y + k3.y * dt,
            z: current.z + k3.z * dt,
          })

          trail.points.push({
            x: current.x + (k1.x + 2 * k2.x + 2 * k3.x + k4.x) * dt / 6,
            y: current.y + (k1.y + 2 * k2.y + 2 * k3.y + k4.y) * dt / 6,
            z: current.z + (k1.z + 2 * k2.z + 2 * k3.z + k4.z) * dt / 6,
          })

          // Trim old points
          if (trail.points.length > settings.maxTrailLength) {
            trail.points.shift()
          }
        }
      }
    }

    p.setup = () => {
      const config = getConfig()
      const canvas = p.createCanvas(config.width, config.height)
      canvas.style('display', 'block')

      p.colorMode(p.RGB)
      p.background(RGB.bg[0], RGB.bg[1], RGB.bg[2])

      initializeTrails()

      if (config.preview) {
        p.frameRate(30)
      }
    }

    p.draw = () => {
      const config = getConfig()
      const settings = getSettings()

      // Fade background for trail effect
      p.noStroke()
      p.fill(RGB.bg[0], RGB.bg[1], RGB.bg[2], settings.fadeAlpha * 255)
      p.rect(0, 0, config.width, config.height)

      time += 0.01

      // Smooth rotation based on mouse
      const targetRotationZ = (config.mouseX - 0.5) * p.PI * 0.8
      const targetRotationX = (config.mouseY - 0.5) * p.PI * 0.5 + p.PI * 0.1

      rotationZ = p.lerp(rotationZ, targetRotationZ, 0.05)
      rotationX = p.lerp(rotationX, targetRotationX, 0.05)

      // Update attractor trails
      updateTrails()

      // Draw each trail
      for (let t = 0; t < trails.length; t++) {
        const trail = trails[t]

        // Draw trail as connected line segments with depth-based styling
        for (let i = 1; i < trail.points.length; i++) {
          const p1 = project(trail.points[i - 1], config)
          const p2 = project(trail.points[i], config)

          // Age-based fade (older points fade out)
          const age = i / trail.points.length
          const ageFade = Math.pow(age, 0.5)

          // Depth-based intensity (closer = brighter)
          const avgDepth = (p1.depth + p2.depth) / 2
          const depthFade = p.map(avgDepth, -30, 50, 1.2, 0.4)

          // Combined alpha
          const alpha = ageFade * depthFade * 0.6

          // Depth-based line weight
          const weight = p.map(avgDepth, -30, 50, 2, 0.5)

          p.strokeWeight(Math.max(0.3, weight))
          p.stroke(255, 255, 255, alpha * 255)
          p.line(p1.x, p1.y, p2.x, p2.y)
        }

        // Draw bright point at trail head
        const head = trail.points[trail.points.length - 1]
        const headProj = project(head, config)

        // Glow effect
        p.noStroke()
        p.fill(255, 255, 255, 20)
        p.circle(headProj.x, headProj.y, 8)
        p.fill(255, 255, 255, 60)
        p.circle(headProj.x, headProj.y, 4)
        p.fill(255, 255, 255, 150)
        p.circle(headProj.x, headProj.y, 2)
      }

      // Draw subtle coordinate axes
      p.strokeWeight(0.5)
      const axisLength = 20
      const origin = project({ x: 0, y: 0, z: 0 }, config)

      // X axis
      const xEnd = project({ x: axisLength, y: 0, z: 0 }, config)
      p.stroke(255, 255, 255, 15)
      p.line(origin.x, origin.y, xEnd.x, xEnd.y)

      // Y axis
      const yEnd = project({ x: 0, y: axisLength, z: 0 }, config)
      p.stroke(255, 255, 255, 15)
      p.line(origin.x, origin.y, yEnd.x, yEnd.y)

      // Z axis
      const zEnd = project({ x: 0, y: 0, z: axisLength }, config)
      p.stroke(255, 255, 255, 15)
      p.line(origin.x, origin.y, zEnd.x, zEnd.y)
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

export default AttractorCanvas
