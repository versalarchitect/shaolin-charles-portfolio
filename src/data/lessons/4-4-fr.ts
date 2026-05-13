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
      type: 'multiple-choice',
      question: 'Why do AI agents tend to over-architect systems?',
      options: [
        'They are designed to create complex systems',
        'They are trained on internet content including thousands of enterprise architecture posts — they optimize for abstract "correctness" without knowing your team size, timeline, or operational capacity',
        'They cannot understand simple architectures',
        'They are trying to impress the developer',
      ],
      correctIndex: 1,
      explanation: 'AI agents are trained on the entire internet — including thousands of posts about microservices, event sourcing, CQRS, and patterns designed for companies with 500+ engineers. The result: architectures that are technically correct but wildly inappropriate for a 3-person team or an MVP. The agent does not know your team size, timeline, or operational capacity. Your job is to evaluate against reality.',
    },

    // === THE EVALUATION FRAMEWORK ===
    {
      type: 'interactive-diagram',
      title: 'Agent suggestion evaluation flow',
      body: 'Walk through the evaluation process for any architectural suggestion from an agent.',
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
          explanation: 'Every suggestion enters the pipeline. First gate: does this solve a REAL, MEASURED problem? Not an imagined future problem. If the problem does not exist today, reject immediately.',
        },
        {
          highlightNodes: ['fit', 'constraints', 'reject'],
          highlightEdges: [{ from: 'fit', to: 'constraints' }, { from: 'fit', to: 'reject' }],
          explanation: 'If it fits requirements, check constraints: team size, timeline, budget, operational capacity. If it does not fit requirements at all, reject outright.',
        },
        {
          highlightNodes: ['constraints', 'simpler', 'modify'],
          highlightEdges: [{ from: 'constraints', to: 'simpler' }, { from: 'constraints', to: 'modify' }],
          explanation: 'If constraints are fully met, check for simpler alternatives. If constraints are only partially met, route to Modify — take the kernel idea and simplify it.',
        },
        {
          highlightNodes: ['simpler', 'accept', 'modify'],
          highlightEdges: [{ from: 'simpler', to: 'accept' }, { from: 'simpler', to: 'modify' }],
          explanation: 'Final gate: is there a simpler alternative? If no simpler way exists, accept. If simpler exists, modify. Microservices might become a modular monolith. Event sourcing might become an append-only log table.',
        },
      ],
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
      type: 'multiple-choice',
      question: 'An agent suggests event sourcing because "you might want an audit trail later." You have 50 users and no audit requirement. What is the correct evaluation?',
      options: [
        'Accept — better to have it and not need it',
        'The suggestion does not fit actual, current, proven requirements — architecture for imagined tomorrows is over-engineering',
        'Defer — implement it when you reach 1000 users',
        'Accept but simplify the implementation',
      ],
      correctIndex: 1,
      explanation: 'Not the imagined future requirements. Not the "what if we scale to 10M users" requirements. The actual, current, proven requirements. The suggestion is technically valid but does not fit what you actually need today. Architecture for current needs with extension points for tomorrow — not architecture for imagined tomorrows.',
    },
    {
      type: 'multiple-choice',
      question: 'An agent suggests a microservices architecture. Your team is 2 engineers with a 3-month deadline. Which evaluation question catches this?',
      options: [
        'Question 1: Does it fit requirements? — Microservices solve the wrong problem',
        'Question 2: Are constraints honored? — A team of 2 cannot operate 8 microservices within a 3-month deadline',
        'Question 3: Does a simpler alternative exist? — A monolith would be simpler',
        'None — microservices are always the right choice for production systems',
      ],
      correctIndex: 1,
      explanation: 'Your constraints are real and non-negotiable. Team of 2 cannot operate 8 microservices. A startup with 3-month runway cannot spend 6 weeks on infrastructure. When the agent suggests an architecture, check against: team size, timeline, operational capacity, budget, and existing expertise. If it requires capabilities you do not have, it is wrong — no matter how elegant.',
    },
    {
      type: 'match',
      instruction: 'Match each complex architecture to its simpler alternative that solves 90% of the problem:',
      leftItems: ['Microservices', 'Event sourcing', 'CQRS', 'Message queue for 50 emails/day'],
      rightItems: ['Modular monolith with clear seams', 'Append-only log table', 'Separate read/write repositories in same service', 'Synchronous send in the request handler'],
      correctPairs: { 0: 0, 1: 1, 2: 2, 3: 3 },
      explanation: 'For every complex architecture, there is usually a simpler one that solves 90% of the problem with 20% of the complexity. The simpler alternative might not be as theoretically pure, but if it ships faster and is maintainable by your team, it wins. This is the most important question and the one agents almost never ask themselves.',
    },
    {
      type: 'checkpoint',
      xp: 4,
      message: 'Evaluation framework locked in!',
    },

    // === COMMON AI ANTI-PATTERNS ===
    {
      type: 'multiple-choice',
      question: 'An agent creates an interface with exactly one implementation, a factory function that produces one type of object, and a plugin system with one plugin. What anti-pattern is this?',
      options: [
        'Premature optimization — the code is not slow enough to need abstraction',
        'Over-abstraction — every abstraction adds cognitive load with zero benefit when there is only one consumer',
        'Cargo-culting — the agent is copying patterns from enterprise code',
        'Tight coupling — the modules are too connected',
      ],
      correctIndex: 1,
      explanation: 'Agents love abstractions. They create interfaces for things with exactly one implementation. Every abstraction adds cognitive load, increases file count, and makes the codebase harder to navigate. The rule: no abstraction without at least 3 proven consumers. One consumer means inline it. Two means maybe. Three means abstract.',
    },
    {
      type: 'compare',
      title: 'Over-abstraction vs right-sized modules',
      body: 'The agent created 8 files for something that needs 4. Each abstraction layer adds navigation cost for the next agent.',
      left: {
        label: 'Over-Abstracted (8 files)',
        content: '// "Clean Architecture" with 1 implementation\nsrc/features/users/\n  domain/user.entity.ts\n  domain/user.repository.interface.ts\n  infrastructure/user.repository.impl.ts\n  application/create-user.use-case.ts\n  application/create-user.use-case.interface.ts\n  presentation/user.controller.ts\n  presentation/user.dto.ts\n  presentation/user.mapper.ts\n\n= 8 files, 1 feature\n= 1 implementation per interface\n= Pure overhead until 2nd implementation',
        language: 'text',
        filename: 'over-abstracted.txt',
      },
      right: {
        label: 'Right-Sized (4 files)',
        content: '// What you actually need:\nsrc/features/users/\n  users.handler.ts   (HTTP + validation)\n  users.service.ts   (business logic + DB)\n  users.test.ts      (tests)\n  index.ts           (public API)\n\n= 4 files, same feature\n= Fully functional\n= Easy to navigate\n= Abstraction justified only WHEN you\n  need a second implementation\n  (e.g., Postgres → DynamoDB)',
        language: 'text',
        filename: 'right-sized.txt',
      },
      question: 'Which structure lets the next agent find and modify user code faster?',
      correctSide: 'right',
      explanation: 'The abstraction is only justified WHEN you have a second implementation. One consumer means inline it. Two means maybe. Three means abstract. The right-sized version is fully functional with half the files and zero unnecessary interfaces.',
    },
    {
      type: 'compare',
      title: 'Premature optimization vs cargo-culting',
      body: 'Two AI anti-patterns that add complexity for zero benefit. Both stem from agents applying training data patterns without evaluating fit.',
      left: {
        label: 'Premature Optimization',
        content: '"Add Redis caching for this endpoint"\n"Implement connection pooling"\n"Virtualize this list for performance"\n\nAll potentially valid — but NOT before\nevidence of a performance problem.\n\nAgents suggest optimizations because\ntraining data associates them with\n"good" code.\n\nResult:\n- Complexity added to non-bottleneck\n- Operational burden increased\n- Wrong thing optimized\n\nRule: "What evidence says this is slow?"\nNo evidence = no optimization.',
        language: 'text',
        filename: 'premature-opt.txt',
      },
      right: {
        label: 'Cargo-Culting Patterns',
        content: 'GraphQL → 3 endpoints, 1 client\nKubernetes → deploy twice a month\nMessage queue → 10 events per hour\n\nPatterns from "production" or "enterprise"\ncode applied without the scale that\njustifies them.\n\nThese solve REAL problems at REAL scale.\nApplying them without that scale:\nthe pattern becomes the burden.\n\nResult:\n- Infrastructure complexity for nothing\n- Operational overhead without benefit\n- Pattern is the new problem\n\nRule: "Does our scale justify this?"\nNo scale = no pattern.',
        language: 'text',
        filename: 'cargo-cult.txt',
      },
      question: 'What question separates legitimate optimization from premature optimization?',
      correctSide: 'left',
      explanation: '"What evidence do we have that this is slow?" is the key question. Premature optimization adds complexity before evidence of a problem. Cargo-culting applies patterns from enterprise scale to small systems. Both stem from agents applying training data associations without evaluating whether the actual problem or scale exists in YOUR system.',
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
      type: 'multiple-choice',
      question: 'Why should you use a systematic checklist instead of gut feelings when evaluating agent architecture suggestions?',
      options: [
        'Checklists are faster than thinking',
        'A confident agent is not a correct agent — checklists give consistency and prevent the agent\'s confidence from overriding your judgment',
        'Agents always suggest bad architectures that need rejection',
        'Checklists eliminate the need to understand the suggestion at all',
      ],
      correctIndex: 1,
      explanation: 'Do not evaluate on vibes. Use a checklist — the same one every time. This gives you consistency and prevents the agent\'s confidence from overriding your judgment. A confident agent is not a correct agent. Score: problem-solution fit, constraint compliance, simplicity, operational cost, and reversibility. If more than 2 dimensions score poorly, the suggestion needs modification or rejection.',
    },
    {
      type: 'code-fill',
      instruction: 'Complete this architecture review checklist. Fill in the evaluation criteria and scoring dimensions.',
      language: 'markdown',
      template: '# Architecture Review: [Agent Suggestion]\n\n## ___ (1-5)\n- What specific problem does this solve?\n- Do we actually HAVE this problem today?\n- Is the problem proven or ___?\n\n## Constraint Compliance (1-5)\n- ___ can maintain this? (currently: ___ engineers)\n- Fits ___?\n- Operational capacity exists?\n\n## ___ (1-5)\n- Is there a ___ alternative that solves 90%?\n- Can a new team member understand this in < 1 hour?\n\n## Verdict: Accept / Modify / ___',
      blanks: [
        { id: 'first-dimension', answer: 'Problem-Solution Fit', alternatives: ['Problem Fit', 'Requirements Fit'], hint: 'Does the suggestion match the actual problem?', placeholder: 'dimension name' },
        { id: 'problem-type', answer: 'imagined', alternatives: ['speculated', 'theoretical', 'guessed'], hint: 'Opposite of proven/measured', placeholder: 'type of problem' },
        { id: 'team-check', answer: 'Team size', alternatives: ['Team', 'The team'], hint: 'How many engineers you have', placeholder: 'what to check' },
        { id: 'time-check', answer: 'timeline', alternatives: ['deadline', 'schedule'], hint: 'When you need to deliver', placeholder: 'constraint' },
        { id: 'simplicity-dim', answer: 'Simplicity', alternatives: ['Simplicity Check', 'Complexity'], hint: 'Could you do less and still win?', placeholder: 'dimension name' },
        { id: 'simpler', answer: 'simpler', alternatives: ['less complex', 'easier'], hint: 'The opposite of complex', placeholder: 'adjective' },
        { id: 'reject', answer: 'Reject', alternatives: ['reject', 'Decline'], hint: 'The third option when a suggestion fails evaluation', placeholder: 'verdict' },
      ],
      filename: 'arch-review-template.md',
      explanation: 'Use this template to evaluate every significant architectural suggestion. Score each criterion 1-5. Problem-Solution Fit catches imagined problems. Constraint Compliance catches unrealistic suggestions. Simplicity catches over-engineering. The verdict is Accept (all dimensions pass), Modify (take the kernel, simplify), or Reject (too complex for context).',
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
      type: 'compare',
      title: 'Trust implementation vs override strategy',
      body: 'The agent does not know your team\'s strengths, deployment process, or product roadmap. Know when to trust and when to override.',
      left: {
        label: 'Trust Agent (Implementation)',
        content: 'Trust the agent on:\n\n- Function structure\n- Variable naming\n- Algorithm choice for defined problems\n- Code formatting and style\n- Test structure and assertions\n- Error message wording\n\nWhy: These are well-defined problems\nwith clear right answers.\nThe agent has seen millions of examples.',
        language: 'text',
        filename: 'trust-agent.txt',
      },
      right: {
        label: 'Override Agent (Strategy)',
        content: 'Override the agent on:\n\n- Architecture patterns\n- Technology choices\n- Scope decisions\n- Anything involving org context\n\nAgent does NOT know:\n- Your team\'s strengths\n- Your deployment process\n- Your on-call rotation\n- Your tech debt priorities\n- Your product roadmap\n\nWithout these inputs, the agent\nis guessing — confidently.',
        language: 'text',
        filename: 'override-agent.txt',
      },
      question: 'On which type of decisions should you override the agent?',
      correctSide: 'right',
      explanation: 'Trust the agent on implementation details — well-defined problems with clear right answers. Override on strategic decisions — architecture patterns, technology choices, scope decisions, and anything involving organizational context the agent cannot see.',
    },
    {
      type: 'multiple-choice',
      question: 'Agent: "This service handles both user management and authentication. These should be separate microservices." Your team is 2 engineers. What is your evaluation?',
      options: [
        'Accept — separation of concerns is always better',
        'Override — the separation already exists at the module level. Splitting into services adds operational overhead (2 deploys, 2 monitors) for zero benefit at current scale.',
        'Defer — split them when the team grows',
        'Accept but simplify — use serverless functions instead of microservices',
      ],
      correctIndex: 1,
      explanation: 'The "separation of concerns" already exists at the module level — separate directories, separate tests, clear interface. The only benefit of splitting into services is independent scaling, which is irrelevant at current load. Override: keep as modular monolith. Module boundary gives separation of concerns. Service boundary gives operational overhead for zero benefit.',
    },
    {
      type: 'multiple-choice',
      question: 'Agent: "Using a JSON file for config is not production-ready. We should use a proper config service with encryption and hot-reload." Your app has 5 config values that change yearly. Override or accept?',
      options: [
        'Accept — configuration services are industry best practice',
        'Override — 5 values that change yearly do not justify a config service. Keep the JSON file. Revisit when you have 50+ values or need hot-reload.',
        'Modify — use environment variables instead of JSON',
        'Defer — add the config service when you add more config values',
      ],
      correctIndex: 1,
      explanation: 'The app has 5 config values, deploys once per week, secrets are in env vars already. The "proper" solution adds a config service dependency, encryption complexity, and hot-reload logic for 5 values that change yearly. Override: keep the JSON file. The agent rejects simplicity because training data associates "production-ready" with complex infrastructure.',
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
      type: 'multiple-choice',
      question: 'You override an agent\'s microservices suggestion. How should you communicate the override?',
      options: [
        'Just say "no" and move on',
        'Explain WHY in terms the agent can use for future decisions, then codify recurring overrides in CLAUDE.md as constraints',
        'Ignore the suggestion without responding',
        'Accept a simplified version to avoid conflict',
      ],
      correctIndex: 1,
      explanation: 'When you override, explain WHY in terms the agent can reuse: "Do not use microservices because our team of 2 cannot maintain multiple deployments. Use a modular monolith instead." Then codify recurring overrides in CLAUDE.md as constraints: "Architecture must be operationally manageable by a team of 2." This prevents the same suggestion repeatedly.',
    },

    // === SYNTHESIS ===
    {
      type: 'multiple-choice',
      question: 'At the Architect tier, your primary value is:',
      options: [
        'Writing code faster than agents can',
        'Designing systems from scratch without agent help',
        'EVALUATING proposed systems against reality — constraints the agent cannot see require your judgment',
        'Reviewing every line of code an agent produces',
      ],
      correctIndex: 2,
      explanation: 'Your value is in EVALUATING proposed systems against reality. The agent generates options. You evaluate them against constraints the agent cannot see. This is judgment, not craft. It requires understanding both technical trade-offs AND organizational context. Train this skill: for every suggestion, run the checklist. Over time, evaluation becomes instant — architectural intuition faster than any checklist.',
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
