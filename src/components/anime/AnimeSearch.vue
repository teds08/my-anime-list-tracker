<template>
  <div class="anime-search">
    <q-input
      :model-value="modelValue"
      outlined
      dense
      dark
      clearable
      type="search"
      placeholder="Search anime..."
      aria-label="Search anime"
      class="search-input"
      @update:model-value="handleInput"
      @clear="handleClear"
    >
      <template #prepend>
        <q-icon name="search" size="18px" />
      </template>

      <template #append>
        <q-icon
          v-if="modelValue"
          name="close"
          size="16px"
          class="search-clear-icon"
          role="button"
          tabindex="0"
          aria-label="Clear search"
          @click="handleClear"
          @keydown.enter="handleClear"
        />
      </template>
    </q-input>
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue: string;
}

defineProps<Props>();

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

function handleInput(value: string | number | null) {
  emit('update:modelValue', String(value ?? ''));
}

function handleClear() {
  emit('update:modelValue', '');
}
</script>

<style scoped lang="scss">
.anime-search {
  width: 100%;
  min-width: 0;
}

.search-input {
  width: 100%;
}

:deep(.search-input .q-field__control) {
  min-height: 42px;
  border-radius: 9px;
  background: #0b0b0b;
}

:deep(.search-input .q-field__control::before) {
  border-color: #242424;
}

:deep(.search-input .q-field__control:hover::before) {
  border-color: #343434;
}

:deep(.search-input.q-field--focused .q-field__control::after) {
  border-color: #8b5cf6;
}

:deep(.search-input .q-field__native) {
  color: #e5e5e5;
  font-size: 12px;
}

:deep(.search-input .q-field__native::placeholder) {
  color: #525252;
  opacity: 1;
}

:deep(.search-input .q-field__prepend) {
  color: #626262;
}

:deep(.search-input.q-field--focused .q-field__prepend) {
  color: #a78bfa;
}

.search-clear-icon {
  color: #555555;
  cursor: pointer;
  transition: color 180ms ease;
}

.search-clear-icon:hover {
  color: #a3a3a3;
}

.search-clear-icon:focus-visible {
  color: #c4b5fd;
}

@media (max-width: 480px) {
  :deep(.search-input .q-field__native) {
    font-size: 11px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .search-clear-icon {
    transition: none;
  }
}
</style>
