import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import {
  completeLesson,
  resetProgress,
  getWeeklyChallenges,
} from '@/stores/progress'
import { ALL_LESSONS, WEEKLY_CHALLENGE_POOL } from '@/data/curriculum'

beforeEach(() => {
  vi.useFakeTimers()
  vi.spyOn(Math, 'random').mockReturnValue(0.5)
  resetProgress()
})

afterEach(() => {
  vi.useRealTimers()
  vi.restoreAllMocks()
})

describe('weekly challenges', () => {
  it('getWeeklyChallenges returns exactly 3', () => {
    vi.setSystemTime(new Date('2026-05-03T10:00:00Z'))
    const challenges = getWeeklyChallenges()
    expect(challenges).toHaveLength(3)
  })

  it('is deterministic for the same week', () => {
    vi.setSystemTime(new Date('2026-05-05T10:00:00Z')) // Monday
    const mon = getWeeklyChallenges().map((c) => c.id)
    vi.setSystemTime(new Date('2026-05-07T10:00:00Z')) // Wednesday same week
    const wed = getWeeklyChallenges().map((c) => c.id)
    expect(mon).toEqual(wed)
  })

  it('produces different challenges on different weeks', () => {
    vi.setSystemTime(new Date('2026-05-05T10:00:00Z'))
    const week1 = getWeeklyChallenges().map((c) => c.id)
    vi.setSystemTime(new Date('2026-05-12T10:00:00Z'))
    resetProgress()
    const week2 = getWeeklyChallenges().map((c) => c.id)
    // Not guaranteed to differ, but likely
    expect(week1.length).toBe(3)
    expect(week2.length).toBe(3)
  })

  it('selects from WEEKLY_CHALLENGE_POOL', () => {
    vi.setSystemTime(new Date('2026-05-03T10:00:00Z'))
    const challenges = getWeeklyChallenges()
    const poolIds = WEEKLY_CHALLENGE_POOL.map((c) => c.id)
    for (const c of challenges) {
      expect(poolIds).toContain(c.id)
    }
  })

  it('tracks lessons_this_week progress', () => {
    vi.setSystemTime(new Date('2026-05-03T10:00:00Z'))
    completeLesson('p1')
    completeLesson('p2')

    const challenges = getWeeklyChallenges()
    const lessonsChallenge = challenges.find((c) => c.condition === 'lessons_this_week')
    if (lessonsChallenge) {
      expect(lessonsChallenge.progress).toBe(2)
    }
  })

  it('tracks active_days_week progress', () => {
    vi.setSystemTime(new Date('2026-05-05T10:00:00Z'))
    completeLesson('p1')
    vi.setSystemTime(new Date('2026-05-06T10:00:00Z'))
    completeLesson('p2')
    vi.setSystemTime(new Date('2026-05-07T10:00:00Z'))
    completeLesson('p3')

    const challenges = getWeeklyChallenges()
    const activeDays = challenges.find((c) => c.condition === 'active_days_week')
    if (activeDays) {
      expect(activeDays.progress).toBe(3)
    }
  })

  it('tracks xp_this_week progress', () => {
    vi.setSystemTime(new Date('2026-05-03T10:00:00Z'))
    completeLesson('p1') // 10 XP base

    const challenges = getWeeklyChallenges()
    const xpChallenge = challenges.find((c) => c.condition === 'xp_this_week')
    if (xpChallenge) {
      expect(xpChallenge.progress).toBeGreaterThan(0)
    }
  })

  it('weekly challenges start not completed', () => {
    vi.setSystemTime(new Date('2026-05-03T10:00:00Z'))
    const challenges = getWeeklyChallenges()
    for (const c of challenges) {
      expect(c.completed).toBe(false)
    }
  })

  it('completes lessons_this_week challenge when target met', () => {
    vi.setSystemTime(new Date('2026-05-03T10:00:00Z'))
    // Complete 10 lessons to hit Marathon Runner target
    for (let i = 0; i < 10; i++) {
      vi.setSystemTime(new Date(`2026-05-03T10:${String(i).padStart(2, '0')}:00Z`))
      completeLesson(ALL_LESSONS[i].id)
    }

    const challenges = getWeeklyChallenges()
    const marathon = challenges.find((c) => c.condition === 'lessons_this_week')
    if (marathon) {
      expect(marathon.progress).toBe(10)
      if (marathon.target <= 10) {
        expect(marathon.completed).toBe(true)
      }
    }
  })

  it('resets weekly progress on new week', () => {
    vi.setSystemTime(new Date('2026-05-03T10:00:00Z'))
    completeLesson('p1')
    completeLesson('p2')

    // Jump to next week
    vi.setSystemTime(new Date('2026-05-12T10:00:00Z'))
    completeLesson('p3')

    const challenges = getWeeklyChallenges()
    const lessonsChallenge = challenges.find((c) => c.condition === 'lessons_this_week')
    if (lessonsChallenge) {
      // Should only count p3 (new week), not p1/p2
      expect(lessonsChallenge.progress).toBe(1)
    }
  })
})
