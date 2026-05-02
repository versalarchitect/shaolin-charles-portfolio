import type { LessonContent } from './types'

const content: LessonContent = {
  lessonId: '4-9',
  steps: [
    // === INTRODUCTION ===
    {
      type: 'info',
      title: 'Everything else will be automated. Taste will not.',
      body: "Agents can write code, generate tests, scaffold architectures, deploy systems, and fix bugs. Within two years, they will do all of this better than most engineers. What they cannot do — and may never do — is decide what SHOULD exist. Whether this feature is worth building. Whether this abstraction is elegant or merely clever. Whether this interface respects the user or just serves the developer. Taste is the human judgment that separates functional output from excellent output. It is the last irreplaceable skill.",
    },
    {
      type: 'info',
      title: 'What taste means in engineering',
      body: "Taste is not subjective aesthetic preference. In engineering, taste is the ability to evaluate beyond correctness. Code can work perfectly and still be bad — over-abstracted, prematurely optimized, inconsistent with the system's voice, or solving a problem that should not exist. Taste is knowing: this works, but is it RIGHT? Is it simple where it should be simple? Is it robust where it matters? Does it fit the system's existing patterns or fight them? These questions have answers — but they require judgment, not computation.",
    },

    // === THE TASTE FILTER ===
    {
      type: 'diagram',
      title: 'The Taste Filter',
      body: 'Agents produce functional output. Your taste filter elevates it to excellent output.',
      diagram: {
        direction: 'LR',
        nodes: [
          { id: 'agent', label: 'Agent Output', sublabel: 'Functional, correct', shape: 'rect' },
          { id: 'taste', label: 'Your Taste Filter', sublabel: 'Judgment + experience', shape: 'diamond', highlight: true },
          { id: 'excellent', label: 'Excellent Output', sublabel: 'Elegant, coherent, right', shape: 'rounded', highlight: true },
          { id: 'iterate', label: 'Iterate', sublabel: 'Refine spec, regenerate', shape: 'pill' },
        ],
        edges: [
          { from: 'agent', to: 'taste' },
          { from: 'taste', to: 'excellent', label: 'passes' },
          { from: 'taste', to: 'iterate', label: 'not yet', dashed: true },
          { from: 'iterate', to: 'agent', dashed: true },
        ],
      },
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'Taste as a filter — understood!',
    },

    // === DIMENSIONS OF TASTE ===
    {
      type: 'info',
      title: 'Dimension 1: Simplicity',
      body: "An agent asked to build a notification system will often produce a comprehensive solution: multiple notification channels, a queue, retry logic, templates, user preferences, delivery tracking. All functional. But if your app has 200 users and needs email notifications for password resets — that solution is a liability, not an asset. Taste says: a single function that calls SendGrid is correct. The agent produced what was asked for. Taste decides what SHOULD have been asked for.",
    },
    {
      type: 'info',
      title: 'Dimension 2: Coherence',
      body: "Your codebase uses functional patterns: pure functions, composition, immutable data. The agent writes a class with mutable state. It works. Tests pass. But it violates the system's voice. Six months from now, someone reads this class and assumes classes are acceptable here — now you have two patterns. Taste enforces consistency not because one style is better, but because mixed styles create cognitive overhead for every future reader (human or agent).",
    },
    {
      type: 'info',
      title: 'Dimension 3: Proportionality',
      body: "Is this solution proportional to the problem? A 500-line abstraction to avoid repeating 3 lines of code is disproportionate. A hand-rolled state machine for a two-state toggle is disproportionate. Taste calibrates the investment of complexity against the severity of the problem. Agents cannot do this because they do not feel the ongoing cost of maintaining complex code — they only see the immediate problem being solved.",
    },
    {
      type: 'multiple-choice',
      question: 'An agent creates a 200-line generic form validation library to validate 3 forms in your app. Each form has 2-4 fields. What does taste tell you?',
      options: [
        'Approve it — reusable libraries are always good engineering',
        'Reject it — the abstraction is disproportionate to the problem; inline validation per form is simpler and sufficient',
        'Approve but add tests — complex code needs coverage',
        'Reject because it was not in the spec',
      ],
      correctIndex: 1,
      explanation: 'Three simple forms with a few fields each do not justify a generic validation library. The library solves a problem you do not have (many complex forms). Inline validation is proportional: easy to read, easy to change, zero abstraction overhead. The agent optimized for reusability. Taste optimizes for proportionality.',
    },
    {
      type: 'checkpoint',
      xp: 5,
      message: 'Taste dimensions internalized!',
    },

    // === ELEGANCE VS CLEVERNESS ===
    {
      type: 'info',
      title: 'Elegance is not cleverness',
      body: "Agents love clever solutions. One-liners that chain 6 array methods. Type gymnastics that infer everything. Recursive templates that generate themselves. These are impressive feats of programming — and terrible production code. Elegance is the OPPOSITE of cleverness. Elegance is when the solution is so simple that it feels obvious in retrospect. When you read elegant code, you think 'of course.' When you read clever code, you think 'what?'",
    },
    {
      type: 'code-demo',
      title: 'Clever vs Elegant',
      body: 'The clever version is impressive. The elegant version is maintainable. Taste always chooses the latter.',
      language: 'typescript',
      filename: 'comparison.ts',
      code: "// CLEVER: Agent-generated one-liner\nconst grouped = items.reduce((acc, item) => \n  ({ ...acc, [item.category]: [...(acc[item.category] ?? []), item] }), \n  {} as Record<string, Item[]>\n)\n\n// ELEGANT: Human-curated clarity\nconst grouped: Record<string, Item[]> = {}\nfor (const item of items) {\n  if (!grouped[item.category]) {\n    grouped[item.category] = []\n  }\n  grouped[item.category].push(item)\n}",
    },
    {
      type: 'multiple-choice',
      question: 'Which quality makes the "elegant" version better for a production codebase?',
      options: [
        'It is faster at runtime',
        'It uses fewer advanced JavaScript features, making it readable by any team member and debuggable in any context',
        'It has more lines of code which means it is more thorough',
        'The for-loop is more traditional',
      ],
      correctIndex: 1,
      explanation: 'The elegant version is readable by anyone who knows basic programming. It is debuggable with a breakpoint on any line. It fails in obvious ways. The clever version requires understanding reduce, spread, nullish coalescing, and type assertions — all in one expression. Runtime performance is identical. Readability is not.',
    },

    // === YOUR AESTHETIC AS FILTER ===
    {
      type: 'info',
      title: 'Developing your aesthetic',
      body: "Taste is not innate — it is developed through exposure and practice. Read excellent codebases (Go standard library, SQLite source, Redis internals). Notice what makes them satisfying: clarity, consistency, proportion. Then apply that standard to agent output. Over time, you develop an internal sense of 'this is right' that fires before you can articulate why. That sense is your competitive advantage — it is pattern recognition trained on thousands of evaluated examples.",
    },
    {
      type: 'info',
      title: 'The curation role',
      body: "In an agent-augmented world, your role shifts from producer to curator. A museum curator does not paint — they decide what goes on the wall and what goes in storage. They create coherence from a collection of individual works. You do the same: agents produce. You select, arrange, and refine. The final system reflects your taste, not the agent's. This is not laziness — curation at the system level requires more judgment than writing any individual component.",
    },
    {
      type: 'multiple-choice',
      question: 'Two agents produce working solutions to the same problem. Solution A is 40 lines with clear variable names and a comment explaining WHY. Solution B is 15 lines using advanced TypeScript features. Both pass all tests. Which do you ship?',
      options: [
        'Solution B — less code is always better',
        'Solution A — clarity and intent documentation make it maintainable by future agents and humans alike',
        'Neither — write a third solution yourself',
        'Whichever the agents agree is better',
      ],
      correctIndex: 1,
      explanation: 'Less code is not the goal. Clear code is the goal. Solution A communicates intent, is debuggable, and can be modified by any future agent or human without deep TypeScript knowledge. The WHY comment gives context that the code alone cannot. This is a taste decision: optimizing for long-term system health over short-term cleverness.',
    },
    {
      type: 'checkpoint',
      xp: 5,
      message: 'Curation mindset activated!',
    },

    // === WHAT TO CUT ===
    {
      type: 'info',
      title: 'Taste is knowing what to cut',
      body: "An agent will never say 'do not build this feature.' It will never suggest removing a component. It optimizes for completeness — more is better in its training distribution. But the best products are defined by what they EXCLUDE. Taste is the courage to cut: this feature is technically possible and someone asked for it and the agent built it perfectly — and it still should not exist because it complicates the product without proportional value.",
    },
    {
      type: 'info',
      title: 'The feature test',
      body: "Before shipping any agent-built feature, apply the feature test. One: if this feature disappeared tomorrow, would users notice within a week? Two: does this feature make the core experience better or does it dilute attention? Three: does this feature require ongoing maintenance disproportionate to its usage? If the answers are no, dilutes, and yes — cut it. The agent built it well. You are cutting it wisely. Production is what taste lets through, not what ability can produce.",
    },
    {
      type: 'multiple-choice',
      question: 'An agent builds a beautiful dark mode toggle with three themes (light, dark, system) and smooth transitions. Your app is an internal admin dashboard used by 4 people during business hours. Ship it?',
      options: [
        'Yes — it is well-built and users might appreciate it',
        'No — it adds maintenance surface for zero meaningful value in this context',
        'Yes but simplify to just two themes',
        'Ask the 4 users if they want it',
      ],
      correctIndex: 1,
      explanation: 'The feature is well-built but disproportionate. Four internal users on a business-hours tool do not need theme support. Every theme creates a maintenance obligation: every new component must be tested in all themes, every color must have variants. The agent built it correctly. Taste says: the cost of maintaining it exceeds the value. Cut it.',
    },
    {
      type: 'checkpoint',
      xp: 5,
      message: 'Knowing what to cut — the hardest taste call!',
    },

    // === TASTE IN PRACTICE ===
    {
      type: 'info',
      title: 'Building a taste rubric',
      body: "Make your taste explicit. Before reviewing agent output, write down your evaluation criteria: Is it proportional? Is it coherent with the existing system? Is it simple enough that the next person (or agent) can understand it in 30 seconds? Does it solve a problem worth solving? When you have a rubric, you are not relying on mood — you are applying consistent judgment. Over time, this rubric evolves as your taste refines.",
    },
    {
      type: 'code-demo',
      title: 'Taste rubric for agent output review',
      body: 'Apply this rubric to every significant piece of agent-generated code before merging. Not every item applies to every change — but scanning the list catches the majority of taste failures.',
      language: 'markdown',
      filename: 'REVIEW_RUBRIC.md',
      code: "# Agent Output Review Rubric\n\n## Proportionality (most common taste failure)\n- [ ] Is the solution proportional to the problem?\n- [ ] Could this be done in significantly fewer lines without losing clarity?\n- [ ] Does this abstraction earn its complexity?\n\n## Coherence\n- [ ] Does this match the existing patterns in the codebase?\n- [ ] If it introduces a new pattern, is the old pattern deprecated?\n- [ ] Would a future reader understand the style without context?\n\n## Simplicity\n- [ ] Can I explain this to a colleague in one sentence?\n- [ ] Are there any clever tricks that should be rewritten plainly?\n- [ ] Does it use the simplest tool that solves the problem?\n\n## Necessity\n- [ ] Does this solve a problem that actually exists (not a hypothetical)?\n- [ ] If I deleted this, would anything break within 30 days?\n- [ ] Is the ongoing maintenance cost justified by the usage?",
    },
    {
      type: 'order',
      instruction: 'Order these taste dimensions from MOST impactful to LEAST impactful on long-term system health:',
      items: [
        'Elegance of individual functions',
        'Coherence with existing patterns',
        'Proportionality of solution to problem',
        'Cleverness of implementation',
        'Whether the feature should exist at all',
      ],
      correctOrder: [4, 2, 1, 0, 3],
    },
    {
      type: 'checkpoint',
      xp: 5,
      message: 'Taste rubric established!',
    },

    // === THE IRREPLACEABLE SKILL ===
    {
      type: 'info',
      title: 'Why this is the moat',
      body: "Code generation will become commoditized. Testing will be automated. Deployment will be autonomous. What cannot be automated is the judgment about what to build, how simple to make it, and when to say no. That judgment — taste — is trained over years of building, shipping, maintaining, and seeing the consequences of decisions. It cannot be distilled into a prompt. It cannot be taught to a model. It is experiential, contextual, and deeply human. Invest in it relentlessly.",
    },
    {
      type: 'info',
      title: 'The practitioner who has taste',
      body: "They review agent output and immediately see: this abstraction will not survive the next feature request. They look at a proposed architecture and feel: this will become a maintenance burden in 6 months. They evaluate a feature and know: this dilutes the product without adding proportional value. They cannot always articulate WHY in real-time — the judgment fires faster than the explanation. But they are right often enough that their team trusts the instinct. This is where you are heading.",
    },
    {
      type: 'checklist',
      title: 'Taste development checklist:',
      items: [
        'I evaluate agent output beyond functional correctness',
        'I apply simplicity, coherence, and proportionality as quality dimensions',
        'I choose elegance over cleverness in every review',
        'I have the courage to cut features that work but should not exist',
        'I maintain a review rubric and apply it consistently',
        'I understand that taste is my long-term competitive advantage',
        'I actively study excellent codebases to refine my internal standards',
      ],
    },
    {
      type: 'checkpoint',
      xp: 12,
      message: 'Taste is the moat. You are building the one skill that cannot be automated.',
    },
  ],
}

export default content
