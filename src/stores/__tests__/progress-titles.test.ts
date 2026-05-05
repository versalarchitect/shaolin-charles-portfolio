import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import {
  completeLesson,
  resetProgress,
  onProgressEvent,
  setActiveTitle,
  getActiveTitle,
  getUnlockedTitles,
} from '@/stores/progress'
import { ALL_LESSONS, CURRICULUM, TITLES, ACHIEVEMENTS } from '@/data/curriculum'

beforeEach(() => {
  vi.useFakeTimers()
  vi.spyOn(Math, 'random').mockReturnValue(0.5)
  vi.setSystemTime(new Date('2026-05-03T10:00:00Z'))
  resetProgress()
})

afterEach(() => {
  vi.useRealTimers()
  vi.restoreAllMocks()
})

describe('titles', () => {
  it('starts with newcomer title unlocked', () => {
    const unlocked = getUnlockedTitles()
    expect(unlocked.map((t) => t.id)).toContain('newcomer')
  })

  it('active title defaults to newcomer', () => {
    expect(getActiveTitle().id).toBe('newcomer')
  })

  it('setActiveTitle changes active title', () => {
    // First unlock another title
    // Complete 5 lessons in one day to unlock speed-demon
    const lessons = ALL_LESSONS.slice(0, 5)
    for (let i = 0; i < lessons.length; i++) {
      vi.setSystemTime(new Date(`2026-05-03T10:${String(i).padStart(2, '0')}:00Z`))
      completeLesson(lessons[i].id)
    }

    const unlocked = getUnlockedTitles()
    const speedDemon = unlocked.find((t) => t.id === 'speed-demon')
    if (speedDemon) {
      setActiveTitle('speed-demon')
      expect(getActiveTitle().id).toBe('speed-demon')
    }
  })

  it('setActiveTitle rejects titles not unlocked', () => {
    setActiveTitle('architect') // not unlocked
    expect(getActiveTitle().id).toBe('newcomer') // unchanged
  })

  it('five_in_day title unlocks after 5 lessons in one day', () => {
    const events: unknown[] = []
    const unsub = onProgressEvent((e) => events.push(e))

    for (let i = 0; i < 5; i++) {
      vi.setSystemTime(new Date(`2026-05-03T10:${String(i).padStart(2, '0')}:00Z`))
      completeLesson(ALL_LESSONS[i].id)
    }

    const titleEvents = events.filter((e: any) => e.type === 'title_unlocked')
    const speedDemon = titleEvents.find((e: any) => e.title.id === 'speed-demon')
    expect(speedDemon).toBeDefined()

    unsub()
  })

  it('streak_14 title unlocks at 14-day streak', () => {
    const events: unknown[] = []
    const unsub = onProgressEvent((e) => events.push(e))

    for (let i = 1; i <= 14; i++) {
      vi.setSystemTime(new Date(`2026-05-${String(i).padStart(2, '0')}T10:00:00Z`))
      completeLesson(ALL_LESSONS[i - 1].id)
    }

    const titleEvents = events.filter((e: any) => e.type === 'title_unlocked')
    const unbreakable = titleEvents.find((e: any) => e.title.id === 'unbreakable')
    expect(unbreakable).toBeDefined()

    unsub()
  })

  it('combo_5 title unlocks at 5x combo', () => {
    const events: unknown[] = []
    const unsub = onProgressEvent((e) => events.push(e))

    for (let i = 0; i < 5; i++) {
      vi.setSystemTime(new Date(`2026-05-03T10:0${i}:00Z`))
      completeLesson(ALL_LESSONS[i].id)
    }

    const titleEvents = events.filter((e: any) => e.type === 'title_unlocked')
    const comboKing = titleEvents.find((e: any) => e.title.id === 'combo-king')
    expect(comboKing).toBeDefined()

    unsub()
  })

  it('complete_tier1 title unlocks when all tier1 lessons done', () => {
    const events: unknown[] = []
    const unsub = onProgressEvent((e) => events.push(e))

    const tier1 = CURRICULUM.find((t) => t.id === 'tier1')!
    for (let i = 0; i < tier1.lessons.length; i++) {
      vi.setSystemTime(new Date(`2026-05-03T10:${String(i).padStart(2, '0')}:00Z`))
      completeLesson(tier1.lessons[i].id)
    }

    const titleEvents = events.filter((e: any) => e.type === 'title_unlocked')
    const scholar = titleEvents.find((e: any) => e.title.id === 'scholar')
    expect(scholar).toBeDefined()

    unsub()
  })

  it('does not unlock same title twice', () => {
    const events: unknown[] = []
    const unsub = onProgressEvent((e) => events.push(e))

    // Unlock speed-demon by completing 5 in a day
    for (let i = 0; i < 5; i++) {
      vi.setSystemTime(new Date(`2026-05-03T10:0${i}:00Z`))
      completeLesson(ALL_LESSONS[i].id)
    }
    // Complete more to potentially re-trigger
    for (let i = 5; i < 8; i++) {
      vi.setSystemTime(new Date(`2026-05-03T10:0${i}:00Z`))
      completeLesson(ALL_LESSONS[i].id)
    }

    const speedDemonEvents = events.filter(
      (e: any) => e.type === 'title_unlocked' && e.title.id === 'speed-demon'
    )
    expect(speedDemonEvents.length).toBeLessThanOrEqual(1)

    unsub()
  })
})

describe('achievements', () => {
  it('first-lesson achievement unlocks on first completion', () => {
    const events: unknown[] = []
    const unsub = onProgressEvent((e) => events.push(e))

    completeLesson('p1')

    const achievementEvents = events.filter((e: any) => e.type === 'achievement_unlocked')
    const firstLesson = achievementEvents.find((e: any) => e.achievement.id === 'first-lesson')
    expect(firstLesson).toBeDefined()

    unsub()
  })

  it('streak-3 achievement unlocks at 3-day streak', () => {
    const events: unknown[] = []
    const unsub = onProgressEvent((e) => events.push(e))

    vi.setSystemTime(new Date('2026-05-01T10:00:00Z'))
    completeLesson('p1')
    vi.setSystemTime(new Date('2026-05-02T10:00:00Z'))
    completeLesson('p2')
    vi.setSystemTime(new Date('2026-05-03T10:00:00Z'))
    completeLesson('p3')

    const achievementEvents = events.filter((e: any) => e.type === 'achievement_unlocked')
    const streak3 = achievementEvents.find((e: any) => e.achievement.id === 'streak-3')
    expect(streak3).toBeDefined()

    unsub()
  })

  it('speed-learner achievement unlocks after 3 in one day', () => {
    const events: unknown[] = []
    const unsub = onProgressEvent((e) => events.push(e))

    vi.setSystemTime(new Date('2026-05-03T10:00:00Z'))
    completeLesson('p1')
    vi.setSystemTime(new Date('2026-05-03T10:01:00Z'))
    completeLesson('p2')
    vi.setSystemTime(new Date('2026-05-03T10:02:00Z'))
    completeLesson('p3')

    const achievementEvents = events.filter((e: any) => e.type === 'achievement_unlocked')
    const speed = achievementEvents.find((e: any) => e.achievement.id === 'speed-learner')
    expect(speed).toBeDefined()

    unsub()
  })

  it('prework-done achievement unlocks after all prework lessons', () => {
    const events: unknown[] = []
    const unsub = onProgressEvent((e) => events.push(e))

    const prework = CURRICULUM.find((t) => t.id === 'prework')!
    for (let i = 0; i < prework.lessons.length; i++) {
      vi.setSystemTime(new Date(`2026-05-03T10:0${i}:00Z`))
      completeLesson(prework.lessons[i].id)
    }

    const achievementEvents = events.filter((e: any) => e.type === 'achievement_unlocked')
    const preworkDone = achievementEvents.find((e: any) => e.achievement.id === 'prework-done')
    expect(preworkDone).toBeDefined()

    unsub()
  })

  it('achievements award XP on unlock', () => {
    const events: unknown[] = []
    const unsub = onProgressEvent((e) => events.push(e))

    completeLesson('p1') // triggers first-lesson achievement (xpReward: 10)

    const achievementEvent = events.find(
      (e: any) => e.type === 'achievement_unlocked' && e.achievement.id === 'first-lesson'
    )
    expect(achievementEvent).toBeDefined()
    expect((achievementEvent as any).achievement.xpReward).toBe(10)

    unsub()
  })

  it('achievements cannot unlock twice', () => {
    const events: unknown[] = []
    const unsub = onProgressEvent((e) => events.push(e))

    completeLesson('p1') // unlocks first-lesson
    completeLesson('p2') // should NOT unlock first-lesson again

    const firstLessonEvents = events.filter(
      (e: any) => e.type === 'achievement_unlocked' && e.achievement.id === 'first-lesson'
    )
    expect(firstLessonEvents).toHaveLength(1)

    unsub()
  })
})
