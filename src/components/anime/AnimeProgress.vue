<template>
  <div class="anime-progress">
    <div class="progress-header">
      <div class="episode-count">
        <span class="episode-label">Episode</span>

        <span class="episode-value"> {{ currentEpisode }} / {{ totalEpisodes }} </span>
      </div>

      <span class="progress-percentage"> {{ progressPercentage }}% </span>
    </div>

    <div
      class="progress-track"
      role="progressbar"
      :aria-valuenow="currentEpisode"
      :aria-valuemin="0"
      :aria-valuemax="totalEpisodes"
      :aria-label="`Episode progress: ${currentEpisode} of ${totalEpisodes}`"
    >
      <div class="progress-value" :style="{ width: `${progressPercentage}%` }"></div>
    </div>

    <div class="progress-controls">
      <q-btn
        flat
        round
        dense
        icon="remove"
        class="progress-button"
        :disable="disabled || currentEpisode <= 0"
        aria-label="Previous episode"
        @click="decreaseEpisode"
      />

      <div class="current-episode">
        <span class="current-episode-number">
          {{ currentEpisode }}
        </span>

        <span class="current-episode-caption"> current episode </span>
      </div>

      <q-btn
        flat
        round
        dense
        icon="add"
        class="progress-button"
        :disable="disabled || totalEpisodes <= 0 || currentEpisode >= totalEpisodes"
        aria-label="Next episode"
        @click="increaseEpisode"
      />
    </div>

    <div class="progress-footer">
      <span>
        {{ progressMessage }}
      </span>

      <span v-if="isCompleted" class="completed-label"> Completed </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import { calculateProgress } from '../../utils/anime';

interface Props {
  currentEpisode: number;
  totalEpisodes: number;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
});

const emit = defineEmits<{
  'update:currentEpisode': [episode: number];
}>();

const progressPercentage = computed(() => {
  return Math.round(calculateProgress(props.currentEpisode, props.totalEpisodes));
});

const isCompleted = computed(() => {
  return props.totalEpisodes > 0 && props.currentEpisode >= props.totalEpisodes;
});

const progressMessage = computed(() => {
  if (props.totalEpisodes <= 0) {
    return 'No episode count available';
  }

  if (isCompleted.value) {
    return 'All episodes watched';
  }

  if (props.currentEpisode === 0) {
    return 'Not started yet';
  }

  return `${progressPercentage.value}% completed`;
});

function updateEpisode(episode: number) {
  const maximumEpisode = Math.max(props.totalEpisodes, 0);

  const nextEpisode = Math.min(Math.max(Math.floor(episode), 0), maximumEpisode);

  if (nextEpisode === props.currentEpisode) {
    return;
  }

  emit('update:currentEpisode', nextEpisode);
}

function decreaseEpisode() {
  updateEpisode(props.currentEpisode - 1);
}

function increaseEpisode() {
  updateEpisode(props.currentEpisode + 1);
}
</script>

<style scoped lang="scss">
.anime-progress {
  width: 100%;
}

.progress-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
}

.episode-count {
  display: flex;
  align-items: baseline;
  gap: 6px;
}

.episode-label {
  color: #666666;
  font-size: 11px;
}

.episode-value {
  color: #e5e5e5;
  font-size: 13px;
  font-weight: 700;
}

.progress-percentage {
  color: #a78bfa;
  font-size: 11px;
  font-weight: 700;
}

.progress-track {
  width: 100%;
  height: 6px;
  margin-top: 9px;
  overflow: hidden;
  border-radius: 999px;
  background: #1a1a1a;
}

.progress-value {
  height: 100%;
  min-width: 0;
  border-radius: inherit;
  background: #8b5cf6;
  box-shadow: 0 0 12px rgba(139, 92, 246, 0.34);
  transition: width 220ms ease;
}

.progress-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-top: 18px;
}

.progress-button {
  color: #737373;
  transition:
    color 180ms ease,
    background-color 180ms ease,
    transform 180ms ease;
}

.progress-button:hover:not(:disabled) {
  background: #111111;
  color: #c4b5fd;
  transform: scale(1.04);
}

.current-episode {
  display: flex;
  min-width: 90px;
  align-items: center;
  flex-direction: column;
}

.current-episode-number {
  color: #ffffff;
  font-size: 20px;
  font-weight: 750;
  line-height: 1;
}

.current-episode-caption {
  margin-top: 5px;
  color: #525252;
  font-size: 9px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.progress-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 10px;
  color: #5f5f5f;
  font-size: 10px;
}

.completed-label {
  color: #86efac;
  font-weight: 650;
}

@media (max-width: 480px) {
  .progress-controls {
    gap: 12px;
  }

  .episode-value {
    font-size: 12px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .progress-value,
  .progress-button {
    transition: none;
  }
}
</style>
