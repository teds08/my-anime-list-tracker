<template>
  <div class="error-state" role="alert">
    <div class="error-icon">
      <q-icon :name="icon" size="28px" />
    </div>

    <h3>{{ title }}</h3>

    <p>{{ message }}</p>

    <q-btn
      v-if="showRetry"
      unelevated
      no-caps
      icon="refresh"
      label="Try Again"
      class="retry-button"
      :loading="loading"
      :disable="loading"
      @click="handleRetry"
    />
  </div>
</template>

<script setup lang="ts">
interface Props {
  title?: string;
  message?: string;
  icon?: string;
  showRetry?: boolean;
  loading?: boolean;
}

withDefaults(defineProps<Props>(), {
  title: 'Something went wrong',
  message: 'Unable to complete this request.',
  icon: 'error_outline',
  retryLabel: 'Try Again',
  loading: false,
});

const emit = defineEmits<{
  retry: [];
}>();

function handleRetry() {
  emit('retry');
}
</script>

<style scoped lang="scss">
.error-state {
  display: flex;
  min-height: 280px;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 48px 24px;
  border: 1px dashed rgba(239, 68, 68, 0.2);
  border-radius: 12px;
  background: #090909;
  text-align: center;
}

.error-icon {
  display: flex;
  width: 54px;
  height: 54px;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 12px;
  background: rgba(239, 68, 68, 0.06);
  color: #fca5a5;
}

.error-state h3 {
  margin: 0 0 7px;
  color: #e5e5e5;
  font-size: 15px;
  font-weight: 700;
  line-height: 1.35;
}

.error-state p {
  max-width: 400px;
  margin: 0 0 20px;
  color: #666666;
  font-size: 12px;
  line-height: 1.6;
}

.retry-button {
  min-height: 38px;
  padding: 0 16px;
  border: 1px solid #3a3a3a;
  border-radius: 8px;
  background: #111111;
  color: #d4d4d4;
  font-size: 11px;
  font-weight: 700;
  transition:
    background-color 180ms ease,
    border-color 180ms ease,
    color 180ms ease,
    transform 180ms ease;
}

.retry-button:hover:not(:disabled) {
  border-color: #4a4a4a;
  background: #171717;
  color: #ffffff;
  transform: translateY(-1px);
}

@media (max-width: 480px) {
  .error-state {
    min-height: 240px;
    padding: 36px 18px;
  }

  .error-state h3 {
    font-size: 14px;
  }

  .error-state p {
    font-size: 11px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .retry-button {
    transition: none;
  }
}
</style>
