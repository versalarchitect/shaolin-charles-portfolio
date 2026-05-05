import { describe, it, expect } from 'bun:test';
import { BaseMonitor, stripHtml, type FetchedPage, type MonitorResult } from '../base-monitor.js';

class TestMonitor extends BaseMonitor {
  readonly source = 'anthropic_docs' as const;
  readonly name = 'Test Monitor';
  private pages: FetchedPage[] = [];
  private shouldThrow = false;

  setPages(pages: FetchedPage[]) { this.pages = pages; }
  setThrowOnFetch(shouldThrow: boolean) { this.shouldThrow = shouldThrow; }

  async fetchPages(): Promise<FetchedPage[]> {
    if (this.shouldThrow) throw new Error('Fetch failed');
    return this.pages;
  }
}

describe('stripHtml', () => {
  it('removes script tags and content', () => {
    const html = '<p>Hello</p><script>alert("xss")</script><p>World</p>';
    expect(stripHtml(html)).toBe('Hello World');
  });

  it('removes style tags and content', () => {
    const html = '<style>.foo { color: red; }</style><p>Content</p>';
    expect(stripHtml(html)).toBe('Content');
  });

  it('removes HTML tags', () => {
    expect(stripHtml('<div><span>Text</span></div>')).toBe('Text');
  });

  it('decodes &amp; entity', () => {
    expect(stripHtml('A &amp; B')).toBe('A & B');
  });

  it('decodes &lt; and &gt; entities', () => {
    expect(stripHtml('&lt;code&gt;')).toBe('<code>');
  });

  it('decodes &quot; entity', () => {
    expect(stripHtml('&quot;hello&quot;')).toBe('"hello"');
  });

  it('decodes &#39; and &#x27; entities', () => {
    expect(stripHtml("it&#39;s")).toBe("it's");
    expect(stripHtml("it&#x27;s")).toBe("it's");
  });

  it('collapses whitespace', () => {
    expect(stripHtml('  hello   world  ')).toBe('hello world');
  });

  it('handles nested complex HTML', () => {
    const html = `
      <html>
        <head><style>body{}</style></head>
        <body>
          <script>var x = 1;</script>
          <div class="content">
            <h1>Title</h1>
            <p>Paragraph &amp; more</p>
          </div>
        </body>
      </html>
    `;
    expect(stripHtml(html)).toBe('Title Paragraph & more');
  });
});

describe('BaseMonitor.run', () => {
  it('skips pages with content < 100 chars', async () => {
    const monitor = new TestMonitor();
    monitor.setPages([
      { url: 'https://example.com/short', title: 'Short', content: 'Too short' },
      { url: 'https://example.com/long', title: 'Long', content: 'A'.repeat(150) },
    ]);

    const result = await monitor.run(new Set());
    expect(result.events).toHaveLength(1);
    expect(result.events[0].title).toBe('Long');
  });

  it('deduplicates by content hash against existing set', async () => {
    const monitor = new TestMonitor();
    const content = 'B'.repeat(200);
    monitor.setPages([
      { url: 'https://example.com/page', title: 'Page', content },
    ]);

    // Get the hash that would be generated
    const { createHash } = await import('crypto');
    const hash = createHash('sha256').update(content).digest('hex');

    const result = await monitor.run(new Set([hash]));
    expect(result.events).toHaveLength(0);
  });

  it('produces events for new content not in existing hashes', async () => {
    const monitor = new TestMonitor();
    monitor.setPages([
      { url: 'https://example.com/new', title: 'New Page', content: 'C'.repeat(200) },
    ]);

    const result = await monitor.run(new Set());
    expect(result.events).toHaveLength(1);
    expect(result.events[0].source).toBe('anthropic_docs');
    expect(result.events[0].title).toBe('New Page');
    expect(result.events[0].url).toBe('https://example.com/new');
    expect(result.events[0].content_hash).toBeTruthy();
    expect(result.events[0].id).toBeTruthy();
  });

  it('catches fetch errors and reports in errors array', async () => {
    const monitor = new TestMonitor();
    monitor.setThrowOnFetch(true);

    const result = await monitor.run(new Set());
    expect(result.events).toHaveLength(0);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0]).toContain('Fetch failed');
  });

  it('tracks duration_ms', async () => {
    const monitor = new TestMonitor();
    monitor.setPages([]);

    const result = await monitor.run(new Set());
    expect(result.duration_ms).toBeGreaterThanOrEqual(0);
  });

  it('sets fetched_at on events', async () => {
    const monitor = new TestMonitor();
    monitor.setPages([
      { url: 'https://example.com', title: 'Page', content: 'D'.repeat(200) },
    ]);

    const result = await monitor.run(new Set());
    expect(result.events[0].fetched_at).toBeInstanceOf(Date);
  });

  it('carries publishedAt and metadata through to events', async () => {
    const monitor = new TestMonitor();
    const publishedAt = new Date('2026-04-15');
    monitor.setPages([
      {
        url: 'https://example.com',
        title: 'Page',
        content: 'E'.repeat(200),
        publishedAt,
        metadata: { version: '1.0' },
      },
    ]);

    const result = await monitor.run(new Set());
    expect(result.events[0].published_at).toEqual(publishedAt);
    expect(result.events[0].metadata).toEqual({ version: '1.0' });
  });
});

describe('BaseMonitor.hashContent', () => {
  it('produces consistent SHA-256 for same input', async () => {
    const monitor = new TestMonitor();
    const content = 'Consistent content for hashing';
    monitor.setPages([
      { url: 'url1', title: 'T1', content: content + 'X'.repeat(100) },
      { url: 'url2', title: 'T2', content: content + 'X'.repeat(100) },
    ]);

    const result = await monitor.run(new Set());
    // Both pages have same content → same hash → dedup within run doesn't happen
    // (dedup only happens against existingHashes). Both should produce events with same hash.
    expect(result.events[0].content_hash).toBe(result.events[1].content_hash);
  });

  it('produces different hashes for different content', async () => {
    const monitor = new TestMonitor();
    monitor.setPages([
      { url: 'url1', title: 'T1', content: 'F'.repeat(200) },
      { url: 'url2', title: 'T2', content: 'G'.repeat(200) },
    ]);

    const result = await monitor.run(new Set());
    expect(result.events[0].content_hash).not.toBe(result.events[1].content_hash);
  });
});
