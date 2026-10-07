# CC

A live US petroleum WPSR terminal with twelve years of weekly EIA history, seasonal comparisons, derived desk metrics and automatic DeepSeek analysis.

## Run locally

Requirements: Node.js 22+, npm 10.9.2 and `zip` for the release script.

```bash
npm ci
cp .env.example .env
# Set EIA_API_KEY and DEEPSEEK_API_KEY in the server environment.
npm run dev
```

The server and built interface use port 3000 by default. `npm run dev` builds the Vite UI before starting Express. For a production build, run `npm run build`, then `npm start`.

Never commit a real `.env`. The managed project stores provider keys as protected server environment secrets; this repository and its ZIP contain only blank variable names. The EIA key previously embedded in browser code should be rotated before use. Do not send keys in chat or browser forms.

## Data and analysis

The Express backend retrieves the EIA series and computes twelve years of weekly history, ISO-week comparisons, five-year seasonal gaps and four-week demand YoY. It refreshes the shared in-memory data every 15 minutes. Browser clients check for new data every five minutes. A changed data version triggers a fresh DeepSeek note. The API key is sent only from `server/deepseek.js`; EIA requests are sent only from `server/eia.js`.

No login or database is used. Server-side rate limits and shared caches restrict provider calls. API routes: `GET /api/status`, `GET /api/dashboard`, `GET /api/analysis`, `POST /api/refresh`; health: `GET /health`.

## Release bundle

```bash
npm run zip:release
```

The generated archive is `release/cloris-commodity-dependencies.zip`. It includes app source, built frontend, the npm lockfile and installed `node_modules`. It excludes `.git`, local `.env`, caches and provider credentials. The archive requires Node.js 22+ to run.

## Container deployment

The WebDev container uses the multi-stage `Dockerfile`: it builds the Vite frontend without provider credentials, then installs only production dependencies and serves `dist` through Express. The server binds `0.0.0.0` and honors the supplied `PORT` (default `3000`); `GET /health` returns an unauthenticated readiness response.

Supply `EIA_API_KEY` and `DEEPSEEK_API_KEY` only through protected project environment secrets at runtime. Do not pass them as Docker build arguments, add a real `.env` file to the image, or copy development-only credentials into production. The release ZIP includes the Dockerfile.
