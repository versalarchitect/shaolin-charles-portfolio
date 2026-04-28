import type { LessonContent } from './types'

const content: LessonContent = {
  lessonId: '1-2',
  steps: [
    {
      type: 'info',
      title: 'The model\'s working memory',
      body: 'Every time you talk to Claude, you\'re writing into a fixed-size buffer called the context window. It holds everything: the system prompt, your CLAUDE.md, code files the agent reads, your conversation history, and the model\'s responses. When the buffer fills up, the oldest information gets dropped. Understanding this budget is the difference between a productive session and one where the agent forgets what you asked for ten minutes ago.',
    },
    {
      type: 'info',
      title: 'What is a context window?',
      body: 'Think of it as a whiteboard with a fixed surface area. Claude\'s whiteboard is 200,000 tokens — roughly 150,000 words or 500 pages of text. That sounds enormous, but it fills faster than you\'d expect. System prompts, CLAUDE.md files, and code context can consume 30-50% of the window before you type a single word.',
    },
    {
      type: 'diagram',
      title: 'Context Window Budget',
      body: 'Every part of a conversation consumes tokens from the same fixed budget. Here is how a typical Claude Code session fills the window.',
      diagram: {
        direction: 'TB',
        nodes: [
          { id: 'sys', label: 'System Prompt', sublabel: '~2K tokens', shape: 'rounded' },
          { id: 'claude', label: 'CLAUDE.md', sublabel: '~1-5K tokens', shape: 'rounded' },
          { id: 'code', label: 'Code Context', sublabel: '~10-50K tokens' },
          { id: 'window', label: 'Context Window', sublabel: '200K total', shape: 'rounded', highlight: true },
          { id: 'prompt', label: 'Your Prompt', sublabel: '~0.5-2K tokens' },
          { id: 'response', label: 'Model Response', sublabel: 'Remaining', shape: 'pill', highlight: true },
        ],
        edges: [
          { from: 'sys', to: 'window', label: 'loaded first' },
          { from: 'claude', to: 'window', label: 'auto-injected' },
          { from: 'code', to: 'window', label: 'files read' },
          { from: 'prompt', to: 'window' },
          { from: 'window', to: 'response', label: 'what\'s left' },
        ],
      },
    },
    {
      type: 'checkpoint',
      xp: 2,
      message: 'Context window model understood!',
    },

    // === TOKEN COUNTING ===
    {
      type: 'info',
      title: 'How tokens work',
      body: 'Tokens are not characters or words — they\'re chunks of text that the model processes as single units. In English prose, 1 token is roughly 4 characters or 0.75 words. But code is denser: variable names, brackets, and indentation all consume tokens. A 200-line TypeScript file might be 2,000-4,000 tokens depending on complexity.',
    },
    {
      type: 'multiple-choice',
      question: 'Approximately how many tokens is the sentence "The quick brown fox jumps over the lazy dog" (44 characters)?',
      options: [
        '5 tokens',
        '10 tokens',
        '44 tokens',
        '20 tokens',
      ],
      correctIndex: 1,
      explanation: '44 characters / ~4 chars per token = roughly 10-11 tokens. The heuristic of 1 token per 4 English characters is a reliable quick estimate.',
    },
    {
      type: 'code-demo',
      title: 'Token estimation heuristics',
      body: 'Use these rules of thumb to quickly estimate token usage without any tools.',
      language: 'text',
      filename: 'token-heuristics.txt',
      code: 'English prose:  1 token ≈ 4 characters ≈ 0.75 words\nCode (JS/TS):   1 token ≈ 3 characters (denser)\nJSON/config:    1 token ≈ 2.5 characters (very dense)\n\nQuick estimates:\n- Short prompt (2 sentences):     ~30-50 tokens\n- Detailed prompt (paragraph):    ~150-300 tokens\n- CLAUDE.md (typical):            ~1,000-5,000 tokens\n- 100-line TypeScript file:       ~1,000-2,000 tokens\n- Full React component (300 LOC): ~3,000-6,000 tokens\n- npm package.json:               ~500-1,500 tokens',
    },
    {
      type: 'code-input',
      instruction: 'A TypeScript file is 400 lines long. Using the heuristic that 100 lines of code is roughly 1,000-2,000 tokens, what is a reasonable upper estimate for this file?',
      placeholder: 'Enter a number (tokens)',
      answer: '8000',
      hint: '400 lines / 100 = 4 groups, times the upper bound of 2,000',
    },
    {
      type: 'checkpoint',
      xp: 2,
      message: 'Token math on lock!',
    },

    // === WHAT FILLS THE WINDOW ===
    {
      type: 'info',
      title: 'What fills the window in Claude Code',
      body: 'When you start a Claude Code session, the context window is not empty. The system prompt is injected automatically. Your CLAUDE.md is loaded. As the agent works, it reads files, runs commands, and each tool call and result adds to the window. A single "read this file and refactor it" can consume 10,000+ tokens between the file content, the model\'s analysis, and the rewritten code.',
    },
    {
      type: 'order',
      instruction: 'Order these from MOST tokens consumed to LEAST in a typical Claude Code session:',
      items: [
        'Code files read by the agent',
        'Conversation history',
        'System prompt',
        'Your typed prompts',
        'CLAUDE.md content',
      ],
      correctOrder: [0, 1, 4, 2, 3],
    },
    {
      type: 'terminal',
      instruction: 'Use wc to count the characters in a file, which you can then divide by 3-4 to estimate tokens. Try it on any TypeScript file:',
      expectedCommand: 'wc -c src/App.tsx',
      hint: 'wc -c <filepath>',
    },
    {
      type: 'code-demo',
      title: 'Estimating a session budget',
      body: 'Before starting a complex task, sketch out your token budget to see if it fits in a single session.',
      language: 'text',
      filename: 'session-budget.txt',
      code: 'Context Window:           200,000 tokens\n─────────────────────────────────────\nSystem prompt:             -2,000\nCLAUDE.md:                 -3,000\nFiles to read (5 files):  -15,000\nConversation so far:      -20,000\nYour next prompt:            -500\n─────────────────────────────────────\nRemaining for response:   159,500 tokens  ✓ Plenty\n\n--- After 30 minutes of back-and-forth ---\n\nConversation history:    -140,000\nFiles read this session:  -40,000\nSystem + CLAUDE.md:        -5,000\n─────────────────────────────────────\nRemaining for response:    15,000 tokens  ⚠ Getting tight\nRemaining after next read: ~5,000 tokens  ✗ Danger zone',
    },
    {
      type: 'checkpoint',
      xp: 2,
      message: 'Budget planning unlocked!',
    },

    // === CONTEXT EXHAUSTION ===
    {
      type: 'info',
      title: 'When the window fills up',
      body: 'Context exhaustion is real and its symptoms are subtle. The model doesn\'t crash — it degrades. It starts repeating instructions you already gave. It forgets constraints from early in the conversation. Code quality drops. It re-reads files it already read. You might think the model is "being dumb," but it has literally lost the memory of your earlier messages.',
    },
    {
      type: 'multiple-choice',
      question: 'Which is NOT a symptom of context window exhaustion?',
      options: [
        'The model forgets instructions from earlier in the session',
        'The model starts repeating itself',
        'The model refuses to respond entirely',
        'Code quality and coherence decrease',
      ],
      correctIndex: 2,
      explanation: 'The model doesn\'t refuse to respond — it keeps going, but with degraded quality. It silently loses older context, which makes the symptoms harder to spot than an outright error.',
    },
    {
      type: 'diagram',
      title: 'Context Exhaustion',
      body: 'When the context window fills up, Claude Code triggers compaction to free space — but some information is inevitably lost.',
      diagram: {
        direction: 'TB',
        nodes: [
          { id: 'full', label: 'Full Window', sublabel: '200K used', shape: 'rounded', highlight: true },
          { id: 'compact', label: 'Compaction?', shape: 'diamond' },
          { id: 'lost', label: 'Old Msgs Lost', sublabel: 'Summarized away' },
          { id: 'kept', label: 'Key Context', sublabel: 'Preserved' },
          { id: 'resume', label: 'Continues', shape: 'pill' },
        ],
        edges: [
          { from: 'full', to: 'compact', label: 'threshold hit' },
          { from: 'compact', to: 'lost', label: 'low priority' },
          { from: 'compact', to: 'kept', label: 'high priority' },
          { from: 'lost', to: 'resume', dashed: true },
          { from: 'kept', to: 'resume' },
        ],
      },
    },
    {
      type: 'info',
      title: 'How compaction works',
      body: 'Claude Code automatically compacts the conversation when the context window gets close to full. It summarizes older messages into a compressed form, preserving the most important details — file paths, key decisions, current task — while discarding the exact wording of earlier exchanges. This is why you sometimes see "[conversation compacted]" in your session. The model keeps working, but its memory of the early conversation becomes a summary, not a transcript.',
    },
    {
      type: 'checkpoint',
      xp: 2,
      message: 'Exhaustion patterns recognized!',
    },

    // === STRATEGIES ===
    {
      type: 'info',
      title: 'Strategy 1: Start fresh sessions',
      body: 'The single most effective strategy is knowing when to start a new session. If you\'ve been going back and forth for 20+ messages, or the model starts showing exhaustion symptoms, start a new conversation. You lose nothing — the code changes are already saved to disk. The new session starts with a clean 200K window.',
    },
    {
      type: 'info',
      title: 'Strategy 2: CLAUDE.md as external memory',
      body: 'Your CLAUDE.md file is loaded fresh at the start of every session. Put persistent decisions, architecture rules, and project conventions there instead of repeating them in every prompt. This is external memory that survives context resets. Think of it as the model\'s long-term storage while the context window is short-term.',
    },
    {
      type: 'code-demo',
      title: 'Strategy 3: Spec files for complex tasks',
      body: 'For large tasks, write a spec file that the agent can reference. This keeps critical details available even after compaction.',
      language: 'markdown',
      filename: 'specs/refactor-auth.md',
      code: '# Auth Refactor Spec\n\n## Goal\nReplace session-based auth with JWT tokens.\n\n## Files to modify\n- src/middleware/auth.ts\n- src/routes/login.ts\n- src/routes/protected.ts\n- src/lib/jwt.ts (new)\n\n## Constraints\n- Must be backward compatible with existing sessions\n- Token expiry: 24 hours\n- Refresh tokens: 7 days\n\n## Definition of done\n- [ ] All protected routes accept Bearer tokens\n- [ ] Login returns JWT + refresh token\n- [ ] Old session cookies still work (migration period)',
    },
    {
      type: 'multiple-choice',
      question: 'Why is a spec file more effective than a long initial prompt for complex tasks?',
      options: [
        'Spec files are faster to write',
        'The agent can re-read it after compaction, but a long prompt gets summarized away',
        'Spec files use fewer tokens',
        'The model prefers markdown files',
      ],
      correctIndex: 1,
      explanation: 'A spec file lives on disk. If the context gets compacted and the model loses your detailed instructions, it can re-read the spec file and get the full details back. A long prompt exists only in the context window and gets compressed during compaction.',
    },
    {
      type: 'checklist',
      title: 'Context management habits:',
      items: [
        'Start a new session when quality degrades',
        'Keep CLAUDE.md updated with persistent decisions',
        'Write spec files for tasks spanning many files',
        'Estimate token budget before starting large tasks',
        'Break big refactors into focused, single-session chunks',
        'Watch for compaction messages as a warning sign',
      ],
    },
    {
      type: 'code-input',
      instruction: 'In Claude Code, what is the approximate context window size in tokens?',
      placeholder: 'Enter a number',
      answer: '200000',
      hint: 'It\'s 200K — write it as a full number',
    },
    {
      type: 'checkpoint',
      xp: 5,
      message: 'Context mastery achieved! You now think in token budgets.',
    },
  ],
}

export default content
