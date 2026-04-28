import type { LessonContent } from './types'

const content: LessonContent = {
  lessonId: '1-5',
  steps: [
    // === INTRO ===
    {
      type: 'info',
      title: 'Vague prompts produce vague code',
      body: "You have learned how models process text and manage context. Now comes the discipline that separates productive agent sessions from frustrating ones: writing a spec before you build. Principle 2 of directing AI agents is simple -- spec before you build. A spec is a short document that tells the agent exactly what to build, what constraints to follow, and how to know when it is done. Without one, you are gambling that the agent interprets your intent correctly.",
    },
    {
      type: 'info',
      title: 'The cost of skipping a spec',
      body: "Without a spec, a typical agent session looks like this: you ask for a feature, the agent builds something close but not right, you correct it, it overcorrects, you correct again, and thirty minutes later you have burned through half your context window on revisions. The spec eliminates most of that ping-pong. Fifteen minutes of writing saves an hour of debugging.",
    },

    // === WHAT A SPEC IS NOT ===
    {
      type: 'info',
      title: 'What a spec is NOT',
      body: "A spec is not a novel. It is not a product requirements document with stakeholder analysis and market research. It is not a 20-page PRD. Those documents are written for humans who need organizational context. Your agent does not need to know why the business wants this feature. It needs to know exactly what to build, what inputs it receives, what outputs it produces, and when to stop.",
    },
    {
      type: 'multiple-choice',
      question: 'Which of these belongs in a spec for an AI agent?',
      options: [
        'Market research on competitor products',
        'Acceptance criteria the agent can verify',
        'A history of how the codebase evolved',
        'Stakeholder sign-off requirements',
      ],
      correctIndex: 1,
      explanation: 'Agents need concrete, verifiable criteria -- not business context. Acceptance criteria give the agent a clear checklist to validate its own output against, which is exactly what prevents scope creep and missed requirements.',
    },

    // === WHAT A SPEC IS ===
    {
      type: 'info',
      title: 'What a spec IS',
      body: "A spec is a short document -- typically 20-60 lines of markdown -- with five sections: Title, Goal (one sentence), Inputs, Outputs, Constraints, and Acceptance Criteria. That is it. Each section is concrete and specific. The goal is one sentence. Inputs list exactly what data the feature receives. Outputs describe exactly what the feature produces. Constraints are the guardrails. Acceptance criteria are the checklist that determines done vs. not done.",
    },

    // === DIAGRAM 2: ANATOMY OF A SPEC ===
    {
      type: 'diagram',
      title: 'Anatomy of a Spec',
      body: 'A spec has a clear hierarchy. The spec document decomposes into three parallel concerns -- inputs, outputs, and constraints -- which together define the acceptance criteria.',
      diagram: {
        direction: 'TB',
        nodes: [
          { id: 'spec', label: 'Spec Doc', sublabel: 'Title + Goal', shape: 'rounded', highlight: true },
          { id: 'inputs', label: 'Inputs', sublabel: 'What goes in' },
          { id: 'outputs', label: 'Outputs', sublabel: 'What comes out' },
          { id: 'constraints', label: 'Constraints', sublabel: 'Guardrails' },
          { id: 'criteria', label: 'Acceptance', sublabel: 'Definition of done', shape: 'pill', highlight: true },
        ],
        edges: [
          { from: 'spec', to: 'inputs' },
          { from: 'spec', to: 'outputs' },
          { from: 'spec', to: 'constraints' },
          { from: 'inputs', to: 'criteria' },
          { from: 'outputs', to: 'criteria' },
          { from: 'constraints', to: 'criteria' },
        ],
      },
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'Spec structure understood!',
    },

    // === THE TEMPLATE ===
    {
      type: 'code-demo',
      title: 'The spec template',
      body: 'This is the template you will use for every feature you direct an agent to build. Copy this structure and fill in the blanks. Notice how every section is concrete -- no room for interpretation.',
      language: 'markdown',
      filename: 'spec-template.md',
      code: '# Feature: [Title]\n\n## Goal\n[One sentence describing what this feature does.]\n\n## Inputs\n- [What data does this feature receive?]\n- [What format? What types?]\n- [Where does the data come from?]\n\n## Outputs\n- [What does this feature produce?]\n- [What format? What types?]\n- [Where does the output go?]\n\n## Constraints\n- [Technology restrictions]\n- [Performance requirements]\n- [What this feature must NOT do]\n- [Dependencies or compatibility rules]\n\n## Acceptance Criteria\n- [ ] [Criterion 1 -- specific and verifiable]\n- [ ] [Criterion 2 -- specific and verifiable]\n- [ ] [Criterion 3 -- specific and verifiable]',
    },

    // === REAL EXAMPLE ===
    {
      type: 'info',
      title: 'Example: User Settings Page',
      body: "Let us walk through a real spec. You want an agent to build a user settings page. Without a spec, you might say \"build me a settings page\" and get back a page with random fields, no validation, and data saving to who-knows-where. With a spec, you define exactly what fields appear, what validation rules apply, and where the data persists.",
    },
    {
      type: 'code-demo',
      title: 'A real spec: User Settings Page',
      body: 'Study this spec carefully. Every line removes ambiguity. The agent knows exactly what to build and, critically, what NOT to build.',
      language: 'markdown',
      filename: 'specs/user-settings.md',
      code: '# Feature: User Settings Page\n\n## Goal\nLet users update their display name, email, and notification preferences.\n\n## Inputs\n- Current user profile from Supabase auth (id, email, display_name)\n- User form input: display_name (string), email (string), notify_email (bool)\n\n## Outputs\n- Updated user record in Supabase `profiles` table\n- Toast notification on success/failure\n- No page reload -- optimistic UI update\n\n## Constraints\n- React + TypeScript only, no new dependencies\n- Use existing Button, Input components from @/components/ui\n- Display name: 2-50 chars, alphanumeric + spaces only\n- Email: must pass standard email regex\n- Save to Supabase `profiles` table via existing client\n- Must NOT add password change (separate feature)\n- Must NOT add avatar upload (separate feature)\n\n## Acceptance Criteria\n- [ ] Settings page renders at /settings route\n- [ ] Form loads current values from user profile\n- [ ] Display name validates 2-50 chars\n- [ ] Email validates standard format\n- [ ] Invalid input shows inline error, submit disabled\n- [ ] Save calls Supabase update on profiles table\n- [ ] Success shows toast, updates UI without reload\n- [ ] Failure shows error toast, form retains input',
    },
    {
      type: 'multiple-choice',
      question: 'Why does the spec explicitly say "Must NOT add password change" and "Must NOT add avatar upload"?',
      options: [
        'To save time writing the spec',
        'Because those features are impossible to build',
        'To prevent the agent from adding features beyond the scope',
        'Because the client did not ask for them',
      ],
      correctIndex: 2,
      explanation: 'Explicit exclusions prevent scope creep. Without them, an agent might helpfully add a password change form or avatar upload because those are "typical" settings features. The spec constrains the agent to exactly what you need -- nothing more.',
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'Real-world spec mastered!',
    },

    // === HOW SPECS PREVENT SCOPE CREEP ===
    {
      type: 'info',
      title: 'How specs prevent scope creep',
      body: "Without constraints, agents are eager to help. They will add error boundaries you did not ask for, create utility functions \"just in case,\" add extra UI states, and refactor adjacent code to be \"consistent.\" Each addition seems reasonable in isolation, but together they bloat the output, introduce untested code, and make review harder. A spec with clear acceptance criteria gives the agent a stopping condition. When all criteria are checked, the work is done.",
    },

    // === DIAGRAM 1: SPEC-DRIVEN WORKFLOW ===
    {
      type: 'diagram',
      title: 'Spec-Driven Workflow',
      body: 'The spec sits at the start of an iterative loop. If the output does not match, you refine the spec -- not the code. This keeps the source of truth in the document, not in scattered prompt corrections.',
      diagram: {
        direction: 'LR',
        nodes: [
          { id: 'write', label: 'Write Spec', shape: 'rounded', highlight: true },
          { id: 'build', label: 'Agent Builds' },
          { id: 'review', label: 'Review Output' },
          { id: 'match', label: 'Matches?', shape: 'diamond' },
          { id: 'ship', label: 'Ship', shape: 'pill', highlight: true },
          { id: 'refine', label: 'Refine Spec' },
        ],
        edges: [
          { from: 'write', to: 'build' },
          { from: 'build', to: 'review' },
          { from: 'review', to: 'match' },
          { from: 'match', to: 'ship', label: 'Yes' },
          { from: 'match', to: 'refine', label: 'No', dashed: true },
          { from: 'refine', to: 'build', dashed: true },
        ],
      },
    },
    {
      type: 'info',
      title: 'Refine the spec, not the code',
      body: "When agent output does not match your expectations, resist the urge to manually edit the code or pile on follow-up prompts. Instead, update the spec. Add the missing constraint. Clarify the ambiguous output. Then hand the updated spec back to the agent. This keeps a single source of truth and avoids the context-eating spiral of correction after correction.",
    },

    // === REVIEWING AGAINST A SPEC ===
    {
      type: 'info',
      title: 'How to review agent output',
      body: "Do not review agent output by asking \"does it look right?\" Review it by walking through each acceptance criterion and checking it off. This is binary -- each criterion either passes or fails. There is no \"close enough.\" If a criterion fails, the output is not done. This discipline prevents you from accepting code that works in the happy path but misses edge cases.",
    },
    {
      type: 'order',
      instruction: 'Order these review steps from first to last:',
      items: [
        'Open the acceptance criteria checklist',
        'Test each criterion individually',
        'Mark pass/fail for each criterion',
        'If any fail, update the spec with clarification',
        'Hand updated spec back to the agent',
      ],
      correctOrder: [0, 1, 2, 3, 4],
    },

    // === PRACTICE: WRITE A SPEC ===
    {
      type: 'info',
      title: 'Practice: write your own spec',
      body: "Time to practice. You will write a spec for a simple feature: a dark mode toggle. This toggle should switch the site between light and dark themes. Think about what inputs it receives, what outputs it produces, what constraints apply, and what acceptance criteria you would check.",
    },
    {
      type: 'code-input',
      instruction: 'A spec\'s Goal section should be exactly one sentence. Write a Goal for a dark mode toggle feature:',
      placeholder: 'Allow users to...',
      answer: 'Allow users to switch between light and dark themes with a toggle button in the header',
      hint: 'One sentence: who can do what, where',
    },
    {
      type: 'multiple-choice',
      question: 'Which is the best acceptance criterion for a dark mode toggle?',
      options: [
        'The toggle looks nice',
        'Clicking the toggle updates the theme',
        'Clicking the toggle adds/removes the "dark" class on the html element and persists the choice to localStorage',
        'The dark mode works',
      ],
      correctIndex: 2,
      explanation: 'Good acceptance criteria are specific and verifiable. "Looks nice" and "works" are subjective. The correct answer specifies exactly what happens (class change), where (html element), and what persists (localStorage). An agent can verify all of those programmatically.',
    },

    // === EVALUATE SAMPLE OUTPUT ===
    {
      type: 'info',
      title: 'Evaluating agent output against a spec',
      body: "Let us practice reviewing. Imagine you gave an agent the dark mode spec and it returned code that toggles the theme but does not persist to localStorage, and it also added a color picker for custom accent colors. How do you evaluate this? Walk the acceptance criteria: toggle works (pass), persists to localStorage (fail), only dark/light toggle with no extras (fail -- scope creep). Two failures mean this output is not done.",
    },
    {
      type: 'checklist',
      title: 'Spec review checklist for the dark mode output:',
      items: [
        'Toggle button renders in the header',
        'Clicking toggle switches between light and dark',
        'Theme choice persists to localStorage',
        'Page loads with persisted theme (no flash)',
        'No extra features added (color picker = scope creep)',
        'Uses existing UI components only (no new deps)',
      ],
    },

    // === TERMINAL PRACTICE ===
    {
      type: 'terminal',
      instruction: 'Create a spec file for a feature using Claude Code. Type this command to get started:',
      expectedCommand: 'claude "Write a spec in markdown for a search bar component. Include: Goal, Inputs, Outputs, Constraints, and Acceptance Criteria. Save to specs/search-bar.md"',
      hint: 'Use claude to generate a spec file with all five sections',
    },

    // === FINAL SYNTHESIS ===
    {
      type: 'checklist',
      title: 'Spec writing habits to adopt:',
      items: [
        'Write the spec BEFORE prompting the agent to build',
        'Keep the Goal to one sentence',
        'List inputs with types and sources',
        'List outputs with types and destinations',
        'Add explicit exclusions to prevent scope creep',
        'Write acceptance criteria that are binary pass/fail',
        'Review output by checking criteria, not by feel',
        'When output fails, update the spec first, not the code',
      ],
    },
    {
      type: 'checkpoint',
      xp: 7,
      message: 'Spec writing unlocked! You can now constrain agent output with clear specs.',
    },

    // === FINAL QUIZ ===
    {
      type: 'multiple-choice',
      question: 'An agent builds a feature that works perfectly but includes two extra helper functions you did not ask for. According to spec-driven development, what should you do?',
      options: [
        'Keep them -- extra code is a bonus',
        'Delete the helpers manually',
        'Add "Must NOT create helper functions beyond those specified" to the Constraints section and re-run',
        'Ignore it and move on',
      ],
      correctIndex: 2,
      explanation: 'Spec-driven development means the spec is the source of truth. If the agent added code beyond the spec, the fix is to update the spec with an explicit constraint and re-run. This teaches you to write better specs and prevents the same scope creep next time.',
    },
    {
      type: 'checkpoint',
      xp: 7,
      message: 'Lesson complete! You now write specs that constrain agent output and review like a pro.',
    },
  ],
}

export default content
