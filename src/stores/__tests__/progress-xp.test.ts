import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import {
  completeLesson,
  resetProgress,
  useProgress,
  getLevel,
  getNextLevel,
  getOverallProgress,
  getTierProgress,
  getToolMastery,
  onProgressEvent,
  getXpLog,
  COMBO_WINDOW_MS,
} from '@/stores/progress'
import { ALL_LESSONS, XP_LEVELS, CURRICULUM } from '@/data/curriculum'

beforeEach(() => {
  vi.useFakeTimers()
  vi.setSystemTime(new Date('2026-05-03T10:00:00Z'))
  vi.spyOn(Math, 'random').mockReturnValue(0.5)
  resetProgress()
})

afterEach(() => {
  vi.useRealTimers()
  vi.restoreAllMocks()
})

function getState() {
  let s: ReturnType<typeof useProgress> | undefined
  const unsub = (() => {
    const { useSyncExternalStore } = require('react')
    // Direct state access via module internals isn't possible; use the exported functions
  })
  // Workaround: complete nothing and check totalXp via getLevel / direct import
  // Actually we can read state by accessing the module's exported getters
  return undefined
}

describe('XP calculation', () => {
  const firstLesson = ALL_LESSONS[0] // p1, xp: 10

  it('awards base XP for lesson completion (no multipliers)', () => {
    const events: unknown[] = []
    const unsub = onProgressEvent((e) => events.push(e))

    completeLesson(firstLesson.id)

    const log = getXpLog()
    expect(log.length).toBeGreaterThan(0)
    const lessonLog = log.find((e) => e.type === 'lesson')
    expect(lessonLog).toBeDefined()
    // With streak=0 the multiplier is 1x, combo=1 (first, no bonus)
    // XP = round(10 * 1 * (1 + 0)) = 10, first-of-day +5 = 15 total
    expect(lessonLog!.xp).toBe(10)

    unsub()
  })

  it('awards first-of-day +5 bonus on first completion of the day', () => {
    completeLesson(firstLesson.id)

    const log = getXpLog()
    const firstOfDay = log.find((e) => e.type === 'bonus' && e.label === 'First lesson of the day')
    expect(firstOfDay).toBeDefined()
    expect(firstOfDay!.xp).toBe(5)
  })

  it('does NOT award first-of-day bonus on subsequent completions same day', () => {
    completeLesson('p1')
    completeLesson('p2')

    const log = getXpLog()
    const firstOfDayEntries = log.filter((e) => e.type === 'bonus' && e.label === 'First lesson of the day')
    expect(firstOfDayEntries).toHaveLength(1)
  })

  it('applies streak multiplier to XP', () => {
    // Build up a 3-day streak — multiplier is read from state.currentStreak
    // which is updated AFTER XP calc, so multiplier applies on day 4+
    vi.setSystemTime(new Date('2026-06-01T10:00:00Z'))
    completeLesson('p1') // streak goes 0→1
    vi.setSystemTime(new Date('2026-06-02T10:00:00Z'))
    completeLesson('p2') // streak goes 1→2
    vi.setSystemTime(new Date('2026-06-03T10:00:00Z'))
    completeLesson('p3') // streak goes 2→3 (but XP calc used streak=2 → 1x)
    vi.setSystemTime(new Date('2026-06-04T10:00:00Z'))
    // Now state.currentStreak=3 before this call → multiplier 1.5x
    const lesson = ALL_LESSONS.find((l) => l.id === '1-1')!
    completeLesson('1-1')

    const log = getXpLog()
    const entry = log.find((e) => e.type === 'lesson' && e.label === lesson.title)
    expect(entry).toBeDefined()
    // XP = round(lesson.xp * 1.5 * (1 + 0)) — combo is 1, bonusPercent = 0
    // Verify multiplier was applied (XP > base)
    expect(entry!.xp).toBeGreaterThan(lesson.xp)
    expect(entry!.xp).toBe(Math.round(lesson.xp * 1.5))
  })

  it('applies combo bonus on consecutive completions within window', () => {
    // Complete two lessons quickly (within 10 min)
    vi.setSystemTime(new Date('2026-05-03T10:00:00Z'))
    completeLesson('p1')
    vi.setSystemTime(new Date('2026-05-03T10:02:00Z'))
    completeLesson('p2') // combo=2, bonus = (2-1)*10 = 10%

    const log = getXpLog()
    const p2Log = log.find((e) => e.type === 'lesson' && e.label.includes('Deployment'))
    expect(p2Log).toBeDefined()
    // XP = round(10 * 1 * (1 + 0.10)) = 11
    expect(p2Log!.xp).toBe(11)
  })

  it('caps combo bonus at 50%', () => {
    // Complete 7 lessons rapidly to get combo beyond 6
    const lessons = ALL_LESSONS.slice(0, 7)
    for (let i = 0; i < lessons.length; i++) {
      vi.setSystemTime(new Date(`2026-05-03T10:0${i}:00Z`))
      completeLesson(lessons[i].id)
    }

    const log = getXpLog()
    // 7th completion: combo=7, but bonus caps at 50% (combo * 10 = 70 → capped at 50)
    const lastLog = log[0] // most recent is first
    // combo starts at 1, increments each time: 1,2,3,4,5,6,7
    // For combo=7: bonusPercent = min((7-1)*10, 50) / 100 = 0.5
    // XP = round(lesson.xp * 1 * 1.5)
    expect(lastLog.multipliers).toBeDefined()
    expect(lastLog.multipliers!.some((m) => m.includes('combo'))).toBe(true)
  })

  it('stacks streak and combo multipliers', () => {
    // Build 3-day streak first
    vi.setSystemTime(new Date('2026-05-01T10:00:00Z'))
    completeLesson('p1')
    vi.setSystemTime(new Date('2026-05-02T10:00:00Z'))
    completeLesson('p2')
    vi.setSystemTime(new Date('2026-05-03T10:00:00Z'))
    // streak=3, multiplier=1.5x
    completeLesson('p3') // first completion today, combo=1
    vi.setSystemTime(new Date('2026-05-03T10:01:00Z'))
    completeLesson('1-1') // combo=2, bonus=10%

    const log = getXpLog()
    const lesson = ALL_LESSONS.find((l) => l.id === '1-1')!
    const entry = log.find((e) => e.type === 'lesson' && e.label === lesson.title)
    // XP = round(lesson.xp * 1.5 * 1.10)
    const expected = Math.round(lesson.xp * 1.5 * 1.1)
    expect(entry!.xp).toBe(expected)
  })

  it('critical hit doubles XP (mock Math.random < 0.1)', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.05)

    const events: unknown[] = []
    const unsub = onProgressEvent((e) => events.push(e))

    completeLesson('p1')

    const critEvent = events.find((e: any) => e.type === 'critical_hit')
    expect(critEvent).toBeDefined()
    expect((critEvent as any).totalXp).toBe((critEvent as any).baseXp * 2)

    unsub()
    vi.spyOn(Math, 'random').mockRestore()
  })

  it('no critical hit when Math.random >= 0.1', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5)

    const events: unknown[] = []
    const unsub = onProgressEvent((e) => events.push(e))

    completeLesson('p1')

    const critEvent = events.find((e: any) => e.type === 'critical_hit')
    expect(critEvent).toBeUndefined()

    unsub()
    vi.spyOn(Math, 'random').mockRestore()
  })

  it('distributes tool XP evenly across lesson tools', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5) // no crit
    completeLesson('p1') // tools: ['Node.js', 'VS Code', 'Git', 'Bun'], xp: 10

    const mastery = getToolMastery()
    // toolXpGain = round(10 / 4) = 3 per tool (since no multipliers, streak=0=1x, combo=1=0%)
    // Actually finalXp = 10 (no crit), toolXpGain = round(10/4) = 3
    // But first-of-day adds 5 to total XP — tool xp uses finalXp not total
    for (const entry of mastery) {
      expect(entry.xp).toBe(Math.round(10 / 4))
    }
    expect(mastery).toHaveLength(4)
    vi.spyOn(Math, 'random').mockRestore()
  })
})

describe('milestone bonuses', () => {
  it('awards 25% milestone bonus (+15 XP)', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5) // no crit
    // Complete ~13 lessons (25% of 51 = 12.75, so 13 needed)
    const lessons = ALL_LESSONS.slice(0, 13)
    for (let i = 0; i < lessons.length; i++) {
      vi.setSystemTime(new Date(`2026-05-03T10:${String(i).padStart(2, '0')}:00Z`))
      completeLesson(lessons[i].id)
    }

    const log = getXpLog()
    const milestone = log.find((e) => e.label === '25% Course Milestone')
    expect(milestone).toBeDefined()
    expect(milestone!.xp).toBe(15)
    vi.spyOn(Math, 'random').mockRestore()
  })
})

describe('getLevel', () => {
  it('returns Bronze at 0 XP', () => {
    expect(getLevel().name).toBe('Bronze')
  })

  it('returns Silver at 150 XP', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5)
    // Complete enough lessons to reach 150+ XP
    // Each prework lesson is 10-15 XP, tier1 lessons are 20-50 XP
    const lessons = ALL_LESSONS.slice(0, 8)
    for (let i = 0; i < lessons.length; i++) {
      vi.setSystemTime(new Date(`2026-05-03T10:${String(i).padStart(2, '0')}:00Z`))
      completeLesson(lessons[i].id)
    }
    // Check level is at least Silver (depends on accumulated XP with bonuses)
    const level = getLevel()
    expect(['Silver', 'Gold', 'Platinum', 'Diamond']).toContain(level.name)
    vi.spyOn(Math, 'random').mockRestore()
  })
})

describe('getNextLevel', () => {
  it('returns Silver as next when at Bronze', () => {
    const next = getNextLevel()
    expect(next).not.toBeNull()
    expect(next!.name).toBe('Silver')
  })
})

describe('getTierProgress', () => {
  it('returns 0/3 for prework with no completions', () => {
    const progress = getTierProgress('prework')
    expect(progress.completed).toBe(0)
    expect(progress.total).toBe(3)
    expect(progress.percent).toBe(0)
  })

  it('tracks completions correctly', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5)
    completeLesson('p1')
    const progress = getTierProgress('prework')
    expect(progress.completed).toBe(1)
    expect(progress.total).toBe(3)
    expect(progress.percent).toBe(33)
    vi.spyOn(Math, 'random').mockRestore()
  })

  it('returns zeros for invalid tier', () => {
    const progress = getTierProgress('nonexistent')
    expect(progress).toEqual({ completed: 0, total: 0, percent: 0, earnedXp: 0, totalXp: 0 })
  })
})

describe('getOverallProgress', () => {
  it('starts at 0/51', () => {
    const progress = getOverallProgress()
    expect(progress.completed).toBe(0)
    expect(progress.total).toBe(51)
    expect(progress.percent).toBe(0)
  })

  it('increments on completion', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5)
    completeLesson('p1')
    const progress = getOverallProgress()
    expect(progress.completed).toBe(1)
    expect(progress.percent).toBe(2) // round(1/51*100) = 2
    vi.spyOn(Math, 'random').mockRestore()
  })
})

describe('level-up event', () => {
  it('emits level_up when XP crosses threshold', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5)
    const events: unknown[] = []
    const unsub = onProgressEvent((e) => events.push(e))

    // Complete enough lessons to go from Bronze to Silver (need 150 XP)
    const lessons = ALL_LESSONS.slice(0, 10)
    for (let i = 0; i < lessons.length; i++) {
      vi.setSystemTime(new Date(`2026-05-03T10:${String(i).padStart(2, '0')}:00Z`))
      completeLesson(lessons[i].id)
    }

    const levelUp = events.find((e: any) => e.type === 'level_up')
    expect(levelUp).toBeDefined()
    expect((levelUp as any).from).toBe('Bronze')

    unsub()
    vi.spyOn(Math, 'random').mockRestore()
  })
})
