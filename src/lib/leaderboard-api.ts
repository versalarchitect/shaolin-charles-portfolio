import { supabase } from '@/lib/supabase'

export interface LeaderboardEntry {
  user_id: string
  display_name: string
  avatar_url: string
  total_xp: number
  current_streak: number
  rank: number
}

function getISOWeek(): string {
  const now = new Date()
  const jan4 = new Date(now.getFullYear(), 0, 4)
  const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 1).getTime()) / 86400000) + 1
  const weekNumber = Math.ceil((dayOfYear + jan4.getDay() - 1) / 7)
  return `${now.getFullYear()}-W${String(weekNumber).padStart(2, '0')}`
}

export async function fetchGlobalLeaderboard(limit = 10): Promise<LeaderboardEntry[]> {
  const { data, error } = await supabase.rpc('get_leaderboard', {
    limit_count: limit,
  })

  if (error) {
    console.error('Failed to fetch global leaderboard:', error)
    return []
  }

  return data ?? []
}

export async function fetchWeeklyLeaderboard(limit = 10): Promise<LeaderboardEntry[]> {
  const { data, error } = await supabase.rpc('get_weekly_leaderboard', {
    target_week: getISOWeek(),
    limit_count: limit,
  })

  if (error) {
    console.error('Failed to fetch weekly leaderboard:', error)
    return []
  }

  return data ?? []
}

export async function fetchUserRank(userId: string): Promise<number> {
  const { data, error } = await supabase.rpc('get_user_rank', {
    target_user_id: userId,
  })

  if (error) {
    console.error('Failed to fetch user rank:', error)
    return 0
  }

  return data ?? 0
}
