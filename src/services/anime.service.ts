import type {
  Anime,
  AnimeListFilters,
  CreateAnimePayload,
  UpdateAnimePayload,
  UpdateAnimeProgressPayload,
} from '../types/anime';
import type { PaginatedResponse } from '../types/api';
import { apiRequest } from './api';

const ANIME_ENDPOINTS = {
  list: '/api/anime',
  details: (id: number) => `/api/anime/${id}`,
  create: '/api/anime/create',
  update: (id: number) => `/api/anime/${id}`,
  delete: (id: number) => `/api/anime/${id}`,
  favorite: (id: number) => `/api/anime/${id}/favorite`,
  progress: (id: number) => `/api/anime/${id}/progress`,
} as const;

interface BackendAnime {
  id: number;
  user_id: number;
  title: string;
  description: string;
  image_url: string;
  image_public_id: string;
  episodes: number;
  progress: number;
  status: Anime['status'];
  is_favorite: boolean;
  website_url: string | null;
  created_at: string;
  updated_at: string;
}

interface BackendAnimeListResponse {
  message: string;
  data: BackendAnime[];
}

interface BackendAnimeResponse {
  message: string;
  data: BackendAnime;
}

type AnimeFormPayload = {
  title: string;
  description: string;
  cover_image: string;
  total_episodes: number;
  status: Anime['status'];
  is_favorite: boolean;
  website_url?: string;
  cover_image_file?: File;
};

function mapAnime(anime: BackendAnime): Anime {
  return {
    id: anime.id,
    title: anime.title,
    description: anime.description,
    cover_image: anime.image_url,
    total_episodes: anime.episodes,
    current_episode: anime.progress,
    status: anime.status,
    is_favorite: anime.is_favorite,
    website_url: anime.website_url,
    created_at: anime.created_at,
    updated_at: anime.updated_at,
  };
}

function createAnimeFormData(payload: AnimeFormPayload): FormData {
  const formData = new FormData();

  formData.append('title', payload.title);
  formData.append('description', payload.description);
  formData.append('episodes', String(payload.total_episodes));
  formData.append('status', payload.status);
  formData.append('is_favorite', String(payload.is_favorite));

  if (payload.website_url?.trim()) {
    formData.append('website_url', payload.website_url.trim());
  }

  if (payload.cover_image_file) {
    formData.append('image', payload.cover_image_file);
  }

  return formData;
}

export interface GetAnimeParams {
  page: number;
  limit: number;
  filters: AnimeListFilters;
  token: string;
}

export async function getAnime({
  page,
  limit,
  filters,
  token,
}: GetAnimeParams): Promise<PaginatedResponse<Anime>> {
  const response = await apiRequest<BackendAnimeListResponse>(ANIME_ENDPOINTS.list, {
    method: 'GET',
    token,
  });

  let animeList = response.data.map(mapAnime);

  const search = filters.search.trim().toLowerCase();

  if (search) {
    animeList = animeList.filter((anime) => {
      return (
        anime.title.toLowerCase().includes(search) ||
        anime.description.toLowerCase().includes(search)
      );
    });
  }

  if (filters.status !== 'All') {
    animeList = animeList.filter((anime) => anime.status === filters.status);
  }

  if (filters.favoritesOnly) {
    animeList = animeList.filter((anime) => anime.is_favorite);
  }

  const total = animeList.length;
  const totalPages = total > 0 ? Math.ceil(total / limit) : 0;

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  const items = animeList.slice(startIndex, endIndex);

  return {
    items,
    total,
    page,
    limit,
    totalPages,
  };
}

export async function getAnimeById(id: number, token: string): Promise<Anime> {
  const response = await apiRequest<BackendAnimeResponse>(ANIME_ENDPOINTS.details(id), {
    method: 'GET',
    token,
  });

  return mapAnime(response.data);
}

export async function createAnime(
  payload: CreateAnimePayload & {
    cover_image_file?: File;
  },
  token: string,
): Promise<Anime> {
  const formData = createAnimeFormData(payload);

  const response = await apiRequest<BackendAnimeResponse>(ANIME_ENDPOINTS.create, {
    method: 'POST',
    token,
    body: formData,
  });

  return mapAnime(response.data);
}

export async function updateAnime(
  id: number,
  payload: UpdateAnimePayload & {
    cover_image_file?: File;
  },
  token: string,
): Promise<Anime> {
  const formData = createAnimeFormData(payload);

  const response = await apiRequest<BackendAnimeResponse>(ANIME_ENDPOINTS.update(id), {
    method: 'PUT',
    token,
    body: formData,
  });

  return mapAnime(response.data);
}

export async function deleteAnime(id: number, token: string): Promise<void> {
  await apiRequest<unknown>(ANIME_ENDPOINTS.delete(id), {
    method: 'DELETE',
    token,
  });
}

export async function toggleFavorite(
  id: number,
  isFavorite: boolean,
  token: string,
): Promise<Anime> {
  const response = await apiRequest<BackendAnimeResponse>(ANIME_ENDPOINTS.favorite(id), {
    method: 'PATCH',
    token,
    body: JSON.stringify({
      is_favorite: isFavorite,
    }),
  });

  return mapAnime(response.data);
}

export async function updateAnimeProgress(
  id: number,
  payload: UpdateAnimeProgressPayload,
  token: string,
): Promise<Anime> {
  const response = await apiRequest<BackendAnimeResponse>(ANIME_ENDPOINTS.progress(id), {
    method: 'PATCH',
    token,
    body: JSON.stringify(payload),
  });

  return mapAnime(response.data);
}
