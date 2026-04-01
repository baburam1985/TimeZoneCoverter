import { describe, it, expect } from 'vitest'
import { DateTime } from 'luxon'
import { convert, findOverlap, encodeStateToURL, decodeStateFromURL } from './timezone'

describe('convert', () => {
  it('converts time between timezones correctly', () => {
    const source = DateTime.fromObject({ year: 2026, month: 4, day: 1, hour: 12 }, { zone: 'America/New_York' })
    const result = convert(source, 'Europe/London')
    expect(result.dayShift).toBe('Today')
    expect(result.targetZone).toBe('Europe/London')
  })

  it('detects tomorrow day shift', () => {
    const source = DateTime.fromObject({ year: 2026, month: 4, day: 1, hour: 22 }, { zone: 'America/New_York' })
    const result = convert(source, 'Asia/Tokyo')
    expect(result.dayShift).toBe('Tomorrow')
  })

  it('detects yesterday day shift', () => {
    const source = DateTime.fromObject({ year: 2026, month: 4, day: 2, hour: 2 }, { zone: 'Asia/Tokyo' })
    const result = convert(source, 'America/New_York')
    expect(result.dayShift).toBe('Yesterday')
  })
})

describe('findOverlap', () => {
  it('returns top 3 slots', () => {
    const results = findOverlap(['America/New_York', 'Europe/London', 'Asia/Kolkata'])
    expect(results.length).toBe(3)
    expect(results[0].score).toBeGreaterThanOrEqual(results[1].score)
  })
})

describe('encodeStateToURL / decodeStateFromURL', () => {
  it('round-trips state correctly', () => {
    const state = { tz: 'America/New_York', dt: '2026-04-01T09:00' }
    const encoded = encodeStateToURL(state)
    const decoded = decodeStateFromURL(encoded)
    expect(decoded).toEqual(state)
  })

  it('returns empty object for malformed input', () => {
    const decoded = decodeStateFromURL('not-valid-base64!!!')
    expect(decoded).toEqual({})
  })
})
