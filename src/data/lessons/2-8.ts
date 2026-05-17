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
      type: 'multiple-choice',
      question: 'What is the single most frequent mistake in agent-generated code?',
      options: [
        'Using deprecated APIs',
        'Missing error handling on external calls (fetch, DB, file I/O)',
        'Incorrect variable naming conventions',
        'Forgetting to add comments',
      ],
      correctIndex: 1,
      explanation: "The most frequent agent mistake is missing error handling. A fetch call without try/catch. A database query that assumes success. A file read that does not handle 'file not found.' The agent writes the logic for when things work. Your job is to verify the logic for when things fail. Check every external call (API, DB, filesystem) for proper error handling.",
    },
    {
      type: 'code-fill',
      instruction: 'This agent-generated function has no failure path. Add the missing error handling checks:',
      language: 'typescript',
      filename: 'src/actions/get-user.ts',
      template: 'export async function getUser(id: string) {\n  const response = await fetch(`/api/users/${id}`)\n\n  if ({{response_check}}) {\n    throw new Error(`Failed to fetch user: ${response.status}`)\n  }\n\n  const data = await {{parse_body}}\n\n  if ({{null_check}}) {\n    return null\n  }\n\n  return data.user\n}',
      blanks: [
        { id: 'response_check', answer: '!response.ok', alternatives: ['response.status >= 400', 'response.status !== 200'], placeholder: 'check response?', hint: 'Check if the HTTP response indicates an error' },
        { id: 'parse_body', answer: 'response.json()', alternatives: ['response.json()', 'res.json()'], placeholder: 'parse body?', hint: 'Parse the JSON response body' },
        { id: 'null_check', answer: '!data.user', alternatives: ['data.user === null', 'data.user === undefined', '!data.user'], placeholder: 'null check?', hint: 'What if the user field is missing?' },
      ],
      explanation: 'Two checks added: !response.ok catches HTTP errors (404, 500). The null check on data.user prevents "Cannot read property of undefined" errors downstream. The agent wrote the happy path — you added the failure paths.',
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
      type: 'compare',
      title: 'Mistake 2: Wrong assumptions about data',
      body: 'The agent assumes data is always present and well-shaped. Compare the unsafe vs safe approach.',
      question: 'Which code safely handles potentially missing nested data?',
      correctSide: 'right',
      left: {
        label: 'Unsafe (agent default)',
        content: '// Assumes data is always present\nconst url = user.profile.avatar.url\nconst first = items[0].name\nconst date = new Date(record.createdAt)',
        language: 'typescript',
      },
      right: {
        label: 'Safe (your verification)',
        content: '// Guards against missing data\nconst url = user?.profile?.avatar?.url ?? null\nconst first = items.length > 0 ? items[0].name : null\nconst date = record.createdAt\n  ? new Date(record.createdAt) : null',
        language: 'typescript',
      },
      explanation: 'The agent writes user.profile.avatar.url without checking if profile or avatar exist. It uses items[0] without checking if the array is empty. Every property access chain is a potential crash site. Optional chaining (?.) and length checks are your safety net.',
    },
    {
      type: 'multiple-choice',
      question: 'Agent-built CRUD operations typically handle the happy path. Which edge case is MOST commonly skipped?',
      options: [
        'Create with all required fields present',
        'Read by a valid, existing ID',
        'Delete a record that has child records referencing it via foreign key',
        'Update all fields at once',
      ],
      correctIndex: 2,
      explanation: "Agent-built CRUD typically handles: create (all fields), read (by ID), update (all fields), delete (by ID). They skip: create with missing optional fields, read for non-existent ID, update partial fields, delete with foreign key constraints, concurrent updates (optimistic locking), soft delete vs hard delete. These gaps become production bugs.",
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
      type: 'code-fill',
      instruction: 'Complete these grep commands to find unhandled external calls in agent-generated code:',
      language: 'bash',
      filename: 'verification-commands.sh',
      template: '# Find all fetch calls and check for error handling\ngrep -rn "{{fetch_pattern}}" src/ --include="*.ts" --include="*.tsx"\n\n# Find all database operations without try/catch\ngrep -rn "{{db_pattern}}" src/ --include="*.ts" | grep -v "try"\n\n# Find unhandled promise patterns\ngrep -rn "{{promise_pattern}}" src/ --include="*.ts" --include="*.tsx"',
      blanks: [
        { id: 'fetch_pattern', answer: 'await fetch', alternatives: ['fetch('], placeholder: 'fetch pattern?', hint: 'What does an async fetch call look like?' },
        { id: 'db_pattern', answer: 'await db\\.', alternatives: ['await db.', 'db\\.query', 'db.insert\\|db.update\\|db.delete'], placeholder: 'DB pattern?', hint: 'How do database calls start?' },
        { id: 'promise_pattern', answer: '\\.then(', alternatives: ['.then(', '.then\\('], placeholder: 'promise pattern?', hint: 'Old-style promise chaining method' },
      ],
      explanation: 'For every external call, verify: what happens on failure? Is the error caught? Is it surfaced correctly? These grep patterns find the most common unhandled call sites.',
    },
    {
      type: 'terminal',
      instruction: 'Search for fetch calls that might be missing error handling in the codebase.',
      expectedCommand: 'grep -rn "await fetch" src/ --include="*.ts" --include="*.tsx"',
      hint: 'Use grep to find all fetch calls across TypeScript files',
      platforms: {
        windows: {
          instruction: 'Search for fetch calls that might be missing error handling in the codebase.',
          expectedCommand: 'Select-String -Recurse -Path "src/" -Include "*.ts","*.tsx" -Pattern "await fetch"',
          hint: 'Use Select-String to find all fetch calls across TypeScript files',
        },
      },
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'Verification checklist built!',
    },

    // === DATA INTEGRITY ===
    {
      type: 'match',
      instruction: 'Match each data integrity check to its expected database behavior:',
      leftItems: ['Insert duplicate email', 'Delete user who has posts', 'Update only the name field', 'Update any field in a row'],
      rightItems: ['updatedAt timestamp auto-updates', 'Throws unique constraint violation', 'Email field remains unchanged (not nulled)', 'Either cascades or throws FK violation'],
      correctPairs: { 0: 1, 1: 3, 2: 2, 3: 0 },
      explanation: 'The agent builds your schema and CRUD operations. Verify: unique constraints prevent duplicates, foreign keys cascade or block correctly, partial updates preserve untouched fields, and timestamps auto-update. Check the migration file — that is where the truth lives, not the TypeScript schema definition.',
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
      type: 'multiple-choice',
      question: 'What is the correct verify-before-commit workflow for agent-generated code?',
      options: [
        'Run tests, then commit if they pass',
        'Read the whole file, check it looks right, commit',
        'Review the diff, run verification checklist on changed code, run test suite, manually test happy path AND one failure case, then commit',
        'Ask the agent if the code is correct, then commit',
      ],
      correctIndex: 2,
      explanation: "Never commit agent-generated code without verification. The workflow: (1) Agent generates code, (2) Review the diff — not the whole file, just what changed, (3) Run your verification checklist on the changed code, (4) Run the test suite, (5) Manually test the happy path AND one failure case, (6) Only then: git add and commit. This adds 5-10 minutes per commit but prevents hours of debugging bad code that 'looked fine'.",
    },
    {
      type: 'code-fill',
      instruction: 'Complete this pre-commit verification script that catches common agent mistakes:',
      language: 'bash',
      filename: 'scripts/verify.sh',
      template: '#!/bin/bash\nset -e\n\n# 1. TypeScript type check (catches wrong assumptions)\n{{type_check}}\n\n# 2. Lint (catches missing awaits, unused vars)\n{{lint_cmd}}\n\n# 3. Check for unhandled fetch calls\nUNHANDLED=$(grep -rn "await fetch" src/ --include="*.ts" | grep -v "try" | grep -v "response.ok" | wc -l)\nif [ "$UNHANDLED" -gt 0 ]; then\n  echo "WARNING: $UNHANDLED fetch calls may lack error handling"\nfi\n\n# 4. Check for type escape hatches\nASSERTIONS=$(grep -rn "{{type_escape}}" src/ --include="*.ts" --include="*.tsx" | wc -l)\nif [ "$ASSERTIONS" -gt 0 ]; then\n  echo "WARNING: $ASSERTIONS type assertions found"\nfi',
      blanks: [
        { id: 'type_check', answer: 'npx tsc --noEmit', alternatives: ['tsc --noEmit', 'bunx tsc --noEmit'], placeholder: 'type check command?', hint: 'TypeScript compiler in check-only mode' },
        { id: 'lint_cmd', answer: 'bun run lint', alternatives: ['npm run lint', 'npx eslint src/'], placeholder: 'lint command?', hint: 'Run the project linter' },
        { id: 'type_escape', answer: 'as any', alternatives: ['as any', '// @ts-ignore'], placeholder: 'type escape?', hint: 'The TypeScript escape hatch that agents love' },
      ],
      explanation: 'Automate what you can. This script catches type errors, lint issues, unhandled fetch calls, and type escape hatches before they reach your git history.',
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
      type: 'order',
      instruction: 'Rank these async bugs from most dangerous (hardest to detect) to least:',
      items: [
        'Parallel mutations that should be in a transaction (race condition)',
        'Missing await on a notification call (fire-and-forget)',
        'Sequential queries that could be parallel (performance only)',
        'Unbounded Promise.all on a user-supplied array (connection exhaustion)',
      ],
      correctOrder: [0, 3, 1, 2],
    },
    {
      type: 'multiple-choice',
      question: 'An agent writes getDashboard() that runs 3 independent DB queries sequentially with await. What is the issue?',
      options: [
        'It will crash because queries cannot be sequential',
        'Nothing — sequential queries are always safer',
        'Performance: independent queries should use Promise.all() to run in parallel',
        'The database will lock between queries',
      ],
      correctIndex: 2,
      explanation: "Agents frequently produce sequential operations that could be parallel. Three independent queries with await run one-after-another, tripling response time. Use Promise.all() for independent queries. But remember: mutations that depend on each other (like transferFunds) should NOT be parallel — they need a transaction.",
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
      type: 'match',
      instruction: 'Match each security vulnerability to the grep command that detects it:',
      leftItems: ['Hardcoded API keys', 'SQL injection risk', 'Unprotected API routes', 'XSS vulnerability'],
      rightItems: ['grep -rn "dangerouslySetInnerHTML" src/ --include="*.tsx"', 'grep -rn "sk_live\\|sk_test\\|password.*=" src/ --include="*.ts"', 'find src/app/api -name "route.ts" -exec grep -L "auth\\|session" {} \\;', 'grep -rn "sql\\`.*\\${" src/ --include="*.ts"'],
      correctPairs: { 0: 1, 1: 3, 2: 2, 3: 0 },
      explanation: 'Agents do not think adversarially. They build for legitimate users. These grep patterns catch the most dangerous gaps: hardcoded secrets, raw SQL with interpolation, routes missing auth checks, and unsafe HTML injection. One missing check is all it takes for a data breach.',
    },
    {
      type: 'terminal',
      instruction: 'Check if any API routes are missing authentication checks.',
      expectedCommand: 'find src/app/api -name "route.ts" -exec grep -L "auth\\|session\\|getUser" {} \\;',
      hint: 'Use find with grep -L to find files that do NOT contain auth-related terms',
      platforms: {
        windows: {
          expectedCommand: 'Get-ChildItem -Recurse -Path "src/app/api" -Filter "route.ts" | Where-Object { -not (Select-String -Path $_ -Pattern "auth|session|getUser" -Quiet) }',
          hint: 'Use Get-ChildItem with Where-Object and Select-String to find files that do NOT contain auth-related terms',
        },
      },
    },
    {
      type: 'checkpoint',
      xp: 4,
      message: 'Security verification added to workflow!',
    },

    // === PUTTING IT ALL TOGETHER ===
    {
      type: 'multiple-choice',
      question: 'How much time does the full verification ritual add per commit, and how much debugging time does it prevent per week?',
      options: [
        '1-2 minutes per commit, prevents 30 minutes/week',
        '10-15 minutes per commit, prevents 2-4 hours/week',
        '30+ minutes per commit, prevents 1 hour/week',
        'No time cost — it is fully automated',
      ],
      correctIndex: 1,
      explanation: "After every agent output and before every commit: (1) Read the diff, (2) Check error handling on external calls, (3) Verify null safety on data access, (4) Confirm edge cases in CRUD, (5) Quick security scan on new endpoints, (6) Verify async correctness, (7) Run tsc + lint + tests, (8) Manual smoke test one happy path and one failure. This takes 10-15 minutes. It prevents 2-4 hours of debugging per week. The math is clear.",
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
