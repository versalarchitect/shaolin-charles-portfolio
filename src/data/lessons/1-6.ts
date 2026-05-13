import type { LessonContent } from './types'

const content: LessonContent = {
  lessonId: '1-6',
  steps: [
    // === INTRODUCTION ===
    {
      type: 'info',
      title: 'Principle 3: Read the error message first',
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
      message: 'Mindset shift: error messages are helpful clues, not scary red text.',
    },

    // === DEBUGGING DECISION TREE DIAGRAM ===
    {
      type: 'interactive-diagram',
      title: 'Debugging Decision Tree',
      body: 'Click through each stage to follow the systematic debugging path.',
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
      stages: [
        {
          highlightNodes: ['err'],
          highlightEdges: [],
          explanation: 'An error occurs. Something is red in your terminal or browser console. Resist the urge to start changing code immediately.',
        },
        {
          highlightNodes: ['err', 'read'],
          highlightEdges: [{ from: 'err', to: 'read' }],
          explanation: 'Read the full error message. Not just the first line — the type, the message, the file path, line number, and stack trace. Parse all four parts before doing anything.',
        },
        {
          highlightNodes: ['read', 'rec'],
          highlightEdges: [{ from: 'read', to: 'rec' }],
          explanation: 'Do you recognize this error? A TypeError about "undefined" means null data. A SyntaxError means broken structure. A ReferenceError means something is missing. Classify it.',
        },
        {
          highlightNodes: ['rec', 'fix'],
          highlightEdges: [{ from: 'rec', to: 'fix' }],
          explanation: 'If you recognize the error, apply the known fix directly. You have seen "Cannot read properties of undefined" before — you know to check if the data loaded before accessing it.',
        },
        {
          highlightNodes: ['rec', 'search'],
          highlightEdges: [{ from: 'rec', to: 'search' }],
          explanation: 'If the error is unfamiliar, search it. Paste the exact message into your agent or a search engine. Include the error type and the key phrase, not the full stack trace.',
        },
        {
          highlightNodes: ['fix', 'search', 'verify'],
          highlightEdges: [{ from: 'fix', to: 'verify' }, { from: 'search', to: 'verify' }],
          explanation: 'Always verify. Make ONE change, then test. Did the error disappear? Did a new one appear? One change per cycle keeps you from introducing new problems while fixing old ones.',
        },
      ],
    },

    // === ERROR ANATOMY ===
    {
      type: 'multiple-choice',
      question: 'Every error message has four parts. Which of these is NOT one of the four parts?',
      options: [
        'The error type (category of problem)',
        'The file and line number (where it happened)',
        'The git commit that introduced the bug',
        'The stack trace (chain of function calls)',
      ],
      correctIndex: 2,
      explanation: 'The four parts are: error type, human-readable message, file/line number, and stack trace. The git commit is not part of the error message — you would need git blame to find that. Training yourself to parse all four parts instantly is the single highest-leverage debugging skill.',
    },
    {
      type: 'code-fill',
      instruction: 'Fill in the four parts of this dissected Node.js error message:',
      language: 'text',
      template: "TypeError: Cannot read properties of undefined (reading 'map')\n    at renderList (/app/src/components/UserList.tsx:12:18)\n    at Object.render (/app/src/pages/Dashboard.tsx:45:5)\n\n┌─ Type:     {{error_type}}\n├─ Message:  Cannot read properties of undefined (reading 'map')\n├─ File:     {{error_file}}, line 12\n└─ Cause:    '{{undefined_var}}' is undefined when .map() is called",
      blanks: [
        { id: 'error_type', answer: 'TypeError', alternatives: ['typeerror', 'type error'], placeholder: 'error category?', hint: 'The first word of the error message — what kind of error is this?' },
        { id: 'error_file', answer: 'src/components/UserList.tsx', alternatives: ['UserList.tsx'], placeholder: 'which file?', hint: 'Look at the top of the stack trace — which file is at line 12?' },
        { id: 'undefined_var', answer: 'users', alternatives: ['user'], placeholder: 'which variable?', hint: 'What is undefined when .map() is called? Think about what you .map() over.' },
      ],
      explanation: 'The type is TypeError. The file is src/components/UserList.tsx at line 12 (top of the stack trace — always start there). The undefined variable is users — you call .map() on an array of users, but it is undefined.',
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
      message: 'You can read error messages like a pro now.',
    },

    // === ERROR CATEGORIES ===
    {
      type: 'interactive-diagram',
      title: 'Error Categories',
      body: 'Click through each stage to learn the three error categories and how to debug each one.',
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
      stages: [
        {
          highlightNodes: ['error', 'type'],
          highlightEdges: [{ from: 'error', to: 'type' }],
          explanation: 'Every error falls into one of three categories. Each requires a different debugging approach. The first step is always to classify the error.',
        },
        {
          highlightNodes: ['type', 'syntax', 'code'],
          highlightEdges: [{ from: 'type', to: 'syntax' }, { from: 'syntax', to: 'code' }],
          explanation: "Syntax errors mean the code can't even be parsed. Missing brackets, typos, bad imports. These are the easiest — the error message usually points to the exact character. The fix is mechanical: read the message, go to the line, fix the typo.",
        },
        {
          highlightNodes: ['type', 'runtime', 'data'],
          highlightEdges: [{ from: 'type', to: 'runtime' }, { from: 'runtime', to: 'data' }],
          explanation: 'Runtime errors happen when the code is valid syntax but fails during execution. Null references, type mismatches, missing files. The code parsed fine but hit bad data or an unexpected state. Check what data actually was at the point of failure.',
        },
        {
          highlightNodes: ['type', 'logic', 'logic_fix'],
          highlightEdges: [{ from: 'type', to: 'logic' }, { from: 'logic', to: 'logic_fix' }],
          explanation: "Logic errors are the hardest. The code runs without crashing but produces wrong results. No error message at all. A function returns 0 instead of 100. These require understanding intent vs. behavior — and they're where AI agents can help most.",
        },
      ],
    },
    {
      type: 'code-fill',
      instruction: 'The parser tells you exactly where the problem is. Fill in what the error message reveals:',
      language: 'text',
      template: "{{error_type}}: Unexpected token '}' at line {{line_num}}\n\nfunction greet(name: string) {\n  console.log('Hello, ' + name)\n}} // <-- {{fix_description}}",
      blanks: [
        { id: 'error_type', answer: 'SyntaxError', alternatives: ['syntaxerror', 'syntax error'], placeholder: 'error type?', hint: 'This error category means the code cannot even be parsed' },
        { id: 'line_num', answer: '3', placeholder: 'which line?', hint: 'Count the lines of the function — which line has the extra brace?' },
        { id: 'fix_description', answer: 'extra closing brace', alternatives: ['extra brace', 'extra }', 'extra bracket'], placeholder: 'what is wrong?', hint: 'There is one too many of something at the end' },
      ],
      explanation: 'A SyntaxError at line 3 caused by an extra closing brace. Syntax errors are mechanical to fix: read the message, go to the line, fix the structural issue.',
    },
    {
      type: 'compare',
      title: 'Runtime errors vs Logic errors',
      body: 'Both happen after the code parses, but they behave very differently.',
      question: 'Which type is harder to debug and why?',
      correctSide: 'right',
      left: {
        label: 'Runtime error',
        content: "// Code crashes during execution\nconst users = null;\nconsole.log(users.length);\n// TypeError: Cannot read properties of null\n\n// You get: error type, message, file, line\n// Strategy: check what data was at the failure point\n// Difficulty: Medium — the error tells you where",
        language: 'typescript',
      },
      right: {
        label: 'Logic error',
        content: "// Code runs fine but produces WRONG results\nfunction discount(price: number) {\n  return price * 1.1; // BUG: adds 10% instead\n}\ndiscount(100); // Returns 110, should be 90\n\n// You get: NO error message, no crash\n// Strategy: compare expected vs actual behavior\n// Difficulty: Hard — nothing tells you where to look",
        language: 'typescript',
      },
      explanation: 'Runtime errors crash with a message pointing you to the problem. Logic errors are silent — the code runs but produces wrong output. You must compare expected vs actual behavior, which is why AI agents are most helpful here: they can trace through logic step by step.',
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
      message: 'You know the three types of errors. That is half the battle.',
    },
    {
      type: 'match',
      instruction: 'Match each error type to the correct investigation approach:',
      leftItems: ['SyntaxError', 'TypeError', 'ReferenceError', 'Logic error'],
      rightItems: ['Check for typos, missing brackets, or invalid syntax', 'Check data types — is a value null, undefined, or the wrong shape?', 'Check if the variable or import exists in this scope', 'Check expected vs actual output — the code runs but produces wrong results'],
      correctPairs: { 0: 0, 1: 1, 2: 2, 3: 3 },
      explanation: 'Each error type points to a different root cause. Syntax errors are structural, type errors are about data shape, reference errors are about scope, and logic errors require comparing expected vs actual behavior.',
    },
    {
      type: 'compare',
      title: 'Symptom fix vs root cause fix',
      body: 'When an agent encounters an error, it might fix the symptom instead of the cause.',
      question: 'Which fix actually solves the problem?',
      correctSide: 'right',
      left: {
        label: 'Symptom fix',
        content: '// "TypeError: Cannot read property name of null"\n\n// Fix: wrap everything in try-catch\ntry {\n  const name = user.name\n  displayGreeting(name)\n} catch (e) {\n  // silently ignore\n}',
        language: 'typescript',
      },
      right: {
        label: 'Root cause fix',
        content: '// "TypeError: Cannot read property name of null"\n\n// Fix: handle the null user case\nif (!user) {\n  redirect("/login")\n  return\n}\nconst name = user.name\ndisplayGreeting(name)',
        language: 'typescript',
      },
      explanation: 'The symptom fix hides the error with a try-catch, but the user still sees a broken page. The root cause fix addresses WHY user is null and handles it properly.',
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
      type: 'compare',
      title: 'Vague vs precise debugging prompts',
      body: "How you ask an agent for help determines whether it solves your problem or wastes your time guessing.",
      question: 'Which prompt will get a useful answer from the agent?',
      correctSide: 'right',
      left: {
        label: 'Vague (agent guesses)',
        content: "\"My app doesn't work\"\n\"I'm getting an error in my React component\"\n\"The data isn't showing up\"\n\"Something broke after I updated\"\n\n→ Agent has zero information\n→ Suggests 5 different fixes\n→ None match your actual problem\n→ You waste time trying each one",
        language: 'text',
      },
      right: {
        label: 'Precise (agent traces)',
        content: "\"I'm getting this error when Dashboard loads:\n\nTypeError: Cannot read properties of\n  undefined (reading 'map')\n  at renderList (UserList.tsx:12:18)\n  at Dashboard (Dashboard.tsx:45:5)\n\nThe users prop is fetched from /api/users.\nI expect an array but it's undefined on\nfirst render. What's the root cause?\"",
        language: 'text',
      },
      explanation: "The vague prompts force the agent to guess. The precise prompt includes the exact error, stack trace, file names, and expected behavior — everything the agent needs to trace the root cause directly. Always include the exact error message and stack trace.",
    },
    {
      type: 'code-fill',
      instruction: 'Complete this debugging prompt to give the agent everything it needs:',
      language: 'text',
      template: "\"I'm getting this error when the {{page_name}} loads:\n\n{{error_type}}: Cannot read properties of undefined (reading 'map')\n  at renderList (src/components/UserList.tsx:12:18)\n\nThe `users` prop is fetched from {{data_source}}.\nWhat's the root cause?\"",
      blanks: [
        { id: 'page_name', answer: 'Dashboard', alternatives: ['dashboard'], placeholder: 'which page?', hint: 'Look at the stack trace — which page component calls renderList?' },
        { id: 'error_type', answer: 'TypeError', alternatives: ['typeerror'], placeholder: 'error category?', hint: 'Accessing a property of undefined is what type of error?' },
        { id: 'data_source', answer: '/api/users', alternatives: ['api/users', 'the API', 'an API'], placeholder: 'where from?', hint: 'Where does the users data originate? Think about the data source.' },
      ],
      explanation: 'A precise debugging prompt includes: the page where it happens (Dashboard), the error type (TypeError), and the data source (/api/users). This gives the agent full context to trace the issue from source to symptom.',
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
      message: 'You know how to ask AI for debugging help the right way.',
    },

    // === THE 3-STEP DEBUG LOOP ===
    {
      type: 'multiple-choice',
      question: 'The 3-step debug loop is: Read the error, form a hypothesis, verify with ___ change(s). How many changes per cycle?',
      options: [
        'As many as needed to fix the bug',
        'Two — one to fix and one to test',
        'One — a single change per cycle',
        'Five — try multiple approaches at once',
      ],
      correctIndex: 2,
      explanation: "Every experienced debugger follows the same loop: Read, Hypothesize, Verify with ONE change. Not two. Not five. One. If it doesn't fix the bug, you learned something — update your hypothesis and loop again. Multiple changes at once make it impossible to know which one helped.",
    },
    {
      type: 'code-fill',
      instruction: 'Apply the 3-step debug loop to fix a crashing component. Fill in the guard clause:',
      language: 'typescript',
      template: "// Step 1: READ — error says 'users' is undefined at line 12\n// Step 2: HYPOTHESIZE — API hasn't resolved before render\n// Step 3: VERIFY — add a guard clause and test\n\nfunction UserList({ users }: Props) {\n  if ({{guard_check}}) return <p>{{fallback_text}}</p>\n  return users.{{array_method}}(u => <li>{u.name}</li>)\n}",
      blanks: [
        { id: 'guard_check', answer: '!users', alternatives: ['!users', 'users === undefined', 'users == null'], placeholder: 'null check?', hint: 'Check if users is falsy — what operator negates a value?' },
        { id: 'fallback_text', answer: 'Loading...', alternatives: ['Loading', 'loading...', 'loading'], placeholder: 'show what?', hint: 'What do you show the user while data is being fetched?' },
        { id: 'array_method', answer: 'map', placeholder: 'which method?', hint: 'The method that transforms each element in an array' },
      ],
      explanation: 'The guard clause checks !users before calling .map(). If users is undefined, it shows a Loading message. This is ONE change that either fixes the crash or tells you the problem is elsewhere.',
    },

    // === ROOT CAUSE VS SYMPTOMS ===
    {
      type: 'multiple-choice',
      question: 'The guard clause above stops the crash. But is it a root cause fix or a symptom fix?',
      options: [
        'Root cause fix — it solves why users is undefined',
        'Symptom fix — it hides the crash but the data is still missing',
        'Both — it fixes the root cause and the symptom',
        'Neither — guard clauses are unrelated to debugging',
      ],
      correctIndex: 1,
      explanation: "The guard clause stops the crash but doesn't fix WHY users is undefined. The root cause might be an un-awaited API call or a wrong prop name. Ask the agent to investigate WHY the data is missing, not just how to stop the crash. Symptom fixes accumulate into fragile code.",
    },
    {
      type: 'terminal',
      instruction: 'Ask Claude Code to trace the problem back to its source. Paste this command — it tells the AI to follow the data from start to finish:',
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
      message: 'Error-First Debugging complete! You now approach problems systematically instead of guessing.',
    },
  ],
}

export default content
