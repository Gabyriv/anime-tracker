import { AnimeFromApi } from '../types/anime';

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

export async function getTopAnime(page = 1, limit = 20): Promise<{ results: AnimeFromApi[]; pagination: PaginationInfo; error: SearchError | null }> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);
  
  try {
    await respectRateLimit();
    
    const response = await fetch(`${BASE_URL}/top/anime?page=${page}&limit=${limit}&sfw`, {
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

export async function searchAnime(query: string, page = 1, limit = 20): Promise<{ results: AnimeFromApi[]; pagination: PaginationInfo; error: SearchError | null }> {
  if (!query.trim()) return { results: [], pagination: { current_page: 1, last_visible_page: 1, has_next_page: false, has_prev_page: false }, error: null };
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);
  
  try {
    await respectRateLimit();
    
    const encodedQuery = encodeURIComponent(query);
    const response = await fetch(`${BASE_URL}/anime?q=${encodedQuery}&page=${page}&limit=${limit}&sfw`, {
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