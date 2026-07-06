import { ThemeState } from '../state/types';
import { parseColor, relativeLuminance, shiftLightness, withAlpha } from '../utils/color';
import { GEN_START } from './merge';

export interface FontPreset {
  id: string;
  label: string;
  family: string;
  importUrl?: string;
}

interface GoogleFontDef {
  id: string;
  name: string;
  weights: string;
  fallback: 'sans-serif' | 'serif' | 'cursive' | 'monospace';
}

const GOOGLE_FONTS: GoogleFontDef[] = [
  { id: 'inter', name: 'Inter', weights: '400;500;600;700', fallback: 'sans-serif' },
  { id: 'roboto', name: 'Roboto', weights: '400;500;700', fallback: 'sans-serif' },
  { id: 'opensans', name: 'Open Sans', weights: '400;600;700', fallback: 'sans-serif' },
  { id: 'lato', name: 'Lato', weights: '400;700', fallback: 'sans-serif' },
  { id: 'montserrat', name: 'Montserrat', weights: '400;500;600;700', fallback: 'sans-serif' },
  { id: 'poppins', name: 'Poppins', weights: '400;500;600;700', fallback: 'sans-serif' },
  { id: 'nunito', name: 'Nunito', weights: '400;600;700', fallback: 'sans-serif' },
  { id: 'nunitosans', name: 'Nunito Sans', weights: '400;600;700', fallback: 'sans-serif' },
  { id: 'raleway', name: 'Raleway', weights: '400;500;600;700', fallback: 'sans-serif' },
  { id: 'ubuntu', name: 'Ubuntu', weights: '400;500;700', fallback: 'sans-serif' },
  { id: 'rubik', name: 'Rubik', weights: '400;500;600;700', fallback: 'sans-serif' },
  { id: 'worksans', name: 'Work Sans', weights: '400;500;600;700', fallback: 'sans-serif' },
  { id: 'mulish', name: 'Mulish', weights: '400;600;700', fallback: 'sans-serif' },
  { id: 'karla', name: 'Karla', weights: '400;500;700', fallback: 'sans-serif' },
  { id: 'manrope', name: 'Manrope', weights: '400;500;600;700', fallback: 'sans-serif' },
  { id: 'dmsans', name: 'DM Sans', weights: '400;500;700', fallback: 'sans-serif' },
  { id: 'figtree', name: 'Figtree', weights: '400;500;600;700', fallback: 'sans-serif' },
  { id: 'spacegrotesk', name: 'Space Grotesk', weights: '400;500;600;700', fallback: 'sans-serif' },
  { id: 'sora', name: 'Sora', weights: '400;500;600;700', fallback: 'sans-serif' },
  { id: 'outfit', name: 'Outfit', weights: '400;500;600;700', fallback: 'sans-serif' },
  { id: 'plusjakartasans', name: 'Plus Jakarta Sans', weights: '400;500;600;700', fallback: 'sans-serif' },
  { id: 'lexend', name: 'Lexend', weights: '400;500;600;700', fallback: 'sans-serif' },
  { id: 'publicsans', name: 'Public Sans', weights: '400;500;600;700', fallback: 'sans-serif' },
  { id: 'barlow', name: 'Barlow', weights: '400;500;600;700', fallback: 'sans-serif' },
  { id: 'josefinsans', name: 'Josefin Sans', weights: '400;500;600;700', fallback: 'sans-serif' },
  { id: 'quicksand', name: 'Quicksand', weights: '400;500;600;700', fallback: 'sans-serif' },
  { id: 'comfortaa', name: 'Comfortaa', weights: '400;600;700', fallback: 'sans-serif' },
  { id: 'fredoka', name: 'Fredoka', weights: '400;500;600;700', fallback: 'sans-serif' },
  { id: 'baloo2', name: 'Baloo 2', weights: '400;500;600;700', fallback: 'sans-serif' },
  { id: 'kanit', name: 'Kanit', weights: '400;500;600;700', fallback: 'sans-serif' },
  { id: 'titilliumweb', name: 'Titillium Web', weights: '400;600;700', fallback: 'sans-serif' },
  { id: 'oxygen', name: 'Oxygen', weights: '400;700', fallback: 'sans-serif' },
  { id: 'ptsans', name: 'PT Sans', weights: '400;700', fallback: 'sans-serif' },
  { id: 'notosans', name: 'Noto Sans', weights: '400;500;600;700', fallback: 'sans-serif' },
  { id: 'sourcesans3', name: 'Source Sans 3', weights: '400;600;700', fallback: 'sans-serif' },
  { id: 'ibmplexsans', name: 'IBM Plex Sans', weights: '400;500;600;700', fallback: 'sans-serif' },
  { id: 'archivo', name: 'Archivo', weights: '400;500;600;700', fallback: 'sans-serif' },
  { id: 'bitter', name: 'Bitter', weights: '400;600;700', fallback: 'serif' },
  { id: 'merriweather', name: 'Merriweather', weights: '400;700', fallback: 'serif' },
  { id: 'playfairdisplay', name: 'Playfair Display', weights: '400;600;700', fallback: 'serif' },
  { id: 'lora', name: 'Lora', weights: '400;600;700', fallback: 'serif' },
  { id: 'ptserif', name: 'PT Serif', weights: '400;700', fallback: 'serif' },
  { id: 'crimsontext', name: 'Crimson Text', weights: '400;600;700', fallback: 'serif' },
  { id: 'librebaskerville', name: 'Libre Baskerville', weights: '400;700', fallback: 'serif' },
  { id: 'ebgaramond', name: 'EB Garamond', weights: '400;600;700', fallback: 'serif' },
  { id: 'cormorantgaramond', name: 'Cormorant Garamond', weights: '400;600;700', fallback: 'serif' },
  { id: 'vollkorn', name: 'Vollkorn', weights: '400;600;700', fallback: 'serif' },
  { id: 'robotoslab', name: 'Roboto Slab', weights: '400;500;700', fallback: 'serif' },
  { id: 'arvo', name: 'Arvo', weights: '400;700', fallback: 'serif' },
  { id: 'bebasneue', name: 'Bebas Neue', weights: '400', fallback: 'sans-serif' },
  { id: 'oswald', name: 'Oswald', weights: '400;500;600;700', fallback: 'sans-serif' },
  { id: 'anton', name: 'Anton', weights: '400', fallback: 'sans-serif' },
  { id: 'pacifico', name: 'Pacifico', weights: '400', fallback: 'cursive' },
  { id: 'caveat', name: 'Caveat', weights: '400;600;700', fallback: 'cursive' },
  { id: 'jetbrainsmono', name: 'JetBrains Mono', weights: '400;500;700', fallback: 'monospace' }
];

function googleFontImportUrl(name: string, weights: string): string {
  return `https://fonts.googleapis.com/css2?family=${name.replace(/ /g, '+')}:wght@${weights}&display=swap`;
}

export const FONT_PRESETS: FontPreset[] = [
  { id: 'default', label: 'Jellyfin Default', family: '' },
  { id: 'system', label: 'System UI', family: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif' },
  ...GOOGLE_FONTS.map((f) => ({
    id: f.id,
    label: f.name,
    family: `'${f.name}', ${f.fallback}`,
    importUrl: googleFontImportUrl(f.name, f.weights)
  })),
  { id: 'custom', label: 'Custom', family: '' }
];

function onColor(color: string): string {
  const rgb = parseColor(color);
  if (!rgb) return '#ffffff';
  return relativeLuminance(rgb) > 0.45 ? '#000000' : '#ffffff';
}

function section(title: string, body: string): string {
  const rules = body.trim();
  if (!rules) return '';
  return `/* ── ${title} ${'─'.repeat(Math.max(2, 46 - title.length))} */\n${rules}\n`;
}

const ANIMATION_FACTORS: Record<ThemeState['animation']['speed'], number> = {
  off: 0,
  slow: 1.8,
  normal: 1,
  fast: 0.5
};

export function generateCss(t: ThemeState): string {
  const c = t.colors;
  const accentOn = onColor(c.accent);
  const input = shiftLightness(c.surface, 0.035);
  const speed = ANIMATION_FACTORS[t.animation.speed];
  const dur = (base: number) => `${Math.round(base * speed * 1000) / 1000}s`;

  const parts: string[] = [];

  // @import rules must come first in a stylesheet
  const fontImport = fontImportFor(t);
  if (fontImport) parts.push(fontImport + '\n');

  parts.push(`${GEN_START}
/*   Built with Jellyforge AnvilCSS — paste into
     Jellyfin Dashboard → General → Custom CSS.   */\n`);

  parts.push(
    section(
      'Colors · base surfaces & text',
      `html, body {
  background-color: ${c.background};
  color: ${c.textPrimary};
}
.backgroundContainer, .dialog, .nowPlayingContextMenu, .nowPlayingPlaylist {
  background-color: ${c.background};
}
.backgroundContainer.withBackdrop {
  background-color: ${withAlpha(c.background, 0.86)};
}
.skinHeader {
  color: ${c.textPrimary};
}
.collapseContent, .formDialogFooter:not(.formDialogFooter-clear),
.formDialogHeader:not(.formDialogHeader-clear), .paperList,
.visualCardBox, .wizardStartForm {
  background-color: ${c.surface};
}
.fab, .raised {
  background: ${c.raised};
  color: ${c.textPrimary};
}
.fab:focus, .raised:focus {
  background: ${shiftLightness(c.raised, 0.05)};
}
.emby-input, .emby-textarea, .emby-select-withcolor {
  background: ${input};
  border-color: ${input};
  color: ${c.textPrimary};
}
.emby-select-withcolor > option {
  background: ${c.surface};
  color: ${c.textPrimary};
}
.cardText-secondary, .fieldDescription, .guide-programNameCaret,
.listItem .secondary, .nowPlayingBarSecondaryText, .programSecondaryTitle,
.secondaryText, .checkboxListLabel, .inputLabel, .inputLabelUnfocused,
.paperListLabel, .textareaLabelUnfocused {
  color: ${c.textSecondary};
}
.listItem:hover {
  background: ${shiftLightness(c.surface, 0.03)};
}
.listItem:focus {
  background: ${shiftLightness(c.surface, 0.07)};
}
.toast, .appfooter, .playlistSectionButton {
  background: ${c.raised};
  color: ${c.textPrimary};
}
.actionsheetDivider {
  background: ${withAlpha(c.textPrimary, 0.14)};
}
.detailRibbon {
  background: ${withAlpha(c.surface, 0.8)};
}
* {
  scrollbar-color: ${c.raised} ${c.background};
}
::-webkit-scrollbar-track-piece {
  background-color: ${shiftLightness(c.background, 0.08)};
}
::-webkit-scrollbar-thumb:horizontal, ::-webkit-scrollbar-thumb:vertical {
  background-color: ${c.raised};
}
::selection {
  background: ${withAlpha(c.accent, 0.4)};
}`
    )
  );

  parts.push(
    section(
      'Colors · accent',
      `.button-submit {
  background: ${c.accent};
  color: ${accentOn};
}
.button-submit:focus {
  background: ${shiftLightness(c.accent, 0.06)};
  color: ${accentOn};
}
.inputLabelFocused, .selectLabelFocused, .textareaLabelFocused {
  color: ${c.accent};
}
.emby-input:focus, .emby-textarea:focus {
  border-color: ${c.accent};
}
.emby-select-withcolor:focus {
  border-color: ${c.accent} !important;
}
.emby-checkbox:checked + span + .checkboxOutline {
  border-color: ${c.accent};
  background-color: ${c.accent};
}
.emby-checkbox:focus:not(:checked) + span + .checkboxOutline {
  border-color: ${c.accent};
}
.itemProgressBarForeground, .countIndicator, .fullSyncIndicator,
.mediaSourceIndicator, .playedIndicator {
  background: ${c.accent};
}
.navMenuOption-selected {
  background: ${c.accent} !important;
  color: ${accentOn};
}
.navMenuOption:hover {
  background: ${shiftLightness(c.surface, 0.04)};
}
.emby-button.show-focus:focus {
  background: ${c.accent};
  color: ${accentOn};
}
.button-flat:hover, .button-link, .buttonActive, .metadataSidebarIcon,
.upNextDialog-countdownText {
  color: ${c.accent};
}
@media (hover: hover) and (pointer: fine) {
  .paper-icon-button-light:hover:not(:disabled) {
    background-color: ${withAlpha(c.accent, 0.2)};
    color: ${c.accent};
  }
}
.paper-icon-button-light:active:not(:disabled),
.paper-icon-button-light.show-focus:focus {
  background-color: ${withAlpha(c.accent, 0.2)};
  color: ${c.accent};
}
.progressring-spiner {
  border-color: ${c.accent};
}
.itemSelectionPanel {
  border-color: ${c.accent};
}
.selectionCommandsPanel {
  background: ${c.accent};
  color: ${accentOn};
}
.card:focus .cardBox.visualCardBox,
.card:focus .cardBox:not(.visualCardBox) .cardScalable {
  border-color: ${c.accent} !important;
}
.emby-button.detailFloatingButton {
  background-color: ${c.accent};
  color: ${accentOn};
}
.mdl-slider-background-lower {
  background-color: ${c.accent};
}
.sliderBubble {
  background: ${c.accent};
  color: ${accentOn};
}`
    )
  );

  parts.push(section('Background', backgroundRules(t)));
  parts.push(section('Logos & branding', logoRules(t)));
  parts.push(section('Typography', typographyRules(t)));
  parts.push(section('Buttons', buttonRules(t, accentOn)));
  parts.push(section('Cards', cardRules(t, dur)));
  parts.push(section('Input fields', inputRules(t)));
  parts.push(section('Scrollbars', scrollbarRules(t)));
  parts.push(section('Progress bars', progressRules(t)));
  parts.push(section('Header', headerRules(t)));
  parts.push(section('Side menu', drawerRules(t)));
  parts.push(section('Navigation tabs', tabRules(t, accentOn)));
  parts.push(section('Animation', animationRules(t, dur)));

  return parts.filter(Boolean).join('\n');
}

function fontImportFor(t: ThemeState): string {
  const preset = FONT_PRESETS.find((f) => f.id === t.typography.preset);
  return preset?.importUrl ? `@import url('${preset.importUrl}');` : '';
}

function backgroundSource(t: ThemeState): string {
  return t.background.type === 'upload' ? t.background.imageData : t.background.imageUrl;
}

function backgroundRules(t: ThemeState): string {
  const b = t.background;
  if (b.type === 'color') return '';
  if (b.type === 'gradient') {
    const gradient = `linear-gradient(${b.gradientAngle}deg, ${b.gradientFrom}, ${b.gradientTo})`;
    return `html, .backgroundContainer {
  background: ${gradient} fixed;
}
.backgroundContainer.withBackdrop {
  background: ${gradient} fixed;
}
body {
  background-color: transparent;
}`;
  }
  const src = backgroundSource(t);
  if (!src) return '';
  const overlay = withAlpha(b.overlayColor, b.overlayOpacity / 100);
  const blur = b.blur > 0 ? `\n.backgroundContainer {\n  filter: blur(${b.blur}px);\n  transform: scale(1.03);\n}` : '';
  return `.backgroundContainer {
  background-image: linear-gradient(${overlay}, ${overlay}), url('${src}');
  background-size: ${b.size}, ${b.size};
  background-position: ${b.posX}% ${b.posY}%;
  background-repeat: no-repeat;
  background-attachment: fixed;
}
.backgroundContainer.withBackdrop {
  background-color: transparent;
}
body {
  background-color: transparent;
}${blur}`;
}

function logoRules(t: ThemeState): string {
  const rules: string[] = [];
  const { header, login, splashBackground, tvBanner, favicon } = t.logos;
  if (header.enabled && header.source) {
    rules.push(`.pageTitleWithLogo, .pageTitleWithDefaultLogo {
  background-image: url('${header.source}') !important;
  background-size: contain;
  background-position: left center;
  background-repeat: no-repeat;
  width: 13.2em;
}`);
  }
  if (login.enabled && login.source) {
    rules.push(`.splashLogo {
  background-image: url('${login.source}') !important;
  background-size: contain !important;
  background-position: center !important;
  background-repeat: no-repeat !important;
}
.visualLoginForm h1, .manualLoginForm .sectionTitle {
  text-indent: -9999px !important;
  overflow: hidden !important;
  background-image: url('${login.source}') !important;
  background-size: contain !important;
  background-repeat: no-repeat !important;
  background-position: center !important;
  min-height: 120px !important;
  display: block !important;
}`);
  }
  if (splashBackground.enabled && splashBackground.source) {
    rules.push(`html.preload {
  background: url('${splashBackground.source}') center / cover no-repeat fixed !important;
}
body:has(> #reactRoot > .splashLogo) {
  background: url('${splashBackground.source}') center / cover no-repeat fixed !important;
}`);
  }
  if (tvBanner.enabled && tvBanner.source) {
    rules.push(`.layout-tv .pageTitleWithDefaultLogo, .layout-tv .pageTitleWithLogo {
  background-image: url('${tvBanner.source}') !important;
  background-size: contain;
  background-position: left center;
  background-repeat: no-repeat;
}`);
  }
  if (favicon.enabled && favicon.source) {
    rules.push(`/* Favicon cannot be replaced via CSS — replace favicon.ico in the jellyfin-web
   folder on the server instead. See the AnvilCSS wiki, section “Logos”. */`);
  }
  return rules.join('\n');
}

function typographyRules(t: ThemeState): string {
  const rules: string[] = [];
  const preset = FONT_PRESETS.find((f) => f.id === t.typography.preset);
  const family = t.typography.preset === 'custom' ? t.typography.customFamily.trim() : preset?.family || '';
  if (family) {
    rules.push(`body, .emby-button, .emby-input, .emby-select, .emby-textarea,
.cardText, .listItem, .navMenuOptionText, .pageTitle, .sectionTitle,
.osdTitle, .headerTabs, h1, h2, h3 {
  font-family: ${family} !important;
}
.material-icons {
  font-family: 'Material Icons' !important;
}`);
  }
  if (t.typography.textScale !== 100) {
    rules.push(`html {
  font-size: ${t.typography.textScale}%;
}`);
  }
  return rules.join('\n');
}

export const BUTTON_PRESETS: { id: ThemeState['buttons']['preset']; labelKey: string }[] = [
  'classic-filled',
  'outline',
  'soft',
  'gradient',
  'glassmorphism',
  'neon-glow',
  'material-ripple',
  'flat-minimal',
  'underline',
  'press-3d',
  'skeuomorphic',
  'pill-gradient-hover',
  'ghost-border-fill',
  'shadow-lift',
  'retro-bevel',
  'inset-carve',
  'double-border',
  'sharp-edge',
  'gradient-outline',
  'wireframe'
].map((id) => ({ id: id as ThemeState['buttons']['preset'], labelKey: `components.btnPreset.${id}` }));

function buttonRules(t: ThemeState, accentOn: string): string {
  const b = t.buttons;
  const c = t.colors;
  const rules: string[] = [];
  rules.push(`.emby-button:not(.fab):not(.paper-icon-button-light), .raised, .button-submit {
  border-radius: ${b.radius}px;
}`);

  const BTN_SEL = '.emby-button:not(.paper-icon-button-light), .raised, .button-submit';

  switch (b.preset) {
    case 'outline':
      rules.push(`.raised {
  background: transparent;
  border: 0.14em solid ${withAlpha(c.textPrimary, 0.35)};
}
.button-submit {
  background: transparent;
  border: 0.14em solid ${c.accent};
  color: ${c.accent};
}
@media (hover: hover) {
  .button-submit:hover {
    background: ${withAlpha(c.accent, 0.15)};
  }
}`);
      break;
    case 'soft':
      rules.push(`.raised {
  background: ${withAlpha(c.textPrimary, 0.09)};
}
.button-submit {
  background: ${withAlpha(c.accent, 0.18)};
  color: ${c.accent};
}
@media (hover: hover) {
  .button-submit:hover {
    background: ${withAlpha(c.accent, 0.3)};
  }
}`);
      break;
    case 'gradient':
      rules.push(`.raised {
  background: linear-gradient(135deg, ${shiftLightness(c.raised, 0.1)}, ${shiftLightness(c.raised, -0.08)});
}
.button-submit {
  background: linear-gradient(135deg, ${shiftLightness(c.accent, 0.14)}, ${shiftLightness(c.accent, -0.14)});
  color: ${accentOn};
}
@media (hover: hover) {
  .button-submit:hover {
    background: linear-gradient(135deg, ${shiftLightness(c.accent, 0.24)}, ${shiftLightness(c.accent, -0.02)});
  }
}`);
      break;
    case 'glassmorphism':
      rules.push(`${BTN_SEL} {
  background: ${withAlpha(c.surface, 0.32)};
  border: 1px solid ${withAlpha('#ffffff', 0.18)};
  -webkit-backdrop-filter: blur(10px) saturate(1.6);
  backdrop-filter: blur(10px) saturate(1.6);
}
.button-submit {
  color: ${c.textPrimary};
}
@media (hover: hover) {
  ${BTN_SEL}:hover {
    background: ${withAlpha(c.surface, 0.48)};
  }
}`);
      break;
    case 'neon-glow':
      rules.push(`${BTN_SEL} {
  background: ${shiftLightness(c.surface, -0.05)};
  border: 1px solid ${c.accent};
  color: ${c.accent};
  box-shadow: 0 0 0.6em ${withAlpha(c.accent, 0.55)}, inset 0 0 0.4em ${withAlpha(c.accent, 0.2)};
}
@media (hover: hover) {
  ${BTN_SEL}:hover {
    box-shadow: 0 0 1.1em ${withAlpha(c.accent, 0.85)}, inset 0 0 0.6em ${withAlpha(c.accent, 0.35)};
  }
}`);
      break;
    case 'material-ripple':
      rules.push(`${BTN_SEL} {
  position: relative;
  overflow: hidden;
}
${BTN_SEL}::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: radial-gradient(circle, ${withAlpha('#ffffff', 0.55)} 10%, transparent 10.5%);
  transform: scale(0);
  opacity: 0;
  pointer-events: none;
  transition: transform 0.55s ease, opacity 0.9s ease;
}
${BTN_SEL}:active::after {
  transform: scale(3);
  opacity: 1;
  transition: 0s;
}`);
      break;
    case 'flat-minimal':
      rules.push(`${BTN_SEL} {
  background: transparent;
  border: none;
  box-shadow: none;
  color: ${c.textPrimary};
}
.button-submit {
  color: ${c.accent};
}
@media (hover: hover) {
  ${BTN_SEL}:hover {
    opacity: 0.7;
  }
}`);
      break;
    case 'underline':
      rules.push(`${BTN_SEL} {
  background: transparent;
  border: none;
  border-radius: 0 !important;
  border-bottom: 2px solid ${withAlpha(c.textPrimary, 0.35)};
  color: ${c.textPrimary};
}
.button-submit {
  border-bottom-color: ${c.accent};
  color: ${c.accent};
}
@media (hover: hover) {
  ${BTN_SEL}:hover {
    background: ${withAlpha(c.accent, 0.06)};
    border-bottom-color: ${c.accent};
  }
}`);
      break;
    case 'press-3d':
      rules.push(`${BTN_SEL} {
  box-shadow: 0 0.22em 0 ${shiftLightness(c.raised, -0.25)};
}
.button-submit {
  box-shadow: 0 0.22em 0 ${shiftLightness(c.accent, -0.25)};
}
${BTN_SEL}:active {
  transform: translateY(0.18em);
  box-shadow: none !important;
}`);
      break;
    case 'skeuomorphic':
      rules.push(`.raised {
  background: linear-gradient(180deg, ${shiftLightness(c.raised, 0.08)}, ${shiftLightness(c.raised, -0.08)});
  box-shadow: inset 0 1px 0 ${withAlpha('#ffffff', 0.25)}, 0 2px 4px rgba(0, 0, 0, 0.4);
}
.button-submit {
  background: linear-gradient(180deg, ${shiftLightness(c.accent, 0.12)}, ${shiftLightness(c.accent, -0.12)});
  box-shadow: inset 0 1px 0 ${withAlpha('#ffffff', 0.3)}, 0 2px 4px rgba(0, 0, 0, 0.4);
}`);
      break;
    case 'pill-gradient-hover':
      rules.push(`${BTN_SEL} {
  border-radius: 99px !important;
}
.button-submit {
  background: ${c.accent};
  color: ${accentOn};
}
@media (hover: hover) {
  .button-submit:hover {
    background: linear-gradient(90deg, ${c.accent}, ${shiftLightness(c.accent, 0.2)});
  }
}`);
      break;
    case 'ghost-border-fill':
      rules.push(`${BTN_SEL} {
  background: transparent;
  border: 0.14em solid ${withAlpha(c.textPrimary, 0.3)};
  color: ${c.textPrimary};
}
.button-submit {
  border-color: ${c.accent};
  color: ${c.accent};
}
@media (hover: hover) {
  .button-submit:hover {
    background: ${c.accent};
    color: ${accentOn};
  }
}`);
      break;
    case 'shadow-lift':
      rules.push(`${BTN_SEL} {
  box-shadow: 0 0.3em 0.8em rgba(0, 0, 0, 0.4);
}
@media (hover: hover) {
  ${BTN_SEL}:hover {
    transform: translateY(-0.2em) scale(1.02);
    box-shadow: 0 0.6em 1.4em rgba(0, 0, 0, 0.5);
  }
}`);
      break;
    case 'retro-bevel':
      rules.push(`${BTN_SEL} {
  border: 2px solid ${shiftLightness(c.raised, -0.3)};
  border-radius: 2px !important;
  box-shadow: 3px 3px 0 ${shiftLightness(c.raised, -0.35)};
}
.button-submit {
  background: ${c.accent};
  border-color: ${shiftLightness(c.accent, -0.3)};
  box-shadow: 3px 3px 0 ${shiftLightness(c.accent, -0.35)};
  color: ${accentOn};
}
${BTN_SEL}:active {
  box-shadow: 1px 1px 0 currentColor;
  transform: translate(2px, 2px);
}`);
      break;
    case 'inset-carve':
      rules.push(`${BTN_SEL} {
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.45), inset 0 -1px 0 ${withAlpha('#ffffff', 0.06)};
}
.button-submit {
  background: ${shiftLightness(c.accent, -0.06)};
}`);
      break;
    case 'double-border':
      rules.push(`${BTN_SEL} {
  border: 2px solid ${withAlpha(c.textPrimary, 0.3)};
  outline: 1px solid ${withAlpha(c.textPrimary, 0.15)};
  outline-offset: 2px;
}
.button-submit {
  border-color: ${c.accent};
  outline-color: ${withAlpha(c.accent, 0.3)};
}`);
      break;
    case 'sharp-edge':
      rules.push(`${BTN_SEL} {
  border-radius: 0 !important;
}
.button-submit {
  background: ${c.accent};
  color: ${accentOn};
}`);
      break;
    case 'gradient-outline':
      rules.push(`${BTN_SEL} {
  border: 2px solid transparent;
  background:
    linear-gradient(${c.raised}, ${c.raised}) padding-box,
    linear-gradient(135deg, ${c.accent}, ${shiftLightness(c.accent, 0.3)}) border-box;
}`);
      break;
    case 'wireframe':
      rules.push(`${BTN_SEL} {
  background: transparent;
  border: 1px dashed ${withAlpha(c.textPrimary, 0.45)};
  color: ${c.textPrimary};
}
.button-submit {
  border-color: ${c.accent};
  color: ${c.accent};
}`);
      break;
    default:
      rules.push(`@media (hover: hover) {
  ${BTN_SEL}:hover {
    filter: brightness(1.18);
  }
}`);
  }
  return rules.join('\n');
}

export const CARD_PRESETS: { id: ThemeState['cards']['preset']; labelKey: string }[] = [
  'flat',
  'rounded-soft',
  'floating-shadow',
  'glassmorphism',
  'accent-border',
  'overlay-zoom',
  'gradient-border',
  'neon-outline',
  'striped-accent',
  'elevated-3d',
  'minimal-ghost',
  'glow-hover-ring',
  'polaroid',
  'ribbon-corner',
  'inner-glow',
  'dashed-outline',
  'clip-corner',
  'soft-stack',
  'holo-shine',
  'sticker'
].map((id) => ({ id: id as ThemeState['cards']['preset'], labelKey: `components.cardPreset.${id}` }));

function cardRules(t: ThemeState, dur: (n: number) => string): string {
  const cd = t.cards;
  const c = t.colors;
  const rules: string[] = [];
  rules.push(`.cardBox, .cardScalable, .cardImageContainer, .cardOverlayContainer,
.cardContent, .cardContent-shadow, .visualCardBox {
  border-radius: ${cd.radius}px;
}
.cardScalable {
  overflow: hidden;
}
.defaultCardBackground1 { background-color: ${shiftLightness(c.accent, -0.18)}; }
.defaultCardBackground2 { background-color: ${shiftLightness(c.accent, 0.08)}; }
.defaultCardBackground3 { background-color: ${c.accent}; }
.defaultCardBackground4 { background-color: ${shiftLightness(c.accent, -0.28)}; }
.defaultCardBackground5 { background-color: ${shiftLightness(c.accent, -0.08)}; }`);

  const transition = `transition: transform ${dur(0.2)} ease, box-shadow ${dur(0.2)} ease, border-color ${dur(0.2)} ease;`;

  switch (cd.preset) {
    case 'flat':
      rules.push(`.cardBox {
  box-shadow: none;
}`);
      break;
    case 'floating-shadow':
      rules.push(`.cardBox {
  box-shadow: 0 0.6em 1.4em rgba(0, 0, 0, 0.35);
}
@media (hover: hover) {
  .cardBox { ${transition} }
  .card:hover .cardBox {
    transform: translateY(-0.4em);
    box-shadow: 0 1.1em 2em rgba(0, 0, 0, 0.5);
  }
}`);
      break;
    case 'glassmorphism':
      rules.push(`.cardContent-shadow, .cardContent {
  background: ${withAlpha(c.surface, 0.35)};
  -webkit-backdrop-filter: blur(8px) saturate(1.5);
  backdrop-filter: blur(8px) saturate(1.5);
}
.cardBox {
  border: 1px solid ${withAlpha('#ffffff', 0.14)};
}`);
      break;
    case 'accent-border':
      rules.push(`.cardScalable {
  border: 2px solid ${withAlpha(c.accent, 0.55)};
}
@media (hover: hover) {
  .cardScalable { ${transition} }
  .card:hover .cardScalable {
    border-color: ${c.accent};
  }
}`);
      break;
    case 'overlay-zoom':
      rules.push(`.cardOverlayContainer {
  background: linear-gradient(0deg, ${withAlpha('#000000', 0.55)}, transparent 60%);
  opacity: 0;
}
@media (hover: hover) {
  .cardImage, .cardImageContainer { ${transition} }
  .cardOverlayContainer { transition: opacity ${dur(0.2)} ease; }
  .card:hover .cardOverlayContainer {
    opacity: 1;
  }
  .card:hover .cardImage, .card:hover .cardImageContainer {
    transform: scale(1.08);
  }
}`);
      break;
    case 'gradient-border':
      rules.push(`.cardScalable {
  border: 2px solid transparent;
  background:
    linear-gradient(${c.surface}, ${c.surface}) padding-box,
    linear-gradient(135deg, ${c.accent}, ${shiftLightness(c.accent, 0.25)}) border-box;
}`);
      break;
    case 'neon-outline':
      rules.push(`.cardScalable {
  border: 1px solid ${c.accent};
  box-shadow: 0 0 0.7em ${withAlpha(c.accent, 0.5)}, inset 0 0 0.5em ${withAlpha(c.accent, 0.2)};
}
@media (hover: hover) {
  .cardScalable { ${transition} }
  .card:hover .cardScalable {
    box-shadow: 0 0 1.2em ${withAlpha(c.accent, 0.8)}, inset 0 0 0.8em ${withAlpha(c.accent, 0.35)};
  }
}`);
      break;
    case 'striped-accent':
      rules.push(`.cardBox {
  position: relative;
}
.cardBox::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 0.28em;
  z-index: 1;
  background: repeating-linear-gradient(45deg,
    ${c.accent} 0 10px, ${withAlpha(c.accent, 0.35)} 10px 20px);
}`);
      break;
    case 'elevated-3d':
      rules.push(`.cardBox {
  box-shadow: 0 0.3em 0 ${shiftLightness(c.surface, -0.2)}, 0 0.8em 1.6em rgba(0, 0, 0, 0.4);
}
@media (hover: hover) {
  .cardBox { ${transition} }
  .card:hover .cardBox {
    transform: translateY(-0.3em) rotate(-0.3deg);
    box-shadow: 0 0.5em 0 ${shiftLightness(c.surface, -0.2)}, 0 1.2em 2.2em rgba(0, 0, 0, 0.5);
  }
}`);
      break;
    case 'minimal-ghost':
      rules.push(`.cardBox {
  box-shadow: none;
  background: transparent;
}
.cardScalable {
  border: none;
}`);
      break;
    case 'glow-hover-ring':
      rules.push(`@media (hover: hover) {
  .cardScalable {
    border: 2px solid transparent;
    ${transition}
  }
  .card:hover .cardScalable {
    border-color: ${withAlpha(c.accent, 0.7)};
    box-shadow: 0 0 0 0.25em ${withAlpha(c.accent, 0.18)};
  }
}`);
      break;
    case 'polaroid':
      rules.push(`.cardBox {
  background: ${shiftLightness(c.surface, 0.06)};
  padding: 0.5em 0.5em 1.4em;
  box-shadow: 0 0.5em 1em rgba(0, 0, 0, 0.4);
}`);
      break;
    case 'ribbon-corner':
      rules.push(`.cardBox {
  position: relative;
  overflow: hidden;
}
.cardBox::after {
  content: '';
  position: absolute;
  top: 0.6em;
  right: -1.6em;
  width: 4em;
  height: 1em;
  background: ${c.accent};
  transform: rotate(45deg);
}`);
      break;
    case 'inner-glow':
      rules.push(`.cardScalable {
  box-shadow: inset 0 0 1.2em ${withAlpha(c.accent, 0.25)};
}
@media (hover: hover) {
  .cardScalable { ${transition} }
  .card:hover .cardScalable {
    box-shadow: inset 0 0 1.8em ${withAlpha(c.accent, 0.4)};
  }
}`);
      break;
    case 'dashed-outline':
      rules.push(`.cardScalable {
  border: 2px dashed ${withAlpha(c.textPrimary, 0.4)};
}
@media (hover: hover) {
  .card:hover .cardScalable {
    border-color: ${c.accent};
  }
}`);
      break;
    case 'clip-corner':
      rules.push(`.cardBox {
  clip-path: polygon(0 0, calc(100% - 1.2em) 0, 100% 1.2em, 100% 100%, 0 100%);
}`);
      break;
    case 'soft-stack':
      rules.push(`.cardBox {
  box-shadow: 0 0 0 0.35em ${withAlpha(c.surface, 0.6)}, 0 0.6em 1.4em rgba(0, 0, 0, 0.35);
}`);
      break;
    case 'holo-shine':
      rules.push(`.cardScalable {
  background: linear-gradient(120deg, ${withAlpha(c.accent, 0.12)}, transparent 40%,
    ${withAlpha('#ffffff', 0.1)} 55%, transparent 70%, ${withAlpha(c.accent, 0.12)});
}`);
      break;
    case 'sticker':
      rules.push(`.cardBox {
  border-radius: 1.2em;
  border: 3px solid ${c.surface};
  box-shadow: 0 0.4em 1em rgba(0, 0, 0, 0.4);
}`);
      break;
    default:
      rules.push(`@media (hover: hover) {
  .cardBox { ${transition} }
  .card:hover .cardBox {
    transform: translateY(-0.4em);
    box-shadow: 0 0.9em 1.8em rgba(0, 0, 0, 0.45);
  }
}`);
  }
  return rules.join('\n');
}

export const INPUT_PRESETS: { id: ThemeState['inputs']['preset']; labelKey: string }[] = [
  'default',
  'underline',
  'outline',
  'filled',
  'soft',
  'glassmorphism',
  'neon-glow',
  'minimal',
  'pill',
  'bottom-glow',
  'material',
  'bordered-focus',
  'shadow-inset',
  'gradient-border',
  'dashed',
  'ghost',
  'rounded-soft',
  'sharp',
  'elevated',
  'skeuomorphic'
].map((id) => ({ id: id as ThemeState['inputs']['preset'], labelKey: `components.inputPreset.${id}` }));

const INPUT_SEL = '.emby-input, .emby-textarea, .emby-select-withcolor';

function inputRules(t: ThemeState): string {
  const i = t.inputs;
  const c = t.colors;
  const rules: string[] = [`${INPUT_SEL} {
  border-radius: ${i.radius}px;
}`];

  switch (i.preset) {
    case 'underline':
      rules.push(`${INPUT_SEL} {
  background: transparent;
  border: none;
  border-bottom: 2px solid ${withAlpha(c.textPrimary, 0.35)};
  border-radius: 0;
}
${INPUT_SEL}:focus {
  border-bottom-color: ${c.accent};
}`);
      break;
    case 'outline':
      rules.push(`${INPUT_SEL} {
  background: transparent;
  border: 1px solid ${withAlpha(c.textPrimary, 0.35)};
}`);
      break;
    case 'filled':
      rules.push(`${INPUT_SEL} {
  background: ${shiftLightness(c.surface, 0.08)};
  border: none;
}`);
      break;
    case 'soft':
      rules.push(`${INPUT_SEL} {
  background: ${withAlpha(c.textPrimary, 0.06)};
  border: none;
}`);
      break;
    case 'glassmorphism':
      rules.push(`${INPUT_SEL} {
  background: ${withAlpha(c.surface, 0.35)};
  border: 1px solid ${withAlpha('#ffffff', 0.15)};
  -webkit-backdrop-filter: blur(8px);
  backdrop-filter: blur(8px);
}`);
      break;
    case 'neon-glow':
      rules.push(`${INPUT_SEL} {
  border: 1px solid ${c.accent};
  box-shadow: 0 0 0.5em ${withAlpha(c.accent, 0.4)};
}
${INPUT_SEL}:focus {
  box-shadow: 0 0 0.9em ${withAlpha(c.accent, 0.7)};
}`);
      break;
    case 'minimal':
      rules.push(`${INPUT_SEL} {
  background: transparent;
  border: none;
  box-shadow: none;
}`);
      break;
    case 'pill':
      rules.push(`${INPUT_SEL} {
  border-radius: 99px !important;
  padding-left: 1em;
  padding-right: 1em;
}`);
      break;
    case 'bottom-glow':
      rules.push(`${INPUT_SEL} {
  background: transparent;
  border: none;
  border-bottom: 2px solid ${withAlpha(c.textPrimary, 0.3)};
  border-radius: 0;
}
${INPUT_SEL}:focus {
  border-bottom-color: ${c.accent};
  box-shadow: 0 0.3em 0.4em -0.3em ${withAlpha(c.accent, 0.8)};
}`);
      break;
    case 'material':
      rules.push(`${INPUT_SEL} {
  background: ${shiftLightness(c.surface, 0.05)};
  border: none;
  border-bottom: 2px solid ${withAlpha(c.textPrimary, 0.25)};
  border-radius: 0.3em 0.3em 0 0;
}
${INPUT_SEL}:focus {
  border-bottom-color: ${c.accent};
}`);
      break;
    case 'bordered-focus':
      rules.push(`${INPUT_SEL} {
  border: 1px solid transparent;
}
${INPUT_SEL}:focus {
  border-color: ${c.accent};
}`);
      break;
    case 'shadow-inset':
      rules.push(`${INPUT_SEL} {
  border: none;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.4);
}`);
      break;
    case 'gradient-border':
      rules.push(`${INPUT_SEL} {
  border: 2px solid transparent;
  background:
    linear-gradient(${shiftLightness(c.surface, 0.035)}, ${shiftLightness(c.surface, 0.035)}) padding-box,
    linear-gradient(135deg, ${c.accent}, ${shiftLightness(c.accent, 0.3)}) border-box;
}`);
      break;
    case 'dashed':
      rules.push(`${INPUT_SEL} {
  background: transparent;
  border: 1px dashed ${withAlpha(c.textPrimary, 0.4)};
}`);
      break;
    case 'ghost':
      rules.push(`${INPUT_SEL} {
  background: transparent;
  border: 1px solid transparent;
  opacity: 0.85;
}
${INPUT_SEL}:focus {
  opacity: 1;
  border-color: ${withAlpha(c.textPrimary, 0.25)};
}`);
      break;
    case 'rounded-soft':
      rules.push(`${INPUT_SEL} {
  border-radius: 1.2em !important;
}`);
      break;
    case 'sharp':
      rules.push(`${INPUT_SEL} {
  border-radius: 0 !important;
}`);
      break;
    case 'elevated':
      rules.push(`${INPUT_SEL} {
  border: none;
  box-shadow: 0 0.3em 0.7em rgba(0, 0, 0, 0.35);
}`);
      break;
    case 'skeuomorphic':
      rules.push(`${INPUT_SEL} {
  background: linear-gradient(180deg, ${shiftLightness(c.surface, -0.02)}, ${shiftLightness(c.surface, 0.05)});
  border: 1px solid ${shiftLightness(c.surface, -0.15)};
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.4);
}`);
      break;
    default:
      break;
  }
  return rules.join('\n');
}

export const SCROLLBAR_PRESETS: { id: ThemeState['scrollbar']['preset']; labelKey: string }[] = [
  'default',
  'thin',
  'pill',
  'square',
  'accent-glow',
  'gradient',
  'minimal',
  'hidden-until-hover',
  'neon',
  'outlined',
  'large',
  'rounded-track',
  'inset',
  'flat-dark',
  'flat-light',
  'striped',
  'dotted',
  'glass',
  'bold',
  'retro'
].map((id) => ({ id: id as ThemeState['scrollbar']['preset'], labelKey: `components.scrollbarPreset.${id}` }));

function scrollbarRules(t: ThemeState): string {
  const c = t.colors;
  const s = t.scrollbar;
  switch (s.preset) {
    case 'thin':
      return `* { scrollbar-width: thin; }
::-webkit-scrollbar { width: 6px; height: 6px; }`;
    case 'pill':
      return `::-webkit-scrollbar-thumb:horizontal, ::-webkit-scrollbar-thumb:vertical {
  border-radius: 99px;
}`;
    case 'square':
      return `::-webkit-scrollbar-thumb:horizontal, ::-webkit-scrollbar-thumb:vertical {
  border-radius: 0;
}`;
    case 'accent-glow':
      return `::-webkit-scrollbar-thumb:horizontal, ::-webkit-scrollbar-thumb:vertical {
  background-color: ${c.accent};
  box-shadow: 0 0 0.5em ${withAlpha(c.accent, 0.6)};
}
* { scrollbar-color: ${c.accent} ${c.background}; }`;
    case 'gradient':
      return `::-webkit-scrollbar-thumb:horizontal, ::-webkit-scrollbar-thumb:vertical {
  background: linear-gradient(${shiftLightness(c.raised, 0.15)}, ${shiftLightness(c.raised, -0.1)});
}`;
    case 'minimal':
      return `::-webkit-scrollbar { width: 4px; height: 4px; }
::-webkit-scrollbar-track-piece { background: transparent; }
* { scrollbar-width: thin; scrollbar-color: ${withAlpha(c.textPrimary, 0.2)} transparent; }`;
    case 'hidden-until-hover':
      return `::-webkit-scrollbar-thumb:horizontal, ::-webkit-scrollbar-thumb:vertical {
  background-color: transparent;
}
*:hover::-webkit-scrollbar-thumb:horizontal, *:hover::-webkit-scrollbar-thumb:vertical {
  background-color: ${c.raised};
}`;
    case 'neon':
      return `::-webkit-scrollbar-thumb:horizontal, ::-webkit-scrollbar-thumb:vertical {
  background-color: ${c.accent};
  box-shadow: inset 0 0 0.4em ${withAlpha(c.accent, 0.8)};
  border-radius: 99px;
}`;
    case 'outlined':
      return `::-webkit-scrollbar-thumb:horizontal, ::-webkit-scrollbar-thumb:vertical {
  border: 1px solid ${withAlpha(c.textPrimary, 0.3)};
}`;
    case 'large':
      return `::-webkit-scrollbar { width: 14px; height: 14px; }`;
    case 'rounded-track':
      return `::-webkit-scrollbar-track-piece {
  border-radius: 99px;
  background-color: ${shiftLightness(c.background, 0.08)};
}`;
    case 'inset':
      return `::-webkit-scrollbar-thumb:horizontal, ::-webkit-scrollbar-thumb:vertical {
  box-shadow: inset 0 0 4px rgba(0, 0, 0, 0.5);
}`;
    case 'flat-dark':
      return `::-webkit-scrollbar-thumb:horizontal, ::-webkit-scrollbar-thumb:vertical {
  background-color: ${shiftLightness(c.background, 0.15)};
}
::-webkit-scrollbar-track-piece { background-color: ${c.background}; }`;
    case 'flat-light':
      return `::-webkit-scrollbar-thumb:horizontal, ::-webkit-scrollbar-thumb:vertical {
  background-color: ${withAlpha(c.textPrimary, 0.4)};
}
::-webkit-scrollbar-track-piece { background-color: transparent; }`;
    case 'striped':
      return `::-webkit-scrollbar-thumb:horizontal, ::-webkit-scrollbar-thumb:vertical {
  background-image: repeating-linear-gradient(45deg,
    ${c.raised} 0 6px, ${shiftLightness(c.raised, 0.1)} 6px 12px);
}`;
    case 'dotted':
      return `::-webkit-scrollbar-track-piece {
  background-image: radial-gradient(${withAlpha(c.textPrimary, 0.2)} 1px, transparent 1px);
  background-size: 6px 6px;
}`;
    case 'glass':
      return `::-webkit-scrollbar-thumb:horizontal, ::-webkit-scrollbar-thumb:vertical {
  background-color: ${withAlpha(c.raised, 0.5)};
  -webkit-backdrop-filter: blur(4px);
  backdrop-filter: blur(4px);
}`;
    case 'bold':
      return `::-webkit-scrollbar { width: 16px; height: 16px; }
::-webkit-scrollbar-thumb:horizontal, ::-webkit-scrollbar-thumb:vertical {
  background-color: ${c.accent};
  border: 3px solid ${c.background};
}`;
    case 'retro':
      return `::-webkit-scrollbar-thumb:horizontal, ::-webkit-scrollbar-thumb:vertical {
  background-color: ${shiftLightness(c.raised, -0.1)};
  border: 2px outset ${shiftLightness(c.raised, 0.2)};
  border-radius: 0;
}`;
    default:
      return '';
  }
}

function progressRules(t: ThemeState): string {
  const p = t.progress;
  const c = t.colors;
  const radius = p.style === 'flat' ? '0' : '99px';
  const extras: string[] = [];
  if (p.style === 'glow') {
    extras.push(`.itemProgressBarForeground {
  box-shadow: 0 0 0.6em ${withAlpha(c.accent, 0.8)};
}`);
  }
  if (p.style === 'striped') {
    extras.push(`.itemProgressBarForeground {
  background-image: repeating-linear-gradient(45deg,
    ${withAlpha('#ffffff', 0.22)} 0 6px, transparent 6px 12px);
}`);
  }
  return `.itemProgressBar {
  height: ${p.height}px;
  border-radius: ${radius};
  background: ${withAlpha(c.textPrimary, 0.18)};
  overflow: hidden;
}
.itemProgressBarForeground {
  border-radius: ${radius};
}
${extras.join('\n')}`;
}

export const HEADER_PRESETS: { id: ThemeState['header']['style']; labelKey: string }[] = [
  'solid',
  'transparent',
  'blur',
  'gradient',
  'bordered-bottom',
  'glass-frost',
  'neon-underline',
  'shadow-drop',
  'minimal-flat',
  'elevated',
  'sticky-blur',
  'color-wash',
  'outline-bottom',
  'translucent-dark',
  'frosted-light',
  'bold-accent',
  'two-tone',
  'vignette',
  'soft-glow',
  'retro-bar'
].map((id) => ({ id: id as ThemeState['header']['style'], labelKey: `components.headerPreset.${id}` }));

function headerRules(t: ThemeState): string {
  const c = t.colors;
  switch (t.header.style) {
    case 'transparent':
      return `.skinHeader-withBackground {
  background: transparent;
}
.skinHeader.semiTransparent {
  background: linear-gradient(${withAlpha(c.background, 0.7)}, transparent);
}`;
    case 'blur':
      return `.skinHeader-withBackground {
  background: ${withAlpha(c.surface, 0.55)};
  -webkit-backdrop-filter: blur(14px) saturate(1.4);
  backdrop-filter: blur(14px) saturate(1.4);
}`;
    case 'gradient':
      return `.skinHeader-withBackground {
  background: linear-gradient(90deg, ${c.surface}, ${shiftLightness(c.surface, -0.06)});
}`;
    case 'bordered-bottom':
      return `.skinHeader-withBackground {
  background-color: ${c.surface};
  border-bottom: 2px solid ${withAlpha(c.textPrimary, 0.15)};
}`;
    case 'glass-frost':
      return `.skinHeader-withBackground {
  background: ${withAlpha(c.surface, 0.4)};
  border-bottom: 1px solid ${withAlpha('#ffffff', 0.1)};
  -webkit-backdrop-filter: blur(20px) saturate(1.6);
  backdrop-filter: blur(20px) saturate(1.6);
}`;
    case 'neon-underline':
      return `.skinHeader-withBackground {
  background-color: ${c.surface};
  border-bottom: 2px solid ${c.accent};
  box-shadow: 0 2px 0.6em ${withAlpha(c.accent, 0.5)};
}`;
    case 'shadow-drop':
      return `.skinHeader-withBackground {
  background-color: ${c.surface};
  box-shadow: 0 0.4em 1em rgba(0, 0, 0, 0.45);
}`;
    case 'minimal-flat':
      return `.skinHeader-withBackground {
  background: transparent;
  box-shadow: none;
}`;
    case 'elevated':
      return `.skinHeader-withBackground {
  background-color: ${shiftLightness(c.surface, 0.04)};
  box-shadow: 0 0.2em 0.6em rgba(0, 0, 0, 0.35);
}`;
    case 'sticky-blur':
      return `.skinHeader-withBackground {
  position: sticky;
  top: 0;
  background: ${withAlpha(c.background, 0.7)};
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
}`;
    case 'color-wash':
      return `.skinHeader-withBackground {
  background: ${withAlpha(c.accent, 0.16)};
}`;
    case 'outline-bottom':
      return `.skinHeader-withBackground {
  background: transparent;
  border-bottom: 1px solid ${withAlpha(c.textPrimary, 0.25)};
}`;
    case 'translucent-dark':
      return `.skinHeader-withBackground {
  background: ${withAlpha('#000000', 0.45)};
}`;
    case 'frosted-light':
      return `.skinHeader-withBackground {
  background: ${withAlpha('#ffffff', 0.08)};
  -webkit-backdrop-filter: blur(16px);
  backdrop-filter: blur(16px);
}`;
    case 'bold-accent':
      return `.skinHeader-withBackground {
  background-color: ${c.accent};
}`;
    case 'two-tone':
      return `.skinHeader-withBackground {
  background: linear-gradient(180deg, ${shiftLightness(c.surface, 0.05)} 50%, ${c.surface} 50%);
}`;
    case 'vignette':
      return `.skinHeader-withBackground {
  background: radial-gradient(ellipse at center, ${shiftLightness(c.surface, 0.05)}, ${shiftLightness(c.surface, -0.1)});
}`;
    case 'soft-glow':
      return `.skinHeader-withBackground {
  background-color: ${c.surface};
  box-shadow: 0 0 1.4em ${withAlpha(c.accent, 0.25)};
}`;
    case 'retro-bar':
      return `.skinHeader-withBackground {
  background-color: ${c.surface};
  border-bottom: 3px double ${withAlpha(c.textPrimary, 0.3)};
}`;
    default:
      return `.skinHeader-withBackground {
  background-color: ${c.surface};
}`;
  }
}

function drawerRules(t: ThemeState): string {
  const c = t.colors;
  switch (t.drawer.style) {
    case 'floating':
      return `.mainDrawer {
  background: ${withAlpha(c.surface, 0.96)};
  margin: 0.8em;
  height: calc(100% - 1.6em);
  border-radius: 1em;
  box-shadow: 0 1em 3em rgba(0, 0, 0, 0.5);
}
.navMenuOption {
  border-radius: 0.55em;
  margin: 0.1em 0.5em;
}`;
    case 'transparent':
      return `.mainDrawer, .drawer-open {
  background: ${withAlpha(c.background, 0.62)};
  -webkit-backdrop-filter: blur(20px);
  backdrop-filter: blur(20px);
}`;
    default:
      return `.mainDrawer, .drawer-open {
  background-color: ${c.background};
}`;
  }
}

function tabRules(t: ThemeState, accentOn: string): string {
  const c = t.colors;
  switch (t.tabs.style) {
    case 'pill':
      return `.emby-tab-button {
  border-radius: 99px;
  padding: 0.4em 1.2em;
  color: ${c.textSecondary};
}
.emby-tab-button-active {
  background: ${c.accent};
  color: ${accentOn} !important;
}`;
    case 'block':
      return `.emby-tab-button {
  border-radius: 0.5em;
  color: ${c.textSecondary};
}
.emby-tab-button-active {
  background: ${withAlpha(c.accent, 0.18)};
  color: ${c.accent} !important;
}`;
    default:
      return `.emby-tab-button {
  color: ${c.textSecondary};
  border-bottom: 3px solid transparent;
}
.emby-tab-button-active {
  color: ${c.textPrimary};
  border-bottom-color: ${c.accent};
}
.emby-tab-button:hover {
  color: ${c.accent};
}`;
  }
}

function animationRules(t: ThemeState, dur: (n: number) => string): string {
  if (t.animation.speed === 'off') {
    return `*, *::before, *::after {
  transition: none !important;
  animation-duration: 0.001s !important;
}`;
  }
  return `.emby-button, .navMenuOption, .paper-icon-button-light,
.emby-tab-button, .listItem, .headerButton {
  transition: background ${dur(0.18)} ease, color ${dur(0.18)} ease,
    box-shadow ${dur(0.18)} ease, transform ${dur(0.18)} ease,
    filter ${dur(0.18)} ease;
}`;
}
