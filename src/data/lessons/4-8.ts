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
      type: 'diagram',
      title: 'The Constraint Paradox',
      body: 'More rules means less deliberation, less conflict, and faster parallel execution.',
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
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'Constraint paradox understood!',
    },

    // === MONOREPO BOUNDARIES ===
    {
      type: 'info',
      title: 'Monorepo boundaries as agent guardrails',
      body: "A monorepo without boundaries is just a folder with multiple projects in it. Package boundaries — explicit dependency declarations, isolated build targets, enforced import restrictions — turn it into a system where agents can work in parallel without stepping on each other. If Agent A works in packages/auth and Agent B works in packages/billing, and neither can import from the other's internals, they cannot create conflicts. The boundary IS the parallelism enabler.",
    },
    {
      type: 'code-demo',
      title: 'Package boundary enforcement',
      body: 'This Nx project configuration prevents agents from reaching across package boundaries. Each package declares its public API explicitly.',
      language: 'json',
      filename: 'packages/auth/project.json',
      code: "{\n  \"name\": \"auth\",\n  \"tags\": [\"scope:auth\", \"type:domain\"],\n  \"implicitDependencies\": [],\n  \"targets\": {\n    \"build\": { \"executor\": \"@nx/tsc:tsc\" },\n    \"test\": { \"executor\": \"@nx/jest:jest\" },\n    \"lint\": { \"executor\": \"@nx/eslint:lint\" }\n  }\n}",
    },
    {
      type: 'code-demo',
      title: 'Lint rule preventing cross-boundary imports',
      body: 'Nx module boundary rules make invalid imports a build error — agents literally cannot violate the constraint.',
      language: 'json',
      filename: '.eslintrc.json',
      code: "{\n  \"rules\": {\n    \"@nx/enforce-module-boundaries\": [\n      \"error\",\n      {\n        \"depConstraints\": [\n          {\n            \"sourceTag\": \"scope:auth\",\n            \"onlyDependOnLibsWithTags\": [\"scope:shared\", \"scope:auth\"]\n          },\n          {\n            \"sourceTag\": \"scope:billing\",\n            \"onlyDependOnLibsWithTags\": [\"scope:shared\", \"scope:billing\"]\n          },\n          {\n            \"sourceTag\": \"scope:shared\",\n            \"onlyDependOnLibsWithTags\": [\"scope:shared\"]\n          }\n        ]\n      }\n    ]\n  }\n}",
    },
    {
      type: 'multiple-choice',
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
      type: 'info',
      title: 'Deployment contracts that force clean interfaces',
      body: "A deployment contract says: this package deploys independently. That single statement forces enormous discipline. If auth deploys without billing, then auth cannot import billing internals. If billing deploys without the frontend, then billing must expose a versioned API. Deployment independence forces interface cleanliness — and clean interfaces are what let agents build components in isolation without needing to understand the whole system.",
    },
    {
      type: 'code-demo',
      title: 'CLAUDE.md deployment contract',
      body: 'This constraint in your CLAUDE.md tells every agent: your work must be independently deployable. No reaching across deployment units.',
      language: 'markdown',
      filename: 'packages/billing/CLAUDE.md',
      code: "# Billing Service\n\n## Deployment Contract\nThis package deploys independently via its own CI pipeline.\n\n### Rules for all agents:\n1. **No imports from other packages** except `@repo/shared-types`\n2. **All external communication** via HTTP API or message queue\n3. **Database**: Own schema, own migrations, own connection\n4. **Environment**: Must boot with only its own .env variables\n5. **Tests**: Must pass with no other service running\n\n### Public API (what other packages consume):\n- POST /api/billing/create-subscription\n- POST /api/billing/cancel-subscription\n- GET  /api/billing/status/:userId\n- Webhook: billing.subscription.changed\n\n### Off-limits:\n- Direct database queries from other services\n- Importing internal modules (use the HTTP API)\n- Shared mutable state",
    },
    {
      type: 'multiple-choice',
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
      type: 'info',
      title: 'API versioning enables parallel evolution',
      body: "Without versioning, changing an API breaks every consumer simultaneously. With versioning, Agent A can build v2 of an endpoint while Agent B continues consuming v1. When Agent B is ready to migrate, it moves to v2 on its own timeline. No coordination, no blocking, no merge conflicts. Versioning is the temporal constraint — it lets different parts of the system evolve at different speeds without breaking each other.",
    },
    {
      type: 'code-demo',
      title: 'Versioned API contract',
      body: 'Both versions coexist. Agent building the new payment flow uses v2. Agent maintaining the old checkout uses v1. No conflict.',
      language: 'typescript',
      filename: 'packages/api/src/routes/subscriptions.ts',
      code: "// v1 — stable, consumed by legacy checkout\nrouter.post('/v1/subscriptions', async (req, res) => {\n  const { planId, userId } = req.body\n  const sub = await createSubscription({ planId, userId })\n  return res.json({ id: sub.id, status: sub.status })\n})\n\n// v2 — new response shape, consumed by new dashboard\nrouter.post('/v2/subscriptions', async (req, res) => {\n  const { planId, userId, metadata } = req.body\n  const sub = await createSubscription({ planId, userId, metadata })\n  return res.json({\n    subscription: {\n      id: sub.id,\n      status: sub.status,\n      plan: sub.plan,\n      currentPeriodEnd: sub.currentPeriodEnd,\n    },\n    actions: {\n      cancel: `/v2/subscriptions/${sub.id}/cancel`,\n      upgrade: `/v2/subscriptions/${sub.id}/upgrade`,\n    },\n  })\n})",
    },
    {
      type: 'checkpoint',
      xp: 5,
      message: 'Deployment and versioning constraints locked in!',
    },

    // === EVALUATING CONSTRAINTS ===
    {
      type: 'info',
      title: 'Is this constraint helping or hurting?',
      body: "Not all constraints are good. A constraint that forces agents to write boilerplate without preventing errors is pure friction. A constraint that prevents classes of errors without adding ceremony is pure value. The test: does this constraint prevent a real problem that has occurred (or would likely occur) during agent-parallel development? If yes, keep it. If it only exists because 'it is best practice' but has never caught anything — remove it. Dead constraints slow your fleet for no benefit.",
    },
    {
      type: 'info',
      title: 'Signs of a helpful constraint',
      body: "Helpful constraints share three properties. First: they are automatable — the system enforces them, not human review. Second: they catch real errors — you can point to a specific incident they would have prevented. Third: they do not require agent awareness — the constraint works even if the agent does not know about it (like a lint rule that fails the build). If your constraint requires the agent to 'remember' to do something, it is not a constraint — it is a wish.",
    },
    {
      type: 'multiple-choice',
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
      type: 'info',
      title: 'Signs of a harmful constraint',
      body: "Harmful constraints look like: mandatory code comments (agents generate verbose comments that add nothing), required design documents before implementation (agents build faster than they write docs), forced approval workflows for non-critical paths (blocks parallel work). The test is always: does this constraint prevent a problem that matters, or does it prevent velocity without offsetting benefit? Be ruthless about removing constraints that served humans but obstruct agents.",
    },
    {
      type: 'order',
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
      type: 'info',
      title: 'Designing constraints as a system',
      body: "Individual constraints are useful. Constraints designed as an interlocking system are transformative. Module boundaries prevent cross-package imports. Deployment contracts prevent shared state. API versioning prevents breaking changes. TypeScript strict mode prevents type mismatches. Together, they create an environment where ANY agent can work on ANY package at ANY time without coordination. That is the goal: zero-coordination parallelism through systematic constraints.",
    },
    {
      type: 'code-demo',
      title: 'Constraint system overview',
      body: 'A well-designed constraint system in CLAUDE.md gives every agent complete autonomy within its designated scope.',
      language: 'markdown',
      filename: 'CLAUDE.md',
      code: "# System Constraints (applies to ALL agents)\n\n## Layer 1: Isolation\n- Each package has its own CLAUDE.md with scope-specific rules\n- No package may import another package's internal modules\n- Each package has independent test suite that runs in isolation\n\n## Layer 2: Communication\n- Cross-package communication: HTTP API or event bus ONLY\n- All APIs are versioned (v1, v2, etc.) — never break consumers\n- Shared types live in @repo/shared-types — the only cross-cut\n\n## Layer 3: Verification\n- TypeScript strict mode — no `any`, no implicit returns\n- 80% test coverage minimum on business logic\n- Build must succeed independently per package\n\n## Layer 4: Evolution\n- New packages: create with `nx g @repo/plugin:package`\n- Deprecation: mark old version, add new version, migrate callers\n- Removal: only after zero imports of old version for 30 days\n\n## What this enables:\n- Any agent can work on any package without coordination\n- 5 agents on 5 packages simultaneously = zero conflicts\n- Merge order does not matter if all packages pass independently",
    },
    {
      type: 'multiple-choice',
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
      type: 'info',
      title: 'From theory to your codebase',
      body: "Start with one constraint. The highest-value first constraint for any team adopting agent fleets is module boundary enforcement. It immediately prevents the most common agent-parallel failure mode: conflicting imports. Add it, enforce it with tooling (not just documentation), and observe how agent parallelism improves. Then add deployment contracts. Then API versioning. Layer by layer, you build an environment where agents can sprint without tripping over each other.",
    },
    {
      type: 'info',
      title: 'Constraints as competitive advantage',
      body: "Your competitor has 10 engineers writing code manually. You have 2 engineers directing agent fleets across a well-constrained system. Their engineers need meetings, code review, and coordination to avoid conflicts. Your agents need none of that — the constraints handle coordination automatically. Your ship frequency is 5x theirs. Your defect rate is lower because constraints catch errors at write-time, not review-time. The constraint system is not overhead — it is the architecture that makes agent-fleet velocity possible. It is your moat.",
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
