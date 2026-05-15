import { supabase } from './supabase'
import { ALL_LESSONS, CURRICULUM } from '@/data/curriculum'

export interface MentionUser {
  user_id: string
  display_name: string
  avatar_url: string
}

export interface MentionLesson {
  id: string
  number: string
  title: string
  tierName: string
}

export interface ChatNotification {
  id: string
  user_id: string
  sender_id: string
  sender_name: string
  message_id: string
  channel_id: string
  channel_name: string
  message_preview: string
  read: boolean
  created_at: string
}

const USER_MENTION_RE = /@\[([^\]]+)\]\(([^)]+)\)/g
const LESSON_TAG_RE = /#\[([^\]]+)\]\(([^)]+)\)/g

const tierNameByLessonId = new Map<string, string>()
for (const tier of CURRICULUM) {
  for (const lesson of tier.lessons) {
    tierNameByLessonId.set(lesson.id, tier.name)
  }
}

export async function searchUsers(query: string, limit = 8): Promise<MentionUser[]> {
  if (!query.trim()) return []
  const { data } = await supabase
    .from('user_progress')
    .select('user_id, display_name, avatar_url')
    .ilike('display_name', `%${query}%`)
    .limit(limit)
  return (data as MentionUser[] | null) || []
}

export function searchLessons(query: string): MentionLesson[] {
  if (!query.trim()) return ALL_LESSONS.slice(0, 8).map(toLessonResult)
  const q = query.toLowerCase()
  return ALL_LESSONS
    .filter((l) => l.title.toLowerCase().includes(q) || l.number.toLowerCase().includes(q))
    .slice(0, 8)
    .map(toLessonResult)
}

function toLessonResult(l: { id: string; number: string; title: string }): MentionLesson {
  return { id: l.id, number: l.number, title: l.title, tierName: tierNameByLessonId.get(l.id) || '' }
}

export function formatUserMention(user: MentionUser): string {
  return `@[${user.display_name}](${user.user_id})`
}

export function formatLessonTag(lesson: MentionLesson): string {
  return `#[${lesson.number} ${lesson.title}](${lesson.id})`
}

export function parseMentionedUserIds(content: string): string[] {
  const ids = new Set<string>()
  let m: RegExpExecArray | null
  const re = new RegExp(USER_MENTION_RE.source, 'g')
  while ((m = re.exec(content)) !== null) {
    ids.add(m[2])
  }
  return [...ids]
}

function stripMentionSyntax(text: string): string {
  return text
    .replace(/@\[([^\]]+)\]\([^)]+\)/g, '@$1')
    .replace(/#\[([^\]]+)\]\([^)]+\)/g, '#$1')
}

export async function createMentionNotifications(params: {
  messageId: string
  channelId: string
  channelName: string
  senderId: string
  senderName: string
  content: string
}): Promise<void> {
  const userIds = parseMentionedUserIds(params.content)
  const recipients = userIds.filter((id) => id !== params.senderId)
  if (recipients.length === 0) return

  const preview = stripMentionSyntax(params.content).slice(0, 80)

  const rows = recipients.map((uid) => ({
    user_id: uid,
    sender_id: params.senderId,
    sender_name: params.senderName,
    message_id: params.messageId,
    channel_id: params.channelId,
    channel_name: params.channelName,
    message_preview: preview,
  }))

  await supabase.from('chat_notifications').insert(rows)
}

export async function fetchNotifications(userId: string): Promise<ChatNotification[]> {
  const { data } = await supabase
    .from('chat_notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(30)
  return (data as ChatNotification[] | null) || []
}

export async function markNotificationRead(id: string): Promise<void> {
  await supabase.from('chat_notifications').update({ read: true }).eq('id', id)
}

export async function markAllNotificationsRead(): Promise<void> {
  await supabase
    .from('chat_notifications')
    .update({ read: true })
    .eq('read', false)
}

export function subscribeToNotifications(
  userId: string,
  callback: (notification: ChatNotification) => void,
) {
  return supabase
    .channel(`chat-notif:${userId}:${Date.now()}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'chat_notifications',
        filter: `user_id=eq.${userId}`,
      },
      (payload) => callback(payload.new as ChatNotification),
    )
    .subscribe()
}
