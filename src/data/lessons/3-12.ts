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
      type: 'diagram',
      title: 'Layered Context Architecture',
      body: "Context isn't one flat document — it's layered. Global context (CLAUDE.md) applies to all agents. Module specs apply to one agent. Interface contracts define boundaries between agents. Each agent reads the global layer + its own module spec + the contracts it depends on. No more, no less.",
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
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'Context is layered: global, contracts, per-module specs.',
    },

    // === WHAT GOES WHERE ===
    {
      type: 'info',
      title: 'What goes in CLAUDE.md (global context)',
      body: "CLAUDE.md is for decisions that EVERY agent must respect regardless of what they're building. Coding style, naming conventions, directory structure, testing patterns, error handling philosophy, and forbidden patterns. Think of it as the engineering team's handbook — universal rules that create consistency across all agent output.",
    },
    {
      type: 'code-demo',
      title: 'CLAUDE.md: global conventions for multi-agent work',
      body: "This is what every agent in the fleet reads. Notice it's about HOW to write code, not WHAT to build. It ensures that regardless of which agent writes which feature, the output looks like one person wrote it.",
      language: 'markdown',
      filename: 'CLAUDE.md',
      code: `# Project: Team Dashboard

## Architecture
- Framework: Next.js 14 (App Router)
- Database: Prisma + PostgreSQL
- Auth: NextAuth.js with JWT sessions
- State: React Query for server state, Zustand for client state

## Conventions
- File naming: kebab-case for files, PascalCase for components
- Exports: Named exports only (no default exports except pages)
- Error handling: All async functions return Result<T, Error> pattern
- Testing: Colocated tests (component.test.tsx next to component.tsx)

## Patterns (ALL agents must follow)
- API responses: { data: T | null, error: string | null }
- Components: Loading skeleton → Error state → Empty state → Data state
- Database: Always use transactions for multi-table writes
- Validation: Zod schemas for all input boundaries

## Forbidden
- No \`any\` types
- No default exports (except page.tsx and layout.tsx)
- No console.log in committed code
- No hardcoded URLs or secrets
- No modifying files outside your assigned directory`,
    },
    {
      type: 'multiple-choice',
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
      type: 'info',
      title: 'Interface contracts: typed boundaries between agents',
      body: "Interface contracts are the most critical piece of multi-agent context. They define the exact shape of data flowing between modules built by different agents. Without them, Agent A builds a user object with `{ name: string }` and Agent B expects `{ firstName: string, lastName: string }` — and you discover the mismatch at integration time.",
    },
    {
      type: 'code-demo',
      title: 'Interface contract file',
      body: "This file is written by YOU (the orchestrator) before any agent starts. Every agent imports from it. NO AGENT may modify it. It defines every boundary between modules — the API response shapes, the component props, the function signatures that cross module boundaries.",
      language: 'typescript',
      filename: 'src/contracts/index.ts',
      code: `/**
 * INTERFACE CONTRACTS
 * Written by orchestrator. Read-only for all agents.
 * Defines every cross-module boundary.
 */

// === Auth → All Modules ===
export interface AuthUser {
  id: string
  email: string
  name: string
  role: 'admin' | 'member' | 'viewer'
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
  error: { code: string; message: string } | null
  meta?: { page: number; total: number }
}

// === Dashboard Stats (API produces, UI consumes) ===
export interface DashboardStats {
  totalProjects: number
  activeMembers: number
  velocityTrend: number[]  // last 7 days
  completionRate: number   // 0-1
}

// === Activity Feed (API produces, UI consumes) ===
export interface ActivityItem {
  id: string
  userId: string
  action: 'created' | 'updated' | 'completed' | 'commented'
  target: string
  timestamp: string  // ISO 8601
}

// === Team Member (API produces, UI consumes) ===
export interface TeamMember {
  id: string
  name: string
  email: string
  role: AuthUser['role']
  avatarUrl: string | null
  contributionCount: number
  lastActiveAt: string  // ISO 8601
}`,
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

    // === PER-MODULE SPECS ===
    {
      type: 'info',
      title: 'Per-module specs: what only one agent needs to know',
      body: "Each agent gets a spec document that's specific to its task. This includes: the exact files to create, the business logic details, edge cases, and how to import from the contracts file. The spec should be self-contained — an agent reading CLAUDE.md + contracts + its spec should have everything needed to complete the task without asking questions.",
    },
    {
      type: 'code-demo',
      title: 'Per-module spec example: API agent',
      body: "Notice how this spec references the contracts for return types but adds API-specific details: endpoints, query parameters, pagination logic. The auth agent doesn't need to know about pagination. The UI agent doesn't need to know about database queries. Separation of concerns.",
      language: 'markdown',
      filename: 'specs/api-agent.md',
      code: `# API Agent Spec

## Scope
Build REST API endpoints in \`src/api/\`

## Endpoints

### GET /api/dashboard/stats
- Returns: \`ApiResponse<DashboardStats>\` (from contracts)
- Auth: Required (validate session token)
- Cache: 60 seconds (stale-while-revalidate)

### GET /api/activity?page=1&limit=20
- Returns: \`ApiResponse<ActivityItem[]>\` with meta.page, meta.total
- Auth: Required
- Filter: Only show activity from user's team
- Sort: Most recent first

### GET /api/team/members
- Returns: \`ApiResponse<TeamMember[]>\`
- Auth: Required, admin or member role
- Include: contributionCount (computed from last 30 days)

## Database Access
- Use Prisma client from \`src/lib/db.ts\`
- All queries filtered by teamId from session
- Use \`select\` to only fetch needed fields (not select *)

## Error Handling
- 401 for missing/invalid auth
- 403 for insufficient role
- 404 for resource not found
- 500 with generic message (log full error server-side)`,
    },

    // === KEEPING CONTEXT IN SYNC ===
    {
      type: 'info',
      title: 'The drift problem: context goes stale during parallel work',
      body: "Here's the tricky part. Agent 1 builds the auth module and adds a new field to the user session (e.g., `teamId`). Meanwhile, Agent 3 is building UI components against the original contracts that don't include `teamId`. By the time you merge, the UI agent's code is built against stale context. How do you prevent this?",
    },
    {
      type: 'diagram',
      title: 'Context Drift Prevention',
      body: "The solution: contracts are frozen at fleet launch. If you need to change a contract mid-flight, you pause affected agents, update the contract, and re-brief them. The orchestrator is the only entity that modifies shared context.",
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
    },
    {
      type: 'multiple-choice',
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
      type: 'info',
      title: 'Preventing duplicate code across agents',
      body: "Without clear boundaries, agents independently create their own utility functions, validation helpers, and type guards. You end up with `src/auth/utils.ts`, `src/api/helpers.ts`, and `src/payments/utils.ts` all containing slightly different implementations of the same logic. The fix: define shared utilities upfront and tell agents where to find them.",
    },
    {
      type: 'code-demo',
      title: 'Shared utilities strategy',
      body: "Create a shared lib directory with common utilities before agents start. Reference it in every spec. Agents IMPORT from it but never MODIFY it. If an agent needs a utility that doesn't exist, they add it to their own module — you can extract it to shared later.",
      language: 'typescript',
      filename: 'src/lib/index.ts',
      code: `/**
 * SHARED UTILITIES
 * Pre-built by orchestrator. Agents import, never modify.
 * If you need something not here, build it in your own module.
 */

// Validation helpers
export { z } from 'zod'
export { validateEmail, validatePassword } from './validation'

// API helpers
export { createApiResponse, createErrorResponse } from './api-helpers'
export type { ApiResponse } from '@/contracts'

// Date formatting (prevents 5 agents each writing their own)
export { formatRelativeTime, formatISO, parseISO } from './dates'

// Error handling
export { AppError, isAppError, handleError } from './errors'

// Auth helpers
export { getSession, requireAuth, requireRole } from './auth'`,
    },
    {
      type: 'code-demo',
      title: 'Spec reference to shared utilities',
      body: "In every per-module spec, explicitly point agents to the shared lib. This single line prevents the most common duplication pattern: agents writing their own date formatters, validation functions, and API response builders.",
      language: 'markdown',
      filename: 'specs/ui-agent.md',
      code: `## Shared Code (DO NOT DUPLICATE)

Import these from \`src/lib/\` — do NOT create your own versions:
- Date formatting: \`formatRelativeTime\` (for "2 hours ago" displays)
- API responses: \`createApiResponse\` (standardized shape)
- Validation: \`z\` (Zod) + \`validateEmail\`, \`validatePassword\`
- Error handling: \`AppError\`, \`handleError\`
- Auth: \`getSession\`, \`requireAuth\`

If you need a utility that doesn't exist in src/lib/, create it in
YOUR module (src/ui/utils.ts) and note it for post-merge extraction.`,
    },
    {
      type: 'multiple-choice',
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
      type: 'info',
      title: 'Context budget: less is more',
      body: "A common mistake: dumping the entire CLAUDE.md, all contracts, and a 500-line spec into every agent. Agents perform better with focused context. Each agent should receive: global conventions (short), the contracts it depends on (relevant subset), and its own spec (detailed). If an agent doesn't need to know about payments, don't tell it about payments.",
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
