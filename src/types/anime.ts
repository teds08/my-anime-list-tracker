export const ANIME_STATUSES = [
  'Watching',
  'Completed',
  'Plan to Watch',
  'On Hold',
  'Dropped',
] as const;

export type AnimeStatus = (typeof ANIME_STATUSES)[number];

export interface Anime {
  id: number;
  title: string;
  description: string;
  cover_image: string;
  total_episodes: number;
  current_episode: number;
  status: AnimeStatus;
  is_favorite: boolean;
  website_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateAnimePayload {
  title: string;
  description: string;
  cover_image: string;
  total_episodes: number;
  status: AnimeStatus;
  is_favorite: boolean;
  website_url?: string;
}

export interface UpdateAnimePayload {
  title: string;
  description: string;
  cover_image: string;
  total_episodes: number;
  status: AnimeStatus;
  is_favorite: boolean;
  website_url?: string;
}

export interface UpdateAnimeProgressPayload {
  progress: number;
}

export interface AnimeListFilters {
  search: string;
  status: AnimeStatus | 'All';
  favoritesOnly: boolean;
}

export interface AnimePagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
