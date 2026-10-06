<template>
  <div class="anime-filters">
    <div class="filter-status">
      <q-btn
        v-for="option in statusOptions"
        :key="option.value"
        flat
        no-caps
        :label="option.label"
        class="status-filter-button"
        :class="{
          'status-filter-active': modelValue.status === option.value,
        }"
        @click="selectStatus(option.value)"
      />
    </div>

    <div class="filter-actions">
      <q-btn
        flat
        no-caps
        icon="favorite"
        label="Favorites"
        class="favorites-filter-button"
        :class="{
          'favorites-filter-active': modelValue.favoritesOnly,
        }"
        @click="toggleFavorites"
      />

      <q-btn
        v-if="hasActiveFilters"
        flat
        dense
        no-caps
        icon="close"
        label="Clear"
        class="clear-filter-button"
        @click="clearFilters"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ANIME_STATUSES, type AnimeListFilters } from '../../types/anime';

interface Props {
  modelValue: AnimeListFilters;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  'update:modelValue': [filters: AnimeListFilters];
}>();

const statusOptions = [
  {
    label: 'All',
    value: 'All' as const,
  },
  ...ANIME_STATUSES.map((status) => ({
    label: status,
    value: status,
  })),
];

const hasActiveFilters = props.modelValue.status !== 'All' || props.modelValue.favoritesOnly;

function selectStatus(status: AnimeListFilters['status']) {
  emit('update:modelValue', {
    ...props.modelValue,
    status,
  });
}

function toggleFavorites() {
  emit('update:modelValue', {
    ...props.modelValue,
    favoritesOnly: !props.modelValue.favoritesOnly,
  });
}

function clearFilters() {
  emit('update:modelValue', {
    search: props.modelValue.search,
    status: 'All',
    favoritesOnly: false,
  });
}
</script>

<style scoped lang="scss">
.anime-filters {
  display: flex;
  min-width: 0;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.filter-status {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 4px;
  overflow-x: auto;
  scrollbar-width: none;
}

.filter-status::-webkit-scrollbar {
  display: none;
}

.status-filter-button {
  min-height: 34px;
  padding: 0 10px;
  border: 1px solid transparent;
  border-radius: 7px;
  color: #666666;
  font-size: 10px;
  font-weight: 650;
  white-space: nowrap;
  transition:
    color 180ms ease,
    background-color 180ms ease,
    border-color 180ms ease;
}

.status-filter-button:hover {
  border-color: #242424;
  background: #101010;
  color: #c4c4c4;
}

.status-filter-active {
  border-color: rgba(139, 92, 246, 0.24);
  background: rgba(139, 92, 246, 0.1);
  color: #c4b5fd;
}

.status-filter-active:hover {
  border-color: rgba(139, 92, 246, 0.32);
  background: rgba(139, 92, 246, 0.13);
  color: #c4b5fd;
}

.filter-actions {
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  gap: 4px;
}

.favorites-filter-button,
.clear-filter-button {
  min-height: 34px;
  border: 1px solid #242424;
  border-radius: 7px;
  color: #666666;
  font-size: 10px;
  font-weight: 650;
  transition:
    color 180ms ease,
    background-color 180ms ease,
    border-color 180ms ease;
}

.favorites-filter-button {
  padding: 0 10px;
}

.favorites-filter-button:hover,
.clear-filter-button:hover {
  background: #101010;
  color: #bcbcbc;
}

.favorites-filter-active {
  border-color: rgba(139, 92, 246, 0.24);
  background: rgba(139, 92, 246, 0.1);
  color: #c4b5fd;
}

.favorites-filter-active:hover {
  border-color: rgba(139, 92, 246, 0.32);
  background: rgba(139, 92, 246, 0.13);
  color: #c4b5fd;
}

.clear-filter-button {
  padding: 0 8px;
}

@media (max-width: 900px) {
  .anime-filters {
    align-items: flex-start;
    flex-direction: column;
  }

  .filter-status {
    width: 100%;
  }

  .filter-actions {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .status-filter-button {
    padding: 0 8px;
    font-size: 9px;
  }

  .favorites-filter-button,
  .clear-filter-button {
    font-size: 9px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .status-filter-button,
  .favorites-filter-button,
  .clear-filter-button {
    transition: none;
  }
}
</style>
