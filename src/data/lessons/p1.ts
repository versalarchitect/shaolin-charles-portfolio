import type { LessonContent } from './types'

const content: LessonContent = {
  lessonId: 'p1',
  blocks: [
    {
      type: 'heading',
      text: 'Why your environment matters',
    },
    {
      type: 'text',
      text: "Every bug you'll chase, every deploy you'll ship, every agent you'll direct — it all runs through your local machine first. A sloppy setup means friction on every task. A clean one means you can focus on the work, not the tooling.",
    },
    {
      type: 'text',
      text: 'This lesson sets up the exact environment you\'ll use for the rest of the course. Nothing optional — every tool here gets used.',
    },
    {
      type: 'heading',
      text: '1. Install Node.js 22+',
    },
    {
      type: 'text',
      text: 'Node.js is the runtime for everything we build. We need version 22 or later — it includes native fetch, a stable test runner, and better ESM support.',
    },
    {
      type: 'tip',
      text: 'Use nvm (Node Version Manager) instead of installing Node directly. It lets you switch between versions per project — essential when you work on multiple codebases.',
    },
    {
      type: 'steps',
      items: [
        {
          title: 'Install nvm',
          body: 'Run the install script. This adds nvm to your shell profile.',
          code: 'curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash',
        },
        {
          title: 'Restart your terminal',
          body: 'Close and reopen your terminal, or source your profile:',
          code: 'source ~/.zshrc  # or ~/.bashrc',
        },
        {
          title: 'Install Node.js 22',
          body: 'Install the latest LTS version and set it as default.',
          code: 'nvm install 22\nnvm alias default 22',
        },
        {
          title: 'Verify',
          body: 'Confirm you\'re running the right version.',
          code: 'node --version\n# Should print v22.x.x or higher',
        },
      ],
    },
    {
      type: 'heading',
      text: '2. Install Bun',
    },
    {
      type: 'text',
      text: 'Bun is a fast JavaScript runtime and package manager. We use it for installing dependencies and running scripts — it\'s significantly faster than npm.',
    },
    {
      type: 'code',
      language: 'bash',
      code: 'curl -fsSL https://bun.sh/install | bash',
    },
    {
      type: 'text',
      text: 'Restart your terminal, then verify:',
    },
    {
      type: 'code',
      language: 'bash',
      code: 'bun --version\n# Should print 1.x.x',
    },
    {
      type: 'heading',
      text: '3. Install and configure Git',
    },
    {
      type: 'text',
      text: 'Git is version control. If you\'re on macOS, you likely have it already via Xcode Command Line Tools. If not:',
    },
    {
      type: 'code',
      language: 'bash',
      code: 'xcode-select --install  # macOS\n# or: sudo apt install git  # Ubuntu/Debian\n# or: winget install Git.Git  # Windows',
    },
    {
      type: 'text',
      text: 'Set your identity — this shows up in every commit you make:',
    },
    {
      type: 'code',
      language: 'bash',
      code: 'git config --global user.name "Your Name"\ngit config --global user.email "you@example.com"',
    },
    {
      type: 'tip',
      text: 'Use the same email you use on GitHub so your commits are linked to your profile.',
    },
    {
      type: 'heading',
      text: '4. Install VS Code',
    },
    {
      type: 'text',
      text: 'Download VS Code from code.visualstudio.com. Once installed, add the recommended extensions for this course:',
    },
    {
      type: 'steps',
      items: [
        {
          title: 'ESLint',
          body: 'Catches errors and enforces code style as you type.',
        },
        {
          title: 'Tailwind CSS IntelliSense',
          body: 'Autocomplete for Tailwind classes — essential for the UI work we do.',
        },
        {
          title: 'Prettier',
          body: 'Auto-formats your code on save. Consistent formatting without thinking about it.',
        },
        {
          title: 'Error Lens',
          body: 'Shows errors inline instead of only in the problems panel. Makes debugging faster.',
        },
      ],
    },
    {
      type: 'text',
      text: 'Enable format on save in VS Code settings:',
    },
    {
      type: 'code',
      language: 'json',
      filename: 'settings.json',
      code: '{\n  "editor.formatOnSave": true,\n  "editor.defaultFormatter": "esbenp.prettier-vscode"\n}',
    },
    {
      type: 'heading',
      text: '5. Terminal and shell aliases',
    },
    {
      type: 'text',
      text: 'You\'ll spend a lot of time in the terminal. A few aliases save hours over the course:',
    },
    {
      type: 'code',
      language: 'bash',
      filename: '~/.zshrc',
      code: '# Git shortcuts\nalias gs="git status"\nalias gc="git commit"\nalias gp="git push"\nalias gl="git log --oneline -20"\n\n# Project shortcuts\nalias dev="bun run dev"\nalias build="bun run build"',
    },
    {
      type: 'text',
      text: 'After editing, reload your shell:',
    },
    {
      type: 'code',
      language: 'bash',
      code: 'source ~/.zshrc',
    },
    {
      type: 'heading',
      text: '6. Generate SSH keys for GitHub',
    },
    {
      type: 'text',
      text: 'SSH keys let you push to GitHub without entering your password every time.',
    },
    {
      type: 'steps',
      items: [
        {
          title: 'Generate a key',
          body: 'Use Ed25519 — it\'s the modern default.',
          code: 'ssh-keygen -t ed25519 -C "you@example.com"',
        },
        {
          title: 'Start the SSH agent and add your key',
          body: '',
          code: 'eval "$(ssh-agent -s)"\nssh-add ~/.ssh/id_ed25519',
        },
        {
          title: 'Copy the public key',
          body: '',
          code: 'cat ~/.ssh/id_ed25519.pub | pbcopy  # macOS\n# or: cat ~/.ssh/id_ed25519.pub  # then copy manually',
        },
        {
          title: 'Add to GitHub',
          body: 'Go to GitHub → Settings → SSH and GPG keys → New SSH key. Paste the key and save.',
        },
        {
          title: 'Test the connection',
          body: '',
          code: 'ssh -T git@github.com\n# Should print: Hi username! You\'ve successfully authenticated...',
        },
      ],
    },
    {
      type: 'heading',
      text: 'Verification checklist',
    },
    {
      type: 'text',
      text: 'Run each command and confirm the output. If any fail, go back and fix before moving on.',
    },
    {
      type: 'checklist',
      items: [
        'node --version prints v22.x.x or higher',
        'bun --version prints 1.x.x',
        'git --version prints 2.x.x',
        'code --version opens VS Code',
        'ssh -T git@github.com authenticates successfully',
        'Shell aliases work (gs shows git status)',
      ],
    },
    {
      type: 'warning',
      text: 'Don\'t skip the verification. Every lesson from here assumes this environment works. Debugging a broken setup mid-lesson wastes more time than getting it right now.',
    },
  ],
}

export default content
