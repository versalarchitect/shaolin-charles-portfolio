import { useState, useEffect, useMemo, useCallback } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
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
import { BlurFadeIn, ScrollFadeIn } from '@/components/ui/aaa-effects'
import { SectionSpots, Section } from '@/components/ui/gradient-background'
import { CURRICULUM, ALL_LESSONS } from '@/data/curriculum'
import { useProgress, getLessonStatus, completeLesson, startLesson } from '@/stores/progress'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Particle burst for celebration
// ---------------------------------------------------------------------------

function CelebrationParticles() {
  const particles = useMemo(
    () =>
      Array.from({ length: 24 }, (_, i) => ({
        id: i,
        x: (Math.random() - 0.5) * 300,
        y: -(Math.random() * 200 + 80),
        rotate: Math.random() * 720 - 360,
        scale: Math.random() * 0.6 + 0.4,
        delay: Math.random() * 0.3,
        size: Math.random() * 4 + 2,
      })),
    []
  )

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute left-1/2 top-1/2 rounded-full bg-foreground/30"
          style={{ width: p.size, height: p.size }}
          initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
          animate={{
            x: p.x,
            y: p.y,
            opacity: [1, 1, 0],
            scale: [0, p.scale, 0],
            rotate: p.rotate,
          }}
          transition={{
            duration: 1.2,
            delay: p.delay,
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Status badge component
// ---------------------------------------------------------------------------

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case 'completed':
      return (
        <span className="px-2.5 py-1 bg-green-500/20 text-green-500 text-xs font-mono rounded flex items-center gap-1.5">
          <Check className="w-3 h-3" />
          Completed
        </span>
      )
    case 'in_progress':
      return (
        <span className="px-2.5 py-1 bg-foreground/10 text-foreground/70 text-xs font-mono rounded flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-foreground/60 animate-pulse" />
          In Progress
        </span>
      )
    case 'available':
      return (
        <span className="px-2.5 py-1 bg-foreground/5 text-foreground/60 text-xs font-mono rounded flex items-center gap-1.5">
          <Zap className="w-3 h-3" />
          Available
        </span>
      )
    default:
      return (
        <span className="px-2.5 py-1 bg-foreground/5 text-foreground/40 text-xs font-mono rounded flex items-center gap-1.5">
          <Lock className="w-3 h-3" />
          Locked
        </span>
      )
  }
}

// ---------------------------------------------------------------------------
// Locked State
// ---------------------------------------------------------------------------

function LockedState({ lessonTitle }: { lessonTitle: string }) {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6">
      <BlurFadeIn>
        <div className="text-center space-y-6 max-w-md mx-auto">
          <motion.div
            className="mx-auto flex items-center justify-center w-20 h-20 rounded-2xl bg-foreground/5 border border-foreground/10"
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Lock className="w-8 h-8 text-foreground/40" />
          </motion.div>
          <h1 className="text-2xl md:text-3xl font-bold">Lesson Locked</h1>
          <p className="text-foreground/60 leading-relaxed">
            Complete the previous lessons to unlock{' '}
            <span className="text-foreground/80 font-medium">"{lessonTitle}"</span>. Lessons
            are unlocked sequentially to ensure you build on a solid foundation.
          </p>
          <Link to="/dashboard">
            <Button variant="outline" size="lg" className="gap-2 font-mono">
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </BlurFadeIn>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Not Found State
// ---------------------------------------------------------------------------

function LessonNotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6">
      <BlurFadeIn>
        <div className="text-center space-y-6 max-w-md mx-auto">
          <h1 className="text-8xl md:text-9xl font-bold text-foreground/10">404</h1>
          <h2 className="text-2xl md:text-3xl font-bold">Lesson Not Found</h2>
          <p className="text-foreground/60">
            This lesson doesn't exist or may have been moved.
          </p>
          <Link to="/dashboard">
            <Button size="lg" className="gap-2 font-mono">
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </BlurFadeIn>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main Learn Page
// ---------------------------------------------------------------------------

export default function Learn() {
  const { lessonId } = useParams<{ lessonId: string }>()
  const navigate = useNavigate()
  // Subscribe to progress store so re-renders happen on state changes
  useProgress()

  const [showCelebration, setShowCelebration] = useState(false)
  const [celebrationXp, setCelebrationXp] = useState(0)

  // Resolve lesson data
  const found = lessonId ? findLessonAndTier(lessonId) : null
  const adjacent = lessonId ? getAdjacentLessons(lessonId) : { prev: null, next: null, globalIndex: -1 }
  const status = lessonId ? getLessonStatus(lessonId) : 'locked'

  // Mark lesson as in_progress when viewed and currently available
  useEffect(() => {
    if (lessonId && status === 'available') {
      startLesson(lessonId)
    }
  }, [lessonId, status])

  // Handle mark as complete
  const handleComplete = useCallback(() => {
    if (!lessonId || !found) return
    setCelebrationXp(found.lesson.xp)
    completeLesson(lessonId)
    setShowCelebration(true)
  }, [lessonId, found])

  // Auto-navigate after celebration
  useEffect(() => {
    if (!showCelebration) return
    const timer = setTimeout(() => {
      if (adjacent.next) {
        navigate(`/learn/${adjacent.next.id}`)
      }
      setShowCelebration(false)
    }, 3000)
    return () => clearTimeout(timer)
  }, [showCelebration, adjacent.next, navigate])

  // ---------------------------------------------------------------------------
  // Guard: not found
  // ---------------------------------------------------------------------------
  if (!found) {
    return (
      <>
        <SEO title="Lesson Not Found" description="This lesson could not be found." noindex />
        <LessonNotFound />
      </>
    )
  }

  const { tier, lesson } = found

  // ---------------------------------------------------------------------------
  // Guard: locked
  // ---------------------------------------------------------------------------
  if (status === 'locked') {
    return (
      <>
        <SEO
          title={`Locked: ${lesson.title}`}
          description="Complete previous lessons to unlock this one."
          noindex
        />
        <LockedState lessonTitle={lesson.title} />
      </>
    )
  }

  const isCompleted = status === 'completed'
  const nextStatus = adjacent.next ? getLessonStatus(adjacent.next.id) : 'locked'

  return (
    <>
      <SEO
        title={`${lesson.number} ${lesson.title}`}
        description={lesson.description}
        path={`learn/${lessonId}`}
      />

      {/* ------------------------------------------------------------------ */}
      {/* Celebration overlay */}
      {/* ------------------------------------------------------------------ */}
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
              {/* Checkmark ring */}
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

              {/* XP flyup */}
              <motion.div
                className="font-mono text-5xl md:text-6xl font-bold tracking-tight"
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5, ease: 'easeOut' }}
              >
                +{celebrationXp} XP
              </motion.div>

              <motion.p
                className="text-foreground/60 text-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                Lesson completed!
              </motion.p>

              {adjacent.next && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                >
                  <Link to={`/learn/${adjacent.next.id}`} onClick={() => setShowCelebration(false)}>
                    <Button size="lg" className="gap-2 font-mono group">
                      Continue to next lesson
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ------------------------------------------------------------------ */}
      {/* Page content */}
      {/* ------------------------------------------------------------------ */}
      <div className="min-h-screen pb-24">
        {/* Top breadcrumb bar */}
        <Section id="learn-header" className="border-b border-foreground/[0.08]">
          <div className="max-w-4xl mx-auto px-6 lg:px-8 py-4">
            <BlurFadeIn duration={0.4}>
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-sm text-foreground/60 min-w-0">
                  <Link
                    to="/dashboard"
                    className="flex items-center gap-1.5 hover:text-foreground transition-colors shrink-0"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span className="hidden sm:inline">Dashboard</span>
                  </Link>
                  <ChevronRight className="w-3.5 h-3.5 shrink-0 text-foreground/30" />
                  <span className="truncate text-foreground/40">
                    Tier {tier.number} — {tier.name}
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 shrink-0 text-foreground/30" />
                  <span className="font-mono text-foreground/70 shrink-0">{lesson.number}</span>
                </div>
                <StatusBadge status={status} />
              </div>
            </BlurFadeIn>
          </div>
        </Section>

        {/* Lesson header */}
        <Section id="learn-hero" className="relative overflow-hidden">
          <SectionSpots variant="hero" />
          <div className="max-w-4xl mx-auto px-6 lg:px-8 py-16 md:py-24 relative">
            {/* Watermark number */}
            <div className="absolute -right-4 -top-4 text-[180px] md:text-[240px] font-bold leading-none text-foreground/[0.02] select-none pointer-events-none font-mono">
              {lesson.number}
            </div>

            <div className="relative space-y-6">
              <BlurFadeIn delay={0.1}>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-xs font-mono px-3 py-1.5 bg-foreground/[0.05] rounded-full border border-foreground/10 text-foreground/60">
                    Tier {tier.number} — {tier.name}
                  </span>
                  {lesson.isCapstone && (
                    <span className="text-xs font-mono px-3 py-1.5 bg-foreground/10 rounded-full border border-foreground/15 text-foreground/80 flex items-center gap-1.5">
                      <Award className="w-3 h-3" />
                      Capstone
                    </span>
                  )}
                </div>
              </BlurFadeIn>

              <BlurFadeIn delay={0.2}>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
                  {lesson.title}
                </h1>
              </BlurFadeIn>

              <BlurFadeIn delay={0.3}>
                <p className="text-lg text-foreground/60 max-w-2xl leading-relaxed">
                  {lesson.description}
                </p>
              </BlurFadeIn>

              <BlurFadeIn delay={0.4}>
                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <span className="flex items-center gap-1.5 text-sm font-mono text-foreground/60">
                    <Clock className="w-4 h-4" />
                    {formatDuration(lesson.duration)}
                  </span>
                  <span className="flex items-center gap-1.5 text-sm font-mono text-foreground/60">
                    <Zap className="w-4 h-4" />
                    +{lesson.xp} XP
                  </span>
                  {isCompleted && (
                    <span className="flex items-center gap-1.5 text-sm font-mono text-green-500">
                      <Check className="w-4 h-4" />
                      Completed
                    </span>
                  )}
                </div>
              </BlurFadeIn>
            </div>
          </div>
        </Section>

        {/* Interactive lesson area */}
        <Section id="learn-interactive" className="py-0">
          <div className="max-w-4xl mx-auto px-6 lg:px-8">
            <ScrollFadeIn delay={0.1}>
              <div className="relative rounded-2xl bg-foreground/[0.02] border border-foreground/[0.08] overflow-hidden p-8 md:p-12">
                <div className="absolute inset-0 bg-gradient-to-br from-foreground/[0.03] via-transparent to-foreground/[0.01]" />
                <div className="relative text-center py-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-foreground/5 border border-foreground/10 mb-4">
                    <Zap className="w-7 h-7 text-foreground/60" />
                  </div>
                  <p className="text-sm font-mono text-foreground/60">Interactive lesson loading soon</p>
                </div>
              </div>
            </ScrollFadeIn>
          </div>
        </Section>

        {/* Learning objectives */}
        {lesson.objectives.length > 0 && (
          <Section id="learn-objectives" className="py-16 md:py-24">
            <div className="max-w-4xl mx-auto px-6 lg:px-8">
              <ScrollFadeIn delay={0.1}>
                <h2 className="text-xl md:text-2xl font-bold mb-8">Learning Objectives</h2>
              </ScrollFadeIn>
              <div className="rounded-2xl bg-foreground/[0.02] border border-foreground/[0.08] p-6 md:p-8">
                <div className="space-y-4">
                  {lesson.objectives.map((objective, i) => (
                    <ScrollFadeIn key={i} delay={0.15 + i * 0.05}>
                      <div className="flex items-start gap-4 group">
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-foreground/[0.04] border border-foreground/[0.08] shrink-0 mt-0.5">
                          <Target className="w-4 h-4 text-foreground/50 group-hover:text-foreground/70 transition-colors" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-sm font-mono text-foreground/30 mr-2">
                            {String(i + 1).padStart(2, '0')}
                          </span>
                          <span className="text-foreground/70 leading-relaxed">{objective}</span>
                        </div>
                      </div>
                    </ScrollFadeIn>
                  ))}
                </div>
              </div>
            </div>
          </Section>
        )}

        {/* Tools used */}
        {lesson.tools.length > 0 && (
          <Section id="learn-tools" className="pb-16 md:pb-24">
            <div className="max-w-4xl mx-auto px-6 lg:px-8">
              <ScrollFadeIn delay={0.1}>
                <h2 className="text-xl md:text-2xl font-bold mb-6">Tools Used</h2>
              </ScrollFadeIn>
              <ScrollFadeIn delay={0.2}>
                <div className="flex flex-wrap gap-3">
                  {lesson.tools.map((tool) => (
                    <span
                      key={tool}
                      className="text-xs font-mono px-4 py-2 bg-foreground/[0.05] rounded-full border border-foreground/10 text-foreground/60 hover:text-foreground/80 hover:border-foreground/20 transition-all"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </ScrollFadeIn>
            </div>
          </Section>
        )}

        {/* Separator */}
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="h-px bg-gradient-to-r from-foreground/10 via-foreground/5 to-transparent" />
        </div>

        {/* Lesson navigation + complete button */}
        <Section id="learn-nav" className="py-12 md:py-16">
          <div className="max-w-4xl mx-auto px-6 lg:px-8">
            <ScrollFadeIn delay={0.1}>
              <div className="space-y-8">
                {/* Mark as complete / completed badge */}
                <div className="flex justify-center">
                  {isCompleted ? (
                    <div className="flex flex-col items-center gap-2">
                      <div className="flex items-center gap-2 px-6 py-3 rounded-xl bg-foreground/[0.03] border border-foreground/10">
                        <Check className="w-5 h-5 text-green-500" />
                        <span className="font-mono text-sm text-foreground/70">
                          Completed — {lesson.xp} XP earned
                        </span>
                      </div>
                      <p className="text-xs text-foreground/40 font-mono">
                        You can review this lesson anytime
                      </p>
                    </div>
                  ) : (
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        size="lg"
                        className="h-12 px-8 font-mono group text-base"
                        onClick={handleComplete}
                      >
                        <Check className="w-5 h-5 mr-2" />
                        Mark as Complete
                        <span className="ml-2 text-xs opacity-70">+{lesson.xp} XP</span>
                      </Button>
                    </motion.div>
                  )}
                </div>

                {/* Prev / Next navigation */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Previous lesson */}
                  {adjacent.prev ? (
                    <Link
                      to={`/learn/${adjacent.prev.id}`}
                      className="group rounded-xl bg-foreground/[0.02] border border-foreground/[0.08] p-5 hover:bg-foreground/[0.04] hover:border-foreground/15 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <ArrowLeft className="w-4 h-4 text-foreground/40 group-hover:text-foreground/70 group-hover:-translate-x-1 transition-all shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs font-mono text-foreground/40 mb-1">
                            Previous Lesson
                          </p>
                          <p className="text-sm font-medium text-foreground/70 group-hover:text-foreground/90 truncate transition-colors">
                            <span className="font-mono text-foreground/40 mr-1.5">
                              {adjacent.prev.number}
                            </span>
                            {adjacent.prev.title}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ) : (
                    <div className="rounded-xl bg-foreground/[0.01] border border-foreground/[0.05] p-5 opacity-40 cursor-not-allowed">
                      <div className="flex items-center gap-3">
                        <ArrowLeft className="w-4 h-4 text-foreground/30 shrink-0" />
                        <div>
                          <p className="text-xs font-mono text-foreground/30 mb-1">
                            Previous Lesson
                          </p>
                          <p className="text-sm text-foreground/30">First lesson</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Next lesson */}
                  {adjacent.next ? (
                    nextStatus === 'locked' && !isCompleted ? (
                      <div className="rounded-xl bg-foreground/[0.01] border border-foreground/[0.05] p-5 opacity-40 cursor-not-allowed">
                        <div className="flex items-center justify-end gap-3">
                          <div className="text-right min-w-0">
                            <p className="text-xs font-mono text-foreground/30 mb-1">
                              Next Lesson
                            </p>
                            <p className="text-sm text-foreground/30 truncate">
                              <Lock className="w-3 h-3 inline mr-1.5" />
                              {adjacent.next.title}
                            </p>
                          </div>
                          <ArrowRight className="w-4 h-4 text-foreground/30 shrink-0" />
                        </div>
                      </div>
                    ) : (
                      <Link
                        to={`/learn/${adjacent.next.id}`}
                        className="group rounded-xl bg-foreground/[0.02] border border-foreground/[0.08] p-5 hover:bg-foreground/[0.04] hover:border-foreground/15 transition-all"
                      >
                        <div className="flex items-center justify-end gap-3">
                          <div className="text-right min-w-0">
                            <p className="text-xs font-mono text-foreground/40 mb-1">
                              Next Lesson
                            </p>
                            <p className="text-sm font-medium text-foreground/70 group-hover:text-foreground/90 truncate transition-colors">
                              {adjacent.next.title}
                              <span className="font-mono text-foreground/40 ml-1.5">
                                {adjacent.next.number}
                              </span>
                            </p>
                          </div>
                          <ArrowRight className="w-4 h-4 text-foreground/40 group-hover:text-foreground/70 group-hover:translate-x-1 transition-all shrink-0" />
                        </div>
                      </Link>
                    )
                  ) : (
                    <div className="rounded-xl bg-foreground/[0.01] border border-foreground/[0.05] p-5 opacity-40 cursor-not-allowed">
                      <div className="flex items-center justify-end gap-3">
                        <div className="text-right">
                          <p className="text-xs font-mono text-foreground/30 mb-1">Next Lesson</p>
                          <p className="text-sm text-foreground/30">Course complete!</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-foreground/30 shrink-0" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </ScrollFadeIn>
          </div>
        </Section>
      </div>
    </>
  )
}
