import { Suspense, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import PageLoading from '@/components/page-loading'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Toaster } from '@/components/ui/sonner'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ThemeProvider } from '@/components/theme-provider'
import { ScrollProgress } from '@/components/ui/aaa-effects'
import {
  AmbientGlowZones,
  GradientBlobs,
  GradientMesh,
  GradientWash,
  NoiseTexture,
  SpotlightCones,
  SectionGridProvider,
  SectionBoundaryGrid,
} from '@/components/ui/gradient-background'

const pageVariants = {
  initial: {
    opacity: 0,
    y: 12,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.25,
      ease: [0.22, 1, 0.36, 1],
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.1,
    },
  },
}

const reducedMotionVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.1 } },
  exit: { opacity: 0, transition: { duration: 0.05 } },
}

export default function App() {
  const location = useLocation()
  const prefersReducedMotion = useReducedMotion()

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  return (
    <ThemeProvider>
      <SectionGridProvider containerPadding={24}>
        <div className="antialiased font-sans min-h-screen text-foreground relative">
          {/* Global background effects - layered for subtle, graceful depth */}
          <div className="fixed inset-0 pointer-events-none z-0 bg-background">
            {/* Layer 1: Subtle gradient wash - horizontal bands of soft light */}
            <GradientWash />
            {/* Layer 2: Ambient glow zones - soft pools of diffused light */}
            <AmbientGlowZones />
            {/* Layer 3: Spotlight cones - directional lights from corners */}
            <SpotlightCones />
            {/* Layer 4: Gradient mesh - floating orbs that drift */}
            <GradientMesh />
            {/* Layer 5: Gradient blobs - additional subtle movement */}
            <GradientBlobs />
            {/* Top layer: Subtle noise texture overlay */}
            <NoiseTexture />
          </div>

          {/* Section boundary grid - lines span viewport, + markers at section edges */}
          {/* intensity: 0-1 scale (default 1), preserves 3:1 contrast ratio between markers and lines */}
          <SectionBoundaryGrid intensity={1} markerSize={14} />

          {/* Global scroll progress indicator */}
          <ScrollProgress className="bg-foreground/80" height={2} />

          <Header />

          {/* Content wrapper with proper z-index above background effects */}
          <div className="relative z-10">
            {/* Add top padding for fixed header */}
            <main className="pt-16">
              <Suspense fallback={<PageLoading />}>
                <Outlet />
              </Suspense>
            </main>

            <Footer />
          </div>
          <Toaster />
        </div>
      </SectionGridProvider>
    </ThemeProvider>
  )
}
