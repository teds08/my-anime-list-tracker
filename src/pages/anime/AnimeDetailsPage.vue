<template>
  <q-page class="anime-details-page">
    <div
      v-if="anime?.cover_image"
      class="page-background"
      :style="{
        backgroundImage: `url('${anime.cover_image}')`,
      }"
      aria-hidden="true"
    ></div>

    <div v-if="anime?.cover_image" class="page-background-overlay" aria-hidden="true"></div>

    <div v-if="anime?.cover_image" class="page-background-vignette" aria-hidden="true"></div>

    <div class="page-container">
      <div class="page-header">
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
          <p class="page-eyebrow">ANIME</p>

          <h1>Anime Details</h1>
        </div>
      </div>

      <AppLoading v-if="isLoadingDetails" message="Loading anime details..." />

      <AppErrorState
        v-else-if="error"
        title="Unable to load anime"
        :message="error"
        @retry="loadAnime"
      />

      <AppEmptyState
        v-else-if="!anime"
        title="Anime not found"
        message="The anime you're looking for may have been deleted or no longer exists."
        icon="movie"
        action-label="Back to My Anime"
        action-icon="arrow_back"
        @action="goBack"
      />

      <AnimeDetails
        v-else
        :anime="anime"
        :is-deleting="isDeleting"
        @edit="goToEdit"
        @delete="openDeleteDialog"
      />
    </div>

    <AppDialog
      v-model="showDeleteDialog"
      eyebrow="DELETE ANIME"
      title="Delete this anime?"
      description="This action cannot be undone. The anime will be permanently removed from your list."
      :persistent="isDeleting"
      :loading="isDeleting"
    >
      <div class="delete-confirmation">
        <div class="delete-warning-icon">
          <q-icon name="delete_outline" size="22px" />
        </div>

        <div>
          <strong>
            {{ anime?.title || 'This anime' }}
          </strong>

          <p>
            Your progress, favorite state, and other saved information for this anime will be
            removed.
          </p>
        </div>
      </div>

      <template #actions>
        <q-btn
          flat
          no-caps
          label="Cancel"
          class="cancel-button"
          :disable="isDeleting"
          @click="closeDeleteDialog"
        />

        <q-btn
          unelevated
          no-caps
          icon="delete_outline"
          label="Delete"
          class="confirm-delete-button"
          :loading="isDeleting"
          :disable="isDeleting"
          @click="handleDelete"
        />
      </template>
    </AppDialog>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import AnimeDetails from '../../components/anime/AnimeDetails.vue';
import AppDialog from '../../components/common/AppDialog.vue';
import AppEmptyState from '../../components/common/AppEmptyState.vue';
import AppErrorState from '../../components/common/AppErrorState.vue';
import AppLoading from '../../components/common/AppLoading.vue';
import { ROUTES } from '../../constants/routes';
import { useAnime } from '../../composables/useAnime';
import { useToast } from '../../composables/useToast';

const route = useRoute();
const router = useRouter();

const { selectedAnime, isLoadingDetails, isDeleting, error, fetchAnimeById, deleteAnime } =
  useAnime();

const { success, error: showError } = useToast();

const showDeleteDialog = ref(false);

const anime = selectedAnime;

const animeId = Number(route.params.id);

async function loadAnime() {
  if (!Number.isInteger(animeId) || animeId <= 0) {
    showError('Invalid anime ID.');
    return;
  }

  await fetchAnimeById(animeId);
}

function goBack() {
  void router.push(ROUTES.HOME);
}

function goToEdit() {
  if (!anime.value) {
    return;
  }

  void router.push(ROUTES.ANIME_EDIT(anime.value.id));
}

function openDeleteDialog() {
  showDeleteDialog.value = true;
}

function closeDeleteDialog() {
  if (isDeleting.value) {
    return;
  }

  showDeleteDialog.value = false;
}

async function handleDelete() {
  if (!anime.value) {
    return;
  }

  try {
    const deletedTitle = anime.value.title;

    await deleteAnime(anime.value.id);

    showDeleteDialog.value = false;

    success(`"${deletedTitle}" was deleted from your list.`);

    await router.push(ROUTES.HOME);
  } catch (requestError) {
    showError(getErrorMessage(requestError));
  }
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

  return 'Unable to delete the anime. Please try again.';
}

onMounted(() => {
  void loadAnime();
});
</script>

<style scoped lang="scss">
.anime-details-page {
  position: relative;
  min-height: calc(100vh - 64px);
  overflow: hidden;
  background: #050505;
  color: #ffffff;
  isolation: isolate;
}

.page-background {
  position: fixed;
  z-index: -4;
  top: 64px;
  right: 0;
  bottom: 0;
  left: 0;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  filter: blur(1px) saturate(0.65);
  opacity: 0.34;
  transform: scale(1.03);
  pointer-events: none;
}

.page-background-overlay {
  position: fixed;
  z-index: -3;
  top: 64px;
  right: 0;
  bottom: 0;
  left: 0;
  background:
    linear-gradient(
      90deg,
      rgba(5, 5, 5, 0.94) 0%,
      rgba(5, 5, 5, 0.82) 30%,
      rgba(5, 5, 5, 0.68) 62%,
      rgba(5, 5, 5, 0.9) 100%
    ),
    linear-gradient(
      180deg,
      rgba(5, 5, 5, 0.7) 0%,
      rgba(5, 5, 5, 0.38) 35%,
      rgba(5, 5, 5, 0.94) 100%
    );
  pointer-events: none;
}

.page-background-vignette {
  position: fixed;
  z-index: -2;
  top: 64px;
  right: 0;
  bottom: 0;
  left: 0;
  background: radial-gradient(
    circle at 50% 38%,
    transparent 0%,
    rgba(5, 5, 5, 0.1) 34%,
    rgba(5, 5, 5, 0.72) 100%
  );
  pointer-events: none;
}

.page-container {
  position: relative;
  z-index: 1;
  width: min(100%, 1180px);
  margin: 0 auto;
  padding: 30px 28px 50px;
}

.page-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 28px;
}

.back-button {
  flex: 0 0 auto;
  color: #777777;
  transition:
    color 180ms ease,
    background-color 180ms ease;
}

.back-button:hover {
  background: rgba(16, 16, 16, 0.8);
  color: #e0e0e0;
}

.page-eyebrow {
  margin: 0 0 4px;
  color: #a78bfa;
  font-size: 9px;
  font-weight: 750;
  letter-spacing: 0.15em;
}

.page-header h1 {
  margin: 0;
  color: #f0f0f0;
  font-size: 18px;
  font-weight: 700;
  line-height: 1.2;
}

.delete-confirmation {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px;
  border: 1px solid rgba(239, 68, 68, 0.15);
  border-radius: 9px;
  background: rgba(239, 68, 68, 0.045);
}

.delete-warning-icon {
  display: flex;
  width: 40px;
  height: 40px;
  align-items: center;
  justify-content: center;
  flex: 0 0 40px;
  border: 1px solid rgba(239, 68, 68, 0.18);
  border-radius: 8px;
  background: rgba(239, 68, 68, 0.07);
  color: #fca5a5;
}

.delete-confirmation strong {
  display: block;
  color: #e5e5e5;
  font-size: 12px;
  font-weight: 700;
  line-height: 1.4;
  overflow-wrap: anywhere;
}

.delete-confirmation p {
  margin: 5px 0 0;
  color: #686868;
  font-size: 10px;
  line-height: 1.55;
}

.cancel-button,
.confirm-delete-button {
  min-height: 38px;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 700;
  transition:
    background-color 180ms ease,
    border-color 180ms ease,
    color 180ms ease;
}

.cancel-button {
  padding: 0 14px;
  color: #777777;
}

.cancel-button:hover:not(:disabled) {
  background: #151515;
  color: #d4d4d4;
}

.confirm-delete-button {
  padding: 0 15px;
  border: 1px solid #dc2626;
  background: #dc2626;
  color: #ffffff;
}

.confirm-delete-button:hover:not(:disabled) {
  border-color: #ef4444;
  background: #b91c1c;
}

@media (max-width: 680px) {
  .page-container {
    padding: 24px 14px 36px;
  }

  .page-header {
    margin-bottom: 22px;
  }

  .page-background {
    opacity: 0.26;
  }

  .page-background-overlay {
    background: linear-gradient(
      180deg,
      rgba(5, 5, 5, 0.82) 0%,
      rgba(5, 5, 5, 0.7) 42%,
      rgba(5, 5, 5, 0.96) 100%
    );
  }
}

@media (prefers-reduced-motion: reduce) {
  .back-button,
  .cancel-button,
  .confirm-delete-button {
    transition: none;
  }
}
</style>
