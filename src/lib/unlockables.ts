export type UnlockableType = 'theme' | 'page' | 'content' | 'badge'
export type RequiredLevel = 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond'

export interface UnlockRequirements {
  level?: RequiredLevel
  xp?: number
  achievements?: string[]
  streak?: number
  explorerEvents?: number
}

export interface Unlockable {
  id: string
  name: string
  description: string
  type: UnlockableType
  requirements: UnlockRequirements
  preview?: string
}

export interface UnlockState {
  totalXp: number
  level: string
  achievements: string[]
  streak: number
  explorerEvents?: number
}

const LEVEL_ORDER: RequiredLevel[] = ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond']

export const UNLOCKABLES: Unlockable[] = [
  // Themes (cosmetic)
  {
    id: 'theme-midnight',
    name: 'Midnight',
    description: 'A sleek true-black look with sharper contrast',
    type: 'theme',
    requirements: { level: 'Gold', xp: 500 },
    preview: 'A deeper dark mode with true black backgrounds',
  },
  {
    id: 'theme-ghost',
    name: 'Ghost',
    description: 'Ultra-minimal with softer visuals',
    type: 'theme',
    requirements: { level: 'Platinum', xp: 1000 },
    preview: 'A quiet, faded look that keeps things clean',
  },
  {
    id: 'theme-terminal',
    name: 'Terminal',
    description: 'A retro computer screen look for your dashboard',
    type: 'theme',
    requirements: { streak: 14 },
    preview: 'Green-on-black retro computer style',
  },
  {
    id: 'theme-blueprint',
    name: 'Blueprint',
    description: 'A technical drawing style for your dashboard',
    type: 'theme',
    requirements: { level: 'Diamond', xp: 1800 },
    preview: 'Grid paper background with a drafting table feel',
  },

  // Secret pages
  {
    id: 'secret-vault',
    name: 'The Vault',
    description: 'A hidden page with your full achievement history',
    type: 'page',
    requirements: { achievements: ['first-lesson', 'streak-7', 'speed-learner'] },
    preview: 'A secret page with your complete achievement timeline',
  },
  {
    id: 'secret-stats',
    name: 'Deep Stats',
    description: 'Detailed breakdowns of your learning habits',
    type: 'page',
    requirements: { level: 'Platinum' },
    preview: 'See exactly when and how you learn best',
  },

  // Content unlocks
  {
    id: 'bonus-tips',
    name: 'Pro Tips Collection',
    description: 'Bonus tips from the instructor',
    type: 'content',
    requirements: { level: 'Silver', xp: 200 },
    preview: '10 bonus tips not in the main course',
  },
  {
    id: 'bonus-templates',
    name: 'Template Library',
    description: 'Ready-to-use prompt templates',
    type: 'content',
    requirements: { level: 'Gold', achievements: ['tier2-done'] },
    preview: 'Copy-and-paste templates for common tasks',
  },
]

function meetsLevelRequirement(requiredLevel: RequiredLevel, currentLevel: string): boolean {
  const requiredIdx = LEVEL_ORDER.indexOf(requiredLevel)
  const currentIdx = LEVEL_ORDER.indexOf(currentLevel as RequiredLevel)
  if (currentIdx === -1) return false
  return currentIdx >= requiredIdx
}

export function checkUnlocked(unlockable: Unlockable, state: UnlockState): boolean {
  const { requirements } = unlockable

  if (requirements.level && !meetsLevelRequirement(requirements.level, state.level)) {
    return false
  }

  if (requirements.xp !== undefined && state.totalXp < requirements.xp) {
    return false
  }

  if (requirements.achievements) {
    for (const achievementId of requirements.achievements) {
      if (!state.achievements.includes(achievementId)) {
        return false
      }
    }
  }

  if (requirements.streak !== undefined && state.streak < requirements.streak) {
    return false
  }

  if (requirements.explorerEvents !== undefined) {
    const current = state.explorerEvents ?? 0
    if (current < requirements.explorerEvents) {
      return false
    }
  }

  return true
}

export function getUnlockedItems(state: UnlockState): Unlockable[] {
  return UNLOCKABLES.filter((u) => checkUnlocked(u, state))
}

export function getLockedItems(state: UnlockState): Unlockable[] {
  return UNLOCKABLES.filter((u) => !checkUnlocked(u, state))
}

export function getProgress(unlockable: Unlockable, state: UnlockState): number {
  const { requirements } = unlockable
  const progressParts: number[] = []

  if (requirements.level) {
    const requiredIdx = LEVEL_ORDER.indexOf(requirements.level)
    const currentIdx = LEVEL_ORDER.indexOf(state.level as RequiredLevel)
    if (currentIdx === -1) {
      progressParts.push(0)
    } else {
      progressParts.push(Math.min(100, (currentIdx / requiredIdx) * 100))
    }
  }

  if (requirements.xp !== undefined) {
    progressParts.push(Math.min(100, (state.totalXp / requirements.xp) * 100))
  }

  if (requirements.achievements) {
    const met = requirements.achievements.filter((a) => state.achievements.includes(a)).length
    progressParts.push((met / requirements.achievements.length) * 100)
  }

  if (requirements.streak !== undefined) {
    progressParts.push(Math.min(100, (state.streak / requirements.streak) * 100))
  }

  if (requirements.explorerEvents !== undefined) {
    const current = state.explorerEvents ?? 0
    progressParts.push(Math.min(100, (current / requirements.explorerEvents) * 100))
  }

  if (progressParts.length === 0) return 100

  // Average all requirement progress values
  const total = progressParts.reduce((sum, p) => sum + p, 0)
  return Math.round(total / progressParts.length)
}

export function getUnlockablesByType(type: UnlockableType): Unlockable[] {
  return UNLOCKABLES.filter((u) => u.type === type)
}

export function getUnlockable(id: string): Unlockable | undefined {
  return UNLOCKABLES.find((u) => u.id === id)
}
