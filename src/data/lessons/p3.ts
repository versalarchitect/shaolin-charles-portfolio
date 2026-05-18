import type { LessonContent } from './types'

const content: LessonContent = {
  lessonId: 'p3',
  steps: [
    // === INTRO ===
    {
      type: 'multiple-choice',
      hint: 'Read each option carefully — one fits the context best.',
      question: 'Claude Code is an AI assistant that lives in your terminal. Where does it operate?',
      options: [
        'In a web browser like a normal chatbot',
        'Directly inside your project — reading files, writing code, and running commands',
        'Only in the cloud, with no access to your local files',
        'Inside a mobile app on your phone',
      ],
      correctIndex: 1,
      explanation: 'Claude Code is an AI assistant that lives in your terminal (the command-line window). It can read your project files, write code, run commands, and make decisions — all from a text interface. In this lesson you will install it, connect it to external tools, and complete your first AI-directed task.',
    },
    {
      type: 'multiple-choice',
      hint: 'Eliminate the options that only partially fit.',
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
      type: 'order',
      hint: 'Consider what depends on what — prerequisites first.',
      instruction: 'Put the Claude Code installation steps in the correct order:',
      items: [
        'Run npm install -g @anthropic-ai/claude-code',
        'Type claude in the terminal',
        'Sign in through the browser window that opens',
        'See the Claude Code welcome screen in your terminal',
      ],
      correctOrder: [0, 1, 2, 3],
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
      type: 'compare',
      hint: 'Look at the key differences between the two approaches.',
      title: 'Before MCP vs After MCP',
      body: 'MCP is like a USB port — a universal standard that lets Claude Code plug into any service.',
      question: 'Which approach is more maintainable as you add more tools?',
      correctSide: 'right',
      left: {
        label: 'Without MCP',
        content: 'Each tool needs its own custom integration\nDifferent API formats for every service\nBreaks when a service updates their API\nYou must build each connector yourself',
        language: 'text',
      },
      right: {
        label: 'With MCP',
        content: 'Universal standard protocol for all tools\nOne consistent format (JSON-RPC)\nPre-built servers for most services\nPlug and play — just add to settings.json',
        language: 'text',
      },
      explanation: 'MCP is a universal standard — like USB replaced the mess of proprietary cables. An MCP server is a small program that gives Claude Code access to a specific tool. Most are pre-built and ready to use.',
    },
    {
      type: 'multiple-choice',
      hint: 'Focus on the primary goal, not secondary benefits.',
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
      type: 'code-fill',
      hint: 'Fill in values that match the pattern shown above.',
      instruction: 'Add the filesystem MCP server to your project settings. This gives Claude Code enhanced abilities to read and search your files. Fill in the missing configuration:',
      language: 'json',
      filename: '.claude/settings.json',
      template: '{\n  "{{section}}": {\n    "filesystem": {\n      "command": "{{runner}}",\n      "args": [\n        "-y",\n        "@modelcontextprotocol/server-{{type}}",\n        "."\n      ]\n    }\n  }\n}',
      blanks: [
        { id: 'section', answer: 'mcpServers', placeholder: 'config section?', hint: 'The key that holds all MCP server configurations' },
        { id: 'runner', answer: 'npx', placeholder: 'command runner?', hint: 'The Node.js tool for running packages without installing them globally' },
        { id: 'type', answer: 'filesystem', placeholder: 'server type?', hint: 'This server provides file system access' },
      ],
      explanation: 'The mcpServers section maps server names to their configurations. npx runs the package without a global install. The server-filesystem package gives Claude Code enhanced file reading and searching capabilities.',
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
      type: 'code-fill',
      hint: 'Use the exact syntax from the lesson examples.',
      instruction: 'Skills are saved instructions you can reuse anytime with a slash command. Complete this skill file that defines how Claude Code should create React components:',
      language: 'markdown',
      filename: '.claude/skills/component.md',
      template: '# Component Generator\n\nWhen asked to create a React component:\n\n1. Use {{lang}} with explicit prop interfaces\n2. Export as {{exportType}}\n3. Use {{css}} for styling\n4. Add JSDoc comments for props\n5. Place in src/{{dir}}/',
      blanks: [
        { id: 'lang', answer: 'TypeScript', alternatives: ['typescript', 'TS', 'ts'], placeholder: 'which language?', hint: 'JavaScript with type safety' },
        { id: 'exportType', answer: 'default', placeholder: 'export type?', hint: 'The standard export style for page components' },
        { id: 'css', answer: 'Tailwind', alternatives: ['tailwind', 'TailwindCSS', 'tailwindcss'], placeholder: 'CSS framework?', hint: 'Utility-first CSS framework' },
        { id: 'dir', answer: 'components', placeholder: 'directory?', hint: 'Where React components live in the project' },
      ],
      explanation: 'Skills encode your team conventions as reusable prompts. This skill tells Claude Code to always use TypeScript, default exports, Tailwind CSS, and place components in src/components/. Define once, use every time.',
    },
    {
      type: 'code-fill',
      hint: 'Each blank follows the conventions demonstrated earlier.',
      instruction: 'Hooks are automatic actions that run without you asking. Complete this hook that automatically lints files after Claude Code edits them:',
      language: 'json',
      filename: '.claude/settings.json',
      template: '{\n  "hooks": {\n    "{{trigger}}": [\n      {\n        "command": "npx {{linter}} --fix ${file}",\n        "description": "Auto-lint after edit"\n      }\n    ]\n  }\n}',
      blanks: [
        { id: 'trigger', answer: 'afterEdit', alternatives: ['after_edit'], placeholder: 'when to run?', hint: 'This hook runs after a file is edited' },
        { id: 'linter', answer: 'eslint', placeholder: 'which linter?', hint: 'The most popular JavaScript/TypeScript linter' },
      ],
      explanation: 'The afterEdit hook runs every time Claude Code modifies a file. ESLint with the --fix flag automatically corrects formatting and code style issues. The ${file} variable is replaced with the path of the edited file.',
    },
    {
      type: 'multiple-choice',
      hint: 'Think about which option is most specific to this concept.',
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
      hint: 'Find the unique connection between each pair.',
      instruction: 'Match each Claude Code capability to what it does:',
      leftItems: ['Read tool', 'Edit tool', 'Bash tool', 'Agent tool', 'MCP servers'],
      rightItems: ['View file contents without modifying', 'Make precise changes to existing files', 'Run shell commands and scripts', 'Delegate complex tasks to sub-agents', 'Connect to external tools and APIs'],
      correctPairs: { 0: 0, 1: 1, 2: 2, 3: 3, 4: 4 },
      explanation: 'Claude Code uses different tools for different tasks. Read views files, Edit modifies them, Bash runs commands, Agent delegates work, and MCP servers extend capabilities to external systems.',
    },

    // === YOUR AI TOOLING STACK ===
    {
      type: 'interactive-diagram',
      title: 'Your AI Tooling Stack',
      body: 'Everything you just configured, working together. Step through to see how each piece connects.',
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
      stages: [
        { highlightNodes: ['cc'], explanation: 'Claude Code is the hub. It receives your instructions in natural language and orchestrates everything else.' },
        { highlightNodes: ['cc', 'skills'], highlightEdges: [{ from: 'cc', to: 'skills' }], explanation: 'Skills are reusable instructions invoked with slash commands. They teach Claude Code your project patterns and conventions.' },
        { highlightNodes: ['cc', 'hooks'], highlightEdges: [{ from: 'cc', to: 'hooks' }], explanation: 'Hooks trigger automatically at specific moments — like linting after every edit. No manual action needed.' },
        { highlightNodes: ['cc', 'mcp', 'tools'], highlightEdges: [{ from: 'cc', to: 'mcp' }, { from: 'mcp', to: 'tools' }], explanation: 'MCP servers connect Claude Code to external tools — databases, APIs, deployment platforms. This is how it interacts with the world beyond your project files.' },
      ],
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
      hint: 'Think about what needs to exist before each next step.',
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
      type: 'match',
      hint: 'Match each term to its most specific definition.',
      instruction: 'Match each configuration you just completed to its file location:',
      leftItems: ['MCP server configuration', 'Component generator skill', 'Auto-lint hook', 'Project instructions'],
      rightItems: ['.claude/settings.json (mcpServers section)', '.claude/skills/component.md', '.claude/settings.json (hooks section)', 'CLAUDE.md in project root'],
      correctPairs: { 0: 0, 1: 1, 2: 2, 3: 3 },
      explanation: 'Each configuration lives in a specific location. MCP servers and hooks go in .claude/settings.json. Skills are markdown files in .claude/skills/. Project-level instructions go in CLAUDE.md at the project root.',
    },
    {
      type: 'checkpoint',
      xp: 5,
      message: 'Your AI toolkit is ready! You have Claude Code installed, connected to tools, with skills and hooks set up. Time to start building.',
    },
  ],
}

export default content
