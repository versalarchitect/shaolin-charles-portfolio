import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  BookOpen,
  Users,
  MessageSquare,
  Settings,
  LogOut,
  Menu,
  X,
  Sun,
  Moon,
  Flame,
  Zap,
  Trophy,
  Star,
  Award,
  Crown,
  Target,
  Brain,
  Briefcase,
} from 'lucide-react'
import { Logo } from '@/components/ui/logo'
import { LanguageSwitcher } from '@/components/language-switcher'
import { useAuth } from '@/hooks/use-auth'
import { hasPipelineAccess } from '@/lib/pipeline-access'
import { useTheme } from '@/components/theme-provider'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { supabase } from '@/lib/supabase'
import { useProgress, getLevel, getNextLevel, getOverallProgress, getStreakMultiplier } from '@/stores/progress'
import { TOTAL_LESSONS } from '@/data/curriculum'

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/course/dashboard', icon: LayoutDashboard },
  { label: 'Curriculum', href: '/course/curriculum', icon: BookOpen },
  { label: 'Leaderboard', href: '/course/leaderboard', icon: Trophy },
  { label: 'Community', href: '/course/community', icon: Users },
  { label: 'Knowledge Base', href: '/course/knowledge-base', icon: Brain },
  { label: 'Chat', href: '/course/chat', icon: MessageSquare },
  { label: 'Settings', href: '/course/profile', icon: Settings },
]

function LevelIcon({ levelName, className }: { levelName: string; className?: string }) {
  switch (levelName) {
    case 'Diamond': return <Crown className={className} />
    case 'Platinum': return <Award className={className} />
    case 'Gold': return <Trophy className={className} />
    case 'Silver': return <Star className={className} />
    default: return <Target className={className} />
  }
}

function SidebarProfile({
  user,
  initials,
  email,
  onSignOut,
}: {
  user: { user_metadata?: Record<string, string>; email?: string }
  initials: string
  email: string
  onSignOut: () => void
}) {
  const progress = useProgress()
  const level = getLevel()
  const nextLevel = getNextLevel()
  const overall = getOverallProgress()

  const displayName = user.user_metadata?.display_name
    || user.email?.split('@')[0]
    || 'Student'

  const xpIntoLevel = progress.totalXp - level.minXp
  const xpForLevel = nextLevel ? nextLevel.minXp - level.minXp : 1
  const levelPercent = nextLevel
    ? Math.min(100, Math.round((xpIntoLevel / xpForLevel) * 100))
    : 100

  return (
    <div className="space-y-2">
      {/* User identity */}
      <div className="flex items-center gap-3 px-3 py-2.5">
        <Avatar size="default">
          {user.user_metadata?.avatar_url && (
            <AvatarImage src={user.user_metadata.avatar_url} alt={displayName} />
          )}
          <AvatarFallback className="bg-foreground/10 text-foreground/80 text-xs font-mono font-semibold">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground/90 truncate">{displayName}</p>
          <p className="text-[10px] font-mono text-foreground/40 truncate">{email}</p>
        </div>
      </div>

      {/* Stats row */}
      <div className="mx-3 rounded-lg bg-foreground/[0.03] border border-foreground/[0.06] p-2.5">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <LevelIcon levelName={level.name} className="w-3.5 h-3.5 text-foreground/50" />
            <span className="text-[11px] font-mono font-semibold text-foreground/70">{level.name}</span>
          </div>
          <div className="flex items-center gap-1">
            <Zap className="w-3 h-3 text-foreground/30" />
            <span className="text-[10px] font-mono text-foreground/40">{progress.totalXp} XP</span>
          </div>
        </div>

        {/* XP progress bar */}
        <div className="relative h-1 rounded-full bg-foreground/[0.06] overflow-hidden mb-2">
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full bg-foreground/20"
            initial={{ width: 0 }}
            animate={{ width: `${levelPercent}%` }}
            transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
          />
        </div>

        {/* Bottom stats */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Flame className="w-3 h-3 text-foreground/30" />
            <span className="text-[10px] font-mono text-foreground/40">{progress.currentStreak}d streak</span>
            {getStreakMultiplier().multiplier > 1 && (
              <span className="text-[9px] font-mono px-1 py-0.5 rounded bg-foreground/10 text-foreground/50">
                {getStreakMultiplier().label}
              </span>
            )}
          </div>
          <span className="text-[10px] font-mono text-foreground/30">
            {overall.completed}/{TOTAL_LESSONS} lessons
          </span>
        </div>
      </div>

      {/* Sign out */}
      <button
        type="button"
        onClick={onSignOut}
        className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium font-mono text-foreground/40 hover:text-foreground/70 hover:bg-foreground/5 transition-colors"
      >
        <LogOut className="w-4 h-4 shrink-0" />
        Sign Out
      </button>
    </div>
  )
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { setTheme, resolvedTheme } = useTheme()

  const initials = user?.email
    ? user.email.split('@')[0].slice(0, 2).toUpperCase()
    : '?'

  const truncatedEmail = user?.email
    ? user.email.length > 24
      ? `${user.email.slice(0, 24)}...`
      : user.email
    : ''

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    navigate('/')
  }

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-4 py-5">
        <Link
          to="/course/dashboard"
          className="flex items-center gap-2.5"
          onClick={onNavigate}
        >
          <Logo size="sm" className="text-foreground" />
          <span className="font-mono text-sm font-semibold text-foreground">
            Agentic SaaS
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="px-3 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive =
            location.pathname === item.href ||
            (item.href !== '/' && location.pathname.startsWith(`${item.href}/`))

          return (
            <Link
              key={item.href}
              to={item.href}
              onClick={onNavigate}
              className={`
                flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium font-mono transition-colors
                ${
                  isActive
                    ? 'bg-foreground/10 text-foreground'
                    : 'text-foreground/50 hover:text-foreground/80 hover:bg-foreground/5'
                }
              `}
            >
              <item.icon className="w-4 h-4 shrink-0" />
              {item.label}
            </Link>
          )
        })}

        {hasPipelineAccess(user?.email) && (() => {
          const isActive = location.pathname === '/course/pipeline'
          return (
            <Link
              to="/course/pipeline"
              onClick={onNavigate}
              className={`
                flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium font-mono transition-colors
                ${
                  isActive
                    ? 'bg-foreground/10 text-foreground'
                    : 'text-foreground/50 hover:text-foreground/80 hover:bg-foreground/5'
                }
              `}
            >
              <Briefcase className="w-4 h-4 shrink-0" />
              Pipeline
            </Link>
          )
        })()}
      </nav>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Bottom section */}
      <div className="px-3 pb-4 space-y-2">
        {/* Language & theme */}
        <div className="px-3 flex items-center justify-between">
          <LanguageSwitcher />
          <button
            onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-lg text-foreground/50 hover:text-foreground/80 hover:bg-foreground/5 transition-colors"
            aria-label="Toggle theme"
          >
            {resolvedTheme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>

        {/* Separator */}
        <div className="h-px bg-foreground/[0.08]" />

        {/* Profile card */}
        {user && <SidebarProfile user={user} initials={initials} email={truncatedEmail} onSignOut={handleSignOut} />}
      </div>
    </div>
  )
}

export function AppSidebar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { setTheme, resolvedTheme } = useTheme()

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:left-0 lg:w-64 lg:border-r lg:border-foreground/[0.08] lg:bg-background lg:z-40">
        <SidebarContent />
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden fixed inset-x-0 top-0 z-40 h-14 border-b border-foreground/[0.08] bg-background/95 backdrop-blur-sm flex items-center justify-between px-4">
        <div className="flex items-center">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="p-2 -ml-2 rounded-lg text-foreground/60 hover:text-foreground hover:bg-foreground/5 transition-colors"
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="ml-3">
            <Logo size="sm" className="text-foreground" />
          </div>
        </div>
        <button
          onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
          className="p-2 rounded-lg text-foreground/60 hover:text-foreground hover:bg-foreground/5 transition-colors"
          aria-label="Toggle theme"
        >
          {resolvedTheme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileOpen(false)}
            />

            {/* Sidebar panel */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
              className="fixed inset-y-0 left-0 z-50 w-64 bg-background border-r border-foreground/[0.08] lg:hidden"
            >
              {/* Close button */}
              <div className="absolute top-4 right-3">
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="p-1.5 rounded-lg text-foreground/50 hover:text-foreground hover:bg-foreground/5 transition-colors"
                  aria-label="Close sidebar"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <SidebarContent onNavigate={() => setMobileOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
