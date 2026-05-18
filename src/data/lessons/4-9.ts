import type { LessonContent } from './types'

const content: LessonContent = {
  lessonId: '4-9',
  steps: [
    // === INTRODUCTION ===
    {
      type: 'info',
      title: 'Your taste and judgment: the skill AI cannot replace',
      body: "AI can write code, generate tests, build project structures, deploy systems, and fix bugs. It will only get better at all of this. What it cannot do — and may never do — is decide what SHOULD exist. Whether a feature is worth building. Whether a design is elegant or just complicated. Whether an interface truly serves the user. Taste is the human judgment that separates something that works from something that is actually good. It is your most valuable and irreplaceable skill.",
    },
    {
      type: 'info',
      title: 'What taste means in engineering',
      body: "Taste is not subjective aesthetic preference. In engineering, taste is the ability to evaluate beyond correctness. Code can work perfectly and still be bad — over-abstracted, prematurely optimized, inconsistent with the system's voice, or solving a problem that should not exist. Taste is knowing: this works, but is it RIGHT? Is it simple where it should be simple? Is it robust where it matters? Does it fit the system's existing patterns or fight them? These questions have answers — but they require judgment, not computation.",
    },

    // === THE TASTE FILTER ===
    {
      type: 'interactive-diagram',
      title: 'The Taste Filter',
      body: 'Click through to see how your taste filter transforms functional output into excellent output.',
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
      stages: [
        {
          highlightNodes: ['agent'],
          highlightEdges: [],
          explanation: 'The agent produces output that works. It passes tests, compiles, and does what was asked. But functional correctness is a low bar — it is necessary but not sufficient.',
        },
        {
          highlightNodes: ['agent', 'taste'],
          highlightEdges: [{ from: 'agent', to: 'taste' }],
          explanation: 'Your taste filter evaluates beyond correctness. Is it simple? Is it coherent with existing patterns? Is it proportional to the problem? These questions require judgment, not computation.',
        },
        {
          highlightNodes: ['taste', 'excellent'],
          highlightEdges: [{ from: 'taste', to: 'excellent' }],
          explanation: 'When output passes your taste filter, it is not just functional — it is elegant, coherent with the system, and right for the context. This is the quality bar that separates good products from great ones.',
        },
        {
          highlightNodes: ['taste', 'iterate', 'agent'],
          highlightEdges: [{ from: 'taste', to: 'iterate' }, { from: 'iterate', to: 'agent' }],
          explanation: 'When output does not pass, you iterate: refine the spec, add constraints, and regenerate. Each iteration gets closer to excellent. The taste filter is not a gate — it is a feedback loop.',
        },
      ],
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'Taste as a filter — understood!',
    },

    // === DIMENSIONS OF TASTE ===
    {
      type: 'multiple-choice',
      hint: 'Read each option carefully — one fits the context best.',
      question: 'An agent builds a comprehensive notification system (queue, retry logic, templates, preferences) for an app with 200 users that only needs password reset emails. What does taste say?',
      options: [
        'Ship it — comprehensive solutions are always better',
        'The solution is a liability, not an asset. A single function calling SendGrid is correct. The agent produced what was asked for; taste decides what SHOULD have been asked for.',
        'Add more features since the foundation is there',
        'Keep it but disable the unused features',
      ],
      correctIndex: 1,
      explanation: "Dimension 1: Simplicity. An agent asked to build a notification system will often produce a comprehensive solution. All functional. But if your app has 200 users and needs email notifications for password resets — that solution is a liability, not an asset. Taste says: a single function that calls SendGrid is correct. The agent produced what was asked for. Taste decides what SHOULD have been asked for.",
    },
    {
      type: 'multiple-choice',
      hint: 'Eliminate the options that only partially fit.',
      question: 'Your codebase uses functional patterns (pure functions, composition, immutable data). An agent writes a class with mutable state that works and passes tests. What is the taste problem?',
      options: [
        'Classes are always worse than functions',
        'The agent should have used TypeScript interfaces',
        'It violates the system\'s voice — mixed styles create cognitive overhead for every future reader, and someone will assume classes are acceptable here',
        'Mutable state is always a bug risk',
      ],
      correctIndex: 2,
      explanation: "Dimension 2: Coherence. Taste enforces consistency not because one style is better, but because mixed styles create cognitive overhead for every future reader (human or agent). Six months from now, someone reads this class and assumes classes are acceptable here — now you have two patterns competing.",
    },
    {
      type: 'multiple-choice',
      hint: 'Focus on the primary goal, not secondary benefits.',
      question: 'An agent creates a 500-line abstraction to avoid repeating 3 lines of code. What taste dimension does this violate?',
      options: [
        'Simplicity — the code is too complex',
        'Coherence — it does not match existing patterns',
        'Proportionality — the investment of complexity vastly exceeds the severity of the problem being solved',
        'Necessity — the code is not needed',
      ],
      correctIndex: 2,
      explanation: "Dimension 3: Proportionality. Is this solution proportional to the problem? A 500-line abstraction to avoid repeating 3 lines of code is disproportionate. Taste calibrates the investment of complexity against the severity of the problem. Agents cannot do this because they do not feel the ongoing cost of maintaining complex code — they only see the immediate problem being solved.",
    },
    {
      type: 'multiple-choice',
      hint: 'Think about which option is most specific to this concept.',
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
      type: 'multiple-choice',
      hint: 'Consider what the lesson content emphasized.',
      question: 'An agent produces a one-liner chaining 6 array methods with type gymnastics. It is impressive and correct. Is this elegant code?',
      options: [
        'Yes — fewer lines means better code',
        'No — elegance is the OPPOSITE of cleverness. Elegant code feels obvious in retrospect. When you read it, you think "of course." Clever code makes you think "what?"',
        'Yes — if it passes tests, it is good enough',
        'It depends on the performance characteristics',
      ],
      correctIndex: 1,
      explanation: "Agents love clever solutions. One-liners that chain 6 array methods. Type gymnastics that infer everything. These are impressive feats of programming — and terrible production code. Elegance is the OPPOSITE of cleverness. Elegance is when the solution is so simple that it feels obvious in retrospect. When you read elegant code, you think 'of course.' When you read clever code, you think 'what?'",
    },
    {
      type: 'compare',
      hint: 'Look at the key differences between the two approaches.',
      title: 'Clever code vs Elegant code',
      body: 'The clever version is a dense one-liner with chained operations. The elegant version uses readable, named functions with clear flow. Which would you rather debug at 2am?',
      left: {
        label: 'Clever (Dense)',
        content: '// Agent-generated one-liner\nconst grouped = items\n  .reduce((acc, item) => ({\n    ...acc,\n    [item.category]: [\n      ...(acc[item.category] ?? []),\n      item\n    ]\n  }), {} as Record<string, Item[]>)\n\n// Requires understanding:\n// - reduce with spread\n// - nullish coalescing\n// - type assertions\n// - nested destructuring\n// All in ONE expression',
        language: 'typescript',
        filename: 'clever.ts',
      },
      right: {
        label: 'Elegant (Clear)',
        content: '// Human-curated clarity\nconst grouped: Record<string, Item[]> = {}\n\nfor (const item of items) {\n  if (!grouped[item.category]) {\n    grouped[item.category] = []\n  }\n  grouped[item.category].push(item)\n}\n\n// Any developer can:\n// - Read it instantly\n// - Set a breakpoint on any line\n// - Understand the failure mode\n// - Modify it confidently',
        language: 'typescript',
        filename: 'elegant.ts',
      },
      question: 'Which version would you ship to production?',
      correctSide: 'right',
      explanation: 'The elegant version is readable by anyone who knows basic programming. It is debuggable with a breakpoint on any line. It fails in obvious ways. Runtime performance is identical. The clever version is impressive but creates cognitive overhead for every future reader.',
    },
    {
      type: 'code-diff',
      title: 'Refactoring clever to elegant',
      body: 'Watch a clever implementation transform into an elegant version with named steps and clear flow.',
      language: 'typescript',
      filename: 'refactor-to-elegant.ts',
      before: "// Clever: dense chain that's hard to debug\nconst result = data\n  .filter(x => x.status !== 'deleted')\n  .reduce((acc, x) => ({...acc, [x.id]: x}), {})",
      after: "// Elegant: named steps with clear intent\nfunction getActiveItems(data: Item[]): Item[] {\n  return data.filter(item => item.status !== 'deleted')\n}\n\nfunction indexById(items: Item[]): Record<string, Item> {\n  const index: Record<string, Item> = {}\n  for (const item of items) {\n    index[item.id] = item\n  }\n  return index\n}\n\nconst result = indexById(getActiveItems(data))",
      question: 'What makes the refactored version better for a production codebase?',
      explanation: 'Named functions (getActiveItems, indexById) communicate intent. Each function does one thing and can be tested independently. The composition reads like prose: "index by ID the active items from data." The before version requires mental parsing of reduce with spread syntax.',
    },
    {
      type: 'match',
      hint: 'Find the unique connection between each pair.',
      instruction: 'Match each code quality to its indicator:',
      leftItems: ['Elegant', 'Clever', 'Over-engineered', 'Simple'],
      rightItems: [
        'Readable by a new team member in 30 seconds',
        'Impressive but requires mental gymnastics',
        'Handles edge cases that don\'t exist yet',
        'Does one thing and does it well',
      ],
      correctPairs: { 0: 0, 1: 1, 2: 2, 3: 3 },
      explanation: 'Elegant code is immediately readable. Clever code impresses but burdens readers. Over-engineered code solves hypothetical problems. Simple code does one thing well. In production, elegant and simple win — they minimize cognitive overhead for every future reader and agent.',
    },
    {
      type: 'prompt-lab',
      hint: 'Be specific about what you want — vague prompts get vague responses.',
      instruction: 'Write a prompt asking an agent to refactor clever code into elegant code.',
      scenario: 'An agent produced a dense one-liner that chains filter, reduce, and spread operations to transform an array into a grouped object. It works and passes tests, but no one on the team can read it without pausing for 30 seconds. You need to ask the agent to refactor it for readability.',
      starterPrompt: 'This is fine.',
      responses: [
        {
          triggerKeywords: ['named', 'function', 'readable', 'readability', 'clear', 'step'],
          response: 'I\'ll refactor the one-liner into named functions with clear steps.\n\nPlan:\n1. Extract the filter into `getActiveItems()` with an explicit name\n2. Replace the reduce+spread with a simple for-of loop in `groupByCategory()`\n3. Compose the two: `groupByCategory(getActiveItems(data))`\n4. Each function gets a JSDoc comment explaining intent\n5. Add a unit test per function for independent verification\n\nRefactoring now...',
          quality: 'excellent',
          feedback: 'Excellent. You asked for named functions and readability, and the agent responded with a clear decomposition plan. Each function has a single responsibility, is independently testable, and the composition reads like prose.',
        },
        {
          triggerKeywords: ['refactor', 'simplify', 'clean'],
          response: 'I\'ll clean up the code. Should I:\n- Keep the reduce or switch to a loop?\n- Add comments to explain the one-liner?\n- Split into multiple lines?\n\nLet me know your preference.',
          quality: 'good',
          feedback: 'You indicated refactoring was needed, but the agent still has to ask clarifying questions. Specify what "elegant" means to you: named functions, single-responsibility steps, readable in 30 seconds by any team member.',
        },
      ],
      fallbackResponse: {
        response: 'The current implementation looks correct and all tests pass. The one-liner is efficient and handles the grouping logic in a single expression. I don\'t see any issues to fix.\n\nWould you like me to move on to the next task?',
        feedback: 'Accepting the dense one-liner means every future reader (human or agent) will spend 30 seconds decoding it. A good prompt specifies: break this into named functions, each doing one thing, so anyone can read, debug, and modify it instantly. Taste demands readability over cleverness.',
      },
    },
    {
      type: 'multiple-choice',
      hint: 'One option stands out when you think about the core purpose.',
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
      type: 'compare',
      hint: 'Focus on what makes one approach more appropriate here.',
      title: 'Producer mindset vs Curator mindset',
      body: 'In an agent-augmented world, your role shifts. Which mindset produces better systems?',
      left: {
        label: 'Producer (Write Everything)',
        content: 'You write every line of code yourself.\n\nOutput per day: 200-400 LOC\nQuality: varies with your energy\nConsistency: YOUR patterns only\nBottleneck: YOUR typing speed\n\nThe system reflects your ability\nto produce under time pressure.\n\nLimitation: you are the ceiling.',
        language: 'text',
        filename: 'producer.txt',
      },
      right: {
        label: 'Curator (Select + Refine)',
        content: 'Agents produce. You evaluate.\n\nOutput per day: 2000-5000 LOC reviewed\nQuality: consistent (taste filter applied)\nConsistency: YOUR standards, enforced\nBottleneck: YOUR judgment speed\n\nThe system reflects your taste\napplied to enormous agent output.\n\nAdvantage: judgment scales, typing does not.',
        language: 'text',
        filename: 'curator.txt',
      },
      question: 'Which role produces better systems at scale?',
      correctSide: 'right',
      explanation: "Taste is not innate — it is developed through exposure and practice. Read excellent codebases (Go standard library, SQLite source, Redis internals). In an agent-augmented world, your role shifts from producer to curator. A museum curator does not paint — they decide what goes on the wall. You do the same: agents produce, you select, arrange, and refine. Curation at the system level requires more judgment than writing any individual component.",
    },
    {
      type: 'multiple-choice',
      hint: 'Read each option carefully — one fits the context best.',
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
      type: 'multiple-choice',
      hint: 'Eliminate the options that only partially fit.',
      question: 'An agent will never say "do not build this feature." Why is knowing what to cut the hardest taste skill?',
      options: [
        'Because cutting features wastes the agent\'s work',
        'Because agents optimize for completeness, but the best products are defined by what they EXCLUDE. Taste is the courage to cut something well-built that should not exist.',
        'Because stakeholders always want more features',
        'Because agents cannot build features that should be cut',
      ],
      correctIndex: 1,
      explanation: "An agent will never say 'do not build this feature.' It will never suggest removing a component. It optimizes for completeness — more is better in its training distribution. But the best products are defined by what they EXCLUDE. Taste is the courage to cut: this feature is technically possible and someone asked for it and the agent built it perfectly — and it still should not exist because it complicates the product without proportional value.",
    },
    {
      type: 'multiple-choice',
      hint: 'Focus on the primary goal, not secondary benefits.',
      question: 'Before shipping an agent-built feature, you apply the feature test. The answers are: users would NOT notice if it disappeared, it DILUTES the core experience, and it requires DISPROPORTIONATE maintenance. What do you do?',
      options: [
        'Ship it anyway — someone asked for it',
        'Cut it. The agent built it well. You are cutting it wisely. Production is what taste lets through, not what ability can produce.',
        'Simplify it and ship a reduced version',
        'Ask users if they want it first',
      ],
      correctIndex: 1,
      explanation: "Before shipping any agent-built feature, apply the feature test. One: if this feature disappeared tomorrow, would users notice within a week? Two: does this feature make the core experience better or does it dilute attention? Three: does this feature require ongoing maintenance disproportionate to its usage? If the answers are no, dilutes, and yes — cut it.",
    },
    {
      type: 'multiple-choice',
      hint: 'Think about which option is most specific to this concept.',
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
      type: 'multiple-choice',
      hint: 'Consider what the lesson content emphasized.',
      question: 'Why should you write down evaluation criteria BEFORE reviewing agent output, rather than judging by feel?',
      options: [
        'To create documentation for the team',
        'When you have a rubric, you apply consistent judgment instead of relying on mood. Over time, the rubric evolves as your taste refines.',
        'To slow down the review process and be more careful',
        'Because agents need written criteria to improve',
      ],
      correctIndex: 1,
      explanation: "Make your taste explicit. Before reviewing agent output, write down your evaluation criteria: Is it proportional? Is it coherent with the existing system? Is it simple enough that the next person can understand it in 30 seconds? Does it solve a problem worth solving? When you have a rubric, you are not relying on mood — you are applying consistent judgment.",
    },
    {
      type: 'code-fill',
      hint: 'Fill in values that match the pattern shown above.',
      instruction: 'Complete this taste rubric for reviewing agent output. Fill in the key evaluation questions for each dimension.',
      language: 'markdown',
      filename: 'REVIEW_RUBRIC.md',
      template: '# Agent Output Review Rubric\n\n## Proportionality (most common taste failure)\n- [ ] Is the solution {{proportional_q}}?\n- [ ] Does this abstraction {{complexity_q}}?\n\n## Coherence\n- [ ] Does this match {{pattern_q}}?\n- [ ] Would a future reader {{readability_q}}?\n\n## Necessity\n- [ ] Does this solve a problem that {{exists_q}}?\n- [ ] If I deleted this, would {{deletion_q}}?',
      blanks: [
        { id: 'proportional_q', answer: 'proportional to the problem', alternatives: ['proportional', 'proportionate to the problem', 'sized correctly for the problem'], placeholder: 'proportionality check?', hint: 'Does the solution match the problem size?' },
        { id: 'complexity_q', answer: 'earn its complexity', alternatives: ['justify its complexity', 'warrant its complexity', 'earn the complexity'], placeholder: 'complexity check?', hint: 'Is the abstraction worth the overhead?' },
        { id: 'pattern_q', answer: 'the existing patterns in the codebase', alternatives: ['existing patterns', 'current codebase patterns', 'the existing code style'], placeholder: 'pattern match check?', hint: 'Consistency with what already exists' },
        { id: 'readability_q', answer: 'understand the style without context', alternatives: ['understand it without context', 'read it without extra context', 'understand without explanation'], placeholder: 'readability check?', hint: 'Can someone new understand it immediately?' },
        { id: 'exists_q', answer: 'actually exists', alternatives: ['actually exists (not a hypothetical)', 'is real', 'exists today'], placeholder: 'necessity check?', hint: 'Real problem or hypothetical one?' },
        { id: 'deletion_q', answer: 'anything break within 30 days', alternatives: ['anything break', 'users notice', 'something break in 30 days'], placeholder: 'deletion test?', hint: 'What happens if this code disappears?' },
      ],
      explanation: 'Apply this rubric to every significant piece of agent-generated code before merging. Not every item applies to every change — but scanning the list catches the majority of taste failures. The rubric makes your implicit judgment explicit and consistent.',
    },
    {
      type: 'order',
      hint: 'Consider what depends on what — prerequisites first.',
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
      type: 'multiple-choice',
      hint: 'One option stands out when you think about the core purpose.',
      question: 'Code generation, testing, and deployment will all be automated. What CANNOT be automated?',
      options: [
        'Writing complex algorithms',
        'Debugging production issues',
        'The judgment about what to build, how simple to make it, and when to say no — taste is experiential, contextual, and deeply human',
        'Configuring CI/CD pipelines',
      ],
      correctIndex: 2,
      explanation: "Code generation will become commoditized. Testing will be automated. Deployment will be autonomous. What cannot be automated is the judgment about what to build, how simple to make it, and when to say no. That judgment — taste — is trained over years of building, shipping, maintaining, and seeing the consequences of decisions. It cannot be distilled into a prompt. It cannot be taught to a model. Invest in it relentlessly.",
    },
    {
      type: 'multiple-choice',
      hint: 'Read each option carefully — one fits the context best.',
      question: 'A practitioner with taste reviews agent output and immediately sees "this abstraction will not survive the next feature request." What skill is this?',
      options: [
        'Technical knowledge of design patterns',
        'Pattern recognition trained on years of building, shipping, and seeing consequences — judgment that fires faster than explanation',
        'Pessimism about agent capabilities',
        'Experience with a specific programming language',
      ],
      correctIndex: 1,
      explanation: "The practitioner with taste reviews agent output and immediately sees problems that are not visible in tests or metrics. They look at a proposed architecture and feel it will become a maintenance burden. They evaluate a feature and know it dilutes the product. They cannot always articulate WHY in real-time — the judgment fires faster than the explanation. But they are right often enough that their team trusts the instinct. This is where you are heading.",
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
