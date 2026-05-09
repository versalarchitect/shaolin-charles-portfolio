import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { X } from 'lucide-react'
import { useProgress } from '@/stores/progress'
import { getDiscoveredCount, TOTAL_EASTER_EGGS } from '@/lib/explorer'

interface DevConsoleModalProps {
  open: boolean
  onClose: () => void
}

const BOOT_LINES = [
  '> Initializing system...',
  '> Loading kernel modules...',
  '> Mounting filesystem...',
  '> Scanning for secrets...',
  '> System ready.',
  '',
  '--- SYSTEM STATS ---',
]

export function DevConsoleModal({ open, onClose }: DevConsoleModalProps) {
  const [visibleLines, setVisibleLines] = useState<string[]>([])
  const [statsLines, setStatsLines] = useState<string[]>([])
  const [bootComplete, setBootComplete] = useState(false)
  const progress = useProgress()

  const generateStats = useCallback((): string[] => {
    const coffeeCount = Math.floor(Math.random() * 42) + 7
    const bugsSquashed = Math.floor(Math.random() * 999) + 100
    return [
      `XP Generated:          ${progress.totalXp}`,
      `Current Streak:        ${progress.currentStreak} day${progress.currentStreak !== 1 ? 's' : ''}`,
      `Achievements Unlocked: ${progress.unlockedAchievements.length}`,
      `Easter Eggs Found:     ${getDiscoveredCount()}/${TOTAL_EASTER_EGGS}`,
      `Lines of Code Read:    ∞`,
      `Bugs Squashed:         ${bugsSquashed}`,
      `Coffee Consumed:       ${coffeeCount} cups`,
      `Time Wasted on CSS:    too much`,
      '',
      '> Type "exit" to close. Or just press Escape.',
      '> You weren\'t supposed to find this.',
    ]
  }, [progress.totalXp, progress.currentStreak, progress.unlockedAchievements.length])

  useEffect(() => {
    if (!open) {
      setVisibleLines([])
      setStatsLines([])
      setBootComplete(false)
      return
    }

    // Stagger boot lines
    let lineIndex = 0
    const bootInterval = setInterval(() => {
      if (lineIndex < BOOT_LINES.length) {
        setVisibleLines((prev) => [...prev, BOOT_LINES[lineIndex]])
        lineIndex++
      } else {
        clearInterval(bootInterval)
        setBootComplete(true)
      }
    }, 150)

    return () => clearInterval(bootInterval)
  }, [open])

  useEffect(() => {
    if (!bootComplete) return

    const stats = generateStats()
    let statIndex = 0
    const statsInterval = setInterval(() => {
      if (statIndex < stats.length) {
        setStatsLines((prev) => [...prev, stats[statIndex]])
        statIndex++
      } else {
        clearInterval(statsInterval)
      }
    }, 120)

    return () => clearInterval(statsInterval)
  }, [bootComplete, generateStats])

  useEffect(() => {
    if (!open) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-background/80 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="relative w-full max-w-xl mx-4 rounded-xl border border-foreground/20 bg-background shadow-2xl overflow-hidden"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Title bar */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-foreground/10 bg-foreground/[0.03]">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-foreground/20" />
                <div className="w-3 h-3 rounded-full bg-foreground/20" />
                <div className="w-3 h-3 rounded-full bg-foreground/20" />
              </div>
              <span className="text-xs font-mono text-foreground/50">dev-console v0.1.337</span>
              <button
                onClick={onClose}
                className="p-1 rounded hover:bg-foreground/10 transition-colors"
                aria-label="Close console"
              >
                <X className="w-4 h-4 text-foreground/60" />
              </button>
            </div>

            {/* Terminal body */}
            <div className="p-4 h-80 overflow-y-auto font-mono text-sm text-foreground/80 space-y-0.5">
              {visibleLines.map((line, i) => (
                <motion.div
                  key={`boot-${i}`}
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.1 }}
                  className={line.startsWith('---') ? 'text-foreground/40 mt-2' : ''}
                >
                  {line || ' '}
                </motion.div>
              ))}
              {statsLines.map((line, i) => (
                <motion.div
                  key={`stat-${i}`}
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.1 }}
                  className={line.startsWith('>') ? 'text-foreground/50 mt-1' : ''}
                >
                  {line || ' '}
                </motion.div>
              ))}
              {bootComplete && statsLines.length === 0 && (
                <motion.span
                  className="inline-block w-2 h-4 bg-foreground/60"
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                />
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
