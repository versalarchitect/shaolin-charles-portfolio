import type { LessonContent } from './types'

const content: LessonContent = {
  lessonId: '3-6',
  steps: [
    // === INTRODUCTION (keep first 2 passive) ===
    {
      type: 'info',
      title: 'Using one AI agent to check another\'s work',
      body: "Agent A builds a feature. You could review it yourself. But there's a better move: send Agent B to systematically verify Agent A's output against the spec. This isn't code review — it's structured verification. Agent B has fresh context, no sunk-cost bias, and can catch what Agent A missed because it wasn't emotionally invested in the implementation.",
    },
    // CONVERTED: info → multiple-choice (#1)
    {
      type: 'multiple-choice',
      question: 'Why does a second agent verify better than the builder agent?',
      options: [
        'The second agent has more computing power available',
        'The second agent reads the code cold with no assumptions or context bleed, evaluating purely against the spec',
        'The second agent was specifically trained for code review',
        'The second agent can run the code while the first cannot',
      ],
      correctIndex: 1,
      explanation: "When you build something, you develop blind spots. You know what you intended, so you see the intention rather than what's actually there. A second agent reads the code cold — no assumptions, no context bleed. It evaluates purely against the spec. This is the same principle as code review, but automated and systematic.",
    },

    // === DIAGRAM 1: Build -> Verify -> Decide (Interactive — already interactive) ===
    {
      type: 'interactive-diagram',
      title: 'The Verification Loop',
      body: "The build agent produces output. The verify agent evaluates it against the spec. It returns a structured verdict: pass, fail with reasons, or partial pass with specific gaps. You make the final call.",
      diagram: {
        direction: 'LR',
        nodes: [
          { id: 'spec', label: 'Spec', sublabel: 'Requirements', shape: 'rounded' },
          { id: 'build', label: 'Build Agent', sublabel: 'Creates code', shape: 'rect' },
          { id: 'output', label: 'Output', sublabel: 'Branch/PR', shape: 'rect' },
          { id: 'verify', label: 'Verify Agent', sublabel: 'Checks spec', shape: 'rect', highlight: true },
          { id: 'verdict', label: 'Verdict', sublabel: 'Pass/Fail', shape: 'diamond' },
          { id: 'human', label: 'You', sublabel: 'Final call', shape: 'rounded', highlight: true },
        ],
        edges: [
          { from: 'spec', to: 'build', label: 'implements' },
          { from: 'build', to: 'output' },
          { from: 'spec', to: 'verify', label: 'checks against' },
          { from: 'output', to: 'verify', label: 'evaluates' },
          { from: 'verify', to: 'verdict' },
          { from: 'verdict', to: 'human' },
        ],
      },
      stages: [
        {
          highlightNodes: ['spec', 'build'],
          highlightEdges: [{ from: 'spec', to: 'build' }],
          explanation: 'The builder agent receives the spec and implements the feature. It produces code based on the requirements.',
        },
        {
          highlightNodes: ['build', 'output'],
          highlightEdges: [{ from: 'build', to: 'output' }],
          explanation: 'The builder generates output — a branch or PR containing the implementation.',
        },
        {
          highlightNodes: ['spec', 'output', 'verify'],
          highlightEdges: [{ from: 'spec', to: 'verify' }, { from: 'output', to: 'verify' }],
          explanation: 'The verifier agent receives BOTH the spec and the output. It checks the output against every requirement — no shared context with the builder.',
        },
        {
          highlightNodes: ['verify', 'verdict'],
          highlightEdges: [{ from: 'verify', to: 'verdict' }],
          explanation: 'The verifier returns a structured verdict: PASS, FAIL (with reasons), or PARTIAL (with specific gaps). No ambiguity.',
        },
        {
          highlightNodes: ['verdict', 'human'],
          highlightEdges: [{ from: 'verdict', to: 'human' }],
          explanation: 'You make the final call based on the verdict. Fix small issues yourself, send corrections to the builder, or re-spec if the builder fundamentally misunderstood.',
        },
      ],
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'You see the verification loop: build, verify, decide.',
    },

    // === PROMPT LAB (already interactive) ===
    {
      type: 'prompt-lab',
      instruction: 'Write a verification prompt that instructs a verifier agent to check the builder agent\'s auth implementation.',
      scenario: 'A builder agent just implemented login/signup using Supabase Auth. You need a second agent to verify: correct RLS policies, no exposed service keys, proper session handling, and error states.',
      starterPrompt: 'Check the auth code.',
      responses: [
        {
          triggerKeywords: ['rls', 'service', 'key', 'session'],
          response: 'Verification report for auth implementation:\n\n✅ RLS enabled on all user-facing tables\n✅ Service role key only used in server actions\n⚠️ Session refresh not implemented — tokens will expire\n❌ Missing error handling on signup — no duplicate email check\n\n2 issues found, 1 critical.',
          quality: 'excellent',
          feedback: 'Your prompt specified the exact verification domains: RLS policies, key exposure, session handling, and error states. The verifier agent knew exactly what to check.',
        },
        {
          triggerKeywords: ['auth', 'check', 'security'],
          response: 'I reviewed the auth code. It looks good overall. The login flow works and users can sign up. I\'d suggest adding some tests.\n\nVerdict: Approved.',
          quality: 'poor',
          feedback: 'Without specific verification criteria, the verifier just skimmed and approved. Specify exactly what to check: RLS policies, key exposure patterns, session lifecycle, and error handling.',
        },
      ],
      fallbackResponse: {
        response: 'What specifically should I check? The auth system has many components.',
        feedback: 'Your prompt was too vague. A good verification prompt specifies: (1) which files to check, (2) what security properties to verify, (3) what patterns to grep for, and (4) what counts as a pass vs fail.',
      },
    },

    // === WHAT VERIFICATION IS NOT — CONVERTED: info → compare (#2 — merge two concepts) ===
    {
      type: 'compare',
      title: 'Verification vs Code Review',
      body: 'These are two different activities with different goals. Understanding the distinction is critical for writing effective verification prompts.',
      question: 'Which one checks compliance against the spec?',
      correctSide: 'right',
      left: {
        label: 'Code Review',
        content: "Asks: Is this good code?\n\nChecks:\n- Style and conventions (var vs const)\n- Component structure (too many props?)\n- Performance patterns\n- Readability and maintainability\n- Naming conventions\n\nOutcome:\n- Suggestions for improvement\n- Style nits and best practices\n- Subjective quality judgments",
      },
      right: {
        label: 'Verification',
        content: "Asks: Does this meet the spec?\n\nChecks:\n- Every requirement has an implementation\n- Types match agreed contracts\n- Edge cases from spec are handled\n- Integration points work correctly\n\nOutcome:\n- PASS / FAIL per requirement\n- Objective compliance report\n- Actionable gaps to fix",
      },
      explanation: "A function can have beautiful code but miss a requirement. Or ugly code that perfectly satisfies every constraint. Verification checks completeness and correctness against a defined standard — not style, not elegance, not cleverness.",
    },
    {
      type: 'multiple-choice',
      question: 'Which of these is a verification concern vs. a code review concern?',
      options: [
        'The function uses var instead of const (code review)',
        'The login endpoint doesn\'t return a JWT as specified (verification)',
        'The component has too many props (code review)',
        'Both A and C are code review; B is verification',
      ],
      correctIndex: 3,
      explanation: "Verification checks against the spec: does login return a JWT? That's a pass/fail requirement. Style issues (var vs const, prop count) are code review territory — they matter, but they're separate from spec compliance.",
    },

    // === SETTING UP VERIFICATION — CONVERTED: info → multiple-choice (#3) ===
    {
      type: 'multiple-choice',
      question: 'What inputs does the verify agent need?',
      options: [
        'The build agent\'s conversation history and the output',
        'Only the output (branch/PR) — it can figure out the rest',
        'The spec (what should have been built) and the output (what was actually built) — NOT the build conversation',
        'A description of the codebase architecture and a list of common bugs',
      ],
      correctIndex: 2,
      explanation: "The verify agent needs exactly two inputs: the spec and the output. It does NOT need the build agent's conversation history — that would contaminate its fresh perspective. Give it the branch, give it the spec, ask it to verify.",
    },
    // CONVERTED: code-demo → code-fill (#4)
    {
      type: 'code-fill',
      instruction: 'Complete this verification prompt template that forces systematic checking:',
      language: 'markdown',
      filename: 'VERIFY-PROMPT.md',
      template: '# Verification Task\n\n## Your Role\nYou are a {{role}} agent. Your job is to systematically check\nwhether the implementation meets every requirement in the spec.\nYou have NO knowledge of how or why it was built this way.\nEvaluate only what exists against what was required.\n\n## The Spec (what should exist)\n[paste the original task spec here]\n\n## The Output (what to verify)\nBranch: feat/auth\nFiles to check: src/auth/*\n\n## Verification Checklist\nFor each requirement in the spec, report:\n- {{passLabel}}: requirement fully met\n- {{failLabel}}: requirement not met (explain what\'s missing)\n- PARTIAL: partially met (explain the gap)\n\n## Output Format\nReturn a structured {{outputType}} with pass/fail per requirement.',
      blanks: [
        { id: 'role', answer: 'verification', alternatives: ['verifier', 'verify'], placeholder: 'agent role?', hint: 'This agent verifies, it does not build' },
        { id: 'passLabel', answer: 'PASS', placeholder: 'success label?', hint: 'The label when a requirement is fully met' },
        { id: 'failLabel', answer: 'FAIL', placeholder: 'failure label?', hint: 'The label when a requirement is not met' },
        { id: 'outputType', answer: 'verdict', alternatives: ['report'], placeholder: 'output type?', hint: 'A structured judgment or decision' },
      ],
      explanation: "The prompt is structured to force systematic checking rather than impressionistic scanning. Each requirement gets an explicit PASS/FAIL/PARTIAL rating. No ambiguity about what's working and what's not.",
    },
    {
      type: 'checkpoint',
      xp: 5,
      message: 'You can set up a verification agent with the right inputs.',
    },

    // === VERIFICATION CRITERIA — CONVERTED: info → multiple-choice (#5) ===
    {
      type: 'multiple-choice',
      question: 'A file compiles without errors. Does that mean it passes verification?',
      options: [
        'Yes — compilation proves the code is correct',
        'No — compilation is the lowest bar; verification checks functional requirements, edge cases, architectural constraints, and integration readiness',
        'Yes — if TypeScript is happy, the spec is satisfied',
        'It depends on whether there are tests',
      ],
      correctIndex: 1,
      explanation: "Compilation is the lowest bar. A file can compile and be completely wrong. Verification checks deeper: does it meet the functional requirements? Does it handle edge cases? Does it respect the architectural constraints from CLAUDE.md? Does it integrate cleanly with the rest of the system?",
    },
    // CONVERTED: code-demo → code-fill (#6)
    {
      type: 'code-fill',
      instruction: 'Complete these structured verification criteria ordered by severity:',
      language: 'markdown',
      filename: 'verification-criteria.md',
      template: '# Verification Criteria (ordered by severity)\n\n## 1. {{topCriteria}}\n- Every requirement in the spec has a corresponding implementation\n- No spec item is missing or only partially implemented\n- Edge cases mentioned in the spec are handled\n\n## 2. Contract Compliance\n- Types match src/types/{{contractFile}} exactly\n- API responses use the correct wrapper format\n- Function signatures match agreed interfaces\n\n## 3. {{archCriteria}} (CLAUDE.md)\n- Uses specified libraries (not alternatives)\n- Follows file naming conventions\n- No forbidden patterns (any, barrel files, etc.)\n\n## 4. Integration Readiness\n- Exports are named correctly for {{consumers}}\n- No implicit dependencies on unbuilt features\n\n## 5. {{testCriteria}}\n- Tests exist for each public function/endpoint\n- Tests cover both happy path and error cases',
      blanks: [
        { id: 'topCriteria', answer: 'Functional Completeness', alternatives: ['Functional completeness'], placeholder: 'most critical?', hint: 'Does the implementation cover all spec requirements?' },
        { id: 'contractFile', answer: 'contracts.ts', alternatives: ['contracts'], placeholder: 'shared types file?', hint: 'The file where shared type contracts are defined' },
        { id: 'archCriteria', answer: 'Architectural Compliance', alternatives: ['Architectural compliance', 'Architecture Compliance'], placeholder: 'architecture check?', hint: 'Checking against the project\'s architectural rules' },
        { id: 'consumers', answer: 'consumers', alternatives: ['importers', 'other agents'], placeholder: 'who uses exports?', hint: 'Other modules that will import from this code' },
        { id: 'testCriteria', answer: 'Testability', alternatives: ['Test Coverage', 'Testing'], placeholder: 'test category?', hint: 'Whether the code has proper tests' },
      ],
      explanation: 'Verification criteria are ordered by severity: functional completeness first (does it do what the spec says?), then contract compliance, architectural rules, integration readiness, and finally testability.',
    },
    {
      type: 'order',
      instruction: 'Rank verification criteria from MOST critical (top) to LEAST critical:',
      items: [
        'Functional completeness (all spec items implemented)',
        'Contract compliance (types match agreed interfaces)',
        'Code style follows project conventions',
        'Integration readiness (exports work for consumers)',
      ],
      correctOrder: [0, 1, 3, 2],
    },

    // === CATCHING INTEGRATION ISSUES — CONVERTED: info → multiple-choice (#7) ===
    {
      type: 'multiple-choice',
      question: 'What is the verify agent\'s MOST valuable role in fleet work?',
      options: [
        'Checking code style and formatting consistency',
        'Running automated tests that the builder forgot',
        'Catching integration mismatches between parallel agent outputs that only appear when you combine them',
        'Ensuring all comments are in English',
      ],
      correctIndex: 2,
      explanation: "The verify agent's most valuable role: catching issues that only appear when you combine multiple agents' outputs. Agent A exports a function. Agent B imports it with different expected parameters. Neither agent is wrong individually — the mismatch only appears at integration. The verify agent checks these seams.",
    },
    // CONVERTED: code-demo → code-fill (#8)
    {
      type: 'code-fill',
      instruction: 'Complete this integration verification prompt that checks the seams between agent outputs:',
      language: 'markdown',
      filename: 'VERIFY-INTEGRATION.md',
      template: '# Integration Verification\n\n## Check These Seams\n\n### Auth -> API ({{seamType1}})\n- src/api/routes/tasks.ts imports from src/auth/{{middlewareFile}}\n- Verify: does the import path exist? Does the middleware\n  export match what the API expects?\n\n### API -> UI ({{seamType2}})\n- src/components/task-list.tsx consumes GET /tasks response\n- Verify: does the component\'s type annotation match the\n  actual API response shape?\n\n## For Each Seam, Report:\n- Exporter: what\'s actually exported (function signature, type)\n- Consumer: what\'s expected by the {{importerRole}}\n- Match: {{yesLabel}} (compatible) or NO (explain the mismatch)',
      blanks: [
        { id: 'seamType1', answer: 'middleware import', alternatives: ['middleware'], placeholder: 'what crosses this boundary?', hint: 'The auth component the API needs to import' },
        { id: 'middlewareFile', answer: 'middleware.ts', alternatives: ['middleware'], placeholder: 'auth file?', hint: 'The file containing the JWT verification middleware' },
        { id: 'seamType2', answer: 'response shapes', alternatives: ['response types', 'data shapes'], placeholder: 'what to match?', hint: 'The shapes of data flowing from API to UI' },
        { id: 'importerRole', answer: 'importer', alternatives: ['consumer'], placeholder: 'who imports?', hint: 'The module that brings in the export' },
        { id: 'yesLabel', answer: 'YES', placeholder: 'compatible label?', hint: 'The affirmative label for a matching seam' },
      ],
      explanation: 'Integration verification checks the seams — places where one agent\'s output connects to another\'s. For each seam, compare what\'s exported vs what\'s expected. Mismatches caught here prevent runtime errors after merge.',
    },
    {
      type: 'multiple-choice',
      question: 'Agent A exports `getUser(id: string): Promise<User>`. Agent B calls `getUser(id: string, includeProfile: boolean)`. The verify agent should:',
      options: [
        'Flag Agent B as wrong — it doesn\'t match the export',
        'Flag Agent A as wrong — it\'s missing the parameter',
        'Flag a contract mismatch — the spec must clarify the interface',
        'Ignore it — TypeScript will catch it at compile time',
      ],
      correctIndex: 2,
      explanation: "Neither agent is individually wrong — each interpreted the requirement differently. This is a contract gap. The verify agent flags it so you (the orchestrator) can decide: add the parameter to the contract, or remove the assumption from Agent B. TypeScript WILL catch it, but the verify agent catches it earlier and with context about why.",
    },
    {
      type: 'checkpoint',
      xp: 5,
      message: 'You can verify integration seams between parallel agent outputs.',
    },

    // === THE VERIFICATION LOOP — CONVERTED: info → compare (#9 — merge loop info + report code-demo) ===
    {
      type: 'compare',
      title: 'Responding to verification failures',
      body: 'When verification finds issues, your response depends on the severity. Here are two scenarios from the same verification report.',
      question: 'Which response is appropriate for which severity level?',
      correctSide: 'left',
      left: {
        label: 'Minor failures (quick fix)',
        content: "Verification Report:\n- [FAIL] JWT payload missing 'role' field\n- [PARTIAL] Signup schema missing email validation\n\nResponse: Fix it yourself (2 minutes)\n- Add 'role' to JWT payload object\n- Add .email() to Zod signup schema\n- No need to re-run the build agent\n\nWhen to use:\n- Missing a field or validation\n- Wrong type annotation\n- Forgotten export",
      },
      right: {
        label: 'Major failures (re-run needed)',
        content: "Verification Report:\n- [FAIL] Used Firebase Auth instead of Supabase Auth\n- [FAIL] No RLS policies — all data publicly readable\n- [FAIL] Passwords stored in plaintext\n\nResponse: Re-run with clearer spec\n- Builder fundamentally misunderstood the task\n- Multiple cascading failures\n- Fixing individually would take longer than re-run\n\nWhen to use:\n- Wrong technology/approach chosen\n- Security violations\n- Fundamental misunderstanding of requirements",
      },
      explanation: 'Most verification failures are minor — a missing field, a wrong type. Fix them yourself in minutes. Major failures (wrong approach, security issues, fundamental misunderstanding) warrant a re-run with a clearer spec. The verify agent gives you the data to make this judgment.',
    },
    // CONVERTED: code-demo (verification report) → code-fill (#10)
    {
      type: 'code-fill',
      instruction: 'Complete this real verification report. Fill in the verdict for each item based on the description:',
      language: 'markdown',
      filename: 'verification-report.md',
      template: '# Verification Report: Auth Agent Output\n\n## Functional Completeness\n- [{{v1}}] Login returns JWT on valid credentials\n- [PASS] Signup creates user and returns JWT\n- [{{v2}}] Middleware rejects expired tokens — no expiry check found\n- [{{v3}}] Zod schemas — login schema exists, signup missing email format\n\n## Contract Compliance\n- [PASS] User type matches contracts.ts\n- [PASS] ApiResponse wrapper used correctly\n- [{{v4}}] JWT payload missing \'role\' field (spec requires userId, email, role)\n\n## Summary\n4 PASS | 3 {{failWord}} | 1 PARTIAL',
      blanks: [
        { id: 'v1', answer: 'PASS', placeholder: 'verdict?', hint: 'Login works correctly per spec' },
        { id: 'v2', answer: 'FAIL', placeholder: 'verdict?', hint: 'No expiry check means this requirement is NOT met' },
        { id: 'v3', answer: 'PARTIAL', placeholder: 'verdict?', hint: 'Login schema exists but signup is missing validation — partially met' },
        { id: 'v4', answer: 'FAIL', placeholder: 'verdict?', hint: 'A required field is missing from the JWT payload' },
        { id: 'failWord', answer: 'FAIL', placeholder: 'failure label?', hint: 'The word used for unmet requirements' },
      ],
      explanation: 'A structured verification report removes ambiguity. Each requirement gets a clear PASS, FAIL, or PARTIAL verdict. The summary gives you an at-a-glance view: 4 passing, 3 failing, 1 partial. You can immediately see what needs fixing.',
    },

    // === DIAGRAM 2 — CONVERTED: diagram → interactive-diagram (#11 — bonus) ===
    {
      type: 'interactive-diagram',
      title: 'Cross-Verification in a Fleet',
      body: "In a fleet of 4 agents, you can use a single dedicated verification agent that checks all outputs sequentially. Or you can have agents cross-verify: Agent 2 verifies Agent 1's output, Agent 3 verifies Agent 2's, etc.",
      diagram: {
        direction: 'TB',
        nodes: [
          { id: 'b1', label: 'Build 1', sublabel: 'Auth', shape: 'rect' },
          { id: 'b2', label: 'Build 2', sublabel: 'API', shape: 'rect' },
          { id: 'b3', label: 'Build 3', sublabel: 'UI', shape: 'rect' },
          { id: 'v', label: 'Verify Agent', sublabel: 'Checks all', shape: 'rect', highlight: true },
          { id: 'report', label: 'Report', sublabel: 'Pass/Fail per agent', shape: 'rounded' },
          { id: 'you', label: 'You', sublabel: 'Act on report', shape: 'rounded', highlight: true },
        ],
        edges: [
          { from: 'b1', to: 'v', label: 'output 1' },
          { from: 'b2', to: 'v', label: 'output 2' },
          { from: 'b3', to: 'v', label: 'output 3' },
          { from: 'v', to: 'report' },
          { from: 'report', to: 'you' },
        ],
      },
      stages: [
        { highlightNodes: ['b1', 'b2', 'b3'], explanation: 'Three build agents complete their work in parallel. Each produces output on its own branch.' },
        { highlightNodes: ['b1', 'b2', 'b3', 'v'], highlightEdges: [{ from: 'b1', to: 'v' }, { from: 'b2', to: 'v' }, { from: 'b3', to: 'v' }], explanation: 'A dedicated verify agent receives ALL outputs plus the specs. It checks each agent\'s work sequentially.' },
        { highlightNodes: ['v', 'report'], highlightEdges: [{ from: 'v', to: 'report' }], explanation: 'The verify agent produces a consolidated report with PASS/FAIL per agent and per requirement.' },
        { highlightNodes: ['report', 'you'], highlightEdges: [{ from: 'report', to: 'you' }], explanation: 'You act on the report: fix minor issues yourself, send corrections for medium issues, or re-spec for fundamental misunderstandings.' },
      ],
    },

    // === HANDS-ON EXERCISE ===
    {
      type: 'terminal',
      instruction: 'Check what the auth agent actually produced (list files):',
      expectedCommand: 'find src/auth -type f -name "*.ts" | sort',
      hint: 'Use find to list all TypeScript files in the auth directory',
      platforms: {
        windows: {
          instruction: 'Check what the auth agent actually produced (list files):',
          expectedCommand: 'Get-ChildItem -Recurse -Path "src/auth" -Filter "*.ts" -File | Sort-Object Name',
          hint: 'Use Get-ChildItem to list all TypeScript files in the auth directory',
        },
      },
    },
    {
      type: 'code-input',
      instruction: 'Write the first verification criterion. It should check if the login endpoint returns what the spec requires:',
      placeholder: '- [?] Login endpoint returns ...',
      answer: '- [ ] Login endpoint returns ApiResponse<{ token: string }> on valid credentials',
      hint: 'Check the functional requirement: does login return the correct response shape?',
    },
    {
      type: 'multiple-choice',
      question: 'You receive the verification report. 2 items are FAIL, 8 are PASS. What do you do?',
      options: [
        'Reject the entire output and re-run the build agent',
        'Fix the 2 failures yourself — they\'re probably small',
        'Send the build agent the 2 specific failures to fix, then re-verify',
        'Any of these depending on the severity of the failures',
      ],
      correctIndex: 3,
      explanation: "Context matters. If the failures are minor (missing a field, forgetting to export), fix them yourself or send targeted corrections. If they're fundamental (wrong approach, misunderstood the domain), re-run with a clearer spec. There's no one-size-fits-all answer.",
    },
    {
      type: 'checklist',
      title: 'Cross-agent verification checklist',
      items: [
        'Verify agent receives spec + output, NOT the build conversation',
        'Verification checks functional completeness first',
        'Contract compliance checked against shared types',
        'CLAUDE.md architectural rules verified',
        'Integration seams checked between agent outputs',
        'Structured verdict with PASS/FAIL per requirement',
        'Human makes final merge/reject decision based on report',
      ],
    },
    {
      type: 'checkpoint',
      xp: 7,
      message: 'Verification learned! You now have AI checking AI. Trust but verify.',
    },
  ],
}

export default content
