import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Shield,
  Trophy,
  Flame,
  Zap,
  Star,
  Clock,
  Target,
  Eye,
  EyeOff,
  ChevronRight,
  Lock,
} from 'lucide-react'
import { SEO } from '@/components/SEO'
import { useProgress, getLevel, getOverallProgress, getXpLog, getToolMastery } from '@/stores/progress'
import { checkUnlocked, getUnlockable, UNLOCKABLES, getProgress } from '@/lib/unlockables'
import { UnlockablesGrid } from '@/components/gamification/unlockables-grid'
import { useUnlockState } from '@/components/gamification/unlock-gate'
import { ACHIEVEMENTS } from '@/data/curriculum'

function AccessGrantedAnimation({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 3800)
    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background overflow-hidden"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Horizontal scanline sweep */}
      <motion.div
        className="absolute left-0 right-0 h-[2px] bg-foreground/20 z-10"
        initial={{ top: '-2px' }}
        animate={{ top: '100%' }}
        transition={{ duration: 1.0, delay: 0.1, ease: 'linear' }}
      />
      <motion.div
        className="absolute left-0 right-0 h-[1px] bg-foreground/10 z-10"
        initial={{ top: '-1px' }}
        animate={{ top: '100%' }}
        transition={{ duration: 0.8, delay: 0.3, ease: 'linear' }}
      />

      {/* Static scan lines (CRT effect) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 60 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute left-0 right-0 h-px bg-foreground"
            style={{ top: `${(i / 60) * 100}%` }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.04, 0.02, 0.04, 0] }}
            transition={{ duration: 2.0, delay: 0.2 + i * 0.01, ease: 'easeOut' }}
          />
        ))}
      </div>

      {/* Screen glitch flicker */}
      <motion.div
        className="absolute inset-0 bg-foreground pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.03, 0, 0.02, 0, 0.04, 0] }}
        transition={{ duration: 0.6, delay: 0.5, times: [0, 0.1, 0.2, 0.4, 0.5, 0.7, 1] }}
      />

      {/* Glitch horizontal displacement bars */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 0.3, delay: 0.6 }}
      >
        <div className="absolute top-[30%] left-0 right-0 h-1 bg-foreground/[0.06] translate-x-2" />
        <div className="absolute top-[55%] left-0 right-0 h-0.5 bg-foreground/[0.04] -translate-x-3" />
        <div className="absolute top-[72%] left-0 right-0 h-1 bg-foreground/[0.05] translate-x-1" />
      </motion.div>

      <div className="text-center space-y-6 relative z-20">
        {/* Shield icon with dramatic entry */}
        <motion.div
          className="mx-auto w-20 h-20 rounded-full border border-foreground/10 flex items-center justify-center"
          initial={{ scale: 0, rotate: -180, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.8 }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
          >
            <Shield className="w-10 h-10 text-foreground/60" />
          </motion.div>
        </motion.div>

        {/* Text with glitch reveal */}
        <motion.div
          className="space-y-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.4 }}
        >
          <motion.p
            className="text-[10px] font-mono uppercase tracking-[0.3em] text-foreground/30"
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.4 }}
          >
            Security clearance verified
          </motion.p>
          <motion.h1
            className="text-2xl font-mono font-bold tracking-tight text-foreground/80"
            initial={{ opacity: 0, clipPath: 'inset(0 100% 0 0)' }}
            animate={{ opacity: 1, clipPath: 'inset(0 0% 0 0)' }}
            transition={{ delay: 1.6, duration: 0.5, ease: 'easeOut' }}
          >
            ACCESS GRANTED
          </motion.h1>
        </motion.div>

        {/* Loading bar */}
        <motion.div
          className="w-48 mx-auto h-0.5 rounded-full bg-foreground/[0.08] overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.0 }}
        >
          <motion.div
            className="h-full bg-foreground/30 rounded-full"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 1.2, delay: 2.2, ease: 'easeInOut' }}
          />
        </motion.div>

        {/* Decrypting text effect */}
        <motion.p
          className="text-[9px] font-mono text-foreground/15 tracking-wider"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 1, 0] }}
          transition={{ duration: 1.5, delay: 2.4, times: [0, 0.1, 0.8, 1] }}
        >
          DECRYPTING VAULT CONTENTS...
        </motion.p>
      </div>
    </motion.div>
  )
}

function AchievementTimeline() {
  const progress = useProgress()
  const unlockedAchievements = ACHIEVEMENTS.filter((a) =>
    progress.unlockedAchievements.includes(a.id)
  )

  // Sort by approximate unlock order (based on position in unlockedAchievements array)
  const sorted = progress.unlockedAchievements
    .map((id) => ACHIEVEMENTS.find((a) => a.id === id))
    .filter(Boolean) as typeof ACHIEVEMENTS

  if (sorted.length === 0) {
    return (
      <div className="text-center py-10">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-foreground/[0.04] border border-foreground/[0.06] mx-auto mb-3">
          <Trophy className="w-4 h-4 text-foreground/15" />
        </div>
        <p className="text-xs text-foreground/35 font-mono mb-1">
          Your journey begins when you earn your first achievement
        </p>
        <p className="text-[10px] text-foreground/20 font-mono">
          Complete lessons and challenges to fill this timeline
        </p>
      </div>
    )
  }

  return (
    <div className="relative pl-6 space-y-4">
      {/* Timeline line */}
      <div className="absolute left-[9px] top-2 bottom-2 w-px bg-foreground/[0.08]" />

      {sorted.map((achievement, i) => (
        <motion.div
          key={achievement.id}
          className="relative flex items-start gap-3"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.05 }}
        >
          {/* Dot */}
          <div className="absolute -left-6 top-1.5 w-[7px] h-[7px] rounded-full bg-foreground/20 border border-foreground/30" />

          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-foreground/70">
              {achievement.name}
            </p>
            <p className="text-[10px] text-foreground/35 mt-0.5">
              {achievement.description}
            </p>
          </div>

          <span className="text-[9px] font-mono text-foreground/20 flex items-center gap-0.5 shrink-0">
            <Zap className="w-2.5 h-2.5" />+{achievement.xpReward}
          </span>
        </motion.div>
      ))}
    </div>
  )
}

function AllTimeStats() {
  const progress = useProgress()
  const level = getLevel()
  const overall = getOverallProgress()
  const xpLog = getXpLog()
  const toolMastery = getToolMastery()

  // Calculate XP by source
  const xpByType = xpLog.reduce<Record<string, number>>((acc, e) => {
    acc[e.type] = (acc[e.type] || 0) + e.xp
    return acc
  }, {})

  const stats = [
    { icon: Zap, label: 'Total XP', value: progress.totalXp.toLocaleString() },
    { icon: Trophy, label: 'Rank', value: level.name },
    { icon: Flame, label: 'Current Streak', value: `${progress.currentStreak}d` },
    { icon: Star, label: 'Longest Streak', value: `${progress.longestStreak}d` },
    { icon: Target, label: 'Lessons Done', value: `${overall.completed}/${overall.total}` },
    { icon: Clock, label: 'Achievements', value: `${progress.unlockedAchievements.length}/${ACHIEVEMENTS.length}` },
  ]

  return (
    <div className="space-y-4">
      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {stats.map(({ icon: Icon, label, value }) => (
          <div
            key={label}
            className="rounded-xl border border-foreground/[0.06] bg-foreground/[0.015] p-3"
          >
            <div className="flex items-center gap-1.5 mb-1">
              <Icon className="w-3 h-3 text-foreground/30" />
              <span className="text-[9px] font-mono uppercase tracking-wider text-foreground/25">
                {label}
              </span>
            </div>
            <p className="text-lg font-mono font-semibold text-foreground/70">
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* XP breakdown */}
      {Object.keys(xpByType).length > 0 && (
        <div className="rounded-xl border border-foreground/[0.06] bg-foreground/[0.015] p-4">
          <h4 className="text-[10px] font-mono uppercase tracking-wider text-foreground/30 mb-3">
            XP Sources (recent)
          </h4>
          <div className="space-y-2">
            {Object.entries(xpByType)
              .sort(([, a], [, b]) => b - a)
              .map(([type, xp]) => (
                <div key={type} className="flex items-center justify-between">
                  <span className="text-xs text-foreground/50 capitalize">{type}</span>
                  <span className="text-xs font-mono text-foreground/40">{xp} XP</span>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Tool mastery */}
      {toolMastery.length > 0 && (
        <div className="rounded-xl border border-foreground/[0.06] bg-foreground/[0.015] p-4">
          <h4 className="text-[10px] font-mono uppercase tracking-wider text-foreground/30 mb-3">
            Tool Mastery
          </h4>
          <div className="space-y-2">
            {toolMastery.slice(0, 6).map(({ tool, xp, level }) => (
              <div key={tool} className="flex items-center justify-between">
                <span className="text-xs text-foreground/50">{tool}</span>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-mono text-foreground/25">{level}</span>
                  <span className="text-xs font-mono text-foreground/40">{xp} XP</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function EasterEggsList() {
  const progress = useProgress()

  // Define easter eggs (some found based on achievements, others hinted)
  const eggs = [
    { id: 'first-crit', hint: 'Land a critical hit on any lesson', found: progress.unlockedAchievements.includes('speed-learner') },
    { id: 'midnight-owl', hint: 'Complete a lesson between midnight and 4am', found: false },
    { id: 'streak-freeze', hint: 'Have your streak saved by the freeze mechanic', found: progress.currentStreak >= 3 },
    { id: 'combo-king', hint: '█████ ██ █████ combo', found: false },
    { id: 'all-tools', hint: 'Reach proficiency in ███ different tools', found: false },
    { id: 'vault-visitor', hint: 'You found this one just by being here', found: true },
  ]

  return (
    <div className="space-y-2">
      {eggs.map((egg) => (
        <div
          key={egg.id}
          className={`flex items-center gap-3 rounded-lg border p-3 ${
            egg.found
              ? 'border-foreground/10 bg-foreground/[0.02]'
              : 'border-foreground/[0.05] bg-foreground/[0.01]'
          }`}
        >
          <div className={`w-6 h-6 rounded flex items-center justify-center ${
            egg.found ? 'bg-foreground/10' : 'bg-foreground/[0.04]'
          }`}>
            {egg.found ? (
              <Eye className="w-3.5 h-3.5 text-foreground/50" />
            ) : (
              <EyeOff className="w-3.5 h-3.5 text-foreground/20" />
            )}
          </div>
          <p className={`text-xs flex-1 ${
            egg.found ? 'text-foreground/60' : 'text-foreground/25 font-mono'
          }`}>
            {egg.hint}
          </p>
          {egg.found && (
            <span className="text-[9px] font-mono text-foreground/25">FOUND</span>
          )}
        </div>
      ))}
    </div>
  )
}

function HallOfFame() {
  const progress = useProgress()
  const level = getLevel()
  const overall = getOverallProgress()

  const accomplishments = [
    { label: 'Peak Rank', value: level.name, show: true },
    { label: 'Best Streak', value: `${progress.longestStreak} days`, show: progress.longestStreak > 0 },
    { label: 'Course Progress', value: `${overall.percent}%`, show: overall.percent > 0 },
    { label: 'Total Achievements', value: `${progress.unlockedAchievements.length}`, show: progress.unlockedAchievements.length > 0 },
    { label: 'Challenges Conquered', value: `${progress.totalChallengesCompleted}`, show: progress.totalChallengesCompleted > 0 },
  ].filter((a) => a.show)

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      {accomplishments.map(({ label, value }) => (
        <div
          key={label}
          className="flex items-center justify-between rounded-lg border border-foreground/[0.06] bg-foreground/[0.015] p-3"
        >
          <span className="text-[10px] font-mono uppercase tracking-wider text-foreground/25">
            {label}
          </span>
          <span className="text-sm font-mono font-semibold text-foreground/60">
            {value}
          </span>
        </div>
      ))}
    </div>
  )
}

export default function SecretVault() {
  const navigate = useNavigate()
  const unlockState = useUnlockState()
  const [showIntro, setShowIntro] = useState(false)

  const vaultUnlockable = getUnlockable('secret-vault')
  const isUnlocked = vaultUnlockable ? checkUnlocked(vaultUnlockable, unlockState) : false

  useEffect(() => {
    if (!isUnlocked) {
      navigate('/course/dashboard', { replace: true })
      return
    }

    // Check if first visit
    const visited = sessionStorage.getItem('vault-visited')
    if (!visited) {
      setShowIntro(true)
      sessionStorage.setItem('vault-visited', '1')
    }
  }, [isUnlocked, navigate])

  if (!isUnlocked) return null

  return (
    <>
      <SEO
        title="The Vault | Secret Archive"
        description="Your hidden achievement archive and progress dashboard"
        noindex
      />

      <AnimatePresence>
        {showIntro && (
          <AccessGrantedAnimation onComplete={() => setShowIntro(false)} />
        )}
      </AnimatePresence>

      <motion.div
        className="min-h-screen py-12 px-6 lg:px-8 max-w-4xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: showIntro ? 0 : 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-4 h-4 text-foreground/30" />
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-foreground/25">
              Classified
            </span>
          </div>
          <h1 className="text-2xl font-mono font-bold text-foreground/80 tracking-tight">
            The Vault
          </h1>
          <p className="text-sm text-foreground/40 mt-1">
            Your complete progress archive and hidden records
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-10">
          {/* Hall of Fame */}
          <VaultSection title="Hall of Fame" subtitle="Peak accomplishments">
            <HallOfFame />
          </VaultSection>

          {/* Achievement Timeline */}
          <VaultSection title="Achievement Timeline" subtitle="Chronological unlock history">
            <AchievementTimeline />
          </VaultSection>

          {/* All Time Stats */}
          <VaultSection title="All Time Stats" subtitle="Detailed breakdown">
            <AllTimeStats />
          </VaultSection>

          {/* Easter Eggs */}
          <VaultSection title="Easter Eggs" subtitle="Hidden discoveries">
            <EasterEggsList />
          </VaultSection>

          {/* Unlockables Progress */}
          <VaultSection title="Unlockables" subtitle="Collection progress">
            <UnlockablesGrid showCategories compact={false} />
          </VaultSection>
        </div>

        {/* Footer decoration */}
        <div className="mt-16 pt-6 border-t border-foreground/[0.05]">
          <p className="text-[10px] font-mono text-foreground/15 text-center tracking-wider">
            DOCUMENT ID: VAULT-{Date.now().toString(36).toUpperCase()} // CLEARANCE: VERIFIED
          </p>
        </div>
      </motion.div>
    </>
  )
}

function VaultSection({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle: string
  children: React.ReactNode
}) {
  return (
    <section>
      <div className="flex items-baseline gap-2 sm:gap-3 mb-4">
        <h2 className="text-sm font-mono font-medium text-foreground/60 shrink-0">{title}</h2>
        <div className="h-px flex-1 bg-foreground/[0.05]" />
        <span className="text-[9px] font-mono text-foreground/20 shrink-0 hidden sm:inline">{subtitle}</span>
      </div>
      {children}
    </section>
  )
}
