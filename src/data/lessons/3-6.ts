import type { LessonContent } from './types'

const content: LessonContent = {
  lessonId: '3-6',
  steps: [
    // === INTRODUCTION ===
    {
      type: 'info',
      title: 'Using one AI agent to check another\'s work',
      body: "Agent A builds a feature. You could review it yourself. But there's a better move: send Agent B to systematically verify Agent A's output against the spec. This isn't code review — it's structured verification. Agent B has fresh context, no sunk-cost bias, and can catch what Agent A missed because it wasn't emotionally invested in the implementation.",
    },
    {
      type: 'info',
      title: 'Why agents verify better than the builder',
      body: "When you build something, you develop blind spots. You know what you intended, so you see the intention rather than what's actually there. A second agent reads the code cold — no assumptions, no context bleed. It evaluates purely against the spec. This is the same principle as code review, but automated and systematic.",
    },

    // === DIAGRAM 1: Build → Verify → Decide ===
    {
      type: 'diagram',
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
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'You see the verification loop: build, verify, decide.',
    },

    // === WHAT VERIFICATION IS NOT ===
    {
      type: 'info',
      title: 'Verification is NOT code review',
      body: "Code review asks: is this good code? Verification asks: does this meet the spec? A function can have beautiful code but miss a requirement. Or ugly code that perfectly satisfies every constraint. Verification checks completeness and correctness against a defined standard — not style, not elegance, not cleverness.",
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

    // === SETTING UP VERIFICATION ===
    {
      type: 'info',
      title: 'Setting up the verify agent',
      body: "The verify agent needs exactly two inputs: the spec (what should have been built) and the output (what was actually built). It does NOT need the build agent's conversation history — that would contaminate its fresh perspective. Give it the branch, give it the spec, ask it to verify.",
    },
    {
      type: 'code-demo',
      title: 'Verification prompt template',
      body: "This is the prompt you give to the verification agent. It's structured to force systematic checking rather than impressionistic scanning.",
      language: 'markdown',
      filename: 'VERIFY-PROMPT.md',
      code: `# Verification Task

## Your Role
You are a verification agent. Your job is to systematically check
whether the implementation meets every requirement in the spec.
You have NO knowledge of how or why it was built this way.
Evaluate only what exists against what was required.

## The Spec (what should exist)
[paste the original task spec here]

## The Output (what to verify)
Branch: feat/auth
Files to check: src/auth/*

## Verification Checklist
For each requirement in the spec, report:
- PASS: requirement fully met
- FAIL: requirement not met (explain what's missing)
- PARTIAL: partially met (explain the gap)

## Also Check
- Are there files outside the specified scope?
- Are shared contracts imported correctly?
- Do the types match the contracts.ts definitions?
- Are there any hardcoded values that should be configurable?

## Output Format
Return a structured verdict with pass/fail per requirement.`,
    },
    {
      type: 'checkpoint',
      xp: 5,
      message: 'You can set up a verification agent with the right inputs.',
    },

    // === VERIFICATION CRITERIA ===
    {
      type: 'info',
      title: 'Beyond "it compiles": verification criteria',
      body: "Compilation is the lowest bar. A file can compile and be completely wrong. Verification checks deeper: does it meet the functional requirements? Does it handle edge cases? Does it respect the architectural constraints from CLAUDE.md? Does it integrate cleanly with the rest of the system?",
    },
    {
      type: 'code-demo',
      title: 'Structured verification criteria',
      body: "Give your verify agent these categories to check. Each one catches a different class of error that build agents commonly make.",
      language: 'markdown',
      filename: 'verification-criteria.md',
      code: `# Verification Criteria (ordered by severity)

## 1. Functional Completeness
- Every requirement in the spec has a corresponding implementation
- No spec item is missing or only partially implemented
- Edge cases mentioned in the spec are handled

## 2. Contract Compliance
- Types match src/types/contracts.ts exactly
- API responses use the correct wrapper format
- Function signatures match agreed interfaces

## 3. Architectural Compliance (CLAUDE.md)
- Uses specified libraries (not alternatives)
- Follows file naming conventions
- No forbidden patterns (any, barrel files, etc.)
- Imports from correct paths

## 4. Integration Readiness
- Exports are named correctly for consumers
- No implicit dependencies on unbuilt features
- Environment variables documented if new ones added

## 5. Testability
- Tests exist for each public function/endpoint
- Tests cover both happy path and error cases
- Tests are runnable in isolation (no external dependencies)`,
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

    // === CATCHING INTEGRATION ISSUES ===
    {
      type: 'info',
      title: 'Catching integration issues between parallel outputs',
      body: "The verify agent's most valuable role: catching issues that only appear when you combine multiple agents' outputs. Agent A exports a function. Agent B imports it with different expected parameters. Neither agent is wrong individually — the mismatch only appears at integration. The verify agent checks these seams.",
    },
    {
      type: 'code-demo',
      title: 'Integration verification prompt',
      body: "When verifying integration points, you give the verify agent BOTH agents' outputs and ask it to check the seams — the places where one agent's output connects to another's.",
      language: 'markdown',
      filename: 'VERIFY-INTEGRATION.md',
      code: `# Integration Verification

## Check These Seams

### Auth → API (middleware import)
- src/api/routes/tasks.ts imports from src/auth/middleware.ts
- Verify: does the import path exist? Does the middleware
  export match what the API expects?

### API → UI (response shapes)
- src/components/task-list.tsx consumes GET /tasks response
- Verify: does the component's type annotation match the
  actual API response shape?

### Auth → UI (token handling)
- src/components/login-form.tsx stores JWT from auth response
- Verify: does the login response shape match what the
  form component expects to receive?

## For Each Seam, Report:
- Exporter: what's actually exported (function signature, type)
- Consumer: what's expected by the importer
- Match: YES (compatible) or NO (explain the mismatch)`,
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

    // === THE VERIFICATION LOOP IN PRACTICE ===
    {
      type: 'info',
      title: 'The full loop: Build → Verify → Fix → Verify',
      body: "When verification finds issues, you have three options: fix it yourself (small issue), send the build agent a correction (medium issue), or re-run the build agent with an updated spec (fundamental misunderstanding). Most issues are small — a missing error handler, a wrong type annotation. These are quick fixes.",
    },
    {
      type: 'code-demo',
      title: 'Real verification output',
      body: "This is what a verification agent's structured output looks like. Clear, actionable, no ambiguity about what needs fixing.",
      language: 'markdown',
      filename: 'verification-report.md',
      code: `# Verification Report: Auth Agent Output

## Functional Completeness
- [PASS] Login returns JWT on valid credentials
- [PASS] Signup creates user and returns JWT
- [FAIL] Middleware rejects expired tokens — no expiry check found
- [PARTIAL] Zod schemas — login schema exists, signup missing email format validation

## Contract Compliance
- [PASS] User type matches contracts.ts
- [PASS] ApiResponse wrapper used correctly
- [FAIL] JWT payload missing 'role' field (spec requires { userId, email, role })

## Architectural Compliance
- [PASS] Uses specified bcrypt library for hashing
- [PASS] Files named in kebab-case
- [PASS] Named exports only, no default exports

## Integration Readiness
- [PASS] Middleware exported correctly for API agent to import
- [FAIL] Token verification function not exported (API agent will need it)

## Summary
4 PASS | 3 FAIL | 1 PARTIAL
Blocking issues: expired token handling, JWT role field, token verify export`,
    },

    // === DIAGRAM 2: Multi-Agent Verify Pattern ===
    {
      type: 'diagram',
      title: 'Cross-Verification in a Fleet',
      body: "In a fleet of 4 agents, you can use a single dedicated verification agent that checks all outputs sequentially. Or you can have agents cross-verify: Agent 2 verifies Agent 1's output, Agent 3 verifies Agent 2's, etc. The dedicated verifier is simpler; cross-verification is more thorough.",
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
    },

    // === HANDS-ON EXERCISE ===
    {
      type: 'info',
      title: 'Exercise: Write a verification prompt',
      body: "You ran a fleet. Agent 1 built an auth system. You need to verify its output before merging. Write the verification prompt that another agent will use to systematically check the work.",
    },
    {
      type: 'terminal',
      instruction: 'Check what the auth agent actually produced (list files):',
      expectedCommand: 'find src/auth -type f -name "*.ts" | sort',
      hint: 'Use find to list all TypeScript files in the auth directory',
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
