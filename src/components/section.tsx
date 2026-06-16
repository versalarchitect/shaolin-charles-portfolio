import { motion, useReducedMotion } from 'motion/react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

/** Scroll-into-view reveal. Honours reduced-motion (renders instantly). */
export function Reveal({
  children,
  delay = 0,
  y = 16,
  className,
}: {
  children: ReactNode
  delay?: number
  y?: number
  className?: string
}) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function SectionHeader({
  index,
  label,
  title,
}: {
  index: string
  label: string
  title: ReactNode
}) {
  return (
    <div className="mb-10 md:mb-14">
      <Reveal className="mb-5 flex items-center gap-3 font-mono text-xs">
        <span className="text-foreground/40">{`// ${index}`}</span>
        <span className="uppercase tracking-[0.28em] text-foreground/70">{label}</span>
        <span className="h-px flex-1 bg-foreground/12" />
      </Reveal>
      <Reveal delay={0.05}>
        <h2 className="max-w-3xl text-balance text-3xl font-semibold tracking-tight md:text-4xl lg:text-5xl">
          {title}
        </h2>
      </Reveal>
    </div>
  )
}

export function Section({
  id,
  className,
  children,
}: {
  id?: string
  className?: string
  children: ReactNode
}) {
  return (
    <section
      id={id}
      className={cn(
        'relative mx-auto w-full max-w-6xl scroll-mt-24 px-6 py-24 md:py-32',
        className,
      )}
    >
      {children}
    </section>
  )
}
