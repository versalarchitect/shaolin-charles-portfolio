import type { LessonContent } from './types'

const content: LessonContent = {
  lessonId: '4-6',
  steps: [
    // === INTRODUCTION ===
    {
      type: 'info',
      title: 'Designing systems that scale with more AI agents',
      body: "Module boundaries handle individual features. But what about the entire system architecture? How do you design a system where adding another agent to the fleet makes things FASTER rather than slower? This is the scaling question. Some architectures have a natural ceiling — after 3 concurrent agents, adding a 4th creates more coordination overhead than speed gain. Other architectures scale linearly: 10 agents working 10x faster with zero additional coordination cost. The difference is in the system-level patterns.",
    },
    {
      type: 'info',
      title: 'The coordination cost function',
      body: "In a coupled system, coordination cost grows quadratically with team size. 2 agents need 1 coordination path. 3 agents need 3. 5 agents need 10. 10 agents need 45. This is why tightly coupled architectures break down with more agents — the coordination overhead eventually exceeds the work being done. In a decoupled system, coordination cost stays flat: each agent works independently against a contract. Adding agent #11 requires zero communication with agents 1-10. This is the architecture you are designing toward.",
    },

    // === ARCHITECTURAL PATTERNS ===
    {
      type: 'diagram',
      title: 'Coupled vs decoupled at scale',
      body: 'In a coupled system, agents communicate with each other (N*N paths). In a decoupled system, agents communicate only with contracts (N paths).',
      diagram: {
        direction: 'TB',
        nodes: [
          { id: 'coupled', label: 'Coupled System', sublabel: 'Agents depend on each other', shape: 'rounded' },
          { id: 'c_a1', label: 'Agent 1', shape: 'rect' },
          { id: 'c_a2', label: 'Agent 2', shape: 'rect' },
          { id: 'c_a3', label: 'Agent 3', shape: 'rect' },
          { id: 'decoupled', label: 'Decoupled System', sublabel: 'Agents depend on contracts only', shape: 'rounded', highlight: true },
          { id: 'contract', label: 'Contracts', sublabel: 'Shared interface definitions', shape: 'diamond', highlight: true },
          { id: 'd_a1', label: 'Agent 1', shape: 'rect' },
          { id: 'd_a2', label: 'Agent 2', shape: 'rect' },
          { id: 'd_a3', label: 'Agent 3', shape: 'rect' },
        ],
        edges: [
          { from: 'coupled', to: 'c_a1' },
          { from: 'coupled', to: 'c_a2' },
          { from: 'coupled', to: 'c_a3' },
          { from: 'c_a1', to: 'c_a2', dashed: true },
          { from: 'c_a2', to: 'c_a3', dashed: true },
          { from: 'c_a1', to: 'c_a3', dashed: true },
          { from: 'decoupled', to: 'contract' },
          { from: 'contract', to: 'd_a1' },
          { from: 'contract', to: 'd_a2' },
          { from: 'contract', to: 'd_a3' },
        ],
      },
    },
    {
      type: 'checkpoint',
      xp: 2,
      message: 'Scaling model understood!',
    },

    // === EVENT-DRIVEN ARCHITECTURE ===
    {
      type: 'info',
      title: 'Pattern 1: Event-driven architecture',
      body: "In an event-driven system, modules emit events — they do not call each other directly. When an order is placed, the Orders module emits an OrderPlaced event. The Payments module listens for this event and processes the charge. The Email module listens and sends a confirmation. The Inventory module listens and decrements stock. No module needs to know the others exist. This means: agents building Payments never need to read Orders code. Agents building Email never need to coordinate with Payments. Each agent works against events, not other modules.",
    },
    {
      type: 'code-demo',
      title: 'Event-driven module independence',
      body: 'Modules communicate through events. No direct calls, no shared mutable state, no coordination needed between agents building different modules.',
      language: 'typescript',
      filename: 'event-driven-pattern.ts',
      code: "// === Event Definitions (the shared contract) ===\n// src/events/order.events.ts\nexport interface OrderEvents {\n  'order.placed': {\n    orderId: string\n    customerId: string\n    items: Array<{ productId: string; quantity: number; priceCents: number }>\n    totalCents: number\n  }\n  'order.cancelled': {\n    orderId: string\n    reason: string\n  }\n  'order.shipped': {\n    orderId: string\n    trackingNumber: string\n  }\n}\n\n// === Orders module (Agent A builds this) ===\n// src/features/orders/orders.service.ts\nimport { eventBus } from '@/infrastructure/event-bus'\n\nexport async function placeOrder(input: PlaceOrderInput) {\n  const order = await db.orders.create(input)\n  \n  // Emit event — Orders does NOT know who listens\n  eventBus.emit('order.placed', {\n    orderId: order.id,\n    customerId: input.customerId,\n    items: input.items,\n    totalCents: order.totalCents,\n  })\n  \n  return order\n}\n\n// === Payments module (Agent B builds this) ===\n// src/features/payments/payments.listeners.ts\nimport { eventBus } from '@/infrastructure/event-bus'\n\neventBus.on('order.placed', async (event) => {\n  await chargeCustomer(event.customerId, event.totalCents)\n})\n\n// === Email module (Agent C builds this) ===\n// src/features/emails/email.listeners.ts\nimport { eventBus } from '@/infrastructure/event-bus'\n\neventBus.on('order.placed', async (event) => {\n  await sendOrderConfirmation(event.customerId, event.orderId)\n})",
    },
    {
      type: 'info',
      title: 'Why event-driven enables agent parallelism',
      body: "With direct function calls, adding a notification when an order is placed requires modifying the Orders module (add a call to the notification service). That means the agent building notifications MUST also touch the Orders code — conflict risk. With events, the agent building notifications just adds a new listener. It never touches Orders. Never touches Payments. Never conflicts with any other agent. The event bus is the coordination mechanism that replaces direct module-to-module coupling.",
    },
    {
      type: 'multiple-choice',
      question: 'A new business requirement: when an order is placed, update the customer loyalty points. In an event-driven system, which files does the agent need to modify?',
      options: [
        'orders.service.ts (to call the loyalty update) and loyalty.service.ts (to implement it)',
        'Only loyalty.listeners.ts (subscribe to order.placed event) and loyalty.service.ts (implement the logic)',
        'order.events.ts (add loyalty data to event), orders.service.ts, and loyalty.service.ts',
        'The event bus configuration and the loyalty module',
      ],
      correctIndex: 1,
      explanation: 'In a properly event-driven system, the order.placed event already contains all needed data (customerId, totalCents). The loyalty module just subscribes to that existing event and implements its own logic. Zero changes to Orders module. Zero risk of conflicting with other agents working on Orders or other features listening to the same event.',
    },
    {
      type: 'checkpoint',
      xp: 4,
      message: 'Event-driven architecture mastered!',
    },

    // === CONTRACT-FIRST DEVELOPMENT ===
    {
      type: 'info',
      title: 'Pattern 2: Contract-first development',
      body: "Define all interfaces BEFORE any implementation begins. The architect (you) writes the contracts: API schemas, event types, database interfaces, module boundaries. Then you dispatch agents — each agent implements one module against the contracts. No agent needs to wait for another. No agent needs to read another's implementation. The contracts are the ONLY coordination mechanism. This is the pattern that enables maximum parallelism: N agents building N modules simultaneously with zero conflicts.",
    },
    {
      type: 'code-demo',
      title: 'Contract-first workflow',
      body: 'You write contracts first. Then N agents implement in parallel. Each agent only reads the contracts and its own module.',
      language: 'typescript',
      filename: 'contract-first.ts',
      code: "// === STEP 1: Architect writes ALL contracts ===\n\n// src/contracts/api.contract.ts\nexport interface API {\n  'POST /orders': {\n    body: { items: CartItem[]; shippingAddress: Address }\n    response: { orderId: string; estimatedDelivery: Date }\n  }\n  'GET /orders/:id': {\n    params: { id: string }\n    response: Order\n  }\n  'POST /payments/charge': {\n    body: { orderId: string; paymentMethod: string }\n    response: { transactionId: string; status: 'success' | 'failed' }\n  }\n}\n\n// src/contracts/events.contract.ts\nexport interface SystemEvents {\n  'order.placed': { orderId: string; customerId: string; totalCents: number }\n  'payment.completed': { orderId: string; transactionId: string }\n  'shipment.created': { orderId: string; trackingNumber: string }\n}\n\n// src/contracts/repositories.contract.ts\nexport interface OrderRepository {\n  create(input: CreateOrderInput): Promise<Order>\n  findById(id: string): Promise<Order | null>\n  updateStatus(id: string, status: OrderStatus): Promise<void>\n}\n\n// === STEP 2: Dispatch agents in parallel ===\n// Agent A: Implement Orders (builds to API + Events + Repository contracts)\n// Agent B: Implement Payments (builds to API + Events contracts)\n// Agent C: Implement Notifications (builds to Events contract)\n// Agent D: Implement Shipping (builds to Events contract)\n// All work simultaneously. Zero coordination needed.",
    },
    {
      type: 'info',
      title: 'The architect\'s deliverable',
      body: "In contract-first development, your primary output is not code — it is contracts. You write: API schemas (what endpoints exist, what data flows), event definitions (what events are emitted, what data they carry), module interfaces (what each module exposes to others), and data schemas (what tables exist, what columns they have). This takes 1-2 hours. Then 5 agents implement the entire system in parallel — each building against your contracts independently. Total elapsed time: the longest single module, not the sum of all modules.",
    },
    {
      type: 'checkpoint',
      xp: 4,
      message: 'Contract-first locked in!',
    },

    // === MODULAR MONOLITH ===
    {
      type: 'info',
      title: 'Pattern 3: The modular monolith with clear seams',
      body: "You do not need microservices to get agent parallelism. A modular monolith — one deployment unit with strictly enforced module boundaries — gives you all the parallelism benefits with none of the operational overhead. The key: modules communicate only through defined interfaces. No reaching into another module's internals. No shared database tables between modules. No circular dependencies. Each module is deployed together but developed independently. This is often the ideal architecture for agent fleets: maximum development parallelism, minimum operational complexity.",
    },
    {
      type: 'code-demo',
      title: 'Modular monolith with enforced boundaries',
      body: 'One deployable unit. Strict module isolation enforced by the import rules. Each module is independently buildable by an agent.',
      language: 'typescript',
      filename: 'modular-monolith.ts',
      code: "// === Architecture: Modular Monolith ===\n//\n// Rules (enforced in CLAUDE.md + linter):\n// 1. Modules ONLY import from other modules via their index.ts\n// 2. No module accesses another module's database tables\n// 3. Cross-module communication via event bus OR defined interfaces\n// 4. Each module owns its own migrations\n\n// src/features/orders/index.ts — PUBLIC API\nexport { placeOrder, cancelOrder, getOrder } from './orders.service'\nexport type { Order, OrderStatus } from './orders.types'\n// Everything else is internal — other modules cannot import it\n\n// src/features/payments/index.ts — PUBLIC API  \nexport { chargePayment, refundPayment } from './payments.service'\nexport type { Payment, PaymentStatus } from './payments.types'\n\n// Enforcement via ESLint rule:\n// eslint-plugin-boundaries or custom rule:\n{\n  \"rules\": {\n    \"boundaries/element-types\": [\n      \"error\",\n      {\n        \"default\": {\n          \"allow\": [\"[same-module]\"]\n        },\n        \"rules\": [\n          {\n            \"from\": \"features/*\",\n            \"allow\": [\"features/*/index\", \"contracts/*\", \"infrastructure/*\"]\n          }\n        ]\n      }\n    ]\n  }\n}\n\n// If Agent A tries to import from features/payments/payments.service.ts\n// (bypassing the index), the linter catches it immediately.",
    },
    {
      type: 'multiple-choice',
      question: 'What is the primary advantage of a modular monolith over microservices for agent fleet development?',
      options: [
        'Better performance due to no network calls between modules',
        'Same development parallelism (independent modules) but drastically lower operational complexity (one deployment, one database, one monitoring setup)',
        'Easier to understand for agents because it is one codebase',
        'Microservices require containers which agents cannot configure',
      ],
      correctIndex: 1,
      explanation: 'The modular monolith gives you the development-time isolation that enables parallel agent work (each module is independent) without the operational tax of microservices (multiple deployments, network reliability, distributed tracing, service discovery). You get the parallelism benefits at the code level without the infrastructure complexity at the operational level.',
    },
    {
      type: 'checkpoint',
      xp: 4,
      message: 'Modular monolith pattern mastered!',
    },

    // === EVENT SOURCING & CQRS ===
    {
      type: 'info',
      title: 'Pattern 4: Event sourcing for agent-safe state management',
      body: "In event sourcing, you never mutate state directly. Instead, you record events: OrderPlaced, PaymentCharged, ItemShipped. The current state is derived by replaying events. Why is this agent-friendly? Because events are append-only. Two agents can never conflict on a state mutation — they both just append new events. And the event log provides a complete audit trail that agents can read to understand what happened, without needing tribal knowledge of state transitions.",
    },
    {
      type: 'code-demo',
      title: 'Event sourcing eliminates state conflicts',
      body: 'Multiple agents can append events simultaneously without conflicts. State is derived, never directly mutated.',
      language: 'typescript',
      filename: 'event-sourcing.ts',
      code: "// === Event Store (append-only, never conflicts) ===\n\ninterface DomainEvent {\n  id: string\n  aggregateId: string\n  type: string\n  data: Record<string, unknown>\n  timestamp: Date\n  version: number\n}\n\n// Agent A works on order placement:\nawait eventStore.append({\n  aggregateId: orderId,\n  type: 'OrderPlaced',\n  data: { customerId, items, totalCents },\n})\n\n// Agent B works on payment processing (simultaneously, no conflict):\nawait eventStore.append({\n  aggregateId: orderId,\n  type: 'PaymentCharged',\n  data: { transactionId, amountCents },\n})\n\n// Agent C works on shipping (simultaneously, no conflict):\nawait eventStore.append({\n  aggregateId: orderId,\n  type: 'ShipmentCreated',\n  data: { trackingNumber, carrier },\n})\n\n// Current state derived by replaying events:\nfunction deriveOrderState(events: DomainEvent[]): OrderState {\n  return events.reduce((state, event) => {\n    switch (event.type) {\n      case 'OrderPlaced':\n        return { ...state, status: 'placed', ...event.data }\n      case 'PaymentCharged':\n        return { ...state, status: 'paid', transactionId: event.data.transactionId }\n      case 'ShipmentCreated':\n        return { ...state, status: 'shipped', tracking: event.data.trackingNumber }\n      default:\n        return state\n    }\n  }, {} as OrderState)\n}",
    },
    {
      type: 'info',
      title: 'When event sourcing is overkill',
      body: "Event sourcing adds complexity: you need event stores, replay logic, eventual consistency handling, and snapshot strategies for long event streams. It is justified when: (1) you need a complete audit trail, (2) multiple agents frequently modify the same aggregate, (3) you need temporal queries (\"what was the state at time X?\"). It is NOT justified for simple CRUD with low write contention. Use the evaluation framework from Lesson 4-4: does the problem actually require this, or is a simpler approach sufficient?",
    },

    // === SCALE FACTOR ===
    {
      type: 'info',
      title: 'The scale factor: does adding agents help or hurt?',
      body: "Here is the ultimate litmus test for your architecture. Imagine you currently use 3 agents. You add a 4th. Does the system build FASTER or SLOWER? Faster: your architecture scales. Each agent works on an independent unit. No coordination overhead increases. Slower: your architecture has hit a ceiling. The 4th agent creates conflicts, waits for others, or duplicates work. Measure this empirically: time how long N agents take to complete M tasks, then try N+1 agents on the same workload.",
    },
    {
      type: 'multiple-choice',
      question: 'You are using 4 agents in parallel. Adding a 5th agent makes the total build time LONGER. What is the most likely architectural cause?',
      options: [
        'The 5th agent is slower than the others',
        'There are only 4 independent modules — the 5th agent has nothing to work on that does not conflict with the other 4',
        'The event bus cannot handle 5 simultaneous publishers',
        'Agent context windows are too small for 5 concurrent sessions',
      ],
      correctIndex: 1,
      explanation: 'If you have 4 independent work units and 5 agents, one agent will either be idle or will attempt to work on a module that another agent is already modifying — causing conflicts that take time to resolve. The fix is architectural: decompose further to create more independent work units, or accept that 4 is your parallelism ceiling for this architecture.',
    },
    {
      type: 'checkpoint',
      xp: 4,
      message: 'Scale factor understood!',
    },

    // === PATTERN SELECTION ===
    {
      type: 'info',
      title: 'Choosing the right pattern',
      body: "Not every system needs every pattern. The choice depends on your scale requirements. For a 2-3 agent fleet: modular monolith with clear boundaries is usually sufficient. For 4-8 agents: add event-driven communication between modules. For 8+ agents: consider event sourcing for high-contention aggregates and contract-first development workflow. Start simpler and add complexity only when you measure that your parallelism ceiling has been hit. Over-engineering the coordination layer is as much of a failure as under-engineering it.",
    },
    {
      type: 'order',
      instruction: 'Order these architectural patterns from simplest (fewest agents) to most complex (largest fleets):',
      items: [
        'Event sourcing for high-contention state',
        'Feature-based directories with clear modules',
        'Full contract-first with event-driven communication',
        'Modular monolith with enforced boundaries',
        'Direct function calls between well-named modules',
      ],
      correctOrder: [4, 1, 3, 2, 0],
    },
    {
      type: 'code-demo',
      title: 'Pattern selection guide',
      body: 'Match your architecture to your agent fleet size. Over-engineering is as harmful as under-engineering.',
      language: 'markdown',
      filename: 'pattern-selection.md',
      code: "# Pattern Selection Guide\n\n## 1-2 Agents (solo or pair)\n- Feature-based directories\n- Consistent naming conventions\n- Collocated tests\n- Simple CLAUDE.md\n- Direct function calls between modules\n\n## 3-5 Agents (small fleet)\n- Modular monolith with index.ts public APIs\n- ESLint boundary enforcement\n- Module-specific CLAUDE.md files\n- Per-module database migrations\n- Interface contracts for adjacent modules\n\n## 5-8 Agents (medium fleet)\n- Event-driven communication between modules\n- Contract-first development workflow\n- Event bus for decoupling\n- Separate test suites per module\n- Conflict rate monitoring (<5% target)\n\n## 8+ Agents (large fleet)\n- Event sourcing for high-contention areas\n- CQRS where read/write patterns differ\n- Full contract suite (API, events, repos)\n- Automated boundary violation detection\n- Parallelism ceiling monitoring",
    },

    // === SYNTHESIS ===
    {
      type: 'info',
      title: 'System architecture as a multiplier',
      body: "Your architecture IS the limit on how many agents can work productively in parallel. A well-designed system with event-driven boundaries and clear contracts scales linearly — each additional agent adds proportional speed. A poorly designed system with shared state and tight coupling hits a ceiling at 2-3 agents, after which more agents make things slower. The architect's job in an agent-native world is to push that ceiling as high as possible by choosing patterns that minimize coordination cost and maximize independent work units.",
    },
    {
      type: 'multiple-choice',
      question: 'An event-driven modular monolith with 6 independent feature modules. You want to add a 7th feature that needs data from 3 existing modules. How do you design it to maintain parallelism?',
      options: [
        'Have the new module import directly from the 3 existing modules',
        'The new module subscribes to events from those 3 modules — no direct imports, no modifications to existing code',
        'Merge the 3 modules into one super-module that the new feature extends',
        'Create a shared database view that combines data from all 3 modules',
      ],
      correctIndex: 1,
      explanation: 'Event subscription is the key. The new module listens to events already emitted by the 3 existing modules. It never modifies their code. The agent building module 7 does not conflict with agents working on modules 1-6. No existing code changes. No shared mutable state. The event bus carries the data without coupling.',
    },
    {
      type: 'checklist',
      title: 'System-level parallel architecture checklist:',
      items: [
        'I understand coordination cost grows quadratically in coupled systems',
        'I can design event-driven systems where modules emit events instead of calling each other',
        'I practice contract-first development: define interfaces, then dispatch agents in parallel',
        'I know when to use a modular monolith vs adding event sourcing complexity',
        'I measure the scale factor: does adding an agent speed up or slow down the fleet?',
        'I match architectural complexity to fleet size (do not over-engineer for 2 agents)',
        'I can identify my parallelism ceiling and know which pattern lifts it',
      ],
    },
    {
      type: 'checkpoint',
      xp: 19,
      message: 'System-level parallel architecture mastered! You can now design systems where agent fleets scale linearly.',
    },
  ],
}

export default content
