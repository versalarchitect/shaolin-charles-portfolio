import type { LessonContent } from './types'

const content: LessonContent = {
  lessonId: '3-4',
  steps: [
    // === INTRO ===
    {
      type: 'info',
      title: 'Not everything can run at once',
      body: "Parallelism is powerful, but blindly launching five agents at the same time can create chaos. Some tasks depend on others — the UI can't be built until the API types exist, and the API can't be built until the database schema is locked. Task graphs give you a visual model for what can run simultaneously and what must wait. This lesson teaches you to decompose a feature into a dependency graph, find the critical path, and maximize parallelism without breaking anything.",
    },
    {
      type: 'info',
      title: 'What is a task graph?',
      body: "A task graph is a directed acyclic graph (DAG) where nodes represent tasks and edges represent dependencies. If there's an edge from A to B, then A must finish before B can start. Tasks with no shared edges are independent — they can run in parallel. Every software project, whether you draw it or not, has an implicit task graph. Making it explicit is how you find the fastest possible execution plan.",
    },
    {
      type: 'multiple-choice',
      question: 'In a task graph, what does an edge from Task A to Task B mean?',
      options: [
        'A and B can run in parallel',
        'A must finish before B can start',
        'B must finish before A can start',
        'A and B are the same task',
      ],
      correctIndex: 1,
      explanation: 'An edge from A to B means B depends on A — so A must complete before B begins. This is the fundamental rule of dependency graphs.',
    },

    // === SIMPLE TASK GRAPH DIAGRAM ===
    {
      type: 'diagram',
      title: 'Simple Task Graph',
      body: 'A typical feature build. Spec comes first, then Auth and Database run in parallel. API needs both, then UI, then Deploy.',
      diagram: {
        direction: 'TB',
        nodes: [
          { id: 'spec', label: 'Spec', shape: 'rounded', highlight: true },
          { id: 'auth', label: 'Auth', shape: 'rect' },
          { id: 'db', label: 'Database', shape: 'rect' },
          { id: 'api', label: 'API', sublabel: 'needs both', shape: 'rect' },
          { id: 'ui', label: 'UI', shape: 'rect' },
          { id: 'deploy', label: 'Deploy', shape: 'pill', highlight: true },
        ],
        edges: [
          { from: 'spec', to: 'auth' },
          { from: 'spec', to: 'db' },
          { from: 'auth', to: 'api' },
          { from: 'db', to: 'api' },
          { from: 'api', to: 'ui' },
          { from: 'ui', to: 'deploy' },
        ],
      },
    },
    {
      type: 'checkpoint',
      xp: 2,
      message: 'Task graph fundamentals locked in!',
    },

    // === READING THE GRAPH ===
    {
      type: 'info',
      title: 'Reading the graph',
      body: "Look at the graph above. Spec has no incoming edges — it's the starting point. Auth and Database both depend only on Spec, so once Spec is done, they can run simultaneously. API depends on both Auth and Database, so it waits for whichever finishes last. This is the key insight: parallel tasks are free speed, but convergence points (like API) create bottlenecks. Your job as a director is to minimize bottleneck wait time.",
    },
    {
      type: 'multiple-choice',
      question: 'In the task graph above, which tasks can run in parallel?',
      options: [
        'Spec and Auth',
        'Auth and Database',
        'API and UI',
        'Database and Deploy',
      ],
      correctIndex: 1,
      explanation: 'Auth and Database both depend only on Spec. Once Spec is done, they share no edges between them, so they can run at the same time. Every other pair has a dependency chain between them.',
    },

    // === CRITICAL PATH ===
    {
      type: 'info',
      title: 'The critical path',
      body: "The critical path is the longest chain of dependent tasks from start to finish. It determines the minimum possible time to complete the entire project — no amount of parallelism can shorten it. Every other path is shorter, meaning those tasks have slack: they can start later or take longer without delaying the project. Finding the critical path tells you exactly where to focus optimization efforts.",
    },
    {
      type: 'diagram',
      title: 'Critical Path',
      body: 'The highlighted chain is the critical path: 2h + 3h + 2h + 0.5h = 7.5h minimum. Database (1h) runs in parallel but finishes before Auth, so it has slack and is not on the critical path.',
      diagram: {
        direction: 'LR',
        nodes: [
          { id: 'auth', label: 'Auth', sublabel: '2h', shape: 'rect', highlight: true },
          { id: 'db', label: 'DB', sublabel: '1h', shape: 'rect' },
          { id: 'api', label: 'API', sublabel: '3h', shape: 'rect', highlight: true },
          { id: 'ui', label: 'UI', sublabel: '2h', shape: 'rect', highlight: true },
          { id: 'deploy', label: 'Deploy', sublabel: '0.5h', shape: 'pill', highlight: true },
        ],
        edges: [
          { from: 'auth', to: 'api' },
          { from: 'db', to: 'api', dashed: true },
          { from: 'api', to: 'ui' },
          { from: 'ui', to: 'deploy' },
        ],
      },
    },
    {
      type: 'multiple-choice',
      question: 'If you could speed up one task to reduce total project time, which should you target?',
      options: [
        'DB (1h) — it is the shortest task',
        'API (3h) — it is on the critical path and the longest task',
        'Deploy (0.5h) — it runs last',
        'DB (1h) — it runs in parallel',
      ],
      correctIndex: 1,
      explanation: 'Only tasks on the critical path affect total project time. Speeding up DB does nothing — it already finishes before Auth. API is the longest critical-path task, so reducing it directly reduces the minimum total time.',
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'Critical path analysis unlocked!',
    },

    // === FINDING THE CRITICAL PATH ===
    {
      type: 'info',
      title: 'How to find the critical path',
      body: "Step 1: List every path from start to finish. Step 2: Add up the durations along each path. Step 3: The longest path is the critical path. In the example above, there are two paths: Auth(2h) -> API(3h) -> UI(2h) -> Deploy(0.5h) = 7.5h, and DB(1h) -> API(3h) -> UI(2h) -> Deploy(0.5h) = 6.5h. The first path is longer, so it's the critical path. In complex graphs, tools like topological sort automate this, but for agent orchestration you'll rarely have more than 10-15 tasks — pen and paper works.",
    },
    {
      type: 'order',
      instruction: 'Order these steps for finding the critical path:',
      items: [
        'Pick the path with the longest total duration',
        'List every path from start to finish',
        'Sum the task durations along each path',
        'Draw the task dependency graph',
      ],
      correctOrder: [3, 1, 2, 0],
    },

    // === INTERFACE CONTRACTS ===
    {
      type: 'info',
      title: 'The interface contract trick',
      body: "Here's where it gets powerful. When Task B depends on Task A's output, you don't have to wait for A to finish. You can define the interface — the shape of A's output — upfront, and let B build against that contract immediately. Example: Agent A is building a REST API. Agent B is building the React frontend. If you define the API types (routes, request/response shapes) as a shared contract, Agent B can start coding against those types while Agent A is still implementing the actual endpoints. Both agents work in parallel, and the contract guarantees they'll integrate cleanly.",
    },
    {
      type: 'diagram',
      title: 'Interface Contract',
      body: 'Agent A produces the contract first (API types). Agent B builds against it. Both can work in parallel after the contract is defined.',
      diagram: {
        direction: 'TB',
        nodes: [
          { id: 'a', label: 'Agent A', sublabel: 'API builder', shape: 'rounded' },
          { id: 'contract', label: 'Contract', sublabel: 'API types', shape: 'rect', highlight: true },
          { id: 'b', label: 'Agent B', sublabel: 'UI builder', shape: 'rounded' },
        ],
        edges: [
          { from: 'a', to: 'contract', label: 'defines' },
          { from: 'contract', to: 'b', label: 'builds against' },
        ],
      },
    },
    {
      type: 'code-demo',
      title: 'A shared interface contract',
      body: 'Define the API types in a shared file. The API agent implements them, the UI agent imports and uses them. Neither blocks the other.',
      language: 'typescript',
      filename: 'src/types/api-contract.ts',
      code: "// This file is the contract between the API and UI agents.\n// Define it FIRST, before either agent starts building.\n\nexport interface Todo {\n  id: string\n  title: string\n  completed: boolean\n  createdAt: string\n}\n\nexport interface CreateTodoRequest {\n  title: string\n}\n\nexport interface ApiRoutes {\n  'GET /todos': { response: Todo[] }\n  'POST /todos': { body: CreateTodoRequest; response: Todo }\n  'PATCH /todos/:id': { body: Partial<Todo>; response: Todo }\n  'DELETE /todos/:id': { response: void }\n}",
    },
    {
      type: 'multiple-choice',
      question: 'Why does defining an interface contract increase parallelism?',
      options: [
        'It makes the code run faster at runtime',
        'It removes the dependency between the two tasks entirely',
        'It turns a sequential dependency into a smaller upfront task, letting both agents work in parallel after',
        'It eliminates the need for testing',
      ],
      correctIndex: 2,
      explanation: 'The dependency still exists — but instead of waiting for the full implementation, you only wait for the interface definition (minutes instead of hours). Both agents then build against the same contract simultaneously.',
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'Interface contracts mastered!',
    },

    // === RE-SEQUENCING ===
    {
      type: 'info',
      title: 'Re-sequencing on the fly',
      body: "Plans don't survive contact with reality. An agent might finish its task early, or it might get blocked on an unexpected problem. Good directors re-sequence dynamically: when Agent A finishes Auth ahead of schedule, reassign it to help with the UI tests instead of letting it sit idle. When Agent B gets stuck on a tricky database migration, pull in another agent to unblock it. The task graph is a living document, not a fixed plan. Update it as conditions change.",
    },
    {
      type: 'code-demo',
      title: 'Re-sequencing in practice',
      body: 'When an agent finishes early, redirect it to the next available task that has no unmet dependencies.',
      language: 'text',
      filename: 'agent-orchestration-log.txt',
      code: "14:00  Agent A starts Auth     (est. 2h)\n14:00  Agent B starts Database  (est. 1h)\n14:45  Agent B finishes Database early!\n14:45  > Re-assign Agent B to: write API test stubs\n       (API tests have no dependencies, were scheduled for later)\n15:30  Agent A finishes Auth\n15:30  Agent A starts API implementation\n15:30  Agent B has test stubs ready — API tests will run\n       immediately as Agent A writes each endpoint\n\nResult: API tests run in parallel with API implementation\n        instead of sequentially after. Total time saved: ~1h",
    },
    {
      type: 'multiple-choice',
      question: 'An agent finishes its task 30 minutes early. What should you do?',
      options: [
        'Let it wait until the next planned task is ready',
        'Reassign it to the next available task with no unmet dependencies',
        'Have it redo the task it just finished to improve quality',
        'Shut it down to save API costs',
      ],
      correctIndex: 1,
      explanation: 'Idle agents are wasted parallelism. Scan the task graph for any task whose dependencies are already met and assign the agent to it. This compresses the total timeline.',
    },

    // === PRACTICE: DECOMPOSE A TODO APP ===
    {
      type: 'info',
      title: 'Practice: decompose a feature',
      body: "Let's apply everything. You're building a todo app with authentication. The feature set: user signup/login, a database for todos, a REST API, a React frontend, and deployment. Your job: identify which tasks depend on which, which can run in parallel, and what the critical path is. Think about where interface contracts could help.",
    },
    {
      type: 'order',
      instruction: 'Order these todo app tasks by dependency (what must come first):',
      items: [
        'Deploy to production',
        'Write the API contract types',
        'Build the React UI',
        'Implement API endpoints',
        'Design the database schema',
      ],
      correctOrder: [4, 1, 3, 2, 0],
    },
    {
      type: 'code-demo',
      title: 'Building the task graph prompt',
      body: 'Give this prompt to Claude Code to have it decompose any feature into a task graph with time estimates and parallel opportunities.',
      language: 'text',
      filename: 'prompt.txt',
      code: "Decompose this feature into a task dependency graph:\n\nFeature: Todo app with auth, database, API, and React UI\n\nFor each task, specify:\n1. Task name and estimated time\n2. Dependencies (which tasks must finish first)\n3. Outputs (what this task produces for others)\n4. Interface contracts (shared types between tasks)\n\nThen identify:\n- Which tasks can run in parallel\n- The critical path and minimum total time\n- Where interface contracts can unlock more parallelism",
    },
    {
      type: 'terminal',
      instruction: 'Start Claude Code to decompose a feature into a task graph:',
      expectedCommand: 'claude',
      hint: 'Launch Claude Code so you can paste the task graph prompt',
    },

    // === COMMON PATTERNS ===
    {
      type: 'info',
      title: 'Common dependency patterns',
      body: "Three patterns show up repeatedly. The fan-out: one task enables multiple parallel tasks (Spec enables Auth + DB + Docs). The fan-in: multiple tasks must all complete before one can start (Auth + DB + Config must all finish before API). The chain: strict sequential dependency (Schema -> Migration -> Seed -> API). Recognizing these patterns instantly tells you where parallelism lives and where bottlenecks hide.",
    },
    {
      type: 'multiple-choice',
      question: 'Which pattern represents the greatest opportunity for parallelism?',
      options: [
        'Chain — strict sequential tasks',
        'Fan-out — one task enables many parallel tasks',
        'Fan-in — many tasks must complete before one starts',
        'All patterns offer equal parallelism',
      ],
      correctIndex: 1,
      explanation: 'Fan-out is where parallelism lives. One task completes, and suddenly multiple independent tasks can run simultaneously. Chains offer zero parallelism, and fan-in creates a bottleneck waiting for the slowest predecessor.',
    },

    // === FINAL CHECKLIST ===
    {
      type: 'checklist',
      title: 'Task graph mastery checklist:',
      items: [
        'I can decompose a feature into tasks with explicit dependencies',
        'I can draw a dependency graph with nodes and directed edges',
        'I can identify which tasks are independent and parallelizable',
        'I can find the critical path by tracing the longest chain',
        'I know that only critical-path optimizations reduce total time',
        'I can define interface contracts to unlock parallel work between dependent tasks',
        'I re-sequence dynamically when agents finish early or get blocked',
      ],
    },
    {
      type: 'checkpoint',
      xp: 17,
      message: 'Task Graphs complete! You can now map any feature into a dependency graph and find the fastest execution plan.',
    },
  ],
}

export default content
