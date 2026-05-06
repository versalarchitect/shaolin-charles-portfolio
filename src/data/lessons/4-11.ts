import type { LessonContent } from './types'

const content: LessonContent = {
  lessonId: '4-11',
  steps: [
    // === INTRODUCTION ===
    {
      type: 'info',
      title: 'Explaining AI-first architecture to your team',
      body: "You have internalized agent-first development. You think in task graphs, worktrees, CLAUDE.md protocols, and verification pipelines. But when you present architecture proposals to stakeholders — engineering managers, CTOs, product leads — they think in engineer-hours, sprint capacity, and team velocity. If you explain your architecture in YOUR terms, they will not understand it, will not fund it, and will not support it. Translation is not dumbing down. It is connecting your technical reality to their decision framework.",
    },
    {
      type: 'info',
      title: 'The translation problem',
      body: "When you say '5 agents on parallel worktrees,' your manager hears risk. When you say 'CLAUDE.md protocols for every package,' they hear process overhead. When you say 'agent-buildable module boundaries,' they hear over-engineering. None of these interpretations are correct — but they are reasonable given the listener's mental model. Your job is to present the same architecture using language that maps to outcomes they already value: ship speed, defect rate, cost per feature, and team scalability.",
    },

    // === THE TRANSLATION FRAMEWORK ===
    {
      type: 'diagram',
      title: 'Technical Reality to Business Value',
      body: 'Every technical choice must connect to an outcome stakeholders care about.',
      diagram: {
        direction: 'LR',
        nodes: [
          { id: 'tech', label: 'Technical Reality', sublabel: 'How it actually works', shape: 'rect' },
          { id: 'translate', label: 'Translation Layer', sublabel: 'Your communication skill', shape: 'diamond', highlight: true },
          { id: 'value', label: 'Business Value', sublabel: 'What stakeholders hear', shape: 'rounded', highlight: true },
        ],
        edges: [
          { from: 'tech', to: 'translate' },
          { from: 'translate', to: 'value' },
        ],
      },
    },
    {
      type: 'info',
      title: 'The translation table',
      body: "Every agent-first concept has a business translation. '5 agents in parallel worktrees' becomes '5x development capacity with minimal coordination overhead.' 'CLAUDE.md per package' becomes 'self-documenting architecture that enables any developer to contribute immediately.' 'Module boundary enforcement' becomes 'architectural guardrails that prevent cross-team conflicts.' 'Verification pipeline' becomes 'automated quality gate that catches issues before they reach production.' Same architecture. Different language. Dramatically different reception.",
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'Translation framework established!',
    },

    // === CONCRETE TRANSLATIONS ===
    {
      type: 'code-demo',
      title: 'Architecture proposal: technical version (what you think)',
      body: 'This is how you might describe the architecture to yourself or another agent-first practitioner. Accurate, but impenetrable to most stakeholders.',
      language: 'markdown',
      filename: 'docs/architecture-internal.md',
      code: "# Architecture: Agent-Fleet Optimized Monorepo\n\n## Design\n- Nx monorepo with enforced module boundaries via eslint\n- CLAUDE.md per package defining scope, constraints, and verification\n- Task graph decomposition for parallel agent execution\n- Git worktrees enabling 5+ simultaneous agent sessions\n- Automated verification pipeline: typecheck → test → build per package\n\n## Deployment\n- Independent deploy pipelines per package\n- API versioning enabling parallel evolution\n- Strangler fig pattern for legacy migration\n\n## Agent Protocol\n- Each agent scoped to single package via CLAUDE.md\n- No cross-package imports except @repo/shared-types\n- Agents self-verify via package-level test + build",
    },
    {
      type: 'code-demo',
      title: 'Architecture proposal: stakeholder version (what they hear)',
      body: 'Same architecture, translated for engineering leadership. Focuses on outcomes, cost, and risk reduction.',
      language: 'markdown',
      filename: 'docs/architecture-proposal.md',
      code: "# Architecture Proposal: Scalable Development Platform\n\n## Business Case\nOur current architecture requires manual coordination between developers\nworking on related features. This proposal eliminates coordination overhead\nthrough architectural boundaries, enabling parallel development at 3-5x\ncurrent velocity.\n\n## Key Outcomes\n- **Ship velocity**: 5x feature throughput without hiring\n- **Quality**: Automated verification catches 94% of defects pre-merge\n- **Onboarding**: New contributors productive in hours, not weeks\n  (self-documenting packages with clear scope definitions)\n- **Risk reduction**: Independent packages deploy independently —\n  a billing change cannot break authentication\n\n## Cost\n- 2 weeks initial setup (package boundaries + CI pipelines)\n- Zero ongoing maintenance — boundaries are enforced by tooling\n- Net savings: eliminates ~15hrs/week of cross-team coordination\n\n## Evidence\n- Pilot: billing module rebuilt in 3 days (previously estimated 3 weeks)\n- Defect rate in pilot: 0 production bugs in 45 days\n- Deploy frequency in pilot: 4x daily vs 2x weekly",
    },
    {
      type: 'multiple-choice',
      question: 'The stakeholder version never mentions "agents," "CLAUDE.md," or "worktrees." Why?',
      options: [
        'Because stakeholders would not approve AI-related expenses',
        'Because those are implementation details — stakeholders care about outcomes (speed, quality, cost), not mechanisms',
        'Because mentioning AI makes the proposal seem risky',
        'Because the technical version is wrong',
      ],
      correctIndex: 1,
      explanation: 'Stakeholders make decisions based on outcomes: will this make us faster, cheaper, or better? HOW you achieve those outcomes is an implementation detail they trust you to handle. Leading with mechanisms ("agents in worktrees") forces them to evaluate a paradigm they do not understand. Leading with outcomes ("5x velocity") lets them evaluate on criteria they DO understand.',
    },
    {
      type: 'checkpoint',
      xp: 5,
      message: 'Translation skill developing!',
    },

    // === DEFENDING UNDER SCRUTINY ===
    {
      type: 'info',
      title: 'The questions you will face',
      body: "Stakeholders will push back. 'How do you know agents will not introduce bugs?' Show your verification pipeline results — zero production defects in the pilot. 'What if the AI makes a mistake?' Show your override log and the human review gate. 'Is this just a fad?' Show your deployment frequency before and after. 'Can we hire instead?' Show the cost comparison: 5 agents cost less per month than one junior engineer, produce output 24/7, and require zero management overhead. Every objection has a data-backed answer.",
    },
    {
      type: 'info',
      title: 'Show shipped results, not theory',
      body: "The single most powerful defense is: it already works. Before proposing agent-first architecture to leadership, run a pilot. Build one feature with agents, measure the results, and present the EVIDENCE. 'Here is what we shipped last week using this approach. It took 3 days instead of 3 weeks. Zero bugs in production. Here is the commit history showing 5 parallel streams of work.' Theory is debatable. Shipped software is not.",
    },
    {
      type: 'code-demo',
      title: 'Evidence package for stakeholder review',
      body: 'Prepare this before any architecture proposal meeting. Hard numbers silence theoretical objections.',
      language: 'markdown',
      filename: 'docs/pilot-results.md',
      code: "# Pilot Results: Agent-First Architecture\n\n## Scope\nRebuilt the billing module using the proposed architecture.\n\n## Timeline Comparison\n| Metric | Traditional (est.) | Agent-First (actual) |\n|--------|-------------------|---------------------|\n| Calendar days | 15-20 | 3 |\n| Developer hours | 80-120 | 12 (direction + review) |\n| PRs merged | 8-12 | 23 (small, focused) |\n| Production bugs (30 days) | 2-4 (historical avg) | 0 |\n\n## Quality Metrics\n- Test coverage: 94% (vs 67% team average)\n- Type safety: strict mode, zero `any` usage\n- Build time: 8s (vs 45s for legacy module)\n\n## Cost\n- Agent compute: $47 total for entire rebuild\n- Human time: 12 hours @ blended rate\n- Total cost: ~$850 vs estimated $8,000-12,000 traditional\n\n## What This Means at Scale\nIf we apply this to remaining 8 modules:\n- Estimated 6 weeks total (vs 6+ months traditional)\n- Cost: ~$7,000 (vs ~$80,000 traditional)\n- Result: Modern, tested, documented, independently deployable",
    },
    {
      type: 'multiple-choice',
      question: 'A VP asks: "What happens if Claude goes down? Are we dependent on a single AI vendor?" Best response?',
      options: [
        'Claude never goes down — Anthropic has excellent uptime',
        'The architecture we built is vendor-agnostic — the module boundaries, test suites, and deployment pipelines work with any AI assistant or with human developers. We chose the best tool today but are not locked in.',
        'We could switch to GPT-4 if needed',
        'AI downtime is rare and we can just wait',
      ],
      correctIndex: 1,
      explanation: 'This reframes the concern positively: the architecture itself is the value, not the specific AI tool. Module boundaries help any developer (human or AI). Tests validate any author\'s work. Deployment pipelines are tool-agnostic. You acknowledge the concern, show you have thought about it, and demonstrate that the architectural decisions have value independent of any specific AI vendor.',
    },
    {
      type: 'checkpoint',
      xp: 5,
      message: 'Defense under scrutiny — prepared!',
    },

    // === BUILDING CREDIBILITY ===
    {
      type: 'info',
      title: 'Credibility is earned in deployments',
      body: "No amount of presentation skill replaces results. The architect who deploys daily with zero rollbacks has more credibility than the architect with beautiful slides. Your credibility in proposing agent-first architecture comes from demonstrating it works in YOUR context, with YOUR codebase, under YOUR constraints. Start small. Ship something. Measure it. Then propose expanding. The proposal backed by 'here is what we already shipped' is irresistible.",
    },
    {
      type: 'info',
      title: 'The credibility ladder',
      body: "Step 1: Use agents personally for your own tasks. Notice the velocity increase. Step 2: Rebuild one small component using agent-first principles. Measure results. Step 3: Share results informally with your team. Let curiosity build. Step 4: Propose a formal pilot on a medium-sized project. Step 5: Present pilot results to leadership with the evidence package. Step 6: Propose full architecture adoption. Each step builds on proven results from the previous step. You never ask for permission based on theory alone.",
    },
    {
      type: 'order',
      instruction: 'Order the credibility-building steps from first to last:',
      items: [
        'Propose full architecture adoption to leadership',
        'Rebuild one component with agents, measure results',
        'Present pilot results with evidence package',
        'Use agents personally, notice velocity gains',
        'Run a formal pilot on a medium project',
      ],
      correctOrder: [3, 1, 4, 2, 0],
    },

    // === COMMON STAKEHOLDER PERSONAS ===
    {
      type: 'info',
      title: 'Know your audience',
      body: "Different stakeholders need different translations. The CTO cares about technical risk and long-term maintainability. The VP of Engineering cares about team productivity and hiring costs. The Product Manager cares about feature delivery speed. The CFO cares about cost per feature. One architecture, four conversations. Prepare translations for each audience before the meeting, not during it.",
    },
    {
      type: 'code-demo',
      title: 'Audience-specific talking points',
      body: 'Same architecture, four different framings. Prepare all four before any cross-functional meeting.',
      language: 'markdown',
      filename: 'docs/talking-points.md',
      code: "# Agent-First Architecture: Audience Translations\n\n## For the CTO\n- \"Enforced module boundaries reduce architectural entropy\"\n- \"Independent deployment reduces blast radius of any single change\"\n- \"We are building on standard patterns (monorepo, CI/CD) with better enforcement\"\n- \"Vendor-agnostic: the architecture works with any AI or with humans\"\n\n## For VP Engineering\n- \"5x throughput without proportional headcount growth\"\n- \"New contributors are productive in hours due to self-documenting packages\"\n- \"15 hours/week coordination overhead eliminated by architectural boundaries\"\n- \"Pilot team shipping 4x daily vs org average of 2x weekly\"\n\n## For Product Manager\n- \"Feature X that was estimated at 3 weeks can ship in 3 days\"\n- \"Parallel development: features do not block each other\"\n- \"Faster iteration: we can try 5 approaches in the time 1 used to take\"\n- \"Quality maintained: zero production bugs in 45-day pilot\"\n\n## For CFO\n- \"$47 compute cost vs $8,000 traditional development cost for same output\"\n- \"Hiring 5 engineers = $750K/year. Agent fleet = ~$5K/year for equivalent output\"\n- \"Reduced coordination overhead = fewer meetings = more build time\"\n- \"Lower defect rate = less emergency response cost\"",
    },
    {
      type: 'multiple-choice',
      question: 'You are presenting to the CFO. Which metric do you lead with?',
      options: [
        'Test coverage improvement (67% to 94%)',
        'Deploy frequency (2x weekly to 4x daily)',
        'Cost per feature reduction ($8,000 to $850)',
        'Module boundary enforcement rate',
      ],
      correctIndex: 2,
      explanation: 'The CFO thinks in dollars. Lead with the metric that speaks their language: cost per feature. The other metrics are supporting evidence (quality and velocity improvements justify the cost claim) but the headline that captures CFO attention is the 10x cost reduction.',
    },
    {
      type: 'checkpoint',
      xp: 5,
      message: 'Stakeholder communication mastered!',
    },

    // === HANDLING RESISTANCE ===
    {
      type: 'info',
      title: 'When they say no',
      body: "Sometimes the answer is no. Maybe the organization is not ready. Maybe there is a hiring freeze that makes 'replace hiring with agents' politically toxic. Maybe the VP had a bad experience with AI-generated code. When the answer is no: do not argue. Say 'understood.' Then keep shipping with agents personally. Keep building your evidence. Bring it back in 3 months with even stronger results. Persistence backed by data is persuasive. Arguing is not.",
    },
    {
      type: 'info',
      title: 'The long game',
      body: "Agent-first architecture will become standard. You are early. Being early means you face resistance that will not exist in 2 years. Your job is not to convince everyone today — it is to build such undeniable results that adoption becomes obvious. Every feature you ship with agents, every bug you avoid through verification pipelines, every deadline you beat through parallel execution — these compound into a case that makes itself. Play the long game.",
    },

    // === SYNTHESIS ===
    {
      type: 'checklist',
      title: 'Stakeholder communication checklist:',
      items: [
        'I translate technical mechanisms into business outcomes',
        'I prepare evidence packages with hard metrics before proposing',
        'I run pilots first and propose expansion based on results',
        'I tailor messaging to each audience (CTO, VP, PM, CFO)',
        'I defend decisions with shipped results, not theory',
        'I handle "no" with patience and continued evidence-building',
        'I follow the credibility ladder: personal use → pilot → proposal',
      ],
    },
    {
      type: 'checkpoint',
      xp: 12,
      message: 'Communication mastered. You can architect for agents AND bring stakeholders along for the journey.',
    },
  ],
}

export default content
