import type p5 from 'p5'
import { useRef, useCallback } from 'react'
import { useP5Sketch, type SketchFactory } from '../shared/use-p5-sketch'
import { RGB } from '../shared/palette'

interface Props {
  preview?: boolean
  mouseX?: number
  mouseY?: number
}

interface StrokePoint {
  x: number
  y: number
  pressure: number
  angle: number
}

interface Stroke {
  points: StrokePoint[]
  alpha: number
  weight: number
  age: number
  ink: number // ink density for diffusion
}

interface InkParticle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  alpha: number
  life: number
}

/**
 * Gesture - Ink Diffusion Expressionist Art
 *
 * Generative brushstrokes with realistic ink physics.
 * Strokes diffuse and bleed like sumi-e ink on wet paper,
 * with particles that drift from stroke edges.
 */
export function GestureCanvas({ preview = false, mouseX = 0.5, mouseY = 0.5 }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)

  const sketchFactory: SketchFactory = useCallback((p: p5, getConfig) => {
    let strokes: Stroke[] = []
    let inkParticles: InkParticle[] = []
    let lastStrokeTime = 0
    let initialized = false
    let graphics: p5.Graphics | null = null

    const getSettings = () => {
      const config = getConfig()
      return {
        initialStrokes: config.preview ? 6 : 12,
        strokeInterval: config.preview ? 5000 : 4000,
        maxStrokes: config.preview ? 10 : 20,
        pointsPerStroke: config.preview ? [20, 40] : [30, 80],
        strokeAlphaRange: [0.15, 0.6],
        strokeWeightRange: [2, 12],
        inkDiffusion: config.preview ? 0.3 : 0.5,
        particleCount: config.preview ? 50 : 150,
      }
    }

    const generateStroke = (originX?: number, originY?: number): Stroke => {
      const config = getConfig()
      const settings = getSettings()

      // Strokes tend to start from edges or near mouse
      let startX: number
      let startY: number

      if (originX !== undefined && originY !== undefined) {
        startX = originX
        startY = originY
      } else {
        // Start from edges more often for dramatic effect
        const edge = p.random() < 0.6
        if (edge) {
          const side = Math.floor(p.random(4))
          switch (side) {
            case 0:
              startX = p.random(config.width)
              startY = -20
              break
            case 1:
              startX = config.width + 20
              startY = p.random(config.height)
              break
            case 2:
              startX = p.random(config.width)
              startY = config.height + 20
              break
            default:
              startX = -20
              startY = p.random(config.height)
          }
        } else {
          startX = p.random(config.width * 0.1, config.width * 0.9)
          startY = p.random(config.height * 0.1, config.height * 0.9)
        }
      }

      const points: StrokePoint[] = []
      let x = startX
      let y = startY

      // Initial direction with momentum
      let angle = p.random(p.TWO_PI)
      let velocity = p.random(15, 35)

      const numPoints = Math.floor(
        p.random(settings.pointsPerStroke[0], settings.pointsPerStroke[1])
      )

      // Generate calligraphic stroke with varying pressure
      for (let i = 0; i < numPoints; i++) {
        const t = i / numPoints

        // Noise-influenced direction changes
        const noiseVal = p.noise(x * 0.003, y * 0.003, p.frameCount * 0.005)
        angle += (noiseVal - 0.5) * 0.8

        // Velocity variation
        velocity *= p.random(0.95, 1.05)
        velocity = p.constrain(velocity, 8, 40)

        x += Math.cos(angle) * velocity * 0.3
        y += Math.sin(angle) * velocity * 0.3

        // Pressure curve: attack, sustain, release
        let pressure: number
        if (t < 0.15) {
          // Attack: quick pressure build
          pressure = p.map(t, 0, 0.15, 0.2, 1) * p.random(0.9, 1.1)
        } else if (t < 0.7) {
          // Sustain: varied pressure with breathing
          pressure = (0.7 + Math.sin(t * 8) * 0.3) * p.random(0.85, 1.15)
        } else {
          // Release: gradual lift with occasional flicks
          const release = p.map(t, 0.7, 1, 1, 0)
          pressure = release * (p.random() < 0.1 ? p.random(0.5, 1.5) : 1)
        }

        points.push({ x, y, pressure: Math.max(0.1, pressure), angle })
      }

      return {
        points,
        alpha: p.random(settings.strokeAlphaRange[0], settings.strokeAlphaRange[1]),
        weight: p.random(settings.strokeWeightRange[0], settings.strokeWeightRange[1]),
        age: 0,
        ink: p.random(0.6, 1),
      }
    }

    const spawnInkParticles = (stroke: Stroke, count: number) => {
      const settings = getSettings()
      if (inkParticles.length > settings.particleCount * 2) return

      for (let i = 0; i < count; i++) {
        // Pick random point along stroke
        const pt = stroke.points[Math.floor(p.random(stroke.points.length))]

        // Particles drift perpendicular to stroke direction
        const perpAngle = pt.angle + p.HALF_PI + p.random(-0.5, 0.5)
        const speed = p.random(0.2, 1) * settings.inkDiffusion

        inkParticles.push({
          x: pt.x + p.random(-5, 5),
          y: pt.y + p.random(-5, 5),
          vx: Math.cos(perpAngle) * speed,
          vy: Math.sin(perpAngle) * speed + p.random(0, 0.3), // slight downward drift
          size: p.random(1, 4) * pt.pressure,
          alpha: stroke.alpha * p.random(0.3, 0.6),
          life: p.random(60, 180),
        })
      }
    }

    const drawStroke = (stroke: Stroke) => {
      if (!graphics || stroke.points.length < 4) return

      const pts = stroke.points

      // Draw main stroke body with varying width
      graphics.noFill()

      for (let i = 1; i < pts.length - 1; i++) {
        const p0 = pts[Math.max(0, i - 1)]
        const p1 = pts[i]
        const p2 = pts[Math.min(pts.length - 1, i + 1)]

        // Interpolated pressure for smooth width transitions
        const pressure = (p0.pressure + p1.pressure + p2.pressure) / 3
        const weight = stroke.weight * pressure

        // Ink density affects opacity
        const alpha = stroke.alpha * stroke.ink * 255

        graphics.strokeWeight(weight)
        graphics.stroke(255, 255, 255, alpha)

        // Draw segment
        graphics.line(p0.x, p0.y, p1.x, p1.y)

        // Add subtle edge texture for thick strokes
        if (weight > 5 && p.random() < 0.3) {
          const edgeOffset = weight * 0.4
          const perpAngle = p1.angle + p.HALF_PI

          graphics.strokeWeight(0.5)
          graphics.stroke(255, 255, 255, alpha * 0.2)

          const ex1 = p1.x + Math.cos(perpAngle) * edgeOffset
          const ey1 = p1.y + Math.sin(perpAngle) * edgeOffset
          const ex2 = p1.x - Math.cos(perpAngle) * edgeOffset
          const ey2 = p1.y - Math.sin(perpAngle) * edgeOffset

          graphics.point(ex1, ey1)
          graphics.point(ex2, ey2)
        }
      }

      // Draw stroke edges with dry brush effect
      graphics.strokeWeight(0.5)
      for (let i = 2; i < pts.length - 2; i += 3) {
        if (p.random() < 0.4) {
          const pt = pts[i]
          const edgeSize = stroke.weight * pt.pressure * 0.3

          graphics.stroke(255, 255, 255, stroke.alpha * 0.15 * 255)

          for (let j = 0; j < 3; j++) {
            const angle = pt.angle + p.HALF_PI + p.random(-0.3, 0.3)
            const dist = edgeSize * p.random(0.5, 1.5)
            const sign = j % 2 === 0 ? 1 : -1

            graphics.point(
              pt.x + Math.cos(angle) * dist * sign,
              pt.y + Math.sin(angle) * dist * sign
            )
          }
        }
      }
    }

    const updateAndDrawParticles = () => {
      if (!graphics) return

      graphics.noStroke()

      for (let i = inkParticles.length - 1; i >= 0; i--) {
        const particle = inkParticles[i]

        // Update physics
        particle.x += particle.vx
        particle.y += particle.vy
        particle.vx *= 0.98
        particle.vy *= 0.98
        particle.life--
        particle.size *= 0.995

        // Fade based on life
        const lifeFade = particle.life / 120
        const alpha = particle.alpha * lifeFade * 255

        // Draw with soft edges
        graphics.fill(255, 255, 255, alpha * 0.3)
        graphics.circle(particle.x, particle.y, particle.size * 1.5)
        graphics.fill(255, 255, 255, alpha)
        graphics.circle(particle.x, particle.y, particle.size * 0.7)

        // Remove dead particles
        if (particle.life <= 0 || particle.size < 0.3) {
          inkParticles.splice(i, 1)
        }
      }
    }

    p.setup = () => {
      const config = getConfig()
      const canvas = p.createCanvas(config.width, config.height)
      canvas.style('display', 'block')

      // Create persistent graphics buffer for accumulating strokes
      graphics = p.createGraphics(config.width, config.height)
      graphics.background(RGB.bg[0], RGB.bg[1], RGB.bg[2])
      graphics.colorMode(p.RGB)

      p.colorMode(p.RGB)

      if (config.preview) {
        p.frameRate(30)
      }
    }

    p.draw = () => {
      const config = getConfig()
      const settings = getSettings()
      const currentTime = p.millis()

      if (!graphics) return

      // Initialize strokes on first draw
      if (!initialized) {
        for (let i = 0; i < settings.initialStrokes; i++) {
          const stroke = generateStroke()
          strokes.push(stroke)
          drawStroke(stroke)
          spawnInkParticles(stroke, 10)
        }
        initialized = true
        lastStrokeTime = currentTime
      }

      // Update and draw ink particles on persistent buffer
      updateAndDrawParticles()

      // Periodically add new strokes
      if (currentTime - lastStrokeTime > settings.strokeInterval) {
        // Generate near mouse with randomness
        const originX = config.mouseX * config.width + p.random(-150, 150)
        const originY = config.mouseY * config.height + p.random(-150, 150)

        const newStroke = generateStroke(originX, originY)
        strokes.push(newStroke)
        drawStroke(newStroke)
        spawnInkParticles(newStroke, 20)

        // Fade old strokes slightly
        for (const stroke of strokes) {
          stroke.ink *= 0.98
        }

        // Remove oldest if too many
        if (strokes.length > settings.maxStrokes) {
          strokes.shift()
        }

        lastStrokeTime = currentTime
      }

      // Very subtle ongoing ink diffusion
      if (p.frameCount % 30 === 0 && strokes.length > 0) {
        const randomStroke = strokes[Math.floor(p.random(strokes.length))]
        spawnInkParticles(randomStroke, 3)
      }

      // Display the accumulated graphics
      p.image(graphics, 0, 0)

      // Subtle vignette
      p.noStroke()
      const gradient = p.drawingContext as CanvasRenderingContext2D
      const vignetteGradient = gradient.createRadialGradient(
        config.width / 2,
        config.height / 2,
        config.width * 0.3,
        config.width / 2,
        config.height / 2,
        config.width * 0.8
      )
      vignetteGradient.addColorStop(0, 'rgba(10, 10, 10, 0)')
      vignetteGradient.addColorStop(1, 'rgba(10, 10, 10, 0.3)')
      gradient.fillStyle = vignetteGradient
      gradient.fillRect(0, 0, config.width, config.height)
    }

    p.windowResized = () => {
      const config = getConfig()
      p.resizeCanvas(config.width, config.height)

      // Recreate graphics buffer
      if (graphics) graphics.remove()
      graphics = p.createGraphics(config.width, config.height)
      graphics.background(RGB.bg[0], RGB.bg[1], RGB.bg[2])
      graphics.colorMode(p.RGB)

      // Regenerate strokes
      strokes = []
      inkParticles = []
      initialized = false
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

export default GestureCanvas
