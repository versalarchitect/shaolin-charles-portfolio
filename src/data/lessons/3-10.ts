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
      type: 'multiple-choice',
      question: 'What are the three clearest indicators that an agent in your fleet is failing?',
      options: [
        'Slow execution time, high memory usage, and large file sizes',
        'Output does not match spec structure, tests fail, and the agent edits the same file repeatedly',
        'No git commits, no terminal output, and no network activity',
        'Type errors, lint warnings, and missing dependencies',
      ],
      correctIndex: 1,
      explanation: "You can't watch four terminals simultaneously. The three clearest automated signals: (1) output doesn't match spec structure, (2) tests fail that should pass given the spec, (3) the agent is stuck in a loop — editing the same file repeatedly or producing increasingly incoherent output.",
    },
    {
      type: 'code-fill',
      instruction: 'Complete the fleet health check script. Fill in the git commands that detect agent trouble: file churn, TypeScript errors, and commit activity.',
      language: 'bash',
      filename: 'scripts/fleet-health.sh',
      template: `#!/bin/bash
# Quick fleet health check -- run every 2-3 minutes

WORKTREES=("auth" "api" "ui" "payments")

for wt in "\${WORKTREES[@]}"; do
  echo "=== Agent: $wt ==="
  cd "../worktree-$wt" 2>/dev/null || { echo "  [MISSING]"; continue; }

  # Signal 1: Uncommitted file churn
  CHURN=$(___BLANK_1___ | wc -l)
  if [ "$CHURN" -gt 20 ]; then
    echo "  [WARN] High churn: $CHURN files modified without commit"
  fi

  # Signal 2: TypeScript errors
  ERRORS=$(___BLANK_2___ 2>&1 | grep "error TS" | wc -l)
  if [ "$ERRORS" -gt 0 ]; then
    echo "  [WARN] $ERRORS TypeScript errors"
  fi

  # Signal 3: Recent commit activity
  LAST_COMMIT=$(___BLANK_3___ 2>/dev/null)
  echo "  Last commit: $LAST_COMMIT"

  cd - > /dev/null
done`,
      blanks: [
        {
          id: 'BLANK_1',
          answer: 'git diff --stat',
          alternatives: ['git diff --stat'],
          hint: 'Git command that shows a summary of changed files (file names and change counts)',
          placeholder: 'git diff command',
        },
        {
          id: 'BLANK_2',
          answer: 'npx tsc --noEmit',
          alternatives: ['npx tsc --noEmit', 'bunx tsc --noEmit'],
          hint: 'Run the TypeScript compiler in check-only mode',
          placeholder: 'typecheck command',
        },
        {
          id: 'BLANK_3',
          answer: 'git log -1 --format="%cr"',
          alternatives: ['git log -1 --format="%cr"', "git log -1 --format='%cr'"],
          hint: 'Show the relative time of the most recent commit (e.g., "3 minutes ago")',
          placeholder: 'last commit time command',
        },
      ],
      explanation: '`git diff --stat` shows uncommitted file churn — more than 20 modified files without a commit signals trouble. `npx tsc --noEmit` catches accumulating type errors. `git log -1 --format="%cr"` shows when the last commit was — healthy agents commit every few minutes.',
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
      type: 'multiple-choice',
      question: 'You have detected a failing agent. What is the primary goal of the isolation step?',
      options: [
        'Understand why the agent failed before taking any action',
        'Prevent the agent\'s bad state from affecting other agents or the main branch',
        'Restart the agent with the same spec to see if it works the second time',
        'Delete the agent\'s worktree and start from scratch',
      ],
      correctIndex: 1,
      explanation: "Isolate immediately to prevent the bad state from affecting other agents or main. With git worktrees, isolation is clean — each agent works in its own worktree. Stash or reset the bad worktree without touching anything else. Analysis comes after isolation, not before.",
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
      type: 'code-fill',
      instruction: 'Complete the isolation script that preserves the failed agent\'s work, checks for bad commits, and resets to a clean state.',
      language: 'bash',
      filename: 'scripts/isolate-agent.sh',
      template: `#!/bin/bash
AGENT=$1  # e.g., "payments"
WORKTREE="../worktree-$AGENT"

echo "Isolating agent: $AGENT"

# 1. Preserve the failed state for analysis
git -C "$WORKTREE" ___BLANK_1___

# 2. Check if any commits were made
BAD_COMMITS=$(git -C "$WORKTREE" ___BLANK_2___ | wc -l)
if [ "$BAD_COMMITS" -gt 0 ]; then
  echo "  $BAD_COMMITS commits to review before merging"
fi

# 3. Reset to clean state
git -C "$WORKTREE" ___BLANK_3___

echo "Worktree clean. Ready for recovery agent."`,
      blanks: [
        {
          id: 'BLANK_1',
          answer: 'stash push -m "failed-attempt-$(date +%s)"',
          alternatives: ['stash push -m "failed-attempt-$(date +%s)"', 'stash push -m "failed-attempt"', 'stash'],
          hint: 'Git command to save changes with a descriptive message containing a timestamp',
          placeholder: 'stash command with message',
        },
        {
          id: 'BLANK_2',
          answer: 'log main..HEAD --oneline',
          alternatives: ['log main..HEAD --oneline', 'log main..HEAD'],
          hint: 'Show commits on this branch that are not on main (one line each)',
          placeholder: 'log command for branch commits',
        },
        {
          id: 'BLANK_3',
          answer: 'reset --hard main',
          alternatives: ['reset --hard main'],
          hint: 'Forcefully reset to match the main branch exactly',
          placeholder: 'hard reset command',
        },
      ],
      explanation: 'The stash preserves evidence for post-mortem analysis. `log main..HEAD` shows commits the agent made (might need reverting). `reset --hard main` returns the worktree to a clean state. The sequence: preserve -> inspect -> reset. Never skip the stash — you need to understand WHY the agent failed.',
    },
    {
      type: 'checkpoint',
      xp: 5,
      message: 'You can isolate a failing agent without disrupting the fleet.',
    },

    // === RECOVERY STRATEGIES ===
    {
      type: 'compare',
      title: 'Recovery: re-run same spec vs improved spec',
      body: 'After isolating a failing agent, you need to complete the work. Two approaches:',
      question: 'Which approach prevents the same failure from recurring?',
      correctSide: 'right',
      left: {
        label: 'Re-run same spec',
        content: '# Just restart the agent\nclaude --worktree ../worktree-payments \\\n  "Follow specs/payments.md"\n\n# Problems:\n# - Same spec = same failure mode\n# - No constraints learned from failure\n# - Agent may loop on the same issue\n# - No file boundaries added\n# - No concrete examples provided\n\n# Result: 70% chance of same failure',
        language: 'bash',
      },
      right: {
        label: 'Improved spec with constraints',
        content: '# 1. Analyze the stash first\ngit -C ../worktree-payments stash show -p\n\n# 2. Identify the failure pattern:\n# - Circular edits? Add type/interface to spec\n# - Scope creep? Add DO NOT MODIFY list\n# - Wrong abstraction? Add concrete example\n\n# 3. Launch with improved spec\nclaude --worktree ../worktree-payments \\\n  "Follow specs/payments-recovery.md"\n\n# Result: Failure mode eliminated',
        language: 'bash',
      },
      explanation: "Never re-run the same spec — the agent failed for a reason. Analyze the stashed work to find the failure pattern, then improve the spec with explicit constraints, file boundaries, and concrete examples. Common fixes: more explicit file boundaries, a concrete example of expected output, or breaking the task into smaller sub-tasks.",
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
      type: 'code-fill',
      instruction: 'Complete the recovery spec with explicit constraints learned from the failure. Fill in the file ownership rules and the DO NOT restrictions.',
      language: 'markdown',
      filename: 'specs/payments-recovery.md',
      template: `## Recovery: Payments Agent (Attempt 2)

### Task
Build Stripe payment integration in src/payments/

### File Ownership (STRICT)
You own: ___BLANK_1___
You may READ: src/types/contracts.ts, src/auth/types.ts
You MUST NOT MODIFY: ___BLANK_2___

### DO NOT
- Modify src/types/contracts.ts (use it as-is)
- Import from src/auth/ internals (only from ___BLANK_3___)
- Create new top-level directories
- Install new dependencies without noting them

### Expected Output Structure
src/payments/
  index.ts          # Public API: createCheckout, getSubscription
  stripe-client.ts  # Stripe SDK wrapper
  webhooks.ts       # Stripe webhook handler
  types.ts          # Internal payment types
  __tests__/
    checkout.test.ts
    webhooks.test.ts`,
      blanks: [
        {
          id: 'BLANK_1',
          answer: 'src/payments/**',
          alternatives: ['src/payments/**', 'src/payments/*'],
          hint: 'The agent owns everything under the payments directory',
          placeholder: 'owned path glob',
        },
        {
          id: 'BLANK_2',
          answer: 'anything outside src/payments/',
          alternatives: ['anything outside src/payments/', 'anything outside src/payments', 'files outside src/payments/'],
          hint: 'The agent must not modify files outside its owned directory',
          placeholder: 'forbidden modification scope',
        },
        {
          id: 'BLANK_3',
          answer: 'src/auth/types.ts',
          alternatives: ['src/auth/types.ts'],
          hint: 'The only auth file the agent is allowed to import from — only the public types',
          placeholder: 'allowed auth import',
        },
      ],
      explanation: 'The recovery spec adds explicit constraints learned from the failure: strict file ownership (`src/payments/**` only), read-only access to shared contracts, and a concrete DO NOT list. The concrete output structure and example prevent the agent from building the wrong abstraction. These constraints eliminate the failure modes found in the post-mortem.',
    },
    {
      type: 'terminal',
      instruction: 'Launch the recovery agent on the clean worktree with the improved spec:',
      expectedCommand: 'claude --worktree ../worktree-payments "Follow specs/payments-recovery.md exactly. Build the Stripe payment integration."',
      hint: 'Use claude --worktree pointing to the payments worktree with a clear instruction referencing the recovery spec',
    },

    // === CASCADE PREVENTION ===
    {
      type: 'multiple-choice',
      question: 'The API agent cannot resolve a type error, so it modifies the shared contracts file. What happens to the other agents?',
      options: [
        'Nothing — each agent works in its own worktree',
        'The UI and payments agents are now silently building against wrong types — a cascade failure',
        'The other agents automatically pull the contract changes',
        'The pipeline catches this before it affects anyone',
      ],
      correctIndex: 1,
      explanation: "This is the worst cascade scenario. The UI and payments agents (working against the old contract) are now silently building against wrong types. Their code will compile but produce runtime errors. Prevention is about architecture, not luck: shared contracts must be read-only for agents.",
    },
    {
      type: 'interactive-diagram',
      title: 'Cascade Prevention Architecture',
      body: "The key structural defense: agents import from shared contracts but never modify them. The orchestrator (you) is the only one who modifies shared resources.",
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
      stages: [
        {
          highlightNodes: ['contracts'],
          explanation: 'Shared contracts (types, interfaces, configs) are the foundation that all agents build against. They define the agreements between modules.',
        },
        {
          highlightNodes: ['contracts', 'auth', 'api', 'ui', 'pay'],
          highlightEdges: [{ from: 'contracts', to: 'auth' }, { from: 'contracts', to: 'api' }, { from: 'contracts', to: 'ui' }, { from: 'contracts', to: 'pay' }],
          explanation: 'All four agents READ from shared contracts. Each agent owns its own directory (src/auth/*, src/api/*, etc.) and only modifies files within that boundary.',
        },
        {
          highlightNodes: ['orch', 'contracts'],
          highlightEdges: [{ from: 'orch', to: 'contracts' }],
          explanation: 'Only the orchestrator (you) can WRITE to shared contracts. If a contract needs changing, pause all affected agents first, update the contract, then resume. This prevents cascading type mismatches.',
        },
      ],
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
