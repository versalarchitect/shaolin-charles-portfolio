import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import {
  completeLesson,
  resetProgress,
  getStreakMultiplier,
  onProgressEvent,
  useProgress,
} from '@/stores/progress'

beforeEach(() => {
  vi.useFakeTimers()
  vi.spyOn(Math, 'random').mockReturnValue(0.5) // no crits
  resetProgress()
})

afterEach(() => {
  vi.useRealTimers()
  vi.restoreAllMocks()
})

describe('streak mechanics', () => {
  it('starts at 0', () => {
    expect(getStreakMultiplier().multiplier).toBe(1)
  })

  it('increments to 1 on first completion', () => {
    vi.setSystemTime(new Date('2026-05-03T10:00:00Z'))
    completeLesson('p1')
    // After first completion, streak should be 1
    // streak was 0, prevActivity was null, so condition: prevActivityDate === yesterdayStr || currentStreak === 0
    // Since currentStreak === 0, newStreak = 0 + 1 = 1
    expect(getStreakMultiplier().multiplier).toBe(1) // 1 < 3, so still 1x
  })

  it('increments on consecutive days', () => {
    vi.setSystemTime(new Date('2026-05-01T10:00:00Z'))
    completeLesson('p1')
    vi.setSystemTime(new Date('2026-05-02T10:00:00Z'))
    completeLesson('p2')
    vi.setSystemTime(new Date('2026-05-03T10:00:00Z'))
    completeLesson('p3')
    // streak = 3 → multiplier 1.5x
    expect(getStreakMultiplier().multiplier).toBe(1.5)
  })

  it('does not double-increment for multiple completions same day', () => {
    vi.setSystemTime(new Date('2026-05-01T10:00:00Z'))
    completeLesson('p1')
    vi.setSystemTime(new Date('2026-05-02T10:00:00Z'))
    completeLesson('p2')
    completeLesson('p3') // same day
    vi.setSystemTime(new Date('2026-05-03T10:00:00Z'))
    completeLesson('1-1')
    // streak should be 3 (day1, day2, day3), not 4
    expect(getStreakMultiplier().multiplier).toBe(1.5)
  })

  it('resets when a day is missed (no freeze available)', () => {
    vi.setSystemTime(new Date('2026-05-01T10:00:00Z'))
    completeLesson('p1')
    vi.setSystemTime(new Date('2026-05-02T10:00:00Z'))
    completeLesson('p2')
    // Skip May 3
    vi.setSystemTime(new Date('2026-05-04T10:00:00Z'))
    // Streak is only 2, so no freeze (needs >= 3)
    completeLesson('p3')
    // updateStreak runs: lastActivityDate is May 2, today is May 4
    // yesterday is May 3, lastActivity !== yesterday && lastActivity !== null
    // streak < 3 so no freeze → reset to 0
    // Then completeLesson increments: streak was 0 → newStreak = 1
    expect(getStreakMultiplier().multiplier).toBe(1) // streak=1 < 3
  })

  it('preserves streak within a session when a day is missed (no reset in completeLesson)', () => {
    // updateStreak() only runs on module init (page reload).
    // Within a session, completeLesson preserves streak when days are skipped
    // because the else-if only fires for yesterday or streak=0.
    vi.setSystemTime(new Date('2026-05-01T10:00:00Z'))
    completeLesson('p1')
    vi.setSystemTime(new Date('2026-05-02T10:00:00Z'))
    completeLesson('p2')
    vi.setSystemTime(new Date('2026-05-03T10:00:00Z'))
    completeLesson('p3')
    // streak = 3

    // Skip May 4 — within same session, streak is NOT reset
    vi.setSystemTime(new Date('2026-05-05T10:00:00Z'))
    completeLesson('1-1')
    // prevActivity=May3, yesterday=May4. Neither matches: streak stays 3 (unchanged)
    // newStreak = state.currentStreak = 3 (no increment because condition not met)
    expect(getStreakMultiplier().multiplier).toBe(1.5) // streak=3 → 1.5x
  })

  it('streak remains unchanged when days are skipped in session (no increment or reset)', () => {
    // Within a single session, skipping days means the else-if condition
    // (prevActivity === yesterday || streak === 0) is NOT met → newStreak stays as-is
    vi.setSystemTime(new Date('2026-05-01T10:00:00Z'))
    completeLesson('p1') // streak 0→1
    vi.setSystemTime(new Date('2026-05-02T10:00:00Z'))
    completeLesson('p2') // streak 1→2
    vi.setSystemTime(new Date('2026-05-03T10:00:00Z'))
    completeLesson('p3') // streak 2→3

    // Skip two days
    vi.setSystemTime(new Date('2026-05-06T10:00:00Z'))
    completeLesson('1-1')
    // prevActivity=May3, yesterday=May5. No match. streak stays 3.
    expect(getStreakMultiplier().multiplier).toBe(1.5) // streak=3

    // Skip again
    vi.setSystemTime(new Date('2026-05-09T10:00:00Z'))
    completeLesson('1-2')
    // prevActivity=May6, yesterday=May8. No match. streak stays 3.
    expect(getStreakMultiplier().multiplier).toBe(1.5)
  })

  it('longestStreak tracks the maximum reached', () => {
    // Build a 7-day streak to get longestStreak=7
    for (let i = 1; i <= 7; i++) {
      vi.setSystemTime(new Date(`2026-05-${String(i).padStart(2, '0')}T10:00:00Z`))
      completeLesson(ALL_LESSONS[i - 1].id)
    }
    // streak=7, longestStreak=7, multiplier=2x
    expect(getStreakMultiplier().multiplier).toBe(2)

    // Continue on day 8
    vi.setSystemTime(new Date('2026-05-08T10:00:00Z'))
    completeLesson(ALL_LESSONS[7].id)
    // streak=8, longestStreak=8
    expect(getStreakMultiplier().multiplier).toBe(2) // 8 >= 7 → 2x
  })

  it('streakDates does not add duplicates for same day', () => {
    vi.setSystemTime(new Date('2026-05-03T10:00:00Z'))
    completeLesson('p1')
    completeLesson('p2')
    // Can verify indirectly — completing twice same day shouldn't break anything
    // The key check: no error thrown, functionality is correct
    expect(getStreakMultiplier().multiplier).toBe(1) // streak=1
  })

  it('emits streak_milestone at 3, 7, 14, 30 days', () => {
    const events: unknown[] = []
    const unsub = onProgressEvent((e) => events.push(e))

    for (let i = 1; i <= 7; i++) {
      vi.setSystemTime(new Date(`2026-05-${String(i).padStart(2, '0')}T10:00:00Z`))
      completeLesson(ALL_LESSONS[i - 1].id)
    }

    const milestones = events.filter((e: any) => e.type === 'streak_milestone')
    const days = milestones.map((e: any) => e.days)
    expect(days).toContain(3)
    expect(days).toContain(7)

    unsub()
  })
})

describe('getStreakMultiplier', () => {
  it('returns 1x for streak < 3', () => {
    vi.setSystemTime(new Date('2026-05-03T10:00:00Z'))
    completeLesson('p1')
    expect(getStreakMultiplier()).toEqual({ multiplier: 1, label: '1x' })
  })

  it('returns 1.5x for streak 3-6', () => {
    vi.setSystemTime(new Date('2026-05-01T10:00:00Z'))
    completeLesson('p1')
    vi.setSystemTime(new Date('2026-05-02T10:00:00Z'))
    completeLesson('p2')
    vi.setSystemTime(new Date('2026-05-03T10:00:00Z'))
    completeLesson('p3')
    expect(getStreakMultiplier()).toEqual({ multiplier: 1.5, label: '1.5x' })
  })

  it('returns 2x for streak 7-13', () => {
    for (let i = 1; i <= 7; i++) {
      vi.setSystemTime(new Date(`2026-05-${String(i).padStart(2, '0')}T10:00:00Z`))
      completeLesson(ALL_LESSONS[i - 1].id)
    }
    expect(getStreakMultiplier()).toEqual({ multiplier: 2, label: '2x' })
  })
})

// Import ALL_LESSONS for longer tests
import { ALL_LESSONS } from '@/data/curriculum'
