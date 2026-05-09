import { useCallback, useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { Zap, Flame, Trophy, BookOpen, ArrowLeft, UserX, RefreshCw, Share2 } from 'lucide-react'
import { toast } from 'sonner'
import { SEO } from '@/components/SEO'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { LevelIcon } from '@/components/gamification/shared'
import { StreakBadge } from '@/components/gamification/streak-badge'
import { ActivityFeed } from '@/components/gamification/activity-feed'
import { fetchPublicProfile, type PublicProfileData } from '@/lib/activity-api'
import { fetchUserPercentile } from '@/lib/stats-api'
import { ACHIEVEMENTS } from '@/data/curriculum'

function ProfileSkeleton() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-12 lg:py-20 animate-pulse">
      {/* Avatar + Name skeleton */}
      <div className="flex flex-col items-center mb-10">
        <div className="w-20 h-20 rounded-full bg-foreground/[0.06] mb-4" />
        <div className="h-6 w-48 rounded bg-foreground/[0.06] mb-2" />
        <div className="h-4 w-32 rounded bg-foreground/[0.04]" />
      </div>
      {/* Stats skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-20 rounded-xl bg-foreground/[0.04]" />
        ))}
      </div>
      {/* Achievements skeleton */}
      <div className="h-32 rounded-xl bg-foreground/[0.03]" />
    </div>
  )
}

function NotFoundState() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-20 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="rounded-xl border border-foreground/[0.08] bg-foreground/[0.02] p-10 text-center max-w-sm w-full"
      >
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-foreground/[0.04] border border-foreground/[0.08] mx-auto mb-5">
          <UserX className="w-7 h-7 text-foreground/20" />
        </div>
        <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-foreground/25 mb-2">
          404
        </p>
        <h1 className="text-xl font-semibold text-foreground/80 mb-2">Profile Not Found</h1>
        <p className="text-sm text-foreground/40 font-mono mb-6">
          This user doesn't exist or hasn't set up their profile yet.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-mono text-foreground/60 hover:text-foreground/80 transition-colors px-4 py-2 rounded-lg border border-foreground/[0.08] hover:bg-foreground/[0.04]"
        >
          <ArrowLeft className="w-4 h-4" />
          Go to Home
        </Link>
      </motion.div>
    </div>
  )
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="max-w-2xl mx-auto px-6 py-20 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="rounded-xl border border-foreground/[0.08] bg-foreground/[0.02] p-10 text-center max-w-sm w-full"
      >
        <RefreshCw className="w-6 h-6 mx-auto mb-4 text-foreground/20" />
        <p className="text-sm text-foreground/50 mb-4">
          Couldn't load profile data.
        </p>
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 text-xs font-mono text-foreground/60 hover:text-foreground/80 transition-colors px-3 py-1.5 rounded-lg border border-foreground/[0.08] hover:bg-foreground/[0.04]"
        >
          <RefreshCw className="w-3 h-3" />
          Retry
        </button>
      </motion.div>
    </div>
  )
}

export default function PublicProfile() {
  const { userId } = useParams<{ userId: string }>()
  const [profile, setProfile] = useState<PublicProfileData | null>(null)
  const [percentile, setPercentile] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [error, setError] = useState(false)

  const loadProfile = () => {
    if (!userId) {
      setNotFound(true)
      setLoading(false)
      return
    }
    setLoading(true)
    setError(false)
    let cancelled = false
    Promise.all([
      fetchPublicProfile(userId),
      fetchUserPercentile(userId),
    ])
      .then(([data, pct]) => {
        if (cancelled) return
        if (!data) {
          setNotFound(true)
        } else {
          setProfile(data)
          setPercentile(pct)
        }
        setLoading(false)
      })
      .catch(() => {
        if (cancelled) return
        setError(true)
        setLoading(false)
      })
    return () => { cancelled = true }
  }

  useEffect(() => {
    const cleanup = loadProfile()
    return cleanup
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId])

  if (loading) return <ProfileSkeleton />
  if (error) return <ErrorState onRetry={loadProfile} />
  if (notFound || !profile) return <NotFoundState />

  const initials = profile.display_name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || '?'

  const unlockedAchievementData = ACHIEVEMENTS.filter((a) =>
    profile.unlocked_achievements.includes(a.id)
  )

  const topPercent = percentile !== null && percentile > 0
    ? Math.max(1, 100 - percentile)
    : null

  const stats = [
    { icon: Zap, label: 'Total XP', value: profile.total_xp.toLocaleString(), badge: topPercent !== null ? `Top ${topPercent}%` : undefined },
    { icon: Flame, label: 'Streak', value: `${profile.current_streak} days` },
    { icon: BookOpen, label: 'Achievements', value: `${profile.unlocked_achievements.length}` },
    { icon: Trophy, label: 'Rank', value: profile.rank },
  ]

  const profileUrl = `https://charlesjackson.dev/profile/${userId}`

  const handleShare = useCallback(async () => {
    const shareData = {
      title: `${profile.display_name}'s Profile`,
      text: `${profile.rank} rank · ${profile.total_xp.toLocaleString()} XP · ${profile.current_streak}-day streak`,
      url: profileUrl,
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData)
        return
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') return
        // Fall through to clipboard fallback
      }
    }

    try {
      await navigator.clipboard.writeText(profileUrl)
      toast.success('Profile link copied!')
    } catch {
      // Final fallback: prompt-based copy
      window.prompt('Copy this link:', profileUrl)
    }
  }, [profile, profileUrl])

  return (
    <>
      <SEO
        title={`${profile.display_name}'s Profile — The Agentic SaaS Course`}
        description={`${profile.rank} rank · ${profile.total_xp.toLocaleString()} XP · ${profile.current_streak}-day streak · ${profile.unlocked_achievements.length} achievements`}
        path={`profile/${userId}`}
        type="profile"
        jsonLd={{
          '@type': 'Person',
          name: profile.display_name,
          url: profileUrl,
        }}
      />

      <div className="max-w-2xl mx-auto px-6 py-12 lg:py-20">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header: Avatar + Name + Title */}
          <div className="flex flex-col items-center text-center mb-10">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 200, damping: 15 }}
            >
              <Avatar className="!size-20 mb-4">
                {profile.avatar_url && <AvatarImage src={profile.avatar_url} alt={profile.display_name} />}
                <AvatarFallback className="bg-foreground/10 text-foreground/80 text-2xl font-mono font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </motion.div>

            <h1 className="text-2xl font-bold tracking-tight mb-1">{profile.display_name}</h1>

            <div className="flex items-center gap-2 mb-3">
              <LevelIcon levelName={profile.rank} className="w-4 h-4 text-foreground/50" />
              <span className="text-sm font-mono text-foreground/50">{profile.rank}</span>
              {profile.active_title && profile.active_title !== 'newcomer' && (
                <>
                  <span className="text-foreground/20">·</span>
                  <span className="text-sm font-mono text-foreground/40 capitalize">{profile.active_title.replace(/-/g, ' ')}</span>
                </>
              )}
            </div>

            {/* Live streak badge */}
            {profile.current_streak >= 3 && (
              <StreakBadge streak={profile.current_streak} />
            )}

            {/* Share profile button */}
            <motion.button
              onClick={handleShare}
              className="mt-3 inline-flex items-center gap-1.5 text-xs font-mono text-foreground/40 hover:text-foreground/70 transition-colors px-3 py-1.5 rounded-lg border border-foreground/[0.08] hover:bg-foreground/[0.04]"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <Share2 className="w-3 h-3" />
              Share Profile
            </motion.button>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                className="rounded-xl border border-foreground/[0.08] bg-foreground/[0.02] p-4 text-center"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.05, duration: 0.35 }}
              >
                <stat.icon className="w-4 h-4 mx-auto mb-2 text-foreground/40" />
                <p className="text-lg font-mono font-bold">{stat.value}</p>
                <p className="text-[10px] font-mono text-foreground/40 uppercase tracking-wider">{stat.label}</p>
                {'badge' in stat && stat.badge && (
                  <span className="inline-block mt-1.5 text-[9px] font-mono px-1.5 py-0.5 rounded bg-foreground/[0.06] text-foreground/50">
                    {stat.badge}
                  </span>
                )}
              </motion.div>
            ))}
          </div>

          {/* Achievement Showcase */}
          <motion.div
            className="rounded-xl border border-foreground/[0.08] bg-foreground/[0.02] p-6 mb-8"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.4 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="w-4 h-4 text-foreground/40" />
              <span className="text-sm font-mono font-medium text-foreground/60">Achievements</span>
              <span className="text-[10px] font-mono text-foreground/30 ml-auto">
                {unlockedAchievementData.length}/{ACHIEVEMENTS.length}
              </span>
            </div>

            {unlockedAchievementData.length === 0 ? (
              <div className="text-center py-6">
                <Trophy className="w-6 h-6 mx-auto mb-2 text-foreground/15" />
                <p className="text-xs text-foreground/30 font-mono">No achievements unlocked yet</p>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {unlockedAchievementData.map((a) => (
                  <motion.div
                    key={a.id}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-foreground/[0.04] border border-foreground/[0.08]"
                    title={a.description}
                    whileHover={{ scale: 1.03 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  >
                    <span className="text-lg">{a.icon}</span>
                    <span className="text-xs font-mono text-foreground/70">{a.name}</span>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Activity Feed */}
          <motion.div
            className="rounded-xl border border-foreground/[0.08] bg-foreground/[0.02] p-6"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.4 }}
          >
            <ActivityFeed userId={profile.user_id} limit={10} showHeader />
          </motion.div>
        </motion.div>
      </div>
    </>
  )
}
