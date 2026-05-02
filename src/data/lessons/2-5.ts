import type { LessonContent } from './types'

const content: LessonContent = {
  lessonId: '2-5',
  steps: [
    // === INTRODUCTION ===
    {
      type: 'info',
      title: 'The invisible cliff',
      body: "Every agent has a context window — a fixed amount of text it can hold in working memory. When you direct a long build session, the window fills up. Early decisions, file contents, and your original spec get pushed out as new code, errors, and conversation accumulate. The agent does not warn you. It just starts making decisions that contradict what it decided 30 minutes ago. Output quality degrades silently. Recognizing this cliff before you hit it is the single most important skill for long sessions.",
    },
    {
      type: 'info',
      title: 'How context windows actually work',
      body: "Think of context as a fixed-size buffer. Every message you send, every file the agent reads, every code block it generates — all of it consumes tokens. Claude Code's context window is large but finite. When it fills up, the system compacts older messages — summarizing or dropping them. The agent loses fidelity on early decisions. It still functions, but it is working from a lossy summary of what happened before, not the full picture.",
    },

    // === SYMPTOMS ===
    {
      type: 'info',
      title: 'Symptom 1: Contradicting earlier decisions',
      body: "The agent set up a Zustand store in step 3, then in step 15 creates a React Context for the same state. It chose Tailwind classes for spacing early on, then starts using inline styles. These contradictions are the clearest signal of context exhaustion — the agent has lost access to its earlier reasoning.",
    },
    {
      type: 'info',
      title: 'Symptom 2: Re-asking questions it already answered',
      body: "The agent asks \"what database are you using?\" when it already set up Drizzle with SQLite an hour ago. Or it proposes a file structure you already agreed on. When the agent asks questions whose answers exist earlier in the conversation, the earlier context has been compacted away.",
    },
    {
      type: 'info',
      title: 'Symptom 3: Declining code quality',
      body: "Error handling becomes inconsistent. Types that were strict become loose `any` casts. Functions that were well-documented earlier get no comments. The agent is not being lazy — it has lost the stylistic context from the early session where those patterns were established.",
    },
    {
      type: 'multiple-choice',
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
      type: 'info',
      title: 'Strategy: front-load critical decisions',
      body: "Put your most important architectural decisions early in the session when context is fresh. Do not save the hard stuff for later. If your database schema, API design, and error handling patterns are established in the first 20% of the session, they have the best chance of surviving compaction. The agent builds a mental model from early context — make sure that model contains your highest-priority patterns.",
    },
    {
      type: 'diagram',
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
    },
    {
      type: 'info',
      title: 'Strategy: work in focused chunks',
      body: "Instead of one marathon session, break the build into logical chunks: \"Set up the database layer\", \"Build the API endpoints\", \"Wire up the frontend\". Each chunk should be completable within a context-comfortable window. When a chunk is done, commit the work, then start fresh for the next chunk. The code on disk becomes the source of truth, not the conversation history.",
    },
    {
      type: 'code-demo',
      title: 'Chunking a build session',
      body: 'Plan your prompts as discrete, completable units. Each chunk should produce committed, working code.',
      language: 'markdown',
      filename: 'session-plan.md',
      code: "# Build Plan: Invoice Generator\n\n## Chunk 1 (fresh session)\n- Set up project: Next.js + Drizzle + SQLite\n- Define schema: invoices, line_items, clients\n- Seed with test data\n- Commit when: `bun run db:push` works + seed runs\n\n## Chunk 2 (fresh session)\n- CRUD API for invoices (all endpoints)\n- Error handling pattern: { success, data, error }\n- Commit when: all endpoints tested via curl\n\n## Chunk 3 (fresh session)\n- Invoice PDF generation\n- Email sending via Resend\n- Commit when: PDF renders correctly + email sends\n\n## Chunk 4 (fresh session)\n- Frontend: invoice list, create form, detail view\n- Commit when: full flow works in browser",
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'Task structuring patterns learned!',
    },

    // === WHEN TO START FRESH ===
    {
      type: 'info',
      title: 'When to start fresh vs. continue',
      body: "Start fresh when: (1) the agent contradicts earlier decisions, (2) you notice quality decline, (3) you are about to context-switch to a different area of the codebase, (4) the conversation has exceeded ~50 back-and-forth exchanges. Continue when: the agent is mid-task and producing consistent output, you are iterating on a single file or function, the session is still young. The cost of starting fresh is low — the agent reads your CLAUDE.md and codebase files at session start. The cost of continuing in an exhausted context is high — bad code that looks plausible.",
    },
    {
      type: 'terminal',
      instruction: 'Check your context usage in Claude Code with the /compact command. This forces a manual compaction and shows you how much context has been consumed.',
      expectedCommand: '/compact',
      hint: 'Type /compact to trigger manual context compaction',
    },
    {
      type: 'multiple-choice',
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
      type: 'info',
      title: 'CLAUDE.md: your persistent memory',
      body: "CLAUDE.md is read at the start of every session. Unlike conversation history, it never gets compacted. This makes it the perfect place for decisions that must survive across sessions: tech stack choices, coding patterns, file structure conventions, naming rules. Anything you find yourself repeating to the agent belongs in CLAUDE.md. Think of it as session-persistent context that transcends individual conversations.",
    },
    {
      type: 'code-demo',
      title: 'CLAUDE.md as context anchor',
      body: 'Key patterns and decisions go here so the agent never loses them, regardless of session length.',
      language: 'markdown',
      filename: 'CLAUDE.md',
      code: "# Invoice Generator\n\n## Architecture Decisions (DO NOT DEVIATE)\n- All API responses: `{ success: boolean, data?: T, error?: string }`\n- Error handling: try/catch in every server action, never throw to client\n- Styling: Tailwind only — no CSS modules, no inline styles\n- State: Zustand for client state, server actions for mutations\n- Files: kebab-case, one component per file\n\n## Completed\n- [x] Database schema + migrations\n- [x] CRUD API with proper error responses\n- [ ] PDF generation\n- [ ] Frontend views\n\n## Current Conventions\n- Toast notifications via sonner (already installed)\n- Form validation via zod schemas in `src/schemas/`\n- All dates stored as ISO strings, displayed via date-fns",
    },
    {
      type: 'info',
      title: 'Spec files as context supplements',
      body: "For larger projects, CLAUDE.md links to spec files. You can tell the agent: \"Read SPEC.md before starting.\" These files are read on demand — they consume context but provide the agent with full specifications when needed. Keep specs modular: one file per feature area. The agent reads only what it needs for the current task.",
    },
    {
      type: 'code-demo',
      title: 'Referencing specs from CLAUDE.md',
      body: 'Link to detailed specs so the agent can load them on demand without bloating every session.',
      language: 'markdown',
      filename: 'CLAUDE.md',
      code: "# Project Specs\n\nBefore working on a feature, read the relevant spec:\n- Payment flow: `specs/payments.md`\n- Email templates: `specs/emails.md`\n- PDF generation: `specs/pdf.md`\n\nAlways check the spec before making architectural decisions\nin that feature area.",
    },
    {
      type: 'checkpoint',
      xp: 4,
      message: 'Persistent context mastered!',
    },

    // === PRACTICAL WORKFLOW ===
    {
      type: 'info',
      title: 'The session hygiene workflow',
      body: "Before starting: update CLAUDE.md with completed work from last session. At session start: verify the agent has correct context by asking it to summarize its understanding. Mid-session: if you notice drift, try a targeted reminder first. If drift persists across multiple patterns, commit what works, then start fresh. At session end: commit all working code, update CLAUDE.md with new decisions made, note what is left to do.",
    },
    {
      type: 'order',
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
      message: 'Context management mastered! You can now run long build sessions without quality decay.',
    },
  ],
}

export default content
