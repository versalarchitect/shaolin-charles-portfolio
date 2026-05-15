import type { SupabaseClient } from '@supabase/supabase-js';
import type { SimPersona } from './personas.js';
import type { PersonaState } from './state.js';
import type { LessonData } from './curriculum-data.js';

interface ProgressStateJson {
  lessonProgress: Record<string, { status: string; completedAt?: string; xpEarned: number }>
  stepResults: Record<string, never>
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

function buildProgressState(ps: PersonaState, allLessons: LessonData[]): ProgressStateJson {
  const lessonProgress: ProgressStateJson['lessonProgress'] = {}
  for (const lessonId of ps.completedLessons) {
    const lesson = allLessons.find((l) => l.id === lessonId)
    lessonProgress[lessonId] = {
      status: 'completed',
      completedAt: new Date().toISOString(),
      xpEarned: lesson?.xp || 0,
    }
  }

  return {
    lessonProgress,
    stepResults: {},
    totalXp: ps.totalXp,
    currentStreak: ps.currentStreak,
    longestStreak: ps.longestStreak,
    lastActivityDate: ps.lastActivityDate,
    unlockedAchievements: deriveAchievements(ps),
    streakDates: ps.lastActivityDate ? [ps.lastActivityDate] : [],
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
}

function deriveAchievements(ps: PersonaState): string[] {
  const a: string[] = []
  if (ps.completedLessons.length >= 1) a.push('first-lesson')
  if (ps.currentStreak >= 3) a.push('streak-3')
  if (ps.currentStreak >= 7) a.push('streak-7')
  if (ps.completedLessons.length >= 26) a.push('half-way')
  return a
}

export async function upsertProgress(
  db: SupabaseClient,
  persona: SimPersona,
  userId: string,
  ps: PersonaState,
  allLessons: LessonData[],
  dryRun = false,
): Promise<void> {
  const state = buildProgressState(ps, allLessons)

  if (dryRun) {
    console.log(`[DRY RUN] Update progress for ${persona.name}: ${ps.totalXp}xp, ${ps.completedLessons.length} lessons`)
    return
  }

  const { error } = await db.from('user_progress').upsert({
    user_id: userId,
    display_name: persona.name,
    avatar_url: persona.avatarUrl,
    state,
    updated_at: new Date().toISOString(),
  })

  if (error) {
    console.error(`Failed to update progress for ${persona.name}:`, error.message)
  }
}
