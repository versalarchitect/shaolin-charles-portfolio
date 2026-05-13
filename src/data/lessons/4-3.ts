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
      type: 'multiple-choice',
      question: 'A fleet of 5 agents working in parallel should build 5x faster. What prevents this in practice?',
      options: [
        'Agents are not fast enough individually',
        'Merge conflicts (same file), race conditions (shared state), and serial dependencies (one agent waits for another)',
        'Too many agents slow down the computer',
        'Agents cannot understand large codebases',
      ],
      correctIndex: 1,
      explanation: 'Speed — 5 agents working in parallel builds 5x faster, but only if they never block each other. Merge conflicts (same file), race conditions (shared mutable state), and serial dependencies (one agent\'s output depends on another) are the three killers. Module boundaries are the architectural tool that eliminates all three.',
    },

    // === THE CONFLICT MODEL ===
    {
      type: 'interactive-diagram',
      title: 'Monolith vs modular: conflict zones',
      body: 'Walk through how agents collide in a monolith versus working independently in a modular system.',
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
      stages: [
        {
          highlightNodes: ['monolith', 'agent_a', 'agent_b'],
          highlightEdges: [{ from: 'monolith', to: 'agent_a' }, { from: 'monolith', to: 'agent_b' }],
          explanation: 'In a monolith, Agent A and Agent B both receive tasks for different features. But the architecture forces them to edit the same shared file (routes.ts).',
        },
        {
          highlightNodes: ['agent_a', 'agent_b', 'conflict'],
          highlightEdges: [{ from: 'agent_a', to: 'conflict' }, { from: 'agent_b', to: 'conflict' }],
          explanation: 'Both agents modify routes.ts simultaneously. When they finish, the changes conflict. One agent\'s work must be redone. Parallelism is lost.',
        },
        {
          highlightNodes: ['modular', 'agent_c', 'agent_d'],
          highlightEdges: [{ from: 'modular', to: 'agent_c' }, { from: 'modular', to: 'agent_d' }],
          explanation: 'In a modular system, Agent C works in features/payments/ and Agent D works in features/orders/. Each module owns its own routes, types, and config.',
        },
        {
          highlightNodes: ['agent_c', 'agent_d', 'success'],
          highlightEdges: [{ from: 'agent_c', to: 'success' }, { from: 'agent_d', to: 'success' }],
          explanation: 'Zero file overlap means zero conflicts. Both agents complete independently and merge cleanly. True parallelism achieved through architecture.',
        },
      ],
    },
    {
      type: 'interactive-diagram',
      title: 'Monolith vs modular: conflict zones',
      body: 'Walk through how agents collide in a monolith versus working independently in a modular system.',
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
      stages: [
        {
          highlightNodes: ['monolith', 'agent_a', 'agent_b'],
          highlightEdges: [{ from: 'monolith', to: 'agent_a' }, { from: 'monolith', to: 'agent_b' }],
          explanation: 'In a monolith, both Agent A and Agent B are dispatched to work on different features. But the architecture forces them to edit the same shared files (routes.ts, types.ts, config.ts).',
        },
        {
          highlightNodes: ['agent_a', 'agent_b', 'conflict'],
          highlightEdges: [{ from: 'agent_a', to: 'conflict' }, { from: 'agent_b', to: 'conflict' }],
          explanation: 'Both agents modify routes.ts simultaneously. When they finish, the changes cannot be merged cleanly. One agent\'s work must be redone or manually reconciled. Parallelism is lost.',
        },
        {
          highlightNodes: ['modular', 'agent_c', 'agent_d'],
          highlightEdges: [{ from: 'modular', to: 'agent_c' }, { from: 'modular', to: 'agent_d' }],
          explanation: 'In a modular system, Agent C works exclusively in features/payments/ and Agent D works exclusively in features/orders/. Each module owns its own routes, types, and configuration.',
        },
        {
          highlightNodes: ['agent_c', 'agent_d', 'success'],
          highlightEdges: [{ from: 'agent_c', to: 'success' }, { from: 'agent_d', to: 'success' }],
          explanation: 'Zero file overlap means zero conflicts. Both agents complete their work independently and both merge cleanly. True parallelism achieved through architecture, not coordination.',
        },
      ],
    },
    {
      type: 'match',
      instruction: 'Match each module to the agent best suited to own it. Consider domain expertise and specialization.',
      leftItems: ['Auth module', 'Payments module', 'API layer', 'UI components'],
      rightItems: ['Agent-1 (security focus)', 'Agent-2 (Stripe specialist)', 'Agent-3 (REST patterns)', 'Agent-4 (React/Tailwind)'],
      correctPairs: { 0: 0, 1: 1, 2: 2, 3: 3 },
      explanation: 'Module ownership maps to agent specialization. Auth requires security expertise (Agent-1). Payments needs Stripe domain knowledge (Agent-2). API layer demands REST pattern fluency (Agent-3). UI components require React/Tailwind skills (Agent-4). When modules align with agent strengths, each agent works autonomously without needing cross-domain knowledge.',
    },
    {
      type: 'multiple-choice',
      question: 'You run 20 parallel agent sessions. 4 produce merge conflicts. What is your conflict rate and what does it mean?',
      options: [
        '4% — boundaries work perfectly',
        '20% — architecture is forcing serial work, boundaries need redesign',
        '80% — most sessions succeed so it is fine',
        '4 conflicts — not enough data to evaluate',
      ],
      correctIndex: 1,
      explanation: 'Conflict rate = conflicting sessions / total sessions = 4/20 = 20%. Below 5%: boundaries work. 5-15%: friction exists but is manageable. Above 15%: your architecture is forcing serial work. Track which files cause conflicts — those are your boundary failures. A file that causes conflicts in 3+ sessions needs to be split or restructured.',
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'Conflict model understood!',
    },

    // === INTERFACE CONTRACTS ===
    {
      type: 'multiple-choice',
      question: 'What does an interface contract define between two modules?',
      options: [
        'Which agent should build which module',
        'The internal implementation details of each module',
        'What types flow between modules, what functions are callable, what events are emitted, and what guarantees each module provides',
        'The deployment order for each module',
      ],
      correctIndex: 2,
      explanation: 'Two modules can only work independently if they agree on the interface between them. An interface contract defines: (1) What types flow between modules, (2) What functions are callable from outside, (3) What events are emitted, (4) What guarantees each module provides. Once defined, agents building each module do not need to know ANYTHING about the other module\'s internals. They build to the contract.',
    },
    {
      type: 'code-fill',
      instruction: 'Complete this interface contract between Orders and Payments. Fill in the types, fields, and event names so both modules can build independently.',
      language: 'typescript',
      template: '// Contract: Orders → Payments\n// Neither module imports the other\'s internal files.\n\nexport interface ChargeRequest {\n  orderId: string\n  customerId: string\n  amountCents: ___\n  currency: \'USD\' | \'EUR\' | \'GBP\'\n  idempotencyKey: ___\n}\n\nexport interface ChargeResult {\n  success: ___\n  transactionId?: string\n  failureReason?: string\n}\n\nexport interface PaymentGateway {\n  charge(request: ___): Promise<ChargeResult>\n  refund(transactionId: string, amountCents: number): Promise<___>\n}',
      blanks: [
        { id: 'amount-type', answer: 'number', alternatives: ['int'], hint: 'Monetary amounts in cents are numeric', placeholder: 'type' },
        { id: 'key-type', answer: 'string', alternatives: [], hint: 'Idempotency keys are text identifiers', placeholder: 'type' },
        { id: 'success-type', answer: 'boolean', alternatives: ['bool'], hint: 'Success or failure is true/false', placeholder: 'type' },
        { id: 'request-param', answer: 'ChargeRequest', alternatives: ['PaymentRequest'], hint: 'The interface defined above for charge requests', placeholder: 'type name' },
        { id: 'refund-return', answer: 'ChargeResult', alternatives: ['PaymentResult'], hint: 'Refund returns the same result type as charge', placeholder: 'type name' },
      ],
      filename: 'src/contracts/order-payment.contract.ts',
      explanation: 'The contract is defined FIRST, before any implementation. Both modules build independently against this shared agreement. The Orders agent calls charge() with a ChargeRequest; the Payments agent implements charge() returning a ChargeResult. Neither needs to know the other\'s internals.',
    },
    {
      type: 'multiple-choice',
      question: 'In contract-first development, who writes the contract file and when?',
      options: [
        'Agent A writes it after building Module A',
        'Agent B writes it after building Module B',
        'You (the architect) write it BEFORE any agent starts — it IS your architecture',
        'The agents negotiate the contract between themselves during implementation',
      ],
      correctIndex: 2,
      explanation: 'The workflow changes. Define the contract between A and B FIRST. Then dispatch two agents in parallel — one builds A\'s implementation, the other builds B\'s consumption. They never communicate. They never edit the same files. They both finish at roughly the same time. The contract file is written by you (the architect) before agents start. It IS your architecture.',
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

    // === NEW INTERACTIVE STEPS ===
    {
      type: 'code-fill',
      instruction: 'Complete this interface contract that two agents will share. Fill in the type names, field types, and return types so both agents can build independently.',
      language: 'typescript',
      template: '// Contract: Orders module → Payments module\n// Both agents build against this shared agreement.\n\nexport interface ___ {\n  orderId: ___\n  customerId: string\n  amountCents: ___\n  currency: \'USD\' | \'EUR\'\n  idempotencyKey: string\n}\n\nexport interface ___ {\n  success: boolean\n  transactionId?: string\n  failureReason?: ___\n}\n\nexport interface PaymentGateway {\n  charge(request: ChargeRequest): Promise<___>\n  refund(transactionId: string): Promise<ChargeResult>\n}',
      blanks: [
        { id: 'request-type', answer: 'ChargeRequest', alternatives: ['PaymentRequest', 'ChargePayload'], hint: 'Name describing a request to charge a payment', placeholder: 'TypeName' },
        { id: 'id-type', answer: 'string', alternatives: [], hint: 'The standard type for identifiers', placeholder: 'type' },
        { id: 'amount-type', answer: 'number', alternatives: ['int', 'integer'], hint: 'Monetary amounts in cents are whole numbers', placeholder: 'type' },
        { id: 'result-type', answer: 'ChargeResult', alternatives: ['PaymentResult', 'ChargeResponse'], hint: 'Name describing the result of a charge operation', placeholder: 'TypeName' },
        { id: 'reason-type', answer: 'string', alternatives: [], hint: 'Human-readable failure explanations are text', placeholder: 'type' },
        { id: 'return-type', answer: 'ChargeResult', alternatives: ['PaymentResult', 'ChargeResponse'], hint: 'The charge method returns the same result type', placeholder: 'TypeName' },
      ],
      filename: 'src/contracts/order-payment.contract.ts',
      explanation: 'Interface contracts define the exact types that flow between modules. Both the Orders agent and the Payments agent build against this contract independently. The Orders agent calls charge() with a ChargeRequest and expects a ChargeResult. The Payments agent implements charge() returning a ChargeResult. Neither needs to know the other\'s internal implementation.',
    },
    {
      type: 'compare',
      title: 'Shared mutable state vs contract-based isolation',
      body: 'Two approaches to multi-agent coordination. One creates conflicts; the other enables true parallel work.',
      left: {
        label: 'Shared Mutable State (Conflicts)',
        content: '// god-file.ts — BOTH agents edit this\nexport const config = { ... }\nexport const routes = [ ... ]\nexport type AllTypes = { ... }\n\n// Agent A adds payment routes here\n// Agent B adds order routes here\n// RESULT: merge conflict every time\n\n// Both agents must read the entire file\n// to understand what the other is doing.\n// Changes are interleaved and fragile.\n// One agent\'s edit can break the other\'s.',
        language: 'typescript',
        filename: 'god-file.ts',
      },
      right: {
        label: 'Contract-Based Isolation (No Conflicts)',
        content: '// contract.ts — defined ONCE by architect\nexport interface ChargeRequest { ... }\nexport interface ChargeResult { ... }\n\n// payments/payments.service.ts\n// Agent A ONLY touches this file\n// Implements the contract interface\n\n// orders/orders.service.ts\n// Agent B ONLY touches this file\n// Calls the contract interface\n\n// RESULT: zero conflicts, true parallel\n// Each agent owns their module entirely.\n// The contract is the only shared artifact.',
        language: 'typescript',
        filename: 'contract-isolation.ts',
      },
      question: 'Which approach lets two agents work simultaneously without ever editing the same file?',
      correctSide: 'right',
      explanation: 'Contract-based isolation means the architect defines the interface once, then each agent works exclusively within their own module. The contract file is read-only during implementation — neither agent modifies it. In contrast, shared mutable state forces both agents to edit the same file, guaranteeing merge conflicts.',
    },

    // === ELIMINATING SHARED MUTABLE STATE ===
    {
      type: 'multiple-choice',
      question: 'Which of these is NOT an example of shared mutable state that kills parallelism?',
      options: [
        'A central routes.ts file that every feature adds routes to',
        'A shared types.ts that accumulates every type in the system',
        'A module\'s own payments.types.ts that only the payments agent edits',
        'A database migration file that multiple features modify simultaneously',
      ],
      correctIndex: 2,
      explanation: 'Any file that multiple agents might modify is shared mutable state. Central routes.ts, shared types.ts, and shared migration files are all conflict magnets. But a module-owned payments.types.ts is only modified by the payments agent — that is isolated, not shared. The solution: each module owns its own routes, types, and migrations.',
    },
    {
      type: 'code-diff',
      title: 'Eliminating the shared routes file',
      body: 'See how a conflict-magnet shared routes file gets refactored into auto-discovery, so no agent ever needs to edit a shared file.',
      language: 'typescript',
      filename: 'src/routes.ts → src/app.ts',
      before: "// Shared routes file (ALL agents edit this)\nimport { paymentsRoutes } from './features/payments'\nimport { ordersRoutes } from './features/orders'\nimport { usersRoutes } from './features/users'\nimport { notificationsRoutes } from './features/notifications'\n\nexport const routes = [\n  ...paymentsRoutes,     // Agent A adds here\n  ...ordersRoutes,       // Agent B adds here\n  ...usersRoutes,        // Agent C adds here\n  ...notificationsRoutes // Agent D adds here\n  // Every new feature = edit this file = conflict\n]",
      after: "// Auto-discovery (NO shared file to edit)\nimport { glob } from 'fast-glob'\n\nasync function registerRoutes(app: App) {\n  const routeFiles = await glob('src/features/*/routes.ts')\n  for (const file of routeFiles) {\n    const mod = await import(file)\n    app.register(mod.default)\n  }\n}\n\n// Each feature owns its own routes.ts\n// src/features/payments/routes.ts (only Agent A)\n// src/features/orders/routes.ts (only Agent B)",
      question: 'What architectural change eliminated the shared file conflict?',
      highlightLines: [1, 2, 3, 4],
      explanation: 'Auto-discovery replaces the shared import list. Instead of every agent adding a line to routes.ts, each feature module contains its own routes.ts file. The app scans for these files automatically. No shared file to conflict on. Adding a new feature means creating a new file, not editing an existing one.',
    },
    {
      type: 'compare',
      title: 'Shared types file vs module-owned types',
      body: 'Types belong where they are used. Cross-module types live in the contract between those specific modules.',
      left: {
        label: 'Shared Types (Conflict Magnet)',
        content: '// src/types/index.ts\n// ALL agents edit this one file\n\nexport interface Payment { ... }\n// Used only by payments\n\nexport interface Order { ... }\n// Used only by orders\n\nexport interface User { ... }\n// Used only by users\n\nexport interface ChargeRequest { ... }\n// Crosses payments ↔ orders\n\n// Every agent adds types here\n// RESULT: merge conflicts every time',
        language: 'typescript',
        filename: 'src/types/index.ts',
      },
      right: {
        label: 'Module-Owned Types (Zero Conflicts)',
        content: '// payments/payments.types.ts\n// Only payments agent edits this\nexport interface Payment {\n  id: string\n  amountCents: number\n}\n\n// orders/orders.types.ts\n// Only orders agent edits this\nexport interface Order {\n  id: string\n  items: OrderItem[]\n}\n\n// contracts/order-payment.contract.ts\n// ONLY types that cross boundaries\nexport interface ChargeRequest {\n  orderId: string\n  amountCents: number\n}',
        language: 'typescript',
        filename: 'module-owned-types.ts',
      },
      question: 'Which approach allows agents to add new types without ever conflicting?',
      correctSide: 'right',
      explanation: 'Each module defines its own types. Types that cross module boundaries live in the contract file between those specific modules. There is no single file that accumulates all types. If TypeA is only used by payments, it lives in payments/payments.types.ts. If it crosses into orders, it lives in contracts/order-payment.contract.ts. Nowhere else.',
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
      type: 'multiple-choice',
      question: 'What is the correct rule for drawing module boundaries?',
      options: [
        'One module per file — keep everything small',
        'One module per feature — organize by business domain',
        'One module per independently-modifiable unit — can an agent work here without ANY knowledge of other modules?',
        'One module per team member — each person owns a section',
      ],
      correctIndex: 2,
      explanation: 'The rule is: one module per independently-modifiable unit. Ask: "Can an agent add functionality to this module without ANY knowledge of other modules?" If yes, the boundary is correct. If the agent needs to read or modify files in another module, the boundary is wrong — either the modules are too coupled, or the responsibility split is unnatural.',
    },
    {
      type: 'match',
      instruction: 'Match each boundary litmus test to what it validates:',
      leftItems: ['Single-agent test', 'Parallel test', 'Contract test'],
      rightItems: ['Can one agent complete a full feature within this module alone?', 'Can two agents work on different modules without file conflicts?', 'Can the interface between modules be defined in under 20 lines of types?'],
      correctPairs: { 0: 0, 1: 1, 2: 2 },
      explanation: 'Three tests for a good boundary: (1) Single-agent test — if the agent needs to cross into another module, the boundary is too narrow. (2) Parallel test — if two agents share files, the boundary is too leaky. (3) Contract test — if the interface is enormous, the modules are too coupled.',
    },
    {
      type: 'code-fill',
      instruction: 'Complete this well-bounded module structure. Fill in the file names following the [domain].[role].ts convention.',
      language: 'text',
      template: 'src/features/\n├── payments/\n│   ├── CLAUDE.md              # Module-specific rules\n│   ├── ___    # HTTP layer (routes, request parsing)\n│   ├── ___    # Business logic\n│   ├── payments.repository.ts # Database queries\n│   ├── ___     # Validation (Zod)\n│   ├── payments.types.ts      # Internal types\n│   ├── payments.test.ts       # Tests\n│   └── ___               # Public API (only this is importable)\n│\nsrc/contracts/\n├── ___   # Interface between orders ↔ payments',
      blanks: [
        { id: 'handler', answer: 'payments.handler.ts', alternatives: ['payments.controller.ts'], hint: 'domain.role.ts for the HTTP handler', placeholder: 'filename' },
        { id: 'service', answer: 'payments.service.ts', alternatives: [], hint: 'domain.role.ts for the business logic', placeholder: 'filename' },
        { id: 'schema', answer: 'payments.schema.ts', alternatives: ['payments.validation.ts'], hint: 'domain.role.ts for Zod validation schemas', placeholder: 'filename' },
        { id: 'index', answer: 'index.ts', alternatives: [], hint: 'The public API file that other modules import from', placeholder: 'filename' },
        { id: 'contract', answer: 'order-payment.contract.ts', alternatives: ['orders-payments.contract.ts'], hint: 'The contract file between two specific modules', placeholder: 'filename' },
      ],
      filename: 'boundary-structure',
      explanation: 'Each module is self-contained: handler, service, repository, schema, types, tests, and a public API (index.ts). An agent working on payments never needs to touch orders. Cross-module types live in contracts/ — the only shared artifact. This structure enables true parallel agent work.',
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
      type: 'order',
      instruction: 'Order these steps for empirically validating boundary effectiveness:',
      items: [
        'Calculate conflict rate: conflicting files / total modified files',
        'Dispatch 3-5 agents on different features simultaneously',
        'For each conflict, trace it back to a boundary failure',
        'After all complete, run git diff across all branches',
        'Count files modified by more than one agent',
        'Redesign the boundary and retest',
      ],
      correctOrder: [1, 3, 4, 0, 2, 5],
    },
    {
      type: 'match',
      instruction: 'Match each common boundary failure to its fix:',
      leftItems: ['Multiple agents edit app config file', 'Agents conflict on database schema file', 'Agents both modify shared error types', 'Agents conflict on test setup file'],
      rightItems: ['Each module registers its own config', 'Per-module migration files', 'Each module defines its own error types', 'Each module has its own test setup'],
      correctPairs: { 0: 0, 1: 1, 2: 2, 3: 3 },
      explanation: 'Every boundary failure has a consistent fix: move the shared file into per-module ownership. Config, migrations, error types, and test setup all follow the same pattern — each module owns its own, eliminating the shared file that causes conflicts.',
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
      type: 'multiple-choice',
      question: 'Module boundaries in agent-native systems are:',
      options: [
        'A code organization preference that makes things look tidy',
        'The fundamental architectural decision — they determine whether agents can work in parallel or must wait for each other',
        'Only important for microservices, not monoliths',
        'Something agents should decide on their own',
      ],
      correctIndex: 1,
      explanation: 'Module boundaries are not a code organization preference — they are the fundamental architectural decision for agent-native systems. Get boundaries right and you unlock true parallelism: 5 agents working 5x faster with zero coordination overhead. Get them wrong and you are back to one agent at a time. The architect\'s job is to draw boundaries so clean that agents never need to cross them.',
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
