# TourCheetahLive

Monorepo for the Tour Cheetah London web app and backend API.

```
apps/
  web/   React + Vite frontend (PWA audio tour)
  api/   Node.js + Express + TypeScript backend
```

## Quick start

```bash
npm install          # installs all workspaces

# Terminal 1 — API (requires PostgreSQL running locally)
npm run dev:api

# Terminal 2 — Web
npm run dev:web
```

Open <http://localhost:5173>. The web dev server proxies `/api/*` to the API on port 4000.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev:web` | Start Vite dev server on :5173 |
| `npm run build:web` | Production build → `apps/web/dist/` |
| `npm run dev:api` | Start API (tsx watch) on :4000 |
| `npm run build:api` | Compile API to `apps/api/dist/` |
| `npm run test:e2e` | Run Playwright login tests (needs both servers running) |

## Deploy

The GitHub Actions workflow at `.github/workflows/deploy-web.yml` builds and deploys `apps/web/` to GitHub Pages on every push to `main`.

## API setup

Copy `apps/api/.env.example` to `apps/api/.env` and fill in your values before running the API.
