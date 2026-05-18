import { useEffect, useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'motion/react'
import { Trophy, Zap, RefreshCw, Users, Flame, TrendingUp } from 'lucide-react'
import { SEO } from '@/components/SEO'
import { Leaderboard } from '@/components/gamification/leaderboard'
import { AnimatedNumber } from '@/components/ui/aaa-effects'
import { useAuth } from '@/hooks/use-auth'
import {
  fetchGlobalLeaderboard,
  fetchWeeklyLeaderboard,
  fetchUserRank,
} from '@/lib/leaderboard-api'
import type { LeaderboardEntry } from '@/lib/leaderboard-api'

type Tab = 'all-time' | 'weekly'

function StatCard({ icon: Icon, label, value, delay }: { icon: React.ElementType; label: string; value: number; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="rounded-xl border border-foreground/[0.08] bg-gradient-to-br from-foreground/[0.03] to-transparent p-4 space-y-2"
    >
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-foreground/[0.06] border border-foreground/[0.08] flex items-center justify-center">
          <Icon className="w-3.5 h-3.5 text-foreground/50" />
        </div>
        <span className="text-[10px] font-mono uppercase tracking-wider text-foreground/40">{label}</span>
      </div>
      <p className="text-2xl font-mono font-bold text-foreground/90 tabular-nums">
        <AnimatedNumber value={value} />
      </p>
    </motion.div>
  )
}

export default function LeaderboardPage() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const [tab, setTab] = useState<Tab>('all-time')
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userRank, setUserRank] = useState<number | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data =
        tab === 'all-time'
          ? await fetchGlobalLeaderboard(10)
          : await fetchWeeklyLeaderboard(10)
      setEntries(data)

      if (user) {
        const inList = data.some((e) => e.user_id === user.id)
        if (!inList) {
          const rank = await fetchUserRank(user.id)
          setUserRank(rank)
        } else {
          setUserRank(null)
        }
      }
    } catch (err) {
      console.error('Leaderboard fetch error:', err)
      setError(t('leaderboardPage.couldntLoad'))
    } finally {
      setLoading(false)
    }
  }, [tab, user, t])

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 60_000)
    return () => clearInterval(interval)
  }, [fetchData])

  const tabs: { id: Tab; label: string }[] = [
    { id: 'all-time', label: t('leaderboardPage.allTime') },
    { id: 'weekly', label: t('leaderboardPage.thisWeek') },
  ]

  const totalXp = entries.reduce((sum, e) => sum + (e.total_xp ?? 0), 0)
  const totalPlayers = entries.length
  const topStreak = Math.max(0, ...entries.map((e) => e.current_streak))

  return (
    <>
      <SEO
        title={t('leaderboardPage.title')}
        description={t('leaderboardPage.subtitle')}
        path="course/leaderboard"
        keywords="leaderboard, ranking, xp, gamification"
      />

      <div className="p-6 lg:p-8 max-w-4xl space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-1"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-foreground/[0.06] border border-foreground/[0.08] flex items-center justify-center">
              <Trophy className="w-5 h-5 text-foreground/60" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">{t('leaderboardPage.title')}</h1>
              <p className="text-sm text-muted-foreground">{t('leaderboardPage.subtitle')}</p>
            </div>
          </div>
        </motion.div>

        {/* Stats row */}
        {!loading && entries.length > 0 && (
          <div className="grid grid-cols-3 gap-3">
            <StatCard icon={Users} label="Players" value={totalPlayers} delay={0.1} />
            <StatCard icon={Zap} label="Total XP" value={totalXp} delay={0.15} />
            <StatCard icon={Flame} label="Top Streak" value={topStreak} delay={0.2} />
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 p-1 rounded-lg bg-foreground/[0.04] border border-foreground/[0.08] w-full sm:w-fit">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`relative flex-1 sm:flex-none px-4 py-2 sm:py-1.5 text-sm font-mono rounded-md transition-colors ${
                tab === t.id
                  ? 'text-foreground'
                  : 'text-foreground/50 hover:text-foreground/70'
              }`}
            >
              {tab === t.id && (
                <motion.div
                  layoutId="leaderboard-tab"
                  className="absolute inset-0 rounded-md bg-foreground/10 border border-foreground/[0.08]"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">{t.label}</span>
            </button>
          ))}
        </div>

        {/* Error State */}
        {error && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-foreground/[0.08] bg-foreground/[0.02] p-8 text-center"
          >
            <RefreshCw className="w-6 h-6 mx-auto mb-3 text-foreground/20" />
            <p className="text-sm text-foreground/50 mb-3">{error}</p>
            <button
              onClick={fetchData}
              className="inline-flex items-center gap-2 text-xs font-mono text-foreground/60 hover:text-foreground/80 transition-colors px-3 py-1.5 rounded-lg border border-foreground/[0.08] hover:bg-foreground/[0.04]"
            >
              <RefreshCw className="w-3 h-3" />
              {t('leaderboardPage.retry')}
            </button>
          </motion.div>
        )}

        {/* Leaderboard */}
        {!error && (
          <Leaderboard
            entries={entries}
            currentUserId={user?.id}
            title={tab === 'all-time' ? t('leaderboardPage.topLearnersAllTime') : t('leaderboardPage.topLearnersThisWeek')}
            loading={loading}
          />
        )}

        {/* User's position if not in top 10 */}
        {userRank && userRank > 10 && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="rounded-2xl border border-foreground/10 bg-gradient-to-br from-foreground/[0.04] to-transparent p-5"
          >
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-foreground/[0.06] border border-foreground/[0.08] shrink-0">
                <TrendingUp className="w-5 h-5 text-foreground/50" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-mono text-foreground/40 uppercase tracking-wider mb-0.5">
                  {t('leaderboardPage.yourPosition')}
                </p>
                <p className="text-2xl font-mono font-bold text-foreground/90">
                  #<AnimatedNumber value={userRank} />
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-[10px] font-mono text-foreground/40 uppercase tracking-wider mb-0.5">
                  {t('leaderboardPage.keepGoing')}
                </p>
                <p className="text-xs text-foreground/50 flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  <span className="hidden sm:inline">{t('leaderboardPage.earnXpToClimb')}</span>
                  <span className="sm:hidden">{t('leaderboardPage.earnXp')}</span>
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </>
  )
}
