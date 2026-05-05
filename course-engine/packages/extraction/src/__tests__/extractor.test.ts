import { describe, it, expect, mock, beforeEach } from 'bun:test';
import type { SourceEvent } from '@course-engine/core';

const mockLlmCall = mock(() => Promise.resolve({
  data: {
    facts: [
      {
        statement: 'Claude Opus 4 supports 200K context windows',
        category: 'model_capability',
        entities: ['claude-opus-4', 'context-window'],
        confidence: 0.95,
      },
    ],
    source_summary: 'Documentation about Claude Opus 4 capabilities.',
  },
  model: 'claude-haiku-4-5-20251001',
  inputTokens: 500,
  outputTokens: 100,
  costUsd: 0.002,
}));

mock.module('@course-engine/core', () => ({
  llmCall: mockLlmCall,
}));

const { extractFacts } = await import('../extractor.js');

function makeEvent(overrides: Partial<SourceEvent> = {}): SourceEvent {
  return {
    id: 'evt-test',
    source: 'anthropic_docs',
    url: 'https://docs.anthropic.com/models',
    title: 'Claude Models',
    content_hash: 'abc123',
    raw_content: 'Claude Opus 4 is a large language model with a 200K token context window.',
    fetched_at: new Date('2026-05-01T10:00:00Z'),
    published_at: new Date('2026-04-28T00:00:00Z'),
    ...overrides,
  };
}

beforeEach(() => {
  mockLlmCall.mockClear();
  mockLlmCall.mockResolvedValue({
    data: {
      facts: [
        {
          statement: 'Claude Opus 4 supports 200K context windows',
          category: 'model_capability',
          entities: ['claude-opus-4', 'context-window'],
          confidence: 0.95,
        },
      ],
      source_summary: 'Documentation about Claude Opus 4 capabilities.',
    },
    model: 'claude-haiku-4-5-20251001',
    inputTokens: 500,
    outputTokens: 100,
    costUsd: 0.002,
  });
});

describe('extractFacts', () => {
  it('returns extracted facts with UUIDs', async () => {
    const result = await extractFacts(makeEvent());
    expect(result.facts.length).toBe(1);
    expect(result.facts[0].id).toBeTruthy();
    expect(result.facts[0].statement).toBe('Claude Opus 4 supports 200K context windows');
  });

  it('sets source_event_id on all extracted facts', async () => {
    const event = makeEvent({ id: 'my-event-id' });
    const result = await extractFacts(event);
    for (const fact of result.facts) {
      expect(fact.source_event_id).toBe('my-event-id');
    }
  });

  it('uses published_at as valid_from when available', async () => {
    const publishedAt = new Date('2026-04-20T00:00:00Z');
    const event = makeEvent({ published_at: publishedAt });
    const result = await extractFacts(event);
    expect(result.facts[0].valid_from).toEqual(publishedAt);
  });

  it('uses fetched_at as valid_from when published_at is missing', async () => {
    const fetchedAt = new Date('2026-05-01T10:00:00Z');
    const event = makeEvent({ published_at: undefined, fetched_at: fetchedAt });
    const result = await extractFacts(event);
    expect(result.facts[0].valid_from).toEqual(fetchedAt);
  });

  it('normalizes entities to lowercase hyphenated', async () => {
    mockLlmCall.mockResolvedValueOnce({
      data: {
        facts: [
          {
            statement: 'Test statement',
            category: 'sdk_api',
            entities: ['Claude Opus 4', 'Context Window'],
            confidence: 0.9,
          },
        ],
        source_summary: 'Summary.',
      },
      model: 'mock',
      inputTokens: 100,
      outputTokens: 50,
      costUsd: 0.001,
    });

    const result = await extractFacts(makeEvent());
    expect(result.facts[0].entities).toEqual(['claude-opus-4', 'context-window']);
  });

  it('returns summary from LLM response', async () => {
    const result = await extractFacts(makeEvent());
    expect(result.summary).toBe('Documentation about Claude Opus 4 capabilities.');
  });

  it('calls LLM with smart model by default', async () => {
    await extractFacts(makeEvent());
    expect(mockLlmCall).toHaveBeenCalledTimes(1);
  });

  it('handles empty facts array from LLM', async () => {
    mockLlmCall.mockResolvedValueOnce({
      data: { facts: [], source_summary: 'No facts extracted.' },
      model: 'mock',
      inputTokens: 100,
      outputTokens: 20,
      costUsd: 0.001,
    });

    const result = await extractFacts(makeEvent());
    expect(result.facts).toHaveLength(0);
    expect(result.summary).toBe('No facts extracted.');
  });

  it('sets category from LLM response', async () => {
    mockLlmCall.mockResolvedValueOnce({
      data: {
        facts: [
          { statement: 'SDK v5 released', category: 'release', entities: ['sdk'], confidence: 0.9 },
        ],
        source_summary: 'Release notes.',
      },
      model: 'mock',
      inputTokens: 100,
      outputTokens: 50,
      costUsd: 0.001,
    });

    const result = await extractFacts(makeEvent());
    expect(result.facts[0].category).toBe('release');
  });
});
