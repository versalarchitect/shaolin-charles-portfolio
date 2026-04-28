import type { LessonContent } from './types'

const content: LessonContent = {
  lessonId: 'p3',
  steps: [
    // === INTRO ===
    {
      type: 'info',
      title: 'Your AI copilot lives in the terminal',
      body: "Claude Code is a CLI agent that reads your codebase, runs commands, edits files, and reasons about architecture — all from your terminal. In this lesson you'll install it, connect it to external tools via MCP, configure skills and hooks, and complete your first agent-directed task.",
    },
    {
      type: 'multiple-choice',
      question: 'What makes Claude Code different from a chatbot?',
      options: [
        'It has a nicer UI',
        'It can read, edit, and run code directly in your project',
        'It only works with Python',
        'It requires a browser extension',
      ],
      correctIndex: 1,
      explanation: 'Claude Code is an agentic tool — it operates inside your codebase, reads files, writes code, and executes terminal commands. A chatbot just takes text in and gives text out.',
    },
    {
      type: 'checkpoint',
      xp: 2,
      message: 'Agent mindset unlocked!',
    },

    // === INSTALL & AUTH ===
    {
      type: 'terminal',
      instruction: 'Install Claude Code globally via npm:',
      expectedCommand: 'npm install -g @anthropic-ai/claude-code',
      hint: 'npm install -g @anthropic-ai/claude-code',
    },
    {
      type: 'terminal',
      instruction: 'Launch Claude Code to start the auth flow (it opens a browser window for OAuth):',
      expectedCommand: 'claude',
      hint: 'Just type "claude" — it walks you through authentication.',
    },
    {
      type: 'checklist',
      title: 'Installation check:',
      items: [
        'Ran npm install -g @anthropic-ai/claude-code',
        'Launched claude in the terminal',
        'Completed the browser auth flow',
        'Saw the Claude Code welcome prompt',
      ],
    },
    {
      type: 'checkpoint',
      xp: 2,
      message: 'Claude Code installed and authenticated!',
    },

    // === MCP ARCHITECTURE ===
    {
      type: 'diagram',
      title: 'MCP Architecture',
      body: 'The Model Context Protocol lets Claude Code connect to external tools and data sources through a standard interface.',
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
    },
    {
      type: 'info',
      title: 'Understanding MCP',
      body: "MCP (Model Context Protocol) is an open standard that lets AI agents talk to external tools — databases, APIs, browsers, file systems, anything. An MCP server is a small program that exposes tools and resources over a standard protocol. Claude Code connects to these servers and gains new capabilities without any custom code.",
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
      explanation: 'MCP servers expose tools (actions the agent can take) and resources (data it can read). This is how Claude Code gains capabilities beyond its built-in features.',
    },

    // === CONFIGURE MCP SERVER ===
    {
      type: 'code-demo',
      title: 'Configure an MCP server',
      body: "Add the filesystem MCP server to your project settings. This lets Claude Code read and search files with enhanced capabilities.",
      language: 'json',
      filename: '.claude/settings.json',
      code: '{\n  "mcpServers": {\n    "filesystem": {\n      "command": "npx",\n      "args": [\n        "-y",\n        "@modelcontextprotocol/server-filesystem",\n        "."\n      ]\n    }\n  }\n}',
    },
    {
      type: 'code-input',
      instruction: 'In the MCP config, what key holds the object mapping server names to their configurations?',
      placeholder: '"________": { "filesystem": { ... } }',
      answer: 'mcpServers',
      hint: 'Look at the top-level key in the settings JSON.',
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'MCP mastered — first server configured!',
    },

    // === SKILLS & HOOKS ===
    {
      type: 'code-demo',
      title: 'Create a skill',
      body: "Skills are reusable prompts invoked with a slash command. They teach Claude Code your project's patterns. Create .claude/skills/component.md:",
      language: 'markdown',
      filename: '.claude/skills/component.md',
      code: '# Component Generator\n\nWhen asked to create a React component:\n\n1. Use TypeScript with explicit prop interfaces\n2. Export as default\n3. Use Tailwind for styling\n4. Add JSDoc comments for props\n5. Place in src/components/',
    },
    {
      type: 'code-demo',
      title: 'Set up a hook',
      body: "Hooks are automated actions that run at specific lifecycle points — before a command, after a file edit, or on conversation start. Add this to your settings.json:",
      language: 'json',
      filename: '.claude/settings.json',
      code: '{\n  "hooks": {\n    "afterEdit": [\n      {\n        "command": "npx eslint --fix ${file}",\n        "description": "Auto-lint after edit"\n      }\n    ]\n  }\n}',
    },
    {
      type: 'multiple-choice',
      question: 'What is the purpose of a Claude Code skill?',
      options: [
        'To replace your package.json scripts',
        'To teach Claude reusable, project-specific patterns',
        'To encrypt your source code',
        'To deploy your application',
      ],
      correctIndex: 1,
      explanation: "Skills encode your team's conventions as reusable prompts. Instead of explaining your patterns every time, define them once and invoke with a slash command.",
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'Skills and hooks configured!',
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
      instruction: 'Ask Claude Code to create a hello world component in your project:',
      expectedCommand: 'claude "Create a HelloWorld React component in src/components that renders a centered heading"',
      hint: 'claude "Create a HelloWorld React component..."',
    },
    {
      type: 'order',
      instruction: 'Put the agent-directed workflow in the correct order:',
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
      title: 'Final verification:',
      items: [
        'Claude Code installed and authenticated',
        'Understand MCP architecture (servers, tools, resources)',
        'Configured an MCP server in settings',
        'Created a skill file',
        'Set up a hook',
        'Completed a real agent-directed task',
      ],
    },
    {
      type: 'checkpoint',
      xp: 5,
      message: 'AI tooling configured! You have a working agent-directed development environment.',
    },
  ],
}

export default content
