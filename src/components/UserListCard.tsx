import { useState, useRef, useEffect } from 'react';
import { AnimeStatus, UserAnimeEntry } from '../types/anime';

interface UserListCardProps {
  entry: UserAnimeEntry & {
    mal_id: number;
    title: string;
    image_url: string | null;
    year: number | null;
    episodes: number | null;
  };
  onStatusChange: (entryId: number, status: AnimeStatus) => void;
  onRemove: (entryId: number) => void;
  onEpisodeChange: (entryId: number, episodes: number) => void;
}

const STATUS_OPTIONS: { value: AnimeStatus; label: string; color: string }[] = [
  { value: 'watching', label: 'Watching', color: 'bg-[var(--color-status-watching)]' },
  { value: 'completed', label: 'Completed', color: 'bg-[var(--color-status-completed)]' },
  { value: 'plan_to_watch', label: 'Plan to Watch', color: 'bg-[var(--color-status-plan)]' },
  { value: 'on_hold', label: 'On Hold', color: 'bg-[var(--color-status-onhold)]' },
  { value: 'dropped', label: 'Dropped', color: 'bg-[var(--color-status-dropped)]' }
];

export function UserListCard({ 
  entry, 
  onStatusChange, 
  onRemove,
  onEpisodeChange
}: UserListCardProps) {
  const imageUrl = entry.image_url;
  const title = entry.title || 'Unknown Title';
  const year = entry.year;
  const totalEpisodes = entry.episodes;
  const episodesWatched = entry.episodes_watched || 0;
  
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowStatusDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const currentStatusOption = STATUS_OPTIONS.find(opt => opt.value === entry.status);
  
  const handleStatusChange = (status: AnimeStatus) => {
    onStatusChange(entry.id, status);
    setShowStatusDropdown(false);
  };
  
  const episodeDisplay = totalEpisodes 
    ? `${episodesWatched} / ${totalEpisodes} eps`
    : `Ep ${episodesWatched}`;
  
  return (
    <div className="glass-card flex flex-row overflow-visible">
      {imageUrl ? (
        <img 
          src={imageUrl} 
          alt={title}
          className="w-24 h-36 object-cover flex-shrink-0 rounded-l-2xl"
        />
      ) : (
        <div className="w-24 h-36 bg-[var(--color-bg-elevated)] flex items-center justify-center flex-shrink-0 rounded-l-2xl">
          <span className="text-[var(--color-foreground-muted)] text-xs">No Image</span>
        </div>
      )}
      
      <div className="p-4 flex flex-col justify-between flex-grow overflow-visible">
        <div>
          <h3 className="text-[var(--color-foreground)] font-medium line-clamp-2">{title}</h3>
          {year && <p className="text-[var(--color-foreground-muted)] text-sm mt-1">{year}</p>}
          
          <div className="flex items-center gap-2 mt-2">
            <span className="text-[var(--color-foreground-muted)] text-xs">{episodeDisplay}</span>
            <input
              type="number"
              min="0"
              value={episodesWatched}
              onChange={(e) => onEpisodeChange(entry.id, parseInt(e.target.value) || 0)}
              className="w-12 bg-[var(--color-surface)] text-[var(--color-foreground)] text-xs px-2 py-1 rounded-lg border border-[var(--color-border)] focus:border-[var(--color-accent)] focus:outline-none"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-2 mt-3 overflow-visible">
          <div ref={dropdownRef} className="relative overflow-visible">
            <button
              onClick={() => setShowStatusDropdown(!showStatusDropdown)}
              className={`${currentStatusOption?.color || 'bg-[var(--color-surface)]'} text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-all duration-200 hover:opacity-90`}
            >
              {currentStatusOption?.label || 'Unknown'}
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {showStatusDropdown && (
              <div className="absolute bottom-full mb-2 left-0 bg-[var(--color-bg-elevated)] rounded-xl shadow-xl py-1 z-[100] min-w-[140px] border border-[var(--color-border)]">
                {STATUS_OPTIONS.map(option => (
                  <button
                    key={option.value}
                    onClick={() => handleStatusChange(option.value)}
                    className={`block w-full text-left px-4 py-2.5 text-sm text-[var(--color-foreground)] hover:bg-[var(--color-surface)] transition-colors ${option.value === entry.status ? 'bg-[var(--color-surface)]' : ''}`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <button
            onClick={() => onRemove(entry.id)}
            className="text-[var(--color-foreground-muted)] hover:text-red-400 text-xs ml-auto p-2 rounded-lg hover:bg-[var(--color-surface)] transition-colors"
            title="Remove from list"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}