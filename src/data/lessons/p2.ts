import type { LessonContent } from './types'

const content: LessonContent = {
  lessonId: 'p2',
  blocks: [
    {
      type: 'heading',
      text: 'Deploy first, code second',
    },
    {
      type: 'text',
      text: 'Most courses save deployment for the end. We do it first. Here\'s why: if you can\'t deploy, nothing else matters. A feature that works locally but can\'t ship is a feature that doesn\'t exist.',
    },
    {
      type: 'text',
      text: 'By the end of this lesson you\'ll have a live URL anyone can visit. That\'s the foundation everything else builds on.',
    },
    {
      type: 'heading',
      text: '1. Create a Vercel account',
    },
    {
      type: 'steps',
      items: [
        {
          title: 'Go to vercel.com and sign up',
          body: 'Use "Continue with GitHub" — this connects your repos automatically and saves a step later.',
        },
        {
          title: 'Choose the Hobby plan',
          body: 'It\'s free and covers everything we need for the course. You can upgrade later if you want custom domains or more bandwidth.',
        },
      ],
    },
    {
      type: 'tip',
      text: 'Signing up with GitHub is important. It lets Vercel auto-detect your repos and set up webhooks for automatic deployments on every push.',
    },
    {
      type: 'heading',
      text: '2. Create a Next.js project',
    },
    {
      type: 'text',
      text: 'We\'ll use Next.js as the framework for the course projects. Create a new project with the App Router:',
    },
    {
      type: 'code',
      language: 'bash',
      code: 'bunx create-next-app@latest my-first-deploy --ts --tailwind --app --src-dir --eslint',
    },
    {
      type: 'text',
      text: 'This scaffolds a TypeScript project with Tailwind CSS, the App Router, a src/ directory, and ESLint. Accept the defaults for any prompts.',
    },
    {
      type: 'text',
      text: 'Test it locally:',
    },
    {
      type: 'code',
      language: 'bash',
      code: 'cd my-first-deploy\nbun dev',
    },
    {
      type: 'text',
      text: 'Open http://localhost:3000 — you should see the Next.js welcome page.',
    },
    {
      type: 'heading',
      text: '3. Push to GitHub',
    },
    {
      type: 'text',
      text: 'Create a new repository on GitHub (github.com/new). Name it my-first-deploy. Don\'t add a README — the project already has one.',
    },
    {
      type: 'code',
      language: 'bash',
      code: 'git remote add origin git@github.com:YOUR_USERNAME/my-first-deploy.git\ngit branch -M main\ngit push -u origin main',
    },
    {
      type: 'warning',
      text: 'Replace YOUR_USERNAME with your actual GitHub username. If the push fails, check that your SSH key is set up correctly (Lesson P1, step 6).',
    },
    {
      type: 'heading',
      text: '4. Link to Vercel',
    },
    {
      type: 'steps',
      items: [
        {
          title: 'Go to vercel.com/new',
          body: 'You\'ll see a list of your GitHub repos. Find my-first-deploy and click Import.',
        },
        {
          title: 'Configure the project',
          body: 'Vercel auto-detects Next.js. Leave all settings as defaults — framework, build command, output directory are all correct out of the box.',
        },
        {
          title: 'Click Deploy',
          body: 'Vercel clones your repo, installs dependencies, runs the build, and gives you a live URL. This takes about 30–60 seconds.',
        },
      ],
    },
    {
      type: 'text',
      text: 'When the deploy finishes, you\'ll see a screenshot of your site and a URL like my-first-deploy-abc123.vercel.app. Click it — your site is live.',
    },
    {
      type: 'heading',
      text: '5. Make a change and watch it deploy',
    },
    {
      type: 'text',
      text: 'The real power of this setup is automatic deployments. Every push to main triggers a new production deploy. Let\'s test it.',
    },
    {
      type: 'text',
      text: 'Open src/app/page.tsx and replace the content:',
    },
    {
      type: 'code',
      language: 'tsx',
      filename: 'src/app/page.tsx',
      code: 'export default function Home() {\n  return (\n    <main className="flex min-h-screen items-center justify-center">\n      <h1 className="text-4xl font-bold">Hello, Vercel.</h1>\n    </main>\n  )\n}',
    },
    {
      type: 'text',
      text: 'Commit and push:',
    },
    {
      type: 'code',
      language: 'bash',
      code: 'git add .\ngit commit -m "Replace default page with hello world"\ngit push',
    },
    {
      type: 'text',
      text: 'Go to your Vercel dashboard — you\'ll see a new deployment building. In under a minute, your live site updates automatically.',
    },
    {
      type: 'heading',
      text: '6. Preview vs. production deployments',
    },
    {
      type: 'text',
      text: 'Vercel has two types of deployments. Understanding the difference is critical:',
    },
    {
      type: 'steps',
      items: [
        {
          title: 'Production deployments',
          body: 'Triggered by pushes to the main branch. This is the live URL your users see. Only changes you\'re confident about should go here.',
        },
        {
          title: 'Preview deployments',
          body: 'Triggered by pushes to any other branch, or by opening a pull request. Each gets a unique URL. Use these to test changes before merging to main.',
        },
      ],
    },
    {
      type: 'text',
      text: 'Let\'s try a preview deployment:',
    },
    {
      type: 'code',
      language: 'bash',
      code: 'git checkout -b test-preview\n# Make any small change to page.tsx\ngit add .\ngit commit -m "Test preview deployment"\ngit push -u origin test-preview',
    },
    {
      type: 'text',
      text: 'Check the Vercel dashboard — you\'ll see a preview deployment with its own unique URL. Your production site is unchanged.',
    },
    {
      type: 'tip',
      text: 'Preview deployments are your safety net. In the course, you\'ll always test on a preview URL before shipping to production. This habit prevents broken deploys.',
    },
    {
      type: 'heading',
      text: 'Verification checklist',
    },
    {
      type: 'checklist',
      items: [
        'Vercel account created and linked to GitHub',
        'Next.js project scaffolded and runs locally',
        'Repository pushed to GitHub',
        'First production deployment live at a .vercel.app URL',
        'Code change auto-deployed on push to main',
        'Preview deployment created from a branch',
      ],
    },
    {
      type: 'heading',
      text: 'What you just built',
    },
    {
      type: 'text',
      text: 'You now have a deploy pipeline. Code goes from your editor → Git → GitHub → Vercel → live URL. Every future lesson builds on this pipeline. When we say "ship it," this is how.',
    },
  ],
}

export default content
