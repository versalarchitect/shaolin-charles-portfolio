import { useSyncExternalStore } from 'react'

const STORAGE_KEY = 'lesson-bookmarks'

interface BookmarkStore {
  bookmarkedLessons: string[]
}

let state: BookmarkStore = { bookmarkedLessons: [] }
const listeners = new Set<() => void>()

function emit() {
  for (const listener of listeners) listener()
}

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.bookmarkedLessons))
  } catch {}
}

function load(): BookmarkStore {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) return { bookmarkedLessons: parsed }
    }
  } catch {}
  return { bookmarkedLessons: [] }
}

if (typeof window !== 'undefined') {
  state = load()
}

export function toggleBookmark(lessonId: string): void {
  const idx = state.bookmarkedLessons.indexOf(lessonId)
  if (idx === -1) {
    state = { bookmarkedLessons: [...state.bookmarkedLessons, lessonId] }
  } else {
    state = { bookmarkedLessons: state.bookmarkedLessons.filter((id) => id !== lessonId) }
  }
  persist()
  emit()
}

export function isBookmarked(lessonId: string): boolean {
  return state.bookmarkedLessons.includes(lessonId)
}

export function getBookmarkedLessons(): string[] {
  return state.bookmarkedLessons
}

const defaultState: BookmarkStore = { bookmarkedLessons: [] }

export function useBookmarks(): BookmarkStore {
  return useSyncExternalStore(
    (cb) => { listeners.add(cb); return () => listeners.delete(cb) },
    () => state,
    () => defaultState,
  )
}
