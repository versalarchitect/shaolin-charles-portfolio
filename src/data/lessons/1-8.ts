import type { LessonContent } from './types'

const content: LessonContent = {
  lessonId: '1-8',
  steps: [
    // === INTRODUCTION ===
    {
      type: 'info',
      title: 'Save and reuse your best instructions',
      body: "You have been typing instructions to Claude Code one at a time. That works — but it does not scale. What if you could package a complex workflow into a single slash command? What if your agent could automatically run checks before writing files, or notify you after a deployment? Skills and hooks solve this. Skills are reusable instruction sets you invoke with a slash command. Hooks are shell commands that fire automatically when certain events occur. Together, they turn Claude Code from a reactive assistant into a proactive automation platform.",
    },
    {
      type: 'info',
      title: 'What are skills?',
      body: "A skill is a markdown file containing instructions that Claude Code loads on demand. When you type /my-skill in the chat, Claude reads that file and follows its instructions as if you had typed them out manually. Skills can contain multi-step workflows, code templates, review checklists, deployment procedures — anything you would otherwise paste into the conversation repeatedly. They live in your project (committed to git) or in your user config (personal, not committed).",
    },
    {
      type: 'checkpoint',
      xp: 2,
      message: 'You understand reusable instructions. This saves a lot of repetition.',
    },

    // === SKILL FILE STRUCTURE ===
    {
      type: 'code-demo',
      title: 'Anatomy of a skill file',
      body: 'Skills are markdown files stored in the .claude/commands/ directory. The filename (without .md) becomes the slash command name. Here is a skill that runs a full pre-commit check.',
      language: 'markdown',
      filename: '.claude/commands/pre-commit.md',
      code: "# Pre-Commit Check\n\nRun these checks before any commit:\n\n1. Run `bun run lint` and fix any errors\n2. Run `bun run typecheck` and fix any type errors\n3. Run `bun run test` — if tests fail, investigate and fix\n4. Stage only the files you changed (never `git add -A`)\n5. Write a conventional commit message summarizing the changes\n6. Do NOT push — just commit locally\n\nIf any step fails, stop and report the error. Do not skip checks.",
    },
    {
      type: 'info',
      title: 'Skill file locations',
      body: "Skills can live in three places. Project skills go in .claude/commands/ and are committed to git — your whole team shares them. User skills go in ~/.claude/commands/ and are personal across all projects. Nested directories create namespaced commands: .claude/commands/deploy/staging.md becomes /deploy-staging. The filename minus the .md extension is the command name.",
    },
    {
      type: 'multiple-choice',
      question: 'Where do you place a skill file so your entire team can use it?',
      options: [
        '~/.claude/commands/',
        '.claude/commands/',
        'CLAUDE.md',
        '.claude/settings.json',
      ],
      correctIndex: 1,
      explanation: 'Project skills in .claude/commands/ are committed to git and shared with the team. User skills in ~/.claude/commands/ are personal and not committed.',
    },

    // === CREATING A SKILL ===
    {
      type: 'terminal',
      instruction: 'Create a folder to store your reusable instructions (skills). This folder is where Claude Code looks for them:',
      expectedCommand: 'mkdir -p .claude/commands',
      hint: 'Use mkdir with the -p flag to create nested directories',
    },
    {
      type: 'code-demo',
      title: 'A review skill with parameters',
      body: 'Skills can reference $ARGUMENTS to accept input from the user. When invoked as /review src/auth.ts, the $ARGUMENTS variable contains "src/auth.ts".',
      language: 'markdown',
      filename: '.claude/commands/review.md',
      code: "# Code Review\n\nReview the file: $ARGUMENTS\n\nCheck for:\n- Security vulnerabilities (SQL injection, XSS, auth bypasses)\n- Performance issues (N+1 queries, unnecessary re-renders)\n- Error handling (uncaught promises, missing try/catch)\n- Type safety (any casts, missing null checks)\n\nFor each issue found:\n1. Quote the problematic code\n2. Explain the risk\n3. Provide a fix\n\nIf the file is clean, say so explicitly.",
    },
    {
      type: 'code-input',
      instruction: 'In a skill file, what variable holds the text the user passes after the slash command?',
      placeholder: '$...',
      answer: '$ARGUMENTS',
      hint: 'It is an all-caps variable prefixed with $',
    },

    // === HOOKS: AUTOMATIC TRIGGERS ===
    {
      type: 'info',
      title: 'What are hooks?',
      body: "Hooks are shell commands that run automatically when Claude Code performs certain actions. Unlike skills (which you invoke manually), hooks fire on their own when a matching event occurs. They intercept the agent's behavior at key moments: before a tool runs, after a tool runs, or when a notification is sent. Hooks are configured in settings.json — not in markdown files. They run outside the model, as plain shell commands on your machine.",
    },
    {
      type: 'diagram',
      title: 'Hook Execution Flow',
      body: 'Hooks intercept tool calls at two points: before execution (PreToolUse) and after execution (PostToolUse). The hook runs your shell command and can block or modify the action.',
      diagram: {
        direction: 'TB',
        nodes: [
          { id: 'model', label: 'Claude Model', sublabel: 'Decides to use tool', shape: 'rounded', highlight: true },
          { id: 'pre', label: 'PreToolUse Hook', sublabel: 'Shell command', shape: 'rect' },
          { id: 'tool', label: 'Tool Executes', sublabel: 'Bash/Edit/Read', shape: 'rect' },
          { id: 'post', label: 'PostToolUse Hook', sublabel: 'Shell command', shape: 'rect' },
          { id: 'result', label: 'Result to Model', sublabel: 'Continue flow', shape: 'pill', highlight: true },
        ],
        edges: [
          { from: 'model', to: 'pre', label: 'intercept' },
          { from: 'pre', to: 'tool', label: 'allow' },
          { from: 'tool', to: 'post', label: 'complete' },
          { from: 'post', to: 'result', label: 'return' },
        ],
      },
    },

    // === HOOK CONFIGURATION ===
    {
      type: 'code-demo',
      title: 'Hook configuration in settings.json',
      body: 'Hooks are defined in the "hooks" key of your settings.json. Each hook event maps to an array of handlers. The "matcher" filters which tool triggers the hook. The "command" is the shell command to run.',
      language: 'json',
      filename: '.claude/settings.json',
      code: '{\n  "hooks": {\n    "PreToolUse": [\n      {\n        "matcher": "Bash",\n        "command": "echo \\"About to run a bash command\\""\n      },\n      {\n        "matcher": "Edit",\n        "command": "test -f .pre-edit-check && sh .pre-edit-check"\n      }\n    ],\n    "PostToolUse": [\n      {\n        "matcher": "Write",\n        "command": "bun run lint --fix $CLAUDE_FILE_PATH"\n      }\n    ],\n    "Notification": [\n      {\n        "command": "terminal-notifier -message \\"Claude needs attention\\""\n      }\n    ]\n  }\n}',
    },
    {
      type: 'multiple-choice',
      question: 'What is the purpose of the "matcher" field in a hook configuration?',
      options: [
        'It matches file paths to determine which files to watch',
        'It filters which tool name triggers the hook',
        'It matches regex patterns in the command output',
        'It selects which MCP server to use',
      ],
      correctIndex: 1,
      explanation: 'The matcher field specifies which tool name triggers the hook. "Bash" means the hook fires only when the Bash tool is used. "Edit" means only for Edit tool calls. Without a matcher, the hook fires for all tools.',
    },

    // === HOOK EVENTS ===
    {
      type: 'info',
      title: 'Hook event types',
      body: "There are three hook events. PreToolUse fires before a tool runs — use it for validation, logging, or blocking dangerous commands. PostToolUse fires after a tool completes — use it for auto-formatting, linting, or notifications. Notification fires when the agent sends a notification (typically when it needs human input or finishes a long task) — use it for desktop alerts, Slack messages, or sound effects. Each event receives context via environment variables.",
    },
    {
      type: 'code-demo',
      title: 'Environment variables available to hooks',
      body: 'Hooks receive context about the current tool call through environment variables. Use these to make decisions in your hook scripts.',
      language: 'bash',
      filename: 'hook-env-vars.sh',
      code: "# Available in all hooks:\n# $CLAUDE_TOOL_NAME    — the tool being called (Bash, Edit, Read, Write)\n# $CLAUDE_TOOL_INPUT   — JSON string of the tool's input parameters\n# $CLAUDE_FILE_PATH    — file path if the tool operates on a file\n# $CLAUDE_SESSION_ID   — current session identifier\n\n# Example: Block destructive git commands\nif echo \"$CLAUDE_TOOL_INPUT\" | grep -q 'git.*--force\\|git.*reset --hard'; then\n  echo \"BLOCKED: Destructive git command detected\" >&2\n  exit 1\nfi",
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'You understand automatic actions. Your AI agent now has guardrails.',
    },

    // === PRACTICAL EXAMPLES ===
    {
      type: 'info',
      title: 'Practical hook patterns',
      body: "The most powerful hooks are guardrails. A PreToolUse hook on Bash can block rm -rf, git push --force, or any command matching a deny-list. A PostToolUse hook on Write can auto-run the linter on any file the agent creates. A Notification hook can send a Slack message or play a sound when Claude finishes a task. Hooks transform your agent from untethered to governed — still autonomous, but within boundaries you define.",
    },
    {
      type: 'code-demo',
      title: 'Auto-lint after every file write',
      body: 'This PostToolUse hook runs ESLint with auto-fix on any file that Claude writes. The agent never commits unformatted code.',
      language: 'json',
      filename: '.claude/settings.json (partial)',
      code: '{\n  "hooks": {\n    "PostToolUse": [\n      {\n        "matcher": "Write",\n        "command": "npx eslint --fix \\"$CLAUDE_FILE_PATH\\" 2>/dev/null || true"\n      },\n      {\n        "matcher": "Edit",\n        "command": "npx eslint --fix \\"$CLAUDE_FILE_PATH\\" 2>/dev/null || true"\n      }\n    ]\n  }\n}',
    },

    // === CHAINING SKILLS ===
    {
      type: 'info',
      title: 'Chaining skills for complex workflows',
      body: "Skills can reference other skills in their instructions. A /deploy skill might say \"First run /pre-commit, then push to main, then verify with /check-deploy\". This creates composable automation: small, focused skills that combine into powerful pipelines. The key principle is single responsibility — each skill does one thing well, and chaining combines them. This mirrors how Unix pipes work: small tools composed into complex workflows.",
    },
    {
      type: 'code-demo',
      title: 'A deployment skill that chains others',
      body: 'This skill orchestrates a multi-step deployment by referencing other skills in sequence. Each sub-skill handles one concern.',
      language: 'markdown',
      filename: '.claude/commands/ship.md',
      code: "# Ship to Production\n\nExecute this deployment pipeline in order:\n\n1. Run the /pre-commit checks (lint, typecheck, test)\n2. If all checks pass, commit with a conventional commit message\n3. Push to origin main\n4. Wait 30 seconds, then run /check-deploy to verify\n5. If deployment fails, immediately run `git revert HEAD` and push\n\nReport final status: deployed successfully or rolled back with error details.",
    },
    {
      type: 'multiple-choice',
      question: 'What is the recommended approach when building complex skill workflows?',
      options: [
        'Put everything in one large skill file',
        'Use many small single-purpose skills that chain together',
        'Avoid skills entirely and use hooks instead',
        'Write the workflow directly in CLAUDE.md',
      ],
      correctIndex: 1,
      explanation: 'Small, focused skills that chain together follow the Unix philosophy: each does one thing well, and composition creates power. This makes skills reusable, testable, and easier to maintain.',
    },

    // === SHARING SKILLS ===
    {
      type: 'info',
      title: 'Sharing skills across projects',
      body: "User-level skills in ~/.claude/commands/ are available in every project you open. This is ideal for personal workflows: your code review checklist, your deployment process, your debugging steps. Project-level skills in .claude/commands/ are shared with your team via git. When a teammate pulls the repo, they get all the skills automatically. This creates institutional knowledge that lives in the codebase — not in someone's head or a wiki nobody reads.",
    },
    {
      type: 'terminal',
      instruction: 'See all the reusable instructions (slash commands) available in your current Claude Code session:',
      expectedCommand: '/commands',
      hint: 'Use the slash command that lists all available commands',
    },

    // === ADVANCED PATTERNS ===
    {
      type: 'code-demo',
      title: 'Combining hooks and skills',
      body: 'The most powerful pattern: hooks enforce guardrails automatically, while skills provide on-demand workflows. Together, they create a governed, automated development environment.',
      language: 'json',
      filename: '.claude/settings.json',
      code: '{\n  "hooks": {\n    "PreToolUse": [\n      {\n        "matcher": "Bash",\n        "command": "sh .claude/guards/no-force-push.sh"\n      }\n    ],\n    "PostToolUse": [\n      {\n        "matcher": "Write",\n        "command": "npx eslint --fix \\"$CLAUDE_FILE_PATH\\" 2>/dev/null || true"\n      }\n    ],\n    "Notification": [\n      {\n        "command": "osascript -e \'display notification \\\"Claude needs you\\\" with title \\\"Claude Code\\\"\'"\n      }\n    ]\n  }\n}',
    },
    {
      type: 'order',
      instruction: 'Order the steps to set up a complete skill + hook workflow:',
      items: [
        'Test the skill by invoking it with /command-name',
        'Create .claude/commands/ directory',
        'Add hooks in .claude/settings.json for automatic guardrails',
        'Write a .md skill file with step-by-step instructions',
        'Commit both skills and settings to git for team sharing',
      ],
      correctOrder: [1, 3, 0, 2, 4],
    },

    // === FINAL EXERCISES ===
    {
      type: 'code-input',
      instruction: 'What directory path holds project-level skills that are shared via git?',
      placeholder: 'path/to/skills',
      answer: '.claude/commands',
      hint: 'It is inside the .claude directory at the project root',
    },
    {
      type: 'multiple-choice',
      question: 'A PreToolUse hook exits with code 1. What happens?',
      options: [
        'The tool runs anyway but logs a warning',
        'The tool execution is blocked',
        'Claude Code restarts the session',
        'The hook is disabled for the rest of the session',
      ],
      correctIndex: 1,
      explanation: 'A non-zero exit code from a PreToolUse hook blocks the tool from executing. This is how guardrail hooks prevent dangerous operations — they exit with code 1 to halt the action.',
    },
    {
      type: 'checklist',
      title: 'Skills & Hooks mastery:',
      items: [
        'I can create a skill file in .claude/commands/',
        'I understand $ARGUMENTS for parameterized skills',
        'I can configure PreToolUse hooks to block dangerous commands',
        'I can configure PostToolUse hooks for auto-formatting',
        'I know how to chain skills for multi-step workflows',
        'I can share skills with my team via git',
      ],
    },
    {
      type: 'checkpoint',
      xp: 15,
      message: 'Skills and Hooks complete! You can now save instructions and set up automatic safety checks.',
    },
  ],
}

export default content
