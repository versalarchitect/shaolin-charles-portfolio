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
 * Topology - Shifting Landscape
 *
 * Gentle contour lines that flow like a living map.
 * Evokes the feeling of watching terrain breathe.
 */
export function TopologyCanvas({ preview = false, mouseX = 0.5, mouseY = 0.5 }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)

  const sketchFactory: SketchFactory = useCallback((p: p5, getConfig) => {
    let time = 0

    const getSettings = () => {
      const config = getConfig()
      return {
        lines: config.preview ? 15 : 25,
        noiseScale: 0.004,
        timeSpeed: 0.008,
      }
    }

    p.setup = () => {
      const config = getConfig()
      const canvas = p.createCanvas(config.width, config.height)
      canvas.style('display', 'block')
      p.colorMode(p.RGB)
      p.noFill()

      if (config.preview) p.frameRate(30)
    }

    p.draw = () => {
      const config = getConfig()
      const settings = getSettings()

      p.background(RGB.bg[0], RGB.bg[1], RGB.bg[2])
      time += settings.timeSpeed

      const mouseWorldX = config.mouseX * config.width
      const mouseWorldY = config.mouseY * config.height

      // Draw flowing contour lines
      for (let i = 0; i < settings.lines; i++) {
        const yBase = (config.height / settings.lines) * i
        const alpha = 20 + (i / settings.lines) * 30

        p.stroke(255, 255, 255, alpha)
        p.strokeWeight(1)

        p.beginShape()
        for (let x = 0; x <= config.width; x += 10) {
          // Noise-based wave
          const noiseVal = p.noise(
            x * settings.noiseScale,
            i * 0.3,
            time
          )

          // Mouse creates a subtle hill
          const dx = x - mouseWorldX
          const dy = yBase - mouseWorldY
          const dist = Math.sqrt(dx * dx + dy * dy)
          const mouseInfluence = Math.exp(-dist * dist / 30000) * 30

          const y = yBase + (noiseVal - 0.5) * 60 - mouseInfluence

          p.vertex(x, y)
        }
        p.endShape()
      }
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

export default TopologyCanvas
