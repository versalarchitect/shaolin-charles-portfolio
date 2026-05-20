import { useEffect } from 'react'
import { useNavigate } from '@/lib/localized-router'
import { supabase } from '@/lib/supabase'
import PageLoading from '@/components/page-loading'

export default function AuthCallback() {
  const navigate = useNavigate()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const code = params.get('code')
    const redirect = params.get('redirect') || '/course/dashboard'

    if (code) {
      supabase.auth.exchangeCodeForSession(code).then(({ error }) => {
        if (error) {
          navigate(`/login?error=${encodeURIComponent(error.message)}`, { replace: true })
        } else {
          navigate(redirect, { replace: true })
        }
      })
    } else {
      navigate(redirect, { replace: true })
    }
  }, [navigate])

  return <PageLoading />
}
