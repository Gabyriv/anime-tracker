import { useState, useEffect } from 'react';
import { initDb } from './lib/db';
import { useSearch } from './hooks/useSearch';
import { useAnimeList } from './hooks/useAnimeList';
import { SearchBar } from './components/SearchBar';
import { SearchResults } from './components/SearchResults';
import { UserList } from './components/UserList';
import { StatusDropdown } from './components/StatusDropdown';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './components/ui/Dialog';
import { AnimeFromApi, AnimeStatus } from './types/anime';

type ViewMode = 'search' | 'list';

function App() {
  const [dbReady, setDbReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedAnime, setSelectedAnime] = useState<AnimeFromApi | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('search');
  
  const { query, setQuery, results, loading, error: searchError, page, setPage, pagination } = useSearch();
  const { list, addToList, updateStatus } = useAnimeList();

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
      }
    } else {
      await addToList(anime, status);
    }
  };

  if (error) return <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-deep)] text-red-400">Database Error: {error}</div>;
  if (!dbReady) return <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-deep)] text-[var(--color-foreground)]">Initializing database...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0f] to-[#020203] text-[var(--color-foreground)]">
      <header className="p-6 border-b border-[var(--color-border)]">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">
            <span className="text-[var(--color-accent)]">Anime</span> Tracker
          </h1>
          
          <div className="flex gap-3">
            <button
              onClick={() => setViewMode('search')}
              className={`px-5 py-2.5 rounded-xl font-medium transition-all duration-200 ${
                viewMode === 'search' 
                  ? 'bg-[var(--color-accent)] text-white shadow-lg shadow-[var(--color-accent-glow)]' 
                  : 'bg-[var(--color-surface)] text-[var(--color-foreground-muted)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-foreground)]'
              }`}
            >
              Search
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-5 py-2.5 rounded-xl font-medium transition-all duration-200 ${
                viewMode === 'list' 
                  ? 'bg-[var(--color-accent)] text-white shadow-lg shadow-[var(--color-accent-glow)]' 
                  : 'bg-[var(--color-surface)] text-[var(--color-foreground-muted)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-foreground)]'
              }`}
            >
              My List ({list.length})
            </button>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-6">
        {viewMode === 'search' && (
          <>
            <div className="mb-8">
              <SearchBar 
                query={query}
                setQuery={setQuery}
                loading={loading}
                error={searchError}
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
      
      <Dialog open={!!selectedAnime} onOpenChange={(open) => !open && setSelectedAnime(null)}>
        <DialogContent className="relative">
          {selectedAnime && (
            <>
              {selectedAnime.images?.jpg?.large_image_url && (
                <div className="relative mb-6 w-full">
                  <img 
                    src={selectedAnime.images.jpg.large_image_url}
                    alt={selectedAnime.title}
                    className="w-full max-h-[60vh] object-contain rounded-xl"
                  />
                </div>
              )}
              <DialogHeader>
                <DialogTitle>{selectedAnime.title}</DialogTitle>
                <DialogDescription>
                  {selectedAnime.year && `Year: ${selectedAnime.year} • `}
                  {selectedAnime.episodes && `${selectedAnime.episodes} episodes • `}
                  {selectedAnime.score && `★ ${selectedAnime.score}`}
                </DialogDescription>
              </DialogHeader>
              
              {selectedAnime.synopsis && (
                <div className="mb-4">
                  <p className="text-[var(--color-foreground-muted)] text-sm leading-relaxed">{selectedAnime.synopsis}</p>
                </div>
              )}
              
              <StatusDropdown 
                currentStatus={getUserStatus(selectedAnime.mal_id)}
                onStatusChange={(status) => handleStatusChange(selectedAnime, status)}
                isInList={isInList(selectedAnime.mal_id)}
              />
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default App;