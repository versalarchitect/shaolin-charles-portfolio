import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
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
  BarChart3,
  Bot,
} from 'lucide-react'
import { Logo } from '@/components/ui/logo'
import { LanguageSwitcher } from '@/components/language-switcher'
import { useAuth } from '@/hooks/use-auth'
import { hasPipelineAccess } from '@/lib/pipeline-access'
import { useTheme } from '@/components/theme-provider'
import { usePlatform, type Platform } from '@/components/platform-provider'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { supabase } from '@/lib/supabase'
import { useProgress, getLevel, getNextLevel, getOverallProgress, getStreakMultiplier, getActiveTitle } from '@/stores/progress'
import { TOTAL_LESSONS } from '@/data/curriculum'
import { StreakBadge } from '@/components/gamification/streak-badge'
import { NotificationCenter } from '@/components/gamification/notification-center'

const NAV_ITEMS = [
  { labelKey: 'sidebar.dashboard', href: '/course/dashboard', icon: LayoutDashboard },
  { labelKey: 'sidebar.curriculum', href: '/course/curriculum', icon: BookOpen },
  { labelKey: 'sidebar.leaderboard', href: '/course/leaderboard', icon: Trophy },
  { labelKey: 'sidebar.analytics', href: '/course/analytics', icon: BarChart3 },
  { labelKey: 'sidebar.community', href: '/course/community', icon: Users },
  { labelKey: 'sidebar.knowledgeBase', href: '/course/knowledge-base', icon: Brain },
  { labelKey: 'sidebar.chat', href: '/course/chat', icon: MessageSquare },
  { labelKey: 'sidebar.settings', href: '/course/profile', icon: Settings },
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

function StreakFlame({ streak }: { streak: number }) {
  const intensity = streak >= 30 ? 'intense' : streak >= 14 ? 'medium' : streak >= 7 ? 'gentle' : 'none'

  if (intensity === 'none') {
    return <Flame className="w-3 h-3 text-foreground/30" />
  }

  return (
    <span className="relative inline-flex items-center justify-center">
      {/* Glow behind flame for streak >= 30 */}
      {intensity === 'intense' && (
        <span className="absolute inset-0 rounded-full bg-foreground/[0.08] blur-[3px] animate-[streak-glow_2s_ease-in-out_infinite]" />
      )}
      <Flame
        className={`w-3 h-3 text-foreground/30 ${
          intensity === 'intense'
            ? 'animate-[flicker-intense_0.8s_ease-in-out_infinite]'
            : intensity === 'medium'
              ? 'animate-[flicker-medium_1s_ease-in-out_infinite]'
              : 'animate-[flicker-gentle_1.5s_ease-in-out_infinite]'
        }`}
      />
    </span>
  )
}

function SidebarProfile({
  user,
  userId,
  initials,
  email,
  onSignOut,
}: {
  user: { user_metadata?: Record<string, string>; email?: string }
  userId: string
  initials: string
  email: string
  onSignOut: () => void
}) {
  const { t } = useTranslation()
  const progress = useProgress()
  const level = getLevel()
  const nextLevel = getNextLevel()
  const overall = getOverallProgress()
  const activeTitle = getActiveTitle()

  // Track previous level name for rank change animation
  const prevLevelRef = useRef(level.name)
  const [rankChanged, setRankChanged] = useState(false)

  // Track previous XP for gain animation
  const prevXpRef = useRef(progress.totalXp)
  const [xpGained, setXpGained] = useState(false)
  const isInitialMount = useRef(true)

  // Detect rank changes
  useEffect(() => {
    if (prevLevelRef.current !== level.name) {
      setRankChanged(true)
      prevLevelRef.current = level.name
      const timer = setTimeout(() => setRankChanged(false), 1200)
      return () => clearTimeout(timer)
    }
  }, [level.name])

  // Detect XP gains
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      prevXpRef.current = progress.totalXp
      return
    }
    if (progress.totalXp > prevXpRef.current) {
      setXpGained(true)
      prevXpRef.current = progress.totalXp
      const timer = setTimeout(() => setXpGained(false), 1000)
      return () => clearTimeout(timer)
    }
    prevXpRef.current = progress.totalXp
  }, [progress.totalXp])

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
          {activeTitle && (
            <p className="text-[10px] font-mono text-foreground/50 truncate">{activeTitle.name}</p>
          )}
          <p className="text-[10px] font-mono text-foreground/40 truncate">{email}</p>
        </div>
      </div>

      {/* Stats row */}
      <div className="mx-3 rounded-lg bg-foreground/[0.03] border border-foreground/[0.06] p-2.5">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            {/* Animated rank badge */}
            <span className="relative inline-flex items-center justify-center">
              {/* Pulse ring on rank change */}
              <AnimatePresence>
                {rankChanged && (
                  <motion.span
                    className="absolute inset-0 rounded-full border border-foreground/30"
                    initial={{ scale: 1, opacity: 0.6 }}
                    animate={{ scale: 2.2, opacity: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                  />
                )}
              </AnimatePresence>
              <AnimatePresence mode="wait">
                <motion.span
                  key={level.name}
                  initial={{ opacity: 0, scale: 0.8, rotate: -15 }}
                  animate={{
                    opacity: 1,
                    scale: rankChanged ? [1, 1.3, 1] : 1,
                    rotate: 0,
                  }}
                  exit={{ opacity: 0, scale: 0.8, rotate: 15 }}
                  transition={{
                    duration: 0.4,
                    scale: rankChanged ? { duration: 0.6, times: [0, 0.5, 1] } : { duration: 0.3 },
                  }}
                  className="inline-flex"
                >
                  <LevelIcon levelName={level.name} className="w-3.5 h-3.5 text-foreground/50" />
                </motion.span>
              </AnimatePresence>
            </span>
            <AnimatePresence mode="wait">
              <motion.span
                key={level.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{
                  opacity: 1,
                  scale: rankChanged ? [1, 1.1, 1] : 1,
                }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="text-[11px] font-mono font-semibold text-foreground/70"
              >
                {level.name}
              </motion.span>
            </AnimatePresence>
          </div>
          <div className="flex items-center gap-1">
            <Zap className="w-3 h-3 text-foreground/30" />
            {/* XP with gain animation */}
            <motion.span
              animate={xpGained ? {
                scale: [1, 1.15, 1],
                opacity: [0.4, 0.8, 0.4],
              } : { scale: 1, opacity: 0.4 }}
              transition={{ duration: 0.6 }}
              className="text-[10px] font-mono text-foreground/40"
              style={{ display: 'inline-block' }}
            >
              {progress.totalXp} XP
            </motion.span>
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
        {nextLevel && (
          <p className="text-[9px] font-mono text-foreground/30 mb-2 text-right">
            {xpIntoLevel}/{xpForLevel} {t('sidebar.xpTo')} {nextLevel.name}
          </p>
        )}

        {/* Bottom stats */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <StreakFlame streak={progress.currentStreak} />
            <span className="text-[10px] font-mono text-foreground/40">{progress.currentStreak}d {t('sidebar.streak')}</span>
            {progress.currentStreak >= 3 && (
              <StreakBadge streak={progress.currentStreak} className="!px-1.5 !py-0.5 !text-[9px] scale-75 origin-left" />
            )}
            {progress.currentStreak < 3 && getStreakMultiplier().multiplier > 1 && (
              <span className="text-[9px] font-mono px-1 py-0.5 rounded bg-foreground/10 text-foreground/50">
                {getStreakMultiplier().label}
              </span>
            )}
          </div>
          <span className="text-[10px] font-mono text-foreground/30">
            {overall.completed}/{TOTAL_LESSONS} {t('sidebar.lessons')}
          </span>
        </div>
      </div>

      {/* View Profile link */}
      <Link
        to={`/profile/${userId}`}
        className="flex items-center gap-3 w-full px-3 py-1.5 rounded-lg text-[11px] font-medium font-mono text-foreground/40 hover:text-foreground/70 hover:bg-foreground/[0.05] transition-colors"
      >
        <Settings className="w-3.5 h-3.5 shrink-0" />
        {t('sidebar.viewProfile')}
      </Link>

      {/* Sign out */}
      <button
        type="button"
        onClick={onSignOut}
        className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium font-mono text-foreground/40 hover:text-foreground/70 hover:bg-foreground/5 transition-colors"
      >
        <LogOut className="w-4 h-4 shrink-0" />
        {t('sidebar.signOut')}
      </button>
    </div>
  )
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const { t } = useTranslation()
  const location = useLocation()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { setTheme, resolvedTheme } = useTheme()
  const { platform, setPlatform } = usePlatform()

  const platformOptions: { value: Platform; label: string }[] = [
    { value: 'macos', label: 'macOS' },
    { value: 'windows', label: 'Win' },
    { value: 'linux', label: 'Linux' },
  ]

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
              {t(item.labelKey)}
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
              {t('sidebar.pipeline')}
            </Link>
          )
        })()}

        {hasPipelineAccess(user?.email) && (() => {
          const isActive = location.pathname === '/course/student-agent'
          return (
            <Link
              to="/course/student-agent"
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
              <Bot className="w-4 h-4 shrink-0" />
              {t('sidebar.studentAgent')}
            </Link>
          )
        })()}
      </nav>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Bottom section */}
      <div className="px-3 pb-4 space-y-2">
        {/* Platform selector */}
        <div className="px-3">
          <div className="flex items-center gap-0.5 rounded-lg bg-foreground/[0.04] border border-foreground/[0.08] p-0.5">
            {platformOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setPlatform(opt.value)}
                className={`flex-1 text-[10px] font-mono py-1 rounded-md transition-colors ${
                  platform === opt.value
                    ? 'bg-foreground/[0.08] text-foreground/80 border border-foreground/[0.1]'
                    : 'text-foreground/35 hover:text-foreground/55'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Language, notifications & theme */}
        <div className="px-3 flex items-center justify-between">
          <LanguageSwitcher align="left" direction="up" />
          <div className="flex items-center gap-1">
            <NotificationCenter />
            <button
              onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-lg text-foreground/50 hover:text-foreground/80 hover:bg-foreground/5 transition-colors"
              aria-label="Toggle theme"
            >
              {resolvedTheme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Separator */}
        <div className="h-px bg-foreground/[0.08]" />

        {/* Profile card */}
        {user && <SidebarProfile user={user} userId={user.id} initials={initials} email={truncatedEmail} onSignOut={handleSignOut} />}
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
