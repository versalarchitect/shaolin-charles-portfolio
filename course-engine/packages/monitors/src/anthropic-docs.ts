import { BaseMonitor, stripHtml, sleep } from './base-monitor.js';
import type { SourceType, FetchedPage } from './base-monitor.js';

const ANTHROPIC_DOC_PAGES = [
  { url: 'https://docs.anthropic.com/en/docs/about-claude/models', title: 'Claude Models' },
  { url: 'https://docs.anthropic.com/en/docs/build-with-claude/tool-use', title: 'Tool Use' },
  { url: 'https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching', title: 'Prompt Caching' },
  { url: 'https://docs.anthropic.com/en/docs/build-with-claude/extended-thinking', title: 'Extended Thinking' },
  { url: 'https://docs.anthropic.com/en/docs/build-with-claude/computer-use', title: 'Computer Use' },
  { url: 'https://docs.anthropic.com/en/docs/build-with-claude/batch-processing', title: 'Batch Processing' },
  { url: 'https://docs.anthropic.com/en/docs/build-with-claude/agentic-tool-use', title: 'Agentic Tool Use' },
  { url: 'https://docs.anthropic.com/en/docs/about-claude/models/all-models', title: 'All Models Reference' },
  { url: 'https://docs.anthropic.com/en/api/messages', title: 'Messages API' },
  { url: 'https://docs.anthropic.com/en/api/streaming', title: 'Streaming' },
] as const;

const USER_AGENT = 'CourseEngine-Monitor/1.0 (+https://charlesjackson.dev)';
const RATE_LIMIT_DELAY_MS = 500;

export class AnthropicDocsMonitor extends BaseMonitor {
  readonly source: SourceType = 'anthropic_docs';
  readonly name = 'Anthropic Documentation';

  async fetchPages(): Promise<FetchedPage[]> {
    const pages: FetchedPage[] = [];

    for (const doc of ANTHROPIC_DOC_PAGES) {
      try {
        const response = await fetch(doc.url, {
          headers: { 'User-Agent': USER_AGENT },
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status} ${response.statusText}`);
        }

        const html = await response.text();
        const content = stripHtml(html);

        if (content.length > 0) {
          pages.push({
            url: doc.url,
            title: doc.title,
            content,
          });
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        pages.push({
          url: doc.url,
          title: doc.title,
          content: '',
          metadata: { error: message, skipped: true },
        });
      }

      await sleep(RATE_LIMIT_DELAY_MS);
    }

    return pages.filter((p) => p.content.length > 0);
  }
}
