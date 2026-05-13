import type { LessonContent } from './types'

const content: LessonContent = {
  lessonId: '2-11',
  steps: [
    // === INTRODUCTION ===
    {
      type: 'info',
      title: 'Getting your product live on the internet',
      body: "A product that runs on localhost is a prototype. A product that runs in production is a product. The gap between these two is where most agent-directed projects die — not because the code is wrong, but because deployment configuration, environment variables, DNS, and security concerns get hand-waved. In this lesson you will direct an agent through the full deployment pipeline: configure, audit, preview, and ship. This is the last skill before you prove the whole loop in the capstone.",
    },
    {
      type: 'info',
      title: 'The production readiness gap',
      body: "Agents are excellent at writing application code but frequently produce deployments with issues: hardcoded URLs that work on localhost but break in production, environment variables referenced but never configured, API keys committed to the repository, missing CORS headers, and routes that skip authentication. Your job is to know what production readiness looks like and direct the agent to achieve it — not hope the agent remembers on its own.",
    },
    {
      type: 'compare',
      title: 'Environment variables: wrong vs right',
      body: 'How you handle environment variables determines whether your app works in production and whether secrets leak.',
      question: 'Which approach is safe for production?',
      correctSide: 'right',
      left: {
        label: 'Wrong',
        content: '// Hardcoded in code — exposed in bundle!\nconst API_URL = "https://api.example.com"\n\n// Service key in client — admin access!\nconst supabase = createClient(\n  "https://abc.supabase.co",\n  "eyJhbG...service_role_key"\n)',
        language: 'typescript',
      },
      right: {
        label: 'Right',
        content: '// Public vars use NEXT_PUBLIC_ prefix\nconst API_URL = process.env.NEXT_PUBLIC_API_URL\n\n// Secret keys stay server-side only\nconst supabase = createClient(\n  process.env.NEXT_PUBLIC_SUPABASE_URL!,\n  process.env.SUPABASE_SERVICE_ROLE_KEY!\n)',
        language: 'typescript',
      },
      explanation: 'NEXT_PUBLIC_ vars are safe to expose in the browser. Vars without that prefix stay on the server. Never hardcode URLs or keys — they change per environment and leak in git history.',
    },

    // === VERCEL CONFIGURATION ===
    {
      type: 'multiple-choice',
      question: 'What does the agent need to produce for a proper Vercel deployment configuration?',
      options: [
        'Only a vercel.json file',
        'A vercel.json (if needed), build command config, environment variable declarations, and framework-specific settings',
        'Only environment variables',
        'A Dockerfile and docker-compose.yml',
      ],
      correctIndex: 1,
      explanation: "Vercel is the deployment target for this course. The agent needs to produce: a vercel.json (if needed), proper build command configuration, environment variable declarations, and framework-specific settings. You do not need to know every Vercel option — you need to know what questions to ask and what to verify in the output.",
    },
    {
      type: 'match',
      instruction: 'Match each environment variable to its correct classification:',
      leftItems: ['NEXT_PUBLIC_APP_URL', 'SUPABASE_SERVICE_ROLE_KEY', 'NEXT_PUBLIC_SUPABASE_ANON_KEY', 'SESSION_SECRET'],
      rightItems: ['Secret: server-only, 32+ char for cookie signing', 'Public: safe for browser, canonical URL', 'Secret: server-only, admin database access', 'Public: safe for browser, anonymous/public key'],
      correctPairs: { 0: 1, 1: 2, 2: 3, 3: 0 },
      explanation: 'Variables with the NEXT_PUBLIC_ prefix are exposed to the browser and safe for client-side code. Variables without this prefix are server-only secrets that must never appear in client components. Getting this wrong leads to either broken features (missing public vars) or security breaches (exposed secrets).',
    },
    {
      type: 'terminal',
      instruction: 'Direct the agent to create a proper .env.local template with placeholder values and a .env.example that is safe to commit.',
      expectedCommand: 'claude "Create two files: (1) .env.example with all environment variables listed with placeholder values like YOUR_SUPABASE_URL_HERE — this is committed to git as documentation. (2) .env.local with the actual structure matching .env.example but blank values. Verify .env.local is in .gitignore. Variables needed: NEXT_PUBLIC_APP_URL, NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY, SESSION_SECRET."',
      hint: 'The agent should create the example file (safe to commit) and the local file (gitignored).',
    },
    {
      type: 'code-fill',
      instruction: 'Complete the .env.example file. Public vars use NEXT_PUBLIC_ prefix, secrets do not.',
      language: 'shell',
      filename: '.env.example',
      template: '# Public (safe for browser)\n{{public_url}}=https://your-app.vercel.app\n{{public_supabase}}=https://abc.supabase.co\nNEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...\n\n# Secret (server only — NEVER prefix with NEXT_PUBLIC_)\n{{secret_service}}=eyJ...\n{{secret_webhook}}=whsec_...',
      blanks: [
        { id: 'public_url', answer: 'NEXT_PUBLIC_APP_URL', alternatives: ['NEXT_PUBLIC_URL', 'NEXT_PUBLIC_SITE_URL'], placeholder: 'public URL var?', hint: 'Starts with NEXT_PUBLIC_' },
        { id: 'public_supabase', answer: 'NEXT_PUBLIC_SUPABASE_URL', placeholder: 'public Supabase var?', hint: 'Starts with NEXT_PUBLIC_' },
        { id: 'secret_service', answer: 'SUPABASE_SERVICE_ROLE_KEY', alternatives: ['SUPABASE_SERVICE_KEY'], placeholder: 'secret Supabase var?', hint: 'No NEXT_PUBLIC_ prefix — server only' },
        { id: 'secret_webhook', answer: 'STRIPE_WEBHOOK_SECRET', alternatives: ['STRIPE_WEBHOOK_SIGNING_SECRET'], placeholder: 'secret Stripe var?', hint: 'Stripe webhook signing secret' },
      ],
      explanation: 'The .env.example documents all required variables without actual values. Public vars get NEXT_PUBLIC_ prefix. Secrets never do — they are invisible to client-side code.',
    },
    {
      type: 'checkpoint',
      xp: 2,
      message: 'Environment configuration understood!',
    },

    // === SECURITY AUDIT ===
    {
      type: 'order',
      instruction: 'Order these three security audit categories from highest risk to lowest:',
      items: [
        'Data over-exposure: returning full DB records with sensitive fields',
        'Leaked secrets: API keys, tokens, or connection strings in client code or git',
        'Unprotected routes: mutations without authentication checks',
      ],
      correctOrder: [1, 2, 0],
    },
    {
      type: 'code-fill',
      instruction: 'Complete these security audit prompts to direct the agent before deploying:',
      language: 'text',
      filename: 'security-audit.txt',
      template: 'AUDIT 1: Secret leakage\n"Search the codebase for any hardcoded {{secret_types}}.\nCheck any server-only env var accessed in a {{client_marker}} component."\n\nAUDIT 2: Unprotected routes\n"List every API route and server action. Flag any that performs a\n{{mutation_types}} without validating the {{auth_check}}."\n\nAUDIT 3: Data over-exposure\n"Flag any API response that returns full database records without\nselecting specific fields. Look for: {{sensitive_fields}}."',
      blanks: [
        { id: 'secret_types', answer: 'API keys, tokens, passwords, or connection strings', alternatives: ['API keys, tokens, or passwords', 'hardcoded secrets'], placeholder: 'what to search for?', hint: 'Types of secrets that should never be in code' },
        { id: 'client_marker', answer: "'use client'", alternatives: ['use client', '"use client"'], placeholder: 'client component marker?', hint: 'The React directive that marks client components' },
        { id: 'mutation_types', answer: 'POST/PUT/DELETE/server action', alternatives: ['mutation (POST, PUT, DELETE)', 'write operation'], placeholder: 'mutation types?', hint: 'HTTP methods that change data' },
        { id: 'auth_check', answer: 'session', alternatives: ['session', 'authentication', 'auth'], placeholder: 'what to validate?', hint: 'What proves a user is who they claim to be?' },
        { id: 'sensitive_fields', answer: 'passwordHash, email in public-facing responses', alternatives: ['passwordHash, email, internal IDs'], placeholder: 'sensitive fields?', hint: 'Fields that should never be in public API responses' },
      ],
      explanation: "These three audit prompts catch the most common security issues in agent-generated code. Direct the agent to fix these BEFORE deploying, not after. Leaked secrets are catastrophic, unprotected routes are exploitable, and data exposure violates user trust.",
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
      type: 'multiple-choice',
      question: 'Why should you never deploy directly to production without a preview deployment first?',
      options: [
        'Preview deployments are faster to build',
        'Vercel requires preview deployments before production',
        'Preview deployments catch environment-specific bugs (env vars, server functions, DNS) that localhost never reveals',
        'Preview deployments are cheaper to run',
      ],
      correctIndex: 2,
      explanation: "Vercel automatically creates preview deployments for every push to a non-main branch. The workflow: push to a feature branch, get a preview URL, verify the deployment works with real environment variables (not localhost), check that server-side features function correctly, then merge to main for production. Preview deployments catch environment-specific bugs that localhost never reveals.",
    },
    {
      type: 'interactive-diagram',
      title: 'Deployment Pipeline',
      body: 'Every change flows through verification gates before reaching production. Click through each stage.',
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
      stages: [
        {
          highlightNodes: ['local'],
          highlightEdges: [{ from: 'local', to: 'preview' }],
          explanation: 'Development starts locally. You build features on localhost, run tests, and verify the app works in your dev environment before pushing anything.',
        },
        {
          highlightNodes: ['preview'],
          highlightEdges: [{ from: 'preview', to: 'verify' }],
          explanation: 'Push to a feature branch triggers a Vercel preview deployment. This is the first time your code runs with real environment variables, real DNS, and real server functions.',
        },
        {
          highlightNodes: ['verify'],
          highlightEdges: [{ from: 'verify', to: 'prod' }, { from: 'verify', to: 'local' }],
          explanation: 'Verify the preview deployment: check env vars work, server functions respond, auth flows complete, and the UI renders correctly. If issues are found, fix locally and push again.',
        },
        {
          highlightNodes: ['prod'],
          highlightEdges: [{ from: 'prod', to: 'rollback' }],
          explanation: 'Merge to main triggers a production deployment. Your app is live. If something breaks, do not panic — use the rollback path.',
        },
        {
          highlightNodes: ['rollback'],
          highlightEdges: [{ from: 'prod', to: 'rollback' }],
          explanation: 'Rollback instantly promotes the previous working deployment. This restores service in seconds. Then debug calmly on a branch without users experiencing the broken state.',
        },
      ],
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
      type: 'order',
      instruction: 'Order the steps for setting up a custom domain on Vercel:',
      items: [
        'Wait for DNS propagation (up to 48 hours, usually minutes)',
        'Add the domain in Vercel dashboard',
        'Configure DNS records at your registrar (A record and/or CNAME)',
        'Verify SSL certificate auto-provisioned correctly',
        'Update NEXT_PUBLIC_APP_URL and OAuth callback URLs',
      ],
      correctOrder: [1, 2, 0, 3, 4],
    },
    {
      type: 'code-fill',
      instruction: 'Complete this DNS documentation that the agent should produce for your domain setup:',
      language: 'markdown',
      filename: 'DEPLOY.md',
      template: '## DNS Configuration\n\n### Production Domain: feedback.myapp.com\n\nAdd this record at your DNS provider:\n\n| Type | Name | Value | TTL |\n|------|------|-------|-----|\n| {{record_type}} | feedback | {{record_value}} | 3600 |\n\n### Verification\n- After adding records, verify with: `{{verify_cmd}}`\n- SSL certificate auto-provisions once DNS propagates',
      blanks: [
        { id: 'record_type', answer: 'CNAME', alternatives: ['cname'], placeholder: 'DNS record type?', hint: 'Points a subdomain to another hostname' },
        { id: 'record_value', answer: 'cname.vercel-dns.com', alternatives: ['cname.vercel-dns.com.'], placeholder: 'Vercel DNS value?', hint: 'Vercel provides this CNAME target' },
        { id: 'verify_cmd', answer: 'dig feedback.myapp.com CNAME', alternatives: ['nslookup feedback.myapp.com', 'dig +short feedback.myapp.com CNAME'], placeholder: 'verify command?', hint: 'DNS lookup command to check the CNAME record' },
      ],
      explanation: 'Direct the agent to document exact DNS records needed. Do not let it guess or hallucinate DNS records. The agent can tell you what records are needed but cannot configure your registrar.',
    },

    // === ROLLBACK STRATEGY ===
    {
      type: 'compare',
      title: 'Rollback strategy when things break',
      body: 'Production breaks happen. Your rollback plan should be faster than your fix time.',
      question: 'Which approach restores service fastest when production breaks?',
      correctSide: 'right',
      left: {
        label: 'Debug-first',
        content: '1. Investigate the bug\n2. Write a fix\n3. Push the fix\n4. Wait for build + deploy\n5. Verify the fix works\n\nTime to restore: 30-60 minutes\nUsers affected the entire time',
        language: 'text',
      },
      right: {
        label: 'Rollback-first',
        content: '1. Roll back to last working deploy\n   (instant via Vercel dashboard/CLI)\n2. Service restored in seconds\n3. Debug calmly on a branch\n4. Push fix when ready and tested\n\nTime to restore: seconds\nUsers unaffected during debug',
        language: 'text',
      },
      explanation: "Rollback is not failure. It is a deliberate strategy that separates 'stop the bleeding' from 'fix the bug.' Vercel keeps every deployment immutable — you can instantly revert to any previous deployment.",
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
      type: 'match',
      instruction: 'Match each production readiness category to what you need to verify:',
      leftItems: ['Environment', 'Security', 'Performance', 'Error handling'],
      rightItems: ['Errors show user-friendly messages, not stack traces', 'All vars set in Vercel, no hardcoded localhost URLs', 'No leaked secrets, all mutations authenticated', 'No client-side fetching of large datasets, images optimized'],
      correctPairs: { 0: 1, 1: 2, 2: 3, 3: 0 },
      explanation: "Before merging to main, verify: (1) Environment - all vars set, no localhost URLs. (2) Security - no leaked secrets, all mutations authenticated. (3) Performance - no large client-side fetches, images optimized. (4) Error handling - user-friendly messages, not stack traces. (5) SEO/Meta - title, description, OG image if public-facing.",
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
      type: 'multiple-choice',
      question: 'In the deploy workflow, what is the agent\'s role vs your role?',
      options: [
        'The agent handles everything including judgment calls',
        'You do everything manually, the agent just watches',
        'Agent does mechanical work (config, templates, audits). You provide judgment (preview vs deploy, evaluating security, when to roll back)',
        'The agent deploys, you just approve or reject',
      ],
      correctIndex: 2,
      explanation: "Deployment is not a single command — it is a multi-step verification process that you direct. The agent does the mechanical work: creating config files, writing env templates, running audits. You provide the judgment: deciding what needs a preview vs direct deploy, evaluating security findings, choosing when to roll back.",
    },
    {
      type: 'checkpoint',
      xp: 5,
      message: 'Deploy skills mastered! You can put any AI-built project live on the internet.',
    },
  ],
}

export default content
