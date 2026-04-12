import { AnimeFromApi } from '../types/anime';

const VALID_TYPES = ['tv', 'movie', 'ona', 'ova', 'special', 'music'] as const;
export type AnimeType = typeof VALID_TYPES[number];

export interface Genre {
  mal_id: number;
  name: string;
}

function isValidType(type: string): type is AnimeType {
  return VALID_TYPES.includes(type as AnimeType);
}

const BASE_URL = 'https://api.jikan.moe/v4';
const MIN_REQUEST_DELAY = 400; // bump from 350 for headroom

export interface SearchError {
  type: 'network' | 'rate_limit' | 'timeout' | 'invalid' | 'unknown';
  message: string;
}

export interface PaginationInfo {
  current_page: number;
  last_visible_page: number;
  has_next_page: boolean;
  has_prev_page: boolean;
}

let lastRequestTime = 0;
let rateLimitChain: Promise<void> = Promise.resolve();

function respectRateLimit(): Promise<void> {
  const next = rateLimitChain.then(async () => {
    const wait = MIN_REQUEST_DELAY - (Date.now() - lastRequestTime);
    if (wait > 0) {
      await new Promise(resolve => setTimeout(resolve, wait));
    }
    lastRequestTime = Date.now();
  });
  // Swallow rejections so one failure does not break the chain
  rateLimitChain = next.catch(() => {});
  return next;
}

let rateLimitCooldownUntil = 0;

function createError(type: SearchError['type'], message: string): SearchError {
  return { type, message };
}

export const ERROR_MESSAGES = {
  network: 'Unable to connect. Check your internet connection.',
  rate_limit: 'Too many requests. Please wait a moment.',
  timeout: 'Search timed out. Please try again.',
  invalid: 'Received invalid data from server.',
  unknown: 'Something went wrong. Please try again.'
} as const;

type JikanResult = { results: AnimeFromApi[]; pagination: PaginationInfo; error: SearchError | null };

const EMPTY_PAGINATION: PaginationInfo = {
  current_page: 1, last_visible_page: 1, has_next_page: false, has_prev_page: false
};

async function fetchJikan(url: string, externalSignal?: AbortSignal): Promise<JikanResult> {
  // Honour active cooldown from a previous 429
  const cooldownWait = rateLimitCooldownUntil - Date.now();
  if (cooldownWait > 0) {
    await new Promise(resolve => setTimeout(resolve, cooldownWait));
  }

  await respectRateLimit();

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);
  externalSignal?.addEventListener('abort', () => controller.abort(), { once: true });

  try {
    let response = await fetch(url, { signal: controller.signal });

    // 429 → wait 2 s and retry once
    if (response.status === 429) {
      clearTimeout(timeoutId);
      rateLimitCooldownUntil = Date.now() + 2000;
      await new Promise(resolve => setTimeout(resolve, 2000));
      await respectRateLimit();
      const retryTimeout = setTimeout(() => controller.abort(), 10000);
      response = await fetch(url, { signal: controller.signal });
      clearTimeout(retryTimeout);
    } else {
      clearTimeout(timeoutId);
    }

    if (response.status === 429) {
      return { results: [], pagination: EMPTY_PAGINATION, error: createError('rate_limit', ERROR_MESSAGES.rate_limit) };
    }
    if (!response.ok) {
      console.error('API error:', response.status);
      return { results: [], pagination: EMPTY_PAGINATION, error: createError('network', ERROR_MESSAGES.network) };
    }

    const data = await response.json();
    if (!data.data || !Array.isArray(data.data)) {
      return { results: [], pagination: EMPTY_PAGINATION, error: createError('invalid', ERROR_MESSAGES.invalid) };
    }

    const currentPage = data.pagination?.current_page ?? 1;
    const pagination: PaginationInfo = {
      current_page: currentPage,
      last_visible_page: data.pagination?.last_visible_page ?? 1,
      has_next_page: data.pagination?.has_next_page ?? false,
      has_prev_page: currentPage > 1,
    };
    return { results: data.data, pagination, error: null };
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        return { results: [], pagination: EMPTY_PAGINATION, error: createError('timeout', ERROR_MESSAGES.timeout) };
      }
      return { results: [], pagination: EMPTY_PAGINATION, error: createError('network', ERROR_MESSAGES.network) };
    }
    return { results: [], pagination: EMPTY_PAGINATION, error: createError('unknown', ERROR_MESSAGES.unknown) };
  }
}

export async function getTopAnime(page = 1, limit = 20, type?: string, genre?: string, signal?: AbortSignal) {
  let url = `${BASE_URL}/top/anime?page=${page}&limit=${limit}&sfw`;
  if (type && isValidType(type)) url += `&type=${type}`;
  if (genre) url += `&genres=${genre}`;
  return fetchJikan(url, signal);
}

export async function searchAnime(query: string, page = 1, limit = 20, type?: string, genre?: string, signal?: AbortSignal) {
  if (!query.trim()) return { results: [], pagination: EMPTY_PAGINATION, error: null };
  const encodedQuery = encodeURIComponent(query);
  let url = `${BASE_URL}/anime?q=${encodedQuery}&page=${page}&limit=${limit}&sfw`;
  if (type && isValidType(type)) url += `&type=${type}`;
  if (genre) url += `&genres=${genre}`;
  return fetchJikan(url, signal);
}

// Get currently airing anime (Latest view)
export async function getLatestAnime(page = 1, limit = 20, type?: string, genre?: string, signal?: AbortSignal) {
  let url = `${BASE_URL}/anime?status=airing&order_by=start_date&sort=desc&page=${page}&limit=${limit}&sfw`;
  if (type && isValidType(type)) url += `&type=${type}`;
  if (genre) url += `&genres=${genre}`;
  return fetchJikan(url, signal);
}

// Get seasonal anime (current season)
export async function getSeasonalAnime(page = 1, limit = 20, type?: string, genre?: string, signal?: AbortSignal) {
  let url = `${BASE_URL}/seasons/now?page=${page}&limit=${limit}&sfw`;
  if (type && isValidType(type)) url += `&type=${type}`;
  if (genre) url += `&genres=${genre}`;
  return fetchJikan(url, signal);
}

// Cache the in-flight promise so concurrent callers share one request
let genresCachePromise: Promise<Genre[]> | null = null;

// Fallback genres list in case API fails
const FALLBACK_GENRES: Genre[] = [
  { mal_id: 1, name: 'Action' },
  { mal_id: 2, name: 'Adventure' },
  { mal_id: 4, name: 'Comedy' },
  { mal_id: 8, name: 'Drama' },
  { mal_id: 10, name: 'Fantasy' },
  { mal_id: 22, name: 'Romance' },
  { mal_id: 24, name: 'Sci-Fi' },
  { mal_id: 7, name: 'Mystery' },
  { mal_id: 30, name: 'Sports' },
  { mal_id: 37, name: 'Supernatural' },
  { mal_id: 36, name: 'Slice of Life' },
  { mal_id: 9, name: 'Ecchi' },
  { mal_id: 15, name: 'Kids' },
  { mal_id: 18, name: 'Mecha' },
  { mal_id: 21, name: 'Music' },
  { mal_id: 23, name: 'School' },
  { mal_id: 25, name: 'Thriller' },
  { mal_id: 41, name: 'Suspense' },
  { mal_id: 29, name: 'Horror' },
  { mal_id: 3, name: 'Award Winning' },
  { mal_id: 38, name: 'Strategy Game' },
  { mal_id: 13, name: 'Historical' },
  { mal_id: 40, name: 'Psychological' },
  { mal_id: 35, name: 'Shoujo' },
  { mal_id: 27, name: 'Shounen' },
  { mal_id: 28, name: 'Space' },
  { mal_id: 33, name: 'Gourmet' },
  { mal_id: 32, name: 'Girls Love' },
  { mal_id: 26, name: 'Boys Love' },
  { mal_id: 31, name: 'Superhero' },
  { mal_id: 42, name: 'Workplace' },
  { mal_id: 43, name: 'Performer' },
  { mal_id: 44, name: 'Documentary' },
  { mal_id: 39, name: 'Magical Sexy' },
  { mal_id: 46, name: 'Erotica' }
];

// Get anime genres from Jikan API
export function getGenres(): Promise<Genre[]> {
  if (genresCachePromise) return genresCachePromise;

  genresCachePromise = (async () => {
    try {
      await respectRateLimit();
      const response = await fetch(`${BASE_URL}/genres/anime?sfw`);
      if (!response.ok) {
        console.error('Failed to fetch genres:', response.status);
        genresCachePromise = null; // allow retry on next call
        return FALLBACK_GENRES;
      }
      const data = await response.json();
      if (!data.data || !Array.isArray(data.data)) {
        genresCachePromise = null;
        return FALLBACK_GENRES;
      }
      return data.data.map((genre: { mal_id: number; name: string }) => ({
        mal_id: genre.mal_id,
        name: genre.name,
      }));
    } catch (error) {
      console.error('Error fetching genres:', error);
      genresCachePromise = null;
      return FALLBACK_GENRES;
    }
  })();

  return genresCachePromise;
}
