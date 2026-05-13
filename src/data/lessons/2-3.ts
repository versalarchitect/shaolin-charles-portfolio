import type { LessonContent } from './types'

const content: LessonContent = {
  lessonId: '2-3',
  steps: [
    // === INTRODUCTION ===
    {
      type: 'info',
      title: 'Your job is checking the work, not doing the work',
      body: "Claude Code can scaffold an entire auth system in minutes — providers, middleware, RLS policies, the works. But agents make optimistic assumptions about access. They assume if the query works for an admin, it works for everyone. Your role is not to write RLS policies by hand. It is to verify the agent did not leave holes. You are the security auditor, not the security engineer.",
    },
    {
      type: 'info',
      title: 'Why agents get auth wrong',
      body: "Agents generate code that works for the happy path. They test with the service role key (which bypasses RLS). They forget that new tables inherit no policies by default. They leave service keys in client-side code because it made the function work. Auth is adversarial — you need to think about what an attacker would try, not just what a user would do. Agents do not think adversarially unless you force them to.",
    },
    {
      type: 'checkpoint',
      xp: 2,
      message: 'Mindset set: you check the security, AI does the building.',
    },

    // === SPECCING THE AUTH SYSTEM ===
    {
      type: 'info',
      title: 'Speccing an auth system for the agent',
      body: "Before you tell the agent to build auth, you need a spec. A good auth spec includes: supported providers (email/password, OAuth with Google/GitHub), user roles (anonymous, authenticated, admin), protected routes (which pages require login), session handling (JWT duration, refresh strategy), and the RLS contract (who can read/write which tables). The more precise your spec, the fewer holes the agent leaves.",
    },
    {
      type: 'code-demo',
      title: 'Example auth spec prompt',
      body: 'Give the agent a structured spec like this. Notice the explicit mention of RLS requirements per table — this is what prevents the agent from skipping policies.',
      language: 'markdown',
      filename: 'auth-spec.md',
      code: "## Auth Requirements\n\n### Providers\n- Email/password with confirmation\n- OAuth: Google, GitHub\n\n### Roles\n- anonymous: can read public content\n- authenticated: can CRUD own data\n- admin: full access (checked via profiles.role)\n\n### Protected Routes\n- /dashboard/* → authenticated\n- /admin/* → admin role\n- /api/private/* → authenticated\n\n### RLS Contract\n- profiles: users read own, admins read all\n- posts: anyone reads published, owner CRUDs own\n- comments: authenticated creates, owner deletes\n\n### Session\n- JWT expiry: 1 hour\n- Refresh token: 7 days\n- Redirect after login: /dashboard",
    },
    {
      type: 'checkpoint',
      xp: 2,
      message: 'Auth spec structure understood!',
    },

    // === DIRECTING SUPABASE AUTH SETUP ===
    {
      type: 'info',
      title: 'Directing the agent through Supabase auth',
      body: "With your spec in hand, you direct the agent step by step. First: initialize Supabase locally. Second: set up email auth with confirmation enabled. Third: configure OAuth providers. Fourth: create the profiles table linked to auth.users. Fifth: write RLS policies for every table. The key is sequencing — if you dump everything at once, the agent will skip steps or make conflicting decisions.",
    },
    {
      type: 'terminal',
      instruction: 'Set up Supabase (a database and authentication service) in your project. Paste this command:',
      expectedCommand: 'supabase init',
      hint: 'The Supabase CLI command to scaffold local project config',
    },
    {
      type: 'code-demo',
      title: 'Supabase auth client setup',
      body: 'The agent should generate something like this for client-side auth. Check that it uses the ANON key (not the service role key) and that the redirect URLs are correct.',
      language: 'typescript',
      filename: 'src/lib/supabase.ts',
      code: "import { createClient } from '@supabase/supabase-js'\n\nconst supabaseUrl = import.meta.env.VITE_SUPABASE_URL\nconst supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY\n\nexport const supabase = createClient(supabaseUrl, supabaseAnonKey, {\n  auth: {\n    autoRefreshToken: true,\n    persistSession: true,\n    detectSessionInUrl: true,\n  },\n})",
    },
    {
      type: 'code-demo',
      title: 'OAuth sign-in functions',
      body: 'The agent generates OAuth helpers. Verify the redirectTo URL matches your app and that scopes are minimal.',
      language: 'typescript',
      filename: 'src/lib/auth.ts',
      code: "import { supabase } from './supabase'\n\nexport async function signInWithGitHub() {\n  return supabase.auth.signInWithOAuth({\n    provider: 'github',\n    options: {\n      redirectTo: `${window.location.origin}/auth/callback`,\n      scopes: 'read:user user:email',\n    },\n  })\n}\n\nexport async function signInWithGoogle() {\n  return supabase.auth.signInWithOAuth({\n    provider: 'google',\n    options: {\n      redirectTo: `${window.location.origin}/auth/callback`,\n      queryParams: { access_type: 'offline', prompt: 'consent' },\n    },\n  })\n}\n\nexport async function signInWithEmail(email: string, password: string) {\n  return supabase.auth.signInWithPassword({ email, password })\n}",
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'Auth setup directed successfully!',
    },

    // === ROW-LEVEL SECURITY ===
    {
      type: 'info',
      title: 'Row-Level Security: the critical layer',
      body: "RLS is Postgres's built-in authorization. When enabled on a table, every query must pass a policy check — even if the application code does not filter. This is defense in depth: even if your API has a bug, RLS prevents unauthorized access at the database level. The problem: agents enable RLS but write overly permissive policies, or they create new tables and forget to enable RLS entirely. A table with RLS disabled is wide open to anyone with the anon key.",
    },
    {
      type: 'code-demo',
      title: 'Proper RLS policies',
      body: 'This is what correct RLS looks like for a profiles table. The agent should generate something equivalent. Watch for: auth.uid() used correctly, separate SELECT/INSERT/UPDATE policies, no blanket USING (true).',
      language: 'sql',
      filename: 'supabase/migrations/002_rls_profiles.sql',
      code: "-- Enable RLS\nALTER TABLE profiles ENABLE ROW LEVEL SECURITY;\n\n-- Users can read their own profile\nCREATE POLICY \"Users read own profile\"\n  ON profiles FOR SELECT\n  USING (auth.uid() = id);\n\n-- Admins can read all profiles\nCREATE POLICY \"Admins read all profiles\"\n  ON profiles FOR SELECT\n  USING (\n    EXISTS (\n      SELECT 1 FROM profiles\n      WHERE id = auth.uid() AND role = 'admin'\n    )\n  );\n\n-- Users can update their own profile\nCREATE POLICY \"Users update own profile\"\n  ON profiles FOR UPDATE\n  USING (auth.uid() = id)\n  WITH CHECK (auth.uid() = id);\n\n-- Only the trigger creates profiles (no direct INSERT for users)\nCREATE POLICY \"Service role inserts profiles\"\n  ON profiles FOR INSERT\n  WITH CHECK (auth.uid() = id);",
    },
    {
      type: 'multiple-choice',
      question: 'An agent creates a new "comments" table but does not add any RLS policies. What happens when a logged-in user queries this table?',
      options: [
        'They see only their own comments (default safe behavior)',
        'They see all comments (RLS defaults to permissive if no policies exist)',
        'They see no rows (RLS with no policies blocks all access)',
        'The query throws a permission error',
      ],
      correctIndex: 2,
      explanation: 'When RLS is enabled but no policies are defined, Postgres denies all access by default. This is actually safe — but if the agent forgot to enable RLS at all, the table is wide open. Always verify RLS is enabled AND has the correct policies.',
    },

    // === AUTH FLOW DIAGRAM ===
    {
      type: 'diagram',
      title: 'Auth Flow: Login to Data Access',
      body: 'Every authenticated request passes through this flow. The RLS check happens at the database level, not in your application code.',
      diagram: {
        direction: 'LR',
        nodes: [
          { id: 'login', label: 'Login', sublabel: 'Email/OAuth', shape: 'rounded' },
          { id: 'session', label: 'Session', sublabel: 'JWT Token', shape: 'rect' },
          { id: 'request', label: 'API Request', sublabel: 'Bearer Token', shape: 'rect' },
          { id: 'rls', label: 'RLS Check', sublabel: 'Policy Eval', shape: 'diamond', highlight: true },
          { id: 'data', label: 'Data Access', sublabel: 'Rows Returned', shape: 'pill', highlight: true },
        ],
        edges: [
          { from: 'login', to: 'session', label: 'success' },
          { from: 'session', to: 'request', label: 'attach JWT' },
          { from: 'request', to: 'rls', label: 'query' },
          { from: 'rls', to: 'data', label: 'pass' },
        ],
      },
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'RLS fundamentals locked in!',
    },

    // === INTERACTIVE RLS EXERCISES ===
    {
      type: 'compare',
      title: 'Dangerous vs secure RLS policy',
      body: 'Row-Level Security policies determine who can access what data. One mistake exposes everything.',
      question: 'Which policy correctly restricts access to the row owner?',
      correctSide: 'right',
      left: {
        label: 'Dangerous',
        content: 'CREATE POLICY "users_read"\n  ON profiles FOR SELECT\n  USING (true);\n\n-- Problem: EVERY user can read\n-- EVERY other user\'s profile data',
        language: 'sql',
      },
      right: {
        label: 'Secure',
        content: 'CREATE POLICY "users_read_own"\n  ON profiles FOR SELECT\n  USING (auth.uid() = id);\n\n-- Only the profile owner\n-- can read their own data',
        language: 'sql',
      },
      explanation: 'USING (true) means "allow everyone" — it is the most common RLS mistake agents make. Always use auth.uid() = id to restrict rows to their owner.',
    },
    {
      type: 'code-fill',
      instruction: 'Complete the RLS policies for a comments table. Users can read all comments, but only insert and delete their own.',
      language: 'sql',
      filename: 'supabase/migrations/003_rls_comments.sql',
      template: 'ALTER TABLE comments ENABLE ROW LEVEL SECURITY;\n\nCREATE POLICY "anyone_can_read" ON comments\n  FOR {{read_op}}\n  USING ({{read_condition}});\n\nCREATE POLICY "own_comments_insert" ON comments\n  FOR INSERT\n  WITH CHECK ({{insert_check}});\n\nCREATE POLICY "own_comments_delete" ON comments\n  FOR DELETE\n  USING ({{delete_condition}});',
      blanks: [
        { id: 'read_op', answer: 'SELECT', alternatives: ['select'], placeholder: 'which operation?', hint: 'Reading data = which SQL operation?' },
        { id: 'read_condition', answer: 'true', placeholder: 'allow who?', hint: 'Everyone can read — what boolean value allows all?' },
        { id: 'insert_check', answer: 'auth.uid() = user_id', alternatives: ['auth.uid() = author_id'], placeholder: 'ownership check?', hint: 'Verify the authenticated user matches the row owner' },
        { id: 'delete_condition', answer: 'auth.uid() = user_id', alternatives: ['auth.uid() = author_id'], placeholder: 'ownership check?', hint: 'Same pattern as insert — only delete your own' },
      ],
      explanation: 'SELECT uses USING (true) because all comments are public. INSERT uses WITH CHECK to verify ownership at creation time. DELETE uses USING to verify ownership before removal.',
    },
    {
      type: 'match',
      instruction: 'Match each security gap to what it exposes:',
      leftItems: ['RLS not enabled on table', 'Policy uses USING (true)', 'Missing WITH CHECK on INSERT', 'Service role key in client code'],
      rightItems: ['Anyone can insert rows as any user', 'All rows visible to all users', 'Complete table bypass — no security at all', 'Full admin access from the browser console'],
      correctPairs: { 0: 2, 1: 1, 2: 0, 3: 3 },
      explanation: 'Each gap has a different severity. No RLS is the worst — complete bypass. USING (true) leaks reads. Missing WITH CHECK allows impersonation on writes. Service key in client gives admin access to anyone.',
    },

    // === VERIFICATION METHODOLOGY ===
    {
      type: 'info',
      title: 'Verification methodology: test every path',
      body: "Do not trust that the agent's code works because it ran without errors. Auth must be tested from every perspective: unauthenticated (no token), wrong role (authenticated but not admin), correct role, and cross-user (user A accessing user B's data). For each protected resource, you need to verify all four paths. The agent tested one. You test the other three.",
    },
    {
      type: 'terminal',
      instruction: 'Reset your local database to a fresh state. This applies all your latest changes and starts clean:',
      expectedCommand: 'supabase db reset',
      hint: 'The Supabase CLI command that drops and recreates your local database',
    },
    {
      type: 'code-demo',
      title: 'Testing RLS from the terminal',
      body: 'Use the Supabase CLI to test queries as different roles. This simulates what an attacker would see.',
      language: 'bash',
      filename: 'test-rls.sh',
      code: "# Test as anonymous (no auth) — should return empty or error\ncurl 'http://localhost:54321/rest/v1/profiles' \\\n  -H 'apikey: YOUR_ANON_KEY' \\\n  -H 'Authorization: Bearer YOUR_ANON_KEY'\n\n# Test as authenticated user — should see only own data\ncurl 'http://localhost:54321/rest/v1/profiles' \\\n  -H 'apikey: YOUR_ANON_KEY' \\\n  -H 'Authorization: Bearer USER_JWT_TOKEN'\n\n# Test cross-user access — user A trying to UPDATE user B's row\ncurl -X PATCH 'http://localhost:54321/rest/v1/profiles?id=eq.USER_B_ID' \\\n  -H 'apikey: YOUR_ANON_KEY' \\\n  -H 'Authorization: Bearer USER_A_JWT' \\\n  -H 'Content-Type: application/json' \\\n  -d '{\"display_name\": \"hacked\"}'",
    },
    {
      type: 'multiple-choice',
      question: 'You test a protected endpoint while logged out and it returns data. What is the most likely cause?',
      options: [
        'The JWT token expired',
        'RLS is not enabled on the table',
        'The OAuth provider is misconfigured',
        'The session cookie is stale',
      ],
      correctIndex: 1,
      explanation: 'If an unauthenticated request returns data from a table that should be protected, RLS is either not enabled or has an overly permissive policy (like USING (true)). This is the most common agent-introduced security hole.',
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'Verification methodology mastered!',
    },

    // === COMMON AGENT SECURITY HOLES ===
    {
      type: 'info',
      title: 'Common agent security holes',
      body: "After reviewing hundreds of agent-generated auth implementations, these are the top failures: (1) New tables created without RLS enabled. (2) Policies that use USING (true) — allowing all access. (3) Service role key used in client-side code (bypasses all RLS). (4) Missing WITH CHECK on INSERT/UPDATE policies. (5) No policy separation between roles — one policy does everything. (6) Hardcoded redirect URLs that break in production. (7) Missing email confirmation requirement — accounts created without verification.",
    },
    {
      type: 'code-demo',
      title: 'Spot the security hole',
      body: 'The agent generated this code. Can you spot the critical security vulnerability?',
      language: 'typescript',
      filename: 'src/lib/admin.ts',
      code: "import { createClient } from '@supabase/supabase-js'\n\n// DANGER: Agent used service role key in client code!\nconst supabase = createClient(\n  import.meta.env.VITE_SUPABASE_URL,\n  import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY // <-- THIS BYPASSES ALL RLS\n)\n\nexport async function getUsers() {\n  const { data } = await supabase.from('profiles').select('*')\n  return data\n}",
    },
    {
      type: 'multiple-choice',
      question: 'What makes the service role key dangerous in client-side code?',
      options: [
        'It expires faster than the anon key',
        'It bypasses all Row-Level Security policies entirely',
        'It only works in server-side environments',
        'It cannot perform read operations',
      ],
      correctIndex: 1,
      explanation: 'The service role key bypasses ALL RLS checks. If it is exposed in client-side code (any VITE_ prefixed env var is bundled into the browser), any user can extract it from the JavaScript bundle and access every row in every table with no restrictions.',
    },

    // === TARGETED FEEDBACK ===
    {
      type: 'info',
      title: 'Targeted feedback: telling the agent what is wrong',
      body: "When you find a hole, do not say \"fix the auth.\" That is too vague and the agent will make a different mistake. Be surgical: \"The profiles table has RLS enabled but the SELECT policy uses USING (true) which allows any authenticated user to read all profiles. Replace it with USING (auth.uid() = id) so users can only read their own profile. Admins should have a separate policy checking profiles.role = 'admin'.\" Specific, actionable, testable.",
    },
    {
      type: 'code-input',
      instruction: 'Write an RLS policy instruction for the agent: the posts table allows any user to DELETE any post. Fix it so only the post owner can delete.',
      placeholder: 'CREATE POLICY ...',
      answer: 'CREATE POLICY "Owner deletes own posts" ON posts FOR DELETE USING (auth.uid() = user_id);',
      hint: 'Use CREATE POLICY with FOR DELETE and a USING clause that checks auth.uid() matches the owner column',
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'Surgical feedback skills acquired!',
    },

    // === HANDS-ON VERIFICATION ===
    {
      type: 'terminal',
      instruction: 'Run a security check to find any database tables that might be missing protection rules:',
      expectedCommand: "supabase db lint",
      hint: 'Supabase has a built-in linting command that checks for security issues including missing RLS',
    },
    {
      type: 'order',
      instruction: 'Order the auth verification steps from first to last:',
      items: [
        'Test cross-user access (user A accessing user B data)',
        'Verify RLS is enabled on all tables',
        'Test as unauthenticated (should be denied)',
        'Check no service keys in client code',
        'Test as correct role (should succeed)',
      ],
      correctOrder: [3, 1, 2, 4, 0],
    },

    // === FINAL CHECKLIST ===
    {
      type: 'checklist',
      title: 'Auth security verification checklist:',
      items: [
        'RLS is enabled on every table that holds user data',
        'No policies use USING (true) without role checks',
        'Service role key is never in client-side code (no VITE_/NEXT_PUBLIC_ prefix)',
        'Every INSERT/UPDATE policy has a WITH CHECK clause',
        'Unauthenticated users cannot access protected endpoints',
        'Users cannot read or modify other users\' data',
        'OAuth redirect URLs use environment variables, not hardcoded strings',
        'Email confirmation is required before account is active',
      ],
    },
    {
      type: 'checkpoint',
      xp: 9,
      message: 'Auth and Security Verification complete! You know how to check for security gaps.',
    },
  ],
}

export default content
