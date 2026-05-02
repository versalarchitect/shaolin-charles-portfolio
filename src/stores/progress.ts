import { useSyncExternalStore } from 'react'
import { CURRICULUM, ALL_LESSONS, XP_LEVELS, ACHIEVEMENTS, STREAK_MULTIPLIERS, CHALLENGE_POOL, TITLES, WEEKLY_CHALLENGE_POOL } from '@/data/curriculum'
import type { LessonStatus, Achievement, ChallengeDefinition, Title, WeeklyChallengeDefinition } from '@/data/curriculum'

const STORAGE_KEY = 'agentic-saas-progress'

export interface LessonProgress {
  status: LessonStatus
  completedAt?: string
  xpEarned: number
}

export interface DailyChallenge extends ChallengeDefinition {
  completed: boolean
}

export interface XpEvent {
  id: string
  type: 'lesson' | 'achievement' | 'challenge' | 'bonus'
  label: string
  xp: number
  timestamp: string
  multipliers?: string[]
}

export interface ProgressState {
  lessonProgress: Record<string, LessonProgress>
  totalXp: number
  currentStreak: number
  longestStreak: number
  lastActivityDate: string | null
  unlockedAchievements: string[]
  streakDates: string[]
  dailyXpEarned: number
  dailyXpGoal: number
  dailyXpDate: string | null
  completedChallenges: string[]
  challengeDate: string | null
  comboCount: number
  lastCompletionTime: number | null
  streakFreezeUsedThisWeek: boolean
  streakFreezeWeek: string | null
  milestonesHit: number[]
  unlockedTitles: string[]
  activeTitle: string
  dailyGoalStreak: number
  totalChallengesCompleted: number
  weeklyProgress: { lessonsCompleted: number; activeDays: string[]; xpEarned: number; challengesCompleted: number; combosHit: number; tiersCompleted: number }
  weeklyProgressWeek: string | null
  completedWeeklyChallenges: string[]
  toolXp: Record<string, number>
}

const defaultState: ProgressState = {
  lessonProgress: {},
  totalXp: 0,
  currentStreak: 0,
  longestStreak: 0,
  lastActivityDate: null,
  unlockedAchievements: [],
  streakDates: [],
  dailyXpEarned: 0,
  dailyXpGoal: 50,
  dailyXpDate: null,
  completedChallenges: [],
  challengeDate: null,
  comboCount: 0,
  lastCompletionTime: null,
  streakFreezeUsedThisWeek: false,
  streakFreezeWeek: null,
  milestonesHit: [],
  unlockedTitles: ['newcomer'],
  activeTitle: 'newcomer',
  dailyGoalStreak: 0,
  totalChallengesCompleted: 0,
  weeklyProgress: { lessonsCompleted: 0, activeDays: [], xpEarned: 0, challengesCompleted: 0, combosHit: 0, tiersCompleted: 0 },
  weeklyProgressWeek: null,
  completedWeeklyChallenges: [],
  toolXp: {},
}

let state: ProgressState = defaultState
let xpLog: XpEvent[] = []
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
  resetDailyIfNeeded()
}

function today(): string {
  return new Date().toISOString().split('T')[0]
}

function getCompletedToday(): [string, LessonProgress][] {
  const todayStr = today()
  return Object.entries(state.lessonProgress).filter(
    ([_, p]) => p.status === 'completed' && p.completedAt?.startsWith(todayStr)
  )
}

function getWeekId(): string {
  const now = new Date()
  const startOfYear = new Date(now.getFullYear(), 0, 1)
  const weekNum = Math.ceil(((now.getTime() - startOfYear.getTime()) / 86400000 + startOfYear.getDay() + 1) / 7)
  return `${now.getFullYear()}-W${weekNum}`
}

function updateStreak() {
  const todayStr = today()
  if (state.lastActivityDate === todayStr) return

  const currentWeek = getWeekId()
  if (state.streakFreezeWeek !== currentWeek) {
    state.streakFreezeUsedThisWeek = false
    state.streakFreezeWeek = currentWeek
  }

  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayStr = yesterday.toISOString().split('T')[0]

  if (state.lastActivityDate !== yesterdayStr && state.lastActivityDate !== null) {
    if (state.currentStreak >= 3 && !state.streakFreezeUsedThisWeek) {
      state.streakFreezeUsedThisWeek = true
      emitEvent({ type: 'streak_saved', message: `Streak freeze activated! Your ${state.currentStreak}-day streak is safe.` })
    } else {
      state.currentStreak = 0
    }
    persist()
  }
}

export type ProgressEvent =
  | { type: 'achievement_unlocked'; achievement: Achievement }
  | { type: 'challenge_completed'; challenge: DailyChallenge }
  | { type: 'level_up'; from: string; to: string }
  | { type: 'streak_milestone'; days: number; multiplier: number }
  | { type: 'milestone'; percent: number; label: string }
  | { type: 'streak_saved'; message: string }
  | { type: 'first_of_day'; bonusXp: number }
  | { type: 'critical_hit'; baseXp: number; totalXp: number }
  | { type: 'title_unlocked'; title: Title }

const eventListeners = new Set<(event: ProgressEvent) => void>()

export function onProgressEvent(cb: (event: ProgressEvent) => void) {
  eventListeners.add(cb)
  return () => { eventListeners.delete(cb) }
}

function emitEvent(event: ProgressEvent) {
  for (const cb of eventListeners) cb(event)
}

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

export function getDailyChallenges(): DailyChallenge[] {
  const todayStr = today()
  const seed = parseInt(todayStr.replace(/-/g, ''), 10)
  const shuffled = [...CHALLENGE_POOL].sort((a, b) => seededRandom(seed + a.id.length) - seededRandom(seed + b.id.length))
  const selected = shuffled.slice(0, 3)
  return selected.map((c) => ({
    ...c,
    completed: state.challengeDate === todayStr && state.completedChallenges.includes(c.id),
  }))
}

export function setActiveTitle(titleId: string) {
  if (!state.unlockedTitles.includes(titleId)) return
  state = { ...state, activeTitle: titleId }
  persist()
  emit()
}

export function getActiveTitle(): Title {
  return TITLES.find(t => t.id === state.activeTitle) || TITLES[0]
}

export function getUnlockedTitles(): Title[] {
  return TITLES.filter(t => state.unlockedTitles.includes(t.id))
}

export interface WeeklyChallenge extends WeeklyChallengeDefinition {
  completed: boolean
  progress: number
}

export function getWeeklyChallenges(): WeeklyChallenge[] {
  const weekId = getWeekId()
  const seed = parseInt(weekId.replace(/\D/g, ''), 10)
  const shuffled = [...WEEKLY_CHALLENGE_POOL].sort((a, b) => seededRandom(seed + a.id.length) - seededRandom(seed + b.id.length))
  const selected = shuffled.slice(0, 3)

  const wp = state.weeklyProgressWeek === weekId ? state.weeklyProgress : { lessonsCompleted: 0, activeDays: [], xpEarned: 0, challengesCompleted: 0, combosHit: 0, tiersCompleted: 0 }

  return selected.map((c) => {
    let progress = 0
    switch (c.condition) {
      case 'lessons_this_week': progress = wp.lessonsCompleted; break
      case 'active_days_week': progress = wp.activeDays.length; break
      case 'xp_this_week': progress = wp.xpEarned; break
      case 'challenges_this_week': progress = wp.challengesCompleted; break
      case 'combos_this_week': progress = wp.combosHit; break
      case 'tier_complete_week': progress = wp.tiersCompleted; break
    }
    return {
      ...c,
      completed: state.weeklyProgressWeek === weekId && state.completedWeeklyChallenges.includes(c.id),
      progress,
    }
  })
}

export function getStreakMultiplier(): { multiplier: number; label: string } {
  for (const tier of STREAK_MULTIPLIERS) {
    if (state.currentStreak >= tier.minStreak) {
      return { multiplier: tier.multiplier, label: `${tier.multiplier}x` }
    }
  }
  return { multiplier: 1, label: '1x' }
}

export const COMBO_WINDOW_MS = 10 * 60 * 1000

export function getComboInfo(): { count: number; bonusPercent: number; active: boolean } {
  if (!state.lastCompletionTime) return { count: 0, bonusPercent: 0, active: false }
  const elapsed = Date.now() - state.lastCompletionTime
  const active = elapsed < COMBO_WINDOW_MS
  const count = active ? state.comboCount : 0
  const bonusPercent = Math.min(count * 10, 50)
  return { count, bonusPercent, active }
}

function logXp(type: XpEvent['type'], label: string, xp: number, multipliers?: string[]) {
  const event: XpEvent = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    type,
    label,
    xp,
    timestamp: new Date().toISOString(),
    multipliers,
  }
  xpLog = [event, ...xpLog].slice(0, 50)
}

export function getXpLog(): XpEvent[] {
  return xpLog
}

export function getWeeklyStats(): { thisWeek: number; lastWeek: number; lessonsThisWeek: number; lessonsLastWeek: number } {
  const now = new Date()
  const dayOfWeek = now.getDay()
  const startOfWeek = new Date(now)
  startOfWeek.setDate(now.getDate() - dayOfWeek)
  startOfWeek.setHours(0, 0, 0, 0)

  const startOfLastWeek = new Date(startOfWeek)
  startOfLastWeek.setDate(startOfLastWeek.getDate() - 7)

  let thisWeekXp = 0, lastWeekXp = 0, lessonsThisWeek = 0, lessonsLastWeek = 0

  for (const [_, p] of Object.entries(state.lessonProgress)) {
    if (p.status !== 'completed' || !p.completedAt) continue
    const completed = new Date(p.completedAt)
    if (completed >= startOfWeek) {
      thisWeekXp += p.xpEarned
      lessonsThisWeek++
    } else if (completed >= startOfLastWeek) {
      lastWeekXp += p.xpEarned
      lessonsLastWeek++
    }
  }

  return { thisWeek: thisWeekXp, lastWeek: lastWeekXp, lessonsThisWeek, lessonsLastWeek }
}

function resetDailyIfNeeded() {
  const todayStr = today()
  if (state.dailyXpDate !== todayStr) {
    state.dailyXpEarned = 0
    state.dailyXpDate = todayStr
  }
  if (state.challengeDate !== todayStr) {
    state.completedChallenges = []
    state.challengeDate = todayStr
  }
}

function checkDailyChallenges() {
  const todayStr = today()
  const challenges = getDailyChallenges()
  const completedLessonsToday = getCompletedToday()

  for (const challenge of challenges) {
    if (challenge.completed) continue

    let earned = false
    switch (challenge.condition) {
      case 'two_lessons_today':
        earned = completedLessonsToday.length >= 2
        break
      case 'three_lessons_today':
        earned = completedLessonsToday.length >= 3
        break
      case 'maintain_streak':
        earned = state.currentStreak >= 1 && state.lastActivityDate === todayStr
        break
      case 'complete_capstone': {
        const capstoneLessons = ALL_LESSONS.filter((l) => l.isCapstone)
        earned = completedLessonsToday.some(([id]) => capstoneLessons.some((c) => c.id === id))
        break
      }
      case 'earn_50_xp':
        earned = state.dailyXpEarned >= 50
        break
      case 'earn_100_xp':
        earned = state.dailyXpEarned >= 100
        break
      case 'new_tier_lesson': {
        for (const tier of CURRICULUM) {
          const tierLessons = tier.lessons
          const hasCompletedBefore = tierLessons.some(
            (l) => state.lessonProgress[l.id]?.status === 'completed' && !state.lessonProgress[l.id]?.completedAt?.startsWith(todayStr)
          )
          const completedTodayInTier = tierLessons.some(
            (l) => completedLessonsToday.some(([id]) => id === l.id)
          )
          if (!hasCompletedBefore && completedTodayInTier) {
            earned = true
            break
          }
        }
        break
      }
      case 'first_lesson_today':
        earned = completedLessonsToday.length >= 1
        break
      case 'combo_3':
        earned = state.comboCount >= 3
        break
      case 'combo_5':
        earned = state.comboCount >= 5
        break
      case 'daily_goal_met':
        earned = state.dailyXpEarned >= state.dailyXpGoal
        break
      case 'three_tools': {
        const toolsUsedToday = new Set<string>()
        for (const [id] of completedLessonsToday) {
          const l = ALL_LESSONS.find((les) => les.id === id)
          if (l) for (const t of l.tools) toolsUsedToday.add(t)
        }
        earned = toolsUsedToday.size >= 3
        break
      }
    }

    if (earned && !state.completedChallenges.includes(challenge.id)) {
      state.completedChallenges.push(challenge.id)
      state.totalXp += challenge.xpReward
      state.dailyXpEarned += challenge.xpReward
      logXp('challenge', challenge.title, challenge.xpReward)
      emitEvent({ type: 'challenge_completed', challenge })
    }
  }
}

function checkTitles() {
  const newTitles = [...state.unlockedTitles]
  const completedLessons = Object.entries(state.lessonProgress).filter(([_, p]) => p.status === 'completed')
  const completedToday = getCompletedToday()

  for (const title of TITLES) {
    if (newTitles.includes(title.id)) continue

    let earned = false
    switch (title.condition) {
      case 'default':
        earned = true
        break
      case 'five_before_noon': {
        const beforeNoon = completedLessons.filter(([_, p]) => {
          if (!p.completedAt) return false
          const hour = new Date(p.completedAt).getHours()
          return hour < 12
        })
        // Check if at least 5 lessons have been completed before noon (across all days)
        earned = beforeNoon.length >= 5
        break
      }
      case 'five_in_day':
        earned = completedToday.length >= 5
        break
      case 'streak_14':
        earned = state.currentStreak >= 14
        break
      case 'streak_30':
        earned = state.currentStreak >= 30
        break
      case 'combo_5':
        earned = state.comboCount >= 5
        break
      case 'complete_tier1': {
        const tier = CURRICULUM.find(t => t.id === 'tier1')
        if (tier) earned = tier.lessons.every(l => state.lessonProgress[l.id]?.status === 'completed')
        break
      }
      case 'complete_tier2': {
        const tier = CURRICULUM.find(t => t.id === 'tier2')
        if (tier) earned = tier.lessons.every(l => state.lessonProgress[l.id]?.status === 'completed')
        break
      }
      case 'complete_tier3': {
        const tier = CURRICULUM.find(t => t.id === 'tier3')
        if (tier) earned = tier.lessons.every(l => state.lessonProgress[l.id]?.status === 'completed')
        break
      }
      case 'complete_tier4': {
        const tier = CURRICULUM.find(t => t.id === 'tier4')
        if (tier) earned = tier.lessons.every(l => state.lessonProgress[l.id]?.status === 'completed')
        break
      }
      case 'all_complete':
        earned = completedLessons.length === ALL_LESSONS.length
        break
      case 'seven_goals':
        earned = state.dailyGoalStreak >= 7
        break
      case 'thirty_challenges':
        earned = state.totalChallengesCompleted >= 30
        break
    }

    if (earned) {
      newTitles.push(title.id)
      emitEvent({ type: 'title_unlocked', title })
    }
  }

  state.unlockedTitles = newTitles
}

function resetWeeklyIfNeeded() {
  const weekId = getWeekId()
  if (state.weeklyProgressWeek !== weekId) {
    state.weeklyProgress = { lessonsCompleted: 0, activeDays: [], xpEarned: 0, challengesCompleted: 0, combosHit: 0, tiersCompleted: 0 }
    state.weeklyProgressWeek = weekId
    state.completedWeeklyChallenges = []
  }
}

function checkWeeklyChallenges() {
  resetWeeklyIfNeeded()
  const challenges = getWeeklyChallenges()

  for (const challenge of challenges) {
    if (challenge.completed) continue

    let met = false
    switch (challenge.condition) {
      case 'lessons_this_week': met = state.weeklyProgress.lessonsCompleted >= challenge.target; break
      case 'active_days_week': met = state.weeklyProgress.activeDays.length >= challenge.target; break
      case 'xp_this_week': met = state.weeklyProgress.xpEarned >= challenge.target; break
      case 'challenges_this_week': met = state.weeklyProgress.challengesCompleted >= challenge.target; break
      case 'combos_this_week': met = state.weeklyProgress.combosHit >= challenge.target; break
      case 'tier_complete_week': met = state.weeklyProgress.tiersCompleted >= challenge.target; break
    }

    if (met && !state.completedWeeklyChallenges.includes(challenge.id)) {
      state.completedWeeklyChallenges.push(challenge.id)
      state.totalXp += challenge.xpReward
      state.dailyXpEarned += challenge.xpReward
      logXp('challenge', challenge.title, challenge.xpReward, ['weekly'])
    }
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
  const prevLevel = getLevel()
  const prevActivityDate = state.lastActivityDate
  const prevStreak = state.currentStreak

  resetDailyIfNeeded()

  const now = Date.now()
  const comboActive = state.lastCompletionTime !== null && (now - state.lastCompletionTime) < COMBO_WINDOW_MS
  const newComboCount = comboActive ? state.comboCount + 1 : 1
  const comboBonusPercent = Math.min((newComboCount - 1) * 10, 50) / 100

  const { multiplier } = getStreakMultiplier()
  const xpEarned = Math.round(lesson.xp * multiplier * (1 + comboBonusPercent))

  // Critical hit: 10% chance for double XP
  const isCriticalHit = Math.random() < 0.1
  const finalXp = isCriticalHit ? xpEarned * 2 : xpEarned

  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayStr = yesterday.toISOString().split('T')[0]

  let newStreak = state.currentStreak
  if (prevActivityDate === todayStr) {
    // Already active today, streak unchanged
  } else if (prevActivityDate === yesterdayStr || state.currentStreak === 0) {
    newStreak = state.currentStreak + 1
  }
  const newLongest = Math.max(state.longestStreak, newStreak)

  state = {
    ...state,
    lessonProgress: {
      ...state.lessonProgress,
      [lessonId]: { status: 'completed', completedAt: new Date().toISOString(), xpEarned: finalXp },
    },
    totalXp: state.totalXp + finalXp,
    dailyXpEarned: state.dailyXpEarned + finalXp,
    dailyXpDate: todayStr,
    lastActivityDate: todayStr,
    currentStreak: newStreak,
    longestStreak: newLongest,
    comboCount: newComboCount,
    lastCompletionTime: now,
    streakDates: state.streakDates.includes(todayStr) ? state.streakDates : [...state.streakDates, todayStr],
  }

  // Emit critical hit event
  if (isCriticalHit) {
    emitEvent({ type: 'critical_hit', baseXp: xpEarned, totalXp: finalXp })
  }

  // First lesson of the day bonus
  const isFirstToday = prevActivityDate !== todayStr
  if (isFirstToday) {
    const bonus = 5
    state.totalXp += bonus
    state.dailyXpEarned += bonus
    logXp('bonus', 'First lesson of the day', bonus)
    emitEvent({ type: 'first_of_day', bonusXp: bonus })
  }

  if ([3, 7, 14, 30].includes(newStreak) && newStreak > prevStreak) {
    emitEvent({ type: 'streak_milestone', days: newStreak, multiplier })
  }

  const mults: string[] = []
  if (multiplier > 1) mults.push(`${multiplier}x streak`)
  if (comboBonusPercent > 0) mults.push(`${newComboCount}x combo`)
  if (isCriticalHit) mults.push('CRITICAL HIT!')
  logXp('lesson', lesson.title, finalXp, mults.length > 0 ? mults : undefined)

  // Track tool mastery
  const toolXpGain = Math.round(finalXp / lesson.tools.length)
  const newToolXp = { ...state.toolXp }
  for (const tool of lesson.tools) {
    newToolXp[tool] = (newToolXp[tool] || 0) + toolXpGain
  }
  state = { ...state, toolXp: newToolXp }

  checkAchievements()
  checkDailyChallenges()
  checkTitles()

  // Update weekly progress
  resetWeeklyIfNeeded()
  const wp = state.weeklyProgress
  const updatedActiveDays = wp.activeDays.includes(todayStr) ? wp.activeDays : [...wp.activeDays, todayStr]
  state.weeklyProgress = {
    ...wp,
    lessonsCompleted: wp.lessonsCompleted + 1,
    activeDays: updatedActiveDays,
    xpEarned: wp.xpEarned + finalXp,
    combosHit: newComboCount >= 5 && (state.comboCount < 5 || !comboActive) ? wp.combosHit + 1 : wp.combosHit,
  }
  checkWeeklyChallenges()

  // Track daily goal streak
  if (state.dailyXpEarned >= state.dailyXpGoal) {
    if (prevActivityDate === yesterdayStr || state.dailyGoalStreak === 0) {
      state.dailyGoalStreak = state.dailyGoalStreak + 1
    }
  }

  // Track total challenges completed
  state.totalChallengesCompleted = state.completedChallenges.length

  // Milestone detection (25%, 50%, 75%, 100%)
  const { percent } = getOverallProgress()
  const milestones = [25, 50, 75, 100]
  for (const m of milestones) {
    if (percent >= m && !state.milestonesHit.includes(m)) {
      state.milestonesHit = [...state.milestonesHit, m]
      const bonusXp = m === 100 ? 100 : m === 75 ? 50 : m === 50 ? 30 : 15
      state.totalXp += bonusXp
      logXp('bonus', `${m}% Course Milestone`, bonusXp)
      const labels: Record<number, string> = { 25: 'Quarter Complete!', 50: 'Halfway There!', 75: 'Almost Done!', 100: 'Course Complete!' }
      emitEvent({ type: 'milestone', percent: m, label: labels[m] })
    }
  }

  const newLevel = getLevel()
  if (newLevel.name !== prevLevel.name) {
    emitEvent({ type: 'level_up', from: prevLevel.name, to: newLevel.name })
  }

  persist()
  emit()
}

export function startLesson(lessonId: string) {
  if (state.lessonProgress[lessonId]?.status === 'completed') return
  state = {
    ...state,
    lessonProgress: { ...state.lessonProgress, [lessonId]: { status: 'in_progress', xpEarned: 0 } },
  }
  persist()
  emit()
}

function checkAchievements() {
  const completedLessons = Object.entries(state.lessonProgress).filter(([_, p]) => p.status === 'completed')
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
      case 'complete_tier1':
      case 'complete_tier2':
      case 'complete_tier3':
      case 'complete_tier4': {
        const tierId = achievement.condition.replace('complete_', '')
        const tier = CURRICULUM.find((t) => t.id === tierId)
        if (tier) earned = tier.lessons.every((l) => state.lessonProgress[l.id]?.status === 'completed')
        break
      }
      case 'half_complete':
        earned = completedCount >= Math.floor(ALL_LESSONS.length / 2)
        break
      case 'all_complete':
        earned = completedCount === ALL_LESSONS.length
        break
      case 'three_in_day': {
        const todayCompletions = getCompletedToday()
        earned = todayCompletions.length >= 3
        break
      }
    }

    if (earned) {
      newAchievements.push(achievement.id)
      state.totalXp += achievement.xpReward
      state.dailyXpEarned += achievement.xpReward
      logXp('achievement', achievement.name, achievement.xpReward)
      emitEvent({ type: 'achievement_unlocked', achievement })
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
  if (!tier) return { completed: 0, total: 0, percent: 0, earnedXp: 0, totalXp: 0 }
  const completed = tier.lessons.filter((l) => state.lessonProgress[l.id]?.status === 'completed').length
  const earnedXp = tier.lessons.reduce((sum, l) => state.lessonProgress[l.id]?.status === 'completed' ? sum + l.xp : sum, 0)
  const totalXp = tier.lessons.reduce((sum, l) => sum + l.xp, 0)
  return { completed, total: tier.lessons.length, percent: Math.round((completed / tier.lessons.length) * 100), earnedXp, totalXp }
}

export function getOverallProgress() {
  const completed = Object.values(state.lessonProgress).filter((p) => p.status === 'completed').length
  return { completed, total: ALL_LESSONS.length, percent: Math.round((completed / ALL_LESSONS.length) * 100) }
}

export function setDailyXpGoal(goal: number) {
  state = { ...state, dailyXpGoal: Math.max(10, Math.min(200, goal)) }
  persist()
  emit()
}

export function resetProgress() {
  state = defaultState
  xpLog = []
  persist()
  emit()
}

export function getToolMastery(): { tool: string; xp: number; level: string }[] {
  const levels = [
    { min: 200, name: 'Expert' },
    { min: 100, name: 'Proficient' },
    { min: 50, name: 'Intermediate' },
    { min: 0, name: 'Beginner' },
  ]
  return Object.entries(state.toolXp)
    .map(([tool, xp]) => ({
      tool,
      xp,
      level: levels.find(l => xp >= l.min)?.name || 'Beginner',
    }))
    .sort((a, b) => b.xp - a.xp)
}

export function useProgress(): ProgressState {
  return useSyncExternalStore(
    (cb) => { listeners.add(cb); return () => listeners.delete(cb) },
    () => state,
    () => defaultState,
  )
}
