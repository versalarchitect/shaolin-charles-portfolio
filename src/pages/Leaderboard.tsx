import { useEffect, useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'motion/react'
import { Trophy, Zap, RefreshCw } from 'lucide-react'
import { SEO } from '@/components/SEO'
import { Leaderboard } from '@/components/gamification/leaderboard'
import { useAuth } from '@/hooks/use-auth'
import {
  fetchGlobalLeaderboard,
  fetchWeeklyLeaderboard,
  fetchUserRank,
} from '@/lib/leaderboard-api'
import type { LeaderboardEntry } from '@/lib/leaderboard-api'

type Tab = 'all-time' | 'weekly'

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

      // Fetch user rank if logged in and not already in top 10
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
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-1">{t('leaderboardPage.title')}</h1>
          <p className="text-sm text-muted-foreground">
            {t('leaderboardPage.subtitle')}
          </p>
        </div>

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
            className="rounded-xl border border-foreground/10 bg-foreground/[0.03] p-4 sm:p-5"
          >
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-foreground/10 shrink-0">
                <Trophy className="w-5 h-5 text-foreground/60" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-mono text-foreground/40 uppercase tracking-wider mb-0.5">
                  {t('leaderboardPage.yourPosition')}
                </p>
                <p className="text-lg font-mono font-semibold text-foreground/90">
                  #{userRank}
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
