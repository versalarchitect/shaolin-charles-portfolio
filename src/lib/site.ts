/**
 * Single source of truth for site content.
 * Minimal fresh-start brand — swap copy / links here, the UI follows.
 */
export const site = {
  name: 'Charles Jackson',
  initials: 'CJ',
  role: 'Agentic Systems Engineer',
  domain: 'charlesjackson.dev',
  url: 'https://charlesjackson.dev',

  // NOTE: brand email on the domain — ensure forwarding exists or swap it.
  email: 'charles@charlesjackson.dev',
  github: 'https://github.com/versalarchitect',
  githubHandle: 'versalarchitect',

  nav: [
    { label: 'about', href: '#about' },
    { label: 'work', href: '#work' },
    { label: 'stack', href: '#stack' },
    { label: 'contact', href: '#contact' },
  ],

  manifesto: [
    'Engineer and founder, working on agentic systems — software that takes a goal and carries it out: planning, using tools, and acting without a person steering every step.',
    'I build the products and the companies around them. The part that interests me is making autonomy dependable enough to trust with real work.',
  ],

  capabilities: [
    {
      tag: '01',
      title: 'Agent orchestration',
      body: 'Multi-step agents, tool use, planning loops, and the guardrails that keep them on task.',
    },
    {
      tag: '02',
      title: 'LLM systems',
      body: 'Retrieval, evals, structured output, and pipelines that stay correct as models change.',
    },
    {
      tag: '03',
      title: 'Full-stack product',
      body: 'TypeScript, React, edge & serverless — interfaces that make autonomy legible to people.',
    },
    {
      tag: '04',
      title: 'Creative engineering',
      body: 'Generative and real-time graphics — canvas, shaders, and motion.',
    },
  ],

  work: [
    {
      id: '01',
      name: 'Predictive',
      kind: 'agentic software company',
      domain: 'predictive.company',
      url: 'https://predictive.company',
    },
    {
      id: '02',
      name: 'MicroHabitat',
      kind: 'urban farming at city scale',
      domain: 'microhabitat.com',
      url: 'https://microhabitat.com',
    },
    {
      id: '03',
      name: 'MyUrbanFarm',
      kind: 'the platform behind the farms',
      domain: 'myurbanfarm.ai',
      url: 'https://myurbanfarm.ai',
    },
    {
      id: '04',
      name: 'Direct AI Agents',
      kind: 'learn to direct AI coding agents',
      domain: 'directaiagents.com',
      url: 'https://directaiagents.com',
    },
    {
      id: '05',
      name: 'Cursuum',
      kind: 'ai-powered scheduling',
      domain: 'cursuum.com',
      url: 'https://cursuum.com',
    },
  ],
} as const

export type Capability = (typeof site.capabilities)[number]
export type WorkItem = (typeof site.work)[number]
