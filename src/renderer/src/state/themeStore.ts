import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { temporal } from 'zundo';
import { ThemeState, defaultTheme } from './types';
import { ensureContrast, randomHarmoniousTheme } from '../utils/color';

type SectionKey = Exclude<keyof ThemeState, 'customCss'>;

interface ThemeStore {
  theme: ThemeState;
  /** Manual edits inside the generated region; kept until the next builder change. */
  editorOverride: string | null;
  update: <K extends SectionKey>(key: K, patch: Partial<ThemeState[K]>) => void;
  applyTheme: (state: ThemeState) => void;
  randomize: () => void;
  autoContrast: () => void;
  setCustomCss: (css: string) => void;
  appendCustomCss: (snippet: string) => void;
  setEditorOverride: (css: string | null) => void;
  reset: () => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    temporal(
      (set) => ({
        theme: defaultTheme(),
        editorOverride: null,

        update: (key, patch) =>
          set((s) => ({
            theme: { ...s.theme, [key]: { ...(s.theme[key] as object), ...patch } as ThemeState[typeof key] },
            editorOverride: null
          })),

        applyTheme: (state) => set({ theme: normalizeTheme(state), editorOverride: null }),

        randomize: () =>
          set((s) => {
            const r = randomHarmoniousTheme();
            return {
              theme: {
                ...s.theme,
                colors: {
                  accent: r.accent,
                  background: r.background,
                  surface: r.surface,
                  raised: r.raised,
                  textPrimary: r.textPrimary,
                  textSecondary: r.textSecondary
                },
                background: {
                  ...s.theme.background,
                  gradientFrom: r.gradientFrom,
                  gradientTo: r.gradientTo
                }
              },
              editorOverride: null
            };
          }),

        autoContrast: () =>
          set((s) => {
            const { colors } = s.theme;
            return {
              theme: {
                ...s.theme,
                colors: {
                  ...colors,
                  textPrimary: ensureContrast(colors.textPrimary, colors.background, 7),
                  textSecondary: ensureContrast(colors.textSecondary, colors.background, 4.5),
                  accent: ensureContrast(colors.accent, colors.background, 3)
                }
              },
              editorOverride: null
            };
          }),

        setCustomCss: (css) => set((s) => ({ theme: { ...s.theme, customCss: css } })),

        appendCustomCss: (snippet) =>
          set((s) => ({
            theme: {
              ...s.theme,
              customCss: s.theme.customCss ? `${s.theme.customCss.replace(/\s+$/, '')}\n\n${snippet}\n` : `${snippet}\n`
            }
          })),

        setEditorOverride: (css) => set({ editorOverride: css }),

        reset: () => set({ theme: defaultTheme(), editorOverride: null })
      }),
      {
        limit: 200,
        partialize: (s) => ({ theme: s.theme, editorOverride: s.editorOverride })
      }
    ),
    {
      name: 'anvilcss.workspace',
      partialize: (s) => ({ theme: s.theme, editorOverride: s.editorOverride }),
      merge: (persisted, current) => {
        const saved = (persisted ?? {}) as {
          theme?: Partial<ThemeState>;
          editorOverride?: string | null;
        };
        return {
          ...current,
          theme: saved.theme ? normalizeTheme(saved.theme) : current.theme,
          editorOverride: typeof saved.editorOverride === 'string' ? saved.editorOverride : null
        };
      }
    }
  )
);

/** Merge a possibly older saved state onto current defaults so new fields never end up undefined. */
export function normalizeTheme(state: Partial<ThemeState>): ThemeState {
  const base = defaultTheme();
  const merged: ThemeState = { ...base, ...state } as ThemeState;
  for (const key of Object.keys(base) as (keyof ThemeState)[]) {
    const def = base[key];
    if (typeof def === 'object' && def !== null && key !== 'logos') {
      (merged as unknown as Record<string, unknown>)[key] = { ...(def as object), ...((state[key] as object) || {}) };
    }
  }
  merged.logos = { ...base.logos, ...(state.logos || {}) };
  merged.customCss = typeof state.customCss === 'string' ? state.customCss : '';
  return merged;
}
