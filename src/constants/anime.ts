import { ANIME_STATUSES, type AnimeStatus } from '../types/anime';

export const DEFAULT_ANIME_STATUS: AnimeStatus = 'Plan to Watch';

export const ANIME_STATUS_OPTIONS = ANIME_STATUSES.map((status) => ({
  label: status,
  value: status,
}));

export const PAGINATION_OPTIONS = [6, 12, 24, 48] as const;

export const DEFAULT_ANIME_PAGE_SIZE = 12;

export const MIN_EPISODE = 0;

export const MAX_TITLE_LENGTH = 150;

export const MAX_DESCRIPTION_LENGTH = 5000;
