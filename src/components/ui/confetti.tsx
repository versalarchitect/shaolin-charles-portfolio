import { useEffect, useRef, useCallback } from 'react'

export interface ConfettiOptions {
  particleCount?: number
  spread?: number
  startVelocity?: number
  gravity?: number
  drift?: number
  colors?: string[]
  origin?: { x: number; y: number }
  decay?: number
  scalar?: number
  shapes?: ('square' | 'circle')[]
  duration?: number
}

const DEFAULTS: Required<ConfettiOptions> = {
  particleCount: 60,
  spread: 70,
  startVelocity: 35,
  gravity: 0.6,
  drift: 0,
  colors: ['#ff577f', '#ff884b', '#ffd384', '#fff9b0', '#3ec1d3', '#a78bfa', '#6ee7b7'],
  origin: { x: 0.5, y: 1 },
  decay: 0.92,
  scalar: 1,
  shapes: ['square', 'circle'],
  duration: 2500,
}

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  color: string
  shape: 'square' | 'circle'
  size: number
  rotation: number
  rotationSpeed: number
  opacity: number
  decay: number
}

function createParticles(canvas: HTMLCanvasElement, opts: Required<ConfettiOptions>): Particle[] {
  const particles: Particle[] = []
  const originX = opts.origin.x * canvas.width
  const originY = opts.origin.y * canvas.height
  const spreadRad = (opts.spread * Math.PI) / 180

  for (let i = 0; i < opts.particleCount; i++) {
    const angle = -Math.PI / 2 + (Math.random() - 0.5) * spreadRad
    const velocity = opts.startVelocity * (0.5 + Math.random() * 0.5)
    particles.push({
      x: originX + (Math.random() - 0.5) * 20,
      y: originY,
      vx: Math.cos(angle) * velocity + opts.drift * (Math.random() - 0.5),
      vy: Math.sin(angle) * velocity,
      color: opts.colors[Math.floor(Math.random() * opts.colors.length)],
      shape: opts.shapes[Math.floor(Math.random() * opts.shapes.length)],
      size: (4 + Math.random() * 6) * opts.scalar,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.3,
      opacity: 1,
      decay: opts.decay + Math.random() * 0.03,
    })
  }
  return particles
}

export function useConfetti() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const animRef = useRef<number | null>(null)

  const fire = useCallback((options?: ConfettiOptions) => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    let canvas = canvasRef.current
    if (!canvas) {
      canvas = document.createElement('canvas')
      canvas.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:9999'
      document.body.appendChild(canvas)
      canvasRef.current = canvas
    }

    canvas.width = window.innerWidth * devicePixelRatio
    canvas.height = window.innerHeight * devicePixelRatio
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.scale(devicePixelRatio, devicePixelRatio)

    const opts = { ...DEFAULTS, ...options }
    const particles = createParticles(canvas, opts)
    const start = performance.now()

    if (animRef.current) cancelAnimationFrame(animRef.current)

    const animate = (now: number) => {
      const elapsed = now - start
      ctx.clearRect(0, 0, canvas!.width, canvas!.height)

      let alive = false
      for (const p of particles) {
        if (p.opacity <= 0.01) continue
        alive = true

        p.vy += opts.gravity
        p.x += p.vx
        p.y += p.vy
        p.vx *= 0.99
        p.rotation += p.rotationSpeed
        p.opacity *= p.decay

        ctx.save()
        ctx.globalAlpha = p.opacity
        ctx.fillStyle = p.color
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rotation)

        if (p.shape === 'circle') {
          ctx.beginPath()
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2)
          ctx.fill()
        } else {
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size)
        }

        ctx.restore()
      }

      if (alive && elapsed < opts.duration) {
        animRef.current = requestAnimationFrame(animate)
      } else {
        ctx.clearRect(0, 0, canvas!.width, canvas!.height)
        if (canvas!.parentNode) canvas!.parentNode.removeChild(canvas!)
        canvasRef.current = null
        animRef.current = null
      }
    }

    animRef.current = requestAnimationFrame(animate)
  }, [])

  useEffect(() => {
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current)
      if (canvasRef.current?.parentNode) canvasRef.current.parentNode.removeChild(canvasRef.current)
    }
  }, [])

  return fire
}

export function ConfettiBurst({ trigger, options }: { trigger: boolean; options?: ConfettiOptions }) {
  const fire = useConfetti()
  const hasFired = useRef(false)

  useEffect(() => {
    if (trigger && !hasFired.current) {
      hasFired.current = true
      fire(options)
    }
    if (!trigger) hasFired.current = false
  }, [trigger, fire, options])

  return null
}
