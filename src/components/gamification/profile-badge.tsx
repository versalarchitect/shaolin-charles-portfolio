import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { Zap, Flame } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { LevelIcon } from '@/components/gamification/shared'
import { fetchPublicProfile, type PublicProfileData } from '@/lib/activity-api'

interface ProfileBadgeProps {
  userId?: string
  variant: 'compact' | 'full'
}

export function ProfileBadge({ userId, variant }: ProfileBadgeProps) {
  const { user } = useAuth()
  const resolvedUserId = userId || user?.id
  const [profile, setProfile] = useState<PublicProfileData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!resolvedUserId) {
      setLoading(false)
      return
    }
    let cancelled = false
    fetchPublicProfile(resolvedUserId).then((data) => {
      if (!cancelled) {
        setProfile(data)
        setLoading(false)
      }
    })
    return () => { cancelled = true }
  }, [resolvedUserId])

  if (loading) {
    if (variant === 'compact') {
      return <div className="h-8 w-32 rounded-full bg-foreground/[0.05] animate-pulse" />
    }
    return <div className="h-24 w-full rounded-xl bg-foreground/[0.03] animate-pulse" />
  }

  if (!profile || !resolvedUserId) return null

  const initials = profile.display_name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || '?'

  const profileUrl = `/profile/${resolvedUserId}`

  if (variant === 'compact') {
    return (
      <Link to={profileUrl} className="group">
        <motion.div
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-foreground/[0.08] bg-foreground/[0.02] hover:bg-foreground/[0.05] hover:border-foreground/15 transition-all"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <LevelIcon levelName={profile.rank} className="w-3.5 h-3.5 text-foreground/50" />
          <span className="text-xs font-mono font-semibold text-foreground/70">
            {profile.total_xp} XP
          </span>
          {profile.current_streak >= 3 && (
            <span className="flex items-center gap-0.5 text-xs font-mono text-foreground/50">
              <Flame className="w-3 h-3" />
              {profile.current_streak}
            </span>
          )}
        </motion.div>
      </Link>
    )
  }

  // Full variant
  return (
    <Link to={profileUrl} className="block group">
      <motion.div
        className="rounded-xl border border-foreground/[0.08] bg-foreground/[0.02] p-5 hover:bg-foreground/[0.04] hover:border-foreground/15 transition-all"
        whileHover={{ y: -2 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        <div className="flex items-center gap-4">
          <Avatar className="!size-12">
            {profile.avatar_url && <AvatarImage src={profile.avatar_url} alt={profile.display_name} />}
            <AvatarFallback className="bg-foreground/10 text-foreground/80 text-sm font-mono font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-foreground/90 truncate">{profile.display_name}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <LevelIcon levelName={profile.rank} className="w-3.5 h-3.5 text-foreground/50" />
              <span className="text-xs font-mono text-foreground/50">{profile.rank}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-foreground/[0.06]">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-0.5">
              <Zap className="w-3 h-3 text-foreground/40" />
            </div>
            <p className="text-sm font-mono font-semibold">{profile.total_xp}</p>
            <p className="text-[9px] font-mono text-foreground/30 uppercase">XP</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-0.5">
              <Flame className="w-3 h-3 text-foreground/40" />
            </div>
            <p className="text-sm font-mono font-semibold">{profile.current_streak}</p>
            <p className="text-[9px] font-mono text-foreground/30 uppercase">Streak</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-0.5">
              <span className="text-xs">🏆</span>
            </div>
            <p className="text-sm font-mono font-semibold">{profile.unlocked_achievements.length}</p>
            <p className="text-[9px] font-mono text-foreground/30 uppercase">Badges</p>
          </div>
        </div>
      </motion.div>
    </Link>
  )
}
