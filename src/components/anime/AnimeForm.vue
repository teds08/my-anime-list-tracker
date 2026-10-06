<template>
  <q-form class="anime-form" @submit.prevent="handleSubmit">
    <div class="form-grid">
      <div class="form-field form-field-full">
        <label for="anime-title">Title</label>

        <q-input
          id="anime-title"
          v-model="form.title"
          outlined
          dense
          dark
          maxlength="150"
          counter
          placeholder="Enter anime title"
          :error="Boolean(errors.title)"
          :error-message="errors.title"
          @update:model-value="clearError('title')"
        />
      </div>

      <div class="form-field form-field-full">
        <label for="anime-description">Description</label>

        <q-input
          id="anime-description"
          v-model="form.description"
          outlined
          dense
          dark
          type="textarea"
          maxlength="5000"
          counter
          autogrow
          placeholder="Enter a description"
          :error="Boolean(errors.description)"
          :error-message="errors.description"
          @update:model-value="clearError('description')"
        />
      </div>

      <div class="form-field form-field-full">
        <label for="anime-cover">Cover Image URL</label>

        <q-input
          id="anime-cover"
          v-model.trim="form.cover_image"
          outlined
          dense
          dark
          type="url"
          placeholder="https://example.com/anime-cover.jpg"
          :error="Boolean(errors.cover_image)"
          :error-message="errors.cover_image"
          @update:model-value="clearError('cover_image')"
        >
          <template #prepend>
            <q-icon name="image" size="18px" />
          </template>
        </q-input>

        <div class="field-hint">Use a publicly accessible image URL.</div>
      </div>

      <div class="form-field">
        <label for="anime-episodes">Total Episodes</label>

        <q-input
          id="anime-episodes"
          v-model.number="form.total_episodes"
          outlined
          dense
          dark
          type="number"
          min="0"
          step="1"
          placeholder="24"
          :error="Boolean(errors.total_episodes)"
          :error-message="errors.total_episodes"
          @update:model-value="clearError('total_episodes')"
        />
      </div>

      <div class="form-field">
        <label for="anime-status">Status</label>

        <q-select
          id="anime-status"
          v-model="form.status"
          outlined
          dense
          dark
          emit-value
          map-options
          :options="statusOptions"
          :error="Boolean(errors.status)"
          :error-message="errors.status"
          popup-content-class="anime-select-menu"
          @update:model-value="clearError('status')"
        />
      </div>

      <div class="form-field form-field-full">
        <label for="anime-website">Website URL</label>

        <q-input
          id="anime-website"
          v-model.trim="form.website_url"
          outlined
          dense
          dark
          type="url"
          placeholder="https://example.com"
          :error="Boolean(errors.website_url)"
          :error-message="errors.website_url"
          @update:model-value="clearError('website_url')"
        >
          <template #prepend>
            <q-icon name="language" size="18px" />
          </template>
        </q-input>
      </div>
    </div>

    <div class="favorite-field">
      <q-toggle v-model="form.is_favorite" color="primary" class="favorite-toggle" />

      <div class="favorite-copy">
        <span class="favorite-title"> Add to favorites </span>

        <span class="favorite-description">
          Keep this anime visible when your favorites filter is active.
        </span>
      </div>
    </div>

    <div v-if="formError" class="form-error" role="alert">
      <q-icon name="error_outline" size="18px" />

      <span>{{ formError }}</span>
    </div>

    <div class="form-actions">
      <q-btn
        flat
        no-caps
        label="Cancel"
        class="cancel-button"
        :disable="loading"
        @click="handleCancel"
      />

      <q-btn
        type="submit"
        unelevated
        no-caps
        :label="submitLabel"
        class="submit-button"
        :loading="loading"
        :disable="loading"
      />
    </div>
  </q-form>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';

import { ANIME_STATUS_OPTIONS } from '../../constants/anime';
import type { Anime, CreateAnimePayload, UpdateAnimePayload } from '../../types/anime';
import {
  validateAnimeDescription,
  validateAnimeTitle,
  validateEpisodeCount,
  validateWebsiteUrl,
} from '../../utils/anime';

interface Props {
  initialValues?: Partial<Anime>;
  submitLabel?: string;
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  submitLabel: 'Save Anime',
  loading: false,
});

const emit = defineEmits<{
  submit: [payload: CreateAnimePayload | UpdateAnimePayload];
  cancel: [];
}>();

const statusOptions = ANIME_STATUS_OPTIONS;

const form = reactive({
  title: props.initialValues?.title ?? '',
  description: props.initialValues?.description ?? '',
  cover_image: props.initialValues?.cover_image ?? '',
  total_episodes: props.initialValues?.total_episodes ?? 0,
  status: props.initialValues?.status ?? 'Plan to Watch',
  is_favorite: props.initialValues?.is_favorite ?? false,
  website_url: props.initialValues?.website_url ?? '',
});

const errors = reactive({
  title: '',
  description: '',
  cover_image: '',
  total_episodes: '',
  status: '',
  website_url: '',
});

const formError = ref('');

function clearError(field: keyof typeof errors) {
  errors[field] = '';
  formError.value = '';
}

function clearErrors() {
  errors.title = '';
  errors.description = '';
  errors.cover_image = '';
  errors.total_episodes = '';
  errors.status = '';
  errors.website_url = '';
  formError.value = '';
}

function validateForm(): boolean {
  clearErrors();

  let valid = true;

  const titleError = validateAnimeTitle(form.title);

  if (titleError) {
    errors.title = titleError;
    valid = false;
  }

  const descriptionError = validateAnimeDescription(form.description);

  if (descriptionError) {
    errors.description = descriptionError;
    valid = false;
  }

  if (!form.cover_image.trim()) {
    errors.cover_image = 'Cover image URL is required.';
    valid = false;
  } else {
    const coverUrlError = validateAnimeUrl(form.cover_image);

    if (coverUrlError) {
      errors.cover_image = coverUrlError;
      valid = false;
    }
  }

  const episodeError = validateEpisodeCount(Number(form.total_episodes));

  if (episodeError) {
    errors.total_episodes = episodeError;
    valid = false;
  }

  if (!form.status) {
    errors.status = 'Status is required.';
    valid = false;
  }

  const websiteError = validateAnimeWebsite(form.website_url);

  if (websiteError) {
    errors.website_url = websiteError;
    valid = false;
  }

  return valid;
}

function validateAnimeUrl(value: string): string | null {
  try {
    const parsedUrl = new URL(value.trim());

    if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
      return 'Cover image URL must use HTTP or HTTPS.';
    }
  } catch {
    return 'Please enter a valid cover image URL.';
  }

  return null;
}

function validateAnimeWebsite(value: string): string | null {
  return validateWebsiteUrl(value);
}

function handleSubmit() {
  if (!validateForm()) {
    return;
  }

  const payload: CreateAnimePayload | UpdateAnimePayload = {
    title: form.title.trim(),
    description: form.description.trim(),
    cover_image: form.cover_image.trim(),
    total_episodes: Number(form.total_episodes),
    status: form.status,
    is_favorite: form.is_favorite,
    ...(form.website_url.trim()
      ? {
          website_url: form.website_url.trim(),
        }
      : {}),
  };

  emit('submit', payload);
}

function handleCancel() {
  if (props.loading) {
    return;
  }

  emit('cancel');
}
</script>

<style scoped lang="scss">
.anime-form {
  width: 100%;
  max-width: 820px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
}

.form-field {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 8px;
}

.form-field-full {
  grid-column: 1 / -1;
}

.form-field > label {
  color: #d4d4d4;
  font-size: 11px;
  font-weight: 650;
}

.field-hint {
  color: #4f4f4f;
  font-size: 9px;
  line-height: 1.4;
}

:deep(.q-field--outlined .q-field__control) {
  min-height: 44px;
  border-radius: 8px;
  background: #0b0b0b;
}

:deep(.q-field--outlined .q-field__control::before) {
  border-color: #242424;
}

:deep(.q-field--outlined .q-field__control:hover::before) {
  border-color: #343434;
}

:deep(.q-field--outlined.q-field--focused .q-field__control::after) {
  border-color: #8b5cf6;
}

:deep(.q-field__native),
:deep(.q-field__prefix),
:deep(.q-field__suffix) {
  color: #e5e5e5;
  font-size: 12px;
}

:deep(.q-field__native::placeholder) {
  color: #4f4f4f;
  opacity: 1;
}

:deep(.q-field__prepend) {
  color: #5e5e5e;
}

:deep(.q-field--focused .q-field__prepend) {
  color: #a78bfa;
}

:deep(.q-field__counter) {
  color: #4f4f4f;
  font-size: 9px;
}

:deep(textarea.q-field__native) {
  min-height: 100px;
  line-height: 1.6;
  resize: vertical;
}

:deep(.q-select .q-field__native) {
  cursor: pointer;
}

.favorite-field {
  display: flex;
  align-items: center;
  gap: 9px;
  margin-top: 20px;
  padding: 12px;
  border: 1px solid #1f1f1f;
  border-radius: 9px;
  background: #090909;
}

.favorite-toggle {
  flex: 0 0 auto;
}

.favorite-copy {
  display: flex;
  min-width: 0;
  flex-direction: column;
}

.favorite-title {
  color: #d4d4d4;
  font-size: 11px;
  font-weight: 650;
}

.favorite-description {
  margin-top: 3px;
  color: #525252;
  font-size: 9px;
  line-height: 1.45;
}

.form-error {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-top: 16px;
  padding: 11px 12px;
  border: 1px solid rgba(239, 68, 68, 0.22);
  border-radius: 8px;
  background: rgba(239, 68, 68, 0.06);
  color: #fca5a5;
  font-size: 11px;
  line-height: 1.5;
}

.form-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 24px;
}

.cancel-button,
.submit-button {
  min-height: 40px;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 700;
  transition:
    color 180ms ease,
    background-color 180ms ease,
    border-color 180ms ease,
    transform 180ms ease,
    box-shadow 180ms ease;
}

.cancel-button {
  padding: 0 15px;
  color: #777777;
}

.cancel-button:hover:not(:disabled) {
  background: #111111;
  color: #d4d4d4;
}

.submit-button {
  padding: 0 18px;
  border: 1px solid #8b5cf6;
  background: #8b5cf6;
  color: #ffffff;
}

.submit-button:hover:not(:disabled) {
  border-color: #a78bfa;
  background: #7c3aed;
  box-shadow: 0 8px 24px rgba(139, 92, 246, 0.14);
  transform: translateY(-1px);
}

@media (max-width: 650px) {
  .form-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .form-field-full {
    grid-column: auto;
  }

  .form-actions {
    width: 100%;
  }

  .cancel-button,
  .submit-button {
    flex: 1;
  }
}

@media (prefers-reduced-motion: reduce) {
  .cancel-button,
  .submit-button {
    transition: none;
  }
}
</style>
