import { AnimeFromApi, AnimeStatus } from '../types/anime';
import { PaginationInfo } from '../lib/api';
import { AnimeCard } from './AnimeCard';
import { Dropdown, DropdownItem } from './ui/Dropdown';
import { Pagination } from './Pagination';

const STATUS_OPTIONS: { value: AnimeStatus; label: string; color: string }[] = [
  { value: 'watching', label: 'Watching', color: 'bg-[var(--color-status-watching)]' },
  { value: 'completed', label: 'Completed', color: 'bg-[var(--color-status-completed)]' },
  { value: 'plan_to_watch', label: 'Plan to Watch', color: 'bg-[var(--color-status-plan)]' },
  { value: 'on_hold', label: 'On Hold', color: 'bg-[var(--color-status-onhold)]' },
  { value: 'dropped', label: 'Dropped', color: 'bg-[var(--color-status-dropped)]' }
];

interface SearchResultsProps {
  query: string;
  results: AnimeFromApi[];
  loading?: boolean;
  error?: string | null;
  pagination: PaginationInfo;
  onPageChange: (page: number) => void;
  onAnimeSelect: (anime: AnimeFromApi) => void;
  onStatusChange?: (anime: AnimeFromApi, status: AnimeStatus) => void;
  isInList?: (malId: number) => boolean;
  getUserStatus?: (malId: number) => AnimeStatus | null;
}

export function SearchResults({ query, results, loading, error, pagination, onPageChange, onAnimeSelect, onStatusChange, isInList, getUserStatus }: SearchResultsProps) {
  const handleStatusChange = (anime: AnimeFromApi, status: AnimeStatus) => {
    onStatusChange?.(anime, status);
  };
  
  if (!query.trim() && results.length === 0 && !loading) {
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
    <>
      <div className="p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {results.map((anime) => {
          const inList = isInList?.(anime.mal_id);
          const userStatus = getUserStatus?.(anime.mal_id);
          const currentStatusOption = STATUS_OPTIONS.find(opt => opt.value === userStatus);
          
          return (
            <AnimeCard 
              key={anime.mal_id}
              anime={anime} 
              onSelect={onAnimeSelect}
              action={
                onStatusChange && (
                  <Dropdown
                    trigger={
                      <button
                        className={`text-xs p-1.5 rounded-lg transition-all duration-200 ${
                          inList 
                            ? `${currentStatusOption?.color || 'bg-[var(--color-status-watching)]'} text-white` 
                            : 'bg-[var(--color-surface)] text-[var(--color-foreground-muted)] hover:bg-[var(--color-surface-hover)]'
                        }`}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                    }
                  >
                    {STATUS_OPTIONS.map(option => (
                      <DropdownItem
                        key={option.value}
                        onSelect={() => handleStatusChange(anime, option.value)}
                      >
                        {option.label}
                      </DropdownItem>
                    ))}
                  </Dropdown>
                )
              }
            />
          );
        })}
      </div>
      
      <Pagination 
        pagination={pagination} 
        onPageChange={onPageChange} 
        loading={loading} 
      />
    </>
  );
}