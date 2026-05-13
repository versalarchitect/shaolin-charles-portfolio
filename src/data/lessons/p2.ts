import type { LessonContent } from './types'

const content: LessonContent = {
  lessonId: 'p2',
  steps: [
    {
      type: 'info',
      title: 'Deploy first, code second',
      body: "Most courses save deployment for the end. We do it first. Deployment means putting your app on the internet so anyone can visit it. If you cannot deploy, nothing else matters. Something that works only on your computer is not a product yet.",
    },
    {
      type: 'multiple-choice',
      question: 'Why do we deploy before writing any real code?',
      options: [
        'Deployment is the easiest part',
        'To impress our friends with a URL',
        'If you can\'t deploy, nothing else matters',
        'Vercel requires it',
      ],
      correctIndex: 2,
      explanation: 'Your deploy pipeline is the road from your computer to the internet. Every feature you build needs this road to reach users. Setting it up first means you will never get stuck at the end wondering how to go live.',
    },
    {
      type: 'checkpoint',
      xp: 1,
      message: 'You understand why we deploy first. Smart thinking.',
    },

    {
      type: 'interactive-diagram',
      title: 'The Deployment Pipeline',
      body: 'Every change follows this path from your machine to the world. Step through each stage to see what happens.',
      diagram: {
        direction: 'LR',
        nodes: [
          { id: 'edit', label: 'Edit Code' },
          { id: 'commit', label: 'Commit' },
          { id: 'push', label: 'Push' },
          { id: 'gh', label: 'GitHub', sublabel: 'Code storage' },
          { id: 'vc', label: 'Vercel', sublabel: 'Auto-publishes' },
          { id: 'live', label: 'Live', shape: 'pill', highlight: true },
        ],
        edges: [
          { from: 'edit', to: 'commit' },
          { from: 'commit', to: 'push' },
          { from: 'push', to: 'gh' },
          { from: 'gh', to: 'vc', label: 'webhook' },
          { from: 'vc', to: 'live' },
        ],
      },
      stages: [
        { highlightNodes: ['edit'], explanation: 'You make changes to your code in VS Code or any editor. Nothing leaves your computer yet.' },
        { highlightNodes: ['edit', 'commit'], highlightEdges: [{ from: 'edit', to: 'commit' }], explanation: 'Git commit saves a snapshot of your changes with a short description. Think of it as a save point you can return to.' },
        { highlightNodes: ['commit', 'push'], highlightEdges: [{ from: 'commit', to: 'push' }], explanation: 'Git push sends your saved changes from your computer to GitHub. This is when your code leaves your machine.' },
        { highlightNodes: ['push', 'gh'], highlightEdges: [{ from: 'push', to: 'gh' }], explanation: 'GitHub receives your code and stores it. It also notifies Vercel that something changed via a webhook.' },
        { highlightNodes: ['gh', 'vc'], highlightEdges: [{ from: 'gh', to: 'vc' }], explanation: 'Vercel automatically pulls your code, builds your app, and prepares it for the internet. No manual steps needed.' },
        { highlightNodes: ['vc', 'live'], highlightEdges: [{ from: 'vc', to: 'live' }], explanation: 'Your app is live! Anyone with the URL can visit it. The whole process takes under a minute.' },
      ],
    },

    // === VERCEL ACCOUNT ===
    {
      type: 'multiple-choice',
      question: 'When creating a Vercel account, which signup method should you use and why?',
      options: [
        'Email signup — it is more secure',
        'Continue with GitHub — it auto-connects your repos for automatic deployments',
        'Google signup — it syncs your calendar',
        'Any method works the same way',
      ],
      correctIndex: 1,
      explanation: 'Go to vercel.com and sign up for a free account. Click "Continue with GitHub" — this automatically connects your GitHub projects to Vercel, saving you a setup step later. Your repos become instantly available for deployment.',
    },
    {
      type: 'multiple-choice',
      question: 'Why sign up with GitHub instead of email?',
      options: [
        'Email signup is broken',
        'It auto-connects your repos and sets up webhooks',
        'GitHub accounts are more secure',
        'Vercel only supports GitHub',
      ],
      correctIndex: 1,
      explanation: 'Signing up with GitHub lets Vercel see your projects automatically and publish updates every time you push new code. One less thing to configure.',
    },
    {
      type: 'order',
      instruction: 'Put the Vercel account setup steps in the correct order:',
      items: [
        'Go to vercel.com',
        'Click "Continue with GitHub"',
        'Select the Hobby (free) plan',
      ],
      correctOrder: [0, 1, 2],
    },
    {
      type: 'checkpoint',
      xp: 2,
      message: 'Vercel account ready!',
    },

    // === CREATE PROJECT ===
    {
      type: 'multiple-choice',
      question: 'What is Next.js and why are we using it?',
      options: [
        'A database tool for storing user information',
        'A popular framework (pre-built foundation) for building web apps',
        'A replacement for Git version control',
        'An AI agent that writes code for you',
      ],
      correctIndex: 1,
      explanation: 'Next.js is a popular framework (a pre-built foundation) for building web apps. You do not need to understand everything it sets up — the AI agent will handle the details. We are using it because it works seamlessly with Vercel deployment.',
    },
    {
      type: 'terminal',
      instruction: 'Open your terminal and paste this command. It creates a new project folder with all the starter files you need:',
      expectedCommand: 'bunx create-next-app@latest my-first-deploy --ts --tailwind --app --src-dir --eslint',
      hint: 'bunx create-next-app@latest my-first-deploy --ts --tailwind --app --src-dir --eslint',
    },
    {
      type: 'terminal',
      instruction: 'Now navigate into your new project folder by pasting this command:',
      expectedCommand: 'cd my-first-deploy',
    },
    {
      type: 'terminal',
      instruction: 'Start the development server. This runs your project locally so you can see it in your browser:',
      expectedCommand: 'bun dev',
    },
    {
      type: 'multiple-choice',
      question: 'After running bun dev, what URL should you open to see your project running locally?',
      options: [
        'http://vercel.com/preview',
        'http://localhost:3000',
        'http://github.com/my-project',
        'http://nextjs.org/demo',
      ],
      correctIndex: 1,
      explanation: 'When you run bun dev, Next.js starts a local development server at http://localhost:3000. Open this URL in your browser and you should see the Next.js welcome page. If you see it — your project works locally.',
    },
    {
      type: 'checkpoint',
      xp: 2,
      message: 'Your project is running on your computer! You just created a web app.',
    },

    // === PUSH TO GITHUB ===
    {
      type: 'multiple-choice',
      question: 'When creating a new GitHub repository for your project, why should you NOT check "Add a README" or "Add .gitignore"?',
      options: [
        'GitHub charges extra for those files',
        'The project already has those files — adding them would create conflicts',
        'README files slow down deployments',
        'Vercel ignores repositories with README files',
      ],
      correctIndex: 1,
      explanation: 'When you created the project with create-next-app, it already generated README and .gitignore files. If GitHub also creates them, you get a conflict on your first push. Go to github.com/new, name it my-first-deploy, and leave all boxes unchecked.',
    },
    {
      type: 'terminal',
      instruction: 'Tell your local project where to send code on GitHub. Replace YOUR_USERNAME with your GitHub username:',
      expectedCommand: 'git remote add origin git@github.com:YOUR_USERNAME/my-first-deploy.git',
      hint: 'git remote add origin git@github.com:...',
    },
    {
      type: 'terminal',
      instruction: 'Send your code up to GitHub for the first time. The -u flag remembers this connection so you will not need to type it again:',
      expectedCommand: 'git push -u origin main',
    },
    {
      type: 'multiple-choice',
      question: 'What does the -u flag do in git push -u origin main?',
      options: [
        'Uploads all branches at once',
        'Remembers the connection so future pushes only need "git push"',
        'Undoes your last change',
        'Updates the web address of your project',
      ],
      correctIndex: 1,
      explanation: 'The -u flag tells Git to remember where to send your code. After this first time, you can just type "git push" and it knows where to go. One less thing to remember.',
    },
    {
      type: 'checkpoint',
      xp: 2,
      message: 'Your code is on GitHub! Anyone with the link can see your project.',
    },

    // === DEPLOY ===
    {
      type: 'order',
      instruction: 'Put the Vercel deployment steps in the correct order:',
      items: [
        'Go to vercel.com/new in your browser',
        'Find my-first-deploy in your GitHub project list',
        'Click Import on the project',
        'Leave all settings as defaults (Next.js auto-detected)',
        'Click Deploy and wait for your live URL',
      ],
      correctOrder: [0, 1, 2, 3, 4],
    },
    {
      type: 'multiple-choice',
      question: 'After deploying your first project, what kind of URL do you get from Vercel?',
      options: [
        'A localhost URL that only works on your computer',
        'A .vercel.app URL that anyone on the internet can visit',
        'A .github.io URL hosted by GitHub',
        'No URL — you need to set up a custom domain first',
      ],
      correctIndex: 1,
      explanation: 'After clicking Deploy, Vercel gives you a live .vercel.app URL that anyone on the internet can visit. This is your production URL. You can add a custom domain later, but the .vercel.app URL works immediately.',
    },
    {
      type: 'checkpoint',
      xp: 2,
      message: 'Your app is live on the internet! You have a real URL anyone can visit.',
    },

    // === AUTO DEPLOY ===
    {
      type: 'multiple-choice',
      question: 'What happens when you push code to GitHub after connecting Vercel?',
      options: [
        'Nothing — you need to manually click Deploy each time',
        'GitHub sends you an email asking to approve the deployment',
        'Vercel automatically detects the push and publishes the update',
        'You need to run a separate deploy command in your terminal',
      ],
      correctIndex: 2,
      explanation: 'Here is the magic: every time you push code to GitHub, Vercel automatically publishes the update. No manual steps needed. Let us test this by making a small change to your homepage file.',
    },
    {
      type: 'code-fill',
      instruction: 'Complete the homepage component to display a centered "Hello, Vercel." heading:',
      language: 'tsx',
      filename: 'src/app/page.tsx',
      template: 'export default function {{funcName}}() {\n  return (\n    <main className="flex min-h-screen items-center justify-center">\n      <{{tag}} className="text-4xl font-bold">Hello, Vercel.</{{tag}}>\n    </main>\n  )\n}',
      blanks: [
        { id: 'funcName', answer: 'Home', alternatives: ['home'], placeholder: 'component name?', hint: 'The main page component in Next.js' },
        { id: 'tag', answer: 'h1', placeholder: 'HTML tag?', hint: 'The main heading tag in HTML' },
      ],
      explanation: 'Next.js pages export a default function component. The main page uses the name Home. For the primary heading, we use h1 — the most important heading level in HTML.',
    },
    {
      type: 'terminal',
      instruction: 'Tell Git to include all your changes in the next save. This is called "staging":',
      expectedCommand: 'git add .',
    },
    {
      type: 'terminal',
      instruction: 'Save your changes with a short description of what you did. This is called a "commit":',
      expectedCommand: 'git commit -m "Replace default page with hello world"',
      hint: 'git commit -m "..."',
    },
    {
      type: 'terminal',
      instruction: 'Send your changes to GitHub. Vercel will automatically detect the update and publish it:',
      expectedCommand: 'git push',
    },
    {
      type: 'multiple-choice',
      question: 'How long does a typical Vercel deployment take after pushing code?',
      options: [
        'About 30 minutes',
        'Under a minute for most projects',
        'It depends on how many files you changed — usually 10-15 minutes',
        'Deployments only happen once per day',
      ],
      correctIndex: 1,
      explanation: 'Check your Vercel dashboard — you will see a new deployment building. In under a minute, your live site updates automatically. From now on, every time you push code, your site updates. No manual work needed.',
    },
    {
      type: 'checkpoint',
      xp: 1,
      message: 'Auto-deploy is working! Push code, site updates. That simple.',
    },

    // === PREVIEW VS PRODUCTION ===
    {
      type: 'interactive-diagram',
      title: 'Preview vs Production',
      body: 'Which branch you push to determines whether your changes go live to users or just create a test version. Step through to see how it works.',
      diagram: {
        direction: 'TB',
        nodes: [
          { id: 'push', label: 'git push', shape: 'rounded', highlight: true },
          { id: 'branch', label: 'Branch?', shape: 'diamond' },
          { id: 'main', label: 'main' },
          { id: 'feature', label: 'feature-*' },
          { id: 'prod', label: 'Production', shape: 'pill', highlight: true },
          { id: 'prev', label: 'Preview', shape: 'pill' },
        ],
        edges: [
          { from: 'push', to: 'branch' },
          { from: 'branch', to: 'main', label: 'main' },
          { from: 'branch', to: 'feature', label: 'other' },
          { from: 'main', to: 'prod' },
          { from: 'feature', to: 'prev' },
        ],
      },
      stages: [
        { highlightNodes: ['push'], explanation: 'Every deployment starts with a git push. But where your code goes depends on which branch you push to.' },
        { highlightNodes: ['push', 'branch'], highlightEdges: [{ from: 'push', to: 'branch' }], explanation: 'Vercel checks which branch received the push. This single decision determines your deployment type.' },
        { highlightNodes: ['branch', 'main', 'prod'], highlightEdges: [{ from: 'branch', to: 'main' }, { from: 'main', to: 'prod' }], explanation: 'Push to main = Production deployment. Your live site updates. Real users see the changes immediately.' },
        { highlightNodes: ['branch', 'feature', 'prev'], highlightEdges: [{ from: 'branch', to: 'feature' }, { from: 'feature', to: 'prev' }], explanation: 'Push to any other branch = Preview deployment. A private test URL only you can see. Your live site stays untouched.' },
      ],
    },
    {
      type: 'multiple-choice',
      question: 'What triggers a PRODUCTION deployment on Vercel?',
      options: [
        'Any git push to any branch',
        'Pushing to the main branch',
        'Clicking "Deploy" in the dashboard',
        'Creating a pull request',
      ],
      correctIndex: 1,
      explanation: 'Pushing to the main branch updates your live site that users see. Pushing to any other branch creates a preview — a private test URL only you can see. This keeps your live site safe while you experiment.',
    },
    {
      type: 'terminal',
      instruction: 'Create a test branch (a separate workspace for experimenting). This will not affect your live site:',
      expectedCommand: 'git checkout -b test-preview',
    },
    {
      type: 'code-input',
      instruction: 'After making a change, what command pushes this branch to create a preview deploy?',
      placeholder: 'git push -u origin _________',
      answer: 'git push -u origin test-preview',
      hint: 'Push the branch name you just created',
    },
    {
      type: 'multiple-choice',
      question: 'Why are preview deployments important?',
      options: [
        'They make your site load faster for users',
        'They let you test changes on a private URL before going live, preventing accidental breakage',
        'They are required by Vercel for all projects',
        'They save money on hosting costs',
      ],
      correctIndex: 1,
      explanation: 'Preview deployments are your safety net. You test changes on a private URL before they go live. Your real site stays untouched. This habit prevents you from accidentally breaking something your users see.',
    },
    {
      type: 'checkpoint',
      xp: 1,
      message: 'Preview deploys understood! You know how to test safely.',
    },
    {
      type: 'compare',
      title: 'Production vs Preview deployments',
      body: 'Every push triggers a deployment, but the type depends on which branch you push to.',
      question: 'Which deployment type should you use to test changes before going live?',
      correctSide: 'right',
      left: {
        label: 'Production',
        content: 'Branch: main\nTrigger: push to main\nURL: your-app.vercel.app\nVisibility: Public, live to users\nRollback: Instant via Vercel dashboard',
        language: 'text',
      },
      right: {
        label: 'Preview',
        content: 'Branch: any feature branch\nTrigger: push or PR\nURL: your-app-git-branch.vercel.app\nVisibility: Private, only you\nRollback: Not needed — just close the PR',
        language: 'text',
      },
      explanation: 'Preview deployments let you test on a real URL without affecting live users. Push to a feature branch, verify everything works, then merge to main for production.',
    },

    // === FINAL ===
    {
      type: 'order',
      instruction: 'Put the deploy pipeline in the correct order:',
      items: ['Edit code locally', 'Git commit', 'Git push to main', 'Vercel auto-builds', 'Site is live'],
      correctOrder: [0, 1, 2, 3, 4],
    },
    {
      type: 'match',
      instruction: 'Match each step in the deployment pipeline to what it accomplishes:',
      leftItems: ['Link Vercel to GitHub', 'Run bun dev', 'git push -u origin main', 'Push to a feature branch'],
      rightItems: ['Enables automatic deployments on push', 'Tests your project locally before deploying', 'Triggers a production deployment', 'Creates a preview deployment for safe testing'],
      correctPairs: { 0: 0, 1: 1, 2: 2, 3: 3 },
      explanation: 'Each step serves a specific purpose. Linking Vercel enables auto-deploys. Running dev tests locally. Pushing to main goes to production. Feature branches create safe previews.',
    },
    {
      type: 'checkpoint',
      xp: 5,
      message: 'Deploy pipeline complete! You can now push code and it goes live automatically. That is a real superpower.',
    },
  ],
}

export default content
