<template>
  <section class="anime-details">
    <div class="details-cover-column">
      <div class="details-cover-wrapper">
        <img
          :src="anime.cover_image"
          :alt="`${anime.title} cover`"
          class="details-cover"
          @error="handleImageError"
        />

        <div class="details-cover-overlay"></div>
      </div>

      <div class="cover-status">
        <AnimeStatusBadge :status="anime.status" />
      </div>
    </div>

    <div class="details-content">
      <div class="details-heading">
        <div class="details-title-group">
          <p class="details-eyebrow">ANIME DETAILS</p>

          <h1 class="details-title">
            {{ anime.title }}
          </h1>
        </div>

        <AnimeFavoriteButton
          :is-favorite="anime.is_favorite"
          :loading="isUpdatingFavorite === anime.id"
          @toggle="handleFavorite"
        />
      </div>

      <div class="details-description">
        <p>
          {{ anime.description || 'No description available.' }}
        </p>
      </div>

      <div class="details-divider"></div>

      <div class="details-progress">
        <div class="section-heading">
          <span>Watching Progress</span>
        </div>

        <AnimeProgress
          :current-episode="anime.current_episode"
          :total-episodes="anime.total_episodes"
          :disabled="isUpdatingProgress === anime.id"
          @update:current-episode="handleProgressUpdate"
        />
      </div>

      <div class="details-meta">
        <div class="meta-item">
          <span class="meta-label">Status</span>

          <AnimeStatusBadge :status="anime.status" />
        </div>

        <div class="meta-item">
          <span class="meta-label">Episodes</span>

          <span class="meta-value">
            {{ anime.total_episodes }}
          </span>
        </div>

        <div class="meta-item">
          <span class="meta-label">Current Episode</span>

          <span class="meta-value">
            {{ anime.current_episode }}
          </span>
        </div>

        <div v-if="anime.website_url" class="meta-item">
          <span class="meta-label">Website</span>

          <a
            :href="anime.website_url"
            target="_blank"
            rel="noopener noreferrer"
            class="website-link"
          >
            Visit website
            <q-icon name="open_in_new" size="14px" />
          </a>
        </div>
      </div>

      <div v-if="anime.created_at || anime.updated_at" class="details-timestamps">
        <span v-if="anime.created_at"> Added {{ formatDate(anime.created_at) }} </span>

        <span v-if="anime.updated_at && anime.updated_at !== anime.created_at">
          Updated {{ formatDate(anime.updated_at) }}
        </span>
      </div>

      <div class="details-actions">
        <q-btn
          unelevated
          no-caps
          icon="edit"
          label="Edit"
          class="edit-button"
          :disable="isDeleting"
          @click="emit('edit')"
        />

        <q-btn
          flat
          no-caps
          icon="delete_outline"
          label="Delete"
          class="delete-button"
          :loading="isDeleting"
          :disable="isDeleting"
          @click="emit('delete')"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import AnimeFavoriteButton from './AnimeFavoriteButton.vue';
import AnimeProgress from './AnimeProgress.vue';
import AnimeStatusBadge from './AnimeStatusBadge.vue';

import type { Anime } from '../../types/anime';
import { useAnime } from '../../composables/useAnime';

interface Props {
  anime: Anime;
  isDeleting?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isDeleting: false,
});

const emit = defineEmits<{
  edit: [];
  delete: [];
}>();

const { isUpdatingFavorite, isUpdatingProgress, setFavorite, updateProgress } = useAnime();

const anime = computed(() => props.anime);

const isDeleting = computed(() => props.isDeleting);

async function handleFavorite(isFavorite: boolean) {
  await setFavorite(anime.value.id, isFavorite);
}

async function handleProgressUpdate(currentEpisode: number) {
  if (currentEpisode === anime.value.current_episode) {
    return;
  }

  await updateProgress(anime.value.id, {
    current_episode: currentEpisode,
  });
}

function formatDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
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
.anime-details {
  display: grid;
  grid-template-columns: 260px minmax(0, 1fr);
  gap: 32px;
  width: 100%;
}

.details-cover-column {
  position: relative;
}

.details-cover-wrapper {
  position: relative;
  overflow: hidden;
  aspect-ratio: 3 / 4.3;
  border: 1px solid #252525;
  border-radius: 12px;
  background: #0d0d0d;
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.3);
}

.details-cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.94;
  transition:
    opacity 220ms ease,
    transform 320ms ease;
}

.details-cover-wrapper:hover .details-cover {
  opacity: 1;
  transform: scale(1.018);
}

.details-cover-overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.08), transparent 40%, rgba(0, 0, 0, 0.12));
}

.cover-status {
  position: absolute;
  top: 12px;
  left: 12px;
}

.details-content {
  min-width: 0;
  padding: 2px 0;
}

.details-heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 18px;
}

.details-title-group {
  min-width: 0;
}

.details-eyebrow {
  margin: 0 0 7px;
  color: #a78bfa;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.15em;
}

.details-title {
  margin: 0;
  color: #f5f5f5;
  font-size: clamp(28px, 3vw, 44px);
  font-weight: 800;
  line-height: 1.05;
  letter-spacing: -0.045em;
  overflow-wrap: anywhere;
}

.details-heading :deep(.favorite-button) {
  flex: 0 0 auto;
}

.details-description {
  margin-top: 18px;
}

.details-description p {
  max-width: 760px;
  margin: 0;
  color: #898989;
  font-size: 13px;
  line-height: 1.75;
  white-space: pre-line;
}

.details-divider {
  height: 1px;
  margin: 24px 0;
  background: #1e1e1e;
}

.section-heading {
  margin-bottom: 14px;
  color: #d4d4d4;
  font-size: 12px;
  font-weight: 700;
}

.details-progress {
  max-width: 760px;
}

.details-meta {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin-top: 28px;
  max-width: 760px;
}

.meta-item {
  display: flex;
  min-width: 0;
  min-height: 66px;
  flex-direction: column;
  justify-content: center;
  gap: 7px;
  padding: 12px 13px;
  border: 1px solid #202020;
  border-radius: 9px;
  background: #090909;
}

.meta-label {
  color: #4f4f4f;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.meta-value {
  color: #d4d4d4;
  font-size: 12px;
  font-weight: 650;
}

.website-link {
  display: inline-flex;
  width: fit-content;
  align-items: center;
  gap: 5px;
  color: #a78bfa;
  font-size: 11px;
  font-weight: 650;
  transition: color 180ms ease;
}

.website-link:hover {
  color: #c4b5fd;
}

.details-timestamps {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 16px;
  color: #494949;
  font-size: 9px;
}

.details-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 24px;
}

.edit-button,
.delete-button {
  min-height: 38px;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 700;
  transition:
    background-color 180ms ease,
    border-color 180ms ease,
    color 180ms ease,
    transform 180ms ease;
}

.edit-button {
  padding: 0 16px;
  border: 1px solid #8b5cf6;
  background: #8b5cf6;
  color: #ffffff;
}

.edit-button:hover:not(:disabled) {
  border-color: #a78bfa;
  background: #7c3aed;
  transform: translateY(-1px);
}

.delete-button {
  padding: 0 14px;
  color: #8a8a8a;
}

.delete-button:hover:not(:disabled) {
  background: rgba(239, 68, 68, 0.07);
  color: #fca5a5;
}

@media (max-width: 850px) {
  .anime-details {
    grid-template-columns: 210px minmax(0, 1fr);
    gap: 24px;
  }

  .details-title {
    font-size: 28px;
  }
}

@media (max-width: 680px) {
  .anime-details {
    grid-template-columns: 1fr;
    gap: 22px;
  }

  .details-cover-column {
    width: min(210px, 58vw);
    margin: 0 auto;
  }

  .details-content {
    padding: 0;
  }

  .details-heading {
    align-items: flex-start;
  }

  .details-title {
    font-size: 26px;
  }

  .details-meta {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 420px) {
  .details-heading {
    gap: 10px;
  }

  .details-title {
    font-size: 23px;
  }

  .details-description p {
    font-size: 12px;
  }

  .details-actions {
    width: 100%;
  }

  .edit-button,
  .delete-button {
    flex: 1;
  }
}

@media (prefers-reduced-motion: reduce) {
  .details-cover,
  .website-link,
  .edit-button,
  .delete-button {
    transition: none;
  }
}
</style>
