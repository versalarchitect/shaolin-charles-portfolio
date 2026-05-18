import type { LessonContent } from './types'

const content: LessonContent = {
  lessonId: '4-8',
  steps: [
    // === INTRODUCTION ===
    {
      type: 'info',
      title: 'Why clear rules make AI agents work faster',
      body: "Counter-intuitive truth: the more rules you impose on your agent fleet, the faster they move. An unconstrained agent wastes tokens deliberating, makes incompatible choices, and produces output that conflicts with other agents. A constrained agent knows exactly what it can and cannot do — so it executes immediately within its lane. System-level constraints are not bureaucracy. They are the rails that let your fleet run at full speed without derailing.",
    },
    {
      type: 'info',
      title: 'Why unconstrained systems are slow',
      body: "Imagine five agents working on the same codebase with no constraints. Agent A picks Zustand for state. Agent B picks Jotai. Agent C invents its own context pattern. Agent D imports from a path Agent E just renamed. Every agent is individually productive but collectively incoherent. You spend more time resolving conflicts than you saved with parallelism. Constraints eliminate coordination overhead by making compatible choices the ONLY choices available.",
    },

    // === THE CONSTRAINT PARADOX ===
    {
      type: 'interactive-diagram',
      title: 'The Constraint Paradox',
      body: 'Click through to see why more rules means less deliberation, less conflict, and faster parallel execution.',
      diagram: {
        direction: 'LR',
        nodes: [
          { id: 'unconstrained', label: 'Unconstrained System', sublabel: 'Few rules', shape: 'rect' },
          { id: 'slow', label: 'Slow Execution', sublabel: 'Conflicts, deliberation, rework', shape: 'rounded' },
          { id: 'constrained', label: 'Constrained System', sublabel: 'Explicit boundaries', shape: 'rect', highlight: true },
          { id: 'fast', label: 'Fast Parallel Execution', sublabel: 'No conflicts, clear lanes', shape: 'rounded', highlight: true },
        ],
        edges: [
          { from: 'unconstrained', to: 'slow', label: 'leads to' },
          { from: 'constrained', to: 'fast', label: 'enables' },
        ],
      },
      stages: [
        {
          highlightNodes: ['unconstrained'],
          highlightEdges: [],
          explanation: 'An unconstrained system has few rules. Agents can pick any technology, write code anywhere, and make independent choices. Sounds like freedom — but it leads to chaos.',
        },
        {
          highlightNodes: ['unconstrained', 'slow'],
          highlightEdges: [{ from: 'unconstrained', to: 'slow' }],
          explanation: 'Without constraints, agents make conflicting choices: one picks Zustand, another picks Jotai, a third invents its own pattern. You spend more time resolving conflicts than you saved with parallelism.',
        },
        {
          highlightNodes: ['constrained'],
          highlightEdges: [],
          explanation: 'A constrained system has explicit boundaries: technology choices, file paths, scope exclusions, performance budgets. Every decision point is pre-decided.',
        },
        {
          highlightNodes: ['constrained', 'fast'],
          highlightEdges: [{ from: 'constrained', to: 'fast' }],
          explanation: 'Constraints eliminate deliberation. Agents execute immediately within their lanes. No conflicts, no coordination meetings, no rework. Paradoxically, more rules create more speed.',
        },
      ],
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'Constraint paradox understood!',
    },

    // === COMPARE: OPEN-ENDED VS CONSTRAINED ===
    {
      type: 'compare',
      hint: 'Look at the key differences between the two approaches.',
      title: 'Open-ended vs Constrained spec',
      body: 'See how constraints eliminate deliberation and make agents execute immediately.',
      left: {
        label: 'Open-Ended',
        content: 'Prompt: "Build auth for the app"\n\nAgent response:\n"I\'ll set up authentication. Let me explore options:\n- Should I use JWT or sessions?\n- OAuth providers or email/password?\n- What about magic links?\n- Should I add MFA?\n- Which library — Passport, Lucia, Auth.js?"\n\n→ 5 follow-up questions\n→ 3 round trips before any code\n→ Agent picks a stack you didn\'t want',
        language: 'text',
        filename: 'open-ended-spec.txt',
      },
      right: {
        label: 'Constrained',
        content: 'Prompt: "Use Supabase Auth, OAuth only\n(Google + GitHub), no custom JWT,\nno magic links, no MFA for v1"\n\nAgent response:\n"Setting up Supabase Auth with\nOAuth providers.\n\n1. Configure Google OAuth\n2. Configure GitHub OAuth\n3. Add auth callback handler\n4. Create protected route middleware\n\nStarting implementation..."\n\n→ 0 follow-up questions\n→ Immediate execution\n→ Exactly what you specified',
        language: 'text',
        filename: 'constrained-spec.txt',
      },
      question: 'Which spec leads to faster agent execution?',
      correctSide: 'right',
      explanation: 'The constrained spec eliminates every decision point. The agent does not ask about JWT vs sessions because you said "no custom JWT." It does not ask about magic links because you excluded them. Every constraint you add removes a question the agent would otherwise ask, turning deliberation into immediate execution.',
    },

    // === CODE-FILL: ADD CONSTRAINTS ===
    {
      type: 'code-fill',
      hint: 'Fill in values that match the pattern shown above.',
      instruction: 'Add constraints to this open-ended spec. Fill in the blanks with specific technology choices, boundaries, and exclusions to eliminate agent deliberation.',
      language: 'markdown',
      filename: 'specs/constrained-feature.md',
      template: '# Feature: User Dashboard\n\n## Technology Constraints\n- Framework: {{framework}}\n- Styling: {{styling}}\n- Data fetching: {{data_fetching}}\n\n## Boundaries\n- This feature lives in {{feature_path}}\n- No imports from {{excluded_imports}}\n\n## Exclusions (do NOT build)\n- No {{exclusion_1}}\n- No {{exclusion_2}}\n- No {{exclusion_3}}',
      blanks: [
        { id: 'framework', answer: 'React', alternatives: ['Next.js', 'Vue', 'Svelte', 'react'], placeholder: 'which framework?', hint: 'The UI library you use' },
        { id: 'styling', answer: 'Tailwind CSS', alternatives: ['tailwind', 'Tailwind', 'CSS modules', 'styled-components'], placeholder: 'which styling solution?' },
        { id: 'data_fetching', answer: 'React Query', alternatives: ['TanStack Query', 'SWR', 'react-query', 'tRPC'], placeholder: 'which data fetching library?', hint: 'A popular server state library' },
        { id: 'feature_path', answer: 'src/features/dashboard/', alternatives: ['src/pages/dashboard/', 'src/modules/dashboard/', 'packages/dashboard/'], placeholder: 'which directory?' },
        { id: 'excluded_imports', answer: 'other feature directories', alternatives: ['other features', 'other modules', 'internal modules of other packages'], placeholder: 'what cannot be imported?', hint: 'Keep features isolated' },
        { id: 'exclusion_1', answer: 'custom chart library', alternatives: ['custom charts', 'chart library', 'data visualization library', 'custom graphing'], placeholder: 'excluded scope item 1', hint: 'A common scope creep for dashboards' },
        { id: 'exclusion_2', answer: 'real-time updates', alternatives: ['websockets', 'live updates', 'real-time', 'WebSocket connections'], placeholder: 'excluded scope item 2', hint: 'An expensive feature often added prematurely' },
        { id: 'exclusion_3', answer: 'export to PDF', alternatives: ['PDF export', 'CSV export', 'data export', 'report generation'], placeholder: 'excluded scope item 3', hint: 'A feature that adds significant complexity' },
      ],
      explanation: 'Each filled blank removes a decision the agent would otherwise make on its own. Technology choices prevent stack deliberation. Path boundaries prevent cross-feature coupling. Exclusions prevent scope creep. The more specific, the faster the agent executes.',
    },

    // === PROMPT-LAB: CONSTRAINED SPEC ===
    {
      type: 'prompt-lab',
      hint: 'Be specific about what you want — vague prompts get vague responses.',
      instruction: 'Write a constrained spec for a notification system. Specify the technology, file boundaries, and what is explicitly excluded. The more constraints you add, the faster the agent will execute.',
      scenario: 'You need a notification system for your application. It should use Supabase Realtime for in-app notifications, be contained to a single directory, and must NOT include email, SMS, or push notification integration for this version. Write a spec that eliminates all agent deliberation.',
      starterPrompt: 'Build notifications.',
      responses: [
        {
          triggerKeywords: ['Supabase', 'only modify', 'no email', 'no SMS', 'no push', 'boundary', 'exclude', 'response time', 'performance', 'ms'],
          response: 'Clear spec received. Implementing notification system with these constraints:\n\n1. Technology: Supabase Realtime subscriptions only\n2. Scope: src/features/notifications/ — all files here\n3. Excluded: email, SMS, push notifications, third-party services\n4. Interface: subscribe(userId) -> Observable<Notification>\n5. Storage: notifications table in Supabase\n\nStarting implementation with types, service, and subscription hook.',
          quality: 'excellent',
          feedback: 'Outstanding. You specified technology (Supabase Realtime), file boundary (single directory), scope exclusions (no email/SMS/push), and the agent can execute immediately with zero follow-up questions. Each constraint removed a decision point.',
        },
        {
          triggerKeywords: ['notification', 'in-app', 'real-time', 'realtime', 'Supabase'],
          response: 'I will build an in-app notification system. Let me clarify a few things:\n- Should I also handle email notifications?\n- What about push notifications for mobile?\n- Which directory should this live in?\n\nOnce you confirm, I will start implementation.',
          quality: 'good',
          feedback: 'You mentioned the technology but left gaps that caused follow-up questions. Add explicit exclusions ("no email, no SMS, no push") and file boundaries ("only modify src/features/notifications/") to eliminate all deliberation.',
        },
      ],
      fallbackResponse: {
        response: 'I will build a notification system. Let me explore the options:\n- In-app notifications via WebSocket or polling?\n- Email notifications via SendGrid or Resend?\n- Push notifications via Firebase?\n- Should I set up a notification preferences page?\n- Where should the notification logic live?\n\nThis is a big feature — let me draft an architecture doc first.',
        feedback: 'The agent generated 5 questions and wants to write a design doc before any code. Your spec was too open-ended. Add constraints: "Use Supabase Realtime only. Only modify src/lib/notifications.ts. No email integration. No SMS. No push notifications. Max 100ms response time." Each constraint removes a question and gets you closer to immediate execution.',
      },
    },
    {
      type: 'match',
      hint: 'Find the unique connection between each pair.',
      instruction: 'Match each constraint type to a concrete example:',
      leftItems: [
        'Technology constraint',
        'File boundary',
        'Scope exclusion',
        'Performance budget',
      ],
      rightItems: [
        'Use Supabase Realtime only',
        'Only modify src/lib/notifications.ts',
        'No email integration',
        'Max 100ms response time',
      ],
      correctPairs: { 0: 0, 1: 1, 2: 2, 3: 3 },
      explanation: 'Each constraint type eliminates a different category of agent deliberation. Technology constraints prevent stack exploration (the agent will not evaluate 5 WebSocket libraries). File boundaries prevent architectural decisions (the agent knows exactly where to write code). Scope exclusions prevent feature creep (no time wasted on email templates). Performance budgets prevent over-engineering (the agent will not add caching layers for a 100ms target).',
    },
    {
      type: 'code-diff',
      title: 'Tightening an open-ended spec',
      body: 'See how an open-ended spec gets transformed into a constrained spec by adding specific constraints line by line.',
      language: 'markdown',
      filename: 'specs/notification-system.md',
      before: "# Feature: Notification System\n\n## Description\nBuild a notification system for the app.\nUsers should be able to receive notifications.\n\n## Requirements\n- Users get notified about important events\n- Notifications should be reliable\n- Good user experience",
      after: "# Feature: Notification System\n\n## Technology Constraints\n- Transport: Supabase Realtime subscriptions ONLY\n- Storage: notifications table in existing Supabase project\n- Frontend: React hook useNotifications() in src/hooks/\n\n## File Boundaries\n- Backend: src/lib/notifications.ts (single file)\n- Frontend: src/hooks/use-notifications.ts\n- Types: src/types/notifications.ts\n- NO new directories, NO new packages\n\n## Scope Exclusions (do NOT build)\n- No email notifications\n- No SMS or push notifications\n- No notification preferences UI\n- No notification grouping or batching\n- No read/unread tracking (v2)\n\n## Performance Budget\n- Notification delivery: < 500ms end-to-end\n- Hook re-render: < 16ms (one frame)\n- Max 50 notifications in memory per user",
      question: 'How many decision points were eliminated by adding constraints?',
      highlightLines: [3, 4, 5, 8, 9, 10, 11, 14, 15, 16, 17, 18, 21, 22, 23],
      explanation: 'The constrained spec eliminates at least 12 decision points: transport choice, storage location, frontend pattern, file locations, directory structure, email support, SMS support, push support, preferences UI, grouping logic, read tracking, and performance targets. Each line removes a question the agent would otherwise ask or a choice it would make on its own — potentially incompatibly with your existing system.',
    },

    // === MONOREPO BOUNDARIES ===
    {
      type: 'multiple-choice',
      hint: 'Read each option carefully — one fits the context best.',
      question: 'What transforms a monorepo from "just a folder with multiple projects" into a system enabling parallel agent work?',
      options: [
        'Using a monorepo tool like Nx or Turborepo',
        'Package boundaries — explicit dependency declarations, isolated build targets, and enforced import restrictions',
        'Having a shared package.json at the root',
        'Putting each project in its own directory',
      ],
      correctIndex: 1,
      explanation: "A monorepo without boundaries is just a folder with multiple projects in it. Package boundaries — explicit dependency declarations, isolated build targets, enforced import restrictions — turn it into a system where agents can work in parallel without stepping on each other. If Agent A works in packages/auth and Agent B works in packages/billing, and neither can import from the other's internals, they cannot create conflicts. The boundary IS the parallelism enabler.",
    },
    {
      type: 'code-fill',
      hint: 'Use the exact syntax from the lesson examples.',
      instruction: 'Complete this Nx project configuration that prevents agents from reaching across package boundaries. Fill in the tags and build targets.',
      language: 'json',
      filename: 'packages/auth/project.json',
      template: '{\n  "name": "auth",\n  "tags": ["{{scope_tag}}", "{{type_tag}}"],\n  "implicitDependencies": [],\n  "targets": {\n    "build": { "executor": "{{build_executor}}" },\n    "test": { "executor": "@nx/jest:jest" },\n    "lint": { "executor": "@nx/eslint:lint" }\n  }\n}',
      blanks: [
        { id: 'scope_tag', answer: 'scope:auth', alternatives: ['scope: auth', 'auth'], placeholder: 'scope tag?', hint: 'Tag identifying which domain this package belongs to' },
        { id: 'type_tag', answer: 'type:domain', alternatives: ['type: domain', 'domain', 'type:lib'], placeholder: 'type tag?', hint: 'Tag identifying the package type (domain, util, shared, etc.)' },
        { id: 'build_executor', answer: '@nx/tsc:tsc', alternatives: ['@nx/tsc', 'tsc', '@nx/js:tsc'], placeholder: 'build executor?', hint: 'The Nx executor for TypeScript compilation' },
      ],
      explanation: 'Nx project configurations with scope tags enable module boundary enforcement. Each package declares what it is (scope:auth, type:domain) so lint rules can restrict which packages can depend on which. Agents literally cannot violate these constraints because invalid imports fail the build.',
    },
    {
      type: 'code-fill',
      hint: 'Each blank follows the conventions demonstrated earlier.',
      instruction: 'Complete this ESLint rule that enforces module boundaries. Fill in the dependency constraints so auth can only import from shared and auth.',
      language: 'json',
      filename: '.eslintrc.json',
      template: '{\n  "rules": {\n    "@nx/enforce-module-boundaries": [\n      "error",\n      {\n        "depConstraints": [\n          {\n            "sourceTag": "scope:auth",\n            "onlyDependOnLibsWithTags": ["{{auth_deps}}"]\n          },\n          {\n            "sourceTag": "scope:billing",\n            "onlyDependOnLibsWithTags": ["{{billing_deps}}"]\n          },\n          {\n            "sourceTag": "scope:shared",\n            "onlyDependOnLibsWithTags": ["{{shared_deps}}"]\n          }\n        ]\n      }\n    ]\n  }\n}',
      blanks: [
        { id: 'auth_deps', answer: 'scope:shared", "scope:auth', alternatives: ['scope:shared, scope:auth', 'shared, auth'], placeholder: 'auth can depend on...?', hint: 'Auth should depend on shared utilities and its own scope' },
        { id: 'billing_deps', answer: 'scope:shared", "scope:billing', alternatives: ['scope:shared, scope:billing', 'shared, billing'], placeholder: 'billing can depend on...?', hint: 'Billing should depend on shared utilities and its own scope' },
        { id: 'shared_deps', answer: 'scope:shared', alternatives: ['shared', 'only shared'], placeholder: 'shared can depend on...?', hint: 'Shared should only depend on itself — no domain packages' },
      ],
      explanation: 'Nx module boundary rules make invalid imports a build error. Auth can import from shared and auth. Billing from shared and billing. Shared only from itself. Agents literally cannot violate these constraints — the build catches violations at the speed agents create them.',
    },
    {
      type: 'multiple-choice',
      hint: 'Eliminate the options that only partially fit.',
      question: 'Why are enforced module boundaries more valuable when agents build than when humans build?',
      options: [
        'Because agents write worse code than humans',
        'Because agents work faster, so boundary violations compound faster without enforcement',
        'Because agents cannot read lint rules',
        'Because humans never violate boundaries',
      ],
      correctIndex: 1,
      explanation: 'Agents are fast. A human might cross a boundary once and get caught in code review. An agent can cross it 50 times in 5 minutes before anyone notices. Enforced boundaries (lint errors, build failures) catch violations at the speed agents create them — immediately, automatically, before merge.',
    },
    {
      type: 'checkpoint',
      xp: 5,
      message: 'Monorepo constraints mastered!',
    },

    // === DEPLOYMENT CONTRACTS ===
    {
      type: 'multiple-choice',
      hint: 'Focus on the primary goal, not secondary benefits.',
      question: 'A deployment contract states: "this package deploys independently." What does that single statement force?',
      options: [
        'The package must use Docker containers',
        'Auth cannot import billing internals, billing must expose a versioned API — deployment independence forces interface cleanliness',
        'Each package needs its own repository',
        'Packages must be written in different languages',
      ],
      correctIndex: 1,
      explanation: "A deployment contract forces enormous discipline. If auth deploys without billing, then auth cannot import billing internals. If billing deploys without the frontend, then billing must expose a versioned API. Deployment independence forces interface cleanliness — and clean interfaces are what let agents build components in isolation without needing to understand the whole system.",
    },
    {
      type: 'code-fill',
      hint: 'Look at the surrounding code for context clues.',
      instruction: 'Complete this CLAUDE.md deployment contract. Fill in the rules that ensure independent deployability.',
      language: 'markdown',
      filename: 'packages/billing/CLAUDE.md',
      template: '# Billing Service\n\n## Deployment Contract\nThis package deploys independently via its own CI pipeline.\n\n### Rules for all agents:\n1. **No imports from other packages** except {{shared_import}}\n2. **All external communication** via {{comm_method}}\n3. **Database**: {{db_rule}}\n4. **Tests**: {{test_rule}}\n\n### Public API:\n- POST /api/billing/create-subscription\n- POST /api/billing/cancel-subscription\n- GET  /api/billing/status/:userId',
      blanks: [
        { id: 'shared_import', answer: '@repo/shared-types', alternatives: ['shared-types', 'shared types', '@repo/types'], placeholder: 'allowed import?', hint: 'The one package all domains can depend on' },
        { id: 'comm_method', answer: 'HTTP API or message queue', alternatives: ['HTTP API', 'API or events', 'HTTP or message queue', 'typed API'], placeholder: 'communication method?', hint: 'Two approved cross-service communication channels' },
        { id: 'db_rule', answer: 'Own schema, own migrations, own connection', alternatives: ['own schema', 'independent database', 'own schema and migrations', 'separate schema'], placeholder: 'database ownership rule?', hint: 'Each package manages its own data independently' },
        { id: 'test_rule', answer: 'Must pass with no other service running', alternatives: ['pass independently', 'pass in isolation', 'run without dependencies', 'independent tests'], placeholder: 'test isolation rule?', hint: 'Tests prove the package works alone' },
      ],
      explanation: 'A CLAUDE.md deployment contract tells every agent: your work must be independently deployable. No reaching across deployment units. Each filled blank eliminates a category of coupling that would prevent parallel agent work.',
    },
    {
      type: 'multiple-choice',
      hint: 'Think about which option is most specific to this concept.',
      question: 'A deployment contract forces "all external communication via HTTP API or message queue." How does this help agent parallelism?',
      options: [
        'HTTP is faster than direct imports',
        'Agents can build both sides of the API independently — they only need to agree on the contract, not the implementation',
        'Message queues are required for microservices',
        'It prevents agents from making database queries',
      ],
      correctIndex: 1,
      explanation: 'When communication is via a defined API contract, Agent A building the billing service and Agent B building the frontend only need to agree on the endpoint shape. They can work completely independently. Without this, they need to coordinate on internal module structures — killing parallelism.',
    },

    // === API VERSIONING ===
    {
      type: 'multiple-choice',
      hint: 'Consider what the lesson content emphasized.',
      question: 'Without API versioning, changing an endpoint breaks every consumer simultaneously. With versioning, what becomes possible?',
      options: [
        'You can delete old endpoints immediately',
        'Agent A builds v2 while Agent B continues consuming v1 — each evolves on its own timeline with zero coordination',
        'All agents must upgrade at the same time',
        'Only one version can exist at a time',
      ],
      correctIndex: 1,
      explanation: "Without versioning, changing an API breaks every consumer simultaneously. With versioning, Agent A can build v2 of an endpoint while Agent B continues consuming v1. When Agent B is ready to migrate, it moves to v2 on its own timeline. No coordination, no blocking, no merge conflicts. Versioning is the temporal constraint — it lets different parts of the system evolve at different speeds without breaking each other.",
    },
    {
      type: 'code-fill',
      hint: 'The answer matches the API or syntax just explained.',
      instruction: 'Complete this versioned API. Fill in the v2 endpoint path, the additional parameter, and the HATEOAS action links.',
      language: 'typescript',
      filename: 'packages/api/src/routes/subscriptions.ts',
      template: "// v1 — stable, consumed by legacy checkout\nrouter.post('/v1/subscriptions', async (req, res) => {\n  const { planId, userId } = req.body\n  const sub = await createSubscription({ planId, userId })\n  return res.json({ id: sub.id, status: sub.status })\n})\n\n// v2 — new response shape, consumed by new dashboard\nrouter.post('{{v2_path}}', async (req, res) => {\n  const { planId, userId, {{extra_param}} } = req.body\n  const sub = await createSubscription({ planId, userId, {{extra_param}} })\n  return res.json({\n    subscription: { id: sub.id, status: sub.status },\n    actions: {\n      cancel: `{{cancel_action}}`,\n    },\n  })\n})",
      blanks: [
        { id: 'v2_path', answer: '/v2/subscriptions', alternatives: ['/v2/subscriptions/', 'v2/subscriptions'], placeholder: 'v2 endpoint path?', hint: 'Same resource, different version prefix' },
        { id: 'extra_param', answer: 'metadata', alternatives: ['meta', 'options', 'extra'], placeholder: 'new v2 parameter?', hint: 'Additional data the new version accepts' },
        { id: 'cancel_action', answer: '/v2/subscriptions/${sub.id}/cancel', alternatives: ['/v2/subscriptions/cancel', 'cancel endpoint'], placeholder: 'cancel action URL?', hint: 'A HATEOAS link to the cancel endpoint' },
      ],
      explanation: 'Both versions coexist. The agent building the new payment flow uses v2. The agent maintaining the old checkout uses v1. No conflict. API versioning is the temporal constraint that enables parallel evolution.',
    },
    {
      type: 'checkpoint',
      xp: 5,
      message: 'Deployment and versioning constraints locked in!',
    },

    // === EVALUATING CONSTRAINTS ===
    {
      type: 'multiple-choice',
      hint: 'One option stands out when you think about the core purpose.',
      question: 'A constraint forces agents to write boilerplate code for every file but has never caught an actual error. What should you do with it?',
      options: [
        'Keep it — boilerplate enforces consistency',
        'Remove it — a constraint that adds ceremony without preventing real errors is pure friction. Dead constraints slow your fleet for no benefit.',
        'Make the boilerplate optional',
        'Add more boilerplate to be thorough',
      ],
      correctIndex: 1,
      explanation: "Not all constraints are good. The test: does this constraint prevent a real problem that has occurred (or would likely occur) during agent-parallel development? If yes, keep it. If it only exists because 'it is best practice' but has never caught anything — remove it. Dead constraints slow your fleet for no benefit. A constraint that prevents errors without ceremony is pure value. One that adds ceremony without catching errors is pure friction.",
    },
    {
      type: 'multiple-choice',
      hint: 'Read each option carefully — one fits the context best.',
      question: 'A constraint requires agents to "remember" to add a changelog entry for every PR. Is this a real constraint?',
      options: [
        'Yes — it enforces documentation discipline',
        'No — if it requires the agent to "remember" something, it is a wish, not a constraint. Real constraints are automatable, catch real errors, and work without agent awareness.',
        'Yes, if you remind agents in the prompt',
        'Only if you add it to CLAUDE.md',
      ],
      correctIndex: 1,
      explanation: "Helpful constraints share three properties. First: they are automatable — the system enforces them, not human review. Second: they catch real errors — you can point to a specific incident they would have prevented. Third: they do not require agent awareness — the constraint works even if the agent does not know about it (like a lint rule that fails the build). If your constraint requires the agent to 'remember' to do something, it is not a constraint — it is a wish.",
    },
    {
      type: 'multiple-choice',
      hint: 'Eliminate the options that only partially fit.',
      question: 'Which constraint is HURTING agent velocity without providing value?',
      options: [
        'All files must pass TypeScript strict mode before merge',
        'Every PR must include a changelog entry describing the change in user-facing language',
        'No package may import from another package\'s /internal directory',
        'Database migrations must be backward-compatible (no column drops without deprecation)',
      ],
      correctIndex: 1,
      explanation: 'Changelog entries require understanding user-facing impact — something agents struggle with for internal refactors. This constraint adds ceremony to every PR without catching errors. The other three are enforceable, automated, and prevent real problems (type errors, boundary violations, data loss).',
    },
    {
      type: 'multiple-choice',
      hint: 'Focus on the primary goal, not secondary benefits.',
      question: 'Which of these is a harmful constraint that served humans but obstructs agents?',
      options: [
        'TypeScript strict mode with zero any usage',
        'Required design documents before implementation — agents build faster than they write docs, creating pure friction',
        'Enforced module boundaries via lint rules',
        'Independent test suites per package',
      ],
      correctIndex: 1,
      explanation: "Harmful constraints look like: mandatory code comments (agents generate verbose comments that add nothing), required design documents before implementation (agents build faster than they write docs), forced approval workflows for non-critical paths (blocks parallel work). The test is always: does this constraint prevent a problem that matters, or does it prevent velocity without offsetting benefit? Be ruthless about removing constraints that served humans but obstruct agents.",
    },
    {
      type: 'order',
      hint: 'Consider what depends on what — prerequisites first.',
      instruction: 'Order these constraints from MOST valuable to LEAST valuable for agent fleet parallelism:',
      items: [
        'Enforced module boundaries via lint rules',
        'Required JSDoc comments on all exported functions',
        'Independent deployment pipelines per package',
        'Mandatory PR descriptions with screenshots',
        'Versioned API contracts between services',
      ],
      correctOrder: [0, 2, 4, 1, 3],
    },
    {
      type: 'checkpoint',
      xp: 5,
      message: 'Constraint evaluation mastered!',
    },

    // === CONSTRAINT ARCHITECTURE ===
    {
      type: 'multiple-choice',
      hint: 'Think about which option is most specific to this concept.',
      question: 'What is the difference between individual constraints and a constraint SYSTEM?',
      options: [
        'A system just has more constraints',
        'Individual constraints are useful; interlocking constraints are transformative — module boundaries + deployment contracts + API versioning + strict types together create an environment where ANY agent works on ANY package with zero coordination',
        'A system requires more documentation',
        'Individual constraints are faster to implement',
      ],
      correctIndex: 1,
      explanation: "Individual constraints are useful. Constraints designed as an interlocking system are transformative. Module boundaries prevent cross-package imports. Deployment contracts prevent shared state. API versioning prevents breaking changes. TypeScript strict mode prevents type mismatches. Together, they create an environment where ANY agent can work on ANY package at ANY time without coordination. That is the goal: zero-coordination parallelism through systematic constraints.",
    },
    {
      type: 'code-fill',
      hint: 'Fill in values that match the pattern shown above.',
      instruction: 'Complete this constraint system CLAUDE.md. Fill in the rules for each layer that together enable zero-coordination agent parallelism.',
      language: 'markdown',
      filename: 'CLAUDE.md',
      template: '# System Constraints (applies to ALL agents)\n\n## Layer 1: Isolation\n- No package may import another package\'s {{isolation_rule}}\n- Each package has independent test suite that runs in {{test_mode}}\n\n## Layer 2: Communication\n- Cross-package communication: {{comm_channels}} ONLY\n- Shared types live in {{types_location}} — the only cross-cut\n\n## Layer 3: Verification\n- TypeScript {{ts_mode}} — no `any`, no implicit returns\n- Build must succeed {{build_scope}}',
      blanks: [
        { id: 'isolation_rule', answer: 'internal modules', alternatives: ['internals', 'internal code', 'private modules', 'internal files'], placeholder: 'what cannot be imported?', hint: 'The private implementation details of other packages' },
        { id: 'test_mode', answer: 'isolation', alternatives: ['independently', 'alone', 'without other packages'], placeholder: 'test requirement?', hint: 'Tests prove the package works without other services' },
        { id: 'comm_channels', answer: 'HTTP API or event bus', alternatives: ['API or events', 'HTTP or message queue', 'typed API or event bus'], placeholder: 'approved communication?', hint: 'Two approved cross-package communication methods' },
        { id: 'types_location', answer: '@repo/shared-types', alternatives: ['shared-types', '@repo/types', 'the shared types package'], placeholder: 'where do shared types live?', hint: 'The one package all domains share' },
        { id: 'ts_mode', answer: 'strict mode', alternatives: ['strict', 'strict mode enabled'], placeholder: 'TypeScript config?', hint: 'The strictest TypeScript configuration' },
        { id: 'build_scope', answer: 'independently per package', alternatives: ['per package', 'independently', 'for each package'], placeholder: 'build requirement?', hint: 'Each package must build on its own' },
      ],
      explanation: 'A well-designed constraint system in CLAUDE.md gives every agent complete autonomy within its designated scope. Any agent can work on any package without coordination. 5 agents on 5 packages simultaneously means zero conflicts. Merge order does not matter if all packages pass independently.',
    },
    {
      type: 'multiple-choice',
      hint: 'Consider what the lesson content emphasized.',
      question: 'Your constraint system says "shared types live in @repo/shared-types — the only cross-cut." Why is this ONE exception important?',
      options: [
        'It makes the code DRY',
        'Without shared types, agents would invent incompatible interfaces — this is the minimum coordination point that enables everything else to be independent',
        'TypeScript requires shared types',
        'It is easier for agents to find types in one place',
      ],
      correctIndex: 1,
      explanation: 'The shared types package is the contract layer. It is the ONLY thing agents need to agree on. Everything else — implementation, testing, deployment — is independent. One narrow coordination point enables complete independence everywhere else. This is constraint design: the minimum shared surface that unlocks maximum parallelism.',
    },

    // === REAL-WORLD APPLICATION ===
    {
      type: 'multiple-choice',
      hint: 'One option stands out when you think about the core purpose.',
      question: 'What is the highest-value FIRST constraint to add when adopting agent fleets?',
      options: [
        'API versioning between all services',
        'Module boundary enforcement — it immediately prevents the most common agent-parallel failure mode: conflicting imports',
        'TypeScript strict mode across the codebase',
        'Required code comments on all functions',
      ],
      correctIndex: 1,
      explanation: "Start with one constraint. The highest-value first constraint for any team adopting agent fleets is module boundary enforcement. It immediately prevents the most common agent-parallel failure mode: conflicting imports. Add it, enforce it with tooling (not just documentation), and observe how agent parallelism improves. Then add deployment contracts. Then API versioning. Layer by layer, you build an environment where agents can sprint without tripping over each other.",
    },
    {
      type: 'compare',
      hint: 'Focus on what makes one approach more appropriate here.',
      title: 'Manual coordination vs Constraint-automated coordination',
      body: 'Your competitor has 10 engineers. You have 2 engineers directing agent fleets. Who ships faster?',
      left: {
        label: '10 Engineers (Manual)',
        content: 'Coordination method:\n- Daily standup meetings\n- PR code reviews (2-4 hour turnaround)\n- Architecture review boards\n- Slack threads about conflicts\n- Sprint planning sessions\n\nResult:\n- 2x deploys per week\n- Cross-team conflicts weekly\n- 15+ hours/week in meetings\n- Defects caught at review-time\n- Hiring more means more coordination',
        language: 'text',
        filename: 'manual.txt',
      },
      right: {
        label: '2 Engineers + Agent Fleet (Constraints)',
        content: 'Coordination method:\n- Module boundaries (lint enforced)\n- Deployment contracts (CI enforced)\n- API versioning (build enforced)\n- Type checking (compiler enforced)\n- Zero meetings needed\n\nResult:\n- 10x deploys per week\n- Zero cross-package conflicts\n- 0 hours/week in coordination\n- Defects caught at write-time\n- Scaling = more agents, not more hiring',
        language: 'text',
        filename: 'constraints.txt',
      },
      question: 'Which approach makes agent-fleet velocity possible?',
      correctSide: 'right',
      explanation: "The constraint system is not overhead — it is the architecture that makes agent-fleet velocity possible. It is your moat. Your agents need zero meetings, zero code review, zero coordination. The constraints handle it automatically. Your ship frequency is 5x the competition. Your defect rate is lower because constraints catch errors at write-time, not review-time.",
    },
    {
      type: 'checkpoint',
      xp: 5,
      message: 'Competitive advantage understood!',
    },

    // === SYNTHESIS ===
    {
      type: 'checklist',
      title: 'System-level constraints checklist:',
      items: [
        'I understand the constraint paradox: more rules = more freedom for agents',
        'I can design module boundaries that prevent cross-package conflicts',
        'I use deployment contracts to force clean interfaces between services',
        'I implement API versioning to enable parallel evolution',
        'I evaluate constraints with the three-property test (automatable, catches real errors, no agent awareness needed)',
        'I design constraints as interlocking systems, not isolated rules',
        'I remove constraints that add ceremony without catching errors',
      ],
    },
    {
      type: 'checkpoint',
      xp: 7,
      message: 'System-level constraints mastered. Your architecture enables velocity — constraints are your competitive advantage.',
    },
  ],
}

export default content
