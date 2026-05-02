import { motion, useScroll, useReducedMotion } from 'framer-motion'

export function ScrollProgress({
  className = '',
  height = 2,
  color,
}: {
  className?: string
  height?: number
  color?: string
}) {
  const { scrollYProgress } = useScroll()
  const prefersReducedMotion = useReducedMotion()

  if (prefersReducedMotion) return null

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
