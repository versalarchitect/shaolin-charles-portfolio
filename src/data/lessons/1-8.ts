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
      type: 'code-fill',
      instruction: 'Complete this skill file that runs a full pre-commit check. Skills are markdown files in .claude/commands/:',
      language: 'markdown',
      filename: '.claude/commands/pre-commit.md',
      template: "# Pre-Commit Check\n\nRun these checks before any commit:\n\n1. Run `bun run {{lint_cmd}}` and fix any errors\n2. Run `bun run {{type_cmd}}` and fix any type errors\n3. Run `bun run test` — if tests fail, investigate and fix\n4. Stage only the files you changed (never `{{bad_add}}`)\n5. Write a conventional commit message summarizing the changes\n6. Do NOT push — just commit locally\n\nIf any step fails, stop and report the error. Do not skip checks.",
      blanks: [
        { id: 'lint_cmd', answer: 'lint', alternatives: ['eslint'], placeholder: 'check code style?', hint: 'The script that checks for code style and formatting issues' },
        { id: 'type_cmd', answer: 'typecheck', alternatives: ['tsc', 'type-check'], placeholder: 'check types?', hint: 'The script that verifies TypeScript types are correct' },
        { id: 'bad_add', answer: 'git add -A', alternatives: ['git add .', 'git add --all'], placeholder: 'dangerous command?', hint: 'The git staging command that adds ALL files, including ones you did not change' },
      ],
      explanation: 'Skills are markdown instruction files. The filename (pre-commit.md) becomes the slash command /pre-commit. The skill runs lint, typecheck, and tests before committing. Never use git add -A — it stages files you did not change.',
    },
    {
      type: 'multiple-choice',
      question: 'A skill file at .claude/commands/deploy/staging.md becomes which slash command?',
      options: [
        '/deploy/staging',
        '/deploy-staging',
        '/staging',
        '/commands-deploy-staging',
      ],
      correctIndex: 1,
      explanation: 'Nested directories create namespaced commands with hyphens. .claude/commands/deploy/staging.md becomes /deploy-staging. Project skills in .claude/commands/ are shared via git. User skills in ~/.claude/commands/ are personal across all projects.',
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
      platforms: {
        windows: {
          instruction: 'Create a folder to store your reusable instructions (skills). This folder is where Claude Code looks for them:',
          expectedCommand: 'mkdir .claude\\commands',
          hint: 'Use mkdir to create the nested directory (PowerShell creates parent folders automatically)',
        },
      },
    },
    {
      type: 'code-fill',
      instruction: 'Complete this review skill that accepts a file path as a parameter:',
      language: 'markdown',
      filename: '.claude/commands/review.md',
      template: "# Code Review\n\nReview the file: {{param_var}}\n\nCheck for:\n- {{security_check}} (SQL injection, XSS, auth bypasses)\n- Performance issues (N+1 queries, unnecessary re-renders)\n- Error handling (uncaught promises, missing try/catch)\n- Type safety (any casts, missing null checks)\n\nFor each issue found:\n1. Quote the problematic code\n2. Explain the risk\n3. Provide a fix",
      blanks: [
        { id: 'param_var', answer: '$ARGUMENTS', alternatives: ['$arguments', '$ARGS'], placeholder: 'user input variable?', hint: 'The all-caps variable prefixed with $ that holds text passed after the slash command' },
        { id: 'security_check', answer: 'Security vulnerabilities', alternatives: ['Security issues', 'security vulnerabilities'], placeholder: 'first check category?', hint: 'The most critical type of code issue to check for — involves exploits and attacks' },
      ],
      explanation: 'Skills reference $ARGUMENTS to accept user input. When invoked as /review src/auth.ts, $ARGUMENTS contains "src/auth.ts". Security vulnerabilities are always the first check priority in a code review.',
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
      type: 'compare',
      title: 'Skills vs Hooks',
      body: 'Both extend Claude Code, but they trigger in opposite ways.',
      question: 'Which one fires automatically without you typing anything?',
      correctSide: 'right',
      left: {
        label: 'Skills (Manual)',
        content: "- You invoke with /command-name\n- Markdown files in .claude/commands/\n- Loaded on demand when you type the command\n- Can contain multi-step instructions\n- Accept $ARGUMENTS from user input\n\nExample: /pre-commit\n→ Runs lint, typecheck, test, then commits",
        language: 'text',
      },
      right: {
        label: 'Hooks (Automatic)',
        content: "- Fire automatically on matching events\n- Configured in settings.json (not markdown)\n- Run as plain shell commands on your machine\n- Intercept tool calls before/after execution\n- Can block dangerous actions\n\nExample: PostToolUse on Write\n→ Auto-lints every file Claude creates",
        language: 'text',
      },
      explanation: 'Skills are manual — you invoke them with a slash command. Hooks are automatic — they fire when Claude Code performs certain actions. Hooks intercept before (PreToolUse) and after (PostToolUse) tool execution, and on notifications.',
    },
    {
      type: 'interactive-diagram',
      title: 'Hook Execution Flow',
      body: 'Click through each stage to see how hooks intercept tool calls before and after execution.',
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
      stages: [
        {
          highlightNodes: ['model'],
          highlightEdges: [],
          explanation: 'Claude decides to use a tool — Bash, Edit, Read, or Write. Before the tool runs, hooks get a chance to intercept.',
        },
        {
          highlightNodes: ['model', 'pre'],
          highlightEdges: [{ from: 'model', to: 'pre' }],
          explanation: 'The PreToolUse hook fires. Your shell command runs with context about what tool is being called. If the hook exits with code 1, the tool is BLOCKED.',
        },
        {
          highlightNodes: ['pre', 'tool'],
          highlightEdges: [{ from: 'pre', to: 'tool' }],
          explanation: 'If the PreToolUse hook allows it (exit code 0), the tool executes normally — running the bash command, editing the file, etc.',
        },
        {
          highlightNodes: ['tool', 'post'],
          highlightEdges: [{ from: 'tool', to: 'post' }],
          explanation: 'After the tool completes, the PostToolUse hook fires. Use this for auto-formatting, linting, logging, or notifications.',
        },
        {
          highlightNodes: ['post', 'result'],
          highlightEdges: [{ from: 'post', to: 'result' }],
          explanation: 'The result flows back to the model. The agent continues its work, unaware that hooks ran behind the scenes.',
        },
      ],
    },

    // === HOOK CONFIGURATION ===
    {
      type: 'code-fill',
      instruction: 'Complete this hook configuration. Hooks are defined in settings.json with event types, matchers, and shell commands:',
      language: 'json',
      filename: '.claude/settings.json',
      template: '{\n  "hooks": {\n    "{{pre_event}}": [\n      {\n        "matcher": "Bash",\n        "command": "echo \\"About to run a bash command\\""\n      }\n    ],\n    "PostToolUse": [\n      {\n        "{{filter_field}}": "Write",\n        "command": "bun run lint --fix {{file_var}}"\n      }\n    ],\n    "Notification": [\n      {\n        "command": "terminal-notifier -message \\"Claude needs attention\\""\n      }\n    ]\n  }\n}',
      blanks: [
        { id: 'pre_event', answer: 'PreToolUse', alternatives: ['pretooluse'], placeholder: 'before event?', hint: 'The hook event that fires BEFORE a tool runs — Pre + ToolUse' },
        { id: 'filter_field', answer: 'matcher', placeholder: 'filter key?', hint: 'The JSON key that specifies which tool name triggers this hook' },
        { id: 'file_var', answer: '$CLAUDE_FILE_PATH', alternatives: ['$claude_file_path'], placeholder: 'file variable?', hint: 'The environment variable containing the file path the tool is operating on' },
      ],
      explanation: 'PreToolUse fires before execution (use for validation/blocking). The "matcher" field filters by tool name. $CLAUDE_FILE_PATH is the env var containing the current file path. Notification hooks fire when Claude needs attention.',
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
      type: 'match',
      instruction: 'Match each hook environment variable to the context it provides:',
      leftItems: [
        '$CLAUDE_TOOL_NAME',
        '$CLAUDE_TOOL_INPUT',
        '$CLAUDE_FILE_PATH',
        '$CLAUDE_SESSION_ID',
      ],
      rightItems: [
        'Which tool is being called (Bash, Edit, Read, Write)',
        'JSON string of the tool input parameters',
        'File path the tool is operating on',
        'Current session identifier',
      ],
      correctPairs: { 0: 0, 1: 1, 2: 2, 3: 3 },
      explanation: 'Hooks receive context about the current tool call through environment variables. Use $CLAUDE_TOOL_INPUT to inspect what command is being run — for example, to block destructive git commands like --force or reset --hard.',
    },
    {
      type: 'code-fill',
      instruction: 'Complete this hook script that blocks destructive git commands. Three hook events exist: PreToolUse (before), PostToolUse (after), and Notification.',
      language: 'bash',
      filename: 'block-destructive.sh',
      template: "# Block destructive git commands in a PreToolUse hook\nif echo \"${{input_var}}\" | grep -q 'git.*{{force_flag}}\\|git.*reset --hard'; then\n  echo \"BLOCKED: Destructive git command detected\" >&2\n  exit {{block_code}}\nfi",
      blanks: [
        { id: 'input_var', answer: 'CLAUDE_TOOL_INPUT', alternatives: ['claude_tool_input'], placeholder: 'which env var?', hint: 'The environment variable containing the JSON of what the tool will do' },
        { id: 'force_flag', answer: '--force', alternatives: ['-f'], placeholder: 'dangerous flag?', hint: 'The git push flag that overwrites remote history' },
        { id: 'block_code', answer: '1', placeholder: 'exit code?', hint: 'A non-zero exit code tells the PreToolUse hook to BLOCK the tool' },
      ],
      explanation: 'Check $CLAUDE_TOOL_INPUT for dangerous patterns like --force or reset --hard. Exit with code 1 to block the tool. Exit 0 (or no exit) allows the tool to proceed. This is how guardrail hooks enforce safety boundaries.',
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'You understand automatic actions. Your AI agent now has guardrails.',
    },

    // === PRACTICAL EXAMPLES ===
    {
      type: 'multiple-choice',
      question: 'A PostToolUse hook on Write runs "npx eslint --fix" on every file Claude creates. What does this accomplish?',
      options: [
        'It blocks Claude from writing files that have lint errors',
        'It automatically fixes formatting in every file Claude writes, so code is always clean',
        'It sends a notification when lint errors are found',
        'It prevents Claude from using the Write tool entirely',
      ],
      correctIndex: 1,
      explanation: 'PostToolUse fires AFTER the tool completes. The hook auto-fixes formatting on every file Claude creates. The agent never commits unformatted code. PreToolUse hooks block actions; PostToolUse hooks clean up after actions. Hooks transform your agent from untethered to governed.',
    },
    {
      type: 'code-fill',
      instruction: 'Complete this PostToolUse hook that auto-lints files after both Write and Edit operations:',
      language: 'json',
      filename: '.claude/settings.json (partial)',
      template: '{\n  "hooks": {\n    "PostToolUse": [\n      {\n        "matcher": "{{write_tool}}",\n        "command": "npx {{linter}} --fix \\"$CLAUDE_FILE_PATH\\" 2>/dev/null || true"\n      },\n      {\n        "matcher": "{{edit_tool}}",\n        "command": "npx {{linter}} --fix \\"$CLAUDE_FILE_PATH\\" 2>/dev/null || true"\n      }\n    ]\n  }\n}',
      blanks: [
        { id: 'write_tool', answer: 'Write', alternatives: ['write'], placeholder: 'create tool?', hint: 'The Claude Code tool that creates new files' },
        { id: 'linter', answer: 'eslint', alternatives: ['ESLint'], placeholder: 'lint command?', hint: 'The popular JavaScript/TypeScript linting tool' },
        { id: 'edit_tool', answer: 'Edit', alternatives: ['edit'], placeholder: 'modify tool?', hint: 'The Claude Code tool that modifies existing files' },
      ],
      explanation: 'Match both "Write" (new files) and "Edit" (modified files) to ensure every file Claude touches gets auto-linted. The "2>/dev/null || true" suppresses errors so the hook never blocks the workflow.',
    },

    // === CHAINING SKILLS ===
    {
      type: 'multiple-choice',
      question: 'A /deploy skill references /pre-commit and /check-deploy in its instructions. What design principle does this follow?',
      options: [
        'Dependency injection — skills inject behavior into each other',
        'Single responsibility — each skill does one thing, chaining combines them',
        'Inheritance — the deploy skill inherits from pre-commit',
        'Abstraction — hide implementation details',
      ],
      correctIndex: 1,
      explanation: 'Skills can reference other skills to create composable automation. The key principle is single responsibility — each skill does one thing well, and chaining combines them. This mirrors Unix pipes: small tools composed into complex workflows.',
    },
    {
      type: 'code-fill',
      instruction: 'Complete this deployment skill that chains other skills in a pipeline:',
      language: 'markdown',
      filename: '.claude/commands/ship.md',
      template: "# Ship to Production\n\nExecute this deployment pipeline in order:\n\n1. Run the {{pre_check}} checks (lint, typecheck, test)\n2. If all checks pass, commit with a {{commit_style}} commit message\n3. Push to origin main\n4. Wait 30 seconds, then run {{verify_cmd}} to verify\n5. If deployment fails, immediately run `git revert HEAD` and push\n\nReport final status: deployed successfully or rolled back with error details.",
      blanks: [
        { id: 'pre_check', answer: '/pre-commit', alternatives: ['pre-commit'], placeholder: 'which skill?', hint: 'The slash command that runs lint, typecheck, and tests' },
        { id: 'commit_style', answer: 'conventional', alternatives: ['conventional-commit'], placeholder: 'commit format?', hint: 'The commit message format that uses prefixes like feat:, fix:, refactor:' },
        { id: 'verify_cmd', answer: '/check-deploy', alternatives: ['check-deploy'], placeholder: 'verify skill?', hint: 'A slash command that verifies the deployment succeeded' },
      ],
      explanation: 'The /ship skill chains /pre-commit for quality checks, uses conventional commits for clear history, and runs /check-deploy to verify. If deployment fails, it auto-reverts. Small focused skills combine into powerful pipelines.',
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
      type: 'multiple-choice',
      question: 'You have a personal code review checklist you use across all projects. Where should this skill file live?',
      options: [
        '.claude/commands/ (project-level)',
        '~/.claude/commands/ (user-level)',
        'CLAUDE.md (project instructions)',
        'package.json (project config)',
      ],
      correctIndex: 1,
      explanation: 'User-level skills in ~/.claude/commands/ are available in every project you open — ideal for personal workflows. Project-level skills in .claude/commands/ are for team-shared workflows committed to git. When a teammate pulls the repo, they get all project skills automatically.',
    },
    {
      type: 'terminal',
      instruction: 'See all the reusable instructions (slash commands) available in your current Claude Code session:',
      expectedCommand: '/commands',
      hint: 'Use the slash command that lists all available commands',
    },

    // === ADVANCED PATTERNS ===
    {
      type: 'code-fill',
      instruction: 'Complete this combined hooks config. Hooks enforce guardrails automatically while skills provide on-demand workflows:',
      language: 'json',
      filename: '.claude/settings.json',
      template: '{\n  "hooks": {\n    "PreToolUse": [\n      {\n        "matcher": "{{shell_tool}}",\n        "command": "sh .claude/guards/no-force-push.sh"\n      }\n    ],\n    "PostToolUse": [\n      {\n        "matcher": "Write",\n        "command": "npx eslint --fix \\"{{file_env_var}}\\" 2>/dev/null || true"\n      }\n    ],\n    "{{notify_event}}": [\n      {\n        "command": "osascript -e \'display notification \\\"Claude needs you\\\"\'"\n      }\n    ]\n  }\n}',
      blanks: [
        { id: 'shell_tool', answer: 'Bash', alternatives: ['bash'], placeholder: 'which tool to guard?', hint: 'The tool that runs shell commands — where dangerous git operations happen' },
        { id: 'file_env_var', answer: '$CLAUDE_FILE_PATH', alternatives: ['$claude_file_path'], placeholder: 'file path var?', hint: 'The hook environment variable that contains the file being operated on' },
        { id: 'notify_event', answer: 'Notification', alternatives: ['notification'], placeholder: 'alert event?', hint: 'The hook event that fires when Claude needs human attention' },
      ],
      explanation: 'Guard Bash commands with PreToolUse to block force-push. Auto-lint with PostToolUse on Write using $CLAUDE_FILE_PATH. Send desktop alerts on Notification events. Together, hooks and skills create a governed, automated environment.',
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

    // === INTERACTIVE: COMPARE, MATCH, CODE-FILL ===
    {
      type: 'compare',
      title: 'Inline instructions vs saved skills',
      body: 'You can type the same instruction every time, or save it as a reusable skill file.',
      question: 'Which approach scales better across projects?',
      correctSide: 'right',
      left: {
        label: 'Inline (every time)',
        content: '> claude "Review this PR for security issues.\n  Check for: hardcoded secrets, SQL injection,\n  XSS vulnerabilities, missing auth checks,\n  exposed API keys. Format as a checklist\n  with severity levels."',
        language: 'text',
      },
      right: {
        label: 'Saved skill',
        content: '# .claude/commands/security-review.md\n\nReview the current diff for security issues.\n\nCheck for:\n- Hardcoded secrets or API keys\n- SQL injection vulnerabilities\n- XSS attack vectors\n- Missing authentication checks\n- Exposed internal endpoints\n\nFormat as a severity-ranked checklist.',
        language: 'markdown',
      },
      explanation: 'Saved skills are consistent, shareable, and version-controlled. You type /security-review instead of remembering the full prompt. The whole team uses the same checklist.',
    },
    {
      type: 'match',
      instruction: 'Match each hook type to its purpose:',
      leftItems: ['PreToolUse', 'PostToolUse', 'Notification'],
      rightItems: ['Validate or block an action before it runs', 'Run cleanup or checks after an action completes', 'React to events like errors or status changes'],
      correctPairs: { 0: 0, 1: 1, 2: 2 },
      explanation: 'PreToolUse hooks act as guardrails — they can prevent dangerous actions. PostToolUse hooks run after the fact for logging or cleanup. Notification hooks react to system events.',
    },
    {
      type: 'code-fill',
      instruction: 'Complete this hook configuration to auto-lint every file the agent writes:',
      language: 'json',
      template: '{\n  "hooks": {\n    "{{event_type}}": [\n      {\n        "{{filter_key}}": "{{tool_name}}",\n        "command": "npx eslint --fix \\"$CLAUDE_FILE_PATH\\""\n      }\n    ]\n  }\n}',
      blanks: [
        { id: 'event_type', answer: 'PostToolUse', alternatives: ['postToolUse', 'posttooluse'], placeholder: 'hook event?', hint: 'This hook fires after a tool finishes — Pre or Post?' },
        { id: 'filter_key', answer: 'matcher', placeholder: 'filter field?', hint: 'The JSON key that filters which tool triggers the hook' },
        { id: 'tool_name', answer: 'Write', alternatives: ['write'], placeholder: 'which tool?', hint: 'The tool that creates new files' },
      ],
      explanation: 'PostToolUse fires after a tool completes. The "matcher" field filters by tool name. "Write" targets file creation — so every new file gets auto-linted.',
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
