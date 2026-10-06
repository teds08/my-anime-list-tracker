import { computed, ref } from 'vue';

import { ANIME_STATUSES, type AnimeListFilters } from '../types/anime';

export function useAnimeFilters() {
  const search = ref('');
  const status = ref<AnimeListFilters['status']>('All');
  const favoritesOnly = ref(false);

  const hasActiveFilters = computed(() => {
    return search.value.trim() !== '' || status.value !== 'All' || favoritesOnly.value;
  });

  const availableStatuses = computed(() => {
    return ['All', ...ANIME_STATUSES] as const;
  });

  function setSearch(value: string) {
    search.value = value;
  }

  function setStatus(value: AnimeListFilters['status']) {
    status.value = value;
  }

  function setFavoritesOnly(value: boolean) {
    favoritesOnly.value = value;
  }

  function toggleFavoritesOnly() {
    favoritesOnly.value = !favoritesOnly.value;
  }

  function clearFilters() {
    search.value = '';
    status.value = 'All';
    favoritesOnly.value = false;
  }

  function getFilters(): AnimeListFilters {
    return {
      search: search.value.trim(),
      status: status.value,
      favoritesOnly: favoritesOnly.value,
    };
  }

  function setFilters(filters: AnimeListFilters) {
    search.value = filters.search;
    status.value = filters.status;
    favoritesOnly.value = filters.favoritesOnly;
  }

  return {
    search,
    status,
    favoritesOnly,
    hasActiveFilters,
    availableStatuses,

    setSearch,
    setStatus,
    setFavoritesOnly,
    toggleFavoritesOnly,
    clearFilters,
    getFilters,
    setFilters,
  };
}
