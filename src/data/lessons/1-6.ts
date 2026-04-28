import type { LessonContent } from './types'

const content: LessonContent = {
  lessonId: '1-6',
  steps: [
    // === INTRODUCTION ===
    {
      type: 'info',
      title: 'Principle 3: Read the error first',
      body: "Read the error message. The whole error message. Before anything else. Most developers — and most AI agents — skip this step. They see red text and start guessing. They change random things. They ask \"why doesn't this work?\" without reading what the computer already told them. This wastes enormous amounts of time.",
    },
    {
      type: 'info',
      title: 'Errors are answers, not problems',
      body: "An error message is the computer telling you exactly what went wrong, where it happened, and often why. A stack trace is a map. A type error is a diagnosis. Treating errors as noise is like ignoring a doctor's test results and guessing what's wrong.",
    },
    {
      type: 'checkpoint',
      xp: 2,
      message: 'Mindset shift: errors are data.',
    },

    // === DEBUGGING DECISION TREE DIAGRAM ===
    {
      type: 'diagram',
      title: 'Debugging Decision Tree',
      body: 'Follow this path every time you hit an error. No skipping steps.',
      diagram: {
        direction: 'TB',
        nodes: [
          { id: 'err', label: 'Error Occurs', shape: 'rounded', highlight: true },
          { id: 'read', label: 'Read Message', shape: 'rect' },
          { id: 'rec', label: 'Recognize?', shape: 'diamond' },
          { id: 'fix', label: 'Apply Fix', shape: 'rect' },
          { id: 'search', label: 'Search Error', shape: 'rect' },
          { id: 'verify', label: 'Verify Fix', shape: 'pill', highlight: true },
        ],
        edges: [
          { from: 'err', to: 'read' },
          { from: 'read', to: 'rec' },
          { from: 'rec', to: 'fix', label: 'yes' },
          { from: 'rec', to: 'search', label: 'no' },
          { from: 'fix', to: 'verify' },
          { from: 'search', to: 'verify' },
        ],
      },
    },

    // === ERROR ANATOMY ===
    {
      type: 'info',
      title: 'Anatomy of an error message',
      body: 'Every error has four parts: the error type (what category of problem), the message (human-readable description), the file and line number (where it happened), and the stack trace (the chain of function calls that led there). Training yourself to parse all four instantly is the single highest-leverage debugging skill.',
    },
    {
      type: 'code-demo',
      title: 'A real Node.js error, dissected',
      body: 'Look at each part. The type is TypeError. The message tells you what failed. The location tells you where. The stack tells you how you got there.',
      language: 'text',
      filename: 'terminal output',
      code: "TypeError: Cannot read properties of undefined (reading 'map')\n    at renderList (/app/src/components/UserList.tsx:12:18)\n    at Object.render (/app/src/pages/Dashboard.tsx:45:5)\n    at processChild (/app/node_modules/react-dom/server.js:3456:14)\n\n┌─ Type:     TypeError\n├─ Message:  Cannot read properties of undefined (reading 'map')\n├─ File:     src/components/UserList.tsx, line 12\n└─ Cause:    'users' is undefined when .map() is called",
    },
    {
      type: 'multiple-choice',
      question: 'In the error above, which file should you look at FIRST?',
      options: [
        'react-dom/server.js',
        'src/pages/Dashboard.tsx',
        'src/components/UserList.tsx',
        'package.json',
      ],
      correctIndex: 2,
      explanation: "The top of the stack trace points to UserList.tsx line 12 — that's where the error actually occurred. Always start at the top of the stack, not the bottom. Ignore node_modules lines.",
    },
    {
      type: 'checkpoint',
      xp: 2,
      message: 'Error anatomy mastered!',
    },

    // === ERROR CATEGORIES ===
    {
      type: 'diagram',
      title: 'Error Categories',
      body: 'Every error falls into one of three categories. Each requires a different debugging approach.',
      diagram: {
        direction: 'TB',
        nodes: [
          { id: 'error', label: 'Error', shape: 'rounded', highlight: true },
          { id: 'type', label: 'Type?', shape: 'diamond' },
          { id: 'syntax', label: 'Syntax Error', shape: 'rect' },
          { id: 'runtime', label: 'Runtime Error', shape: 'rect' },
          { id: 'logic', label: 'Logic Error', shape: 'rect' },
          { id: 'code', label: 'Check code', shape: 'pill' },
          { id: 'data', label: 'Check data', shape: 'pill' },
          { id: 'logic_fix', label: 'Check logic', shape: 'pill' },
        ],
        edges: [
          { from: 'error', to: 'type' },
          { from: 'type', to: 'syntax' },
          { from: 'type', to: 'runtime' },
          { from: 'type', to: 'logic' },
          { from: 'syntax', to: 'code' },
          { from: 'runtime', to: 'data' },
          { from: 'logic', to: 'logic_fix' },
        ],
      },
    },
    {
      type: 'info',
      title: 'Category 1: Syntax errors',
      body: "Syntax errors mean the code can't even be parsed. Missing brackets, typos, bad imports. These are the easiest — the error message usually points to the exact character. The fix is mechanical: read the message, go to the line, fix the typo.",
    },
    {
      type: 'code-demo',
      title: 'Syntax error example',
      body: 'The parser tells you exactly where the problem is. Line 3, unexpected token.',
      language: 'text',
      filename: 'terminal output',
      code: "SyntaxError: Unexpected token '}' at line 3\n\nfunction greet(name: string) {\n  console.log('Hello, ' + name)\n}} // <-- extra closing brace",
    },
    {
      type: 'info',
      title: 'Category 2: Runtime errors',
      body: "Runtime errors happen when the code is valid syntax but fails during execution. Null references, type mismatches, missing files. The code parsed fine but hit bad data or an unexpected state. These require checking what data actually was at the point of failure.",
    },
    {
      type: 'info',
      title: 'Category 3: Logic errors',
      body: "Logic errors are the hardest. The code runs without crashing but produces wrong results. No error message at all. A function returns 0 instead of 100. A filter removes the wrong items. These require understanding intent vs. behavior — and they're where AI agents can help most by tracing through the logic.",
    },
    {
      type: 'multiple-choice',
      question: 'Your app renders but shows 0 items instead of 50. What type of error is this?',
      options: [
        'Syntax error — the code has a typo',
        'Runtime error — something crashed',
        'Logic error — wrong behavior, no crash',
        'Not an error — 0 items is correct',
      ],
      correctIndex: 2,
      explanation: "No crash, no error message, but wrong output. This is a logic error — the hardest kind to debug because there's nothing to read. You have to compare expected vs. actual behavior.",
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'Error categories locked in!',
    },

    // === CLASSIFY REAL ERRORS ===
    {
      type: 'order',
      instruction: 'Put these debugging steps in the correct order:',
      items: [
        'Read the full error message',
        'Identify the error type and category',
        'Go to the file and line number',
        'Form a hypothesis about the cause',
        'Make ONE change and test',
      ],
      correctOrder: [0, 1, 2, 3, 4],
    },
    {
      type: 'code-input',
      instruction: 'You see: TypeError: Cannot read properties of null (reading \'name\'). What value is the variable holding instead of an object?',
      placeholder: 'The variable is ____',
      answer: 'null',
      hint: 'The error says "of null" — what does the variable contain?',
    },

    // === PROMPTING AGENTS FOR DEBUGGING ===
    {
      type: 'info',
      title: 'The wrong way to ask an agent for help',
      body: "\"It doesn't work\" is the most common thing developers type into AI chats. It's also the most useless. The agent has zero information. It will guess. It might suggest five different fixes, none of which match your actual problem. You waste time trying each one.",
    },
    {
      type: 'code-demo',
      title: 'Anti-pattern: vague debugging prompts',
      body: 'These prompts force the agent to guess. Every guess wastes your time.',
      language: 'text',
      filename: 'bad-prompts.txt',
      code: "Bad:  \"My app doesn't work\"\nBad:  \"I'm getting an error in my React component\"\nBad:  \"The data isn't showing up\"\nBad:  \"Something broke after I updated\"",
    },
    {
      type: 'code-demo',
      title: 'Pattern: paste the EXACT error',
      body: 'Give the agent the full error, the file, and what you expected. Now it can trace the root cause instead of guessing.',
      language: 'text',
      filename: 'good-prompt.txt',
      code: "Good prompt:\n\n\"I'm getting this error when the Dashboard loads:\n\nTypeError: Cannot read properties of undefined (reading 'map')\n  at renderList (src/components/UserList.tsx:12:18)\n  at Dashboard (src/pages/Dashboard.tsx:45:5)\n\nThe `users` prop is fetched in Dashboard from /api/users.\nI expect an array but it seems to be undefined on first render.\nWhat's the root cause and how should I fix it?\"",
    },
    {
      type: 'multiple-choice',
      question: 'What should you ALWAYS include when asking an agent to debug an error?',
      options: [
        'A description of what you were trying to do',
        'The exact error message and stack trace',
        'Your entire source code',
        'Screenshots of your terminal',
      ],
      correctIndex: 1,
      explanation: 'The exact error message and stack trace give the agent everything it needs to trace the root cause. Descriptions of intent are helpful context, but the error itself is mandatory.',
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'Agent debugging unlocked!',
    },

    // === THE 3-STEP DEBUG LOOP ===
    {
      type: 'info',
      title: 'The 3-step debug loop',
      body: "Every experienced debugger follows the same loop, whether they realize it or not: Read the error, form a hypothesis, verify with one change. Not two changes. Not five. One. If it doesn't fix it, you learned something — update your hypothesis and loop again. This is how agents should work too.",
    },
    {
      type: 'code-demo',
      title: 'The debug loop in practice',
      body: 'One change per cycle. Each cycle either fixes the bug or narrows the cause.',
      language: 'typescript',
      filename: 'debug-loop.ts',
      code: "// Step 1: READ — the error says 'users' is undefined at line 12\n// Step 2: HYPOTHESIZE — the API call hasn't resolved before render\n// Step 3: VERIFY — add a guard clause and test\n\n// Before (crashes):\nfunction UserList({ users }: Props) {\n  return users.map(u => <li>{u.name}</li>)\n}\n\n// After (one change — guard clause):\nfunction UserList({ users }: Props) {\n  if (!users) return <p>Loading...</p>\n  return users.map(u => <li>{u.name}</li>)\n}",
    },

    // === ROOT CAUSE VS SYMPTOMS ===
    {
      type: 'info',
      title: 'Fix root causes, not symptoms',
      body: "The guard clause above stops the crash — but it's a symptom fix. The root cause might be that the API call isn't being awaited, or the parent component passes the wrong prop name. Ask the agent to investigate WHY users is undefined, not just how to stop the crash. Symptom fixes accumulate into fragile code.",
    },
    {
      type: 'terminal',
      instruction: 'Use Claude Code to investigate a root cause. Ask it to trace where data originates:',
      expectedCommand: 'claude "Trace where the users prop in UserList.tsx gets its data. Start from the API call and follow it through every component to find where it becomes undefined."',
      hint: 'claude "Trace where the users prop..."',
    },
    {
      type: 'code-input',
      instruction: 'An agent suggests adding `|| []` to fix "Cannot read properties of undefined". Is this a root cause fix or a symptom fix?',
      placeholder: 'This is a _______ fix',
      answer: 'symptom',
      hint: 'Does it address WHY the value is undefined, or just prevent the crash?',
    },

    // === PRACTICE: CLASSIFY ERRORS ===
    {
      type: 'multiple-choice',
      question: 'You see: "Module not found: Can\'t resolve \'./Userlist\'" but the file is named UserList.tsx. What type of error is this?',
      options: [
        'Runtime error — the module crashes on import',
        'Logic error — wrong behavior',
        'Syntax error — the import path has a typo (case mismatch)',
        'Network error — the file failed to download',
      ],
      correctIndex: 2,
      explanation: "It's a syntax-level error — the import path 'Userlist' doesn't match the filename 'UserList' (capital L). On case-sensitive file systems (Linux, CI), this breaks the build.",
    },
    {
      type: 'checklist',
      title: 'Your debugging protocol — use this every time:',
      items: [
        'Read the FULL error message before doing anything',
        'Identify the error type (syntax, runtime, or logic)',
        'Go to the file and line number from the stack trace',
        'Form ONE hypothesis about the cause',
        'Make ONE change to test your hypothesis',
        'If pasting to an agent, include the exact error + stack trace',
        'Ask whether the fix addresses root cause or symptom',
      ],
    },
    {
      type: 'checkpoint',
      xp: 10,
      message: 'Error-First Debugging complete! You now debug systematically, not randomly.',
    },
  ],
}

export default content
