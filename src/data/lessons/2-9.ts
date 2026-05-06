import type { LessonContent } from './types'

const content: LessonContent = {
  lessonId: '2-9',
  steps: [
    // === INTRODUCTION ===
    {
      type: 'info',
      title: 'Your eye for design is what AI cannot replace',
      body: "You can write a perfect spec — every acceptance criterion met, every boundary respected — and still get an interface that feels wrong. The card padding is cramped, the hierarchy is unclear, the spacing rhythm is off. This is the gap between spec compliance and good design. Agents are excellent at implementing structure but mediocre at visual judgment. That is your job: you are the taste filter between the agent's output and what ships to users.",
    },
    {
      type: 'info',
      title: 'Why this matters now',
      body: "In previous lessons you verified functionality: does the feature work? Does it pass tests? Now you verify aesthetics: does it look right? This is not vanity — it is usability. Poor spacing confuses hierarchy. Inconsistent sizing breaks scanning patterns. Bad contrast kills readability. Users do not separate 'it works' from 'it looks right.' They experience the interface as a whole. Your visual judgment is a competitive advantage that agents cannot replicate.",
    },

    // === WRITING VISUAL SPECS ===
    {
      type: 'info',
      title: 'Writing visual specs that constrain without micromanaging',
      body: "The same anti-patterns from Lesson 2-1 apply here. Too vague: 'make it look modern.' Too prescriptive: 'use p-4 gap-3 text-sm font-medium.' The sweet spot is a design system constraint — you define the spacing scale, the component hierarchy, the responsive strategy — and let the agent choose specific values within those boundaries. Think of it as handing the agent a ruler and a palette, not a pixel-perfect mockup.",
    },
    {
      type: 'code-demo',
      title: 'Visual spec: design system constraints',
      body: 'This constrains visual decisions without dictating every class. The agent has a system to work within.',
      language: 'markdown',
      filename: 'SPEC.md',
      code: "## Visual Design Constraints\n\n### Responsive Strategy\n- Mobile-first: design for 375px, then enhance for 768px+\n- Single column on mobile, max 2 columns on tablet, 3 on desktop\n- No horizontal scrolling at any breakpoint\n\n### Component Hierarchy\n- Page title → Section headings → Card titles → Body text\n- Max 3 levels of visual nesting\n- Cards are the primary content container\n\n### Spacing System\n- Use Tailwind's default scale (4px increments)\n- Section padding: py-12 to py-16\n- Card padding: p-4 to p-6\n- Inter-card gap: gap-4 to gap-6\n- Never less than p-3 inside interactive elements\n\n### Color & Contrast\n- Monochromatic palette (grays + one accent)\n- Text must meet WCAG AA contrast (4.5:1 body, 3:1 large text)\n- Interactive elements must have visible focus states",
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'Visual spec patterns locked in!',
    },

    // === EVALUATING OUTPUT ===
    {
      type: 'info',
      title: 'Evaluating agent UI output',
      body: "The agent delivers a working interface. Your evaluation has two layers. Layer 1: Does it satisfy the spec? Check responsive behavior, component hierarchy, spacing scale compliance. This is objective. Layer 2: Does it look right? This is subjective — and it is where your taste matters. Does the eye flow naturally? Is there enough breathing room? Do related elements feel grouped? Does the page have a clear focal point? Layer 2 cannot be automated. It requires you.",
    },
    {
      type: 'diagram',
      title: 'The Taste Filter',
      body: 'Every agent-generated interface passes through your visual judgment before it ships.',
      diagram: {
        direction: 'LR',
        nodes: [
          { id: 'spec', label: 'Visual Spec', sublabel: 'Your design constraints', shape: 'pill' },
          { id: 'agent', label: 'Agent Renders', sublabel: 'Implements structure', shape: 'rect' },
          { id: 'eval', label: 'You Evaluate', sublabel: 'Taste filter', shape: 'diamond', highlight: true },
          { id: 'accept', label: 'Accept', sublabel: 'Ship it', shape: 'pill', highlight: true },
          { id: 'redirect', label: 'Redirect', sublabel: 'Specific feedback', shape: 'rounded' },
        ],
        edges: [
          { from: 'spec', to: 'agent' },
          { from: 'agent', to: 'eval' },
          { from: 'eval', to: 'accept', label: 'looks right' },
          { from: 'eval', to: 'redirect', label: 'needs work' },
          { from: 'redirect', to: 'agent', dashed: true },
        ],
      },
    },
    {
      type: 'multiple-choice',
      question: 'An agent delivers a dashboard that meets all acceptance criteria. The cards have p-2 padding and gap-1 between them. Everything is technically correct but feels cramped. What do you do?',
      options: [
        'Accept it — the spec is satisfied',
        'Rewrite the entire visual spec from scratch',
        'Give specific feedback: "Increase card padding to p-4 and inter-card gap to gap-4 for better readability"',
        'Ask the agent to "make it look better"',
      ],
      correctIndex: 2,
      explanation: 'Spec compliance is necessary but not sufficient. The visual does not pass the taste filter. Give specific, actionable feedback referencing exact properties and values. "Make it look better" is too vague — it will produce random changes.',
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'Evaluation skills sharpening!',
    },

    // === SPECIFIC VISUAL FEEDBACK ===
    {
      type: 'info',
      title: 'Giving specific visual feedback',
      body: "Vague feedback wastes iterations. 'The layout feels off' gives the agent nothing to work with. It will make random adjustments hoping to satisfy you. Specific feedback names the property, the element, and the direction of change. Compare: 'make the header bigger' versus 'increase the page title from text-2xl to text-3xl and add mb-8 below it to separate it from the content grid.' The second is one iteration. The first is three.",
    },
    {
      type: 'code-demo',
      title: 'Bad vs good visual feedback',
      body: 'Every piece of visual feedback should reference a specific element, property, and desired change.',
      language: 'text',
      filename: 'feedback-examples.txt',
      code: "❌ BAD FEEDBACK (vague, multi-interpretation)\n\"The cards look weird\"\n\"Make it more spacious\"\n\"The page feels cluttered\"\n\"Fix the alignment\"\n\"Make it look more professional\"\n\n✅ GOOD FEEDBACK (specific, actionable)\n\"Increase card padding from p-2 to p-5\"\n\"The sidebar is 320px — reduce to 256px so content area breathes\"\n\"Add a border-b border-gray-200 below the nav to separate it from content\"\n\"The CTA button is the same size as secondary actions — make it h-12 px-8 vs h-9 px-4\"\n\"Move the filter bar above the grid, not inside the sidebar — it's a primary action\"",
    },
    {
      type: 'multiple-choice',
      question: 'Which feedback will produce the best result in a single iteration?',
      options: [
        '"The form needs work"',
        '"Make the form inputs larger and add more space between them"',
        '"Increase form input height to h-11, set gap-y-5 between fields, and add a pt-6 above the submit button to visually separate it from the fields"',
        '"The form should look like the Stripe checkout form"',
      ],
      correctIndex: 2,
      explanation: 'The third option names exact elements (inputs, fields, submit button), exact properties (height, gap, padding), and exact values (h-11, gap-y-5, pt-6). The agent can execute this in one pass without interpretation.',
    },

    // === COMMON VISUAL ISSUES ===
    {
      type: 'info',
      title: 'The six visual issues agents produce most often',
      body: "After reviewing hundreds of agent-generated interfaces, six problems recur. (1) Tight padding — agents default to minimal spacing. (2) Flat hierarchy — all text is similar size and weight. (3) Missing group separation — related items are not visually clustered. (4) Overloaded layouts — too many elements competing for attention. (5) Inconsistent interactive states — some buttons have hover effects, others do not. (6) Broken responsive flow — stacks awkwardly on mobile. Train yourself to scan for these six issues first.",
    },
    {
      type: 'code-demo',
      title: 'Fixing flat hierarchy',
      body: 'Agents often make page titles, section titles, and card titles too similar in size. Enforce a clear typographic scale.',
      language: 'tsx',
      filename: 'hierarchy-fix.tsx',
      code: "// BEFORE: Flat hierarchy — everything looks the same weight\n<h1 className=\"text-xl font-medium\">Dashboard</h1>\n<h2 className=\"text-lg font-medium\">Recent Activity</h2>\n<h3 className=\"text-base font-medium\">Card Title</h3>\n\n// AFTER: Clear hierarchy — distinct size + weight at each level\n<h1 className=\"text-3xl font-bold tracking-tight\">Dashboard</h1>\n<h2 className=\"text-xl font-semibold text-muted-foreground\">Recent Activity</h2>\n<h3 className=\"text-sm font-medium uppercase tracking-wide\">Card Title</h3>",
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'Common issues catalogued!',
    },

    // === GOOD-ENOUGH VS PIXEL-PERFECT ===
    {
      type: 'info',
      title: 'When to accept good-enough vs push for pixel-perfect',
      body: "Taste is important. Perfectionism is expensive. The question is not 'is this perfect?' but 'will fixing this noticeably improve the user experience?' A 2px padding difference — probably not. A missing visual hierarchy that confuses navigation — absolutely. Your time has a cost. Each iteration burns tokens, context, and your attention. The rule: if a visual issue would make you hesitate to show this to a user, fix it. If you only notice it because you are staring at it, ship it.",
    },
    {
      type: 'multiple-choice',
      question: 'Which issue is worth another iteration to fix?',
      options: [
        'Card border radius is rounded-lg instead of your preferred rounded-xl',
        'The primary CTA button is visually identical to a destructive "Delete" action — same size, same prominence',
        'Inter-card gap is gap-4 when gap-5 might look slightly better',
        'The font weight on a label is font-medium instead of font-semibold',
      ],
      correctIndex: 1,
      explanation: 'A primary action being visually identical to a destructive action is a usability problem — users cannot distinguish safe from dangerous at a glance. The other issues are preference differences that do not meaningfully affect user experience.',
    },

    // === HANDS-ON EXERCISES ===
    {
      type: 'terminal',
      instruction: 'Create a visual spec file that defines your spacing system, typography scale, and component hierarchy for a feedback board app.',
      expectedCommand: 'claude "Create a file at VISUAL_SPEC.md with: Spacing System (section padding py-16, card padding p-5 to p-6, gap-4 to gap-6), Typography Scale (page title text-3xl font-bold, section heading text-xl font-semibold, card title text-base font-medium, body text-sm), Component Hierarchy (page > section > card > content). Mobile-first responsive strategy."',
      hint: 'Direct the agent to create a visual spec markdown file with your design system constraints.',
    },
    {
      type: 'terminal',
      instruction: 'Now direct the agent to build a card component that follows your visual spec. Constrain the spacing without dictating every class.',
      expectedCommand: 'claude "Build a FeedbackCard component following VISUAL_SPEC.md. It displays: title (card title scale), description (body scale), vote count, and status badge. Card padding must follow the spec. Include hover state with subtle border color change. Mobile: full width. Desktop: works in a 3-column grid."',
      hint: 'Reference the visual spec file and describe the card contents and behavior — let the agent choose specific implementation within your constraints.',
    },
    {
      type: 'terminal',
      instruction: 'The agent delivered the card with p-3 padding and no visual separation between the title and description. Give specific corrective feedback.',
      expectedCommand: 'claude "Fix the FeedbackCard: increase padding from p-3 to p-5, add mb-2 below the title to separate it from description, and ensure the vote count has a bg-muted rounded-md px-2 py-1 treatment to distinguish it from plain text."',
      hint: 'Name the exact element, the current problem, and the specific fix with Tailwind values.',
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'Visual direction skills in action!',
    },

    // === RESPONSIVE EVALUATION ===
    {
      type: 'info',
      title: 'Evaluating responsive behavior',
      body: "Agents often get desktop right and ignore mobile. Or they stack everything vertically on mobile without considering thumb reach, text truncation, or touch targets. Your visual spec should define breakpoint behavior, but you still need to verify it. Open dev tools, resize to 375px wide, and check: Does content overflow? Are tap targets at least 44px? Does the most important action remain visible without scrolling? These are not cosmetic issues — they are functional failures on mobile.",
    },
    {
      type: 'multiple-choice',
      question: 'You resize the agent-built interface to 375px and the primary action button is below the fold, requiring a scroll. The agent technically did not violate any spec. What do you do?',
      options: [
        'Accept it — mobile UX is a stretch goal',
        'Add a spec constraint: "Primary CTA must be visible without scrolling on mobile viewport" and have the agent fix it',
        'Rewrite the entire component from scratch yourself',
        'Tell the agent to "make it mobile-friendly"',
      ],
      correctIndex: 1,
      explanation: 'This is a case where your evaluation reveals a gap in the spec. Add the constraint explicitly so the agent knows what "visible on mobile" means, then have it fix the layout. This improves both the current output and the spec for future iterations.',
    },

    // === SYNTHESIS ===
    {
      type: 'info',
      title: 'Your role: the taste layer',
      body: "Agents will get faster and more capable at generating interfaces. But taste — the judgment of what looks right, what feels balanced, what communicates hierarchy — remains human. Your value in directing agent-built interfaces is not checking boxes. It is the visual judgment that turns a compliant interface into one that users actually enjoy using. Develop this muscle: look at interfaces critically, name what bothers you specifically, and direct corrections with precision.",
    },
    {
      type: 'checklist',
      title: 'Visual direction checklist:',
      items: [
        'I can write visual specs that constrain without micromanaging',
        'I evaluate agent output on two layers: spec compliance AND taste',
        'I give specific feedback with element names, properties, and values',
        'I recognize the six common visual issues agents produce',
        'I know when good-enough is acceptable vs when to push for better',
        'I check responsive behavior at real device widths',
      ],
    },
    {
      type: 'checkpoint',
      xp: 8,
      message: 'Visual direction learned! Your design judgment is the final quality check AI cannot do.',
    },
  ],
}

export default content
