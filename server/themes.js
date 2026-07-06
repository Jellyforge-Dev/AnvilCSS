import express from 'express';
import path from 'node:path';
import fs from 'node:fs';
import crypto from 'node:crypto';

export function themesRouter(dataDir) {
  const file = path.join(dataDir, 'themes.json');

  const load = () => {
    try {
      const parsed = JSON.parse(fs.readFileSync(file, 'utf8'));
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  const save = (themes) => {
    fs.writeFileSync(file, JSON.stringify(themes, null, 2));
  };

  const router = express.Router();

  router.get('/', (_req, res) => {
    res.json(load());
  });

  router.post('/', (req, res) => {
    const { name, state } = req.body || {};
    if (typeof name !== 'string' || !name.trim() || typeof state !== 'object' || state === null) {
      return res.status(400).json({ error: 'name (string) and state (object) are required' });
    }
    const themes = load();
    const theme = {
      id: crypto.randomUUID(),
      name: name.trim().slice(0, 80),
      state,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    themes.push(theme);
    save(themes);
    res.status(201).json(theme);
  });

  router.put('/:id', (req, res) => {
    const themes = load();
    const theme = themes.find((t) => t.id === req.params.id);
    if (!theme) return res.status(404).json({ error: 'Theme not found' });
    if (typeof req.body?.name === 'string' && req.body.name.trim()) {
      theme.name = req.body.name.trim().slice(0, 80);
    }
    if (typeof req.body?.state === 'object' && req.body.state !== null) {
      theme.state = req.body.state;
    }
    theme.updatedAt = Date.now();
    save(themes);
    res.json(theme);
  });

  router.delete('/:id', (req, res) => {
    const themes = load();
    const next = themes.filter((t) => t.id !== req.params.id);
    if (next.length === themes.length) return res.status(404).json({ error: 'Theme not found' });
    save(next);
    res.json({ ok: true });
  });

  return router;
}
