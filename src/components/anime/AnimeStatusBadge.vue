<template>
  <span class="status-badge" :class="statusClass">
    <span class="status-dot"></span>
    <span>{{ status }}</span>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import type { AnimeStatus } from '../../types/anime';

interface Props {
  status: AnimeStatus;
}

const props = defineProps<Props>();

const statusClass = computed(() => {
  switch (props.status) {
    case 'Watching':
      return 'status-watching';

    case 'Completed':
      return 'status-completed';

    case 'Plan to Watch':
      return 'status-plan';

    case 'On Hold':
      return 'status-hold';

    case 'Dropped':
      return 'status-dropped';

    default:
      return '';
  }
});
</script>

<style scoped lang="scss">
.status-badge {
  display: inline-flex;
  width: fit-content;
  align-items: center;
  gap: 6px;
  padding: 5px 8px;
  border: 1px solid #292929;
  border-radius: 6px;
  background: #111111;
  color: #a3a3a3;
  font-size: 10px;
  font-weight: 650;
  line-height: 1;
  white-space: nowrap;
}

.status-dot {
  width: 6px;
  height: 6px;
  flex: 0 0 6px;
  border-radius: 50%;
  background: currentColor;
}

.status-watching {
  border-color: rgba(139, 92, 246, 0.28);
  background: rgba(139, 92, 246, 0.08);
  color: #c4b5fd;
}

.status-completed {
  border-color: rgba(34, 197, 94, 0.22);
  background: rgba(34, 197, 94, 0.07);
  color: #86efac;
}

.status-plan {
  border-color: rgba(148, 163, 184, 0.18);
  background: rgba(148, 163, 184, 0.06);
  color: #a3a3a3;
}

.status-hold {
  border-color: rgba(245, 158, 11, 0.22);
  background: rgba(245, 158, 11, 0.07);
  color: #fcd34d;
}

.status-dropped {
  border-color: rgba(239, 68, 68, 0.22);
  background: rgba(239, 68, 68, 0.07);
  color: #fca5a5;
}
</style>
