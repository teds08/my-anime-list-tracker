<template>
  <q-page class="anime-create-page">
    <div class="page-container">
      <div class="page-header">
        <div class="page-heading">
          <q-btn
            flat
            round
            dense
            icon="arrow_back"
            class="back-button"
            aria-label="Back to anime list"
            @click="goBack"
          />

          <div>
            <p class="page-eyebrow">YOUR COLLECTION</p>

            <h1>Add Anime</h1>

            <p class="page-description">Add a new title to your personal anime list.</p>
          </div>
        </div>
      </div>

      <section class="form-panel">
        <AnimeForm
          submit-label="Add Anime"
          :loading="isCreating"
          @submit="handleSubmit"
          @cancel="goBack"
        />
      </section>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

import AnimeForm from '../../components/anime/AnimeForm.vue';
import { ROUTES } from '../../constants/routes';
import { useAnime } from '../../composables/useAnime';
import { useToast } from '../../composables/useToast';
import type { CreateAnimePayload, UpdateAnimePayload } from '../../types/anime';

const router = useRouter();

const { isCreating, createAnime } = useAnime();

const { success, error } = useToast();

async function handleSubmit(payload: CreateAnimePayload | UpdateAnimePayload) {
  if (!isCreatePayload(payload)) {
    return;
  }

  try {
    const anime = await createAnime(payload);

    success(`"${anime.title}" was added to your list.`);

    await router.push(ROUTES.ANIME_DETAILS(anime.id));
  } catch (requestError) {
    error(getErrorMessage(requestError));
  }
}

function isCreatePayload(
  payload: CreateAnimePayload | UpdateAnimePayload,
): payload is CreateAnimePayload {
  return !('id' in payload);
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

  return 'Unable to add the anime. Please try again.';
}

function goBack() {
  void router.push(ROUTES.HOME);
}
</script>

<style scoped lang="scss">
.anime-create-page {
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
