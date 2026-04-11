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
  isBrowseMode: boolean;
}

export function useSearch(): UseSearchResult {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<AnimeFromApi[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [browsePage, setBrowsePage] = useState(1);
  const [searchPage, setSearchPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationInfo>({
    current_page: 1,
    last_visible_page: 1,
    has_next_page: false,
    has_prev_page: false,
  });
  
  // Determine if we're in browse mode (empty query) or search mode
  const isBrowseMode = query.trim() === '';
  
  // Use the appropriate page based on mode
  const page = isBrowseMode ? browsePage : searchPage;
  const setPage = isBrowseMode ? setBrowsePage : setSearchPage;
  
  const abortControllerRef = useRef<AbortController | null>(null);
  const queryRef = useRef(query);
  const pageRef = useRef(page);
  queryRef.current = query;
  pageRef.current = page;
  
  const loadTopAnime = useCallback(async (pageNum?: number) => {
    const targetPage = pageNum ?? browsePage;
    setLoading(true);
    setError(null);
    try {
      const { results: data, pagination: pag, error: searchError } = await getTopAnime(targetPage);
      if (searchError) {
        setError(searchError.message);
      } else {
        setResults(data);
        setPagination(pag);
        setBrowsePage(targetPage);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load');
    } finally {
      setLoading(false);
    }
  }, [browsePage]);
  
  useEffect(() => {
    loadTopAnime(1);
  }, []);
  
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      const currentQuery = queryRef.current;
      
      if (!currentQuery.trim()) {
        await loadTopAnime(browsePage);
        return;
      }
      
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      
      abortControllerRef.current = new AbortController();
      setLoading(true);
      setError(null);
      
      try {
        const { results: data, pagination: pag, error: searchError } = await searchAnime(currentQuery, searchPage);
        
        if (queryRef.current === currentQuery) {
          if (searchError) {
            setError(searchError.message);
            setResults([]);
          } else {
            setResults(data);
            setPagination(pag);
            setSearchPage(searchPage);
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
  }, [query, browsePage, searchPage, loadTopAnime]);

  return { query, setQuery, results, loading, error, page, setPage, pagination, loadTopAnime, isBrowseMode };
}