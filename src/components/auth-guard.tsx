import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Navigate } from '@/lib/localized-router'
import { supabase } from '@/lib/supabase'
import PageLoading from './page-loading'

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const [checking, setChecking] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)
  const location = useLocation()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthenticated(!!session)
      setChecking(false)
    })
  }, [])

  if (checking) return <PageLoading />
  if (!authenticated) return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />
  return <>{children}</>
}
