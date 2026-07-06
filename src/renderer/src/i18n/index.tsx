import { createContext, useCallback, useContext, useMemo, useState, ReactNode } from 'react';
import en from './locales/en.json';
import de from './locales/de.json';
import es from './locales/es.json';

export type Lang = 'en' | 'de' | 'es';

export const LANGUAGES: { code: Lang; label: string }[] = [
  { code: 'en', label: 'English' },
  { code: 'de', label: 'Deutsch' },
  { code: 'es', label: 'Español' }
];

const dictionaries: Record<Lang, Record<string, string>> = { en, de, es };

interface I18nContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nContextValue>({
  lang: 'en',
  setLang: () => {},
  t: (key) => key
});

const STORAGE_KEY = 'anvilcss.lang';

function initialLang(): Lang {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'en' || stored === 'de' || stored === 'es') return stored;
  const nav = navigator.language.slice(0, 2);
  if (nav === 'de' || nav === 'es') return nav;
  return 'en';
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initialLang);

  const setLang = useCallback((next: Lang) => {
    localStorage.setItem(STORAGE_KEY, next);
    setLangState(next);
  }, []);

  const t = useCallback(
    (key: string, vars?: Record<string, string | number>) => {
      let text = dictionaries[lang][key] ?? dictionaries.en[key] ?? key;
      if (vars) {
        for (const [name, value] of Object.entries(vars)) {
          text = text.replaceAll(`{{${name}}}`, String(value));
        }
      }
      return text;
    },
    [lang]
  );

  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  return useContext(I18nContext);
}
