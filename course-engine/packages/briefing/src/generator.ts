import type { SupabaseClient } from '@supabase/supabase-js';
import type {
  PipelineRun,
  SourceEvent,
  KnowledgeFact,
  ContentBlock,
  ContentBlockStatus,
  RegenerationProposal,
} from '@course-engine/core';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface BriefingSection {
  title: string;
  items: string[];
  priority: 'urgent' | 'info' | 'success';
}

export interface BriefingStats {
  total_facts: number;
  active_facts: number;
  superseded_facts: number;
  content_blocks_current: number;
  content_blocks_at_risk: number;
  content_blocks_stale: number;
  pending_proposals: number;
}

export interface Briefing {
  generated_at: Date;
  period: { from: Date; to: Date };
  sections: BriefingSection[];
  summary: string;
  stats: BriefingStats;
}

export interface BriefingOptions {
  since?: Date;
  format?: 'text' | 'markdown';
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function hoursAgo(hours: number): Date {
  return new Date(Date.now() - hours * 60 * 60 * 1000);
}

function iso(date: Date): string {
  return date.toISOString();
}

function plural(n: number, word: string): string {
  return `${n} ${word}${n === 1 ? '' : 's'}`;
}

function truncate(str: string, len: number): string {
  return str.length > len ? str.slice(0, len - 1) + '…' : str;
}

// ---------------------------------------------------------------------------
// Data fetching
// ---------------------------------------------------------------------------

interface BriefingData {
  recentRuns: PipelineRun[];
  newEvents: SourceEvent[];
  newFacts: KnowledgeFact[];
  supersededFacts: KnowledgeFact[];
  blocksCurrent: ContentBlock[];
  blocksAtRisk: ContentBlock[];
  blocksStale: ContentBlock[];
  blocksRegenerating: ContentBlock[];
  pendingProposals: RegenerationProposal[];
  appliedProposals: RegenerationProposal[];
  totalFacts: number;
  activeFacts: number;
}

async function fetchBriefingData(
  db: SupabaseClient,
  since: Date,
): Promise<BriefingData> {
  const sinceIso = iso(since);

  const [
    runsResult,
    eventsResult,
    newFactsResult,
    supersededFactsResult,
    currentResult,
    atRiskResult,
    staleResult,
    regeneratingResult,
    pendingResult,
    appliedResult,
    totalFactsResult,
    activeFactsResult,
  ] = await Promise.all([
    db.from('pipeline_runs').select('*').gte('started_at', sinceIso).order('started_at', { ascending: false }),
    db.from('source_events').select('*').gte('fetched_at', sinceIso).order('fetched_at', { ascending: false }),
    db.from('knowledge_facts').select('*').gte('valid_from', sinceIso).order('valid_from', { ascending: false }),
    db.from('knowledge_facts').select('*').not('valid_until', 'is', null).gte('valid_until', sinceIso).order('valid_until', { ascending: false }),
    db.from('content_blocks').select('*').eq('status', 'current' as ContentBlockStatus),
    db.from('content_blocks').select('*').eq('status', 'at_risk' as ContentBlockStatus),
    db.from('content_blocks').select('*').eq('status', 'stale' as ContentBlockStatus),
    db.from('content_blocks').select('*').eq('status', 'regenerating' as ContentBlockStatus),
    db.from('regeneration_proposals').select('*').eq('status', 'pending').order('created_at', { ascending: false }),
    db.from('regeneration_proposals').select('*').eq('status', 'applied').gte('reviewed_at', sinceIso).order('reviewed_at', { ascending: false }),
    db.from('knowledge_facts').select('id', { count: 'exact', head: true }),
    db.from('knowledge_facts').select('id', { count: 'exact', head: true }).is('superseded_by', null),
  ]);

  return {
    recentRuns: (runsResult.data ?? []) as PipelineRun[],
    newEvents: (eventsResult.data ?? []) as SourceEvent[],
    newFacts: (newFactsResult.data ?? []) as KnowledgeFact[],
    supersededFacts: (supersededFactsResult.data ?? []) as KnowledgeFact[],
    blocksCurrent: (currentResult.data ?? []) as ContentBlock[],
    blocksAtRisk: (atRiskResult.data ?? []) as ContentBlock[],
    blocksStale: (staleResult.data ?? []) as ContentBlock[],
    blocksRegenerating: (regeneratingResult.data ?? []) as ContentBlock[],
    pendingProposals: (pendingResult.data ?? []) as RegenerationProposal[],
    appliedProposals: (appliedResult.data ?? []) as RegenerationProposal[],
    totalFacts: totalFactsResult.count ?? 0,
    activeFacts: activeFactsResult.count ?? 0,
  };
}

// ---------------------------------------------------------------------------
// Section builders
// ---------------------------------------------------------------------------

function buildPipelineSection(data: BriefingData): BriefingSection {
  const { recentRuns } = data;
  const items: string[] = [];

  if (recentRuns.length === 0) {
    items.push('No pipeline runs in this period.');
  } else {
    const completed = recentRuns.filter((r) => r.status === 'completed');
    const failed = recentRuns.filter((r) => r.status === 'failed');
    const running = recentRuns.filter((r) => r.status === 'running');

    if (completed.length > 0) {
      const totalEvents = completed.reduce((sum, r) => sum + r.events_fetched, 0);
      const totalFacts = completed.reduce((sum, r) => sum + r.facts_extracted, 0);
      items.push(
        `${plural(completed.length, 'run')} completed: fetched ${plural(totalEvents, 'event')}, extracted ${plural(totalFacts, 'fact')}.`,
      );
    }
    if (failed.length > 0) {
      for (const run of failed) {
        items.push(`FAILED: ${run.error ?? 'Unknown error'} (run ${run.id.slice(0, 8)})`);
      }
    }
    if (running.length > 0) {
      items.push(`${plural(running.length, 'run')} still in progress.`);
    }
  }

  return { title: 'Pipeline Activity', items, priority: 'info' };
}

function buildSourcesSection(data: BriefingData): BriefingSection {
  const { newEvents } = data;
  const items: string[] = [];

  if (newEvents.length === 0) {
    items.push('No new sources ingested.');
  } else {
    items.push(`${plural(newEvents.length, 'new source')} ingested:`);
    for (const event of newEvents.slice(0, 10)) {
      items.push(`  [${event.source}] ${truncate(event.title, 80)}`);
    }
    if (newEvents.length > 10) {
      items.push(`  ...and ${newEvents.length - 10} more.`);
    }
  }

  return { title: 'New Sources', items, priority: 'info' };
}

function buildFactChangesSection(data: BriefingData): BriefingSection {
  const { newFacts, supersededFacts } = data;
  const items: string[] = [];
  const hasSupersessions = supersededFacts.length > 0;

  if (newFacts.length > 0) {
    items.push(`${plural(newFacts.length, 'new fact')} added.`);
    for (const fact of newFacts.slice(0, 5)) {
      items.push(`  + ${truncate(fact.statement, 90)} [${fact.category}]`);
    }
    if (newFacts.length > 5) {
      items.push(`  ...and ${newFacts.length - 5} more.`);
    }
  }

  if (hasSupersessions) {
    items.push(`${plural(supersededFacts.length, 'fact')} superseded.`);
    for (const fact of supersededFacts.slice(0, 5)) {
      items.push(`  - ${truncate(fact.statement, 90)}`);
    }
    if (supersededFacts.length > 5) {
      items.push(`  ...and ${supersededFacts.length - 5} more.`);
    }
  }

  if (items.length === 0) {
    items.push('No fact changes.');
  }

  return {
    title: 'Fact Changes',
    items,
    priority: hasSupersessions ? 'urgent' : 'info',
  };
}

function buildContentHealthSection(data: BriefingData): BriefingSection {
  const { blocksCurrent, blocksAtRisk, blocksStale, blocksRegenerating } = data;
  const items: string[] = [];

  items.push(
    `Current: ${blocksCurrent.length}  |  At risk: ${blocksAtRisk.length}  |  Stale: ${blocksStale.length}  |  Regenerating: ${blocksRegenerating.length}`,
  );

  if (blocksAtRisk.length > 0) {
    items.push(`${plural(blocksAtRisk.length, 'block')} at risk:`);
    for (const block of blocksAtRisk.slice(0, 5)) {
      const label = block.heading ?? `Block ${block.id.slice(0, 8)}`;
      items.push(`  ! ${label} (lesson ${block.lesson_id.slice(0, 8)}, depends on ${plural(block.depends_on_facts.length, 'fact')})`);
    }
    if (blocksAtRisk.length > 5) {
      items.push(`  ...and ${blocksAtRisk.length - 5} more.`);
    }
  }

  if (blocksStale.length > 0) {
    items.push(`${plural(blocksStale.length, 'block')} stale:`);
    for (const block of blocksStale.slice(0, 5)) {
      const label = block.heading ?? `Block ${block.id.slice(0, 8)}`;
      items.push(`  ! ${label} (v${block.version})`);
    }
    if (blocksStale.length > 5) {
      items.push(`  ...and ${blocksStale.length - 5} more.`);
    }
  }

  const hasIssues = blocksAtRisk.length > 0 || blocksStale.length > 0;
  return {
    title: 'Content Health',
    items,
    priority: hasIssues ? 'urgent' : 'info',
  };
}

function buildRegenerationSection(data: BriefingData): BriefingSection {
  const { pendingProposals, appliedProposals } = data;
  const items: string[] = [];

  if (pendingProposals.length > 0) {
    items.push(`${plural(pendingProposals.length, 'proposal')} pending review:`);
    for (const p of pendingProposals.slice(0, 5)) {
      items.push(`  ? [${p.change_type}] ${truncate(p.diff_summary, 80)} (confidence: ${(p.confidence * 100).toFixed(0)}%)`);
    }
    if (pendingProposals.length > 5) {
      items.push(`  ...and ${pendingProposals.length - 5} more.`);
    }
  }

  if (appliedProposals.length > 0) {
    items.push(`${plural(appliedProposals.length, 'proposal')} applied:`);
    for (const p of appliedProposals.slice(0, 5)) {
      items.push(`  * [${p.change_type}] ${truncate(p.diff_summary, 80)}`);
    }
    if (appliedProposals.length > 5) {
      items.push(`  ...and ${appliedProposals.length - 5} more.`);
    }
  }

  if (items.length === 0) {
    items.push('No regeneration activity.');
  }

  return {
    title: 'Regeneration Activity',
    items,
    priority: appliedProposals.length > 0 ? 'success' : 'info',
  };
}

function buildAlertsSection(data: BriefingData, since: Date): BriefingSection {
  const items: string[] = [];

  const failedRuns = data.recentRuns.filter((r) => r.status === 'failed');
  for (const run of failedRuns) {
    items.push(`Pipeline run ${run.id.slice(0, 8)} failed: ${run.error ?? 'Unknown error'}`);
  }

  // Blocks stale for >48h
  const staleThreshold = new Date(since.getTime() - 48 * 60 * 60 * 1000);
  const longStale = data.blocksStale.filter((b) => {
    const updated = new Date(b.updated_at);
    return updated < staleThreshold;
  });
  if (longStale.length > 0) {
    items.push(`${plural(longStale.length, 'block')} stale for >48 hours:`);
    for (const block of longStale.slice(0, 5)) {
      const label = block.heading ?? `Block ${block.id.slice(0, 8)}`;
      items.push(`  !! ${label} (last updated ${new Date(block.updated_at).toISOString().slice(0, 16)})`);
    }
    if (longStale.length > 5) {
      items.push(`  ...and ${longStale.length - 5} more.`);
    }
  }

  if (items.length === 0) {
    return { title: 'Alerts', items: ['No alerts.'], priority: 'info' };
  }

  return { title: 'Alerts', items, priority: 'urgent' };
}

// ---------------------------------------------------------------------------
// Summary builder
// ---------------------------------------------------------------------------

function buildSummary(data: BriefingData, sections: BriefingSection[]): string {
  const urgentCount = sections.filter((s) => s.priority === 'urgent').length;
  const parts: string[] = [];

  if (data.newEvents.length > 0 || data.newFacts.length > 0) {
    parts.push(
      `Ingested ${plural(data.newEvents.length, 'source')} and extracted ${plural(data.newFacts.length, 'fact')}.`,
    );
  } else {
    parts.push('No new data ingested.');
  }

  if (urgentCount > 0) {
    const urgentNames = sections
      .filter((s) => s.priority === 'urgent')
      .map((s) => s.title.toLowerCase());
    parts.push(`Action needed: ${urgentNames.join(', ')}.`);
  } else {
    parts.push('All systems nominal.');
  }

  return parts.join(' ');
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export async function generateBriefing(
  db: SupabaseClient,
  options?: BriefingOptions,
): Promise<Briefing> {
  const now = new Date();
  const since = options?.since ?? hoursAgo(24);

  const data = await fetchBriefingData(db, since);

  const sections: BriefingSection[] = [
    buildPipelineSection(data),
    buildSourcesSection(data),
    buildFactChangesSection(data),
    buildContentHealthSection(data),
    buildRegenerationSection(data),
    buildAlertsSection(data, since),
  ];

  const stats: BriefingStats = {
    total_facts: data.totalFacts,
    active_facts: data.activeFacts,
    superseded_facts: data.totalFacts - data.activeFacts,
    content_blocks_current: data.blocksCurrent.length,
    content_blocks_at_risk: data.blocksAtRisk.length,
    content_blocks_stale: data.blocksStale.length,
    pending_proposals: data.pendingProposals.length,
  };

  return {
    generated_at: now,
    period: { from: since, to: now },
    sections,
    summary: buildSummary(data, sections),
    stats,
  };
}

export function formatBriefing(
  briefing: Briefing,
  format: 'text' | 'markdown',
): string {
  if (format === 'markdown') {
    return formatMarkdown(briefing);
  }
  return formatText(briefing);
}

// ---------------------------------------------------------------------------
// Text formatter (terminal)
// ---------------------------------------------------------------------------

const PRIORITY_ICON: Record<BriefingSection['priority'], string> = {
  urgent: '!!',
  info: '--',
  success: 'OK',
};

function formatText(briefing: Briefing): string {
  const lines: string[] = [];
  const width = 72;
  const rule = '='.repeat(width);
  const thinRule = '-'.repeat(width);

  lines.push(rule);
  lines.push('  COURSE ENGINE BRIEFING');
  lines.push(`  ${briefing.period.from.toISOString().slice(0, 16)} -> ${briefing.period.to.toISOString().slice(0, 16)}`);
  lines.push(rule);
  lines.push('');
  lines.push(`  TLDR: ${briefing.summary}`);
  lines.push('');

  for (const section of briefing.sections) {
    const icon = PRIORITY_ICON[section.priority];
    lines.push(`  [${icon}] ${section.title.toUpperCase()}`);
    lines.push(`  ${thinRule.slice(0, width - 4)}`);
    for (const item of section.items) {
      lines.push(`  ${item}`);
    }
    lines.push('');
  }

  lines.push(`  ${thinRule.slice(0, width - 4)}`);
  lines.push('  STATS');
  lines.push(`  ${thinRule.slice(0, width - 4)}`);
  const s = briefing.stats;
  lines.push(`  Facts: ${s.active_facts} active / ${s.total_facts} total (${s.superseded_facts} superseded)`);
  lines.push(`  Content: ${s.content_blocks_current} current, ${s.content_blocks_at_risk} at risk, ${s.content_blocks_stale} stale`);
  lines.push(`  Proposals: ${s.pending_proposals} pending review`);
  lines.push('');
  lines.push(rule);
  lines.push(`  Generated ${briefing.generated_at.toISOString().slice(0, 19)}`);
  lines.push(rule);

  return lines.join('\n');
}

// ---------------------------------------------------------------------------
// Markdown formatter (email/Slack)
// ---------------------------------------------------------------------------

const PRIORITY_EMOJI: Record<BriefingSection['priority'], string> = {
  urgent: '\u{1F6A8}',
  info: '\u{2139}\u{FE0F}',
  success: '\u{2705}',
};

function formatMarkdown(briefing: Briefing): string {
  const lines: string[] = [];

  lines.push('# Course Engine Briefing');
  lines.push('');
  lines.push(
    `**Period:** ${briefing.period.from.toISOString().slice(0, 16)} → ${briefing.period.to.toISOString().slice(0, 16)}`,
  );
  lines.push('');
  lines.push(`> ${briefing.summary}`);
  lines.push('');

  for (const section of briefing.sections) {
    const emoji = PRIORITY_EMOJI[section.priority];
    lines.push(`## ${emoji} ${section.title}`);
    lines.push('');
    for (const item of section.items) {
      if (item.startsWith('  ')) {
        lines.push(`- ${item.trim()}`);
      } else {
        lines.push(item);
      }
    }
    lines.push('');
  }

  lines.push('---');
  lines.push('');
  lines.push('### Stats');
  lines.push('');
  const s = briefing.stats;
  lines.push(`| Metric | Value |`);
  lines.push(`|--------|-------|`);
  lines.push(`| Active facts | ${s.active_facts} / ${s.total_facts} |`);
  lines.push(`| Superseded facts | ${s.superseded_facts} |`);
  lines.push(`| Content blocks (current) | ${s.content_blocks_current} |`);
  lines.push(`| Content blocks (at risk) | ${s.content_blocks_at_risk} |`);
  lines.push(`| Content blocks (stale) | ${s.content_blocks_stale} |`);
  lines.push(`| Pending proposals | ${s.pending_proposals} |`);
  lines.push('');
  lines.push(`*Generated ${briefing.generated_at.toISOString().slice(0, 19)}*`);

  return lines.join('\n');
}
