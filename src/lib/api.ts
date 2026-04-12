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
const MIN_REQUEST_DELAY = 350;

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

async function respectRateLimit() {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  if (timeSinceLastRequest < MIN_REQUEST_DELAY) {
    await new Promise(resolve => setTimeout(resolve, MIN_REQUEST_DELAY - timeSinceLastRequest));
  }
  lastRequestTime = Date.now();
}

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

export async function getTopAnime(page = 1, limit = 20, type?: string, genre?: string): Promise<{ results: AnimeFromApi[]; pagination: PaginationInfo; error: SearchError | null }> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);
  
  try {
    await respectRateLimit();
    
    let url = `${BASE_URL}/top/anime?page=${page}&limit=${limit}&sfw`;
    if (type && isValidType(type)) {
      url += `&type=${type}`;
    }
    if (genre) {
      url += `&genres=${genre}`;
    }
    
    const response = await fetch(url, {
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (response.status === 429) {
      return { results: [], pagination: { current_page: 1, last_visible_page: 1, has_next_page: false, has_prev_page: false }, error: createError('rate_limit', ERROR_MESSAGES.rate_limit) };
    }
    
    if (!response.ok) {
      console.error('API error:', response.status);
      return { results: [], pagination: { current_page: 1, last_visible_page: 1, has_next_page: false, has_prev_page: false }, error: createError('network', ERROR_MESSAGES.network) };
    }
    
    const data = await response.json();
    
    if (!data.data || !Array.isArray(data.data)) {
      return { results: [], pagination: { current_page: 1, last_visible_page: 1, has_next_page: false, has_prev_page: false }, error: createError('invalid', ERROR_MESSAGES.invalid) };
    }
    
    const pagination: PaginationInfo = {
      current_page: data.pagination?.current_page ?? 1,
      last_visible_page: data.pagination?.last_visible_page ?? 1,
      has_next_page: data.pagination?.has_next_page ?? false,
      has_prev_page: data.pagination?.has_prev_page ?? false,
    };
    
    return { results: data.data, pagination, error: null };
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        return { results: [], pagination: { current_page: 1, last_visible_page: 1, has_next_page: false, has_prev_page: false }, error: createError('timeout', ERROR_MESSAGES.timeout) };
      }
      return { results: [], pagination: { current_page: 1, last_visible_page: 1, has_next_page: false, has_prev_page: false }, error: createError('network', ERROR_MESSAGES.network) };
    }
    
    return { results: [], pagination: { current_page: 1, last_visible_page: 1, has_next_page: false, has_prev_page: false }, error: createError('unknown', ERROR_MESSAGES.unknown) };
  }
}

export async function searchAnime(query: string, page = 1, limit = 20, type?: string, genre?: string): Promise<{ results: AnimeFromApi[]; pagination: PaginationInfo; error: SearchError | null }> {
  if (!query.trim()) return { results: [], pagination: { current_page: 1, last_visible_page: 1, has_next_page: false, has_prev_page: false }, error: null };
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);
  
  try {
    await respectRateLimit();
    
    const encodedQuery = encodeURIComponent(query);
    let url = `${BASE_URL}/anime?q=${encodedQuery}&page=${page}&limit=${limit}&sfw`;
    if (type && isValidType(type)) {
      url += `&type=${type}`;
    }
    if (genre) {
      url += `&genres=${genre}`;
    }
    
    const response = await fetch(url, {
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (response.status === 429) {
      return { results: [], pagination: { current_page: 1, last_visible_page: 1, has_next_page: false, has_prev_page: false }, error: createError('rate_limit', ERROR_MESSAGES.rate_limit) };
    }
    
    if (!response.ok) {
      console.error('API error:', response.status);
      return { results: [], pagination: { current_page: 1, last_visible_page: 1, has_next_page: false, has_prev_page: false }, error: createError('network', ERROR_MESSAGES.network) };
    }
    
    const data = await response.json();
    
    if (!data.data || !Array.isArray(data.data)) {
      return { results: [], pagination: { current_page: 1, last_visible_page: 1, has_next_page: false, has_prev_page: false }, error: createError('invalid', ERROR_MESSAGES.invalid) };
    }
    
    const pagination: PaginationInfo = {
      current_page: data.pagination?.current_page ?? 1,
      last_visible_page: data.pagination?.last_visible_page ?? 1,
      has_next_page: data.pagination?.has_next_page ?? false,
      has_prev_page: data.pagination?.has_prev_page ?? false,
    };
    
    return { results: data.data, pagination, error: null };
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        return { results: [], pagination: { current_page: 1, last_visible_page: 1, has_next_page: false, has_prev_page: false }, error: createError('timeout', ERROR_MESSAGES.timeout) };
      }
      return { results: [], pagination: { current_page: 1, last_visible_page: 1, has_next_page: false, has_prev_page: false }, error: createError('network', ERROR_MESSAGES.network) };
    }
    
    return { results: [], pagination: { current_page: 1, last_visible_page: 1, has_next_page: false, has_prev_page: false }, error: createError('unknown', ERROR_MESSAGES.unknown) };
  }
}

// Get currently airing anime (Latest view)
export async function getLatestAnime(page = 1, limit = 20, type?: string, genre?: string): Promise<{ results: AnimeFromApi[]; pagination: PaginationInfo; error: SearchError | null }> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);
  
  try {
    await respectRateLimit();
    
    let url = `${BASE_URL}/anime?status=airing&order_by=start_date&sort=desc&page=${page}&limit=${limit}&sfw`;
    if (type && isValidType(type)) {
      url += `&type=${type}`;
    }
    if (genre) {
      url += `&genres=${genre}`;
    }
    
    const response = await fetch(url, {
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (response.status === 429) {
      return { results: [], pagination: { current_page: 1, last_visible_page: 1, has_next_page: false, has_prev_page: false }, error: createError('rate_limit', ERROR_MESSAGES.rate_limit) };
    }
    
    if (!response.ok) {
      console.error('API error:', response.status);
      return { results: [], pagination: { current_page: 1, last_visible_page: 1, has_next_page: false, has_prev_page: false }, error: createError('network', ERROR_MESSAGES.network) };
    }
    
    const data = await response.json();
    
    if (!data.data || !Array.isArray(data.data)) {
      return { results: [], pagination: { current_page: 1, last_visible_page: 1, has_next_page: false, has_prev_page: false }, error: createError('invalid', ERROR_MESSAGES.invalid) };
    }
    
    const pagination: PaginationInfo = {
      current_page: data.pagination?.current_page ?? 1,
      last_visible_page: data.pagination?.last_visible_page ?? 1,
      has_next_page: data.pagination?.has_next_page ?? false,
      has_prev_page: data.pagination?.has_prev_page ?? false,
    };
    
    return { results: data.data, pagination, error: null };
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        return { results: [], pagination: { current_page: 1, last_visible_page: 1, has_next_page: false, has_prev_page: false }, error: createError('timeout', ERROR_MESSAGES.timeout) };
      }
      return { results: [], pagination: { current_page: 1, last_visible_page: 1, has_next_page: false, has_prev_page: false }, error: createError('network', ERROR_MESSAGES.network) };
    }
    
    return { results: [], pagination: { current_page: 1, last_visible_page: 1, has_next_page: false, has_prev_page: false }, error: createError('unknown', ERROR_MESSAGES.unknown) };
  }
}

// Get seasonal anime (current season)
export async function getSeasonalAnime(page = 1, limit = 20, type?: string, genre?: string): Promise<{ results: AnimeFromApi[]; pagination: PaginationInfo; error: SearchError | null }> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);
  
  try {
    await respectRateLimit();
    
    let url = `${BASE_URL}/seasons/now?page=${page}&limit=${limit}&sfw`;
    if (type && isValidType(type)) {
      url += `&type=${type}`;
    }
    if (genre) {
      url += `&genres=${genre}`;
    }
    
    const response = await fetch(url, {
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (response.status === 429) {
      return { results: [], pagination: { current_page: 1, last_visible_page: 1, has_next_page: false, has_prev_page: false }, error: createError('rate_limit', ERROR_MESSAGES.rate_limit) };
    }
    
    if (!response.ok) {
      console.error('API error:', response.status);
      return { results: [], pagination: { current_page: 1, last_visible_page: 1, has_next_page: false, has_prev_page: false }, error: createError('network', ERROR_MESSAGES.network) };
    }
    
    const data = await response.json();
    
    if (!data.data || !Array.isArray(data.data)) {
      return { results: [], pagination: { current_page: 1, last_visible_page: 1, has_next_page: false, has_prev_page: false }, error: createError('invalid', ERROR_MESSAGES.invalid) };
    }
    
    const pagination: PaginationInfo = {
      current_page: data.pagination?.current_page ?? 1,
      last_visible_page: data.pagination?.last_visible_page ?? 1,
      has_next_page: data.pagination?.has_next_page ?? false,
      has_prev_page: data.pagination?.has_prev_page ?? false,
    };
    
    return { results: data.data, pagination, error: null };
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        return { results: [], pagination: { current_page: 1, last_visible_page: 1, has_next_page: false, has_prev_page: false }, error: createError('timeout', ERROR_MESSAGES.timeout) };
      }
      return { results: [], pagination: { current_page: 1, last_visible_page: 1, has_next_page: false, has_prev_page: false }, error: createError('network', ERROR_MESSAGES.network) };
    }
    
    return { results: [], pagination: { current_page: 1, last_visible_page: 1, has_next_page: false, has_prev_page: false }, error: createError('unknown', ERROR_MESSAGES.unknown) };
  }
}

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
export async function getGenres(): Promise<Genre[]> {
  try {
    await respectRateLimit();
    
    const response = await fetch(`${BASE_URL}/genres/anime?sfw`);
    
    if (!response.ok) {
      console.error('Failed to fetch genres:', response.status);
      return FALLBACK_GENRES;
    }
    
    const data = await response.json();
    
    if (!data.data || !Array.isArray(data.data)) {
      return FALLBACK_GENRES;
    }
    
    return data.data.map((genre: { mal_id: number; name: string }) => ({
      mal_id: genre.mal_id,
      name: genre.name
    }));
  } catch (error) {
    console.error('Error fetching genres:', error);
    return FALLBACK_GENRES;
  }
}