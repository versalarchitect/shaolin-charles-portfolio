import { createHash, randomUUID } from 'crypto';

type SourceType =
  | 'anthropic_docs'
  | 'anthropic_changelog'
  | 'openai_changelog'
  | 'github_release'
  | 'arxiv_paper'
  | 'dev_signal';

interface SourceEvent {
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

export interface MonitorResult {
  events: SourceEvent[];
  errors: string[];
  duration_ms: number;
}

export interface FetchedPage {
  url: string;
  title: string;
  content: string;
  publishedAt?: Date;
  metadata?: Record<string, unknown>;
}

export function stripHtml(html: string): string {
  return html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, '/')
    .replace(/\s+/g, ' ')
    .trim();
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export abstract class BaseMonitor {
  abstract readonly source: SourceType;
  abstract readonly name: string;

  abstract fetchPages(): Promise<FetchedPage[]>;

  async run(existingHashes: Set<string>): Promise<MonitorResult> {
    const start = performance.now();
    const events: SourceEvent[] = [];
    const errors: string[] = [];

    let pages: FetchedPage[] = [];
    try {
      pages = await this.fetchPages();
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      errors.push(`Failed to fetch pages for ${this.name}: ${message}`);
    }

    for (const page of pages) {
      if (page.content.length < 100) continue;

      const contentHash = this.hashContent(page.content);

      if (existingHashes.has(contentHash)) {
        continue;
      }

      events.push({
        id: this.generateId(),
        source: this.source,
        url: page.url,
        title: page.title,
        content_hash: contentHash,
        raw_content: page.content,
        fetched_at: new Date(),
        published_at: page.publishedAt,
        metadata: page.metadata,
      });
    }

    const duration_ms = Math.round(performance.now() - start);

    return { events, errors, duration_ms };
  }

  protected hashContent(content: string): string {
    return createHash('sha256').update(content).digest('hex');
  }

  protected generateId(): string {
    return randomUUID();
  }
}

export type { SourceType, SourceEvent };
