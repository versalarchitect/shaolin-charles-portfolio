import type { SupabaseClient } from '@supabase/supabase-js';
import { PERSONAS } from './personas.js';
import { loadState, saveState } from './state.js';

export async function seedPersonas(db: SupabaseClient, dryRun = false): Promise<void> {
  console.log('🌱 Seeding simulated student personas...\n')

  const state = await loadState(db)

  for (const persona of PERSONAS) {
    // Check if already seeded
    if (state.personaUserIds[persona.id]) {
      console.log(`  ✓ ${persona.name} already exists (${state.personaUserIds[persona.id]})`)
      continue
    }

    if (dryRun) {
      console.log(`  [DRY RUN] Would create auth user: ${persona.email}`)
      continue
    }

    // Create auth user via admin API
    const { data, error } = await db.auth.admin.createUser({
      email: persona.email,
      password: crypto.randomUUID(),
      email_confirm: true,
      user_metadata: {
        display_name: persona.name,
        avatar_url: persona.avatarUrl,
        is_simulated: true,
      },
    })

    if (error) {
      // User might already exist
      if (error.message.includes('already been registered')) {
        const { data: listData } = await db.auth.admin.listUsers()
        const existing = listData?.users?.find((u) => u.email === persona.email)
        if (existing) {
          state.personaUserIds[persona.id] = existing.id
          console.log(`  ✓ ${persona.name} found existing (${existing.id})`)
          continue
        }
      }
      console.error(`  ✗ Failed to create ${persona.name}: ${error.message}`)
      continue
    }

    const userId = data.user.id
    state.personaUserIds[persona.id] = userId

    // Insert initial user_progress row
    await db.from('user_progress').upsert({
      user_id: userId,
      display_name: persona.name,
      avatar_url: persona.avatarUrl,
      state: {
        lessonProgress: {},
        stepResults: {},
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
      },
      updated_at: new Date().toISOString(),
    })

    console.log(`  ✓ ${persona.name} created (${userId})`)
  }

  if (!dryRun) {
    await saveState(db, state)
    console.log('\n✅ Seed complete. Persona IDs saved to agent state.')
  }
}
