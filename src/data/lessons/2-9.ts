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
      type: 'compare',
      title: 'Writing visual specs that constrain without micromanaging',
      body: 'The same anti-patterns from Lesson 2-1 apply to visual specs. Find the sweet spot.',
      question: 'Which approach gives the agent enough guidance to produce good design?',
      correctSide: 'right',
      left: {
        label: 'Too vague / too prescriptive',
        content: 'TOO VAGUE:\n"Make it look modern."\n"Use good spacing."\n\nTOO PRESCRIPTIVE:\n"Use p-4 gap-3 text-sm font-medium\non every card. Header must be exactly\n64px with a #1a1a1a background."',
        language: 'text',
      },
      right: {
        label: 'Design system constraints',
        content: 'SPACING SYSTEM:\n- Section padding: py-12 to py-16\n- Card padding: p-4 to p-6\n- Inter-card gap: gap-4 to gap-6\n\nHIERARCHY:\n- Page title > Section heading > Card title\n- Max 3 levels of visual nesting\n\nRESPONSIVE:\n- Mobile-first, single column on mobile\n- No horizontal scrolling at any breakpoint',
        language: 'text',
      },
      explanation: 'The sweet spot is a design system constraint — you define the spacing scale, the component hierarchy, the responsive strategy — and let the agent choose specific values within those boundaries. Think of it as handing the agent a ruler and a palette, not a pixel-perfect mockup.',
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'Visual spec patterns locked in!',
    },

    // === EVALUATING OUTPUT ===
    {
      type: 'multiple-choice',
      question: 'Your evaluation of agent UI output has two layers. What is Layer 2?',
      options: [
        'Does it pass TypeScript type checks?',
        'Does it satisfy the spec? (responsive behavior, spacing scale)',
        'Does it look right? (visual flow, breathing room, grouping, focal point)',
        'Does it render without console errors?',
      ],
      correctIndex: 2,
      explanation: "Layer 1 is objective: does it satisfy the spec? Layer 2 is subjective: does it look right? Does the eye flow naturally? Is there enough breathing room? Do related elements feel grouped? Does the page have a clear focal point? Layer 2 cannot be automated. It requires your taste. This is where your value as a director lives.",
    },
    {
      type: 'interactive-diagram',
      title: 'The Taste Filter',
      body: 'Every agent-generated interface passes through your visual judgment before it ships. Click through the stages.',
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
      stages: [
        {
          highlightNodes: ['spec'],
          highlightEdges: [{ from: 'spec', to: 'agent' }],
          explanation: 'Start with your visual spec: spacing scale, typography hierarchy, responsive strategy, and color constraints. This is the rulebook the agent works within.',
        },
        {
          highlightNodes: ['agent'],
          highlightEdges: [{ from: 'agent', to: 'eval' }],
          explanation: 'The agent implements the structure. It will satisfy the spec requirements but may produce tight spacing, flat hierarchy, or broken mobile layouts.',
        },
        {
          highlightNodes: ['eval'],
          highlightEdges: [{ from: 'eval', to: 'accept' }, { from: 'eval', to: 'redirect' }],
          explanation: 'You evaluate on two layers: Layer 1 (spec compliance) is objective. Layer 2 (taste) is subjective — does it look right? This is where your value lives.',
        },
        {
          highlightNodes: ['accept'],
          explanation: 'If both layers pass, ship it. Do not chase pixel-perfection if the user experience is solid.',
        },
        {
          highlightNodes: ['redirect'],
          highlightEdges: [{ from: 'redirect', to: 'agent' }],
          explanation: 'If it needs work, redirect with specific feedback: name the element, the property, and the desired change. Vague feedback wastes iterations.',
        },
      ],
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
      type: 'order',
      instruction: 'Order these visual feedback statements from worst (vaguest) to best (most actionable):',
      items: [
        'Increase the page title from text-2xl to text-3xl and add mb-8 below it to separate it from the content grid',
        'Make the header bigger',
        'The layout feels off',
        'The header needs more visual weight — try increasing font size and adding bottom spacing',
      ],
      correctOrder: [2, 1, 3, 0],
    },
    {
      type: 'compare',
      title: 'Vague feedback vs specific feedback',
      body: 'The way you describe visual issues determines whether the agent can fix them in one round.',
      question: 'Which feedback will the agent execute correctly on the first try?',
      correctSide: 'right',
      left: {
        label: 'Vague',
        content: '"The dashboard looks cramped."\n"Make the cards look better."\n"The spacing feels off."\n"It needs more visual hierarchy."',
        language: 'text',
      },
      right: {
        label: 'Specific',
        content: '"Increase card padding from p-3 to p-6."\n"Add gap-4 between the stat cards."\n"Make the page title text-2xl font-bold."\n"Add a border-b border-foreground/10\n  separator between sections."',
        language: 'text',
      },
      explanation: 'Specific feedback names the element, the property, and the value. The agent executes it in one edit. Vague feedback requires the agent to guess what "better" means — and it will guess wrong.',
    },
    {
      type: 'code-fill',
      instruction: 'Rewrite this vague visual feedback into specific, actionable directives:',
      language: 'text',
      filename: 'feedback-fix.txt',
      template: '# Original: "The cards look weird and cramped"\n# Rewritten:\nIncrease card padding from p-2 to {{card_padding}}.\nAdd {{gap_value}} between the stat cards.\nMake the page title {{title_classes}}.\nAdd a {{separator}} separator between sections.',
      blanks: [
        { id: 'card_padding', answer: 'p-5', alternatives: ['p-6', 'p-4'], placeholder: 'new padding?', hint: 'Generous padding in the p-4 to p-6 range' },
        { id: 'gap_value', answer: 'gap-4', alternatives: ['gap-5', 'gap-6'], placeholder: 'gap value?', hint: 'Standard inter-card spacing' },
        { id: 'title_classes', answer: 'text-2xl font-bold', alternatives: ['text-3xl font-bold', 'text-xl font-semibold'], placeholder: 'title size + weight?', hint: 'Large and bold to establish hierarchy' },
        { id: 'separator', answer: 'border-b border-foreground/10', alternatives: ['border-b border-gray-200', 'border-b border-foreground/5'], placeholder: 'border separator?', hint: 'A subtle horizontal line' },
      ],
      explanation: 'Every piece of visual feedback should reference a specific element, property, and desired change. Specific feedback is one iteration. Vague feedback is three.',
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
      type: 'multiple-choice',
      question: 'Which of these six common agent UI issues is the MOST impactful on usability?',
      options: [
        'Tight padding (minimal spacing)',
        'Flat hierarchy (all text similar size and weight)',
        'Inconsistent interactive states (some buttons have hover, others do not)',
        'Broken responsive flow (stacks awkwardly on mobile)',
      ],
      correctIndex: 1,
      explanation: "Flat hierarchy is the most impactful because it destroys the user's ability to scan and navigate. When page titles, section headings, and card titles all look the same, users cannot distinguish structure. The other five issues (tight padding, missing grouping, overloaded layouts, inconsistent states, broken responsive) also recur but hierarchy is the foundation of visual communication.",
    },
    {
      type: 'code-fill',
      instruction: 'Fix this flat typographic hierarchy. Each heading level needs distinct size, weight, and style:',
      language: 'tsx',
      filename: 'hierarchy-fix.tsx',
      template: '// Clear hierarchy — distinct size + weight at each level\n<h1 className="{{h1_classes}}">Dashboard</h1>\n<h2 className="{{h2_classes}}">Recent Activity</h2>\n<h3 className="{{h3_classes}}">Card Title</h3>',
      blanks: [
        { id: 'h1_classes', answer: 'text-3xl font-bold tracking-tight', alternatives: ['text-3xl font-bold', 'text-4xl font-bold tracking-tight'], placeholder: 'page title classes?', hint: 'Largest and boldest — the page title' },
        { id: 'h2_classes', answer: 'text-xl font-semibold text-muted-foreground', alternatives: ['text-xl font-semibold', 'text-lg font-semibold text-muted-foreground'], placeholder: 'section heading classes?', hint: 'Medium size, slightly muted to show it is secondary' },
        { id: 'h3_classes', answer: 'text-sm font-medium uppercase tracking-wide', alternatives: ['text-sm font-medium uppercase', 'text-xs font-semibold uppercase tracking-wide'], placeholder: 'card title classes?', hint: 'Small, uppercase, and wide-tracked for a label feel' },
      ],
      explanation: 'Hierarchy comes from contrast between levels. Page title: large and bold. Section heading: medium and muted. Card title: small, uppercase, tracked. Agents default to similar sizing at every level — your job is to enforce distinct visual weight.',
    },
    {
      type: 'match',
      instruction: 'Match each visual issue to its fix:',
      leftItems: ['Everything feels cramped', 'All text looks the same size', 'Related items seem disconnected', 'Buttons too small on mobile'],
      rightItems: ['Increase padding (p-3 → p-6) and gap values', 'Vary font size and weight (text-sm → text-2xl, font-semibold)', 'Group with borders, shared backgrounds, or tighter spacing', 'Set minimum 44px touch targets (min-h-[44px] min-w-[44px])'],
      correctPairs: { 0: 0, 1: 1, 2: 2, 3: 3 },
      explanation: 'Each visual issue has a mechanical fix. Cramped → more padding. Flat hierarchy → vary text size/weight. Disconnected → group visually. Small targets → 44px minimum.',
    },
    {
      type: 'code-fill',
      instruction: 'Complete the Tailwind classes to fix this cramped, flat card:',
      language: 'tsx',
      filename: 'src/components/stat-card.tsx',
      template: '<div className="rounded-xl border border-foreground/[0.08] {{padding}} {{gap}}">\n  <p className="{{label_size}} text-foreground/50">Revenue</p>\n  <p className="{{value_size}} {{value_weight}}">$12,450</p>\n  <p className="text-xs text-green-500">+12% this week</p>\n</div>',
      blanks: [
        { id: 'padding', answer: 'p-6', alternatives: ['p-5', 'p-8'], placeholder: 'padding?', hint: 'Generous padding: p-5 to p-8' },
        { id: 'gap', answer: 'space-y-2', alternatives: ['space-y-3', 'flex flex-col gap-2'], placeholder: 'vertical spacing?', hint: 'Space between children' },
        { id: 'label_size', answer: 'text-sm', alternatives: ['text-xs'], placeholder: 'label size?', hint: 'Small but readable' },
        { id: 'value_size', answer: 'text-2xl', alternatives: ['text-xl', 'text-3xl'], placeholder: 'value size?', hint: 'The main number should be large' },
        { id: 'value_weight', answer: 'font-bold', alternatives: ['font-semibold'], placeholder: 'value weight?', hint: 'Make it stand out' },
      ],
      explanation: 'Hierarchy comes from contrast: small muted label, large bold value, and small colored trend. Generous padding (p-6) prevents the cramped feeling.',
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'Common issues catalogued!',
    },

    // === GOOD-ENOUGH VS PIXEL-PERFECT ===
    {
      type: 'match',
      instruction: 'Match each visual issue to whether you should fix it or ship it:',
      leftItems: ['Card border is rounded-lg instead of rounded-xl', 'Primary CTA looks identical to a destructive Delete button', 'Gap is gap-4 when gap-5 might look slightly better', 'Navigation hierarchy is completely flat — users cannot find key actions'],
      rightItems: ['FIX: Usability problem, users cannot distinguish safe from dangerous', 'SHIP: Preference difference, not a user experience impact', 'SHIP: Marginal improvement, not worth an iteration', 'FIX: Navigation confusion will cause real user friction'],
      correctPairs: { 0: 1, 1: 0, 2: 2, 3: 3 },
      explanation: "The rule: if a visual issue would make you hesitate to show this to a user, fix it. If you only notice it because you are staring at it, ship it. Taste is important, but perfectionism is expensive. Each iteration burns tokens, context, and your attention.",
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
      type: 'multiple-choice',
      question: 'You open dev tools and resize to 375px. Which of these is a FUNCTIONAL failure, not just a cosmetic issue?',
      options: [
        'Cards are in a single column instead of the desktop 3-column grid',
        'Font sizes are slightly smaller than desktop',
        'Tap targets (buttons, links) are smaller than 44px and difficult to press',
        'The sidebar is hidden behind a hamburger menu',
      ],
      correctIndex: 2,
      explanation: "Agents often get desktop right and ignore mobile. Tap targets below 44px are functional failures — users physically cannot tap them reliably. Content overflow, missing CTAs above the fold, and text truncation are also functional, not cosmetic. Single-column layout and hidden sidebars are correct mobile adaptations, not failures.",
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
      type: 'multiple-choice',
      question: 'As AI agents get more capable at generating interfaces, what skill becomes MORE valuable, not less?',
      options: [
        'Writing CSS from scratch',
        'Memorizing Tailwind class names',
        'Visual taste — judging what looks right, feels balanced, and communicates hierarchy',
        'Speed-typing HTML markup',
      ],
      correctIndex: 2,
      explanation: "Agents will get faster at generating interfaces. But taste — the judgment of what looks right, what feels balanced, what communicates hierarchy — remains human. Your value is not checking boxes. It is the visual judgment that turns a compliant interface into one users enjoy. Develop this muscle: look at interfaces critically, name what bothers you specifically, and direct corrections with precision.",
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
