import { type ReactNode, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Flame, Zap, Target, Trophy, Sparkles, ChevronUp, ChevronDown, TrendingUp, TrendingDown, Clock, BookOpen, Shield, Star } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { toast } from 'sonner'
import { playSound } from '@/lib/sounds'
import { MultiplierBadge } from '@/components/gamification/shared'
import {
  useProgress,
  getStreakMultiplier,
  getComboInfo,
  getDailyChallenges,
  getXpLog,
  getWeeklyStats,
  setDailyXpGoal,
  onProgressEvent,
  COMBO_WINDOW_MS,
} from '@/stores/progress'
import type { DailyChallenge, XpEvent, ProgressEvent } from '@/stores/progress'

export function StreakMultiplierBadge() {
  const progress = useProgress()
  const { multiplier, label } = getStreakMultiplier()
  if (multiplier <= 1) return null
  return <MultiplierBadge icon={Flame} label={label} secondary={`${progress.currentStreak}d streak`} />
}

export function ComboIndicator() {
  useProgress()
  const { count, bonusPercent, active } = getComboInfo()
  if (!active || count <= 1) return null
  return <MultiplierBadge icon={Zap} label={`${count}x combo`} secondary={`+${bonusPercent}%`} />
}

export function DailyXpGoal() {
  const progress = useProgress()
  const { multiplier } = getStreakMultiplier()
  const percent = Math.min(100, Math.round((progress.dailyXpEarned / progress.dailyXpGoal) * 100))
  const isComplete = percent >= 100
  return (
    <div className="rounded-xl border border-foreground/[0.08] bg-foreground/[0.02] p-4">
      <div className="flex items-center gap-4">
        <div className="relative w-[88px] h-[88px] shrink-0">
          <div
            className="w-full h-full rounded-full"
            style={{
              background: `conic-gradient(currentColor ${percent * 3.6}deg, var(--color-foreground) 0deg ${percent * 3.6}deg, transparent ${percent * 3.6}deg)`,
              opacity: isComplete ? 0.4 : 0.2,
              mask: 'radial-gradient(farthest-side, transparent calc(100% - 5px), #000 calc(100% - 5px))',
              WebkitMask: 'radial-gradient(farthest-side, transparent calc(100% - 5px), #000 calc(100% - 5px))',
            }}
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {isComplete ? (
              <Sparkles className="w-5 h-5 text-foreground/60" />
            ) : (
              <>
                <span className="text-lg font-mono font-bold leading-none">{progress.dailyXpEarned}</span>
                <span className="text-[9px] font-mono text-foreground/40">/ {progress.dailyXpGoal}</span>
              </>
            )}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium">
              {isComplete ? 'Daily Goal Complete!' : 'Daily XP Goal'}
            </span>
            {multiplier > 1 && (
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-foreground/10 text-foreground/60">
                {multiplier}x active
              </span>
            )}
          </div>
          <p className="text-xs text-foreground/40 mb-2">
            {isComplete
              ? 'Keep going for bonus momentum'
              : `${progress.dailyXpGoal - progress.dailyXpEarned} XP remaining today`}
          </p>
          <GoalAdjuster currentGoal={progress.dailyXpGoal} />
        </div>
      </div>
    </div>
  )
}

function GoalAdjuster({ currentGoal }: { currentGoal: number }) {
  return (
    <div className="flex items-center gap-1">
      <span className="text-[10px] font-mono text-foreground/30 mr-1">Goal:</span>
      <button
        onClick={() => setDailyXpGoal(currentGoal - 10)}
        className="w-5 h-5 rounded flex items-center justify-center bg-foreground/[0.04] hover:bg-foreground/10 transition-colors"
        disabled={currentGoal <= 10}
      >
        <ChevronDown className="w-3 h-3 text-foreground/50" />
      </button>
      <span className="text-xs font-mono text-foreground/60 w-8 text-center">{currentGoal}</span>
      <button
        onClick={() => setDailyXpGoal(currentGoal + 10)}
        className="w-5 h-5 rounded flex items-center justify-center bg-foreground/[0.04] hover:bg-foreground/10 transition-colors"
        disabled={currentGoal >= 200}
      >
        <ChevronUp className="w-3 h-3 text-foreground/50" />
      </button>
    </div>
  )
}

export function DailyChallenges() {
  useProgress()
  const challenges = getDailyChallenges()
  const completedCount = challenges.filter((c) => c.completed).length
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-mono uppercase tracking-wider text-foreground/40">Daily Challenges</h2>
        <span className="text-xs font-mono text-foreground/40">{completedCount}/{challenges.length}</span>
      </div>
      <div className="space-y-2">
        {challenges.map((challenge) => (
          <ChallengeCard key={challenge.id} challenge={challenge} />
        ))}
      </div>
    </div>
  )
}

function ChallengeCard({ challenge }: { challenge: DailyChallenge }) {
  const done = challenge.completed
  return (
    <motion.div
      className={`rounded-xl border p-3.5 transition-all flex items-center gap-3 ${done ? 'border-foreground/15 bg-foreground/[0.04]' : 'border-foreground/[0.08] bg-foreground/[0.02]'}`}
      layout
    >
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${done ? 'bg-foreground/15 text-foreground/70' : 'bg-foreground/[0.06] text-foreground/40'}`}>
        {done ? (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500 }}>
            <Sparkles className="w-4 h-4" />
          </motion.div>
        ) : (
          <Target className="w-4 h-4" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium ${done ? 'text-foreground/70 line-through' : 'text-foreground/80'}`}>{challenge.title}</p>
        <p className="text-[11px] text-foreground/40">{challenge.description}</p>
      </div>
      <div className={`flex items-center gap-0.5 text-xs font-mono shrink-0 ${done ? 'text-foreground/40' : 'text-foreground/50'}`}>
        <Zap className="w-3 h-3" />+{challenge.xpReward}
      </div>
    </motion.div>
  )
}

function ToastIcon({ icon: Icon }: { icon: LucideIcon }) {
  return <div className="w-8 h-8 rounded-lg bg-foreground/10 flex items-center justify-center"><Icon className="w-4 h-4 text-foreground/70" /></div>
}

function getToastContent(event: ProgressEvent): { icon: ReactNode; title: string; subtitle: string } {
  switch (event.type) {
    case 'achievement_unlocked':
      return { icon: <span className="text-2xl">{event.achievement.icon}</span>, title: 'Achievement Unlocked!', subtitle: `${event.achievement.name} — +${event.achievement.xpReward} XP` }
    case 'challenge_completed':
      return { icon: <ToastIcon icon={Sparkles} />, title: 'Challenge Complete!', subtitle: `${event.challenge.title} — +${event.challenge.xpReward} XP` }
    case 'level_up':
      return { icon: <ToastIcon icon={Trophy} />, title: 'Level Up!', subtitle: `${event.from} → ${event.to}` }
    case 'streak_milestone':
      return { icon: <ToastIcon icon={Flame} />, title: `${event.days}-Day Streak!`, subtitle: `XP multiplier now ${event.multiplier}x` }
    case 'milestone':
      return { icon: <ToastIcon icon={Star} />, title: event.label, subtitle: `${event.percent}% of the course complete` }
    case 'streak_saved':
      return { icon: <ToastIcon icon={Shield} />, title: 'Streak Saved!', subtitle: event.message }
    case 'first_of_day':
      return { icon: <ToastIcon icon={Zap} />, title: 'Welcome Back!', subtitle: `+${event.bonusXp} XP first lesson bonus` }
    case 'critical_hit':
      return { icon: <ToastIcon icon={Zap} />, title: 'CRITICAL HIT!', subtitle: `Double XP! +${event.totalXp} XP earned` }
    case 'title_unlocked':
      return { icon: <ToastIcon icon={Trophy} />, title: 'Title Unlocked!', subtitle: event.title.name }
  }
}

export function GamificationToasts() {
  useEffect(() => {
    const unsubscribe = onProgressEvent((event: ProgressEvent) => {
      switch (event.type) {
        case 'achievement_unlocked': playSound('achievement'); break
        case 'challenge_completed': playSound('challenge'); break
        case 'level_up': playSound('levelup'); break
        case 'streak_milestone': playSound('combo'); break
        case 'critical_hit': playSound('critical'); break
        default: playSound('xp'); break
      }
      const { icon, title, subtitle } = getToastContent(event)
      toast(
        <div className="flex items-center gap-3">
          {icon}
          <div>
            <p className="font-semibold text-sm">{title}</p>
            <p className="text-xs text-foreground/60">{subtitle}</p>
          </div>
        </div>,
        { duration: event.type === 'level_up' ? 5000 : 4000 }
      )
    })
    return unsubscribe
  }, [])
  return null
}

export function WeeklyProgress() {
  useProgress()
  const stats = getWeeklyStats()
  const diff = stats.thisWeek - stats.lastWeek
  const isUp = diff > 0
  return (
    <div className="rounded-xl border border-foreground/[0.08] bg-foreground/[0.02] p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-mono uppercase tracking-wider text-foreground/40">This Week</h2>
        {diff !== 0 && (
          <div className={`flex items-center gap-1 text-[10px] font-mono ${isUp ? 'text-foreground/60' : 'text-foreground/40'}`}>
            {isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {isUp ? '+' : ''}{diff} XP vs last week
          </div>
        )}
      </div>
      <div className="grid grid-cols-2 gap-3">
        <WeeklyStatCard icon={Zap} label="XP Earned" value={stats.thisWeek} lastWeek={stats.lastWeek} />
        <WeeklyStatCard icon={BookOpen} label="Lessons" value={stats.lessonsThisWeek} lastWeek={stats.lessonsLastWeek} />
      </div>
    </div>
  )
}

function WeeklyStatCard({ icon: Icon, label, value, lastWeek }: { icon: LucideIcon; label: string; value: number; lastWeek: number }) {
  return (
    <div className="p-3 rounded-lg bg-foreground/[0.03] border border-foreground/[0.06]">
      <div className="flex items-center gap-1.5 mb-1">
        <Icon className="w-3 h-3 text-foreground/40" />
        <span className="text-[10px] font-mono text-foreground/30">{label}</span>
      </div>
      <p className="text-xl font-mono font-bold">{value}</p>
      {lastWeek > 0 && (
        <p className="text-[9px] font-mono text-foreground/25 mt-0.5">Last week: {lastWeek}</p>
      )}
    </div>
  )
}

export function XpActivityFeed() {
  useProgress()
  const recent = getXpLog().slice(0, 8)

  return (
    <div className="space-y-3">
      <h2 className="text-sm font-mono uppercase tracking-wider text-foreground/40">XP Activity</h2>
      {recent.length === 0 ? (
        <div className="rounded-xl border border-foreground/[0.08] bg-foreground/[0.02] p-6 text-center">
          <Zap className="w-6 h-6 mx-auto mb-2 text-foreground/15" />
          <p className="text-xs text-foreground/30 font-mono">Complete lessons to see your XP history</p>
        </div>
      ) : (
        <div className="rounded-xl border border-foreground/[0.08] bg-foreground/[0.02] overflow-hidden">
          <AnimatePresence initial={false}>
            {recent.map((event, i) => (
              <XpEventRow key={event.id} event={event} index={i} />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}

function XpEventRow({ event, index }: { event: XpEvent; index: number }) {
  const Icon = event.type === 'lesson' ? BookOpen
    : event.type === 'achievement' ? Trophy
    : event.type === 'challenge' ? Sparkles
    : Zap

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.03 }}
      className="flex items-center gap-3 px-4 py-2.5 border-b border-foreground/[0.04] last:border-b-0"
    >
      <div className="w-6 h-6 rounded-md bg-foreground/[0.06] flex items-center justify-center shrink-0">
        <Icon className="w-3 h-3 text-foreground/50" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-foreground/70 truncate">{event.label}</p>
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-mono text-foreground/30">{formatTimeAgo(event.timestamp)}</span>
          {event.multipliers?.map((m) => (
            <span key={m} className="text-[9px] font-mono px-1 py-0.5 rounded bg-foreground/[0.05] text-foreground/40">
              {m}
            </span>
          ))}
        </div>
      </div>
      <span className="text-xs font-mono font-semibold text-foreground/60 shrink-0">+{event.xp}</span>
    </motion.div>
  )
}

function formatTimeAgo(timestamp: string): string {
  const diff = Date.now() - new Date(timestamp).getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

export function ComboTimer() {
  const progress = useProgress()
  const { count, active } = getComboInfo()
  const [timeLeft, setTimeLeft] = useState<number | null>(null)
  useEffect(() => {
    if (!active || !progress.lastCompletionTime) {
      setTimeLeft(null)
      return
    }

    function tick() {
      const elapsed = Date.now() - (progress.lastCompletionTime || 0)
      const remaining = COMBO_WINDOW_MS - elapsed
      setTimeLeft(remaining <= 0 ? null : remaining)
    }

    tick()
    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [active, progress.lastCompletionTime])

  if (!active || count < 1 || timeLeft === null) return null

  const minutes = Math.floor(timeLeft / 60000)
  const seconds = Math.floor((timeLeft % 60000) / 1000)
  const percent = (timeLeft / COMBO_WINDOW_MS) * 100

  return (
    <motion.div
      className="rounded-xl border border-foreground/[0.08] bg-foreground/[0.02] p-4"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-foreground/60" />
          <span className="text-sm font-medium">
            {count}x Combo Active
          </span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-foreground/10 text-foreground/50">
            +{Math.min((count - 1) * 10, 50)}% bonus
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-mono text-foreground/50">
          <Clock className="w-3 h-3" />
          {minutes}:{seconds.toString().padStart(2, '0')}
        </div>
      </div>
      <div className="relative h-1.5 rounded-full bg-foreground/[0.06] overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full bg-foreground/20"
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
      <p className="text-[10px] text-foreground/30 mt-1.5 font-mono">
        Complete another lesson to extend your combo
      </p>
    </motion.div>
  )
}
