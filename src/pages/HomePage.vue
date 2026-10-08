<template>
  <q-page class="home-page">
    <div class="home-container">
      <section class="hero-section">
        <video
          class="hero-video"
          autoplay
          muted
          loop
          playsinline
          preload="metadata"
          poster="/images/backgrounds/alt-hero.jpg"
          aria-hidden="true"
        >
          <source src="/videos/guyHalo.mp4" type="video/mp4" />
        </video>

        <div class="hero-overlay"></div>
        <div class="hero-vignette"></div>

        <div class="hero-content">
          <div class="hero-copy">
            <p class="hero-eyebrow">MY ANIME LIST TRACKER</p>

            <h1 class="hero-title">
              My Anime List
              <span>Tracker (ALT)</span>
            </h1>

            <p class="hero-description">
              Keep track of the anime you're watching, the series you've completed, and everything
              waiting on your watch list.
            </p>

            <div class="hero-actions">
              <q-btn
                unelevated
                no-caps
                icon="add"
                label="Add Anime"
                class="hero-primary-button"
                @click="goToCreate"
              />

              <q-btn
                flat
                no-caps
                label="View My List"
                class="hero-secondary-button"
                @click="scrollToAnimeList"
              />
            </div>
          </div>

          <div class="hero-indicator">
            <span class="hero-indicator-line"></span>
            <span>YOUR ANIME JOURNEY</span>
          </div>
        </div>
      </section>

      <section id="anime-list" class="anime-list-section">
        <div class="section-header">
          <div class="section-heading">
            <p class="section-eyebrow">YOUR COLLECTION</p>

            <div class="section-title-row">
              <h2>My Anime</h2>

              <span v-if="pagination.total > 0" class="anime-count">
                {{ pagination.total }}
              </span>
            </div>

            <p class="section-description">Search, filter, and manage your anime list.</p>
          </div>

          <q-btn
            unelevated
            no-caps
            icon="add"
            label="Add Anime"
            class="add-anime-button"
            @click="goToCreate"
          />
        </div>

        <div class="filters-panel">
          <AnimeSearch :model-value="filters.search" @update:model-value="handleSearch" />

          <AnimeFilters :model-value="filters" @update:model-value="handleFiltersChange" />
        </div>

        <div v-if="error && !isLoading" class="list-error">
          <q-icon name="error_outline" size="17px" />

          <span>{{ error }}</span>

          <q-btn flat dense no-caps label="Retry" class="retry-link" @click="loadAnime" />
        </div>

        <AnimeGrid
          :anime-list="animeList"
          :is-loading="isLoading && animeList.length === 0"
          :error="gridError"
          :empty-title="emptyTitle"
          :empty-message="emptyMessage"
          :show-create-button="showCreateButton"
          :skeleton-count="pagination.limit"
          @retry="loadAnime"
          @create="goToCreate"
        />

        <AppPagination
          v-if="pagination.total > 0"
          :page="pagination.page"
          :limit="pagination.limit as PaginationLimit"
          :total="pagination.total"
          :total-pages="pagination.totalPages"
          @update:page="handlePageChange"
          @update:limit="handleLimitChange"
        />
      </section>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import AnimeFilters from '../components/anime/AnimeFilters.vue';
import AnimeGrid from '../components/anime/AnimeGrid.vue';
import AnimeSearch from '../components/anime/AnimeSearch.vue';
import AppPagination from '../components/common/AppPagination.vue';
import { ROUTES } from '../constants/routes';
import { useAnime } from '../composables/useAnime';
import type { AnimeListFilters } from '../types/anime';
import { PAGINATION_LIMITS, type PaginationLimit } from '../types/pagination';

const router = useRouter();

const {
  animeList,
  filters,
  pagination,
  isLoading,
  error,
  fetchAnime,
  setSearch,
  setStatus,
  setFavoritesOnly,
  setPage,
  setLimit,
  clearError,
} = useAnime();

const searchTimer = ref<ReturnType<typeof setTimeout> | null>(null);

const gridError = computed(() => {
  return error.value && animeList.value.length === 0 ? error.value : '';
});

const emptyTitle = computed(() => {
  if (filters.value.search.trim()) {
    return 'No anime found';
  }

  if (filters.value.favoritesOnly) {
    return 'No favorite anime yet';
  }

  if (filters.value.status !== 'All') {
    return `No ${filters.value.status.toLowerCase()} anime`;
  }

  return 'Your anime list is empty';
});

const emptyMessage = computed(() => {
  if (filters.value.search.trim()) {
    return `Nothing matches "${filters.value.search.trim()}". Try a different search or clear your filters.`;
  }

  if (filters.value.favoritesOnly) {
    return 'Mark anime as favorites and they will appear here.';
  }

  if (filters.value.status !== 'All') {
    return `You do not have any anime currently marked as ${filters.value.status}.`;
  }

  return 'Start building your collection by adding your first anime.';
});

const showCreateButton = computed(() => {
  return (
    !filters.value.search.trim() && filters.value.status === 'All' && !filters.value.favoritesOnly
  );
});

async function loadAnime() {
  clearError();
  await fetchAnime();
}

function handleSearch(value: string) {
  setSearch(value);

  if (searchTimer.value) {
    clearTimeout(searchTimer.value);
  }

  searchTimer.value = setTimeout(() => {
    void fetchAnime();
  }, 350);
}

function handleFiltersChange(nextFilters: AnimeListFilters) {
  setStatus(nextFilters.status);
  setFavoritesOnly(nextFilters.favoritesOnly);
  void fetchAnime();
}

function handlePageChange(page: number) {
  setPage(page);
  void fetchAnime();
}

function handleLimitChange(limit: PaginationLimit) {
  if (!PAGINATION_LIMITS.includes(limit)) {
    return;
  }

  setLimit(limit);
  void fetchAnime();
}

function goToCreate() {
  void router.push(ROUTES.ANIME_CREATE);
}

function scrollToAnimeList() {
  document.getElementById('anime-list')?.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  });
}

onMounted(() => {
  void loadAnime();
});

onUnmounted(() => {
  if (searchTimer.value) {
    clearTimeout(searchTimer.value);
  }
});
</script>

<style scoped lang="scss">
.home-page {
  min-height: calc(100vh - 64px);
  background: #050505;
  color: #ffffff;
}

.home-container {
  width: min(100%, 1500px);
  margin: 0 auto;
  padding: 0 28px 48px;
}

.hero-section {
  position: relative;
  min-height: 430px;
  overflow: hidden;
  border-bottom: 1px solid #191919;
  isolation: isolate;
}

.hero-video {
  position: absolute;
  inset: 0;
  z-index: -3;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.58;
  filter: saturate(0.8);
  pointer-events: none;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  z-index: -2;
  background:
    linear-gradient(
      90deg,
      rgba(5, 5, 5, 0.94) 0%,
      rgba(5, 5, 5, 0.74) 38%,
      rgba(5, 5, 5, 0.32) 72%,
      rgba(5, 5, 5, 0.88) 100%
    ),
    linear-gradient(180deg, rgba(5, 5, 5, 0.42) 0%, transparent 40%, rgba(5, 5, 5, 0.95) 100%);
}

.hero-vignette {
  position: absolute;
  inset: 0;
  z-index: -1;
  background: radial-gradient(
    circle at 42% 45%,
    transparent 0%,
    rgba(5, 5, 5, 0.08) 38%,
    rgba(5, 5, 5, 0.66) 100%
  );
  pointer-events: none;
}

.hero-content {
  display: flex;
  min-height: 430px;
  flex-direction: column;
  justify-content: space-between;
  padding: 54px 18px 30px;
}

.hero-copy {
  max-width: 660px;
  margin: auto 0;
  padding: 42px 0;
}

.hero-eyebrow,
.section-eyebrow {
  margin: 0;
  color: #a78bfa;
  font-size: 10px;
  font-weight: 750;
  letter-spacing: 0.17em;
}

.hero-title {
  max-width: 700px;
  margin: 14px 0 18px;
  color: #ffffff;
  font-size: clamp(42px, 5vw, 70px);
  font-weight: 800;
  line-height: 0.98;
  letter-spacing: -0.055em;
}

.hero-title span {
  display: block;
  color: #a78bfa;
}

.hero-description {
  max-width: 500px;
  margin: 0;
  color: #929292;
  font-size: 14px;
  line-height: 1.8;
}

.hero-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 25px;
}

.hero-primary-button,
.hero-secondary-button,
.add-anime-button {
  min-height: 40px;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 700;
  transition:
    background-color 180ms ease,
    border-color 180ms ease,
    color 180ms ease,
    transform 180ms ease,
    box-shadow 180ms ease;
}

.hero-primary-button {
  padding: 0 16px;
  border: 1px solid #8b5cf6;
  background: #8b5cf6;
  color: #ffffff;
}

.hero-primary-button:hover {
  border-color: #a78bfa;
  background: #7c3aed;
  box-shadow: 0 10px 28px rgba(139, 92, 246, 0.16);
  transform: translateY(-1px);
}

.hero-secondary-button {
  padding: 0 14px;
  border: 1px solid #2a2a2a;
  background: rgba(10, 10, 10, 0.52);
  color: #a3a3a3;
}

.hero-secondary-button:hover {
  border-color: #3a3a3a;
  background: rgba(15, 15, 15, 0.75);
  color: #e5e5e5;
  transform: translateY(-1px);
}

.hero-indicator {
  display: flex;
  align-items: center;
  gap: 9px;
  color: #4e4e4e;
  font-size: 8px;
  font-weight: 700;
  letter-spacing: 0.13em;
}

.hero-indicator-line {
  width: 28px;
  height: 1px;
  background: #343434;
}

.anime-list-section {
  padding-top: 34px;
  scroll-margin-top: 76px;
}

.section-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 20px;
}

.section-heading {
  min-width: 0;
}

.section-title-row {
  display: flex;
  align-items: center;
  gap: 9px;
  margin-top: 6px;
}

.section-title-row h2 {
  margin: 0;
  color: #f5f5f5;
  font-size: 23px;
  font-weight: 750;
  line-height: 1.2;
  letter-spacing: -0.03em;
}

.anime-count {
  display: inline-flex;
  min-width: 22px;
  height: 20px;
  align-items: center;
  justify-content: center;
  padding: 0 6px;
  border: 1px solid #252525;
  border-radius: 6px;
  background: #0e0e0e;
  color: #666666;
  font-size: 9px;
  font-weight: 700;
}

.section-description {
  margin: 5px 0 0;
  color: #5c5c5c;
  font-size: 11px;
}

.add-anime-button {
  padding: 0 15px;
  border: 1px solid #8b5cf6;
  background: #8b5cf6;
  color: #ffffff;
}

.add-anime-button:hover {
  border-color: #a78bfa;
  background: #7c3aed;
  box-shadow: 0 8px 24px rgba(139, 92, 246, 0.13);
  transform: translateY(-1px);
}

.filters-panel {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 18px;
  padding: 14px;
  border: 1px solid #1d1d1d;
  border-radius: 10px;
  background: #080808;
}

.list-error {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  padding: 10px 12px;
  border: 1px solid rgba(239, 68, 68, 0.18);
  border-radius: 8px;
  background: rgba(239, 68, 68, 0.05);
  color: #fca5a5;
  font-size: 11px;
}

.retry-link {
  min-height: auto;
  margin-left: auto;
  color: #c4b5fd;
  font-size: 10px;
  font-weight: 700;
}

@media (max-width: 900px) {
  .home-container {
    padding: 0 18px 38px;
  }

  .hero-section,
  .hero-content {
    min-height: 390px;
  }

  .hero-content {
    padding: 42px 12px 25px;
  }

  .section-header {
    align-items: flex-start;
  }
}

@media (max-width: 600px) {
  .home-container {
    padding: 0 12px 30px;
  }

  .hero-section,
  .hero-content {
    min-height: 420px;
  }

  .hero-video {
    opacity: 0.44;
  }

  .hero-overlay {
    background:
      linear-gradient(
        90deg,
        rgba(5, 5, 5, 0.9) 0%,
        rgba(5, 5, 5, 0.67) 60%,
        rgba(5, 5, 5, 0.9) 100%
      ),
      linear-gradient(180deg, rgba(5, 5, 5, 0.4) 0%, transparent 38%, rgba(5, 5, 5, 0.97) 100%);
  }

  .hero-content {
    padding: 30px 8px 22px;
  }

  .hero-copy {
    padding: 35px 0;
  }

  .hero-title {
    font-size: clamp(37px, 11vw, 52px);
  }

  .hero-description {
    font-size: 12px;
  }

  .hero-actions {
    flex-wrap: wrap;
  }

  .section-header {
    flex-direction: column;
  }

  .add-anime-button {
    width: 100%;
  }

  .filters-panel {
    padding: 10px;
  }
}

@media (max-width: 420px) {
  .hero-primary-button,
  .hero-secondary-button {
    flex: 1;
  }

  .section-title-row h2 {
    font-size: 21px;
  }

  .section-description {
    font-size: 10px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero-primary-button,
  .hero-secondary-button,
  .add-anime-button {
    transition: none;
  }

  .hero-video {
    display: none;
  }

  .hero-section {
    background: url('/images/backgrounds/alt-hero.jpg') center / cover no-repeat;
  }
}
</style>
