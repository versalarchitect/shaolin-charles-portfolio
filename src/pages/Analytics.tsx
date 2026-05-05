import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Calendar, Clock, Award, PieChart } from 'lucide-react'
import { SEO } from '@/components/SEO'
import { useProgress, getXpLog, getToolMastery } from '@/stores/progress'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(d: Date): string {
  return d.toISOString().split('T')[0]
}

function getDayLabel(d: Date): string {
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function getDaysAgo(n: number): Date {
  const d = new Date()
  d.setDate(d.getDate() - n)
  d.setHours(0, 0, 0, 0)
  return d
}

const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const TIME_SLOTS = ['Morning', 'Afternoon', 'Evening', 'Night'] as const

function getTimeSlot(hour: number): typeof TIME_SLOTS[number] {
  if (hour >= 5 && hour < 12) return 'Morning'
  if (hour >= 12 && hour < 17) return 'Afternoon'
  if (hour >= 17 && hour < 21) return 'Evening'
  return 'Night'
}

// ─── Section Wrapper ──────────────────────────────────────────────────────────

function AnalyticsSection({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-xl border border-foreground/[0.08] bg-foreground/[0.02] p-6"
    >
      <div className="flex items-center gap-2 mb-4">
        <Icon className="w-4 h-4 text-foreground/60" />
        <h2 className="text-sm font-mono font-semibold text-foreground/80">{title}</h2>
      </div>
      {children}
    </motion.div>
  )
}

// ─── XP Over Time (SVG Line Chart) ───────────────────────────────────────────

function XpOverTimeChart() {
  const progress = useProgress()
  const xpLog = getXpLog()

  const data = useMemo(() => {
    // Build daily XP map from streakDates and xpLog
    const dailyXp: Record<string, number> = {}

    // Initialize last 30 days
    for (let i = 29; i >= 0; i--) {
      const d = formatDate(getDaysAgo(i))
      dailyXp[d] = 0
    }

    // Add XP from log events
    for (const event of xpLog) {
      const date = event.timestamp.split('T')[0]
      if (dailyXp[date] !== undefined) {
        dailyXp[date] += event.xp
      }
    }

    // Also add from lesson progress completedAt timestamps
    for (const [, lp] of Object.entries(progress.lessonProgress)) {
      if (lp.status === 'completed' && lp.completedAt) {
        const date = lp.completedAt.split('T')[0]
        if (dailyXp[date] !== undefined) {
          dailyXp[date] += lp.xpEarned
        }
      }
    }

    // Build cumulative data
    const dates = Object.keys(dailyXp).sort()
    let cumulative = 0
    return dates.map((date) => {
      cumulative += dailyXp[date]
      return { date, xp: cumulative }
    })
  }, [progress.lessonProgress, xpLog])

  const hasData = data.some((d) => d.xp > 0)

  if (!hasData) {
    return (
      <div className="flex items-center justify-center h-[200px] text-sm font-mono text-foreground/40">
        Complete lessons to see your XP trend
      </div>
    )
  }

  const maxXp = Math.max(...data.map((d) => d.xp), 1)
  const width = 600
  const height = 200
  const padding = { top: 20, right: 20, bottom: 30, left: 50 }
  const chartW = width - padding.left - padding.right
  const chartH = height - padding.top - padding.bottom

  const points = data.map((d, i) => ({
    x: padding.left + (i / (data.length - 1)) * chartW,
    y: padding.top + chartH - (d.xp / maxXp) * chartH,
  }))

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${padding.top + chartH} L ${points[0].x} ${padding.top + chartH} Z`

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-[200px]" preserveAspectRatio="none">
      <defs>
        <linearGradient id="xp-area-gradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" className="[stop-color:currentColor]" stopOpacity="0.15" />
          <stop offset="100%" className="[stop-color:currentColor]" stopOpacity="0.02" />
        </linearGradient>
      </defs>

      {/* Y-axis labels */}
      {[0, 0.25, 0.5, 0.75, 1].map((frac) => {
        const y = padding.top + chartH - frac * chartH
        const val = Math.round(frac * maxXp)
        return (
          <g key={frac}>
            <line x1={padding.left} y1={y} x2={padding.left + chartW} y2={y} stroke="currentColor" strokeOpacity="0.06" strokeWidth="0.5" />
            <text x={padding.left - 8} y={y + 3} textAnchor="end" className="fill-foreground/40 text-[8px] font-mono">
              {val}
            </text>
          </g>
        )
      })}

      {/* X-axis date labels (every 5th) */}
      {data.map((d, i) => {
        if (i % 5 !== 0 && i !== data.length - 1) return null
        const x = padding.left + (i / (data.length - 1)) * chartW
        return (
          <text key={d.date} x={x} y={height - 5} textAnchor="middle" className="fill-foreground/40 text-[7px] font-mono">
            {getDayLabel(new Date(d.date + 'T00:00:00'))}
          </text>
        )
      })}

      {/* Area fill */}
      <path d={areaPath} fill="url(#xp-area-gradient)" className="text-foreground" />

      {/* Line */}
      <path d={linePath} fill="none" stroke="currentColor" strokeOpacity="0.4" strokeWidth="1.5" className="text-foreground" />

      {/* Plot points */}
      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="2" className="fill-foreground/30" />
      ))}
    </svg>
  )
}

// ─── Activity Heatmap (90-day GitHub-style) ──────────────────────────────────

function ActivityHeatmap() {
  const progress = useProgress()
  const xpLog = getXpLog()
  const [hovered, setHovered] = useState<{ date: string; xp: number; x: number; y: number } | null>(null)

  const { grid, months } = useMemo(() => {
    // Build daily XP for last 90 days
    const dailyXp: Record<string, number> = {}
    for (let i = 89; i >= 0; i--) {
      dailyXp[formatDate(getDaysAgo(i))] = 0
    }

    for (const event of xpLog) {
      const date = event.timestamp.split('T')[0]
      if (dailyXp[date] !== undefined) dailyXp[date] += event.xp
    }

    for (const [, lp] of Object.entries(progress.lessonProgress)) {
      if (lp.status === 'completed' && lp.completedAt) {
        const date = lp.completedAt.split('T')[0]
        if (dailyXp[date] !== undefined) dailyXp[date] += lp.xpEarned
      }
    }

    // Organize into weeks (7 rows x 13 cols)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const startDate = getDaysAgo(89)

    // Adjust start to previous Monday
    const startDay = startDate.getDay()
    const offset = startDay === 0 ? 6 : startDay - 1 // Mon=0
    startDate.setDate(startDate.getDate() - offset)

    const grid: { date: string; xp: number; col: number; row: number }[] = []
    const monthSet: { label: string; col: number }[] = []
    let prevMonth = -1

    const current = new Date(startDate)
    let col = 0
    let row = 0

    while (col < 13) {
      row = 0
      while (row < 7) {
        const dateStr = formatDate(current)
        const xp = dailyXp[dateStr] || 0
        grid.push({ date: dateStr, xp, col, row })

        const month = current.getMonth()
        if (month !== prevMonth) {
          monthSet.push({ label: current.toLocaleDateString('en-US', { month: 'short' }), col })
          prevMonth = month
        }

        current.setDate(current.getDate() + 1)
        row++
      }
      col++
    }

    return { grid, months: monthSet }
  }, [progress.lessonProgress, xpLog])

  // Determine intensity levels
  const maxDayXp = Math.max(...grid.map((g) => g.xp), 1)

  function getOpacity(xp: number): string {
    if (xp === 0) return 'bg-foreground/[0.03]'
    const ratio = xp / maxDayXp
    if (ratio < 0.25) return 'bg-foreground/[0.1]'
    if (ratio < 0.5) return 'bg-foreground/[0.2]'
    if (ratio < 0.75) return 'bg-foreground/[0.35]'
    return 'bg-foreground/[0.5]'
  }

  const cellSize = 14
  const gap = 3

  return (
    <div className="relative">
      {/* Month labels */}
      <div className="flex mb-1 ml-6" style={{ gap: `${(cellSize + gap) * 0}px` }}>
        {months.map((m, i) => (
          <span
            key={`${m.label}-${i}`}
            className="text-[9px] font-mono text-foreground/40 absolute"
            style={{ left: `${24 + m.col * (cellSize + gap)}px` }}
          >
            {m.label}
          </span>
        ))}
      </div>

      <div className="flex gap-0.5 mt-4 relative">
        {/* Day labels */}
        <div className="flex flex-col justify-between mr-1" style={{ height: `${7 * (cellSize + gap) - gap}px` }}>
          {['M', '', 'W', '', 'F', '', 'S'].map((label, i) => (
            <span key={i} className="text-[8px] font-mono text-foreground/30 leading-none" style={{ height: `${cellSize}px`, display: 'flex', alignItems: 'center' }}>
              {label}
            </span>
          ))}
        </div>

        {/* Grid */}
        <div
          className="grid"
          style={{
            gridTemplateRows: `repeat(7, ${cellSize}px)`,
            gridTemplateColumns: `repeat(13, ${cellSize}px)`,
            gap: `${gap}px`,
          }}
        >
          {grid.map((cell) => (
            <div
              key={cell.date}
              className={`rounded-[2px] cursor-default transition-opacity ${getOpacity(cell.xp)}`}
              style={{ gridRow: cell.row + 1, gridColumn: cell.col + 1 }}
              onMouseEnter={(e) => {
                const rect = (e.target as HTMLElement).getBoundingClientRect()
                setHovered({ date: cell.date, xp: cell.xp, x: rect.left, y: rect.top })
              }}
              onMouseLeave={() => setHovered(null)}
            />
          ))}
        </div>
      </div>

      {/* Tooltip */}
      {hovered && (
        <div
          className="fixed z-50 px-2 py-1 rounded bg-background border border-foreground/10 shadow-lg pointer-events-none"
          style={{ left: hovered.x, top: hovered.y - 32 }}
        >
          <span className="text-[10px] font-mono text-foreground/70">
            {hovered.date}: {hovered.xp} XP
          </span>
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center gap-1.5 mt-3 justify-end">
        <span className="text-[9px] font-mono text-foreground/40">Less</span>
        {['bg-foreground/[0.03]', 'bg-foreground/[0.1]', 'bg-foreground/[0.2]', 'bg-foreground/[0.35]', 'bg-foreground/[0.5]'].map((cls, i) => (
          <div key={i} className={`w-3 h-3 rounded-[2px] ${cls}`} />
        ))}
        <span className="text-[9px] font-mono text-foreground/40">More</span>
      </div>
    </div>
  )
}

// ─── Study Patterns ──────────────────────────────────────────────────────────

function StudyPatterns() {
  const progress = useProgress()
  const xpLog = getXpLog()

  const { dayOfWeekXp, timeOfDayXp } = useMemo(() => {
    const dayOfWeekXp = [0, 0, 0, 0, 0, 0, 0] // Mon-Sun
    const timeOfDayXp = [0, 0, 0, 0] // Morning, Afternoon, Evening, Night

    // From XP log
    for (const event of xpLog) {
      const d = new Date(event.timestamp)
      const dayIdx = d.getDay() === 0 ? 6 : d.getDay() - 1 // Convert Sun=0 to Mon=0
      dayOfWeekXp[dayIdx] += event.xp

      const slot = TIME_SLOTS.indexOf(getTimeSlot(d.getHours()))
      timeOfDayXp[slot] += event.xp
    }

    // From lesson completions
    for (const [, lp] of Object.entries(progress.lessonProgress)) {
      if (lp.status === 'completed' && lp.completedAt) {
        const d = new Date(lp.completedAt)
        const dayIdx = d.getDay() === 0 ? 6 : d.getDay() - 1
        dayOfWeekXp[dayIdx] += lp.xpEarned

        const slot = TIME_SLOTS.indexOf(getTimeSlot(d.getHours()))
        timeOfDayXp[slot] += lp.xpEarned
      }
    }

    return { dayOfWeekXp, timeOfDayXp }
  }, [progress.lessonProgress, xpLog])

  const maxDay = Math.max(...dayOfWeekXp, 1)
  const maxTime = Math.max(...timeOfDayXp, 1)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Day of Week */}
      <div>
        <p className="text-xs font-mono text-foreground/50 mb-3">XP by Day of Week</p>
        <div className="flex items-end gap-2 h-[100px]">
          {dayOfWeekXp.map((xp, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full flex flex-col items-center justify-end h-[80px]">
                <div
                  className="w-full max-w-[28px] rounded-t bg-foreground/20 transition-all"
                  style={{ height: `${Math.max((xp / maxDay) * 100, 2)}%` }}
                />
              </div>
              <span className="text-[9px] font-mono text-foreground/40">{DAY_NAMES[i]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Time of Day */}
      <div>
        <p className="text-xs font-mono text-foreground/50 mb-3">XP by Time of Day</p>
        <div className="flex items-end gap-3 h-[100px]">
          {timeOfDayXp.map((xp, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full flex flex-col items-center justify-end h-[80px]">
                <div
                  className="w-full max-w-[40px] rounded-t bg-foreground/20 transition-all"
                  style={{ height: `${Math.max((xp / maxTime) * 100, 2)}%` }}
                />
              </div>
              <span className="text-[9px] font-mono text-foreground/40">{TIME_SLOTS[i]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Personal Records ────────────────────────────────────────────────────────

function PersonalRecords() {
  const progress = useProgress()
  const xpLog = getXpLog()

  const records = useMemo(() => {
    // Best single-day XP
    const dailyXp: Record<string, number> = {}
    for (const event of xpLog) {
      const date = event.timestamp.split('T')[0]
      dailyXp[date] = (dailyXp[date] || 0) + event.xp
    }
    for (const [, lp] of Object.entries(progress.lessonProgress)) {
      if (lp.status === 'completed' && lp.completedAt) {
        const date = lp.completedAt.split('T')[0]
        dailyXp[date] = (dailyXp[date] || 0) + lp.xpEarned
      }
    }
    const bestDayXp = Math.max(...Object.values(dailyXp), 0)

    // Most lessons in one day
    const dailyLessons: Record<string, number> = {}
    for (const [, lp] of Object.entries(progress.lessonProgress)) {
      if (lp.status === 'completed' && lp.completedAt) {
        const date = lp.completedAt.split('T')[0]
        dailyLessons[date] = (dailyLessons[date] || 0) + 1
      }
    }
    const mostLessonsInDay = Math.max(...Object.values(dailyLessons), 0)

    // Highest combo
    const highestCombo = progress.comboCount

    // Longest streak
    const longestStreak = progress.longestStreak

    return [
      { label: 'Best Single-Day XP', value: bestDayXp, suffix: 'XP' },
      { label: 'Longest Streak', value: longestStreak, suffix: 'days' },
      { label: 'Most Lessons in a Day', value: mostLessonsInDay, suffix: 'lessons' },
      { label: 'Highest Combo', value: highestCombo, suffix: 'x' },
    ]
  }, [progress, xpLog])

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {records.map((record) => (
        <div
          key={record.label}
          className="rounded-lg border border-foreground/[0.08] bg-foreground/[0.03] p-4 text-center"
        >
          <p className="text-2xl font-mono font-bold text-foreground/80">
            {record.value}
            <span className="text-xs font-normal text-foreground/40 ml-1">{record.suffix}</span>
          </p>
          <p className="text-[10px] font-mono text-foreground/50 mt-1">{record.label}</p>
        </div>
      ))}
    </div>
  )
}

// ─── Tool Distribution (CSS Conic Gradient Donut) ────────────────────────────

function ToolDistribution() {
  const toolMastery = getToolMastery()

  if (toolMastery.length === 0) {
    return (
      <div className="flex items-center justify-center h-[160px] text-sm font-mono text-foreground/40">
        Complete lessons to see tool distribution
      </div>
    )
  }

  const totalXp = toolMastery.reduce((sum, t) => sum + t.xp, 0)

  // Build conic gradient stops
  const opacityLevels = [0.5, 0.4, 0.3, 0.2, 0.15, 0.1, 0.08, 0.06]
  let accumulated = 0
  const stops: string[] = []

  toolMastery.forEach((tool, i) => {
    const pct = (tool.xp / totalXp) * 100
    const opacity = opacityLevels[i % opacityLevels.length]
    stops.push(`rgba(var(--effect-rgb), ${opacity}) ${accumulated}%`)
    accumulated += pct
    stops.push(`rgba(var(--effect-rgb), ${opacity}) ${accumulated}%`)
  })

  const conicGradient = `conic-gradient(${stops.join(', ')})`

  return (
    <div className="flex flex-col md:flex-row items-center gap-6">
      {/* Donut */}
      <div className="relative w-[140px] h-[140px] shrink-0">
        <div
          className="w-full h-full rounded-full"
          style={{ background: conicGradient }}
        />
        <div className="absolute inset-[30px] rounded-full bg-background" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-mono text-foreground/50">{totalXp} XP</span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-1.5 w-full">
        {toolMastery.slice(0, 8).map((tool, i) => (
          <div key={tool.tool} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-[2px] shrink-0"
              style={{ background: `rgba(var(--effect-rgb), ${opacityLevels[i % opacityLevels.length]})` }}
            />
            <span className="text-[11px] font-mono text-foreground/60 truncate">{tool.tool}</span>
            <span className="text-[10px] font-mono text-foreground/40 ml-auto">{tool.xp}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function Analytics() {
  return (
    <>
      <SEO
        title="Analytics | Agentic SaaS"
        description="Detailed progress analytics and study patterns"
      />

      <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-xl font-mono font-bold text-foreground/90">Analytics</h1>
          <p className="text-sm font-mono text-foreground/50 mt-1">Your learning patterns and progress data</p>
        </div>

        {/* XP Over Time */}
        <AnalyticsSection title="XP Over Time" icon={TrendingUp}>
          <XpOverTimeChart />
        </AnalyticsSection>

        {/* Activity Heatmap */}
        <AnalyticsSection title="Activity Heatmap" icon={Calendar}>
          <ActivityHeatmap />
        </AnalyticsSection>

        {/* Study Patterns */}
        <AnalyticsSection title="Study Patterns" icon={Clock}>
          <StudyPatterns />
        </AnalyticsSection>

        {/* Personal Records */}
        <AnalyticsSection title="Personal Records" icon={Award}>
          <PersonalRecords />
        </AnalyticsSection>

        {/* Tool Distribution */}
        <AnalyticsSection title="Tool Distribution" icon={PieChart}>
          <ToolDistribution />
        </AnalyticsSection>
      </div>
    </>
  )
}
