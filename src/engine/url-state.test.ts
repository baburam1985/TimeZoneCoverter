import { describe, it, expect } from 'vitest'
import { encodeStateToURL, decodeStateFromURL } from './timezone'

describe('encodeStateToURL / decodeStateFromURL — round-trip + malformed', () => {
  describe('valid round-trip', () => {
    it('round-trips simple state', () => {
      const state = { tz: 'America/New_York', dt: '2026-04-01T09:00' }
      const encoded = encodeStateToURL(state)
      const decoded = decodeStateFromURL(encoded)
      expect(decoded).toEqual(state)
    })

    it('round-trips nested objects', () => {
      const state = {
        source: { zone: 'America/New_York', time: '09:00' },
        target: { zone: 'Europe/London' },
        options: { format: '12h' },
      }
      const encoded = encodeStateToURL(state)
      const decoded = decodeStateFromURL(encoded)
      expect(decoded).toEqual(state)
    })

    it('round-trips arrays', () => {
      const state = { zones: ['America/New_York', 'Europe/London', 'Asia/Tokyo'] }
      const encoded = encodeStateToURL(state)
      const decoded = decodeStateFromURL(encoded)
      expect(decoded).toEqual(state)
    })

    it('round-trips empty object', () => {
      const state = {}
      const encoded = encodeStateToURL(state)
      const decoded = decodeStateFromURL(encoded)
      expect(decoded).toEqual(state)
    })

    it('round-trips null values', () => {
      const state = { tz: null, dt: '2026-04-01' }
      const encoded = encodeStateToURL(state)
      const decoded = decodeStateFromURL(encoded)
      expect(decoded).toEqual(state)
    })

    it('round-trips unicode strings', () => {
      const state = { city: '東京', zone: 'Asia/Tokyo' }
      const encoded = encodeStateToURL(state)
      const decoded = decodeStateFromURL(encoded)
      expect(decoded).toEqual(state)
    })
  })

  describe('malformed input handling', () => {
    it('returns empty object for invalid base64', () => {
      const decoded = decodeStateFromURL('not-valid-base64!!!')
      expect(decoded).toEqual({})
    })

    it('returns empty object for empty string', () => {
      const decoded = decodeStateFromURL('')
      expect(decoded).toEqual({})
    })

    it('returns empty object for valid base64 but invalid JSON', () => {
      const encoded = btoa('not-json-string')
      const decoded = decodeStateFromURL(encoded)
      expect(decoded).toEqual({})
    })

    it('returns empty object for partial JSON', () => {
      const encoded = btoa('{"incomplete":')
      const decoded = decodeStateFromURL(encoded)
      expect(decoded).toEqual({})
    })

    it('returns empty object for random bytes', () => {
      const encoded = btoa(String.fromCharCode(0, 1, 2, 255, 254, 253))
      const decoded = decodeStateFromURL(encoded)
      expect(decoded).toEqual({})
    })
  })

  describe('URL safety', () => {
    it('produces URL-safe encoded string', () => {
      const state = { tz: 'America/New_York', dt: '2026-04-01T09:00' }
      const encoded = encodeStateToURL(state)
      expect(encoded).not.toContain(' ')
      expect(encoded).not.toContain('\n')
      expect(encoded).not.toContain('\r')
    })

    it('handles large state objects', () => {
      const largeState: Record<string, string> = {}
      for (let i = 0; i < 100; i++) {
        largeState[`key${i}`] = `value${i}`
      }
      const encoded = encodeStateToURL(largeState)
      const decoded = decodeStateFromURL(encoded)
      expect(decoded).toEqual(largeState)
    })
  })
})
