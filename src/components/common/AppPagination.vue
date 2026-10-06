<template>
  <div v-if="totalPages > 0" class="pagination-wrapper">
    <div class="pagination-info">
      <span class="pagination-label">Showing</span>

      <span class="pagination-count"> {{ startItem }}-{{ endItem }} </span>

      <span class="pagination-label">of</span>

      <span class="pagination-count">
        {{ total }}
      </span>
    </div>

    <div class="pagination-controls">
      <q-btn
        flat
        round
        dense
        icon="chevron_left"
        class="pagination-button"
        :disable="page <= 1"
        aria-label="Previous page"
        @click="goToPage(page - 1)"
      />

      <div class="page-numbers">
        <q-btn
          v-for="pageNumber in visiblePages"
          :key="pageNumber"
          flat
          dense
          no-caps
          :label="String(pageNumber)"
          class="page-number"
          :class="{
            'page-number-active': pageNumber === page,
          }"
          @click="goToPage(pageNumber)"
        />
      </div>

      <q-btn
        flat
        round
        dense
        icon="chevron_right"
        class="pagination-button"
        :disable="page >= totalPages"
        aria-label="Next page"
        @click="goToPage(page + 1)"
      />
    </div>

    <div class="page-size">
      <span class="page-size-label">Items per page</span>

      <q-select
        :model-value="limit"
        :options="limitOptions"
        outlined
        dense
        dark
        emit-value
        map-options
        class="page-size-select"
        @update:model-value="handleLimitChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import { PAGINATION_LIMITS, type PaginationLimit } from '../../types/pagination';

interface Props {
  page: number;
  limit: PaginationLimit;
  total: number;
  totalPages: number;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  'update:page': [page: number];
  'update:limit': [limit: PaginationLimit];
}>();

const limitOptions = PAGINATION_LIMITS.map((value) => ({
  label: String(value),
  value,
}));

const startItem = computed(() => {
  if (props.total <= 0) {
    return 0;
  }

  return (props.page - 1) * props.limit + 1;
});

const endItem = computed(() => {
  return Math.min(props.page * props.limit, props.total);
});

const visiblePages = computed(() => {
  const pages: number[] = [];
  const currentPage = props.page;
  const pageCount = props.totalPages;

  if (pageCount <= 7) {
    for (let page = 1; page <= pageCount; page += 1) {
      pages.push(page);
    }

    return pages;
  }

  pages.push(1);

  if (currentPage > 4) {
    pages.push(-1);
  }

  const start = Math.max(2, currentPage - 1);
  const end = Math.min(pageCount - 1, currentPage + 1);

  for (let page = start; page <= end; page += 1) {
    pages.push(page);
  }

  if (currentPage < pageCount - 3) {
    pages.push(-1);
  }

  pages.push(pageCount);

  return pages;
});

function goToPage(nextPage: number) {
  if (nextPage < 1 || nextPage > props.totalPages || nextPage === props.page) {
    return;
  }

  emit('update:page', nextPage);
}

function handleLimitChange(value: number) {
  if (!PAGINATION_LIMITS.includes(value as PaginationLimit)) {
    return;
  }

  emit('update:limit', value as PaginationLimit);
}
</script>

<style scoped lang="scss">
.pagination-wrapper {
  display: flex;
  min-width: 0;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  padding-top: 20px;
}

.pagination-info {
  display: flex;
  align-items: center;
  gap: 4px;
  min-width: 120px;
}

.pagination-label {
  color: #555555;
  font-size: 10px;
}

.pagination-count {
  color: #a3a3a3;
  font-size: 10px;
  font-weight: 650;
}

.pagination-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

.pagination-button {
  color: #737373;
  transition:
    color 180ms ease,
    background-color 180ms ease;
}

.pagination-button:hover:not(:disabled) {
  background: #111111;
  color: #c4b5fd;
}

.page-numbers {
  display: flex;
  align-items: center;
  gap: 2px;
}

.page-number {
  min-width: 30px;
  min-height: 30px;
  padding: 0 7px;
  border: 1px solid transparent;
  border-radius: 7px;
  color: #686868;
  font-size: 10px;
  font-weight: 650;
  transition:
    color 180ms ease,
    background-color 180ms ease,
    border-color 180ms ease;
}

.page-number:hover {
  border-color: #242424;
  background: #101010;
  color: #d4d4d4;
}

.page-number-active {
  border-color: rgba(139, 92, 246, 0.24);
  background: rgba(139, 92, 246, 0.1);
  color: #c4b5fd;
}

.page-size {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  min-width: 150px;
}

.page-size-label {
  color: #555555;
  font-size: 10px;
  white-space: nowrap;
}

.page-size-select {
  width: 72px;
}

:deep(.page-size-select .q-field__control) {
  min-height: 32px;
  border-radius: 7px;
  background: #0b0b0b;
}

:deep(.page-size-select .q-field__control::before) {
  border-color: #242424;
}

:deep(.page-size-select .q-field__control:hover::before) {
  border-color: #343434;
}

:deep(.page-size-select.q-field--focused .q-field__control::after) {
  border-color: #8b5cf6;
}

:deep(.page-size-select .q-field__native) {
  color: #d4d4d4;
  font-size: 10px;
  font-weight: 600;
}

:deep(.page-size-select .q-field__append) {
  color: #666666;
}

@media (max-width: 800px) {
  .pagination-wrapper {
    flex-wrap: wrap;
  }

  .pagination-info {
    order: 1;
  }

  .pagination-controls {
    order: 2;
    margin-left: auto;
  }

  .page-size {
    width: 100%;
    order: 3;
    justify-content: flex-start;
  }
}

@media (max-width: 480px) {
  .pagination-wrapper {
    gap: 12px;
  }

  .pagination-info {
    display: none;
  }

  .pagination-controls {
    margin-left: 0;
  }

  .page-size {
    justify-content: space-between;
  }

  .page-number {
    min-width: 28px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .pagination-button,
  .page-number {
    transition: none;
  }
}
</style>
