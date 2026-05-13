import type { LessonContent } from './types'

const content: LessonContent = {
  lessonId: '3-10',
  steps: [
    // === INTRODUCTION ===
    {
      type: 'info',
      title: 'What to do when an AI agent goes wrong',
      body: "You have four agents running in parallel. Three are producing clean, spec-compliant code. One is spiraling — it misunderstood the spec, introduced a circular dependency, or got stuck in a loop rewriting the same file. In a single-agent workflow, you'd just stop and restart. In a fleet, you need surgical intervention: detect, isolate, recover — without disrupting the healthy agents.",
    },
    {
      type: 'info',
      title: 'Why fleet failures are different',
      body: "A single agent failing is annoying. An agent in a fleet failing is dangerous — if it corrupts shared files, pushes broken types to a shared interface, or monopolizes resources, it can cascade and take down the entire fleet. The key skill isn't preventing all failures (impossible), it's detecting them fast and isolating them before they spread.",
    },

    // === DIAGRAM 1: Fleet Failure Detection (Interactive) ===
    {
      type: 'interactive-diagram',
      title: 'Fleet Failure Lifecycle',
      body: "Every fleet failure follows this lifecycle. The faster you detect and isolate, the less damage spreads. The goal: under 2 minutes from failure to isolation. Recovery can take longer — the important thing is that healthy agents keep running undisturbed.",
      diagram: {
        direction: 'LR',
        nodes: [
          { id: 'running', label: 'Fleet Running', sublabel: '4 agents', shape: 'rounded' },
          { id: 'detect', label: 'Detect', sublabel: 'Signals', shape: 'diamond', highlight: true },
          { id: 'isolate', label: 'Isolate', sublabel: 'Contain', shape: 'rect' },
          { id: 'analyze', label: 'Analyze', sublabel: 'Root cause', shape: 'rect' },
          { id: 'recover', label: 'Recover', sublabel: 'Fresh agent', shape: 'rect' },
          { id: 'continue', label: 'Fleet Continues', shape: 'pill', highlight: true },
        ],
        edges: [
          { from: 'running', to: 'detect', label: 'anomaly' },
          { from: 'detect', to: 'isolate', label: 'confirmed' },
          { from: 'isolate', to: 'analyze' },
          { from: 'analyze', to: 'recover' },
          { from: 'recover', to: 'continue' },
        ],
      },
      stages: [
        {
          highlightNodes: ['running'],
          explanation: 'The fleet is running normally — 4 agents working in parallel on separate worktrees. Health check scripts monitor each agent every 2-3 minutes.',
        },
        {
          highlightNodes: ['running', 'detect'],
          highlightEdges: [{ from: 'running', to: 'detect' }],
          explanation: 'An anomaly is detected: high file churn without commits, TypeScript errors accumulating, or the agent editing the same file repeatedly. The health check flags it.',
        },
        {
          highlightNodes: ['detect', 'isolate'],
          highlightEdges: [{ from: 'detect', to: 'isolate' }],
          explanation: 'Confirmed failure. Immediately isolate: stop the agent process, stash its changes for analysis, and reset the worktree. The other 3 agents keep running undisturbed.',
        },
        {
          highlightNodes: ['isolate', 'analyze'],
          highlightEdges: [{ from: 'isolate', to: 'analyze' }],
          explanation: 'Analyze the root cause from the stashed work. Was it scope creep (modified files outside its domain)? Circular edits (same file changed repeatedly)? Wrong abstraction (misunderstood the spec)?',
        },
        {
          highlightNodes: ['analyze', 'recover'],
          highlightEdges: [{ from: 'analyze', to: 'recover' }],
          explanation: 'Write an improved spec with explicit constraints learned from the failure. Launch a fresh recovery agent on the clean worktree with tighter boundaries.',
        },
        {
          highlightNodes: ['recover', 'continue'],
          highlightEdges: [{ from: 'recover', to: 'continue' }],
          explanation: 'The recovery agent completes the work within bounds. The fleet continues with all 4 agents producing output. One failure did not cascade into fleet-wide disruption.',
        },
      ],
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'Detect fast, isolate immediately, recover at your pace.',
    },

    // === PROMPT LAB: Write a Recovery Directive ===
    {
      type: 'prompt-lab',
      instruction: 'The auth agent is stuck in a loop, editing the same file repeatedly. Write a recovery directive.',
      scenario: 'Your fleet of 4 agents is building a SaaS app. The auth agent has been running for 20 minutes and its git log shows the same file (src/lib/auth.ts) being edited 15 times with contradictory changes. The other 3 agents are working fine.',
      starterPrompt: 'Fix the auth agent.',
      responses: [
        {
          triggerKeywords: ['stash', 'reset', 'constraint', 'only'],
          response: 'Recovery plan:\n1. Stashing the agent\'s changes for analysis\n2. Resetting to last known good state\n3. Restarting with tighter constraints\n\nRoot cause: the agent was trying to satisfy conflicting requirements in the spec. Adding explicit "DO NOT modify session.ts" boundary to prevent the loop.\n\nRestarting agent with focused scope...',
          quality: 'excellent',
          feedback: 'You identified the need to: (1) preserve work for analysis, (2) reset to clean state, and (3) add constraints to prevent recurrence. This is the textbook recovery pattern.',
        },
        {
          triggerKeywords: ['stop', 'restart'],
          response: 'I\'ll stop the auth agent and restart it. Should I use the same spec or modify it?',
          quality: 'good',
          feedback: 'Stopping and restarting is necessary, but without analyzing why it looped and adding constraints, it will likely loop again. Add stash-then-analyze and tighter scope boundaries.',
        },
      ],
      fallbackResponse: {
        response: 'Which agent is having issues? Can you share more details about the problem?',
        feedback: 'Your directive was too vague. Specify: (1) stash or save the current changes, (2) reset to known good state, (3) what constraints to add to prevent the loop, and (4) what scope to restrict.',
      },
    },

    // === DETECTION SIGNALS ===
    {
      type: 'info',
      title: 'Detection signals: how to know an agent is failing',
      body: "You can't watch four terminal windows simultaneously. You need automated signals. The three clearest indicators of a failing agent: (1) output doesn't match spec structure, (2) tests fail that should pass given the spec, (3) the agent is stuck in a loop — editing the same file repeatedly or producing increasingly incoherent output.",
    },
    {
      type: 'code-demo',
      title: 'Quick health check script for a fleet',
      body: "Run this periodically while your fleet is executing. It checks each worktree for signs of trouble: uncommitted churn (same files modified repeatedly), test failures, and TypeScript errors. A healthy agent produces steady commits. A failing agent produces churn.",
      language: 'bash',
      filename: 'scripts/fleet-health.sh',
      code: `#!/bin/bash
# Quick fleet health check — run every 2-3 minutes

WORKTREES=("auth" "api" "ui" "payments")

for wt in "\${WORKTREES[@]}"; do
  echo "=== Agent: $wt ==="
  cd "../worktree-$wt" 2>/dev/null || { echo "  [MISSING]"; continue; }

  # Signal 1: Uncommitted file churn (same files modified 3+ times)
  CHURN=$(git diff --stat | wc -l)
  if [ "$CHURN" -gt 20 ]; then
    echo "  [WARN] High churn: $CHURN files modified without commit"
  fi

  # Signal 2: TypeScript errors
  ERRORS=$(npx tsc --noEmit 2>&1 | grep "error TS" | wc -l)
  if [ "$ERRORS" -gt 0 ]; then
    echo "  [WARN] $ERRORS TypeScript errors"
  fi

  # Signal 3: Recent commit activity (healthy = commits every few minutes)
  LAST_COMMIT=$(git log -1 --format="%cr" 2>/dev/null)
  echo "  Last commit: $LAST_COMMIT"

  cd - > /dev/null
done`,
    },
    {
      type: 'multiple-choice',
      question: 'An agent has modified 35 files without making a single commit in 8 minutes. What does this signal?',
      options: [
        'The agent is working on a large feature — give it more time',
        'The agent is likely stuck in a loop or has gone off-spec — investigate immediately',
        'This is normal for complex tasks',
        'The agent is waiting for user input',
      ],
      correctIndex: 1,
      explanation: "Healthy agents commit incrementally. 35 modified files with no commits in 8 minutes almost always means the agent is either stuck in a loop (trying to fix cascading errors), has misunderstood the spec (building the wrong thing at scale), or has hit a dead end and is thrashing. Investigate now — the longer you wait, the harder recovery becomes.",
    },

    // === ISOLATION TECHNIQUES ===
    {
      type: 'info',
      title: 'Isolation: containing the damage',
      body: "Once you've detected a failing agent, isolate it immediately. The goal: prevent its bad state from affecting other agents or the main branch. With git worktrees, isolation is clean — each agent works in its own worktree. You stash or reset the bad worktree without touching anything else.",
    },
    {
      type: 'terminal',
      instruction: 'The "payments" agent has gone off-track. First, check what it has done — see all modified files in its worktree:',
      expectedCommand: 'git -C ../worktree-payments diff --stat',
      hint: 'Use git -C to target the specific worktree, then diff --stat to see changed files',
    },
    {
      type: 'terminal',
      instruction: 'The damage is contained to the worktree. Stash all the bad changes so you can inspect them later if needed:',
      expectedCommand: 'git -C ../worktree-payments stash push -m "failed-attempt-1"',
      hint: 'Use git stash push with a descriptive message in the payments worktree',
    },
    {
      type: 'terminal',
      instruction: 'Now reset the worktree to a clean state matching the branch point:',
      expectedCommand: 'git -C ../worktree-payments checkout -- .',
      hint: 'Use git checkout -- . to discard all working directory changes',
    },
    {
      type: 'code-demo',
      title: 'Full isolation procedure',
      body: "Here's the complete isolation sequence. Stop the agent, preserve its work for post-mortem analysis, then clean the worktree. The stash preserves evidence — you'll want to understand WHY the agent failed so you can write a better spec for the recovery attempt.",
      language: 'bash',
      filename: 'scripts/isolate-agent.sh',
      code: `#!/bin/bash
# Isolate a failing agent's worktree
AGENT=$1  # e.g., "payments"
WORKTREE="../worktree-$AGENT"

echo "Isolating agent: $AGENT"

# 1. Stop the agent process (if running via claude --worktree)
# The agent's terminal session — Ctrl+C or kill the process

# 2. Preserve the failed state for analysis
git -C "$WORKTREE" stash push -m "failed-attempt-$(date +%s)"

# 3. Check if any commits were made (might need to revert)
BAD_COMMITS=$(git -C "$WORKTREE" log main..HEAD --oneline | wc -l)
if [ "$BAD_COMMITS" -gt 0 ]; then
  echo "  $BAD_COMMITS commits to review before merging"
  git -C "$WORKTREE" log main..HEAD --oneline
fi

# 4. Reset to clean state
git -C "$WORKTREE" reset --hard main

echo "Worktree clean. Ready for recovery agent."`,
    },
    {
      type: 'checkpoint',
      xp: 5,
      message: 'You can isolate a failing agent without disrupting the fleet.',
    },

    // === RECOVERY STRATEGIES ===
    {
      type: 'info',
      title: 'Recovery: launching a fresh agent with better context',
      body: "Isolation is done. Now you need the work completed. Don't just re-run the same spec — the agent failed for a reason. Analyze the stashed work to understand what went wrong, then improve the spec. Common fixes: more explicit file boundaries, a concrete example of expected output, or breaking the task into smaller sub-tasks.",
    },
    {
      type: 'code-demo',
      title: 'Post-mortem: diagnosing agent failure',
      body: "Before re-launching, understand WHY the agent failed. Look at the stashed diff for patterns. These three patterns cover 90% of agent failures in fleet operations.",
      language: 'bash',
      filename: 'scripts/diagnose-failure.sh',
      code: `# Inspect the failed attempt
git -C ../worktree-payments stash show -p

# Common failure patterns to look for:

# Pattern 1: Circular edits (same file modified repeatedly)
# Look for: file appears multiple times in stash, contradictory changes
# Cause: Agent couldn't resolve a type error or test failure
# Fix: Provide the correct type/interface in the spec

# Pattern 2: Scope creep (agent modified files outside its domain)
# Look for: changes in src/auth/* or src/api/* from the payments agent
# Cause: Agent decided it needed to "fix" something in another domain
# Fix: Explicitly list forbidden files in the recovery spec

# Pattern 3: Wrong abstraction (built something completely different)
# Look for: file structure doesn't match spec at all
# Cause: Agent misinterpreted the task
# Fix: Include a concrete example of expected file output`,
    },
    {
      type: 'multiple-choice',
      question: 'You inspect the stash and see the payments agent modified `src/auth/session.ts` and `src/types/contracts.ts`. What went wrong?',
      options: [
        'The payments agent found bugs in auth and helpfully fixed them',
        'The agent violated file ownership boundaries — it modified files it doesn\'t own',
        'The contracts file needed updating for payments types',
        'This is normal — agents sometimes need to modify shared files',
      ],
      correctIndex: 1,
      explanation: "This is scope creep — the #1 fleet-killer. The payments agent should ONLY modify files in src/payments/*. Modifying the shared contracts file could break every other agent. Modifying auth code could conflict with the auth agent. In recovery, explicitly state: 'You MUST NOT modify any file outside src/payments/'.",
    },

    // === IMPROVED SPEC FOR RECOVERY ===
    {
      type: 'code-demo',
      title: 'Recovery spec: what to add after failure',
      body: "The recovery spec includes everything the original spec had, PLUS explicit constraints learned from the failure. Notice the 'DO NOT' section and the concrete output example — these prevent the same failure mode from recurring.",
      language: 'markdown',
      filename: 'specs/payments-recovery.md',
      code: `## Recovery: Payments Agent (Attempt 2)

### Task
Build Stripe payment integration in src/payments/

### File Ownership (STRICT)
You own: src/payments/**
You may READ: src/types/contracts.ts, src/auth/types.ts
You MUST NOT MODIFY: anything outside src/payments/

### DO NOT
- Modify src/types/contracts.ts (use it as-is)
- Import from src/auth/ internals (only from src/auth/types.ts)
- Create new top-level directories
- Install new dependencies without noting them

### Expected Output Structure
\`\`\`
src/payments/
├── index.ts          # Public API: createCheckout, getSubscription
├── stripe-client.ts  # Stripe SDK wrapper
├── webhooks.ts       # Stripe webhook handler
├── types.ts          # Internal payment types
└── __tests__/
    ├── checkout.test.ts
    └── webhooks.test.ts
\`\`\`

### Concrete Example
Here's what src/payments/index.ts should look like:
\`\`\`typescript
import type { User } from '@/types/contracts'
import { stripe } from './stripe-client'

export async function createCheckout(user: User, priceId: string) {
  // ...implementation
}
\`\`\``,
    },
    {
      type: 'terminal',
      instruction: 'Launch the recovery agent on the clean worktree with the improved spec:',
      expectedCommand: 'claude --worktree ../worktree-payments "Follow specs/payments-recovery.md exactly. Build the Stripe payment integration."',
      hint: 'Use claude --worktree pointing to the payments worktree with a clear instruction referencing the recovery spec',
    },

    // === CASCADE PREVENTION ===
    {
      type: 'info',
      title: 'Preventing cascade failures',
      body: "The worst scenario: one agent fails, and in trying to fix itself, it breaks something that affects other agents. Example: the API agent can't resolve a type error, so it modifies the shared contracts file — now the UI and payments agents (working against the old contract) are silently building against the wrong types. Prevention is about architecture, not luck.",
    },
    {
      type: 'diagram',
      title: 'Cascade Prevention Architecture',
      body: "The key structural defense: agents import from shared contracts but never modify them. Each agent owns a boundary (its directory) and exposes only what it explicitly exports. The orchestrator (you) is the only one who modifies shared resources.",
      diagram: {
        direction: 'TB',
        nodes: [
          { id: 'contracts', label: 'Shared Contracts', sublabel: 'Read-only for agents', shape: 'rounded', highlight: true },
          { id: 'auth', label: 'Auth Agent', sublabel: 'src/auth/*', shape: 'rect' },
          { id: 'api', label: 'API Agent', sublabel: 'src/api/*', shape: 'rect' },
          { id: 'ui', label: 'UI Agent', sublabel: 'src/ui/*', shape: 'rect' },
          { id: 'pay', label: 'Payments Agent', sublabel: 'src/payments/*', shape: 'rect' },
          { id: 'orch', label: 'Orchestrator', sublabel: 'You (only writer)', shape: 'pill', highlight: true },
        ],
        edges: [
          { from: 'contracts', to: 'auth', label: 'reads', dashed: true },
          { from: 'contracts', to: 'api', label: 'reads', dashed: true },
          { from: 'contracts', to: 'ui', label: 'reads', dashed: true },
          { from: 'contracts', to: 'pay', label: 'reads', dashed: true },
          { from: 'orch', to: 'contracts', label: 'writes' },
        ],
      },
    },
    {
      type: 'checklist',
      title: 'Cascade prevention rules',
      items: [
        'Shared files (types, contracts, configs) are read-only for agents',
        'Only the orchestrator modifies shared resources',
        'Each agent spec includes explicit DO NOT MODIFY boundaries',
        'Agents cannot install new dependencies without approval',
        'Interface contracts are frozen before fleet launch',
        'If a contract needs changing, pause all affected agents first',
      ],
    },
    {
      type: 'checkpoint',
      xp: 5,
      message: 'You can prevent one failure from becoming five.',
    },

    // === PUTTING IT TOGETHER ===
    {
      type: 'order',
      instruction: 'Order the fleet failure response procedure correctly:',
      items: [
        'Detect anomaly (high churn, type errors, no commits)',
        'Stop the failing agent process',
        'Stash the failed work for post-mortem',
        'Analyze failure pattern (scope creep, circular edits, wrong abstraction)',
        'Write improved spec with explicit constraints',
        'Launch recovery agent on clean worktree',
        'Verify recovery agent stays within bounds',
      ],
      correctOrder: [0, 1, 2, 3, 4, 5, 6],
    },
    {
      type: 'multiple-choice',
      question: 'You detect a failing agent but the other three are running fine. Should you stop the entire fleet?',
      options: [
        'Yes — any failure could be a sign of a broader problem',
        'No — isolate the failing agent and let healthy agents continue',
        'Yes — you need to re-plan the entire task decomposition',
        'No — ignore the failing agent and focus on the ones that are working',
      ],
      correctIndex: 1,
      explanation: "The whole point of worktree isolation is that one agent's failure is contained to its worktree. Let the healthy agents continue producing value while you handle the recovery. Only stop the fleet if the failure reveals a problem with the shared contracts or architecture that affects everyone.",
    },
    {
      type: 'checklist',
      title: 'Fleet failure recovery mastery',
      items: [
        'I can detect failing agents within 2-3 minutes using health check signals',
        'I isolate failing agents without disrupting healthy ones',
        'I preserve failed work for post-mortem analysis',
        'I diagnose the root cause (scope creep, circular edits, wrong abstraction)',
        'I write recovery specs with explicit constraints learned from the failure',
        'I prevent cascade failures through read-only shared contracts',
        'I know when to isolate one agent vs stop the entire fleet',
      ],
    },
    {
      type: 'checkpoint',
      xp: 7,
      message: 'Failure recovery learned! One broken agent does not have to break everything.',
    },
  ],
}

export default content
