import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

let cachedUser: User | null = null
const listeners = new Set<(user: User | null) => void>()

supabase.auth.getSession().then(({ data: { session } }) => {
  cachedUser = session?.user ?? null
  for (const fn of listeners) fn(cachedUser)
})

supabase.auth.onAuthStateChange((_event, session) => {
  cachedUser = session?.user ?? null
  for (const fn of listeners) fn(cachedUser)
})

export function useAuth() {
  const [user, setUser] = useState<User | null>(cachedUser)

  useEffect(() => {
    setUser(cachedUser)
    listeners.add(setUser)
    return () => { listeners.delete(setUser) }
  }, [])

  return { user, isLoggedIn: !!user }
}
