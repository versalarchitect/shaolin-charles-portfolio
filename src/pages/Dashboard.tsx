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
} from 'lucide-react'
import { SEO } from '@/components/SEO'
import {
  BlurFadeIn,
  ScrollFadeIn,
  AnimatedNumber,
  StaggerContainer,
  staggerItemVariants,
  SpotlightCard,
} from '@/components/ui/aaa-effects'
import { SectionSpots, Section } from '@/components/ui/gradient-background'
import {
  CURRICULUM,
  ACHIEVEMENTS,
  TOTAL_XP,
  TOTAL_LESSONS,
  XP_LEVELS,
} from '@/data/curriculum'
import type { Lesson, LessonStatus } from '@/data/curriculum'
import {
  useProgress,
  getLessonStatus,
  getLevel,
  getNextLevel,
  getTierProgress,
  getOverallProgress,
} from '@/stores/progress'

// ============================================================================
// HELPER: Level icon mapping
// ============================================================================
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

// ============================================================================
// SECTION 1: Hero Stats Bar
// ============================================================================
function HeroStatsBar() {
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
    <Section id="dashboard-hero" className="pt-28 pb-12 lg:pt-32 lg:pb-16 px-6 lg:px-8">
      <SectionSpots variant="hero" />
      <div className="relative max-w-5xl mx-auto">
        <BlurFadeIn>
          <div className="flex flex-col gap-6">
            {/* Top row: Level badge + streak */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-foreground/[0.05] border border-foreground/10">
                  <LevelIcon levelName={level.name} className="w-6 h-6 text-foreground/80" />
                </div>
                <div>
                  <p className="text-xs font-mono uppercase tracking-widest text-foreground/40">
                    Current Rank
                  </p>
                  <p className="text-xl font-semibold tracking-tight">{level.name}</p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                {/* Streak */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-foreground/[0.05] border border-foreground/10">
                    <Flame className="w-5 h-5 text-foreground/70" />
                  </div>
                  <div>
                    <p className="text-lg font-mono font-semibold leading-none">
                      {progress.currentStreak}
                    </p>
                    <p className="text-xs text-foreground/40 font-mono">streak</p>
                  </div>
                </div>

                {/* Completion */}
                <div className="hidden sm:flex items-center gap-2">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-foreground/[0.05] border border-foreground/10">
                    <Target className="w-5 h-5 text-foreground/70" />
                  </div>
                  <div>
                    <p className="text-lg font-mono font-semibold leading-none">
                      {overall.percent}%
                    </p>
                    <p className="text-xs text-foreground/40 font-mono">complete</p>
                  </div>
                </div>
              </div>
            </div>

            {/* XP Progress Bar */}
            <div className="rounded-2xl border border-foreground/[0.08] bg-foreground/[0.02] p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-baseline gap-2">
                  <Zap className="w-4 h-4 text-foreground/60 relative top-0.5" />
                  <span className="font-mono text-2xl font-bold">
                    <AnimatedNumber value={progress.totalXp} />
                  </span>
                  <span className="text-sm text-foreground/40 font-mono">
                    / {TOTAL_XP} XP
                  </span>
                </div>
                {nextLevel && (
                  <span className="text-xs font-mono text-foreground/40">
                    {nextLevel.minXp - progress.totalXp} XP to {nextLevel.name}
                  </span>
                )}
              </div>

              {/* Progress bar */}
              <div className="relative h-3 rounded-full bg-foreground/[0.05] overflow-hidden">
                <motion.div
                  className="absolute inset-y-0 left-0 rounded-full bg-foreground/20"
                  initial={{ width: 0 }}
                  animate={{ width: `${levelPercent}%` }}
                  transition={{ duration: 1, ease: [0.33, 1, 0.68, 1], delay: 0.3 }}
                />
                <motion.div
                  className="absolute inset-y-0 left-0 rounded-full bg-foreground/40"
                  initial={{ width: 0 }}
                  animate={{ width: `${levelPercent}%` }}
                  transition={{ duration: 1.2, ease: [0.33, 1, 0.68, 1], delay: 0.3 }}
                  style={{ opacity: 0.5 }}
                />
              </div>

              {/* Level markers */}
              <div className="flex justify-between mt-2">
                {XP_LEVELS.map((lvl) => (
                  <span
                    key={lvl.name}
                    className={`text-[10px] font-mono ${
                      lvl.name === level.name
                        ? 'text-foreground/80'
                        : 'text-foreground/25'
                    }`}
                  >
                    {lvl.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Quick stats row */}
            <div className="grid grid-cols-3 gap-3">
              {[
                {
                  label: 'Lessons Done',
                  value: overall.completed,
                  total: TOTAL_LESSONS,
                  icon: <Check className="w-4 h-4" />,
                },
                {
                  label: 'Total XP',
                  value: progress.totalXp,
                  total: TOTAL_XP,
                  icon: <Zap className="w-4 h-4" />,
                },
                {
                  label: 'Achievements',
                  value: progress.unlockedAchievements.length,
                  total: ACHIEVEMENTS.length,
                  icon: <Trophy className="w-4 h-4" />,
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl border border-foreground/[0.08] bg-foreground/[0.02] p-4 text-center"
                >
                  <div className="flex items-center justify-center gap-1.5 text-foreground/50 mb-1">
                    {stat.icon}
                    <span className="text-[10px] font-mono uppercase tracking-wider">
                      {stat.label}
                    </span>
                  </div>
                  <p className="font-mono text-xl font-bold">
                    <AnimatedNumber value={stat.value} />
                    <span className="text-foreground/30 text-sm">/{stat.total}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        </BlurFadeIn>
      </div>
    </Section>
  )
}

// ============================================================================
// SECTION 2: Skill Path (Duolingo-style snaking path)
// ============================================================================

function LessonNode({
  lesson,
  status,
  index,
  isCapstone,
}: {
  lesson: Lesson
  status: LessonStatus
  index: number
  isCapstone: boolean
}) {
  const nodeSize = isCapstone ? 'w-20 h-20' : 'w-14 h-14'
  const iconSize = isCapstone ? 'w-7 h-7' : 'w-5 h-5'

  const nodeContent = (
    <motion.div
      className="relative flex flex-col items-center group"
      variants={staggerItemVariants}
    >
      {/* Connector line from previous node */}
      {index > 0 && (
        <div
          className={`absolute -top-10 left-1/2 -translate-x-1/2 w-px h-10 ${
            status === 'locked'
              ? 'bg-gradient-to-b from-foreground/[0.06] to-foreground/[0.03]'
              : 'bg-gradient-to-b from-foreground/15 to-foreground/10'
          }`}
        />
      )}

      {/* Node circle */}
      <div className="relative">
        {/* Pulsing glow for available lessons */}
        {status === 'available' && (
          <motion.div
            className={`absolute inset-0 rounded-full bg-foreground/10 ${nodeSize}`}
            animate={{
              scale: [1, 1.4, 1],
              opacity: [0.3, 0, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        )}

        {/* Animated border for in-progress */}
        {status === 'in_progress' && (
          <motion.div
            className={`absolute -inset-0.5 rounded-full`}
            style={{
              background:
                'conic-gradient(from 0deg, rgba(255,255,255,0.3), rgba(255,255,255,0.05), rgba(255,255,255,0.3))',
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          />
        )}

        <div
          className={`
            relative ${nodeSize} rounded-full flex items-center justify-center
            transition-all duration-300 border-2
            ${
              status === 'completed'
                ? 'bg-foreground/15 border-foreground/30 text-foreground'
                : status === 'in_progress'
                  ? 'bg-foreground/[0.08] border-foreground/20 text-foreground/80'
                  : status === 'available'
                    ? 'bg-foreground/[0.04] border-foreground/15 text-foreground/70 hover:bg-foreground/[0.08] hover:border-foreground/25 cursor-pointer'
                    : 'bg-foreground/[0.02] border-foreground/[0.06] text-foreground/20'
            }
          `}
        >
          {status === 'completed' ? (
            isCapstone ? (
              <Crown className={iconSize} />
            ) : (
              <Check className={iconSize} />
            )
          ) : status === 'locked' ? (
            <Lock className={iconSize} />
          ) : isCapstone ? (
            <Star className={iconSize} />
          ) : (
            <span className="font-mono text-sm font-semibold">{lesson.number}</span>
          )}
        </div>

        {/* XP badge for completed lessons */}
        {status === 'completed' && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-foreground/10 border border-foreground/15"
          >
            <Zap className="w-2.5 h-2.5 text-foreground/60" />
            <span className="text-[9px] font-mono font-bold text-foreground/70">
              {lesson.xp}
            </span>
          </motion.div>
        )}
      </div>

      {/* Label */}
      <div className="mt-2 text-center max-w-[120px]">
        <p
          className={`text-xs font-medium leading-tight ${
            status === 'locked' ? 'text-foreground/20' : 'text-foreground/60'
          }`}
        >
          {lesson.title}
        </p>
        {status !== 'completed' && status !== 'locked' && (
          <p className="text-[10px] font-mono text-foreground/30 mt-0.5">
            {lesson.xp} XP
          </p>
        )}
      </div>
    </motion.div>
  )

  if (status === 'available' || status === 'in_progress') {
    return (
      <Link to={`/learn/${lesson.id}`} className="block">
        {nodeContent}
      </Link>
    )
  }

  return nodeContent
}

function TierPath({ tierIndex }: { tierIndex: number }) {
  const tier = CURRICULUM[tierIndex]
  const tierProgress = getTierProgress(tier.id)

  return (
    <ScrollFadeIn delay={tierIndex * 0.15}>
      <div className="relative">
        {/* Tier header card */}
        <div className="relative rounded-2xl border border-foreground/[0.08] bg-foreground/[0.02] p-6 mb-8 overflow-hidden">
          {/* Large watermark number */}
          <div className="absolute -right-4 -top-4 text-[120px] font-bold leading-none text-foreground/[0.02] select-none pointer-events-none">
            {tier.number}
          </div>

          <div className="relative">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-[10px] font-mono uppercase tracking-widest text-foreground/40 mb-1">
                  Tier {tier.number}
                </p>
                <h3 className="text-lg font-semibold tracking-tight">{tier.name}</h3>
                <p className="text-sm text-foreground/50 mt-0.5">{tier.subtitle}</p>
              </div>
              <div className="text-right">
                <p className="font-mono text-sm font-semibold">
                  {tierProgress.completed}
                  <span className="text-foreground/30">/{tierProgress.total}</span>
                </p>
                <p className="text-[10px] font-mono text-foreground/40">lessons</p>
              </div>
            </div>

            {/* Tier progress bar */}
            <div className="relative h-1.5 rounded-full bg-foreground/[0.05] overflow-hidden">
              <motion.div
                className="absolute inset-y-0 left-0 rounded-full bg-foreground/25"
                initial={{ width: 0 }}
                animate={{ width: `${tierProgress.percent}%` }}
                transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1], delay: 0.2 }}
              />
            </div>
          </div>
        </div>

        {/* Snaking lesson path */}
        <StaggerContainer
          className="relative flex flex-col items-center pb-12"
          staggerDelay={0.08}
          delayStart={tierIndex * 0.1}
        >
          {tier.lessons.map((lesson, lessonIndex) => {
            const status = getLessonStatus(lesson.id)

            // Compute horizontal offset for snaking: alternate left/right
            // 0 = center, odd = left, even = right (after first)
            const snakeOffset =
              lessonIndex === 0
                ? 0
                : lessonIndex % 2 === 1
                  ? -80
                  : 80

            return (
              <motion.div
                key={lesson.id}
                className="relative"
                style={{
                  marginTop: lessonIndex === 0 ? 0 : 40,
                  transform: `translateX(${snakeOffset}px)`,
                }}
                variants={staggerItemVariants}
              >
                {/* Curved connector line between offset nodes */}
                {lessonIndex > 0 && (
                  <svg
                    className="absolute pointer-events-none"
                    style={{
                      top: -40,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: 200,
                      height: 40,
                    }}
                    viewBox="0 0 200 40"
                    fill="none"
                    preserveAspectRatio="none"
                  >
                    <path
                      d={
                        snakeOffset > 0
                          ? 'M 20 0 C 20 20, 180 20, 180 40'
                          : snakeOffset < 0
                            ? 'M 180 0 C 180 20, 20 20, 20 40'
                            : 'M 100 0 L 100 40'
                      }
                      stroke={
                        status === 'locked'
                          ? 'rgba(255,255,255,0.04)'
                          : 'rgba(255,255,255,0.1)'
                      }
                      strokeWidth="1.5"
                      strokeDasharray={status === 'locked' ? '4 4' : 'none'}
                    />
                  </svg>
                )}
                <LessonNode
                  lesson={lesson}
                  status={status}
                  index={lessonIndex}
                  isCapstone={lesson.isCapstone}
                />
              </motion.div>
            )
          })}
        </StaggerContainer>
      </div>
    </ScrollFadeIn>
  )
}

function SkillPath() {
  return (
    <Section id="dashboard-path" className="py-16 lg:py-24 px-6 lg:px-8">
      <SectionSpots variant="default" />
      <div className="relative max-w-2xl mx-auto">
        <ScrollFadeIn>
          <div className="text-center mb-12">
            <p className="text-xs font-mono uppercase tracking-widest text-foreground/40 mb-2">
              Your Learning Path
            </p>
            <h2 className="text-3xl font-semibold tracking-tight">Skill Path</h2>
            <p className="text-foreground/50 mt-2 max-w-md mx-auto text-sm">
              Complete lessons in order. Each unlocks the next. Capstone projects prove
              mastery.
            </p>
          </div>
        </ScrollFadeIn>

        {CURRICULUM.map((_, tierIndex) => (
          <TierPath key={CURRICULUM[tierIndex].id} tierIndex={tierIndex} />
        ))}
      </div>
    </Section>
  )
}

// ============================================================================
// SECTION 3: Achievements
// ============================================================================
function AchievementsSection() {
  const progress = useProgress()

  const achievementIconMap: Record<string, React.ReactNode> = {
    'first-lesson': <Target className="w-6 h-6" />,
    'streak-3': <Flame className="w-6 h-6" />,
    'streak-7': <Zap className="w-6 h-6" />,
    'streak-30': <Crown className="w-6 h-6" />,
    'prework-done': <Check className="w-6 h-6" />,
    'tier1-done': <Star className="w-6 h-6" />,
    'tier2-done': <Award className="w-6 h-6" />,
    'tier3-done': <Trophy className="w-6 h-6" />,
    'tier4-done': <Crown className="w-6 h-6" />,
    'speed-learner': <Zap className="w-6 h-6" />,
    'half-way': <Star className="w-6 h-6" />,
    'full-course': <Trophy className="w-6 h-6" />,
  }

  return (
    <Section id="dashboard-achievements" className="py-16 lg:py-24 px-6 lg:px-8">
      <SectionSpots variant="accent" />
      <div className="relative max-w-5xl mx-auto">
        <ScrollFadeIn>
          <div className="text-center mb-10">
            <p className="text-xs font-mono uppercase tracking-widest text-foreground/40 mb-2">
              Milestones
            </p>
            <h2 className="text-3xl font-semibold tracking-tight">Achievements</h2>
          </div>
        </ScrollFadeIn>

        <StaggerContainer
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3"
          staggerDelay={0.05}
        >
          {ACHIEVEMENTS.map((achievement) => {
            const isUnlocked = progress.unlockedAchievements.includes(achievement.id)

            return (
              <motion.div key={achievement.id} variants={staggerItemVariants}>
                <SpotlightCard
                  className={`
                    relative rounded-xl border p-4 text-center transition-all
                    ${
                      isUnlocked
                        ? 'border-foreground/15 bg-foreground/[0.04]'
                        : 'border-foreground/[0.06] bg-foreground/[0.01] opacity-50'
                    }
                  `}
                >
                  <div className="relative z-10">
                    <div
                      className={`
                        mx-auto w-12 h-12 rounded-xl flex items-center justify-center mb-3
                        ${
                          isUnlocked
                            ? 'bg-foreground/10 text-foreground/80'
                            : 'bg-foreground/[0.04] text-foreground/20'
                        }
                      `}
                    >
                      {isUnlocked ? (
                        achievementIconMap[achievement.id] || (
                          <Trophy className="w-6 h-6" />
                        )
                      ) : (
                        <Lock className="w-5 h-5" />
                      )}
                    </div>
                    <p
                      className={`text-sm font-medium ${
                        isUnlocked ? 'text-foreground/80' : 'text-foreground/30'
                      }`}
                    >
                      {isUnlocked ? achievement.name : '???'}
                    </p>
                    {isUnlocked && (
                      <p className="text-[10px] text-foreground/40 mt-0.5">
                        {achievement.description}
                      </p>
                    )}
                    <div
                      className={`
                        mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono
                        ${
                          isUnlocked
                            ? 'bg-foreground/[0.05] text-foreground/50'
                            : 'bg-foreground/[0.02] text-foreground/20'
                        }
                      `}
                    >
                      <Zap className="w-2.5 h-2.5" />
                      {achievement.xpReward} XP
                    </div>
                  </div>
                </SpotlightCard>
              </motion.div>
            )
          })}
        </StaggerContainer>
      </div>
    </Section>
  )
}

// ============================================================================
// SECTION 4: Streak Calendar (GitHub-style contribution graph)
// ============================================================================
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

  const dayLabels = ['Mon', 'Wed', 'Fri']

  return (
    <Section id="dashboard-streak" className="py-16 lg:py-24 px-6 lg:px-8">
      <SectionSpots variant="subtle" />
      <div className="relative max-w-2xl mx-auto">
        <ScrollFadeIn>
          <div className="rounded-2xl border border-foreground/[0.08] bg-foreground/[0.02] p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-xs font-mono uppercase tracking-widest text-foreground/40 mb-1">
                  Activity
                </p>
                <h3 className="text-lg font-semibold tracking-tight">
                  Last 30 Days
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-foreground/50" />
                <span className="font-mono text-lg font-bold">
                  {progress.currentStreak}
                </span>
                <span className="text-xs text-foreground/40 font-mono">day streak</span>
              </div>
            </div>

            {/* Calendar grid */}
            <div className="flex gap-1.5 items-end">
              {/* Day labels */}
              <div className="flex flex-col gap-1.5 mr-1 shrink-0">
                {dayLabels.map((label) => (
                  <span
                    key={label}
                    className="text-[9px] font-mono text-foreground/25 h-[14px] flex items-center"
                  >
                    {label}
                  </span>
                ))}
              </div>

              {/* Grid of day squares */}
              <div className="flex gap-[3px] flex-wrap">
                {days.map((day) => (
                  <motion.div
                    key={day.date}
                    className={`
                      w-[14px] h-[14px] rounded-[3px] transition-colors
                      ${
                        day.active
                          ? 'bg-foreground/25 border border-foreground/30'
                          : 'bg-foreground/[0.04] border border-foreground/[0.06]'
                      }
                    `}
                    title={`${day.date}${day.active ? ' - Active' : ''}`}
                    whileHover={{ scale: 1.3 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                  />
                ))}
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-3 mt-4 justify-end">
              <span className="text-[9px] font-mono text-foreground/30">Less</span>
              <div className="flex gap-1">
                {[0.04, 0.08, 0.15, 0.25].map((opacity, i) => (
                  <div
                    key={i}
                    className="w-[10px] h-[10px] rounded-[2px]"
                    style={{
                      backgroundColor: `rgba(255, 255, 255, ${opacity})`,
                      border: `1px solid rgba(255, 255, 255, ${opacity + 0.04})`,
                    }}
                  />
                ))}
              </div>
              <span className="text-[9px] font-mono text-foreground/30">More</span>
            </div>
          </div>
        </ScrollFadeIn>
      </div>
    </Section>
  )
}

// ============================================================================
// MAIN DASHBOARD PAGE
// ============================================================================
export default function Dashboard() {
  return (
    <>
      <SEO
        title="Dashboard"
        description="Track your progress through The Agentic SaaS Course. Complete lessons, earn XP, and unlock achievements."
        path="dashboard"
        keywords="dashboard, progress, learning, agentic saas course"
      />

      <div className="min-h-screen">
        <HeroStatsBar />
        <SkillPath />
        <AchievementsSection />
        <StreakCalendar />

        {/* Bottom spacer */}
        <div className="h-16" />
      </div>
    </>
  )
}
