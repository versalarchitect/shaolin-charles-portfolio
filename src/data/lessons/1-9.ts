import type { LessonContent } from './types'

const content: LessonContent = {
  lessonId: '1-9',
  steps: [
    // === INTRODUCTION ===
    {
      type: 'info',
      title: 'Managing changes when AI writes code',
      body: "When a human writes code, they context-switch between reading, thinking, and typing. When an AI agent writes code, it generates large diffs in seconds — sometimes across many files at once. This speed is a superpower, but it changes how you manage version control. Branches, commits, and pull requests all need new conventions. Without discipline, you end up with 50-file PRs, vague commit messages, and merge conflicts that take hours to untangle. This lesson gives you the git workflow that makes agents productive without creating chaos.",
    },
    {
      type: 'info',
      title: 'The core principle: small, reviewable units',
      body: "The fundamental rule of git with agents is the same as without them — just more important. Keep changes small and focused. One branch per feature. One concern per commit. One logical change per PR. Agents make it tempting to let everything happen at once because they are fast. Resist that temptation. A 200-file PR from an agent is just as unreviewable as a 200-file PR from a human. The speed advantage should go into making more small PRs, not bigger ones.",
    },
    {
      type: 'checkpoint',
      xp: 2,
      message: 'You understand why version control matters even more with AI.',
    },

    // === BRANCH STRATEGY ===
    {
      type: 'multiple-choice',
      question: 'Why should you create a new branch for EVERY task you give an agent, even small ones?',
      options: [
        'Branches make git commands run faster',
        'Branches give isolation, rollback, and visibility for agent work',
        'Agents cannot commit to the main branch',
        'Multiple branches reduce merge conflicts automatically',
      ],
      correctIndex: 1,
      explanation: 'Branches are cheap but provide three critical benefits: isolation (agent changes stay separate from main), rollback (delete the branch if the agent goes off track), and visibility (you can see all agent work in your branch list). Name branches descriptively: feat/add-auth-flow, fix/pagination-off-by-one.',
    },
    {
      type: 'terminal',
      instruction: 'Create a new branch (a separate workspace) for the AI to work in. This keeps your main project safe while the AI experiments:',
      expectedCommand: 'git checkout -b feat/add-user-settings',
      hint: 'Use git checkout -b followed by the branch name',
    },
    {
      type: 'interactive-diagram',
      title: 'Agent Branch Workflow',
      body: 'Click through each stage to see how agent branches flow from creation through review to merge.',
      diagram: {
        direction: 'LR',
        nodes: [
          { id: 'main', label: 'main', sublabel: 'Protected', shape: 'pill', highlight: true },
          { id: 'feat1', label: 'feat/auth', sublabel: 'Agent 1', shape: 'rect' },
          { id: 'feat2', label: 'feat/settings', sublabel: 'Agent 2', shape: 'rect' },
          { id: 'feat3', label: 'fix/pagination', sublabel: 'Agent 3', shape: 'rect' },
          { id: 'review', label: 'PR Review', sublabel: 'Human gate', shape: 'rounded', highlight: true },
        ],
        edges: [
          { from: 'main', to: 'feat1', label: 'branch' },
          { from: 'main', to: 'feat2', label: 'branch' },
          { from: 'main', to: 'feat3', label: 'branch' },
          { from: 'feat1', to: 'review' },
          { from: 'feat2', to: 'review' },
          { from: 'feat3', to: 'review' },
          { from: 'review', to: 'main', label: 'merge' },
        ],
      },
      stages: [
        {
          highlightNodes: ['main'],
          highlightEdges: [],
          explanation: 'Main is the protected branch. No agent — and no human — pushes directly here. All changes come through reviewed pull requests.',
        },
        {
          highlightNodes: ['main', 'feat1', 'feat2', 'feat3'],
          highlightEdges: [{ from: 'main', to: 'feat1' }, { from: 'main', to: 'feat2' }, { from: 'main', to: 'feat3' }],
          explanation: 'Each agent task gets its own branch. Multiple agents work in parallel without interfering with each other. Name branches descriptively with prefixes like feat/, fix/, refactor/.',
        },
        {
          highlightNodes: ['feat1', 'feat2', 'feat3', 'review'],
          highlightEdges: [{ from: 'feat1', to: 'review' }, { from: 'feat2', to: 'review' }, { from: 'feat3', to: 'review' }],
          explanation: 'Agents push their branches and open PRs. Every change passes through the human review gate — checking for logic errors, security issues, and scope creep.',
        },
        {
          highlightNodes: ['review', 'main'],
          highlightEdges: [{ from: 'review', to: 'main' }],
          explanation: 'After review and approval, changes merge to main. The human stays in control of what ships to production.',
        },
      ],
    },

    // === INTERACTIVE: COMPARE, CODE-FILL, INTERACTIVE-DIAGRAM ===
    {
      type: 'compare',
      title: 'Focused PR vs mega PR',
      body: 'The size of your pull request directly affects review quality.',
      question: 'Which PR is easier to review and safer to merge?',
      correctSide: 'left',
      left: {
        label: 'Focused (3 files)',
        content: 'feat: add email validation to signup form\n\nChanged:\n- src/lib/validation.ts (new function)\n- src/components/signup-form.tsx (use validator)\n- src/components/signup-form.test.tsx (3 tests)\n\nReview time: ~5 minutes\nRisk: Low — isolated change',
        language: 'text',
      },
      right: {
        label: 'Mega (47 files)',
        content: 'feat: add auth, dashboard, settings, and API\n\nChanged:\n- 47 files across 12 directories\n- New auth system + session management\n- Dashboard with 8 widgets\n- Settings page with 5 forms\n- 14 new API routes\n\nReview time: ~2 hours\nRisk: High — impossible to review thoroughly',
        language: 'text',
      },
      explanation: 'Small, focused PRs get thorough reviews. Mega PRs get rubber-stamped because nobody has time to review 47 files carefully. Bugs hide in the parts nobody reads.',
    },
    {
      type: 'code-fill',
      instruction: 'Complete the git commands using conventional branch naming and commit format:',
      language: 'shell',
      template: 'git checkout -b {{branch_type}}/{{branch_name}}\n\n# ... make changes ...\n\ngit add src/lib/validation.ts\ngit commit -m "{{commit_type}}: {{commit_desc}}"',
      blanks: [
        { id: 'branch_type', answer: 'feat', alternatives: ['feature'], placeholder: 'branch prefix?', hint: 'Type of work: feat, fix, refactor' },
        { id: 'branch_name', answer: 'add-email-validation', alternatives: ['email-validation', 'add-validation'], placeholder: 'branch description?', hint: 'Kebab-case description of the change' },
        { id: 'commit_type', answer: 'feat', alternatives: ['feature'], placeholder: 'commit type?' },
        { id: 'commit_desc', answer: 'add email validation to signup form', placeholder: 'what changed?', hint: 'Short description starting with a verb' },
      ],
      explanation: 'Conventional branch names (feat/, fix/, refactor/) and commit types make git history scannable. The agent follows these patterns when it sees them in CLAUDE.md.',
    },
    {
      type: 'interactive-diagram',
      title: 'Agent Branch Workflow — Step by Step',
      body: 'Walk through how multiple agents work on separate branches, with a human review gate before merging to main.',
      diagram: {
        direction: 'LR',
        nodes: [
          { id: 'main', label: 'main', sublabel: 'Protected', shape: 'pill', highlight: true },
          { id: 'feat1', label: 'feat/auth', sublabel: 'Agent 1', shape: 'rect' },
          { id: 'feat2', label: 'feat/settings', sublabel: 'Agent 2', shape: 'rect' },
          { id: 'feat3', label: 'fix/pagination', sublabel: 'Agent 3', shape: 'rect' },
          { id: 'review', label: 'PR Review', sublabel: 'Human gate', shape: 'rounded', highlight: true },
        ],
        edges: [
          { from: 'main', to: 'feat1', label: 'branch' },
          { from: 'main', to: 'feat2', label: 'branch' },
          { from: 'main', to: 'feat3', label: 'branch' },
          { from: 'feat1', to: 'review' },
          { from: 'feat2', to: 'review' },
          { from: 'feat3', to: 'review' },
          { from: 'review', to: 'main', label: 'merge' },
        ],
      },
      stages: [
        {
          highlightNodes: ['main'],
          highlightEdges: [],
          explanation: 'Start from the protected main branch. No one — human or agent — pushes directly here.',
        },
        {
          highlightNodes: ['main', 'feat1', 'feat2', 'feat3'],
          highlightEdges: [{ from: 'main', to: 'feat1' }, { from: 'main', to: 'feat2' }, { from: 'main', to: 'feat3' }],
          explanation: 'Each agent task gets its own branch. Multiple agents work in parallel without interfering with each other.',
        },
        {
          highlightNodes: ['feat1', 'feat2', 'feat3', 'review'],
          highlightEdges: [{ from: 'feat1', to: 'review' }, { from: 'feat2', to: 'review' }, { from: 'feat3', to: 'review' }],
          explanation: 'Agents push their branches and open PRs. Every change must pass through the human review gate.',
        },
        {
          highlightNodes: ['review', 'main'],
          highlightEdges: [{ from: 'review', to: 'main' }],
          explanation: 'After review and approval, changes merge to main. The human stays in control of what ships.',
        },
      ],
    },

    // === COMMIT HYGIENE ===
    {
      type: 'compare',
      title: 'Bad vs good agent commit messages',
      body: 'The commit message is your only context weeks later for why the agent made a choice.',
      question: 'Which style gives reviewers the context they need?',
      correctSide: 'right',
      left: {
        label: 'Bad (tells you nothing)',
        content: "git commit -m \"update auth\"\ngit commit -m \"fix bug\"\ngit commit -m \"changes from Claude\"\ngit commit -m \"update files\"\n\n→ What was updated? Which bug?\n→ No scope, no intent, no context\n→ Useless when reviewing weeks later\n→ Impossible to git bisect effectively",
        language: 'text',
      },
      right: {
        label: 'Good (explains intent)',
        content: "git commit -m \"feat(auth): add refresh\n  token rotation to prevent session\n  hijacking\"\ngit commit -m \"fix(api): handle null\n  response from payments webhook\"\ngit commit -m \"refactor(db): extract\n  query builder to reduce duplication\"\n\n→ Type + scope + why\n→ Conventional commit format\n→ Reviewable context weeks later",
        language: 'text',
      },
      explanation: 'Good commit messages use conventional format (type(scope): description), explain WHY the change exists (not what changed — the diff shows that), and include a Co-Authored-By trailer for the agent. Never accept vague messages from agents.',
    },
    {
      type: 'multiple-choice',
      question: 'Which commit message best follows conventions for agent-generated code?',
      options: [
        '"Updated several files across the project"',
        '"fix(cart): prevent negative quantities by clamping to minimum of 1"',
        '"Claude made some changes to the cart"',
        '"Changes"',
      ],
      correctIndex: 1,
      explanation: 'A conventional commit with a scope, clear description of what was fixed, and the reasoning (prevent negative quantities) gives reviewers full context. The diff shows the code — the message explains the intent.',
    },

    // === REVIEWING AGENT PRs ===
    {
      type: 'match',
      instruction: 'When reviewing agent PRs, match each review focus to what you are looking for:',
      leftItems: [
        'Logic errors',
        'Over-engineering',
        'Security issues',
        'Scope creep',
      ],
      rightItems: [
        'Bugs the agent cannot catch without running the code',
        'Premature abstractions and unnecessary complexity',
        'Exposed secrets, skipped auth checks, SQL injection',
        'Changes to files outside the assigned task',
      ],
      correctPairs: { 0: 0, 1: 1, 2: 2, 3: 3 },
      explanation: 'Agent PRs need the same rigor as human PRs but different focus. Agents rarely have style issues (they follow linters). Instead, focus deep on logic errors, over-engineering, security, and scope creep. Skim fast, focus deep on business logic.',
    },
    {
      type: 'code-fill',
      instruction: 'Complete these git commands to efficiently review an agent PR. Focus on scope first, then dive into specifics:',
      language: 'bash',
      filename: 'review-workflow.sh',
      template: "# See all files changed in the PR branch\ngit diff {{stat_flag}} main...HEAD\n\n# Review changes in a specific directory\ngit diff main...HEAD -- src/auth/\n\n# Check if agent touched files outside its scope\ngit diff {{names_flag}} main...HEAD | grep -v '^src/auth/'\n\n# Review with GitHub CLI\ngh pr {{review_cmd}} 42",
      blanks: [
        { id: 'stat_flag', answer: '--stat', alternatives: ['--stats'], placeholder: 'summary flag?', hint: 'The git diff flag that shows a summary of files changed and lines added/removed' },
        { id: 'names_flag', answer: '--name-only', alternatives: ['--names-only', '--nameonly'], placeholder: 'filenames flag?', hint: 'The git diff flag that shows only file names, not the actual changes' },
        { id: 'review_cmd', answer: 'diff', alternatives: ['review'], placeholder: 'gh pr ___?', hint: 'The gh pr subcommand that shows the PR diff' },
      ],
      explanation: 'Use --stat for a high-level summary of changes, --name-only to check scope (did the agent touch files outside its task?), and gh pr diff to review the full PR. Efficient review means scope first, then business logic deep-dive.',
    },
    {
      type: 'multiple-choice',
      question: 'When reviewing an agent PR, what should you focus on most?',
      options: [
        'Code formatting and style consistency',
        'Variable naming conventions',
        'Logic errors, missing edge cases, and security issues',
        'Comment quality and documentation',
      ],
      correctIndex: 2,
      explanation: 'Agents follow linters and style guides well. They rarely have formatting issues. But they can miss logic errors (they cannot run the code in their head), skip edge cases, and sometimes introduce security holes. Focus your review energy there.',
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'You know how to review AI-generated code before it goes live.',
    },

    // === MERGE CONFLICTS ===
    {
      type: 'multiple-choice',
      question: 'When an agent branch has merge conflicts, what should you do?',
      options: [
        'Ask the agent to resolve the conflicts automatically',
        'Review both sides yourself, decide the resolution, then let the agent implement it',
        'Delete the branch and start over',
        'Force-push the agent branch to overwrite main',
      ],
      correctIndex: 1,
      explanation: 'Never ask an agent to resolve conflicts blindly — it has no context about what the other branch intended. Review both sides yourself, decide the correct resolution, then let the agent implement it. Prevention is better: pull latest main before starting, and keep agent branches short-lived.',
    },
    {
      type: 'code-fill',
      instruction: 'Complete the conflict resolution workflow. Rebase the agent branch onto the latest main:',
      language: 'bash',
      filename: 'resolve-conflicts.sh',
      template: "# Update main first\ngit checkout main && git pull\n\n# Switch to the agent branch and rebase\ngit checkout {{branch_name}}\ngit {{rebase_cmd}} main\n\n# If conflicts appear:\n# 1. Open the conflicted files\n# 2. Understand BOTH sides\n# 3. Resolve manually\ngit add <resolved-files>\ngit rebase {{continue_flag}}\n\n# If too messy, abort and merge instead\ngit rebase --abort\ngit merge main",
      blanks: [
        { id: 'branch_name', answer: 'feat/add-auth', alternatives: ['feat/auth'], placeholder: 'branch name?', hint: 'The feature branch the agent was working on' },
        { id: 'rebase_cmd', answer: 'rebase', placeholder: 'replay command?', hint: 'The git command that replays your commits on top of another branch' },
        { id: 'continue_flag', answer: '--continue', placeholder: 'resume flag?', hint: 'The rebase flag that continues after you resolve a conflict' },
      ],
      explanation: 'First update main with git pull. Switch to the agent branch and rebase onto main. Resolve conflicts manually (never blindly), then git rebase --continue. If the rebase is too messy, abort and use git merge instead.',
    },
    {
      type: 'terminal',
      instruction: 'After combining branches, check if any files have conflicting changes that need your attention:',
      expectedCommand: 'git diff --name-only --diff-filter=U',
      hint: 'Use git diff with --name-only and filter for unmerged (U) files',
    },

    // === GIT WORKTREES ===
    {
      type: 'code-fill',
      instruction: 'Set up git worktrees for parallel agent work. Each worktree creates a separate working directory linked to the same repo:',
      language: 'bash',
      filename: 'worktree-setup.sh',
      template: "# Create a worktree for a feature branch\ngit worktree {{add_cmd}} ../project-feat-auth feat/add-auth\n\n# Create another worktree for a different task\ngit worktree {{add_cmd}} ../project-fix-pagination fix/pagination\n\n# List all active worktrees\ngit worktree {{list_cmd}}\n\n# Each agent works in its own directory — no interference\n# Agent 1: cd ../project-feat-auth && claude\n# Agent 2: cd ../project-fix-pagination && claude\n\n# When done, clean up\ngit worktree {{remove_cmd}} ../project-feat-auth",
      blanks: [
        { id: 'add_cmd', answer: 'add', placeholder: 'create subcommand?', hint: 'The git worktree subcommand that creates a new worktree directory' },
        { id: 'list_cmd', answer: 'list', placeholder: 'show subcommand?', hint: 'The git worktree subcommand that shows all active worktrees' },
        { id: 'remove_cmd', answer: 'remove', placeholder: 'cleanup subcommand?', hint: 'The git worktree subcommand that deletes a worktree when you are done' },
      ],
      explanation: 'Git worktrees create separate working directories linked to the same repository. Use "add" to create, "list" to see all active worktrees, and "remove" to clean up. Each agent gets its own directory and branch — no stashing, no context switching.',
    },
    {
      type: 'multiple-choice',
      question: 'What problem do git worktrees solve for parallel agent workflows?',
      options: [
        'They make git commands run faster',
        'They let multiple agents work on different branches simultaneously without conflicts',
        'They automatically resolve merge conflicts',
        'They compress the repository to save disk space',
      ],
      correctIndex: 1,
      explanation: 'Worktrees create separate working directories for each branch. Multiple agents can each have their own directory and branch — no stashing, no context switching, no interference between parallel tasks.',
    },

    // === BEST PRACTICES ===
    {
      type: 'multiple-choice',
      question: 'Which of these is a NON-NEGOTIABLE rule for git with agents?',
      options: [
        'Agents should commit directly to main to save time',
        'Force-push is fine if the agent is confident',
        'Never let agents push to main directly — always use a PR with review',
        'Agent branches should stay open for weeks to accumulate changes',
      ],
      correctIndex: 2,
      explanation: 'The golden rules: 1) Never push to main directly. 2) Never force-push or rewrite history. 3) Keep branches short-lived. 4) Verify builds and tests before merging. 5) Use branch protection to enforce these even when in a hurry.',
    },
    {
      type: 'code-fill',
      instruction: 'Configure branch protection via GitHub CLI. Prevent agents and humans from bypassing review:',
      language: 'bash',
      filename: 'branch-protection.sh',
      template: "# Set up branch protection via GitHub CLI\ngh api repos/{owner}/{repo}/branches/main/protection -X PUT -f \\\n  required_pull_request_reviews.required_approving_review_count={{min_reviews}} \\\n  required_status_checks.strict=true \\\n  enforce_admins=true \\\n  allow_force_pushes={{force_push}} \\\n  allow_deletions=false\n\n# Result: no one can push directly, force push, or skip review",
      blanks: [
        { id: 'min_reviews', answer: '1', alternatives: ['2'], placeholder: 'how many approvals?', hint: 'The minimum number of approving reviews required — at least one person must review' },
        { id: 'force_push', answer: 'false', placeholder: 'allow force push?', hint: 'Force pushing rewrites history and is one of the golden rule violations' },
      ],
      explanation: 'Require at least 1 approving review, enforce strict status checks (CI must pass), and set allow_force_pushes to false. This ensures no one — human or agent — can bypass review, even when in a hurry.',
    },

    // === WORKFLOW EXERCISE ===
    {
      type: 'order',
      instruction: 'Order the complete agent git workflow from start to finish:',
      items: [
        'Agent creates commits with clear messages',
        'Human creates a feature branch',
        'Human merges PR after approval',
        'Agent pushes branch and opens PR',
        'Human reviews diff, checks for logic and security issues',
        'CI runs tests and linting on the PR',
      ],
      correctOrder: [1, 0, 3, 5, 4, 2],
    },
    {
      type: 'terminal',
      instruction: 'View the last 10 saved changes to check that the AI wrote clear descriptions for each one:',
      expectedCommand: 'git log --oneline -10',
      hint: 'Use git log with --oneline for compact output and -10 to limit results',
    },
    {
      type: 'code-input',
      instruction: 'What git command creates a new worktree at path ../my-feature on branch feat/login?',
      placeholder: 'git worktree ...',
      answer: 'git worktree add ../my-feature feat/login',
      hint: 'Use git worktree add followed by the path and branch name',
    },

    // === FINAL ASSESSMENT ===
    {
      type: 'multiple-choice',
      question: 'An agent created a 150-file PR across 8 different modules. What is the best response?',
      options: [
        'Merge it quickly since the agent probably got it right',
        'Ask the agent to split it into smaller, focused PRs — one per module or concern',
        'Review all 150 files manually in one sitting',
        'Delete the branch and redo the work yourself',
      ],
      correctIndex: 1,
      explanation: 'Large PRs are unreviewable whether they come from humans or agents. The correct response is to split the work into smaller, focused PRs that can each be reviewed independently. Agent speed should produce more small PRs, not fewer large ones.',
    },
    {
      type: 'checklist',
      title: 'Git + AI Agents mastery:',
      items: [
        'I create a new branch for every agent task',
        'I write (or require) descriptive conventional commit messages',
        'I review agent PRs for logic errors and security issues',
        'I know how to resolve merge conflicts from parallel agent work',
        'I can use git worktrees to run multiple agents simultaneously',
        'I enforce branch protection to prevent direct pushes to main',
      ],
    },
    {
      type: 'checkpoint',
      xp: 15,
      message: 'Git Workflow complete! You can safely manage code changes from AI agents.',
    },
  ],
}

export default content
