import { DateTime } from 'luxon'
import { useMemo, useState } from 'react'
import { convert } from './engine/timezone'
import './App.css'

const FALLBACK_ZONES = [
  'UTC',
  'America/New_York',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Paris',
  'Asia/Tokyo',
  'Asia/Kolkata',
  'Australia/Sydney',
]

const MAX_TARGET_ZONES = 12

function getSupportedTimeZones(): string[] {
  if (typeof Intl.supportedValuesOf === 'function') {
    return Intl.supportedValuesOf('timeZone')
  }

  return FALLBACK_ZONES
}

function App() {
  const [sourceZone, setSourceZone] = useState('UTC')
  const [sourceDateTime, setSourceDateTime] = useState(() =>
    DateTime.now().setZone('UTC').toFormat("yyyy-MM-dd'T'HH:mm"),
  )
  const [targetZoneQuery, setTargetZoneQuery] = useState('')
  const [targetZones, setTargetZones] = useState<string[]>([
    'America/New_York',
    'Europe/London',
    'Asia/Tokyo',
  ])

  const allTimezones = useMemo(() => getSupportedTimeZones(), [])

  const parsedSourceTime = useMemo(
    () => DateTime.fromFormat(sourceDateTime, "yyyy-MM-dd'T'HH:mm", { zone: sourceZone }),
    [sourceDateTime, sourceZone],
  )

  const filteredTimezones = useMemo(() => {
    const query = targetZoneQuery.trim().toLowerCase()

    return allTimezones.filter((timezone) => {
      if (targetZones.includes(timezone)) return false
      if (!query) return true
      return timezone.toLowerCase().includes(query)
    })
  }, [allTimezones, targetZoneQuery, targetZones])

  const conversionCards = useMemo(() => {
    if (!parsedSourceTime.isValid) return []
    return targetZones.map((zone) => convert(parsedSourceTime, zone))
  }, [parsedSourceTime, targetZones])

  const addTargetZone = (zone: string) => {
    if (targetZones.includes(zone) || targetZones.length >= MAX_TARGET_ZONES) return
    setTargetZones((prev) => [...prev, zone])
    setTargetZoneQuery('')
  }

  const removeTargetZone = (zone: string) => {
    setTargetZones((prev) => prev.filter((item) => item !== zone))
  }

  return (
    <main className="app-shell">
      <header>
        <h1>Timezone Conversion Canvas</h1>
        <p>Convert one source datetime across multiple target time zones in real time.</p>
      </header>

      <section className="panel source-controls">
        <div className="field">
          <label htmlFor="source-zone">Source time zone</label>
          <select
            id="source-zone"
            value={sourceZone}
            onChange={(event) => setSourceZone(event.target.value)}
          >
            {allTimezones.map((timezone) => (
              <option key={timezone} value={timezone}>
                {timezone}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="source-datetime">Source date and time</label>
          <input
            id="source-datetime"
            type="datetime-local"
            value={sourceDateTime}
            onChange={(event) => setSourceDateTime(event.target.value)}
          />
        </div>

        {!parsedSourceTime.isValid && (
          <p className="error">Enter a valid source datetime to compute conversions.</p>
        )}
      </section>

      <section className="panel target-controls">
        <div className="target-controls-header">
          <h2>Target time zones</h2>
          <span>{targetZones.length} / 12</span>
        </div>
        <input
          type="search"
          placeholder="Search a timezone..."
          value={targetZoneQuery}
          onChange={(event) => setTargetZoneQuery(event.target.value)}
        />

        <div className="timezone-options">
          {filteredTimezones.slice(0, 50).map((timezone) => (
            <button
              type="button"
              key={timezone}
              onClick={() => addTargetZone(timezone)}
              disabled={targetZones.length >= MAX_TARGET_ZONES}
            >
              + {timezone}
            </button>
          ))}
        </div>

        <div className="selected-zones">
          {targetZones.map((zone) => (
            <button type="button" key={zone} onClick={() => removeTargetZone(zone)}>
              {zone} x
            </button>
          ))}
        </div>
      </section>

      <section className="cards-grid">
        {conversionCards.map((card) => (
          <article className="card" key={card.targetZone}>
            <h3>{card.targetZone}</h3>
            <p className="time">{card.convertedTime.toFormat('ccc, dd LLL yyyy HH:mm')}</p>
            <div className="meta">
              <span className={`badge ${card.dayShift.toLowerCase()}`}>{card.dayShift}</span>
              <span>UTC {card.utcOffset}</span>
            </div>
          </article>
        ))}
      </section>
    </main>
  )
}

export default App
