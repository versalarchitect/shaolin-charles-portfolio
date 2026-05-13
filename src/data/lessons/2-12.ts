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
      type: 'info',
      title: 'The product: Feedback Board',
      body: "A real product with real utility. Users submit feedback items (title + description). Other users vote on items to indicate priority. An admin can change item status (new, in progress, done, declined). Items display in a public board sorted by votes. This is not a toy — it has authentication, database persistence, role-based access, and a responsive interface. Companies like Canny and Nolt charge $79-$400/month for this. You will build it in 75 minutes of directed work.",
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
      type: 'info',
      title: 'Phase 1: Write the Spec (Lesson 2-1 skills)',
      body: "Your first action is writing the complete product spec. This is not a quick outline — it is the execution contract that governs the entire build. Include all five sections: Goal, Constraints, Acceptance Criteria, Technical Boundaries, and Out of Scope. Be precise on technology choices. Be exhaustive on acceptance criteria. Be explicit on what is NOT included. This spec is your most important artifact.",
    },
    {
      type: 'code-demo',
      title: 'Feedback Board — Full Spec',
      body: 'This is the spec you will deliver to the agent. Study it — then you will create your own version.',
      language: 'markdown',
      filename: 'SPEC.md',
      code: "# Feedback Board — Agent Spec\n\n## Goal\nA public feedback board where users submit ideas, vote on them,\nand an admin manages item status. Live at a production URL.\n\n## Constraints\n- Next.js 15 with App Router\n- TypeScript strict mode\n- Supabase for auth (magic link) and database (Postgres)\n- Tailwind CSS + shadcn/ui components\n- Deployed on Vercel\n- Mobile-first responsive design\n\n## Acceptance Criteria\n- [ ] Users can sign in via magic link (email)\n- [ ] Signed-in users can submit feedback (title + description)\n- [ ] Signed-in users can upvote/remove vote on any item (one vote per user per item)\n- [ ] All users (including anonymous) can view the public board\n- [ ] Board displays items sorted by vote count (descending)\n- [ ] Admin can change item status: new | in-progress | done | declined\n- [ ] Items show their status as a colored badge\n- [ ] Board is filterable by status\n- [ ] Responsive: single column mobile, two-column desktop\n- [ ] App runs locally with `npm run dev` after `npm install`\n- [ ] App deploys to Vercel without errors\n\n## Technical Boundaries\n- Use Supabase Row Level Security for access control\n- Server components for data fetching, server actions for mutations\n- All database logic through Supabase client (no raw SQL in app code)\n- Keep components in src/components/, pages in src/app/\n- Admin role determined by a role column in the users/profiles table\n\n## Out of Scope\n- Comments/replies on items\n- Categories or tags\n- Email notifications\n- Public API\n- Custom domain configuration\n- Analytics or tracking\n- Dark mode (ship light-only for MVP)",
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
      type: 'info',
      title: 'Phase 2: Direct Auth + Database (Lesson 2-10 scope skills)',
      body: "Now you direct the agent to build the foundation — but NOT everything at once. Apply scope constraints from Lesson 2-10. Phase 2 has two focused sub-tasks: (1) Supabase database schema with RLS policies, (2) Authentication flow with magic link. Each sub-task gets its own prompt with explicit boundaries. The agent builds the schema without touching the app code, then builds auth without touching the schema.",
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
      type: 'info',
      title: 'Phase 3: Direct Core Features (Lessons 2-3, 2-10)',
      body: "With auth and database in place, you direct the core features: feedback submission, voting, and admin status management. Each is a scoped sub-task. The agent knows the schema exists and the auth flow works — now it builds application logic on top. Apply iterative direction from Lesson 2-3: if the first output misses something, give targeted follow-ups rather than restarting.",
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
      type: 'info',
      title: 'Phase 4: Direct the Interface (Lesson 2-9 visual skills)',
      body: "The components exist but they need to come together as a cohesive interface. This is where your visual direction skills matter. You will direct the agent to build the board page — composing the components, establishing layout, and implementing the filter UI. Apply visual spec constraints: spacing system, hierarchy, responsive behavior. Then evaluate the output with your taste filter.",
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
      type: 'info',
      title: 'Phase 5: Verify Everything (Lessons 2-5, 2-6, 2-7, 2-8)',
      body: "The product is built. Now you verify — systematically. Apply every verification skill from Tier 2: functional testing (does each acceptance criterion work?), edge case testing (what happens with empty states, long text, simultaneous votes?), security audit (auth checks, RLS policies, no leaked env vars), and visual evaluation (responsive, hierarchy, spacing). This is where thoroughness prevents embarrassment.",
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
      type: 'info',
      title: 'Phase 6: Deploy + Document (Lesson 2-11 skills)',
      body: "The final phase. You direct the agent through deployment configuration, push to Vercel, and document the project. Apply the deployment skills from Lesson 2-11: environment variable setup, preview deployment verification, and production readiness checks. Then direct documentation so the project is maintainable — a README that explains how to run, develop, and deploy.",
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
      type: 'diagram',
      title: 'What You Just Did',
      body: 'You directed an agent through the complete product lifecycle without writing a single line of code yourself.',
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
    },
    {
      type: 'info',
      title: 'Tier 2 mastery: the single-agent director',
      body: "You have proven you can take a product from idea to production using only agent direction. You wrote zero application code. You wrote specs, gave direction, evaluated output, and made judgment calls. This is the new skill: product direction at the speed of thought. In Tier 3, you will scale this — directing multiple agents in parallel, orchestrating complex systems, and building at a pace that was previously impossible. But the foundation is what you just demonstrated: clear specs, scoped direction, rigorous verification, and confident deployment.",
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
