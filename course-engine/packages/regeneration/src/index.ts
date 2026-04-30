import {
  getContentBlocksByStatus,
  getFactById,
  updateContentBlockStatus,
} from '@course-engine/core';
import type {
  ContentBlock,
  KnowledgeFact,
  LLMCallOptions,
  RegenerationProposal,
} from '@course-engine/core';

import { regenerateBlock } from './regenerator.js';
import type { RegenerationResult } from './regenerator.js';
import { checkQuality } from './quality-check.js';
import type { QualityResult } from './quality-check.js';

// Derive the DB client type from core's function signatures to avoid
// depending on a separate @supabase/supabase-js installation.
type DbClient = Parameters<typeof getContentBlocksByStatus>[0];

export { regenerateBlock } from './regenerator.js';
export type { RegenerationResult } from './regenerator.js';
export { checkQuality } from './quality-check.js';
export type { QualityResult } from './quality-check.js';

export interface RegenerateAndProposeOptions extends LLMCallOptions {
  skipQualityCheck?: boolean;
}

export async function regenerateAndPropose(
  db: DbClient,
  block: ContentBlock,
  oldFacts: KnowledgeFact[],
  newFacts: KnowledgeFact[],
  options?: RegenerateAndProposeOptions,
): Promise<RegenerationProposal | null> {
  const result = await regenerateBlock(block, oldFacts, newFacts, options);

  if (!options?.skipQualityCheck) {
    const quality = await checkQuality(block.markdown, result.updated_markdown, newFacts);
    if (!quality.passed) {
      console.warn(
        `Quality check failed for block ${block.id}: ${quality.issues.join('; ')}`,
      );
      return null;
    }
  }

  const triggeredFactIds = [
    ...oldFacts.map((f) => f.id),
    ...newFacts.map((f) => f.id),
  ];

  const proposal: Omit<RegenerationProposal, 'id' | 'created_at'> = {
    content_block_id: block.id,
    old_markdown: block.markdown,
    new_markdown: result.updated_markdown,
    diff_summary: result.diff_summary,
    change_type: result.change_type,
    confidence: result.confidence,
    triggered_by_facts: triggeredFactIds,
    status: 'pending',
  };

  // Return the proposal shape — caller handles DB insertion
  return {
    id: crypto.randomUUID(),
    ...proposal,
    created_at: new Date(),
  } as RegenerationProposal;
}

async function resolveFactPairs(
  db: DbClient,
  block: ContentBlock,
): Promise<{ oldFacts: KnowledgeFact[]; newFacts: KnowledgeFact[] } | null> {
  const factResults = await Promise.all(
    block.depends_on_facts.map((factId) => getFactById(db, factId)),
  );

  const oldFacts: KnowledgeFact[] = [];
  const newFacts: KnowledgeFact[] = [];

  for (const fact of factResults) {
    if (!fact) continue;
    if (!fact.superseded_by) continue;

    oldFacts.push(fact);
    const replacement = await getFactById(db, fact.superseded_by);
    if (replacement) newFacts.push(replacement);
  }

  if (oldFacts.length === 0 || newFacts.length === 0) return null;

  return { oldFacts, newFacts };
}

export async function regenerateAtRiskBlocks(
  db: DbClient,
  options?: RegenerateAndProposeOptions,
): Promise<RegenerationProposal[]> {
  const blocks = await getContentBlocksByStatus(db, 'at_risk');
  const proposals: RegenerationProposal[] = [];

  for (const block of blocks) {
    try {
      await updateContentBlockStatus(db, block.id, 'regenerating');

      const pairs = await resolveFactPairs(db, block);
      if (!pairs) {
        await updateContentBlockStatus(db, block.id, 'at_risk');
        continue;
      }

      const proposal = await regenerateAndPropose(
        db,
        block,
        pairs.oldFacts,
        pairs.newFacts,
        options,
      );

      if (proposal) {
        proposals.push(proposal);
      }

      // Revert to at_risk — stays there until proposal is approved and applied
      await updateContentBlockStatus(db, block.id, 'at_risk');
    } catch (error) {
      console.error(`Failed to regenerate block ${block.id}:`, error);
      await updateContentBlockStatus(db, block.id, 'at_risk');
    }
  }

  return proposals;
}
