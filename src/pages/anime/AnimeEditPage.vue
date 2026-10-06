<template>
  <q-page class="anime-edit-page">
    <div class="page-container">
      <div class="page-header">
        <div class="page-heading">
          <q-btn
            flat
            round
            dense
            icon="arrow_back"
            class="back-button"
            aria-label="Back to anime details"
            @click="goBack"
          />

          <div>
            <p class="page-eyebrow">YOUR COLLECTION</p>

            <h1>Edit Anime</h1>

            <p class="page-description">Update the information for this anime.</p>
          </div>
        </div>
      </div>

      <AppLoading v-if="isLoading" message="Loading anime..." />

      <AppErrorState
        v-else-if="error"
        title="Unable to load anime"
        :message="error"
        @retry="loadAnime"
      />

      <AppEmptyState
        v-else-if="!anime"
        title="Anime not found"
        message="The anime you are trying to edit could not be found."
        icon="movie"
        action-label="Back to My Anime"
        action-icon="arrow_back"
        @action="goBack"
      />

      <section v-else class="form-panel">
        <AnimeForm
          :initial-values="anime"
          submit-label="Save Changes"
          :loading="isUpdating"
          @submit="handleSubmit"
          @cancel="goBack"
        />
      </section>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import AnimeForm from '../../components/anime/AnimeForm.vue';
import AppEmptyState from '../../components/common/AppEmptyState.vue';
import AppErrorState from '../../components/common/AppErrorState.vue';
import AppLoading from '../../components/common/AppLoading.vue';
import { ROUTES } from '../../constants/routes';
import { useAnime } from '../../composables/useAnime';
import { useToast } from '../../composables/useToast';
import type { CreateAnimePayload, UpdateAnimePayload } from '../../types/anime';

const route = useRoute();
const router = useRouter();

const { selectedAnime, isLoading, isUpdating, error, fetchAnimeById, updateAnime } = useAnime();

const { success, error: showError } = useToast();

const anime = computed(() => selectedAnime.value);

const animeId = Number(route.params.id);

async function loadAnime() {
  if (!Number.isInteger(animeId) || animeId <= 0) {
    showError('Invalid anime ID.');
    return;
  }

  await fetchAnimeById(animeId);
}

async function handleSubmit(payload: CreateAnimePayload | UpdateAnimePayload) {
  if (!anime.value) {
    return;
  }

  if (!isUpdatePayload(payload)) {
    return;
  }

  try {
    const updatedAnime = await updateAnime(anime.value.id, payload);

    success(`"${updatedAnime.title}" was updated successfully.`);

    await router.push(ROUTES.ANIME_DETAILS(updatedAnime.id));
  } catch (requestError) {
    showError(getErrorMessage(requestError));
  }
}

function isUpdatePayload(
  payload: CreateAnimePayload | UpdateAnimePayload,
): payload is UpdateAnimePayload {
  return 'id' in payload;
}

function goBack() {
  if (anime.value) {
    void router.push(ROUTES.ANIME_DETAILS(anime.value.id));

    return;
  }

  void router.push(ROUTES.HOME);
}

function getErrorMessage(error: unknown): string {
  if (
    error &&
    typeof error === 'object' &&
    'message' in error &&
    typeof error.message === 'string'
  ) {
    return error.message;
  }

  return 'Unable to update the anime. Please try again.';
}

onMounted(() => {
  void loadAnime();
});
</script>

<style scoped lang="scss">
.anime-edit-page {
  min-height: calc(100vh - 64px);
  background: #050505;
  color: #ffffff;
}

.page-container {
  width: min(100%, 1100px);
  margin: 0 auto;
  padding: 34px 28px 50px;
}

.page-header {
  margin-bottom: 24px;
}

.page-heading {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.back-button {
  flex: 0 0 auto;
  margin-top: 2px;
  color: #6b6b6b;
  transition:
    color 180ms ease,
    background-color 180ms ease;
}

.back-button:hover {
  background: #101010;
  color: #d4d4d4;
}

.page-eyebrow {
  margin: 0 0 6px;
  color: #a78bfa;
  font-size: 9px;
  font-weight: 750;
  letter-spacing: 0.15em;
}

.page-heading h1 {
  margin: 0;
  color: #f5f5f5;
  font-size: 28px;
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -0.035em;
}

.page-description {
  margin: 7px 0 0;
  color: #656565;
  font-size: 11px;
  line-height: 1.6;
}

.form-panel {
  padding: 24px;
  border: 1px solid #1d1d1d;
  border-radius: 12px;
  background: #080808;
}

@media (max-width: 650px) {
  .page-container {
    padding: 24px 14px 35px;
  }

  .page-heading h1 {
    font-size: 24px;
  }

  .form-panel {
    padding: 18px 14px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .back-button {
    transition: none;
  }
}
</style>
