import type { LessonContent } from './types'

const content: LessonContent = {
  lessonId: '3-5',
  steps: [
    // === INTRODUCTION (keep first 2 passive) ===
    {
      type: 'info',
      title: 'Running multiple AI agents at the same time',
      body: "This is the moment. Everything you've learned — decomposition, worktrees, CLAUDE.md, task graphs — converges here. You're about to launch 3-5 agents simultaneously, each building a different feature, each in its own worktree, all coordinated by a shared context file. Think of yourself as mission control: you don't fly the rockets, but you track every one of them.",
    },
    {
      type: 'info',
      title: 'The orchestrator mindset',
      body: "Your job shifts completely. You're no longer prompting a single agent through a feature. You're managing a fleet: assigning tasks, monitoring progress, intervening when something goes wrong, and merging outputs into a cohesive whole. The skill is not in the prompting — it's in the coordination.",
    },

    // === DIAGRAM 1 — CONVERTED: diagram → interactive-diagram (#1) ===
    {
      type: 'interactive-diagram',
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
      stages: [
        { highlightNodes: ['you', 'claude'], highlightEdges: [{ from: 'you', to: 'claude' }], explanation: 'You write CLAUDE.md — the shared context that every agent reads. This is your single source of truth for architecture, conventions, and contracts.' },
        { highlightNodes: ['you', 'a1', 'a2', 'a3', 'a4'], highlightEdges: [{ from: 'you', to: 'a1' }, { from: 'you', to: 'a2' }, { from: 'you', to: 'a3' }, { from: 'you', to: 'a4' }], explanation: 'You assign each agent a specific task with exclusive file ownership. No two agents touch the same files.' },
        { highlightNodes: ['claude', 'a1', 'a2', 'a3', 'a4'], highlightEdges: [{ from: 'claude', to: 'a1' }, { from: 'claude', to: 'a2' }, { from: 'claude', to: 'a3' }, { from: 'claude', to: 'a4' }], explanation: 'All agents read CLAUDE.md for shared conventions and contracts. No agent communicates directly with another — all coordination flows through the hub.' },
        { highlightNodes: ['a1', 'a2', 'a3', 'a4', 'merge', 'done'], highlightEdges: [{ from: 'a1', to: 'merge' }, { from: 'a2', to: 'merge' }, { from: 'a3', to: 'merge' }, { from: 'a4', to: 'merge' }, { from: 'merge', to: 'done' }], explanation: 'All outputs merge back through you. Verify integration, resolve any conflicts, then ship.' },
      ],
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'You understand the hub-and-spoke fleet model.',
    },

    // === SETUP: WORKTREES — CONVERTED: info → multiple-choice (#2) ===
    {
      type: 'multiple-choice',
      question: 'Why does each agent get its own git worktree instead of working in the same directory?',
      options: [
        'Worktrees make the code run faster',
        'Worktrees isolate each agent on its own branch so they cannot accidentally overwrite each other\'s work',
        'Git requires worktrees for parallel development',
        'Worktrees automatically resolve merge conflicts',
      ],
      correctIndex: 1,
      explanation: "Each agent gets its own git worktree — an isolated copy of the codebase on its own branch. This means agents can't accidentally overwrite each other's work. Each worktree is a separate directory on your filesystem, all sharing the same git history.",
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
    // CONVERTED: code-demo → code-fill (#3)
    {
      type: 'code-fill',
      instruction: 'Complete this fleet setup script that creates worktrees for parallel agent work:',
      language: 'bash',
      filename: 'setup-fleet.sh',
      template: '#!/bin/bash\n# Fleet setup: create worktrees for parallel agent work\n\nAGENTS=("auth" "{{agent2}}" "{{agent3}}" "tests")\n\nfor agent in "${AGENTS[@]}"; do\n  echo "Creating worktree for $agent..."\n  git {{wtCommand}} "../fleet-$agent" -b "{{branchPrefix}}/$agent"\ndone\n\n# Verify all worktrees\ngit worktree {{listCmd}}\n\necho "Fleet ready. {{numAgents}} worktrees created."',
      blanks: [
        { id: 'agent2', answer: 'api', alternatives: ['backend'], placeholder: 'second agent?', hint: 'The agent that builds API endpoints' },
        { id: 'agent3', answer: 'ui', alternatives: ['frontend'], placeholder: 'third agent?', hint: 'The agent that builds the user interface' },
        { id: 'wtCommand', answer: 'worktree add', placeholder: 'git subcommand?', hint: 'The git command to create a new worktree' },
        { id: 'branchPrefix', answer: 'feat', alternatives: ['feature'], placeholder: 'branch prefix?', hint: 'Convention for feature branches' },
        { id: 'listCmd', answer: 'list', placeholder: 'verify command?', hint: 'Show all existing worktrees' },
        { id: 'numAgents', answer: '4', placeholder: 'count?', hint: 'auth, api, ui, tests' },
      ],
      explanation: 'The script loops through agent names, creates a worktree per agent with a feature branch, then verifies all worktrees were created. Run this once before dispatching agents.',
    },
    {
      type: 'checkpoint',
      xp: 5,
      message: 'Fleet infrastructure is ready.',
    },

    // === ASSIGN TASKS — CONVERTED: info → multiple-choice (#4) ===
    {
      type: 'multiple-choice',
      question: 'What makes a good per-agent task specification?',
      options: [
        'A high-level description like "build the auth system"',
        'Exact files to create, contracts to follow, and a definition of done — detailed enough the agent never needs to ask a question',
        'A link to the project README and a wish list of features',
        'A conversation where you explain the task step by step as the agent works',
      ],
      correctIndex: 1,
      explanation: "Each agent needs a clear, self-contained task specification including: what to build, which files to create/modify, the contracts to follow, and the definition of done. The spec should be detailed enough that the agent never needs to ask you a question.",
    },
    // CONVERTED: code-demo (Auth spec) + code-demo (API spec) → compare (#5)
    {
      type: 'compare',
      title: 'Per-agent task specs: Auth vs API',
      body: 'Each agent gets its own equally specific spec. Notice how file ownership is explicit and non-overlapping between agents.',
      question: 'What is the key property that prevents merge conflicts between these two agents?',
      correctSide: 'left',
      left: {
        label: 'Agent 1: Auth',
        content: "Scope: Email/password auth with JWT tokens\n\nFiles to Create:\n- src/auth/login.ts\n- src/auth/signup.ts\n- src/auth/middleware.ts\n- src/auth/schemas.ts\n- src/auth/__tests__/login.test.ts\n- src/auth/__tests__/signup.test.ts\n\nContracts:\n- Import User type from src/types/contracts.ts\n- JWT payload: { userId, email, role }\n- Return ApiResponse<{ token: string }>\n\nKey: Exclusive ownership of src/auth/*",
      },
      right: {
        label: 'Agent 2: API',
        content: "Scope: CRUD endpoints for tasks\n\nFiles to Create:\n- src/api/routes/tasks.ts\n- src/api/routes/health.ts\n- src/api/schemas.ts\n- src/api/__tests__/tasks.test.ts\n\nContracts:\n- Import Task, ApiResponse from contracts.ts\n- Use auth middleware (import path only)\n- All responses wrapped in ApiResponse<T>\n\nKey: Exclusive ownership of src/api/*",
      },
      explanation: "Exclusive file ownership is the key. The auth agent only creates files in src/auth/*, the API agent only in src/api/*. No overlap means no merge conflicts. Both agents reference the same contracts.ts but neither modifies it.",
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

    // === ORCHESTRATION: MONITORING — CONVERTED: info → multiple-choice (#6) ===
    {
      type: 'multiple-choice',
      question: 'How often should you check each agent\'s progress during the first fleet run?',
      options: [
        'Once at the very end when all agents are done',
        'Every 2-3 minutes — check git status in each worktree to see if files are appearing',
        'Continuously watch every keystroke in real-time',
        'Only when an agent explicitly asks for help',
      ],
      correctIndex: 1,
      explanation: "Once agents are running, your job is to watch, not wait. Check each agent's progress periodically. Files appearing means work is happening. No changes after 5 minutes might mean the agent is stuck. Good orchestrators check every 2-3 minutes during the first run, then relax as they build trust.",
    },
    // CONVERTED: code-demo → code-fill (#7)
    {
      type: 'code-fill',
      instruction: 'Complete this fleet status check script to monitor all agents:',
      language: 'bash',
      filename: 'check-fleet.sh',
      template: '#!/bin/bash\n# Quick fleet status check\n\necho "=== Auth Agent ==="\ngit -C ../{{authDir}} status --short\n\necho "=== API Agent ==="\ngit -C ../{{apiDir}} {{statusCmd}}\n\necho "=== UI Agent ==="\ngit -C ../fleet-ui status --{{shortFlag}}\n\necho "=== Tests Agent ==="\ngit -C ../fleet-tests status --short',
      blanks: [
        { id: 'authDir', answer: 'fleet-auth', placeholder: 'auth directory?', hint: 'Follows the pattern fleet-<agent-name>' },
        { id: 'apiDir', answer: 'fleet-api', placeholder: 'api directory?', hint: 'Follows the pattern fleet-<agent-name>' },
        { id: 'statusCmd', answer: 'status --short', alternatives: ['status -s'], placeholder: 'git command?', hint: 'Same git status command used for the other agents' },
        { id: 'shortFlag', answer: 'short', alternatives: ['s'], placeholder: 'flag?', hint: 'Compact output format for git status' },
      ],
      explanation: 'Checking git status in each worktree is a quick way to see where each agent stands. Files appearing means work is happening. No changes after 5 minutes might mean the agent is stuck.',
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

    // === MERGING — CONVERTED: info → multiple-choice (#8) ===
    {
      type: 'multiple-choice',
      question: 'All agents have finished. What is the merging strategy for fleet outputs?',
      options: [
        'Merge all branches at once with a single command',
        'Merge branches one at a time with --no-ff, starting with the most independent branch',
        'Cherry-pick individual commits from each branch',
        'Copy files manually from each worktree into main',
      ],
      correctIndex: 1,
      explanation: "Merge branches sequentially with --no-ff to preserve branch history. Start with the most independent branch and work toward the most shared. If you followed exclusive file ownership and shared contracts, the merge should be clean.",
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
    // CONVERTED: code-demo (verify-merge) → code-fill (#9)
    {
      type: 'code-fill',
      instruction: 'Complete the post-merge verification script that checks the integrated codebase:',
      language: 'bash',
      filename: 'verify-merge.sh',
      template: '#!/bin/bash\n# Post-fleet-merge verification\n\necho "Checking TypeScript compilation..."\nnpx {{tscCmd}}\n\necho "Running linter..."\nbun run {{lintCmd}}\n\necho "Running all tests..."\nbun {{testCmd}}\n\necho "Building production bundle..."\nbun run {{buildCmd}}\n\necho "Integration verified. Fleet output is clean."',
      blanks: [
        { id: 'tscCmd', answer: 'tsc --noEmit', alternatives: ['tsc --noEmit --pretty'], placeholder: 'typecheck command?', hint: 'TypeScript compiler with flag to only check types, not emit files' },
        { id: 'lintCmd', answer: 'lint', placeholder: 'lint script?', hint: 'The npm script name for linting' },
        { id: 'testCmd', answer: 'test', alternatives: ['test --run'], placeholder: 'test command?', hint: 'Run all tests' },
        { id: 'buildCmd', answer: 'build', placeholder: 'build script?', hint: 'The npm script name for production build' },
      ],
      explanation: 'After merging all branches, run the full CI pipeline: typecheck, lint, test, build. This is the integration test for your fleet output. If all four pass, you can trust the merged result.',
    },
    {
      type: 'checkpoint',
      xp: 5,
      message: 'You can merge fleet outputs and verify integration.',
    },

    // === INTERACTIVE: CODE-FILL (already interactive) ===
    {
      type: 'code-fill',
      instruction: 'Complete the fleet launch script to set up parallel agent workspaces:',
      language: 'bash',
      filename: 'launch-fleet.sh',
      template: '#!/bin/bash\nAGENTS=("{{agent1}}" "{{agent2}}" "ui" "tests")\n\nfor agent in "${AGENTS[@]}"; do\n  git worktree add ../fleet-$agent -b {{branchPrefix}}/$agent\ndone\n\n# Launch agents in parallel\ncd ../{{worktree1}} && claude "Implement JWT auth" &\ncd ../{{worktree2}} && claude "Build REST endpoints" &\nwait\necho "Fleet complete."',
      blanks: [
        { id: 'agent1', answer: 'auth', alternatives: ['authentication'], placeholder: 'first agent name?', hint: 'The agent responsible for login/signup' },
        { id: 'agent2', answer: 'api', alternatives: ['backend', 'server'], placeholder: 'second agent name?', hint: 'The agent that builds endpoints' },
        { id: 'branchPrefix', answer: 'feat', alternatives: ['feature'], placeholder: 'branch prefix?', hint: 'Convention for feature branches' },
        { id: 'worktree1', answer: 'fleet-auth', alternatives: ['fleet-authentication'], placeholder: 'auth worktree path?', hint: 'Matches the pattern ../fleet-$agent' },
        { id: 'worktree2', answer: 'fleet-api', alternatives: ['fleet-backend'], placeholder: 'api worktree path?' },
      ],
      explanation: 'The script creates a worktree per agent with a feature branch, then launches agents in the background with &. The `wait` command blocks until all background processes finish.',
    },

    // === INTERACTIVE: FLEET LIFECYCLE DIAGRAM (already interactive) ===
    {
      type: 'interactive-diagram',
      title: 'Complete Fleet Lifecycle (Step Through)',
      body: 'Step through the full fleet lifecycle from preparation to shipping.',
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
      stages: [
        { highlightNodes: ['prep'], explanation: 'Write CLAUDE.md, define contracts, create worktrees, write per-agent task specs. This is your 5-10 minute investment that saves hours.' },
        { highlightNodes: ['prep', 'exec'], highlightEdges: [{ from: 'prep', to: 'exec' }], explanation: 'Launch all agents in parallel. Each runs in its own worktree on its own branch. Total time = slowest agent, not sum of all.' },
        { highlightNodes: ['exec', 'monitor'], highlightEdges: [{ from: 'exec', to: 'monitor' }], explanation: 'Check `git status` in each worktree every 2-3 minutes. Watch for stuck agents (no files after 10 min) or scope creep.' },
        { highlightNodes: ['monitor', 'merge'], highlightEdges: [{ from: 'monitor', to: 'merge' }], explanation: 'Merge branches sequentially: most independent first, most shared-code last. Use --no-ff to preserve branch history.' },
        { highlightNodes: ['merge', 'verify'], highlightEdges: [{ from: 'merge', to: 'verify' }], explanation: 'Run the full CI pipeline: typecheck, lint, test, build. This is the integration test for your fleet\'s output.' },
        { highlightNodes: ['verify', 'ship'], highlightEdges: [{ from: 'verify', to: 'ship' }], explanation: 'Everything passes — ship it. Clean up worktrees. The fleet run is complete.' },
      ],
    },

    // === CLEANUP — CONVERTED: info → multiple-choice (#10) ===
    {
      type: 'multiple-choice',
      question: 'After merging all fleet branches, why should you remove the worktrees?',
      options: [
        'Worktrees consume git storage and slow down future operations',
        'They have served their purpose — branches are preserved in git history via --no-ff merge commits, so you can always trace which agent built what',
        'Git automatically deletes them after merge',
        'You need to free up the branch names for the next fleet run',
      ],
      correctIndex: 1,
      explanation: "After merging, the worktrees have served their purpose. The branches are preserved in git history via the --no-ff merge commits, so you can always trace which agent built what. Clean up to keep your filesystem tidy.",
    },
    {
      type: 'terminal',
      instruction: 'Remove all fleet worktrees:',
      expectedCommand: 'git worktree remove ../fleet-auth && git worktree remove ../fleet-api && git worktree remove ../fleet-ui && git worktree remove ../fleet-tests',
      hint: 'Chain git worktree remove for each fleet directory',
    },

    // === DIAGRAM 2 — CONVERTED: diagram → interactive-diagram (#11) ===
    {
      type: 'interactive-diagram',
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
      stages: [
        { highlightNodes: ['prep'], explanation: 'Preparation: CLAUDE.md, contracts, worktrees, per-agent task specs. Your investment is 5-10 minutes.' },
        { highlightNodes: ['exec'], explanation: 'Execution: All agents run in parallel. Total time equals the slowest agent, not the sum of all tasks.' },
        { highlightNodes: ['monitor'], explanation: 'Monitoring: Check git status in each worktree. Intervene when agents get stuck or drift from spec.' },
        { highlightNodes: ['merge', 'verify', 'ship'], highlightEdges: [{ from: 'merge', to: 'verify' }, { from: 'verify', to: 'ship' }], explanation: 'Integration: Merge sequentially, verify with full CI pipeline, then ship. This serial phase is the quality gate.' },
      ],
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
      message: 'Fleet run complete! You can now run multiple AI agents in parallel. That is a serious speed advantage.',
    },
  ],
}

export default content
