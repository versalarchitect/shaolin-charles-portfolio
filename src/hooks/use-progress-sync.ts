import { useEffect, useState, useRef } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { initSync, stopSync } from '@/lib/progress-sync'

export function useProgressSync(): { isSyncing: boolean; lastSyncedAt: Date | null } {
  const { user } = useAuth()
  const [isSyncing, setIsSyncing] = useState(false)
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null)
  const prevUserIdRef = useRef<string | null>(null)

  useEffect(() => {
    const userId = user?.id ?? null

    // No change in user — skip
    if (userId === prevUserIdRef.current) return
    prevUserIdRef.current = userId

    if (userId) {
      setIsSyncing(true)
      initSync(userId)
        .then(() => {
          setLastSyncedAt(new Date())
        })
        .catch(() => {
          // Errors already logged inside initSync
        })
        .finally(() => {
          setIsSyncing(false)
        })
    } else {
      stopSync()
      setLastSyncedAt(null)
    }

    return () => {
      if (userId) {
        stopSync()
      }
    }
  }, [user?.id])

  return { isSyncing, lastSyncedAt }
}
