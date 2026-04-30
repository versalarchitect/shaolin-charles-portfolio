import { BaseMonitor, stripHtml, sleep } from './base-monitor.js';
import type { SourceType, FetchedPage } from './base-monitor.js';

const CHANGELOG_URLS = [
  'https://www.anthropic.com/news',
];

const USER_AGENT = 'CourseEngine-Monitor/1.0 (+https://charlesjackson.dev)';
const RATE_LIMIT_DELAY_MS = 500;

function extractChangelogEntries(html: string, sourceUrl: string): FetchedPage[] {
  const entries: FetchedPage[] = [];

  const articlePattern = /<article[^>]*>([\s\S]*?)<\/article>/gi;
  let match: RegExpExecArray | null;

  while ((match = articlePattern.exec(html)) !== null) {
    const articleHtml = match[1];
    const content = stripHtml(articleHtml);

    if (content.length < 20) continue;

    const titleMatch = articleHtml.match(/<h[1-3][^>]*>([\s\S]*?)<\/h[1-3]>/i);
    const title = titleMatch ? stripHtml(titleMatch[1]) : content.slice(0, 80);

    const dateMatch = articleHtml.match(
      /<time[^>]*datetime=["']([^"']+)["'][^>]*>/i
    );
    const publishedAt = dateMatch ? new Date(dateMatch[1]) : undefined;

    const linkMatch = articleHtml.match(/<a[^>]*href=["']([^"']+)["'][^>]*>/i);
    const entryUrl = linkMatch ? resolveUrl(linkMatch[1], sourceUrl) : sourceUrl;

    entries.push({
      url: entryUrl,
      title,
      content,
      publishedAt: publishedAt && !isNaN(publishedAt.getTime()) ? publishedAt : undefined,
    });
  }

  return entries;
}

function extractSectionEntries(html: string, sourceUrl: string): FetchedPage[] {
  const entries: FetchedPage[] = [];

  const sectionPattern = /<(?:section|div)[^>]*class="[^"]*(?:changelog|post|entry|news)[^"]*"[^>]*>([\s\S]*?)<\/(?:section|div)>/gi;
  let match: RegExpExecArray | null;

  while ((match = sectionPattern.exec(html)) !== null) {
    const sectionHtml = match[1];
    const content = stripHtml(sectionHtml);

    if (content.length < 20) continue;

    const titleMatch = sectionHtml.match(/<h[1-4][^>]*>([\s\S]*?)<\/h[1-4]>/i);
    const title = titleMatch ? stripHtml(titleMatch[1]) : content.slice(0, 80);

    const dateMatch = sectionHtml.match(
      /(?:<time[^>]*datetime=["']([^"']+)["']|(\d{4}-\d{2}-\d{2}))/i
    );
    const dateStr = dateMatch ? (dateMatch[1] || dateMatch[2]) : undefined;
    const publishedAt = dateStr ? new Date(dateStr) : undefined;

    entries.push({
      url: sourceUrl,
      title,
      content,
      publishedAt: publishedAt && !isNaN(publishedAt.getTime()) ? publishedAt : undefined,
    });
  }

  return entries;
}

function resolveUrl(href: string, base: string): string {
  try {
    return new URL(href, base).toString();
  } catch {
    return base;
  }
}

export class AnthropicChangelogMonitor extends BaseMonitor {
  readonly source: SourceType = 'anthropic_changelog';
  readonly name = 'Anthropic Changelog';

  async fetchPages(): Promise<FetchedPage[]> {
    const allPages: FetchedPage[] = [];

    for (const url of CHANGELOG_URLS) {
      try {
        const response = await fetch(url, {
          headers: { 'User-Agent': USER_AGENT },
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status} ${response.statusText}`);
        }

        const html = await response.text();

        let entries = extractChangelogEntries(html, url);

        if (entries.length === 0) {
          entries = extractSectionEntries(html, url);
        }

        if (entries.length === 0) {
          const content = stripHtml(html);
          if (content.length > 0) {
            entries.push({
              url,
              title: `Changelog: ${url}`,
              content,
            });
          }
        }

        allPages.push(...entries);
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        allPages.push({
          url,
          title: `Changelog fetch error: ${url}`,
          content: '',
          metadata: { error: message, skipped: true },
        });
      }

      await sleep(RATE_LIMIT_DELAY_MS);
    }

    return allPages.filter((p) => p.content.length > 0);
  }
}
