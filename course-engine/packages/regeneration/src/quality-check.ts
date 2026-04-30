import { z } from 'zod';
import { llmCall } from '@course-engine/core';
import type { KnowledgeFact } from '@course-engine/core';

export interface QualityResult {
  passed: boolean;
  issues: string[];
  confidence: number;
}

const QualitySchema = z.object({
  factually_consistent: z.boolean().describe('Whether the updated content accurately reflects the provided facts'),
  length_reasonable: z.boolean().describe('Whether the length is within a reasonable range of the original'),
  no_hallucinated_details: z.boolean().describe('Whether the content avoids invented URLs, versions, or dates not in the facts'),
  issues: z.array(z.string()).describe('List of specific issues found, empty if none'),
  confidence: z.number().min(0).max(1).describe('Overall confidence in the quality assessment'),
});

export async function checkQuality(
  original: string,
  updated: string,
  facts: KnowledgeFact[],
): Promise<QualityResult> {
  const originalLength = original.length;
  const updatedLength = updated.length;
  const lengthRatio = updatedLength / Math.max(originalLength, 1);

  // Fast structural check before spending an LLM call
  const structuralIssues: string[] = [];
  if (lengthRatio > 3) {
    structuralIssues.push(`Content expanded ${lengthRatio.toFixed(1)}x (${originalLength} → ${updatedLength} chars)`);
  }
  if (lengthRatio < 0.2 && originalLength > 50) {
    structuralIssues.push(`Content shrunk to ${(lengthRatio * 100).toFixed(0)}% of original`);
  }
  if (updated.trim().length === 0) {
    return { passed: false, issues: ['Updated content is empty'], confidence: 1 };
  }

  if (structuralIssues.length > 0) {
    return { passed: false, issues: structuralIssues, confidence: 0.95 };
  }

  const factStatements = facts
    .map((f, i) => `  ${i + 1}. ${f.statement}`)
    .join('\n');

  const prompt = [
    'You are a quality checker for educational course content that was just regenerated.',
    '',
    'Evaluate the UPDATED content against these criteria:',
    '1. FACTUAL CONSISTENCY: Does it accurately reflect the provided facts?',
    '2. LENGTH: Is the updated version a reasonable length compared to the original? (small changes are fine, 2x+ expansion is not)',
    '3. NO HALLUCINATION: Does it avoid inventing URLs, version numbers, dates, or statistics not present in the facts?',
    '',
    'FACTS THAT SHOULD BE REFLECTED:',
    factStatements,
    '',
    `ORIGINAL CONTENT (${originalLength} chars):`,
    original,
    '',
    `UPDATED CONTENT (${updatedLength} chars):`,
    updated,
  ].join('\n');

  const result = await llmCall(prompt, QualitySchema, { model: 'fast' });
  const d = result.data;

  const issues: string[] = [...d.issues];
  if (!d.factually_consistent) issues.push('Content is not factually consistent with provided facts');
  if (!d.length_reasonable) issues.push('Content length is unreasonable compared to original');
  if (!d.no_hallucinated_details) issues.push('Content contains hallucinated details not present in facts');

  const passed = d.factually_consistent && d.length_reasonable && d.no_hallucinated_details && issues.length === 0;

  return { passed, issues, confidence: d.confidence };
}
