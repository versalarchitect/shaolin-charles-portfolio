import { createDbClient } from '../packages/core/src/index.js';
import { printBriefing } from '../packages/briefing/src/index.js';

async function main(): Promise<void> {
  const db = createDbClient();
  const since = process.argv.includes('--24h')
    ? new Date(Date.now() - 24 * 60 * 60 * 1000)
    : undefined;

  await printBriefing(db, { since });
}

main().then(() => process.exit(0)).catch((err) => {
  console.error(err);
  process.exit(1);
});
