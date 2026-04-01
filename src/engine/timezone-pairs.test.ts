import { describe, it, expect } from 'vitest'
import { DateTime } from 'luxon'
import { convert } from './timezone'

const TIMEZONE_PAIRS: Array<{ source: string; target: string; label: string }> = [
  { source: 'America/New_York', target: 'Europe/London', label: 'NY → London' },
  { source: 'America/New_York', target: 'Europe/Paris', label: 'NY → Paris' },
  { source: 'America/New_York', target: 'Asia/Tokyo', label: 'NY → Tokyo' },
  { source: 'America/New_York', target: 'Asia/Kolkata', label: 'NY → Kolkata' },
  { source: 'America/New_York', target: 'Australia/Sydney', label: 'NY → Sydney' },
  { source: 'America/Los_Angeles', target: 'Europe/London', label: 'LA → London' },
  { source: 'America/Los_Angeles', target: 'Asia/Tokyo', label: 'LA → Tokyo' },
  { source: 'America/Los_Angeles', target: 'Australia/Sydney', label: 'LA → Sydney' },
  { source: 'Europe/London', target: 'Asia/Tokyo', label: 'London → Tokyo' },
  { source: 'Europe/London', target: 'Asia/Kolkata', label: 'London → Kolkata' },
  { source: 'Europe/Paris', target: 'Asia/Tokyo', label: 'Paris → Tokyo' },
  { source: 'Europe/Paris', target: 'America/New_York', label: 'Paris → NY' },
  { source: 'Asia/Tokyo', target: 'America/New_York', label: 'Tokyo → NY' },
  { source: 'Asia/Tokyo', target: 'Europe/London', label: 'Tokyo → London' },
  { source: 'Asia/Kolkata', target: 'America/New_York', label: 'Kolkata → NY' },
  { source: 'Asia/Kolkata', target: 'Europe/London', label: 'Kolkata → London' },
  { source: 'Australia/Sydney', target: 'America/New_York', label: 'Sydney → NY' },
  { source: 'Australia/Sydney', target: 'Europe/London', label: 'Sydney → London' },
  { source: 'America/Chicago', target: 'Europe/Berlin', label: 'Chicago → Berlin' },
  { source: 'America/Denver', target: 'Asia/Shanghai', label: 'Denver → Shanghai' },
]

describe('convert — 20 timezone pair conversions', () => {
  const baseTime = DateTime.fromObject(
    { year: 2026, month: 6, day: 15, hour: 14, minute: 30 },
    { zone: 'UTC' },
  )

  for (const pair of TIMEZONE_PAIRS) {
    it(`${pair.label} converts correctly`, () => {
      const sourceTime = baseTime.setZone(pair.source)
      const result = convert(sourceTime, pair.target)

      expect(result.convertedTime.isValid).toBe(true)
      expect(result.targetZone).toBe(pair.target)
      expect(['Yesterday', 'Today', 'Tomorrow']).toContain(result.dayShift)
      expect(result.utcOffset.length).toBeGreaterThan(0)

      const expectedConverted = baseTime.setZone(pair.target)
      expect(result.convertedTime.toMillis()).toBeCloseTo(expectedConverted.toMillis(), -3)
    })
  }
})
