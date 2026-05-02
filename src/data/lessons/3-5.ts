import type { LessonContent } from './types'

const content: LessonContent = {
  lessonId: '3-5',
  steps: [
    // === INTRODUCTION ===
    {
      type: 'info',
      title: 'Running Your First Agent Fleet',
      body: "This is the moment. Everything you've learned — decomposition, worktrees, CLAUDE.md, task graphs — converges here. You're about to launch 3-5 agents simultaneously, each building a different feature, each in its own worktree, all coordinated by a shared context file. Think of yourself as mission control: you don't fly the rockets, but you track every one of them.",
    },
    {
      type: 'info',
      title: 'The orchestrator mindset',
      body: "Your job shifts completely. You're no longer prompting a single agent through a feature. You're managing a fleet: assigning tasks, monitoring progress, intervening when something goes wrong, and merging outputs into a cohesive whole. The skill is not in the prompting — it's in the coordination.",
    },

    // === DIAGRAM 1: Hub and Spoke ===
    {
      type: 'diagram',
      title: 'Hub and Spoke: Fleet Architecture',
      body: "You are the hub. Each agent is a spoke working in its own isolated worktree. All spokes read the shared CLAUDE.md. All outputs merge back through you. No agent communicates directly with another — all coordination flows through the hub.",
      diagram: {
        direction: 'TB',
        nodes: [
          { id: 'you', label: 'You', sublabel: 'Orchestrator', shape: 'rounded', highlight: true },
          { id: 'claude', label: 'CLAUDE.md', sublabel: 'Shared Context', shape: 'rect' },
          { id: 'a1', label: 'Agent 1', sublabel: 'Auth', shape: 'rect' },
          { id: 'a2', label: 'Agent 2', sublabel: 'API', shape: 'rect' },
          { id: 'a3', label: 'Agent 3', sublabel: 'UI', shape: 'rect' },
          { id: 'a4', label: 'Agent 4', sublabel: 'Tests', shape: 'rect' },
          { id: 'merge', label: 'Merge', sublabel: 'Integration', shape: 'rect' },
          { id: 'done', label: 'Ship', shape: 'pill', highlight: true },
        ],
        edges: [
          { from: 'you', to: 'claude', label: 'writes' },
          { from: 'claude', to: 'a1', label: 'reads' },
          { from: 'claude', to: 'a2', label: 'reads' },
          { from: 'claude', to: 'a3', label: 'reads' },
          { from: 'claude', to: 'a4', label: 'reads' },
          { from: 'you', to: 'a1', label: 'assigns' },
          { from: 'you', to: 'a2', label: 'assigns' },
          { from: 'you', to: 'a3', label: 'assigns' },
          { from: 'you', to: 'a4', label: 'assigns' },
          { from: 'a1', to: 'merge' },
          { from: 'a2', to: 'merge' },
          { from: 'a3', to: 'merge' },
          { from: 'a4', to: 'merge' },
          { from: 'merge', to: 'done' },
        ],
      },
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'You understand the hub-and-spoke fleet model.',
    },

    // === SETUP: WORKTREES ===
    {
      type: 'info',
      title: 'Step 1: Create worktrees for each agent',
      body: "Each agent gets its own git worktree — an isolated copy of the codebase on its own branch. This means agents can't accidentally overwrite each other's work. Each worktree is a separate directory on your filesystem, all sharing the same git history.",
    },
    {
      type: 'terminal',
      instruction: 'Create a worktree for the auth agent on a new branch:',
      expectedCommand: 'git worktree add ../fleet-auth -b feat/auth',
      hint: 'git worktree add <path> -b <branch-name>',
    },
    {
      type: 'terminal',
      instruction: 'Create worktrees for the API and UI agents:',
      expectedCommand: 'git worktree add ../fleet-api -b feat/api && git worktree add ../fleet-ui -b feat/ui',
      hint: 'Chain two git worktree add commands with && for the api and ui agents',
    },
    {
      type: 'code-demo',
      title: 'Full fleet setup script',
      body: "In practice, you'll script the entire worktree setup. This creates 4 worktrees, copies CLAUDE.md into each, and creates per-agent task files. Run this once before dispatching.",
      language: 'bash',
      filename: 'setup-fleet.sh',
      code: `#!/bin/bash
# Fleet setup: create worktrees for parallel agent work

AGENTS=("auth" "api" "ui" "tests")

for agent in "\${AGENTS[@]}"; do
  echo "Creating worktree for $agent..."
  git worktree add "../fleet-$agent" -b "feat/$agent"
done

# Verify all worktrees
git worktree list

echo "Fleet ready. 4 worktrees created."
echo "Dispatch agents to: ../fleet-auth, ../fleet-api, ../fleet-ui, ../fleet-tests"`,
    },
    {
      type: 'checkpoint',
      xp: 5,
      message: 'Fleet infrastructure is ready.',
    },

    // === ASSIGN TASKS ===
    {
      type: 'info',
      title: 'Step 2: Write per-agent task specs',
      body: "Each agent needs a clear, self-contained task specification. It should include: what to build, which files to create/modify, the contracts to follow, and the definition of done. The spec should be detailed enough that the agent never needs to ask you a question.",
    },
    {
      type: 'code-demo',
      title: 'Per-agent task spec (Agent 1: Auth)',
      body: "This is what you give the auth agent. Notice how specific it is: exact files, exact patterns, exact validation criteria. No ambiguity.",
      language: 'markdown',
      filename: 'TASK-AUTH.md',
      code: `# Task: Authentication System

## Scope
Build email/password auth with JWT tokens.

## Files to Create
- src/auth/login.ts — login handler
- src/auth/signup.ts — signup handler
- src/auth/middleware.ts — JWT verification middleware
- src/auth/schemas.ts — Zod validation schemas
- src/auth/__tests__/login.test.ts
- src/auth/__tests__/signup.test.ts

## Contracts
- Import User type from src/types/contracts.ts
- JWT payload shape: { userId: string, email: string, role: string }
- Return ApiResponse<{ token: string }> from login/signup

## Definition of Done
- [ ] Login returns JWT on valid credentials
- [ ] Signup creates user and returns JWT
- [ ] Middleware rejects invalid/expired tokens
- [ ] All Zod schemas validate correctly
- [ ] Tests pass with \`bun test src/auth/\``,
    },
    {
      type: 'code-demo',
      title: 'Per-agent task spec (Agent 2: API)',
      body: "The API agent gets its own equally specific spec. Notice file ownership is explicit and non-overlapping with the auth agent.",
      language: 'markdown',
      filename: 'TASK-API.md',
      code: `# Task: REST API Endpoints

## Scope
Build CRUD endpoints for tasks (the product's core entity).

## Files to Create
- src/api/routes/tasks.ts — Hono router with GET/POST/PUT/DELETE
- src/api/routes/health.ts — Health check endpoint
- src/api/schemas.ts — Request/response Zod schemas
- src/api/__tests__/tasks.test.ts

## Contracts
- Import Task, ApiResponse from src/types/contracts.ts
- Use auth middleware from src/auth/middleware.ts (import path only)
- All responses wrapped in ApiResponse<T>

## Definition of Done
- [ ] GET /tasks returns paginated task list
- [ ] POST /tasks creates a task (validates with Zod)
- [ ] PUT /tasks/:id updates a task
- [ ] DELETE /tasks/:id soft-deletes a task
- [ ] Health endpoint returns { status: 'ok' }
- [ ] Tests pass with \`bun test src/api/\``,
    },
    {
      type: 'multiple-choice',
      question: 'The API agent needs to import auth middleware but the auth agent is building it in parallel. How is this handled?',
      options: [
        'The API agent waits for the auth agent to finish',
        'The API agent imports the path — it will resolve after merge',
        'The API agent builds its own auth middleware',
        'You build the auth middleware first, then dispatch both agents',
      ],
      correctIndex: 1,
      explanation: "The API agent codes against the interface (import path + expected behavior) not the implementation. After merge, the import resolves. This is why contracts are defined upfront — agents work against agreed interfaces, not each other's actual code.",
    },
    {
      type: 'checkpoint',
      xp: 5,
      message: 'You can write self-contained task specs for each agent.',
    },

    // === ORCHESTRATION: MONITORING ===
    {
      type: 'info',
      title: 'Step 3: Monitor the fleet',
      body: "Once agents are running, your job is to watch, not wait. Check each agent's progress periodically. Are they on track? Are they stuck? Are they drifting from the spec? Good orchestrators check every 2-3 minutes during the first run, then relax as they build trust in their decomposition.",
    },
    {
      type: 'code-demo',
      title: 'Fleet status check pattern',
      body: "A quick way to see where each agent stands: check git status in each worktree. Files appearing means work is happening. No changes after 5 minutes might mean the agent is stuck.",
      language: 'bash',
      filename: 'check-fleet.sh',
      code: `#!/bin/bash
# Quick fleet status check

echo "=== Auth Agent ==="
git -C ../fleet-auth status --short

echo "=== API Agent ==="
git -C ../fleet-api status --short

echo "=== UI Agent ==="
git -C ../fleet-ui status --short

echo "=== Tests Agent ==="
git -C ../fleet-tests status --short`,
    },
    {
      type: 'checklist',
      title: 'Intervention triggers — when to step in',
      items: [
        'Agent has been running 10+ minutes with no new files (likely stuck in a loop)',
        'Agent is creating files outside its designated directory (scope creep)',
        'Agent is modifying shared contract files (violating CLAUDE.md rules)',
        'Agent is installing new dependencies not in the spec (going off-script)',
        'Agent asks a question that indicates it misunderstood the task',
      ],
    },
    {
      type: 'multiple-choice',
      question: 'Agent 3 (UI) has been running for 12 minutes and created 0 files. What do you do?',
      options: [
        'Wait longer — some tasks take time to start',
        'Kill the agent and restart with a simpler task',
        'Check what the agent is doing — it might be stuck in a planning loop',
        'Reduce the task scope and split into two agents',
      ],
      correctIndex: 2,
      explanation: "First, diagnose. The agent might be stuck in an analysis loop, fighting a type error, or waiting on something. Check its current state before deciding to kill, restart, or adjust. Most 'stuck' agents just need a nudge — a clarification or a simpler starting point.",
    },

    // === MERGING ===
    {
      type: 'info',
      title: 'Step 4: Merge all outputs into a working codebase',
      body: "All agents have finished. Now you merge their branches back into main. This is the moment of truth — did your decomposition work? If you followed exclusive file ownership and shared contracts, the merge should be clean. If not, you'll learn what to specify better next time.",
    },
    {
      type: 'terminal',
      instruction: 'Merge the auth branch into main:',
      expectedCommand: 'git merge feat/auth --no-ff',
      hint: 'Use git merge with --no-ff to preserve the branch history',
    },
    {
      type: 'terminal',
      instruction: 'Merge all remaining branches:',
      expectedCommand: 'git merge feat/api --no-ff && git merge feat/ui --no-ff && git merge feat/tests --no-ff',
      hint: 'Chain git merge commands for api, ui, and tests branches with --no-ff',
    },
    {
      type: 'code-demo',
      title: 'Post-merge verification',
      body: "After merging all branches, verify the integrated codebase works. This is the integration test — the final check before you trust the fleet's output.",
      language: 'bash',
      filename: 'verify-merge.sh',
      code: `#!/bin/bash
# Post-fleet-merge verification

echo "Checking TypeScript compilation..."
npx tsc --noEmit

echo "Running linter..."
bun run lint

echo "Running all tests..."
bun test

echo "Building production bundle..."
bun run build

echo "Integration verified. Fleet output is clean."`,
    },
    {
      type: 'checkpoint',
      xp: 5,
      message: 'You can merge fleet outputs and verify integration.',
    },

    // === CLEANUP ===
    {
      type: 'info',
      title: 'Step 5: Clean up worktrees',
      body: "After merging, remove the worktrees. They've served their purpose. The branches are preserved in git history via the --no-ff merge commits, so you can always trace which agent built what.",
    },
    {
      type: 'terminal',
      instruction: 'Remove all fleet worktrees:',
      expectedCommand: 'git worktree remove ../fleet-auth && git worktree remove ../fleet-api && git worktree remove ../fleet-ui && git worktree remove ../fleet-tests',
      hint: 'Chain git worktree remove for each fleet directory',
    },

    // === DIAGRAM 2: Complete Fleet Lifecycle ===
    {
      type: 'diagram',
      title: 'Complete Fleet Lifecycle',
      body: "The full lifecycle from prep to ship. Prep is fast (5-10 minutes). Execution is parallel (agents run simultaneously). Merge and verify is serial (you integrate carefully). The total wall-clock time is dominated by the slowest agent, not the sum of all tasks.",
      diagram: {
        direction: 'LR',
        nodes: [
          { id: 'prep', label: 'Prep', sublabel: '5-10 min', shape: 'rounded' },
          { id: 'exec', label: 'Execute', sublabel: 'Parallel', shape: 'rect', highlight: true },
          { id: 'monitor', label: 'Monitor', sublabel: 'Track fleet', shape: 'rect' },
          { id: 'merge', label: 'Merge', sublabel: 'Serial', shape: 'rect' },
          { id: 'verify', label: 'Verify', sublabel: 'CI Pipeline', shape: 'rect' },
          { id: 'ship', label: 'Ship', shape: 'pill', highlight: true },
        ],
        edges: [
          { from: 'prep', to: 'exec' },
          { from: 'exec', to: 'monitor' },
          { from: 'monitor', to: 'merge' },
          { from: 'merge', to: 'verify' },
          { from: 'verify', to: 'ship' },
        ],
      },
    },
    {
      type: 'checklist',
      title: 'First fleet run checklist',
      items: [
        'CLAUDE.md written with all architectural decisions',
        'Contracts defined in shared types file',
        'Worktrees created for each agent',
        'Per-agent task specs with clear file ownership',
        'Status monitoring every 2-3 minutes during execution',
        'Intervention when agents go off-spec or get stuck',
        'Merge with --no-ff to preserve branch history',
        'Post-merge verification: typecheck, lint, test, build',
        'Worktrees cleaned up after successful merge',
      ],
    },
    {
      type: 'checkpoint',
      xp: 12,
      message: 'Lesson complete. You\'ve run your first fleet. Parallel execution is your new default.',
    },
  ],
}

export default content
