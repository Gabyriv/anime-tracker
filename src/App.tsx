import { useState, useEffect, useRef } from 'react';
import { initDb } from './lib/db';
import { useSearch } from './hooks/useSearch';
import { useAnimeList } from './hooks/useAnimeList';
import { useTitleLanguageToggle } from './hooks/useTitleLanguageToggle';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { SearchHeader } from './components/SearchHeader';
import { SearchBar } from './components/SearchBar';
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
  const toastFnRef = useRef<((msg: string, type?: string, status?: string) => void) | null>(null);
  
  const { query, setQuery, results, loading, error: searchError, page, setPage, pagination, category, setCategory, defaultView, setDefaultView } = useSearch();
  const { list, addToList, updateStatus } = useAnimeList();
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
              <div className="flex gap-3">
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
            </div>
          </div>
        </header>
      
      <main className="container mx-auto px-4 py-6">
        {viewMode === 'search' && (
          <>
            <div className="mb-6">
              <SearchBar 
                query={query}
                setQuery={setQuery}
                loading={loading}
                error={searchError}
                titleLanguage={titleLanguage}
                onTitleLanguageToggle={toggleTitleLanguage}
                category={category}
                onCategoryChange={setCategory}
                defaultView={defaultView}
                onDefaultViewChange={setDefaultView}
              />
            </div>
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
            />
            
            {loading && (
              <div className="text-center py-8 text-[var(--color-foreground-muted)]">Loading...</div>
            )}
          </>
        )}
        
        {viewMode === 'list' && (
          <UserList />
        )}
      </main>
      
      <Dialog open={!!selectedAnime} onOpenChange={(open) => { if (!open) setSelectedAnime(null); setSynopsisExpanded(false); }}>
        <DialogContent className="relative flex flex-col lg:flex-row gap-6">
          {selectedAnime && (
            <>
              {/* Image section */}
              {selectedAnime.images?.jpg?.large_image_url && (
                <div className="lg:w-1/3 flex-shrink-0">
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
                    {selectedAnime.episodes && <span className="bg-[var(--color-surface)] mr-1 px-3 py-1 rounded text-xs">{selectedAnime.episodes} episodes</span>}
                    {selectedAnime.status && <span className="bg-[var(--color-surface)] mr-1 px-3 py-1 rounded text-xs capitalize">{selectedAnime.status?.replace('_', ' ')}</span>}
                    {selectedAnime.score && <span className="bg-[var(--color-surface)] mr-1 px-3 py-1 rounded text-xs text-amber-400">★ {selectedAnime.score}</span>}
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
                        className="text-[var(--color-accent)] text-sm mt-2 hover:underline"
                      >
                        {synopsisExpanded ? <span className="font-bold">−</span> : <span className="font-bold">+</span>} {synopsisExpanded ? 'Show less' : 'Show more'}
                      </button>
                    )}
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
