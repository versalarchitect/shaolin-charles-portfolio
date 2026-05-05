import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { toast } from 'sonner'
import { useAuth } from '@/hooks/use-auth'
import { useProgress, awardExplorerXp } from '@/stores/progress'
import { playSound } from '@/lib/sounds'
import { SurpriseToast } from '@/components/gamification/surprise-toast'

interface RewardType {
  title: string
  message: string
  xp: number
  /** Weight relative to other rewards (higher = more likely) */
  weight: number
}

const REWARDS: RewardType[] = [
  { title: 'Lucky Break!', message: 'The universe smiled on you. +10 XP', xp: 10, weight: 25 },
  { title: 'Curiosity Bonus!', message: 'Your curiosity is rewarded. +8 XP', xp: 8, weight: 25 },
  { title: 'Momentum Boost!', message: 'Keep the momentum going! +12 XP', xp: 12, weight: 25 },
  { title: 'Hidden Treasure!', message: 'You found a hidden treasure! +15 XP', xp: 15, weight: 20 },
  { title: 'Serendipity!', message: 'A rare reward appears! +20 XP', xp: 20, weight: 5 },
]

function pickWeightedReward(): RewardType {
  const totalWeight = REWARDS.reduce((sum, r) => sum + r.weight, 0)
  let roll = Math.random() * totalWeight
  for (const reward of REWARDS) {
    roll -= reward.weight
    if (roll <= 0) return reward
  }
  return REWARDS[0]
}

const TRIGGER_CHANCE = 0.05

export function useSurpriseRewards() {
  const { isLoggedIn } = useAuth()
  const location = useLocation()
  const progress = useProgress()
  const hasTriggeredRef = useRef(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const hasCompletedAnyLesson = Object.values(progress.lessonProgress).some(
    (p) => p.status === 'completed'
  )
  const isCourseRoute = location.pathname.startsWith('/course/')

  useEffect(() => {
    // Clean up any pending timer on navigation
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
        timerRef.current = null
      }
    }
  }, [location.pathname])

  useEffect(() => {
    if (!isLoggedIn || !isCourseRoute || !hasCompletedAnyLesson || hasTriggeredRef.current) {
      return
    }

    const roll = Math.random()
    if (roll > TRIGGER_CHANCE) return

    // Delay 2-3 seconds after navigation
    const delay = 2000 + Math.random() * 1000
    timerRef.current = setTimeout(() => {
      // Double-check we haven't triggered yet (guard against race conditions)
      if (hasTriggeredRef.current) return
      hasTriggeredRef.current = true

      const reward = pickWeightedReward()
      const eventKey = `surprise-${reward.title.toLowerCase().replace(/[^a-z]/g, '')}-${Date.now()}`

      awardExplorerXp(reward.xp, eventKey)
      playSound('discovery')

      toast.custom(
        () => SurpriseToast({ title: reward.title, message: reward.message, xp: reward.xp }),
        { duration: 5000 }
      )
    }, delay)

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
        timerRef.current = null
      }
    }
  }, [location.pathname, isLoggedIn, isCourseRoute, hasCompletedAnyLesson])
}
