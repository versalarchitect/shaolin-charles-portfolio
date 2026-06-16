import { useEffect, useRef } from 'react'
import { pointer } from '@/lib/pointer'

/**
 * A technical "reticle" cursor. mix-blend-difference + white means it inverts
 * against whatever is under it, so it reads in both light and dark themes.
 * Disabled for touch / coarse pointers (native cursor stays).
 */
export function CustomCursor() {
  const ringRef = useRef<HTMLDivElement>(null)
  const dotRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return
    const ring = ringRef.current
    const dot = dotRef.current
    if (!ring || !dot) return

    document.documentElement.classList.add('cursor-reticle')

    let rx = pointer.x
    let ry = pointer.y
    let scale = 1
    let targetScale = 1
    let raf = 0

    const loop = () => {
      rx += (pointer.x - rx) * 0.2
      ry += (pointer.y - ry) * 0.2
      scale += (targetScale - scale) * 0.2

      const shown = pointer.active ? '1' : '0'
      dot.style.opacity = shown
      ring.style.opacity = pointer.active ? '0.9' : '0'
      dot.style.transform = `translate(${pointer.x}px, ${pointer.y}px) translate(-50%, -50%)`
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%) scale(${scale})`
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    const onMove = (e: PointerEvent) => {
      const el = e.target as HTMLElement | null
      const interactive = el?.closest?.('a, button, [role="button"], [data-cursor="hover"]')
      targetScale = interactive ? 1.7 : 1
    }
    const onDown = () => {
      targetScale *= 0.6
    }
    const onUp = (e: PointerEvent) => {
      const el = e.target as HTMLElement | null
      targetScale = el?.closest?.('a, button, [role="button"], [data-cursor="hover"]') ? 1.7 : 1
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerdown', onDown, { passive: true })
    window.addEventListener('pointerup', onUp, { passive: true })

    return () => {
      cancelAnimationFrame(raf)
      document.documentElement.classList.remove('cursor-reticle')
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
    }
  }, [])

  return (
    <>
      <div
        ref={ringRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[9999] opacity-0 will-change-transform"
        style={{ mixBlendMode: 'difference' }}
      >
        <svg width="34" height="34" viewBox="0 0 34 34" fill="none" stroke="#fff" strokeWidth="1.25">
          <title>cursor</title>
          {/* corner brackets */}
          <path d="M3 9V3h6" />
          <path d="M25 3h6v6" />
          <path d="M31 25v6h-6" />
          <path d="M9 31H3v-6" />
          {/* centre ticks */}
          <path d="M17 13v3M17 18v3M13 17h3M18 17h3" strokeWidth="1" />
        </svg>
      </div>
      <div
        ref={dotRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[9999] h-[5px] w-[5px] rounded-full bg-white opacity-0 will-change-transform"
        style={{ mixBlendMode: 'difference' }}
      />
    </>
  )
}
