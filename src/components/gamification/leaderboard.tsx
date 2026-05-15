import { motion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Flame, Trophy, Zap } from 'lucide-react'
import type { LeaderboardEntry } from '@/lib/leaderboard-api'

interface LeaderboardProps {
  entries: LeaderboardEntry[]
  currentUserId?: string
  title: string
  loading?: boolean
}

function Avatar({ name, url }: { name: string; url?: string }) {
  if (url) {
    return (
      <img
        src={url}
        alt={name}
        className="w-8 h-8 rounded-full object-cover border border-foreground/10"
      />
    )
  }

  const initials = name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <div className="w-8 h-8 rounded-full bg-foreground/10 border border-foreground/[0.08] flex items-center justify-center">
      <span className="text-xs font-mono font-semibold text-foreground/60">{initials}</span>
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
      <div className="space-y-3">
        <h2 className="text-sm font-mono uppercase tracking-wider text-foreground/40">
          {title}
        </h2>
        <div className="rounded-xl border border-foreground/[0.08] bg-foreground/[0.02] overflow-hidden divide-y divide-foreground/[0.06]">
          {Array.from({ length: 5 }).map((_, i) => (
            <SkeletonRow key={i} index={i} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <h2 className="text-sm font-mono uppercase tracking-wider text-foreground/40">
        {title}
      </h2>
      <ol aria-label={title} className="rounded-xl border border-foreground/[0.08] bg-foreground/[0.02] overflow-hidden divide-y divide-foreground/[0.06] list-none m-0 p-0">
        {entries.length === 0 && (
          <li className="p-10 text-center list-none">
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
          </li>
        )}
        {entries.map((entry, index) => {
          const isCurrentUser = entry.user_id === currentUserId
          const isTopThree = entry.rank <= 3

          return (
            <motion.li
              key={entry.user_id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              aria-label={`Rank ${entry.rank}: ${entry.display_name}, ${(entry.total_xp ?? 0).toLocaleString()} XP${isCurrentUser ? ' (you)' : ''}`}
              className={`flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-3 transition-colors list-none ${
                isCurrentUser ? 'bg-foreground/[0.05]' : ''
              }`}
            >
              {/* Rank */}
              <span
                className={`w-5 sm:w-6 text-center font-mono text-sm shrink-0 ${
                  isTopThree ? 'font-bold text-foreground/80' : 'text-foreground/40'
                }`}
              >
                {entry.rank}
              </span>

              {/* Avatar */}
              <div className="shrink-0">
                <Avatar name={entry.display_name} url={entry.avatar_url} />
              </div>

              {/* Name */}
              <span
                className={`flex-1 text-sm truncate min-w-0 ${
                  isTopThree ? 'font-semibold text-foreground/90' : 'text-foreground/70'
                } ${isCurrentUser ? 'text-foreground' : ''}`}
              >
                {entry.display_name}
                {isCurrentUser && (
                  <span className="ml-1 sm:ml-2 text-[10px] font-mono text-foreground/40">(you)</span>
                )}
              </span>

              {/* Streak - hidden on very small screens to prevent overflow */}
              {entry.current_streak > 0 && (
                <span className="hidden sm:flex items-center gap-1 text-[11px] font-mono text-foreground/40 shrink-0">
                  <Flame className="w-3 h-3" />
                  {entry.current_streak}
                </span>
              )}

              {/* XP */}
              <span className="font-mono text-xs sm:text-sm text-foreground/60 tabular-nums flex items-center gap-1 shrink-0">
                <Zap className="w-3 h-3" />
                {(entry.total_xp ?? 0).toLocaleString()}
              </span>
            </motion.li>
          )
        })}
      </ol>
    </div>
  )
}
