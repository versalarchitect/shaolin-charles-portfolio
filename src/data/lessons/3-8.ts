import type { LessonContent } from './types'

const content: LessonContent = {
  lessonId: '3-8',
  steps: [
    // === INTRODUCTION ===
    {
      type: 'info',
      title: 'Automated quality checks for AI-generated code',
      body: "Agents produce code fast — a fleet of 5 can generate thousands of lines in minutes. Your manual review can't keep pace. The solution: automated verification pipelines that validate every agent branch before it touches main. Type-checking, linting, tests, integration checks — all automated, all mandatory.",
    },
    {
      type: 'info',
      title: 'The rule: no unverified merge',
      body: "This is the non-negotiable principle: no agent output merges into main without passing the pipeline. It doesn't matter if the agent says it works. It doesn't matter if it looks correct. If the pipeline fails, the code doesn't merge. This single rule prevents the most common multi-agent failure: shipping broken integrations.",
    },

    // === DIAGRAM 1: The Pipeline (Interactive) ===
    {
      type: 'interactive-diagram',
      title: 'Verification Pipeline Stages',
      body: "Each stage catches a different class of error. They run in order of speed — fastest checks first, slowest last. If an early stage fails, later stages don't run. This gives fast feedback: you know within seconds if there's a type error, not minutes.",
      diagram: {
        direction: 'LR',
        nodes: [
          { id: 'push', label: 'Agent Push', sublabel: 'Branch ready', shape: 'rounded' },
          { id: 'type', label: 'Type Check', sublabel: 'tsc --noEmit', shape: 'rect' },
          { id: 'lint', label: 'Lint', sublabel: 'eslint', shape: 'rect' },
          { id: 'unit', label: 'Unit Tests', sublabel: 'vitest', shape: 'rect' },
          { id: 'int', label: 'Integration', sublabel: 'e2e checks', shape: 'rect' },
          { id: 'pass', label: 'Pass', sublabel: 'Ready to merge', shape: 'pill', highlight: true },
        ],
        edges: [
          { from: 'push', to: 'type' },
          { from: 'type', to: 'lint', label: 'pass' },
          { from: 'lint', to: 'unit', label: 'pass' },
          { from: 'unit', to: 'int', label: 'pass' },
          { from: 'int', to: 'pass', label: 'pass' },
        ],
      },
      stages: [
        {
          highlightNodes: ['push', 'type'],
          highlightEdges: [{ from: 'push', to: 'type' }],
          explanation: 'The agent pushes its branch. The pipeline starts with the fastest check: TypeScript type checking (2-5 seconds). This catches contract mismatches between agent outputs immediately.',
        },
        {
          highlightNodes: ['type', 'lint'],
          highlightEdges: [{ from: 'type', to: 'lint' }],
          explanation: 'If types pass, linting runs next. This enforces CLAUDE.md conventions: no `any`, no default exports, no barrel files. Catching convention drift before it compounds.',
        },
        {
          highlightNodes: ['lint', 'unit'],
          highlightEdges: [{ from: 'lint', to: 'unit' }],
          explanation: 'Clean lint means clean code structure. Now unit tests verify the agent\'s implementation actually works — correct behavior, error handling, edge cases.',
        },
        {
          highlightNodes: ['unit', 'int'],
          highlightEdges: [{ from: 'unit', to: 'int' }],
          explanation: 'Unit tests pass individually. Integration tests verify that this agent\'s output works with the rest of the system — imports resolve, APIs connect, the build succeeds.',
        },
        {
          highlightNodes: ['int', 'pass'],
          highlightEdges: [{ from: 'int', to: 'pass' }],
          explanation: 'All four gates passed. The branch is verified and ready to merge. No human review needed for mechanical correctness — the pipeline guarantees it.',
        },
      ],
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'You see the pipeline: typecheck, lint, test, integration — in that order.',
    },

    // === CODE-FILL: tsconfig strict mode ===
    {
      type: 'code-fill',
      instruction: 'Complete the strict TypeScript configuration that catches contract mismatches between agent outputs. Fill in the key compiler options.',
      language: 'json',
      filename: 'tsconfig.json',
      template: `{
  "compilerOptions": {
    "___BLANK_1___": true,
    "noEmit": true,
    "___BLANK_2___": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "___BLANK_3___": true,
    "___BLANK_4___": true
  },
  "include": ["src/**/*.ts", "src/**/*.tsx"],
  "exclude": ["node_modules", "dist"]
}`,
      blanks: [
        {
          id: 'BLANK_1',
          answer: 'strict',
          alternatives: ['"strict"'],
          hint: 'The master switch that enables all strict type-checking options',
          placeholder: 'strict mode flag',
        },
        {
          id: 'BLANK_2',
          answer: 'noUncheckedIndexedAccess',
          alternatives: ['"noUncheckedIndexedAccess"'],
          hint: 'Adds undefined to any un-checked indexed access (obj[key] might be undefined)',
          placeholder: 'indexed access safety',
        },
        {
          id: 'BLANK_3',
          answer: 'exactOptionalPropertyTypes',
          alternatives: ['"exactOptionalPropertyTypes"'],
          hint: 'Distinguishes between setting a property to undefined vs not setting it at all',
          placeholder: 'optional property strictness',
        },
        {
          id: 'BLANK_4',
          answer: 'forceConsistentCasingInFileNames',
          alternatives: ['"forceConsistentCasingInFileNames"'],
          hint: 'Prevents import path casing mismatches across OS (macOS vs Linux CI)',
          placeholder: 'file casing enforcement',
        },
      ],
      explanation: 'These options form the strictest TypeScript config for multi-agent development. `strict` catches type errors, `noUncheckedIndexedAccess` catches unsafe lookups, `exactOptionalPropertyTypes` catches contract ambiguity, and `forceConsistentCasingInFileNames` prevents CI failures on case-sensitive Linux when developing on macOS.',
    },

    // === PIPELINE COMPONENTS ===
    {
      type: 'compare',
      title: 'Type checking vs linting: different classes of errors',
      body: 'Both are automated gates, but they catch fundamentally different problems.',
      question: 'Which gate catches contract mismatches between agents (e.g., Agent A returns `{ data: User }` but Agent B expects `{ user: User }`)?',
      correctSide: 'left',
      left: {
        label: 'Type Checking (tsc)',
        content: '// What it catches:\n// - Import/export shape mismatches\n// - Wrong argument types\n// - Missing required fields\n// - Undefined access on nullable values\n\n// Agent A exports:\nexport function getUser(): { data: User } { ... }\n\n// Agent B imports:\nconst { user } = getUser()\n//       ^^^^ tsc ERROR: Property "user" does not exist\n// Caught in 2 seconds. Prevents 40% of integration failures.',
        language: 'typescript',
      },
      right: {
        label: 'Linting (eslint)',
        content: '// What it catches:\n// - Convention violations (any, default exports)\n// - Forbidden patterns (barrel files)\n// - Code style drift from CLAUDE.md\n\n// Agent writes:\nexport default function getUser() { ... }\n//     ^^^^^^^ eslint ERROR: Use named exports only\n\nconst data: any = fetchData()\n//          ^^^ eslint ERROR: no-explicit-any\n\nimport { getUser } from "./users/index"\n//                       ^^^^^^^^^^^^^^ eslint ERROR: no barrel imports',
        language: 'typescript',
      },
      explanation: 'Type checking catches structural contract violations between agents — the #1 integration failure. Linting catches convention drift from CLAUDE.md rules. Both are necessary: types ensure correctness, lint ensures consistency.',
    },
    {
      type: 'code-fill',
      instruction: 'Complete the ESLint configuration that encodes CLAUDE.md forbidden patterns as automated rules. Fill in the rule names and values.',
      language: 'javascript',
      filename: 'eslint.config.js',
      template: `import tseslint from 'typescript-eslint'

export default tseslint.config(
  ...tseslint.configs.strict,
  {
    rules: {
      // CLAUDE.md: "no any type"
      '___BLANK_1___': 'error',

      // CLAUDE.md: "no default exports"
      'no-restricted-syntax': ['error', {
        selector: '___BLANK_2___',
        message: 'Use named exports only (CLAUDE.md rule)',
      }],

      // CLAUDE.md: "no console.log in production"
      'no-console': ['error', { allow: ___BLANK_3___ }],
    },
  }
)`,
      blanks: [
        {
          id: 'BLANK_1',
          answer: '@typescript-eslint/no-explicit-any',
          alternatives: ['"@typescript-eslint/no-explicit-any"'],
          hint: 'The TypeScript ESLint rule that forbids the `any` type',
          placeholder: 'typescript-eslint rule for any',
        },
        {
          id: 'BLANK_2',
          answer: 'ExportDefaultDeclaration',
          alternatives: ['"ExportDefaultDeclaration"'],
          hint: 'The AST node selector that matches `export default ...` statements',
          placeholder: 'AST selector for default exports',
        },
        {
          id: 'BLANK_3',
          answer: "['warn', 'error']",
          alternatives: ["['warn', 'error']", '["warn", "error"]'],
          hint: 'Which console methods are allowed? Only warning and error reporting.',
          placeholder: 'allowed console methods',
        },
      ],
      explanation: 'Each CLAUDE.md forbidden pattern becomes a machine-enforceable ESLint rule. `no-explicit-any` prevents type escape hatches, `ExportDefaultDeclaration` enforces named exports, and allowing only `console.warn` and `console.error` prevents debug logging in production.',
    },
    {
      type: 'multiple-choice',
      question: 'Why run the linter AFTER type checking, not before?',
      options: [
        'Linting is slower than type checking',
        'Type errors can cause false lint warnings; fix types first',
        'Convention to always typecheck first',
        'The linter depends on type information from tsc',
      ],
      correctIndex: 1,
      explanation: "Type errors can cascade into lint noise — unused variables that appear 'unused' only because their consumer has a type error, for example. Running tsc first means the lint results are clean and actionable, not polluted by type-level failures.",
    },
    {
      type: 'checkpoint',
      xp: 5,
      message: 'You can configure type checking and linting as pipeline gates.',
    },

    // === TESTING IN AGENT SPECS ===
    {
      type: 'multiple-choice',
      question: 'When should tests be created for agent-built code?',
      options: [
        'After the agent finishes — add tests in a separate PR',
        'As part of the agent task spec — tests are required deliverables alongside code',
        'Only for critical paths — skip tests for simple CRUD',
        'Let the CI pipeline auto-generate tests from the code',
      ],
      correctIndex: 1,
      explanation: "Tests must be part of the agent's task spec, not an afterthought. 'Build the auth system AND write tests for it.' The agent produces both code and verification in one pass. The pipeline runs those tests to confirm the output works. If tests are optional, agents skip them.",
    },
    {
      type: 'code-fill',
      instruction: 'Complete the task spec that requires tests as non-optional deliverables. Fill in the test file paths and the Definition of Done command.',
      language: 'markdown',
      filename: 'TASK-AUTH.md',
      template: `# Task: Authentication System

## Required Files (code)
- src/auth/login.ts
- src/auth/signup.ts
- src/auth/middleware.ts

## Required Files (tests) -- NOT OPTIONAL
- src/auth/__tests__/___BLANK_1___
- src/auth/__tests__/___BLANK_2___
- src/auth/__tests__/middleware.test.ts

## Definition of Done
- [ ] All source files created
- [ ] All test files created
- [ ] \`___BLANK_3___\` passes with 0 failures`,
      blanks: [
        {
          id: 'BLANK_1',
          answer: 'login.test.ts',
          alternatives: ['login.test.ts', 'login.spec.ts'],
          hint: 'The test file for the login module — matches the source file name',
          placeholder: 'login test filename',
        },
        {
          id: 'BLANK_2',
          answer: 'signup.test.ts',
          alternatives: ['signup.test.ts', 'signup.spec.ts'],
          hint: 'The test file for the signup module — matches the source file name',
          placeholder: 'signup test filename',
        },
        {
          id: 'BLANK_3',
          answer: 'bun test src/auth/',
          alternatives: ['bun test src/auth/', 'bun test src/auth', 'vitest src/auth/'],
          hint: 'Run the test runner scoped to the auth directory only',
          placeholder: 'test command scoped to auth',
        },
      ],
      explanation: 'Test files mirror source files: login.ts -> login.test.ts, signup.ts -> signup.test.ts. The Definition of Done includes `bun test src/auth/` passing with 0 failures — the agent cannot claim completion without passing tests.',
    },
    {
      type: 'code-fill',
      instruction: 'Complete the Vitest configuration with coverage thresholds that agents must hit. Fill in the provider and threshold values.',
      language: 'typescript',
      filename: 'vitest.config.ts',
      template: `import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    passWithNoTests: false,
    coverage: {
      provider: '___BLANK_1___',
      thresholds: {
        statements: ___BLANK_2___,
        branches: 75,
        functions: 80,
        lines: ___BLANK_3___,
      },
    },
    isolate: true,
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})`,
      blanks: [
        {
          id: 'BLANK_1',
          answer: 'v8',
          alternatives: ['v8', "'v8'", '"v8"'],
          hint: 'The fast, built-in coverage provider for Node.js',
          placeholder: 'coverage provider',
        },
        {
          id: 'BLANK_2',
          answer: '80',
          alternatives: ['80'],
          hint: 'Standard threshold — 80% statement coverage is the common minimum',
          placeholder: 'statement threshold',
        },
        {
          id: 'BLANK_3',
          answer: '80',
          alternatives: ['80'],
          hint: 'Line coverage threshold — matches the statement threshold',
          placeholder: 'line threshold',
        },
      ],
      explanation: 'The v8 coverage provider is fast and built into Node.js. 80% thresholds for statements, functions, and lines (75% for branches) ensure agents write meaningful tests. With `isolate: true`, each test runs in its own environment — no cross-contamination between agent outputs.',
    },
    {
      type: 'terminal',
      instruction: 'Run tests only for the auth agent\'s output:',
      expectedCommand: 'bun test src/auth/',
      hint: 'Run bun test with the auth directory path to scope test execution',
    },

    // === CI CONFIGURATION ===
    {
      type: 'code-fill',
      instruction: 'Complete the GitHub Actions workflow that automatically verifies every agent branch. Fill in the trigger pattern and pipeline stages.',
      language: 'yaml',
      filename: '.github/workflows/verify-agent.yml',
      template: `name: Verify Agent Output

on:
  push:
    branches: ['___BLANK_1___']

jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: oven-sh/setup-bun@v2
        with:
          bun-version: latest

      - name: Install dependencies
        run: bun install --frozen-lockfile

      - name: Stage 1 -- Type Check
        run: ___BLANK_2___

      - name: Stage 2 -- Lint
        run: bun run lint

      - name: Stage 3 -- Unit Tests
        run: ___BLANK_3___

      - name: Stage 4 -- Build (integration check)
        run: bun run build`,
      blanks: [
        {
          id: 'BLANK_1',
          answer: 'feat/**',
          alternatives: ['feat/**', '"feat/**"'],
          hint: 'Agent branches use the feat/ prefix with deep matching',
          placeholder: 'branch glob pattern',
        },
        {
          id: 'BLANK_2',
          answer: 'bunx tsc --noEmit',
          alternatives: ['bunx tsc --noEmit', 'npx tsc --noEmit'],
          hint: 'Run the TypeScript compiler in check-only mode (no output files)',
          placeholder: 'typecheck command',
        },
        {
          id: 'BLANK_3',
          answer: 'bun test --coverage',
          alternatives: ['bun test --coverage', 'bunx vitest --coverage'],
          hint: 'Run tests with coverage reporting enabled',
          placeholder: 'test command with coverage',
        },
      ],
      explanation: 'The workflow triggers on feat/** branches (your fleet branches), runs all four stages in order, and blocks merge on any failure. The pipeline gives fast feedback: type errors in 2-5 seconds, lint in 5-10 seconds, tests in 30-60 seconds, build in 1-2 minutes.',
    },
    {
      type: 'checkpoint',
      xp: 5,
      message: 'You can configure CI to automatically verify every agent branch.',
    },

    // === BRANCH PROTECTION ===
    {
      type: 'multiple-choice',
      question: 'CI runs the pipeline, but what mechanically prevents merging a failed branch?',
      options: [
        'Team agreement not to merge failing branches',
        'Branch protection rules that require the pipeline to pass before merge',
        'Code review approval from another developer',
        'Automated rollback after merge if tests fail',
      ],
      correctIndex: 1,
      explanation: "Branch protection rules make it physically impossible to merge agent output that hasn't passed the pipeline. Configure GitHub to require the 'Verify Agent Output' workflow to pass before any PR can merge to main. This makes the rule mechanical, not just social.",
    },
    {
      type: 'code-fill',
      instruction: 'Complete the GitHub CLI command to configure branch protection. Fill in the API settings that enforce pipeline pass before merge.',
      language: 'bash',
      filename: 'terminal',
      template: `# Configure branch protection via GitHub CLI
gh api repos/{owner}/{repo}/branches/main/protection -X PUT \\
  --input - << 'EOF'
{
  "required_status_checks": {
    "strict": ___BLANK_1___,
    "contexts": ["___BLANK_2___"]
  },
  "___BLANK_3___": true,
  "required_pull_request_reviews": null,
  "restrictions": null
}
EOF`,
      blanks: [
        {
          id: 'BLANK_1',
          answer: 'true',
          alternatives: ['true'],
          hint: 'Should the branch be up to date with main before merging?',
          placeholder: 'require up-to-date branch',
        },
        {
          id: 'BLANK_2',
          answer: 'verify',
          alternatives: ['verify', '"verify"'],
          hint: 'The name of the CI job that must pass (from the workflow file)',
          placeholder: 'required status check name',
        },
        {
          id: 'BLANK_3',
          answer: 'enforce_admins',
          alternatives: ['enforce_admins', '"enforce_admins"'],
          hint: 'Should admins also be subject to these rules? (no exceptions)',
          placeholder: 'admin enforcement flag',
        },
      ],
      explanation: 'Setting `strict: true` requires branches to be up-to-date before merging. The `contexts` array lists which CI jobs must pass — "verify" matches the job name in the workflow. `enforce_admins: true` means no one can override the rules, not even repository owners.',
    },
    {
      type: 'multiple-choice',
      question: 'An agent\'s branch fails the pipeline on the lint stage. The type check and tests pass. What do you do?',
      options: [
        'Override branch protection and merge — tests pass, lint is just style',
        'Fix the lint issues on the branch and re-push to trigger the pipeline again',
        'Disable the lint stage — it\'s blocking real work',
        'Tell the agent to fix its own lint errors',
      ],
      correctIndex: 1,
      explanation: "Fix the lint issues and re-push. Never override the pipeline — that creates a precedent that erodes trust in the system. Lint rules exist because they encode CLAUDE.md constraints. If the rule is wrong, fix the rule. If the code violates it, fix the code.",
    },

    // === DIAGRAM 2: Full Flow ===
    {
      type: 'interactive-diagram',
      title: 'End-to-End: Fleet + Pipeline + Merge',
      body: "The complete flow from agent dispatch to production merge. Every agent branch goes through the pipeline. Only passing branches get merged.",
      diagram: {
        direction: 'TB',
        nodes: [
          { id: 'fleet', label: 'Agent Fleet', sublabel: '5 agents', shape: 'rounded', highlight: true },
          { id: 'b1', label: 'Branch 1', shape: 'rect' },
          { id: 'b2', label: 'Branch 2', shape: 'rect' },
          { id: 'b3', label: 'Branch 3', shape: 'rect' },
          { id: 'pipe', label: 'Pipeline', sublabel: 'Auto-verify', shape: 'rect', highlight: true },
          { id: 'gate', label: 'Pass?', shape: 'diamond' },
          { id: 'merge', label: 'Merge to Main', shape: 'pill', highlight: true },
          { id: 'fix', label: 'Fix + Re-push', shape: 'rect' },
        ],
        edges: [
          { from: 'fleet', to: 'b1' },
          { from: 'fleet', to: 'b2' },
          { from: 'fleet', to: 'b3' },
          { from: 'b1', to: 'pipe' },
          { from: 'b2', to: 'pipe' },
          { from: 'b3', to: 'pipe' },
          { from: 'pipe', to: 'gate' },
          { from: 'gate', to: 'merge', label: 'pass' },
          { from: 'gate', to: 'fix', label: 'fail' },
          { from: 'fix', to: 'pipe', dashed: true },
        ],
      },
      stages: [
        {
          highlightNodes: ['fleet', 'b1', 'b2', 'b3'],
          highlightEdges: [{ from: 'fleet', to: 'b1' }, { from: 'fleet', to: 'b2' }, { from: 'fleet', to: 'b3' }],
          explanation: 'The fleet dispatches agents to separate branches. Each agent works independently in its own worktree, producing code in parallel.',
        },
        {
          highlightNodes: ['b1', 'b2', 'b3', 'pipe'],
          highlightEdges: [{ from: 'b1', to: 'pipe' }, { from: 'b2', to: 'pipe' }, { from: 'b3', to: 'pipe' }],
          explanation: 'When an agent pushes, the pipeline triggers automatically. All four stages run: type check, lint, test, build. Each branch is verified independently.',
        },
        {
          highlightNodes: ['pipe', 'gate', 'merge'],
          highlightEdges: [{ from: 'pipe', to: 'gate' }, { from: 'gate', to: 'merge' }],
          explanation: 'Branches that pass all four pipeline stages are approved for merge. Branch protection ensures only verified code reaches main.',
        },
        {
          highlightNodes: ['gate', 'fix', 'pipe'],
          highlightEdges: [{ from: 'gate', to: 'fix' }, { from: 'fix', to: 'pipe' }],
          explanation: 'Failed branches get fixed and re-pushed. The pipeline runs again. This loop continues until the code passes all gates or is abandoned.',
        },
      ],
    },

    // === HANDS-ON EXERCISE ===
    {
      type: 'multiple-choice',
      question: 'You are about to wire up a real verification pipeline. What is the correct order of config files to create?',
      options: [
        'CI workflow first, then tsconfig, then eslint — CI is the top priority',
        'tsconfig first, then eslint.config, then CI workflow — local tools before CI',
        'eslint first, then tsconfig, then CI — conventions before types',
        'All at once — the order does not matter',
      ],
      correctIndex: 1,
      explanation: "Create local tool configs first (tsconfig, eslint) so you can run the pipeline locally before setting up CI. The CI workflow references these configs — it runs `tsc --noEmit` (needs tsconfig) and `bun run lint` (needs eslint.config). Always verify locally before automating.",
    },
    {
      type: 'terminal',
      instruction: 'Create the GitHub Actions workflow directory:',
      expectedCommand: 'mkdir -p .github/workflows',
      hint: 'Use mkdir -p to create nested directories',
    },
    {
      type: 'terminal',
      instruction: 'Run the type checker to verify no type errors exist:',
      expectedCommand: 'bunx tsc --noEmit',
      hint: 'Use bunx to run tsc with --noEmit flag (check types without producing output)',
    },
    {
      type: 'terminal',
      instruction: 'Run the full pipeline locally to verify it passes before pushing:',
      expectedCommand: 'bunx tsc --noEmit && bun run lint && bun test && bun run build',
      hint: 'Chain all four stages with && so it stops at the first failure',
    },
    {
      type: 'code-input',
      instruction: 'In the GitHub Actions YAML, what\'s the trigger pattern to run on all agent feature branches?',
      placeholder: 'branches: [...]',
      answer: "branches: ['feat/**']",
      hint: 'Agent branches follow the feat/ prefix pattern with glob matching',
    },
    {
      type: 'multiple-choice',
      question: 'You want faster pipeline feedback. Which stage should you move earlier (cheaper to run, catches common errors)?',
      options: [
        'Integration tests — they catch the most bugs',
        'Type checking — it\'s the fastest and catches contract violations',
        'Build step — if it doesn\'t build, nothing else matters',
        'Coverage check — ensure agents wrote enough tests',
      ],
      correctIndex: 1,
      explanation: "Type checking is nearly instant (2-5 seconds) and catches the #1 multi-agent error: contract mismatches. It should always be first. Integration tests are valuable but slow. Put cheap checks first for fast feedback.",
    },
    {
      type: 'checklist',
      title: 'Verification pipeline checklist',
      items: [
        'Type checking configured with strict mode',
        'Lint rules encode CLAUDE.md forbidden patterns',
        'Tests required as part of every agent task spec',
        'CI workflow triggers on feat/** branches automatically',
        'Branch protection requires pipeline pass before merge',
        'Pipeline runs locally with one command for pre-push checks',
        'No override mechanism — pipeline failures block all merges',
      ],
    },
    {
      type: 'checkpoint',
      xp: 7,
      message: 'Verification pipeline built! Automated checks run on every AI branch before it goes live.',
    },
  ],
}

export default content
