import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Check,
  Flame,
  Trophy,
  Zap,
  Target,
  Play,
  ChevronRight,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { SEO } from '@/components/SEO'
import { VoiceTutorCard } from '@/components/voice-tutor-card'
import { AnimatedNumber } from '@/components/ui/aaa-effects'
import {
  StreakMultiplierBadge,
  DailyXpGoal,
  DailyChallenges,
  GamificationToasts,
  WeeklyProgress,
  XpActivityFeed,
  ComboTimer,
} from '@/components/gamification'
import { ShareButton } from '@/components/gamification/share-button'
import { ExplorerProgress } from '@/components/gamification/explorer-progress'
import { UnlockablesGrid } from '@/components/gamification/unlockables-grid'
import { CelebrationModal } from '@/components/gamification/celebration-modal'
import { StatCard } from '@/components/gamification/shared'
import { AchievementsGrid } from '@/components/gamification/achievements-grid'
import { StreakCalendar } from '@/components/gamification/streak-calendar'
import { TierProgress } from '@/components/gamification/tier-progress'
import { ToolMastery } from '@/components/gamification/tool-mastery'
import {
  CURRICULUM,
  ACHIEVEMENTS,
  TOTAL_XP,
  TOTAL_LESSONS,
  XP_LEVELS,
} from '@/data/curriculum'
import {
  useProgress,
  getLessonStatus,
  getLevel,
  getNextLevel,
  getOverallProgress,
  getStreakMultiplier,
} from '@/stores/progress'

function StatsBar() {
  const progress = useProgress()
  const level = getLevel()
  const nextLevel = getNextLevel()
  const overall = getOverallProgress()
  const streakInfo = getStreakMultiplier()

  const xpIntoLevel = progress.totalXp - level.minXp
  const xpForLevel = nextLevel ? nextLevel.minXp - level.minXp : 1
  const levelPercent = nextLevel
    ? Math.min(100, Math.round((xpIntoLevel / xpForLevel) * 100))
    : 100

  const stats: { icon: LucideIcon; label: string; content: React.ReactNode }[] = [
    { icon: Target, label: 'Rank', content: <p className="text-lg font-semibold">{level.name}</p> },
    { icon: Flame, label: 'Streak', content: <div className="flex items-center gap-2"><p className="text-lg font-mono font-semibold">{progress.currentStreak} <span className="text-sm text-foreground/40">days</span></p><StreakMultiplierBadge /></div> },
    { icon: Check, label: 'Lessons', content: <p className="text-lg font-mono font-semibold">{overall.completed}<span className="text-sm text-foreground/30">/{TOTAL_LESSONS}</span></p> },
    { icon: Trophy, label: 'Achievements', content: <p className="text-lg font-mono font-semibold">{progress.unlockedAchievements.length}<span className="text-sm text-foreground/30">/{ACHIEVEMENTS.length}</span></p> },
  ]

  return (
    <div className="space-y-4">
      {/* Top stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map((s) => <StatCard key={s.label} icon={s.icon} label={s.label}>{s.content}</StatCard>)}
      </div>

      {/* XP Progress */}
      <div className="rounded-xl border border-foreground/[0.08] bg-foreground/[0.02] p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-foreground/60" />
            <span className="font-mono text-sm font-semibold">
              <AnimatedNumber value={progress.totalXp} />
              <span className="text-foreground/30"> / {TOTAL_XP} XP</span>
            </span>
            {streakInfo.multiplier > 1 && (
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-foreground/10 text-foreground/50">
                {streakInfo.label} bonus
              </span>
            )}
          </div>
          {nextLevel && (
            <span className="text-xs font-mono text-foreground/40">
              {nextLevel.minXp - progress.totalXp} to {nextLevel.name}
            </span>
          )}
        </div>
        <div className="relative h-2 rounded-full bg-foreground/[0.05] overflow-hidden">
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full bg-foreground/25"
            initial={{ width: 0 }}
            animate={{ width: `${levelPercent}%` }}
            transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
          />
        </div>
        <div className="flex justify-between mt-1.5">
          {XP_LEVELS.map((lvl) => (
            <span key={lvl.name} className={`text-[9px] font-mono ${lvl.name === level.name ? 'text-foreground/70' : 'text-foreground/20'}`}>
              {lvl.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

function NextLesson() {
  useProgress()

  const nextLesson = (() => {
    for (const tier of CURRICULUM) {
      for (const lesson of tier.lessons) {
        const status = getLessonStatus(lesson.id)
        if (status === 'in_progress' || status === 'available') {
          return { lesson, tier, status }
        }
      }
    }
    return null
  })()

  if (!nextLesson) return null

  const { lesson, tier, status } = nextLesson

  return (
    <Link to={`/course/learn/${lesson.id}`} className="block rounded-xl border border-foreground/10 bg-foreground/[0.03] hover:bg-foreground/[0.05] hover:border-foreground/15 transition-all p-5 group">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-foreground/10 group-hover:bg-foreground/15 transition-colors">
            {status === 'in_progress' ? <Play className="w-4 h-4 text-foreground/80 ml-0.5" /> : <ChevronRight className="w-4 h-4 text-foreground/80" />}
          </div>
          <div>
            <p className="text-[10px] font-mono text-foreground/40 uppercase tracking-wider mb-0.5">
              {status === 'in_progress' ? 'Continue' : 'Up Next'} — {tier.subtitle || tier.name}
            </p>
            <p className="font-medium text-foreground/90 group-hover:text-foreground transition-colors">{lesson.title}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-xs text-foreground/40 shrink-0">
          <span className="font-mono">{lesson.duration}m</span>
          <span className="font-mono">+{lesson.xp} XP</span>
        </div>
      </div>
    </Link>
  )
}

export default function Dashboard() {
  return (
    <>
      <SEO
        title="Dashboard"
        description="Track your progress through The Agentic SaaS Course."
        path="dashboard"
        keywords="dashboard, progress, learning, agentic saas course"
      />
      <GamificationToasts />
      <CelebrationModal />

      <div className="p-6 lg:p-8 max-w-4xl space-y-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight mb-1">Dashboard</h1>
            <p className="text-sm text-muted-foreground">Track your progress and pick up where you left off.</p>
          </div>
          <ShareButton />
        </div>

        <NextLesson />
        <ComboTimer />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DailyXpGoal />
          <WeeklyProgress />
        </div>
        <StatsBar />
        <DailyChallenges />
        <TierProgress />
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-6">
          <StreakCalendar />
          <XpActivityFeed />
        </div>
        <ToolMastery />
        <ExplorerProgress />
        <AchievementsGrid />
        <UnlockablesGrid compact />
        <VoiceTutorCard />
      </div>
    </>
  )
}
