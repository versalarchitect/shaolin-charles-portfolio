import { useSyncExternalStore } from 'react'

const STORAGE_KEY = 'gamification-notifications'
const MAX_NOTIFICATIONS = 50

export interface Notification {
  id: string
  type: 'achievement' | 'level_up' | 'streak' | 'challenge' | 'explorer' | 'system'
  title: string
  description: string
  icon?: string
  timestamp: number
  read: boolean
}

let notifications: Notification[] = []
const listeners = new Set<() => void>()

function emit() {
  for (const listener of listeners) listener()
}

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications))
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
  // Dispatch custom event so the bell can animate
  if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('notification-added'))
}

export function markRead(id: string) {
  notifications = notifications.map((n) =>
    n.id === id ? { ...n, read: true } : n
  )
  persist()
  emit()
}

export function markAllRead() {
  notifications = notifications.map((n) => ({ ...n, read: true }))
  persist()
  emit()
}

export function getUnreadCount(): number {
  return notifications.filter((n) => !n.read).length
}

export function getNotifications(): Notification[] {
  return notifications
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
