import { describe, it, expect } from 'vitest'
import {
  ALL_LESSONS,
  CURRICULUM,
  TOTAL_XP,
  TOTAL_LESSONS,
  XP_LEVELS,
  ACHIEVEMENTS,
  STREAK_MULTIPLIERS,
  TITLES,
  CHALLENGE_POOL,
  WEEKLY_CHALLENGE_POOL,
} from '@/data/curriculum'

describe('curriculum data integrity', () => {
  it('has exactly 51 lessons', () => {
    expect(ALL_LESSONS).toHaveLength(51)
    expect(TOTAL_LESSONS).toBe(51)
  })

  it('ALL_LESSONS matches sum of tier lesson counts', () => {
    const sum = CURRICULUM.reduce((acc, tier) => acc + tier.lessons.length, 0)
    expect(sum).toBe(ALL_LESSONS.length)
  })

  it('TOTAL_XP equals sum of all lesson XP values', () => {
    const sum = ALL_LESSONS.reduce((acc, l) => acc + l.xp, 0)
    expect(TOTAL_XP).toBe(sum)
  })

  it('all lesson IDs are unique', () => {
    const ids = ALL_LESSONS.map((l) => l.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('all XP values are positive integers', () => {
    for (const lesson of ALL_LESSONS) {
      expect(lesson.xp).toBeGreaterThan(0)
      expect(Number.isInteger(lesson.xp)).toBe(true)
    }
  })

  it('every lesson has at least one tool', () => {
    for (const lesson of ALL_LESSONS) {
      expect(lesson.tools.length).toBeGreaterThan(0)
    }
  })

  it('every lesson has at least one objective', () => {
    for (const lesson of ALL_LESSONS) {
      expect(lesson.objectives.length).toBeGreaterThan(0)
    }
  })

  it('tier lessonCount matches actual lessons array length', () => {
    for (const tier of CURRICULUM) {
      expect(tier.lessons).toHaveLength(tier.lessonCount)
    }
  })

  it('has 5 tiers (prework + 4)', () => {
    expect(CURRICULUM).toHaveLength(5)
    expect(CURRICULUM.map((t) => t.id)).toEqual(['prework', 'tier1', 'tier2', 'tier3', 'tier4'])
  })

  it('each tier has a capstone as its last lesson (except prework)', () => {
    for (const tier of CURRICULUM.slice(1)) {
      const last = tier.lessons[tier.lessons.length - 1]
      expect(last.isCapstone).toBe(true)
    }
  })

  it('only last lessons of tiers are capstones', () => {
    for (const tier of CURRICULUM) {
      for (const lesson of tier.lessons.slice(0, -1)) {
        expect(lesson.isCapstone).toBe(false)
      }
    }
  })
})

describe('XP_LEVELS', () => {
  it('sorted ascending by minXp', () => {
    for (let i = 1; i < XP_LEVELS.length; i++) {
      expect(XP_LEVELS[i].minXp).toBeGreaterThan(XP_LEVELS[i - 1].minXp)
    }
  })

  it('starts at 0', () => {
    expect(XP_LEVELS[0].minXp).toBe(0)
  })

  it('has 5 levels', () => {
    expect(XP_LEVELS).toHaveLength(5)
  })

  it('last level maxXp is infinity', () => {
    expect(XP_LEVELS[XP_LEVELS.length - 1].maxXp).toBe(Number.POSITIVE_INFINITY)
  })
})

describe('ACHIEVEMENTS', () => {
  it('has 12 achievements', () => {
    expect(ACHIEVEMENTS).toHaveLength(12)
  })

  it('all IDs are unique', () => {
    const ids = ACHIEVEMENTS.map((a) => a.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('all have positive xpReward', () => {
    for (const a of ACHIEVEMENTS) {
      expect(a.xpReward).toBeGreaterThan(0)
    }
  })

  it('all have a condition string', () => {
    for (const a of ACHIEVEMENTS) {
      expect(a.condition).toBeTruthy()
    }
  })
})

describe('STREAK_MULTIPLIERS', () => {
  it('sorted descending by minStreak', () => {
    for (let i = 1; i < STREAK_MULTIPLIERS.length; i++) {
      expect(STREAK_MULTIPLIERS[i].minStreak).toBeLessThan(STREAK_MULTIPLIERS[i - 1].minStreak)
    }
  })

  it('last entry has minStreak 0 (default multiplier)', () => {
    expect(STREAK_MULTIPLIERS[STREAK_MULTIPLIERS.length - 1].minStreak).toBe(0)
  })

  it('multipliers increase with streak', () => {
    for (let i = 1; i < STREAK_MULTIPLIERS.length; i++) {
      expect(STREAK_MULTIPLIERS[i].multiplier).toBeLessThan(STREAK_MULTIPLIERS[i - 1].multiplier)
    }
  })
})

describe('TITLES', () => {
  it('has 13 titles', () => {
    expect(TITLES).toHaveLength(13)
  })

  it('all IDs are unique', () => {
    const ids = TITLES.map((t) => t.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('has a default title (newcomer)', () => {
    expect(TITLES.find((t) => t.condition === 'default')).toBeDefined()
  })
})

describe('CHALLENGE_POOL', () => {
  it('has 12 challenges', () => {
    expect(CHALLENGE_POOL).toHaveLength(12)
  })

  it('all IDs are unique', () => {
    const ids = CHALLENGE_POOL.map((c) => c.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('all have positive xpReward', () => {
    for (const c of CHALLENGE_POOL) {
      expect(c.xpReward).toBeGreaterThan(0)
    }
  })
})

describe('WEEKLY_CHALLENGE_POOL', () => {
  it('has 6 challenges', () => {
    expect(WEEKLY_CHALLENGE_POOL).toHaveLength(6)
  })

  it('all IDs are unique', () => {
    const ids = WEEKLY_CHALLENGE_POOL.map((c) => c.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('all have positive targets', () => {
    for (const c of WEEKLY_CHALLENGE_POOL) {
      expect(c.target).toBeGreaterThan(0)
    }
  })

  it('all have positive xpReward', () => {
    for (const c of WEEKLY_CHALLENGE_POOL) {
      expect(c.xpReward).toBeGreaterThan(0)
    }
  })
})
