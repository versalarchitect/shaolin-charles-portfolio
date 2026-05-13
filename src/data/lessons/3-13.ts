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
      type: 'code-fill',
      instruction: 'Fill in the missing connection counts using the formula n*(n-1)/2. This shows why coordination overhead grows explosively.',
      language: 'text',
      filename: 'coordination-overhead.txt',
      template: `Agents    Connections    Overhead
──────    ───────────    ────────
  2            1         Trivial
  3            {{three_agents}}         Manageable
  4            6         Needs structure
  5           {{five_agents}}         Needs a pattern
  7           21         Needs automation
 10           {{ten_agents}}         Needs a framework`,
      blanks: [
        { id: 'three_agents', answer: '3', alternatives: ['3'], placeholder: '?', hint: '3*(3-1)/2 = 3*2/2' },
        { id: 'five_agents', answer: '10', alternatives: ['10'], placeholder: '?', hint: '5*(5-1)/2 = 5*4/2' },
        { id: 'ten_agents', answer: '45', alternatives: ['45'], placeholder: '?', hint: '10*(10-1)/2 = 10*9/2' },
      ],
      explanation: "The number of potential conflicts grows much faster than the number of agents. This is why \"just add more agents\" doesn't scale without structure.",
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
      type: 'multiple-choice',
      question: 'In the hub-and-spoke pattern, how do agents communicate?',
      options: [
        'Agents communicate directly with each other through shared files',
        'Every agent reports to you (the hub) only — no inter-agent communication',
        'Agents pass outputs to the next agent in a chain',
        'Agents self-select tasks from a shared pool',
      ],
      correctIndex: 1,
      explanation: "In hub-and-spoke, you are the hub. Every agent reports to you and only to you. Agents never communicate with each other. You assign tasks, collect results, and handle integration. Strengths: simple mental model, no inter-agent conflicts, easy to debug. Weakness: you are the bottleneck.",
    },
    {
      type: 'interactive-diagram',
      title: 'Hub and Spoke',
      body: 'Click through to see how you coordinate everything as the central hub.',
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
      stages: [
        {
          highlightNodes: ['you'],
          highlightEdges: [],
          explanation: 'You are the hub — the central coordinator. You write specs, assign tasks, and make all decisions. This is the starting point for every fleet operation.',
        },
        {
          highlightNodes: ['you', 'a', 'b', 'c'],
          highlightEdges: [{ from: 'you', to: 'a' }, { from: 'you', to: 'b' }, { from: 'you', to: 'c' }],
          explanation: 'You assign independent tasks to each agent. They work in parallel, each in their own worktree. No agent knows what the others are doing.',
        },
        {
          highlightNodes: ['you', 'a', 'b', 'c'],
          highlightEdges: [{ from: 'a', to: 'you' }, { from: 'b', to: 'you' }, { from: 'c', to: 'you' }],
          explanation: 'Agents report results back to you. You review, merge, and handle integration. The bottleneck: everything flows through you.',
        },
      ],
    },
    {
      type: 'code-fill',
      instruction: 'Complete this hub-and-spoke setup. Fill in the worktree commands and merge sequence.',
      language: 'bash',
      filename: 'hub-and-spoke.sh',
      template: `# You are the hub — assign independent features to separate worktrees
git worktree add ../feature-auth {{auth_branch}}
git worktree add ../feature-dashboard feat/dashboard
git worktree add ../feature-settings feat/settings

# Launch agents in parallel (each in its own worktree)
# Agent A: auth system
# Agent B: dashboard UI
# Agent C: settings page

# You check on each, resolve any issues, merge results
git merge {{first_merge}}
git merge feat/dashboard
git merge feat/settings`,
      blanks: [
        { id: 'auth_branch', answer: 'feat/auth', alternatives: ['feat/auth', '-b feat/auth'], placeholder: 'branch name', hint: 'Follow the naming convention: feat/ prefix + feature name' },
        { id: 'first_merge', answer: 'feat/auth', alternatives: ['feat/auth'], placeholder: 'which branch first?', hint: 'Auth is the foundation — merge it first since others may depend on session types' },
      ],
      explanation: 'Each agent gets a separate worktree and an independent task. You launch them, check on them, and merge their work. As the hub, you control the merge order.',
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
      type: 'multiple-choice',
      question: 'In a pipeline pattern, how do agents relate to each other?',
      options: [
        'All agents work on the same task simultaneously',
        'Agents are arranged in sequence — each specializes in one stage and passes output to the next',
        'Agents communicate freely and divide work dynamically',
        'One agent coordinates all others from the center',
      ],
      correctIndex: 1,
      explanation: "In a pipeline, agents are arranged in sequence. Agent A builds, Agent B reviews, Agent C tests, Agent D deploys. Each agent specializes in one stage and passes its output to the next. Strengths: clear separation of concerns, quality improves at each stage. Weakness: it's serial — total time is the sum of all stages.",
    },
    {
      type: 'interactive-diagram',
      title: 'Pipeline',
      body: 'Click through to see how each stage feeds the next in a sequential pipeline.',
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
      stages: [
        {
          highlightNodes: ['build'],
          highlightEdges: [],
          explanation: 'Stage 1: The build agent writes the feature. All other agents are idle, waiting for input. This is the pipeline\'s main cost — serialization.',
        },
        {
          highlightNodes: ['build', 'review'],
          highlightEdges: [{ from: 'build', to: 'review' }],
          explanation: 'Stage 2: Build output passes to the review agent. It checks for security issues, style violations, and logic errors. Quality improves at each stage.',
        },
        {
          highlightNodes: ['review', 'test'],
          highlightEdges: [{ from: 'review', to: 'test' }],
          explanation: 'Stage 3: Reviewed code passes to the test agent. It writes and runs tests, fixing any failures. Each stage only consumes input and produces output.',
        },
        {
          highlightNodes: ['test', 'deploy', 'done'],
          highlightEdges: [{ from: 'test', to: 'deploy' }, { from: 'deploy', to: 'done' }],
          explanation: 'Stage 4: Passing code ships to production. Total time = sum of all stages. The pipeline guarantees quality but sacrifices parallelism.',
        },
      ],
    },
    {
      type: 'code-fill',
      instruction: 'Complete this pipeline script. Fill in the stage-specific agent prompts.',
      language: 'bash',
      filename: 'pipeline.sh',
      template: `# Stage 1: Build agent writes the feature
claude -p "Implement the user profile API endpoint in src/api/profile.ts.\\
  Follow existing route patterns. Include input validation."

# Stage 2: Review agent checks quality
claude -p "{{review_prompt}}"

# Stage 3: Test agent verifies behavior
claude -p "Write and run tests for src/api/profile.ts.\\
  Cover happy path, validation errors, and auth failures.\\
  Fix any failing tests."

# Stage 4: Deploy agent ships it
claude -p "{{deploy_prompt}}"`,
      blanks: [
        { id: 'review_prompt', answer: 'Review src/api/profile.ts for security issues, error handling gaps, and style violations. Fix any issues found.', alternatives: ['Review src/api/profile.ts for security issues, error handling gaps, and style violations. Fix any issues found.'], placeholder: 'review agent instruction', hint: 'The review agent checks for security issues, error handling gaps, and style violations in the built file' },
        { id: 'deploy_prompt', answer: 'Run the full build, verify all tests pass, commit with a descriptive message, and push to main.', alternatives: ['Run the full build, verify all tests pass, commit with a descriptive message, and push to main.'], placeholder: 'deploy agent instruction', hint: 'Build, verify tests, commit, and push — the final stage that ships to production' },
      ],
      explanation: 'Each stage completes before the next begins. Agents are specialized — the build agent never tests, the test agent never deploys. This is the pipeline pattern in action.',
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
      type: 'multiple-choice',
      question: 'What is the key prerequisite for the swarm pattern to work?',
      options: [
        'A powerful central coordinator to assign tasks dynamically',
        'Agents that can communicate with each other in real-time',
        'Every task must be independent, well-defined, and roughly equal in scope',
        'At least 10 agents running simultaneously',
      ],
      correctIndex: 2,
      explanation: "In a swarm, agents pull tasks from a shared pool with no central coordinator. When an agent finishes, it grabs the next task. Every task must be independent, well-defined, and roughly equal in scope. Strengths: maximum parallelism, no bottleneck, agents never idle. Weakness: tasks must be truly independent, and you need extremely clear task definitions.",
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
      type: 'code-fill',
      instruction: 'Complete this swarm task pool setup using GitHub Issues. Fill in the task definitions that are self-contained and independent.',
      language: 'bash',
      filename: 'swarm-tasks.sh',
      template: `# Create the task pool — each issue is a self-contained unit of work
gh issue create --title "Add email validation to signup" --label "{{swarm_label}}"
gh issue create --title "Add rate limiting to /api/search" --label "{{swarm_label}}"
gh issue create --title "Add loading skeleton to profile" --label "{{swarm_label}}"
gh issue create --title "{{webhook_task}}" --label "{{swarm_label}}"
gh issue create --title "Add cache headers to static assets" --label "{{swarm_label}}"
gh issue create --title "Add input sanitization to comments" --label "{{swarm_label}}"

# Each agent picks the next open issue and works it
# Agent claims issue → creates branch → implements → opens PR → picks next
# No coordinator needed — agents work at their own pace`,
      blanks: [
        { id: 'swarm_label', answer: 'swarm', alternatives: ['swarm', '"swarm"'], placeholder: 'label for swarm tasks', hint: 'A label that identifies tasks belonging to this swarm pool' },
        { id: 'webhook_task', answer: 'Add retry logic to payment webhook', alternatives: ['Add retry logic to payment webhook'], placeholder: 'another independent task', hint: 'A self-contained task related to payment webhook reliability' },
      ],
      explanation: 'Use GitHub Issues as your task pool. Each agent claims an issue, works it, submits a PR, then grabs the next. The key: every issue must be fully independent — no task depends on another.',
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
      type: 'multiple-choice',
      question: 'A swarm of 5 agents each completing 2 tasks/hour achieves what fleet throughput?',
      options: [
        '2 tasks/hour (limited by individual agent speed)',
        '5 tasks/hour (one per agent)',
        '10 tasks/hour (5 agents x 2 tasks each)',
        '7 tasks/hour (average of agents and tasks)',
      ],
      correctIndex: 2,
      explanation: "Individual agent speed doesn't matter — fleet throughput does. 5 agents x 2 tasks/hour each = 10 tasks/hour total. The pattern you choose determines your throughput ceiling. Every pattern has coordination overhead: hub-and-spoke costs review time, pipeline costs idle time, swarm costs task definition time.",
    },
    {
      type: 'code-fill',
      instruction: 'Fill in the throughput calculations for each coordination pattern. Same 5 agents, same 10 tasks, ~15 min per task.',
      language: 'text',
      filename: 'throughput-comparison.txt',
      template: `Scenario: 10 independent tasks, 5 agents, ~15 min per task

Hub-and-spoke:
  Round 1: 5 tasks in parallel → 15 min
  Round 2: 5 tasks in parallel → 15 min
  + Your review time between rounds → ~5 min
  Total: ~35 min | Throughput: ~{{hub_throughput}} tasks/hr

Pipeline (build→review→test):
  Each task passes through 3 stages → 45 min per task
  Agents idle between stages
  Total: ~90 min | Throughput: ~{{pipeline_throughput}} tasks/hr

Swarm:
  All agents pull from pool continuously
  No coordinator delay between tasks
  Total: ~{{swarm_time}} min | Throughput: ~20 tasks/hr`,
      blanks: [
        { id: 'hub_throughput', answer: '17', alternatives: ['17', '~17'], placeholder: '?', hint: '10 tasks in ~35 min. Scale to hourly: 10/35*60' },
        { id: 'pipeline_throughput', answer: '7', alternatives: ['7', '~7'], placeholder: '?', hint: '10 tasks in ~90 min. Scale to hourly: 10/90*60' },
        { id: 'swarm_time', answer: '30', alternatives: ['30', '~30'], placeholder: '?', hint: '10 tasks / 5 agents = 2 rounds of ~15 min each, no delay between rounds' },
      ],
      explanation: 'Same agents, same tasks — the pattern determines throughput. Swarm wins for independent tasks (no coordinator overhead). Pipeline is worst for independent tasks (forced serialization). Hub-and-spoke falls in between.',
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
