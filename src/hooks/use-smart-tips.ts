import { useEffect, useRef } from 'react'
import { toast } from 'sonner'
import { useProgress, getNextLevel, getLevel, COMBO_WINDOW_MS } from '@/stores/progress'
import { getExplorerState } from '@/lib/explorer'
import { CURRICULUM } from '@/data/curriculum'
import { EXPLORER_PAGES } from '@/data/explorer-achievements'

const STORAGE_KEY = 'smart-tips-shown'
const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000
const TIP_DELAY_MS = 3000
const TIP_DURATION_MS = 6000

interface TipRecord {
  [tipId: string]: number // timestamp when last shown
}

function getShownTips(): TipRecord {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return {}
}

function markTipShown(tipId: string) {
  const record = getShownTips()
  record[tipId] = Date.now()
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(record))
  } catch {}
}

function wasTipShownRecently(tipId: string): boolean {
  const record = getShownTips()
  const lastShown = record[tipId]
  if (!lastShown) return false
  return Date.now() - lastShown < TWENTY_FOUR_HOURS
}

interface Tip {
  id: string
  condition: () => boolean
  message: () => string
}

function buildTips(progress: ReturnType<typeof useProgress>): Tip[] {
  return [
    // 1. One page away from Cartographer (9/10 pages visited)
    {
      id: 'cartographer-close',
      condition: () => {
        const explorer = getExplorerState()
        return explorer.visitedPages.size === EXPLORER_PAGES.length - 1
      },
      message: () => {
        const explorer = getExplorerState()
        return `You've visited ${explorer.visitedPages.size} pages — one more for the Cartographer achievement!`
      },
    },
    // 2. Streak is at 2 days
    {
      id: 'streak-nudge-2',
      condition: () => progress.currentStreak === 2,
      message: () => 'Come back tomorrow to start a streak multiplier at 3 days!',
    },
    // 3. Completed 5+ lessons but never found an easter egg
    {
      id: 'easter-egg-hint',
      condition: () => {
        const completedCount = Object.values(progress.lessonProgress).filter(
          (p) => p.status === 'completed'
        ).length
        const explorer = getExplorerState()
        return completedCount >= 5 && explorer.easterEggsFound.size === 0
      },
      message: () =>
        'Psst... there are 5 hidden easter eggs on this site. Try the Konami code.',
    },
    // 4. Combo is 0 but completed a lesson in the last 10 minutes
    {
      id: 'combo-opportunity',
      condition: () => {
        if (progress.comboCount !== 0) return false
        if (!progress.lastCompletionTime) return false
        const elapsed = Date.now() - progress.lastCompletionTime
        return elapsed < COMBO_WINDOW_MS
      },
      message: () =>
        'Complete another lesson within 10 minutes for a combo bonus!',
    },
    // 5. Daily XP at 80%+ of goal but not complete
    {
      id: 'daily-goal-close',
      condition: () => {
        const percent = progress.dailyXpEarned / progress.dailyXpGoal
        return percent >= 0.8 && percent < 1
      },
      message: () => {
        const remaining = progress.dailyXpGoal - progress.dailyXpEarned
        return `Almost there! ${remaining} more XP to hit today's goal.`
      },
    },
    // 6. Close to leveling up (within 20 XP of next rank)
    {
      id: 'level-up-close',
      condition: () => {
        const nextLevel = getNextLevel()
        if (!nextLevel) return false
        const remaining = nextLevel.minXp - progress.totalXp
        return remaining > 0 && remaining <= 20
      },
      message: () => {
        const nextLevel = getNextLevel()
        if (!nextLevel) return ''
        const remaining = nextLevel.minXp - progress.totalXp
        return `Just ${remaining} XP to reach ${nextLevel.name}!`
      },
    },
    // 7. Completed a tier but hasn't started the next
    {
      id: 'tier-complete-nudge',
      condition: () => {
        for (let i = 0; i < CURRICULUM.length - 1; i++) {
          const tier = CURRICULUM[i]
          const nextTier = CURRICULUM[i + 1]
          const tierComplete = tier.lessons.every(
            (l) => progress.lessonProgress[l.id]?.status === 'completed'
          )
          const nextTierStarted = nextTier.lessons.some(
            (l) =>
              progress.lessonProgress[l.id]?.status === 'completed' ||
              progress.lessonProgress[l.id]?.status === 'in_progress'
          )
          if (tierComplete && !nextTierStarted) return true
        }
        return false
      },
      message: () => {
        for (let i = 0; i < CURRICULUM.length - 1; i++) {
          const tier = CURRICULUM[i]
          const nextTier = CURRICULUM[i + 1]
          const tierComplete = tier.lessons.every(
            (l) => progress.lessonProgress[l.id]?.status === 'completed'
          )
          const nextTierStarted = nextTier.lessons.some(
            (l) =>
              progress.lessonProgress[l.id]?.status === 'completed' ||
              progress.lessonProgress[l.id]?.status === 'in_progress'
          )
          if (tierComplete && !nextTierStarted) {
            return `Tier ${i + 1} complete! Ready for the next challenge?`
          }
        }
        return ''
      },
    },
  ]
}

export function useSmartTips() {
  const progress = useProgress()
  const hasRun = useRef(false)

  useEffect(() => {
    if (hasRun.current) return
    hasRun.current = true

    const timer = setTimeout(() => {
      const tips = buildTips(progress)

      for (const tip of tips) {
        if (wasTipShownRecently(tip.id)) continue
        if (!tip.condition()) continue

        const message = tip.message()
        if (!message) continue

        markTipShown(tip.id)
        toast(message, {
          duration: TIP_DURATION_MS,
          className:
            'font-mono text-xs border-foreground/10 bg-background/95 backdrop-blur-sm',
        })
        break
      }
    }, TIP_DELAY_MS)

    return () => clearTimeout(timer)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
}
