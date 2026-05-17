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
      type: 'interactive-diagram',
      title: 'Read Then Generate',
      body: 'Click through each stage to follow the correct workflow for directing an agent to modify a codebase.',
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
      stages: [
        {
          highlightNodes: ['codebase'],
          highlightEdges: [],
          explanation: 'Start with the codebase. Before you type a single word to the agent, the code already has patterns, conventions, and existing components. Your job is to discover them.',
        },
        {
          highlightNodes: ['codebase', 'read'],
          highlightEdges: [{ from: 'codebase', to: 'read' }],
          explanation: 'Read key files: package.json for dependencies, CLAUDE.md for project rules, and existing components similar to what you want to build. Use cat, find, and grep.',
        },
        {
          highlightNodes: ['read', 'map'],
          highlightEdges: [{ from: 'read', to: 'map' }],
          explanation: 'Map the structure: where do pages live? How are components exported? What styling approach is used? What state management exists? Build a mental model of the project.',
        },
        {
          highlightNodes: ['map', 'prompt'],
          highlightEdges: [{ from: 'map', to: 'prompt' }],
          explanation: 'Now write a prompt that references specific files, patterns, and conventions you discovered. The agent goes from guessing to following a blueprint.',
        },
        {
          highlightNodes: ['prompt', 'build', 'verified'],
          highlightEdges: [{ from: 'prompt', to: 'build' }, { from: 'build', to: 'verified' }],
          explanation: 'The agent builds code that fits your project on the first try. No conflicting patterns, no invented conventions, no wasted iterations. Verify and ship.',
        },
      ],
    },

    // === THE ANTI-PATTERN ===
    {
      type: 'code-fill',
      instruction: 'Here is what happens when you skip reading. The agent has no context, so it makes wrong assumptions. Fill in what your project actually uses vs what the agent assumed.',
      language: 'text',
      template: '# You type:\n"Add a login page to my app"\n\n# The agent assumes:\n- React Router (your app uses {{actual_router}})\n- Tailwind CSS (your app uses {{actual_css}})\n- A new AuthContext (your app already has one in {{auth_path}})\n- fetch() for API calls (your app uses axios with interceptors)\n\n# Result: a "working" component that breaks everything',
      blanks: [
        { id: 'actual_router', answer: 'TanStack Router', alternatives: ['tanstack router', 'tanstack-router', 'TanStack router'], placeholder: '______', hint: 'A popular type-safe React router library' },
        { id: 'actual_css', answer: 'styled-components', alternatives: ['Styled Components', 'styled components'], placeholder: '______', hint: 'CSS-in-JS library using template literals' },
        { id: 'auth_path', answer: 'src/providers/', alternatives: ['src/providers', 'src/providers/*'], placeholder: '______', hint: 'Where React context providers typically live' },
      ],
      explanation: 'Without reading the codebase first, the agent fills gaps with the most common patterns from its training data -- not your project\'s patterns. Each wrong assumption creates more work than you saved.',
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
      type: 'multiple-choice',
      question: 'Before asking an AI agent to modify code, what three types of reconnaissance should you run?',
      options: [
        'build, test, deploy',
        'find (what files exist), grep (what patterns are used), read (how specific files work)',
        'install, configure, run',
        'commit, push, merge',
      ],
      correctIndex: 1,
      explanation: 'Before touching any code, run three types of reconnaissance: find (what files exist), grep (what patterns are used), and read (how specific files work). Think of it like a surgeon studying scans before operating -- you need to know the anatomy before you cut.',
    },
    {
      type: 'code-fill',
      instruction: 'Complete these find commands to map the project structure. The find command shows you what files exist and where they live.',
      language: 'bash',
      filename: 'terminal',
      template: '# See all TypeScript/React files\nfind . -name "{{tsx_pattern}}" | head -20\n\n# Find component files specifically\nfind ./src/{{components_dir}} -name "*.tsx"\n\n# Find config files at the root\nfind . -maxdepth 1 -name "{{config_pattern}}"\n\n# Find test files\nfind . -name "*.test.*" -o -name "*.spec.*"',
      blanks: [
        { id: 'tsx_pattern', answer: '*.tsx', alternatives: ['*.TSX'], placeholder: '______', hint: 'The glob pattern for TypeScript React files' },
        { id: 'components_dir', answer: 'components', alternatives: ['Components'], placeholder: '______', hint: 'The standard directory for React components' },
        { id: 'config_pattern', answer: '*.config.*', alternatives: ['*.config.ts', '*.config.js'], placeholder: '______', hint: 'Glob pattern matching vite.config.ts, tailwind.config.js, etc.' },
      ],
      explanation: 'The find command is your first reconnaissance tool. Use it to discover what files exist, where components live, and what config files control the project. This gives you a map of the project before you ask the agent to change anything.',
      platforms: {
        windows: {
          instruction: 'Complete these PowerShell commands to map the project structure. Get-ChildItem shows you what files exist and where they live.',
          language: 'powershell',
          template: '# See all TypeScript/React files\nGet-ChildItem -Recurse -Filter "{{tsx_pattern}}" | Select-Object -First 20\n\n# Find component files specifically\nGet-ChildItem -Path "./src/{{components_dir}}" -Filter "*.tsx"\n\n# Find config files at the root\nGet-ChildItem -Filter "{{config_pattern}}"\n\n# Find test files\nGet-ChildItem -Recurse -Filter "*.test.*"; Get-ChildItem -Recurse -Filter "*.spec.*"',
          blanks: [
            { id: 'tsx_pattern', answer: '*.tsx', alternatives: ['*.TSX'], placeholder: '______', hint: 'The glob pattern for TypeScript React files' },
            { id: 'components_dir', answer: 'components', alternatives: ['Components'], placeholder: '______', hint: 'The standard directory for React components' },
            { id: 'config_pattern', answer: '*.config.*', alternatives: ['*.config.ts', '*.config.js'], placeholder: '______', hint: 'Glob pattern matching vite.config.ts, tailwind.config.js, etc.' },
          ],
          explanation: 'Get-ChildItem (alias: gci, ls, dir) is PowerShell\'s file search tool. Use -Recurse to search subdirectories and -Filter for pattern matching. This gives you a map of the project before you ask the agent to change anything.',
        },
      },
    },
    {
      type: 'terminal',
      instruction: 'Use this command to see all the TypeScript React files in your project. This helps you understand what already exists before asking AI to create something new:',
      expectedCommand: 'find . -name "*.tsx" | head -20',
      hint: 'Use find with -name to match the .tsx extension, pipe to head to limit output',
      platforms: {
        windows: {
          instruction: 'Use this command to see all the TypeScript React files in your project. This helps you understand what already exists before asking AI to create something new:',
          expectedCommand: 'Get-ChildItem -Recurse -Filter "*.tsx" | Select-Object -First 20',
          hint: 'Use Get-ChildItem -Recurse to search recursively, pipe to Select-Object to limit output',
        },
      },
    },
    {
      type: 'code-fill',
      instruction: 'Complete these grep commands to discover project patterns. Once you know what files exist, grep tells you how they work.',
      language: 'bash',
      filename: 'terminal',
      template: '# How are components exported?\ngrep -r "{{export_pattern}}" src/components/ | head -10\ngrep -r "export function" src/components/ | head -10\n\n# What routing library is used?\ngrep -r "import.*from.*{{router_search}}" src/ | head -5\n\n# What state management exists?\ngrep -r "createContext\\|useContext\\|zustand\\|{{state_lib}}" src/ | head -10',
      blanks: [
        { id: 'export_pattern', answer: 'export default', alternatives: ['export default function'], placeholder: '______', hint: 'The keyword combo for default exports' },
        { id: 'router_search', answer: 'router', alternatives: ['Router'], placeholder: '______', hint: 'Keyword found in routing library import paths' },
        { id: 'state_lib', answer: 'redux', alternatives: ['Redux', 'jotai', 'recoil'], placeholder: '______', hint: 'A popular state management library for React' },
      ],
      explanation: 'Grep is your second reconnaissance tool. It reveals the conventions your project follows: how components are exported, which libraries are used for routing and state, and what patterns exist. This is essential context for writing informed prompts.',
      platforms: {
        windows: {
          instruction: 'Complete these Select-String commands to discover project patterns. Once you know what files exist, Select-String tells you how they work.',
          language: 'powershell',
          template: '# How are components exported?\nSelect-String -Recurse -Path "src/components/" -Pattern "{{export_pattern}}" | Select-Object -First 10\nSelect-String -Recurse -Path "src/components/" -Pattern "export function" | Select-Object -First 10\n\n# What routing library is used?\nSelect-String -Recurse -Path "src/" -Pattern "import.*from.*{{router_search}}" | Select-Object -First 5\n\n# What state management exists?\nSelect-String -Recurse -Path "src/" -Pattern "createContext|useContext|zustand|{{state_lib}}" | Select-Object -First 10',
          blanks: [
            { id: 'export_pattern', answer: 'export default', alternatives: ['export default function'], placeholder: '______', hint: 'The keyword combo for default exports' },
            { id: 'router_search', answer: 'router', alternatives: ['Router'], placeholder: '______', hint: 'Keyword found in routing library import paths' },
            { id: 'state_lib', answer: 'redux', alternatives: ['Redux', 'jotai', 'recoil'], placeholder: '______', hint: 'A popular state management library for React' },
          ],
          explanation: 'Select-String (alias: sls) is PowerShell\'s text search tool. It reveals the conventions your project follows: how components are exported, which libraries are used for routing and state, and what patterns exist.',
        },
      },
    },
    {
      type: 'terminal',
      instruction: 'Use this command to see how existing components are set up. This tells you the patterns your project follows:',
      expectedCommand: 'grep -r "export default" src/components/ | head -10',
      hint: 'Use grep -r to search recursively through the components directory',
      platforms: {
        windows: {
          instruction: 'Use this command to see how existing components are set up. This tells you the patterns your project follows:',
          expectedCommand: 'Select-String -Recurse -Path "src/components/" -Pattern "export default" | Select-Object -First 10',
          hint: 'Use Select-String -Recurse to search recursively through the components directory',
        },
      },
    },
    {
      type: 'code-fill',
      instruction: 'Complete these read commands. These anchor files tell you more about the project than any other source.',
      language: 'bash',
      filename: 'terminal',
      template: '# Project dependencies and scripts\ncat {{deps_file}}\n\n# Project-specific AI instructions\ncat {{ai_file}}\n\n# Routing configuration\ncat src/routes.tsx\n\n# An existing component (to match its pattern)\ncat src/components/Dashboard.tsx\n\n# Global styles and theme\ncat src/{{styles_file}}',
      blanks: [
        { id: 'deps_file', answer: 'package.json', alternatives: ['Package.json'], placeholder: '______', hint: 'The file that lists project dependencies and scripts' },
        { id: 'ai_file', answer: 'CLAUDE.md', alternatives: ['claude.md'], placeholder: '______', hint: 'The project-specific AI instructions file' },
        { id: 'styles_file', answer: 'globals.css', alternatives: ['global.css', 'index.css', 'app.css'], placeholder: '______', hint: 'The global stylesheet for the project' },
      ],
      explanation: 'Reading anchor files is your third reconnaissance tool. package.json reveals the tech stack, CLAUDE.md has project-specific rules, and existing components show the patterns you need to match. Read before you prompt.',
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
      type: 'interactive-diagram',
      title: 'Blind vs Informed Generation',
      body: 'Click through to see how the same task produces very different results depending on whether you read the codebase first.',
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
      stages: [
        {
          highlightNodes: ['task'],
          highlightEdges: [],
          explanation: 'You have a task: "Add a settings page." The same task will produce dramatically different results depending on what you do next.',
        },
        {
          highlightNodes: ['task', 'decision'],
          highlightEdges: [{ from: 'task', to: 'decision' }],
          explanation: 'The critical fork: do you read the codebase first, or skip straight to prompting? This single decision determines whether the agent output fits your project or fights it.',
        },
        {
          highlightNodes: ['decision', 'blind'],
          highlightEdges: [{ from: 'decision', to: 'blind' }],
          explanation: 'Skip reading: the agent guesses. It picks React Router (you use TanStack), Tailwind (you use styled-components), creates a new AuthContext (you already have one). Result: conflicts, bugs, wasted time fixing assumptions.',
        },
        {
          highlightNodes: ['decision', 'informed'],
          highlightEdges: [{ from: 'decision', to: 'informed' }],
          explanation: 'Read first: the agent follows your blueprint. It uses your router, your styling approach, your existing auth context, your component patterns. Result: clean code that fits on the first try.',
        },
      ],
    },

    // === CONTEXT-AWARE PROMPTS ===
    {
      type: 'multiple-choice',
      question: 'What makes a "context-aware prompt" different from a regular prompt?',
      options: [
        'It uses more polite language',
        'It references specific files, patterns, and conventions discovered by reading the codebase',
        'It is longer than 500 words',
        'It includes the entire source code of the project',
      ],
      correctIndex: 1,
      explanation: 'Once you have read the codebase, you feed that knowledge into your prompt. A context-aware prompt tells the agent what patterns to follow, what components to reuse, and what conventions to match. The agent goes from guessing to following a blueprint.',
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
    {
      type: 'compare',
      title: 'Blind prompt vs informed prompt',
      body: 'The same task produces very different results depending on whether you read the codebase first.',
      question: 'Which prompt will produce code that matches existing project patterns?',
      correctSide: 'right',
      left: {
        label: 'Blind',
        content: '"Add a navbar component with links to Home, About, and Contact pages."',
        language: 'text',
      },
      right: {
        label: 'Informed',
        content: '"Add a navbar component at src/components/navbar.tsx. Use the existing Button component from @/components/ui/button. Follow the project pattern of named exports. Route paths are /, /about, /contact as defined in src/routes.tsx."',
        language: 'text',
      },
      explanation: 'The informed prompt references specific files, existing components, and project conventions. The agent can build something that fits the codebase instead of guessing.',
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
      platforms: {
        windows: {
          instruction: 'Now find all existing pages in your project to see where they live and how they are named:',
          expectedCommand: 'Get-ChildItem -Path "./src/pages" -Filter "*.tsx"',
          hint: 'Use Get-ChildItem to list .tsx files in the pages directory',
        },
      },
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
