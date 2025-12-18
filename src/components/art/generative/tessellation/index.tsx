import type p5 from 'p5'
import { useRef, useCallback } from 'react'
import { useP5Sketch, type SketchFactory } from '../shared/use-p5-sketch'
import { RGB } from '../shared/palette'

interface Props {
  preview?: boolean
  mouseX?: number
  mouseY?: number
}

// Golden ratio for sacred geometry
const PHI = (1 + Math.sqrt(5)) / 2
const PHI_INV = 1 / PHI

/**
 * Tessellation - Sacred Geometry Art
 *
 * Recursive geometric patterns based on the golden ratio and
 * Islamic geometric principles. Nested polygons with breathing
 * animations and subtle rotational symmetry.
 */
export function TessellationCanvas({ preview = false, mouseX = 0.5, mouseY = 0.5 }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)

  const sketchFactory: SketchFactory = useCallback((p: p5, getConfig) => {
    let time = 0
    let centerX = 0
    let centerY = 0
    let baseRadius = 0

    const getSettings = () => {
      const config = getConfig()
      return {
        maxDepth: config.preview ? 4 : 7,
        rotationSpeed: config.preview ? 0.003 : 0.001,
        breathSpeed: config.preview ? 0.02 : 0.008,
        lineAlpha: config.preview ? 0.12 : 0.08,
      }
    }

    // Draw a polygon with optional inner connections
    const drawPolygon = (
      cx: number,
      cy: number,
      radius: number,
      sides: number,
      rotation: number,
      alpha: number,
      connectToCenter: boolean
    ) => {
      const vertices: { x: number; y: number }[] = []

      for (let i = 0; i < sides; i++) {
        const angle = rotation + (p.TWO_PI / sides) * i - p.HALF_PI
        vertices.push({
          x: cx + Math.cos(angle) * radius,
          y: cy + Math.sin(angle) * radius,
        })
      }

      // Draw outer polygon
      p.stroke(255, alpha * 255)
      p.beginShape()
      for (const v of vertices) {
        p.vertex(v.x, v.y)
      }
      p.endShape(p.CLOSE)

      // Connect to center with subtle lines
      if (connectToCenter) {
        p.stroke(255, alpha * 0.4 * 255)
        for (const v of vertices) {
          p.line(cx, cy, v.x, v.y)
        }
      }

      return vertices
    }

    // Draw a star polygon (connects every nth vertex)
    const drawStarPolygon = (
      cx: number,
      cy: number,
      radius: number,
      points: number,
      skip: number,
      rotation: number,
      alpha: number
    ) => {
      const vertices: { x: number; y: number }[] = []

      for (let i = 0; i < points; i++) {
        const angle = rotation + (p.TWO_PI / points) * i - p.HALF_PI
        vertices.push({
          x: cx + Math.cos(angle) * radius,
          y: cy + Math.sin(angle) * radius,
        })
      }

      p.stroke(255, alpha * 255)
      p.beginShape()
      let idx = 0
      for (let i = 0; i <= points; i++) {
        p.vertex(vertices[idx].x, vertices[idx].y)
        idx = (idx + skip) % points
      }
      p.endShape()
    }

    // Recursive sacred geometry pattern
    const drawSacredPattern = (
      cx: number,
      cy: number,
      radius: number,
      depth: number,
      rotation: number,
      config: ReturnType<typeof getConfig>
    ) => {
      const settings = getSettings()
      if (depth <= 0 || radius < 3) return

      const depthRatio = depth / settings.maxDepth
      const alpha = settings.lineAlpha * (0.3 + depthRatio * 0.7)

      // Breathing effect
      const breathe = 1 + Math.sin(time * settings.breathSpeed + depth * 0.5) * 0.03

      // Alternate between different sacred geometry forms
      const form = depth % 3

      if (form === 0) {
        // Hexagon with inner star
        drawPolygon(cx, cy, radius * breathe, 6, rotation, alpha, depth > 2)
        if (depth > 1) {
          drawStarPolygon(cx, cy, radius * 0.7 * breathe, 6, 2, rotation + p.PI / 6, alpha * 0.6)
        }
      } else if (form === 1) {
        // Dodecagon (12-sided)
        drawPolygon(cx, cy, radius * breathe, 12, rotation, alpha * 0.8, false)
        // Inner hexagram
        if (depth > 1) {
          drawStarPolygon(cx, cy, radius * 0.8 * breathe, 6, 2, rotation, alpha * 0.5)
        }
      } else {
        // Triangle with inner triangle (Star of David pattern)
        drawPolygon(cx, cy, radius * breathe, 3, rotation, alpha, false)
        drawPolygon(cx, cy, radius * breathe, 3, rotation + p.PI, alpha, false)
      }

      // Recursive subdivisions at golden ratio positions
      const innerRadius = radius * PHI_INV * 0.9
      const outerPoints = form === 0 ? 6 : form === 1 ? 6 : 3

      // Central recursion
      drawSacredPattern(
        cx,
        cy,
        innerRadius,
        depth - 1,
        rotation + 0.02 * (settings.maxDepth - depth),
        config
      )

      // Peripheral recursions (only for deeper levels)
      if (depth > 3) {
        const peripheralRadius = radius * 0.35
        const peripheralDist = radius * 0.55

        for (let i = 0; i < outerPoints; i++) {
          const angle = rotation + (p.TWO_PI / outerPoints) * i - p.HALF_PI
          const px = cx + Math.cos(angle) * peripheralDist
          const py = cy + Math.sin(angle) * peripheralDist

          drawSacredPattern(
            px,
            py,
            peripheralRadius,
            depth - 2,
            -rotation,
            config
          )
        }
      }
    }

    // Draw subtle radiating lines from center
    const drawRadials = (cx: number, cy: number, radius: number, count: number, alpha: number) => {
      p.stroke(255, alpha * 255)
      for (let i = 0; i < count; i++) {
        const angle = (p.TWO_PI / count) * i + time * 0.0005
        const x2 = cx + Math.cos(angle) * radius
        const y2 = cy + Math.sin(angle) * radius
        p.line(cx, cy, x2, y2)
      }
    }

    // Draw concentric circles at golden ratio intervals
    const drawGoldenCircles = (cx: number, cy: number, maxRadius: number, alpha: number) => {
      p.stroke(255, alpha * 255)
      p.noFill()

      let r = maxRadius
      while (r > 5) {
        p.circle(cx, cy, r * 2)
        r *= PHI_INV
      }
    }

    p.setup = () => {
      const config = getConfig()
      const canvas = p.createCanvas(config.width, config.height)
      canvas.style('display', 'block')

      p.colorMode(p.RGB)
      p.noFill()
      p.strokeWeight(0.8)

      centerX = config.width / 2
      centerY = config.height / 2
      baseRadius = Math.min(config.width, config.height) * 0.4

      if (config.preview) {
        p.frameRate(30)
      }
    }

    p.draw = () => {
      const config = getConfig()
      const settings = getSettings()

      p.background(RGB.bg[0], RGB.bg[1], RGB.bg[2])

      centerX = config.width / 2
      centerY = config.height / 2
      baseRadius = Math.min(config.width, config.height) * 0.4

      time++

      // Mouse influence on rotation and depth
      const mouseRotation = (config.mouseX - 0.5) * p.PI * 0.3
      const depthMultiplier = 0.7 + config.mouseY * 0.6

      // Background elements
      p.strokeWeight(0.5)
      drawGoldenCircles(centerX, centerY, baseRadius * 1.2, 0.02)
      drawRadials(centerX, centerY, baseRadius * 1.3, 36, 0.015)

      // Main sacred geometry
      p.strokeWeight(0.8)
      const effectiveDepth = Math.floor(settings.maxDepth * depthMultiplier)
      const rotation = time * settings.rotationSpeed + mouseRotation

      drawSacredPattern(centerX, centerY, baseRadius, effectiveDepth, rotation, config)

      // Outer boundary ring
      p.strokeWeight(1)
      p.stroke(255, 20)
      p.circle(centerX, centerY, baseRadius * 2.2)

      // Corner ornaments
      const cornerSize = baseRadius * 0.15
      const margin = cornerSize * 1.5
      const corners = [
        [margin, margin],
        [config.width - margin, margin],
        [config.width - margin, config.height - margin],
        [margin, config.height - margin],
      ]

      p.strokeWeight(0.6)
      for (let i = 0; i < corners.length; i++) {
        const [cx, cy] = corners[i]
        const cornerRotation = rotation + (p.HALF_PI * i)
        drawPolygon(cx, cy, cornerSize, 4, cornerRotation + p.PI / 4, 0.04, false)
        drawPolygon(cx, cy, cornerSize * PHI_INV, 4, -cornerRotation, 0.03, false)
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
