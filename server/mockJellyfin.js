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
  { Id: 'library-movies', Name: 'Movies', CollectionType: 'movies' },
  { Id: 'library-shows', Name: 'Shows', CollectionType: 'tvshows' }
];

// jellyfin-web only renders the Play/"Mark Played" card buttons when IsFolder is false and
// UserData is a fully-shaped object — a Series tile stays a folder (its episodes are the
// playable children), everything else (Movie/Episode) is directly playable. Series tiles instead
// get ChildCount + UserData.UnplayedItemCount, which is what drives their own "N unwatched" badge.
function fakeItem(id, name, type, parentId, opts = {}) {
  const isFolder = type === 'Series';
  const isPlayable = type === 'Movie' || type === 'Episode';
  return {
    Id: id,
    Name: name,
    ServerId: SERVER_ID,
    Type: type,
    IsFolder: isFolder,
    ParentId: parentId,
    ProductionYear: opts.year ?? null,
    CommunityRating: opts.rating ?? null,
    Overview: opts.overview ?? '',
    Genres: opts.genres ?? [],
    Studios: (opts.studios ?? []).map((name) => ({ Name: name })),
    RunTimeTicks: opts.runtimeMinutes ? opts.runtimeMinutes * 60 * 10_000_000 : null,
    ProviderIds: {
      ...(opts.imdbId ? { Imdb: opts.imdbId } : {}),
      ...(opts.tmdbId ? { Tmdb: opts.tmdbId } : {})
    },
    MediaType: isPlayable ? 'Video' : undefined,
    LocationType: 'FileSystem',
    ChildCount: type === 'Series' ? opts.childCount ?? 0 : undefined,
    ImageTags: { Primary: `${id}-tag` },
    BackdropImageTags: [`${id}-backdrop`],
    UserData: {
      PlayCount: 0,
      Played: false,
      Key: id,
      IsFavorite: opts.favorite ?? false,
      PlaybackPositionTicks: 0,
      UnplayedItemCount: type === 'Series' ? opts.unplayedCount ?? 0 : undefined
    }
  };
}

const ITEMS = [
  fakeItem('mov-inception', 'Inception', 'Movie', 'library-movies', {
    imdbId: 'tt1375666',
    tmdbId: '27205',
    year: 2010,
    rating: 8.8,
    favorite: true,
    genres: ['Action', 'Sci-Fi', 'Thriller'],
    studios: ['Warner Bros. Pictures'],
    runtimeMinutes: 148,
    overview: 'A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into the mind of a CEO.'
  }),
  fakeItem('mov-interstellar', 'Interstellar', 'Movie', 'library-movies', {
    imdbId: 'tt0816692',
    tmdbId: '157336',
    year: 2014,
    rating: 8.7,
    favorite: true,
    genres: ['Adventure', 'Drama', 'Sci-Fi'],
    studios: ['Paramount Pictures'],
    runtimeMinutes: 169,
    overview: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity’s survival.'
  }),
  fakeItem('mov-dark-knight', 'The Dark Knight', 'Movie', 'library-movies', {
    imdbId: 'tt0468569',
    tmdbId: '155',
    year: 2008,
    rating: 9.0,
    favorite: true,
    genres: ['Action', 'Crime', 'Drama'],
    studios: ['Warner Bros. Pictures'],
    runtimeMinutes: 152,
    overview: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological tests of his ability to fight injustice.'
  }),
  fakeItem('mov-jackass', 'Jackass', 'Movie', 'library-movies', {
    imdbId: 'tt0264263',
    tmdbId: '9012',
    year: 2002,
    rating: 6.7,
    favorite: false,
    genres: ['Comedy', 'Documentary'],
    studios: ['MTV Films', 'Paramount Pictures'],
    runtimeMinutes: 87,
    overview: 'Johnny Knoxville and his crew perform a series of dangerous, crude, and outrageous stunts and pranks.'
  }),
  fakeItem('mov-fight-club', 'Fight Club', 'Movie', 'library-movies', {
    imdbId: 'tt0137523',
    tmdbId: '550',
    year: 1999,
    rating: 8.8,
    favorite: false,
    genres: ['Drama'],
    studios: ['20th Century Fox'],
    runtimeMinutes: 139,
    overview: 'An insomniac office worker and a devil-may-care soap maker form an underground fight club that evolves into much more.'
  }),
  fakeItem('mov-john-wick', 'John Wick', 'Movie', 'library-movies', {
    imdbId: 'tt2911666',
    tmdbId: '245891',
    year: 2014,
    rating: 7.4,
    favorite: true,
    genres: ['Action', 'Crime', 'Thriller'],
    studios: ['Summit Entertainment', 'Thunder Road Pictures'],
    runtimeMinutes: 101,
    overview: 'An ex-hitman comes out of retirement to track down the gangsters that killed his dog and took everything from him.'
  }),
  fakeItem('mov-pineapple-express', 'Pineapple Express', 'Movie', 'library-movies', {
    imdbId: 'tt0910936',
    tmdbId: '10189',
    year: 2008,
    rating: 7.0,
    favorite: false,
    genres: ['Action', 'Comedy', 'Crime'],
    studios: ['Columbia Pictures'],
    runtimeMinutes: 111,
    overview: 'A process server and his marijuana dealer are forced to go on the run after they witness a corrupt cop commit murder.'
  }),
  fakeItem('show-breaking-bad', 'Breaking Bad', 'Series', 'library-shows', {
    imdbId: 'tt0903747',
    tmdbId: '1396',
    year: 2008,
    rating: 9.5,
    favorite: true,
    genres: ['Crime', 'Drama', 'Thriller'],
    studios: ['Sony Pictures Television'],
    childCount: 62,
    unplayedCount: 62,
    overview: 'A chemistry teacher diagnosed with terminal cancer teams up with a former student to secure his family’s future by manufacturing crystal meth.'
  }),
  fakeItem('show-stranger-things', 'Stranger Things', 'Series', 'library-shows', {
    imdbId: 'tt4574334',
    tmdbId: '66732',
    year: 2016,
    rating: 8.7,
    favorite: true,
    genres: ['Drama', 'Fantasy', 'Horror'],
    studios: ['21 Laps Entertainment'],
    childCount: 34,
    unplayedCount: 9,
    overview: 'When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces and one strange little girl.'
  }),
  fakeItem('show-himym', 'How I Met Your Mother', 'Series', 'library-shows', {
    imdbId: 'tt0460649',
    tmdbId: '1100',
    year: 2005,
    rating: 8.3,
    favorite: false,
    genres: ['Comedy', 'Romance'],
    studios: ['20th Century Fox Television'],
    childCount: 208,
    unplayedCount: 208,
    overview: 'A father recounts to his children, through a series of flashbacks, the journey he and his four best friends took leading up to him meeting their mother.'
  }),
  fakeItem('show-better-call-saul', 'Better Call Saul', 'Series', 'library-shows', {
    imdbId: 'tt3032476',
    tmdbId: '60059',
    year: 2015,
    rating: 8.8,
    favorite: true,
    genres: ['Crime', 'Drama'],
    studios: ['Sony Pictures Television'],
    childCount: 63,
    unplayedCount: 20,
    overview: 'The trials and tribulations of criminal lawyer Jimmy McGill in the years leading up to his transformation into Saul Goodman.'
  }),
  fakeItem('show-band-of-brothers', 'Band of Brothers', 'Series', 'library-shows', {
    imdbId: 'tt0185906',
    tmdbId: '4613',
    year: 2001,
    rating: 9.4,
    favorite: false,
    genres: ['Drama', 'History', 'War'],
    studios: ['HBO'],
    childCount: 10,
    unplayedCount: 10,
    overview: 'The story of Easy Company of the U.S. Army 101st Airborne Division and their mission in World War II Europe.'
  }),
  fakeItem('show-friends', 'Friends', 'Series', 'library-shows', {
    imdbId: 'tt0108778',
    tmdbId: '1668',
    year: 1994,
    rating: 8.9,
    favorite: false,
    genres: ['Comedy', 'Romance'],
    studios: ['Warner Bros. Television'],
    childCount: 236,
    unplayedCount: 236,
    overview: 'Follows the personal and professional lives of six twenty to thirty-something friends living in Manhattan.'
  }),
  fakeItem('show-walking-dead', 'The Walking Dead', 'Series', 'library-shows', {
    imdbId: 'tt1520211',
    tmdbId: '1402',
    year: 2010,
    rating: 8.1,
    favorite: false,
    genres: ['Drama', 'Horror', 'Thriller'],
    studios: ['AMC Studios'],
    childCount: 177,
    unplayedCount: 50,
    overview: 'Sheriff Deputy Rick Grimes wakes up from a coma to find a post-apocalyptic world dominated by flesh-eating zombies.'
  })
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

// Real TMDB poster file paths for the 14 fixed catalog items, verified against
// https://www.themoviedb.org/{movie,tv}/<tmdbId> on 2026-07-07 — each entry was cross-checked
// against the page's own title/year to catch stale or wrong tmdbIds (this caught two: Jackass and
// Pineapple Express previously carried unrelated tmdbIds and would have shown wrong posters).
const TMDB_POSTERS = {
  'mov-inception': 't5WUY5ZSxwVIVExaMZmmIj88BKA.jpg',
  'mov-interstellar': 'hHdhfkkzt0Mwec33Ux177Z7CO8w.jpg',
  'mov-dark-knight': 'z1DfRQf2CgnROyhVZ6ch8FbWt71.jpg',
  'mov-jackass': 'fAfqDAX0HE81K30KKtCThJUu5xw.jpg',
  'mov-fight-club': '5sLBZtBzmL9Xd5MdGyqymgM9kPY.jpg',
  'mov-john-wick': 'vr92idbWfEFY0bcapzMk1nZkVXr.jpg',
  'mov-pineapple-express': '7Oqhpf2IEfzCdN1Ph3vrB1A47LA.jpg',
  'show-breaking-bad': 'ztkUQFLlC19CCMYHW9o1zWhJRNq.jpg',
  'show-stranger-things': 'uOOtwVbSr4QDjAGIifLDwpb2Pdl.jpg',
  'show-himym': 'b34jPzmB0wZy7EjUZoleXOl2RRI.jpg',
  'show-better-call-saul': 'zjg4jpK1Wp2kiRvtt5ND0kznako.jpg',
  'show-band-of-brothers': 'iHdVtbWgigHY3leQnZgLBBTqNTL.jpg',
  'show-friends': '2koX1xLkpTQM4IZebYvKysFW1Nh.jpg',
  'show-walking-dead': '7J5sJONPZuyNH9SuLYi4XvVUujk.jpg'
};

function placeholderImageRedirect(res, id) {
  res.redirect(302, `https://picsum.photos/seed/${encodeURIComponent(id)}/400/600`);
}

// Primary images for the 14 known catalog items get the real TMDB poster; everything else
// (backdrops, unknown ids, next-up episodes) keeps the deterministic Picsum fallback.
function itemImageRedirect(res, id, imageType) {
  const posterFile = imageType === 'Primary' ? TMDB_POSTERS[id] : undefined;
  if (posterFile) {
    return res.redirect(302, `https://image.tmdb.org/t/p/w500/${posterFile}`);
  }
  placeholderImageRedirect(res, id);
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

  router.get(['/Users/:id/Views', '/UserViews'], (_req, res) => {
    const items = LIBRARIES.map((lib) => ({
      Id: lib.Id,
      Name: lib.Name,
      ServerId: SERVER_ID,
      Type: 'CollectionFolder',
      CollectionType: lib.CollectionType,
      IsFolder: true,
      ImageTags: { Primary: `${lib.Id}-tag` }
    }));
    res.json({ Items: items, TotalRecordCount: items.length, StartIndex: 0 });
  });

  // ParentId and IncludeItemTypes are both honored (and combined with AND) so a request for
  // one library's content can never leak items of the other type, regardless of which filter
  // jellyfin-web happens to send for a given view.
  function filterItems(query) {
    let pool = ITEMS;
    if (query.ParentId) {
      pool = pool.filter((item) => item.ParentId === query.ParentId);
    }
    if (query.IncludeItemTypes) {
      const types = String(query.IncludeItemTypes).split(',');
      pool = pool.filter((item) => types.includes(item.Type));
    }
    return pool;
  }

  router.get('/Users/:id/Items/Latest', (req, res) => {
    res.json(filterItems(req.query).slice(0, 8));
  });
  router.get('/Items/Latest', (req, res) => {
    res.json(filterItems(req.query).slice(0, 8));
  });

  router.get('/Users/:id/Items', (req, res) => {
    let pool = filterItems(req.query);
    const filters = req.query.Filters || '';
    if (filters.includes('IsFavorite')) {
      pool = pool.filter((item) => item.UserData.IsFavorite);
    }
    res.json({ Items: pool, TotalRecordCount: pool.length, StartIndex: 0 });
  });

  // Detail page: clicking a tile fetches the full BaseItemDto for that specific id — same shape
  // as the list entries (Jellyfin reuses one DTO for both contexts), just looked up individually.
  router.get(['/Items/:id', '/Users/:userId/Items/:id'], (req, res) => {
    const item = ITEMS.find((i) => i.Id === req.params.id) || NEXT_UP_EPISODES.find((i) => i.Id === req.params.id);
    if (!item) return res.status(404).end();
    res.json(item);
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

  router.get('/Items/:id/Images/:type', (req, res) => itemImageRedirect(res, req.params.id, req.params.type));
  router.get('/Items/:id/Images/:type/:index', (req, res) => itemImageRedirect(res, req.params.id, req.params.type));

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
