import type { LessonContent } from './types'

const content: LessonContent = {
  lessonId: 'p2',
  steps: [
    {
      type: 'info',
      title: 'Deploy first, code second',
      body: "Most courses save deployment for the end. We do it first. If you can't deploy, nothing else matters. A feature that works locally but can't ship is a feature that doesn't exist.",
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
      explanation: 'A deploy pipeline is the foundation. Every feature, fix, and experiment needs to reach users — setting this up first means you never get stuck at the end.',
    },
    {
      type: 'checkpoint',
      xp: 1,
      message: 'Philosophy unlocked!',
    },

    {
      type: 'diagram',
      title: 'The Deployment Pipeline',
      body: 'Every change follows this path from your machine to the world.',
      diagram: {
        direction: 'LR',
        nodes: [
          { id: 'edit', label: 'Edit Code' },
          { id: 'commit', label: 'Commit' },
          { id: 'push', label: 'Push' },
          { id: 'gh', label: 'GitHub' },
          { id: 'vc', label: 'Vercel', sublabel: 'Auto-build' },
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
    },

    // === VERCEL ACCOUNT ===
    {
      type: 'info',
      title: 'Step 1: Create a Vercel account',
      body: 'Go to vercel.com and sign up. Use "Continue with GitHub" — this connects your repos automatically and saves a step later.',
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
      explanation: 'Signing up with GitHub lets Vercel auto-detect your repos and set up automatic deployments on every push. One less thing to configure.',
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
      title: 'Step 2: Create a Next.js project',
      body: "We'll use Next.js as the framework for the course projects. Let's scaffold one with TypeScript, Tailwind CSS, and the App Router.",
    },
    {
      type: 'terminal',
      instruction: 'Create a new Next.js project:',
      expectedCommand: 'bunx create-next-app@latest my-first-deploy --ts --tailwind --app --src-dir --eslint',
      hint: 'bunx create-next-app@latest my-first-deploy --ts --tailwind --app --src-dir --eslint',
    },
    {
      type: 'terminal',
      instruction: 'Enter the project directory:',
      expectedCommand: 'cd my-first-deploy',
    },
    {
      type: 'terminal',
      instruction: 'Start the dev server to verify it works:',
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
      message: 'Project scaffolded!',
    },

    // === PUSH TO GITHUB ===
    {
      type: 'info',
      title: 'Step 3: Push to GitHub',
      body: "Create a new repository on GitHub (github.com/new). Name it my-first-deploy. Don't add a README — the project already has one.",
    },
    {
      type: 'terminal',
      instruction: 'Add the GitHub remote:',
      expectedCommand: 'git remote add origin git@github.com:YOUR_USERNAME/my-first-deploy.git',
      hint: 'git remote add origin git@github.com:...',
    },
    {
      type: 'terminal',
      instruction: 'Push your code to GitHub:',
      expectedCommand: 'git push -u origin main',
    },
    {
      type: 'multiple-choice',
      question: 'What does the -u flag do in git push -u origin main?',
      options: [
        'Uploads all branches',
        'Sets the upstream tracking branch so future pushes just need "git push"',
        'Undoes the previous commit',
        'Updates the remote URL',
      ],
      correctIndex: 1,
      explanation: 'The -u (--set-upstream) flag links your local branch to the remote one. After this, you can just type "git push" without specifying the remote and branch.',
    },
    {
      type: 'checkpoint',
      xp: 2,
      message: 'Code on GitHub!',
    },

    // === DEPLOY ===
    {
      type: 'info',
      title: 'Step 4: Deploy to Vercel',
      body: 'Go to vercel.com/new. You\'ll see your GitHub repos. Find my-first-deploy, click Import, and hit Deploy. Vercel auto-detects Next.js — leave all settings as defaults.',
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
      message: 'First deploy live!',
    },

    // === AUTO DEPLOY ===
    {
      type: 'info',
      title: 'Step 5: Auto-deploy on push',
      body: "The real power: every push to main triggers a new production deploy. Let's test it. Replace the content of src/app/page.tsx:",
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
      instruction: 'Stage all changes:',
      expectedCommand: 'git add .',
    },
    {
      type: 'terminal',
      instruction: 'Commit with a message:',
      expectedCommand: 'git commit -m "Replace default page with hello world"',
      hint: 'git commit -m "..."',
    },
    {
      type: 'terminal',
      instruction: 'Push to trigger auto-deploy:',
      expectedCommand: 'git push',
    },
    {
      type: 'info',
      title: 'Watch it deploy',
      body: 'Go to your Vercel dashboard — a new deployment is building. In under a minute, your live site updates automatically. No manual deploy needed, ever.',
    },
    {
      type: 'checkpoint',
      xp: 1,
      message: 'Auto-deploy works!',
    },

    // === PREVIEW VS PRODUCTION ===
    {
      type: 'diagram',
      title: 'Preview vs Production',
      body: 'The branch you push to determines the deployment type.',
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
      body: 'Vercel has two deployment types. Understanding this is critical for the rest of the course.',
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
      explanation: 'Pushes to main = production. Pushes to any other branch = preview deployment with a unique URL. Your users only see production.',
    },
    {
      type: 'terminal',
      instruction: 'Create a test branch for a preview deployment:',
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
      body: 'Preview deployments are your safety net. Test changes on a unique URL before merging to main. Your production site stays untouched. This habit prevents broken deploys.',
    },
    {
      type: 'checkpoint',
      xp: 1,
      message: 'Preview deploys mastered!',
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
      message: 'Deploy pipeline complete! You now have a ship-on-push workflow.',
    },
  ],
}

export default content
