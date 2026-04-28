import type { LessonContent } from './types'

const content: LessonContent = {
  lessonId: '1-1',
  steps: [
    // === INTRO ===
    {
      type: 'info',
      title: 'What happens when you hit Enter?',
      body: "You type a prompt. A response appears. But between those two moments, a cascade of math transforms your words into numbers, weighs every word against every other word, and predicts the next token one at a time. Understanding this pipeline is the difference between guessing at prompts and engineering them.",
    },
    {
      type: 'info',
      title: 'Why this matters for directing agents',
      body: "AI agents are built on language models. When your agent misunderstands an instruction, hallucinates a file path, or loses context halfway through a task, the root cause is almost always in how the model processes text. This lesson gives you the mental model to diagnose those failures instead of just retrying.",
    },

    // === TOKENIZATION ===
    {
      type: 'info',
      title: 'Tokens: the atoms of AI',
      body: "Models don't read words -- they read tokens. A token is a chunk of text, usually a word piece, not a whole word. The word \"tokenization\" becomes two tokens: \"token\" and \"ization\". Common words like \"the\" are single tokens. Rare words get split into more pieces. Spaces and punctuation are tokens too.",
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
      title: 'Token count affects cost and limits',
      body: "Every API call is billed per token -- both input and output. Models also have a context window measured in tokens (e.g., 200K tokens for Claude). A rough rule: 1 token is about 4 characters in English, or roughly 3/4 of a word.",
      language: 'text',
      code: 'Prompt: "Explain recursion in Python"  →  ~5 tokens\nPrompt: "Explain recursion in Python with 3 examples, edge cases, and performance analysis"  →  ~16 tokens\n\nMore tokens in = higher cost + less room for the response',
    },
    {
      type: 'terminal',
      instruction: 'Use Claude Code to count the tokens in a short phrase. Type this command:',
      expectedCommand: 'echo "Hello world" | claude --print-tokens',
      hint: 'Pipe text into claude with the --print-tokens flag',
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'You understand tokenization!',
    },

    // === EMBEDDINGS ===
    {
      type: 'info',
      title: 'Embeddings: meaning as coordinates',
      body: "Once text is tokenized, each token gets converted into an embedding -- a long list of numbers (a vector) that represents its meaning. Think of it as GPS coordinates in \"meaning space.\" Words with similar meanings land near each other: \"dog\" is close to \"puppy\" but far from \"algebra.\" This is how the model understands that synonyms are related without anyone explicitly programming that.",
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
      type: 'diagram',
      title: 'From Prompt to Response',
      body: 'This is the full pipeline that runs every time you send a message. Each stage transforms the data into a form the next stage needs.',
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
    },

    // === ATTENTION ===
    {
      type: 'info',
      title: 'Attention: the model\'s spotlight',
      body: "Attention is the mechanism that lets the model decide which parts of the input matter most for generating each word of the output. When you write \"The cat sat on the mat because it was tired,\" the model uses attention to figure out that \"it\" refers to \"cat,\" not \"mat.\" It does this by computing a relevance score between every pair of tokens. High-scoring pairs influence each other more.",
    },
    {
      type: 'code-demo',
      title: 'Attention in practice',
      body: "Attention is why prompt structure matters. The model weighs every token against every other token. Putting the most important instruction last (closer to where generation begins) often gets better results.",
      language: 'text',
      code: '# Weaker — key instruction buried in the middle:\n"Write a function that sorts a list. Make it Python. Use type hints. Return only code."\n\n# Stronger — key instruction at the end:\n"Write a Python function with type hints that sorts a list. Return only code."',
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
      message: 'Attention mechanism understood!',
    },

    // === TEMPERATURE ===
    {
      type: 'info',
      title: 'Temperature: controlling randomness',
      body: "After attention, the model produces a probability distribution over all possible next tokens. Temperature controls how that distribution is sampled. At temperature 0, the model always picks the highest-probability token (deterministic). At temperature 1, it samples proportionally (creative). Above 1, outputs become increasingly random and chaotic. For agent tasks, lower temperature (0-0.3) is almost always better -- you want reliability, not creativity.",
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
      title: 'When models hallucinate',
      body: "Hallucination happens when a model generates confident-sounding text that is factually wrong. It occurs because the model is always predicting the most probable next token -- it has no concept of truth, only probability. Three common triggers: (1) the topic is outside training data, (2) the prompt is ambiguous, letting the model fill in gaps with plausible-but-wrong details, (3) leading questions that bias the model toward a specific (incorrect) answer.",
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
      message: 'You can predict when models fail!',
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
