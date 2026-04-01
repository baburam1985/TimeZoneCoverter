import { describe, it, expect } from 'vitest'
import { DateTime } from 'luxon'
import { convert } from './timezone'

const DST_FALL_BACK_DATES: Array<{ year: number; month: number; day: number; zone: string; label: string }> = [
  { year: 2025, month: 11, day: 2, zone: 'America/New_York', label: 'US 2025' },
  { year: 2026, month: 11, day: 1, zone: 'America/New_York', label: 'US 2026' },
  { year: 2027, month: 11, day: 7, zone: 'America/New_York', label: 'US 2027' },
  { year: 2025, month: 10, day: 26, zone: 'Europe/London', label: 'EU 2025' },
  { year: 2026, month: 10, day: 25, zone: 'Europe/London', label: 'EU 2026' },
  { year: 2027, month: 10, day: 31, zone: 'Europe/London', label: 'EU 2027' },
  { year: 2025, month: 10, day: 26, zone: 'Europe/Paris', label: 'EU-Paris 2025' },
  { year: 2026, month: 10, day: 25, zone: 'Europe/Paris', label: 'EU-Paris 2026' },
  { year: 2027, month: 10, day: 31, zone: 'Europe/Paris', label: 'EU-Paris 2027' },
  { year: 2025, month: 4, day: 6, zone: 'Australia/Sydney', label: 'AU 2025' },
  { year: 2026, month: 4, day: 5, zone: 'Australia/Sydney', label: 'AU 2026' },
  { year: 2027, month: 4, day: 4, zone: 'Australia/Sydney', label: 'AU 2027' },
]

describe('convert — DST fall-back transitions', () => {
  for (const entry of DST_FALL_BACK_DATES) {
    it(`handles fall-back ${entry.label} (${entry.zone})`, () => {
      const transitionDate = DateTime.fromObject(
        { year: entry.year, month: entry.month, day: entry.day, hour: 12 },
        { zone: entry.zone },
      )
      const beforeDST = transitionDate.minus({ days: 2 })
      const afterDST = transitionDate.plus({ days: 2 })

      const resultBefore = convert(beforeDST, 'UTC')
      const resultAfter = convert(afterDST, 'UTC')

      expect(resultBefore.convertedTime.isValid).toBe(true)
      expect(resultAfter.convertedTime.isValid).toBe(true)

      const beforeOffset = beforeDST.offset
      const afterOffset = afterDST.offset
      expect(afterOffset).not.toBe(beforeOffset)

      const expectedOffsetDiff = 60
      expect(Math.abs(afterOffset - beforeOffset)).toBe(expectedOffsetDiff)
    })
  }
})
