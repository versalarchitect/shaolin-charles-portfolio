import type { LessonContent } from './types'

const content: LessonContent = {
  lessonId: '1-1',
  steps: [
    // === INTRO ===
    {
      type: 'info',
      title: 'What happens when you hit Enter?',
      body: "You type a message to an AI. A response appears. But between those two moments, a lot happens behind the scenes. The AI breaks your words into pieces, converts them into numbers, figures out which words matter most, and predicts its response one word at a time. Understanding this process helps you write better instructions and get better results.",
    },
    {
      type: 'info',
      title: 'Why this matters for directing agents',
      body: "AI agents are built on language models. When your agent misunderstands an instruction, makes something up, or forgets what you asked for halfway through a task, the cause is usually in how the AI processes text. This lesson gives you a simple mental model to understand why those problems happen — so you can fix them instead of just trying again.",
    },

    // === TOKENIZATION ===
    {
      type: 'info',
      title: 'Tokens: how AI reads your words',
      body: "AI does not read words the way you do. It reads \"tokens\" — small chunks of text. A common word like \"the\" is one token. A longer word like \"tokenization\" gets split into two pieces: \"token\" and \"ization\". Even spaces and punctuation count as tokens. Why does this matter? Because AI charges per token, and there is a limit to how many tokens it can handle at once.",
    },
    {
      type: 'multiple-choice',
      question: 'How would a typical tokenizer split the word "unhappiness"?',
      options: [
        'One token: "unhappiness"',
        'Two tokens: "unhappy" + "ness"',
        'Three tokens: "un" + "happi" + "ness"',
        'Eleven tokens: one per character',
      ],
      correctIndex: 2,
      explanation: 'Tokenizers split words into learned subword pieces. Common prefixes ("un"), stems ("happi"), and suffixes ("ness") each become separate tokens. This lets the model handle words it has never seen as a whole by understanding their parts.',
    },
    {
      type: 'code-demo',
      title: 'Tokens affect cost and limits',
      body: "Every AI request costs money based on how many tokens are used — both what you send and what the AI sends back. AI also has a memory limit measured in tokens (Claude can hold about 200,000 tokens at once). A simple rule of thumb: 1 token is about 4 characters in English, or roughly 3/4 of a word.",
      language: 'text',
      code: 'Prompt: "Explain recursion in Python"  →  ~5 tokens\nPrompt: "Explain recursion in Python with 3 examples, edge cases, and performance analysis"  →  ~16 tokens\n\nMore tokens in = higher cost + less room for the response',
    },
    {
      type: 'terminal',
      instruction: 'Try this: send a short phrase to Claude Code and ask it to count the tokens. Paste this command in your terminal:',
      expectedCommand: 'echo "Hello world" | claude --print-tokens',
      hint: 'Pipe text into claude with the --print-tokens flag',
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'You understand how AI reads text. That is a real advantage.',
    },

    // === EMBEDDINGS ===
    {
      type: 'info',
      title: 'Embeddings: how AI understands meaning',
      body: "After breaking text into tokens, the AI converts each token into a list of numbers that represents its meaning. Think of it like GPS coordinates, but for meaning instead of location. Words with similar meanings land near each other: \"dog\" is close to \"puppy\" but far from \"algebra.\" This is how AI understands that similar words are related — nobody had to teach it every synonym.",
    },
    {
      type: 'multiple-choice',
      question: 'In embedding space, which pair of words would be closest together?',
      options: [
        '"cat" and "calendar"',
        '"run" and "sprint"',
        '"blue" and "recursion"',
        '"Python" and "Tuesday"',
      ],
      correctIndex: 1,
      explanation: '"Run" and "sprint" share similar meaning so their embedding vectors point in nearly the same direction. Embeddings capture semantic similarity, not spelling or length.',
    },

    // === DIAGRAM 1: THE PIPELINE ===
    {
      type: 'interactive-diagram',
      title: 'From Prompt to Response',
      body: 'Click through each stage to see how your message transforms into a response.',
      diagram: {
        direction: 'LR',
        nodes: [
          { id: 'prompt', label: 'Prompt', shape: 'pill' },
          { id: 'tokenize', label: 'Tokenize', sublabel: 'Text to IDs' },
          { id: 'embed', label: 'Embed', sublabel: 'IDs to vectors' },
          { id: 'attend', label: 'Attend', sublabel: 'Weigh context', shape: 'rounded', highlight: true },
          { id: 'generate', label: 'Generate', sublabel: 'Predict next' },
          { id: 'response', label: 'Response', shape: 'pill', highlight: true },
        ],
        edges: [
          { from: 'prompt', to: 'tokenize' },
          { from: 'tokenize', to: 'embed' },
          { from: 'embed', to: 'attend' },
          { from: 'attend', to: 'generate' },
          { from: 'generate', to: 'response' },
        ],
      },
      stages: [
        {
          highlightNodes: ['prompt'],
          highlightEdges: [],
          explanation: 'It starts with your text. The raw characters you type — "Explain recursion in Python" — enter the pipeline as a string.',
        },
        {
          highlightNodes: ['prompt', 'tokenize'],
          highlightEdges: [{ from: 'prompt', to: 'tokenize' }],
          explanation: 'The tokenizer breaks your text into subword pieces. "Explain" → one token. "recursion" → "recur" + "sion". Each token gets a numeric ID.',
        },
        {
          highlightNodes: ['tokenize', 'embed'],
          highlightEdges: [{ from: 'tokenize', to: 'embed' }],
          explanation: 'Each token ID is mapped to a high-dimensional vector (embedding) that captures its meaning. Similar words land near each other in this space.',
        },
        {
          highlightNodes: ['embed', 'attend'],
          highlightEdges: [{ from: 'embed', to: 'attend' }],
          explanation: 'Attention compares every token to every other token, computing relevance scores. This is where the model figures out that "it" refers to "recursion", not "Python".',
        },
        {
          highlightNodes: ['attend', 'generate'],
          highlightEdges: [{ from: 'attend', to: 'generate' }],
          explanation: 'The model predicts the most likely next token based on the attention-weighted context. It picks one token, appends it, and repeats.',
        },
        {
          highlightNodes: ['generate', 'response'],
          highlightEdges: [{ from: 'generate', to: 'response' }],
          explanation: 'Token by token, the full response is assembled. The generation stops when the model produces a special end-of-sequence token.',
        },
      ],
    },

    // === ATTENTION ===
    {
      type: 'info',
      title: 'Attention: how AI decides what matters',
      body: "Attention is how the AI decides which parts of your message are most important for each word it writes back. For example, in \"The cat sat on the mat because it was tired,\" the AI uses attention to figure out that \"it\" refers to \"the cat,\" not \"the mat.\" It compares every word to every other word and gives higher importance to the most relevant pairs.",
    },
    {
      type: 'compare',
      title: 'Attention in practice',
      body: 'Attention is why prompt structure matters. The model weighs every token against every other token. Putting the most important instruction last (closer to where generation begins) often gets better results.',
      question: 'Which prompt structure will produce more reliable output?',
      correctSide: 'right',
      left: {
        label: 'Weaker',
        content: '"Write a function that sorts a list. Make it Python. Use type hints. Return only code."',
        language: 'text',
      },
      right: {
        label: 'Stronger',
        content: '"Write a Python function with type hints that sorts a list. Return only code."',
        language: 'text',
      },
      explanation: 'The stronger version puts the most important constraint ("Return only code") at the end, closest to where generation begins. The model attends most strongly to recent tokens, so the final instruction carries the most weight.',
    },
    {
      type: 'order',
      instruction: 'Order these prompt sections from LEAST attended to MOST attended by the model (for the final output):',
      items: [
        'System prompt (beginning)',
        'Middle of a long conversation',
        'The most recent user message',
        'The last few tokens before generation',
      ],
      correctOrder: [0, 1, 2, 3],
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'You understand how AI focuses on your instructions. Great insight.',
    },

    // === TEMPERATURE ===
    {
      type: 'info',
      title: 'Temperature: controlling how creative vs reliable AI is',
      body: "After figuring out which words to focus on, the AI picks its next word from a list of possibilities. Temperature controls how it chooses. At temperature 0, it always picks the most likely word — very predictable and reliable. At temperature 1, it mixes in more variety — more creative but less predictable. For business tasks where you need reliable results, lower temperature is almost always better.",
    },
    {
      type: 'multiple-choice',
      question: 'You\'re using an AI agent to refactor production code. What temperature should you use?',
      options: [
        '0 -- completely deterministic',
        '0.2 -- mostly deterministic with slight variation',
        '0.7 -- balanced creativity',
        '1.5 -- maximum creativity',
      ],
      correctIndex: 0,
      explanation: 'For code refactoring, you want the most predictable, reliable output. Temperature 0 ensures the model always picks the highest-probability (most likely correct) token. Creativity is a liability when modifying production code.',
    },

    // === HALLUCINATION ===
    {
      type: 'info',
      title: 'When AI makes things up (hallucination)',
      body: "Sometimes AI writes something that sounds confident but is factually wrong. This is called hallucination. It happens because AI is always guessing the most likely next word — it does not actually know what is true. Three things trigger hallucinations: (1) you ask about something it was not trained on, (2) your instructions are vague, so it fills in the blanks with plausible-but-wrong details, (3) you ask a leading question that steers it toward a wrong answer.",
    },
    {
      type: 'diagram',
      title: 'When Models Hallucinate',
      body: 'The model\'s reliability depends on whether the input falls within its training distribution. Ambiguous prompts increase risk even for known topics.',
      diagram: {
        direction: 'TB',
        nodes: [
          { id: 'input', label: 'Input', sublabel: 'Your prompt', shape: 'rounded', highlight: true },
          { id: 'trained', label: 'Has Training\nData?', shape: 'diamond' },
          { id: 'ambiguous', label: 'Ambiguous?', shape: 'diamond' },
          { id: 'reliable', label: 'Reliable', sublabel: 'High confidence', shape: 'pill', highlight: true },
          { id: 'risky', label: 'Risky', sublabel: 'May hallucinate', shape: 'pill' },
          { id: 'hallucinate', label: 'Hallucination', sublabel: 'Likely wrong', shape: 'pill' },
        ],
        edges: [
          { from: 'input', to: 'trained' },
          { from: 'trained', to: 'ambiguous', label: 'Yes' },
          { from: 'trained', to: 'hallucinate', label: 'No' },
          { from: 'ambiguous', to: 'reliable', label: 'No' },
          { from: 'ambiguous', to: 'risky', label: 'Yes', dashed: true },
        ],
      },
    },
    {
      type: 'code-demo',
      title: 'Spotting hallucination risk',
      body: "Learn to recognize prompts that are likely to produce hallucinations. The fix is usually to add constraints, provide reference material, or ask the model to say \"I don't know\" when uncertain.",
      language: 'text',
      code: '# High hallucination risk:\n"What did the CEO of Acme Corp say in their Q3 2025 earnings call?"\n→ Model may invent quotes it has never seen\n\n# Lower risk — grounded prompt:\n"Based on the following transcript [paste text], summarize what the CEO said about revenue."\n→ Model works from provided context, not memory',
    },
    {
      type: 'multiple-choice',
      question: 'Which prompt is MOST likely to cause a hallucination?',
      options: [
        '"Summarize this document: [full text pasted]"',
        '"What is 2 + 2?"',
        '"List all CVEs published for libfoo in March 2026"',
        '"Translate \'hello\' to French"',
      ],
      correctIndex: 2,
      explanation: 'Asking about specific CVEs from a date that may be beyond the model\'s training data is a classic hallucination trigger. The model will likely invent plausible-looking CVE numbers rather than admitting it doesn\'t know.',
    },

    // === PRACTICAL APPLICATION ===
    {
      type: 'code-input',
      instruction: 'You\'re writing a prompt and want the model to acknowledge uncertainty instead of guessing. Complete this system instruction:',
      placeholder: 'If you are not sure, say "______"',
      answer: 'I don\'t know',
      hint: 'Tell the model what to say when it lacks confidence',
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'You can now spot when AI might get things wrong. That is a superpower.',
    },

    // === PUTTING IT TOGETHER ===
    {
      type: 'checklist',
      title: 'Key mental models to keep',
      items: [
        'Tokens are word pieces, not words -- "tokenization" is 2 tokens',
        'Embeddings place meaning in geometric space -- similar concepts cluster together',
        'Attention weighs every token against every other -- position and structure matter',
        'Temperature 0 for reliability, higher for creativity',
        'Hallucinations come from gaps in training data, ambiguous prompts, or leading questions',
        'Ground prompts with context to reduce hallucination risk',
      ],
    },
    {
      type: 'terminal',
      instruction: 'Test your understanding. Ask Claude to explain what happens to your prompt internally:',
      expectedCommand: 'claude "Explain step by step what happens to my prompt before you generate a response"',
      hint: 'Use the claude CLI to ask about its own processing pipeline',
    },
    {
      type: 'checkpoint',
      xp: 6,
      message: 'Lesson complete! You now understand what happens between prompt and response.',
    },
  ],
}

export default content
