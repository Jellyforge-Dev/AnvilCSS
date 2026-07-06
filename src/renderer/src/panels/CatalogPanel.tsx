import { useEffect, useState } from 'react';
import { useThemeStore } from '../state/themeStore';
import { useUiStore } from '../state/uiStore';
import { useI18n } from '../i18n';
import { PRESETS } from '../catalog/presets';
import { COMMUNITY_THEMES, CSS_SNIPPETS, CommunityTheme } from '../catalog/communityThemes';
import {
  IconifyIcon,
  WallhavenResult,
  fetchImageAsDataUrl,
  fetchThemeCss,
  iconifyAsDataUri,
  iconifySvgUrl,
  searchIconify,
  searchWallhaven
} from '../api';
import { LogoSlotId } from '../state/types';
import { extractPalette, contrastRatio } from '../utils/color';

type CatalogTab = 'presets' | 'community' | 'snippets' | 'wallpapers' | 'logos';

export function CatalogPanel() {
  const { t } = useI18n();
  const [tab, setTab] = useState<CatalogTab>('presets');
  const tabs: { id: CatalogTab; label: string }[] = [
    { id: 'presets', label: t('catalog.tabPresets') },
    { id: 'community', label: t('catalog.tabCommunity') },
    { id: 'snippets', label: t('catalog.tabSnippets') },
    { id: 'wallpapers', label: t('catalog.tabWallpapers') },
    { id: 'logos', label: t('catalog.tabLogos') }
  ];

  return (
    <div className="panel-body">
      <div className="catalog-tabs">
        {tabs.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`catalog-tab ${tab === item.id ? 'is-active' : ''}`}
            onClick={() => setTab(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>
      {tab === 'presets' && <PresetsTab />}
      {tab === 'community' && <CommunityTab />}
      {tab === 'snippets' && <SnippetsTab />}
      {tab === 'wallpapers' && <WallpapersTab />}
      {tab === 'logos' && <LogosTab />}
    </div>
  );
}

function PresetsTab() {
  const { t } = useI18n();
  const applyTheme = useThemeStore((s) => s.applyTheme);
  const pushToast = useUiStore((s) => s.pushToast);
  return (
    <div className="preset-grid">
      {PRESETS.map((preset) => (
        <button
          key={preset.id}
          type="button"
          className="preset-card"
          onClick={() => {
            applyTheme(preset.build());
            pushToast(t('catalog.presetApplied', { name: preset.name }), 'success');
          }}
        >
          <span className="preset-swatches">
            {preset.swatches.map((color) => (
              <span key={color} style={{ background: color }} />
            ))}
          </span>
          <span className="preset-name">{preset.name}</span>
          <span className="preset-desc">{t(preset.descKey)}</span>
        </button>
      ))}
    </div>
  );
}

function CommunityTab() {
  const { t } = useI18n();
  const appendCustomCss = useThemeStore((s) => s.appendCustomCss);
  const pushToast = useUiStore((s) => s.pushToast);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const applyFull = async (theme: CommunityTheme) => {
    setLoadingId(theme.id);
    try {
      const css = await fetchThemeCss(theme.importUrl);
      appendCustomCss(`/* ${theme.name} by ${theme.author} — ${theme.repo} */\n${css.trim()}`);
      pushToast(t('catalog.themeApplied', { name: theme.name }), 'success');
    } catch (err) {
      pushToast((err as Error).message, 'error');
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <>
      <p className="ctl-hint panel-intro">{t('catalog.communityIntro')}</p>
      <div className="community-list">
        {COMMUNITY_THEMES.map((theme) => (
          <div key={theme.id} className="community-card">
            <span className="community-accent" style={{ background: theme.accent }} />
            <div className="community-info">
              <span className="community-name">{theme.name}</span>
              <span className="community-author">
                {t('catalog.by')}{' '}
                <a href={theme.repo} target="_blank" rel="noreferrer">
                  {theme.author}
                </a>
              </span>
              <span className="community-desc">{t(theme.descKey)}</span>
            </div>
            <div className="community-actions">
              <button
                type="button"
                className="btn btn-accent btn-sm"
                disabled={loadingId !== null}
                onClick={() => applyFull(theme)}
              >
                {loadingId === theme.id ? t('common.loading') : t('catalog.applyFull')}
              </button>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => {
                  appendCustomCss(`/* ${theme.name} by ${theme.author} — ${theme.repo} */\n@import url('${theme.importUrl}');`);
                  pushToast(t('catalog.themeImported', { name: theme.name }), 'success');
                }}
              >
                {t('catalog.import')}
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function SnippetsTab() {
  const { t } = useI18n();
  const appendCustomCss = useThemeStore((s) => s.appendCustomCss);
  const pushToast = useUiStore((s) => s.pushToast);
  return (
    <div className="community-list">
      {CSS_SNIPPETS.map((snippet) => (
        <div key={snippet.id} className="community-card">
          <div className="community-info">
            <span className="community-name">{t(snippet.nameKey)}</span>
            <span className="community-desc">{t(snippet.descKey)}</span>
          </div>
          <button
            type="button"
            className="btn btn-accent"
            onClick={() => {
              appendCustomCss(snippet.css);
              pushToast(t('catalog.snippetAdded', { name: t(snippet.nameKey) }), 'success');
            }}
          >
            {t('catalog.add')}
          </button>
        </div>
      ))}
    </div>
  );
}

function WallpapersTab() {
  const { t } = useI18n();
  const update = useThemeStore((s) => s.update);
  const autoContrast = useThemeStore((s) => s.autoContrast);
  const pushToast = useUiStore((s) => s.pushToast);
  const [query, setQuery] = useState('');
  const [activeQuery, setActiveQuery] = useState('');
  const [result, setResult] = useState<WallhavenResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const run = async (q: string, page = 1) => {
    setLoading(true);
    setError('');
    try {
      setResult(await searchWallhaven({ q, sorting: q ? 'relevance' : 'toplist', page }));
      setActiveQuery(q);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    run('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const applyAsBackground = (path: string) => {
    update('background', { type: 'url', imageUrl: path });
    pushToast(t('catalog.wallpaperApplied'), 'success');
  };

  const applyPalette = async (path: string) => {
    try {
      const proxied = await fetchImageAsDataUrl(path);
      const palette = await extractPalette(proxied, 6);
      if (palette.length < 3) throw new Error('few');
      const byLum = [...palette].sort((a, b) => contrastRatio('#000000', a) - contrastRatio('#000000', b));
      update('colors', {
        background: byLum[0],
        surface: byLum[1],
        raised: byLum[2] ?? byLum[1],
        accent: byLum[byLum.length - 1]
      });
      autoContrast();
      pushToast(t('colors.extractDone'), 'success');
    } catch {
      pushToast(t('colors.extractFailed'), 'error');
    }
  };

  return (
    <>
      <form
        className="catalog-search"
        onSubmit={(e) => {
          e.preventDefault();
          run(query);
        }}
      >
        <input
          type="text"
          className="ctl-text"
          placeholder={t('catalog.wallpaperSearch')}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit" className="btn btn-accent">
          {t('common.search')}
        </button>
      </form>
      <p className="ctl-hint">
        {t('catalog.wallhavenNote')}
        {result?.cached && result.cachedAt
          ? ` · ${t('catalog.cachedAt', { date: new Date(result.cachedAt).toLocaleDateString() })}`
          : ''}
      </p>
      {loading && <p className="ctl-hint">{t('common.loading')}</p>}
      {error && <p className="notice notice-warn">{error}</p>}
      <div className="wall-grid">
        {result?.wallpapers.map((w) => (
          <div key={w.id} className="wall-card">
            <img src={w.thumb} alt="" loading="lazy" referrerPolicy="no-referrer" />
            <div className="wall-meta">
              <span className="wall-res">{w.resolution}</span>
              <span className="wall-colors">
                {w.colors.slice(0, 5).map((c) => (
                  <span key={c} style={{ background: c }} title={c} />
                ))}
              </span>
              {w.uploader && (
                <a className="wall-artist" href={w.uploaderUrl ?? '#'} target="_blank" rel="noreferrer">
                  {t('catalog.artist')}: {w.uploader}
                </a>
              )}
              <div className="wall-actions">
                <button type="button" className="btn btn-accent btn-sm" onClick={() => applyAsBackground(w.path)}>
                  {t('catalog.useBackground')}
                </button>
                <button type="button" className="btn btn-ghost btn-sm" onClick={() => applyPalette(w.path)}>
                  {t('catalog.usePalette')}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {result && result.meta.lastPage > 1 && (
        <div className="wall-pager">
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            disabled={loading || result.meta.currentPage <= 1}
            onClick={() => run(activeQuery, result.meta.currentPage - 1)}
          >
            {t('catalog.pagePrev')}
          </button>
          <span className="wall-pager-label">
            {t('catalog.pageOf', { current: String(result.meta.currentPage), last: String(result.meta.lastPage) })}
          </span>
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            disabled={loading || result.meta.currentPage >= result.meta.lastPage}
            onClick={() => run(activeQuery, result.meta.currentPage + 1)}
          >
            {t('catalog.pageNext')}
          </button>
        </div>
      )}
    </>
  );
}

function LogosTab() {
  const { t } = useI18n();
  const theme = useThemeStore((s) => s.theme);
  const update = useThemeStore((s) => s.update);
  const pushToast = useUiStore((s) => s.pushToast);
  const [query, setQuery] = useState('media');
  const [icons, setIcons] = useState<IconifyIcon[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [color, setColor] = useState('#ffffff');
  const [slot, setSlot] = useState<LogoSlotId>('header');

  const run = async (q: string) => {
    if (!q.trim()) return;
    setLoading(true);
    setError('');
    try {
      setIcons(await searchIconify(q));
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    run('media');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const apply = async (icon: IconifyIcon) => {
    try {
      const uri = await iconifyAsDataUri(icon, color);
      update('logos', { [slot]: { source: uri, enabled: true } });
      pushToast(t('catalog.logoApplied', { slot: t(`logos.${slot}`) }), 'success');
    } catch {
      pushToast(t('catalog.logoFailed'), 'error');
    }
  };

  return (
    <>
      <form
        className="catalog-search"
        onSubmit={(e) => {
          e.preventDefault();
          run(query);
        }}
      >
        <input
          type="text"
          className="ctl-text"
          placeholder={t('catalog.logoSearch')}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit" className="btn btn-accent">
          {t('common.search')}
        </button>
      </form>
      <div className="logo-catalog-controls">
        <label className="ctl-label">
          {t('catalog.logoTarget')}
          <select className="ctl-select" value={slot} onChange={(e) => setSlot(e.target.value as LogoSlotId)}>
            {(Object.keys(theme.logos) as LogoSlotId[]).map((id) => (
              <option key={id} value={id}>
                {t(`logos.${id}`)}
              </option>
            ))}
          </select>
        </label>
        <label className="ctl-label">
          {t('catalog.logoColor')}
          <input type="color" className="ctl-swatch" value={color} onChange={(e) => setColor(e.target.value)} />
        </label>
      </div>
      <p className="ctl-hint">{t('catalog.iconifyNote')}</p>
      {loading && <p className="ctl-hint">{t('common.loading')}</p>}
      {error && <p className="notice notice-warn">{error}</p>}
      <div className="icon-grid">
        {icons.map((icon) => (
          <button
            key={`${icon.prefix}:${icon.name}`}
            type="button"
            className="icon-cell"
            title={`${icon.prefix}:${icon.name}`}
            onClick={() => apply(icon)}
          >
            <img src={iconifySvgUrl(icon, color)} alt={icon.name} loading="lazy" />
          </button>
        ))}
      </div>
    </>
  );
}
