<template>
  <div class="empty-state">
    <div class="empty-icon">
      <q-icon :name="icon" size="28px" />
    </div>

    <h3>{{ title }}</h3>

    <p>{{ message }}</p>

    <q-btn
      v-if="actionLabel"
      unelevated
      no-caps
      :icon="actionIcon"
      :label="actionLabel"
      class="empty-action"
      @click="handleAction"
    />
  </div>
</template>

<script setup lang="ts">
interface Props {
  title?: string;
  message?: string;
  icon?: string;
  actionLabel?: string;
  actionIcon?: string;
}

withDefaults(defineProps<Props>(), {
  icon: 'movie',
  actionLabel: '',
  actionIcon: '',
  loading: false,
});

const emit = defineEmits<{
  action: [];
}>();

function handleAction() {
  emit('action');
}
</script>

<style scoped lang="scss">
.empty-state {
  display: flex;
  min-height: 280px;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 48px 24px;
  border: 1px dashed #242424;
  border-radius: 12px;
  background: #090909;
  text-align: center;
}

.empty-icon {
  display: flex;
  width: 54px;
  height: 54px;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  border: 1px solid rgba(139, 92, 246, 0.18);
  border-radius: 12px;
  background: rgba(139, 92, 246, 0.07);
  color: #a78bfa;
}

.empty-state h3 {
  margin: 0 0 7px;
  color: #e5e5e5;
  font-size: 15px;
  font-weight: 700;
  line-height: 1.35;
}

.empty-state p {
  max-width: 400px;
  margin: 0 0 20px;
  color: #666666;
  font-size: 12px;
  line-height: 1.6;
}

.empty-action {
  min-height: 38px;
  padding: 0 16px;
  border: 1px solid #8b5cf6;
  border-radius: 8px;
  background: #8b5cf6;
  color: #ffffff;
  font-size: 11px;
  font-weight: 700;
  transition:
    background-color 180ms ease,
    border-color 180ms ease,
    transform 180ms ease,
    box-shadow 180ms ease;
}

.empty-action:hover {
  border-color: #a78bfa;
  background: #7c3aed;
  box-shadow: 0 8px 24px rgba(139, 92, 246, 0.14);
  transform: translateY(-1px);
}

@media (max-width: 480px) {
  .empty-state {
    min-height: 240px;
    padding: 36px 18px;
  }

  .empty-state h3 {
    font-size: 14px;
  }

  .empty-state p {
    font-size: 11px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .empty-action {
    transition: none;
  }
}
</style>
