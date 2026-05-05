import { describe, it, expect, mock, beforeEach } from 'bun:test';
import type { KnowledgeFact } from '@course-engine/core';

const mockLlmCall = mock(() => Promise.resolve({
  data: { supersedes: false, reason: 'Different topics' },
  model: 'mock',
  inputTokens: 50,
  outputTokens: 30,
  costUsd: 0.0001,
}));

mock.module('@course-engine/core', () => ({
  llmCall: mockLlmCall,
}));

const { checkSupersession, checkSupersessionBatch } = await import('../supersession.js');

function makeFact(overrides: Partial<KnowledgeFact> = {}): KnowledgeFact {
  return {
    id: `fact-${Math.random().toString(36).slice(2, 8)}`,
    statement: 'Test fact statement',
    category: 'model_capability',
    entities: ['claude-opus-4'],
    confidence: 0.95,
    source_event_id: 'evt-1',
    superseded_by: null,
    valid_from: new Date('2026-05-01'),
    valid_until: null,
    ...overrides,
  };
}

beforeEach(() => {
  mockLlmCall.mockClear();
  mockLlmCall.mockResolvedValue({
    data: { supersedes: false, reason: 'Different topics' },
    model: 'mock',
    inputTokens: 50,
    outputTokens: 30,
    costUsd: 0.0001,
  });
});

describe('checkSupersession', () => {
  it('returns supersedes: null when no candidates (no entity overlap)', async () => {
    const newFact = makeFact({ entities: ['claude-opus-4'] });
    const existing = [makeFact({ entities: ['gpt-4'] })];

    const result = await checkSupersession(newFact, existing);
    expect(result.supersedes).toBeNull();
    expect(result.new_fact).toBe(newFact);
    expect(mockLlmCall).not.toHaveBeenCalled();
  });

  it('returns supersedes: null when all candidates are already superseded', async () => {
    const newFact = makeFact({ entities: ['claude-opus-4'] });
    const existing = [makeFact({ entities: ['claude-opus-4'], superseded_by: 'other-fact' })];

    const result = await checkSupersession(newFact, existing);
    expect(result.supersedes).toBeNull();
    expect(mockLlmCall).not.toHaveBeenCalled();
  });

  it('calls LLM when candidates exist and returns superseded fact ID on match', async () => {
    mockLlmCall.mockResolvedValueOnce({
      data: { supersedes: true, reason: 'New pricing replaces old' },
      model: 'mock',
      inputTokens: 50,
      outputTokens: 30,
      costUsd: 0.0001,
    });

    const newFact = makeFact({
      entities: ['claude-opus-4', 'pricing'],
      statement: 'Claude Opus 4 costs $15/MTok input',
    });
    const oldFact = makeFact({
      id: 'old-fact-id',
      entities: ['claude-opus-4', 'pricing'],
      statement: 'Claude Opus 4 costs $12/MTok input',
    });

    const result = await checkSupersession(newFact, [oldFact]);
    expect(result.supersedes).toBe('old-fact-id');
    expect(result.reason).toBe('New pricing replaces old');
    expect(mockLlmCall).toHaveBeenCalledTimes(1);
  });

  it('returns null when LLM says no supersession', async () => {
    const newFact = makeFact({
      entities: ['claude-opus-4'],
      statement: 'Claude Opus 4 supports tool use',
    });
    const existingFact = makeFact({
      entities: ['claude-opus-4'],
      statement: 'Claude Opus 4 has 200K context',
    });

    const result = await checkSupersession(newFact, [existingFact]);
    expect(result.supersedes).toBeNull();
  });

  it('handles LLM failure gracefully (returns no supersession)', async () => {
    mockLlmCall.mockRejectedValueOnce(new Error('API timeout'));

    const newFact = makeFact({ entities: ['claude-opus-4'] });
    const existingFact = makeFact({ entities: ['claude-opus-4'] });

    const result = await checkSupersession(newFact, [existingFact]);
    expect(result.supersedes).toBeNull();
  });

  it('checks multiple candidates until one supersedes', async () => {
    mockLlmCall
      .mockResolvedValueOnce({
        data: { supersedes: false, reason: 'Different topics' },
        model: 'mock', inputTokens: 50, outputTokens: 30, costUsd: 0.0001,
      })
      .mockResolvedValueOnce({
        data: { supersedes: true, reason: 'Updated pricing' },
        model: 'mock', inputTokens: 50, outputTokens: 30, costUsd: 0.0001,
      });

    const newFact = makeFact({ entities: ['claude-opus-4', 'pricing'] });
    const existing = [
      makeFact({ id: 'candidate-1', entities: ['claude-opus-4'] }),
      makeFact({ id: 'candidate-2', entities: ['pricing', 'claude-opus-4'] }),
    ];

    const result = await checkSupersession(newFact, existing);
    expect(result.supersedes).toBe('candidate-2');
    expect(mockLlmCall).toHaveBeenCalledTimes(2);
  });
});

describe('checkSupersessionBatch', () => {
  it('separates facts with and without candidates', async () => {
    const factWithCandidate = makeFact({ entities: ['claude-opus-4'] });
    const factWithout = makeFact({ entities: ['completely-unique'] });
    const existing = [makeFact({ entities: ['claude-opus-4'] })];

    const results = await checkSupersessionBatch([factWithCandidate, factWithout], existing);
    expect(results).toHaveLength(2);

    const withoutResult = results.find((r) => r.new_fact === factWithout);
    expect(withoutResult!.supersedes).toBeNull();
  });

  it('only calls LLM for facts with candidates', async () => {
    const factsToCheck = [
      makeFact({ entities: ['no-match-entity'] }),
      makeFact({ entities: ['no-match-entity-2'] }),
    ];
    const existing = [makeFact({ entities: ['different-entity'] })];

    await checkSupersessionBatch(factsToCheck, existing);
    expect(mockLlmCall).not.toHaveBeenCalled();
  });

  it('returns results for all input facts', async () => {
    const facts = [
      makeFact({ entities: ['a'] }),
      makeFact({ entities: ['b'] }),
      makeFact({ entities: ['c'] }),
    ];
    const existing = [makeFact({ entities: ['a'] })];

    const results = await checkSupersessionBatch(facts, existing);
    expect(results).toHaveLength(3);
  });
});
