import { supabase } from '@/lib/supabase'

export interface GlobalStats {
  totalUsers: number
  averageXp: number
  averageStreak: number
  topXp: number
  topStreak: number
}

export async function fetchGlobalStats(): Promise<GlobalStats> {
  const { count, error: countError } = await supabase
    .from('user_progress')
    .select('*', { count: 'exact', head: true })

  if (countError) {
    console.error('Failed to fetch user count:', countError)
    return { totalUsers: 0, averageXp: 0, averageStreak: 0, topXp: 0, topStreak: 0 }
  }

  const totalUsers = count ?? 0

  if (totalUsers === 0) {
    return { totalUsers: 0, averageXp: 0, averageStreak: 0, topXp: 0, topStreak: 0 }
  }

  // Fetch all rows for aggregate computation (Supabase JS client doesn't support SQL aggregates directly)
  const { data, error } = await supabase
    .from('user_progress')
    .select('total_xp, current_streak')

  if (error || !data) {
    console.error('Failed to fetch global stats:', error)
    return { totalUsers, averageXp: 0, averageStreak: 0, topXp: 0, topStreak: 0 }
  }

  let sumXp = 0
  let sumStreak = 0
  let topXp = 0
  let topStreak = 0

  for (const row of data) {
    const xp = (row.total_xp as number) || 0
    const streak = (row.current_streak as number) || 0
    sumXp += xp
    sumStreak += streak
    if (xp > topXp) topXp = xp
    if (streak > topStreak) topStreak = streak
  }

  return {
    totalUsers,
    averageXp: Math.round(sumXp / totalUsers),
    averageStreak: Math.round((sumStreak / totalUsers) * 10) / 10,
    topXp,
    topStreak,
  }
}

export async function fetchUserPercentile(userId: string): Promise<number> {
  // Count how many users have less XP than this user
  const { data: userData, error: userError } = await supabase
    .from('user_progress')
    .select('total_xp')
    .eq('user_id', userId)
    .single()

  if (userError || !userData) return 0

  const userXp = (userData.total_xp as number) || 0

  const { count: belowCount, error: belowError } = await supabase
    .from('user_progress')
    .select('*', { count: 'exact', head: true })
    .lt('total_xp', userXp)

  if (belowError) return 0

  const { count: totalCount, error: totalError } = await supabase
    .from('user_progress')
    .select('*', { count: 'exact', head: true })

  if (totalError || !totalCount) return 0

  // Percentile = percentage of users you're above
  const percentile = Math.round(((belowCount ?? 0) / totalCount) * 100)
  return percentile
}
