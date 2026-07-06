import { useEffect, useMemo, useState } from 'react';
import { marked } from 'marked';
import { Search } from 'lucide-react';
import { useI18n } from '../i18n';
import { WIKI_CONTENT, WikiSection } from '../wiki/content';

export function WikiPanel() {
  const { lang, t } = useI18n();
  const sections: WikiSection[] = WIKI_CONTENT[lang] ?? WIKI_CONTENT.en;
  const [query, setQuery] = useState('');
  const [activeId, setActiveId] = useState(sections[0]?.id ?? '');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return sections;
    return sections.filter(
      (s) => s.title.toLowerCase().includes(q) || s.md.toLowerCase().includes(q)
    );
  }, [sections, query]);

  useEffect(() => {
    if (!filtered.some((s) => s.id === activeId)) {
      setActiveId(filtered[0]?.id ?? '');
    }
  }, [filtered, activeId]);

  const active = filtered.find((s) => s.id === activeId) ?? filtered[0];

  const html = useMemo(() => (active ? (marked.parse(active.md) as string) : ''), [active]);

  return (
    <div className="panel-body wiki-layout">
      <div className="wiki-col">
        <div className="wiki-search">
          <Search size={15} aria-hidden />
          <input
            type="search"
            className="wiki-search-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('wiki.searchPlaceholder')}
            aria-label={t('wiki.searchPlaceholder')}
          />
        </div>
        <nav className="wiki-nav" aria-label={t('wiki.navLabel')}>
          {filtered.map((section) => (
            <button
              key={section.id}
              type="button"
              className={`wiki-nav-item ${section.id === active?.id ? 'is-active' : ''}`}
              onClick={() => setActiveId(section.id)}
            >
              {section.title}
            </button>
          ))}
          {filtered.length === 0 && <p className="wiki-no-results">{t('wiki.searchNoResults')}</p>}
        </nav>
      </div>
      {active ? (
        <article className="wiki-article" dangerouslySetInnerHTML={{ __html: html }} />
      ) : (
        <p className="wiki-no-results wiki-no-results-article">{t('wiki.searchNoResults')}</p>
      )}
    </div>
  );
}
