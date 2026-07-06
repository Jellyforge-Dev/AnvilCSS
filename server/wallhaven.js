import express from 'express';
import path from 'node:path';
import fs from 'node:fs';

const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000; // catalog refreshes on a 7-day interval
const ENRICH_CONCURRENCY = 4;
const ENRICH_LIMIT = 24;

async function enrichUploaders(wallpapers) {
  const queue = wallpapers.slice(0, ENRICH_LIMIT);
  const workers = Array.from({ length: ENRICH_CONCURRENCY }, async () => {
    let item;
    while ((item = queue.shift())) {
      try {
        const res = await fetch(`https://wallhaven.cc/api/v1/w/${item.id}`);
        if (!res.ok) continue;
        const detail = await res.json();
        const username = detail.data?.uploader?.username;
        if (username) {
          item.uploader = username;
          item.uploaderUrl = `https://wallhaven.cc/user/${username}`;
        }
      } catch {
        // leave uploader empty on failure — the grid still renders
      }
    }
  });
  await Promise.all(workers);
}

export function wallhavenRouter(dataDir) {
  const cacheFile = path.join(dataDir, 'wallhaven-cache.json');
  let cache = {};
  try {
    cache = JSON.parse(fs.readFileSync(cacheFile, 'utf8'));
  } catch {
    cache = {};
  }

  const pruneExpired = () => {
    const now = Date.now();
    for (const key of Object.keys(cache)) {
      if (!cache[key] || typeof cache[key].at !== 'number' || now - cache[key].at >= CACHE_TTL_MS) {
        delete cache[key];
      }
    }
  };

  const persist = () => {
    fs.writeFile(cacheFile, JSON.stringify(cache), () => {});
  };

  // Drop stale entries left over from previous runs, then rewrite the file once.
  pruneExpired();
  persist();

  const router = express.Router();

  router.get('/search', async (req, res) => {
    const params = new URLSearchParams();
    params.set('purity', '100'); // SFW only
    params.set('categories', typeof req.query.categories === 'string' ? req.query.categories : '111');
    params.set('sorting', typeof req.query.sorting === 'string' ? req.query.sorting : 'toplist');
    params.set('topRange', '7d');
    params.set('atleast', '1920x1080');
    if (typeof req.query.q === 'string' && req.query.q.trim()) params.set('q', req.query.q.trim());
    if (typeof req.query.page === 'string') params.set('page', req.query.page);

    const key = params.toString();
    const hit = cache[key];
    if (hit && Date.now() - hit.at < CACHE_TTL_MS) {
      return res.json({ ...hit.payload, cached: true, cachedAt: hit.at });
    }

    try {
      const upstream = await fetch(`https://wallhaven.cc/api/v1/search?${key}`);
      if (!upstream.ok) {
        return res.status(502).json({ error: `Wallhaven responded with ${upstream.status}` });
      }
      const body = await upstream.json();
      const wallpapers = (body.data || []).map((w) => ({
        id: w.id,
        url: w.url,
        path: w.path,
        thumb: w.thumbs?.large || w.thumbs?.original,
        resolution: w.resolution,
        colors: w.colors || [],
        category: w.category,
        uploader: null,
        uploaderUrl: null
      }));
      // The search listing omits uploader data; enrich from the detail endpoint.
      // Throttled well below Wallhaven's 45 req/min and amortized by the 7-day cache.
      await enrichUploaders(wallpapers);
      const payload = {
        meta: { currentPage: body.meta?.current_page, lastPage: body.meta?.last_page, total: body.meta?.total },
        wallpapers
      };
      pruneExpired();
      cache[key] = { at: Date.now(), payload };
      persist();
      res.json({ ...payload, cached: false });
    } catch (err) {
      res.status(502).json({ error: `Wallhaven fetch failed: ${err.message}` });
    }
  });

  return router;
}
