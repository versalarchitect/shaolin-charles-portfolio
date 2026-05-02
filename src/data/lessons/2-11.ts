import type { LessonContent } from './types'

const content: LessonContent = {
  lessonId: '2-11',
  steps: [
    // === INTRODUCTION ===
    {
      type: 'info',
      title: 'Deployment is not optional',
      body: "A product that runs on localhost is a prototype. A product that runs in production is a product. The gap between these two is where most agent-directed projects die — not because the code is wrong, but because deployment configuration, environment variables, DNS, and security concerns get hand-waved. In this lesson you will direct an agent through the full deployment pipeline: configure, audit, preview, and ship. This is the last skill before you prove the whole loop in the capstone.",
    },
    {
      type: 'info',
      title: 'The production readiness gap',
      body: "Agents are excellent at writing application code but frequently produce deployments with issues: hardcoded URLs that work on localhost but break in production, environment variables referenced but never configured, API keys committed to the repository, missing CORS headers, and routes that skip authentication. Your job is to know what production readiness looks like and direct the agent to achieve it — not hope the agent remembers on its own.",
    },

    // === VERCEL CONFIGURATION ===
    {
      type: 'info',
      title: 'Directing agent through Vercel configuration',
      body: "Vercel is the deployment target for this course. The agent needs to produce: a vercel.json (if needed), proper build command configuration, environment variable declarations, and framework-specific settings. You do not need to know every Vercel option — you need to know what questions to ask and what to verify in the output.",
    },
    {
      type: 'code-demo',
      title: 'Environment variable specification',
      body: 'Direct the agent to create a clear env specification that separates public from secret variables.',
      language: 'markdown',
      filename: 'ENV_SPEC.md',
      code: "## Environment Variables\n\n### Public (exposed to client via NEXT_PUBLIC_ prefix)\n- NEXT_PUBLIC_APP_URL — canonical URL (https://myapp.com in prod)\n- NEXT_PUBLIC_SUPABASE_URL — Supabase project URL\n- NEXT_PUBLIC_SUPABASE_ANON_KEY — Supabase anonymous/public key\n\n### Secret (server-only, never in client bundle)\n- SUPABASE_SERVICE_ROLE_KEY — admin access, server actions only\n- SESSION_SECRET — 32+ char random string for cookie signing\n- RESEND_API_KEY — email sending (Resend.com)\n\n### Per-Environment Values\n- Development: .env.local (gitignored)\n- Preview: Vercel preview environment settings\n- Production: Vercel production environment settings\n\n### CRITICAL: Never expose\n- SERVICE_ROLE_KEY in any client component\n- SESSION_SECRET in any API response\n- Raw database connection strings in error messages",
    },
    {
      type: 'terminal',
      instruction: 'Direct the agent to create a proper .env.local template with placeholder values and a .env.example that is safe to commit.',
      expectedCommand: 'claude "Create two files: (1) .env.example with all environment variables listed with placeholder values like YOUR_SUPABASE_URL_HERE — this is committed to git as documentation. (2) .env.local with the actual structure matching .env.example but blank values. Verify .env.local is in .gitignore. Variables needed: NEXT_PUBLIC_APP_URL, NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY, SESSION_SECRET."',
      hint: 'The agent should create the example file (safe to commit) and the local file (gitignored).',
    },
    {
      type: 'checkpoint',
      xp: 2,
      message: 'Environment configuration understood!',
    },

    // === SECURITY AUDIT ===
    {
      type: 'info',
      title: 'Security audit: what agents miss',
      body: "Before deploying, you audit the agent's code for three categories of security issues. First: leaked secrets — API keys, connection strings, or tokens that end up in client-side code or committed to git. Second: unprotected routes — API endpoints or server actions that skip authentication checks. Third: data exposure — returning full database records (including sensitive fields) when the client only needs a subset. Direct the agent to fix these before deploying, not after.",
    },
    {
      type: 'code-demo',
      title: 'Security audit prompts',
      body: 'These three prompts catch the most common security issues in agent-generated code.',
      language: 'text',
      filename: 'security-audit.txt',
      code: "AUDIT 1: Secret leakage\n\"Search the codebase for any hardcoded API keys, tokens, passwords,\nor connection strings. Check: (1) any string that looks like a key\ncommitted in source files, (2) any server-only env var accessed in\na file under src/app/ that is a client component ('use client'),\n(3) any .env file tracked by git. Report findings.\"\n\nAUDIT 2: Unprotected routes\n\"List every API route in src/app/api/ and every server action.\nFor each one, verify it checks authentication before proceeding.\nFlag any route that performs a mutation (POST/PUT/DELETE/server action)\nwithout validating the session. Report unprotected routes.\"\n\nAUDIT 3: Data over-exposure\n\"Check all API responses and server action returns. Flag any that\nreturn full database records without selecting specific fields.\nSpecifically look for: passwordHash, email in public-facing responses,\nfull user objects where only name+id are needed. Report findings.\"",
    },
    {
      type: 'multiple-choice',
      question: 'The agent built a Next.js app with a server action that deletes user data. The action works correctly but has no session check — any HTTP request can trigger it. What type of security issue is this?',
      options: [
        'Secret leakage',
        'Unprotected mutation route',
        'Data over-exposure',
        'CORS misconfiguration',
      ],
      correctIndex: 1,
      explanation: 'A mutation (delete) without authentication is an unprotected route. Any user — or bot — can trigger the deletion. Server actions still need auth checks even though they are not traditional API routes.',
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'Security audit skills acquired!',
    },

    // === PREVIEW DEPLOYMENT WORKFLOW ===
    {
      type: 'info',
      title: 'Preview deployment: verify before production',
      body: "Never deploy directly to production without a preview. Vercel automatically creates preview deployments for every push to a non-main branch. The workflow: push to a feature branch, get a preview URL, verify the deployment works with real environment variables (not localhost), check that server-side features function correctly, then merge to main for production. Preview deployments catch environment-specific bugs that localhost never reveals.",
    },
    {
      type: 'diagram',
      title: 'Deployment Pipeline',
      body: 'Every change flows through verification gates before reaching production.',
      diagram: {
        direction: 'LR',
        nodes: [
          { id: 'local', label: 'Local Dev', sublabel: 'localhost:3000', shape: 'pill' },
          { id: 'preview', label: 'Preview Deploy', sublabel: 'Vercel preview URL', shape: 'rounded', highlight: true },
          { id: 'verify', label: 'Verify', sublabel: 'Manual + automated', shape: 'diamond' },
          { id: 'prod', label: 'Production', sublabel: 'charlesjackson.dev', shape: 'pill', highlight: true },
          { id: 'rollback', label: 'Rollback', sublabel: 'Previous deploy', shape: 'rounded' },
        ],
        edges: [
          { from: 'local', to: 'preview', label: 'push branch' },
          { from: 'preview', to: 'verify' },
          { from: 'verify', to: 'prod', label: 'merge to main' },
          { from: 'verify', to: 'local', label: 'issues found', dashed: true },
          { from: 'prod', to: 'rollback', label: 'breaks', dashed: true },
        ],
      },
    },
    {
      type: 'terminal',
      instruction: 'Direct the agent to create a deploy branch, push it, and explain how to verify the preview deployment.',
      expectedCommand: 'claude "Create a branch called deploy/feedback-board, push it to origin, and then explain: (1) where to find the Vercel preview URL, (2) what to test on the preview that cannot be tested on localhost (env vars, server functions, edge cases with production URLs), (3) how to verify the build log has no warnings."',
      hint: 'The agent should handle the git operations and provide verification instructions for the preview.',
    },
    {
      type: 'checkpoint',
      xp: 2,
      message: 'Preview workflow locked in!',
    },

    // === DNS AND DOMAIN ===
    {
      type: 'info',
      title: 'DNS and custom domains',
      body: "If your project needs a custom domain, direct the agent to document the DNS configuration required — do not let it guess or hallucinate DNS records. The pattern: (1) add the domain in Vercel dashboard, (2) Vercel provides required DNS records (usually an A record and/or CNAME), (3) you configure these at your registrar, (4) wait for propagation (up to 48 hours, usually minutes). The agent can tell you what records are needed but cannot configure your registrar.",
    },
    {
      type: 'code-demo',
      title: 'DNS documentation the agent should produce',
      body: 'Direct the agent to document exact DNS records needed for your domain setup.',
      language: 'markdown',
      filename: 'DEPLOY.md',
      code: "## DNS Configuration\n\n### Production Domain: feedback.myapp.com\n\nAdd these records at your DNS provider:\n\n| Type  | Name     | Value              | TTL  |\n|-------|----------|--------------------|------|\n| CNAME | feedback | cname.vercel-dns.com | 3600 |\n\n### Verification\n- After adding records, verify with: `dig feedback.myapp.com CNAME`\n- Vercel dashboard shows verification status\n- SSL certificate auto-provisions once DNS propagates\n\n### Environment URL Updates\n- Update NEXT_PUBLIC_APP_URL to https://feedback.myapp.com\n- Update any OAuth callback URLs to use the new domain\n- Update CORS allowed origins if applicable",
    },

    // === ROLLBACK STRATEGY ===
    {
      type: 'info',
      title: 'Rollback strategy when things break',
      body: "Production breaks happen. Your rollback plan should be faster than your fix time. Vercel keeps every deployment immutable — you can instantly revert to any previous deployment via the dashboard or CLI. The key insight: rollback is not failure. It is a deliberate strategy that separates 'stop the bleeding' from 'fix the bug.' Roll back immediately, then debug calmly on a branch without users experiencing the broken state.",
    },
    {
      type: 'terminal',
      instruction: 'Direct the agent to document the rollback procedure using Vercel CLI commands.',
      expectedCommand: 'claude "Add a Rollback section to DEPLOY.md with these steps: (1) identify the last working deployment with vercel ls --prod, (2) promote it with vercel promote <deployment-url>, (3) verify the rollback with curl to the production URL, (4) create a fix branch from main to debug the issue. Include the actual CLI commands."',
      hint: 'The agent should provide concrete Vercel CLI commands for listing deployments and promoting a previous one.',
    },
    {
      type: 'multiple-choice',
      question: 'Your production deploy breaks at 3pm. Users are affected. What is the correct order of operations?',
      options: [
        'Debug the issue → fix it → push a new deploy → verify',
        'Roll back to previous deploy immediately → then debug on a branch → push fix when ready',
        'Take the site offline → debug → redeploy → bring back online',
        'Ask the agent to fix the production code directly via an emergency prompt',
      ],
      correctIndex: 1,
      explanation: 'Rollback first, debug second. Vercel instant rollback restores service in seconds. Debugging under pressure with users affected leads to rushed, sloppy fixes. Separate the emergency response (rollback) from the calm fix (branch + debug + test + deploy).',
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'Rollback strategy ready!',
    },

    // === PRODUCTION CHECKLIST ===
    {
      type: 'info',
      title: 'The production readiness checklist',
      body: "Before you merge to main and trigger a production deploy, verify these categories: (1) Environment — all vars set in Vercel for production, no hardcoded localhost URLs. (2) Security — no leaked secrets, all mutations authenticated, no data over-exposure. (3) Performance — no client-side fetching of large datasets, images optimized, no blocking third-party scripts. (4) Error handling — errors show user-friendly messages, not stack traces. (5) SEO/Meta — title, description, OG image configured if public-facing.",
    },
    {
      type: 'terminal',
      instruction: 'Direct the agent to run a production readiness check — scanning for hardcoded localhost references, missing error boundaries, and unoptimized images.',
      expectedCommand: 'claude "Run a production readiness check: (1) grep the codebase for localhost or 127.0.0.1 in any non-config file — report findings. (2) Check that every page or layout has an error boundary or error.tsx. (3) Verify all <img> tags use next/image or have explicit width/height. (4) Check that no console.log statements remain in production code paths. Report all findings as a checklist with pass/fail."',
      hint: 'Have the agent search for common production-readiness issues and report them as a checklist.',
    },
    {
      type: 'checklist',
      title: 'Pre-deploy verification:',
      items: [
        'All environment variables set in Vercel dashboard',
        'No hardcoded localhost URLs in source code',
        'Security audit passed (secrets, auth, data exposure)',
        'Preview deployment tested and working',
        'Error handling shows friendly messages, not stack traces',
        'Build completes without warnings',
        'Rollback procedure documented and tested',
      ],
    },

    // === SYNTHESIS ===
    {
      type: 'info',
      title: 'Deployment as a directed skill',
      body: "Deployment is not a single command — it is a multi-step verification process that you direct. The agent does the mechanical work: creating config files, writing env templates, running audits. You provide the judgment: deciding what needs a preview vs direct deploy, evaluating security findings, choosing when to roll back. After this lesson, you can take any agent-built project from localhost to a production URL with confidence that nothing critical was missed.",
    },
    {
      type: 'checkpoint',
      xp: 5,
      message: 'Deploy pipeline mastered! You can ship with confidence.',
    },
  ],
}

export default content
