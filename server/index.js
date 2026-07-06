import 'dotenv/config';
import express from 'express';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { wallhavenRouter } from './wallhaven.js';
import { themesRouter } from './themes.js';
import { themeRouter } from './theme.js';
import { mockJellyfinRouter } from './mockJellyfin.js';
import { injectHtml } from './injectHtml.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');
const dataDir = path.join(rootDir, 'data');
const distAnvilDir = path.join(rootDir, 'dist', 'anvil');
const jellyfinWebDir = path.join(__dirname, 'jellyfin-web');
const indexHtmlPath = path.join(jellyfinWebDir, 'index.html');

fs.mkdirSync(dataDir, { recursive: true });

if (!fs.existsSync(indexHtmlPath)) {
  console.error(
    `Missing ${indexHtmlPath} — run \`npm run fetch-jellyfin-web\` first ` +
      '(or use `docker compose up`, which vendors it automatically).'
  );
  process.exit(1);
}

const app = express();
app.use(express.json({ limit: '25mb' }));

// In-memory mock of the real Jellyfin REST API — must win before static/SPA fallback below.
app.use('/', mockJellyfinRouter(dataDir));

// AnvilCSS's own API — never part of the mocked Jellyfin surface.
app.use('/api/wallhaven', wallhavenRouter(dataDir));
app.use('/api/themes', themesRouter(dataDir));

// Proxy for external theme CSS so the sidebar's catalog preview is not blocked by CORS
app.get('/api/fetch-css', async (req, res) => {
  const url = req.query.url;
  if (typeof url !== 'string' || !/^https:\/\//.test(url)) {
    return res.status(400).json({ error: 'A https:// URL is required' });
  }
  try {
    const upstream = await fetch(url, { redirect: 'follow' });
    if (!upstream.ok) {
      return res.status(502).json({ error: `Upstream responded with ${upstream.status}` });
    }
    const css = await upstream.text();
    res.type('text/css').send(css);
  } catch (err) {
    res.status(502).json({ error: `Fetch failed: ${err.message}` });
  }
});

// Proxy for external background images so canvas-based palette extraction is not CORS-tainted
const MAX_IMAGE_BYTES = 25 * 1024 * 1024;

app.get('/api/image-proxy', async (req, res) => {
  const url = req.query.url;
  if (typeof url !== 'string' || !/^https?:\/\//.test(url)) {
    return res.status(400).json({ error: 'An http(s):// URL is required' });
  }
  try {
    const upstream = await fetch(url, { redirect: 'follow' });
    if (!upstream.ok) {
      return res.status(502).json({ error: `Upstream responded with ${upstream.status}` });
    }
    const contentType = upstream.headers.get('content-type') ?? '';
    if (!contentType.startsWith('image/')) {
      return res.status(415).json({ error: `URL did not return an image (content-type: ${contentType || 'missing'})` });
    }
    const declaredLength = Number(upstream.headers.get('content-length') ?? 0);
    if (declaredLength > MAX_IMAGE_BYTES) {
      return res.status(413).json({ error: 'Image exceeds the 25 MB limit' });
    }
    const buffer = Buffer.from(await upstream.arrayBuffer());
    if (buffer.byteLength > MAX_IMAGE_BYTES) {
      return res.status(413).json({ error: 'Image exceeds the 25 MB limit' });
    }
    res.json({ dataUrl: `data:${contentType};base64,${buffer.toString('base64')}` });
  } catch (err) {
    res.status(502).json({ error: `Fetch failed: ${err.message}` });
  }
});

app.get('/api/health', (_req, res) => res.json({ ok: true }));

// AnvilCSS's own assets injected into the real Jellyfin page.
app.use('/anvil', express.static(distAnvilDir));
app.use('/anvil', themeRouter(dataDir));

// Real jellyfin-web index.html, with the sidebar script/CSS spliced in before </head>.
function sendInjectedIndex(_req, res) {
  const html = fs.readFileSync(indexHtmlPath, 'utf8');
  res.type('html').send(injectHtml(html));
}
app.get('/', sendInjectedIndex);
app.get('/index.html', sendInjectedIndex);

// The real jellyfin-web static assets (JS/CSS/fonts/images), byte-for-byte.
app.use(express.static(jellyfinWebDir, { index: false }));

// SPA fallback — any remaining unmatched route also gets the injected index so client-side
// route refresh/deep-links don't 404.
app.get('*', sendInjectedIndex);

const port = process.env.PORT || 8283;
app.listen(port, () => {
  console.log(`AnvilCSS standalone preview server listening on http://localhost:${port}`);
});
