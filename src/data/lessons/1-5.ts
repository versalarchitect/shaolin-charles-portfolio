import type { LessonContent } from './types'

const content: LessonContent = {
  lessonId: '1-5',
  steps: [
    // === INTRO ===
    {
      type: 'info',
      title: 'Vague instructions produce vague results',
      body: "Now comes the discipline that separates productive AI sessions from frustrating ones: writing a spec before you build. A spec is a short document that tells the AI exactly what to build, what rules to follow, and how to know when it is done. Without one, you are gambling that the AI correctly guesses what you meant. A spec takes 15 minutes to write and saves hours of back-and-forth corrections.",
    },
    {
      type: 'info',
      title: 'The cost of skipping a spec',
      body: "Without a spec, a typical agent session looks like this: you ask for a feature, the agent builds something close but not right, you correct it, it overcorrects, you correct again, and thirty minutes later you have burned through half your context window on revisions. The spec eliminates most of that ping-pong. Fifteen minutes of writing saves an hour of debugging.",
    },

    // === WHAT A SPEC IS NOT ===
    {
      type: 'multiple-choice',
      hint: 'Read each option carefully — one fits the context best.',
      question: 'What does an AI agent NOT need in a spec?',
      options: [
        'Acceptance criteria it can verify',
        'Specific inputs and outputs',
        'Business context about why stakeholders want the feature',
        'Clear constraints on what not to build',
      ],
      correctIndex: 2,
      explanation: 'A spec is not a product requirements document with stakeholder analysis and market research. Your agent does not need to know why the business wants this feature. It needs to know exactly what to build, what inputs it receives, what outputs it produces, and when to stop.',
    },
    {
      type: 'multiple-choice',
      hint: 'Eliminate the options that only partially fit.',
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
      type: 'multiple-choice',
      hint: 'Focus on the primary goal, not secondary benefits.',
      question: 'How many sections does a good agent spec have, and what are they?',
      options: [
        '3 sections: Title, Description, Code Examples',
        '5 sections: Title/Goal, Inputs, Outputs, Constraints, Acceptance Criteria',
        '2 sections: Requirements and Timeline',
        '7 sections: Executive Summary, Background, Requirements, Design, Timeline, Budget, Appendix',
      ],
      correctIndex: 1,
      explanation: 'A spec is a short document -- typically 20-60 lines of markdown -- with five sections: Title, Goal (one sentence), Inputs, Outputs, Constraints, and Acceptance Criteria. Each section is concrete and specific. The goal is one sentence. Constraints are the guardrails. Acceptance criteria determine done vs. not done.',
    },

    // === DIAGRAM 2: ANATOMY OF A SPEC ===
    {
      type: 'interactive-diagram',
      title: 'Anatomy of a Spec',
      body: 'Click through each layer to understand how a spec decomposes into parallel concerns that together define the acceptance criteria.',
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
      stages: [
        {
          highlightNodes: ['spec'],
          highlightEdges: [],
          explanation: 'Start with the Title and Goal. The goal is exactly one sentence describing what this feature does. If you cannot state it in one sentence, the scope is too large -- break it down.',
        },
        {
          highlightNodes: ['spec', 'inputs', 'outputs', 'constraints'],
          highlightEdges: [{ from: 'spec', to: 'inputs' }, { from: 'spec', to: 'outputs' }, { from: 'spec', to: 'constraints' }],
          explanation: 'The spec decomposes into three parallel concerns: Inputs (what data comes in, what format, what types), Outputs (what the feature produces and where it goes), and Constraints (technology restrictions, what NOT to build).',
        },
        {
          highlightNodes: ['inputs', 'outputs', 'constraints', 'criteria'],
          highlightEdges: [{ from: 'inputs', to: 'criteria' }, { from: 'outputs', to: 'criteria' }, { from: 'constraints', to: 'criteria' }],
          explanation: 'All three concerns flow into Acceptance Criteria: the binary pass/fail checklist that determines when the work is done. Each criterion should be specific enough that you can test it immediately. "Works" is not a criterion. "Form validates email format and shows inline error" is.',
        },
      ],
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'You know the anatomy of a good spec. This is how you communicate clearly with AI.',
    },

    // === THE TEMPLATE ===
    {
      type: 'code-fill',
      hint: 'Fill in values that match the pattern shown above.',
      instruction: 'Complete the spec template by filling in the section headers. This is the structure you will use for every feature you direct an agent to build.',
      language: 'markdown',
      filename: 'spec-template.md',
      template: '# Feature: [Title]\n\n## {{section_1}}\n[One sentence describing what this feature does.]\n\n## Inputs\n- [What data does this feature receive?]\n- [What format? What types?]\n\n## {{section_2}}\n- [What does this feature produce?]\n- [Where does the output go?]\n\n## Constraints\n- [Technology restrictions]\n- [What this feature must NOT do]\n\n## {{section_3}}\n- [ ] [Criterion 1 -- specific and verifiable]\n- [ ] [Criterion 2 -- specific and verifiable]\n- [ ] [Criterion 3 -- specific and verifiable]',
      blanks: [
        { id: 'section_1', answer: 'Goal', alternatives: ['goal', 'Objective', 'objective'], placeholder: '______', hint: 'One sentence describing the purpose' },
        { id: 'section_2', answer: 'Outputs', alternatives: ['outputs', 'Output', 'output'], placeholder: '______', hint: 'What the feature produces' },
        { id: 'section_3', answer: 'Acceptance Criteria', alternatives: ['acceptance criteria', 'Acceptance criteria', 'Definition of Done', 'definition of done'], placeholder: '______', hint: 'The binary pass/fail checklist' },
      ],
      explanation: 'The five sections are: Goal (one sentence), Inputs (what goes in), Outputs (what comes out), Constraints (guardrails), and Acceptance Criteria (definition of done). Every section is concrete -- no room for interpretation.',
    },

    // === COMPARE: VAGUE VS SPECIFIC ===
    {
      type: 'compare',
      hint: 'Look at the key differences between the two approaches.',
      title: 'Vague vs Specific: spot the difference',
      body: 'Look at these two instructions for the same feature. One gives the agent room to guess. The other removes ambiguity.',
      question: 'Which instruction will produce more reliable agent output?',
      correctSide: 'right',
      left: {
        label: 'Vague',
        content: 'Build me a settings page.\nMake it look good.\nUse modern tech.\nAdd the usual fields.',
        language: 'text',
      },
      right: {
        label: 'Specific',
        content: 'Build a /settings page with 3 fields:\n- display_name (string, 2-50 chars)\n- email (valid email format)\n- notify_email (boolean toggle)\n\nSave to Supabase profiles table.\nUse existing Button/Input from @/components/ui.\nDo NOT add password or avatar features.',
        language: 'text',
      },
      explanation: 'The specific version constrains every decision point: which fields, what validation, where to save, what components to use, and what NOT to build. The vague version forces the agent to guess on all of those, leading to output that rarely matches your intent.',
    },

    // === REAL EXAMPLE ===
    {
      type: 'multiple-choice',
      hint: 'Think about which option is most specific to this concept.',
      question: 'You ask an agent to "build me a settings page" without a spec. What is the most likely outcome?',
      options: [
        'A perfectly matching settings page on the first try',
        'A page with random fields, no validation, and data saving to an unknown location',
        'An error message saying the agent needs more information',
        'The agent will ask you for a spec before starting',
      ],
      correctIndex: 1,
      explanation: 'Without a spec, the agent guesses on every decision: which fields to show, what validation to apply, where to save data. You might get a page that "works" but has random fields, no validation, and saves to who-knows-where. A spec eliminates all of that guesswork.',
    },
    {
      type: 'code-fill',
      hint: 'Use the exact syntax from the lesson examples.',
      instruction: 'Study this real spec and fill in the key constraints. Every line removes ambiguity. The agent knows exactly what to build and, critically, what NOT to build.',
      language: 'markdown',
      filename: 'specs/user-settings.md',
      template: '# Feature: User Settings Page\n\n## Goal\nLet users update their display name, email, and notification preferences.\n\n## Inputs\n- Current user profile from Supabase auth (id, email, display_name)\n- User form input: display_name (string), email (string), notify_email (bool)\n\n## Outputs\n- Updated user record in Supabase `{{output_table}}` table\n- Toast notification on success/failure\n- No page reload -- optimistic UI update\n\n## Constraints\n- React + TypeScript only, no new dependencies\n- Display name: {{name_validation}} chars, alphanumeric + spaces only\n- Must NOT add {{exclusion_1}} (separate feature)\n- Must NOT add avatar upload (separate feature)\n\n## Acceptance Criteria\n- [ ] Settings page renders at /settings route\n- [ ] Form loads current values from user profile\n- [ ] Invalid input shows inline error, submit disabled',
      blanks: [
        { id: 'output_table', answer: 'profiles', alternatives: ['profile', 'users'], placeholder: '______', hint: 'The Supabase table that stores user data' },
        { id: 'name_validation', answer: '2-50', alternatives: ['2 to 50', '2–50'], placeholder: '____', hint: 'Min and max character length for display name' },
        { id: 'exclusion_1', answer: 'password change', alternatives: ['password', 'password reset', 'change password'], placeholder: '______', hint: 'A common settings feature that should be a separate feature' },
      ],
      explanation: 'Every line in this spec removes a decision the agent would otherwise make on its own. The explicit exclusions ("Must NOT add password change") prevent scope creep. The validation rules ("2-50 chars") prevent guessing. The table name tells the agent exactly where data goes.',
    },
    {
      type: 'multiple-choice',
      hint: 'Consider what the lesson content emphasized.',
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
      type: 'multiple-choice',
      hint: 'One option stands out when you think about the core purpose.',
      question: 'Without constraints in a spec, agents tend to:',
      options: [
        'Produce minimal, incomplete output',
        'Add extra features, utility functions, and refactors you did not ask for',
        'Refuse to start until given more detail',
        'Produce exactly what you asked for, nothing more',
      ],
      correctIndex: 1,
      explanation: 'Without constraints, agents are eager to help. They will add error boundaries you did not ask for, create utility functions "just in case," add extra UI states, and refactor adjacent code to be "consistent." Each addition seems reasonable in isolation, but together they bloat the output, introduce untested code, and make review harder. A spec with acceptance criteria gives the agent a stopping condition.',
    },

    // === DIAGRAM 1: SPEC-DRIVEN WORKFLOW ===
    {
      type: 'interactive-diagram',
      title: 'Spec-Driven Workflow',
      body: 'Click through the iterative loop. If the output does not match, you refine the spec -- not the code.',
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
      stages: [
        {
          highlightNodes: ['write', 'build'],
          highlightEdges: [{ from: 'write', to: 'build' }],
          explanation: 'Start by writing the spec, then hand it to the agent. The spec is your single source of truth -- everything the agent needs to know is in this document.',
        },
        {
          highlightNodes: ['build', 'review', 'match'],
          highlightEdges: [{ from: 'build', to: 'review' }, { from: 'review', to: 'match' }],
          explanation: 'Review the output by walking through each acceptance criterion. Check each one off as pass or fail. This is binary -- no "close enough." If any criterion fails, the output is not done.',
        },
        {
          highlightNodes: ['match', 'ship'],
          highlightEdges: [{ from: 'match', to: 'ship' }],
          explanation: 'All criteria pass? Ship it. The spec gave the agent a clear stopping condition, and you verified it against that same spec. No ambiguity, no guesswork.',
        },
        {
          highlightNodes: ['match', 'refine', 'build'],
          highlightEdges: [{ from: 'match', to: 'refine' }, { from: 'refine', to: 'build' }],
          explanation: 'Criteria failed? Refine the spec -- not the code. Add the missing constraint, clarify the ambiguous output, then hand the updated spec back to the agent. This keeps the source of truth in the document, not in scattered prompt corrections.',
        },
      ],
    },
    {
      type: 'multiple-choice',
      hint: 'Read each option carefully — one fits the context best.',
      question: 'The agent produced code that does not match your spec. What should you do?',
      options: [
        'Manually edit the generated code to fix it',
        'Send a follow-up prompt with corrections',
        'Update the spec with the missing constraint, then hand it back to the agent',
        'Accept the output and move on',
      ],
      correctIndex: 2,
      explanation: 'When agent output does not match your expectations, resist the urge to manually edit the code or pile on follow-up prompts. Instead, update the spec. Add the missing constraint. Clarify the ambiguous output. Then hand the updated spec back to the agent. This keeps a single source of truth and avoids the context-eating spiral of correction after correction.',
    },

    // === REVIEWING AGAINST A SPEC ===
    {
      type: 'multiple-choice',
      hint: 'Eliminate the options that only partially fit.',
      question: 'How should you review agent output against a spec?',
      options: [
        'Ask "does it look right?" and trust your gut',
        'Walk through each acceptance criterion and mark it pass or fail -- binary, no "close enough"',
        'Run the code once and if it works, ship it',
        'Ask the agent if it followed the spec correctly',
      ],
      correctIndex: 1,
      explanation: 'Do not review agent output by asking "does it look right?" Review it by walking through each acceptance criterion and checking it off. This is binary -- each criterion either passes or fails. There is no "close enough." If a criterion fails, the output is not done. This discipline prevents you from accepting code that works in the happy path but misses edge cases.',
    },
    {
      type: 'order',
      hint: 'Consider what depends on what — prerequisites first.',
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
      body: "Time to practice. You will fill in a spec for a simple feature: a dark mode toggle. This toggle should switch the site between light and dark themes. Think about what inputs it receives, what outputs it produces, what constraints apply, and what acceptance criteria you would check.",
    },
    {
      type: 'code-fill',
      hint: 'Each blank follows the conventions demonstrated earlier.',
      instruction: 'Complete this spec by filling in the blanks. Each blank needs a specific, concrete answer.',
      language: 'markdown',
      filename: 'specs/dark-mode.md',
      template: '# Feature: Dark Mode Toggle\n\n## Goal\nAllow users to {{goal_action}} with a toggle button in the {{goal_location}}.\n\n## Inputs\n- Current theme from {{input_source}}\n- User click on toggle button\n\n## Outputs\n- Updated CSS class on the {{output_target}} element\n- Theme preference saved to {{output_storage}}\n\n## Constraints\n- Must NOT add {{constraint_exclusion}}\n- Use existing UI components only\n\n## Acceptance Criteria\n- [ ] Toggle renders in the header\n- [ ] Clicking switches between light and dark\n- [ ] Choice persists across {{criteria_persist}}',
      blanks: [
        { id: 'goal_action', answer: 'switch between light and dark themes', alternatives: ['toggle between light and dark themes', 'switch between light and dark mode'], placeholder: 'what action?', hint: 'What do users do with themes?' },
        { id: 'goal_location', answer: 'header', alternatives: ['navbar', 'navigation bar', 'nav'], placeholder: 'where?' },
        { id: 'input_source', answer: 'localStorage', alternatives: ['local storage', 'localstorage', 'browser storage'], placeholder: 'stored where?', hint: 'Client-side key-value storage' },
        { id: 'output_target', answer: 'html', alternatives: ['document', 'body', 'root'], placeholder: 'which element?', hint: 'The root element of the page' },
        { id: 'output_storage', answer: 'localStorage', alternatives: ['local storage', 'localstorage'], placeholder: 'persisted where?' },
        { id: 'constraint_exclusion', answer: 'custom color picker', alternatives: ['color picker', 'accent colors', 'custom themes', 'a color picker'], placeholder: 'what feature to exclude?', hint: 'A common scope creep item for theme features' },
        { id: 'criteria_persist', answer: 'page reloads', alternatives: ['page refreshes', 'refreshes', 'reloads', 'browser sessions', 'sessions'], placeholder: 'across what?' },
      ],
      explanation: 'Each blank removes a decision the agent would otherwise make on its own. The more specific your spec, the fewer revision cycles you need.',
    },
    {
      type: 'multiple-choice',
      hint: 'Focus on the primary goal, not secondary benefits.',
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

    // === PROMPT LAB: WRITE A SPEC PROMPT ===
    {
      type: 'prompt-lab',
      hint: 'Be specific about what you want — vague prompts get vague responses.',
      instruction: 'Write a prompt that instructs an AI agent to build a feature. Include the key elements of a good spec.',
      scenario: 'You need a contact form on your website. It should have name, email, and message fields, validate inputs, and send submissions to a Supabase table. You want to give this to Claude Code as a single prompt.',
      starterPrompt: 'Build me a contact form.',
      responses: [
        {
          triggerKeywords: ['acceptance criteria', 'constraint', 'goal'],
          response: '✅ I\'ll build the contact form according to your spec.\n\nPlan:\n1. Create /contact route with form component\n2. Add name (required, 2-50 chars), email (valid format), message (required, 10-500 chars) fields\n3. Validate on submit, show inline errors\n4. Insert to Supabase `contact_submissions` table\n5. Show success toast on completion\n\nStarting implementation...',
          quality: 'excellent',
          feedback: 'Your prompt included the three pillars of a good spec: a clear goal, specific constraints, and testable acceptance criteria. The agent can execute this with minimal back-and-forth.',
        },
        {
          triggerKeywords: ['name', 'email', 'message', 'supabase'],
          response: 'I\'ll create a contact form with name, email, and message fields that saves to Supabase. I\'ll add validation and a success message.\n\nShould I also add:\n- Rate limiting?\n- Email notifications?\n- A captcha?\n\nLet me know before I start.',
          quality: 'good',
          feedback: 'You specified the inputs and output destination, which is a good start. But without explicit constraints and acceptance criteria, the agent asks follow-up questions instead of executing. Add boundaries to eliminate those questions.',
        },
        {
          triggerKeywords: ['contact', 'form'],
          response: 'I\'ll build a contact form for you! Let me set up a full contact page with:\n- Name, email, phone, subject, and message fields\n- Form validation with error states\n- Email sending via Resend API\n- Rate limiting with Redis\n- Success/error pages\n- Responsive design\n\nCreating the project structure...',
          quality: 'poor',
          feedback: 'Too vague. The agent invented fields (phone, subject), picked technologies you didn\'t ask for (Resend, Redis), and added scope you didn\'t request. A spec with explicit constraints and an Out of Scope section would prevent this.',
        },
      ],
      fallbackResponse: {
        response: 'I\'ll build a contact form. Let me figure out the details as I go...',
        feedback: 'Your prompt didn\'t include enough spec elements. Try including: a one-sentence goal, the specific fields needed, where data should be saved, and what the agent should NOT build.',
      },
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
      message: 'Spec writing learned! You can now give AI clear, detailed instructions that produce exactly what you want.',
    },

    // === FINAL QUIZ ===
    {
      type: 'multiple-choice',
      hint: 'Think about which option is most specific to this concept.',
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
