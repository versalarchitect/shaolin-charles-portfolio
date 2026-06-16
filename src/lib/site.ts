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

  // Hero rotating taglines (typed out one after another)
  taglines: [
    'software that perceives, decides, and acts.',
    'i build agents that build.',
    'autonomous systems, end to end.',
    'humans set intent. agents do the rest.',
  ],

  nav: [
    { label: 'about', href: '#about' },
    { label: 'work', href: '#work' },
    { label: 'stack', href: '#stack' },
    { label: 'contact', href: '#contact' },
  ],

  manifesto: [
    'I design and ship autonomous software — systems that observe a goal, reason about it, and take real action without a human in the loop for every step.',
    'The interesting work now lives between models and the world: tools, memory, orchestration, and the taste to know when the machine should act and when it should ask.',
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
      body: 'Generative & real-time graphics — canvas, shaders, and interfaces that feel alive.',
    },
  ],

  // Placeholder slots — real case studies get wired in later.
  work: [
    { id: '01', name: 'PROJECT_ONE', kind: 'autonomous agent platform', status: 'in flight' },
    { id: '02', name: 'PROJECT_TWO', kind: 'real-time LLM interface', status: 'in flight' },
    { id: '03', name: 'PROJECT_THREE', kind: 'creative systems lab', status: 'soon' },
  ],
} as const

export type Capability = (typeof site.capabilities)[number]
export type WorkItem = (typeof site.work)[number]
