# Jellyforge AnvilCSS

<p align="center"><img src="Jellyforge_AnvilCSS_logo.png" width="180" alt="Jellyforge AnvilCSS" /></p>

A live, in-browser CSS theme builder for **Jellyfin** — packaged as a single Tampermonkey /
Violentmonkey userscript. Install it once and a floating, collapsible sidebar attaches itself to
the right edge of your *real* Jellyfin frontend. Every control drives Jellyfin's actual DOM and
class names (`.card`, `.skinHeader`, `.mainDrawerButton`, …) live — there is no mock, no iframe, no
separate preview to fall out of sync.

## Install the userscript

1. Install [Tampermonkey](https://www.tampermonkey.net/) (Chrome/Edge/Firefox/Safari) or
   [Violentmonkey](https://violentmonkey.github.io/).
2. Get `anvil-customizer.user.js` either:
   - from the AnvilCSS container on your network (see **Docker** below) — open
     `http://<host>:8283/anvil-customizer.user.js` in your browser and Tampermonkey will offer to
     install it directly, or
   - from `dist/` after building locally (see **Development**).
3. Open your Jellyfin instance. The sidebar appears automatically on the right edge — click the
   tab to expand/collapse it.

The userscript's `@match` is intentionally broad (`*://*/*`); it only actually injects the sidebar
once it detects a real Jellyfin page (`#reactRoot` + `window.ApiClient`), so it stays inert
everywhere else.

## Docker (hosting the script on your LAN)

```bash
docker compose up -d
```

This does **not** run Jellyfin or a backend — it's a single nginx container that serves the built
`anvil-customizer.user.js` at `http://<host>:8283/anvil-customizer.user.js` so every device on your
network can install it straight from that URL.

## Development (without Docker)

```bash
npm install
npm run dev       # Vite dev server with hot reload — floating sidebar on a blank sandbox page
```

Production build (single userscript file in `dist/`):

```bash
npm run build
```

`dist/anvil-customizer.user.js` is the complete, self-contained script — copy it into
Tampermonkey directly, or serve it via the Docker image above.

## Using your theme outside AnvilCSS

The Export panel's **Copy CSS code** button (or downloaded `jellyfin-theme.css`) works against any
real Jellyfin instance: paste it into **Jellyfin Dashboard → General → Custom CSS** to make it
server-wide/permanent — the sidebar itself only ever affects your own browser tab.

## Architecture

- **Injection bootstrap** (`src/renderer/src/main.tsx`): waits for a real Jellyfin page, then
  appends a host `<div>` to `document.body`, attaches an open Shadow DOM to it, injects the
  sidebar's own stylesheet inside that shadow root (so it can never leak onto or clash with
  Jellyfin's CSS), and mounts the React app into it.
- **Live theme CSS** (`src/renderer/src/App.tsx`): the generated stylesheet is pushed into a
  `<style id="anvil-theme-live">` tag in the *real* document `<head>` (outside the shadow root, on
  purpose) so it actually themes the Jellyfin page underneath.
- **Sidebar** (`App.tsx` + `src/renderer/src/panels/`): a React + Zustand app. Panels, top to
  bottom: Colors, Background, Logos, Typography, Components, Catalog, Theme Pool, CSS Editor
  (CodeMirror 6), Export, Wiki.
- **CSS generation** (`src/renderer/src/css/generator.ts`): writes literal colors and 20 header /
  20 card / 20 scrollbar / 20 button / 20 input style presets onto Jellyfin's real skin selectors
  (Jellyfin themes have no CSS variables). Manual editor edits and the generated block coexist via
  a marker model (`src/renderer/src/css/merge.ts`).
- **Theme pool** (`src/renderer/src/api.ts`): saved themes persist in the browser's `localStorage`
  on the Jellyfin domain — no server round-trip, no sync across devices.
- **Build** (`vite.config.ts`): `npm run build` compiles the whole app into one IIFE bundle
  (`dist/anvil-customizer.user.js`), inlines all CSS and images (no separate asset files), and
  prepends the Tampermonkey `==UserScript==` metadata header.
- **i18n**: custom, flat JSON locales (`src/renderer/src/i18n/locales/`) — English, German, Spanish.

## Adding a translation

1. Copy `src/renderer/src/i18n/locales/en.json` → `<lang>.json`, translate values only (keep keys and `{{placeholders}}`).
2. Add the language to `LANGUAGES` and the dictionary map in `src/renderer/src/i18n/index.tsx`.
3. Add a wiki file under `src/renderer/src/wiki/content/` and register it in `src/renderer/src/wiki/content.ts`.
