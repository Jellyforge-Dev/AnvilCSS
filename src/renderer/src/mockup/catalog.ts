export type MockItemType = 'Movie' | 'Series';

export interface MockItem {
  id: string;
  name: string;
  type: MockItemType;
  year: number;
  rating: number;
  imdbId: string;
  tmdbId: string;
  genres: string[];
  overview: string;
  runtimeMinutes?: number;
  childCount?: number;
  unplayedCount?: number;
  favorite: boolean;
  /** Resume progress in percent (0 disables the progress bar), only set on a couple of items. */
  progress?: number;
}

// Real TMDB poster/backdrop file paths, verified against https://www.themoviedb.org/{movie,tv}/<tmdbId>
// on 2026-07-07 by matching title + year — carried over from the earlier mock-server catalog.
const POSTER_FILES: Record<string, string> = {
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

export function posterUrl(id: string): string {
  const file = POSTER_FILES[id];
  return file ? `https://image.tmdb.org/t/p/w500/${file}` : '';
}

export function backdropUrl(id: string): string {
  const file = POSTER_FILES[id];
  return file ? `https://image.tmdb.org/t/p/w1280/${file}` : '';
}

export const MOVIES: MockItem[] = [
  {
    id: 'mov-inception',
    name: 'Inception',
    type: 'Movie',
    year: 2010,
    rating: 8.8,
    imdbId: 'tt1375666',
    tmdbId: '27205',
    genres: ['Action', 'Sci-Fi', 'Thriller'],
    runtimeMinutes: 148,
    favorite: true,
    progress: 62,
    overview:
      'A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into the mind of a CEO.'
  },
  {
    id: 'mov-interstellar',
    name: 'Interstellar',
    type: 'Movie',
    year: 2014,
    rating: 8.7,
    imdbId: 'tt0816692',
    tmdbId: '157336',
    genres: ['Adventure', 'Drama', 'Sci-Fi'],
    runtimeMinutes: 169,
    favorite: true,
    overview: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity’s survival.'
  },
  {
    id: 'mov-dark-knight',
    name: 'The Dark Knight',
    type: 'Movie',
    year: 2008,
    rating: 9.0,
    imdbId: 'tt0468569',
    tmdbId: '155',
    genres: ['Action', 'Crime', 'Drama'],
    runtimeMinutes: 152,
    favorite: true,
    progress: 24,
    overview:
      'When the menace known as the Joker wreaks havoc on the people of Gotham, Batman must accept one of the greatest psychological tests of his ability to fight injustice.'
  },
  {
    id: 'mov-jackass',
    name: 'Jackass',
    type: 'Movie',
    year: 2002,
    rating: 6.7,
    imdbId: 'tt0264263',
    tmdbId: '9012',
    genres: ['Comedy', 'Documentary'],
    runtimeMinutes: 87,
    favorite: false,
    overview: 'Johnny Knoxville and his crew perform a series of dangerous, crude, and outrageous stunts and pranks.'
  },
  {
    id: 'mov-fight-club',
    name: 'Fight Club',
    type: 'Movie',
    year: 1999,
    rating: 8.8,
    imdbId: 'tt0137523',
    tmdbId: '550',
    genres: ['Drama'],
    runtimeMinutes: 139,
    favorite: false,
    overview: 'An insomniac office worker and a devil-may-care soap maker form an underground fight club that evolves into much more.'
  },
  {
    id: 'mov-john-wick',
    name: 'John Wick',
    type: 'Movie',
    year: 2014,
    rating: 7.4,
    imdbId: 'tt2911666',
    tmdbId: '245891',
    genres: ['Action', 'Crime', 'Thriller'],
    runtimeMinutes: 101,
    favorite: true,
    overview: 'An ex-hitman comes out of retirement to track down the gangsters that killed his dog and took everything from him.'
  },
  {
    id: 'mov-pineapple-express',
    name: 'Pineapple Express',
    type: 'Movie',
    year: 2008,
    rating: 7.0,
    imdbId: 'tt0910936',
    tmdbId: '10189',
    genres: ['Action', 'Comedy', 'Crime'],
    runtimeMinutes: 111,
    favorite: false,
    overview: 'A process server and his marijuana dealer are forced to go on the run after they witness a corrupt cop commit murder.'
  }
];

export const SHOWS: MockItem[] = [
  {
    id: 'show-breaking-bad',
    name: 'Breaking Bad',
    type: 'Series',
    year: 2008,
    rating: 9.5,
    imdbId: 'tt0903747',
    tmdbId: '1396',
    genres: ['Crime', 'Drama', 'Thriller'],
    childCount: 62,
    unplayedCount: 62,
    favorite: true,
    overview:
      'A chemistry teacher diagnosed with terminal cancer teams up with a former student to secure his family’s future by manufacturing crystal meth.'
  },
  {
    id: 'show-stranger-things',
    name: 'Stranger Things',
    type: 'Series',
    year: 2016,
    rating: 8.7,
    imdbId: 'tt4574334',
    tmdbId: '66732',
    genres: ['Drama', 'Fantasy', 'Horror'],
    childCount: 34,
    unplayedCount: 9,
    favorite: true,
    progress: 41,
    overview:
      'When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces and one strange little girl.'
  },
  {
    id: 'show-himym',
    name: 'How I Met Your Mother',
    type: 'Series',
    year: 2005,
    rating: 8.3,
    imdbId: 'tt0460649',
    tmdbId: '1100',
    genres: ['Comedy', 'Romance'],
    childCount: 208,
    unplayedCount: 208,
    favorite: false,
    overview:
      'A father recounts to his children, through a series of flashbacks, the journey he and his four best friends took leading up to him meeting their mother.'
  },
  {
    id: 'show-better-call-saul',
    name: 'Better Call Saul',
    type: 'Series',
    year: 2015,
    rating: 8.8,
    imdbId: 'tt3032476',
    tmdbId: '60059',
    genres: ['Crime', 'Drama'],
    childCount: 63,
    unplayedCount: 20,
    favorite: true,
    overview: 'The trials and tribulations of criminal lawyer Jimmy McGill in the years leading up to his transformation into Saul Goodman.'
  },
  {
    id: 'show-band-of-brothers',
    name: 'Band of Brothers',
    type: 'Series',
    year: 2001,
    rating: 9.4,
    imdbId: 'tt0185906',
    tmdbId: '4613',
    genres: ['Drama', 'History', 'War'],
    childCount: 10,
    unplayedCount: 10,
    favorite: false,
    overview: 'The story of Easy Company of the U.S. Army 101st Airborne Division and their mission in World War II Europe.'
  },
  {
    id: 'show-friends',
    name: 'Friends',
    type: 'Series',
    year: 1994,
    rating: 8.9,
    imdbId: 'tt0108778',
    tmdbId: '1668',
    genres: ['Comedy', 'Romance'],
    childCount: 236,
    unplayedCount: 236,
    favorite: false,
    overview: 'Follows the personal and professional lives of six twenty to thirty-something friends living in Manhattan.'
  },
  {
    id: 'show-walking-dead',
    name: 'The Walking Dead',
    type: 'Series',
    year: 2010,
    rating: 8.1,
    imdbId: 'tt1520211',
    tmdbId: '1402',
    genres: ['Drama', 'Horror', 'Thriller'],
    childCount: 177,
    unplayedCount: 50,
    favorite: false,
    overview: 'Sheriff Deputy Rick Grimes wakes up from a coma to find a post-apocalyptic world dominated by flesh-eating zombies.'
  }
];

export const ALL_ITEMS: MockItem[] = [...MOVIES, ...SHOWS];

export const CONTINUE_WATCHING: MockItem[] = ALL_ITEMS.filter((i) => typeof i.progress === 'number');
