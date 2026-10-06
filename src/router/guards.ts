import type { Pinia } from 'pinia';
import type { NavigationGuard } from 'vue-router';

import { ROUTES } from '../constants/routes';
import { useAuthStore } from '../stores/auth';
import { isTokenExpired } from '../utils/auth';

export function createAuthGuard(pinia: Pinia): NavigationGuard {
  return (to) => {
    const authStore = useAuthStore(pinia);

    authStore.restoreAuth();

    const requiresAuth = to.matched.some((route) => route.meta.requiresAuth === true);

    const requiresGuest = to.matched.some((route) => route.meta.requiresGuest === true);

    const token = authStore.token;

    if (token && isTokenExpired(token)) {
      authStore.clearAuthState();
    }

    const isAuthenticated = Boolean(authStore.token);

    if (requiresAuth && !isAuthenticated) {
      return {
        path: ROUTES.LOGIN,
        query: {
          redirect: to.fullPath,
        },
      };
    }

    if (requiresGuest && isAuthenticated) {
      return {
        path: ROUTES.HOME,
      };
    }

    return true;
  };
}
