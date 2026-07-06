import { ThemeState, defaultTheme } from '../state/types';

export interface Preset {
  id: string;
  name: string;
  descKey: string;
  swatches: string[];
  build: () => ThemeState;
}

interface PresetColors {
  accent: string;
  background: string;
  surface: string;
  raised: string;
  textPrimary?: string;
  textSecondary?: string;
}

function make(colors: PresetColors, extras: (t: ThemeState) => void = () => {}): () => ThemeState {
  return () => {
    const t = defaultTheme();
    t.colors = {
      textPrimary: 'rgba(255,255,255,0.87)',
      textSecondary: 'rgba(255,255,255,0.55)',
      ...colors
    };
    extras(t);
    return t;
  };
}

export const PRESETS: Preset[] = [
  {
    id: 'forge-ember',
    name: 'Forge Ember',
    descKey: 'catalog.preset.forgeEmber',
    swatches: ['#ff8c26', '#14100c', '#221a12'],
    build: make(
      { accent: '#ff8c26', background: '#14100c', surface: '#221a12', raised: '#32261a' },
      (t) => {
        t.background.type = 'gradient';
        t.background.gradientFrom = '#14100c';
        t.background.gradientTo = '#2b1608';
        t.background.gradientAngle = 200;
        t.cards.preset = 'glow-hover-ring';
        t.progress.style = 'glow';
      }
    )
  },
  {
    id: 'jelly-purple',
    name: 'Jelly Purple',
    descKey: 'catalog.preset.jellyPurple',
    swatches: ['#a78bfa', '#120e1c', '#1d1630'],
    build: make(
      { accent: '#a78bfa', background: '#120e1c', surface: '#1d1630', raised: '#2b2145' },
      (t) => {
        t.background.type = 'gradient';
        t.background.gradientFrom = '#120e1c';
        t.background.gradientTo = '#231240';
        t.tabs.style = 'pill';
      }
    )
  },
  {
    id: 'deep-ocean',
    name: 'Deep Ocean',
    descKey: 'catalog.preset.deepOcean',
    swatches: ['#4cc2ff', '#081420', '#0e2233'],
    build: make(
      { accent: '#4cc2ff', background: '#081420', surface: '#0e2233', raised: '#163349' },
      (t) => {
        t.header.style = 'blur';
        t.cards.preset = 'overlay-zoom';
      }
    )
  },
  {
    id: 'emerald',
    name: 'Emerald Night',
    descKey: 'catalog.preset.emerald',
    swatches: ['#34d399', '#0a1410', '#122019'],
    build: make({ accent: '#34d399', background: '#0a1410', surface: '#122019', raised: '#1c3327' })
  },
  {
    id: 'crimson',
    name: 'Crimson Hall',
    descKey: 'catalog.preset.crimson',
    swatches: ['#f43f5e', '#160a0d', '#241016'],
    build: make(
      { accent: '#f43f5e', background: '#160a0d', surface: '#241016', raised: '#3a1a23' },
      (t) => {
        t.buttons.preset = 'soft';
        t.progress.style = 'striped';
      }
    )
  },
  {
    id: 'slate',
    name: 'Slate Minimal',
    descKey: 'catalog.preset.slate',
    swatches: ['#94a3b8', '#111418', '#1a1f26'],
    build: make(
      { accent: '#94a3b8', background: '#111418', surface: '#1a1f26', raised: '#262d37' },
      (t) => {
        t.cards.preset = 'flat';
        t.buttons.preset = 'flat-minimal';
        t.cards.radius = 2;
        t.buttons.radius = 2;
        t.animation.speed = 'fast';
      }
    )
  },
  {
    id: 'nordic',
    name: 'Nordic Frost',
    descKey: 'catalog.preset.nordic',
    swatches: ['#88c0d0', '#2e3440', '#3b4252'],
    build: make(
      {
        accent: '#88c0d0',
        background: '#2e3440',
        surface: '#3b4252',
        raised: '#434c5e',
        textPrimary: '#eceff4',
        textSecondary: '#aeb6c4'
      },
      (t) => {
        t.tabs.style = 'block';
      }
    )
  },
  {
    id: 'dracula',
    name: 'Vampire Castle',
    descKey: 'catalog.preset.dracula',
    swatches: ['#bd93f9', '#191a24', '#282a36'],
    build: make(
      {
        accent: '#bd93f9',
        background: '#191a24',
        surface: '#232430',
        raised: '#2f3140',
        textPrimary: '#f8f8f2',
        textSecondary: '#8a8ca8'
      }
    )
  },
  {
    id: 'solar-dusk',
    name: 'Solar Dusk',
    descKey: 'catalog.preset.solarDusk',
    swatches: ['#fbbf24', '#1a1408', '#292013'],
    build: make(
      { accent: '#fbbf24', background: '#1a1408', surface: '#292013', raised: '#3c2f1c' },
      (t) => {
        t.background.type = 'gradient';
        t.background.gradientFrom = '#1a1408';
        t.background.gradientTo = '#33200b';
        t.background.gradientAngle = 330;
      }
    )
  },
  {
    id: 'oled',
    name: 'OLED Black',
    descKey: 'catalog.preset.oled',
    swatches: ['#00a4dc', '#000000', '#0d0d0d'],
    build: make(
      { accent: '#00a4dc', background: '#000000', surface: '#0d0d0d', raised: '#191919' },
      (t) => {
        t.header.style = 'solid';
        t.cards.preset = 'glow-hover-ring';
        t.animation.speed = 'fast';
      }
    )
  },
  {
    id: 'rose-quartz',
    name: 'Rose Quartz',
    descKey: 'catalog.preset.roseQuartz',
    swatches: ['#f9a8d4', '#171016', '#251a23'],
    build: make(
      { accent: '#f9a8d4', background: '#171016', surface: '#251a23', raised: '#392a36' },
      (t) => {
        t.buttons.radius = 20;
        t.cards.radius = 14;
        t.tabs.style = 'pill';
      }
    )
  },
  {
    id: 'high-contrast',
    name: 'High Contrast',
    descKey: 'catalog.preset.highContrast',
    swatches: ['#ffd60a', '#000000', '#141414'],
    build: make(
      {
        accent: '#ffd60a',
        background: '#000000',
        surface: '#141414',
        raised: '#242424',
        textPrimary: '#ffffff',
        textSecondary: '#d0d0d0'
      },
      (t) => {
        t.typography.textScale = 110;
        t.progress.height = 8;
        t.animation.speed = 'off';
      }
    )
  },
  {
    id: 'cyberpunk-neon',
    name: 'Cyberpunk Neon',
    descKey: 'catalog.preset.cyberpunkNeon',
    swatches: ['#ff2e88', '#0a0014', '#170826'],
    build: make(
      { accent: '#ff2e88', background: '#0a0014', surface: '#170826', raised: '#240f3d' },
      (t) => {
        t.buttons.preset = 'gradient';
        t.cards.preset = 'neon-outline';
        t.progress.style = 'glow';
      }
    )
  },
  {
    id: 'forest-moss',
    name: 'Forest Moss',
    descKey: 'catalog.preset.forestMoss',
    swatches: ['#84cc16', '#0d140a', '#172415'],
    build: make({ accent: '#84cc16', background: '#0d140a', surface: '#172415', raised: '#223420' })
  },
  {
    id: 'midnight-indigo',
    name: 'Midnight Indigo',
    descKey: 'catalog.preset.midnightIndigo',
    swatches: ['#6366f1', '#0b0d1a', '#131629'],
    build: make(
      { accent: '#6366f1', background: '#0b0d1a', surface: '#131629', raised: '#1d2140' },
      (t) => {
        t.background.type = 'gradient';
        t.background.gradientFrom = '#0b0d1a';
        t.background.gradientTo = '#1b1740';
        t.background.gradientAngle = 145;
      }
    )
  },
  {
    id: 'sunset-coral',
    name: 'Sunset Coral',
    descKey: 'catalog.preset.sunsetCoral',
    swatches: ['#fb7185', '#1a0e10', '#2b171a'],
    build: make(
      { accent: '#fb7185', background: '#1a0e10', surface: '#2b171a', raised: '#3f2226' },
      (t) => {
        t.background.type = 'gradient';
        t.background.gradientFrom = '#1a0e10';
        t.background.gradientTo = '#3a1418';
        t.background.gradientAngle = 200;
      }
    )
  },
  {
    id: 'arctic-sky',
    name: 'Arctic Sky',
    descKey: 'catalog.preset.arcticSky',
    swatches: ['#38bdf8', '#0c1620', '#16222e'],
    build: make(
      { accent: '#38bdf8', background: '#0c1620', surface: '#16222e', raised: '#223342' },
      (t) => {
        t.header.style = 'blur';
      }
    )
  },
  {
    id: 'golden-hour',
    name: 'Golden Hour',
    descKey: 'catalog.preset.goldenHour',
    swatches: ['#f59e0b', '#17120a', '#261d10'],
    build: make(
      { accent: '#f59e0b', background: '#17120a', surface: '#261d10', raised: '#382a17' },
      (t) => {
        t.buttons.preset = 'gradient';
      }
    )
  },
  {
    id: 'mint-fresh',
    name: 'Mint Fresh',
    descKey: 'catalog.preset.mintFresh',
    swatches: ['#2dd4bf', '#071614', '#0f2622'],
    build: make(
      { accent: '#2dd4bf', background: '#071614', surface: '#0f2622', raised: '#183a34' },
      (t) => {
        t.cards.preset = 'overlay-zoom';
        t.tabs.style = 'pill';
      }
    )
  },
  {
    id: 'royal-plum',
    name: 'Royal Plum',
    descKey: 'catalog.preset.royalPlum',
    swatches: ['#c084fc', '#150a1c', '#241531'],
    build: make({ accent: '#c084fc', background: '#150a1c', surface: '#241531', raised: '#351f47' })
  },
  {
    id: 'steel-blue',
    name: 'Steel Blue',
    descKey: 'catalog.preset.steelBlue',
    swatches: ['#60a5fa', '#0b1420', '#142334'],
    build: make(
      { accent: '#60a5fa', background: '#0b1420', surface: '#142334', raised: '#1e3349' },
      (t) => {
        t.cards.radius = 2;
        t.buttons.radius = 2;
        t.tabs.style = 'block';
      }
    )
  },
  {
    id: 'blood-orange',
    name: 'Blood Orange',
    descKey: 'catalog.preset.bloodOrange',
    swatches: ['#f97316', '#180b05', '#271208'],
    build: make(
      { accent: '#f97316', background: '#180b05', surface: '#271208', raised: '#3a1c0c' },
      (t) => {
        t.progress.style = 'striped';
      }
    )
  },
  {
    id: 'cherry-blossom',
    name: 'Cherry Blossom',
    descKey: 'catalog.preset.cherryBlossom',
    swatches: ['#f472b6', '#180a12', '#281221'],
    build: make(
      { accent: '#f472b6', background: '#180a12', surface: '#281221', raised: '#3a1b30' },
      (t) => {
        t.buttons.radius = 20;
        t.cards.radius = 16;
        t.tabs.style = 'pill';
      }
    )
  },
  {
    id: 'graphite',
    name: 'Graphite',
    descKey: 'catalog.preset.graphite',
    swatches: ['#a3a3a3', '#121212', '#1c1c1c'],
    build: make(
      { accent: '#a3a3a3', background: '#121212', surface: '#1c1c1c', raised: '#292929' },
      (t) => {
        t.cards.preset = 'flat';
        t.buttons.preset = 'flat-minimal';
        t.animation.speed = 'fast';
      }
    )
  },
  {
    id: 'lagoon',
    name: 'Lagoon',
    descKey: 'catalog.preset.lagoon',
    swatches: ['#22d3ee', '#051417', '#0b2328'],
    build: make(
      { accent: '#22d3ee', background: '#051417', surface: '#0b2328', raised: '#13343b' },
      (t) => {
        t.cards.preset = 'neon-outline';
      }
    )
  },
  {
    id: 'copper-dusk',
    name: 'Copper Dusk',
    descKey: 'catalog.preset.copperDusk',
    swatches: ['#d97757', '#170f0a', '#271b12'],
    build: make(
      { accent: '#d97757', background: '#170f0a', surface: '#271b12', raised: '#392a1c' },
      (t) => {
        t.buttons.preset = 'soft';
      }
    )
  },
  {
    id: 'neon-lime',
    name: 'Neon Lime',
    descKey: 'catalog.preset.neonLime',
    swatches: ['#a3e635', '#0c1206', '#17240c'],
    build: make(
      { accent: '#a3e635', background: '#0c1206', surface: '#17240c', raised: '#243614' },
      (t) => {
        t.buttons.preset = 'shadow-lift';
        t.progress.style = 'glow';
      }
    )
  },
  {
    id: 'deep-violet',
    name: 'Deep Violet',
    descKey: 'catalog.preset.deepViolet',
    swatches: ['#7c3aed', '#0e0a1c', '#1a1330'],
    build: make(
      { accent: '#7c3aed', background: '#0e0a1c', surface: '#1a1330', raised: '#281d47' },
      (t) => {
        t.header.style = 'transparent';
      }
    )
  },
  {
    id: 'amber-glass',
    name: 'Amber Glass',
    descKey: 'catalog.preset.amberGlass',
    swatches: ['#fbbf24', '#131008', '#201a10'],
    build: make(
      { accent: '#fbbf24', background: '#131008', surface: '#201a10', raised: '#2d2517' },
      (t) => {
        t.cards.preset = 'flat';
        t.header.style = 'transparent';
        t.drawer.style = 'floating';
      }
    )
  },
  {
    id: 'slate-teal',
    name: 'Slate Teal',
    descKey: 'catalog.preset.slateTeal',
    swatches: ['#14b8a6', '#0a1414', '#132323'],
    build: make(
      { accent: '#14b8a6', background: '#0a1414', surface: '#132323', raised: '#1d3434' },
      (t) => {
        t.cards.preset = 'striped-accent';
      }
    )
  }
];
