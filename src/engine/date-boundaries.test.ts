import { describe, it, expect } from 'vitest'
import { DateTime } from 'luxon'
import { convert } from './timezone'

describe('convert — date boundary crossings', () => {
  it('crosses midnight forward (today → tomorrow)', () => {
    const source = DateTime.fromObject(
      { year: 2026, month: 4, day: 15, hour: 23, minute: 30 },
      { zone: 'America/New_York' },
    )
    const result = convert(source, 'Asia/Tokyo')
    expect(result.dayShift).toBe('Tomorrow')
    expect(result.convertedTime.day).toBe(16)
  })

  it('crosses midnight backward (today → yesterday)', () => {
    const source = DateTime.fromObject(
      { year: 2026, month: 4, day: 1, hour: 1, minute: 0 },
      { zone: 'Asia/Tokyo' },
    )
    const result = convert(source, 'America/New_York')
    expect(result.dayShift).toBe('Yesterday')
    expect(result.convertedTime.day).toBe(31)
  })

  it('stays same day when no boundary crossed', () => {
    const source = DateTime.fromObject(
      { year: 2026, month: 6, day: 15, hour: 12, minute: 0 },
      { zone: 'America/New_York' },
    )
    const result = convert(source, 'America/Chicago')
    expect(result.dayShift).toBe('Today')
  })

  it('crosses month boundary (end of month)', () => {
    const source = DateTime.fromObject(
      { year: 2026, month: 1, day: 31, hour: 22, minute: 0 },
      { zone: 'America/New_York' },
    )
    const result = convert(source, 'Asia/Tokyo')
    expect(result.convertedTime.month).toBe(2)
    expect(result.convertedTime.day).toBe(1)
  })

  it('crosses year boundary (Dec 31 → Jan 1)', () => {
    const source = DateTime.fromObject(
      { year: 2026, month: 12, day: 31, hour: 20, minute: 0 },
      { zone: 'America/New_York' },
    )
    const result = convert(source, 'Asia/Tokyo')
    expect(result.convertedTime.year).toBe(2027)
    expect(result.convertedTime.month).toBe(1)
    expect(result.convertedTime.day).toBe(1)
  })

  it('crosses year boundary backward (Jan 1 → Dec 31)', () => {
    const source = DateTime.fromObject(
      { year: 2026, month: 1, day: 1, hour: 2, minute: 0 },
      { zone: 'Asia/Tokyo' },
    )
    const result = convert(source, 'America/New_York')
    expect(result.convertedTime.year).toBe(2025)
    expect(result.convertedTime.month).toBe(12)
    expect(result.convertedTime.day).toBe(31)
    expect(result.dayShift).toBe('Yesterday')
  })

  it('handles leap year boundary (Feb 28 → Feb 29)', () => {
    const source = DateTime.fromObject(
      { year: 2024, month: 2, day: 28, hour: 23, minute: 0 },
      { zone: 'America/New_York' },
    )
    const result = convert(source, 'Pacific/Auckland')
    expect(result.convertedTime.month).toBe(2)
    expect(result.convertedTime.day).toBe(29)
  })
})
