export const ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  HOME: '/',
  ANIME_CREATE: '/anime/create',
  ANIME_DETAILS: (id: number | string) => `/anime/${id}`,
  ANIME_EDIT: (id: number | string) => `/anime/${id}/edit`,
} as const;
