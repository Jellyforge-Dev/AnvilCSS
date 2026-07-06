import { CSSProperties, ReactNode, useId, useState } from 'react';
import { Pipette } from 'lucide-react';
import { useI18n } from '../i18n';
import { eyeDropperSupported, pickColorFromScreen } from '../utils/eyedropper';

export function Section({ title, children, hint }: { title: string; children: ReactNode; hint?: string }) {
  const [open, setOpen] = useState(true);
  return (
    <section className={`ctl-section ${open ? '' : 'is-collapsed'}`}>
      <button type="button" className="ctl-section-head" onClick={() => setOpen(!open)}>
        <span className="ctl-section-title">{title}</span>
        <span className={`ctl-chevron ${open ? 'is-open' : ''}`} aria-hidden>
          ▾
        </span>
      </button>
      {hint && open && <p className="ctl-hint">{hint}</p>}
      {open && <div className="ctl-section-body">{children}</div>}
    </section>
  );
}

export function SliderRow({
  label,
  value,
  min,
  max,
  step = 1,
  unit = '',
  onChange
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (value: number) => void;
}) {
  const id = useId();
  return (
    <div className="ctl-row">
      <label className="ctl-label" htmlFor={id}>
        {label}
        <span className="ctl-value">
          {value}
          {unit}
        </span>
      </label>
      <input
        id={id}
        className="ctl-slider"
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
}

export function ColorRow({
  label,
  value,
  onChange,
  badge
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  badge?: ReactNode;
}) {
  const id = useId();
  const { t } = useI18n();
  const pickerValue = toPickerHex(value);

  const pick = async () => {
    const hex = await pickColorFromScreen();
    if (hex) onChange(hex);
  };

  return (
    <div className="ctl-row ctl-row-color">
      <label className="ctl-label" htmlFor={id}>
        {label}
        {badge}
      </label>
      <div className="ctl-color-inputs">
        <input
          id={id}
          type="color"
          className="ctl-swatch"
          value={pickerValue}
          onChange={(e) => onChange(e.target.value)}
        />
        <input
          type="text"
          className="ctl-text ctl-hex"
          value={value}
          spellCheck={false}
          onChange={(e) => onChange(e.target.value)}
        />
        {eyeDropperSupported && (
          <button
            type="button"
            className="btn btn-ghost ctl-eyedropper"
            onClick={pick}
            title={t('colors.eyedropper')}
            aria-label={t('colors.eyedropper')}
          >
            <Pipette size={15} />
          </button>
        )}
      </div>
    </div>
  );
}

function toPickerHex(value: string): string {
  if (/^#[0-9a-f]{6}$/i.test(value)) return value;
  if (/^#[0-9a-f]{3}$/i.test(value)) {
    return '#' + value.slice(1).split('').map((c) => c + c).join('');
  }
  const m = value.match(/rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)/);
  if (m) {
    const to = (v: string) => Math.round(Number(v)).toString(16).padStart(2, '0');
    return `#${to(m[1])}${to(m[2])}${to(m[3])}`;
  }
  return '#000000';
}

export function SegRow<T extends string>({
  label,
  value,
  options,
  onChange
}: {
  label?: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
}) {
  return (
    <div className="ctl-row">
      {label && <span className="ctl-label">{label}</span>}
      <div className="ctl-seg" role="group">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            className={`ctl-seg-btn ${opt.value === value ? 'is-active' : ''}`}
            onClick={() => onChange(opt.value)}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function SelectRow({
  label,
  value,
  options,
  onChange
}: {
  label: string;
  value: string;
  options: { value: string; label: string; style?: CSSProperties }[];
  onChange: (value: string) => void;
}) {
  const id = useId();
  return (
    <div className="ctl-row">
      <label className="ctl-label" htmlFor={id}>
        {label}
      </label>
      <select id={id} className="ctl-select" value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} style={opt.style}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export function TextRow({
  label,
  value,
  placeholder,
  onChange
}: {
  label: string;
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
}) {
  const id = useId();
  return (
    <div className="ctl-row">
      <label className="ctl-label" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        type="text"
        className="ctl-text"
        value={value}
        placeholder={placeholder}
        spellCheck={false}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

export function readFileAsDataUri(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('file-read-failed'));
    reader.readAsDataURL(file);
  });
}

export function UploadButton({
  label,
  onLoad,
  accept = 'image/*'
}: {
  label: string;
  onLoad: (dataUri: string, file: File) => void;
  accept?: string;
}) {
  const id = useId();
  return (
    <label className="btn btn-ghost" htmlFor={id}>
      {label}
      <input
        id={id}
        type="file"
        accept={accept}
        style={{ display: 'none' }}
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          const uri = await readFileAsDataUri(file);
          onLoad(uri, file);
          e.target.value = '';
        }}
      />
    </label>
  );
}
