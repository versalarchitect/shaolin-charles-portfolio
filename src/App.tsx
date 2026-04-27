import { Suspense, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import PageLoading from '@/components/page-loading'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Chatbot } from '@/components/chatbot'
import { Toaster } from '@/components/ui/sonner'
import { ThemeProvider } from '@/components/theme-provider'
import { ScrollProgress } from '@/components/ui/aaa-effects'
import { AppLayout } from '@/components/app-layout'
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

const APP_ROUTES = ['/dashboard', '/learn/', '/community', '/curriculum']

export default function App() {
  const location = useLocation()
  const isAppPage = APP_ROUTES.some((r) => location.pathname.startsWith(r))

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  // Signal to prerenderer that the page is ready
  useEffect(() => {
    document.dispatchEvent(new Event('prerender-ready'))
  }, [location.pathname])

  return (
    <ThemeProvider>
      <SectionGridProvider containerPadding={24}>
        <div className="antialiased font-sans min-h-screen text-foreground relative">
          {isAppPage ? (
            /* App pages: sidebar layout, clean background */
            <AppLayout>
              <Suspense fallback={<PageLoading />}>
                <Outlet />
              </Suspense>
            </AppLayout>
          ) : (
            /* Marketing pages: full header/footer with background effects */
            <>
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
              <SectionBoundaryGrid intensity={1} markerSize={14} />

              {/* Scroll progress indicator - marketing pages only */}
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
              <Chatbot />
            </>
          )}
          <Toaster />
        </div>
      </SectionGridProvider>
    </ThemeProvider>
  )
}
