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
      type: 'multiple-choice',
      hint: 'Read each option carefully — one fits the context best.',
      question: 'Before telling the agent to build auth, you need a spec. Which section is MOST critical to include to prevent the agent from leaving security holes?',
      options: [
        'Supported OAuth providers (Google, GitHub)',
        'Session handling (JWT duration, refresh strategy)',
        'The RLS contract (who can read/write which tables)',
        'UI design for the login page',
      ],
      correctIndex: 2,
      explanation: 'The RLS contract is the most critical section. Without explicit per-table access rules, the agent will either skip RLS entirely or write overly permissive policies. Providers and session config matter, but security holes come from missing or wrong RLS policies.',
    },
    {
      type: 'code-fill',
      hint: 'Fill in values that match the pattern shown above.',
      instruction: 'Give the agent a structured auth spec. Complete the RLS contract section — this is what prevents the agent from skipping policies.',
      language: 'markdown',
      filename: 'auth-spec.md',
      template: '## Auth Requirements\n\n### Providers\n- Email/password with confirmation\n- OAuth: Google, GitHub\n\n### Roles\n- anonymous: can read public content\n- authenticated: can CRUD own data\n- admin: full access (checked via profiles.role)\n\n### Protected Routes\n- /dashboard/* → authenticated\n- /admin/* → admin role\n\n### RLS Contract\n- profiles: {{profiles_policy}}\n- posts: anyone reads published, {{posts_policy}}\n- comments: {{comments_policy}}\n\n### Session\n- JWT expiry: 1 hour\n- Refresh token: 7 days',
      blanks: [
        { id: 'profiles_policy', answer: 'users read own, admins read all', alternatives: ['users read own, admin reads all', 'user reads own, admins read all'], placeholder: 'who reads profiles?', hint: 'Regular users see only their own, admins see everyone' },
        { id: 'posts_policy', answer: 'owner CRUDs own', alternatives: ['owner CRUD own', 'owner creates/reads/updates/deletes own', 'owner manages own'], placeholder: 'who manages posts?', hint: 'The person who created the post should have full control' },
        { id: 'comments_policy', answer: 'authenticated creates, owner deletes', alternatives: ['authenticated create, owner delete', 'authenticated inserts, owner deletes'], placeholder: 'who manages comments?', hint: 'Any logged-in user can create, but only the author can remove' },
      ],
      explanation: 'Each RLS contract entry specifies exactly who can do what. Without this, the agent will guess — and its guesses tend toward permissive policies like USING (true) that expose all data.',
    },
    {
      type: 'checkpoint',
      xp: 2,
      message: 'Auth spec structure understood!',
    },

    // === DIRECTING SUPABASE AUTH SETUP ===
    {
      type: 'order',
      hint: 'Consider what depends on what — prerequisites first.',
      instruction: 'Directing the agent through Supabase auth requires sequencing. Order these steps correctly — if you dump everything at once, the agent will skip steps or make conflicting decisions:',
      items: [
        'Write RLS policies for every table',
        'Initialize Supabase locally',
        'Create the profiles table linked to auth.users',
        'Set up email auth with confirmation enabled',
        'Configure OAuth providers',
      ],
      correctOrder: [1, 3, 4, 2, 0],
    },
    {
      type: 'terminal',
      instruction: 'Set up Supabase (a database and authentication service) in your project. Paste this command:',
      expectedCommand: 'supabase init',
      hint: 'The Supabase CLI command to scaffold local project config',
    },
    {
      type: 'code-fill',
      hint: 'Use the exact syntax from the lesson examples.',
      instruction: 'The agent generates the Supabase client. Verify it uses the correct key type — the WRONG key here is a critical security vulnerability.',
      language: 'typescript',
      filename: 'src/lib/supabase.ts',
      template: "import { createClient } from '@supabase/supabase-js'\n\nconst supabaseUrl = import.meta.env.VITE_SUPABASE_URL\nconst supabaseKey = import.meta.env.{{env_key_name}}\n\nexport const supabase = createClient(supabaseUrl, supabaseKey, {\n  auth: {\n    autoRefreshToken: true,\n    {{session_option}}: true,\n    detectSessionInUrl: true,\n  },\n})",
      blanks: [
        { id: 'env_key_name', answer: 'VITE_SUPABASE_ANON_KEY', alternatives: ['VITE_SUPABASE_ANON_KEY'], placeholder: 'which env var?', hint: 'The PUBLIC key that respects RLS — NOT the service role key' },
        { id: 'session_option', answer: 'persistSession', alternatives: ['persistSession'], placeholder: 'which auth option?', hint: 'Keeps the user logged in across browser refreshes' },
      ],
      explanation: 'Using VITE_SUPABASE_ANON_KEY is critical. The anon key respects RLS policies. Using the service role key in client code would bypass ALL security and expose every row in every table.',
    },
    {
      type: 'code-fill',
      hint: 'Each blank follows the conventions demonstrated earlier.',
      instruction: 'The agent generates OAuth helpers. Complete the critical parts — the redirect URL must use a dynamic origin (not hardcoded) and scopes should be minimal.',
      language: 'typescript',
      filename: 'src/lib/auth.ts',
      template: "import { supabase } from './supabase'\n\nexport async function signInWithGitHub() {\n  const origin = {{origin_source}}\n  return supabase.auth.signInWithOAuth({\n    provider: 'github',\n    options: {\n      redirectTo: origin + '/auth/callback',\n      scopes: '{{github_scopes}}',\n    },\n  })\n}\n\nexport async function signInWithEmail(email: string, password: string) {\n  return supabase.auth.{{email_method}}({ email, password })\n}",
      blanks: [
        { id: 'origin_source', answer: 'window.location.origin', alternatives: ['window.location.origin'], placeholder: 'dynamic origin?', hint: 'The browser API that returns the current protocol + host' },
        { id: 'github_scopes', answer: 'read:user user:email', alternatives: ['read:user user:email', 'user:email read:user'], placeholder: 'minimal GitHub scopes?', hint: 'Only request what you need: reading user info and email' },
        { id: 'email_method', answer: 'signInWithPassword', alternatives: ['signInWithPassword'], placeholder: 'which Supabase method?', hint: 'The method for email + password authentication' },
      ],
      explanation: 'Using window.location.origin makes the redirect URL work in all environments (local dev, preview, production). Hardcoded URLs break in production. Minimal scopes follow the principle of least privilege.',
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'Auth setup directed successfully!',
    },

    // === ROW-LEVEL SECURITY ===
    {
      type: 'multiple-choice',
      hint: 'Eliminate the options that only partially fit.',
      question: 'What is the biggest risk when agents create new database tables?',
      options: [
        'The agent might use incorrect column types',
        'The agent might forget to add indexes for performance',
        'The agent might forget to enable RLS entirely — leaving the table wide open to anyone with the anon key',
        'The agent might use too many foreign keys',
      ],
      correctIndex: 2,
      explanation: 'RLS is Postgres\'s built-in authorization. When enabled, every query must pass a policy check — even if application code does not filter. The biggest risk: agents create new tables and forget to enable RLS. A table with RLS disabled is wide open. Defense in depth: even if your API has a bug, RLS prevents unauthorized access at the database level.',
    },
    {
      type: 'code-fill',
      hint: 'Look at the surrounding code for context clues.',
      instruction: 'Complete the RLS policies for a profiles table. Watch for: auth.uid() used correctly, separate policies per operation, no blanket USING (true).',
      language: 'sql',
      filename: 'supabase/migrations/002_rls_profiles.sql',
      template: '-- Enable RLS\nALTER TABLE profiles ENABLE ROW LEVEL SECURITY;\n\n-- Users can read their own profile\nCREATE POLICY "Users read own profile"\n  ON profiles FOR SELECT\n  USING ({{own_profile_check}});\n\n-- Admins can read all profiles\nCREATE POLICY "Admins read all profiles"\n  ON profiles FOR SELECT\n  USING (\n    EXISTS (\n      SELECT 1 FROM profiles\n      WHERE id = auth.uid() AND role = \'{{admin_role}}\'\n    )\n  );\n\n-- Users can update their own profile\nCREATE POLICY "Users update own profile"\n  ON profiles FOR {{update_op}}\n  USING (auth.uid() = id)\n  WITH CHECK (auth.uid() = id);',
      blanks: [
        { id: 'own_profile_check', answer: 'auth.uid() = id', alternatives: ['auth.uid() = id'], placeholder: 'ownership check?', hint: 'Compare the authenticated user ID to the row ID' },
        { id: 'admin_role', answer: 'admin', alternatives: ['admin'], placeholder: 'role name?', hint: 'The role string that grants full access' },
        { id: 'update_op', answer: 'UPDATE', alternatives: ['update', 'UPDATE'], placeholder: 'which SQL operation?', hint: 'The operation that modifies existing rows' },
      ],
      explanation: 'auth.uid() = id restricts rows to their owner. The admin policy uses a subquery to check the role column. Separate SELECT and UPDATE policies give fine-grained control. Never use USING (true) — it allows everyone to access everything.',
    },
    {
      type: 'multiple-choice',
      hint: 'Focus on the primary goal, not secondary benefits.',
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
      type: 'interactive-diagram',
      title: 'Auth Flow: Login to Data Access',
      body: 'Every authenticated request passes through this flow. The RLS check happens at the database level, not in your application code. Step through each stage.',
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
      stages: [
        {
          highlightNodes: ['login'],
          highlightEdges: [],
          explanation: 'User authenticates via email/password or OAuth. Supabase handles the provider handshake and returns a session.',
        },
        {
          highlightNodes: ['login', 'session'],
          highlightEdges: [{ from: 'login', to: 'session' }],
          explanation: 'On success, Supabase issues a JWT containing the user ID (auth.uid()). This token is stored client-side and auto-refreshed.',
        },
        {
          highlightNodes: ['session', 'request'],
          highlightEdges: [{ from: 'session', to: 'request' }],
          explanation: 'Every API request includes the JWT as a Bearer token. The Supabase client does this automatically.',
        },
        {
          highlightNodes: ['request', 'rls'],
          highlightEdges: [{ from: 'request', to: 'rls' }],
          explanation: 'Postgres extracts auth.uid() from the JWT and evaluates RLS policies. This happens at the database level — your application code cannot bypass it.',
        },
        {
          highlightNodes: ['rls', 'data'],
          highlightEdges: [{ from: 'rls', to: 'data' }],
          explanation: 'Only rows that pass the policy check are returned. If the user tries to read another user\'s data, RLS silently filters it out — no error, just empty results.',
        },
      ],
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'RLS fundamentals locked in!',
    },

    // === INTERACTIVE RLS EXERCISES ===
    {
      type: 'compare',
      hint: 'Look at the key differences between the two approaches.',
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
      hint: 'The answer matches the API or syntax just explained.',
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
      hint: 'Find the unique connection between each pair.',
      instruction: 'Match each security gap to what it exposes:',
      leftItems: ['RLS not enabled on table', 'Policy uses USING (true)', 'Missing WITH CHECK on INSERT', 'Service role key in client code'],
      rightItems: ['Anyone can insert rows as any user', 'All rows visible to all users', 'Complete table bypass — no security at all', 'Full admin access from the browser console'],
      correctPairs: { 0: 2, 1: 1, 2: 0, 3: 3 },
      explanation: 'Each gap has a different severity. No RLS is the worst — complete bypass. USING (true) leaks reads. Missing WITH CHECK allows impersonation on writes. Service key in client gives admin access to anyone.',
    },

    // === VERIFICATION METHODOLOGY ===
    {
      type: 'multiple-choice',
      hint: 'Think about which option is most specific to this concept.',
      question: 'The agent\'s auth code runs without errors. How many access paths do you need to test for each protected resource?',
      options: [
        'One — if it works for an authenticated user, it works',
        'Two — test authenticated and unauthenticated',
        'Three — test unauthenticated, correct role, and wrong role',
        'Four — test unauthenticated, wrong role, correct role, and cross-user (user A accessing user B\'s data)',
      ],
      correctIndex: 3,
      explanation: 'Auth must be tested from every perspective: (1) unauthenticated/no token, (2) wrong role/authenticated but not admin, (3) correct role, and (4) cross-user/user A accessing user B\'s data. The agent tested one path (correct role). You test the other three. Do not trust code that merely runs without errors.',
    },
    {
      type: 'terminal',
      instruction: 'Reset your local database to a fresh state. This applies all your latest changes and starts clean:',
      expectedCommand: 'supabase db reset',
      hint: 'The Supabase CLI command that drops and recreates your local database',
    },
    {
      type: 'code-fill',
      hint: 'Fill in values that match the pattern shown above.',
      instruction: 'Test RLS from the terminal by simulating different access levels. Complete the curl commands that verify security from an attacker\'s perspective.',
      language: 'bash',
      filename: 'test-rls.sh',
      template: "# Test as anonymous (no auth) — should return empty or error\ncurl 'http://localhost:54321/rest/v1/profiles' \\\n  -H 'apikey: YOUR_ANON_KEY' \\\n  -H 'Authorization: Bearer YOUR_ANON_KEY'\n\n# Test cross-user access — user A trying to UPDATE user B's row\ncurl -X {{http_method}} 'http://localhost:54321/rest/v1/profiles?id=eq.USER_B_ID' \\\n  -H 'apikey: YOUR_ANON_KEY' \\\n  -H 'Authorization: Bearer {{whose_token}}' \\\n  -H 'Content-Type: application/json' \\\n  -d '{\"display_name\": \"hacked\"}'",
      blanks: [
        { id: 'http_method', answer: 'PATCH', alternatives: ['PATCH', 'patch'], placeholder: 'which HTTP method?', hint: 'The HTTP method for partial updates' },
        { id: 'whose_token', answer: 'USER_A_JWT', alternatives: ['USER_A_JWT', 'USER_A_TOKEN'], placeholder: 'whose JWT?', hint: 'The attacker (user A) is trying to modify user B\'s row' },
      ],
      explanation: 'PATCH is used for partial updates. The cross-user test uses USER_A\'s token to attempt modifying USER_B\'s row. If RLS is correct, this request will fail silently (0 rows affected) or return an error.',
    },
    {
      type: 'multiple-choice',
      hint: 'Consider what the lesson content emphasized.',
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
      type: 'order',
      hint: 'Think about what needs to exist before each next step.',
      instruction: 'Rank the top agent-generated security holes from MOST dangerous (first) to least (last):',
      items: [
        'Service role key used in client-side code (bypasses all RLS)',
        'New tables created without RLS enabled',
        'Missing WITH CHECK on INSERT/UPDATE policies',
        'Hardcoded redirect URLs that break in production',
        'Policies that use USING (true) — allowing all access',
      ],
      correctOrder: [0, 1, 4, 2, 3],
    },
    {
      type: 'code-diff',
      title: 'Spot the security hole',
      body: 'The agent generated the "before" code. The "after" shows the fix. Can you identify the critical vulnerability?',
      language: 'typescript',
      filename: 'src/lib/admin.ts',
      before: "import { createClient } from '@supabase/supabase-js'\n\nconst supabase = createClient(\n  import.meta.env.VITE_SUPABASE_URL,\n  import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY\n)\n\nexport async function getUsers() {\n  const { data } = await supabase.from('profiles').select('*')\n  return data\n}",
      after: "import { createClient } from '@supabase/supabase-js'\n\nconst supabase = createClient(\n  import.meta.env.VITE_SUPABASE_URL,\n  import.meta.env.VITE_SUPABASE_ANON_KEY\n)\n\nexport async function getUsers() {\n  const { data } = await supabase.from('profiles').select('*')\n  return data\n}",
      question: 'What makes VITE_SUPABASE_SERVICE_ROLE_KEY dangerous in client-side code?',
      highlightLines: [4],
      explanation: 'The service role key bypasses ALL RLS checks. Any VITE_ prefixed env var is bundled into the browser JavaScript. Anyone can extract it from the bundle and access every row in every table. The fix: use VITE_SUPABASE_ANON_KEY which respects RLS policies.',
    },
    {
      type: 'multiple-choice',
      hint: 'One option stands out when you think about the core purpose.',
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
      type: 'compare',
      hint: 'Focus on what makes one approach more appropriate here.',
      title: 'Vague vs surgical security feedback',
      body: 'When you find a security hole, the way you tell the agent matters. One approach leads to a different mistake. The other gets it fixed.',
      question: 'Which feedback will reliably fix the security hole?',
      correctSide: 'right',
      left: {
        label: 'Too vague',
        content: '"Fix the auth."\n\nResult: Agent makes a DIFFERENT\nmistake. Maybe it removes USING\n(true) but replaces it with\nanother overly permissive policy.\n\nVagueness + security = disaster.',
        language: 'text',
      },
      right: {
        label: 'Surgical',
        content: '"The profiles table SELECT policy\nuses USING (true) — replace with\nUSING (auth.uid() = id).\nAdd a separate admin policy\nchecking profiles.role = \'admin\'."\n\nSpecific. Actionable. Testable.',
        language: 'text',
      },
      explanation: 'Surgical feedback names the table, the policy, the problem, and the fix. The agent can verify the correction mechanically. Vague feedback like "fix the auth" gives the agent room to make a different mistake — dangerous when security is at stake.',
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
      hint: 'Follow the logical sequence from setup to execution.',
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
