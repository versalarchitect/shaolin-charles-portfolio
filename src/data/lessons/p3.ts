import type { LessonContent } from './types'

const content: LessonContent = {
  lessonId: 'p3',
  steps: [
    // === INTRO ===
    {
      type: 'info',
      title: 'Meet your AI building partner',
      body: "Claude Code is an AI assistant that lives in your terminal (the command-line window). It can read your project files, write code, run commands, and make decisions — all from a text interface. In this lesson you will install it, connect it to external tools, and complete your first AI-directed task. You tell it what to build in plain English. It does the building.",
    },
    {
      type: 'multiple-choice',
      question: 'What makes Claude Code different from a regular AI chatbot?',
      options: [
        'It has a prettier interface',
        'It can read, edit, and run code directly inside your project',
        'It only works with one programming language',
        'It requires a browser plugin',
      ],
      correctIndex: 1,
      explanation: 'Claude Code works directly inside your project — it reads files, writes code, and runs commands on your computer. A regular chatbot just has a conversation. Claude Code takes action.',
    },
    {
      type: 'checkpoint',
      xp: 2,
      message: 'You understand the difference. Claude Code is a doer, not just a talker.',
    },

    // === INSTALL & AUTH ===
    {
      type: 'terminal',
      instruction: 'Open your terminal and paste this command. It installs Claude Code on your machine so you can use it from any project:',
      expectedCommand: 'npm install -g @anthropic-ai/claude-code',
      hint: 'npm install -g @anthropic-ai/claude-code',
    },
    {
      type: 'terminal',
      instruction: 'Now launch Claude Code by typing this. It will open your browser to sign in with your Anthropic account:',
      expectedCommand: 'claude',
      hint: 'Just type "claude" — it walks you through authentication.',
    },
    {
      type: 'checklist',
      title: 'Installation check — confirm each step:',
      items: [
        'Pasted the install command and it completed without errors',
        'Typed claude in the terminal and it launched',
        'Signed in through the browser window that opened',
        'Saw the Claude Code welcome screen in your terminal',
      ],
    },
    {
      type: 'checkpoint',
      xp: 2,
      message: 'Claude Code is installed and ready! You now have an AI building partner.',
    },

    // === MCP ARCHITECTURE ===
    {
      type: 'interactive-diagram',
      title: 'How Claude Code connects to external tools',
      body: 'MCP (Model Context Protocol) is like a universal adapter. It lets Claude Code plug into databases, websites, and other services through a standard connection. Step through to see how a request flows.',
      diagram: {
        direction: 'TB',
        nodes: [
          { id: 'claude', label: 'Claude Code', shape: 'rounded', highlight: true },
          { id: 'mcp', label: 'MCP Protocol', shape: 'diamond' },
          { id: 'server', label: 'MCP Server', shape: 'rounded' },
          { id: 'tool', label: 'Tool', shape: 'pill', highlight: true },
          { id: 'resource', label: 'Resource', shape: 'pill' },
        ],
        edges: [
          { from: 'claude', to: 'mcp', label: 'JSON-RPC' },
          { from: 'mcp', to: 'server' },
          { from: 'server', to: 'tool', label: 'execute' },
          { from: 'server', to: 'resource', label: 'read' },
        ],
      },
      stages: [
        { highlightNodes: ['claude'], explanation: 'You ask Claude Code to do something — like query a database or check a deployment. Claude Code decides which tool to use.' },
        { highlightNodes: ['claude', 'mcp'], highlightEdges: [{ from: 'claude', to: 'mcp' }], explanation: 'Claude Code sends the request through the MCP protocol using JSON-RPC — a standard message format. This is the universal adapter.' },
        { highlightNodes: ['mcp', 'server'], highlightEdges: [{ from: 'mcp', to: 'server' }], explanation: 'The MCP server receives the request. Each server is a small program that knows how to talk to one specific service.' },
        { highlightNodes: ['server', 'tool'], highlightEdges: [{ from: 'server', to: 'tool' }], explanation: 'The server executes the tool — running a database query, calling an API, or performing an action. The result flows back to Claude Code.' },
        { highlightNodes: ['server', 'resource'], highlightEdges: [{ from: 'server', to: 'resource' }], explanation: 'The server can also read resources — fetching data like deployment status, file contents, or configuration. Resources are read-only.' },
      ],
    },
    {
      type: 'info',
      title: 'Understanding MCP in plain terms',
      body: "Think of MCP like a USB port. Before USB, every device needed its own cable. MCP works the same way for AI tools — it is a universal standard that lets Claude Code plug into any service: databases, websites, deployment platforms, and more. An MCP server is a small program that gives Claude Code access to a specific tool. You do not need to build these yourself — most are pre-built and ready to use.",
    },
    {
      type: 'multiple-choice',
      question: 'What does an MCP server provide to Claude Code?',
      options: [
        'A faster internet connection',
        'Tools it can execute and resources it can read',
        'A graphical user interface',
        'Cloud storage for your files',
      ],
      correctIndex: 1,
      explanation: 'MCP servers give Claude Code two things: tools (actions it can perform, like running a database query) and resources (data it can read, like checking deployment status). This is how Claude Code goes from just editing files to interacting with the whole world.',
    },

    // === CONFIGURE MCP SERVER ===
    {
      type: 'code-demo',
      title: 'Connect an MCP tool to your project',
      body: "Let us add a file system tool to your project settings. This gives Claude Code enhanced abilities to read and search your files. You just need to add this configuration to a settings file:",
      language: 'json',
      filename: '.claude/settings.json',
      code: '{\n  "mcpServers": {\n    "filesystem": {\n      "command": "npx",\n      "args": [\n        "-y",\n        "@modelcontextprotocol/server-filesystem",\n        "."\n      ]\n    }\n  }\n}',
    },
    {
      type: 'code-input',
      instruction: 'In the settings file above, what is the name of the main section that holds all your MCP tool connections?',
      placeholder: '"________": { "filesystem": { ... } }',
      answer: 'mcpServers',
      hint: 'Look at the very first key inside the curly braces in the JSON above.',
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'MCP tool connected! Claude Code now has enhanced file abilities.',
    },

    // === SKILLS & HOOKS ===
    {
      type: 'code-demo',
      title: 'Create a reusable instruction (called a "skill")',
      body: "Skills are saved instructions you can reuse anytime with a simple slash command. Instead of typing the same detailed request every time, you save it once and invoke it by name. Create a file at .claude/skills/component.md:",
      language: 'markdown',
      filename: '.claude/skills/component.md',
      code: '# Component Generator\n\nWhen asked to create a React component:\n\n1. Use TypeScript with explicit prop interfaces\n2. Export as default\n3. Use Tailwind for styling\n4. Add JSDoc comments for props\n5. Place in src/components/',
    },
    {
      type: 'code-demo',
      title: 'Set up an automatic action (called a "hook")',
      body: "Hooks are automatic actions that happen without you asking. For example, every time Claude Code edits a file, a hook can automatically clean up the formatting. They run in the background. Add this to your settings.json:",
      language: 'json',
      filename: '.claude/settings.json',
      code: '{\n  "hooks": {\n    "afterEdit": [\n      {\n        "command": "npx eslint --fix ${file}",\n        "description": "Auto-lint after edit"\n      }\n    ]\n  }\n}',
    },
    {
      type: 'multiple-choice',
      question: 'What is the purpose of a Claude Code skill?',
      options: [
        'To replace other software tools',
        'To save reusable instructions that Claude Code follows every time',
        'To protect your files from being changed',
        'To publish your application online',
      ],
      correctIndex: 1,
      explanation: "Skills save your instructions so you do not have to repeat yourself. Define your preferred approach once, save it as a skill, and invoke it anytime with a slash command. Think of it like a saved recipe.",
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'Skills and hooks are set up! You now have reusable instructions and automatic actions.',
    },
    {
      type: 'match',
      instruction: 'Match each Claude Code capability to what it does:',
      leftItems: ['Read tool', 'Edit tool', 'Bash tool', 'Agent tool', 'MCP servers'],
      rightItems: ['View file contents without modifying', 'Make precise changes to existing files', 'Run shell commands and scripts', 'Delegate complex tasks to sub-agents', 'Connect to external tools and APIs'],
      correctPairs: { 0: 0, 1: 1, 2: 2, 3: 3, 4: 4 },
      explanation: 'Claude Code uses different tools for different tasks. Read views files, Edit modifies them, Bash runs commands, Agent delegates work, and MCP servers extend capabilities to external systems.',
    },

    // === YOUR AI TOOLING STACK ===
    {
      type: 'diagram',
      title: 'Your AI Tooling Stack',
      body: 'Everything you just configured, working together.',
      diagram: {
        direction: 'LR',
        nodes: [
          { id: 'cc', label: 'Claude Code', shape: 'rounded', highlight: true },
          { id: 'skills', label: 'Skills' },
          { id: 'hooks', label: 'Hooks' },
          { id: 'mcp', label: 'MCP Servers' },
          { id: 'tools', label: 'External Tools', shape: 'pill', highlight: true },
        ],
        edges: [
          { from: 'cc', to: 'skills', label: 'invoke' },
          { from: 'cc', to: 'hooks', label: 'trigger' },
          { from: 'cc', to: 'mcp', label: 'connect' },
          { from: 'mcp', to: 'tools' },
        ],
      },
    },

    // === FIRST AGENT TASK ===
    {
      type: 'terminal',
      instruction: 'Give Claude Code your first real task. Paste this command to have it create a simple component in your project:',
      expectedCommand: 'claude "Create a HelloWorld React component in src/components that renders a centered heading"',
      hint: 'claude "Create a HelloWorld React component..."',
    },
    {
      type: 'order',
      instruction: 'Put these steps in the correct order. This is how you direct an AI agent to build something:',
      items: [
        'You describe the intent in natural language',
        'Claude Code reads your project context',
        'The agent plans the implementation',
        'Files are created or edited',
        'You review and approve the changes',
      ],
      correctOrder: [0, 1, 2, 3, 4],
    },
    {
      type: 'checklist',
      title: 'Final check — make sure you have completed each of these:',
      items: [
        'Claude Code is installed and you signed in successfully',
        'You understand MCP at a high level (it connects Claude Code to external tools)',
        'You added an MCP tool connection to your project settings',
        'You created a skill file (a saved reusable instruction)',
        'You set up a hook (an automatic action)',
        'You gave Claude Code a real task and it completed it',
      ],
    },
    {
      type: 'checkpoint',
      xp: 5,
      message: 'Your AI toolkit is ready! You have Claude Code installed, connected to tools, with skills and hooks set up. Time to start building.',
    },
  ],
}

export default content
