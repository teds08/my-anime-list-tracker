<template>
  <article class="anime-card" tabindex="0" @click="openDetails" @keydown.enter="openDetails">
    <div class="anime-cover-wrapper">
      <img
        :src="anime.cover_image"
        :alt="`${anime.title} cover`"
        class="anime-cover"
        loading="lazy"
        @error="handleImageError"
      />

      <div class="anime-cover-overlay"></div>

      <div class="anime-card-top">
        <q-badge :label="anime.status" class="status-badge" />

        <q-btn
          flat
          round
          dense
          class="favorite-button"
          :class="{
            'favorite-button-active': anime.is_favorite,
            'favorite-button-loading': isUpdatingFavorite === anime.id,
          }"
          :icon="anime.is_favorite ? 'favorite' : 'favorite_border'"
          :loading="isUpdatingFavorite === anime.id"
          :disable="isUpdatingFavorite === anime.id"
          :aria-label="anime.is_favorite ? 'Remove from favorites' : 'Add to favorites'"
          @click.stop="toggleFavorite"
        >
          <q-tooltip>
            {{ anime.is_favorite ? 'Remove from favorites' : 'Add to favorites' }}
          </q-tooltip>
        </q-btn>
      </div>
    </div>

    <div class="anime-content">
      <h3 class="anime-title" :title="anime.title">
        {{ anime.title }}
      </h3>

      <div class="anime-progress-info">
        <span>
          Episode {{ anime.current_episode }} /
          {{ anime.total_episodes }}
        </span>

        <span>{{ progressPercentage }}%</span>
      </div>

      <div class="anime-progress-track">
        <div class="anime-progress-value" :style="{ width: `${progressPercentage}%` }"></div>
      </div>

      <div class="anime-footer">
        <span class="anime-progress-label">
          {{ progressLabel }}
        </span>

        <q-icon name="arrow_forward" size="16px" class="anime-arrow" />
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';

import { ROUTES } from '../../constants/routes';
import { useAnime } from '../../composables/useAnime';
import { calculateProgress, formatEpisodeProgress } from '../../utils/anime';
import type { Anime } from '../../types/anime';

interface Props {
  anime: Anime;
}

const props = defineProps<Props>();

const router = useRouter();

const { isUpdatingFavorite, setFavorite } = useAnime();

const progressPercentage = computed(() => {
  return Math.round(calculateProgress(props.anime.current_episode, props.anime.total_episodes));
});

const progressLabel = computed(() => {
  return formatEpisodeProgress(props.anime);
});

function openDetails() {
  void router.push(ROUTES.ANIME_DETAILS(props.anime.id));
}

async function toggleFavorite() {
  await setFavorite(props.anime.id, !props.anime.is_favorite);
}

function handleImageError(event: Event) {
  const image = event.target;

  if (!(image instanceof HTMLImageElement)) {
    return;
  }

  image.src =
    'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22300%22 height=%22440%22 viewBox=%220 0 300 440%22%3E%3Crect width=%22300%22 height=%22440%22 fill=%22%23101010%22/%3E%3Ctext x=%22150%22 y=%22220%22 fill=%22%23737373%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22 font-family=%22Arial%22 font-size=%2218%22%3ENo Cover%3C/text%3E%3C/svg%3E';
}
</script>

<style scoped lang="scss">
.anime-card {
  position: relative;
  min-width: 0;
  overflow: hidden;
  border: 1px solid #202020;
  border-radius: 12px;
  background: #0a0a0a;
  cursor: pointer;
  outline: none;
  transition:
    border-color 200ms ease,
    background-color 200ms ease,
    transform 200ms ease,
    box-shadow 200ms ease;
}

.anime-card:hover {
  border-color: #343434;
  background: #0d0d0d;
  box-shadow: 0 14px 34px rgba(0, 0, 0, 0.28);
  transform: translateY(-3px);
}

.anime-card:focus-visible {
  border-color: #8b5cf6;
  box-shadow:
    0 0 0 2px rgba(139, 92, 246, 0.18),
    0 14px 34px rgba(0, 0, 0, 0.28);
}

.anime-cover-wrapper {
  position: relative;
  aspect-ratio: 3 / 4.3;
  overflow: hidden;
  background: #101010;
}

.anime-cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.9;
  transition:
    transform 300ms ease,
    opacity 300ms ease;
}

.anime-card:hover .anime-cover {
  opacity: 1;
  transform: scale(1.035);
}

.anime-cover-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0.3) 0%,
    transparent 30%,
    transparent 65%,
    rgba(0, 0, 0, 0.18) 100%
  );
  pointer-events: none;
}

.anime-card-top {
  position: absolute;
  inset: 10px 10px auto;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
}

.status-badge {
  max-width: calc(100% - 42px);
  padding: 5px 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  background: rgba(5, 5, 5, 0.82);
  color: #e5e5e5;
  font-size: 10px;
  font-weight: 650;
  backdrop-filter: blur(7px);
}

.favorite-button {
  width: 34px;
  height: 34px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  background: rgba(5, 5, 5, 0.74);
  color: #b3b3b3;
  transition:
    color 180ms ease,
    border-color 180ms ease,
    background-color 180ms ease,
    transform 180ms ease;
  backdrop-filter: blur(7px);
}

.favorite-button:hover {
  border-color: rgba(139, 92, 246, 0.35);
  background: rgba(5, 5, 5, 0.9);
  color: #c4b5fd;
  transform: scale(1.04);
}

.favorite-button-active {
  border-color: rgba(139, 92, 246, 0.28);
  color: #a78bfa;
}

.favorite-button-loading {
  opacity: 0.75;
}

.anime-content {
  min-width: 0;
  padding: 13px 13px 12px;
}

.anime-title {
  margin: 0 0 10px;
  overflow: hidden;
  color: #f5f5f5;
  font-size: 13px;
  font-weight: 700;
  line-height: 1.35;
  letter-spacing: -0.01em;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.anime-progress-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  color: #8a8a8a;
  font-size: 10px;
  font-weight: 550;
}

.anime-progress-track {
  width: 100%;
  height: 4px;
  margin-top: 7px;
  overflow: hidden;
  border-radius: 999px;
  background: #1b1b1b;
}

.anime-progress-value {
  height: 100%;
  border-radius: inherit;
  background: #8b5cf6;
  box-shadow: 0 0 10px rgba(139, 92, 246, 0.35);
  transition: width 250ms ease;
}

.anime-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-top: 9px;
}

.anime-progress-label {
  overflow: hidden;
  color: #666666;
  font-size: 10px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.anime-arrow {
  flex: 0 0 auto;
  color: #474747;
  transition:
    color 180ms ease,
    transform 180ms ease;
}

.anime-card:hover .anime-arrow {
  color: #a78bfa;
  transform: translateX(2px);
}

@media (max-width: 600px) {
  .anime-content {
    padding: 11px;
  }

  .anime-title {
    font-size: 12px;
  }

  .anime-progress-info,
  .anime-progress-label {
    font-size: 9px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .anime-card,
  .anime-cover,
  .favorite-button,
  .anime-progress-value,
  .anime-arrow {
    transition: none;
  }
}
</style>
