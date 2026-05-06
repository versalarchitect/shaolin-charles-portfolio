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

    // === DIAGRAM 1: The Pipeline ===
    {
      type: 'diagram',
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
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'You see the pipeline: typecheck, lint, test, integration — in that order.',
    },

    // === PIPELINE COMPONENTS ===
    {
      type: 'info',
      title: 'Stage 1: Type checking catches contract violations',
      body: "TypeScript compilation is your first gate. It catches the most common multi-agent error: one agent's exports not matching another agent's imports. If Agent A returns `{ data: User }` but Agent B expects `{ user: User }`, tsc catches it in 2 seconds. This alone prevents 40% of integration failures.",
    },
    {
      type: 'code-demo',
      title: 'Type checking configuration',
      body: "Strict TypeScript configuration that catches contract mismatches between agent outputs.",
      language: 'json',
      filename: 'tsconfig.json',
      code: `{
  "compilerOptions": {
    "strict": true,
    "noEmit": true,
    "noUncheckedIndexedAccess": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "exactOptionalPropertyTypes": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*.ts", "src/**/*.tsx"],
  "exclude": ["node_modules", "dist"]
}`,
    },
    {
      type: 'info',
      title: 'Stage 2: Linting catches convention violations',
      body: "Agents sometimes drift from CLAUDE.md conventions — using `any`, creating barrel files, using default exports. The linter encodes these rules as automated checks. If CLAUDE.md says 'no default exports', an eslint rule enforces it mechanically.",
    },
    {
      type: 'code-demo',
      title: 'ESLint rules matching CLAUDE.md constraints',
      body: "Each CLAUDE.md 'forbidden pattern' becomes an ESLint rule. This turns human-readable guidelines into machine-enforceable gates.",
      language: 'javascript',
      filename: 'eslint.config.js',
      code: `import tseslint from 'typescript-eslint'

export default tseslint.config(
  ...tseslint.configs.strict,
  {
    rules: {
      // CLAUDE.md: "no any type"
      '@typescript-eslint/no-explicit-any': 'error',

      // CLAUDE.md: "no default exports"
      'no-restricted-syntax': ['error', {
        selector: 'ExportDefaultDeclaration',
        message: 'Use named exports only (CLAUDE.md rule)',
      }],

      // CLAUDE.md: "no console.log in production"
      'no-console': ['error', { allow: ['warn', 'error'] }],

      // CLAUDE.md: "no barrel files"
      'no-restricted-imports': ['error', {
        patterns: [{
          group: ['**/index'],
          message: 'Import directly from source file, not barrel (CLAUDE.md rule)',
        }],
      }],
    },
  }
)`,
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
      type: 'info',
      title: 'Stage 3: Tests — the agent writes them as part of the task',
      body: "Here's the key insight: don't treat tests as an afterthought you add post-merge. Make them part of the agent's task spec. 'Build the auth system AND write tests for it.' The agent produces both code and verification in one pass. The pipeline runs those tests to confirm the output actually works.",
    },
    {
      type: 'code-demo',
      title: 'Task spec that includes tests as deliverables',
      body: "Notice how tests are listed as required files, not optional. The Definition of Done includes test passing. The agent can't claim completion without them.",
      language: 'markdown',
      filename: 'TASK-AUTH.md',
      code: `# Task: Authentication System

## Required Files (code)
- src/auth/login.ts
- src/auth/signup.ts
- src/auth/middleware.ts

## Required Files (tests) ← NOT OPTIONAL
- src/auth/__tests__/login.test.ts
- src/auth/__tests__/signup.test.ts
- src/auth/__tests__/middleware.test.ts

## Test Requirements
- Login: test valid credentials, invalid credentials, missing fields
- Signup: test new user, duplicate email, weak password
- Middleware: test valid token, expired token, missing token

## Definition of Done
- [ ] All source files created
- [ ] All test files created
- [ ] \`bun test src/auth/\` passes with 0 failures`,
    },
    {
      type: 'code-demo',
      title: 'Vitest configuration for fleet testing',
      body: "Configure Vitest to run tests per-directory so you can verify each agent's output independently before merging.",
      language: 'typescript',
      filename: 'vitest.config.ts',
      code: `import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    // Run tests that match the changed files (for CI)
    passWithNoTests: false,

    // Coverage thresholds — agents must hit these
    coverage: {
      provider: 'v8',
      thresholds: {
        statements: 80,
        branches: 75,
        functions: 80,
        lines: 80,
      },
    },

    // Isolate test environments (no cross-contamination)
    isolate: true,

    // Resolve aliases matching tsconfig paths
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})`,
    },
    {
      type: 'terminal',
      instruction: 'Run tests only for the auth agent\'s output:',
      expectedCommand: 'bun test src/auth/',
      hint: 'Run bun test with the auth directory path to scope test execution',
    },

    // === CI CONFIGURATION ===
    {
      type: 'info',
      title: 'Stage 4: CI pipeline — automated on every push',
      body: "The pipeline runs automatically when an agent pushes to its branch. GitHub Actions (or your CI of choice) triggers on push, runs all four stages, and blocks merge if any stage fails. This means you can dispatch 5 agents and trust that the pipeline will catch problems before you even look at the output.",
    },
    {
      type: 'code-demo',
      title: 'GitHub Actions workflow for agent branches',
      body: "This workflow triggers on any branch push matching the feat/* pattern (your fleet branches). It runs all pipeline stages in order. If any step fails, the whole workflow fails and the branch can't merge.",
      language: 'yaml',
      filename: '.github/workflows/verify-agent.yml',
      code: `name: Verify Agent Output

on:
  push:
    branches: ['feat/**']

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

      - name: Stage 1 — Type Check
        run: bunx tsc --noEmit

      - name: Stage 2 — Lint
        run: bun run lint

      - name: Stage 3 — Unit Tests
        run: bun test --coverage

      - name: Stage 4 — Build (integration check)
        run: bun run build`,
    },
    {
      type: 'checkpoint',
      xp: 5,
      message: 'You can configure CI to automatically verify every agent branch.',
    },

    // === BRANCH PROTECTION ===
    {
      type: 'info',
      title: 'Branch protection: the mechanical guarantee',
      body: "CI runs the pipeline, but what stops you from merging a failed branch anyway? Branch protection rules. Configure GitHub to require the 'Verify Agent Output' workflow to pass before any PR can merge to main. This makes the rule mechanical, not just social.",
    },
    {
      type: 'code-demo',
      title: 'Branch protection configuration',
      body: "These rules make it physically impossible to merge agent output that hasn't passed the pipeline. No exceptions, no overrides.",
      language: 'bash',
      filename: 'terminal',
      code: `# Configure branch protection via GitHub CLI
gh api repos/{owner}/{repo}/branches/main/protection -X PUT \
  --input - << 'EOF'
{
  "required_status_checks": {
    "strict": true,
    "contexts": ["verify"]
  },
  "enforce_admins": true,
  "required_pull_request_reviews": null,
  "restrictions": null
}
EOF`,
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
      type: 'diagram',
      title: 'End-to-End: Fleet + Pipeline + Merge',
      body: "The complete flow from agent dispatch to production merge. Every agent branch goes through the pipeline. Only passing branches get merged. This is the system that lets you scale to 5, 10, 20 agents without fear.",
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
    },

    // === HANDS-ON EXERCISE ===
    {
      type: 'info',
      title: 'Exercise: Build your verification pipeline',
      body: "Let's wire up a real pipeline. You'll create the config files that automate verification for your fleet's output.",
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
