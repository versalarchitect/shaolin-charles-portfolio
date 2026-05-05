import { supabase } from '@/lib/supabase'
import { XP_LEVELS } from '@/data/curriculum'

export interface ActivityEvent {
  id: string
  event_type: string
  payload: Record<string, unknown>
  created_at: string
}

export interface PublicProfileData {
  user_id: string
  display_name: string
  avatar_url: string
  total_xp: number
  current_streak: number
  active_title: string
  unlocked_achievements: string[]
  rank: string
}

function getRankFromXp(xp: number): string {
  for (let i = XP_LEVELS.length - 1; i >= 0; i--) {
    if (xp >= XP_LEVELS[i].minXp) return XP_LEVELS[i].name
  }
  return XP_LEVELS[0].name
}

export async function fetchActivityFeed(userId: string, limit = 10): Promise<ActivityEvent[]> {
  const { data, error } = await supabase
    .from('activity_feed')
    .select('id, event_type, payload, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Failed to fetch activity feed:', error)
    return []
  }

  return (data ?? []) as ActivityEvent[]
}

export async function fetchPublicProfile(userId: string): Promise<PublicProfileData | null> {
  const { data, error } = await supabase
    .from('user_progress')
    .select('user_id, display_name, avatar_url, total_xp, current_streak, state')
    .eq('user_id', userId)
    .single()

  if (error || !data) {
    return null
  }

  const state = (data.state ?? {}) as Record<string, unknown>

  return {
    user_id: data.user_id,
    display_name: (data.display_name as string) || 'Anonymous Learner',
    avatar_url: (data.avatar_url as string) || '',
    total_xp: (data.total_xp as number) || 0,
    current_streak: (data.current_streak as number) || 0,
    active_title: (state.activeTitle as string) || 'newcomer',
    unlocked_achievements: (state.unlockedAchievements as string[]) || [],
    rank: getRankFromXp((data.total_xp as number) || 0),
  }
}
