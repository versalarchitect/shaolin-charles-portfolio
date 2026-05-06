import type { LessonContent } from './types'

const content: LessonContent = {
  lessonId: '1-4',
  steps: [
    // === INTRO ===
    {
      type: 'info',
      title: 'Principle 1: Understand before you build',
      body: "You get a task -- \"add a login page\" -- and you immediately type it into Claude Code. The AI generates a page, but it uses a different styling approach than your project, invents its own patterns, and uses tools your project does not have. You have created more work than you saved. The fix: before asking AI to write or modify code, first understand what already exists in your project. An AI agent that receives context about your project produces code that fits. An agent that only gets a vague task description produces code that conflicts with everything else.",
    },

    // === DIAGRAM 1: Read Then Generate ===
    {
      type: 'diagram',
      title: 'Read Then Generate',
      body: 'The correct workflow when directing an agent to modify a codebase. Every step before "Write Prompt" is about building context.',
      diagram: {
        direction: 'LR',
        nodes: [
          { id: 'codebase', label: 'Codebase', shape: 'rounded', highlight: true },
          { id: 'read', label: 'Read Files' },
          { id: 'map', label: 'Map Structure' },
          { id: 'prompt', label: 'Write Prompt' },
          { id: 'build', label: 'Agent Builds' },
          { id: 'verified', label: 'Verified', shape: 'pill', highlight: true },
        ],
        edges: [
          { from: 'codebase', to: 'read' },
          { from: 'read', to: 'map' },
          { from: 'map', to: 'prompt' },
          { from: 'prompt', to: 'build' },
          { from: 'build', to: 'verified' },
        ],
      },
    },

    // === THE ANTI-PATTERN ===
    {
      type: 'code-demo',
      title: 'Blind generation: the anti-pattern',
      body: "Here's what happens when you skip the reading step. The agent has no context about your project, so it makes assumptions -- and those assumptions are almost always wrong.",
      language: 'text',
      code: '# You type:\n"Add a login page to my app"\n\n# The agent assumes:\n- React Router (your app uses TanStack Router)\n- Tailwind CSS (your app uses styled-components)\n- A new AuthContext (your app already has one in src/providers/)\n- fetch() for API calls (your app uses axios with interceptors)\n\n# Result: a "working" component that breaks everything',
    },
    {
      type: 'multiple-choice',
      question: 'Why does blind generation produce code that conflicts with the existing codebase?',
      options: [
        'The AI model is not powerful enough',
        'The agent has no context about project conventions and fills gaps with assumptions',
        'The agent intentionally ignores existing patterns',
        'Blind generation only fails on large projects',
      ],
      correctIndex: 1,
      explanation: "AI agents predict the most probable code for your request. Without context about your specific project, \"most probable\" means the most common patterns from training data -- not your project's patterns. The agent isn't wrong; it's uninformed.",
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'You understand why reading first matters!',
    },

    // === THE EXPLORATION WORKFLOW ===
    {
      type: 'info',
      title: 'The exploration workflow',
      body: "Before touching any code, run three types of reconnaissance: find (what files exist), grep (what patterns are used), and read (how specific files work). Think of it like a surgeon studying scans before operating -- you need to know the anatomy before you cut.",
    },
    {
      type: 'code-demo',
      title: 'Step 1: Find -- discover the structure',
      body: "Start by mapping what exists. The find command shows you the project's file tree so you know where things live.",
      language: 'bash',
      filename: 'terminal',
      code: '# See all TypeScript/React files\nfind . -name "*.tsx" | head -20\n\n# Find component files specifically\nfind ./src/components -name "*.tsx"\n\n# Find config files at the root\nfind . -maxdepth 1 -name "*.config.*"\n\n# Find test files\nfind . -name "*.test.*" -o -name "*.spec.*"',
    },
    {
      type: 'terminal',
      instruction: 'Use this command to see all the TypeScript React files in your project. This helps you understand what already exists before asking AI to create something new:',
      expectedCommand: 'find . -name "*.tsx" | head -20',
      hint: 'Use find with -name to match the .tsx extension, pipe to head to limit output',
    },
    {
      type: 'code-demo',
      title: 'Step 2: Grep -- discover the patterns',
      body: "Once you know what files exist, grep tells you how they work. Search for export patterns, import patterns, and key function signatures to understand conventions.",
      language: 'bash',
      filename: 'terminal',
      code: '# How are components exported?\ngrep -r "export default" src/components/ | head -10\ngrep -r "export function" src/components/ | head -10\n\n# What routing library is used?\ngrep -r "import.*from.*router" src/ | head -5\n\n# What state management exists?\ngrep -r "createContext\\|useContext\\|zustand\\|redux" src/ | head -10\n\n# What API client is used?\ngrep -r "fetch(\\|axios\\|useSWR\\|useQuery" src/ | head -5',
    },
    {
      type: 'terminal',
      instruction: 'Use this command to see how existing components are set up. This tells you the patterns your project follows:',
      expectedCommand: 'grep -r "export default" src/components/ | head -10',
      hint: 'Use grep -r to search recursively through the components directory',
    },
    {
      type: 'code-demo',
      title: 'Step 3: Read -- understand the specifics',
      body: "Now read the key files that define project conventions. These anchor files tell you more about the project than any other source.",
      language: 'bash',
      filename: 'terminal',
      code: '# Project dependencies and scripts\ncat package.json\n\n# Project-specific AI instructions\ncat CLAUDE.md\n\n# Routing configuration\ncat src/routes.tsx\n\n# An existing component (to match its pattern)\ncat src/components/Dashboard.tsx\n\n# Global styles and theme\ncat src/globals.css',
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'You know the find-grep-read workflow!',
    },

    // === WHAT TO MAP ===
    {
      type: 'checklist',
      title: 'What to map before prompting',
      items: [
        'File structure -- where do components, pages, hooks, and utils live?',
        'Naming conventions -- PascalCase files? kebab-case? index.ts barrels?',
        'Import patterns -- absolute paths (@/components) or relative (../../)?',
        'Existing components -- is there a Button, Modal, or Form you should reuse?',
        'Routing -- what library and what pattern (file-based, config-based)?',
        'State management -- Context, Zustand, Redux, or plain props?',
        'Styling -- Tailwind, CSS modules, styled-components, or inline?',
        'API layer -- fetch, axios, tRPC, or generated client?',
      ],
    },
    {
      type: 'order',
      instruction: 'Order these exploration steps from FIRST to LAST:',
      items: [
        'Write the prompt for the agent',
        'Read package.json and config files',
        'Find the project file structure',
        'Grep for patterns and conventions',
      ],
      correctOrder: [2, 1, 3, 0],
    },

    // === DIAGRAM 2: Blind vs Informed ===
    {
      type: 'diagram',
      title: 'Blind vs Informed Generation',
      body: 'The same task produces very different results depending on whether you read the codebase first.',
      diagram: {
        direction: 'TB',
        nodes: [
          { id: 'task', label: 'Task', shape: 'rounded' },
          { id: 'decision', label: 'Read First?', shape: 'diamond' },
          { id: 'blind', label: 'Blind Output', sublabel: 'Conflicts, bugs' },
          { id: 'informed', label: 'Informed Output', sublabel: 'Clean, consistent', highlight: true },
        ],
        edges: [
          { from: 'task', to: 'decision' },
          { from: 'decision', to: 'blind', label: 'skip' },
          { from: 'decision', to: 'informed', label: 'read first' },
        ],
      },
    },

    // === CONTEXT-AWARE PROMPTS ===
    {
      type: 'info',
      title: 'Writing context-aware prompts',
      body: "Once you've read the codebase, you feed that knowledge into your prompt. A context-aware prompt tells the agent what patterns to follow, what components to reuse, and what conventions to match. The agent goes from guessing to following a blueprint.",
    },
    {
      type: 'code-demo',
      title: 'Before vs after reading',
      body: "Compare these two prompts for the same task. The second one produces code that fits the project on the first try.",
      language: 'text',
      code: '# BEFORE reading (blind):\n"Add a settings page where users can update their profile"\n\n# AFTER reading (informed):\n"Add a Settings page at src/pages/Settings.tsx.\nFollow the same pattern as src/pages/Dashboard.tsx:\n- Use the AppLayout wrapper component\n- Use react-hook-form for the form (already in package.json)\n- Use the existing supabase client from src/lib/supabase.ts\n- Use Tailwind classes matching the card pattern in Dashboard\n- Add the route in src/routes.tsx using the lazy-load pattern\n- Export as default function component (matches convention)"',
    },
    {
      type: 'code-input',
      instruction: 'You\'ve read the codebase and found that components are in src/components/, use default exports, and follow PascalCase naming. Complete this prompt:',
      placeholder: 'Create a Navbar component at src/components/______.tsx using a ______ export',
      answer: 'Navbar',
      hint: 'Match the PascalCase naming convention you discovered',
    },
    {
      type: 'multiple-choice',
      question: 'Which prompt will produce the most consistent code?',
      options: [
        '"Build me a data table component"',
        '"Build a DataTable at src/components/DataTable.tsx. Use the same Tailwind card pattern as UserList.tsx, the useQuery hook from src/hooks/useApi.ts, and match the existing column-sorting approach in OrdersTable."',
        '"Build a data table. Use React and TypeScript."',
        '"Build a fancy data table with sorting and filtering"',
      ],
      correctIndex: 1,
      explanation: 'This prompt references specific existing files, hooks, patterns, and conventions discovered by reading the codebase. The agent can match the exact style instead of inventing its own.',
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'You can write context-aware prompts!',
    },

    // === PRACTICE: READING A PROJECT ===
    {
      type: 'terminal',
      instruction: 'Practice time. Imagine you need to add an "Announcements" feature. Start by checking what tools and libraries your project already uses:',
      expectedCommand: 'cat package.json',
      hint: 'Read the package.json file to understand the project dependencies',
    },
    {
      type: 'terminal',
      instruction: 'Now find all existing pages in your project to see where they live and how they are named:',
      expectedCommand: 'find ./src/pages -name "*.tsx"',
      hint: 'Use find to list .tsx files in the pages directory',
    },
    {
      type: 'code-demo',
      title: 'Building your informed prompt',
      body: "After running find, grep, and reading key files, you assemble everything into a context-rich prompt. Notice how every decision is grounded in something you actually observed.",
      language: 'text',
      code: '# Your reconnaissance found:\n# - Pages live in src/pages/ as PascalCase default exports\n# - Routes defined in src/routes.tsx with lazy imports\n# - Uses Supabase for backend (src/lib/supabase.ts)\n# - Existing list pages use a shared Card component\n# - Forms use react-hook-form with zod validation\n\n# Your informed prompt:\n"Add an Announcements page.\n- Create src/pages/Announcements.tsx (default export)\n- Add lazy route in src/routes.tsx matching the existing pattern\n- Fetch announcements from Supabase \'announcements\' table\n  using the client from src/lib/supabase.ts\n- Display in Card components from src/components/ui/card\n- For the create form, use react-hook-form + zod\n  matching the pattern in src/pages/Settings.tsx"',
    },

    // === COMMON MISTAKES ===
    {
      type: 'multiple-choice',
      question: 'You need to add a feature to an unfamiliar codebase. What should you do FIRST?',
      options: [
        'Ask the agent to add the feature immediately',
        'Read the README and then ask the agent',
        'Run find/grep/read to map structure, conventions, and dependencies',
        'Ask the agent to explain the codebase to you',
      ],
      correctIndex: 2,
      explanation: "While reading the README helps, it often doesn't cover implementation patterns. Asking the agent to explain the codebase is circular -- it may hallucinate details. Running find/grep/read yourself gives you ground truth about what actually exists.",
    },

    // === WRAP-UP ===
    {
      type: 'checklist',
      title: 'Principle 1 checklist',
      items: [
        'Run find to map the file structure before prompting',
        'Run grep to discover export patterns, imports, and conventions',
        'Read package.json, config files, and CLAUDE.md for project context',
        'Read at least one existing file similar to what you want to create',
        'Reference specific files and patterns in your prompt',
        'Never ask an agent to generate code without project context',
      ],
    },
    {
      type: 'checkpoint',
      xp: 11,
      message: 'Lesson complete! You\'ve mastered Principle 1: Read before you generate.',
    },
  ],
}

export default content
