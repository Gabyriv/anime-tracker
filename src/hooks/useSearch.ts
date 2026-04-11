import { useState, useEffect, useRef, useCallback } from 'react';
import { searchAnime, getTopAnime, SearchError, PaginationInfo } from '../lib/api';
import { AnimeFromApi } from '../types/anime';

interface UseSearchResult {
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  results: AnimeFromApi[];
  loading: boolean;
  error: string | null;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  pagination: PaginationInfo;
  loadTopAnime: (pageNum?: number) => Promise<void>;
}

export function useSearch(): UseSearchResult {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<AnimeFromApi[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationInfo>({
    current_page: 1,
    last_visible_page: 1,
    has_next_page: false,
    has_prev_page: false,
  });
  
  const abortControllerRef = useRef<AbortController | null>(null);
  const queryRef = useRef(query);
  const pageRef = useRef(page);
  queryRef.current = query;
  pageRef.current = page;
  
  const loadTopAnime = useCallback(async (pageNum?: number) => {
    const targetPage = pageNum ?? pageRef.current;
    setLoading(true);
    setError(null);
    try {
      const { results: data, pagination: pag, error: searchError } = await getTopAnime(targetPage);
      if (searchError) {
        setError(searchError.message);
      } else {
        setResults(data);
        setPagination(pag);
        setPage(targetPage);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load');
    } finally {
      setLoading(false);
    }
  }, []);
  
  useEffect(() => {
    loadTopAnime(1);
  }, []);
  
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      const currentQuery = queryRef.current;
      const currentPage = pageRef.current;
      
      if (!currentQuery.trim()) {
        await loadTopAnime(currentPage);
        return;
      }
      
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      
      abortControllerRef.current = new AbortController();
      setLoading(true);
      setError(null);
      
      try {
        const { results: data, pagination: pag, error: searchError } = await searchAnime(currentQuery, currentPage);
        
        if (queryRef.current === currentQuery && pageRef.current === currentPage) {
          if (searchError) {
            setError(searchError.message);
            setResults([]);
          } else {
            setResults(data);
            setPagination(pag);
            setError(null);
          }
        }
      } catch (err) {
        if (err instanceof Error && err.name !== 'AbortError') {
          setError(err.message);
        }
      } finally {
        if (queryRef.current === currentQuery && pageRef.current === currentPage) {
          setLoading(false);
        }
      }
    }, 500);
    
    return () => clearTimeout(timeoutId);
  }, [query, page, loadTopAnime]);
  
  return { query, setQuery, results, loading, error, page, setPage, pagination, loadTopAnime };
}