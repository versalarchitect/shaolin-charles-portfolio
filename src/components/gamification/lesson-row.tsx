import { Link } from '@/lib/localized-router'
import { Check, Lock, Star, Play } from 'lucide-react'
import type { Lesson } from '@/data/curriculum'
import { getLessonStatus } from '@/stores/progress'

export function LessonRow({ lesson, showStatus }: { lesson: Lesson; showStatus?: boolean }) {
  const status = showStatus ? getLessonStatus(lesson.id) : 'available'
  const isLocked = status === 'locked'
  const isCompleted = status === 'completed'

  return (
    <Link
      to={isLocked ? '#' : `/course/learn/${lesson.id}`}
      className={`flex items-center gap-3 px-5 py-3 transition-colors group ${isLocked ? 'opacity-50 cursor-not-allowed' : 'hover:bg-foreground/[0.03]'}`}
      onClick={(e) => { if (isLocked) e.preventDefault() }}
    >
      <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-colors ${isCompleted ? 'bg-foreground/15' : 'bg-foreground/10 group-hover:bg-foreground/15'}`}>
        {isCompleted ? <Check className="h-3 w-3 text-foreground/70" /> : isLocked ? <Lock className="h-2.5 w-2.5 text-foreground/40" /> : lesson.isCapstone ? <Star className="h-3 w-3 text-foreground/70" /> : <Play className="h-2.5 w-2.5 text-foreground/60 ml-0.5" />}
      </span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-foreground/40">{lesson.number}</span>
          <span className={`text-sm ${lesson.isCapstone ? 'font-semibold' : ''} ${isCompleted ? 'text-foreground/50 line-through' : 'text-foreground/80 group-hover:text-foreground'} transition-colors truncate`}>
            {lesson.title}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-3 text-xs text-foreground/40 shrink-0">
        <span className="font-mono">{lesson.duration}m</span>
        <span className={`font-mono ${isCompleted ? 'text-foreground/50' : 'text-foreground/30'}`}>
          {isCompleted ? '✓' : `+${lesson.xp}`} XP
        </span>
      </div>
    </Link>
  )
}
