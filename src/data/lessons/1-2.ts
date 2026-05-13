import type { LessonContent } from './types'

const content: LessonContent = {
  lessonId: '1-2',
  steps: [
    {
      type: 'info',
      title: 'How AI memory works',
      body: 'Every time you talk to an AI agent, you are writing into a fixed-size memory space called the context window. It holds everything: your instructions, the files the AI reads, your conversation history, and the AI\'s responses. When this memory fills up, the oldest information gets dropped. Understanding this limit is the difference between a productive session and one where the AI forgets what you asked ten minutes ago.',
    },
    {
      type: 'info',
      title: 'What is a context window?',
      body: 'Think of it as a whiteboard with a fixed surface area. Claude\'s whiteboard holds about 200,000 tokens — roughly 150,000 words or 500 pages of text. That sounds enormous, but it fills faster than you would expect. Background instructions and project files can use up 30-50% of the space before you even type your first message.',
    },
    {
      type: 'interactive-diagram',
      title: 'Context Window Budget',
      body: 'Click through each stage to see how a typical Claude Code session fills the context window.',
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
      stages: [
        {
          highlightNodes: ['window'],
          highlightEdges: [],
          explanation: 'You start with a fresh 200,000-token context window. Think of it as an empty whiteboard. Everything that happens in this session must fit on this surface.',
        },
        {
          highlightNodes: ['sys', 'window'],
          highlightEdges: [{ from: 'sys', to: 'window' }],
          explanation: 'The system prompt is loaded first, consuming about 2,000 tokens. This contains Claude\'s base instructions and capabilities. You never see it, but it\'s always there.',
        },
        {
          highlightNodes: ['claude', 'window'],
          highlightEdges: [{ from: 'claude', to: 'window' }],
          explanation: 'Your CLAUDE.md file is auto-injected next, using 1,000 to 5,000 tokens. This is your project\'s persistent memory — architecture rules, conventions, decisions.',
        },
        {
          highlightNodes: ['code', 'window'],
          highlightEdges: [{ from: 'code', to: 'window' }],
          explanation: 'As the agent reads files, each one fills the window. Five files can easily consume 10,000-50,000 tokens. This is usually the biggest consumer after conversation history.',
        },
        {
          highlightNodes: ['prompt', 'window'],
          highlightEdges: [{ from: 'prompt', to: 'window' }],
          explanation: 'Your prompts are relatively small — 500 to 2,000 tokens each. But they accumulate over a session. After 20 back-and-forth exchanges, this adds up fast.',
        },
        {
          highlightNodes: ['window', 'response'],
          highlightEdges: [{ from: 'window', to: 'response' }],
          explanation: 'Whatever tokens remain are available for the model\'s response. Early in a session there is plenty of room. After 30 minutes, the window may be nearly full, and response quality degrades.',
        },
      ],
    },
    {
      type: 'checkpoint',
      xp: 2,
      message: 'You understand how AI memory works. This will save you a lot of time.',
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
      message: 'You can estimate how much AI memory your requests use. Practical skill.',
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
      instruction: 'Here is a quick way to estimate how many tokens a file uses. This command counts the characters in a file. Divide the result by 3 or 4 to get an approximate token count:',
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
      message: 'You can plan your AI sessions like a budget. Smart.',
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
      message: 'You know the warning signs of AI memory running low. That saves hours.',
    },
    {
      type: 'compare',
      title: 'Fresh session vs exhausted session',
      body: 'The same agent behaves very differently depending on how much context has been consumed.',
      left: {
        label: 'Fresh (start of session)',
        content: 'Available: 200,000 tokens\nSystem prompt: loaded\nCLAUDE.md: loaded\nYour code: not yet read\n\nAgent behavior:\n✓ Follows all instructions\n✓ Consistent style\n✓ Remembers constraints',
        language: 'text',
      },
      right: {
        label: 'Exhausted (30 min in)',
        content: 'Available: ~12,000 tokens\nSystem prompt: compressed\nCLAUDE.md: partially lost\nYour code: fragments remain\n\nAgent behavior:\n✗ Forgets earlier decisions\n✗ Contradicts itself\n✗ Ignores constraints',
        language: 'text',
      },
    },
    {
      type: 'match',
      instruction: 'Match each context consumer to its approximate token cost:',
      leftItems: ['System prompt', 'CLAUDE.md file', 'Large code file (500 lines)', 'Conversation history (30 min)'],
      rightItems: ['~2,000 tokens', '1,000–5,000 tokens', '5,000–15,000 tokens', '20,000–80,000 tokens'],
      correctPairs: { 0: 0, 1: 1, 2: 2, 3: 3 },
      explanation: 'Conversation history is by far the largest consumer. A 30-minute session can eat 20K-80K tokens in back-and-forth, leaving little room for the actual work.',
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
      message: 'Context management learned! You now understand how AI memory works and how to use it wisely.',
    },
  ],
}

export default content
