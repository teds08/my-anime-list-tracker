<template>
  <div class="app-loading" role="status" aria-live="polite" aria-label="Loading">
    <div class="loading-spinner">
      <q-spinner size="28px" color="primary" />
    </div>

    <p v-if="message" class="loading-message">
      {{ message }}
    </p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  message?: string;
}

withDefaults(defineProps<Props>(), {
  message: '',
});
</script>

<style scoped lang="scss">
.app-loading {
  display: flex;
  min-height: 220px;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 32px 20px;
  color: #8b5cf6;
}

.loading-spinner {
  display: flex;
  width: 54px;
  height: 54px;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(139, 92, 246, 0.16);
  border-radius: 12px;
  background: rgba(139, 92, 246, 0.06);
}

.loading-message {
  margin: 12px 0 0;
  color: #666666;
  font-size: 11px;
  line-height: 1.5;
  text-align: center;
}
</style>
