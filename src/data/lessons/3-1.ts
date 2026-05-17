import type { LessonContent } from './types'

const content: LessonContent = {
  lessonId: '3-1',
  steps: [
    // === INTRODUCTION ===
    {
      type: 'info',
      title: 'Running multiple AI agents at once',
      body: "You have been directing one AI agent at a time. That is like having one contractor build your entire house — foundation, framing, plumbing, electrical — one task at a time. It works, but it is painfully slow. Today you learn to think like a general contractor: break the work into pieces, assign each piece to a specialist, and run them all at the same time.",
    },
    {
      type: 'info',
      title: 'Why this matters',
      body: "A SaaS app has authentication, a dashboard, an API layer, payment processing, and a landing page. A single agent builds these sequentially — maybe 45 minutes total. With proper decomposition, five agents build them simultaneously in under 10 minutes. Same quality, 4x faster. But only if you decompose correctly.",
    },

    // === DIAGRAM 1: Serial vs Parallel ===
    {
      type: 'interactive-diagram',
      title: 'Serial vs Parallel Execution',
      body: "This is the core mental model shift. Serial execution is safe but slow — each task waits for the previous one. Parallel execution runs independent tasks simultaneously. Step through to see how the orchestrator coordinates.",
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
      stages: [
        {
          highlightNodes: ['orch'],
          explanation: 'You are the orchestrator. Instead of directing one agent through every task sequentially, you decompose the work and dispatch multiple agents simultaneously.',
        },
        {
          highlightNodes: ['orch', 'a', 'b', 'c'],
          highlightEdges: [{ from: 'orch', to: 'a' }, { from: 'orch', to: 'b' }, { from: 'orch', to: 'c' }],
          explanation: 'Fan-out: three agents start at the same time, each on an independent task. Auth, API, and UI all run in parallel because they do not depend on each other.',
        },
        {
          highlightNodes: ['a', 'b', 'c', 'merge'],
          highlightEdges: [{ from: 'a', to: 'merge' }, { from: 'b', to: 'merge' }, { from: 'c', to: 'merge' }],
          explanation: 'Fan-in: when all agents finish, their work converges at the merge step. This is where you integrate the pieces and resolve any interface mismatches.',
        },
        {
          highlightNodes: ['merge', 'done'],
          highlightEdges: [{ from: 'merge', to: 'done' }],
          explanation: 'After integration, the project is complete. Wall-clock time: the duration of the slowest agent plus merge time. Much faster than sequential.',
        },
      ],
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'You see the graph. Serial is a chain. Parallel is a fan-out.',
    },

    // === TASK DECOMPOSITION ===
    {
      type: 'multiple-choice',
      question: 'Task decomposition means breaking a product into agent-sized work units. What is the golden rule of multi-agent file ownership?',
      options: [
        'Each agent should work on the smallest possible files',
        'Agents should share files to stay aware of each other\'s changes',
        'If two agents need to write to the same file, your decomposition is wrong',
        'File ownership does not matter as long as agents work on different features',
      ],
      correctIndex: 2,
      explanation: 'Shared file access is the number one cause of multi-agent failures. If two agents need to write to the same file, restructure so each agent owns its files exclusively. Each work unit should have clear boundaries, own specific files, and be testable independently.',
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
      type: 'interactive-diagram',
      title: 'Task Dependency Graph',
      body: "A real SaaS product decomposed into parallel work streams. Step through to see which tasks can run in parallel and which must wait.",
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
      stages: [
        {
          highlightNodes: ['spec'],
          highlightEdges: [{ from: 'spec', to: 'auth' }, { from: 'spec', to: 'api' }],
          explanation: 'Step 0: You define the spec and shared contracts first. This takes 5 minutes and enables everything that follows. Types, API shapes, database schema.',
        },
        {
          highlightNodes: ['auth', 'api'],
          explanation: 'Step 1: Auth and API can start immediately in parallel — they are independent. Each owns its own files and works against the shared contracts.',
        },
        {
          highlightNodes: ['ui', 'pay'],
          highlightEdges: [{ from: 'api', to: 'ui' }, { from: 'auth', to: 'pay' }],
          explanation: 'Step 2: UI depends on the API contract (needs response shapes). Payments depend on Auth (needs user context). These start after their dependencies finish.',
        },
        {
          highlightNodes: ['int', 'deploy'],
          highlightEdges: [{ from: 'int', to: 'deploy' }],
          explanation: 'Step 3: Integration merges all pieces. You wire routes, test interfaces, resolve any mismatches. Then deploy the unified product.',
        },
      ],
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
      type: 'multiple-choice',
      question: 'Before any agent starts coding, you define shared contracts (interfaces, API shapes, types). Why is this step critical for parallel work?',
      options: [
        'It makes the TypeScript compiler happy',
        'It prevents agents from making reasonable but incompatible assumptions about data shapes',
        'It gives agents something to read while waiting for their turn',
        'It is only necessary for teams larger than 3 agents',
      ],
      correctIndex: 1,
      explanation: 'Without shared contracts, Agent A might define a User with a "name" field while Agent B expects "firstName" and "lastName". The contract file is written once by you, imported by every agent, and modified by none. It takes 5 minutes and prevents hours of integration pain.',
    },
    {
      type: 'code-fill',
      instruction: 'Complete this shared contract file that all agents will import. No agent modifies it — you write it before they start:',
      language: 'typescript',
      filename: 'src/types/contracts.ts',
      template: '// Written by YOU before agents start\n// Every agent imports from this file — none modify it\n\nexport interface User {\n  id: {{idType}}\n  email: string\n  role: {{roleType}}\n}\n\nexport interface ApiResponse<T> {\n  data: T\n  error: {{errorType}}\n}\n\nexport interface DashboardStats {\n  revenue: number\n  users: number\n  churn: {{churnType}}\n}',
      blanks: [
        { id: 'idType', answer: 'string', alternatives: ['String'], placeholder: 'what type for IDs?', hint: 'UUIDs are represented as this type in TypeScript' },
        { id: 'roleType', answer: "'admin' | 'member'", alternatives: ['"admin" | "member"', "'admin'|'member'", '"admin"|"member"'], placeholder: 'what union type?', hint: 'A union of string literal types for the two roles' },
        { id: 'errorType', answer: 'string | null', alternatives: ['string|null', 'null | string'], placeholder: 'error or no error?', hint: 'The error field is a string when present, or absent' },
        { id: 'churnType', answer: 'number', alternatives: ['Number'], placeholder: 'what type for metrics?', hint: 'Churn rate is a numeric value like revenue and users' },
      ],
      explanation: 'Every field type is a decision that prevents divergence. If you leave the User.role type unspecified, one agent might use strings while another uses an enum. The contract file is the single source of truth.',
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
      type: 'code-fill',
      instruction: 'Complete this CLAUDE.md dispatch plan that assigns parallel agents with exclusive file ownership:',
      language: 'markdown',
      filename: 'CLAUDE.md',
      template: '## Parallel Tasks — Run Simultaneously\n\n### Agent 1: Auth (owns {{authDir}})\nBuild login, signup, and password reset.\nUse the User type from src/types/contracts.ts.\nWrite tests in src/auth/__tests__/.\n\n### Agent 2: API (owns {{apiDir}})\nBuild REST endpoints for dashboard stats.\nUse {{responseType}} from src/types/contracts.ts.\nWrite tests in src/api/__tests__/.\n\n### Agent 3: Landing Page (owns {{marketingDir}})\nBuild the marketing landing page.\nNo dependencies on other agents.\n{{staticNote}}.',
      blanks: [
        { id: 'authDir', answer: 'src/auth/*', alternatives: ['src/auth'], placeholder: 'which directory?', hint: 'The auth agent owns all files under src/auth/' },
        { id: 'apiDir', answer: 'src/api/*', alternatives: ['src/api'], placeholder: 'which directory?', hint: 'The API agent owns all files under src/api/' },
        { id: 'responseType', answer: 'ApiResponse<T>', alternatives: ['ApiResponse', 'ApiResponse<T> type'], placeholder: 'which shared type?', hint: 'The generic response wrapper from the contracts file' },
        { id: 'marketingDir', answer: 'src/marketing/*', alternatives: ['src/marketing'], placeholder: 'which directory?', hint: 'The landing page agent owns all files under src/marketing/' },
        { id: 'staticNote', answer: 'Static content only', alternatives: ['Static content', 'static content only'], placeholder: 'what kind of content?', hint: 'The landing page has no dependencies — it is purely static' },
      ],
      explanation: 'Each agent has exclusive file ownership (no overlap), imports from a shared contract (read-only), and has a clear one-sentence scope. This is the dispatch pattern that makes parallel work safe.',
    },
    {
      type: 'checkpoint',
      xp: 5,
      message: 'You understand contracts and the dispatch pattern.',
    },

    // === DIAGRAM 3: When NOT to Parallelize ===
    {
      type: 'interactive-diagram',
      title: 'When NOT to Parallelize',
      body: "Not every task benefits from parallel execution. Step through this decision tree to learn when to parallelize and when to serialize.",
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
      stages: [
        {
          highlightNodes: ['task'],
          highlightEdges: [{ from: 'task', to: 'state' }],
          explanation: 'Start with a new task you want to parallelize. The first question to ask: does this task share mutable state with another task?',
        },
        {
          highlightNodes: ['state', 'serial'],
          highlightEdges: [{ from: 'state', to: 'serial' }],
          explanation: 'If tasks share state (same database table, same Zustand store, same config file), run them serially. Shared state is the most dangerous category for parallel work.',
        },
        {
          highlightNodes: ['state', 'files'],
          highlightEdges: [{ from: 'state', to: 'files' }],
          explanation: 'If tasks do NOT share state, ask next: do they each own their own files with no overlap?',
        },
        {
          highlightNodes: ['files', 'parallel'],
          highlightEdges: [{ from: 'files', to: 'parallel' }],
          explanation: 'If each task owns its files exclusively — parallelize with confidence. No shared state, no shared files, no conflicts.',
        },
        {
          highlightNodes: ['files', 'coord'],
          highlightEdges: [{ from: 'files', to: 'coord' }],
          explanation: 'If tasks touch overlapping files, restructure first. Extract shared code into a module, create a config pattern, or split the file. Then parallelize.',
        },
      ],
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
      type: 'multiple-choice',
      question: 'How do you prevent agents from making inconsistent assumptions (e.g., Agent A expects User.name while Agent B expects User.firstName)?',
      options: [
        'Let agents decide individually and reconcile at merge time',
        'Define shared contracts (types, interfaces) before any agent starts',
        'Use the same AI model for all agents so they make the same assumptions',
        'Have each agent read the other agents\' code first',
      ],
      correctIndex: 1,
      explanation: 'Shared contracts defined before agents start are the prevention. Shared file conflicts are prevented by exclusive ownership. Integration failures by planning the merge step. Duplicate work by giving non-overlapping scope.',
    },
    {
      type: 'checkpoint',
      xp: 5,
      message: 'You know the failure modes and how to prevent them.',
    },

    // === MATCH EXERCISE ===
    {
      type: 'match',
      instruction: 'Match each decomposition strategy to its best use case:',
      leftItems: [
        'Fan-out / Fan-in',
        'Pipeline',
        'Specialist delegation',
        'Competitive',
      ],
      rightItems: [
        'Process data through sequential stages',
        'Run identical tasks in parallel, merge results',
        'Route tasks to domain-expert agents',
        'Have multiple agents solve the same problem, pick the best',
      ],
      correctPairs: { 0: 1, 1: 0, 2: 2, 3: 3 },
      explanation: 'Fan-out parallelizes identical work. Pipeline chains sequential stages. Specialist delegation routes by expertise. Competitive redundancy ensures quality through comparison.',
    },

    // === PROMPT LAB: DECOMPOSITION PROMPT ===
    {
      type: 'prompt-lab',
      instruction: 'Write a decomposition prompt that breaks a SaaS dashboard build into agent-sized tasks with clear boundaries.',
      scenario: 'You need to build a SaaS dashboard with user authentication, a data visualization page, an API layer, and a billing page. Write a prompt to dispatch multiple agents in parallel.',
      starterPrompt: 'Build the dashboard with multiple agents.',
      responses: [
        {
          triggerKeywords: ['owns', 'boundary', 'contract', 'file ownership', 'interface'],
          response: "Understood. I'll dispatch 4 agents with exclusive file ownership:\n\n- Agent 1 (Auth): src/auth/* — login, signup, session management\n- Agent 2 (API): src/api/* — REST endpoints, response types\n- Agent 3 (Dashboard): src/dashboard/* — charts, tables, filters\n- Agent 4 (Billing): src/billing/* — Stripe integration, invoices\n\nShared contract: src/types/contracts.ts (read-only for all agents)\n\nStarting parallel execution...",
          quality: 'excellent',
          feedback: 'You specified agent roles, file ownership boundaries, and shared contracts. Each agent has a clear, non-overlapping scope. This is production-grade decomposition.',
        },
        {
          triggerKeywords: ['agent', 'auth', 'api', 'dashboard', 'billing'],
          response: "I'll set up the agents:\n\n- Agent 1: Build authentication\n- Agent 2: Build the API\n- Agent 3: Build the dashboard UI\n- Agent 4: Build billing\n\nShould I define the shared types first? Which files should each agent own?",
          quality: 'good',
          feedback: 'You identified the right agent roles, but without explicit file ownership and contracts, the agents will ask follow-up questions. Specify which directories each agent owns and define the shared interface upfront.',
        },
        {
          triggerKeywords: ['build', 'dashboard', 'multiple'],
          response: "I'll build the entire dashboard! Starting with auth, then the API, then the UI, then billing. I'll handle everything sequentially to avoid conflicts.\n\nCreating src/app/...",
          quality: 'poor',
          feedback: 'Too vague. The agent fell back to sequential execution because there were no boundaries defined. Without file ownership rules, it cannot safely parallelize. Specify agent roles, owned directories, and shared contracts.',
        },
      ],
      fallbackResponse: {
        response: "I'll build the dashboard. Let me figure out the agent split as I go...",
        feedback: 'Your prompt needs three things: (1) explicit agent roles with one-sentence descriptions, (2) file ownership boundaries so agents never touch the same files, and (3) a shared contract file that all agents read but none modify.',
      },
    },

    // === COMPARE: MONOLITHIC vs MULTI-AGENT ===
    {
      type: 'compare',
      title: 'Single agent vs agent fleet',
      body: 'The same SaaS dashboard build, two approaches. One agent doing everything sequentially versus four agents working in parallel with clear boundaries.',
      question: 'Which approach finishes faster with fewer integration issues?',
      correctSide: 'right',
      left: {
        label: 'Single Agent (Serial)',
        content: "1. Build auth (10 min)\n2. Build API (10 min)\n3. Build dashboard UI (12 min)\n4. Build billing (8 min)\n5. Total: ~40 minutes\n\nRisks:\n- Context window fills up by step 3\n- Agent forgets early decisions\n- One failure blocks everything\n- No parallelism possible",
      },
      right: {
        label: 'Agent Fleet (Parallel)',
        content: "Phase 0: Define contracts (5 min, you)\nPhase 1: 4 agents in parallel (12 min)\n  - Auth agent: src/auth/*\n  - API agent: src/api/*\n  - Dashboard agent: src/dashboard/*\n  - Billing agent: src/billing/*\nPhase 2: Integration merge (3 min)\nTotal: ~20 minutes\n\nBenefits:\n- Each agent has focused context\n- Failures are isolated\n- 2x faster wall-clock time",
      },
      explanation: 'The fleet approach is faster because independent tasks run simultaneously. Each agent operates with focused context (no context exhaustion), and failures in one agent do not block others. The upfront cost of defining contracts pays for itself many times over.',
    },

    // === HANDS-ON EXERCISE ===
    {
      type: 'multiple-choice',
      question: 'You are building a task management app with auth, a Kanban board UI, a REST API, and real-time WebSocket updates. Which tasks can start in parallel from the beginning?',
      options: [
        'Auth, API, UI, and WebSocket — all four are independent',
        'Auth, API, and WebSocket — the Kanban UI needs API response shapes first',
        'Only Auth and API — everything else depends on them',
        'None — they must all run sequentially',
      ],
      correctIndex: 1,
      explanation: 'Auth, API, and WebSocket are independent and can start in parallel. The Kanban UI needs to know the shape of task objects returned by the API (title, status, assignee, etc.). Without that contract, the UI agent would be guessing at data structures.',
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
      platforms: {
        windows: {
          expectedCommand: 'mkdir src\\auth, src\\api, src\\board, src\\realtime',
        },
      },
    },
    {
      type: 'code-fill',
      instruction: 'Complete this task graph documentation that assigns agents to phases with clear ownership and dependencies:',
      language: 'markdown',
      filename: 'CLAUDE.md',
      template: '## Task Graph\n\n### Phase 1 — Contracts (you, 5 min)\nDefine types in {{typesFile}}\n\n### Phase 2 — Parallel Agents\n- Agent A: Auth → {{authOwnership}} (independent)\n- Agent B: API → {{apiOwnership}} (independent)\n- Agent C: WebSocket → {{wsOwnership}} (independent)\n\n### Phase 3 — Dependent Work\n- Agent D: Kanban UI → src/board/*\n  (after {{dependency}} is defined)',
      blanks: [
        { id: 'typesFile', answer: 'src/types/task.ts', alternatives: ['src/types/contracts.ts', 'src/types/task'], placeholder: 'which file?', hint: 'The shared types file for the task management app' },
        { id: 'authOwnership', answer: 'src/auth/*', alternatives: ['src/auth'], placeholder: 'which directory?', hint: 'Agent A owns all auth files' },
        { id: 'apiOwnership', answer: 'src/api/*', alternatives: ['src/api'], placeholder: 'which directory?', hint: 'Agent B owns all API files' },
        { id: 'wsOwnership', answer: 'src/realtime/*', alternatives: ['src/realtime', 'src/websocket/*'], placeholder: 'which directory?', hint: 'Agent C owns all realtime/WebSocket files' },
        { id: 'dependency', answer: 'API contract', alternatives: ['api contract', 'the API contract', 'API response shapes'], placeholder: 'what dependency?', hint: 'The Kanban UI needs to know the data shapes from the API' },
      ],
      explanation: 'Each agent gets exclusive file ownership, works against the shared types, and dependencies are explicit. The Kanban UI waits for the API contract so it can type its components correctly.',
    },
    {
      type: 'multiple-choice',
      question: 'The Kanban UI depends on the API response shapes. How can you make the UI agent start in parallel with the API agent instead of waiting?',
      options: [
        'Have the UI agent guess the response shapes and fix them later',
        'Define the API contract (response shapes, endpoint paths) upfront so both agents work against the same contract',
        'Give the UI agent access to the API agent\'s worktree so it can read the code',
        'Start the UI agent with mock data and never connect it to the real API',
      ],
      correctIndex: 1,
      explanation: 'If you define the API contract upfront, the UI agent CAN start in parallel with the API agent. Both work against the contract — the API implements it, the UI consumes it. This is how you go from 3 parallel agents to 4.',
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
      message: 'Lesson complete! You understand how to split work across multiple AI agents for faster results.',
    },
  ],
}

export default content
