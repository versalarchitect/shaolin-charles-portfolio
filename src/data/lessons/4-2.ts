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
      type: 'interactive-diagram',
      title: 'With vs without CLAUDE.md',
      body: 'Walk through how CLAUDE.md acts as the coordination layer that keeps all agents producing consistent output.',
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
      stages: [
        {
          highlightNodes: ['claude', 'a1', 'a2', 'a3'],
          highlightEdges: [{ from: 'claude', to: 'a1' }, { from: 'claude', to: 'a2' }, { from: 'claude', to: 'a3' }],
          explanation: 'WITH CLAUDE.md: Every agent session starts by reading the same coordination protocol. Agents A, B, and C all receive identical instructions about naming, structure, patterns, and anti-patterns.',
        },
        {
          highlightNodes: ['a1', 'a2', 'a3', 'consistent'],
          highlightEdges: [{ from: 'a1', to: 'consistent' }, { from: 'a2', to: 'consistent' }, { from: 'a3', to: 'consistent' }],
          explanation: 'Because all agents follow the same protocol, their output is consistent — same file names, same directory structure, same patterns, same error handling. The codebase stays coherent across sessions.',
        },
        {
          highlightNodes: ['no_claude', 'a4', 'a5'],
          highlightEdges: [{ from: 'no_claude', to: 'a4' }, { from: 'no_claude', to: 'a5' }],
          explanation: 'WITHOUT CLAUDE.md: Agents D and E make independent decisions. Agent D uses camelCase files, Agent E uses kebab-case. Agent D puts tests in __tests__/, Agent E collocates them. No shared protocol means no alignment.',
        },
        {
          highlightNodes: ['a4', 'a5', 'chaos'],
          highlightEdges: [{ from: 'a4', to: 'chaos' }, { from: 'a5', to: 'chaos' }],
          explanation: 'After 10 agent sessions, the codebase is an inconsistent mess. Not because any single agent did something wrong — but because there was no shared protocol. CLAUDE.md is the single source of truth that every agent aligns to.',
        },
      ],
    },
    {
      type: 'checkpoint',
      xp: 2,
      message: 'Problem understood!',
    },

    // === WHAT TO INCLUDE ===
    {
      type: 'multiple-choice',
      question: 'Which CLAUDE.md section defines patterns every agent MUST follow — like naming conventions, directory structure rules, and import ordering?',
      options: [
        'Constraints — technology and performance limits',
        'Conventions — naming, structure, formatting laws written as imperatives',
        'Anti-patterns — things to never do',
        'Architecture decisions — why things are the way they are',
      ],
      correctIndex: 1,
      explanation: 'Conventions are the patterns every agent MUST follow. Naming conventions (files, variables, functions, components). Directory structure rules (where new features go, where tests live). Import ordering. Error handling patterns. Write them as imperatives: "All handler files use [domain].handler.ts naming." Not "We prefer..." or "Consider using..." Agents interpret soft language as optional.',
    },
    {
      type: 'multiple-choice',
      question: 'An agent introduces a new ORM library because it "seemed better." Your CLAUDE.md does not mention approved libraries. What CLAUDE.md section would have prevented this?',
      options: [
        'Conventions — it would mandate naming patterns',
        'Patterns — it would show example code',
        'Constraints — it would list approved technology choices and ban unauthorized additions',
        'Anti-patterns — it would list things to never do',
      ],
      correctIndex: 2,
      explanation: 'Constraints are the boundaries that prevent agents from going off-script. Technology choices (which libraries are approved, which are banned). Performance budgets (no synchronous file reads, no N+1 queries). Security rules (never log PII, always validate input). File size limits (no file over 300 lines). They protect you from well-intentioned agents that would otherwise "improve" things by introducing new dependencies you did not authorize.',
    },
    {
      type: 'compare',
      title: 'Patterns section: abstract rule vs executable example',
      body: 'Agents learn better from examples than from abstract rules. The Patterns section transforms CLAUDE.md from policy into executable knowledge.',
      left: {
        label: 'Abstract Rule Only',
        content: '## Error Handling\n\nUse AppError with domain context\nfor all errors in the codebase.\nDo not use generic Error objects.\nInclude relevant context data.',
        language: 'markdown',
        filename: 'abstract-rule.md',
      },
      right: {
        label: 'Rule + Code Example',
        content: '## Error Handling\n\n```typescript\n// CORRECT: AppError with domain context\nthrow new AppError(\'INVOICE_NOT_FOUND\', {\n  invoiceId\n})\n\n// WRONG: Generic error, no context\nthrow new Error(\'Not found\')\n```\n\nALL errors use AppError. No exceptions.',
        language: 'markdown',
        filename: 'example-rule.md',
      },
      question: 'Which approach will an agent follow more accurately?',
      correctSide: 'right',
      explanation: 'Show, do not just tell. For every pattern you mandate, include a short code example of the correct way AND the wrong way. If you say "use server actions for mutations," include a 5-line example of a correct server action. If you say "no barrel exports," show what a barrel export looks like so the agent recognizes it. The examples section is what transforms CLAUDE.md from policy into executable knowledge.',
    },
    {
      type: 'multiple-choice',
      question: 'What is the difference between Constraints and Anti-patterns in a CLAUDE.md?',
      options: [
        'There is no difference — they are the same thing',
        'Constraints say what IS allowed; Anti-patterns say what must NEVER happen even if it seems reasonable',
        'Anti-patterns are for code style; Constraints are for architecture',
        'Constraints are optional; Anti-patterns are mandatory',
      ],
      correctIndex: 1,
      explanation: 'Anti-patterns explicitly list things agents tend to do that you do NOT want. This is different from constraints — constraints say what IS allowed. Anti-patterns say what must NEVER happen even if it seems reasonable. Common ones: "Never create a shared/utils.ts file." "Never add a dependency without being asked." "Never refactor code that is not related to the current task." These prevent the agent from being "helpful" in ways that create debt.',
    },
    {
      type: 'code-fill',
      instruction: 'Complete this real CLAUDE.md conventions section. Fill in the naming patterns, rules, and anti-patterns with specific, imperative language.',
      language: 'markdown',
      template: '# Project: Invoice Platform\n\n## Conventions\n\n### File Naming\n- Feature files: `___`\n- Test files: `___` (collocated in same directory)\n- Types: `[domain].types.ts`\n- NEVER use generic names: `___`\n\n### Directory Structure\n- New features: `___`\n- Each feature exports via `index.ts`\n\n### Imports\n- Feature imports use the index: `import { createInvoice } from \'@/features/invoices\'`\n- NEVER import ___',
      blanks: [
        { id: 'feature-naming', answer: '[domain].[role].ts', alternatives: ['[domain].[type].ts'], hint: 'Pattern: domain name + dot + role + .ts', placeholder: 'e.g., invoices.handler.ts' },
        { id: 'test-naming', answer: '[domain].test.ts', alternatives: ['[feature].test.ts', '[domain].spec.ts'], hint: 'Collocated test files follow domain naming', placeholder: 'e.g., invoices.test.ts' },
        { id: 'generic-names', answer: 'utils.ts, helpers.ts, common.ts', alternatives: ['utils.ts', 'helpers.ts'], hint: 'The catch-all dumping ground files agents love to create', placeholder: 'banned file names' },
        { id: 'feature-dir', answer: 'src/features/[domain-name]/', alternatives: ['src/features/[domain]/'], hint: 'Feature-based directory under src/features/', placeholder: 'directory pattern' },
        { id: 'import-rule', answer: 'internal files', alternatives: ['internal modules', 'internal file paths', 'files directly'], hint: 'Only import from the index, never from...', placeholder: 'what to never import' },
      ],
      filename: 'CLAUDE.md',
      explanation: 'Notice the imperative language, concrete patterns, and explicit anti-patterns. Nothing is vague. Every blank has one clear answer that eliminates ambiguity for agents. The naming convention [domain].[role].ts, banned generic names, and import restrictions together form a coordination protocol.',
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
      type: 'code-fill',
      instruction: 'Complete this CLAUDE.md constraints section. Each constraint blocks a specific failure mode agents commonly trigger.',
      language: 'markdown',
      template: '## Constraints\n\n### Technology\n- Database: PostgreSQL via ___ (no raw SQL)\n- Validation: ___ (not joi, not yup)\n- Testing: ___ (not Jest)\n- DO NOT add new ___ without explicit approval\n\n### Performance\n- No ___ file operations\n- No file larger than ___ lines (split at that threshold)\n\n### Security\n- Never log ___ (email, name, address, payment info)\n- No secrets in code — all from ___',
      blanks: [
        { id: 'orm', answer: 'Drizzle ORM', alternatives: ['Drizzle', 'drizzle'], hint: 'A modern TypeScript ORM for PostgreSQL', placeholder: 'ORM name' },
        { id: 'validation', answer: 'Zod schemas', alternatives: ['Zod', 'zod'], hint: 'TypeScript-first schema validation library', placeholder: 'library' },
        { id: 'testing', answer: 'Vitest', alternatives: ['vitest'], hint: 'Vite-native testing framework', placeholder: 'framework' },
        { id: 'forbidden-add', answer: 'dependencies', alternatives: ['packages', 'libraries'], hint: 'Things that go in package.json', placeholder: 'what not to add' },
        { id: 'sync-ops', answer: 'synchronous', alternatives: ['sync', 'blocking'], hint: 'The opposite of async file operations', placeholder: 'type of operations' },
        { id: 'file-limit', answer: '300', alternatives: ['250', '200'], hint: 'A reasonable line limit for maintainability', placeholder: 'number' },
        { id: 'pii', answer: 'PII', alternatives: ['personal data', 'personally identifiable information'], hint: 'Personally identifiable information', placeholder: 'data type' },
        { id: 'secrets-source', answer: 'environment variables', alternatives: ['env variables', 'env vars'], hint: 'Where secrets should live outside the code', placeholder: 'where secrets come from' },
      ],
      filename: 'CLAUDE.md',
      explanation: 'Constraints prevent unauthorized decisions. Each one blocks a specific failure mode: the ORM prevents raw SQL injection risk, Zod prevents inconsistent validation, the file limit prevents monolithic files, and the PII rule prevents data leaks. Together they form guardrails that keep agents safe.',
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
      type: 'multiple-choice',
      question: 'Your CLAUDE.md is getting long and you need module-specific rules for the payments module (e.g., "all monetary values in cents"). Where should these rules live?',
      options: [
        'Add them to the root CLAUDE.md — everything in one file',
        'Create src/features/payments/CLAUDE.md with module-specific rules — the agent reads both root and directory-level files',
        'Add them as code comments in each payments file',
        'Create a separate RULES.md file in the project root',
      ],
      correctIndex: 1,
      explanation: 'A single CLAUDE.md at the project root works for small projects. For larger codebases, use layering. The root CLAUDE.md contains project-wide conventions (naming, tech stack, anti-patterns). Directory-level CLAUDE.md files contain module-specific rules like "All monetary values in cents. Never use floating point for money." The agent reads both — root provides context, directory provides specifics.',
    },
    {
      type: 'code-fill',
      instruction: 'Complete this directory-level CLAUDE.md for a payments module. Fill in the module-specific rules that keep agents safe when working with money.',
      language: 'markdown',
      template: '# Payments Module\n\n## Module-Specific Rules\n- All monetary values in ___ (integer). NEVER use ___ for money.\n- Every mutation requires an ___ in the request header.\n- Payment state machine: draft → pending → completed | failed | ___.\n- State transitions are the ONLY way to change payment status.\n- Never ___ a payment record — use soft-delete.\n\n## Dependencies\n- This module depends on: ___\n- NEVER introduce a dependency on features/notifications from here',
      blanks: [
        { id: 'unit', answer: 'cents', alternatives: ['pennies', 'smallest unit'], hint: 'The smallest denomination of currency', placeholder: 'currency unit' },
        { id: 'forbidden-type', answer: 'floats', alternatives: ['floating point', 'decimals', 'float'], hint: 'The data type that causes rounding errors with money', placeholder: 'data type' },
        { id: 'key', answer: 'idempotency key', alternatives: ['idempotency token', 'idempotent key'], hint: 'Prevents duplicate payment processing', placeholder: 'key type' },
        { id: 'terminal-state', answer: 'refunded', alternatives: ['cancelled', 'reversed'], hint: 'When money goes back to the customer', placeholder: 'state name' },
        { id: 'forbidden-action', answer: 'delete', alternatives: ['remove', 'hard delete'], hint: 'The destructive database operation you should avoid', placeholder: 'action' },
        { id: 'dependency', answer: 'features/users', alternatives: ['users', 'features/users (for customer lookup)'], hint: 'Payments need to look up customer information', placeholder: 'module path' },
      ],
      filename: 'src/features/payments/CLAUDE.md',
      explanation: 'Directory-level CLAUDE.md files contain module-specific rules that only apply when an agent is working in that module. The payments module needs special rules about money handling (cents, no floats), idempotency (prevent duplicate charges), state machines (valid transitions only), and soft-deletes (never lose payment records). Root-level rules apply everywhere; directory-level rules apply to that module only.',
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'Layering strategy locked in!',
    },

    // === TESTING YOUR CLAUDE.MD ===
    {
      type: 'multiple-choice',
      question: 'How do you test if your CLAUDE.md actually works?',
      options: [
        'Read it yourself and check for typos',
        'Start a fresh agent session with a real task (no extra context) and evaluate: did it follow naming, structure, patterns, and avoid anti-patterns?',
        'Ask another developer to review it',
        'Run a linter against it',
      ],
      correctIndex: 1,
      explanation: 'The fresh agent test: start a new session, give a real task with NO additional context. Let the agent work. Evaluate: Did it follow naming conventions? Right file placement? Right patterns? Avoided anti-patterns? If yes on all counts, your CLAUDE.md is effective. If no, the failure points tell you exactly what to add or clarify.',
    },
    {
      type: 'multiple-choice',
      question: 'An agent deviates from your expectations. Your CLAUDE.md documents the rule, but the agent still broke it. What is the most likely cause?',
      options: [
        'The agent model is too weak to follow rules',
        'The wording is too soft, the rule is buried too deep, or it is contradicted elsewhere in the file',
        'The rule is fundamentally unenforceable',
        'You need to add more rules to compensate',
      ],
      correctIndex: 1,
      explanation: 'Every time an agent deviates, ask: "Is this documented?" If no, add it (gap discovered). If yes but deviated, the wording is too soft, too buried, or contradicted elsewhere — rewrite it more clearly or move it higher. Agents allocate more attention to content near the top of CLAUDE.md. Critical rules go first.',
    },

    // === ANTI-PATTERNS ===
    {
      type: 'compare',
      title: 'Anti-pattern: too long vs too vague',
      body: 'Both extremes defeat the purpose of CLAUDE.md. One overloads context; the other provides no actionable guidance.',
      left: {
        label: 'Too Long (2000 lines)',
        content: '# CLAUDE.md (2000 lines)\n\nLine 1-500: Conventions (read carefully)\nLine 501-1000: Patterns (less attention)\nLine 1001-1500: Examples (skimmed)\nLine 1501-2000: Critical rules (IGNORED)\n\nResult:\n- Agent ignores bottom half\n- Critical rules never followed\n- Context window overloaded\n\nFix: Keep root under 500 lines.\nLayer into directory-level files.',
        language: 'text',
        filename: 'too-long.txt',
      },
      right: {
        label: 'Too Vague (meaningless)',
        content: '# CLAUDE.md (20 lines)\n\n- Write clean code\n- Follow best practices\n- Keep it simple\n- Use good patterns\n- Be consistent\n\nResult:\n- Every agent interprets differently\n- "Clean" means different things\n- "Simple" is subjective\n- Zero alignment between sessions\n\nFix: Define YOUR version of clean.\nSpecific enough that 2 agents decide\nthe SAME way on the same ambiguity.',
        language: 'text',
        filename: 'too-vague.txt',
      },
      question: 'Which anti-pattern causes agents to ignore critical rules?',
      correctSide: 'left',
      explanation: 'A 2000-line CLAUDE.md defeats its purpose. Agents have finite context windows and attend more to content near the top. Keep it under 500 lines for root; layer into directory-level files. Meanwhile, "write clean code" is meaningless — every agent already tries that. Your CLAUDE.md needs to define YOUR version of clean with specifics like "no abstractions with fewer than 3 consumers."',
    },
    {
      type: 'multiple-choice',
      question: 'Your CLAUDE.md says "use server actions for mutations" in the conventions section, but a later section says "create API routes for all endpoints." An agent encounters both rules. What happens?',
      options: [
        'The agent follows both rules simultaneously',
        'The agent picks one — probably the one it encounters second — and you get inconsistent code across sessions',
        'The agent asks for clarification',
        'The agent ignores both conflicting rules',
      ],
      correctIndex: 1,
      explanation: 'Contradictions are a silent CLAUDE.md anti-pattern. The agent picks one (probably the one it encounters second) and you will not notice until the inconsistency manifests as inconsistent code. Review specifically for contradictions. Useful heuristic: if two rules could ever conflict, add an explicit priority statement ("When in doubt, prefer X over Y").',
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

    // === NEW INTERACTIVE STEPS ===
    {
      type: 'match',
      instruction: 'Match each CLAUDE.md section to its purpose:',
      leftItems: ['Conventions', 'Constraints', 'Anti-patterns', 'Architecture decisions'],
      rightItems: ['How to name and structure', 'What technology limits apply', 'What to never do', 'Why things are the way they are'],
      correctPairs: { 0: 0, 1: 1, 2: 2, 3: 3 },
      explanation: 'Conventions tell agents HOW to name files, structure code, and format output consistently. Constraints define technology limits — approved libraries, performance budgets, security rules. Anti-patterns explicitly list what agents must NEVER do, even if it seems reasonable. Architecture decisions explain WHY the system is structured the way it is, giving agents context for future choices.',
    },
    {
      type: 'prompt-lab',
      instruction: 'Write CLAUDE.md conventions for a new TypeScript API project. The conventions must be specific and imperative enough that any agent would produce identical output.',
      scenario: 'You are starting a new TypeScript REST API. You need to write the Conventions section of CLAUDE.md. The project uses feature-based modules, Zod for validation, Vitest for testing, and Drizzle ORM for database access. You want strict naming, no generic files, and colocated tests.',
      starterPrompt: 'Add some rules to the project.',
      responses: [
        {
          triggerKeywords: ['MUST', 'NEVER', 'ALL', 'naming', 'convention', '[domain]'],
          response: '## Conventions\n\n### Naming\n- ALL feature files: [domain].[role].ts (e.g., payments.handler.ts)\n- ALL test files: [domain].test.ts, colocated in same directory\n- NEVER use generic names: utils.ts, helpers.ts, common.ts\n\n### Structure\n- New features: src/features/[domain-name]/\n- Each feature exports via index.ts\n- Tests MUST be colocated with implementation\n\n### Technology\n- Validation: Zod schemas ONLY\n- Testing: Vitest ONLY\n- Database: Drizzle ORM, no raw SQL',
          quality: 'excellent',
          feedback: 'Excellent. Your conventions use imperative language (MUST, NEVER, ALL, ONLY) that leaves zero ambiguity. You specified exact naming patterns, directory structure, and technology constraints. Any agent reading this will produce identical output.',
        },
        {
          triggerKeywords: ['use', 'follow', 'structure', 'name'],
          response: '## Conventions\n\n- Use feature-based directories\n- Name files descriptively\n- Use Zod and Vitest\n- Keep tests near code',
          quality: 'good',
          feedback: 'Right direction but too soft. "Use feature-based directories" does not specify the exact path pattern. "Name files descriptively" is subjective. Add imperative qualifiers (MUST, ALL, NEVER) and specify exact patterns like [domain].[role].ts.',
        },
        {
          triggerKeywords: ['rules', 'guidelines', 'best practices'],
          response: '## Guidelines\n\n- Try to keep things organized\n- Consider using TypeScript best practices\n- Follow common conventions',
          quality: 'poor',
          feedback: 'This will be ignored. "Try to", "consider", and "common conventions" are advisory language that agents interpret as optional. Rewrite with imperatives: specify exact naming patterns, mandatory tools, and explicit prohibitions.',
        },
      ],
      fallbackResponse: {
        response: '## Project Rules\n\n- Organize code well\n- Write good tests\n- Keep it clean',
        feedback: 'Too vague to be useful. Effective CLAUDE.md conventions include: (1) exact naming patterns like [domain].[role].ts, (2) imperative language — MUST, NEVER, ALL, (3) explicit technology mandates — "Zod ONLY, no other validation library", and (4) directory structure rules — "New features go in src/features/[domain]/".',
      },
    },
    {
      type: 'code-diff',
      title: 'Rewriting soft language into imperative commands',
      body: 'Watch how vague, advisory CLAUDE.md conventions get rewritten into imperative commands that agents follow consistently.',
      language: 'markdown',
      filename: 'CLAUDE.md',
      before: '## Conventions\n\n- Try to use camelCase for variable names\n- Consider organizing code by feature\n- We prefer Zod for validation but other options work\n- It would be nice to keep files small\n- You might want to colocate tests\n- Please avoid adding too many dependencies\n- Think about using structured logging',
      after: '## Conventions\n\n- ALL variables use camelCase. No exceptions.\n- New features go in src/features/[domain]/. No other location.\n- Use Zod for ALL validation. No other library permitted.\n- No file exceeds 300 lines. Split at that threshold.\n- Tests MUST be colocated: [domain].test.ts in same directory.\n- NEVER add a dependency without explicit approval.\n- Use structured logger for ALL output. No console.log.',
      question: 'What key transformation makes the AFTER version effective for agent coordination?',
      explanation: 'Every "try to", "consider", "prefer", and "might want to" has been replaced with absolute imperatives: "ALL", "MUST", "NEVER", "No exceptions", "No other". Soft language gives agents permission to deviate. Imperative language gives orders. The AFTER version will produce identical agent behavior across sessions because there is no interpretation required.',
    },

    // === PRACTICAL EXERCISE ===
    {
      type: 'multiple-choice',
      question: 'You are building a CLAUDE.md from scratch. Which four questions give you 80% of an effective coordination protocol?',
      options: [
        'What framework? What database? What hosting? What CI/CD?',
        'What naming patterns? What technology decisions are final? What has an agent done wrong before? What patterns must new contributors follow on day one?',
        'What is the project about? Who is the audience? What is the timeline? What is the budget?',
        'What language? What editor? What OS? What cloud provider?',
      ],
      correctIndex: 1,
      explanation: 'Start with four questions: (1) What naming patterns must every file follow? (2) What technology decisions are final and non-negotiable? (3) What has an agent done wrong in the past that you want to prevent? (4) What patterns does a new contributor need to follow on day one? Write the answers as imperatives, add code examples for each, and you have a working coordination protocol.',
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
      type: 'code-fill',
      instruction: 'Complete this minimal CLAUDE.md template. Fill in the key patterns, constraints, and anti-patterns that make it effective.',
      language: 'markdown',
      template: '# [Project Name]\n\n## Architecture\n- Feature modules: `src/features/___/`\n- Each module: handler, service, schema, test, index.ts\n\n## Conventions\n- Files: `___` (e.g., `payments.handler.ts`)\n- Tests: collocated, named `___`\n- Imports: always from feature ___, never internal files\n\n## Constraints\n- No file over ___ lines\n- No ___ — use ORM query builder\n\n## Anti-Patterns (NEVER do these)\n- Never create ___\n- Never use `___` type — use `unknown` and narrow',
      blanks: [
        { id: 'feature-path', answer: '[domain]', alternatives: ['[domain-name]', '[feature]'], hint: 'The domain name placeholder in the path', placeholder: 'placeholder' },
        { id: 'file-pattern', answer: '[domain].[role].ts', alternatives: ['[domain].[type].ts'], hint: 'Domain name + dot + role + .ts', placeholder: 'naming pattern' },
        { id: 'test-pattern', answer: '[domain].test.ts', alternatives: ['[feature].test.ts'], hint: 'Domain name + .test.ts', placeholder: 'test naming pattern' },
        { id: 'import-source', answer: 'index', alternatives: ['index.ts', 'the index'], hint: 'The public API file of each feature module', placeholder: 'import source' },
        { id: 'line-limit', answer: '300', alternatives: ['250', '200'], hint: 'A reasonable maximum file length', placeholder: 'number' },
        { id: 'no-sql', answer: 'raw SQL', alternatives: ['raw sql', 'SQL', 'direct SQL'], hint: 'Writing database queries directly instead of using the ORM', placeholder: 'what to avoid' },
        { id: 'no-files', answer: 'utils.ts / helpers.ts / common.ts', alternatives: ['utils.ts', 'helpers.ts', 'utils.ts, helpers.ts'], hint: 'The generic catch-all files agents create', placeholder: 'banned file names' },
        { id: 'no-type', answer: 'any', alternatives: ['Any'], hint: 'The TypeScript escape hatch type', placeholder: 'type name' },
      ],
      filename: 'CLAUDE.md',
      explanation: 'This minimal template covers the essentials without bloat: architecture (where things go), conventions (how to name them), constraints (what limits apply), and anti-patterns (what to never do). Expand only when agents deviate. Start with this structure and add specifics as failure points emerge.',
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
