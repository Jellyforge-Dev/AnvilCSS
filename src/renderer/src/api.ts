import { SavedTheme, ThemeState } from './state/types';

async function json<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let message = `HTTP ${res.status}`;
    try {
      const body = await res.json();
      if (body?.error) message = body.error;
    } catch {
      // keep default message
    }
    throw new Error(message);
  }
  return res.json() as Promise<T>;
}

export interface WallhavenWallpaper {
  id: string;
  url: string;
  path: string;
  thumb: string;
  resolution: string;
  colors: string[];
  category: string;
  uploader: string | null;
  uploaderUrl: string | null;
}

export interface WallhavenResult {
  meta: { currentPage: number; lastPage: number; total: number };
  wallpapers: WallhavenWallpaper[];
  cached: boolean;
  cachedAt?: number;
}

export function searchWallhaven(params: { q?: string; sorting?: string; page?: number }): Promise<WallhavenResult> {
  const search = new URLSearchParams();
  if (params.q) search.set('q', params.q);
  if (params.sorting) search.set('sorting', params.sorting);
  if (params.page) search.set('page', String(params.page));
  return fetch(`/api/wallhaven/search?${search}`).then((r) => json<WallhavenResult>(r));
}

export function listThemes(): Promise<SavedTheme[]> {
  return fetch('/api/themes').then((r) => json<SavedTheme[]>(r));
}

export function createTheme(name: string, state: ThemeState): Promise<SavedTheme> {
  return fetch('/api/themes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, state })
  }).then((r) => json<SavedTheme>(r));
}

export function updateTheme(id: string, patch: { name?: string; state?: ThemeState }): Promise<SavedTheme> {
  return fetch(`/api/themes/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(patch)
  }).then((r) => json<SavedTheme>(r));
}

export function deleteTheme(id: string): Promise<{ ok: boolean }> {
  return fetch(`/api/themes/${id}`, { method: 'DELETE' }).then((r) => json<{ ok: boolean }>(r));
}

/** Fetch external theme CSS through the server proxy to avoid CORS issues. */
export async function fetchThemeCss(url: string): Promise<string> {
  const res = await fetch(`/api/fetch-css?url=${encodeURIComponent(url)}`);
  if (!res.ok) {
    let message = `HTTP ${res.status}`;
    try {
      const body = await res.json();
      if (body?.error) message = body.error;
    } catch {
      // keep default message
    }
    throw new Error(message);
  }
  return res.text();
}

/** Fetch an external image through the server proxy as a base64 data URL, avoiding canvas CORS tainting. */
export async function fetchImageAsDataUrl(url: string): Promise<string> {
  const res = await fetch(`/api/image-proxy?url=${encodeURIComponent(url)}`);
  const body = await json<{ dataUrl: string }>(res);
  return body.dataUrl;
}

export interface IconifyIcon {
  prefix: string;
  name: string;
}

export async function searchIconify(query: string): Promise<IconifyIcon[]> {
  const res = await fetch(`https://api.iconify.design/search?query=${encodeURIComponent(query)}&limit=48`);
  const body = await json<{ icons: string[] }>(res);
  return (body.icons || []).map((full) => {
    const [prefix, name] = full.split(':');
    return { prefix, name };
  });
}

export function iconifySvgUrl(icon: IconifyIcon, color: string): string {
  return `https://api.iconify.design/${icon.prefix}/${icon.name}.svg?color=${encodeURIComponent(color)}&height=96`;
}

export async function iconifyAsDataUri(icon: IconifyIcon, color: string): Promise<string> {
  const res = await fetch(iconifySvgUrl(icon, color));
  if (!res.ok) throw new Error(`Iconify HTTP ${res.status}`);
  const svg = await res.text();
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}
