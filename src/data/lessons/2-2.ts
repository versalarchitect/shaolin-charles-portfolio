import type { LessonContent } from './types'

const content: LessonContent = {
  lessonId: '2-2',
  steps: [
    // === INTRODUCTION ===
    {
      type: 'info',
      title: 'You make the decisions, AI does the building',
      body: "The skill here is NOT knowing how to code. If you could code it yourself, you would not need this course. The skill is knowing enough about how apps are structured to evaluate whether the AI made good choices — and knowing how to redirect it when it did not. You are a director reviewing decisions, not a builder writing code.",
    },
    {
      type: 'info',
      title: 'What "directing a scaffold" means',
      body: "Scaffolding is the initial project structure: folders, config files, routing setup, layout hierarchy, package dependencies. The agent generates all of it. Your job is to give it the right constraints upfront (via your spec), then review what it produces. You are looking for structural correctness — not code quality at this stage. Does the routing match the spec? Are server and client components used appropriately? Is the layout hierarchy logical?",
    },

    // === SCAFFOLD PROMPTS ===
    {
      type: 'multiple-choice',
      question: 'When directing an agent to scaffold a project, which of the following should you NOT specify in your prompt?',
      options: [
        'The framework and version (e.g., Next.js 15, App Router)',
        'File naming conventions and import ordering',
        'The routing structure (what pages exist)',
        'Key packages (ORM, styling, auth)',
      ],
      correctIndex: 1,
      explanation: 'File naming conventions, import ordering, and boilerplate config are things the agent already knows. Specify the expensive decisions: framework version, routing structure, data requirements per route, shared layouts, and key packages. Let the agent handle what it already knows — micromanaging cheap details wastes your time and context window.',
    },
    {
      type: 'compare',
      title: 'What to specify vs what to leave to the agent',
      body: 'A scaffold prompt should constrain decisions that are expensive to change later, but leave implementation details to the agent.',
      question: 'Which side contains the right things to specify?',
      correctSide: 'left',
      left: {
        label: 'Specify these',
        content: '✓ Rendering strategy (Server vs Client)\n✓ Layout hierarchy (which pages nest)\n✓ Component organization (feature-based)\n✓ Data fetching pattern (server actions)\n✓ State management approach',
        language: 'text',
      },
      right: {
        label: 'Leave to the agent',
        content: '✗ Exact CSS class names\n✗ Variable naming in components\n✗ Import ordering\n✗ Whether to use arrow or function syntax\n✗ Comment placement',
        language: 'text',
      },
      explanation: 'Architectural decisions (left) are expensive to change after the scaffold is built. Implementation details (right) are cheap to adjust later. Focus your spec on the expensive decisions.',
    },
    {
      type: 'code-fill',
      instruction: 'This prompt gives Claude Code enough to scaffold correctly. Complete the missing route specifications and rendering decisions.',
      language: 'text',
      filename: 'scaffold-prompt.txt',
      template: 'Create a Next.js 15 app with App Router. TypeScript, Tailwind CSS.\n\nRoutes:\n- / (landing page, static)\n- /dashboard (authenticated, {{dashboard_rendering}}, fetches user data)\n- /dashboard/bookmarks (list view, server component, fetches from DB)\n- /dashboard/bookmarks/[id] (detail view, dynamic route)\n- /settings ({{settings_rendering}}, form interactions)\n\nLayouts:\n- Root layout: global styles, fonts, metadata\n- /dashboard layout: sidebar nav, auth check wrapper\n\nPackages: {{database_package}}, next-auth for session.\n\nUse server components by default. Only use client components\nwhere user interaction requires it (forms, toggles, modals).',
      blanks: [
        { id: 'dashboard_rendering', answer: 'server component', alternatives: ['Server Component', 'server-component', 'SC'], placeholder: 'rendering strategy?', hint: 'The dashboard fetches data on load — no interactivity needed' },
        { id: 'settings_rendering', answer: 'client component', alternatives: ['Client Component', 'client-component', 'CC'], placeholder: 'rendering strategy?', hint: 'Forms with toggles need client-side state (useState)' },
        { id: 'database_package', answer: 'Drizzle ORM + SQLite', alternatives: ['Drizzle ORM + SQLite', 'drizzle-orm + sqlite', 'Drizzle + SQLite'], placeholder: 'which DB stack?', hint: 'A TypeScript ORM paired with a lightweight file-based database' },
      ],
      explanation: 'Dashboard fetches data without interactivity = server component. Settings has form toggles = client component. Naming the exact database package prevents the agent from evaluating alternatives.',
    },
    {
      type: 'checkpoint',
      xp: 2,
      message: 'Scaffold prompt crafted!',
    },

    // === CREATE NEXT APP ===
    {
      type: 'multiple-choice',
      question: 'You want the agent to scaffold a Next.js project from scratch. Which approach is correct?',
      options: [
        'Always run create-next-app yourself first, then invite the agent',
        'Always let the agent run create-next-app — it knows the right flags',
        'Either works — but if the agent runs it, specify the flags you care about in your prompt',
        'Skip create-next-app entirely and have the agent create files manually',
      ],
      correctIndex: 2,
      explanation: 'Both approaches work. If the agent runs create-next-app, specify the flags that matter to you (--typescript, --tailwind, --app, --src-dir). If you have preferences about ESLint config or import aliases, state them explicitly. The agent will make reasonable defaults for anything you do not specify.',
    },
    {
      type: 'terminal',
      instruction: 'Run the create-next-app command with TypeScript, Tailwind, and App Router:',
      expectedCommand: 'npx create-next-app@latest --typescript --tailwind --app',
      hint: 'Use npx create-next-app@latest with the --typescript, --tailwind, and --app flags',
    },
    {
      type: 'code-fill',
      instruction: 'If you want the agent to handle everything including the initial create command, complete this scaffold prompt with the right technology choices.',
      language: 'text',
      filename: 'full-scaffold-prompt.txt',
      template: 'Create a new Next.js 15 project called "bookmark-app" in the\ncurrent directory. Use:\n- {{type_system}} strict\n- {{css_framework}}\n- App Router with src/ directory\n- ESLint with the default Next.js config\n\nAfter creating, set up the route structure from my spec\nand install {{orm_package}} with better-sqlite3.',
      blanks: [
        { id: 'type_system', answer: 'TypeScript', alternatives: ['typescript', 'TS'], placeholder: 'which type system?', hint: 'The strict type system for JavaScript' },
        { id: 'css_framework', answer: 'Tailwind CSS', alternatives: ['Tailwind', 'tailwindcss'], placeholder: 'which CSS framework?', hint: 'Utility-first CSS framework' },
        { id: 'orm_package', answer: 'Drizzle ORM', alternatives: ['drizzle-orm', 'Drizzle'], placeholder: 'which ORM?', hint: 'The TypeScript ORM from your spec' },
      ],
      explanation: 'Naming exact packages in the scaffold prompt prevents the agent from evaluating alternatives. TypeScript strict catches more bugs. Tailwind CSS and Drizzle ORM are architectural decisions that affect every file in the project.',
    },

    // === RENDERING STRATEGY ===
    {
      type: 'compare',
      title: 'Server Components vs Client Components',
      body: 'The most important architectural decision in a Next.js app. The agent must choose correctly per route — your job is to verify.',
      question: 'A page that fetches bookmarks from a database and displays them as a list — which rendering is correct?',
      correctSide: 'left',
      left: {
        label: 'Server Component',
        content: '✓ Renders on the server\n✓ No client-side JavaScript\n✓ Direct database/API access\n✓ Faster initial load\n\nBest for: data display, static\ncontent, pages without user\ninteraction.',
        language: 'text',
      },
      right: {
        label: 'Client Component',
        content: '✓ Renders on the client\n✓ Supports useState, useEffect\n✓ Event handlers, form state\n✓ Real-time interactivity\n\nBest for: forms, toggles, modals,\nreal-time updates, anything that\nneeds user interaction.',
        language: 'text',
      },
      explanation: 'A read-only data display page is a textbook Server Component. The most common agent mistake is making everything a client component because it is "safer" — it works, but ships unnecessary JavaScript. Ask: does this route need interactivity? If not, it is a server component.',
    },
    {
      type: 'multiple-choice',
      question: 'A page fetches data AND has an interactive delete button. What is the correct pattern?',
      options: [
        'Make the entire page a client component',
        'Make the entire page a server component and use server actions for delete',
        'Server component at the page level with a small client component for the delete button',
        'Create an API route for the data and a separate API route for delete',
      ],
      correctIndex: 2,
      explanation: 'The correct pattern is "server page with client islands." The page is a server component that fetches data directly. Interactive elements (like a delete button) are extracted into small client component children. This gives you server-side performance with client-side interactivity where needed.',
    },
    {
      type: 'multiple-choice',
      question: 'A /dashboard page fetches user bookmarks from a database and displays them as a static list. What rendering strategy is correct?',
      options: [
        'Client component with useEffect to fetch data on mount',
        'Server component that queries the database directly',
        'Client component with server action for data fetching',
        'Static generation at build time with getStaticProps',
      ],
      correctIndex: 1,
      explanation: 'A page that fetches data and displays it without interactivity is the textbook case for a Server Component. It can query the database directly (no API route needed), sends zero JavaScript to the client, and renders faster. useEffect fetching is the React 18 pattern — Next.js App Router makes it unnecessary for read-only data display.',
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'Rendering strategy clear!',
    },

    // === WORKFLOW DIAGRAM ===
    {
      type: 'interactive-diagram',
      title: 'Directing a Scaffold',
      body: 'The review loop: you specify, the agent builds, you evaluate, and you redirect or accept. Click through each stage.',
      diagram: {
        direction: 'LR',
        nodes: [
          { id: 'spec', label: 'Spec Requirements', sublabel: 'Routes, layouts, data', shape: 'pill' },
          { id: 'scaffold', label: 'Agent Scaffolds', sublabel: 'Files + config', shape: 'rect', highlight: true },
          { id: 'review', label: 'You Review', sublabel: 'Structure check', shape: 'diamond' },
          { id: 'redirect', label: 'Redirect', sublabel: 'Fix decisions', shape: 'rect' },
          { id: 'accept', label: 'Accept', sublabel: 'Move forward', shape: 'pill', highlight: true },
        ],
        edges: [
          { from: 'spec', to: 'scaffold' },
          { from: 'scaffold', to: 'review' },
          { from: 'review', to: 'accept', label: 'correct' },
          { from: 'review', to: 'redirect', label: 'wrong', dashed: true },
          { from: 'redirect', to: 'scaffold' },
        ],
      },
      stages: [
        {
          highlightNodes: ['spec'],
          highlightEdges: [{ from: 'spec', to: 'scaffold' }],
          explanation: 'Start with your spec: routes, layouts, rendering strategy, and key packages. This is your input to the agent.',
        },
        {
          highlightNodes: ['scaffold'],
          highlightEdges: [{ from: 'scaffold', to: 'review' }],
          explanation: 'The agent generates the project structure — folders, config files, page components, layout hierarchy. This happens in seconds.',
        },
        {
          highlightNodes: ['review'],
          explanation: 'You review the generated structure against your spec. Check rendering strategy, layout nesting, and route correctness.',
        },
        {
          highlightNodes: ['review', 'accept'],
          highlightEdges: [{ from: 'review', to: 'accept' }],
          explanation: 'If the structure matches your spec, accept it and move to implementation. No changes needed.',
        },
        {
          highlightNodes: ['review', 'redirect', 'scaffold'],
          highlightEdges: [{ from: 'review', to: 'redirect' }, { from: 'redirect', to: 'scaffold' }],
          explanation: 'If you find problems (wrong component type, missing layouts, bad data pattern), redirect with a precise correction. The agent rebuilds and you review again.',
        },
      ],
    },

    // === REDIRECTING THE AGENT ===
    {
      type: 'match',
      instruction: 'Match each scaffold problem to the correct redirect instruction:',
      leftItems: ['Agent added "use client" to a data-only page', 'Agent created API routes instead of server actions', 'Layout hierarchy is flat instead of nested', 'Agent made every component a client component'],
      rightItems: ['Move shared UI into dashboard/layout.tsx to wrap child routes', 'Remove "use client", use direct DB query in the component body', 'Remove API routes, create actions.ts with "use server" directive', 'Keep page as server component, extract only interactive elements to client children'],
      correctPairs: { 0: 1, 1: 2, 2: 0, 3: 3 },
      explanation: 'Each redirect is surgical and specific: name the file, state what is wrong, and describe the fix. Redirecting is not failure — it is the normal workflow. The skill is identifying the problem quickly.',
    },
    {
      type: 'code-fill',
      instruction: 'The agent created API routes instead of server actions. Complete this redirect prompt with the correct fix.',
      language: 'text',
      filename: 'redirect-prompt.txt',
      template: 'The spec says "server actions for mutations." You created\nAPI routes at src/app/api/bookmarks/route.ts. Remove those.\n\nInstead, create server actions in src/app/dashboard/bookmarks/\nactions.ts using "{{server_directive}}". The form in the add-bookmark\ncomponent should call the server action directly via the\n{{form_prop}} prop or useFormAction.',
      blanks: [
        { id: 'server_directive', answer: 'use server', alternatives: ['"use server"', 'use server'], placeholder: 'which directive?', hint: 'The directive that marks a file as containing server actions' },
        { id: 'form_prop', answer: 'action', alternatives: ['action'], placeholder: 'which form prop?', hint: 'The HTML form attribute that accepts a server action function' },
      ],
      explanation: 'Server actions use the "use server" directive and are called directly from form action props. This eliminates the need for API routes and manual fetch calls for mutations.',
    },
    {
      type: 'multiple-choice',
      question: 'The agent scaffolded /settings as a server component. The page contains a form where users toggle notification preferences. Is this correct?',
      options: [
        'Yes — forms can work in server components via server actions',
        'No — a page with toggles and form state needs "use client" for interactivity',
        'It depends on whether the form uses controlled or uncontrolled inputs',
        'Yes — you should always prefer server components',
      ],
      correctIndex: 1,
      explanation: 'Toggles require client-side state (useState) to reflect on/off visually as the user interacts. While the form submission can use a server action, the interactive toggle component itself needs "use client". The page-level component or a child component must be a client component to handle the toggle state.',
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'Redirect instincts sharpened!',
    },

    // === LAYOUT HIERARCHY ===
    {
      type: 'multiple-choice',
      question: 'The agent put the sidebar navigation in the root layout (app/layout.tsx). The landing page at "/" now incorrectly shows the sidebar. What is the correct fix?',
      options: [
        'Add a conditional to hide the sidebar on the landing page',
        'Move the sidebar to app/dashboard/layout.tsx so it only wraps /dashboard/* pages',
        'Create a separate layout for the landing page',
        'Remove layouts entirely and put the sidebar in each page component',
      ],
      correctIndex: 1,
      explanation: 'Layouts in Next.js App Router are nested by default. A layout at app/dashboard/layout.tsx wraps all pages under /dashboard/*. Shared UI like sidebars and auth wrappers belong in section-specific layouts, not the root layout. Putting everything in root makes it impossible to have different layouts per section.',
    },
    {
      type: 'code-fill',
      instruction: 'Verify the agent produces the correct layout hierarchy. Complete the missing rendering annotations for each page.',
      language: 'text',
      filename: 'expected-structure.txt',
      template: 'src/app/\n├── layout.tsx          ← Root: html, body, fonts, global providers\n├── page.tsx            ← Landing page (no sidebar)\n├── dashboard/\n│   ├── layout.tsx      ← Dashboard: sidebar + auth wrapper\n│   ├── page.tsx        ← Dashboard home\n│   ├── bookmarks/\n│   │   ├── page.tsx    ← Bookmark list ({{bookmarks_type}})\n│   │   └── [id]/\n│   │       └── page.tsx ← Bookmark detail (dynamic)\n│   └── settings/\n│       └── page.tsx    ← Settings form ({{settings_type}})\n└── globals.css',
      blanks: [
        { id: 'bookmarks_type', answer: 'server component', alternatives: ['Server Component', 'server-component', 'SC'], placeholder: 'rendering type?', hint: 'This page only displays data fetched from the database' },
        { id: 'settings_type', answer: 'client component', alternatives: ['Client Component', 'client-component', 'CC'], placeholder: 'rendering type?', hint: 'This page has form toggles that need useState' },
      ],
      explanation: 'Bookmark list displays data without interactivity = server component. Settings form has toggles requiring client state = client component. Verifying rendering strategy per page is the most important scaffold review step.',
    },
    {
      type: 'order',
      instruction: 'Order the steps of directing an agent through a scaffold:',
      items: [
        'Redirect incorrect architectural decisions',
        'Review generated structure against spec',
        'Write the scaffold prompt with routes and constraints',
        'Accept the structure and move to implementation',
        'Agent generates project files',
      ],
      correctOrder: [2, 4, 1, 0, 3],
    },

    // === VERIFICATION ===
    {
      type: 'multiple-choice',
      question: 'After the agent scaffolds your project, what is the FIRST thing you should verify?',
      options: [
        'Code quality and variable naming',
        'That the file structure matches your spec routes and rendering strategy is correct per page',
        'That all CSS classes are applied correctly',
        'That tests are passing',
      ],
      correctIndex: 1,
      explanation: 'Structural correctness comes first: check that routes match your spec, rendering strategy (server vs client) is correct per page, package.json has the right dependencies, and the dev server starts without errors. This takes 2 minutes and catches problems before you build features on a broken foundation.',
    },
    {
      type: 'terminal',
      instruction: 'After scaffolding, verify the project starts without errors:',
      expectedCommand: 'npm run dev',
      hint: 'The standard Next.js dev command',
    },
    {
      type: 'code-fill',
      instruction: 'You can ask Claude Code to self-verify the scaffold. Complete this verification prompt with the right checks.',
      language: 'text',
      filename: 'verify-prompt.txt',
      template: 'Review the project structure you just created against my spec.\nFor each route in the spec, confirm:\n1. The file exists at the correct path\n2. The {{rendering_check}} is correct (server vs client)\n3. The {{hierarchy_check}} matches the nesting I specified\n\nList any discrepancies.',
      blanks: [
        { id: 'rendering_check', answer: 'rendering strategy', alternatives: ['rendering strategy', 'component type', 'rendering type'], placeholder: 'what to check per route?', hint: 'Whether each page is a server or client component' },
        { id: 'hierarchy_check', answer: 'layout hierarchy', alternatives: ['layout hierarchy', 'layout nesting', 'layouts'], placeholder: 'what structural check?', hint: 'Which layouts wrap which pages' },
      ],
      explanation: 'A self-verification prompt makes the agent audit its own output. The three checks — file paths, rendering strategy, and layout hierarchy — are the most common sources of scaffold errors.',
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'Verification workflow locked in!',
    },

    // === COMMON PATTERNS ===
    {
      type: 'code-fill',
      instruction: 'The most common correct pattern: server component page that fetches data, with small client component children for interactivity. Complete the missing parts of this implementation.',
      language: 'typescript',
      filename: 'src/app/dashboard/bookmarks/page.tsx',
      template: "import { db } from '@/db'\nimport { bookmarks } from '@/db/schema'\nimport { DeleteButton } from './delete-button' // client component\n\nexport default {{function_keyword}} function BookmarksPage() {\n  const allBookmarks = await db.{{query_method}}().from(bookmarks)\n\n  return (\n    <div>\n      <h1>Bookmarks</h1>\n      {allBookmarks.map((b) => (\n        <div key={b.id}>\n          <a href={b.url}>{b.title}</a>\n          <DeleteButton id={b.id} />\n        </div>\n      ))}\n    </div>\n  )\n}",
      blanks: [
        { id: 'function_keyword', answer: 'async', alternatives: ['async'], placeholder: 'what keyword?', hint: 'Server components can use this keyword to await data directly' },
        { id: 'query_method', answer: 'select', alternatives: ['select'], placeholder: 'which Drizzle method?', hint: 'The SQL operation that reads rows from a table' },
      ],
      explanation: 'Server components can be async — they await data directly in the component body, no useEffect needed. The DeleteButton is a separate client component because it needs onClick interactivity. The page passes data down as props.',
    },
    {
      type: 'multiple-choice',
      question: 'The agent created a single BookmarkList client component that fetches data with useEffect AND handles delete interactions. What is the correct redirect?',
      options: [
        'Leave it — client components can fetch data too',
        'Split it: server component page for data fetching, client component DeleteButton for the interaction',
        'Convert everything to server components and use server actions for delete',
        'Add a loading.tsx file to handle the loading state',
      ],
      correctIndex: 1,
      explanation: 'The correct pattern is to keep the page as a server component (direct DB access, no loading state needed, no client JS) and extract only the interactive delete button into a small client component. This gives you the best of both worlds: server performance + client interactivity.',
    },

    // === ADVANCED CONSIDERATIONS ===
    {
      type: 'match',
      instruction: 'Apply the cost-of-change heuristic. Match each decision to how expensive it is to change later:',
      leftItems: ['Routing structure and URL paths', 'Server vs client component boundaries', 'Component file naming', 'Tailwind CSS classes', 'Layout nesting hierarchy'],
      rightItems: ['Trivial — find and replace', 'Cheap — search and rename', 'Moderate — move files, update shared state', 'Expensive — restructuring cascades through the app', 'Expensive — affects URLs, navigation, data flow'],
      correctPairs: { 0: 4, 1: 3, 2: 1, 3: 0, 4: 2 },
      explanation: 'Lock down the expensive decisions (routing, rendering strategy) in your spec. Leave cheap decisions (naming, CSS classes) to the agent. The cost-of-change heuristic tells you where to focus your attention as a director.',
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'Judgment boundaries set!',
    },

    // === FINAL EXERCISES ===
    {
      type: 'code-input',
      instruction: 'In Next.js App Router, what directive do you put at the top of a file to make it a client component?',
      placeholder: 'Enter the directive string',
      answer: '"use client"',
      hint: 'It is a string literal at the top of the file, starting with "use"',
    },
    {
      type: 'order',
      instruction: 'Rank these decisions from MOST expensive to change (first) to LEAST expensive (last):',
      items: [
        'Component CSS classes',
        'Routing structure and URL paths',
        'Layout nesting hierarchy',
        'Variable and function names',
        'Server vs client component boundaries',
      ],
      correctOrder: [1, 4, 2, 3, 0],
    },
    {
      type: 'multiple-choice',
      question: 'You direct the agent to scaffold an app. It creates API routes for all data fetching instead of using server components with direct DB access. What do you do?',
      options: [
        'Accept it — API routes work fine for data fetching',
        'Redirect: remove API routes, make data-display pages server components with direct DB queries',
        'Ask the agent to explain its decision before redirecting',
        'Rewrite the entire spec to be more explicit about data fetching patterns',
      ],
      correctIndex: 1,
      explanation: 'If your spec says "server components for data display" or implies it through the architecture, redirect immediately. API routes add unnecessary network hops for server-rendered pages that can query the DB directly. A clear, targeted redirect is faster than asking for explanations or rewriting the spec.',
    },
    {
      type: 'checklist',
      title: 'Full-stack architecture direction checklist:',
      items: [
        'I can write a scaffold prompt that specifies routes, layouts, and rendering strategy',
        'I know when to use server components vs client components',
        'I can identify and redirect incorrect rendering decisions',
        'I understand the server-page-with-client-islands pattern',
        'I know which decisions to control and which to leave to the agent',
        'I can verify a scaffold matches my spec before building features',
        'I use the cost-of-change heuristic to prioritize my attention',
      ],
    },
    {
      type: 'checkpoint',
      xp: 14,
      message: 'Architecture direction mastered! You can guide AI to set up entire application structures.',
    },
  ],
}

export default content
