import type p5 from 'p5'
import { useRef, useCallback } from 'react'
import { useP5Sketch, type SketchFactory } from '../shared/use-p5-sketch'
import { RGB } from '../shared/palette'

interface Props {
  preview?: boolean
  mouseX?: number
  mouseY?: number
}

interface Ripple {
  x: number
  y: number
  radius: number
  alpha: number
}

/**
 * Resonance - Calm Ripples
 *
 * Gentle circular ripples emanate from the mouse position,
 * creating peaceful interference patterns.
 */
export function ResonanceCanvas({ preview = false, mouseX = 0.5, mouseY = 0.5 }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)

  const sketchFactory: SketchFactory = useCallback((p: p5, getConfig) => {
    let ripples: Ripple[] = []
    let lastX = 0.5
    let lastY = 0.5
    let frameCount = 0

    const getSettings = () => {
      const config = getConfig()
      return {
        maxRipples: config.preview ? 5 : 8,
        rippleSpeed: 2,
        fadeRate: 0.985,
      }
    }

    p.setup = () => {
      const config = getConfig()
      const canvas = p.createCanvas(config.width, config.height)
      canvas.style('display', 'block')
      p.colorMode(p.RGB)

      if (config.preview) p.frameRate(30)
    }

    p.draw = () => {
      const config = getConfig()
      const settings = getSettings()

      p.background(RGB.bg[0], RGB.bg[1], RGB.bg[2])
      frameCount++

      const mouseWorldX = config.mouseX * config.width
      const mouseWorldY = config.mouseY * config.height

      // Create ripple on mouse movement
      const dx = config.mouseX - lastX
      const dy = config.mouseY - lastY
      const moved = Math.sqrt(dx * dx + dy * dy)

      if (moved > 0.02 || (config.preview && frameCount % 40 === 0)) {
        ripples.push({
          x: config.preview ? p.random(config.width) : mouseWorldX,
          y: config.preview ? p.random(config.height) : mouseWorldY,
          radius: 0,
          alpha: 1,
        })

        if (ripples.length > settings.maxRipples) {
          ripples.shift()
        }

        lastX = config.mouseX
        lastY = config.mouseY
      }

      // Update and draw ripples
      p.noFill()
      p.strokeWeight(1)

      for (let i = ripples.length - 1; i >= 0; i--) {
        const ripple = ripples[i]

        ripple.radius += settings.rippleSpeed
        ripple.alpha *= settings.fadeRate

        // Draw concentric circles
        for (let r = 0; r < 3; r++) {
          const radius = ripple.radius - r * 20
          if (radius > 0) {
            const alpha = ripple.alpha * (1 - r * 0.3) * 60
            p.stroke(255, 255, 255, alpha)
            p.circle(ripple.x, ripple.y, radius * 2)
          }
        }

        // Remove faded ripples
        if (ripple.alpha < 0.01) {
          ripples.splice(i, 1)
        }
      }

      // Subtle cursor indicator
      p.stroke(255, 255, 255, 20)
      p.circle(mouseWorldX, mouseWorldY, 30)
    }

    p.windowResized = () => {
      const config = getConfig()
      p.resizeCanvas(config.width, config.height)
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

export default ResonanceCanvas
