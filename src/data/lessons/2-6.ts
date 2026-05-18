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
      type: 'interactive-diagram',
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
      stages: [
        {
          highlightNodes: ['click', 'session'],
          highlightEdges: [{ from: 'click', to: 'session' }],
          explanation: 'User clicks Pay. Your server creates a Stripe Checkout Session with the product, price, and metadata. Failure here means your server is down — show an error on the button.',
        },
        {
          highlightNodes: ['session', 'stripe'],
          highlightEdges: [{ from: 'session', to: 'stripe' }],
          explanation: 'User is redirected to Stripe\'s hosted payment page. Stripe handles card entry, validation, and 3D Secure. You have no control here — Stripe owns this step.',
        },
        {
          highlightNodes: ['stripe', 'confirm'],
          highlightEdges: [{ from: 'stripe', to: 'confirm' }],
          explanation: 'After payment, Stripe redirects the user to your success page. But the user might close the browser before the redirect completes — so never fulfill on redirect alone.',
        },
        {
          highlightNodes: ['stripe', 'webhook'],
          highlightEdges: [{ from: 'stripe', to: 'webhook' }],
          explanation: 'Stripe sends a webhook asynchronously. This is the reliable path — Stripe retries on failure. The webhook may arrive before or after the redirect. Your handler must verify the signature.',
        },
        {
          highlightNodes: ['webhook', 'fulfill'],
          highlightEdges: [{ from: 'webhook', to: 'fulfill' }],
          explanation: 'The webhook triggers fulfillment: update the database, send confirmation email, provision access. This must be idempotent — Stripe may send the same webhook multiple times.',
        },
        {
          highlightNodes: ['fulfill', 'confirm'],
          highlightEdges: [{ from: 'fulfill', to: 'confirm' }],
          explanation: 'The success page shows the order status. If the webhook has not arrived yet, show a loading/processing state. Poll or use realtime to update when fulfillment completes.',
        },
      ],
    },
    {
      type: 'code-fill',
      hint: 'Fill in values that match the pattern shown above.',
      instruction: 'Complete this integration spec with the critical requirements an agent would otherwise miss:',
      language: 'markdown',
      filename: 'specs/payments.md',
      template: '# Payment Integration Spec\n\n## Goal\nUsers purchase via Stripe Checkout. Fulfillment happens\nvia {{fulfillment_method}}, not on redirect (redirect is unreliable).\n\n## Constraints\n- Webhook signature verification ({{secret_env}})\n- {{idempotency_req}} fulfillment (same webhook twice = same result)\n- All prices defined in Stripe Dashboard, not hardcoded\n\n## Failure Cases (MUST HANDLE)\n1. Webhook arrives twice — second is {{duplicate_behavior}}\n2. Fulfillment fails (DB error) — return {{error_code}}, Stripe retries',
      blanks: [
        { id: 'fulfillment_method', answer: 'webhook', alternatives: ['webhooks', 'Webhook'], placeholder: 'which method?', hint: 'The reliable async notification from Stripe' },
        { id: 'secret_env', answer: 'STRIPE_WEBHOOK_SECRET', alternatives: ['stripe_webhook_secret'], placeholder: 'env var name?', hint: 'The secret used to verify webhook signatures' },
        { id: 'idempotency_req', answer: 'Idempotent', alternatives: ['idempotent', 'IDEMPOTENT'], placeholder: 'what property?', hint: 'Processing the same input twice produces the same result' },
        { id: 'duplicate_behavior', answer: 'no-op', alternatives: ['a no-op', 'noop', 'no op', 'ignored'], placeholder: 'what happens?', hint: 'The duplicate should have zero effect' },
        { id: 'error_code', answer: '500', alternatives: ['500 error', 'HTTP 500'], placeholder: 'status code?', hint: 'Server error code that triggers Stripe retry' },
      ],
      explanation: 'An integration spec must explicitly define: fulfillment via webhook (not redirect), signature verification, idempotency requirement, and how failures should behave (500 triggers retry, 200 means done). Without these, the agent builds only the happy path.',
    },
    {
      type: 'multiple-choice',
      hint: 'Read each option carefully — one fits the context best.',
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
      type: 'multiple-choice',
      hint: 'Eliminate the options that only partially fit.',
      question: 'How should you direct an agent through a Stripe integration?',
      options: [
        'Hand the agent the full spec and say "build it"',
        'Phase it: SDK setup first, then endpoint, then webhook handler, then idempotent fulfillment, then failure cases',
        'Let the agent decide the build order based on complexity',
        'Build everything at once and test at the end',
      ],
      correctIndex: 1,
      explanation: 'Integration work must be phased. Each phase produces testable output you verify before moving on. Phase 1: SDK + env vars. Phase 2: checkout endpoint. Phase 3: webhook handler with signature verification. Phase 4: idempotent fulfillment. Phase 5: failure case handling. Testing each phase catches issues early.',
    },
    {
      type: 'code-fill',
      hint: 'Use the exact syntax from the lesson examples.',
      instruction: 'Complete this Phase 1 prompt to set up the Stripe SDK correctly:',
      language: 'text',
      filename: 'prompt-phase-1.txt',
      template: "Install the Stripe SDK and set up environment variables.\n\nRequirements:\n- Add `{{package_name}}` package\n- Create `src/lib/stripe.ts` that exports an initialized Stripe client\n- Read {{secret_key_env}} from env\n- Add {{secret_key_env}} and STRIPE_WEBHOOK_SECRET to {{env_file}}\n- Do NOT create any endpoints yet — just the SDK setup",
      blanks: [
        { id: 'package_name', answer: 'stripe', alternatives: ['@stripe/stripe-js'], placeholder: 'npm package?', hint: 'The server-side Stripe SDK package name' },
        { id: 'secret_key_env', answer: 'STRIPE_SECRET_KEY', alternatives: ['stripe_secret_key'], placeholder: 'env var?', hint: 'The environment variable for the Stripe API key' },
        { id: 'env_file', answer: '.env.example', alternatives: ['.env.local', '.env'], placeholder: 'which file?', hint: 'The template env file that documents required variables' },
      ],
      explanation: 'Phase 1 is foundation-only. Verify the SDK and environment work before building any logic. The constraint "Do NOT create any endpoints yet" is critical — it prevents the agent from jumping ahead and building untested payment flows.',
    },
    {
      type: 'terminal',
      instruction: 'After the agent sets up Stripe, verify the SDK is working by running the Stripe CLI to confirm your local setup.',
      expectedCommand: 'stripe listen --forward-to localhost:3000/api/webhooks/stripe',
      hint: 'Use stripe listen to forward webhook events to your local server',
    },
    {
      type: 'code-fill',
      hint: 'Each blank follows the conventions demonstrated earlier.',
      instruction: 'Complete the webhook handler prompt with the critical security and reliability requirements:',
      language: 'text',
      filename: 'prompt-phase-3.txt',
      template: "Build the webhook handler at `src/app/api/webhooks/stripe/route.ts`.\n\nCritical requirements:\n1. Read {{body_type}} (NOT parsed JSON) for signature verification\n2. Verify webhook signature using STRIPE_WEBHOOK_SECRET\n3. Return {{sig_fail_code}} immediately if signature fails\n4. Handle event type: {{event_type}}\n5. Return 200 ONLY after successful processing\n6. Return {{process_fail_code}} if processing fails (triggers Stripe retry)",
      blanks: [
        { id: 'body_type', answer: 'raw body', alternatives: ['the raw body', 'raw request body'], placeholder: 'what format?', hint: 'Signature verification needs the unparsed request body' },
        { id: 'sig_fail_code', answer: '400', alternatives: ['400 Bad Request', 'HTTP 400'], placeholder: 'status code?', hint: 'Client error — bad request' },
        { id: 'event_type', answer: 'checkout.session.completed', alternatives: ['checkout.session.completed event'], placeholder: 'which event?', hint: 'The Stripe event for successful payment' },
        { id: 'process_fail_code', answer: '500', alternatives: ['500 Internal Server Error', 'HTTP 500'], placeholder: 'status code?', hint: 'Server error that triggers Stripe retry' },
      ],
      explanation: 'The webhook handler must: read raw body for signature verification (parsed JSON breaks the signature), return 400 for invalid signatures, return 500 on processing failures (so Stripe retries), and return 200 ONLY on success. Getting these response codes wrong means either accepting forged webhooks or losing orders.',
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
      type: 'multiple-choice',
      hint: 'Focus on the primary goal, not secondary benefits.',
      question: 'Why is idempotency the most critical requirement for webhook handlers?',
      options: [
        'Stripe requires it in their terms of service',
        'Stripe delivers webhooks at least once — duplicates create double orders, double emails, and double charges if your handler is not idempotent',
        'It makes the code easier to test',
        'Without it, Stripe will not send any webhooks',
      ],
      correctIndex: 1,
      explanation: 'Stripe delivers webhooks at least once. The same event can arrive multiple times. If your fulfillment logic creates a record on each delivery, you get duplicate orders. Idempotent means processing the same input twice produces the same result as processing it once. This is the most common bug in agent-built payment code — the agent will skip it unless you specify it.',
    },
    {
      type: 'code-fill',
      hint: 'Look at the surrounding code for context clues.',
      instruction: 'Complete the idempotent fulfillment pattern with the check-then-create logic:',
      language: 'typescript',
      filename: 'src/lib/fulfill-order.ts',
      template: "export async function fulfillOrder(sessionId: string, data: OrderData) {\n  // Check if already fulfilled (idempotency)\n  const existing = await db.query.orders.{{find_method}}({\n    where: eq(orders.stripeSessionId, {{lookup_param}}),\n  })\n\n  if ({{guard_clause}}) {\n    console.log(`Order already fulfilled for session ${sessionId}`)\n    return existing\n  }\n\n  // The stripeSessionId column has a {{constraint_type}} constraint\n  const order = await db.insert(orders).values({\n    stripeSessionId: sessionId,\n    email: data.customerEmail,\n    status: 'fulfilled',\n  }).returning()\n\n  return order[0]\n}",
      blanks: [
        { id: 'find_method', answer: 'findFirst', alternatives: ['findOne'], placeholder: 'query method?', hint: 'Find a single matching record' },
        { id: 'lookup_param', answer: 'sessionId', alternatives: ['session_id'], placeholder: 'lookup value?', hint: 'The function parameter to check against' },
        { id: 'guard_clause', answer: 'existing', alternatives: ['existing !== null', 'existing != null'], placeholder: 'what to check?', hint: 'If truthy, order was already processed' },
        { id: 'constraint_type', answer: 'UNIQUE', alternatives: ['unique'], placeholder: 'which constraint?', hint: 'Prevents duplicate session IDs at the database level' },
      ],
      explanation: 'The check-then-create pattern: look up by session ID first, return early if found (duplicate webhook), insert only if new. The UNIQUE constraint on stripeSessionId is a safety net — even if the check-then-create has a race condition, the DB prevents duplicates.',
    },
    {
      type: 'multiple-choice',
      hint: 'Think about which option is most specific to this concept.',
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
    {
      type: 'compare',
      hint: 'Look at the key differences between the two approaches.',
      title: 'Webhook without vs with idempotency',
      body: 'Stripe sends webhooks at least once — sometimes multiple times. Your handler must handle duplicates.',
      question: 'Which handler is safe when Stripe retries the same webhook?',
      correctSide: 'right',
      left: {
        label: 'Not idempotent',
        content: 'async function handleCheckout(session) {\n  // Danger: creates duplicate on retry!\n  await db.insert(orders).values({\n    userId: session.metadata.userId,\n    amount: session.amount_total,\n    status: "paid"\n  })\n  await sendConfirmationEmail(session)\n}',
        language: 'typescript',
      },
      right: {
        label: 'Idempotent',
        content: 'async function handleCheckout(session) {\n  // Safe: check before creating\n  const existing = await db.query.orders\n    .findFirst({\n      where: eq(orders.sessionId, session.id)\n    })\n  if (existing) return // Already processed\n\n  await db.insert(orders).values({\n    sessionId: session.id,\n    userId: session.metadata.userId,\n    amount: session.amount_total,\n    status: "paid"\n  })\n  await sendConfirmationEmail(session)\n}',
        language: 'typescript',
      },
      explanation: 'The idempotent version checks if the order already exists using the Stripe session ID as a unique key. If Stripe retries the webhook, the handler returns early instead of creating a duplicate.',
    },
    {
      type: 'code-fill',
      hint: 'The answer matches the API or syntax just explained.',
      instruction: 'Complete the idempotent fulfillment logic:',
      language: 'typescript',
      filename: 'src/lib/fulfill-order.ts',
      template: 'async function fulfillOrder(session: Stripe.Checkout.Session) {\n  const existing = await db.query.orders.findFirst({\n    where: eq(orders.{{unique_key}}, session.{{session_field}})\n  })\n  if ({{guard_check}}) return existing\n\n  return await db.insert(orders).values({\n    sessionId: session.id,\n    userId: session.metadata.userId,\n    status: "{{initial_status}}"\n  })\n}',
      blanks: [
        { id: 'unique_key', answer: 'sessionId', alternatives: ['session_id', 'stripeSessionId'], placeholder: 'which column?', hint: 'The column that stores the Stripe session identifier' },
        { id: 'session_field', answer: 'id', placeholder: 'which field?', hint: 'The unique identifier on the Stripe session object' },
        { id: 'guard_check', answer: 'existing', alternatives: ['existing !== null', 'existing != null'], placeholder: 'what to check?', hint: 'If this value is truthy, the order was already processed' },
        { id: 'initial_status', answer: 'paid', alternatives: ['completed', 'fulfilled'], placeholder: 'order status?' },
      ],
      explanation: 'The session ID is the idempotency key. If an order with that session ID exists, we skip — preventing duplicates no matter how many times Stripe retries.',
    },

    // === FAILURE VERIFICATION ===
    {
      type: 'multiple-choice',
      hint: 'Consider what the lesson content emphasized.',
      question: 'The happy path works. What should you test NEXT?',
      options: [
        'Deploy to production and monitor for errors',
        'Write unit tests for the checkout function',
        'Break it: test duplicate webhooks, invalid signatures, and DB failures to verify your failure handling works',
        'Add more features like promo codes and subscriptions',
      ],
      correctIndex: 2,
      explanation: 'After the happy path works, break it. Test: What happens with duplicate webhooks? (idempotency check). What about invalid signatures? (should return 400). What if the DB is down during fulfillment? (should return 500 so Stripe retries). Do not trust that the agent implemented these just because the spec listed them.',
    },
    {
      type: 'code-fill',
      hint: 'Fill in values that match the pattern shown above.',
      instruction: 'Complete these failure test scenarios with the expected behavior:',
      language: 'bash',
      filename: 'test-failures.sh',
      template: '# Test 1: Duplicate webhook (idempotency)\nstripe trigger checkout.session.completed\nstripe trigger checkout.session.completed\n# Expected: second call logs "{{duplicate_result}}"\n\n# Test 2: Check signature verification\ncurl -X POST http://localhost:3000/api/webhooks/stripe \\\n  -H "Content-Type: application/json" \\\n  -d \'{"type": "checkout.session.completed"}\'\n# Expected: {{sig_fail_response}} response (no valid signature)\n\n# Test 3: DB failure during fulfillment\n# Expected: webhook returns {{db_fail_response}}, Stripe will {{retry_action}}',
      blanks: [
        { id: 'duplicate_result', answer: 'already fulfilled', alternatives: ['Already fulfilled', 'already processed'], placeholder: 'what is logged?', hint: 'The idempotency guard message' },
        { id: 'sig_fail_response', answer: '400', alternatives: ['400 Bad Request', 'HTTP 400'], placeholder: 'status code?', hint: 'Bad request — no valid signature' },
        { id: 'db_fail_response', answer: '500', alternatives: ['500 Internal Server Error', 'HTTP 500'], placeholder: 'status code?', hint: 'Server error triggers retry' },
        { id: 'retry_action', answer: 'retry', alternatives: ['retry the webhook', 'resend'], placeholder: 'what will Stripe do?', hint: 'Stripe retries on 5xx responses' },
      ],
      explanation: 'Each test verifies a specific failure mode: duplicates should be no-ops, missing signatures should be rejected with 400, and processing failures should return 500 so Stripe retries later. Never trust that the agent implemented these — always verify.',
    },
    {
      type: 'terminal',
      instruction: 'Send a test webhook without a valid signature to verify your handler rejects it.',
      expectedCommand: 'curl -X POST http://localhost:3000/api/webhooks/stripe -H "Content-Type: application/json" -d \'{"type":"checkout.session.completed"}\'',
      hint: 'Use curl to send a raw POST without Stripe signature headers',
      platforms: {
        windows: {
          instruction: 'Send a test webhook without a valid signature to verify your handler rejects it. In PowerShell, use Invoke-WebRequest:',
          expectedCommand: 'Invoke-WebRequest -Method POST -Uri http://localhost:3000/api/webhooks/stripe -ContentType "application/json" -Body \'{"type":"checkout.session.completed"}\'',
          hint: 'Use Invoke-WebRequest to send a raw POST without Stripe signature headers',
        },
      },
    },
    {
      type: 'checkpoint',
      xp: 4,
      message: 'Failure verification complete!',
    },

    // === PARTIAL FAILURES ===
    {
      type: 'multiple-choice',
      hint: 'One option stands out when you think about the core purpose.',
      question: 'Fulfillment has 3 steps: DB update, email, and access provisioning. The DB update succeeds but email fails. What should happen?',
      options: [
        'Roll back everything — the user did not get confirmation so the order should not exist',
        'Return 500 so Stripe retries the entire fulfillment from scratch',
        'Keep the DB update (critical), queue the email for retry (non-critical), and return 200',
        'Ignore the email failure — the user will figure it out',
      ],
      correctIndex: 2,
      explanation: 'Separate critical operations (DB + access) from non-critical (email). Critical operations run in a transaction — if either fails, both roll back and the webhook returns 500 for retry. Non-critical operations are wrapped in try/catch and queued for background retry. The user gets their access immediately; the email arrives later.',
    },
    {
      type: 'compare',
      hint: 'Focus on what makes one approach more appropriate here.',
      title: 'Critical vs non-critical failure handling',
      body: 'Partial failures require separating operations that must succeed from those that can retry later.',
      question: 'Which approach correctly handles a failed email during fulfillment?',
      correctSide: 'right',
      left: {
        label: 'All-or-nothing (fragile)',
        content: "async function fulfillOrder(session) {\n  // If ANY step fails, everything fails\n  await db.insert(orders).values({...})\n  await db.insert(accessGrants).values({...})\n  await sendConfirmationEmail(order)\n  // Email failure = webhook returns 500\n  // Stripe retries = duplicate DB inserts!\n  return order\n}",
        language: 'typescript',
      },
      right: {
        label: 'Critical/non-critical split',
        content: "async function fulfillOrder(session) {\n  // Critical: DB transaction (atomic)\n  const order = await db.transaction(async (tx) => {\n    const [order] = await tx.insert(orders)...\n    await tx.insert(accessGrants)...\n    return order\n  })\n  // Non-critical: queue for retry\n  try {\n    await sendConfirmationEmail(order)\n  } catch (e) {\n    await queueFailedEmail(order.id, e)\n  }\n  return order\n}",
        language: 'typescript',
      },
      explanation: 'The right approach wraps critical operations (DB + access) in a transaction that rolls back atomically on failure. Non-critical operations (email) are caught and queued for background retry. The webhook returns 200 because the critical work succeeded.',
    },

    // === APPLYING THE PATTERN ===
    {
      type: 'multiple-choice',
      hint: 'Read each option carefully — one fits the context best.',
      question: 'The Stripe pattern (spec failures, phase the build, verify idempotency) applies to which other integrations?',
      options: [
        'Only payment processors like PayPal and Paddle',
        'Only webhook-based services',
        'Every third-party integration: OAuth, email services, file storage, any API with async callbacks or failure modes',
        'Only services that use REST APIs',
      ],
      correctIndex: 2,
      explanation: 'The pattern is universal. Every third-party integration has: an API call that can fail, an async callback that can arrive multiple times, partial success states, and edge cases the agent will not anticipate. OAuth flows, email services, file storage (S3 signed URLs) — all follow the same structure: happy path + explicit failure cases + idempotency.',
    },
    {
      type: 'order',
      hint: 'Consider what depends on what — prerequisites first.',
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
