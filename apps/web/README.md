# Tour Cheetah London — Web

A web port of the iOS Tour Cheetah London app: a self-guided audio tour of London designed to be experienced with **Santander Cycles** (the city's bike share). Ten audio stops grouped into three loops (Royal, Entertainment, Old London), with the same tour route, audio files, photos, and icons used in the original iOS build.

## Tech stack

- **Vite + React + TypeScript** — fast dev, static-deploy friendly
- **MapLibre GL JS** — open-source, no API key required
- **OpenFreeMap "positron" tiles** — free, no token
- **TfL BikePoint API** — live Santander Cycles availability (open endpoint, no key)
- **`vite-plugin-pwa`** — installable manifest, offline audio + tile caching, service worker
- **HTML5 audio + Media Session API** — lock-screen / notification controls on iOS Safari + Android Chrome

## Run locally

From the **monorepo root**:

```bash
npm install
npm run dev:web
```

Or directly from this directory:

```bash
npm install
npm run dev
```

Open <http://localhost:5173>. The dev server proxies `/api/*` to the backend on port 4000 — start the API with `npm run dev:api` from the repo root if you need auth/payment features.

## Build & preview

```bash
npm run build      # outputs to apps/web/dist/
npm run preview    # serves dist/ on http://localhost:4173
```

## E2E tests

```bash
# From repo root (both servers must be running):
npm run dev:api &
npm run test:e2e
```

Or directly:

```bash
cd apps/web
npx playwright test
```

## Deploy

The workflow at `.github/workflows/deploy-web.yml` (repo root) deploys `apps/web/dist/` to GitHub Pages on push to `main`.

## Project layout

```
apps/web/
├── public/
│   ├── audio/              10 .mp3 audio guides
│   └── images/
│       ├── logo/           App logo + PWA icons (192, 512)
│       ├── onboarding/     5 tour-walkthrough images
│       ├── pins/           Audio pin, bike pin, user-location, directional arrows
│       ├── stops/          10 stop photos
│       └── ui/             play, pause, rewind, speed icons, hamburger, etc.
├── src/
│   ├── components/         HamburgerMenu, NowPlayingBar, StopCarousel
│   ├── data/               audioStops.ts, tourRoute.ts (11 polylines), directions.ts
│   ├── hooks/              useGeolocation, useBikeStops (TfL fetch)
│   ├── pages/              Splash, Onboarding, MapScreen, AudioPlayer, HowItWorks, Login, Register
│   ├── state/              AppState (completed stops, now-playing, auth token)
│   ├── styles/global.css
│   └── main.tsx, App.tsx
├── e2e/                    Playwright login flow tests
├── index.html
├── vite.config.ts
├── playwright.config.ts
├── tsconfig.json
└── package.json
```

## Tour data

- `src/data/audioStops.ts` — 10 stops with `[lng, lat]` coordinates, audio file refs, photo refs.
- `src/data/tourRoute.ts` — 11 polyline arrays split into walking (blue) and biking (red) groups.
- `src/data/directions.ts` — directional arrow positions.

## PWA / offline

`vite-plugin-pwa` precaches the JS/CSS bundle, all images, and all audio files on first visit. Map tiles from OpenFreeMap and TfL responses are runtime-cached.

- iOS Safari: Share → "Add to Home Screen"
- Android Chrome: ⋮ → "Install app"

## License

Audio recordings, stop photos, and brand assets © RiskyandWise Ltd. Code is for the project owner's use.
