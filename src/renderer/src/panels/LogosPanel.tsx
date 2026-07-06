import { DoorOpen, LucideIcon, Sparkles, Star, Tag, Tv } from 'lucide-react';
import { useThemeStore } from '../state/themeStore';
import { useUiStore } from '../state/uiStore';
import { useI18n } from '../i18n';
import { LogoSlotId } from '../state/types';
import { TextRow, UploadButton } from '../components/ui';

const SLOTS: { id: LogoSlotId; Icon: LucideIcon; cssTarget: string }[] = [
  { id: 'header', Icon: Tag, cssTarget: '.pageTitleWithLogo' },
  { id: 'login', Icon: DoorOpen, cssTarget: '.splashLogo / .manualLoginForm .sectionTitle' },
  { id: 'splashBackground', Icon: Sparkles, cssTarget: 'html.preload' },
  { id: 'favicon', Icon: Star, cssTarget: '—' },
  { id: 'tvBanner', Icon: Tv, cssTarget: '.layout-tv .pageTitleWithDefaultLogo' }
];

export function LogosPanel() {
  const { t } = useI18n();
  const theme = useThemeStore((s) => s.theme);
  const update = useThemeStore((s) => s.update);
  const pushToast = useUiStore((s) => s.pushToast);

  const setSlot = (id: LogoSlotId, patch: Partial<{ source: string; enabled: boolean }>) => {
    update('logos', { [id]: { ...theme.logos[id], ...patch } });
  };

  return (
    <div className="panel-body">
      <p className="ctl-hint panel-intro">{t('logos.intro')}</p>
      {SLOTS.map(({ id, Icon, cssTarget }) => {
        const slot = theme.logos[id];
        return (
          <div key={id} className={`logo-slot ${slot.enabled && slot.source ? 'is-active' : ''}`}>
            <div className="logo-slot-head">
              <span className="logo-slot-icon" aria-hidden>
                <Icon size={19} />
              </span>
              <div className="logo-slot-titles">
                <span className="logo-slot-title">{t(`logos.${id}`)}</span>
                <span className="logo-slot-target">{cssTarget}</span>
              </div>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={slot.enabled}
                  onChange={(e) => setSlot(id, { enabled: e.target.checked })}
                />
                <span className="switch-track" />
              </label>
            </div>
            <p className="ctl-hint">{t(`logos.${id}Desc`)}</p>
            {id === 'favicon' && <p className="notice notice-warn">{t('logos.faviconWarning')}</p>}
            {slot.enabled && (
              <div className="logo-slot-body">
                <TextRow
                  label={t('logos.sourceUrl')}
                  value={slot.source.startsWith('data:') ? '' : slot.source}
                  placeholder="https://…/logo.png"
                  onChange={(v) => setSlot(id, { source: v })}
                />
                <div className="logo-slot-actions">
                  <UploadButton
                    label={t('logos.upload')}
                    onLoad={(uri) => {
                      setSlot(id, { source: uri });
                      pushToast(t('logos.uploadDone'), 'success');
                    }}
                  />
                  {slot.source && (
                    <button type="button" className="btn btn-ghost" onClick={() => setSlot(id, { source: '' })}>
                      {t('common.clear')}
                    </button>
                  )}
                </div>
                {slot.source && (
                  <div className="logo-preview">
                    <img src={slot.source} alt={t(`logos.${id}`)} />
                    {slot.source.startsWith('data:') && <span className="logo-preview-tag">{t('logos.embedded')}</span>}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
