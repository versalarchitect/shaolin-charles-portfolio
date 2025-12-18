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
 * Topology - Morphing Contour Lines
 *
 * Procedurally generated topographic contour lines that evolve
 * over time. Creates the feeling of watching terrain shift and
 * mountains rise and fall in slow motion.
 */
export function TopologyCanvas({ preview = false, mouseX = 0.5, mouseY = 0.5 }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)

  const sketchFactory: SketchFactory = useCallback((p: p5, getConfig) => {
    let time = 0
    let heightMap: number[][] = []
    let gridCols = 0
    let gridRows = 0

    const getSettings = () => {
      const config = getConfig()
      return {
        resolution: config.preview ? 8 : 5, // pixels per grid cell
        contourLevels: config.preview ? 12 : 20,
        noiseScale: 0.008,
        timeSpeed: config.preview ? 0.008 : 0.004,
        lineAlpha: config.preview ? 0.25 : 0.18,
        majorLineInterval: 4, // every Nth line is thicker
      }
    }

    const initializeGrid = () => {
      const config = getConfig()
      const settings = getSettings()

      gridCols = Math.ceil(config.width / settings.resolution) + 1
      gridRows = Math.ceil(config.height / settings.resolution) + 1

      heightMap = []
      for (let i = 0; i < gridRows; i++) {
        heightMap.push(new Array(gridCols).fill(0))
      }
    }

    const updateHeightMap = () => {
      const config = getConfig()
      const settings = getSettings()

      // Mouse creates a "peak" in the terrain
      const mouseWorldX = config.mouseX * config.width
      const mouseWorldY = config.mouseY * config.height

      for (let i = 0; i < gridRows; i++) {
        for (let j = 0; j < gridCols; j++) {
          const x = j * settings.resolution
          const y = i * settings.resolution

          // Multi-octave noise for interesting terrain
          let height = 0
          height += p.noise(x * settings.noiseScale, y * settings.noiseScale, time) * 1.0
          height += p.noise(x * settings.noiseScale * 2, y * settings.noiseScale * 2, time * 1.3) * 0.5
          height += p.noise(x * settings.noiseScale * 4, y * settings.noiseScale * 4, time * 1.7) * 0.25

          // Mouse influence - creates a gentle hill
          const dx = x - mouseWorldX
          const dy = y - mouseWorldY
          const dist = Math.sqrt(dx * dx + dy * dy)
          const mouseInfluence = Math.exp(-dist * dist / 40000) * 0.4

          heightMap[i][j] = height + mouseInfluence
        }
      }
    }

    // Marching squares algorithm for contour extraction
    const getContourSegments = (level: number): { x1: number; y1: number; x2: number; y2: number }[] => {
      const settings = getSettings()
      const segments: { x1: number; y1: number; x2: number; y2: number }[] = []

      for (let i = 0; i < gridRows - 1; i++) {
        for (let j = 0; j < gridCols - 1; j++) {
          const x = j * settings.resolution
          const y = i * settings.resolution
          const cellSize = settings.resolution

          // Corner values
          const tl = heightMap[i][j]
          const tr = heightMap[i][j + 1]
          const br = heightMap[i + 1][j + 1]
          const bl = heightMap[i + 1][j]

          // Determine cell configuration (4-bit index)
          let config = 0
          if (tl >= level) config |= 8
          if (tr >= level) config |= 4
          if (br >= level) config |= 2
          if (bl >= level) config |= 1

          // Skip empty or full cells
          if (config === 0 || config === 15) continue

          // Interpolation helper
          const interp = (v1: number, v2: number, level: number): number => {
            if (Math.abs(v2 - v1) < 0.0001) return 0.5
            return (level - v1) / (v2 - v1)
          }

          // Edge midpoints with interpolation
          const top = { x: x + interp(tl, tr, level) * cellSize, y: y }
          const right = { x: x + cellSize, y: y + interp(tr, br, level) * cellSize }
          const bottom = { x: x + interp(bl, br, level) * cellSize, y: y + cellSize }
          const left = { x: x, y: y + interp(tl, bl, level) * cellSize }

          // Marching squares lookup table
          switch (config) {
            case 1: case 14:
              segments.push({ x1: left.x, y1: left.y, x2: bottom.x, y2: bottom.y })
              break
            case 2: case 13:
              segments.push({ x1: bottom.x, y1: bottom.y, x2: right.x, y2: right.y })
              break
            case 3: case 12:
              segments.push({ x1: left.x, y1: left.y, x2: right.x, y2: right.y })
              break
            case 4: case 11:
              segments.push({ x1: top.x, y1: top.y, x2: right.x, y2: right.y })
              break
            case 5:
              // Saddle point - ambiguous case
              const center = (tl + tr + br + bl) / 4
              if (center >= level) {
                segments.push({ x1: left.x, y1: left.y, x2: top.x, y2: top.y })
                segments.push({ x1: bottom.x, y1: bottom.y, x2: right.x, y2: right.y })
              } else {
                segments.push({ x1: left.x, y1: left.y, x2: bottom.x, y2: bottom.y })
                segments.push({ x1: top.x, y1: top.y, x2: right.x, y2: right.y })
              }
              break
            case 6: case 9:
              segments.push({ x1: top.x, y1: top.y, x2: bottom.x, y2: bottom.y })
              break
            case 7: case 8:
              segments.push({ x1: left.x, y1: left.y, x2: top.x, y2: top.y })
              break
            case 10:
              // Saddle point - ambiguous case
              const center2 = (tl + tr + br + bl) / 4
              if (center2 >= level) {
                segments.push({ x1: top.x, y1: top.y, x2: right.x, y2: right.y })
                segments.push({ x1: left.x, y1: left.y, x2: bottom.x, y2: bottom.y })
              } else {
                segments.push({ x1: left.x, y1: left.y, x2: top.x, y2: top.y })
                segments.push({ x1: bottom.x, y1: bottom.y, x2: right.x, y2: right.y })
              }
              break
          }
        }
      }

      return segments
    }

    p.setup = () => {
      const config = getConfig()
      const canvas = p.createCanvas(config.width, config.height)
      canvas.style('display', 'block')

      p.colorMode(p.RGB)
      initializeGrid()

      if (config.preview) {
        p.frameRate(30)
      }
    }

    p.draw = () => {
      const config = getConfig()
      const settings = getSettings()

      p.background(RGB.bg[0], RGB.bg[1], RGB.bg[2])

      time += settings.timeSpeed
      updateHeightMap()

      // Find min/max for normalization
      let minHeight = Infinity
      let maxHeight = -Infinity
      for (let i = 0; i < gridRows; i++) {
        for (let j = 0; j < gridCols; j++) {
          minHeight = Math.min(minHeight, heightMap[i][j])
          maxHeight = Math.max(maxHeight, heightMap[i][j])
        }
      }

      // Draw contour lines at regular intervals
      for (let l = 0; l < settings.contourLevels; l++) {
        const level = p.map(l, 0, settings.contourLevels - 1, minHeight, maxHeight)
        const segments = getContourSegments(level)

        // Major lines (every Nth) are thicker and brighter
        const isMajor = l % settings.majorLineInterval === 0
        const alpha = settings.lineAlpha * (isMajor ? 1.5 : 0.8)
        const weight = isMajor ? 1.2 : 0.6

        // Elevation-based intensity (higher = brighter)
        const elevationFactor = l / settings.contourLevels
        const finalAlpha = alpha * (0.5 + elevationFactor * 0.5)

        p.strokeWeight(weight)
        p.stroke(255, 255, 255, finalAlpha * 255)

        for (const seg of segments) {
          p.line(seg.x1, seg.y1, seg.x2, seg.y2)
        }
      }

      // Draw peak indicators (local maxima)
      p.noStroke()
      for (let i = 2; i < gridRows - 2; i += 3) {
        for (let j = 2; j < gridCols - 2; j += 3) {
          const h = heightMap[i][j]
          const neighbors = [
            heightMap[i - 1][j], heightMap[i + 1][j],
            heightMap[i][j - 1], heightMap[i][j + 1],
          ]

          // Check if this is a local maximum
          if (neighbors.every(n => h > n)) {
            const x = j * settings.resolution
            const y = i * settings.resolution
            const elevation = (h - minHeight) / (maxHeight - minHeight)

            // Draw subtle peak marker
            p.fill(255, 255, 255, elevation * 30)
            p.circle(x, y, 3)
          }
        }
      }

      // Subtle border frame
      p.noFill()
      p.strokeWeight(1)
      p.stroke(255, 255, 255, 10)
      const margin = 20
      p.rect(margin, margin, config.width - margin * 2, config.height - margin * 2)
    }

    p.windowResized = () => {
      const config = getConfig()
      p.resizeCanvas(config.width, config.height)
      initializeGrid()
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
