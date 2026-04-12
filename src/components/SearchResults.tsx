import { useState, useEffect } from 'react';
import { AnimeFromApi, AnimeStatus } from '../types/anime';
import { PaginationInfo, Genre } from '../lib/api';
import { AnimeCard } from './AnimeCard';
import { SearchResultsSkeleton } from './ui/Skeleton';
import { Dropdown, DropdownItem } from './ui/Dropdown';
import { Pagination } from './Pagination';
import { DefaultView } from '../hooks/useSearch';

type TitleLanguage = 'english' | 'japanese' | 'kanji';

const STATUS_OPTIONS: { value: AnimeStatus; label: string; color: string }[] = [
  { value: 'watching', label: 'Watching', color: 'bg-[var(--color-status-watching)]' },
  { value: 'completed', label: 'Completed', color: 'bg-[var(--color-status-completed)]' },
  { value: 'plan_to_watch', label: 'Plan to Watch', color: 'bg-[var(--color-status-plan)]' },
  { value: 'on_hold', label: 'On Hold', color: 'bg-[var(--color-status-onhold)]' },
  { value: 'dropped', label: 'Dropped', color: 'bg-[var(--color-status-dropped)]' }
];

const CATEGORIES = [
  { value: '', label: 'All' },
  { value: 'tv', label: 'TV' },
  { value: 'movie', label: 'Movie' },
  { value: 'ova', label: 'OVA' },
  { value: 'special', label: 'Special' },
  { value: 'ona', label: 'ONA' },
  { value: 'music', label: 'Music' },
];

const DEFAULT_VIEWS: { value: DefaultView; label: string }[] = [
  { value: 'popular', label: 'Popular' },
  { value: 'latest', label: 'Latest' },
  { value: 'seasonal', label: 'Seasonal' },
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
  titleLanguage?: TitleLanguage;
  genres?: Genre[];
  selectedGenreId?: number | null;
  onGenreChange?: (genreId: number | null) => void;
  category?: string;
  onCategoryChange?: (category: string) => void;
  defaultView?: DefaultView;
  onDefaultViewChange?: (view: DefaultView) => void;
}

export function SearchResults({
  query,
  results,
  loading,
  error,
  pagination,
  onPageChange,
  onAnimeSelect,
  onStatusChange,
  isInList,
  getUserStatus,
  titleLanguage = 'english',
  genres = [],
  selectedGenreId = null,
  onGenreChange,
  category = '',
  onCategoryChange,
  defaultView = 'popular',
  onDefaultViewChange
}: SearchResultsProps) {
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  
  const handleStatusChange = (anime: AnimeFromApi, status: AnimeStatus) => {
    onStatusChange?.(anime, status);
  };
  
  const handleGenreClick = (genreId: number) => {
    if (onGenreChange) {
      // Single-select: if clicking already selected, clear it; otherwise set new
      onGenreChange(selectedGenreId === genreId ? null : genreId);
    }
  };
  
  const clearAllFilters = () => {
    onGenreChange?.(null);
    onCategoryChange?.('');
  };
  
  const activeFilterCount = (selectedGenreId ? 1 : 0) + (category ? 1 : 0);
  const hasActiveFilters = activeFilterCount > 0;
  
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
    return <SearchResultsSkeleton />;
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
      {/* Mobile Filter Button */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setShowMobileFilters(!showMobileFilters)}
          className="flex items-center gap-2 px-4 py-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg text-sm font-medium"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          {activeFilterCount > 0 ? `Filters (${activeFilterCount})` : 'Filters'}
        </button>
        
        {/* Mobile Filter Panel */}
        {showMobileFilters && (
          <>
            <div className="fixed inset-0 bg-black/30 z-40" onClick={() => setShowMobileFilters(false)} />
            <div className="relative z-50 mt-3 p-4 bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] max-h-[70vh] overflow-y-auto">
            {/* Genres */}
            <div className="mb-4 border-b border-[var(--color-border)] pb-3">
              <h4 className="text-xs font-medium text-[var(--color-foreground-muted)] mb-2 uppercase tracking-wide">Genres</h4>
              <div className="flex flex-wrap gap-1.5">
                {genres.map((genre) => (
                  <button
                    key={genre.mal_id}
                    onClick={() => handleGenreClick(genre.mal_id)}
                    className={`text-xs px-2 py-1 rounded-lg font-medium transition-all duration-200 ${
                      selectedGenreId === genre.mal_id
                        ? 'bg-[var(--color-accent)] text-white'
                        : 'bg-[var(--color-bg-deep)] text-[var(--color-foreground-muted)] hover:bg-[var(--color-surface-hover)]'
                    }`}
                  >
                    {genre.name}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Category */}
            {onCategoryChange && (
              <div className="mb-4 border-b border-[var(--color-border)] pb-3">
                <h4 className="text-xs font-medium text-[var(--color-foreground-muted)] mb-2 uppercase tracking-wide">Type</h4>
                <div className="flex flex-wrap gap-1.5">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.value}
                      onClick={() => onCategoryChange(cat.value)}
                      className={`text-xs px-2.5 py-1.5 rounded-lg font-medium transition-all duration-200 ${
                        category === cat.value
                          ? 'bg-[var(--color-accent)] text-white'
                          : 'bg-[var(--color-bg-deep)] text-[var(--color-foreground-muted)] hover:bg-[var(--color-surface-hover)]'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Default View */}
            {onDefaultViewChange && (
              <div className="mb-4">
                <h4 className="text-xs font-medium text-[var(--color-foreground-muted)] mb-2 uppercase tracking-wide">View</h4>
                <div className="flex items-center gap-1 bg-[var(--color-bg-deep)] rounded-lg p-1 border border-[var(--color-border)]">
                  {DEFAULT_VIEWS.map((view) => (
                    <button
                      key={view.value}
                      onClick={() => onDefaultViewChange(view.value)}
                      className={`text-xs px-2.5 py-1 rounded-md font-medium transition-all duration-200 ${
                        defaultView === view.value
                          ? 'bg-[var(--color-accent)] text-white'
                          : 'text-[var(--color-foreground-muted)] hover:text-[var(--color-foreground)]'
                      }`}
                    >
                      {view.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Clear Filters */}
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="w-full py-2 text-xs text-[var(--color-foreground-muted)] hover:text-[var(--color-foreground)] border border-[var(--color-border)] rounded-lg"
              >
                Clear Filters
              </button>
            )}
            </div>
          </>
        )}
      </div>

      {/* Main Layout: Results + Right Panel */}
      <div className="flex gap-6">
        {/* Results Grid - Left Aligned */}
        <div className="flex-1">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 justify-start">
            {results.map((anime) => {
              const inList = isInList?.(anime.mal_id);
              const userStatus = getUserStatus?.(anime.mal_id);
              const currentStatusOption = STATUS_OPTIONS.find(opt => opt.value === userStatus);
              
              return (
                <AnimeCard 
                  key={anime.mal_id}
                  anime={anime} 
                  onSelect={onAnimeSelect}
                  titleLanguage={titleLanguage}
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
        </div>
        
        {/* Right Panel - Only on lg+ screens */}
        <div className="hidden lg:block w-[260px] flex-shrink-0">
          <div className="sticky top-4 space-y-4">
            {/* Genres Section */}
            <div className="p-4 bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)]">
              <h3 className="text-sm font-semibold mb-3 text-[var(--color-foreground)]">Genres</h3>
              <div className="flex flex-wrap gap-1.5 max-h-[300px] overflow-y-auto">
                {genres.map((genre) => (
                  <button
                    key={genre.mal_id}
                    onClick={() => handleGenreClick(genre.mal_id)}
                    className={`text-xs px-2 py-1 rounded-lg font-medium transition-all duration-200 ${
                      selectedGenreId === genre.mal_id
                        ? 'bg-[var(--color-accent)] text-white shadow-[0_0_12px_rgba(94,106,210,0.4)]'
                        : 'bg-[var(--color-bg-deep)] text-[var(--color-foreground-muted)] hover:bg-[var(--color-surface-hover)]'
                    }`}
                  >
                    {genre.name}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Category Filter */}
            {onCategoryChange && (
              <div className="p-4 bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)]">
                <h3 className="text-sm font-semibold mb-3 text-[var(--color-foreground)]">Type</h3>
                <div className="flex flex-wrap gap-1.5">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.value}
                      onClick={() => onCategoryChange(cat.value)}
                      className={`text-xs px-2.5 py-1.5 rounded-lg font-medium transition-all duration-200 ${
                        category === cat.value
                          ? 'bg-[var(--color-accent)] text-white shadow-[0_0_12px_rgba(94,106,210,0.4)]'
                          : 'bg-[var(--color-bg-deep)] text-[var(--color-foreground-muted)] hover:bg-[var(--color-surface-hover)]'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Default View Selector */}
            {onDefaultViewChange && (
              <div className="p-4 bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)]">
                <h3 className="text-sm font-semibold mb-3 text-[var(--color-foreground)]">View</h3>
                <div className="flex items-center gap-1 bg-[var(--color-bg-deep)] rounded-lg p-1 border border-[var(--color-border)]">
                  {DEFAULT_VIEWS.map((view) => (
                    <button
                      key={view.value}
                      onClick={() => onDefaultViewChange(view.value)}
                      className={`text-xs px-2.5 py-1 rounded-md font-medium transition-all duration-200 ${
                        defaultView === view.value
                          ? 'bg-[var(--color-accent)] text-white'
                          : 'text-[var(--color-foreground-muted)] hover:text-[var(--color-foreground)]'
                      }`}
                    >
                      {view.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Clear Filters */}
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="w-full py-2 text-xs text-[var(--color-foreground-muted)] hover:text-[var(--color-foreground)] border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-surface-hover)] transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}