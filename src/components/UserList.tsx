import { useState, useMemo } from 'react';
import { useAnimeList } from '../hooks/useAnimeList';
import { UserListCard } from './UserListCard';
import { StatusFilter } from './StatusFilter';
import { AnimeStatus } from '../types/anime';

const STATUS_GROUPS: { status: AnimeStatus; label: string }[] = [
  { status: 'watching', label: 'Currently Watching' },
  { status: 'completed', label: 'Completed' },
  { status: 'plan_to_watch', label: 'Plan to Watch' },
  { status: 'on_hold', label: 'On Hold' },
  { status: 'dropped', label: 'Dropped' }
];

export function UserList() {
  const { list, loading, error, updateStatus, removeFromList, updateEpisodeProgress, refresh } = useAnimeList();
  const [currentFilter, setCurrentFilter] = useState<AnimeStatus | 'all'>('all');
  
  // Calculate counts for each status
  const counts = useMemo(() => {
    const c: Record<AnimeStatus | 'all', number> = {
      all: list.length,
      watching: 0,
      completed: 0,
      plan_to_watch: 0,
      on_hold: 0,
      dropped: 0
    };
    list.forEach(entry => {
      if (entry.status && c[entry.status as AnimeStatus] !== undefined) {
        c[entry.status as AnimeStatus]++;
      }
    });
    return c;
  }, [list]);
  
  // Filter list based on current filter
  const filteredList = useMemo(() => {
    if (currentFilter === 'all') return list;
    return list.filter(entry => entry.status === currentFilter);
  }, [list, currentFilter]);
  
  // Group by status for grouped display
  const groupedList = useMemo(() => {
    const groups: Record<AnimeStatus, typeof list> = {
      watching: [],
      completed: [],
      plan_to_watch: [],
      on_hold: [],
      dropped: []
    };
    filteredList.forEach(entry => {
      if (entry.status && groups[entry.status as AnimeStatus]) {
        groups[entry.status as AnimeStatus].push(entry);
      }
    });
    return groups;
  }, [filteredList]);
  
  const handleStatusChange = async (entryId: number, status: AnimeStatus) => {
    await updateStatus(entryId, status);
    refresh();
  };
  
  const handleRemove = async (entryId: number) => {
    await removeFromList(entryId);
    refresh();
  };
  
  const handleEpisodeChange = async (entryId: number, episodes: number) => {
    await updateEpisodeProgress(entryId, episodes);
  };
  
  if (loading) {
    return (
      <div className="p-8 text-center text-[var(--color-foreground-muted)]">
        Loading your list...
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-8 text-center text-red-400">
        Error: {error}
      </div>
    );
  }
  
  if (list.length === 0) {
    return (
      <div className="p-12 text-center">
        <div className="text-[var(--color-foreground-muted)] mb-4 text-lg">Your list is empty</div>
        <div className="text-[var(--color-foreground-muted)]/60 text-sm">Search for anime to add!</div>
      </div>
    );
  }
  
  return (
    <div className="p-4">
      <StatusFilter 
        currentFilter={currentFilter}
        onFilterChange={setCurrentFilter}
        counts={counts}
      />
      
      {currentFilter === 'all' ? (
        // Grouped by status display
        <div className="space-y-8">
          {STATUS_GROUPS.filter(group => groupedList[group.status].length > 0).map(group => (
            <div key={group.status}>
              <h3 className="text-lg font-semibold text-[var(--color-foreground)] mb-4 flex items-center gap-3">
                {group.label}
                <span className="text-sm font-normal text-[var(--color-foreground-muted)]">({groupedList[group.status].length})</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {groupedList[group.status].map((entry: any) => (
                  <UserListCard
                    key={entry.id}
                    entry={entry}
                    onStatusChange={handleStatusChange}
                    onRemove={handleRemove}
                    onEpisodeChange={handleEpisodeChange}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        // Filtered display
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredList.map((entry: any) => (
            <UserListCard
              key={entry.id}
              entry={entry}
              onStatusChange={handleStatusChange}
              onRemove={handleRemove}
              onEpisodeChange={handleEpisodeChange}
            />
          ))}
        </div>
      )}
    </div>
  );
}