import { describe, it, expect, mock, beforeEach } from 'bun:test';
import type { KnowledgeFact } from '@course-engine/core';

// Mock llmCall before importing the module
const mockLlmCall = mock(() => Promise.resolve({
  data: {
    factually_consistent: true,
    length_reasonable: true,
    no_hallucinated_details: true,
    issues: [],
    confidence: 0.9,
  },
  model: 'mock',
  inputTokens: 100,
  outputTokens: 50,
  costUsd: 0.001,
}));

mock.module('@course-engine/core', () => ({
  llmCall: mockLlmCall,
}));

const { checkQuality } = await import('../quality-check.js');

const fakeFact: KnowledgeFact = {
  id: 'fact-1',
  statement: 'Claude Opus supports 200K tokens',
  category: 'model_capability',
  entities: ['claude-opus', 'context-window'],
  confidence: 0.95,
  source_event_id: 'evt-1',
  superseded_by: null,
  valid_from: new Date('2026-05-01'),
  valid_until: null,
};

beforeEach(() => {
  mockLlmCall.mockClear();
});

describe('checkQuality - structural checks', () => {
  it('fails when content expands > 3x', async () => {
    const original = 'Short content here.';
    const updated = 'A'.repeat(original.length * 4);

    const result = await checkQuality(original, updated, [fakeFact]);
    expect(result.passed).toBe(false);
    expect(result.issues[0]).toContain('expanded');
    // Should NOT call LLM for structural failures
    expect(mockLlmCall).not.toHaveBeenCalled();
  });

  it('fails when content shrinks below 20% (and original > 50 chars)', async () => {
    const original = 'A'.repeat(100);
    const updated = 'A'.repeat(10); // 10% of original

    const result = await checkQuality(original, updated, [fakeFact]);
    expect(result.passed).toBe(false);
    expect(result.issues[0]).toContain('shrunk');
    expect(mockLlmCall).not.toHaveBeenCalled();
  });

  it('fails when updated content is empty', async () => {
    const result = await checkQuality('Some content', '   ', [fakeFact]);
    expect(result.passed).toBe(false);
    expect(result.issues).toContain('Updated content is empty');
    expect(mockLlmCall).not.toHaveBeenCalled();
  });

  it('passes structural check for reasonable length change', async () => {
    const original = 'Original content about Claude models.';
    const updated = 'Updated content about Claude models with new info.';

    await checkQuality(original, updated, [fakeFact]);
    // Should reach the LLM call since structural checks passed
    expect(mockLlmCall).toHaveBeenCalledTimes(1);
  });

  it('does not fail structural check when shrink is <20% but original is short', async () => {
    const original = 'Short'; // 5 chars, < 50
    const updated = 'X'; // 1 char = 20% of 5, but original < 50

    await checkQuality(original, updated, [fakeFact]);
    // Since original is < 50, the shrink check doesn't trigger
    expect(mockLlmCall).toHaveBeenCalledTimes(1);
  });
});

describe('checkQuality - LLM validation', () => {
  it('passes when all booleans are true and no issues', async () => {
    mockLlmCall.mockResolvedValueOnce({
      data: {
        factually_consistent: true,
        length_reasonable: true,
        no_hallucinated_details: true,
        issues: [],
        confidence: 0.92,
      },
      model: 'mock',
      inputTokens: 100,
      outputTokens: 50,
      costUsd: 0.001,
    });

    const result = await checkQuality(
      'Original content about models.',
      'Updated content about models.',
      [fakeFact],
    );

    expect(result.passed).toBe(true);
    expect(result.issues).toHaveLength(0);
    expect(result.confidence).toBe(0.92);
  });

  it('fails when factually_consistent is false', async () => {
    mockLlmCall.mockResolvedValueOnce({
      data: {
        factually_consistent: false,
        length_reasonable: true,
        no_hallucinated_details: true,
        issues: ['Claims 500K context when fact says 200K'],
        confidence: 0.85,
      },
      model: 'mock',
      inputTokens: 100,
      outputTokens: 50,
      costUsd: 0.001,
    });

    const result = await checkQuality(
      'Original content.',
      'Updated content.',
      [fakeFact],
    );

    expect(result.passed).toBe(false);
    expect(result.issues).toContain('Claims 500K context when fact says 200K');
    expect(result.issues).toContain('Content is not factually consistent with provided facts');
  });

  it('fails when no_hallucinated_details is false', async () => {
    mockLlmCall.mockResolvedValueOnce({
      data: {
        factually_consistent: true,
        length_reasonable: true,
        no_hallucinated_details: false,
        issues: ['Invented URL https://fake.com'],
        confidence: 0.8,
      },
      model: 'mock',
      inputTokens: 100,
      outputTokens: 50,
      costUsd: 0.001,
    });

    const result = await checkQuality(
      'Original content.',
      'Updated with fake URL.',
      [fakeFact],
    );

    expect(result.passed).toBe(false);
    expect(result.issues).toContain('Invented URL https://fake.com');
    expect(result.issues).toContain('Content contains hallucinated details not present in facts');
  });

  it('passes confidence through from LLM response', async () => {
    mockLlmCall.mockResolvedValueOnce({
      data: {
        factually_consistent: true,
        length_reasonable: true,
        no_hallucinated_details: true,
        issues: [],
        confidence: 0.73,
      },
      model: 'mock',
      inputTokens: 100,
      outputTokens: 50,
      costUsd: 0.001,
    });

    const result = await checkQuality('A'.repeat(50), 'B'.repeat(50), [fakeFact]);
    expect(result.confidence).toBe(0.73);
  });
});
