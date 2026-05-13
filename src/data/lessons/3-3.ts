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
      type: 'diagram',
      title: 'Worktree Isolation',
      body: 'Three agents work in separate worktrees on separate branches. No file conflicts. Clean merge at the end.',
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
    },
    {
      type: 'checkpoint',
      xp: 2,
      message: 'You see the architecture!',
    },

    // === WHAT IS A WORKTREE ===
    {
      type: 'info',
      title: 'What is a git worktree?',
      body: "A worktree is an additional working directory linked to your existing repo. Normally you have one working directory and switch branches with git checkout. Worktrees let you have multiple branches checked out simultaneously in different folders. Crucially, they all share the same .git database -- commits, branches, history, remotes. When Agent 1 commits in its worktree, Agent 2 can see that branch immediately.",
    },
    {
      type: 'info',
      title: 'Worktree vs. clone',
      body: "You might think: just clone the repo three times. That works but has problems. Three clones mean three copies of the full .git history, three sets of remotes to push/pull, and no shared branch visibility. Worktrees share everything under the hood. They're lightweight -- creating one takes milliseconds, not minutes. And when you merge, you're merging local branches, not coordinating across separate repos.",
    },
    {
      type: 'multiple-choice',
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
      type: 'info',
      title: 'The four commands you need',
      body: "Git worktrees boil down to four commands: add (create a new worktree), list (see all active worktrees), remove (clean up a worktree), and prune (remove stale worktree references). That's it. The simplicity is the point -- the power is in how you combine them with agents.",
    },
    {
      type: 'code-demo',
      title: 'Creating a worktree',
      body: 'The git worktree add command creates a new directory and checks out a branch in it. If the branch does not exist, use -b to create it.',
      language: 'bash',
      filename: 'terminal',
      code: '# Create a worktree with a new branch\ngit worktree add ../project-auth -b feat/auth\n\n# Create a worktree for an existing branch\ngit worktree add ../project-api feat/api\n\n# Result: ../project-auth/ is now a full working directory\n# on the feat/auth branch, ready for an agent',
    },
    {
      type: 'terminal',
      instruction: 'Create a new worktree at ../wt-auth on a branch called feat/auth:',
      expectedCommand: 'git worktree add ../wt-auth -b feat/auth',
      hint: 'Use git worktree add <path> -b <new-branch-name>',
    },
    {
      type: 'code-demo',
      title: 'Managing worktrees',
      body: 'List all worktrees to see what is active, and remove them when done.',
      language: 'bash',
      filename: 'terminal',
      code: '# List all worktrees\ngit worktree list\n# /home/user/project        abc1234 [main]\n# /home/user/project-auth   def5678 [feat/auth]\n# /home/user/project-api    ghi9012 [feat/api]\n\n# Remove a worktree after merging\ngit worktree remove ../project-auth\n\n# Clean up stale references\ngit worktree prune',
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'Core commands locked in!',
    },

    // === DIAGRAM 2: WORKTREE LIFECYCLE ===
    {
      type: 'diagram',
      title: 'Worktree Lifecycle',
      body: 'Every worktree follows this lifecycle: create it, branch off main, do the work, test it, merge it back, then clean up.',
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
    },

    // === PRACTICAL SETUP ===
    {
      type: 'info',
      title: 'Setting up 3 worktrees for parallel agents',
      body: "Here's the real workflow. You have a feature that breaks into three independent tasks: auth, API, and UI. You create three worktrees, launch three Claude Code agents, and point each one at its own directory. They work in parallel without any coordination needed. The key rule: each agent works in a separate worktree directory, never in the main repo directory.",
    },
    {
      type: 'code-demo',
      title: 'Full parallel setup',
      body: 'Create three worktrees, then launch agents in each one. Each agent gets its own isolated workspace.',
      language: 'bash',
      filename: 'terminal',
      code: '# From your main repo directory\ngit worktree add ../myapp-auth -b feat/auth\ngit worktree add ../myapp-api  -b feat/api\ngit worktree add ../myapp-ui   -b feat/ui\n\n# Launch agents in separate terminals\n# Terminal 1:\ncd ../myapp-auth && claude "Implement JWT auth middleware"\n\n# Terminal 2:\ncd ../myapp-api && claude "Add CRUD endpoints for users"\n\n# Terminal 3:\ncd ../myapp-ui && claude "Build the settings page component"',
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
      type: 'info',
      title: 'Merge order matters',
      body: "When all three agents finish, you need to merge their branches back into main. The order matters. Start with the branch that has zero dependencies on the others -- usually the most isolated feature. Then merge the next one. If it conflicts, you resolve against a main that already has the first merge. Finally, merge the branch most likely to touch shared code last, so you catch all conflicts in one pass.",
    },
    {
      type: 'code-demo',
      title: 'Sequential merge strategy',
      body: 'Merge auth first (independent), then api, then ui (which may depend on api types).',
      language: 'bash',
      filename: 'terminal',
      code: '# Back in your main repo directory\n\n# Step 1: Merge auth (no dependencies)\ngit merge feat/auth\n# Clean merge -- auth is fully independent\n\n# Step 2: Merge api\ngit merge feat/api\n# Clean merge -- api didn\'t touch auth files\n\n# Step 3: Merge ui (may conflict if it imports api types)\ngit merge feat/ui\n# If conflicts arise, resolve them here\n# You only deal with conflicts once, at the end',
    },
    {
      type: 'order',
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
      type: 'diagram',
      title: 'Branch Strategy',
      body: 'Feature branches diverge from main, get reviewed, and merge back. The parallel layer is where agents work simultaneously.',
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
    },

    // === CONFLICT RESOLUTION ===
    {
      type: 'info',
      title: 'When conflicts happen anyway',
      body: "Even with perfect worktree isolation, conflicts can occur. Agent 1 adds a new export to src/index.ts. Agent 3 also adds an export to src/index.ts. They edited different lines, but git can't always auto-merge adjacent changes. The fix is straightforward: when git merge reports a conflict, open the file, keep both additions, and commit. The key insight is that worktrees reduce conflicts from \"constant nightmare\" to \"occasional and manageable.\"",
    },
    {
      type: 'code-demo',
      title: 'Resolving a merge conflict',
      body: 'Git marks conflicts with angle brackets. Keep both changes, remove the markers, and commit.',
      language: 'typescript',
      filename: 'src/index.ts',
      code: '// Git shows this in the conflicted file:\n<<<<<<< HEAD\nexport { AuthService } from \'./auth\'\n=======\nexport { UserSettings } from \'./settings\'\n>>>>>>> feat/ui\n\n// Resolution: keep both exports\nexport { AuthService } from \'./auth\'\nexport { UserSettings } from \'./settings\'',
    },
    {
      type: 'multiple-choice',
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
      type: 'info',
      title: 'Cleanup: remove worktrees after merge',
      body: "Worktrees are cheap to create but you should still clean them up. After merging, the worktree directory just takes up disk space and the branch reference becomes stale. Remove each worktree, delete the merged branches, and you're back to a clean state. Make this a habit -- leftover worktrees from last week's feature will confuse you next week.",
    },
    {
      type: 'code-demo',
      title: 'Full cleanup sequence',
      body: 'Remove the worktree directories, then delete the merged branches.',
      language: 'bash',
      filename: 'terminal',
      code: '# Remove worktrees\ngit worktree remove ../myapp-auth\ngit worktree remove ../myapp-api\ngit worktree remove ../myapp-ui\n\n# Delete merged branches\ngit branch -d feat/auth\ngit branch -d feat/api\ngit branch -d feat/ui\n\n# Verify clean state\ngit worktree list\n# Should show only the main worktree',
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
      type: 'info',
      title: 'Common mistakes to avoid',
      body: "Three pitfalls trip people up. First: checking out the same branch in two worktrees. Git won't let you -- each branch can only be checked out in one worktree at a time. Second: forgetting to commit in the worktree before switching to the main repo for merging. Uncommitted work in a worktree stays there -- it doesn't magically appear in main. Third: leaving worktrees around for weeks. They drift from main and conflicts pile up. Create, work, merge, clean up -- same day if possible.",
    },
    {
      type: 'multiple-choice',
      question: 'What happens if you try to check out the same branch in two worktrees?',
      options: [
        'It works fine -- both worktrees share the branch',
        'Git creates a copy of the branch',
        'Git refuses and shows an error',
        'The second worktree becomes read-only',
      ],
      correctIndex: 2,
      explanation: 'Git enforces that each branch can only be checked out in one worktree at a time. This prevents two worktrees from making conflicting changes to the same branch reference.',
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
