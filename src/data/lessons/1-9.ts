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
      type: 'info',
      title: 'Branch-per-feature with agents',
      body: "Create a new branch for every task you give an agent. Even if the task seems small. Branches are cheap. A branch gives you isolation (agent changes do not touch main until reviewed), rollback (delete the branch if the agent goes off track), and visibility (you can see all agent work in your branch list). Name branches descriptively: feat/add-auth-flow, fix/pagination-off-by-one, refactor/extract-api-client. Include the scope of the change in the name.",
    },
    {
      type: 'terminal',
      instruction: 'Create a new branch (a separate workspace) for the AI to work in. This keeps your main project safe while the AI experiments:',
      expectedCommand: 'git checkout -b feat/add-user-settings',
      hint: 'Use git checkout -b followed by the branch name',
    },
    {
      type: 'diagram',
      title: 'Agent Branch Workflow',
      body: 'Each agent task lives on its own branch. The human reviews before merging to main. Multiple agents can work in parallel on separate branches.',
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
    },

    // === COMMIT HYGIENE ===
    {
      type: 'info',
      title: 'Commit messages for agent-generated code',
      body: "Agents produce code fast, but the commit message still matters — maybe more than usual. When you review a PR weeks later, the commit message is your only context for why the agent made a choice. Good practice: use conventional commits (feat:, fix:, refactor:), describe the intent not the implementation, and include a Co-Authored-By trailer for the agent. Claude Code does this automatically when you ask it to commit. Never accept a commit message like \"update files\" or \"make changes\".",
    },
    {
      type: 'code-demo',
      title: 'Good vs bad agent commit messages',
      body: 'The commit message should explain why the change exists. The diff already shows what changed.',
      language: 'text',
      filename: 'commit-examples.txt',
      code: "# BAD - tells you nothing\ngit commit -m \"update auth\"\ngit commit -m \"fix bug\"\ngit commit -m \"changes from Claude\"\n\n# GOOD - explains intent and scope\ngit commit -m \"feat(auth): add refresh token rotation to prevent session hijacking\"\ngit commit -m \"fix(api): handle null response from payments webhook\"\ngit commit -m \"refactor(db): extract query builder to reduce duplication in user service\"\n\n# With Co-Authored-By (added automatically by Claude Code)\ngit commit -m \"feat(settings): add user preferences page with theme toggle\n\nCo-Authored-By: Claude <noreply@anthropic.com>\"",
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
      type: 'info',
      title: 'Reviewing pull requests from agents',
      body: "Agent PRs need the same review rigor as human PRs — but different focus areas. Agents rarely have typos or style issues (they follow linters). Instead, look for: logic errors the agent could not catch without running the code, over-engineering (agents love abstracting too early), missing edge cases, security issues (agents sometimes expose secrets or skip auth checks), and unnecessary changes to files outside the task scope. Skim fast, focus deep on business logic.",
    },
    {
      type: 'code-demo',
      title: 'PR review commands',
      body: 'Use these git commands to efficiently review agent-generated PRs. Focus on understanding the scope first, then dive into specifics.',
      language: 'bash',
      filename: 'review-workflow.sh',
      code: "# See all files changed in the PR branch\ngit diff --stat main...HEAD\n\n# Review changes file by file\ngit diff main...HEAD -- src/auth/\n\n# See commit history (check for logical grouping)\ngit log --oneline main..HEAD\n\n# Check if agent touched files outside its scope\ngit diff --name-only main...HEAD | grep -v '^src/auth/'\n\n# Interactive review with GitHub CLI\ngh pr diff 42\ngh pr review 42 --comment -b \"LGTM — logic is sound, tests cover edge cases\"",
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
      type: 'info',
      title: 'Handling merge conflicts in agent workflows',
      body: "Merge conflicts happen more often with agents because multiple agents may work in parallel on related files. Prevention is better than cure: before starting an agent on a task, pull the latest main. Keep agent branches short-lived (merge within hours, not days). When conflicts do occur, do not ask the agent to resolve them blindly — it does not have context about what the other branch intended. Instead: review both sides, decide the correct resolution yourself, then let the agent implement it.",
    },
    {
      type: 'code-demo',
      title: 'Resolving conflicts safely',
      body: 'When an agent branch conflicts with main, rebase onto the latest main and resolve conflicts with full context.',
      language: 'bash',
      filename: 'resolve-conflicts.sh',
      code: "# Update main first\ngit checkout main && git pull\n\n# Switch to the agent branch and rebase\ngit checkout feat/add-auth\ngit rebase main\n\n# If conflicts appear:\n# 1. Open the conflicted files\n# 2. Understand BOTH sides (yours and main)\n# 3. Resolve manually — don't guess\n# 4. Continue the rebase\ngit add <resolved-files>\ngit rebase --continue\n\n# If the rebase is too messy, abort and merge instead\ngit rebase --abort\ngit merge main",
    },
    {
      type: 'terminal',
      instruction: 'After combining branches, check if any files have conflicting changes that need your attention:',
      expectedCommand: 'git diff --name-only --diff-filter=U',
      hint: 'Use git diff with --name-only and filter for unmerged (U) files',
    },

    // === GIT WORKTREES ===
    {
      type: 'info',
      title: 'Git worktrees for parallel agent work',
      body: "When you want multiple agents working simultaneously on different branches of the same repo, git worktrees are the solution. A worktree creates a separate working directory linked to the same repository. Each worktree can have a different branch checked out. This means you can have Agent A working in /project-feat-auth and Agent B working in /project-fix-pagination — same repo, no conflicts, no stashing, no switching branches. Each agent has its own clean workspace.",
    },
    {
      type: 'code-demo',
      title: 'Setting up worktrees for parallel agents',
      body: 'Create separate working directories for each agent task. They share the same git history but have independent file states.',
      language: 'bash',
      filename: 'worktree-setup.sh',
      code: "# Create a worktree for a feature branch\ngit worktree add ../project-feat-auth feat/add-auth\n\n# Create another worktree for a different task\ngit worktree add ../project-fix-pagination fix/pagination\n\n# List all active worktrees\ngit worktree list\n# /Users/you/project             abc1234 [main]\n# /Users/you/project-feat-auth   def5678 [feat/add-auth]\n# /Users/you/project-fix-pagination ghi9012 [fix/pagination]\n\n# Each agent works in its own directory — no interference\n# Agent 1: cd ../project-feat-auth && claude\n# Agent 2: cd ../project-fix-pagination && claude\n\n# When done, clean up\ngit worktree remove ../project-feat-auth\ngit worktree remove ../project-fix-pagination",
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
      type: 'info',
      title: 'The golden rules',
      body: "Here are the non-negotiable rules for git with agents. One: never let agents push to main directly — always use a PR with review. Two: never let agents force-push or rewrite history on shared branches. Three: keep agent branches short-lived — merge or delete within a day. Four: always verify the agent's changes build and pass tests before merging. Five: use branch protection rules to enforce these constraints even when you are in a hurry.",
    },
    {
      type: 'code-demo',
      title: 'Branch protection for agent safety',
      body: 'Configure your repository to prevent agents (and humans) from bypassing review. These settings are applied on GitHub/GitLab.',
      language: 'bash',
      filename: 'branch-protection.sh',
      code: "# Set up branch protection via GitHub CLI\ngh api repos/{owner}/{repo}/branches/main/protection -X PUT -f \\\n  required_pull_request_reviews.required_approving_review_count=1 \\\n  required_status_checks.strict=true \\\n  enforce_admins=true \\\n  allow_force_pushes=false \\\n  allow_deletions=false\n\n# Result: no one (human or agent) can:\n# - Push directly to main\n# - Force push to main\n# - Merge without an approval\n# - Merge with failing CI checks",
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
