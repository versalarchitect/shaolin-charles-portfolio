import type { LessonContent } from './types'

const content: LessonContent = {
  lessonId: '3-1',
  steps: [
    // === INTRODUCTION ===
    {
      type: 'info',
      title: 'The Multi-Agent Mental Model',
      body: "You've been directing a single agent. That's like having one contractor build your entire house — foundation, framing, plumbing, electrical — one task at a time. It works, but it's painfully slow. Today you learn to think like a general contractor: decompose the work, assign specialists, and run them in parallel.",
    },
    {
      type: 'info',
      title: 'Why this matters',
      body: "A SaaS app has authentication, a dashboard, an API layer, payment processing, and a landing page. A single agent builds these sequentially — maybe 45 minutes total. With proper decomposition, five agents build them simultaneously in under 10 minutes. Same quality, 4x faster. But only if you decompose correctly.",
    },

    // === DIAGRAM 1: Serial vs Parallel ===
    {
      type: 'diagram',
      title: 'Serial vs Parallel Execution',
      body: "This is the core mental model shift. Serial execution is safe but slow — each task waits for the previous one. Parallel execution runs independent tasks simultaneously. The orchestrator (you) replaces the single agent as the coordinator.",
      diagram: {
        direction: 'TB',
        nodes: [
          { id: 'orch', label: 'Orchestrator', sublabel: 'You', shape: 'rounded', highlight: true },
          { id: 'a', label: 'Task A', sublabel: 'Auth', shape: 'rect' },
          { id: 'b', label: 'Task B', sublabel: 'API', shape: 'rect' },
          { id: 'c', label: 'Task C', sublabel: 'UI', shape: 'rect' },
          { id: 'merge', label: 'Merge', sublabel: 'Integration', shape: 'rect' },
          { id: 'done', label: 'Done', shape: 'pill', highlight: true },
        ],
        edges: [
          { from: 'orch', to: 'a', label: 'parallel' },
          { from: 'orch', to: 'b', label: 'parallel' },
          { from: 'orch', to: 'c', label: 'parallel' },
          { from: 'a', to: 'merge' },
          { from: 'b', to: 'merge' },
          { from: 'c', to: 'merge' },
          { from: 'merge', to: 'done' },
        ],
      },
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'You see the graph. Serial is a chain. Parallel is a fan-out.',
    },

    // === TASK DECOMPOSITION ===
    {
      type: 'info',
      title: 'Task decomposition and file ownership',
      body: "Task decomposition is breaking a product into agent-sized work units. Each unit should have clear boundaries, own specific files, and be testable independently. The golden rule: if two agents need to write to the same file, your decomposition is wrong. Shared file access is the number one cause of multi-agent failures.",
    },
    {
      type: 'multiple-choice',
      question: 'Two agents both need to modify `src/App.tsx` to add their routes. What should you do?',
      options: [
        'Let them both edit it and merge manually',
        'Have one agent do both route additions',
        'Create a routes config file each agent writes to separately',
        'Run the agents sequentially so they don\'t conflict',
      ],
      correctIndex: 2,
      explanation: "Restructure so each agent owns its files. A routes config pattern (e.g., each feature exports its routes from its own directory) eliminates the shared file problem entirely. Running sequentially works but defeats the purpose of parallelism.",
    },
    {
      type: 'checklist',
      title: 'What makes a good agent-sized task?',
      items: [
        'Describable in one sentence ("Build the auth flow with login, signup, and password reset")',
        'Owns specific files — no overlap with other tasks',
        'Has a clear input contract (API shape, props interface, env vars)',
        'Testable independently — you can verify it works in isolation',
        'Takes 5-15 minutes for an agent to complete — not 2, not 60',
        'Produces a working artifact (a page, an endpoint, a component)',
      ],
    },

    // === DIAGRAM 2: Task Dependency Graph ===
    {
      type: 'diagram',
      title: 'Task Dependency Graph',
      body: "A real SaaS product decomposed into parallel work streams. Auth and API can start immediately — they're independent. UI depends on the API contract (needs response shapes). Payments depend on Auth (needs user context). Everything merges at integration.",
      diagram: {
        direction: 'TB',
        nodes: [
          { id: 'spec', label: 'Spec', sublabel: 'Contracts', shape: 'rounded', highlight: true },
          { id: 'auth', label: 'Auth', sublabel: 'Login/Signup', shape: 'rect' },
          { id: 'api', label: 'API', sublabel: 'Endpoints', shape: 'rect' },
          { id: 'ui', label: 'UI', sublabel: 'Dashboard', shape: 'rect' },
          { id: 'pay', label: 'Payments', sublabel: 'Stripe', shape: 'rect' },
          { id: 'int', label: 'Integration', shape: 'rect' },
          { id: 'deploy', label: 'Deploy', shape: 'pill', highlight: true },
        ],
        edges: [
          { from: 'spec', to: 'auth', label: 'independent' },
          { from: 'spec', to: 'api', label: 'independent' },
          { from: 'api', to: 'ui', label: 'depends on' },
          { from: 'auth', to: 'pay', label: 'depends on' },
          { from: 'auth', to: 'int' },
          { from: 'api', to: 'int' },
          { from: 'ui', to: 'int' },
          { from: 'pay', to: 'int' },
          { from: 'int', to: 'deploy' },
        ],
      },
    },
    {
      type: 'multiple-choice',
      question: 'In the dependency graph above, which tasks can start at the same time?',
      options: [
        'Auth, API, UI, and Payments',
        'Auth and API only',
        'All tasks can run simultaneously',
        'Auth, API, and Payments',
      ],
      correctIndex: 1,
      explanation: "Only Auth and API are independent from the start. UI depends on the API contract (response shapes), and Payments depends on Auth (user context). You define the spec/contracts first, then fan out Auth and API in parallel.",
    },
    {
      type: 'checkpoint',
      xp: 5,
      message: 'You can read a dependency graph and identify parallel opportunities.',
    },

    // === THE SPEC / CONTRACTS STEP ===
    {
      type: 'info',
      title: 'Step zero: define contracts',
      body: "Before any agent starts coding, you define the contracts — the interfaces between components. API response shapes, auth token format, component props, database schema. This takes 5 minutes and prevents hours of integration pain. Every agent works against the same shared types. No agent modifies the contract file.",
    },
    {
      type: 'code-demo',
      title: 'A shared contract file',
      body: "This types file is written first, before any agent starts. Every agent imports from it. No agent modifies it. It's the single source of truth that makes parallel work possible.",
      language: 'typescript',
      filename: 'src/types/contracts.ts',
      code: `// Written by YOU before agents start
// Every agent imports from this file — none modify it

export interface User {
  id: string
  email: string
  role: 'admin' | 'member'
}

export interface ApiResponse<T> {
  data: T
  error: string | null
}

export interface DashboardStats {
  revenue: number
  users: number
  churn: number
}`,
    },
    {
      type: 'code-input',
      instruction: 'You\'re defining the contract for a payments agent. It needs a function that takes a user ID and amount, then returns a payment intent ID. Write the TypeScript type signature:',
      placeholder: 'type CreatePayment = ...',
      answer: 'type CreatePayment = (userId: string, amount: number) => Promise<string>',
      hint: 'A function type with two params (userId: string, amount: number) returning Promise<string>',
    },

    // === AGENT DISPATCH PATTERN ===
    {
      type: 'code-demo',
      title: 'Dispatching parallel agents',
      body: "In Claude Code, you dispatch parallel agents by batching independent tool calls or using the Agent tool. Each agent gets its own context, file scope, and task description. Notice how each task owns specific directories — no overlap.",
      language: 'markdown',
      filename: 'CLAUDE.md',
      code: `## Parallel Tasks — Run Simultaneously

### Agent 1: Auth (owns src/auth/*)
Build login, signup, and password reset.
Use the User type from src/types/contracts.ts.
Write tests in src/auth/__tests__/.

### Agent 2: API (owns src/api/*)
Build REST endpoints for dashboard stats.
Use ApiResponse<T> from src/types/contracts.ts.
Write tests in src/api/__tests__/.

### Agent 3: Landing Page (owns src/marketing/*)
Build the marketing landing page.
No dependencies on other agents.
Static content only.`,
    },
    {
      type: 'checkpoint',
      xp: 5,
      message: 'You understand contracts and the dispatch pattern.',
    },

    // === DIAGRAM 3: When NOT to Parallelize ===
    {
      type: 'diagram',
      title: 'When NOT to Parallelize',
      body: "Not every task benefits from parallel execution. Use this decision tree before dispatching agents. If tasks share state or files, run them serially. If they touch independent files with no shared state, parallelize confidently.",
      diagram: {
        direction: 'TB',
        nodes: [
          { id: 'task', label: 'New Task', shape: 'rounded' },
          { id: 'state', label: 'Shares State?', shape: 'diamond' },
          { id: 'serial', label: 'Run Serial', sublabel: 'One at a time', shape: 'rect' },
          { id: 'files', label: 'Own Files?', shape: 'diamond' },
          { id: 'parallel', label: 'Parallelize', shape: 'pill', highlight: true },
          { id: 'coord', label: 'Coordinate', sublabel: 'Restructure', shape: 'rect' },
        ],
        edges: [
          { from: 'task', to: 'state' },
          { from: 'state', to: 'serial', label: 'yes' },
          { from: 'state', to: 'files', label: 'no' },
          { from: 'files', to: 'parallel', label: 'yes' },
          { from: 'files', to: 'coord', label: 'no' },
        ],
      },
    },
    {
      type: 'multiple-choice',
      question: 'Two agents need to add items to the same Zustand store. What does the decision tree say?',
      options: [
        'Parallelize — Zustand handles concurrency',
        'Run serial — they share state',
        'Coordinate — restructure the store into slices each agent owns',
        'Both B and C are valid approaches',
      ],
      correctIndex: 3,
      explanation: "Shared state means either run serial (safe, simple) or restructure so each agent owns a separate store slice (parallel, requires upfront work). Both are valid — the wrong answer is blindly parallelizing.",
    },

    // === FAILURE MODES ===
    {
      type: 'order',
      instruction: 'Rank these multi-agent failure modes from MOST common (top) to LEAST common:',
      items: [
        'Shared file conflicts (two agents edit the same file)',
        'Inconsistent assumptions (agents disagree on data shapes)',
        'Integration failures (pieces don\'t connect at merge)',
        'Duplicate work (agents unknowingly build the same thing)',
      ],
      correctOrder: [0, 1, 2, 3],
    },
    {
      type: 'info',
      title: 'Preventing each failure mode',
      body: "Shared file conflicts: enforce exclusive file ownership per agent. Inconsistent assumptions: define shared contracts before starting. Integration failures: plan the merge step explicitly and test interfaces early. Duplicate work: give each agent a clear, non-overlapping scope in the prompt.",
    },
    {
      type: 'checkpoint',
      xp: 5,
      message: 'You know the failure modes and how to prevent them.',
    },

    // === HANDS-ON EXERCISE ===
    {
      type: 'info',
      title: 'Exercise: Decompose a project',
      body: "Time to practice. You're building a task management app with: user authentication (email/password), a Kanban board UI, a REST API for CRUD operations on tasks, and real-time updates via WebSocket. Decompose this into agent-sized tasks and identify dependencies.",
    },
    {
      type: 'code-input',
      instruction: 'List the independent tasks that can run in parallel from the start (comma-separated, lowercase):',
      placeholder: 'task1, task2, ...',
      answer: 'auth, api, websocket',
      hint: 'Which features don\'t depend on other features existing first? The Kanban UI needs API response shapes.',
    },
    {
      type: 'multiple-choice',
      question: 'Why can\'t the Kanban board UI start at the same time as Auth and API?',
      options: [
        'The UI is always the last thing built',
        'The UI needs the API response shapes to type its components',
        'The UI requires authentication to be complete first',
        'The UI is too complex for a single agent',
      ],
      correctIndex: 1,
      explanation: "The Kanban board needs to know the shape of task objects returned by the API (title, status, assignee, etc.). Without that contract, the UI agent would be guessing at data structures. Solution: define the contract first, then UI can also run in parallel.",
    },
    {
      type: 'terminal',
      instruction: 'Create the directory structure for parallel agent work. Make directories for each agent\'s domain:',
      expectedCommand: 'mkdir -p src/auth src/api src/board src/realtime',
      hint: 'Use mkdir -p to create auth, api, board, and realtime directories under src/',
    },
    {
      type: 'code-demo',
      title: 'Your decomposition as a task graph',
      body: "Here's how you'd document this decomposition in your CLAUDE.md. Notice the explicit file ownership and dependency notes.",
      language: 'markdown',
      filename: 'CLAUDE.md',
      code: `## Task Graph

### Phase 1 — Contracts (you, 5 min)
Define types in src/types/task.ts

### Phase 2 — Parallel Agents
- Agent A: Auth → src/auth/* (independent)
- Agent B: API → src/api/* (independent)
- Agent C: WebSocket → src/realtime/* (independent)

### Phase 3 — Dependent Work
- Agent D: Kanban UI → src/board/*
  (after API contract is defined)

### Phase 4 — Integration
- Wire routes, test end-to-end`,
    },
    {
      type: 'info',
      title: 'Maximizing parallelism with contracts',
      body: "Here's the advanced move: if you define the API contract upfront (the response shapes, endpoint paths, status codes), the UI agent CAN start in parallel with the API agent. Both work against the contract — the API implements it, the UI consumes it. This is how you go from 3 parallel agents to 4.",
    },
    {
      type: 'checklist',
      title: 'Multi-agent readiness checklist',
      items: [
        'I can identify when a project benefits from multiple agents',
        'I decompose products into tasks with exclusive file ownership',
        'I define shared contracts before dispatching agents',
        'I draw dependency graphs to find parallel opportunities',
        'I know the four common failure modes and how to prevent them',
        'I understand the decision tree: share state? own files? parallelize or serialize?',
      ],
    },
    {
      type: 'checkpoint',
      xp: 7,
      message: 'Lesson complete. You think in graphs now, not chains.',
    },
  ],
}

export default content
