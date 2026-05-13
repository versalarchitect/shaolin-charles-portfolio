import type { LessonContent } from './types'

const content: LessonContent = {
  lessonId: '4-2',
  steps: [
    // === INTRODUCTION ===
    {
      type: 'info',
      title: 'CLAUDE.md: your project\'s instruction manual for AI',
      body: "Stop thinking of CLAUDE.md as a README. A README explains the project to humans who will explore, ask questions, and build context over time. CLAUDE.md is a coordination protocol — it tells every agent that enters the codebase exactly how to behave, what patterns to follow, what to avoid, and where to find things. It is the difference between \"here is our project\" and \"here are your orders.\" Every agent session starts by reading this file. If it is wrong, vague, or missing, every agent session starts confused.",
    },
    {
      type: 'info',
      title: 'The coordination problem it solves',
      body: "Without a CLAUDE.md, each agent makes independent decisions. Agent A uses camelCase for file names. Agent B uses kebab-case. Agent C creates a utils/ directory. Agent D puts the same code in helpers/. Agent E writes tests in __tests__/, Agent F collocates them. After 10 agent sessions, your codebase is an inconsistent mess — not because any single agent did something wrong, but because there was no shared protocol. CLAUDE.md is the single source of truth that every agent aligns to.",
    },
    {
      type: 'diagram',
      title: 'With vs without CLAUDE.md',
      body: 'CLAUDE.md acts as the coordination layer that keeps all agents producing consistent output.',
      diagram: {
        direction: 'TB',
        nodes: [
          { id: 'claude', label: 'CLAUDE.md', sublabel: 'Coordination protocol', shape: 'rounded', highlight: true },
          { id: 'a1', label: 'Agent A', shape: 'rect' },
          { id: 'a2', label: 'Agent B', shape: 'rect' },
          { id: 'a3', label: 'Agent C', shape: 'rect' },
          { id: 'consistent', label: 'Consistent Output', sublabel: 'Same patterns, same style', shape: 'pill', highlight: true },
          { id: 'no_claude', label: 'No CLAUDE.md', sublabel: 'No coordination', shape: 'rounded' },
          { id: 'a4', label: 'Agent D', shape: 'rect' },
          { id: 'a5', label: 'Agent E', shape: 'rect' },
          { id: 'chaos', label: 'Inconsistent Chaos', sublabel: 'Conflicting patterns', shape: 'pill' },
        ],
        edges: [
          { from: 'claude', to: 'a1' },
          { from: 'claude', to: 'a2' },
          { from: 'claude', to: 'a3' },
          { from: 'a1', to: 'consistent' },
          { from: 'a2', to: 'consistent' },
          { from: 'a3', to: 'consistent' },
          { from: 'no_claude', to: 'a4' },
          { from: 'no_claude', to: 'a5' },
          { from: 'a4', to: 'chaos' },
          { from: 'a5', to: 'chaos' },
        ],
      },
    },
    {
      type: 'checkpoint',
      xp: 2,
      message: 'Problem understood!',
    },

    // === WHAT TO INCLUDE ===
    {
      type: 'info',
      title: 'Section 1: Conventions',
      body: "Conventions are the patterns every agent MUST follow. Naming conventions (files, variables, functions, components). Directory structure rules (where new features go, where tests live). Import ordering. Error handling patterns. Response format standards. These are not suggestions — they are laws. Write them as imperatives: \"All handler files use [domain].handler.ts naming.\" Not \"We prefer...\" or \"Consider using...\" Agents interpret soft language as optional.",
    },
    {
      type: 'info',
      title: 'Section 2: Constraints',
      body: "Constraints are the boundaries that prevent agents from going off-script. Technology choices (which libraries are approved, which are banned). Performance budgets (no synchronous file reads, no N+1 queries). Security rules (never log PII, always validate input). File size limits (no file over 300 lines). These protect you from well-intentioned agents that would otherwise \"improve\" things by introducing new dependencies, clever optimizations, or architectures you did not authorize.",
    },
    {
      type: 'info',
      title: 'Section 3: Patterns (with examples)',
      body: "Show, do not just tell. For every pattern you mandate, include a short code example of the correct way AND the wrong way. Agents learn better from examples than from abstract rules. If you say \"use server actions for mutations,\" include a 5-line example of a correct server action. If you say \"no barrel exports,\" show what a barrel export looks like so the agent recognizes it. The examples section is what transforms CLAUDE.md from policy into executable knowledge.",
    },
    {
      type: 'info',
      title: 'Section 4: Forbidden anti-patterns',
      body: "Explicitly list things agents tend to do that you do NOT want. This is different from constraints — constraints say what IS allowed. Anti-patterns say what must NEVER happen even if it seems reasonable. Common ones: \"Never create a shared/utils.ts file — utilities belong in their feature module.\" \"Never add a dependency without being asked.\" \"Never refactor code that is not related to the current task.\" \"Never create index.ts barrel exports.\" These prevent the agent from being \"helpful\" in ways that create debt.",
    },
    {
      type: 'code-demo',
      title: 'A real CLAUDE.md conventions section',
      body: 'Notice the imperative language, concrete examples, and explicit anti-patterns. Nothing is vague.',
      language: 'markdown',
      filename: 'CLAUDE.md',
      code: "# Project: Invoice Platform\n\n## Conventions\n\n### File Naming\n- Feature files: `[domain].[role].ts` (e.g., `invoices.handler.ts`)\n- Test files: `[domain].test.ts` (collocated in same directory)\n- Types: `[domain].types.ts`\n- NEVER use generic names: `utils.ts`, `helpers.ts`, `common.ts`\n\n### Directory Structure\n- New features: `src/features/[domain-name]/`\n- Each feature exports via `index.ts`\n- Tests live next to the code they test\n- Infrastructure code: `src/infrastructure/`\n\n### Error Handling\n```typescript\n// CORRECT: Use AppError with domain context\nthrow new AppError('INVOICE_NOT_FOUND', { invoiceId })\n\n// WRONG: Generic errors with no context\nthrow new Error('Not found')\n```\n\n### Imports\n- Feature imports use the index: `import { createInvoice } from '@/features/invoices'`\n- NEVER import internal files: `import { x } from '@/features/invoices/invoices.service'`",
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'Content sections mastered!',
    },

    {
      type: 'compare',
      title: 'Soft language vs imperative commands',
      body: 'Agents interpret vague language as optional. Imperative commands get followed consistently.',
      left: {
        label: 'Soft Language (Ignored)',
        content: '## Conventions\n\n- Try to use camelCase for variables\n- Consider using Zod for validation\n- We prefer feature-based directories\n- It would be nice to collocate tests\n- You might want to use AppError\n- Please avoid adding dependencies\n- Think about using the logger',
        language: 'markdown',
        filename: 'vague-claude.md',
      },
      right: {
        label: 'Imperative Commands (Followed)',
        content: '## Conventions\n\n- ALL variables use camelCase. No exceptions.\n- Use Zod for ALL validation. No other library.\n- New features go in src/features/[domain]/\n- Tests MUST be collocated: [domain].test.ts\n- ALL errors use AppError with domain codes\n- NEVER add dependencies without approval\n- Use structured logger. No console.log.',
        language: 'markdown',
        filename: 'imperative-claude.md',
      },
      question: 'Which style will consistently produce the same behavior across different agent sessions?',
      correctSide: 'right',
      explanation: '"Try to", "consider", "prefer", and "might want to" all give agents permission to deviate. Imperatives like "ALL", "MUST", "NEVER", and "No exceptions" leave zero ambiguity. The right side produces identical agent behavior across sessions because there is no interpretation required.',
    },
    {
      type: 'code-fill',
      instruction: 'Complete this CLAUDE.md template. Fill in the blanks with specific, imperative conventions that an agent must follow.',
      language: 'markdown',
      template: '# Project: Task Manager API\n\n## Conventions\n\n### Naming\n- Feature files: `___`\n- Test files: collocated, named `___`\n- NEVER use generic names: utils.ts, helpers.ts\n\n## Constraints\n\n### Technology\n- Validation: ___ (no other library permitted)\n- Testing: ___ (not Jest)\n\n### Forbidden Anti-Patterns\n- Never create a ___ file\n- Never ___ without explicit approval\n- Never use `___` type — use unknown and narrow',
      blanks: [
        { id: 'naming', answer: '[domain].[role].ts', alternatives: ['[domain].[type].ts', '[feature].[role].ts'], hint: 'Pattern: domain name + dot + role', placeholder: 'e.g., payments.handler.ts' },
        { id: 'test-naming', answer: '[domain].test.ts', alternatives: ['[feature].test.ts', '[domain].spec.ts'], hint: 'Pattern: domain name + test extension', placeholder: 'e.g., payments.test.ts' },
        { id: 'validation', answer: 'Zod', alternatives: ['zod', 'Zod schemas'], hint: 'The schema validation library from the lesson', placeholder: 'library name' },
        { id: 'testing', answer: 'Vitest', alternatives: ['vitest'], hint: 'Modern Vite-native testing framework', placeholder: 'framework name' },
        { id: 'forbidden-file', answer: 'shared/utils.ts', alternatives: ['utils.ts', 'helpers.ts', 'shared/helpers.ts', 'common.ts'], hint: 'The catch-all dumping ground file', placeholder: 'filename' },
        { id: 'forbidden-action', answer: 'add a dependency', alternatives: ['add dependencies', 'install a dependency', 'add a new dependency', 'add new dependencies'], hint: 'Adding something to package.json', placeholder: 'action' },
        { id: 'forbidden-type', answer: 'any', alternatives: ['Any'], hint: 'The TypeScript escape hatch type', placeholder: 'type name' },
      ],
      filename: 'CLAUDE.md',
      explanation: 'A well-structured CLAUDE.md uses imperative language with specific patterns. Each blank has one clear answer that eliminates ambiguity for agents. The naming convention, technology constraints, and anti-patterns together form a coordination protocol that keeps all agents aligned.',
    },

    // === CONSTRAINTS SECTION ===
    {
      type: 'code-demo',
      title: 'A real CLAUDE.md constraints section',
      body: 'Constraints prevent unauthorized decisions. Each one blocks a specific failure mode.',
      language: 'markdown',
      filename: 'CLAUDE.md',
      code: "## Constraints\n\n### Technology\n- Runtime: Node.js 20+ with ESM\n- Database: PostgreSQL via Drizzle ORM (no raw SQL)\n- Validation: Zod schemas (not joi, not yup)\n- Testing: Vitest (not Jest)\n- DO NOT add new dependencies without explicit approval\n\n### Performance\n- No synchronous file operations\n- No N+1 database queries (use eager loading or joins)\n- No file larger than 300 lines (split at that threshold)\n- API responses under 200ms p95 for reads\n\n### Security\n- Never log PII (email, name, address, payment info)\n- All user input validated through Zod schema before processing\n- No dynamic SQL construction (use parameterized queries only)\n- No secrets in code — all from environment variables\n\n### Style\n- No comments that restate the code (\"increment counter\")\n- Comments explain WHY, never WHAT\n- No TODO comments — create an issue instead\n- No console.log in production code (use structured logger)",
    },
    {
      type: 'multiple-choice',
      question: 'Your CLAUDE.md says "Consider using Zod for validation." An agent uses Joi instead. Whose fault is it?',
      options: [
        'The agent ignored the instruction',
        'Yours — "consider" is advisory language. The agent interpreted it as optional, which is technically correct.',
        'The agent should have asked for clarification',
        'It depends on the agent model quality',
      ],
      correctIndex: 1,
      explanation: 'Soft language ("consider", "prefer", "try to") gives agents permission to deviate. Use imperative, unambiguous language: "Use Zod for all validation. No other validation library is permitted." If you mean it, say it as a command.',
    },

    // === LAYERING ===
    {
      type: 'info',
      title: 'Layering: root + directory-level CLAUDE.md',
      body: "A single CLAUDE.md at the project root works for small projects. For larger codebases, use layering. The root CLAUDE.md contains project-wide conventions (naming, tech stack, anti-patterns). Directory-level CLAUDE.md files contain module-specific rules. For example, src/features/payments/CLAUDE.md might say: \"All monetary values use cents (integers). Never use floating point for money. Payment handler must validate idempotency key.\" The agent reads both — root provides context, directory provides specifics.",
    },
    {
      type: 'code-demo',
      title: 'Layered CLAUDE.md example',
      body: 'Root-level rules apply everywhere. Directory-level rules apply to that module only.',
      language: 'markdown',
      filename: 'src/features/payments/CLAUDE.md',
      code: "# Payments Module\n\n## Module-Specific Rules\n- All monetary values in cents (integer). NEVER use floats for money.\n- Every mutation requires an idempotency key in the request header.\n- Payment state machine: draft → pending → completed | failed | refunded.\n- State transitions are the ONLY way to change payment status.\n- Never delete a payment record — use soft-delete (status: 'cancelled').\n\n## Testing Requirements\n- Every state transition must have a dedicated test case.\n- Test both successful transitions and invalid transition attempts.\n- Mock the payment gateway — never hit real APIs in tests.\n\n## Dependencies\n- This module depends on: features/users (for customer lookup)\n- This module is depended on by: features/orders, features/invoices\n- NEVER introduce a dependency on features/notifications from here\n  (payments emit events; notifications subscribes to them).",
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'Layering strategy locked in!',
    },

    // === TESTING YOUR CLAUDE.MD ===
    {
      type: 'info',
      title: 'Testing your CLAUDE.md: the fresh agent test',
      body: "Here is how you know if your CLAUDE.md works. Start a fresh agent session. Give it a real task — add a feature, fix a bug, write a test. Do NOT give any additional context beyond the task itself. Let the agent work. Then evaluate: Did it follow your naming conventions? Did it put files in the right place? Did it use the right patterns? Did it avoid the anti-patterns? If yes on all counts, your CLAUDE.md is effective. If no, the failure points tell you exactly what to add or clarify.",
    },
    {
      type: 'info',
      title: 'The feedback loop',
      body: "Every time an agent deviates from your expectations, ask: \"Is this documented in CLAUDE.md?\" If no — add it. You just discovered a gap. If yes but the agent still deviated — the wording is too soft, too buried, or contradicted elsewhere. Rewrite it more clearly or move it higher in the file. If yes and the wording is clear — it might be too far down. Agents allocate more attention to content near the top of CLAUDE.md. Critical rules go first.",
    },

    // === ANTI-PATTERNS ===
    {
      type: 'info',
      title: 'CLAUDE.md anti-pattern: too long',
      body: "A 2000-line CLAUDE.md defeats its purpose. Agents have finite context windows. If your protocol is enormous, the agent will attend to some sections and effectively ignore others — usually the sections at the bottom. Keep it under 500 lines for the root file. If you need more, layer it into directory-level files. The agent only reads the directory-level CLAUDE.md when it is working in that directory, so you get specificity without overloading the root context.",
    },
    {
      type: 'info',
      title: 'CLAUDE.md anti-pattern: too vague',
      body: "\"Write clean code.\" \"Follow best practices.\" \"Keep it simple.\" These are meaningless. Every agent already tries to write what it considers clean code. Your CLAUDE.md needs to define YOUR version of clean. What does \"simple\" mean in YOUR project? Maybe it means no abstractions with fewer than 3 consumers. Maybe it means no class inheritance. Be specific enough that two different agents would make the SAME decision when presented with the same ambiguity.",
    },
    {
      type: 'info',
      title: 'CLAUDE.md anti-pattern: contradictions',
      body: "The conventions section says \"use server actions for mutations.\" A later section says \"create API routes for all endpoints.\" Which one wins? The agent picks one — probably the one it encounters second. You will not notice until the inconsistency manifests as inconsistent code. Review your CLAUDE.md specifically for contradictions. A useful heuristic: if two rules could ever conflict, add an explicit priority statement (\"When in doubt, prefer X over Y\").",
    },
    {
      type: 'multiple-choice',
      question: 'Your CLAUDE.md is 1800 lines and agents consistently ignore the rules in the bottom half. What is the best fix?',
      options: [
        'Add "IMPORTANT:" prefix to the rules being ignored',
        'Move the ignored rules to the top of the file',
        'Restructure: keep critical rules in a short root CLAUDE.md, move module-specific details into directory-level CLAUDE.md files',
        'Repeat the important rules multiple times throughout the file',
      ],
      correctIndex: 2,
      explanation: 'The root file is too long. Agents attend more to content near the top, and extremely long files dilute attention. Layering into directory-level files means the root stays short and focused, while module-specific rules are delivered precisely when the agent is working in that context.',
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'Anti-patterns recognized!',
    },

    // === PRACTICAL EXERCISE ===
    {
      type: 'info',
      title: 'Building a CLAUDE.md from scratch',
      body: "Start with four questions. (1) What naming patterns must every file follow? (2) What technology decisions are final and non-negotiable? (3) What has an agent done wrong in the past that you want to prevent? (4) What patterns does a new contributor need to follow on day one? The answers to these four questions give you 80% of an effective CLAUDE.md. Write the answers as imperatives, add code examples for each, and you have a working coordination protocol.",
    },
    {
      type: 'order',
      instruction: 'Order these CLAUDE.md sections from most critical (top of file) to least critical (bottom):',
      items: [
        'Development commands (how to run, test, build)',
        'Forbidden anti-patterns (what to never do)',
        'Naming conventions (file and variable naming)',
        'Architecture overview (directory structure)',
        'Performance optimization guidelines',
      ],
      correctOrder: [3, 2, 1, 0, 4],
    },
    {
      type: 'code-demo',
      title: 'Minimal effective CLAUDE.md template',
      body: 'Start with this structure. It covers the essentials without bloat. Expand only when agents deviate.',
      language: 'markdown',
      filename: 'CLAUDE.md',
      code: "# [Project Name]\n\n## Architecture\n- Feature modules: `src/features/[domain]/`\n- Each module: handler, service, schema, test, index.ts\n- Infrastructure: `src/infrastructure/` (DB, cache, queue)\n\n## Conventions\n- Files: `[domain].[role].ts` (e.g., `payments.handler.ts`)\n- Tests: collocated, named `[domain].test.ts`\n- Imports: always from feature index, never internal files\n- Errors: use `AppError` class with domain error codes\n\n## Constraints\n- Stack: [your stack]\n- No new dependencies without approval\n- No file over 300 lines\n- No raw SQL — use ORM query builder\n- No console.log — use structured logger\n\n## Anti-Patterns (NEVER do these)\n- Never create utils.ts / helpers.ts / common.ts\n- Never add barrel exports (index.ts that re-exports everything)\n- Never modify code outside the current task scope\n- Never use `any` type — use `unknown` and narrow\n\n## Development\n- Dev: `npm run dev`\n- Test: `npm test`\n- Lint: `npm run lint`\n- Build: `npm run build`",
    },

    // === SYNTHESIS ===
    {
      type: 'multiple-choice',
      question: 'What is the primary difference between a README and a CLAUDE.md?',
      options: [
        'A README is for public repos, CLAUDE.md is for private repos',
        'A README explains the project to explorers; CLAUDE.md gives execution orders to agents that must produce consistent output',
        'A README is written in English, CLAUDE.md uses a special syntax',
        'They serve the same purpose — CLAUDE.md is just the newer format',
      ],
      correctIndex: 1,
      explanation: 'A README helps humans build understanding over time. A CLAUDE.md is an execution protocol — it tells agents exactly what to do and what not to do so that every session produces output consistent with your architecture decisions. It is prescriptive, not descriptive.',
    },
    {
      type: 'checklist',
      title: 'CLAUDE.md coordination protocol checklist:',
      items: [
        'I understand CLAUDE.md as a coordination protocol, not documentation',
        'I include conventions, constraints, patterns, and anti-patterns',
        'I write in imperative language — no soft suggestions',
        'I include code examples for every pattern I mandate',
        'I use layering for large projects (root + directory-level)',
        'I test my CLAUDE.md with fresh agent sessions',
        'I keep the root file under 500 lines',
        'I review for contradictions and vague language',
      ],
    },
    {
      type: 'checkpoint',
      xp: 16,
      message: 'CLAUDE.md mastery achieved! You can now write coordination protocols that keep agent fleets aligned.',
    },
  ],
}

export default content
