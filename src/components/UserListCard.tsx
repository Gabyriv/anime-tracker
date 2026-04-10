import { AnimeStatus, UserAnimeEntry } from '../types/anime';
import { StatusDropdown } from './StatusDropdown';

interface UserListCardProps {
  entry: UserAnimeEntry & {
    mal_id: number;
    title: string;
    image_url: string | null;
    year: number | null;
  };
  onStatusChange: (entryId: number, status: AnimeStatus) => void;
  onRemove: (entryId: number) => void;
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

export function UserListCard({ entry, onStatusChange, onRemove }: UserListCardProps) {
  const imageUrl = entry.image_url;
  const title = entry.title || 'Unknown Title';
  const year = entry.year;
  
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
          {entry.personal_rating && (
            <p className="text-yellow-400 text-sm">★ {entry.personal_rating}/10</p>
          )}
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