import type { LessonContent } from './types'

const content: LessonContent = {
  lessonId: '2-8',
  steps: [
    // === INTRODUCTION ===
    {
      type: 'info',
      title: 'How to check AI-generated code before trusting it',
      body: "Agent-generated code looks professional. It has comments, follows patterns, uses modern syntax. It passes a quick visual scan. That is exactly the danger. Subtle bugs hide behind competent-looking code: missing error boundaries, unchecked null access, race conditions in async flows, SQL injection in dynamic queries. The agent does not test edge cases unless you specified them. \"Trust but check\" means: assume the agent tried its best, then verify systematically before you commit.",
    },
    {
      type: 'info',
      title: 'Why agents make specific mistakes',
      body: "Agents optimize for the happy path because that is what most training examples show. They produce code that handles the expected input correctly. But production code must handle: missing fields, null values, network failures, concurrent mutations, invalid state transitions, malformed input, and timeouts. The agent is not careless — it is optimistic. Your verification checklist compensates for that optimism.",
    },

    // === COMMON MISTAKES ===
    {
      type: 'info',
      title: 'Mistake 1: Missing error handling',
      body: "The most frequent agent mistake. A fetch call without try/catch. A database query that assumes success. A file read that does not handle \"file not found.\" The agent writes the logic for when things work. Your job is to verify the logic for when things fail. Check every external call (API, DB, filesystem) for proper error handling.",
    },
    {
      type: 'code-demo',
      title: 'Spot the missing error handling',
      body: 'This code looks correct at first glance but has no failure path. What happens when the API returns 500?',
      language: 'typescript',
      filename: 'src/actions/get-user.ts',
      code: "// Agent-generated code — looks clean, but fragile\nexport async function getUser(id: string) {\n  const response = await fetch(`/api/users/${id}`)\n  const data = await response.json()\n  return data.user\n}\n\n// What you should verify exists:\nexport async function getUserVerified(id: string) {\n  const response = await fetch(`/api/users/${id}`)\n\n  if (!response.ok) {\n    throw new Error(`Failed to fetch user: ${response.status}`)\n  }\n\n  const data = await response.json()\n\n  if (!data.user) {\n    return null // Explicit null instead of undefined access\n  }\n\n  return data.user\n}",
    },
    {
      type: 'code-diff',
      title: 'Before and after: adding error handling',
      body: 'The agent generated a data fetching function without error handling. Here is the fix.',
      language: 'typescript',
      filename: 'src/actions/get-user.ts',
      before: 'export async function getUser(id: string) {\n  const response = await fetch(`/api/users/${id}`)\n  const data = await response.json()\n  return data.user\n}',
      after: 'export async function getUser(id: string) {\n  const response = await fetch(`/api/users/${id}`)\n  if (!response.ok) {\n    throw new Error(`Failed to fetch user: ${response.status}`)\n  }\n  const data = await response.json()\n  if (!data.user) {\n    throw new Error(`User not found: ${id}`)\n  }\n  return data.user\n}',
      explanation: 'Two checks added: response.ok catches HTTP errors (404, 500). The null check on data.user prevents "Cannot read property of undefined" errors downstream.',
    },
    {
      type: 'info',
      title: 'Mistake 2: Wrong assumptions about data',
      body: "The agent assumes data is always present, always the right shape, always in the expected range. It writes `user.profile.avatar.url` without checking if profile or avatar exist. It uses `items[0]` without checking if the array is empty. It parses dates assuming ISO format when your API returns Unix timestamps. Every property access chain is a potential crash site.",
    },
    {
      type: 'info',
      title: 'Mistake 3: Skipped edge cases in CRUD',
      body: "Agent-built CRUD operations typically handle: create (with all fields), read (by ID), update (all fields), delete (by ID). They typically skip: create with missing optional fields, read for non-existent ID, update partial fields, delete with foreign key constraints, concurrent updates (optimistic locking), soft delete vs hard delete behavior. These gaps become production bugs.",
    },
    {
      type: 'multiple-choice',
      question: 'An agent builds a DELETE endpoint for posts. It runs `db.delete(posts).where(eq(posts.id, id))`. What edge case is most likely missing?',
      options: [
        'The delete does not return the deleted post',
        'There is no check if the post exists before deleting',
        'Comments referencing this post via foreign key will cause a constraint error',
        'The ID is not validated as a UUID',
      ],
      correctIndex: 2,
      explanation: 'Foreign key constraints are the most common missed edge case in agent-built deletes. If a comments table references posts.id, the delete will fail with a constraint violation. The agent needs to either cascade delete, soft-delete, or delete child records first. Agents rarely add this handling unless explicitly specified.',
    },
    {
      type: 'checkpoint',
      xp: 4,
      message: 'Common agent mistakes catalogued!',
    },

    // === VERIFICATION CHECKLIST ===
    {
      type: 'info',
      title: 'Building your verification checklist',
      body: "A verification checklist is a systematic scan you run on every piece of agent-generated code before committing. It is not about reading every line — it is about checking specific categories of issues that agents commonly produce. You will internalize this over time, but start by running through it deliberately.",
    },
    {
      type: 'interactive-diagram',
      title: 'Verification Categories',
      body: 'Scan agent code in this order. Each category catches a different class of bug.',
      diagram: {
        direction: 'TB',
        nodes: [
          { id: 'errors', label: 'Error Handling', sublabel: 'try/catch, response checks', shape: 'rounded', highlight: true },
          { id: 'null', label: 'Null Safety', sublabel: 'Optional chaining, fallbacks', shape: 'rounded' },
          { id: 'edge', label: 'Edge Cases', sublabel: 'Empty arrays, missing fields', shape: 'rounded' },
          { id: 'security', label: 'Security', sublabel: 'Input validation, auth checks', shape: 'rounded' },
          { id: 'data', label: 'Data Integrity', sublabel: 'Constraints, cascades, types', shape: 'rounded' },
          { id: 'async', label: 'Async Correctness', sublabel: 'Race conditions, awaits', shape: 'rounded' },
        ],
        edges: [
          { from: 'errors', to: 'null' },
          { from: 'null', to: 'edge' },
          { from: 'edge', to: 'security' },
          { from: 'security', to: 'data' },
          { from: 'data', to: 'async' },
        ],
      },
      stages: [
        {
          highlightNodes: ['errors'],
          highlightEdges: [{ from: 'errors', to: 'null' }],
          explanation: 'Start with error handling: check every fetch, DB call, and file read for try/catch and response.ok checks. This catches the most common agent mistake.',
        },
        {
          highlightNodes: ['null'],
          highlightEdges: [{ from: 'null', to: 'edge' }],
          explanation: 'Next, check null safety: look for missing optional chaining (?.), absent fallback defaults, and unchecked array access like items[0] without length checks.',
        },
        {
          highlightNodes: ['edge'],
          highlightEdges: [{ from: 'edge', to: 'security' }],
          explanation: 'Then scan for edge cases: empty arrays, missing optional fields, concurrent updates, and boundary values the agent did not consider.',
        },
        {
          highlightNodes: ['security'],
          highlightEdges: [{ from: 'security', to: 'data' }],
          explanation: 'Security scan: check for missing auth on API routes, unsanitized input, hardcoded secrets, and raw SQL string concatenation.',
        },
        {
          highlightNodes: ['data'],
          highlightEdges: [{ from: 'data', to: 'async' }],
          explanation: 'Data integrity: verify unique constraints, foreign key cascades, timestamp auto-updates, and that partial updates preserve existing data.',
        },
        {
          highlightNodes: ['async'],
          explanation: 'Finally, async correctness: look for missing await, unbounded Promise.all, sequential queries that should be parallel, and operations that need transactions.',
        },
      ],
    },
    {
      type: 'match',
      instruction: 'Match each verification category to the pattern you should search for:',
      leftItems: ['Error handling gaps', 'Null safety issues', 'Security vulnerabilities', 'Async correctness'],
      rightItems: ['grep for Promise.all with unbounded arrays, missing await', 'grep for .env, hardcoded keys, innerHTML, as any', 'grep for missing try/catch around fetch, db calls', 'grep for missing ?. optional chaining, no fallback defaults'],
      correctPairs: { 0: 2, 1: 3, 2: 1, 3: 0 },
      explanation: 'Each category has telltale patterns in code. Error handling: missing try/catch. Null safety: missing optional chaining. Security: hardcoded secrets. Async: unbounded Promise.all.',
    },
    {
      type: 'code-demo',
      title: 'The verification scan — error handling',
      body: 'For every external call, verify: what happens on failure? Is the error caught? Is it surfaced correctly?',
      language: 'bash',
      filename: 'verification-commands.sh',
      code: "# Find all fetch/axios calls and check for error handling\n# Look for fetch() without .ok check or try/catch\ngrep -rn \"await fetch\" src/ --include=\"*.ts\" --include=\"*.tsx\"\n\n# Find all database operations without try/catch\ngrep -rn \"await db\\.\" src/ --include=\"*.ts\" | grep -v \"try\"\n\n# Find unhandled promise patterns\ngrep -rn \"\\.then(\" src/ --include=\"*.ts\" --include=\"*.tsx\"",
    },
    {
      type: 'terminal',
      instruction: 'Search for fetch calls that might be missing error handling in the codebase.',
      expectedCommand: 'grep -rn "await fetch" src/ --include="*.ts" --include="*.tsx"',
      hint: 'Use grep to find all fetch calls across TypeScript files',
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'Verification checklist built!',
    },

    // === DATA INTEGRITY ===
    {
      type: 'info',
      title: 'Data integrity in agent-built CRUD',
      body: "The agent builds your database schema and CRUD operations. Now verify: Are unique constraints in place (duplicate emails, duplicate slugs)? Are foreign keys defined correctly? Do cascading deletes work as expected? Are timestamps auto-set? Is soft-delete implemented if required? Check the migration file — that is where the truth lives, not the TypeScript schema definition.",
    },
    {
      type: 'code-demo',
      title: 'Data integrity verification',
      body: 'Run these checks against agent-generated schema and CRUD operations.',
      language: 'typescript',
      filename: 'verify-integrity.ts',
      code: "// 1. Check: Can I create a duplicate? (unique constraints)\nawait db.insert(users).values({ email: 'test@test.com', name: 'A' })\nawait db.insert(users).values({ email: 'test@test.com', name: 'B' })\n// Expected: second insert throws unique violation\n\n// 2. Check: Can I delete a parent with children?\nawait db.delete(users).where(eq(users.id, userWithPosts.id))\n// Expected: either cascades (deletes posts) or throws FK violation\n\n// 3. Check: Partial updates preserve existing data\nawait db.update(users)\n  .set({ name: 'New Name' }) // Does NOT passing email null it out?\n  .where(eq(users.id, id))\n// Expected: email field unchanged\n\n// 4. Check: Timestamps auto-update\nawait db.update(posts).set({ title: 'Updated' }).where(eq(posts.id, id))\nconst post = await db.query.posts.findFirst({ where: eq(posts.id, id) })\n// Expected: updatedAt > createdAt",
    },
    {
      type: 'multiple-choice',
      question: 'The agent created a users table with an email column but no unique constraint. The TypeScript schema says `email: text("email").notNull()`. Is this safe?',
      options: [
        'Yes — notNull prevents duplicate empty emails',
        'No — notNull prevents null but allows duplicate emails, which will cause auth bugs',
        'Yes — the application code should handle uniqueness, not the database',
        'It depends on the ORM',
      ],
      correctIndex: 1,
      explanation: 'notNull only prevents NULL values, not duplicates. Without a unique constraint, two users can register with the same email, causing login ambiguity, data leaks, and auth bugs. Always verify unique constraints exist at the database level for fields like email, username, and slug.',
    },

    // === VERIFY BEFORE COMMIT WORKFLOW ===
    {
      type: 'info',
      title: 'The verify-before-commit workflow',
      body: "Never commit agent-generated code without verification. The workflow: (1) Agent generates code, (2) Review the diff — not the whole file, just what changed, (3) Run your verification checklist on the changed code, (4) Run the test suite, (5) Manually test the happy path AND one failure case, (6) Only then: git add and commit. This adds 5-10 minutes per commit but prevents hours of debugging bad code that \"looked fine\".",
    },
    {
      type: 'code-demo',
      title: 'Pre-commit verification script',
      body: 'Automate what you can. This script catches the most common agent mistakes before they reach your git history.',
      language: 'bash',
      filename: 'scripts/verify.sh',
      code: "#!/bin/bash\nset -e\n\necho \"=== Running verification checks ===\"\n\n# 1. TypeScript type check (catches wrong assumptions)\necho \"\\n--- Type checking ---\"\nnpx tsc --noEmit\n\n# 2. Lint (catches missing awaits, unused vars)\necho \"\\n--- Linting ---\"\nbun run lint\n\n# 3. Test suite\necho \"\\n--- Running tests ---\"\nbun test\n\n# 4. Check for common agent mistakes\necho \"\\n--- Checking for issues ---\"\n\n# Unhandled fetch calls\nUNHANDLED=$(grep -rn \"await fetch\" src/ --include=\"*.ts\" | grep -v \"try\" | grep -v \"response.ok\" | wc -l)\nif [ \"$UNHANDLED\" -gt 0 ]; then\n  echo \"WARNING: $UNHANDLED fetch calls may lack error handling\"\n  grep -rn \"await fetch\" src/ --include=\"*.ts\" | grep -v \"try\" | grep -v \"response.ok\"\nfi\n\n# Any type assertions (often a sign of shortcuts)\nASSERTIONS=$(grep -rn \"as any\" src/ --include=\"*.ts\" --include=\"*.tsx\" | wc -l)\nif [ \"$ASSERTIONS\" -gt 0 ]; then\n  echo \"WARNING: $ASSERTIONS 'as any' assertions found\"\nfi\n\necho \"\\n=== Verification complete ===\"",
    },
    {
      type: 'terminal',
      instruction: 'Run a quick type check to catch type errors in agent-generated code before committing.',
      expectedCommand: 'npx tsc --noEmit',
      hint: 'TypeScript compiler in check-only mode catches type errors without building',
    },
    {
      type: 'checkpoint',
      xp: 4,
      message: 'Verify-before-commit workflow established!',
    },

    // === ASYNC CORRECTNESS ===
    {
      type: 'info',
      title: 'Async verification: the hidden danger',
      body: "Agents frequently produce async code with subtle bugs: missing await (function returns a promise instead of the value), parallel operations that should be sequential (race conditions), sequential operations that could be parallel (performance), and unhandled promise rejections. These bugs do not always cause errors — they cause intermittent failures that are painful to debug in production.",
    },
    {
      type: 'code-demo',
      title: 'Async mistakes to check for',
      body: 'Common async patterns agents get wrong. Each looks correct at a glance.',
      language: 'typescript',
      filename: 'async-checks.ts',
      code: "// BUG: Missing await — returns Promise<void>, not void\nasync function saveAndNotify(data: Data) {\n  await db.insert(items).values(data)\n  sendNotification(data.userId) // Missing await! Fire-and-forget\n}\n\n// BUG: Sequential when parallel is safe\nasync function getDashboard(userId: string) {\n  const posts = await db.query.posts.findMany({ where: eq(posts.userId, userId) })\n  const comments = await db.query.comments.findMany({ where: eq(comments.userId, userId) })\n  const likes = await db.query.likes.findMany({ where: eq(likes.userId, userId) })\n  // These 3 queries are independent — should use Promise.all()\n}\n\n// BUG: Parallel when sequential is required\nasync function transferFunds(from: string, to: string, amount: number) {\n  await Promise.all([\n    db.update(accounts).set({ balance: sql`balance - ${amount}` }).where(eq(accounts.id, from)),\n    db.update(accounts).set({ balance: sql`balance + ${amount}` }).where(eq(accounts.id, to)),\n  ])\n  // Race condition! If first succeeds and second fails, money disappears.\n  // Should be in a transaction.\n}",
    },
    {
      type: 'multiple-choice',
      question: 'An agent writes: `const users = await Promise.all(userIds.map(id => db.query.users.findFirst({where: eq(users.id, id)})))`. What should you verify?',
      options: [
        'That Promise.all is imported correctly',
        'That the array is not too large — 1000 concurrent DB queries could overwhelm the connection pool',
        'That findFirst returns the right type',
        'Nothing — this pattern is correct',
      ],
      correctIndex: 1,
      explanation: 'Promise.all with unbounded arrays is a common agent mistake. If userIds has 500 items, you fire 500 concurrent queries. Databases have connection limits (typically 10-20 for serverless). You need chunking (process 10 at a time) or a single WHERE IN query instead.',
    },

    // === SECURITY QUICK-SCAN ===
    {
      type: 'info',
      title: 'Security quick-scan',
      body: "Agents do not think adversarially. They build for legitimate users. Quick security checks: (1) Are all API endpoints checking authorization? (2) Is user input validated/sanitized before use? (3) Are SQL queries parameterized (no string concatenation)? (4) Are file uploads validated for type and size? (5) Are secrets in environment variables, not hardcoded? One missing auth check is all it takes for a data breach.",
    },
    {
      type: 'code-demo',
      title: 'Security verification grep commands',
      body: 'Quick searches to find common security gaps in agent-generated code.',
      language: 'bash',
      filename: 'security-scan.sh',
      code: "# Check for hardcoded secrets\ngrep -rn \"sk_live\\|sk_test\\|password.*=.*['\\\"]\" src/ --include=\"*.ts\"\n\n# Check for raw SQL (potential injection)\ngrep -rn \"sql\\`.*\\${\" src/ --include=\"*.ts\"\n\n# Check API routes for auth middleware\n# Every route.ts should check session/auth\nfor f in $(find src/app/api -name \"route.ts\"); do\n  if ! grep -q \"auth\\|session\\|getUser\\|requireAuth\" \"$f\"; then\n    echo \"WARNING: $f may lack auth check\"\n  fi\ndone\n\n# Check for dangerouslySetInnerHTML\ngrep -rn \"dangerouslySetInnerHTML\" src/ --include=\"*.tsx\"",
    },
    {
      type: 'terminal',
      instruction: 'Check if any API routes are missing authentication checks.',
      expectedCommand: 'find src/app/api -name "route.ts" -exec grep -L "auth\\|session\\|getUser" {} \\;',
      hint: 'Use find with grep -L to find files that do NOT contain auth-related terms',
    },
    {
      type: 'checkpoint',
      xp: 4,
      message: 'Security verification added to workflow!',
    },

    // === PUTTING IT ALL TOGETHER ===
    {
      type: 'info',
      title: 'Your complete verification ritual',
      body: "After every agent output and before every commit: (1) Read the diff, (2) Check error handling on external calls, (3) Verify null safety on data access, (4) Confirm edge cases in CRUD, (5) Quick security scan on new endpoints, (6) Verify async correctness, (7) Run tsc + lint + tests, (8) Manual smoke test one happy path and one failure. This takes 10-15 minutes. It prevents 2-4 hours of debugging per week. The math is clear.",
    },
    {
      type: 'order',
      instruction: 'Order the verify-before-commit workflow steps:',
      items: [
        'Run automated checks (tsc, lint, tests)',
        'Manual smoke test: happy path + one failure',
        'Read the git diff of changed files',
        'Security quick-scan on new endpoints',
        'Check error handling and null safety',
        'Git commit the verified code',
      ],
      correctOrder: [2, 4, 3, 0, 1, 5],
    },
    {
      type: 'checklist',
      title: 'Verification habits:',
      items: [
        'I never commit agent code without reviewing the diff',
        'I check every external call for error handling',
        'I verify unique constraints and FK cascades in the schema',
        'I scan for missing auth checks on new endpoints',
        'I look for unbounded Promise.all and missing awaits',
        'I run tsc --noEmit before committing to catch type assumptions',
        'I test at least one failure case manually, not just the happy path',
      ],
    },
    {
      type: 'checkpoint',
      xp: 5,
      message: 'Verification complete! You know how to check AI code before putting it in front of users.',
    },
  ],
}

export default content
