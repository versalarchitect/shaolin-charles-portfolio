import { useSyncExternalStore } from 'react'

const STORAGE_KEY = 'lesson-ratings'

export interface LessonRating {
  lessonId: string
  difficulty: 1 | 2 | 3 | 4 | 5 // 1=easy, 5=hard
  rating: 1 | 2 | 3 | 4 | 5     // stars
  ratedAt: string
}

interface RatingStore {
  ratings: Record<string, LessonRating>
}

let state: RatingStore = { ratings: {} }
const listeners = new Set<() => void>()

function emit() {
  for (const listener of listeners) listener()
}

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.ratings))
  } catch {}
}

function load(): RatingStore {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
        return { ratings: parsed }
      }
    }
  } catch {}
  return { ratings: {} }
}

if (typeof window !== 'undefined') {
  state = load()
}

export function setRating(
  lessonId: string,
  difficulty: 1 | 2 | 3 | 4 | 5,
  rating: 1 | 2 | 3 | 4 | 5,
): void {
  state = {
    ratings: {
      ...state.ratings,
      [lessonId]: {
        lessonId,
        difficulty,
        rating,
        ratedAt: new Date().toISOString(),
      },
    },
  }
  persist()
  emit()
}

export function getRating(lessonId: string): LessonRating | null {
  return state.ratings[lessonId] ?? null
}

export function getAverageDifficulty(): number {
  const entries = Object.values(state.ratings)
  if (entries.length === 0) return 0
  const sum = entries.reduce((acc, r) => acc + r.difficulty, 0)
  return sum / entries.length
}

export function getAverageRating(): number {
  const entries = Object.values(state.ratings)
  if (entries.length === 0) return 0
  const sum = entries.reduce((acc, r) => acc + r.rating, 0)
  return sum / entries.length
}

export function getRatedCount(): number {
  return Object.keys(state.ratings).length
}

const defaultState: RatingStore = { ratings: {} }

export function useRatings(): RatingStore {
  return useSyncExternalStore(
    (cb) => { listeners.add(cb); return () => listeners.delete(cb) },
    () => state,
    () => defaultState,
  )
}
