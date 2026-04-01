import { describe, it, expect } from 'vitest'
import { findOverlap } from './timezone'

describe('findOverlap — algorithm variants', () => {
  it('returns exactly 3 results for any input', () => {
    const results = findOverlap(['America/New_York', 'Europe/London'])
    expect(results.length).toBe(3)
  })

  it('returns results sorted by score descending', () => {
    const results = findOverlap(['America/New_York', 'Europe/London', 'Asia/Tokyo'])
    for (let i = 0; i < results.length - 1; i++) {
      expect(results[i].score).toBeGreaterThanOrEqual(results[i + 1].score)
    }
  })

  it('scores between 0 and number of zones', () => {
    const zones = ['America/New_York', 'Europe/London', 'Asia/Kolkata', 'Australia/Sydney']
    const results = findOverlap(zones)
    for (const r of results) {
      expect(r.score).toBeGreaterThanOrEqual(0)
      expect(r.score).toBeLessThanOrEqual(zones.length)
    }
  })

  it('respects custom working hours', () => {
    const results = findOverlap(
      ['America/New_York', 'Europe/London'],
      { start: 10, end: 16 },
    )
    expect(results.length).toBe(3)
    for (const r of results) {
      expect(r.rationale).toContain('/2')
    }
  })

  it('handles single zone input', () => {
    const results = findOverlap(['America/New_York'])
    expect(results.length).toBe(3)
    expect(results[0].score).toBeGreaterThanOrEqual(0)
    expect(results[0].score).toBeLessThanOrEqual(1)
  })

  it('includes rationale string for each result', () => {
    const results = findOverlap(['America/New_York', 'Europe/London'])
    for (const r of results) {
      expect(typeof r.rationale).toBe('string')
      expect(r.rationale.length).toBeGreaterThan(0)
    }
  })

  it('hour values are within 0-23 range', () => {
    const results = findOverlap(['America/New_York', 'Europe/London', 'Asia/Tokyo'])
    for (const r of results) {
      expect(r.hour).toBeGreaterThanOrEqual(0)
      expect(r.hour).toBeLessThanOrEqual(23)
    }
  })

  it('finds best overlap for same timezone', () => {
    const results = findOverlap(['America/New_York', 'America/New_York'])
    expect(results[0].score).toBeGreaterThanOrEqual(results[results.length - 1].score)
  })

  it('handles widely separated zones (NY, Tokyo, Sydney)', () => {
    const results = findOverlap(['America/New_York', 'Asia/Tokyo', 'Australia/Sydney'])
    expect(results.length).toBe(3)
    expect(results[0].score).toBeLessThanOrEqual(3)
  })

  it('returns consistent results on repeated calls', () => {
    const zones = ['America/New_York', 'Europe/London', 'Asia/Kolkata']
    const first = findOverlap(zones)
    const second = findOverlap(zones)
    expect(first.length).toBe(second.length)
    for (let i = 0; i < first.length; i++) {
      expect(first[i].score).toBe(second[i].score)
      expect(first[i].hour).toBe(second[i].hour)
    }
  })
})
