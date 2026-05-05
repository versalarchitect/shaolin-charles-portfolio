import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Gift, Sparkles } from 'lucide-react'
import { useProgress, awardExplorerXp } from '@/stores/progress'
import { playSound } from '@/lib/sounds'

const STORAGE_KEY = 'last-daily-reward'

function getToday(): string {
  return new Date().toISOString().split('T')[0]
}

function getRewardXp(consecutiveDays: number): number {
  if (consecutiveDays >= 30) return 50
  if (consecutiveDays >= 14) return 40
  if (consecutiveDays >= 7) return 25
  if (consecutiveDays >= 4) return 15
  if (consecutiveDays >= 3) return 12
  if (consecutiveDays >= 2) return 8
  return 5
}

function getConsecutiveDays(streakDates: string[]): number {
  if (streakDates.length === 0) return 1

  const today = getToday()
  const sorted = [...streakDates].sort()

  // Count backwards from today (or yesterday if not yet claimed today)
  let count = 0
  const check = new Date(today)

  for (let i = 0; i < 365; i++) {
    const dateStr = check.toISOString().split('T')[0]
    if (sorted.includes(dateStr)) {
      count++
      check.setDate(check.getDate() - 1)
    } else if (i === 0) {
      // Today might not be in streakDates yet, still count from yesterday
      check.setDate(check.getDate() - 1)
    } else {
      break
    }
  }

  // Add 1 for today (the day being claimed)
  return Math.max(1, count + (sorted.includes(today) ? 0 : 1))
}

function getLast7Days(): string[] {
  const days: string[] = []
  const d = new Date()
  for (let i = 6; i >= 0; i--) {
    const check = new Date(d)
    check.setDate(d.getDate() - i)
    days.push(check.toISOString().split('T')[0])
  }
  return days
}

export function DailyReward() {
  const progress = useProgress()
  const [visible, setVisible] = useState(false)
  const [claimed, setClaimed] = useState(false)
  const [celebrating, setCelebrating] = useState(false)

  useEffect(() => {
    const lastClaimed = localStorage.getItem(STORAGE_KEY)
    const today = getToday()
    if (lastClaimed !== today) {
      setVisible(true)
    }
  }, [])

  const consecutiveDays = useMemo(
    () => getConsecutiveDays(progress.streakDates),
    [progress.streakDates]
  )
  const rewardXp = getRewardXp(consecutiveDays)
  const isWeeklyBonus = consecutiveDays === 7
  const last7Days = useMemo(() => getLast7Days(), [])

  function handleClaim() {
    const today = getToday()
    awardExplorerXp(rewardXp, `daily-reward-${today}`)
    localStorage.setItem(STORAGE_KEY, today)
    playSound('achievement')
    setClaimed(true)

    if (isWeeklyBonus) {
      setCelebrating(true)
    }

    setTimeout(() => setVisible(false), 1200)
  }

  if (!visible) return null

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -20, height: 0 }}
          animate={{ opacity: 1, y: 0, height: 'auto' }}
          exit={{ opacity: 0, y: -20, height: 0 }}
          transition={{ duration: 0.4, ease: [0.33, 1, 0.68, 1] }}
          className="overflow-hidden"
        >
          <div className="rounded-xl border border-foreground/[0.08] bg-foreground/[0.02] p-5 relative">
            {/* Weekly bonus celebration dots */}
            {celebrating && (
              <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
                {Array.from({ length: 20 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1.5 h-1.5 rounded-full bg-foreground/20"
                    initial={{
                      x: '50%',
                      y: '50%',
                      scale: 0,
                    }}
                    animate={{
                      x: `${Math.random() * 100}%`,
                      y: `${Math.random() * 100}%`,
                      scale: [0, 1.5, 0],
                      opacity: [0, 0.6, 0],
                    }}
                    transition={{
                      duration: 1.2,
                      delay: Math.random() * 0.3,
                      ease: 'easeOut',
                    }}
                  />
                ))}
              </div>
            )}

            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-foreground/[0.05] shrink-0">
                  <Gift className="w-5 h-5 text-foreground/60" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground/90">
                    Day {consecutiveDays} — Welcome Back!
                  </p>
                  <p className="text-xs text-foreground/50 mt-0.5">
                    {isWeeklyBonus
                      ? 'Weekly bonus! 7 days in a row.'
                      : consecutiveDays >= 30
                        ? 'Incredible dedication. Max daily reward!'
                        : `Keep logging in daily for bigger rewards.`}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-sm font-mono font-semibold text-foreground/70">
                  +{rewardXp} XP
                </span>
                {isWeeklyBonus && (
                  <Sparkles className="w-4 h-4 text-foreground/40" />
                )}
              </div>
            </div>

            {/* 7-day calendar row */}
            <div className="flex items-center gap-2 mt-4">
              {last7Days.map((date) => {
                const isActive = progress.streakDates.includes(date)
                const isToday = date === getToday()
                return (
                  <div key={date} className="flex flex-col items-center gap-1">
                    <div
                      className={`w-3 h-3 rounded-full border ${
                        isActive
                          ? 'bg-foreground/30 border-foreground/40'
                          : isToday
                            ? 'border-foreground/30 bg-foreground/[0.08]'
                            : 'border-foreground/10 bg-transparent'
                      }`}
                    />
                    <span className="text-[9px] font-mono text-foreground/30">
                      {new Date(`${date}T12:00:00`).toLocaleDateString(undefined, { weekday: 'narrow' })}
                    </span>
                  </div>
                )
              })}
            </div>

            {/* Claim button */}
            <motion.button
              onClick={handleClaim}
              disabled={claimed}
              whileHover={{ scale: claimed ? 1 : 1.02 }}
              whileTap={{ scale: claimed ? 1 : 0.97 }}
              className={`mt-4 w-full h-9 rounded-lg text-sm font-mono font-medium transition-all ${
                claimed
                  ? 'bg-foreground/[0.05] text-foreground/30 cursor-default'
                  : 'bg-foreground/10 hover:bg-foreground/15 text-foreground/80'
              }`}
            >
              {claimed ? 'Claimed!' : 'Claim Reward'}
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
