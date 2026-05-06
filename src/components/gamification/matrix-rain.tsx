import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*()_+-=[]{}|;:,./<>?~'
const FONT_SIZE = 14
const DURATION = 3000

interface MatrixRainProps {
  onComplete: () => void
}

export function MatrixRain({ onComplete }: MatrixRainProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Get foreground color from CSS custom property
    const computedStyle = getComputedStyle(document.documentElement)
    const fg = computedStyle.getPropertyValue('--foreground').trim()
    // Parse the color - it might be in hsl or rgb format
    const color = fg || '0 0% 100%'

    // Get background-like color for trail fade effect (inverted from --effect-rgb)
    // In dark mode --effect-rgb is 255,255,255 so trail is black (0,0,0)
    // In light mode --effect-rgb is 0,0,0 so trail is white (255,255,255)
    const effectRgb = computedStyle.getPropertyValue('--effect-rgb').trim() || '255, 255, 255'
    const rgbParts = effectRgb.split(',').map((v) => 255 - parseInt(v.trim(), 10))
    const trailColor = `rgba(${rgbParts.join(', ')}, 0.05)`

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const columns = Math.floor(canvas.width / FONT_SIZE)
    const drops: number[] = new Array(columns).fill(1)

    // Randomize start positions for visual variety
    for (let i = 0; i < drops.length; i++) {
      drops[i] = Math.random() * -20
    }

    function draw() {
      if (!ctx || !canvas) return

      // Semi-transparent background to create trail effect (theme-aware)
      ctx.fillStyle = trailColor
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.font = `${FONT_SIZE}px monospace`

      for (let i = 0; i < drops.length; i++) {
        const char = CHARS[Math.floor(Math.random() * CHARS.length)]

        // Use foreground color with varying opacity for depth
        const opacity = 0.3 + Math.random() * 0.4
        ctx.fillStyle = `hsl(${color} / ${opacity})`

        const x = i * FONT_SIZE
        const y = drops[i] * FONT_SIZE

        ctx.fillText(char, x, y)

        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0
        }
        drops[i]++
      }

      animRef.current = requestAnimationFrame(draw)
    }

    animRef.current = requestAnimationFrame(draw)

    const timeout = setTimeout(() => {
      onComplete()
    }, DURATION)

    return () => {
      cancelAnimationFrame(animRef.current)
      clearTimeout(timeout)
    }
  }, [onComplete])

  return (
    <motion.div
      className="fixed inset-0 z-[200] pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, exit: { duration: 0.8 } }}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ background: 'transparent' }}
      />
    </motion.div>
  )
}
