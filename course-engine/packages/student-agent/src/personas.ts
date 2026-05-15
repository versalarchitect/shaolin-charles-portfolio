export interface SimPersona {
  id: string
  name: string
  email: string
  initial: string
  avatarUrl: string
  tier: string
  speed: 'slow' | 'medium' | 'fast'
  activityWeight: number
  channelPreferences: string[]
  personality: string
}

export const PERSONAS: SimPersona[] = [
  {
    id: 'sim-priya',
    name: 'Priya Patel',
    email: 'sim-priya@internal.agenticsaas.com',
    initial: 'PP',
    avatarUrl: '',
    tier: 'Student',
    speed: 'fast',
    activityWeight: 0.30,
    channelPreferences: ['general', 'showcase'],
    personality: 'enthusiastic',
  },
  {
    id: 'sim-marcus',
    name: 'Marcus Chen',
    email: 'sim-marcus@internal.agenticsaas.com',
    initial: 'MC',
    avatarUrl: '',
    tier: 'Student',
    speed: 'medium',
    activityWeight: 0.25,
    channelPreferences: ['general', 'help'],
    personality: 'methodical',
  },
  {
    id: 'sim-sofia',
    name: 'Sofia Rodriguez',
    email: 'sim-sofia@internal.agenticsaas.com',
    initial: 'SR',
    avatarUrl: '',
    tier: 'Student',
    speed: 'slow',
    activityWeight: 0.15,
    channelPreferences: ['help'],
    personality: 'thoughtful',
  },
  {
    id: 'sim-james',
    name: 'James Wright',
    email: 'sim-james@internal.agenticsaas.com',
    initial: 'JW',
    avatarUrl: '',
    tier: 'Student',
    speed: 'fast',
    activityWeight: 0.20,
    channelPreferences: ['general', 'off-topic'],
    personality: 'social',
  },
  {
    id: 'sim-aisha',
    name: 'Aisha Okafor',
    email: 'sim-aisha@internal.agenticsaas.com',
    initial: 'AO',
    avatarUrl: '',
    tier: 'Student',
    speed: 'medium',
    activityWeight: 0.10,
    channelPreferences: ['general'],
    personality: 'supportive',
  },
]

export function isSimulatedUser(authorId: string, personaUserIds: Record<string, string>): boolean {
  return Object.values(personaUserIds).includes(authorId)
}
