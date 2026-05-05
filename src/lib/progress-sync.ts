import { supabase } from '@/lib/supabase'
import type { ProgressState } from '@/stores/progress'

let syncUserId: string | null = null
let debounceTimer: ReturnType<typeof setTimeout> | null = null
let abortController: AbortController | null = null
let lastKnownServerXp: number = 0

const DEBOUNCE_MS = 2000

function getWeekId(): string {
  const now = new Date()
  const startOfYear = new Date(now.getFullYear(), 0, 1)
  const weekNum = Math.ceil(((now.getTime() - startOfYear.getTime()) / 86400000 + startOfYear.getDay() + 1) / 7)
  return `${now.getFullYear()}-W${weekNum}`
}

/**
 * Pull server state and reconcile with local state.
 * Returns the reconciled state if server is newer, or null if local wins.
 */
async function pullState(userId: string, _signal: AbortSignal): Promise<ProgressState | null> {
  if (_signal.aborted) return null

  const { data, error } = await supabase
    .from('user_progress')
    .select('state, updated_at')
    .eq('user_id', userId)
    .maybeSingle()

  if (_signal.aborted) return null

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

  const localState = JSON.parse(localRaw) as ProgressState

  // For XP, always take the max to prevent XP loss
  const reconciledXp = Math.max(localState.totalXp ?? 0, serverState.totalXp ?? 0)

  // Compare updated_at — if server is newer, use server state (with max XP)
  const localUpdatedAt = localState.lastActivityDate
    ? new Date(localState.lastActivityDate).getTime()
    : 0

  if (serverUpdatedAt > localUpdatedAt) {
    return { ...serverState, totalXp: reconciledXp }
  }

  // Local is newer — keep local but ensure XP never decreases
  if (localState.totalXp < reconciledXp) {
    return { ...localState, totalXp: reconciledXp }
  }

  return null
}

/**
 * Push state to Supabase (upsert user_progress + xp_weekly).
 */
async function doPush(state: ProgressState): Promise<void> {
  if (!syncUserId) return

  const now = new Date().toISOString()

  // Upsert user_progress
  const { error: progressError } = await supabase
    .from('user_progress')
    .upsert(
      {
        user_id: syncUserId,
        state,
        total_xp: state.totalXp,
        current_streak: state.currentStreak,
        updated_at: now,
      },
      { onConflict: 'user_id' }
    )

  if (progressError) {
    console.warn('[progress-sync] Push user_progress failed:', progressError.message)
    return
  }

  // Upsert xp_weekly — calculate delta from last known server XP
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
    }
  }

  lastKnownServerXp = state.totalXp
}

/**
 * Initialize sync: pull server state, reconcile, start listening for pushes.
 */
export async function initSync(userId: string): Promise<void> {
  stopSync()

  syncUserId = userId
  abortController = new AbortController()

  try {
    const serverState = await pullState(userId, abortController.signal)

    if (serverState) {
      // Server had newer (or reconciled) data — write it to localStorage and reload
      localStorage.setItem('agentic-saas-progress', JSON.stringify(serverState))
      lastKnownServerXp = serverState.totalXp
      // Dispatch a storage event so the store can pick it up
      window.dispatchEvent(new Event('progress-sync-pull'))
    } else {
      // Local is authoritative — set lastKnownServerXp from local
      const localRaw = localStorage.getItem('agentic-saas-progress')
      if (localRaw) {
        const local = JSON.parse(localRaw) as ProgressState
        lastKnownServerXp = local.totalXp
      }
    }
  } catch (err) {
    if ((err as Error).name !== 'AbortError') {
      console.warn('[progress-sync] initSync error:', err)
    }
  }
}

/**
 * Debounced push — call after every persist(). Coalesces rapid changes.
 */
export function pushState(state: ProgressState): void {
  if (!syncUserId) return

  if (debounceTimer) {
    clearTimeout(debounceTimer)
  }

  debounceTimer = setTimeout(() => {
    doPush(state).catch((err) => {
      console.warn('[progress-sync] pushState error:', err)
    })
  }, DEBOUNCE_MS)
}

/**
 * Stop syncing — cleanup on logout.
 */
export function stopSync(): void {
  syncUserId = null
  lastKnownServerXp = 0

  if (debounceTimer) {
    clearTimeout(debounceTimer)
    debounceTimer = null
  }

  if (abortController) {
    abortController.abort()
    abortController = null
  }
}

/**
 * Post a significant event to the activity feed.
 */
export function postActivity(event: { type: string; payload: Record<string, unknown> }): void {
  if (!syncUserId) return

  supabase
    .from('activity_feed')
    .insert({
      user_id: syncUserId,
      event_type: event.type,
      payload: event.payload,
      created_at: new Date().toISOString(),
    })
    .then(({ error }) => {
      if (error) {
        console.warn('[progress-sync] postActivity failed:', error.message)
      }
    })
}
