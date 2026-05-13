import type { LessonContent } from './types'

const content: LessonContent = {
  lessonId: '2-10',
  steps: [
    // === INTRODUCTION ===
    {
      type: 'info',
      title: 'Why focused tasks get better AI results',
      body: "Give an agent a focused task — implement a login form — and it delivers clean, correct code. Give it 'build the entire auth system including login, registration, password reset, email verification, session management, and role-based access control' in a single prompt, and quality degrades. Responses get longer but less precise. The agent makes inconsistent decisions across the codebase. It forgets constraints from the top of the prompt by the time it reaches the bottom. Broad scope is not ambition — it is a quality tax.",
    },
    {
      type: 'info',
      title: 'Why scope limits improve output',
      body: "Three mechanisms explain why narrower scope produces better results. First: attention. Transformer attention is finite — the more context competing for relevance, the more likely critical details get diluted. Second: coherence. Narrow tasks produce self-consistent output because there are fewer decisions to keep aligned. Third: verifiability. You can evaluate 'does this login form work?' immediately. You cannot evaluate 'does this entire auth system work?' without breaking it into parts anyway. Constraining scope up front saves you decomposition work later.",
    },
    {
      type: 'compare',
      title: 'Broad scope vs focused tasks',
      body: 'The width of your prompt directly affects output quality.',
      question: 'Which approach produces higher-quality code?',
      correctSide: 'right',
      left: {
        label: 'Broad (one prompt)',
        content: '"Build the complete authentication system:\nlogin, signup, password reset, OAuth,\nsession management, protected routes,\nrole-based access, and admin panel."\n\nResult: 30+ files, inconsistent patterns,\nmissing edge cases, context exhausted',
        language: 'text',
      },
      right: {
        label: 'Focused (four prompts)',
        content: 'Prompt 1: "Create database schema for users\n  and sessions. Only touch src/db/"\nPrompt 2: "Add login/signup server actions.\n  Only modify src/actions/auth.ts"\nPrompt 3: "Build login page at /login using\n  existing Button and Input components"\nPrompt 4: "Add session check middleware.\n  Only modify src/middleware.ts"',
        language: 'text',
      },
      explanation: 'Focused prompts constrain scope with file boundaries ("only touch src/db/") and specific output targets. Each prompt gets the agent\'s full attention instead of splitting it across 8 concerns.',
    },

    // === SCOPE DEGRADATION DIAGRAM ===
    {
      type: 'interactive-diagram',
      title: 'Scope vs Output Quality',
      body: 'As task scope expands, agent output quality degrades non-linearly. Click through each level.',
      diagram: {
        direction: 'LR',
        nodes: [
          { id: 'narrow', label: 'Narrow Scope', sublabel: '"Implement validateSession"', shape: 'pill', highlight: true },
          { id: 'medium', label: 'Medium Scope', sublabel: '"Build session management"', shape: 'rounded' },
          { id: 'broad', label: 'Broad Scope', sublabel: '"Build the whole auth system"', shape: 'rect' },
          { id: 'precise', label: 'Precise Output', sublabel: 'Coherent, testable', shape: 'pill', highlight: true },
          { id: 'decent', label: 'Decent Output', sublabel: 'Mostly consistent', shape: 'rounded' },
          { id: 'degraded', label: 'Degraded Output', sublabel: 'Inconsistent, verbose', shape: 'rect' },
        ],
        edges: [
          { from: 'narrow', to: 'precise' },
          { from: 'medium', to: 'decent' },
          { from: 'broad', to: 'degraded' },
        ],
      },
      stages: [
        {
          highlightNodes: ['narrow', 'precise'],
          highlightEdges: [{ from: 'narrow', to: 'precise' }],
          explanation: 'Narrow scope ("implement this one function") gets the agent\'s full attention. Output is coherent, testable, and easy to review. This is the sweet spot.',
        },
        {
          highlightNodes: ['medium', 'decent'],
          highlightEdges: [{ from: 'medium', to: 'decent' }],
          explanation: 'Medium scope ("build session management") stretches attention across multiple functions. Output is mostly consistent but may have gaps in edge cases or inconsistent patterns.',
        },
        {
          highlightNodes: ['broad', 'degraded'],
          highlightEdges: [{ from: 'broad', to: 'degraded' }],
          explanation: 'Broad scope ("build the whole auth system") exhausts context and splits attention 8 ways. Output is verbose, inconsistent, and requires extensive debugging. This is the quality tax of over-scoping.',
        },
      ],
    },
    {
      type: 'checkpoint',
      xp: 2,
      message: 'You understand why focused tasks get better results. Quality over quantity.',
    },

    // === FILE BOUNDARIES ===
    {
      type: 'multiple-choice',
      question: 'What is the most concrete way to constrain the scope of an agent task?',
      options: [
        'Tell the agent to "be careful"',
        'Limit the number of tokens in your prompt',
        'Specify exact file boundaries: "Only modify files in src/components/auth/"',
        'Ask the agent to work slowly',
      ],
      correctIndex: 2,
      explanation: "The most concrete scope constraint is telling the agent which files it may touch. 'Only modify files in src/components/auth/' is unambiguous. File boundaries prevent two problems: unintended side effects (the agent breaks something elsewhere) and scope creep (it starts improving tangential code because it noticed an opportunity).",
    },
    {
      type: 'code-fill',
      instruction: 'Complete this prompt with proper file boundaries to prevent the agent from touching unrelated code:',
      language: 'text',
      filename: 'prompt.txt',
      template: 'Implement the password reset flow.\n\nBOUNDARIES:\n- Only create/modify files in: {{allowed_dirs}}\n- Do NOT touch: {{forbidden_dirs}}\n- New files are allowed within the boundary directories\n- If you need changes outside these directories, {{escape_clause}}',
      blanks: [
        { id: 'allowed_dirs', answer: 'src/components/auth/ and src/lib/auth/', alternatives: ['src/components/auth/, src/lib/auth/', 'src/components/auth/ + src/lib/auth/'], placeholder: 'which directories allowed?', hint: 'The auth component and auth library directories' },
        { id: 'forbidden_dirs', answer: 'src/components/dashboard/, src/lib/db/, src/app/api/', alternatives: ['src/components/dashboard/ src/lib/db/ src/app/api/'], placeholder: 'which directories forbidden?', hint: 'The dashboard, database, and API directories' },
        { id: 'escape_clause', answer: 'tell me what you need changed and I will do it separately', alternatives: ['stop and explain why', 'STOP and explain why instead of doing it'], placeholder: 'what should agent do?', hint: 'The agent should ask, not act outside boundaries' },
      ],
      explanation: 'Explicit file boundaries prevent the agent from touching unrelated code. The escape clause is critical — it gives the agent a safe way to signal when it genuinely needs something outside its zone.',
    },
    {
      type: 'terminal',
      instruction: 'Direct the agent to implement a notification bell component, explicitly constraining it to only the notifications directory.',
      expectedCommand: 'claude "Implement a NotificationBell component. BOUNDARIES: Only create/modify files in src/components/notifications/. Do NOT touch any files outside this directory. If you need a hook or utility that does not exist, create it inside src/components/notifications/utils.ts. Do NOT modify the global layout or header components."',
      hint: 'Set a clear file boundary, specify where new files go, and explicitly exclude other directories.',
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'File boundaries set!',
    },

    // === FUNCTION BOUNDARIES ===
    {
      type: 'compare',
      title: 'Function boundaries: one task per prompt',
      body: 'Even within a single file, you can constrain scope to a single function.',
      question: 'Which prompt produces more focused, reviewable output?',
      correctSide: 'right',
      left: {
        label: 'Unbounded',
        content: '"Add session validation to the auth system.\nMake sure it works with the middleware\nand handles token refresh too."',
        language: 'text',
      },
      right: {
        label: 'Function-scoped',
        content: '"Implement validateSession in session.ts.\nSignature: (token: string) => Session | null\nBehavior: decode JWT, check expiry, look up\nsession in DB, return Session or null.\n\nDo NOT implement: token refresh,\nsession creation, or middleware."',
        language: 'text',
      },
      explanation: "Constraining to a single function prevents the agent from anticipating your next request and pre-building things you have not specified yet. It also makes the output trivially reviewable: you asked for one function, you evaluate one function. The 'Do NOT implement' section is critical.",
    },
    {
      type: 'multiple-choice',
      question: 'You ask the agent to implement validateSession. It also creates a refreshToken function and wires both into middleware. What principle did you violate?',
      options: [
        'You did not set a file boundary',
        'You did not explicitly exclude the extra work — the agent optimized for completeness',
        'The agent cannot help itself and always over-delivers',
        'Function boundaries do not work with coding agents',
      ],
      correctIndex: 1,
      explanation: 'Agents are biased toward helpfulness. Without an explicit "Do NOT implement" section, the agent will anticipate your next steps and pre-build them. The scope constraint must include both what to do AND what not to do.',
    },
    {
      type: 'code-fill',
      instruction: 'Complete this narrowly-scoped prompt with proper file and scope boundaries:',
      language: 'text',
      template: 'Implement the validateSession function.\n\nBOUNDARIES:\n- Only create/modify files in {{allowed_dir}}\n- Do NOT touch {{forbidden_1}} or {{forbidden_2}}\n- Use the existing {{existing_fn}} from src/lib/auth.ts\n\nACCEPTANCE CRITERIA:\n- Returns user object if session valid\n- Returns null if session expired or invalid\n- Throws on database connection failure',
      blanks: [
        { id: 'allowed_dir', answer: 'src/lib/', alternatives: ['src/lib', 'src/lib/auth.ts'], placeholder: 'which directory?', hint: 'Where does auth logic live?' },
        { id: 'forbidden_1', answer: 'src/components/', alternatives: ['src/components', 'components'], placeholder: "don't touch what?", hint: 'The UI layer' },
        { id: 'forbidden_2', answer: 'src/db/', alternatives: ['src/db', 'database', 'migrations'], placeholder: 'another off-limits area?', hint: 'The database layer' },
        { id: 'existing_fn', answer: 'getSessionToken', alternatives: ['parseToken', 'getToken', 'verifyToken'], placeholder: 'which existing function?', hint: 'A function that extracts the token' },
      ],
      explanation: 'File boundaries prevent the agent from "helpfully" modifying components or database code while implementing a utility function. This keeps changes reviewable and reversible.',
    },

    // === TOKEN BUDGETS ===
    {
      type: 'compare',
      title: 'Token budgets: keeping prompts focused',
      body: 'Every token of context competes for the agent\'s attention. Only include what is relevant.',
      question: 'Which prompt gives the agent the best chance of producing correct output?',
      correctSide: 'right',
      left: {
        label: 'Kitchen sink',
        content: '"Here\'s my full schema: [500 lines]\nHere\'s my auth system: [200 lines]\nHere\'s my design system: [300 lines]\n\nNow implement validateSession."',
        language: 'text',
      },
      right: {
        label: 'Focused context',
        content: '"Implement validateSession in session.ts.\n\nRelevant types:\n  Session { id, userId, expiresAt }\n\nRelevant DB call (already exists):\n  db.query.sessions.findFirst({...})\n\nJWT library: jose (installed)"',
        language: 'text',
      },
      explanation: 'Including 1000 lines of irrelevant context dilutes the agent\'s attention on the 10 lines that matter. Front-load the most important information. If the agent needs more, it will ask.',
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'Context discipline acquired!',
    },

    // === SPLITTING LARGE TASKS ===
    {
      type: 'multiple-choice',
      question: 'How do you build a complex system from narrow-scope tasks without it feeling disjointed?',
      options: [
        'Let the agent figure out how the pieces connect',
        'Write a shared spec once (the big picture), then extract focused sub-tasks that each cite the relevant section',
        'Build everything in one large prompt to keep it coherent',
        'Build each piece independently and hope they fit together',
      ],
      correctIndex: 1,
      explanation: "The answer is a shared spec that each sub-task references. You write the full system spec once (the big picture), then extract focused sub-tasks that each cite the relevant section. Each sub-task knows its place in the whole — but only executes its narrow piece. The agent has just enough context to be coherent without being overwhelmed.",
    },
    {
      type: 'match',
      instruction: 'Match each auth system sub-task to its correct file boundary:',
      leftItems: ['Database schema (tables only)', 'Session helpers (create, validate, delete)', 'Password utilities (hash, verify)', 'Auth API routes (login, register, logout)'],
      rightItems: ['src/lib/auth/password.ts — standalone, no DB calls', 'src/db/schema/auth.ts — no application logic', 'src/app/api/auth/ — imports from helpers, does NOT modify them', 'src/lib/auth/session.ts — uses schema, does NOT create API routes'],
      correctPairs: { 0: 1, 1: 3, 2: 0, 3: 2 },
      explanation: 'Each sub-task has its own file boundary and explicit exclusions. The schema task creates tables only. Session helpers use the schema but do not create routes. Password utils are standalone. API routes import from helpers but never modify them.',
    },
    {
      type: 'order',
      instruction: 'Order these tasks from narrowest scope (most constrained) to broadest:',
      items: [
        'Build the full authentication system with UI, API, and database',
        'Implement the hashPassword utility function',
        'Create the auth API routes using existing session and password helpers',
        'Build the login form component',
      ],
      correctOrder: [1, 3, 2, 0],
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'Task decomposition mastered!',
    },

    // === PRINCIPLE 5 ===
    {
      type: 'multiple-choice',
      question: 'When you write "only touch src/components/auth/" in a prompt, you are communicating to:',
      options: [
        'Only the agent — so it knows where to work',
        'Three audiences: the agent (working zone), yourself (blast radius), and your future self (what was modified)',
        'Only your future self — as documentation',
        'Only the code reviewer — so they know what to check',
      ],
      correctIndex: 1,
      explanation: "Scope constraints communicate three things simultaneously. To the agent: your working zone. To yourself: the blast radius of this change. To your future self: what was modified in this iteration. They are documentation, safety rails, and focus aids — all in one line. They cost nothing to write and save enormous debugging time.",
    },
    {
      type: 'order',
      instruction: 'Order these architectural thinking steps that scope constraints force you to do:',
      items: [
        'Define interface contracts between pieces up front',
        'Identify which pieces can be built independently (parallel work)',
        'Determine what depends on what (sequencing)',
        'Write the full system spec as the big picture',
      ],
      correctOrder: [3, 2, 1, 0],
    },

    // === REAL CLAUDE CODE FLAGS ===
    {
      type: 'match',
      instruction: 'Match each scope constraint mechanism to when you would use it:',
      leftItems: ['CLAUDE.md file', 'Inline prompt instructions', 'File path references in prompt', 'Do NOT implement section'],
      rightItems: ['Per-task constraints for a single prompt', 'Persistent project-wide boundaries that apply to every task', 'Prevent the agent from pre-building things you have not asked for', 'Point the agent to exactly the right file to modify'],
      correctPairs: { 0: 1, 1: 0, 2: 3, 3: 2 },
      explanation: "Scope is not a feature of the tool — it is a discipline in how you write prompts. CLAUDE.md for project-wide rules, inline instructions for per-task constraints, file paths for precision targeting, and 'Do NOT' sections to prevent over-delivery. Any agent system benefits from explicit scope.",
    },
    {
      type: 'terminal',
      instruction: 'Direct the agent to add a "mark as read" feature to notifications, but ONLY by modifying the existing notification store — no new files, no UI changes.',
      expectedCommand: 'claude "Add a markAsRead(notificationId: string) method to the existing notification store in src/stores/notifications.ts. It should update the notification\'s read field to true and persist to the database via the existing db.notifications.update call. Do NOT create new files. Do NOT modify any UI components. Do NOT add new imports from external packages. Only modify src/stores/notifications.ts."',
      hint: 'Constrain to a single file, a single method, using only existing patterns in that file.',
    },
    {
      type: 'terminal',
      instruction: 'The agent built the full auth system in one go and it has inconsistencies. Now re-approach by directing ONLY the database schema as an isolated task.',
      expectedCommand: 'claude "Create the auth database schema in src/db/schema/auth.ts. Define three tables: users (id, email, passwordHash, createdAt), sessions (id, userId, expiresAt, createdAt), and password_resets (id, userId, token, expiresAt). Use Drizzle ORM syntax matching the existing schema files in src/db/schema/. Export all tables. Do NOT create any application logic, API routes, or utility functions. Only the schema file."',
      hint: 'Isolate the database schema as its own task — no logic, no API, no UI. Just table definitions.',
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'Scope discipline in practice!',
    },

    // === WHEN TO BROADEN SCOPE ===
    {
      type: 'compare',
      title: 'When wider scope is justified',
      body: 'Not every task should be micro-scoped. Sometimes coupling makes wider scope more efficient.',
      question: 'Which scenario justifies a single wide-scope prompt?',
      correctSide: 'right',
      left: {
        label: 'Split into narrow tasks',
        content: 'Task A: Build login form (UI only)\nTask B: Implement password hashing (util)\nTask C: Add email validation to signup\nTask D: Add phone validation to profile\n\nThese share NO interface — splitting\nis free and each task is reviewable.',
        language: 'text',
      },
      right: {
        label: 'Keep as one task',
        content: 'Rename the type UserProfile to Account\nand update all 12 files that reference it.\n\nThis is tightly coupled — every reference\nmust change in sync or the code breaks.\nSplitting this into 12 tasks is worse.',
        language: 'text',
      },
      explanation: 'Broaden scope only when coupling between changes is so tight that splitting would require you to specify interface contracts in more detail than just having the agent do both sides. If two changes share no interface, they are separate tasks. If they share a tight interface, they might be one task.',
    },
    {
      type: 'multiple-choice',
      question: 'Which task is better done as a SINGLE wide-scope prompt rather than split into narrow tasks?',
      options: [
        'Build login form + implement password hashing',
        'Rename a type from UserProfile to Account and update all 12 files that reference it',
        'Create database schema + build API routes + design UI components',
        'Add email validation to the registration form + add phone validation to the profile form',
      ],
      correctIndex: 1,
      explanation: 'A rename across 12 files is tightly coupled — every reference must change in sync or the code breaks. This is better as one atomic task. The others involve distinct concerns that benefit from separate, focused prompts.',
    },

    // === SYNTHESIS ===
    {
      type: 'multiple-choice',
      question: 'What is the ROI of spending one minute defining scope constraints in a prompt?',
      options: [
        'It wastes time — agents work better with creative freedom',
        'It saves roughly five minutes fixing inconsistencies later',
        'It makes no difference to output quality',
        'It only helps with small tasks, not complex systems',
      ],
      correctIndex: 1,
      explanation: "Every minute you spend defining scope saves five minutes fixing inconsistencies. Every boundary you set is a decision you will not have to undo. The best directors are not the ones who ask for the most — they are the ones who ask for exactly the right thing at the right time.",
    },
    {
      type: 'prompt-lab',
      instruction: 'Write a narrowly-scoped prompt that directs the agent to implement only the validateSession function.',
      scenario: 'You need a function that checks if a user\'s session is still valid. It should use the existing getSessionToken() helper from src/lib/auth.ts, query the sessions table, and return the user object or null. You do NOT want the agent to touch any other files.',
      starterPrompt: 'Add session validation to the app.',
      responses: [
        {
          triggerKeywords: ['only', 'src/lib', 'do not', 'getSessionToken'],
          response: 'I\'ll implement validateSession in src/lib/auth.ts using the existing getSessionToken helper.\n\nScope: only modifying src/lib/auth.ts\n\nImplementation:\n1. Call getSessionToken() to extract token\n2. Query sessions table for matching token\n3. Check expiration\n4. Return user object or null\n\nStarting...',
          quality: 'excellent',
          feedback: 'Your prompt specified: which file to modify, which existing function to use, what NOT to touch, and clear acceptance criteria. The agent can execute without questions.',
        },
        {
          triggerKeywords: ['session', 'validate', 'user'],
          response: 'I\'ll add session validation! Let me:\n1. Create a middleware for protected routes\n2. Add a session check component\n3. Update the login flow to create sessions\n4. Add session cleanup cron job\n\nStarting with the middleware...',
          quality: 'poor',
          feedback: 'Without scope boundaries, the agent expanded to middleware, components, login flow, and cron jobs. You asked for one function — add file boundaries and "do NOT touch" constraints.',
        },
      ],
      fallbackResponse: {
        response: 'I\'ll set up session validation across the app. Where should I start?',
        feedback: 'Your prompt was too open-ended. Specify: (1) the exact function to implement, (2) which file to modify, (3) which existing utilities to reuse, and (4) what NOT to touch.',
      },
    },
    {
      type: 'checklist',
      title: 'Scope constraint checklist:',
      items: [
        'I understand why broad scope degrades agent output quality',
        'I can set file boundaries that prevent unintended side effects',
        'I can constrain tasks to single functions with explicit exclusions',
        'I include only relevant context in prompts (not the kitchen sink)',
        'I can decompose large systems into sequential focused sub-tasks',
        'I know when wider scope is justified (tightly coupled changes)',
      ],
    },
    {
      type: 'checkpoint',
      xp: 6,
      message: 'Scope discipline learned! Focused instructions beat broad ones every time.',
    },
  ],
}

export default content
