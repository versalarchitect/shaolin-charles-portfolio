import type { LessonContent } from './types'

const content: LessonContent = {
  lessonId: '2-12',
  steps: [
    // === INTRODUCTION ===
    {
      type: 'info',
      title: 'The capstone: prove the full loop',
      body: "This is it. You will spec, direct, verify, and ship a complete product — a Feedback Board SaaS application — using only agent direction. No writing code yourself. No hand-editing. You direct, the agent builds. Every skill from Tier 2 converges here: spec writing, iterative direction, verification protocols, visual evaluation, scope constraints, and deployment. By the end of this lesson, you will have a live production URL running software you directed an agent to build end-to-end.",
    },
    {
      type: 'multiple-choice',
      question: 'The capstone product is a Feedback Board SaaS. Which features make it a real product rather than a toy project?',
      options: [
        'It has a pretty landing page and animated transitions',
        'It has authentication, database persistence, role-based access, and a responsive interface',
        'It uses the latest JavaScript framework and cutting-edge libraries',
        'It has comprehensive unit test coverage and CI/CD pipelines',
      ],
      correctIndex: 1,
      explanation: 'A real product has authentication (who can access), database persistence (data survives restarts), role-based access (admin vs user), and responsive design (works on mobile). Companies like Canny and Nolt charge $79-$400/month for feedback boards with these features. You will build it in 75 minutes of directed work.',
    },
    {
      type: 'interactive-diagram',
      title: 'Capstone Phases',
      body: 'Six phases from spec to ship. Each phase uses a specific skill from Tier 2. Click through each phase.',
      diagram: {
        direction: 'LR',
        nodes: [
          { id: 'spec', label: 'Phase 1', sublabel: 'Write the Spec', shape: 'rounded', highlight: true },
          { id: 'auth', label: 'Phase 2', sublabel: 'Auth + Database', shape: 'rect' },
          { id: 'core', label: 'Phase 3', sublabel: 'Core Features', shape: 'rect' },
          { id: 'ui', label: 'Phase 4', sublabel: 'Interface', shape: 'rect' },
          { id: 'verify', label: 'Phase 5', sublabel: 'Verify All', shape: 'diamond' },
          { id: 'ship', label: 'Phase 6', sublabel: 'Deploy + Doc', shape: 'rounded', highlight: true },
        ],
        edges: [
          { from: 'spec', to: 'auth' },
          { from: 'auth', to: 'core' },
          { from: 'core', to: 'ui' },
          { from: 'ui', to: 'verify' },
          { from: 'verify', to: 'ship', label: 'pass' },
          { from: 'verify', to: 'core', label: 'fix', dashed: true },
        ],
      },
      stages: [
        {
          highlightNodes: ['spec'],
          highlightEdges: [{ from: 'spec', to: 'auth' }],
          explanation: 'Phase 1: Write the complete product spec with all five sections — Goal, Constraints, Acceptance Criteria, Technical Boundaries, and Out of Scope. This is the execution contract for the entire build.',
        },
        {
          highlightNodes: ['auth'],
          highlightEdges: [{ from: 'auth', to: 'core' }],
          explanation: 'Phase 2: Direct the agent to build auth and the database schema as two scoped sub-tasks. The agent builds the foundation without touching app features — separation of concerns.',
        },
        {
          highlightNodes: ['core'],
          highlightEdges: [{ from: 'core', to: 'ui' }],
          explanation: 'Phase 3: Direct three core features — feedback submission, voting, and admin status — each as a separate scoped prompt. Apply iterative direction if the first output misses something.',
        },
        {
          highlightNodes: ['ui'],
          highlightEdges: [{ from: 'ui', to: 'verify' }],
          explanation: 'Phase 4: Compose all components into a cohesive interface. Apply visual constraints — spacing, hierarchy, responsive behavior — and evaluate output with your taste filter.',
        },
        {
          highlightNodes: ['verify'],
          highlightEdges: [{ from: 'verify', to: 'ship' }, { from: 'verify', to: 'core' }],
          explanation: 'Phase 5: Verify everything — functional tests against acceptance criteria, security audit (secrets, auth, data exposure), and visual evaluation. If verification fails, loop back to fix.',
        },
        {
          highlightNodes: ['ship'],
          explanation: 'Phase 6: Deploy to Vercel, verify the production deployment, and document the project. Environment variables, build verification, rollback plan, and a README that covers setup to deploy.',
        },
      ],
    },
    {
      type: 'checkpoint',
      xp: 5,
      message: 'Capstone context set! Let us build.',
    },

    // === PHASE 1: WRITE THE SPEC ===
    {
      type: 'multiple-choice',
      question: 'Your first action in the capstone is writing the product spec. Which of these is the most important reason the spec must include all five sections (Goal, Constraints, Acceptance Criteria, Technical Boundaries, Out of Scope)?',
      options: [
        'It makes the document look more professional',
        'It serves as the execution contract — every agent decision traces back to it',
        'It satisfies project management best practices',
        'It helps you estimate how long the project will take',
      ],
      correctIndex: 1,
      explanation: 'The spec is not documentation — it is the execution contract that governs the entire build. Every agent decision, from technology choices to feature boundaries, traces back to this document. Missing a section means the agent will fill in the gap with assumptions.',
    },
    {
      type: 'code-fill',
      instruction: 'Complete the key sections of this Feedback Board product spec that the agent will use as its execution contract:',
      language: 'markdown',
      filename: 'SPEC.md',
      template: '# Feedback Board — Agent Spec\n\n## Goal\nA public feedback board where users submit ideas, vote on them,\nand an admin manages item status. Live at a {{deployment}}.\n\n## Constraints\n- {{framework}} with App Router\n- TypeScript strict mode\n- {{database}} for auth (magic link) and database (Postgres)\n- Tailwind CSS + shadcn/ui components\n\n## Technical Boundaries\n- Use Supabase {{security}} for access control\n- {{rendering}} for data fetching, server actions for mutations',
      blanks: [
        { id: 'deployment', answer: 'production URL', alternatives: ['production url', 'live URL', 'live url', 'public URL'], placeholder: 'where does it live?', hint: 'The spec says the app must be live and accessible' },
        { id: 'framework', answer: 'Next.js 15', alternatives: ['Next.js', 'NextJS 15', 'nextjs 15'], placeholder: 'which framework?', hint: 'The React meta-framework with App Router' },
        { id: 'database', answer: 'Supabase', alternatives: ['supabase'], placeholder: 'which backend?', hint: 'Postgres-based backend-as-a-service' },
        { id: 'security', answer: 'Row Level Security', alternatives: ['RLS', 'row level security', 'Row-Level Security'], placeholder: 'which security model?', hint: 'Supabase feature that controls access at the database row level' },
        { id: 'rendering', answer: 'Server components', alternatives: ['Server Components', 'server components', 'RSC'], placeholder: 'which rendering pattern?', hint: 'Next.js pattern for data fetching without client-side JavaScript' },
      ],
      explanation: 'Each blank represents a critical architectural decision. The deployment target, framework, backend service, security model, and rendering strategy must all be explicit — ambiguity here causes the agent to guess, and guesses diverge from your intent.',
    },
    {
      type: 'code-fill',
      instruction: 'Complete the Out of Scope section of the Feedback Board spec to prevent scope creep:',
      language: 'markdown',
      filename: 'SPEC.md',
      template: '## Out of Scope\n- {{scope1}}\n- Email notifications on new feedback\n- {{scope2}}\n- Analytics dashboard\n- {{scope3}}',
      blanks: [
        { id: 'scope1', answer: 'User profiles or settings page', alternatives: ['User profiles', 'Profile page', 'Settings page', 'User settings'], placeholder: 'what user feature?', hint: 'A common feature agents add that isn\'t needed for a feedback board' },
        { id: 'scope2', answer: 'Markdown or rich text formatting', alternatives: ['Rich text editor', 'Markdown support', 'Text formatting'], placeholder: 'what content feature?', hint: 'A text formatting feature that would add complexity' },
        { id: 'scope3', answer: 'Deployment or CI/CD configuration', alternatives: ['Docker', 'CI/CD', 'Deployment config', 'Infrastructure'], placeholder: 'what infrastructure?', hint: 'Something the agent might helpfully add for shipping' },
      ],
      explanation: 'Each exclusion prevents a specific type of scope creep. Without these, agents commonly add profile pages, rich text editors, and Docker configs to simple projects.',
    },
    {
      type: 'terminal',
      instruction: 'Create your project directory and write the spec as SPEC.md. Adapt the example above or write your own — but include all five sections.',
      expectedCommand: 'claude "Create a new directory called feedback-board. Inside it, create a SPEC.md file with a complete product spec for a Feedback Board app. Include: Goal (public feedback board with voting and admin status management), Constraints (Next.js 15, TypeScript, Supabase, Tailwind + shadcn/ui, Vercel deploy, mobile-first), Acceptance Criteria (at least 10 testable items covering auth, submission, voting, display, admin, filtering, responsive, deploy), Technical Boundaries (RLS, server components, server actions, directory structure), Out of Scope (comments, categories, notifications, API, analytics, dark mode)."',
      hint: 'Create the project directory and have the agent write a comprehensive SPEC.md.',
    },
    {
      type: 'checkpoint',
      xp: 5,
      message: 'Phase 1 complete — spec written!',
    },

    // === PHASE 2: AUTH + DATABASE ===
    {
      type: 'multiple-choice',
      question: 'Phase 2 splits auth and database into two separate agent prompts. Why not combine them into one prompt?',
      options: [
        'The agent cannot handle both topics in one conversation',
        'Scoped sub-tasks are easier to verify — you can confirm the schema is correct before building auth on top of it',
        'Database and auth use different programming languages',
        'It is faster to run them in sequence than in parallel',
      ],
      correctIndex: 1,
      explanation: 'Scope constraints from Lesson 2-10: each sub-task gets its own prompt with explicit boundaries. You verify the schema is correct before building auth logic on top. If you combine them, a schema mistake propagates silently into the auth code, making it harder to debug.',
    },
    {
      type: 'terminal',
      instruction: 'Direct the agent to scaffold the Next.js project and create the Supabase schema. Scope: project setup and database ONLY — no app features yet.',
      expectedCommand: 'claude "Initialize a Next.js 15 project in the feedback-board directory with TypeScript, Tailwind, and App Router. Install @supabase/supabase-js and @supabase/ssr. Then create a Supabase migration file at supabase/migrations/001_schema.sql with: (1) profiles table (id uuid PK references auth.users, email text, role text default \'user\', created_at timestamp), (2) feedback_items table (id uuid PK, title text, description text, author_id uuid references profiles, status text default \'new\', created_at timestamp), (3) votes table (id uuid PK, item_id uuid references feedback_items, user_id uuid references profiles, unique constraint on item_id+user_id). Add RLS policies: anyone can SELECT feedback_items and votes, authenticated users can INSERT feedback_items and votes, only the admin role can UPDATE feedback_items status. Do NOT create any app pages or components yet."',
      hint: 'Scope to project init and database schema. Explicitly exclude app features.',
    },
    {
      type: 'terminal',
      instruction: 'Now direct auth implementation. Scope: ONLY the auth flow — sign in, sign out, session management. No feature code.',
      expectedCommand: 'claude "Implement magic link authentication. BOUNDARIES: Only create/modify files in src/lib/supabase/ and src/app/(auth)/. Create: (1) Supabase client utilities (browser client + server client), (2) a /login page with email input and magic link send, (3) a /auth/callback route that exchanges the code for a session, (4) a sign-out server action. Do NOT create any feature pages, feedback components, or voting logic. Only auth."',
      hint: 'Scope to auth only — login page, callback route, client utilities. No features.',
    },
    {
      type: 'checkpoint',
      xp: 10,
      message: 'Phase 2 complete — foundation built!',
    },

    // === PHASE 3: CORE FEATURES ===
    {
      type: 'multiple-choice',
      question: 'Phase 3 directs three features: feedback submission, voting, and admin status. The agent delivers the voting feature but forgot to toggle off votes (clicking again does not remove the vote). What do you do?',
      options: [
        'Accept it — users rarely need to un-vote',
        'Give a targeted follow-up: "Update the VoteButton so clicking when already voted deletes the vote row (toggle behavior). Do not modify submission or admin."',
        'Rewrite the entire voting prompt from scratch',
        'Move on to Phase 4 and fix it later during verification',
      ],
      correctIndex: 1,
      explanation: 'Iterative direction from Lesson 2-3: when the first output misses something, give a targeted follow-up rather than restarting. The follow-up is scoped (only VoteButton), specific (delete the vote row), and bounded (do not touch other features).',
    },
    {
      type: 'terminal',
      instruction: 'Direct the feedback submission feature. Scope: submit form and server action only.',
      expectedCommand: 'claude "Implement feedback submission. Create a SubmitFeedback component (client component with form) and a server action that inserts into feedback_items. The form has: title (required, max 100 chars), description (optional, max 500 chars). After submission, revalidate the main page. Place the component at src/components/submit-feedback.tsx and the action at src/app/actions/feedback.ts. The submit button should be disabled for anonymous users with a message to sign in first. Do NOT implement voting or status management."',
      hint: 'One feature: submission. Explicit exclusion of voting and status.',
    },
    {
      type: 'terminal',
      instruction: 'Direct the voting feature. Scope: vote/unvote logic only.',
      expectedCommand: 'claude "Implement voting. Create a VoteButton component and a toggleVote server action. Behavior: if the user has not voted on this item, insert a vote. If they have already voted, delete their vote (toggle). Show the current vote count and whether the current user has voted (filled vs outline icon). Place component at src/components/vote-button.tsx and action at src/app/actions/vote.ts. Do NOT modify the submission flow or add admin features."',
      hint: 'One feature: voting toggle. Do not touch submission or admin.',
    },
    {
      type: 'terminal',
      instruction: 'Direct admin status management. Scope: status update only, admin-only.',
      expectedCommand: 'claude "Implement admin status management. Create a StatusSelect component (dropdown with options: new, in-progress, done, declined) and an updateStatus server action. The action must verify the user has role=admin before executing. The StatusSelect should only render for admin users. Place at src/components/status-select.tsx and src/app/actions/status.ts. Do NOT modify existing components. Do NOT add any other admin features."',
      hint: 'One feature: admin status. Verify auth check is included.',
    },
    {
      type: 'checkpoint',
      xp: 10,
      message: 'Phase 3 complete — core features built!',
    },

    // === PHASE 4: INTERFACE ===
    {
      type: 'multiple-choice',
      question: 'Before directing the interface layout, which visual constraints should you specify to get a polished result on the first attempt?',
      options: [
        'Just say "make it look professional" and let the agent decide',
        'Specify the color palette only — the agent handles layout well on its own',
        'Specify spacing system (padding, gaps), typographic hierarchy (sizes, weights), responsive breakpoints, and status badge colors',
        'Send a Figma link and let the agent implement the design pixel-perfect',
      ],
      correctIndex: 2,
      explanation: 'Visual direction from Lesson 2-9: agents need explicit constraints — spacing values, type hierarchy, breakpoints, and color mapping. Vague instructions like "professional" produce generic output. Specific constraints like "p-5, gap-4, text-base font-semibold" get the result you want in one iteration.',
    },
    {
      type: 'terminal',
      instruction: 'Direct the main board page layout and the status filter. Include visual constraints.',
      expectedCommand: 'claude "Build the main board page at src/app/page.tsx. Layout: header with app title + sign-in/out button, followed by the board. Board structure: filter bar (status pills: All, New, In Progress, Done, Declined) above a grid of feedback items. Each item card shows: title, description (truncated to 2 lines), vote button with count, status badge, author email. VISUAL CONSTRAINTS: mobile single-column, md:grid-cols-2. Card padding p-5, gap-4 between cards. Clear typographic hierarchy: page title text-2xl font-bold, card title text-base font-semibold, description text-sm text-muted-foreground. Status badges use colored backgrounds (new=blue, in-progress=amber, done=green, declined=red) at low opacity. Sort items by vote count descending."',
      hint: 'Compose all components into a page with explicit visual constraints from Lesson 2-9.',
    },
    {
      type: 'multiple-choice',
      question: 'The agent delivers the board page. Cards have p-2 padding, no gap between them, and the title is the same size as the description. Which feedback do you give?',
      options: [
        '"Make the cards look better"',
        '"Increase card padding to p-5, add gap-4 between cards, make card titles text-base font-semibold and descriptions text-sm text-muted-foreground"',
        '"Redesign the entire page — this is wrong"',
        '"The styling is fine, ship it"',
      ],
      correctIndex: 1,
      explanation: 'Specific, actionable feedback with exact property names and values. This fixes the three issues (tight padding, no gap, flat hierarchy) in a single iteration.',
    },
    {
      type: 'checkpoint',
      xp: 10,
      message: 'Phase 4 complete — interface polished!',
    },

    // === PHASE 5: VERIFY EVERYTHING ===
    {
      type: 'multiple-choice',
      question: 'Phase 5 applies every verification skill from Tier 2. Which of these is the MOST dangerous to skip before deploying the Feedback Board?',
      options: [
        'Checking that status badge colors match the spec',
        'Verifying the security audit — auth checks, RLS policies, no leaked env vars',
        'Testing the responsive layout at 375px',
        'Confirming the filter UI works for all status values',
      ],
      correctIndex: 1,
      explanation: 'Security gaps in production are catastrophic — leaked API keys, missing auth checks, or disabled RLS policies can expose user data or allow unauthorized mutations. Visual bugs are embarrassing but fixable. Security vulnerabilities are exploitable.',
    },
    {
      type: 'terminal',
      instruction: 'Direct a comprehensive functional test of every acceptance criterion.',
      expectedCommand: 'claude "Test every acceptance criterion from SPEC.md: (1) Start the dev server. (2) Visit the board as anonymous — verify items are visible but vote/submit buttons are disabled. (3) Sign in via magic link. (4) Submit a feedback item with title and description — verify it appears. (5) Vote on an item — verify count increments. (6) Vote again — verify it toggles off. (7) Filter by status — verify filtering works. (8) Check mobile layout at 375px — verify single column. Report pass/fail for each criterion."',
      hint: 'Walk through every acceptance criterion from the spec and verify each one.',
    },
    {
      type: 'terminal',
      instruction: 'Direct a security audit on the codebase before deployment.',
      expectedCommand: 'claude "Security audit: (1) Search for any hardcoded keys, tokens, or passwords in source files. (2) Verify every server action checks authentication before mutating data. (3) Verify the updateStatus action checks for admin role specifically. (4) Confirm .env.local is in .gitignore. (5) Check that SUPABASE_SERVICE_ROLE_KEY is never imported in client components. (6) Verify RLS policies are active — no service-role bypass in client-facing code. Report findings as pass/fail checklist."',
      hint: 'Three categories: secret leakage, unprotected routes, data exposure.',
    },
    {
      type: 'checkpoint',
      xp: 10,
      message: 'Phase 5 complete — verified and secure!',
    },

    // === PHASE 6: DEPLOY + DOCUMENT ===
    {
      type: 'multiple-choice',
      question: 'Before deploying, you direct the agent to run the build. It passes — but you notice a hardcoded localhost:3000 URL in the codebase. Why is this a problem for production?',
      options: [
        'Localhost URLs are slower than production URLs',
        'The Vercel build will fail because of the localhost reference',
        'API calls or redirects will point to localhost instead of the production domain, breaking functionality for real users',
        'It is not a problem — Vercel automatically rewrites localhost URLs',
      ],
      correctIndex: 2,
      explanation: 'Hardcoded localhost URLs are one of the most common deployment failures. Everything works in development because the server IS on localhost. In production, those calls go nowhere — or worse, they fail silently. Always use environment variables like NEXT_PUBLIC_APP_URL.',
    },
    {
      type: 'terminal',
      instruction: 'Direct the agent to prepare for Vercel deployment — env vars, build verification, and production readiness.',
      expectedCommand: 'claude "Prepare for Vercel deployment: (1) Verify the build succeeds with npm run build — fix any type errors or build failures. (2) Create .env.example with all required environment variables documented. (3) Verify no localhost URLs are hardcoded in source files. (4) Check that NEXT_PUBLIC_APP_URL is used instead of hardcoded URLs. (5) Verify the Vercel framework detection will work (next.config present, correct build command). Report readiness status."',
      hint: 'Build verification, env documentation, and production URL usage.',
    },
    {
      type: 'terminal',
      instruction: 'Direct the agent to create a comprehensive README for the project.',
      expectedCommand: 'claude "Create a README.md for the feedback-board project. Include: (1) One-line description, (2) Tech stack list, (3) Local development setup (clone, install, env vars, run), (4) Supabase setup (create project, run migration, get keys), (5) Deploy to Vercel (link project, set env vars, deploy), (6) Admin setup (how to set a user as admin via Supabase SQL). Keep it concise — no fluff, just the essential commands and steps."',
      hint: 'Project documentation covering setup, development, deployment, and admin configuration.',
    },
    {
      type: 'checkpoint',
      xp: 10,
      message: 'Phase 6 complete — deployed and documented!',
    },

    {
      type: 'match',
      instruction: 'Match each Tier 2 skill to the capstone phase where you use it:',
      leftItems: ['Spec writing (2-1)', 'Auth security audit (2-3)', 'Scope discipline (2-10)', 'Code verification (2-8)', 'Deployment (2-11)'],
      rightItems: ['Phase 1: Write the product spec', 'Phase 2: Direct auth + database', 'Phase 3: Direct core features', 'Phase 5: Verify everything', 'Phase 6: Deploy + document'],
      correctPairs: { 0: 0, 1: 1, 2: 2, 3: 3, 4: 4 },
      explanation: 'The capstone synthesizes every Tier 2 lesson. Spec writing defines what to build. Auth audit ensures security. Scope discipline keeps each phase focused. Verification catches errors. Deployment ships it live.',
    },

    // === REFLECTION ===
    {
      type: 'interactive-diagram',
      title: 'What You Just Did',
      body: 'You directed an agent through the complete product lifecycle without writing a single line of code yourself. Step through each stage.',
      diagram: {
        direction: 'TB',
        nodes: [
          { id: 'idea', label: 'Product Idea', sublabel: 'Feedback Board', shape: 'pill' },
          { id: 'spec', label: 'Spec Written', sublabel: '5 sections, 11 criteria', shape: 'rounded' },
          { id: 'built', label: 'Product Built', sublabel: 'Auth, CRUD, voting, admin', shape: 'rect' },
          { id: 'verified', label: 'Verified', sublabel: 'Functional + security + visual', shape: 'diamond' },
          { id: 'shipped', label: 'Shipped', sublabel: 'Live production URL', shape: 'pill', highlight: true },
        ],
        edges: [
          { from: 'idea', to: 'spec', label: 'Lesson 2-1' },
          { from: 'spec', to: 'built', label: 'Lessons 2-2 to 2-4' },
          { from: 'built', to: 'verified', label: 'Lessons 2-5 to 2-9' },
          { from: 'verified', to: 'shipped', label: 'Lesson 2-11' },
        ],
      },
      stages: [
        {
          highlightNodes: ['idea'],
          highlightEdges: [{ from: 'idea', to: 'spec' }],
          explanation: 'You started with just an idea — a feedback board with voting and admin status management. No code, no repo, no project.',
        },
        {
          highlightNodes: ['spec'],
          highlightEdges: [{ from: 'spec', to: 'built' }],
          explanation: 'You wrote a 5-section spec with 11 acceptance criteria. This document governed every agent decision throughout the build.',
        },
        {
          highlightNodes: ['built'],
          highlightEdges: [{ from: 'built', to: 'verified' }],
          explanation: 'You directed scoped sub-tasks for auth, database, submission, voting, admin, and interface composition. Each task had explicit boundaries.',
        },
        {
          highlightNodes: ['verified'],
          highlightEdges: [{ from: 'verified', to: 'shipped' }],
          explanation: 'You ran functional tests against every acceptance criterion, a security audit, and a visual evaluation. Verification caught issues before users did.',
        },
        {
          highlightNodes: ['shipped'],
          explanation: 'You deployed to Vercel with environment variables configured, build verified, and documentation complete. The product is live.',
        },
      ],
    },
    {
      type: 'multiple-choice',
      question: 'You have completed the full capstone — idea to production. What is the core skill you demonstrated across all six phases?',
      options: [
        'Writing efficient code faster than an AI agent',
        'Memorizing the right terminal commands for each framework',
        'Product direction — clear specs, scoped prompts, rigorous verification, and confident deployment',
        'Using the most advanced AI model available',
      ],
      correctIndex: 2,
      explanation: 'You wrote zero application code. You wrote specs, gave direction, evaluated output, and made judgment calls. This is the new skill: product direction at the speed of thought. In Tier 3, you will scale this with multiple agents in parallel.',
    },
    {
      type: 'checklist',
      title: 'Capstone completion checklist:',
      items: [
        'I wrote a complete 5-section product spec',
        'I directed database schema and auth as scoped sub-tasks',
        'I directed three core features with explicit boundaries',
        'I applied visual constraints and evaluated interface quality',
        'I ran functional tests against every acceptance criterion',
        'I completed a security audit before deployment',
        'I directed deployment configuration and verification',
        'I have a live production URL running agent-built software',
      ],
    },
    {
      type: 'checkpoint',
      xp: 15,
      message: 'TIER 2 COMPLETE! You can direct AI to build entire products from scratch. You are ready for the next level.',
    },
  ],
}

export default content
