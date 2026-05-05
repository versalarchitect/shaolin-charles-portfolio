import { useEffect, useRef, useState, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { toast } from 'sonner'
import { trackEasterEgg, isEggDiscovered } from '@/lib/explorer'
import { MatrixRain } from './matrix-rain'
import { DevConsoleModal } from './dev-console-modal'

const KONAMI_SEQUENCE = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a']

export function EasterEggHandler() {
  const [showGlitch, setShowGlitch] = useState(false)
  const [showMatrix, setShowMatrix] = useState(false)
  const [showDevConsole, setShowDevConsole] = useState(false)

  // Konami code tracker
  const konamiIndex = useRef(0)

  // Matrix word tracker
  const matrixBuffer = useRef('')
  const matrixTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  // --- Konami Code ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isInputFocused()) return

      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key
      const expected = KONAMI_SEQUENCE[konamiIndex.current]

      if (key === expected) {
        konamiIndex.current++
        if (konamiIndex.current === KONAMI_SEQUENCE.length) {
          konamiIndex.current = 0
          triggerKonami()
        }
      } else {
        konamiIndex.current = 0
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // --- Matrix typing ---
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (isInputFocused()) return
      if (e.key.length !== 1) return

      matrixBuffer.current += e.key.toLowerCase()

      // Reset buffer after 2 seconds of inactivity
      if (matrixTimeout.current) clearTimeout(matrixTimeout.current)
      matrixTimeout.current = setTimeout(() => {
        matrixBuffer.current = ''
      }, 2000)

      // Check if buffer ends with "matrix"
      if (matrixBuffer.current.endsWith('matrix')) {
        matrixBuffer.current = ''
        triggerMatrix()
      }
    }

    window.addEventListener('keypress', handleKeyPress)
    return () => {
      window.removeEventListener('keypress', handleKeyPress)
      if (matrixTimeout.current) clearTimeout(matrixTimeout.current)
    }
  }, [])

  // --- Dev Console (Ctrl/Cmd + Shift + D) ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'd') {
        e.preventDefault()
        triggerDevConsole()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // --- Trigger functions ---
  function triggerKonami() {
    if (isEggDiscovered('konami')) return

    setShowGlitch(true)
    setTimeout(() => setShowGlitch(false), 600)

    const { awarded } = trackEasterEgg('konami', 50)
    if (awarded) {
      setTimeout(() => {
        toast('You found a secret! +50 XP', {
          description: 'The Konami Code lives on.',
        })
      }, 700)
    }
  }

  function triggerMatrix() {
    if (isEggDiscovered('matrix')) return

    setShowMatrix(true)
    const { awarded } = trackEasterEgg('matrix', 30)
    if (awarded) {
      setTimeout(() => {
        toast('You found a secret! +30 XP', {
          description: 'Wake up, Neo...',
        })
      }, 1000)
    }
  }

  function triggerDevConsole() {
    if (isEggDiscovered('dev-console') && !showDevConsole) {
      // Still allow opening even if already discovered, just no XP
      setShowDevConsole(true)
      return
    }

    setShowDevConsole(true)
    const { awarded } = trackEasterEgg('dev-console', 25)
    if (awarded) {
      setTimeout(() => {
        toast('You found a secret! +25 XP', {
          description: 'Access granted to developer console.',
        })
      }, 500)
    }
  }

  const handleMatrixComplete = useCallback(() => {
    setShowMatrix(false)
  }, [])

  const handleDevConsoleClose = useCallback(() => {
    setShowDevConsole(false)
  }, [])

  return (
    <>
      {/* Glitch overlay for Konami code */}
      <AnimatePresence>
        {showGlitch && (
          <motion.div
            className="fixed inset-0 z-[200] pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
          >
            <div className="absolute inset-0 animate-glitch-1 bg-foreground/[0.03]" />
            <div className="absolute inset-0 animate-glitch-2 bg-foreground/[0.02]" />
            <div className="absolute inset-0 animate-glitch-3 mix-blend-overlay">
              <div className="h-1/3 bg-foreground/[0.05] translate-x-1" />
              <div className="h-1/3 bg-foreground/[0.03] -translate-x-2" />
              <div className="h-1/3 bg-foreground/[0.05] translate-x-1" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Matrix rain overlay */}
      <AnimatePresence>
        {showMatrix && <MatrixRain onComplete={handleMatrixComplete} />}
      </AnimatePresence>

      {/* Dev console modal */}
      <DevConsoleModal open={showDevConsole} onClose={handleDevConsoleClose} />

      {/* Inline glitch keyframes */}
      {showGlitch && (
        <style>{`
          @keyframes glitch-1 {
            0%, 100% { clip-path: inset(0 0 90% 0); transform: translate(-2px, 0); }
            20% { clip-path: inset(30% 0 40% 0); transform: translate(2px, 0); }
            40% { clip-path: inset(60% 0 10% 0); transform: translate(-1px, 0); }
            60% { clip-path: inset(10% 0 70% 0); transform: translate(3px, 0); }
            80% { clip-path: inset(80% 0 5% 0); transform: translate(-2px, 0); }
          }
          @keyframes glitch-2 {
            0%, 100% { clip-path: inset(80% 0 0 0); transform: translate(2px, 0); }
            25% { clip-path: inset(10% 0 60% 0); transform: translate(-3px, 0); }
            50% { clip-path: inset(50% 0 20% 0); transform: translate(1px, 0); }
            75% { clip-path: inset(20% 0 50% 0); transform: translate(-2px, 0); }
          }
          @keyframes glitch-3 {
            0% { opacity: 0; }
            10% { opacity: 1; }
            20% { opacity: 0; }
            30% { opacity: 1; }
            40% { opacity: 0; }
            100% { opacity: 0; }
          }
          .animate-glitch-1 { animation: glitch-1 0.3s steps(2) infinite; }
          .animate-glitch-2 { animation: glitch-2 0.3s steps(3) infinite reverse; }
          .animate-glitch-3 { animation: glitch-3 0.6s steps(1) forwards; }
        `}</style>
      )}
    </>
  )
}

/**
 * Hook for the speed-click easter egg. Attach to the logo/header element.
 * Returns handleClick function. When 7 rapid clicks detected, awards XP and returns true.
 */
export function useSpeedClickEgg() {
  const clickTimestamps = useRef<number[]>([])

  const handleClick = useCallback(() => {
    if (isEggDiscovered('speed-click')) return false

    const now = Date.now()
    clickTimestamps.current.push(now)

    // Keep only clicks within the last 3 seconds
    clickTimestamps.current = clickTimestamps.current.filter(
      (t) => now - t < 3000
    )

    if (clickTimestamps.current.length >= 7) {
      clickTimestamps.current = []
      const { awarded } = trackEasterEgg('speed-click', 20)
      if (awarded) {
        toast('You found a secret! +20 XP', {
          description: 'Speed clicker detected!',
        })
      }
      return true // Signal to trigger animation
    }
    return false
  }, [])

  return { handleClick }
}

/**
 * Hook for the patience easter egg. Use on the 404 page.
 * Shows a hidden message after 30 seconds on the page.
 */
export function usePatienceEgg() {
  const [showMessage, setShowMessage] = useState(false)

  useEffect(() => {
    if (isEggDiscovered('patience')) return

    const timeout = setTimeout(() => {
      const { awarded } = trackEasterEgg('patience', 35)
      if (awarded) {
        setShowMessage(true)
        toast('You found a secret! +35 XP', {
          description: 'Patience is a virtue.',
        })
      }
    }, 30000) // 30 seconds

    return () => clearTimeout(timeout)
  }, [])

  return { showMessage }
}

function isInputFocused(): boolean {
  const el = document.activeElement
  if (!el) return false
  const tag = el.tagName.toLowerCase()
  return tag === 'input' || tag === 'textarea' || tag === 'select' || (el as HTMLElement).isContentEditable
}
