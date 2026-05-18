import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/use-auth'

export type AccessTier = 'none' | 'beta' | 'paid' | 'admin'

export const ADMIN_EMAILS = [
  'charles@predictive.company',
  'charlesdotdirect@gmail.com',
] as const

export function isAdmin(email: string | undefined | null): boolean {
  return !!email && (ADMIN_EMAILS as readonly string[]).includes(email)
}

export function canAccessLesson(lessonId: string, tier: AccessTier): boolean {
  if (tier === 'admin' || tier === 'paid') return true
  if (tier === 'beta') {
    return lessonId.startsWith('p') || lessonId.startsWith('1-')
  }
  return false
}

let cachedTier: AccessTier | undefined
const listeners = new Set<() => void>()

function notify() {
  for (const fn of listeners) fn()
}

export function getCachedTier(): AccessTier | undefined {
  return cachedTier
}

export async function fetchAccessTier(): Promise<AccessTier> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (user && isAdmin(user.email)) {
      cachedTier = 'admin'
      notify()
      return 'admin'
    }

    const { data, error } = await supabase.rpc('get_access_tier')
    if (error) throw error
    cachedTier = (data as AccessTier) || 'none'
  } catch {
    cachedTier = cachedTier ?? 'none'
  }
  notify()
  return cachedTier
}

export function setAccessTierDirect(tier: AccessTier) {
  cachedTier = tier
  notify()
}

export function useAccessTier() {
  const { user } = useAuth()
  const [tier, setTier] = useState<AccessTier>(cachedTier ?? (user && isAdmin(user.email) ? 'admin' : 'none'))
  const [isLoading, setIsLoading] = useState(cachedTier === undefined)

  useEffect(() => {
    const listener = () => {
      if (cachedTier !== undefined) {
        setTier(cachedTier)
        setIsLoading(false)
      }
    }
    listeners.add(listener)

    if (cachedTier === undefined && user) {
      fetchAccessTier()
    } else if (cachedTier !== undefined) {
      setTier(cachedTier)
      setIsLoading(false)
    }

    return () => { listeners.delete(listener) }
  }, [user])

  const refetch = useCallback(async () => {
    setIsLoading(true)
    const newTier = await fetchAccessTier()
    setTier(newTier)
    setIsLoading(false)
    return newTier
  }, [])

  return { tier, isLoading, refetch }
}
