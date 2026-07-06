import { Contrast, Dices, Image as ImageIcon, XCircle } from 'lucide-react';
import { useThemeStore } from '../state/themeStore';
import { useUiStore } from '../state/uiStore';
import { useI18n } from '../i18n';
import { ColorRow, Section } from '../components/ui';
import { fetchImageAsDataUrl } from '../api';
import { contrastRatio, extractPalette } from '../utils/color';

function ContrastBadge({ fg, bg }: { fg: string; bg: string }) {
  const ratio = contrastRatio(fg, bg);
  const level = ratio >= 7 ? 'AAA' : ratio >= 4.5 ? 'AA' : ratio >= 3 ? 'AA18' : null;
  const cls = ratio >= 4.5 ? 'ok' : ratio >= 3 ? 'warn' : 'bad';
  return (
    <span className={`badge badge-${cls}`} title={`${ratio.toFixed(2)}:1`}>
      {ratio.toFixed(1)} {level ?? <XCircle size={12} aria-hidden />}
    </span>
  );
}

export function ColorsPanel() {
  const { t } = useI18n();
  const theme = useThemeStore((s) => s.theme);
  const update = useThemeStore((s) => s.update);
  const randomize = useThemeStore((s) => s.randomize);
  const autoContrast = useThemeStore((s) => s.autoContrast);
  const pushToast = useUiStore((s) => s.pushToast);
  const c = theme.colors;

  const setColor = (key: keyof typeof c) => (value: string) => update('colors', { [key]: value });

  const extractFromBackground = async () => {
    const src = theme.background.type === 'upload' ? theme.background.imageData : theme.background.imageUrl;
    if (!src) {
      pushToast(t('colors.extractNoImage'), 'error');
      return;
    }
    try {
      const proxied = theme.background.type === 'url' ? await fetchImageAsDataUrl(src) : src;
      const palette = await extractPalette(proxied, 6);
      if (palette.length < 3) throw new Error('too-few-colors');
      const byLum = [...palette].sort((a, b) => contrastRatio('#000000', a) - contrastRatio('#000000', b));
      update('colors', {
        background: byLum[0],
        surface: byLum[1] ?? byLum[0],
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
    <div className="panel-body">
      <div className="action-tiles">
        <button type="button" className="action-tile" onClick={randomize}>
          <span className="action-tile-icon" aria-hidden><Dices size={18} /></span>
          <span className="action-tile-title">{t('colors.random')}</span>
          <span className="action-tile-desc">{t('colors.randomDesc')}</span>
        </button>
        <button type="button" className="action-tile" onClick={extractFromBackground}>
          <span className="action-tile-icon" aria-hidden><ImageIcon size={18} /></span>
          <span className="action-tile-title">{t('colors.extract')}</span>
          <span className="action-tile-desc">{t('colors.extractDesc')}</span>
        </button>
        <button type="button" className="action-tile" onClick={() => { autoContrast(); pushToast(t('colors.contrastDone'), 'success'); }}>
          <span className="action-tile-icon" aria-hidden><Contrast size={18} /></span>
          <span className="action-tile-title">{t('colors.contrast')}</span>
          <span className="action-tile-desc">{t('colors.contrastDesc')}</span>
        </button>
      </div>

      <Section title={t('colors.core')}>
        <ColorRow label={t('colors.accent')} value={c.accent} onChange={setColor('accent')} />
        <ColorRow label={t('colors.background')} value={c.background} onChange={setColor('background')} />
        <ColorRow label={t('colors.surface')} value={c.surface} onChange={setColor('surface')} />
        <ColorRow label={t('colors.raised')} value={c.raised} onChange={setColor('raised')} />
      </Section>

      <Section title={t('colors.text')} hint={t('colors.textHint')}>
        <ColorRow
          label={t('colors.textPrimary')}
          value={c.textPrimary}
          onChange={setColor('textPrimary')}
          badge={<ContrastBadge fg={c.textPrimary} bg={c.background} />}
        />
        <ColorRow
          label={t('colors.textSecondary')}
          value={c.textSecondary}
          onChange={setColor('textSecondary')}
          badge={<ContrastBadge fg={c.textSecondary} bg={c.background} />}
        />
      </Section>
    </div>
  );
}
