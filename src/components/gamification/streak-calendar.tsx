import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Flame } from 'lucide-react'
import { useProgress } from '@/stores/progress'

export function StreakCalendar({ days: dayCount = 30 }: { days?: number }) {
  const progress = useProgress()
  const { t } = useTranslation()

  const days = useMemo(() => {
    const result: { date: string; active: boolean }[] = []
    const now = new Date()
    for (let i = dayCount - 1; i >= 0; i--) {
      const d = new Date(now)
      d.setDate(d.getDate() - i)
      const dateStr = d.toISOString().split('T')[0]
      result.push({
        date: dateStr,
        active: progress.streakDates.includes(dateStr),
      })
    }
    return result
  }, [progress.streakDates, dayCount])

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-mono uppercase tracking-wider text-foreground/40">
          {t('streakCalendar.activity')} — {t('streakCalendar.lastDays').replace('{count}', String(dayCount))}
        </h2>
        <div className="flex items-center gap-1.5">
          <Flame className="w-3.5 h-3.5 text-foreground/50" />
          <span className="text-sm font-mono font-semibold">{progress.currentStreak}</span>
          <span className="text-[10px] text-foreground/40 font-mono">{t('streakCalendar.dayStreak')}</span>
        </div>
      </div>

      <div className="rounded-xl border border-foreground/[0.08] bg-foreground/[0.02] p-4">
        <div className="grid grid-cols-10 gap-[3px]">
          {days.map((day) => (
            <div
              key={day.date}
              className={`aspect-square rounded-[3px] transition-colors ${day.active ? 'bg-foreground/25 border border-foreground/30' : 'bg-foreground/[0.04] border border-foreground/[0.06]'}`}
              title={`${day.date}${day.active ? ' — Active' : ''}`}
            />
          ))}
        </div>
        <div className="flex items-center gap-2 mt-3 justify-end">
          <span className="text-[9px] font-mono text-foreground/25">{t('streakCalendar.less')}</span>
          <div className="flex gap-1">
            {['bg-foreground/[0.04]', 'bg-foreground/10', 'bg-foreground/[0.18]', 'bg-foreground/25'].map((cls, i) => (
              <div key={i} className={`w-[8px] h-[8px] rounded-[2px] ${cls} border border-foreground/[0.08]`} />
            ))}
          </div>
          <span className="text-[9px] font-mono text-foreground/25">{t('streakCalendar.more')}</span>
        </div>
      </div>
    </div>
  )
}
