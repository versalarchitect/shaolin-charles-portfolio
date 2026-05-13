import type { LessonContent } from './types'

const content: LessonContent = {
  lessonId: '4-7',
  steps: [
    // === INTRODUCTION ===
    {
      type: 'info',
      title: 'When to override AI\'s confident-but-wrong advice',
      body: "You ask five agents to evaluate an architecture decision. All five agree: migrate to microservices. Their reasoning is sound, their confidence is high, and they cite industry best practices. But you know something they do not — your team is three people, your deploy pipeline cannot handle 12 services, and your traffic patterns make a modular monolith ten times simpler. This lesson is about the hardest skill in agent-augmented development: knowing when every agent in the room is wrong, and having the conviction to override them.",
    },
    {
      type: 'info',
      title: 'Why AI consensus fails',
      body: "Agents are trained on the internet. The internet over-represents certain patterns: microservices for scale, GraphQL for APIs, event-driven for decoupling. These are real solutions — to specific problems. But agents generalize them into universal advice. When five agents agree, it often means they are all drawing from the same biased training distribution, not that they have independently reasoned to the same conclusion. Consensus among agents is not the same as consensus among diverse experts with different contexts.",
    },

    // === FAILURE MODES ===
    {
      type: 'info',
      title: 'Three categories where agents fail',
      body: "First: novel problems. If no one has written about your specific constraint set on the internet, agents interpolate from adjacent examples — badly. Second: edge cases in your domain. The agent does not know your SLA is 50ms, your database is on a 2015 server with 4GB RAM, or your compliance team vetoes anything touching PII. Third: organizational constraints. Political realities, team skills, migration budgets, and technical debt context that no model can infer from a prompt.",
    },
    {
      type: 'interactive-diagram',
      title: 'Override Decision Flow',
      body: 'Walk through each stage of evaluating an agent recommendation. Click through to see how the decision unfolds.',
      diagram: {
        direction: 'LR',
        nodes: [
          { id: 'recommend', label: 'Agent Recommends', sublabel: 'Confident suggestion', shape: 'rect' },
          { id: 'evidence', label: 'Evaluate Evidence', sublabel: 'Check sources + reasoning', shape: 'diamond' },
          { id: 'domain', label: 'Check Domain Knowledge', sublabel: 'Your context + experience', shape: 'diamond', highlight: true },
          { id: 'override', label: 'Override', sublabel: 'Your judgment wins', shape: 'pill', highlight: true },
          { id: 'accept', label: 'Accept', sublabel: 'Proceed as advised', shape: 'pill' },
        ],
        edges: [
          { from: 'recommend', to: 'evidence' },
          { from: 'evidence', to: 'domain', label: 'evidence checked' },
          { from: 'domain', to: 'override', label: 'you have missing context' },
          { from: 'domain', to: 'accept', label: 'agent has full picture' },
        ],
      },
      stages: [
        {
          highlightNodes: ['recommend'],
          highlightEdges: [],
          explanation: 'The agent delivers a recommendation with high confidence. It sounds authoritative and cites best practices. But confidence is not the same as correctness.',
        },
        {
          highlightNodes: ['recommend', 'evidence'],
          highlightEdges: [{ from: 'recommend', to: 'evidence' }],
          explanation: 'Evaluate the evidence. Is the recommendation based on general best practice or specific analysis of YOUR codebase? General advice fails at specific scale.',
        },
        {
          highlightNodes: ['evidence', 'domain'],
          highlightEdges: [{ from: 'evidence', to: 'domain' }],
          explanation: 'Check against your domain knowledge. Does the agent know about your team size, SLA requirements, compliance constraints, and deployment environment? Your lived experience is data the model does not have.',
        },
        {
          highlightNodes: ['domain', 'override'],
          highlightEdges: [{ from: 'domain', to: 'override' }],
          explanation: 'Override path: the agent lacks critical context. Your 4-person team, your compliance requirements, or your deployment constraints make the recommendation wrong for YOUR situation.',
        },
        {
          highlightNodes: ['domain', 'accept'],
          highlightEdges: [{ from: 'domain', to: 'accept' }],
          explanation: 'Accept path: after checking, the agent has the full picture. Its recommendation aligns with your constraints and domain knowledge. Proceed as advised and document the decision.',
        },
      ],
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'Failure modes mapped!',
    },

    // === OVERRIDE CRITERIA ===
    {
      type: 'info',
      title: 'Building override criteria',
      body: "You need a framework, not vibes. Ask four questions. One: does the agent have access to the constraint that matters most? If you have not told it about your 4-person team or your compliance requirements, its recommendation is based on incomplete data — override. Two: is the recommendation based on general best practice or specific analysis of your codebase? General advice fails at specific scale. Three: have you seen this pattern fail in similar contexts? Your lived experience is data the model does not have. Four: what is the cost of being wrong? If reversible, try the agent's way. If irreversible, trust your gut.",
    },
    {
      type: 'code-demo',
      title: 'Override decision log',
      body: 'Track every override decision and its outcome. This calibrates your judgment over time — you learn when you were right to override and when you should have listened.',
      language: 'markdown',
      filename: 'OVERRIDE_LOG.md',
      code: "# Override Decision Log\n\n## 2026-04-28: Database choice\n- **Agent recommendation**: PostgreSQL with read replicas\n- **My override**: SQLite with Litestream replication\n- **Rationale**: Single-server deployment, <1000 concurrent users,\n  ops team is one person (me). Postgres overhead not justified.\n- **Outcome (30 days)**: Correct. Zero ops incidents. p99 latency 12ms.\n  Agent's recommendation would have added 3 services to maintain.\n\n## 2026-04-15: API design\n- **Agent recommendation**: REST with OpenAPI spec\n- **My override**: tRPC with end-to-end types\n- **Rationale**: Full-stack TypeScript, no external consumers,\n  team already knows tRPC. OpenAPI overhead adds no value here.\n- **Outcome (30 days)**: Correct. Ship velocity 2x what REST would allow.\n\n## 2026-04-02: State management\n- **Agent recommendation**: Zustand for client state\n- **My override**: React Query + URL state only\n- **Outcome (30 days)**: Partially wrong. Needed local UI state for\n  a complex form wizard. Added Zustand in week 3. Should have listened.",
    },
    {
      type: 'multiple-choice',
      question: 'All five agents recommend GraphQL for your new project. Your team has never used GraphQL, your API has 4 endpoints, and you ship in 2 weeks. What do you do?',
      options: [
        'Trust the agents — five agreeing is strong signal',
        'Override — the agents lack context about team skills, API simplicity, and timeline',
        'Ask a sixth agent for a tiebreaker',
        'Use GraphQL but generate the schema with an agent to save time',
      ],
      correctIndex: 1,
      explanation: 'The agents are recommending based on general best practice (GraphQL scales well, has great tooling). But they do not know your team has zero GraphQL experience, your API is trivial, and your deadline is immovable. These contextual constraints outweigh theoretical best practice. Override and document why.',
    },
    {
      type: 'checkpoint',
      xp: 5,
      message: 'Override criteria internalized!',
    },

    // === THE PARADOX ===
    {
      type: 'info',
      title: 'The override paradox',
      body: "Here is the tension: you need agents to be useful. If you override every recommendation, why use them? The answer is asymmetry. Agents are right 90% of the time on implementation details — how to structure a component, which API to call, how to write a test. They are wrong 30-40% of the time on architectural decisions that depend on context they cannot see. Your job is to know which category you are in. Let agents handle implementation. Override on architecture, strategy, and anything that requires context about your team, timeline, or constraints.",
    },
    {
      type: 'info',
      title: 'Confidence calibration',
      body: "Agent confidence does not correlate with correctness on novel problems. A model will state 'the best approach is X' with the same linguistic confidence whether X is well-established or a hallucinated extrapolation. You cannot use the agent's confidence level as signal. Instead, use your own confidence: if you have direct experience with the problem domain and the agent's recommendation contradicts that experience, your experience wins. If you are in unfamiliar territory and the agent cites specific, verifiable reasoning, lean toward the agent.",
    },
    {
      type: 'multiple-choice',
      question: 'You have 8 years of experience in payments systems. An agent recommends storing card tokens in a new way you have never seen. What is the right move?',
      options: [
        'Trust the agent — it may know a newer pattern you have not encountered',
        'Override immediately — your domain experience always wins',
        'Investigate the specific recommendation, but lean heavily toward your experience given the high cost of being wrong in payments',
        'Ask another agent to validate the first agent',
      ],
      correctIndex: 2,
      explanation: 'Payments is high-stakes and heavily regulated. Your 8 years of domain knowledge is critical context. But you should still evaluate the specific recommendation — maybe it IS a newer PCI-compliant pattern. The key is that your experience creates a high bar the agent must clear, not that you ignore it completely.',
    },

    // === MATCH: OVERRIDE SCENARIOS ===
    {
      type: 'match',
      instruction: 'Match each override scenario to the correct decision and reasoning:',
      leftItems: [
        'Agent picks NoSQL for relational data',
        'Agent suggests adding caching before profiling',
        'Agent recommends microservices for small team',
      ],
      rightItems: [
        'Override — relational data needs SQL',
        'Override — premature optimization',
        'Override — microservices add complexity for small teams',
      ],
      correctPairs: { 0: 0, 1: 1, 2: 2 },
      explanation: 'Each scenario represents a case where the agent optimizes for a general best practice while ignoring specific constraints. NoSQL for relational data ignores data structure needs. Caching before profiling is premature optimization. Microservices for a 3-person team adds coordination overhead that kills velocity.',
    },

    // === PROMPT-LAB: OVERRIDING WRONG ADVICE ===
    {
      type: 'prompt-lab',
      instruction: 'Write a prompt overriding an agent that confidently recommends MongoDB for an app that clearly needs relational joins. The agent is wrong — your data is highly relational (users, orders, products with many-to-many relationships). Push back with specific reasoning.',
      scenario: 'You are building an e-commerce platform with users, orders, products, categories, and reviews — all heavily interrelated. An agent recommends MongoDB because "it scales better." You know this data is deeply relational and will require complex joins for reports, dashboards, and order history. Override the agent with a clear, reasoned response.',
      starterPrompt: 'Sounds good, use MongoDB.',
      responses: [
        {
          triggerKeywords: ['PostgreSQL', 'relational', 'joins', 'foreign key', 'SQL', 'normalize', 'relationships'],
          response: 'Understood. Switching to PostgreSQL. You are right that the data model is fundamentally relational:\n\n- Users have many Orders (1:N)\n- Orders have many Products (M:N via order_items)\n- Products belong to Categories (M:N)\n- Reviews link Users to Products (M:N)\n\nMongoDB would require denormalization and application-level joins, adding complexity and inconsistency risk. PostgreSQL handles this natively with JOIN operations and foreign key constraints.\n\nI will set up PostgreSQL with proper schema, indexes on foreign keys, and migration tooling.',
          quality: 'excellent',
          feedback: 'Perfect override. You identified the specific data relationships (1:N, M:N) that make this relational, explained why MongoDB would struggle (denormalization, app-level joins), and directed the agent to the correct technology with reasoning. This is exactly how domain knowledge overrides training bias.',
        },
        {
          triggerKeywords: ['not MongoDB', 'wrong', 'no', 'disagree', 'different', 'instead'],
          response: 'I understand you prefer a different database. Could you share more about what you would like to use instead and why?',
          quality: 'good',
          feedback: 'You pushed back, which is the right instinct. But you need to be more specific. State WHY MongoDB is wrong for this use case: the data is relational (users, orders, products with foreign keys), you need JOIN operations for reports, and denormalization would cause data inconsistency. Name the alternative (PostgreSQL) and the specific reasons.',
        },
      ],
      fallbackResponse: {
        response: 'Great, I will set up MongoDB with collections for users, orders, and products. I will embed order items directly in the order documents for fast reads.',
        feedback: 'You accepted the agent\'s recommendation without pushback. This data model is deeply relational — users have orders, orders reference products, products belong to categories. MongoDB would force you to denormalize, duplicate data, and implement joins in application code. Override by specifying PostgreSQL and explaining the relational structure: foreign keys, JOIN operations, and data consistency requirements.',
      },
    },
    {
      type: 'compare',
      title: 'Deferring to agent consensus vs applying domain expertise',
      body: 'When all agents agree on MongoDB for your clearly relational data, see the difference between deferring and applying your own judgment.',
      left: {
        label: 'Deferring to Agent Consensus',
        content: 'You: "What database should I use?"\n\nAgent 1: MongoDB — scales horizontally\nAgent 2: MongoDB — flexible schema\nAgent 3: MongoDB — popular choice\n\nYou: "OK, MongoDB it is."\n\nResult after 3 months:\n- 47 aggregate pipelines replacing SQL JOINs\n- Data duplication across 6 collections\n- 3 data inconsistency bugs in production\n- Reports take 8 seconds (vs 200ms with SQL)\n- Migration to PostgreSQL costs 3 weeks',
        language: 'text',
        filename: 'deferring.txt',
      },
      right: {
        label: 'Applying Domain Expertise',
        content: 'You: "What database should I use?"\n\nAgent 1: MongoDB — scales horizontally\nAgent 2: MongoDB — flexible schema\nAgent 3: MongoDB — popular choice\n\nYou: "Override. The data is relational:\n  users -> orders -> products (JOINs).\n  Use PostgreSQL."\n\nResult after 3 months:\n- Clean normalized schema, 12 tables\n- Foreign key constraints prevent bad data\n- Zero data inconsistency bugs\n- Reports run in 180ms with indexed JOINs\n- Schema migrations are straightforward',
        language: 'text',
        filename: 'domain-expertise.txt',
      },
      question: 'Which approach leads to a better outcome for relational data?',
      correctSide: 'right',
      explanation: 'Agent consensus was wrong because all three agents drew from the same training bias (MongoDB is frequently recommended for "scale"). Your domain expertise — knowing that users, orders, and products are inherently relational — outweighs three identical recommendations. The 3-month outcome proves it: the override path has zero data inconsistency bugs and fast reports, while deferring creates 47 workaround aggregations and 3 production bugs.',
    },

    // === PRACTICAL SCENARIOS ===
    {
      type: 'info',
      title: 'Scenario: the refactor that should not happen',
      body: "Your agent fleet analyzes your codebase and recommends refactoring your authentication module. The code is ugly, uses callbacks instead of async/await, and has no tests. By every objective metric, it needs refactoring. But you know: this code has not had a bug in 18 months. It handles 50K auth requests daily. The compliance team approved this exact implementation. Refactoring introduces risk with zero user-facing benefit. The agents cannot know that stability and compliance approval are more valuable than code aesthetics here.",
    },
    {
      type: 'multiple-choice',
      question: 'Three agents recommend breaking your monolith into services. Your monolith deploys in 30 seconds, has 95% test coverage, and your team of two ships features daily. Override?',
      options: [
        'No — microservices are objectively better architecture',
        'Yes — the agents optimize for theoretical scalability, not your actual deployment velocity and team size',
        'Partially — extract one service as a test',
        'Ask the agents again with more context',
      ],
      correctIndex: 1,
      explanation: 'This is a textbook override scenario. The agents recommend microservices because that is the dominant pattern in their training data for "scaling" systems. But your system does not have a scaling problem — it has a shipping velocity advantage that microservices would destroy for a team of two.',
    },
    {
      type: 'info',
      title: 'Scenario: the technology choice that looks wrong',
      body: "You choose SQLite for a production web app. Every agent tells you this is wrong — use PostgreSQL, it scales better, it has better concurrency. But you know: your app serves 500 users, runs on a single $20/month VPS, and SQLite with WAL mode handles 10x your expected load. The operational simplicity of zero database servers, zero connection pooling, zero backup scripts (just copy a file) is worth more than theoretical scalability you will never need. The agents optimize for the general case. You optimize for YOUR case.",
    },
    {
      type: 'checkpoint',
      xp: 5,
      message: 'Scenario judgment developed!',
    },

    // === DOCUMENTING OVERRIDES ===
    {
      type: 'info',
      title: 'Why documentation matters',
      body: "Override decisions are invisible by default. Six months from now, a new team member (or you, having forgotten) will look at your SQLite choice and think it is a mistake. Without documentation, they will 'fix' it — introducing the exact complexity you avoided. Every override needs three things: what was recommended, why you overrode it, and what outcome you expect. Then revisit at 30, 60, and 90 days. This creates a feedback loop that calibrates your judgment over time.",
    },
    {
      type: 'code-demo',
      title: 'Architecture Decision Record with override context',
      body: 'ADRs are the standard format. Adding an "Agent Override" section makes the reasoning explicit and reviewable.',
      language: 'markdown',
      filename: 'docs/adr/003-database-choice.md',
      code: "# ADR-003: SQLite for production database\n\n## Status: Accepted\n\n## Context\nWe need a database for user data (~500 users, ~10K records).\n\n## Agent Recommendation\nAll consulted agents recommended PostgreSQL citing:\n- Better concurrency model\n- Broader ecosystem (extensions, tooling)\n- Industry standard for production web apps\n\n## Decision: Override — Use SQLite with WAL mode\n\n## Rationale for Override\n1. **Agents lack deployment context**: Single VPS, no container\n   orchestration, one-person ops team\n2. **Agents optimize for scale we do not have**: 500 users is\n   well within SQLite's capabilities (tested to 10K concurrent reads)\n3. **Operational simplicity**: No connection pooling, no separate\n   backup system, no version management\n4. **Cost**: $0/month vs $15-50/month for managed Postgres\n\n## Expected Outcome\n- Zero database-related ops incidents in first 6 months\n- Sub-10ms query times for all operations\n- Backup = copy one file to S3\n\n## Revisit: 2026-10-28 (6 months)\n## Escalation trigger: >2000 concurrent users OR write contention",
    },
    {
      type: 'order',
      instruction: 'Order the steps of a proper override decision process:',
      items: [
        'Revisit at 30/60/90 days to calibrate',
        'Identify the context the agent is missing',
        'Document your rationale and expected outcome',
        'Receive agent recommendation with high confidence',
        'Evaluate cost of being wrong (reversible vs irreversible)',
      ],
      correctOrder: [3, 1, 4, 2, 0],
    },

    // === CALIBRATION OVER TIME ===
    {
      type: 'info',
      title: 'Calibrating your override instinct',
      body: "Track your overrides. After 20-30 logged decisions, patterns emerge. Maybe you override correctly on infrastructure decisions 85% of the time but incorrectly on frontend architecture 60% of the time. That data tells you where your judgment is strong (keep overriding) and where it is weak (listen to agents more). The goal is not to override more or less — it is to override accurately. Your override log is your calibration instrument.",
    },
    {
      type: 'multiple-choice',
      question: 'Your override log shows you were wrong 4 out of 5 times when overriding agent recommendations about CSS architecture. What should you change?',
      options: [
        'Stop overriding entirely — agents know more than you',
        'In CSS architecture specifically, raise the bar for overriding — your instincts are miscalibrated in this domain',
        'Delete the log entries where you were wrong',
        'Ask more agents to increase confidence before overriding',
      ],
      correctIndex: 1,
      explanation: 'The log reveals a domain-specific calibration issue. You are not wrong to override in general — just in this specific domain. The fix is to trust agents more on CSS architecture while maintaining your override authority in domains where your log shows strong accuracy.',
    },
    {
      type: 'checkpoint',
      xp: 5,
      message: 'Calibration framework established!',
    },

    // === SYNTHESIS ===
    {
      type: 'info',
      title: 'The meta-skill',
      body: "Override judgment is the skill that separates an agent operator from an agent architect. Operators take what agents give them. Architects evaluate, filter, and occasionally reject — not from ego, but from hard-won context that no model can access. Your experience, your knowledge of your team, your understanding of your constraints — these are not bugs in the process. They ARE the process. The agent is a powerful advisor. You are the decision-maker. Never abdicate that role, no matter how confident the advisor sounds.",
    },
    {
      type: 'checklist',
      title: 'Override judgment checklist:',
      items: [
        'I can identify when agent consensus comes from training bias rather than independent reasoning',
        'I apply the four-question override framework before accepting or rejecting recommendations',
        'I document every override with rationale and expected outcomes',
        'I revisit override decisions to calibrate my judgment over time',
        'I know my strong and weak domains from my override log',
        'I understand the paradox: agents must be useful AND you must know when to ignore them',
      ],
    },
    {
      type: 'checkpoint',
      xp: 12,
      message: 'Override judgment mastered. You know when to trust and when to override — and you can prove it.',
    },
  ],
}

export default content
