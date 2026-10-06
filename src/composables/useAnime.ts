import { computed } from 'vue';

import type {
  AnimeListFilters,
  CreateAnimePayload,
  UpdateAnimePayload,
  UpdateAnimeProgressPayload,
} from '../types/anime';
import { useAnimeStore } from '../stores/anime';

export function useAnime() {
  const animeStore = useAnimeStore();

  const animeList = computed(() => animeStore.animeList);
  const selectedAnime = computed(() => animeStore.selectedAnime);

  const filters = computed(() => animeStore.filters);
  const pagination = computed(() => animeStore.pagination);

  const isLoading = computed(() => animeStore.isLoading);
  const isLoadingDetails = computed(() => animeStore.isLoadingDetails);
  const isCreating = computed(() => animeStore.isCreating);
  const isUpdating = computed(() => animeStore.isUpdating);
  const isDeleting = computed(() => animeStore.isDeleting);

  const isUpdatingFavorite = computed(() => animeStore.isUpdatingFavorite);

  const isUpdatingProgress = computed(() => animeStore.isUpdatingProgress);

  const error = computed(() => animeStore.error);

  async function fetchAnime() {
    return animeStore.fetchAnime();
  }

  async function fetchAnimeById(id: number) {
    return animeStore.fetchAnimeById(id);
  }

  async function createAnime(payload: CreateAnimePayload) {
    return animeStore.createAnime(payload);
  }

  async function updateAnime(id: number, payload: UpdateAnimePayload) {
    return animeStore.updateAnime(id, payload);
  }

  async function deleteAnime(id: number) {
    return animeStore.deleteAnime(id);
  }

  async function setFavorite(id: number, isFavorite: boolean) {
    return animeStore.setFavorite(id, isFavorite);
  }

  async function updateProgress(id: number, payload: UpdateAnimeProgressPayload) {
    return animeStore.updateProgress(id, payload);
  }

  function setSearch(search: string) {
    animeStore.setSearch(search);
  }

  function setStatus(status: AnimeListFilters['status']) {
    animeStore.setStatus(status);
  }

  function setFavoritesOnly(value: boolean) {
    animeStore.setFavoritesOnly(value);
  }

  function setPage(page: number) {
    animeStore.setPage(page);
  }

  function setLimit(limit: number) {
    animeStore.setLimit(limit);
  }

  function resetFilters() {
    animeStore.resetFilters();
  }

  function clearSelectedAnime() {
    animeStore.clearSelectedAnime();
  }

  function clearError() {
    animeStore.clearError();
  }

  return {
    animeList,
    selectedAnime,
    filters,
    pagination,

    isLoading,
    isLoadingDetails,
    isCreating,
    isUpdating,
    isDeleting,
    isUpdatingFavorite,
    isUpdatingProgress,

    error,

    fetchAnime,
    fetchAnimeById,
    createAnime,
    updateAnime,
    deleteAnime,
    setFavorite,
    updateProgress,

    setSearch,
    setStatus,
    setFavoritesOnly,
    setPage,
    setLimit,

    resetFilters,
    clearSelectedAnime,
    clearError,
  };
}
