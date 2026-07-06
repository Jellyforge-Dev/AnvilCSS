# AnvilCSS Docker/Injection Architecture — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:executing-plans (inline, single autonomous session per explicit user request — no test runner exists in this repo per CLAUDE.md, so verification steps are manual/curl/docker-based instead of unit tests).

**Goal:** Replace the mocked iframe preview + parallel Electron shell with a Docker Compose stack (real `jellyfin/jellyfin` + an AnvilCSS reverse-proxy/injector) that overlays a floating, collapsible customizer sidebar onto the real jellyfin-web frontend via HTML-rewriting + injected script/CSS.

**Architecture:** Express proxy (`server/index.js`) forwards all traffic to a configurable Jellyfin target (`JELLYFIN_TARGET_URL`, default `http://jellyfin:8096` in Docker), rewrites `text/html` responses to inject `<script src="/anvil/anvil-injector.js">` + a live-generated `<link href="/anvil/anvil-theme.css">` before `</head>`, and passes everything else through unmodified/streamed. The injector is the existing React/Zustand app, rebuilt via Vite library mode into one IIFE bundle, mounted into a `<div>` appended to `document.body` of the real Jellyfin page.

**Tech Stack:** Node 20/Express, http-proxy-middleware, React 18 + Zustand + zundo, CodeMirror 6, Vite (app build + lib-mode injector build), Docker Compose, jellyfin/jellyfin:latest.

## Global Constraints
- No test runner in this repo (CLAUDE.md) — verification is manual: docker build/up, curl, browser check.
- i18n: flat JSON/`.ts` dictionaries, en/de/es, keys unchanged across locales, `{{placeholders}}` preserved.
- Code comments in English; keep them minimal (only non-obvious WHY).
- Reuse existing `generator.ts`/`merge.ts`/`themeStore.ts` logic — do not rewrite what already works.

---

### Task 1: Remove Electron and iframe-mock cruft
**Files:** Delete `src/main/`, `src/preload/`, `src/renderer/src/preview/`, `electron.vite.config.ts`, `electron-builder.yml`. Modify `package.json` (drop `electron`/`electron-builder`/`electron-vite` devDeps and any electron scripts), `tsconfig.json`/`tsconfig.node.json` references if any point at removed dirs.
- [ ] Delete the four paths above.
- [ ] Strip electron-related deps/scripts from `package.json`.
- [ ] Verify: `grep -r "electron" package.json src/` returns nothing under `src/renderer`.

### Task 2: Docker Compose + Dockerfile + configurable proxy target
**Files:** Modify `docker-compose.yml`, `Dockerfile`; create `.env.example`.
**Interfaces:** Server reads `process.env.JELLYFIN_TARGET_URL` (fallback `http://jellyfin:8096`) and `process.env.PORT` (fallback `8283`).
- [ ] Write compose with `jellyfin` (no published port) + `anvilcss` (8283:8283, depends_on jellyfin, env `JELLYFIN_TARGET_URL`), volumes `./data` and `jellyfin-config`/`jellyfin-cache`.
- [ ] Write `.env.example` documenting `JELLYFIN_TARGET_URL` override for `npm run dev` against an external Jellyfin.
- [ ] Verify: `docker compose config` parses without error.

### Task 3: Proxy + injection server rewrite
**Files:** Modify `server/index.js`; create `server/proxy.js`, `server/injectHtml.js`.
**Interfaces:** `createProxy(targetUrl)` returns an Express middleware; `injectHtml(html: string): string` inserts the two tags before `</head>`.
- [ ] Implement `injectHtml` and `createProxy` (http-proxy-middleware, `selfHandleResponse` for HTML only, streamed passthrough otherwise, `ws: true` for Jellyfin's socket).
- [ ] Wire into `server/index.js`: `/anvil/*` and `/api/*` handled locally, everything else proxied.
- [ ] Verify: `curl -s http://localhost:8283/ | grep anvil-injector.js` shows the injected tag once stack is up (done at end-to-end verification).

### Task 4: Live theme CSS endpoint
**Files:** Create `server/theme.js`; modify `server/index.js`.
**Interfaces:** `GET /anvil/anvil-theme.css` (no-store, generates from `data/theme.json`), `PUT /anvil/theme` (body: `ThemeState` JSON, persists + regenerates).
- [ ] Implement using existing `generateCss`/`effectiveCss` logic (ported/reused, see Task 9/10 for expanded generator).
- [ ] Verify: `curl -X PUT .../anvil/theme -d '{...}'` then `curl .../anvil/anvil-theme.css` reflects the change.

### Task 5: Injector bundle build
**Files:** Create `vite.injector.config.ts`; create `src/renderer/src/injector-entry.tsx`; modify `package.json` build script.
**Interfaces:** `mountAnvilSidebar(): void` — creates `#anvilcss-root`, renders `<App />` into it via `createRoot`.
- [ ] Vite lib-mode config, `formats: ['iife']`, output `dist/anvil/anvil-injector.js`.
- [ ] `injector-entry.tsx` calls `mountAnvilSidebar()` on `DOMContentLoaded`.
- [ ] Verify: `npm run build` produces `dist/anvil/anvil-injector.js`.

### Task 6: Re-skin App shell as floating collapsible sidebar
**Files:** Modify `src/renderer/src/App.tsx`, `src/renderer/src/styles/app.css`.
**Interfaces:** Removes `<PreviewFrame>`/preview-col/editor-col-as-separate-column layout; adds `sidebar-collapsed` state (persisted in `uiStore`) and an edge toggle tab.
- [ ] Remove all preview-related imports/JSX (`PreviewFrame`, `buildSrcdoc`, `mock/views`).
- [ ] Restructure `app-shell` to `position: fixed` floating panel (right edge default) with collapse/expand toggle, all 8 panels as tabs, editor CodeMirror still reachable as a tab.
- [ ] Verify: build succeeds, no references to deleted `preview/` modules remain (`grep -r "preview/" src/renderer/src`).

### Task 7: Native browser EyeDropper
**Files:** Modify `src/renderer/src/components/ui.tsx` (color row), `src/renderer/src/i18n/locales/{en,de,es}.json`.
**Interfaces:** `ColorRow` gains an eyedropper icon button, feature-detected via `'EyeDropper' in window`.
- [ ] Add button calling `new window.EyeDropper().open({ signal })` with a 15s `AbortController` timeout, catching `AbortError`/user-cancel silently, writing the returned `sRGBHex` into the existing `onChange`.
- [ ] Hide the button when `EyeDropper` is undefined (Firefox/Safari fall back to the native color input's own picker).
- [ ] Add i18n keys `colors.eyedropper` / `colors.eyedropperUnsupported` to all three locales.
- [ ] Verify: manual browser check in Chrome/Edge (pipette selects a pixel color without freezing) and confirm the button is absent in a UA-spoofed Firefox check.

### Task 8: Wiki full-text search
**Files:** Modify `src/renderer/src/panels/WikiPanel.tsx`.
**Interfaces:** Local `search: string` state filters the existing wiki entries array by title + body substring match (case-insensitive), across the active locale's content.
- [ ] Add a search `<input>` at the top of the panel; filter entries client-side on every keystroke.
- [ ] Verify: typing a term present only in a body (not a title) still surfaces that entry.

### Task 9: Button presets (≥15)
**Files:** Modify `src/renderer/src/state/types.ts` (`ButtonSettings.preset: ButtonPresetId`, keep `radius`), `src/renderer/src/css/generator.ts` (add `BUTTON_PRESETS` + rule generator), `src/renderer/src/panels/ComponentsPanel.tsx` (dropdown replacing fill/hover controls), i18n locales for preset labels.
**Interfaces:** `BUTTON_PRESETS: { id: string; label: string; rules(radius: number, accent: string): string }[]`.
- [ ] Define 15 presets: classic-filled, outline, soft, gradient, glassmorphism, neon-glow, material-ripple, flat-minimal, underline, 3d-press, skeuomorphic, pill-gradient-hover, ghost-border-fill, shadow-lift, retro-bevel — each with real distinct CSS (not just color swaps): e.g. glassmorphism uses `backdrop-filter: blur()` + translucent background; neon-glow uses layered `box-shadow` with the accent color; material-ripple adds a `::after` radial-gradient pseudo-element + `:active` scale/opacity transition; underline uses `border-bottom` + transparent background + hover fill transition.
- [ ] `normalizeTheme` compat: default preset `'classic-filled'`, mapped from legacy `fill:'filled',hover:'brighten'`.
- [ ] Replace `ComponentsPanel` button section with a single preset `SelectRow` (styled option previews optional) + keep the radius slider.
- [ ] Verify: `generateCss` output for each of the 15 preset ids contains distinct, non-empty rule blocks (quick node script printing each).

### Task 10: Card presets (≥12)
**Files:** Modify `src/renderer/src/state/types.ts` (`CardSettings.preset: CardPresetId`), `src/renderer/src/css/generator.ts` (`CARD_PRESETS`), `src/renderer/src/panels/ComponentsPanel.tsx`, i18n locales.
- [ ] Define 12 presets: flat, rounded-soft, floating-shadow, glassmorphism (`.cardContent-shadow` blur), accent-border (`.cardScalable` colored border), overlay-zoom, gradient-border, neon-outline, striped-accent, elevated-3d, minimal-ghost, glow-hover-ring — each targeting real card classes (`.cardBox`, `.cardScalable`, `.cardContent-shadow`, `.cardOverlayContainer`).
- [ ] Same legacy-compat default mapping as Task 9.
- [ ] Verify: same per-preset non-empty-output script check.

### Task 11: i18n completeness pass
**Files:** `src/renderer/src/i18n/locales/{en,de,es}.json`.
- [ ] Add every new key introduced in Tasks 6–10 (sidebar toggle, eyedropper, wiki search placeholder, 15 button preset labels, 12 card preset labels) to all three files with real translations (not copies of the English key as a de/es placeholder).
- [ ] Verify: a small Node script diffs key sets across the three files — must be identical.

### Task 12: Docs + scripts cleanup
**Files:** Modify `README.md`, `package.json` scripts.
- [ ] Update README architecture section to describe the proxy/injector model, drop Electron/mock-preview mentions, document `JELLYFIN_TARGET_URL`.
- [ ] Simplify `dev`/`build`/`start` scripts to the proxy+injector build (no electron scripts).

### Task 13: End-to-end verification
**Files:** none (verification only).
- [ ] `docker compose build && docker compose up -d`.
- [ ] `curl -s http://localhost:8283/ | grep -c anvil-injector.js` → 1.
- [ ] `curl -s http://localhost:8283/anvil/anvil-theme.css` → 200, CSS body.
- [ ] `docker compose ps` → both containers `running`/`healthy`.
- [ ] Report success with the reachable URL.

---

## Self-Review Notes
- Spec coverage: Docker architecture (T2/T3), injection (T3/T5/T6), eyedropper fix (T7), logo selectors (already correct in generator.ts, re-verified live in T13), button/card expansion (T9/T10), export/wiki/i18n (T8/T11, ExportPanel unchanged/reused), Electron removal (T1).
- Legacy theme compat handled via existing `normalizeTheme` per-section merge — no separate migration script needed.
