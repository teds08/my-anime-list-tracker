import { defineStore } from 'pinia';

import * as animeService from '../services/anime.service';
import type {
  Anime,
  AnimeListFilters,
  CreateAnimePayload,
  UpdateAnimePayload,
  UpdateAnimeProgressPayload,
} from '../types/anime';
import type { PaginationState } from '../types/pagination';
import { useAuthStore } from './auth';

interface AnimeState {
  animeList: Anime[];
  selectedAnime: Anime | null;
  filters: AnimeListFilters;
  pagination: PaginationState;
  isLoading: boolean;
  isLoadingDetails: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  isUpdatingFavorite: number | null;
  isUpdatingProgress: number | null;
  error: string;
}

const DEFAULT_FILTERS: AnimeListFilters = {
  search: '',
  status: 'All',
  favoritesOnly: false,
};

const DEFAULT_PAGINATION: PaginationState = {
  page: 1,
  limit: 12,
  total: 0,
  totalPages: 0,
};

export const useAnimeStore = defineStore('anime', {
  state: (): AnimeState => ({
    animeList: [],
    selectedAnime: null,
    filters: { ...DEFAULT_FILTERS },
    pagination: { ...DEFAULT_PAGINATION },
    isLoading: false,
    isLoadingDetails: false,
    isCreating: false,
    isUpdating: false,
    isDeleting: false,
    isUpdatingFavorite: null,
    isUpdatingProgress: null,
    error: '',
  }),

  actions: {
    getToken(): string {
      const authStore = useAuthStore();

      if (!authStore.token) {
        throw new Error('You are not authenticated.');
      }

      return authStore.token;
    },

    async fetchAnime() {
      this.isLoading = true;
      this.error = '';

      try {
        const response = await animeService.getAnime({
          page: this.pagination.page,
          limit: this.pagination.limit,
          filters: this.filters,
          token: this.getToken(),
        });

        this.animeList = response.items;

        this.pagination.total = response.total;
        this.pagination.totalPages = response.totalPages;
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Unable to load anime.';
      } finally {
        this.isLoading = false;
      }
    },

    async fetchAnimeById(id: number) {
      this.isLoadingDetails = true;
      this.error = '';
      this.selectedAnime = null;

      try {
        this.selectedAnime = await animeService.getAnimeById(id, this.getToken());

        return this.selectedAnime;
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Unable to load anime details.';

        throw error;
      } finally {
        this.isLoadingDetails = false;
      }
    },

    async createAnime(payload: CreateAnimePayload) {
      this.isCreating = true;
      this.error = '';

      try {
        const anime = await animeService.createAnime(payload, this.getToken());

        return anime;
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Unable to create anime.';

        throw error;
      } finally {
        this.isCreating = false;
      }
    },

    async updateAnime(id: number, payload: UpdateAnimePayload) {
      this.isUpdating = true;
      this.error = '';

      try {
        const anime = await animeService.updateAnime(id, payload, this.getToken());

        this.selectedAnime = anime;

        const index = this.animeList.findIndex((item) => item.id === id);

        if (index !== -1) {
          this.animeList[index] = anime;
        }

        return anime;
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Unable to update anime.';

        throw error;
      } finally {
        this.isUpdating = false;
      }
    },

    async deleteAnime(id: number) {
      this.isDeleting = true;
      this.error = '';

      try {
        await animeService.deleteAnime(id, this.getToken());

        this.animeList = this.animeList.filter((anime) => anime.id !== id);

        if (this.selectedAnime?.id === id) {
          this.selectedAnime = null;
        }

        if (this.animeList.length === 0 && this.pagination.page > 1) {
          this.pagination.page -= 1;
        }

        this.pagination.total = Math.max(this.pagination.total - 1, 0);

        return true;
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Unable to delete anime.';

        throw error;
      } finally {
        this.isDeleting = false;
      }
    },

    async setFavorite(id: number, isFavorite: boolean) {
      this.isUpdatingFavorite = id;
      this.error = '';

      const listAnime = this.animeList.find((anime) => anime.id === id);

      const previousListFavorite = listAnime?.is_favorite;

      const previousSelectedFavorite =
        this.selectedAnime?.id === id ? this.selectedAnime.is_favorite : undefined;

      if (listAnime) {
        listAnime.is_favorite = isFavorite;
      }

      if (this.selectedAnime?.id === id) {
        this.selectedAnime.is_favorite = isFavorite;
      }

      try {
        const updatedAnime = await animeService.toggleFavorite(id, isFavorite, this.getToken());

        const index = this.animeList.findIndex((anime) => anime.id === id);

        if (index !== -1) {
          this.animeList[index] = updatedAnime;
        }

        if (this.selectedAnime?.id === id) {
          this.selectedAnime = updatedAnime;
        }

        return updatedAnime;
      } catch (error) {
        if (listAnime && previousListFavorite !== undefined) {
          listAnime.is_favorite = previousListFavorite;
        }

        if (this.selectedAnime?.id === id && previousSelectedFavorite !== undefined) {
          this.selectedAnime.is_favorite = previousSelectedFavorite;
        }

        this.error = error instanceof Error ? error.message : 'Unable to update favorite status.';

        throw error;
      } finally {
        this.isUpdatingFavorite = null;
      }
    },

    async updateProgress(id: number, payload: UpdateAnimeProgressPayload) {
      this.isUpdatingProgress = id;
      this.error = '';

      try {
        const updatedAnime = await animeService.updateAnimeProgress(id, payload, this.getToken());

        const index = this.animeList.findIndex((anime) => anime.id === id);

        if (index !== -1) {
          this.animeList[index] = updatedAnime;
        }

        if (this.selectedAnime?.id === id) {
          this.selectedAnime = updatedAnime;
        }

        return updatedAnime;
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Unable to update anime progress.';

        throw error;
      } finally {
        this.isUpdatingProgress = null;
      }
    },

    setSearch(search: string) {
      this.filters.search = search;
      this.pagination.page = 1;
    },

    setStatus(status: AnimeListFilters['status']) {
      this.filters.status = status;
      this.pagination.page = 1;
    },

    setFavoritesOnly(value: boolean) {
      this.filters.favoritesOnly = value;
      this.pagination.page = 1;
    },

    setPage(page: number) {
      if (page < 1 || (this.pagination.totalPages > 0 && page > this.pagination.totalPages)) {
        return;
      }

      this.pagination.page = page;
    },

    setLimit(limit: number) {
      if (limit <= 0) {
        return;
      }

      this.pagination.limit = limit;
      this.pagination.page = 1;
    },

    resetFilters() {
      this.filters = { ...DEFAULT_FILTERS };
      this.pagination.page = 1;
    },

    clearSelectedAnime() {
      this.selectedAnime = null;
    },

    clearError() {
      this.error = '';
    },
  },
});
