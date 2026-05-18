import { supabase } from '@/lib/supabase'
import type { ProgressState } from '@/stores/progress'

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------

let syncUserId: string | null = null
let debounceTimer: ReturnType<typeof setTimeout> | null = null
let abortController: AbortController | null = null
let lastKnownServerXp: number = 0
let pushInFlight = false
let pendingPushState: ProgressState | null = null
let retryTimer: ReturnType<typeof setTimeout> | null = null
let offlineQueue: ProgressState | null = null

const DEBOUNCE_MS = 2000
const RETRY_BASE_MS = 5000

// ---------------------------------------------------------------------------
// Sync status — observable by the hook layer
// ---------------------------------------------------------------------------

export type SyncStatus = 'idle' | 'syncing' | 'error' | 'offline'

let _syncStatus: SyncStatus = 'idle'
const statusListeners = new Set<() => void>()

export function getSyncStatus(): SyncStatus {
  return _syncStatus
}

export function subscribeSyncStatus(cb: () => void): () => void {
  statusListeners.add(cb)
  return () => { statusListeners.delete(cb) }
}

function setSyncStatus(next: SyncStatus) {
  if (next === _syncStatus) return
  _syncStatus = next
  for (const cb of statusListeners) cb()
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getWeekId(): string {
  const now = new Date()
  const jan4 = new Date(now.getFullYear(), 0, 4)
  const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 1).getTime()) / 86400000) + 1
  const weekNumber = Math.ceil((dayOfYear + jan4.getDay() - 1) / 7)
  return `${now.getFullYear()}-W${String(weekNumber).padStart(2, '0')}`
}

function isOnline(): boolean {
  return typeof navigator === 'undefined' || navigator.onLine
}

// ---------------------------------------------------------------------------
// Merge logic
// ---------------------------------------------------------------------------

/**
 * Deep-merge server + local state, preserving the best of both:
 * - totalXp: max
 * - arrays (achievements, streakDates, etc.): union
 * - lessonProgress: merge at lesson level (keep completed over in_progress)
 * - scalars: take from the "newer" side
 */
function mergeStates(local: ProgressState, server: ProgressState, serverIsNewer: boolean): ProgressState {
  const base = serverIsNewer ? server : local
  const other = serverIsNewer ? local : server

  // Union helper for string arrays
  const union = (a: string[] = [], b: string[] = []): string[] =>
    [...new Set([...a, ...b])]

  // Union helper for number arrays
  const unionNums = (a: number[] = [], b: number[] = []): number[] =>
    [...new Set([...a, ...b])]

  // Merge lessonProgress: keep the "better" entry per lesson (completed > in_progress > locked)
  const mergedLessons: Record<string, ProgressState['lessonProgress'][string]> = { ...other.lessonProgress }
  for (const [id, entry] of Object.entries(base.lessonProgress)) {
    const existing = mergedLessons[id]
    if (!existing) {
      mergedLessons[id] = entry
    } else if (entry.status === 'completed' && existing.status !== 'completed') {
      mergedLessons[id] = entry
    } else if (entry.status === 'completed' && existing.status === 'completed') {
      // Both completed — keep the one with more XP
      mergedLessons[id] = entry.xpEarned >= existing.xpEarned ? entry : existing
    }
    // else: existing is same or better, keep it
  }

  return {
    ...base,
    lessonProgress: mergedLessons,
    totalXp: Math.max(local.totalXp ?? 0, server.totalXp ?? 0),
    longestStreak: Math.max(local.longestStreak ?? 0, server.longestStreak ?? 0),
    currentStreak: Math.max(local.currentStreak ?? 0, server.currentStreak ?? 0),
    unlockedAchievements: union(local.unlockedAchievements, server.unlockedAchievements),
    streakDates: union(local.streakDates, server.streakDates),
    completedChallenges: union(local.completedChallenges, server.completedChallenges),
    milestonesHit: unionNums(local.milestonesHit, server.milestonesHit),
    unlockedTitles: union(local.unlockedTitles, server.unlockedTitles),
    completedWeeklyChallenges: union(local.completedWeeklyChallenges, server.completedWeeklyChallenges),
    // toolXp: take max per tool
    toolXp: (() => {
      const merged: Record<string, number> = { ...local.toolXp }
      for (const [tool, xp] of Object.entries(server.toolXp ?? {})) {
        merged[tool] = Math.max(merged[tool] ?? 0, xp)
      }
      return merged
    })(),
  }
}

// ---------------------------------------------------------------------------
// Pull
// ---------------------------------------------------------------------------

/**
 * Pull server state and reconcile with local state.
 * Returns the reconciled state if changes are needed, or null if local is already up-to-date.
 */
async function pullState(userId: string, signal: AbortSignal): Promise<ProgressState | null> {
  if (signal.aborted) return null

  const { data, error } = await supabase
    .from('user_progress')
    .select('state, updated_at')
    .eq('user_id', userId)
    .maybeSingle()

  if (signal.aborted) return null

  if (error) {
    console.warn('[progress-sync] Pull failed:', error.message)
    return null
  }

  if (!data) return null

  const serverState = data.state as ProgressState
  const serverUpdatedAt = new Date(data.updated_at).getTime()

  // Check local state timestamp
  const localRaw = localStorage.getItem('agentic-saas-progress')
  if (!localRaw) return serverState

  let localState: ProgressState
  try {
    localState = JSON.parse(localRaw) as ProgressState
  } catch {
    return serverState
  }

  const localUpdatedAt = localState.lastActivityDate
    ? new Date(localState.lastActivityDate).getTime()
    : 0

  const serverIsNewer = serverUpdatedAt > localUpdatedAt
  const merged = mergeStates(localState, serverState, serverIsNewer)

  // Detect if merge produced anything different from local
  const localXp = localState.totalXp ?? 0
  const mergedXp = merged.totalXp ?? 0
  const localAchCount = (localState.unlockedAchievements ?? []).length
  const mergedAchCount = (merged.unlockedAchievements ?? []).length
  const localLessonCount = Object.keys(localState.lessonProgress ?? {}).length
  const mergedLessonCount = Object.keys(merged.lessonProgress ?? {}).length

  if (
    mergedXp !== localXp ||
    mergedAchCount !== localAchCount ||
    mergedLessonCount !== localLessonCount ||
    serverIsNewer
  ) {
    return merged
  }

  // No meaningful difference — local is authoritative
  return null
}

// ---------------------------------------------------------------------------
// Push
// ---------------------------------------------------------------------------

/**
 * Push state to Supabase (upsert user_progress + xp_weekly).
 * Returns true on success, false on failure.
 */
async function doPush(state: ProgressState): Promise<boolean> {
  if (!syncUserId) return false

  const now = new Date().toISOString()

  try {
    // Upsert user_progress
    const { error: progressError } = await supabase
      .from('user_progress')
      .upsert(
        {
          user_id: syncUserId,
          state,
          updated_at: now,
        },
        { onConflict: 'user_id' }
      )

    if (progressError) {
      console.warn('[progress-sync] Push user_progress failed:', progressError.message)
      return false
    }

    // Upsert xp_weekly
    const weekId = getWeekId()
    const xpDelta = Math.max(0, state.totalXp - lastKnownServerXp)

    if (xpDelta > 0) {
      const { error: weeklyError } = await supabase
        .from('xp_weekly')
        .upsert(
          {
            user_id: syncUserId,
            week_id: weekId,
            xp_earned: xpDelta,
            updated_at: now,
          },
          { onConflict: 'user_id,week_id' }
        )

      if (weeklyError) {
        console.warn('[progress-sync] Push xp_weekly failed:', weeklyError.message)
        // Non-fatal: user_progress succeeded, just log
      }
    }

    lastKnownServerXp = state.totalXp
    return true
  } catch (err) {
    console.warn('[progress-sync] Push network error:', err)
    return false
  }
}

/**
 * Execute a push with retry-once-on-failure (exponential backoff).
 */
async function pushWithRetry(state: ProgressState, attempt = 0): Promise<void> {
  setSyncStatus('syncing')

  const ok = await doPush(state)

  if (ok) {
    setSyncStatus('idle')
    return
  }

  // First failure: retry once after backoff
  if (attempt === 0) {
    setSyncStatus('error')
    const backoffMs = RETRY_BASE_MS * 2 ** attempt
    console.warn(`[progress-sync] Retrying push in ${backoffMs}ms...`)

    if (retryTimer) clearTimeout(retryTimer)
    retryTimer = setTimeout(() => {
      retryTimer = null
      // Use the latest pending state if available, otherwise the state we failed with
      const latestState = pendingPushState ?? state
      pendingPushState = null
      pushWithRetry(latestState, 1).catch(() => {
        setSyncStatus('error')
      })
    }, backoffMs)
    return
  }

  // Second failure: give up, stay in error
  setSyncStatus('error')
  console.warn('[progress-sync] Push failed after retry, giving up')
}

// ---------------------------------------------------------------------------
// Init / Stop
// ---------------------------------------------------------------------------

/**
 * Initialize sync: pull server state, reconcile, set up online/visibility listeners.
 */
export async function initSync(userId: string): Promise<void> {
  stopSync()

  syncUserId = userId
  abortController = new AbortController()

  // Online/offline listeners
  if (typeof window !== 'undefined') {
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    document.addEventListener('visibilitychange', handleVisibilityChange)
  }

  // Set initial status based on connectivity
  if (!isOnline()) {
    setSyncStatus('offline')
  }

  try {
    if (!isOnline()) {
      // Offline at init — use localStorage only
      const localRaw = localStorage.getItem('agentic-saas-progress')
      if (localRaw) {
        try {
          const local = JSON.parse(localRaw) as ProgressState
          lastKnownServerXp = local.totalXp
        } catch { /* ignore parse errors */ }
      }
      console.warn('[progress-sync] Offline at init — using localStorage only')
      return
    }

    const serverState = await pullState(userId, abortController.signal)

    // Fetch access tier
    try {
      const { fetchAccessTier } = await import('@/stores/access')
      await fetchAccessTier()
    } catch { /* access tier fetch is non-blocking */ }

    if (serverState) {
      localStorage.setItem('agentic-saas-progress', JSON.stringify(serverState))
      lastKnownServerXp = serverState.totalXp
      window.dispatchEvent(new Event('progress-sync-pull'))
    } else {
      const localRaw = localStorage.getItem('agentic-saas-progress')
      if (localRaw) {
        try {
          const local = JSON.parse(localRaw) as ProgressState
          lastKnownServerXp = local.totalXp
        } catch { /* ignore parse errors */ }
      }
    }
  } catch (err) {
    if ((err as Error).name !== 'AbortError') {
      console.warn('[progress-sync] initSync pull failed — falling back to localStorage:', err)
      // Non-blocking: app continues with localStorage data
    }
  }
}

/**
 * Stop syncing — cleanup on logout.
 */
export function stopSync(): void {
  syncUserId = null
  lastKnownServerXp = 0
  pushInFlight = false
  pendingPushState = null
  offlineQueue = null

  if (debounceTimer) {
    clearTimeout(debounceTimer)
    debounceTimer = null
  }

  if (retryTimer) {
    clearTimeout(retryTimer)
    retryTimer = null
  }

  if (abortController) {
    abortController.abort()
    abortController = null
  }

  // Remove event listeners
  if (typeof window !== 'undefined') {
    window.removeEventListener('online', handleOnline)
    window.removeEventListener('offline', handleOffline)
    document.removeEventListener('visibilitychange', handleVisibilityChange)
  }

  setSyncStatus('idle')
}

// ---------------------------------------------------------------------------
// Push (public) — debounced, race-safe, offline-aware
// ---------------------------------------------------------------------------

/**
 * Debounced push — call after every persist(). Coalesces rapid changes.
 * If offline, queues the latest state and flushes when back online.
 */
export function pushState(state: ProgressState): void {
  if (!syncUserId) return

  // If offline, just queue the latest state
  if (!isOnline()) {
    offlineQueue = state
    setSyncStatus('offline')
    return
  }

  // Cancel any pending debounce — we always want the latest
  if (debounceTimer) {
    clearTimeout(debounceTimer)
  }

  // If a push is currently in flight, record the newest state to push after
  if (pushInFlight) {
    pendingPushState = state
    return
  }

  debounceTimer = setTimeout(() => {
    debounceTimer = null

    // If tab is hidden, defer — will be picked up on visibility change
    if (typeof document !== 'undefined' && document.visibilityState === 'hidden') {
      offlineQueue = state
      return
    }

    pushInFlight = true
    pushWithRetry(state)
      .finally(() => {
        pushInFlight = false

        // If more state changes arrived while we were pushing, push the latest
        if (pendingPushState) {
          const next = pendingPushState
          pendingPushState = null
          pushState(next)
        }
      })
  }, DEBOUNCE_MS)
}

// ---------------------------------------------------------------------------
// Activity feed
// ---------------------------------------------------------------------------

/**
 * Post a significant event to the activity feed.
 */
export function postActivity(event: { type: string; payload: Record<string, unknown> }): void {
  if (!syncUserId) return

  // Don't attempt when offline
  if (!isOnline()) return

  Promise.resolve(
    supabase
      .from('activity_feed')
      .insert({
        user_id: syncUserId,
        event_type: event.type,
        payload: event.payload,
        created_at: new Date().toISOString(),
      })
  )
    .then(({ error }) => {
      if (error) {
        console.warn('[progress-sync] postActivity failed:', error.message)
      }
    })
    .catch((err: unknown) => {
      console.warn('[progress-sync] postActivity network error:', err)
    })
}

// ---------------------------------------------------------------------------
// Online / Offline / Visibility handlers
// ---------------------------------------------------------------------------

function handleOnline() {
  if (_syncStatus === 'offline') {
    setSyncStatus('idle')
  }

  // Flush queued push
  if (offlineQueue && syncUserId) {
    const state = offlineQueue
    offlineQueue = null
    pushState(state)
  }
}

function handleOffline() {
  setSyncStatus('offline')
}

function handleVisibilityChange() {
  if (!syncUserId) return

  if (document.visibilityState === 'visible') {
    // Tab became visible — re-pull in case another device made changes
    if (isOnline() && abortController && !abortController.signal.aborted) {
      pullState(syncUserId, abortController.signal)
        .then((serverState) => {
          if (serverState) {
            localStorage.setItem('agentic-saas-progress', JSON.stringify(serverState))
            lastKnownServerXp = serverState.totalXp
            window.dispatchEvent(new Event('progress-sync-pull'))
          }
        })
        .catch((err) => {
          if ((err as Error).name !== 'AbortError') {
            console.warn('[progress-sync] visibility pull failed:', err)
          }
        })
    }

    // Flush anything queued while hidden
    if (offlineQueue) {
      const state = offlineQueue
      offlineQueue = null
      pushState(state)
    }
  }
  // When tab is hidden, pushState already defers via offlineQueue
}
