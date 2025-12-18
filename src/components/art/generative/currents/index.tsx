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
  age: number
}

/**
 * Currents - Gentle Flow Field
 *
 * Minimal particles flowing through a calm noise field.
 * Mouse gently influences the flow direction.
 */
export function CurrentsCanvas({ preview = false, mouseX = 0.5, mouseY = 0.5 }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)

  const sketchFactory: SketchFactory = useCallback((p: p5, getConfig) => {
    let particles: Particle[] = []
    let time = 0

    const getSettings = () => {
      const config = getConfig()
      return {
        count: config.preview ? 80 : 200,
        noiseScale: 0.003,
        speed: 1.2,
        fadeAlpha: config.preview ? 20 : 12,
      }
    }

    p.setup = () => {
      const config = getConfig()
      const canvas = p.createCanvas(config.width, config.height)
      canvas.style('display', 'block')
      p.colorMode(p.RGB)
      p.background(RGB.bg[0], RGB.bg[1], RGB.bg[2])

      const settings = getSettings()
      for (let i = 0; i < settings.count; i++) {
        particles.push({
          x: p.random(config.width),
          y: p.random(config.height),
          age: p.random(100),
        })
      }

      if (config.preview) p.frameRate(30)
    }

    p.draw = () => {
      const config = getConfig()
      const settings = getSettings()

      // Gentle fade
      p.noStroke()
      p.fill(RGB.bg[0], RGB.bg[1], RGB.bg[2], settings.fadeAlpha)
      p.rect(0, 0, config.width, config.height)

      time += 0.003

      const mouseWorldX = config.mouseX * config.width
      const mouseWorldY = config.mouseY * config.height

      p.stroke(255, 255, 255, 40)
      p.strokeWeight(1)

      for (const particle of particles) {
        const prevX = particle.x
        const prevY = particle.y

        // Simple noise-based flow
        const angle = p.noise(
          particle.x * settings.noiseScale,
          particle.y * settings.noiseScale,
          time
        ) * p.TWO_PI * 2

        // Gentle mouse influence
        const dx = mouseWorldX - particle.x
        const dy = mouseWorldY - particle.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        const influence = Math.max(0, 1 - dist / 300) * 0.3

        const finalAngle = angle + Math.atan2(dy, dx) * influence

        particle.x += Math.cos(finalAngle) * settings.speed
        particle.y += Math.sin(finalAngle) * settings.speed
        particle.age++

        // Draw subtle line
        p.line(prevX, prevY, particle.x, particle.y)

        // Reset if out of bounds
        if (
          particle.x < 0 || particle.x > config.width ||
          particle.y < 0 || particle.y > config.height ||
          particle.age > 300
        ) {
          particle.x = p.random(config.width)
          particle.y = p.random(config.height)
          particle.age = 0
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
