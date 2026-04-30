import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
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
} from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'

interface CommandItem {
  id: string
  label: string
  href: string
  icon: typeof Home
  keywords?: string[]
}

interface CommandGroup {
  id: string
  label: string
  items: CommandItem[]
}

const INSTRUCTOR_ITEMS: CommandItem[] = [
  { id: 'home', label: 'Home', href: '/', icon: Home, keywords: ['landing', 'main'] },
  { id: 'curriculum', label: 'Curriculum', href: '/curriculum', icon: BookOpen, keywords: ['course', 'lessons', 'learn'] },
  { id: 'principles', label: 'Principles', href: '/principles', icon: Shield, keywords: ['philosophy', 'values'] },
  { id: 'tiers', label: 'Pricing & Tiers', href: '/tiers', icon: Layers, keywords: ['pricing', 'plans', 'enroll'] },
  { id: 'blog', label: 'Blog', href: '/blog', icon: PenLine, keywords: ['articles', 'posts', 'writing'] },
  { id: 'instructor', label: 'About Charles', href: '/instructor', icon: User, keywords: ['bio', 'about', 'instructor', 'charles'] },
]

const PERSONAL_ITEMS: CommandItem[] = [
  { id: 'projects', label: 'Projects', href: '/projects', icon: FolderOpen, keywords: ['work', 'portfolio', 'builds'] },
  { id: 'art', label: 'Experiments', href: '/art', icon: Palette, keywords: ['art', '3d', 'creative', 'generative'] },
  { id: 'contact', label: 'Contact', href: '/contact', icon: Mail, keywords: ['email', 'reach', 'connect'] },
]

const COURSE_ITEMS: CommandItem[] = [
  { id: 'dashboard', label: 'Dashboard', href: '/course/dashboard', icon: LayoutDashboard, keywords: ['progress', 'stats'] },
  { id: 'community', label: 'Community', href: '/course/community', icon: Users, keywords: ['forum', 'discuss'] },
  { id: 'chat', label: 'Chat', href: '/course/chat', icon: MessageSquare, keywords: ['ai', 'assistant'] },
  { id: 'profile', label: 'Profile', href: '/course/profile', icon: UserCircle, keywords: ['account', 'settings'] },
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

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((prev) => !prev)
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [])

  const value = useMemo(() => ({ open, setOpen }), [open])

  return (
    <CommandMenuContext.Provider value={value}>
      {children}
      <CommandMenuDialog />
    </CommandMenuContext.Provider>
  )
}

function CommandMenuDialog() {
  const { open, setOpen } = useCommandMenu()
  const { isLoggedIn } = useAuth()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  const groups = useMemo<CommandGroup[]>(() => {
    const g: CommandGroup[] = [
      { id: 'instructor', label: 'Course', items: INSTRUCTOR_ITEMS },
      { id: 'personal', label: 'Personal', items: PERSONAL_ITEMS },
    ]
    if (isLoggedIn) {
      g.push({ id: 'course', label: 'My Course', items: COURSE_ITEMS })
    }
    return g
  }, [isLoggedIn])

  const filtered = useMemo(() => {
    if (!query.trim()) return groups

    const q = query.toLowerCase()
    return groups
      .map((group) => ({
        ...group,
        items: group.items.filter(
          (item) =>
            item.label.toLowerCase().includes(q) ||
            item.keywords?.some((kw) => kw.includes(q))
        ),
      }))
      .filter((group) => group.items.length > 0)
  }, [groups, query])

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
    (href: string) => {
      setOpen(false)
      navigate(href)
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
      go(allItems[activeIndex].href)
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
                  placeholder="Where to?"
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
                    No results found.
                  </div>
                ) : (
                  filtered.map((group) => (
                    <div key={group.id} className="mb-1 last:mb-0">
                      <div className="px-2 py-1.5 text-[10px] font-mono uppercase tracking-wider text-foreground/30">
                        {group.label}
                      </div>
                      {group.items.map((item) => {
                        const thisIndex = itemIndex++
                        const isActive = thisIndex === activeIndex
                        const Icon = item.icon
                        return (
                          <button
                            key={item.id}
                            data-active={isActive}
                            onClick={() => go(item.href)}
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
                            <span className="flex-1 text-left">{item.label}</span>
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
                    navigate
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="rounded border border-foreground/10 bg-foreground/[0.04] px-1 py-0.5">↵</kbd>
                    open
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
