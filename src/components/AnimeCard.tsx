import { AnimeFromApi } from '../types/anime';

interface AnimeCardProps {
  anime: AnimeFromApi;
  onSelect?: (anime: AnimeFromApi) => void;
}

export function AnimeCard({ anime, onSelect }: AnimeCardProps) {
  const imageUrl = anime.images?.jpg?.small_image_url;
  const title = anime.title || 'Unknown Title';
  const year = anime.year;
  
  return (
    <div 
      className="bg-gray-800 rounded-lg overflow-hidden shadow-lg cursor-pointer 
                 transform transition-transform duration-200 hover:scale-105"
      onClick={() => onSelect?.(anime)}
    >
      {imageUrl ? (
        <img 
          src={imageUrl} 
          alt={title}
          className="w-full aspect-[2/3] object-cover"
        />
      ) : (
        <div className="w-full aspect-[2/3] bg-gray-700 flex items-center justify-center">
          <span className="text-gray-400">No Image</span>
        </div>
      )}
      <div className="p-3">
        <h3 className="text-white text-sm font-medium line-clamp-2">{title}</h3>
        {year && <p className="text-gray-400 text-xs mt-1">{year}</p>}
      </div>
    </div>
  );
}