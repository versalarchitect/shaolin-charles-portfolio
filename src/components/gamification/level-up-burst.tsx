import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { onProgressEvent } from '@/stores/progress'
import type { ProgressEvent } from '@/stores/progress'

const LINE_COUNT = 24
const DURATION = 2

export function LevelUpBurst() {
  const [burst, setBurst] = useState<{ id: string; rankName: string } | null>(null)

  const triggerBurst = useCallback((rankName: string) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
    setBurst({ id, rankName })
    setTimeout(() => setBurst(null), DURATION * 1000 + 100)
  }, [])

  useEffect(() => {
    const unsubscribe = onProgressEvent((event: ProgressEvent) => {
      if (event.type === 'level_up') {
        triggerBurst(event.to)
      }
    })
    return unsubscribe
  }, [triggerBurst])

  return (
    <AnimatePresence>
      {burst && (
        <motion.div
          key={burst.id}
          aria-hidden="true"
          className="fixed inset-0 pointer-events-none z-[9998] flex items-center justify-center"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Radial burst lines */}
          {Array.from({ length: LINE_COUNT }).map((_, i) => {
            const angle = (360 / LINE_COUNT) * i
            return (
              <motion.div
                key={i}
                className="absolute w-px bg-foreground/30 origin-bottom"
                style={{
                  height: '0px',
                  transform: `rotate(${angle}deg)`,
                  transformOrigin: 'center bottom',
                  left: '50%',
                  top: '50%',
                  marginLeft: '-0.5px',
                }}
                initial={{ height: 0, opacity: 0.8 }}
                animate={{ height: 120, opacity: 0 }}
                transition={{
                  duration: DURATION * 0.6,
                  delay: i * 0.02,
                  ease: 'easeOut',
                }}
              />
            )
          })}

          {/* Rank name */}
          <motion.div
            className="absolute font-mono font-bold text-foreground/80 text-3xl tracking-wider uppercase"
            initial={{ scale: 0.3, opacity: 0 }}
            animate={{ scale: [0.3, 1.2, 1], opacity: [0, 1, 0] }}
            transition={{
              duration: DURATION,
              times: [0, 0.3, 1],
              ease: 'easeOut',
            }}
          >
            {burst.rankName}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
