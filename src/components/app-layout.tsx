import { Suspense, lazy } from 'react'
import { useLocation } from 'react-router-dom'
import { AppSidebar } from '@/components/app-sidebar'
import { StreakWarning } from '@/components/gamification/streak-warning'

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
          <div className="px-6 lg:px-8 pt-6">
            <StreakWarning />
          </div>
        )}
        {children}
      </main>
      <Suspense fallback={null}>
        <StudentAssistant />
        <VoiceTutor context="course" offsetBottom />
      </Suspense>
    </div>
  )
}
