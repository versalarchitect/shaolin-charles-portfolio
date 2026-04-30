export type SourceType =
  | 'anthropic_docs'
  | 'anthropic_changelog'
  | 'openai_changelog'
  | 'github_release'
  | 'arxiv_paper'
  | 'dev_signal';

export interface SourceEvent {
  id: string;
  source: SourceType;
  url: string;
  title: string;
  content_hash: string;
  raw_content: string;
  summary?: string;
  fetched_at: Date;
  published_at?: Date;
  metadata?: Record<string, unknown>;
}

export type FactCategory =
  | 'model_capability'
  | 'pricing'
  | 'sdk_api'
  | 'pattern'
  | 'deprecation'
  | 'release'
  | 'breaking_change'
  | 'best_practice';

export interface KnowledgeFact {
  id: string;
  statement: string;
  category: FactCategory;
  entities: string[];
  confidence: number;
  source_event_id: string;
  superseded_by?: string | null;
  valid_from: Date;
  valid_until?: Date | null;
  embedding?: number[];
}

export interface CourseModule {
  id: string;
  title: string;
  description: string;
  slug: string;
  order_index: number;
  created_at: Date;
  updated_at: Date;
}

export interface Lesson {
  id: string;
  module_id: string;
  title: string;
  description: string;
  slug: string;
  order_index: number;
  created_at: Date;
  updated_at: Date;
}

export type ContentBlockStatus = 'current' | 'at_risk' | 'stale' | 'regenerating';

export interface ContentBlock {
  id: string;
  lesson_id: string;
  order_index: number;
  heading?: string;
  markdown: string;
  depends_on_facts: string[];
  last_regenerated_at: Date;
  status: ContentBlockStatus;
  version: number;
  regeneration_prompt?: string;
  created_at: Date;
  updated_at: Date;
}

export interface RegenerationProposal {
  id: string;
  content_block_id: string;
  old_markdown: string;
  new_markdown: string;
  diff_summary: string;
  change_type: 'patch' | 'rewrite' | 'deprecate';
  confidence: number;
  triggered_by_facts: string[];
  status: 'pending' | 'approved' | 'rejected' | 'applied';
  created_at: Date;
  reviewed_at?: Date;
}

export interface PipelineRun {
  id: string;
  started_at: Date;
  completed_at?: Date;
  status: 'running' | 'completed' | 'failed';
  events_fetched: number;
  facts_extracted: number;
  blocks_flagged: number;
  proposals_generated: number;
  error?: string;
}

export type ModelTier = 'fast' | 'smart';

export interface LLMCallOptions {
  model?: ModelTier;
  maxTokens?: number;
  temperature?: number;
  systemPrompt?: string;
}

export interface LLMResponse<T> {
  data: T;
  model: string;
  inputTokens: number;
  outputTokens: number;
  costUsd: number;
}
