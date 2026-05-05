import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Star, TrendingUp, Flame, GraduationCap, Compass, Activity } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { fetchActivityFeed, type ActivityEvent } from '@/lib/activity-api'

interface ActivityFeedProps {
  userId: string
  limit?: number
  showHeader?: boolean
}

const EVENT_ICONS: Record<string, LucideIcon> = {
  achievement: Star,
  level_up: TrendingUp,
  streak_milestone: Flame,
  course_complete: GraduationCap,
  explorer: Compass,
}

function getEventDescription(event: ActivityEvent): string {
  const payload = event.payload
  switch (event.event_type) {
    case 'achievement':
      return `Earned "${(payload.achievementName as string) || 'an achievement'}"`
    case 'level_up':
      return `Reached ${(payload.level as string) || (payload.rank as string) || 'a new rank'}`
    case 'streak_milestone':
      return `${(payload.days as number) || '?'}-day streak milestone`
    case 'course_complete':
      return `Completed ${(payload.courseName as string) || (payload.tierName as string) || 'a course'}`
    case 'explorer':
      return `${(payload.description as string) || 'Explored new content'}`
    default:
      return (payload.description as string) || 'Activity recorded'
  }
}

function getRelativeTime(dateStr: string): string {
  const now = new Date()
  const date = new Date(dateStr)
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

export function ActivityFeed({ userId, limit = 10, showHeader = true }: ActivityFeedProps) {
  const [events, setEvents] = useState<ActivityEvent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    fetchActivityFeed(userId, limit).then((data) => {
      if (!cancelled) {
        setEvents(data)
        setLoading(false)
      }
    })
    return () => { cancelled = true }
  }, [userId, limit])

  if (loading) {
    return (
      <div className="space-y-3">
        {showHeader && (
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-4 h-4 text-foreground/40" />
            <span className="text-sm font-mono font-medium text-foreground/60">Recent Activity</span>
          </div>
        )}
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center gap-3 py-2 animate-pulse">
            <div className="w-8 h-8 rounded-full bg-foreground/[0.06]" />
            <div className="flex-1 space-y-1.5">
              <div className="h-3 w-3/4 rounded bg-foreground/[0.06]" />
              <div className="h-2 w-1/4 rounded bg-foreground/[0.04]" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-8">
        <Activity className="w-6 h-6 mx-auto mb-2 text-foreground/20" />
        <p className="text-sm text-foreground/40 font-mono">No activity yet</p>
      </div>
    )
  }

  return (
    <div>
      {showHeader && (
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-4 h-4 text-foreground/40" />
          <span className="text-sm font-mono font-medium text-foreground/60">Recent Activity</span>
        </div>
      )}
      <div className="space-y-1">
        {events.map((event, i) => {
          const Icon = EVENT_ICONS[event.event_type] || Activity
          return (
            <motion.div
              key={event.id}
              className="flex items-center gap-3 py-2.5 px-3 rounded-lg hover:bg-foreground/[0.02] transition-colors"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05, duration: 0.3 }}
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-foreground/[0.05] border border-foreground/[0.08] shrink-0">
                <Icon className="w-4 h-4 text-foreground/60" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground/70 truncate">
                  {getEventDescription(event)}
                </p>
              </div>
              <span className="text-[10px] font-mono text-foreground/30 shrink-0">
                {getRelativeTime(event.created_at)}
              </span>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
