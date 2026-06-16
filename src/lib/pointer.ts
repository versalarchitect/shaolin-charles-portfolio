/**
 * Global pointer state read by animation loops WITHOUT triggering React
 * re-renders. Components read `pointer` inside their own rAF tick.
 */
export type Pointer = {
  /** viewport pixel coords */
  x: number
  y: number
  /** normalised 0..1 across the viewport */
  nx: number
  ny: number
  /** pointer is on screen */
  active: boolean
  /** button is held */
  down: boolean
  /** ms timestamp of last button press — used for click ripples */
  lastDown: number
}

export const pointer: Pointer = {
  x: -9999,
  y: -9999,
  nx: 0.5,
  ny: 0.5,
  active: false,
  down: false,
  lastDown: -9999,
}

let started = false

export function initPointer() {
  if (started || typeof window === 'undefined') return
  started = true

  const onMove = (e: PointerEvent) => {
    pointer.x = e.clientX
    pointer.y = e.clientY
    pointer.nx = e.clientX / window.innerWidth
    pointer.ny = e.clientY / window.innerHeight
    pointer.active = true
  }
  const onDown = () => {
    pointer.down = true
    pointer.lastDown = performance.now()
  }
  const onUp = () => {
    pointer.down = false
  }
  const onLeave = () => {
    pointer.active = false
  }

  window.addEventListener('pointermove', onMove, { passive: true })
  window.addEventListener('pointerdown', onDown, { passive: true })
  window.addEventListener('pointerup', onUp, { passive: true })
  window.addEventListener('pointercancel', onUp, { passive: true })
  document.addEventListener('pointerleave', onLeave)
}
