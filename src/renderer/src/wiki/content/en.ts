import type { WikiSection } from '../content';

export const WIKI_EN: WikiSection[] = [
  {
    id: 'getting-started',
    title: 'Getting started',
    md: `# Getting started

AnvilCSS builds a complete **Custom CSS theme for Jellyfin** — no CSS knowledge required.

## The workflow

1. **Style** your theme with the builder panels on the left (Colors, Background, Logos, Components).
2. **Watch** every change apply instantly to your real, running Jellyfin page — there's no separate mock to switch between; the sidebar floats right on top of the actual UI you're styling.
3. **Fine-tune** in the code editor on the right — the generated CSS is plain text and fully editable.
4. **Export** via the Export panel: copy the CSS or download \`jellyfin-theme.css\`.
5. In Jellyfin, open **Dashboard → General → Custom CSS**, paste, save. Done.

## Good to know

- **Undo** (↶ in the top bar) reverts any builder change, snippet import or preset.
- **Reset** returns everything to Jellyfin's stock dark look.
- The **Theme Pool** stores unlimited theme drafts in your browser's \`localStorage\`, so they survive reloads (per browser/profile — not synced across devices).
- AnvilCSS runs as a small userscript injected directly into your real Jellyfin tab, so every control targets Jellyfin's actual DOM and class names (\`.skinHeader\`, \`.cardBox\`, \`.button-submit\`, …) live — there's no separate mock that can fall out of sync.`
  },
  {
    id: 'colors',
    title: 'Color palette',
    md: `# Color palette

Jellyfin themes don't use CSS variables — every color is written directly into rules targeting Jellyfin's skin classes. AnvilCSS manages six roles:

| Role | Used for | Jellyfin selectors (examples) |
|------|----------|-------------------------------|
| **Accent** | Buttons, links, progress, selection | \`.button-submit\`, \`.navMenuOption-selected\`, \`.itemProgressBarForeground\` |
| **Background** | Page canvas | \`html\`, \`.backgroundContainer\` |
| **Surface** | Header, dialogs, lists | \`.skinHeader-withBackground\`, \`.paperList\` |
| **Raised** | Buttons, toasts | \`.raised\`, \`.fab\`, \`.toast\` |
| **Text primary** | Main text | \`html\`, \`.skinHeader\` |
| **Text secondary** | Subtitles, labels | \`.cardText-secondary\`, \`.inputLabel\` |

## Tools

- **Random theme** rolls a harmonious combination: one base hue, a scheme rotation (analogous, complementary or triadic) for the accent, and dark surfaces derived from the same hue.
- **Palette from image** extracts dominant colors from the current background image using median-cut quantization, assigns the darkest to Background/Surface/Raised and the most vivid to Accent — then auto-corrects text contrast.
- **Auto-fix contrast** adjusts both text colors until they meet **WCAG** ratios against your background: 7:1 for primary text (AAA) and 4.5:1 for secondary (AA). The badges next to each text color show the live ratio.`
  },
  {
    id: 'background',
    title: 'Background',
    md: `# Background

Four background types are available:

- **Color only** — the flat Background color from the palette.
- **Gradient** — two colors and an angle, applied to \`html\` and \`.backgroundContainer\`.
- **Image via URL** — any reachable image URL. The URL is written verbatim into the CSS, so it must stay reachable from every device that uses the theme.
- **Image upload** — the file is embedded into the CSS as a Base64 data URI. Nothing to host, but the CSS file grows by roughly 135% of the image size — watch the size display in the Export panel.

## Controls

- **Size** — \`cover\` fills the screen (cropping if needed), \`contain\` shows the whole image (may letterbox).
- **Position X/Y** — which part of the image stays visible when cropping (50/50 = centered).
- **Overlay** — a tinted layer between image and UI. Raise the opacity to keep posters and text readable on busy wallpapers.
- **Blur** — softens the image (in px). Applied via \`filter: blur()\` on \`.backgroundContainer\` with a slight scale-up to hide the blurred edge fringe.

**Tip:** the Wallpapers tab in the Catalog pulls the weekly Wallhaven toplist — one click sets it as background, another extracts a matching palette.`
  },
  {
    id: 'logos',
    title: 'Logos & branding',
    md: `# Logos & branding

Jellyfin shows its own branding in five places. AnvilCSS replaces each via CSS where technically possible:

1. **Header logo** — the banner in the top-left. Replaced via \`background-image\` on \`.pageTitleWithLogo\` / \`.pageTitleWithDefaultLogo\` with \`background-size: contain\`.
2. **Login / splash logo** — the logo on the sign-in page and the loading splash. Replaced via \`content: url()\` on \`.imgLogoIcon\` and \`background-image\` on \`.splashLogo\`.
3. **Splashscreen background** — a full-screen image behind the loading splash (\`html.preload\` and the splash container).
4. **Favicon** — ⚠ **cannot be changed with CSS.** Browsers load the favicon from the server before any stylesheet applies. The slot still shows a preview so you can prepare the file; to actually change it, replace \`favicon.ico\` inside the \`jellyfin-web\` folder on your server.
5. **Android-TV banner** — the logo used in the 10-foot layout, targeted with \`.layout-tv\` prefixed rules. Note: this only affects web-based TV clients; the native Android TV app does not load Custom CSS.

Every slot accepts a **URL or an upload** (uploads are embedded as data URIs) and always shows a **thumbnail preview** once an image is set. SVGs from the Catalog's logo search work too — they are recolorable before applying.`
  },
  {
    id: 'components',
    title: 'Components',
    md: `# Components

Fine-grained control over Jellyfin's UI building blocks:

## Typography
- **Font** — curated web fonts (loaded via \`@import\` from Google Fonts) or a custom \`font-family\` string. Icon fonts are explicitly protected so Material Icons keep rendering.
- **UI text size** — scales \`html { font-size }\` from 80% to 130%. All Jellyfin sizes are em-based, so everything scales proportionally.

## Buttons
- **Corner radius** 0–28 px, **fill style** (filled / outline / soft tint) and **hover effect** (brighten, lift, glow, none).

## Cards
- **Corner radius** for posters and thumbnails (\`.cardBox\`, \`.cardImageContainer\`, …).
- **Hover effect** — lift (rise + shadow), glow (accent halo), zoom (image scale) or none.

## Progress bars
- **Style**: flat, rounded, glow or striped; **height** 2–16 px. Applies to the resume bars on cards (\`.itemProgressBar\`) — the player slider follows the accent color.

## Chrome
- **Header**: solid, fully transparent, or frosted-glass blur (\`backdrop-filter\`).
- **Side menu**: solid, floating (inset, rounded, shadowed) or translucent blur.
- **Active tab**: underline, pill or block highlight.
- **Animation speed**: off / slow / normal / fast — scales all transition durations, "off" also kills Jellyfin's own animations.`
  },
  {
    id: 'editor',
    title: 'Code editor',
    md: `# Code editor

The right-hand pane shows the **complete generated CSS in plain text** — syntax-highlighted, line-numbered, and fully editable. Every keystroke is fed back into the live preview after a ~0.3 s pause.

## How edits and the builder coexist

The document has two regions, separated by a marker comment:

- **Above the marker** — the generated block. You *can* edit it freely, and your edited version is used for preview and export. The editor then shows an **"edited"** chip: your manual version stays active **until you change any builder control**, which regenerates the block. Click **Regenerate** in the chip to discard manual edits deliberately.
- **Below the marker** — your space. Everything here **always survives** builder changes. Imported community themes, snippets and your own rules land here.

## Tips

- \`@import\` lines are automatically hoisted to the top of the exported file (CSS requires imports before all other rules), no matter where you write them.
- If you delete the marker line, the whole document is treated as a manual override — the builder stops rewriting anything until you hit Regenerate.
- Use the preview's view switcher while editing: player-related selectors (\`.videoOsdBottom\`, \`.mdl-slider-*\`) are only visible in the Player view.`
  },
  {
    id: 'catalog',
    title: 'Catalog',
    md: `# Catalog

Three sources of ready-made material:

## Presets
30 built-in AnvilCSS themes (palette + component settings). Applying one **replaces** your current builder state — use Undo to go back.

## Community themes
25 curated full themes from the [awesome-jellyfin](https://github.com/awesome-jellyfin/awesome-jellyfin) list (Scyfin, Catppuccin, JellySkin, Ultrachromic, ElegantFin, …). **Import** adds an \`@import url(…)\` line to your Custom CSS region — the theme loads straight from its CDN, live, in your real Jellyfin tab. Your builder settings stay active on top, so you can combine a community base with your own accent color. Credit and repo links are shown on each card.

## Snippets
27 small, self-contained CSS tweaks (hide watched checkmarks, round cast portraits, slim scrollbars, …). Added as plain CSS to the Custom region where you can edit them.`
  },
  {
    id: 'pool',
    title: 'Theme pool',
    md: `# Theme pool

The pool is your local theme library.

- **Save** stores the complete current state (all panels + custom CSS) under a name.
- **Load** applies a saved theme to the builder (your current work is replaced — Undo works).
- **Overwrite** updates a saved theme with the current state.
- **Rename** and **Delete** manage the list.

## Where is it stored?

In your browser's \`localStorage\`, on the Jellyfin domain you're styling — nothing is sent to any server. It survives reloads and restarts, but it's local to that browser profile: it won't show up on another device or browser without exporting and re-importing the CSS by hand.

**Note:** saved themes include uploaded images (as data URIs), so a pool with many image-heavy themes can grow large. That's fine — it's your disk — but keep it in mind when backing up.`
  },
  {
    id: 'export',
    title: 'Export & install',
    md: `# Export & install

## Exporting

- **Copy CSS** puts the complete theme on the clipboard.
- **Download** saves \`jellyfin-theme.css\`.
- The **size display** updates live. Plain color themes are a few KB; embedded images (uploads) dominate the size. Above **1 MB** a warning appears — Jellyfin accepts large Custom CSS, but every client downloads it on every load, so slim is better.

## Installing server-wide (all users)

1. Open Jellyfin as an administrator.
2. **Dashboard → General**.
3. Scroll to **Custom CSS**, paste the theme.
4. **Save** — connected clients restyle on next reload.

## Installing per user

**Settings → Display → Custom CSS** applies a theme to one account only, and can also *override* the server theme when "disable server-provided CSS" is checked.

## Which clients are affected?

Custom CSS works in every client that embeds jellyfin-web: browsers, the desktop app (Jellyfin Media Player), and web-view based TV clients. Fully native apps (Android/iOS apps' native screens, native Android TV) ignore it.`
  },
  {
    id: 'limitations',
    title: 'Limitations & honesty',
    md: `# Limitations & honesty

Things Custom CSS fundamentally **cannot** do — no tool can, including this one:

- **Favicon** — served by the server before CSS loads. Replace \`favicon.ico\` in the \`jellyfin-web\` folder instead (the Logos panel explains this in place).
- **The very first splash frame** — the loading screen shows for a moment before your CSS is fetched; the stock background may flash briefly.
- **Native apps** — the native Android TV app, and native screens of the mobile apps, don't render web CSS at all.
- **Email templates, image assets in metadata** — outside the web UI's DOM.

And an honest note about how this actually runs:

- AnvilCSS is a userscript (Tampermonkey/Violentmonkey) — one of those extensions has to be installed and the script enabled on your Jellyfin domain. There is no server-side component that applies your theme by itself.
- The sidebar only exists in your own browser tab. Other users of the same Jellyfin server won't see it or your in-progress edits — only the CSS you actually paste into **Dashboard → General → Custom CSS** (or a user's own Custom CSS field) is server-wide/shared.`
  }
];
