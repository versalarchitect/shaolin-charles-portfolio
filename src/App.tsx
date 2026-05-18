import { Suspense, lazy, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'motion/react'
import PageLoading from '@/components/page-loading'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Toaster } from '@/components/ui/sonner'
import { ThemeProvider } from '@/components/theme-provider'
import { PlatformProvider } from '@/components/platform-provider'
import { CommandMenuProvider } from '@/components/command-menu'
import { ScrollProgress } from '@/components/ui/scroll-progress'
import { AppLayout } from '@/components/app-layout'
import { PageTransition } from '@/components/page-transition'
import {
  SectionGridProvider,
} from '@/components/ui/gradient-background'
import { GamificationErrorBoundary } from '@/components/gamification/error-boundary'
import { useExplorer } from '@/hooks/use-explorer'
import { useProgressSync } from '@/hooks/use-progress-sync'
import { useSurpriseRewards } from '@/hooks/use-surprise-rewards'

function CourseHooks() {
  useExplorer()
  useSurpriseRewards()
  return null
}

const SectionBoundaryGrid = lazy(() => import('@/components/ui/gradient-background').then(m => ({ default: m.SectionBoundaryGrid })))

const Chatbot = lazy(() => import('@/components/chatbot').then(m => ({ default: m.Chatbot })))
const VoiceTutor = lazy(() => import('@/components/voice-tutor').then(m => ({ default: m.VoiceTutor })))
const BackgroundEffects = lazy(() => import('@/components/background-effects'))
const EasterEggHandler = lazy(() => import('@/components/gamification/easter-egg-handler').then(m => ({ default: m.EasterEggHandler })))

const APP_ROUTES = ['/course/']

function getPageKey(pathname: string): string {
  const learnMatch = pathname.match(/^(\/course\/learn\/[^/]+)/)
  if (learnMatch) return learnMatch[1]
  return pathname
}

export default function App() {
  const location = useLocation()
  const isAppPage = APP_ROUTES.some((r) => location.pathname.startsWith(r))
  const pageKey = getPageKey(location.pathname)

  useProgressSync()

  // biome-ignore lint/correctness/useExhaustiveDependencies: pageKey is the intentional trigger
  useEffect(() => {
    window.scrollTo(0, 0)
    document.dispatchEvent(new Event('prerender-ready'))
  }, [pageKey])

  return (
    <ThemeProvider>
      <PlatformProvider>
      <CommandMenuProvider>
      <SectionGridProvider containerPadding={24}>
        <div className="antialiased font-sans min-h-screen text-foreground relative">
          <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-background focus:text-foreground focus:border focus:border-foreground/20 focus:rounded">
            Skip to main content
          </a>
          {isAppPage ? (
            /* App pages: sidebar layout, clean background */
            <AppLayout>
              <CourseHooks />
              <AnimatePresence mode="popLayout">
                <PageTransition key={pageKey}>
                  <Suspense fallback={<PageLoading />}>
                    <Outlet />
                  </Suspense>
                </PageTransition>
              </AnimatePresence>
            </AppLayout>
          ) : (
            /* Marketing pages: full header/footer with background effects */
            <>
              <Suspense fallback={<div className="fixed inset-0 bg-background" />}>
                <BackgroundEffects />
              </Suspense>

              <Suspense fallback={null}>
                <SectionBoundaryGrid intensity={1} markerSize={14} />
              </Suspense>

              {/* Scroll progress indicator - marketing pages only */}
              <ScrollProgress className="bg-foreground/80" height={2} />

              <Header />

              {/* Content wrapper with proper z-index above background effects */}
              <div className="relative z-10">
                {/* Add top padding for fixed header */}
                <main id="main-content" className="pt-16 min-h-screen">
                  <AnimatePresence mode="popLayout">
                    <PageTransition key={location.pathname}>
                      <Suspense fallback={<PageLoading />}>
                        <Outlet />
                      </Suspense>
                    </PageTransition>
                  </AnimatePresence>
                </main>

                <Footer />
              </div>
              <Suspense fallback={null}>
                <Chatbot />
                <VoiceTutor context="marketing" offsetBottom />
              </Suspense>
            </>
          )}
          <GamificationErrorBoundary silent>
            <Toaster />
          </GamificationErrorBoundary>
          <Suspense fallback={null}>
            <GamificationErrorBoundary silent>
              <EasterEggHandler />
            </GamificationErrorBoundary>
          </Suspense>
        </div>
      </SectionGridProvider>
      </CommandMenuProvider>
      </PlatformProvider>
    </ThemeProvider>
  )
}
