import { useState, useEffect, useRef } from 'react';
import { initDb, updateAiredEpisodes } from './lib/db';
import { fetchAiredEpisodes } from './lib/api';
import { useSearch } from './hooks/useSearch';
import { useAnimeList } from './hooks/useAnimeList';
import { useTitleLanguageToggle } from './hooks/useTitleLanguageToggle';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { SearchHeader } from './components/SearchHeader';
import { SearchResults } from './components/SearchResults';
import { UserList } from './components/UserList';
import { StatusDropdown } from './components/StatusDropdown';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './components/ui/Dialog';
import { ToastContainer } from './components/ui/ToastContainer';
import { ToastProvider, toast } from './context/ToastContext';
import { AnimeFromApi, AnimeStatus } from './types/anime';

type ViewMode = 'search' | 'list';

function App() {
  const [dbReady, setDbReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedAnime, setSelectedAnime] = useState<AnimeFromApi | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('search');
  const [synopsisExpanded, setSynopsisExpanded] = useState(false);
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [airedEpisodes, setAiredEpisodes] = useState<number | null>(null);
  const toastFnRef = useRef<((msg: string, type?: string, status?: string) => void) | null>(null);
  
  const { query, setQuery, results, loading, error: searchError, page, setPage, pagination, category, setCategory, defaultView, setDefaultView, genres, selectedGenreId, setGenre } = useSearch();
  const {
    list,
    loading: listLoading,
    error: listError,
    addToList,
    updateStatus,
    removeFromList,
    updateEpisodeProgress,
    refresh: refreshList,
  } = useAnimeList();
  const { titleLanguage, toggle: toggleTitleLanguage } = useTitleLanguageToggle();

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onEscape: () => setSelectedAnime(null),
    onSlash: () => setSearchExpanded(true),
  });

  // Status labels for toast formatting
  const statusLabels: Record<string, string> = {
    watching: 'Watching',
    completed: 'Completed',
    plan_to_watch: 'Plan to Watch',
    on_hold: 'On Hold',
    dropped: 'Dropped',
  };

  const formatStatusLabel = (status: string): string => statusLabels[status] || status.replace(/_/g, ' ');

  useEffect(() => {
    initDb()
      .then(() => setDbReady(true))
      .catch((err) => setError(err.message));
  }, []);

  useEffect(() => {
    if (!selectedAnime || selectedAnime.status !== 'Currently Airing') {
      setAiredEpisodes(null);
      return;
    }
    let cancelled = false;
    setAiredEpisodes(null);
    fetchAiredEpisodes(selectedAnime.mal_id).then(count => {
      if (!cancelled && count !== null) {
        setAiredEpisodes(count);
        updateAiredEpisodes(selectedAnime.mal_id, count).then(() => refreshList());
      }
    });
    return () => { cancelled = true; };
  }, [selectedAnime?.mal_id, selectedAnime?.status]);

  const isInList = (malId: number) => {
    return list.some(item => item.mal_id === malId);
  };

  const getUserStatus = (malId: number): AnimeStatus | null => {
    const entry = list.find(item => item.mal_id === malId);
    return entry?.status as AnimeStatus | null;
  };

  const handleStatusChange = async (anime: AnimeFromApi, status: AnimeStatus) => {
    if (isInList(anime.mal_id)) {
      const entry = list.find(item => item.mal_id === anime.mal_id);
      if (entry) {
        await updateStatus(entry.id, status);
        if (toastFnRef.current) toastFnRef.current(`Status Updated to ${formatStatusLabel(status)}`, 'success', status);
      }
    } else {
      await addToList(anime, status);
      if (toastFnRef.current) toastFnRef.current(`Added to ${formatStatusLabel(status)} list`, 'success', status);
    }
  };

  const getModalTitle = (anime: AnimeFromApi) => {
    if (titleLanguage === 'japanese') {
      return anime.title || anime.title_english;
    } else if (titleLanguage === 'kanji') {
      return anime.title_japanese || anime.title_english || anime.title;
    }
    return anime.title_english || anime.title;
  };

  if (error) return <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-deep)] text-red-400">Database Error: {error}</div>;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!dbReady) return <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-deep)] text-[var(--color-foreground)]">Initializing database...</div>;

  return (
    <ToastProvider toastFnRef={toastFnRef}>
      <div className="min-h-screen bg-gradient-to-b from-[#0a0a0f] to-[#020203] text-[var(--color-foreground)]">
        <header className="p-6 border-b border-[var(--color-border)]">
          <div className="flex items-center justify-between">
            <h1 
              className="text-3xl font-bold tracking-tight cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => setViewMode('search')}
            >
              <span className="text-[var(--color-accent)]">Anime</span> Tracker
            </h1>
          
            <div className="flex items-center gap-4">
              <SearchHeader 
                query={query}
                setQuery={setQuery}
                loading={loading}
                titleLanguage={titleLanguage}
                onLanguageToggle={toggleTitleLanguage}
                expanded={searchExpanded}
                setExpanded={setSearchExpanded}
              />
              
              {/* Desktop tabs - hidden on mobile */}
              <div className="hidden md:flex gap-3">
                <button
                  onClick={() => setViewMode('search')}
                  className={`h-10 px-5 rounded-xl font-medium transition-all duration-200 flex items-center ${
                    viewMode === 'search' 
                      ? 'bg-[var(--color-accent)] text-white shadow-lg shadow-[var(--color-accent-glow)]' 
                      : 'bg-[var(--color-surface)] text-[var(--color-foreground-muted)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-foreground)]'
                  }`}
                >
                  Home
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`h-10 px-5 rounded-xl font-medium transition-all duration-200 flex items-center ${
                    viewMode === 'list' 
                      ? 'bg-[var(--color-accent)] text-white shadow-lg shadow-[var(--color-accent-glow)]' 
                      : 'bg-[var(--color-surface)] text-[var(--color-foreground-muted)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-foreground)]'
                  }`}
                >
                  My List ({list.length})
                </button>
              </div>
              
              {/* Mobile burger menu */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-[var(--color-surface)] text-[var(--color-foreground-muted)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-foreground)] transition-colors"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          
          {/* Mobile menu dropdown */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pt-4 border-t border-[var(--color-border)]">
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => { setViewMode('search'); setMobileMenuOpen(false); }}
                  className={`w-full h-12 px-5 rounded-xl font-medium transition-all duration-200 flex items-center justify-center ${
                    viewMode === 'search' 
                      ? 'bg-[var(--color-accent)] text-white shadow-lg shadow-[var(--color-accent-glow)]' 
                      : 'bg-[var(--color-surface)] text-[var(--color-foreground-muted)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-foreground)]'
                  }`}
                >
                  Home
                </button>
                <button
                  onClick={() => { setViewMode('list'); setMobileMenuOpen(false); }}
                  className={`w-full h-12 px-5 rounded-xl font-medium transition-all duration-200 flex items-center justify-center ${
                    viewMode === 'list' 
                      ? 'bg-[var(--color-accent)] text-white shadow-lg shadow-[var(--color-accent-glow)]' 
                      : 'bg-[var(--color-surface)] text-[var(--color-foreground-muted)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-foreground)]'
                  }`}
                >
                  My List ({list.length})
                </button>
              </div>
            </div>
          )}
        </header>
      
      <main className="container mx-auto px-4 py-6">
        {viewMode === 'search' && (
          <>
            <SearchResults 
              query={query}
              results={results}
              loading={loading}
              error={searchError}
              pagination={pagination}
              onPageChange={setPage}
              onAnimeSelect={setSelectedAnime}
              onStatusChange={handleStatusChange}
              isInList={isInList}
              getUserStatus={getUserStatus}
              titleLanguage={titleLanguage}
              genres={genres}
              selectedGenreId={selectedGenreId}
              onGenreChange={setGenre}
              category={category}
              onCategoryChange={setCategory}
              defaultView={defaultView}
              onDefaultViewChange={setDefaultView}
            />
            
            {loading && (
              <div className="text-center py-8 text-[var(--color-foreground-muted)]">Loading...</div>
            )}
          </>
        )}
        
        {viewMode === 'list' && (
          <UserList
            list={list}
            loading={listLoading}
            error={listError}
            updateStatus={updateStatus}
            removeFromList={removeFromList}
            updateEpisodeProgress={updateEpisodeProgress}
            refresh={refreshList}
            onGoHome={() => setViewMode('search')}
          />
        )}
      </main>
      
      <Dialog open={!!selectedAnime} onOpenChange={(open) => { if (!open) setSelectedAnime(null); setSynopsisExpanded(false); }}>
        <DialogContent className="relative flex flex-col lg:flex-row gap-6">
          {selectedAnime && (
            <>
              {/* Image section */}
              {selectedAnime.images?.jpg?.large_image_url && (
                <div className="lg:w-2/5 flex-shrink-0">
                  <img 
                    src={selectedAnime.images.jpg.large_image_url}
                    alt={selectedAnime.title}
                    className="w-full rounded-xl object-cover"
                  />
                </div>
              )}
              
              {/* Details section */}
              <div className="flex-1 flex flex-col">
              <DialogHeader>
                <DialogTitle className="text-2xl">{getModalTitle(selectedAnime)}</DialogTitle>
                  <DialogDescription className="flex flex-wrap gap-3 mt-2">
                    {selectedAnime.year && <span className="bg-[var(--color-surface)] ml-0 mr-1 px-3 py-1 rounded text-xs">Year: {selectedAnime.year}</span>}
                    {selectedAnime.episodes && (
                      <span className="bg-[var(--color-surface)] mr-1 px-3 py-1 rounded text-xs">
                        {selectedAnime.status === 'Currently Airing' && airedEpisodes !== null
                          ? `${airedEpisodes}/${selectedAnime.episodes} episodes`
                          : `${selectedAnime.episodes} episodes`}
                      </span>
                    )}
                    {selectedAnime.status && <span className="bg-[var(--color-surface)] mr-1 px-3 py-1 rounded text-xs capitalize">{selectedAnime.status?.replace('_', ' ')}</span>}
                    {selectedAnime.score && <span className="bg-[var(--color-surface)] mr-1 px-3 py-1 rounded text-xs text-amber-400">★ {selectedAnime.score}</span>}
                    {selectedAnime.studios && selectedAnime.studios.length > 0 && (
                      <span className="bg-[var(--color-surface)] mr-1 px-3 py-1 rounded text-xs">
                        {selectedAnime.studios.map((s: { name: string }) => s.name).join(', ')}
                      </span>
                    )}
                  </DialogDescription>
                </DialogHeader>
                
                {/* User data if in list */}
                {(() => {
                  const entry = list.find(item => item.mal_id === selectedAnime.mal_id);
                  if (entry) {
                    return (
                      <div className="flex gap-4 mt-3 py-3 border-y border-[var(--color-border)]">
                        <div>
                          <span className="text-xs text-[var(--color-foreground-muted)]">Status</span>
                          <p className="text-sm font-medium">{entry.status}</p>
                        </div>
                        {entry.episodes_watched > 0 && (
                          <div>
                            <span className="text-xs text-[var(--color-foreground-muted)]">Progress</span>
                            <p className="text-sm font-medium">{entry.episodes_watched}/{selectedAnime.episodes || '?'}</p>
                          </div>
                        )}
                        {entry.personal_rating && (
                          <div>
                            <span className="text-xs text-[var(--color-foreground-muted)]">Your Rating</span>
                            <p className="text-sm font-medium text-amber-400">★ {entry.personal_rating}</p>
                          </div>
                        )}
                      </div>
                    );
                  }
                  return null;
                })()}
                
                {/* Synopsis */}
                {selectedAnime.synopsis && (
                  <div className="mt-4">
                    <p className="text-[var(--color-foreground-muted)] text-sm leading-relaxed whitespace-pre-wrap">
                      {selectedAnime.synopsis.length > 300 && !synopsisExpanded
                        ? selectedAnime.synopsis.slice(0, 300) + '...'
                        : selectedAnime.synopsis}
                    </p>
                    {selectedAnime.synopsis.length > 300 && (
                      <button
                        onClick={() => setSynopsisExpanded(!synopsisExpanded)}
                        className="flex items-center gap-1 text-[var(--color-accent)] text-sm mt-2 hover:opacity-80 transition-opacity"
                      >
                        {synopsisExpanded ? 'Show less' : 'Show more'}
                        <svg className={`w-4 h-4 transition-transform duration-200 ${synopsisExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    )}
                  </div>
                )}
                
                {/* Genre tags */}
                {selectedAnime.genres && selectedAnime.genres.length > 0 && (
                  <div className="mt-4">
                    <p className="text-xs text-[var(--color-foreground-muted)] mb-1.5 uppercase tracking-wide">Filter by genre</p>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedAnime.genres.map((genre) => (
                        <button
                          key={genre.mal_id}
                          onClick={() => { setSelectedAnime(null); setGenre(genre.mal_id); setSynopsisExpanded(false); }}
                          className="text-xs px-2.5 py-1 rounded-lg bg-[var(--color-surface)] text-[var(--color-foreground-muted)] hover:bg-[var(--color-accent)] hover:text-white transition-colors"
                        >
                          {genre.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action buttons */}
                <div className="mt-auto pt-4">
                  <StatusDropdown 
                    currentStatus={getUserStatus(selectedAnime.mal_id)}
                    onStatusChange={(status) => handleStatusChange(selectedAnime, status)}
                    isInList={isInList(selectedAnime.mal_id)}
                  />
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
      <ToastContainer />
    </div>
    </ToastProvider>
  );
}

export default App;
