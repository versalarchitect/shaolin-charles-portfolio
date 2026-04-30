import { AppSidebar } from '@/components/app-sidebar'
import { StudentAssistant } from '@/components/student-assistant'
import { VoiceTutor } from '@/components/voice-tutor'

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen" style={{ fontFamily: 'var(--font-inter)' }}>
      <AppSidebar />
      <main className="flex-1 lg:ml-64 pt-14 lg:pt-0">
        {children}
      </main>
      <StudentAssistant />
      <VoiceTutor context="course" offsetBottom />
    </div>
  )
}
