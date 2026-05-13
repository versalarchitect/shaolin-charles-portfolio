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
      type: 'info',
      title: 'Step 1: Create a Vercel account',
      body: 'Go to vercel.com and sign up for a free account. Click "Continue with GitHub" — this automatically connects your GitHub projects to Vercel, saving you a setup step later.',
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
      type: 'checklist',
      title: 'Vercel setup:',
      items: [
        'Went to vercel.com',
        'Signed up with GitHub',
        'Selected the Hobby (free) plan',
      ],
    },
    {
      type: 'checkpoint',
      xp: 2,
      message: 'Vercel account ready!',
    },

    // === CREATE PROJECT ===
    {
      type: 'info',
      title: 'Step 2: Create your first project',
      body: "We will use Next.js, a popular framework (a pre-built foundation) for building web apps. Let us create one now. You do not need to understand everything it sets up — the AI agent will handle the details.",
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
      type: 'info',
      title: 'Check it',
      body: 'Open http://localhost:3000 in your browser. You should see the Next.js welcome page. If you see it — your project works locally.',
    },
    {
      type: 'checkpoint',
      xp: 2,
      message: 'Your project is running on your computer! You just created a web app.',
    },

    // === PUSH TO GITHUB ===
    {
      type: 'info',
      title: 'Step 3: Push to GitHub',
      body: "Now let us put your code on GitHub so Vercel can see it. Go to github.com/new in your browser. Name the repository my-first-deploy. Do not check any boxes (no README, no .gitignore) — the project already has those files.",
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
      type: 'info',
      title: 'Step 4: Deploy to Vercel',
      body: 'Go to vercel.com/new in your browser. You will see your GitHub projects listed. Find my-first-deploy, click Import, and hit Deploy. Vercel automatically detects that it is a Next.js project — just leave all settings as they are.',
    },
    {
      type: 'checklist',
      title: 'Deploy checklist:',
      items: [
        'Went to vercel.com/new',
        'Found and imported my-first-deploy',
        'Left settings as defaults (Next.js auto-detected)',
        'Clicked Deploy',
        'Got a live .vercel.app URL',
      ],
    },
    {
      type: 'checkpoint',
      xp: 2,
      message: 'Your app is live on the internet! You have a real URL anyone can visit.',
    },

    // === AUTO DEPLOY ===
    {
      type: 'info',
      title: 'Step 5: Auto-deploy on push',
      body: "Here is the magic: every time you push code to GitHub, Vercel automatically publishes the update. No manual steps. Let us test this by making a small change to your homepage file:",
    },
    {
      type: 'code-demo',
      body: 'Replace src/app/page.tsx with:',
      language: 'tsx',
      filename: 'src/app/page.tsx',
      code: 'export default function Home() {\n  return (\n    <main className="flex min-h-screen items-center justify-center">\n      <h1 className="text-4xl font-bold">Hello, Vercel.</h1>\n    </main>\n  )\n}',
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
      type: 'info',
      title: 'Watch it deploy',
      body: 'Check your Vercel dashboard — you will see a new deployment building. In under a minute, your live site updates automatically. From now on, every time you push code, your site updates. No manual work needed.',
    },
    {
      type: 'checkpoint',
      xp: 1,
      message: 'Auto-deploy is working! Push code, site updates. That simple.',
    },

    // === PREVIEW VS PRODUCTION ===
    {
      type: 'diagram',
      title: 'Preview vs Production',
      body: 'Which branch you push to determines whether your changes go live to users or just create a test version for you to preview first.',
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
    },
    {
      type: 'info',
      title: 'Step 6: Preview vs. Production',
      body: 'Vercel has two deployment types: production (what your users see) and preview (a private test version). Understanding this keeps you safe.',
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
      type: 'info',
      title: 'Preview = safety net',
      body: 'Preview deployments are your safety net. You test changes on a private URL before they go live. Your real site stays untouched. This habit prevents you from accidentally breaking something your users see.',
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
      type: 'checklist',
      title: 'Final verification:',
      items: [
        'Vercel account linked to GitHub',
        'Next.js project runs locally',
        'Code pushed to GitHub',
        'Production deployment live',
        'Auto-deploy works on push',
        'Preview deployment created from branch',
      ],
    },
    {
      type: 'checkpoint',
      xp: 5,
      message: 'Deploy pipeline complete! You can now push code and it goes live automatically. That is a real superpower.',
    },
  ],
}

export default content
