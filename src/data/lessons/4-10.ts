import type { LessonContent } from './types'

const content: LessonContent = {
  lessonId: '4-10',
  steps: [
    // === INTRODUCTION ===
    {
      type: 'info',
      title: 'When to rebuild vs improve existing code',
      body: "Before agent fleets, rewrites were terrifying. Months of work. Parallel systems running simultaneously. Feature freezes on the old system while the new one catches up. That fear was justified — human-hours made rewrites expensive. With agent fleets, a rewrite that took a team 6 months might take 5 agents 2 weeks. The economics changed dramatically. But the DECISION of when to rewrite versus refactor? That still requires human judgment. Cheap rewrites do not mean every rewrite is correct.",
    },
    {
      type: 'info',
      title: 'The seduction of cheap rewrites',
      body: "When rewrites are cheap, the temptation is to rewrite everything. Legacy auth module with callbacks? Rewrite. Tangled state management? Rewrite. API layer that grew organically? Rewrite. But rewrites carry hidden costs that are not measured in agent-hours: lost institutional knowledge embedded in code comments, subtle edge cases the old code handles but nobody documented, and the integration testing burden of swapping a component that everything depends on. Cheap to BUILD does not mean cheap to DEPLOY.",
    },

    // === THE DECISION FRAMEWORK ===
    {
      type: 'interactive-diagram',
      title: 'Refactor vs Rewrite Decision Framework',
      body: 'Click through each assessment criterion to understand how it influences the decision.',
      diagram: {
        direction: 'TB',
        nodes: [
          { id: 'assess', label: 'Assess Component', sublabel: 'Gather metrics', shape: 'rounded', highlight: true },
          { id: 'coupling', label: 'Coupling Score', sublabel: 'How entangled?', shape: 'rect' },
          { id: 'coverage', label: 'Test Coverage', sublabel: 'Safety net exists?', shape: 'rect' },
          { id: 'debt', label: 'Debt Severity', sublabel: 'Structural or cosmetic?', shape: 'rect' },
          { id: 'buildability', label: 'Agent Buildability', sublabel: 'Can agents rebuild cleanly?', shape: 'rect' },
          { id: 'decision', label: 'Decision', sublabel: 'Refactor or Rewrite?', shape: 'diamond', highlight: true },
          { id: 'refactor', label: 'Refactor Path', sublabel: 'Incremental improvement', shape: 'pill' },
          { id: 'rewrite', label: 'Rewrite Path', sublabel: 'Clean replacement', shape: 'pill' },
        ],
        edges: [
          { from: 'assess', to: 'coupling' },
          { from: 'assess', to: 'coverage' },
          { from: 'assess', to: 'debt' },
          { from: 'assess', to: 'buildability' },
          { from: 'coupling', to: 'decision' },
          { from: 'coverage', to: 'decision' },
          { from: 'debt', to: 'decision' },
          { from: 'buildability', to: 'decision' },
          { from: 'decision', to: 'refactor', label: 'low coupling, high coverage' },
          { from: 'decision', to: 'rewrite', label: 'high coupling, low coverage', dashed: true },
        ],
      },
      stages: [
        {
          highlightNodes: ['assess'],
          highlightEdges: [],
          explanation: 'Start by gathering metrics for the component under evaluation. You need objective data before making the refactor-vs-rewrite decision.',
        },
        {
          highlightNodes: ['assess', 'coupling'],
          highlightEdges: [{ from: 'assess', to: 'coupling' }],
          explanation: 'Coupling score: How many other components depend on this one? High coupling (10+ dependents) favors refactoring because a rewrite requires updating every touchpoint simultaneously.',
        },
        {
          highlightNodes: ['assess', 'coverage'],
          highlightEdges: [{ from: 'assess', to: 'coverage' }],
          explanation: 'Test coverage: High coverage (80%+) favors refactoring because tests catch regressions immediately. Low coverage favors rewriting with tests from scratch.',
        },
        {
          highlightNodes: ['assess', 'debt'],
          highlightEdges: [{ from: 'assess', to: 'debt' }],
          explanation: 'Debt severity: Cosmetic debt (naming, callback style) is refactorable. Structural debt (circular dependencies, god objects) often requires a rewrite because the design itself is the problem.',
        },
        {
          highlightNodes: ['assess', 'buildability'],
          highlightEdges: [{ from: 'assess', to: 'buildability' }],
          explanation: 'Agent buildability: Can an agent rebuild from a spec? If knowledge is ONLY in the code (undocumented edge cases), rewriting means losing it. This favors refactoring.',
        },
        {
          highlightNodes: ['coupling', 'coverage', 'debt', 'buildability', 'decision'],
          highlightEdges: [{ from: 'coupling', to: 'decision' }, { from: 'coverage', to: 'decision' }, { from: 'debt', to: 'decision' }, { from: 'buildability', to: 'decision' }],
          explanation: 'All four factors feed the decision. No single factor is decisive. Low coupling + low coverage + structural debt + high buildability = rewrite. High coupling + high coverage + cosmetic debt = refactor.',
        },
        {
          highlightNodes: ['decision', 'refactor', 'rewrite'],
          highlightEdges: [{ from: 'decision', to: 'refactor' }, { from: 'decision', to: 'rewrite' }],
          explanation: 'The decision branches: refactor for incremental improvement when you have a safety net, rewrite for clean replacement when the structure itself is broken and coupling is manageable.',
        },
      ],
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'Decision framework mapped!',
    },

    // === THE METRICS ===
    {
      type: 'multiple-choice',
      question: 'An auth module is imported by 47 components, referenced by middleware, and called by 3 services via HTTP. Does this favor refactoring or rewriting?',
      options: [
        'Rewriting — start fresh with a clean implementation',
        'Refactoring — high coupling means a rewrite requires updating 47 files simultaneously, which is error-prone even with agents. The strangler fig pattern handles this better.',
        'Neither — leave it alone',
        'Rewriting with an adapter layer',
      ],
      correctIndex: 1,
      explanation: "Factor 1: Coupling score. High coupling favors refactoring because a rewrite requires updating every touchpoint simultaneously. Even with agents, coordinating 47 file changes across a rewrite is error-prone. The strangler fig pattern (refactor by gradual replacement) handles high coupling far better.",
    },
    {
      type: 'multiple-choice',
      question: 'A component has 90% test coverage but ugly code (callbacks, inconsistent naming). A different component has 10% coverage but clean architecture. Which favors refactoring vs rewriting?',
      options: [
        'Both should be refactored',
        'The 90% coverage component favors refactoring (tests catch regressions). The 10% coverage component favors rewriting (no safety net for modifications).',
        'Both should be rewritten',
        'Coverage does not matter for this decision',
      ],
      correctIndex: 1,
      explanation: "Factor 2: Test coverage. High coverage favors refactoring — the tests catch regressions immediately. An agent can make bold changes knowing tests will catch breaks. Low coverage favors rewriting: if you cannot safely modify the code, write the new version with tests from scratch.",
    },
    {
      type: 'multiple-choice',
      question: 'A module has circular dependencies and god objects (structural debt). Another has inconsistent naming and callback-style async (cosmetic debt). Which requires a rewrite?',
      options: [
        'Both need rewrites',
        'The structural debt module needs a rewrite (the design itself is the problem). The cosmetic debt module can be refactored incrementally without changing architecture.',
        'Neither needs a rewrite — both can be refactored',
        'The cosmetic one is worse because it affects readability',
      ],
      correctIndex: 1,
      explanation: "Factor 3: Debt severity. Cosmetic debt (naming, callbacks, missing types) is refactorable. Structural debt (circular dependencies, god objects, untestable design) often requires a rewrite because the structure itself is the problem. You cannot refactor a circular dependency into a clean DAG without fundamentally redesigning the module relationships.",
    },
    {
      type: 'multiple-choice',
      question: 'A component encodes years of edge-case handling learned through production incidents, documented nowhere except the code itself. Should you rewrite it?',
      options: [
        'Yes — agents can rebuild anything from a spec',
        'No — if the knowledge is ONLY in the code and cannot be extracted into a spec, rewriting means losing that knowledge. Refactor instead: keep the knowledge, improve the structure around it.',
        'Yes, but copy all the comments first',
        'Yes, if you have high test coverage',
      ],
      correctIndex: 1,
      explanation: "Factor 4: Agent buildability. Some components are pure business logic with well-defined inputs and outputs — highly agent-buildable. Others encode years of edge-case handling documented nowhere except the code. If the knowledge is ONLY in the code, rewriting means losing it. Refactoring keeps the knowledge while improving the structure.",
    },
    {
      type: 'multiple-choice',
      question: 'A payment processing module has: 12 dependents, 92% test coverage, callbacks instead of async/await, and well-documented edge cases in code comments. Refactor or rewrite?',
      options: [
        'Rewrite — callbacks are outdated and agents can build async/await versions easily',
        'Refactor — high coupling + high coverage + documented edge cases all favor incremental improvement',
        'Rewrite the internals but keep the same interface',
        'Neither — if it works, leave it alone',
      ],
      correctIndex: 1,
      explanation: 'Every factor points to refactor. High coupling (12 dependents) means a rewrite requires coordinating 12 file changes. High test coverage means you can refactor safely. Documented edge cases mean the code contains institutional knowledge that might be lost in a rewrite. The only issue (callbacks) is cosmetic and easily fixable incrementally.',
    },
    {
      type: 'checkpoint',
      xp: 5,
      message: 'Assessment factors mastered!',
    },

    // === THE STRANGLER FIG PATTERN ===
    {
      type: 'multiple-choice',
      question: 'The strangler fig pattern builds the new system around the old one. Why is it especially powerful with agent fleets?',
      options: [
        'Agents prefer incremental work',
        'Assign one agent per component replacement — five agents can strangle five components simultaneously while the old system stays live. The old system dies gracefully, not violently.',
        'Agents cannot do big rewrites',
        'The pattern was designed for AI systems',
      ],
      correctIndex: 1,
      explanation: "The strangler fig pattern — building the new system around the old one, gradually routing traffic to new components until the old system can be removed — was always the safest migration path. With agents, it is also the fastest. Assign one agent per component replacement. Each agent builds the new version, adds an adapter layer, and the old component shrinks as consumers migrate.",
    },
    {
      type: 'code-fill',
      instruction: 'Complete this strangler fig adapter. Fill in the adapter function that wraps the modern async implementation in the old callback interface.',
      language: 'typescript',
      filename: 'packages/auth/src/adapter.ts',
      template: "// Old interface (callback-based, used by 12 consumers)\nexport interface LegacyAuth {\n  authenticate(token: string, cb: (err: Error | null, user?: User) => void): void\n}\n\n// New interface (async, clean)\nexport interface ModernAuth {\n  authenticate(token: string): Promise<User>\n}\n\n// Adapter: wraps new implementation in old interface\nexport function {{adapter_name}}(modern: ModernAuth): LegacyAuth {\n  return {\n    authenticate(token, cb) {\n      modern.authenticate(token)\n        .then(user => cb({{success_args}}))\n        .catch(err => cb({{error_args}}))\n    },\n  }\n}",
      blanks: [
        { id: 'adapter_name', answer: 'createLegacyAdapter', alternatives: ['createAdapter', 'legacyAdapter', 'wrapModern'], placeholder: 'adapter function name?', hint: 'A function that creates a legacy-compatible wrapper' },
        { id: 'success_args', answer: 'null, user', alternatives: ['null, user', 'null,user'], placeholder: 'success callback args?', hint: 'Node.js callback convention: error first (null on success), then result' },
        { id: 'error_args', answer: 'err', alternatives: ['err', 'error'], placeholder: 'error callback args?', hint: 'Node.js callback convention: pass the error as first argument' },
      ],
      explanation: 'The adapter lets old consumers keep working while new consumers use the rewritten version directly. Consumers migrate at their own pace. When all consumers have switched to ModernAuth, remove the adapter and the old interface.',
    },
    {
      type: 'multiple-choice',
      question: 'The strangler fig pattern is especially powerful with agent fleets because:',
      options: [
        'Agents are better at writing adapters than humans',
        'Multiple agents can replace multiple components in parallel while the system stays live — zero downtime migration at high speed',
        'Agents prefer incremental work over big rewrites',
        'The pattern was designed for AI systems',
      ],
      correctIndex: 1,
      explanation: 'The strangler fig + agent fleets combination is powerful because each component replacement is an independent task. Five agents on five components means the migration happens in parallel. The old system runs throughout. No big-bang cutover, no feature freeze, no coordination required between the agent building the new auth and the agent building the new billing.',
    },
    {
      type: 'checkpoint',
      xp: 5,
      message: 'Strangler fig with agents — understood!',
    },

    // === STRANGLER FIG IN PRACTICE ===
    {
      type: 'code-fill',
      instruction: 'Complete this strangler fig migration plan by filling in the blanks for each step.',
      language: 'markdown',
      filename: 'docs/strangler-fig-plan.md',
      template: '# Strangler Fig Migration Plan\n\n## Step 1: Identify Target\n- Old module to wrap: {{old_module}}\n- Reason: callback-based, 12 dependents, high coupling\n\n## Step 2: Build New Module\n- New module path: {{new_module_path}}\n- Pattern: async/await, typed interfaces, independent tests\n\n## Step 3: Bridge\n- Adapter interface: {{adapter_interface}}\n- Purpose: let old consumers keep working via legacy API\n\n## Step 4: Safety Net\n- Rollback strategy: {{rollback_strategy}}\n- Ensures zero-risk cutover for each consumer',
      blanks: [
        { id: 'old_module', answer: 'LegacyAuth', alternatives: ['legacy auth', 'auth module', 'old auth', 'the auth module'], placeholder: 'which module?', hint: 'The callback-based auth module referenced in the adapter example' },
        { id: 'new_module_path', answer: 'packages/auth/src/modern-auth.ts', alternatives: ['packages/auth/src/modern.ts', 'packages/auth/modern-auth.ts', 'src/modern-auth.ts', 'packages/auth/'], placeholder: 'file path?', hint: 'Where does the new async implementation live?' },
        { id: 'adapter_interface', answer: 'createLegacyAdapter', alternatives: ['legacy adapter', 'LegacyAdapter', 'adapter function', 'createAdapter'], placeholder: 'adapter name?', hint: 'The function that wraps ModernAuth in the old callback interface' },
        { id: 'rollback_strategy', answer: 'revert to old module by removing adapter', alternatives: ['switch back to legacy', 'disable adapter', 'route back to old', 'feature flag to old module', 'revert the import'], placeholder: 'how to rollback?', hint: 'What do you do if the new module has issues?' },
      ],
      explanation: 'A strangler fig plan makes each step explicit: which module to wrap, where the new code lives, how old consumers bridge to new code, and how to rollback safely. This eliminates ambiguity for any agent or developer executing the migration.',
    },
    {
      type: 'match',
      instruction: 'Match each rebuild indicator to its recommended decision:',
      leftItems: ['Test coverage >80%', 'Test coverage <20%', 'Clear module boundaries', 'Global state everywhere'],
      rightItems: ['Safe to refactor incrementally', 'Consider full rewrite', 'Strangler fig viable', 'Rewrite likely necessary'],
      correctPairs: { 0: 0, 1: 1, 2: 2, 3: 3 },
      explanation: 'High test coverage means you can safely refactor — tests catch regressions immediately. Low coverage means a rewrite with tests from scratch may be safer. Clear boundaries make the strangler fig pattern viable. Global state means the design itself is broken and incremental improvement is nearly impossible.',
    },
    {
      type: 'code-diff',
      title: 'Before and after strangler fig wrapping',
      body: 'See how a module transforms from direct usage (tightly coupled) to adapter-wrapped usage (decoupled and migratable).',
      language: 'typescript',
      filename: 'checkout-service.ts',
      before: "// BEFORE: Direct usage — checkout is coupled to auth internals\nimport { authenticate, authorize } from '../auth/legacy-auth'\n\nasync function processCheckout(token: string, cartId: string) {\n  // Direct call — if auth changes signature, checkout breaks\n  authenticate(token, (err, user) => {\n    if (err) throw err\n    authorize(user!, 'checkout', (err, allowed) => {\n      if (err) throw err\n      if (!allowed) throw new Error('Forbidden')\n      // ... proceed with checkout\n    })\n  })\n}",
      after: "// AFTER: Adapter pattern — checkout depends on interface, not implementation\nimport type { ModernAuth } from '@shop/auth'\n\nasync function processCheckout(\n  auth: ModernAuth,\n  token: string,\n  cartId: string\n) {\n  // Clean async call — auth implementation can change freely\n  const user = await auth.authenticate(token)\n  const allowed = await auth.authorize(user, 'checkout')\n  if (!allowed) throw new Error('Forbidden')\n  // ... proceed with checkout\n}",
      question: 'What structural improvement does the adapter pattern provide?',
      explanation: 'The before version imports directly from auth internals — any signature change in auth breaks checkout. The after version depends on a typed interface (ModernAuth). The actual implementation behind that interface can be swapped (legacy adapter or new module) without changing checkout at all. This is the core power of the strangler fig: consumers migrate at their own pace.',
    },

    // === WHEN TO ACTUALLY REWRITE ===
    {
      type: 'multiple-choice',
      question: 'All four conditions must be true to justify a rewrite: (1) poorly tested, (2) well-understood business logic, (3) low coupling, (4) structural debt. A module has 92% test coverage but ugly callbacks. Should you rewrite?',
      options: [
        'Yes — callbacks are outdated',
        'No — condition 1 fails (well-tested). High coverage means you CAN safely refactor. Only rewrite when you CANNOT refactor.',
        'Yes, if agents can do it quickly',
        'It depends on coupling alone',
      ],
      correctIndex: 1,
      explanation: "Rewrite when all conditions are true: poorly tested (cannot safely refactor), well-understood logic (can be specified completely), low coupling (swap without cascading changes), and structural debt (design itself is wrong). When even one condition fails — like having high test coverage — refactoring is the better path.",
    },
    {
      type: 'multiple-choice',
      question: 'Before approving a rewrite, you must verify: can you write a complete spec capturing every edge case? You find 15 edge cases documented only as code comments, with no external spec. What does this tell you?',
      options: [
        'The code is well-documented, proceed with the rewrite',
        'You will lose behavior — if the knowledge is only in the code, rewriting from a spec will miss those 15 edge cases. Either extract the knowledge first or refactor instead.',
        'The comments are enough for the spec',
        'Edge cases do not matter in a rewrite',
      ],
      correctIndex: 1,
      explanation: "Before approving a rewrite: Can you write a complete spec that captures every edge case? If not, you will lose behavior. Do you have integration tests that validate external behavior? If not, you cannot verify equivalence. Is the component isolated enough? If not, coordination cost may exceed the benefit.",
    },
    {
      type: 'code-fill',
      instruction: 'Complete this rewrite feasibility assessment. Fill in the scoring criteria that determine whether to rewrite or refactor.',
      language: 'markdown',
      filename: 'docs/rewrite-assessment.md',
      template: '# Rewrite Feasibility: [Component Name]\n\n## Scoring (0-2 per factor, 10 max)\n\n### 1. {{factor_1}} (0-2)\nCan all behavior be specified without reading the source?\n\n### 2. {{factor_2}} (0-2)\nDo integration tests validate external behavior?\n\n### 3. {{factor_3}} (0-2)\nHow isolated is this component?\n\n## Total: ___ / 10\n- {{high_score}}: Rewrite is clearly justified\n- 5-7: Case-by-case, consider strangler fig\n- {{low_score}}: Refactor instead',
      blanks: [
        { id: 'factor_1', answer: 'Specification Completeness', alternatives: ['Spec completeness', 'specification', 'spec'], placeholder: 'first factor?', hint: 'Can you fully describe what the code does?' },
        { id: 'factor_2', answer: 'Test Safety Net', alternatives: ['test coverage', 'tests', 'test safety'], placeholder: 'second factor?', hint: 'Do tests validate behavior?' },
        { id: 'factor_3', answer: 'Coupling Level', alternatives: ['coupling', 'coupling score', 'dependencies'], placeholder: 'third factor?', hint: 'How many other components depend on this?' },
        { id: 'high_score', answer: '8-10', alternatives: ['8 to 10', '8-10 points'], placeholder: 'high score range?', hint: 'Score range that clearly justifies a rewrite' },
        { id: 'low_score', answer: '0-4', alternatives: ['0 to 4', '0-4 points'], placeholder: 'low score range?', hint: 'Score range where refactoring is better' },
      ],
      explanation: 'Run this assessment before approving any rewrite. If the score is below 7, refactor instead. The assessment forces objective evaluation rather than gut-feel decisions about technical debt.',
    },
    {
      type: 'order',
      instruction: 'Order these components from MOST justified rewrite to LEAST justified rewrite:',
      items: [
        'Auth module: 12 dependents, 92% coverage, callbacks, well-documented edge cases',
        'PDF generator: 0 dependents, 10% coverage, god object, well-understood spec',
        'API router: 30 dependents, 45% coverage, messy but functional, no spec',
        'Email service: 2 dependents, 0% coverage, simple interface, clear requirements',
        'Config parser: 8 dependents, 80% coverage, works perfectly, ugly code',
      ],
      correctOrder: [1, 3, 2, 0, 4],
    },
    {
      type: 'checkpoint',
      xp: 5,
      message: 'Rewrite criteria locked in!',
    },

    // === COMPARE: STRANGLER FIG VS BIG BANG ===
    {
      type: 'compare',
      title: 'Strangler fig vs Big bang rewrite',
      body: 'Two migration strategies with very different risk profiles and timelines.',
      left: {
        label: 'Strangler Fig (Incremental)',
        content: 'Week 1: Build new auth alongside old\nWeek 2: Route 20% of traffic to new\nWeek 3: Route 60% to new\nWeek 4: Route 100%, remove old\n\nRisk profile:\n- System stays live throughout\n- Rollback = flip traffic back\n- Bugs affect partial traffic only\n- Each step is independently verifiable\n- Old code serves as reference\n\nTimeline: 4 weeks, zero downtime\nRollback time: < 5 minutes',
        language: 'text',
        filename: 'strangler-fig.txt',
      },
      right: {
        label: 'Big Bang Rewrite',
        content: 'Week 1-3: Build entire new system\nWeek 4: Feature freeze old system\nWeek 5: Cutover weekend deploy\n\nRisk profile:\n- Old system frozen during build\n- Cutover is all-or-nothing\n- Bugs affect ALL traffic at once\n- No partial rollback possible\n- Old code diverges during freeze\n\nTimeline: 5 weeks + feature freeze\nRollback time: hours to days',
        language: 'text',
        filename: 'big-bang.txt',
      },
      question: 'Which approach is safer for production systems?',
      correctSide: 'left',
      explanation: 'The strangler fig keeps the old system running as a fallback. Traffic is gradually routed to new components. If anything breaks, you route back. The big bang rewrite requires a full cutover with no partial rollback. With agent fleets, the strangler fig is also FASTER because multiple agents can strangle multiple components simultaneously.',
    },

    // === CARRYING DEBT INTENTIONALLY ===
    {
      type: 'multiple-choice',
      question: 'An ugly-but-working auth module has no bugs, no one modifies it, and users never see its code. Should you fix it?',
      options: [
        'Yes — ugly code should always be cleaned up',
        'No — some debt is cheap to carry. The question is never "is this code perfect?" but "is fixing it worth more than the next feature I could build instead?" Carry the debt intentionally and document WHY.',
        'Yes, but only during a dedicated tech debt sprint',
        'Ask the agents to fix it during downtime',
      ],
      correctIndex: 1,
      explanation: "Not all technical debt needs to be paid. Some debt is cheap to carry: the ugly-but-working auth module costs you nothing in daily development. The code is stable, no one modifies it, and its ugliness is invisible to users. Fixing it would feel good but deliver zero business value. Carrying it intentionally — documenting WHY — is a legitimate engineering decision.",
    },
    {
      type: 'multiple-choice',
      question: 'You have a module with 400 lines of callback-based code, no tests, but rock-solid stability (zero bugs in 14 months). An agent fleet could rewrite it in 2 hours. Should you?',
      options: [
        'Yes — agent time is cheap and the new version will be cleaner',
        'No — stability is more valuable than cleanliness, and the rewrite risks introducing bugs in a component that currently has none',
        'Yes but write integration tests first to verify equivalence',
        'Only if you need to modify the module for a new feature',
      ],
      correctIndex: 3,
      explanation: 'The best answer is "only if you need to modify it." If the module is stable and unchanged, a rewrite is cost without benefit — you risk introducing bugs for aesthetic improvement. But IF you need to add a feature, the lack of tests and callback style make modification risky. At that point, rewrite (with tests) as part of the feature work.',
    },

    // === DATA-DRIVEN DECISIONS ===
    {
      type: 'multiple-choice',
      question: 'A module has 0 commits in 6 months and 0 bugs. Another has 45 commits in 6 months and 12 bugs. Which module\'s technical debt is MORE expensive to carry?',
      options: [
        'The first — zero activity means it is abandoned and risky',
        'The second — high change frequency makes debt expensive because every modification risks regressions. The first module\'s debt is free because no one touches it.',
        'Both are equally expensive',
        'Neither — debt is always worth fixing',
      ],
      correctIndex: 1,
      explanation: "Do not decide on gut feel alone. Measure change frequency: is it modified often (making debt expensive) or never (making debt free)? Also measure LOC, cyclomatic complexity, coupling, and test coverage. These numbers do not make the decision for you — but they ground the conversation in reality rather than feeling.",
    },
    {
      type: 'code-fill',
      instruction: 'Complete this module assessment script. Fill in the commands that gather the metrics you need before deciding whether to refactor or rewrite.',
      language: 'bash',
      filename: 'scripts/assess-module.sh',
      template: "#!/bin/bash\n# Quick module health assessment\nMODULE=$1\n\necho \"=== Module Assessment: $MODULE ===\"\n\n# Lines of code\necho \"LOC: $(find $MODULE -name '{{file_ext}}' | xargs wc -l | tail -1)\"\n\n# Dependents (who imports from this module)\necho \"Dependents: $(grep -r \"from.*$MODULE\" --include='{{file_ext}}' {{grep_flag}} | wc -l)\"\n\n# Change frequency (commits in last 6 months)\necho \"Commits (6mo): $(git log --since='{{time_period}}' --oneline -- $MODULE | wc -l)\"",
      blanks: [
        { id: 'file_ext', answer: '*.ts', alternatives: ['*.ts', '*.tsx', '*.js'], placeholder: 'file extension?', hint: 'The TypeScript file extension to search for' },
        { id: 'grep_flag', answer: '-l', alternatives: ['-l', '--files-with-matches'], placeholder: 'grep flag?', hint: 'Flag to list only filenames, not matching lines' },
        { id: 'time_period', answer: '6 months ago', alternatives: ['6 months', '6months ago', '180 days ago'], placeholder: 'time period?', hint: 'How far back to look for change frequency' },
      ],
      explanation: 'Use agents to gather these metrics before making any refactor-vs-rewrite decision. Data first, then judgment. LOC shows disproportionate size. Dependents show coupling. Commit frequency shows whether debt is expensive or free to carry.',
    },
    {
      type: 'checkpoint',
      xp: 5,
      message: 'Data-driven decision making — complete!',
    },

    // === SYNTHESIS ===
    {
      type: 'multiple-choice',
      question: 'Agent fleets make both refactoring and rewriting cheaper. Does this make the decision between them easier or harder?',
      options: [
        'Easier — just try both and pick the winner',
        'Harder — when execution is cheap, the wrong decision costs integration failures, lost edge cases, and deployment risk. Your judgment about WHICH path is more valuable than the ability to execute either.',
        'Irrelevant — always rewrite when it is cheap',
        'Easier — agents will tell you which to choose',
      ],
      correctIndex: 1,
      explanation: "Agent fleets make both refactoring and rewriting cheaper. That does not make the decision any easier — it makes it MORE important. When execution is cheap, the wrong decision costs integration failures, lost edge cases, and deployment risk — not saved hours. The execution is commoditized. The decision is not.",
    },
    {
      type: 'checklist',
      title: 'Refactor vs Rewrite assessment checklist:',
      items: [
        'I assess coupling, coverage, debt severity, and agent-buildability before deciding',
        'I use the strangler fig pattern for high-coupling components',
        'I only approve rewrites when specification is complete and coupling is low',
        'I carry debt intentionally when fixing it delivers no user value',
        'I gather metrics (LOC, complexity, change frequency) before making decisions',
        'I understand that cheap execution makes the DECISION more important, not less',
      ],
    },
    {
      type: 'checkpoint',
      xp: 7,
      message: 'Refactor vs Rewrite mastered. You make data-driven decisions about technical debt in an agent-first world.',
    },
  ],
}

export default content
