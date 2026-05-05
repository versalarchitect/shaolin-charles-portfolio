import { motion } from 'framer-motion'
import { Flame, Zap } from 'lucide-react'
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

function SkeletonRow() {
  return (
    <div className="flex items-center gap-3 p-3 animate-pulse">
      <div className="w-6 h-4 rounded bg-foreground/[0.08]" />
      <div className="w-8 h-8 rounded-full bg-foreground/[0.08]" />
      <div className="flex-1 h-4 rounded bg-foreground/[0.08]" />
      <div className="w-16 h-4 rounded bg-foreground/[0.08]" />
    </div>
  )
}

export function Leaderboard({ entries, currentUserId, title, loading }: LeaderboardProps) {
  if (loading) {
    return (
      <div className="space-y-3">
        <h2 className="text-sm font-mono uppercase tracking-wider text-foreground/40">
          {title}
        </h2>
        <div className="rounded-xl border border-foreground/[0.08] bg-foreground/[0.02] overflow-hidden divide-y divide-foreground/[0.06]">
          {Array.from({ length: 5 }).map((_, i) => (
            <SkeletonRow key={i} />
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
      <div className="rounded-xl border border-foreground/[0.08] bg-foreground/[0.02] overflow-hidden divide-y divide-foreground/[0.06]">
        {entries.length === 0 && (
          <div className="p-6 text-center text-sm text-foreground/40">
            No entries yet. Start earning XP to appear here.
          </div>
        )}
        {entries.map((entry, index) => {
          const isCurrentUser = entry.user_id === currentUserId
          const isTopThree = entry.rank <= 3

          return (
            <motion.div
              key={entry.user_id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className={`flex items-center gap-3 px-4 py-3 transition-colors ${
                isCurrentUser ? 'bg-foreground/[0.05]' : ''
              }`}
            >
              {/* Rank */}
              <span
                className={`w-6 text-center font-mono text-sm ${
                  isTopThree ? 'font-bold text-foreground/80' : 'text-foreground/40'
                }`}
              >
                {entry.rank}
              </span>

              {/* Avatar */}
              <Avatar name={entry.display_name} url={entry.avatar_url} />

              {/* Name */}
              <span
                className={`flex-1 text-sm truncate ${
                  isTopThree ? 'font-semibold text-foreground/90' : 'text-foreground/70'
                } ${isCurrentUser ? 'text-foreground' : ''}`}
              >
                {entry.display_name}
                {isCurrentUser && (
                  <span className="ml-2 text-[10px] font-mono text-foreground/40">(you)</span>
                )}
              </span>

              {/* Streak */}
              {entry.current_streak > 0 && (
                <span className="flex items-center gap-1 text-[11px] font-mono text-foreground/40">
                  <Flame className="w-3 h-3" />
                  {entry.current_streak}
                </span>
              )}

              {/* XP */}
              <span className="font-mono text-sm text-foreground/60 tabular-nums flex items-center gap-1">
                <Zap className="w-3 h-3" />
                {entry.total_xp.toLocaleString()}
              </span>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
