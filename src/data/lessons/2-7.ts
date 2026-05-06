import type { LessonContent } from './types'

const content: LessonContent = {
  lessonId: '2-7',
  steps: [
    // === INTRODUCTION ===
    {
      type: 'info',
      title: 'When AI builds something different from what you wanted',
      body: "You gave a clear spec. The agent built something. It looks like code. It even runs. But it is not what you asked for. Maybe the data model is wrong, the flow is backwards, or it solved a different problem entirely. This happens to everyone. The agent is not broken — it interpreted your words differently than you intended. The skill is not preventing this (you cannot fully), but recovering efficiently when it happens.",
    },
    {
      type: 'info',
      title: 'Divergence vs. bugs',
      body: "A bug is when the agent built the right thing but made a mistake (null reference, off-by-one, missing await). Divergence is when the agent built the wrong thing correctly. The API works perfectly — but it is a REST API when you wanted GraphQL. The auth flow is clean — but it uses sessions when you specified JWTs. Bugs are fixed with \"fix this error.\" Divergence requires a different approach because the agent thinks it succeeded.",
    },

    // === IDENTIFYING DIVERGENCE ===
    {
      type: 'info',
      title: 'Step 1: Diff the output against your spec',
      body: "Before reacting emotionally (\"this is all wrong!\"), be precise. Open your spec. Open the code. Walk through each acceptance criterion. Which ones are met? Which are not? Where specifically did the agent deviate? \"The agent built the wrong thing\" is not actionable. \"The agent used client-side routing for the checkout flow instead of server-side redirects as specified in criterion 3\" is actionable.",
    },
    {
      type: 'diagram',
      title: 'Recovery Decision Tree',
      body: 'Use this flow to decide the right recovery action based on how far the agent diverged.',
      diagram: {
        direction: 'TB',
        nodes: [
          { id: 'detect', label: 'Detect Divergence', sublabel: 'Output != spec', shape: 'rounded', highlight: true },
          { id: 'assess', label: 'Assess Scope', sublabel: 'How much is wrong?', shape: 'diamond' },
          { id: 'minor', label: 'Minor Divergence', sublabel: '1-2 criteria off', shape: 'rect' },
          { id: 'major', label: 'Major Divergence', sublabel: 'Architecture wrong', shape: 'rect' },
          { id: 'redirect', label: 'Targeted Redirect', sublabel: 'Fix specific files', shape: 'rounded' },
          { id: 'restart', label: 'Fresh Session', sublabel: 'Better spec', shape: 'rounded' },
          { id: 'rollback', label: 'Git Rollback', sublabel: 'Reset to good state', shape: 'pill' },
        ],
        edges: [
          { from: 'detect', to: 'assess' },
          { from: 'assess', to: 'minor', label: 'few issues' },
          { from: 'assess', to: 'major', label: 'fundamental' },
          { from: 'minor', to: 'redirect' },
          { from: 'major', to: 'rollback' },
          { from: 'rollback', to: 'restart' },
        ],
      },
    },
    {
      type: 'multiple-choice',
      question: 'The agent built a working REST API with 6 endpoints, but your spec asked for GraphQL with a single /graphql endpoint. What is this?',
      options: [
        'A bug — the agent made a mistake in the implementation',
        'Minor divergence — just change the routing layer',
        'Major divergence — the entire architecture is different',
        'Not a problem — REST and GraphQL serve the same purpose',
      ],
      correctIndex: 2,
      explanation: 'REST vs GraphQL is an architectural divergence, not a surface-level fix. The resolver structure, type system, data fetching patterns, and client code are fundamentally different. This requires a rollback and fresh start with a clearer spec, not a quick fix.',
    },
    {
      type: 'checkpoint',
      xp: 4,
      message: 'Divergence identification mastered!',
    },

    // === TARGETED CORRECTIONS ===
    {
      type: 'info',
      title: 'Targeted corrections: the precision tool',
      body: "For minor divergence, you do not need to rewrite or restart. You need a precise correction prompt that tells the agent exactly what is wrong, exactly where, and exactly what to do instead. \"Try again\" wastes context. \"The checkout function in src/lib/checkout.ts should redirect server-side using redirect() from next/navigation, not return a URL for the client to navigate to. Keep everything else the same.\" That is actionable.",
    },
    {
      type: 'code-demo',
      title: 'Bad correction vs. good correction',
      body: 'Vague corrections cause the agent to make more changes than needed, potentially introducing new divergence.',
      language: 'text',
      filename: 'correction-examples.txt',
      code: "# BAD: Vague correction\n\"The checkout flow is wrong. Fix it.\"\n# Agent response: rewrites 5 files, changes things that were correct\n\n# BAD: Emotional correction\n\"This isn't what I asked for at all. I said server-side!\"\n# Agent response: apologizes, rewrites broadly, may break working code\n\n# GOOD: Targeted correction\n\"In src/lib/checkout.ts, the createCheckout function currently\nreturns a URL string. Change it to use redirect() from\nnext/navigation to perform a server-side redirect to the\nStripe checkout URL. The function signature should become\nasync with no return value. Only modify this file.\"\n# Agent response: changes exactly what you specified",
    },
    {
      type: 'info',
      title: 'The \"only modify\" constraint',
      body: "When giving corrections, add \"Only modify [specific files]\" or \"Do not change [specific files].\" Without this constraint, the agent may propagate changes through the codebase — updating imports, refactoring callers, changing tests — creating a cascade of modifications you did not review. Scope your corrections as tightly as possible.",
    },
    {
      type: 'code-input',
      instruction: 'Write a targeted correction for this problem: the agent created user authentication using localStorage, but your spec says to use HTTP-only cookies. Target the file src/lib/auth.ts.',
      placeholder: 'In src/lib/auth.ts, change...',
      answer: 'In src/lib/auth.ts, change the token storage from localStorage to HTTP-only cookies. Use cookies() from next/headers to set and read the session token. Remove all localStorage references. Only modify this file.',
      hint: 'Be specific about the file, what to change, what to use instead, and scope the change',
    },
    {
      type: 'checkpoint',
      xp: 4,
      message: 'Targeted corrections mastered!',
    },

    // === WHEN TO RESTART ===
    {
      type: 'info',
      title: 'When corrections are not enough',
      body: "Sometimes the divergence is architectural. The agent chose a fundamentally different approach — wrong data model, wrong rendering strategy, wrong state management pattern. Correcting one file would create inconsistencies with everything else it built. Trying to patch an architectural mistake file-by-file takes longer than starting fresh. The signal: if fixing the divergence requires changing more than 3-4 files, it is probably cheaper to restart.",
    },
    {
      type: 'info',
      title: 'The restart protocol',
      body: "Restarting does not mean losing everything. First: git stash or branch the current work (you might want to reference it). Second: identify why the agent diverged — was the spec ambiguous? Did it lack a critical constraint? Third: rewrite the spec to eliminate the ambiguity. Fourth: start a fresh session with the improved spec. The mistake becomes documentation — it shows you where your spec was unclear.",
    },
    {
      type: 'terminal',
      instruction: 'Before restarting, save the divergent work on a branch so you can reference it later if needed.',
      expectedCommand: 'git checkout -b divergent-attempt-1 && git add -A && git commit -m "save: divergent implementation for reference"',
      hint: 'Create a branch, stage all files, and commit the current state',
    },
    {
      type: 'code-demo',
      title: 'Improving the spec after divergence',
      body: 'The divergence tells you what was ambiguous. Add explicit constraints that prevent the same misinterpretation.',
      language: 'markdown',
      filename: 'specs/checkout-v2.md',
      code: "# Checkout Flow — Revised Spec\n\n## What went wrong last time\nAgent built client-side navigation to Stripe. I need server-side redirect.\n\n## Constraints (ADDED after first attempt)\n- Server-side redirect via next/navigation redirect() — NOT client navigation\n- No checkout URLs returned to the client — redirect happens in server action\n- Success page must work WITHOUT JavaScript (SSR only)\n\n## Architecture Decision: Server Actions\nThe checkout flow uses Next.js Server Actions exclusively.\nNo API routes, no client-side fetch calls for the payment flow.\nThe user clicks a button → server action runs → server redirects to Stripe.\n\n## What I want to KEEP from the first attempt\n- The Stripe SDK setup in src/lib/stripe.ts (correct)\n- The product schema in src/db/schema.ts (correct)\n- The webhook handler structure (correct)",
    },
    {
      type: 'multiple-choice',
      question: 'The agent built authentication with bcrypt password hashing, but you wanted OAuth only (no passwords). The auth touches 8 files. What should you do?',
      options: [
        'Give targeted corrections to each of the 8 files one at a time',
        'Tell the agent to "switch from passwords to OAuth"',
        'Save the work on a branch, improve the spec, restart fresh',
        'Delete the auth files and ask the agent to rebuild just that part',
      ],
      correctIndex: 2,
      explanation: 'Password auth vs OAuth is architectural — different database schema (no password column), different UI (no signup form), different session handling, different middleware. Patching 8 files creates inconsistencies. Save the work for reference, clarify the spec, and let the agent build OAuth from scratch in a fresh session.',
    },
    {
      type: 'checkpoint',
      xp: 4,
      message: 'Restart protocol learned!',
    },

    // === RECOVERY WORKFLOW ===
    {
      type: 'info',
      title: 'The full recovery workflow',
      body: "Detect → Assess → Decide → Act. Detect: notice the output does not match intent. Assess: how many criteria are off? Is it surface (rename, restructure) or architectural (wrong approach)? Decide: if surface, targeted correction. If architectural, restart. Act: execute the correction or restart. Then verify the fix did not introduce new divergence. This workflow should take minutes, not hours. Speed comes from precision in the assess step.",
    },
    {
      type: 'terminal',
      instruction: 'Use git diff to precisely identify what the agent changed, so you can assess the divergence scope.',
      expectedCommand: 'git diff --stat',
      hint: 'git diff --stat shows a summary of all changed files and line counts',
    },
    {
      type: 'code-demo',
      title: 'Recovery prompt template',
      body: 'When redirecting mid-session, structure your correction as: what is wrong, where it is wrong, what to do instead.',
      language: 'text',
      filename: 'recovery-template.txt',
      code: "I need to correct the implementation in [specific area].\n\n## What is wrong\n[Describe the divergence from spec precisely]\n\n## Where it is wrong\n[List specific files and functions]\n\n## What to do instead\n[Describe the correct approach]\n\n## Do not change\n[List files/areas that are correct and should stay untouched]\n\n## After the fix, verify\n[How to confirm the correction worked]",
    },
    {
      type: 'order',
      instruction: 'Order the recovery workflow steps:',
      items: [
        'Verify the fix did not introduce new divergence',
        'Detect that output diverges from spec intent',
        'Decide: targeted correction or fresh restart',
        'Execute the correction or restart with improved spec',
        'Assess scope: surface issue or architectural mismatch',
      ],
      correctOrder: [1, 4, 2, 3, 0],
    },

    // === PREVENTION ===
    {
      type: 'info',
      title: 'Reducing divergence in future sessions',
      body: "Every divergence teaches you something about your spec. Keep a mental (or written) log: \"Agent used REST instead of GraphQL\" means your spec needed to say API style explicitly. \"Agent used client-side storage\" means your spec needed a data persistence constraint. Over time, you build a library of constraints you always include. The best specs come from people who have recovered from divergence many times.",
    },
    {
      type: 'checklist',
      title: 'Recovery workflow habits:',
      items: [
        'I diff agent output against my spec before reacting',
        'I assess whether divergence is surface-level or architectural',
        'My corrections are targeted: specific file, specific change, specific approach',
        'I use "only modify" constraints to prevent correction cascade',
        'I save divergent work on a branch before restarting',
        'I improve my spec after each divergence to prevent recurrence',
        'I verify corrections did not introduce new problems',
      ],
    },
    {
      type: 'checkpoint',
      xp: 13,
      message: 'Recovery skills learned! You know how to get AI back on track when it goes in the wrong direction.',
    },
  ],
}

export default content
