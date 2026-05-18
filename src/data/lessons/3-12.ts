import type { LessonContent } from './types'

const content: LessonContent = {
  lessonId: '3-12',
  steps: [
    // === INTRODUCTION ===
    {
      type: 'info',
      title: 'Keeping five AI agents working from the same playbook',
      body: "You have five agents building different parts of the same product. Each needs to understand the overall vision, the architecture decisions, the coding conventions, and how their piece connects to others. But context windows are finite, and dumping everything into every agent's prompt is wasteful and confusing. The art is knowing what context goes where — and keeping it synchronized as the codebase evolves during parallel work.",
    },
    {
      type: 'info',
      title: 'The three failure modes of bad context management',
      body: "Without deliberate context strategy, you get: (1) Inconsistency — agents make contradictory decisions because they're working from different assumptions. (2) Duplication — agents build the same utility function because they don't know it already exists. (3) Drift — context that was true when agents started becomes stale as other agents modify the codebase. All three are solvable with architecture.",
    },

    // === DIAGRAM 1: Context Architecture ===
    {
      type: 'interactive-diagram',
      title: 'Layered Context Architecture',
      body: "Context isn't one flat document — it's layered. Click through to see how each layer feeds into agent-specific specs.",
      diagram: {
        direction: 'TB',
        nodes: [
          { id: 'global', label: 'CLAUDE.md', sublabel: 'Global conventions', shape: 'rounded', highlight: true },
          { id: 'contracts', label: 'Interface Contracts', sublabel: 'Typed boundaries', shape: 'rect', highlight: true },
          { id: 'spec-auth', label: 'Spec: Auth', sublabel: 'Agent 1 only', shape: 'rect' },
          { id: 'spec-api', label: 'Spec: API', sublabel: 'Agent 2 only', shape: 'rect' },
          { id: 'spec-ui', label: 'Spec: UI', sublabel: 'Agent 3 only', shape: 'rect' },
          { id: 'spec-pay', label: 'Spec: Payments', sublabel: 'Agent 4 only', shape: 'rect' },
        ],
        edges: [
          { from: 'global', to: 'spec-auth', dashed: true },
          { from: 'global', to: 'spec-api', dashed: true },
          { from: 'global', to: 'spec-ui', dashed: true },
          { from: 'global', to: 'spec-pay', dashed: true },
          { from: 'contracts', to: 'spec-auth' },
          { from: 'contracts', to: 'spec-api' },
          { from: 'contracts', to: 'spec-ui' },
          { from: 'contracts', to: 'spec-pay' },
        ],
      },
      stages: [
        {
          highlightNodes: ['global'],
          highlightEdges: [],
          explanation: 'CLAUDE.md is the global layer. It contains universal rules every agent must follow: coding style, naming conventions, error handling patterns. Think of it as the engineering handbook.',
        },
        {
          highlightNodes: ['global', 'contracts'],
          highlightEdges: [],
          explanation: 'Interface contracts define the exact data shapes flowing between modules. They are written by the orchestrator and are read-only for all agents. This prevents cross-agent mismatches.',
        },
        {
          highlightNodes: ['global', 'contracts', 'spec-auth', 'spec-api', 'spec-ui', 'spec-pay'],
          highlightEdges: [{ from: 'global', to: 'spec-auth' }, { from: 'global', to: 'spec-api' }, { from: 'global', to: 'spec-ui' }, { from: 'global', to: 'spec-pay' }, { from: 'contracts', to: 'spec-auth' }, { from: 'contracts', to: 'spec-api' }, { from: 'contracts', to: 'spec-ui' }, { from: 'contracts', to: 'spec-pay' }],
          explanation: 'Each agent reads the global layer + contracts + its own module spec. The payments agent never reads the auth spec. No more, no less. This focused context reduces token waste and confusion.',
        },
      ],
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'Context is layered: global, contracts, per-module specs.',
    },

    // === FLAT VS LAYERED COMPARE ===
    {
      type: 'compare',
      hint: 'Look at the key differences between the two approaches.',
      title: 'Flat CLAUDE.md vs layered architecture',
      body: 'As your fleet grows, a single CLAUDE.md becomes a bottleneck. Layered context solves this.',
      question: 'Which approach scales to 5+ agents working on different modules?',
      correctSide: 'right',
      left: {
        label: 'Flat (one file)',
        content: '# CLAUDE.md (root)\n\n## All conventions\n- Auth: use bcrypt...\n- Payments: use Stripe...\n- API: use REST...\n- UI: use Tailwind...\n- Tests: use Vitest...\n\n(500+ lines, every agent reads all)',
        language: 'markdown',
      },
      right: {
        label: 'Layered (root + modules)',
        content: '# CLAUDE.md (root — shared rules)\n- TypeScript strict, camelCase\n- Error handling: throw AppError\n\n# payments/CLAUDE.md\n- Use Stripe SDK, webhook patterns\n- Idempotent fulfillment required\n\n# auth/CLAUDE.md  \n- Supabase Auth, RLS policies\n- Session: httpOnly cookies',
        language: 'markdown',
      },
      explanation: 'Layered context means each agent reads the root rules (shared) plus only its module rules (specific). The payments agent never reads auth conventions. This saves tokens and reduces confusion.',
    },

    // === WHAT GOES WHERE ===
    {
      type: 'multiple-choice',
      hint: 'Read each option carefully — one fits the context best.',
      question: 'What type of content belongs in CLAUDE.md (the global context layer)?',
      options: [
        'Feature-specific business logic and endpoint definitions',
        'Universal rules: coding style, naming conventions, error handling, forbidden patterns',
        'Interface contracts and data shapes between modules',
        'Per-agent task assignments and file ownership boundaries',
      ],
      correctIndex: 1,
      explanation: "CLAUDE.md is for decisions that EVERY agent must respect regardless of what they're building. Coding style, naming conventions, directory structure, testing patterns, error handling philosophy, and forbidden patterns. Think of it as the engineering team's handbook — universal rules that create consistency across all agent output.",
    },
    {
      type: 'code-fill',
      hint: 'Fill in values that match the pattern shown above.',
      instruction: 'Complete this CLAUDE.md for a multi-agent project. Fill in the conventions that ensure consistency across all agents.',
      language: 'markdown',
      filename: 'CLAUDE.md',
      template: `# Project: Team Dashboard

## Architecture
- Framework: Next.js 14 (App Router)
- Database: Prisma + PostgreSQL
- Auth: NextAuth.js with JWT sessions
- State: React Query for server state, Zustand for client state

## Conventions
- File naming: {{file_naming}}
- Exports: Named exports only (no default exports except pages)
- Error handling: All async functions return {{error_pattern}} pattern
- Testing: Colocated tests (component.test.tsx next to component.tsx)

## Patterns (ALL agents must follow)
- API responses: { data: T | null, error: string | null }
- Components: Loading skeleton → Error state → Empty state → Data state
- Database: {{db_write_rule}}
- Validation: Zod schemas for all input boundaries

## Forbidden
- No \`any\` types
- No default exports (except page.tsx and layout.tsx)
- No console.log in committed code
- No hardcoded URLs or secrets
- No modifying files outside your assigned directory`,
      blanks: [
        { id: 'file_naming', answer: 'kebab-case for files, PascalCase for components', alternatives: ['kebab-case for files, PascalCase for components', 'kebab-case files, PascalCase components'], placeholder: 'naming convention for files and components', hint: 'Two conventions: one for file names (dashes), one for component names (capitalized)' },
        { id: 'error_pattern', answer: 'Result<T, Error>', alternatives: ['Result<T, Error>', 'Result<T,Error>', 'Result type'], placeholder: 'return type for async functions', hint: 'A type that wraps either a success value T or an Error' },
        { id: 'db_write_rule', answer: 'Always use transactions for multi-table writes', alternatives: ['Always use transactions for multi-table writes', 'Use transactions for multi-table writes', 'transactions for multi-table writes'], placeholder: 'rule for database writes across tables', hint: 'What ensures atomicity when writing to multiple tables at once?' },
      ],
      explanation: "This is what every agent in the fleet reads. Notice it's about HOW to write code, not WHAT to build. It ensures that regardless of which agent writes which feature, the output looks like one person wrote it.",
    },
    {
      type: 'multiple-choice',
      hint: 'Eliminate the options that only partially fit.',
      question: 'Which of these belongs in CLAUDE.md vs a per-agent spec?',
      options: [
        'CLAUDE.md: "Use Zod for validation" | Spec: "Validate email, password min 8 chars"',
        'CLAUDE.md: "Build the login form" | Spec: "Use React Query"',
        'CLAUDE.md: "The auth flow has 3 steps" | Spec: "Use kebab-case files"',
        'CLAUDE.md: "Payment amounts are in cents" | Spec: "All errors return 500"',
      ],
      correctIndex: 0,
      explanation: "CLAUDE.md contains universal rules (use Zod for ALL validation). The spec contains specific requirements (WHAT to validate for this particular agent's task). The pattern is: CLAUDE.md says HOW, specs say WHAT.",
    },

    // === INTERFACE CONTRACTS ===
    {
      type: 'multiple-choice',
      hint: 'Focus on the primary goal, not secondary benefits.',
      question: 'What happens when agents build against different assumptions about data shapes (no shared contracts)?',
      options: [
        'Agents automatically negotiate a shared schema at runtime',
        'Type mismatches surface at integration time — Agent A sends { name } but Agent B expects { firstName, lastName }',
        'The orchestrator catches mismatches during monitoring',
        'TypeScript prevents all cross-agent type mismatches automatically',
      ],
      correctIndex: 1,
      explanation: "Interface contracts are the most critical piece of multi-agent context. They define the exact shape of data flowing between modules built by different agents. Without them, Agent A builds a user object with `{ name: string }` and Agent B expects `{ firstName: string, lastName: string }` — and you discover the mismatch at integration time.",
    },
    {
      type: 'code-fill',
      hint: 'Use the exact syntax from the lesson examples.',
      instruction: 'Complete this interface contract file. Fill in the critical type definitions that prevent cross-agent mismatches.',
      language: 'typescript',
      filename: 'src/contracts/index.ts',
      template: `/**
 * INTERFACE CONTRACTS
 * Written by orchestrator. Read-only for all agents.
 * Defines every cross-module boundary.
 */

// === Auth → All Modules ===
export interface AuthUser {
  id: string
  email: string
  name: string
  role: {{auth_role_type}}
  avatarUrl: string | null
}

export interface AuthSession {
  user: AuthUser
  accessToken: string
  expiresAt: number
}

// === API → UI ===
export interface ApiResponse<T> {
  data: T | null
  error: {{error_shape}} | null
  meta?: { page: number; total: number }
}

// === Dashboard Stats (API produces, UI consumes) ===
export interface DashboardStats {
  totalProjects: number
  activeMembers: number
  velocityTrend: {{velocity_type}}
  completionRate: number   // 0-1
}`,
      blanks: [
        { id: 'auth_role_type', answer: "'admin' | 'member' | 'viewer'", alternatives: ["'admin' | 'member' | 'viewer'", '"admin" | "member" | "viewer"'], placeholder: 'union type for user roles', hint: 'A string literal union with three role levels' },
        { id: 'error_shape', answer: '{ code: string; message: string }', alternatives: ['{ code: string; message: string }', '{code: string; message: string}'], placeholder: 'error object shape', hint: 'An object with a code and a human-readable message, both strings' },
        { id: 'velocity_type', answer: 'number[]', alternatives: ['number[]', 'Array<number>'], placeholder: 'type for velocity trend data', hint: 'An array of numbers representing the last 7 days of velocity' },
      ],
      explanation: "This file is written by YOU (the orchestrator) before any agent starts. Every agent imports from it. NO AGENT may modify it. It defines every boundary between modules — the API response shapes, the component props, the function signatures that cross module boundaries.",
    },
    {
      type: 'code-input',
      instruction: 'The UI agent needs to display a project card. The API agent needs to produce the data. Write the TypeScript interface for a Project that both agents will build against:',
      placeholder: 'export interface Project { ... }',
      answer: 'export interface Project { id: string; name: string; status: "active" | "completed" | "archived"; memberCount: number; updatedAt: string }',
      hint: 'Include id, name, status (with literal union), memberCount, and updatedAt (ISO string)',
    },
    {
      type: 'checkpoint',
      xp: 5,
      message: 'You can write interface contracts that prevent cross-agent mismatches.',
    },

    // === CODE-FILL: Module-specific CLAUDE.md ===
    {
      type: 'code-fill',
      hint: 'Each blank follows the conventions demonstrated earlier.',
      instruction: 'Complete this module-specific CLAUDE.md for a payments agent. Fill in the Stripe patterns, idempotency rule, and webhook handling.',
      language: 'markdown',
      filename: 'payments/CLAUDE.md',
      template: `# Payments Module Context

## SDK
- Use {{sdk_name}} for all payment operations
- Never store raw card numbers — use tokenized payment methods

## Idempotency
- Every charge/refund MUST include {{idempotency_rule}}
- Retries are safe because the key prevents duplicate charges

## Webhooks
- Verify webhook signatures using {{webhook_verify}}
- Process events idempotently (check if already handled before acting)
- Return 200 immediately, process async in background`,
      blanks: [
        { id: 'sdk_name', answer: 'Stripe SDK', alternatives: ['Stripe SDK', 'stripe', '@stripe/stripe-js', 'Stripe'], placeholder: 'which payment SDK?', hint: 'The dominant payment processing SDK for web apps' },
        { id: 'idempotency_rule', answer: 'an idempotency key', alternatives: ['an idempotency key', 'idempotency key', 'Idempotency-Key header', 'a unique idempotency key'], placeholder: 'what prevents duplicate charges?', hint: 'A unique key sent with each request so retries do not create duplicate charges' },
        { id: 'webhook_verify', answer: 'stripe.webhooks.constructEvent', alternatives: ['stripe.webhooks.constructEvent', 'constructEvent', 'Stripe webhook signature verification', 'the webhook signing secret'], placeholder: 'how to verify webhook authenticity?', hint: 'The Stripe SDK method that verifies the webhook signature' },
      ],
      explanation: 'Module-specific context gives the payments agent exactly what it needs: SDK choice, idempotency patterns, and webhook handling. The auth agent never sees this — it has its own module context with Supabase Auth patterns.',
    },

    // === PER-MODULE SPECS ===
    {
      type: 'multiple-choice',
      hint: 'Think about which option is most specific to this concept.',
      question: 'What should a per-module spec contain so that an agent can complete its task without asking questions?',
      options: [
        'Just the files to create — the agent can figure out the logic from CLAUDE.md',
        'The exact files to create, business logic details, edge cases, and how to import from contracts',
        'A copy of the full CLAUDE.md plus the contracts file',
        'Only the interface contracts relevant to this module',
      ],
      correctIndex: 1,
      explanation: "Each agent gets a spec document that's specific to its task. This includes: the exact files to create, the business logic details, edge cases, and how to import from the contracts file. The spec should be self-contained — an agent reading CLAUDE.md + contracts + its spec should have everything needed to complete the task without asking questions.",
    },
    {
      type: 'code-fill',
      hint: 'Look at the surrounding code for context clues.',
      instruction: 'Complete this per-module spec for the API agent. Fill in the return types, auth rules, and database patterns.',
      language: 'markdown',
      filename: 'specs/api-agent.md',
      template: `# API Agent Spec

## Scope
Build REST API endpoints in \`src/api/\`

## Endpoints

### GET /api/dashboard/stats
- Returns: {{stats_return_type}} (from contracts)
- Auth: Required (validate session token)
- Cache: 60 seconds (stale-while-revalidate)

### GET /api/activity?page=1&limit=20
- Returns: \`ApiResponse<ActivityItem[]>\` with meta.page, meta.total
- Auth: Required
- Filter: Only show activity from user's team
- Sort: Most recent first

### GET /api/team/members
- Returns: \`ApiResponse<TeamMember[]>\`
- Auth: Required, {{members_auth_rule}}
- Include: contributionCount (computed from last 30 days)

## Database Access
- Use Prisma client from \`src/lib/db.ts\`
- All queries filtered by {{query_filter}} from session
- Use \`select\` to only fetch needed fields (not select *)

## Error Handling
- 401 for missing/invalid auth
- 403 for insufficient role
- 404 for resource not found
- 500 with generic message (log full error server-side)`,
      blanks: [
        { id: 'stats_return_type', answer: 'ApiResponse<DashboardStats>', alternatives: ['ApiResponse<DashboardStats>', '`ApiResponse<DashboardStats>`'], placeholder: 'typed return for stats endpoint', hint: 'Use the generic ApiResponse wrapper with the DashboardStats contract type' },
        { id: 'members_auth_rule', answer: 'admin or member role', alternatives: ['admin or member role', 'admin or member', 'role: admin | member'], placeholder: 'which roles can access?', hint: 'Viewers should not be able to list team members — only two roles can' },
        { id: 'query_filter', answer: 'teamId', alternatives: ['teamId', 'team ID', 'teamId from session'], placeholder: 'what scopes all queries?', hint: 'Every database query must be scoped to the current user\'s team' },
      ],
      explanation: "Notice how this spec references the contracts for return types but adds API-specific details: endpoints, query parameters, pagination logic. The auth agent doesn't need to know about pagination. The UI agent doesn't need to know about database queries. Separation of concerns.",
    },

    // === KEEPING CONTEXT IN SYNC ===
    {
      type: 'multiple-choice',
      hint: 'Consider what the lesson content emphasized.',
      question: 'Agent 1 adds a `teamId` field to the user session while Agent 3 builds UI against the original contracts. What is this called?',
      options: [
        'A merge conflict — Git will catch and flag it automatically',
        'Context drift — the UI agent is building against stale assumptions',
        'A type error — TypeScript will prevent compilation',
        'Normal parallel development — no intervention needed',
      ],
      correctIndex: 1,
      explanation: "This is context drift: Agent 1 builds the auth module and adds a new field to the user session, but Agent 3 is building UI components against the original contracts that don't include `teamId`. By the time you merge, the UI agent's code is built against stale context. Git won't catch semantic drift — only structural conflicts.",
    },
    {
      type: 'interactive-diagram',
      title: 'Context Drift Prevention',
      body: 'Click through to see the freeze-pause-update-resume protocol for handling mid-flight contract changes.',
      diagram: {
        direction: 'LR',
        nodes: [
          { id: 'freeze', label: 'Freeze Contracts', sublabel: 'Before launch', shape: 'rounded', highlight: true },
          { id: 'launch', label: 'Launch Fleet', sublabel: '4 agents', shape: 'rect' },
          { id: 'need', label: 'Need Change?', shape: 'diamond' },
          { id: 'pause', label: 'Pause Affected', sublabel: 'Agents', shape: 'rect' },
          { id: 'update', label: 'Update Contract', sublabel: 'Orchestrator only', shape: 'rect' },
          { id: 'resume', label: 'Resume', sublabel: 'Re-brief agents', shape: 'pill', highlight: true },
        ],
        edges: [
          { from: 'freeze', to: 'launch' },
          { from: 'launch', to: 'need' },
          { from: 'need', to: 'pause', label: 'yes' },
          { from: 'pause', to: 'update' },
          { from: 'update', to: 'resume' },
          { from: 'need', to: 'launch', label: 'no', dashed: true },
        ],
      },
      stages: [
        {
          highlightNodes: ['freeze'],
          highlightEdges: [],
          explanation: 'Before launching any agent, contracts are frozen. Every agent starts with the same shared truth. This is the critical first step.',
        },
        {
          highlightNodes: ['launch'],
          highlightEdges: [{ from: 'freeze', to: 'launch' }],
          explanation: 'The fleet launches. All 4 agents build simultaneously against the frozen contracts. No agent modifies shared context.',
        },
        {
          highlightNodes: ['need', 'pause', 'update', 'resume'],
          highlightEdges: [{ from: 'need', to: 'pause' }, { from: 'pause', to: 'update' }, { from: 'update', to: 'resume' }],
          explanation: 'Mid-flight change needed? Pause affected agents, update the contract (orchestrator only), re-brief paused agents with the change, then resume. Never let agents discover changes on their own.',
        },
      ],
    },
    {
      type: 'multiple-choice',
      hint: 'One option stands out when you think about the core purpose.',
      question: 'Mid-flight, you realize the DashboardStats interface needs a new field (overdueCount). What do you do?',
      options: [
        'Add it to contracts and let agents discover it naturally',
        'Message each agent to update their code for the new field',
        'Pause the API and UI agents, update the contract, re-brief both with the change, then resume',
        'Wait until all agents are done, then add it as a follow-up task',
      ],
      correctIndex: 2,
      explanation: "Option C is correct because: the API agent needs to produce the new field, the UI agent needs to consume it, and both need to know about the change simultaneously. Pausing ensures neither builds against stale context. Option D (defer) is also valid if the field isn't critical — but C is the correct mid-flight procedure.",
    },
    {
      type: 'checkpoint',
      xp: 5,
      message: 'You know how to handle context changes without breaking running agents.',
    },

    // === AVOIDING DUPLICATION ===
    {
      type: 'multiple-choice',
      hint: 'Read each option carefully — one fits the context best.',
      question: 'Three agents each create their own `formatDate()` function in their module. What caused this duplication?',
      options: [
        'The agents are not smart enough to reuse code',
        'No shared utility library was defined upfront, and agents were not told where to find common helpers',
        'The agents deliberately chose different date formatting strategies',
        'TypeScript does not support shared modules across worktrees',
      ],
      correctIndex: 1,
      explanation: "Without clear boundaries, agents independently create their own utility functions, validation helpers, and type guards. You end up with `src/auth/utils.ts`, `src/api/helpers.ts`, and `src/payments/utils.ts` all containing slightly different implementations of the same logic. The fix: define shared utilities upfront and tell agents where to find them.",
    },
    {
      type: 'code-fill',
      hint: 'The answer matches the API or syntax just explained.',
      instruction: 'Complete this shared utilities barrel file. Fill in the imports that prevent agents from duplicating common logic.',
      language: 'typescript',
      filename: 'src/lib/index.ts',
      template: `/**
 * SHARED UTILITIES
 * Pre-built by orchestrator. Agents import, never modify.
 * If you need something not here, build it in your own module.
 */

// Validation helpers
export { z } from '{{validation_lib}}'
export { validateEmail, validatePassword } from './validation'

// API helpers
export { createApiResponse, createErrorResponse } from './api-helpers'
export type { ApiResponse } from '@/contracts'

// Date formatting (prevents 5 agents each writing their own)
export { {{date_exports}} } from './dates'

// Error handling
export { AppError, isAppError, handleError } from './errors'

// Auth helpers
export { getSession, requireAuth, {{role_helper}} } from './auth'`,
      blanks: [
        { id: 'validation_lib', answer: 'zod', alternatives: ['zod', 'Zod'], placeholder: 'validation library', hint: 'The TypeScript-first schema validation library mentioned in CLAUDE.md' },
        { id: 'date_exports', answer: 'formatRelativeTime, formatISO, parseISO', alternatives: ['formatRelativeTime, formatISO, parseISO'], placeholder: 'date utility functions', hint: 'Three functions: one for "2 hours ago" style, one to format ISO, one to parse ISO' },
        { id: 'role_helper', answer: 'requireRole', alternatives: ['requireRole', 'checkRole'], placeholder: 'role authorization helper', hint: 'A function that checks if the user has a specific role (admin, member, viewer)' },
      ],
      explanation: "Create a shared lib directory with common utilities before agents start. Reference it in every spec. Agents IMPORT from it but never MODIFY it. If an agent needs a utility that doesn't exist, they add it to their own module — you can extract it to shared later.",
    },
    {
      type: 'code-fill',
      hint: 'Fill in values that match the pattern shown above.',
      instruction: 'Complete this shared code reference section for a per-module spec. Fill in the specific utilities agents must import instead of recreating.',
      language: 'markdown',
      filename: 'specs/ui-agent.md',
      template: `## Shared Code (DO NOT DUPLICATE)

Import these from \`src/lib/\` — do NOT create your own versions:
- Date formatting: \`{{date_function}}\` (for "2 hours ago" displays)
- API responses: \`createApiResponse\` (standardized shape)
- Validation: \`z\` (Zod) + \`validateEmail\`, \`validatePassword\`
- Error handling: \`{{error_class}}\`, \`handleError\`
- Auth: \`getSession\`, \`requireAuth\`

If you need a utility that doesn't exist in src/lib/, create it in
{{fallback_location}} and note it for post-merge extraction.`,
      blanks: [
        { id: 'date_function', answer: 'formatRelativeTime', alternatives: ['formatRelativeTime'], placeholder: 'relative time formatter', hint: 'The function that turns timestamps into "2 hours ago" style strings' },
        { id: 'error_class', answer: 'AppError', alternatives: ['AppError'], placeholder: 'custom error class', hint: 'The project-wide error class defined in the shared lib' },
        { id: 'fallback_location', answer: 'YOUR module (src/ui/utils.ts)', alternatives: ['YOUR module (src/ui/utils.ts)', 'your own module', 'src/ui/utils.ts'], placeholder: 'where to put new utilities', hint: 'If the shared lib does not have what you need, create it in your own module directory' },
      ],
      explanation: "In every per-module spec, explicitly point agents to the shared lib. This single line prevents the most common duplication pattern: agents writing their own date formatters, validation functions, and API response builders.",
    },
    {
      type: 'multiple-choice',
      hint: 'Eliminate the options that only partially fit.',
      question: 'The API agent needs a `slugify` function that doesn\'t exist in shared lib. What should it do?',
      options: [
        'Add slugify to src/lib/index.ts since other agents might need it',
        'Create it in src/api/utils.ts (its own module) and note it for later extraction',
        'Import a third-party slugify package',
        'Ask the orchestrator to add it to the shared lib',
      ],
      correctIndex: 1,
      explanation: "Agents don't modify shared resources. The agent creates the utility in its own domain. After the fleet completes, the orchestrator reviews and extracts genuinely shared utilities. This prevents mid-flight conflicts while still allowing agents to build what they need.",
    },

    // === ADVANCED: CONTEXT BUDGET ===
    {
      type: 'multiple-choice',
      hint: 'Focus on the primary goal, not secondary benefits.',
      question: 'An agent receives the full 500-line CLAUDE.md, all 12 interface contracts, and a 200-line spec. What is wrong with this approach?',
      options: [
        'Nothing — more context always means better output',
        'The agent has too much unfocused context; it should only receive the relevant subset of contracts and a short CLAUDE.md',
        'The spec should be longer to compensate for the large CLAUDE.md',
        'Agents cannot process more than 100 lines of context',
      ],
      correctIndex: 1,
      explanation: "Agents perform better with focused context. Each agent should receive: global conventions (short), the contracts it depends on (relevant subset), and its own spec (detailed). If an agent doesn't need to know about payments, don't tell it about payments. Less noise, better output.",
    },
    {
      type: 'checklist',
      title: 'Context budget per agent',
      items: [
        'CLAUDE.md: Under 100 lines of universal rules (not feature details)',
        'Contracts: Only the interfaces THIS agent imports/produces',
        'Spec: 50-150 lines of task-specific requirements',
        'Shared lib reference: 5-10 lines pointing to available utilities',
        'Forbidden list: 3-5 explicit "do NOT" constraints',
        'Total context injection: Under 300 lines per agent (focused, not exhaustive)',
      ],
    },
    {
      type: 'checkpoint',
      xp: 5,
      message: 'Focused context beats comprehensive context. Less noise, better output.',
    },

    // === HANDS-ON EXERCISE ===
    {
      type: 'info',
      title: 'Exercise: Design a context architecture',
      body: "You're launching 4 agents to build a team dashboard. The modules: Authentication (login, roles, sessions), API (data endpoints), UI (React components), and Real-time (WebSocket events). Design the context each agent receives.",
    },
    {
      type: 'terminal',
      instruction: 'Create the directory structure for your context architecture:',
      expectedCommand: 'mkdir -p specs src/contracts src/lib',
      hint: 'Create specs/, src/contracts/, and src/lib/ directories',
      platforms: {
        windows: {
          expectedCommand: 'mkdir specs, src\\contracts, src\\lib',
        },
      },
    },
    {
      type: 'code-input',
      instruction: 'The real-time agent needs to push activity events to the UI. The UI agent needs to render them. Write the contract type for a WebSocket message that carries an ActivityItem:',
      placeholder: 'export interface WsMessage { ... }',
      answer: 'export interface WsMessage { type: "activity"; payload: ActivityItem; timestamp: string }',
      hint: 'Include a type discriminator, the ActivityItem payload, and a timestamp',
    },
    {
      type: 'order',
      hint: 'Consider what depends on what — prerequisites first.',
      instruction: 'Order these steps for setting up multi-agent context:',
      items: [
        'Write CLAUDE.md with universal conventions',
        'Define interface contracts (typed boundaries)',
        'Create shared utilities in src/lib/',
        'Write per-module specs referencing contracts and lib',
        'Launch agents with: CLAUDE.md + relevant contracts + their spec',
      ],
      correctOrder: [0, 1, 2, 3, 4],
    },

    // === PUTTING IT TOGETHER ===
    {
      type: 'diagram',
      title: 'Complete Context Architecture',
      body: "The full picture. The orchestrator creates and maintains all context layers. Agents read from global + contracts + their spec. No agent writes to shared resources. Mid-flight changes go through the orchestrator with pause/update/resume protocol.",
      diagram: {
        direction: 'TB',
        nodes: [
          { id: 'orch', label: 'Orchestrator', sublabel: 'Creates & maintains', shape: 'pill', highlight: true },
          { id: 'claude', label: 'CLAUDE.md', sublabel: 'Universal rules', shape: 'rounded' },
          { id: 'contracts', label: 'Contracts', sublabel: 'Typed boundaries', shape: 'rounded' },
          { id: 'lib', label: 'Shared Lib', sublabel: 'Common utils', shape: 'rounded' },
          { id: 'specs', label: 'Per-Agent Specs', sublabel: '1 per agent', shape: 'rect' },
          { id: 'agents', label: 'Agent Fleet', sublabel: 'Reads only', shape: 'rect', highlight: true },
        ],
        edges: [
          { from: 'orch', to: 'claude', label: 'writes' },
          { from: 'orch', to: 'contracts', label: 'writes' },
          { from: 'orch', to: 'lib', label: 'writes' },
          { from: 'orch', to: 'specs', label: 'writes' },
          { from: 'claude', to: 'agents', dashed: true },
          { from: 'contracts', to: 'agents', dashed: true },
          { from: 'specs', to: 'agents', dashed: true },
        ],
      },
    },
    {
      type: 'checklist',
      title: 'Shared context management mastery',
      items: [
        'I layer context: global (CLAUDE.md) → contracts → per-module specs',
        'I write interface contracts BEFORE launching agents',
        'I keep contracts frozen during fleet execution',
        'I use the pause/update/resume protocol for mid-flight changes',
        'I prevent duplication with a shared lib + explicit references in specs',
        'I budget context: under 300 lines per agent (focused, not exhaustive)',
        'I separate HOW (CLAUDE.md) from WHAT (specs) from SHAPE (contracts)',
        'Only the orchestrator writes to shared resources — agents read only',
      ],
    },
    {
      type: 'checkpoint',
      xp: 7,
      message: 'Shared context mastered! Multiple AI agents can build one coherent product.',
    },
  ],
}

export default content
