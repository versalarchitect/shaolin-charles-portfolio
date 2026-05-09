import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Lock, Zap, Flame, Trophy, Star } from 'lucide-react'
import { useProgress, getLevel } from '@/stores/progress'
import { getUnlockable, checkUnlocked, getProgress } from '@/lib/unlockables'
import type { UnlockState } from '@/lib/unlockables'

interface UnlockGateProps {
  unlockableId: string
  children: React.ReactNode
  fallback?: React.ReactNode
}

function useUnlockState(): UnlockState {
  const progress = useProgress()
  const level = getLevel()
  return {
    totalXp: progress.totalXp,
    level: level.name,
    achievements: progress.unlockedAchievements,
    streak: progress.currentStreak,
  }
}

function LockedCard({ unlockableId }: { unlockableId: string }) {
  const unlockState = useUnlockState()
  const unlockable = getUnlockable(unlockableId)

  if (!unlockable) return null

  const progress = getProgress(unlockable, unlockState)
  const { requirements } = unlockable

  return (
    <div className="relative rounded-2xl border border-foreground/[0.08] bg-foreground/[0.02] overflow-hidden">
      {/* Blurred preview area */}
      <div className="relative p-8 min-h-[200px] flex flex-col items-center justify-center text-center">
        {/* Background blur effect */}
        <div className="absolute inset-0 backdrop-blur-sm bg-foreground/[0.02]" />

        {/* Lock icon */}
        <motion.div
          className="relative z-10 w-14 h-14 rounded-full bg-foreground/[0.06] border border-foreground/10 flex items-center justify-center mb-4"
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Lock className="w-6 h-6 text-foreground/40" />
        </motion.div>

        {/* Name and description */}
        <h3 className="relative z-10 text-sm font-medium text-foreground/70 mb-1">
          {unlockable.name}
        </h3>
        <p className="relative z-10 text-xs text-foreground/40 max-w-[280px] mb-4">
          {unlockable.preview || unlockable.description}
        </p>

        {/* Progress bar */}
        <div className="relative z-10 w-full max-w-[240px] mb-3">
          <div className="h-1.5 rounded-full bg-foreground/[0.08] overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-foreground/20"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
          <span className="text-[10px] font-mono text-foreground/30 mt-1 block">
            {progress}% complete
          </span>
        </div>

        {/* Requirements list */}
        <div className="relative z-10 flex flex-wrap items-center justify-center gap-2">
          {requirements.level && (
            <RequirementPill
              icon={<Trophy className="w-3 h-3" />}
              label={`${requirements.level} rank`}
              met={unlockState.level === requirements.level || false}
            />
          )}
          {requirements.xp !== undefined && (
            <RequirementPill
              icon={<Zap className="w-3 h-3" />}
              label={`${requirements.xp} XP`}
              met={unlockState.totalXp >= requirements.xp}
            />
          )}
          {requirements.streak !== undefined && (
            <RequirementPill
              icon={<Flame className="w-3 h-3" />}
              label={`${requirements.streak}-day streak`}
              met={unlockState.streak >= requirements.streak}
            />
          )}
          {requirements.achievements && (
            <RequirementPill
              icon={<Star className="w-3 h-3" />}
              label={`${requirements.achievements.length} achievements`}
              met={requirements.achievements.every((a) => unlockState.achievements.includes(a))}
            />
          )}
        </div>
      </div>
    </div>
  )
}

function RequirementPill({ icon, label, met }: { icon: React.ReactNode; label: string; met: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono border ${
        met
          ? 'bg-foreground/10 border-foreground/15 text-foreground/60'
          : 'bg-foreground/[0.03] border-foreground/[0.08] text-foreground/30'
      }`}
    >
      {icon}
      {label}
    </span>
  )
}

function UnlockReveal({ children }: { children: React.ReactNode }) {
  const [showShimmer, setShowShimmer] = useState(false)

  useEffect(() => {
    // Check if this is first reveal (via session storage)
    const key = 'unlock-revealed'
    if (!sessionStorage.getItem(key)) {
      setShowShimmer(true)
      sessionStorage.setItem(key, '1')
      const timer = setTimeout(() => setShowShimmer(false), 2000)
      return () => clearTimeout(timer)
    }
  }, [])

  return (
    <div className="relative">
      {children}
      <AnimatePresence>
        {showShimmer && (
          <motion.div
            className="absolute inset-0 pointer-events-none rounded-2xl overflow-hidden"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-foreground/[0.06] to-transparent"
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{ duration: 1.2, ease: 'easeInOut' }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function UnlockGate({ unlockableId, children, fallback }: UnlockGateProps) {
  const unlockState = useUnlockState()
  const unlockable = getUnlockable(unlockableId)

  if (!unlockable) return null

  const isUnlocked = checkUnlocked(unlockable, unlockState)

  if (isUnlocked) {
    return <UnlockReveal>{children}</UnlockReveal>
  }

  return <>{fallback || <LockedCard unlockableId={unlockableId} />}</>
}

export { useUnlockState }
