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
    <div className="flex flex-wrap gap-2 mb-6">
      {FILTERS.map(filter => (
        <button
          key={filter.value}
          onClick={() => onFilterChange(filter.value)}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
            currentFilter === filter.value
              ? 'bg-[var(--color-accent)] text-white shadow-lg shadow-[var(--color-accent-glow)]'
              : 'bg-[var(--color-surface)] text-[var(--color-foreground-muted)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-foreground)] border border-[var(--color-border)]'
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