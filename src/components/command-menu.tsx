import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import {
  Search,
  Home,
  BookOpen,
  Shield,
  Layers,
  PenLine,
  User,
  FolderOpen,
  Palette,
  Mail,
  LayoutDashboard,
  Users,
  MessageSquare,
  UserCircle,
  Command,
  ArrowRight,
  Trophy,
  Settings,
  Lock,
  Share2,
  ExternalLink,
} from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { checkUnlocked, UNLOCKABLES } from '@/lib/unlockables'
import { useProgress, getLevel } from '@/stores/progress'

interface CommandItem {
  id: string
  labelKey: string
  href?: string
  action?: () => void
  icon: typeof Home
  keywords?: string[]
  shortcut?: string
  hidden?: boolean
}

interface CommandGroup {
  id: string
  labelKey: string
  items: CommandItem[]
}

const INSTRUCTOR_ITEMS: CommandItem[] = [
  { id: 'home', labelKey: 'commandMenu.home', href: '/', icon: Home, keywords: ['landing', 'main'] },
  { id: 'curriculum', labelKey: 'commandMenu.curriculum', href: '/curriculum', icon: BookOpen, keywords: ['course', 'lessons', 'learn'] },
  { id: 'principles', labelKey: 'commandMenu.principles', href: '/principles', icon: Shield, keywords: ['philosophy', 'values'] },
  { id: 'tiers', labelKey: 'commandMenu.pricingTiers', href: '/tiers', icon: Layers, keywords: ['pricing', 'plans', 'enroll'] },
  { id: 'blog', labelKey: 'commandMenu.blog', href: '/blog', icon: PenLine, keywords: ['articles', 'posts', 'writing'] },
  { id: 'instructor', labelKey: 'commandMenu.aboutCharles', href: '/instructor', icon: User, keywords: ['bio', 'about', 'instructor', 'charles'] },
]

const PERSONAL_ITEMS: CommandItem[] = [
  { id: 'projects', labelKey: 'commandMenu.projects', href: '/projects', icon: FolderOpen, keywords: ['work', 'portfolio', 'builds'] },
  { id: 'art', labelKey: 'commandMenu.experiments', href: '/art', icon: Palette, keywords: ['art', '3d', 'creative', 'generative'] },
  { id: 'contact', labelKey: 'commandMenu.contact', href: '/contact', icon: Mail, keywords: ['email', 'reach', 'connect'] },
]

const COURSE_ITEMS: CommandItem[] = [
  { id: 'dashboard', labelKey: 'commandMenu.dashboard', href: '/course/dashboard', icon: LayoutDashboard, keywords: ['progress', 'stats'] },
  { id: 'community', labelKey: 'commandMenu.community', href: '/course/community', icon: Users, keywords: ['forum', 'discuss'] },
  { id: 'chat', labelKey: 'commandMenu.chat', href: '/course/chat', icon: MessageSquare, keywords: ['ai', 'assistant'] },
  { id: 'profile', labelKey: 'commandMenu.profile', href: '/course/profile', icon: UserCircle, keywords: ['account', 'settings'] },
]

const CommandMenuContext = createContext<{
  open: boolean
  setOpen: (open: boolean) => void
}>({ open: false, setOpen: () => {} })

export function useCommandMenu() {
  return useContext(CommandMenuContext)
}

export function CommandMenuProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const sequenceRef = useRef<{ key: string; time: number } | null>(null)
  const navigateRef = useRef<((path: string) => void) | null>(null)

  useEffect(() => {
    const SEQUENCE_TIMEOUT = 1000

    function onKeyDown(e: KeyboardEvent) {
      // Cmd/Ctrl+K to toggle command menu
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((prev) => !prev)
        return
      }

      // Don't process sequence shortcuts if user is typing in an input/textarea
      const tag = (e.target as HTMLElement)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || (e.target as HTMLElement)?.isContentEditable) return

      const now = Date.now()
      const prev = sequenceRef.current

      // Check if this completes a sequence starting with 'g'
      if (prev && prev.key === 'g' && now - prev.time < SEQUENCE_TIMEOUT) {
        const routes: Record<string, string> = {
          d: '/course/dashboard',
          l: '/course/leaderboard',
          s: '/course/profile',
          v: '/course/vault',
        }
        const route = routes[e.key]
        if (route) {
          e.preventDefault()
          navigateRef.current?.(route)
          sequenceRef.current = null
          return
        }
      }

      // Record first key of potential sequence
      if (e.key === 'g' && !e.metaKey && !e.ctrlKey && !e.altKey) {
        sequenceRef.current = { key: 'g', time: now }
      } else {
        sequenceRef.current = null
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [])

  const value = useMemo(() => ({ open, setOpen }), [open])

  return (
    <CommandMenuContext.Provider value={value}>
      {children}
      <CommandMenuDialog navigateRef={navigateRef} />
    </CommandMenuContext.Provider>
  )
}

function CommandMenuDialog({ navigateRef }: { navigateRef: React.MutableRefObject<((path: string) => void) | null> }) {
  const { open, setOpen } = useCommandMenu()
  const { t } = useTranslation()
  const { isLoggedIn, user } = useAuth()
  const progress = useProgress()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  // Expose navigate to the provider for sequence shortcuts
  useEffect(() => {
    navigateRef.current = navigate
  }, [navigate, navigateRef])

  const vaultUnlocked = useMemo(() => {
    const vaultItem = UNLOCKABLES.find((u) => u.id === 'secret-vault')
    if (!vaultItem) return false
    const level = getLevel()
    return checkUnlocked(vaultItem, {
      totalXp: progress.totalXp,
      level: level.name,
      achievements: progress.unlockedAchievements,
      streak: progress.currentStreak,
    })
  }, [progress.totalXp, progress.unlockedAchievements, progress.currentStreak])

  const gamificationItems = useMemo<CommandItem[]>(() => {
    const items: CommandItem[] = [
      { id: 'go-dashboard', labelKey: 'commandMenu.goToDashboard', href: '/course/dashboard', icon: LayoutDashboard, keywords: ['progress', 'home'], shortcut: 'G D' },
      { id: 'go-leaderboard', labelKey: 'commandMenu.goToLeaderboard', href: '/course/leaderboard', icon: Trophy, keywords: ['rank', 'compete', 'top'], shortcut: 'G L' },
      { id: 'go-settings', labelKey: 'commandMenu.goToSettings', href: '/course/profile', icon: Settings, keywords: ['preferences', 'account'], shortcut: 'G S' },
    ]

    if (vaultUnlocked) {
      items.push({ id: 'go-vault', labelKey: 'commandMenu.goToVault', href: '/course/vault', icon: Lock, keywords: ['secret', 'hidden', 'achievements'], shortcut: 'G V' })
    }

    items.push({
      id: 'share-progress',
      labelKey: 'commandMenu.shareProgress',
      icon: Share2,
      keywords: ['share', 'card', 'social'],
      action: () => {
        window.dispatchEvent(new CustomEvent('open-share-card'))
      },
    })

    if (user) {
      items.push({
        id: 'view-public-profile',
        labelKey: 'commandMenu.viewPublicProfile',
        icon: ExternalLink,
        keywords: ['public', 'profile', 'external'],
        action: () => {
          window.open(`/profile/${user.id}`, '_blank')
        },
      })
    }

    return items
  }, [vaultUnlocked, user])

  const groups = useMemo<CommandGroup[]>(() => {
    const g: CommandGroup[] = [
      { id: 'instructor', labelKey: 'commandMenu.course', items: INSTRUCTOR_ITEMS },
      { id: 'personal', labelKey: 'commandMenu.personal', items: PERSONAL_ITEMS },
    ]
    if (isLoggedIn) {
      g.push({ id: 'course', labelKey: 'commandMenu.myCourse', items: COURSE_ITEMS })
      g.push({ id: 'gamification', labelKey: 'commandMenu.quickActions', items: gamificationItems })
    }
    return g
  }, [isLoggedIn, gamificationItems])

  const filtered = useMemo(() => {
    if (!query.trim()) return groups

    const q = query.toLowerCase()
    return groups
      .map((group) => ({
        ...group,
        items: group.items.filter(
          (item) =>
            t(item.labelKey).toLowerCase().includes(q) ||
            item.keywords?.some((kw) => kw.includes(q))
        ),
      }))
      .filter((group) => group.items.length > 0)
  }, [groups, query, t])

  const allItems = useMemo(
    () => filtered.flatMap((g) => g.items),
    [filtered]
  )

  useEffect(() => {
    if (open) {
      setQuery('')
      setActiveIndex(0)
      requestAnimationFrame(() => inputRef.current?.focus())
    }
  }, [open])

  useEffect(() => {
    setActiveIndex(0)
  }, [query])

  const go = useCallback(
    (item: CommandItem) => {
      setOpen(false)
      if (item.action) {
        item.action()
      } else if (item.href) {
        navigate(item.href)
      }
    },
    [setOpen, navigate]
  )

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((i) => (i + 1) % allItems.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((i) => (i - 1 + allItems.length) % allItems.length)
    } else if (e.key === 'Enter' && allItems[activeIndex]) {
      e.preventDefault()
      go(allItems[activeIndex])
    } else if (e.key === 'Escape') {
      e.preventDefault()
      setOpen(false)
    }
  }

  useEffect(() => {
    const activeEl = listRef.current?.querySelector('[data-active="true"]')
    activeEl?.scrollIntoView({ block: 'nearest' })
  }, [activeIndex])

  let itemIndex = 0

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
            className="fixed inset-x-0 top-[15vh] z-[201] mx-auto w-full max-w-lg px-4"
          >
            <div
              className="overflow-hidden rounded-xl border border-foreground/10 bg-background shadow-2xl"
              onKeyDown={onKeyDown}
            >
              {/* Search input */}
              <div className="flex items-center gap-3 border-b border-foreground/[0.08] px-4">
                <Search className="h-4 w-4 shrink-0 text-foreground/40" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder={t('commandMenu.placeholder')}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="flex-1 bg-transparent py-3.5 text-sm text-foreground placeholder:text-foreground/30 outline-none"
                />
                <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded border border-foreground/10 bg-foreground/[0.04] px-1.5 py-0.5 text-[10px] font-mono text-foreground/30">
                  ESC
                </kbd>
              </div>

              {/* Results */}
              <div ref={listRef} className="max-h-[50vh] overflow-y-auto overscroll-contain p-2">
                {filtered.length === 0 ? (
                  <div className="py-8 text-center text-sm text-foreground/30">
                    {t('commandMenu.noResults')}
                  </div>
                ) : (
                  filtered.map((group) => (
                    <div key={group.id} className="mb-1 last:mb-0">
                      <div className="px-2 py-1.5 text-[10px] font-mono uppercase tracking-wider text-foreground/30">
                        {t(group.labelKey)}
                      </div>
                      {group.items.map((item) => {
                        const thisIndex = itemIndex++
                        const isActive = thisIndex === activeIndex
                        const Icon = item.icon
                        return (
                          <button
                            key={item.id}
                            data-active={isActive}
                            onClick={() => go(item)}
                            onMouseEnter={() => setActiveIndex(thisIndex)}
                            className={`
                              flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors
                              ${isActive
                                ? 'bg-foreground/[0.06] text-foreground'
                                : 'text-foreground/60 hover:text-foreground'
                              }
                            `}
                          >
                            <Icon className="h-4 w-4 shrink-0" />
                            <span className="flex-1 text-left">{t(item.labelKey)}</span>
                            {item.shortcut && (
                              <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded border border-foreground/10 bg-foreground/[0.04] px-1.5 py-0.5 text-[10px] font-mono text-foreground/25">
                                {item.shortcut}
                              </kbd>
                            )}
                            {isActive && (
                              <ArrowRight className="h-3 w-3 text-foreground/30" />
                            )}
                          </button>
                        )
                      })}
                    </div>
                  ))
                )}
              </div>

              {/* Footer hint */}
              <div className="flex items-center justify-between border-t border-foreground/[0.08] px-4 py-2">
                <div className="flex items-center gap-3 text-[10px] text-foreground/25 font-mono">
                  <span className="flex items-center gap-1">
                    <kbd className="rounded border border-foreground/10 bg-foreground/[0.04] px-1 py-0.5">↑↓</kbd>
                    {t('commandMenu.navigate')}
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="rounded border border-foreground/10 bg-foreground/[0.04] px-1 py-0.5">↵</kbd>
                    {t('commandMenu.open')}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-foreground/25 font-mono">
                  <Command className="h-2.5 w-2.5" />K
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
