import type p5 from 'p5'
import { useRef, useCallback } from 'react'
import { useP5Sketch, type SketchFactory } from '../shared/use-p5-sketch'
import { RGB } from '../shared/palette'

interface Props {
  preview?: boolean
  mouseX?: number
  mouseY?: number
}

interface Dot {
  x: number
  y: number
  vx: number
  vy: number
}

/**
 * Emergence - Gathering
 *
 * Simple dots that naturally drift together, creating
 * a feeling of community and connection.
 */
export function EmergenceCanvas({ preview = false, mouseX = 0.5, mouseY = 0.5 }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)

  const sketchFactory: SketchFactory = useCallback((p: p5, getConfig) => {
    let dots: Dot[] = []
    let time = 0

    const getSettings = () => {
      const config = getConfig()
      return {
        count: config.preview ? 40 : 80,
        speed: 0.5,
        cohesion: 0.002,
        separation: 15,
      }
    }

    p.setup = () => {
      const config = getConfig()
      const canvas = p.createCanvas(config.width, config.height)
      canvas.style('display', 'block')
      p.colorMode(p.RGB)

      const settings = getSettings()
      for (let i = 0; i < settings.count; i++) {
        dots.push({
          x: p.random(config.width),
          y: p.random(config.height),
          vx: p.random(-1, 1) * settings.speed,
          vy: p.random(-1, 1) * settings.speed,
        })
      }

      if (config.preview) p.frameRate(30)
    }

    p.draw = () => {
      const config = getConfig()
      const settings = getSettings()

      p.background(RGB.bg[0], RGB.bg[1], RGB.bg[2])
      time += 0.01

      const mouseWorldX = config.mouseX * config.width
      const mouseWorldY = config.mouseY * config.height

      // Find center of flock
      let centerX = 0
      let centerY = 0
      for (const dot of dots) {
        centerX += dot.x
        centerY += dot.y
      }
      centerX /= dots.length
      centerY /= dots.length

      // Update dots
      for (const dot of dots) {
        // Gentle pull towards center (cohesion)
        dot.vx += (centerX - dot.x) * settings.cohesion
        dot.vy += (centerY - dot.y) * settings.cohesion

        // Gentle pull towards mouse
        const dxMouse = mouseWorldX - dot.x
        const dyMouse = mouseWorldY - dot.y
        const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse)
        if (distMouse < 200) {
          dot.vx += dxMouse * 0.0003
          dot.vy += dyMouse * 0.0003
        }

        // Separation from nearby dots
        for (const other of dots) {
          if (other === dot) continue
          const dx = dot.x - other.x
          const dy = dot.y - other.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < settings.separation && dist > 0) {
            dot.vx += (dx / dist) * 0.02
            dot.vy += (dy / dist) * 0.02
          }
        }

        // Damping
        dot.vx *= 0.98
        dot.vy *= 0.98

        // Speed limit
        const speed = Math.sqrt(dot.vx * dot.vx + dot.vy * dot.vy)
        if (speed > settings.speed) {
          dot.vx = (dot.vx / speed) * settings.speed
          dot.vy = (dot.vy / speed) * settings.speed
        }

        // Move
        dot.x += dot.vx
        dot.y += dot.vy

        // Soft boundary
        const margin = 50
        if (dot.x < margin) dot.vx += 0.05
        if (dot.x > config.width - margin) dot.vx -= 0.05
        if (dot.y < margin) dot.vy += 0.05
        if (dot.y > config.height - margin) dot.vy -= 0.05
      }

      // Draw connections between nearby dots
      p.stroke(255, 255, 255, 15)
      p.strokeWeight(1)
      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const dx = dots[i].x - dots[j].x
          const dy = dots[i].y - dots[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 60) {
            const alpha = (1 - dist / 60) * 25
            p.stroke(255, 255, 255, alpha)
            p.line(dots[i].x, dots[i].y, dots[j].x, dots[j].y)
          }
        }
      }

      // Draw dots
      p.noStroke()
      for (const dot of dots) {
        p.fill(255, 255, 255, 60)
        p.circle(dot.x, dot.y, 4)
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

export default EmergenceCanvas
