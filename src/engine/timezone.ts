import { DateTime } from 'luxon'

export interface ConversionResult {
  convertedTime: DateTime
  targetZone: string
  dayShift: 'Yesterday' | 'Today' | 'Tomorrow'
  utcOffset: string
}

export function convert(
  sourceTime: DateTime,
  targetZone: string,
): ConversionResult {
  const converted = sourceTime.setZone(targetZone)
  const sourceDay = sourceTime.toISODate()
  const targetDay = converted.toISODate()

  let dayShift: 'Yesterday' | 'Today' | 'Tomorrow' = 'Today'
  if (targetDay && sourceDay) {
    if (targetDay < sourceDay) dayShift = 'Yesterday'
    else if (targetDay > sourceDay) dayShift = 'Tomorrow'
  }

  return {
    convertedTime: converted,
    targetZone,
    dayShift,
    utcOffset: converted.toFormat('ZZZZ'),
  }
}

export function findOverlap(
  zones: string[],
  workingHours: { start: number; end: number } = { start: 9, end: 17 },
): Array<{ hour: number; score: number; rationale: string }> {
  const results: Array<{ hour: number; score: number; rationale: string }> = []

  for (let hour = 0; hour < 24; hour++) {
    let score = 0
    const zoneDetails: string[] = []

    for (const zone of zones) {
      const dt = DateTime.now().setZone(zone).set({ hour, minute: 0 })
      const localHour = dt.hour
      if (localHour >= workingHours.start && localHour < workingHours.end) {
        score++
        zoneDetails.push(`${zone}: ${localHour}:00 (working hours)`)
      } else {
        zoneDetails.push(`${zone}: ${localHour}:00 (outside)`)
      }
    }

    results.push({
      hour,
      score,
      rationale: `${score}/${zones.length} zones in working hours`,
    })
  }

  return results.sort((a, b) => b.score - a.score).slice(0, 3)
}

export function encodeStateToURL(state: Record<string, unknown>): string {
  const json = JSON.stringify(state)
  return btoa(encodeURIComponent(json))
}

export function decodeStateFromURL(hash: string): Record<string, unknown> {
  try {
    const json = decodeURIComponent(atob(hash))
    return JSON.parse(json)
  } catch {
    return {}
  }
}
