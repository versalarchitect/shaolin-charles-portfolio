import { useRef, useState, useEffect, type ReactNode, type MouseEvent, type CSSProperties, useCallback, type ReactElement } from 'react'
import { motion, useMotionValue, useSpring, useTransform, useScroll, useReducedMotion, type MotionStyle, useAnimationFrame, AnimatePresence } from 'framer-motion'

// ============================================================================
// MOTION PREFERENCES HOOK
// ============================================================================
export function useMotionPreference() {
  const prefersReducedMotion = useReducedMotion()
  return {
    shouldAnimate: !prefersReducedMotion,
    duration: prefersReducedMotion ? 0 : undefined,
    transition: prefersReducedMotion ? { duration: 0 } : undefined,
  }
}

// ============================================================================
// 3D TILT CARD - Premium hover effect with depth
// ============================================================================
interface TiltCardProps {
  children: ReactNode
  className?: string
  style?: React.CSSProperties
  tiltAmount?: number
  glareEnabled?: boolean
  glareOpacity?: number
  perspective?: number
}

export function TiltCard({
  children,
  className = '',
  style,
  tiltAmount = 10,
  glareEnabled = true,
  glareOpacity = 0.1,
  perspective = 1000,
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { shouldAnimate } = useMotionPreference()

  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const springConfig = { damping: 20, stiffness: 200 }
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [tiltAmount, -tiltAmount]), springConfig)
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-tiltAmount, tiltAmount]), springConfig)

  // glareX/glareY could be used for dynamic glare position but we use static radial gradient instead
  useTransform(x, [-0.5, 0.5], ['0%', '100%'])
  useTransform(y, [-0.5, 0.5], ['0%', '100%'])

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!ref.current || !shouldAnimate) return
    const rect = ref.current.getBoundingClientRect()
    const xPos = (e.clientX - rect.left) / rect.width - 0.5
    const yPos = (e.clientY - rect.top) / rect.height - 0.5
    x.set(xPos)
    y.set(yPos)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  const containerStyle: CSSProperties = {
    perspective,
    transformStyle: 'preserve-3d',
    ...style,
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={containerStyle as MotionStyle}
      className={className}
    >
      <motion.div
        style={{
          rotateX: shouldAnimate ? rotateX : 0,
          rotateY: shouldAnimate ? rotateY : 0,
          transformStyle: 'preserve-3d',
        }}
        className="relative w-full h-full"
      >
        {children}
        {glareEnabled && shouldAnimate && (
          <div
            className="absolute inset-0 pointer-events-none rounded-[inherit] overflow-hidden"
            style={{
              background: `radial-gradient(circle at 50% 50%, rgba(255,255,255,${glareOpacity}), transparent 60%)`,
            }}
          />
        )}
      </motion.div>
    </motion.div>
  )
}

// ============================================================================
// SPOTLIGHT CARD - Cursor-following spotlight effect
// ============================================================================
interface SpotlightCardProps {
  children: ReactNode
  className?: string
  spotlightColor?: string
  spotlightSize?: number
}

export function SpotlightCard({
  children,
  className = '',
  spotlightColor = 'rgba(255, 255, 255, 0.1)',
  spotlightSize = 300,
}: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { shouldAnimate } = useMotionPreference()
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!ref.current || !shouldAnimate) return
    const rect = ref.current.getBoundingClientRect()
    setPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative overflow-hidden ${className}`}
    >
      {shouldAnimate && (
        <motion.div
          className="absolute pointer-events-none -inset-px rounded-[inherit] opacity-0 transition-opacity duration-300"
          style={{
            background: `radial-gradient(${spotlightSize}px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 60%)`,
            opacity: isHovered ? 1 : 0,
          }}
        />
      )}
      {children}
    </motion.div>
  )
}

// ============================================================================
// ANIMATED GRADIENT BORDER
// ============================================================================
interface GradientBorderProps {
  children: ReactNode
  className?: string
  borderWidth?: number
  gradientColors?: string[]
  duration?: number
}

export function GradientBorder({
  children,
  className = '',
  borderWidth = 1,
  gradientColors = ['#fff', '#888', '#fff'],
  duration = 3,
}: GradientBorderProps) {
  const { shouldAnimate } = useMotionPreference()

  return (
    <div className={`relative ${className}`}>
      <motion.div
        className="absolute -inset-px rounded-[inherit] opacity-50"
        style={{
          background: `linear-gradient(var(--gradient-angle, 0deg), ${gradientColors.join(', ')})`,
          padding: borderWidth,
        }}
        animate={shouldAnimate ? { '--gradient-angle': ['0deg', '360deg'] } : {}}
        transition={{
          duration,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
      <div className="relative bg-background rounded-[inherit]">{children}</div>
    </div>
  )
}

// ============================================================================
// TEXT REVEAL ANIMATION
// ============================================================================
interface TextRevealProps {
  children: string
  className?: string
  delay?: number
  staggerDelay?: number
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span'
}

export function TextReveal({
  children,
  className = '',
  delay = 0,
  staggerDelay = 0.03,
  as: Component = 'span',
}: TextRevealProps) {
  const { shouldAnimate } = useMotionPreference()
  const words = children.split(' ')

  if (!shouldAnimate) {
    return <Component className={className}>{children}</Component>
  }

  return (
    <Component className={className}>
      {words.map((word, wordIndex) => (
        <span key={wordIndex} className="inline-block overflow-hidden">
          <motion.span
            className="inline-block"
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              duration: 0.5,
              delay: delay + wordIndex * staggerDelay,
              ease: [0.33, 1, 0.68, 1],
            }}
          >
            {word}
          </motion.span>
          {wordIndex < words.length - 1 && '\u00A0'}
        </span>
      ))}
    </Component>
  )
}

// ============================================================================
// CHARACTER REVEAL ANIMATION
// ============================================================================
interface CharacterRevealProps {
  children: string
  className?: string
  delay?: number
  staggerDelay?: number
}

export function CharacterReveal({
  children,
  className = '',
  delay = 0,
  staggerDelay = 0.02,
}: CharacterRevealProps) {
  const { shouldAnimate } = useMotionPreference()
  const chars = children.split('')

  if (!shouldAnimate) {
    return <span className={className}>{children}</span>
  }

  return (
    <span className={className}>
      {chars.map((char, index) => (
        <motion.span
          key={index}
          className="inline-block"
          initial={{ opacity: 0, y: 20, rotateX: -90 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{
            duration: 0.4,
            delay: delay + index * staggerDelay,
            ease: [0.33, 1, 0.68, 1],
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </span>
  )
}

// ============================================================================
// PARALLAX SECTION
// ============================================================================
interface ParallaxSectionProps {
  children: ReactNode
  className?: string
  speed?: number
  direction?: 'up' | 'down'
}

export function ParallaxSection({
  children,
  className = '',
  speed = 0.5,
  direction = 'up',
}: ParallaxSectionProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { shouldAnimate } = useMotionPreference()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const multiplier = direction === 'up' ? -1 : 1
  const y = useTransform(scrollYProgress, [0, 1], [100 * speed * multiplier, -100 * speed * multiplier])

  return (
    <motion.div
      ref={ref}
      style={{ y: shouldAnimate ? y : 0 }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ============================================================================
// SCROLL FADE IN - Always animates on mount
// ============================================================================
interface ScrollFadeInProps {
  children: ReactNode
  className?: string
  delay?: number
  duration?: number
  direction?: 'up' | 'down' | 'left' | 'right' | 'none'
  distance?: number
  immediate?: boolean // kept for backwards compatibility, ignored
}

export function ScrollFadeIn({
  children,
  className = '',
  delay = 0,
  duration = 0.6,
  direction = 'up',
  distance = 30,
}: ScrollFadeInProps) {
  const { shouldAnimate } = useMotionPreference()

  const getInitialPosition = () => {
    switch (direction) {
      case 'up':
        return { y: distance }
      case 'down':
        return { y: -distance }
      case 'left':
        return { x: distance }
      case 'right':
        return { x: -distance }
      default:
        return {}
    }
  }

  if (!shouldAnimate) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, ...getInitialPosition() }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{
        duration,
        delay,
        ease: [0.33, 1, 0.68, 1],
      }}
    >
      {children}
    </motion.div>
  )
}

// ============================================================================
// STAGGER CONTAINER - Always animates on mount
// ============================================================================
interface StaggerContainerProps {
  children: ReactNode
  className?: string
  staggerDelay?: number
  delayStart?: number
  immediate?: boolean // kept for backwards compatibility, ignored
}

export function StaggerContainer({
  children,
  className = '',
  staggerDelay = 0.1,
  delayStart = 0,
}: StaggerContainerProps) {
  const { shouldAnimate } = useMotionPreference()

  if (!shouldAnimate) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay,
            delayChildren: delayStart,
          },
        },
      }}
    >
      {children}
    </motion.div>
  )
}

export const staggerItemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.33, 1, 0.68, 1],
    },
  },
}

// ============================================================================
// MAGNETIC ELEMENT
// ============================================================================
interface MagneticProps {
  children: ReactNode
  className?: string
  strength?: number
}

export function Magnetic({ children, className = '', strength = 0.3 }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { shouldAnimate } = useMotionPreference()

  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const springConfig = { damping: 15, stiffness: 150 }
  const xSpring = useSpring(x, springConfig)
  const ySpring = useSpring(y, springConfig)

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!ref.current || !shouldAnimate) return
    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    x.set((e.clientX - centerX) * strength)
    y.set((e.clientY - centerY) * strength)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: shouldAnimate ? xSpring : 0, y: shouldAnimate ? ySpring : 0 }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ============================================================================
// GLOWING BORDER ON HOVER
// ============================================================================
interface GlowBorderProps {
  children: ReactNode
  className?: string
  glowColor?: string
  glowSize?: number
}

export function GlowBorder({
  children,
  className = '',
  glowColor = 'rgba(255, 255, 255, 0.15)',
  glowSize = 10,
}: GlowBorderProps) {
  const { shouldAnimate } = useMotionPreference()

  return (
    <motion.div
      className={`relative ${className}`}
      whileHover={shouldAnimate ? {
        boxShadow: `0 0 ${glowSize}px ${glowColor}, 0 0 ${glowSize * 2}px ${glowColor}`,
      } : {}}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  )
}

// ============================================================================
// ANIMATED COUNTER WITH SCROLL TRIGGER
// ============================================================================
interface AnimatedNumberProps {
  value: number
  className?: string
  duration?: number
  prefix?: string
  suffix?: string
}

export function AnimatedNumber({
  value,
  className = '',
  duration = 2,
  prefix = '',
  suffix = '',
}: AnimatedNumberProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const { shouldAnimate } = useMotionPreference()
  const [isInView, setIsInView] = useState(false)

  const motionValue = useMotionValue(0)
  const springValue = useSpring(motionValue, { duration: duration * 1000, bounce: 0 })
  const displayValue = useTransform(springValue, (val) => Math.round(val))
  const [display, setDisplay] = useState(shouldAnimate ? 0 : value)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isInView) {
          setIsInView(true)
        }
      },
      { threshold: 0.5 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [isInView])

  useEffect(() => {
    if (isInView && shouldAnimate) {
      motionValue.set(value)
    }
  }, [isInView, shouldAnimate, motionValue, value])

  useEffect(() => {
    if (!shouldAnimate) {
      setDisplay(value)
      return
    }

    const unsubscribe = displayValue.on('change', (val) => {
      setDisplay(val)
    })
    return () => unsubscribe()
  }, [displayValue, shouldAnimate, value])

  return (
    <span ref={ref} className={className}>
      {prefix}
      {display}
      {suffix}
    </span>
  )
}

// ============================================================================
// SKELETON LOADER
// ============================================================================
interface SkeletonProps {
  className?: string
  variant?: 'text' | 'circular' | 'rectangular'
  width?: string | number
  height?: string | number
}

export function Skeleton({
  className = '',
  variant = 'rectangular',
  width,
  height,
}: SkeletonProps) {
  const baseClasses = 'bg-muted animate-skeleton'
  const variantClasses = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  }

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={{ width, height }}
    />
  )
}

// ============================================================================
// SCROLL PROGRESS INDICATOR
// ============================================================================
interface ScrollProgressProps {
  className?: string
  height?: number
  color?: string
}

export function ScrollProgress({
  className = '',
  height = 2,
  color,
}: ScrollProgressProps) {
  const { scrollYProgress } = useScroll()
  const { shouldAnimate } = useMotionPreference()

  if (!shouldAnimate) return null

  return (
    <motion.div
      className={`fixed top-0 left-0 right-0 z-[100] origin-left ${className}`}
      style={{
        height,
        scaleX: scrollYProgress,
        backgroundColor: color || 'currentColor',
      }}
    />
  )
}

// ============================================================================
// FLOATING ELEMENT
// ============================================================================
interface FloatingProps {
  children: ReactNode
  className?: string
  amplitude?: number
  duration?: number
  delay?: number
}

export function Floating({
  children,
  className = '',
  amplitude = 10,
  duration = 3,
  delay = 0,
}: FloatingProps) {
  const { shouldAnimate } = useMotionPreference()

  if (!shouldAnimate) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={className}
      animate={{
        y: [-amplitude, amplitude, -amplitude],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      {children}
    </motion.div>
  )
}

// ============================================================================
// BLUR FADE IN - Always animates on mount
// ============================================================================
interface BlurFadeInProps {
  children: ReactNode
  className?: string
  delay?: number
  duration?: number
  blur?: number
  immediate?: boolean // kept for backwards compatibility, ignored
}

export function BlurFadeIn({
  children,
  className = '',
  delay = 0,
  duration = 0.6,
  blur = 10,
}: BlurFadeInProps) {
  const { shouldAnimate } = useMotionPreference()

  if (!shouldAnimate) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, filter: `blur(${blur}px)`, y: 20 }}
      animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
      transition={{
        duration,
        delay,
        ease: [0.33, 1, 0.68, 1],
      }}
    >
      {children}
    </motion.div>
  )
}

// ============================================================================
// PARTICLE FIELD - Canvas-based floating particles background
// ============================================================================
interface ParticleFieldProps {
  className?: string
  particleCount?: number
  particleColor?: string
  connectionDistance?: number
  speed?: number
}

export function ParticleField({
  className = '',
  particleCount = 50,
  particleColor = 'rgba(255, 255, 255, 0.5)',
  connectionDistance = 100,
  speed = 0.5,
}: ParticleFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { shouldAnimate } = useMotionPreference()
  const particlesRef = useRef<Array<{ x: number; y: number; vx: number; vy: number }>>([])
  const animationRef = useRef<number | undefined>(undefined)

  useEffect(() => {
    if (!canvasRef.current || !shouldAnimate) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio
      canvas.height = canvas.offsetHeight * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }
    resize()
    window.addEventListener('resize', resize)

    // Initialize particles
    particlesRef.current = Array.from({ length: particleCount }, () => ({
      x: Math.random() * canvas.offsetWidth,
      y: Math.random() * canvas.offsetHeight,
      vx: (Math.random() - 0.5) * speed,
      vy: (Math.random() - 0.5) * speed,
    }))

    const animate = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight)
      const particles = particlesRef.current

      // Update and draw particles
      particles.forEach((p, i) => {
        p.x += p.vx
        p.y += p.vy

        // Bounce off edges
        if (p.x < 0 || p.x > canvas.offsetWidth) p.vx *= -1
        if (p.y < 0 || p.y > canvas.offsetHeight) p.vy *= -1

        // Draw particle
        ctx.beginPath()
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2)
        ctx.fillStyle = particleColor
        ctx.fill()

        // Draw connections
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j]
          const dx = p.x - p2.x
          const dy = p.y - p2.y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < connectionDistance) {
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.strokeStyle = particleColor.replace(/[\d.]+\)$/, `${(1 - dist / connectionDistance) * 0.3})`)
            ctx.stroke()
          }
        }
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resize)
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [shouldAnimate, particleCount, particleColor, connectionDistance, speed])

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{ width: '100%', height: '100%' }}
    />
  )
}

// ============================================================================
// MORPHING BLOB - Organic animated shape
// ============================================================================
interface MorphingBlobProps {
  className?: string
  color?: string
  size?: number
  blur?: number
}

export function MorphingBlob({
  className = '',
  color = 'rgba(255, 255, 255, 0.1)',
  size = 400,
  blur = 40,
}: MorphingBlobProps) {
  const { shouldAnimate } = useMotionPreference()

  if (!shouldAnimate) {
    return (
      <div
        className={`absolute rounded-full ${className}`}
        style={{
          width: size,
          height: size,
          background: color,
          filter: `blur(${blur}px)`,
        }}
      />
    )
  }

  return (
    <motion.div
      className={`absolute ${className}`}
      style={{ width: size, height: size, filter: `blur(${blur}px)` }}
      animate={{
        borderRadius: [
          '60% 40% 30% 70% / 60% 30% 70% 40%',
          '30% 60% 70% 40% / 50% 60% 30% 60%',
          '60% 40% 30% 70% / 60% 30% 70% 40%',
        ],
        scale: [1, 1.05, 1],
        rotate: [0, 180, 360],
      }}
      transition={{
        duration: 20,
        repeat: Infinity,
        ease: 'linear',
      }}
    >
      <div className="w-full h-full" style={{ background: color }} />
    </motion.div>
  )
}

// ============================================================================
// HOVER CARD 3D - Advanced 3D card with lighting effects
// ============================================================================
interface HoverCard3DProps {
  children: ReactNode
  className?: string
  glowColor?: string
  depth?: number
}

export function HoverCard3D({
  children,
  className = '',
  glowColor = 'rgba(255, 255, 255, 0.1)',
  depth = 50,
}: HoverCard3DProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { shouldAnimate } = useMotionPreference()
  const [rotateX, setRotateX] = useState(0)
  const [rotateY, setRotateY] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!ref.current || !shouldAnimate) return
    const rect = ref.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    setRotateX(-y * 20)
    setRotateY(x * 20)
  }

  const handleMouseLeave = () => {
    setRotateX(0)
    setRotateY(0)
    setIsHovered(false)
  }

  return (
    <motion.div
      ref={ref}
      className={`relative ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: 1000,
        transformStyle: 'preserve-3d',
      }}
      animate={{
        rotateX: shouldAnimate ? rotateX : 0,
        rotateY: shouldAnimate ? rotateY : 0,
        z: isHovered && shouldAnimate ? depth : 0,
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <div
        className="absolute inset-0 rounded-[inherit] transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at ${50 + rotateY * 2}% ${50 - rotateX * 2}%, ${glowColor}, transparent 60%)`,
          opacity: isHovered ? 1 : 0,
        }}
      />
      {children}
    </motion.div>
  )
}

// ============================================================================
// TYPING EFFECT - Realistic typewriter animation
// ============================================================================
interface TypingEffectProps {
  text: string
  className?: string
  speed?: number
  delay?: number
  cursor?: boolean
  onComplete?: () => void
}

export function TypingEffect({
  text,
  className = '',
  speed = 50,
  delay = 0,
  cursor = true,
  onComplete,
}: TypingEffectProps) {
  const [displayText, setDisplayText] = useState('')
  const [isComplete, setIsComplete] = useState(false)
  const { shouldAnimate } = useMotionPreference()

  useEffect(() => {
    if (!shouldAnimate) {
      setDisplayText(text)
      setIsComplete(true)
      onComplete?.()
      return
    }

    let i = 0
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        if (i < text.length) {
          setDisplayText(text.slice(0, i + 1))
          i++
        } else {
          clearInterval(interval)
          setIsComplete(true)
          onComplete?.()
        }
      }, speed)

      return () => clearInterval(interval)
    }, delay)

    return () => clearTimeout(timeout)
  }, [text, speed, delay, shouldAnimate, onComplete])

  return (
    <span className={className}>
      {displayText}
      {cursor && !isComplete && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
          className="inline-block w-[2px] h-[1em] bg-current ml-0.5 align-middle"
        />
      )}
    </span>
  )
}

// ============================================================================
// GRID DISTORTION - Interactive grid with mouse distortion
// ============================================================================
interface GridDistortionProps {
  className?: string
  gridSize?: number
  distortionStrength?: number
  lineColor?: string
}

export function GridDistortion({
  className = '',
  gridSize = 40,
  distortionStrength = 30,
  lineColor = 'rgba(255, 255, 255, 0.1)',
}: GridDistortionProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const { shouldAnimate } = useMotionPreference()
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 })
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  useEffect(() => {
    if (!svgRef.current) return
    const resize = () => {
      const rect = svgRef.current?.parentElement?.getBoundingClientRect()
      if (rect) {
        setDimensions({ width: rect.width, height: rect.height })
      }
    }
    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [])

  const handleMouseMove = (e: MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current || !shouldAnimate) return
    const rect = svgRef.current.getBoundingClientRect()
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }

  const handleMouseLeave = () => {
    setMousePos({ x: -1000, y: -1000 })
  }

  const getDistortedPoint = (x: number, y: number) => {
    const dx = x - mousePos.x
    const dy = y - mousePos.y
    const dist = Math.sqrt(dx * dx + dy * dy)
    const maxDist = 150

    if (dist < maxDist && shouldAnimate) {
      const factor = (1 - dist / maxDist) * distortionStrength
      return {
        x: x + (dx / dist) * factor,
        y: y + (dy / dist) * factor,
      }
    }
    return { x, y }
  }

  const lines: ReactElement[] = []
  const cols = Math.ceil(dimensions.width / gridSize) + 1
  const rows = Math.ceil(dimensions.height / gridSize) + 1

  // Vertical lines
  for (let i = 0; i < cols; i++) {
    const points: string[] = []
    for (let j = 0; j <= rows; j++) {
      const { x, y } = getDistortedPoint(i * gridSize, j * gridSize)
      points.push(`${x},${y}`)
    }
    lines.push(
      <polyline
        key={`v-${i}`}
        points={points.join(' ')}
        fill="none"
        stroke={lineColor}
        strokeWidth="1"
      />
    )
  }

  // Horizontal lines
  for (let j = 0; j < rows; j++) {
    const points: string[] = []
    for (let i = 0; i <= cols; i++) {
      const { x, y } = getDistortedPoint(i * gridSize, j * gridSize)
      points.push(`${x},${y}`)
    }
    lines.push(
      <polyline
        key={`h-${j}`}
        points={points.join(' ')}
        fill="none"
        stroke={lineColor}
        strokeWidth="1"
      />
    )
  }

  return (
    <svg
      ref={svgRef}
      className={`absolute inset-0 pointer-events-auto ${className}`}
      style={{ width: '100%', height: '100%' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {lines}
    </svg>
  )
}

// ============================================================================
// MARQUEE - Infinite scrolling content
// ============================================================================
interface MarqueeProps {
  children: ReactNode
  className?: string
  speed?: number
  direction?: 'left' | 'right'
  pauseOnHover?: boolean
}

export function Marquee({
  children,
  className = '',
  speed = 50,
  direction = 'left',
  pauseOnHover = true,
}: MarqueeProps) {
  const { shouldAnimate } = useMotionPreference()
  const [isPaused, setIsPaused] = useState(false)

  if (!shouldAnimate) {
    return <div className={className}>{children}</div>
  }

  return (
    <div
      className={`overflow-hidden ${className}`}
      onMouseEnter={() => pauseOnHover && setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <motion.div
        className="flex gap-8"
        animate={{
          x: direction === 'left' ? ['0%', '-50%'] : ['-50%', '0%'],
        }}
        transition={{
          duration: speed,
          repeat: Infinity,
          ease: 'linear',
          repeatType: 'loop',
        }}
        style={{ animationPlayState: isPaused ? 'paused' : 'running' }}
      >
        {children}
        {children}
      </motion.div>
    </div>
  )
}

// ============================================================================
// SPLIT TEXT - Text animation on hover with character split
// ============================================================================
interface SplitTextProps {
  children: string
  className?: string
}

export function SplitText({ children, className = '' }: SplitTextProps) {
  const { shouldAnimate } = useMotionPreference()
  const [isHovered, setIsHovered] = useState(false)

  if (!shouldAnimate) {
    return <span className={className}>{children}</span>
  }

  return (
    <span
      className={`inline-block ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children.split('').map((char, i) => (
        <motion.span
          key={i}
          className="inline-block"
          animate={isHovered ? { y: [0, -4, 0], color: 'var(--foreground)' } : { y: 0 }}
          transition={{
            duration: 0.3,
            delay: i * 0.02,
            ease: 'easeOut',
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </span>
  )
}

// ============================================================================
// ORBIT - Rotating elements around a center
// ============================================================================
interface OrbitProps {
  children: ReactNode
  className?: string
  radius?: number
  duration?: number
  reverse?: boolean
}

export function Orbit({
  children,
  className = '',
  radius = 100,
  duration = 20,
  reverse = false,
}: OrbitProps) {
  const { shouldAnimate } = useMotionPreference()

  if (!shouldAnimate) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={`absolute ${className}`}
      style={{
        width: radius * 2,
        height: radius * 2,
      }}
      animate={{ rotate: reverse ? -360 : 360 }}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'linear',
      }}
    >
      <div
        className="absolute"
        style={{
          left: '50%',
          top: 0,
          transform: 'translateX(-50%)',
        }}
      >
        <motion.div
          animate={{ rotate: reverse ? 360 : -360 }}
          transition={{
            duration,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          {children}
        </motion.div>
      </div>
    </motion.div>
  )
}

// ============================================================================
// GLITCH TEXT - Glitch effect on text
// ============================================================================
interface GlitchTextProps {
  children: string
  className?: string
  intensity?: number
}

export function GlitchText({
  children,
  className = '',
  intensity = 1,
}: GlitchTextProps) {
  const { shouldAnimate } = useMotionPreference()
  const [isGlitching, setIsGlitching] = useState(false)

  useEffect(() => {
    if (!shouldAnimate) return
    const interval = setInterval(() => {
      setIsGlitching(true)
      setTimeout(() => setIsGlitching(false), 80 + Math.random() * 80)
    }, 3000 + Math.random() * 2000)
    return () => clearInterval(interval)
  }, [shouldAnimate])

  if (!shouldAnimate) {
    return <span className={className}>{children}</span>
  }

  return (
    <span className={`relative inline-block ${className}`}>
      <span className="relative z-10">{children}</span>
      <AnimatePresence>
        {isGlitching && (
          <>
            {/* Monochromatic glitch - light gray offset */}
            <motion.span
              className="absolute inset-0 opacity-60"
              style={{
                color: 'rgba(255, 255, 255, 0.8)',
                clipPath: 'polygon(0 0, 100% 0, 100% 45%, 0 45%)'
              }}
              initial={{ x: 0 }}
              animate={{ x: [-2 * intensity, 2 * intensity, -2 * intensity] }}
              exit={{ x: 0 }}
              transition={{ duration: 0.08 }}
            >
              {children}
            </motion.span>
            {/* Monochromatic glitch - dark gray offset */}
            <motion.span
              className="absolute inset-0 opacity-50"
              style={{
                color: 'rgba(100, 100, 100, 0.9)',
                clipPath: 'polygon(0 55%, 100% 55%, 100% 100%, 0 100%)'
              }}
              initial={{ x: 0 }}
              animate={{ x: [2 * intensity, -2 * intensity, 2 * intensity] }}
              exit={{ x: 0 }}
              transition={{ duration: 0.08 }}
            >
              {children}
            </motion.span>
          </>
        )}
      </AnimatePresence>
    </span>
  )
}

// ============================================================================
// REVEAL ON SCROLL - Mask reveal animation
// ============================================================================
interface RevealOnScrollProps {
  children: ReactNode
  className?: string
  direction?: 'up' | 'down' | 'left' | 'right'
}

export function RevealOnScroll({
  children,
  className = '',
  direction = 'up',
}: RevealOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { shouldAnimate } = useMotionPreference()
  const [isVisible, setIsVisible] = useState(false)
  const [hasCheckedInitial, setHasCheckedInitial] = useState(false)

  useEffect(() => {
    if (!shouldAnimate) {
      setIsVisible(true)
      return
    }

    // Check immediately if element is already in viewport on mount
    if (ref.current && !hasCheckedInitial) {
      const rect = ref.current.getBoundingClientRect()
      const windowHeight = window.innerHeight
      // If element is already visible (even partially), show it immediately
      if (rect.top < windowHeight + 100) {
        setIsVisible(true)
        setHasCheckedInitial(true)
        return
      }
      setHasCheckedInitial(true)
    }

    if (!ref.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      {
        threshold: 0,
        rootMargin: '100px 0px' // Trigger 100px before element enters viewport
      }
    )

    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [shouldAnimate, hasCheckedInitial])

  const getClipPath = () => {
    if (!isVisible) {
      switch (direction) {
        case 'up':
          return 'inset(100% 0 0 0)'
        case 'down':
          return 'inset(0 0 100% 0)'
        case 'left':
          return 'inset(0 100% 0 0)'
        case 'right':
          return 'inset(0 0 0 100%)'
      }
    }
    return 'inset(0 0 0 0)'
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={false}
      animate={{ clipPath: isVisible ? 'inset(0 0 0 0)' : getClipPath() }}
      transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
    >
      {children}
    </motion.div>
  )
}

// ============================================================================
// PERSPECTIVE TEXT - 3D text with perspective
// ============================================================================
interface PerspectiveTextProps {
  children: string
  className?: string
}

export function PerspectiveText({ children, className = '' }: PerspectiveTextProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { shouldAnimate } = useMotionPreference()
  const [rotateX, setRotateX] = useState(0)
  const [rotateY, setRotateY] = useState(0)

  const handleMouseMove = useCallback((e: globalThis.MouseEvent) => {
    if (!ref.current || !shouldAnimate) return
    const rect = ref.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    setRotateX(-y * 10)
    setRotateY(x * 10)
  }, [shouldAnimate])

  const handleMouseLeave = useCallback(() => {
    setRotateX(0)
    setRotateY(0)
  }, [])

  useEffect(() => {
    const element = ref.current
    if (!element) return
    element.addEventListener('mousemove', handleMouseMove as EventListener)
    element.addEventListener('mouseleave', handleMouseLeave)
    return () => {
      element.removeEventListener('mousemove', handleMouseMove as EventListener)
      element.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [handleMouseMove, handleMouseLeave])

  return (
    <motion.div
      ref={ref}
      className={`inline-block ${className}`}
      style={{ perspective: 500 }}
      animate={{
        rotateX: shouldAnimate ? rotateX : 0,
        rotateY: shouldAnimate ? rotateY : 0,
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {children}
    </motion.div>
  )
}

// ============================================================================
// WAVE TEXT - Wave animation on text
// ============================================================================
interface WaveTextProps {
  children: string
  className?: string
  amplitude?: number
  frequency?: number
}

export function WaveText({
  children,
  className = '',
  amplitude = 5,
  frequency = 0.1,
}: WaveTextProps) {
  const { shouldAnimate } = useMotionPreference()
  const [time, setTime] = useState(0)

  useAnimationFrame(() => {
    if (shouldAnimate) {
      setTime((prev) => prev + 1)
    }
  })

  if (!shouldAnimate) {
    return <span className={className}>{children}</span>
  }

  return (
    <span className={className}>
      {children.split('').map((char, i) => (
        <motion.span
          key={i}
          className="inline-block"
          style={{
            y: Math.sin(time * frequency + i * 0.5) * amplitude,
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </span>
  )
}

// ============================================================================
// MAGNETIC TEXT - Text that reacts to cursor
// ============================================================================
interface MagneticTextProps {
  children: string
  className?: string
  strength?: number
}

export function MagneticText({
  children,
  className = '',
  strength = 0.2,
}: MagneticTextProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const { shouldAnimate } = useMotionPreference()
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const springConfig = { damping: 15, stiffness: 150 }
  const xSpring = useSpring(x, springConfig)
  const ySpring = useSpring(y, springConfig)

  const handleMouseMove = (e: MouseEvent<HTMLSpanElement>) => {
    if (!ref.current || !shouldAnimate) return
    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    x.set((e.clientX - centerX) * strength)
    y.set((e.clientY - centerY) * strength)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.span
      ref={ref}
      className={`inline-block ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: shouldAnimate ? xSpring : 0, y: shouldAnimate ? ySpring : 0 }}
    >
      {children}
    </motion.span>
  )
}

// ============================================================================
// COUNTER UP - Animated counting number
// ============================================================================
interface CounterUpProps {
  end: number
  className?: string
  duration?: number
  prefix?: string
  suffix?: string
  decimals?: number
}

export function CounterUp({
  end,
  className = '',
  duration = 2,
  prefix = '',
  suffix = '',
  decimals = 0,
}: CounterUpProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const { shouldAnimate } = useMotionPreference()
  const [isInView, setIsInView] = useState(false)
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!ref.current) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isInView) {
          setIsInView(true)
        }
      },
      { threshold: 0.5 }
    )
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [isInView])

  useEffect(() => {
    if (!isInView || !shouldAnimate) {
      setCount(end)
      return
    }

    let startTime: number
    let animationFrame: number

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1)
      const eased = 1 - (1 - progress) ** 3 // Ease out cubic
      setCount(eased * end)

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrame)
  }, [isInView, end, duration, shouldAnimate])

  return (
    <span ref={ref} className={className}>
      {prefix}
      {count.toFixed(decimals)}
      {suffix}
    </span>
  )
}
