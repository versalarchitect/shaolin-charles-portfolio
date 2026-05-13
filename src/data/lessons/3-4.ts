import type { LessonContent } from './types'

const content: LessonContent = {
  lessonId: '3-4',
  steps: [
    // === INTRO (keep passive) ===
    {
      type: 'info',
      title: 'Planning which tasks can run at the same time',
      body: "Parallelism is powerful, but blindly launching five agents at the same time can create chaos. Some tasks depend on others — the UI can't be built until the API types exist, and the API can't be built until the database schema is locked. Task graphs give you a visual model for what can run simultaneously and what must wait. This lesson teaches you to decompose a feature into a dependency graph, find the critical path, and maximize parallelism without breaking anything.",
    },
    // CONVERTED: info → multiple-choice (#1)
    {
      type: 'multiple-choice',
      question: 'What is a task graph (DAG) used for in agent orchestration?',
      options: [
        'It tracks how much time each agent has spent coding',
        'It models tasks and dependencies so you can identify what runs in parallel vs what must wait',
        'It visualizes the git commit history of a project',
        'It monitors CPU and memory usage of running agents',
      ],
      correctIndex: 1,
      explanation: "A task graph is a directed acyclic graph (DAG) where nodes represent tasks and edges represent dependencies. If there's an edge from A to B, then A must finish before B can start. Tasks with no shared edges are independent — they can run in parallel. Making the implicit task graph explicit is how you find the fastest possible execution plan.",
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

    // === SIMPLE TASK GRAPH DIAGRAM — CONVERTED: diagram → interactive-diagram (#2) ===
    {
      type: 'interactive-diagram',
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
      stages: [
        { highlightNodes: ['spec'], explanation: 'Spec has no incoming edges — it is the starting point. Every other task waits for it.' },
        { highlightNodes: ['spec', 'auth', 'db'], highlightEdges: [{ from: 'spec', to: 'auth' }, { from: 'spec', to: 'db' }], explanation: 'After Spec completes, Auth and Database both depend only on Spec. They can run simultaneously — this is a fan-out.' },
        { highlightNodes: ['auth', 'db', 'api'], highlightEdges: [{ from: 'auth', to: 'api' }, { from: 'db', to: 'api' }], explanation: 'API depends on both Auth and Database. It waits for whichever finishes last — this is a fan-in bottleneck.' },
        { highlightNodes: ['api', 'ui', 'deploy'], highlightEdges: [{ from: 'api', to: 'ui' }, { from: 'ui', to: 'deploy' }], explanation: 'UI waits for API, then Deploy waits for UI. This is a strict chain — no parallelism possible here.' },
      ],
    },
    {
      type: 'checkpoint',
      xp: 2,
      message: 'Task graph fundamentals locked in!',
    },

    // === READING THE GRAPH — CONVERTED: info → multiple-choice (#3) ===
    {
      type: 'multiple-choice',
      question: 'Looking at the task graph, why are Auth and Database able to run in parallel?',
      options: [
        'They both depend on API, which runs first',
        'They share no edges between each other — both depend only on Spec',
        'The orchestrator manually launches them at the same time',
        'Database is faster than Auth so it finishes before the dependency matters',
      ],
      correctIndex: 1,
      explanation: "Auth and Database both depend only on Spec. Once Spec is done, they share no edges between them, so they can run at the same time. The key insight: parallel tasks are free speed, but convergence points (like API) create bottlenecks. Your job as a director is to minimize bottleneck wait time.",
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

    // === CRITICAL PATH — CONVERTED: info → multiple-choice (#4) ===
    {
      type: 'multiple-choice',
      question: 'What is the critical path in a task graph?',
      options: [
        'The path with the fewest tasks',
        'The path that has the most important features',
        'The longest chain of dependent tasks from start to finish — it determines minimum total time',
        'The path where agents are most likely to produce bugs',
      ],
      correctIndex: 2,
      explanation: "The critical path is the longest chain of dependent tasks from start to finish. It determines the minimum possible time to complete the entire project — no amount of parallelism can shorten it. Every other path is shorter, meaning those tasks have slack. Finding the critical path tells you exactly where to focus optimization efforts.",
    },
    // CONVERTED: diagram → interactive-diagram (#5)
    {
      type: 'interactive-diagram',
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
      stages: [
        { highlightNodes: ['auth', 'db'], explanation: 'Auth (2h) and DB (1h) start in parallel. DB finishes first — it has 1 hour of slack.' },
        { highlightNodes: ['auth', 'api'], highlightEdges: [{ from: 'auth', to: 'api' }, { from: 'db', to: 'api' }], explanation: 'API waits for the slower predecessor (Auth at 2h). DB was done an hour ago — its slack absorbed.' },
        { highlightNodes: ['auth', 'api', 'ui', 'deploy'], highlightEdges: [{ from: 'auth', to: 'api' }, { from: 'api', to: 'ui' }, { from: 'ui', to: 'deploy' }], explanation: 'Critical path: Auth(2h) -> API(3h) -> UI(2h) -> Deploy(0.5h) = 7.5h minimum. Only optimizing tasks on this path reduces total time.' },
      ],
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

    // === FINDING THE CRITICAL PATH — CONVERTED: info → multiple-choice (#6) ===
    {
      type: 'multiple-choice',
      question: 'What is the algorithm for finding the critical path in a task graph?',
      options: [
        'Pick the task with the most dependencies and follow it to the end',
        'List every path from start to finish, sum durations along each, and pick the longest',
        'Run all tasks and measure which one takes the longest',
        'Find the task with zero slack and that is the critical path',
      ],
      correctIndex: 1,
      explanation: "Step 1: List every path from start to finish. Step 2: Add up the durations along each path. Step 3: The longest path is the critical path. In the earlier example, Auth(2h)->API(3h)->UI(2h)->Deploy(0.5h) = 7.5h vs DB(1h)->API(3h)->UI(2h)->Deploy(0.5h) = 6.5h. For agent orchestration with 10-15 tasks, pen and paper works.",
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

    // === INTERFACE CONTRACTS — CONVERTED: info → compare (#7 — merging two info concepts) ===
    {
      type: 'compare',
      title: 'Sequential dependency vs interface contract',
      body: 'When Task B depends on Task A, you have two approaches. One blocks progress. The other unlocks parallel work.',
      question: 'Which approach lets both agents work simultaneously?',
      correctSide: 'right',
      left: {
        label: 'Sequential (Wait for A)',
        content: "1. Agent A builds the full REST API\n2. Agent A finishes (takes 3 hours)\n3. Only NOW can Agent B start the frontend\n4. Agent B builds against the real API\n5. Total time: 3h + 2h = 5h\n\nWhy it's slow:\n- Agent B sits idle for 3 hours\n- No parallelism possible\n- One agent working at a time",
      },
      right: {
        label: 'Interface Contract (Define types first)',
        content: "1. Define API types in shared contract file (15 min)\n2. Agent A builds API against the contract\n3. Agent B builds frontend against the SAME contract\n4. Both work in parallel after the contract\n5. Total time: 15min + max(3h, 2h) = 3.25h\n\nWhy it's fast:\n- Only wait for the interface definition (minutes)\n- Both agents build against the agreed types\n- Contract guarantees clean integration",
      },
      explanation: "The dependency still exists, but instead of waiting for the full implementation, you only wait for the interface definition (minutes instead of hours). Both agents then build against the same contract simultaneously. This is the interface contract trick.",
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
    // CONVERTED: code-demo → code-fill (#8)
    {
      type: 'code-fill',
      instruction: 'Complete this shared interface contract that both the API and UI agents will build against. Define the types so neither agent blocks the other.',
      language: 'typescript',
      filename: 'src/types/api-contract.ts',
      template: '// This file is the contract between the API and UI agents.\n// Define it FIRST, before either agent starts building.\n\nexport interface {{mainType}} {\n  id: string\n  title: string\n  completed: {{boolType}}\n  createdAt: string\n}\n\nexport interface CreateTodoRequest {\n  title: {{titleType}}\n}\n\nexport interface ApiRoutes {\n  \'GET /todos\': { response: {{listResponse}} }\n  \'POST /todos\': { body: CreateTodoRequest; response: Todo }\n  \'PATCH /todos/:id\': { body: {{partialType}}; response: Todo }\n  \'DELETE /todos/:id\': { response: void }\n}',
      blanks: [
        { id: 'mainType', answer: 'Todo', placeholder: 'entity name?', hint: 'The main entity this API manages' },
        { id: 'boolType', answer: 'boolean', placeholder: 'type?', hint: 'A true/false type in TypeScript' },
        { id: 'titleType', answer: 'string', placeholder: 'type?', hint: 'The type for a text title field' },
        { id: 'listResponse', answer: 'Todo[]', alternatives: ['Array<Todo>'], placeholder: 'response type?', hint: 'An array of the main entity' },
        { id: 'partialType', answer: 'Partial<Todo>', placeholder: 'partial update type?', hint: 'TypeScript utility type that makes all fields optional' },
      ],
      explanation: 'The contract defines the exact shapes both agents build against. The API agent implements these types as real endpoints. The UI agent imports and uses them for type-safe fetch calls. Neither blocks the other.',
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

    // === RE-SEQUENCING — CONVERTED: info+info → compare (#9) ===
    {
      type: 'compare',
      title: 'Static plan vs dynamic re-sequencing',
      body: "Plans don't survive contact with reality. Should you stick to the original schedule or adapt on the fly?",
      question: 'Which approach makes better use of agent capacity when things go off-plan?',
      correctSide: 'right',
      left: {
        label: 'Static (Stick to the plan)',
        content: "14:00  Agent A starts Auth (est. 2h)\n14:00  Agent B starts Database (est. 1h)\n14:45  Agent B finishes Database early!\n14:45  Agent B waits... (next task scheduled for 16:00)\n15:30  Agent A finishes Auth\n15:30  Agent A starts API\n16:00  Agent B finally starts test stubs\n\nProblem:\n- Agent B idle for 1h15m\n- Wasted parallelism\n- Total time: longer than necessary",
      },
      right: {
        label: 'Dynamic (Re-sequence on the fly)',
        content: "14:00  Agent A starts Auth (est. 2h)\n14:00  Agent B starts Database (est. 1h)\n14:45  Agent B finishes Database early!\n14:45  > Re-assign Agent B to: write API test stubs\n       (no unmet dependencies, was scheduled for later)\n15:30  Agent A finishes Auth, starts API\n15:30  Agent B has test stubs ready — API tests run\n       immediately as Agent A writes each endpoint\n\nResult: API tests run in parallel with implementation.\nTotal time saved: ~1h",
      },
      explanation: "Idle agents are wasted parallelism. Good directors re-sequence dynamically: when an agent finishes early, scan the task graph for any task whose dependencies are met and reassign. The task graph is a living document, not a fixed plan.",
    },
    // CONVERTED: code-demo → code-fill (#10)
    {
      type: 'code-fill',
      instruction: 'Complete this orchestration log showing dynamic re-sequencing when Agent B finishes early:',
      language: 'text',
      filename: 'agent-orchestration-log.txt',
      template: '14:00  Agent A starts Auth     (est. 2h)\n14:00  Agent B starts {{task1}}  (est. 1h)\n14:45  Agent B finishes {{task1}} early!\n14:45  > Re-assign Agent B to: write {{newTask}}\n       ({{reason}}, were scheduled for later)\n15:30  Agent A finishes Auth\n15:30  Agent A starts {{nextTask}} implementation',
      blanks: [
        { id: 'task1', answer: 'Database', alternatives: ['DB', 'database'], placeholder: 'original task?', hint: 'The task Agent B was originally assigned' },
        { id: 'newTask', answer: 'API test stubs', alternatives: ['test stubs', 'API tests'], placeholder: 'reassigned task?', hint: 'What can Agent B do now that has no unmet dependencies?' },
        { id: 'reason', answer: 'API tests have no dependencies', alternatives: ['no dependencies', 'no unmet dependencies'], placeholder: 'why this task?', hint: 'Why can this task start now?' },
        { id: 'nextTask', answer: 'API', alternatives: ['api'], placeholder: 'next task for Agent A?', hint: 'What does Agent A work on after Auth?' },
      ],
      explanation: 'When an agent finishes early, redirect it to the next available task with no unmet dependencies. This compresses the total timeline by keeping all agents productive.',
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

    // === INTERACTIVE: MATCH ===
    {
      type: 'match',
      instruction: 'Match each task relationship to its dependency type:',
      leftItems: ['Auth system -> API routes need it', 'UI components (independent)', 'Payment system -> needs API types', 'Test suite -> needs all features'],
      rightItems: ['Blocking dependency -- must complete first', 'Independent -- can run in parallel', 'Partial dependency -- needs interface contract only', 'Gate -- blocks final integration'],
      correctPairs: { 0: 0, 1: 1, 2: 2, 3: 3 },
      explanation: 'Blocking dependencies must finish first. Independent tasks run in parallel freely. Partial dependencies only need the interface (types), not the implementation. Gates require everything before they can run.',
    },

    // === INTERACTIVE: TASK GRAPH WITH CRITICAL PATH ===
    {
      type: 'interactive-diagram',
      title: 'Simple Task Graph (Step Through)',
      body: 'Step through this task graph to understand dependencies, parallelism, and the critical path.',
      diagram: {
        direction: 'TB',
        nodes: [
          { id: 'spec', label: 'Spec', shape: 'rounded', highlight: true },
          { id: 'auth', label: 'Auth', sublabel: '2h', shape: 'rect' },
          { id: 'db', label: 'Database', sublabel: '1h', shape: 'rect' },
          { id: 'api', label: 'API', sublabel: '3h', shape: 'rect' },
          { id: 'ui', label: 'UI', sublabel: '2h', shape: 'rect' },
          { id: 'deploy', label: 'Deploy', sublabel: '0.5h', shape: 'pill' },
        ],
        edges: [
          { from: 'spec', to: 'auth' },
          { from: 'spec', to: 'db' },
          { from: 'auth', to: 'api' },
          { from: 'db', to: 'api', dashed: true },
          { from: 'api', to: 'ui' },
          { from: 'ui', to: 'deploy' },
        ],
      },
      stages: [
        { highlightNodes: ['spec'], explanation: 'Spec has no incoming edges — it is the starting point. Everything else waits for it.' },
        { highlightNodes: ['spec', 'auth', 'db'], highlightEdges: [{ from: 'spec', to: 'auth' }, { from: 'spec', to: 'db' }], explanation: 'Fan-out: Auth (2h) and Database (1h) both depend only on Spec. They run in parallel — free speed.' },
        { highlightNodes: ['auth', 'db', 'api'], highlightEdges: [{ from: 'auth', to: 'api' }, { from: 'db', to: 'api' }], explanation: 'Fan-in: API depends on both Auth and DB. It waits for whichever finishes last (Auth at 2h). DB finishes at 1h — it has 1h of slack.' },
        { highlightNodes: ['auth', 'api', 'ui', 'deploy'], highlightEdges: [{ from: 'auth', to: 'api' }, { from: 'api', to: 'ui' }, { from: 'ui', to: 'deploy' }], explanation: 'Critical path: Auth(2h) -> API(3h) -> UI(2h) -> Deploy(0.5h) = 7.5h minimum. This is the longest chain — no parallelism can shorten it.' },
      ],
    },

    // === PRACTICE: DECOMPOSE A TODO APP — CONVERTED: info → multiple-choice (#11) ===
    {
      type: 'multiple-choice',
      question: 'You are building a todo app with auth, database, API, frontend, and deployment. Which task should come first?',
      options: [
        'Build the React UI so stakeholders can see progress',
        'Deploy to production to secure the URL',
        'Design the database schema — it defines the data model everything else depends on',
        'Implement API endpoints since they connect everything',
      ],
      correctIndex: 2,
      explanation: "The database schema defines the data model that the API, auth, and UI all depend on. Without it, you can't define the interface contracts that enable parallel work. Think about where interface contracts could help: API types defined from the schema let the frontend agent start immediately.",
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
    // CONVERTED: code-demo → code-fill (#12 — bonus conversion for margin)
    {
      type: 'code-fill',
      instruction: 'Complete this prompt for Claude Code to decompose a feature into a task graph:',
      language: 'text',
      filename: 'prompt.txt',
      template: 'Decompose this feature into a task dependency graph:\n\nFeature: Todo app with auth, database, API, and React UI\n\nFor each task, specify:\n1. Task name and {{timeField}}\n2. {{depsField}} (which tasks must finish first)\n3. Outputs (what this task produces for others)\n4. {{contractField}} (shared types between tasks)\n\nThen identify:\n- Which tasks can run in {{execMode}}\n- The {{pathName}} and minimum total time\n- Where interface contracts can unlock more parallelism',
      blanks: [
        { id: 'timeField', answer: 'estimated time', alternatives: ['time estimate', 'duration'], placeholder: 'what per task?', hint: 'How long each task takes' },
        { id: 'depsField', answer: 'Dependencies', alternatives: ['dependencies', 'Deps'], placeholder: 'what relationships?', hint: 'What must finish before this task starts' },
        { id: 'contractField', answer: 'Interface contracts', alternatives: ['Contracts', 'interface contracts', 'Shared types'], placeholder: 'shared agreements?', hint: 'Agreements about shared types between agents' },
        { id: 'execMode', answer: 'parallel', alternatives: ['simultaneously', 'concurrently'], placeholder: 'execution style?', hint: 'Running at the same time' },
        { id: 'pathName', answer: 'critical path', alternatives: ['Critical path'], placeholder: 'longest chain name?', hint: 'The longest dependent chain that sets minimum time' },
      ],
      explanation: 'This prompt gives Claude Code everything it needs to decompose any feature: task structure, dependencies, outputs, contracts, and the analysis of parallelism and critical path.',
    },
    {
      type: 'terminal',
      instruction: 'Start Claude Code to decompose a feature into a task graph:',
      expectedCommand: 'claude',
      hint: 'Launch Claude Code so you can paste the task graph prompt',
    },

    // === COMMON PATTERNS — CONVERTED: info → multiple-choice (already existed, keep it) ===
    // CONVERTED: diagram(decision tree implied) → interactive-diagram of 3 patterns (#13 — extra)
    {
      type: 'multiple-choice',
      question: 'Which dependency pattern represents the greatest opportunity for parallelism?',
      options: [
        'Chain — strict sequential tasks',
        'Fan-out — one task enables many parallel tasks',
        'Fan-in — many tasks must complete before one starts',
        'All patterns offer equal parallelism',
      ],
      correctIndex: 1,
      explanation: "Three patterns show up repeatedly. Fan-out: one task enables multiple parallel tasks (Spec enables Auth + DB + Docs) — this is where parallelism lives. Fan-in: multiple tasks must all complete before one can start — this creates a bottleneck. Chain: strict sequential dependency — zero parallelism. Recognizing these instantly tells you where speed hides and where bottlenecks lurk.",
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
      message: 'Task planning complete! You can figure out the fastest way to split work across multiple AI agents.',
    },
  ],
}

export default content
