import type { LessonContent } from './types'

const content: LessonContent = {
  lessonId: '4-1',
  steps: [
    // === INTRODUCTION ===
    {
      type: 'info',
      title: 'Organizing your project so AI can navigate it',
      body: "You are no longer writing code for humans to maintain. You are designing a codebase that agent fleets will navigate, modify, and extend — often in parallel. The single most impactful architectural decision you can make is this: can an agent FIND what it needs in under three searches? If yes, your structure works. If no, every task costs extra tokens, extra time, and extra risk of the agent modifying the wrong file. This lesson teaches you to evaluate and design directory structures as navigation systems.",
    },
    {
      type: 'info',
      title: 'Why navigability matters more than elegance',
      body: "Human developers build mental models over months. They know where things are because they put them there. Agents start fresh every session. They have no memory of your codebase layout unless you tell them — or unless the layout is self-documenting. A beautifully abstracted architecture that requires tribal knowledge to navigate is WORSE for agents than a flat, obvious structure. The metric is not \"how clean does this look\" — it is \"how quickly can a fresh agent find the right file to edit.\"",
    },

    // === THE AUDIT FRAMEWORK ===
    {
      type: 'multiple-choice',
      hint: 'Read each option carefully — one fits the context best.',
      question: 'In the 3-search audit, what does it mean if an agent needs 4+ searches to find all relevant files for a feature?',
      options: [
        'The feature is complex and needs more documentation',
        'The agent needs better search capabilities',
        'Your directory structure is working against the agent — each extra search wastes tokens and increases risk',
        '4 searches is still within acceptable limits',
      ],
      correctIndex: 2,
      explanation: "The 3-search audit: pick any feature and count how many searches it takes an agent to locate ALL relevant files. 1-2 is excellent, 3 is acceptable, 4+ means your structure is actively working against the agent. Every extra search is wasted tokens, increased risk of getting lost, and potential for modifying the wrong file.",
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
      type: 'multiple-choice',
      hint: 'Eliminate the options that only partially fit.',
      question: 'What is the single highest-impact structural decision for agent navigability?',
      options: [
        'Using TypeScript strict mode in all files',
        'Grouping by domain (features/payments/) instead of technical layer (controllers/, services/, models/)',
        'Adding comprehensive JSDoc comments to every function',
        'Using a flat directory structure with all files in src/',
      ],
      correctIndex: 1,
      explanation: "Group by domain, not by technical layer. Instead of scattering payment logic across controllers/, services/, and models/, use features/payments/ containing everything: handler, schema, validation, tests. An agent searching for \"payments\" finds one directory with everything it needs.",
    },
    {
      type: 'code-fill',
      hint: 'Fill in values that match the pattern shown above.',
      instruction: 'Complete this feature-based directory structure. Fill in the file names following the consistent naming convention.',
      language: 'text',
      filename: 'directory-structure',
      template: `src/
├── features/
│   ├── payments/
│   │   ├── payments.handler.ts      # Route handler
│   │   ├── payments.schema.ts       # Validation schema
│   │   ├── payments.service.ts      # Business logic
│   │   ├── {{payments_test}}         # Tests
│   │   └── index.ts                 # Public API
│   ├── users/
│   │   ├── {{users_handler}}
│   │   ├── users.schema.ts
│   │   ├── users.service.ts
│   │   ├── users.test.ts
│   │   └── index.ts
│   └── orders/
│       ├── orders.handler.ts
│       ├── orders.schema.ts
│       ├── {{orders_service}}
│       ├── orders.test.ts
│       └── index.ts
├── shared/
│   ├── database.ts                  # DB connection only
│   └── auth-middleware.ts           # Auth only
└── app.ts                           # Wiring`,
      blanks: [
        { id: 'payments_test', answer: 'payments.test.ts', alternatives: ['payments.test.ts'], placeholder: 'test file name', hint: 'Follow the convention: [domain].test.ts — colocated with the code it tests' },
        { id: 'users_handler', answer: 'users.handler.ts', alternatives: ['users.handler.ts'], placeholder: 'handler file name', hint: 'Follow the same convention as payments: [domain].handler.ts' },
        { id: 'orders_service', answer: 'orders.service.ts', alternatives: ['orders.service.ts'], placeholder: 'service file name', hint: 'Follow the convention: [domain].service.ts for business logic' },
      ],
      explanation: 'Everything related to a domain lives together. An agent finds ALL relevant files in one directory listing. Consistent naming means the agent can predict file names after learning the pattern from one feature.',
    },
    {
      type: 'multiple-choice',
      hint: 'Focus on the primary goal, not secondary benefits.',
      question: 'Your payments handler is payments.handler.ts. What MUST the users handler be named?',
      options: [
        'userController.ts — a common alternative convention',
        'handle-users.ts — descriptive and clear',
        'users.handler.ts — matching the established [domain].handler.ts pattern',
        'UsersAPI.ts — PascalCase is more readable',
      ],
      correctIndex: 2,
      explanation: "Consistency means the agent can PREDICT file names without searching. Once it learns the pattern from one feature, it can navigate to any feature instantly. Inconsistent naming forces a search for every single file. 10 features with inconsistent naming means dozens of extra searches per session.",
    },
    {
      type: 'multiple-choice',
      hint: 'Think about which option is most specific to this concept.',
      question: 'An agent modifies payments.service.ts and needs to update its test. Where should the test file live?',
      options: [
        '__tests__/features/payments/payments.service.test.ts — in a parallel test directory tree',
        'tests/unit/payments.test.ts — in a centralized test folder',
        'payments.test.ts — in the same directory, next to the code it tests',
        'test/payments/payments.service.spec.ts — following Jest conventions',
      ],
      correctIndex: 2,
      explanation: "Tests live next to the code they test. If the test is in the same directory, the agent finds it immediately. A parallel __tests__/ directory tree forces the agent to search, and it might find the wrong test file or miss related integration tests.",
    },
    {
      type: 'compare',
      hint: 'Look at the key differences between the two approaches.',
      title: 'Tangled vs feature-based structure',
      body: 'Layer-based organization scatters related files across the tree. Feature-based colocation puts everything an agent needs in one place.',
      left: {
        label: 'Layer-Based (Tangled)',
        content: 'src/\n  controllers/\n    paymentController.ts\n    userController.ts\n    orderController.ts\n  services/\n    paymentService.ts\n    userService.ts\n    orderService.ts\n  models/\n    Payment.ts\n    User.ts\n    Order.ts\n  validators/\n    paymentValidator.ts\n    userValidator.ts\n    orderValidator.ts\n  hooks/\n    usePayment.ts\n    useUser.ts\n    useOrder.ts\n  utils/\n    formatCurrency.ts\n    formatDate.ts\n    helpers.ts',
        language: 'text',
        filename: 'layer-based.txt',
      },
      right: {
        label: 'Feature-Based (Colocated)',
        content: 'src/features/\n  payments/\n    payments.handler.ts\n    payments.service.ts\n    payments.schema.ts\n    payments.test.ts\n    index.ts\n  users/\n    users.handler.ts\n    users.service.ts\n    users.schema.ts\n    users.test.ts\n    index.ts\n  orders/\n    orders.handler.ts\n    orders.service.ts\n    orders.schema.ts\n    orders.test.ts\n    index.ts\nsrc/shared/\n  database.ts\n  auth-middleware.ts',
        language: 'text',
        filename: 'feature-based.txt',
      },
      question: 'Which structure lets an agent find ALL payment-related files in a single directory listing?',
      correctSide: 'right',
      explanation: 'In the feature-based structure, an agent searching for "payments" finds one directory with every relevant file. In the layer-based structure, payment logic is scattered across controllers/, services/, models/, validators/, hooks/, and utils/ — requiring 6+ searches to locate everything.',
    },
    {
      type: 'code-diff',
      title: 'Before/after: from layers to features',
      body: 'Refactoring a layer-based directory into a feature-based structure. Watch how scattered files converge into one location.',
      language: 'text',
      filename: 'directory-structure',
      before: 'src/\n├── controllers/\n│   ├── paymentController.ts\n│   ├── userController.ts\n│   └── orderController.ts\n├── services/\n│   ├── paymentService.ts\n│   ├── userService.ts\n│   └── orderService.ts\n├── models/\n│   ├── Payment.ts\n│   ├── User.ts\n│   └── Order.ts\n├── validators/\n│   ├── paymentValidator.ts\n│   └── orderValidator.ts\n├── __tests__/\n│   ├── payment.test.ts\n│   └── order.test.ts\n└── utils/\n    ├── formatCurrency.ts\n    └── helpers.ts',
      after: 'src/\n├── features/\n│   ├── payments/\n│   │   ├── payments.handler.ts\n│   │   ├── payments.service.ts\n│   │   ├── payments.schema.ts\n│   │   ├── payments.test.ts\n│   │   └── index.ts\n│   ├── users/\n│   │   ├── users.handler.ts\n│   │   ├── users.service.ts\n│   │   ├── users.test.ts\n│   │   └── index.ts\n│   └── orders/\n│       ├── orders.handler.ts\n│       ├── orders.service.ts\n│       ├── orders.schema.ts\n│       ├── orders.test.ts\n│       └── index.ts\n├── shared/\n│   ├── database.ts\n│   └── auth-middleware.ts\n└── app.ts',
      question: 'How many directories does an agent need to search in the BEFORE structure to find all payment files?',
      explanation: 'In the BEFORE structure, payment files are spread across controllers/, services/, models/, validators/, __tests__/, and utils/ — at least 5 directories. In the AFTER structure, everything is in features/payments/ — one directory, one search.',
    },
    {
      type: 'multiple-choice',
      hint: 'Consider what the lesson content emphasized.',
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
      type: 'multiple-choice',
      hint: 'One option stands out when you think about the core purpose.',
      question: 'A shared/utils/ directory has grown to 50+ files. Why is this an anti-pattern for agent navigability?',
      options: [
        'Utility functions should never be shared between features',
        'The directory name "shared" conveys zero information — it forces a full search of its contents every time',
        '50 files is too many for any single directory',
        'Agents cannot read files from directories named "shared"',
      ],
      correctIndex: 1,
      explanation: "The name \"shared\" conveys zero information about what is inside. Initially it held genuinely shared code, but over time developers dump anything they cannot categorize. An agent searching for payment validation finds it alongside 30 unrelated validators. Domain-specific code should live in its feature module.",
    },
    {
      type: 'code-fill',
      hint: 'Use the exact syntax from the lesson examples.',
      instruction: 'Identify which files in this shared/ directory actually belong in feature modules. Fill in where each misplaced file should go.',
      language: 'text',
      filename: 'anti-pattern-shared',
      template: `src/shared/
├── validators/
│   ├── payment-validator.ts     # Should be in {{payment_location}}
│   ├── user-validator.ts        # Should be in features/users/
│   ├── order-validator.ts       # Should be in features/orders/
│   ├── email-validator.ts       # Actually shared (used by 3+ features)
│   └── string-helpers.ts        # Not even a validator
├── services/
│   ├── email-service.ts         # Legitimately shared
│   ├── payment-processor.ts     # Should be in {{payment_service_location}}
│   ├── user-lookup.ts           # Should be in features/users/
│   └── cache.ts                 # {{cache_status}}
├── utils/
│   └── ... 40+ files`,
      blanks: [
        { id: 'payment_location', answer: 'features/payments/', alternatives: ['features/payments/', 'features/payments', 'src/features/payments/'], placeholder: 'correct feature directory', hint: 'Domain-specific validation belongs with the domain, not in shared/' },
        { id: 'payment_service_location', answer: 'features/payments/', alternatives: ['features/payments/', 'features/payments', 'src/features/payments/'], placeholder: 'correct feature directory', hint: 'Payment processing logic belongs with the payments feature' },
        { id: 'cache_status', answer: 'Legitimately shared', alternatives: ['Legitimately shared', 'Actually shared', 'Shared'], placeholder: 'shared or feature-specific?', hint: 'Caching is used across many features — it is genuinely cross-cutting infrastructure' },
      ],
      explanation: 'When "shared" means "I did not know where to put this." Domain-specific files should live in their feature module. Only truly cross-cutting concerns (email, cache, database) justify a shared location.',
    },
    {
      type: 'multiple-choice',
      hint: 'Read each option carefully — one fits the context best.',
      question: 'Module A imports from Module B, which imports from Module A. Why is this especially bad for AI agents?',
      options: [
        'Circular imports cause compilation errors in TypeScript',
        'Agents handle tree structures well but handle loops poorly — circular dependencies increase the chance of breaking something the agent cannot see',
        'Circular imports make the code run slower',
        'Agents refuse to modify files with circular dependencies',
      ],
      correctIndex: 1,
      explanation: "Circular imports are not just a code smell — they are an agent navigation nightmare. When an agent modifies Module A, it needs to understand Module B depends on it, but Module B also flows back into A. Understanding impact requires tracing a loop. Agents handle trees well, loops poorly.",
    },
    {
      type: 'multiple-choice',
      hint: 'Eliminate the options that only partially fit.',
      question: 'An agent searches for "payment processing." Which file name helps it find the right file without extra searches?',
      options: [
        'processor.ts — short and concise',
        'service.ts — follows a common convention',
        'payments.service.ts — encodes both domain (payments) and role (service)',
        'PaymentProcessor.ts — PascalCase is standard',
      ],
      correctIndex: 2,
      explanation: "Without a domain prefix, names like manager.ts, handler.ts, service.ts communicate nothing. payments.service.ts tells you both the domain (payments) and the role (service) instantly. Every ambiguous name forces a search.",
    },
    {
      type: 'multiple-choice',
      hint: 'Focus on the primary goal, not secondary benefits.',
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
      type: 'multiple-choice',
      hint: 'Think about which option is most specific to this concept.',
      question: 'When migrating a large codebase to feature-based structure, what should you migrate first?',
      options: [
        'Everything at once for consistency',
        'The simplest features first to build momentum',
        'The highest-traffic features — the ones agents modify most often',
        'Shared utilities first, then features',
      ],
      correctIndex: 2,
      explanation: "You cannot refactor a large codebase overnight. The strategy: identify the highest-traffic features (most modified by agents), migrate those first, leave rarely-touched code where it is, and update CLAUDE.md. This reduces search friction for the 20% of the codebase that gets 80% of the modifications.",
    },
    {
      type: 'code-fill',
      hint: 'Each blank follows the conventions demonstrated earlier.',
      instruction: 'Complete this migration from layer-based to feature-based. Fill in the new file paths and the public API exports.',
      language: 'typescript',
      filename: 'migration-example.ts',
      template: `// BEFORE: Layer-based (agent needs 4 searches)
// src/controllers/paymentController.ts
// src/services/paymentService.ts
// src/validators/paymentValidator.ts
// src/models/Payment.ts
// tests/services/paymentService.test.ts

// AFTER: Feature-based (agent needs 1 search)
// src/features/payments/payments.handler.ts
// src/features/payments/{{service_file}}
// src/features/payments/payments.schema.ts
// src/features/payments/payments.model.ts
// src/features/payments/payments.test.ts
// src/features/payments/{{barrel_file}}

// The index.ts defines the public API:
export { createPayment, refundPayment } from './payments.service'
export { PaymentSchema } from '{{schema_import}}'
export type { Payment } from './payments.model'`,
      blanks: [
        { id: 'service_file', answer: 'payments.service.ts', alternatives: ['payments.service.ts'], placeholder: 'service file name', hint: 'Follow the [domain].service.ts convention' },
        { id: 'barrel_file', answer: 'index.ts', alternatives: ['index.ts'], placeholder: 'public API file', hint: 'The barrel file that exports the public API of this feature module' },
        { id: 'schema_import', answer: './payments.schema', alternatives: ['./payments.schema'], placeholder: 'schema import path', hint: 'Relative import from the same directory following the naming convention' },
      ],
      explanation: 'Refactoring from layer-based to feature-based. All payment files converge into one directory. The index.ts defines the public API — other modules import from here, never from internal files.',
    },
    {
      type: 'multiple-choice',
      hint: 'Consider what the lesson content emphasized.',
      question: 'The orders feature needs something from the payments feature. Where should it import from?',
      options: [
        'features/payments/payments.service.ts — directly from the internal file',
        'features/payments (the index.ts) — the public API',
        'shared/payments.ts — from a shared directory',
        '@/payments — from an alias that maps to the service file',
      ],
      correctIndex: 1,
      explanation: "Every feature module exposes exactly one public API through its index.ts. Other modules import from the feature, never from internal files. If it is not in index.ts, it is not meant to be used externally. This creates clear boundaries the agent can navigate.",
    },
    {
      type: 'order',
      hint: 'Consider what depends on what — prerequisites first.',
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

    // === NEW INTERACTIVE STEPS ===
    {
      type: 'match',
      hint: 'Find the unique connection between each pair.',
      instruction: 'Match each project structure concept to the benefit it provides for AI agents:',
      leftItems: ['Feature-based directories', 'Colocation', 'Clear module boundaries', 'Index exports'],
      rightItems: ['AI finds all related code in one listing', 'Tests live next to implementation', 'Agents can work in parallel without conflicts', 'Public API is explicit'],
      correctPairs: { 0: 0, 1: 1, 2: 2, 3: 3 },
      explanation: 'Feature-based directories mean one listing reveals all related files. Colocation keeps tests next to the code they validate. Clear module boundaries let agents work on separate features without touching the same files. Index exports define an explicit public API so agents know what is internal versus external.',
    },
    {
      type: 'prompt-lab',
      hint: 'Be specific about what you want — vague prompts get vague responses.',
      instruction: 'Write a prompt directing an AI agent to refactor from a layer-based directory structure to a feature-based structure.',
      scenario: 'You have a Node.js project organized by technical layer: src/controllers/, src/services/, src/models/, src/validators/. There are 3 features: payments, users, and orders. Each feature has files scattered across all 4 directories. You want to reorganize into src/features/[domain]/ with colocated files.',
      starterPrompt: 'Reorganize the project.',
      responses: [
        {
          triggerKeywords: ['feature', 'move', 'colocate', 'domain'],
          response: 'I will restructure the project into feature-based modules:\n\n1. Create src/features/payments/, src/features/users/, src/features/orders/\n2. Move each domain\'s controller, service, model, and validator into its feature directory\n3. Rename files to follow [domain].[role].ts convention\n4. Add index.ts to each feature exporting the public API\n5. Update all imports to use feature paths\n6. Colocate tests next to implementation files',
          quality: 'excellent',
          feedback: 'Excellent prompt. You specified the target structure (feature-based), the migration action (move and rename), and the conventions to follow (naming, index exports, colocated tests). An agent can execute this without ambiguity.',
        },
        {
          triggerKeywords: ['restructure', 'organize', 'group'],
          response: 'I\'ll reorganize the code by grouping related files together. I\'ll create new directories and move files around to improve the structure.',
          quality: 'good',
          feedback: 'Decent direction but lacks specifics. The agent understands the intent but might make different structural decisions than you expect. Specify the exact target structure (src/features/[domain]/), naming conventions, and that tests should be colocated.',
        },
        {
          triggerKeywords: ['clean', 'improve', 'better'],
          response: 'I\'ll clean up the project structure and make it more organized. Let me look at the codebase and suggest improvements.',
          quality: 'poor',
          feedback: 'Too vague. "Clean up" and "more organized" give the agent full latitude to make arbitrary decisions. You need to specify: feature-based grouping, the exact directory pattern, naming conventions, and what "organized" means in your context.',
        },
      ],
      fallbackResponse: {
        response: 'I\'ll look at the project and make some organizational changes based on best practices.',
        feedback: 'Your prompt needs more direction. Include: (1) the target structure (feature-based modules at src/features/[domain]/), (2) the action (move domain-specific files out of layer directories), (3) naming conventions ([domain].[role].ts), and (4) colocation requirements (tests next to implementation).',
      },
    },

    // === PRACTICAL EVALUATION ===
    {
      type: 'multiple-choice',
      hint: 'One option stands out when you think about the core purpose.',
      question: 'You run a navigability audit on 5 recent agent tasks with these search counts: 2, 1, 5, 3, 4. What is the average and what does it mean?',
      options: [
        'Average 3.0 — excellent navigability, no action needed',
        'Average 3.0 — acceptable but with friction points; focus on the tasks that needed 4-5 searches',
        'Average 3.0 — your structure is actively fighting the agents; full rewrite needed',
        'Average 3.0 — meaningless; you need at least 20 tasks to draw conclusions',
      ],
      correctIndex: 1,
      explanation: 'The average is (2+1+5+3+4)/5 = 3.0. Under 2.5 is excellent, 2.5-4.0 is acceptable but with friction points, over 4.0 means your structure is actively fighting agents. At 3.0 you are in the acceptable range, but you should focus on the worst cases (the 5-search and 4-search tasks) as your highest-leverage refactoring targets.',
    },
    {
      type: 'multiple-choice',
      hint: 'Read each option carefully — one fits the context best.',
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
      type: 'code-fill',
      hint: 'Look at the surrounding code for context clues.',
      instruction: 'Complete this ideal project structure. Fill in the directory names that make the codebase self-documenting for agents.',
      language: 'text',
      filename: 'ideal-structure',
      template: 'project-root/\n├── CLAUDE.md                        # Agent coordination protocol\n├── src/\n│   ├── {{domain_dir}}/              # Domain logic (one dir per feature)\n│   │   ├── payments/\n│   │   │   ├── payments.handler.ts\n│   │   │   ├── payments.service.ts\n│   │   │   ├── payments.schema.ts\n│   │   │   ├── payments.test.ts\n│   │   │   └── index.ts\n│   │   ├── users/\n│   │   ├── orders/\n│   │   └── notifications/\n│   ├── {{infra_dir}}/               # Cross-cutting (DB, cache, queue)\n│   │   ├── database.ts\n│   │   ├── cache.ts\n│   │   └── queue.ts\n│   ├── {{middleware_dir}}/          # HTTP middleware (auth, logging)\n│   │   ├── auth.ts\n│   │   └── logging.ts\n│   └── {{entry_file}}               # Composition root\n├── scripts/\n│   ├── migrate.ts\n│   └── seed.ts\n└── package.json',
      blanks: [
        { id: 'domain_dir', answer: 'features', alternatives: ['features'], placeholder: '________', hint: 'The directory that groups all domain modules, one sub-directory per feature' },
        { id: 'infra_dir', answer: 'infrastructure', alternatives: ['infra', 'shared'], placeholder: '________', hint: 'Cross-cutting concerns like database, cache, and queue — not domain-specific' },
        { id: 'middleware_dir', answer: 'middleware', alternatives: ['middlewares'], placeholder: '________', hint: 'HTTP-level concerns like auth and logging that wrap requests' },
        { id: 'entry_file', answer: 'app.ts', alternatives: ['app.ts', 'index.ts', 'main.ts'], placeholder: '________', hint: 'The composition root that wires everything together' },
      ],
      explanation: 'A self-documenting structure uses directory names that communicate purpose. "features/" tells the agent where domain logic lives. "infrastructure/" signals cross-cutting concerns. "middleware/" is HTTP-level wiring. No ambiguity about where anything belongs.',
    },

    // === SYNTHESIS ===
    {
      type: 'multiple-choice',
      hint: 'Eliminate the options that only partially fit.',
      question: 'What is the single principle that all agent-friendly architecture decisions should be evaluated against?',
      options: [
        'Minimize the total number of files in the project',
        'Follow the most popular framework conventions regardless of context',
        'Reduce the number of searches an agent needs to find and modify related code',
        'Ensure every file has comprehensive documentation comments',
      ],
      correctIndex: 2,
      explanation: 'Architecture for agent navigability is not about following any single pattern dogmatically. It is about one principle: reduce the number of searches an agent needs to find and modify related code. Feature-based modules achieve this by colocation. Consistent naming achieves this by predictability. Clear public APIs achieve this by eliminating ambiguity about what is internal vs external. Every structural decision should be evaluated through this lens.',
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
