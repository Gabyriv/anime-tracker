import { useState, useEffect, useRef, useCallback } from 'react';
import { searchAnime, getTopAnime, getLatestAnime, getSeasonalAnime, SearchError, PaginationInfo } from '../lib/api';
import { AnimeFromApi } from '../types/anime';

export type DefaultView = 'popular' | 'latest' | 'seasonal';

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
  category: string;
  setCategory: React.Dispatch<React.SetStateAction<string>>;
  defaultView: DefaultView;
  setDefaultView: React.Dispatch<React.SetStateAction<DefaultView>>;
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
  
  // Category filter state (session-only, no localStorage)
  const [category, setCategory] = useState('');
  
  // Default view state (session-only, no localStorage)
  const [defaultView, setDefaultView] = useState<DefaultView>('popular');
  
  // Determine if we're in browse mode (empty query) or search mode
  const isBrowseMode = query.trim() === '';
  
  // Use the appropriate page based on mode
  const page = isBrowseMode ? browsePage : searchPage;
  const setPage = isBrowseMode ? setBrowsePage : setSearchPage;
  
  const abortControllerRef = useRef<AbortController | null>(null);
  const queryRef = useRef(query);
  const pageRef = useRef(page);
  const categoryRef = useRef(category);
  const defaultViewRef = useRef(defaultView);
  queryRef.current = query;
  pageRef.current = page;
  categoryRef.current = category;
  defaultViewRef.current = defaultView;
  
  const loadTopAnime = useCallback(async (pageNum?: number) => {
    const targetPage = pageNum ?? browsePage;
    setLoading(true);
    setError(null);
    
    const currentCategory = categoryRef.current;
    const currentView = defaultViewRef.current;
    
    try {
      let results, pagination, searchError;
      
      if (currentView === 'latest') {
        ({ results, pagination, error: searchError } = await getLatestAnime(targetPage, 20, currentCategory || undefined));
      } else if (currentView === 'seasonal') {
        ({ results, pagination, error: searchError } = await getSeasonalAnime(targetPage, 20, currentCategory || undefined));
      } else {
        // Default: popular
        ({ results, pagination, error: searchError } = await getTopAnime(targetPage, 20, currentCategory || undefined));
      }
      
      if (searchError) {
        setError(searchError.message);
      } else {
        setResults(results);
        setPagination(pagination);
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
      const currentCategory = categoryRef.current;
      
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
        const { results: data, pagination: pag, error: searchError } = await searchAnime(currentQuery, searchPage, 20, currentCategory || undefined);
        
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
  }, [query, browsePage, searchPage, category, loadTopAnime]);

  return { 
    query, 
    setQuery, 
    results, 
    loading, 
    error, 
    page, 
    setPage, 
    pagination, 
    loadTopAnime, 
    isBrowseMode,
    category,
    setCategory,
    defaultView,
    setDefaultView
  };
}