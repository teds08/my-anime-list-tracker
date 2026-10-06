import { computed } from 'vue';
import { useRouter } from 'vue-router';

import * as authService from '../services/auth.service';
import type { LoginPayload, RegisterPayload } from '../types/auth';
import { useAuthStore } from '../stores/auth';

export function useAuth() {
  const router = useRouter();
  const authStore = useAuthStore();

  const isAuthenticated = computed(() => authStore.isAuthenticated);

  const token = computed(() => authStore.token);
  const user = computed(() => authStore.user);

  async function login(payload: LoginPayload) {
    authStore.isLoading = true;

    try {
      const response = await authService.login(payload);

      authStore.setAuth(response.token, response.user);

      await router.push('/');

      return response;
    } finally {
      authStore.isLoading = false;
    }
  }

  async function register(payload: RegisterPayload) {
    authStore.isLoading = true;

    try {
      const response = await authService.register(payload);

      authStore.setAuth(response.token, response.user);

      await router.push('/');

      return response;
    } finally {
      authStore.isLoading = false;
    }
  }

  async function logout() {
    authStore.logout();

    await router.push('/login');
  }

  return {
    isAuthenticated,
    token,
    user,
    isLoading: computed(() => authStore.isLoading),
    login,
    register,
    logout,
  };
}
