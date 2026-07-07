import { SavedTheme, ThemeState } from './state/types';

const POOL_STORAGE_KEY = 'anvilcss.themePool';

function loadPool(): SavedTheme[] {
  try {
    const raw = localStorage.getItem(POOL_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SavedTheme[]) : [];
  } catch {
    return [];
  }
}

function savePool(themes: SavedTheme[]): void {
  localStorage.setItem(POOL_STORAGE_KEY, JSON.stringify(themes));
}

/** Theme pool, persisted entirely in the browser's localStorage — no server involved. */
export async function listThemes(): Promise<SavedTheme[]> {
  return [...loadPool()].sort((a, b) => b.updatedAt - a.updatedAt);
}

export async function createTheme(name: string, state: ThemeState): Promise<SavedTheme> {
  const now = Date.now();
  const saved: SavedTheme = { id: crypto.randomUUID(), name, state, createdAt: now, updatedAt: now };
  savePool([...loadPool(), saved]);
  return saved;
}

export async function updateTheme(id: string, patch: { name?: string; state?: ThemeState }): Promise<SavedTheme> {
  const pool = loadPool();
  const idx = pool.findIndex((t) => t.id === id);
  if (idx === -1) throw new Error('Theme not found');
  const updated: SavedTheme = { ...pool[idx], ...patch, updatedAt: Date.now() };
  pool[idx] = updated;
  savePool(pool);
  return updated;
}

export async function deleteTheme(id: string): Promise<{ ok: boolean }> {
  savePool(loadPool().filter((t) => t.id !== id));
  return { ok: true };
}

/** Community theme CSS is fetched straight from the browser — every catalog source (jsdelivr,
 * github.io) already sends permissive CORS headers, so no server-side proxy is needed. */
export async function fetchThemeCss(url: string): Promise<string> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} fetching ${url}`);
  return res.text();
}

/** Fetches an external image straight from the browser and converts it to a data URL, so canvas
 * based palette extraction isn't tainted. Only works for hosts that send permissive CORS headers —
 * there is no server-side proxy to fall back on in this fully static build. */
export async function fetchImageAsDataUrl(url: string): Promise<string> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} fetching ${url}`);
  const blob = await res.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('image-read-failed'));
    reader.readAsDataURL(blob);
  });
}
