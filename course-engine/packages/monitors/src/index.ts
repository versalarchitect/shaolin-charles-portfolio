import { AnthropicDocsMonitor } from './anthropic-docs.js';
import { AnthropicChangelogMonitor } from './anthropic-changelog.js';
import { GitHubReleasesMonitor } from './github-releases.js';
import { BaseMonitor } from './base-monitor.js';
import type { MonitorResult, SourceType } from './base-monitor.js';

export const monitors: BaseMonitor[] = [
  new AnthropicDocsMonitor(),
  new AnthropicChangelogMonitor(),
  new GitHubReleasesMonitor(),
];

export async function runAllMonitors(
  existingHashes: Set<string>
): Promise<Map<string, MonitorResult>> {
  const results = new Map<string, MonitorResult>();

  const promises = monitors.map(async (monitor) => {
    const result = await monitor.run(existingHashes);
    results.set(monitor.name, result);
  });

  await Promise.all(promises);
  return results;
}

export async function runMonitor(
  source: SourceType,
  existingHashes: Set<string>
): Promise<MonitorResult> {
  const monitor = monitors.find((m) => m.source === source);
  if (!monitor) throw new Error(`No monitor found for source: ${source}`);
  return monitor.run(existingHashes);
}

export { BaseMonitor } from './base-monitor.js';
export type { MonitorResult, SourceType, SourceEvent, FetchedPage } from './base-monitor.js';
export { AnthropicDocsMonitor } from './anthropic-docs.js';
export { AnthropicChangelogMonitor } from './anthropic-changelog.js';
export { GitHubReleasesMonitor } from './github-releases.js';
export { stripHtml, sleep } from './base-monitor.js';
