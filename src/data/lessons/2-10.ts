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
      type: 'diagram',
      title: 'Scope vs Output Quality',
      body: 'As task scope expands, agent output quality degrades non-linearly. The sweet spot is a focused sub-task.',
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
    },
    {
      type: 'checkpoint',
      xp: 2,
      message: 'You understand why focused tasks get better results. Quality over quantity.',
    },

    // === FILE BOUNDARIES ===
    {
      type: 'info',
      title: 'File boundaries: constraining where the agent works',
      body: "The most concrete scope constraint is telling the agent which files it may touch. 'Only modify files in src/components/auth/' is unambiguous. The agent will not refactor your database layer, will not update unrelated components, will not 'helpfully' improve files outside its zone. File boundaries prevent two problems: unintended side effects (the agent breaks something elsewhere) and scope creep (it starts improving tangential code because it noticed an opportunity).",
    },
    {
      type: 'code-demo',
      title: 'File boundary in practice',
      body: 'Explicit file boundaries in your prompt prevent the agent from touching unrelated code.',
      language: 'text',
      filename: 'prompt.txt',
      code: "Implement the password reset flow.\n\nBOUNDARIES:\n- Only create/modify files in: src/components/auth/ and src/lib/auth/\n- Do NOT touch: src/components/dashboard/, src/lib/db/, src/app/api/\n- New files are allowed within the boundary directories\n- If you need changes outside these directories, tell me what\n  you need changed and I will do it separately.\n\nThis is important: if you find yourself wanting to modify\na file outside the boundary, STOP and explain why instead\nof doing it.",
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
      type: 'info',
      title: 'Function boundaries: one task per prompt',
      body: "Even within a single file, you can constrain scope to a single function or module. 'Implement only the validateSession helper — do not implement the full auth middleware, just this one function.' This prevents the agent from anticipating your next request and pre-building things you have not specified yet. It also makes the output trivially reviewable: you asked for one function, you evaluate one function.",
    },
    {
      type: 'code-demo',
      title: 'Function-level scope constraint',
      body: 'Constraining to a single function produces focused, reviewable output.',
      language: 'text',
      filename: 'prompt.txt',
      code: "Implement the `validateSession` function in src/lib/auth/session.ts.\n\nSignature:\n  async function validateSession(token: string): Promise<Session | null>\n\nBehavior:\n- Decode the JWT token (use jose library)\n- Check expiry — return null if expired\n- Look up the session in the database via sessionId from payload\n- Return the Session object if valid, null otherwise\n\nDo NOT implement:\n- Token refresh logic (separate task)\n- Session creation (already done)\n- Middleware that calls this function (separate task)\n- Error handling beyond returning null (keep it simple for now)\n\nJust this one function. Nothing else.",
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
      type: 'info',
      title: 'Token budgets: keeping prompts focused',
      body: "Every token of context competes for the agent's attention. A prompt that includes background on the entire project, the full database schema, every API route, and the complete design system — then asks for a single helper function — is wasting attention on irrelevant context. Include only the context directly relevant to the task at hand. If the agent needs more, it will ask (or you can provide it in follow-ups). Front-load the most important information.",
    },
    {
      type: 'code-demo',
      title: 'Focused context vs kitchen sink',
      body: 'Only include context the agent needs for THIS specific task.',
      language: 'text',
      filename: 'focused-prompt.txt',
      code: "❌ KITCHEN SINK (wastes attention on irrelevant context):\n\nHere's my full schema: [500 lines of SQL]\nHere's my auth system: [200 lines of code]\nHere's my design system: [300 lines of tokens]\nNow implement the validateSession function.\n\n✅ FOCUSED (relevant context only):\n\nImplement validateSession in src/lib/auth/session.ts.\n\nRelevant types:\n  interface Session { id: string; userId: string; expiresAt: Date }\n\nRelevant DB call (already exists):\n  db.query.sessions.findFirst({ where: eq(sessions.id, sessionId) })\n\nJWT library: jose (already installed)\n\n[spec follows...]",
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'Context discipline acquired!',
    },

    // === SPLITTING LARGE TASKS ===
    {
      type: 'info',
      title: 'Splitting large tasks without losing coherence',
      body: "The challenge with narrow scope: how do you build a complex system from isolated pieces without it feeling disjointed? The answer is a shared spec that each sub-task references. You write the full system spec once (the big picture), then extract focused sub-tasks that each cite the relevant section. Each sub-task knows its place in the whole — but only executes its narrow piece. The agent has just enough context to be coherent without being overwhelmed.",
    },
    {
      type: 'code-demo',
      title: 'Task decomposition pattern',
      body: 'Break a large system into sequential focused tasks, each with its own boundary.',
      language: 'markdown',
      filename: 'auth-tasks.md',
      code: "# Auth System — Task Breakdown\n\n## Task 1: Database Schema (src/db/schema/auth.ts)\nCreate users, sessions, and password_resets tables.\nDo NOT implement any application logic.\n\n## Task 2: Session Helpers (src/lib/auth/session.ts)\nImplement: createSession, validateSession, deleteSession.\nUse the schema from Task 1. Do NOT create API routes.\n\n## Task 3: Password Utilities (src/lib/auth/password.ts)\nImplement: hashPassword, verifyPassword, generateResetToken.\nStandalone utilities — no database calls in this file.\n\n## Task 4: Auth API Routes (src/app/api/auth/)\nCreate login, register, logout routes.\nImport from Task 2 and Task 3. Do NOT modify those files.\n\n## Task 5: Auth UI Components (src/components/auth/)\nCreate LoginForm, RegisterForm, ResetPasswordForm.\nCall API routes from Task 4. Do NOT modify API logic.",
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
      type: 'info',
      title: 'Principle 5: Boundaries force better decisions',
      body: "This is not just about agent quality. Scope constraints force better decisions from YOU as the director. When you cannot dump everything into one prompt, you must think about sequencing: what depends on what? What can be built independently? What interface contracts need to be defined up front? This decomposition thinking is the core skill of software architecture. Agents did not invent it — they just made it viscerally obvious when you skip it.",
    },
    {
      type: 'info',
      title: 'Boundaries as communication',
      body: "When you write 'only touch src/components/auth/' you are communicating three things simultaneously. To the agent: your working zone. To yourself: the blast radius of this change. To your future self: what was modified in this iteration. Scope constraints are documentation, safety rails, and focus aids — all in one line. They cost nothing to write and save enormous debugging time.",
    },

    // === REAL CLAUDE CODE FLAGS ===
    {
      type: 'info',
      title: 'Claude Code scope patterns',
      body: "Claude Code supports several patterns for scope constraint. You can use CLAUDE.md to set persistent boundaries for a project. You can use inline prompt instructions for per-task constraints. And you can structure your prompts to reference specific files by path. The key insight: scope is not a feature of the tool — it is a discipline in how you write prompts. Any agent system benefits from explicit scope.",
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
      type: 'info',
      title: 'When wider scope is justified',
      body: "Not every task should be micro-scoped. When changes are tightly coupled — a type change that propagates through 5 files — narrow scope creates more work than it saves. The rule: broaden scope only when the coupling between changes is so tight that splitting them would require you to specify the interface contract in more detail than just having the agent do both sides. If two changes share no interface, they are separate tasks. If they share a tight interface, they might be one task.",
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
      type: 'info',
      title: 'The constraint mindset',
      body: "Constraining scope feels counterintuitive when agents promise to 'do everything.' But the fastest path to a working system is a sequence of focused, high-quality sub-tasks — not one sprawling attempt that requires extensive debugging. Every minute you spend defining scope saves five minutes fixing inconsistencies. Every boundary you set is a decision you will not have to undo. The best directors are not the ones who ask for the most — they are the ones who ask for exactly the right thing at the right time.",
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
