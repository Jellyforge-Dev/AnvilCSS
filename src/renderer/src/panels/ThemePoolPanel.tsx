import { useEffect, useState } from 'react';
import { useThemeStore, normalizeTheme } from '../state/themeStore';
import { useUiStore } from '../state/uiStore';
import { useI18n } from '../i18n';
import { SavedTheme } from '../state/types';
import { createTheme, deleteTheme, listThemes, updateTheme } from '../api';

export function ThemePoolPanel() {
  const { t } = useI18n();
  const theme = useThemeStore((s) => s.theme);
  const applyTheme = useThemeStore((s) => s.applyTheme);
  const pushToast = useUiStore((s) => s.pushToast);
  const [themes, setThemes] = useState<SavedTheme[]>([]);
  const [name, setName] = useState('');
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [error, setError] = useState('');

  const refresh = async () => {
    try {
      setThemes(await listThemes());
      setError('');
    } catch (err) {
      setError((err as Error).message);
    }
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const save = async () => {
    const trimmed = name.trim();
    if (!trimmed) {
      pushToast(t('pool.nameRequired'), 'error');
      return;
    }
    try {
      await createTheme(trimmed, theme);
      setName('');
      await refresh();
      pushToast(t('pool.saved', { name: trimmed }), 'success');
    } catch (err) {
      pushToast((err as Error).message, 'error');
    }
  };

  const load = (saved: SavedTheme) => {
    applyTheme(normalizeTheme(saved.state));
    pushToast(t('pool.loaded', { name: saved.name }), 'success');
  };

  const overwrite = async (saved: SavedTheme) => {
    try {
      await updateTheme(saved.id, { state: theme });
      await refresh();
      pushToast(t('pool.overwritten', { name: saved.name }), 'success');
    } catch (err) {
      pushToast((err as Error).message, 'error');
    }
  };

  const rename = async (saved: SavedTheme) => {
    const trimmed = renameValue.trim();
    setRenamingId(null);
    if (!trimmed || trimmed === saved.name) return;
    try {
      await updateTheme(saved.id, { name: trimmed });
      await refresh();
      pushToast(t('pool.renamed', { name: trimmed }), 'success');
    } catch (err) {
      pushToast((err as Error).message, 'error');
    }
  };

  const remove = async (saved: SavedTheme) => {
    if (!window.confirm(t('pool.deleteConfirm', { name: saved.name }))) return;
    try {
      await deleteTheme(saved.id);
      await refresh();
      pushToast(t('pool.deleted', { name: saved.name }), 'info');
    } catch (err) {
      pushToast((err as Error).message, 'error');
    }
  };

  return (
    <div className="panel-body">
      <div className="pool-save">
        <input
          type="text"
          className="ctl-text"
          placeholder={t('pool.namePlaceholder')}
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && save()}
        />
        <button type="button" className="btn btn-accent" onClick={save}>
          {t('pool.saveCurrent')}
        </button>
      </div>
      <p className="ctl-hint">{t('pool.intro')}</p>
      {error && <p className="notice notice-warn">{t('pool.serverError', { error })}</p>}
      {!error && themes.length === 0 && <p className="ctl-hint pool-empty">{t('pool.empty')}</p>}
      <div className="pool-list">
        {themes.map((saved) => (
          <div key={saved.id} className="pool-item">
            <span
              className="pool-swatch"
              style={{
                background: `linear-gradient(135deg, ${saved.state?.colors?.background ?? '#101010'} 55%, ${
                  saved.state?.colors?.accent ?? '#00a4dc'
                } 55%)`
              }}
            />
            <div className="pool-info">
              {renamingId === saved.id ? (
                <input
                  type="text"
                  className="ctl-text"
                  value={renameValue}
                  autoFocus
                  onChange={(e) => setRenameValue(e.target.value)}
                  onBlur={() => rename(saved)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') rename(saved);
                    if (e.key === 'Escape') setRenamingId(null);
                  }}
                />
              ) : (
                <span className="pool-name">{saved.name}</span>
              )}
              <span className="pool-date">{new Date(saved.updatedAt).toLocaleString()}</span>
            </div>
            <div className="pool-actions">
              <button type="button" className="btn btn-accent btn-sm" onClick={() => load(saved)}>
                {t('pool.load')}
              </button>
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => overwrite(saved)} title={t('pool.overwriteHint')}>
                {t('pool.overwrite')}
              </button>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => {
                  setRenamingId(saved.id);
                  setRenameValue(saved.name);
                }}
              >
                {t('pool.rename')}
              </button>
              <button type="button" className="btn btn-danger btn-sm" onClick={() => remove(saved)}>
                {t('common.delete')}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
