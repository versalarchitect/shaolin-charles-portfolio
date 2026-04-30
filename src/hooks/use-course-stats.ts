import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export interface CourseStats {
  totalFacts: number
  activeFacts: number
  sourceEvents: number
  sourceTypes: number
  contentBlocks: number
  modules: number
  lessons: number
  lastPipelineRun: string | null
  pipelineStatus: 'completed' | 'running' | 'failed' | null
  factsByCategory: Record<string, number>
  sourcesByType: Record<string, number>
}

export function useCourseStats() {
  const [stats, setStats] = useState<CourseStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        const [
          { count: totalFacts },
          { count: activeFacts },
          { count: sourceEvents },
          { count: contentBlocks },
          { count: modules },
          { count: lessons },
          { data: latestRun },
          { data: factCategories },
          { data: sources },
        ] = await Promise.all([
          supabase.from('knowledge_facts').select('*', { count: 'exact', head: true }),
          supabase.from('knowledge_facts').select('*', { count: 'exact', head: true }).is('superseded_by', null),
          supabase.from('source_events').select('*', { count: 'exact', head: true }),
          supabase.from('content_blocks').select('*', { count: 'exact', head: true }),
          supabase.from('course_modules').select('*', { count: 'exact', head: true }),
          supabase.from('lessons').select('*', { count: 'exact', head: true }),
          supabase.from('pipeline_runs').select('started_at, status').order('started_at', { ascending: false }).limit(1).maybeSingle(),
          supabase.from('knowledge_facts').select('category').is('superseded_by', null),
          supabase.from('source_events').select('source'),
        ])

        const factsByCategory: Record<string, number> = {}
        for (const row of factCategories ?? []) {
          const cat = (row as { category: string }).category
          factsByCategory[cat] = (factsByCategory[cat] ?? 0) + 1
        }

        const sourcesByType: Record<string, number> = {}
        for (const row of sources ?? []) {
          const src = (row as { source: string }).source
          sourcesByType[src] = (sourcesByType[src] ?? 0) + 1
        }

        setStats({
          totalFacts: totalFacts ?? 0,
          activeFacts: activeFacts ?? 0,
          sourceEvents: sourceEvents ?? 0,
          sourceTypes: Object.keys(sourcesByType).length,
          contentBlocks: contentBlocks ?? 0,
          modules: modules ?? 0,
          lessons: lessons ?? 0,
          lastPipelineRun: latestRun?.started_at ?? null,
          pipelineStatus: latestRun?.status ?? null,
          factsByCategory,
          sourcesByType,
        })
      } catch {
        setStats(null)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  return { stats, loading }
}

export function timeAgo(dateStr: string): string {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000)
  if (seconds < 60) return 'just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  return `${Math.floor(seconds / 86400)}d ago`
}
