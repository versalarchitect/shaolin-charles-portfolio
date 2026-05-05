import { motion } from 'framer-motion'
import { Lock, Palette, FileText, BookOpen, Award, Check, Zap } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { UNLOCKABLES, checkUnlocked, getProgress, getUnlockablesByType } from '@/lib/unlockables'
import type { Unlockable, UnlockableType } from '@/lib/unlockables'
import { useUnlockState } from './unlock-gate'

const TYPE_META: Record<UnlockableType, { label: string; icon: LucideIcon }> = {
  theme: { label: 'Themes', icon: Palette },
  page: { label: 'Secret Pages', icon: FileText },
  content: { label: 'Bonus Content', icon: BookOpen },
  badge: { label: 'Badges', icon: Award },
}

const TYPE_ORDER: UnlockableType[] = ['theme', 'page', 'content', 'badge']

interface UnlockablesGridProps {
  showCategories?: boolean
  compact?: boolean
}

export function UnlockablesGrid({ showCategories = true, compact = false }: UnlockablesGridProps) {
  const unlockState = useUnlockState()
  const activeTypes = TYPE_ORDER.filter((type) => getUnlockablesByType(type).length > 0)

  if (!showCategories) {
    return (
      <div className={`grid ${compact ? 'grid-cols-2 sm:grid-cols-3 gap-2' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3'}`}>
        {UNLOCKABLES.map((unlockable) => (
          <UnlockableCard
            key={unlockable.id}
            unlockable={unlockable}
            isUnlocked={checkUnlocked(unlockable, unlockState)}
            progress={getProgress(unlockable, unlockState)}
            compact={compact}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {activeTypes.map((type) => {
        const meta = TYPE_META[type]
        const items = getUnlockablesByType(type)
        const Icon = meta.icon

        return (
          <div key={type} className="space-y-3">
            <div className="flex items-center gap-2">
              <Icon className="w-4 h-4 text-foreground/50" />
              <h3 className="text-xs font-mono uppercase tracking-wider text-foreground/40">
                {meta.label}
              </h3>
              <span className="text-[10px] font-mono text-foreground/25 ml-auto">
                {items.filter((u) => checkUnlocked(u, unlockState)).length}/{items.length}
              </span>
            </div>

            <div className={`grid ${compact ? 'grid-cols-2 sm:grid-cols-3 gap-2' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3'}`}>
              {items.map((unlockable) => (
                <UnlockableCard
                  key={unlockable.id}
                  unlockable={unlockable}
                  isUnlocked={checkUnlocked(unlockable, unlockState)}
                  progress={getProgress(unlockable, unlockState)}
                  compact={compact}
                />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function UnlockableCard({
  unlockable,
  isUnlocked,
  progress,
  compact,
}: {
  unlockable: Unlockable
  isUnlocked: boolean
  progress: number
  compact: boolean
}) {
  return (
    <motion.div
      className={`relative rounded-xl border transition-all ${
        isUnlocked
          ? 'border-foreground/10 bg-foreground/[0.03]'
          : 'border-foreground/[0.06] bg-foreground/[0.01]'
      } ${compact ? 'p-3' : 'p-4'}`}
      initial={false}
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.15 }}
    >
      {/* Status icon */}
      <div className="flex items-start justify-between mb-2">
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center ${
            isUnlocked
              ? 'bg-foreground/10 text-foreground/70'
              : 'bg-foreground/[0.04] text-foreground/25'
          }`}
        >
          {isUnlocked ? (
            <Check className="w-4 h-4" />
          ) : (
            <Lock className="w-3.5 h-3.5" />
          )}
        </div>

        {/* Type badge */}
        <span className="text-[9px] font-mono uppercase tracking-wider text-foreground/25">
          {unlockable.type}
        </span>
      </div>

      {/* Name */}
      <p
        className={`text-sm font-medium mb-0.5 ${
          isUnlocked ? 'text-foreground/80' : 'text-foreground/40'
        }`}
      >
        {isUnlocked ? unlockable.name : '???'}
      </p>

      {/* Description */}
      <p
        className={`text-xs mb-3 ${
          isUnlocked ? 'text-foreground/50' : 'text-foreground/25'
        }`}
      >
        {isUnlocked ? unlockable.description : unlockable.preview || 'Locked'}
      </p>

      {/* Progress bar (only when locked) */}
      {!isUnlocked && (
        <div className="space-y-1">
          <div className="h-1 rounded-full bg-foreground/[0.06] overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-foreground/15"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-mono text-foreground/20">
              {progress}%
            </span>
            {unlockable.requirements.xp && (
              <span className="text-[9px] font-mono text-foreground/20 flex items-center gap-0.5">
                <Zap className="w-2.5 h-2.5" />
                {unlockable.requirements.xp} XP
              </span>
            )}
          </div>
        </div>
      )}

      {/* Unlocked indicator */}
      {isUnlocked && (
        <div className="flex items-center gap-1 text-[10px] font-mono text-foreground/30">
          <Check className="w-2.5 h-2.5" />
          Unlocked
        </div>
      )}

      {/* Blur overlay for locked items */}
      {!isUnlocked && (
        <div className="absolute inset-0 rounded-xl pointer-events-none bg-gradient-to-b from-transparent to-background/20" />
      )}
    </motion.div>
  )
}
