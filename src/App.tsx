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

// Premium page transition variants with blur and scale
const pageVariants = {
  initial: {
    opacity: 0,
    y: 30,
    filter: 'blur(10px)',
    scale: 0.98,
  },
  animate: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1], // Custom easing for smooth feel
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    filter: 'blur(5px)',
    scale: 0.99,
    transition: {
      duration: 0.35,
      ease: [0.22, 1, 0.36, 1],
    },
  },
}

// Reduced motion variants
const reducedMotionVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
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
            <div className="pt-16">
              <AnimatePresence mode="wait">
                <motion.main
                  key={location.pathname}
                  variants={prefersReducedMotion ? reducedMotionVariants : pageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  <Suspense fallback={<PageLoading />}>
                    <Outlet />
                  </Suspense>
                </motion.main>
              </AnimatePresence>
            </div>

            <Footer />
          </div>
          <Toaster />
        </div>
      </SectionGridProvider>
    </ThemeProvider>
  )
}
