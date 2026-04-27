import { useSyncExternalStore } from 'react'
import { CURRICULUM, ALL_LESSONS, XP_LEVELS, ACHIEVEMENTS } from '@/data/curriculum'
import type { LessonStatus } from '@/data/curriculum'

const STORAGE_KEY = 'agentic-saas-progress'

export interface LessonProgress {
  status: LessonStatus
  completedAt?: string
  xpEarned: number
}

export interface ProgressState {
  lessonProgress: Record<string, LessonProgress>
  totalXp: number
  currentStreak: number
  longestStreak: number
  lastActivityDate: string | null
  unlockedAchievements: string[]
  streakDates: string[]
}

const defaultState: ProgressState = {
  lessonProgress: {},
  totalXp: 0,
  currentStreak: 0,
  longestStreak: 0,
  lastActivityDate: null,
  unlockedAchievements: [],
  streakDates: [],
}

let state: ProgressState = defaultState
const listeners = new Set<() => void>()

function emit() {
  for (const listener of listeners) listener()
}

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {}
}

function load(): ProgressState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as ProgressState
  } catch {}
  return defaultState
}

function init() {
  state = load()
  updateStreak()
}

function today(): string {
  return new Date().toISOString().split('T')[0]
}

function updateStreak() {
  const todayStr = today()
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayStr = yesterday.toISOString().split('T')[0]

  if (state.lastActivityDate === todayStr) return
  if (state.lastActivityDate === yesterdayStr) {
    // streak continues
  } else if (state.lastActivityDate !== todayStr) {
    state.currentStreak = 0
  }
}

if (typeof window !== 'undefined') init()

export function getLessonStatus(lessonId: string): LessonStatus {
  const progress = state.lessonProgress[lessonId]
  if (progress) return progress.status

  const lesson = ALL_LESSONS.find((l) => l.id === lessonId)
  if (!lesson) return 'locked'

  for (const tier of CURRICULUM) {
    const lessonIndex = tier.lessons.findIndex((l) => l.id === lessonId)
    if (lessonIndex === -1) continue

    if (lessonIndex === 0) {
      const tierIndex = CURRICULUM.indexOf(tier)
      if (tierIndex === 0) return 'available'
      const prevTier = CURRICULUM[tierIndex - 1]
      const lastLesson = prevTier.lessons[prevTier.lessons.length - 1]
      const lastProgress = state.lessonProgress[lastLesson.id]
      return lastProgress?.status === 'completed' ? 'available' : 'locked'
    }

    const prevLesson = tier.lessons[lessonIndex - 1]
    const prevProgress = state.lessonProgress[prevLesson.id]
    return prevProgress?.status === 'completed' ? 'available' : 'locked'
  }

  return 'locked'
}

export function completeLesson(lessonId: string) {
  const lesson = ALL_LESSONS.find((l) => l.id === lessonId)
  if (!lesson) return

  const todayStr = today()

  state = {
    ...state,
    lessonProgress: {
      ...state.lessonProgress,
      [lessonId]: {
        status: 'completed',
        completedAt: new Date().toISOString(),
        xpEarned: lesson.xp,
      },
    },
    totalXp: state.totalXp + lesson.xp,
    lastActivityDate: todayStr,
    streakDates: state.streakDates.includes(todayStr)
      ? state.streakDates
      : [...state.streakDates, todayStr],
  }

  // Update streak
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayStr = yesterday.toISOString().split('T')[0]

  if (state.lastActivityDate === yesterdayStr || state.currentStreak === 0) {
    state.currentStreak = state.currentStreak + 1
  }
  if (state.currentStreak > state.longestStreak) {
    state.longestStreak = state.currentStreak
  }

  checkAchievements()
  persist()
  emit()
}

export function startLesson(lessonId: string) {
  if (state.lessonProgress[lessonId]?.status === 'completed') return

  state = {
    ...state,
    lessonProgress: {
      ...state.lessonProgress,
      [lessonId]: {
        status: 'in_progress',
        xpEarned: 0,
      },
    },
  }
  persist()
  emit()
}

function checkAchievements() {
  const completedLessons = Object.entries(state.lessonProgress).filter(
    ([_, p]) => p.status === 'completed'
  )
  const completedCount = completedLessons.length
  const newAchievements = [...state.unlockedAchievements]

  for (const achievement of ACHIEVEMENTS) {
    if (newAchievements.includes(achievement.id)) continue

    let earned = false
    switch (achievement.condition) {
      case 'complete_1_lesson':
        earned = completedCount >= 1
        break
      case 'streak_3':
        earned = state.currentStreak >= 3
        break
      case 'streak_7':
        earned = state.currentStreak >= 7
        break
      case 'streak_30':
        earned = state.currentStreak >= 30
        break
      case 'complete_prework':
        earned = CURRICULUM[0].lessons.every(
          (l) => state.lessonProgress[l.id]?.status === 'completed'
        )
        break
      case 'complete_tier1':
        earned = CURRICULUM[1].lessons.every(
          (l) => state.lessonProgress[l.id]?.status === 'completed'
        )
        break
      case 'complete_tier2':
        earned = CURRICULUM[2].lessons.every(
          (l) => state.lessonProgress[l.id]?.status === 'completed'
        )
        break
      case 'complete_tier3':
        earned = CURRICULUM[3].lessons.every(
          (l) => state.lessonProgress[l.id]?.status === 'completed'
        )
        break
      case 'complete_tier4':
        earned = CURRICULUM[4].lessons.every(
          (l) => state.lessonProgress[l.id]?.status === 'completed'
        )
        break
      case 'half_complete':
        earned = completedCount >= Math.floor(ALL_LESSONS.length / 2)
        break
      case 'all_complete':
        earned = completedCount === ALL_LESSONS.length
        break
      case 'three_in_day': {
        const todayStr = today()
        const todayCompletions = completedLessons.filter(
          ([_, p]) => p.completedAt?.startsWith(todayStr)
        )
        earned = todayCompletions.length >= 3
        break
      }
    }

    if (earned) {
      newAchievements.push(achievement.id)
      state.totalXp += achievement.xpReward
    }
  }

  state.unlockedAchievements = newAchievements
}

export function getLevel() {
  for (let i = XP_LEVELS.length - 1; i >= 0; i--) {
    if (state.totalXp >= XP_LEVELS[i].minXp) return XP_LEVELS[i]
  }
  return XP_LEVELS[0]
}

export function getNextLevel() {
  const current = getLevel()
  const idx = XP_LEVELS.indexOf(current)
  return idx < XP_LEVELS.length - 1 ? XP_LEVELS[idx + 1] : null
}

export function getTierProgress(tierId: string) {
  const tier = CURRICULUM.find((t) => t.id === tierId)
  if (!tier) return { completed: 0, total: 0, percent: 0 }
  const completed = tier.lessons.filter(
    (l) => state.lessonProgress[l.id]?.status === 'completed'
  ).length
  return {
    completed,
    total: tier.lessons.length,
    percent: Math.round((completed / tier.lessons.length) * 100),
  }
}

export function getOverallProgress() {
  const completed = Object.values(state.lessonProgress).filter(
    (p) => p.status === 'completed'
  ).length
  return {
    completed,
    total: ALL_LESSONS.length,
    percent: Math.round((completed / ALL_LESSONS.length) * 100),
  }
}

export function resetProgress() {
  state = defaultState
  persist()
  emit()
}

export function useProgress(): ProgressState {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb)
      return () => listeners.delete(cb)
    },
    () => state,
    () => defaultState,
  )
}
