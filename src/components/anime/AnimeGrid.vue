<template>
  <section class="anime-grid-section">
    <div v-if="isLoading" class="anime-grid loading-grid">
      <div v-for="index in skeletonCount" :key="index" class="anime-skeleton">
        <q-skeleton type="rect" animation="wave" class="skeleton-cover" />

        <div class="skeleton-content">
          <q-skeleton type="text" animation="wave" class="skeleton-title" />

          <q-skeleton type="text" animation="wave" class="skeleton-meta" />

          <q-skeleton type="rect" animation="wave" class="skeleton-progress" />
        </div>
      </div>
    </div>

    <div v-else-if="hasError" class="anime-grid-state">
      <div class="state-icon state-icon-error">
        <q-icon name="error_outline" size="28px" />
      </div>

      <h3>Unable to load your anime</h3>

      <p>{{ error }}</p>

      <q-btn unelevated no-caps label="Try Again" class="state-button" @click="emit('retry')" />
    </div>

    <div v-else-if="animeList.length === 0" class="anime-grid-state">
      <div class="state-icon">
        <q-icon name="movie_filter" size="28px" />
      </div>

      <h3>{{ emptyTitle }}</h3>

      <p>{{ emptyMessage }}</p>

      <q-btn
        v-if="showCreateButton"
        unelevated
        no-caps
        icon="add"
        label="Add Anime"
        class="state-button"
        @click="emit('create')"
      />
    </div>

    <div v-else class="anime-grid">
      <AnimeCard v-for="anime in animeList" :key="anime.id" :anime="anime" />
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import AnimeCard from './AnimeCard.vue';
import type { Anime } from '../../types/anime';

interface Props {
  animeList: Anime[];
  isLoading: boolean;
  error?: string;
  emptyTitle?: string;
  emptyMessage?: string;
  showCreateButton?: boolean;
  skeletonCount?: number;
}

const props = withDefaults(defineProps<Props>(), {
  error: '',
  emptyTitle: 'Your anime list is empty',
  emptyMessage: 'Start building your list by adding your first anime.',
  showCreateButton: true,
  skeletonCount: 12,
});

const emit = defineEmits<{
  retry: [];
  create: [];
}>();

const hasError = computed(() => {
  return Boolean(props.error);
});

const emptyTitle = computed(() => {
  return props.emptyTitle;
});

const emptyMessage = computed(() => {
  return props.emptyMessage;
});

const showCreateButton = computed(() => {
  return props.showCreateButton;
});

const skeletonCount = computed(() => {
  return Math.max(1, props.skeletonCount);
});
</script>

<style scoped lang="scss">
.anime-grid-section {
  width: 100%;
}

.anime-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
}

.loading-grid {
  pointer-events: none;
}

.anime-skeleton {
  overflow: hidden;
  border: 1px solid #1f1f1f;
  border-radius: 12px;
  background: #0a0a0a;
}

.skeleton-cover {
  width: 100%;
  aspect-ratio: 3 / 4.3;
  background: #111111;
}

.skeleton-content {
  padding: 13px;
}

.skeleton-title {
  width: 80%;
  margin-bottom: 8px;
  background: #191919;
}

.skeleton-meta {
  width: 55%;
  margin-bottom: 9px;
  background: #161616;
}

.skeleton-progress {
  width: 100%;
  height: 4px;
  border-radius: 999px;
  background: #181818;
}

.anime-grid-state {
  display: flex;
  min-height: 300px;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 48px 24px;
  border: 1px dashed #242424;
  border-radius: 12px;
  background: #090909;
  text-align: center;
}

.state-icon {
  display: flex;
  width: 54px;
  height: 54px;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  border: 1px solid rgba(139, 92, 246, 0.18);
  border-radius: 12px;
  background: rgba(139, 92, 246, 0.07);
  color: #a78bfa;
}

.state-icon-error {
  border-color: rgba(239, 68, 68, 0.18);
  background: rgba(239, 68, 68, 0.06);
  color: #fca5a5;
}

.anime-grid-state h3 {
  margin: 0 0 7px;
  color: #e5e5e5;
  font-size: 15px;
  font-weight: 700;
}

.anime-grid-state p {
  max-width: 390px;
  margin: 0 0 20px;
  color: #666666;
  font-size: 12px;
  line-height: 1.6;
}

.state-button {
  min-height: 38px;
  padding: 0 16px;
  border: 1px solid #8b5cf6;
  border-radius: 8px;
  background: #8b5cf6;
  color: #ffffff;
  font-size: 11px;
  font-weight: 700;
  transition:
    background-color 180ms ease,
    border-color 180ms ease,
    transform 180ms ease,
    box-shadow 180ms ease;
}

.state-button:hover {
  border-color: #a78bfa;
  background: #7c3aed;
  box-shadow: 0 8px 24px rgba(139, 92, 246, 0.14);
  transform: translateY(-1px);
}

@media (max-width: 1200px) {
  .anime-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 800px) {
  .anime-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
  }
}

@media (max-width: 420px) {
  .anime-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 9px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .state-button {
    transition: none;
  }
}
</style>
