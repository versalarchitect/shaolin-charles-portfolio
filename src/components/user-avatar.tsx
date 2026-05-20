import { Link, useNavigate } from '@/lib/localized-router'
import { supabase } from '@/lib/supabase'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { LayoutDashboard, Users, Settings, LogOut } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { nameToAvatarColor } from '@/lib/avatar-colors'

export function UserAvatar() {
  const { user } = useAuth()
  const navigate = useNavigate()

  if (!user) return null

  const displayName = user.user_metadata?.full_name || user.email || ''
  const initials = displayName
    ? displayName.includes('@') ? displayName.split('@')[0].slice(0, 2).toUpperCase() : displayName.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase()
    : '?'

  const palette = nameToAvatarColor(displayName)

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    navigate('/')
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button type="button" className="rounded-full ring-2 ring-transparent hover:ring-foreground/20 transition-all focus-visible:outline-none focus-visible:ring-foreground/30">
          <Avatar size="default">
            {user.user_metadata?.avatar_url && (
              <AvatarImage src={user.user_metadata.avatar_url} alt="Profile" />
            )}
            <AvatarFallback className={`${palette.bg} ${palette.text} text-xs font-mono font-semibold`}>
              {initials}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <div className="px-2 py-1.5">
          <p className="text-xs font-mono text-muted-foreground truncate">{user.email}</p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/course/dashboard" className="cursor-pointer">
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Dashboard
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/course/community" className="cursor-pointer">
            <Users className="mr-2 h-4 w-4" />
            Community
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/course/profile" className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-muted-foreground">
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
