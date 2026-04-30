import {
  createDbClient,
  insertKnowledgeFact,
  supersedeFact,
  findFactsByEntities,
  listSourceEvents,
  getLLMStats,
} from '../packages/core/src/index.js';
import { extractAndReconcile } from '../packages/extraction/src/index.js';
import type { SourceEvent } from '../packages/core/src/index.js';

function log(stage: string, message: string): void {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [${stage}] ${message}`);
}

async function main(): Promise<void> {
  const dryRun = process.argv.includes('--dry-run');
  const limit = parseInt(process.argv.find(a => a.startsWith('--limit='))?.split('=')[1] ?? '0', 10);

  log('backfill', '=== Backfill Extraction ===');
  log('backfill', `Flags: dry-run=${dryRun} limit=${limit || 'all'}`);

  const db = createDbClient();

  const allEvents = await listSourceEvents(db, { limit: 10000 });
  log('backfill', `Total source events: ${allEvents.length}`);

  const { data: extractedEventIds } = await db
    .from('knowledge_facts')
    .select('source_event_id');

  const processedIds = new Set(
    (extractedEventIds ?? []).map((r: { source_event_id: string }) => r.source_event_id),
  );

  let unprocessed = allEvents.filter((e) => !processedIds.has(e.id));
  log('backfill', `Unprocessed events: ${unprocessed.length}`);

  if (limit > 0) {
    unprocessed = unprocessed.slice(0, limit);
    log('backfill', `Limiting to ${limit} events`);
  }

  if (unprocessed.length === 0) {
    log('backfill', 'Nothing to backfill — all events have been extracted');
    return;
  }

  const allEntities = new Set<string>();
  for (const event of unprocessed) {
    const words = event.title.toLowerCase().split(/\s+/);
    for (const word of words) allEntities.add(word);
  }
  const existingFacts = await findFactsByEntities(db, Array.from(allEntities));
  log('backfill', `Found ${existingFacts.length} existing facts with overlapping entities`);

  log('backfill', `Extracting facts from ${unprocessed.length} events...`);

  const { newFacts, supersessions, summaries } = await extractAndReconcile(
    unprocessed as SourceEvent[],
    existingFacts,
  );

  log('backfill', `Extracted ${newFacts.length} new facts, ${supersessions.length} supersessions`);

  for (const [eventId, summary] of summaries) {
    const event = unprocessed.find((e) => e.id === eventId);
    log('backfill', `  ${event?.title ?? eventId}: ${summary.slice(0, 120)}...`);
  }

  if (!dryRun) {
    for (const fact of newFacts) {
      await insertKnowledgeFact(db, {
        statement: fact.statement,
        category: fact.category,
        entities: fact.entities,
        confidence: fact.confidence,
        source_event_id: fact.source_event_id,
        superseded_by: fact.superseded_by ?? null,
        valid_from: fact.valid_from,
        valid_until: fact.valid_until ?? null,
      });
    }
    log('backfill', `Stored ${newFacts.length} facts`);

    for (const sup of supersessions) {
      await supersedeFact(db, sup.oldFactId, sup.newFactId);
      log('backfill', `  Superseded: ${sup.oldFactId} -> ${sup.newFactId} (${sup.reason ?? 'no reason'})`);
    }

    for (const [eventId, summary] of summaries) {
      await db.from('source_events').update({ summary }).eq('id', eventId);
    }
    log('backfill', `Updated ${summaries.size} event summaries`);
  } else {
    log('backfill', 'Dry run — skipping database writes');
    for (const fact of newFacts) {
      log('backfill', `  [DRY] [${fact.category}] ${fact.statement}`);
    }
  }

  const stats = getLLMStats();
  log('backfill', `LLM stats: ${stats.totalCalls} calls, $${stats.totalCostUsd.toFixed(4)} cost`);
  log('backfill', '=== Backfill Complete ===');
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Backfill failed:', err);
    process.exit(1);
  });
