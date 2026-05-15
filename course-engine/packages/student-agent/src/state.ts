import type { SupabaseClient } from '@supabase/supabase-js';
import { PERSONAS } from './personas.js';

export interface PersonaState {
  currentLessonIndex: number
  completedLessons: string[]
  totalXp: number
  currentStreak: number
  longestStreak: number
  lastActivityDate: string | null
  lastMessageTime: number
  recentTemplateIds: string[]
}

export interface AgentState {
  personas: Record<string, PersonaState>
  personaUserIds: Record<string, string>
  channelIds: Record<string, string>
}

function createDefaultPersonaState(): PersonaState {
  return {
    currentLessonIndex: 0,
    completedLessons: [],
    totalXp: 0,
    currentStreak: 0,
    longestStreak: 0,
    lastActivityDate: null,
    lastMessageTime: 0,
    recentTemplateIds: [],
  }
}

export function createDefaultState(): AgentState {
  const personas: Record<string, PersonaState> = {}
  for (const p of PERSONAS) {
    personas[p.id] = createDefaultPersonaState()
  }
  return { personas, personaUserIds: {}, channelIds: {} }
}

export async function loadState(db: SupabaseClient): Promise<AgentState> {
  const { data } = await db
    .from('student_agent_state')
    .select('state')
    .eq('id', 'singleton')
    .single()

  if (data?.state && typeof data.state === 'object' && 'personas' in data.state) {
    const loaded = data.state as AgentState
    const merged = createDefaultState()
    merged.personaUserIds = loaded.personaUserIds || {}
    merged.channelIds = loaded.channelIds || {}
    for (const p of PERSONAS) {
      merged.personas[p.id] = loaded.personas?.[p.id] || createDefaultPersonaState()
    }
    return merged
  }

  return createDefaultState()
}

export async function saveState(db: SupabaseClient, state: AgentState): Promise<void> {
  await db
    .from('student_agent_state')
    .upsert({ id: 'singleton', state, updated_at: new Date().toISOString() })
}

export async function loadChannelIds(db: SupabaseClient, state: AgentState): Promise<void> {
  const { data } = await db.from('chat_channels').select('id, name')
  if (data) {
    for (const ch of data) {
      state.channelIds[ch.name] = ch.id
    }
  }
}
