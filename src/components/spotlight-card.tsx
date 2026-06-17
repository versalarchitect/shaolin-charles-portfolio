import type { HTMLAttributes, PointerEvent, ReactNode } from 'react'
import { useRef } from 'react'
import { cn } from '@/lib/utils'

type Props = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode
  /** spotlight radius in px */
  radius?: number
}

/**
 * The spotlight follows a real cursor and only shows on :hover — neither exists
 * on touch, yet pointermove still fires during a scroll. Decide once so touch
 * devices skip the getBoundingClientRect layout work entirely (keeps scrolling
 * smooth on phones).
 */
const FINE_POINTER = typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches

/** A bordered card with a monochrome spotlight that follows the cursor. */
export function SpotlightCard({ className, children, radius = 360, ...props }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    el.style.setProperty('--mx', `${e.clientX - r.left}px`)
    el.style.setProperty('--my', `${e.clientY - r.top}px`)
  }

  return (
    <div
      ref={ref}
      onPointerMove={FINE_POINTER ? onMove : undefined}
      className={cn(
        'group glass-surface relative overflow-hidden rounded-2xl border border-foreground/15 shadow-2xl shadow-foreground/10 transition-[box-shadow,border-color] duration-300 hover:border-foreground/30 hover:shadow-foreground/[0.18]',
        className,
      )}
      {...props}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(${radius}px circle at var(--mx, 50%) var(--my, 50%), rgba(var(--effect-rgb), 0.08), transparent 70%)`,
        }}
      />
      {children}
    </div>
  )
}
