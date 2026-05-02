import type { LessonContent } from './types'

const content: LessonContent = {
  lessonId: '4-5',
  steps: [
    // === INTRODUCTION ===
    {
      type: 'info',
      title: 'The Teardown: reverse-engineering for agent-buildability',
      body: "Take any production system — an e-commerce platform, a SaaS product, an internal tool. Now ask one question: could a coordinated agent fleet build and maintain this? Not \"could an agent write some of the code\" — but could agents own it end-to-end? Build new features in parallel. Fix bugs without breaking unrelated modules. Extend it without tribal knowledge. The Teardown Methodology gives you a systematic way to answer this question and produce an actionable redesign proposal.",
    },
    {
      type: 'info',
      title: 'Why teardowns matter',
      body: "Every codebase you inherit, join, or grow past a certain size needs this analysis. Most production systems were designed for human teams — they rely on tribal knowledge, implicit conventions, and shared mental models that agents cannot access. The Teardown reveals exactly where these human-dependent assumptions live and gives you a concrete plan to eliminate them. The output is not a rewrite — it is a targeted set of changes that transform a human-native system into an agent-native one.",
    },

    // === THE METHODOLOGY ===
    {
      type: 'diagram',
      title: 'The Teardown Methodology',
      body: 'Four phases, each producing a specific artifact. The final output is a scored report with redesign recommendations.',
      diagram: {
        direction: 'LR',
        nodes: [
          { id: 'map', label: 'Phase 1: Map', sublabel: 'Component inventory', shape: 'rounded' },
          { id: 'score', label: 'Phase 2: Score', sublabel: 'Agent-buildability per component', shape: 'rounded' },
          { id: 'blockers', label: 'Phase 3: Blockers', sublabel: 'What prevents agent work', shape: 'rounded' },
          { id: 'redesign', label: 'Phase 4: Redesign', sublabel: 'Targeted improvements', shape: 'rounded', highlight: true },
        ],
        edges: [
          { from: 'map', to: 'score' },
          { from: 'score', to: 'blockers' },
          { from: 'blockers', to: 'redesign' },
        ],
      },
    },
    {
      type: 'checkpoint',
      xp: 2,
      message: 'Methodology overview complete!',
    },

    // === PHASE 1: MAP ===
    {
      type: 'info',
      title: 'Phase 1: Map Components',
      body: "List every component in the system. Not classes or functions — system components. A component is a cohesive unit that could theoretically be owned by one agent. Examples: user authentication, payment processing, order management, email notifications, admin dashboard, API gateway. For each component, document: its responsibility (one sentence), its dependencies (what it calls), its dependents (what calls it), and its data stores (what databases/caches it reads/writes).",
    },
    {
      type: 'code-demo',
      title: 'Phase 1 output: Component map',
      body: 'A real component map for an e-commerce platform. Each component is documented with its boundaries and dependencies.',
      language: 'markdown',
      filename: 'teardown-phase1.md',
      code: "# Component Map: E-Commerce Platform\n\n## 1. User Auth\n- Responsibility: Registration, login, session management, password reset\n- Dependencies: Email Service (sends verification emails)\n- Dependents: ALL other components (check auth state)\n- Data: users table, sessions table\n- Files: 12 files across 3 directories\n\n## 2. Product Catalog\n- Responsibility: CRUD products, categories, search, filtering\n- Dependencies: Image Service (product photos)\n- Dependents: Orders, Cart, Admin Dashboard\n- Data: products table, categories table, product_images table\n- Files: 18 files across 2 directories\n\n## 3. Shopping Cart\n- Responsibility: Add/remove items, calculate totals, apply coupons\n- Dependencies: Product Catalog (price lookup), User Auth (cart ownership)\n- Dependents: Checkout/Orders\n- Data: carts table, cart_items table\n- Files: 8 files in 1 directory\n\n## 4. Orders & Checkout\n- Responsibility: Place orders, track status, handle fulfillment\n- Dependencies: Cart, Payments, Inventory, Email Service\n- Dependents: Admin Dashboard, Analytics\n- Data: orders table, order_items table, order_events table\n- Files: 24 files across 4 directories\n\n## 5. Payments\n- Responsibility: Charge cards, process refunds, handle webhooks\n- Dependencies: Stripe SDK, User Auth\n- Dependents: Orders\n- Data: payments table, refunds table\n- Files: 9 files in 1 directory\n\n## 6. Email Service\n- Responsibility: Send transactional emails (verification, receipts, shipping)\n- Dependencies: Template engine, SMTP provider\n- Dependents: Auth, Orders, Marketing\n- Data: email_logs table\n- Files: 14 files across 2 directories",
    },
    {
      type: 'multiple-choice',
      question: 'In the component map above, which component is likely the hardest for agents to work on independently?',
      options: [
        'Payments — because it handles money',
        'Orders & Checkout — because it depends on 4 other components and is spread across 4 directories',
        'User Auth — because all other components depend on it',
        'Shopping Cart — because it has the fewest files',
      ],
      correctIndex: 1,
      explanation: 'Orders & Checkout has 4 dependencies (Cart, Payments, Inventory, Email) AND is spread across 4 directories. This means an agent working on Orders needs to understand 4 other systems and navigate 4 different locations. High dependency count + scattered files = lowest agent-buildability.',
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'Phase 1 complete!',
    },

    // === PHASE 2: SCORE ===
    {
      type: 'info',
      title: 'Phase 2: Score Agent-Buildability',
      body: "For each component, score it on five factors that determine whether an agent can effectively build and maintain it. Each factor scored 1-5 (1 = agent-hostile, 5 = agent-friendly). The factors: (1) Clear Boundaries — can an agent know what files belong to this component without guessing? (2) Consistent Patterns — do all files follow the same structure? (3) Testable Contracts — are the interfaces well-defined and testable? (4) No Tribal Knowledge — can an agent understand this without asking a human? (5) Isolation — can it be modified without affecting other components?",
    },
    {
      type: 'code-demo',
      title: 'Phase 2 output: Scorecard',
      body: 'Scoring each component reveals exactly where agent-buildability breaks down.',
      language: 'markdown',
      filename: 'teardown-phase2.md',
      code: "# Agent-Buildability Scores\n\n## Scoring Key\n- Boundaries: Can agent find all files? (1-5)\n- Patterns: Consistent file structure? (1-5)\n- Contracts: Well-defined testable interfaces? (1-5)\n- Knowledge: Zero tribal knowledge needed? (1-5)\n- Isolation: Modifiable without side effects? (1-5)\n\n| Component       | Bounds | Pattern | Contract | Knowledge | Isolation | TOTAL |\n|-----------------|--------|---------|----------|-----------|-----------|-------|\n| User Auth       |   4    |    4    |    3     |     3     |     2     |  16   |\n| Product Catalog |   3    |    3    |    4     |     4     |     4     |  18   |\n| Shopping Cart   |   5    |    5    |    4     |     5     |     3     |  22   |\n| Orders          |   2    |    2    |    2     |     2     |     1     |   9   |\n| Payments        |   5    |    5    |    5     |     4     |     4     |  23   |\n| Email Service   |   3    |    3    |    3     |     2     |     3     |  14   |\n\n## Interpretation\n- 20-25: Agent-native. Agents can own this component.\n- 15-19: Workable. Minor improvements needed.\n- 10-14: Friction. Agents struggle, need guidance.\n-  5-9:  Agent-hostile. Requires redesign for agent ownership.\n\n## Priority Targets: Orders (9), Email Service (14)",
    },
    {
      type: 'info',
      title: 'What each score means',
      body: "A Boundaries score of 2 means files are scattered across multiple directories with no clear ownership. A Patterns score of 2 means each file uses different conventions (some use classes, some functions, naming is inconsistent). A Contracts score of 2 means the module's interface is implicit — you have to read the implementation to know what it exposes. A Knowledge score of 2 means there are undocumented assumptions an agent will miss (\"we never delete orders\" or \"this field is always in UTC\"). An Isolation score of 1 means modifying this component reliably breaks others.",
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'Phase 2 scored!',
    },

    // === PHASE 3: BLOCKERS ===
    {
      type: 'info',
      title: 'Phase 3: Identify Blockers',
      body: "For each low-scoring component, identify the specific blockers — the concrete things that make it agent-hostile. These are not vague observations (\"it is complex\") but actionable findings: \"The order state machine is not documented anywhere — an agent will not know valid state transitions.\" \"Order files are in src/controllers/, src/services/, src/jobs/, and src/events/ — four directories with no clear connection.\" \"The total calculation depends on 3 undocumented business rules stored in a shared utility.\" Each blocker becomes a task in Phase 4.",
    },
    {
      type: 'code-demo',
      title: 'Phase 3 output: Blocker analysis for Orders component',
      body: 'Each blocker is specific, measurable, and directly actionable. No vague observations.',
      language: 'markdown',
      filename: 'teardown-phase3.md',
      code: "# Blockers: Orders & Checkout (Score: 9/25)\n\n## Boundary Blockers (Score: 2)\n- B1: Order files split across 4 dirs: controllers/, services/, jobs/, events/\n- B2: No feature directory — agent cannot list \"all order files\" in one command\n- B3: Shared utility `calculateOrderTotal` in lib/utils.ts (not owned by Orders)\n\n## Pattern Blockers (Score: 2)\n- P1: Controller uses class syntax, service uses functions, job uses factory pattern\n- P2: Some files use camelCase, others kebab-case (orderService vs order-events)\n- P3: Tests in 2 locations: __tests__/orders/ AND orders.test.ts files\n\n## Contract Blockers (Score: 2)\n- C1: No defined interface between Orders ↔ Payments (direct function imports)\n- C2: Order status changes via direct DB update (no state machine or validation)\n- C3: Three callers reach into order internals (bypass public methods)\n\n## Knowledge Blockers (Score: 2)\n- K1: \"Orders with status 'shipped' cannot be cancelled\" — undocumented rule\n- K2: Total calculation includes tax logic that varies by state — buried in utility\n- K3: Webhook from Stripe updates order status — not obvious from order code\n\n## Isolation Blockers (Score: 1)\n- I1: Modifying order total logic breaks cart display (shared function)\n- I2: Order events trigger 5 side effects in other modules (tightly coupled)\n- I3: Order table has foreign keys to 4 other tables with cascade deletes",
    },
    {
      type: 'multiple-choice',
      question: 'Blocker K1 states: "Orders with status shipped cannot be cancelled — undocumented rule." Where should this knowledge live in an agent-native system?',
      options: [
        'In a README that developers read during onboarding',
        'In a code comment above the cancel function',
        'In the Orders module CLAUDE.md AND enforced in code via a state machine with explicit valid transitions',
        'In the project wiki',
      ],
      correctIndex: 2,
      explanation: 'Tribal knowledge must be (1) documented where agents will read it (CLAUDE.md) AND (2) enforced in code so agents cannot violate it even if they miss the documentation. A state machine that explicitly defines valid transitions makes invalid transitions a compile-time or runtime error — the agent physically cannot cancel a shipped order.',
    },
    {
      type: 'checkpoint',
      xp: 4,
      message: 'Blockers identified!',
    },

    // === PHASE 4: REDESIGN ===
    {
      type: 'info',
      title: 'Phase 4: Propose Redesign',
      body: "For each blocker, propose a specific fix. Not a rewrite — a targeted intervention. Boundary blockers get a directory restructure (move files to one feature directory). Pattern blockers get a conventions document plus a refactoring pass. Contract blockers get explicit interface definitions. Knowledge blockers get documentation in CLAUDE.md plus code enforcement. Isolation blockers get decoupling (events instead of direct calls). Prioritize by impact: which fixes unlock the most parallel agent work?",
    },
    {
      type: 'code-demo',
      title: 'Phase 4 output: Redesign proposal (Orders)',
      body: 'Each fix targets a specific blocker. Prioritized by impact on agent-buildability.',
      language: 'markdown',
      filename: 'teardown-phase4.md',
      code: "# Redesign Proposal: Orders & Checkout\n\n## Priority 1: Boundaries (unlocks findability)\n- Move all order files to src/features/orders/\n- Extract `calculateOrderTotal` from lib/utils.ts into orders/\n- Estimated effort: 2 hours\n- Impact: Boundaries score 2 → 5\n\n## Priority 2: Contracts (unlocks parallel work)\n- Define OrderPaymentContract (types + interface)\n- Implement state machine: Order.transition(from, to) with validation\n- Replace direct imports with contract-based communication\n- Estimated effort: 4 hours\n- Impact: Contracts score 2 → 4, Isolation 1 → 3\n\n## Priority 3: Knowledge (unlocks autonomous agent work)\n- Create src/features/orders/CLAUDE.md with all business rules\n- Document state machine transitions (which states can reach which)\n- Document tax calculation rules with examples\n- Estimated effort: 1 hour\n- Impact: Knowledge score 2 → 5\n\n## Priority 4: Patterns (unlocks consistency)\n- Refactor all order files to function-based pattern\n- Rename to consistent convention: orders.handler.ts, orders.service.ts\n- Collocate tests: orders.test.ts in same directory\n- Estimated effort: 2 hours\n- Impact: Patterns score 2 → 5\n\n## Priority 5: Isolation (unlocks independence)\n- Replace direct side effects with event emissions\n- Other modules subscribe to order events (do not call order functions)\n- Remove cascade deletes — use soft-delete with cleanup job\n- Estimated effort: 6 hours\n- Impact: Isolation score 1 → 4\n\n## Projected Final Score: 9 → 23 (from agent-hostile to agent-native)\n## Total Estimated Effort: 15 hours",
    },
    {
      type: 'order',
      instruction: 'Order the redesign priorities by impact (fix first → fix last):',
      items: [
        'Pattern consistency (rename files, standardize conventions)',
        'Boundary restructure (move files to feature directory)',
        'Knowledge documentation (CLAUDE.md with business rules)',
        'Interface contracts (define typed boundaries between modules)',
        'Isolation improvements (events instead of direct coupling)',
      ],
      correctOrder: [1, 3, 2, 0, 4],
    },
    {
      type: 'checkpoint',
      xp: 4,
      message: 'Redesign proposed!',
    },

    // === AGENT-BUILDABILITY FACTORS DEEP DIVE ===
    {
      type: 'info',
      title: 'Factor: Tribal knowledge elimination',
      body: "Tribal knowledge is anything a human \"just knows\" that is not in the code or documented. Business rules (\"we always round up on tax\"). Implicit conventions (\"handlers never call other handlers directly\"). Historical context (\"we use that deprecated API because the new one has a bug in edge cases\"). Deployment quirks (\"never deploy on Fridays — the batch job runs Saturday morning\"). Every piece of tribal knowledge is a landmine for agents. They will violate it, cause bugs, and you will spend time debugging something that \"everyone knows.\" Document it or enforce it in code.",
    },
    {
      type: 'info',
      title: 'Factor: Testable contracts',
      body: "If you cannot test the boundary between two modules, an agent cannot verify its work is correct. A testable contract means: (1) The interface is typed — TypeScript catches mismatches at compile time. (2) The behavior is specified — there are tests that verify the contract is honored. (3) The contract is independently mockable — an agent can test its module without running the entire system. Every module should be testable in isolation. If testing Module A requires running Module B, the boundary between them is not clean enough.",
    },
    {
      type: 'multiple-choice',
      question: 'You are doing a teardown of an internal tool. The deployment process requires running 3 scripts in a specific order with manual checks between them. How does this affect agent-buildability?',
      options: [
        'It does not — deployment is separate from code architecture',
        'It lowers the Knowledge score — agents cannot deploy without tribal knowledge of the manual steps and order',
        'It only matters for CI/CD agents, not coding agents',
        'It increases agent-buildability because scripts are automatable',
      ],
      correctIndex: 1,
      explanation: 'Undocumented manual processes are tribal knowledge. Even if coding agents do not deploy directly, they need to understand deployment constraints when designing features (e.g., "this requires a migration that must run before code deploys"). The manual process should be documented in CLAUDE.md and ideally automated into a single script agents can understand.',
    },

    // === SYNTHESIS ===
    {
      type: 'info',
      title: 'When to run a teardown',
      body: "Run a teardown when: (1) You inherit a codebase and plan to use agents heavily. (2) Agent conflict rates exceed 15% despite good CLAUDE.md documentation. (3) Agents consistently produce incorrect code in specific areas (indicates tribal knowledge or unclear boundaries). (4) You are planning a significant new feature and want to ensure agent-friendly architecture. The teardown takes 2-4 hours for a mid-size system. The redesign implementation takes days to weeks — but the payoff is permanent improvement in agent productivity.",
    },
    {
      type: 'info',
      title: 'The teardown mindset',
      body: "The Teardown is not about judging legacy code. Legacy code was built for human teams with human assumptions. That was appropriate at the time. The Teardown acknowledges the new reality: agents are your builders now, and they have different requirements. Clear boundaries instead of tribal knowledge. Explicit contracts instead of implicit conventions. Documented rules instead of team culture. This is not a criticism of the old way — it is adaptation to a new capability.",
    },
    {
      type: 'checklist',
      title: 'Teardown Methodology checklist:',
      items: [
        'I can map all components in a system with their dependencies and data stores',
        'I can score each component on the 5 agent-buildability factors',
        'I can identify specific, actionable blockers (not vague observations)',
        'I can propose targeted redesigns with effort estimates and impact projections',
        'I prioritize fixes by impact on agent parallelism and autonomy',
        'I know when a teardown is warranted (inheritance, high conflict rate, agent failures)',
        'I can produce a complete teardown report as a deliverable',
      ],
    },
    {
      type: 'checkpoint',
      xp: 22,
      message: 'The Teardown Methodology mastered! You can now systematically evaluate and redesign any system for agent-buildability.',
    },
  ],
}

export default content
