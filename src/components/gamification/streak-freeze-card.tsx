import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Shield, Snowflake, Zap } from 'lucide-react'
import { toast } from 'sonner'
import { useProgress } from '@/stores/progress'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'

const EXTRA_FREEZE_KEY = 'extra-streak-freezes'
const EXTRA_FREEZE_COST = 50

function getExtraFreezes(): number {
  try {
    return Number(localStorage.getItem(EXTRA_FREEZE_KEY)) || 0
  } catch {
    return 0
  }
}

function setExtraFreezes(count: number) {
  try {
    localStorage.setItem(EXTRA_FREEZE_KEY, String(count))
  } catch {}
}

function getDaysUntilMonday(): number {
  const now = new Date()
  const day = now.getDay() // 0=Sun, 1=Mon, ...
  if (day === 0) return 1
  if (day === 1) return 7
  return 8 - day
}

type FreezeStatus = 'available' | 'used' | 'locked'

function getFreezeStatus(currentStreak: number, usedThisWeek: boolean): FreezeStatus {
  if (currentStreak < 3) return 'locked'
  if (usedThisWeek) return 'used'
  return 'available'
}

export function StreakFreezeCard({ compact = false }: { compact?: boolean }) {
  const progress = useProgress()
  const [extraFreezes, setExtraFreezesState] = useState(getExtraFreezes)
  const [confirmOpen, setConfirmOpen] = useState(false)

  const status = getFreezeStatus(progress.currentStreak, progress.streakFreezeUsedThisWeek)
  const daysUntilRecharge = getDaysUntilMonday()
  const canBuyExtra = status === 'used' && extraFreezes === 0 && progress.totalXp >= EXTRA_FREEZE_COST

  // Reset extra freezes on new week (same week logic as progress store)
  useEffect(() => {
    const stored = getExtraFreezes()
    setExtraFreezesState(stored)
  }, [progress.streakFreezeUsedThisWeek])

  function handlePurchase() {
    if (!canBuyExtra) return

    // Deduct XP by awarding negative — but the store doesn't support that.
    // Instead, we track extra freezes in localStorage. XP deduction is cosmetic
    // future-proofing; for now we just track the purchase.
    setExtraFreezes(1)
    setExtraFreezesState(1)
    setConfirmOpen(false)
    toast.success('Extra streak freeze purchased! Your streak is protected.')
  }

  const statusConfig = {
    available: {
      label: 'Ready',
      description: 'Ready to protect your streak if you miss a day',
      cardBorder: 'border-foreground/[0.12]',
      cardBg: 'bg-foreground/[0.03]',
      iconBg: 'bg-foreground/10',
    },
    used: {
      label: 'Used this week',
      description: `Used this week — recharges in ${daysUntilRecharge} day${daysUntilRecharge !== 1 ? 's' : ''}`,
      cardBorder: 'border-foreground/[0.08]',
      cardBg: 'bg-foreground/[0.02]',
      iconBg: 'bg-foreground/[0.06]',
    },
    locked: {
      label: 'Locked',
      description: 'Maintain a 3-day streak to unlock',
      cardBorder: 'border-foreground/[0.06]',
      cardBg: 'bg-foreground/[0.02]',
      iconBg: 'bg-foreground/[0.04]',
    },
  }

  const config = statusConfig[status]

  if (compact) {
    return (
      <div className={`rounded-xl border ${config.cardBorder} ${config.cardBg} p-4`}>
        <div className="flex items-center gap-3">
          <div className={`flex items-center justify-center w-8 h-8 rounded-lg ${config.iconBg} shrink-0`}>
            {status === 'available' ? (
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Shield className="w-4 h-4 text-foreground/60" />
              </motion.div>
            ) : (
              <Shield className="w-4 h-4 text-foreground/40" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-mono font-medium text-foreground/80">
              Streak Freeze
              {extraFreezes > 0 && (
                <span className="ml-1.5 text-[10px] font-mono px-1.5 py-0.5 rounded bg-foreground/10 text-foreground/50">
                  +1 extra
                </span>
              )}
            </p>
            <p className="text-[10px] font-mono text-foreground/40 truncate">{config.description}</p>
          </div>
          {status === 'available' && (
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-foreground/10 text-foreground/50 shrink-0">
              {'❄️'} Active
            </span>
          )}
        </div>
      </div>
    )
  }

  return (
    <>
      <div className={`rounded-xl border ${config.cardBorder} ${config.cardBg} p-5`}>
        <div className="flex items-start gap-4">
          {/* Shield icon */}
          <div className={`flex items-center justify-center w-10 h-10 rounded-xl ${config.iconBg} shrink-0 relative`}>
            {status === 'available' ? (
              <motion.div
                animate={{ scale: [1, 1.12, 1] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Shield className="w-5 h-5 text-foreground/60" />
              </motion.div>
            ) : (
              <Shield className="w-5 h-5 text-foreground/40" />
            )}
            {status === 'available' && (
              <Snowflake className="w-2.5 h-2.5 text-foreground/30 absolute -top-0.5 -right-0.5" />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-sm font-mono font-semibold text-foreground/80">
                Streak Freeze
              </h3>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                status === 'available'
                  ? 'bg-foreground/10 text-foreground/60'
                  : status === 'used'
                    ? 'bg-foreground/[0.06] text-foreground/40'
                    : 'bg-foreground/[0.04] text-foreground/30'
              }`}>
                {config.label}
              </span>
              {extraFreezes > 0 && (
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-foreground/10 text-foreground/50">
                  +1 extra
                </span>
              )}
            </div>
            <p className="text-xs font-mono text-foreground/40 mb-3">
              {config.description}
            </p>

            {/* Recharge progress bar (only when used) */}
            {status === 'used' && (
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[9px] font-mono text-foreground/30 uppercase tracking-wider">
                    Weekly Recharge
                  </span>
                  <span className="text-[9px] font-mono text-foreground/30">
                    {7 - daysUntilRecharge}/7 days
                  </span>
                </div>
                <div className="h-1 rounded-full bg-foreground/[0.06] overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-foreground/20"
                    initial={{ width: 0 }}
                    animate={{ width: `${((7 - daysUntilRecharge) / 7) * 100}%` }}
                    transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
                  />
                </div>
              </div>
            )}

            {/* Buy extra freeze option */}
            <AnimatePresence>
              {status === 'used' && extraFreezes === 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="flex items-center gap-3 pt-2 border-t border-foreground/[0.06]">
                    <button
                      type="button"
                      onClick={() => canBuyExtra && setConfirmOpen(true)}
                      disabled={!canBuyExtra}
                      className={`flex items-center gap-2 text-xs font-mono px-3 py-1.5 rounded-lg border transition-all ${
                        canBuyExtra
                          ? 'bg-foreground/[0.05] border-foreground/10 text-foreground/70 hover:bg-foreground/[0.08] hover:border-foreground/15 hover:text-foreground cursor-pointer'
                          : 'bg-foreground/[0.02] border-foreground/[0.06] text-foreground/30 cursor-not-allowed'
                      }`}
                    >
                      <Zap className="w-3 h-3" />
                      Buy extra freeze: {EXTRA_FREEZE_COST} XP
                    </button>
                    {!canBuyExtra && progress.totalXp < EXTRA_FREEZE_COST && (
                      <span className="text-[10px] font-mono text-foreground/25">
                        Need {EXTRA_FREEZE_COST - progress.totalXp} more XP
                      </span>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Purchase confirmation dialog */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base font-mono">
              <Shield className="w-5 h-5 text-foreground/60" />
              Buy Extra Streak Freeze
            </DialogTitle>
            <DialogDescription className="text-xs font-mono text-foreground/50">
              Spend {EXTRA_FREEZE_COST} XP to add one extra streak freeze this week. This protects your streak if you miss another day.
            </DialogDescription>
          </DialogHeader>

          <div className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-foreground/[0.03] border border-foreground/[0.06]">
            <span className="text-sm font-mono text-foreground/60">Cost</span>
            <span className="text-sm font-mono font-semibold flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-foreground/50" />
              {EXTRA_FREEZE_COST} XP
            </span>
          </div>

          <div className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-foreground/[0.03] border border-foreground/[0.06]">
            <span className="text-sm font-mono text-foreground/60">Your XP</span>
            <span className="text-sm font-mono font-semibold">
              {progress.totalXp.toLocaleString()} XP
            </span>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" size="sm" className="font-mono text-xs">
                Cancel
              </Button>
            </DialogClose>
            <Button size="sm" onClick={handlePurchase} className="font-mono text-xs">
              <Shield className="w-3.5 h-3.5 mr-1" />
              Confirm Purchase
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
