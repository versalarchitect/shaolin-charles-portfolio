import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  Lock,
  Star,
  Flame,
  Trophy,
  Crown,
  Zap,
  Target,
  Award,
  Check,
  Compass,
  Map,
  Search,
  Sparkles,
  Eye,
  Share2,
  Loader2,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { ACHIEVEMENTS, CURRICULUM, ALL_LESSONS, XP_LEVELS } from '@/data/curriculum'
import { EXPLORER_ACHIEVEMENTS } from '@/data/explorer-achievements'
import { useProgress } from '@/stores/progress'
import { getExplorerProgress, getExplorerState } from '@/lib/explorer'
import { generateAchievementCard } from '@/lib/achievement-card'
import { shareCard } from '@/lib/share-card'

const ACHIEVEMENT_ICONS: Record<string, LucideIcon> = {
  'first-lesson': Target, 'streak-3': Flame, 'streak-7': Zap, 'streak-30': Crown,
  'prework-done': Check, 'tier1-done': Star, 'tier2-done': Award, 'tier3-done': Trophy,
  'tier4-done': Crown, 'speed-learner': Zap, 'half-way': Star, 'full-course': Trophy,
}

const EXPLORER_ICONS: Record<string, LucideIcon> = {
  'explorer-curious': Compass, 'explorer-wanderer': Map, 'explorer-cartographer': Award,
  'explorer-egg-hunter': Search, 'explorer-secret-finder': Eye, 'explorer-completionist': Sparkles,
}

interface AchievementProgress {
  current: number
  target: number
  label: string
}

function getCourseAchievementProgress(condition: string, progress: ReturnType<typeof useProgress>): AchievementProgress {
  const completedCount = Object.values(progress.lessonProgress).filter(p => p.status === 'completed').length

  switch (condition) {
    case 'complete_1_lesson':
      return { current: Math.min(completedCount, 1), target: 1, label: 'Complete 1 lesson' }
    case 'streak_3':
      return { current: Math.min(progress.currentStreak, 3), target: 3, label: `${progress.currentStreak}/3 day streak` }
    case 'streak_7':
      return { current: Math.min(progress.currentStreak, 7), target: 7, label: `${progress.currentStreak}/7 day streak` }
    case 'streak_30':
      return { current: Math.min(progress.currentStreak, 30), target: 30, label: `${progress.currentStreak}/30 day streak` }
    case 'complete_prework':
    case 'complete_tier1':
    case 'complete_tier2':
    case 'complete_tier3':
    case 'complete_tier4': {
      const tierId = condition.replace('complete_', '')
      const tier = CURRICULUM.find(t => t.id === tierId)
      if (!tier) return { current: 0, target: 1, label: 'Complete tier' }
      const done = tier.lessons.filter(l => progress.lessonProgress[l.id]?.status === 'completed').length
      return { current: done, target: tier.lessons.length, label: `${done}/${tier.lessons.length} lessons` }
    }
    case 'half_complete': {
      const half = Math.floor(ALL_LESSONS.length / 2)
      return { current: Math.min(completedCount, half), target: half, label: `${completedCount}/${half} lessons` }
    }
    case 'all_complete':
      return { current: completedCount, target: ALL_LESSONS.length, label: `${completedCount}/${ALL_LESSONS.length} lessons` }
    case 'three_in_day':
      return { current: 0, target: 3, label: 'Complete 3 in one day' }
    default:
      return { current: 0, target: 1, label: '' }
  }
}

function getExplorerAchievementProgress(condition: string, threshold: number): AchievementProgress {
  const explorerState = getExplorerState()

  switch (condition) {
    case 'pages_visited': {
      const current = explorerState.visitedPages.size
      return { current: Math.min(current, threshold), target: threshold, label: `${current}/${threshold} pages visited` }
    }
    case 'easter_egg': {
      const current = explorerState.easterEggsFound.size
      return { current: Math.min(current, threshold), target: threshold, label: `${current}/${threshold} surprises found` }
    }
    case 'interaction': {
      const current = explorerState.interactions.size
      return { current: Math.min(current, threshold), target: threshold, label: `${current}/${threshold} interactions` }
    }
    case 'total_explorer_xp': {
      const current = explorerState.totalExplorerXp
      return { current: Math.min(current, threshold), target: threshold, label: `${current}/${threshold} XP earned` }
    }
    default:
      return { current: 0, target: 1, label: '' }
  }
}

function ProgressBar({ current, target }: { current: number; target: number }) {
  const percent = target > 0 ? Math.min((current / target) * 100, 100) : 0

  return (
    <div className="w-full h-1 rounded-full bg-foreground/[0.06] mt-1.5 overflow-hidden">
      <motion.div
        className="h-full rounded-full bg-foreground/20"
        initial={{ width: 0 }}
        animate={{ width: `${percent}%` }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      />
    </div>
  )
}

interface AchievementCardProps {
  id: string
  name: string
  description: string
  emoji: string
  xpReward: number
  isUnlocked: boolean
  icon: LucideIcon
  progress: AchievementProgress
  isExpanded: boolean
  onToggle: () => void
  userName: string
  rank: string
}

function AchievementCard({ id, name, description, emoji, xpReward, isUnlocked, icon: AIcon, progress, isExpanded, onToggle, userName, rank }: AchievementCardProps) {
  const [sharing, setSharing] = useState(false)

  const handleShare = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (sharing) return
    setSharing(true)
    try {
      const blob = await generateAchievementCard({
        name,
        description,
        icon: emoji,
        xpReward,
        userName,
        rank,
      })
      await shareCard(blob, `${name} - Achievement Unlocked`)
    } catch {
      // silently fail
    } finally {
      setSharing(false)
    }
  }, [sharing, name, description, emoji, xpReward, userName, rank])
  return (
    <motion.div layout layoutId={`achievement-${id}`} className="relative">
      <motion.button
        layout="position"
        onClick={onToggle}
        aria-expanded={isExpanded}
        aria-label={isUnlocked ? `${name}: ${description}. ${xpReward} XP` : `Locked achievement. ${description}`}
        className={`w-full rounded-xl border p-3 text-center transition-colors cursor-pointer ${
          isUnlocked
            ? 'border-foreground/10 bg-foreground/[0.03] hover:border-foreground/20 hover:bg-foreground/[0.05]'
            : 'border-foreground/[0.08] bg-foreground/[0.02] hover:border-foreground/10'
        } ${isExpanded ? 'border-foreground/20' : ''}`}
        whileHover={isUnlocked ? { scale: 1.02 } : undefined}
        whileTap={{ scale: 0.98 }}
      >
        {/* Shimmer overlay for unlocked achievements on hover */}
        {isUnlocked && (
          <div className="absolute inset-0 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-foreground/[0.04] to-transparent animate-shimmer" />
          </div>
        )}

        <div className={`mx-auto w-9 h-9 rounded-lg flex items-center justify-center mb-2 ${
          isUnlocked ? 'bg-foreground/10 text-foreground/70' : 'bg-foreground/[0.06] text-foreground/40'
        }`}>
          {isUnlocked ? <AIcon className="w-5 h-5" /> : <Lock className="w-4 h-4" />}
        </div>
        <p className={`text-xs font-medium ${isUnlocked ? 'text-foreground/80' : 'text-foreground/50'}`}>
          {isUnlocked ? name : '???'}
        </p>
        {isUnlocked && (
          <p className="text-[10px] text-foreground/40 mt-0.5">{description}</p>
        )}
        <div className={`mt-1.5 inline-flex items-center gap-0.5 text-[10px] font-mono ${
          isUnlocked ? 'text-foreground/40' : 'text-foreground/30'
        }`}>
          <Zap className="w-2.5 h-2.5" />
          {xpReward} XP
        </div>

        {/* Progress bar for locked achievements */}
        {!isUnlocked && progress.target > 0 && (
          <ProgressBar current={progress.current} target={progress.target} />
        )}
      </motion.button>

      {/* Expanded detail panel */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="mt-2 rounded-lg border border-foreground/10 bg-foreground/[0.02] p-3 text-left">
              {isUnlocked ? (
                <>
                  <div className="flex items-center gap-2 mb-2">
                    <AIcon className="w-4 h-4 text-foreground/60" />
                    <span className="text-xs font-medium text-foreground/80">{name}</span>
                  </div>
                  <p className="text-[11px] text-foreground/60 mb-2">{description}</p>
                  <div className="h-px bg-gradient-to-r from-foreground/10 via-foreground/5 to-transparent mb-2" />
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-foreground/40 flex items-center gap-1">
                      <Zap className="w-2.5 h-2.5" />
                      +{xpReward} XP earned
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-foreground/30">Unlocked</span>
                      <button
                        onClick={handleShare}
                        disabled={sharing}
                        title="Share achievement"
                        aria-label={`Share ${name} achievement`}
                        className="flex items-center justify-center w-6 h-6 rounded-md bg-foreground/[0.04] border border-foreground/10 text-foreground/40 hover:text-foreground/70 hover:border-foreground/20 hover:bg-foreground/[0.08] transition-all cursor-pointer disabled:opacity-50"
                      >
                        {sharing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Share2 className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-[11px] text-foreground/60 mb-2">{description}</p>
                  <div className="h-px bg-gradient-to-r from-foreground/10 via-foreground/5 to-transparent mb-2" />
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono text-foreground/40 flex items-center gap-1">
                      <Zap className="w-2.5 h-2.5" />
                      {xpReward} XP reward
                    </span>
                  </div>
                  {progress.target > 0 && (
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-foreground/50">{progress.label}</span>
                        <span className="text-[10px] font-mono text-foreground/40">
                          {Math.round((progress.current / progress.target) * 100)}%
                        </span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-foreground/[0.06] overflow-hidden">
                        <motion.div
                          className="h-full rounded-full bg-foreground/25"
                          initial={{ width: 0 }}
                          animate={{ width: `${(progress.current / progress.target) * 100}%` }}
                          transition={{ duration: 0.5, ease: 'easeOut' }}
                        />
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export function AchievementsGrid() {
  const progress = useProgress()
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const explorerProgress = getExplorerProgress()

  const rank = (XP_LEVELS.find(l => progress.totalXp >= l.minXp && progress.totalXp <= l.maxXp) || XP_LEVELS[0]).name
  const userName = 'Student'

  const handleToggle = (id: string) => {
    setExpandedId(prev => prev === id ? null : id)
  }

  return (
    <div className="space-y-6">
      {/* Course Achievements */}
      <div className="space-y-3">
        <h2 className="text-sm font-mono uppercase tracking-wider text-foreground/40">
          Achievements
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {ACHIEVEMENTS.map((achievement) => {
            const isUnlocked = progress.unlockedAchievements.includes(achievement.id)
            const AIcon = ACHIEVEMENT_ICONS[achievement.id] || Trophy
            const achievementProgress = getCourseAchievementProgress(achievement.condition, progress)

            return (
              <AchievementCard
                key={achievement.id}
                id={achievement.id}
                name={achievement.name}
                description={achievement.description}
                emoji={achievement.icon}
                xpReward={achievement.xpReward}
                isUnlocked={isUnlocked}
                icon={AIcon}
                progress={achievementProgress}
                isExpanded={expandedId === achievement.id}
                onToggle={() => handleToggle(achievement.id)}
                userName={userName}
                rank={rank}
              />
            )
          })}
        </div>
      </div>

      {/* Explorer Achievements */}
      <div className="space-y-3">
        <h2 className="text-sm font-mono uppercase tracking-wider text-foreground/40">
          Explorer
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {EXPLORER_ACHIEVEMENTS.map((achievement) => {
            const isUnlocked = explorerProgress.achievements.includes(achievement.id)
            const AIcon = EXPLORER_ICONS[achievement.id] || Compass
            const achievementProgress = getExplorerAchievementProgress(achievement.condition, achievement.threshold)

            return (
              <AchievementCard
                key={achievement.id}
                id={achievement.id}
                name={achievement.name}
                description={achievement.description}
                emoji={achievement.icon || ''}
                xpReward={achievement.xp}
                isUnlocked={isUnlocked}
                icon={AIcon}
                progress={achievementProgress}
                isExpanded={expandedId === achievement.id}
                onToggle={() => handleToggle(achievement.id)}
                userName={userName}
                rank={rank}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}
