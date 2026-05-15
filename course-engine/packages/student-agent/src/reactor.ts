import type { SupabaseClient } from '@supabase/supabase-js';
import { PERSONAS, isSimulatedUser } from './personas.js';
import type { AgentState } from './state.js';
import { pickTemplate, renderTemplate, trackTemplate } from './message-builder.js';
import { postChatMessage } from './chat-writer.js';

const RESPONSE_CHANCE = 0.15
const CELEBRATE_CHANCE = 0.20
const COOLDOWN_MS = 5 * 60 * 1000
const MIN_DELAY_MS = 30_000
const MAX_DELAY_MS = 120_000

function randomDelay(): number {
  return MIN_DELAY_MS + Math.random() * (MAX_DELAY_MS - MIN_DELAY_MS)
}

function pickAvailablePersona(
  state: AgentState,
  channelName?: string,
): { persona: typeof PERSONAS[number]; userId: string } | null {
  const now = Date.now()
  const candidates = PERSONAS.filter((p) => {
    const ps = state.personas[p.id]
    const userId = state.personaUserIds[p.id]
    if (!ps || !userId) return false
    if (now - ps.lastMessageTime < COOLDOWN_MS) return false
    if (channelName && !p.channelPreferences.includes(channelName)) return false
    return true
  })

  if (candidates.length === 0) return null
  const persona = candidates[Math.floor(Math.random() * candidates.length)]
  return { persona, userId: state.personaUserIds[persona.id] }
}

function channelNameFromId(state: AgentState, channelId: string): string | undefined {
  return Object.entries(state.channelIds).find(([, id]) => id === channelId)?.[0]
}

export function startReactiveListeners(
  db: SupabaseClient,
  state: AgentState,
  dryRun: boolean,
): { cleanup: () => void } {
  const chatChannel = db
    .channel(`student-agent-chat:${Date.now()}`)
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'chat_messages' },
      (payload) => {
        const msg = payload.new as { author_id: string; channel_id: string; content: string }
        if (isSimulatedUser(msg.author_id, state.personaUserIds)) return
        if (Math.random() > RESPONSE_CHANCE) return

        const channelName = channelNameFromId(state, msg.channel_id)
        const pick = pickAvailablePersona(state, channelName)
        if (!pick) return

        const ps = state.personas[pick.persona.id]
        const template = pickTemplate('reaction', ps.recentTemplateIds, channelName)
        if (!template) return

        const content = renderTemplate(template, {})
        const delay = randomDelay()

        setTimeout(async () => {
          await postChatMessage(db, msg.channel_id, pick.persona, pick.userId, content, dryRun)
          ps.recentTemplateIds = trackTemplate(ps.recentTemplateIds, template.id)
          ps.lastMessageTime = Date.now()
        }, delay)
      },
    )
    .subscribe()

  const activityChannel = db
    .channel(`student-agent-activity:${Date.now()}`)
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'activity_feed' },
      (payload) => {
        const event = payload.new as { user_id: string; event_type: string }
        if (isSimulatedUser(event.user_id, state.personaUserIds)) return
        if (Math.random() > CELEBRATE_CHANCE) return

        const pick = pickAvailablePersona(state, 'general')
        if (!pick) return

        const ps = state.personas[pick.persona.id]
        const template = pickTemplate('celebrate_other', ps.recentTemplateIds)
        if (!template) return

        const generalId = state.channelIds['general']
        if (!generalId) return

        const content = renderTemplate(template, {})
        const delay = randomDelay()

        setTimeout(async () => {
          await postChatMessage(db, generalId, pick.persona, pick.userId, content, dryRun)
          ps.recentTemplateIds = trackTemplate(ps.recentTemplateIds, template.id)
          ps.lastMessageTime = Date.now()
        }, delay)
      },
    )
    .subscribe()

  return {
    cleanup() {
      db.removeChannel(chatChannel)
      db.removeChannel(activityChannel)
    },
  }
}
