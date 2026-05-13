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
      type: 'info',
      title: 'Factor 1: Coupling score',
      body: "How many other components depend on this one? A utility function used in 3 places can be rewritten trivially — swap the import, done. An auth module that 47 components import, that middleware references, that 3 services call via HTTP — that is high coupling. High coupling favors refactoring because a rewrite requires updating every touchpoint simultaneously. Even with agents, coordinating 47 file changes across a rewrite is error-prone. The strangler fig pattern (refactor by gradual replacement) handles high coupling far better.",
    },
    {
      type: 'info',
      title: 'Factor 2: Test coverage',
      body: "High test coverage favors refactoring. If the component has 90% coverage, you can refactor aggressively — the tests catch regressions immediately. An agent can make bold changes knowing the test suite will scream if something breaks. Conversely, low test coverage favors rewriting: if you cannot safely modify the code (no tests to validate behavior), it may be better to write the new version with tests from scratch rather than trying to add tests to code you do not fully understand.",
    },
    {
      type: 'info',
      title: 'Factor 3: Debt severity',
      body: "Is the debt structural or cosmetic? Cosmetic debt — inconsistent naming, callback-style async, missing types — is refactorable. An agent can modernize the code without changing its architecture. Structural debt — circular dependencies, god objects, violation of every SOLID principle, impossibility of testing in isolation — often requires a rewrite because the structure itself is the problem. You cannot refactor a circular dependency into a clean DAG without fundamentally redesigning the module relationships.",
    },
    {
      type: 'info',
      title: 'Factor 4: Agent buildability',
      body: "Can an agent rebuild this from a clear spec? Some components are pure business logic with well-defined inputs and outputs — highly agent-buildable. Others encode years of edge-case handling learned through production incidents — documented nowhere except the code itself. If the knowledge is ONLY in the code and cannot be extracted into a spec, rewriting means losing that knowledge. This favors refactoring: keep the knowledge, improve the structure around it.",
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
      type: 'info',
      title: 'The strangler fig with agents',
      body: "The strangler fig pattern — building the new system around the old one, gradually routing traffic to new components until the old system can be removed — was always the safest migration path. With agents, it is also the fastest. Assign one agent per component replacement. Each agent builds the new version, adds an adapter layer, and the old component shrinks as consumers migrate. Five agents can strangle five components simultaneously. The old system dies gracefully, not violently.",
    },
    {
      type: 'code-demo',
      title: 'Strangler fig adapter pattern',
      body: 'The adapter lets old consumers keep working while new consumers use the rewritten version directly. Agents can build both paths in parallel.',
      language: 'typescript',
      filename: 'packages/auth/src/adapter.ts',
      code: "// Old interface (callback-based, used by 12 consumers)\nexport interface LegacyAuth {\n  authenticate(token: string, cb: (err: Error | null, user?: User) => void): void\n  authorize(user: User, permission: string, cb: (err: Error | null, allowed?: boolean) => void): void\n}\n\n// New interface (async, clean)\nexport interface ModernAuth {\n  authenticate(token: string): Promise<User>\n  authorize(user: User, permission: string): Promise<boolean>\n}\n\n// Adapter: wraps new implementation in old interface\n// Consumers migrate at their own pace\nexport function createLegacyAdapter(modern: ModernAuth): LegacyAuth {\n  return {\n    authenticate(token, cb) {\n      modern.authenticate(token)\n        .then(user => cb(null, user))\n        .catch(err => cb(err))\n    },\n    authorize(user, permission, cb) {\n      modern.authorize(user, permission)\n        .then(allowed => cb(null, allowed))\n        .catch(err => cb(err))\n    },\n  }\n}\n\n// Migration tracker: when all consumers use ModernAuth directly,\n// remove the adapter and the old interface\nexport const migrationStatus = {\n  totalConsumers: 12,\n  migratedToModern: 7, // Update as consumers switch\n  remainingLegacy: 5,\n}",
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

    // === WHEN TO ACTUALLY REWRITE ===
    {
      type: 'info',
      title: 'When rewriting IS the right call',
      body: "Rewrite when all of these are true: (1) the component is poorly tested so you cannot safely refactor, (2) the business logic is well-understood and can be specified completely, (3) the coupling is low enough to swap without cascading changes, and (4) the structural debt makes incremental improvement impossible — the whole design is wrong, not just the code style. When these four align, a rewrite is faster, safer, and produces a better outcome than trying to fix what cannot be fixed incrementally.",
    },
    {
      type: 'info',
      title: 'The rewrite checklist',
      body: "Before approving a rewrite: Can you write a complete spec that captures every edge case the old code handles? If not, you will lose behavior. Do you have integration tests that validate external behavior regardless of internal implementation? If not, you cannot verify the rewrite is equivalent. Is the component isolated enough that swapping it does not require changes to more than 3 other files? If not, the coordination cost may exceed the rewrite benefit.",
    },
    {
      type: 'code-demo',
      title: 'Rewrite feasibility assessment',
      body: 'Run this assessment before approving any rewrite. If you score below 7, refactor instead.',
      language: 'markdown',
      filename: 'docs/rewrite-assessment.md',
      code: "# Rewrite Feasibility: [Component Name]\n\n## Scoring (0-2 per factor, 10 max)\n\n### 1. Specification Completeness (0-2)\nCan all behavior be specified without reading the source?\n- 0: Behavior is only documented in the code itself\n- 1: Partial spec exists, some edge cases undocumented\n- 2: Complete spec with all edge cases captured\nScore: ___\n\n### 2. Test Safety Net (0-2)\nDo integration tests validate external behavior?\n- 0: No tests or only unit tests of internals\n- 1: Some integration tests, incomplete coverage\n- 2: Full integration suite testing all external contracts\nScore: ___\n\n### 3. Coupling Level (0-2)\nHow isolated is this component?\n- 0: >10 direct dependents, deeply integrated\n- 1: 4-10 dependents, moderate integration\n- 2: <4 dependents, clear interface boundary\nScore: ___\n\n### 4. Structural Severity (0-2)\nIs the problem structural or cosmetic?\n- 0: Cosmetic only (naming, style, async patterns)\n- 1: Mixed (some structural issues, some cosmetic)\n- 2: Fundamental (circular deps, god object, untestable)\nScore: ___\n\n### 5. Agent Buildability (0-2)\nCan an agent rebuild this from a spec?\n- 0: Requires tribal knowledge not in any document\n- 1: Mostly specifiable, some implicit knowledge\n- 2: Pure logic, fully specifiable, no hidden context\nScore: ___\n\n## Total: ___ / 10\n- 8-10: Rewrite is clearly justified\n- 5-7: Case-by-case, consider strangler fig\n- 0-4: Refactor instead",
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
      type: 'info',
      title: 'When debt is worth carrying',
      body: "Not all technical debt needs to be paid. Some debt is cheap to carry: the ugly-but-working auth module costs you nothing in daily development. The code is stable. No one modifies it. Its ugliness is invisible to users. Fixing it would feel good but deliver zero business value. Carrying it intentionally — documenting WHY you are not fixing it — is a legitimate engineering decision. The question is never 'is this code perfect?' It is 'is fixing this code worth more than the next feature I could build instead?'",
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
      type: 'info',
      title: 'Metrics that inform the decision',
      body: "Do not decide on gut feel alone. Measure: Lines of code (is the module disproportionately large for what it does?). Cyclomatic complexity (are there too many branches to reason about?). Coupling (how many other modules import from it?). Change frequency (is it modified often, making debt expensive, or never, making debt free?). Test coverage (can you safely modify it?). These numbers do not make the decision for you — but they ground the conversation in reality rather than feeling.",
    },
    {
      type: 'code-demo',
      title: 'Quick assessment script',
      body: 'Use agents to gather these metrics before making any refactor-vs-rewrite decision. Data first, then judgment.',
      language: 'bash',
      filename: 'scripts/assess-module.sh',
      code: "#!/bin/bash\n# Quick module health assessment\nMODULE=$1\n\necho \"=== Module Assessment: $MODULE ===\"\necho \"\"\n\n# Lines of code\necho \"LOC: $(find $MODULE -name '*.ts' | xargs wc -l | tail -1)\"\n\n# Number of files\necho \"Files: $(find $MODULE -name '*.ts' | wc -l)\"\n\n# Dependents (who imports from this module)\necho \"Dependents: $(grep -r \"from.*$MODULE\" --include='*.ts' -l | wc -l)\"\n\n# Test coverage (if coverage report exists)\nif [ -f coverage/lcov.info ]; then\n  echo \"Coverage: $(grep -A 3 \"$MODULE\" coverage/lcov.info | grep 'LF\\|LH' | head -2)\"\nfi\n\n# Change frequency (commits in last 6 months)\necho \"Commits (6mo): $(git log --since='6 months ago' --oneline -- $MODULE | wc -l)\"\n\n# Complexity (if ts-complexity available)\nif command -v npx &> /dev/null; then\n  echo \"Complexity: run 'npx ts-complexity $MODULE' for details\"\nfi",
    },
    {
      type: 'checkpoint',
      xp: 5,
      message: 'Data-driven decision making — complete!',
    },

    // === SYNTHESIS ===
    {
      type: 'info',
      title: 'The decision is the value',
      body: "Agent fleets make both refactoring and rewriting cheaper. That does not make the decision between them any easier — it makes it MORE important. When execution is cheap, the wrong decision costs you integration failures, lost edge cases, and deployment risk — not saved hours. Your judgment about WHICH path to take is more valuable than the ability to execute either path. The execution is commoditized. The decision is not.",
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
