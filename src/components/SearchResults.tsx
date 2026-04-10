import { useSearch } from '../hooks/useSearch';
import { AnimeFromApi, AnimeStatus } from '../types/anime';
import { AnimeCard } from './AnimeCard';

interface SearchResultsProps {
  results: AnimeFromApi[];
  onAnimeSelect: (anime: AnimeFromApi) => void;
  onStatusChange?: (anime: AnimeFromApi, status: AnimeStatus) => void;
  isInList?: (malId: number) => boolean;
  getUserStatus?: (malId: number) => AnimeStatus | null;
}

export function SearchResults({ results, onAnimeSelect, onStatusChange, isInList, getUserStatus }: SearchResultsProps) {
  const { query, loading, error } = useSearch();
  
  // Empty states
  if (!query.trim()) {
    return (
      <div className="p-8 text-center">
        <div className="text-gray-400 mb-2">
          <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          Start typing to search for anime
        </div>
      </div>
    );
  }
  
  if (loading) {
    return (
      <div className="p-8 text-center text-gray-400">
        Searching...
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-8 text-center">
        <div className="text-red-400 mb-2">
          <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          {error}
        </div>
      </div>
    );
  }
  
  if (results.length === 0) {
    return (
      <div className="p-8 text-center text-gray-400">
        No anime found for "{query}"
      </div>
    );
  }
  
  return (
    <div className="p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {results.map((anime) => (
        <div key={anime.mal_id} className="relative">
          <AnimeCard 
            anime={anime} 
            onSelect={onAnimeSelect}
          />
          {onStatusChange && isInList && getUserStatus && (
            <div className="absolute top-2 right-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const status = getUserStatus(anime.mal_id) || 'watching';
                  onStatusChange(anime, status);
                }}
                className={`text-xs px-2 py-1 rounded-full ${
                  isInList(anime.mal_id) 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-600/80 text-white hover:bg-gray-500'
                }`}
              >
                {isInList(anime.mal_id) ? 'In List' : '+ Add'}
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}