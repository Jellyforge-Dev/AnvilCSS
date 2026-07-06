import { useEffect } from 'react';
import { useThemeStore } from '../state/themeStore';
import { useI18n } from '../i18n';
import { SelectRow, SliderRow, TextRow } from '../components/ui';
import { FONT_PRESETS } from '../css/generator';

function useFontPreviewPreload() {
  useEffect(() => {
    FONT_PRESETS.forEach((f) => {
      if (!f.importUrl) return;
      if (document.head.querySelector(`link[href="${f.importUrl}"]`)) return;
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = f.importUrl;
      document.head.appendChild(link);
    });
  }, []);
}

export function TypographyPanel() {
  const { t } = useI18n();
  const theme = useThemeStore((s) => s.theme);
  const update = useThemeStore((s) => s.update);
  useFontPreviewPreload();

  return (
    <div className="panel-body">
      <SelectRow
        label={t('components.font')}
        value={theme.typography.preset}
        onChange={(preset) => update('typography', { preset })}
        options={FONT_PRESETS.map((f) => ({
          value: f.id,
          label: f.label,
          style: f.family ? { fontFamily: f.family } : undefined
        }))}
      />
      {theme.typography.preset === 'custom' && (
        <TextRow
          label={t('components.customFont')}
          value={theme.typography.customFamily}
          placeholder="'My Font', sans-serif"
          onChange={(customFamily) => update('typography', { customFamily })}
        />
      )}
      <SliderRow
        label={t('components.textScale')}
        value={theme.typography.textScale}
        min={80}
        max={130}
        unit="%"
        onChange={(textScale) => update('typography', { textScale })}
      />
    </div>
  );
}
