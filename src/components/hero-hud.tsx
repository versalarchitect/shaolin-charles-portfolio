import { useEffect, useRef } from 'react'
import { pointer } from '@/lib/pointer'

/**
 * The hero's center interaction — a precision instrument, not a bloom.
 * Faint crosshair guides track the cursor, a small readout reports its
 * normalised position, and a static reticle marks the centre. Calm and exact.
 */
export function HeroHud() {
  const root = useRef<HTMLDivElement>(null)
  const vline = useRef<HTMLDivElement>(null)
  const hline = useRef<HTMLDivElement>(null)
  const tag = useRef<HTMLDivElement>(null)
  const out = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = root.current
    if (!el) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const fine = window.matchMedia('(pointer: fine)').matches

    let cx = 0
    let cy = 0
    let primed = false
    let raf = 0

    const loop = () => {
      const r = el.getBoundingClientRect()
      const inside =
        fine &&
        pointer.active &&
        pointer.x >= r.left &&
        pointer.x <= r.right &&
        pointer.y >= r.top &&
        pointer.y <= r.bottom

      const tx = inside ? pointer.x - r.left : r.width / 2
      const ty = inside ? pointer.y - r.top : r.height / 2
      if (!primed) {
        cx = tx
        cy = ty
        primed = true
      }
      const k = reduce ? 1 : 0.16
      cx += (tx - cx) * k
      cy += (ty - cy) * k

      const nx = r.width ? cx / r.width : 0.5
      const ny = r.height ? cy / r.height : 0.5
      const shown = inside ? '1' : '0'

      if (vline.current) {
        vline.current.style.transform = `translateX(${cx}px)`
        vline.current.style.opacity = shown
      }
      if (hline.current) {
        hline.current.style.transform = `translateY(${cy}px)`
        hline.current.style.opacity = shown
      }
      if (tag.current) {
        tag.current.style.transform = `translate(${cx}px, ${cy}px)`
        tag.current.style.opacity = shown
      }
      if (out.current) out.current.textContent = `${nx.toFixed(3)} : ${ny.toFixed(3)}`

      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div ref={root} aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* crosshair guides */}
      <div
        ref={vline}
        className="absolute left-0 top-0 h-full w-px bg-foreground/15 opacity-0 transition-opacity duration-500 will-change-transform"
      />
      <div
        ref={hline}
        className="absolute left-0 top-0 h-px w-full bg-foreground/15 opacity-0 transition-opacity duration-500 will-change-transform"
      />

      {/* static centre reticle — focal anchor */}
      <div className="absolute left-1/2 top-1/2 grid -translate-x-1/2 -translate-y-1/2 place-items-center">
        <div className="h-40 w-40 rounded-full border border-foreground/[0.04]" />
        <div className="absolute h-24 w-24 rounded-full border border-dashed border-foreground/10 motion-safe:animate-[spin_22s_linear_infinite]" />
        <div className="absolute h-px w-3.5 bg-foreground/25" />
        <div className="absolute h-3.5 w-px bg-foreground/25" />
      </div>

      {/* live readout that follows the cursor */}
      <div
        ref={tag}
        className="absolute left-0 top-0 opacity-0 transition-opacity duration-500 will-change-transform"
      >
        <span className="ml-3.5 mt-3.5 inline-block whitespace-nowrap font-mono text-[10px] tracking-wider text-foreground/45">
          <span ref={out}>0.500 : 0.500</span>
        </span>
      </div>
    </div>
  )
}
