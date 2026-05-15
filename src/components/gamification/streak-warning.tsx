import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'motion/react'
import { Flame, X, Shield, ArrowRight } from 'lucide-react'
import { useProgress, getLessonStatus } from '@/stores/progress'
import { CURRICULUM } from '@/data/curriculum'
import { getNotificationSettings } from '@/lib/sounds'

type UrgencyLevel = 'subtle' | 'urgent' | 'critical' | null

function getUrgencyLevel(hour: number): UrgencyLevel {
  if (hour >= 23) return 'critical'
  if (hour >= 21) return 'urgent'
  if (hour >= 18) return 'subtle'
  return null
}

function getMinutesUntilMidnight(): number {
  const now = new Date()
  const midnight = new Date(now)
  midnight.setHours(24, 0, 0, 0)
  return Math.max(0, Math.floor((midnight.getTime() - now.getTime()) / 60000))
}

function getNextLessonPath(): string | null {
  for (const tier of CURRICULUM) {
    for (const lesson of tier.lessons) {
      const status = getLessonStatus(lesson.id)
      if (status === 'in_progress' || status === 'available') {
        return `/course/learn/${lesson.id}`
      }
    }
  }
  return null
}

function getTodayString(): string {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
}

export function StreakWarning() {
  const progress = useProgress()
  const { t } = useTranslation()
  const [now, setNow] = useState(() => new Date())
  const dismissedRef = useRef(false)
  const [dismissed, setDismissed] = useState(false)

  // Update every minute for the countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date())
    }, 60000)
    return () => clearInterval(interval)
  }, [])

  // Determine if we should show the banner
  const today = getTodayString()
  const completedToday = progress.streakDates.includes(today)
  const hasStreak = progress.currentStreak >= 1
  const hour = now.getHours()
  const urgency = getUrgencyLevel(hour)

  const streakFreezeAvailable =
    progress.currentStreak >= 3 && !progress.streakFreezeUsedThisWeek

  const shouldShow =
    !dismissed &&
    !dismissedRef.current &&
    hasStreak &&
    !completedToday &&
    urgency !== null &&
    getNotificationSettings().streakWarnings

  const nextLessonPath = getNextLessonPath()
  const minutesLeft = getMinutesUntilMidnight()

  function handleDismiss() {
    dismissedRef.current = true
    setDismissed(true)
  }

  const styles: Record<
    'subtle' | 'urgent' | 'critical',
    { bg: string; border: string }
  > = {
    subtle: {
      bg: 'bg-foreground/[0.03]',
      border: 'border-foreground/[0.08]',
    },
    urgent: {
      bg: 'bg-foreground/[0.05]',
      border: 'border-foreground/[0.12]',
    },
    critical: {
      bg: 'bg-foreground/[0.08]',
      border: 'border-foreground/[0.15]',
    },
  }

  return (
    <AnimatePresence>
      {shouldShow && urgency && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <div
            className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${styles[urgency].bg} ${styles[urgency].border}`}
          >
            {/* Flame icon */}
            <div className="shrink-0">
              {urgency === 'urgent' ? (
                <Flame className="w-4 h-4 text-foreground/70 animate-pulse" />
              ) : (
                <Flame className="w-4 h-4 text-foreground/70" />
              )}
            </div>

            {/* Message */}
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground/80">
                {urgency === 'critical' && (
                  <span className="font-semibold">
                    {progress.currentStreak}-day streak — Less than{' '}
                    {minutesLeft <= 60
                      ? `${minutesLeft} minute${minutesLeft !== 1 ? 's' : ''}`
                      : '1 hour'}{' '}
                    left!
                  </span>
                )}
                {urgency === 'urgent' && (
                  <span>
                    Your{' '}
                    <span className="font-semibold">
                      {progress.currentStreak}-day streak
                    </span>{' '}
                    expires at midnight! Complete a lesson now.
                  </span>
                )}
                {urgency === 'subtle' && (
                  <span>
                    Complete a lesson today to keep your{' '}
                    <span className="font-semibold">
                      {progress.currentStreak}-day streak
                    </span>{' '}
                    alive
                  </span>
                )}
              </p>
              {streakFreezeAvailable && (
                <p className="text-xs text-foreground/40 mt-0.5 flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  Streak freeze available if you miss today
                </p>
              )}
            </div>

            {/* Start a lesson link */}
            {nextLessonPath && (
              <Link
                to={nextLessonPath}
                className="shrink-0 flex items-center gap-1 text-xs font-mono px-3 py-1.5 rounded-lg bg-foreground/[0.05] border border-foreground/10 text-foreground/70 hover:text-foreground hover:bg-foreground/[0.08] hover:border-foreground/15 transition-all"
              >
                Start a lesson
                <ArrowRight className="w-3 h-3" />
              </Link>
            )}

            {/* Dismiss */}
            <button
              onClick={handleDismiss}
              className="shrink-0 p-1 rounded-md text-foreground/40 hover:text-foreground/70 hover:bg-foreground/[0.05] transition-colors"
              aria-label={t('streakWarning.dismiss')}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
