import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import { Zap, Flame } from 'lucide-react'
import { useProgress, getStreakMultiplier } from '@/stores/progress'

export function StatsBarHeader() {
  const progress = useProgress()
  const navigate = useNavigate()
  const { multiplier, label } = getStreakMultiplier()
  const remaining = Math.max(0, progress.dailyXpGoal - progress.dailyXpEarned)
  const goalPercent = Math.min(100, (progress.dailyXpEarned / progress.dailyXpGoal) * 100)

  return (
    <nav aria-label="Course progress stats" className="sticky top-0 z-10 flex items-center justify-between h-8 px-4 bg-foreground/[0.02] border-b border-foreground/[0.06] select-none">
      {/* Left: XP badge */}
      <button
        onClick={() => navigate('/course/analytics')}
        className="flex items-center gap-1 text-foreground/50 hover:text-foreground/70 transition-colors"
        aria-label="View analytics"
      >
        <Zap className="w-3 h-3" />
        <AnimatePresence mode="popLayout">
          <motion.span
            key={progress.totalXp}
            initial={{ scale: 1.3, opacity: 0.6 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            className="text-[11px] font-mono leading-none"
          >
            {progress.totalXp} XP
          </motion.span>
        </AnimatePresence>
      </button>

      {/* Center: Daily goal progress (hidden on mobile) */}
      <div
        className="hidden md:flex items-center gap-2 text-foreground/50"
        title={`${remaining} XP remaining today`}
      >
        <div className="w-24 h-1 rounded-full bg-foreground/[0.06] overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-foreground/20"
            initial={false}
            animate={{ width: `${goalPercent}%` }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          />
        </div>
        <span className="text-[10px] font-mono leading-none whitespace-nowrap">
          {progress.dailyXpEarned}/{progress.dailyXpGoal}
        </span>
      </div>

      {/* Right: Streak + multiplier */}
      <button
        onClick={() => navigate('/course/dashboard')}
        className="flex items-center gap-1 text-foreground/50 hover:text-foreground/70 transition-colors"
        aria-label="View streak"
      >
        <Flame className="w-3 h-3" />
        <span className="text-[11px] font-mono leading-none">
          {progress.currentStreak}d
        </span>
        {multiplier > 1 && (
          <span className="text-[9px] font-mono leading-none px-1 py-0.5 rounded bg-foreground/[0.05] border border-foreground/[0.08] text-foreground/60">
            {label}
          </span>
        )}
      </button>
    </nav>
  )
}
