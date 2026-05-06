import { motion } from 'framer-motion'
import { Flame } from 'lucide-react'

interface StreakBadgeProps {
  streak: number
  className?: string
}

function getIntensity(streak: number): 'subtle' | 'medium' | 'strong' | 'intense' {
  if (streak >= 30) return 'intense'
  if (streak >= 14) return 'strong'
  if (streak >= 7) return 'medium'
  return 'subtle'
}

const intensityStyles = {
  subtle: {
    border: 'border-foreground/10',
    bg: 'bg-foreground/[0.03]',
    text: 'text-foreground/60',
    icon: 'text-foreground/50',
  },
  medium: {
    border: 'border-foreground/15',
    bg: 'bg-foreground/[0.05]',
    text: 'text-foreground/70',
    icon: 'text-foreground/60',
  },
  strong: {
    border: 'border-foreground/20',
    bg: 'bg-foreground/[0.07]',
    text: 'text-foreground/80',
    icon: 'text-foreground/70',
  },
  intense: {
    border: 'border-foreground/25',
    bg: 'bg-foreground/[0.09]',
    text: 'text-foreground/90',
    icon: 'text-foreground/80',
  },
}

export function StreakBadge({ streak, className = '' }: StreakBadgeProps) {
  if (streak < 3) return null

  const intensity = getIntensity(streak)
  const styles = intensityStyles[intensity]
  const shouldPulse = streak >= 7

  return (
    <motion.div
      role="status"
      aria-label={`${streak}-day streak active`}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border ${styles.border} ${styles.bg} ${className}`}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <motion.div
        animate={shouldPulse ? { scale: [1, 1.2, 1] } : undefined}
        transition={shouldPulse ? { repeat: Infinity, duration: 1.5, ease: 'easeInOut' } : undefined}
      >
        <Flame className={`w-4 h-4 ${styles.icon}`} aria-hidden="true" />
      </motion.div>
      <span className={`text-sm font-mono font-semibold ${styles.text}`}>
        {streak}
      </span>
      <span className={`text-xs font-mono ${styles.text} opacity-60`}>
        day streak
      </span>

      {/* Particle effects for intense streaks */}
      {intensity === 'intense' && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-full">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-foreground/20"
              initial={{ x: '50%', y: '100%', opacity: 0 }}
              animate={{
                y: [null, '-100%'],
                x: [`${30 + i * 20}%`, `${25 + i * 25}%`],
                opacity: [0, 0.6, 0],
              }}
              transition={{
                repeat: Infinity,
                duration: 2,
                delay: i * 0.6,
                ease: 'easeOut',
              }}
            />
          ))}
        </div>
      )}
    </motion.div>
  )
}
