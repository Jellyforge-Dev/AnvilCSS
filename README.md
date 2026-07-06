# Jellyforge AnvilCSS

<p align="center"><img src="Jellyforge_AnvilCSS_logo.png" width="180" alt="Jellyforge AnvilCSS" /></p>

A live, in-app CSS theme builder for **Jellyfin**. AnvilCSS is a standalone preview tool: it serves
the real, unmodified `jellyfin-web` frontend locally against an in-memory mock of Jellyfin's API (no
real media server involved), with a floating, collapsible customizer sidebar spliced into the page.
What you see while designing is exactly the real Jellyfin UI, styled live.

## Quick start (Docker)

```bash
docker compose up -d
```

Open `http://localhost:8283` and log in with the built-in preview account:

- **Username:** `AnvilCSS`
- **Password:** `JellyfinTheme`

Themes and the live-theme CSS persist in `./data`.

## Development (without Docker)

One-time step — vendor the real jellyfin-web static client from the official Jellyfin Docker image
(requires Docker Desktop/daemon running locally):

```bash
npm install
npm run fetch-jellyfin-web   # docker create/cp/rm against jellyfin/jellyfin:10.10.7
npm run dev                   # server on :8283, injector bundle rebuilds on change
```

Production build:

```bash
npm run build
npm start
```

## Using your theme outside AnvilCSS

The Export panel's **Copy CSS code** button (or downloaded `jellyfin-theme.css`) still works if you
want to apply the theme to any Jellyfin instance: paste it into **Jellyfin Dashboard → General →
Custom CSS**.

## Limitations

AnvilCSS is a CSS theme-preview tool, not a working media server. The mocked API covers login,
system info, and enough fake libraries/items to populate the dashboard with poster cards — real
search, playback, per-item detail pages, and live/websocket updates are intentionally no-ops.

## Architecture

- **Static frontend** (`server/jellyfin-web/`, `server/injectHtml.js`): the real, unmodified
  jellyfin-web static build (vendored via `npm run fetch-jellyfin-web` or the Docker build stage),
  served by Express with the sidebar's script/stylesheet tags spliced into `index.html` before
  `</head>`.
- **Mock API** (`server/mockJellyfin.js`): an in-memory mock of just enough of Jellyfin's REST API
  (`AuthenticateByName`, `System/Info`, `Views`, `Items`, poster image redirects) for the real
  frontend to boot, log in, and show a populated dashboard. Anything else falls back to a generic
  empty-but-valid response rather than 404ing.
- **Live theme** (`server/theme.js`): serves the currently-applied CSS at `/anvil/anvil-theme.css`
  (`Cache-Control: no-store`) and persists the sidebar's last-computed CSS + theme state to `data/`.
- **Sidebar** (`src/renderer/src/`): a React + Zustand app built with Vite in library/IIFE mode
  (`vite.injector.config.ts` → `dist/anvil/anvil-injector.js`), mounted into a `#anvilcss-root` div
  appended to the real Jellyfin page. Panels: Colors, Background, Logos, Components, Catalog, Theme
  Pool, CSS Editor (CodeMirror 6), Export, Wiki.
- **CSS generation** (`src/renderer/src/css/generator.ts`): writes literal colors and 15
  button / 12 card style presets onto Jellyfin's real skin selectors (Jellyfin themes have no CSS
  variables). Manual editor edits and the generated block coexist via a marker model
  (`src/renderer/src/css/merge.ts`).
- **i18n**: custom, flat JSON locales (`src/renderer/src/i18n/locales/`) — English, German, Spanish.

## Adding a translation

1. Copy `src/renderer/src/i18n/locales/en.json` → `<lang>.json`, translate values only (keep keys and `{{placeholders}}`).
2. Add the language to `LANGUAGES` and the dictionary map in `src/renderer/src/i18n/index.tsx`.
3. Add a wiki file under `src/renderer/src/wiki/content/` and register it in `src/renderer/src/wiki/content.ts`.

## Data on disk

| File | Purpose |
|------|---------|
| `data/themes.json` | Saved theme pool |
| `data/theme.css` / `data/theme-state.json` | The currently-applied live theme |
| `data/wallhaven-cache.json` | 7-day Wallhaven response cache |
