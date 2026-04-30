import { z } from 'zod';
import { llmCall, llmDiff } from '@course-engine/core';
import type {
  ContentBlock,
  KnowledgeFact,
  LLMCallOptions,
  RegenerationProposal,
} from '@course-engine/core';

export interface RegenerationResult {
  updated_markdown: string;
  changes_made: string[];
  confidence: number;
  diff_summary: string;
  change_type: RegenerationProposal['change_type'];
}

const RegenerationSchema = z.object({
  updated_markdown: z.string().describe('The updated markdown content with new facts applied'),
  changes_made: z.array(z.string()).describe('List of specific changes made to the content'),
  confidence: z.number().min(0).max(1).describe('How confident you are in the accuracy of the update'),
});

function buildRegenerationPrompt(
  block: ContentBlock,
  oldFacts: KnowledgeFact[],
  newFacts: KnowledgeFact[],
): string {
  const oldFactList = oldFacts
    .map((f, i) => `  ${i + 1}. [OUTDATED] ${f.statement}`)
    .join('\n');
  const newFactList = newFacts
    .map((f, i) => `  ${i + 1}. [CURRENT] ${f.statement}`)
    .join('\n');

  const lines = [
    'You are updating educational course content to reflect new information.',
    '',
    'TASK: Update the markdown below so it reflects the CURRENT facts instead of the OUTDATED facts.',
    '',
    'RULES:',
    '- Preserve the original tone, structure, and approximate length',
    '- Only change what is necessary to incorporate the new facts',
    '- Do not add information beyond what the new facts provide',
    '- Do not invent URLs, version numbers, or dates not present in the new facts',
    '- Keep all existing formatting (headers, code blocks, lists)',
  ];

  if (block.heading) {
    lines.push('', `SECTION HEADING: ${block.heading}`);
  }

  if (block.regeneration_prompt) {
    lines.push('', `ADDITIONAL INSTRUCTIONS: ${block.regeneration_prompt}`);
  }

  lines.push(
    '',
    'OUTDATED FACTS (to be replaced):',
    oldFactList,
    '',
    'CURRENT FACTS (to use instead):',
    newFactList,
    '',
    'CURRENT MARKDOWN:',
    block.markdown,
  );

  return lines.join('\n');
}

export async function regenerateBlock(
  block: ContentBlock,
  oldFacts: KnowledgeFact[],
  newFacts: KnowledgeFact[],
  options?: LLMCallOptions,
): Promise<RegenerationResult> {
  const prompt = buildRegenerationPrompt(block, oldFacts, newFacts);

  const llmResult = await llmCall(prompt, RegenerationSchema, { model: 'smart', ...options });

  const diff = await llmDiff(
    block.markdown,
    llmResult.data.updated_markdown,
    `Updating content block "${block.heading ?? block.id}" due to superseded facts`,
  );

  return {
    updated_markdown: llmResult.data.updated_markdown,
    changes_made: llmResult.data.changes_made,
    confidence: llmResult.data.confidence,
    diff_summary: diff.data.summary,
    change_type: diff.data.changeType,
  };
}
