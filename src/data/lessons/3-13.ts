import type { LessonContent } from './types'

const content: LessonContent = {
  lessonId: '3-13',
  steps: [
    // === INTRODUCTION: WHY 2→5 IS NOT LINEAR ===
    {
      type: 'info',
      title: 'Scaling from 2 agents to 5 or more',
      body: "Running 2 agents in parallel feels manageable. You check on one, switch to the other, merge their work. But add a third and something shifts — you're juggling context switches, resolving merge conflicts, and losing track of who's doing what. This isn't a skill problem — it's a math problem. Communication lines between agents grow as n*(n-1)/2. With 2 agents, that's 1 connection. With 5, it's 10. With 10, it's 45. The solution isn't \"try harder\" — it's choosing a coordination pattern that reduces the number of active connections.",
    },
    {
      type: 'code-demo',
      title: 'Connection growth',
      body: "The number of potential conflicts grows much faster than the number of agents. This is why \"just add more agents\" doesn't scale without structure.",
      language: 'text',
      filename: 'coordination-overhead.txt',
      code: "Agents    Connections    Overhead\n──────    ───────────    ────────\n  2            1         Trivial\n  3            3         Manageable\n  4            6         Needs structure\n  5           10         Needs a pattern\n  7           21         Needs automation\n 10           45         Needs a framework",
    },
    {
      type: 'multiple-choice',
      question: 'You go from 4 agents to 5. How many new coordination connections are added?',
      options: [
        '1 new connection',
        '2 new connections',
        '4 new connections',
        '5 new connections',
      ],
      correctIndex: 2,
      explanation: "4 agents have 6 connections (4*3/2). 5 agents have 10 connections (5*4/2). That's 4 new connections from adding just 1 agent. Each new agent connects to every existing one.",
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'Coordination math understood!',
    },

    // === PATTERN 1: HUB AND SPOKE ===
    {
      type: 'info',
      title: 'Pattern 1: Hub and Spoke',
      body: "In hub-and-spoke, you are the hub. Every agent reports to you and only to you. Agents never communicate with each other. You assign tasks, collect results, and handle integration. This is the most intuitive pattern — you're already the one launching the agents. Strengths: simple mental model, no inter-agent conflicts, easy to debug. Weakness: you are the bottleneck. Every decision, every merge, every clarification goes through you.",
    },
    {
      type: 'diagram',
      title: 'Hub and Spoke',
      body: 'You coordinate everything. Agents work independently and report back to you. No inter-agent communication.',
      diagram: {
        direction: 'TB',
        nodes: [
          { id: 'you', label: 'You', sublabel: 'Orchestrator', shape: 'rounded', highlight: true },
          { id: 'a', label: 'Agent A', shape: 'rect' },
          { id: 'b', label: 'Agent B', shape: 'rect' },
          { id: 'c', label: 'Agent C', shape: 'rect' },
        ],
        edges: [
          { from: 'you', to: 'a', label: 'assign' },
          { from: 'you', to: 'b', label: 'assign' },
          { from: 'you', to: 'c', label: 'assign' },
          { from: 'a', to: 'you', label: 'result' },
          { from: 'b', to: 'you', label: 'result' },
          { from: 'c', to: 'you', label: 'result' },
        ],
      },
    },
    {
      type: 'code-demo',
      title: 'Hub-and-spoke in practice',
      body: 'Each agent gets a separate worktree and an independent task. You launch them, check on them, and merge their work.',
      language: 'bash',
      filename: 'hub-and-spoke.sh',
      code: "# You are the hub — assign independent features to separate worktrees\ngit worktree add ../feature-auth feat/auth\ngit worktree add ../feature-dashboard feat/dashboard\ngit worktree add ../feature-settings feat/settings\n\n# Launch agents in parallel (each in its own worktree)\n# Agent A: auth system\n# Agent B: dashboard UI\n# Agent C: settings page\n\n# You check on each, resolve any issues, merge results\ngit merge feat/auth\ngit merge feat/dashboard\ngit merge feat/settings",
    },
    {
      type: 'multiple-choice',
      question: 'When does hub-and-spoke break down?',
      options: [
        'When tasks are too simple',
        'When you become the bottleneck managing too many agents',
        'When agents need access to the same files',
        'When tasks take longer than 10 minutes',
      ],
      correctIndex: 1,
      explanation: "Hub-and-spoke fails when the orchestrator (you) can't keep up with all the agents reporting back. Every question, every result, every merge goes through you — and your bandwidth is fixed.",
    },
    {
      type: 'checkpoint',
      xp: 4,
      message: 'Hub-and-spoke pattern locked in!',
    },

    // === PATTERN 2: PIPELINE ===
    {
      type: 'info',
      title: 'Pattern 2: Pipeline',
      body: "In a pipeline, agents are arranged in sequence. Each agent specializes in one stage and passes its output to the next. Agent A builds, Agent B reviews, Agent C tests, Agent D deploys. No agent needs to know what the others do — they just consume input and produce output. Strengths: clear separation of concerns, quality improves at each stage. Weakness: it's serial — Agent D is idle while Agent A works, and total time is the sum of all stages.",
    },
    {
      type: 'diagram',
      title: 'Pipeline',
      body: "Sequential stages with specialized agents. Each agent's output feeds the next. One direction, no backflow.",
      diagram: {
        direction: 'LR',
        nodes: [
          { id: 'build', label: 'Agent A', sublabel: 'Build', shape: 'rounded' },
          { id: 'review', label: 'Agent B', sublabel: 'Review', shape: 'rect' },
          { id: 'test', label: 'Agent C', sublabel: 'Test', shape: 'rect' },
          { id: 'deploy', label: 'Agent D', sublabel: 'Deploy', shape: 'rect' },
          { id: 'done', label: 'Done', shape: 'pill', highlight: true },
        ],
        edges: [
          { from: 'build', to: 'review', label: 'code' },
          { from: 'review', to: 'test', label: 'reviewed' },
          { from: 'test', to: 'deploy', label: 'passing' },
          { from: 'deploy', to: 'done', label: 'live' },
        ],
      },
    },
    {
      type: 'code-demo',
      title: 'Pipeline in Claude Code',
      body: 'Each stage completes before the next begins. Agents are specialized — the build agent never tests, the test agent never deploys.',
      language: 'bash',
      filename: 'pipeline.sh',
      code: "# Stage 1: Build agent writes the feature\nclaude -p \"Implement the user profile API endpoint in src/api/profile.ts.\\\n  Follow existing route patterns. Include input validation.\"\n\n# Stage 2: Review agent checks quality\nclaude -p \"Review src/api/profile.ts for security issues,\\\n  error handling gaps, and style violations. Fix any issues found.\"\n\n# Stage 3: Test agent verifies behavior\nclaude -p \"Write and run tests for src/api/profile.ts.\\\n  Cover happy path, validation errors, and auth failures.\\\n  Fix any failing tests.\"\n\n# Stage 4: Deploy agent ships it\nclaude -p \"Run the full build, verify all tests pass,\\\n  commit with a descriptive message, and push to main.\"",
    },
    {
      type: 'multiple-choice',
      question: 'What is the biggest weakness of the pipeline pattern?',
      options: [
        'Agents can interfere with each other',
        'It requires too many agents',
        'It is serial — one slow stage blocks everything',
        'It only works for small tasks',
      ],
      correctIndex: 2,
      explanation: "Pipeline is inherently sequential. If the build stage takes 20 minutes, the review, test, and deploy agents sit idle for 20 minutes. Total time is the sum of all stages, not the max.",
    },
    {
      type: 'checkpoint',
      xp: 4,
      message: 'Pipeline pattern mastered!',
    },

    // === PATTERN 3: SWARM ===
    {
      type: 'info',
      title: 'Pattern 3: Swarm',
      body: "In a swarm, agents pull tasks from a shared pool. No central coordinator assigns work — agents self-select. When an agent finishes, it grabs the next task. This is the most autonomous pattern and the hardest to set up. Every task must be independent, well-defined, and roughly equal in scope. Strengths: maximum parallelism, no bottleneck, agents never idle. Weakness: tasks must be truly independent, and you need extremely clear task definitions since there's nobody to clarify ambiguity.",
    },
    {
      type: 'interactive-diagram',
      title: 'Swarm Scaling',
      body: 'Click through to see how agents self-select tasks from a shared pool and scale horizontally.',
      diagram: {
        direction: 'TB',
        nodes: [
          { id: 'pool', label: 'Task Pool', sublabel: '12 tasks', shape: 'rounded', highlight: true },
          { id: 'a', label: 'Agent A', shape: 'rect' },
          { id: 'b', label: 'Agent B', shape: 'rect' },
          { id: 'c', label: 'Agent C', shape: 'rect' },
          { id: 'd', label: 'Agent D', shape: 'rect' },
          { id: 'done', label: 'Done', sublabel: 'All tasks complete', shape: 'pill' },
        ],
        edges: [
          { from: 'pool', to: 'a', label: 'task' },
          { from: 'pool', to: 'b', label: 'task' },
          { from: 'pool', to: 'c', label: 'task' },
          { from: 'pool', to: 'd', label: 'task' },
          { from: 'a', to: 'pool', label: 'next task', dashed: true },
          { from: 'b', to: 'pool', label: 'next task', dashed: true },
          { from: 'c', to: 'pool', label: 'next task', dashed: true },
          { from: 'd', to: 'pool', label: 'next task', dashed: true },
          { from: 'a', to: 'done', dashed: true },
          { from: 'b', to: 'done', dashed: true },
          { from: 'c', to: 'done', dashed: true },
          { from: 'd', to: 'done', dashed: true },
        ],
      },
      stages: [
        {
          highlightNodes: ['pool'],
          highlightEdges: [],
          explanation: 'The task pool contains 12 independent, well-defined tasks. Each task is self-contained — no task depends on another. This is the prerequisite for swarm pattern.',
        },
        {
          highlightNodes: ['pool', 'a', 'b', 'c', 'd'],
          highlightEdges: [{ from: 'pool', to: 'a' }, { from: 'pool', to: 'b' }, { from: 'pool', to: 'c' }, { from: 'pool', to: 'd' }],
          explanation: 'Round 1: All 4 agents pull their first task simultaneously. No coordinator assigns work — agents self-select. 4 tasks now in progress, 8 remaining.',
        },
        {
          highlightNodes: ['a', 'b', 'pool'],
          highlightEdges: [{ from: 'a', to: 'pool' }, { from: 'b', to: 'pool' }],
          explanation: 'Agents A and B finish first and immediately pull the next task. No waiting for a coordinator. Agents C and D are still working on their first task. 6 tasks done or in progress.',
        },
        {
          highlightNodes: ['a', 'b', 'c', 'd', 'done'],
          highlightEdges: [{ from: 'a', to: 'done' }, { from: 'b', to: 'done' }, { from: 'c', to: 'done' }, { from: 'd', to: 'done' }],
          explanation: 'All 12 tasks completed. Faster agents naturally pick up more tasks — no load balancing needed. Total time is determined by the slowest individual task, not the total count. Maximum throughput.',
        },
      ],
    },
    {
      type: 'code-demo',
      title: 'Swarm task pool with GitHub Issues',
      body: 'Use GitHub Issues as your task pool. Each agent claims an issue, works it, submits a PR, then grabs the next.',
      language: 'bash',
      filename: 'swarm-tasks.sh',
      code: "# Create the task pool — each issue is a self-contained unit of work\ngh issue create --title \"Add email validation to signup\" --label \"swarm\"\ngh issue create --title \"Add rate limiting to /api/search\" --label \"swarm\"\ngh issue create --title \"Add loading skeleton to profile\" --label \"swarm\"\ngh issue create --title \"Add retry logic to payment webhook\" --label \"swarm\"\ngh issue create --title \"Add cache headers to static assets\" --label \"swarm\"\ngh issue create --title \"Add input sanitization to comments\" --label \"swarm\"\n\n# Each agent picks the next open issue and works it\n# Agent claims issue → creates branch → implements → opens PR → picks next\n# No coordinator needed — agents work at their own pace",
    },
    {
      type: 'checkpoint',
      xp: 4,
      message: 'Swarm pattern understood!',
    },

    // === MATCH: Scaling patterns → use cases ===
    {
      type: 'match',
      instruction: 'Match each fleet pattern to its best use case:',
      leftItems: ['Hub-and-spoke', 'Pipeline', 'Swarm'],
      rightItems: ['Sequential data processing with stage handoffs', 'Central coordinator directing specialist agents', 'Many identical agents working independently on similar tasks'],
      correctPairs: { 0: 1, 1: 0, 2: 2 },
      explanation: 'Hub-and-spoke uses a central orchestrator to coordinate specialists. Pipeline chains stages sequentially. Swarm runs identical workers in parallel on independent tasks.',
    },

    // === CHOOSING THE RIGHT PATTERN ===
    {
      type: 'multiple-choice',
      question: 'You have 12 API endpoints that each need input validation added. No endpoint depends on another. Which pattern fits best?',
      options: [
        'Hub-and-spoke — you assign each endpoint to an agent',
        'Pipeline — one agent writes validation, another reviews it',
        'Swarm — agents pull endpoints from a pool independently',
        'None — one agent should do all 12',
      ],
      correctIndex: 2,
      explanation: "12 independent, similarly-scoped tasks with no dependencies between them — this is the textbook swarm scenario. Agents self-select from the pool and work at their own pace. Maximum throughput.",
    },
    {
      type: 'multiple-choice',
      question: 'Your team needs to build a feature, review it for security, test it, and deploy it. Which pattern?',
      options: [
        'Hub-and-spoke',
        'Pipeline',
        'Swarm',
        'Any pattern works equally well',
      ],
      correctIndex: 1,
      explanation: "Build, review, test, deploy — these are sequential stages where each depends on the previous one's output. Pipeline is the natural fit. You can't test code that hasn't been built, and you can't deploy code that hasn't been tested.",
    },
    {
      type: 'multiple-choice',
      question: 'You have 3 independent features to build but want to personally review each before merging. Which pattern?',
      options: [
        'Hub-and-spoke — you coordinate and review each agent',
        'Pipeline — agents build sequentially',
        'Swarm — agents self-select features',
        'Pipeline with swarm stages',
      ],
      correctIndex: 0,
      explanation: "You want personal oversight on every result. That makes you the hub — agents work independently on their features, report back to you, and you review and merge. Hub-and-spoke preserves your control.",
    },

    // === MEASURING FLEET THROUGHPUT ===
    {
      type: 'info',
      title: 'Fleet throughput, not agent speed',
      body: "Individual agent speed doesn't matter. What matters is fleet throughput: total tasks completed per hour across all agents. A swarm of 5 agents each completing 2 tasks/hour = 10 tasks/hour. A pipeline of 4 agents completing 1 task every 40 minutes = 1.5 tasks/hour. The pattern you choose determines your throughput ceiling. Every pattern also has coordination overhead — hub-and-spoke costs review time, pipeline costs idle time, swarm costs task definition time. The goal is choosing the pattern where overhead grows slowest for your workload.",
    },
    {
      type: 'code-demo',
      title: 'Throughput comparison',
      body: 'Same 5 agents, same 10 tasks. Pattern choice determines total completion time.',
      language: 'text',
      filename: 'throughput-comparison.txt',
      code: "Scenario: 10 independent tasks, 5 agents, ~15 min per task\n\nHub-and-spoke:\n  Round 1: 5 tasks in parallel → 15 min\n  Round 2: 5 tasks in parallel → 15 min\n  + Your review time between rounds → ~5 min\n  Total: ~35 min | Throughput: ~17 tasks/hr\n\nPipeline (build→review→test):\n  Each task passes through 3 stages → 45 min per task\n  Agents idle between stages\n  Total: ~90 min | Throughput: ~7 tasks/hr\n\nSwarm:\n  All agents pull from pool continuously\n  No coordinator delay between tasks\n  Total: ~30 min | Throughput: ~20 tasks/hr",
    },
    {
      type: 'checkpoint',
      xp: 5,
      message: 'Fleet throughput thinking unlocked!',
    },

    // === PRACTICAL EXERCISES ===
    {
      type: 'order',
      instruction: 'Order these patterns from MOST coordinator involvement to LEAST:',
      items: ['Swarm', 'Hub-and-spoke', 'Pipeline'],
      correctOrder: [1, 2, 0],
    },
    {
      type: 'code-input',
      instruction: 'The formula for coordination connections between n agents is n*(n-1)/2. How many connections exist between 6 agents?',
      placeholder: '____',
      answer: '15',
      hint: 'Plug in n=6: 6*(6-1)/2 = 6*5/2',
    },

    // === FINAL CHECKLIST ===
    {
      type: 'checklist',
      title: 'Multi-agent coordination checklist:',
      items: [
        'I understand why coordination overhead grows as n*(n-1)/2',
        'I can apply hub-and-spoke for controlled, independent tasks',
        'I can apply pipeline for sequential, stage-based workflows',
        'I can apply swarm for many independent tasks with clear definitions',
        'I choose patterns based on task dependency structure',
        'I measure fleet throughput, not individual agent speed',
        'I watch for the coordination tax and minimize it',
      ],
    },
    {
      type: 'checkpoint',
      xp: 10,
      message: 'Multi-Agent Coordination complete! You can scale up your AI workforce with the right pattern for each situation.',
    },
  ],
}

export default content
