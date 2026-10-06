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
  list: '/anime',
  details: (id: number) => `/anime/${id}`,
  create: '/anime',
  update: (id: number) => `/anime/${id}`,
  delete: (id: number) => `/anime/${id}`,
  favorite: (id: number) => `/anime/${id}/favorite`,
  progress: (id: number) => `/anime/${id}/progress`,
} as const;

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
  const params = new URLSearchParams();

  params.set('page', String(page));
  params.set('limit', String(limit));

  if (filters.search.trim()) {
    params.set('search', filters.search.trim());
  }

  if (filters.status !== 'All') {
    params.set('status', filters.status);
  }

  if (filters.favoritesOnly) {
    params.set('favorite', 'true');
  }

  return apiRequest<PaginatedResponse<Anime>>(`${ANIME_ENDPOINTS.list}?${params.toString()}`, {
    method: 'GET',
    token,
  });
}

export async function getAnimeById(id: number, token: string): Promise<Anime> {
  return apiRequest<Anime>(ANIME_ENDPOINTS.details(id), {
    method: 'GET',
    token,
  });
}

export async function createAnime(payload: CreateAnimePayload, token: string): Promise<Anime> {
  return apiRequest<Anime>(ANIME_ENDPOINTS.create, {
    method: 'POST',
    token,
    body: JSON.stringify(payload),
  });
}

export async function updateAnime(
  id: number,
  payload: UpdateAnimePayload,
  token: string,
): Promise<Anime> {
  return apiRequest<Anime>(ANIME_ENDPOINTS.update(id), {
    method: 'PUT',
    token,
    body: JSON.stringify(payload),
  });
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
  return apiRequest<Anime>(ANIME_ENDPOINTS.favorite(id), {
    method: 'PATCH',
    token,
    body: JSON.stringify({
      is_favorite: isFavorite,
    }),
  });
}

export async function updateAnimeProgress(
  id: number,
  payload: UpdateAnimeProgressPayload,
  token: string,
): Promise<Anime> {
  return apiRequest<Anime>(ANIME_ENDPOINTS.progress(id), {
    method: 'PATCH',
    token,
    body: JSON.stringify(payload),
  });
}
