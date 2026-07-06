import { useEffect, useMemo, useState } from 'react';
import { useStore } from 'zustand';
import {
  BookOpen,
  Code2,
  FolderOpen,
  Hammer,
  Image as ImageIcon,
  LucideIcon,
  Palette,
  Puzzle,
  Save,
  Upload
} from 'lucide-react';
import { useThemeStore } from './state/themeStore';
import { PanelId, useUiStore } from './state/uiStore';
import { LANGUAGES, Lang, useI18n } from './i18n';
import { generateCss } from './css/generator';
import { effectiveCss } from './css/merge';
import { ColorsPanel } from './panels/ColorsPanel';
import { BackgroundPanel } from './panels/BackgroundPanel';
import { LogosPanel } from './panels/LogosPanel';
import { ComponentsPanel } from './panels/ComponentsPanel';
import { CatalogPanel } from './panels/CatalogPanel';
import { ThemePoolPanel } from './panels/ThemePoolPanel';
import { ExportPanel } from './panels/ExportPanel';
import { WikiPanel } from './panels/WikiPanel';
import { CssEditor } from './editor/CssEditor';

const PANELS: { id: PanelId; Icon: LucideIcon }[] = [
  { id: 'colors', Icon: Palette },
  { id: 'background', Icon: ImageIcon },
  { id: 'logos', Icon: Hammer },
  { id: 'components', Icon: Puzzle },
  { id: 'catalog', Icon: FolderOpen },
  { id: 'pool', Icon: Save },
  { id: 'editor', Icon: Code2 },
  { id: 'export', Icon: Upload },
  { id: 'wiki', Icon: BookOpen }
];

export default function App() {
  const { t, lang, setLang } = useI18n();
  const theme = useThemeStore((s) => s.theme);
  const editorOverride = useThemeStore((s) => s.editorOverride);
  const reset = useThemeStore((s) => s.reset);
  const temporal = useStore(useThemeStore.temporal);

  const activePanel = useUiStore((s) => s.activePanel);
  const setPanel = useUiStore((s) => s.setPanel);
  const collapsed = useUiStore((s) => s.collapsed);
  const toggleCollapsed = useUiStore((s) => s.toggleCollapsed);
  const toasts = useUiStore((s) => s.toasts);
  const pushToast = useUiStore((s) => s.pushToast);

  const [confirmReset, setConfirmReset] = useState(false);

  const liveCss = useMemo(
    () => effectiveCss(generateCss(theme), editorOverride, theme.customCss),
    [theme, editorOverride]
  );

  // Push the freshly computed CSS to the real Jellyfin page behind the sidebar so changes apply
  // instantly (no reload), and persist it server-side so it survives across sessions/devices.
  useEffect(() => {
    let link = document.getElementById('anvil-theme-live') as HTMLStyleElement | null;
    if (!link) {
      link = document.createElement('style');
      link.id = 'anvil-theme-live';
      document.head.appendChild(link);
    }
    link.textContent = liveCss;

    const handle = window.setTimeout(() => {
      fetch('/anvil/theme', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ state: theme, css: liveCss })
      }).catch(() => {
        // Best-effort persistence — the live <style> tag above already applied the change.
      });
    }, 400);
    return () => window.clearTimeout(handle);
  }, [liveCss, theme]);

  const doReset = () => {
    reset();
    temporal.clear();
    setConfirmReset(false);
    pushToast(t('app.resetDone'), 'info');
  };

  return (
    <div className={`anvil-sidebar ${collapsed ? 'is-collapsed' : ''}`}>
      <button
        type="button"
        className="anvil-toggle-tab"
        onClick={toggleCollapsed}
        title={t(collapsed ? 'app.expand' : 'app.collapse')}
        aria-label={t(collapsed ? 'app.expand' : 'app.collapse')}
      >
        <Hammer size={20} />
      </button>

      <div className="app-shell">
        <header className="app-header">
          <div className="app-brand">
            <img src="/anvil/anvilcss-logo.png" alt="" className="app-logo" />
            <div className="app-brand-text">
              <span className="app-name">
                Jellyforge <em>AnvilCSS</em>
              </span>
              <span className="app-tagline">{t('app.tagline')}</span>
            </div>
          </div>
          <div className="app-header-actions">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => temporal.undo()}
              disabled={temporal.pastStates.length === 0}
              title={t('app.undo')}
            >
              ↶
            </button>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => temporal.redo()}
              disabled={temporal.futureStates.length === 0}
              title={t('app.redo')}
            >
              ↷
            </button>
            <button type="button" className="btn btn-ghost btn-warn" onClick={() => setConfirmReset(true)}>
              {t('app.reset')}
            </button>
            <select
              className="ctl-select lang-select"
              value={lang}
              onChange={(e) => setLang(e.target.value as Lang)}
              aria-label={t('app.language')}
            >
              {LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.label}
                </option>
              ))}
            </select>
          </div>
        </header>

        <nav className="panel-rail panel-rail-row" aria-label={t('app.panelsLabel')}>
          {PANELS.map((panel) => (
            <button
              key={panel.id}
              type="button"
              className={`rail-btn ${activePanel === panel.id ? 'is-active' : ''}`}
              onClick={() => setPanel(panel.id)}
              title={t(`panel.${panel.id}`)}
            >
              <span className="rail-icon" aria-hidden>
                <panel.Icon size={18} />
              </span>
              <span className="rail-label">{t(`panel.${panel.id}`)}</span>
            </button>
          ))}
        </nav>

        <div className="app-main">
          <aside className={`panel-host ${activePanel === 'wiki' ? 'panel-host-wide' : ''} ${activePanel === 'editor' ? 'panel-host-editor' : ''}`}>
            {activePanel !== 'editor' && <h2 className="panel-title">{t(`panel.${activePanel}`)}</h2>}
            {activePanel === 'colors' && <ColorsPanel />}
            {activePanel === 'background' && <BackgroundPanel />}
            {activePanel === 'logos' && <LogosPanel />}
            {activePanel === 'components' && <ComponentsPanel />}
            {activePanel === 'catalog' && <CatalogPanel />}
            {activePanel === 'pool' && <ThemePoolPanel />}
            {activePanel === 'editor' && <CssEditor />}
            {activePanel === 'export' && <ExportPanel />}
            {activePanel === 'wiki' && <WikiPanel />}
          </aside>
        </div>

        {confirmReset && (
          <div className="modal-backdrop" role="dialog" aria-modal="true">
            <div className="modal">
              <h3>{t('app.resetTitle')}</h3>
              <p>{t('app.resetBody')}</p>
              <div className="modal-actions">
                <button type="button" className="btn btn-ghost" onClick={() => setConfirmReset(false)}>
                  {t('common.cancel')}
                </button>
                <button type="button" className="btn btn-danger" onClick={doReset}>
                  {t('app.resetConfirm')}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="toast-stack" aria-live="polite">
          {toasts.map((toast) => (
            <div key={toast.id} className={`toast-item toast-${toast.kind}`}>
              {toast.message}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
