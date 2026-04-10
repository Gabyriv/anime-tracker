import { useState, useEffect } from 'react';
import { initDb } from './lib/db';
import { useSearch } from './hooks/useSearch';
import { useAnimeList } from './hooks/useAnimeList';
import { SearchBar } from './components/SearchBar';
import { SearchResults } from './components/SearchResults';
import { UserList } from './components/UserList';
import { StatusDropdown } from './components/StatusDropdown';
import { AnimeFromApi, AnimeStatus } from './types/anime';

type ViewMode = 'search' | 'list';

function App() {
  const [dbReady, setDbReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedAnime, setSelectedAnime] = useState<AnimeFromApi | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('search');
  
  const { results, loading } = useSearch();
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

  if (error) return <div className="min-h-screen flex items-center justify-center bg-gray-900 text-red-500">Database Error: {error}</div>;
  if (!dbReady) return <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">Initializing database...</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Anime Tracker</h1>
          
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('search')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                viewMode === 'search' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              Search
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                viewMode === 'list' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              My List ({list.length})
            </button>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4">
        {viewMode === 'search' && (
          <>
            <div className="mb-6">
              <SearchBar />
            </div>
            
            <SearchResults 
              results={results} 
              onAnimeSelect={setSelectedAnime}
              onStatusChange={handleStatusChange}
              isInList={isInList}
              getUserStatus={getUserStatus}
            />
            
            {loading && (
              <div className="text-center py-4 text-gray-400">Loading...</div>
            )}
          </>
        )}
        
        {viewMode === 'list' && (
          <UserList />
        )}
      </main>
      
      {selectedAnime && (
        <div 
          className="fixed inset-0 bg-black/70 flex items-center justify-center p-4"
          onClick={() => setSelectedAnime(null)}
        >
          <div 
            className="bg-gray-800 rounded-lg p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {selectedAnime.images?.jpg?.image_url && (
              <img 
                src={selectedAnime.images.jpg.image_url}
                alt={selectedAnime.title}
                className="w-full h-64 object-cover rounded-lg mb-4"
              />
            )}
            <h2 className="text-2xl font-bold mb-2">{selectedAnime.title}</h2>
            {selectedAnime.year && (
              <p className="text-gray-400 mb-2">Year: {selectedAnime.year}</p>
            )}
            {selectedAnime.episodes && (
              <p className="text-gray-400 mb-2">Episodes: {selectedAnime.episodes}</p>
            )}
            {selectedAnime.score && (
              <p className="text-gray-400 mb-2">Score: {selectedAnime.score}</p>
            )}
            {selectedAnime.status && (
              <p className="text-gray-400 mb-4">Status: {selectedAnime.status}</p>
            )}
            {selectedAnime.synopsis && (
              <div className="mb-4">
                <h3 className="font-semibold mb-1">Synopsis</h3>
                <p className="text-gray-300 text-sm">{selectedAnime.synopsis}</p>
              </div>
            )}
            
            <div className="mt-4">
              <StatusDropdown 
                currentStatus={getUserStatus(selectedAnime.mal_id)}
                onStatusChange={(status) => handleStatusChange(selectedAnime, status)}
                isInList={isInList(selectedAnime.mal_id)}
              />
            </div>
            
            <button
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg w-full"
              onClick={() => setSelectedAnime(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;