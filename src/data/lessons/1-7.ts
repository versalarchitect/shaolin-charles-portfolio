import type { LessonContent } from './types'

const content: LessonContent = {
  lessonId: '1-7',
  steps: [
    // === INTRODUCTION ===
    {
      type: 'info',
      title: 'Giving your AI agent superpowers with external tools',
      body: "Your agent can read files, write code, and run commands. But what if it needs to query a database? Check deployment status? Browse documentation? Out of the box, agents are trapped inside your filesystem. MCP — Model Context Protocol — is the standard that breaks them out. It gives your agent a structured way to call external tools: databases, APIs, browsers, anything you can wrap in a server.",
    },
    {
      type: 'info',
      title: 'What is MCP?',
      body: "MCP is an open protocol created by Anthropic that standardizes how AI agents communicate with external tools. Think of it like USB for AI: before USB, every device needed its own proprietary connector. Before MCP, every tool integration was a custom hack. MCP defines a universal interface — any tool that speaks the protocol can be plugged into any agent that supports it. One protocol, infinite tools.",
    },

    // === ARCHITECTURE DIAGRAM 1 ===
    {
      type: 'interactive-diagram',
      title: 'MCP Request Flow',
      body: 'Click through each stage to follow a request from your agent to an external service and back.',
      diagram: {
        direction: 'LR',
        nodes: [
          { id: 'claude', label: 'Claude Code', sublabel: 'MCP Client', shape: 'rounded', highlight: true },
          { id: 'request', label: 'Request', sublabel: 'Outbound', shape: 'rect' },
          { id: 'server', label: 'MCP Server', sublabel: 'Your code', shape: 'rect' },
          { id: 'tool', label: 'Tool Call', sublabel: 'Execute', shape: 'rect' },
          { id: 'api', label: 'External API', sublabel: 'Database/SaaS', shape: 'pill', highlight: true },
        ],
        edges: [
          { from: 'claude', to: 'request', label: 'JSON-RPC' },
          { from: 'request', to: 'server' },
          { from: 'server', to: 'tool', label: 'invoke' },
          { from: 'tool', to: 'api', label: 'HTTP/SDK' },
        ],
      },
      stages: [
        {
          highlightNodes: ['claude'],
          highlightEdges: [],
          explanation: 'It starts with Claude Code. The model decides it needs external data — a database query, a deployment status check, a file outside the sandbox — and selects the right MCP tool.',
        },
        {
          highlightNodes: ['claude', 'request'],
          highlightEdges: [{ from: 'claude', to: 'request' }],
          explanation: 'Claude Code serializes the tool call into a JSON-RPC 2.0 message — method name, parameters, and a unique request ID. This is the universal wire format for all MCP communication.',
        },
        {
          highlightNodes: ['request', 'server'],
          highlightEdges: [{ from: 'request', to: 'server' }],
          explanation: 'The JSON-RPC message reaches your MCP server process. The server parses the method name, validates the parameters against the tool schema, and routes to the correct handler.',
        },
        {
          highlightNodes: ['server', 'tool'],
          highlightEdges: [{ from: 'server', to: 'tool' }],
          explanation: 'The server invokes the tool handler — your code that does the actual work. This is where the MCP boundary ends and your custom logic begins.',
        },
        {
          highlightNodes: ['tool', 'api'],
          highlightEdges: [{ from: 'tool', to: 'api' }],
          explanation: 'The tool handler reaches out to the external service — an HTTP call to a REST API, an SDK method to query a database, a filesystem read. The result flows back through the same chain to Claude Code.',
        },
      ],
    },
    {
      type: 'checkpoint',
      xp: 2,
      message: 'You understand how AI connects to external services.',
    },

    // === CORE CONCEPTS ===
    {
      type: 'multiple-choice',
      question: 'In MCP, which layer is the boundary that the AI client never crosses?',
      options: [
        'The Client — it limits what tools the AI can see',
        'The Protocol — JSON-RPC blocks unauthorized requests',
        'The Server — the AI never touches external services directly',
        'The Transport — stdio prevents direct API access',
      ],
      correctIndex: 2,
      explanation: 'Every MCP interaction has three layers. The Client (Claude Code) decides when to use a tool. The Protocol (JSON-RPC 2.0) carries the message. The Server receives the request, does the actual work, and returns the result. The client never touches the external service directly — the server is the trust boundary.',
    },
    {
      type: 'multiple-choice',
      question: 'In MCP architecture, what wire format carries messages between client and server?',
      options: [
        'GraphQL',
        'REST with JSON bodies',
        'JSON-RPC 2.0',
        'Protocol Buffers',
      ],
      correctIndex: 2,
      explanation: 'MCP uses JSON-RPC 2.0 as its wire protocol. It is lightweight, language-agnostic, and designed for request-response communication — ideal for tool calls.',
    },

    // === SERVER TYPES DIAGRAM 2 ===
    {
      type: 'interactive-diagram',
      title: 'MCP Server Types',
      body: 'Click through each stage to learn what types of servers your agent can connect to.',
      diagram: {
        direction: 'TB',
        nodes: [
          { id: 'protocol', label: 'MCP Protocol', sublabel: 'JSON-RPC 2.0', shape: 'rounded', highlight: true },
          { id: 'fs', label: 'File System', sublabel: 'Read/Write', shape: 'rect' },
          { id: 'db', label: 'Database', sublabel: 'Query/Mutate', shape: 'rect' },
          { id: 'api', label: 'API', sublabel: 'HTTP calls', shape: 'rect' },
          { id: 'agent', label: 'Your Agent', sublabel: 'Claude Code', shape: 'pill', highlight: true },
        ],
        edges: [
          { from: 'agent', to: 'protocol', label: 'connects' },
          { from: 'protocol', to: 'fs' },
          { from: 'protocol', to: 'db' },
          { from: 'protocol', to: 'api' },
        ],
      },
      stages: [
        {
          highlightNodes: ['agent', 'protocol'],
          highlightEdges: [{ from: 'agent', to: 'protocol' }],
          explanation: 'One protocol connects your agent to many different tool categories. The MCP protocol is the universal connector — like USB for AI tools.',
        },
        {
          highlightNodes: ['protocol', 'fs'],
          highlightEdges: [{ from: 'protocol', to: 'fs' }],
          explanation: 'File system servers let the agent read and write files outside its sandbox. This extends the agent beyond the project directory.',
        },
        {
          highlightNodes: ['protocol', 'db'],
          highlightEdges: [{ from: 'protocol', to: 'db' }],
          explanation: 'Database servers expose SQL or NoSQL queries — Supabase, Postgres, SQLite. The agent can query data, inspect schemas, and even run migrations.',
        },
        {
          highlightNodes: ['protocol', 'api'],
          highlightEdges: [{ from: 'protocol', to: 'api' }],
          explanation: 'API servers wrap external services like GitHub, Vercel, Stripe, or Slack. Browser servers give headless browser automation. Custom servers are anything you build. The ecosystem grows fast because building a server is straightforward.',
        },
      ],
    },
    {
      type: 'checkpoint',
      xp: 2,
      message: 'You know what kinds of tools AI can connect to.',
    },

    // === CONFIGURATION ===
    {
      type: 'multiple-choice',
      question: 'MCP server configs can live at two levels. Which level is shared with your team via git?',
      options: [
        '~/.claude/settings.json (user-level)',
        '.claude/settings.json (project-level)',
        'package.json (dependencies)',
        'CLAUDE.md (instructions)',
      ],
      correctIndex: 1,
      explanation: 'Project-level config in .claude/settings.json is committed to git and shared with the team. User-level config in ~/.claude/settings.json is personal and not committed. Each server entry specifies the command to launch it, arguments, and optional environment variables for secrets.',
    },
    {
      type: 'code-fill',
      instruction: 'Complete this MCP configuration to register a Supabase server that Claude Code launches as a child process:',
      language: 'json',
      template: '{\n  "{{config_key}}": {\n    "supabase": {\n      "{{launch_key}}": "npx",\n      "args": ["-y", "@supabase/mcp-server"],\n      "{{secrets_key}}": {\n        "SUPABASE_ACCESS_TOKEN": "your-token"\n      }\n    }\n  }\n}',
      blanks: [
        { id: 'config_key', answer: 'mcpServers', alternatives: ['mcpservers'], placeholder: 'top-level key?', hint: 'The JSON key that holds all MCP server configurations' },
        { id: 'launch_key', answer: 'command', placeholder: 'how to start?', hint: 'The key that tells Claude Code what executable to run' },
        { id: 'secrets_key', answer: 'env', alternatives: ['environment'], placeholder: 'secrets key?', hint: 'The key for environment variables like API tokens' },
      ],
      explanation: 'The "mcpServers" key holds all server configs. Each server needs a "command" (the executable), "args" (command arguments), and optionally "env" for secret environment variables like API tokens.',
    },
    {
      type: 'code-input',
      instruction: 'In the MCP config, what key holds the object that maps server names to their configurations?',
      placeholder: 'Enter the key name',
      answer: 'mcpServers',
      hint: 'Look at the top-level key in the JSON config above',
    },

    // === TOOLS VS RESOURCES ===
    {
      type: 'compare',
      title: 'Tools vs Resources',
      body: 'MCP servers expose two types of capabilities that Claude Code treats very differently.',
      question: 'Which type requires explicit user approval before executing?',
      correctSide: 'left',
      left: {
        label: 'Tools (Actions)',
        content: "// Tools DO something — they have side effects\n\n- Write a file to disk\n- Run a database query that modifies data\n- Send a Slack message\n- Create a Vercel deployment\n- Delete a row from a table\n\n→ Require explicit approval\n→ They change state",
        language: 'text',
      },
      right: {
        label: 'Resources (Data)',
        content: "// Resources PROVIDE information — read-only\n\n- Read a file's contents\n- List database tables\n- Fetch current configuration\n- Get deployment status\n- Check server health\n\n→ Safer to auto-approve\n→ They only read state",
        language: 'text',
      },
      explanation: 'Tools are actions with side effects — they change things. Claude Code requires explicit approval for tools. Resources are read-only data fetches — safer to auto-approve because they cannot modify state.',
    },
    {
      type: 'multiple-choice',
      question: 'Which of these is an MCP "tool" (action) rather than a "resource" (data)?',
      options: [
        'List all tables in a database',
        'Read the contents of a config file',
        'Delete a row from the users table',
        'Get the current deployment status',
      ],
      correctIndex: 2,
      explanation: 'Deleting a row is a side-effecting action — it changes state. That makes it a tool. The others are read-only data fetches, which are resources.',
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'You understand the difference between actions and data access.',
    },

    // === BUILDING A SERVER ===
    {
      type: 'code-fill',
      instruction: 'Complete this minimal MCP server that reads a file and returns its contents. A server can be under 40 lines of code:',
      language: 'typescript',
      filename: 'my-mcp-server.ts',
      template: "import { McpServer } from \"@modelcontextprotocol/sdk/server/mcp.js\";\nimport { {{transport_class}} } from \"@modelcontextprotocol/sdk/server/stdio.js\";\nimport { readFile } from \"fs/promises\";\nimport { z } from \"zod\";\n\nconst server = new McpServer({\n  name: \"file-reader\",\n  version: \"1.0.0\",\n});\n\nserver.{{register_method}}(\n  \"read_file\",\n  \"Read a file from disk and return its contents\",\n  { path: z.string().describe(\"Absolute file path\") },\n  async ({ path }) => {\n    const text = await readFile(path, \"utf-8\");\n    return {\n      content: [{ type: \"text\", text }],\n    };\n  }\n);\n\nconst transport = new {{transport_class}}();\nawait server.{{connect_method}}(transport);",
      blanks: [
        { id: 'transport_class', answer: 'StdioServerTransport', alternatives: ['stdioservertransport'], placeholder: 'transport class?', hint: 'Claude Code communicates with MCP servers over stdio — what is the transport class?' },
        { id: 'register_method', answer: 'tool', placeholder: 'register method?', hint: 'The method on McpServer to register a new tool' },
        { id: 'connect_method', answer: 'connect', placeholder: 'start method?', hint: 'The method that starts the server listening on the transport' },
      ],
      explanation: 'Import StdioServerTransport for stdio communication. Use server.tool() to register tools with schemas and handlers. Call server.connect(transport) to start listening for JSON-RPC requests from Claude Code.',
    },
    {
      type: 'order',
      instruction: 'Order the steps to build an MCP server from first to last:',
      items: [
        'Register tools with input schemas',
        'Create a McpServer instance',
        'Connect to a transport (stdio)',
        'Implement handler functions',
        'Install @modelcontextprotocol/sdk',
      ],
      correctOrder: [4, 1, 0, 3, 2],
    },

    // === REGISTERING YOUR SERVER ===
    {
      type: 'code-fill',
      instruction: 'Register your custom MCP server in the config. Point Claude Code at your server script:',
      language: 'json',
      filename: '.claude/settings.json',
      template: '{\n  "mcpServers": {\n    "{{server_name}}": {\n      "command": "{{package_runner}}",\n      "args": ["tsx", "my-mcp-server.ts"]\n    }\n  }\n}',
      blanks: [
        { id: 'server_name', answer: 'file-reader', alternatives: ['file_reader', 'filereader'], placeholder: 'server name?', hint: 'Name it after what it does — it reads files' },
        { id: 'package_runner', answer: 'npx', alternatives: ['bunx'], placeholder: 'run command?', hint: 'The Node.js package runner that executes tsx without installing globally' },
      ],
      explanation: 'The server name "file-reader" becomes how Claude Code references this server. "npx" runs the tsx TypeScript executor without installing it globally. The args array passes "tsx" and your server script path.',
    },
    {
      type: 'terminal',
      instruction: 'Install the MCP toolkit. This is the package that lets you create connections to external tools:',
      expectedCommand: 'npm install @modelcontextprotocol/sdk',
      hint: 'Use npm install followed by the package name',
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'You understand how tool connections work. You can direct AI to set them up.',
    },

    // === DEBUGGING ===
    {
      type: 'match',
      instruction: 'Match each MCP failure symptom to its most likely fix:',
      leftItems: [
        'Server binary not found',
        'Tool does not appear in Claude Code',
        'Authentication error from external API',
        'Server takes too long to respond',
      ],
      rightItems: [
        'Check the command path and ensure npx package is installed',
        'The server failed to launch — check /mcp status output',
        'Environment variables are missing or incorrect in the env config',
        'Increase timeout or check if the server has blocking startup logic',
      ],
      correctPairs: { 0: 0, 1: 1, 2: 2, 3: 3 },
      explanation: 'MCP connections fail silently more often than loudly. When a tool does not appear, the server almost always failed to launch. Use /mcp inside Claude Code to check server status. Common fixes: verify command paths, check env vars, and ensure packages are installed.',
    },
    {
      type: 'code-fill',
      instruction: 'Use the debugging command inside Claude Code to check which servers are connected:',
      language: 'text',
      template: "# Inside Claude Code, check MCP status:\n{{debug_command}}\n\n# Common output when a server fails:\n# {{fail_symbol}} my-server — failed to start\n#   Error: Cannot find module '@modelcontextprotocol/sdk'\n\n# Fix: ensure the package is installed or use npx {{auto_flag}}",
      blanks: [
        { id: 'debug_command', answer: '/mcp', placeholder: 'slash command?', hint: 'A three-letter slash command standing for Model Context Protocol' },
        { id: 'fail_symbol', answer: '✗', alternatives: ['x', 'X', '✕'], placeholder: 'failure icon?', hint: 'The symbol that indicates a failed server (opposite of a checkmark)' },
        { id: 'auto_flag', answer: '-y', alternatives: ['--yes'], placeholder: 'auto-install flag?', hint: 'The npx flag that automatically answers "yes" to install prompts' },
      ],
      explanation: 'The /mcp command shows server status. Failed servers display with ✗. Use npx -y to auto-install packages without prompting. Always check /mcp first when a tool is missing.',
    },
    {
      type: 'multiple-choice',
      question: 'An MCP server tool is not showing up in Claude Code. What is the most likely cause?',
      options: [
        'The tool has a bug in its handler function',
        'The server failed to start (binary not found, missing dependency)',
        'Claude Code does not support that tool type',
        'The tool name has invalid characters',
      ],
      correctIndex: 1,
      explanation: 'When a tool does not appear at all, the server almost certainly failed to launch. A bug in the handler would still let the tool show up — it would just error when called. Check your command path, dependencies, and environment variables first.',
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'You know how to troubleshoot when a tool connection fails.',
    },

    // === REAL-WORLD PRACTICE ===
    {
      type: 'match',
      instruction: 'Match each MCP server to what it gives your agent:',
      leftItems: [
        'Supabase MCP',
        'GitHub MCP',
        'Puppeteer MCP',
        'Stripe MCP',
      ],
      rightItems: [
        'Database queries and schema management',
        'Issues, PRs, and commit history',
        'Headless browser automation for scraping and testing',
        'Payment operations and customer data',
      ],
      correctPairs: { 0: 0, 1: 1, 2: 2, 3: 3 },
      explanation: 'The MCP ecosystem includes dozens of production-ready servers. Each is a standalone process that Claude Code manages as a child process — launch, communicate, shut down. A real project might connect three or four servers simultaneously.',
    },
    {
      type: 'code-fill',
      instruction: 'Complete this multi-server config. Each server adds a category of capabilities to your agent:',
      language: 'json',
      template: '{\n  "mcpServers": {\n    "supabase": {\n      "command": "npx",\n      "args": ["-y", "@supabase/mcp-server"],\n      "env": {\n        "SUPABASE_ACCESS_TOKEN": "{{token_syntax}}"\n      }\n    },\n    "{{vcs_server}}": {\n      "command": "npx",\n      "args": ["-y", "@modelcontextprotocol/server-github"],\n      "env": {\n        "{{token_key}}": "${GH_TOKEN}"\n      }\n    }\n  }\n}',
      blanks: [
        { id: 'token_syntax', answer: '${SUPABASE_TOKEN}', alternatives: ['$SUPABASE_TOKEN', '${SUPABASE_ACCESS_TOKEN}'], placeholder: 'env var reference?', hint: 'Reference an environment variable using ${VAR_NAME} syntax' },
        { id: 'vcs_server', answer: 'github', alternatives: ['GitHub'], placeholder: 'server name?', hint: 'The version control service that hosts your repos' },
        { id: 'token_key', answer: 'GITHUB_TOKEN', alternatives: ['GH_TOKEN', 'GITHUB_ACCESS_TOKEN'], placeholder: 'token env var?', hint: 'The standard environment variable name for GitHub authentication' },
      ],
      explanation: 'Use ${VAR_NAME} syntax to reference environment variables — this prevents secrets from being committed to git. Each server is named descriptively and gets its own auth credentials through the env config.',
    },
    {
      type: 'multiple-choice',
      question: 'Why do MCP server configs use env variables like "${SUPABASE_TOKEN}" instead of hardcoding secrets?',
      options: [
        'Hardcoded values are slower to parse',
        'Environment variables prevent secrets from being committed to version control',
        'MCP only supports environment variable authentication',
        'It makes the JSON file smaller',
      ],
      correctIndex: 1,
      explanation: 'Configuration files are often committed to git. Putting secrets directly in the config means pushing API keys to a public or shared repo. Environment variables keep secrets out of version control and let each developer use their own credentials.',
    },

    // === SECURITY ===
    {
      type: 'multiple-choice',
      question: 'An MCP server runs with the same permissions as your user account. What is the MOST important security practice?',
      options: [
        'Only use MCP servers written in TypeScript',
        'Scope API keys to minimum required permissions and use read-only tokens when possible',
        'Always run MCP servers in Docker containers',
        'Restrict MCP to localhost connections only',
      ],
      correctIndex: 1,
      explanation: 'Every MCP server runs as a child process with your permissions. If you give it database credentials, the agent can run any query the server allows. Use read-only tokens when possible, scope API keys to minimum permissions, and review which tools a server exposes before connecting it. The server itself is the real trust boundary.',
    },

    // === MATCH EXERCISE ===
    {
      type: 'match',
      instruction: 'Match each MCP concept to its role:',
      leftItems: [
        'MCP Client',
        'MCP Server',
        'Tool',
        'Resource',
        'Transport',
      ],
      rightItems: [
        'The AI agent that sends requests',
        'A program that exposes capabilities',
        'An action the AI can execute',
        'Data the AI can read',
        'The communication channel (stdio, HTTP)',
      ],
      correctPairs: { 0: 0, 1: 1, 2: 2, 3: 3, 4: 4 },
      explanation: 'MCP separates concerns: the client (AI) requests, the server exposes, tools perform actions, resources provide data, and the transport carries messages between them.',
    },

    // === FINAL EXERCISES ===
    {
      type: 'code-input',
      instruction: 'What command inside Claude Code shows the status of all connected MCP servers?',
      placeholder: '/___',
      answer: '/mcp',
      hint: 'A three-letter slash command that stands for Model Context Protocol',
    },
    {
      type: 'order',
      instruction: 'Order the MCP request lifecycle from start to finish:',
      items: [
        'Server executes the tool handler',
        'Claude Code sends JSON-RPC request',
        'Result returned to the model',
        'Model decides to use a tool',
        'Server returns JSON-RPC response',
      ],
      correctOrder: [3, 1, 0, 4, 2],
    },
    {
      type: 'checklist',
      title: 'MCP mastery checklist:',
      items: [
        'I understand the Client-Protocol-Server architecture',
        'I can configure MCP servers in settings.json',
        'I know the difference between tools (actions) and resources (data)',
        'I can build a minimal MCP server with the SDK',
        'I know how to debug failed MCP connections',
        'I scope API keys to minimum permissions for security',
      ],
    },
    {
      type: 'checkpoint',
      xp: 12,
      message: 'MCP complete! Your AI agents can now connect to databases, APIs, and other services.',
    },
  ],
}

export default content
