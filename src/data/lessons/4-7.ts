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
      type: 'multiple-choice',
      question: 'An agent recommends a caching strategy for your system. It does not know your SLA is 50ms, your database runs on a 2015 server with 4GB RAM, and your compliance team vetoes anything touching PII. Which failure category does this represent?',
      options: [
        'Novel problem — no one has written about this scenario',
        'Edge case in your domain — the agent lacks critical context about your specific constraints',
        'Organizational constraint — the agent cannot infer political realities',
        'Training bias — the agent is drawing from skewed data',
      ],
      correctIndex: 1,
      explanation: "Agents fail in three categories. First: novel problems where no one has written about your specific constraint set. Second: edge cases in your domain — the agent does not know your SLA, server specs, or compliance rules. Third: organizational constraints like team skills, migration budgets, and political realities. This scenario is a domain edge case: the agent's recommendation ignores hardware limitations, performance requirements, and compliance rules it was never told about.",
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
      type: 'multiple-choice',
      question: 'You are building override criteria. An agent recommends PostgreSQL read replicas but does not know your ops team is one person. Which of the four override questions does this fail?',
      options: [
        'Is the recommendation based on specific analysis of your codebase?',
        'Does the agent have access to the constraint that matters most?',
        'Have you seen this pattern fail in similar contexts?',
        'What is the cost of being wrong?',
      ],
      correctIndex: 1,
      explanation: "You need a framework, not vibes. Ask four questions. One: does the agent have access to the constraint that matters most? If you have not told it about your 4-person team or compliance requirements, its recommendation is based on incomplete data — override. Two: is the recommendation based on general best practice or specific analysis? Three: have you seen this pattern fail? Four: what is the cost of being wrong — if reversible, try the agent's way; if irreversible, trust your gut. This scenario fails question one: the agent lacks the critical constraint (one-person ops team).",
    },
    {
      type: 'code-fill',
      instruction: 'Complete this override decision log. Fill in the blanks to document each override with its rationale and outcome — this calibrates your judgment over time.',
      language: 'markdown',
      filename: 'OVERRIDE_LOG.md',
      template: '# Override Decision Log\n\n## 2026-04-28: Database choice\n- **Agent recommendation**: PostgreSQL with read replicas\n- **My override**: {{db_override}}\n- **Rationale**: Single-server deployment, <1000 concurrent users,\n  ops team is one person (me). Postgres overhead not justified.\n- **Outcome (30 days)**: {{db_outcome}}\n\n## 2026-04-15: API design\n- **Agent recommendation**: REST with OpenAPI spec\n- **My override**: {{api_override}}\n- **Rationale**: Full-stack TypeScript, no external consumers,\n  team already knows tRPC. OpenAPI overhead adds no value here.\n- **Outcome (30 days)**: Correct. Ship velocity 2x what REST would allow.',
      blanks: [
        { id: 'db_override', answer: 'SQLite with Litestream replication', alternatives: ['SQLite', 'sqlite', 'SQLite with Litestream', 'Litestream'], placeholder: 'your database choice?', hint: 'A lightweight embedded database with streaming replication' },
        { id: 'db_outcome', answer: 'Correct. Zero ops incidents. p99 latency 12ms.', alternatives: ['Correct', 'correct', 'Zero ops incidents', 'zero incidents'], placeholder: 'what happened after 30 days?', hint: 'The override was validated — zero operational issues' },
        { id: 'api_override', answer: 'tRPC with end-to-end types', alternatives: ['tRPC', 'trpc', 'tRPC with types', 'end-to-end typed RPC'], placeholder: 'your API choice?', hint: 'A TypeScript-first RPC framework with full type safety' },
      ],
      explanation: 'Tracking every override decision and its outcome calibrates your judgment over time. You learn when you were right to override (database choice, API design) and when you should have listened. The log creates a feedback loop that makes your future overrides more accurate.',
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
      type: 'compare',
      title: 'The override paradox: when to trust vs when to override',
      body: 'Agents are right 90% on implementation, wrong 30-40% on architecture. Your job is knowing which category you are in.',
      left: {
        label: 'Trust the Agent (Implementation)',
        content: 'Agent is RIGHT 90% of the time on:\n\n- How to structure a component\n- Which API to call\n- How to write a test\n- Syntax and patterns\n- Library-specific usage\n\nWhy: These are well-documented,\nwidely covered in training data.\nThe agent has seen thousands of\nexamples and can pattern-match\naccurately.\n\nYour role: accept and move fast.',
        language: 'text',
        filename: 'trust-agent.txt',
      },
      right: {
        label: 'Override the Agent (Architecture)',
        content: 'Agent is WRONG 30-40% on:\n\n- Architecture decisions\n- Technology choices for YOUR context\n- Team/timeline/constraint tradeoffs\n- Build vs buy decisions\n- When to NOT build something\n\nWhy: These depend on context the\nagent cannot see — team size, SLAs,\ncompliance, budget, political\nreality. Training data skews toward\n"best practice" not YOUR practice.\n\nYour role: evaluate and override.',
        language: 'text',
        filename: 'override-agent.txt',
      },
      question: 'When should you lean toward overriding?',
      correctSide: 'right',
      explanation: "The override paradox: you need agents to be useful, but you must know when to ignore them. The answer is asymmetry. Trust agents on implementation details. Override on architecture, strategy, and anything requiring context about your team, timeline, or constraints. Agent confidence does not correlate with correctness on novel problems — use YOUR confidence, not theirs, as the deciding signal.",
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
      type: 'multiple-choice',
      question: 'Your agent fleet recommends refactoring an ugly auth module (callbacks, no tests). But this code has had zero bugs in 18 months, handles 50K daily requests, and compliance approved this exact implementation. What do you do?',
      options: [
        'Refactor — the code quality metrics clearly show it needs improvement',
        'Override — stability and compliance approval outweigh code aesthetics when there is zero user-facing benefit to changing it',
        'Refactor but keep the old code as backup',
        'Ask the agents to add tests first, then refactor',
      ],
      correctIndex: 1,
      explanation: "The agents cannot know that stability and compliance approval are more valuable than code aesthetics here. By every objective metric the code needs refactoring — it is ugly, uses callbacks, and has no tests. But your domain knowledge tells you: 18 months of zero bugs, 50K daily requests handled reliably, and compliance has approved this exact implementation. Refactoring introduces risk with zero user-facing benefit. Override.",
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
      type: 'multiple-choice',
      question: 'You choose SQLite for a production web app. Every agent says use PostgreSQL for better scaling and concurrency. Your app serves 500 users on a $20/month VPS. SQLite with WAL handles 10x your load. Who is right?',
      options: [
        'The agents — PostgreSQL is objectively better for production',
        'You — operational simplicity (zero DB servers, zero connection pooling, backup = copy a file) outweighs theoretical scalability you will never need',
        'Compromise — use PostgreSQL but on the same VPS',
        'Neither — use a managed database service instead',
      ],
      correctIndex: 1,
      explanation: "The agents optimize for the general case. You optimize for YOUR case. Your app serves 500 users, runs on one server, and SQLite with WAL mode handles 10x your expected load. The operational simplicity of zero database servers, zero connection pooling, and backup-by-file-copy is worth more than theoretical scalability you will never need. This is a textbook override: the agents lack context about your specific constraints.",
    },
    {
      type: 'checkpoint',
      xp: 5,
      message: 'Scenario judgment developed!',
    },

    // === DOCUMENTING OVERRIDES ===
    {
      type: 'multiple-choice',
      question: 'Six months from now, a new team member sees your SQLite choice and thinks it is a mistake. Without documentation, what happens?',
      options: [
        'Nothing — they will ask you about it',
        'They "fix" it by migrating to PostgreSQL, introducing the exact complexity you avoided',
        'They improve it by adding connection pooling',
        'They write tests for the SQLite code',
      ],
      correctIndex: 1,
      explanation: "Override decisions are invisible by default. Without documentation, someone will 'fix' your intentional choice — introducing the exact complexity you avoided. Every override needs three things: what was recommended, why you overrode it, and what outcome you expect. Then revisit at 30, 60, and 90 days. This creates a feedback loop that calibrates your judgment over time.",
    },
    {
      type: 'code-fill',
      instruction: 'Complete this Architecture Decision Record. Fill in the override rationale and expected outcomes to make the reasoning explicit and reviewable.',
      language: 'markdown',
      filename: 'docs/adr/003-database-choice.md',
      template: '# ADR-003: SQLite for production database\n\n## Status: Accepted\n\n## Context\nWe need a database for user data (~500 users, ~10K records).\n\n## Agent Recommendation\nAll consulted agents recommended PostgreSQL.\n\n## Decision: Override — Use SQLite with WAL mode\n\n## Rationale for Override\n1. **Agents lack context**: {{context_gap}}\n2. **Agents optimize for scale we do not have**: {{scale_reality}}\n3. **Operational simplicity**: {{ops_benefit}}\n\n## Expected Outcome\n- {{expected_metric}}\n- Backup = copy one file to S3\n\n## Revisit: 2026-10-28 (6 months)',
      blanks: [
        { id: 'context_gap', answer: 'Single VPS, one-person ops team', alternatives: ['single server', 'one person ops', 'no container orchestration', 'single VPS, no orchestration'], placeholder: 'what context are agents missing?', hint: 'Your deployment and team constraints' },
        { id: 'scale_reality', answer: '500 users is well within SQLite capabilities', alternatives: ['500 users', 'well within SQLite limits', 'SQLite handles our scale', 'we only have 500 users'], placeholder: 'why is scale not an issue?', hint: 'Your actual user count vs SQLite capacity' },
        { id: 'ops_benefit', answer: 'No connection pooling, no separate backup system', alternatives: ['no connection pooling', 'zero operational overhead', 'no separate database server', 'no backup scripts needed'], placeholder: 'what operational complexity do you avoid?', hint: 'What infrastructure does SQLite eliminate?' },
        { id: 'expected_metric', answer: 'Zero database-related ops incidents in 6 months', alternatives: ['zero ops incidents', 'no database incidents', 'zero incidents in 6 months', 'sub-10ms query times'], placeholder: 'what measurable outcome do you expect?', hint: 'A specific metric to validate the override' },
      ],
      explanation: 'ADRs with an "Agent Override" section make your reasoning explicit and reviewable. They protect against future team members "fixing" your intentional choice, and they create a record for calibrating your override judgment over time.',
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
      type: 'multiple-choice',
      question: 'After logging 25 override decisions, you find you override correctly on infrastructure 85% of the time but incorrectly on frontend architecture 60% of the time. What does this data tell you?',
      options: [
        'You should stop overriding entirely',
        'You should override more often to build experience',
        'Your judgment is strong on infrastructure (keep overriding) and weak on frontend (listen to agents more in that domain)',
        'The agents are better at everything frontend-related',
      ],
      correctIndex: 2,
      explanation: "Track your overrides. After 20-30 logged decisions, patterns emerge. The data tells you where your judgment is strong (keep overriding) and where it is weak (listen to agents more). The goal is not to override more or less — it is to override accurately. Your override log is your calibration instrument. Domain-specific accuracy matters more than overall override frequency.",
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
      type: 'multiple-choice',
      question: 'What is the key difference between an "agent operator" and an "agent architect"?',
      options: [
        'Operators use more agents than architects',
        'Architects write better prompts than operators',
        'Operators take what agents give them; architects evaluate, filter, and occasionally reject based on hard-won context no model can access',
        'Architects build their own AI models',
      ],
      correctIndex: 2,
      explanation: "Override judgment is the meta-skill that separates operators from architects. Operators take what agents give them. Architects evaluate, filter, and occasionally reject — not from ego, but from context that no model can access. Your experience, your knowledge of your team, your understanding of your constraints — these are not bugs in the process. They ARE the process. The agent is a powerful advisor. You are the decision-maker.",
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
