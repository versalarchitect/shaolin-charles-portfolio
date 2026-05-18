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
      type: 'multiple-choice',
      hint: 'Read each option carefully — one fits the context best.',
      question: 'When you say "5 agents on parallel worktrees" to your engineering manager, what do they most likely hear?',
      options: [
        'An efficient way to parallelize development work',
        'Risk — unfamiliar tools, unpredictable AI, hard to debug',
        'A cost-saving measure that reduces hiring needs',
        'The future of software development',
      ],
      correctIndex: 1,
      explanation: 'Non-practitioners hear risk in unfamiliar terms. "5 agents" sounds like 5 unpredictable programs. "Worktrees" sounds like complexity. Your job is to translate: "5x development capacity with zero coordination overhead" maps to outcomes they value — ship speed, defect rate, cost per feature.',
    },

    // === THE TRANSLATION FRAMEWORK ===
    {
      type: 'interactive-diagram',
      title: 'Technical Reality to Business Value',
      body: 'Click through each stage to understand the translation pipeline from technical decisions to stakeholder-ready messaging.',
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
      stages: [
        {
          highlightNodes: ['tech'],
          highlightEdges: [],
          explanation: 'You start here: "5 agents on parallel worktrees," "CLAUDE.md per package," "module boundary enforcement." These are accurate descriptions of your architecture, but they assume the listener shares your mental model. Most stakeholders do not.',
        },
        {
          highlightNodes: ['tech', 'translate'],
          highlightEdges: [{ from: 'tech', to: 'translate' }],
          explanation: 'The translation layer is YOUR skill. For every technical choice, ask: "What outcome does this produce that my audience already cares about?" This is not dumbing down — it is connecting your work to their decision framework.',
        },
        {
          highlightNodes: ['translate', 'value'],
          highlightEdges: [{ from: 'translate', to: 'value' }],
          explanation: '"5 agents in parallel worktrees" becomes "5x development capacity with minimal coordination overhead." "CLAUDE.md per package" becomes "self-documenting architecture — any developer productive in hours." "Verification pipeline" becomes "automated quality gate catching issues before production." Same architecture. Different language. Dramatically different reception.',
        },
      ],
    },
    {
      type: 'multiple-choice',
      hint: 'Eliminate the options that only partially fit.',
      question: 'You say "module boundary enforcement via eslint rules and Nx tags." What does your engineering manager most likely hear?',
      options: [
        'A smart architectural decision that prevents cross-team conflicts',
        'More process overhead and tooling complexity that slows the team down',
        'A cost-saving measure that reduces hiring needs',
        'An innovative approach to parallel development',
      ],
      correctIndex: 1,
      explanation: 'Without translation, technical mechanisms sound like overhead to non-practitioners. "Module boundary enforcement" sounds like process bureaucracy. The same decision framed as "architectural guardrails that prevent cross-team conflicts" connects to an outcome managers already value: fewer coordination problems, fewer incidents, faster shipping.',
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'Translation framework established!',
    },

    // === COMPARE: JARGON VS BUSINESS ===
    {
      type: 'compare',
      hint: 'Look at the key differences between the two approaches.',
      title: 'Technical jargon vs Business translation',
      body: 'The same decisions, communicated two different ways. One gets funded, the other gets blank stares.',
      left: {
        label: 'Technical Jargon',
        content: '"We decoupled the monolith into\nmicroservices with an event bus"\n\n"We enforced module boundaries\nvia eslint rules and Nx tags"\n\n"We implemented strangler fig\npattern for legacy migration"\n\n"We added TypeScript strict mode\nwith zero any usage"\n\n"We deployed CLAUDE.md protocols\nper package for agent scoping"',
        language: 'text',
        filename: 'jargon.txt',
      },
      right: {
        label: 'Business Translation',
        content: '"We can now ship features\n3x faster without breaking\nunrelated parts of the app"\n\n"New team members are productive\nin hours instead of weeks"\n\n"We migrated to modern tech\nwith zero downtime and\nzero customer impact"\n\n"Our defect rate dropped 60%\nbecause errors are caught\nautomatically before release"\n\n"Development capacity scales\nwithout proportional hiring"',
        language: 'text',
        filename: 'business.txt',
      },
      question: 'Which framing would a VP of Engineering fund?',
      correctSide: 'right',
      explanation: 'Stakeholders fund outcomes, not mechanisms. "We decoupled the monolith" describes HOW. "We can ship 3x faster" describes WHY IT MATTERS. The business translation connects every technical decision to an outcome the stakeholder already cares about: speed, cost, quality, or risk reduction.',
    },

    // === CONCRETE TRANSLATIONS ===
    {
      type: 'compare',
      hint: 'Focus on what makes one approach more appropriate here.',
      title: 'Architecture proposal: technical vs stakeholder',
      body: 'The exact same architecture, written for two audiences. One gets blank stares. The other gets funded.',
      left: {
        label: 'What You Think (Technical)',
        content: '# Agent-Fleet Optimized Monorepo\n\n- Nx monorepo with enforced module boundaries\n- CLAUDE.md per package for scope + constraints\n- Task graph decomposition for parallel agents\n- Git worktrees enabling 5+ agent sessions\n- Verification pipeline: typecheck -> test -> build\n- Independent deploy pipelines per package\n- Strangler fig pattern for legacy migration\n- Agents scoped via CLAUDE.md, no cross-imports',
        language: 'text',
        filename: 'docs/architecture-internal.md',
      },
      right: {
        label: 'What They Hear (Stakeholder)',
        content: '# Scalable Development Platform\n\n- 5x feature throughput without hiring\n- 94% of defects caught before production\n- New contributors productive in hours not weeks\n- A billing change cannot break authentication\n- 2 weeks setup, zero ongoing maintenance\n- Saves ~15hrs/week of coordination overhead\n- Pilot: 3-day rebuild vs 3-week estimate\n- 0 production bugs in 45-day pilot',
        language: 'text',
        filename: 'docs/architecture-proposal.md',
      },
      question: 'Which version would a VP of Engineering approve budget for?',
      correctSide: 'right',
      explanation: 'The stakeholder version never mentions agents, CLAUDE.md, worktrees, or eslint — these are implementation details. It leads with outcomes: speed (5x), quality (94%), cost savings (15hrs/week), and evidence (pilot results). Stakeholders fund outcomes, not mechanisms.',
    },
    {
      type: 'multiple-choice',
      hint: 'Focus on the primary goal, not secondary benefits.',
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

    // === CODE-FILL: STAKEHOLDER TRANSLATION ===
    {
      type: 'code-fill',
      hint: 'Fill in values that match the pattern shown above.',
      instruction: 'Complete this stakeholder translation table by filling in the business outcome for each technical decision.',
      language: 'markdown',
      filename: 'docs/translation-table.md',
      template: '# Technical Decision → Business Outcome\n\n| Technical Decision | Business Outcome |\n|---|---|\n| Module boundary enforcement | {{boundary_outcome}} |\n| Independent deploy pipelines | {{deploy_outcome}} |\n| Automated verification pipeline | {{verify_outcome}} |\n| API versioning between services | {{version_outcome}} |\n| Self-documenting packages (CLAUDE.md) | {{docs_outcome}} |',
      blanks: [
        { id: 'boundary_outcome', answer: 'Teams work in parallel without conflicts', alternatives: ['No cross-team conflicts', 'Parallel development without coordination', 'Zero coordination overhead between teams', 'developers work independently'], placeholder: 'what business outcome?', hint: 'What happens when teams cannot step on each other?' },
        { id: 'deploy_outcome', answer: 'A billing change cannot break authentication', alternatives: ['Changes to one area cannot break another', 'Reduced blast radius of changes', 'Independent releases reduce risk', 'isolated deployments reduce risk'], placeholder: 'what business outcome?', hint: 'What happens when services deploy independently?' },
        { id: 'verify_outcome', answer: 'Defects caught before reaching production', alternatives: ['94% of bugs caught pre-merge', 'Fewer production incidents', 'Automated quality gate catches issues early', 'bugs caught automatically'], placeholder: 'what business outcome?', hint: 'What does automated checking prevent?' },
        { id: 'version_outcome', answer: 'Features ship without waiting on other teams', alternatives: ['No blocking between teams', 'Parallel feature development', 'Teams evolve at their own pace', 'independent evolution'], placeholder: 'what business outcome?', hint: 'What happens when APIs can evolve independently?' },
        { id: 'docs_outcome', answer: 'New contributors productive in hours not weeks', alternatives: ['Fast onboarding', 'Faster onboarding for new team members', 'Reduced ramp-up time', 'instant developer onboarding'], placeholder: 'what business outcome?', hint: 'What does self-documentation enable for new people?' },
      ],
      explanation: 'Each technical decision maps to a business outcome that stakeholders care about. Leading with outcomes ("teams work in parallel") instead of mechanisms ("module boundary enforcement") makes the proposal resonate with non-technical decision-makers.',
    },

    // === DEFENDING UNDER SCRUTINY ===
    {
      type: 'multiple-choice',
      hint: 'Think about which option is most specific to this concept.',
      question: 'A stakeholder asks: "How do you know agents will not introduce bugs?" What is the strongest response?',
      options: [
        'AI has gotten very good at writing code — the error rate is low',
        'Our verification pipeline caught every defect in the pilot — zero production bugs in 45 days, with 94% test coverage enforced automatically on every change',
        'We review all agent-generated code manually before merging',
        'We only use agents for simple, low-risk tasks',
      ],
      correctIndex: 1,
      explanation: 'Data beats reassurance. "AI is good" is an opinion. "Zero production bugs in 45 days with automated verification" is evidence. Stakeholders trust numbers from YOUR system, not general claims about AI capability. The verification pipeline is the answer to every quality objection.',
    },
    {
      type: 'multiple-choice',
      hint: 'Consider what the lesson content emphasized.',
      question: 'A VP pushes back: "Can we just hire more engineers instead of using AI?" What is the most compelling counter-argument?',
      options: [
        'AI is the future — we need to adopt it early',
        '5 agents cost $47/month vs $750K/year for 5 engineers, produce output 24/7, and the pilot already proved equivalent quality with zero production bugs',
        'Hiring takes too long in the current market',
        'Engineers will be replaced by AI eventually anyway',
      ],
      correctIndex: 1,
      explanation: 'The strongest response connects cost, evidence, and quality simultaneously. It is not about agents vs humans — it is about the specific ROI this approach has already demonstrated in YOUR codebase. The pilot results make the cost argument undeniable.',
    },
    {
      type: 'code-fill',
      hint: 'Use the exact syntax from the lesson examples.',
      instruction: 'Complete this evidence package that you would present before any architecture proposal meeting. Hard numbers silence theoretical objections.',
      language: 'markdown',
      filename: 'docs/pilot-results.md',
      template: '# Pilot Results: Agent-First Architecture\n\n## Scope\nRebuilt the {{pilot_module}} using the proposed architecture.\n\n## Timeline Comparison\n| Metric | Traditional (est.) | Agent-First (actual) |\n|--------|-------------------|---------------------|\n| Calendar days | 15-20 | {{calendar_days}} |\n| Developer hours | 80-120 | {{dev_hours}} (direction + review) |\n| Production bugs (30 days) | 2-4 (historical avg) | {{bug_count}} |\n\n## Cost\n- Agent compute: $47 total for entire rebuild\n- Total cost: ~$850 vs estimated ${{traditional_cost}} traditional',
      blanks: [
        { id: 'pilot_module', answer: 'billing module', alternatives: ['billing', 'billing service', 'payments module'], placeholder: 'which module?', hint: 'The module chosen for the pilot rebuild' },
        { id: 'calendar_days', answer: '3', alternatives: ['3 days', 'three'], placeholder: 'how many days?', hint: 'Dramatically fewer than the 15-20 day estimate' },
        { id: 'dev_hours', answer: '12', alternatives: ['12 hours', 'twelve'], placeholder: 'how many hours?', hint: 'Human time spent on direction and review' },
        { id: 'bug_count', answer: '0', alternatives: ['zero', 'none'], placeholder: 'how many bugs?', hint: 'The most impressive metric in the entire report' },
        { id: 'traditional_cost', answer: '8,000-12,000', alternatives: ['8000-12000', '8,000', '8000', '10,000'], placeholder: 'estimated cost?', hint: 'The traditional approach estimate range' },
      ],
      explanation: 'An evidence package with hard numbers is the single most powerful tool for defending agent-first architecture. Theory is debatable — "zero production bugs in 45 days" and "$850 vs $8,000" are not. Always run a pilot and measure results before proposing expansion.',
    },
    {
      type: 'multiple-choice',
      hint: 'One option stands out when you think about the core purpose.',
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
      type: 'multiple-choice',
      hint: 'Read each option carefully — one fits the context best.',
      question: 'Two architects propose agent-first architecture to leadership. Architect A has beautiful slides with industry benchmarks. Architect B has a rebuilt billing module that shipped in 3 days with zero bugs. Who has more credibility?',
      options: [
        'Architect A — polished presentations show professionalism',
        'Architect B — shipped results from YOUR codebase are irresistible evidence that theory and industry benchmarks cannot match',
        'Both are equally credible — it depends on the audience',
        'Neither — leadership needs to see a full migration plan first',
      ],
      correctIndex: 1,
      explanation: 'Credibility is earned in deployments, not presentations. Industry benchmarks are interesting; YOUR pilot results are undeniable. "Here is what we already shipped" beats "here is what others have done" every time. Start small, ship something, measure it, then propose expanding.',
    },
    {
      type: 'multiple-choice',
      hint: 'Eliminate the options that only partially fit.',
      question: 'What is the most important principle of the credibility ladder?',
      options: [
        'Start with a big proposal to show ambition',
        'Each step builds on proven results from the previous step — you never ask for permission based on theory alone',
        'Get leadership approval before doing anything with agents',
        'Wait until AI tools are more mature before proposing adoption',
      ],
      correctIndex: 1,
      explanation: 'The credibility ladder works because each step produces evidence that funds the next step. Personal use → small rebuild → informal sharing → formal pilot → leadership proposal → full adoption. You never ask for permission based on theory — only based on results you have already shipped.',
    },
    {
      type: 'order',
      hint: 'Consider what depends on what — prerequisites first.',
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

    // === STAKEHOLDER MATCHING ===
    {
      type: 'match',
      hint: 'Find the unique connection between each pair.',
      instruction: 'Match each stakeholder concern to the evidence type that addresses it:',
      leftItems: ['Will it break production?', 'How much will it cost?', 'When will it ship?', 'Is it worth the investment?'],
      rightItems: ['Test coverage + rollback plan', 'Time estimate + team allocation', 'Milestone timeline', 'ROI calculation with before/after metrics'],
      correctPairs: { 0: 0, 1: 1, 2: 2, 3: 3 },
      explanation: 'Each stakeholder concern maps to a specific evidence type. Production risk is addressed with test coverage and rollback plans. Cost concerns need concrete time and resource estimates. Timeline questions need milestones. Investment justification needs ROI with measurable before/after metrics. Preparing the right evidence for the right concern eliminates back-and-forth.',
    },
    {
      type: 'prompt-lab',
      hint: 'Be specific about what you want — vague prompts get vague responses.',
      instruction: 'Write a stakeholder update explaining a technical refactoring in business terms.',
      scenario: 'You spent 2 weeks refactoring a monolith into independent modules using agent-first architecture. The CTO wants to know why it took 2 weeks and what the business got for it. You need to write an update that emphasizes business outcomes, not technical details.',
      starterPrompt: 'We refactored the code.',
      responses: [
        {
          triggerKeywords: ['faster', 'deploy', 'risk', 'cost', 'outcome', 'business', 'velocity', 'independently', 'parallel'],
          response: 'Great update. Here\'s how I\'d structure the message to the CTO:\n\n**Subject: Architecture upgrade — 3x faster feature delivery, 60% fewer incidents**\n\nOver the past 2 weeks, we restructured the platform so teams can ship features independently. Key results:\n\n- **Deploy frequency**: 2x/week → 4x/day (each module deploys on its own)\n- **Incident risk**: Changes to billing can no longer break authentication (isolated blast radius)\n- **Feature velocity**: 3-5x faster development — work streams no longer block each other\n- **Cost**: $850 vs estimated $8,000 if done traditionally\n\nThe investment pays for itself within the first sprint through reduced coordination overhead alone.\n\nThis is a compelling business-first update.',
          quality: 'excellent',
          feedback: 'Excellent. You led with outcomes the CTO cares about: speed, risk reduction, and cost. The technical details (modules, agents, adapters) are invisible — the CTO sees business results. This is the translation skill that gets architecture funded.',
        },
        {
          triggerKeywords: ['module', 'refactor', 'package', 'separate', 'improve'],
          response: 'I can help draft that update. What specific metrics changed? Did deploy frequency improve? Any reduction in incidents? I\'ll need concrete numbers to make the case effectively.\n\nWhat business outcomes should I highlight?',
          quality: 'good',
          feedback: 'You recognized that metrics matter, which is better than "we refactored the code." But the prompt should already include the outcomes: deploy frequency improvement, incident reduction, cost comparison. Give the agent (or yourself) the data upfront so the update writes itself.',
        },
      ],
      fallbackResponse: {
        response: 'Here\'s the update:\n\n"We spent 2 weeks refactoring the monolith into independent packages with module boundaries enforced via eslint rules and Nx tags. Each package now has its own CLAUDE.md protocol, independent CI pipeline, and strangler fig adapters for legacy consumers. We used git worktrees for parallel agent execution and achieved 94% test coverage across all extracted modules."\n\nShall I add more technical details?',
        feedback: 'This update is technically accurate but speaks only to engineers. The CTO hears: jargon, jargon, jargon. A good stakeholder update leads with business outcomes (faster shipping, fewer incidents, lower cost) and only mentions technical mechanisms if asked. Translate "module boundaries" into "teams work independently." Translate "94% coverage" into "60% fewer production bugs."',
      },
    },

    // === COMMON STAKEHOLDER PERSONAS ===
    {
      type: 'match',
      hint: 'Match each term to its most specific definition.',
      instruction: 'Match each stakeholder role to the lead metric they care about most:',
      leftItems: ['CTO', 'VP of Engineering', 'Product Manager', 'CFO'],
      rightItems: ['Cost per feature ($8,000 to $850)', 'Feature delivery speed (3 weeks to 3 days)', 'Team productivity without proportional hiring', 'Technical risk and architectural entropy'],
      correctPairs: { 0: 3, 1: 2, 2: 1, 3: 0 },
      explanation: 'The CTO cares about technical risk and long-term maintainability. The VP of Engineering cares about team productivity and hiring costs. The Product Manager cares about feature delivery speed. The CFO cares about cost per feature. One architecture, four conversations. Prepare translations for each audience before the meeting, not during it.',
    },
    {
      type: 'code-fill',
      hint: 'Each blank follows the conventions demonstrated earlier.',
      instruction: 'Complete this audience-specific talking points document. Fill in the key metric that resonates most with each stakeholder.',
      language: 'markdown',
      filename: 'docs/talking-points.md',
      template: '# Agent-First Architecture: Audience Translations\n\n## For the CTO\n- "Enforced module boundaries reduce {{cto_concern}}"\n- "Vendor-agnostic: works with any AI or with humans"\n\n## For VP Engineering\n- "{{vp_metric}} without proportional headcount growth"\n- "New contributors productive in hours via self-documenting packages"\n\n## For Product Manager\n- "Feature X estimated at 3 weeks can ship in {{pm_timeline}}"\n- "Parallel development: features do not block each other"\n\n## For CFO\n- "$47 compute cost vs ${{cfo_comparison}} traditional development cost"',
      blanks: [
        { id: 'cto_concern', answer: 'architectural entropy', alternatives: ['technical risk', 'system complexity', 'technical debt'], placeholder: 'what does the CTO worry about?', hint: 'The gradual degradation of system architecture over time' },
        { id: 'vp_metric', answer: '5x throughput', alternatives: ['5x velocity', '5x development capacity', '5x feature throughput', '5x productivity'], placeholder: 'what multiplier?', hint: 'The headline throughput improvement from the pilot' },
        { id: 'pm_timeline', answer: '3 days', alternatives: ['3 days instead of 3 weeks', 'three days', '3d'], placeholder: 'how fast?', hint: 'The actual timeline achieved in the pilot vs 3-week estimate' },
        { id: 'cfo_comparison', answer: '8,000', alternatives: ['8000', '8,000-12,000', '8000-12000', '10,000'], placeholder: 'traditional cost?', hint: 'The traditional development cost for the same output' },
      ],
      explanation: 'Each stakeholder hears the same architecture through a different lens. Preparing audience-specific talking points before a cross-functional meeting means you never scramble to translate on the fly. The CTO hears risk reduction, the VP hears productivity, the PM hears speed, the CFO hears savings.',
    },
    {
      type: 'multiple-choice',
      hint: 'Focus on the primary goal, not secondary benefits.',
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
      type: 'compare',
      hint: 'Consider the trade-offs discussed in the lesson.',
      title: 'When they say no: arguing vs persistence',
      body: 'Two approaches when your proposal gets rejected. One burns bridges. The other builds an irresistible case over time.',
      left: {
        label: 'Arguing (Counterproductive)',
        content: '"But the data clearly shows..."\n"You are not understanding the ROI..."\n"Every competitor will adopt this..."\n"We are falling behind by not doing this..."\n\nResult:\n- Stakeholder feels pressured\n- Your credibility decreases\n- Future proposals face more skepticism\n- You become "the AI person" (not a compliment)\n- Door closes harder each time',
        language: 'text',
        filename: 'arguing.txt',
      },
      right: {
        label: 'Persistence with Evidence',
        content: '"Understood. I will keep you updated."\n\nThen quietly:\n- Keep shipping with agents personally\n- Measure every win: time saved, bugs avoided\n- Share results informally with curious peers\n- Build a bigger evidence package\n- Come back in 3 months with stronger data\n\nResult:\n- Stakeholder feels respected\n- Your credibility increases\n- Results compound and speak for themselves\n- Adoption becomes obvious, not forced\n- Door stays open',
        language: 'text',
        filename: 'persistence.txt',
      },
      question: 'Which approach gets agent-first architecture adopted long-term?',
      correctSide: 'right',
      explanation: 'Agent-first architecture will become standard. You are early, which means you face resistance that will not exist in 2 years. Your job is not to convince everyone today — it is to build such undeniable results that adoption becomes obvious. Persistence backed by data is persuasive. Arguing is not. Play the long game.',
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
