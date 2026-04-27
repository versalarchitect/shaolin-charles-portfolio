import type { LessonContent } from './types'

const content: LessonContent = {
  lessonId: 'p1',
  steps: [
    {
      type: 'info',
      title: 'Welcome to your first lesson',
      body: "Every bug you'll chase, every deploy you'll ship, every agent you'll direct — it all runs through your local machine first. A sloppy setup means friction on every task. A clean one means you disappear into the work.",
    },
    {
      type: 'info',
      title: 'What we\'re installing',
      body: 'Node.js 22+ (JavaScript runtime), Bun (fast package manager), Git (version control), VS Code (editor), SSH keys (secure GitHub access). Nothing optional — every tool here gets used in the course.',
    },
    {
      type: 'checkpoint',
      xp: 1,
      message: 'Setup begins!',
    },

    // === NODE.JS ===
    {
      type: 'info',
      title: 'Step 1: Node.js',
      body: 'Node.js is the runtime for everything we build. We need version 22 or later — it includes native fetch, a stable test runner, and better ESM support.',
    },
    {
      type: 'code-demo',
      title: 'Use nvm, not a direct install',
      body: 'nvm (Node Version Manager) lets you switch Node versions per project. Essential when you work on multiple codebases.',
      language: 'bash',
      code: 'curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash',
    },
    {
      type: 'terminal',
      instruction: 'After restarting your terminal, install Node.js 22. Type the command:',
      expectedCommand: 'nvm install 22',
      hint: 'nvm install <version>',
    },
    {
      type: 'terminal',
      instruction: 'Set Node 22 as your default version:',
      expectedCommand: 'nvm alias default 22',
      hint: 'nvm alias default <version>',
    },
    {
      type: 'multiple-choice',
      question: 'Why do we use nvm instead of installing Node directly?',
      options: [
        'nvm is faster than Node',
        'nvm lets you switch Node versions per project',
        'nvm is required by Vercel',
        'nvm replaces npm',
      ],
      correctIndex: 1,
      explanation: 'nvm lets you switch between Node versions instantly — essential when different projects need different versions.',
    },
    {
      type: 'checkpoint',
      xp: 2,
      message: 'Node.js ready!',
    },

    // === BUN ===
    {
      type: 'info',
      title: 'Step 2: Bun',
      body: "Bun is a fast JavaScript runtime and package manager. We use it for installing dependencies and running scripts — it's significantly faster than npm.",
    },
    {
      type: 'terminal',
      instruction: 'Install Bun:',
      expectedCommand: 'curl -fsSL https://bun.sh/install | bash',
    },
    {
      type: 'terminal',
      instruction: 'After restarting your terminal, verify Bun is installed:',
      expectedCommand: 'bun --version',
    },
    {
      type: 'checkpoint',
      xp: 2,
      message: 'Bun installed!',
    },

    // === GIT ===
    {
      type: 'info',
      title: 'Step 3: Git',
      body: "Git is version control — it tracks every change you make and lets you undo mistakes, collaborate with others, and deploy code. If you're on macOS, you likely have it via Xcode Command Line Tools.",
    },
    {
      type: 'code-demo',
      title: 'Install Git if needed',
      body: 'Most systems have Git already. Run git --version to check. If not:',
      language: 'bash',
      code: 'xcode-select --install  # macOS\nsudo apt install git     # Ubuntu/Debian\nwinget install Git.Git   # Windows',
    },
    {
      type: 'terminal',
      instruction: 'Configure your Git name (this shows in every commit):',
      expectedCommand: 'git config --global user.name "Your Name"',
      hint: 'git config --global user.name "..."',
    },
    {
      type: 'terminal',
      instruction: 'Configure your Git email (use the same one as GitHub):',
      expectedCommand: 'git config --global user.email "you@example.com"',
      hint: 'git config --global user.email "..."',
    },
    {
      type: 'multiple-choice',
      question: 'Why should your Git email match your GitHub email?',
      options: [
        'Git won\'t work otherwise',
        'So your commits are linked to your GitHub profile',
        'GitHub requires email verification for each commit',
        'It makes Git faster',
      ],
      correctIndex: 1,
      explanation: 'GitHub matches commit emails to profiles. If they differ, your commits show as "unknown contributor."',
    },
    {
      type: 'checkpoint',
      xp: 2,
      message: 'Git configured!',
    },

    // === VS CODE ===
    {
      type: 'info',
      title: 'Step 4: VS Code',
      body: 'VS Code is the editor we use throughout the course. Download it from code.visualstudio.com if you haven\'t already.',
    },
    {
      type: 'order',
      instruction: 'Install these VS Code extensions in priority order (most important first):',
      items: ['ESLint', 'Tailwind CSS IntelliSense', 'Prettier', 'Error Lens'],
      correctOrder: [0, 1, 2, 3],
    },
    {
      type: 'code-demo',
      title: 'Enable format on save',
      body: 'Add this to your VS Code settings so code auto-formats every time you save:',
      language: 'json',
      filename: 'settings.json',
      code: '{\n  "editor.formatOnSave": true,\n  "editor.defaultFormatter": "esbenp.prettier-vscode"\n}',
    },
    {
      type: 'checkpoint',
      xp: 1,
      message: 'Editor ready!',
    },

    // === SHELL ALIASES ===
    {
      type: 'info',
      title: 'Step 5: Shell aliases',
      body: "You'll spend a lot of time in the terminal. A few aliases save hours over the course. These go in your shell config file (~/.zshrc or ~/.bashrc).",
    },
    {
      type: 'code-demo',
      body: 'Add these shortcuts to your shell config:',
      language: 'bash',
      filename: '~/.zshrc',
      code: '# Git shortcuts\nalias gs="git status"\nalias gc="git commit"\nalias gp="git push"\nalias gl="git log --oneline -20"\n\n# Project shortcuts\nalias dev="bun run dev"\nalias build="bun run build"',
    },
    {
      type: 'code-input',
      instruction: 'What command reloads your shell config after editing?',
      placeholder: 'source ~/.______',
      answer: 'source ~/.zshrc',
      hint: 'source + the path to your config file',
    },
    {
      type: 'checkpoint',
      xp: 1,
      message: 'Aliases set!',
    },

    // === SSH KEYS ===
    {
      type: 'info',
      title: 'Step 6: SSH keys',
      body: 'SSH keys let you push to GitHub without entering your password every time. We use Ed25519 — the modern default.',
    },
    {
      type: 'terminal',
      instruction: 'Generate an SSH key:',
      expectedCommand: 'ssh-keygen -t ed25519 -C "you@example.com"',
      hint: 'ssh-keygen -t ed25519 -C "your email"',
    },
    {
      type: 'code-demo',
      body: 'Start the SSH agent and add your key:',
      language: 'bash',
      code: 'eval "$(ssh-agent -s)"\nssh-add ~/.ssh/id_ed25519',
    },
    {
      type: 'info',
      title: 'Add to GitHub',
      body: 'Copy your public key with: cat ~/.ssh/id_ed25519.pub | pbcopy — then go to GitHub → Settings → SSH and GPG keys → New SSH key. Paste and save.',
    },
    {
      type: 'terminal',
      instruction: 'Test the GitHub connection:',
      expectedCommand: 'ssh -T git@github.com',
    },
    {
      type: 'checkpoint',
      xp: 1,
      message: 'SSH connected!',
    },

    // === VERIFICATION ===
    {
      type: 'checklist',
      title: 'Final verification — check off each one:',
      items: [
        'node --version → v22.x.x or higher',
        'bun --version → 1.x.x',
        'git --version → 2.x.x',
        'VS Code opens with extensions installed',
        'ssh -T git@github.com authenticates',
        'Shell aliases work (gs shows git status)',
      ],
    },
    {
      type: 'checkpoint',
      xp: 0,
      message: 'Environment complete! You\'re ready to deploy.',
    },
  ],
}

export default content
