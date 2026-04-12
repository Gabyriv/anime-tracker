export type AnimeStatus = 'watching' | 'completed' | 'plan_to_watch' | 'on_hold' | 'dropped';

export interface AnimeFromApi {
  mal_id: number;
  title: string;
  title_english: string | null;
  title_japanese: string | null;
  images: {
    jpg: {
      image_url: string;
      small_image_url: string;
      large_image_url: string;
    };
  };
  synopsis: string | null;
  episodes: number | null;
  score: number | null;
  status: string | null;
  year: number | null;
  genres?: { mal_id: number; name: string }[];
}

export interface AnimeInDb {
  id: number;
  mal_id: number;
  title: string;
  image_url: string | null;
  synopsis: string | null;
  episodes: number | null;
  score: number | null;
  status: string | null;
  year: number | null;
  added_at: string;
}

export interface UserAnimeEntry {
  id: number;
  anime_id: number;
  status: AnimeStatus;
  episodes_watched: number;
  personal_rating: number | null;
  personal_notes: string | null;
  updated_at: string;
}