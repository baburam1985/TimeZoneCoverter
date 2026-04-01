# World Timezone Converter

A real-time timezone conversion canvas built with React, TypeScript, and Vite. Select a source timezone and datetime, then instantly see the converted times across multiple target time zones with day-shift indicators and UTC offsets.

## Features

- **Real-time conversion** — results update as you change source timezone, datetime, or target zones
- **Multi-target display** — compare up to 12 target time zones simultaneously
- **Day-shift badges** — see at a glance whether each target is Yesterday, Today, or Tomorrow
- **Timezone search** — filter the full IANA timezone database to quickly find target zones
- **DST-aware** — uses Luxon for accurate daylight saving time handling
- **URL state encoding** — share conversion state via encoded URL hashes

## Quick Start

### Prerequisites

- Node.js 18+ (tested with Node 20+)
- npm 9+

### Install

```bash
npm install
```

### Development

```bash
npm run dev
```

The app starts at `http://localhost:5173`.

### Build

```bash
npm run build
```

Production assets are written to `dist/`.

### Preview Production Build

```bash
npm run preview
```

### Lint

```bash
npm run lint
```

## Usage

1. **Select a source timezone** — choose any IANA timezone from the dropdown (defaults to UTC)
2. **Set the source datetime** — use the date-time picker to pick a date and time
3. **Add target time zones** — search and click to add up to 12 target zones
4. **Read conversion cards** — each card shows the converted time, day-shift badge, and UTC offset
5. **Remove target zones** — click any selected zone button to remove it

### Day-Shift Semantics

Each conversion card displays a badge indicating how the target date relates to the source date:

| Badge | Meaning |
|-------|---------|
| Today | Target date matches source date |
| Tomorrow | Target date is one day ahead |
| Yesterday | Target date is one day behind |

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 + TypeScript |
| Build tool | Vite 8 |
| Timezone engine | Luxon 3 |
| Styling | Tailwind CSS 4 |
| Unit testing | Vitest 4 + jsdom |
| E2E testing | Playwright |
| Linting | ESLint 9 + typescript-eslint |

## Testing

### Unit Tests

```bash
npm test
```

### Unit Tests with Coverage

```bash
npm run test:coverage
```

### E2E Tests

```bash
npm run test:e2e
```

### Run All Tests

```bash
npm run test:all
```

## License

MIT
