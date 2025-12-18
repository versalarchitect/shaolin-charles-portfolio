import type p5 from 'p5'
import { useEffect, useRef, type RefObject } from 'react'

export interface SketchConfig {
  preview: boolean
  mouseX: number
  mouseY: number
  width: number
  height: number
}

export type SketchFactory = (p: p5, getConfig: () => SketchConfig) => void

/**
 * React hook for p5.js instance mode integration.
 *
 * Uses instance mode to:
 * - Avoid global namespace pollution
 * - Support multiple canvases on same page
 * - Integrate with React lifecycle (cleanup on unmount)
 *
 * @param sketchFactory - Function that sets up the p5 sketch
 * @param containerRef - Ref to the container element
 * @param config - Current config values (preview mode, mouse position)
 */
export function useP5Sketch(
  sketchFactory: SketchFactory,
  containerRef: RefObject<HTMLDivElement | null>,
  config: Omit<SketchConfig, 'width' | 'height'>
) {
  const configRef = useRef(config)
  const sketchRef = useRef<p5 | null>(null)

  // Update config ref without recreating sketch
  useEffect(() => {
    configRef.current = config
  }, [config])

  useEffect(() => {
    if (!containerRef.current) return

    // Dynamic import to avoid SSR issues
    import('p5').then((p5Module) => {
      const P5 = p5Module.default

      const container = containerRef.current
      if (!container) return

      // Get dimensions
      const getConfig = (): SketchConfig => ({
        ...configRef.current,
        width: container.clientWidth,
        height: container.clientHeight,
      })

      // Create sketch instance
      const sketch = new P5((p: p5) => {
        sketchFactory(p, getConfig)
      }, container)

      sketchRef.current = sketch
    })

    return () => {
      if (sketchRef.current) {
        sketchRef.current.remove()
        sketchRef.current = null
      }
    }
  }, [sketchFactory, containerRef])

  return sketchRef
}
