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
      type: 'interactive-diagram',
      title: 'Without Shared Context: Divergent Decisions',
      body: "Step through to see how parallel agents diverge without a shared context file.",
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
      stages: [
        {
          highlightNodes: ['you'],
          explanation: 'You dispatch four agents with no shared context file. Each agent receives only its task description.',
        },
        {
          highlightNodes: ['a', 'b'],
          highlightEdges: [{ from: 'you', to: 'a' }, { from: 'you', to: 'b' }],
          explanation: 'Agent A picks REST because it seems simpler. Agent B picks GraphQL because it handles complex queries better. Both are reasonable — but incompatible.',
        },
        {
          highlightNodes: ['c', 'd'],
          highlightEdges: [{ from: 'you', to: 'c' }, { from: 'you', to: 'd' }],
          explanation: 'Agent C names files in camelCase (userProfile.tsx). Agent D uses kebab-case (user-profile.tsx). Both are valid conventions — but inconsistent together.',
        },
        {
          highlightNodes: ['merge'],
          highlightEdges: [{ from: 'a', to: 'merge' }, { from: 'b', to: 'merge' }, { from: 'c', to: 'merge' }, { from: 'd', to: 'merge' }],
          explanation: 'At merge time: REST and GraphQL clash, naming is inconsistent, import paths break. Every agent produced working code — but code that contradicts the others.',
        },
      ],
    },

    // === DIAGRAM 2: With CLAUDE.md ===
    {
      type: 'interactive-diagram',
      title: 'With CLAUDE.md: Consistent Decisions',
      body: "Now see what happens when every agent reads CLAUDE.md first.",
      diagram: {
        direction: 'TB',
        nodes: [
          { id: 'claude', label: 'CLAUDE.md', sublabel: 'Shared Context', shape: 'rounded', highlight: true },
          { id: 'a', label: 'Agent A', sublabel: 'Reads -> REST', shape: 'rect' },
          { id: 'b', label: 'Agent B', sublabel: 'Reads -> REST', shape: 'rect' },
          { id: 'c', label: 'Agent C', sublabel: 'Reads -> kebab-case', shape: 'rect' },
          { id: 'd', label: 'Agent D', sublabel: 'Reads -> kebab-case', shape: 'rect' },
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
      stages: [
        {
          highlightNodes: ['claude'],
          explanation: 'CLAUDE.md says: REST, kebab-case, Zod validation. These are non-negotiable rules written before agents start.',
        },
        {
          highlightNodes: ['claude', 'a', 'b'],
          highlightEdges: [{ from: 'claude', to: 'a' }, { from: 'claude', to: 'b' }],
          explanation: 'Both Agent A and Agent B read the same rule: REST with JSON responses. No GraphQL. They both follow the same approach.',
        },
        {
          highlightNodes: ['claude', 'c', 'd'],
          highlightEdges: [{ from: 'claude', to: 'c' }, { from: 'claude', to: 'd' }],
          explanation: 'Both Agent C and Agent D read: kebab-case.tsx for components. Every file follows the same naming convention.',
        },
        {
          highlightNodes: ['merge'],
          highlightEdges: [{ from: 'a', to: 'merge' }, { from: 'b', to: 'merge' }, { from: 'c', to: 'merge' }, { from: 'd', to: 'merge' }],
          explanation: 'At merge time: everything is consistent. REST everywhere, kebab-case everywhere, Zod everywhere. The merge is clean because every piece was built to the same spec.',
        },
      ],
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'You see why shared context prevents coordination failures.',
    },

    // === WHAT BELONGS IN CLAUDE.MD ===
    {
      type: 'multiple-choice',
      question: 'CLAUDE.md contains the decisions agents need to make consistently. What does NOT belong in a multi-agent CLAUDE.md?',
      options: [
        'API style: REST with JSON responses',
        'A step-by-step tutorial on how React hooks work',
        'Forbidden patterns: no `any` type, no barrel files',
        'File naming: kebab-case.tsx for components',
      ],
      correctIndex: 1,
      explanation: "CLAUDE.md is for decisions, not education. Agents already know how React hooks work. They need to know YOUR project's specific rules — the choices that could go either way if not specified. Think of it as a constitution — non-negotiable rules every agent must follow.",
    },
    {
      type: 'code-fill',
      instruction: 'Complete this multi-agent CLAUDE.md that prevents agents from making contradictory decisions:',
      language: 'markdown',
      filename: 'CLAUDE.md',
      template: '# Project: TaskFlow\n\n## Architecture Decisions (DO NOT DEVIATE)\n\n- **API style**: {{apiStyle}}. No GraphQL.\n- **Validation**: {{validation}} in `src/schemas/`. Every endpoint validates input.\n- **Auth**: {{authMethod}} via `src/lib/auth.ts`. No session-based auth.\n- **State management**: {{stateLib}}. No Redux, no Context for global state.\n- **Styling**: {{cssApproach}} only. No CSS modules, no styled-components.',
      blanks: [
        { id: 'apiStyle', answer: 'REST with JSON responses', alternatives: ['REST', 'REST API', 'REST with JSON'], placeholder: 'which API style?', hint: 'The most common API pattern for web apps' },
        { id: 'validation', answer: 'Zod schemas', alternatives: ['Zod', 'zod schemas', 'Zod Schemas'], placeholder: 'which validation?', hint: 'TypeScript-first schema validation library' },
        { id: 'authMethod', answer: 'JWT tokens', alternatives: ['JWT', 'jwt tokens', 'JSON Web Tokens'], placeholder: 'which auth?', hint: 'Stateless token-based authentication' },
        { id: 'stateLib', answer: 'Zustand', alternatives: ['zustand'], placeholder: 'which state lib?', hint: 'Lightweight state management library' },
        { id: 'cssApproach', answer: 'Tailwind CSS', alternatives: ['Tailwind', 'tailwind', 'tailwind css'], placeholder: 'which CSS?', hint: 'Utility-first CSS framework' },
      ],
      explanation: 'Each blank eliminates a category of divergence. Without explicit choices for API style, validation, auth, state management, and styling, agents will make reasonable but incompatible decisions.',
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
      type: 'multiple-choice',
      question: 'A single root CLAUDE.md covers project-wide decisions. But when agents work in specific directories, they need domain-specific guidance too. How does Claude handle this?',
      options: [
        'Claude only reads the root CLAUDE.md — directory-level files are ignored',
        'Claude reads CLAUDE.md at the root and at each directory level relevant to its work (layered)',
        'Claude reads every CLAUDE.md in the entire project regardless of location',
        'You must copy all rules into each directory-level CLAUDE.md',
      ],
      correctIndex: 1,
      explanation: 'Claude reads CLAUDE.md at every level — root for global rules, directory-level for local specifics. This is layering: general context at the top, specific context where work happens. Directory rules add specificity without repeating global rules.',
    },
    {
      type: 'code-fill',
      instruction: 'Complete this directory-level CLAUDE.md for the API agent that layers on top of the root rules:',
      language: 'markdown',
      filename: 'src/api/CLAUDE.md',
      template: '# API Layer — Agent-Specific Context\n\n## Endpoint Pattern\nEvery route follows: `src/api/routes/{{routePattern}}.ts`\nEach file exports a Hono router with {{operations}} operations.\n\n## Response Format\nAlways wrap in: `{ data: T, error: null }` or `{ data: null, error: string }`\nUse the {{responseType}} type from `src/types/contracts.ts`.\n\n## Error Handling\n- 400: {{validationError}}\n- 401: Missing or expired JWT\n- 404: Resource not found\n- 500: Unexpected error (log full stack, return generic message)',
      blanks: [
        { id: 'routePattern', answer: '{resource}', alternatives: ['resource', '[resource]'], placeholder: 'what pattern?', hint: 'Routes are organized by resource name' },
        { id: 'operations', answer: 'CRUD', alternatives: ['crud', 'Create Read Update Delete'], placeholder: 'what operations?', hint: 'The four basic database operations' },
        { id: 'responseType', answer: 'ApiResponse<T>', alternatives: ['ApiResponse', 'ApiResponse<T> type'], placeholder: 'which type?', hint: 'The generic response wrapper from the shared contracts' },
        { id: 'validationError', answer: 'Zod validation failure (return parsed errors)', alternatives: ['Zod validation failure', 'Validation failure', 'validation error'], placeholder: 'what kind of error?', hint: 'Input validation failures using the schema library from the root CLAUDE.md' },
      ],
      explanation: 'This directory-level CLAUDE.md layers on top of the root rules. It does not repeat "use Zod" — that is in the root. It specifies HOW the API agent uses Zod (return parsed errors on 400).',
    },
    {
      type: 'code-fill',
      instruction: 'Complete this directory-level CLAUDE.md for the UI agent with component-specific patterns:',
      language: 'markdown',
      filename: 'src/components/CLAUDE.md',
      template: '# UI Components — Agent-Specific Context\n\n## Component Structure\n- Props interface above component (named {{propsNaming}})\n- {{destructure}} props in function signature\n- Use forwardRef for any component that wraps an HTML element\n\n## Import Order\n1. React/framework imports\n2. Third-party libraries\n3. Internal components ({{componentAlias}})\n4. Utilities (@/lib/*)\n5. Types (@/types/*)',
      blanks: [
        { id: 'propsNaming', answer: '{Component}Props', alternatives: ['ComponentProps', '{ComponentName}Props'], placeholder: 'naming pattern?', hint: 'The props interface is named after the component' },
        { id: 'destructure', answer: 'Destructure', alternatives: ['destructure', 'Destructured'], placeholder: 'what to do with props?', hint: 'Extract properties directly in the function parameter' },
        { id: 'componentAlias', answer: '@/components/*', alternatives: ['@/components'], placeholder: 'which import alias?', hint: 'Internal components use the @ path alias' },
      ],
      explanation: 'The UI agent inherits root rules (Tailwind, Zustand, kebab-case) and adds component-specific patterns. Import order and props naming prevent the small inconsistencies that accumulate into a messy codebase.',
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
      type: 'multiple-choice',
      question: 'Agent A uses Axios for HTTP, Agent B uses fetch, Agent C creates a custom wrapper. What CLAUDE.md section would have prevented this?',
      options: [
        'A "Getting Started" tutorial section',
        'A "Decision Categories" section specifying the single HTTP approach',
        'A "Team Members" section listing agent responsibilities',
        'A "Changelog" section tracking modifications',
      ],
      correctIndex: 1,
      explanation: 'CLAUDE.md prevents contradictory decisions by making choices explicit before any agent starts. Data fetching, form handling, date libraries, ID generation, and error handling are the top categories where agents diverge. One explicit choice per category eliminates the problem.',
    },
    {
      type: 'code-fill',
      instruction: 'Complete these decision categories that prevent agents from choosing different libraries for the same job:',
      language: 'markdown',
      filename: 'CLAUDE.md',
      template: '## Decisions That Prevent Contradictions\n\n### Data Fetching\n- Client: use `{{httpClient}}` via the wrapper in `src/lib/api-client.ts`\n- No Axios, no ky, no got — one HTTP approach\n\n### Form Handling\n- {{formLib}} + Zod resolver\n- No Formik, no uncontrolled forms\n\n### Date/Time\n- {{dateLib}} for all formatting and manipulation\n- No moment.js, no dayjs, no native Date formatting',
      blanks: [
        { id: 'httpClient', answer: 'fetch', alternatives: ['Fetch', 'the fetch API'], placeholder: 'which HTTP client?', hint: 'The built-in browser/Node API for making HTTP requests' },
        { id: 'formLib', answer: 'React Hook Form', alternatives: ['react-hook-form', 'react hook form', 'RHF'], placeholder: 'which form library?', hint: 'The most popular React form library with hook-based API' },
        { id: 'dateLib', answer: 'date-fns', alternatives: ['Date-fns', 'date fns', 'datefns'], placeholder: 'which date library?', hint: 'Functional date utility library (not moment, not dayjs)' },
      ],
      explanation: 'Each decision names one tool and explicitly forbids alternatives. Without this, you get three HTTP libraries, two form handlers, and inconsistent date formatting across your codebase.',
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
      type: 'multiple-choice',
      question: 'During a parallel run, Agent A discovers the auth library requires async initialization. Who should update CLAUDE.md with this information?',
      options: [
        'Agent A should update CLAUDE.md directly',
        'All agents should stop and discuss the change',
        'You (the orchestrator) update CLAUDE.md and inform affected agents',
        'No update needed — each agent figures it out independently',
      ],
      correctIndex: 2,
      explanation: 'Only the orchestrator (you) updates CLAUDE.md. Agents propose changes; you decide. You note the discovery, update the file, and selectively inform agents whose work is affected. This is targeted coordination, not broadcast interruption.',
    },
    {
      type: 'code-fill',
      instruction: 'Complete this mid-session CLAUDE.md update that propagates a discovery from one agent to all others:',
      language: 'markdown',
      filename: 'CLAUDE.md',
      template: '## Runtime Notes (added during this session)\n\n### Auth Initialization (IMPORTANT)\nThe auth client requires {{initType}} init before any protected call:\n```typescript\nimport { initAuth } from \'@/lib/auth\'\n// Call once at app startup or route handler entry\n{{initCall}}\n```\nAny agent making authenticated requests MUST call this first.\n\n### Database: users table has new column\nAdded `{{newColumn}} DEFAULT \'{}\'` to users table.\nAgents working with user data: include this field in your types.',
      blanks: [
        { id: 'initType', answer: 'async', alternatives: ['asynchronous'], placeholder: 'sync or async?', hint: 'The initialization requires awaiting' },
        { id: 'initCall', answer: 'await initAuth()', alternatives: ['await initAuth();'], placeholder: 'the init call?', hint: 'An awaited function call to initialize auth' },
        { id: 'newColumn', answer: 'preferences JSONB', alternatives: ['preferences jsonb', 'preferences JSONB DEFAULT'], placeholder: 'column definition?', hint: 'A JSON column for user preferences' },
      ],
      explanation: 'Mid-session updates propagate discoveries across agents. The async init requirement and schema change affect every agent making authenticated calls or working with user data. Without this update, agents would fail at runtime.',
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
        content: 'All agents read:\n  "Functions: camelCase"\n  "Errors: throw AppError(msg, code)"\n  "Styling: Tailwind only, no inline"\n\nAgent 1: follows rules\nAgent 2: follows rules\nAgent 3: follows rules\n\nResult: consistent codebase',
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
      type: 'multiple-choice',
      question: 'You are about to run 4 agents on an e-commerce project: auth, product catalog, cart/checkout, and admin dashboard. What is the FIRST thing you write before dispatching any agent?',
      options: [
        'The product catalog component',
        'A shared CLAUDE.md with architecture decisions, file ownership, naming, and forbidden patterns',
        'The database migration files',
        'Individual task descriptions for each agent',
      ],
      correctIndex: 1,
      explanation: 'The shared CLAUDE.md comes first — before any code, before any agent starts. It establishes the rules that keep all four agents consistent. Without it, the auth agent might use Prisma while the catalog agent uses Drizzle.',
    },
    {
      type: 'terminal',
      instruction: 'Create a CLAUDE.md file at the project root:',
      expectedCommand: 'touch CLAUDE.md',
      hint: 'Create the file with touch',
      platforms: {
        windows: {
          expectedCommand: 'New-Item CLAUDE.md',
          hint: 'Create the file with New-Item',
        },
      },
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
      platforms: {
        windows: {
          expectedCommand: 'mkdir src\\cart; New-Item src\\cart\\CLAUDE.md',
        },
      },
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
- src/auth/* -> Auth Agent (login, signup, session)
- src/products/* -> Catalog Agent (listing, search, detail)
- src/cart/* -> Cart Agent (add/remove, checkout, payment)
- src/admin/* -> Admin Agent (dashboard, CRUD, analytics)

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
