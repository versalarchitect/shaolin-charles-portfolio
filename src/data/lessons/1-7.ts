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
      type: 'info',
      title: 'The three layers',
      body: "Every MCP interaction has three layers. The Client is your AI agent (Claude Code). It decides when to use a tool and sends the request. The Protocol is JSON-RPC 2.0 — a lightweight message format that wraps method names and parameters. The Server is your code that receives the request, does the actual work (query a database, call an API, read a file system), and returns the result. The client never touches the external service directly. The server is the boundary.",
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
      type: 'diagram',
      title: 'MCP Server Types',
      body: 'One protocol connects your agent to many different tool categories. Each server exposes a specialized capability.',
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
    },
    {
      type: 'info',
      title: 'Common MCP server categories',
      body: "File system servers let the agent read and write files outside its sandbox. Database servers expose SQL or NoSQL queries — Supabase, Postgres, SQLite. API servers wrap external services like GitHub, Vercel, Stripe, or Slack. Browser servers give the agent a real headless browser for scraping or testing. Custom servers are anything you build: internal tools, proprietary APIs, hardware controllers. The ecosystem is growing fast because building a server is straightforward.",
    },
    {
      type: 'checkpoint',
      xp: 2,
      message: 'You know what kinds of tools AI can connect to.',
    },

    // === CONFIGURATION ===
    {
      type: 'info',
      title: 'Configuring MCP servers',
      body: "You tell Claude Code about MCP servers through configuration files. There are two levels: project-level config in .claude/settings.json (shared with your team via git) and user-level config in ~/.claude/settings.json (personal, not committed). Each server entry specifies the command to launch it, any arguments, and optional environment variables for secrets like API keys.",
    },
    {
      type: 'code-demo',
      title: 'Project-level MCP config',
      body: 'This configuration registers two MCP servers. Claude Code launches them as child processes and communicates over stdio.',
      language: 'json',
      filename: '.claude/settings.json',
      code: '{\n  "mcpServers": {\n    "filesystem": {\n      "command": "npx",\n      "args": [\n        "-y",\n        "@modelcontextprotocol/server-filesystem",\n        "/Users/you/projects"\n      ]\n    },\n    "supabase": {\n      "command": "npx",\n      "args": ["-y", "@supabase/mcp-server"],\n      "env": {\n        "SUPABASE_ACCESS_TOKEN": "your-token"\n      }\n    }\n  }\n}',
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
      type: 'info',
      title: 'Tools vs Resources',
      body: "MCP servers expose two types of capabilities. Tools are actions — they do something: write a file, run a query, send a message, create a deployment. They have side effects. Resources are data — they provide information: read a file, list tables, fetch configuration, get current status. The distinction matters because Claude Code treats them differently. Tools require explicit approval (they change things). Resources are read-only and safer to auto-approve.",
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
      type: 'info',
      title: 'Building your own MCP server',
      body: "The official @modelcontextprotocol/sdk package makes it straightforward. You create a server instance, register tools with their input schemas, implement the handler functions, and start the server on stdio. The server listens for JSON-RPC requests from Claude Code, executes the matching tool, and returns the result. A minimal server can be under 40 lines of code.",
    },
    {
      type: 'code-demo',
      title: 'Minimal MCP server: read a file',
      body: 'A complete MCP server that exposes a single tool — reading a file and returning its contents. This is the simplest possible server you can build.',
      language: 'typescript',
      filename: 'my-mcp-server.ts',
      code: "import { McpServer } from \"@modelcontextprotocol/sdk/server/mcp.js\";\nimport { StdioServerTransport } from \"@modelcontextprotocol/sdk/server/stdio.js\";\nimport { readFile } from \"fs/promises\";\nimport { z } from \"zod\";\n\nconst server = new McpServer({\n  name: \"file-reader\",\n  version: \"1.0.0\",\n});\n\nserver.tool(\n  \"read_file\",\n  \"Read a file from disk and return its contents\",\n  { path: z.string().describe(\"Absolute file path\") },\n  async ({ path }) => {\n    const text = await readFile(path, \"utf-8\");\n    return {\n      content: [{ type: \"text\", text }],\n    };\n  }\n);\n\nconst transport = new StdioServerTransport();\nawait server.connect(transport);",
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
      type: 'code-demo',
      title: 'Register your custom server',
      body: 'Point Claude Code at your server by adding it to your MCP config. The command runs your server script directly with Node or tsx.',
      language: 'json',
      filename: '.claude/settings.json',
      code: '{\n  "mcpServers": {\n    "file-reader": {\n      "command": "npx",\n      "args": ["tsx", "my-mcp-server.ts"]\n    }\n  }\n}',
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
      type: 'info',
      title: 'Debugging MCP connections',
      body: "MCP connections fail silently more often than they fail loudly. The most common issues: the server binary is not found (wrong path or missing npx package), environment variables are missing (API key not set), port conflicts (another process on the same port), and timeouts (the server takes too long to start). When an MCP tool does not appear in Claude Code, it almost always means the server failed to launch — not that the tool is misconfigured.",
    },
    {
      type: 'code-demo',
      title: 'Debugging checklist in Claude Code',
      body: 'Use the /mcp command inside Claude Code to check server status. It shows which servers are connected, which failed, and what tools are available.',
      language: 'text',
      filename: 'debug-commands.txt',
      code: "# Inside Claude Code, check MCP status:\n/mcp\n\n# Common output when a server fails:\n# ✗ my-server — failed to start\n#   Error: Cannot find module '@modelcontextprotocol/sdk'\n\n# Fix: ensure the package is installed or use npx -y\n# Fix: check that env vars are set correctly\n# Fix: verify the command path is correct",
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
      type: 'info',
      title: 'Real-world MCP ecosystem',
      body: "The MCP ecosystem already includes dozens of production-ready servers. Supabase exposes database queries and schema management. Vercel provides deployment status and log inspection. GitHub lets the agent read issues, PRs, and commit history. Puppeteer and Playwright give browser automation. Stripe exposes payment operations. Each server is a standalone process that Claude Code manages as a child process — launch, communicate, shut down.",
    },
    {
      type: 'code-demo',
      title: 'Multi-server config',
      body: 'A real project might connect three or four servers. Each one adds a category of capabilities to your agent.',
      language: 'json',
      filename: '.claude/settings.json',
      code: '{\n  "mcpServers": {\n    "supabase": {\n      "command": "npx",\n      "args": ["-y", "@supabase/mcp-server"],\n      "env": {\n        "SUPABASE_ACCESS_TOKEN": "${SUPABASE_TOKEN}"\n      }\n    },\n    "github": {\n      "command": "npx",\n      "args": ["-y", "@modelcontextprotocol/server-github"],\n      "env": {\n        "GITHUB_TOKEN": "${GH_TOKEN}"\n      }\n    },\n    "filesystem": {\n      "command": "npx",\n      "args": [\n        "-y",\n        "@modelcontextprotocol/server-filesystem",\n        "/home/user/docs"\n      ]\n    }\n  }\n}',
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
      type: 'info',
      title: 'Security boundaries',
      body: "Every MCP server runs as a child process with the same permissions as your user account. If you give an MCP server your database credentials, the agent can run any query the server allows. This is powerful but demands caution. Use read-only tokens when possible. Scope API keys to the minimum required permissions. Review which tools a server exposes before connecting it. Claude Code shows tool approval prompts for side-effecting actions, but the server itself is the real trust boundary.",
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
