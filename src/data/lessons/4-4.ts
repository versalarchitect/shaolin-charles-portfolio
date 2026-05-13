import type { LessonContent } from './types'

const content: LessonContent = {
  lessonId: '4-4',
  steps: [
    // === INTRODUCTION ===
    {
      type: 'info',
      title: 'Evaluating AI\'s architecture suggestions with your judgment',
      body: "The AI suggests a complex architecture. It sounds confident. The reasoning is clear. The examples look professional. But is it RIGHT for your situation? At this level, your role shifts from \"person who uses AI\" to \"person who evaluates AI recommendations.\" AI is excellent at generating plausible-sounding solutions. It is poor at evaluating whether that solution fits YOUR budget, YOUR team size, YOUR timeline, and YOUR maintenance capacity. That evaluation is your job — and it requires a simple framework, not gut feelings.",
    },
    {
      type: 'info',
      title: 'Why agents over-architect',
      body: "AI agents are trained on the entire internet — including thousands of blog posts about microservices, event sourcing, CQRS, and other patterns designed for companies with 500+ engineers. When you ask an agent to design a system, it draws from this corpus. The result: architectures that are technically correct but wildly inappropriate for a 3-person team or an MVP. The agent does not know your team size, your timeline, or your operational capacity. It optimizes for architectural \"correctness\" in the abstract. Your job is to evaluate against reality.",
    },

    // === THE EVALUATION FRAMEWORK ===
    {
      type: 'diagram',
      title: 'Agent suggestion evaluation flow',
      body: 'Every architectural suggestion from an agent goes through this evaluation before acceptance.',
      diagram: {
        direction: 'TB',
        nodes: [
          { id: 'suggestion', label: 'Agent Suggestion', sublabel: '"Use microservices"', shape: 'pill' },
          { id: 'fit', label: 'Requirements Fit?', sublabel: 'Does it solve the actual problem?', shape: 'diamond' },
          { id: 'constraints', label: 'Constraints Honored?', sublabel: 'Team size, timeline, ops budget', shape: 'diamond' },
          { id: 'simpler', label: 'Simpler Alternative?', sublabel: 'Could we do less and still win?', shape: 'diamond' },
          { id: 'accept', label: 'Accept', shape: 'rounded', highlight: true },
          { id: 'modify', label: 'Modify', sublabel: 'Take the kernel, simplify', shape: 'rounded' },
          { id: 'reject', label: 'Reject', sublabel: 'Too complex for context', shape: 'rounded' },
        ],
        edges: [
          { from: 'suggestion', to: 'fit' },
          { from: 'fit', to: 'constraints', label: 'yes' },
          { from: 'fit', to: 'reject', label: 'no' },
          { from: 'constraints', to: 'simpler', label: 'yes' },
          { from: 'constraints', to: 'modify', label: 'partially' },
          { from: 'simpler', to: 'accept', label: 'no simpler way' },
          { from: 'simpler', to: 'modify', label: 'simpler exists' },
        ],
      },
    },
    {
      type: 'interactive-diagram',
      title: 'Agent suggestion evaluation flow',
      body: 'Step through the evaluation process for any architectural suggestion from an agent.',
      diagram: {
        direction: 'TB',
        nodes: [
          { id: 'suggestion', label: 'Agent Suggestion', sublabel: '"Use microservices"', shape: 'pill' },
          { id: 'fit', label: 'Requirements Fit?', sublabel: 'Does it solve the actual problem?', shape: 'diamond' },
          { id: 'constraints', label: 'Constraints Honored?', sublabel: 'Team size, timeline, ops budget', shape: 'diamond' },
          { id: 'simpler', label: 'Simpler Alternative?', sublabel: 'Could we do less and still win?', shape: 'diamond' },
          { id: 'accept', label: 'Accept', shape: 'rounded', highlight: true },
          { id: 'modify', label: 'Modify', sublabel: 'Take the kernel, simplify', shape: 'rounded' },
          { id: 'reject', label: 'Reject', sublabel: 'Too complex for context', shape: 'rounded' },
        ],
        edges: [
          { from: 'suggestion', to: 'fit' },
          { from: 'fit', to: 'constraints', label: 'yes' },
          { from: 'fit', to: 'reject', label: 'no' },
          { from: 'constraints', to: 'simpler', label: 'yes' },
          { from: 'constraints', to: 'modify', label: 'partially' },
          { from: 'simpler', to: 'accept', label: 'no simpler way' },
          { from: 'simpler', to: 'modify', label: 'simpler exists' },
        ],
      },
      stages: [
        {
          highlightNodes: ['suggestion', 'fit'],
          highlightEdges: [{ from: 'suggestion', to: 'fit' }],
          explanation: 'Every agent suggestion enters the evaluation pipeline. First gate: does this solve a REAL, MEASURED problem? Not an imagined future problem, not a "what if we scale" scenario. If the problem does not exist today, the suggestion fails immediately.',
        },
        {
          highlightNodes: ['fit', 'reject'],
          highlightEdges: [{ from: 'fit', to: 'reject' }],
          explanation: 'If the suggestion does not fit actual requirements, reject it outright. Example: agent suggests event sourcing for "audit trail needs" — but you have 50 users and no audit requirement. Technically valid, practically wrong.',
        },
        {
          highlightNodes: ['fit', 'constraints'],
          highlightEdges: [{ from: 'fit', to: 'constraints' }],
          explanation: 'If it fits requirements, check constraints: can your team of 2 maintain this? Does it fit your 3-month timeline? Can you operate it? Budget allows? If constraints are only partially met, route to Modify.',
        },
        {
          highlightNodes: ['constraints', 'simpler', 'accept', 'modify'],
          highlightEdges: [{ from: 'constraints', to: 'simpler' }, { from: 'simpler', to: 'accept' }, { from: 'simpler', to: 'modify' }],
          explanation: 'Final gate: is there a simpler alternative? Microservices might become a modular monolith. Event sourcing might become an append-only log table. If no simpler way exists, accept. If simpler exists, modify — take the kernel idea and reduce complexity.',
        },
      ],
    },
    {
      type: 'match',
      instruction: 'Match each AI anti-pattern to the problem it causes in your codebase.',
      leftItems: ['God object', 'Over-abstraction', 'Premature optimization', 'Tight coupling'],
      rightItems: ['Single point of failure', 'Unnecessary complexity', 'Wasted effort on non-bottlenecks', 'Changes cascade across modules'],
      correctPairs: { 0: 0, 1: 1, 2: 2, 3: 3 },
      explanation: 'God objects become single points of failure because everything depends on them — modify the god object and the entire system is at risk. Over-abstraction creates unnecessary complexity through interfaces, factories, and layers that only have one consumer. Premature optimization wastes effort on non-bottlenecks because you are optimizing code that was never measured as slow. Tight coupling makes changes cascade because modifying one module forces changes in every module that depends on its internals.',
    },
    {
      type: 'info',
      title: 'Question 1: Does it fit the actual requirements?',
      body: "Not the imagined future requirements. Not the \"what if we scale to 10M users\" requirements. The actual, current, proven requirements. An agent suggests event sourcing because \"you might want an audit trail later.\" But you have 50 users and no audit requirement. The suggestion is technically valid but does not fit what you actually need today. Architecture for current needs with extension points for tomorrow — not architecture for imagined tomorrows.",
    },
    {
      type: 'info',
      title: 'Question 2: Are constraints honored?',
      body: "Your constraints are real and non-negotiable. Team of 2 cannot operate 8 microservices. A startup with 3-month runway cannot spend 6 weeks on infrastructure. A solo developer cannot maintain a Kubernetes cluster. When the agent suggests an architecture, check it against: team size, timeline, operational capacity, budget, and existing expertise. If the architecture requires capabilities you do not have, it is wrong — no matter how elegant.",
    },
    {
      type: 'info',
      title: 'Question 3: Does a simpler alternative exist?',
      body: "This is the most important question and the one agents almost never ask themselves. For every complex architecture suggested, there is usually a simpler one that solves 90% of the problem with 20% of the complexity. Microservices? Maybe a modular monolith with clear seams. Event sourcing? Maybe an append-only log table. CQRS? Maybe separate read/write repositories in the same service. The simpler alternative might not be as theoretically pure, but if it ships faster and is maintainable by your team, it wins.",
    },
    {
      type: 'checkpoint',
      xp: 4,
      message: 'Evaluation framework locked in!',
    },

    // === COMMON AI ANTI-PATTERNS ===
    {
      type: 'info',
      title: 'AI anti-pattern: Over-abstraction',
      body: "Agents love abstractions. They create interfaces for things that have exactly one implementation. They build plugin systems that will only ever have one plugin. They write factory functions that produce one type of object. Every abstraction adds cognitive load, increases the number of files, and makes the codebase harder for the next agent to navigate. The rule: no abstraction without at least 3 proven consumers. One consumer means inline it. Two means maybe. Three means abstract.",
    },
    {
      type: 'code-demo',
      title: 'Over-abstraction in action',
      body: 'The agent created 4 files for something that should be 1. Each abstraction layer adds navigation cost for the next agent.',
      language: 'typescript',
      filename: 'over-abstraction.ts',
      code: "// ❌ Agent's suggestion: \"Clean Architecture\" with 1 implementation\n// src/features/users/domain/user.entity.ts\n// src/features/users/domain/user.repository.interface.ts\n// src/features/users/infrastructure/user.repository.impl.ts\n// src/features/users/application/create-user.use-case.ts\n// src/features/users/application/create-user.use-case.interface.ts\n// src/features/users/presentation/user.controller.ts\n// src/features/users/presentation/user.dto.ts\n// src/features/users/presentation/user.mapper.ts\n// = 8 files, 1 feature, 1 implementation of each interface\n\n// ✅ What you actually need:\n// src/features/users/users.handler.ts   (HTTP + validation)\n// src/features/users/users.service.ts   (business logic + DB)\n// src/features/users/users.test.ts      (tests)\n// src/features/users/index.ts           (public API)\n// = 4 files, same feature, fully functional\n\n// The abstraction is only justified WHEN you have a second\n// implementation (e.g., switching from Postgres to DynamoDB).\n// Until then, it is pure overhead.",
    },
    {
      type: 'info',
      title: 'AI anti-pattern: Premature optimization',
      body: "\"Let us add Redis caching for this endpoint.\" \"We should implement database connection pooling.\" \"This list should be virtualized for performance.\" All of these are potentially valid — but not before you have evidence of a performance problem. Agents suggest optimizations because they have seen them in training data associated with \"good\" code. But premature optimization adds complexity, increases operational burden, and often optimizes the wrong thing. Ask: \"What evidence do we have that this is slow?\" No evidence = no optimization.",
    },
    {
      type: 'info',
      title: 'AI anti-pattern: Cargo-culting patterns',
      body: "The agent suggests patterns because it has seen them associated with \"production\" or \"enterprise\" code — not because they solve a specific problem in your system. GraphQL when you have 3 endpoints and one client. Kubernetes when you deploy twice a month. A message queue when you process 10 events per hour. These patterns solve real problems at real scale — but applying them without that scale is cargo-culting. The pattern becomes the burden it was meant to alleviate.",
    },
    {
      type: 'multiple-choice',
      question: 'An agent suggests implementing CQRS (separate read/write models) for your blog platform that has 100 daily active users and standard CRUD operations. What is your evaluation?',
      options: [
        'Accept — CQRS is a best practice for scalable systems',
        'Reject — CQRS solves read/write scaling conflicts that do not exist at this scale. A standard service layer handles this trivially.',
        'Modify — implement a simplified version of CQRS',
        'Accept but defer — implement it now so it is ready when you scale',
      ],
      correctIndex: 1,
      explanation: 'CQRS adds significant complexity (separate models, eventual consistency concerns, additional infrastructure). It solves a real problem: when reads and writes have fundamentally different scaling needs or data shapes. A 100-user blog has neither. A standard service with a single data model is simpler, maintainable, and sufficient. Reject and explain why to the agent.',
    },
    {
      type: 'checkpoint',
      xp: 4,
      message: 'AI anti-patterns identified!',
    },

    // === BUILDING A REVIEW CHECKLIST ===
    {
      type: 'info',
      title: 'The systematic review checklist',
      body: "Do not evaluate architecture suggestions on vibes. Use a checklist — the same one every time. This gives you consistency and prevents the agent's confidence from overriding your judgment. A confident agent is not a correct agent. Your checklist evaluates: problem-solution fit, constraint compliance, simplicity, operational cost, team capability, and reversibility. Score each dimension. If more than 2 dimensions score poorly, the suggestion needs modification or rejection.",
    },
    {
      type: 'code-demo',
      title: 'Architecture review checklist',
      body: 'Use this template to evaluate every significant architectural suggestion from an agent. Score each criterion.',
      language: 'markdown',
      filename: 'arch-review-template.md',
      code: "# Architecture Review: [Agent Suggestion]\n\n## Problem-Solution Fit (1-5)\n- What specific problem does this solve?\n- Do we actually HAVE this problem today?\n- Is the problem proven (measured) or imagined (speculated)?\n- Score: ___\n\n## Constraint Compliance (1-5)\n- Team size can maintain this? (currently: ___ engineers)\n- Fits timeline? (deadline: ___)\n- Operational capacity exists? (monitoring, on-call, deploys)\n- Budget allows? (infrastructure cost estimate: $___/mo)\n- Score: ___\n\n## Simplicity (1-5)\n- Is there a simpler alternative that solves 90%?\n- How many new concepts does this introduce?\n- Can a new team member understand this in < 1 hour?\n- Score: ___\n\n## Operational Cost (1-5)\n- What new infrastructure is needed?\n- What new failure modes are introduced?\n- What monitoring/alerting is required?\n- Score: ___\n\n## Reversibility (1-5)\n- If this is wrong, how hard is it to undo?\n- Can we migrate incrementally or is it all-or-nothing?\n- Score: ___\n\n## Verdict: Accept / Modify / Reject\n## If Modify: what simplification?",
    },
    {
      type: 'multiple-choice',
      question: 'An agent suggests adding a message queue (RabbitMQ) for handling email notifications in your app that sends ~50 emails/day. Scores: Problem-Solution Fit: 2, Constraint Compliance: 3, Simplicity: 2, Operational Cost: 2, Reversibility: 3. What is your verdict?',
      options: [
        'Accept — message queues are industry standard for async processing',
        'Modify — use a simpler async approach (e.g., a background job table with a cron worker)',
        'Reject — 50 emails/day can be sent synchronously in the request handler',
        'Defer — add it when email volume grows',
      ],
      correctIndex: 2,
      explanation: 'At 50 emails/day (roughly 2 per hour), the volume does not justify ANY async processing. Sending synchronously in the handler adds <500ms per request and zero operational complexity. The scores (2/5 on fit, 2/5 on simplicity, 2/5 on ops cost) clearly indicate rejection. The agent is solving a scale problem that does not exist.',
    },
    {
      type: 'checkpoint',
      xp: 4,
      message: 'Review checklist built!',
    },

    // === NEW INTERACTIVE STEPS ===
    {
      type: 'prompt-lab',
      instruction: 'Write a prompt rejecting the agent\'s architecture suggestion. The agent has suggested adding Redis caching to your API before any performance profiling has been done. Push back with evidence-based reasoning.',
      scenario: 'Your API serves 200 requests per minute with an average response time of 45ms. The agent says: "Let\'s add Redis caching to improve performance. I\'ll set up a Redis instance, add cache-aside logic to all read endpoints, and implement cache invalidation on writes." There is no evidence of a performance problem.',
      starterPrompt: 'Good idea, add it.',
      responses: [
        {
          triggerKeywords: ['profile', 'premature', 'evidence', 'measure', 'no evidence', 'not slow'],
          response: 'You\'re right — I should not optimize without evidence. Current response times are 45ms average, well within acceptable range. I\'ll skip the Redis caching for now. If profiling later reveals a bottleneck, we can add targeted caching at that point.',
          quality: 'excellent',
          feedback: 'Excellent pushback. You identified this as premature optimization by citing the actual performance data (45ms average) and requiring evidence before adding complexity. This is exactly the evaluator mindset — reject plausible-sounding suggestions that solve problems that do not exist.',
        },
        {
          triggerKeywords: ['wait', 'later', 'not yet', 'hold', 'defer'],
          response: 'I\'ll hold off on Redis for now and revisit it later when we have more traffic.',
          quality: 'good',
          feedback: 'Good instinct to defer, but your reasoning is weak. Instead of "later when we have more traffic", cite the specific evidence: current response times are 45ms (well under any threshold), and adding Redis introduces operational complexity (another service to maintain, cache invalidation bugs, deployment dependency). Rejection should be evidence-based.',
        },
        {
          triggerKeywords: ['sounds good', 'yes', 'do it', 'go ahead', 'great'],
          response: 'I\'ll set up Redis with cache-aside pattern on all read endpoints, implement TTL-based expiration, and add cache invalidation hooks on every write operation.',
          quality: 'poor',
          feedback: 'You accepted a premature optimization without questioning it. The API responds in 45ms — there is no performance problem to solve. Adding Redis means: a new infrastructure dependency, cache invalidation complexity, potential stale data bugs, and operational overhead. Always ask: "What evidence do we have that this is slow?" before accepting optimization suggestions.',
        },
      ],
      fallbackResponse: {
        response: 'I\'ll implement the Redis caching as suggested, with cache-aside pattern and TTL-based invalidation across all endpoints.',
        feedback: 'You need to push back. The agent is solving a problem that does not exist (45ms response times are fast). Effective rejection includes: (1) cite the actual metrics — "response times are 45ms, well within our 200ms target", (2) name the anti-pattern — "this is premature optimization", (3) state the cost — "Redis adds infrastructure complexity and cache invalidation risk", (4) set the trigger — "profile first, optimize only measured bottlenecks."',
      },
    },
    {
      type: 'compare',
      title: 'Blindly accepting vs critically evaluating agent suggestions',
      body: 'The agent suggests adding Redis caching. See the difference between accepting without evidence and pushing back with data.',
      left: {
        label: 'Blind Acceptance',
        content: 'Agent: "Add Redis caching"\nYou: "Sounds good, go ahead"\n\nResult:\n- Redis server added to infrastructure\n- Cache-aside logic in every endpoint\n- Cache invalidation on every write\n- TTL management across 12 endpoints\n- New failure mode: stale data bugs\n- New dependency: Redis must be running\n- DevOps overhead: monitoring, backups\n- Total cost: ~40 hours of work\n\nActual performance gain: 45ms → 8ms\nDid users notice? No.\nWas 45ms a problem? No.',
        language: 'text',
        filename: 'blind-acceptance.txt',
      },
      right: {
        label: 'Critical Evaluation',
        content: 'Agent: "Add Redis caching"\nYou: "What evidence says this is slow?"\n\nEvaluation:\n- Current response: 45ms average\n- Target SLA: 200ms p95\n- 45ms is 4.4x under target\n- No user complaints about speed\n- Profile shows: 90% time in DB query\n\nVerdict: REJECT premature optimization\n- If DB becomes bottleneck: add index\n- If that fails: add read replica\n- If that fails: then consider caching\n\nTotal cost: 5 minutes of evaluation\nResult: zero unnecessary complexity',
        language: 'text',
        filename: 'critical-evaluation.txt',
      },
      question: 'Which approach prevents unnecessary complexity while keeping the option to optimize later?',
      correctSide: 'right',
      explanation: 'Critical evaluation costs 5 minutes and prevents 40 hours of unnecessary work. The key is requiring evidence before optimization: current metrics (45ms), target SLA (200ms), and a profiling-based escalation path (index, then replica, then cache). Blind acceptance adds permanent operational complexity to solve a problem that does not exist.',
    },

    // === OVERRIDE SCENARIOS ===
    {
      type: 'info',
      title: 'When to override the agent',
      body: "Trust the agent on implementation details — function structure, variable naming, algorithm choice for well-defined problems. Override the agent on strategic decisions — architecture patterns, technology choices, scope decisions, and anything involving organizational context. The agent does not know: your team's strengths, your deployment process, your on-call rotation, your technical debt priorities, or your product roadmap. These are exactly the inputs that determine whether an architecture is correct. Without them, the agent is guessing — confidently.",
    },
    {
      type: 'info',
      title: 'Override scenario: the agent wants to split the service',
      body: "Agent: \"This service handles both user management and authentication. These should be separate microservices for separation of concerns.\" YOUR evaluation: The team is 2 engineers. Splitting means deploying, monitoring, and maintaining 2 services. The \"separation of concerns\" exists at the module level already — separate directories, separate tests, clear interface between them. The only benefit of splitting into services is independent scaling, which is irrelevant at current load. Override: keep as modular monolith. The module boundary gives you separation of concerns. The service boundary gives you operational overhead for zero benefit.",
    },
    {
      type: 'info',
      title: 'Override scenario: the agent rejects simplicity',
      body: "Agent: \"Using a JSON file for configuration is not production-ready. We should use a proper configuration service with environment-specific overrides, encryption for secrets, and hot-reload capability.\" YOUR evaluation: The app has 5 config values. It deploys once per week. Secrets are in environment variables already. The JSON file reads at startup and never changes. The \"proper\" solution adds a config service dependency, encryption complexity, and hot-reload logic for 5 values that change yearly. Override: keep the JSON file. Revisit when you have 50+ config values or need hot-reload.",
    },
    {
      type: 'multiple-choice',
      question: 'The agent suggests TypeScript strict mode with no-explicit-any for a rapid prototype that needs to ship in 3 days. You are the only developer. What is your evaluation?',
      options: [
        'Accept — strict types prevent bugs regardless of timeline',
        'This is a judgment call — strict mode is ideal but `any` as escape hatch for 3-day prototypes is a reasonable trade-off depending on whether this prototype might become production code',
        'Reject — prototypes should never use TypeScript',
        'Accept and add additional type linting rules for safety',
      ],
      correctIndex: 1,
      explanation: 'This is a genuine judgment call that depends on context the agent does not have. If this prototype will be thrown away, strict mode adds friction for zero benefit. If it might evolve into production code, strict mode prevents future pain. The agent cannot make this call — YOU know whether this prototype has legs. This is exactly the kind of strategic decision where your judgment overrides the agent\'s default.',
    },
    {
      type: 'checkpoint',
      xp: 4,
      message: 'Override judgment developed!',
    },

    // === PRACTICAL APPLICATION ===
    {
      type: 'order',
      instruction: 'Order these architecture review criteria by priority (evaluate first → evaluate last):',
      items: [
        'Reversibility — can we undo this if wrong?',
        'Problem-Solution Fit — does this solve a real, measured problem?',
        'Simplicity — does a simpler alternative exist?',
        'Operational Cost — what new infrastructure and monitoring is needed?',
        'Constraint Compliance — does it fit team size, timeline, and budget?',
      ],
      correctOrder: [1, 4, 2, 3, 0],
    },
    {
      type: 'info',
      title: 'Communicating overrides to agents',
      body: "When you override an agent's suggestion, do not just say \"no.\" Explain WHY in terms the agent can use for future decisions. \"Do not use microservices because our team of 2 cannot maintain multiple deployments. Use a modular monolith instead.\" This teaches the agent your constraints. In CLAUDE.md, codify recurring overrides as constraints: \"Architecture must be operationally manageable by a team of 2.\" This prevents the agent from making the same suggestion repeatedly.",
    },

    // === SYNTHESIS ===
    {
      type: 'info',
      title: 'The evaluator mindset',
      body: "Your value is no longer in writing code or even in designing systems from scratch. It is in EVALUATING proposed systems against reality. The agent generates options. You evaluate them against constraints the agent cannot see. This is a different skill from building — it is judgment, not craft. It requires understanding both the technical trade-offs AND the organizational context. Train this skill deliberately: for every agent suggestion, run the checklist. Over time, evaluation becomes instant — you develop architectural intuition that operates faster than any checklist.",
    },
    {
      type: 'checklist',
      title: 'Architecture evaluation checklist:',
      items: [
        'I have a systematic framework for evaluating agent suggestions (not just vibes)',
        'I can identify over-abstraction, premature optimization, and cargo-culting',
        'I evaluate against real constraints: team size, timeline, operational capacity',
        'I always ask: does a simpler alternative exist?',
        'I know when to trust the agent (implementation) vs override (strategy)',
        'I communicate overrides with reasons, and codify them in CLAUDE.md',
        'I score suggestions on 5 dimensions before accepting, modifying, or rejecting',
      ],
    },
    {
      type: 'checkpoint',
      xp: 19,
      message: 'Architecture evaluation mastery achieved! You can now systematically evaluate and override AI-generated architecture decisions.',
    },
  ],
}

export default content
