import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { Bookmark, Clock, Zap, X } from 'lucide-react'
import { CURRICULUM, ALL_LESSONS } from '@/data/curriculum'
import type { Lesson } from '@/data/curriculum'
import { useBookmarks, getBookmarkedLessons, toggleBookmark } from '@/stores/bookmarks'
import { getLessonStatus } from '@/stores/progress'
import { StatusBadge } from '@/components/gamification/shared'

function findTierForLesson(lessonId: string) {
  for (const tier of CURRICULUM) {
    if (tier.lessons.some((l) => l.id === lessonId)) {
      return tier
    }
  }
  return null
}

function BookmarkedItem({ lesson }: { lesson: Lesson }) {
  const tier = findTierForLesson(lesson.id)
  const status = getLessonStatus(lesson.id)
  const tierLabel = tier
    ? tier.id === 'prework'
      ? 'Prework'
      : `Tier ${tier.number}`
    : ''

  return (
    <div className="group flex items-center gap-3 px-3 py-2.5 rounded-lg bg-foreground/[0.02] border border-foreground/[0.06] hover:bg-foreground/[0.04] hover:border-foreground/10 transition-all">
      <Link
        to={`/course/learn/${lesson.id}`}
        className="flex-1 min-w-0 flex items-center gap-3"
      >
        <Bookmark className="w-3.5 h-3.5 fill-foreground/40 text-foreground/40 shrink-0" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-foreground/80 truncate group-hover:text-foreground transition-colors">
            {lesson.title}
          </p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[10px] font-mono text-foreground/35">{tierLabel}</span>
            <span className="flex items-center gap-1 text-[10px] font-mono text-foreground/35">
              <Clock className="w-2.5 h-2.5" />
              {lesson.duration}m
            </span>
            <span className="flex items-center gap-1 text-[10px] font-mono text-foreground/35">
              <Zap className="w-2.5 h-2.5" />
              {lesson.xp} XP
            </span>
          </div>
        </div>
        <StatusBadge status={status} />
      </Link>
      <motion.button
        whileTap={{ scale: 0.8 }}
        onClick={(e) => {
          e.stopPropagation()
          toggleBookmark(lesson.id)
        }}
        className="flex items-center justify-center w-6 h-6 rounded bg-foreground/[0.04] hover:bg-foreground/10 text-foreground/30 hover:text-foreground/60 transition-colors opacity-0 group-hover:opacity-100 shrink-0"
        aria-label={`Remove bookmark for ${lesson.title}`}
      >
        <X className="w-3 h-3" />
      </motion.button>
    </div>
  )
}

export function BookmarkedLessons({ compact }: { compact?: boolean }) {
  useBookmarks()
  const bookmarkedIds = getBookmarkedLessons()

  const bookmarkedLessons = bookmarkedIds
    .map((id) => ALL_LESSONS.find((l) => l.id === id))
    .filter((l): l is Lesson => l !== undefined)

  if (bookmarkedLessons.length === 0) {
    if (compact) return null

    return (
      <div className="rounded-xl border border-foreground/[0.08] bg-foreground/[0.02] p-6">
        <div className="text-center space-y-3 py-4">
          <Bookmark className="w-8 h-8 text-foreground/20 mx-auto" />
          <p className="text-sm text-foreground/40">
            Bookmark lessons to find them quickly
          </p>
        </div>
      </div>
    )
  }

  const displayLessons = compact ? bookmarkedLessons.slice(0, 3) : bookmarkedLessons
  const hasMore = compact && bookmarkedLessons.length > 3

  return (
    <div className="rounded-xl border border-foreground/[0.08] bg-foreground/[0.02] p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Bookmark className="w-3.5 h-3.5 fill-foreground/50 text-foreground/50" />
          <span className="text-[10px] font-mono uppercase tracking-wider text-foreground/50">
            Bookmarked
          </span>
          <span className="text-[10px] font-mono text-foreground/30">
            {bookmarkedLessons.length}
          </span>
        </div>
        {hasMore && (
          <Link
            to="/course/dashboard"
            className="text-[10px] font-mono text-foreground/40 hover:text-foreground/70 transition-colors"
          >
            View all &rarr;
          </Link>
        )}
      </div>
      <div className="space-y-1.5">
        {displayLessons.map((lesson) => (
          <BookmarkedItem key={lesson.id} lesson={lesson} />
        ))}
      </div>
    </div>
  )
}
