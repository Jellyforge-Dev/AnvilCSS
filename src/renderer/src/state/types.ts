export interface ThemeColors {
  accent: string;
  background: string;
  surface: string;
  raised: string;
  textPrimary: string;
  textSecondary: string;
}

export type BackgroundType = 'color' | 'gradient' | 'url' | 'upload';

export interface BackgroundSettings {
  type: BackgroundType;
  gradientFrom: string;
  gradientTo: string;
  gradientAngle: number;
  imageUrl: string;
  imageData: string;
  size: 'cover' | 'contain';
  posX: number;
  posY: number;
  overlayColor: string;
  overlayOpacity: number;
  blur: number;
}

export interface LogoSlot {
  source: string;
  enabled: boolean;
}

export type LogoSlotId = 'header' | 'login' | 'splashBackground' | 'favicon' | 'tvBanner';

export interface TypographySettings {
  preset: string;
  customFamily: string;
  textScale: number;
}

export type ButtonPresetId =
  | 'classic-filled'
  | 'outline'
  | 'soft'
  | 'gradient'
  | 'glassmorphism'
  | 'neon-glow'
  | 'material-ripple'
  | 'flat-minimal'
  | 'underline'
  | 'press-3d'
  | 'skeuomorphic'
  | 'pill-gradient-hover'
  | 'ghost-border-fill'
  | 'shadow-lift'
  | 'retro-bevel'
  | 'inset-carve'
  | 'double-border'
  | 'sharp-edge'
  | 'gradient-outline'
  | 'wireframe';

export interface ButtonSettings {
  radius: number;
  preset: ButtonPresetId;
}

export type CardPresetId =
  | 'flat'
  | 'rounded-soft'
  | 'floating-shadow'
  | 'glassmorphism'
  | 'accent-border'
  | 'overlay-zoom'
  | 'gradient-border'
  | 'neon-outline'
  | 'striped-accent'
  | 'elevated-3d'
  | 'minimal-ghost'
  | 'glow-hover-ring'
  | 'polaroid'
  | 'ribbon-corner'
  | 'inner-glow'
  | 'dashed-outline'
  | 'clip-corner'
  | 'soft-stack'
  | 'holo-shine'
  | 'sticker';

export interface CardSettings {
  radius: number;
  preset: CardPresetId;
}

export type InputPresetId =
  | 'default'
  | 'underline'
  | 'outline'
  | 'filled'
  | 'soft'
  | 'glassmorphism'
  | 'neon-glow'
  | 'minimal'
  | 'pill'
  | 'bottom-glow'
  | 'material'
  | 'bordered-focus'
  | 'shadow-inset'
  | 'gradient-border'
  | 'dashed'
  | 'ghost'
  | 'rounded-soft'
  | 'sharp'
  | 'elevated'
  | 'skeuomorphic';

export interface InputSettings {
  radius: number;
  preset: InputPresetId;
}

export type ScrollbarPresetId =
  | 'default'
  | 'thin'
  | 'pill'
  | 'square'
  | 'accent-glow'
  | 'gradient'
  | 'minimal'
  | 'hidden-until-hover'
  | 'neon'
  | 'outlined'
  | 'large'
  | 'rounded-track'
  | 'inset'
  | 'flat-dark'
  | 'flat-light'
  | 'striped'
  | 'dotted'
  | 'glass'
  | 'bold'
  | 'retro';

export interface ScrollbarSettings {
  preset: ScrollbarPresetId;
}

export type HeaderPresetId =
  | 'solid'
  | 'transparent'
  | 'blur'
  | 'gradient'
  | 'bordered-bottom'
  | 'glass-frost'
  | 'neon-underline'
  | 'shadow-drop'
  | 'minimal-flat'
  | 'elevated'
  | 'sticky-blur'
  | 'color-wash'
  | 'outline-bottom'
  | 'translucent-dark'
  | 'frosted-light'
  | 'bold-accent'
  | 'two-tone'
  | 'vignette'
  | 'soft-glow'
  | 'retro-bar';

export interface ProgressSettings {
  style: 'flat' | 'rounded' | 'glow' | 'striped';
  height: number;
}

export interface ThemeState {
  colors: ThemeColors;
  background: BackgroundSettings;
  logos: Record<LogoSlotId, LogoSlot>;
  typography: TypographySettings;
  buttons: ButtonSettings;
  cards: CardSettings;
  inputs: InputSettings;
  scrollbar: ScrollbarSettings;
  progress: ProgressSettings;
  header: { style: HeaderPresetId };
  drawer: { style: 'solid' | 'floating' | 'transparent' };
  tabs: { style: 'underline' | 'pill' | 'block' };
  animation: { speed: 'off' | 'slow' | 'normal' | 'fast' };
  customCss: string;
}

export interface SavedTheme {
  id: string;
  name: string;
  state: ThemeState;
  createdAt: number;
  updatedAt: number;
}

const emptySlot = (): LogoSlot => ({ source: '', enabled: false });

export function defaultTheme(): ThemeState {
  return {
    colors: {
      accent: '#00a4dc',
      background: '#101010',
      surface: '#202020',
      raised: '#303030',
      textPrimary: 'rgba(255,255,255,0.8)',
      textSecondary: 'rgba(255,255,255,0.5)'
    },
    background: {
      type: 'color',
      gradientFrom: '#101018',
      gradientTo: '#1c1030',
      gradientAngle: 160,
      imageUrl: '',
      imageData: '',
      size: 'cover',
      posX: 50,
      posY: 50,
      overlayColor: '#000000',
      overlayOpacity: 55,
      blur: 0
    },
    logos: {
      header: emptySlot(),
      login: emptySlot(),
      splashBackground: emptySlot(),
      favicon: emptySlot(),
      tvBanner: emptySlot()
    },
    typography: { preset: 'default', customFamily: '', textScale: 100 },
    buttons: { radius: 4, preset: 'classic-filled' },
    cards: { radius: 6, preset: 'rounded-soft' },
    inputs: { radius: 4, preset: 'default' },
    scrollbar: { preset: 'default' },
    progress: { style: 'rounded', height: 5 },
    header: { style: 'solid' },
    drawer: { style: 'solid' },
    tabs: { style: 'underline' },
    animation: { speed: 'normal' },
    customCss: ''
  };
}
