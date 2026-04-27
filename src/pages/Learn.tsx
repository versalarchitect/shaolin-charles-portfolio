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
import { LessonContentRenderer } from '@/components/lesson-content'
import { CURRICULUM, ALL_LESSONS } from '@/data/curriculum'
import { useProgress, getLessonStatus, completeLesson, startLesson } from '@/stores/progress'

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
          transition={{ duration: 1.2, delay: p.delay, ease: 'easeOut' }}
        />
      ))}
    </div>
  )
}

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

function LockedState({ lessonTitle }: { lessonTitle: string }) {
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
        <h1 className="text-2xl font-bold">Lesson Locked</h1>
        <p className="text-foreground/60 leading-relaxed max-w-md mx-auto">
          Complete the previous lessons to unlock{' '}
          <span className="text-foreground/80 font-medium">"{lessonTitle}"</span>.
        </p>
        <Link to="/dashboard">
          <Button variant="outline" className="gap-2 font-mono">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  )
}

function LessonNotFound() {
  return (
    <div className="p-6 lg:p-8 max-w-2xl mx-auto">
      <div className="text-center space-y-6 py-24">
        <h1 className="text-6xl font-bold text-foreground/10">404</h1>
        <h2 className="text-2xl font-bold">Lesson Not Found</h2>
        <p className="text-foreground/60">This lesson doesn't exist or may have been moved.</p>
        <Link to="/dashboard">
          <Button className="gap-2 font-mono">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  )
}

export default function Learn() {
  const { lessonId } = useParams<{ lessonId: string }>()
  const navigate = useNavigate()
  useProgress()

  const [showCelebration, setShowCelebration] = useState(false)
  const [celebrationXp, setCelebrationXp] = useState(0)

  const found = lessonId ? findLessonAndTier(lessonId) : null
  const adjacent = lessonId ? getAdjacentLessons(lessonId) : { prev: null, next: null, globalIndex: -1 }
  const status = lessonId ? getLessonStatus(lessonId) : 'locked'

  useEffect(() => {
    if (lessonId && status === 'available') {
      startLesson(lessonId)
    }
  }, [lessonId, status])

  const handleComplete = useCallback(() => {
    if (!lessonId || !found) return
    setCelebrationXp(found.lesson.xp)
    completeLesson(lessonId)
    setShowCelebration(true)
  }, [lessonId, found])

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

  if (!found) {
    return (
      <>
        <SEO title="Lesson Not Found" description="This lesson could not be found." noindex />
        <LessonNotFound />
      </>
    )
  }

  const { tier, lesson } = found

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

  return (
    <>
      <SEO
        title={`${lesson.number} ${lesson.title}`}
        description={lesson.description}
        path={`learn/${lessonId}`}
      />

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

      {/* Page content */}
      <div className="p-6 lg:p-8 max-w-3xl pb-24">
        {/* Breadcrumb */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2 text-sm text-foreground/50 min-w-0">
            <Link
              to="/dashboard"
              className="flex items-center gap-1.5 hover:text-foreground transition-colors shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </Link>
            <ChevronRight className="w-3.5 h-3.5 shrink-0 text-foreground/25" />
            <span className="truncate text-foreground/35">
              {tier.id === 'prework' ? 'Prework' : `Tier ${tier.number}`}
            </span>
            <ChevronRight className="w-3.5 h-3.5 shrink-0 text-foreground/25" />
            <span className="font-mono text-foreground/60 shrink-0">{lesson.number}</span>
          </div>
          <StatusBadge status={status} />
        </div>

        {/* Lesson header */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="text-xs font-mono px-2.5 py-1 bg-foreground/[0.05] rounded border border-foreground/[0.08] text-foreground/50">
              {tier.id === 'prework' ? 'Prework' : `Tier ${tier.number} — ${tier.name}`}
            </span>
            {lesson.isCapstone && (
              <span className="text-xs font-mono px-2.5 py-1 bg-foreground/10 rounded border border-foreground/15 text-foreground/70 flex items-center gap-1">
                <Award className="w-3 h-3" />
                Capstone
              </span>
            )}
          </div>

          <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-3">
            {lesson.title}
          </h1>

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
            </span>
            {isCompleted && (
              <span className="flex items-center gap-1.5 text-sm font-mono text-green-500">
                <Check className="w-3.5 h-3.5" />
                Completed
              </span>
            )}
          </div>
        </div>

        {/* Separator */}
        <div className="h-px bg-foreground/[0.08] mb-8" />

        {/* Lesson content */}
        <LessonContentRenderer lessonId={lessonId!} />

        {/* Learning objectives */}
        {lesson.objectives.length > 0 && (
          <div className="mt-10">
            <h2 className="text-xl font-bold mb-4">Learning Objectives</h2>
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
            <h2 className="text-xl font-bold mb-4">Tools Used</h2>
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
                  Completed — {lesson.xp} XP earned
                </span>
              </div>
              <p className="text-xs text-foreground/40 font-mono">You can review this lesson anytime</p>
            </div>
          ) : (
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                size="lg"
                className="h-11 px-6 font-mono group"
                onClick={handleComplete}
              >
                <Check className="w-4 h-4 mr-2" />
                Mark as Complete
                <span className="ml-2 text-xs opacity-70">+{lesson.xp} XP</span>
              </Button>
            </motion.div>
          )}
        </div>

        {/* Prev / Next navigation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {adjacent.prev ? (
            <Link
              to={`/learn/${adjacent.prev.id}`}
              className="group rounded-xl bg-foreground/[0.02] border border-foreground/[0.08] p-4 hover:bg-foreground/[0.04] hover:border-foreground/15 transition-all"
            >
              <div className="flex items-center gap-3">
                <ArrowLeft className="w-4 h-4 text-foreground/40 group-hover:text-foreground/70 group-hover:-translate-x-1 transition-all shrink-0" />
                <div className="min-w-0">
                  <p className="text-[10px] font-mono text-foreground/40 mb-0.5">Previous</p>
                  <p className="text-sm font-medium text-foreground/70 group-hover:text-foreground/90 truncate transition-colors">
                    <span className="font-mono text-foreground/40 mr-1">{adjacent.prev.number}</span>
                    {adjacent.prev.title}
                  </p>
                </div>
              </div>
            </Link>
          ) : (
            <div className="rounded-xl bg-foreground/[0.01] border border-foreground/[0.05] p-4 opacity-40">
              <div className="flex items-center gap-3">
                <ArrowLeft className="w-4 h-4 text-foreground/30 shrink-0" />
                <div>
                  <p className="text-[10px] font-mono text-foreground/30 mb-0.5">Previous</p>
                  <p className="text-sm text-foreground/30">First lesson</p>
                </div>
              </div>
            </div>
          )}

          {adjacent.next ? (
            nextStatus === 'locked' && !isCompleted ? (
              <div className="rounded-xl bg-foreground/[0.01] border border-foreground/[0.05] p-4 opacity-40">
                <div className="flex items-center justify-end gap-3">
                  <div className="text-right min-w-0">
                    <p className="text-[10px] font-mono text-foreground/30 mb-0.5">Next</p>
                    <p className="text-sm text-foreground/30 truncate">
                      <Lock className="w-3 h-3 inline mr-1" />
                      {adjacent.next.title}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-foreground/30 shrink-0" />
                </div>
              </div>
            ) : (
              <Link
                to={`/learn/${adjacent.next.id}`}
                className="group rounded-xl bg-foreground/[0.02] border border-foreground/[0.08] p-4 hover:bg-foreground/[0.04] hover:border-foreground/15 transition-all"
              >
                <div className="flex items-center justify-end gap-3">
                  <div className="text-right min-w-0">
                    <p className="text-[10px] font-mono text-foreground/40 mb-0.5">Next</p>
                    <p className="text-sm font-medium text-foreground/70 group-hover:text-foreground/90 truncate transition-colors">
                      {adjacent.next.title}
                      <span className="font-mono text-foreground/40 ml-1">{adjacent.next.number}</span>
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-foreground/40 group-hover:text-foreground/70 group-hover:translate-x-1 transition-all shrink-0" />
                </div>
              </Link>
            )
          ) : (
            <div className="rounded-xl bg-foreground/[0.01] border border-foreground/[0.05] p-4 opacity-40">
              <div className="flex items-center justify-end gap-3">
                <div className="text-right">
                  <p className="text-[10px] font-mono text-foreground/30 mb-0.5">Next</p>
                  <p className="text-sm text-foreground/30">Course complete!</p>
                </div>
                <ArrowRight className="w-4 h-4 text-foreground/30 shrink-0" />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
