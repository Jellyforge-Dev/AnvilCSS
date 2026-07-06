import express from 'express';
import path from 'node:path';
import fs from 'node:fs';

/**
 * Serves the live, currently-applied theme so every proxied page shows the same look
 * without waiting for the injected sidebar's own JS to compute it first.
 * The sidebar remains the single source of truth for CSS generation (src/renderer/src/css) —
 * this router only persists and re-serves whatever CSS text the sidebar already computed.
 */
export function themeRouter(dataDir) {
  const cssFile = path.join(dataDir, 'theme.css');
  const stateFile = path.join(dataDir, 'theme-state.json');

  const router = express.Router();

  router.get('/anvil-theme.css', (_req, res) => {
    res.set('Cache-Control', 'no-store');
    res.type('text/css');
    try {
      res.send(fs.readFileSync(cssFile, 'utf8'));
    } catch {
      res.send('/* AnvilCSS: no theme applied yet */');
    }
  });

  router.get('/theme', (_req, res) => {
    res.set('Cache-Control', 'no-store');
    try {
      res.type('application/json').send(fs.readFileSync(stateFile, 'utf8'));
    } catch {
      res.json(null);
    }
  });

  router.put('/theme', (req, res) => {
    const { state, css } = req.body || {};
    if (typeof css !== 'string') {
      return res.status(400).json({ error: 'css (string) is required' });
    }
    fs.writeFileSync(cssFile, css);
    if (state && typeof state === 'object') {
      fs.writeFileSync(stateFile, JSON.stringify(state));
    }
    res.json({ ok: true });
  });

  return router;
}
