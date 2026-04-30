import { supabase } from './supabase'

export interface PipelineRunSummary {
  id: string
  started_at: string
  completed_at: string | null
  status: 'running' | 'completed' | 'failed'
  events_fetched: number
  facts_extracted: number
  blocks_flagged: number
  proposals_generated: number
  error: string | null
}

export interface SourceEventSummary {
  id: string
  source: string
  url: string
  title: string
  fetched_at: string
  published_at: string | null
  content_length: number
}

export interface KnowledgeFactSummary {
  id: string
  statement: string
  category: string
  entities: string[]
  confidence: number
  source_event_id: string
  superseded_by: string | null
  valid_from: string
  created_at: string
}

export interface ContentBlockSummary {
  id: string
  heading: string | null
  status: 'current' | 'at_risk' | 'stale' | 'regenerating'
  version: number
  last_regenerated_at: string
  depends_on_facts: string[]
}

export interface DashboardStats {
  totalEvents: number
  totalFacts: number
  activeFacts: number
  supersededFacts: number
  contentBlocks: { current: number; at_risk: number; stale: number; regenerating: number }
  lastPipelineRun: PipelineRunSummary | null
  factsByCategory: Record<string, number>
}

export async function fetchDashboardStats(): Promise<DashboardStats> {
  const [
    { count: totalEvents },
    { count: totalFacts },
    { count: activeFacts },
    { count: supersededFacts },
    { data: contentStatusRows },
    { data: lastRun },
    { data: categoryRows },
  ] = await Promise.all([
    supabase.from('source_events').select('*', { count: 'exact', head: true }),
    supabase.from('knowledge_facts').select('*', { count: 'exact', head: true }),
    supabase.from('knowledge_facts').select('*', { count: 'exact', head: true }).is('superseded_by', null),
    supabase.from('knowledge_facts').select('*', { count: 'exact', head: true }).not('superseded_by', 'is', null),
    supabase.from('content_blocks').select('status'),
    supabase.from('pipeline_runs').select('*').order('started_at', { ascending: false }).limit(1),
    supabase.from('knowledge_facts').select('category').is('superseded_by', null),
  ])

  const contentBlocks = { current: 0, at_risk: 0, stale: 0, regenerating: 0 }
  for (const row of contentStatusRows ?? []) {
    const status = row.status as keyof typeof contentBlocks
    if (status in contentBlocks) contentBlocks[status]++
  }

  const factsByCategory: Record<string, number> = {}
  for (const row of categoryRows ?? []) {
    factsByCategory[row.category] = (factsByCategory[row.category] ?? 0) + 1
  }

  return {
    totalEvents: totalEvents ?? 0,
    totalFacts: totalFacts ?? 0,
    activeFacts: activeFacts ?? 0,
    supersededFacts: supersededFacts ?? 0,
    contentBlocks,
    lastPipelineRun: (lastRun?.[0] as PipelineRunSummary) ?? null,
    factsByCategory,
  }
}

export async function fetchRecentEvents(limit = 20): Promise<SourceEventSummary[]> {
  const { data } = await supabase
    .from('source_events')
    .select('id, source, url, title, fetched_at, published_at, raw_content')
    .order('fetched_at', { ascending: false })
    .limit(limit)

  return (data ?? []).map((e: Record<string, unknown>) => ({
    id: e.id as string,
    source: e.source as string,
    url: e.url as string,
    title: e.title as string,
    fetched_at: e.fetched_at as string,
    published_at: (e.published_at as string) ?? null,
    content_length: typeof e.raw_content === 'string' ? e.raw_content.length : 0,
  }))
}

export async function fetchRecentFacts(limit = 30): Promise<KnowledgeFactSummary[]> {
  const { data } = await supabase
    .from('knowledge_facts')
    .select('id, statement, category, entities, confidence, source_event_id, superseded_by, valid_from, created_at')
    .order('created_at', { ascending: false })
    .limit(limit)

  return (data ?? []) as KnowledgeFactSummary[]
}

export async function fetchPipelineRuns(limit = 10): Promise<PipelineRunSummary[]> {
  const { data } = await supabase
    .from('pipeline_runs')
    .select('*')
    .order('started_at', { ascending: false })
    .limit(limit)

  return (data ?? []) as PipelineRunSummary[]
}

export async function fetchContentBlocks(): Promise<ContentBlockSummary[]> {
  const { data } = await supabase
    .from('content_blocks')
    .select('id, heading, status, version, last_regenerated_at, depends_on_facts')
    .order('status', { ascending: true })

  return (data ?? []) as ContentBlockSummary[]
}
