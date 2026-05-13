import type { LessonContent } from './types'

const content: LessonContent = {
  lessonId: '3-7',
  steps: [
    // === INTRODUCTION (keep first passive) ===
    {
      type: 'info',
      title: 'When AI agents\'s changes overlap',
      body: "Two agents touched related files. Maybe both modified the router configuration. Maybe they imported different versions of a shared utility. The merge has conflicts — not because anyone failed, but because parallel work inherently creates overlapping zones. This lesson teaches you to resolve these conflicts by understanding intent, not just diff lines.",
    },
    // CONVERTED: info → multiple-choice (#1)
    {
      type: 'multiple-choice',
      question: 'What does a merge conflict tell you about your fleet decomposition?',
      options: [
        'Your decomposition was bad and you need to start over',
        'The agents made mistakes that need to be rolled back',
        'You found an edge case in your file ownership boundaries — every conflict teaches you where to draw sharper lines next time',
        'Parallel agent work is not reliable and should be avoided',
      ],
      correctIndex: 2,
      explanation: "A merge conflict doesn't mean your decomposition was bad. It means you found an edge case in your file ownership boundaries. Every conflict teaches you where to draw sharper lines next time. The goal isn't zero conflicts — it's fast, confident resolution when they occur.",
    },

    // === DIAGRAM 1 — CONVERTED: diagram → interactive-diagram (#2) ===
    {
      type: 'interactive-diagram',
      title: 'How Conflicts Arise in Fleet Work',
      body: "Agent A and Agent B both start from the same base. Each modifies files in their own domain. But when shared files (configs, routers, type definitions) get touched by both, the merge produces conflicts.",
      diagram: {
        direction: 'TB',
        nodes: [
          { id: 'base', label: 'Base', sublabel: 'main branch', shape: 'rounded' },
          { id: 'a', label: 'Agent A', sublabel: 'feat/auth', shape: 'rect' },
          { id: 'b', label: 'Agent B', sublabel: 'feat/api', shape: 'rect' },
          { id: 'conflict', label: 'Conflict!', sublabel: 'Shared file modified', shape: 'diamond', highlight: true },
          { id: 'resolve', label: 'Resolution', sublabel: 'Understand intent', shape: 'rect' },
          { id: 'merged', label: 'Merged', shape: 'pill', highlight: true },
        ],
        edges: [
          { from: 'base', to: 'a', label: 'branch' },
          { from: 'base', to: 'b', label: 'branch' },
          { from: 'a', to: 'conflict', label: 'modifies router' },
          { from: 'b', to: 'conflict', label: 'modifies router' },
          { from: 'conflict', to: 'resolve' },
          { from: 'resolve', to: 'merged' },
        ],
      },
      stages: [
        { highlightNodes: ['base', 'a', 'b'], highlightEdges: [{ from: 'base', to: 'a' }, { from: 'base', to: 'b' }], explanation: 'Both agents branch from the same base. Each works in its own worktree on its own branch.' },
        { highlightNodes: ['a', 'b', 'conflict'], highlightEdges: [{ from: 'a', to: 'conflict' }, { from: 'b', to: 'conflict' }], explanation: 'Both agents modify the same shared file (e.g., the router). Git cannot automatically merge both sets of changes.' },
        { highlightNodes: ['conflict', 'resolve', 'merged'], highlightEdges: [{ from: 'conflict', to: 'resolve' }, { from: 'resolve', to: 'merged' }], explanation: 'Resolution requires understanding each agent\'s INTENT, not just the diff lines. Combine both intents into the merged result.' },
      ],
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'You understand how parallel work creates merge conflicts.',
    },

    // === UNDERSTANDING INTENT — CONVERTED: info → multiple-choice (#3) ===
    {
      type: 'multiple-choice',
      question: 'When resolving a merge conflict between two agents, what should you read FIRST?',
      options: [
        'The git diff to see exactly which lines changed',
        'The git log to see which agent committed first',
        'Each agent\'s task spec to understand what they were trying to accomplish',
        'Stack Overflow for merge conflict resolution tips',
      ],
      correctIndex: 2,
      explanation: "A git diff shows you WHAT changed. It doesn't tell you WHY. When resolving agent conflicts, you need to understand each agent's intent: what were they trying to accomplish? A line that looks wrong in isolation might be critical to one agent's feature. Read the task spec, not just the diff.",
    },
    // CONVERTED: code-demo (conflict) → code-fill (#4)
    {
      type: 'code-fill',
      instruction: 'This is a merge conflict between two agents. Both modified the main router. Fill in what each agent was adding:',
      language: 'typescript',
      filename: 'src/routes/index.ts',
      template: 'import { Hono } from \'hono\'\n\nconst app = new Hono()\n\n// Auth agent added:\nimport { {{authImport}} } from \'../auth/routes\'\napp.route(\'/auth\', authRoutes)\napp.use(\'/api/*\', {{middlewareName}})\n\n// API agent added:\nimport { {{taskImport}} } from \'../api/routes/tasks\'\nimport { healthRoutes } from \'../api/routes/health\'\napp.route(\'/api/tasks\', taskRoutes)\napp.route(\'/api/{{healthPath}}\', healthRoutes)\n\nexport default app',
      blanks: [
        { id: 'authImport', answer: 'authRoutes', placeholder: 'auth export?', hint: 'The named export for auth route handlers' },
        { id: 'middlewareName', answer: 'authMiddleware', alternatives: ['middleware'], placeholder: 'middleware?', hint: 'The JWT verification middleware that protects API routes' },
        { id: 'taskImport', answer: 'taskRoutes', placeholder: 'task export?', hint: 'The named export for task CRUD route handlers' },
        { id: 'healthPath', answer: 'health', placeholder: 'endpoint path?', hint: 'The URL path for the health check endpoint' },
      ],
      explanation: 'These changes are additive — both agents added routes to the same file. The resolution keeps both sets of imports and route registrations. The order matters: middleware before the routes it protects.',
    },
    {
      type: 'multiple-choice',
      question: 'Looking at this conflict, what\'s the correct resolution?',
      options: [
        'Keep only the auth agent\'s changes (they were first)',
        'Keep only the API agent\'s changes (they\'re more important)',
        'Keep BOTH — they\'re additive, not contradictory',
        'Rewrite the file from scratch',
      ],
      correctIndex: 2,
      explanation: "These changes are additive — both agents added routes to the same file. The resolution is to keep both sets of imports and route registrations. The conflict exists because git can't tell that both changes are complementary, not contradictory. Understanding intent reveals this immediately.",
    },
    // CONVERTED: code-demo (resolution) → code-fill (#5)
    {
      type: 'code-fill',
      instruction: 'Complete the correct resolution that preserves both agents\' intents. Order matters: middleware before the routes it protects.',
      language: 'typescript',
      filename: 'src/routes/index.ts',
      template: 'import { Hono } from \'hono\'\nimport { authRoutes } from \'../auth/routes\'\nimport { {{mwImport}} } from \'../auth/middleware\'\nimport { taskRoutes } from \'../api/routes/tasks\'\nimport { healthRoutes } from \'../api/routes/health\'\n\nconst app = new Hono()\n\n// Auth routes (public)\napp.route(\'/{{authPath}}\', authRoutes)\n\n// Protected API routes\napp.use(\'/api/*\', {{mwName}})\napp.route(\'/api/tasks\', {{taskVar}})\napp.route(\'/api/health\', healthRoutes)\n\nexport default app',
      blanks: [
        { id: 'mwImport', answer: 'authMiddleware', placeholder: 'middleware import?', hint: 'The named export from the auth middleware file' },
        { id: 'authPath', answer: 'auth', placeholder: 'auth route path?', hint: 'The URL prefix for authentication endpoints' },
        { id: 'mwName', answer: 'authMiddleware', placeholder: 'middleware var?', hint: 'Same variable name as the import' },
        { id: 'taskVar', answer: 'taskRoutes', placeholder: 'task router var?', hint: 'The variable holding the task route handlers' },
      ],
      explanation: 'Both agents\' intents are preserved. Auth routes come first (public), then middleware protects all API routes, then task and health routes are registered. The order ensures middleware runs before the routes it protects.',
    },
    {
      type: 'code-diff',
      title: 'Resolving a merge conflict',
      body: 'Here is a real conflict resolution. The left agent added error handling, the right agent added logging. The resolution keeps both changes in a logical order.',
      language: 'typescript',
      filename: 'src/api/handler.ts',
      before: 'export async function handleRequest(req: Request) {\n  const data = await fetchData(req.url)\n  return new Response(JSON.stringify(data))\n}',
      after: 'export async function handleRequest(req: Request) {\n  try {\n    console.log(`[API] Processing ${req.url}`)\n    const data = await fetchData(req.url)\n    console.log(`[API] Success: ${data.length} items`)\n    return new Response(JSON.stringify(data))\n  } catch (error) {\n    console.error(`[API] Failed: ${error.message}`)\n    return new Response(JSON.stringify({ error: error.message }), { status: 500 })\n  }\n}',
    },
    // === COMPARE (already interactive) ===
    {
      type: 'compare',
      title: 'Manual vs structured resolution',
      body: 'Two approaches to the same merge conflict. Manual resolution reads diffs line by line. Structured resolution starts by understanding each agent\'s intent before touching any code.',
      question: 'Which approach produces fewer regressions in the merged result?',
      correctSide: 'right',
      left: {
        label: 'Manual (Line-by-line)',
        content: "1. Open the conflicted file\n2. Read the <<<<<<< and >>>>>>> markers\n3. Eyeball both versions\n4. Pick lines that \"look right\"\n5. Delete conflict markers\n6. Hope nothing breaks\n\nRisks:\n- Miss subtle intent behind a change\n- Accidentally drop a needed import\n- Ordering errors (middleware after routes)\n- No systematic verification",
      },
      right: {
        label: 'Structured (Intent-first)',
        content: "1. Read Agent A's task spec: what was it trying to do?\n2. Read Agent B's task spec: what was it trying to do?\n3. Classify: additive, contradictory, or structural?\n4. Merge by combining intents, not just lines\n5. Verify: does the result satisfy BOTH specs?\n6. Test the merged code\n\nBenefits:\n- Intent-aware merging catches hidden dependencies\n- Ordering reflects actual execution flow\n- Systematic verification against specs",
      },
      explanation: 'Manual resolution treats conflicts as a text problem. Structured resolution treats them as an intent problem. When you understand WHY each agent made its changes, you can merge semantically — keeping the logic correct, not just the syntax.',
    },

    // === MATCH (already interactive) ===
    {
      type: 'match',
      instruction: 'Match each conflict type to the best resolution strategy:',
      leftItems: [
        'Same line edited differently',
        'New function added by both agents',
        'Import conflicts',
        'Style/formatting differences',
      ],
      rightItems: [
        'Keep both functions, rename if names collide',
        'Choose the semantically correct version based on intent',
        'Merge import lists (union of both)',
        'Apply project conventions from CLAUDE.md',
      ],
      correctPairs: { 0: 1, 1: 0, 2: 2, 3: 3 },
      explanation: 'Same-line edits require understanding intent to pick the right version. Duplicate functions are usually additive — keep both. Import conflicts are almost always resolved by merging the lists. Style differences should defer to project conventions, not individual agent preferences.',
    },

    {
      type: 'checkpoint',
      xp: 5,
      message: 'You resolve conflicts by understanding intent, not just picking sides.',
    },

    // === RESOLUTION STRATEGIES — CONVERTED: info → multiple-choice (#6) ===
    {
      type: 'multiple-choice',
      question: 'What are the three types of merge conflicts in fleet work?',
      options: [
        'Syntax errors, logic errors, and runtime errors',
        'Additive (both added things), contradictory (opposing decisions), and structural (different reorganizations)',
        'Simple, medium, and complex',
        'Git conflicts, TypeScript conflicts, and runtime conflicts',
      ],
      correctIndex: 1,
      explanation: "Not all conflicts are the same. Additive conflicts (both agents added things) are easy — keep both. Contradictory conflicts (agents made opposing decisions) require judgment. Structural conflicts (agents reorganized the same file differently) may need a third approach entirely.",
    },
    // CONVERTED: code-demo (Strategy 1) → code-fill (#7)
    {
      type: 'code-fill',
      instruction: 'Complete the manual merge commands for resolving an additive conflict:',
      language: 'bash',
      filename: 'terminal',
      template: '# See what conflicts exist\ngit {{statusCmd}}\n\n# Open the conflicted file and combine both sides\n# (keep both agents\' additions, fix ordering)\n\n# Mark resolved\ngit {{addCmd}} src/routes/index.ts\ngit commit -m "{{commitMsg}}"',
      blanks: [
        { id: 'statusCmd', answer: 'status', placeholder: 'check command?', hint: 'See the current state of the working tree' },
        { id: 'addCmd', answer: 'add', placeholder: 'stage command?', hint: 'Stage the resolved file for commit' },
        { id: 'commitMsg', answer: 'merge: combine auth and api routes', alternatives: ['merge: combine auth and API routes', 'merge auth and api routes'], placeholder: 'commit message?', hint: 'Describe what was merged' },
      ],
      explanation: 'For additive conflicts, the resolution is straightforward: open the file, keep both sides\' additions, fix the ordering, stage it, and commit. This is the most common case in well-decomposed fleet work.',
    },
    // CONVERTED: code-demo (Strategy 2) → code-fill (#8)
    {
      type: 'code-fill',
      instruction: 'Complete this agent-assisted merge prompt for complex conflicts:',
      language: 'markdown',
      filename: 'merge-assist-prompt.md',
      template: '# Merge Assistance Task\n\n## Context\nTwo agents modified src/lib/{{conflictFile}}. I need help resolving.\n\n## Agent A\'s Intent (from its task spec)\nAdd connection {{poolFeature}} with a max of 10 connections.\nAdd a query timeout of 30 seconds.\n\n## Agent B\'s Intent (from its task spec)\nAdd {{txFeature}} support with automatic rollback on error.\nAdd query logging for debugging.\n\n## Task\nCombine both agents\' changes into a single coherent file\nthat satisfies {{howMany}} specs. If there\'s a true contradiction\n(not just an overlap), flag it for me to decide.',
      blanks: [
        { id: 'conflictFile', answer: 'database.ts', alternatives: ['database'], placeholder: 'which file?', hint: 'The shared database utility file both agents modified' },
        { id: 'poolFeature', answer: 'pooling', alternatives: ['pool'], placeholder: 'Agent A feature?', hint: 'Managing a pool of database connections' },
        { id: 'txFeature', answer: 'transaction', alternatives: ['transactions'], placeholder: 'Agent B feature?', hint: 'Database operations that succeed or fail as a unit' },
        { id: 'howMany', answer: 'BOTH', alternatives: ['both'], placeholder: 'how many specs?', hint: 'The merge must satisfy both agents\' requirements' },
      ],
      explanation: 'For complex conflicts, give an agent both versions plus each agent\'s task spec. It can reason about the correct combination because it understands the intent behind each change, not just the diff.',
    },
    // CONVERTED: code-demo (Strategy 3) → code-fill (#9)
    {
      type: 'code-fill',
      instruction: 'Complete the commands for Strategy 3: re-run with better boundaries when the conflict is structural:',
      language: 'bash',
      filename: 'terminal',
      template: '# Abort the problematic merge\ngit merge {{abortFlag}}\n\n# Update CLAUDE.md with better file ownership boundaries\n# Agent A owns: src/lib/database-{{fileA}}.ts (new file)\n# Agent B owns: src/lib/database-{{fileB}}.ts (new file)\n# Shared: src/lib/database.ts imports from both ({{whoWrites}} writes)\n\n# Re-run the affected agent with the updated spec\n# Now each agent has {{ownership}} ownership — no conflict possible',
      blanks: [
        { id: 'abortFlag', answer: '--abort', placeholder: 'abort flag?', hint: 'The git merge flag to cancel and go back to pre-merge state' },
        { id: 'fileA', answer: 'pool', alternatives: ['pooling'], placeholder: 'Agent A file suffix?', hint: 'Matches Agent A\'s feature: connection pooling' },
        { id: 'fileB', answer: 'transactions', alternatives: ['tx'], placeholder: 'Agent B file suffix?', hint: 'Matches Agent B\'s feature: transaction support' },
        { id: 'whoWrites', answer: 'orchestrator', alternatives: ['you', 'the orchestrator'], placeholder: 'who writes shared files?', hint: 'The person coordinating the fleet' },
        { id: 'ownership', answer: 'exclusive', alternatives: ['separate', 'sole'], placeholder: 'ownership type?', hint: 'Each agent owns its file with no overlap' },
      ],
      explanation: 'When two agents fundamentally reorganized the same code differently, the fastest fix is to improve boundaries and re-run. Split the contested file into agent-owned pieces with a shared file only the orchestrator writes. This eliminates the conflict entirely.',
    },
    {
      type: 'multiple-choice',
      question: 'Two agents both refactored the same utility function differently. One made it async, the other split it into two functions. What strategy?',
      options: [
        'Manual merge — combine both refactors',
        'Agent-assisted — let an agent figure it out',
        'Re-run with better boundaries — the conflict is structural',
        'Keep whichever agent finished first',
      ],
      correctIndex: 2,
      explanation: "This is a structural conflict — two incompatible reorganizations of the same code. You can't combine 'make async' with 'split into two functions' without understanding which approach better serves the project. Better to clarify ownership and re-run one agent with the correct approach specified.",
    },
    {
      type: 'checkpoint',
      xp: 5,
      message: 'You know three resolution strategies and when to use each.',
    },

    // === PREVENTION — CONVERTED: info → multiple-choice (#10) ===
    {
      type: 'multiple-choice',
      question: 'After resolving a conflict, what should you do to prevent the same class of conflict in the future?',
      options: [
        'Hope it does not happen again',
        'Add a comment in the contested file saying "do not modify"',
        'Ask why two agents touched the same file, then update CLAUDE.md with explicit file ownership or split the file into agent-owned pieces',
        'Reduce the number of agents in future fleet runs',
      ],
      correctIndex: 2,
      explanation: "Every conflict is a lesson. After resolving, ask: why did two agents touch the same file? Common fixes: extract a shared file that only the orchestrator writes, split a large file into agent-owned pieces, or add a CLAUDE.md rule that explicitly assigns the contested file.",
    },
    // CONVERTED: code-demo → code-fill (#11)
    {
      type: 'code-fill',
      instruction: 'Complete this conflict prevention playbook for the top fleet conflict hotspots:',
      language: 'markdown',
      filename: 'conflict-prevention.md',
      template: '# Conflict Prevention Playbook\n\n## 1. Router/App Configuration Files\nProblem: Every agent adds its routes to the same file.\nFix: Each agent exports routes from its own directory.\n     {{whoRouter}} writes the top-level router that imports all.\n\n## 2. Package.json / Dependencies\nProblem: Multiple agents install different packages.\nFix: Orchestrator {{preAction}} all dependencies before dispatch.\n     CLAUDE.md lists approved packages — agents don\'t add new ones.\n\n## 3. Shared Type Definitions\nProblem: Agents extend the same interface differently.\nFix: {{contractFile}} is {{accessMode}}. Each agent defines local types\n     that extend the shared ones in their own directories.\n\n## 4. CSS / Global Styles\nProblem: Agents add conflicting global styles.\nFix: {{cssStrategy}} (no globals). Each component is\n     self-contained. No agent modifies global.css.',
      blanks: [
        { id: 'whoRouter', answer: 'Orchestrator', alternatives: ['orchestrator', 'You', 'you'], placeholder: 'who writes the router?', hint: 'The person coordinating the fleet, not an agent' },
        { id: 'preAction', answer: 'pre-installs', alternatives: ['installs', 'pre-install'], placeholder: 'dependency action?', hint: 'Install all needed packages before agents start' },
        { id: 'contractFile', answer: 'contracts.ts', alternatives: ['contracts', 'the contracts file'], placeholder: 'shared types file?', hint: 'The file containing shared interface definitions' },
        { id: 'accessMode', answer: 'read-only', alternatives: ['readonly', 'read only'], placeholder: 'access level?', hint: 'Agents can read it but not modify it' },
        { id: 'cssStrategy', answer: 'Tailwind utility-first', alternatives: ['Tailwind', 'tailwind utility-first', 'Utility-first CSS'], placeholder: 'CSS approach?', hint: 'A utility-first CSS framework that avoids global styles' },
      ],
      explanation: 'Each prevention rule eliminates a class of conflict before agents start. The orchestrator owns shared files. Dependencies are pre-installed. Contracts are read-only. CSS uses utility classes instead of globals.',
    },
    {
      type: 'order',
      instruction: 'After resolving a conflict, rank these prevention actions from MOST effective (top) to LEAST effective:',
      items: [
        'Update CLAUDE.md with explicit file ownership for the contested area',
        'Split the contested file into agent-owned pieces',
        'Add a comment in the file saying "don\'t modify this"',
        'Tell agents verbally to avoid that file next time',
      ],
      correctOrder: [1, 0, 2, 3],
    },

    // === HANDS-ON EXERCISE ===
    {
      type: 'terminal',
      instruction: 'Start merging the API branch and see the conflict:',
      expectedCommand: 'git merge feat/api --no-ff',
      hint: 'Use git merge with --no-ff flag',
    },
    {
      type: 'terminal',
      instruction: 'See which files have conflicts:',
      expectedCommand: 'git diff --name-only --diff-filter=U',
      hint: 'git diff with --name-only and --diff-filter=U shows only conflicted (unmerged) files',
    },
    {
      type: 'terminal',
      instruction: 'After resolving the conflict in your editor, mark it resolved and complete the merge:',
      expectedCommand: 'git add . && git commit --no-edit',
      hint: 'Stage the resolved files and commit (--no-edit uses the default merge message)',
    },

    // === DIAGRAM 2 — CONVERTED: diagram → interactive-diagram (#12 — bonus) ===
    {
      type: 'interactive-diagram',
      title: 'Conflict Resolution Decision Tree',
      body: "Use this decision tree when you encounter a merge conflict. The nature of the conflict determines the strategy.",
      diagram: {
        direction: 'TB',
        nodes: [
          { id: 'conflict', label: 'Conflict', shape: 'rounded' },
          { id: 'nature', label: 'Nature?', shape: 'diamond' },
          { id: 'additive', label: 'Additive', sublabel: 'Both added things', shape: 'rect' },
          { id: 'contra', label: 'Contradictory', sublabel: 'Opposing choices', shape: 'rect' },
          { id: 'struct', label: 'Structural', sublabel: 'Different reorgs', shape: 'rect' },
          { id: 'combine', label: 'Combine Both', shape: 'pill', highlight: true },
          { id: 'decide', label: 'Pick + Update Spec', shape: 'pill', highlight: true },
          { id: 'rerun', label: 'Re-run Agent', shape: 'pill', highlight: true },
        ],
        edges: [
          { from: 'conflict', to: 'nature' },
          { from: 'nature', to: 'additive', label: 'both add' },
          { from: 'nature', to: 'contra', label: 'opposing' },
          { from: 'nature', to: 'struct', label: 'reorganized' },
          { from: 'additive', to: 'combine' },
          { from: 'contra', to: 'decide' },
          { from: 'struct', to: 'rerun' },
        ],
      },
      stages: [
        { highlightNodes: ['conflict', 'nature'], highlightEdges: [{ from: 'conflict', to: 'nature' }], explanation: 'First, classify the conflict. Read each agent\'s task spec to understand their intent.' },
        { highlightNodes: ['nature', 'additive', 'combine'], highlightEdges: [{ from: 'nature', to: 'additive' }, { from: 'additive', to: 'combine' }], explanation: 'Additive: both agents added things to the same file. Keep both, fix ordering. Most common in well-decomposed fleet work.' },
        { highlightNodes: ['nature', 'contra', 'decide'], highlightEdges: [{ from: 'nature', to: 'contra' }, { from: 'contra', to: 'decide' }], explanation: 'Contradictory: agents made opposing decisions. Choose based on project needs and update the spec to prevent recurrence.' },
        { highlightNodes: ['nature', 'struct', 'rerun'], highlightEdges: [{ from: 'nature', to: 'struct' }, { from: 'struct', to: 'rerun' }], explanation: 'Structural: agents reorganized the same code differently. Abort the merge, improve boundaries in CLAUDE.md, re-run the affected agent.' },
      ],
    },
    {
      type: 'checklist',
      title: 'Conflict resolution checklist',
      items: [
        'Read each agent\'s task spec before looking at the diff',
        'Classify the conflict: additive, contradictory, or structural',
        'Additive: combine both sides, fix ordering',
        'Contradictory: choose based on project needs, update CLAUDE.md',
        'Structural: abort merge, improve boundaries, re-run affected agent',
        'After resolution: update CLAUDE.md to prevent this class of conflict',
        'Document the pattern in your conflict prevention playbook',
      ],
    },
    {
      type: 'checkpoint',
      xp: 7,
      message: 'Conflict resolution learned! Overlapping changes are normal and fixable.',
    },
  ],
}

export default content
