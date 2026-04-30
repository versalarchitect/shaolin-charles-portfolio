import Anthropic from '@anthropic-ai/sdk';
import { z, type ZodSchema, type ZodTypeAny } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import type { ModelTier, LLMCallOptions, LLMResponse } from './types.js';
import type { TextGenerationPipeline, Message } from '@huggingface/transformers';

type Backend = 'anthropic' | 'hf-inference' | 'local';

function detectBackend(): Backend {
  const forced = process.env.LLM_BACKEND as Backend | undefined;
  if (forced === 'anthropic' || forced === 'hf-inference' || forced === 'local') return forced;
  if (process.env.ANTHROPIC_API_KEY) return 'anthropic';
  return 'hf-inference';
}

const ANTHROPIC_MODELS: Record<ModelTier, string> = {
  fast: process.env.LLM_FAST_MODEL ?? 'claude-haiku-4-5-20251001',
  smart: process.env.LLM_SMART_MODEL ?? 'claude-opus-4-7',
};

const ANTHROPIC_PRICING: Record<string, { input: number; output: number }> = {
  'claude-haiku-4-5-20251001': { input: 0.8, output: 4 },
  'claude-opus-4-7': { input: 15, output: 75 },
};

const LOCAL_MODEL_ID = process.env.LLM_LOCAL_MODEL ?? 'onnx-community/Qwen2.5-0.5B-Instruct';

const LOCAL_TIER_CONFIG: Record<ModelTier, { maxNewTokens: number; temperature: number }> = {
  fast: { maxNewTokens: 500, temperature: 0.1 },
  smart: { maxNewTokens: 2000, temperature: 0.2 },
};

const HF_API_BASE = process.env.HF_API_BASE ?? 'http://localhost:11434/v1';

const HF_MODELS: Record<ModelTier, string> = {
  fast: process.env.LLM_HF_FAST_MODEL ?? 'qwen2.5:7b',
  smart: process.env.LLM_HF_SMART_MODEL ?? 'qwen2.5:7b',
};

let anthropicClient: Anthropic | null = null;
let localPipeline: TextGenerationPipeline | null = null;
let localPipelinePromise: Promise<TextGenerationPipeline> | null = null;
let totalCostUsd = 0;
let totalCalls = 0;

export class LLMError extends Error {
  constructor(
    message: string,
    public readonly model: string,
    public readonly attempt: number,
    public readonly cause?: Error,
  ) {
    super(message);
    this.name = 'LLMError';
  }
}

export function getLLMStats(): { totalCostUsd: number; totalCalls: number } {
  return { totalCostUsd, totalCalls };
}

export function resetLLMStats(): void {
  totalCostUsd = 0;
  totalCalls = 0;
}

function createAnthropicClient(): Anthropic {
  if (anthropicClient) return anthropicClient;
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY environment variable is required but not set.');
  }
  anthropicClient = new Anthropic({ apiKey });
  return anthropicClient;
}

async function getLocalPipeline(): Promise<TextGenerationPipeline> {
  if (localPipeline) return localPipeline;
  if (localPipelinePromise) return localPipelinePromise;

  localPipelinePromise = (async () => {
    const { pipeline: createPipeline, env } = await import('@huggingface/transformers');
    env.cacheDir = process.env.HF_HOME ?? `${process.env.HOME}/.cache/huggingface`;
    const gen = await createPipeline('text-generation', LOCAL_MODEL_ID, { dtype: 'q4' as const });
    localPipeline = gen;
    return gen;
  })();

  return localPipelinePromise;
}

function extractJson(text: string): string {
  const fenced = text.match(/```(?:json)?\s*\n?([\s\S]*?)```/);
  if (fenced) return fenced[1].trim();
  return text.trim();
}

function jsonSchemaToReadable(schema: Record<string, unknown>, indent = 0): string {
  const pad = '  '.repeat(indent);
  const type = schema.type as string | undefined;

  if (type === 'object') {
    const props = schema.properties as Record<string, Record<string, unknown>> | undefined;
    const required = (schema.required as string[]) ?? [];
    if (!props) return `${pad}- object`;
    const lines: string[] = [];
    for (const [key, val] of Object.entries(props)) {
      const req = required.includes(key) ? ' (required)' : ' (optional)';
      const desc = val.description ? ` — ${val.description}` : '';
      lines.push(`${pad}- ${key}${req}${desc}: ${inlineType(val)}`);
      if (val.type === 'object' || val.type === 'array') {
        lines.push(jsonSchemaToReadable(val, indent + 2));
      }
    }
    return lines.filter(Boolean).join('\n');
  }

  if (type === 'array') {
    const items = schema.items as Record<string, unknown> | undefined;
    if (!items) return `${pad}  array of unknown`;
    if (items.type === 'object') {
      return `${pad}  each item is an object:\n${jsonSchemaToReadable(items, indent + 2)}`;
    }
    return `${pad}  each item: ${inlineType(items)}`;
  }

  return '';
}

function inlineType(schema: Record<string, unknown>): string {
  const type = schema.type as string | undefined;
  if (schema.enum) return `one of ${JSON.stringify(schema.enum)}`;
  if (type === 'array') {
    const items = schema.items as Record<string, unknown> | undefined;
    return `array of ${items ? inlineType(items) : 'unknown'}`;
  }
  if (type === 'object') return 'object (see below)';
  let result = type ?? 'unknown';
  if (schema.minimum !== undefined) result += ` (min: ${schema.minimum})`;
  if (schema.maximum !== undefined) result += ` (max: ${schema.maximum})`;
  if (schema.minLength !== undefined) result += ` (minLength: ${schema.minLength})`;
  if (schema.maxLength !== undefined) result += ` (maxLength: ${schema.maxLength})`;
  if (schema.minItems !== undefined) result += ` (minItems: ${schema.minItems})`;
  return result;
}

function schemaToPrompt(schema: ZodTypeAny): string {
  const opts = { $refStrategy: 'none' as const, target: 'openApi3' as const };
  const jsonSchema = zodToJsonSchema(schema, opts) as Record<string, unknown>;
  const example = generateSchemaExample(jsonSchema);
  return `Return a JSON object with these fields:\n${jsonSchemaToReadable(jsonSchema)}\n\nExample output:\n${JSON.stringify(example, null, 2)}`;
}

function generateSchemaExample(schema: Record<string, unknown>): unknown {
  const type = schema.type as string | undefined;
  if (type === 'object') {
    const props = schema.properties as Record<string, Record<string, unknown>> | undefined;
    if (!props) return {};
    const obj: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(props)) {
      obj[key] = generateSchemaExample(val);
    }
    return obj;
  }
  if (type === 'array') {
    const items = schema.items as Record<string, unknown> | undefined;
    return items ? [generateSchemaExample(items)] : [];
  }
  if (type === 'number' || type === 'integer') return 0.95;
  if (type === 'boolean') return true;
  if (schema.enum) return (schema.enum as string[])[0];
  return 'example';
}

function tryNormalizeOutput(parsed: unknown, schema: ZodSchema): unknown {
  const result = schema.safeParse(parsed);
  if (result.success) return parsed;

  if (Array.isArray(parsed)) {
    const wrapped = { facts: parsed, source_summary: '' };
    if (schema.safeParse(wrapped).success) return wrapped;

    const withSummary = { facts: parsed, source_summary: 'Extracted from source content.' };
    if (schema.safeParse(withSummary).success) return withSummary;
  }

  if (typeof parsed === 'object' && parsed !== null) {
    const obj = parsed as Record<string, unknown>;
    if (obj.supersedes === undefined && 'supersedes' in Object.getOwnPropertyNames(schema)) {
      return { ...obj, supersedes: false, reason: 'No supersession detected' };
    }
  }

  return parsed;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function localLLMCall<T>(
  prompt: string,
  schema: ZodSchema<T>,
  options?: LLMCallOptions,
): Promise<LLMResponse<T>> {
  const gen = await getLocalPipeline();
  const tier = options?.model ?? 'fast';
  const config = LOCAL_TIER_CONFIG[tier];
  const schemaDescription = schemaToPrompt(schema);

  const systemContent = tier === 'smart'
    ? 'You are a structured data extraction assistant. Analyze the input carefully and thoroughly. Always respond with valid JSON only, no markdown fences, no explanation, no text before or after the JSON.'
    : 'You are a structured data extraction assistant. Always respond with valid JSON only, no markdown fences, no explanation, no text before or after the JSON.';

  const MAX_ATTEMPTS = 3;
  let lastError: Error | undefined;
  let currentPrompt = prompt;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const systemStr = options?.systemPrompt
        ? `${options.systemPrompt}\n\n${systemContent}\n\n${schemaDescription}`
        : `${systemContent}\n\n${schemaDescription}`;

      const messages: Message[] = [
        { role: 'system', content: systemStr },
        { role: 'user', content: currentPrompt },
      ];

      const result = await gen(messages, {
        max_new_tokens: config.maxNewTokens,
        temperature: config.temperature,
      });

      const generated = result[0] as { generated_text: Message[] };
      const assistantMsg = generated.generated_text[generated.generated_text.length - 1];
      const rawContent = assistantMsg.content as string;
      const jsonStr = extractJson(rawContent);
      const parsed: unknown = JSON.parse(jsonStr);
      const normalized = tryNormalizeOutput(parsed, schema);
      const parseResult = schema.safeParse(normalized);

      if (!parseResult.success) {
        const validationMsg = parseResult.error.issues
          .map((i) => `${i.path.join('.')}: ${i.message}`)
          .join('; ');

        if (attempt < MAX_ATTEMPTS) {
          currentPrompt = `${prompt}\n\nYour previous response failed validation: ${validationMsg}\nPlease fix the output to match the required schema exactly.`;
          continue;
        }
        throw new Error(`Schema validation failed after ${MAX_ATTEMPTS} attempts: ${validationMsg}`);
      }

      const inputTokens = Math.ceil(messages.map((m) => String(m.content)).join('').length / 4);
      const outputTokens = Math.ceil(rawContent.length / 4);

      totalCalls += 1;

      return {
        data: parseResult.data,
        model: LOCAL_MODEL_ID,
        inputTokens,
        outputTokens,
        costUsd: 0,
      };
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      if (attempt < MAX_ATTEMPTS) {
        currentPrompt = `${prompt}\n\nYour previous response was not valid JSON. Respond with ONLY a valid JSON object, nothing else.\n\n${schemaDescription}`;
        continue;
      }
    }
  }

  throw new LLMError(
    `Local LLM call failed after ${MAX_ATTEMPTS} attempts: ${lastError?.message}`,
    LOCAL_MODEL_ID,
    MAX_ATTEMPTS,
    lastError,
  );
}

async function anthropicLLMCall<T>(
  prompt: string,
  schema: ZodSchema<T>,
  options?: LLMCallOptions,
): Promise<LLMResponse<T>> {
  const anthropic = createAnthropicClient();
  const tier = options?.model ?? 'fast';
  const modelId = ANTHROPIC_MODELS[tier];
  const maxTokens = options?.maxTokens ?? 4096;
  const temperature = options?.temperature ?? 0;

  const jsonSchema = zodToJsonSchema(schema as ZodTypeAny, {
    $refStrategy: 'none',
    target: 'openApi3',
  });

  const toolDef: Anthropic.Messages.Tool = {
    name: 'extract_data',
    description: 'Extract structured data according to the schema.',
    input_schema: jsonSchema as Anthropic.Messages.Tool['input_schema'],
  };

  const MAX_ATTEMPTS = 3;
  const BACKOFF_BASE_MS = 1000;
  let lastError: Error | undefined;
  let currentPrompt = prompt;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const messages: Anthropic.Messages.MessageParam[] = [
        { role: 'user', content: currentPrompt },
      ];

      const response = await anthropic.messages.create({
        model: modelId,
        max_tokens: maxTokens,
        temperature,
        ...(options?.systemPrompt ? { system: options.systemPrompt } : {}),
        messages,
        tools: [toolDef],
        tool_choice: { type: 'tool', name: 'extract_data' },
      });

      const toolBlock = response.content.find(
        (block): block is Anthropic.Messages.ToolUseBlock =>
          block.type === 'tool_use',
      );

      if (!toolBlock) {
        throw new Error('Model did not return a tool_use block.');
      }

      const parseResult = schema.safeParse(toolBlock.input);

      if (!parseResult.success) {
        const validationMsg = parseResult.error.issues
          .map((i) => `${i.path.join('.')}: ${i.message}`)
          .join('; ');

        if (attempt < MAX_ATTEMPTS) {
          currentPrompt = `${prompt}\n\nYour previous response failed validation: ${validationMsg}\nPlease fix the output to match the required schema exactly.`;
          await sleep(BACKOFF_BASE_MS * Math.pow(2, attempt - 1));
          continue;
        }

        throw new Error(`Schema validation failed after ${MAX_ATTEMPTS} attempts: ${validationMsg}`);
      }

      const inputTokens = response.usage.input_tokens;
      const outputTokens = response.usage.output_tokens;
      const cost =
        (inputTokens / 1_000_000) * (ANTHROPIC_PRICING[modelId] ?? ANTHROPIC_PRICING['claude-haiku-4-5-20251001']).input +
        (outputTokens / 1_000_000) * (ANTHROPIC_PRICING[modelId] ?? ANTHROPIC_PRICING['claude-haiku-4-5-20251001']).output;

      totalCostUsd += cost;
      totalCalls += 1;

      return {
        data: parseResult.data,
        model: modelId,
        inputTokens,
        outputTokens,
        costUsd: cost,
      };
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      if (error instanceof Anthropic.APIError && error.status === 429) {
        const retryAfter = error.headers?.['retry-after'];
        const waitMs = retryAfter
          ? Number(retryAfter) * 1000
          : BACKOFF_BASE_MS * Math.pow(2, attempt - 1);
        await sleep(waitMs);
        continue;
      }

      if (attempt < MAX_ATTEMPTS) {
        await sleep(BACKOFF_BASE_MS * Math.pow(2, attempt - 1));
        continue;
      }
    }
  }

  throw new LLMError(
    `LLM call failed after ${MAX_ATTEMPTS} attempts: ${lastError?.message}`,
    modelId,
    MAX_ATTEMPTS,
    lastError,
  );
}

interface HFChatResponse {
  choices: Array<{
    message: { role: string; content: string };
    finish_reason: string;
  }>;
  usage?: { prompt_tokens: number; completion_tokens: number; total_tokens: number };
}

async function hfInferenceLLMCall<T>(
  prompt: string,
  schema: ZodSchema<T>,
  options?: LLMCallOptions,
): Promise<LLMResponse<T>> {
  const tier = options?.model ?? 'fast';
  const modelId = HF_MODELS[tier];
  const maxTokens = options?.maxTokens ?? 4096;
  const temperature = options?.temperature ?? 0.1;

  const schemaDescription = schemaToPrompt(schema as ZodTypeAny);

  const systemContent = options?.systemPrompt
    ? `${options.systemPrompt}\n\nYou MUST respond with valid JSON only. No markdown fences, no explanation, no text before or after the JSON.\n\n${schemaDescription}`
    : `You are a structured data extraction assistant. You MUST respond with valid JSON only. No markdown fences, no explanation, no text before or after the JSON.\n\n${schemaDescription}`;

  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (process.env.HF_TOKEN) {
    headers['Authorization'] = `Bearer ${process.env.HF_TOKEN}`;
  }

  const MAX_ATTEMPTS = 3;
  const BACKOFF_BASE_MS = 2000;
  let lastError: Error | undefined;
  let currentPrompt = prompt;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const response = await fetch(`${HF_API_BASE}/chat/completions`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          model: modelId,
          messages: [
            { role: 'system', content: systemContent },
            { role: 'user', content: currentPrompt },
          ],
          max_tokens: maxTokens,
          temperature,
        }),
      });

      if (response.status === 503) {
        const body = await response.text();
        const waitMatch = body.match(/"estimated_time"\s*:\s*([\d.]+)/);
        const waitMs = waitMatch ? Math.ceil(Number(waitMatch[1]) * 1000) : BACKOFF_BASE_MS * attempt;
        await sleep(Math.min(waitMs, 30000));
        continue;
      }

      if (response.status === 429) {
        await sleep(BACKOFF_BASE_MS * Math.pow(2, attempt - 1));
        continue;
      }

      if (!response.ok) {
        throw new Error(`HF API error ${response.status}: ${await response.text()}`);
      }

      const data = (await response.json()) as HFChatResponse;
      const rawContent = data.choices?.[0]?.message?.content ?? '';
      const jsonStr = extractJson(rawContent);
      const parsed: unknown = JSON.parse(jsonStr);
      const parseResult = schema.safeParse(parsed);

      if (!parseResult.success) {
        const validationMsg = parseResult.error.issues
          .map((i) => `${i.path.join('.')}: ${i.message}`)
          .join('; ');

        if (attempt < MAX_ATTEMPTS) {
          currentPrompt = `${prompt}\n\nYour previous response failed validation: ${validationMsg}\nPlease fix the output to match the required schema exactly.`;
          continue;
        }
        throw new Error(`Schema validation failed after ${MAX_ATTEMPTS} attempts: ${validationMsg}`);
      }

      const inputTokens = data.usage?.prompt_tokens ?? Math.ceil(currentPrompt.length / 4);
      const outputTokens = data.usage?.completion_tokens ?? Math.ceil(rawContent.length / 4);

      totalCalls += 1;

      return {
        data: parseResult.data,
        model: modelId,
        inputTokens,
        outputTokens,
        costUsd: 0,
      };
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      if (attempt < MAX_ATTEMPTS) {
        await sleep(BACKOFF_BASE_MS * Math.pow(2, attempt - 1));
        continue;
      }
    }
  }

  throw new LLMError(
    `HF Inference call failed after ${MAX_ATTEMPTS} attempts: ${lastError?.message}`,
    modelId,
    MAX_ATTEMPTS,
    lastError,
  );
}

export async function llmCall<T>(
  prompt: string,
  schema: ZodSchema<T>,
  options?: LLMCallOptions,
): Promise<LLMResponse<T>> {
  const backend = detectBackend();
  if (backend === 'anthropic') {
    return anthropicLLMCall(prompt, schema, options);
  }
  if (backend === 'hf-inference') {
    return hfInferenceLLMCall(prompt, schema, options);
  }
  return localLLMCall(prompt, schema, options);
}

export async function llmExtract<T>(
  content: string,
  instruction: string,
  schema: ZodSchema<T>,
  options?: LLMCallOptions,
): Promise<LLMResponse<T>> {
  const prompt = `Extract the following from the content below:\n\n${instruction}\n\nContent:\n${content}`;
  return llmCall(prompt, schema, { model: 'smart', ...options });
}

export async function llmSummarize(
  content: string,
  maxWords?: number,
): Promise<LLMResponse<string>> {
  const wordConstraint = maxWords ? ` in ${maxWords} words or fewer` : '';
  const prompt = `Summarize the following content${wordConstraint}.\n\nContent:\n${content}`;

  const schema = z.object({ summary: z.string() });
  const result = await llmCall(prompt, schema, { model: 'fast' });

  return {
    data: result.data.summary,
    model: result.model,
    inputTokens: result.inputTokens,
    outputTokens: result.outputTokens,
    costUsd: result.costUsd,
  };
}

const DiffSchema = z.object({
  summary: z.string(),
  changeType: z.enum(['patch', 'rewrite', 'deprecate']),
  significance: z.number().min(0).max(1),
});

type DiffResult = z.infer<typeof DiffSchema>;

export async function llmDiff(
  original: string,
  updated: string,
  context: string,
): Promise<LLMResponse<DiffResult>> {
  const prompt = [
    `Compare the original and updated versions of the content below.`,
    `Context: ${context}`,
    ``,
    `Determine:`,
    `- A brief summary of what changed`,
    `- The change type: "patch" (minor fix/update), "rewrite" (substantial restructuring), or "deprecate" (content is no longer valid)`,
    `- A significance score from 0 (trivial) to 1 (fundamental change)`,
    ``,
    `Original:\n${original}`,
    ``,
    `Updated:\n${updated}`,
  ].join('\n');

  return llmCall(prompt, DiffSchema, { model: 'smart' });
}
