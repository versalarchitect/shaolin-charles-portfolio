import { z } from 'zod';
import { llmCall } from '@course-engine/core';
import type { SourceEvent, SourceType, KnowledgeFact, LLMCallOptions } from '@course-engine/core';

const ExtractedFactSchema = z.object({
  statement: z.string().min(10).max(500),
  category: z.enum([
    'model_capability', 'pricing', 'sdk_api', 'pattern',
    'deprecation', 'release', 'breaking_change', 'best_practice',
  ]),
  entities: z.array(z.string()).min(1),
  confidence: z.number().min(0).max(1),
});

const ExtractionResultSchema = z.object({
  facts: z.array(ExtractedFactSchema),
  source_summary: z.string(),
});

export interface ExtractionResult {
  facts: KnowledgeFact[];
  summary: string;
  model_used: string;
  input_tokens: number;
  output_tokens: number;
}

const CONFIDENCE_GUIDE: Record<SourceType, string> = {
  anthropic_docs: '0.95–1.0 (official documentation)',
  anthropic_changelog: '0.90–0.98 (official changelog)',
  openai_changelog: '0.90–0.98 (official changelog)',
  github_release: '0.85–0.95 (official release notes)',
  arxiv_paper: '0.60–0.85 (research, may not reflect production)',
  dev_signal: '0.30–0.70 (community signal, verify independently)',
};

function buildExtractionPrompt(event: SourceEvent): string {
  return `You are a knowledge extraction agent for an AI engineering course platform. Your job is to extract atomic, independently-useful facts from source documents about AI models, APIs, SDKs, and developer tools.

SOURCE METADATA:
- Type: ${event.source}
- Title: ${event.title}
- URL: ${event.url}
- Published: ${event.published_at ? String(event.published_at) : 'unknown'}
- Fetched: ${String(event.fetched_at)}

CONFIDENCE GUIDE for this source type: ${CONFIDENCE_GUIDE[event.source]}

EXTRACTION RULES:

1. Each fact must be a single atomic claim that can independently be true or false.
   BAD: "Claude Opus 4.7 is a powerful model with many features"
   GOOD: "Claude Opus 4.7 supports a 200K token context window"

2. Be specific — include version numbers, dates, exact values, and precise capabilities.
   BAD: "The API has rate limits"
   GOOD: "The Claude API enforces a rate limit of 4000 requests per minute on the Tier 4 plan"

3. Entity tags must be normalized: lowercase, hyphen-separated, no spaces.
   Examples: "claude-opus-4-7", "tool-use", "anthropic-sdk", "gpt-4o", "openai-api"
   Include all relevant entities: model names, API features, SDK packages, companies.

4. Category must precisely match the nature of the fact:
   - model_capability: What a model can do (context window, modalities, performance)
   - pricing: Cost per token, tier pricing, free tier limits
   - sdk_api: SDK methods, API endpoints, parameters, authentication
   - pattern: Recommended usage patterns, prompt engineering techniques
   - deprecation: Features being removed or sunset
   - release: New version launches, availability dates
   - breaking_change: Changes that break existing integrations
   - best_practice: Official or widely-accepted recommendations

5. Confidence reflects certainty based on the source, not importance. Use the confidence guide above.

6. Do NOT extract:
   - Marketing fluff or subjective opinions
   - Information already widely known for 6+ months with no update
   - Duplicate facts (each fact should be unique within this extraction)

7. source_summary: Write 1-2 sentences summarizing what this source document covers overall.

SOURCE CONTENT:
${event.raw_content.slice(0, 6000)}`;
}

export async function extractFacts(
  event: SourceEvent,
  options?: { model?: LLMCallOptions['model'] },
): Promise<ExtractionResult> {
  const prompt = buildExtractionPrompt(event);

  const response = await llmCall(prompt, ExtractionResultSchema, {
    model: options?.model ?? 'smart',
    maxTokens: 4096,
  });

  const facts: KnowledgeFact[] = response.data.facts.map((fact) => ({
    id: crypto.randomUUID(),
    statement: fact.statement,
    category: fact.category,
    entities: fact.entities.map((e) => e.toLowerCase().replace(/\s+/g, '-')),
    confidence: fact.confidence,
    source_event_id: event.id,
    superseded_by: null,
    valid_from: event.published_at ?? event.fetched_at,
    valid_until: null,
  }));

  return {
    facts,
    summary: response.data.source_summary,
    model_used: response.model,
    input_tokens: response.inputTokens,
    output_tokens: response.outputTokens,
  };
}
