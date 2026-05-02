import type { LessonContent } from './types'

const content: LessonContent = {
  lessonId: '3-9',
  steps: [
    // === INTRODUCTION ===
    {
      type: 'info',
      title: 'Beyond Request-Response: Event-Driven Systems',
      body: "Your agents can build CRUD endpoints all day. But real products need background jobs, webhooks, scheduled tasks, and durable workflows that survive crashes. Today you learn to direct agents to build event-driven architecture — systems where things happen asynchronously, retry on failure, and never lose data.",
    },
    {
      type: 'info',
      title: 'Why agents struggle with async by default',
      body: "Agents default to the simplest path: receive request, do work, return response. But what about sending a welcome email after signup? Processing a video upload? Syncing data with a third-party API that rate-limits you? These need background processing with failure handling — and agents won't build that unless you spec it explicitly.",
    },

    // === DIAGRAM 1: Event Flow Architecture ===
    {
      type: 'diagram',
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
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'You see the flow: event → queue → handle → retry or dead letter. No data loss.',
    },

    // === INNGEST INTRODUCTION ===
    {
      type: 'info',
      title: 'The tool: Inngest for durable functions',
      body: "Inngest (or Vercel Workflow) gives you durable step functions. Each step is individually retryable — if step 3 of 5 fails, it retries from step 3, not step 1. This is what separates production event systems from fragile cron jobs. Your agents need to understand this pattern to build reliable background processing.",
    },
    {
      type: 'code-demo',
      title: 'Inngest step function anatomy',
      body: "This is what you want your agent to produce. Each `step.run()` is individually retryable and idempotent. If `send-welcome-email` fails, it retries just that step — the user record and Stripe customer are already created and won't be duplicated.",
      language: 'typescript',
      filename: 'src/inngest/functions/user-signup.ts',
      code: `import { inngest } from '../client'

export const handleUserSignup = inngest.createFunction(
  { id: 'user-signup', retries: 3 },
  { event: 'user/signup' },
  async ({ event, step }) => {
    // Step 1: Create user record (idempotent via email unique constraint)
    const user = await step.run('create-user-record', async () => {
      return await db.users.upsert({
        where: { email: event.data.email },
        create: { email: event.data.email, name: event.data.name },
        update: {},
      })
    })

    // Step 2: Create Stripe customer (idempotent via idempotency key)
    const customer = await step.run('create-stripe-customer', async () => {
      return await stripe.customers.create(
        { email: user.email, name: user.name },
        { idempotencyKey: \`signup-\${user.id}\` }
      )
    })

    // Step 3: Send welcome email (retryable independently)
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
      type: 'info',
      title: 'How to spec event flows for agents',
      body: "The critical insight: agents don't know they should build event-driven systems unless you tell them. Your spec must explicitly define: (1) which actions trigger events, (2) what each handler does step by step, (3) what happens on failure at each step, and (4) idempotency requirements. Without this, agents build fragile synchronous code.",
    },
    {
      type: 'code-demo',
      title: 'Agent spec for event-driven work',
      body: "This is how you spec background processing for an agent. Notice the explicit failure requirements — without these, the agent will build a happy-path-only implementation that breaks in production.",
      language: 'markdown',
      filename: 'specs/agent-background-jobs.md',
      code: `## Background Job: Order Processing

### Trigger
Event: \`order/placed\` — fired when checkout completes

### Steps (each independently retryable)
1. Validate inventory (check stock, reserve items)
2. Charge payment (Stripe, use idempotency key: \`order-{orderId}\`)
3. Send confirmation email
4. Notify warehouse (webhook to fulfillment API)
5. Update analytics (increment daily_orders counter)

### Failure Requirements
- Step 1 fails: Cancel order, notify user. DO NOT proceed.
- Step 2 fails: Release inventory reservation. Notify user.
- Step 3 fails: Retry 3x, then log to dead letter. Order still valid.
- Step 4 fails: Retry 5x (warehouse API is flaky). Alert ops after 3rd.
- Step 5 fails: Retry silently. Analytics lag is acceptable.

### Idempotency
- Payment: Stripe idempotency key prevents double-charge
- Inventory: Check reservation exists before creating new one
- Email: Deduplicate by order_id + email_type composite key`,
    },
    {
      type: 'checkpoint',
      xp: 5,
      message: 'You can spec event flows with explicit failure handling for each step.',
    },

    // === IDEMPOTENCY DEEP DIVE ===
    {
      type: 'info',
      title: 'Idempotency: the non-negotiable requirement',
      body: "In event-driven systems, handlers WILL be called multiple times — network timeouts, deployment restarts, retry logic. Every handler must produce the same result whether called once or ten times. This is idempotency, and it's the #1 thing agents get wrong if you don't specify it. Always tell the agent: 'This handler must be idempotent.'",
    },
    {
      type: 'code-demo',
      title: 'Idempotency patterns for agents to implement',
      body: "Give your agent these patterns as reference. The idempotency key pattern works for payments and external APIs. The upsert pattern works for database writes. The check-before-act pattern works for side effects like sending emails.",
      language: 'typescript',
      filename: 'src/lib/idempotency-patterns.ts',
      code: `// Pattern 1: Idempotency key (for external APIs)
await stripe.charges.create(
  { amount: 2000, currency: 'usd', customer: customerId },
  { idempotencyKey: \`charge-order-\${orderId}\` }  // Same key = same result
)

// Pattern 2: Upsert (for database writes)
await db.subscription.upsert({
  where: { userId_planId: { userId, planId } },
  create: { userId, planId, status: 'active' },
  update: { status: 'active' },  // Re-running is a no-op
})

// Pattern 3: Check-before-act (for side effects)
const alreadySent = await db.emailLog.findFirst({
  where: { orderId, type: 'confirmation' }
})
if (!alreadySent) {
  await sendEmail(order.email, 'confirmation', order)
  await db.emailLog.create({ data: { orderId, type: 'confirmation' } })
}`,
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
      type: 'info',
      title: 'Partial failure: the scenario agents never handle',
      body: "Step 1 succeeds, step 2 succeeds, step 3 fails. Now what? You have a user record and a Stripe customer but no welcome email. This is partial failure, and it's the default state of distributed systems. Your spec must tell the agent what 'partially complete' means and whether to compensate (undo steps 1-2) or continue (retry step 3 later).",
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
      type: 'diagram',
      title: 'Forward Recovery vs Rollback',
      body: "Two strategies for partial failure. Forward recovery (preferred): keep completed steps, retry the failed one. Rollback (compensation): undo previous steps. Forward recovery is almost always better for async workflows because many side effects are irreversible.",
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
      type: 'code-demo',
      title: 'Inngest client setup',
      body: "The Inngest client is the foundation. It defines your event types (type-safe event payloads) and creates the client instance that all functions use. Direct your agent to create this first — every other function imports from it.",
      language: 'typescript',
      filename: 'src/inngest/client.ts',
      code: `import { Inngest } from 'inngest'

// Type-safe event definitions
type Events = {
  'user/signup': { data: { email: string; name: string } }
  'order/placed': { data: { orderId: string; userId: string; amount: number } }
  'order/fulfilled': { data: { orderId: string; trackingNumber: string } }
  'webhook/received': { data: { source: string; payload: unknown } }
}

export const inngest = new Inngest({
  id: 'my-app',
  schemas: new EventSchemas().fromRecord<Events>(),
})`,
    },
    {
      type: 'terminal',
      instruction: 'Create the directory structure for your event-driven architecture:',
      expectedCommand: 'mkdir -p src/inngest/functions src/inngest/events',
      hint: 'Create src/inngest/functions and src/inngest/events directories',
    },

    // === VERIFICATION CHECKLIST ===
    {
      type: 'info',
      title: 'Verifying agent-built event systems',
      body: "After an agent builds your event-driven code, you need to verify it meets production requirements. Agents frequently miss: retry configuration, idempotency on external calls, proper error classification (transient vs permanent), and dead letter handling. Use this checklist on every event handler the agent produces.",
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
      type: 'info',
      title: 'Event chains: one handler triggers the next',
      body: "Real systems have cascading events. User signs up → triggers onboarding flow → triggers team creation → triggers notification. Each is a separate function, triggered by the previous one emitting an event. This keeps handlers small, testable, and independently deployable. Spec these chains explicitly for agents.",
    },
    {
      type: 'code-demo',
      title: 'Chained events pattern',
      body: "Handler A completes and emits a new event that triggers Handler B. This decouples the handlers — you can change, disable, or add new handlers to any event without modifying existing code. Direct agents to emit events at the end of handlers, not to call other handlers directly.",
      language: 'typescript',
      filename: 'src/inngest/functions/onboarding-chain.ts',
      code: `// Handler 1: Signup triggers onboarding
export const onSignup = inngest.createFunction(
  { id: 'signup-handler' },
  { event: 'user/signup' },
  async ({ event, step }) => {
    const user = await step.run('create-user', async () => {
      return await createUser(event.data)
    })

    // Emit next event in the chain
    await step.sendEvent('trigger-onboarding', {
      name: 'user/onboarding.start',
      data: { userId: user.id, plan: 'free' },
    })
  }
)

// Handler 2: Onboarding creates workspace
export const onOnboardingStart = inngest.createFunction(
  { id: 'onboarding-handler' },
  { event: 'user/onboarding.start' },
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
      message: 'Lesson complete. Your agents now build systems that survive crashes, not just sunny days.',
    },
  ],
}

export default content
