import { ReactNode } from 'react';
import { AnimeFromApi } from '../types/anime';

const STATUS_BORDER: Record<string, string> = {
  watching: 'border-t-4 border-blue-500',
  completed: 'border-t-4 border-green-500',
  plan_to_watch: 'border-t-4 border-yellow-500',
  on_hold: 'border-t-4 border-orange-500',
  dropped: 'border-t-4 border-red-500',
};

interface AnimeCardProps {
  anime: AnimeFromApi;
  onSelect?: (anime: AnimeFromApi) => void;
  action?: ReactNode;
  titleLanguage?: 'english' | 'japanese' | 'kanji';
  userStatus?: string;
}

export function AnimeCard({ anime, onSelect, action, titleLanguage = 'english', userStatus }: AnimeCardProps) {
  const imageUrl = anime.images?.jpg?.large_image_url;

  // titleLanguage: 'english' = title_english → title (English), 'japanese' = title → title_english (romanized), 'kanji' = title_japanese
  let title = anime.title_english || anime.title || 'Unknown Title';
  if (titleLanguage === 'japanese') {
    title = anime.title || anime.title_english || 'Unknown Title';
  } else if (titleLanguage === 'kanji') {
    title = anime.title_japanese || anime.title_english || anime.title || 'Unknown Title';
  }
  const year = anime.year;
  const episodes = anime.episodes;
  const score = anime.score;

  return (
    <div
      className={`glass-card overflow-hidden cursor-pointer pressable group ${userStatus ? STATUS_BORDER[userStatus] ?? '' : ''}`}
      onClick={() => onSelect?.(anime)}
    >
      <div className="relative overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-56 sm:h-72 md:h-100 object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-56 sm:h-72 md:h-100 bg-[var(--color-bg-elevated)] flex items-center justify-center">
            <span className="text-[var(--color-foreground-muted)]">No Image</span>
          </div>
        )}
        {/* Gradient overlay at bottom of image */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[var(--color-bg-base)] to-transparent" />
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <span className="text-white text-xs font-semibold tracking-wide drop-shadow">View Details</span>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-[var(--color-foreground)] text-sm font-medium line-clamp-2 flex-1">{title}</h3>
          {action}
        </div>
        <div className="flex items-center gap-3 text-[var(--color-foreground-muted)] text-xs mt-2">
          {year && <span className="px-2 py-0.5">{year}</span>}
          {episodes && <span className="px-2 py-0.5">{episodes} eps</span>}
          {score && <span className="px-2 py-0.5 text-[#fbbf24]">★ {score.toFixed(1)}</span>}
        </div>
        {anime.genres && anime.genres.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {anime.genres.slice(0, 2).map((genre) => (
              <span
                key={genre.mal_id}
                className="text-xs px-1.5 py-0.5 rounded bg-[var(--color-surface)] text-[var(--color-foreground-muted)]"
              >
                {genre.name}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
