import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, Flame, Compass, Eye, Award, X } from 'lucide-react'

const STORAGE_KEY = 'gamification-onboarded'

const RANKS = ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond']

function AnimatedXpCounter() {
  const [value, setValue] = useState(0)
  const target = 142

  useEffect(() => {
    let frame: number
    const start = performance.now()
    const duration = 1800

    function tick(now: number) {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.round(eased * target))
      if (progress < 1) frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [])

  return (
    <div className="flex items-center justify-center py-6">
      <motion.div
        className="relative flex items-center gap-2"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
      >
        <Zap className="w-8 h-8 text-foreground/60" />
        <span className="font-mono text-5xl font-bold tabular-nums">{value}</span>
        <span className="text-lg font-mono text-foreground/40 self-end mb-1">XP</span>
      </motion.div>
    </div>
  )
}

interface SlideProps {
  direction: number
}

function Slide1({ direction }: SlideProps) {
  return (
    <SlideWrapper direction={direction}>
      <h2 className="text-xl font-bold tracking-tight">Welcome to Your Learning Journey</h2>
      <p className="text-sm text-foreground/60 mt-2 leading-relaxed">
        Everything you do here earns XP and unlocks rewards. Complete lessons, maintain streaks, explore — it all counts.
      </p>
      <AnimatedXpCounter />
    </SlideWrapper>
  )
}

function Slide2({ direction }: SlideProps) {
  const items = [
    { icon: Zap, label: 'Complete lessons', detail: '+10-50 XP' },
    { icon: Flame, label: 'Maintain streaks', detail: 'up to 3x multiplier' },
    { icon: Compass, label: 'Explore the site', detail: '+5 XP per page' },
    { icon: Eye, label: 'Find easter eggs', detail: 'hidden bonuses' },
  ]

  return (
    <SlideWrapper direction={direction}>
      <h2 className="text-xl font-bold tracking-tight">How You Earn XP</h2>
      <ul className="mt-4 space-y-3">
        {items.map((item, i) => (
          <motion.li
            key={item.label}
            className="flex items-center gap-3"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 + i * 0.1 }}
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-foreground/[0.05] border border-foreground/[0.08]">
              <item.icon className="w-4 h-4 text-foreground/60" />
            </div>
            <div className="flex-1">
              <span className="text-sm font-medium">{item.label}</span>
              <span className="text-xs text-foreground/40 ml-2 font-mono">{item.detail}</span>
            </div>
          </motion.li>
        ))}
      </ul>
    </SlideWrapper>
  )
}

function Slide3({ direction }: SlideProps) {
  return (
    <SlideWrapper direction={direction}>
      <h2 className="text-xl font-bold tracking-tight">Unlock Rewards</h2>
      <p className="text-sm text-foreground/60 mt-2 leading-relaxed">
        Earn ranks, unlock cosmetic themes, discover secret pages, and climb the leaderboard.
      </p>
      <div className="flex items-center justify-center gap-2 mt-6">
        {RANKS.map((rank, i) => (
          <motion.div
            key={rank}
            className="flex flex-col items-center gap-1.5"
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 + i * 0.1 }}
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-full border border-foreground/[0.1] bg-foreground/[0.03]">
              <Award className="w-4 h-4 text-foreground/50" />
            </div>
            <span className="text-[10px] font-mono text-foreground/50">{rank}</span>
          </motion.div>
        ))}
      </div>
    </SlideWrapper>
  )
}

function Slide4({ direction, onDismiss }: SlideProps & { onDismiss: () => void }) {
  return (
    <SlideWrapper direction={direction}>
      <h2 className="text-xl font-bold tracking-tight">Ready?</h2>
      <p className="text-sm text-foreground/60 mt-2 leading-relaxed">
        Your journey starts now. Every interaction brings you closer to mastery.
      </p>
      <motion.button
        className="mt-6 w-full h-11 rounded-lg bg-foreground text-background font-medium text-sm hover:bg-foreground/90 transition-colors"
        onClick={onDismiss}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        Start Learning
      </motion.button>
      <p className="text-[11px] text-foreground/30 text-center mt-3 font-mono">
        5 easter eggs are hidden across the site. Can you find them all?
      </p>
    </SlideWrapper>
  )
}

function SlideWrapper({ children, direction }: { children: React.ReactNode; direction: number }) {
  return (
    <motion.div
      className="px-6 py-4"
      initial={{ x: direction > 0 ? 80 : -80, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: direction > 0 ? -80 : 80, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      {children}
    </motion.div>
  )
}

export function WelcomeModal() {
  const [visible, setVisible] = useState(false)
  const [slide, setSlide] = useState(0)
  const [direction, setDirection] = useState(1)
  const modalRef = useRef<HTMLDivElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)
  const totalSlides = 4

  useEffect(() => {
    try {
      const onboarded = localStorage.getItem(STORAGE_KEY)
      if (!onboarded) {
        setVisible(true)
      }
    } catch {
      // localStorage not available
    }
  }, [])

  // Focus trap and auto-focus
  useEffect(() => {
    if (!visible) return

    previousFocusRef.current = document.activeElement as HTMLElement

    // Auto-focus first focusable element
    const timer = setTimeout(() => {
      const focusable = modalRef.current?.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      if (focusable && focusable.length > 0) {
        focusable[0].focus()
      }
    }, 100)

    return () => {
      clearTimeout(timer)
      // Restore focus on close
      previousFocusRef.current?.focus()
    }
  }, [visible])

  // Focus trap keyboard handler
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      dismiss()
      return
    }

    if (e.key !== 'Tab') return

    const focusable = modalRef.current?.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    if (!focusable || focusable.length === 0) return

    const first = focusable[0]
    const last = focusable[focusable.length - 1]

    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault()
        last.focus()
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
  }, [])

  function dismiss() {
    try {
      localStorage.setItem(STORAGE_KEY, 'true')
    } catch {}
    setVisible(false)
  }

  function next() {
    if (slide < totalSlides - 1) {
      setDirection(1)
      setSlide(slide + 1)
    }
  }

  function prev() {
    if (slide > 0) {
      setDirection(-1)
      setSlide(slide - 1)
    }
  }

  const slides = [
    <Slide1 key="s1" direction={direction} />,
    <Slide2 key="s2" direction={direction} />,
    <Slide3 key="s3" direction={direction} />,
    <Slide4 key="s4" direction={direction} onDismiss={dismiss} />,
  ]

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={dismiss}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal */}
          <motion.div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-label="Welcome onboarding"
            onKeyDown={handleKeyDown}
            className="relative w-full max-w-md rounded-2xl border border-foreground/[0.08] bg-background shadow-2xl overflow-hidden"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            {/* Skip button */}
            <button
              onClick={dismiss}
              className="absolute top-3 right-3 z-10 p-1.5 rounded-lg text-foreground/30 hover:text-foreground/60 hover:bg-foreground/[0.05] transition-all"
              aria-label="Skip onboarding"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Slide content */}
            <div className="min-h-[280px] flex flex-col justify-center pt-8 pb-4">
              <AnimatePresence mode="wait" initial={false}>
                {slides[slide]}
              </AnimatePresence>
            </div>

            {/* Footer: dots + navigation */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-foreground/[0.05]">
              {/* Previous */}
              <button
                onClick={prev}
                disabled={slide === 0}
                aria-label={`Go to previous slide (${slide} of ${totalSlides})`}
                className="text-xs font-mono text-foreground/40 hover:text-foreground/70 disabled:opacity-0 disabled:pointer-events-none transition-all"
              >
                Back
              </button>

              {/* Dots */}
              <div className="flex items-center gap-1.5">
                {Array.from({ length: totalSlides }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                      i === slide ? 'bg-foreground/70 w-4' : 'bg-foreground/20'
                    }`}
                  />
                ))}
              </div>

              {/* Next */}
              {slide < totalSlides - 1 ? (
                <button
                  onClick={next}
                  aria-label={`Go to next slide (${slide + 2} of ${totalSlides})`}
                  className="text-xs font-mono text-foreground/60 hover:text-foreground transition-all"
                >
                  Next
                </button>
              ) : (
                <div className="w-8" />
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
