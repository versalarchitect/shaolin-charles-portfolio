import type { LessonContent } from './types'

const content: LessonContent = {
  lessonId: '2-5',
  steps: [
    // === INTRODUCTION ===
    {
      type: 'info',
      title: 'When AI forgets what you told it',
      body: "Every agent has a context window — a fixed amount of text it can hold in working memory. When you direct a long build session, the window fills up. Early decisions, file contents, and your original spec get pushed out as new code, errors, and conversation accumulate. The agent does not warn you. It just starts making decisions that contradict what it decided 30 minutes ago. Output quality degrades silently. Recognizing this cliff before you hit it is the single most important skill for long sessions.",
    },
    {
      type: 'info',
      title: 'How context windows actually work',
      body: "Think of context as a fixed-size buffer. Every message you send, every file the agent reads, every code block it generates — all of it consumes tokens. Claude Code's context window is large but finite. When it fills up, the system compacts older messages — summarizing or dropping them. The agent loses fidelity on early decisions. It still functions, but it is working from a lossy summary of what happened before, not the full picture.",
    },

    // === SYMPTOMS ===
    {
      type: 'compare',
      hint: 'Look at the key differences between the two approaches.',
      title: 'Symptom: contradicting earlier decisions',
      body: 'The agent makes choices early in a session, then makes opposite choices later. This is not indecision — it is memory loss.',
      question: 'Which side shows context exhaustion?',
      correctSide: 'right',
      left: {
        label: 'Early session (step 3)',
        content: "// Agent sets up Zustand store\nimport { create } from 'zustand'\n\nconst useAuthStore = create((set) => ({\n  user: null,\n  setUser: (user) => set({ user }),\n}))\n\n// Uses Tailwind for spacing\n<div className=\"p-6 mt-4 gap-3\">",
        language: 'typescript',
      },
      right: {
        label: 'Late session (step 15)',
        content: "// Agent creates React Context for SAME state\nconst AuthContext = createContext(null)\n\nfunction AuthProvider({ children }) {\n  const [user, setUser] = useState(null)\n  // ...\n}\n\n// Now using inline styles\n<div style={{ padding: 24, marginTop: 16 }}>",
        language: 'typescript',
      },
      explanation: 'The agent set up Zustand and Tailwind early, then switched to React Context and inline styles later. It did not change its mind — it lost access to those earlier decisions. This contradiction is the clearest signal of context exhaustion.',
    },
    {
      type: 'multiple-choice',
      hint: 'Read each option carefully — one fits the context best.',
      question: 'The agent asks "what database are you using?" after it already set up Drizzle with SQLite an hour ago. What does this indicate?',
      options: [
        'The agent wants to confirm your choice before proceeding',
        'The agent is suggesting you might want to switch databases',
        'Context exhaustion — the earlier setup conversation has been compacted away',
        'The agent is testing your knowledge of the project',
      ],
      correctIndex: 2,
      explanation: 'When the agent re-asks questions whose answers exist earlier in the conversation, the earlier context has been compacted. Combined with declining code quality (strict types becoming loose `any` casts, missing error handling), these are the three key symptoms: contradictions, repeated questions, and quality decline.',
    },
    {
      type: 'multiple-choice',
      hint: 'Eliminate the options that only partially fit.',
      question: 'The agent built a REST API with proper error responses for the first 4 endpoints, but endpoint 5 returns raw errors to the client. What is most likely happening?',
      options: [
        'The agent decided a different error strategy was better',
        'The fifth endpoint is intentionally different',
        'Context exhaustion — the agent lost the error handling pattern from earlier',
        'The agent ran out of tokens and is being brief',
      ],
      correctIndex: 2,
      explanation: 'Inconsistency in patterns that were consistent earlier is the hallmark of context exhaustion. The agent has not changed its mind — it has lost access to the pattern it established. This is why you see quality degrade toward the end of long sessions.',
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'Context exhaustion symptoms recognized!',
    },

    // === STRUCTURING TASKS ===
    {
      type: 'multiple-choice',
      hint: 'Focus on the primary goal, not secondary benefits.',
      question: 'When should you establish your most important architectural decisions in an agent session?',
      options: [
        'In the middle of the session when the agent has warmed up',
        'At the very end so they are freshest in context',
        'In the first 20% of the session when context is fullest and most detailed',
        'It does not matter — the agent remembers everything equally',
      ],
      correctIndex: 2,
      explanation: 'Front-load critical decisions. Database schema, API design, and error handling patterns established in the first 20% of the session have the best chance of surviving context compaction. The agent builds its mental model from early context — make sure that model contains your highest-priority patterns before the window fills up.',
    },
    {
      type: 'interactive-diagram',
      title: 'Context Decay Over a Session',
      body: 'Early decisions get compacted first. Structure your session so the most critical patterns are reinforced, not just stated once.',
      diagram: {
        direction: 'LR',
        nodes: [
          { id: 'start', label: 'Session Start', sublabel: 'Full context', shape: 'pill', highlight: true },
          { id: 'arch', label: 'Architecture', sublabel: 'Schema, patterns, types', shape: 'rounded' },
          { id: 'impl', label: 'Implementation', sublabel: 'Features built', shape: 'rect' },
          { id: 'mid', label: 'Mid-Session', sublabel: 'Context compacting', shape: 'diamond' },
          { id: 'late', label: 'Late Session', sublabel: 'Early context lost', shape: 'rect' },
          { id: 'degrade', label: 'Quality Drops', sublabel: 'Contradictions appear', shape: 'pill' },
        ],
        edges: [
          { from: 'start', to: 'arch' },
          { from: 'arch', to: 'impl' },
          { from: 'impl', to: 'mid' },
          { from: 'mid', to: 'late', label: 'compaction' },
          { from: 'late', to: 'degrade', dashed: true },
        ],
      },
      stages: [
        {
          highlightNodes: ['start', 'arch'],
          highlightEdges: [{ from: 'start', to: 'arch' }],
          explanation: 'Session begins with full context. Architecture decisions — schema, patterns, types — are established with maximum fidelity.',
        },
        {
          highlightNodes: ['arch', 'impl'],
          highlightEdges: [{ from: 'arch', to: 'impl' }],
          explanation: 'Features are built using the established patterns. Context is filling up but the agent still has access to all prior decisions.',
        },
        {
          highlightNodes: ['mid'],
          highlightEdges: [{ from: 'impl', to: 'mid' }],
          explanation: 'The context window is full. The system begins compacting — summarizing or dropping older messages. Early architectural decisions start losing detail.',
        },
        {
          highlightNodes: ['late'],
          highlightEdges: [{ from: 'mid', to: 'late' }],
          explanation: 'Early context is gone. The agent works from a lossy summary. It may not remember the error handling pattern or styling convention from the start.',
        },
        {
          highlightNodes: ['degrade'],
          highlightEdges: [{ from: 'late', to: 'degrade' }],
          explanation: 'Quality drops visibly. The agent contradicts earlier decisions, re-asks answered questions, and produces inconsistent code. Time to start a fresh session.',
        },
      ],
    },
    {
      type: 'multiple-choice',
      hint: 'Think about which option is most specific to this concept.',
      question: 'Why should you break a build into chunks across fresh sessions instead of one marathon session?',
      options: [
        'Agents work faster in shorter sessions',
        'It reduces your API costs',
        'Code on disk becomes the source of truth — conversation history gets compacted but committed code persists',
        'The agent refuses to work on long sessions',
      ],
      correctIndex: 2,
      explanation: 'Each chunk produces committed, working code. When you start a fresh session, the agent reads your codebase and CLAUDE.md — not the compacted conversation. The code on disk is always the authoritative source of truth, immune to context window limits.',
    },
    {
      type: 'code-fill',
      hint: 'Fill in values that match the pattern shown above.',
      instruction: 'Complete this session plan with the right completion criteria for each chunk:',
      language: 'markdown',
      filename: 'session-plan.md',
      template: '# Build Plan: Invoice Generator\n\n## Chunk 1 (fresh session)\n- Set up project: Next.js + Drizzle + SQLite\n- Define schema: invoices, line_items, clients\n- Commit when: `{{chunk1_done}}` works + seed runs\n\n## Chunk 2 (fresh session)\n- CRUD API for invoices (all endpoints)\n- Error handling pattern: { success, data, error }\n- Commit when: all endpoints tested via {{chunk2_tool}}\n\n## Chunk 3 (fresh session)\n- Invoice PDF generation + email via {{email_service}}\n- Commit when: PDF renders correctly + email sends\n\n## Chunk 4 (fresh session)\n- Frontend: invoice list, create form, detail view\n- Commit when: full flow works in {{chunk4_where}}',
      blanks: [
        { id: 'chunk1_done', answer: 'bun run db:push', alternatives: ['npm run db:push', 'npx drizzle-kit push'], placeholder: 'what command?', hint: 'The command that applies schema to the database' },
        { id: 'chunk2_tool', answer: 'curl', alternatives: ['Postman', 'httpie', 'insomnia'], placeholder: 'testing tool?', hint: 'Command-line HTTP client' },
        { id: 'email_service', answer: 'Resend', alternatives: ['resend', 'SendGrid', 'sendgrid'], placeholder: 'which service?', hint: 'Modern email API service' },
        { id: 'chunk4_where', answer: 'browser', alternatives: ['the browser', 'Browser'], placeholder: 'where?', hint: 'Where end users interact with the frontend' },
      ],
      explanation: 'Each chunk has a clear completion criterion — a verifiable test that proves the work is done. This prevents half-finished chunks from bleeding into the next session and gives you confidence the code is solid before moving on.',
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'Task structuring patterns learned!',
    },

    // === WHEN TO START FRESH ===
    {
      type: 'multiple-choice',
      hint: 'Consider what the lesson content emphasized.',
      question: 'At what point should you definitely start a fresh session?',
      options: [
        'After every 10 messages to be safe',
        'Only when the agent explicitly tells you the context is full',
        'When you see contradictions, quality decline, or you are about to switch to a different codebase area (especially past ~50 exchanges)',
        'Never — longer sessions are always better for continuity',
      ],
      correctIndex: 2,
      explanation: 'Start fresh when the agent contradicts earlier decisions, quality declines, you are context-switching to a different area, or the conversation exceeds ~50 exchanges. The cost of starting fresh is low (agent reads CLAUDE.md at session start). The cost of continuing in exhausted context is high — plausible-looking bad code.',
    },
    {
      type: 'terminal',
      instruction: 'Check your context usage in Claude Code with the /compact command. This forces a manual compaction and shows you how much context has been consumed.',
      expectedCommand: '/compact',
      hint: 'Type /compact to trigger manual context compaction',
    },
    {
      type: 'multiple-choice',
      hint: 'One option stands out when you think about the core purpose.',
      question: 'You are 40 messages into a session. The agent just built a component using CSS modules, but your project uses Tailwind (as stated in CLAUDE.md). What should you do?',
      options: [
        'Tell the agent to refactor to Tailwind and continue the session',
        'Start a fresh session — the agent has lost your styling context',
        'Add a reminder about Tailwind and continue',
        'Either B or C — but check if other patterns are also drifting first',
      ],
      correctIndex: 3,
      explanation: 'One contradiction might be a fluke. But if the agent has also drifted on other patterns (error handling, file structure, naming), the context is exhausted and a fresh session is better. If it is an isolated mistake, a reminder might suffice. Always check for multiple drift signals before deciding.',
    },

    // === CLAUDE.MD AS PERSISTENT CONTEXT ===
    {
      type: 'multiple-choice',
      hint: 'Read each option carefully — one fits the context best.',
      question: 'Why is CLAUDE.md the best place for architectural decisions?',
      options: [
        'It is the only file the agent can read',
        'It is read at session start and never gets compacted — unlike conversation history which is lossy',
        'It is automatically synced to the cloud',
        'The agent prioritizes it over all other code files',
      ],
      correctIndex: 1,
      explanation: 'CLAUDE.md is read at the start of every session. Unlike conversation history, it never gets compacted. This makes it the perfect place for decisions that must survive across sessions: tech stack choices, coding patterns, file structure conventions, naming rules. Anything you repeat to the agent belongs in CLAUDE.md.',
    },
    {
      type: 'code-fill',
      hint: 'Use the exact syntax from the lesson examples.',
      instruction: 'Complete this CLAUDE.md to anchor critical decisions across sessions:',
      language: 'markdown',
      filename: 'CLAUDE.md',
      template: '# Invoice Generator\n\n## Architecture Decisions (DO NOT DEVIATE)\n- All API responses: `{ success: boolean, data?: T, error?: string }`\n- Error handling: {{error_pattern}} in every server action, never throw to client\n- Styling: {{styling_tool}} only — no CSS modules, no inline styles\n- State: {{state_lib}} for client state, server actions for mutations\n- Files: {{naming_convention}}, one component per file',
      blanks: [
        { id: 'error_pattern', answer: 'try/catch', alternatives: ['try-catch', 'try catch'], placeholder: 'error pattern?', hint: 'The standard JS error handling mechanism' },
        { id: 'styling_tool', answer: 'Tailwind', alternatives: ['tailwind', 'TailwindCSS', 'Tailwind CSS'], placeholder: 'which tool?', hint: 'Utility-first CSS framework' },
        { id: 'state_lib', answer: 'Zustand', alternatives: ['zustand'], placeholder: 'which library?', hint: 'Lightweight React state management library' },
        { id: 'naming_convention', answer: 'kebab-case', alternatives: ['kebab case', 'kebab_case'], placeholder: 'naming style?', hint: 'words-separated-by-dashes' },
      ],
      explanation: 'These decisions in CLAUDE.md serve as persistent memory. When the agent starts a new session, it reads this and immediately knows the project conventions — no re-explaining needed, no risk of context compaction losing them.',
    },
    {
      type: 'compare',
      hint: 'Focus on what makes one approach more appropriate here.',
      title: 'Monolithic spec vs modular specs',
      body: 'For larger projects, how you organize specs affects context consumption.',
      question: 'Which approach uses context more efficiently?',
      correctSide: 'right',
      left: {
        label: 'Everything in CLAUDE.md',
        content: '# CLAUDE.md (2000 lines)\n\n## Payment Flow\n[500 lines of payment spec...]\n\n## Email Templates\n[400 lines of email spec...]\n\n## PDF Generation\n[300 lines of PDF spec...]\n\n## Auth Flow\n[400 lines of auth spec...]\n\n// Agent reads ALL of this at session start\n// Even if working on just one feature\n// Wastes context on irrelevant specs',
        language: 'markdown',
      },
      right: {
        label: 'Modular spec files',
        content: '# CLAUDE.md (50 lines)\n\nBefore working on a feature, read its spec:\n- Payment: `specs/payments.md`\n- Email: `specs/emails.md`\n- PDF: `specs/pdf.md`\n\n// Agent reads only CLAUDE.md at start\n// Loads specific spec on demand:\n// "Read specs/payments.md before starting"\n// Context used only for relevant feature',
        language: 'markdown',
      },
      explanation: 'Modular specs let the agent load only what it needs. A 2000-line CLAUDE.md wastes context on every session. Keep CLAUDE.md short (decisions, conventions) and link to detailed spec files the agent reads on demand for specific features.',
    },
    {
      type: 'checkpoint',
      xp: 4,
      message: 'Persistent context mastered!',
    },

    // === INTERACTIVE EXERCISES ===
    {
      type: 'compare',
      hint: 'Consider the trade-offs discussed in the lesson.',
      title: 'Session planning: chaos vs control',
      body: 'How you plan your session determines whether the agent maintains quality throughout.',
      question: 'Which session plan keeps the agent effective longer?',
      correctSide: 'right',
      left: {
        label: 'No plan',
        content: 'TODO:\n- Build auth\n- Build database\n- Build API\n- Build frontend\n- Build tests\n- Fix bugs\n- Deploy\n- Write docs\n- Add monitoring\n- Optimize performance',
        language: 'text',
      },
      right: {
        label: 'Chunked plan',
        content: 'Session 1: Database + Auth\n  Done when: migrations run, login works\n  Then: update CLAUDE.md with decisions\n\nSession 2: API routes\n  Done when: all endpoints return correct data\n  Then: update CLAUDE.md with API patterns\n\nSession 3: Frontend\n  Done when: pages render with real data\n\nSession 4: Tests + Deploy\n  Done when: CI passes, live URL works',
        language: 'text',
      },
      explanation: 'Chunked plans give each session a clear scope and completion criteria. The CLAUDE.md update between sessions preserves decisions so the next session starts informed.',
    },
    {
      type: 'match',
      hint: 'Find the unique connection between each pair.',
      instruction: 'Match each symptom of context exhaustion to its underlying cause:',
      leftItems: ['Agent contradicts earlier decisions', 'Agent re-asks questions you already answered', 'Code quality declines mid-session', 'Agent ignores project conventions'],
      rightItems: ['Earlier instructions were compressed out of context', 'Your answers were lost during context compaction', 'Attention spread too thin across remaining tokens', 'CLAUDE.md conventions dropped from active memory'],
      correctPairs: { 0: 0, 1: 1, 2: 2, 3: 3 },
      explanation: 'All four symptoms trace back to context window limits. The fix is the same: end the session, update CLAUDE.md with decisions, and start a fresh session with clean context.',
    },
    {
      type: 'code-fill',
      hint: 'Each blank follows the conventions demonstrated earlier.',
      instruction: 'Complete this CLAUDE.md section to preserve decisions across sessions:',
      language: 'markdown',
      filename: 'CLAUDE.md',
      template: '## Architecture Decisions\n\n- Rendering: {{rendering}} components by default\n- Data fetching: use {{fetching}} (not API routes)\n- Auth: {{auth_provider}} with email/password\n- Database: {{database}} with row-level security\n\n## Completed\n- [x] Database schema and migrations\n- [x] Auth flow (login, signup, logout)\n- [ ] API routes\n- [ ] Frontend pages',
      blanks: [
        { id: 'rendering', answer: 'Server', alternatives: ['server', 'RSC', 'React Server'], placeholder: 'component type?', hint: 'Next.js defaults to this rendering mode' },
        { id: 'fetching', answer: 'server actions', alternatives: ['Server Actions', 'server action'], placeholder: 'data pattern?', hint: 'Next.js built-in mutation pattern' },
        { id: 'auth_provider', answer: 'Supabase Auth', alternatives: ['supabase auth', 'Supabase'], placeholder: 'which provider?', hint: 'The auth service in the project stack' },
        { id: 'database', answer: 'Supabase', alternatives: ['PostgreSQL', 'Postgres', 'supabase'], placeholder: 'which database?', hint: 'Managed Postgres service' },
      ],
      explanation: 'This CLAUDE.md section serves as persistent memory. When you start a new session, the agent reads this and picks up where the last session left off — no re-explaining needed.',
    },

    // === PRACTICAL WORKFLOW ===
    {
      type: 'multiple-choice',
      hint: 'Eliminate the options that only partially fit.',
      question: 'What should you do FIRST when starting a new agent session?',
      options: [
        'Start coding immediately to save time',
        'Ask the agent to read every file in the project',
        'Update CLAUDE.md with completed work from last session, then verify agent understanding',
        'Delete the conversation history from the previous session',
      ],
      correctIndex: 2,
      explanation: 'Before starting: update CLAUDE.md with completed work. At session start: verify agent context by asking it to summarize its understanding. Mid-session: try targeted reminders for drift. If drift persists, commit and start fresh. At session end: commit working code and update CLAUDE.md with new decisions.',
    },
    {
      type: 'order',
      hint: 'Consider what depends on what — prerequisites first.',
      instruction: 'Order the context management workflow from session start to session end:',
      items: [
        'Commit working code and update CLAUDE.md',
        'Verify agent understanding by asking it to summarize the task',
        'Update CLAUDE.md with completed work from last session',
        'Monitor for context drift signals mid-build',
        'Start fresh if multiple patterns are drifting',
      ],
      correctOrder: [2, 1, 3, 4, 0],
    },
    {
      type: 'terminal',
      instruction: 'After completing a chunk of work, commit it so the next session can start clean. The code on disk is always authoritative.',
      expectedCommand: 'git add -A && git commit -m "feat: complete invoice CRUD API"',
      hint: 'Stage and commit your completed chunk of work',
    },
    {
      type: 'checklist',
      title: 'Context management habits:',
      items: [
        'I front-load critical architectural decisions early in sessions',
        'I break builds into chunks that fit comfortably in one session',
        'I keep CLAUDE.md updated with decisions that must persist',
        'I recognize the three symptoms of context exhaustion',
        'I commit working code before starting fresh sessions',
        'I use spec files for detailed feature requirements',
      ],
    },
    {
      type: 'checkpoint',
      xp: 10,
      message: 'Context management learned! You know how to keep AI focused during long work sessions.',
    },
  ],
}

export default content
