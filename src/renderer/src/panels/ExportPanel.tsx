import { useMemo } from 'react';
import { useThemeStore } from '../state/themeStore';
import { useUiStore } from '../state/uiStore';
import { useI18n } from '../i18n';
import { generateCss } from '../css/generator';
import { effectiveCss } from '../css/merge';
import { cssByteSize, formatBytes } from '../utils/format';

export function ExportPanel() {
  const { t } = useI18n();
  const theme = useThemeStore((s) => s.theme);
  const editorOverride = useThemeStore((s) => s.editorOverride);
  const pushToast = useUiStore((s) => s.pushToast);

  const css = useMemo(
    () => effectiveCss(generateCss(theme), editorOverride, theme.customCss),
    [theme, editorOverride]
  );
  const size = useMemo(() => cssByteSize(css), [css]);
  const lineCount = useMemo(() => css.split('\n').length, [css]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(css);
      pushToast(t('export.copied'), 'success');
    } catch {
      pushToast(t('export.copyFailed'), 'error');
    }
  };

  const download = () => {
    const blob = new Blob([css], { type: 'text/css' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'jellyfin-theme.css';
    a.click();
    URL.revokeObjectURL(url);
    pushToast(t('export.downloaded'), 'success');
  };

  return (
    <div className="panel-body">
      <div className="export-size">
        <span className="export-size-value">{formatBytes(size)}</span>
        <span className="export-size-label">{t('export.sizeLabel', { lines: lineCount })}</span>
        {size > 1024 * 1024 && <p className="notice notice-warn">{t('export.sizeWarning')}</p>}
      </div>

      <button type="button" className="btn btn-accent btn-xl" onClick={copy}>
        {t('export.copy')}
      </button>
      <button type="button" className="btn btn-ghost btn-xl" onClick={download}>
        {t('export.download')}
      </button>

      <div className="export-steps">
        <h3>{t('export.howTitle')}</h3>
        <ol>
          <li>{t('export.how1')}</li>
          <li>{t('export.how2')}</li>
          <li>{t('export.how3')}</li>
          <li>{t('export.how4')}</li>
        </ol>
        <p className="ctl-hint">{t('export.perUserHint')}</p>
      </div>
    </div>
  );
}
