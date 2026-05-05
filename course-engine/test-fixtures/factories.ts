import type {
  SourceEvent,
  KnowledgeFact,
  ContentBlock,
  RegenerationProposal,
  PipelineRun,
  SourceType,
  FactCategory,
  ContentBlockStatus,
} from '../packages/core/src/types.js';

let counter = 0;
function nextId() { return `test-${++counter}-${Date.now().toString(36)}`; }

export function createSourceEvent(overrides: Partial<SourceEvent> = {}): SourceEvent {
  return {
    id: nextId(),
    source: 'anthropic_docs' as SourceType,
    url: 'https://docs.anthropic.com/test',
    title: 'Test Document',
    content_hash: `hash-${nextId()}`,
    raw_content: 'This is test content for the source event with sufficient length to pass filtering.',
    fetched_at: new Date('2026-05-01T00:00:00Z'),
    ...overrides,
  };
}

export function createKnowledgeFact(overrides: Partial<KnowledgeFact> = {}): KnowledgeFact {
  return {
    id: nextId(),
    statement: 'Claude Opus 4 supports 200K token context windows',
    category: 'model_capability' as FactCategory,
    entities: ['claude-opus-4', 'context-window'],
    confidence: 0.95,
    source_event_id: nextId(),
    superseded_by: null,
    valid_from: new Date('2026-05-01T00:00:00Z'),
    valid_until: null,
    ...overrides,
  };
}

export function createContentBlock(overrides: Partial<ContentBlock> = {}): ContentBlock {
  return {
    id: nextId(),
    lesson_id: nextId(),
    order_index: 0,
    heading: 'Test Block',
    markdown: '## Test Block\n\nThis is test content for the content block.',
    depends_on_facts: [],
    last_regenerated_at: new Date('2026-05-01T00:00:00Z'),
    status: 'current' as ContentBlockStatus,
    version: 1,
    created_at: new Date('2026-04-01T00:00:00Z'),
    updated_at: new Date('2026-05-01T00:00:00Z'),
    ...overrides,
  };
}

export function createRegenerationProposal(overrides: Partial<RegenerationProposal> = {}): RegenerationProposal {
  return {
    id: nextId(),
    content_block_id: nextId(),
    old_markdown: '## Old Content\n\nPrevious version of the content.',
    new_markdown: '## Updated Content\n\nNew version with updated facts.',
    diff_summary: 'Updated model capability information',
    change_type: 'patch',
    confidence: 0.9,
    triggered_by_facts: [nextId()],
    status: 'pending',
    created_at: new Date('2026-05-01T00:00:00Z'),
    ...overrides,
  };
}

export function createPipelineRun(overrides: Partial<PipelineRun> = {}): PipelineRun {
  return {
    id: nextId(),
    started_at: new Date('2026-05-01T00:00:00Z'),
    status: 'running',
    events_fetched: 0,
    facts_extracted: 0,
    blocks_flagged: 0,
    proposals_generated: 0,
    ...overrides,
  };
}

export function resetFactoryCounter() {
  counter = 0;
}
