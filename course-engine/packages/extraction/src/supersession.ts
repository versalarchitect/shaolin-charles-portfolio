import { z } from 'zod';
import { llmCall } from '@course-engine/core';
import type { KnowledgeFact, LLMCallOptions } from '@course-engine/core';

export interface SupersessionResult {
  new_fact: KnowledgeFact;
  supersedes: string | null;
  reason?: string;
}

const SupersessionSchema = z.object({
  supersedes: z.boolean(),
  reason: z.string(),
});

function findCandidates(newFact: KnowledgeFact, existingFacts: KnowledgeFact[]): KnowledgeFact[] {
  const newEntities = new Set(newFact.entities);
  return existingFacts.filter((existing) => {
    if (existing.superseded_by) return false;
    return existing.entities.some((entity) => newEntities.has(entity));
  });
}

async function checkSingleSupersession(
  newFact: KnowledgeFact,
  existing: KnowledgeFact,
): Promise<{ supersedes: boolean; reason: string }> {
  const prompt = `Given these two facts about AI technology:
EXISTING: "${existing.statement}"
NEW: "${newFact.statement}"

Does the NEW fact supersede (replace, update, or contradict) the EXISTING fact?
A fact is superseded when:
- Both facts address the same specific topic/entity AND the new fact provides updated information
- A price change replaces the old price for the same model/tier
- A deprecation notice replaces a capability claim about the deprecated feature
- A newer model version replaces claims about the older version for the same capability

A fact is NOT superseded when:
- The facts are about different topics, even if they share an entity
- Both facts can be simultaneously true
- The facts are complementary rather than contradictory`;

  try {
    const response = await llmCall(prompt, SupersessionSchema, {
      model: 'fast',
      maxTokens: 256,
    });
    return { supersedes: response.data.supersedes, reason: response.data.reason };
  } catch {
    return { supersedes: false, reason: 'LLM call failed during supersession check' };
  }
}

export async function checkSupersession(
  newFact: KnowledgeFact,
  existingFacts: KnowledgeFact[],
  options?: { model?: LLMCallOptions['model'] },
): Promise<SupersessionResult> {
  void options;
  const candidates = findCandidates(newFact, existingFacts);

  if (candidates.length === 0) {
    return { new_fact: newFact, supersedes: null };
  }

  for (const candidate of candidates) {
    const result = await checkSingleSupersession(newFact, candidate);
    if (result.supersedes) {
      return {
        new_fact: newFact,
        supersedes: candidate.id,
        reason: result.reason,
      };
    }
  }

  return { new_fact: newFact, supersedes: null };
}

export async function checkSupersessionBatch(
  newFacts: KnowledgeFact[],
  existingFacts: KnowledgeFact[],
  options?: { model?: LLMCallOptions['model'] },
): Promise<SupersessionResult[]> {
  const withCandidates: Array<{ fact: KnowledgeFact; hasCandidates: boolean }> = newFacts.map((fact) => ({
    fact,
    hasCandidates: findCandidates(fact, existingFacts).length > 0,
  }));

  const noCandidateResults: SupersessionResult[] = withCandidates
    .filter((item) => !item.hasCandidates)
    .map((item) => ({ new_fact: item.fact, supersedes: null }));

  const needsCheck = withCandidates.filter((item) => item.hasCandidates);

  const checkedResults = await Promise.all(
    needsCheck.map((item) => checkSupersession(item.fact, existingFacts, options)),
  );

  return [...noCandidateResults, ...checkedResults];
}
