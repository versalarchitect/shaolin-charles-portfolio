import { createDbClient } from '../packages/core/src/index.js';
import {
  runSimulation,
  getPersona,
  listPersonas,
  generateMarkdownReport,
} from '../packages/simulator/src/index.js';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

interface SimFlags {
  persona: string;
  limitModules?: number;
  limitLessons?: number;
  outputDir: string;
}

function parseFlags(): SimFlags {
  const args = process.argv.slice(2);
  const flags: SimFlags = {
    persona: 'beginner',
    outputDir: join(process.cwd(), 'reports'),
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--persona' && args[i + 1]) {
      flags.persona = args[++i];
    } else if (arg === '--limit-modules' && args[i + 1]) {
      flags.limitModules = parseInt(args[++i], 10);
    } else if (arg === '--limit-lessons' && args[i + 1]) {
      flags.limitLessons = parseInt(args[++i], 10);
    } else if (arg === '--output' && args[i + 1]) {
      flags.outputDir = args[++i];
    } else if (arg === '--help' || arg === '-h') {
      console.log(`
Student Simulator — AI-powered course feedback agent

Usage:
  bun run simulate [options]

Options:
  --persona <level>        Student persona: ${listPersonas().join(', ')} (default: beginner)
  --limit-modules <n>      Only evaluate first N modules
  --limit-lessons <n>      Only evaluate first N lessons per module
  --output <dir>           Output directory (default: course-engine/reports/)
  --help                   Show this help

Environment:
  Uses Ollama at localhost:11434 by default (qwen2.5:7b).
  Set ANTHROPIC_API_KEY to use Claude instead.
  Set LLM_BACKEND=hf-inference to force Ollama.

Examples:
  bun run simulate                          # Full run, beginner persona
  bun run simulate --persona advanced       # Advanced student perspective
  bun run simulate --persona intermediate --limit-modules 1  # Quick test
`);
      process.exit(0);
    }
  }

  return flags;
}

function log(stage: string, message: string): void {
  const timestamp = new Date().toISOString().slice(11, 19);
  console.log(`[${timestamp}] [${stage}] ${message}`);
}

async function main(): Promise<void> {
  const flags = parseFlags();

  log('sim', '=== Student Simulator ===');

  const persona = getPersona(flags.persona);
  log('sim', `Persona: ${persona.name} (${persona.level})`);

  const db = createDbClient();

  const report = await runSimulation(db, persona, log, {
    limitModules: flags.limitModules,
    limitLessons: flags.limitLessons,
  });

  mkdirSync(flags.outputDir, { recursive: true });

  const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const baseName = `student-sim-${persona.level}-${ts}`;

  const jsonPath = join(flags.outputDir, `${baseName}.json`);
  writeFileSync(jsonPath, JSON.stringify(report, null, 2));
  log('output', `JSON report: ${jsonPath}`);

  const mdPath = join(flags.outputDir, `${baseName}.md`);
  writeFileSync(mdPath, generateMarkdownReport(report));
  log('output', `Markdown report: ${mdPath}`);

  log('sim', '=== Simulation Complete ===');
  log('sim', `Rating: ${report.course_feedback.overall_rating}/5 | NPS: ${report.course_feedback.nps_score}/10`);
  log('sim', `Stats: ${report.stats.total_blocks} blocks, ${report.stats.total_words} words, ${report.stats.llm_calls} LLM calls in ${Math.round(report.stats.duration_ms / 1000)}s`);
}

main().then(() => process.exit(0)).catch((err) => {
  console.error('Simulation failed:', err);
  process.exit(1);
});
