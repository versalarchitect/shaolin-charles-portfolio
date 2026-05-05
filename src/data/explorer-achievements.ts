export interface ExplorerAchievement {
  id: string
  name: string
  description: string
  xp: number
  condition: 'pages_visited' | 'easter_egg' | 'interaction' | 'total_explorer_xp'
  threshold: number
  icon?: string
}

export const EXPLORER_PAGES = [
  { path: '/', key: 'page:home', name: 'Home', xp: 5 },
  { path: '/about', key: 'page:about', name: 'About', xp: 5 },
  { path: '/projects', key: 'page:projects', name: 'Projects', xp: 5 },
  { path: '/art', key: 'page:art', name: 'Art Gallery', xp: 5 },
  { path: '/instructor', key: 'page:instructor', name: 'Instructor', xp: 5 },
  { path: '/principles', key: 'page:principles', name: 'Principles', xp: 5 },
  { path: '/curriculum', key: 'page:curriculum', name: 'Curriculum', xp: 5 },
  { path: '/contact', key: 'page:contact', name: 'Contact', xp: 5 },
  { path: '/self-updating-course', key: 'page:self-updating', name: 'Self-Updating Course', xp: 5 },
  { path: '/recent-projects', key: 'page:recent-projects', name: 'Recent Projects', xp: 5 },
] as const

export const EXPLORER_ACHIEVEMENTS: ExplorerAchievement[] = [
  { id: 'explorer-curious', name: 'Curious Mind', description: 'Visit 3 different pages', xp: 15, condition: 'pages_visited', threshold: 3 },
  { id: 'explorer-wanderer', name: 'Digital Wanderer', description: 'Visit 6 different pages', xp: 30, condition: 'pages_visited', threshold: 6 },
  { id: 'explorer-cartographer', name: 'Cartographer', description: 'Visit every page on the site', xp: 75, condition: 'pages_visited', threshold: 10 },
  { id: 'explorer-egg-hunter', name: 'Egg Hunter', description: 'Find your first easter egg', xp: 25, condition: 'easter_egg', threshold: 1 },
  { id: 'explorer-secret-finder', name: 'Secret Finder', description: 'Find 3 easter eggs', xp: 50, condition: 'easter_egg', threshold: 3 },
  { id: 'explorer-completionist', name: 'Completionist', description: 'Earn 200 Explorer XP', xp: 100, condition: 'total_explorer_xp', threshold: 200 },
]
