import { useEffect, useRef, createContext, useContext, useState, useCallback, useLayoutEffect } from 'react'
import { motion } from 'framer-motion'

// Subtle ambient glow zones - creates soft pools of light (static, no animation)
export function AmbientGlowZones() {
  const zones = [
    { x: '15%', y: '20%', size: 600, opacity: 0.06 },
    { x: '85%', y: '30%', size: 500, opacity: 0.05 },
    { x: '50%', y: '60%', size: 700, opacity: 0.04 },
    { x: '25%', y: '80%', size: 450, opacity: 0.05 },
    { x: '75%', y: '85%', size: 550, opacity: 0.04 },
  ]

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {zones.map((zone, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            left: zone.x,
            top: zone.y,
            width: zone.size,
            height: zone.size,
            transform: 'translate(-50%, -50%)',
            background: `radial-gradient(circle, rgba(255,255,255,${zone.opacity}) 0%, rgba(255,255,255,${zone.opacity * 0.5}) 30%, transparent 70%)`,
            filter: 'blur(60px)',
          }}
        />
      ))}
    </div>
  )
}

// Subtle gradient wash - horizontal bands of light (static, no animation)
export function GradientWash() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Top wash - pale white fading down */}
      <div
        className="absolute top-0 left-0 right-0 h-[60vh]"
        style={{
          background: 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.015) 40%, transparent 100%)',
        }}
      />

      {/* Diagonal light beam - very subtle */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.015) 30%, rgba(255,255,255,0.02) 50%, rgba(255,255,255,0.015) 70%, transparent 100%)',
        }}
      />

      {/* Bottom corner glow */}
      <div
        className="absolute bottom-0 right-0 w-[50vw] h-[40vh]"
        style={{
          background: 'radial-gradient(ellipse at bottom right, rgba(255,255,255,0.02) 0%, transparent 70%)',
        }}
      />
    </div>
  )
}

// Subtle spotlight cones - soft directional lights (static, no animation)
export function SpotlightCones() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Top-left spotlight cone */}
      <div
        className="absolute -top-20 -left-20 w-[800px] h-[800px]"
        style={{
          background: 'conic-gradient(from 180deg at 0% 0%, transparent 0deg, rgba(255,255,255,0.02) 45deg, transparent 90deg)',
        }}
      />

      {/* Top-right spotlight cone */}
      <div
        className="absolute -top-20 -right-20 w-[600px] h-[600px]"
        style={{
          background: 'conic-gradient(from 90deg at 100% 0%, transparent 0deg, rgba(255,255,255,0.015) 45deg, transparent 90deg)',
        }}
      />

      {/* Center spotlight - illuminates main content area */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[1000px] h-[600px]"
        style={{
          background: 'radial-gradient(ellipse at center top, rgba(255,255,255,0.025) 0%, rgba(255,255,255,0.01) 40%, transparent 70%)',
        }}
      />
    </div>
  )
}

// Gradient mesh background - enhanced monochromatic (static, no animation)
export function GradientMesh() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/10" />

      {/* Large floating orbs - static positions */}
      <div
        className="absolute -top-40 -right-40 w-[800px] h-[800px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 60%)',
        }}
      />
      <div
        className="absolute -bottom-60 -left-60 w-[700px] h-[700px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 60%)',
        }}
      />
      <div
        className="absolute top-1/3 left-1/4 w-[500px] h-[500px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 50%)',
        }}
      />

      {/* Subtle ring */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] rounded-full border border-foreground/[0.015]"
      />
    </div>
  )
}

// Animated grid pattern
export function AnimatedGrid() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Static grid */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Animated scan line */}
      <motion.div
        className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-foreground/10 to-transparent"
        animate={{
          top: ['0%', '100%'],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      {/* Vertical scan line */}
      <motion.div
        className="absolute top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-foreground/10 to-transparent"
        animate={{
          left: ['0%', '100%'],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
    </div>
  )
}

// Noise texture overlay
export function NoiseTexture() {
  return (
    <div
      className="absolute inset-0 pointer-events-none opacity-[0.02] mix-blend-overlay"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
      }}
    />
  )
}

// Spotlight effect that follows cursor
export function SpotlightEffect() {
  const spotlightRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (spotlightRef.current) {
        spotlightRef.current.style.background = `radial-gradient(800px circle at ${e.clientX}px ${e.clientY}px, rgba(255,255,255,0.04), transparent 40%)`
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div
      ref={spotlightRef}
      className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-300"
    />
  )
}

// Vignette effect
export function Vignette() {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.3) 100%)',
      }}
    />
  )
}

// Gradient blur blobs (static, no animation)
export function GradientBlobs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full blur-3xl"
          style={{
            width: 200 + i * 100,
            height: 200 + i * 100,
            left: `${10 + i * 15}%`,
            top: `${20 + (i % 3) * 30}%`,
            background: `rgba(255,255,255,${0.02 - i * 0.002})`,
          }}
        />
      ))}
    </div>
  )
}

// Section-based gradient spots - positioned relative to section, not viewport
// Use this within sections to add graceful gradient spots that scroll with content (static, no animation)
export function SectionSpots({
  className = '',
  variant = 'default',
}: {
  className?: string
  variant?: 'default' | 'hero' | 'subtle' | 'accent'
}) {
  const configs = {
    default: [
      { x: '10%', y: '20%', size: 400, opacity: 0.003 },
      { x: '85%', y: '60%', size: 350, opacity: 0.002 },
    ],
    hero: [
      { x: '0%', y: '0%', size: 600, opacity: 0.004 },
      { x: '100%', y: '30%', size: 500, opacity: 0.003 },
      { x: '50%', y: '80%', size: 400, opacity: 0.002 },
    ],
    subtle: [
      { x: '80%', y: '20%', size: 300, opacity: 0.002 },
    ],
    accent: [
      { x: '20%', y: '30%', size: 450, opacity: 0.0035 },
      { x: '75%', y: '70%', size: 400, opacity: 0.0025 },
    ],
  }

  const spots = configs[variant]

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {spots.map((spot, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            left: spot.x,
            top: spot.y,
            width: spot.size,
            height: spot.size,
            transform: 'translate(-50%, -50%)',
            background: `radial-gradient(circle, rgba(255,255,255,${spot.opacity}) 0%, transparent 70%)`,
            filter: 'blur(40px)',
          }}
        />
      ))}
    </div>
  )
}

// Intersection Grid - Cal.com style plus pattern
// Discovered via Playwright analysis of cal.com:
//
// Cal.com uses TWO patterns:
// 1. 24x24px line-based plus: path "M 12 5 L 12 19 M 5 12 L 19 12" with stroke-width 1.5
// 2. 10x10px filled plus: solid shape with rounded corners
//
// Key insight: Cal.com uses background-size: 100% 100% on individual cards/sections,
// meaning each container gets one plus that scales. For a full-page tiled grid,
// we use a fixed size that repeats.
//
// Design principles:
// - Just repeating plus signs, NO connecting grid lines
// - CSS background-image with background-repeat for performance
// - Very subtle opacity (0.10-0.15 on dark, adjusted for light backgrounds)
// - Optional radial fade so pattern doesn't overwhelm center content
export function IntersectionGrid({
  className = '',
  gridSize = 24,
  opacity = 0.15,
  strokeWidth = 1.5,
  fadeCenter = true,
}: {
  className?: string
  gridSize?: number
  opacity?: number
  strokeWidth?: number
  fadeCenter?: boolean
}) {
  // Cal.com exact SVG: 24x24 viewBox with plus centered at (12,12)
  // Vertical line: (12,5) to (12,19) - 14px tall
  // Horizontal line: (5,12) to (19,12) - 14px wide
  // stroke="rgba(20, 20, 20, 0.15)" for light backgrounds
  // We use white for dark backgrounds
  const plusSvg = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M 12 5 L 12 19 M 5 12 L 19 12' fill='transparent' stroke-width='${strokeWidth}' stroke='rgba(255, 255, 255, ${opacity})' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E`

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {/* Plus pattern layer - tiles at gridSize intervals */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url("${plusSvg}")`,
          backgroundRepeat: 'repeat',
          backgroundSize: `${gridSize}px ${gridSize}px`,
        }}
      />
      {/* Optional radial fade mask so pattern doesn't overwhelm center content */}
      {fadeCenter && (
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 40%, transparent 70%)',
          }}
        />
      )}
    </div>
  )
}

// Section Boundary Grid
// Grid lines span full viewport, but + markers only appear at section boundaries
// This creates visual delineation between sections without cluttering the background
//
// How it works:
// 1. Continuous vertical and horizontal grid lines span edge-to-edge
// 2. Sections register their boundaries (top/bottom) via context
// 3. + markers are rendered only where grid lines intersect section boundaries
//
// Usage:
// - Wrap your app with <SectionGridProvider>
// - Use <SectionBoundaryGrid /> in App.tsx for the global grid lines
// - Each section uses <Section> wrapper which auto-registers its boundaries
export interface SectionBoundary {
  id: string
  top: number
  bottom: number
}

interface SectionGridContextType {
  sections: SectionBoundary[]
  registerSection: (id: string, top: number, bottom: number) => void
  unregisterSection: (id: string) => void
  containerPadding: number // left/right padding from viewport edge to content
}

const SectionGridContext = createContext<SectionGridContextType | null>(null)

export function SectionGridProvider({
  children,
  containerPadding = 24, // matches container px-6
}: {
  children: React.ReactNode
  containerPadding?: number
}) {
  const [sections, setSections] = useState<SectionBoundary[]>([])

  const registerSection = useCallback((id: string, top: number, bottom: number) => {
    setSections((prev) => {
      const filtered = prev.filter((s) => s.id !== id)
      return [...filtered, { id, top, bottom }].sort((a, b) => a.top - b.top)
    })
  }, [])

  const unregisterSection = useCallback((id: string) => {
    setSections((prev) => prev.filter((s) => s.id !== id))
  }, [])

  return (
    <SectionGridContext.Provider value={{ sections, registerSection, unregisterSection, containerPadding }}>
      {children}
    </SectionGridContext.Provider>
  )
}

export function useSectionGrid() {
  const context = useContext(SectionGridContext)
  if (!context) {
    throw new Error('useSectionGrid must be used within SectionGridProvider')
  }
  return context
}

// Section wrapper that auto-registers its boundaries
export function Section({
  children,
  id,
  className = '',
  ...props
}: {
  children: React.ReactNode
  id: string
  className?: string
} & React.HTMLAttributes<HTMLElement>) {
  const ref = useRef<HTMLElement>(null)
  const { registerSection, unregisterSection } = useSectionGrid()

  useLayoutEffect(() => {
    const updateBounds = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect()
        const scrollY = window.scrollY
        registerSection(id, rect.top + scrollY, rect.bottom + scrollY)
      }
    }

    updateBounds()

    // Update on resize and scroll (for dynamic content)
    window.addEventListener('resize', updateBounds)
    const observer = new ResizeObserver(updateBounds)
    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      unregisterSection(id)
      window.removeEventListener('resize', updateBounds)
      observer.disconnect()
    }
  }, [id, registerSection, unregisterSection])

  return (
    <section ref={ref} id={id} className={className} {...props}>
      {children}
    </section>
  )
}

// The global grid with lines and section boundary markers
// Intensity controls overall visibility (0-1 scale, default 1)
// The 3:1 contrast ratio between markers and lines is preserved
export function SectionBoundaryGrid({
  className = '',
  intensity = 1, // 0-1 scale: 0 = invisible, 0.5 = subtle, 1 = default, can go higher for emphasis
  markerSize = 12, // size of the + marker
}: {
  className?: string
  intensity?: number
  markerSize?: number
}) {
  // Base opacities with 3:1 contrast ratio (markers more visible than lines)
  const baseLineOpacity = 0.04
  const baseMarkerOpacity = 0.12

  // Apply intensity multiplier while preserving the ratio
  const lineOpacity = baseLineOpacity * intensity
  const markerOpacity = baseMarkerOpacity * intensity

  const { sections, containerPadding } = useSectionGrid()
  const svgRef = useRef<SVGSVGElement>(null)
  const [viewportWidth, setViewportWidth] = useState(0)
  const [documentHeight, setDocumentHeight] = useState(0)

  // Use refs for scroll to avoid re-renders
  useEffect(() => {
    const updateDimensions = () => {
      setViewportWidth(window.innerWidth)
      setDocumentHeight(document.documentElement.scrollHeight)
    }

    // Direct DOM manipulation for scroll - no React state updates
    const handleScroll = () => {
      if (svgRef.current) {
        svgRef.current.style.transform = `translateY(-${window.scrollY}px)`
      }
    }

    updateDimensions()
    handleScroll()

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', updateDimensions)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', updateDimensions)
    }
  }, [])

  // Calculate vertical line positions (left and right edges of container)
  const leftLineX = containerPadding
  const rightLineX = viewportWidth - containerPadding

  // Collect all unique horizontal Y positions from section boundaries
  const horizontalLines = Array.from(
    new Set(sections.flatMap((s) => [s.top, s.bottom]))
  ).sort((a, b) => a - b)

  // Generate marker positions: where vertical lines meet horizontal lines
  const markers: { x: number; y: number }[] = []
  for (const y of horizontalLines) {
    markers.push({ x: leftLineX, y })
    markers.push({ x: rightLineX, y })
  }

  return (
    <div className={`fixed inset-0 pointer-events-none z-0 overflow-hidden ${className}`}>
      {/* SVG for grid lines and markers - transformed by scroll to align with document */}
      <svg
        ref={svgRef}
        className="absolute left-0 top-0 w-full"
        style={{
          height: documentHeight,
          willChange: 'transform',
        }}
        preserveAspectRatio="none"
      >
        {/* Vertical lines - full height of document */}
        <line
          x1={leftLineX}
          y1={0}
          x2={leftLineX}
          y2={documentHeight}
          stroke={`rgba(255, 255, 255, ${lineOpacity})`}
          strokeWidth={1}
        />
        <line
          x1={rightLineX}
          y1={0}
          x2={rightLineX}
          y2={documentHeight}
          stroke={`rgba(255, 255, 255, ${lineOpacity})`}
          strokeWidth={1}
        />

        {/* Horizontal lines at section boundaries */}
        {horizontalLines.map((y, i) => (
          <line
            key={`h-${i}`}
            x1={0}
            y1={y}
            x2={viewportWidth}
            y2={y}
            stroke={`rgba(255, 255, 255, ${lineOpacity})`}
            strokeWidth={1}
          />
        ))}

        {/* + markers at intersections */}
        {markers.map((marker, i) => (
          <g key={`m-${i}`} transform={`translate(${marker.x}, ${marker.y})`}>
            {/* Vertical stroke of + */}
            <line
              x1={0}
              y1={-markerSize / 2}
              x2={0}
              y2={markerSize / 2}
              stroke={`rgba(255, 255, 255, ${markerOpacity})`}
              strokeWidth={1.5}
              strokeLinecap="round"
            />
            {/* Horizontal stroke of + */}
            <line
              x1={-markerSize / 2}
              y1={0}
              x2={markerSize / 2}
              y2={0}
              stroke={`rgba(255, 255, 255, ${markerOpacity})`}
              strokeWidth={1.5}
              strokeLinecap="round"
            />
          </g>
        ))}
      </svg>
    </div>
  )
}
