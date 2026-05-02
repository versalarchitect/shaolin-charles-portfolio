import type { LessonContent } from './types'

const content: LessonContent = {
  lessonId: '4-1',
  steps: [
    // === INTRODUCTION ===
    {
      type: 'info',
      title: 'Your codebase is the agent\'s map',
      body: "You are no longer writing code for humans to maintain. You are designing a codebase that agent fleets will navigate, modify, and extend — often in parallel. The single most impactful architectural decision you can make is this: can an agent FIND what it needs in under three searches? If yes, your structure works. If no, every task costs extra tokens, extra time, and extra risk of the agent modifying the wrong file. This lesson teaches you to evaluate and design directory structures as navigation systems.",
    },
    {
      type: 'info',
      title: 'Why navigability matters more than elegance',
      body: "Human developers build mental models over months. They know where things are because they put them there. Agents start fresh every session. They have no memory of your codebase layout unless you tell them — or unless the layout is self-documenting. A beautifully abstracted architecture that requires tribal knowledge to navigate is WORSE for agents than a flat, obvious structure. The metric is not \"how clean does this look\" — it is \"how quickly can a fresh agent find the right file to edit.\"",
    },

    // === THE AUDIT FRAMEWORK ===
    {
      type: 'info',
      title: 'The 3-search audit',
      body: "Here is how you test navigability. Pick any feature in your codebase. Ask: if an agent needs to modify this feature, how many searches (grep, find, file listing) does it take to locate ALL relevant files? Count the searches. If it is 1-2: excellent. The structure guides the agent directly. If it is 3: acceptable. One search to find the domain, one to find the file, one to confirm dependencies. If it is 4+: your structure is working against the agent. Every extra search is wasted tokens, increased risk of the agent getting lost, and potential for it to modify the wrong file.",
    },
    {
      type: 'diagram',
      title: 'Good structure vs bad structure',
      body: 'An agent looking for the "payments" feature. Left path: found in 2 steps. Right path: still guessing after 5.',
      diagram: {
        direction: 'TB',
        nodes: [
          { id: 'start', label: 'Agent: "edit payments"', shape: 'pill', highlight: true },
          { id: 'good1', label: 'src/features/payments/', sublabel: 'Obvious location', shape: 'rounded' },
          { id: 'good2', label: 'Found: handler, schema, test', sublabel: '2 searches total', shape: 'rounded', highlight: true },
          { id: 'bad1', label: 'src/utils/helpers.ts?', sublabel: 'Maybe here...', shape: 'rect' },
          { id: 'bad2', label: 'src/shared/services/?', sublabel: 'Or here...', shape: 'rect' },
          { id: 'bad3', label: 'lib/core/payment-utils?', sublabel: 'Still looking...', shape: 'rect' },
          { id: 'bad4', label: 'src/modules/billing/?', sublabel: '5 searches, still lost', shape: 'rect' },
        ],
        edges: [
          { from: 'start', to: 'good1', label: 'feature-based' },
          { from: 'good1', to: 'good2' },
          { from: 'start', to: 'bad1', label: 'scattered' },
          { from: 'bad1', to: 'bad2', dashed: true },
          { from: 'bad2', to: 'bad3', dashed: true },
          { from: 'bad3', to: 'bad4', dashed: true },
        ],
      },
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'Audit framework understood!',
    },

    // === GOOD PATTERNS ===
    {
      type: 'info',
      title: 'Pattern 1: Feature-based modules',
      body: "Group by domain, not by technical layer. Instead of src/controllers/, src/services/, src/models/ (where payment logic is scattered across 3 directories), use src/features/payments/ containing everything related to payments: the handler, the schema, the validation, the tests. An agent searching for \"payments\" finds one directory with everything it needs. This is the single highest-impact structural decision for agent navigability.",
    },
    {
      type: 'code-demo',
      title: 'Feature-based structure',
      body: 'Everything related to a domain lives together. An agent finds ALL relevant files in one directory listing.',
      language: 'text',
      filename: 'directory-structure',
      code: "src/\n├── features/\n│   ├── payments/\n│   │   ├── payments.handler.ts      # Route handler\n│   │   ├── payments.schema.ts       # Validation schema\n│   │   ├── payments.service.ts      # Business logic\n│   │   ├── payments.test.ts         # Tests\n│   │   └── index.ts                 # Public API\n│   ├── users/\n│   │   ├── users.handler.ts\n│   │   ├── users.schema.ts\n│   │   ├── users.service.ts\n│   │   ├── users.test.ts\n│   │   └── index.ts\n│   └── orders/\n│       ├── orders.handler.ts\n│       ├── orders.schema.ts\n│       ├── orders.service.ts\n│       ├── orders.test.ts\n│       └── index.ts\n├── shared/\n│   ├── database.ts                  # DB connection only\n│   └── auth-middleware.ts           # Auth only\n└── app.ts                           # Wiring",
    },
    {
      type: 'info',
      title: 'Pattern 2: Consistent naming conventions',
      body: "If your payments handler is payments.handler.ts, your users handler MUST be users.handler.ts — not userController.ts, not handle-users.ts, not UsersAPI.ts. Consistency means the agent can PREDICT file names without searching. Once it learns the pattern from one feature, it can navigate to any feature instantly. Inconsistent naming forces a search for every single file. This compounds: 10 features with inconsistent naming means dozens of extra searches per session.",
    },
    {
      type: 'info',
      title: 'Pattern 3: Collocated tests',
      body: "Tests live next to the code they test. Not in a separate __tests__/ directory tree that mirrors src/. When an agent modifies payments.service.ts, it needs to update payments.test.ts. If the test is in the same directory, it finds it immediately. If tests are in a parallel directory tree (__tests__/features/payments/payments.service.test.ts), the agent has to search, and it might find the wrong test file or miss related integration tests.",
    },
    {
      type: 'multiple-choice',
      question: 'An agent needs to add a new validation rule to the "orders" feature. Which structure lets it find ALL relevant files in one directory listing?',
      options: [
        'src/validators/orders.ts + src/handlers/orders.ts + tests/validators/orders.test.ts',
        'src/features/orders/ containing orders.handler.ts, orders.schema.ts, orders.test.ts',
        'src/modules/validation/orders/ + src/modules/handlers/orders/',
        'lib/orders.ts containing all orders logic in one file',
      ],
      correctIndex: 1,
      explanation: 'Feature-based colocation means one directory listing reveals all relevant files. The agent does not need to search across multiple directories or guess where the test file lives.',
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'Good patterns locked in!',
    },

    // === BAD PATTERNS ===
    {
      type: 'info',
      title: 'Anti-pattern 1: The "shared" dumping ground',
      body: "A shared/ or utils/ or helpers/ directory that grows to 50+ files. Initially it held genuinely shared code — the database connection, a date formatter. Over time, developers dump anything they cannot categorize. Now the agent searches for payment validation and finds it in shared/validators/payment-validator.ts alongside 30 other unrelated validators. The directory name \"shared\" conveys zero information about what is inside. It forces a full search of its contents every time.",
    },
    {
      type: 'code-demo',
      title: 'The shared/ dumping ground',
      body: 'When "shared" means "I did not know where to put this." Every file here requires a search to discover.',
      language: 'text',
      filename: 'anti-pattern-shared',
      code: "src/shared/\n├── validators/\n│   ├── payment-validator.ts     # Why not in features/payments?\n│   ├── user-validator.ts        # Why not in features/users?\n│   ├── order-validator.ts       # Why not in features/orders?\n│   ├── email-validator.ts       # Actually shared\n│   └── string-helpers.ts        # Not even a validator\n├── services/\n│   ├── email-service.ts         # Legitimately shared\n│   ├── payment-processor.ts     # Should be in features/payments\n│   ├── user-lookup.ts           # Should be in features/users\n│   └── cache.ts                 # Legitimately shared\n├── utils/\n│   ├── format-date.ts\n│   ├── format-currency.ts\n│   ├── handle-errors.ts\n│   ├── parse-query.ts\n│   └── ... 40 more files\n└── types/\n    └── ... 25 type files",
    },
    {
      type: 'info',
      title: 'Anti-pattern 2: Circular imports',
      body: "Module A imports from Module B, which imports from Module A. This is not just a code smell — it is an agent navigation nightmare. When an agent modifies Module A, it needs to understand that Module B depends on it. But Module B also flows back into Module A, so understanding the impact requires tracing a loop. Agents handle trees well. They handle loops poorly. Circular dependencies increase the chance of the agent making a change that breaks something it cannot see.",
    },
    {
      type: 'info',
      title: 'Anti-pattern 3: Ambiguous file names',
      body: "manager.ts, handler.ts, service.ts, processor.ts, helper.ts — without a domain prefix, these names communicate nothing. An agent searching for \"payment processing\" cannot distinguish between processor.ts (generic name) and payments.service.ts (domain-specific name). Every ambiguous name is a forced search. Name files for what they DO in the context of what DOMAIN they serve: payments.handler.ts tells you both the domain (payments) and the role (handler) instantly.",
    },
    {
      type: 'multiple-choice',
      question: 'Your shared/utils/ directory has 47 files. An agent needs to find the currency formatter. What is the architectural failure?',
      options: [
        'The currency formatter should be in a separate npm package',
        'Having 47 utility files means the project is too large',
        'Domain-specific utilities should live in their feature module; only truly cross-cutting concerns belong in shared/',
        'The agent should use better search queries to find it',
      ],
      correctIndex: 2,
      explanation: 'The failure is putting domain-specific code in a catch-all directory. If currency formatting is only used by the payments feature, it belongs in features/payments/. Only things used by 3+ unrelated features (like a generic date formatter) justify a shared location.',
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'Anti-patterns identified!',
    },

    // === REFACTORING FOR NAVIGABILITY ===
    {
      type: 'info',
      title: 'Refactoring strategy: the migration path',
      body: "You cannot refactor a large codebase overnight. The strategy: (1) Identify the highest-traffic features — the ones agents modify most often. (2) Migrate those first to feature-based modules. (3) Leave rarely-touched code where it is. (4) Update CLAUDE.md to document the new structure. This is not about purity. It is about reducing search friction for the 20% of the codebase that gets 80% of the modifications.",
    },
    {
      type: 'code-demo',
      title: 'Before and after: payments feature',
      body: 'Refactoring from layer-based to feature-based. All payment files move to one directory.',
      language: 'typescript',
      filename: 'migration-example.ts',
      code: "// BEFORE: Layer-based (agent needs 4 searches)\n// src/controllers/paymentController.ts\n// src/services/paymentService.ts\n// src/validators/paymentValidator.ts\n// src/models/Payment.ts\n// tests/services/paymentService.test.ts\n\n// AFTER: Feature-based (agent needs 1 search)\n// src/features/payments/payments.handler.ts\n// src/features/payments/payments.service.ts\n// src/features/payments/payments.schema.ts\n// src/features/payments/payments.model.ts\n// src/features/payments/payments.test.ts\n// src/features/payments/index.ts\n\n// The index.ts defines the public API:\nexport { createPayment, refundPayment } from './payments.service'\nexport { PaymentSchema } from './payments.schema'\nexport type { Payment } from './payments.model'",
    },
    {
      type: 'info',
      title: 'The index.ts contract',
      body: "Every feature module exposes exactly one public API through its index.ts. Other modules import from the feature — never from internal files. This means an agent working on the orders feature that needs something from payments imports from features/payments (the index), not from features/payments/payments.service.ts (an internal file). This creates clear boundaries: the agent knows what is public and what is internal. If it is not in index.ts, it is not meant to be used externally.",
    },
    {
      type: 'order',
      instruction: 'Order the refactoring steps for migrating to a feature-based structure:',
      items: [
        'Move domain-specific code from shared/ into the feature module',
        'Identify the highest-traffic features (most modified by agents)',
        'Update CLAUDE.md to document the new structure and conventions',
        'Create the feature directory with the new naming convention',
        'Update imports across the codebase to use the feature index.ts',
      ],
      correctOrder: [1, 3, 0, 4, 2],
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'Refactoring strategy mastered!',
    },

    // === PRACTICAL EVALUATION ===
    {
      type: 'info',
      title: 'Running the navigability audit',
      body: "Here is how to score your own codebase. Pick 5 recent agent tasks — features added, bugs fixed, refactors performed. For each task, count how many file searches the agent needed to find all relevant files. Average those numbers. Under 2.5 average: excellent navigability. 2.5-4.0 average: acceptable but with friction points. Over 4.0: your structure is actively fighting the agents. Focus on the worst cases — those are your highest-leverage refactoring targets.",
    },
    {
      type: 'multiple-choice',
      question: 'Your navigability audit shows: payments (2 searches), users (2 searches), notifications (6 searches), orders (3 searches), auth (7 searches). Where do you refactor first?',
      options: [
        'Start with payments since it is already good — make it even better',
        'Refactor auth (7 searches) and notifications (6 searches) — the worst offenders',
        'Refactor all 5 at once for consistency',
        'Focus on orders (3 searches) since it is close to the threshold',
      ],
      correctIndex: 1,
      explanation: 'Target the worst offenders first — they have the highest search counts, meaning agents waste the most time navigating them. Auth (7) and notifications (6) deliver the biggest improvement per refactoring effort. Payments is already fine. Doing all at once is risky and unnecessary.',
    },
    {
      type: 'code-demo',
      title: 'Self-documenting structure for agents',
      body: 'A complete project structure designed for agent navigability. Notice: no ambiguity about where anything lives.',
      language: 'text',
      filename: 'ideal-structure',
      code: "project-root/\n├── CLAUDE.md                        # Agent coordination protocol\n├── src/\n│   ├── features/                    # Domain logic (one dir per feature)\n│   │   ├── payments/\n│   │   │   ├── payments.handler.ts\n│   │   │   ├── payments.service.ts\n│   │   │   ├── payments.schema.ts\n│   │   │   ├── payments.test.ts\n│   │   │   └── index.ts\n│   │   ├── users/\n│   │   ├── orders/\n│   │   └── notifications/\n│   ├── infrastructure/              # Cross-cutting (DB, cache, queue)\n│   │   ├── database.ts\n│   │   ├── cache.ts\n│   │   └── queue.ts\n│   ├── middleware/                  # HTTP middleware (auth, logging)\n│   │   ├── auth.ts\n│   │   └── logging.ts\n│   └── app.ts                       # Composition root\n├── scripts/                         # Operational scripts\n│   ├── migrate.ts\n│   └── seed.ts\n└── package.json",
    },

    // === SYNTHESIS ===
    {
      type: 'info',
      title: 'The navigability principle',
      body: "Architecture for agent navigability is not about following any single pattern dogmatically. It is about one principle: reduce the number of searches an agent needs to find and modify related code. Feature-based modules achieve this by colocation. Consistent naming achieves this by predictability. Clear public APIs achieve this by eliminating ambiguity about what is internal vs external. Every structural decision should be evaluated through this lens: does this make it easier or harder for a fresh agent to find what it needs?",
    },
    {
      type: 'checklist',
      title: 'Codebase navigability checklist:',
      items: [
        'I can run the 3-search audit on any feature in my codebase',
        'I understand why feature-based grouping beats layer-based grouping for agents',
        'I can identify shared/ dumping grounds and plan their decomposition',
        'I use consistent naming conventions across all features',
        'I collocate tests with the code they test',
        'I define clear public APIs via index.ts for each feature module',
        'I know which features in my codebase have the worst navigability scores',
      ],
    },
    {
      type: 'checkpoint',
      xp: 18,
      message: 'Codebase architecture for agent navigability mastered! Your directory structure is now an agent-friendly map.',
    },
  ],
}

export default content
