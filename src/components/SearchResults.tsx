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
  if (results.length === 0) {
    return (
      <div className="p-4 text-center text-gray-400">
        No anime found
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