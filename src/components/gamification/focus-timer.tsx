import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, RotateCcw, Timer, Coffee, Trophy, Volume2, VolumeX } from 'lucide-react'
import { awardExplorerXp } from '@/stores/progress'
import { getSoundSettings } from '@/lib/sounds'

// ─── Types & Constants ───────────────────────────────────────────────────────

type TimerState = 'idle' | 'running' | 'paused' | 'break' | 'complete'

const DURATION_OPTIONS = [15, 25, 45] as const
const SESSIONS_PER_CYCLE = 4
const SHORT_BREAK_MINUTES = 5
const LONG_BREAK_MINUTES = 15

const FOCUS_STATS_KEY = 'focus-stats'

interface FocusStats {
  totalMinutes: number
  sessionsCompleted: number
  bestStreak: number
}

function loadFocusStats(): FocusStats {
  try {
    const raw = localStorage.getItem(FOCUS_STATS_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<FocusStats>
      return {
        totalMinutes: parsed.totalMinutes ?? 0,
        sessionsCompleted: parsed.sessionsCompleted ?? 0,
        bestStreak: parsed.bestStreak ?? 0,
      }
    }
  } catch { /* ignore */ }
  return { totalMinutes: 0, sessionsCompleted: 0, bestStreak: 0 }
}

function saveFocusStats(stats: FocusStats) {
  try {
    localStorage.setItem(FOCUS_STATS_KEY, JSON.stringify(stats))
  } catch { /* ignore */ }
}

// ─── Tick Sound ──────────────────────────────────────────────────────────────

let audioCtx: AudioContext | null = null

function playTick() {
  const settings = getSoundSettings()
  if (!settings.enabled) return

  try {
    if (!audioCtx) audioCtx = new AudioContext()
    const ctx = audioCtx
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(1200, ctx.currentTime)
    const vol = 0.02 * (settings.volume / 0.5)
    gain.gain.setValueAtTime(vol, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start()
    osc.stop(ctx.currentTime + 0.04)
  } catch { /* ignore */ }
}

function playChime() {
  const settings = getSoundSettings()
  if (!settings.enabled) return

  try {
    if (!audioCtx) audioCtx = new AudioContext()
    const ctx = audioCtx
    const notes = [523, 659, 784]
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.15)
      const vol = 0.08 * (settings.volume / 0.5)
      gain.gain.setValueAtTime(0, ctx.currentTime)
      gain.gain.linearRampToValueAtTime(vol, ctx.currentTime + i * 0.15)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.15 + 0.3)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(ctx.currentTime + i * 0.15)
      osc.stop(ctx.currentTime + i * 0.15 + 0.3)
    })
  } catch { /* ignore */ }
}

// ─── Component ───────────────────────────────────────────────────────────────

export function FocusTimer() {
  const [timerState, setTimerState] = useState<TimerState>('idle')
  const [duration, setDuration] = useState<number>(25)
  const [secondsLeft, setSecondsLeft] = useState(25 * 60)
  const [sessionCount, setSessionCount] = useState(0)
  const [cycleSessionCount, setCycleSessionCount] = useState(0)
  const [autoBreak, setAutoBreak] = useState(true)
  const [tickSound, setTickSound] = useState(false)
  const [totalXpAwarded, setTotalXpAwarded] = useState(0)

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const tickCountRef = useRef(0)

  const totalSeconds = timerState === 'break'
    ? (cycleSessionCount >= SESSIONS_PER_CYCLE ? LONG_BREAK_MINUTES : SHORT_BREAK_MINUTES) * 60
    : duration * 60
  const percent = totalSeconds > 0 ? Math.round(((totalSeconds - secondsLeft) / totalSeconds) * 100) : 0

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => clearTimer()
  }, [clearTimer])

  // Timer tick logic
  useEffect(() => {
    if (timerState !== 'running' && timerState !== 'break') {
      clearTimer()
      return
    }

    clearTimer()
    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearTimer()

          if (timerState === 'running') {
            // Session complete
            playChime()
            const newSessionCount = sessionCount + 1
            const newCycleCount = cycleSessionCount + 1
            setSessionCount(newSessionCount)
            setCycleSessionCount(newCycleCount)

            // Award XP
            const ts = Date.now()
            awardExplorerXp(5, `focus-session-${ts}`)
            let xpGained = 5

            // Update focus stats
            const stats = loadFocusStats()
            stats.totalMinutes += duration
            stats.sessionsCompleted += 1
            stats.bestStreak = Math.max(stats.bestStreak, newCycleCount)

            // Full cycle bonus
            if (newCycleCount >= SESSIONS_PER_CYCLE) {
              awardExplorerXp(25, `focus-cycle-${ts}`)
              xpGained += 25
            }

            saveFocusStats(stats)
            setTotalXpAwarded((prev) => prev + xpGained)

            // Check if full cycle is done
            if (newCycleCount >= SESSIONS_PER_CYCLE) {
              setTimerState('complete')
              return 0
            }

            // Auto-start break or show break prompt
            if (autoBreak) {
              const breakDuration = SHORT_BREAK_MINUTES * 60
              setTimerState('break')
              return breakDuration
            } else {
              setTimerState('break')
              return SHORT_BREAK_MINUTES * 60
            }
          } else {
            // Break complete — start next focus session
            playChime()
            setTimerState('running')
            return duration * 60
          }
        }

        // Play tick sound every 60 seconds when enabled
        tickCountRef.current += 1
        if (tickSound && tickCountRef.current % 60 === 0) {
          playTick()
        }

        return prev - 1
      })
    }, 1000)

    return () => clearTimer()
  }, [timerState, duration, sessionCount, cycleSessionCount, autoBreak, tickSound, clearTimer])

  const startSession = () => {
    setSecondsLeft(duration * 60)
    tickCountRef.current = 0
    setTimerState('running')
  }

  const togglePause = () => {
    if (timerState === 'running') {
      setTimerState('paused')
    } else if (timerState === 'paused') {
      setTimerState('running')
    } else if (timerState === 'break') {
      // Allow pause during break too
      setTimerState('paused')
    }
  }

  const resumeFromPause = () => {
    // Resume to whatever state we were in
    setTimerState('running')
  }

  const reset = () => {
    clearTimer()
    setTimerState('idle')
    setSecondsLeft(duration * 60)
    setSessionCount(0)
    setCycleSessionCount(0)
    setTotalXpAwarded(0)
    tickCountRef.current = 0
  }

  const minutes = Math.floor(secondsLeft / 60)
  const seconds = secondsLeft % 60
  const timeDisplay = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`

  return (
    <div className="rounded-xl border border-foreground/[0.08] bg-foreground/[0.02] p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-foreground/[0.06] flex items-center justify-center">
            <Timer className="w-3.5 h-3.5 text-foreground/60" />
          </div>
          <span className="text-sm font-mono uppercase tracking-wider text-foreground/50">
            Focus Timer
          </span>
        </div>
        {timerState !== 'idle' && timerState !== 'complete' && (
          <span className="text-[10px] font-mono text-foreground/40">
            Session {Math.min(cycleSessionCount + 1, SESSIONS_PER_CYCLE)} of {SESSIONS_PER_CYCLE}
          </span>
        )}
      </div>

      <AnimatePresence mode="wait">
        {timerState === 'idle' && (
          <motion.div
            key="idle"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="space-y-4"
          >
            {/* Duration selector */}
            <div className="flex items-center justify-center gap-2">
              {DURATION_OPTIONS.map((d) => (
                <button
                  key={d}
                  aria-label={`${d} minute focus session`}
                  aria-pressed={duration === d}
                  onClick={() => { setDuration(d); setSecondsLeft(d * 60) }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                    duration === d
                      ? 'bg-foreground/15 text-foreground/80 border border-foreground/20'
                      : 'bg-foreground/[0.04] text-foreground/40 border border-transparent hover:bg-foreground/[0.08] hover:text-foreground/60'
                  }`}
                >
                  {d}m
                </button>
              ))}
            </div>

            {/* Settings row */}
            <div className="flex items-center justify-center gap-4">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoBreak}
                  onChange={(e) => setAutoBreak(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-7 h-4 rounded-full bg-foreground/[0.08] peer-checked:bg-foreground/20 transition-colors relative">
                  <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-foreground/50 transition-all ${autoBreak ? 'left-3.5' : 'left-0.5'}`} />
                </div>
                <span className="text-[10px] font-mono text-foreground/40">Auto-break</span>
              </label>

              <button
                onClick={() => setTickSound(!tickSound)}
                aria-label={tickSound ? 'Disable tick sound' : 'Enable tick sound'}
                aria-pressed={tickSound}
                className="flex items-center gap-1 text-foreground/40 hover:text-foreground/60 transition-colors"
              >
                {tickSound ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                <span className="text-[10px] font-mono">Tick</span>
              </button>
            </div>

            {/* Start button */}
            <div className="flex justify-center">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={startSession}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-foreground/10 hover:bg-foreground/15 border border-foreground/[0.08] text-sm font-mono text-foreground/70 hover:text-foreground/90 transition-all"
              >
                <Play className="w-4 h-4 ml-0.5" />
                Start Focus Session
              </motion.button>
            </div>
          </motion.div>
        )}

        {(timerState === 'running' || timerState === 'paused' || timerState === 'break') && (
          <motion.div
            key="active"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="space-y-4"
          >
            {/* Circular progress ring + time display */}
            <div className="flex flex-col items-center gap-3">
              <div className="relative w-[120px] h-[120px]">
                <div
                  className="w-full h-full rounded-full transition-opacity duration-300"
                  style={{
                    background: `conic-gradient(currentColor ${percent * 3.6}deg, transparent ${percent * 3.6}deg)`,
                    opacity: timerState === 'break' ? 0.15 : 0.2,
                    mask: 'radial-gradient(farthest-side, transparent calc(100% - 5px), #000 calc(100% - 5px))',
                    WebkitMask: 'radial-gradient(farthest-side, transparent calc(100% - 5px), #000 calc(100% - 5px))',
                  }}
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  {timerState === 'break' ? (
                    <Coffee className="w-4 h-4 text-foreground/40 mb-1" />
                  ) : null}
                  <span
                    role="timer"
                    aria-live="polite"
                    aria-label={`${timerState === 'break' ? 'Break' : timerState === 'paused' ? 'Paused' : 'Focus'} timer: ${minutes} minutes and ${seconds} seconds remaining`}
                    className="text-2xl font-mono font-bold leading-none tracking-tight"
                  >
                    {timeDisplay}
                  </span>
                  <span className="text-[10px] font-mono text-foreground/40 mt-1" aria-hidden="true">
                    {timerState === 'break' ? 'Break' : timerState === 'paused' ? 'Paused' : 'Focusing'}
                  </span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={timerState === 'paused' ? resumeFromPause : togglePause}
                  aria-label={timerState === 'paused' ? 'Resume timer' : 'Pause timer'}
                  className="w-10 h-10 rounded-full bg-foreground/10 hover:bg-foreground/15 border border-foreground/[0.08] flex items-center justify-center text-foreground/70 hover:text-foreground/90 transition-all"
                >
                  {timerState === 'paused' ? (
                    <Play className="w-4 h-4 ml-0.5" />
                  ) : (
                    <Pause className="w-4 h-4" />
                  )}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={reset}
                  aria-label="Reset timer"
                  className="w-10 h-10 rounded-full bg-foreground/[0.04] hover:bg-foreground/[0.08] border border-foreground/[0.06] flex items-center justify-center text-foreground/40 hover:text-foreground/60 transition-all"
                >
                  <RotateCcw className="w-4 h-4" />
                </motion.button>
              </div>

              {/* Session dots */}
              <div className="flex items-center gap-1.5" role="group" aria-label={`Session progress: ${cycleSessionCount} of ${SESSIONS_PER_CYCLE} completed`}>
                {Array.from({ length: SESSIONS_PER_CYCLE }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full transition-all ${
                      i < cycleSessionCount
                        ? 'bg-foreground/40'
                        : i === cycleSessionCount
                          ? 'bg-foreground/20 ring-1 ring-foreground/10'
                          : 'bg-foreground/[0.08]'
                    }`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {timerState === 'complete' && (
          <motion.div
            key="complete"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="text-center space-y-4 py-2"
          >
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-foreground/[0.08] border border-foreground/[0.12] mx-auto">
              <Trophy className="w-5 h-5 text-foreground/60" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground/80">Cycle Complete!</p>
              <p className="text-xs text-foreground/40 mt-1">
                {sessionCount} sessions &middot; {sessionCount * duration} minutes focused
              </p>
              <p className="text-xs font-mono text-foreground/50 mt-1">
                +{totalXpAwarded} XP earned
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={reset}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-foreground/[0.06] hover:bg-foreground/10 border border-foreground/[0.08] text-xs font-mono text-foreground/60 hover:text-foreground/80 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Start New Cycle
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Focus Stats (for Analytics page) ────────────────────────────────────────

export function FocusStatsCard() {
  const [stats, setStats] = useState<FocusStats>(loadFocusStats)

  useEffect(() => {
    // Re-read on focus (user might have been on Dashboard tab)
    function onFocus() { setStats(loadFocusStats()) }
    window.addEventListener('focus', onFocus)
    return () => window.removeEventListener('focus', onFocus)
  }, [])

  const hours = Math.floor(stats.totalMinutes / 60)
  const mins = stats.totalMinutes % 60

  return (
    <div className="grid grid-cols-3 gap-3">
      <div className="rounded-lg border border-foreground/[0.08] bg-foreground/[0.03] p-4 text-center">
        <p className="text-2xl font-mono font-bold text-foreground/80">
          {hours > 0 ? `${hours}h ${mins}m` : `${mins}m`}
        </p>
        <p className="text-[10px] font-mono text-foreground/50 mt-1">Total Focus Time</p>
      </div>
      <div className="rounded-lg border border-foreground/[0.08] bg-foreground/[0.03] p-4 text-center">
        <p className="text-2xl font-mono font-bold text-foreground/80">
          {stats.sessionsCompleted}
        </p>
        <p className="text-[10px] font-mono text-foreground/50 mt-1">Sessions Completed</p>
      </div>
      <div className="rounded-lg border border-foreground/[0.08] bg-foreground/[0.03] p-4 text-center">
        <p className="text-2xl font-mono font-bold text-foreground/80">
          {stats.bestStreak}
        </p>
        <p className="text-[10px] font-mono text-foreground/50 mt-1">Best Streak</p>
      </div>
    </div>
  )
}
