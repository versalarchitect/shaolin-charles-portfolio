import type { LessonContent } from './types'

const content: LessonContent = {
  lessonId: '2-1',
  steps: [
    // === INTRODUCTION ===
    {
      type: 'info',
      title: 'The shift: from tasks to products',
      body: "In Tier 1, you learned to use an agent for individual tasks — write a function, fix a bug, add a test. That is useful but limited. In Tier 2, you direct a single agent to build an entire product. The difference is not just scale. It is a fundamentally different skill: you stop writing code and start writing specifications. The spec becomes your primary artifact — the thing you iterate on, refine, and hand to the agent as an execution contract.",
    },
    {
      type: 'info',
      title: 'What a "spec" means here',
      body: "This is not a traditional PRD (Product Requirements Document). A PRD is written for humans — it explains context, motivation, user stories, and leaves implementation details to the engineering team. An agent spec is an execution contract. The agent does not need motivation or user stories. It needs precise boundaries: what to build, what not to build, what counts as done, and where it is allowed to make its own decisions. Think of it as a contract between you (the director) and the agent (the builder).",
    },

    // === SPEC STRUCTURE ===
    {
      type: 'info',
      title: 'The five sections of a good spec',
      body: "Every effective spec has five sections. Goal: one sentence describing what exists when the agent is done. Constraints: technology choices, style requirements, performance budgets — the guardrails. Acceptance Criteria: specific, testable conditions that prove the work is complete. Technical Boundaries: what the agent is allowed to touch (files, packages, APIs) and what is off-limits. Out of Scope: things the agent might reasonably assume are included but are explicitly excluded. Each section serves a different purpose in keeping the agent on track.",
    },
    {
      type: 'diagram',
      title: 'Spec Structure',
      body: 'The five sections form a funnel from broad vision to precise boundaries.',
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
    },
    {
      type: 'checkpoint',
      xp: 2,
      message: 'Spec anatomy understood!',
    },

    // === REAL EXAMPLE ===
    {
      type: 'info',
      title: 'A real spec: bookmark manager',
      body: "Let us walk through a concrete example. You have a product idea: a bookmark manager with tags. Not original, but that is the point — the value is in how you specify it for agent execution, not in the idea itself. Watch how each section constrains the agent without micromanaging it.",
    },
    {
      type: 'code-demo',
      title: 'Bookmark manager spec',
      body: 'This is the actual markdown you would put in a CLAUDE.md file or pass directly to Claude Code. Notice: it says WHAT, not HOW.',
      language: 'markdown',
      filename: 'SPEC.md',
      code: "# Bookmark Manager — Agent Spec\n\n## Goal\nA working web app where users can save, tag, search, and delete bookmarks.\n\n## Constraints\n- Next.js 15 with App Router\n- TypeScript strict mode\n- SQLite via Drizzle ORM (local file DB, no external services)\n- Tailwind CSS for styling\n- No authentication (single-user, local)\n\n## Acceptance Criteria\n- [ ] User can add a bookmark (URL + optional title)\n- [ ] User can assign multiple tags to a bookmark\n- [ ] User can filter bookmarks by tag\n- [ ] User can full-text search bookmarks by title/URL\n- [ ] User can delete a bookmark\n- [ ] All data persists across server restarts\n- [ ] App runs with `npm run dev` after `npm install`\n\n## Technical Boundaries\n- Create a new project from scratch (not modify existing)\n- Use `src/` directory structure\n- Keep all DB logic in `src/db/` directory\n- Use server actions for mutations (no API routes)\n\n## Out of Scope\n- User authentication / multi-tenancy\n- Bookmark import/export\n- Browser extension\n- Favicon fetching\n- Deployment configuration",
    },
    {
      type: 'multiple-choice',
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
      type: 'info',
      title: 'Spec anti-pattern: too vague',
      body: "\"Build me a bookmark manager. Make it good. Use modern tech.\" This tells the agent almost nothing. What is \"good\"? What is \"modern\"? The agent will make dozens of decisions you did not authorize — picking a database, choosing a styling approach, deciding on routing patterns, inventing features. You will spend more time correcting these decisions than you saved by being brief. Vagueness is not delegation — it is abdication.",
    },
    {
      type: 'info',
      title: 'Spec anti-pattern: too prescriptive',
      body: "The opposite failure mode. \"Create a file at src/components/BookmarkCard.tsx. It should export a React component that takes props { url: string, title: string, tags: string[] }. Use a div with className 'card p-4 border rounded-lg'. Inside, render an anchor tag...\" You are writing code in English. If you know exactly what every line should be, just write the code. A spec should constrain decisions, not eliminate them. Let the agent use its judgment within your boundaries.",
    },
    {
      type: 'info',
      title: 'Spec anti-pattern: missing boundaries',
      body: "A spec with a clear goal and acceptance criteria but no boundaries or scope exclusions. The agent builds everything correctly — then also adds authentication, a REST API, Docker config, CI/CD pipeline, and deployment scripts. It was being helpful. Without explicit boundaries, the agent optimizes for completeness. The Out of Scope section is not optional — it is your defense against scope creep from an eager builder.",
    },
    {
      type: 'multiple-choice',
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
      type: 'info',
      title: 'How the agent receives your spec',
      body: "There are two delivery methods. First: put the spec in CLAUDE.md at the project root. The agent reads this file automatically at the start of every session. This works best for ongoing projects where the spec evolves over time. Second: paste the spec directly into the prompt. This works for one-shot builds where you want the agent to scaffold from scratch. Both are valid — the choice depends on whether the spec is a living document or a one-time instruction.",
    },
    {
      type: 'code-demo',
      title: 'Spec via CLAUDE.md',
      body: 'When building a new project, you often start with the spec in CLAUDE.md so the agent has context on every invocation.',
      language: 'markdown',
      filename: 'CLAUDE.md',
      code: "# Bookmark Manager\n\n## Spec\n[... your full spec here ...]\n\n## Development\n- Run: `npm run dev`\n- Test: `npm test`\n- Lint: `npm run lint`\n\n## Architecture Decisions\n(Agent fills this in as it builds)",
    },
    {
      type: 'code-demo',
      title: 'Spec via direct prompt',
      body: 'For one-shot builds, you paste the spec directly. The agent executes it in a single session.',
      language: 'text',
      filename: 'prompt.txt',
      code: "Build this project from scratch according to the following spec:\n\n[paste your full spec]\n\nStart by creating the project structure, then implement\neach acceptance criterion one at a time. After each one,\nverify it works before moving to the next.",
    },

    // === WORKFLOW DIAGRAM ===
    {
      type: 'diagram',
      title: 'Product Vision to Ship',
      body: 'The full workflow from idea to deployed product. The spec is the bridge between your vision and agent execution.',
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
    },
    {
      type: 'checkpoint',
      xp: 2,
      message: 'Workflow mapped!',
    },

    // === ITERATION ===
    {
      type: 'info',
      title: 'Iterating after first output',
      body: "The agent builds. You review. Something is off — maybe the UI layout is not what you imagined, or the agent chose client-side filtering when you wanted server-side search. This is normal. The iteration cycle is: observe what the agent built, identify the gap between output and intent, update the spec (or give a targeted follow-up prompt), and let the agent revise. Good specs reduce iterations. Perfect specs do not exist. Plan for 2-3 rounds.",
    },
    {
      type: 'info',
      title: 'Targeted follow-ups vs spec rewrites',
      body: "Small corrections do not need a spec rewrite. \"The search should be server-side using SQL LIKE, not client-side filtering\" is a targeted follow-up. But if you realize the whole approach is wrong — you wanted a Chrome extension, not a web app — that requires a spec rewrite. The rule of thumb: if the fix is within the existing boundaries, use a follow-up prompt. If it changes the boundaries themselves, rewrite the spec.",
    },

    // === INTERACTIVE EXERCISES ===
    {
      type: 'order',
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
      type: 'code-input',
      instruction: 'Write one acceptance criterion for a bookmark manager: the user should be able to search bookmarks by title. Write it as a checkbox item starting with "[ ]".',
      placeholder: '[ ] User can...',
      answer: '[ ] User can search bookmarks by title',
      hint: 'Start with "[ ] User can" and describe the searchable field',
    },

    // === FINAL SYNTHESIS ===
    {
      type: 'info',
      title: 'The spec mindset',
      body: "Writing specs is a new skill that feels awkward at first. You are used to expressing ideas through code. Now you express them through constraints and criteria. The payoff is enormous: a well-written spec lets you build in hours what used to take days. But the spec must earn that speed by being precise enough to execute against. Every ambiguity in your spec becomes a decision the agent makes without you. Sometimes that is fine. Sometimes it is expensive to fix. Your job is to know which decisions matter and lock those down.",
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
      message: 'Spec writing mastered! You are ready to direct agents at product scale.',
    },
  ],
}

export default content
