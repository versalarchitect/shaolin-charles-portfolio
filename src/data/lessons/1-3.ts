import type { LessonContent } from './types'

const content: LessonContent = {
  lessonId: '1-3',
  steps: [
    {
      type: 'info',
      title: 'Five levels of AI tools — most people only know one',
      body: "There are five levels of AI assistance — from copying text into a chat window all the way up to fully autonomous agents that connect to real tools. Most people never move past Level 1: paste a question, get an answer, paste the answer back. That works for quick questions, but it barely scratches the surface. This lesson teaches you to recognize which level each task needs.",
    },
    {
      type: 'info',
      title: 'The Tool Ladder',
      body: "Think of AI tools as a ladder. Each rung gives you more power but requires more setup. The skill isn't climbing to the top — it's knowing which rung fits the job. A quick rename? Paste. A daily report? Script. A full feature build? Agent. Matching the tool to the task is what separates casual users from effective directors.",
    },
    {
      type: 'diagram',
      title: 'The Tool Ladder',
      body: 'Five levels of AI assistance, from manual to fully connected. Each rung adds capability — and setup cost.',
      diagram: {
        direction: 'TB',
        nodes: [
          { id: 'mcp', label: 'MCP', sublabel: 'Connected', shape: 'rounded', highlight: true },
          { id: 'agent', label: 'Agent', sublabel: 'Autonomous', shape: 'rect' },
          { id: 'script', label: 'Script', sublabel: 'Automated', shape: 'rect' },
          { id: 'skill', label: 'Skill', sublabel: 'Repeatable', shape: 'rect' },
          { id: 'paste', label: 'Paste', sublabel: 'Copy-paste', shape: 'rect' },
        ],
        edges: [
          { from: 'paste', to: 'skill' },
          { from: 'skill', to: 'script' },
          { from: 'script', to: 'agent' },
          { from: 'agent', to: 'mcp' },
        ],
      },
    },
    {
      type: 'checkpoint',
      xp: 2,
      message: 'You see the five levels of AI tools. Most people only know level one.',
    },

    // === LEVEL 1: PASTE ===
    {
      type: 'info',
      title: 'Level 1: Paste',
      body: "The simplest level. You copy code or a question into ChatGPT or Claude.ai, read the answer, and paste the result back into your editor. Zero setup, instant results. Great for one-off questions like \"what does this regex do?\" or \"convert this function to TypeScript.\" The limitation: it's manual every time. No memory between sessions, no file access, no automation.",
    },
    {
      type: 'multiple-choice',
      question: 'Which task is BEST suited for paste-level AI?',
      options: [
        'Refactoring 50 files to use a new API',
        'Explaining what a confusing one-liner does',
        'Running database migrations on every deploy',
        'Building a full CRUD feature with tests',
      ],
      correctIndex: 1,
      explanation: 'Paste level is ideal for quick, one-off questions that need a human to apply the answer. Explaining a confusing line is a perfect fit — fast question, fast answer, done.',
    },

    // === LEVEL 2: SKILL ===
    {
      type: 'info',
      title: 'Level 2: Skill',
      body: "A skill is a reusable prompt template you define once and invoke by name. In Claude Code, you create a /skill that encapsulates instructions, context, and constraints. Instead of re-typing \"review this component for accessibility issues and suggest ARIA attributes\" every time, you run /a11y-review. The prompt is the same, the target changes. Use skills when you catch yourself pasting the same type of question more than twice.",
    },
    {
      type: 'code-demo',
      title: 'Example: A review skill',
      body: 'You define a skill once in your project config. Then invoke it on any file.',
      language: 'markdown',
      filename: '.claude/skills/a11y-review.md',
      code: '# Accessibility Review\n\nReview the given component for:\n- Missing ARIA attributes\n- Keyboard navigation issues\n- Color contrast problems\n- Screen reader compatibility\n\nOutput a numbered list of issues with fixes.',
    },
    {
      type: 'code-input',
      instruction: 'In Claude Code, how do you invoke a skill named "a11y-review"?',
      placeholder: '/_____-______',
      answer: '/a11y-review',
      hint: 'Skills are invoked with a slash prefix followed by the skill name',
    },
    {
      type: 'checkpoint',
      xp: 2,
      message: 'You understand reusable AI instructions. Nice.',
    },

    // === LEVEL 3: SCRIPT ===
    {
      type: 'info',
      title: 'Level 3: Script',
      body: "A script calls the AI API programmatically. No human in the loop — it runs on a schedule, on a git hook, or as part of CI. Example: a Node script that reads your git diff, sends it to Claude, and posts a code review summary to Slack. The key difference from a skill: scripts run without you. They're fully automated. Use this level when the task is predictable, repetitive, and doesn't need judgment calls.",
    },
    {
      type: 'code-demo',
      title: 'A script that auto-reviews PRs',
      body: 'This script runs in CI. It reads the diff, sends it to Claude, and logs the review. No human needed.',
      language: 'typescript',
      filename: 'scripts/review-diff.ts',
      code: "import Anthropic from '@anthropic-ai/sdk'\n\nconst client = new Anthropic()\nconst diff = await $`git diff main...HEAD`\n\nconst review = await client.messages.create({\n  model: 'claude-sonnet-4-20250514',\n  max_tokens: 1024,\n  messages: [{\n    role: 'user',\n    content: `Review this diff:\\n${diff}`\n  }]\n})\n\nconsole.log(review.content[0].text)",
    },
    {
      type: 'multiple-choice',
      question: 'What makes a script different from a skill?',
      options: [
        'Scripts use a different AI model',
        'Scripts run without human interaction',
        'Scripts are faster',
        'Scripts can only run locally',
      ],
      correctIndex: 1,
      explanation: 'The defining difference: scripts are fully automated. They call the API, process the result, and take action — no human pasting or reviewing in the loop.',
    },
    {
      type: 'checkpoint',
      xp: 2,
      message: 'You understand automated AI scripts. These run without you.',
    },

    // === LEVEL 4: AGENT ===
    {
      type: 'info',
      title: 'Level 4: Agent',
      body: "An agent is an AI that acts autonomously within your codebase. Claude Code in agent mode can read your files, understand your project structure, write code across multiple files, run tests, and fix errors — all from a single high-level instruction. You say \"add dark mode support to the settings page\" and it reads the existing code, identifies the theme system, modifies components, updates styles, and verifies the build passes. Use agent mode for complex, multi-step tasks where the AI needs context from your actual codebase.",
    },
    {
      type: 'terminal',
      instruction: 'Open your terminal and launch Claude Code. It starts in agent mode by default, which means it can read and modify your project files:',
      expectedCommand: 'claude',
      hint: 'Just type the command name to start Claude Code',
    },
    {
      type: 'code-demo',
      title: 'Agent-level prompt example',
      body: 'A single instruction that would take multiple paste-level interactions:',
      language: 'text',
      code: "Add a /health endpoint to the API that returns:\n- server uptime\n- database connection status\n- current memory usage\n\nInclude tests. Use the existing error handling pattern\nfrom the other routes.",
    },

    // === LEVEL 5: MCP ===
    {
      type: 'info',
      title: 'Level 5: MCP (Model Context Protocol)',
      body: "MCP is agent mode plus external tool access. The agent doesn't just read and write files — it connects to databases, APIs, browsers, and services through a standardized protocol. An MCP-equipped agent can query your production database, check your Vercel deployment status, read GitHub issues, and browse documentation — all within a single conversation. This is the ceiling: autonomous action with real-world connectivity.",
    },
    {
      type: 'code-demo',
      title: 'MCP server config',
      body: 'You tell Claude Code which tools to connect. Each MCP server exposes capabilities the agent can use.',
      language: 'json',
      filename: '.claude/settings.json',
      code: '{\n  "mcpServers": {\n    "supabase": {\n      "command": "npx",\n      "args": ["-y", "@supabase/mcp-server"]\n    },\n    "browser": {\n      "command": "npx",\n      "args": ["-y", "@anthropic/mcp-browser"]\n    }\n  }\n}',
    },
    {
      type: 'checkpoint',
      xp: 2,
      message: 'Full ladder mapped!',
    },

    // === MATCH EXERCISE ===
    {
      type: 'match',
      instruction: 'Match each tool level to its description:',
      leftItems: [
        'Level 1: Paste',
        'Level 2: Skill',
        'Level 3: Script',
        'Level 4: Agent',
        'Level 5: MCP',
      ],
      rightItems: [
        'Copy output from AI chat into your editor',
        'AI edits files directly in your project',
        'AI runs a sequence of predefined steps',
        'AI plans and executes autonomously',
        'AI connects to external tools and APIs',
      ],
      correctPairs: { 0: 0, 1: 1, 2: 2, 3: 3, 4: 4 },
      explanation: 'Each level gives the AI more autonomy. Paste is manual copy-paste. Skill means inline editing. Script automates steps. Agent plans independently. MCP extends capabilities beyond the local machine.',
    },

    // === DECISION FLOW ===
    {
      type: 'diagram',
      title: 'When to Escalate',
      body: 'Use this decision tree to pick the right level for any task.',
      diagram: {
        direction: 'TB',
        nodes: [
          { id: 'task', label: 'New Task', shape: 'rounded', highlight: true },
          { id: 'repeat', label: 'Repeatable?', shape: 'diamond' },
          { id: 'paste', label: 'Paste' },
          { id: 'complex', label: 'Complex?', shape: 'diamond' },
          { id: 'skill', label: 'Skill' },
          { id: 'tools', label: 'Needs Tools?', shape: 'diamond' },
          { id: 'script', label: 'Script' },
          { id: 'agentmcp', label: 'Agent+MCP', shape: 'pill', highlight: true },
        ],
        edges: [
          { from: 'task', to: 'repeat' },
          { from: 'repeat', to: 'paste', label: 'no' },
          { from: 'repeat', to: 'complex', label: 'yes' },
          { from: 'complex', to: 'skill', label: 'no' },
          { from: 'complex', to: 'tools', label: 'yes' },
          { from: 'tools', to: 'script', label: 'no' },
          { from: 'tools', to: 'agentmcp', label: 'yes' },
        ],
      },
    },

    // === CLASSIFY TASKS ===
    {
      type: 'info',
      title: 'Classify real tasks',
      body: "Now let's practice. For each of the following tasks, identify which level of the tool ladder it belongs on. Think about: Is it one-off or repeating? Does it need file access? Does it need external tools? Does it need human judgment on the result?",
    },
    {
      type: 'multiple-choice',
      question: 'Task: "What does the ?? operator do in JavaScript?" — Which level?',
      options: [
        'Paste',
        'Skill',
        'Script',
        'Agent',
      ],
      correctIndex: 0,
      explanation: 'A quick factual question with no file context needed. Paste it into any AI chat, get your answer, done. No setup required.',
    },
    {
      type: 'multiple-choice',
      question: 'Task: "Every morning, summarize yesterday\'s GitHub issues and post to Slack." — Which level?',
      options: [
        'Paste',
        'Skill',
        'Script',
        'Agent + MCP',
      ],
      correctIndex: 2,
      explanation: 'This is automated (runs daily without you), uses APIs (GitHub + Slack), and is predictable. A script calling the AI API on a cron job is the right fit.',
    },
    {
      type: 'multiple-choice',
      question: 'Task: "Refactor the auth module to use the new token format, update all call sites, and fix the tests." — Which level?',
      options: [
        'Paste',
        'Skill',
        'Script',
        'Agent',
      ],
      correctIndex: 3,
      explanation: 'This requires reading multiple files, understanding the codebase structure, making coordinated edits, and running tests. Agent mode handles this — it needs file access and multi-step reasoning.',
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'You can match the right AI tool to the right task. That is efficient thinking.',
    },

    // === ORDER EXERCISE ===
    {
      type: 'order',
      instruction: 'Order the tool ladder from LEAST to MOST capability:',
      items: ['Agent', 'Paste', 'MCP', 'Skill', 'Script'],
      correctOrder: [1, 3, 4, 0, 2],
    },

    // === KEY INSIGHT ===
    {
      type: 'info',
      title: 'The escalation instinct',
      body: "The most valuable skill in this entire course is the escalation instinct: the ability to recognize, mid-task, that you're at the wrong level. If you've pasted the same kind of question three times, make a skill. If you're running a skill manually every day, write a script. If the script needs to read your codebase and make decisions, switch to an agent. If the agent needs external data, add MCP servers. Never stay on a rung longer than necessary.",
    },

    // === CHECKLIST ===
    {
      type: 'checklist',
      title: 'Level recognition checklist:',
      items: [
        'I can identify paste-level tasks (one-off, no file access)',
        'I can spot when a task deserves a reusable skill',
        'I know when to automate with a script (no human in loop)',
        'I understand when agent mode is needed (multi-file, multi-step)',
        'I know MCP adds external tool access to agents',
        'I look for escalation signals during my workflow',
      ],
    },
    {
      type: 'checkpoint',
      xp: 9,
      message: 'Tool Ladder complete! You now see five levels of AI tools. That perspective is your competitive advantage.',
    },
  ],
}

export default content
