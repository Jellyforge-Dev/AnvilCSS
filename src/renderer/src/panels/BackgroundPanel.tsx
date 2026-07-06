import { useThemeStore } from '../state/themeStore';
import { useUiStore } from '../state/uiStore';
import { useI18n } from '../i18n';
import { BackgroundType } from '../state/types';
import { ColorRow, Section, SegRow, SliderRow, TextRow, UploadButton } from '../components/ui';

export function BackgroundPanel() {
  const { t } = useI18n();
  const theme = useThemeStore((s) => s.theme);
  const update = useThemeStore((s) => s.update);
  const pushToast = useUiStore((s) => s.pushToast);
  const b = theme.background;

  const isImage = b.type === 'url' || b.type === 'upload';
  const currentImage = b.type === 'upload' ? b.imageData : b.imageUrl;

  return (
    <div className="panel-body">
      <Section title={t('background.type')}>
        <SegRow<BackgroundType>
          value={b.type}
          onChange={(type) => update('background', { type })}
          options={[
            { value: 'color', label: t('background.typeColor') },
            { value: 'gradient', label: t('background.typeGradient') },
            { value: 'url', label: t('background.typeUrl') },
            { value: 'upload', label: t('background.typeUpload') }
          ]}
        />
        {b.type === 'color' && <p className="ctl-hint">{t('background.colorHint')}</p>}
        {b.type === 'gradient' && (
          <>
            <ColorRow label={t('background.gradientFrom')} value={b.gradientFrom} onChange={(v) => update('background', { gradientFrom: v })} />
            <ColorRow label={t('background.gradientTo')} value={b.gradientTo} onChange={(v) => update('background', { gradientTo: v })} />
            <SliderRow label={t('background.gradientAngle')} value={b.gradientAngle} min={0} max={360} unit="°" onChange={(v) => update('background', { gradientAngle: v })} />
          </>
        )}
        {b.type === 'url' && (
          <TextRow
            label={t('background.imageUrl')}
            value={b.imageUrl}
            placeholder="https://…/wallpaper.jpg"
            onChange={(v) => update('background', { imageUrl: v })}
          />
        )}
        {b.type === 'upload' && (
          <div className="ctl-row">
            <UploadButton
              label={b.imageData ? t('background.replaceImage') : t('background.uploadImage')}
              onLoad={(uri) => {
                update('background', { imageData: uri });
                pushToast(t('background.uploadDone'), 'success');
              }}
            />
            {b.imageData && <img className="thumb thumb-wide" src={b.imageData} alt="" />}
          </div>
        )}
      </Section>

      {isImage && currentImage && (
        <>
          <Section title={t('background.fitting')}>
            <SegRow
              label={t('background.size')}
              value={b.size}
              onChange={(size) => update('background', { size })}
              options={[
                { value: 'cover', label: 'Cover' },
                { value: 'contain', label: 'Contain' }
              ]}
            />
            <SliderRow label={t('background.posX')} value={b.posX} min={0} max={100} unit="%" onChange={(v) => update('background', { posX: v })} />
            <SliderRow label={t('background.posY')} value={b.posY} min={0} max={100} unit="%" onChange={(v) => update('background', { posY: v })} />
          </Section>
          <Section title={t('background.effects')}>
            <ColorRow label={t('background.overlayColor')} value={b.overlayColor} onChange={(v) => update('background', { overlayColor: v })} />
            <SliderRow label={t('background.overlayOpacity')} value={b.overlayOpacity} min={0} max={95} unit="%" onChange={(v) => update('background', { overlayOpacity: v })} />
            <SliderRow label={t('background.blur')} value={b.blur} min={0} max={40} unit="px" onChange={(v) => update('background', { blur: v })} />
            <p className="ctl-hint">{t('background.overlayHint')}</p>
          </Section>
        </>
      )}
    </div>
  );
}
