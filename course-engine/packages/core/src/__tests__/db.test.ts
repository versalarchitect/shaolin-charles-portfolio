import { describe, it, expect, beforeEach } from 'bun:test';
import {
  insertSourceEvent,
  getSourceEventByHash,
  listSourceEvents,
  insertKnowledgeFact,
  findFactsByEntities,
  supersedeFact,
  getContentBlocksByStatus,
  flagBlocksAtRisk,
  updateContentBlockMarkdown,
  getOrCreatePipelineRun,
  updatePipelineRun,
  getLatestPipelineRun,
  updateProposalStatus,
  applyProposal,
} from '../db.js';
import { createMockSupabase } from '../../../../test-fixtures/mock-supabase.js';

let db: ReturnType<typeof createMockSupabase>;

beforeEach(() => {
  db = createMockSupabase();
});

describe('insertSourceEvent', () => {
  it('inserts a new source event', async () => {
    const result = await insertSourceEvent(db as any, {
      source: 'anthropic_docs',
      url: 'https://docs.anthropic.com/test',
      title: 'Test Doc',
      raw_content: 'This is a test document with enough content to be valid.',
    });

    expect(result).not.toBeNull();
    expect(result!.source).toBe('anthropic_docs');
    expect(result!.title).toBe('Test Doc');
  });

  it('returns null for duplicate content (same hash)', async () => {
    const content = 'Unique content for deduplication testing.';

    // Seed a row with matching hash
    const hash = await hashSha256(content);
    (db as any)._seed('source_events', [{ id: 'existing', content_hash: hash }]);

    const result = await insertSourceEvent(db as any, {
      source: 'anthropic_docs',
      url: 'https://docs.anthropic.com/dup',
      title: 'Duplicate',
      raw_content: content,
    });

    expect(result).toBeNull();
  });
});

describe('getSourceEventByHash', () => {
  it('returns event when hash matches', async () => {
    (db as any)._seed('source_events', [
      { id: 'evt-1', content_hash: 'abc123', title: 'Found' },
    ]);

    const result = await getSourceEventByHash(db as any, 'abc123');
    expect(result).not.toBeNull();
    expect(result!.title).toBe('Found');
  });

  it('returns null when hash not found', async () => {
    const result = await getSourceEventByHash(db as any, 'nonexistent');
    expect(result).toBeNull();
  });
});

describe('listSourceEvents', () => {
  it('returns all events when no options', async () => {
    (db as any)._seed('source_events', [
      { id: '1', source: 'anthropic_docs', fetched_at: '2026-05-01' },
      { id: '2', source: 'github_release', fetched_at: '2026-05-02' },
    ]);

    const result = await listSourceEvents(db as any);
    expect(result).toHaveLength(2);
  });

  it('filters by source', async () => {
    (db as any)._seed('source_events', [
      { id: '1', source: 'anthropic_docs', fetched_at: '2026-05-01' },
      { id: '2', source: 'github_release', fetched_at: '2026-05-02' },
    ]);

    const result = await listSourceEvents(db as any, { source: 'anthropic_docs' });
    expect(result).toHaveLength(1);
    expect(result[0].source).toBe('anthropic_docs');
  });

  it('respects limit', async () => {
    (db as any)._seed('source_events', [
      { id: '1', fetched_at: '2026-05-01' },
      { id: '2', fetched_at: '2026-05-02' },
      { id: '3', fetched_at: '2026-05-03' },
    ]);

    const result = await listSourceEvents(db as any, { limit: 2 });
    expect(result).toHaveLength(2);
  });
});

describe('insertKnowledgeFact', () => {
  it('inserts a new fact', async () => {
    const result = await insertKnowledgeFact(db as any, {
      statement: 'Claude supports 200K context',
      category: 'model_capability',
      entities: ['claude', 'context-window'],
      confidence: 0.95,
      source_event_id: 'evt-1',
      valid_from: new Date('2026-05-01'),
      valid_until: null,
    });

    expect(result).toBeDefined();
    expect(result.statement).toBe('Claude supports 200K context');
  });

  it('returns existing fact for duplicate source_event_id + statement', async () => {
    (db as any)._seed('knowledge_facts', [
      { id: 'existing', source_event_id: 'evt-1', statement: 'Duplicate fact' },
    ]);

    const result = await insertKnowledgeFact(db as any, {
      statement: 'Duplicate fact',
      category: 'model_capability',
      entities: ['claude'],
      confidence: 0.9,
      source_event_id: 'evt-1',
      valid_from: new Date(),
      valid_until: null,
    });

    expect(result.id).toBe('existing');
  });
});

describe('findFactsByEntities', () => {
  it('returns facts with overlapping entities', async () => {
    (db as any)._seed('knowledge_facts', [
      { id: '1', entities: ['claude', 'context-window'], superseded_by: null },
      { id: '2', entities: ['gpt-4', 'pricing'], superseded_by: null },
    ]);

    const result = await findFactsByEntities(db as any, ['claude']);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('1');
  });

  it('excludes superseded facts', async () => {
    (db as any)._seed('knowledge_facts', [
      { id: '1', entities: ['claude'], superseded_by: null },
      { id: '2', entities: ['claude'], superseded_by: 'some-id' },
    ]);

    const result = await findFactsByEntities(db as any, ['claude']);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('1');
  });

  it('returns empty array when no overlap', async () => {
    (db as any)._seed('knowledge_facts', [
      { id: '1', entities: ['gpt-4'], superseded_by: null },
    ]);

    const result = await findFactsByEntities(db as any, ['claude']);
    expect(result).toHaveLength(0);
  });
});

describe('supersedeFact', () => {
  it('marks a fact as superseded', async () => {
    (db as any)._seed('knowledge_facts', [
      { id: 'old-fact', superseded_by: null, valid_until: null },
    ]);

    await supersedeFact(db as any, 'old-fact', 'new-fact');

    const facts = (db as any)._getTable('knowledge_facts');
    expect(facts[0].superseded_by).toBe('new-fact');
    expect(facts[0].valid_until).toBeDefined();
  });
});

describe('flagBlocksAtRisk', () => {
  it('returns 0 for empty supersededFactIds', async () => {
    const count = await flagBlocksAtRisk(db as any, []);
    expect(count).toBe(0);
  });

  it('flags blocks that depend on superseded facts', async () => {
    (db as any)._seed('content_blocks', [
      { id: 'b1', status: 'current', depends_on_facts: ['fact-1', 'fact-2'] },
      { id: 'b2', status: 'current', depends_on_facts: ['fact-3'] },
    ]);

    const count = await flagBlocksAtRisk(db as any, ['fact-1']);
    expect(count).toBe(1);

    const blocks = (db as any)._getTable('content_blocks');
    const b1 = blocks.find((b: any) => b.id === 'b1');
    expect(b1.status).toBe('at_risk');
  });

  it('does not flag blocks with non-matching facts', async () => {
    (db as any)._seed('content_blocks', [
      { id: 'b1', status: 'current', depends_on_facts: ['fact-99'] },
    ]);

    const count = await flagBlocksAtRisk(db as any, ['fact-1']);
    expect(count).toBe(0);
  });
});

describe('updateContentBlockMarkdown', () => {
  it('increments version and sets status to current', async () => {
    (db as any)._seed('content_blocks', [
      { id: 'block-1', version: 2, status: 'at_risk', markdown: 'old' },
    ]);

    await updateContentBlockMarkdown(db as any, 'block-1', 'new content', ['f1']);

    const blocks = (db as any)._getTable('content_blocks');
    expect(blocks[0].version).toBe(3);
    expect(blocks[0].status).toBe('current');
    expect(blocks[0].markdown).toBe('new content');
  });
});

describe('getOrCreatePipelineRun', () => {
  it('creates a new run with running status', async () => {
    const run = await getOrCreatePipelineRun(db as any);
    expect(run.status).toBe('running');
    expect(run.events_fetched).toBe(0);
  });
});

describe('updatePipelineRun', () => {
  it('sets completed_at when status is completed', async () => {
    (db as any)._seed('pipeline_runs', [
      { id: 'run-1', status: 'running', events_fetched: 0 },
    ]);

    await updatePipelineRun(db as any, 'run-1', { status: 'completed', events_fetched: 5 });

    const runs = (db as any)._getTable('pipeline_runs');
    expect(runs[0].status).toBe('completed');
    expect(runs[0].completed_at).toBeDefined();
    expect(runs[0].events_fetched).toBe(5);
  });

  it('sets completed_at when status is failed', async () => {
    (db as any)._seed('pipeline_runs', [
      { id: 'run-1', status: 'running' },
    ]);

    await updatePipelineRun(db as any, 'run-1', { status: 'failed', error: 'Something broke' });

    const runs = (db as any)._getTable('pipeline_runs');
    expect(runs[0].status).toBe('failed');
    expect(runs[0].error).toBe('Something broke');
    expect(runs[0].completed_at).toBeDefined();
  });
});

describe('getLatestPipelineRun', () => {
  it('returns null when no runs exist', async () => {
    const result = await getLatestPipelineRun(db as any);
    expect(result).toBeNull();
  });

  it('returns most recent run', async () => {
    (db as any)._seed('pipeline_runs', [
      { id: 'old', started_at: '2026-05-01' },
      { id: 'new', started_at: '2026-05-02' },
    ]);

    const result = await getLatestPipelineRun(db as any);
    expect(result).not.toBeNull();
  });
});

describe('updateProposalStatus', () => {
  it('sets reviewed_at for approved status', async () => {
    (db as any)._seed('regeneration_proposals', [
      { id: 'p1', status: 'pending' },
    ]);

    await updateProposalStatus(db as any, 'p1', 'approved');

    const proposals = (db as any)._getTable('regeneration_proposals');
    expect(proposals[0].status).toBe('approved');
    expect(proposals[0].reviewed_at).toBeDefined();
  });
});

// Helper
async function hashSha256(content: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(content);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}
