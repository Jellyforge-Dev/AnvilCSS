import express from 'express';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const SERVER_ID = '11111111-1111-4111-8111-111111111111';
const SERVER_VERSION = '10.10.7';
const SERVER_NAME = 'AnvilCSS Preview Server';
const USER_ID = '22222222-2222-4222-8222-222222222222';

const LIBRARIES = [
  { Id: 'lib-movies', Name: 'Filme', CollectionType: 'movies' },
  { Id: 'lib-shows', Name: 'Serien', CollectionType: 'tvshows' },
  { Id: 'lib-music', Name: 'Musik', CollectionType: 'music' }
];

function fakeItem(id, name, type, parentId) {
  return {
    Id: id,
    Name: name,
    ServerId: SERVER_ID,
    Type: type,
    ParentId: parentId,
    ImageTags: { Primary: `${id}-tag` },
    BackdropImageTags: [`${id}-backdrop`],
    UserData: { Played: false, IsFavorite: false, PlaybackPositionTicks: 0 }
  };
}

const ITEMS = [
  fakeItem('mov-1', 'Aurora Drift', 'Movie', 'lib-movies'),
  fakeItem('mov-2', 'Silent Ember', 'Movie', 'lib-movies'),
  fakeItem('mov-3', 'The Long Static', 'Movie', 'lib-movies'),
  fakeItem('show-1', 'Nightframe', 'Series', 'lib-shows'),
  fakeItem('show-2', 'Copper Sky', 'Series', 'lib-shows'),
  fakeItem('album-1', 'Glass Horizons', 'MusicAlbum', 'lib-music'),
  fakeItem('album-2', 'Low Tide Radio', 'MusicAlbum', 'lib-music')
];

const NEXT_UP_EPISODES = [
  fakeItem('show-1-next', 'Nightframe – Signal Loss', 'Episode', 'show-1'),
  fakeItem('show-2-next', 'Copper Sky – Rust Season', 'Episode', 'show-2')
];

const MOCKED_API_PREFIXES = [
  '/Users/*',
  '/System/*',
  '/Branding/*',
  '/DisplayPreferences/*',
  '/Sessions*',
  '/Playback/*',
  '/Shows/*',
  '/Genres',
  '/Persons',
  '/Artists'
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

  router.get('/System/Info', (_req, res) => res.json(systemInfoPayload()));
  router.get('/System/Info/Public', (_req, res) => res.json(systemInfoPayload()));
  router.get('/System/Ping', (_req, res) => res.type('text/plain').send('Jellyfin Server'));

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
    const pool = parentId ? ITEMS.filter((item) => item.ParentId === parentId) : ITEMS;
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
  router.get('/Users/:id/Images/:type', (req, res) => placeholderImageRedirect(res, `user-${req.params.id}`));
  router.get('/Users/:id/Images/:type/:index', (req, res) => placeholderImageRedirect(res, `user-${req.params.id}`));

  router.get(MOCKED_API_PREFIXES, (req, res) => {
    const lastSegment = req.path.split('/').pop() || '';
    const looksLikeList = lastSegment.endsWith('s') || req.path.includes('Items');
    res.status(200).json(looksLikeList ? [] : {});
  });
  router.all(MOCKED_API_PREFIXES, (_req, res) => res.status(204).end());

  return router;
}
