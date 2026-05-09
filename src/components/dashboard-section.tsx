import { useState, useCallback, type ReactNode } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

const STORAGE_KEY = 'dashboard-sections'

function loadSectionStates(): Record<string, boolean> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function saveSectionStates(states: Record<string, boolean>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(states))
  } catch {
    // ignore quota errors
  }
}

type DashboardSectionProps = {
  id: string
  title: string
  defaultOpen?: boolean
  children: ReactNode
  className?: string
}

export function DashboardSection({
  id,
  title,
  defaultOpen = true,
  children,
  className,
}: DashboardSectionProps) {
  const [isOpen, setIsOpen] = useState(() => {
    const stored = loadSectionStates()
    return stored[id] !== undefined ? stored[id] : defaultOpen
  })

  const toggle = useCallback(() => {
    setIsOpen((prev) => {
      const next = !prev
      const states = loadSectionStates()
      states[id] = next
      saveSectionStates(states)
      return next
    })
  }, [id])

  return (
    <div className={cn('space-y-4', className)}>
      <button
        type="button"
        onClick={toggle}
        className="flex w-full items-center gap-3 group cursor-pointer"
      >
        <h2 className="text-[11px] font-mono uppercase tracking-widest text-foreground/40 group-hover:text-foreground/60 transition-colors">
          {title}
        </h2>
        <div className="flex-1 h-px bg-foreground/[0.06]" />
        <motion.div
          animate={{ rotate: isOpen ? 0 : -90 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-3.5 h-3.5 text-foreground/30 group-hover:text-foreground/50 transition-colors" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{
              height: 'auto',
              opacity: 1,
              transition: {
                height: { duration: 0.3, ease: [0.32, 0.72, 0, 1] },
                opacity: { duration: 0.2, delay: 0.05 },
              },
            }}
            exit={{
              height: 0,
              opacity: 0,
              transition: {
                height: { duration: 0.25, ease: [0.32, 0.72, 0, 1] },
                opacity: { duration: 0.12 },
              },
            }}
            className="overflow-hidden"
          >
            <div className="space-y-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
