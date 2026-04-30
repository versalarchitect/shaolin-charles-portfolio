import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Rss,
  Lightbulb,
  Archive,
  Activity,
  CheckCircle2,
  XCircle,
  Loader2,
  FileText,
  ExternalLink,
} from 'lucide-react'
import { SEO } from '@/components/SEO'
import { AnimatedNumber } from '@/components/ui/aaa-effects'
import {
  fetchDashboardStats,
  fetchRecentFacts,
  fetchRecentEvents,
  fetchPipelineRuns,
  type DashboardStats,
  type KnowledgeFactSummary,
  type SourceEventSummary,
  type PipelineRunSummary,
} from '@/lib/instructor-api'

function timeAgo(date: string): string {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000)
  if (seconds < 60) return 'just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  return `${Math.floor(seconds / 86400)}d ago`
}

function formatDuration(start: string, end: string | null): string {
  if (!end) return 'running...'
  const ms = new Date(end).getTime() - new Date(start).getTime()
  if (ms < 1000) return `${ms}ms`
  return `${(ms / 1000).toFixed(1)}s`
}

function StatusDot({ status }: { status: 'running' | 'completed' | 'failed' }) {
  if (status === 'completed') {
    return <span className="w-2 h-2 rounded-full bg-green-500" />
  }
  if (status === 'failed') {
    return <span className="w-2 h-2 rounded-full bg-red-500" />
  }
  return <span className="w-2 h-2 rounded-full bg-foreground/40 animate-pulse" />
}

function LoadingSkeleton() {
  return (
    <div className="p-6 lg:p-8 max-w-4xl space-y-8">
      <div>
        <div className="h-7 w-48 bg-foreground/[0.06] rounded-lg animate-pulse" />
        <div className="h-4 w-80 bg-foreground/[0.04] rounded mt-2 animate-pulse" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-foreground/[0.08] bg-foreground/[0.02] p-4 space-y-3">
            <div className="h-3 w-20 bg-foreground/[0.06] rounded animate-pulse" />
            <div className="h-6 w-12 bg-foreground/[0.08] rounded animate-pulse" />
          </div>
        ))}
      </div>
      <div className="rounded-xl border border-foreground/[0.08] bg-foreground/[0.02] p-4 space-y-3">
        <div className="h-4 w-40 bg-foreground/[0.06] rounded animate-pulse" />
        <div className="h-20 bg-foreground/[0.04] rounded animate-pulse" />
      </div>
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="rounded-xl border border-foreground/[0.08] bg-foreground/[0.02] p-4 space-y-3">
          <div className="h-4 w-36 bg-foreground/[0.06] rounded animate-pulse" />
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, j) => (
              <div key={j} className="h-12 bg-foreground/[0.04] rounded animate-pulse" />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function StatsGrid({ stats }: { stats: DashboardStats }) {
  const items = [
    {
      label: 'Events',
      value: stats.totalEvents,
      icon: Rss,
    },
    {
      label: 'Active Facts',
      value: stats.activeFacts,
      icon: Lightbulb,
    },
    {
      label: 'Superseded',
      value: stats.supersededFacts,
      icon: Archive,
    },
    {
      label: 'Pipeline',
      value: null,
      icon: Activity,
      custom: stats.lastPipelineRun ? (
        <div className="flex items-center gap-2">
          <StatusDot status={stats.lastPipelineRun.status} />
          <span className="text-lg font-mono font-semibold capitalize">
            {stats.lastPipelineRun.status}
          </span>
        </div>
      ) : (
        <span className="text-lg font-mono font-semibold text-foreground/40">No runs</span>
      ),
    },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {items.map((item) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.33, 1, 0.68, 1] }}
          className="rounded-xl border border-foreground/[0.08] bg-foreground/[0.02] p-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <item.icon className="w-4 h-4 text-foreground/60" />
            <span className="text-[10px] font-mono uppercase tracking-wider text-foreground/40">
              {item.label}
            </span>
          </div>
          {item.custom ?? (
            <p className="text-lg font-mono font-semibold">
              <AnimatedNumber value={item.value!} />
            </p>
          )}
        </motion.div>
      ))}
    </div>
  )
}

function PipelineCard({ run }: { run: PipelineRunSummary }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1, ease: [0.33, 1, 0.68, 1] }}
      className="rounded-xl border border-foreground/[0.08] bg-foreground/[0.02] p-4 space-y-4"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-mono uppercase tracking-wider text-foreground/40">
          Last Pipeline Run
        </h2>
        <div className="flex items-center gap-2">
          <StatusDot status={run.status} />
          <span className="text-xs font-mono text-foreground/60 capitalize">{run.status}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div>
          <span className="text-[10px] font-mono uppercase text-foreground/30 block mb-1">Started</span>
          <span className="text-sm font-mono text-foreground/80">{timeAgo(run.started_at)}</span>
        </div>
        <div>
          <span className="text-[10px] font-mono uppercase text-foreground/30 block mb-1">Duration</span>
          <span className="text-sm font-mono text-foreground/80">
            {formatDuration(run.started_at, run.completed_at)}
          </span>
        </div>
        <div>
          <span className="text-[10px] font-mono uppercase text-foreground/30 block mb-1">Events</span>
          <span className="text-sm font-mono text-foreground/80">{run.events_fetched}</span>
        </div>
        <div>
          <span className="text-[10px] font-mono uppercase text-foreground/30 block mb-1">Facts</span>
          <span className="text-sm font-mono text-foreground/80">{run.facts_extracted}</span>
        </div>
      </div>

      {run.error && (
        <div className="rounded-lg bg-red-500/5 border border-red-500/10 p-3">
          <p className="text-xs font-mono text-red-500/80 break-all">{run.error}</p>
        </div>
      )}
    </motion.div>
  )
}

function CategoryBreakdown({ factsByCategory }: { factsByCategory: Record<string, number> }) {
  const entries = Object.entries(factsByCategory).sort((a, b) => b[1] - a[1])
  const max = entries.length > 0 ? entries[0][1] : 1

  if (entries.length === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15, ease: [0.33, 1, 0.68, 1] }}
      className="rounded-xl border border-foreground/[0.08] bg-foreground/[0.02] p-4 space-y-3"
    >
      <h2 className="text-sm font-mono uppercase tracking-wider text-foreground/40">
        Facts by Category
      </h2>
      <div className="space-y-2">
        {entries.map(([category, count]) => (
          <div key={category} className="flex items-center gap-3">
            <span className="text-xs font-mono text-foreground/60 w-28 truncate shrink-0">
              {category}
            </span>
            <div className="flex-1 h-2 rounded-full bg-foreground/[0.05] overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-foreground/20"
                initial={{ width: 0 }}
                animate={{ width: `${(count / max) * 100}%` }}
                transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
              />
            </div>
            <span className="text-xs font-mono text-foreground/40 w-6 text-right shrink-0">
              {count}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

function RecentFacts({ facts }: { facts: KnowledgeFactSummary[] }) {
  if (facts.length === 0) {
    return (
      <div className="rounded-xl border border-foreground/[0.08] bg-foreground/[0.02] p-4">
        <h2 className="text-sm font-mono uppercase tracking-wider text-foreground/40 mb-3">
          Recent Facts
        </h2>
        <p className="text-sm text-foreground/40 text-center py-6">No facts extracted yet.</p>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2, ease: [0.33, 1, 0.68, 1] }}
      className="rounded-xl border border-foreground/[0.08] bg-foreground/[0.02] p-4 space-y-3"
    >
      <h2 className="text-sm font-mono uppercase tracking-wider text-foreground/40">
        Recent Facts
      </h2>
      <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
        {facts.map((fact) => (
          <div
            key={fact.id}
            className={`rounded-lg border p-3 space-y-2 ${
              fact.superseded_by
                ? 'border-foreground/[0.05] bg-foreground/[0.01] opacity-60'
                : 'border-foreground/[0.08] bg-foreground/[0.02]'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm text-foreground/80 leading-relaxed line-clamp-2">
                {fact.statement}
              </p>
              <span className="text-xs font-mono text-foreground/40 shrink-0">
                {Math.round(fact.confidence * 100)}%
              </span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-foreground/[0.05] border border-foreground/[0.08] text-foreground/60">
                {fact.category}
              </span>
              {fact.entities.slice(0, 3).map((entity) => (
                <span
                  key={entity}
                  className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-foreground/[0.03] text-foreground/40"
                >
                  {entity}
                </span>
              ))}
              {fact.superseded_by && (
                <span className="text-[10px] font-mono text-foreground/30 italic">superseded</span>
              )}
              <span className="text-[10px] font-mono text-foreground/30 ml-auto">
                {timeAgo(fact.created_at)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

function SourceEvents({ events }: { events: SourceEventSummary[] }) {
  if (events.length === 0) {
    return (
      <div className="rounded-xl border border-foreground/[0.08] bg-foreground/[0.02] p-4">
        <h2 className="text-sm font-mono uppercase tracking-wider text-foreground/40 mb-3">
          Source Events
        </h2>
        <p className="text-sm text-foreground/40 text-center py-6">No events fetched yet.</p>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.25, ease: [0.33, 1, 0.68, 1] }}
      className="rounded-xl border border-foreground/[0.08] bg-foreground/[0.02] p-4 space-y-3"
    >
      <h2 className="text-sm font-mono uppercase tracking-wider text-foreground/40">
        Source Events
      </h2>
      <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
        {events.map((event) => (
          <div
            key={event.id}
            className="rounded-lg border border-foreground/[0.08] bg-foreground/[0.02] p-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-2 min-w-0">
                <FileText className="w-3.5 h-3.5 text-foreground/40 mt-0.5 shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm text-foreground/80 truncate">{event.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-foreground/[0.05] border border-foreground/[0.08] text-foreground/60">
                      {event.source}
                    </span>
                    <span className="text-[10px] font-mono text-foreground/30">
                      {(event.content_length / 1000).toFixed(1)}k chars
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[10px] font-mono text-foreground/30">
                  {timeAgo(event.fetched_at)}
                </span>
                {event.url && (
                  <a
                    href={event.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground/30 hover:text-foreground/60 transition-colors"
                  >
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

function PipelineHistory({ runs }: { runs: PipelineRunSummary[] }) {
  if (runs.length === 0) {
    return (
      <div className="rounded-xl border border-foreground/[0.08] bg-foreground/[0.02] p-4">
        <h2 className="text-sm font-mono uppercase tracking-wider text-foreground/40 mb-3">
          Pipeline History
        </h2>
        <p className="text-sm text-foreground/40 text-center py-6">No pipeline runs yet.</p>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3, ease: [0.33, 1, 0.68, 1] }}
      className="rounded-xl border border-foreground/[0.08] bg-foreground/[0.02] p-4 space-y-3"
    >
      <h2 className="text-sm font-mono uppercase tracking-wider text-foreground/40">
        Pipeline History
      </h2>
      <div className="space-y-1.5">
        {runs.map((run) => (
          <div
            key={run.id}
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-foreground/[0.02] transition-colors"
          >
            <StatusDot status={run.status} />
            <span className="text-xs font-mono text-foreground/60 w-20 shrink-0">
              {timeAgo(run.started_at)}
            </span>
            <span className="text-xs font-mono text-foreground/40 w-16 shrink-0">
              {formatDuration(run.started_at, run.completed_at)}
            </span>
            <div className="flex items-center gap-3 text-[10px] font-mono text-foreground/30 ml-auto">
              <span>{run.events_fetched} events</span>
              <span>{run.facts_extracted} facts</span>
              {run.blocks_flagged > 0 && <span>{run.blocks_flagged} flagged</span>}
            </div>
            {run.status === 'completed' && (
              <CheckCircle2 className="w-3.5 h-3.5 text-green-500/60 shrink-0" />
            )}
            {run.status === 'failed' && (
              <XCircle className="w-3.5 h-3.5 text-red-500/60 shrink-0" />
            )}
            {run.status === 'running' && (
              <Loader2 className="w-3.5 h-3.5 text-foreground/40 animate-spin shrink-0" />
            )}
          </div>
        ))}
      </div>
    </motion.div>
  )
}

export default function InstructorDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [facts, setFacts] = useState<KnowledgeFactSummary[]>([])
  const [events, setEvents] = useState<SourceEventSummary[]>([])
  const [runs, setRuns] = useState<PipelineRunSummary[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetchDashboardStats(),
      fetchRecentFacts(),
      fetchRecentEvents(),
      fetchPipelineRuns(),
    ]).then(([s, f, e, r]) => {
      setStats(s)
      setFacts(f)
      setEvents(e)
      setRuns(r)
      setLoading(false)
    })
  }, [])

  if (loading || !stats) {
    return (
      <>
        <SEO
          title="Knowledge Base"
          description="Course engine dashboard — monitor sources, facts, and content health."
          path="course/knowledge-base"
        />
        <LoadingSkeleton />
      </>
    )
  }

  return (
    <>
      <SEO
        title="Knowledge Base"
        description="Course engine dashboard — monitor sources, facts, and content health."
        path="course/knowledge-base"
      />

      <div className="p-6 lg:p-8 max-w-4xl space-y-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-1">Knowledge Base</h1>
          <p className="text-sm text-muted-foreground">
            Monitor source events, extracted facts, and pipeline health.
          </p>
        </div>

        <StatsGrid stats={stats} />

        {stats.lastPipelineRun && <PipelineCard run={stats.lastPipelineRun} />}

        <CategoryBreakdown factsByCategory={stats.factsByCategory} />

        <RecentFacts facts={facts} />

        <SourceEvents events={events} />

        <PipelineHistory runs={runs} />
      </div>
    </>
  )
}
