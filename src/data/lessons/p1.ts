import type { LessonContent } from './types'

const content: LessonContent = {
  lessonId: 'p1',
  steps: [
    {
      type: 'info',
      title: 'Welcome to your first lesson',
      body: "Before you can direct AI agents to build software for your business, your computer needs a few tools installed. Think of this like setting up a workshop before you start building. A clean setup now saves you headaches on every future task.",
    },
    {
      type: 'info',
      title: 'What we\'re installing',
      body: 'Here is what we are setting up: Node.js (the engine that runs your apps), Bun (a tool that installs project dependencies quickly), Git (tracks all your changes like Google Docs version history), VS Code (the text editor where you will review code), and SSH keys (secure login credentials for GitHub, like a password but safer). Every tool here gets used in the course.',
    },
    {
      type: 'diagram',
      title: 'Your Setup Roadmap',
      body: 'We install each tool in order. Each one builds on the last.',
      diagram: {
        direction: 'LR',
        nodes: [
          { id: 'rt', label: 'Engines', sublabel: 'Node + Bun' },
          { id: 'git', label: 'Git', sublabel: 'Change Tracking' },
          { id: 'ed', label: 'VS Code', sublabel: 'Code Editor' },
          { id: 'cfg', label: 'Config', sublabel: 'Shortcuts + Security' },
          { id: 'done', label: 'Ready', shape: 'pill', highlight: true },
        ],
        edges: [
          { from: 'rt', to: 'git' },
          { from: 'git', to: 'ed' },
          { from: 'ed', to: 'cfg' },
          { from: 'cfg', to: 'done' },
        ],
      },
    },
    {
      type: 'checkpoint',
      xp: 1,
      message: 'Great start! Let us get your machine ready.',
    },

    // === NODE.JS ===
    {
      type: 'info',
      title: 'Step 1: Node.js',
      body: 'Node.js is the engine that runs JavaScript code on your computer. Think of it as the motor under the hood of every app you will build. We need version 22 or later because it includes the latest modern features.',
    },
    {
      type: 'code-demo',
      title: 'Installing Node.js using nvm',
      body: 'nvm (Node Version Manager) is a small tool that manages which version of Node.js your computer uses. Different projects may need different versions, and nvm lets you switch between them easily. Open your terminal and paste this command to install nvm:',
      language: 'bash',
      code: 'curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash',
    },
    {
      type: 'terminal',
      instruction: 'Close your terminal, reopen it, then paste this command. It installs Node.js version 22 on your machine:',
      expectedCommand: 'nvm install 22',
      hint: 'nvm install <version>',
    },
    {
      type: 'terminal',
      instruction: 'Now set Node 22 as the default so it is always available when you open a new terminal:',
      expectedCommand: 'nvm alias default 22',
      hint: 'nvm alias default <version>',
    },
    {
      type: 'multiple-choice',
      question: 'Why do we use nvm instead of installing Node.js directly from the website?',
      options: [
        'nvm makes Node.js run faster',
        'nvm lets you easily switch between different Node.js versions for different projects',
        'nvm is required by the hosting platform',
        'nvm replaces the need for other tools',
      ],
      correctIndex: 1,
      explanation: 'Different projects sometimes need different versions of Node.js. nvm lets you switch between them instantly, so you are never stuck. You do not need to memorize this — just understand the idea.',
    },
    {
      type: 'checkpoint',
      xp: 2,
      message: 'Nice work! Node.js is installed and ready to go.',
    },

    {
      type: 'diagram',
      title: 'nvm in Action',
      body: 'Each project can use a different Node version. nvm switches instantly.',
      diagram: {
        direction: 'TB',
        nodes: [
          { id: 'nvm', label: 'nvm', shape: 'rounded', highlight: true },
          { id: 'pa', label: 'Project A' },
          { id: 'pb', label: 'Project B' },
          { id: 'pc', label: 'Project C' },
          { id: 'v18', label: 'Node 18', shape: 'pill' },
          { id: 'v22', label: 'Node 22', shape: 'pill', highlight: true },
          { id: 'v20', label: 'Node 20', shape: 'pill' },
        ],
        edges: [
          { from: 'nvm', to: 'pa' },
          { from: 'nvm', to: 'pb' },
          { from: 'nvm', to: 'pc' },
          { from: 'pa', to: 'v18' },
          { from: 'pb', to: 'v22' },
          { from: 'pc', to: 'v20' },
        ],
      },
    },

    // === BUN ===
    {
      type: 'info',
      title: 'Step 2: Bun',
      body: "Bun is a tool that installs your project's dependencies (the building blocks your app needs) and runs scripts. It does the same job as npm but much faster. You will use it throughout the course.",
    },
    {
      type: 'terminal',
      instruction: 'Open your terminal and paste this command. It downloads and installs Bun on your machine:',
      expectedCommand: 'curl -fsSL https://bun.sh/install | bash',
    },
    {
      type: 'terminal',
      instruction: 'Close and reopen your terminal, then paste this command to confirm Bun installed correctly. You should see a version number:',
      expectedCommand: 'bun --version',
    },
    {
      type: 'checkpoint',
      xp: 2,
      message: 'Bun is installed! Two tools down, a few more to go.',
    },

    // === GIT ===
    {
      type: 'info',
      title: 'Step 3: Git',
      body: "Git is a tool that tracks all your changes — like Google Docs version history, but for code. It lets you undo mistakes, see what changed and when, and safely collaborate with others. If you are on a Mac, you may already have it installed.",
    },
    {
      type: 'code-demo',
      title: 'Install Git if needed',
      body: 'Most computers already have Git. Open your terminal and type git --version to check. If you see a version number, you are good. If not, use one of these commands for your system:',
      language: 'bash',
      code: 'xcode-select --install  # macOS\nsudo apt install git     # Ubuntu/Debian\nwinget install Git.Git   # Windows',
    },
    {
      type: 'terminal',
      instruction: 'Tell Git your name. This gets attached to every change you save. Replace "Your Name" with your actual name:',
      expectedCommand: 'git config --global user.name "Your Name"',
      hint: 'git config --global user.name "..."',
    },
    {
      type: 'terminal',
      instruction: 'Now tell Git your email. Use the same email you used to sign up for GitHub so your changes get linked to your profile:',
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
      explanation: 'GitHub matches the email in your changes to your profile. If they do not match, your work shows up as "unknown contributor" instead of your name.',
    },
    {
      type: 'checkpoint',
      xp: 2,
      message: 'Git is configured! Your changes will now be tracked under your name.',
    },

    // === VS CODE ===
    {
      type: 'info',
      title: 'Step 4: VS Code',
      body: 'VS Code is the code editor we use throughout the course. It is free and works on Mac, Windows, and Linux. Download it from code.visualstudio.com if you have not already.',
    },
    {
      type: 'order',
      instruction: 'Install these VS Code extensions (add-ons that make coding easier). Put them in this order, most important first:',
      items: ['ESLint', 'Tailwind CSS IntelliSense', 'Prettier', 'Error Lens'],
      correctOrder: [0, 1, 2, 3],
    },
    {
      type: 'code-demo',
      title: 'Enable format on save',
      body: 'Add this to your VS Code settings. It automatically cleans up your code formatting every time you save a file — one less thing to worry about:',
      language: 'json',
      filename: 'settings.json',
      code: '{\n  "editor.formatOnSave": true,\n  "editor.defaultFormatter": "esbenp.prettier-vscode"\n}',
    },
    {
      type: 'checkpoint',
      xp: 1,
      message: 'VS Code is set up! Your editor is ready for action.',
    },

    // === SHELL ALIASES ===
    {
      type: 'info',
      title: 'Step 5: Terminal shortcuts',
      body: "You will use the terminal a lot in this course. Shortcuts (called aliases) let you type short commands instead of long ones. They go in your terminal settings file (called ~/.zshrc on Mac or ~/.bashrc on Linux).",
    },
    {
      type: 'code-demo',
      body: 'Add these shortcuts to your terminal settings file. This lets you type short commands instead of long ones — for example, typing gs instead of git status:',
      language: 'bash',
      filename: '~/.zshrc',
      code: '# Git shortcuts\nalias gs="git status"\nalias gc="git commit"\nalias gp="git push"\nalias gl="git log --oneline -20"\n\n# Project shortcuts\nalias dev="bun run dev"\nalias build="bun run build"',
    },
    {
      type: 'code-input',
      instruction: 'After editing your terminal settings file, you need to reload it. What command does that? (The file is called .zshrc)',
      placeholder: 'source ~/.______',
      answer: 'source ~/.zshrc',
      hint: 'Type source followed by the path to your settings file: ~/.zshrc',
    },
    {
      type: 'checkpoint',
      xp: 1,
      message: 'Shortcuts are set! You will save a lot of typing from here on.',
    },

    // === SSH KEYS ===
    {
      type: 'info',
      title: 'Step 6: SSH keys (secure login for GitHub)',
      body: 'SSH keys are secure login credentials — like a password, but safer and more convenient. Once set up, you can send code to GitHub without typing your password every time. We will create a key using the Ed25519 format, which is the modern standard.',
    },
    {
      type: 'terminal',
      instruction: 'Open your terminal and paste this command to create your SSH key. Replace the email with your own:',
      expectedCommand: 'ssh-keygen -t ed25519 -C "you@example.com"',
      hint: 'ssh-keygen -t ed25519 -C "your email"',
    },
    {
      type: 'code-demo',
      body: 'Now activate the SSH helper program and register your new key. Paste these two commands one at a time:',
      language: 'bash',
      code: 'eval "$(ssh-agent -s)"\nssh-add ~/.ssh/id_ed25519',
    },
    {
      type: 'info',
      title: 'Add your key to GitHub',
      body: 'Copy your public key by pasting this in your terminal: cat ~/.ssh/id_ed25519.pub | pbcopy — this copies it to your clipboard. Then go to GitHub, click your profile picture, go to Settings, then SSH and GPG keys, click New SSH key, paste your key, and save.',
    },
    {
      type: 'terminal',
      instruction: 'Test your connection to GitHub. If it works, you will see a message saying "successfully authenticated":',
      expectedCommand: 'ssh -T git@github.com',
    },
    {
      type: 'checkpoint',
      xp: 1,
      message: 'SSH is connected! You can now securely communicate with GitHub.',
    },

    // === INTERACTIVE REVIEW ===
    {
      type: 'match',
      instruction: 'Match each tool to its purpose in your development setup:',
      leftItems: ['Node.js', 'Bun', 'Git', 'VS Code', 'SSH Key'],
      rightItems: ['JavaScript runtime for running code', 'Fast package manager and bundler', 'Version control for tracking changes', 'Code editor with extensions', 'Secure authentication with GitHub'],
      correctPairs: { 0: 0, 1: 1, 2: 2, 3: 3, 4: 4 },
      explanation: 'Each tool serves a specific role. Node.js runs JavaScript, Bun manages packages fast, Git tracks code history, VS Code is your editor, and SSH keys authenticate you with GitHub without passwords.',
    },
    {
      type: 'code-fill',
      instruction: 'Complete the VS Code settings to enable automatic formatting on save:',
      language: 'json',
      filename: '.vscode/settings.json',
      template: '{\n  "editor.{{setting1}}": {{value1}},\n  "editor.{{setting2}}": "esbenp.prettier-vscode"\n}',
      blanks: [
        { id: 'setting1', answer: 'formatOnSave', alternatives: ['format_on_save'], placeholder: 'which setting?', hint: 'Two words: format + on + save' },
        { id: 'value1', answer: 'true', placeholder: 'true or false?' },
        { id: 'setting2', answer: 'defaultFormatter', alternatives: ['default_formatter'], placeholder: 'which formatter setting?', hint: 'What is the default formatter?' },
      ],
      explanation: 'formatOnSave automatically runs Prettier every time you save. defaultFormatter tells VS Code which extension to use for formatting.',
    },

    // === VERIFICATION ===
    {
      type: 'checklist',
      title: 'Final check — run each of these in your terminal and confirm they work:',
      items: [
        'Run node --version in your terminal — you should see v22 or higher',
        'Run bun --version — you should see a version number like 1.x.x',
        'Run git --version — you should see a version number like 2.x.x',
        'Open VS Code and confirm your extensions are installed (look in the sidebar)',
        'Run ssh -T git@github.com — you should see "successfully authenticated"',
        'Type gs in your terminal — it should show your git status (this tests your shortcuts)',
      ],
    },
    {
      type: 'checkpoint',
      xp: 5,
      message: 'Your machine is fully set up! Everything is installed and ready. On to the next lesson.',
    },
  ],
}

export default content
