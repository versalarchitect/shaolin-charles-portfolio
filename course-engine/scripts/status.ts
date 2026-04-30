import { createDbClient } from '../packages/core/src/index.js';

type DbClient = ReturnType<typeof createDbClient>;

function formatDate(date: string | Date): string {
  const d = new Date(date);
  return d.toISOString().replace('T', ' ').slice(0, 16);
}

function formatDuration(startedAt: string, completedAt?: string): string {
  if (!completedAt) return '...';
  const ms = new Date(completedAt).getTime() - new Date(startedAt).getTime();
  return ms < 1000 ? `${ms}ms` : `${Math.round(ms / 1000)}s`;
}

async function fetchPipelineRuns(db: DbClient) {
  const { data, error } = await db
    .from('pipeline_runs')
    .select('*')
    .order('started_at', { ascending: false })
    .limit(5);

  if (error) throw new Error(`Failed to fetch pipeline runs: ${error.message}`);
  return data ?? [];
}

async function fetchFactStats(db: DbClient) {
  const [
    { count: totalCount },
    { count: activeCount },
    { data: categoryData },
    { data: sourceData },
  ] = await Promise.all([
    db.from('knowledge_facts').select('*', { count: 'exact', head: true }),
    db.from('knowledge_facts').select('*', { count: 'exact', head: true }).is('superseded_by', null),
    db.from('knowledge_facts').select('category'),
    db.from('knowledge_facts').select('source_event_id').is('superseded_by', null),
  ]);

  const total = totalCount ?? 0;
  const active = activeCount ?? 0;
  const superseded = total - active;

  const categories = new Map<string, number>();
  for (const row of categoryData ?? []) {
    const cat = (row as { category: string }).category;
    categories.set(cat, (categories.get(cat) ?? 0) + 1);
  }

  return { total, active, superseded, categories };
}

async function fetchSourceStats(db: DbClient) {
  const { data: sourceData } = await db
    .from('source_events')
    .select('source');

  const sources = new Map<string, number>();
  for (const row of sourceData ?? []) {
    const src = (row as { source: string }).source;
    sources.set(src, (sources.get(src) ?? 0) + 1);
  }

  const { data: latest } = await db
    .from('source_events')
    .select('fetched_at')
    .order('fetched_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  return {
    total: sourceData?.length ?? 0,
    sources,
    lastFetch: latest ? (latest as { fetched_at: string }).fetched_at : null,
  };
}

async function fetchContentHealth(db: DbClient) {
  const [
    { data: blocks },
    { count: moduleCount },
    { count: lessonCount },
  ] = await Promise.all([
    db.from('content_blocks').select('status'),
    db.from('course_modules').select('*', { count: 'exact', head: true }),
    db.from('lessons').select('*', { count: 'exact', head: true }),
  ]);

  const statusCounts = new Map<string, number>();
  for (const row of blocks ?? []) {
    const s = (row as { status: string }).status;
    statusCounts.set(s, (statusCounts.get(s) ?? 0) + 1);
  }

  return {
    totalBlocks: blocks?.length ?? 0,
    current: statusCounts.get('current') ?? 0,
    atRisk: statusCounts.get('at_risk') ?? 0,
    stale: statusCounts.get('stale') ?? 0,
    regenerating: statusCounts.get('regenerating') ?? 0,
    modules: moduleCount ?? 0,
    lessons: lessonCount ?? 0,
  };
}

async function fetchProposalStats(db: DbClient) {
  const { data } = await db
    .from('regeneration_proposals')
    .select('status');

  const counts = new Map<string, number>();
  for (const row of data ?? []) {
    const s = (row as { status: string }).status;
    counts.set(s, (counts.get(s) ?? 0) + 1);
  }

  return {
    pending: counts.get('pending') ?? 0,
    applied: counts.get('applied') ?? 0,
    rejected: counts.get('rejected') ?? 0,
    approved: counts.get('approved') ?? 0,
  };
}

async function main(): Promise<void> {
  const db = createDbClient();

  const [runs, factStats, sourceStats, health, proposals] = await Promise.all([
    fetchPipelineRuns(db),
    fetchFactStats(db),
    fetchSourceStats(db),
    fetchContentHealth(db),
    fetchProposalStats(db),
  ]);

  console.log('');
  console.log('=== Course Engine Status ===');
  console.log('');

  // --- Pipeline Runs ---
  console.log('Pipeline Runs (last 5):');
  if (runs.length === 0) {
    console.log('  (none)');
  } else {
    for (const run of runs) {
      const icon = run.status === 'completed' ? '✓' : run.status === 'running' ? '~' : '✗';
      const duration = formatDuration(run.started_at, run.completed_at);
      const suffix = run.status === 'failed' && run.error
        ? ` (failed: ${run.error.slice(0, 60)})`
        : '';
      console.log(
        `  ${icon} ${formatDate(run.started_at)} — ${run.events_fetched} events, ${run.facts_extracted} facts, ${run.blocks_flagged} flagged (${duration})${suffix}`,
      );
    }
  }
  console.log('');

  // --- Knowledge Base ---
  console.log('Knowledge Base:');
  console.log(`  Facts: ${factStats.total} total (${factStats.active} active, ${factStats.superseded} superseded)`);

  if (factStats.categories.size > 0) {
    const sorted = [...factStats.categories.entries()].sort((a, b) => b[1] - a[1]);
    const categoryStr = sorted.map(([cat, n]) => `${cat}(${n})`).join(' ');
    console.log(`  By category: ${categoryStr}`);
  }

  if (sourceStats.sources.size > 0) {
    const sorted = [...sourceStats.sources.entries()].sort((a, b) => b[1] - a[1]);
    const sourceStr = sorted.map(([src, n]) => `${src}(${n})`).join(' ');
    console.log(`  Sources: ${sourceStr}`);
  }
  console.log('');

  // --- Content Health ---
  console.log('Content Health:');
  const blockParts = [`${health.totalBlocks} total`];
  if (health.current > 0) blockParts.push(`${health.current} current`);
  if (health.atRisk > 0) blockParts.push(`${health.atRisk} at_risk`);
  if (health.stale > 0) blockParts.push(`${health.stale} stale`);
  if (health.regenerating > 0) blockParts.push(`${health.regenerating} regenerating`);
  console.log(`  Blocks: ${blockParts.join(' — ')}`);
  console.log(`  Modules: ${health.modules} | Lessons: ${health.lessons}`);
  console.log('');

  // --- Regeneration ---
  console.log('Regeneration:');
  console.log(`  Proposals: ${proposals.pending} pending, ${proposals.applied} applied, ${proposals.rejected} rejected`);
  console.log('');

  // --- Source Events ---
  console.log('Source Events:');
  const lastFetchStr = sourceStats.lastFetch ? formatDate(sourceStats.lastFetch) : 'never';
  console.log(`  Total: ${sourceStats.total} | Last fetch: ${lastFetchStr}`);
  console.log('');
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Status check failed:', err instanceof Error ? err.message : String(err));
    process.exit(1);
  });
