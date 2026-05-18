import type { LessonContent } from './types'

const content: LessonContent = {
  lessonId: '4-5',
  steps: [
    // === INTRODUCTION ===
    {
      type: 'info',
      title: 'Analyzing existing systems for AI-readiness',
      body: "Take any production system — an e-commerce platform, a SaaS product, an internal tool. Now ask one question: could a coordinated agent fleet build and maintain this? Not \"could an agent write some of the code\" — but could agents own it end-to-end? Build new features in parallel. Fix bugs without breaking unrelated modules. Extend it without tribal knowledge. The Teardown Methodology gives you a systematic way to answer this question and produce an actionable redesign proposal.",
    },
    {
      type: 'multiple-choice',
      hint: 'Read each option carefully — one fits the context best.',
      question: 'Why do most production systems need a teardown before agents can effectively build and maintain them?',
      options: [
        'The code is too old and needs to be rewritten',
        'They were designed for human teams — relying on tribal knowledge, implicit conventions, and shared mental models that agents cannot access',
        'Agents cannot read large codebases',
        'The programming language is not AI-compatible',
      ],
      correctIndex: 1,
      explanation: 'Most production systems were designed for human teams — they rely on tribal knowledge, implicit conventions, and shared mental models that agents cannot access. The Teardown reveals exactly where these human-dependent assumptions live and gives you a concrete plan to eliminate them. The output is not a rewrite — it is a targeted set of changes that transform a human-native system into an agent-native one.',
    },

    // === THE METHODOLOGY ===
    {
      type: 'interactive-diagram',
      title: 'The Teardown Methodology',
      body: 'Walk through each phase, understanding what it produces and how they connect.',
      diagram: {
        direction: 'LR',
        nodes: [
          { id: 'map', label: 'Phase 1: Map', sublabel: 'Component inventory', shape: 'rounded' },
          { id: 'score', label: 'Phase 2: Score', sublabel: 'Agent-buildability per component', shape: 'rounded' },
          { id: 'blockers', label: 'Phase 3: Blockers', sublabel: 'What prevents agent work', shape: 'rounded' },
          { id: 'redesign', label: 'Phase 4: Redesign', sublabel: 'Targeted improvements', shape: 'rounded', highlight: true },
        ],
        edges: [
          { from: 'map', to: 'score' },
          { from: 'score', to: 'blockers' },
          { from: 'blockers', to: 'redesign' },
        ],
      },
      stages: [
        {
          highlightNodes: ['map'],
          explanation: 'Phase 1: Map every component — document responsibility, dependencies, dependents, and data stores. Output: a complete component inventory with dependency graph.',
        },
        {
          highlightNodes: ['map', 'score'],
          highlightEdges: [{ from: 'map', to: 'score' }],
          explanation: 'Phase 2: Score each component on 5 factors (1-5 each): Boundaries, Patterns, Contracts, Knowledge, Isolation. Total 5-25. Below 10 = agent-hostile.',
        },
        {
          highlightNodes: ['score', 'blockers'],
          highlightEdges: [{ from: 'score', to: 'blockers' }],
          explanation: 'Phase 3: For each low-scoring component, identify specific actionable blockers — not "it is complex" but "order files split across 4 directories." Each blocker becomes a fix task.',
        },
        {
          highlightNodes: ['blockers', 'redesign'],
          highlightEdges: [{ from: 'blockers', to: 'redesign' }],
          explanation: 'Phase 4: Propose targeted fixes prioritized by impact. Boundary fixes unlock findability. Contract fixes unlock parallelism. Knowledge fixes unlock autonomy. Output: actionable redesign plan with effort estimates.',
        },
      ],
    },
    {
      type: 'interactive-diagram',
      title: 'The Teardown Methodology',
      body: 'Walk through all four phases of the teardown, understanding what each phase produces and how they connect.',
      diagram: {
        direction: 'LR',
        nodes: [
          { id: 'map', label: 'Phase 1: Map', sublabel: 'Component inventory', shape: 'rounded' },
          { id: 'score', label: 'Phase 2: Score', sublabel: 'Agent-buildability per component', shape: 'rounded' },
          { id: 'blockers', label: 'Phase 3: Blockers', sublabel: 'What prevents agent work', shape: 'rounded' },
          { id: 'redesign', label: 'Phase 4: Redesign', sublabel: 'Targeted improvements', shape: 'rounded', highlight: true },
        ],
        edges: [
          { from: 'map', to: 'score' },
          { from: 'score', to: 'blockers' },
          { from: 'blockers', to: 'redesign' },
        ],
      },
      stages: [
        {
          highlightNodes: ['map'],
          explanation: 'Phase 1: Map every component in the system. Document responsibility, dependencies, dependents, and data stores. A component is a cohesive unit that could theoretically be owned by one agent. Output: a complete component inventory with dependency graph.',
        },
        {
          highlightNodes: ['map', 'score'],
          highlightEdges: [{ from: 'map', to: 'score' }],
          explanation: 'Phase 2: Score each component on 5 agent-buildability factors (1-5 each): Clear Boundaries, Consistent Patterns, Testable Contracts, No Tribal Knowledge, and Isolation. Total score 5-25. Below 10 means agent-hostile — redesign required.',
        },
        {
          highlightNodes: ['score', 'blockers'],
          highlightEdges: [{ from: 'score', to: 'blockers' }],
          explanation: 'Phase 3: For each low-scoring component, identify specific, actionable blockers. Not vague observations like "it is complex" — but concrete findings: "Order files split across 4 directories" or "No defined interface between Orders and Payments." Each blocker becomes a fix task.',
        },
        {
          highlightNodes: ['blockers', 'redesign'],
          highlightEdges: [{ from: 'blockers', to: 'redesign' }],
          explanation: 'Phase 4: Propose targeted fixes for each blocker, prioritized by impact. Boundary fixes unlock findability. Contract fixes unlock parallelism. Knowledge fixes unlock autonomy. Each fix has an effort estimate and projected score improvement. The output is an actionable redesign plan.',
        },
      ],
    },
    {
      type: 'code-fill',
      hint: 'Fill in values that match the pattern shown above.',
      instruction: 'Complete this buildability scorecard. Fill in scores (1-5) and blocker descriptions for each component based on the clues provided.',
      language: 'markdown',
      template: '# Agent-Buildability Scorecard\n\n## Component: User Auth\n- Files in 1 directory, clear naming\n- Boundaries score: ___\n- All other modules depend on it for auth checks\n- Isolation score: ___\n\n## Component: Orders & Checkout\n- Files scattered across 4 directories\n- Boundaries score: ___\n- Primary blocker: ___\n\n## Component: Payments\n- Self-contained module, own directory, consistent patterns\n- Overall assessment: ___',
      blanks: [
        { id: 'auth-boundaries', answer: '4', alternatives: ['5'], hint: 'Files are in 1 directory with clear naming — that is good', placeholder: '1-5' },
        { id: 'auth-isolation', answer: '2', alternatives: ['1', '3'], hint: 'ALL other modules depend on it — that makes isolation low', placeholder: '1-5' },
        { id: 'orders-boundaries', answer: '2', alternatives: ['1'], hint: 'Files scattered across 4 directories is very poor', placeholder: '1-5' },
        { id: 'orders-blocker', answer: 'files split across multiple directories', alternatives: ['scattered files', 'no feature directory', 'files in 4 directories', 'code spread across directories'], hint: 'The main issue with finding order-related files', placeholder: 'describe the blocker' },
        { id: 'payments-assessment', answer: 'agent-native', alternatives: ['agent-friendly', 'high score', 'excellent', '23/25', 'agent native'], hint: 'Self-contained + own directory + consistent = top tier', placeholder: 'assessment' },
      ],
      filename: 'buildability-scorecard.md',
      explanation: 'Scoring reveals exactly where agent-buildability breaks down. Auth has good boundaries (4/5) but poor isolation (2/5) because every module depends on it. Orders has terrible boundaries (2/5) because files are scattered. Payments with self-contained code and consistent patterns scores as agent-native. The scorecard directs your refactoring effort to the worst components first.',
    },
    {
      type: 'match',
      hint: 'Find the unique connection between each pair.',
      instruction: 'Match each AI-readiness factor to what it enables for agents:',
      leftItems: [
        'Clear module boundaries',
        'Comprehensive test suite',
        'Typed interfaces',
        'Documentation',
      ],
      rightItems: [
        'Agents can work in isolation',
        'Agents can verify their own output',
        'Agents understand expected shapes',
        'Agents have context without reading everything',
      ],
      correctPairs: { 0: 0, 1: 1, 2: 2, 3: 3 },
      explanation: 'Each readiness factor unlocks a specific agent capability. Clear boundaries let agents work without touching unrelated code. Tests let agents verify correctness autonomously. Types give agents the shape of data without reading implementation. Documentation provides context that would otherwise require tribal knowledge or reading the entire codebase.',
    },
    {
      type: 'prompt-lab',
      hint: 'Be specific about what you want — vague prompts get vague responses.',
      instruction: 'Write a prompt directing an agent to assess a codebase for AI-readiness. Be specific about what the agent should evaluate.',
      scenario: 'You have inherited a mid-size TypeScript monolith and want to know how ready it is for agent-parallel development. Write a prompt that directs an agent to perform a thorough AI-readiness assessment.',
      starterPrompt: 'Is this codebase AI-ready?',
      responses: [
        {
          triggerKeywords: ['boundaries', 'modules', 'types', 'tests', 'typed', 'test coverage', 'module boundary'],
          response: 'Excellent. I will assess along the key dimensions:\n\n1. **Module boundaries**: Checking feature directories, index.ts public APIs, import restrictions\n2. **Type coverage**: Scanning for `any` usage, untyped function parameters, missing return types\n3. **Test infrastructure**: Measuring coverage, checking for isolated test suites, mocking patterns\n4. **Documentation**: Looking for CLAUDE.md files, inline business rule docs, API contracts\n\nI will produce a scorecard with scores 1-5 for each dimension and specific remediation items for anything below 3.',
          quality: 'excellent',
          feedback: 'Outstanding. You specified concrete assessment criteria (boundaries, types, tests, docs) that map directly to the agent-buildability factors. The agent knows exactly what to evaluate and how to report findings.',
        },
        {
          triggerKeywords: ['assess', 'evaluate', 'check', 'review', 'analyze', 'audit'],
          response: 'I will review the codebase structure and provide my assessment of its readiness for AI-assisted development. Let me look at the overall architecture and code quality.',
          quality: 'poor',
          feedback: 'Too vague. "Review the codebase structure" gives the agent no criteria to evaluate against. Specify what readiness means: module boundaries, type coverage, test isolation, documentation quality. Without specific factors, the agent will produce generic observations instead of an actionable scorecard.',
        },
      ],
      fallbackResponse: {
        response: 'I will look at the codebase and assess whether it is ready for AI development.',
        feedback: 'Your prompt needs specific assessment criteria. Mention the readiness factors: module boundaries (can agents find all files for a feature?), type safety (are interfaces typed?), test coverage (can agents verify their work?), and documentation (is tribal knowledge written down?). Specific criteria produce actionable assessments.',
      },
    },
    {
      type: 'compare',
      hint: 'Look at the key differences between the two approaches.',
      title: 'AI-ready vs AI-hostile codebase',
      body: 'See the structural differences between a codebase agents can work in effectively and one that will defeat them.',
      left: {
        label: 'AI-Hostile Codebase',
        content: 'src/\n  utils.ts          (1200 lines, mixed concerns)\n  helpers.js        (untyped, no JSDoc)\n  app.ts            (monolithic entry point)\n  db.ts             (raw SQL, no schema types)\n  tests/\n    everything.test.ts (one giant test file)\n\n// No module boundaries\nimport { calcTotal, sendEmail, authCheck,\n  formatDate, validateOrder } from \'../utils\'\n\n// Untyped function\nfunction processOrder(data) {\n  // business rule: no cancel after ship\n  // (not documented anywhere else)\n  if (data.status === \'shipped\') return\n  // ... 200 lines of mixed concerns\n}',
        language: 'typescript',
        filename: 'ai-hostile.ts',
      },
      right: {
        label: 'AI-Ready Codebase',
        content: 'src/features/\n  orders/\n    orders.service.ts\n    orders.types.ts\n    orders.test.ts\n    CLAUDE.md          (business rules)\n    index.ts           (public API)\n  payments/\n    payments.service.ts\n    payments.types.ts\n    payments.test.ts\n    index.ts\n\n// Typed, bounded imports\nimport { placeOrder } from \'@/features/orders\'\nimport type { Order } from \'@/features/orders\'\n\n// Typed function with documented rules\nfunction processOrder(input: ProcessOrderInput): Result<Order> {\n  // State machine enforces valid transitions\n  return orderStateMachine.transition(input)\n}',
        language: 'typescript',
        filename: 'ai-ready.ts',
      },
      question: 'Which codebase can agents work in without tribal knowledge?',
      correctSide: 'right',
      explanation: 'The AI-ready codebase has every readiness factor: clear module boundaries (feature directories with index.ts), typed interfaces (ProcessOrderInput, Result<Order>), testable contracts (collocated tests per module), and documented knowledge (CLAUDE.md with business rules). An agent can find all order files in one directory, understand the interface from types alone, verify work with isolated tests, and learn business rules from documentation. The AI-hostile codebase requires a human to explain where things are, what types to expect, and what undocumented rules exist.',
    },
    {
      type: 'checkpoint',
      xp: 2,
      message: 'Methodology overview complete!',
    },

    // === PHASE 1: MAP ===
    {
      type: 'multiple-choice',
      hint: 'Eliminate the options that only partially fit.',
      question: 'In Phase 1 (Map), what is a "component" in the teardown methodology?',
      options: [
        'A React component or UI element',
        'A class or function in the codebase',
        'A cohesive unit that could theoretically be owned by one agent — like user auth, payment processing, or order management',
        'A database table or API endpoint',
      ],
      correctIndex: 2,
      explanation: 'Not classes or functions — system components. A component is a cohesive unit that could theoretically be owned by one agent. For each, document: responsibility (one sentence), dependencies (what it calls), dependents (what calls it), and data stores (what databases/caches it reads/writes).',
    },
    {
      type: 'code-fill',
      hint: 'Use the exact syntax from the lesson examples.',
      instruction: 'Complete this component map entry for an e-commerce Orders component. Fill in the dependencies, dependents, and file distribution.',
      language: 'markdown',
      template: '## 4. Orders & Checkout\n- Responsibility: Place orders, track status, handle fulfillment\n- Dependencies: Cart, ___, Inventory, ___\n- Dependents: ___, Analytics\n- Data: orders table, order_items table, ___\n- Files: 24 files across ___ directories',
      blanks: [
        { id: 'dep1', answer: 'Payments', alternatives: ['Payment', 'payments'], hint: 'Orders need to charge customers', placeholder: 'component name' },
        { id: 'dep2', answer: 'Email Service', alternatives: ['Email', 'Emails', 'Notifications'], hint: 'Orders send confirmation emails', placeholder: 'component name' },
        { id: 'dependent', answer: 'Admin Dashboard', alternatives: ['Admin', 'Dashboard'], hint: 'Admins need to see and manage orders', placeholder: 'component name' },
        { id: 'table', answer: 'order_events table', alternatives: ['order_events', 'order_status table'], hint: 'A table tracking order state changes', placeholder: 'table name' },
        { id: 'dirs', answer: '4', alternatives: ['four'], hint: 'Files scattered across too many directories is a red flag', placeholder: 'number' },
      ],
      filename: 'teardown-phase1.md',
      explanation: 'Orders & Checkout depends on 4 components (Cart, Payments, Inventory, Email) and is spread across 4 directories. This makes it the hardest component for agents — high dependency count + scattered files = lowest agent-buildability. The component map reveals this immediately.',
    },
    {
      type: 'multiple-choice',
      hint: 'Focus on the primary goal, not secondary benefits.',
      question: 'In the component map above, which component is likely the hardest for agents to work on independently?',
      options: [
        'Payments — because it handles money',
        'Orders & Checkout — because it depends on 4 other components and is spread across 4 directories',
        'User Auth — because all other components depend on it',
        'Shopping Cart — because it has the fewest files',
      ],
      correctIndex: 1,
      explanation: 'Orders & Checkout has 4 dependencies (Cart, Payments, Inventory, Email) AND is spread across 4 directories. This means an agent working on Orders needs to understand 4 other systems and navigate 4 different locations. High dependency count + scattered files = lowest agent-buildability.',
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'Phase 1 complete!',
    },

    // === PHASE 2: SCORE ===
    {
      type: 'match',
      hint: 'Match each term to its most specific definition.',
      instruction: 'Match each buildability factor to what it measures:',
      leftItems: ['Clear Boundaries', 'Consistent Patterns', 'Testable Contracts', 'No Tribal Knowledge', 'Isolation'],
      rightItems: ['Can an agent find all files without guessing?', 'Do all files follow the same structure?', 'Are interfaces well-defined and testable?', 'Can an agent understand without asking a human?', 'Can it be modified without affecting other components?'],
      correctPairs: { 0: 0, 1: 1, 2: 2, 3: 3, 4: 4 },
      explanation: 'Each factor scored 1-5 (1 = agent-hostile, 5 = agent-friendly). Total score 5-25. Below 10 means agent-hostile and requires redesign. 15-19 is workable. 20-25 is agent-native.',
    },
    {
      type: 'multiple-choice',
      hint: 'Think about which option is most specific to this concept.',
      question: 'A component scores: Boundaries 5, Patterns 5, Contracts 4, Knowledge 5, Isolation 3. Total: 22. What does this mean?',
      options: [
        'Agent-hostile — requires redesign',
        'Friction — agents struggle, need guidance',
        'Workable — minor improvements needed',
        'Agent-native — agents can own this component',
      ],
      correctIndex: 3,
      explanation: 'Scores 20-25 mean agent-native: agents can own this component. 15-19 is workable (minor improvements needed). 10-14 is friction (agents struggle). 5-9 is agent-hostile (requires redesign). The component with 22 is in great shape — agents can work autonomously on it.',
    },
    {
      type: 'multiple-choice',
      hint: 'Consider what the lesson content emphasized.',
      question: 'A component has Boundaries score 2 and Isolation score 1. What do these low scores tell you?',
      options: [
        'The code is buggy and needs testing',
        'Files are scattered across multiple directories with no clear ownership (Boundaries 2), and modifying this component reliably breaks others (Isolation 1)',
        'The component needs more documentation',
        'The patterns are inconsistent',
      ],
      correctIndex: 1,
      explanation: 'Boundaries 2 means files scattered with no clear ownership — an agent cannot list "all files for this component" in one command. Isolation 1 means modifying this component reliably breaks others — tight coupling makes independent work impossible. These are the two most critical factors to fix first.',
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'Phase 2 scored!',
    },

    // === PHASE 3: BLOCKERS ===
    {
      type: 'compare',
      hint: 'Focus on what makes one approach more appropriate here.',
      title: 'Vague observations vs actionable blockers',
      body: 'Phase 3 produces specific, measurable findings — not vague observations. Each blocker becomes a fix task in Phase 4.',
      left: {
        label: 'Vague Observation (Useless)',
        content: '"The orders component is complex"\n"It has too many dependencies"\n"The code is hard to follow"\n"Testing is difficult"\n"There is tech debt"\n\nResult:\n- No clear fix action\n- No way to measure improvement\n- No priority ranking\n- Every developer has a different\n  interpretation',
        language: 'text',
        filename: 'vague.txt',
      },
      right: {
        label: 'Actionable Blocker (Useful)',
        content: 'B1: Order files split across 4 dirs:\n  controllers/, services/, jobs/, events/\nB2: No feature directory — agent cannot\n  list "all order files" in one command\nC1: No defined interface between\n  Orders <-> Payments (direct imports)\nK1: "shipped orders cannot be cancelled"\n  — undocumented rule\nI1: Modifying order total logic breaks\n  cart display (shared function)\n\nResult:\n- Clear fix for each blocker\n- Measurable improvement per fix\n- Priority by impact on agent work',
        language: 'text',
        filename: 'actionable.txt',
      },
      question: 'Which type of finding can be turned into a concrete fix task?',
      correctSide: 'right',
      explanation: 'Blockers must be specific and actionable. "The order state machine is not documented" becomes "Create CLAUDE.md with state transitions." "Files in 4 directories" becomes "Move all to src/features/orders/." Each blocker maps directly to a fix task with measurable improvement.',
    },
    {
      type: 'match',
      hint: 'Look for the distinguishing feature of each item.',
      instruction: 'Match each blocker type to the scoring factor it corresponds to:',
      leftItems: ['Order files split across 4 directories', 'Controller uses classes, service uses functions', 'No defined interface between Orders and Payments', '"Shipped orders cannot be cancelled" — undocumented', 'Modifying order total breaks cart display'],
      rightItems: ['Boundaries (score: 2)', 'Patterns (score: 2)', 'Contracts (score: 2)', 'Knowledge (score: 2)', 'Isolation (score: 1)'],
      correctPairs: { 0: 0, 1: 1, 2: 2, 3: 3, 4: 4 },
      explanation: 'Each blocker maps to the scoring factor it degrades. Scattered files degrade Boundaries. Inconsistent conventions degrade Patterns. Missing interfaces degrade Contracts. Undocumented rules degrade Knowledge. Shared functions that break other modules degrade Isolation.',
    },
    {
      type: 'multiple-choice',
      hint: 'One option stands out when you think about the core purpose.',
      question: 'Blocker K1 states: "Orders with status shipped cannot be cancelled — undocumented rule." Where should this knowledge live in an agent-native system?',
      options: [
        'In a README that developers read during onboarding',
        'In a code comment above the cancel function',
        'In the Orders module CLAUDE.md AND enforced in code via a state machine with explicit valid transitions',
        'In the project wiki',
      ],
      correctIndex: 2,
      explanation: 'Tribal knowledge must be (1) documented where agents will read it (CLAUDE.md) AND (2) enforced in code so agents cannot violate it even if they miss the documentation. A state machine that explicitly defines valid transitions makes invalid transitions a compile-time or runtime error — the agent physically cannot cancel a shipped order.',
    },
    {
      type: 'checkpoint',
      xp: 4,
      message: 'Blockers identified!',
    },

    // === PHASE 4: REDESIGN ===
    {
      type: 'match',
      hint: 'Each left item has exactly one correct right match.',
      instruction: 'Match each blocker type to its targeted fix:',
      leftItems: ['Boundary blockers (files scattered)', 'Pattern blockers (inconsistent conventions)', 'Contract blockers (no defined interfaces)', 'Knowledge blockers (undocumented rules)', 'Isolation blockers (tight coupling)'],
      rightItems: ['Directory restructure to one feature directory', 'Conventions document plus refactoring pass', 'Explicit interface definitions between modules', 'Documentation in CLAUDE.md plus code enforcement', 'Events instead of direct calls (decoupling)'],
      correctPairs: { 0: 0, 1: 1, 2: 2, 3: 3, 4: 4 },
      explanation: 'For each blocker, propose a specific fix. Not a rewrite — a targeted intervention. Boundary fixes unlock findability. Contract fixes unlock parallelism. Knowledge fixes unlock autonomy. Prioritize by impact on parallel agent work.',
    },
    {
      type: 'code-fill',
      hint: 'Each blank follows the conventions demonstrated earlier.',
      instruction: 'Complete this redesign proposal for the Orders component. Fill in the fixes, effort estimates, and score improvements.',
      language: 'markdown',
      template: '# Redesign Proposal: Orders & Checkout\n\n## Priority 1: Boundaries (unlocks findability)\n- Move all order files to ___\n- Estimated effort: ___ hours\n- Impact: Boundaries score 2 → 5\n\n## Priority 2: Contracts (unlocks parallel work)\n- Define ___ (types + interface)\n- Implement ___: Order.transition(from, to)\n- Estimated effort: 4 hours\n\n## Priority 3: Knowledge (unlocks autonomous work)\n- Create src/features/orders/___\n- Estimated effort: ___ hour\n- Impact: Knowledge score 2 → 5\n\n## Projected Final Score: 9 → ___',
      blanks: [
        { id: 'target-dir', answer: 'src/features/orders/', alternatives: ['src/features/orders', 'features/orders/'], hint: 'The standard feature directory location', placeholder: 'directory path' },
        { id: 'effort-1', answer: '2', alternatives: ['3', '1'], hint: 'Moving files is relatively quick', placeholder: 'number' },
        { id: 'contract-name', answer: 'OrderPaymentContract', alternatives: ['OrderPayment contract', 'order-payment contract'], hint: 'The interface between Orders and Payments', placeholder: 'contract name' },
        { id: 'mechanism', answer: 'state machine', alternatives: ['a state machine', 'state-machine'], hint: 'A pattern that enforces valid state transitions', placeholder: 'mechanism' },
        { id: 'doc-file', answer: 'CLAUDE.md', alternatives: ['claude.md'], hint: 'The agent instruction file for this module', placeholder: 'filename' },
        { id: 'effort-3', answer: '1', alternatives: ['2'], hint: 'Documenting rules is fast', placeholder: 'number' },
        { id: 'final-score', answer: '23', alternatives: ['22', '24'], hint: 'From agent-hostile (9) to agent-native (20+)', placeholder: 'score' },
      ],
      filename: 'teardown-phase4.md',
      explanation: 'Each fix targets a specific blocker with estimated effort and projected score improvement. Total estimated effort: 15 hours to go from 9/25 (agent-hostile) to 23/25 (agent-native). The biggest wins come from Boundaries (findability) and Contracts (parallelism) — fix those first.',
    },
    {
      type: 'order',
      hint: 'Consider what depends on what — prerequisites first.',
      instruction: 'Order the redesign priorities by impact (fix first → fix last):',
      items: [
        'Pattern consistency (rename files, standardize conventions)',
        'Boundary restructure (move files to feature directory)',
        'Knowledge documentation (CLAUDE.md with business rules)',
        'Interface contracts (define typed boundaries between modules)',
        'Isolation improvements (events instead of direct coupling)',
      ],
      correctOrder: [1, 3, 2, 0, 4],
    },
    {
      type: 'checkpoint',
      xp: 4,
      message: 'Redesign proposed!',
    },

    // === AGENT-BUILDABILITY FACTORS DEEP DIVE ===
    {
      type: 'multiple-choice',
      hint: 'Read each option carefully — one fits the context best.',
      question: 'Which of these is an example of tribal knowledge that is a landmine for agents?',
      options: [
        'A well-documented API endpoint',
        '"We always round up on tax" — a business rule that is not in the code or documented anywhere',
        'A typed interface in a contract file',
        'A test that verifies state machine transitions',
      ],
      correctIndex: 1,
      explanation: 'Tribal knowledge is anything a human "just knows" that is not in the code or documented. Business rules ("we always round up on tax"). Implicit conventions ("handlers never call other handlers directly"). Deployment quirks ("never deploy on Fridays"). Every piece is a landmine for agents. They will violate it. Document it or enforce it in code.',
    },
    {
      type: 'multiple-choice',
      hint: 'Eliminate the options that only partially fit.',
      question: 'What makes a contract "testable" for agents?',
      options: [
        'It has many comments explaining the code',
        'It is typed (TypeScript catches mismatches), behavior is specified (tests verify the contract), and it is independently mockable (test module A without running module B)',
        'It uses the latest testing framework',
        'It has 100% code coverage',
      ],
      correctIndex: 1,
      explanation: 'A testable contract means: (1) The interface is typed — TypeScript catches mismatches at compile time. (2) The behavior is specified — tests verify the contract is honored. (3) The contract is independently mockable — an agent can test its module without running the entire system. If testing Module A requires running Module B, the boundary is not clean enough.',
    },
    {
      type: 'multiple-choice',
      hint: 'Focus on the primary goal, not secondary benefits.',
      question: 'You are doing a teardown of an internal tool. The deployment process requires running 3 scripts in a specific order with manual checks between them. How does this affect agent-buildability?',
      options: [
        'It does not — deployment is separate from code architecture',
        'It lowers the Knowledge score — agents cannot deploy without tribal knowledge of the manual steps and order',
        'It only matters for CI/CD agents, not coding agents',
        'It increases agent-buildability because scripts are automatable',
      ],
      correctIndex: 1,
      explanation: 'Undocumented manual processes are tribal knowledge. Even if coding agents do not deploy directly, they need to understand deployment constraints when designing features (e.g., "this requires a migration that must run before code deploys"). The manual process should be documented in CLAUDE.md and ideally automated into a single script agents can understand.',
    },

    // === SYNTHESIS ===
    {
      type: 'multiple-choice',
      hint: 'Think about which option is most specific to this concept.',
      question: 'When should you run a teardown? Select the scenario that does NOT warrant a teardown.',
      options: [
        'You inherit a codebase and plan to use agents heavily',
        'Agent conflict rates exceed 15% despite good CLAUDE.md documentation',
        'Your existing codebase has 100% test coverage and clear module boundaries already',
        'Agents consistently produce incorrect code in specific areas of the codebase',
      ],
      correctIndex: 2,
      explanation: 'Run a teardown when: (1) You inherit a codebase for heavy agent use. (2) Conflict rates exceed 15%. (3) Agents consistently fail in specific areas. (4) Planning a significant new feature. If your codebase already has clear boundaries and good coverage, the teardown would confirm it is agent-ready — not require redesign.',
    },
    {
      type: 'multiple-choice',
      hint: 'Consider what the lesson content emphasized.',
      question: 'The Teardown Methodology is primarily about:',
      options: [
        'Judging legacy code and criticizing past decisions',
        'Rewriting the entire codebase from scratch',
        'Adapting a human-native system to agent-native requirements — clear boundaries, explicit contracts, documented rules instead of tribal knowledge',
        'Adding more documentation to every file',
      ],
      correctIndex: 2,
      explanation: 'The Teardown is not about judging legacy code. Legacy code was built for human teams with human assumptions — appropriate at the time. The Teardown acknowledges the new reality: agents are your builders, and they need clear boundaries instead of tribal knowledge, explicit contracts instead of implicit conventions, documented rules instead of team culture. Adaptation, not criticism.',
    },
    {
      type: 'checklist',
      title: 'Teardown Methodology checklist:',
      items: [
        'I can map all components in a system with their dependencies and data stores',
        'I can score each component on the 5 agent-buildability factors',
        'I can identify specific, actionable blockers (not vague observations)',
        'I can propose targeted redesigns with effort estimates and impact projections',
        'I prioritize fixes by impact on agent parallelism and autonomy',
        'I know when a teardown is warranted (inheritance, high conflict rate, agent failures)',
        'I can produce a complete teardown report as a deliverable',
      ],
    },
    {
      type: 'checkpoint',
      xp: 22,
      message: 'The Teardown Methodology mastered! You can now systematically evaluate and redesign any system for agent-buildability.',
    },
  ],
}

export default content
