import type { LessonContent } from './types'

const content: LessonContent = {
  lessonId: '2-1',
  steps: [
    // === INTRODUCTION ===
    {
      type: 'info',
      title: 'The shift: from small tasks to full products',
      body: "In Tier 1, you learned to direct AI on individual tasks — add a feature, fix a problem, run a check. That is useful but limited. In Tier 2, you direct AI to build an entire product from start to finish. The difference is not just scale — it is a different skill entirely. You stop thinking about code and start thinking about specifications. Your spec becomes the most important thing you write — it is your contract with the AI about exactly what to build.",
    },
    {
      type: 'info',
      title: 'What a "spec" means here',
      body: "This is not a traditional PRD (Product Requirements Document). A PRD is written for humans — it explains context, motivation, user stories, and leaves implementation details to the engineering team. An agent spec is an execution contract. The agent does not need motivation or user stories. It needs precise boundaries: what to build, what not to build, what counts as done, and where it is allowed to make its own decisions. Think of it as a contract between you (the director) and the agent (the builder).",
    },

    // === SPEC STRUCTURE ===
    {
      type: 'multiple-choice',
      hint: 'Read each option carefully — one fits the context best.',
      question: 'A good agent spec has five sections. Which of the following is NOT one of them?',
      options: [
        'Goal: one sentence describing what exists when the agent is done',
        'User Stories: narrative descriptions of how different personas interact with the product',
        'Acceptance Criteria: specific, testable conditions that prove the work is complete',
        'Out of Scope: things explicitly excluded that the agent might otherwise build',
      ],
      correctIndex: 1,
      explanation: 'User Stories belong in a PRD (written for humans), not an agent spec. The five sections are: Goal, Constraints (technology guardrails), Acceptance Criteria (testable proof), Technical Boundaries (what the agent can touch), and Out of Scope (explicit exclusions). An agent does not need narrative context — it needs precise boundaries.',
    },
    {
      type: 'interactive-diagram',
      title: 'Spec Structure',
      body: 'The five sections form a funnel from broad vision to precise boundaries. Step through each to understand its role.',
      diagram: {
        direction: 'TB',
        nodes: [
          { id: 'goal', label: 'Goal', sublabel: 'What exists when done', shape: 'rounded', highlight: true },
          { id: 'constraints', label: 'Constraints', sublabel: 'Technology & style guardrails', shape: 'rect' },
          { id: 'acceptance', label: 'Acceptance Criteria', sublabel: 'Testable proof of done', shape: 'rect' },
          { id: 'boundaries', label: 'Technical Boundaries', sublabel: 'Allowed & off-limits', shape: 'rect' },
          { id: 'oos', label: 'Out of Scope', sublabel: 'Explicitly excluded', shape: 'pill' },
        ],
        edges: [
          { from: 'goal', to: 'constraints' },
          { from: 'constraints', to: 'acceptance' },
          { from: 'acceptance', to: 'boundaries' },
          { from: 'boundaries', to: 'oos' },
        ],
      },
      stages: [
        {
          highlightNodes: ['goal'],
          highlightEdges: [],
          explanation: 'Goal: One sentence describing what exists when the agent is done. "A working web app where users can save, tag, search, and delete bookmarks." This anchors everything that follows.',
        },
        {
          highlightNodes: ['goal', 'constraints'],
          highlightEdges: [{ from: 'goal', to: 'constraints' }],
          explanation: 'Constraints: Technology choices, style requirements, performance budgets. These are guardrails — they prevent the agent from making unauthorized technology decisions.',
        },
        {
          highlightNodes: ['constraints', 'acceptance'],
          highlightEdges: [{ from: 'constraints', to: 'acceptance' }],
          explanation: 'Acceptance Criteria: Specific, testable conditions that prove the work is complete. Each criterion is a checkbox the agent (and you) can verify.',
        },
        {
          highlightNodes: ['acceptance', 'boundaries'],
          highlightEdges: [{ from: 'acceptance', to: 'boundaries' }],
          explanation: 'Technical Boundaries: What the agent is allowed to touch — files, packages, APIs — and what is off-limits. This prevents unintended side effects.',
        },
        {
          highlightNodes: ['boundaries', 'oos'],
          highlightEdges: [{ from: 'boundaries', to: 'oos' }],
          explanation: 'Out of Scope: Things the agent might reasonably assume are included but are explicitly excluded. Without this, eager agents will over-build.',
        },
      ],
    },
    {
      type: 'checkpoint',
      xp: 2,
      message: 'You know the five sections of a good spec. This is your most important tool.',
    },

    // === REAL EXAMPLE ===
    {
      type: 'code-fill',
      hint: 'Fill in values that match the pattern shown above.',
      instruction: 'Let us walk through a concrete example. You have a product idea: a bookmark manager with tags. Complete the missing parts of this spec — notice how each section constrains the agent without micromanaging it. The spec says WHAT, not HOW.',
      language: 'markdown',
      filename: 'SPEC.md',
      template: '# Bookmark Manager — Agent Spec\n\n## Goal\nA working web app where users can save, tag, search, and delete bookmarks.\n\n## Constraints\n- Next.js 15 with App Router\n- TypeScript strict mode\n- {{database}} (local file DB, no external services)\n- Tailwind CSS for styling\n- No authentication (single-user, local)\n\n## Acceptance Criteria\n- [ ] User can add a bookmark (URL + optional title)\n- [ ] User can assign multiple tags to a bookmark\n- [ ] User can filter bookmarks by tag\n- [ ] User can full-text search bookmarks by title/URL\n- [ ] User can delete a bookmark\n\n## Technical Boundaries\n- Create a new project from scratch (not modify existing)\n- Use `src/` directory structure\n- Keep all DB logic in `src/db/` directory\n- Use {{mutation_pattern}} for mutations (no API routes)\n\n## Out of Scope\n- User authentication / multi-tenancy\n- {{excluded_feature}}\n- Browser extension\n- Favicon fetching',
      blanks: [
        { id: 'database', answer: 'SQLite via Drizzle ORM', alternatives: ['SQLite + Drizzle ORM', 'Drizzle ORM + SQLite', 'SQLite with Drizzle ORM'], placeholder: 'which database + ORM?', hint: 'A lightweight file-based DB paired with a TypeScript ORM' },
        { id: 'mutation_pattern', answer: 'server actions', alternatives: ['Server Actions', 'server actions', 'Server actions'], placeholder: 'which data mutation pattern?', hint: 'Next.js App Router feature that replaces API routes for form submissions' },
        { id: 'excluded_feature', answer: 'Bookmark import/export', alternatives: ['Import/export', 'import/export', 'Bookmark import export'], placeholder: 'what data portability feature?', hint: 'A common feature for migrating bookmarks between tools' },
      ],
      explanation: 'Naming SQLite + Drizzle removes a database decision. Server actions is an architectural choice that affects how the whole app handles mutations. Import/export is a reasonable feature an agent might add — excluding it prevents scope creep.',
    },
    {
      type: 'multiple-choice',
      hint: 'Eliminate the options that only partially fit.',
      question: 'Why does the spec say "SQLite via Drizzle ORM" instead of just "a database"?',
      options: [
        'Because SQLite is the only database that works with Next.js',
        'To prevent the agent from spending time evaluating database options — the decision is made',
        'Because Drizzle ORM is required for server actions',
        'To make the spec longer and more professional',
      ],
      correctIndex: 1,
      explanation: 'Naming the specific technology removes a decision point. Without it, the agent might spend tokens evaluating Postgres vs SQLite vs Prisma vs Drizzle. The spec makes the choice so the agent can execute immediately. This is a constraint — a guardrail that saves time.',
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'Real spec analyzed!',
    },

    // === ANTI-PATTERNS ===
    {
      type: 'compare',
      hint: 'Look at the key differences between the two approaches.',
      title: 'Two spec anti-patterns',
      body: 'Both of these specs will cause problems. One tells the agent almost nothing. The other writes code in English.',
      question: 'Which failure mode wastes MORE of your time correcting the output?',
      correctSide: 'left',
      left: {
        label: 'Too vague',
        content: '"Build me a bookmark manager.\nMake it good. Use modern tech."\n\nResult: agent makes dozens of\nunauthorized decisions — picks a\ndatabase, invents features, chooses\nrouting patterns. You spend more\ntime correcting than you saved.',
        language: 'text',
      },
      right: {
        label: 'Too prescriptive',
        content: '"Create src/components/BookmarkCard.tsx.\nExport a component with props\n{ url: string, title: string }.\nUse a div with className \'card p-4\'\nInside, render an anchor tag..."\n\nResult: you are writing code\nin English. Just write the code.',
        language: 'text',
      },
      explanation: 'Too vague causes more rework because the agent makes architectural decisions you must undo. Too prescriptive wastes your time writing the spec, but the output is at least predictable. The sweet spot: constrain the expensive decisions (architecture, tech stack, boundaries), leave cheap ones (naming, styling details) to the agent.',
    },
    {
      type: 'multiple-choice',
      hint: 'Focus on the primary goal, not secondary benefits.',
      question: 'A spec has a clear goal and acceptance criteria but no boundaries or scope exclusions. The agent builds everything correctly — then also adds authentication, Docker config, and a CI/CD pipeline. What anti-pattern is this?',
      options: [
        'Too vague — the spec did not specify enough detail',
        'Too prescriptive — the spec over-constrained the agent',
        'Missing boundaries — without explicit exclusions, the agent optimizes for completeness',
        'Wrong format — the spec should have been in CLAUDE.md instead of a prompt',
      ],
      correctIndex: 2,
      explanation: 'Without an Out of Scope section, the agent tries to be helpful by building everything it thinks you might need. The Out of Scope section is not optional — it is your defense against scope creep from an eager builder.',
    },
    {
      type: 'compare',
      hint: 'Focus on what makes one approach more appropriate here.',
      title: 'Spot the anti-pattern',
      body: 'One of these specs constrains the agent. The other writes code in English.',
      question: 'Which side is the correct approach?',
      correctSide: 'left',
      left: {
        label: 'Constraint',
        content: '## Constraints\n- Use Tailwind CSS for all styling\n- No authentication — single user only\n- Keep database logic in src/db/\n- SQLite via Drizzle ORM',
        language: 'markdown',
      },
      right: {
        label: 'Too prescriptive',
        content: '## Implementation\n- Create src/components/BookmarkCard.tsx\n- Export component with props { url: string }\n- Use a div with className "card p-4 border"\n- Inside render an anchor tag with href={url}',
        language: 'markdown',
      },
      explanation: 'The left side sets guardrails — which tools to use, what is off-limits. The right side dictates exact code structure. If you know the exact JSX, just write it yourself. A spec constrains decisions without making them.',
    },
    {
      type: 'multiple-choice',
      hint: 'Think about which option is most specific to this concept.',
      question: 'Which spec instruction is an anti-pattern?',
      options: [
        '"Use Tailwind CSS for all styling"',
        '"Create a function called calculateTotal that takes an array of numbers and returns their sum using reduce"',
        '"No authentication — single user only"',
        '"Keep database logic in src/db/"',
      ],
      correctIndex: 1,
      explanation: 'Dictating the exact function name, parameters, and implementation (use reduce) is too prescriptive. You are writing code in English. The other options are appropriate constraints that guide without micromanaging.',
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'Anti-patterns identified!',
    },

    // === DELIVERY METHOD ===
    {
      type: 'multiple-choice',
      hint: 'Consider what the lesson content emphasized.',
      question: 'You are starting a new project that will evolve over weeks. Where should you put the spec so the agent has context on every invocation?',
      options: [
        'In the first prompt message — paste it each time you start a session',
        'In CLAUDE.md at the project root — the agent reads it automatically every session',
        'In a README.md file — standard documentation location',
        'In a comment at the top of the main source file',
      ],
      correctIndex: 1,
      explanation: 'CLAUDE.md at the project root is read automatically by Claude Code at the start of every session. For ongoing projects where the spec evolves, this is the best delivery method. For one-shot builds, pasting the spec directly into the prompt works too — but it does not persist across sessions.',
    },
    {
      type: 'compare',
      hint: 'Consider the trade-offs discussed in the lesson.',
      title: 'CLAUDE.md vs direct prompt',
      body: 'Two valid ways to deliver a spec to the agent. The right choice depends on your project lifecycle.',
      question: 'Which method is better for an ongoing project that evolves over weeks?',
      correctSide: 'left',
      left: {
        label: 'CLAUDE.md',
        content: '# Bookmark Manager\n\n## Spec\n[... your full spec here ...]\n\n## Development\n- Run: `npm run dev`\n- Test: `npm test`\n\n## Architecture Decisions\n(Agent fills this in as it builds)\n\n✓ Persists across sessions\n✓ Evolves with the project\n✓ Auto-read by agent',
        language: 'markdown',
      },
      right: {
        label: 'Direct prompt',
        content: 'Build this project from scratch\naccording to the following spec:\n\n[paste your full spec]\n\nStart by creating the project\nstructure, then implement each\ncriterion one at a time.\n\n✓ Good for one-shot builds\n✓ No file to maintain\n✗ Must re-paste each session',
        language: 'text',
      },
      explanation: 'CLAUDE.md is the right choice for evolving projects — it persists, updates over time, and the agent reads it automatically. Direct prompts work for one-shot builds where the spec is a single-use instruction.',
    },

    // === WORKFLOW DIAGRAM ===
    {
      type: 'interactive-diagram',
      title: 'Product Vision to Ship',
      body: 'The full workflow from idea to deployed product. The spec is the bridge between your vision and agent execution. Step through each stage.',
      diagram: {
        direction: 'LR',
        nodes: [
          { id: 'vision', label: 'Product Vision', sublabel: 'Your idea', shape: 'pill' },
          { id: 'spec', label: 'Write Spec', sublabel: '5 sections', shape: 'rounded', highlight: true },
          { id: 'execute', label: 'Agent Executes', sublabel: 'Claude Code builds', shape: 'rect' },
          { id: 'review', label: 'Review Output', sublabel: 'Check criteria', shape: 'diamond' },
          { id: 'ship', label: 'Ship', sublabel: 'Deploy', shape: 'pill', highlight: true },
        ],
        edges: [
          { from: 'vision', to: 'spec' },
          { from: 'spec', to: 'execute' },
          { from: 'execute', to: 'review' },
          { from: 'review', to: 'ship', label: 'pass' },
          { from: 'review', to: 'spec', label: 'iterate', dashed: true },
        ],
      },
      stages: [
        {
          highlightNodes: ['vision', 'spec'],
          highlightEdges: [{ from: 'vision', to: 'spec' }],
          explanation: 'You start with a product idea and translate it into a structured spec with all five sections. This is the most important step — everything downstream depends on spec quality.',
        },
        {
          highlightNodes: ['spec', 'execute'],
          highlightEdges: [{ from: 'spec', to: 'execute' }],
          explanation: 'Hand the spec to Claude Code. The agent reads it (from CLAUDE.md or a prompt) and builds the product. Your spec constrains what it builds and how.',
        },
        {
          highlightNodes: ['execute', 'review'],
          highlightEdges: [{ from: 'execute', to: 'review' }],
          explanation: 'Review the output against your acceptance criteria. Does it match the spec? Are there unexpected additions or missing features?',
        },
        {
          highlightNodes: ['review', 'spec'],
          highlightEdges: [{ from: 'review', to: 'spec' }],
          explanation: 'If something is off, iterate: update the spec or give a targeted follow-up prompt. Plan for 2-3 rounds. Perfect specs do not exist.',
        },
        {
          highlightNodes: ['review', 'ship'],
          highlightEdges: [{ from: 'review', to: 'ship' }],
          explanation: 'When the output passes all criteria, ship it. Deploy to production. The spec, the code, and the CLAUDE.md documentation travel together.',
        },
      ],
    },
    {
      type: 'checkpoint',
      xp: 2,
      message: 'Workflow mapped!',
    },

    // === ITERATION ===
    {
      type: 'multiple-choice',
      hint: 'One option stands out when you think about the core purpose.',
      question: 'The agent builds your bookmark manager. The search works, but it uses client-side filtering instead of the server-side SQL search you intended. How many iteration rounds should you expect when working with specs?',
      options: [
        'Zero — a well-written spec should produce perfect output on the first try',
        'One — if you need more than one revision, your spec was too vague',
        'Two to three rounds — good specs reduce iterations, but perfect specs do not exist',
        'Five or more — agents always need heavy correction',
      ],
      correctIndex: 2,
      explanation: 'Plan for 2-3 iteration rounds. The cycle is: observe what the agent built, identify the gap between output and intent, update the spec (or give a targeted follow-up), and let the agent revise. Good specs reduce rounds but cannot eliminate them entirely.',
    },
    {
      type: 'compare',
      hint: 'Look at the key differences between the two approaches.',
      title: 'Targeted follow-up vs spec rewrite',
      body: 'When something is wrong with the output, you have two correction strategies. The right one depends on what needs to change.',
      question: 'The agent used client-side filtering instead of server-side search. Which correction is appropriate?',
      correctSide: 'left',
      left: {
        label: 'Targeted follow-up',
        content: '"The search should be server-side\nusing SQL LIKE, not client-side\nfiltering. Update the bookmarks\npage to query the database directly."\n\n✓ Fix is within existing boundaries\n✓ Quick, surgical correction\n✓ No spec changes needed',
        language: 'text',
      },
      right: {
        label: 'Spec rewrite',
        content: '"Actually, I want this to be a\nChrome extension instead of a\nweb app. Rewrite the spec with\nnew constraints and boundaries."\n\n✓ Needed when boundaries change\n✓ Fundamental direction shift\n✗ Overkill for small fixes',
        language: 'text',
      },
      explanation: 'A targeted follow-up is right because the fix is within the existing boundaries — you still want a web app, just with a different search implementation. A spec rewrite is only needed when the boundaries themselves change (e.g., switching from web app to Chrome extension).',
    },

    // === INTERACTIVE EXERCISES ===
    {
      type: 'order',
      hint: 'Consider what depends on what — prerequisites first.',
      instruction: 'Order the steps of writing a spec from first to last:',
      items: [
        'Define acceptance criteria (testable conditions)',
        'Write the goal (one sentence, what exists when done)',
        'List what is out of scope',
        'Set constraints (tech stack, style)',
        'Define technical boundaries (files, APIs, packages)',
      ],
      correctOrder: [1, 3, 0, 4, 2],
    },
    {
      type: 'multiple-choice',
      hint: 'Read each option carefully — one fits the context best.',
      question: 'You give the agent a spec and it builds a feature you explicitly listed in "Out of Scope." What went wrong?',
      options: [
        'The agent is broken and ignoring instructions',
        'The Out of Scope section was probably too vague or buried — make it more prominent',
        'You should have used CLAUDE.md instead of a direct prompt',
        'Out of Scope sections do not actually work with AI agents',
      ],
      correctIndex: 1,
      explanation: 'Agents are biased toward helpfulness and completeness. If an Out of Scope item is vague or easy to miss, the agent may build it anyway. Make exclusions explicit, prominent, and unambiguous. Repeat critical exclusions in constraints if needed.',
    },
    {
      type: 'code-fill',
      hint: 'Use the exact syntax from the lesson examples.',
      instruction: 'Complete this Out of Scope section for the bookmark manager. Think about what an eager agent might add that you explicitly do NOT want.',
      language: 'markdown',
      filename: 'SPEC.md',
      template: '## Out of Scope\n- {{scope_1}}\n- Bookmark import/export\n- {{scope_2}}\n- Favicon fetching\n- {{scope_3}}',
      blanks: [
        { id: 'scope_1', answer: 'User authentication', alternatives: ['Authentication', 'User auth', 'Auth', 'Multi-tenancy', 'User authentication / multi-tenancy'], placeholder: 'what login feature?', hint: 'The spec says single-user, local' },
        { id: 'scope_2', answer: 'Browser extension', alternatives: ['Chrome extension', 'browser extension', 'Extension'], placeholder: 'what browser feature?', hint: 'A common way to save bookmarks' },
        { id: 'scope_3', answer: 'Deployment configuration', alternatives: ['Deployment', 'Deploy config', 'Deployment config', 'CI/CD', 'Docker'], placeholder: 'what infrastructure?', hint: 'The spec focuses on local development' },
      ],
      explanation: 'Each exclusion prevents a specific form of scope creep. An eager agent might reasonably add any of these "helpful" features without being told not to.',
    },
    {
      type: 'code-input',
      instruction: 'Write one acceptance criterion for a bookmark manager: the user should be able to search bookmarks by title. Write it as a checkbox item starting with "[ ]".',
      placeholder: '[ ] User can...',
      answer: '[ ] User can search bookmarks by title',
      hint: 'Start with "[ ] User can" and describe the searchable field',
    },

    // === FINAL SYNTHESIS ===
    {
      type: 'multiple-choice',
      hint: 'Eliminate the options that only partially fit.',
      question: 'Every ambiguity in your spec becomes a decision the agent makes without you. Which of the following best describes the "spec mindset"?',
      options: [
        'Write specs as detailed as possible — cover every variable name and function signature',
        'Keep specs minimal — the agent knows best and will make good decisions',
        'Lock down the decisions that matter (architecture, boundaries) and leave cheap decisions to the agent',
        'Write the spec once and never iterate — revisions mean the original spec was bad',
      ],
      correctIndex: 2,
      explanation: 'The spec mindset is about knowing which decisions are expensive to change later (architecture, tech stack, scope) and locking those down. Cheap decisions (naming, styling details) can safely be left to the agent. The payoff: a well-written spec lets you build in hours what used to take days.',
    },
    {
      type: 'checklist',
      title: 'Spec writing checklist:',
      items: [
        'I can articulate the difference between a PRD and an agent spec',
        'I know the five sections of a good spec',
        'I can convert a product idea into a structured spec',
        'I recognize the three anti-patterns (too vague, too prescriptive, missing boundaries)',
        'I know when to iterate the spec vs give a targeted follow-up',
        'I can deliver a spec via CLAUDE.md or direct prompt',
      ],
    },
    {
      type: 'checkpoint',
      xp: 10,
      message: 'Spec writing for products mastered! You can now direct AI to build entire applications.',
    },
  ],
}

export default content
