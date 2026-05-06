import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { onProgressEvent } from '@/stores/progress'
import type { ProgressEvent } from '@/stores/progress'

interface FloatItem {
  id: string
  text: string
  subtext?: string
  size: 'sm' | 'md' | 'lg'
  duration: number
  x: number
}

const MAX_FLOATS = 5

function getXpFromEvent(event: ProgressEvent): { xp: number; text: string; subtext?: string; size: 'sm' | 'md' | 'lg'; duration: number } | null {
  switch (event.type) {
    case 'critical_hit':
      return { xp: event.totalXp, text: `+${event.totalXp} XP`, subtext: 'CRITICAL!', size: 'md', duration: 1.5 }
    case 'level_up':
      return { xp: 0, text: event.to, subtext: 'LEVEL UP', size: 'lg', duration: 2.5 }
    case 'achievement_unlocked':
      return { xp: event.achievement.xpReward, text: `+${event.achievement.xpReward} XP`, subtext: event.achievement.name, size: 'sm', duration: 1.5 }
    case 'challenge_completed':
      return { xp: event.challenge.xpReward, text: `+${event.challenge.xpReward} XP`, size: 'sm', duration: 1.5 }
    case 'streak_milestone':
      return { xp: 0, text: `${event.multiplier}x COMBO +${event.days}d`, size: 'md', duration: 1.5 }
    case 'first_of_day':
      return { xp: event.bonusXp, text: `+${event.bonusXp} XP`, subtext: 'First today!', size: 'sm', duration: 1.5 }
    case 'milestone':
      return { xp: 0, text: event.label, size: 'md', duration: 2 }
    case 'title_unlocked':
      return { xp: 0, text: event.title.name, subtext: 'Title Unlocked', size: 'md', duration: 2 }
    case 'streak_saved':
      return null
  }
}

export function XpFloatOverlay() {
  const [floats, setFloats] = useState<FloatItem[]>([])

  const addFloat = useCallback((item: Omit<FloatItem, 'id' | 'x'>) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
    const x = 60 + Math.random() * 25 // 60-85% from left (top-right area)

    setFloats((prev) => {
      const next = [...prev, { ...item, id, x }]
      if (next.length > MAX_FLOATS) {
        return next.slice(next.length - MAX_FLOATS)
      }
      return next
    })

    // Auto-remove after animation completes
    setTimeout(() => {
      setFloats((prev) => prev.filter((f) => f.id !== id))
    }, item.duration * 1000 + 100)
  }, [])

  useEffect(() => {
    const unsubscribe = onProgressEvent((event: ProgressEvent) => {
      const result = getXpFromEvent(event)
      if (!result) return

      addFloat({
        text: result.text,
        subtext: result.subtext,
        size: result.size,
        duration: result.duration,
      })
    })
    return unsubscribe
  }, [addFloat])

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden" aria-hidden="true">
      <AnimatePresence>
        {floats.map((f) => (
          <motion.div
            key={f.id}
            className="absolute flex flex-col items-center"
            style={{ left: `${f.x}%`, top: '12%' }}
            initial={{ opacity: 1, y: 0, scale: 0.8 }}
            animate={{ opacity: 0, y: -80, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: f.duration, ease: 'easeOut' }}
          >
            {f.subtext && (
              <span
                className={`font-mono font-bold text-foreground/90 whitespace-nowrap ${
                  f.size === 'lg' ? 'text-xs' : 'text-[10px]'
                }`}
              >
                {f.subtext}
              </span>
            )}
            <span
              className={`font-mono font-semibold text-foreground/70 whitespace-nowrap ${
                f.size === 'lg' ? 'text-2xl' : f.size === 'md' ? 'text-lg' : 'text-sm'
              }`}
            >
              {f.text}
            </span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
