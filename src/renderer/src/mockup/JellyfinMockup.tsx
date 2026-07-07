import { useI18n } from '../i18n';
import { MockupView, useUiStore } from '../state/uiStore';
import { LoginView } from './LoginView';
import { DashboardView } from './DashboardView';
import { DetailView } from './DetailView';

const VIEWS: { id: MockupView; labelKey: string }[] = [
  { id: 'login', labelKey: 'mockup.viewLogin' },
  { id: 'dashboard', labelKey: 'mockup.viewDashboard' },
  { id: 'detail', labelKey: 'mockup.viewDetail' }
];

// A static, self-contained stand-in for the real jellyfin-web frontend, built from the same
// classnames/IDs the CSS builder targets (#loginPage, .card, .cardScalable, .mainDrawer, ...).
// It needs no login, no API calls and no vendored Jellyfin source — it only reacts to the live
// CSS AnvilCSS generates, exactly like the real app would.
export function JellyfinMockup() {
  const { t } = useI18n();
  const view = useUiStore((s) => s.mockupView);
  const setView = useUiStore((s) => s.setMockupView);

  return (
    <div className="mockup-stage">
      <div className="mockup-switcher" role="tablist" aria-label={t('mockup.switcherLabel')}>
        {VIEWS.map((v) => (
          <button
            key={v.id}
            type="button"
            role="tab"
            aria-selected={view === v.id}
            className={`mockup-switcher-btn ${view === v.id ? 'is-active' : ''}`}
            onClick={() => setView(v.id)}
          >
            {t(v.labelKey)}
          </button>
        ))}
      </div>

      <div className="mockup-viewport layout-desktop">
        {view === 'login' && <LoginView />}
        {view === 'dashboard' && <DashboardView />}
        {view === 'detail' && <DetailView />}
      </div>
    </div>
  );
}
