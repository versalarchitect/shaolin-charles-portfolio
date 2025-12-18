import type p5 from 'p5'
import { useRef, useCallback } from 'react'
import { useP5Sketch, type SketchFactory } from '../shared/use-p5-sketch'
import { RGB } from '../shared/palette'

interface Props {
  preview?: boolean
  mouseX?: number
  mouseY?: number
}

interface Node {
  x: number
  y: number
  originX: number
  originY: number
  vx: number
  vy: number
  phase: number // for wave interference
}

interface WaveSource {
  x: number
  y: number
  age: number
  strength: number
}

/**
 * Resonance - Wave Interference Art
 *
 * A sophisticated physics simulation combining spring dynamics
 * with wave interference patterns. Multiple wave sources create
 * complex interference patterns across a node grid.
 */
export function ResonanceCanvas({ preview = false, mouseX = 0.5, mouseY = 0.5 }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)

  const sketchFactory: SketchFactory = useCallback((p: p5, getConfig) => {
    let grid: Node[][] = []
    let waveSources: WaveSource[] = []
    let time = 0
    let lastMouseX = 0.5
    let lastMouseY = 0.5

    const getSettings = () => {
      const config = getConfig()
      return {
        cols: config.preview ? 25 : 50,
        rows: config.preview ? 25 : 50,
        springStrength: 0.025,
        damping: 0.94,
        waveSpeed: config.preview ? 0.15 : 0.1,
        waveDecay: 0.985,
        connectionAlphaBase: config.preview ? 20 : 12,
        maxWaveSources: config.preview ? 3 : 6,
      }
    }

    const initializeGrid = () => {
      const config = getConfig()
      const settings = getSettings()
      grid = []

      const spacingX = config.width / (settings.cols + 1)
      const spacingY = config.height / (settings.rows + 1)

      for (let i = 0; i < settings.rows; i++) {
        const row: Node[] = []
        for (let j = 0; j < settings.cols; j++) {
          const x = spacingX * (j + 1)
          const y = spacingY * (i + 1)
          row.push({
            x,
            y,
            originX: x,
            originY: y,
            vx: 0,
            vy: 0,
            phase: 0,
          })
        }
        grid.push(row)
      }
    }

    const addWaveSource = (x: number, y: number, strength: number = 1) => {
      const settings = getSettings()
      waveSources.push({ x, y, age: 0, strength })

      // Remove oldest if too many
      if (waveSources.length > settings.maxWaveSources) {
        waveSources.shift()
      }
    }

    p.setup = () => {
      const config = getConfig()
      const canvas = p.createCanvas(config.width, config.height)
      canvas.style('display', 'block')

      p.colorMode(p.RGB)
      initializeGrid()

      // Add initial wave sources for visual interest
      addWaveSource(config.width * 0.3, config.height * 0.3, 0.5)
      addWaveSource(config.width * 0.7, config.height * 0.7, 0.5)

      if (config.preview) {
        p.frameRate(30)
      }
    }

    p.draw = () => {
      const config = getConfig()
      const settings = getSettings()

      p.background(RGB.bg[0], RGB.bg[1], RGB.bg[2])

      time += 0.016 // ~60fps time step

      // Mouse position in world coordinates
      const mouseWorldX = config.mouseX * config.width
      const mouseWorldY = config.mouseY * config.height

      // Detect significant mouse movement and create waves
      const mouseDelta = Math.sqrt(
        (config.mouseX - lastMouseX) ** 2 + (config.mouseY - lastMouseY) ** 2
      )
      if (mouseDelta > 0.02) {
        addWaveSource(mouseWorldX, mouseWorldY, Math.min(mouseDelta * 3, 1))
        lastMouseX = config.mouseX
        lastMouseY = config.mouseY
      }

      // Update wave sources
      for (const source of waveSources) {
        source.age += settings.waveSpeed
        source.strength *= settings.waveDecay
      }

      // Remove dead wave sources
      waveSources = waveSources.filter(s => s.strength > 0.01)

      // In preview mode, add ambient waves
      if (config.preview && p.frameCount % 90 === 0) {
        addWaveSource(
          p.random(config.width * 0.2, config.width * 0.8),
          p.random(config.height * 0.2, config.height * 0.8),
          0.4
        )
      }

      // Update physics for each node
      for (let i = 0; i < settings.rows; i++) {
        for (let j = 0; j < settings.cols; j++) {
          const node = grid[i][j]

          // Calculate wave interference at this point
          let waveZ = 0
          for (const source of waveSources) {
            const dx = node.originX - source.x
            const dy = node.originY - source.y
            const dist = Math.sqrt(dx * dx + dy * dy)

            // Circular wave with decay
            const wavePhase = dist * 0.05 - source.age
            const amplitude = source.strength * Math.exp(-dist * 0.003) * 20
            waveZ += Math.sin(wavePhase) * amplitude
          }

          node.phase = waveZ

          // Apply wave displacement as force
          node.vy += waveZ * 0.01

          // Mouse repulsion (gentler)
          const dx = node.x - mouseWorldX
          const dy = node.y - mouseWorldY
          const distSq = dx * dx + dy * dy
          const dist = Math.sqrt(distSq)
          const repulsionRadius = 120

          if (dist < repulsionRadius && dist > 0) {
            const force = 200 / (distSq + 200)
            node.vx += (dx / dist) * force
            node.vy += (dy / dist) * force
          }

          // Spring force back to origin
          node.vx += (node.originX - node.x) * settings.springStrength
          node.vy += (node.originY - node.y) * settings.springStrength

          // Neighbor coupling (creates wave propagation through grid)
          const coupling = 0.002
          if (i > 0) {
            node.vy += (grid[i - 1][j].y - node.y - (grid[i - 1][j].originY - node.originY)) * coupling
          }
          if (i < settings.rows - 1) {
            node.vy += (grid[i + 1][j].y - node.y - (grid[i + 1][j].originY - node.originY)) * coupling
          }
          if (j > 0) {
            node.vx += (grid[i][j - 1].x - node.x - (grid[i][j - 1].originX - node.originX)) * coupling
          }
          if (j < settings.cols - 1) {
            node.vx += (grid[i][j + 1].x - node.x - (grid[i][j + 1].originX - node.originX)) * coupling
          }

          // Damping
          node.vx *= settings.damping
          node.vy *= settings.damping

          // Update position
          node.x += node.vx
          node.y += node.vy
        }
      }

      // Draw connections with interference visualization
      for (let i = 0; i < settings.rows; i++) {
        for (let j = 0; j < settings.cols; j++) {
          const node = grid[i][j]

          // Visual intensity based on wave phase and displacement
          const displacement = Math.sqrt(
            (node.x - node.originX) ** 2 + (node.y - node.originY) ** 2
          )
          const phaseIntensity = Math.abs(node.phase) * 0.5

          // Horizontal connections
          if (j < settings.cols - 1) {
            const right = grid[i][j + 1]
            const avgPhase = (Math.abs(node.phase) + Math.abs(right.phase)) / 2

            // Line thickness varies with tension
            const stretch = Math.abs(node.x - right.x - (node.originX - right.originX))
            const weight = 0.5 + stretch * 0.1 + avgPhase * 0.02

            // Alpha varies with displacement and phase
            const alpha = settings.connectionAlphaBase + displacement * 0.8 + avgPhase * 0.5

            p.strokeWeight(Math.min(weight, 2))
            p.stroke(255, 255, 255, Math.min(alpha, 80))
            p.line(node.x, node.y, right.x, right.y)
          }

          // Vertical connections
          if (i < settings.rows - 1) {
            const bottom = grid[i + 1][j]
            const avgPhase = (Math.abs(node.phase) + Math.abs(bottom.phase)) / 2

            const stretch = Math.abs(node.y - bottom.y - (node.originY - bottom.originY))
            const weight = 0.5 + stretch * 0.1 + avgPhase * 0.02
            const alpha = settings.connectionAlphaBase + displacement * 0.8 + avgPhase * 0.5

            p.strokeWeight(Math.min(weight, 2))
            p.stroke(255, 255, 255, Math.min(alpha, 80))
            p.line(node.x, node.y, bottom.x, bottom.y)
          }

          // Diagonal connections for denser mesh feel
          if (i < settings.rows - 1 && j < settings.cols - 1) {
            const diag = grid[i + 1][j + 1]
            const alpha = (settings.connectionAlphaBase * 0.3) + phaseIntensity * 0.3

            p.strokeWeight(0.3)
            p.stroke(255, 255, 255, Math.min(alpha, 30))
            p.line(node.x, node.y, diag.x, diag.y)
          }
        }
      }

      // Draw nodes with phase-based glow
      p.noStroke()
      for (let i = 0; i < settings.rows; i++) {
        for (let j = 0; j < settings.cols; j++) {
          const node = grid[i][j]

          const velocity = Math.sqrt(node.vx ** 2 + node.vy ** 2)
          const phaseGlow = Math.abs(node.phase) * 2
          const alpha = 30 + velocity * 15 + phaseGlow

          // Outer glow for high-phase nodes
          if (Math.abs(node.phase) > 3) {
            p.fill(255, 255, 255, Math.min(alpha * 0.3, 40))
            p.circle(node.x, node.y, 6)
          }

          // Core node
          p.fill(255, 255, 255, Math.min(alpha, 120))
          p.circle(node.x, node.y, 2.5)
        }
      }

      // Draw wave source indicators
      p.noFill()
      for (const source of waveSources) {
        const radius = source.age * 15
        const alpha = source.strength * 30
        p.stroke(255, 255, 255, alpha)
        p.strokeWeight(1)
        p.circle(source.x, source.y, radius)
      }
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

export default ResonanceCanvas
