import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Command, X } from 'lucide-react'

const STORAGE_KEY = 'shortcut-hint-dismissed'
const AUTO_DISMISS_MS = 5000

export function ShortcutHint() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY)) return
    // Small delay so it doesn't compete with page load animations
    const showTimer = setTimeout(() => setVisible(true), 800)
    return () => clearTimeout(showTimer)
  }, [])

  useEffect(() => {
    if (!visible) return
    const timer = setTimeout(() => dismiss(), AUTO_DISMISS_MS)
    return () => clearTimeout(timer)
  }, [visible])

  function dismiss() {
    setVisible(false)
    localStorage.setItem(STORAGE_KEY, '1')
  }

  const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.userAgent)

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-lg border border-foreground/10 bg-background/90 backdrop-blur-sm px-3 py-2 shadow-lg"
        >
          <span className="text-xs font-mono text-foreground/50">
            Press{' '}
            <kbd className="inline-flex items-center gap-0.5 rounded border border-foreground/10 bg-foreground/[0.04] px-1.5 py-0.5 text-[10px] font-mono text-foreground/60">
              {isMac ? <Command className="h-2.5 w-2.5 inline" /> : 'Ctrl+'}K
            </kbd>
            {' '}to open commands
          </span>
          <button
            onClick={dismiss}
            className="ml-1 rounded p-0.5 text-foreground/30 hover:text-foreground/60 transition-colors"
            aria-label="Dismiss shortcut hint"
          >
            <X className="h-3 w-3" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
