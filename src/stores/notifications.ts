import { useSyncExternalStore } from 'react'
import {
  fetchNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  subscribeToNotifications,
} from '@/lib/chat-mentions'
import type { ChatNotification } from '@/lib/chat-mentions'
import { supabase } from '@/lib/supabase'

const STORAGE_KEY = 'gamification-notifications'
const MAX_NOTIFICATIONS = 50

export interface Notification {
  id: string
  type: 'achievement' | 'level_up' | 'streak' | 'challenge' | 'explorer' | 'system' | 'mention'
  title: string
  description: string
  icon?: string
  timestamp: number
  read: boolean
  channelId?: string
  channelName?: string
  messageId?: string
  senderId?: string
  supabaseId?: string
}

let notifications: Notification[] = []
const listeners = new Set<() => void>()

function emit() {
  for (const listener of listeners) listener()
}

function persist() {
  try {
    const local = notifications.filter((n) => n.type !== 'mention')
    localStorage.setItem(STORAGE_KEY, JSON.stringify(local))
  } catch {}
}

function load(): Notification[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as Notification[]
  } catch {}
  return []
}

function init() {
  notifications = load()
}

export function addNotification(n: Omit<Notification, 'id' | 'timestamp' | 'read'>) {
  const notification: Notification = {
    ...n,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    timestamp: Date.now(),
    read: false,
  }
  notifications = [notification, ...notifications].slice(0, MAX_NOTIFICATIONS)
  persist()
  emit()
  if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('notification-added'))
}

function addMentionNotification(cn: ChatNotification) {
  if (notifications.some((n) => n.supabaseId === cn.id)) return
  const notification: Notification = {
    id: `mention-${cn.id}`,
    type: 'mention',
    title: `@${cn.sender_name} mentioned you in #${cn.channel_name}`,
    description: cn.message_preview,
    icon: '@',
    timestamp: new Date(cn.created_at).getTime(),
    read: cn.read,
    channelId: cn.channel_id,
    channelName: cn.channel_name,
    messageId: cn.message_id,
    senderId: cn.sender_id,
    supabaseId: cn.id,
  }
  notifications = [notification, ...notifications.filter((n) => n.supabaseId !== cn.id)].slice(0, MAX_NOTIFICATIONS)
  emit()
  if (!cn.read && typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('notification-added'))
  }
}

export function markRead(id: string) {
  const n = notifications.find((n) => n.id === id)
  notifications = notifications.map((n) =>
    n.id === id ? { ...n, read: true } : n
  )
  persist()
  emit()
  if (n?.supabaseId) {
    markNotificationRead(n.supabaseId).catch(() => {})
  }
}

export function markAllRead() {
  const hasMentions = notifications.some((n) => !n.read && n.type === 'mention')

  notifications = notifications.map((n) => ({ ...n, read: true }))
  persist()
  emit()

  if (hasMentions) {
    markAllNotificationsRead().catch(() => {})
  }
}

export function getUnreadCount(): number {
  return notifications.filter((n) => !n.read).length
}

export function getNotifications(): Notification[] {
  return notifications
}

export function initServerNotifications(userId: string): () => void {
  fetchNotifications(userId).then((rows) => {
    for (const row of rows) {
      addMentionNotification(row)
    }
    notifications.sort((a, b) => b.timestamp - a.timestamp)
    emit()
  }).catch(() => {})

  const channel = subscribeToNotifications(userId, (cn) => {
    addMentionNotification(cn)
  })

  return () => {
    supabase.removeChannel(channel)
  }
}

if (typeof window !== 'undefined') init()

export function useNotifications(): { notifications: Notification[]; unreadCount: number } {
  const state = useSyncExternalStore(
    (cb) => {
      listeners.add(cb)
      return () => listeners.delete(cb)
    },
    () => notifications,
    () => [] as Notification[],
  )
  return {
    notifications: state,
    unreadCount: state.filter((n) => !n.read).length,
  }
}
