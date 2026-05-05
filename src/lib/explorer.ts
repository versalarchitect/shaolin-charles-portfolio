import { EXPLORER_PAGES, EXPLORER_ACHIEVEMENTS } from '@/data/explorer-achievements'
import type { ExplorerAchievement } from '@/data/explorer-achievements'
import { supabase } from '@/lib/supabase'
import { awardExplorerXp } from '@/stores/progress'
import { playSound } from '@/lib/sounds'

const STORAGE_KEY = 'explorer-state'

export interface ExplorerState {
  visitedPages: Set<string>
  easterEggsFound: Set<string>
  interactions: Set<string>
  totalExplorerXp: number
  unlockedAchievements: Set<string>
}

interface SerializedExplorerState {
  visitedPages: string[]
  easterEggsFound: string[]
  interactions: string[]
  totalExplorerXp: number
  unlockedAchievements: string[]
}

let state: ExplorerState = {
  visitedPages: new Set(),
  easterEggsFound: new Set(),
  interactions: new Set(),
  totalExplorerXp: 0,
  unlockedAchievements: new Set(),
}

let version = 0
const listeners = new Set<() => void>()

function emit() {
  version++
  for (const listener of listeners) listener()
}

export function subscribeExplorer(cb: () => void) {
  listeners.add(cb)
  return () => { listeners.delete(cb) }
}

export function getExplorerVersion(): number {
  return version
}

function serialize(s: ExplorerState): SerializedExplorerState {
  return {
    visitedPages: [...s.visitedPages],
    easterEggsFound: [...s.easterEggsFound],
    interactions: [...s.interactions],
    totalExplorerXp: s.totalExplorerXp,
    unlockedAchievements: [...s.unlockedAchievements],
  }
}

function deserialize(raw: SerializedExplorerState): ExplorerState {
  return {
    visitedPages: new Set(raw.visitedPages || []),
    easterEggsFound: new Set(raw.easterEggsFound || []),
    interactions: new Set(raw.interactions || []),
    totalExplorerXp: raw.totalExplorerXp || 0,
    unlockedAchievements: new Set(raw.unlockedAchievements || []),
  }
}

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(serialize(state)))
  } catch {}
}

function load(): ExplorerState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return deserialize(JSON.parse(raw))
  } catch {}
  // Migrate from old storage key if present
  try {
    const oldRaw = localStorage.getItem('explorer-easter-eggs')
    if (oldRaw) {
      const oldEggs: string[] = JSON.parse(oldRaw)
      const migrated: ExplorerState = {
        visitedPages: new Set(),
        easterEggsFound: new Set(oldEggs.map((e) => `egg:${e}`)),
        interactions: new Set(),
        totalExplorerXp: 0,
        unlockedAchievements: new Set(),
      }
      localStorage.removeItem('explorer-easter-eggs')
      return migrated
    }
  } catch {}
  return {
    visitedPages: new Set(),
    easterEggsFound: new Set(),
    interactions: new Set(),
    totalExplorerXp: 0,
    unlockedAchievements: new Set(),
  }
}

function recordToSupabase(eventType: string, eventKey: string, xp: number, metadata?: Record<string, unknown>) {
  supabase.auth.getSession().then(({ data: { session } }) => {
    if (!session?.user) return
    supabase
      .from('explorer_events')
      .upsert(
        {
          user_id: session.user.id,
          event_type: eventType,
          event_key: eventKey,
          xp_awarded: xp,
          metadata: metadata || {},
        },
        { onConflict: 'user_id,event_key' }
      )
      .then(() => {})
  })
}

function awardXp(amount: number, eventKey: string) {
  state.totalExplorerXp += amount
  awardExplorerXp(amount, eventKey)
}

export function checkExplorerAchievements(): ExplorerAchievement[] {
  const newlyUnlocked: ExplorerAchievement[] = []

  for (const achievement of EXPLORER_ACHIEVEMENTS) {
    if (state.unlockedAchievements.has(achievement.id)) continue

    let met = false
    switch (achievement.condition) {
      case 'pages_visited':
        met = state.visitedPages.size >= achievement.threshold
        break
      case 'easter_egg':
        met = state.easterEggsFound.size >= achievement.threshold
        break
      case 'interaction':
        met = state.interactions.size >= achievement.threshold
        break
      case 'total_explorer_xp':
        met = state.totalExplorerXp >= achievement.threshold
        break
    }

    if (met) {
      state.unlockedAchievements.add(achievement.id)
      awardXp(achievement.xp, `achievement:${achievement.id}`)
      recordToSupabase('achievement', `achievement:${achievement.id}`, achievement.xp, { name: achievement.name })
      newlyUnlocked.push(achievement)
    }
  }

  return newlyUnlocked
}

export function trackPageVisit(path: string): { awarded: boolean; xp: number; achievementsUnlocked: ExplorerAchievement[] } {
  // Normalize art sub-routes to /art
  const normalizedPath = path.startsWith('/art/') ? '/art' : path

  const page = EXPLORER_PAGES.find((p) => p.path === normalizedPath)
  if (!page) return { awarded: false, xp: 0, achievementsUnlocked: [] }

  if (state.visitedPages.has(page.key)) {
    return { awarded: false, xp: 0, achievementsUnlocked: [] }
  }

  state.visitedPages.add(page.key)
  awardXp(page.xp, page.key)
  recordToSupabase('page_visit', page.key, page.xp, { path: normalizedPath, name: page.name })

  const achievementsUnlocked = checkExplorerAchievements()

  persist()
  emit()
  return { awarded: true, xp: page.xp, achievementsUnlocked }
}

/**
 * Track an easter egg discovery. Awards XP and plays a sound.
 * Returns result with whether this is a new discovery and any achievements unlocked.
 */
export function trackEasterEgg(eggKey: string, xp: number): { awarded: boolean; achievementsUnlocked: ExplorerAchievement[] } {
  const fullKey = `egg:${eggKey}`
  if (state.easterEggsFound.has(fullKey)) {
    return { awarded: false, achievementsUnlocked: [] }
  }

  state.easterEggsFound.add(fullKey)
  awardXp(xp, fullKey)
  playSound('discovery')
  recordToSupabase('easter_egg', fullKey, xp, { egg: eggKey })

  const achievementsUnlocked = checkExplorerAchievements()

  persist()
  emit()
  return { awarded: true, achievementsUnlocked }
}

export function trackInteraction(interactionKey: string, xp: number): { awarded: boolean; achievementsUnlocked: ExplorerAchievement[] } {
  const fullKey = `interact:${interactionKey}`
  if (state.interactions.has(fullKey)) {
    return { awarded: false, achievementsUnlocked: [] }
  }

  state.interactions.add(fullKey)
  awardXp(xp, fullKey)
  recordToSupabase('interaction', fullKey, xp, { interaction: interactionKey })

  const achievementsUnlocked = checkExplorerAchievements()

  persist()
  emit()
  return { awarded: true, achievementsUnlocked }
}

/**
 * Check if an easter egg has already been discovered.
 */
export function isEggDiscovered(eggKey: string): boolean {
  return state.easterEggsFound.has(`egg:${eggKey}`)
}

/**
 * Get count of discovered easter eggs.
 */
export function getDiscoveredCount(): number {
  return state.easterEggsFound.size
}

/**
 * Total number of easter eggs in the system.
 */
export const TOTAL_EASTER_EGGS = 5

export function getExplorerState(): ExplorerState {
  return state
}

export function getExplorerProgress(): { visited: number; total: number; xpEarned: number; achievements: string[] } {
  return {
    visited: state.visitedPages.size,
    total: EXPLORER_PAGES.length,
    xpEarned: state.totalExplorerXp,
    achievements: [...state.unlockedAchievements],
  }
}

// Initialize on load
if (typeof window !== 'undefined') {
  state = load()
}
