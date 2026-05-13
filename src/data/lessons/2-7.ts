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
      type: 'multiple-choice',
      question: 'The agent built something that does not match your spec. What is the FIRST thing you should do?',
      options: [
        'Tell the agent "this is all wrong, start over"',
        'Walk through each acceptance criterion and identify specifically where the agent deviated',
        'Delete all the generated code and write it yourself',
        'Accept the output as-is and work around the differences',
      ],
      correctIndex: 1,
      explanation: 'Before reacting, be precise. Walk through each acceptance criterion. Which are met? Which are not? Where specifically did the agent deviate? "The agent built the wrong thing" is not actionable. "The agent used client-side routing instead of server-side redirects as specified in criterion 3" is actionable.',
    },
    {
      type: 'interactive-diagram',
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
      stages: [
        {
          highlightNodes: ['detect'],
          highlightEdges: [],
          explanation: 'You notice the output does not match your spec. Do not react emotionally — move to assessment.',
        },
        {
          highlightNodes: ['assess'],
          highlightEdges: [{ from: 'detect', to: 'assess' }],
          explanation: 'Count how many acceptance criteria are wrong. Is it 1-2 specific issues, or is the entire approach different?',
        },
        {
          highlightNodes: ['minor', 'redirect'],
          highlightEdges: [{ from: 'assess', to: 'minor' }, { from: 'minor', to: 'redirect' }],
          explanation: 'Minor divergence (1-2 criteria off): give a targeted correction — specific file, specific change, specific approach. Add "only modify this file" to prevent cascade.',
        },
        {
          highlightNodes: ['major', 'rollback'],
          highlightEdges: [{ from: 'assess', to: 'major' }, { from: 'major', to: 'rollback' }],
          explanation: 'Major divergence (wrong architecture): the entire approach is different. Save the work on a branch with git, then roll back to a known good state.',
        },
        {
          highlightNodes: ['rollback', 'restart'],
          highlightEdges: [{ from: 'rollback', to: 'restart' }],
          explanation: 'After rollback, improve your spec to prevent the same misinterpretation. Start a fresh session with the clarified spec. The mistake becomes documentation.',
        },
      ],
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
      type: 'multiple-choice',
      question: 'The agent used client-side navigation instead of server-side redirects. Which correction prompt is best?',
      options: [
        '"The checkout flow is wrong. Fix it."',
        '"This isn\'t what I asked for at all!"',
        '"In src/lib/checkout.ts, change createCheckout to use redirect() from next/navigation instead of returning a URL. Only modify this file."',
        '"Try again and this time do it right."',
      ],
      correctIndex: 2,
      explanation: 'Targeted corrections tell the agent exactly what is wrong, exactly where, and exactly what to do instead. Vague corrections ("fix it") cause the agent to rewrite more than needed, potentially introducing new divergence. The key is specificity: file, function, current behavior, desired behavior, and scope constraint.',
    },
    {
      type: 'compare',
      title: 'Vague correction vs targeted correction',
      body: 'The precision of your correction determines whether the agent fixes the problem or creates new ones.',
      question: 'Which correction prompt will produce the best result?',
      correctSide: 'right',
      left: {
        label: 'Vague (causes cascade)',
        content: '"The checkout flow is wrong. Fix it."\n\nAgent response:\n- Rewrites 5 files\n- Changes things that were correct\n- Introduces new divergence\n- Breaks working import paths\n- You now have MORE to fix',
        language: 'text',
      },
      right: {
        label: 'Targeted (surgical fix)',
        content: '"In src/lib/checkout.ts, the createCheckout\nfunction currently returns a URL string.\nChange it to use redirect() from\nnext/navigation to perform a server-side\nredirect. Only modify this file."\n\nAgent response:\n- Changes exactly one file\n- Preserves everything else\n- One clean diff to review',
        language: 'text',
      },
      explanation: 'Targeted corrections name: (1) the specific file, (2) the specific function, (3) what it currently does wrong, (4) what it should do instead, and (5) the scope constraint ("only modify this file"). This prevents the agent from propagating unnecessary changes.',
    },
    {
      type: 'multiple-choice',
      question: 'Why should you add "Only modify this file" to correction prompts?',
      options: [
        'It makes the agent work faster',
        'Without scope constraints, the agent may propagate changes through the codebase — updating imports, refactoring callers, changing tests — creating unreviewed cascading modifications',
        'The agent will refuse to work without explicit file permissions',
        'It is required by the Claude Code API',
      ],
      correctIndex: 1,
      explanation: 'Without the "only modify" constraint, the agent may propagate changes through the codebase — updating imports, refactoring callers, changing tests. This creates a cascade of modifications you did not review, potentially introducing new divergence. Always scope corrections as tightly as possible.',
    },
    {
      type: 'code-diff',
      title: 'Before and after a targeted redirect',
      body: 'The agent originally used client-side filtering. After a targeted redirect ("use SQL WHERE clause for server-side filtering"), it fixed the approach.',
      language: 'typescript',
      filename: 'src/hooks/useBookmarks.ts',
      before: 'export function useBookmarks(searchTerm: string) {\n  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])\n\n  useEffect(() => {\n    supabase.from("bookmarks").select("*").then(({ data }) => {\n      const filtered = data?.filter(b =>\n        b.title.toLowerCase().includes(searchTerm.toLowerCase())\n      ) || []\n      setBookmarks(filtered)\n    })\n  }, [searchTerm])\n\n  return bookmarks\n}',
      after: 'export function useBookmarks(searchTerm: string) {\n  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])\n\n  useEffect(() => {\n    const query = supabase.from("bookmarks").select("*")\n    if (searchTerm) {\n      query.ilike("title", `%${searchTerm}%`)\n    }\n    query.then(({ data }) => {\n      setBookmarks(data || [])\n    })\n  }, [searchTerm])\n\n  return bookmarks\n}',
      explanation: 'Server-side filtering with SQL is more efficient — it avoids downloading all records to the client. A targeted redirect (specifying "use SQL WHERE") gives the agent a clear fix without rewriting the whole spec.',
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
      type: 'multiple-choice',
      question: 'The agent used the wrong state management pattern and it touches 6 files. What is the most efficient recovery?',
      options: [
        'Give targeted corrections to each of the 6 files one at a time',
        'Tell the agent to refactor all 6 files at once',
        'Save the work on a branch, identify why the spec was ambiguous, improve it, and start a fresh session',
        'Accept the wrong pattern and work around it',
      ],
      correctIndex: 2,
      explanation: 'If fixing divergence requires changing more than 3-4 files, restarting is cheaper. The restart protocol: (1) save work on a branch, (2) identify why the agent diverged (spec ambiguity?), (3) rewrite the spec to eliminate ambiguity, (4) start fresh. The mistake becomes documentation showing where your spec was unclear.',
    },
    {
      type: 'multiple-choice',
      question: 'After saving divergent work on a branch, what should you do BEFORE starting a fresh session?',
      options: [
        'Delete the branch to avoid confusion',
        'Copy-paste the good parts into the new session',
        'Identify why the agent diverged and rewrite the spec to eliminate the ambiguity that caused it',
        'Ask a different AI model to review the divergent code',
      ],
      correctIndex: 2,
      explanation: 'The key step between saving and restarting is improving your spec. The divergence tells you exactly what was ambiguous. Add explicit constraints that prevent the same misinterpretation. The mistake becomes documentation — it shows you where your spec was unclear.',
    },
    {
      type: 'terminal',
      instruction: 'Before restarting, save the divergent work on a branch so you can reference it later if needed.',
      expectedCommand: 'git checkout -b divergent-attempt-1 && git add -A && git commit -m "save: divergent implementation for reference"',
      hint: 'Create a branch, stage all files, and commit the current state',
    },
    {
      type: 'code-fill',
      instruction: 'Complete this revised spec that prevents the same divergence from happening again:',
      language: 'markdown',
      filename: 'specs/checkout-v2.md',
      template: '# Checkout Flow — Revised Spec\n\n## What went wrong last time\nAgent built {{wrong_approach}} to Stripe. I need server-side redirect.\n\n## Constraints (ADDED after first attempt)\n- Server-side redirect via next/navigation {{redirect_fn}}() — NOT client navigation\n- No checkout URLs returned to the client — redirect happens in {{action_type}}\n- Success page must work WITHOUT {{no_js}} (SSR only)\n\n## What I want to KEEP from the first attempt\n- The Stripe SDK setup in src/lib/stripe.ts (correct)\n- The product schema in src/db/schema.ts (correct)',
      blanks: [
        { id: 'wrong_approach', answer: 'client-side navigation', alternatives: ['client side navigation', 'client navigation'], placeholder: 'what went wrong?', hint: 'The agent navigated on the client instead of the server' },
        { id: 'redirect_fn', answer: 'redirect', alternatives: ['Redirect'], placeholder: 'which function?', hint: 'The Next.js function for server-side redirects' },
        { id: 'action_type', answer: 'server action', alternatives: ['Server Action', 'server actions', 'Server Actions'], placeholder: 'where does redirect happen?', hint: 'Next.js pattern for server-side mutations' },
        { id: 'no_js', answer: 'JavaScript', alternatives: ['javascript', 'JS', 'js'], placeholder: 'without what?', hint: 'SSR means the page works even if this is disabled' },
      ],
      explanation: 'The revised spec documents what went wrong, adds explicit constraints that prevent recurrence, and lists what to keep from the first attempt. This turns every divergence into a better spec for the next session.',
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
      type: 'multiple-choice',
      question: 'What determines whether recovery takes minutes or hours?',
      options: [
        'The size of the codebase',
        'How quickly you can type correction prompts',
        'Precision in the assess step — correctly identifying whether divergence is surface-level or architectural',
        'Whether you use git or not',
      ],
      correctIndex: 2,
      explanation: 'The full workflow is: Detect, Assess, Decide, Act. Speed comes from precision in the Assess step. Correctly identifying surface-level vs architectural divergence means you choose the right recovery action (targeted correction vs restart) the first time. Misjudging scope wastes time on corrections that cascade into more problems.',
    },
    {
      type: 'terminal',
      instruction: 'Use git diff to precisely identify what the agent changed, so you can assess the divergence scope.',
      expectedCommand: 'git diff --stat',
      hint: 'git diff --stat shows a summary of all changed files and line counts',
    },
    {
      type: 'code-fill',
      instruction: 'Complete this recovery prompt template with the right sections:',
      language: 'text',
      filename: 'recovery-template.txt',
      template: "I need to correct the implementation in [specific area].\n\n## What is {{section_1}}\n[Describe the divergence from spec precisely]\n\n## Where it is wrong\n[List specific {{location_type}} and functions]\n\n## What to do {{section_3}}\n[Describe the correct approach]\n\n## Do not {{constraint}}\n[List files/areas that are correct and should stay untouched]",
      blanks: [
        { id: 'section_1', answer: 'wrong', alternatives: ['Wrong', 'incorrect'], placeholder: 'what section?', hint: 'Describe the problem' },
        { id: 'location_type', answer: 'files', alternatives: ['Files', 'file paths'], placeholder: 'list what?', hint: 'The exact locations in the codebase' },
        { id: 'section_3', answer: 'instead', alternatives: ['Instead', 'differently'], placeholder: 'what section?', hint: 'The alternative approach' },
        { id: 'constraint', answer: 'change', alternatives: ['Change', 'modify', 'touch'], placeholder: 'constraint?', hint: 'Protect working code from unnecessary modifications' },
      ],
      explanation: 'A recovery prompt has 4 parts: what is wrong (precise divergence), where (specific files), what to do instead (correct approach), and what NOT to change (scope constraint). This structure gives the agent maximum clarity with minimum risk of cascade.',
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

    // === PROMPT LAB: REDIRECT AN AGENT ===
    {
      type: 'prompt-lab',
      instruction: 'The agent used client-side filtering instead of server-side. Write a redirect prompt to fix this specific issue.',
      scenario: 'You asked the agent to add search to a bookmarks page. It fetched ALL bookmarks from Supabase and filtered them in JavaScript using .filter(). This works but is slow with many bookmarks. You want it to use Supabase\'s .ilike() for server-side filtering instead.',
      starterPrompt: 'This is wrong. Fix it.',
      responses: [
        {
          triggerKeywords: ['ilike', 'server', 'supabase', 'filter'],
          response: 'You\'re right — I should filter at the database level instead of in the client. I\'ll update the query to use Supabase\'s `.ilike()` method on the title column.\n\nChanging:\n```\nconst filtered = data.filter(b => b.title.includes(term))\n```\nTo:\n```\nquery.ilike("title", `%${term}%`)\n```\n\nThis moves filtering to PostgreSQL where it belongs.',
          quality: 'excellent',
          feedback: 'Specific, actionable, and targeted. You named the exact method (.ilike), the reason (server-side), and the technology (Supabase). The agent knows exactly what to change without guessing.',
        },
        {
          triggerKeywords: ['server', 'database', 'query'],
          response: 'I\'ll move the filtering to the server side. Let me update the database query to handle the search.\n\nDo you want me to use:\n1. PostgreSQL LIKE\n2. Full-text search with tsvector\n3. A search index like Meilisearch?\n\nPlease advise.',
          quality: 'good',
          feedback: 'You identified the problem (should be server-side) but left the implementation open. The agent is asking follow-up questions instead of executing. Name the specific method (ilike, LIKE, etc.) to eliminate the decision point.',
        },
      ],
      fallbackResponse: {
        response: 'I\'m not sure what\'s wrong. The search is working — it finds matching bookmarks. Could you be more specific about what to fix?',
        feedback: 'Your redirect was too vague. The agent doesn\'t know what\'s wrong. A good redirect names: (1) what the agent did wrong, (2) what it should do instead, and (3) the specific method or approach to use.',
      },
    },

    // === PREVENTION ===
    {
      type: 'multiple-choice',
      question: 'The agent keeps using REST when you want GraphQL across different projects. What is the long-term fix?',
      options: [
        'Switch to a different AI model that defaults to GraphQL',
        'Always correct the agent after it builds REST endpoints',
        'Build a library of spec constraints you always include — "API style: GraphQL with single /graphql endpoint" becomes a default in your specs',
        'Give up on GraphQL and accept REST',
      ],
      correctIndex: 2,
      explanation: 'Every divergence teaches you something about your spec. "Agent used REST" means your spec needs to say API style explicitly. Over time, you build a personal library of constraints you always include. The best specs come from people who have recovered from divergence many times and codified the lessons.',
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
