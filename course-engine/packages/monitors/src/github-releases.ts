import { BaseMonitor, sleep } from './base-monitor.js';
import type { SourceType, FetchedPage } from './base-monitor.js';

const GITHUB_REPOS = [
  { owner: 'anthropics', repo: 'anthropic-sdk-python', label: 'Anthropic Python SDK' },
  { owner: 'anthropics', repo: 'anthropic-sdk-typescript', label: 'Anthropic TypeScript SDK' },
  { owner: 'anthropics', repo: 'claude-code', label: 'Claude Code CLI' },
  { owner: 'vercel', repo: 'ai', label: 'Vercel AI SDK' },
  { owner: 'langchain-ai', repo: 'langchainjs', label: 'LangChain.js' },
  { owner: 'openai', repo: 'openai-python', label: 'OpenAI Python SDK' },
  { owner: 'openai', repo: 'openai-node', label: 'OpenAI Node SDK' },
] as const;

const USER_AGENT = 'CourseEngine-Monitor/1.0 (+https://charlesjackson.dev)';
const RATE_LIMIT_DELAY_MS = 500;
const RELEASES_PER_REPO = 5;

interface GitHubRelease {
  tag_name: string;
  name: string | null;
  body: string | null;
  html_url: string;
  published_at: string | null;
  prerelease: boolean;
}

export class GitHubReleasesMonitor extends BaseMonitor {
  readonly source: SourceType = 'github_release';
  readonly name = 'GitHub Releases';

  async fetchPages(): Promise<FetchedPage[]> {
    const pages: FetchedPage[] = [];
    const headers: Record<string, string> = {
      'User-Agent': USER_AGENT,
      Accept: 'application/vnd.github+json',
    };

    const token = process.env.GITHUB_TOKEN;
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    for (const { owner, repo, label } of GITHUB_REPOS) {
      try {
        const url = `https://api.github.com/repos/${owner}/${repo}/releases?per_page=${RELEASES_PER_REPO}`;
        const response = await fetch(url, { headers });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status} ${response.statusText}`);
        }

        const releases: GitHubRelease[] = await response.json();

        for (const release of releases) {
          if (release.prerelease) continue;
          if (!release.body || release.body.trim().length === 0) continue;

          const title = `${label} ${release.tag_name}${release.name ? ` — ${release.name}` : ''}`;

          pages.push({
            url: release.html_url,
            title,
            content: release.body,
            publishedAt: release.published_at ? new Date(release.published_at) : undefined,
            metadata: {
              repo: `${owner}/${repo}`,
              tag: release.tag_name,
              prerelease: release.prerelease,
            },
          });
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        pages.push({
          url: `https://github.com/${owner}/${repo}/releases`,
          title: label,
          content: '',
          metadata: { error: message, skipped: true },
        });
      }

      await sleep(RATE_LIMIT_DELAY_MS);
    }

    return pages.filter((p) => p.content.length > 0);
  }
}
