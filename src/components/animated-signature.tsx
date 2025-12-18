import { motion, useReducedMotion } from 'framer-motion'

interface AnimatedSignatureProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
  animate?: boolean
}

export function AnimatedSignature({
  className = '',
  size = 'md',
  animate = true
}: AnimatedSignatureProps) {
  const prefersReducedMotion = useReducedMotion()
  const shouldAnimate = animate && !prefersReducedMotion

  const sizeClasses = {
    sm: 'w-24 h-8',
    md: 'w-32 h-10',
    lg: 'w-48 h-14',
  }

  // SVG path for "CG" monogram with stylized design
  const pathVariants = {
    hidden: {
      pathLength: 0,
      opacity: 0,
    },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { duration: 1.5, ease: 'easeInOut' },
        opacity: { duration: 0.2 },
      },
    },
  }

  return (
    <motion.svg
      viewBox="0 0 100 40"
      className={`${sizeClasses[size]} ${className}`}
      initial="hidden"
      animate={shouldAnimate ? 'visible' : 'visible'}
      aria-label="Charles Jackson signature"
    >
      {/* C letter */}
      <motion.path
        d="M 25 8 C 8 8, 8 32, 25 32 C 32 32, 36 28, 38 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        variants={shouldAnimate ? pathVariants : undefined}
      />

      {/* G letter */}
      <motion.path
        d="M 75 8 C 55 8, 55 32, 75 32 C 82 32, 88 28, 88 22 L 88 20 L 72 20"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        variants={shouldAnimate ? {
          ...pathVariants,
          visible: {
            ...pathVariants.visible,
            transition: {
              ...pathVariants.visible.transition,
              delay: 0.3,
            },
          },
        } : undefined}
      />

      {/* Decorative dot */}
      <motion.circle
        cx="50"
        cy="20"
        r="2.5"
        fill="currentColor"
        initial={shouldAnimate ? { scale: 0, opacity: 0 } : undefined}
        animate={shouldAnimate ? { scale: 1, opacity: 1 } : { scale: 1, opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.3, type: 'spring' }}
      />
    </motion.svg>
  )
}

// Animated logo box variant
export function AnimatedLogo({
  className = '',
  animate = true
}: {
  className?: string
  animate?: boolean
}) {
  const prefersReducedMotion = useReducedMotion()
  const shouldAnimate = animate && !prefersReducedMotion

  return (
    <motion.div
      className={`relative ${className}`}
      initial={shouldAnimate ? { opacity: 0, scale: 0.9 } : undefined}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, type: 'spring' }}
    >
      <motion.div
        className="w-10 h-10 rounded-lg bg-foreground flex items-center justify-center overflow-hidden"
        whileHover={shouldAnimate ? { scale: 1.05 } : undefined}
        whileTap={shouldAnimate ? { scale: 0.95 } : undefined}
      >
        {/* Background gradient animation */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-foreground via-foreground/90 to-foreground"
          animate={shouldAnimate ? {
            backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
          } : undefined}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: 'linear',
          }}
        />

        {/* Letters */}
        <motion.span
          className="relative text-background font-bold text-sm tracking-tight"
          initial={shouldAnimate ? { y: 10, opacity: 0 } : undefined}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          CG
        </motion.span>
      </motion.div>

      {/* Glow effect on hover */}
      <motion.div
        className="absolute inset-0 rounded-lg bg-foreground/20 blur-xl -z-10"
        initial={{ opacity: 0, scale: 0.8 }}
        whileHover={{ opacity: 1, scale: 1.2 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  )
}

// Full name with animated underline
export function AnimatedName({
  className = '',
  name = 'Charles Jackson'
}: {
  className?: string
  name?: string
}) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.span
      className={`relative inline-block group ${className}`}
      whileHover={prefersReducedMotion ? undefined : 'hover'}
    >
      <span className="relative z-10">{name}</span>

      {/* Animated underline */}
      <motion.span
        className="absolute bottom-0 left-0 h-[2px] bg-foreground"
        initial={{ width: 0 }}
        variants={{
          hover: { width: '100%' },
        }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      />
    </motion.span>
  )
}

// Typing effect for taglines
export function AnimatedTagline({
  text,
  className = '',
  delay = 0,
}: {
  text: string
  className?: string
  delay?: number
}) {
  const prefersReducedMotion = useReducedMotion()
  const characters = text.split('')

  if (prefersReducedMotion) {
    return <span className={className}>{text}</span>
  }

  return (
    <span className={className}>
      {characters.map((char, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.3,
            delay: delay + index * 0.03,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="inline-block"
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </span>
  )
}
