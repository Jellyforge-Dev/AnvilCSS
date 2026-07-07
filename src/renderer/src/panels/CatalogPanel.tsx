import { useState } from 'react';
import { useThemeStore } from '../state/themeStore';
import { useUiStore } from '../state/uiStore';
import { useI18n } from '../i18n';
import { PRESETS } from '../catalog/presets';
import { COMMUNITY_THEMES, CSS_SNIPPETS, CommunityTheme } from '../catalog/communityThemes';
import { fetchThemeCss } from '../api';

type CatalogTab = 'presets' | 'community' | 'snippets';

export function CatalogPanel() {
  const { t } = useI18n();
  const [tab, setTab] = useState<CatalogTab>('presets');
  const tabs: { id: CatalogTab; label: string }[] = [
    { id: 'presets', label: t('catalog.tabPresets') },
    { id: 'community', label: t('catalog.tabCommunity') },
    { id: 'snippets', label: t('catalog.tabSnippets') }
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
