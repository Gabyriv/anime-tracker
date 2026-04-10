import { AnimeStatus } from '../types/anime';

interface StatusFilterProps {
  currentFilter: AnimeStatus | 'all';
  onFilterChange: (filter: AnimeStatus | 'all') => void;
  counts?: Record<AnimeStatus | 'all', number>;
}

const FILTERS: { value: AnimeStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'watching', label: 'Watching' },
  { value: 'completed', label: 'Completed' },
  { value: 'plan_to_watch', label: 'Plan to Watch' },
  { value: 'on_hold', label: 'On Hold' },
  { value: 'dropped', label: 'Dropped' }
];

export function StatusFilter({ currentFilter, onFilterChange, counts }: StatusFilterProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {FILTERS.map(filter => (
        <button
          key={filter.value}
          onClick={() => onFilterChange(filter.value)}
          className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
            currentFilter === filter.value
              ? 'bg-blue-600 text-white'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          {filter.label}
          {counts && counts[filter.value] !== undefined && (
            <span className="ml-1.5 text-xs opacity-75">({counts[filter.value]})</span>
          )}
        </button>
      ))}
    </div>
  );
}