import { AnimeFromApi } from '../types/anime';

const BASE_URL = 'https://api.jikan.moe/v4';

export async function searchAnime(query: string, limit = 25): Promise<AnimeFromApi[]> {
  if (!query.trim()) return [];
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);
  
  try {
    const encodedQuery = encodeURIComponent(query);
    const response = await fetch(`${BASE_URL}/anime?q=${encodedQuery}&limit=${limit}&sfw`, {
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      console.error('API error:', response.status);
      return [];
    }
    
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name !== 'AbortError') {
      console.error('Search error:', error.message);
    }
    return [];
  }
}