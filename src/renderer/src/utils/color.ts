export interface Rgb {
  r: number;
  g: number;
  b: number;
}

export function hexToRgb(hex: string): Rgb | null {
  const m = hex.trim().match(/^#?([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (!m) return null;
  let h = m[1];
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  const n = parseInt(h, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

export function rgbToHex({ r, g, b }: Rgb): string {
  const to = (v: number) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, '0');
  return `#${to(r)}${to(g)}${to(b)}`;
}

export function parseColor(value: string): Rgb | null {
  const hex = hexToRgb(value);
  if (hex) return hex;
  const m = value.match(/rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)/);
  if (m) return { r: +m[1], g: +m[2], b: +m[3] };
  return null;
}

export function hexToHsl(hex: string): { h: number; s: number; l: number } {
  const rgb = hexToRgb(hex) ?? { r: 0, g: 0, b: 0 };
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l };
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h: number;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (max === g) h = ((b - r) / d + 2) / 6;
  else h = ((r - g) / d + 4) / 6;
  return { h: h * 360, s, l };
}

export function hslToHex(h: number, s: number, l: number): string {
  h = ((h % 360) + 360) % 360;
  s = Math.max(0, Math.min(1, s));
  l = Math.max(0, Math.min(1, l));
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let rgb: [number, number, number];
  if (h < 60) rgb = [c, x, 0];
  else if (h < 120) rgb = [x, c, 0];
  else if (h < 180) rgb = [0, c, x];
  else if (h < 240) rgb = [0, x, c];
  else if (h < 300) rgb = [x, 0, c];
  else rgb = [c, 0, x];
  return rgbToHex({ r: (rgb[0] + m) * 255, g: (rgb[1] + m) * 255, b: (rgb[2] + m) * 255 });
}

function channelLuminance(v: number): number {
  const c = v / 255;
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

export function relativeLuminance(rgb: Rgb): number {
  return 0.2126 * channelLuminance(rgb.r) + 0.7152 * channelLuminance(rgb.g) + 0.0722 * channelLuminance(rgb.b);
}

export function contrastRatio(a: string, b: string): number {
  const ca = parseColor(a);
  const cb = parseColor(b);
  if (!ca || !cb) return 1;
  const la = relativeLuminance(ca);
  const lb = relativeLuminance(cb);
  const [hi, lo] = la > lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}

/** Adjust the lightness of `fg` until it reaches `target` contrast against `bg` (WCAG AA default). */
export function ensureContrast(fg: string, bg: string, target = 4.5): string {
  if (contrastRatio(fg, bg) >= target) return fg;
  const bgRgb = parseColor(bg);
  const fgRgb = parseColor(fg);
  if (!bgRgb || !fgRgb) return fg;
  const { h, s } = hexToHsl(rgbToHex(fgRgb));
  const lighten = relativeLuminance(bgRgb) < 0.5;
  let best = fg;
  for (let i = 1; i <= 20; i++) {
    const l = lighten ? Math.min(1, 0.5 + i * 0.025) : Math.max(0, 0.5 - i * 0.025);
    const candidate = hslToHex(h, s, l);
    best = candidate;
    if (contrastRatio(candidate, bg) >= target) return candidate;
  }
  return lighten ? '#ffffff' : '#000000';
}

export interface RandomTheme {
  accent: string;
  background: string;
  surface: string;
  raised: string;
  textPrimary: string;
  textSecondary: string;
  gradientFrom: string;
  gradientTo: string;
}

/** Generate a harmonious dark theme from a random hue using classic color-scheme rotations. */
export function randomHarmoniousTheme(): RandomTheme {
  const hue = Math.random() * 360;
  const schemes = [30, 180, 120, -120, 60];
  const accentShift = schemes[Math.floor(Math.random() * schemes.length)];
  const bgSat = 0.08 + Math.random() * 0.22;
  const bgLight = 0.05 + Math.random() * 0.05;

  const background = hslToHex(hue, bgSat, bgLight);
  const surface = hslToHex(hue, bgSat * 0.9, bgLight + 0.05);
  const raised = hslToHex(hue, bgSat * 0.8, bgLight + 0.11);
  const accent = hslToHex(hue + accentShift, 0.65 + Math.random() * 0.3, 0.5 + Math.random() * 0.12);
  const textPrimary = ensureContrast(hslToHex(hue, 0.1, 0.9), background, 7);
  const textSecondary = ensureContrast(hslToHex(hue, 0.12, 0.62), background, 4.5);

  return {
    accent,
    background,
    surface,
    raised,
    textPrimary,
    textSecondary,
    gradientFrom: background,
    gradientTo: hslToHex(hue + accentShift / 2, bgSat + 0.15, bgLight + 0.07)
  };
}

/** Median-cut palette extraction from an image source (URL or data URI). */
export async function extractPalette(src: string, count = 6): Promise<string[]> {
  const img = await loadImage(src);
  const canvas = document.createElement('canvas');
  const scale = Math.min(1, 120 / Math.max(img.naturalWidth, img.naturalHeight));
  canvas.width = Math.max(1, Math.round(img.naturalWidth * scale));
  canvas.height = Math.max(1, Math.round(img.naturalHeight * scale));
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) throw new Error('canvas-unavailable');
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);

  let pixels: Rgb[] = [];
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] < 128) continue;
    pixels.push({ r: data[i], g: data[i + 1], b: data[i + 2] });
  }
  if (!pixels.length) return [];

  let buckets: Rgb[][] = [pixels];
  while (buckets.length < count) {
    buckets.sort((a, b) => bucketRange(b) - bucketRange(a));
    const widest = buckets.shift();
    if (!widest || widest.length < 2) {
      if (widest) buckets.push(widest);
      break;
    }
    const channel = widestChannel(widest);
    widest.sort((a, b) => a[channel] - b[channel]);
    const mid = Math.floor(widest.length / 2);
    buckets.push(widest.slice(0, mid), widest.slice(mid));
  }

  return buckets
    .map((bucket) => {
      const sum = bucket.reduce((acc, p) => ({ r: acc.r + p.r, g: acc.g + p.g, b: acc.b + p.b }), { r: 0, g: 0, b: 0 });
      return rgbToHex({ r: sum.r / bucket.length, g: sum.g / bucket.length, b: sum.b / bucket.length });
    })
    .filter((hex, i, arr) => arr.indexOf(hex) === i);
}

function bucketRange(bucket: Rgb[]): number {
  const channel = widestChannel(bucket);
  let min = 255;
  let max = 0;
  for (const p of bucket) {
    min = Math.min(min, p[channel]);
    max = Math.max(max, p[channel]);
  }
  return max - min;
}

function widestChannel(bucket: Rgb[]): keyof Rgb {
  const min = { r: 255, g: 255, b: 255 };
  const max = { r: 0, g: 0, b: 0 };
  for (const p of bucket) {
    for (const c of ['r', 'g', 'b'] as const) {
      min[c] = Math.min(min[c], p[c]);
      max[c] = Math.max(max[c], p[c]);
    }
  }
  const ranges = { r: max.r - min.r, g: max.g - min.g, b: max.b - min.b };
  return (Object.keys(ranges) as (keyof Rgb)[]).reduce((a, b) => (ranges[a] >= ranges[b] ? a : b));
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('image-load-failed'));
    img.src = src;
  });
}

export function withAlpha(hex: string, alpha: number): string {
  const rgb = parseColor(hex);
  if (!rgb) return hex;
  return `rgba(${Math.round(rgb.r)},${Math.round(rgb.g)},${Math.round(rgb.b)},${alpha})`;
}

/** Lighten (positive) or darken (negative) a color by a lightness delta 0..1. */
export function shiftLightness(color: string, delta: number): string {
  const rgb = parseColor(color);
  if (!rgb) return color;
  const { h, s, l } = hexToHsl(rgbToHex(rgb));
  return hslToHex(h, s, Math.max(0, Math.min(1, l + delta)));
}
