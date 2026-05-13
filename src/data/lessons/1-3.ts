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
      type: 'interactive-diagram',
      title: 'The Tool Ladder',
      body: 'Click through each rung to understand the five levels of AI assistance.',
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
      stages: [
        {
          highlightNodes: ['paste'],
          highlightEdges: [],
          explanation: 'Level 1: Paste. Copy a question into ChatGPT or Claude.ai, read the answer, paste back. Zero setup. Good for one-off questions. But fully manual every time with no memory between sessions.',
        },
        {
          highlightNodes: ['paste', 'skill'],
          highlightEdges: [{ from: 'paste', to: 'skill' }],
          explanation: 'Level 2: Skill. A reusable prompt template you invoke by name (like /a11y-review). You define it once, use it on any target. The AI edits files directly instead of you copy-pasting. Use when you catch yourself pasting the same question more than twice.',
        },
        {
          highlightNodes: ['skill', 'script'],
          highlightEdges: [{ from: 'skill', to: 'script' }],
          explanation: 'Level 3: Script. The AI runs without you. A script calls the API on a cron job or git hook. No human in the loop. Use for predictable, repeatable tasks that need zero judgment.',
        },
        {
          highlightNodes: ['script', 'agent'],
          highlightEdges: [{ from: 'script', to: 'agent' }],
          explanation: 'Level 4: Agent. The AI reads your codebase, plans a multi-step approach, edits multiple files, runs tests, and fixes errors. You give one high-level instruction. Use for complex tasks that need codebase understanding.',
        },
        {
          highlightNodes: ['agent', 'mcp'],
          highlightEdges: [{ from: 'agent', to: 'mcp' }],
          explanation: 'Level 5: MCP. Agent mode plus external tool access. The AI connects to databases, APIs, browsers, and services through Model Context Protocol. Autonomous action with real-world connectivity.',
        },
      ],
    },
    {
      type: 'checkpoint',
      xp: 2,
      message: 'You see the five levels of AI tools. Most people only know level one.',
    },

    // === LEVEL 1: PASTE ===
    {
      type: 'multiple-choice',
      question: 'What is the key limitation of Level 1 (Paste) AI usage?',
      options: [
        'It cannot understand code',
        'It is manual every time with no memory between sessions, no file access, and no automation',
        'It only works with Python code',
        'It requires a paid subscription',
      ],
      correctIndex: 1,
      explanation: 'Level 1 is the simplest: copy code or a question into ChatGPT or Claude.ai, read the answer, paste back. Zero setup, instant results. Great for one-off questions like "what does this regex do?" But it is manual every time -- no memory between sessions, no file access, no automation.',
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
      type: 'multiple-choice',
      question: 'When should you create a reusable skill instead of pasting the same prompt?',
      options: [
        'Only for tasks that take more than an hour',
        'When you catch yourself pasting the same type of question more than twice',
        'Only for code review tasks',
        'When the AI model changes versions',
      ],
      correctIndex: 1,
      explanation: 'A skill is a reusable prompt template you define once and invoke by name. In Claude Code, you create a /skill that encapsulates instructions, context, and constraints. Instead of re-typing "review this component for accessibility issues" every time, you run /a11y-review. Use skills when you catch yourself pasting the same type of question more than twice.',
    },
    {
      type: 'code-fill',
      instruction: 'Complete this skill definition. A skill encapsulates reusable instructions that you invoke by name on any file.',
      language: 'markdown',
      filename: '.claude/skills/a11y-review.md',
      template: '# {{skill_title}} Review\n\nReview the given component for:\n- Missing {{attr_type}} attributes\n- Keyboard navigation issues\n- {{contrast_issue}} problems\n- Screen reader compatibility\n\nOutput a numbered list of issues with fixes.',
      blanks: [
        { id: 'skill_title', answer: 'Accessibility', alternatives: ['A11y', 'accessibility'], placeholder: '______', hint: 'What type of review is this skill for?' },
        { id: 'attr_type', answer: 'ARIA', alternatives: ['aria', 'Aria'], placeholder: '____', hint: 'HTML attributes for accessibility' },
        { id: 'contrast_issue', answer: 'Color contrast', alternatives: ['color contrast', 'Colour contrast', 'colour contrast'], placeholder: '______', hint: 'A visual accessibility concern related to colors' },
      ],
      explanation: 'This skill checks for the four pillars of web accessibility: ARIA attributes, keyboard navigation, color contrast, and screen reader compatibility. You define it once and invoke it on any component with /a11y-review.',
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
      type: 'multiple-choice',
      question: 'A Node script reads your git diff on every push, sends it to Claude, and posts a review to Slack. Which level of the Tool Ladder is this?',
      options: [
        'Level 1: Paste',
        'Level 2: Skill',
        'Level 3: Script',
        'Level 4: Agent',
      ],
      correctIndex: 2,
      explanation: 'A script calls the AI API programmatically with no human in the loop -- it runs on a schedule, on a git hook, or as part of CI. The key difference from a skill: scripts run without you. They are fully automated. Use this level when the task is predictable, repetitive, and does not need judgment calls.',
    },
    {
      type: 'code-fill',
      instruction: 'Complete this CI script that auto-reviews PRs. It reads the diff, sends it to Claude, and logs the review. No human needed.',
      language: 'typescript',
      filename: 'scripts/review-diff.ts',
      template: "import Anthropic from '{{import_path}}'\n\nconst client = new Anthropic()\nconst diff = await $`git diff {{diff_range}}`\n\nconst review = await client.messages.create({\n  model: 'claude-sonnet-4-20250514',\n  max_tokens: {{max_tokens}},\n  messages: [{\n    role: 'user',\n    content: `Review this diff:\\n${diff}`\n  }]\n})\n\nconsole.log(review.content[0].text)",
      blanks: [
        { id: 'import_path', answer: '@anthropic-ai/sdk', alternatives: ['anthropic'], placeholder: '______', hint: 'The official Anthropic SDK package name' },
        { id: 'diff_range', answer: 'main...HEAD', alternatives: ['main..HEAD'], placeholder: '______', hint: 'Git diff range from main branch to current HEAD' },
        { id: 'max_tokens', answer: '1024', alternatives: ['1024', '2048', '4096'], placeholder: '____', hint: 'A reasonable token limit for a code review response' },
      ],
      explanation: 'This script imports the Anthropic SDK, gets the git diff from main to HEAD, and sends it to Claude for review. It runs in CI without any human interaction — the defining feature of Level 3 (Script).',
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
      type: 'multiple-choice',
      question: 'What distinguishes an agent (Level 4) from a script (Level 3)?',
      options: [
        'Agents are faster because they skip the planning step',
        'Agents can read your codebase, plan multi-step approaches, edit multiple files, and fix errors autonomously from a single instruction',
        'Agents run on a schedule without human interaction, just like scripts',
        'Agents only work with Python code, while scripts work with any language',
      ],
      correctIndex: 1,
      explanation: 'An agent is an AI that acts autonomously within your codebase. Claude Code in agent mode can read your files, understand your project structure, write code across multiple files, run tests, and fix errors — all from a single high-level instruction. You say "add dark mode support to the settings page" and it reads the existing code, identifies the theme system, modifies components, updates styles, and verifies the build passes. Scripts are automated but predictable; agents reason and adapt.',
    },
    {
      type: 'terminal',
      instruction: 'Open your terminal and launch Claude Code. It starts in agent mode by default, which means it can read and modify your project files:',
      expectedCommand: 'claude',
      hint: 'Just type the command name to start Claude Code',
    },
    {
      type: 'code-fill',
      instruction: 'Complete this agent-level prompt. A single instruction that would take multiple paste-level interactions.',
      language: 'text',
      template: "Add a /health endpoint to the API that returns:\n- server {{metric_1}}\n- {{metric_2}} connection status\n- current memory usage\n\nInclude {{include_what}}. Use the existing error handling pattern\nfrom the other routes.",
      blanks: [
        { id: 'metric_1', answer: 'uptime', alternatives: ['up time'], placeholder: '______', hint: 'How long the server has been running' },
        { id: 'metric_2', answer: 'database', alternatives: ['db', 'DB'], placeholder: '______', hint: 'The persistent data store' },
        { id: 'include_what', answer: 'tests', alternatives: ['test', 'unit tests', 'test cases'], placeholder: '______', hint: 'What you should always write alongside new endpoints' },
      ],
      explanation: 'This prompt demonstrates agent-level work: it requires reading existing code (error handling pattern), creating a new file, and verifying it works (tests). A paste-level approach would require multiple back-and-forth interactions.',
    },

    // === LEVEL 5: MCP ===
    {
      type: 'multiple-choice',
      question: 'What does MCP (Model Context Protocol) add on top of agent mode?',
      options: [
        'A graphical user interface for the agent',
        'The ability to connect to external tools like databases, APIs, browsers, and services through a standardized protocol',
        'Faster response times by caching previous conversations',
        'The ability to run multiple agents in parallel on different codebases',
      ],
      correctIndex: 1,
      explanation: 'MCP is agent mode plus external tool access. The agent does not just read and write files — it connects to databases, APIs, browsers, and services through a standardized protocol. An MCP-equipped agent can query your production database, check your Vercel deployment status, read GitHub issues, and browse documentation — all within a single conversation. This is the ceiling: autonomous action with real-world connectivity.',
    },
    {
      type: 'code-fill',
      instruction: 'Complete this MCP server config. You tell Claude Code which external tools to connect. Each server exposes capabilities the agent can use.',
      language: 'json',
      filename: '.claude/settings.json',
      template: '{\n  "{{config_key}}": {\n    "supabase": {\n      "command": "{{runner}}",\n      "args": ["-y", "@supabase/mcp-server"]\n    },\n    "browser": {\n      "command": "npx",\n      "args": ["-y", "@anthropic/mcp-browser"]\n    }\n  }\n}',
      blanks: [
        { id: 'config_key', answer: 'mcpServers', alternatives: ['mcp-servers', 'mcp_servers'], placeholder: '______', hint: 'The JSON key that lists MCP server definitions' },
        { id: 'runner', answer: 'npx', alternatives: ['bunx'], placeholder: '___', hint: 'The Node.js package runner command' },
      ],
      explanation: 'MCP servers are configured in .claude/settings.json under the "mcpServers" key. Each server has a command (npx to run the package) and args. The agent uses these to connect to external tools like Supabase databases and browsers.',
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

    // === COMPARE: PASTE vs MCP ===
    {
      type: 'compare',
      title: 'Level 1 vs Level 5',
      body: 'The gap between the bottom and top of the ladder is enormous. Compare how the same task — "check if our API is down" — looks at each extreme.',
      question: 'Which approach catches the outage faster and with less effort?',
      correctSide: 'right',
      left: {
        label: 'Level 1: Paste',
        content: '1. Open browser, go to ChatGPT\n2. Paste: "Here are my server logs: [copy 200 lines]"\n3. Read the answer: "Looks like a 502 on /api/users"\n4. Manually open Vercel dashboard\n5. Manually check deployment status\n6. Manually restart if needed\n\nTime: 5-10 minutes\nAutomation: None\nContext: Only what you paste',
      },
      right: {
        label: 'Level 5: MCP',
        content: '1. Tell Claude Code: "Check if our API is down"\n2. Agent queries Vercel deployment status via MCP\n3. Agent reads recent error logs via MCP\n4. Agent checks the health endpoint directly\n5. Agent reports: "502s on /api/users since 14:32,\n   caused by failed DB migration. Rolling back."\n\nTime: 30 seconds\nAutomation: Full\nContext: Live production data',
      },
      explanation: 'Level 1 requires you to gather context manually and interpret results yourself. Level 5 connects to real tools (Vercel, databases, browsers) and acts autonomously. The difference is not just speed — it is access to live data the paste approach can never have.',
    },

    // === INTERACTIVE DIAGRAM: TOOL LADDER WALKTHROUGH ===
    {
      type: 'interactive-diagram',
      title: 'Climbing the Tool Ladder',
      body: 'Step through each level to see how autonomy increases and human effort decreases.',
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
      stages: [
        {
          highlightNodes: ['paste'],
          highlightEdges: [],
          explanation: 'Level 1: Paste. You copy a question into a chat window, read the answer, and paste the result back. Zero setup. Fully manual. No memory between sessions. Good for one-off questions.',
        },
        {
          highlightNodes: ['paste', 'skill'],
          highlightEdges: [{ from: 'paste', to: 'skill' }],
          explanation: 'Level 2: Skill. You define a reusable prompt template (like /a11y-review) and invoke it by name. The prompt stays the same, the target changes. The AI now edits files inline instead of you copy-pasting.',
        },
        {
          highlightNodes: ['skill', 'script'],
          highlightEdges: [{ from: 'skill', to: 'script' }],
          explanation: 'Level 3: Script. The AI runs without you. A script calls the API on a schedule or git hook — no human in the loop. Predictable, repeatable tasks that need zero judgment.',
        },
        {
          highlightNodes: ['script', 'agent'],
          highlightEdges: [{ from: 'script', to: 'agent' }],
          explanation: 'Level 4: Agent. The AI reads your codebase, plans a multi-step approach, writes code across files, runs tests, and fixes errors. You give one high-level instruction and it executes autonomously.',
        },
        {
          highlightNodes: ['agent', 'mcp'],
          highlightEdges: [{ from: 'agent', to: 'mcp' }],
          explanation: 'Level 5: MCP. Agent mode plus external tool access. The AI connects to databases, APIs, browsers, and services through a standardized protocol. Autonomous action with real-world connectivity — the ceiling.',
        },
      ],
    },

    // === DECISION FLOW ===
    {
      type: 'interactive-diagram',
      title: 'When to Escalate',
      body: 'Walk through this decision tree to pick the right level for any task.',
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
      stages: [
        {
          highlightNodes: ['task', 'repeat'],
          highlightEdges: [{ from: 'task', to: 'repeat' }],
          explanation: 'Start with the first question: is this task repeatable? Will you do this same kind of work again tomorrow, next week, or on every PR? If not, paste is fine.',
        },
        {
          highlightNodes: ['repeat', 'paste'],
          highlightEdges: [{ from: 'repeat', to: 'paste' }],
          explanation: 'Not repeatable? Use Paste. One-off questions like "what does this error mean?" or "convert this to TypeScript" do not need any setup. Copy, ask, paste, done.',
        },
        {
          highlightNodes: ['repeat', 'complex', 'skill'],
          highlightEdges: [{ from: 'repeat', to: 'complex' }, { from: 'complex', to: 'skill' }],
          explanation: 'Repeatable but not complex? Use a Skill. Simple repeatable tasks like "review this component for accessibility" fit perfectly as a reusable prompt template.',
        },
        {
          highlightNodes: ['complex', 'tools', 'script', 'agentmcp'],
          highlightEdges: [{ from: 'complex', to: 'tools' }, { from: 'tools', to: 'script' }, { from: 'tools', to: 'agentmcp' }],
          explanation: 'Repeatable and complex? Ask: does it need external tools (databases, APIs, browsers)? No tools needed means a Script handles it. Tools needed means you want Agent + MCP for full autonomous action with connectivity.',
        },
      ],
    },

    // === CLASSIFY TASKS ===
    {
      type: 'multiple-choice',
      question: 'When classifying a task for the right tool level, which set of questions should you ask?',
      options: [
        'How long will it take? How much does the AI cost? Is the task fun?',
        'Is it one-off or repeating? Does it need file access? Does it need external tools? Does it need human judgment?',
        'Is the task written in TypeScript? Does the team use VS Code? Is there a deadline?',
        'Has someone else solved this before? Is there a tutorial? Can I copy the answer?',
      ],
      correctIndex: 1,
      explanation: 'The right classification questions are: Is it one-off or repeating? (paste vs higher levels) Does it need file access? (skill vs script) Does it need external tools? (script vs agent+MCP) Does it need human judgment? (script vs agent). These four questions map directly to the tool ladder rungs.',
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
      type: 'multiple-choice',
      question: 'You realize you have been running the same /review skill manually on every PR for the past two weeks. What should you do?',
      options: [
        'Keep using the skill -- it works fine',
        'Escalate to a script that runs automatically on each PR in CI',
        'Downgrade to paste-level -- skills are overkill',
        'Escalate to full agent mode with MCP',
      ],
      correctIndex: 1,
      explanation: 'The escalation instinct is the ability to recognize, mid-task, that you are at the wrong level. If you are running a skill manually every day, write a script. If the script needs codebase understanding, switch to an agent. If the agent needs external data, add MCP servers. Never stay on a rung longer than necessary.',
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
