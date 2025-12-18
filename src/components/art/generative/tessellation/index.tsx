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
 * Tessellation - Breathing Hexagons
 *
 * A calm hexagonal grid that gently breathes and responds
 * to mouse proximity with subtle scaling.
 */
export function TessellationCanvas({ preview = false, mouseX = 0.5, mouseY = 0.5 }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)

  const sketchFactory: SketchFactory = useCallback((p: p5, getConfig) => {
    let time = 0

    const getSettings = () => {
      const config = getConfig()
      return {
        hexSize: config.preview ? 40 : 50,
        breathSpeed: 0.02,
        breathAmount: 0.1,
      }
    }

    const drawHexagon = (cx: number, cy: number, size: number, alpha: number) => {
      p.beginShape()
      for (let i = 0; i < 6; i++) {
        const angle = (p.TWO_PI / 6) * i - p.HALF_PI
        p.vertex(cx + Math.cos(angle) * size, cy + Math.sin(angle) * size)
      }
      p.endShape(p.CLOSE)
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
      time += settings.breathSpeed

      const mouseWorldX = config.mouseX * config.width
      const mouseWorldY = config.mouseY * config.height

      p.noFill()
      p.strokeWeight(1)

      const hexW = settings.hexSize * 1.5
      const hexH = settings.hexSize * Math.sqrt(3)

      for (let row = -1; row < config.height / hexH + 1; row++) {
        for (let col = -1; col < config.width / hexW + 1; col++) {
          const offset = row % 2 === 0 ? 0 : hexW / 2
          const cx = col * hexW + offset
          const cy = row * hexH

          // Distance from mouse
          const dx = cx - mouseWorldX
          const dy = cy - mouseWorldY
          const dist = Math.sqrt(dx * dx + dy * dy)

          // Breathing effect + mouse proximity
          const breath = Math.sin(time + dist * 0.01) * settings.breathAmount
          const mouseInfluence = Math.max(0, 1 - dist / 200) * 0.2
          const scale = 1 + breath + mouseInfluence

          // Alpha based on mouse proximity
          const alpha = 20 + mouseInfluence * 60

          p.stroke(255, 255, 255, alpha)
          drawHexagon(cx, cy, settings.hexSize * scale * 0.45, alpha)
        }
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

export default TessellationCanvas
