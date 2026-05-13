import type { LessonContent } from './types'

const content: LessonContent = {
  lessonId: '3-2',
  steps: [
    // === INTRODUCTION ===
    {
      type: 'info',
      title: 'Keeping all your AI agents on the same page',
      body: "When one agent builds your project, consistency is automatic — it remembers its own decisions. But when five agents build in parallel, each starts with a blank slate. Agent A picks REST. Agent B picks GraphQL. Agent C names files in camelCase. Agent D uses kebab-case. You merge and get chaos. CLAUDE.md is the coordination protocol that prevents this.",
    },
    {
      type: 'info',
      title: 'Why this matters',
      body: "CLAUDE.md is not documentation for humans — it's a shared brain for agents. Every agent reads it before writing a single line of code. It encodes the architectural decisions, naming conventions, file patterns, and forbidden approaches that keep parallel work consistent. Without it, you're running five musicians without sheet music.",
    },

    // === DIAGRAM 1: The Coordination Problem ===
    {
      type: 'diagram',
      title: 'Without Shared Context: Divergent Decisions',
      body: "Without a shared context file, each agent makes independent decisions. They all produce working code — but code that contradicts the others. The merge becomes a nightmare of conflicting patterns.",
      diagram: {
        direction: 'TB',
        nodes: [
          { id: 'you', label: 'You', sublabel: 'Orchestrator', shape: 'rounded', highlight: true },
          { id: 'a', label: 'Agent A', sublabel: 'Picks REST', shape: 'rect' },
          { id: 'b', label: 'Agent B', sublabel: 'Picks GraphQL', shape: 'rect' },
          { id: 'c', label: 'Agent C', sublabel: 'camelCase files', shape: 'rect' },
          { id: 'd', label: 'Agent D', sublabel: 'kebab-case files', shape: 'rect' },
          { id: 'merge', label: 'Merge', sublabel: 'Contradictions!', shape: 'diamond' },
        ],
        edges: [
          { from: 'you', to: 'a' },
          { from: 'you', to: 'b' },
          { from: 'you', to: 'c' },
          { from: 'you', to: 'd' },
          { from: 'a', to: 'merge' },
          { from: 'b', to: 'merge' },
          { from: 'c', to: 'merge' },
          { from: 'd', to: 'merge' },
        ],
      },
    },

    // === DIAGRAM 2: With CLAUDE.md ===
    {
      type: 'diagram',
      title: 'With CLAUDE.md: Consistent Decisions',
      body: "Every agent reads CLAUDE.md first. It says: REST, kebab-case files, Zod validation. All agents follow the same rules. The merge is clean because every piece was built to the same spec.",
      diagram: {
        direction: 'TB',
        nodes: [
          { id: 'claude', label: 'CLAUDE.md', sublabel: 'Shared Context', shape: 'rounded', highlight: true },
          { id: 'a', label: 'Agent A', sublabel: 'Reads → REST', shape: 'rect' },
          { id: 'b', label: 'Agent B', sublabel: 'Reads → REST', shape: 'rect' },
          { id: 'c', label: 'Agent C', sublabel: 'Reads → kebab-case', shape: 'rect' },
          { id: 'd', label: 'Agent D', sublabel: 'Reads → kebab-case', shape: 'rect' },
          { id: 'merge', label: 'Merge', sublabel: 'Clean!', shape: 'pill', highlight: true },
        ],
        edges: [
          { from: 'claude', to: 'a', label: 'reads' },
          { from: 'claude', to: 'b', label: 'reads' },
          { from: 'claude', to: 'c', label: 'reads' },
          { from: 'claude', to: 'd', label: 'reads' },
          { from: 'a', to: 'merge' },
          { from: 'b', to: 'merge' },
          { from: 'c', to: 'merge' },
          { from: 'd', to: 'merge' },
        ],
      },
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'You see why shared context prevents coordination failures.',
    },

    // === WHAT BELONGS IN CLAUDE.MD ===
    {
      type: 'info',
      title: 'What belongs in shared CLAUDE.md',
      body: "Not everything belongs in CLAUDE.md. It's not a tutorial or a README. It contains only the decisions that agents need to make consistently: architectural choices, naming conventions, file patterns, forbidden approaches, and integration contracts. Think of it as the constitution — the non-negotiable rules every agent must follow.",
    },
    {
      type: 'code-demo',
      title: 'A multi-agent CLAUDE.md (project root)',
      body: "This is a real CLAUDE.md designed for parallel agent work. Notice how every section answers a question an agent would otherwise have to guess at.",
      language: 'markdown',
      filename: 'CLAUDE.md',
      code: `# Project: TaskFlow

## Architecture Decisions (DO NOT DEVIATE)

- **API style**: REST with JSON responses. No GraphQL.
- **Validation**: Zod schemas in \`src/schemas/\`. Every endpoint validates input.
- **Auth**: JWT tokens via \`src/lib/auth.ts\`. No session-based auth.
- **State management**: Zustand. No Redux, no Context for global state.
- **Styling**: Tailwind CSS only. No CSS modules, no styled-components.

## File Naming

- Components: \`kebab-case.tsx\` (e.g., \`user-profile.tsx\`)
- Utilities: \`kebab-case.ts\` (e.g., \`format-date.ts\`)
- Types: \`kebab-case.ts\` in \`src/types/\`
- Tests: \`*.test.ts\` co-located with source file

## Forbidden Patterns

- \`any\` type — use \`unknown\` and narrow
- Barrel files (\`index.ts\` re-exports) — import directly
- Default exports — use named exports only
- \`console.log\` in production code — use the logger from \`src/lib/logger.ts\`

## Shared Contracts

All agents import types from \`src/types/contracts.ts\`.
No agent modifies this file. It is written by the orchestrator.`,
    },
    {
      type: 'multiple-choice',
      question: 'Which of these does NOT belong in a multi-agent CLAUDE.md?',
      options: [
        'API style: REST with JSON responses',
        'Step-by-step tutorial on how React hooks work',
        'Forbidden patterns: no `any` type, no barrel files',
        'File naming: kebab-case.tsx for components',
      ],
      correctIndex: 1,
      explanation: "CLAUDE.md is for decisions, not education. Agents already know how React hooks work. They need to know YOUR project's specific rules — the choices that could go either way if not specified.",
    },
    {
      type: 'checkpoint',
      xp: 5,
      message: 'You know what belongs in shared context and what does not.',
    },

    // === LAYERING: PROJECT + DIRECTORY ===
    {
      type: 'info',
      title: 'Layering: project-level + directory-level CLAUDE.md',
      body: "A single root CLAUDE.md covers project-wide decisions. But when agents work in specific directories, they need domain-specific guidance too. Claude reads CLAUDE.md files at every level — root for global rules, directory-level for local specifics. This is layering: general context at the top, specific context where work happens.",
    },
    {
      type: 'code-demo',
      title: 'Directory-level CLAUDE.md for the API agent',
      body: "This file lives in src/api/ and gives the API agent specific guidance beyond what the root CLAUDE.md provides. It layers on top — doesn't repeat the global rules.",
      language: 'markdown',
      filename: 'src/api/CLAUDE.md',
      code: `# API Layer — Agent-Specific Context

## Endpoint Pattern
Every route follows: \`src/api/routes/{resource}.ts\`
Each file exports a Hono router with CRUD operations.

## Response Format
Always wrap in: \`{ data: T, error: null }\` or \`{ data: null, error: string }\`
Use the ApiResponse<T> type from \`src/types/contracts.ts\`.

## Error Handling
- 400: Zod validation failure (return parsed errors)
- 401: Missing or expired JWT
- 404: Resource not found
- 500: Unexpected error (log full stack, return generic message)

## Database Access
Use Drizzle ORM. Schema at \`src/db/schema.ts\`.
Never raw SQL. Never direct pg client calls.`,
    },
    {
      type: 'code-demo',
      title: 'Directory-level CLAUDE.md for the UI agent',
      body: "A different agent working in src/components/ gets its own specific guidance. It inherits the project-level rules (Tailwind, Zustand, kebab-case) and adds component-specific patterns.",
      language: 'markdown',
      filename: 'src/components/CLAUDE.md',
      code: `# UI Components — Agent-Specific Context

## Component Structure
- Props interface above component (named {Component}Props)
- Destructure props in function signature
- Use forwardRef for any component that wraps an HTML element

## Import Order
1. React/framework imports
2. Third-party libraries
3. Internal components (@/components/*)
4. Utilities (@/lib/*)
5. Types (@/types/*)

## Accessibility
- All interactive elements need aria-labels
- Use semantic HTML (button, nav, main, aside)
- Support keyboard navigation (onKeyDown handlers)

## Testing
- Use Testing Library (render, screen, userEvent)
- Test behavior, not implementation
- Co-locate test files: \`user-card.test.tsx\` beside \`user-card.tsx\``,
    },
    {
      type: 'multiple-choice',
      question: 'Agent working in `src/api/` reads which CLAUDE.md files?',
      options: [
        'Only src/api/CLAUDE.md',
        'Only the root CLAUDE.md',
        'Root CLAUDE.md + src/api/CLAUDE.md (layered)',
        'All CLAUDE.md files in the entire project',
      ],
      correctIndex: 2,
      explanation: "Claude reads CLAUDE.md at the project root and at each directory level relevant to its work. An agent in src/api/ gets both the global rules (REST, Zod, naming) and the API-specific rules (response format, error codes). They layer — directory rules add specificity without repeating global rules.",
    },
    {
      type: 'checkpoint',
      xp: 5,
      message: 'You understand layered CLAUDE.md for multi-agent coordination.',
    },

    // === PREVENTING CONTRADICTORY DECISIONS ===
    {
      type: 'info',
      title: 'Preventing contradictory decisions',
      body: "The most common multi-agent failure: two agents make reasonable but incompatible choices. Agent A uses Axios for HTTP. Agent B uses fetch. Agent C creates a custom wrapper. Now you have three HTTP libraries in one project. CLAUDE.md prevents this by making the choice explicit before any agent starts.",
    },
    {
      type: 'code-demo',
      title: 'Decision categories that MUST be specified',
      body: "These are the decisions where agents will diverge if not told explicitly. Every multi-agent CLAUDE.md needs answers to these questions.",
      language: 'markdown',
      filename: 'CLAUDE.md',
      code: `## Decisions That Prevent Contradictions

### Data Fetching
- Client: use \`fetch\` via the wrapper in \`src/lib/api-client.ts\`
- No Axios, no ky, no got — one HTTP approach

### Form Handling
- React Hook Form + Zod resolver
- No Formik, no uncontrolled forms

### Date/Time
- date-fns for all formatting and manipulation
- No moment.js, no dayjs, no native Date formatting

### ID Generation
- nanoid for client-generated IDs
- UUID v4 for database-generated IDs (via Postgres)

### Error Boundaries
- Use the shared ErrorBoundary from \`src/components/error-boundary.tsx\`
- Don't create new error boundary components`,
    },
    {
      type: 'order',
      instruction: 'Order these from MOST likely to cause agent contradictions (top) to LEAST likely:',
      items: [
        'Which HTTP client library to use',
        'How to indent code (tabs vs spaces)',
        'Which state management approach to use',
        'What color the submit button should be',
      ],
      correctOrder: [2, 0, 3, 1],
    },

    // === UPDATING SHARED CONTEXT ===
    {
      type: 'info',
      title: 'Updating shared context during parallel work',
      body: "Codebases evolve during a multi-agent session. Agent A discovers that the auth library needs a specific initialization pattern. Agent C finds that the database schema needs an extra field. These discoveries need to propagate to other agents. The rule: only the orchestrator (you) updates CLAUDE.md. Agents propose changes; you decide.",
    },
    {
      type: 'code-demo',
      title: 'Mid-session CLAUDE.md update',
      body: "During a fleet run, Agent A discovers the auth library requires async initialization. You update CLAUDE.md so all other agents handle this correctly. This is a real-time coordination update.",
      language: 'markdown',
      filename: 'CLAUDE.md',
      code: `## Runtime Notes (added during this session)

### Auth Initialization (IMPORTANT)
The auth client requires async init before any protected call:
\`\`\`typescript
import { initAuth } from '@/lib/auth'
// Call once at app startup or route handler entry
await initAuth()
\`\`\`
Any agent making authenticated requests MUST call this first.

### Database: users table has new column
Added \`preferences JSONB DEFAULT '{}'\` to users table.
Agents working with user data: include this field in your types.`,
    },
    {
      type: 'multiple-choice',
      question: 'During a parallel run, Agent B discovers a critical pattern. What do you do?',
      options: [
        'Let Agent B update CLAUDE.md directly',
        'Stop all agents, update CLAUDE.md, restart everyone',
        'Note the discovery, update CLAUDE.md, and inform affected agents',
        'Ignore it — each agent figures things out independently',
      ],
      correctIndex: 2,
      explanation: "You (the orchestrator) update CLAUDE.md and selectively inform agents that need to know. You don't need to stop everyone — only agents whose work is affected by the new information. This is targeted coordination, not broadcast interruption.",
    },
    {
      type: 'checkpoint',
      xp: 5,
      message: 'You can manage live context updates during fleet runs.',
    },

    // === INTERACTIVE: COMPARE ===
    {
      type: 'compare',
      title: 'Without vs with a coordination protocol',
      body: 'When multiple agents work on the same codebase, consistency depends on shared rules.',
      left: {
        label: 'No CLAUDE.md',
        content: 'Agent 1: uses camelCase functions\nAgent 2: uses snake_case functions\nAgent 1: throws Error("message")\nAgent 2: returns { error: "message" }\nAgent 1: uses Tailwind classes\nAgent 2: uses inline styles\n\nResult: inconsistent mess',
        language: 'text',
      },
      right: {
        label: 'Shared CLAUDE.md',
        content: 'All agents read:\n  "Functions: camelCase"\n  "Errors: throw AppError(msg, code)"\n  "Styling: Tailwind only, no inline"\n\nAgent 1: follows rules ✓\nAgent 2: follows rules ✓\nAgent 3: follows rules ✓\n\nResult: consistent codebase',
        language: 'text',
      },
    },

    // === INTERACTIVE: CODE-FILL ===
    {
      type: 'code-fill',
      instruction: 'Complete the CLAUDE.md coordination section that keeps all agents consistent:',
      language: 'markdown',
      template: '## Architecture Decisions (DO NOT DEVIATE)\n\n- **Naming**: All functions use {{naming}} style\n- **Error handling**: Always {{errorPattern}} with a code\n- **Styling**: {{stylingRule}} only. No CSS modules, no inline styles.\n- **Exports**: Use {{exportType}} exports only. No default exports.',
      blanks: [
        { id: 'naming', answer: 'camelCase', alternatives: ['camel-case', 'camel case'], placeholder: 'naming convention?', hint: 'The most common JS function naming style' },
        { id: 'errorPattern', answer: 'throw AppError(msg, code)', alternatives: ['throw AppError', 'throw new AppError(msg, code)'], placeholder: 'error approach?', hint: 'Throw an error object, not return one' },
        { id: 'stylingRule', answer: 'Tailwind CSS', alternatives: ['Tailwind', 'tailwind'], placeholder: 'CSS approach?', hint: 'Utility-first CSS framework' },
        { id: 'exportType', answer: 'named', alternatives: ['Named'], placeholder: 'export style?', hint: 'Not default exports' },
      ],
      explanation: 'Each blank eliminates a category of divergence. Naming, errors, styling, and exports are the top four areas where agents make inconsistent choices without explicit guidance.',
    },

    // === HANDS-ON EXERCISE ===
    {
      type: 'info',
      title: 'Exercise: Write a multi-agent CLAUDE.md',
      body: "Time to practice. You're about to run 4 agents on an e-commerce project: auth agent, product catalog agent, cart/checkout agent, and admin dashboard agent. Write the shared context that keeps them aligned.",
    },
    {
      type: 'terminal',
      instruction: 'Create a CLAUDE.md file at the project root:',
      expectedCommand: 'touch CLAUDE.md',
      hint: 'Create the file with touch',
    },
    {
      type: 'code-input',
      instruction: 'The most critical section prevents tech choice contradictions. Write the line that specifies the state management approach:',
      placeholder: '- **State management**: ...',
      answer: '- **State management**: Zustand. No Redux, no Context for global state.',
      hint: 'Pick one tool and explicitly forbid alternatives. Format: "- **State management**: [choice]. No [alternatives]."',
    },
    {
      type: 'terminal',
      instruction: 'Create a directory-level CLAUDE.md for the cart/checkout agent:',
      expectedCommand: 'mkdir -p src/cart && touch src/cart/CLAUDE.md',
      hint: 'Create the directory and the CLAUDE.md file inside it',
    },
    {
      type: 'code-demo',
      title: 'Your complete e-commerce CLAUDE.md',
      body: "Here's a full example of what you'd write before dispatching four agents. Study how each section eliminates a category of potential conflicts.",
      language: 'markdown',
      filename: 'CLAUDE.md',
      code: `# E-Commerce Platform

## Architecture (ALL AGENTS FOLLOW)
- Framework: Next.js 14 App Router
- API: Server Actions for mutations, Route Handlers for external APIs
- Database: Prisma + PostgreSQL
- Auth: NextAuth.js with JWT strategy
- Payments: Stripe SDK (server-side only)
- State: Zustand for client state, server state via React Query

## File Ownership
- src/auth/* → Auth Agent (login, signup, session)
- src/products/* → Catalog Agent (listing, search, detail)
- src/cart/* → Cart Agent (add/remove, checkout, payment)
- src/admin/* → Admin Agent (dashboard, CRUD, analytics)

## Shared Resources (NO AGENT MODIFIES)
- src/types/contracts.ts — shared type definitions
- src/lib/db.ts — Prisma client instance
- src/lib/stripe.ts — Stripe client instance
- prisma/schema.prisma — database schema

## Naming & Patterns
- Files: kebab-case.tsx / kebab-case.ts
- Components: PascalCase named exports
- Server Actions: src/{domain}/actions.ts
- Validation: Zod schemas in src/{domain}/schemas.ts

## Forbidden
- Client-side Stripe key usage
- Direct database access outside src/lib/db.ts
- Modifying shared resources without orchestrator approval
- any type — use unknown and narrow`,
    },
    {
      type: 'checklist',
      title: 'CLAUDE.md coordination checklist',
      items: [
        'Root CLAUDE.md covers all tech choices that could diverge',
        'File ownership is explicit — no overlapping directories',
        'Forbidden patterns listed to prevent common mistakes',
        'Shared resources marked as read-only for agents',
        'Directory-level CLAUDE.md adds domain-specific rules where needed',
        'Process for updating context mid-session is clear (orchestrator-only)',
      ],
    },
    {
      type: 'checkpoint',
      xp: 7,
      message: 'Lesson complete! You know how to keep multiple AI agents consistent with shared instructions.',
    },
  ],
}

export default content
