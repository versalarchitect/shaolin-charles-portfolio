import { extractFacts, type ExtractionResult } from './extractor.js';
import { checkSupersessionBatch, type SupersessionResult } from './supersession.js';
import type { SourceEvent, KnowledgeFact, LLMCallOptions } from '@course-engine/core';

export { extractFacts, type ExtractionResult } from './extractor.js';
export { checkSupersession, checkSupersessionBatch, type SupersessionResult } from './supersession.js';

export async function extractAndReconcile(
  events: SourceEvent[],
  existingFacts: KnowledgeFact[],
  options?: { model?: LLMCallOptions['model'] },
): Promise<{
  newFacts: KnowledgeFact[];
  supersessions: Array<{ newFactId: string; oldFactId: string; reason?: string }>;
  summaries: Map<string, string>;
}> {
  const extractionResults: (ExtractionResult | null)[] = [];
  for (const event of events) {
    try {
      extractionResults.push(await extractFacts(event, options));
    } catch {
      extractionResults.push(null);
    }
  }

  const allNewFacts: KnowledgeFact[] = [];
  const summaries = new Map<string, string>();

  for (let i = 0; i < events.length; i++) {
    const result = extractionResults[i];
    if (!result) continue;

    allNewFacts.push(...result.facts);
    summaries.set(events[i].id, result.summary);
  }

  if (allNewFacts.length === 0) {
    return { newFacts: [], supersessions: [], summaries };
  }

  let supersessionResults: SupersessionResult[] = [];
  try {
    supersessionResults = await checkSupersessionBatch(allNewFacts, existingFacts, options);
  } catch {
    supersessionResults = allNewFacts.map((fact) => ({ new_fact: fact, supersedes: null }));
  }

  const supersessions = supersessionResults
    .filter((r): r is SupersessionResult & { supersedes: string } => r.supersedes !== null)
    .map((r) => ({
      newFactId: r.new_fact.id,
      oldFactId: r.supersedes,
      reason: r.reason,
    }));

  return { newFacts: allNewFacts, supersessions, summaries };
}
