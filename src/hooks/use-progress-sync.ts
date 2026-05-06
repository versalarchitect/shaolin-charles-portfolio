import { useEffect, useState, useRef, useSyncExternalStore } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { initSync, stopSync, getSyncStatus, subscribeSyncStatus } from '@/lib/progress-sync'
import type { SyncStatus } from '@/lib/progress-sync'

export function useProgressSync(): { isSyncing: boolean; lastSyncedAt: Date | null; syncStatus: SyncStatus } {
  const { user } = useAuth()
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null)
  const prevUserIdRef = useRef<string | null>(null)

  const syncStatus = useSyncExternalStore(subscribeSyncStatus, getSyncStatus, () => 'idle' as SyncStatus)

  useEffect(() => {
    const userId = user?.id ?? null

    // No change in user — skip
    if (userId === prevUserIdRef.current) return
    prevUserIdRef.current = userId

    if (userId) {
      initSync(userId)
        .then(() => {
          setLastSyncedAt(new Date())
        })
        .catch(() => {
          // Errors already logged inside initSync
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

  return { isSyncing: syncStatus === 'syncing', lastSyncedAt, syncStatus }
}
