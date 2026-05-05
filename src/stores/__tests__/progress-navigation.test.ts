import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import {
  completeLesson,
  resetProgress,
  getLessonStatus,
  startLesson,
} from '@/stores/progress'
import { ALL_LESSONS, CURRICULUM } from '@/data/curriculum'

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

describe('getLessonStatus', () => {
  it('first lesson of first tier is always available', () => {
    const firstLesson = CURRICULUM[0].lessons[0]
    expect(getLessonStatus(firstLesson.id)).toBe('available')
  })

  it('second lesson is locked when first not completed', () => {
    const secondLesson = CURRICULUM[0].lessons[1]
    expect(getLessonStatus(secondLesson.id)).toBe('locked')
  })

  it('second lesson becomes available after first is completed', () => {
    const first = CURRICULUM[0].lessons[0]
    const second = CURRICULUM[0].lessons[1]

    completeLesson(first.id)
    expect(getLessonStatus(second.id)).toBe('available')
  })

  it('completed lessons return completed', () => {
    completeLesson('p1')
    expect(getLessonStatus('p1')).toBe('completed')
  })

  it('started lessons return in_progress', () => {
    startLesson('p1')
    expect(getLessonStatus('p1')).toBe('in_progress')
  })

  it('first lesson of tier2 is locked when tier1 last lesson not completed', () => {
    const tier2First = CURRICULUM[1].lessons[0] // tier1 first lesson (index 1 = tier1)
    // Actually CURRICULUM[0] = prework, [1] = tier1, [2] = tier2
    const tier2FirstLesson = CURRICULUM[2].lessons[0]
    expect(getLessonStatus(tier2FirstLesson.id)).toBe('locked')
  })

  it('first lesson of tier2 unlocks when last lesson of tier1 is completed', () => {
    const tier1 = CURRICULUM[1] // tier1
    const tier2FirstLesson = CURRICULUM[2].lessons[0]

    // Complete all tier1 lessons (need to complete prework last lesson first to unlock tier1)
    const prework = CURRICULUM[0]
    for (const lesson of prework.lessons) {
      completeLesson(lesson.id)
    }
    // Now tier1 first should be available
    expect(getLessonStatus(tier1.lessons[0].id)).toBe('available')

    // Complete all tier1 lessons
    for (const lesson of tier1.lessons) {
      completeLesson(lesson.id)
    }

    expect(getLessonStatus(tier2FirstLesson.id)).toBe('available')
  })

  it('returns locked for unknown lesson ID', () => {
    expect(getLessonStatus('nonexistent-id')).toBe('locked')
  })

  it('sequential unlocking works through a tier', () => {
    const prework = CURRICULUM[0]
    // Complete p1 → p2 available
    completeLesson(prework.lessons[0].id)
    expect(getLessonStatus(prework.lessons[1].id)).toBe('available')
    expect(getLessonStatus(prework.lessons[2].id)).toBe('locked')

    // Complete p2 → p3 available
    completeLesson(prework.lessons[1].id)
    expect(getLessonStatus(prework.lessons[2].id)).toBe('available')
  })

  it('completing a lesson does not unlock lessons in wrong order', () => {
    // Complete p1 — only p2 should be available, not p3 or any tier1 lessons
    completeLesson('p1')

    expect(getLessonStatus('p2')).toBe('available')
    expect(getLessonStatus('p3')).toBe('locked')
    expect(getLessonStatus('1-1')).toBe('locked')
  })
})

describe('startLesson', () => {
  it('marks lesson as in_progress', () => {
    startLesson('p1')
    expect(getLessonStatus('p1')).toBe('in_progress')
  })

  it('does not override completed status', () => {
    completeLesson('p1')
    startLesson('p1')
    expect(getLessonStatus('p1')).toBe('completed')
  })
})
