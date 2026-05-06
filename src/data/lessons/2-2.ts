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
      type: 'info',
      title: 'What to tell the agent',
      body: "When directing a scaffold, specify: the framework and version (Next.js 15, App Router), the routing structure (what pages exist), data requirements per route (which pages need server-side data), shared layouts (what wraps what), and key packages (ORM, styling, auth). Do NOT specify: file naming conventions (the agent knows Next.js conventions), internal folder organization within components, import ordering, or boilerplate config. Let the agent handle what it already knows.",
    },
    {
      type: 'code-demo',
      title: 'A good scaffold prompt',
      body: 'This prompt gives Claude Code enough to scaffold correctly without micromanaging file names or boilerplate.',
      language: 'text',
      filename: 'scaffold-prompt.txt',
      code: "Create a Next.js 15 app with App Router. TypeScript, Tailwind CSS.\n\nRoutes:\n- / (landing page, static)\n- /dashboard (authenticated, server component, fetches user data)\n- /dashboard/bookmarks (list view, server component, fetches from DB)\n- /dashboard/bookmarks/[id] (detail view, dynamic route)\n- /settings (client component, form interactions)\n\nLayouts:\n- Root layout: global styles, fonts, metadata\n- /dashboard layout: sidebar nav, auth check wrapper\n\nPackages: Drizzle ORM + SQLite, next-auth for session.\n\nUse server components by default. Only use client components\nwhere user interaction requires it (forms, toggles, modals).",
    },
    {
      type: 'checkpoint',
      xp: 2,
      message: 'Scaffold prompt crafted!',
    },

    // === CREATE NEXT APP ===
    {
      type: 'info',
      title: 'The initial command',
      body: "Most scaffold sessions start with create-next-app. You can either let the agent run it, or run it yourself first and then invite the agent into the existing project. Both work. If you let the agent run it, specify the flags you care about in your prompt. The agent will typically choose: --typescript, --tailwind, --app, --src-dir. If you have preferences about ESLint config or import aliases, state them explicitly.",
    },
    {
      type: 'terminal',
      instruction: 'Run the create-next-app command with TypeScript, Tailwind, and App Router:',
      expectedCommand: 'npx create-next-app@latest --typescript --tailwind --app',
      hint: 'Use npx create-next-app@latest with the --typescript, --tailwind, and --app flags',
    },
    {
      type: 'code-demo',
      title: 'Telling the agent to scaffold from scratch',
      body: 'If you want the agent to handle everything including the initial create command, your prompt might look like this.',
      language: 'text',
      filename: 'full-scaffold-prompt.txt',
      code: "Create a new Next.js 15 project called \"bookmark-app\" in the\ncurrent directory. Use:\n- TypeScript strict\n- Tailwind CSS\n- App Router with src/ directory\n- ESLint with the default Next.js config\n\nAfter creating, set up the route structure from my spec\nand install Drizzle ORM with better-sqlite3.",
    },

    // === RENDERING STRATEGY ===
    {
      type: 'info',
      title: 'Evaluating rendering decisions',
      body: "The most important architectural decision in a Next.js app is the rendering strategy per route. Server Components render on the server, have no client-side JavaScript, and can directly access databases and APIs. Client Components render on the client, support interactivity (useState, useEffect, event handlers), and ship JavaScript to the browser. The agent must choose correctly per route. Your job is to verify these choices match your spec's data and interaction requirements.",
    },
    {
      type: 'info',
      title: 'The decision framework',
      body: "Ask: does this route need interactivity (forms, real-time updates, toggles)? If yes, it needs client components — at least partially. Does it fetch data on load? Server component. Does it do both? Server component at the page level with client component islands for the interactive parts. The most common agent mistake is making everything a client component because it is \"safer\" — it works, but it ships unnecessary JavaScript and loses the performance benefits of server rendering.",
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
      type: 'diagram',
      title: 'Directing a Scaffold',
      body: 'The review loop: you specify, the agent builds, you evaluate, and you redirect or accept.',
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
    },

    // === REDIRECTING THE AGENT ===
    {
      type: 'info',
      title: 'When to redirect',
      body: "You review the generated structure and find a problem. Maybe the agent put \"use client\" on a page that only fetches data. Maybe it created API routes when your spec said server actions. Maybe the layout hierarchy is flat when it should be nested. Redirecting is not failure — it is the normal workflow. The skill is identifying the problem quickly and giving a precise correction.",
    },
    {
      type: 'code-demo',
      title: 'Redirect: wrong component type',
      body: 'The agent made the bookmarks list page a client component. Here is how you redirect it.',
      language: 'text',
      filename: 'redirect-prompt.txt',
      code: "The bookmarks list page (src/app/dashboard/bookmarks/page.tsx)\nshould be a server component, not a client component. It only\ndisplays data — there is no interactivity on this page.\n\nRemove \"use client\", move the data fetch into the component\nbody (direct DB query via Drizzle), and remove the useEffect\n+ useState pattern. The data should be fetched at render time\non the server.",
    },
    {
      type: 'code-demo',
      title: 'Redirect: wrong data pattern',
      body: 'The agent created API routes for mutations. Your spec said server actions. Here is the correction.',
      language: 'text',
      filename: 'redirect-prompt-2.txt',
      code: "The spec says \"server actions for mutations.\" You created\nAPI routes at src/app/api/bookmarks/route.ts. Remove those.\n\nInstead, create server actions in src/app/dashboard/bookmarks/\nactions.ts using \"use server\". The form in the add-bookmark\ncomponent should call the server action directly via the\naction prop or useFormAction.",
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
      type: 'info',
      title: 'Evaluating layout hierarchy',
      body: "Layouts in Next.js App Router are nested by default. A layout at app/dashboard/layout.tsx wraps all pages under /dashboard/*. This is where you put shared UI: sidebars, navigation, auth wrappers. The agent should create layouts that match your spec's shared UI requirements. Common mistakes: putting everything in the root layout (making it impossible to have different layouts per section), or not creating layouts at all (duplicating sidebar code in every page).",
    },
    {
      type: 'code-demo',
      title: 'Expected layout hierarchy',
      body: 'For the bookmark app spec, this is the correct layout nesting. Verify the agent produces something equivalent.',
      language: 'text',
      filename: 'expected-structure.txt',
      code: "src/app/\n├── layout.tsx          ← Root: html, body, fonts, global providers\n├── page.tsx            ← Landing page (no sidebar)\n├── dashboard/\n│   ├── layout.tsx      ← Dashboard: sidebar + auth wrapper\n│   ├── page.tsx        ← Dashboard home\n│   ├── bookmarks/\n│   │   ├── page.tsx    ← Bookmark list (server component)\n│   │   └── [id]/\n│   │       └── page.tsx ← Bookmark detail (dynamic)\n│   └── settings/\n│       └── page.tsx    ← Settings form (client component)\n└── globals.css",
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
      type: 'info',
      title: 'Verifying the scaffold',
      body: "After the agent scaffolds, run a quick verification pass. Check that the file structure matches your spec's routes. Open key files to confirm rendering strategy (look for \"use client\" directives). Verify the package.json has the right dependencies. Run the dev server to confirm it starts without errors. This takes 2 minutes and catches structural problems before you build features on a broken foundation.",
    },
    {
      type: 'terminal',
      instruction: 'After scaffolding, verify the project starts without errors:',
      expectedCommand: 'npm run dev',
      hint: 'The standard Next.js dev command',
    },
    {
      type: 'code-demo',
      title: 'Verification prompts for Claude Code',
      body: 'You can ask Claude Code to self-verify the scaffold against your spec. It will read the generated files and report discrepancies.',
      language: 'text',
      filename: 'verify-prompt.txt',
      code: "Review the project structure you just created against my spec.\nFor each route in the spec, confirm:\n1. The file exists at the correct path\n2. The rendering strategy is correct (server vs client)\n3. The layout hierarchy matches the nesting I specified\n\nList any discrepancies.",
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'Verification workflow locked in!',
    },

    // === COMMON PATTERNS ===
    {
      type: 'info',
      title: 'Pattern: server component with client islands',
      body: "The most common correct pattern in Next.js App Router: the page is a server component that fetches data, and interactive elements are extracted into small client component children. The page passes data down as props. This gives you server-side data fetching performance with client-side interactivity where needed. If the agent makes the whole page a client component to support one button click, redirect it to this pattern.",
    },
    {
      type: 'code-demo',
      title: 'Server page with client island',
      body: 'The page fetches data on the server. The interactive delete button is a separate client component.',
      language: 'typescript',
      filename: 'src/app/dashboard/bookmarks/page.tsx',
      code: "import { db } from '@/db'\nimport { bookmarks } from '@/db/schema'\nimport { DeleteButton } from './delete-button' // client component\n\nexport default async function BookmarksPage() {\n  const allBookmarks = await db.select().from(bookmarks)\n\n  return (\n    <div>\n      <h1>Bookmarks</h1>\n      {allBookmarks.map((b) => (\n        <div key={b.id}>\n          <a href={b.url}>{b.title}</a>\n          <DeleteButton id={b.id} />\n        </div>\n      ))}\n    </div>\n  )\n}",
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
      type: 'info',
      title: 'What to leave to the agent\'s judgment',
      body: "Not every decision needs your input. Let the agent decide: component file names and internal organization, utility function placement, CSS class naming within Tailwind, error boundary placement, loading.tsx and not-found.tsx locations, TypeScript interface naming. These are implementation details that do not affect architecture. Micromanaging them wastes your time and the agent's context window. Focus on the decisions that are expensive to change later.",
    },
    {
      type: 'info',
      title: 'The cost-of-change heuristic',
      body: "Which decisions should you control in the spec? Use the cost-of-change heuristic. Routing structure — expensive to change (affects URLs, navigation, data flow). Rendering strategy — expensive (restructuring server/client boundaries cascades). Layout hierarchy — moderate (requires moving files and updating shared state). Component naming — cheap (find-and-replace). Tailwind classes — trivial. Lock down the expensive decisions. Leave cheap ones to the agent.",
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
