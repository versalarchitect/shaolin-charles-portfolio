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
 * Gesture - Light Trail
 *
 * A simple, elegant light trail that follows the mouse.
 * Movement leaves behind fading traces of light.
 */
export function GestureCanvas({ preview = false, mouseX = 0.5, mouseY = 0.5 }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)

  const sketchFactory: SketchFactory = useCallback((p: p5, getConfig) => {
    let graphics: p5.Graphics | null = null
    let lastX = 0
    let lastY = 0
    let time = 0

    // Auto-draw for preview
    let autoX = 0.5
    let autoY = 0.5
    let autoAngle = 0

    const getSettings = () => {
      const config = getConfig()
      return {
        fadeAlpha: config.preview ? 8 : 5,
        strokeAlpha: 80,
      }
    }

    p.setup = () => {
      const config = getConfig()
      const canvas = p.createCanvas(config.width, config.height)
      canvas.style('display', 'block')

      graphics = p.createGraphics(config.width, config.height)
      graphics.colorMode(p.RGB)
      graphics.background(RGB.bg[0], RGB.bg[1], RGB.bg[2])

      lastX = config.width / 2
      lastY = config.height / 2

      if (config.preview) p.frameRate(30)
    }

    p.draw = () => {
      const config = getConfig()
      const settings = getSettings()

      if (!graphics) return

      // Fade
      graphics.noStroke()
      graphics.fill(RGB.bg[0], RGB.bg[1], RGB.bg[2], settings.fadeAlpha)
      graphics.rect(0, 0, config.width, config.height)

      time += 0.02

      let currentX: number
      let currentY: number

      if (config.preview) {
        // Auto-draw smooth curves
        autoAngle += (p.noise(time * 0.3) - 0.5) * 0.1
        autoX += Math.cos(autoAngle) * 0.008
        autoY += Math.sin(autoAngle) * 0.008

        // Wrap around
        if (autoX < 0.1) autoX = 0.9
        if (autoX > 0.9) autoX = 0.1
        if (autoY < 0.1) autoY = 0.9
        if (autoY > 0.9) autoY = 0.1

        currentX = autoX * config.width
        currentY = autoY * config.height
      } else {
        currentX = config.mouseX * config.width
        currentY = config.mouseY * config.height
      }

      // Calculate velocity
      const dx = currentX - lastX
      const dy = currentY - lastY
      const speed = Math.sqrt(dx * dx + dy * dy)

      if (speed > 1) {
        // Draw line with speed-based alpha
        const alpha = Math.min(settings.strokeAlpha, 20 + speed * 2)
        graphics.stroke(255, 255, 255, alpha)
        graphics.strokeWeight(1 + speed * 0.05)
        graphics.line(lastX, lastY, currentX, currentY)
      }

      lastX = currentX
      lastY = currentY

      // Render
      p.image(graphics, 0, 0)

      // Subtle cursor glow
      p.noStroke()
      p.fill(255, 255, 255, 15)
      p.circle(currentX, currentY, 20)
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

export default GestureCanvas
