import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Clock, Target, Sparkles, Zap } from 'lucide-react'
import { useProgress, getWeeklyChallenges } from '@/stores/progress'
import type { WeeklyChallenge } from '@/stores/progress'

function useWeeklyCountdown() {
  const [timeLeft, setTimeLeft] = useState(() => {
    const now = new Date()
    const nextMonday = new Date(now)
    const dayOfWeek = now.getDay()
    const daysUntilMonday = dayOfWeek === 0 ? 1 : 8 - dayOfWeek
    nextMonday.setDate(now.getDate() + daysUntilMonday)
    nextMonday.setHours(0, 0, 0, 0)
    return nextMonday.getTime() - now.getTime()
  })

  useEffect(() => {
    function tick() {
      const now = new Date()
      const nextMonday = new Date(now)
      const dayOfWeek = now.getDay()
      const daysUntilMonday = dayOfWeek === 0 ? 1 : 8 - dayOfWeek
      nextMonday.setDate(now.getDate() + daysUntilMonday)
      nextMonday.setHours(0, 0, 0, 0)
      setTimeLeft(nextMonday.getTime() - now.getTime())
    }
    const interval = setInterval(tick, 60000)
    return () => clearInterval(interval)
  }, [])

  const totalHours = Math.max(0, Math.floor(timeLeft / 3600000))
  const days = Math.floor(totalHours / 24)
  const hours = totalHours % 24

  const label = days > 0 ? `Resets in ${days}d ${hours}h` : `Resets in ${hours}h`

  return { label }
}

export function WeeklyChallenges() {
  useProgress()
  const challenges = getWeeklyChallenges()
  const completedCount = challenges.filter((c) => c.completed).length
  const { label: countdownLabel } = useWeeklyCountdown()

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-mono uppercase tracking-wider text-foreground/40">Weekly Challenges</h2>
          <span className="flex items-center gap-1 text-[10px] font-mono text-foreground/30">
            <Clock className="w-3 h-3" />
            {countdownLabel}
          </span>
        </div>
        <span className="text-xs font-mono text-foreground/40">{completedCount}/{challenges.length}</span>
      </div>
      <div className="space-y-2">
        {challenges.map((challenge) => (
          <WeeklyChallengeCard key={challenge.id} challenge={challenge} />
        ))}
      </div>
    </div>
  )
}

function WeeklyChallengeCard({ challenge }: { challenge: WeeklyChallenge }) {
  const done = challenge.completed
  const progressPercent = Math.min(100, Math.round((challenge.progress / challenge.target) * 100))

  return (
    <motion.div
      className={`rounded-xl border p-3.5 transition-all ${done ? 'border-foreground/15 bg-foreground/[0.04]' : 'border-foreground/[0.08] bg-foreground/[0.02]'}`}
      layout
    >
      <div className="flex items-center gap-3">
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
          {!done && (
            <div className="flex items-center gap-2 mt-1.5">
              <div className="relative h-1 flex-1 rounded-full bg-foreground/[0.06] overflow-hidden">
                <motion.div
                  className="absolute inset-y-0 left-0 rounded-full bg-foreground/20"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <span className="text-[9px] font-mono text-foreground/30 shrink-0">
                {challenge.progress}/{challenge.target}
              </span>
            </div>
          )}
        </div>
        <div className={`flex items-center gap-0.5 text-xs font-mono shrink-0 ${done ? 'text-foreground/40' : 'text-foreground/50'}`}>
          <Zap className="w-3 h-3" />+{challenge.xpReward}
        </div>
      </div>
    </motion.div>
  )
}
