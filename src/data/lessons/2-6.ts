import type { LessonContent } from './types'

const content: LessonContent = {
  lessonId: '2-6',
  steps: [
    // === INTRODUCTION ===
    {
      type: 'info',
      title: 'Connecting to payment systems and external services',
      body: "An agent can scaffold a CRUD app quickly because the logic is self-contained. Third-party integrations are different. They involve external APIs with their own rules, webhooks that arrive asynchronously, failure modes the agent has never seen in training data, and idempotency requirements that are easy to forget. When you direct an agent through a Stripe integration, you are not asking it to write code — you are asking it to handle a distributed system correctly. That requires a different kind of spec.",
    },
    {
      type: 'info',
      title: 'The integration spec difference',
      body: "A normal feature spec says what to build. An integration spec must also describe what can go wrong. Payment flows have partial failures (charged but not fulfilled), duplicate webhooks (Stripe retries on 5xx), race conditions (user clicks pay twice), and state inconsistencies (local DB says paid, Stripe says refunded). If your spec does not explicitly list these cases, the agent will build the happy path perfectly and leave you with production bugs that cost real money.",
    },

    // === PAYMENT FLOW SPEC ===
    {
      type: 'diagram',
      title: 'Stripe Checkout Flow',
      body: 'The full payment flow from user click to fulfillment. Every arrow is a potential failure point.',
      diagram: {
        direction: 'LR',
        nodes: [
          { id: 'click', label: 'User Clicks Pay', shape: 'pill' },
          { id: 'session', label: 'Create Checkout Session', sublabel: 'Server-side', shape: 'rounded' },
          { id: 'stripe', label: 'Stripe Hosted Page', sublabel: 'User enters card', shape: 'rect' },
          { id: 'webhook', label: 'Webhook Received', sublabel: 'checkout.session.completed', shape: 'rounded', highlight: true },
          { id: 'fulfill', label: 'Fulfill Order', sublabel: 'Update DB, send email', shape: 'rect' },
          { id: 'confirm', label: 'Success Page', sublabel: 'User sees confirmation', shape: 'pill' },
        ],
        edges: [
          { from: 'click', to: 'session' },
          { from: 'session', to: 'stripe' },
          { from: 'stripe', to: 'webhook', label: 'async' },
          { from: 'stripe', to: 'confirm', label: 'redirect' },
          { from: 'webhook', to: 'fulfill' },
          { from: 'fulfill', to: 'confirm', dashed: true },
        ],
      },
    },
    {
      type: 'code-demo',
      title: 'Integration spec: Stripe Checkout',
      body: 'This spec explicitly calls out failure modes and idempotency. Notice how much of it is about what goes wrong, not what goes right.',
      language: 'markdown',
      filename: 'specs/payments.md',
      code: "# Payment Integration Spec — Stripe Checkout\n\n## Goal\nUsers can purchase a plan via Stripe Checkout. Fulfillment happens\nvia webhook, not on redirect (redirect is unreliable).\n\n## Constraints\n- Stripe SDK (`stripe` npm package)\n- Webhook signature verification (STRIPE_WEBHOOK_SECRET)\n- Idempotent fulfillment (same webhook delivered twice = same result)\n- All prices defined in Stripe Dashboard, not hardcoded\n\n## Acceptance Criteria\n- [ ] POST /api/checkout creates a Stripe Checkout Session\n- [ ] Webhook endpoint verifies signature before processing\n- [ ] checkout.session.completed triggers order fulfillment\n- [ ] Duplicate webhooks do not create duplicate orders\n- [ ] Failed fulfillment does not return 200 (Stripe retries)\n- [ ] Success page works even if webhook hasn't arrived yet\n- [ ] Refund webhook (charge.refunded) updates order status\n\n## Failure Cases (MUST HANDLE)\n1. Webhook arrives before redirect — user sees \"processing\"\n2. Webhook arrives twice — second is no-op\n3. Fulfillment fails (DB error) — return 500, Stripe retries\n4. User refreshes success page — show current order state\n5. Stripe is down — checkout button shows error, no crash\n\n## Out of Scope\n- Subscription billing (one-time only)\n- Promo codes\n- Tax calculation\n- Invoice PDF generation",
    },
    {
      type: 'multiple-choice',
      question: 'Why does the spec say "Fulfillment happens via webhook, not on redirect"?',
      options: [
        'Webhooks are faster than redirects',
        'Redirects can fail (user closes browser) — webhooks are guaranteed delivery',
        'Stripe requires webhook-based fulfillment',
        'It is easier to implement',
      ],
      correctIndex: 1,
      explanation: 'The redirect back to your site depends on the user\'s browser. They might close the tab, lose connection, or navigate away. Stripe guarantees webhook delivery (with retries). Fulfillment must use the reliable path. This is the kind of architectural decision you must specify — an agent might default to fulfilling on redirect because it looks simpler.',
    },
    {
      type: 'checkpoint',
      xp: 4,
      message: 'Integration spec structure understood!',
    },

    // === DIRECTING THE BUILD ===
    {
      type: 'info',
      title: 'Directing the agent: phased approach',
      body: "Do not hand the agent the full spec and say \"build it\". Integration work should be phased: (1) Set up Stripe SDK and environment variables, (2) Build the checkout session creation endpoint, (3) Build the webhook handler with signature verification, (4) Add idempotent fulfillment, (5) Handle failure cases. Each phase produces testable output. You verify before moving to the next phase.",
    },
    {
      type: 'code-demo',
      title: 'Phase 1 prompt: SDK setup',
      body: 'Start with the foundation. Verify environment and SDK work before building logic.',
      language: 'text',
      filename: 'prompt-phase-1.txt',
      code: "Install the Stripe SDK and set up environment variables.\n\nRequirements:\n- Add `stripe` package\n- Create `src/lib/stripe.ts` that exports an initialized Stripe client\n- Read STRIPE_SECRET_KEY from env\n- Add STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET to .env.example\n- Do NOT create any endpoints yet — just the SDK setup\n\nWhen done, I should be able to import { stripe } from '@/lib/stripe'\nand call stripe.customers.list() without errors.",
    },
    {
      type: 'terminal',
      instruction: 'After the agent sets up Stripe, verify the SDK is working by running the Stripe CLI to confirm your local setup.',
      expectedCommand: 'stripe listen --forward-to localhost:3000/api/webhooks/stripe',
      hint: 'Use stripe listen to forward webhook events to your local server',
    },
    {
      type: 'code-demo',
      title: 'Phase 3 prompt: webhook handler',
      body: 'The webhook handler is where most integration bugs live. Be explicit about verification and response codes.',
      language: 'text',
      filename: 'prompt-phase-3.txt',
      code: "Build the webhook handler at `src/app/api/webhooks/stripe/route.ts`.\n\nCritical requirements:\n1. Read raw body (NOT parsed JSON) for signature verification\n2. Verify webhook signature using STRIPE_WEBHOOK_SECRET\n3. Return 400 immediately if signature fails\n4. Handle event type: checkout.session.completed\n5. Return 200 ONLY after successful processing\n6. Return 500 if processing fails (triggers Stripe retry)\n7. Log the event ID for debugging\n\nDo NOT implement fulfillment logic yet — just log\n\"Fulfilling order for session {id}\" and return 200.\nI want to test the webhook pipeline first.",
    },
    {
      type: 'terminal',
      instruction: 'Trigger a test webhook to verify the handler receives and processes events correctly.',
      expectedCommand: 'stripe trigger checkout.session.completed',
      hint: 'Use stripe trigger to send a test event to your webhook handler',
    },
    {
      type: 'checkpoint',
      xp: 4,
      message: 'Phased integration direction mastered!',
    },

    // === IDEMPOTENCY ===
    {
      type: 'info',
      title: 'Idempotency: the non-negotiable',
      body: "Stripe delivers webhooks at least once — meaning the same event can arrive multiple times. If your fulfillment logic creates a record on each delivery, you get duplicate orders, double emails, or double credits. Idempotent means: processing the same input twice produces the same result as processing it once. The agent will almost certainly skip this unless you specify it. This is the most common bug in agent-built payment code.",
    },
    {
      type: 'code-demo',
      title: 'Idempotent fulfillment pattern',
      body: 'The idempotency key is the Stripe event ID or checkout session ID. Check-then-create with a unique constraint.',
      language: 'typescript',
      filename: 'src/lib/fulfill-order.ts',
      code: "import { db } from '@/db'\nimport { orders } from '@/db/schema'\nimport { eq } from 'drizzle-orm'\n\nexport async function fulfillOrder(sessionId: string, data: OrderData) {\n  // Check if already fulfilled (idempotency)\n  const existing = await db.query.orders.findFirst({\n    where: eq(orders.stripeSessionId, sessionId),\n  })\n\n  if (existing) {\n    // Already fulfilled — this is a retry, not a new order\n    console.log(`Order already fulfilled for session ${sessionId}`)\n    return existing\n  }\n\n  // Fulfill: create order + send email\n  // The stripeSessionId column has a UNIQUE constraint as a safety net\n  const order = await db.insert(orders).values({\n    stripeSessionId: sessionId,\n    email: data.customerEmail,\n    amount: data.amountTotal,\n    status: 'fulfilled',\n  }).returning()\n\n  await sendConfirmationEmail(order[0])\n  return order[0]\n}",
    },
    {
      type: 'multiple-choice',
      question: 'The agent builds a webhook handler that uses the Stripe event ID as the idempotency key. Is this correct?',
      options: [
        'No — you should use the checkout session ID because events can be re-sent with new IDs',
        'Yes — each event delivery has the same event ID, making it a reliable idempotency key',
        'No — you should use a UUID generated on your server',
        'It depends on whether you are using Stripe Connect',
      ],
      correctIndex: 1,
      explanation: 'Stripe retries use the same event ID (evt_xxx). When Stripe retries a failed webhook delivery, it sends the same event object with the same ID. This makes it a reliable idempotency key. The checkout session ID also works but is less granular if you handle multiple event types per session.',
    },

    // === FAILURE VERIFICATION ===
    {
      type: 'info',
      title: 'Verifying failure handling',
      body: "The happy path works. Now break it. Direct the agent to help you verify failure cases: What happens if the DB is down during fulfillment? Does the webhook return 500 so Stripe retries? What if the user hits the success page before the webhook arrives? Does the page poll or show a loading state? Test these explicitly — do not trust that the agent implemented them just because the spec listed them.",
    },
    {
      type: 'code-demo',
      title: 'Testing failure scenarios',
      body: 'Use Stripe CLI to simulate edge cases. Each test verifies a specific failure mode.',
      language: 'bash',
      filename: 'test-failures.sh',
      code: "# Test 1: Duplicate webhook (idempotency)\nstripe trigger checkout.session.completed\nstripe trigger checkout.session.completed\n# Expected: second call logs \"already fulfilled\", no duplicate order\n\n# Test 2: Check signature verification\ncurl -X POST http://localhost:3000/api/webhooks/stripe \\\n  -H \"Content-Type: application/json\" \\\n  -d '{\"type\": \"checkout.session.completed\"}'\n# Expected: 400 response (no valid signature)\n\n# Test 3: Verify retry behavior\n# Temporarily make fulfillment throw an error\n# Expected: webhook returns 500, Stripe will retry",
    },
    {
      type: 'terminal',
      instruction: 'Send a test webhook without a valid signature to verify your handler rejects it.',
      expectedCommand: 'curl -X POST http://localhost:3000/api/webhooks/stripe -H "Content-Type: application/json" -d \'{"type":"checkout.session.completed"}\'',
      hint: 'Use curl to send a raw POST without Stripe signature headers',
    },
    {
      type: 'checkpoint',
      xp: 4,
      message: 'Failure verification complete!',
    },

    // === PARTIAL FAILURES ===
    {
      type: 'info',
      title: 'Partial failures: the hardest case',
      body: "Fulfillment often involves multiple steps: update the database, send a confirmation email, provision access. What if the DB update succeeds but the email fails? You have an order in the system but the user never got confirmation. The agent needs to handle this: either make the whole operation atomic (transaction + rollback) or make each step independently retryable. Specify which approach you want — the agent will not ask.",
    },
    {
      type: 'code-demo',
      title: 'Handling partial failures',
      body: 'Separate critical (must succeed) from non-critical (can retry later) operations.',
      language: 'typescript',
      filename: 'src/lib/fulfill-order.ts',
      code: "export async function fulfillOrder(sessionId: string, data: OrderData) {\n  // Critical: must succeed or webhook returns 500\n  const order = await db.transaction(async (tx) => {\n    const [order] = await tx.insert(orders).values({\n      stripeSessionId: sessionId,\n      email: data.customerEmail,\n      amount: data.amountTotal,\n      status: 'fulfilled',\n    }).returning()\n\n    await tx.insert(accessGrants).values({\n      orderId: order.id,\n      userId: data.userId,\n      expiresAt: addYears(new Date(), 1),\n    })\n\n    return order\n  })\n\n  // Non-critical: queue for retry if it fails\n  try {\n    await sendConfirmationEmail(order)\n  } catch (error) {\n    // Log but don't fail the webhook\n    // A background job will retry failed emails\n    await queueFailedEmail(order.id, error)\n  }\n\n  return order\n}",
    },

    // === APPLYING THE PATTERN ===
    {
      type: 'info',
      title: 'This pattern applies to every integration',
      body: "Stripe is the example, but the pattern is universal. Every third-party integration has: an API call that can fail, an async callback (webhook/polling) that can arrive multiple times, partial success states, and edge cases the agent will not anticipate unless you specify them. OAuth flows, email services (Resend, SendGrid), payment processors, file storage (S3 signed URLs) — all follow the same spec structure: happy path + explicit failure cases + idempotency requirement.",
    },
    {
      type: 'order',
      instruction: 'Order the steps for directing an agent through any third-party integration:',
      items: [
        'Verify failure cases with real test scenarios',
        'Add idempotent fulfillment logic',
        'Set up SDK and environment variables',
        'Build the async handler (webhook/callback)',
        'Spec the integration with explicit failure modes',
        'Test the happy path end-to-end',
      ],
      correctOrder: [4, 2, 3, 5, 1, 0],
    },
    {
      type: 'checklist',
      title: 'Integration direction checklist:',
      items: [
        'My spec lists failure cases, not just happy path requirements',
        'I phase the build: SDK setup, endpoint, webhook, fulfillment, failure handling',
        'I verify each phase before moving to the next',
        'Fulfillment is idempotent (duplicate webhooks are no-ops)',
        'I distinguish critical (must succeed) from non-critical operations',
        'I test failure scenarios explicitly, not just the happy path',
      ],
    },
    {
      type: 'checkpoint',
      xp: 13,
      message: 'Integration skills unlocked! You can direct AI to connect your app to payment systems and external services.',
    },
  ],
}

export default content
