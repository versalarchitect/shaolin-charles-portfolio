import { Suspense, lazy } from 'react'
import { useLocation } from 'react-router-dom'
import { AppSidebar } from '@/components/app-sidebar'
import { GamificationErrorBoundary } from '@/components/gamification/error-boundary'

const StatsBarHeader = lazy(() => import('@/components/gamification/stats-bar-header').then(m => ({ default: m.StatsBarHeader })))
const StreakWarning = lazy(() => import('@/components/gamification/streak-warning').then(m => ({ default: m.StreakWarning })))
const QuickActionsFab = lazy(() => import('@/components/gamification/quick-actions-fab').then(m => ({ default: m.QuickActionsFab })))
const StudentAssistant = lazy(() => import('@/components/student-assistant').then(m => ({ default: m.StudentAssistant })))
const VoiceTutor = lazy(() => import('@/components/voice-tutor').then(m => ({ default: m.VoiceTutor })))

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation()
  const isDashboard = pathname === '/course/dashboard'

  return (
    <div className="flex min-h-screen" style={{ fontFamily: 'var(--font-inter)' }}>
      <AppSidebar />
      <main id="main-content" className="flex-1 lg:ml-64 pt-14 lg:pt-0">
        {!isDashboard && (
          <Suspense fallback={null}>
            <GamificationErrorBoundary silent>
              <StatsBarHeader />
            </GamificationErrorBoundary>
          </Suspense>
        )}
        {!isDashboard && (
          <div className="px-6 lg:px-8 pt-6">
            <Suspense fallback={null}>
              <GamificationErrorBoundary silent>
                <StreakWarning />
              </GamificationErrorBoundary>
            </Suspense>
          </div>
        )}
        {children}
      </main>
      <Suspense fallback={null}>
        <GamificationErrorBoundary silent>
          <QuickActionsFab />
        </GamificationErrorBoundary>
      </Suspense>
      <Suspense fallback={null}>
        <StudentAssistant />
        <VoiceTutor context="course" offsetBottom />
      </Suspense>
    </div>
  )
}
