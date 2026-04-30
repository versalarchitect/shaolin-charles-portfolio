import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type {
  SourceEvent,
  KnowledgeFact,
  ContentBlock,
  ContentBlockStatus,
  RegenerationProposal,
  PipelineRun,
} from './types.js';

function getEnvOrThrow(key: string): string {
  const value = process.env[key];
  if (!value) throw new Error(`Missing required environment variable: ${key}`);
  return value;
}

export function createDbClient(): SupabaseClient {
  const url = getEnvOrThrow('SUPABASE_URL');
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? getEnvOrThrow('SUPABASE_ANON_KEY');
  return createClient(url, key);
}

async function hashContent(content: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(content);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

// ---------------------------------------------------------------------------
// Source Events
// ---------------------------------------------------------------------------

export async function insertSourceEvent(
  db: SupabaseClient,
  event: Omit<SourceEvent, 'id' | 'content_hash' | 'fetched_at'>,
): Promise<SourceEvent | null> {
  const content_hash = await hashContent(event.raw_content);

  const { data: existing } = await db
    .from('source_events')
    .select('id')
    .eq('content_hash', content_hash)
    .maybeSingle();

  if (existing) return null;

  const row = {
    id: crypto.randomUUID(),
    ...event,
    content_hash,
    fetched_at: new Date().toISOString(),
    published_at: event.published_at?.toISOString() ?? null,
  };

  const { data, error } = await db
    .from('source_events')
    .insert(row)
    .select()
    .single();

  if (error) throw new Error(`Failed to insert source event: ${error.message}`);
  return data as SourceEvent;
}

export async function getSourceEventByHash(
  db: SupabaseClient,
  contentHash: string,
): Promise<SourceEvent | null> {
  const { data, error } = await db
    .from('source_events')
    .select('*')
    .eq('content_hash', contentHash)
    .maybeSingle();

  if (error) throw new Error(`Failed to fetch source event: ${error.message}`);
  return data as SourceEvent | null;
}

export async function listSourceEvents(
  db: SupabaseClient,
  options?: { limit?: number; offset?: number; source?: SourceEvent['source'] },
): Promise<SourceEvent[]> {
  let query = db
    .from('source_events')
    .select('*')
    .order('fetched_at', { ascending: false });

  if (options?.source) query = query.eq('source', options.source);
  if (options?.limit) query = query.limit(options.limit);
  if (options?.offset) query = query.range(options.offset, options.offset + (options.limit ?? 50) - 1);

  const { data, error } = await query;
  if (error) throw new Error(`Failed to list source events: ${error.message}`);
  return (data ?? []) as SourceEvent[];
}

// ---------------------------------------------------------------------------
// Knowledge Facts
// ---------------------------------------------------------------------------

export async function insertKnowledgeFact(
  db: SupabaseClient,
  fact: Omit<KnowledgeFact, 'id'>,
): Promise<KnowledgeFact> {
  const { data: existing } = await db
    .from('knowledge_facts')
    .select('id, statement')
    .eq('source_event_id', fact.source_event_id)
    .eq('statement', fact.statement)
    .maybeSingle();

  if (existing) return existing as KnowledgeFact;

  const row = {
    id: crypto.randomUUID(),
    ...fact,
    valid_from: fact.valid_from instanceof Date ? fact.valid_from.toISOString() : String(fact.valid_from),
    valid_until: fact.valid_until ? (fact.valid_until instanceof Date ? fact.valid_until.toISOString() : String(fact.valid_until)) : null,
  };

  const { data, error } = await db
    .from('knowledge_facts')
    .insert(row)
    .select()
    .single();

  if (error) throw new Error(`Failed to insert knowledge fact: ${error.message}`);
  return data as KnowledgeFact;
}

export async function findFactsByEntities(
  db: SupabaseClient,
  entities: string[],
): Promise<KnowledgeFact[]> {
  const { data, error } = await db
    .from('knowledge_facts')
    .select('*')
    .overlaps('entities', entities)
    .is('superseded_by', null)
    .order('valid_from', { ascending: false });

  if (error) throw new Error(`Failed to find facts by entities: ${error.message}`);
  return (data ?? []) as KnowledgeFact[];
}

export async function findFactsBySourceEvent(
  db: SupabaseClient,
  sourceEventId: string,
): Promise<KnowledgeFact[]> {
  const { data, error } = await db
    .from('knowledge_facts')
    .select('*')
    .eq('source_event_id', sourceEventId)
    .order('valid_from', { ascending: false });

  if (error) throw new Error(`Failed to find facts by source event: ${error.message}`);
  return (data ?? []) as KnowledgeFact[];
}

export async function supersedeFact(
  db: SupabaseClient,
  oldFactId: string,
  newFactId: string,
): Promise<void> {
  const { error } = await db
    .from('knowledge_facts')
    .update({
      superseded_by: newFactId,
      valid_until: new Date().toISOString(),
    })
    .eq('id', oldFactId);

  if (error) throw new Error(`Failed to supersede fact: ${error.message}`);
}

export async function getFactById(
  db: SupabaseClient,
  factId: string,
): Promise<KnowledgeFact | null> {
  const { data, error } = await db
    .from('knowledge_facts')
    .select('*')
    .eq('id', factId)
    .maybeSingle();

  if (error) throw new Error(`Failed to get fact: ${error.message}`);
  return data as KnowledgeFact | null;
}

// ---------------------------------------------------------------------------
// Content Blocks
// ---------------------------------------------------------------------------

export async function getContentBlocksByStatus(
  db: SupabaseClient,
  status: ContentBlockStatus,
): Promise<ContentBlock[]> {
  const { data, error } = await db
    .from('content_blocks')
    .select('*')
    .eq('status', status)
    .order('order_index', { ascending: true });

  if (error) throw new Error(`Failed to get content blocks by status: ${error.message}`);
  return (data ?? []) as ContentBlock[];
}

export async function getContentBlocksByLesson(
  db: SupabaseClient,
  lessonId: string,
): Promise<ContentBlock[]> {
  const { data, error } = await db
    .from('content_blocks')
    .select('*')
    .eq('lesson_id', lessonId)
    .order('order_index', { ascending: true });

  if (error) throw new Error(`Failed to get content blocks: ${error.message}`);
  return (data ?? []) as ContentBlock[];
}

export async function flagBlocksAtRisk(
  db: SupabaseClient,
  supersededFactIds: string[],
): Promise<number> {
  if (supersededFactIds.length === 0) return 0;

  const { data: blocks, error: fetchError } = await db
    .from('content_blocks')
    .select('id, depends_on_facts')
    .in('status', ['current'])
    .overlaps('depends_on_facts', supersededFactIds);

  if (fetchError) throw new Error(`Failed to find at-risk blocks: ${fetchError.message}`);
  if (!blocks || blocks.length === 0) return 0;

  const blockIds = blocks.map((b: { id: string }) => b.id);

  const { error: updateError } = await db
    .from('content_blocks')
    .update({ status: 'at_risk', updated_at: new Date().toISOString() })
    .in('id', blockIds);

  if (updateError) throw new Error(`Failed to flag blocks at risk: ${updateError.message}`);
  return blockIds.length;
}

export async function updateContentBlockStatus(
  db: SupabaseClient,
  blockId: string,
  status: ContentBlockStatus,
): Promise<void> {
  const { error } = await db
    .from('content_blocks')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', blockId);

  if (error) throw new Error(`Failed to update content block status: ${error.message}`);
}

export async function updateContentBlockMarkdown(
  db: SupabaseClient,
  blockId: string,
  markdown: string,
  newDependsOnFacts: string[],
): Promise<void> {
  const { data: current, error: fetchError } = await db
    .from('content_blocks')
    .select('version')
    .eq('id', blockId)
    .single();

  if (fetchError) throw new Error(`Failed to fetch content block: ${fetchError.message}`);

  const now = new Date().toISOString();
  const { error } = await db
    .from('content_blocks')
    .update({
      markdown,
      depends_on_facts: newDependsOnFacts,
      version: (current as { version: number }).version + 1,
      status: 'current' as ContentBlockStatus,
      last_regenerated_at: now,
      updated_at: now,
    })
    .eq('id', blockId);

  if (error) throw new Error(`Failed to update content block markdown: ${error.message}`);
}

// ---------------------------------------------------------------------------
// Regeneration Proposals
// ---------------------------------------------------------------------------

export async function insertRegenerationProposal(
  db: SupabaseClient,
  proposal: Omit<RegenerationProposal, 'id' | 'created_at'>,
): Promise<RegenerationProposal> {
  const row = {
    id: crypto.randomUUID(),
    ...proposal,
    created_at: new Date().toISOString(),
    reviewed_at: proposal.reviewed_at?.toISOString() ?? null,
  };

  const { data, error } = await db
    .from('regeneration_proposals')
    .insert(row)
    .select()
    .single();

  if (error) throw new Error(`Failed to insert regeneration proposal: ${error.message}`);
  return data as RegenerationProposal;
}

export async function getProposalsByStatus(
  db: SupabaseClient,
  status: RegenerationProposal['status'],
): Promise<RegenerationProposal[]> {
  const { data, error } = await db
    .from('regeneration_proposals')
    .select('*')
    .eq('status', status)
    .order('created_at', { ascending: false });

  if (error) throw new Error(`Failed to get proposals: ${error.message}`);
  return (data ?? []) as RegenerationProposal[];
}

export async function updateProposalStatus(
  db: SupabaseClient,
  proposalId: string,
  status: RegenerationProposal['status'],
): Promise<void> {
  const update: Record<string, string> = { status };
  if (status === 'approved' || status === 'rejected') {
    update.reviewed_at = new Date().toISOString();
  }

  const { error } = await db
    .from('regeneration_proposals')
    .update(update)
    .eq('id', proposalId);

  if (error) throw new Error(`Failed to update proposal status: ${error.message}`);
}

export async function applyProposal(
  db: SupabaseClient,
  proposalId: string,
): Promise<void> {
  const { data: proposal, error: fetchError } = await db
    .from('regeneration_proposals')
    .select('*')
    .eq('id', proposalId)
    .single();

  if (fetchError) throw new Error(`Failed to fetch proposal: ${fetchError.message}`);

  const p = proposal as RegenerationProposal;

  await updateContentBlockMarkdown(
    db,
    p.content_block_id,
    p.new_markdown,
    p.triggered_by_facts,
  );

  await updateProposalStatus(db, proposalId, 'applied');
}

// ---------------------------------------------------------------------------
// Pipeline Runs
// ---------------------------------------------------------------------------

export async function getOrCreatePipelineRun(
  db: SupabaseClient,
): Promise<PipelineRun> {
  const row = {
    id: crypto.randomUUID(),
    started_at: new Date().toISOString(),
    status: 'running' as const,
    events_fetched: 0,
    facts_extracted: 0,
    blocks_flagged: 0,
    proposals_generated: 0,
  };

  const { data, error } = await db
    .from('pipeline_runs')
    .insert(row)
    .select()
    .single();

  if (error) throw new Error(`Failed to create pipeline run: ${error.message}`);
  return data as PipelineRun;
}

export async function updatePipelineRun(
  db: SupabaseClient,
  runId: string,
  updates: Partial<Pick<PipelineRun, 'events_fetched' | 'facts_extracted' | 'blocks_flagged' | 'proposals_generated' | 'status' | 'error'>>,
): Promise<void> {
  const row: Record<string, unknown> = { ...updates };
  if (updates.status === 'completed' || updates.status === 'failed') {
    row.completed_at = new Date().toISOString();
  }

  const { error } = await db
    .from('pipeline_runs')
    .update(row)
    .eq('id', runId);

  if (error) throw new Error(`Failed to update pipeline run: ${error.message}`);
}

export async function getLatestPipelineRun(
  db: SupabaseClient,
): Promise<PipelineRun | null> {
  const { data, error } = await db
    .from('pipeline_runs')
    .select('*')
    .order('started_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw new Error(`Failed to get latest pipeline run: ${error.message}`);
  return data as PipelineRun | null;
}
