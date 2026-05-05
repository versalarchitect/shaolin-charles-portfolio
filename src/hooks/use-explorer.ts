import { useEffect, useSyncExternalStore } from 'react'
import { useLocation } from 'react-router-dom'
import { toast } from 'sonner'
import { useAuth } from '@/hooks/use-auth'
import { trackPageVisit, getExplorerProgress, getExplorerVersion, subscribeExplorer } from '@/lib/explorer'
import type { ExplorerAchievement } from '@/data/explorer-achievements'

export function useExplorer() {
  const { isLoggedIn } = useAuth()
  const location = useLocation()

  // Subscribe to version changes to trigger re-renders
  useSyncExternalStore(subscribeExplorer, getExplorerVersion, () => 0)
  const explorerProgress = getExplorerProgress()

  useEffect(() => {
    if (!isLoggedIn) return

    const result = trackPageVisit(location.pathname)

    if (result.awarded) {
      toast(`+${result.xp} Explorer XP`, {
        description: 'Page discovered!',
        duration: 2500,
      })
    }

    if (result.achievementsUnlocked.length > 0) {
      for (const achievement of result.achievementsUnlocked) {
        showAchievementToast(achievement)
      }
    }
  }, [location.pathname, isLoggedIn])

  return { explorerProgress }
}

function showAchievementToast(achievement: ExplorerAchievement) {
  toast(`Achievement Unlocked: ${achievement.name}`, {
    description: `${achievement.description} (+${achievement.xp} XP)`,
    duration: 4000,
  })
}
