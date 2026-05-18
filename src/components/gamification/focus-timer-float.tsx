import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'motion/react'
import { Play, Pause, RotateCcw, Timer, Coffee, Trophy, X, Volume2, VolumeX } from 'lucide-react'
import { awardExplorerXp } from '@/stores/progress'
import { getSoundSettings } from '@/lib/sounds'

type TimerState = 'idle' | 'running' | 'paused' | 'break' | 'complete'

const DURATION_OPTIONS = [15, 25, 45] as const
const SESSIONS_PER_CYCLE = 4
const SHORT_BREAK_MINUTES = 5
const LONG_BREAK_MINUTES = 15
const FOCUS_STATS_KEY = 'focus-stats'
const FOCUS_POS_KEY = 'focus-timer-pos'

function loadPosition(): { x: number; y: number } {
  try {
    const raw = localStorage.getItem(FOCUS_POS_KEY)
    if (raw) return JSON.parse(raw)
  } catch { /* ignore */ }
  return { x: 0, y: 0 }
}

function savePosition(pos: { x: number; y: number }) {
  try { localStorage.setItem(FOCUS_POS_KEY, JSON.stringify(pos)) } catch { /* ignore */ }
}

interface FocusStats { totalMinutes: number; sessionsCompleted: number; bestStreak: number }

function loadFocusStats(): FocusStats {
  try {
    const raw = localStorage.getItem(FOCUS_STATS_KEY)
    if (raw) {
      const p = JSON.parse(raw) as Partial<FocusStats>
      return { totalMinutes: p.totalMinutes ?? 0, sessionsCompleted: p.sessionsCompleted ?? 0, bestStreak: p.bestStreak ?? 0 }
    }
  } catch { /* ignore */ }
  return { totalMinutes: 0, sessionsCompleted: 0, bestStreak: 0 }
}

function saveFocusStats(stats: FocusStats) {
  try { localStorage.setItem(FOCUS_STATS_KEY, JSON.stringify(stats)) } catch { /* ignore */ }
}

let audioCtx: AudioContext | null = null

function playTick() {
  const s = getSoundSettings()
  if (!s.enabled) return
  try {
    if (!audioCtx) audioCtx = new AudioContext()
    const ctx = audioCtx, osc = ctx.createOscillator(), gain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(1200, ctx.currentTime)
    gain.gain.setValueAtTime(0.02 * (s.volume / 0.5), ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04)
    osc.connect(gain); gain.connect(ctx.destination); osc.start(); osc.stop(ctx.currentTime + 0.04)
  } catch { /* ignore */ }
}

function playChime() {
  const s = getSoundSettings()
  if (!s.enabled) return
  try {
    if (!audioCtx) audioCtx = new AudioContext()
    const ctx = audioCtx
    ;[523, 659, 784].forEach((freq, i) => {
      const osc = ctx.createOscillator(), gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.15)
      const vol = 0.08 * (s.volume / 0.5)
      gain.gain.setValueAtTime(0, ctx.currentTime)
      gain.gain.linearRampToValueAtTime(vol, ctx.currentTime + i * 0.15)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.15 + 0.3)
      osc.connect(gain); gain.connect(ctx.destination)
      osc.start(ctx.currentTime + i * 0.15); osc.stop(ctx.currentTime + i * 0.15 + 0.3)
    })
  } catch { /* ignore */ }
}

export function FocusTimerFloat() {
  const { t } = useTranslation()
  const [expanded, setExpanded] = useState(false)
  const [timerState, setTimerState] = useState<TimerState>('idle')
  const [duration, setDuration] = useState(25)
  const [secondsLeft, setSecondsLeft] = useState(25 * 60)
  const [sessionCount, setSessionCount] = useState(0)
  const [cycleSessionCount, setCycleSessionCount] = useState(0)
  const [autoBreak, setAutoBreak] = useState(true)
  const [tickSound, setTickSound] = useState(false)
  const [totalXpAwarded, setTotalXpAwarded] = useState(0)
  const [dragPos, setDragPos] = useState(loadPosition)
  const [isDragging, setIsDragging] = useState(false)
  const dragRef = useRef(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const tickCountRef = useRef(0)
  const panelRef = useRef<HTMLDivElement>(null)
  const constraintsRef = useRef<HTMLDivElement>(null)

  const totalSeconds = timerState === 'break'
    ? (cycleSessionCount >= SESSIONS_PER_CYCLE ? LONG_BREAK_MINUTES : SHORT_BREAK_MINUTES) * 60
    : duration * 60
  const percent = totalSeconds > 0 ? Math.round(((totalSeconds - secondsLeft) / totalSeconds) * 100) : 0

  const clearTimer = useCallback(() => {
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null }
  }, [])

  useEffect(() => () => clearTimer(), [clearTimer])

  useEffect(() => {
    if (timerState !== 'running' && timerState !== 'break') { clearTimer(); return }
    clearTimer()
    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearTimer()
          if (timerState === 'running') {
            playChime()
            const newSession = sessionCount + 1, newCycle = cycleSessionCount + 1
            setSessionCount(newSession); setCycleSessionCount(newCycle)
            const ts = Date.now()
            awardExplorerXp(5, `focus-session-${ts}`)
            let xp = 5
            const stats = loadFocusStats()
            stats.totalMinutes += duration; stats.sessionsCompleted += 1
            stats.bestStreak = Math.max(stats.bestStreak, newCycle)
            if (newCycle >= SESSIONS_PER_CYCLE) { awardExplorerXp(25, `focus-cycle-${ts}`); xp += 25 }
            saveFocusStats(stats); setTotalXpAwarded(p => p + xp)
            if (newCycle >= SESSIONS_PER_CYCLE) { setTimerState('complete'); return 0 }
            setTimerState('break')
            return SHORT_BREAK_MINUTES * 60
          }
          playChime(); setTimerState('running'); return duration * 60
        }
        tickCountRef.current += 1
        if (tickSound && tickCountRef.current % 60 === 0) playTick()
        return prev - 1
      })
    }, 1000)
    return () => clearTimer()
  }, [timerState, duration, sessionCount, cycleSessionCount, autoBreak, tickSound, clearTimer])

  // Close on outside click
  useEffect(() => {
    if (!expanded) return
    function handleClick(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) setExpanded(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [expanded])

  const startSession = () => { setSecondsLeft(duration * 60); tickCountRef.current = 0; setTimerState('running') }
  const pausedFromRef = useRef<'running' | 'break'>('running')
  const togglePause = () => {
    if (timerState === 'running') { pausedFromRef.current = 'running'; setTimerState('paused') }
    else if (timerState === 'paused') setTimerState(pausedFromRef.current)
    else if (timerState === 'break') { pausedFromRef.current = 'break'; setTimerState('paused') }
  }
  const resumeFromPause = () => setTimerState(pausedFromRef.current)
  const reset = () => {
    clearTimer(); setTimerState('idle'); setSecondsLeft(duration * 60)
    setSessionCount(0); setCycleSessionCount(0); setTotalXpAwarded(0); tickCountRef.current = 0
  }

  const minutes = Math.floor(secondsLeft / 60)
  const seconds = secondsLeft % 60
  const timeDisplay = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  const isActive = timerState === 'running' || timerState === 'paused' || timerState === 'break'

  return (
    <>
    <div ref={constraintsRef} className="fixed inset-0 z-50 pointer-events-none" />
    <motion.div
      ref={panelRef}
      drag
      dragMomentum={false}
      dragConstraints={constraintsRef}
      dragElastic={0.1}
      initial={dragPos}
      onDragStart={() => { setIsDragging(true); dragRef.current = true }}
      onDragEnd={(_, info) => {
        setIsDragging(false)
        const newPos = { x: dragPos.x + info.offset.x, y: dragPos.y + info.offset.y }
        setDragPos(newPos)
        savePosition(newPos)
        setTimeout(() => { dragRef.current = false }, 0)
      }}
      className="fixed top-4 right-4 z-50 lg:right-6 touch-none"
      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
    >
      {/* Pill */}
      <motion.button
        onClick={() => { if (!dragRef.current) setExpanded(!expanded) }}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className={`flex items-center gap-2 rounded-full border backdrop-blur-md shadow-lg transition-colors ${
          isActive
            ? 'bg-foreground/[0.12] border-foreground/20 text-foreground/90 px-3.5 py-2'
            : timerState === 'complete'
              ? 'bg-foreground/[0.1] border-foreground/15 text-foreground/80 px-3.5 py-2'
              : 'bg-foreground/[0.06] border-foreground/[0.1] text-foreground/50 hover:text-foreground/70 px-2.5 py-2'
        }`}
      >
        {isActive ? (
          <>
            <div className={`w-1.5 h-1.5 rounded-full ${timerState === 'break' ? 'bg-foreground/40' : timerState === 'paused' ? 'bg-foreground/30' : 'bg-foreground/60 animate-pulse'}`} />
            <span className="text-xs font-mono font-medium tabular-nums">{timeDisplay}</span>
          </>
        ) : timerState === 'complete' ? (
          <>
            <Trophy className="w-3.5 h-3.5" />
            <span className="text-xs font-mono">Done</span>
          </>
        ) : (
          <Timer className="w-4 h-4" />
        )}
      </motion.button>

      {/* Expanded panel */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ type: 'spring', bounce: 0.15, duration: 0.3 }}
            className="absolute top-full right-0 mt-2 w-64 rounded-2xl border border-foreground/[0.1] bg-background/95 backdrop-blur-xl shadow-xl overflow-hidden"
          >
            <div className="p-4 space-y-3">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Timer className="w-3.5 h-3.5 text-foreground/50" />
                  <span className="text-[10px] font-mono uppercase tracking-wider text-foreground/50">{t('focusTimer.title')}</span>
                </div>
                <button onClick={() => setExpanded(false)} className="p-1 rounded-md text-foreground/30 hover:text-foreground/60 transition-colors">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <AnimatePresence mode="wait">
                {timerState === 'idle' && (
                  <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
                    <div className="flex items-center justify-center gap-1.5">
                      {DURATION_OPTIONS.map((d) => (
                        <button
                          key={d}
                          onClick={() => { setDuration(d); setSecondsLeft(d * 60) }}
                          className={`px-2.5 py-1 rounded-md text-[11px] font-mono transition-all ${
                            duration === d
                              ? 'bg-foreground/15 text-foreground/80 border border-foreground/20'
                              : 'bg-foreground/[0.04] text-foreground/40 hover:bg-foreground/[0.08]'
                          }`}
                        >{d}m</button>
                      ))}
                    </div>
                    <div className="flex items-center justify-center gap-3">
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input type="checkbox" checked={autoBreak} onChange={(e) => setAutoBreak(e.target.checked)} className="sr-only peer" />
                        <div className="w-6 h-3.5 rounded-full bg-foreground/[0.08] peer-checked:bg-foreground/20 transition-colors relative">
                          <div className={`absolute top-0.5 w-2.5 h-2.5 rounded-full bg-foreground/50 transition-all ${autoBreak ? 'left-3' : 'left-0.5'}`} />
                        </div>
                        <span className="text-[9px] font-mono text-foreground/40">{t('focusTimer.autoBreak')}</span>
                      </label>
                      <button onClick={() => setTickSound(!tickSound)} className="flex items-center gap-1 text-foreground/40 hover:text-foreground/60 transition-colors">
                        {tickSound ? <Volume2 className="w-3 h-3" /> : <VolumeX className="w-3 h-3" />}
                      </button>
                    </div>
                    <div className="flex justify-center">
                      <motion.button
                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                        onClick={startSession}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-foreground/10 hover:bg-foreground/15 border border-foreground/[0.08] text-xs font-mono text-foreground/70 hover:text-foreground/90 transition-all"
                      >
                        <Play className="w-3.5 h-3.5 ml-0.5" /> Start
                      </motion.button>
                    </div>
                  </motion.div>
                )}

                {isActive && (
                  <motion.div key="active" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
                    <div className="flex flex-col items-center gap-2">
                      <div className="relative w-20 h-20">
                        <div
                          className="w-full h-full rounded-full transition-opacity"
                          style={{
                            background: `conic-gradient(currentColor ${percent * 3.6}deg, transparent ${percent * 3.6}deg)`,
                            opacity: timerState === 'break' ? 0.15 : 0.2,
                            mask: 'radial-gradient(farthest-side, transparent calc(100% - 4px), #000 calc(100% - 4px))',
                            WebkitMask: 'radial-gradient(farthest-side, transparent calc(100% - 4px), #000 calc(100% - 4px))',
                          }}
                        />
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          {timerState === 'break' && <Coffee className="w-3 h-3 text-foreground/40 mb-0.5" />}
                          <span className="text-lg font-mono font-bold leading-none">{timeDisplay}</span>
                          <span className="text-[9px] font-mono text-foreground/40 mt-0.5">
                            {timerState === 'break' ? t('focusTimer.break') : timerState === 'paused' ? t('focusTimer.paused') : t('focusTimer.focusing')}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
                          onClick={timerState === 'paused' ? resumeFromPause : togglePause}
                          className="w-8 h-8 rounded-full bg-foreground/10 hover:bg-foreground/15 border border-foreground/[0.08] flex items-center justify-center text-foreground/70 transition-all"
                        >
                          {timerState === 'paused' ? <Play className="w-3.5 h-3.5 ml-0.5" /> : <Pause className="w-3.5 h-3.5" />}
                        </motion.button>
                        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
                          onClick={reset}
                          className="w-8 h-8 rounded-full bg-foreground/[0.04] hover:bg-foreground/[0.08] border border-foreground/[0.06] flex items-center justify-center text-foreground/40 transition-all"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </motion.button>
                      </div>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: SESSIONS_PER_CYCLE }).map((_, i) => (
                          <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all ${
                            i < cycleSessionCount ? 'bg-foreground/40' : i === cycleSessionCount ? 'bg-foreground/20 ring-1 ring-foreground/10' : 'bg-foreground/[0.08]'
                          }`} />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {timerState === 'complete' && (
                  <motion.div key="complete" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="text-center space-y-3 py-1">
                    <div className="w-10 h-10 rounded-full bg-foreground/[0.08] border border-foreground/[0.12] mx-auto flex items-center justify-center">
                      <Trophy className="w-4 h-4 text-foreground/60" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-foreground/80">{t('focusTimer.allDone')}</p>
                      <p className="text-[10px] text-foreground/40 mt-0.5">{sessionCount} sessions &middot; {sessionCount * duration}m focused</p>
                      <p className="text-[10px] font-mono text-foreground/50 mt-0.5">+{totalXpAwarded} XP</p>
                    </div>
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={reset}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-foreground/[0.06] hover:bg-foreground/10 border border-foreground/[0.08] text-[10px] font-mono text-foreground/60 transition-all"
                    >
                      <RotateCcw className="w-3 h-3" /> Again
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
    </>
  )
}
