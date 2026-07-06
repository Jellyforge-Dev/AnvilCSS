export interface CommunityTheme {
  id: string;
  name: string;
  author: string;
  repo: string;
  importUrl: string;
  descKey: string;
  accent: string;
}

/** Import URLs verified against the repos on 2026-07-03. */
export const COMMUNITY_THEMES: CommunityTheme[] = [
  {
    id: 'scyfin',
    name: 'Scyfin',
    author: 'loof2736',
    repo: 'https://github.com/loof2736/scyfin',
    importUrl: 'https://cdn.jsdelivr.net/gh/loof2736/scyfin@latest/CSS/scyfin-theme.css',
    descKey: 'catalog.theme.scyfin',
    accent: '#00a4dc'
  },
  {
    id: 'catppuccin-mocha',
    name: 'Catppuccin Mocha',
    author: 'catppuccin',
    repo: 'https://github.com/catppuccin/jellyfin',
    importUrl: 'https://cdn.jsdelivr.net/gh/catppuccin/jellyfin@main/themes/catppuccin-mocha.css',
    descKey: 'catalog.theme.catppuccinMocha',
    accent: '#cba6f7'
  },
  {
    id: 'catppuccin-latte',
    name: 'Catppuccin Latte',
    author: 'catppuccin',
    repo: 'https://github.com/catppuccin/jellyfin',
    importUrl: 'https://cdn.jsdelivr.net/gh/catppuccin/jellyfin@main/themes/catppuccin-latte.css',
    descKey: 'catalog.theme.catppuccinLatte',
    accent: '#8839ef'
  },
  {
    id: 'jellyskin',
    name: 'JellySkin',
    author: 'prayag17',
    repo: 'https://github.com/prayag17/JellySkin',
    importUrl: 'https://cdn.jsdelivr.net/npm/jellyskin@latest/dist/main.css',
    descKey: 'catalog.theme.jellyskin',
    accent: '#00a4dc'
  },
  {
    id: 'ultrachromic',
    name: 'Ultrachromic (Monochromic)',
    author: 'CTalvio',
    repo: 'https://github.com/CTalvio/Ultrachromic',
    importUrl: 'https://ctalvio.github.io/Ultrachromic/presets/monochromic_preset.css',
    descKey: 'catalog.theme.ultrachromic',
    accent: '#e5e5e5'
  },
  {
    id: 'jamfin',
    name: 'Jamfin',
    author: 'JamsRepos',
    repo: 'https://github.com/JamsRepos/Jamfin',
    importUrl: 'https://cdn.jsdelivr.net/gh/JamsRepos/Jamfin@latest/theme/base.css',
    descKey: 'catalog.theme.jamfin',
    accent: '#7b68ee'
  },
  {
    id: 'zesty',
    name: 'ZestyTheme',
    author: 'stpnwf',
    repo: 'https://github.com/stpnwf/ZestyTheme',
    importUrl: 'https://cdn.jsdelivr.net/gh/stpnwf/ZestyTheme@latest/theme.css',
    descKey: 'catalog.theme.zesty',
    accent: '#ff9f43'
  },
  {
    id: 'zombie',
    name: 'Zombie Revived',
    author: 'MakD',
    repo: 'https://github.com/MakD/zombie-release',
    importUrl: 'https://cdn.jsdelivr.net/gh/MakD/zombie-release@latest/zombie_revived.css',
    descKey: 'catalog.theme.zombie',
    accent: '#77dd77'
  },
  {
    id: 'elegantfin',
    name: 'ElegantFin',
    author: 'lscambo13',
    repo: 'https://github.com/lscambo13/ElegantFin',
    importUrl:
      'https://cdn.jsdelivr.net/gh/lscambo13/ElegantFin@latest/Theme/ElegantFin-jellyfin-theme-build-latest-minified.css',
    descKey: 'catalog.theme.elegantfin',
    accent: '#4cc2ff'
  },
  {
    id: 'finimalism',
    name: 'Finimalism 12',
    author: 'tedhinklater',
    repo: 'https://github.com/tedhinklater/finimalism',
    importUrl: 'https://cdn.jsdelivr.net/gh/tedhinklater/finimalism@main/Finimalism12.css',
    descKey: 'catalog.theme.finimalism',
    accent: '#dddddd'
  },
  {
    id: 'neutralfin',
    name: 'NeutralFin',
    author: 'KartoffelChipss',
    repo: 'https://github.com/KartoffelChipss/NeutralFin',
    importUrl: 'https://cdn.jsdelivr.net/gh/KartoffelChipss/NeutralFin@main/theme/neutralfin.css',
    descKey: 'catalog.theme.neutralfin',
    accent: '#9e9e9e'
  },
  {
    id: 'abyss',
    name: 'Abyss',
    author: 'AumGupta',
    repo: 'https://github.com/AumGupta/abyss-jellyfin',
    importUrl: 'https://cdn.jsdelivr.net/gh/AumGupta/abyss-jellyfin@main/abyss.css',
    descKey: 'catalog.theme.abyss',
    accent: '#3f51b5'
  },
  {
    id: 'better-jellyfin-ui',
    name: 'Better Jellyfin UI',
    author: 'tromoSM',
    repo: 'https://github.com/tromoSM/better-jellyfin-ui',
    importUrl: 'https://cdn.jsdelivr.net/gh/tromoSM/better-jellyfin-ui@main/theme.css',
    descKey: 'catalog.theme.betterJellyfinUi',
    accent: '#00a4dc'
  },
  {
    id: 'evergarden',
    name: 'Evergarden (Winter)',
    author: 'everviolet',
    repo: 'https://github.com/everviolet/jellyfin',
    importUrl: 'https://everviolet.github.io/jellyfin/evergarden-winter.css',
    descKey: 'catalog.theme.evergarden',
    accent: '#a3c9a8'
  },
  {
    id: 'flow',
    name: 'Flow',
    author: 'LitCastVlog',
    repo: 'https://github.com/LitCastVlog/Flow',
    importUrl: 'https://cdn.jsdelivr.net/gh/LitCastVlog/Flow@main/CSS/ScyFlow-main.css',
    descKey: 'catalog.theme.flow',
    accent: '#00a4dc'
  },
  {
    id: 'finity',
    name: 'Finity',
    author: 'prism2001',
    repo: 'https://github.com/prism2001/finity',
    importUrl: 'https://cdn.jsdelivr.net/gh/prism2001/finity@main/complete/finity-complete.css',
    descKey: 'catalog.theme.finity',
    accent: '#e5e5e5'
  },
  {
    id: 'infinitv',
    name: 'InfiniTV',
    author: 'buesche87',
    repo: 'https://github.com/buesche87/infinitv',
    importUrl: 'https://buesche87.github.io/infinitv/infinitv.css',
    descKey: 'catalog.theme.infinitv',
    accent: '#00a4dc'
  },
  {
    id: 'jellyfin-better-styles',
    name: 'Jellyfin Better Styles',
    author: 'Tetrax-10',
    repo: 'https://github.com/Tetrax-10/jellyfin-better-styles',
    importUrl: 'https://tetrax-10.github.io/jellyfin-better-styles/theme.css',
    descKey: 'catalog.theme.jellyfinBetterStyles',
    accent: '#ff6b6b'
  },
  {
    id: 'jellyflix',
    name: 'JellyFlix',
    author: 'prayag17',
    repo: 'https://github.com/prayag17/JellyFlix',
    importUrl: 'https://cdn.jsdelivr.net/gh/prayag17/JellyFlix@latest/default.css',
    descKey: 'catalog.theme.jellyflix',
    accent: '#e50914'
  },
  {
    id: 'jellyfish',
    name: 'Jellyfish',
    author: 'n00bcodr',
    repo: 'https://github.com/n00bcodr/Jellyfish',
    importUrl: 'https://cdn.jsdelivr.net/gh/n00bcodr/jellyfish@main/theme.css',
    descKey: 'catalog.theme.jellyfish',
    accent: '#4cc2ff'
  },
  {
    id: 'glassmorphism',
    name: 'Glassmorphism',
    author: 'alexyle',
    repo: 'https://github.com/alexyle/jellyfin-theme',
    importUrl: 'https://cdn.jsdelivr.net/gh/alexyle/jellyfin-theme@main/glassmorphism/theme.css',
    descKey: 'catalog.theme.glassmorphism',
    accent: '#ffffff'
  },
  {
    id: 'derektata-dracula',
    name: 'Dracula (derektata)',
    author: 'derektata',
    repo: 'https://github.com/derektata/jellyfin-themes',
    importUrl: 'https://derektata.github.io/jellyfin-themes/dracula.css',
    descKey: 'catalog.theme.derektataDracula',
    accent: '#bd93f9'
  },
  {
    id: 'derektata-gruvbox',
    name: 'Gruvbox Dark (derektata)',
    author: 'derektata',
    repo: 'https://github.com/derektata/jellyfin-themes',
    importUrl: 'https://derektata.github.io/jellyfin-themes/gruvbox-dark.css',
    descKey: 'catalog.theme.derektataGruvbox',
    accent: '#fabd2f'
  },
  {
    id: 'derektata-onedark',
    name: 'One Dark (derektata)',
    author: 'derektata',
    repo: 'https://github.com/derektata/jellyfin-themes',
    importUrl: 'https://derektata.github.io/jellyfin-themes/one-dark.css',
    descKey: 'catalog.theme.derektataOnedark',
    accent: '#61afef'
  },
  {
    id: 'derektata-tokyo',
    name: 'Tokyo (derektata)',
    author: 'derektata',
    repo: 'https://github.com/derektata/jellyfin-themes',
    importUrl: 'https://derektata.github.io/jellyfin-themes/tokyo.css',
    descKey: 'catalog.theme.derektataTokyo',
    accent: '#7aa2f7'
  }
];

export interface CssSnippet {
  id: string;
  nameKey: string;
  descKey: string;
  css: string;
}

export const CSS_SNIPPETS: CssSnippet[] = [
  {
    id: 'hide-played',
    nameKey: 'catalog.snippet.hidePlayed',
    descKey: 'catalog.snippet.hidePlayedDesc',
    css: `/* Hide the checkmark on watched items */\n.playedIndicator {\n  display: none;\n}`
  },
  {
    id: 'round-cast',
    nameKey: 'catalog.snippet.roundCast',
    descKey: 'catalog.snippet.roundCastDesc',
    css: `/* Circular portraits for people cards */\n.personCard .cardImageContainer,\n.card-portrait .cardScalable:has(.cardImageIcon) {\n  border-radius: 50%;\n}`
  },
  {
    id: 'compact-cards',
    nameKey: 'catalog.snippet.compactCards',
    descKey: 'catalog.snippet.compactCardsDesc',
    css: `/* Tighter spacing between cards */\n.cardBox {\n  margin: 0.18em;\n}`
  },
  {
    id: 'dim-backdrops',
    nameKey: 'catalog.snippet.dimBackdrops',
    descKey: 'catalog.snippet.dimBackdropsDesc',
    css: `/* Darken and soften item backdrops for readable text */\n.backdropImage {\n  filter: blur(14px) brightness(0.55);\n}`
  },
  {
    id: 'thick-progress',
    nameKey: 'catalog.snippet.thickProgress',
    descKey: 'catalog.snippet.thickProgressDesc',
    css: `/* Chunkier resume bars on cards */\n.itemProgressBar {\n  height: 9px;\n}`
  },
  {
    id: 'hide-cast-scroll',
    nameKey: 'catalog.snippet.slimScrollbar',
    descKey: 'catalog.snippet.slimScrollbarDesc',
    css: `/* Slimmer scrollbars everywhere */\n.layout-desktop ::-webkit-scrollbar {\n  width: 0.25em;\n  height: 0.25em;\n}`
  },
  {
    id: 'centered-login',
    nameKey: 'catalog.snippet.centeredLogin',
    descKey: 'catalog.snippet.centeredLoginDesc',
    css: `/* Center the login card vertically with soft inputs */\n#loginPage .manualLoginForm {\n  margin-top: 14vh;\n}\n#loginPage .emby-input {\n  border-radius: 99px;\n  padding-left: 1.1em;\n}\n#loginPage .button-submit {\n  border-radius: 99px;\n}`
  },
  {
    id: 'fade-header',
    nameKey: 'catalog.snippet.fadeHeader',
    descKey: 'catalog.snippet.fadeHeaderDesc',
    css: `/* Gradient-fade the top bar into the page */\n.skinHeader-withBackground {\n  background: linear-gradient(180deg, rgba(0,0,0,0.72), transparent);\n  backdrop-filter: none;\n}`
  },
  {
    id: 'colorful-scrollbar',
    nameKey: 'catalog.snippet.colorfulScrollbar',
    descKey: 'catalog.snippet.colorfulScrollbarDesc',
    css: `/* Accent-colored scrollbar thumb on desktop */\n.layout-desktop ::-webkit-scrollbar-thumb {\n  background: rgba(0, 164, 220, 0.6);\n  border-radius: 99px;\n}\n.layout-desktop ::-webkit-scrollbar-track {\n  background: transparent;\n}`
  },
  {
    id: 'larger-posters',
    nameKey: 'catalog.snippet.largerPosters',
    descKey: 'catalog.snippet.largerPostersDesc',
    css: `/* Bigger poster cards in horizontal scrollers */\n.overflowPortraitCard {\n  width: 17vw !important;\n}`
  },
  {
    id: 'hide-genres',
    nameKey: 'catalog.snippet.hideGenres',
    descKey: 'catalog.snippet.hideGenresDesc',
    css: `/* Hide the genre tag row on the details page */\n.genreLinksContainer {\n  display: none;\n}`
  },
  {
    id: 'hide-cast',
    nameKey: 'catalog.snippet.hideCast',
    descKey: 'catalog.snippet.hideCastDesc',
    css: `/* Hide the cast & crew section on details pages */\n#castCollapsible {\n  display: none;\n}`
  },
  {
    id: 'always-transparent-header',
    nameKey: 'catalog.snippet.alwaysTransparentHeader',
    descKey: 'catalog.snippet.alwaysTransparentHeaderDesc',
    css: `/* Keep the top bar transparent even when scrolled */\n.skinHeader {\n  background-color: transparent !important;\n  box-shadow: none !important;\n}`
  },
  {
    id: 'full-bleed-backdrop',
    nameKey: 'catalog.snippet.fullBleedBackdrop',
    descKey: 'catalog.snippet.fullBleedBackdropDesc',
    css: `/* Let the backdrop image fill the whole viewport width */\n.backdropContainer {\n  left: 0 !important;\n  width: 100vw !important;\n}`
  },
  {
    id: 'round-user-avatar',
    nameKey: 'catalog.snippet.roundUserAvatar',
    descKey: 'catalog.snippet.roundUserAvatarDesc',
    css: `/* Circular user avatar in the header menu */\n.userAvatarImage {\n  border-radius: 50%;\n  overflow: hidden;\n}`
  },
  {
    id: 'bigger-episode-thumbs',
    nameKey: 'catalog.snippet.biggerEpisodeThumbs',
    descKey: 'catalog.snippet.biggerEpisodeThumbsDesc',
    css: `/* Larger episode thumbnails in the season list */\n.card.overflowBackdropCard {\n  width: 24vw !important;\n}`
  },
  {
    id: 'blurred-dialogs',
    nameKey: 'catalog.snippet.blurredDialogs',
    descKey: 'catalog.snippet.blurredDialogsDesc',
    css: `/* Frosted-glass backdrop behind popup dialogs */\n.dialogBackdrop {\n  backdrop-filter: blur(6px);\n  background: rgba(0, 0, 0, 0.45);\n}`
  },
  {
    id: 'underline-free-tabs',
    nameKey: 'catalog.snippet.underlineFreeTabs',
    descKey: 'catalog.snippet.underlineFreeTabsDesc',
    css: `/* Remove the underline indicator from section tabs */\n.emby-tab-button::after {\n  display: none !important;\n}`
  },
  {
    id: 'hide-server-name',
    nameKey: 'catalog.snippet.hideServerName',
    descKey: 'catalog.snippet.hideServerNameDesc',
    css: `/* Hide the server name text next to the logo */\n.headerServerName {\n  display: none;\n}`
  },
  {
    id: 'square-cards',
    nameKey: 'catalog.snippet.squareCards',
    descKey: 'catalog.snippet.squareCardsDesc',
    css: `/* Flatten all card corners back to square for a minimal look */\n.cardBox, .cardContent, .cardImageContainer {\n  border-radius: 0 !important;\n}`
  },
  {
    id: 'translucent-drawer',
    nameKey: 'catalog.snippet.translucentDrawer',
    descKey: 'catalog.snippet.translucentDrawerDesc',
    css: `/* Semi-transparent, blurred nav drawer */\n.mainDrawer {\n  background: rgba(20, 20, 20, 0.65) !important;\n  backdrop-filter: blur(10px);\n}`
  },
  {
    id: 'hide-rating-badge',
    nameKey: 'catalog.snippet.hideRatingBadge',
    descKey: 'catalog.snippet.hideRatingBadgeDesc',
    css: `/* Hide the community/critic rating badge on cards */\n.criticRating, .communityRating {\n  display: none;\n}`
  },
  {
    id: 'compact-header',
    nameKey: 'catalog.snippet.compactHeader',
    descKey: 'catalog.snippet.compactHeaderDesc',
    css: `/* Slimmer top bar height */\n.skinHeader {\n  min-height: 3.2em;\n}\n.headerRight {\n  height: 3.2em;\n}`
  },
  {
    id: 'sticky-player-shadow',
    nameKey: 'catalog.snippet.stickyPlayerShadow',
    descKey: 'catalog.snippet.stickyPlayerShadowDesc',
    css: `/* Drop shadow above the mini player bar */\n.nowPlayingBar {\n  box-shadow: 0 -0.6em 1.4em rgba(0, 0, 0, 0.5);\n}`
  },
  {
    id: 'wide-detail-logo',
    nameKey: 'catalog.snippet.wideDetailLogo',
    descKey: 'catalog.snippet.wideDetailLogoDesc',
    css: `/* Larger title-treatment logo on the details page */\n.detailLogo {\n  max-width: 28vw !important;\n}`
  },
  {
    id: 'hide-quick-connect',
    nameKey: 'catalog.snippet.hideQuickConnect',
    descKey: 'catalog.snippet.hideQuickConnectDesc',
    css: `/* Hide the Quick Connect button on the login page */\n.btnQuickConnect {\n  display: none;\n}`
  },
  {
    id: 'card-caption-fade',
    nameKey: 'catalog.snippet.cardCaptionFade',
    descKey: 'catalog.snippet.cardCaptionFadeDesc',
    css: `/* Fade in card titles only on hover, for a cleaner grid */\n.cardText {\n  opacity: 0;\n  transition: opacity 0.2s ease;\n}\n.card:hover .cardText {\n  opacity: 1;\n}`
  }
];
