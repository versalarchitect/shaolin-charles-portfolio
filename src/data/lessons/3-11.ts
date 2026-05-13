import type { LessonContent } from './types'

const content: LessonContent = {
  lessonId: '3-11',
  steps: [
    // === INTRODUCTION ===
    {
      type: 'info',
      title: 'Monitoring AI-built code in production',
      body: "The fleet shipped. Four agents built authentication, API, payments, and UI — all merged, deployed, live. Users are hitting it. Then at 2am: 500 errors spike. You open Sentry and see a stack trace in code an agent wrote three days ago. The question isn't 'who wrote this bug' — it's 'how do I trace this back to the spec that produced it, and how do I prevent this class of bug next time?'",
    },
    {
      type: 'info',
      title: 'Agent-introduced bugs have patterns',
      body: "Agents don't make random mistakes. They make systematic ones — predictable classes of bugs that emerge from how agents process instructions. Once you know the patterns, you can (1) catch them in review before deploy, (2) set up monitoring tuned to detect them, and (3) improve specs to prevent them. This lesson covers all three.",
    },

    // === DIAGRAM 1: The Feedback Loop (interactive) ===
    {
      type: 'interactive-diagram',
      title: 'The Agent Production Feedback Loop',
      body: 'Click through each stage to see how production errors flow back into better specs.',
      diagram: {
        direction: 'TB',
        nodes: [
          { id: 'deploy', label: 'Deploy', sublabel: 'Ship to prod', shape: 'rounded' },
          { id: 'monitor', label: 'Monitor', sublabel: 'Sentry + logs', shape: 'rect' },
          { id: 'errors', label: 'Errors Detected', sublabel: 'Alerts fire', shape: 'diamond', highlight: true },
          { id: 'analyze', label: 'Analyze Patterns', sublabel: 'Classify bug type', shape: 'rect' },
          { id: 'improve', label: 'Improve Spec', sublabel: 'Prevent recurrence', shape: 'pill', highlight: true },
          { id: 'redeploy', label: 'Redeploy', sublabel: 'Ship the fix', shape: 'rounded' },
        ],
        edges: [
          { from: 'deploy', to: 'monitor' },
          { from: 'monitor', to: 'errors' },
          { from: 'errors', to: 'analyze' },
          { from: 'analyze', to: 'improve' },
          { from: 'improve', to: 'redeploy' },
          { from: 'redeploy', to: 'monitor', label: 'loop continues', dashed: true },
        ],
      },
      stages: [
        {
          highlightNodes: ['deploy'],
          highlightEdges: [],
          explanation: 'The fleet shipped code to production. Four agents built different modules — auth, API, payments, UI — all merged and deployed. Users are now hitting the live system.',
        },
        {
          highlightNodes: ['deploy', 'monitor'],
          highlightEdges: [{ from: 'deploy', to: 'monitor' }],
          explanation: 'Sentry, application logs, and uptime monitors watch the deployed code. Error rates, latency spikes, and unhandled exceptions are tracked in real time.',
        },
        {
          highlightNodes: ['monitor', 'errors'],
          highlightEdges: [{ from: 'monitor', to: 'errors' }],
          explanation: 'An alert fires: 500 errors spike at 2am. Sentry captures a TypeError in code an agent wrote three days ago. The stack trace points to a specific file and line number.',
        },
        {
          highlightNodes: ['errors', 'analyze'],
          highlightEdges: [{ from: 'errors', to: 'analyze' }],
          explanation: 'You classify the bug: missing null check (Pattern 2). Git blame reveals which agent session produced it. The commit maps to a specific spec version that was missing nullable field handling.',
        },
        {
          highlightNodes: ['analyze', 'improve'],
          highlightEdges: [{ from: 'analyze', to: 'improve' }],
          explanation: 'You add "all API response fields may be null — handle with defaults" to the spec requirements checklist. A lint rule is added to catch property access without optional chaining.',
        },
        {
          highlightNodes: ['improve', 'redeploy'],
          highlightEdges: [{ from: 'improve', to: 'redeploy' }],
          explanation: 'The hotfix ships. More importantly, the improved spec ensures future agent sessions never produce this class of bug again. The loop continues — every error makes the next deployment better.',
        },
      ],
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'Every production error is spec feedback. The loop makes you better.',
    },

    // === COMMON AGENT-INTRODUCED BUGS ===
    {
      type: 'multiple-choice',
      question: 'What is the #1 most common bug pattern in agent-built code?',
      options: [
        'Performance issues — agents write slow algorithms',
        'Missing error boundaries — agents handle the happy path but skip error, loading, and null states',
        'Security vulnerabilities — agents expose secrets in client code',
        'Memory leaks — agents create objects without cleanup',
      ],
      correctIndex: 1,
      explanation: "After monitoring hundreds of agent-built deployments, missing error boundaries dominate. Agents build beautiful components that work perfectly when data loads but throw unhandled exceptions when the API returns an error or null. The other four common patterns: wrong data shape assumptions, race conditions in async code, missing input validation, and hardcoded environment assumptions.",
    },
    {
      type: 'compare',
      title: 'Pattern 1 vs Pattern 2: error boundaries vs data shape assumptions',
      body: 'Both are top agent bugs. Both crash in production. Different fixes.',
      question: 'Which pattern causes a white screen crash when the API returns an error?',
      correctSide: 'left',
      left: {
        label: 'Missing Error Boundaries',
        content: '// Agent builds happy-path only:\nfunction DashboardStats() {\n  const { data } = useQuery("stats", fetchStats)\n  return (\n    <div>\n      <h2>Revenue: ${data.revenue.toLocaleString()}</h2>\n    </div>\n  )\n}\n// data is undefined while loading -> CRASH\n// data.revenue is null from API -> CRASH\n// No loading state, no error state\n\n// Fix: Three states (loading, error, success)\n// Plus null-safe access with ?? defaults',
        language: 'typescript',
      },
      right: {
        label: 'Wrong Data Shape',
        content: '// Agent assumes all fields exist:\nexport async function getUser(req: Request) {\n  const user = await db.users.findUnique({\n    where: { id: req.params.id }\n  })\n  return Response.json({\n    name: user.name,\n    avatar: user.profile.url,\n    teamName: user.team.name,\n  })\n}\n// user might be null (not found) -> CRASH\n// profile might be null -> CRASH\n// team might not be loaded -> CRASH\n\n// Fix: null check + optional chaining\n// user.profile?.url ?? null',
        language: 'typescript',
      },
      explanation: 'Missing error boundaries cause white screen crashes in React components. Wrong data shape assumptions cause 500 errors in API handlers. Both stem from agents assuming every field is always present. The spec fix: "Every data-fetching component must render three states: loading, error, and success with null-safe access."',
    },
    {
      type: 'code-fill',
      instruction: 'Fix the agent-built component by adding proper loading, error, and null-safe handling. Fill in the missing states.',
      language: 'typescript',
      filename: 'src/dashboard/stats.tsx',
      template: `function DashboardStats() {
  const { data, isLoading, error } = useQuery('stats', fetchStats)

  if (___BLANK_1___) return <StatsSkeleton />
  if (___BLANK_2___) return <StatsError message={error.message} onRetry={refetch} />
  if (!data) return null

  return (
    <div>
      <h2>Revenue: \${(data.revenue ___BLANK_3___ 0).toLocaleString()}</h2>
    </div>
  )
}`,
      blanks: [
        {
          id: 'BLANK_1',
          answer: 'isLoading',
          alternatives: ['isLoading'],
          hint: 'The query hook state that indicates data is still being fetched',
          placeholder: 'loading check',
        },
        {
          id: 'BLANK_2',
          answer: 'error',
          alternatives: ['error', '!!error'],
          hint: 'The query hook state that indicates a fetch failure',
          placeholder: 'error check',
        },
        {
          id: 'BLANK_3',
          answer: '??',
          alternatives: ['??'],
          hint: 'The nullish coalescing operator — returns right side only if left is null or undefined',
          placeholder: 'null-safe operator',
        },
      ],
      explanation: 'Three states are mandatory for every data-fetching component: loading (skeleton), error (with retry), and success (with null-safe access via ??). The nullish coalescing operator `??` provides a default value only for null/undefined, unlike `||` which also catches 0 and empty strings.',
    },
    {
      type: 'multiple-choice',
      question: 'Which spec addition would MOST effectively prevent "missing error boundary" bugs?',
      options: [
        '"Make sure to handle errors" (general instruction)',
        '"Every data-fetching component must render three states: loading skeleton, error with retry button, and success with null-safe access"',
        '"Use try-catch in all async functions"',
        '"Add error boundaries around all components"',
      ],
      correctIndex: 1,
      explanation: "Specific, concrete requirements work. 'Handle errors' is too vague — agents interpret it as 'add a try-catch somewhere.' The second option specifies exactly what the output should look like: three states, with specifics about each one. Agents follow concrete patterns reliably.",
    },
    {
      type: 'checkpoint',
      xp: 5,
      message: 'You know the five patterns. Now let\'s set up monitoring to catch them.',
    },

    // === SENTRY SETUP FOR AGENT-BUILT CODE ===
    {
      type: 'multiple-choice',
      question: 'Standard error tracking tells you WHAT broke. For agent-built systems, what additional info do you need?',
      options: [
        'Which programming language was used',
        'Which agent session produced the code, so you can trace the bug back to the spec',
        'How many users were affected by the error',
        'Which test suite covers the broken code',
      ],
      correctIndex: 1,
      explanation: "For agent-built systems, you need to know WHICH AGENT SESSION produced the code so you can trace the bug back to the spec that caused it. Tag deployments with agent metadata (fleet run ID, commit SHA) so Sentry groups errors by the spec version that produced them.",
    },
    {
      type: 'code-fill',
      instruction: 'Complete the Sentry init with agent traceability tags. Fill in the custom tags that map errors to agent sessions.',
      language: 'typescript',
      filename: 'src/lib/monitoring.ts',
      template: `import * as Sentry from '@sentry/react'

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  release: process.env.COMMIT_SHA,

  initialScope: {
    tags: {
      fleet_run: process.env.___BLANK_1___ || 'manual',
      deployed_at: new Date().___BLANK_2___(),
    },
  },

  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration({
      maskAllText: false,
      blockAllMedia: false,
    }),
  ],

  tracesSampleRate: 0.1,
  replaysOnErrorSampleRate: ___BLANK_3___,
})`,
      blanks: [
        {
          id: 'BLANK_1',
          answer: 'FLEET_RUN_ID',
          alternatives: ['FLEET_RUN_ID'],
          hint: 'The env var that identifies which fleet execution produced this deployment',
          placeholder: 'fleet identifier env var',
        },
        {
          id: 'BLANK_2',
          answer: 'toISOString',
          alternatives: ['toISOString'],
          hint: 'Date method that returns a standardized timestamp string',
          placeholder: 'date serialization method',
        },
        {
          id: 'BLANK_3',
          answer: '1.0',
          alternatives: ['1.0', '1'],
          hint: 'Capture 100% of error replays — every error session matters for debugging',
          placeholder: 'error replay sample rate',
        },
      ],
      explanation: 'FLEET_RUN_ID correlates errors with specific fleet executions. toISOString() gives a standardized timestamp for correlating with agent session logs. 100% error replay rate (1.0) ensures you capture every error session for debugging — errors are rare enough that cost is minimal.',
    },
    {
      type: 'terminal',
      instruction: 'Install Sentry for your React + Node.js project:',
      expectedCommand: 'npm install @sentry/react @sentry/node',
      hint: 'Install both @sentry/react (frontend) and @sentry/node (backend)',
    },
    {
      type: 'code-fill',
      instruction: 'Complete the Sentry configuration for agent-built code monitoring. Fill in the DSN, environment, and sample rate settings.',
      language: 'typescript',
      filename: 'src/lib/monitoring.ts',
      template: `import * as Sentry from '@sentry/react'

Sentry.init({
  dsn: {{dsn_value}},
  environment: {{env_value}},

  release: process.env.COMMIT_SHA,

  initialScope: {
    tags: {
      fleet_run: process.env.FLEET_RUN_ID || 'manual',
      deployed_at: new Date().toISOString(),
    },
  },

  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration({
      maskAllText: false,
      blockAllMedia: false,
    }),
  ],

  tracesSampleRate: {{traces_rate}},
  replaysOnErrorSampleRate: 1.0,
})`,
      blanks: [
        { id: 'dsn_value', answer: 'process.env.SENTRY_DSN', alternatives: ['process.env.SENTRY_DSN', 'process.env.NEXT_PUBLIC_SENTRY_DSN'], placeholder: 'env variable for DSN', hint: 'The DSN should come from an environment variable, not be hardcoded' },
        { id: 'env_value', answer: 'process.env.NODE_ENV', alternatives: ['process.env.NODE_ENV', "process.env.VERCEL_ENV || 'development'"], placeholder: 'env variable for environment', hint: 'Which standard env var holds "production", "development", etc.?' },
        { id: 'traces_rate', answer: '0.1', alternatives: ['0.1', '0.10'], placeholder: 'sample rate (0-1)', hint: 'Sample 10% of transactions to balance cost and visibility' },
      ],
      explanation: 'The DSN and environment must come from environment variables — hardcoding them is one of the top agent mistakes. A 10% transaction sample rate balances observability cost with coverage. Error replays at 100% capture every error session for debugging.',
    },

    // === TRACING ERRORS TO AGENT SESSIONS ===
    {
      type: 'code-fill',
      instruction: 'Complete the trace-back script that maps a production error to the agent session that produced it. Fill in the git commands.',
      language: 'bash',
      filename: 'scripts/trace-to-agent.sh',
      template: `#!/bin/bash
# Trace a production bug to its agent source
FILE=$1  # e.g., "src/payments/checkout.ts"
LINE=$2  # e.g., "47"

echo "=== Tracing $FILE:$LINE ==="

# 1. Find the commit that last modified this line
COMMIT=$(___BLANK_1___ | awk '{print $1}')
echo "Commit: $COMMIT"

# 2. Find which branch introduced this commit
BRANCH=$(___BLANK_2___ | grep -v main | head -1 | xargs)
echo "Branch: $BRANCH"

# 3. Get the commit message
echo "Message: $(___BLANK_3___)"

echo ""
echo "=== Action ==="
echo "Update the spec for agent '$BRANCH' to prevent this pattern."`,
      blanks: [
        {
          id: 'BLANK_1',
          answer: 'git blame -L "$LINE,$LINE" "$FILE"',
          alternatives: ['git blame -L "$LINE,$LINE" "$FILE"'],
          hint: 'Git command that shows who last modified a specific line range in a file',
          placeholder: 'git blame command',
        },
        {
          id: 'BLANK_2',
          answer: 'git branch --contains "$COMMIT"',
          alternatives: ['git branch --contains "$COMMIT"'],
          hint: 'Git command that lists branches containing a specific commit',
          placeholder: 'find branch for commit',
        },
        {
          id: 'BLANK_3',
          answer: 'git log -1 --format=\'%s\' "$COMMIT"',
          alternatives: ['git log -1 --format=\'%s\' "$COMMIT"', 'git log -1 --format="%s" "$COMMIT"'],
          hint: 'Show just the subject line of a specific commit',
          placeholder: 'commit message command',
        },
      ],
      explanation: 'The trace path: error -> git blame (finds commit) -> git branch --contains (finds agent branch) -> git log (finds spec reference). This maps a production TypeError directly to the agent session and spec that produced it. Now you know exactly which spec to improve.',
    },
    {
      type: 'terminal',
      instruction: 'Use git blame to find which commit introduced line 47 of a problematic file:',
      expectedCommand: 'git blame -L 47,47 src/payments/checkout.ts',
      hint: 'Use git blame with -L to target a specific line range',
    },
    {
      type: 'checkpoint',
      xp: 5,
      message: 'You can trace any production error back to the agent session that produced it.',
    },

    // === THE SPEC IMPROVEMENT FEEDBACK LOOP ===
    {
      type: 'multiple-choice',
      question: 'A null reference error fires in production. What does this tell you about your spec?',
      options: [
        'The agent introduced a bug — agents are unreliable',
        'The spec did not specify null handling for that data path — every error is a spec gap',
        'The TypeScript types were wrong — fix the type definitions',
        'The test suite was incomplete — add more tests',
      ],
      correctIndex: 1,
      explanation: "Every production error represents a gap in your specification. A null reference error means you didn't specify null handling. A timeout means you didn't specify retry logic. A crash on empty array means you didn't specify empty states. Track these patterns and add them to a spec requirements checklist.",
    },
    {
      type: 'code-fill',
      instruction: 'Complete the spec requirements checklist derived from production errors. Fill in the missing requirements for data handling and error states.',
      language: 'markdown',
      filename: 'specs/REQUIREMENTS.md',
      template: `# Spec Requirements Checklist
(Each rule added after a production incident)

## Data Handling
- [ ] All API responses specify behavior for: success, error, empty, ___BLANK_1___
- [ ] Optional/nullable fields are explicitly listed with defaults
- [ ] Array operations handle empty arrays (no .length on undefined)

## Error States
- [ ] Every data-fetching component has: loading, error, success, ___BLANK_2___ states
- [ ] API handlers return proper status codes (404, 422, 500)
- [ ] External service calls have ___BLANK_3___ configuration

## Security
- [ ] Input validation on all user-provided data
- [ ] No secrets/keys in client-side code

## Environment
- [ ] No hardcoded URLs (use env vars)`,
      blanks: [
        {
          id: 'BLANK_1',
          answer: 'null',
          alternatives: ['null'],
          hint: 'The fourth state that API responses must handle — when a field has no value',
          placeholder: 'missing data state',
        },
        {
          id: 'BLANK_2',
          answer: 'empty',
          alternatives: ['empty'],
          hint: 'The fourth UI state for when the fetch succeeds but returns no results (e.g., empty list)',
          placeholder: 'no-results state',
        },
        {
          id: 'BLANK_3',
          answer: 'timeout + retry',
          alternatives: ['timeout + retry', 'timeout and retry', 'retry + timeout'],
          hint: 'External services can be slow or flaky — two configs needed for resilience',
          placeholder: 'resilience configs',
        },
      ],
      explanation: 'This living document grows with every production incident. Each rule exists because its absence caused a production bug. Null handling, empty states, and timeout + retry configuration are the three most commonly missing spec requirements. Before launching any agent, check the spec against this list.',
    },
    {
      type: 'multiple-choice',
      question: 'You\'ve had three production incidents this month caused by agents not handling nullable API responses. What\'s the highest-leverage fix?',
      options: [
        'Add runtime null checks to all existing code',
        'Add "all API response fields may be null — handle with defaults" to every new spec',
        'Switch to a stricter TypeScript config with noUncheckedIndexedAccess',
        'Both B and C — spec improvement prevents future bugs, strict types catch them at build time',
      ],
      correctIndex: 3,
      explanation: "Defense in depth. The spec improvement (B) prevents agents from writing nullable-unsafe code in the first place. The TypeScript strictness (C) catches any that slip through at build time. Neither alone is sufficient — agents will still try to access nullable fields even with strict types if the spec doesn't tell them to handle nulls explicitly.",
    },

    // === MONITORING DASHBOARDS ===
    {
      type: 'multiple-choice',
      question: 'Beyond standard monitoring (uptime, latency, error rate), what should you add for agent-built systems?',
      options: [
        'Code complexity metrics and cyclomatic complexity',
        'Error rate by file path, unhandled rejection rate, and runtime TypeScript errors',
        'Git commit frequency and lines of code per agent',
        'Memory usage per component and bundle size tracking',
      ],
      correctIndex: 1,
      explanation: "For agent-built systems, add: (1) Error rate by file path — if one agent's code errors more than others, its spec was weak. (2) Unhandled rejection rate — agents frequently leave promise chains unhandled. (3) TypeScript errors caught at runtime — signals the agent defeated the type system.",
    },
    {
      type: 'code-fill',
      instruction: 'Complete the React error boundary that catches crashes in agent-built code and tags them for Sentry traceability.',
      language: 'typescript',
      filename: 'src/components/error-boundary.tsx',
      template: `import * as Sentry from '@sentry/react'
import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  componentName: string
}

interface State {
  hasError: boolean
  error: Error | null
}

export class AgentCodeBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    Sentry.___BLANK_1___(error, {
      tags: {
        component: this.props.___BLANK_2___,
        error_boundary: 'agent_code',
      },
      extra: {
        componentStack: errorInfo.componentStack,
      },
    })
  }

  render() {
    if (this.state.___BLANK_3___) {
      return this.props.fallback || (
        <div>Something went wrong in {this.props.componentName}.</div>
      )
    }
    return this.props.children
  }
}`,
      blanks: [
        {
          id: 'BLANK_1',
          answer: 'captureException',
          alternatives: ['captureException'],
          hint: 'The Sentry method that reports an error to the dashboard',
          placeholder: 'Sentry error capture method',
        },
        {
          id: 'BLANK_2',
          answer: 'componentName',
          alternatives: ['componentName'],
          hint: 'The prop that identifies which component (agent module) crashed — for traceability',
          placeholder: 'component identifier prop',
        },
        {
          id: 'BLANK_3',
          answer: 'hasError',
          alternatives: ['hasError'],
          hint: 'The state boolean that tracks whether an error has been caught',
          placeholder: 'error state flag',
        },
      ],
      explanation: 'The error boundary catches React crashes and tags them with the componentName — mapping the crash to the agent module that produced it. `captureException` sends the error to Sentry with custom tags for filtering. The `hasError` state flag triggers the fallback UI instead of a white screen.',
    },
    {
      type: 'checkpoint',
      xp: 5,
      message: 'Your monitoring is tuned for agent-specific failure patterns.',
    },

    // === PREVENTING RECURRENCE ===
    {
      type: 'multiple-choice',
      question: 'What is the best production bug?',
      options: [
        'One that is caught quickly by Sentry with full context',
        'One that only affects a small percentage of users',
        'One that never reaches production — caught in pre-deploy verification',
        'One that has an obvious fix you can ship in minutes',
      ],
      correctIndex: 2,
      explanation: "The best production bug is one that never reaches production. After an agent completes its work, run a verification pass targeting known agent failure patterns. This isn't standard code review — it's a checklist tuned to what agents get wrong: missing null checks, hardcoded URLs, debug logging, and happy-path-only tests.",
    },
    {
      type: 'checklist',
      title: 'Pre-deploy verification for agent-built code',
      items: [
        'Every component/endpoint handles null and undefined inputs',
        'Loading and error states exist for all async operations',
        'No hardcoded URLs, keys, or environment-specific values',
        'External API calls have timeout and retry configuration',
        'Input from users/requests is validated before processing',
        'Error messages are user-friendly (not raw stack traces)',
        'Console.log statements removed (agents leave debug logging)',
        'No TODO comments left by the agent (they add aspirational TODOs)',
        'Tests cover error paths, not just happy paths',
        'TypeScript strict mode passes (no any types, no type assertions)',
      ],
    },
    {
      type: 'code-fill',
      instruction: 'Complete the pre-deploy check script that catches common agent patterns. Fill in the grep patterns that detect debug logging, hardcoded URLs, and type escape hatches.',
      language: 'bash',
      filename: 'scripts/agent-code-check.sh',
      template: `#!/bin/bash
echo "=== Agent Code Quality Check ==="
ISSUES=0

# Check for debug logging (agents leave console.log)
LOGS=$(grep -r "___BLANK_1___" src/ --include="*.ts" --include="*.tsx" -l | wc -l)
if [ "$LOGS" -gt 0 ]; then
  echo "[WARN] $LOGS files with console.log statements"
  ((ISSUES++))
fi

# Check for hardcoded URLs
LOCALHOST=$(grep -r "___BLANK_2___" src/ --include="*.ts" --include="*.tsx" -l | wc -l)
if [ "$LOCALHOST" -gt 0 ]; then
  echo "[FAIL] $LOCALHOST files with hardcoded localhost"
  ((ISSUES++))
fi

# Check for type escape hatches
ANYS=$(grep -r "___BLANK_3___" src/ --include="*.ts" --include="*.tsx" | wc -l)
if [ "$ANYS" -gt 0 ]; then
  echo "[WARN] $ANYS uses of 'any' type"
  ((ISSUES++))
fi

echo "=== $ISSUES issues found ==="
exit $ISSUES`,
      blanks: [
        {
          id: 'BLANK_1',
          answer: 'console.log',
          alternatives: ['console.log', '"console.log"'],
          hint: 'The JavaScript debug logging function that agents leave behind',
          placeholder: 'debug logging pattern',
        },
        {
          id: 'BLANK_2',
          answer: 'localhost',
          alternatives: ['localhost', '"localhost"'],
          hint: 'The hostname for local development that should never appear in production code',
          placeholder: 'hardcoded URL pattern',
        },
        {
          id: 'BLANK_3',
          answer: ': any',
          alternatives: [': any', '": any"'],
          hint: 'The TypeScript type annotation that agents use when they cannot resolve types',
          placeholder: 'type escape hatch pattern',
        },
      ],
      explanation: 'This script runs in under 10 seconds and catches the most common agent patterns: `console.log` (debug logging left behind), `localhost` (hardcoded development URLs), and `: any` (type escape hatches where the agent gave up on type safety). Run it before every merge.',
    },

    // === PUTTING IT TOGETHER ===
    {
      type: 'order',
      instruction: 'Order the production monitoring feedback loop correctly:',
      items: [
        'Error fires in production (Sentry alert)',
        'Trace to commit and agent branch (git blame)',
        'Classify the bug pattern (missing error state, null assumption, etc.)',
        'Hotfix the immediate issue',
        'Add the pattern to the spec requirements checklist',
        'Update the pre-deploy verification script to catch this pattern',
      ],
      correctOrder: [0, 1, 2, 3, 4, 5],
    },
    {
      type: 'multiple-choice',
      question: 'After fixing the same class of bug three times (missing null checks), what\'s the most effective long-term solution?',
      options: [
        'Review all agent code manually before every deploy',
        'Add a lint rule that flags property access without optional chaining',
        'Include "all fields are potentially null" in every spec',
        'Both B and C — automated detection + spec prevention eliminates the class entirely',
      ],
      correctIndex: 3,
      explanation: "The lint rule catches it mechanically (no human attention needed). The spec change prevents the agent from writing it in the first place. Together they eliminate the entire class of bug. Manual review doesn't scale and humans miss things.",
    },
    {
      type: 'checklist',
      title: 'Production monitoring mastery',
      items: [
        'I can trace production errors back to the agent session that produced them',
        'I recognize the five common agent-introduced bug patterns',
        'I maintain a living spec requirements checklist from production incidents',
        'I run pre-deploy verification tuned to agent failure patterns',
        'I close the feedback loop: every error improves the next spec',
        'I set up error boundaries with agent traceability tags',
        'I distinguish between bugs to hotfix now vs patterns to prevent forever',
      ],
    },
    {
      type: 'checkpoint',
      xp: 7,
      message: 'Production monitoring learned! Every error teaches you how to write better specs next time.',
    },
  ],
}

export default content
