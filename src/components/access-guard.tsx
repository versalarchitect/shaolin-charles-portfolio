import { useEffect } from 'react'
import { useAccessTier } from '@/stores/access'
import { setAccessTier } from '@/stores/progress'
import { OnboardingModal } from '@/components/onboarding-modal'

function PageLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-sm font-mono text-foreground/40 animate-pulse">Loading...</div>
    </div>
  )
}

export function AccessGuard({ children }: { children: React.ReactNode }) {
  const { tier, isLoading, refetch } = useAccessTier()

  useEffect(() => {
    if (!isLoading) setAccessTier(tier)
  }, [tier, isLoading])

  if (isLoading) return <PageLoading />

  if (tier === 'none') {
    return (
      <OnboardingModal
        onComplete={async () => {
          await refetch()
        }}
      />
    )
  }

  return <>{children}</>
}
