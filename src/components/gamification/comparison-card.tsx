import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { BarChart3, Flame, BookOpen, Zap, Crown } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { useProgress, getOverallProgress } from '@/stores/progress'
import { fetchGlobalStats, type GlobalStats } from '@/lib/stats-api'
import { fetchUserRank } from '@/lib/leaderboard-api'
import { TOTAL_LESSONS } from '@/data/curriculum'

function BarIndicator({ value, max, average }: { value: number; max: number; average: number }) {
  if (max === 0) return null

  const userPercent = Math.min(100, (value / max) * 100)
  const avgPercent = Math.min(100, (average / max) * 100)

  return (
    <div className="relative h-1.5 rounded-full bg-foreground/[0.06] overflow-hidden mt-1.5">
      {/* Average marker */}
      <div
        className="absolute top-0 bottom-0 w-px bg-foreground/20 z-10"
        style={{ left: `${avgPercent}%` }}
      />
      {/* User bar */}
      <motion.div
        className="absolute inset-y-0 left-0 rounded-full bg-foreground/25"
        initial={{ width: 0 }}
        animate={{ width: `${userPercent}%` }}
        transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
      />
    </div>
  )
}

function ComparisonRow({
  icon: Icon,
  label,
  userValue,
  userLabel,
  avgValue,
  avgLabel,
  maxValue,
  badge,
  index,
}: {
  icon: typeof Zap
  label: string
  userValue: number
  userLabel: string
  avgValue: number
  avgLabel: string
  maxValue: number
  badge?: string
  index: number
}) {
  return (
    <motion.div
      className="py-3"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + index * 0.08, duration: 0.35 }}
    >
      <div className="flex items-center justify-between mb-0.5">
        <div className="flex items-center gap-2 min-w-0">
          <Icon className="w-3.5 h-3.5 text-foreground/50 shrink-0" />
          <span className="text-xs font-mono text-foreground/60 truncate">{label}</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {badge && (
            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-foreground/[0.06] text-foreground/50">
              {badge}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-baseline justify-between">
        <span className="text-sm font-mono font-semibold text-foreground/80">
          {userLabel}
        </span>
        <span className="text-[10px] font-mono text-foreground/35">
          avg {avgLabel}
        </span>
      </div>

      <BarIndicator value={userValue} max={maxValue} average={avgValue} />
    </motion.div>
  )
}

function Skeleton() {
  return (
    <div className="rounded-xl border border-foreground/[0.08] bg-foreground/[0.02] p-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-4 h-4 rounded bg-foreground/[0.06] animate-pulse" />
        <div className="h-3 w-28 rounded bg-foreground/[0.06] animate-pulse" />
      </div>
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-1.5">
            <div className="flex justify-between">
              <div className="h-3 w-20 rounded bg-foreground/[0.05] animate-pulse" />
              <div className="h-3 w-16 rounded bg-foreground/[0.04] animate-pulse" />
            </div>
            <div className="h-1.5 rounded-full bg-foreground/[0.04] animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  )
}

export function ComparisonCard() {
  const { user } = useAuth()
  const progress = useProgress()
  const overall = getOverallProgress()

  const [stats, setStats] = useState<GlobalStats | null>(null)
  const [userRank, setUserRank] = useState<number>(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function load() {
      const [globalStats, rank] = await Promise.all([
        fetchGlobalStats(),
        user ? fetchUserRank(user.id) : Promise.resolve(0),
      ])
      if (cancelled) return
      setStats(globalStats)
      setUserRank(rank)
      setLoading(false)
    }

    load()
    return () => { cancelled = true }
  }, [user])

  if (loading) return <Skeleton />

  if (!stats || stats.totalUsers <= 1) {
    return (
      <div className="rounded-xl border border-foreground/[0.08] bg-foreground/[0.02] p-6 text-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="flex items-center justify-center w-12 h-12 rounded-full bg-foreground/[0.04] border border-foreground/[0.08] mx-auto mb-3"
        >
          <BarChart3 className="w-5 h-5 text-foreground/25" />
        </motion.div>
        <p className="text-sm text-foreground/50 mb-1 font-medium">Be the first to set the bar!</p>
        <p className="text-xs text-foreground/30 font-mono">
          Community stats will appear once more learners join.
        </p>
      </div>
    )
  }

  const isAboveAvgXp = progress.totalXp > stats.averageXp
  const isAboveAvgStreak = progress.currentStreak > stats.averageStreak
  const isAboveAvgLessons = overall.completed > Math.round((stats.averageXp / (stats.topXp || 1)) * TOTAL_LESSONS)
  const isNumberOne = userRank === 1

  // Compute percentile: what % of users the user is above (top N%)
  const topPercentile = stats.totalUsers > 0 && userRank > 0
    ? Math.max(1, Math.round((userRank / stats.totalUsers) * 100))
    : null

  // Average lessons estimate: proportional to avg XP vs top XP
  const avgLessonsEstimate = stats.topXp > 0
    ? Math.round((stats.averageXp / stats.topXp) * TOTAL_LESSONS)
    : 0

  const xpBadge = isNumberOne
    ? "You're #1!"
    : topPercentile
      ? `Top ${topPercentile}%`
      : isAboveAvgXp
        ? 'Above average'
        : undefined

  return (
    <div className="rounded-xl border border-foreground/[0.08] bg-foreground/[0.02] p-4">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-foreground/50" />
          <span className="text-[10px] font-mono uppercase tracking-wider text-foreground/40">
            How You Compare
          </span>
        </div>
        {isNumberOne && (
          <motion.div
            className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-foreground/10 border border-foreground/15"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15, delay: 0.3 }}
          >
            <Crown className="w-3 h-3 text-foreground/60" />
            <span className="text-[10px] font-mono font-semibold text-foreground/70">#1</span>
          </motion.div>
        )}
      </div>

      <div className="divide-y divide-foreground/[0.06]">
        <ComparisonRow
          icon={Zap}
          label="Your XP"
          userValue={progress.totalXp}
          userLabel={`${progress.totalXp.toLocaleString()} XP`}
          avgValue={stats.averageXp}
          avgLabel={`${stats.averageXp.toLocaleString()} XP`}
          maxValue={stats.topXp}
          badge={xpBadge}
          index={0}
        />

        <ComparisonRow
          icon={Flame}
          label="Your Streak"
          userValue={progress.currentStreak}
          userLabel={`${progress.currentStreak} days`}
          avgValue={stats.averageStreak}
          avgLabel={`${stats.averageStreak} days`}
          maxValue={stats.topStreak}
          badge={isAboveAvgStreak ? 'Above average' : undefined}
          index={1}
        />

        <ComparisonRow
          icon={BookOpen}
          label="Lessons"
          userValue={overall.completed}
          userLabel={`${overall.completed}/${TOTAL_LESSONS}`}
          avgValue={avgLessonsEstimate}
          avgLabel={`${avgLessonsEstimate}/${TOTAL_LESSONS}`}
          maxValue={TOTAL_LESSONS}
          badge={isAboveAvgLessons ? 'Above average' : undefined}
          index={2}
        />
      </div>

      <div className="mt-2 pt-2 border-t border-foreground/[0.06]">
        <p className="text-[10px] font-mono text-foreground/25 text-center">
          Compared against {stats.totalUsers.toLocaleString()} learner{stats.totalUsers !== 1 ? 's' : ''}
        </p>
      </div>
    </div>
  )
}
