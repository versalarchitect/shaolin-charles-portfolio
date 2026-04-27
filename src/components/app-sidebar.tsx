import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  BookOpen,
  Users,
  LogOut,
  Menu,
  X,
} from 'lucide-react'
import { Logo } from '@/components/ui/logo'
import { LanguageSwitcher } from '@/components/language-switcher'
import { useAuth } from '@/hooks/use-auth'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { supabase } from '@/lib/supabase'

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Curriculum', href: '/curriculum', icon: BookOpen },
  { label: 'Community', href: '/community', icon: Users },
]

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { user } = useAuth()

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
          to="/dashboard"
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
      </nav>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Bottom section */}
      <div className="px-3 pb-4 space-y-3">
        {/* Language switcher */}
        <div className="px-3">
          <LanguageSwitcher />
        </div>

        {/* Separator */}
        <div className="h-px bg-foreground/[0.08]" />

        {/* User info */}
        {user && (
          <div className="flex items-center gap-3 px-3 py-2">
            <Avatar size="sm">
              <AvatarFallback className="bg-foreground/10 text-foreground/80 text-[10px] font-mono font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <span className="flex-1 text-xs font-mono text-foreground/50 truncate">
              {truncatedEmail}
            </span>
          </div>
        )}

        {/* Sign out */}
        <button
          type="button"
          onClick={handleSignOut}
          className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium font-mono text-foreground/50 hover:text-foreground/80 hover:bg-foreground/5 transition-colors"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          Sign Out
        </button>
      </div>
    </div>
  )
}

export function AppSidebar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:left-0 lg:w-64 lg:border-r lg:border-foreground/[0.08] lg:bg-background lg:z-40">
        <SidebarContent />
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden fixed inset-x-0 top-0 z-40 h-14 border-b border-foreground/[0.08] bg-background/95 backdrop-blur-sm flex items-center px-4">
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
