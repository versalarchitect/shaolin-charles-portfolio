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

    // === DIAGRAM 1: The Feedback Loop ===
    {
      type: 'diagram',
      title: 'The Agent Production Feedback Loop',
      body: "Production errors aren't just bugs to fix — they're data that improves your agent specs. Every error that reaches production should feed back into your specification process. This loop is how you get better at directing agents over time.",
      diagram: {
        direction: 'TB',
        nodes: [
          { id: 'prod', label: 'Production', sublabel: 'Live users', shape: 'rounded' },
          { id: 'error', label: 'Error Detected', sublabel: 'Sentry/logs', shape: 'diamond', highlight: true },
          { id: 'trace', label: 'Trace to Source', sublabel: 'Which agent session?', shape: 'rect' },
          { id: 'classify', label: 'Classify', sublabel: 'Bug pattern', shape: 'rect' },
          { id: 'fix', label: 'Fix in Prod', sublabel: 'Hotfix', shape: 'rect' },
          { id: 'spec', label: 'Improve Spec', sublabel: 'Prevent recurrence', shape: 'pill', highlight: true },
        ],
        edges: [
          { from: 'prod', to: 'error' },
          { from: 'error', to: 'trace' },
          { from: 'trace', to: 'classify' },
          { from: 'classify', to: 'fix' },
          { from: 'classify', to: 'spec' },
          { from: 'spec', to: 'prod', label: 'next deploy', dashed: true },
        ],
      },
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'Every production error is spec feedback. The loop makes you better.',
    },

    // === COMMON AGENT-INTRODUCED BUGS ===
    {
      type: 'info',
      title: 'The five most common agent-introduced bugs',
      body: "After monitoring hundreds of agent-built deployments, these patterns dominate: (1) Missing error boundaries — agents handle the happy path beautifully but skip error states. (2) Wrong data shape assumptions — agents guess at nullable fields. (3) Race conditions in async code — agents don't think about concurrent requests. (4) Missing input validation — agents trust all input implicitly. (5) Hardcoded environment assumptions — agents embed localhost URLs or dev-only configs.",
    },
    {
      type: 'code-demo',
      title: 'Pattern 1: Missing error boundaries',
      body: "The most common agent bug. The agent builds a beautiful component that works perfectly when data loads — but throws an unhandled exception when the API returns an error or the data shape is unexpected. In production, this shows as a white screen crash.",
      language: 'typescript',
      filename: 'src/dashboard/stats.tsx',
      code: `// What the agent built (works in happy path):
function DashboardStats() {
  const { data } = useQuery('stats', fetchStats)
  return (
    <div>
      <h2>Revenue: \${data.revenue.toLocaleString()}</h2>
      {/*  data can be undefined while loading */}
      {/*  data.revenue can be null from API */}
      {/*  No loading state, no error state */}
    </div>
  )
}

// What production needs:
function DashboardStats() {
  const { data, isLoading, error } = useQuery('stats', fetchStats)

  if (isLoading) return <StatsSkeleton />
  if (error) return <StatsError message={error.message} onRetry={refetch} />
  if (!data) return null

  return (
    <div>
      <h2>Revenue: \${(data.revenue ?? 0).toLocaleString()}</h2>
    </div>
  )
}`,
    },
    {
      type: 'code-demo',
      title: 'Pattern 2: Wrong data shape assumptions',
      body: "Agents read your type definitions and assume every field is always present. In reality, APIs return partial data, optional fields, and null values. This crashes at runtime when the agent does `user.profile.avatar.url` without null checks.",
      language: 'typescript',
      filename: 'src/api/handlers/user.ts',
      code: `// What the agent built:
export async function getUser(req: Request) {
  const user = await db.users.findUnique({ where: { id: req.params.id } })
  return Response.json({
    name: user.name,           //  user might be null (not found)
    avatar: user.profile.url,  //  profile might be null
    teamName: user.team.name,  //  team might not be loaded
  })
}

// What production needs:
export async function getUser(req: Request) {
  const user = await db.users.findUnique({
    where: { id: req.params.id },
    include: { profile: true, team: true },
  })

  if (!user) {
    return Response.json({ error: 'User not found' }, { status: 404 })
  }

  return Response.json({
    name: user.name,
    avatar: user.profile?.url ?? null,
    teamName: user.team?.name ?? 'No team',
  })
}`,
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
      type: 'info',
      title: 'Error tracking tuned for agent-built code',
      body: "Standard error tracking tells you WHAT broke. For agent-built systems, you also need to know WHICH AGENT SESSION produced the code, so you can trace the bug back to the spec that caused it. The technique: tag deployments with agent metadata so Sentry groups errors by the spec version that produced them.",
    },
    {
      type: 'code-demo',
      title: 'Sentry configuration with agent traceability',
      body: "Add release tags that map to your agent sessions. When an error fires, you can immediately see: this code was produced by Agent 3 (payments), during fleet run #7, from spec version 2.1. Now you know exactly which spec to improve.",
      language: 'typescript',
      filename: 'src/lib/monitoring.ts',
      code: `import * as Sentry from '@sentry/react'

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,

  // Tag with deployment metadata
  release: process.env.COMMIT_SHA,

  // Custom tags for agent traceability
  initialScope: {
    tags: {
      // Which fleet run produced this code
      fleet_run: process.env.FLEET_RUN_ID || 'manual',
      // Deployment timestamp (correlate with agent sessions)
      deployed_at: new Date().toISOString(),
    },
  },

  // Capture unhandled promise rejections (Pattern 1)
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration({
      // Capture user session replay for error context
      maskAllText: false,
      blockAllMedia: false,
    }),
  ],

  // Sample 100% of errors, 10% of transactions
  tracesSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
})

// Helper: add agent context to manual error reports
export function reportAgentBug(error: Error, context: {
  component: string
  expectedBehavior: string
  actualBehavior: string
}) {
  Sentry.captureException(error, {
    tags: { bug_type: 'agent_introduced' },
    extra: context,
  })
}`,
    },
    {
      type: 'terminal',
      instruction: 'Install Sentry for your React + Node.js project:',
      expectedCommand: 'npm install @sentry/react @sentry/node',
      hint: 'Install both @sentry/react (frontend) and @sentry/node (backend)',
    },

    // === TRACING ERRORS TO AGENT SESSIONS ===
    {
      type: 'info',
      title: 'Tracing an error back to its source',
      body: "A Sentry alert fires: `TypeError: Cannot read property 'name' of undefined` in `src/payments/checkout.ts:47`. You need to answer: which agent wrote this, what spec were they following, and what was the spec missing? The trace path: error → commit SHA → git blame → worktree branch → spec file.",
    },
    {
      type: 'code-demo',
      title: 'The trace-back procedure',
      body: "This script automates tracing a production error back to the agent session that produced it. It uses git blame to find the commit, then maps the commit to a branch (worktree) and spec file.",
      language: 'bash',
      filename: 'scripts/trace-to-agent.sh',
      code: `#!/bin/bash
# Trace a production bug to its agent source
FILE=$1  # e.g., "src/payments/checkout.ts"
LINE=$2  # e.g., "47"

echo "=== Tracing $FILE:$LINE ==="

# 1. Find the commit that last modified this line
COMMIT=$(git blame -L "$LINE,$LINE" "$FILE" | awk '{print $1}')
echo "Commit: $COMMIT"

# 2. Find which branch introduced this commit
BRANCH=$(git branch --contains "$COMMIT" | grep -v main | head -1 | xargs)
echo "Branch: $BRANCH"

# 3. Get the commit message (should reference spec/task)
echo "Message: $(git log -1 --format='%s' "$COMMIT")"

# 4. Show the full context of the buggy code
echo ""
echo "=== Code context ==="
git show "$COMMIT" -- "$FILE" | head -50

# 5. Suggest spec improvement
echo ""
echo "=== Action ==="
echo "Update the spec for agent '$BRANCH' to prevent this pattern."
echo "Bug class: check the file for missing null checks, error states, or validation."`,
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
      type: 'info',
      title: 'Closing the loop: errors that improve specs',
      body: "Every production error represents a gap in your specification. The error tells you exactly what was missing. A null reference error means you didn't specify null handling. A timeout means you didn't specify retry logic. A crash on empty array means you didn't specify empty states. Track these patterns and add them to a 'spec requirements' checklist that every new spec must satisfy.",
    },
    {
      type: 'code-demo',
      title: 'Spec requirements derived from production errors',
      body: "This living document grows with every production incident. Before launching any agent, you check the spec against this list. Each rule exists because its absence caused a production bug. This is institutional memory for agent-directed development.",
      language: 'markdown',
      filename: 'specs/REQUIREMENTS.md',
      code: `# Spec Requirements Checklist
(Each rule added after a production incident)

## Data Handling
- [ ] All API responses specify behavior for: success, error, empty, null
- [ ] Optional/nullable fields are explicitly listed with defaults
- [ ] Array operations handle empty arrays (no .length on undefined)
- [ ] Date/time values specify timezone handling

## Error States
- [ ] Every data-fetching component has: loading, error, success, empty states
- [ ] API handlers return proper status codes (404, 422, 500)
- [ ] External service calls have timeout + retry configuration
- [ ] Rate limit handling is specified for third-party APIs

## Security
- [ ] Input validation on all user-provided data (query params, body, headers)
- [ ] Authentication check before data access
- [ ] No secrets/keys in client-side code
- [ ] CORS configuration specified explicitly

## Environment
- [ ] No hardcoded URLs (use env vars)
- [ ] Feature flags for gradual rollout
- [ ] Logging includes request ID for traceability`,
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
      type: 'info',
      title: 'What to monitor in agent-built systems',
      body: "Standard monitoring (uptime, latency, error rate) applies. But for agent-built systems, add these: (1) Error rate by file path — if one agent's code errors more than others, its spec was weak. (2) Unhandled rejection rate — agents frequently leave promise chains unhandled. (3) TypeScript errors caught at runtime — signals the agent defeated the type system.",
    },
    {
      type: 'code-demo',
      title: 'Vercel + Sentry monitoring patterns',
      body: "Combine Vercel's built-in analytics with Sentry for comprehensive monitoring of agent-built code. The custom error boundary catches React crashes and tags them for agent traceability.",
      language: 'typescript',
      filename: 'src/components/error-boundary.tsx',
      code: `import * as Sentry from '@sentry/react'
import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  componentName: string  // For tracing back to agent
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
    Sentry.captureException(error, {
      tags: {
        component: this.props.componentName,
        error_boundary: 'agent_code',
      },
      extra: {
        componentStack: errorInfo.componentStack,
      },
    })
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-4 border border-red-200 rounded bg-red-50">
          <p className="text-red-800">Something went wrong in {this.props.componentName}.</p>
          <button onClick={() => this.setState({ hasError: false, error: null })}>
            Retry
          </button>
        </div>
      )
    }
    return this.props.children
  }
}`,
    },
    {
      type: 'checkpoint',
      xp: 5,
      message: 'Your monitoring is tuned for agent-specific failure patterns.',
    },

    // === PREVENTING RECURRENCE ===
    {
      type: 'info',
      title: 'The verification step: catching bugs before deploy',
      body: "The best production bug is one that never reaches production. After an agent completes its work, run a verification pass specifically targeting known agent failure patterns. This isn't standard code review — it's a checklist tuned to what agents get wrong.",
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
      type: 'code-demo',
      title: 'Automated pre-deploy check script',
      body: "Run this before every merge to catch the most common agent patterns. It's fast (under 10 seconds) and catches issues that would become production bugs.",
      language: 'bash',
      filename: 'scripts/agent-code-check.sh',
      code: `#!/bin/bash
# Pre-deploy check for agent-introduced patterns
echo "=== Agent Code Quality Check ==="
ISSUES=0

# Check for console.log (agents leave debug logging)
LOGS=$(grep -r "console.log" src/ --include="*.ts" --include="*.tsx" -l | wc -l)
if [ "$LOGS" -gt 0 ]; then
  echo "[WARN] $LOGS files with console.log statements"
  ((ISSUES++))
fi

# Check for hardcoded localhost
LOCALHOST=$(grep -r "localhost" src/ --include="*.ts" --include="*.tsx" -l | wc -l)
if [ "$LOCALHOST" -gt 0 ]; then
  echo "[FAIL] $LOCALHOST files with hardcoded localhost"
  ((ISSUES++))
fi

# Check for TODO comments
TODOS=$(grep -r "TODO" src/ --include="*.ts" --include="*.tsx" | wc -l)
if [ "$TODOS" -gt 3 ]; then
  echo "[WARN] $TODOS TODO comments (agents leave aspirational TODOs)"
  ((ISSUES++))
fi

# Check for 'any' type usage
ANYS=$(grep -r ": any" src/ --include="*.ts" --include="*.tsx" | wc -l)
if [ "$ANYS" -gt 0 ]; then
  echo "[WARN] $ANYS uses of 'any' type (agent couldn't resolve types)"
  ((ISSUES++))
fi

# TypeScript strict check
echo ""
echo "Running TypeScript strict check..."
npx tsc --noEmit --strict 2>&1 | tail -5

echo ""
echo "=== $ISSUES issues found ==="
exit $ISSUES`,
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
