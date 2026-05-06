import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { BookOpen, Star, Flame, TrendingUp, ChevronDown } from 'lucide-react'
import { useProgress, getXpLog, getLevel } from '@/stores/progress'
import { ACHIEVEMENTS, XP_LEVELS, ALL_LESSONS } from '@/data/curriculum'

type TimelineEventType = 'lesson' | 'achievement' | 'streak' | 'level_up'

interface TimelineEvent {
  id: string
  type: TimelineEventType
  title: string
  description: string
  date: string
  xp: number
  icon?: string
}

export interface JourneyTimelineProps {
  maxItems?: number
  compact?: boolean
}

const STREAK_MILESTONES = [3, 7, 14, 30]

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function getEventIcon(type: TimelineEventType) {
  switch (type) {
    case 'lesson':
      return BookOpen
    case 'achievement':
      return Star
    case 'streak':
      return Flame
    case 'level_up':
      return TrendingUp
  }
}

export function JourneyTimeline({ maxItems = 20, compact = false }: JourneyTimelineProps) {
  const progress = useProgress()
  const [showAll, setShowAll] = useState(false)

  const events = useMemo(() => {
    const allEvents: TimelineEvent[] = []

    // 1. Lesson completions
    for (const [lessonId, lp] of Object.entries(progress.lessonProgress)) {
      if (lp.status !== 'completed' || !lp.completedAt) continue
      const lesson = ALL_LESSONS.find((l) => l.id === lessonId)
      allEvents.push({
        id: `lesson-${lessonId}`,
        type: 'lesson',
        title: lesson ? lesson.title : lessonId,
        description: 'Lesson completed',
        date: lp.completedAt,
        xp: lp.xpEarned,
      })
    }

    // 2. Achievement unlocks — cross-reference with ACHIEVEMENTS
    for (const achievementId of progress.unlockedAchievements) {
      const achievement = ACHIEVEMENTS.find((a) => a.id === achievementId)
      if (!achievement) continue

      // Find approximate date from xpLog or use a fallback
      const xpLog = getXpLog()
      const logEntry = xpLog.find(
        (e) => e.type === 'achievement' && e.label === achievement.name
      )
      const date = logEntry?.timestamp || progress.lastActivityDate || new Date().toISOString()

      allEvents.push({
        id: `achievement-${achievementId}`,
        type: 'achievement',
        title: achievement.name,
        description: achievement.description,
        date,
        xp: achievement.xpReward,
        icon: achievement.icon,
      })
    }

    // 3. Streak milestones from streakDates
    // Detect when consecutive dates first hit milestones
    const sortedDates = [...progress.streakDates].sort()
    let consecutiveCount = 0
    const milestonesHit = new Set<number>()

    for (let i = 0; i < sortedDates.length; i++) {
      if (i === 0) {
        consecutiveCount = 1
      } else {
        const prev = new Date(sortedDates[i - 1])
        const curr = new Date(sortedDates[i])
        const diffDays = Math.round((curr.getTime() - prev.getTime()) / 86400000)
        if (diffDays === 1) {
          consecutiveCount++
        } else {
          consecutiveCount = 1
        }
      }

      for (const milestone of STREAK_MILESTONES) {
        if (consecutiveCount === milestone && !milestonesHit.has(milestone)) {
          milestonesHit.add(milestone)
          allEvents.push({
            id: `streak-${milestone}-${sortedDates[i]}`,
            type: 'streak',
            title: `${milestone}-Day Streak`,
            description: `Maintained a ${milestone}-day learning streak`,
            date: new Date(sortedDates[i]).toISOString(),
            xp: 0,
          })
        }
      }
    }

    // 4. Level up events — detect from total XP thresholds
    // Check which XP levels the user has crossed based on lesson completion chronology
    const sortedLessons = Object.entries(progress.lessonProgress)
      .filter(([_, lp]) => lp.status === 'completed' && lp.completedAt)
      .sort((a, b) => new Date(a[1].completedAt!).getTime() - new Date(b[1].completedAt!).getTime())

    let runningXp = 0
    let currentLevelIdx = 0

    for (const [_, lp] of sortedLessons) {
      runningXp += lp.xpEarned
      for (let i = currentLevelIdx + 1; i < XP_LEVELS.length; i++) {
        if (runningXp >= XP_LEVELS[i].minXp && i > currentLevelIdx) {
          allEvents.push({
            id: `level-${XP_LEVELS[i].name}`,
            type: 'level_up',
            title: `Reached ${XP_LEVELS[i].name}`,
            description: `Leveled up to ${XP_LEVELS[i].name} rank`,
            date: lp.completedAt!,
            xp: 0,
          })
          currentLevelIdx = i
        }
      }
    }

    // Sort by date, most recent first
    allEvents.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    return allEvents
  }, [progress])

  if (events.length === 0) {
    return (
      <div className={`text-center ${compact ? 'py-6' : 'py-10'}`}>
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-foreground/[0.04] border border-foreground/[0.06] mx-auto mb-3">
          <BookOpen className="w-4 h-4 text-foreground/15" />
        </div>
        <p className="text-xs text-foreground/35 font-mono mb-1">
          Your timeline begins when you complete your first lesson
        </p>
        {!compact && (
          <p className="text-[10px] text-foreground/20 font-mono">
            Each milestone will appear here chronologically
          </p>
        )}
      </div>
    )
  }

  const visibleEvents = showAll ? events : events.slice(0, maxItems)
  const hasMore = events.length > maxItems && !showAll

  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-[11px] top-3 bottom-3 w-px bg-foreground/[0.08]" />

      <div className={`${compact ? 'space-y-2' : 'space-y-3'} pl-8`}>
        {visibleEvents.map((event, i) => {
          const Icon = getEventIcon(event.type)

          return (
            <motion.div
              key={event.id}
              className="relative"
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-20px' }}
              transition={{ delay: Math.min(i * 0.04, 0.4), duration: 0.3 }}
            >
              {/* Timeline dot */}
              <div className="absolute -left-8 top-2.5 flex items-center justify-center w-[22px] h-[22px]">
                <div
                  className={`flex items-center justify-center rounded-full border ${
                    event.type === 'achievement'
                      ? 'w-5 h-5 bg-foreground/[0.06] border-foreground/15'
                      : event.type === 'level_up'
                        ? 'w-5 h-5 bg-foreground/[0.08] border-foreground/20'
                        : event.type === 'streak'
                          ? 'w-5 h-5 bg-foreground/[0.05] border-foreground/12'
                          : 'w-4 h-4 bg-foreground/[0.04] border-foreground/[0.08]'
                  }`}
                >
                  {event.type === 'achievement' && event.icon ? (
                    <span className="text-[10px]">{event.icon}</span>
                  ) : (
                    <Icon className={`${compact ? 'w-2.5 h-2.5' : 'w-3 h-3'} text-foreground/50`} />
                  )}
                </div>
              </div>

              {/* Card */}
              <div
                className={`rounded-lg border border-foreground/[0.06] bg-foreground/[0.015] ${
                  compact ? 'px-3 py-2' : 'px-4 py-3'
                } hover:bg-foreground/[0.03] hover:border-foreground/10 transition-colors`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className={`font-medium text-foreground/75 ${compact ? 'text-xs' : 'text-sm'} truncate`}>
                      {event.title}
                    </p>
                    {!compact && (
                      <p className="text-[11px] text-foreground/40 mt-0.5 truncate">
                        {event.description}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col items-end shrink-0 gap-0.5">
                    <span className="text-[9px] font-mono text-foreground/25">
                      {formatDate(event.date)}
                    </span>
                    {event.xp > 0 && (
                      <span className="text-[9px] font-mono text-foreground/35">
                        +{event.xp} XP
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Show more button */}
      {hasMore && (
        <button
          onClick={() => setShowAll(true)}
          className="mt-4 ml-8 inline-flex items-center gap-1.5 text-xs font-mono text-foreground/40 hover:text-foreground/60 transition-colors px-3 py-1.5 rounded-lg border border-foreground/[0.08] hover:bg-foreground/[0.04]"
        >
          <ChevronDown className="w-3 h-3" />
          Show {events.length - maxItems} more
        </button>
      )}
    </div>
  )
}
