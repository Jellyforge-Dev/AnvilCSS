import { useThemeStore } from '../state/themeStore';
import { useI18n } from '../i18n';
import { Section, SegRow, SelectRow, SliderRow } from '../components/ui';
import { BUTTON_PRESETS, CARD_PRESETS, HEADER_PRESETS, INPUT_PRESETS, SCROLLBAR_PRESETS } from '../css/generator';

export function ComponentsPanel() {
  const { t } = useI18n();
  const theme = useThemeStore((s) => s.theme);
  const update = useThemeStore((s) => s.update);

  return (
    <div className="panel-body">
      <Section title={t('components.buttons')}>
        <SliderRow
          label={t('components.buttonRadius')}
          value={theme.buttons.radius}
          min={0}
          max={28}
          unit="px"
          onChange={(radius) => update('buttons', { radius })}
        />
        <SelectRow
          label={t('components.buttonPreset')}
          value={theme.buttons.preset}
          onChange={(preset) => update('buttons', { preset: preset as typeof theme.buttons.preset })}
          options={BUTTON_PRESETS.map((p) => ({ value: p.id, label: t(p.labelKey) }))}
        />
      </Section>

      <Section title={t('components.cards')}>
        <SliderRow
          label={t('components.cardRadius')}
          value={theme.cards.radius}
          min={0}
          max={24}
          unit="px"
          onChange={(radius) => update('cards', { radius })}
        />
        <SelectRow
          label={t('components.cardPreset')}
          value={theme.cards.preset}
          onChange={(preset) => update('cards', { preset: preset as typeof theme.cards.preset })}
          options={CARD_PRESETS.map((p) => ({ value: p.id, label: t(p.labelKey) }))}
        />
      </Section>

      <Section title={t('components.inputs')}>
        <SliderRow
          label={t('components.inputRadius')}
          value={theme.inputs.radius}
          min={0}
          max={28}
          unit="px"
          onChange={(radius) => update('inputs', { radius })}
        />
        <SelectRow
          label={t('components.inputPreset')}
          value={theme.inputs.preset}
          onChange={(preset) => update('inputs', { preset: preset as typeof theme.inputs.preset })}
          options={INPUT_PRESETS.map((p) => ({ value: p.id, label: t(p.labelKey) }))}
        />
      </Section>

      <Section title={t('components.scrollbar')}>
        <SelectRow
          label={t('components.scrollbarPreset')}
          value={theme.scrollbar.preset}
          onChange={(preset) => update('scrollbar', { preset: preset as typeof theme.scrollbar.preset })}
          options={SCROLLBAR_PRESETS.map((p) => ({ value: p.id, label: t(p.labelKey) }))}
        />
      </Section>

      <Section title={t('components.progress')}>
        <SegRow
          label={t('components.progressStyle')}
          value={theme.progress.style}
          onChange={(style) => update('progress', { style })}
          options={[
            { value: 'flat', label: t('components.progressFlat') },
            { value: 'rounded', label: t('components.progressRounded') },
            { value: 'glow', label: t('components.hoverGlow') },
            { value: 'striped', label: t('components.progressStriped') }
          ]}
        />
        <SliderRow
          label={t('components.progressHeight')}
          value={theme.progress.height}
          min={2}
          max={16}
          unit="px"
          onChange={(height) => update('progress', { height })}
        />
      </Section>

      <Section title={t('components.chrome')}>
        <SelectRow
          label={t('components.headerStyle')}
          value={theme.header.style}
          onChange={(style) => update('header', { style: style as typeof theme.header.style })}
          options={HEADER_PRESETS.map((p) => ({ value: p.id, label: t(p.labelKey) }))}
        />
        <SegRow
          label={t('components.drawerStyle')}
          value={theme.drawer.style}
          onChange={(style) => update('drawer', { style })}
          options={[
            { value: 'solid', label: t('components.chromeSolid') },
            { value: 'floating', label: t('components.drawerFloating') },
            { value: 'transparent', label: t('components.chromeBlur') }
          ]}
        />
        <SegRow
          label={t('components.tabStyle')}
          value={theme.tabs.style}
          onChange={(style) => update('tabs', { style })}
          options={[
            { value: 'underline', label: t('components.tabUnderline') },
            { value: 'pill', label: t('components.tabPill') },
            { value: 'block', label: t('components.tabBlock') }
          ]}
        />
        <SegRow
          label={t('components.animationSpeed')}
          value={theme.animation.speed}
          onChange={(speed) => update('animation', { speed })}
          options={[
            { value: 'off', label: t('common.off') },
            { value: 'slow', label: t('components.animSlow') },
            { value: 'normal', label: t('components.animNormal') },
            { value: 'fast', label: t('components.animFast') }
          ]}
        />
      </Section>
    </div>
  );
}
