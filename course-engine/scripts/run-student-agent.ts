import { createDbClient } from '../packages/core/src/index.js';
import { StudentAgent, seedPersonas } from '../packages/student-agent/src/index.js';
import { parseArgs } from 'util';

const { values: flags } = parseArgs({
  options: {
    seed: { type: 'boolean', default: false },
    once: { type: 'boolean', default: false },
    'dry-run': { type: 'boolean', default: false },
    mode: { type: 'string', default: 'both' },
    interval: { type: 'string', default: '180' },
  },
  strict: false,
});

const dryRun = flags['dry-run'] ?? false;
const mode = (flags.mode ?? 'both') as 'scheduled' | 'reactive' | 'both';
const intervalMinutes = parseInt(flags.interval ?? '180', 10);

async function main() {
  const db = createDbClient();

  if (flags.seed) {
    await seedPersonas(db, dryRun);
    process.exit(0);
  }

  const agent = new StudentAgent(db, {
    intervalMs: intervalMinutes * 60 * 1000,
    dryRun,
    mode,
  });

  if (flags.once) {
    await agent.runOnce();
    process.exit(0);
  }

  await agent.start();

  process.on('SIGINT', async () => {
    await agent.stop();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    await agent.stop();
    process.exit(0);
  });

  // Keep alive
  await new Promise(() => {});
}

main().catch((err) => {
  console.error('Fatal:', err);
  process.exit(1);
});
