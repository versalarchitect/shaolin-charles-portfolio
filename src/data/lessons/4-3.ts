import type { LessonContent } from './types'

const content: LessonContent = {
  lessonId: '4-3',
  steps: [
    // === INTRODUCTION ===
    {
      type: 'info',
      title: 'Organizing code so AI agents can work in parallel',
      body: "Here is the core insight of this lesson: if two agents need to edit the same file at the same time, your architecture has failed. A module boundary in an agent-native codebase is not just a code organization concept — it is a parallelism boundary. Each module should be independently modifiable by one agent without conflicting with any other agent working on any other module. Your architecture IS the coordination layer. Get the boundaries right and agents can work in parallel without conflicts. Get them wrong and you are back to serial execution.",
    },
    {
      type: 'info',
      title: 'Why parallel agent work matters',
      body: "Speed. A fleet of 5 agents working in parallel builds 5x faster — but only if they never block each other. The moment two agents need to modify the same file, you have a merge conflict. The moment they share mutable state, you have a race condition. The moment one agent's output depends on another's, you have a serial dependency. Module boundaries are the architectural tool that eliminates all three. Design them intentionally or suffer coordination overhead that erases the parallelism advantage.",
    },

    // === THE CONFLICT MODEL ===
    {
      type: 'diagram',
      title: 'Monolith vs modular: conflict zones',
      body: 'In a monolith, agents frequently collide on shared files. In a modular system, each agent owns a distinct module with no overlap.',
      diagram: {
        direction: 'LR',
        nodes: [
          { id: 'monolith', label: 'Monolithic', sublabel: 'Shared files = conflicts', shape: 'rounded' },
          { id: 'agent_a', label: 'Agent A', sublabel: 'Edits routes.ts', shape: 'rect' },
          { id: 'agent_b', label: 'Agent B', sublabel: 'Edits routes.ts', shape: 'rect' },
          { id: 'conflict', label: 'MERGE CONFLICT', sublabel: 'Same file, different changes', shape: 'diamond' },
          { id: 'modular', label: 'Modular', sublabel: 'Isolated modules', shape: 'rounded', highlight: true },
          { id: 'agent_c', label: 'Agent C', sublabel: 'features/payments/', shape: 'rect' },
          { id: 'agent_d', label: 'Agent D', sublabel: 'features/orders/', shape: 'rect' },
          { id: 'success', label: 'NO CONFLICT', sublabel: 'Independent work', shape: 'diamond', highlight: true },
        ],
        edges: [
          { from: 'monolith', to: 'agent_a' },
          { from: 'monolith', to: 'agent_b' },
          { from: 'agent_a', to: 'conflict' },
          { from: 'agent_b', to: 'conflict' },
          { from: 'modular', to: 'agent_c' },
          { from: 'modular', to: 'agent_d' },
          { from: 'agent_c', to: 'success' },
          { from: 'agent_d', to: 'success' },
        ],
      },
    },
    {
      type: 'info',
      title: 'The conflict rate metric',
      body: "Run parallel agents on real tasks. Count how many sessions produce merge conflicts or require coordination. Divide by total sessions. That is your conflict rate. Below 5%: your boundaries work. 5-15%: friction exists but is manageable. Above 15%: your architecture is forcing serial work. Track which files cause conflicts — those are your boundary failures. A file that causes conflicts in 3+ parallel sessions needs to be split or restructured.",
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'Conflict model understood!',
    },

    // === INTERFACE CONTRACTS ===
    {
      type: 'info',
      title: 'Interface contracts: the key to independence',
      body: "Two modules can only work independently if they agree on the interface between them. An interface contract defines: (1) What types flow between modules, (2) What functions are callable from outside, (3) What events are emitted, (4) What guarantees each module provides. Once the contract is defined, agents building each module do not need to know ANYTHING about the other module's internals. They build to the contract. This is the mechanism that enables true parallel agent work.",
    },
    {
      type: 'code-demo',
      title: 'Interface contract between modules',
      body: 'The contract is defined FIRST, before any implementation. Both modules build independently against this shared agreement.',
      language: 'typescript',
      filename: 'src/contracts/order-payment.contract.ts',
      code: "/**\n * Contract: Orders → Payments\n * \n * The Orders module needs to charge customers.\n * The Payments module provides the charging capability.\n * Neither module imports the other's internal files.\n */\n\n// Types that flow between modules\nexport interface ChargeRequest {\n  orderId: string\n  customerId: string\n  amountCents: number\n  currency: 'USD' | 'EUR' | 'GBP'\n  idempotencyKey: string\n}\n\nexport interface ChargeResult {\n  success: boolean\n  transactionId?: string\n  failureReason?: string\n}\n\n// The interface that Payments exposes\nexport interface PaymentGateway {\n  charge(request: ChargeRequest): Promise<ChargeResult>\n  refund(transactionId: string, amountCents: number): Promise<ChargeResult>\n  getStatus(transactionId: string): Promise<'pending' | 'completed' | 'failed'>\n}\n\n// Events emitted by Payments (Orders subscribes)\nexport interface PaymentEvents {\n  'payment.completed': { orderId: string; transactionId: string }\n  'payment.failed': { orderId: string; reason: string }\n  'payment.refunded': { orderId: string; amountCents: number }\n}",
    },
    {
      type: 'info',
      title: 'Contract-first development for agents',
      body: "The workflow changes. Previously: build Module A, then figure out how Module B connects to it. Now: define the contract between A and B FIRST. Then dispatch two agents in parallel — one builds A's implementation of the contract, the other builds B's consumption of the contract. They never need to communicate. They never edit the same files. They both finish at roughly the same time. The contract file itself is written by you (the architect) before agents start. It IS your architecture.",
    },
    {
      type: 'multiple-choice',
      question: 'Two agents are building the Orders module and Payments module in parallel. Agent A (Orders) needs to call Agent B\'s (Payments) charge function. How should this work?',
      options: [
        'Agent A imports directly from Payments internal files and builds against the current implementation',
        'Agent A waits for Agent B to finish, then integrates against the built code',
        'Both agents build against a pre-defined interface contract — neither needs the other\'s implementation',
        'Agent A mocks the Payments module and you manually wire them together later',
      ],
      correctIndex: 2,
      explanation: 'The contract is defined before either agent starts. Agent A builds Orders to CALL the contract interface. Agent B builds Payments to IMPLEMENT the contract interface. Neither needs the other to exist. This is why contract-first enables true parallelism.',
    },
    {
      type: 'checkpoint',
      xp: 4,
      message: 'Interface contracts mastered!',
    },

    // === ELIMINATING SHARED MUTABLE STATE ===
    {
      type: 'info',
      title: 'Shared mutable state kills parallelism',
      body: "Any file that multiple agents might modify is shared mutable state at the architectural level. Common culprits: a central routes.ts file that registers all routes (every new feature adds a line). A shared types.ts that accumulates every type in the system. A configuration object that modules extend. A database migration file that multiple features modify. Each of these forces serial execution — agents must take turns modifying the shared file, or they conflict.",
    },
    {
      type: 'code-demo',
      title: 'Eliminating the shared routes file',
      body: 'BEFORE: every agent adds routes to one file (conflict magnet). AFTER: each module registers its own routes (zero conflicts).',
      language: 'typescript',
      filename: 'routes-refactor.ts',
      code: "// ❌ BEFORE: Shared routes file (ALL agents edit this)\n// src/routes.ts\nimport { paymentsRoutes } from './features/payments'\nimport { ordersRoutes } from './features/orders'\nimport { usersRoutes } from './features/users'\nimport { notificationsRoutes } from './features/notifications'\n\nexport const routes = [\n  ...paymentsRoutes,    // Agent A adds here\n  ...ordersRoutes,      // Agent B adds here\n  ...usersRoutes,       // Agent C adds here  \n  ...notificationsRoutes, // Agent D adds here\n  // Every new feature = edit this file = conflict\n]\n\n// ✅ AFTER: Auto-discovery (NO shared file to edit)\n// src/app.ts\nimport { glob } from 'fast-glob'\n\nasync function registerRoutes(app: App) {\n  const routeFiles = await glob('src/features/*/routes.ts')\n  for (const file of routeFiles) {\n    const mod = await import(file)\n    app.register(mod.default)\n  }\n}\n\n// Each feature owns its own routes.ts — no shared file needed\n// src/features/payments/routes.ts (only Agent A touches this)\n// src/features/orders/routes.ts (only Agent B touches this)",
    },
    {
      type: 'info',
      title: 'The shared types problem',
      body: "A central types.ts or shared/types/index.ts is another conflict magnet. Solution: each module defines its own types. Types that cross module boundaries live in the contract file between those specific modules. There is no single file that accumulates all types. If TypeA is only used by the payments module, it lives in payments/payments.types.ts. If it crosses into orders, it lives in contracts/order-payment.contract.ts. Nowhere else.",
    },
    {
      type: 'code-demo',
      title: 'Eliminating shared types',
      body: 'Types belong where they are used. Cross-module types live in the contract between those specific modules.',
      language: 'typescript',
      filename: 'type-ownership.ts',
      code: "// ❌ BEFORE: Global types file (conflict magnet)\n// src/types/index.ts\nexport interface Payment { ... }      // Used only by payments\nexport interface Order { ... }         // Used only by orders\nexport interface User { ... }          // Used only by users\nexport interface ChargeRequest { ... } // Crosses payments ↔ orders\n// Every agent adds types here → conflicts\n\n// ✅ AFTER: Types owned by their module\n// src/features/payments/payments.types.ts\nexport interface Payment {\n  id: string\n  amountCents: number\n  status: PaymentStatus\n}\n\n// src/features/orders/orders.types.ts  \nexport interface Order {\n  id: string\n  items: OrderItem[]\n  totalCents: number\n}\n\n// src/contracts/order-payment.contract.ts\n// ONLY types that cross boundaries live here\nexport interface ChargeRequest {\n  orderId: string\n  amountCents: number\n}",
    },
    {
      type: 'multiple-choice',
      question: 'Your app has a single database migration file that 3 agents need to modify simultaneously for their respective features. What is the best solution?',
      options: [
        'Use a locking mechanism so agents take turns editing the file',
        'Let agents create separate migration files (one per feature) that run in sequence',
        'Have one dedicated agent handle all database changes',
        'Use a NoSQL database that does not require migrations',
      ],
      correctIndex: 1,
      explanation: 'Separate migration files per feature means each agent creates its own file (e.g., 001_add_payments_table.sql, 002_add_orders_table.sql). No shared file to conflict on. The migration runner executes them in order. This is how every mature ORM works — and it is the pattern that enables parallel agent work on the database layer.',
    },
    {
      type: 'checkpoint',
      xp: 4,
      message: 'Shared state eliminated!',
    },

    // === DESIGNING BOUNDARIES ===
    {
      type: 'info',
      title: 'How to draw module boundaries',
      body: "The rule is not \"one module per feature\" — that is too simplistic. The rule is: one module per independently-modifiable unit. Ask: \"Can an agent add functionality to this module without ANY knowledge of other modules?\" If yes, the boundary is correct. If the agent needs to read or modify files in another module to complete its task, the boundary is wrong — either the modules are too coupled, or the responsibility split is unnatural.",
    },
    {
      type: 'info',
      title: 'Boundary litmus tests',
      body: "Three tests for a good boundary. (1) Single-agent test: Can one agent complete a full feature within this module? If it needs to cross into another module, the boundary is too narrow. (2) Parallel test: Can two agents work on different modules simultaneously without conflicts? If they share files, the boundary is too leaky. (3) Contract test: Can you define the interface between this module and its neighbors in under 20 lines of types? If the interface is enormous, the modules are too coupled.",
    },
    {
      type: 'code-demo',
      title: 'Well-bounded module structure',
      body: 'Each module is self-contained. An agent working on one module never needs to touch another.',
      language: 'text',
      filename: 'boundary-structure',
      code: "src/features/\n├── payments/\n│   ├── CLAUDE.md              # Module-specific rules\n│   ├── payments.handler.ts    # HTTP layer (routes, request parsing)\n│   ├── payments.service.ts    # Business logic\n│   ├── payments.repository.ts # Database queries\n│   ├── payments.schema.ts     # Validation (Zod)\n│   ├── payments.types.ts      # Internal types\n│   ├── payments.events.ts     # Events this module emits\n│   ├── payments.test.ts       # Unit + integration tests\n│   └── index.ts               # Public API (only this is importable)\n│\n├── orders/\n│   ├── CLAUDE.md\n│   ├── orders.handler.ts\n│   ├── orders.service.ts\n│   ├── orders.repository.ts\n│   ├── orders.schema.ts\n│   ├── orders.types.ts\n│   ├── orders.events.ts\n│   ├── orders.test.ts\n│   └── index.ts\n│\nsrc/contracts/\n├── order-payment.contract.ts   # Interface between orders ↔ payments\n├── order-notification.contract.ts\n└── user-payment.contract.ts",
    },
    {
      type: 'order',
      instruction: 'Order these steps for designing module boundaries in a new system:',
      items: [
        'Implement each module independently (one agent per module)',
        'Define interface contracts between adjacent modules',
        'Identify the core business domains (payments, orders, users, etc.)',
        'Validate: run parallel agents and measure conflict rate (<5%)',
        'Map data flow: which domains need to communicate?',
      ],
      correctOrder: [2, 4, 1, 0, 3],
    },
    {
      type: 'checkpoint',
      xp: 4,
      message: 'Boundary design mastered!',
    },

    // === VALIDATION ===
    {
      type: 'info',
      title: 'Measuring boundary effectiveness',
      body: "Theory is useless without measurement. Here is how you validate your boundaries work. (1) Dispatch 3-5 agents on different features simultaneously. (2) After all complete, run git diff across all branches. (3) Count files modified by more than one agent. (4) Calculate conflict rate: conflicting files / total modified files. (5) For each conflict, trace it back to a boundary failure. (6) Redesign the boundary and retest. This is empirical architecture — you measure and iterate, not guess.",
    },
    {
      type: 'info',
      title: 'Common boundary failures and fixes',
      body: "Failure: Multiple agents edit the app configuration file. Fix: Each module registers its own config — no central config file. Failure: Agents conflict on the database schema file. Fix: Per-module migration files. Failure: Agents both modify the shared error types. Fix: Each module defines its own error types; only cross-module errors live in contracts. Failure: Agents conflict on the test setup file. Fix: Each module has its own test setup; shared test utilities are read-only infrastructure.",
    },
    {
      type: 'multiple-choice',
      question: 'After running 10 parallel agent sessions, you find that 3 produced conflicts — all on src/middleware/auth.ts. What does this tell you?',
      options: [
        'The auth middleware is buggy and needs to be rewritten',
        'You should lock the auth file and only let one agent touch it',
        'Auth middleware is a shared dependency that multiple features need to modify — it needs to be decomposed into per-feature auth hooks or made configurable without code changes',
        'Three conflicts out of 10 is acceptable — do nothing',
      ],
      correctIndex: 2,
      explanation: 'A 30% conflict rate on one file means that file is a boundary failure. Multiple features are forced to modify it, which breaks parallelism. The fix is decomposition: either each feature defines its own auth rules (per-feature hooks) or the auth middleware becomes configurable via data (not code changes). The file should never need modification for a new feature.',
    },

    // === SYNTHESIS ===
    {
      type: 'info',
      title: 'Boundaries as architecture',
      body: "Module boundaries are not a code organization preference — they are the fundamental architectural decision for agent-native systems. Get boundaries right and you unlock true parallelism: 5 agents working 5x faster with zero coordination overhead. Get them wrong and you are back to one agent at a time, or worse — agents that conflict and produce broken code. The architect's job in an agent-native world is primarily this: draw boundaries so clean that agents never need to cross them.",
    },
    {
      type: 'checklist',
      title: 'Module boundaries for parallel work checklist:',
      items: [
        'I understand that module boundaries = parallelism boundaries',
        'I can define interface contracts between modules',
        'I can identify and eliminate shared mutable state (routes files, type files, config files)',
        'I use the three litmus tests: single-agent, parallel, and contract tests',
        'I know how to measure conflict rate empirically',
        'I can trace conflicts back to boundary failures and fix them',
        'I design for contract-first development where agents build independently',
      ],
    },
    {
      type: 'checkpoint',
      xp: 20,
      message: 'Module boundary design mastered! You can now design architectures where agent fleets work in true parallel.',
    },
  ],
}

export default content
