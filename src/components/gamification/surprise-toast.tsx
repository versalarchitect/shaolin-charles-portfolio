import { Gift, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'

interface SurpriseToastProps {
  title: string
  message: string
  xp: number
}

export function SurpriseToast({ title, message, xp }: SurpriseToastProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex items-start gap-3 w-full"
    >
      {/* Icon with shimmer background */}
      <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-foreground/[0.06] border border-foreground/[0.1] shrink-0 overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-foreground/[0.08] via-transparent to-foreground/[0.04]"
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        {xp >= 20 ? (
          <Sparkles className="w-5 h-5 text-foreground/70 relative z-10" />
        ) : (
          <Gift className="w-5 h-5 text-foreground/70 relative z-10" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground/90 leading-tight">
          {title}
        </p>
        <p className="text-xs text-foreground/50 mt-0.5">
          {message}
        </p>
      </div>

      {/* XP badge with glow */}
      <div className="relative shrink-0">
        <motion.div
          className="absolute inset-0 rounded-md bg-foreground/[0.06] blur-sm"
          animate={{
            opacity: [0.4, 0.8, 0.4],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <span className="relative text-sm font-mono font-bold text-foreground/80 px-2 py-0.5 rounded-md bg-foreground/[0.05] border border-foreground/[0.1]">
          +{xp} XP
        </span>
      </div>
    </motion.div>
  )
}
