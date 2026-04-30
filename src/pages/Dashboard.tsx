import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Lock,
  Check,
  Star,
  Flame,
  Trophy,
  Crown,
  Zap,
  Target,
  Award,
  Play,
  ChevronRight,
} from 'lucide-react'
import { SEO } from '@/components/SEO'
import { VoiceTutorCard } from '@/components/voice-tutor-card'
import { AnimatedNumber } from '@/components/ui/aaa-effects'
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
  getTierProgress,
  getOverallProgress,
} from '@/stores/progress'

function LevelIcon({ levelName, className }: { levelName: string; className?: string }) {
  switch (levelName) {
    case 'Diamond':
      return <Crown className={className} />
    case 'Platinum':
      return <Award className={className} />
    case 'Gold':
      return <Trophy className={className} />
    case 'Silver':
      return <Star className={className} />
    default:
      return <Target className={className} />
  }
}

function StatsBar() {
  const progress = useProgress()
  const level = getLevel()
  const nextLevel = getNextLevel()
  const overall = getOverallProgress()

  const xpIntoLevel = progress.totalXp - level.minXp
  const xpForLevel = nextLevel ? nextLevel.minXp - level.minXp : 1
  const levelPercent = nextLevel
    ? Math.min(100, Math.round((xpIntoLevel / xpForLevel) * 100))
    : 100

  return (
    <div className="space-y-4">
      {/* Top stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl border border-foreground/[0.08] bg-foreground/[0.02] p-4">
          <div className="flex items-center gap-2 mb-2">
            <LevelIcon levelName={level.name} className="w-4 h-4 text-foreground/60" />
            <span className="text-[10px] font-mono uppercase tracking-wider text-foreground/40">Rank</span>
          </div>
          <p className="text-lg font-semibold">{level.name}</p>
        </div>

        <div className="rounded-xl border border-foreground/[0.08] bg-foreground/[0.02] p-4">
          <div className="flex items-center gap-2 mb-2">
            <Flame className="w-4 h-4 text-foreground/60" />
            <span className="text-[10px] font-mono uppercase tracking-wider text-foreground/40">Streak</span>
          </div>
          <p className="text-lg font-mono font-semibold">
            {progress.currentStreak} <span className="text-sm text-foreground/40">days</span>
          </p>
        </div>

        <div className="rounded-xl border border-foreground/[0.08] bg-foreground/[0.02] p-4">
          <div className="flex items-center gap-2 mb-2">
            <Check className="w-4 h-4 text-foreground/60" />
            <span className="text-[10px] font-mono uppercase tracking-wider text-foreground/40">Lessons</span>
          </div>
          <p className="text-lg font-mono font-semibold">
            {overall.completed}<span className="text-sm text-foreground/30">/{TOTAL_LESSONS}</span>
          </p>
        </div>

        <div className="rounded-xl border border-foreground/[0.08] bg-foreground/[0.02] p-4">
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="w-4 h-4 text-foreground/60" />
            <span className="text-[10px] font-mono uppercase tracking-wider text-foreground/40">Achievements</span>
          </div>
          <p className="text-lg font-mono font-semibold">
            {progress.unlockedAchievements.length}<span className="text-sm text-foreground/30">/{ACHIEVEMENTS.length}</span>
          </p>
        </div>
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
            <span
              key={lvl.name}
              className={`text-[9px] font-mono ${
                lvl.name === level.name ? 'text-foreground/70' : 'text-foreground/20'
              }`}
            >
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
    <Link
      to={`/learn/${lesson.id}`}
      className="block rounded-xl border border-foreground/10 bg-foreground/[0.03] hover:bg-foreground/[0.05] hover:border-foreground/15 transition-all p-5 group"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-foreground/10 group-hover:bg-foreground/15 transition-colors">
            {status === 'in_progress' ? (
              <Play className="w-4 h-4 text-foreground/80 ml-0.5" />
            ) : (
              <ChevronRight className="w-4 h-4 text-foreground/80" />
            )}
          </div>
          <div>
            <p className="text-[10px] font-mono text-foreground/40 uppercase tracking-wider mb-0.5">
              {status === 'in_progress' ? 'Continue' : 'Up Next'} — {tier.subtitle || tier.name}
            </p>
            <p className="font-medium text-foreground/90 group-hover:text-foreground transition-colors">
              {lesson.title}
            </p>
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

function TierProgress() {
  return (
    <div className="space-y-3">
      <h2 className="text-sm font-mono uppercase tracking-wider text-foreground/40">
        Progress by Tier
      </h2>

      <div className="space-y-2">
        {CURRICULUM.map((tier) => {
          const tierProgress = getTierProgress(tier.id)
          const isComplete = tierProgress.percent === 100

          return (
            <div
              key={tier.id}
              className="rounded-xl border border-foreground/[0.08] bg-foreground/[0.02] p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {isComplete && <Check className="w-3.5 h-3.5 text-foreground/60" />}
                  <span className="text-sm font-medium">
                    {tier.id === 'prework' ? 'Prework' : `Tier ${tier.number}`}
                  </span>
                  <span className="text-xs text-foreground/40">{tier.subtitle}</span>
                </div>
                <span className="text-xs font-mono text-foreground/50">
                  {tierProgress.completed}/{tierProgress.total}
                </span>
              </div>
              <div className="relative h-1.5 rounded-full bg-foreground/[0.05] overflow-hidden">
                <motion.div
                  className="absolute inset-y-0 left-0 rounded-full bg-foreground/20"
                  initial={{ width: 0 }}
                  animate={{ width: `${tierProgress.percent}%` }}
                  transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
                />
              </div>

              {/* Lesson dots */}
              <div className="flex gap-1 mt-2.5">
                {tier.lessons.map((lesson) => {
                  const status = getLessonStatus(lesson.id)
                  return (
                    <Link
                      key={lesson.id}
                      to={status !== 'locked' ? `/learn/${lesson.id}` : '#'}
                      className={`
                        flex-1 h-1.5 rounded-full transition-colors
                        ${status === 'completed'
                          ? 'bg-foreground/30'
                          : status === 'in_progress'
                            ? 'bg-foreground/15 animate-pulse'
                            : status === 'available'
                              ? 'bg-foreground/10 hover:bg-foreground/15'
                              : 'bg-foreground/[0.04]'
                        }
                      `}
                      title={`${lesson.number} — ${lesson.title}`}
                    />
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

const ACHIEVEMENT_ICONS: Record<string, typeof Target> = {
  'first-lesson': Target,
  'streak-3': Flame,
  'streak-7': Zap,
  'streak-30': Crown,
  'prework-done': Check,
  'tier1-done': Star,
  'tier2-done': Award,
  'tier3-done': Trophy,
  'tier4-done': Crown,
  'speed-learner': Zap,
  'half-way': Star,
  'full-course': Trophy,
}

function AchievementsGrid() {
  const progress = useProgress()

  return (
    <div className="space-y-3">
      <h2 className="text-sm font-mono uppercase tracking-wider text-foreground/40">
        Achievements
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {ACHIEVEMENTS.map((achievement) => {
          const isUnlocked = progress.unlockedAchievements.includes(achievement.id)

          return (
            <div
              key={achievement.id}
              className={`
                rounded-xl border p-3 text-center transition-all
                ${isUnlocked
                  ? 'border-foreground/10 bg-foreground/[0.03]'
                  : 'border-foreground/[0.08] bg-foreground/[0.02]'
                }
              `}
            >
              <div
                className={`
                  mx-auto w-9 h-9 rounded-lg flex items-center justify-center mb-2
                  ${isUnlocked
                    ? 'bg-foreground/10 text-foreground/70'
                    : 'bg-foreground/[0.06] text-foreground/40'
                  }
                `}
              >
                {isUnlocked ? (
                  (() => { const Icon = ACHIEVEMENT_ICONS[achievement.id] || Trophy; return <Icon className="w-5 h-5" /> })()
                ) : (
                  <Lock className="w-4 h-4" />
                )}
              </div>
              <p className={`text-xs font-medium ${isUnlocked ? 'text-foreground/80' : 'text-foreground/50'}`}>
                {isUnlocked ? achievement.name : '???'}
              </p>
              {isUnlocked && (
                <p className="text-[10px] text-foreground/40 mt-0.5">{achievement.description}</p>
              )}
              <div className={`mt-1.5 inline-flex items-center gap-0.5 text-[10px] font-mono ${isUnlocked ? 'text-foreground/40' : 'text-foreground/30'}`}>
                <Zap className="w-2.5 h-2.5" />
                {achievement.xpReward} XP
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function StreakCalendar() {
  const progress = useProgress()

  const days = useMemo(() => {
    const result: { date: string; active: boolean }[] = []
    const now = new Date()
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now)
      d.setDate(d.getDate() - i)
      const dateStr = d.toISOString().split('T')[0]
      result.push({
        date: dateStr,
        active: progress.streakDates.includes(dateStr),
      })
    }
    return result
  }, [progress.streakDates])

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-mono uppercase tracking-wider text-foreground/40">
          Activity — Last 30 Days
        </h2>
        <div className="flex items-center gap-1.5">
          <Flame className="w-3.5 h-3.5 text-foreground/50" />
          <span className="text-sm font-mono font-semibold">{progress.currentStreak}</span>
          <span className="text-[10px] text-foreground/40 font-mono">day streak</span>
        </div>
      </div>

      <div className="rounded-xl border border-foreground/[0.08] bg-foreground/[0.02] p-4">
        <div className="grid grid-cols-10 gap-[3px]">
          {days.map((day) => (
            <div
              key={day.date}
              className={`
                aspect-square rounded-[3px] transition-colors
                ${day.active
                  ? 'bg-foreground/25 border border-foreground/30'
                  : 'bg-foreground/[0.04] border border-foreground/[0.06]'
                }
              `}
              title={`${day.date}${day.active ? ' — Active' : ''}`}
            />
          ))}
        </div>
        <div className="flex items-center gap-2 mt-3 justify-end">
          <span className="text-[9px] font-mono text-foreground/25">Less</span>
          <div className="flex gap-1">
            {['bg-foreground/[0.04]', 'bg-foreground/10', 'bg-foreground/[0.18]', 'bg-foreground/25'].map((cls, i) => (
              <div key={i} className={`w-[8px] h-[8px] rounded-[2px] ${cls} border border-foreground/[0.08]`} />
            ))}
          </div>
          <span className="text-[9px] font-mono text-foreground/25">More</span>
        </div>
      </div>
    </div>
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

      <div className="p-6 lg:p-8 max-w-4xl space-y-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-1">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Track your progress and pick up where you left off.</p>
        </div>

        <NextLesson />
        <VoiceTutorCard />
        <StatsBar />
        <TierProgress />
        <StreakCalendar />
        <AchievementsGrid />
      </div>
    </>
  )
}
