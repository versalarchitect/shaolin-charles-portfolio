import type { SupabaseClient } from '@supabase/supabase-js';
import type { SimPersona } from './personas.js';

export async function postChatMessage(
  db: SupabaseClient,
  channelId: string,
  persona: SimPersona,
  userId: string,
  content: string,
  dryRun = false,
): Promise<void> {
  if (dryRun) {
    console.log(`[DRY RUN] ${persona.name} → #${channelId}: ${content}`)
    return
  }

  const { error } = await db.from('chat_messages').insert({
    channel_id: channelId,
    content,
    author_id: userId,
    author_name: persona.name,
    author_initial: persona.initial,
    author_tier: persona.tier,
  })

  if (error) {
    console.error(`Failed to post message for ${persona.name}:`, error.message)
  } else {
    console.log(`💬 ${persona.name}: ${content.slice(0, 60)}...`)
  }
}
