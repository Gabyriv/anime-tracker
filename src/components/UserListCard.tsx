import { useState } from 'react';
import { AnimeStatus, UserAnimeEntry } from '../types/anime';
import { StatusDropdown } from './StatusDropdown';

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
  onRatingChange: (entryId: number, rating: number | null) => void;
  onNotesChange: (entryId: number, notes: string | null) => void;
}

const STATUS_COLORS: Record<AnimeStatus, string> = {
  watching: 'bg-blue-500',
  completed: 'bg-green-500',
  plan_to_watch: 'bg-yellow-500',
  on_hold: 'bg-orange-500',
  dropped: 'bg-red-500'
};

const STATUS_LABELS: Record<AnimeStatus, string> = {
  watching: 'Watching',
  completed: 'Completed',
  plan_to_watch: 'Plan to Watch',
  on_hold: 'On Hold',
  dropped: 'Dropped'
};

export function UserListCard({ 
  entry, 
  onStatusChange, 
  onRemove,
  onEpisodeChange,
  onRatingChange,
  onNotesChange
}: UserListCardProps) {
  const imageUrl = entry.image_url;
  const title = entry.title || 'Unknown Title';
  const year = entry.year;
  const totalEpisodes = entry.episodes;
  const episodesWatched = entry.episodes_watched || 0;
  
  // Star rating display and handling
  const [showRatingPicker, setShowRatingPicker] = useState(false);
  const currentRating = entry.personal_rating;
  
  // Notes handling
  const [notesExpanded, setNotesExpanded] = useState(false);
  const [notesValue, setNotesValue] = useState(entry.personal_notes || '');
  
  const handleRatingClick = () => {
    if (currentRating) {
      // Cycle: clear rating if clicked
      onRatingChange(entry.id, null);
    } else {
      setShowRatingPicker(true);
    }
  };
  
  const handleRatingSelect = (rating: number) => {
    onRatingChange(entry.id, rating);
    setShowRatingPicker(false);
  };
  
  const handleNotesBlur = () => {
    setNotesExpanded(false);
    if (notesValue !== entry.personal_notes) {
      onNotesChange(entry.id, notesValue || null);
    }
  };
  
  // Format episode display
  const episodeDisplay = totalEpisodes 
    ? `${episodesWatched} / ${totalEpisodes} eps`
    : `Ep ${episodesWatched}`;
  
  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg flex flex-row">
      {imageUrl ? (
        <img 
          src={imageUrl} 
          alt={title}
          className="w-24 h-36 object-cover flex-shrink-0"
        />
      ) : (
        <div className="w-24 h-36 bg-gray-700 flex items-center justify-center flex-shrink-0">
          <span className="text-gray-400 text-xs">No Image</span>
        </div>
      )}
      
      <div className="p-3 flex flex-col justify-between flex-grow">
        <div>
          <h3 className="text-white font-medium line-clamp-2">{title}</h3>
          {year && <p className="text-gray-400 text-sm">{year}</p>}
          
          {/* Episode Progress */}
          <div className="flex items-center gap-2 mt-1">
            <span className="text-gray-400 text-xs">{episodeDisplay}</span>
            <input
              type="number"
              min="0"
              value={episodesWatched}
              onChange={(e) => onEpisodeChange(entry.id, parseInt(e.target.value) || 0)}
              className="w-12 bg-gray-700 text-gray-300 text-xs px-1 py-0.5 rounded"
            />
          </div>
          
          {/* Star Rating */}
          <div className="flex items-center gap-1 mt-1 relative">
            {currentRating ? (
              <button
                onClick={handleRatingClick}
                className="text-yellow-400 text-sm hover:text-yellow-300"
              >
                {'★'.repeat(currentRating)}
                <span className="text-gray-500">{'☆'.repeat(10 - currentRating)}</span>
              </button>
            ) : (
              <button
                onClick={handleRatingClick}
                className="text-gray-500 text-sm hover:text-yellow-400"
              >
                ☆☆☆☆☆☆☆☆☆
              </button>
            )}
            {showRatingPicker && (
              <div className="absolute top-6 left-0 bg-gray-700 p-2 rounded shadow-lg z-10 flex flex-wrap gap-1">
                {[1,2,3,4,5,6,7,8,9,10].map(n => (
                  <button
                    key={n}
                    onClick={() => handleRatingSelect(n)}
                    className={`w-6 h-6 rounded-full text-xs ${n <= (currentRating || 0) ? 'text-yellow-400' : 'text-gray-500'} hover:text-yellow-300`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Notes */}
          <div className="mt-1">
            {notesExpanded ? (
              <textarea
                value={notesValue}
                onChange={(e) => setNotesValue(e.target.value)}
                onBlur={handleNotesBlur}
                placeholder="Add notes..."
                className="w-full bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded resize-none h-20"
                autoFocus
              />
            ) : (
              <button
                onClick={() => setNotesExpanded(true)}
                className="text-gray-500 text-xs hover:text-gray-400 truncate block w-full text-left"
              >
                {entry.personal_notes || '+ Add note...'}
              </button>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2 mt-2">
          <span className={`${STATUS_COLORS[entry.status]} text-white text-xs px-2 py-0.5 rounded-full`}>
            {STATUS_LABELS[entry.status]}
          </span>
          
          <button
            onClick={() => onStatusChange(entry.id, entry.status)}
            className="text-gray-400 hover:text-white text-xs"
            title="Change status"
          >
            ↻
          </button>
          
          <button
            onClick={() => onRemove(entry.id)}
            className="text-gray-400 hover:text-red-400 text-xs ml-auto"
            title="Remove from list"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}