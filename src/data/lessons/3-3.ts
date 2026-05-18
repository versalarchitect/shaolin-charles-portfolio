import type { LessonContent } from './types'

const content: LessonContent = {
  lessonId: '3-3',
  steps: [
    // === INTRO ===
    {
      type: 'info',
      title: 'Preventing AI agents from overwriting each other',
      body: "You spin up three Claude Code agents on the same repo. Agent 1 edits src/auth.ts. Agent 2 edits src/auth.ts. Agent 3 reads a stale version of src/auth.ts. One overwrites the other. The third agent's work is based on code that no longer exists. Welcome to the number-one reason parallel agents fail: they're all fighting over the same working directory.",
    },
    {
      type: 'info',
      title: 'Worktrees solve this completely',
      body: "Git worktrees give each agent its own working directory with its own branch -- but they all share the same .git history. No copies, no clones, no sync issues. Each agent writes to its own folder, on its own branch, and when they're done you merge. It's the difference between three chefs sharing one cutting board and three chefs with their own stations.",
    },

    // === DIAGRAM 1: WORKTREE ISOLATION ===
    {
      type: 'interactive-diagram',
      title: 'Worktree Isolation',
      body: 'Three agents work in separate worktrees on separate branches. Step through to see how isolation works.',
      diagram: {
        direction: 'TB',
        nodes: [
          { id: 'repo', label: 'Main Repo', sublabel: 'main branch', shape: 'rounded', highlight: true },
          { id: 'wt-a', label: 'Worktree A', sublabel: 'Agent 1', shape: 'rect' },
          { id: 'wt-b', label: 'Worktree B', sublabel: 'Agent 2', shape: 'rect' },
          { id: 'wt-c', label: 'Worktree C', sublabel: 'Agent 3', shape: 'rect' },
          { id: 'merge', label: 'Merge', shape: 'pill', highlight: true },
        ],
        edges: [
          { from: 'repo', to: 'wt-a' },
          { from: 'repo', to: 'wt-b' },
          { from: 'repo', to: 'wt-c' },
          { from: 'wt-a', to: 'merge' },
          { from: 'wt-b', to: 'merge' },
          { from: 'wt-c', to: 'merge' },
        ],
      },
      stages: [
        {
          highlightNodes: ['repo'],
          explanation: 'Your main repo sits on the main branch. This is where the final merged code lives.',
        },
        {
          highlightNodes: ['repo', 'wt-a', 'wt-b', 'wt-c'],
          highlightEdges: [{ from: 'repo', to: 'wt-a' }, { from: 'repo', to: 'wt-b' }, { from: 'repo', to: 'wt-c' }],
          explanation: 'Each agent gets its own worktree directory with its own branch. They share the .git database but have completely separate file systems. No conflicts during work.',
        },
        {
          highlightNodes: ['wt-a', 'wt-b', 'wt-c', 'merge'],
          highlightEdges: [{ from: 'wt-a', to: 'merge' }, { from: 'wt-b', to: 'merge' }, { from: 'wt-c', to: 'merge' }],
          explanation: 'When agents finish, merge their branches back to main. Conflicts only happen at merge time — and with good file ownership, they are rare.',
        },
      ],
    },
    {
      type: 'checkpoint',
      xp: 2,
      message: 'You see the architecture!',
    },

    // === WHAT IS A WORKTREE ===
    {
      type: 'compare',
      hint: 'Look at the key differences between the two approaches.',
      title: 'Worktree vs Clone',
      body: 'Two ways to give agents separate working directories. One is lightweight and fast, the other is heavy and slow.',
      question: 'Which approach is better for parallel agents working on the same project?',
      correctSide: 'left',
      left: {
        label: 'Git Worktree',
        content: "git worktree add ../agent-auth -b feat/auth\n\n- Milliseconds to create\n- Shares .git history with main repo\n- Branches visible across all worktrees\n- Merging is local (same repo)\n- Lightweight: no duplicate data\n- One remote to push/pull",
      },
      right: {
        label: 'Git Clone',
        content: "git clone repo-url ../agent-auth-clone\n\n- Minutes to create (full copy)\n- Separate .git history per clone\n- Branches NOT shared across clones\n- Must push/pull to coordinate\n- Heavy: full repo copy each time\n- Multiple remotes to manage",
      },
      explanation: 'Worktrees share everything under the hood — commits, branches, history, remotes. They are lightweight (milliseconds to create) and local branches are immediately visible across all worktrees. Clones duplicate everything and require push/pull to coordinate.',
    },
    {
      type: 'multiple-choice',
      hint: 'Read each option carefully — one fits the context best.',
      question: 'What do all worktrees in a repo share?',
      options: [
        'The same working directory files',
        'The same checked-out branch',
        'The same .git database and history',
        'The same uncommitted changes',
      ],
      correctIndex: 2,
      explanation: 'Worktrees share the .git database -- all commits, branches, tags, and remotes. But each worktree has its own working directory and its own checked-out branch. Uncommitted changes are isolated to each worktree.',
    },

    // === CORE COMMANDS ===
    {
      type: 'multiple-choice',
      hint: 'Eliminate the options that only partially fit.',
      question: 'Git worktrees boil down to four commands. Which command creates a new worktree with a new branch?',
      options: [
        'git worktree list -b <branch>',
        'git worktree add <path> -b <branch>',
        'git branch <branch> && git checkout <branch>',
        'git worktree create <path> <branch>',
      ],
      correctIndex: 1,
      explanation: 'git worktree add creates a new directory and checks out a branch in it. The -b flag creates a new branch. The four commands are: add (create), list (see all), remove (clean up), and prune (remove stale references).',
    },
    {
      type: 'code-fill',
      hint: 'Fill in values that match the pattern shown above.',
      instruction: 'Complete these git worktree commands for creating agent workspaces:',
      language: 'bash',
      filename: 'terminal',
      template: '# Create a worktree with a new branch\ngit worktree {{addCmd}} ../project-auth -b {{authBranch}}\n\n# Create a worktree for an existing branch\ngit worktree {{addCmd}} ../project-api {{apiBranch}}\n\n# Result: ../project-auth/ is now a full working directory\n# on the {{authBranch}} branch, ready for an agent',
      blanks: [
        { id: 'addCmd', answer: 'add', alternatives: [], placeholder: 'which subcommand?', hint: 'The git worktree subcommand that creates a new worktree' },
        { id: 'authBranch', answer: 'feat/auth', alternatives: ['feature/auth', 'auth'], placeholder: 'branch name?', hint: 'A feature branch for the auth work' },
        { id: 'apiBranch', answer: 'feat/api', alternatives: ['feature/api', 'api'], placeholder: 'existing branch?', hint: 'A feature branch for the API work' },
      ],
      explanation: 'git worktree add is the core command. With -b it creates a new branch. Without -b it checks out an existing branch. Each worktree gets its own directory that is a full working copy.',
    },
    {
      type: 'terminal',
      instruction: 'Create a new worktree at ../wt-auth on a branch called feat/auth:',
      expectedCommand: 'git worktree add ../wt-auth -b feat/auth',
      hint: 'Use git worktree add <path> -b <new-branch-name>',
    },
    {
      type: 'code-fill',
      hint: 'Use the exact syntax from the lesson examples.',
      instruction: 'Complete these worktree management commands:',
      language: 'bash',
      filename: 'terminal',
      template: '# List all worktrees\ngit worktree {{listCmd}}\n\n# Remove a worktree after merging\ngit worktree {{removeCmd}} ../project-auth\n\n# Clean up stale references\ngit worktree {{pruneCmd}}',
      blanks: [
        { id: 'listCmd', answer: 'list', alternatives: [], placeholder: 'which command?', hint: 'See all active worktrees' },
        { id: 'removeCmd', answer: 'remove', alternatives: ['rm'], placeholder: 'which command?', hint: 'Clean up a worktree directory' },
        { id: 'pruneCmd', answer: 'prune', alternatives: [], placeholder: 'which command?', hint: 'Remove stale worktree references' },
      ],
      explanation: 'list shows all active worktrees with their branches. remove deletes the worktree directory and unlinks it. prune cleans up references to worktrees that were manually deleted.',
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'Core commands locked in!',
    },

    // === DIAGRAM 2: WORKTREE LIFECYCLE ===
    {
      type: 'interactive-diagram',
      title: 'Worktree Lifecycle',
      body: 'Every worktree follows this lifecycle. Step through each phase.',
      diagram: {
        direction: 'LR',
        nodes: [
          { id: 'create', label: 'Create', shape: 'rounded' },
          { id: 'branch', label: 'Branch' },
          { id: 'work', label: 'Work' },
          { id: 'test', label: 'Test' },
          { id: 'merge', label: 'Merge' },
          { id: 'cleanup', label: 'Cleanup', shape: 'pill', highlight: true },
        ],
        edges: [
          { from: 'create', to: 'branch' },
          { from: 'branch', to: 'work' },
          { from: 'work', to: 'test' },
          { from: 'test', to: 'merge' },
          { from: 'merge', to: 'cleanup' },
        ],
      },
      stages: [
        {
          highlightNodes: ['create', 'branch'],
          highlightEdges: [{ from: 'create', to: 'branch' }],
          explanation: 'Create: run git worktree add to create an isolated directory with its own branch. Takes milliseconds. The agent now has its own filesystem sandbox.',
        },
        {
          highlightNodes: ['branch', 'work'],
          highlightEdges: [{ from: 'branch', to: 'work' }],
          explanation: 'Work: the agent works freely in its worktree — editing, creating, deleting files. No other agent is affected. Complete isolation.',
        },
        {
          highlightNodes: ['work', 'test'],
          highlightEdges: [{ from: 'work', to: 'test' }],
          explanation: 'Test: run tests inside the worktree to verify the agent\'s work before merging. Catch issues early while the context is fresh.',
        },
        {
          highlightNodes: ['test', 'merge'],
          highlightEdges: [{ from: 'test', to: 'merge' }],
          explanation: 'Merge: switch to the main repo and git merge the feature branch. If file ownership was exclusive, this merges cleanly.',
        },
        {
          highlightNodes: ['merge', 'cleanup'],
          highlightEdges: [{ from: 'merge', to: 'cleanup' }],
          explanation: 'Cleanup: run git worktree remove and git branch -d to clean up. Back to a pristine state for the next run.',
        },
      ],
    },

    // === PRACTICAL SETUP ===
    {
      type: 'multiple-choice',
      hint: 'Focus on the primary goal, not secondary benefits.',
      question: 'You have a feature that breaks into three independent tasks: auth, API, and UI. Where should each agent work?',
      options: [
        'All three agents work in the main repo directory on different branches',
        'Each agent works in its own worktree directory, never in the main repo',
        'The first agent works in the main repo, the others in worktrees',
        'Each agent clones the repo to a separate directory',
      ],
      correctIndex: 1,
      explanation: 'Each agent works in a separate worktree directory on its own branch. Never in the main repo directory. This ensures complete file isolation — no agent can overwrite another\'s work.',
    },
    {
      type: 'code-fill',
      hint: 'Each blank follows the conventions demonstrated earlier.',
      instruction: 'Complete this full parallel setup for three agents with worktrees:',
      language: 'bash',
      filename: 'terminal',
      template: '# From your main repo directory\ngit worktree add ../myapp-auth -b {{authBranch}}\ngit worktree add ../myapp-api  -b {{apiBranch}}\ngit worktree add ../myapp-ui   -b {{uiBranch}}\n\n# Launch agents in separate terminals\n# Terminal 1:\ncd ../myapp-auth && claude "{{authTask}}"\n\n# Terminal 2:\ncd ../myapp-api && claude "Add CRUD endpoints for users"',
      blanks: [
        { id: 'authBranch', answer: 'feat/auth', alternatives: ['feature/auth'], placeholder: 'branch name?', hint: 'Feature branch for auth work' },
        { id: 'apiBranch', answer: 'feat/api', alternatives: ['feature/api'], placeholder: 'branch name?', hint: 'Feature branch for API work' },
        { id: 'uiBranch', answer: 'feat/ui', alternatives: ['feature/ui'], placeholder: 'branch name?', hint: 'Feature branch for UI work' },
        { id: 'authTask', answer: 'Implement JWT auth middleware', alternatives: ['Build JWT auth', 'Implement auth middleware', 'Build authentication'], placeholder: 'agent task?', hint: 'A one-sentence task for the auth agent' },
      ],
      explanation: 'Three worktrees, three branches, three agents. Each agent has complete isolation. The key command pattern: git worktree add <directory> -b <branch>, then cd into the directory and launch the agent.',
    },
    {
      type: 'code-input',
      instruction: 'Write the command to create a worktree at ../myapp-api on a new branch called feat/api:',
      placeholder: 'git worktree add _____ -b _____',
      answer: 'git worktree add ../myapp-api -b feat/api',
      hint: 'Pattern: git worktree add <path> -b <branch>',
    },
    {
      type: 'multiple-choice',
      hint: 'Think about which option is most specific to this concept.',
      question: 'Why should each agent run in its own worktree directory instead of the main repo?',
      options: [
        'The main repo is read-only',
        'Agents in the same directory will overwrite each other\'s files',
        'Git does not allow multiple branches',
        'Claude Code can only open one file at a time',
      ],
      correctIndex: 1,
      explanation: 'If two agents edit the same file in the same directory, one will overwrite the other\'s changes. Separate worktrees mean separate file systems -- no conflicts during work, only at merge time.',
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'Parallel setup mastered!',
    },

    // === MERGE STRATEGY ===
    {
      type: 'multiple-choice',
      hint: 'Consider what the lesson content emphasized.',
      question: 'All three agents finish. You need to merge their branches back into main. What should you merge FIRST?',
      options: [
        'The largest branch (most changes)',
        'The most independent branch (fewest dependencies)',
        'The branch that finished first',
        'It does not matter — order is irrelevant',
      ],
      correctIndex: 1,
      explanation: 'Start with the branch that has zero dependencies on the others — usually the most isolated feature. Then merge the next one, resolving against the updated main. Finally, merge the branch most likely to touch shared code last, catching all conflicts in one pass.',
    },
    {
      type: 'code-fill',
      hint: 'Look at the surrounding code for context clues.',
      instruction: 'Complete this sequential merge strategy — auth first (independent), then api, then ui:',
      language: 'bash',
      filename: 'terminal',
      template: '# Back in your main repo directory\n\n# Step 1: Merge auth (no dependencies)\ngit {{mergeCmd}} feat/auth\n# Clean merge — auth is fully independent\n\n# Step 2: Merge api\ngit {{mergeCmd}} feat/api\n# Clean merge — api didn\'t touch auth files\n\n# Step 3: Merge ui (may conflict if it imports api types)\ngit {{mergeCmd}} {{uiBranch}}\n# If conflicts arise, resolve them here',
      blanks: [
        { id: 'mergeCmd', answer: 'merge', alternatives: [], placeholder: 'which command?', hint: 'The git command that combines branches' },
        { id: 'uiBranch', answer: 'feat/ui', alternatives: ['feature/ui'], placeholder: 'which branch?', hint: 'The UI feature branch' },
      ],
      explanation: 'Merge the most independent branch first, then work outward toward branches with more dependencies. This way, conflicts are concentrated in the final merge where you can handle them all at once.',
    },
    {
      type: 'order',
      hint: 'Consider what depends on what — prerequisites first.',
      instruction: 'Order these merge steps from first to last:',
      items: [
        'Merge the branch with most shared-code changes',
        'Resolve any conflicts',
        'Merge the most independent branch first',
        'Merge the middle-dependency branch',
      ],
      correctOrder: [2, 3, 0, 1],
    },

    // === DIAGRAM 3: BRANCH STRATEGY ===
    {
      type: 'interactive-diagram',
      title: 'Branch Strategy',
      body: 'Feature branches diverge from main, get reviewed, and merge back. Step through the parallel workflow.',
      diagram: {
        direction: 'TB',
        nodes: [
          { id: 'main-top', label: 'main', shape: 'rounded', highlight: true },
          { id: 'auth', label: 'feat/auth', shape: 'rect' },
          { id: 'api', label: 'feat/api', shape: 'rect' },
          { id: 'ui', label: 'feat/ui', shape: 'rect' },
          { id: 'review', label: 'PR Review', shape: 'rect' },
          { id: 'main-end', label: 'main', shape: 'pill', highlight: true },
        ],
        edges: [
          { from: 'main-top', to: 'auth' },
          { from: 'main-top', to: 'api' },
          { from: 'main-top', to: 'ui' },
          { from: 'auth', to: 'review' },
          { from: 'api', to: 'review' },
          { from: 'ui', to: 'review' },
          { from: 'review', to: 'main-end' },
        ],
      },
      stages: [
        {
          highlightNodes: ['main-top'],
          highlightEdges: [{ from: 'main-top', to: 'auth' }, { from: 'main-top', to: 'api' }, { from: 'main-top', to: 'ui' }],
          explanation: 'All feature branches diverge from the same point on main. Each agent starts with identical code.',
        },
        {
          highlightNodes: ['auth', 'api', 'ui'],
          explanation: 'Agents work in parallel on their own branches in their own worktrees. Complete isolation — no coordination needed during the work phase.',
        },
        {
          highlightNodes: ['review'],
          highlightEdges: [{ from: 'auth', to: 'review' }, { from: 'api', to: 'review' }, { from: 'ui', to: 'review' }],
          explanation: 'All branches converge for PR review. You verify each branch independently, then merge in dependency order.',
        },
        {
          highlightNodes: ['main-end'],
          highlightEdges: [{ from: 'review', to: 'main-end' }],
          explanation: 'After review and merge, main has all three features integrated. Clean worktrees, delete feature branches, done.',
        },
      ],
    },

    // === CONFLICT RESOLUTION ===
    {
      type: 'multiple-choice',
      hint: 'One option stands out when you think about the core purpose.',
      question: 'Even with worktree isolation, Agent 1 adds a new export to src/index.ts and Agent 3 also adds an export to src/index.ts. What happens at merge?',
      options: [
        'Git automatically merges both additions perfectly',
        'Git may report a conflict because both modified the same file near the same lines',
        'The second merge overwrites the first — data is lost',
        'Worktrees prevent this from ever happening',
      ],
      correctIndex: 1,
      explanation: 'Even with perfect isolation, conflicts can occur when agents modify the same file. Git cannot always auto-merge adjacent changes. The fix is straightforward: keep both additions, remove the conflict markers, commit. Worktrees reduce conflicts from "constant nightmare" to "occasional and manageable."',
    },
    {
      type: 'code-fill',
      hint: 'The answer matches the API or syntax just explained.',
      instruction: 'Complete the conflict resolution — keep both exports from different agents:',
      language: 'typescript',
      filename: 'src/index.ts',
      template: '// Git shows conflict markers in the file:\n// <<<<<<< HEAD\n// export { AuthService } from \'./auth\'\n// =======\n// export { UserSettings } from \'./settings\'\n// >>>>>>> feat/ui\n\n// Resolution: keep {{resolution}}\nexport { {{export1}} } from \'./auth\'\nexport { {{export2}} } from \'./settings\'',
      blanks: [
        { id: 'resolution', answer: 'both exports', alternatives: ['both', 'both additions', 'both lines'], placeholder: 'keep what?', hint: 'Both agents added valid code — keep it all' },
        { id: 'export1', answer: 'AuthService', alternatives: ['authService'], placeholder: 'first export?', hint: 'The export added by the auth agent' },
        { id: 'export2', answer: 'UserSettings', alternatives: ['userSettings'], placeholder: 'second export?', hint: 'The export added by the UI agent' },
      ],
      explanation: 'When agents add non-overlapping code to the same file, the fix is almost always to keep both additions. Remove the <<<, ===, and >>> markers, keep both exports, and commit the merge.',
    },
    {
      type: 'multiple-choice',
      hint: 'Read each option carefully — one fits the context best.',
      question: 'Two agents both added new exports to the same index file. What is the most common resolution?',
      options: [
        'Delete one agent\'s export',
        'Keep both exports and remove the conflict markers',
        'Revert both branches and start over',
        'Move one export to a different file',
      ],
      correctIndex: 1,
      explanation: 'When agents add non-overlapping code to the same file, the fix is almost always to keep both additions. Remove the <<<, ===, and >>> markers, keep both exports, and commit the merge.',
    },
    {
      type: 'checkpoint',
      xp: 5,
      message: 'Conflict resolution handled!',
    },

    // === CLEANUP ===
    {
      type: 'multiple-choice',
      hint: 'Eliminate the options that only partially fit.',
      question: 'After merging all branches, you have three worktree directories still on disk. What should you do?',
      options: [
        'Leave them — they might be useful later',
        'Delete the directories manually with rm -rf',
        'Run git worktree remove for each, then git branch -d to delete merged branches',
        'Run git worktree prune to remove everything at once',
      ],
      correctIndex: 2,
      explanation: 'Proper cleanup: git worktree remove for each directory (unlinks it from git), then git branch -d for each merged branch. This leaves you in a clean state. Leftover worktrees drift from main and accumulate conflicts.',
    },
    {
      type: 'code-fill',
      hint: 'Fill in values that match the pattern shown above.',
      instruction: 'Complete the full cleanup sequence after merging:',
      language: 'bash',
      filename: 'terminal',
      template: '# Remove worktrees\ngit worktree {{removeCmd}} ../myapp-auth\ngit worktree {{removeCmd}} ../myapp-api\ngit worktree {{removeCmd}} ../myapp-ui\n\n# Delete merged branches\ngit branch {{deleteFlag}} feat/auth\ngit branch {{deleteFlag}} feat/api\ngit branch {{deleteFlag}} feat/ui\n\n# Verify clean state\ngit worktree {{verifyCmd}}',
      blanks: [
        { id: 'removeCmd', answer: 'remove', alternatives: ['rm'], placeholder: 'cleanup command?', hint: 'Remove the worktree directory' },
        { id: 'deleteFlag', answer: '-d', alternatives: ['--delete', '-D'], placeholder: 'which flag?', hint: 'Delete a merged branch safely' },
        { id: 'verifyCmd', answer: 'list', alternatives: [], placeholder: 'verify command?', hint: 'List all worktrees to confirm only main remains' },
      ],
      explanation: 'Remove worktrees first, then delete the branches, then verify with list. The -d flag for branch deletion is safe — it only deletes branches that have been fully merged. Use -D (capital) only to force-delete unmerged branches.',
    },
    {
      type: 'terminal',
      instruction: 'Remove the worktree at ../wt-auth after you have merged it:',
      expectedCommand: 'git worktree remove ../wt-auth',
      hint: 'Use git worktree remove <path>',
    },

    // === INTERACTIVE: CODE-FILL ===
    {
      type: 'code-fill',
      hint: 'Use the exact syntax from the lesson examples.',
      instruction: 'Complete the git worktree commands for setting up parallel agent workspaces:',
      language: 'shell',
      template: '# Create isolated worktrees for two agents\ngit worktree add ../{{dir1}} -b {{branch1}}\ngit worktree add ../{{dir2}} -b {{branch2}}\n\n# After agents finish, clean up\ngit worktree {{cleanup}} ../agent-auth\ngit worktree {{cleanup}} ../agent-api',
      blanks: [
        { id: 'dir1', answer: 'agent-auth', alternatives: ['wt-auth'], placeholder: 'directory name?', hint: 'Descriptive name for the auth agent workspace' },
        { id: 'branch1', answer: 'feat/auth', alternatives: ['feature/auth', 'auth'], placeholder: 'branch name?', hint: 'Feature branch for auth work' },
        { id: 'dir2', answer: 'agent-api', alternatives: ['wt-api'], placeholder: 'directory name?' },
        { id: 'branch2', answer: 'feat/api', alternatives: ['feature/api', 'api'], placeholder: 'branch name?' },
        { id: 'cleanup', answer: 'remove', alternatives: ['rm'], placeholder: 'cleanup command?', hint: 'Remove the worktree when done' },
      ],
      explanation: 'Each agent gets its own directory and branch. They work in complete isolation — no file conflicts. After merging, remove the worktrees to clean up.',
    },

    // === INTERACTIVE: WORKTREE LIFECYCLE DIAGRAM ===
    {
      type: 'interactive-diagram',
      title: 'Worktree Lifecycle (Step Through)',
      body: 'Step through each phase of the worktree lifecycle to understand what happens at every stage.',
      diagram: {
        direction: 'LR',
        nodes: [
          { id: 'create', label: 'Create', shape: 'rounded' },
          { id: 'branch', label: 'Branch' },
          { id: 'work', label: 'Work' },
          { id: 'test', label: 'Test' },
          { id: 'merge', label: 'Merge' },
          { id: 'cleanup', label: 'Cleanup', shape: 'pill', highlight: true },
        ],
        edges: [
          { from: 'create', to: 'branch' },
          { from: 'branch', to: 'work' },
          { from: 'work', to: 'test' },
          { from: 'test', to: 'merge' },
          { from: 'merge', to: 'cleanup' },
        ],
      },
      stages: [
        { highlightNodes: ['create'], explanation: 'Run `git worktree add ../agent-dir -b feat/task` to create an isolated directory with its own branch. Takes milliseconds.' },
        { highlightNodes: ['create', 'branch'], highlightEdges: [{ from: 'create', to: 'branch' }], explanation: 'The new worktree checks out a fresh branch from your current HEAD. The agent now has its own filesystem sandbox.' },
        { highlightNodes: ['branch', 'work'], highlightEdges: [{ from: 'branch', to: 'work' }], explanation: 'The agent works freely in its worktree — editing, creating, deleting files. No other agent is affected.' },
        { highlightNodes: ['work', 'test'], highlightEdges: [{ from: 'work', to: 'test' }], explanation: 'Run tests inside the worktree to verify the agent\'s work before merging. Catch issues early.' },
        { highlightNodes: ['test', 'merge'], highlightEdges: [{ from: 'test', to: 'merge' }], explanation: 'Switch to the main repo and `git merge feat/task`. If file ownership was exclusive, this merges cleanly.' },
        { highlightNodes: ['merge', 'cleanup'], highlightEdges: [{ from: 'merge', to: 'cleanup' }], explanation: 'Run `git worktree remove ../agent-dir` and `git branch -d feat/task`. Clean slate for the next run.' },
      ],
    },

    // === ANTI-PATTERNS ===
    {
      type: 'multiple-choice',
      hint: 'Focus on the primary goal, not secondary benefits.',
      question: 'What happens if you try to check out the same branch in two worktrees?',
      options: [
        'It works fine — both worktrees share the branch',
        'Git creates a copy of the branch',
        'Git refuses and shows an error',
        'The second worktree becomes read-only',
      ],
      correctIndex: 2,
      explanation: 'Git enforces that each branch can only be checked out in one worktree at a time. This prevents two worktrees from making conflicting changes to the same branch reference. Three pitfalls to avoid: (1) same branch in two worktrees, (2) forgetting to commit before merging, (3) leaving worktrees around for weeks.',
    },

    // === CHECKLIST ===
    {
      type: 'checklist',
      title: 'Worktree workflow checklist:',
      items: [
        'I can create worktrees with git worktree add',
        'I know each agent needs its own worktree directory',
        'I understand that worktrees share .git but have separate files',
        'I merge the most independent branch first',
        'I can resolve conflicts when agents touch the same file',
        'I clean up worktrees and branches after merging',
        'I know one branch cannot be checked out in two worktrees',
      ],
    },
    {
      type: 'checkpoint',
      xp: 17,
      message: 'Worktree skills complete! You can run multiple AI agents at the same time without conflicts.',
    },
  ],
}

export default content
