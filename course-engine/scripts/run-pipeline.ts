import {
  createDbClient,
  getOrCreatePipelineRun,
  updatePipelineRun,
  insertSourceEvent,
  insertKnowledgeFact,
  supersedeFact,
  findFactsByEntities,
  getContentBlocksByStatus,
  flagBlocksAtRisk,
  listSourceEvents,
  type PipelineRun,
} from '../packages/core/src/index.js';
import { runAllMonitors } from '../packages/monitors/src/index.js';
import { extractAndReconcile } from '../packages/extraction/src/index.js';

interface PipelineFlags {
  monitorOnly: boolean;
  extractOnly: boolean;
  dryRun: boolean;
}

function parseFlags(): PipelineFlags {
  const args = new Set(process.argv.slice(2));
  return {
    monitorOnly: args.has('--monitor-only'),
    extractOnly: args.has('--extract-only'),
    dryRun: args.has('--dry-run'),
  };
}

function log(stage: string, message: string): void {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [${stage}] ${message}`);
}

async function main(): Promise<void> {
  const flags = parseFlags();

  log('pipeline', '=== Course Engine Pipeline ===');
  log('pipeline', `Flags: monitor-only=${flags.monitorOnly} extract-only=${flags.extractOnly} dry-run=${flags.dryRun}`);

  const db = createDbClient();
  let run: PipelineRun | undefined;

  if (!flags.dryRun) {
    run = await getOrCreatePipelineRun(db);
    log('pipeline', `Pipeline run: ${run.id}`);
  }

  try {
    // --- Stage 1: Monitor ---
    log('monitor', 'Fetching existing content hashes for dedup...');
    const existingEvents = await listSourceEvents(db, { limit: 10000 });
    const existingHashes = new Set(existingEvents.map((e) => e.content_hash));
    log('monitor', `Found ${existingHashes.size} existing hashes`);

    log('monitor', 'Running source monitors...');
    const monitorResults = await runAllMonitors(existingHashes);

    const allNewEvents = [];
    for (const [name, result] of monitorResults) {
      log('monitor', `${name}: ${result.events.length} new events, ${result.errors.length} errors (${result.duration_ms}ms)`);
      for (const err of result.errors) {
        log('monitor', `  ERROR: ${err}`);
      }
      allNewEvents.push(...result.events);
    }

    log('monitor', `Total new events: ${allNewEvents.length}`);

    const storedEvents = [];
    if (!flags.dryRun) {
      for (const event of allNewEvents) {
        const stored = await insertSourceEvent(db, {
          source: event.source,
          url: event.url,
          title: event.title,
          raw_content: event.raw_content,
          summary: event.summary,
          published_at: event.published_at,
          metadata: event.metadata,
        });
        if (stored) storedEvents.push(stored);
      }
      log('monitor', `Stored ${storedEvents.length} events in database`);
    } else {
      log('monitor', 'Dry run — skipping database storage');
      for (const event of allNewEvents) {
        log('monitor', `  [DRY] ${event.source}: ${event.title} (${event.url})`);
      }
      storedEvents.push(...allNewEvents);
    }

    if (run) {
      await updatePipelineRun(db, run.id, { events_fetched: storedEvents.length });
    }

    if (flags.monitorOnly) {
      log('pipeline', 'Monitor-only mode — stopping after fetch');
      if (run) await updatePipelineRun(db, run.id, { status: 'completed' });
      return;
    }

    // --- Stage 2: Extract ---
    if (storedEvents.length === 0) {
      log('extract', 'No new events to extract from — skipping');
      if (run) await updatePipelineRun(db, run.id, { status: 'completed' });
      return;
    }

    log('extract', `Extracting facts from ${storedEvents.length} events...`);

    const allEntities = new Set<string>();
    for (const event of storedEvents) {
      const words = event.title.toLowerCase().split(/\s+/);
      for (const word of words) allEntities.add(word);
    }
    const existingFacts = await findFactsByEntities(db, Array.from(allEntities));
    log('extract', `Found ${existingFacts.length} existing facts with overlapping entities`);

    const { newFacts, supersessions, summaries } = await extractAndReconcile(
      storedEvents,
      existingFacts,
    );

    log('extract', `Extracted ${newFacts.length} new facts, ${supersessions.length} supersessions`);

    for (const [eventId, summary] of summaries) {
      log('extract', `  Summary for ${eventId}: ${summary.slice(0, 100)}...`);
    }

    if (!flags.dryRun) {
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
      log('extract', `Stored ${newFacts.length} facts in database`);

      for (const sup of supersessions) {
        await supersedeFact(db, sup.oldFactId, sup.newFactId);
        log('extract', `  Superseded: ${sup.oldFactId} -> ${sup.newFactId} (${sup.reason ?? 'no reason'})`);
      }
    } else {
      log('extract', 'Dry run — skipping database storage');
      for (const fact of newFacts) {
        log('extract', `  [DRY] [${fact.category}] ${fact.statement}`);
      }
    }

    if (run) {
      await updatePipelineRun(db, run.id, { facts_extracted: newFacts.length });
    }

    if (flags.extractOnly) {
      log('pipeline', 'Extract-only mode — stopping after extraction');
      if (run) await updatePipelineRun(db, run.id, { status: 'completed' });
      return;
    }

    // --- Stage 3: Flag at-risk blocks ---
    const supersededFactIds = supersessions.map((s) => s.oldFactId);
    let blocksFlag = 0;

    if (supersededFactIds.length > 0) {
      log('flag', `Checking ${supersededFactIds.length} superseded facts for stale content blocks...`);
      blocksFlag = await flagBlocksAtRisk(db, supersededFactIds);
      log('flag', `Flagged ${blocksFlag} content blocks as at_risk`);
    } else {
      log('flag', 'No superseded facts — nothing to flag');
    }

    if (run) {
      await updatePipelineRun(db, run.id, { blocks_flagged: blocksFlag });
    }

    // --- Stage 4: Regeneration (Phase 3 — not yet implemented) ---
    const atRiskBlocks = await getContentBlocksByStatus(db, 'at_risk');
    log('regen', `Found ${atRiskBlocks.length} at-risk content blocks`);

    if (atRiskBlocks.length > 0) {
      log('regen', 'Regeneration agent not yet implemented (Phase 3) — blocks remain at_risk');
      for (const block of atRiskBlocks) {
        log('regen', `  At risk: ${block.id} (${block.heading ?? 'untitled'})`);
      }
    }

    if (run) {
      await updatePipelineRun(db, run.id, {
        proposals_generated: 0,
        status: 'completed',
      });
    }

    log('pipeline', '=== Pipeline Complete ===');
    log('pipeline', `Events: ${storedEvents.length} | Facts: ${newFacts.length} | Supersessions: ${supersessions.length} | Flagged: ${blocksFlag}`);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    log('pipeline', `Pipeline failed: ${message}`);

    if (run) {
      await updatePipelineRun(db, run.id, { status: 'failed', error: message });
    }

    process.exit(1);
  }
}

main().then(() => process.exit(0));
