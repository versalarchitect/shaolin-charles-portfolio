export interface DiscussionThread {
  id: string
  title: string
  author: string
  authorInitial: string
  tier: string
  replies: number
  lastActivity: string
  isPinned: boolean
  category: string
  preview: string
  content: string
}

export interface Reply {
  id: string
  threadId: string
  author: string
  authorInitial: string
  tier: string
  content: string
  timeAgo: string
  likes: number
}

export interface Announcement {
  id: string
  title: string
  content: string
  timeAgo: string
  type: 'update' | 'recording' | 'info'
}

export interface MemberSpotlight {
  id: string
  name: string
  tier: string
  streak: number
  xp: number
  quote: string
  initial: string
}

export const threads: DiscussionThread[] = [
  {
    id: 'welcome',
    title: 'Welcome & Introductions',
    author: 'Charles Jackson',
    authorInitial: 'CJ',
    tier: 'Instructor',
    replies: 34,
    lastActivity: '2h ago',
    isPinned: true,
    category: 'general',
    preview:
      "New here? Drop a quick intro — what you're building, what tier you're on, and one thing you want to ship this month.",
    content:
      "Welcome to the Agentic SaaS community! 🎉\n\nNew here? Drop a quick intro — what you're building, what tier you're on, and one thing you want to ship this month.\n\nThis is your space to connect with fellow builders, ask questions, share wins, and get feedback. A few things to keep in mind:\n\n• Be specific when asking questions — include what you've tried\n• Share your work early and often — feedback is how we grow\n• Help others when you can — teaching solidifies understanding\n\nLooking forward to seeing what you all build.",
  },
  {
    id: 'study-group',
    title: 'Tier 1 Study Group — Weekly Check-ins',
    author: 'Sarah K.',
    authorInitial: 'SK',
    tier: 'Tier 1',
    replies: 21,
    lastActivity: '4h ago',
    isPinned: true,
    category: 'study-group',
    preview:
      'Every Monday we sync on progress. Post your blockers and wins from the week.',
    content:
      "Hey Tier 1 crew! 👋\n\nEvery Monday we sync on progress. Post your blockers and wins from the week. Format:\n\n**Wins:**\n- What did you accomplish?\n- What clicked for you?\n\n**Blockers:**\n- Where are you stuck?\n- What concepts need more clarity?\n\n**This week's goal:**\n- One concrete thing you'll ship by next Monday\n\nLet's keep each other accountable!",
  },
  {
    id: 'mcp-config',
    title: 'Struggling with MCP server configuration',
    author: 'Devin R.',
    authorInitial: 'DR',
    tier: 'Tier 1',
    replies: 12,
    lastActivity: '6h ago',
    isPinned: false,
    category: 'help',
    preview:
      'Getting a connection timeout when trying to register my first MCP tool. Running Node 22 on Mac.',
    content:
      'Getting a connection timeout when trying to register my first MCP tool. Running Node 22 on Mac.\n\nHere\'s what I\'ve tried:\n- Verified the server is running on port 3001\n- Checked that the tool schema matches the expected format\n- Tried both stdio and HTTP transport\n\nThe error I\'m seeing:\n```\nConnectionError: Timeout after 30000ms waiting for server response\n```\n\nMy config looks like:\n```json\n{\n  "mcpServers": {\n    "my-tool": {\n      "command": "node",\n      "args": ["server.js"],\n      "env": { "PORT": "3001" }\n    }\n  }\n}\n```\n\nAnyone else hit this? Am I missing something obvious?',
  },
  {
    id: 'capstone-feedback',
    title: 'My Tier 2 capstone — feedback wanted',
    author: 'Amara T.',
    authorInitial: 'AT',
    tier: 'Tier 2',
    replies: 8,
    lastActivity: '1d ago',
    isPinned: false,
    category: 'showcase',
    preview:
      'Built an AI-powered invoice processor. Looking for feedback on my agent orchestration pattern.',
    content:
      "Built an AI-powered invoice processor for my Tier 2 capstone. Looking for feedback on my agent orchestration pattern.\n\nThe system uses three agents:\n1. **Extraction Agent** — Parses invoice PDFs and extracts structured data\n2. **Validation Agent** — Cross-references extracted data against vendor database\n3. **Routing Agent** — Determines approval workflow based on amount and department\n\nI'm using a fan-out pattern where the extraction agent spawns validation and routing in parallel once extraction is complete.\n\nQuestions:\n- Is parallel validation + routing the right call, or should routing wait for validation?\n- How would you handle partial extraction failures?\n- Any thoughts on the retry strategy for the PDF parsing step?\n\nRepo link is in my profile. Would love any feedback!",
  },
  {
    id: 'parallel-agents',
    title: 'Best practices for parallel agent workflows',
    author: 'James L.',
    authorInitial: 'JL',
    tier: 'Tier 3',
    replies: 15,
    lastActivity: '1d ago',
    isPinned: false,
    category: 'discussion',
    preview:
      "When do you parallelize vs. chain agents? I've been experimenting with fan-out patterns.",
    content:
      "When do you parallelize vs. chain agents? I've been experimenting with fan-out patterns and wanted to share some observations.\n\n**When to parallelize:**\n- Independent data processing (e.g., analyzing different sections of a document)\n- Multiple API calls that don't depend on each other\n- Validation checks that can run concurrently\n\n**When to chain:**\n- Output of one agent is input to the next\n- Sequential decision-making (triage → route → process)\n- When order matters for consistency\n\n**Gotchas I've hit:**\n- Race conditions when parallel agents write to shared state\n- Cost explosion when fan-out isn't bounded\n- Debugging is harder — need good observability\n\nWhat patterns have you found effective? Curious especially about error handling in fan-out scenarios.",
  },
  {
    id: 'postmortem',
    title: 'Postmortem: My first production incident',
    author: 'Nina W.',
    authorInitial: 'NW',
    tier: 'Tier 3',
    replies: 19,
    lastActivity: '2d ago',
    isPinned: false,
    category: 'showcase',
    preview:
      "An agent went rogue in prod and created 400 duplicate records. Here's what I learned.",
    content:
      "An agent went rogue in prod and created 400 duplicate records. Here's what I learned.\n\n**What happened:**\nMy data-entry agent hit a rate limit on the external API, retried without proper idempotency, and created 400 duplicate customer records in our database.\n\n**Root cause:**\nThe retry logic didn't include idempotency keys. Each retry was treated as a new operation.\n\n**Impact:**\n- 400 duplicate records in production\n- 3 hours of manual cleanup\n- One confused customer who got 4 welcome emails\n\n**What I changed:**\n1. Added idempotency keys to all write operations\n2. Implemented a \"dry run\" mode for testing\n3. Added rate limit detection before retries\n4. Set up alerts for unusual write patterns\n\n**Lesson:** Always assume agents will retry. Make every operation idempotent.\n\nSharing because I think failures teach more than successes. Anyone else have a good incident story?",
  },
  {
    id: 'teardown-tips',
    title: 'Tier 4 teardown methodology tips',
    author: 'Marcus B.',
    authorInitial: 'MB',
    tier: 'Tier 4',
    replies: 7,
    lastActivity: '3d ago',
    isPinned: false,
    category: 'discussion',
    preview:
      'Sharing my approach to tearing down complex agent architectures for analysis.',
    content:
      "Sharing my approach to tearing down complex agent architectures for analysis. This is the methodology I've developed through several Tier 4 exercises.\n\n**Step 1: Map the topology**\nBefore reading any code, diagram every agent and its connections. Tools: Mermaid, Excalidraw.\n\n**Step 2: Trace a single request**\nFollow one request from entry to completion. Note every decision point.\n\n**Step 3: Identify the orchestrator**\nWho decides what runs? Is it a central router or distributed? This tells you everything about the architecture's philosophy.\n\n**Step 4: Find the failure modes**\nWhat happens when each agent fails? Is there a fallback? A circuit breaker? Nothing?\n\n**Step 5: Evaluate the state management**\nWhere does state live? Is it shared? How is consistency maintained?\n\nHappy to do a live teardown in office hours if there's interest.",
  },
  {
    id: 'inngest-patterns',
    title: 'Inngest v3 event-driven patterns — what changed?',
    author: 'Priya S.',
    authorInitial: 'PS',
    tier: 'Tier 3',
    replies: 11,
    lastActivity: '4d ago',
    isPinned: false,
    category: 'help',
    preview:
      "The new step.ai integration in v3 changes how we handle retries. Anyone migrated yet?",
    content:
      "The new step.ai integration in Inngest v3 changes how we handle retries. Anyone migrated yet?\n\nSpecifically, I'm confused about:\n\n1. **step.ai.infer()** vs the old step.run() pattern — when do you use which?\n2. **Automatic retry behavior** — v3 seems to handle retries differently for AI steps\n3. **Cost tracking** — the new built-in cost tracking is nice but I'm not sure how accurate it is\n\nMy current setup:\n- Inngest v2.7 with manual AI step wrappers\n- ~15 functions handling various agent workflows\n- Running on Vercel with Fluid Compute\n\nBefore I migrate everything, wanted to hear from anyone who's already made the switch. Any gotchas?",
  },
]

export const replies: Record<string, Reply[]> = {
  welcome: [
    {
      id: 'w1',
      threadId: 'welcome',
      author: 'Sarah K.',
      authorInitial: 'SK',
      tier: 'Tier 1',
      content:
        "Hi everyone! I'm Sarah, working on a customer support automation tool. Tier 1, just getting started. Goal this month: get my first MCP server running.",
      timeAgo: '1h ago',
      likes: 5,
    },
    {
      id: 'w2',
      threadId: 'welcome',
      author: 'James L.',
      authorInitial: 'JL',
      tier: 'Tier 3',
      content:
        'Welcome Sarah! The MCP lessons are solid — make sure to check out the debugging section, it saved me a lot of time.',
      timeAgo: '1h ago',
      likes: 3,
    },
    {
      id: 'w3',
      threadId: 'welcome',
      author: 'Devin R.',
      authorInitial: 'DR',
      tier: 'Tier 1',
      content:
        "Hey! I'm Devin, building a code review assistant. Also on Tier 1. Excited to be here.",
      timeAgo: '45m ago',
      likes: 4,
    },
    {
      id: 'w4',
      threadId: 'welcome',
      author: 'Nina W.',
      authorInitial: 'NW',
      tier: 'Tier 3',
      content:
        "Welcome to the community! Don't hesitate to ask questions — everyone here is super helpful.",
      timeAgo: '30m ago',
      likes: 2,
    },
  ],
  'study-group': [
    {
      id: 'sg1',
      threadId: 'study-group',
      author: 'Devin R.',
      authorInitial: 'DR',
      tier: 'Tier 1',
      content:
        "**Wins:** Got my first tool registered and working! Simple file reader but it feels great.\n**Blockers:** Still confused about transport protocols — when to use stdio vs HTTP?\n**This week:** Build a multi-tool server.",
      timeAgo: '3h ago',
      likes: 6,
    },
    {
      id: 'sg2',
      threadId: 'study-group',
      author: 'Sarah K.',
      authorInitial: 'SK',
      tier: 'Tier 1',
      content:
        "**Wins:** Finished lessons 1.1–1.4. The principles section really changed my perspective.\n**Blockers:** TypeScript generics in the SDK are tripping me up.\n**This week:** Complete the first hands-on project.",
      timeAgo: '2h ago',
      likes: 4,
    },
    {
      id: 'sg3',
      threadId: 'study-group',
      author: 'Marcus B.',
      authorInitial: 'MB',
      tier: 'Tier 4',
      content:
        'Great progress everyone! For the transport question — use stdio for local dev, HTTP for production deployments. The lesson in 1.6 covers this well.',
      timeAgo: '1h ago',
      likes: 8,
    },
  ],
  'mcp-config': [
    {
      id: 'mc1',
      threadId: 'mcp-config',
      author: 'James L.',
      authorInitial: 'JL',
      tier: 'Tier 3',
      content:
        'I hit the same issue. Try adding `"transport": "stdio"` explicitly in your config. The default changed in the latest version.',
      timeAgo: '5h ago',
      likes: 7,
    },
    {
      id: 'mc2',
      threadId: 'mcp-config',
      author: 'Devin R.',
      authorInitial: 'DR',
      tier: 'Tier 1',
      content:
        "That fixed it! Thank you James. The transport default change wasn't documented anywhere I could find.",
      timeAgo: '4h ago',
      likes: 3,
    },
    {
      id: 'mc3',
      threadId: 'mcp-config',
      author: 'Charles Jackson',
      authorInitial: 'CJ',
      tier: 'Instructor',
      content:
        "Good catch. I'll update the lesson notes to call this out explicitly. The transport default changed in SDK v0.8.",
      timeAgo: '3h ago',
      likes: 12,
    },
    {
      id: 'mc4',
      threadId: 'mcp-config',
      author: 'Priya S.',
      authorInitial: 'PS',
      tier: 'Tier 3',
      content:
        "Another thing to check — make sure your `server.js` file exports a proper MCP server instance. If it's just a bare Node script, the handshake will fail.",
      timeAgo: '2h ago',
      likes: 5,
    },
  ],
  'capstone-feedback': [
    {
      id: 'cf1',
      threadId: 'capstone-feedback',
      author: 'James L.',
      authorInitial: 'JL',
      tier: 'Tier 3',
      content:
        "Nice architecture! I'd suggest routing should wait for validation — you don't want to route an invoice that fails validation. Sequential here makes more sense than parallel.",
      timeAgo: '20h ago',
      likes: 9,
    },
    {
      id: 'cf2',
      threadId: 'capstone-feedback',
      author: 'Nina W.',
      authorInitial: 'NW',
      tier: 'Tier 3',
      content:
        'For partial extraction failures, consider having the extraction agent return a confidence score with each field. Then the validation agent can flag low-confidence fields for human review instead of failing the whole invoice.',
      timeAgo: '18h ago',
      likes: 11,
    },
    {
      id: 'cf3',
      threadId: 'capstone-feedback',
      author: 'Charles Jackson',
      authorInitial: 'CJ',
      tier: 'Instructor',
      content:
        'Great work Amara. The fan-out pattern is solid for the extraction step, but I agree with James — route after validate. Also, for PDF retry, consider exponential backoff with a max of 3 attempts. If extraction fails 3 times, queue for manual review.',
      timeAgo: '16h ago',
      likes: 15,
    },
  ],
  'parallel-agents': [
    {
      id: 'pa1',
      threadId: 'parallel-agents',
      author: 'Nina W.',
      authorInitial: 'NW',
      tier: 'Tier 3',
      content:
        'Great summary. One pattern I\'ve found useful: "parallel with merge." Run agents in parallel but have a dedicated merge step that reconciles their outputs before proceeding. Catches conflicts early.',
      timeAgo: '22h ago',
      likes: 8,
    },
    {
      id: 'pa2',
      threadId: 'parallel-agents',
      author: 'Marcus B.',
      authorInitial: 'MB',
      tier: 'Tier 4',
      content:
        "For error handling in fan-out: use a \"partial success\" model. If 3/5 parallel agents succeed, decide whether that's enough to continue. Not every failure needs to be fatal.",
      timeAgo: '20h ago',
      likes: 14,
    },
    {
      id: 'pa3',
      threadId: 'parallel-agents',
      author: 'Charles Jackson',
      authorInitial: 'CJ',
      tier: 'Instructor',
      content:
        "Key principle: parallelize for performance, serialize for correctness. If the order doesn't matter and the outputs are independent, parallelize. If you're building on previous results, chain. Most real systems are a mix.",
      timeAgo: '18h ago',
      likes: 22,
    },
    {
      id: 'pa4',
      threadId: 'parallel-agents',
      author: 'Priya S.',
      authorInitial: 'PS',
      tier: 'Tier 3',
      content:
        "On observability — I've been using structured logging with correlation IDs that span across parallel agents. Makes it much easier to trace what happened when things go wrong.",
      timeAgo: '12h ago',
      likes: 6,
    },
  ],
  postmortem: [
    {
      id: 'pm1',
      threadId: 'postmortem',
      author: 'James L.',
      authorInitial: 'JL',
      tier: 'Tier 3',
      content:
        "This is exactly the kind of content we need more of. Idempotency is one of those things you don't think about until it bites you. Thanks for sharing.",
      timeAgo: '1d ago',
      likes: 12,
    },
    {
      id: 'pm2',
      threadId: 'postmortem',
      author: 'Marcus B.',
      authorInitial: 'MB',
      tier: 'Tier 4',
      content:
        'The "dry run" mode is a great idea. I\'d also suggest adding a kill switch — a way to immediately halt all agent operations if something goes wrong. Circuit breakers are your friend.',
      timeAgo: '1d ago',
      likes: 16,
    },
    {
      id: 'pm3',
      threadId: 'postmortem',
      author: 'Charles Jackson',
      authorInitial: 'CJ',
      tier: 'Instructor',
      content:
        "Excellent postmortem Nina. This is going in the Tier 3 \"real-world patterns\" section as a case study (with your permission). The idempotency lesson is one every builder needs to internalize.",
      timeAgo: '1d ago',
      likes: 20,
    },
    {
      id: 'pm4',
      threadId: 'postmortem',
      author: 'Amara T.',
      authorInitial: 'AT',
      tier: 'Tier 2',
      content:
        'Wow, this is making me rethink my capstone architecture. I need to add idempotency keys to my invoice processor ASAP.',
      timeAgo: '23h ago',
      likes: 5,
    },
  ],
  'teardown-tips': [
    {
      id: 'tt1',
      threadId: 'teardown-tips',
      author: 'James L.',
      authorInitial: 'JL',
      tier: 'Tier 3',
      content:
        "The \"identify the orchestrator\" step is key. In my experience, that single question reveals 80% of the architecture's design philosophy.",
      timeAgo: '2d ago',
      likes: 9,
    },
    {
      id: 'tt2',
      threadId: 'teardown-tips',
      author: 'Nina W.',
      authorInitial: 'NW',
      tier: 'Tier 3',
      content:
        'Would love a live teardown in office hours! Maybe we could look at an open-source agent system?',
      timeAgo: '2d ago',
      likes: 7,
    },
    {
      id: 'tt3',
      threadId: 'teardown-tips',
      author: 'Charles Jackson',
      authorInitial: 'CJ',
      tier: 'Instructor',
      content:
        "Let's do it. I'll schedule a teardown session for next Thursday. We'll look at a real open-source agent framework.",
      timeAgo: '2d ago',
      likes: 13,
    },
  ],
  'inngest-patterns': [
    {
      id: 'ip1',
      threadId: 'inngest-patterns',
      author: 'Marcus B.',
      authorInitial: 'MB',
      tier: 'Tier 4',
      content:
        "I migrated last month. The biggest gotcha: `step.ai.infer()` doesn't automatically retry on model errors the way `step.run()` does. You need to configure the retry behavior explicitly.",
      timeAgo: '3d ago',
      likes: 11,
    },
    {
      id: 'ip2',
      threadId: 'inngest-patterns',
      author: 'James L.',
      authorInitial: 'JL',
      tier: 'Tier 3',
      content:
        'The cost tracking is pretty accurate in my testing — within 5% of actual API bills. Worth using even if not perfect.',
      timeAgo: '3d ago',
      likes: 6,
    },
    {
      id: 'ip3',
      threadId: 'inngest-patterns',
      author: 'Charles Jackson',
      authorInitial: 'CJ',
      tier: 'Instructor',
      content:
        "I'm updating the Tier 3 Inngest lessons for v3 this week. The migration is worth it — the AI-native primitives are much cleaner. Hold off on migrating until the new lessons drop if you want a guided walkthrough.",
      timeAgo: '2d ago',
      likes: 18,
    },
  ],
}

export const announcements: Announcement[] = [
  {
    id: 'tier3-update',
    title: 'Tier 3 content update: New lesson on Inngest v3',
    content:
      'Lesson 3.8 has been updated with the latest Inngest v3 patterns including the new step.ai integration. Re-watch if you already completed this section.',
    timeAgo: '2 days ago',
    type: 'update',
  },
  {
    id: 'recording',
    title: 'Office hours recording from April 24 now available',
    content:
      'This session covered common Tier 2 capstone blockers, Stripe webhook debugging, and a live teardown of a student project. Link in the course portal.',
    timeAgo: '5 days ago',
    type: 'recording',
  },
  {
    id: 'welcome-guidelines',
    title: 'Welcome to the community! Read the guidelines',
    content:
      'New here? Start by introducing yourself in the Welcome thread. Check the pinned guidelines below before posting. We keep signal high and noise low.',
    timeAgo: '2 weeks ago',
    type: 'info',
  },
]

export const spotlightMembers: MemberSpotlight[] = [
  {
    id: 'james',
    name: 'James L.',
    tier: 'Tier 3',
    streak: 21,
    xp: 4120,
    quote:
      'Shipping my first production incident postmortem felt like a real milestone.',
    initial: 'JL',
  },
  {
    id: 'nina',
    name: 'Nina W.',
    tier: 'Tier 3',
    streak: 9,
    xp: 3580,
    quote:
      'The community feedback on my capstone caught things I never would have seen.',
    initial: 'NW',
  },
  {
    id: 'sarah',
    name: 'Sarah K.',
    tier: 'Tier 2',
    streak: 14,
    xp: 2340,
    quote:
      'The principles-first approach changed how I think about every tool I use.',
    initial: 'SK',
  },
]

export const guidelines = [
  'Be respectful. Critique ideas, not people.',
  'No sharing course content outside the community.',
  'Help each other — teaching is the best way to learn.',
  'Use thread topics. Keep discussions focused.',
  'Share wins and failures. Both are valuable.',
  'Tag your tier so others can give context-appropriate help.',
]

export const categories: Record<string, { label: string; color: string }> = {
  general: {
    label: 'General',
    color: 'text-foreground/50 bg-foreground/[0.06]',
  },
  'study-group': {
    label: 'Study Group',
    color: 'text-blue-400/80 bg-blue-500/10',
  },
  help: { label: 'Help', color: 'text-amber-400/80 bg-amber-500/10' },
  showcase: {
    label: 'Showcase',
    color: 'text-emerald-400/80 bg-emerald-500/10',
  },
  discussion: {
    label: 'Discussion',
    color: 'text-purple-400/80 bg-purple-500/10',
  },
}

export const MAX_XP = 5000
