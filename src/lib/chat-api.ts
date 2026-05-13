import { supabase } from './supabase'

export interface ChatChannel {
  id: string
  name: string
  description: string | null
  is_default: boolean
  created_at: string
}

export interface ChatMessage {
  id: string
  channel_id: string
  content: string
  author_id: string | null
  author_name: string
  author_initial: string
  author_tier: string
  created_at: string
}

export async function fetchChannels(): Promise<ChatChannel[]> {
  const { data, error } = await supabase
    .from('chat_channels')
    .select('*')
    .order('is_default', { ascending: false })
    .order('name', { ascending: true })

  if (error) throw error
  return data || []
}

export async function fetchMessages(
  channelId: string,
  limit = 100,
): Promise<ChatMessage[]> {
  const { data, error } = await supabase
    .from('chat_messages')
    .select('*')
    .eq('channel_id', channelId)
    .order('created_at', { ascending: true })
    .limit(limit)

  if (error) throw error
  return data || []
}

export async function sendMessage(
  channelId: string,
  content: string,
  user: { id: string; name: string; initial: string; tier: string },
): Promise<ChatMessage> {
  const { data, error } = await supabase
    .from('chat_messages')
    .insert({
      channel_id: channelId,
      content,
      author_id: user.id,
      author_name: user.name,
      author_initial: user.initial,
      author_tier: user.tier,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export function subscribeToMessages(
  channelId: string,
  callback: (message: ChatMessage) => void,
) {
  return supabase
    .channel(`chat:${channelId}:${Date.now()}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'chat_messages',
        filter: `channel_id=eq.${channelId}`,
      },
      (payload) => callback(payload.new as ChatMessage),
    )
    .subscribe()
}
