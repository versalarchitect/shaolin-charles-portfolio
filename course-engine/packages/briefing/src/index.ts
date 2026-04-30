import type { SupabaseClient } from '@supabase/supabase-js';
import {
  generateBriefing,
  formatBriefing,
  type BriefingOptions,
} from './generator.js';

export {
  generateBriefing,
  formatBriefing,
} from './generator.js';

export type {
  Briefing,
  BriefingSection,
  BriefingStats,
  BriefingOptions,
} from './generator.js';

export async function printBriefing(
  db: SupabaseClient,
  options?: BriefingOptions,
): Promise<void> {
  const format = options?.format ?? 'text';
  const briefing = await generateBriefing(db, options);
  const output = formatBriefing(briefing, format);
  console.log(output);
}
