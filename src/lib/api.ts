import { AnimeFromApi } from '../types/anime';

const BASE_URL = 'https://api.jikan.moe/v4';

export interface SearchError {
  type: 'network' | 'rate_limit' | 'timeout' | 'invalid' | 'unknown';
  message: string;
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

export async function searchAnime(query: string, limit = 25): Promise<{ results: AnimeFromApi[]; error: SearchError | null }> {
  if (!query.trim()) return { results: [], error: null };
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);
  
  try {
    const encodedQuery = encodeURIComponent(query);
    const response = await fetch(`${BASE_URL}/anime?q=${encodedQuery}&limit=${limit}&sfw`, {
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (response.status === 429) {
      return { results: [], error: createError('rate_limit', ERROR_MESSAGES.rate_limit) };
    }
    
    if (!response.ok) {
      console.error('API error:', response.status);
      return { results: [], error: createError('network', ERROR_MESSAGES.network) };
    }
    
    const data = await response.json();
    
    if (!data.data || !Array.isArray(data.data)) {
      return { results: [], error: createError('invalid', ERROR_MESSAGES.invalid) };
    }
    
    return { results: data.data, error: null };
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        return { results: [], error: createError('timeout', ERROR_MESSAGES.timeout) };
      }
      // Network errors (failed to fetch)
      return { results: [], error: createError('network', ERROR_MESSAGES.network) };
    }
    
    return { results: [], error: createError('unknown', ERROR_MESSAGES.unknown) };
  }
}