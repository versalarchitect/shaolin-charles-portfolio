import { motion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Crown, Flame, Medal, Trophy, Zap } from 'lucide-react'
import { AnimatedNumber } from '@/components/ui/aaa-effects'
import type { LeaderboardEntry } from '@/lib/leaderboard-api'

interface LeaderboardProps {
  entries: LeaderboardEntry[]
  currentUserId?: string
  title: string
  loading?: boolean
}

const AVATAR_PALETTES = [
  { from: 'from-rose-500/40', to: 'to-pink-600/30', text: 'text-rose-200' },
  { from: 'from-violet-500/40', to: 'to-purple-600/30', text: 'text-violet-200' },
  { from: 'from-blue-500/40', to: 'to-cyan-600/30', text: 'text-blue-200' },
  { from: 'from-emerald-500/40', to: 'to-teal-600/30', text: 'text-emerald-200' },
  { from: 'from-amber-500/40', to: 'to-orange-600/30', text: 'text-amber-200' },
  { from: 'from-sky-500/40', to: 'to-indigo-600/30', text: 'text-sky-200' },
  { from: 'from-fuchsia-500/40', to: 'to-pink-600/30', text: 'text-fuchsia-200' },
  { from: 'from-lime-500/40', to: 'to-green-600/30', text: 'text-lime-200' },
] as const

function nameToColor(name: string) {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return AVATAR_PALETTES[Math.abs(hash) % AVATAR_PALETTES.length]
}

const MEDAL_COLORS = [
  { bg: 'from-amber-500/20 to-yellow-500/10', border: 'border-amber-500/30', text: 'text-amber-400', ring: 'ring-amber-500/20' },
  { bg: 'from-slate-300/20 to-slate-400/10', border: 'border-slate-400/30', text: 'text-slate-300', ring: 'ring-slate-400/20' },
  { bg: 'from-orange-700/20 to-amber-700/10', border: 'border-orange-700/30', text: 'text-orange-500', ring: 'ring-orange-700/20' },
] as const

function PodiumAvatar({ name, url, rank }: { name: string; url?: string; rank: number }) {
  const medal = MEDAL_COLORS[rank - 1]
  const palette = nameToColor(name)
  const size = rank === 1 ? 'w-16 h-16' : 'w-12 h-12'
  const textSize = rank === 1 ? 'text-lg' : 'text-sm'

  const initials = (name || '?')
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <div className="relative">
      <div className={`${size} rounded-full ring-2 ${medal.ring} overflow-hidden`}>
        {url ? (
          <img src={url} alt={name} className="w-full h-full object-cover" />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${palette.from} ${palette.to} flex items-center justify-center`}>
            <span className={`${textSize} font-mono font-bold ${palette.text}`}>{initials}</span>
          </div>
        )}
      </div>
      <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-background border-2 ${medal.border} flex items-center justify-center`}>
        {rank === 1 ? (
          <Crown className={`w-3.5 h-3.5 ${medal.text}`} />
        ) : (
          <Medal className={`w-3.5 h-3.5 ${medal.text}`} />
        )}
      </div>
    </div>
  )
}

function PodiumCard({ entry, isCurrentUser, maxXp }: { entry: LeaderboardEntry; isCurrentUser: boolean; maxXp: number }) {
  const color = MEDAL_COLORS[entry.rank - 1]
  const isFirst = entry.rank === 1

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20, delay: entry.rank === 1 ? 0.1 : entry.rank === 2 ? 0 : 0.2 }}
      className={`relative flex flex-col items-center gap-3 rounded-2xl border backdrop-blur-sm p-5 ${isFirst ? 'pt-6 pb-6' : 'pt-5 pb-5'} ${
        isCurrentUser
          ? `bg-gradient-to-br ${color.bg} ${color.border} shadow-lg`
          : `bg-gradient-to-br ${color.bg} border-foreground/[0.08]`
      }`}
      style={{ order: entry.rank === 1 ? 1 : entry.rank === 2 ? 0 : 2 }}
    >
      {isFirst && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-400 text-[9px] font-mono uppercase tracking-widest">
          #1
        </div>
      )}

      <PodiumAvatar name={entry.display_name} url={entry.avatar_url} rank={entry.rank} />

      <div className="text-center w-full">
        <p className={`font-semibold leading-tight ${isFirst ? 'text-sm' : 'text-xs'} text-foreground`}>
          {entry.display_name || 'Anonymous'}
          {isCurrentUser && <span className="ml-1 text-[9px] font-mono text-foreground/40">(you)</span>}
        </p>
        {entry.current_streak > 0 && (
          <p className="flex items-center justify-center gap-1 text-[10px] font-mono text-foreground/40 mt-0.5">
            <Flame className="w-2.5 h-2.5" /> {entry.current_streak}d streak
          </p>
        )}
      </div>

      <div className="w-full space-y-1.5">
        <div className="flex items-center justify-center gap-1.5">
          <Zap className={`w-3.5 h-3.5 ${color.text}`} />
          <span className={`font-mono font-bold tabular-nums ${isFirst ? 'text-lg' : 'text-base'}`}>
            <AnimatedNumber value={entry.total_xp ?? 0} />
          </span>
          <span className="text-[10px] font-mono text-foreground/40">XP</span>
        </div>
        <div className="h-1 rounded-full bg-foreground/[0.06] overflow-hidden">
          <motion.div
            className={`h-full rounded-full bg-gradient-to-r ${color.bg.replace('/20', '/60').replace('/10', '/40')}`}
            initial={{ width: 0 }}
            animate={{ width: `${maxXp > 0 ? ((entry.total_xp ?? 0) / maxXp) * 100 : 0}%` }}
            transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
          />
        </div>
      </div>
    </motion.div>
  )
}

function Avatar({ name, url }: { name: string; url?: string }) {
  const palette = nameToColor(name)

  if (url) {
    return (
      <img
        src={url}
        alt={name}
        className="w-8 h-8 rounded-full object-cover border border-foreground/10"
      />
    )
  }

  const initials = (name || '?')
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${palette.from} ${palette.to} border border-foreground/[0.08] flex items-center justify-center`}>
      <span className={`text-xs font-mono font-semibold ${palette.text}`}>{initials}</span>
    </div>
  )
}

function SkeletonPodium() {
  return (
    <div className="grid grid-cols-3 gap-3">
      {[2, 1, 3].map((rank) => (
        <div key={rank} className={`flex flex-col items-center gap-3 rounded-2xl border border-foreground/[0.06] bg-foreground/[0.02] p-5 ${rank === 1 ? 'pt-8' : ''}`}>
          <div className={`${rank === 1 ? 'w-16 h-16' : 'w-12 h-12'} rounded-full bg-foreground/[0.06] animate-pulse`} />
          <div className="w-20 h-3 rounded bg-foreground/[0.06] animate-pulse" />
          <div className="w-16 h-4 rounded bg-foreground/[0.05] animate-pulse" />
          <div className="w-full h-1 rounded-full bg-foreground/[0.04] animate-pulse" />
        </div>
      ))}
    </div>
  )
}

function SkeletonRow({ index }: { index: number }) {
  return (
    <motion.div
      className="flex items-center gap-3 px-4 py-3"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
    >
      <div className="w-6 h-4 rounded bg-foreground/[0.06] animate-pulse" />
      <div className="w-8 h-8 rounded-full bg-foreground/[0.06] animate-pulse" />
      <div className="flex-1 space-y-1.5">
        <div
          className="h-3.5 rounded bg-foreground/[0.06] animate-pulse"
          style={{ width: `${60 + Math.random() * 25}%` }}
        />
      </div>
      <div className="w-14 h-4 rounded bg-foreground/[0.05] animate-pulse" />
    </motion.div>
  )
}

export function Leaderboard({ entries, currentUserId, title, loading }: LeaderboardProps) {
  const { t } = useTranslation()

  if (loading) {
    return (
      <div className="space-y-6">
        <SkeletonPodium />
        <div className="space-y-3">
          <h2 className="text-sm font-mono uppercase tracking-wider text-foreground/40">{title}</h2>
          <div className="rounded-xl border border-foreground/[0.08] bg-foreground/[0.02] overflow-hidden divide-y divide-foreground/[0.06]">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonRow key={i} index={i} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (entries.length === 0) {
    return (
      <div className="space-y-3">
        <h2 className="text-sm font-mono uppercase tracking-wider text-foreground/40">{title}</h2>
        <div className="rounded-xl border border-foreground/[0.08] bg-foreground/[0.02] overflow-hidden">
          <div className="p-10 text-center">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              className="flex items-center justify-center w-14 h-14 rounded-full bg-foreground/[0.04] border border-foreground/[0.08] mx-auto mb-4"
            >
              <Trophy className="w-6 h-6 text-foreground/25" />
            </motion.div>
            <p className="text-sm text-foreground/50 mb-1">{t('leaderboardComponent.noRankings')}</p>
            <p className="text-xs text-foreground/30 font-mono mb-4">
              {t('leaderboardComponent.noRankingsDesc')}
            </p>
            <Link
              to="/course/modules/foundations/lessons/what-is-agentic"
              className="inline-flex items-center gap-1.5 text-xs font-mono text-foreground/50 hover:text-foreground/70 transition-colors px-3 py-1.5 rounded-lg border border-foreground/[0.08] hover:bg-foreground/[0.04]"
            >
              <Zap className="w-3 h-3" />
              {t('leaderboardComponent.startFirstLesson')}
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const topThree = entries.filter((e) => e.rank <= 3)
  const rest = entries.filter((e) => e.rank > 3)
  const maxXp = entries[0]?.total_xp ?? 1

  return (
    <div className="space-y-6">
      {/* Podium — top 3 */}
      {topThree.length > 0 && (
        <div className="grid grid-cols-3 gap-3 items-end">
          {[2, 1, 3].map((targetRank) => {
            const entry = topThree.find((e) => e.rank === targetRank)
            if (!entry) return <div key={targetRank} />
            return (
              <PodiumCard
                key={entry.user_id}
                entry={entry}
                isCurrentUser={entry.user_id === currentUserId}
                maxXp={maxXp}
              />
            )
          })}
        </div>
      )}

      {/* Rest of leaderboard */}
      {rest.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-mono uppercase tracking-wider text-foreground/40">
            {title}
          </h2>
          <ol aria-label={title} className="rounded-xl border border-foreground/[0.08] bg-foreground/[0.02] overflow-hidden divide-y divide-foreground/[0.06] list-none m-0 p-0">
            {rest.map((entry, index) => {
              const isCurrentUser = entry.user_id === currentUserId
              const xpPercent = maxXp > 0 ? ((entry.total_xp ?? 0) / maxXp) * 100 : 0

              return (
                <motion.li
                  key={entry.user_id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 + index * 0.06 }}
                  aria-label={`Rank ${entry.rank}: ${entry.display_name}, ${(entry.total_xp ?? 0).toLocaleString()} XP${isCurrentUser ? ' (you)' : ''}`}
                  className={`relative flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-3.5 transition-colors list-none group hover:bg-foreground/[0.02] ${
                    isCurrentUser ? 'bg-foreground/[0.05]' : ''
                  }`}
                >
                  {/* Rank */}
                  <span className="w-5 sm:w-6 text-center font-mono text-sm shrink-0 text-foreground/40">
                    {entry.rank}
                  </span>

                  {/* Avatar */}
                  <div className="shrink-0">
                    <Avatar name={entry.display_name} url={entry.avatar_url} />
                  </div>

                  {/* Name + XP bar */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <span className={`block text-sm truncate ${isCurrentUser ? 'font-semibold text-foreground' : 'text-foreground/70'}`}>
                      {entry.display_name}
                      {isCurrentUser && (
                        <span className="ml-1 sm:ml-2 text-[10px] font-mono text-foreground/40">(you)</span>
                      )}
                    </span>
                    <div className="h-0.5 rounded-full bg-foreground/[0.04] overflow-hidden">
                      <motion.div
                        className="h-full rounded-full bg-foreground/15"
                        initial={{ width: 0 }}
                        animate={{ width: `${xpPercent}%` }}
                        transition={{ duration: 0.6, delay: 0.5 + index * 0.06, ease: 'easeOut' }}
                      />
                    </div>
                  </div>

                  {/* Streak */}
                  {entry.current_streak > 0 && (
                    <span className="hidden sm:flex items-center gap-1 text-[11px] font-mono text-foreground/40 shrink-0">
                      <Flame className="w-3 h-3" />
                      {entry.current_streak}
                    </span>
                  )}

                  {/* XP */}
                  <span className="font-mono text-xs sm:text-sm text-foreground/60 tabular-nums flex items-center gap-1 shrink-0">
                    <Zap className="w-3 h-3" />
                    <AnimatedNumber value={entry.total_xp ?? 0} />
                  </span>
                </motion.li>
              )
            })}
          </ol>
        </div>
      )}
    </div>
  )
}
