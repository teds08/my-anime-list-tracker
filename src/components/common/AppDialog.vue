<template>
  <q-dialog
    :model-value="modelValue"
    :persistent="persistent"
    @update:model-value="handleModelUpdate"
  >
    <q-card class="app-dialog">
      <q-card-section class="dialog-header">
        <div class="dialog-heading">
          <p v-if="eyebrow" class="dialog-eyebrow">
            {{ eyebrow }}
          </p>

          <h2 class="dialog-title">
            {{ title }}
          </h2>

          <p v-if="description" class="dialog-description">
            {{ description }}
          </p>
        </div>

        <q-btn
          flat
          round
          dense
          icon="close"
          class="dialog-close"
          aria-label="Close dialog"
          :disable="loading"
          @click="closeDialog"
        />
      </q-card-section>

      <q-separator />

      <q-card-section class="dialog-body">
        <slot />
      </q-card-section>

      <q-separator v-if="$slots.actions" />

      <q-card-actions v-if="$slots.actions" align="right" class="dialog-actions">
        <slot name="actions" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
interface Props {
  modelValue: boolean;
  title: string;
  description?: string;
  eyebrow?: string;
  persistent?: boolean;
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  description: '',
  eyebrow: '',
  persistent: false,
  loading: false,
});

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  close: [];
}>();

function handleModelUpdate(value: boolean) {
  emit('update:modelValue', value);
}

function closeDialog() {
  if (props.loading) {
    return;
  }

  emit('update:modelValue', false);
  emit('close');
}
</script>

<style scoped lang="scss">
.app-dialog {
  width: min(100%, 460px);
  overflow: hidden;
  border: 1px solid #292929;
  border-radius: 12px;
  background: #0b0b0b;
  color: #ffffff;
  box-shadow:
    0 24px 70px rgba(0, 0, 0, 0.55),
    0 0 0 1px rgba(255, 255, 255, 0.015);
}

.dialog-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 18px;
  padding: 20px 20px 17px;
}

.dialog-heading {
  min-width: 0;
}

.dialog-eyebrow {
  margin: 0 0 6px;
  color: #a78bfa;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.14em;
}

.dialog-title {
  margin: 0;
  color: #f5f5f5;
  font-size: 17px;
  font-weight: 700;
  line-height: 1.3;
  letter-spacing: -0.015em;
}

.dialog-description {
  max-width: 380px;
  margin: 7px 0 0;
  color: #666666;
  font-size: 11px;
  line-height: 1.6;
}

.dialog-close {
  flex: 0 0 auto;
  color: #666666;
  transition:
    color 180ms ease,
    background-color 180ms ease;
}

.dialog-close:hover:not(:disabled) {
  background: #151515;
  color: #d4d4d4;
}

.app-dialog :deep(.q-separator) {
  background: #1d1d1d;
}

.dialog-body {
  padding: 20px;
}

.dialog-actions {
  min-height: 60px;
  gap: 8px;
  padding: 12px 20px;
}

@media (max-width: 600px) {
  .app-dialog {
    width: calc(100vw - 28px);
    border-radius: 10px;
  }

  .dialog-header {
    padding: 17px 16px 14px;
  }

  .dialog-body {
    padding: 16px;
  }

  .dialog-actions {
    padding: 10px 16px;
  }

  .dialog-title {
    font-size: 16px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .dialog-close {
    transition: none;
  }
}
</style>
