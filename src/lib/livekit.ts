import { supabase } from './supabase'

export const LIVEKIT_URL = import.meta.env.VITE_LIVEKIT_URL as string | undefined

export function isLiveKitConfigured(): boolean {
  return !!LIVEKIT_URL && LIVEKIT_URL.startsWith('wss://')
}

export function buildRoomName(userId: string, context: string): string {
  return `tutor-${userId}-${context}`
}

export async function fetchLiveKitToken(
  roomName: string,
  identity: string,
  metadata?: string,
): Promise<string> {
  const { data, error } = await supabase.functions.invoke('livekit-token', {
    body: { roomName, identity, metadata },
  })

  if (error) throw new Error(`Token fetch failed: ${error.message}`)
  if (!data?.token) throw new Error('No token in response')

  return data.token as string
}
