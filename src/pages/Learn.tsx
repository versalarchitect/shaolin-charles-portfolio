import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  Clock,
  Zap,
  Target,
  Check,
  Lock,
  ChevronRight,
  Award,
} from 'lucide-react'
import { SEO } from '@/components/SEO'
import { Button } from '@/components/ui/button'
import { LessonPlayer } from '@/components/lesson-player'
import { CURRICULUM, ALL_LESSONS, TOTAL_LESSONS } from '@/data/curriculum'
import type { Lesson } from '@/data/curriculum'
import { useProgress, getLessonStatus, completeLesson, startLesson, getStreakMultiplier, getComboInfo, getLevel, getNextLevel, getOverallProgress } from '@/stores/progress'
import { useBookmarks, toggleBookmark, isBookmarked } from '@/stores/bookmarks'
import { GamificationToasts, ComboIndicator, ComboTimer } from '@/components/gamification'
import { CelebrationParticles } from '@/components/gamification/celebration'
import { StatusBadge } from '@/components/gamification/shared'
import { LessonRating } from '@/components/gamification/lesson-rating'
import { getMotivationalMessage } from '@/lib/motivational'
import { supabase } from '@/lib/supabase'
import { useAccessTier, canAccessLesson } from '@/stores/access'

function findLessonAndTier(lessonId: string) {
  for (const tier of CURRICULUM) {
    const lessonIndex = tier.lessons.findIndex((l) => l.id === lessonId)
    if (lessonIndex !== -1) {
      return { tier, lesson: tier.lessons[lessonIndex], lessonIndex }
    }
  }
  return null
}

function getAdjacentLessons(lessonId: string) {
  const globalIndex = ALL_LESSONS.findIndex((l) => l.id === lessonId)
  const prev = globalIndex > 0 ? ALL_LESSONS[globalIndex - 1] : null
  const next = globalIndex < ALL_LESSONS.length - 1 ? ALL_LESSONS[globalIndex + 1] : null
  return { prev, next, globalIndex }
}

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m > 0 ? `${h}h ${m}m` : `${h}h`
}



function LessonNavCard({ lesson, direction, disabled }: { lesson: Lesson | null; direction: 'prev' | 'next'; disabled?: boolean }) {
  const { t } = useTranslation()
  const isPrev = direction === 'prev'
  const Arrow = isPrev ? ArrowLeft : ArrowRight

  if (!lesson) {
    return (
      <div className="rounded-xl bg-foreground/[0.01] border border-foreground/[0.05] p-4 opacity-40">
        <div className={`flex items-center ${isPrev ? '' : 'justify-end'} gap-3`}>
          {isPrev && <Arrow className="w-4 h-4 text-foreground/30 shrink-0" />}
          <div className={isPrev ? '' : 'text-right'}>
            <p className="text-[10px] font-mono text-foreground/30 mb-0.5">{isPrev ? t('learn.previous') : t('learn.next')}</p>
            <p className="text-sm text-foreground/30">{isPrev ? t('learn.firstLesson') : t('learn.courseCompleteNav')}</p>
          </div>
          {!isPrev && <Arrow className="w-4 h-4 text-foreground/30 shrink-0" />}
        </div>
      </div>
    )
  }

  if (disabled) {
    return (
      <div className="rounded-xl bg-foreground/[0.01] border border-foreground/[0.05] p-4 opacity-40">
        <div className="flex items-center justify-end gap-3">
          <div className="text-right min-w-0">
            <p className="text-[10px] font-mono text-foreground/30 mb-0.5">{t('learn.next')}</p>
            <p className="text-sm text-foreground/30 truncate"><Lock className="w-3 h-3 inline mr-1" />{lesson.title}</p>
          </div>
          <ArrowRight className="w-4 h-4 text-foreground/30 shrink-0" />
        </div>
      </div>
    )
  }

  return (
    <Link to={`/course/learn/${lesson.id}/1`} className="group rounded-xl bg-foreground/[0.02] border border-foreground/[0.08] p-4 hover:bg-foreground/[0.04] hover:border-foreground/15 transition-all">
      <div className={`flex items-center ${isPrev ? '' : 'justify-end'} gap-3`}>
        {isPrev && <Arrow className="w-4 h-4 text-foreground/40 group-hover:text-foreground/70 group-hover:-translate-x-1 transition-all shrink-0" />}
        <div className={`min-w-0 ${isPrev ? '' : 'text-right'}`}>
          <p className="text-[10px] font-mono text-foreground/40 mb-0.5">{isPrev ? t('learn.previous') : t('learn.next')}</p>
          <p className="text-sm font-medium text-foreground/70 group-hover:text-foreground/90 truncate transition-colors">
            {isPrev ? <><span className="font-mono text-foreground/40 mr-1">{lesson.number}</span>{lesson.title}</> : <>{lesson.title}<span className="font-mono text-foreground/40 ml-1">{lesson.number}</span></>}
          </p>
        </div>
        {!isPrev && <Arrow className="w-4 h-4 text-foreground/40 group-hover:text-foreground/70 group-hover:translate-x-1 transition-all shrink-0" />}
      </div>
    </Link>
  )
}

function LockedState({ lessonTitle }: { lessonTitle: string }) {
  const { t } = useTranslation()
  return (
    <div className="p-6 lg:p-8 max-w-2xl mx-auto">
      <div className="text-center space-y-6 py-24">
        <motion.div
          className="mx-auto flex items-center justify-center w-16 h-16 rounded-2xl bg-foreground/5 border border-foreground/10"
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Lock className="w-7 h-7 text-foreground/40" />
        </motion.div>
        <h1 className="text-2xl font-bold">{t('learn.lessonLocked')}</h1>
        <p className="text-foreground/60 leading-relaxed max-w-md mx-auto">
          {t('learn.completePrevious')}{' '}
          <span className="text-foreground/80 font-medium">"{lessonTitle}"</span>.
        </p>
        <Link to="/course/dashboard">
          <Button variant="outline" className="gap-2 font-mono">
            <ArrowLeft className="w-4 h-4" />
            {t('learn.backToDashboard')}
          </Button>
        </Link>
      </div>
    </div>
  )
}

function TierRequiredState({ lessonTitle }: { lessonTitle: string }) {
  const { t } = useTranslation()
  return (
    <div className="p-6 lg:p-8 max-w-2xl mx-auto">
      <div className="text-center space-y-6 py-24">
        <motion.div
          className="mx-auto flex items-center justify-center w-16 h-16 rounded-2xl bg-foreground/5 border border-foreground/10"
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Lock className="w-7 h-7 text-foreground/40" />
        </motion.div>
        <h1 className="text-2xl font-bold">Upgrade Required</h1>
        <p className="text-foreground/60 leading-relaxed max-w-md mx-auto">
          <span className="text-foreground/80 font-medium">"{lessonTitle}"</span> requires full course access. Upgrade to unlock all 51 lessons.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link to="/tiers">
            <Button className="gap-2 font-mono">
              <Zap className="w-4 h-4" />
              View Plans
            </Button>
          </Link>
          <Link to="/course/dashboard">
            <Button variant="outline" className="gap-2 font-mono">
              <ArrowLeft className="w-4 h-4" />
              {t('learn.backToDashboard')}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

function BookmarkButton({ lessonId }: { lessonId: string }) {
  const { t } = useTranslation()
  useBookmarks()
  const bookmarked = isBookmarked(lessonId)

  return (
    <motion.button
      onClick={() => {
        toggleBookmark(lessonId)
        toast(bookmarked ? t('learn.bookmarkRemoved') : t('learn.lessonBookmarked'), { duration: 2000 })
      }}
      whileTap={{ scale: 0.85 }}
      animate={bookmarked ? { scale: [1, 1.25, 1] } : undefined}
      transition={{ duration: 0.25 }}
      className="flex items-center justify-center w-9 h-9 rounded-lg bg-foreground/[0.04] border border-foreground/[0.08] hover:bg-foreground/[0.08] hover:border-foreground/15 transition-colors shrink-0 mt-1"
      aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark this lesson'}
    >
      <Bookmark
        className={`w-4 h-4 transition-colors ${bookmarked ? 'fill-foreground/70 text-foreground/70' : 'text-foreground/40'}`}
      />
    </motion.button>
  )
}

function LessonNotFound() {
  const { t } = useTranslation()
  return (
    <div className="p-6 lg:p-8 max-w-2xl mx-auto">
      <div className="text-center space-y-6 py-24">
        <h1 className="text-6xl font-bold text-foreground/10">{t('learn.notFound')}</h1>
        <h2 className="text-2xl font-bold">{t('learn.lessonNotFound')}</h2>
        <p className="text-foreground/60">{t('learn.lessonNotFoundDesc')}</p>
        <Link to="/course/dashboard">
          <Button className="gap-2 font-mono">
            <ArrowLeft className="w-4 h-4" />
            {t('learn.backToDashboard')}
          </Button>
        </Link>
      </div>
    </div>
  )
}

export default function Learn() {
  const { t } = useTranslation()
  const { lessonId, step } = useParams<{ lessonId: string; step?: string }>()
  const navigate = useNavigate()
  const progress = useProgress()

  useEffect(() => {
    if (lessonId && !step) {
      let resumeStep = 1
      try {
        const saved = localStorage.getItem(`lesson-steps-completed-${lessonId}`)
        if (saved) {
          const completed: number[] = JSON.parse(saved)
          if (completed.length > 0) resumeStep = Math.max(...completed) + 2
        }
      } catch { /* ignore */ }
      navigate(`/course/learn/${lessonId}/${resumeStep}`, { replace: true })
    }
  }, [lessonId, step, navigate])

  const stepNumber = step ? parseInt(step, 10) : 1
  const validStep = Number.isNaN(stepNumber) || stepNumber < 1 ? 1 : stepNumber

  const { tier } = useAccessTier()
  const [serverAccessDenied, setServerAccessDenied] = useState(false)

  useEffect(() => {
    if (!lessonId || tier === 'admin' || tier === 'paid') return
    if (!canAccessLesson(lessonId, tier)) {
      setServerAccessDenied(true)
      return
    }
    supabase.rpc('check_lesson_access', { p_lesson_id: lessonId })
      .then(({ data }) => {
        if (data === false) setServerAccessDenied(true)
      })
  }, [lessonId, tier])

  const [showCelebration, setShowCelebration] = useState(false)
  const [celebrationXp, setCelebrationXp] = useState(0)

  const found = lessonId ? findLessonAndTier(lessonId) : null
  const adjacent = lessonId ? getAdjacentLessons(lessonId) : { prev: null, next: null, globalIndex: -1 }
  const status = lessonId ? getLessonStatus(lessonId) : 'locked'

  const level = getLevel()
  const nextLevel = getNextLevel()
  const overall = getOverallProgress()

  const motivational = getMotivationalMessage({
    totalXp: progress.totalXp,
    currentStreak: progress.currentStreak,
    lessonsCompleted: overall.completed,
    totalLessons: TOTAL_LESSONS,
    dailyXpEarned: progress.dailyXpEarned,
    dailyXpGoal: progress.dailyXpGoal,
    rank: level.name,
    nextRank: nextLevel?.name ?? null,
    xpToNextRank: nextLevel ? nextLevel.minXp - progress.totalXp : null,
  })

  useEffect(() => {
    if (lessonId && status === 'available') {
      startLesson(lessonId)
    }
  }, [lessonId, status])

  const handleComplete = useCallback(() => {
    if (!lessonId || !found) return
    const { multiplier } = getStreakMultiplier()
    setCelebrationXp(Math.round(found.lesson.xp * multiplier))
    completeLesson(lessonId)
    setShowCelebration(true)
  }, [lessonId, found])

  useEffect(() => {
    if (!showCelebration) return
    const timer = setTimeout(() => {
      if (adjacent.next) {
        navigate(`/course/learn/${adjacent.next.id}/1`)
      }
      setShowCelebration(false)
    }, 3000)
    return () => clearTimeout(timer)
  }, [showCelebration, adjacent.next, navigate])

  if (!found) {
    return (
      <>
        <SEO title={t('learn.lessonNotFound')} description="This lesson could not be found." noindex />
        <LessonNotFound />
      </>
    )
  }

  const { tier: courseTier, lesson } = found

  if (serverAccessDenied) {
    return (
      <>
        <SEO title={`Upgrade: ${lesson.title}`} description="Upgrade your access to unlock this lesson." noindex />
        <TierRequiredState lessonTitle={lesson.title} />
      </>
    )
  }

  if (status === 'locked') {
    return (
      <>
        <SEO title={`Locked: ${lesson.title}`} description="Complete previous lessons to unlock this one." noindex />
        <LockedState lessonTitle={lesson.title} />
      </>
    )
  }

  const isCompleted = status === 'completed'
  const nextStatus = adjacent.next ? getLessonStatus(adjacent.next.id) : 'locked'
  const streakInfo = getStreakMultiplier()
  const comboInfo = getComboInfo()

  return (
    <>
      <SEO
        title={`${lesson.number} ${lesson.title}`}
        description={lesson.description}
        path={`learn/${lessonId}/${validStep}`}
      />
      <GamificationToasts />

      {/* Celebration overlay */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <CelebrationParticles />
            <motion.div
              className="relative text-center space-y-6"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <motion.div
                className="mx-auto flex items-center justify-center w-24 h-24 rounded-full border-2 border-foreground/20 bg-foreground/5"
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1] }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              >
                <motion.div
                  initial={{ scale: 0, rotate: -45 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.3, type: 'spring', stiffness: 400 }}
                >
                  <Check className="w-10 h-10 text-foreground/80" />
                </motion.div>
              </motion.div>

              <motion.div
                className="font-mono text-5xl font-bold tracking-tight"
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                +{celebrationXp} XP
              </motion.div>

              {(streakInfo.multiplier > 1 || comboInfo.active) && (
                <motion.div className="flex items-center gap-3 justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}>
                  {streakInfo.multiplier > 1 && (
                    <span className="text-xs font-mono text-foreground/50 px-2 py-1 rounded bg-foreground/[0.05]">{streakInfo.label} streak</span>
                  )}
                  {comboInfo.active && comboInfo.count > 1 && (
                    <span className="text-xs font-mono text-foreground/50 px-2 py-1 rounded bg-foreground/[0.05]">{comboInfo.count}x combo +{comboInfo.bonusPercent}%</span>
                  )}
                </motion.div>
              )}

              <motion.p
                className="text-foreground/60 text-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                {t('learn.lessonCompleted')}
              </motion.p>

              {adjacent.next && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                >
                  <Link to={`/course/learn/${adjacent.next.id}/1`} onClick={() => setShowCelebration(false)}>
                    <Button size="lg" className="gap-2 font-mono group">
                      {t('learn.continueToNext')}
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page content */}
      <div className="p-6 lg:p-8 max-w-3xl pb-24">
        {/* Breadcrumb */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2 text-sm text-foreground/50 min-w-0">
            <Link
              to="/course/dashboard"
              className="flex items-center gap-1.5 hover:text-foreground transition-colors shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">{t('gamification.dashboard')}</span>
            </Link>
            <ChevronRight className="w-3.5 h-3.5 shrink-0 text-foreground/25" />
            <span className="truncate text-foreground/35">
              {courseTier.name}
            </span>
            <ChevronRight className="w-3.5 h-3.5 shrink-0 text-foreground/25" />
            <Link to={`/course/learn/${lessonId}/1`} className="font-mono text-foreground/60 shrink-0 hover:text-foreground transition-colors">{lesson.number}</Link>
          </div>
          <StatusBadge status={status} />
        </div>

        {/* Lesson header */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="text-xs font-mono px-2.5 py-1 bg-foreground/[0.05] rounded border border-foreground/[0.08] text-foreground/50">
              {courseTier.name}
            </span>
            {lesson.isCapstone && (
              <span className="text-xs font-mono px-2.5 py-1 bg-foreground/10 rounded border border-foreground/15 text-foreground/70 flex items-center gap-1">
                <Award className="w-3 h-3" />
                {t('learn.capstone')}
              </span>
            )}
          </div>

          <div className="flex items-start justify-between gap-3 mb-3">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              {lesson.title}
            </h1>
            <BookmarkButton lessonId={lessonId!} />
          </div>

          <p className="text-foreground/60 leading-relaxed mb-4">
            {lesson.description}
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <span className="flex items-center gap-1.5 text-sm font-mono text-foreground/50">
              <Clock className="w-3.5 h-3.5" />
              {formatDuration(lesson.duration)}
            </span>
            <span className="flex items-center gap-1.5 text-sm font-mono text-foreground/50">
              <Zap className="w-3.5 h-3.5" />
              +{lesson.xp} XP
              {streakInfo.multiplier > 1 && (
                <span className="text-[10px] px-1 py-0.5 rounded bg-foreground/10 text-foreground/50">{streakInfo.label}</span>
              )}
            </span>
            {isCompleted && (
              <span className="flex items-center gap-1.5 text-sm font-mono text-green-500">
                <Check className="w-3.5 h-3.5" />
                {t('gamification.completed')}
              </span>
            )}
            <ComboIndicator />
          </div>
        </div>

        {/* Combo timer */}
        <ComboTimer />

        {/* Separator */}
        <div className="h-px bg-foreground/[0.08] mb-8 mt-4" />

        {/* Motivational message */}
        <p className="text-xs font-mono text-foreground/40 mb-6">
          {motivational.message}
        </p>

        {/* Interactive lesson player */}
        <LessonPlayer lessonId={lessonId!} initialStep={validStep} />

        {/* Learning objectives */}
        {lesson.objectives.length > 0 && (
          <div className="mt-10">
            <h2 className="text-xl font-bold mb-4">{t('learn.learningObjectives')}</h2>
            <div className="rounded-xl border border-foreground/[0.08] bg-foreground/[0.02] p-5">
              <div className="space-y-3">
                {lesson.objectives.map((objective, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="flex items-center justify-center w-6 h-6 rounded bg-foreground/[0.06] shrink-0 mt-0.5">
                      <Target className="w-3.5 h-3.5 text-foreground/50" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-xs font-mono text-foreground/30 mr-2">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="text-sm text-foreground/70 leading-relaxed">{objective}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tools used */}
        {lesson.tools.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">{t('learn.toolsUsed')}</h2>
            <div className="flex flex-wrap gap-2">
              {lesson.tools.map((tool) => (
                <span
                  key={tool}
                  className="text-xs font-mono px-3 py-1.5 bg-foreground/[0.05] rounded border border-foreground/[0.08] text-foreground/60"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Separator */}
        <div className="h-px bg-foreground/[0.08] my-10" />

        {/* Mark as complete / completed badge */}
        <div className="flex justify-center mb-8">
          {isCompleted ? (
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-foreground/[0.03] border border-foreground/10">
                <Check className="w-4 h-4 text-green-500" />
                <span className="font-mono text-sm text-foreground/70">
                  {t('gamification.completed')} — {lesson.xp} XP {t('curriculum.progress.earned')}
                </span>
              </div>
              <p className="text-xs text-foreground/40 font-mono">{t('learn.reviewAnytime')}</p>
            </div>
          ) : (
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                size="lg"
                className="h-11 px-6 font-mono group"
                onClick={handleComplete}
              >
                <Check className="w-4 h-4 mr-2" />
                {t('learn.markAsComplete')}
                <span className="ml-2 text-xs opacity-70">+{lesson.xp} XP</span>
              </Button>
            </motion.div>
          )}
        </div>

        {/* Lesson rating (completed lessons only) */}
        {isCompleted && (
          <div className="mb-8">
            <LessonRating lessonId={lessonId!} />
          </div>
        )}

        {/* Prev / Next navigation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <LessonNavCard lesson={adjacent.prev} direction="prev" />
          <LessonNavCard lesson={adjacent.next} direction="next" disabled={nextStatus === 'locked' && !isCompleted} />
        </div>
      </div>
    </>
  )
}
