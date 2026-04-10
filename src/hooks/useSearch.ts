import { useState, useEffect, useRef } from 'react';
import { searchAnime, SearchError } from '../lib/api';
import { AnimeFromApi } from '../types/anime';

interface UseSearchResult {
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  results: AnimeFromApi[];
  loading: boolean;
  error: string | null;
}

export function useSearch(): UseSearchResult {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<AnimeFromApi[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const abortControllerRef = useRef<AbortController | null>(null);
  const queryRef = useRef(query);
  queryRef.current = query;
  
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      const currentQuery = queryRef.current;
      
      if (!currentQuery.trim()) {
        setResults([]);
        setLoading(false);
        setError(null);
        return;
      }
      
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      
      abortControllerRef.current = new AbortController();
      setLoading(true);
      setError(null);
      
      try {
        const { results: data, error: searchError } = await searchAnime(currentQuery);
        
        if (queryRef.current === currentQuery) {
          if (searchError) {
            setError(searchError.message);
            setResults([]);
          } else {
            setResults(data);
            setError(null);
          }
        }
      } catch (err) {
        if (err instanceof Error && err.name !== 'AbortError') {
          setError(err.message);
        }
      } finally {
        if (queryRef.current === currentQuery) {
          setLoading(false);
        }
      }
    }, 500);
    
    return () => clearTimeout(timeoutId);
  }, [query]);
  
  return { query, setQuery, results, loading, error };
}