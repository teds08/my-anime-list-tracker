<template>
  <q-btn
    flat
    round
    dense
    :icon="isFavorite ? 'favorite' : 'favorite_border'"
    class="favorite-button"
    :class="{
      'favorite-button-active': isFavorite,
    }"
    :loading="loading"
    :disable="loading"
    :aria-label="isFavorite ? 'Remove from favorites' : 'Add to favorites'"
    @click.stop="handleClick"
  >
    <q-tooltip>
      {{ isFavorite ? 'Remove from favorites' : 'Add to favorites' }}
    </q-tooltip>
  </q-btn>
</template>

<script setup lang="ts">
interface Props {
  isFavorite: boolean;
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
});

const emit = defineEmits<{
  toggle: [isFavorite: boolean];
}>();

function handleClick() {
  emit('toggle', !props.isFavorite);
}
</script>

<style scoped lang="scss">
.favorite-button {
  width: 34px;
  height: 34px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  background: rgba(5, 5, 5, 0.76);
  color: #a3a3a3;
  transition:
    color 180ms ease,
    border-color 180ms ease,
    background-color 180ms ease,
    transform 180ms ease;
  backdrop-filter: blur(7px);
}

.favorite-button:hover {
  border-color: rgba(139, 92, 246, 0.35);
  background: rgba(5, 5, 5, 0.92);
  color: #c4b5fd;
  transform: scale(1.04);
}

.favorite-button-active {
  border-color: rgba(139, 92, 246, 0.3);
  background: rgba(139, 92, 246, 0.1);
  color: #a78bfa;
}

.favorite-button-active:hover {
  border-color: rgba(139, 92, 246, 0.42);
  background: rgba(139, 92, 246, 0.14);
  color: #c4b5fd;
}

@media (prefers-reduced-motion: reduce) {
  .favorite-button {
    transition: none;
  }
}
</style>
