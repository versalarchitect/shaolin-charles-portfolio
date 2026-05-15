import { useState, useEffect, useRef, useCallback, useImperativeHandle, forwardRef } from 'react'
import { motion } from 'motion/react'
import { BookOpen, Loader2, Users } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { searchUsers, searchLessons, formatUserMention, formatLessonTag } from '@/lib/chat-mentions'
import type { MentionUser, MentionLesson } from '@/lib/chat-mentions'

export interface MentionPopoverHandle {
  navigateUp: () => void
  navigateDown: () => void
  selectActive: () => boolean
}

interface MentionPopoverProps {
  triggerChar: '@' | '#'
  query: string
  onSelect: (formatted: string) => void
  onClose: () => void
}

export const MentionPopover = forwardRef<MentionPopoverHandle, MentionPopoverProps>(
  function MentionPopover({ triggerChar, query, onSelect, onClose }, ref) {
    const [users, setUsers] = useState<MentionUser[]>([])
    const [lessons, setLessons] = useState<MentionLesson[]>([])
    const [activeIndex, setActiveIndex] = useState(0)
    const [loading, setLoading] = useState(false)
    const listRef = useRef<HTMLDivElement>(null)
    const debounceRef = useRef<ReturnType<typeof setTimeout>>()

    const items = triggerChar === '@' ? users : lessons
    const count = items.length

    useEffect(() => {
      setActiveIndex(0)
    }, [query, triggerChar])

    // User search (debounced)
    useEffect(() => {
      if (triggerChar !== '@') return
      clearTimeout(debounceRef.current)

      if (!query.trim()) {
        setUsers([])
        setLoading(false)
        return
      }

      setLoading(true)
      debounceRef.current = setTimeout(async () => {
        const results = await searchUsers(query)
        setUsers(results)
        setLoading(false)
      }, 150)

      return () => clearTimeout(debounceRef.current)
    }, [query, triggerChar])

    // Lesson search (synchronous)
    useEffect(() => {
      if (triggerChar !== '#') return
      setLessons(searchLessons(query))
    }, [query, triggerChar])

    // Auto-scroll active item
    useEffect(() => {
      const el = listRef.current?.querySelector('[data-active="true"]')
      el?.scrollIntoView({ block: 'nearest' })
    }, [activeIndex])

    const handleSelect = useCallback(
      (index: number) => {
        if (triggerChar === '@' && users[index]) {
          onSelect(formatUserMention(users[index]))
        } else if (triggerChar === '#' && lessons[index]) {
          onSelect(formatLessonTag(lessons[index]))
        }
      },
      [triggerChar, users, lessons, onSelect],
    )

    useImperativeHandle(ref, () => ({
      navigateUp() {
        setActiveIndex((i) => (i - 1 + count) % Math.max(count, 1))
      },
      navigateDown() {
        setActiveIndex((i) => (i + 1) % Math.max(count, 1))
      },
      selectActive() {
        if (count === 0) return false
        handleSelect(activeIndex)
        return true
      },
    }), [count, activeIndex, handleSelect])

    const showEmpty = !loading && count === 0 && query.length > 0

    return (
      <motion.div
        initial={{ opacity: 0, y: 8, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 8, scale: 0.96 }}
        transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
        className="absolute bottom-full left-0 mb-2 z-50 w-72"
      >
        <div
          ref={listRef}
          className="rounded-xl border border-foreground/[0.08] bg-background shadow-2xl shadow-black/20 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center gap-2 px-3 py-2 border-b border-foreground/[0.05]">
            {triggerChar === '@' ? (
              <Users className="w-3.5 h-3.5 text-foreground/40" />
            ) : (
              <BookOpen className="w-3.5 h-3.5 text-foreground/40" />
            )}
            <span className="text-[10px] font-mono uppercase tracking-wider text-foreground/35">
              {triggerChar === '@' ? 'Mention a student' : 'Tag a lesson'}
            </span>
          </div>

          {/* Results */}
          <div className="max-h-[280px] overflow-y-auto">
            {loading && (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="w-4 h-4 animate-spin text-foreground/30" />
              </div>
            )}

            {showEmpty && (
              <div className="px-3 py-5 text-center">
                <p className="text-xs font-mono text-foreground/30">No results</p>
              </div>
            )}

            {/* User results */}
            {triggerChar === '@' &&
              !loading &&
              users.map((user, i) => (
                <button
                  key={user.user_id}
                  type="button"
                  data-active={i === activeIndex}
                  onClick={() => handleSelect(i)}
                  onMouseEnter={() => setActiveIndex(i)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors ${
                    i === activeIndex ? 'bg-foreground/[0.06]' : 'hover:bg-foreground/[0.03]'
                  }`}
                >
                  <Avatar size="sm" className="shrink-0">
                    {user.avatar_url && <AvatarImage src={user.avatar_url} alt={user.display_name} />}
                    <AvatarFallback className="text-[9px] font-mono font-bold bg-foreground/10 text-foreground/70">
                      {user.display_name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-foreground/80 truncate">{user.display_name}</span>
                </button>
              ))}

            {/* Lesson results */}
            {triggerChar === '#' &&
              lessons.map((lesson, i) => (
                <button
                  key={lesson.id}
                  type="button"
                  data-active={i === activeIndex}
                  onClick={() => handleSelect(i)}
                  onMouseEnter={() => setActiveIndex(i)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors ${
                    i === activeIndex ? 'bg-foreground/[0.06]' : 'hover:bg-foreground/[0.03]'
                  }`}
                >
                  <span className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-mono font-semibold bg-foreground/[0.06] border border-foreground/10 text-foreground/60">
                    {lesson.number}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground/80 truncate">{lesson.title}</p>
                    <p className="text-[10px] font-mono text-foreground/30 truncate">{lesson.tierName}</p>
                  </div>
                </button>
              ))}
          </div>

          {/* Footer hint */}
          {count > 0 && (
            <div className="flex items-center gap-3 px-3 py-1.5 border-t border-foreground/[0.05]">
              <span className="text-[9px] font-mono text-foreground/25">
                <kbd className="px-1 py-0.5 rounded border border-foreground/10 bg-foreground/[0.03]">↑↓</kbd> navigate
              </span>
              <span className="text-[9px] font-mono text-foreground/25">
                <kbd className="px-1 py-0.5 rounded border border-foreground/10 bg-foreground/[0.03]">↵</kbd> select
              </span>
              <span className="text-[9px] font-mono text-foreground/25">
                <kbd className="px-1 py-0.5 rounded border border-foreground/10 bg-foreground/[0.03]">esc</kbd> dismiss
              </span>
            </div>
          )}
        </div>
      </motion.div>
    )
  },
)
