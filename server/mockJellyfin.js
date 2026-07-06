import express from 'express';
import crypto from 'node:crypto';

const SERVER_ID = '11111111-1111-4111-8111-111111111111';
const SERVER_VERSION = '10.10.7';
const SERVER_NAME = 'AnvilCSS Preview Server';
const FIXED_ACCESS_TOKEN = 'anvilcss-mock-token';
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

/**
 * In-memory mock of just enough of Jellyfin's REST API for the real jellyfin-web frontend to
 * boot, log in, and render a populated dashboard — no real Jellyfin server involved. This is a
 * CSS theme-preview tool, not a working media server: unmocked endpoints fall through to a
 * generic empty-but-valid-shape catch-all rather than 404ing, so a single missed call can't crash
 * the bootstrap, but features like real search/playback/detail pages get no-op data.
 */
export function mockJellyfinRouter() {
  const router = express.Router();
  router.use(express.json());

  router.post('/Users/AuthenticateByName', (req, res) => {
    const { Username, Pw } = req.body || {};
    if (Username !== 'AnvilCSS' || Pw !== 'JellyfinTheme') {
      return res.status(401).end();
    }

    const now = new Date().toISOString();
    res.json({
      User: {
        Name: 'AnvilCSS',
        ServerId: SERVER_ID,
        Id: USER_ID,
        HasPassword: true,
        HasConfiguredPassword: true,
        HasConfiguredEasyPassword: false,
        EnableAutoLogin: false,
        LastLoginDate: now,
        LastActivityDate: now,
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
      },
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
      AccessToken: FIXED_ACCESS_TOKEN,
      ServerId: SERVER_ID
    });
  });

  router.get('/System/Info', (_req, res) => res.json(systemInfoPayload()));
  router.get('/System/Info/Public', (_req, res) => res.json(systemInfoPayload()));
  router.get('/System/Ping', (_req, res) => res.type('text/plain').send('Jellyfin Server'));

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

  router.get('/Users/:id/Items', (req, res) => {
    const parentId = req.query.ParentId;
    const pool = parentId ? ITEMS.filter((item) => item.ParentId === parentId) : ITEMS;
    res.json({ Items: pool, TotalRecordCount: pool.length, StartIndex: 0 });
  });

  router.get('/Items/:id/Images/:type', (req, res) => placeholderImageRedirect(res, req.params.id));
  router.get('/Items/:id/Images/:type/:index', (req, res) => placeholderImageRedirect(res, req.params.id));

  router.get(MOCKED_API_PREFIXES, (req, res) => {
    const lastSegment = req.path.split('/').pop() || '';
    const looksLikeList = lastSegment.endsWith('s') || req.path.includes('Items');
    res.status(200).json(looksLikeList ? [] : {});
  });
  router.all(MOCKED_API_PREFIXES, (_req, res) => res.status(204).end());

  return router;
}
