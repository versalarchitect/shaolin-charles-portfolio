import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  Hash,
  Send,
  ChevronDown,
  Users,
  Smile,
  Menu,
  X,
  Bookmark,
  CornerDownRight,
  SmilePlus,
  Megaphone,
  HelpCircle,
  Rocket,
  Coffee,
  MessageCircle,
} from 'lucide-react'
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useAuth } from '@/hooks/use-auth'
import { useTheme } from '@/components/theme-provider'
import {
  fetchChannels,
  fetchMessages,
  sendMessage,
  subscribeToMessages,
} from '@/lib/chat-api'
import type { ChatChannel, ChatMessage } from '@/lib/chat-api'

/* ─── Helpers ─── */

const CHANNEL_META: Record<string, { icon: typeof Hash; color: string }> = {
  general: { icon: MessageCircle, color: 'text-foreground/50' },
  help: { icon: HelpCircle, color: 'text-amber-400/70' },
  showcase: { icon: Rocket, color: 'text-emerald-400/70' },
  'off-topic': { icon: Coffee, color: 'text-purple-400/70' },
  announcements: { icon: Megaphone, color: 'text-blue-400/70' },
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
  })
}

function formatDateLabel(iso: string) {
  const d = new Date(iso)
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const target = new Date(d.getFullYear(), d.getMonth(), d.getDate())
  const diff = today.getTime() - target.getTime()
  const days = Math.floor(diff / 86400000)

  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  return d.toLocaleDateString([], {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })
}

function isSameDay(a: string, b: string) {
  const da = new Date(a)
  const db = new Date(b)
  return (
    da.getFullYear() === db.getFullYear() &&
    da.getMonth() === db.getMonth() &&
    da.getDate() === db.getDate()
  )
}

function renderContent(text: string) {
  const parts: React.ReactNode[] = []
  const regex = /(`[^`]+`)|(\*\*[^*]+\*\*)|(\bhttps?:\/\/\S+)/g
  let last = 0
  let match: RegExpExecArray | null

  while ((match = regex.exec(text)) !== null) {
    if (match.index > last) parts.push(text.slice(last, match.index))

    if (match[1]) {
      parts.push(
        <code
          key={match.index}
          className="px-1.5 py-0.5 rounded bg-foreground/[0.06] text-[13px] font-mono text-foreground/90"
        >
          {match[1].slice(1, -1)}
        </code>,
      )
    } else if (match[2]) {
      parts.push(
        <strong key={match.index} className="font-semibold text-foreground">
          {match[2].slice(2, -2)}
        </strong>,
      )
    } else if (match[3]) {
      parts.push(
        <a
          key={match.index}
          href={match[3]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-foreground/70 underline underline-offset-2 decoration-foreground/20 hover:text-foreground hover:decoration-foreground/40 transition-colors"
        >
          {match[3]}
        </a>,
      )
    }

    last = match.index + match[0].length
  }

  if (last < text.length) parts.push(text.slice(last))
  return parts
}

interface GroupedMessages {
  messages: ChatMessage[]
  showDateSeparator: string | null
}

function buildGroups(messages: ChatMessage[]): GroupedMessages[] {
  const result: GroupedMessages[] = []
  let current: ChatMessage[] = []
  let lastDate = ''

  for (const msg of messages) {
    const needsDateSep = !lastDate || !isSameDay(lastDate, msg.created_at)

    if (current.length === 0) {
      current.push(msg)
      if (needsDateSep) lastDate = msg.created_at
      continue
    }

    const prev = current[current.length - 1]
    const sameAuthor = prev.author_id === msg.author_id
    const timeDiff =
      new Date(msg.created_at).getTime() - new Date(prev.created_at).getTime()
    const withinWindow = timeDiff < 5 * 60 * 1000

    if (sameAuthor && withinWindow && !needsDateSep) {
      current.push(msg)
    } else {
      result.push({
        messages: current,
        showDateSeparator: null,
      })
      current = [msg]
    }

    if (needsDateSep) {
      if (result.length > 0 || current.length === 1) {
        const target = current.length === 1 ? result.length : result.length - 1
        if (current.length === 1) {
          result.push({
            messages: [],
            showDateSeparator: formatDateLabel(msg.created_at),
          })
        } else {
          result[target] = {
            ...result[target],
            showDateSeparator: formatDateLabel(msg.created_at),
          }
        }
      }
      lastDate = msg.created_at
    }
  }

  if (current.length > 0) {
    result.push({ messages: current, showDateSeparator: null })
  }

  return result
}

/* ─── Date Separator ─── */

function DateSeparator({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-4 px-5 py-3">
      <div className="flex-1 h-px bg-foreground/[0.06]" />
      <span className="text-[11px] font-mono font-semibold text-foreground/40 shrink-0 select-none">
        {label}
      </span>
      <div className="flex-1 h-px bg-foreground/[0.06]" />
    </div>
  )
}

/* ─── Message Row ─── */

function MessageGroup({
  messages,
  isOwn,
  currentUser,
}: {
  messages: ChatMessage[]
  isOwn: boolean
  currentUser?: { user_metadata?: Record<string, string>; email?: string } | null
}) {
  const first = messages[0]
  const [hovered, setHovered] = useState(false)

  let displayName = first.author_name
  let displayInitial = first.author_initial
  let avatarUrl: string | undefined

  if (isOwn && currentUser) {
    const meta = currentUser.user_metadata ?? {}
    displayName = meta.display_name || currentUser.email?.split('@')[0] || first.author_name
    displayInitial = displayName.slice(0, 2).toUpperCase()
    avatarUrl = meta.avatar_url || undefined
  }

  return (
    <div
      className={`group/msg relative flex gap-3 px-5 py-1.5 transition-colors ${
        hovered ? 'bg-foreground/[0.02]' : ''
      }`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Hover action bar */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.1 }}
            className="absolute -top-3 right-5 z-10 flex items-center gap-0.5 rounded-lg border border-foreground/[0.08] bg-background px-1 py-0.5 shadow-sm"
          >
            <button
              type="button"
              className="p-1.5 rounded-md text-foreground/40 hover:text-foreground/70 hover:bg-foreground/[0.06] transition-colors"
              title="Add reaction"
            >
              <SmilePlus className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              className="p-1.5 rounded-md text-foreground/40 hover:text-foreground/70 hover:bg-foreground/[0.06] transition-colors"
              title="Reply in thread"
            >
              <CornerDownRight className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              className="p-1.5 rounded-md text-foreground/40 hover:text-foreground/70 hover:bg-foreground/[0.06] transition-colors"
              title="Save"
            >
              <Bookmark className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <Avatar size="default" className="mt-0.5 shrink-0">
        {avatarUrl && <AvatarImage src={avatarUrl} alt={displayName} />}
        <AvatarFallback
          className={`text-[10px] font-mono font-bold ${
            isOwn
              ? 'bg-foreground/15 text-foreground'
              : 'bg-foreground/10 text-foreground/80'
          }`}
        >
          {displayInitial}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-bold text-foreground">
            {displayName}
          </span>
          <span className="text-[11px] font-mono text-foreground/35 tabular-nums">
            {formatTime(first.created_at)}
          </span>
        </div>

        <div className="space-y-0.5">
          {messages.map((msg) => (
            <p
              key={msg.id}
              className="text-[14px] text-foreground/85 leading-[1.6] break-words"
            >
              {renderContent(msg.content)}
            </p>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ─── Channel List ─── */

function ChannelList({
  channels,
  activeId,
  onSelect,
  unread,
  onClose,
}: {
  channels: ChatChannel[]
  activeId: string
  onSelect: (id: string) => void
  unread: Set<string>
  onClose?: () => void
}) {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 pt-5 pb-4 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-foreground">Chat</h2>
          <p className="text-[10px] font-mono text-foreground/35 mt-0.5">
            {channels.length} channels
          </p>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-foreground/40 hover:text-foreground hover:bg-foreground/5 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="h-px bg-foreground/[0.05] mx-3 mb-2" />

      {/* Section label */}
      <div className="px-4 py-1.5">
        <span className="text-[10px] font-mono font-bold text-foreground/35 uppercase tracking-[0.15em]">
          Channels
        </span>
      </div>

      {/* Channel list */}
      <nav className="flex-1 overflow-y-auto px-2 space-y-px">
        {channels.map((ch) => {
          const isActive = ch.id === activeId
          const hasUnread = unread.has(ch.id)
          const meta = CHANNEL_META[ch.name]
          const Icon = meta?.icon || Hash

          return (
            <button
              key={ch.id}
              type="button"
              onClick={() => onSelect(ch.id)}
              className={`
                w-full flex items-center gap-2.5 px-3 py-[7px] rounded-lg text-[13px] font-mono transition-all text-left group/ch
                ${
                  isActive
                    ? 'bg-foreground/10 text-foreground font-semibold'
                    : hasUnread
                      ? 'text-foreground font-semibold hover:bg-foreground/[0.05]'
                      : 'text-foreground/55 hover:text-foreground/75 hover:bg-foreground/[0.04]'
                }
              `}
            >
              <Icon
                className={`w-4 h-4 shrink-0 ${
                  isActive ? meta?.color || 'text-foreground/50' : 'opacity-50 group-hover/ch:opacity-70'
                } transition-opacity`}
              />
              <span className="truncate">{ch.name}</span>
              {hasUnread && (
                <span className="ml-auto w-[18px] h-[18px] rounded-full bg-foreground/80 text-background text-[10px] font-bold flex items-center justify-center shrink-0">
                  !
                </span>
              )}
            </button>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 pb-3 pt-2 mt-auto">
        <div className="h-px bg-foreground/[0.05] mb-3" />
        <div className="flex items-center gap-2 px-2">
          <div className="relative">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <div className="absolute inset-0 w-2 h-2 rounded-full bg-emerald-500 animate-ping opacity-30" />
          </div>
          <span className="text-[10px] font-mono text-foreground/30">
            Live — Realtime
          </span>
        </div>
      </div>
    </div>
  )
}

/* ─── Emoji Picker Popover ─── */

function EmojiPickerPopover({
  onSelect,
  onClose,
  theme,
}: {
  onSelect: (emoji: string) => void
  onClose: () => void
  theme: string
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [onClose])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 8, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.96 }}
      transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
      className="absolute bottom-full left-0 mb-2 z-50"
    >
      <div className="rounded-xl overflow-hidden border border-foreground/[0.08] shadow-2xl shadow-black/20">
        <Picker
          data={data}
          onEmojiSelect={(e: { native: string }) => onSelect(e.native)}
          theme={theme === 'dark' ? 'dark' : 'light'}
          set="native"
          previewPosition="none"
          skinTonePosition="search"
          maxFrequentRows={2}
          perLine={8}
          emojiSize={22}
          emojiButtonSize={32}
          navPosition="bottom"
        />
      </div>
    </motion.div>
  )
}

/* ─── Composer ─── */

function ChatComposer({
  channelName,
  onSend,
  disabled,
}: {
  channelName: string
  onSend: (content: string) => void
  disabled: boolean
}) {
  const [text, setText] = useState('')
  const [showEmoji, setShowEmoji] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const { resolvedTheme } = useTheme()

  const handleSend = useCallback(() => {
    const trimmed = text.trim()
    if (!trimmed || disabled) return
    onSend(trimmed)
    setText('')
    setShowEmoji(false)
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }, [text, disabled, onSend])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
    if (e.key === 'Escape' && showEmoji) {
      setShowEmoji(false)
    }
  }

  const handleInput = () => {
    const ta = textareaRef.current
    if (!ta) return
    ta.style.height = 'auto'
    ta.style.height = `${Math.min(ta.scrollHeight, 160)}px`
  }

  const insertEmoji = useCallback(
    (emoji: string) => {
      const ta = textareaRef.current
      if (!ta) {
        setText((prev) => prev + emoji)
        return
      }

      const start = ta.selectionStart
      const end = ta.selectionEnd
      const before = text.slice(0, start)
      const after = text.slice(end)
      const newText = before + emoji + after
      setText(newText)

      requestAnimationFrame(() => {
        ta.focus()
        const pos = start + emoji.length
        ta.setSelectionRange(pos, pos)
      })
    },
    [text],
  )

  return (
    <div className="px-5 pb-4 pt-2 relative">
      {/* Emoji picker */}
      <AnimatePresence>
        {showEmoji && (
          <EmojiPickerPopover
            onSelect={(emoji) => {
              insertEmoji(emoji)
              setShowEmoji(false)
            }}
            onClose={() => setShowEmoji(false)}
            theme={resolvedTheme || 'dark'}
          />
        )}
      </AnimatePresence>

      <div className="rounded-xl border border-foreground/[0.08] bg-foreground/[0.015] focus-within:border-foreground/[0.14] transition-colors overflow-hidden">
        {/* Input area */}
        <div className="flex items-end gap-1 px-4 py-3">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            placeholder={
              disabled
                ? 'Sign in to chat...'
                : `Message #${channelName}`
            }
            disabled={disabled}
            rows={1}
            className="flex-1 bg-transparent text-[14px] text-foreground placeholder:text-foreground/30 resize-none outline-none min-h-[24px] max-h-[160px] leading-[1.6]"
          />
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between px-3 pb-2.5">
          <div className="flex items-center gap-0.5">
            <button
              type="button"
              onClick={() => setShowEmoji(!showEmoji)}
              className={`p-1.5 rounded-lg transition-colors ${
                showEmoji
                  ? 'bg-foreground/10 text-foreground/70'
                  : 'text-foreground/35 hover:text-foreground/60 hover:bg-foreground/[0.05]'
              }`}
              aria-label="Emoji picker"
            >
              <Smile className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-foreground/25 hidden sm:inline select-none">
              {navigator.platform?.includes('Mac') ? 'Return' : 'Enter'} to
              send
            </span>
            <button
              type="button"
              onClick={handleSend}
              disabled={!text.trim() || disabled}
              className={`p-2 rounded-lg transition-all ${
                text.trim() && !disabled
                  ? 'bg-foreground text-background hover:opacity-90'
                  : 'bg-foreground/[0.06] text-foreground/25 cursor-not-allowed'
              }`}
              aria-label="Send message"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── Empty State ─── */

function EmptyChannel({
  name,
  description,
}: {
  name: string
  description: string | null
}) {
  const meta = CHANNEL_META[name]
  const Icon = meta?.icon || Hash

  return (
    <div className="flex-1 flex items-end justify-center pb-12 pt-24">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="text-center max-w-md px-6"
      >
        <div className="w-14 h-14 rounded-2xl bg-foreground/[0.03] border border-foreground/[0.06] flex items-center justify-center mx-auto mb-5">
          <Icon className={`w-6 h-6 ${meta?.color || 'text-foreground/40'}`} />
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">
          Welcome to #{name}
        </h3>
        <p className="text-sm text-foreground/50 font-mono leading-relaxed">
          {description || 'Start the conversation.'}
        </p>
        <div className="mt-6 flex items-center justify-center gap-2 text-[11px] font-mono text-foreground/25">
          <div className="w-8 h-px bg-foreground/[0.06]" />
          <span>beginning of channel</span>
          <div className="w-8 h-px bg-foreground/[0.06]" />
        </div>
      </motion.div>
    </div>
  )
}

/* ─── Main ─── */

export default function Chat() {
  const { user } = useAuth()
  const [channels, setChannels] = useState<ChatChannel[]>([])
  const [activeChannelId, setActiveChannelId] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [showScrollDown, setShowScrollDown] = useState(false)
  const [channelPanelOpen, setChannelPanelOpen] = useState(false)
  const [unread, setUnread] = useState<Set<string>>(new Set())
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const subscriptionRef = useRef<ReturnType<typeof subscribeToMessages> | null>(
    null,
  )

  const activeChannel = channels.find((c) => c.id === activeChannelId)

  const scrollToBottom = useCallback((smooth = true) => {
    messagesEndRef.current?.scrollIntoView({
      behavior: smooth ? 'smooth' : 'instant',
    })
  }, [])

  const handleScroll = useCallback(() => {
    const el = scrollContainerRef.current
    if (!el) return
    const distanceFromBottom =
      el.scrollHeight - el.scrollTop - el.clientHeight
    setShowScrollDown(distanceFromBottom > 200)
  }, [])

  useEffect(() => {
    fetchChannels().then((chs) => {
      setChannels(chs)
      const general = chs.find((c) => c.name === 'general')
      if (general) setActiveChannelId(general.id)
      else if (chs.length > 0) setActiveChannelId(chs[0].id)
    })
  }, [])

  useEffect(() => {
    if (!activeChannelId) return

    setLoading(true)
    fetchMessages(activeChannelId).then((msgs) => {
      setMessages(msgs)
      setLoading(false)
      setUnread((prev) => {
        const next = new Set(prev)
        next.delete(activeChannelId)
        return next
      })
      requestAnimationFrame(() => scrollToBottom(false))
    })

    subscriptionRef.current?.unsubscribe()
    subscriptionRef.current = subscribeToMessages(activeChannelId, (msg) => {
      setMessages((prev) => [...prev, msg])
      requestAnimationFrame(() => scrollToBottom(true))
    })

    return () => {
      subscriptionRef.current?.unsubscribe()
    }
  }, [activeChannelId, scrollToBottom])

  const handleSend = useCallback(
    async (content: string) => {
      if (!user || !activeChannelId) return

      const meta = user.user_metadata ?? {}
      const name = meta.display_name || user.email?.split('@')[0] || 'Student'
      const initial = name.slice(0, 2).toUpperCase()

      await sendMessage(activeChannelId, content, {
        id: user.id,
        name,
        initial,
        tier: meta.tier || 'Student',
      })
    },
    [user, activeChannelId],
  )

  const handleChannelSelect = useCallback((id: string) => {
    setActiveChannelId(id)
    setChannelPanelOpen(false)
  }, [])

  const groups = buildGroups(messages)

  return (
    <div className="flex h-[calc(100vh-56px)] lg:h-screen overflow-hidden lg:pt-3">
      {/* ── Channel sidebar (desktop) ── */}
      <div className="hidden md:flex flex-col w-[220px] border-r border-foreground/[0.05] bg-foreground/[0.008] shrink-0">
        <ChannelList
          channels={channels}
          activeId={activeChannelId}
          onSelect={handleChannelSelect}
          unread={unread}
        />
      </div>

      {/* ── Mobile channel drawer ── */}
      <AnimatePresence>
        {channelPanelOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm md:hidden"
              onClick={() => setChannelPanelOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
              className="fixed inset-y-0 left-0 z-50 w-[260px] bg-background border-r border-foreground/[0.06] md:hidden"
            >
              <ChannelList
                channels={channels}
                activeId={activeChannelId}
                onSelect={handleChannelSelect}
                unread={unread}
                onClose={() => setChannelPanelOpen(false)}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Main chat area ── */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        {/* Channel header */}
        <div className="shrink-0 h-[52px] border-b border-foreground/[0.05] flex items-center gap-3 px-5 bg-background/50 backdrop-blur-sm">
          <button
            type="button"
            onClick={() => setChannelPanelOpen(true)}
            className="md:hidden p-1.5 -ml-1 rounded-lg text-foreground/40 hover:text-foreground hover:bg-foreground/[0.05] transition-colors"
            aria-label="Open channels"
          >
            <Menu className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 min-w-0">
            <Hash className="w-4 h-4 text-foreground/40 shrink-0" />
            <span className="text-sm font-semibold font-mono text-foreground truncate">
              {activeChannel?.name || '...'}
            </span>
          </div>

          <div className="hidden sm:block h-4 w-px bg-foreground/[0.06] mx-1" />

          <span className="hidden sm:block text-xs text-foreground/40 font-mono truncate flex-1">
            {activeChannel?.description}
          </span>

          <div className="ml-auto flex items-center gap-1 shrink-0">
            <button
              type="button"
              className="flex items-center gap-1.5 text-[11px] font-mono text-foreground/35 px-2.5 py-1.5 rounded-lg hover:bg-foreground/[0.05] hover:text-foreground/55 transition-colors"
            >
              <Users className="w-3.5 h-3.5" />
              <span>47</span>
            </button>
          </div>
        </div>

        {/* Messages area */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto overscroll-contain"
        >
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="flex flex-col items-center gap-3">
                <div className="w-5 h-5 border-2 border-foreground/[0.06] border-t-foreground/30 rounded-full animate-spin" />
                <span className="text-[11px] font-mono text-foreground/30">
                  Loading messages...
                </span>
              </div>
            </div>
          ) : messages.length === 0 ? (
            <EmptyChannel
              name={activeChannel?.name || ''}
              description={activeChannel?.description || null}
            />
          ) : (
            <div className="py-2">
              {/* Channel beginning */}
              <div className="px-5 pt-4 pb-5 mb-2">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-11 h-11 rounded-xl bg-foreground/[0.03] border border-foreground/[0.06] flex items-center justify-center">
                    <Hash className="w-5 h-5 text-foreground/35" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-foreground">
                      #{activeChannel?.name}
                    </h3>
                    <p className="text-[11px] text-foreground/40 font-mono">
                      {activeChannel?.description}
                    </p>
                  </div>
                </div>
                <div className="h-px bg-foreground/[0.04]" />
              </div>

              {groups.map((group, i) => (
                <div key={i}>
                  {group.showDateSeparator && (
                    <DateSeparator label={group.showDateSeparator} />
                  )}
                  {group.messages.length > 0 && (
                    <MessageGroup
                      messages={group.messages}
                      isOwn={group.messages[0].author_id === user?.id}
                      currentUser={user}
                    />
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} className="h-2" />
            </div>
          )}
        </div>

        {/* Scroll-to-bottom FAB */}
        <AnimatePresence>
          {showScrollDown && (
            <motion.button
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              type="button"
              onClick={() => scrollToBottom(true)}
              className="absolute bottom-28 right-6 z-10 p-2.5 rounded-full bg-background border border-foreground/10 text-foreground/50 hover:text-foreground/80 hover:border-foreground/15 transition-all shadow-lg"
              aria-label="Scroll to bottom"
            >
              <ChevronDown className="w-4 h-4" />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Composer */}
        <ChatComposer
          channelName={activeChannel?.name || ''}
          onSend={handleSend}
          disabled={!user}
        />
      </div>
    </div>
  )
}
