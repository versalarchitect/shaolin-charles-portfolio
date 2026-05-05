import type { LLMResponse } from '../packages/core/src/types.js';

type ResponseFactory = (prompt: string) => unknown;

let callCount = 0;
let responses: ResponseFactory[] = [];
let defaultResponse: ResponseFactory = () => ({});
const callLog: string[] = [];

export function mockLlmReset() {
  callCount = 0;
  responses = [];
  callLog.length = 0;
  defaultResponse = () => ({});
}

export function mockLlmSetDefault(factory: ResponseFactory) {
  defaultResponse = factory;
}

export function mockLlmSetResponses(factories: ResponseFactory[]) {
  responses = [...factories];
}

export function mockLlmGetCallCount() {
  return callCount;
}

export function mockLlmGetCallLog() {
  return [...callLog];
}

export function createMockLlmResponse<T>(data: T, overrides?: Partial<LLMResponse<T>>): LLMResponse<T> {
  return {
    data,
    model: 'mock-model',
    inputTokens: 100,
    outputTokens: 50,
    costUsd: 0.001,
    ...overrides,
  };
}

export async function mockLlmCall<T>(prompt: string): Promise<LLMResponse<T>> {
  callCount++;
  callLog.push(prompt);

  const factory = responses.length > 0 ? responses.shift()! : defaultResponse;
  const data = factory(prompt) as T;

  return createMockLlmResponse(data);
}

export async function mockLlmExtract<T>(
  _content: string,
  instruction: string,
): Promise<LLMResponse<T>> {
  return mockLlmCall<T>(instruction);
}

export async function mockLlmSummarize(content: string): Promise<LLMResponse<string>> {
  callCount++;
  callLog.push(`summarize: ${content.slice(0, 100)}`);
  return createMockLlmResponse(`Summary of: ${content.slice(0, 50)}...`);
}

export async function mockLlmDiff(
  _original: string,
  _updated: string,
  _context: string,
): Promise<LLMResponse<{ summary: string; changeType: string; significance: number }>> {
  callCount++;
  return createMockLlmResponse({
    summary: 'Updated content with new information',
    changeType: 'patch',
    significance: 0.7,
  });
}
