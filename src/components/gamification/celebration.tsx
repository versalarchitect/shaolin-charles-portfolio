import { useRef, useEffect } from 'react'
import type { ProgressEvent } from '@/stores/progress'
import { onProgressEvent } from '@/stores/progress'

// --- Particle types ---

type ParticleShape = 'rect' | 'square' | 'circle'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  width: number
  height: number
  radius: number
  shape: ParticleShape
  rotation: number
  rotationSpeed: number
  opacity: number
  gravity: number
  drag: number
  life: number
  maxLife: number
}

type CelebrationType = 'confetti' | 'burst' | 'rain'

// --- Particle factory ---

const OPACITIES = [0.1, 0.2, 0.3, 0.4]

function randomShape(): ParticleShape {
  const shapes: ParticleShape[] = ['rect', 'square', 'circle']
  return shapes[Math.floor(Math.random() * shapes.length)]
}

function randomOpacity(): number {
  return OPACITIES[Math.floor(Math.random() * OPACITIES.length)]
}

function createConfettiParticle(canvasWidth: number): Particle {
  const shape = randomShape()
  return {
    x: Math.random() * canvasWidth,
    y: -10 - Math.random() * 40,
    vx: (Math.random() - 0.5) * 3,
    vy: Math.random() * 2 + 1,
    width: shape === 'rect' ? 3 : 4,
    height: shape === 'rect' ? 8 : 4,
    radius: 3,
    shape,
    rotation: Math.random() * Math.PI * 2,
    rotationSpeed: (Math.random() - 0.5) * 0.15,
    opacity: randomOpacity(),
    gravity: 0.04 + Math.random() * 0.02,
    drag: 0.99,
    life: 0,
    maxLife: 180 + Math.random() * 120,
  }
}

function createBurstParticle(cx: number, cy: number): Particle {
  const angle = Math.random() * Math.PI * 2
  const speed = Math.random() * 6 + 2
  const shape = randomShape()
  return {
    x: cx,
    y: cy,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    width: shape === 'rect' ? 3 : 4,
    height: shape === 'rect' ? 8 : 4,
    radius: 3,
    shape,
    rotation: Math.random() * Math.PI * 2,
    rotationSpeed: (Math.random() - 0.5) * 0.2,
    opacity: randomOpacity(),
    gravity: 0.06,
    drag: 0.97,
    life: 0,
    maxLife: 120 + Math.random() * 60,
  }
}

// --- Engine ---

interface CelebrationEngine {
  particles: Particle[]
  animationId: number | null
  canvas: HTMLCanvasElement | null
  ctx: CanvasRenderingContext2D | null
  pendingWaves: Array<{ type: CelebrationType; count: number; delay: number }>
  startTime: number
}

function createEngine(): CelebrationEngine {
  return {
    particles: [],
    animationId: null,
    canvas: null,
    ctx: null,
    pendingWaves: [],
    startTime: 0,
  }
}

function spawnParticles(engine: CelebrationEngine, type: CelebrationType, count: number) {
  if (!engine.canvas) return
  const { width, height } = engine.canvas

  for (let i = 0; i < count; i++) {
    if (type === 'burst') {
      engine.particles.push(createBurstParticle(width / 2, height / 2))
    } else {
      engine.particles.push(createConfettiParticle(width))
    }
  }
}

function getEffectColor(canvas: HTMLCanvasElement): string {
  // Read the --effect-rgb CSS variable for theme-aware rendering
  const style = getComputedStyle(canvas)
  const rgb = style.getPropertyValue('--effect-rgb').trim()
  return rgb || '255, 255, 255'
}

function drawParticle(ctx: CanvasRenderingContext2D, p: Particle, rgb: string) {
  const fadeOut = Math.max(0, 1 - p.life / p.maxLife)
  const alpha = p.opacity * fadeOut

  ctx.save()
  ctx.translate(p.x, p.y)
  ctx.rotate(p.rotation)
  ctx.fillStyle = `rgba(${rgb}, ${alpha})`

  switch (p.shape) {
    case 'rect':
      ctx.fillRect(-p.width / 2, -p.height / 2, p.width, p.height)
      break
    case 'square':
      ctx.fillRect(-p.width / 2, -p.height / 2, p.width, p.height)
      break
    case 'circle':
      ctx.beginPath()
      ctx.arc(0, 0, p.radius, 0, Math.PI * 2)
      ctx.fill()
      break
  }

  ctx.restore()
}

function updateParticle(p: Particle): boolean {
  p.vx *= p.drag
  p.vy *= p.drag
  p.vy += p.gravity
  p.x += p.vx
  p.y += p.vy
  p.rotation += p.rotationSpeed
  p.life++

  return p.life < p.maxLife
}

function tick(engine: CelebrationEngine) {
  if (!engine.canvas || !engine.ctx) return

  const { canvas, ctx } = engine
  const dpr = window.devicePixelRatio || 1
  canvas.width = canvas.clientWidth * dpr
  canvas.height = canvas.clientHeight * dpr
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight)

  // Process pending waves
  const now = performance.now()
  const elapsed = now - engine.startTime
  engine.pendingWaves = engine.pendingWaves.filter((wave) => {
    if (elapsed >= wave.delay) {
      spawnParticles(engine, wave.type, wave.count)
      return false
    }
    return true
  })

  const rgb = getEffectColor(canvas)

  // Update and draw
  engine.particles = engine.particles.filter((p) => {
    const alive = updateParticle(p)
    if (alive) {
      drawParticle(ctx, p, rgb)
    }
    return alive
  })

  // Continue animation if there are particles or pending waves
  if (engine.particles.length > 0 || engine.pendingWaves.length > 0) {
    engine.animationId = requestAnimationFrame(() => tick(engine))
  } else {
    engine.animationId = null
  }
}

function startAnimation(engine: CelebrationEngine) {
  if (engine.animationId !== null) return
  engine.startTime = performance.now()
  engine.animationId = requestAnimationFrame(() => tick(engine))
}

function triggerOnEngine(engine: CelebrationEngine, type: CelebrationType) {
  engine.startTime = performance.now()

  switch (type) {
    case 'confetti':
      spawnParticles(engine, 'confetti', 50)
      break
    case 'burst':
      spawnParticles(engine, 'burst', 80)
      // Follow up with confetti after burst
      engine.pendingWaves.push({ type: 'confetti', count: 30, delay: 200 })
      break
    case 'rain':
      // Dense sustained confetti over 3 seconds in multiple waves
      for (let i = 0; i < 6; i++) {
        engine.pendingWaves.push({ type: 'confetti', count: 25, delay: i * 500 })
      }
      break
  }

  startAnimation(engine)
}

// --- Global singleton for triggerCelebration ---

let globalEngine: CelebrationEngine | null = null

export function registerGlobalEngine(engine: CelebrationEngine) {
  globalEngine = engine
}

export function unregisterGlobalEngine(engine: CelebrationEngine) {
  if (globalEngine === engine) {
    globalEngine = null
  }
}

/**
 * Manually trigger a celebration effect.
 * Requires CelebrationOverlay to be mounted.
 */
export function triggerCelebration(type: CelebrationType) {
  if (globalEngine) {
    triggerOnEngine(globalEngine, type)
  }
}

// --- Map progress events to celebration types ---

function eventToCelebration(event: ProgressEvent): CelebrationType | null {
  switch (event.type) {
    case 'achievement_unlocked':
      return 'confetti'
    case 'level_up':
      return 'burst'
    case 'milestone':
      return event.percent === 100 ? 'rain' : 'confetti'
    default:
      return null
  }
}

function eventToSmallConfetti(event: ProgressEvent): number | null {
  // Milestones at 25/50/75% get smaller confetti
  if (event.type === 'milestone' && event.percent < 100) {
    return 30
  }
  return null
}

// --- React components ---

/**
 * Global celebration overlay. Mount once at the app level.
 * Listens to progress events and triggers appropriate confetti effects.
 */
export function CelebrationOverlay() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const engineRef = useRef<CelebrationEngine>(createEngine())

  useEffect(() => {
    const engine = engineRef.current
    engine.canvas = canvasRef.current
    engine.ctx = canvasRef.current?.getContext('2d') ?? null

    registerGlobalEngine(engine)

    const unsubscribe = onProgressEvent((event: ProgressEvent) => {
      // Check for small confetti override first
      const smallCount = eventToSmallConfetti(event)
      if (smallCount !== null) {
        engine.startTime = performance.now()
        spawnParticles(engine, 'confetti', smallCount)
        startAnimation(engine)
        return
      }

      const type = eventToCelebration(event)
      if (type) {
        triggerOnEngine(engine, type)
      }
    })

    return () => {
      unsubscribe()
      unregisterGlobalEngine(engine)
      if (engine.animationId !== null) {
        cancelAnimationFrame(engine.animationId)
        engine.animationId = null
      }
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[110] pointer-events-none"
      style={{ width: '100vw', height: '100vh' }}
    />
  )
}

/**
 * Inline celebration particles (backward-compatible).
 * Renders a one-shot burst of confetti within a relative container.
 */
export function CelebrationParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const engineRef = useRef<CelebrationEngine>(createEngine())

  useEffect(() => {
    const engine = engineRef.current
    engine.canvas = canvasRef.current
    engine.ctx = canvasRef.current?.getContext('2d') ?? null

    // Trigger a burst immediately on mount
    if (engine.canvas) {
      triggerOnEngine(engine, 'burst')
    }

    return () => {
      if (engine.animationId !== null) {
        cancelAnimationFrame(engine.animationId)
        engine.animationId = null
      }
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ width: '100%', height: '100%' }}
    />
  )
}
