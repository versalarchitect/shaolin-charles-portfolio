import type { LessonContent } from './types'

const content: LessonContent = {
  lessonId: '3-9',
  steps: [
    // === INTRODUCTION ===
    {
      type: 'info',
      title: 'Building reliable background jobs and workflows',
      body: "Your agents can build CRUD endpoints all day. But real products need background jobs, webhooks, scheduled tasks, and durable workflows that survive crashes. Today you learn to direct agents to build event-driven architecture — systems where things happen asynchronously, retry on failure, and never lose data.",
    },
    {
      type: 'info',
      title: 'Why agents struggle with async by default',
      body: "Agents default to the simplest path: receive request, do work, return response. But what about sending a welcome email after signup? Processing a video upload? Syncing data with a third-party API that rate-limits you? These need background processing with failure handling — and agents won't build that unless you spec it explicitly.",
    },

    // === COMPARE: Synchronous vs Event-Driven ===
    {
      type: 'compare',
      title: 'Synchronous vs event-driven execution',
      body: 'Background jobs can run synchronously (blocking) or event-driven (resilient).',
      question: 'Which approach survives a server restart mid-execution?',
      correctSide: 'right',
      left: {
        label: 'Synchronous',
        content: 'async function processOrder(order) {\n  await chargePayment(order)  // step 1\n  await createInvoice(order)  // step 2\n  await sendEmail(order)      // step 3\n  await updateInventory(order)// step 4\n}\n// If server crashes at step 3:\n// ❌ Payment charged\n// ❌ Invoice created\n// ❌ No email sent\n// ❌ Inventory not updated\n// ❌ No way to resume',
        language: 'typescript',
      },
      right: {
        label: 'Event-driven',
        content: 'const processOrder = inngest.createFunction(\n  { id: "process-order" },\n  { event: "order/created" },\n  async ({ step }) => {\n    await step.run("charge", () => chargePayment())\n    await step.run("invoice", () => createInvoice())\n    await step.run("email", () => sendEmail())\n    await step.run("inventory", () => updateInventory())\n  }\n)\n// If server crashes at step 3:\n// ✅ Steps 1-2 recorded\n// ✅ Resumes from step 3\n// ✅ No duplicate charges',
        language: 'typescript',
      },
      explanation: 'Event-driven workflows record each step\'s completion. On crash, they resume from the last successful step instead of starting over. This prevents duplicate charges and lost work.',
    },

    // === DIAGRAM 1: Event Flow Architecture (Interactive) ===
    {
      type: 'interactive-diagram',
      title: 'Event-Driven Architecture Flow',
      body: "Every event-driven system follows this pattern. Events enter a queue, handlers process them, and failures route to retry logic or a dead letter queue for manual inspection. The key insight: no event is ever lost. It either succeeds, retries, or gets flagged for human review.",
      diagram: {
        direction: 'LR',
        nodes: [
          { id: 'event', label: 'Event', sublabel: 'user.signup', shape: 'rounded' },
          { id: 'queue', label: 'Queue', sublabel: 'Durable', shape: 'rect' },
          { id: 'handler', label: 'Handler', sublabel: 'Process', shape: 'rect', highlight: true },
          { id: 'success', label: 'Success', shape: 'pill', highlight: true },
          { id: 'retry', label: 'Retry', sublabel: '3 attempts', shape: 'diamond' },
          { id: 'dlq', label: 'Dead Letter', sublabel: 'Manual Review', shape: 'rect' },
        ],
        edges: [
          { from: 'event', to: 'queue' },
          { from: 'queue', to: 'handler' },
          { from: 'handler', to: 'success', label: 'ok' },
          { from: 'handler', to: 'retry', label: 'fail' },
          { from: 'retry', to: 'handler', label: 'retry' },
          { from: 'retry', to: 'dlq', label: 'exhausted' },
        ],
      },
      stages: [
        {
          highlightNodes: ['event', 'queue'],
          highlightEdges: [{ from: 'event', to: 'queue' }],
          explanation: 'An event is emitted (e.g., user.signup) and enters the durable queue. The queue persists the event — even if the server crashes right now, the event is safe.',
        },
        {
          highlightNodes: ['queue', 'handler'],
          highlightEdges: [{ from: 'queue', to: 'handler' }],
          explanation: 'The queue delivers the event to a handler function. The handler processes it step by step — each step individually durable and retryable.',
        },
        {
          highlightNodes: ['handler', 'success'],
          highlightEdges: [{ from: 'handler', to: 'success' }],
          explanation: 'Happy path: all steps complete successfully. The event is marked as processed and removed from the queue.',
        },
        {
          highlightNodes: ['handler', 'retry'],
          highlightEdges: [{ from: 'handler', to: 'retry' }],
          explanation: 'A step fails (network timeout, API error). The event moves to retry logic. The system waits, then re-delivers the event to the handler.',
        },
        {
          highlightNodes: ['retry', 'handler'],
          highlightEdges: [{ from: 'retry', to: 'handler' }],
          explanation: 'Retry attempts the handler again. With durable step functions, only the failed step re-runs — previously completed steps are skipped.',
        },
        {
          highlightNodes: ['retry', 'dlq'],
          highlightEdges: [{ from: 'retry', to: 'dlq' }],
          explanation: 'After all retry attempts are exhausted (e.g., 3 failures), the event moves to the dead letter queue for manual inspection. No data is ever silently lost.',
        },
      ],
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'You see the flow: event → queue → handle → retry or dead letter. No data loss.',
    },

    // === INNGEST INTRODUCTION ===
    {
      type: 'code-fill',
      instruction: 'Complete the Inngest durable step function for user signup. Each step.run() is individually retryable. Fill in the function config, event trigger, and idempotency key.',
      language: 'typescript',
      filename: 'src/inngest/functions/user-signup.ts',
      template: `import { inngest } from '../client'

export const handleUserSignup = inngest.createFunction(
  { id: 'user-signup', retries: ___BLANK_1___ },
  { event: '___BLANK_2___' },
  async ({ event, step }) => {
    const user = await step.run('create-user-record', async () => {
      return await db.users.upsert({
        where: { email: event.data.email },
        create: { email: event.data.email, name: event.data.name },
        update: {},
      })
    })

    const customer = await step.run('create-stripe-customer', async () => {
      return await stripe.customers.create(
        { email: user.email, name: user.name },
        { idempotencyKey: \`___BLANK_3___\` }
      )
    })

    await step.run('send-welcome-email', async () => {
      await resend.emails.send({
        to: user.email,
        subject: 'Welcome!',
        template: 'welcome',
        data: { name: user.name },
      })
    })

    return { userId: user.id, customerId: customer.id }
  }
)`,
      blanks: [
        {
          id: 'BLANK_1',
          answer: '3',
          alternatives: ['3'],
          hint: 'A reasonable number of retry attempts before giving up',
          placeholder: 'retry count',
        },
        {
          id: 'BLANK_2',
          answer: 'user/signup',
          alternatives: ['user/signup', '"user/signup"'],
          hint: 'The event name that triggers this function — follows namespace/action convention',
          placeholder: 'event name',
        },
        {
          id: 'BLANK_3',
          answer: 'signup-${user.id}',
          alternatives: ['signup-${user.id}'],
          hint: 'A unique key combining the operation type and user ID to prevent duplicate Stripe customers',
          placeholder: 'idempotency key pattern',
        },
      ],
      explanation: 'Inngest durable step functions give you individually retryable steps. 3 retries is standard. The event name `user/signup` follows namespace/action convention. The idempotency key `signup-${user.id}` prevents duplicate Stripe customers on retry — same key always returns the same result.',
    },
    {
      type: 'multiple-choice',
      question: 'If the welcome email fails on the third attempt, what happens to the user record and Stripe customer?',
      options: [
        'They are rolled back — the entire function fails',
        'They remain intact — only the email step enters the dead letter queue',
        'The entire function retries from the beginning',
        'Inngest pauses the function and waits for manual intervention',
      ],
      correctIndex: 1,
      explanation: "Each step is independently durable. Steps 1 and 2 completed successfully and their results are persisted. Only step 3 retries. If it exhausts retries, it fails independently — the user and Stripe customer are safe.",
    },

    // === SPECIFYING EVENT FLOWS FOR AGENTS ===
    {
      type: 'multiple-choice',
      question: 'What four things must your spec explicitly define so agents build event-driven (not synchronous) systems?',
      options: [
        'Database schema, API endpoints, UI components, deployment config',
        'Which actions trigger events, handler steps, failure handling per step, and idempotency requirements',
        'Event names, queue technology, retry count, monitoring dashboard',
        'Handler code, test files, CI config, and documentation',
      ],
      correctIndex: 1,
      explanation: "Agents default to synchronous code unless told otherwise. Your spec must define: (1) which actions trigger events, (2) what each handler does step by step, (3) what happens on failure at each step, and (4) idempotency requirements. Without these four elements, agents build happy-path-only implementations that break in production.",
    },
    {
      type: 'code-fill',
      instruction: 'Complete the agent spec for an event-driven order processing job. Fill in the trigger event, idempotency strategy, and failure handling for the critical payment step.',
      language: 'markdown',
      filename: 'specs/agent-background-jobs.md',
      template: `## Background Job: Order Processing

### Trigger
Event: \`___BLANK_1___\` -- fired when checkout completes

### Steps (each independently retryable)
1. Validate inventory (check stock, reserve items)
2. Charge payment (Stripe, use idempotency key: \`___BLANK_2___\`)
3. Send confirmation email
4. Notify warehouse (webhook to fulfillment API)
5. Update analytics (increment daily_orders counter)

### Failure Requirements
- Step 1 fails: Cancel order, notify user. DO NOT proceed.
- Step 2 fails: ___BLANK_3___. Notify user.
- Step 3 fails: Retry 3x, then log to dead letter. Order still valid.
- Step 4 fails: Retry 5x (warehouse API is flaky). Alert ops after 3rd.
- Step 5 fails: Retry silently. Analytics lag is acceptable.`,
      blanks: [
        {
          id: 'BLANK_1',
          answer: 'order/placed',
          alternatives: ['order/placed', '"order/placed"'],
          hint: 'The event name following namespace/action convention for when a checkout completes',
          placeholder: 'event name',
        },
        {
          id: 'BLANK_2',
          answer: 'order-{orderId}',
          alternatives: ['order-{orderId}', 'order-${orderId}'],
          hint: 'Combine the operation type with the unique order ID to prevent duplicate charges',
          placeholder: 'idempotency key',
        },
        {
          id: 'BLANK_3',
          answer: 'Release inventory reservation',
          alternatives: ['Release inventory reservation', 'Release inventory', 'Release reservation'],
          hint: 'If payment fails, what previously reserved resource needs to be freed?',
          placeholder: 'compensation action',
        },
      ],
      explanation: 'The event name `order/placed` follows namespace/action convention. The idempotency key `order-{orderId}` prevents double-charging on retry. If payment fails, you must release the inventory reservation from step 1 — this is compensation logic that agents never build unless you specify it explicitly.',
    },
    {
      type: 'checkpoint',
      xp: 5,
      message: 'You can spec event flows with explicit failure handling for each step.',
    },

    // === IDEMPOTENCY DEEP DIVE ===
    {
      type: 'multiple-choice',
      question: 'In event-driven systems, handlers will be called multiple times. What property must every handler have?',
      options: [
        'Atomicity — all steps succeed or all fail together',
        'Idempotency — producing the same result whether called once or ten times',
        'Immutability — never modifying existing data',
        'Concurrency — handling multiple events simultaneously',
      ],
      correctIndex: 1,
      explanation: "Idempotency is the #1 thing agents get wrong. Network timeouts, deployment restarts, and retry logic mean handlers WILL be called multiple times. Every handler must produce the same result whether called once or ten times. Always tell the agent: 'This handler must be idempotent.'",
    },
    {
      type: 'compare',
      title: 'Idempotency patterns: database writes vs external APIs',
      body: 'Different contexts require different idempotency strategies.',
      question: 'Which pattern should you use when writing to your own database?',
      correctSide: 'left',
      left: {
        label: 'Upsert (database writes)',
        content: '// Pattern: Upsert — insert or update\n// Safe to call multiple times\nawait db.subscription.upsert({\n  where: {\n    userId_planId: { userId, planId }\n  },\n  create: {\n    userId, planId, status: "active"\n  },\n  update: {\n    status: "active"  // Re-running is a no-op\n  },\n})\n\n// Also: check-before-act for side effects\nconst sent = await db.emailLog.findFirst({\n  where: { orderId, type: "confirmation" }\n})\nif (!sent) {\n  await sendEmail(order.email, "confirmation")\n  await db.emailLog.create({ data: { orderId, type: "confirmation" } })\n}',
        language: 'typescript',
      },
      right: {
        label: 'Idempotency key (external APIs)',
        content: '// Pattern: Idempotency key — same key = same result\n// Stripe, payment processors, etc.\nawait stripe.charges.create(\n  {\n    amount: 2000,\n    currency: "usd",\n    customer: customerId\n  },\n  {\n    // Same key guarantees same outcome\n    idempotencyKey: `charge-order-${orderId}`\n  }\n)\n\n// The API provider stores the result\n// Calling again with same key returns\n// the cached result, no duplicate charge',
        language: 'typescript',
      },
      explanation: 'For your own database, use upsert (insert-or-update) or check-before-act patterns — you control the logic. For external APIs like Stripe, use idempotency keys — the provider handles deduplication. Give agents both patterns as reference in the spec.',
    },
    {
      type: 'code-input',
      instruction: 'You need an idempotency key for a webhook that provisions a user workspace. The user ID is `usr_123` and the event is `workspace.create`. Write the idempotency key string:',
      placeholder: 'workspace-...',
      answer: 'workspace-create-usr_123',
      hint: 'Combine the event type and user ID to create a unique, repeatable key',
    },

    // === PARTIAL FAILURE HANDLING ===
    {
      type: 'multiple-choice',
      question: 'Step 1 succeeds, step 2 succeeds, step 3 fails. You have a user record and a Stripe customer but no welcome email. What is this scenario called?',
      options: [
        'Complete failure — the entire function should be rolled back',
        'Partial failure — some steps succeeded, one failed mid-flow',
        'Transient error — just retry the entire function',
        'Data inconsistency — the database is corrupted',
      ],
      correctIndex: 1,
      explanation: "This is partial failure, the default state of distributed systems. Your spec must tell the agent what 'partially complete' means and whether to compensate (undo steps 1-2) or continue (retry step 3 later). Agents never handle this scenario unless you specify it explicitly.",
    },
    {
      type: 'multiple-choice',
      question: 'A 5-step order flow fails at step 4 (notify warehouse). Steps 1-3 (validate, charge, email) succeeded. What should happen?',
      options: [
        'Roll back everything — refund the charge, un-send the email',
        'Mark the order as "pending fulfillment" and retry step 4 with exponential backoff',
        'Complete the order without warehouse notification',
        'Cancel the order and notify the user to try again',
      ],
      correctIndex: 1,
      explanation: "You can't un-send an email or easily refund a charge for a valid order. The correct approach is forward recovery: mark the state, retry the failed step. The order is valid — the warehouse just hasn't been told yet. Spec this explicitly or agents will implement fragile rollback logic.",
    },
    {
      type: 'interactive-diagram',
      title: 'Forward Recovery vs Rollback',
      body: "Two strategies for partial failure. Forward recovery (preferred): keep completed steps, retry the failed one. Rollback (compensation): undo previous steps.",
      diagram: {
        direction: 'TB',
        nodes: [
          { id: 'fail', label: 'Step 3 Fails', shape: 'diamond', highlight: true },
          { id: 'forward', label: 'Forward Recovery', sublabel: 'Retry step 3', shape: 'rect' },
          { id: 'rollback', label: 'Rollback', sublabel: 'Undo steps 1-2', shape: 'rect' },
          { id: 'resume', label: 'Resume', sublabel: 'Continue flow', shape: 'pill', highlight: true },
          { id: 'compensate', label: 'Compensate', sublabel: 'Refund, delete', shape: 'pill' },
        ],
        edges: [
          { from: 'fail', to: 'forward', label: 'preferred' },
          { from: 'fail', to: 'rollback', label: 'when required' },
          { from: 'forward', to: 'resume' },
          { from: 'rollback', to: 'compensate' },
        ],
      },
      stages: [
        {
          highlightNodes: ['fail'],
          explanation: 'Step 3 fails. Steps 1 and 2 already completed successfully. You now have a partially complete workflow. Two strategies are available.',
        },
        {
          highlightNodes: ['fail', 'forward'],
          highlightEdges: [{ from: 'fail', to: 'forward' }],
          explanation: 'Forward recovery (preferred): keep the completed steps, retry only the failed step. This works because steps 1 and 2 are already durable — their results are persisted.',
        },
        {
          highlightNodes: ['forward', 'resume'],
          highlightEdges: [{ from: 'forward', to: 'resume' }],
          explanation: 'After retry succeeds, the flow continues normally. No data was lost, no work was duplicated. This is the preferred approach for async workflows.',
        },
        {
          highlightNodes: ['fail', 'rollback'],
          highlightEdges: [{ from: 'fail', to: 'rollback' }],
          explanation: 'Rollback (use only when required): undo previous steps. This is needed when step 3 failure makes steps 1-2 meaningless (e.g., inventory reserved but payment declined).',
        },
        {
          highlightNodes: ['rollback', 'compensate'],
          highlightEdges: [{ from: 'rollback', to: 'compensate' }],
          explanation: 'Compensation means reversing side effects: refunding charges, deleting records, releasing reservations. Many side effects are irreversible (sent emails), making rollback difficult. Forward recovery is almost always better.',
        },
      ],
    },
    {
      type: 'checkpoint',
      xp: 5,
      message: 'You understand forward recovery vs rollback for partial failures.',
    },

    // === HANDS-ON: SETTING UP INNGEST ===
    {
      type: 'terminal',
      instruction: 'Install Inngest in your project to enable durable background functions:',
      expectedCommand: 'npm install inngest',
      hint: 'Use npm install inngest (or bun add inngest)',
    },
    {
      type: 'code-fill',
      instruction: 'Complete the Inngest client setup with type-safe event definitions. This is the foundation that all functions import from.',
      language: 'typescript',
      filename: 'src/inngest/client.ts',
      template: `import { Inngest } from 'inngest'

type Events = {
  '___BLANK_1___': { data: { email: string; name: string } }
  'order/placed': { data: { orderId: string; userId: string; amount: number } }
  '___BLANK_2___': { data: { orderId: string; trackingNumber: string } }
  'webhook/received': { data: { source: string; payload: ___BLANK_3___ } }
}

export const inngest = new Inngest({
  id: 'my-app',
  schemas: new EventSchemas().fromRecord<Events>(),
})`,
      blanks: [
        {
          id: 'BLANK_1',
          answer: 'user/signup',
          alternatives: ['user/signup', '"user/signup"'],
          hint: 'The event name for when a user signs up — follows namespace/action convention',
          placeholder: 'signup event name',
        },
        {
          id: 'BLANK_2',
          answer: 'order/fulfilled',
          alternatives: ['order/fulfilled', '"order/fulfilled"'],
          hint: 'The event for when an order is shipped — same namespace as order/placed',
          placeholder: 'fulfillment event name',
        },
        {
          id: 'BLANK_3',
          answer: 'unknown',
          alternatives: ['unknown'],
          hint: 'The safest type for an unstructured webhook payload — not `any`',
          placeholder: 'safe type for unknown data',
        },
      ],
      explanation: 'Event names follow namespace/action convention: `user/signup`, `order/placed`, `order/fulfilled`. Using `unknown` instead of `any` for the webhook payload forces handlers to validate the data before using it — a critical safety measure that agents often skip.',
    },
    {
      type: 'terminal',
      instruction: 'Create the directory structure for your event-driven architecture:',
      expectedCommand: 'mkdir -p src/inngest/functions src/inngest/events',
      hint: 'Create src/inngest/functions and src/inngest/events directories',
    },

    // === VERIFICATION CHECKLIST ===
    {
      type: 'multiple-choice',
      question: 'After an agent builds event-driven code, which of these does it MOST frequently miss?',
      options: [
        'Function naming conventions and code formatting',
        'Retry configuration, idempotency on external calls, and dead letter handling',
        'Import statements and module resolution',
        'TypeScript type definitions and interfaces',
      ],
      correctIndex: 1,
      explanation: "Agents frequently miss production requirements in event-driven code: retry configuration, idempotency on external calls, proper error classification (transient vs permanent), and dead letter handling. Use a verification checklist on every event handler the agent produces.",
    },
    {
      type: 'checklist',
      title: 'Event handler verification checklist',
      items: [
        'Each step is individually retryable (wrapped in step.run or equivalent)',
        'External API calls use idempotency keys',
        'Database writes use upsert or check-before-insert',
        'Retry count is configured per step (not just globally)',
        'Permanent failures (4xx) are distinguished from transient (5xx, timeout)',
        'Dead letter queue exists for exhausted retries',
        'Partial failure state is handled (forward recovery or compensation)',
        'Event payload is validated at handler entry (schema check)',
        'Timeout is set per step (not infinite default)',
        'Logging includes event ID and step name for traceability',
      ],
    },

    // === ADVANCED: COMPOSING EVENT CHAINS ===
    {
      type: 'code-fill',
      instruction: 'Complete the chained event handlers. Handler A emits an event that triggers Handler B. Fill in the event names and the step that emits the downstream event.',
      language: 'typescript',
      filename: 'src/inngest/functions/onboarding-chain.ts',
      template: `// Handler 1: Signup triggers onboarding
export const onSignup = inngest.createFunction(
  { id: 'signup-handler' },
  { event: '___BLANK_1___' },
  async ({ event, step }) => {
    const user = await step.run('create-user', async () => {
      return await createUser(event.data)
    })

    // Emit next event in the chain
    await step.___BLANK_2___('trigger-onboarding', {
      name: 'user/onboarding.start',
      data: { userId: user.id, plan: 'free' },
    })
  }
)

// Handler 2: Onboarding creates workspace
export const onOnboardingStart = inngest.createFunction(
  { id: 'onboarding-handler' },
  { event: '___BLANK_3___' },
  async ({ event, step }) => {
    await step.run('create-workspace', async () => {
      return await createWorkspace(event.data.userId)
    })

    await step.run('seed-sample-data', async () => {
      return await seedSampleProject(event.data.userId)
    })

    await step.sendEvent('trigger-welcome', {
      name: 'user/onboarding.complete',
      data: { userId: event.data.userId },
    })
  }
)`,
      blanks: [
        {
          id: 'BLANK_1',
          answer: 'user/signup',
          alternatives: ['user/signup', '"user/signup"'],
          hint: 'The event that starts the chain — when a user signs up',
          placeholder: 'trigger event',
        },
        {
          id: 'BLANK_2',
          answer: 'sendEvent',
          alternatives: ['sendEvent'],
          hint: 'The Inngest step method that emits a new event to trigger downstream handlers',
          placeholder: 'event emission method',
        },
        {
          id: 'BLANK_3',
          answer: 'user/onboarding.start',
          alternatives: ['user/onboarding.start', '"user/onboarding.start"'],
          hint: 'The event emitted by Handler 1 that triggers this handler',
          placeholder: 'downstream event name',
        },
      ],
      explanation: 'Event chains decouple handlers — Handler A emits `user/onboarding.start` via `step.sendEvent()`, which triggers Handler B. You can add, remove, or modify downstream handlers without touching upstream code. This is the Open-Closed Principle applied to workflows. Direct agents to emit events at the end of handlers, not to call other handlers directly.',
    },
    {
      type: 'multiple-choice',
      question: 'Why emit events between handlers instead of calling handler functions directly?',
      options: [
        'It\'s faster because events are processed in parallel',
        'It decouples handlers — you can add, remove, or modify downstream handlers without changing upstream code',
        'Direct function calls don\'t work in serverless environments',
        'Events are type-safe while function calls are not',
      ],
      correctIndex: 1,
      explanation: "Event-driven decoupling means you can add a new handler for `user/signup` (like an analytics tracker) without touching the signup handler itself. You can disable handlers, add new ones, or change processing order — all without modifying existing code. This is the Open-Closed Principle applied to workflows.",
    },
    {
      type: 'checkpoint',
      xp: 5,
      message: 'You can spec, verify, and compose event-driven systems for agents to build.',
    },

    // === PUTTING IT TOGETHER ===
    {
      type: 'order',
      instruction: 'Order these steps for speccing an event-driven system for an agent:',
      items: [
        'Define event types and payloads (type-safe schemas)',
        'Identify which user actions trigger background processing',
        'Specify failure handling per step (retry count, forward recovery vs rollback)',
        'Map the event chain (which handlers emit which downstream events)',
        'Define idempotency strategy for each external call',
      ],
      correctOrder: [1, 0, 3, 4, 2],
    },
    {
      type: 'checklist',
      title: 'Agent-built event architecture mastery',
      items: [
        'I can identify when synchronous code should be event-driven instead',
        'I spec step functions with individual retry semantics per step',
        'I require idempotency keys on all external API calls',
        'I specify partial failure handling (forward recovery preferred)',
        'I verify agent output against the 10-point handler checklist',
        'I compose event chains for complex multi-step workflows',
        'I distinguish transient failures (retry) from permanent failures (dead letter)',
      ],
    },
    {
      type: 'checkpoint',
      xp: 7,
      message: 'Event-driven systems learned! Your apps can now handle failures gracefully.',
    },
  ],
}

export default content
