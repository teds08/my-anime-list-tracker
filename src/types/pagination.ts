export interface PaginationState {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export const PAGINATION_LIMITS = [6, 12, 24, 48] as const;

export type PaginationLimit = (typeof PAGINATION_LIMITS)[number];
