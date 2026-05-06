import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, Check } from 'lucide-react'
import { useNotifications, markRead, markAllRead, addNotification } from '@/stores/notifications'
import { onProgressEvent } from '@/stores/progress'
import type { ProgressEvent } from '@/stores/progress'

function relativeTime(timestamp: number): string {
  const diff = Date.now() - timestamp
  const seconds = Math.floor(diff / 1000)
  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

function getDefaultIcon(type: string): string {
  switch (type) {
    case 'achievement': return '\u{1F3C6}'
    case 'level_up': return '\u{2B06}\u{FE0F}'
    case 'streak': return '\u{1F525}'
    case 'challenge': return '\u{1F3AF}'
    case 'explorer': return '\u{1F9ED}'
    case 'system': return '\u{1F514}'
    default: return '\u{1F514}'
  }
}

export function NotificationCenter() {
  const [open, setOpen] = useState(false)
  const [bounce, setBounce] = useState(false)
  const { notifications, unreadCount } = useNotifications()
  const panelRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  // Listen to progress events and create notifications
  useEffect(() => {
    const unsub = onProgressEvent((event: ProgressEvent) => {
      switch (event.type) {
        case 'achievement_unlocked':
          addNotification({
            type: 'achievement',
            title: `Achievement: ${event.achievement.name}`,
            description: event.achievement.description || `+${event.achievement.xpReward} XP`,
            icon: event.achievement.icon,
          })
          break
        case 'level_up':
          addNotification({
            type: 'level_up',
            title: `Level Up!`,
            description: `${event.from} → ${event.to}`,
            icon: '\u{2B06}\u{FE0F}',
          })
          break
        case 'streak_milestone':
          addNotification({
            type: 'streak',
            title: `${event.days}-Day Streak!`,
            description: `${event.multiplier}x XP multiplier active`,
            icon: '\u{1F525}',
          })
          break
        case 'challenge_completed':
          addNotification({
            type: 'challenge',
            title: `Challenge: ${event.challenge.title}`,
            description: `+${event.challenge.xpReward} XP earned`,
            icon: '\u{1F3AF}',
          })
          break
      }
    })
    return unsub
  }, [])

  // Bounce animation on new notification
  useEffect(() => {
    function handleNew() {
      setBounce(true)
      setTimeout(() => setBounce(false), 600)
    }
    window.addEventListener('notification-added', handleNew)
    return () => window.removeEventListener('notification-added', handleNew)
  }, [])

  // Close on click outside or Escape
  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (
      panelRef.current &&
      !panelRef.current.contains(e.target as Node) &&
      buttonRef.current &&
      !buttonRef.current.contains(e.target as Node)
    ) {
      setOpen(false)
    }
  }, [])

  const handleEscape = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') setOpen(false)
  }, [])

  useEffect(() => {
    if (open) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleEscape)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [open, handleClickOutside, handleEscape])

  return (
    <div className="relative">
      {/* Bell button */}
      <motion.button
        ref={buttonRef}
        onClick={() => setOpen(!open)}
        animate={bounce ? { rotate: [0, -12, 12, -8, 8, 0] } : { rotate: 0 }}
        transition={{ duration: 0.5 }}
        className="relative p-2 rounded-lg text-foreground/50 hover:text-foreground/80 hover:bg-foreground/5 transition-colors"
        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
        aria-expanded={open}
        aria-haspopup="dialog"
      >
        <Bell className="w-4 h-4" />
        {/* Unread badge */}
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex items-center justify-center min-w-[14px] h-[14px] rounded-full bg-foreground text-background text-[9px] font-mono font-bold leading-none px-0.5">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </motion.button>

      {/* Dropdown panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            ref={panelRef}
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
            role="dialog"
            aria-label="Notifications"
            className="absolute bottom-full left-0 mb-2 w-72 rounded-xl border border-foreground/[0.08] bg-background shadow-lg overflow-hidden z-50"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-foreground/[0.06]">
              <span className="text-sm font-mono font-semibold text-foreground/80">Notifications</span>
              {unreadCount > 0 && (
                <button
                  onClick={() => markAllRead()}
                  className="flex items-center gap-1 text-[10px] font-mono text-foreground/40 hover:text-foreground/70 transition-colors"
                >
                  <Check className="w-3 h-3" />
                  Mark all read
                </button>
              )}
            </div>

            {/* Notification list */}
            <ul role="list" aria-label="Notification list" className="max-h-[400px] overflow-y-auto">
              {notifications.length === 0 ? (
                <li className="px-4 py-8 text-center list-none">
                  <Bell className="w-8 h-8 text-foreground/10 mx-auto mb-2" aria-hidden="true" />
                  <p className="text-xs font-mono text-foreground/30">No notifications yet</p>
                </li>
              ) : (
                notifications.map((n) => (
                  <li key={n.id} role="listitem" className="list-none">
                    <button
                      onClick={() => { if (!n.read) markRead(n.id) }}
                      aria-label={`${n.read ? '' : 'Unread: '}${n.title}. ${n.description}. ${relativeTime(n.timestamp)}`}
                      className={`w-full text-left px-4 py-3 flex items-start gap-3 hover:bg-foreground/[0.03] transition-colors ${
                        !n.read ? 'border-l-2 border-foreground/30' : 'border-l-2 border-transparent opacity-60'
                      }`}
                    >
                      <span className="text-base leading-none mt-0.5 shrink-0" aria-hidden="true">
                        {n.icon || getDefaultIcon(n.type)}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-foreground/80 truncate">{n.title}</p>
                        <p className="text-[10px] text-foreground/50 truncate mt-0.5">{n.description}</p>
                        <p className="text-[9px] font-mono text-foreground/30 mt-1">{relativeTime(n.timestamp)}</p>
                      </div>
                      {!n.read && (
                        <span className="w-1.5 h-1.5 rounded-full bg-foreground/40 shrink-0 mt-1.5" aria-hidden="true" />
                      )}
                    </button>
                  </li>
                ))
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
