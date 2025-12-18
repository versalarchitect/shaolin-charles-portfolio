import type p5 from 'p5'
import { useRef, useCallback } from 'react'
import { useP5Sketch, type SketchFactory } from '../shared/use-p5-sketch'
import { RGB } from '../shared/palette'

interface Props {
  preview?: boolean
  mouseX?: number
  mouseY?: number
}

/**
 * Attractor - Orbital Harmony
 *
 * Elegant elliptical orbits that respond to mouse position.
 * Simple, meditative orbital motion.
 */
export function AttractorCanvas({ preview = false, mouseX = 0.5, mouseY = 0.5 }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)

  const sketchFactory: SketchFactory = useCallback((p: p5, getConfig) => {
    let time = 0
    let graphics: p5.Graphics | null = null

    const getSettings = () => {
      const config = getConfig()
      return {
        orbits: config.preview ? 3 : 5,
        fadeAlpha: config.preview ? 15 : 8,
      }
    }

    p.setup = () => {
      const config = getConfig()
      const canvas = p.createCanvas(config.width, config.height)
      canvas.style('display', 'block')

      graphics = p.createGraphics(config.width, config.height)
      graphics.colorMode(p.RGB)
      graphics.background(RGB.bg[0], RGB.bg[1], RGB.bg[2])

      p.colorMode(p.RGB)

      if (config.preview) p.frameRate(30)
    }

    p.draw = () => {
      const config = getConfig()
      const settings = getSettings()

      if (!graphics) return

      // Gentle fade
      graphics.noStroke()
      graphics.fill(RGB.bg[0], RGB.bg[1], RGB.bg[2], settings.fadeAlpha)
      graphics.rect(0, 0, config.width, config.height)

      time += 0.015

      const centerX = config.width / 2
      const centerY = config.height / 2

      // Mouse affects orbit center slightly
      const offsetX = (config.mouseX - 0.5) * 50
      const offsetY = (config.mouseY - 0.5) * 50

      graphics.noFill()
      graphics.strokeWeight(1)

      // Draw multiple orbits
      for (let i = 0; i < settings.orbits; i++) {
        const speed = 0.3 + i * 0.15
        const radiusX = 80 + i * 40
        const radiusY = 60 + i * 30
        const phase = i * (Math.PI / settings.orbits)

        const angle = time * speed + phase
        const x = centerX + offsetX + Math.cos(angle) * radiusX
        const y = centerY + offsetY + Math.sin(angle) * radiusY

        // Trail point
        const alpha = 40 + i * 10
        graphics.stroke(255, 255, 255, alpha)
        graphics.point(x, y)

        // Small glow
        graphics.stroke(255, 255, 255, alpha * 0.5)
        graphics.circle(x, y, 4)
      }

      // Render
      p.image(graphics, 0, 0)

      // Center indicator
      p.noFill()
      p.stroke(255, 255, 255, 15)
      p.circle(centerX + offsetX, centerY + offsetY, 10)
    }

    p.windowResized = () => {
      const config = getConfig()
      p.resizeCanvas(config.width, config.height)

      if (graphics) graphics.remove()
      graphics = p.createGraphics(config.width, config.height)
      graphics.colorMode(p.RGB)
      graphics.background(RGB.bg[0], RGB.bg[1], RGB.bg[2])
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
