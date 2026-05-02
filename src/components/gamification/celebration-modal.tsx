import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Crown, Zap, Trophy } from 'lucide-react'
import { onProgressEvent } from '@/stores/progress'
import type { ProgressEvent } from '@/stores/progress'
import { playSound } from '@/lib/sounds'
import { CelebrationParticles } from './celebration'

interface CelebrationData {
  icon: React.ReactNode
  title: string
  subtitle: string
  xp?: number
}

export function CelebrationModal() {
  const [celebration, setCelebration] = useState<CelebrationData | null>(null)

  useEffect(() => {
    const unsubscribe = onProgressEvent((event: ProgressEvent) => {
      const data = getCelebrationData(event)
      if (data) {
        setCelebration(data)
        playSound(event.type === 'critical_hit' ? 'critical' : 'levelup')
        setTimeout(() => setCelebration(null), 4000)
      }
    })
    return unsubscribe
  }, [])

  return (
    <AnimatePresence>
      {celebration && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setCelebration(null)}
        >
          <CelebrationParticles />
          <motion.div
            className="relative text-center space-y-4"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <motion.div
              className="mx-auto flex items-center justify-center w-20 h-20 rounded-full border-2 border-foreground/20 bg-foreground/5"
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              transition={{ duration: 0.5 }}
            >
              {celebration.icon}
            </motion.div>
            <motion.h2
              className="text-3xl font-bold"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {celebration.title}
            </motion.h2>
            <motion.p
              className="text-foreground/60 text-lg"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {celebration.subtitle}
            </motion.p>
            {celebration.xp && (
              <motion.div
                className="font-mono text-2xl font-bold"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4, type: 'spring' }}
              >
                +{celebration.xp} XP
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function getCelebrationData(event: ProgressEvent): CelebrationData | null {
  switch (event.type) {
    case 'level_up':
      return { icon: <Crown className="w-10 h-10 text-foreground/80" />, title: `${event.to}!`, subtitle: `Promoted from ${event.from}` }
    case 'milestone':
      return { icon: <Trophy className="w-10 h-10 text-foreground/80" />, title: event.label, subtitle: `${event.percent}% of the course complete` }
    case 'critical_hit':
      return { icon: <Zap className="w-10 h-10 text-foreground/80" />, title: 'CRITICAL HIT!', subtitle: 'Double XP earned', xp: event.totalXp }
    default:
      return null
  }
}
