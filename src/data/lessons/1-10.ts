import type { LessonContent } from './types'

const content: LessonContent = {
  lessonId: '1-10',
  steps: [
    // === INTRODUCTION ===
    {
      type: 'info',
      title: 'Capstone: build and launch a real tool',
      body: "This is where everything clicks. You will combine every skill from Tier 1 — structured prompting, iterative development, context management, CLAUDE.md, multi-step workflows — into one continuous flow. The project: a Commit Message Generator. A single-page web app where users paste a git diff and get back a conventional commit message. You will spec it, direct an agent to build it, verify the output, and ship it live to a public URL. Real utility, real deployment, real portfolio piece.",
    },

    // === PIPELINE DIAGRAM (INTERACTIVE) ===
    {
      type: 'interactive-diagram',
      title: 'The Spec-Build-Deploy Pipeline',
      body: 'Your capstone follows this five-stage pipeline. Step through each stage to see which Tier 1 skill it exercises.',
      diagram: {
        direction: 'LR',
        nodes: [
          { id: 'spec', label: 'Spec', sublabel: 'Write requirements', shape: 'rounded', highlight: true },
          { id: 'scaffold', label: 'Scaffold', sublabel: 'Agent creates project', shape: 'rect' },
          { id: 'implement', label: 'Implement', sublabel: 'Agent writes logic', shape: 'rect' },
          { id: 'verify', label: 'Verify', sublabel: 'You review & test', shape: 'rect' },
          { id: 'deploy', label: 'Deploy', sublabel: 'Push to production', shape: 'pill', highlight: true },
        ],
        edges: [
          { from: 'spec', to: 'scaffold', label: 'prompt' },
          { from: 'scaffold', to: 'implement', label: 'iterate' },
          { from: 'implement', to: 'verify', label: 'review' },
          { from: 'verify', to: 'deploy', label: 'ship' },
        ],
      },
      stages: [
        {
          highlightNodes: ['spec'],
          highlightEdges: [],
          explanation: 'Spec: Define exact requirements, constraints, and out-of-scope boundaries. This is structured prompting — the most important skill from Tier 1.',
        },
        {
          highlightNodes: ['spec', 'scaffold'],
          highlightEdges: [{ from: 'spec', to: 'scaffold' }],
          explanation: 'Scaffold: Prompt the agent to create the file structure only — no logic yet. This is context management: keeping each prompt focused on one concern.',
        },
        {
          highlightNodes: ['scaffold', 'implement'],
          highlightEdges: [{ from: 'scaffold', to: 'implement' }],
          explanation: 'Implement: Build logic one component at a time. This is iterative development — review each piece before building the next layer on top.',
        },
        {
          highlightNodes: ['implement', 'verify'],
          highlightEdges: [{ from: 'implement', to: 'verify' }],
          explanation: 'Verify: Review agent output for logic errors, spec compliance, and security. You are the quality gate — the agent builds, you validate.',
        },
        {
          highlightNodes: ['verify', 'deploy'],
          highlightEdges: [{ from: 'verify', to: 'deploy' }],
          explanation: 'Deploy: Push to production with proper env vars and CLAUDE.md documentation. The project is live, maintainable, and portfolio-ready.',
        },
      ],
    },

    // === PHASE 1: SPEC ===
    {
      type: 'code-demo',
      title: 'Phase 1: Write the spec',
      body: "A spec is the most important prompt you will write. It is not a vague wish list — it is a precise contract: the exact user flow, technical constraints, acceptance criteria, and out-of-scope boundaries. The agent cannot read your mind. The spec is your mind, externalized.",
      language: 'markdown',
      filename: 'SPEC.md',
      code: "# Commit Message Generator — Spec\n\n## Overview\nSingle-page web tool. User pastes a git diff, gets a conventional commit message.\n\n## User Flow\n1. User lands on page — sees a textarea labeled \"Paste your git diff\"\n2. User pastes diff, clicks \"Generate\"\n3. Loading state shows while API processes\n4. Result appears in a readonly output box with a \"Copy\" button\n5. User can edit the diff and regenerate\n\n## Technical Constraints\n- Framework: Vite + React + TypeScript\n- Styling: Tailwind CSS\n- API: Single serverless function (Vercel API route)\n- LLM: Anthropic Claude API (claude-sonnet-4-20250514)\n- No database, no auth, no state persistence\n\n## Acceptance Criteria\n- [ ] Generates valid conventional commit format (type: description)\n- [ ] Handles empty input gracefully (error message, not crash)\n- [ ] Loading state visible during generation\n- [ ] Copy button works on all browsers\n- [ ] Deployed to a public Vercel URL\n- [ ] Responsive on mobile\n\n## Out of Scope\n- User accounts or history\n- Multiple LLM providers\n- Syntax highlighting in the diff input\n- Rate limiting (for now)",
    },
    {
      type: 'multiple-choice',
      question: 'Why does the spec include an "Out of Scope" section?',
      options: [
        'To document features for the next sprint',
        'To prevent the agent from over-building — agents love to add unrequested features',
        'It is required by the conventional commit standard',
        'To make the spec document look more professional',
      ],
      correctIndex: 1,
      explanation: 'Agents tend to anticipate needs and add features you did not ask for. Explicitly stating what is out of scope creates a hard boundary. Without it, you might get auth middleware, database schemas, and rate limiting when all you wanted was a textarea and a button.',
    },
    {
      type: 'code-input',
      instruction: 'In conventional commits, what prefix indicates a new feature? (e.g., "___: add commit generator")',
      placeholder: 'Enter the prefix',
      answer: 'feat',
      hint: 'Short for "feature" — the most common conventional commit type',
    },
    {
      type: 'checkpoint',
      xp: 5,
      message: 'Spec written! Your AI agent knows exactly what to build.',
    },

    // === INTERACTIVE: PROMPT-LAB, COMPARE ===
    {
      type: 'prompt-lab',
      instruction: 'Write a prompt to start the capstone implementation. Include spec elements you learned in this tier.',
      scenario: 'You have a spec for a URL shortener tool. You need to direct Claude Code to scaffold the project. The spec says: Next.js App Router, TypeScript strict, SQLite via Drizzle ORM, Tailwind CSS, no auth needed.',
      starterPrompt: 'Build me a URL shortener.',
      responses: [
        {
          triggerKeywords: ['next.js', 'typescript', 'sqlite', 'drizzle', 'tailwind'],
          response: 'I\'ll scaffold the URL shortener with your exact stack.\n\nCreating:\n1. Next.js 15 App Router project with TypeScript strict\n2. Drizzle ORM + SQLite for the database\n3. Tailwind CSS for styling\n4. src/ directory structure\n\nStarting with the database schema...',
          quality: 'excellent',
          feedback: 'You specified the exact technology stack from the spec. The agent doesn\'t need to make any technology decisions — it can start building immediately.',
        },
        {
          triggerKeywords: ['url', 'shortener', 'next'],
          response: 'I\'ll build a URL shortener with Next.js! Should I use:\n- Prisma or Drizzle for the database?\n- PostgreSQL or SQLite?\n- Should I add authentication?\n\nLet me know your preferences.',
          quality: 'good',
          feedback: 'You mentioned Next.js but left technology choices open. The agent is asking follow-up questions instead of building. Include all constraints from your spec to eliminate decision points.',
        },
      ],
      fallbackResponse: {
        response: 'Sure, I\'ll build a URL shortener. Let me set up a full-stack app with Express, React, PostgreSQL, Redis for caching, and Docker for deployment...',
        feedback: 'Without spec constraints, the agent invented its own stack. Include: framework, language mode, database, ORM, and styling from your spec to get the exact output you want.',
      },
    },
    {
      type: 'compare',
      title: 'All-at-once vs phased build',
      body: 'Two approaches to building a complete project with an AI agent.',
      question: 'Which approach gives you more control over the output?',
      correctSide: 'right',
      left: {
        label: 'All at once',
        content: 'One prompt:\n"Build the entire URL shortener"\n\nResult:\n- 20+ files created at once\n- Hard to review\n- Errors compound\n- Difficult to redirect\n- Context exhausted quickly',
        language: 'text',
      },
      right: {
        label: 'Phased',
        content: 'Four focused prompts:\n1. "Scaffold project structure"\n2. "Implement database schema + API"\n3. "Build the frontend UI"\n4. "Add tests and verify"\n\nResult:\n- Review after each phase\n- Catch errors early\n- Easy to redirect\n- Context stays fresh',
        language: 'text',
      },
      explanation: 'Phased builds let you verify each layer before building the next. If the database schema is wrong, you catch it before the frontend is built on top of it.',
    },

    // === PHASE 2: SCAFFOLD ===
    {
      type: 'terminal',
      instruction: 'Create a new Vite project called commit-gen with the React TypeScript template:',
      expectedCommand: 'npx create-vite commit-gen --template react-ts',
      hint: 'Use npx create-vite with the --template flag',
    },
    {
      type: 'terminal',
      instruction: 'Install Tailwind CSS and its Vite plugin as dev dependencies:',
      expectedCommand: 'npm install -D tailwindcss @tailwindcss/vite',
      hint: 'Two packages as dev dependencies: tailwindcss and @tailwindcss/vite',
    },
    {
      type: 'code-demo',
      title: 'Prompt Claude Code to scaffold the structure',
      body: 'Give the agent a single focused instruction referencing your spec. Scaffold only — no logic yet.',
      language: 'text',
      filename: 'prompt-to-claude-code.txt',
      code: "You: Read SPEC.md, then create the project file structure.\n     Scaffold only — no implementation yet. I want:\n     - src/App.tsx (empty component shell)\n     - src/components/DiffInput.tsx\n     - src/components/CommitOutput.tsx\n     - api/generate.ts (Vercel serverless function stub)\n     - vercel.json (route the API)\n     Do not write any logic. Just the file skeletons with\n     TypeScript interfaces for the props.",
    },

    // === PROJECT STRUCTURE DIAGRAM ===
    {
      type: 'diagram',
      title: 'Project File Structure',
      body: 'Clean separation: frontend in src/, serverless API at the root, config at top level.',
      diagram: {
        direction: 'TB',
        nodes: [
          { id: 'root', label: 'commit-gen/', sublabel: 'Project root', shape: 'rounded', highlight: true },
          { id: 'src', label: 'src/', sublabel: 'Frontend', shape: 'rect' },
          { id: 'app', label: 'App.tsx', sublabel: 'Main page', shape: 'rect' },
          { id: 'diff', label: 'DiffInput.tsx', sublabel: 'Textarea component', shape: 'rect' },
          { id: 'output', label: 'CommitOutput.tsx', sublabel: 'Result display', shape: 'rect' },
          { id: 'api', label: 'api/', sublabel: 'Serverless', shape: 'rect' },
          { id: 'generate', label: 'generate.ts', sublabel: 'Claude API call', shape: 'pill', highlight: true },
        ],
        edges: [
          { from: 'root', to: 'src' },
          { from: 'root', to: 'api' },
          { from: 'src', to: 'app' },
          { from: 'src', to: 'diff' },
          { from: 'src', to: 'output' },
          { from: 'api', to: 'generate' },
        ],
      },
    },

    // === PHASE 3: IMPLEMENT ===
    {
      type: 'code-demo',
      title: 'Prompt: implement the API route',
      body: 'This prompt gives Claude Code exactly what to build for the serverless function. It specifies the model, the system prompt, and the response format — no ambiguity.',
      language: 'text',
      filename: 'prompt-api-route.txt',
      code: "You: Implement api/generate.ts as a Vercel serverless function.\n\n     Requirements:\n     - POST endpoint, accepts JSON body: { diff: string }\n     - Validate that diff is non-empty, return 400 if missing\n     - Call Anthropic API with claude-sonnet-4-20250514\n     - System prompt: \"You are a commit message generator.\n       Given a git diff, produce a single conventional commit\n       message. Format: type(scope): description. Types:\n       feat, fix, refactor, docs, test, chore. Keep under\n       72 chars. No explanation, just the message.\"\n     - Return JSON: { message: string }\n     - Handle API errors, return 500 with { error: string }\n     - Use ANTHROPIC_API_KEY from process.env",
    },
    {
      type: 'multiple-choice',
      question: 'Why prompt the agent to implement one component at a time instead of the whole app at once?',
      options: [
        'Claude Code has a file size limit and cannot write large files',
        'Smaller outputs are easier to review, catch errors early, and course-correct before they compound',
        'Conventional commits require one feature per commit',
        'Vercel deploys fail if too many files change at once',
      ],
      correctIndex: 1,
      explanation: 'Incremental prompting gives you a review point after each piece. If the API route has a bug, you catch it before the frontend is built on top of it. Large all-at-once outputs hide errors deep in the code where you might not notice them until deployment fails.',
    },
    {
      type: 'code-demo',
      title: 'Prompt: implement the frontend',
      body: 'After reviewing the API route, prompt for the UI. Be specific about state management, error handling, and the copy-to-clipboard interaction.',
      language: 'text',
      filename: 'prompt-frontend.txt',
      code: "You: Now implement the frontend components.\n\n     DiffInput.tsx:\n     - Textarea with monospace font, min-height 200px\n     - Placeholder: \"Paste your git diff here...\"\n     - \"Generate\" button below, disabled when textarea is empty\n     - Pass diff text up via onChange prop\n\n     CommitOutput.tsx:\n     - Readonly textarea showing the generated message\n     - \"Copy to clipboard\" button using navigator.clipboard\n     - Show a brief \"Copied!\" confirmation that fades after 2s\n     - Hidden when no message has been generated yet\n\n     App.tsx:\n     - Wire both components together\n     - Manage state: diff, message, loading, error\n     - POST to /api/generate on submit\n     - Show loading spinner during fetch\n     - Display error inline if API returns non-200",
    },
    {
      type: 'order',
      instruction: 'Order the implementation prompts from first to last for this project:',
      items: [
        'Wire components together in App.tsx',
        'Implement the API route (api/generate.ts)',
        'Add error handling and loading states',
        'Build the DiffInput component',
        'Build the CommitOutput component',
      ],
      correctOrder: [1, 3, 4, 0, 2],
    },
    {
      type: 'checkpoint',
      xp: 5,
      message: 'Implementation complete! The AI built it, you directed it.',
    },

    // === PHASE 4: VERIFY ===
    {
      type: 'checklist',
      title: 'Review the agent output — verify each item:',
      items: [
        'API route validates empty input and returns 400',
        'ANTHROPIC_API_KEY is read from env, not hardcoded',
        'System prompt matches the spec exactly',
        'Frontend shows loading state during fetch',
        'Copy button uses navigator.clipboard.writeText()',
        'Error messages display to user, not just console.log',
        'No unused imports or dead code',
        'TypeScript compiles without errors (run tsc --noEmit)',
      ],
    },
    {
      type: 'terminal',
      instruction: 'Run the TypeScript compiler to check for type errors without emitting files:',
      expectedCommand: 'npx tsc --noEmit',
      hint: 'Use npx tsc with the --noEmit flag to type-check only',
    },
    {
      type: 'multiple-choice',
      question: 'You notice the agent hardcoded the model as "claude-3-opus" instead of "claude-sonnet-4-20250514" from your spec. What should you do?',
      options: [
        'Deploy anyway — both models work fine',
        'Delete the file and reprompt from scratch',
        'Tell the agent: "Change the model to claude-sonnet-4-20250514 in api/generate.ts line 15"',
        'Manually edit the file yourself without telling the agent',
      ],
      correctIndex: 2,
      explanation: 'Targeted correction is the right move. Give the agent the exact file, line, and change. This is faster than reprompting from scratch, and unlike silent manual edits, it keeps the agent aware of the correction so it does not repeat the mistake in future turns.',
    },
    {
      type: 'code-input',
      instruction: 'What git command shows you the full diff of all staged changes so you can verify what the agent modified?',
      placeholder: 'git ___',
      answer: 'git diff --staged',
      hint: 'git diff with a flag that shows only staged (added) changes',
    },
    {
      type: 'checkpoint',
      xp: 5,
      message: 'Code reviewed and verified! Everything looks good.',
    },

    // === PHASE 5: DEPLOY ===
    {
      type: 'terminal',
      instruction: 'Initialize a git repo and make the first commit:',
      expectedCommand: 'git init && git add -A && git commit -m "feat: initial commit message generator"',
      hint: 'Chain git init, git add, and git commit with &&',
    },
    {
      type: 'code-demo',
      title: 'Deploy to Vercel',
      body: 'Set your API key as an environment variable (never in git), then deploy. The api/ directory is automatically detected as serverless functions.',
      language: 'bash',
      filename: 'deploy.sh',
      code: "# First deploy — links project to Vercel\nvercel deploy\n\n# Set the API key for production environment\nvercel env add ANTHROPIC_API_KEY production\n# Paste your key when prompted\n\n# Deploy to production\nvercel deploy --prod\n\n# Verify it's live\ncurl -X POST https://your-app.vercel.app/api/generate \\\n  -H 'Content-Type: application/json' \\\n  -d '{\"diff\": \"+ console.log(hello)\"}'",
    },
    {
      type: 'multiple-choice',
      question: 'Your deployment fails with "Error: ANTHROPIC_API_KEY is not defined." What went wrong?',
      options: [
        'The Vite build cannot access server-side environment variables',
        'You need to prefix the key with VITE_ for it to work',
        'The env var was not added to Vercel, or was added to the wrong environment (e.g., Development only, not Production)',
        'Vercel does not support environment variables in serverless functions',
      ],
      correctIndex: 2,
      explanation: 'Vercel environment variables are scoped to environments: Production, Preview, and Development. If you added the key only to Development but deployed to Production, the function cannot access it. Always check that the env var is set for the correct environment.',
    },

    // === PHASE 6: DOCUMENT & SYNTHESIZE ===
    {
      type: 'code-demo',
      title: 'Document with CLAUDE.md',
      body: 'Write a CLAUDE.md so future you (or the agent) can maintain the project. This is also portfolio evidence that you directed the build intentionally — not just generated code blindly.',
      language: 'markdown',
      filename: 'CLAUDE.md',
      code: "# Commit Message Generator\n\n## Architecture\n- Frontend: Vite + React + TypeScript + Tailwind\n- API: Single Vercel serverless function (api/generate.ts)\n- LLM: Anthropic Claude (claude-sonnet-4-20250514)\n\n## Development\n```bash\nnpm run dev          # Start Vite dev server\nvercel dev           # Start with serverless functions locally\nnpx tsc --noEmit     # Type check\n```\n\n## Deployment\n- Hosted on Vercel, auto-deploys on push to main\n- ANTHROPIC_API_KEY set in Vercel environment variables\n- No database, no auth\n\n## Key Decisions\n- No streaming: simple request/response is sufficient for <100 token outputs\n- No rate limiting: personal tool, low traffic expected\n- Tailwind over CSS modules: faster iteration, single-page app",
    },
    {
      type: 'code-input',
      instruction: 'What file should you create in your project root so that Claude Code automatically understands the project context?',
      placeholder: 'Enter the filename',
      answer: 'CLAUDE.md',
      hint: 'The markdown file that Claude Code reads for project context — named after the AI itself',
    },
    {
      type: 'order',
      instruction: 'Order the Tier 1 skills as they were applied in this capstone:',
      items: [
        'Context management (keep prompts focused)',
        'Structured specification (clear requirements)',
        'Iterative development (implement in chunks)',
        'Verification (review agent output critically)',
        'Project memory (CLAUDE.md for continuity)',
        'Deployment (ship to production)',
      ],
      correctOrder: [1, 2, 0, 3, 4, 5],
    },
    {
      type: 'checklist',
      title: 'Capstone completion — confirm you did all of this:',
      items: [
        'Spec document written with all 5 sections',
        'Project scaffolded with clear file structure',
        'API route implemented and type-checked',
        'Frontend components wired and functional',
        'Deployed to a public Vercel URL',
        'CLAUDE.md documents the project',
        'Environment variable set securely (not in git)',
        'Tool generates valid conventional commit messages',
        'Entire build directed through Claude Code',
      ],
    },
    {
      type: 'checkpoint',
      xp: 30,
      message: 'TIER 1 COMPLETE! You directed an AI to build a tool and deploy it live. You are an AI director now.',
    },
  ],
}

export default content
