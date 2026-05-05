import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { SEO } from '@/components/SEO'
import { Home, BookOpen, Briefcase, Mail, Palette } from 'lucide-react'
import { usePatienceEgg } from '@/components/gamification/easter-egg-handler'
import { useAuth } from '@/hooks/use-auth'
import { getExplorerProgress, getDiscoveredCount, TOTAL_EASTER_EGGS } from '@/lib/explorer'
import { useState, useEffect, useRef, useCallback, useMemo } from 'react'

// --- Glitch 404 Text ---
const GLITCH_CHARS = '!@#$%^&*()_+=-[]{}|;:<>?/~`0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'

function Glitch404() {
  const [display, setDisplay] = useState('404')
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    // Random glitch every 3-6 seconds
    const scheduleGlitch = () => {
      const delay = 3000 + Math.random() * 3000
      intervalRef.current = setTimeout(() => {
        // Rapid character substitution for 300ms
        let count = 0
        const rapid = setInterval(() => {
          const chars = Array.from({ length: 3 }, () =>
            GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]
          ).join('')
          setDisplay(chars)
          count++
          if (count >= 4) {
            clearInterval(rapid)
            setDisplay('404')
          }
        }, 70)
        scheduleGlitch()
      }, delay) as unknown as ReturnType<typeof setInterval>
    }
    scheduleGlitch()
    return () => {
      if (intervalRef.current) clearTimeout(intervalRef.current as unknown as number)
    }
  }, [])

  return (
    <div className="relative select-none">
      <h1 className="text-[clamp(8rem,20vw,14rem)] font-bold leading-none tracking-tighter text-foreground glitch-text">
        {display}
      </h1>
      {/* Glitch layers via CSS */}
      <span
        className="absolute inset-0 text-[clamp(8rem,20vw,14rem)] font-bold leading-none tracking-tighter text-foreground glitch-layer-1 pointer-events-none"
        aria-hidden
      >
        {display}
      </span>
      <span
        className="absolute inset-0 text-[clamp(8rem,20vw,14rem)] font-bold leading-none tracking-tighter text-foreground glitch-layer-2 pointer-events-none"
        aria-hidden
      >
        {display}
      </span>
    </div>
  )
}

// --- Interactive ASCII Art ---
type EyeDirection = 'center' | 'left' | 'right' | 'up' | 'down'

function AsciiCharacter() {
  const [direction, setDirection] = useState<EyeDirection>('center')
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const dx = e.clientX - centerX
    const dy = e.clientY - centerY
    const threshold = 100

    if (Math.abs(dx) < threshold && Math.abs(dy) < threshold) {
      setDirection('center')
    } else if (Math.abs(dx) > Math.abs(dy)) {
      setDirection(dx > 0 ? 'right' : 'left')
    } else {
      setDirection(dy > 0 ? 'down' : 'up')
    }
  }, [])

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [handleMouseMove])

  const face = useMemo(() => {
    switch (direction) {
      case 'left':
        return '(o_- )'
      case 'right':
        return '( -_o)'
      case 'up':
        return '(^_^)'
      case 'down':
        return '(._. )'
      default:
        return '(o_o)'
    }
  }, [direction])

  return (
    <div ref={containerRef} className="font-mono text-foreground/60 text-lg md:text-xl mt-6 select-none">
      <pre className="inline-block text-center leading-relaxed">
        {`    ${face}\n    /|  |\\\n     |  |\n    /    \\\n`}
      </pre>
      <p className="text-xs text-foreground/30 mt-2 font-mono">
        {'// lost in the void'}
      </p>
    </div>
  )
}

// --- Patience Hint ---
function PatienceHint() {
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 10000) // 10s
    const t2 = setTimeout(() => setPhase(2), 20000) // 20s
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [])

  if (phase === 0) return null

  return (
    <motion.p
      className="text-xs font-mono text-foreground/20 mt-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2 }}
      key={phase}
    >
      {phase === 1 ? '...' : 'patience...'}
    </motion.p>
  )
}

// --- Navigation Cards ---
const NAV_ITEMS = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/curriculum', label: 'Curriculum', icon: BookOpen },
  { to: '/projects', label: 'Projects', icon: Briefcase },
  { to: '/art', label: 'Art', icon: Palette },
  { to: '/contact', label: 'Contact', icon: Mail },
] as const

function NavigationCards() {
  return (
    <div className="mt-12 w-full max-w-md mx-auto">
      <p className="text-xs font-mono text-foreground/40 mb-4 text-center">
        Maybe you were looking for:
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className="group flex items-center gap-2 px-3 py-2.5 rounded-lg border border-foreground/[0.08] bg-foreground/[0.02] hover:bg-foreground/[0.05] hover:border-foreground/15 transition-all"
          >
            <Icon className="h-3.5 w-3.5 text-foreground/40 group-hover:text-foreground/70 transition-colors" />
            <span className="text-sm text-foreground/60 group-hover:text-foreground/90 transition-colors">
              {label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}

// --- Fun Stats (auth'd users) ---
function FunStats() {
  const { isLoggedIn } = useAuth()
  if (!isLoggedIn) return null

  const { visited } = getExplorerProgress()
  const eggsFound = getDiscoveredCount()

  return (
    <motion.div
      className="mt-10 text-xs font-mono text-foreground/30 space-y-1"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1, duration: 1 }}
    >
      <p>Pages you HAVE found: {visited}</p>
      <p>Easter eggs discovered: {eggsFound}/{TOTAL_EASTER_EGGS}</p>
      <p className="text-foreground/20 italic mt-2">Keep exploring...</p>
    </motion.div>
  )
}

// --- Main Page ---
export default function NotFound() {
  const { t } = useTranslation()
  const { showMessage } = usePatienceEgg()

  return (
    <>
      <SEO
        title={`404 - ${t('notFound.title')}`}
        description={t('notFound.description')}
        noindex
      />

      {/* Glitch CSS keyframes */}
      <style>{`
        @keyframes glitch-clip-1 {
          0%, 100% { clip-path: inset(40% 0 50% 0); transform: translate(-2px, 0); }
          20% { clip-path: inset(10% 0 75% 0); transform: translate(2px, 0); }
          40% { clip-path: inset(60% 0 10% 0); transform: translate(-1px, 0); }
          60% { clip-path: inset(20% 0 60% 0); transform: translate(3px, 0); }
          80% { clip-path: inset(80% 0 5% 0); transform: translate(-2px, 0); }
        }
        @keyframes glitch-clip-2 {
          0%, 100% { clip-path: inset(70% 0 10% 0); transform: translate(2px, 0); }
          25% { clip-path: inset(5% 0 80% 0); transform: translate(-3px, 0); }
          50% { clip-path: inset(50% 0 30% 0); transform: translate(1px, 0); }
          75% { clip-path: inset(30% 0 50% 0); transform: translate(-1px, 0); }
        }
        @keyframes glitch-flicker {
          0%, 100% { opacity: 1; }
          3% { opacity: 0.7; }
          6% { opacity: 1; }
          7.5% { opacity: 0.85; }
          9% { opacity: 1; }
          50% { opacity: 1; }
          52% { opacity: 0.9; }
          53% { opacity: 1; }
        }
        .glitch-text {
          animation: glitch-flicker 4s infinite;
        }
        .glitch-layer-1 {
          animation: glitch-clip-1 3s infinite linear;
          opacity: 0.08;
        }
        .glitch-layer-2 {
          animation: glitch-clip-2 2.5s infinite linear reverse;
          opacity: 0.06;
        }
      `}</style>

      <div className="min-h-[80vh] flex items-center justify-center px-6">
        <div className="flex flex-col items-center text-center">
          {/* Dominant 404 glitch text */}
          <Glitch404 />

          {/* Subtitle */}
          <motion.h2
            className="text-lg md:text-xl font-mono text-foreground/50 mt-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            {t('notFound.title')}
          </motion.h2>

          {/* Interactive ASCII character */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <AsciiCharacter />
          </motion.div>

          {/* Navigation cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
          >
            <NavigationCards />
          </motion.div>

          {/* Fun stats for logged in users */}
          <FunStats />

          {/* Patience hint (subtle, appears over time) */}
          <PatienceHint />

          {/* Patience easter egg message (fires at 30s via existing hook) */}
          <AnimatePresence>
            {showMessage && (
              <motion.p
                className="text-sm text-foreground/50 font-mono mt-8 max-w-sm mx-auto"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
              >
                You waited. Most people don't. Here's your reward.
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  )
}
