import { ReactNode } from 'react';
import { AnimeFromApi } from '../types/anime';

interface AnimeCardProps {
  anime: AnimeFromApi;
  onSelect?: (anime: AnimeFromApi) => void;
  action?: ReactNode;
  titleLanguage?: 'english' | 'japanese' | 'kanji';
}

export function AnimeCard({ anime, onSelect, action, titleLanguage = 'english' }: AnimeCardProps) {
  const imageUrl = anime.images?.jpg?.large_image_url;
  
  // titleLanguage: 'english' = default, 'japanese' = romanized, 'kanji' = literal Japanese
  let title = anime.title || 'Unknown Title';
  if (titleLanguage === 'japanese' && anime.title_english) {
    title = anime.title_english;
  } else if (titleLanguage === 'kanji' && anime.title_japanese) {
    title = anime.title_japanese;
  }
  const year = anime.year;
  const episodes = anime.episodes;
  const score = anime.score;
  
  return (
    <div 
      className="glass-card overflow-hidden cursor-pointer pressable group"
      onClick={() => onSelect?.(anime)}
    >
      <div className="relative overflow-hidden">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={title}
            className="w-full h-100 object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-100 bg-[var(--color-bg-elevated)] flex items-center justify-center">
            <span className="text-[var(--color-foreground-muted)]">No Image</span>
          </div>
        )}
        {/* Gradient overlay at bottom of image */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[var(--color-bg-base)] to-transparent" />
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
      </div>
    </div>
  );
}
