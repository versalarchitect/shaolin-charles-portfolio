import type { LessonContent } from './types'

const content: LessonContent = {
  lessonId: '3-7',
  steps: [
    // === INTRODUCTION ===
    {
      type: 'info',
      title: 'When AI agents\'s changes overlap',
      body: "Two agents touched related files. Maybe both modified the router configuration. Maybe they imported different versions of a shared utility. The merge has conflicts — not because anyone failed, but because parallel work inherently creates overlapping zones. This lesson teaches you to resolve these conflicts by understanding intent, not just diff lines.",
    },
    {
      type: 'info',
      title: 'Conflicts are feedback, not failures',
      body: "A merge conflict doesn't mean your decomposition was bad. It means you found an edge case in your file ownership boundaries. Every conflict teaches you where to draw sharper lines next time. The goal isn't zero conflicts — it's fast, confident resolution when they occur.",
    },

    // === DIAGRAM 1: How Conflicts Arise ===
    {
      type: 'diagram',
      title: 'How Conflicts Arise in Fleet Work',
      body: "Agent A and Agent B both start from the same base. Each modifies files in their own domain. But when shared files (configs, routers, type definitions) get touched by both, the merge produces conflicts. The key is understanding WHAT each agent intended.",
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
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'You understand how parallel work creates merge conflicts.',
    },

    // === UNDERSTANDING INTENT ===
    {
      type: 'info',
      title: 'Understanding intent: beyond the diff',
      body: "A git diff shows you WHAT changed. It doesn't tell you WHY. When resolving agent conflicts, you need to understand each agent's intent: what were they trying to accomplish? A line that looks wrong in isolation might be critical to one agent's feature. Read the task spec, not just the diff.",
    },
    {
      type: 'code-demo',
      title: 'A real merge conflict between two agents',
      body: "Agent A added auth routes. Agent B added API routes. Both modified the main router file. Git shows you this conflict — but which lines do you keep?",
      language: 'typescript',
      filename: 'src/routes/index.ts',
      code: `import { Hono } from 'hono'

const app = new Hono()

<<<<<<< feat/auth
// Auth agent added these
import { authRoutes } from '../auth/routes'
app.route('/auth', authRoutes)
app.use('/api/*', authMiddleware)
=======
// API agent added these
import { taskRoutes } from '../api/routes/tasks'
import { healthRoutes } from '../api/routes/health'
app.route('/api/tasks', taskRoutes)
app.route('/api/health', healthRoutes)
>>>>>>> feat/api

export default app`,
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
    {
      type: 'code-demo',
      title: 'The correct resolution',
      body: "Both agents' intents are preserved. Auth routes, middleware, API routes, and health routes all coexist. The order matters: middleware before the routes it protects.",
      language: 'typescript',
      filename: 'src/routes/index.ts',
      code: `import { Hono } from 'hono'
import { authRoutes } from '../auth/routes'
import { authMiddleware } from '../auth/middleware'
import { taskRoutes } from '../api/routes/tasks'
import { healthRoutes } from '../api/routes/health'

const app = new Hono()

// Auth routes (public)
app.route('/auth', authRoutes)

// Protected API routes
app.use('/api/*', authMiddleware)
app.route('/api/tasks', taskRoutes)
app.route('/api/health', healthRoutes)

export default app`,
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
    // === COMPARE: MANUAL vs STRUCTURED RESOLUTION ===
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

    // === MATCH: CONFLICT TYPES TO STRATEGIES ===
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

    // === RESOLUTION STRATEGIES ===
    {
      type: 'info',
      title: 'Three resolution strategies',
      body: "Not all conflicts are the same. Additive conflicts (both agents added things) are easy — keep both. Contradictory conflicts (agents made opposing decisions) require judgment. Structural conflicts (agents reorganized the same file differently) may need a third approach entirely.",
    },
    {
      type: 'code-demo',
      title: 'Strategy 1: Manual merge (additive conflicts)',
      body: "When both changes are additions to the same file, manually combine them. This is the most common case in well-decomposed fleet work.",
      language: 'bash',
      filename: 'terminal',
      code: `# See what conflicts exist
git status

# Open the conflicted file and combine both sides
# (keep both agents' additions, fix ordering)

# Mark resolved
git add src/routes/index.ts
git commit -m "merge: combine auth and api routes"`,
    },
    {
      type: 'code-demo',
      title: 'Strategy 2: Agent-assisted merge (complex conflicts)',
      body: "For complex conflicts where you need to understand deep context, use an agent to help. Give it both branches' versions and the spec for each agent. It can reason about the correct combination.",
      language: 'markdown',
      filename: 'merge-assist-prompt.md',
      code: `# Merge Assistance Task

## Context
Two agents modified src/lib/database.ts. I need help resolving.

## Agent A's Intent (from its task spec)
Add connection pooling with a max of 10 connections.
Add a query timeout of 30 seconds.

## Agent B's Intent (from its task spec)
Add transaction support with automatic rollback on error.
Add query logging for debugging.

## Agent A's Version
[paste Agent A's full file]

## Agent B's Version
[paste Agent B's full file]

## Task
Combine both agents' changes into a single coherent file
that satisfies BOTH specs. If there's a true contradiction
(not just an overlap), flag it for me to decide.`,
    },
    {
      type: 'code-demo',
      title: 'Strategy 3: Re-run with better boundaries (structural conflicts)',
      body: "When the conflict is deep — two agents fundamentally reorganized the same code differently — the fastest fix is to improve boundaries and re-run one agent. The cost of resolving a deep structural conflict often exceeds the cost of a re-run.",
      language: 'bash',
      filename: 'terminal',
      code: `# Abort the problematic merge
git merge --abort

# Update CLAUDE.md with better file ownership boundaries
# Agent A owns: src/lib/database-pool.ts (new file)
# Agent B owns: src/lib/database-transactions.ts (new file)
# Shared: src/lib/database.ts imports from both (orchestrator writes)

# Re-run the affected agent with the updated spec
# Now each agent has exclusive ownership — no conflict possible`,
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

    // === PREVENTION ===
    {
      type: 'info',
      title: 'Prevention: reducing future conflicts',
      body: "Every conflict is a lesson. After resolving, ask: why did two agents touch the same file? The answer tells you how to improve your decomposition. Common fixes: extract a shared file that only the orchestrator writes, split a large file into agent-owned pieces, or add a CLAUDE.md rule that explicitly assigns the contested file.",
    },
    {
      type: 'code-demo',
      title: 'Common conflict patterns and prevention',
      body: "These are the top 5 conflict hotspots in fleet work and how to eliminate each one before agents start.",
      language: 'markdown',
      filename: 'conflict-prevention.md',
      code: `# Conflict Prevention Playbook

## 1. Router/App Configuration Files
Problem: Every agent adds its routes to the same file.
Fix: Each agent exports routes from its own directory.
     Orchestrator writes the top-level router that imports all.

## 2. Package.json / Dependencies
Problem: Multiple agents install different packages.
Fix: Orchestrator pre-installs all dependencies before dispatch.
     CLAUDE.md lists approved packages — agents don't add new ones.

## 3. Shared Type Definitions
Problem: Agents extend the same interface differently.
Fix: contracts.ts is read-only. Each agent defines local types
     that extend the shared ones in their own directories.

## 4. Environment Variables / Config
Problem: Agents add different .env variables to the same file.
Fix: Each agent documents needed env vars in its task output.
     Orchestrator consolidates after merge.

## 5. CSS / Global Styles
Problem: Agents add conflicting global styles.
Fix: Tailwind utility-first (no globals). Each component is
     self-contained. No agent modifies global.css.`,
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
      type: 'info',
      title: 'Exercise: Resolve a fleet conflict',
      body: "You've merged feat/auth into main successfully. Now you're merging feat/api and it conflicts. Let's walk through the resolution process.",
    },
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

    // === DIAGRAM 2: Resolution Decision Tree ===
    {
      type: 'diagram',
      title: 'Conflict Resolution Decision Tree',
      body: "Use this decision tree when you encounter a merge conflict. The nature of the conflict determines the strategy. Additive = combine. Contradictory = choose or re-spec. Structural = re-run with better boundaries.",
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
