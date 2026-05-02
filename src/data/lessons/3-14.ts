import type { LessonContent } from './types'

const content: LessonContent = {
  lessonId: '3-14',
  steps: [
    // === INTRODUCTION ===
    {
      type: 'info',
      title: 'The Fleet Sprint: Ship a Product with Coordinated Agents',
      body: "Everything you've learned converges here. Decomposition, worktrees, specs, contracts, monitoring, failure recovery, context management — all synthesized into one complete sprint. You'll orchestrate 4 agents building a Team Dashboard from scratch: project status, velocity metrics, member contributions, and activity feed. By the end, it's merged and deployable.",
    },
    {
      type: 'info',
      title: 'What makes this different from the exercises',
      body: "Previous lessons taught individual skills. This capstone is the full orchestration: you'll make real-time decisions about dependencies, handle actual merge conflicts, intervene when an agent drifts, and verify cross-agent integration. It's not a simulation — it's a compressed engineering sprint where you're the tech lead directing an AI team.",
    },

    // === PHASE 1: DECOMPOSITION ===
    {
      type: 'info',
      title: 'Phase 1: Decompose the Team Dashboard',
      body: "The product has four main surfaces: (1) Project Status — cards showing active projects, their progress, and status. (2) Velocity Metrics — charts showing team output over time. (3) Member Contributions — who did what, activity counts, recent work. (4) Activity Feed — real-time stream of team actions. Each maps to one agent.",
    },
    {
      type: 'diagram',
      title: 'Task Dependency Graph: Team Dashboard',
      body: "The decomposition reveals dependencies. The API and Auth modules are independent (start immediately). The UI depends on API contracts. The Real-time module depends on the Activity data model. Contracts defined upfront unlock maximum parallelism.",
      diagram: {
        direction: 'TB',
        nodes: [
          { id: 'contracts', label: 'Contracts', sublabel: 'You write first', shape: 'rounded', highlight: true },
          { id: 'auth', label: 'Agent 1: Auth', sublabel: 'Login, roles, sessions', shape: 'rect' },
          { id: 'api', label: 'Agent 2: API', sublabel: 'Endpoints + DB', shape: 'rect' },
          { id: 'ui', label: 'Agent 3: UI', sublabel: 'Components + pages', shape: 'rect' },
          { id: 'rt', label: 'Agent 4: Real-time', sublabel: 'WebSocket + feed', shape: 'rect' },
          { id: 'merge', label: 'Integration', sublabel: 'Merge + verify', shape: 'rect' },
          { id: 'ship', label: 'Ship', shape: 'pill', highlight: true },
        ],
        edges: [
          { from: 'contracts', to: 'auth', label: 'independent' },
          { from: 'contracts', to: 'api', label: 'independent' },
          { from: 'contracts', to: 'ui', label: 'uses contracts' },
          { from: 'contracts', to: 'rt', label: 'uses contracts' },
          { from: 'auth', to: 'merge' },
          { from: 'api', to: 'merge' },
          { from: 'ui', to: 'merge' },
          { from: 'rt', to: 'merge' },
          { from: 'merge', to: 'ship' },
        ],
      },
    },
    {
      type: 'multiple-choice',
      question: 'Looking at this dependency graph, which agents can start simultaneously if you define contracts first?',
      options: [
        'Only Auth and API (UI and Real-time have dependencies)',
        'All four — contracts defined upfront means everyone has what they need',
        'Auth, API, and UI — Real-time depends on the API data model',
        'None — you should start them sequentially for safety',
      ],
      correctIndex: 1,
      explanation: "When contracts are defined upfront, every agent has the data shapes they need from the start. The UI knows what API responses look like. Real-time knows the activity event shape. All four agents can start simultaneously. This is the power of contracts-first decomposition.",
    },
    {
      type: 'checkpoint',
      xp: 10,
      message: 'Phase 1 complete. You have a task graph with maximum parallelism.',
    },

    // === PHASE 2: WORKTREE SETUP ===
    {
      type: 'info',
      title: 'Phase 2: Set Up the Workspace',
      body: "Four agents need four isolated environments. Git worktrees give each agent its own working directory on its own branch — complete isolation with shared history. Set them up from a clean main branch.",
    },
    {
      type: 'terminal',
      instruction: 'Create the first worktree for the Auth agent on its own branch:',
      expectedCommand: 'git worktree add ../worktree-auth -b feat/auth',
      hint: 'Use git worktree add with -b to create a new branch for the auth agent',
    },
    {
      type: 'terminal',
      instruction: 'Create the API agent worktree:',
      expectedCommand: 'git worktree add ../worktree-api -b feat/api',
      hint: 'Same pattern: git worktree add with a descriptive branch name',
    },
    {
      type: 'terminal',
      instruction: 'Create the UI agent worktree:',
      expectedCommand: 'git worktree add ../worktree-ui -b feat/ui',
      hint: 'git worktree add ../worktree-ui -b feat/ui',
    },
    {
      type: 'terminal',
      instruction: 'Create the Real-time agent worktree:',
      expectedCommand: 'git worktree add ../worktree-realtime -b feat/realtime',
      hint: 'git worktree add ../worktree-realtime -b feat/realtime',
    },
    {
      type: 'terminal',
      instruction: 'Verify all worktrees are set up correctly:',
      expectedCommand: 'git worktree list',
      hint: 'Use git worktree list to see all active worktrees',
    },
    {
      type: 'checkpoint',
      xp: 10,
      message: 'Phase 2 complete. Four isolated worktrees ready for agents.',
    },

    // === PHASE 3: WRITE CONTRACTS AND SPECS ===
    {
      type: 'info',
      title: 'Phase 3: Define Contracts and Per-Agent Specs',
      body: "Before launching any agent, you write: (1) the interface contracts that define every cross-module boundary, and (2) per-agent specs that tell each agent exactly what to build, which files to own, and what constraints to follow. This takes 10-15 minutes and saves hours of integration pain.",
    },
    {
      type: 'code-demo',
      title: 'Interface contracts for the Team Dashboard',
      body: "Every agent imports these types. No agent modifies this file. It defines: what the API produces, what the UI consumes, what auth provides, and what real-time events look like.",
      language: 'typescript',
      filename: 'src/contracts/dashboard.ts',
      code: `// === Shared Contracts: Team Dashboard ===
// Written by orchestrator. READ-ONLY for all agents.

export interface AuthUser {
  id: string
  email: string
  name: string
  role: 'admin' | 'member' | 'viewer'
  avatarUrl: string | null
  teamId: string
}

export interface Project {
  id: string
  name: string
  status: 'active' | 'completed' | 'archived'
  progress: number  // 0-100
  memberIds: string[]
  updatedAt: string
}

export interface VelocityData {
  date: string        // YYYY-MM-DD
  tasksCompleted: number
  pointsDelivered: number
}

export interface MemberContribution {
  userId: string
  name: string
  avatarUrl: string | null
  tasksCompleted: number
  reviewsGiven: number
  commitsCount: number
  lastActiveAt: string
}

export interface ActivityEvent {
  id: string
  userId: string
  userName: string
  action: 'created' | 'completed' | 'reviewed' | 'commented' | 'deployed'
  target: string
  targetType: 'task' | 'pr' | 'deploy' | 'comment'
  timestamp: string
}

export interface ApiResponse<T> {
  data: T | null
  error: { code: string; message: string } | null
}

export interface WsMessage {
  type: 'activity' | 'presence' | 'update'
  payload: unknown
  timestamp: string
}`,
    },
    {
      type: 'code-demo',
      title: 'Per-agent spec: UI agent example',
      body: "Each agent gets a focused spec. This one for the UI agent references the contracts, specifies exact file ownership, describes what to build, and includes explicit constraints. Copy this pattern for all four agents.",
      language: 'markdown',
      filename: 'specs/ui-agent.md',
      code: `# UI Agent Spec: Team Dashboard Components

## File Ownership (STRICT)
You own: src/components/dashboard/**
You may READ: src/contracts/*, src/lib/*
You MUST NOT MODIFY: anything outside src/components/dashboard/

## What to Build
1. ProjectStatusGrid — displays Project[] as cards with progress bars
2. VelocityChart — line chart from VelocityData[] (use recharts)
3. MemberList — ranked list of MemberContribution[]
4. ActivityFeed — scrollable feed of ActivityEvent[]
5. DashboardLayout — page layout composing all four components

## Data Fetching
- Use React Query hooks (useQuery)
- Endpoint paths: /api/projects, /api/velocity, /api/members, /api/activity
- Response type: ApiResponse<T> from contracts

## Required States (EVERY component)
- Loading: Skeleton placeholder matching final layout
- Error: Error message with retry button
- Empty: Helpful message ("No projects yet")
- Success: Full data rendering with null-safe access

## Constraints
- Import types ONLY from src/contracts/
- Use Tailwind CSS (no inline styles, no CSS modules)
- Responsive: mobile-first, grid cols adapt at md/lg breakpoints
- Accessible: proper aria labels, keyboard navigation`,
    },
    {
      type: 'checklist',
      title: 'Pre-launch checklist',
      items: [
        'Interface contracts written and committed to all worktrees',
        'CLAUDE.md updated with dashboard-specific conventions',
        'Per-agent spec written for each of the 4 agents',
        'Shared utilities (lib/) created with common helpers',
        'Each spec includes explicit file ownership boundaries',
        'Each spec includes a "DO NOT MODIFY" section',
        'Each spec requires loading/error/empty/success states',
      ],
    },
    {
      type: 'checkpoint',
      xp: 15,
      message: 'Phase 3 complete. Contracts frozen, specs written. Ready to launch.',
    },

    // === PHASE 4: LAUNCH THE FLEET ===
    {
      type: 'info',
      title: 'Phase 4: Launch All Four Agents',
      body: "This is the moment. Four terminal windows (or background processes). Each agent gets pointed at its worktree with its spec. They'll all start building simultaneously. Your job shifts from writing to monitoring.",
    },
    {
      type: 'code-demo',
      title: 'Fleet launch commands',
      body: "Open four terminals (or use tmux/screen). Each agent starts in its own worktree with a clear instruction pointing to its spec. The --worktree flag ensures file isolation.",
      language: 'bash',
      filename: 'scripts/launch-fleet.sh',
      code: `#!/bin/bash
# Launch all 4 agents — run each in a separate terminal

# Terminal 1: Auth Agent
claude --worktree ../worktree-auth \
  "Follow specs/auth-agent.md. Build the authentication module. Read contracts from src/contracts/."

# Terminal 2: API Agent
claude --worktree ../worktree-api \
  "Follow specs/api-agent.md. Build all API endpoints. Read contracts from src/contracts/."

# Terminal 3: UI Agent
claude --worktree ../worktree-ui \
  "Follow specs/ui-agent.md. Build dashboard components. Read contracts from src/contracts/."

# Terminal 4: Real-time Agent
claude --worktree ../worktree-realtime \
  "Follow specs/realtime-agent.md. Build WebSocket server and activity feed. Read contracts from src/contracts/."`,
    },
    {
      type: 'terminal',
      instruction: 'Launch the auth agent on its worktree (you would do this in a separate terminal):',
      expectedCommand: 'claude --worktree ../worktree-auth "Follow specs/auth-agent.md exactly. Build authentication with login, roles, and session management."',
      hint: 'Use claude --worktree pointing to the auth worktree with the spec reference',
    },
    {
      type: 'checkpoint',
      xp: 10,
      message: 'Phase 4 complete. The fleet is running. Now you monitor.',
    },

    // === PHASE 5: MONITOR AND INTERVENE ===
    {
      type: 'info',
      title: 'Phase 5: Monitor the Fleet',
      body: "While agents build, you're the control tower. Check each worktree every 3-5 minutes for health signals: commit frequency, TypeScript errors, file boundary violations. Most runs complete cleanly. But when something goes wrong, you catch it early.",
    },
    {
      type: 'code-demo',
      title: 'Fleet monitoring loop',
      body: "Run this in a fifth terminal. It gives you a dashboard view of all four agents' health. Green means healthy (recent commits, no errors). Yellow means investigate. Red means intervene.",
      language: 'bash',
      filename: 'scripts/monitor-fleet.sh',
      code: `#!/bin/bash
# Fleet health monitor — run in a 5th terminal

while true; do
  clear
  echo "=== FLEET STATUS $(date +%H:%M:%S) ==="
  echo ""

  for WT in auth api ui realtime; do
    DIR="../worktree-$WT"
    [ ! -d "$DIR" ] && continue

    # Last commit time
    LAST=$(git -C "$DIR" log -1 --format="%cr" 2>/dev/null || echo "no commits")

    # Uncommitted changes
    CHANGES=$(git -C "$DIR" status --porcelain | wc -l | xargs)

    # TypeScript health
    TS_ERRORS=$(cd "$DIR" && npx tsc --noEmit 2>&1 | grep -c "error TS" 2>/dev/null || echo "0")

    # Boundary check (files outside agent's domain)
    VIOLATIONS=$(git -C "$DIR" diff --name-only main 2>/dev/null | grep -v "^src/$WT" | grep -v "^src/contracts" | wc -l | xargs)

    # Status color logic
    STATUS="OK"
    [ "$TS_ERRORS" -gt 5 ] && STATUS="WARN"
    [ "$VIOLATIONS" -gt 0 ] && STATUS="BOUNDARY VIOLATION"

    printf "  %-12s | %-20s | %s changes | %s TS errors | %s\\n" \
      "$WT" "$LAST" "$CHANGES" "$TS_ERRORS" "$STATUS"
  done

  echo ""
  echo "Press Ctrl+C to stop monitoring"
  sleep 30
done`,
    },
    {
      type: 'multiple-choice',
      question: 'The monitor shows the API agent has 12 TypeScript errors and its last commit was 7 minutes ago. The auth agent has 0 errors and committed 1 minute ago. What do you do?',
      options: [
        'Stop both agents — the TypeScript errors might be from a bad contract',
        'Investigate the API agent (12 errors + stale commits = potential loop), leave auth running',
        'Wait 5 more minutes — 12 errors might resolve as the agent works',
        'Stop all agents and re-plan the decomposition',
      ],
      correctIndex: 1,
      explanation: "12 errors + 7 minutes without a commit is a strong signal the API agent is stuck. It's likely in a loop trying to fix cascading type errors. Investigate immediately. The auth agent is healthy (0 errors, recent commit) — let it continue. Only stop the fleet if the problem is in shared contracts.",
    },
    {
      type: 'checkpoint',
      xp: 10,
      message: 'Phase 5 complete. You monitored the fleet and kept it on track.',
    },

    // === PHASE 6: CROSS-AGENT VERIFICATION ===
    {
      type: 'info',
      title: 'Phase 6: Cross-Agent Verification',
      body: "All four agents have completed their work. Before merging, verify that their outputs are actually compatible. The contracts should guarantee compatibility — but agents sometimes deviate. Run cross-agent checks: do the API endpoints return what the UI expects? Does auth provide what other modules need? Does the real-time module emit events in the shape the UI consumes?",
    },
    {
      type: 'code-demo',
      title: 'Cross-agent compatibility check',
      body: "This script checks that Agent A's output matches Agent B's expectations. It's essentially an integration test you run before the merge step. Catch mismatches here — not after merging 4 branches.",
      language: 'bash',
      filename: 'scripts/verify-compatibility.sh',
      code: `#!/bin/bash
# Cross-agent compatibility verification
echo "=== Cross-Agent Verification ==="

# 1. Check: API endpoints match what UI fetches
echo ""
echo "--- API ↔ UI Contract Check ---"
# Extract fetch URLs from UI code
UI_ENDPOINTS=$(grep -roh "fetch.*'/api/[^']*'" ../worktree-ui/src/ | sort -u)
# Extract route definitions from API code
API_ROUTES=$(grep -roh "router\.\(get\|post\).*'/api/[^']*'" ../worktree-api/src/ | sort -u)
echo "UI expects: $UI_ENDPOINTS"
echo "API provides: $API_ROUTES"

# 2. Check: Auth session shape matches what others import
echo ""
echo "--- Auth Session Shape Check ---"
AUTH_EXPORTS=$(grep "export" ../worktree-auth/src/auth/types.ts 2>/dev/null)
echo "Auth exports: $AUTH_EXPORTS"

# 3. Check: Real-time events match UI event handlers
echo ""
echo "--- Real-time ↔ UI Event Check ---"
RT_EVENTS=$(grep -roh "type:.*'[^']*'" ../worktree-realtime/src/ | sort -u)
UI_HANDLERS=$(grep -roh "case.*'[^']*'" ../worktree-ui/src/ | sort -u)
echo "RT emits: $RT_EVENTS"
echo "UI handles: $UI_HANDLERS"

# 4. TypeScript check across all worktrees
echo ""
echo "--- TypeScript Health ---"
for WT in auth api ui realtime; do
  ERRORS=$(cd "../worktree-$WT" && npx tsc --noEmit 2>&1 | grep -c "error TS")
  echo "  $WT: $ERRORS errors"
done`,
    },
    {
      type: 'checklist',
      title: 'Cross-agent verification checklist',
      items: [
        'API endpoint paths match UI fetch calls',
        'Response shapes match UI component expectations',
        'Auth session type matches what all modules import',
        'Real-time event types match UI event handlers',
        'No TypeScript errors in any worktree',
        'No files modified outside assigned boundaries',
        'All required states implemented (loading, error, empty, success)',
        'No hardcoded URLs or environment-specific values',
      ],
    },
    {
      type: 'checkpoint',
      xp: 15,
      message: 'Phase 6 complete. All agents verified compatible before merge.',
    },

    // === PHASE 7: RESOLVE CONFLICTS AND MERGE ===
    {
      type: 'info',
      title: 'Phase 7: Merge the Fleet',
      body: "Four branches, one main. Merge them one at a time in dependency order: Auth first (others may depend on it), then API, then UI, then Real-time. After each merge, run TypeScript check to catch any integration issues before they compound.",
    },
    {
      type: 'diagram',
      title: 'Merge Order Strategy',
      body: "Merge in dependency order. Foundation modules first (auth), then data layer (API), then consumers (UI, real-time). Run type checks after each merge to catch issues before they compound.",
      diagram: {
        direction: 'LR',
        nodes: [
          { id: 'auth', label: '1. Merge Auth', shape: 'rect' },
          { id: 'check1', label: 'tsc check', shape: 'diamond' },
          { id: 'api', label: '2. Merge API', shape: 'rect' },
          { id: 'check2', label: 'tsc check', shape: 'diamond' },
          { id: 'ui', label: '3. Merge UI', shape: 'rect' },
          { id: 'rt', label: '4. Merge RT', shape: 'rect' },
          { id: 'final', label: 'Final Check', shape: 'pill', highlight: true },
        ],
        edges: [
          { from: 'auth', to: 'check1' },
          { from: 'check1', to: 'api', label: 'pass' },
          { from: 'api', to: 'check2' },
          { from: 'check2', to: 'ui', label: 'pass' },
          { from: 'ui', to: 'rt' },
          { from: 'rt', to: 'final' },
        ],
      },
    },
    {
      type: 'terminal',
      instruction: 'Merge the auth branch into main first (foundation module):',
      expectedCommand: 'git merge feat/auth --no-ff -m "Merge auth module from fleet"',
      hint: 'Use git merge with --no-ff to preserve the merge commit history',
    },
    {
      type: 'terminal',
      instruction: 'After merging auth, run a TypeScript check before merging the next branch:',
      expectedCommand: 'npx tsc --noEmit',
      hint: 'Run npx tsc --noEmit to check for type errors after the merge',
    },
    {
      type: 'terminal',
      instruction: 'Merge the API branch (data layer, depends on auth types):',
      expectedCommand: 'git merge feat/api --no-ff -m "Merge API module from fleet"',
      hint: 'Same merge pattern for the API branch',
    },
    {
      type: 'terminal',
      instruction: 'Merge the UI branch (consumes API responses):',
      expectedCommand: 'git merge feat/ui --no-ff -m "Merge UI module from fleet"',
      hint: 'Merge feat/ui with a descriptive message',
    },
    {
      type: 'terminal',
      instruction: 'Merge the real-time branch last:',
      expectedCommand: 'git merge feat/realtime --no-ff -m "Merge real-time module from fleet"',
      hint: 'Merge feat/realtime as the final branch',
    },
    {
      type: 'info',
      title: 'Handling merge conflicts',
      body: "If contracts were respected, conflicts should be minimal — mostly in shared config files (package.json, tsconfig). Resolve these manually: combine dependency additions, merge path aliases. If you see conflicts in source code, an agent violated its boundary — check the boundary violation log from your monitor.",
    },
    {
      type: 'checkpoint',
      xp: 15,
      message: 'Phase 7 complete. All four branches merged. The product is assembled.',
    },

    // === PHASE 8: SHIP ===
    {
      type: 'info',
      title: 'Phase 8: Final Verification and Ship',
      body: "The code is merged. Run the full verification suite: TypeScript check, lint, build, and a manual smoke test of the key user flows. If everything passes, push to main and deploy. You just shipped a product built by a coordinated agent fleet.",
    },
    {
      type: 'code-demo',
      title: 'Final ship sequence',
      body: "The complete ship procedure. Build verifies all modules compile together. Lint catches style issues. The push triggers your deployment pipeline. This is the moment of truth.",
      language: 'bash',
      filename: 'scripts/ship.sh',
      code: `#!/bin/bash
# Final verification and ship
set -e  # Exit on any error

echo "=== Final Verification ==="

# 1. TypeScript — full project type check
echo "Running TypeScript check..."
npx tsc --noEmit
echo "  TypeScript: PASS"

# 2. Lint — code style consistency
echo "Running linter..."
npm run lint
echo "  Lint: PASS"

# 3. Build — production bundle
echo "Running production build..."
npm run build
echo "  Build: PASS"

# 4. Tests (if available)
echo "Running tests..."
npm test -- --passWithNoTests
echo "  Tests: PASS"

echo ""
echo "=== All Checks Passed ==="
echo ""

# 5. Ship it
echo "Pushing to main..."
git push origin main

echo ""
echo "Deployed. Team Dashboard built by 4 coordinated agents."
echo "Total fleet time: ~15 minutes"
echo "Equivalent serial time: ~60 minutes"`,
    },
    {
      type: 'terminal',
      instruction: 'Run the production build to verify all modules compile together:',
      expectedCommand: 'npm run build',
      hint: 'Use npm run build to verify the full production bundle',
    },
    {
      type: 'terminal',
      instruction: 'Push to main to trigger deployment:',
      expectedCommand: 'git push origin main',
      hint: 'git push origin main deploys via your CI/CD pipeline',
    },
    {
      type: 'terminal',
      instruction: 'Clean up the worktrees now that everything is merged:',
      expectedCommand: 'git worktree remove ../worktree-auth && git worktree remove ../worktree-api && git worktree remove ../worktree-ui && git worktree remove ../worktree-realtime',
      hint: 'Remove all four worktrees with git worktree remove',
    },
    {
      type: 'checkpoint',
      xp: 20,
      message: 'Phase 8 complete. Product shipped. Fleet operation successful.',
    },

    // === RETROSPECTIVE ===
    {
      type: 'info',
      title: 'Retrospective: What You Just Did',
      body: "You decomposed a product into a task graph, set up isolated worktrees, wrote contracts and specs, launched 4 parallel agents, monitored their progress, verified cross-agent compatibility, resolved merge conflicts, and shipped a deployable product. This is orchestration mastery — the skill that turns AI agents from toys into a production engineering force.",
    },
    {
      type: 'diagram',
      title: 'The Complete Fleet Sprint',
      body: "The full orchestration flow you just executed. Each phase builds on the previous. The orchestrator (you) is the constant — directing, monitoring, intervening, and shipping.",
      diagram: {
        direction: 'LR',
        nodes: [
          { id: 'decompose', label: '1. Decompose', shape: 'rect' },
          { id: 'setup', label: '2. Worktrees', shape: 'rect' },
          { id: 'specs', label: '3. Specs', shape: 'rect' },
          { id: 'launch', label: '4. Launch', shape: 'rect', highlight: true },
          { id: 'monitor', label: '5. Monitor', shape: 'rect' },
          { id: 'verify', label: '6. Verify', shape: 'rect' },
          { id: 'merge', label: '7. Merge', shape: 'rect' },
          { id: 'ship', label: '8. Ship', shape: 'pill', highlight: true },
        ],
        edges: [
          { from: 'decompose', to: 'setup' },
          { from: 'setup', to: 'specs' },
          { from: 'specs', to: 'launch' },
          { from: 'launch', to: 'monitor' },
          { from: 'monitor', to: 'verify' },
          { from: 'verify', to: 'merge' },
          { from: 'merge', to: 'ship' },
        ],
      },
    },
    {
      type: 'checklist',
      title: 'Fleet orchestration mastery — complete checklist',
      items: [
        'I decompose products into independent, agent-sized tasks with clear boundaries',
        'I define interface contracts BEFORE launching any agent',
        'I set up isolated worktrees so agents cannot interfere with each other',
        'I write focused per-agent specs with explicit file ownership and constraints',
        'I monitor fleet health and detect failures within minutes',
        'I isolate failing agents without disrupting the healthy fleet',
        'I verify cross-agent compatibility before merging',
        'I merge in dependency order with type checks between each merge',
        'I resolve conflicts arising from shared config files',
        'I run full verification (types, lint, build, tests) before shipping',
        'I compress a 60-minute serial workflow into 15 minutes of parallel execution',
        'I close the feedback loop: production insights improve future specs',
      ],
    },
    {
      type: 'checkpoint',
      xp: 30,
      message: 'CAPSTONE COMPLETE. You are an agent fleet orchestrator. Go build something real.',
    },
  ],
}

export default content
