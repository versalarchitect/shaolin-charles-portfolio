import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { Plus, Play, Target, Timer, Share2, Command } from 'lucide-react'
import { useCommandMenu } from '@/components/command-menu'
import { CURRICULUM } from '@/data/curriculum'
import { getLessonStatus } from '@/stores/progress'

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

interface QuickAction {
  id: string
  label: string
  icon: React.ElementType
  action: () => void
}

export function QuickActionsFab() {
  const [expanded, setExpanded] = useState(false)
  const [hoveredAction, setHoveredAction] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { setOpen: openCommandMenu } = useCommandMenu()
  const prefersReducedMotion = useReducedMotion()

  // Only show on course pages
  const isCourseRoute = pathname.startsWith('/course/')
  if (!isCourseRoute) return null

  const actions: QuickAction[] = [
    {
      id: 'resume',
      label: 'Resume lesson',
      icon: Play,
      action: () => {
        const next = getNextLessonPath()
        if (next) navigate(next)
        else navigate('/course/curriculum')
        setExpanded(false)
      },
    },
    {
      id: 'challenges',
      label: 'Daily challenges',
      icon: Target,
      action: () => {
        navigate('/course/dashboard')
        // Allow navigation to complete then scroll to challenges section
        setTimeout(() => {
          const el = document.getElementById('weekly-challenges')
          el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }, 100)
        setExpanded(false)
      },
    },
    {
      id: 'focus',
      label: 'Focus timer',
      icon: Timer,
      action: () => {
        navigate('/course/dashboard')
        setTimeout(() => {
          const el = document.getElementById('focus-timer')
          el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }, 100)
        setExpanded(false)
      },
    },
    {
      id: 'share',
      label: 'Share progress',
      icon: Share2,
      action: () => {
        window.dispatchEvent(new CustomEvent('open-share-card'))
        setExpanded(false)
      },
    },
    {
      id: 'command',
      label: 'Command menu',
      icon: Command,
      action: () => {
        openCommandMenu(true)
        setExpanded(false)
      },
    },
  ]

  const close = useCallback(() => setExpanded(false), [])

  // Close on Escape
  useEffect(() => {
    if (!expanded) return
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') close()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [expanded, close])

  // Close on click outside
  useEffect(() => {
    if (!expanded) return
    function onClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        close()
      }
    }
    window.addEventListener('mousedown', onClick)
    return () => window.removeEventListener('mousedown', onClick)
  }, [expanded, close])

  const stagger = prefersReducedMotion ? 0 : 0.05

  return (
    <div
      ref={containerRef}
      className="fixed bottom-24 right-6 z-40 hidden md:flex flex-col items-end gap-2"
    >
      {/* Backdrop blur when expanded */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
            className="fixed inset-0 bg-background/20 backdrop-blur-[2px] z-[-1]"
            aria-hidden
          />
        )}
      </AnimatePresence>

      {/* Action buttons */}
      <AnimatePresence>
        {expanded &&
          actions.map((action, i) => {
            const Icon = action.icon
            return (
              <motion.div
                key={action.id}
                initial={{ opacity: 0, y: 10, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.8 }}
                transition={{
                  duration: prefersReducedMotion ? 0 : 0.2,
                  delay: stagger * (actions.length - 1 - i),
                }}
                className="flex items-center gap-3"
                onMouseEnter={() => setHoveredAction(action.id)}
                onMouseLeave={() => setHoveredAction(null)}
              >
                {/* Tooltip label */}
                <AnimatePresence>
                  {hoveredAction === action.id && (
                    <motion.span
                      initial={{ opacity: 0, x: 4 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 4 }}
                      transition={{ duration: prefersReducedMotion ? 0 : 0.15 }}
                      className="px-3 py-1.5 text-xs font-mono bg-foreground/10 border border-foreground/[0.15] rounded-lg text-foreground/80 whitespace-nowrap backdrop-blur-sm"
                    >
                      {action.label}
                    </motion.span>
                  )}
                </AnimatePresence>

                <motion.button
                  onClick={action.action}
                  whileHover={prefersReducedMotion ? undefined : { scale: 1.1 }}
                  whileTap={prefersReducedMotion ? undefined : { scale: 0.95 }}
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-foreground/10 border border-foreground/[0.15] text-foreground/60 hover:text-foreground hover:border-foreground/20 hover:bg-foreground/[0.15] transition-colors"
                  aria-label={action.label}
                >
                  <Icon className="w-4 h-4" />
                </motion.button>
              </motion.div>
            )
          })}
      </AnimatePresence>

      {/* Main FAB button */}
      <motion.button
        onClick={() => setExpanded((prev) => !prev)}
        whileHover={prefersReducedMotion ? undefined : { scale: 1.08, y: -1 }}
        whileTap={prefersReducedMotion ? undefined : { scale: 0.95 }}
        className="flex items-center justify-center w-12 h-12 rounded-full bg-foreground/10 border border-foreground/[0.15] text-foreground/70 hover:text-foreground hover:border-foreground/20 hover:bg-foreground/[0.15] transition-colors shadow-lg shadow-background/50"
        aria-label={expanded ? 'Close quick actions' : 'Open quick actions'}
        aria-expanded={expanded}
      >
        <motion.div
          animate={{ rotate: expanded ? 45 : 0 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.2, ease: 'easeInOut' }}
        >
          <Plus className="w-5 h-5" />
        </motion.div>
      </motion.button>
    </div>
  )
}
