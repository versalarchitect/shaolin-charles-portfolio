import type { LessonContent } from './types'

const content: LessonContent = {
  lessonId: '4-12',
  steps: [
    // === INTRODUCTION ===
    {
      type: 'info',
      title: 'Final capstone: redesign a real system for AI',
      body: "This is it. Everything you have learned — specs, constraints, task graphs, verification pipelines, override judgment, taste, stakeholder communication — synthesized into a single exercise. You will analyze a complex system, identify its architectural weaknesses, and redesign it for agent-fleet buildability. This is not a drill. This is the exact process you will execute in production. When you finish, you will have produced an artifact you could present to a real engineering team.",
    },
    {
      type: 'info',
      title: 'The system: ShopFlow e-commerce platform',
      body: "ShopFlow is a mid-size e-commerce platform built over 4 years by a team of 8 engineers who have since reduced to 3. It handles orders, inventory, payments, notifications, and admin. It is a monolith deployed as a single Docker container. The codebase is 120K lines of TypeScript. Test coverage is 34%. Deploy frequency is twice per week because every change risks breaking something unrelated. The team is drowning. They need to ship faster without hiring. This is your challenge.",
    },
    {
      type: 'checkpoint',
      xp: 5,
      message: 'Capstone challenge accepted!',
    },

    // === PHASE 1: MAP THE SYSTEM ===
    {
      type: 'info',
      title: 'Phase 1: Map all components and dependencies',
      body: "Before redesigning, you must understand. ShopFlow has 6 major domains: Orders (cart, checkout, fulfillment), Inventory (stock levels, warehouses, reorder triggers), Payments (processing, refunds, subscriptions), Notifications (email, SMS, push, in-app), Admin (dashboard, reports, user management), and Auth (login, sessions, permissions). They are all in one codebase with extensive cross-imports. Your first job: map what depends on what.",
    },
    {
      type: 'diagram',
      title: 'ShopFlow: Current Architecture (Tangled)',
      body: 'Every domain imports from every other domain. This is why a change to payments can break notifications.',
      diagram: {
        direction: 'TB',
        nodes: [
          { id: 'orders', label: 'Orders', sublabel: '28K LOC, 12% tests', shape: 'rect' },
          { id: 'inventory', label: 'Inventory', sublabel: '18K LOC, 45% tests', shape: 'rect' },
          { id: 'payments', label: 'Payments', sublabel: '22K LOC, 52% tests', shape: 'rect' },
          { id: 'notifications', label: 'Notifications', sublabel: '15K LOC, 8% tests', shape: 'rect' },
          { id: 'admin', label: 'Admin', sublabel: '25K LOC, 22% tests', shape: 'rect' },
          { id: 'auth', label: 'Auth', sublabel: '12K LOC, 61% tests', shape: 'rect' },
        ],
        edges: [
          { from: 'orders', to: 'inventory', label: 'stock checks' },
          { from: 'orders', to: 'payments', label: 'charge' },
          { from: 'orders', to: 'notifications', label: 'send emails' },
          { from: 'orders', to: 'auth', label: 'user context' },
          { from: 'inventory', to: 'notifications', label: 'low stock alerts' },
          { from: 'inventory', to: 'orders', label: 'reserve stock' },
          { from: 'payments', to: 'notifications', label: 'receipts' },
          { from: 'payments', to: 'orders', label: 'update status' },
          { from: 'admin', to: 'orders' },
          { from: 'admin', to: 'inventory' },
          { from: 'admin', to: 'payments' },
          { from: 'admin', to: 'auth' },
          { from: 'notifications', to: 'auth', label: 'user prefs' },
        ],
      },
    },
    {
      type: 'multiple-choice',
      question: 'Looking at the architecture diagram, which domain is the BIGGEST blocker to parallel agent development?',
      options: [
        'Auth — it has the most test coverage so agents will struggle with it',
        'Orders — it has the most code and touches every other domain, creating the highest coupling',
        'Notifications — it has the lowest test coverage',
        'Admin — it depends on everything',
      ],
      correctIndex: 1,
      explanation: 'Orders has the highest outbound coupling (imports from 4 other domains) AND the highest inbound coupling (Inventory and Payments both import from it). This bidirectional coupling means no agent can work on Orders without potentially affecting — or being affected by — changes in Inventory, Payments, Notifications, and Auth simultaneously.',
    },
    {
      type: 'checkpoint',
      xp: 10,
      message: 'Phase 1 complete: system mapped!',
    },

    // === PHASE 2: SCORE AGENT-BUILDABILITY ===
    {
      type: 'info',
      title: 'Phase 2: Score each component for agent-buildability',
      body: "Agent-buildability measures how effectively an agent fleet can work on a component in parallel with other work. High buildability means: clear boundaries, independent testing, low coupling, well-defined interface. Low buildability means: tangled imports, shared mutable state, no tests to verify correctness, unclear scope. Score each domain 0-10 based on: isolation (0-3), testability (0-3), interface clarity (0-2), and documentation (0-2).",
    },
    {
      type: 'code-demo',
      title: 'Agent-buildability scoring',
      body: 'Apply this scoring rubric to each domain. The scores reveal where architectural investment will have the highest return.',
      language: 'markdown',
      filename: 'docs/buildability-assessment.md',
      code: "# ShopFlow Agent-Buildability Assessment\n\n## Scoring Rubric\n- Isolation (0-3): Can this domain be modified without touching others?\n- Testability (0-3): Can an agent verify correctness independently?\n- Interface clarity (0-2): Is the public API well-defined?\n- Documentation (0-2): Can an agent understand scope from docs alone?\n\n## Scores\n\n| Domain | Isolation | Testability | Interface | Docs | Total |\n|--------|-----------|-------------|-----------|------|-------|\n| Orders | 0 | 1 | 0 | 1 | 2/10 |\n| Inventory | 1 | 2 | 1 | 1 | 5/10 |\n| Payments | 1 | 2 | 1 | 2 | 6/10 |\n| Notifications | 1 | 0 | 0 | 0 | 1/10 |\n| Admin | 0 | 1 | 1 | 1 | 3/10 |\n| Auth | 2 | 2 | 2 | 1 | 7/10 |\n\n## Analysis\n- Auth (7/10): Best candidate for first extraction — already semi-isolated\n- Payments (6/10): Good candidate — clear domain, decent tests\n- Notifications (1/10): Worst buildability — no tests, no clear interface,\n  imported by everything. Highest priority for redesign.\n- Orders (2/10): Core domain but deeply entangled. Needs strangler fig.",
    },
    {
      type: 'order',
      instruction: 'Order these domains from FIRST to extract into an independent package to LAST:',
      items: [
        'Orders (2/10 buildability, highest coupling)',
        'Auth (7/10 buildability, clear interface)',
        'Notifications (1/10 buildability, no tests)',
        'Payments (6/10 buildability, decent tests)',
        'Inventory (5/10 buildability, moderate coupling)',
      ],
      correctOrder: [1, 3, 4, 2, 0],
    },
    {
      type: 'checkpoint',
      xp: 10,
      message: 'Phase 2 complete: buildability scored!',
    },

    // === PHASE 3: IDENTIFY BLOCKERS ===
    {
      type: 'info',
      title: 'Phase 3: Identify the top 3 architectural blockers',
      body: "Now that you have scores, identify the structural problems that CAUSE low scores. These are not symptoms (low test coverage) but root causes (circular dependencies that make testing impossible). A blocker is something that, if resolved, would improve buildability scores across multiple domains simultaneously. Fix the blockers and the individual domain problems become tractable.",
    },
    {
      type: 'info',
      title: 'Blocker 1: Bidirectional coupling between Orders and Inventory',
      body: "Orders imports Inventory to check stock. Inventory imports Orders to reserve stock for an order. This circular dependency means neither can be extracted independently. The fix: introduce an event bus. Orders publishes 'OrderPlaced' events. Inventory subscribes and handles stock reservation. The dependency becomes unidirectional: both depend on event definitions, neither depends on the other's internals.",
    },
    {
      type: 'info',
      title: 'Blocker 2: Notifications as an implicit dependency',
      body: "Every domain directly calls notification functions: orders sends confirmation emails, payments sends receipts, inventory sends low-stock alerts. This makes Notifications a hidden coupling point — change how emails are sent and you break four other domains. The fix: Notifications becomes a standalone service that SUBSCRIBES to domain events. Domains publish events. Notifications decides what to send. Zero coupling from domains to Notifications.",
    },
    {
      type: 'info',
      title: 'Blocker 3: Shared database with no schema boundaries',
      body: "All 6 domains query the same database with no schema separation. Orders queries the inventory table directly. Admin queries everything. This makes any schema change potentially breaking for every domain. The fix: schema boundaries. Each domain owns its tables. Cross-domain data access is via API calls, not direct queries. This is the hardest change but enables true independent deployment.",
    },
    {
      type: 'multiple-choice',
      question: 'Why is "shared database with no schema boundaries" the hardest blocker to fix?',
      options: [
        'Because databases are complex technology',
        'Because every SQL query in the codebase potentially crosses domain boundaries — the blast radius of the fix touches the entire codebase simultaneously',
        'Because you need to migrate data',
        'Because agents cannot write SQL',
      ],
      correctIndex: 1,
      explanation: 'The other blockers can be fixed incrementally (add an event, subscribe to it). But database boundaries require auditing every query in 120K lines of code to determine which domain it belongs to, then routing cross-domain queries through APIs. The change touches everything, making incremental migration essential.',
    },
    {
      type: 'checkpoint',
      xp: 15,
      message: 'Phase 3 complete: blockers identified!',
    },

    // === PHASE 4: THE REDESIGN ===
    {
      type: 'info',
      title: 'Phase 4: The agent-buildable redesign',
      body: "Now you design the target architecture. The goal: every domain scores 8+ on agent-buildability. Every domain can be worked on by an independent agent with zero coordination. The system deploys any domain independently. A change to payments cannot break orders. This is not a theoretical exercise — you are writing the actual CLAUDE.md protocols, task graph, and verification pipeline that would govern the migration.",
    },
    {
      type: 'diagram',
      title: 'ShopFlow: Proposed Architecture (Decoupled)',
      body: 'Domains communicate through an event bus and typed API contracts. No direct cross-domain imports.',
      diagram: {
        direction: 'TB',
        nodes: [
          { id: 'events', label: 'Event Bus', sublabel: 'Typed domain events', shape: 'rounded', highlight: true },
          { id: 'types', label: '@shop/shared-types', sublabel: 'Event + API contracts', shape: 'pill', highlight: true },
          { id: 'orders', label: 'Orders Package', sublabel: 'Independent, 8/10', shape: 'rect' },
          { id: 'inventory', label: 'Inventory Package', sublabel: 'Independent, 9/10', shape: 'rect' },
          { id: 'payments', label: 'Payments Package', sublabel: 'Independent, 9/10', shape: 'rect' },
          { id: 'notifications', label: 'Notifications Package', sublabel: 'Event-driven, 8/10', shape: 'rect' },
          { id: 'admin', label: 'Admin Package', sublabel: 'API consumer only, 8/10', shape: 'rect' },
          { id: 'auth', label: 'Auth Package', sublabel: 'Standalone, 9/10', shape: 'rect' },
        ],
        edges: [
          { from: 'orders', to: 'events', label: 'publishes' },
          { from: 'inventory', to: 'events', label: 'publishes + subscribes' },
          { from: 'payments', to: 'events', label: 'publishes + subscribes' },
          { from: 'notifications', to: 'events', label: 'subscribes only' },
          { from: 'orders', to: 'types', dashed: true },
          { from: 'inventory', to: 'types', dashed: true },
          { from: 'payments', to: 'types', dashed: true },
          { from: 'notifications', to: 'types', dashed: true },
          { from: 'admin', to: 'types', dashed: true },
          { from: 'auth', to: 'types', dashed: true },
        ],
      },
    },
    {
      type: 'code-demo',
      title: 'Root CLAUDE.md: System-level protocol',
      body: 'This governs every agent working anywhere in the system. It is the constitution — individual package CLAUDE.md files add rules but cannot override these.',
      language: 'markdown',
      filename: 'CLAUDE.md',
      code: "# ShopFlow — Agent Protocol\n\n## System Rules (ALL agents, ALL packages)\n1. **No cross-package imports** except from @shop/shared-types\n2. **Communication between domains**: Event bus OR typed HTTP API only\n3. **Database**: Each package owns its schema. No cross-schema queries.\n4. **Testing**: Package tests must pass with no other package running\n5. **Deployment**: Each package deploys independently via its own pipeline\n\n## Shared Types Contract\nAll domain events and API request/response types live in @shop/shared-types.\nThis is the ONLY cross-cut. Changes here require review.\n\n## Event Bus Protocol\n- Events are immutable facts: OrderPlaced, PaymentProcessed, StockReserved\n- Publishers do not know who subscribes\n- Subscribers do not know who publishes\n- Events are typed in @shop/shared-types\n\n## Verification (every agent, every task)\n1. `bun run typecheck` — must pass\n2. `bun run test --filter={package}` — must pass\n3. `bun run build --filter={package}` — must produce artifact\n4. No lint errors introduced\n\n## Task Assignment Protocol\nEach agent receives: one package, one task, one CLAUDE.md.\nAgent scope = package scope. Never cross the boundary.",
    },
    {
      type: 'code-demo',
      title: 'Package-level CLAUDE.md example: Payments',
      body: 'Each domain has its own CLAUDE.md scoping agent work precisely. An agent assigned to payments literally cannot affect orders.',
      language: 'markdown',
      filename: 'packages/payments/CLAUDE.md',
      code: "# Payments Package\n\n## Scope\nAll payment processing: charges, refunds, subscriptions, webhooks.\n\n## Owns\n- packages/payments/src/ (all source)\n- packages/payments/prisma/ (own schema + migrations)\n- packages/payments/tests/\n\n## Publishes Events\n- PaymentProcessed { orderId, amount, status }\n- RefundIssued { orderId, amount, reason }\n- SubscriptionChanged { userId, planId, action }\n\n## Subscribes To\n- OrderPlaced → initiate payment processing\n- OrderCancelled → initiate refund\n\n## External Dependencies\n- Stripe SDK (payment processing)\n- @shop/shared-types (event + API contracts)\n\n## Off-Limits\n- Do NOT import from any other package\n- Do NOT query tables outside payments schema\n- Do NOT send notifications directly (publish event, let notifications handle)\n\n## Testing\n- Unit: mock Stripe, test business logic\n- Integration: test against Stripe test mode\n- Contract: verify published events match @shop/shared-types\n\n## Run\n- Dev: `bun run dev --filter=payments`\n- Test: `bun run test --filter=payments`\n- Build: `bun run build --filter=payments`",
    },
    {
      type: 'checkpoint',
      xp: 15,
      message: 'Phase 4 complete: redesign documented!',
    },

    // === PHASE 4 CONTINUED: TASK GRAPH ===
    {
      type: 'info',
      title: 'The migration task graph',
      body: "You cannot redesign the entire system at once. The task graph defines the order of operations — which migrations can run in parallel and which have dependencies. The critical path runs through the event bus (everything depends on it) and the shared types package (everything imports from it). Once those exist, all six domain extractions can happen in parallel.",
    },
    {
      type: 'diagram',
      title: 'Migration Task Graph',
      body: 'The critical path is vertical. Parallel work branches horizontally after the foundation is laid.',
      diagram: {
        direction: 'TB',
        nodes: [
          { id: 'types', label: '1. Create @shop/shared-types', sublabel: 'Define all events + API contracts', shape: 'rounded', highlight: true },
          { id: 'bus', label: '2. Implement Event Bus', sublabel: 'Pub/sub infrastructure', shape: 'rounded', highlight: true },
          { id: 'auth', label: '3a. Extract Auth', sublabel: 'Highest buildability', shape: 'rect' },
          { id: 'payments', label: '3b. Extract Payments', sublabel: 'Second highest', shape: 'rect' },
          { id: 'inventory', label: '3c. Extract Inventory', sublabel: 'Moderate coupling', shape: 'rect' },
          { id: 'notifications', label: '3d. Rewrite Notifications', sublabel: 'Event-driven from scratch', shape: 'rect' },
          { id: 'orders', label: '4. Refactor Orders', sublabel: 'Strangler fig (last)', shape: 'rect' },
          { id: 'admin', label: '5. Rebuild Admin', sublabel: 'API consumer of all', shape: 'rect' },
          { id: 'verify', label: '6. Full System Verification', sublabel: 'End-to-end tests', shape: 'rounded', highlight: true },
        ],
        edges: [
          { from: 'types', to: 'bus' },
          { from: 'bus', to: 'auth' },
          { from: 'bus', to: 'payments' },
          { from: 'bus', to: 'inventory' },
          { from: 'bus', to: 'notifications' },
          { from: 'auth', to: 'orders' },
          { from: 'payments', to: 'orders' },
          { from: 'inventory', to: 'orders' },
          { from: 'notifications', to: 'orders', dashed: true },
          { from: 'orders', to: 'admin' },
          { from: 'admin', to: 'verify' },
        ],
      },
    },
    {
      type: 'multiple-choice',
      question: 'Why does Orders extraction come AFTER Auth, Payments, and Inventory?',
      options: [
        'Because Orders has the most code',
        'Because Orders depends on all three — it cannot be decoupled until its dependencies have stable, independent interfaces to depend ON',
        'Because Orders is less important than the others',
        'Because Orders needs the event bus more than the others',
      ],
      correctIndex: 1,
      explanation: 'Orders currently imports directly from Auth, Payments, and Inventory. To extract Orders, those imports must be replaced with event subscriptions or API calls. But those APIs do not exist until Auth, Payments, and Inventory are extracted first. The dependency graph dictates the extraction order.',
    },
    {
      type: 'checkpoint',
      xp: 15,
      message: 'Task graph designed!',
    },

    // === PHASE 5: PROFESSIONAL PRESENTATION ===
    {
      type: 'info',
      title: 'Phase 5: Present as a professional document',
      body: "The redesign is complete in your head. Now you must communicate it. A professional architecture redesign document has: an executive summary (one paragraph for leadership), a current state assessment (with evidence), the proposed architecture (with diagrams), a migration plan (with timeline and risk), success metrics (how you will know it worked), and a cost estimate. This is the document you hand to a CTO or VP and say: this is what I recommend.",
    },
    {
      type: 'code-demo',
      title: 'Executive summary',
      body: 'One paragraph. This is what the CTO reads. If this paragraph does not compel them, they will not read the rest.',
      language: 'markdown',
      filename: 'docs/architecture-redesign.md',
      code: "# ShopFlow Architecture Redesign Proposal\n\n## Executive Summary\n\nShopFlow's monolithic architecture limits development velocity to 2 deploys/week\ndue to cross-domain coupling that makes every change a potential system-wide risk.\nThis proposal restructures the system into 6 independently deployable packages\ncommunicating through a typed event bus, enabling parallel development by\nmultiple agents/developers with zero coordination overhead. Estimated migration:\n4 weeks with a 3-person team + agent fleet. Expected outcome: 10x deploy\nfrequency, 60% reduction in production incidents, and the ability to scale\ndevelopment capacity without proportional hiring.",
    },
    {
      type: 'code-demo',
      title: 'Migration timeline and risk assessment',
      body: 'Stakeholders need to know: how long, what could go wrong, and how you mitigate risk.',
      language: 'markdown',
      filename: 'docs/migration-plan.md',
      code: "# Migration Plan\n\n## Timeline (4 weeks)\n\n### Week 1: Foundation\n- Create @shop/shared-types with all event definitions\n- Implement event bus (Redis Streams)\n- Set up monorepo tooling (Nx, per-package CI)\n- Risk: Low (additive, no existing code modified)\n\n### Week 2: First Extractions (parallel)\n- Agent A: Extract Auth package\n- Agent B: Extract Payments package\n- Agent C: Extract Inventory package\n- Agent D: Rewrite Notifications (event-driven)\n- Risk: Medium (strangler adapters keep old system live)\n\n### Week 3: Core Domain\n- Strangler fig for Orders (gradual migration)\n- Each endpoint migrated individually with adapter\n- Old + new run simultaneously (shadow mode)\n- Risk: Highest (core domain, most coupling)\n\n### Week 4: Integration & Admin\n- Rebuild Admin as pure API consumer\n- Full end-to-end testing\n- Remove legacy adapters\n- Risk: Low (verification-heavy, no new logic)\n\n## Risk Mitigation\n- Strangler fig: old system remains live until new passes all tests\n- Feature flags: route traffic to new/old per endpoint\n- Rollback: revert to monolith by disabling feature flags (< 5 min)\n- Shadow mode: new system processes in parallel, compare outputs\n\n## Success Metrics (measured at 30 days post-migration)\n- Deploy frequency: >2x daily (from 2x weekly)\n- Mean time to recovery: <15 min (from 2-4 hours)\n- Production incidents: <2/month (from 8/month)\n- Developer satisfaction: measured via survey\n- Agent buildability score: all domains >8/10",
    },
    {
      type: 'multiple-choice',
      question: 'The migration plan includes "shadow mode: new system processes in parallel, compare outputs." Why is this critical for the Orders migration?',
      options: [
        'Because Orders has the most code',
        'Because Orders handles money-adjacent operations (checkout, fulfillment) where incorrect behavior has immediate business impact — shadow mode proves equivalence before cutover',
        'Because agents make more mistakes on larger codebases',
        'Because the team needs time to learn the new system',
      ],
      correctIndex: 1,
      explanation: 'Orders manages checkout and fulfillment — operations where bugs mean lost revenue or unfulfilled orders. Shadow mode runs both old and new simultaneously, comparing outputs. If they diverge, you know the new system has a behavior difference BEFORE it affects real customers. This is proportional risk management for a high-stakes domain.',
    },
    {
      type: 'checkpoint',
      xp: 20,
      message: 'Phase 5 complete: professional document ready!',
    },

    // === FINAL SYNTHESIS ===
    {
      type: 'info',
      title: 'What you just did',
      body: "You mapped a complex system. Scored its components for agent-buildability. Identified structural blockers. Designed a decoupled target architecture with CLAUDE.md protocols. Created a task graph for parallel migration. And presented it as a professional document. This is the complete skill set of an agent-system architect. You do not just USE agents — you DESIGN systems that make agent fleets maximally effective. Your judgment is the moat.",
    },
    {
      type: 'checklist',
      title: 'Capstone skills demonstrated:',
      items: [
        'System mapping: I can identify all components and their coupling relationships',
        'Buildability scoring: I can assess any component for agent-fleet development suitability',
        'Blocker identification: I can find structural root causes that block parallel development',
        'Architecture design: I can design event-driven, independently deployable systems',
        'Protocol authoring: I can write CLAUDE.md files that scope agent work precisely',
        'Task graph design: I can sequence migration work for maximum parallelism',
        'Verification pipeline: I can define automated quality gates per package',
        'Professional communication: I can present technical redesigns to stakeholders',
        'Risk assessment: I can identify and mitigate migration risks proportionally',
        'The full synthesis: I am an agent-system architect, not just an agent user',
      ],
    },
    {
      type: 'checkpoint',
      xp: 65,
      message: 'CAPSTONE COMPLETE. You are an agent-system architect. You design the systems that make agent fleets maximally effective. Your judgment — your taste, your override instinct, your constraint design, your communication skill — is the irreplaceable moat. Ship accordingly.',
    },
  ],
}

export default content
