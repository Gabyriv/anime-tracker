import { useState, useEffect, useRef, useCallback } from 'react';
import { searchAnime, getTopAnime, getLatestAnime, getSeasonalAnime, getGenres, SearchError, PaginationInfo, Genre } from '../lib/api';
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
  genres: Genre[];
  selectedGenreId: number | null;
  setGenre: (genreId: number | null) => void;
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

  // Genre filter state
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenreId, setSelectedGenreId] = useState<number | null>(null);

  // Load genres on mount
  useEffect(() => {
    async function loadGenres() {
      const genreList = await getGenres();
      setGenres(genreList);
    }
    loadGenres();
  }, []);

  // Determine if we're in browse mode (empty query) or search mode
  const isBrowseMode = query.trim() === '';

  // Use the appropriate page based on mode
  const page = isBrowseMode ? browsePage : searchPage;
  const setPage = isBrowseMode ? setBrowsePage : setSearchPage;

  const abortControllerRef = useRef<AbortController | null>(null);
  const browseAbortControllerRef = useRef<AbortController | null>(null);
  const queryRef = useRef(query);
  const prevQueryRef = useRef('');
  const categoryRef = useRef(category);
  const defaultViewRef = useRef(defaultView);
  const genreRef = useRef(selectedGenreId);
  const browsePageRef = useRef(browsePage);
  const searchPageRef = useRef(searchPage);
  const initialLoadDone = useRef(false);
  // Track last-seen filter values so StrictMode re-runs (same values) are ignored
  const prevFiltersRef = useRef<{ category: string; genreId: number | null; view: DefaultView } | null>(null);
  // Track last-seen browse page so initial mount and StrictMode re-runs are ignored
  const prevBrowsePageRef = useRef(1);

  queryRef.current = query;
  categoryRef.current = category;
  defaultViewRef.current = defaultView;
  genreRef.current = selectedGenreId;
  browsePageRef.current = browsePage;
  searchPageRef.current = searchPage;

  const setGenre = useCallback((genreId: number | null) => {
    setSelectedGenreId(genreId);
  }, []);

  // Use refs for loadTopAnime to avoid dependency issues
  const loadTopAnime = useCallback(async (pageNum?: number) => {
    const targetPage = pageNum ?? browsePageRef.current;

    if (browseAbortControllerRef.current) {
      browseAbortControllerRef.current.abort();
    }
    browseAbortControllerRef.current = new AbortController();
    const signal = browseAbortControllerRef.current.signal;

    setLoading(true);
    setError(null);

    try {
      let results, pagination, searchError;
      const currentCategory = categoryRef.current;
      const currentView = defaultViewRef.current;
      const currentGenre = genreRef.current;

      if (currentView === 'latest') {
        ({ results, pagination, error: searchError } = await getLatestAnime(targetPage, 20, currentCategory || undefined, currentGenre ? String(currentGenre) : undefined, signal));
      } else if (currentView === 'seasonal') {
        ({ results, pagination, error: searchError } = await getSeasonalAnime(targetPage, 20, currentCategory || undefined, currentGenre ? String(currentGenre) : undefined, signal));
      } else {
        ({ results, pagination, error: searchError } = await getTopAnime(targetPage, 20, currentCategory || undefined, currentGenre ? String(currentGenre) : undefined, signal));
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
  }, []); // No deps - uses refs

  // Initial load only — guard prevents StrictMode double-fire
  useEffect(() => {
    if (initialLoadDone.current) return;
    initialLoadDone.current = true;
    loadTopAnime(1);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Search debounce - only for actual search queries, NOT for filter changes
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      const currentQuery = queryRef.current;
      const currentCategory = categoryRef.current;
      const currentGenre = genreRef.current;
      const currentSearchPage = searchPageRef.current;

      // Only search when there's an actual query - filters are handled by filter changes effect
      if (!currentQuery.trim()) {
        return;
      }

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();
      setLoading(true);
      setError(null);

      try {
        const { results: data, pagination: pag, error: searchError } = await searchAnime(
          currentQuery,
          currentSearchPage,
          20,
          currentCategory || undefined,
          currentGenre ? String(currentGenre) : undefined,
          abortControllerRef.current.signal
        );

        if (queryRef.current === currentQuery) {
          if (searchError) {
            setError(searchError.message);
            setResults([]);
          } else {
            setResults(data);
            setPagination(pag);
            setSearchPage(currentSearchPage);
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
  }, [query]); // Only query triggers search - filters have separate effect

  // Return to browse view when search is cleared
  useEffect(() => {
    if (!query.trim() && prevQueryRef.current.trim()) {
      loadTopAnime(1);
    }
    prevQueryRef.current = query;
  }, [query]); // eslint-disable-line react-hooks/exhaustive-deps

  // Page changes for browse mode — only fires when page actually changes
  useEffect(() => {
    const prev = prevBrowsePageRef.current;
    prevBrowsePageRef.current = browsePage;
    if (prev === browsePage) return; // skip initial mount and StrictMode re-runs
    if (!query.trim()) {
      loadTopAnime(browsePage);
    }
  }, [browsePage]); // eslint-disable-line react-hooks/exhaustive-deps

  // Filter changes - only fire when values actually changed (guards against StrictMode re-runs)
  useEffect(() => {
    const prev = prevFiltersRef.current;
    const current = { category, genreId: selectedGenreId, view: defaultView };
    prevFiltersRef.current = current;

    // Skip initial mount and StrictMode re-runs (values unchanged)
    if (!prev || (prev.category === current.category && prev.genreId === current.genreId && prev.view === current.view)) {
      return;
    }

    const timeoutId = setTimeout(() => {
      if (!query.trim()) {
        loadTopAnime(1);
      }
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [category, selectedGenreId, defaultView]); // eslint-disable-line react-hooks/exhaustive-deps

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
    setDefaultView,
    genres,
    selectedGenreId,
    setGenre
  };
}
