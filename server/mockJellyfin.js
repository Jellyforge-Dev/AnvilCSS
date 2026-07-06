import express from 'express';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LOGO_PATH = path.join(__dirname, '..', 'Jellyforge_AnvilCSS_logo.png');

const SERVER_ID = '11111111-1111-4111-8111-111111111111';
const SERVER_VERSION = '10.11.11';
const SERVER_NAME = 'AnvilCSS Sandbox';
const USER_ID = '22222222-2222-4222-8222-222222222222';

const LIBRARIES = [
  { Id: 'lib-movies', Name: 'Filme', CollectionType: 'movies' },
  { Id: 'lib-shows', Name: 'Serien', CollectionType: 'tvshows' },
  { Id: 'lib-music', Name: 'Musik', CollectionType: 'music' }
];

function fakeItem(id, name, type, parentId, opts = {}) {
  return {
    Id: id,
    Name: name,
    ServerId: SERVER_ID,
    Type: type,
    ParentId: parentId,
    ProductionYear: opts.year ?? null,
    CommunityRating: opts.rating ?? null,
    Overview: opts.overview ?? '',
    ImageTags: { Primary: `${id}-tag` },
    BackdropImageTags: [`${id}-backdrop`],
    UserData: { Played: false, IsFavorite: opts.favorite ?? false, PlaybackPositionTicks: 0 }
  };
}

const ITEMS = [
  fakeItem('mov-inception', 'Inception', 'Movie', 'lib-movies', {
    year: 2010,
    rating: 8.8,
    favorite: true,
    overview: 'A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into the mind of a CEO.'
  }),
  fakeItem('mov-interstellar', 'Interstellar', 'Movie', 'lib-movies', {
    year: 2014,
    rating: 8.7,
    favorite: true,
    overview: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity’s survival.'
  }),
  fakeItem('mov-gladiator', 'Gladiator', 'Movie', 'lib-movies', {
    year: 2000,
    rating: 8.5,
    favorite: false,
    overview: 'A former Roman General sets out to exact vengeance against the corrupt emperor who murdered his family and sent him into slavery.'
  }),
  fakeItem('mov-dark-knight', 'The Dark Knight', 'Movie', 'lib-movies', {
    year: 2008,
    rating: 9.0,
    favorite: true,
    overview: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological tests of his ability to fight injustice.'
  }),
  fakeItem('mov-shawshank', 'The Shawshank Redemption', 'Movie', 'lib-movies', {
    year: 1994,
    rating: 9.3,
    favorite: false,
    overview: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.'
  }),
  fakeItem('mov-pulp-fiction', 'Pulp Fiction', 'Movie', 'lib-movies', {
    year: 1994,
    rating: 8.9,
    favorite: false,
    overview: 'The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence and redemption.'
  }),
  fakeItem('mov-fight-club', 'Fight Club', 'Movie', 'lib-movies', {
    year: 1999,
    rating: 8.8,
    favorite: false,
    overview: 'An insomniac office worker and a devil-may-care soap maker form an underground fight club that evolves into much more.'
  }),
  fakeItem('mov-matrix', 'The Matrix', 'Movie', 'lib-movies', {
    year: 1999,
    rating: 8.7,
    favorite: false,
    overview: 'A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.'
  }),
  fakeItem('show-breaking-bad', 'Breaking Bad', 'Series', 'lib-shows', {
    year: 2008,
    rating: 9.5,
    favorite: true,
    overview: 'A chemistry teacher diagnosed with terminal cancer teams up with a former student to secure his family’s future by manufacturing crystal meth.'
  }),
  fakeItem('show-stranger-things', 'Stranger Things', 'Series', 'lib-shows', {
    year: 2016,
    rating: 8.7,
    favorite: true,
    overview: 'When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces and one strange little girl.'
  }),
  fakeItem('show-game-of-thrones', 'Game of Thrones', 'Series', 'lib-shows', {
    year: 2011,
    rating: 9.2,
    favorite: false,
    overview: 'Nine noble families fight for control over the lands of Westeros, while an ancient enemy returns after being dormant for millennia.'
  }),
  fakeItem('album-1', 'Glass Horizons', 'MusicAlbum', 'lib-music'),
  fakeItem('album-2', 'Low Tide Radio', 'MusicAlbum', 'lib-music')
];

const NEXT_UP_EPISODES = [
  fakeItem('show-breaking-bad-next', 'Breaking Bad – Ozymandias', 'Episode', 'show-breaking-bad'),
  fakeItem('show-stranger-things-next', 'Stranger Things – Chapter Nine', 'Episode', 'show-stranger-things')
];

const MOCKED_API_PREFIXES = [
  '/Users/*',
  '/System/*',
  '/Branding/*',
  '/Startup/*',
  '/Localization/*',
  '/DisplayPreferences/*',
  '/Sessions*',
  '/Playback/*',
  '/Shows/*',
  '/QuickConnect/*',
  '/ScheduledTasks/*',
  '/Plugins/*',
  '/Devices/*',
  '/Channels/*',
  '/Collections/*',
  '/LiveTv/*',
  '/Social/*',
  '/Genres',
  '/Persons',
  '/Artists'
];

const CULTURES = [
  { Name: 'German', DisplayName: 'Deutsch', TwoLetterISOLanguageName: 'de', ThreeLetterISOLanguageName: 'deu' },
  { Name: 'English', DisplayName: 'English', TwoLetterISOLanguageName: 'en', ThreeLetterISOLanguageName: 'eng' },
  { Name: 'Spanish', DisplayName: 'Español', TwoLetterISOLanguageName: 'es', ThreeLetterISOLanguageName: 'spa' }
];

const COUNTRIES = [
  { Name: 'DE', DisplayName: 'Germany', TwoLetterISORegionName: 'DE' },
  { Name: 'US', DisplayName: 'United States', TwoLetterISORegionName: 'US' },
  { Name: 'ES', DisplayName: 'Spain', TwoLetterISORegionName: 'ES' }
];

function placeholderImageRedirect(res, id) {
  res.redirect(302, `https://picsum.photos/seed/${encodeURIComponent(id)}/400/600`);
}

function systemInfoPayload() {
  return {
    Id: SERVER_ID,
    ServerName: SERVER_NAME,
    Version: SERVER_VERSION,
    ProductName: 'Jellyfin Server',
    OperatingSystem: 'Linux',
    OperatingSystemDisplayName: 'Linux',
    LocalAddress: 'http://localhost:8283',
    WanAddress: null,
    HasPendingRestart: false,
    HasUpdateAvailable: false,
    IsShuttingDown: false,
    SupportsLibraryMonitor: false,
    StartupWizardCompleted: true,
    CanSelfRestart: false,
    CanLaunchWebBrowser: false,
    SystemUpdateLevel: 'Release'
  };
}

function buildUserObject() {
  const now = new Date().toISOString();
  return {
    Name: 'AnvilCSS',
    ServerId: SERVER_ID,
    Id: USER_ID,
    HasPassword: true,
    HasConfiguredPassword: true,
    HasConfiguredEasyPassword: false,
    EnableAutoLogin: false,
    LastLoginDate: now,
    LastActivityDate: now,
    PrimaryImageTag: 'anvilcss-user-avatar',
    Configuration: {
      AudioLanguagePreference: '',
      PlayDefaultAudioTrack: true,
      SubtitleLanguagePreference: '',
      DisplayMissingEpisodes: false,
      GroupedFolders: [],
      SubtitleMode: 'Default',
      DisplayCollectionsView: false,
      EnableLocalPassword: false,
      OrderedViews: [],
      LatestItemsExcludes: [],
      MyMediaExcludes: [],
      HidePlayedInLatest: true,
      RememberAudioSelections: true,
      RememberSubtitleSelections: true,
      EnableNextEpisodeAutoPlay: true
    },
    Policy: {
      IsAdministrator: true,
      IsHidden: false,
      IsDisabled: false,
      EnableRemoteControlOfOtherUsers: true,
      EnableSharedDeviceControl: true,
      EnableRemoteAccess: true,
      EnableLiveTvManagement: true,
      EnableLiveTvAccess: true,
      EnableMediaPlayback: true,
      EnableAudioPlaybackTranscoding: true,
      EnableVideoPlaybackTranscoding: true,
      EnablePlaybackRemuxing: true,
      EnableContentDeletion: true,
      EnableContentDownloading: true,
      EnableSyncTranscoding: true,
      EnableMediaConversion: true,
      EnableAllChannels: true,
      EnableAllFolders: true,
      EnablePublicSharing: true,
      InvalidLoginAttemptCount: 0,
      LoginAttemptsBeforeLockout: -1,
      MaxActiveSessions: 0,
      AuthenticationProviderId: 'Default',
      PasswordResetProviderId: 'Default'
    }
  };
}

function loadSessions(sessionsFile) {
  try {
    return JSON.parse(fs.readFileSync(sessionsFile, 'utf8'));
  } catch {
    return {};
  }
}

function saveSessions(sessionsFile, sessions) {
  fs.writeFileSync(sessionsFile, JSON.stringify(sessions));
}

// Jellyfin sends the access token either as `Authorization: MediaBrowser ..., Token="xxx"`
// (or the legacy `X-Emby-Authorization` header) or as the plain `X-Emby-Token` header.
function extractToken(req) {
  const authHeader = req.get('X-Emby-Authorization') || req.get('Authorization') || '';
  const match = authHeader.match(/Token="([^"]+)"/i);
  if (match) return match[1];
  return req.get('X-Emby-Token') || null;
}

/**
 * In-memory mock of just enough of Jellyfin's REST API for the real jellyfin-web frontend to
 * boot, log in, and render a populated dashboard — no real Jellyfin server involved. This is a
 * CSS theme-preview tool, not a working media server: unmocked endpoints fall through to a
 * generic empty-but-valid-shape catch-all rather than 404ing, so a single missed call can't crash
 * the bootstrap, but features like real search/playback/detail pages get no-op data.
 *
 * Access tokens are generated per login and persisted to `<dataDir>/mock-sessions.json` so a
 * browser that is already logged in stays logged in across a page reload or container restart —
 * it re-validates its stored token against GET /Users/Me instead of re-showing the login form.
 */
export function mockJellyfinRouter(dataDir) {
  const sessionsFile = path.join(dataDir, 'mock-sessions.json');
  const sessions = loadSessions(sessionsFile);

  const router = express.Router();
  router.use(express.json());

  router.post('/Users/AuthenticateByName', (req, res) => {
    const { Username, Pw } = req.body || {};
    if (Username !== 'AnvilCSS' || Pw !== 'JellyfinTheme') {
      return res.status(401).end();
    }

    const token = crypto.randomUUID();
    sessions[token] = { userId: USER_ID, createdAt: Date.now() };
    saveSessions(sessionsFile, sessions);

    res.json({
      User: buildUserObject(),
      SessionInfo: {
        Id: crypto.randomUUID(),
        UserId: USER_ID,
        UserName: 'AnvilCSS',
        Client: 'Jellyfin Web',
        DeviceName: 'AnvilCSS Preview',
        DeviceId: 'anvilcss-preview-device',
        ApplicationVersion: SERVER_VERSION,
        ServerId: SERVER_ID,
        SupportsRemoteControl: false,
        PlayableMediaTypes: [],
        AdditionalUsers: []
      },
      AccessToken: token,
      ServerId: SERVER_ID
    });
  });

  // Ends the current session so a subsequent AuthenticateByName call isn't rejected by a stale
  // token still resolving via /Users/Me — clears both the in-memory map and the persisted file.
  router.post(['/Sessions/Logout', '/Session/Logout'], (req, res) => {
    const token = extractToken(req);
    if (token && sessions[token]) {
      delete sessions[token];
      saveSessions(sessionsFile, sessions);
    }
    res.status(200).end();
  });

  router.get('/System/Info', (_req, res) => res.json(systemInfoPayload()));
  router.get('/System/Info/Public', (_req, res) => res.json(systemInfoPayload()));
  router.get('/System/Ping', (_req, res) => res.type('text/plain').send('Jellyfin Server'));

  // jellyfin-web fetches these before the login form is even interactive — missing or
  // malformed responses here abort the boot with a "connection error" before AuthenticateByName
  // is ever called.
  router.get('/Branding/Configuration', (_req, res) => {
    res.json({ LoginDisclaimer: '', CustomCss: '', SplashscreenEnabled: false });
  });

  router.get('/Startup/Configuration', (_req, res) => {
    res.json({ SkippedFirstWizard: true, FirstWizardComplete: true });
  });

  router.get('/Localization/Cultures', (_req, res) => res.json(CULTURES));
  router.get('/Localization/Countries', (_req, res) => res.json(COUNTRIES));

  // Session rehydration on reload: jellyfin-web re-validates its stored token by calling this
  // (as GET /Users/Me or GET /Users/<id>) before deciding whether to show the login form. Only
  // the known user id is matched here (not a generic `/Users/:id` wildcard) so unrelated
  // single-segment calls like `/Users/Public` still fall through to the open catch-all below.
  router.get(['/Users/Me', `/Users/${USER_ID}`], (req, res) => {
    const token = extractToken(req);
    if (!token || !sessions[token]) {
      return res.status(401).end();
    }
    res.json(buildUserObject());
  });

  router.get('/Users/:id/Views', (_req, res) => {
    const items = LIBRARIES.map((lib) => ({
      Id: lib.Id,
      Name: lib.Name,
      ServerId: SERVER_ID,
      Type: 'CollectionFolder',
      CollectionType: lib.CollectionType,
      ImageTags: { Primary: `${lib.Id}-tag` }
    }));
    res.json({ Items: items, TotalRecordCount: items.length, StartIndex: 0 });
  });

  router.get('/Users/:id/Items/Latest', (req, res) => {
    const parentId = req.query.ParentId;
    const pool = parentId ? ITEMS.filter((item) => item.ParentId === parentId) : ITEMS;
    res.json(pool.slice(0, 8));
  });
  router.get('/Items/Latest', (req, res) => {
    const parentId = req.query.ParentId;
    const pool = parentId ? ITEMS.filter((item) => item.ParentId === parentId) : ITEMS;
    res.json(pool.slice(0, 8));
  });

  router.get('/Users/:id/Items', (req, res) => {
    const parentId = req.query.ParentId;
    let pool = parentId ? ITEMS.filter((item) => item.ParentId === parentId) : ITEMS;
    const filters = req.query.Filters || '';
    if (filters.includes('IsFavorite')) {
      pool = pool.filter((item) => item.UserData.IsFavorite);
    }
    res.json({ Items: pool, TotalRecordCount: pool.length, StartIndex: 0 });
  });

  router.get('/Shows/NextUp', (_req, res) => {
    res.json({ Items: NEXT_UP_EPISODES, TotalRecordCount: NEXT_UP_EPISODES.length, StartIndex: 0 });
  });

  router.get('/DisplayPreferences/:id', (req, res) => {
    res.json({
      Id: req.params.id,
      ViewType: 'movies',
      SortBy: 'SortName',
      IndexBy: null,
      RememberIndexing: false,
      PrimaryImageHeight: 250,
      PrimaryImageWidth: 250,
      CustomPrefs: {},
      ScrollDirection: 'Horizontal',
      ShowBackdrop: true,
      RememberSorting: false,
      SortOrder: 'Ascending',
      ShowSidebar: false,
      Client: req.query.client || 'emby'
    });
  });

  router.get('/Items/:id/Images/:type', (req, res) => placeholderImageRedirect(res, req.params.id));
  router.get('/Items/:id/Images/:type/:index', (req, res) => placeholderImageRedirect(res, req.params.id));

  // The user's own avatar is branded — serve the real AnvilCSS logo instead of a Picsum stand-in.
  router.get('/Users/:id/Images/:type', (req, res) => {
    if (req.params.type === 'Primary') {
      return res.type('image/png').sendFile(LOGO_PATH);
    }
    placeholderImageRedirect(res, `user-${req.params.id}`);
  });
  router.get('/Users/:id/Images/:type/:index', (req, res) => {
    if (req.params.type === 'Primary') {
      return res.type('image/png').sendFile(LOGO_PATH);
    }
    placeholderImageRedirect(res, `user-${req.params.id}`);
  });

  router.get(MOCKED_API_PREFIXES, (req, res) => {
    const lastSegment = req.path.split('/').pop() || '';
    const looksLikeList = lastSegment.endsWith('s') || req.path.includes('Items');
    res.status(200).json(looksLikeList ? [] : {});
  });
  router.all(MOCKED_API_PREFIXES, (_req, res) => res.status(204).end());

  return router;
}
