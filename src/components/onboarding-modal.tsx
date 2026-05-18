import { useState } from 'react'
import { motion } from 'motion/react'
import { KeyRound, CreditCard, ArrowRight, Loader2, AlertCircle, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'
import { initiateCheckout } from '@/lib/checkout'

interface OnboardingModalProps {
  onComplete: () => void
}

export function OnboardingModal({ onComplete }: OnboardingModalProps) {
  const [code, setCode] = useState('')
  const [redeeming, setRedeeming] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [checkingOut, setCheckingOut] = useState(false)

  const handleRedeem = async () => {
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
  }

  const handleCheckout = async () => {
    setCheckingOut(true)
    try {
      await initiateCheckout()
    } catch {
      setCheckingOut(false)
      setError('Failed to start checkout. Try again.')
    }
  }

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-background/90 backdrop-blur-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.1 }}
        className="w-full max-w-2xl mx-4"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.2 }}
            className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-foreground/[0.06] border border-foreground/[0.1] mb-4"
          >
            <Sparkles className="w-7 h-7 text-foreground/60" />
          </motion.div>
          <h1 className="text-2xl font-bold tracking-tight mb-2">Choose your access</h1>
          <p className="text-sm text-foreground/50">Select how you'd like to access the course.</p>
        </div>

        {/* Two cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Beta code card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-2xl border border-foreground/[0.1] bg-gradient-to-br from-foreground/[0.03] to-transparent backdrop-blur-sm p-6 space-y-4"
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
                className="w-full bg-foreground/[0.04] border border-foreground/[0.1] rounded-lg px-3.5 py-2.5 text-sm font-mono text-foreground/80 outline-none focus:border-foreground/20 transition-colors placeholder:text-foreground/25"
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
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.35 }}
            className="rounded-2xl border border-foreground/[0.1] bg-gradient-to-br from-foreground/[0.03] to-transparent backdrop-blur-sm p-6 space-y-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-foreground/[0.06] border border-foreground/[0.08] flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-foreground/50" />
              </div>
              <div>
                <p className="text-sm font-semibold">Full Access</p>
                <p className="text-[10px] font-mono text-foreground/40">ALL 4 TIERS · LIFETIME</p>
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
                className="w-full font-mono gap-2 h-11"
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
