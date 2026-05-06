import { useSyncExternalStore } from 'react'
import {
  Compass,
  MapPin,
  Lock,
  Check,
  Zap,
  Eye,
  Sparkles,
  Trophy,
} from 'lucide-react'
import { EXPLORER_PAGES, EXPLORER_ACHIEVEMENTS } from '@/data/explorer-achievements'
import { getExplorerState, getExplorerVersion, subscribeExplorer } from '@/lib/explorer'

function useExplorerState() {
  // Use version to trigger re-renders when state changes
  useSyncExternalStore(subscribeExplorer, getExplorerVersion, () => 0)
  return getExplorerState()
}

export function ExplorerProgress() {
  const state = useExplorerState()
  const visitedCount = state.visitedPages.size
  const totalPages = EXPLORER_PAGES.length
  const progressPercent = Math.round((visitedCount / totalPages) * 100)

  if (visitedCount === 0) {
    return (
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-foreground/10 flex items-center justify-center">
              <Compass className="w-4 h-4 text-foreground/70" />
            </div>
            <div>
              <h2 className="text-sm font-mono uppercase tracking-wider text-foreground/70">
                Explorer
              </h2>
              <p className="text-[10px] text-foreground/40 font-mono">
                0 XP earned
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-lg font-mono font-semibold text-foreground/80">
              0/{totalPages}
            </span>
            <p className="text-[10px] text-foreground/40 font-mono">pages</p>
          </div>
        </div>

        {/* Empty state encouragement */}
        <div className="rounded-xl border border-foreground/[0.08] bg-foreground/[0.02] p-8 text-center">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-foreground/[0.04] border border-foreground/[0.08] mx-auto mb-3">
            <Compass className="w-5 h-5 text-foreground/20" />
          </div>
          <p className="text-sm text-foreground/50 mb-1">No pages explored yet</p>
          <p className="text-xs text-foreground/30 font-mono">
            Start exploring the site to earn curiosity XP!
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-foreground/10 flex items-center justify-center">
            <Compass className="w-4 h-4 text-foreground/70" />
          </div>
          <div>
            <h2 className="text-sm font-mono uppercase tracking-wider text-foreground/70">
              Explorer
            </h2>
            <p className="text-[10px] text-foreground/40 font-mono">
              {state.totalExplorerXp} XP earned
            </p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-lg font-mono font-semibold text-foreground/80">
            {visitedCount}/{totalPages}
          </span>
          <p className="text-[10px] text-foreground/40 font-mono">pages</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1.5">
        <div className="h-2 rounded-full bg-foreground/[0.06] overflow-hidden">
          <div
            className="h-full rounded-full bg-foreground/20 transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] font-mono text-foreground/40">
          <span>{progressPercent}% explored</span>
          <span>{totalPages - visitedCount} remaining</span>
        </div>
      </div>

      {/* Pages List */}
      <div className="space-y-1.5">
        <h3 className="text-xs font-mono uppercase tracking-wider text-foreground/40 flex items-center gap-1.5">
          <MapPin className="w-3 h-3" />
          Pages
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
          {EXPLORER_PAGES.map((page) => {
            const visited = state.visitedPages.has(page.key)
            return (
              <div
                key={page.key}
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg border transition-all min-w-0 ${
                  visited
                    ? 'border-foreground/10 bg-foreground/[0.03]'
                    : 'border-foreground/[0.06] bg-foreground/[0.01]'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded flex items-center justify-center shrink-0 ${
                    visited
                      ? 'bg-foreground/10 text-foreground/70'
                      : 'bg-foreground/[0.04] text-foreground/30'
                  }`}
                >
                  {visited ? (
                    <Check className="w-2.5 h-2.5" />
                  ) : (
                    <Lock className="w-2.5 h-2.5" />
                  )}
                </div>
                <span
                  className={`text-xs truncate ${
                    visited ? 'text-foreground/70' : 'text-foreground/40'
                  }`}
                >
                  {page.name}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Easter Eggs */}
      {state.easterEggsFound.size > 0 && (
        <div className="space-y-1.5">
          <h3 className="text-xs font-mono uppercase tracking-wider text-foreground/40 flex items-center gap-1.5">
            <Eye className="w-3 h-3" />
            Hidden Surprises Found
          </h3>
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {Array.from({ length: state.easterEggsFound.size }).map((_, i) => (
                <Sparkles key={i} className="w-3.5 h-3.5 text-foreground/50" />
              ))}
            </div>
            <span className="text-xs font-mono text-foreground/40">
              {state.easterEggsFound.size} discovered
            </span>
          </div>
        </div>
      )}

      {/* Achievements */}
      <div className="space-y-2">
        <h3 className="text-xs font-mono uppercase tracking-wider text-foreground/40 flex items-center gap-1.5">
          <Trophy className="w-3 h-3" />
          Explorer Achievements
        </h3>
        <div className="grid grid-cols-1 gap-1.5">
          {EXPLORER_ACHIEVEMENTS.map((achievement) => {
            const unlocked = state.unlockedAchievements.has(achievement.id)
            return (
              <div
                key={achievement.id}
                className={`flex items-center gap-3 px-3 py-2 rounded-xl border transition-all ${
                  unlocked
                    ? 'border-foreground/10 bg-foreground/[0.03]'
                    : 'border-foreground/[0.06] bg-foreground/[0.01]'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    unlocked
                      ? 'bg-foreground/10 text-foreground/70'
                      : 'bg-foreground/[0.04] text-foreground/30'
                  }`}
                >
                  {unlocked ? (
                    <Trophy className="w-3.5 h-3.5" />
                  ) : (
                    <Lock className="w-3 h-3" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-xs font-medium truncate ${
                      unlocked ? 'text-foreground/80' : 'text-foreground/50'
                    }`}
                  >
                    {unlocked ? achievement.name : '???'}
                  </p>
                  <p className="text-[10px] text-foreground/40 truncate">
                    {achievement.description}
                  </p>
                </div>
                <div
                  className={`inline-flex items-center gap-0.5 text-[10px] font-mono flex-shrink-0 ${
                    unlocked ? 'text-foreground/50' : 'text-foreground/30'
                  }`}
                >
                  <Zap className="w-2.5 h-2.5" />
                  {achievement.xp}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
