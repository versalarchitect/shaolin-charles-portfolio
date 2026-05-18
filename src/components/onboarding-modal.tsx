import { useState, useRef, useCallback, useEffect } from 'react'
import { motion } from 'motion/react'
import { KeyRound, CreditCard, ArrowRight, Loader2, AlertCircle, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'
import { initiateCheckout } from '@/lib/checkout'

function AuroraBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: 0.5, y: 0.5 })
  const targetRef = useRef({ x: 0.5, y: 0.5 })
  const animRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth * devicePixelRatio
      canvas.height = window.innerHeight * devicePixelRatio
      ctx.scale(devicePixelRatio, devicePixelRatio)
    }
    resize()
    window.addEventListener('resize', resize)

    const handleMove = (e: MouseEvent) => {
      targetRef.current = {
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      }
    }
    window.addEventListener('mousemove', handleMove)

    let time = 0
    const animate = () => {
      time += 0.003
      const w = window.innerWidth
      const h = window.innerHeight

      // Smooth lerp toward mouse
      mouseRef.current.x += (targetRef.current.x - mouseRef.current.x) * 0.02
      mouseRef.current.y += (targetRef.current.y - mouseRef.current.y) * 0.02
      const mx = mouseRef.current.x
      const my = mouseRef.current.y

      ctx.clearRect(0, 0, w, h)

      // Orb 1: deep purple, follows mouse
      const g1 = ctx.createRadialGradient(
        mx * w, my * h, 0,
        mx * w, my * h, h * 0.6
      )
      g1.addColorStop(0, 'rgba(139, 92, 246, 0.15)')
      g1.addColorStop(0.4, 'rgba(109, 40, 217, 0.08)')
      g1.addColorStop(1, 'transparent')
      ctx.fillStyle = g1
      ctx.fillRect(0, 0, w, h)

      // Orb 2: chrome silver, drifts slowly
      const ox2 = w * (0.3 + Math.sin(time * 1.2) * 0.15)
      const oy2 = h * (0.6 + Math.cos(time * 0.8) * 0.15)
      const g2 = ctx.createRadialGradient(ox2, oy2, 0, ox2, oy2, h * 0.5)
      g2.addColorStop(0, 'rgba(203, 213, 225, 0.1)')
      g2.addColorStop(0.5, 'rgba(148, 163, 184, 0.04)')
      g2.addColorStop(1, 'transparent')
      ctx.fillStyle = g2
      ctx.fillRect(0, 0, w, h)

      // Orb 3: violet/fuchsia accent, opposite to mouse
      const ox3 = w * (1 - mx * 0.6 + Math.sin(time * 0.7) * 0.1)
      const oy3 = h * (1 - my * 0.6 + Math.cos(time * 1.1) * 0.1)
      const g3 = ctx.createRadialGradient(ox3, oy3, 0, ox3, oy3, h * 0.45)
      g3.addColorStop(0, 'rgba(192, 132, 252, 0.12)')
      g3.addColorStop(0.5, 'rgba(168, 85, 247, 0.05)')
      g3.addColorStop(1, 'transparent')
      ctx.fillStyle = g3
      ctx.fillRect(0, 0, w, h)

      // Orb 4: subtle blue shimmer near mouse
      const ox4 = mx * w + Math.sin(time * 2) * 60
      const oy4 = my * h + Math.cos(time * 1.5) * 60
      const g4 = ctx.createRadialGradient(ox4, oy4, 0, ox4, oy4, 200)
      g4.addColorStop(0, 'rgba(147, 197, 253, 0.08)')
      g4.addColorStop(1, 'transparent')
      ctx.fillStyle = g4
      ctx.fillRect(0, 0, w, h)

      animRef.current = requestAnimationFrame(animate)
    }

    animRef.current = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animRef.current)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', handleMove)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ filter: 'blur(80px)' }}
    />
  )
}

interface OnboardingModalProps {
  onComplete: () => void
}

export function OnboardingModal({ onComplete }: OnboardingModalProps) {
  const [code, setCode] = useState('')
  const [redeeming, setRedeeming] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [checkingOut, setCheckingOut] = useState(false)

  const handleRedeem = useCallback(async () => {
    if (!code.trim()) return
    setRedeeming(true)
    setError(null)

    try {
      const { data, error: rpcError } = await supabase.rpc('redeem_beta_code', {
        p_code: code.trim().toUpperCase(),
      })

      if (rpcError) throw rpcError
      if (!data) {
        setError('Invalid or already used code.')
        setRedeeming(false)
        return
      }

      onComplete()
    } catch {
      setError('Something went wrong. Try again.')
      setRedeeming(false)
    }
  }, [code, onComplete])

  const handleCheckout = useCallback(async () => {
    setCheckingOut(true)
    try {
      await initiateCheckout()
    } catch {
      setCheckingOut(false)
      setError('Failed to start checkout. Try again.')
    }
  }, [])

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Dark base */}
      <div className="absolute inset-0 bg-background" />

      {/* Interactive aurora */}
      <AuroraBackground />

      {/* Noise texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundSize: '128px 128px',
        }}
      />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.92 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 180, damping: 22, delay: 0.2 }}
        className="relative z-10 w-full max-w-2xl mx-4"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.35 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-violet-500/10 border border-violet-500/20 mb-5 shadow-lg shadow-violet-500/10"
          >
            <Sparkles className="w-8 h-8 text-violet-400/80" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-3xl font-bold tracking-tight mb-2"
          >
            Choose your access
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-sm text-foreground/50"
          >
            Select how you'd like to access the course.
          </motion.p>
        </div>

        {/* Two cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Beta code card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.5 }}
            className="rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl p-6 space-y-4 shadow-xl shadow-black/20"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-foreground/[0.06] border border-foreground/[0.08] flex items-center justify-center">
                <KeyRound className="w-5 h-5 text-foreground/50" />
              </div>
              <div>
                <p className="text-sm font-semibold">Beta Tester</p>
                <p className="text-[10px] font-mono text-foreground/40">PREWORK + TIER 1</p>
              </div>
            </div>

            <p className="text-xs text-foreground/50 leading-relaxed">
              Enter your beta code to unlock Getting Started and How AI Thinks — 13 lessons to get you building.
            </p>

            <div className="space-y-2">
              <input
                type="text"
                value={code}
                onChange={(e) => { setCode(e.target.value.toUpperCase()); setError(null) }}
                onKeyDown={(e) => { if (e.key === 'Enter') handleRedeem() }}
                placeholder="BETA-XXXX-XXXX"
                className="w-full bg-white/[0.04] border border-white/[0.1] rounded-lg px-3.5 py-2.5 text-sm font-mono text-foreground/80 outline-none focus:border-violet-500/30 transition-colors placeholder:text-foreground/25"
                disabled={redeeming}
                spellCheck={false}
                autoComplete="off"
              />
              <Button
                onClick={handleRedeem}
                disabled={!code.trim() || redeeming}
                className="w-full font-mono gap-2"
              >
                {redeeming ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Redeeming...</>
                ) : (
                  <><KeyRound className="w-4 h-4" /> Redeem Code</>
                )}
              </Button>
            </div>
          </motion.div>

          {/* Purchase card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.55 }}
            className="rounded-2xl border border-violet-500/15 bg-gradient-to-br from-violet-500/[0.06] to-purple-500/[0.03] backdrop-blur-xl p-6 space-y-4 shadow-xl shadow-violet-500/5"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-violet-400/70" />
              </div>
              <div>
                <p className="text-sm font-semibold">Full Access</p>
                <p className="text-[10px] font-mono text-violet-400/50">ALL 4 TIERS · LIFETIME</p>
              </div>
            </div>

            <p className="text-xs text-foreground/50 leading-relaxed">
              Unlock the entire course — 51 lessons, 4 real-world projects, AI tutor, and lifetime updates.
            </p>

            <div className="space-y-2">
              <div className="flex items-baseline gap-1 py-1">
                <span className="text-3xl font-bold font-mono">$7,500</span>
                <span className="text-xs font-mono text-foreground/40">USD · one-time</span>
              </div>
              <Button
                onClick={handleCheckout}
                disabled={checkingOut}
                className="w-full font-mono gap-2 h-11 bg-violet-600 hover:bg-violet-500 text-white border-0"
                size="lg"
              >
                {checkingOut ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Redirecting...</>
                ) : (
                  <>Get Full Access <ArrowRight className="w-4 h-4" /></>
                )}
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Error message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 flex items-center gap-2 text-sm text-red-400 justify-center"
          >
            <AlertCircle className="w-4 h-4" />
            {error}
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  )
}
