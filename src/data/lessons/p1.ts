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
      type: 'match',
      hint: 'Find the unique connection between each pair.',
      instruction: 'Before we start, match each tool to its one-line description. You will install all of these:',
      leftItems: ['Node.js', 'Bun', 'Git', 'VS Code', 'SSH keys'],
      rightItems: ['Engine that runs your apps', 'Installs project dependencies quickly', 'Tracks changes like version history', 'Text editor where you review code', 'Secure login for GitHub'],
      correctPairs: { 0: 0, 1: 1, 2: 2, 3: 3, 4: 4 },
      explanation: 'Node.js runs JavaScript code. Bun installs dependencies fast. Git tracks code history. VS Code is your code editor. SSH keys let you securely connect to GitHub. Every one of these tools gets used throughout the course.',
    },
    {
      type: 'interactive-diagram',
      title: 'Your Setup Roadmap',
      body: 'We install each tool in order. Each one builds on the last. Step through to see what each tool does.',
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
      stages: [
        { highlightNodes: ['rt'], explanation: 'First, we install Node.js and Bun — the engines that run your code and manage project dependencies.' },
        { highlightNodes: ['rt', 'git'], highlightEdges: [{ from: 'rt', to: 'git' }], explanation: 'Next, Git tracks every change you make — like Google Docs version history, but for code.' },
        { highlightNodes: ['git', 'ed'], highlightEdges: [{ from: 'git', to: 'ed' }], explanation: 'VS Code is the editor where you review and modify code. Extensions make it smarter.' },
        { highlightNodes: ['ed', 'cfg'], highlightEdges: [{ from: 'ed', to: 'cfg' }], explanation: 'Finally, we add terminal shortcuts to save typing and SSH keys for secure GitHub access.' },
        { highlightNodes: ['cfg', 'done'], highlightEdges: [{ from: 'cfg', to: 'done' }], explanation: 'Once everything is configured, your machine is ready to build real projects with AI agents.' },
      ],
    },
    {
      type: 'checkpoint',
      xp: 1,
      message: 'Great start! Let us get your machine ready.',
    },

    // === NODE.JS ===
    {
      type: 'multiple-choice',
      hint: 'Read each option carefully — one fits the context best.',
      question: 'What is Node.js and why do we need it?',
      options: [
        'A web browser for viewing websites',
        'An engine that runs JavaScript code on your computer',
        'A text editor for writing code',
        'A tool for managing passwords',
      ],
      correctIndex: 1,
      explanation: 'Node.js is the engine that runs JavaScript code on your computer. Think of it as the motor under the hood of every app you will build. We need version 22 or later because it includes the latest modern features.',
    },
    {
      type: 'code-fill',
      hint: 'Fill in values that match the pattern shown above.',
      instruction: 'nvm (Node Version Manager) manages which version of Node.js your computer uses. Complete the install command by filling in the tool name and shell:',
      language: 'bash',
      template: 'curl -o- https://raw.githubusercontent.com/{{tool}}-sh/{{tool}}/v0.40.3/install.sh | {{shell}}',
      blanks: [
        { id: 'tool', answer: 'nvm', placeholder: 'which tool?', hint: 'The tool that manages Node versions' },
        { id: 'shell', answer: 'bash', placeholder: 'which shell?', hint: 'The standard Unix shell that runs scripts' },
      ],
      explanation: 'nvm is installed by downloading a script from GitHub and piping it to bash. This is a common pattern for installing developer tools.',
      platforms: {
        windows: {
          instruction: 'On Windows, nvm-windows manages Node.js versions. Download and run the installer from the GitHub releases page:',
          language: 'text',
          template: '1. Go to github.com/coreybutler/nvm-windows/releases\n2. Download {{file}}\n3. Run the installer and follow the prompts',
          blanks: [
            { id: 'file', answer: 'nvm-setup.exe', placeholder: 'which file?', hint: 'The .exe installer file' },
          ],
          explanation: 'nvm-windows is a separate project from Unix nvm. It installs via a standard Windows installer (.exe) rather than a shell script.',
        },
      },
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
      platforms: {
        windows: {
          instruction: 'Now set Node 22 as the active version. On Windows, nvm-windows uses "use" instead of "alias default":',
          expectedCommand: 'nvm use 22',
          hint: 'nvm use <version>',
        },
      },
    },
    {
      type: 'multiple-choice',
      hint: 'Eliminate the options that only partially fit.',
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
      type: 'interactive-diagram',
      title: 'nvm in Action',
      body: 'Each project can use a different Node version. nvm switches instantly. Step through to see how.',
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
      stages: [
        { highlightNodes: ['nvm'], explanation: 'nvm sits at the top, managing all your Node.js versions. It knows which version each project needs.' },
        { highlightNodes: ['nvm', 'pa', 'v18'], highlightEdges: [{ from: 'nvm', to: 'pa' }, { from: 'pa', to: 'v18' }], explanation: 'Project A uses Node 18 — maybe it is an older codebase that has not been upgraded yet.' },
        { highlightNodes: ['nvm', 'pb', 'v22'], highlightEdges: [{ from: 'nvm', to: 'pb' }, { from: 'pb', to: 'v22' }], explanation: 'Project B uses Node 22 — the latest version with modern features. This is what we are using in this course.' },
        { highlightNodes: ['nvm', 'pc', 'v20'], highlightEdges: [{ from: 'nvm', to: 'pc' }, { from: 'pc', to: 'v20' }], explanation: 'Project C uses Node 20 — a different version entirely. nvm switches between all of these instantly.' },
      ],
    },

    // === BUN ===
    {
      type: 'multiple-choice',
      hint: 'Focus on the primary goal, not secondary benefits.',
      question: 'What does Bun do and why do we use it instead of npm?',
      options: [
        'Bun is a web browser that renders JavaScript',
        'Bun installs project dependencies and runs scripts — same as npm but much faster',
        'Bun is a code editor like VS Code',
        'Bun replaces Node.js entirely',
      ],
      correctIndex: 1,
      explanation: 'Bun is a tool that installs your project dependencies (the building blocks your app needs) and runs scripts. It does the same job as npm but much faster. You will use it throughout the course.',
    },
    {
      type: 'terminal',
      hint: 'Check the exact command syntax — flags and arguments matter.',
      instruction: 'Open your terminal and paste this command. It downloads and installs Bun on your machine:',
      expectedCommand: 'curl -fsSL https://bun.sh/install | bash',
      platforms: {
        windows: {
          instruction: 'Open PowerShell and paste this command. It downloads and installs Bun on your machine:',
          expectedCommand: 'powershell -c "irm bun.sh/install.ps1 | iex"',
        },
      },
    },
    {
      type: 'terminal',
      hint: 'Review the terminal instructions from the previous step.',
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
      type: 'multiple-choice',
      hint: 'Think about which option is most specific to this concept.',
      question: 'What is the best way to describe what Git does?',
      options: [
        'Git is a cloud storage service like Google Drive',
        'Git tracks all your code changes like version history, letting you undo mistakes and collaborate safely',
        'Git is a programming language for building websites',
        'Git is a tool that automatically fixes bugs in your code',
      ],
      correctIndex: 1,
      explanation: 'Git is a tool that tracks all your changes — like Google Docs version history, but for code. It lets you undo mistakes, see what changed and when, and safely collaborate with others. If you are on a Mac, you may already have it installed.',
    },
    {
      type: 'code-fill',
      hint: 'Use the exact syntax from the lesson examples.',
      instruction: 'Most Macs already have Git via Xcode Command Line Tools. If not, complete the install command:',
      language: 'bash',
      template: '{{cmd}} --install',
      blanks: [
        { id: 'cmd', answer: 'xcode-select', placeholder: 'which command?', hint: 'The macOS tool that installs developer utilities' },
      ],
      explanation: 'On macOS, the Xcode Command Line Tools bundle includes Git automatically. Running xcode-select --install triggers the download.',
      platforms: {
        windows: {
          instruction: 'Install Git on Windows using the built-in package manager. Complete the install command:',
          language: 'powershell',
          template: 'winget install {{pkg}}',
          blanks: [
            { id: 'pkg', answer: 'Git.Git', alternatives: ['git.git'], placeholder: 'package ID?', hint: 'Windows uses the format Publisher.Package' },
          ],
          explanation: 'On Windows, winget is the built-in package manager. The package ID "Git.Git" follows the Publisher.Package convention.',
        },
        linux: {
          instruction: 'Install Git on Linux using your package manager. Complete the install command:',
          language: 'bash',
          template: 'sudo apt install {{pkg}}',
          blanks: [
            { id: 'pkg', answer: 'git', placeholder: 'package?', hint: 'The tool name itself, lowercase' },
          ],
          explanation: 'On Ubuntu/Debian, the package is simply "git". Other distros use their own package managers (e.g., dnf install git on Fedora).',
        },
      },
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
      hint: 'Consider what the lesson content emphasized.',
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
      type: 'multiple-choice',
      hint: 'One option stands out when you think about the core purpose.',
      question: 'Why do we use VS Code as our code editor?',
      options: [
        'It is the only editor that supports JavaScript',
        'It is free, cross-platform, and has a rich extension ecosystem',
        'It was created by the same team that built Node.js',
        'It is faster than typing code in the terminal',
      ],
      correctIndex: 1,
      explanation: 'VS Code is the code editor we use throughout the course. It is free and works on Mac, Windows, and Linux. Its extension ecosystem makes it incredibly powerful. Download it from code.visualstudio.com if you have not already.',
    },
    {
      type: 'order',
      hint: 'Consider what depends on what — prerequisites first.',
      instruction: 'Install these VS Code extensions (add-ons that make coding easier). Put them in this order, most important first:',
      items: ['ESLint', 'Tailwind CSS IntelliSense', 'Prettier', 'Error Lens'],
      correctOrder: [0, 1, 2, 3],
    },
    {
      type: 'code-fill',
      hint: 'Each blank follows the conventions demonstrated earlier.',
      instruction: 'Complete the VS Code settings to automatically clean up code formatting every time you save a file:',
      language: 'json',
      filename: 'settings.json',
      template: '{\n  "editor.{{setting1}}": {{value1}},\n  "editor.{{setting2}}": "esbenp.prettier-vscode"\n}',
      blanks: [
        { id: 'setting1', answer: 'formatOnSave', alternatives: ['format_on_save'], placeholder: 'which setting?', hint: 'Combines format + on + save in camelCase' },
        { id: 'value1', answer: 'true', placeholder: 'on or off?', hint: 'Boolean: true or false' },
        { id: 'setting2', answer: 'defaultFormatter', alternatives: ['default_formatter'], placeholder: 'which formatter setting?', hint: 'What sets the default formatter?' },
      ],
      explanation: 'formatOnSave automatically runs Prettier every time you save. defaultFormatter tells VS Code which extension to use for formatting.',
    },
    {
      type: 'checkpoint',
      xp: 1,
      message: 'VS Code is set up! Your editor is ready for action.',
    },

    // === SHELL ALIASES ===
    {
      type: 'multiple-choice',
      hint: 'Read each option carefully — one fits the context best.',
      question: 'What are terminal aliases and where do they go?',
      options: [
        'Aliases are browser bookmarks stored in your favorites bar',
        'Aliases are shortcut commands stored in your terminal settings file (~/.zshrc or ~/.bashrc)',
        'Aliases are Git branches used for testing',
        'Aliases are VS Code extensions that run commands',
      ],
      correctIndex: 1,
      explanation: 'You will use the terminal a lot in this course. Shortcuts (called aliases) let you type short commands instead of long ones. They go in your terminal settings file (called ~/.zshrc on Mac or ~/.bashrc on Linux).',
      platforms: {
        windows: {
          question: 'What are PowerShell aliases and where do they go?',
          options: [
            'Aliases are browser bookmarks stored in your favorites bar',
            'Aliases are shortcut commands stored in your PowerShell profile ($PROFILE)',
            'Aliases are Git branches used for testing',
            'Aliases are VS Code extensions that run commands',
          ],
          correctIndex: 1,
          explanation: 'You will use the terminal a lot in this course. Shortcuts (called aliases) let you type short commands instead of long ones. In PowerShell, they go in your profile file (accessed via the $PROFILE variable).',
        },
        linux: {
          explanation: 'You will use the terminal a lot in this course. Shortcuts (called aliases) let you type short commands instead of long ones. They go in your terminal settings file (called ~/.bashrc on most Linux systems).',
        },
      },
    },
    {
      type: 'code-fill',
      hint: 'Look at the surrounding code for context clues.',
      instruction: 'Complete these terminal shortcuts. Each alias maps a short command to a longer one — for example, gs runs git status:',
      language: 'bash',
      filename: '~/.zshrc',
      template: '# Git shortcuts\nalias gs="{{cmd1}}"\nalias gc="git commit"\nalias gp="{{cmd2}}"\nalias gl="git log --oneline -20"\n\n# Project shortcuts\nalias dev="{{cmd3}}"',
      blanks: [
        { id: 'cmd1', answer: 'git status', placeholder: 'full command?', hint: 'gs stands for git s...' },
        { id: 'cmd2', answer: 'git push', placeholder: 'full command?', hint: 'gp stands for git p...' },
        { id: 'cmd3', answer: 'bun run dev', placeholder: 'full command?', hint: 'Uses bun to run the dev script' },
      ],
      explanation: 'Each alias maps a short abbreviation to the full command. gs = git status, gp = git push, dev = bun run dev. This saves typing on commands you run many times a day.',
      platforms: {
        windows: {
          instruction: 'Complete these PowerShell shortcuts. Each function maps a short command to a longer one — for example, gs runs git status:',
          language: 'powershell',
          filename: '$PROFILE',
          template: '# Git shortcuts\nfunction gs { {{cmd1}} }\nfunction gc { git commit @args }\nfunction gp { {{cmd2}} }\nfunction gl { git log --oneline -20 }\n\n# Project shortcuts\nfunction dev { {{cmd3}} }',
          blanks: [
            { id: 'cmd1', answer: 'git status', placeholder: 'full command?', hint: 'gs stands for git s...' },
            { id: 'cmd2', answer: 'git push', placeholder: 'full command?', hint: 'gp stands for git p...' },
            { id: 'cmd3', answer: 'bun run dev', placeholder: 'full command?', hint: 'Uses bun to run the dev script' },
          ],
          explanation: 'PowerShell uses functions instead of aliases for commands with arguments. gs calls git status, gp calls git push, dev calls bun run dev.',
        },
        linux: {
          filename: '~/.bashrc',
        },
      },
    },
    {
      type: 'code-input',
      instruction: 'After editing your terminal settings file, you need to reload it. What command does that? (The file is called .zshrc)',
      placeholder: 'source ~/.______',
      answer: 'source ~/.zshrc',
      hint: 'Type source followed by the path to your settings file: ~/.zshrc',
      platforms: {
        windows: {
          instruction: 'After editing your PowerShell profile, you need to reload it. What command does that?',
          placeholder: '. $______',
          answer: '. $PROFILE',
          hint: 'Use dot-sourcing (.) followed by the profile variable',
        },
        linux: {
          instruction: 'After editing your terminal settings file, you need to reload it. What command does that? (The file is called .bashrc)',
          placeholder: 'source ~/.______',
          answer: 'source ~/.bashrc',
          hint: 'Type source followed by the path to your settings file: ~/.bashrc',
        },
      },
    },
    {
      type: 'checkpoint',
      xp: 1,
      message: 'Shortcuts are set! You will save a lot of typing from here on.',
    },

    // === SSH KEYS ===
    {
      type: 'multiple-choice',
      hint: 'Eliminate the options that only partially fit.',
      question: 'What are SSH keys and why do we need them?',
      options: [
        'SSH keys are encryption tools that protect your files from viruses',
        'SSH keys are secure login credentials that let you send code to GitHub without typing your password every time',
        'SSH keys are special Git branches used for secure development',
        'SSH keys are VS Code extensions for remote editing',
      ],
      correctIndex: 1,
      explanation: 'SSH keys are secure login credentials — like a password, but safer and more convenient. Once set up, you can send code to GitHub without typing your password every time. We use the Ed25519 format, which is the modern standard.',
    },
    {
      type: 'terminal',
      instruction: 'Open your terminal and paste this command to create your SSH key. Replace the email with your own:',
      expectedCommand: 'ssh-keygen -t ed25519 -C "you@example.com"',
      hint: 'ssh-keygen -t ed25519 -C "your email"',
    },
    {
      type: 'code-fill',
      hint: 'The answer matches the API or syntax just explained.',
      instruction: 'Activate the SSH helper program and register your new key. Fill in the missing parts:',
      language: 'bash',
      template: 'eval "$({{agent}} -s)"\nssh-add ~/.ssh/{{keyfile}}',
      blanks: [
        { id: 'agent', answer: 'ssh-agent', placeholder: 'which program?', hint: 'The SSH helper agent program' },
        { id: 'keyfile', answer: 'id_ed25519', alternatives: ['id_ed25519.pub'], placeholder: 'key filename?', hint: 'The private key file created by ssh-keygen with Ed25519' },
      ],
      explanation: 'ssh-agent is a helper program that holds your keys in memory. ssh-add registers your specific key (id_ed25519) with the agent so it can be used automatically.',
      platforms: {
        windows: {
          instruction: 'Start the SSH agent service and register your new key. Fill in the missing parts:',
          language: 'powershell',
          template: 'Get-Service {{agent}} | Set-Service -StartupType Automatic\nStart-Service {{agent}}\nssh-add ~\\.ssh\\{{keyfile}}',
          blanks: [
            { id: 'agent', answer: 'ssh-agent', placeholder: 'which service?', hint: 'The SSH helper agent service' },
            { id: 'keyfile', answer: 'id_ed25519', alternatives: ['id_ed25519.pub'], placeholder: 'key filename?', hint: 'The private key file created by ssh-keygen with Ed25519' },
          ],
          explanation: 'On Windows, ssh-agent runs as a system service. You enable it with Set-Service and start it with Start-Service, then register your key with ssh-add.',
        },
      },
    },
    {
      type: 'order',
      hint: 'Think about what needs to exist before each next step.',
      instruction: 'Put these steps for adding your SSH key to GitHub in the correct order:',
      items: [
        'Copy your public key: cat ~/.ssh/id_ed25519.pub | pbcopy',
        'Go to GitHub and click your profile picture',
        'Navigate to Settings, then SSH and GPG keys',
        'Click New SSH key and paste your key',
        'Save the key',
      ],
      correctOrder: [0, 1, 2, 3, 4],
      platforms: {
        windows: {
          items: [
            'Copy your public key: cat ~/.ssh/id_ed25519.pub | clip',
            'Go to GitHub and click your profile picture',
            'Navigate to Settings, then SSH and GPG keys',
            'Click New SSH key and paste your key',
            'Save the key',
          ],
          correctOrder: [0, 1, 2, 3, 4],
        },
        linux: {
          items: [
            'Copy your public key: xclip -sel clipboard < ~/.ssh/id_ed25519.pub',
            'Go to GitHub and click your profile picture',
            'Navigate to Settings, then SSH and GPG keys',
            'Click New SSH key and paste your key',
            'Save the key',
          ],
          correctOrder: [0, 1, 2, 3, 4],
        },
      },
    },
    {
      type: 'terminal',
      hint: 'The command follows the CLI pattern shown above.',
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
      hint: 'Match each term to its most specific definition.',
      instruction: 'Match each tool to its purpose in your development setup:',
      leftItems: ['Node.js', 'Bun', 'Git', 'VS Code', 'SSH Key'],
      rightItems: ['JavaScript runtime for running code', 'Fast package manager and bundler', 'Version control for tracking changes', 'Code editor with extensions', 'Secure authentication with GitHub'],
      correctPairs: { 0: 0, 1: 1, 2: 2, 3: 3, 4: 4 },
      explanation: 'Each tool serves a specific role. Node.js runs JavaScript, Bun manages packages fast, Git tracks code history, VS Code is your editor, and SSH keys authenticate you with GitHub without passwords.',
    },
    {
      type: 'code-fill',
      hint: 'Fill in values that match the pattern shown above.',
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
      type: 'match',
      hint: 'Look for the distinguishing feature of each item.',
      instruction: 'Match each verification command to what you should see as output:',
      leftItems: ['node --version', 'bun --version', 'git --version', 'ssh -T git@github.com', 'gs'],
      rightItems: ['v22.x.x or higher', 'A version like 1.x.x', 'A version like 2.x.x', '"successfully authenticated"', 'Your git status output'],
      correctPairs: { 0: 0, 1: 1, 2: 2, 3: 3, 4: 4 },
      explanation: 'Each command verifies a different tool. node --version should show v22+, bun shows its version, git shows its version, ssh -T tests your GitHub connection, and gs tests your alias for git status.',
    },
    {
      type: 'checkpoint',
      xp: 5,
      message: 'Your machine is fully set up! Everything is installed and ready. On to the next lesson.',
    },
  ],
}

export default content
