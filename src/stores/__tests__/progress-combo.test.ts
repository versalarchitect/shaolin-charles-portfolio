import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import {
  completeLesson,
  resetProgress,
  getComboInfo,
  COMBO_WINDOW_MS,
  onProgressEvent,
} from '@/stores/progress'

beforeEach(() => {
  vi.useFakeTimers()
  vi.spyOn(Math, 'random').mockReturnValue(0.5) // no crits
  vi.setSystemTime(new Date('2026-05-03T10:00:00Z'))
  resetProgress()
})

afterEach(() => {
  vi.useRealTimers()
  vi.restoreAllMocks()
})

describe('combo system', () => {
  it('COMBO_WINDOW_MS is 10 minutes', () => {
    expect(COMBO_WINDOW_MS).toBe(10 * 60 * 1000)
  })

  it('starts with no combo', () => {
    const info = getComboInfo()
    expect(info.count).toBe(0)
    expect(info.bonusPercent).toBe(0)
    expect(info.active).toBe(false)
  })

  it('first completion starts combo at 1 (no bonus)', () => {
    completeLesson('p1')
    const info = getComboInfo()
    expect(info.count).toBe(1)
    expect(info.bonusPercent).toBe(10) // count * 10 = 1 * 10 = 10
    expect(info.active).toBe(true)
  })

  it('increments combo when completing within window', () => {
    vi.setSystemTime(new Date('2026-05-03T10:00:00Z'))
    completeLesson('p1')
    vi.setSystemTime(new Date('2026-05-03T10:03:00Z')) // 3 min later
    completeLesson('p2')
    const info = getComboInfo()
    expect(info.count).toBe(2)
    expect(info.bonusPercent).toBe(20)
    expect(info.active).toBe(true)
  })

  it('resets combo when window expires', () => {
    vi.setSystemTime(new Date('2026-05-03T10:00:00Z'))
    completeLesson('p1')
    vi.setSystemTime(new Date('2026-05-03T10:15:00Z')) // 15 min later (beyond 10 min window)
    const info = getComboInfo()
    expect(info.count).toBe(0)
    expect(info.bonusPercent).toBe(0)
    expect(info.active).toBe(false)
  })

  it('completion after window expires starts new combo at 1', () => {
    vi.setSystemTime(new Date('2026-05-03T10:00:00Z'))
    completeLesson('p1')
    vi.setSystemTime(new Date('2026-05-03T10:15:00Z'))
    completeLesson('p2')
    const info = getComboInfo()
    expect(info.count).toBe(1)
    expect(info.active).toBe(true)
  })

  it('caps bonus at 50% (combo count >= 6)', () => {
    // Complete 7 lessons rapidly
    for (let i = 0; i < 7; i++) {
      vi.setSystemTime(new Date(`2026-05-03T10:0${i}:00Z`))
      completeLesson(['p1', 'p2', 'p3', '1-1', '1-2', '1-3', '1-4'][i])
    }
    const info = getComboInfo()
    expect(info.count).toBe(7)
    expect(info.bonusPercent).toBe(50) // min(7*10, 50) = 50
  })

  it('bonus is exactly count * 10 for count <= 5', () => {
    vi.setSystemTime(new Date('2026-05-03T10:00:00Z'))
    completeLesson('p1')
    expect(getComboInfo().bonusPercent).toBe(10)

    vi.setSystemTime(new Date('2026-05-03T10:01:00Z'))
    completeLesson('p2')
    expect(getComboInfo().bonusPercent).toBe(20)

    vi.setSystemTime(new Date('2026-05-03T10:02:00Z'))
    completeLesson('p3')
    expect(getComboInfo().bonusPercent).toBe(30)

    vi.setSystemTime(new Date('2026-05-03T10:03:00Z'))
    completeLesson('1-1')
    expect(getComboInfo().bonusPercent).toBe(40)

    vi.setSystemTime(new Date('2026-05-03T10:04:00Z'))
    completeLesson('1-2')
    expect(getComboInfo().bonusPercent).toBe(50)
  })

  it('combo persists at window boundary (exactly 10 minutes)', () => {
    vi.setSystemTime(new Date('2026-05-03T10:00:00Z'))
    completeLesson('p1')
    // Advance to exactly COMBO_WINDOW_MS - 1ms
    vi.setSystemTime(new Date(new Date('2026-05-03T10:00:00Z').getTime() + COMBO_WINDOW_MS - 1))
    const info = getComboInfo()
    expect(info.active).toBe(true)
    expect(info.count).toBe(1)
  })

  it('combo expires at exactly COMBO_WINDOW_MS', () => {
    vi.setSystemTime(new Date('2026-05-03T10:00:00Z'))
    completeLesson('p1')
    vi.setSystemTime(new Date(new Date('2026-05-03T10:00:00Z').getTime() + COMBO_WINDOW_MS))
    const info = getComboInfo()
    expect(info.active).toBe(false)
    expect(info.count).toBe(0)
  })
})
