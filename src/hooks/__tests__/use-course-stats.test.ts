import { describe, it, expect, vi, beforeEach } from 'vitest'
import { timeAgo } from '@/hooks/use-course-stats'

describe('timeAgo', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-05-03T12:00:00Z'))
  })

  it('returns "just now" for < 60 seconds ago', () => {
    const thirtySecsAgo = new Date('2026-05-03T11:59:30Z').toISOString()
    expect(timeAgo(thirtySecsAgo)).toBe('just now')
  })

  it('returns minutes for 1-59 minutes ago', () => {
    const fiveMinsAgo = new Date('2026-05-03T11:55:00Z').toISOString()
    expect(timeAgo(fiveMinsAgo)).toBe('5m ago')
  })

  it('returns hours for 1-23 hours ago', () => {
    const threeHoursAgo = new Date('2026-05-03T09:00:00Z').toISOString()
    expect(timeAgo(threeHoursAgo)).toBe('3h ago')
  })

  it('returns days for 24+ hours ago', () => {
    const twoDaysAgo = new Date('2026-05-01T12:00:00Z').toISOString()
    expect(timeAgo(twoDaysAgo)).toBe('2d ago')
  })

  it('returns 1m ago at exactly 60 seconds', () => {
    const exactlyOneMin = new Date('2026-05-03T11:59:00Z').toISOString()
    expect(timeAgo(exactlyOneMin)).toBe('1m ago')
  })

  it('returns 1h ago at exactly 3600 seconds', () => {
    const exactlyOneHour = new Date('2026-05-03T11:00:00Z').toISOString()
    expect(timeAgo(exactlyOneHour)).toBe('1h ago')
  })

  it('returns 1d ago at exactly 86400 seconds', () => {
    const exactlyOneDay = new Date('2026-05-02T12:00:00Z').toISOString()
    expect(timeAgo(exactlyOneDay)).toBe('1d ago')
  })
})
