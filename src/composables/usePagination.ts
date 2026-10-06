import { computed, ref } from 'vue';

import { PAGINATION_LIMITS, type PaginationLimit } from '../types/pagination';

interface UsePaginationOptions {
  initialPage?: number;
  initialLimit?: PaginationLimit;
}

export function usePagination(options: UsePaginationOptions = {}) {
  const page = ref(Math.max(options.initialPage ?? 1, 1));
  const limit = ref<PaginationLimit>(options.initialLimit ?? 12);
  const total = ref(0);

  const totalPages = computed(() => {
    if (total.value <= 0) {
      return 0;
    }

    return Math.ceil(total.value / limit.value);
  });

  const hasPreviousPage = computed(() => page.value > 1);

  const hasNextPage = computed(() => totalPages.value > 0 && page.value < totalPages.value);

  function setPage(value: number) {
    const newPage = Math.max(1, Math.min(value, totalPages.value || 1));

    page.value = newPage;
  }

  function nextPage() {
    if (hasNextPage.value) {
      page.value += 1;
    }
  }

  function previousPage() {
    if (hasPreviousPage.value) {
      page.value -= 1;
    }
  }

  function setLimit(value: PaginationLimit) {
    if (!PAGINATION_LIMITS.includes(value)) {
      return;
    }

    limit.value = value;
    page.value = 1;
  }

  function setTotal(value: number) {
    total.value = Math.max(value, 0);

    if (totalPages.value > 0 && page.value > totalPages.value) {
      page.value = totalPages.value;
    }
  }

  function reset() {
    page.value = 1;
    limit.value = options.initialLimit ?? 12;
    total.value = 0;
  }

  return {
    page,
    limit,
    total,
    totalPages,
    hasPreviousPage,
    hasNextPage,
    setPage,
    nextPage,
    previousPage,
    setLimit,
    setTotal,
    reset,
  };
}
