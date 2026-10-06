import { defineStore } from 'pinia';

import type { User } from '../types/auth';

const TOKEN_KEY = 'alt_token';
const USER_KEY = 'alt_user';

interface AuthState {
  token: string | null;
  user: User | null;
  isLoading: boolean;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    token: null,
    user: null,
    isLoading: false,
  }),

  getters: {
    isAuthenticated: (state): boolean => {
      return Boolean(state.token);
    },
  },

  actions: {
    setAuth(token: string, user: User) {
      this.token = token;
      this.user = user;

      if (typeof window !== 'undefined') {
        localStorage.setItem(TOKEN_KEY, token);
        localStorage.setItem(USER_KEY, JSON.stringify(user));
      }
    },

    restoreAuth() {
      if (typeof window === 'undefined') {
        return;
      }

      const token = localStorage.getItem(TOKEN_KEY);
      const storedUser = localStorage.getItem(USER_KEY);

      if (!token) {
        this.clearAuthState();
        return;
      }

      this.token = token;

      if (!storedUser) {
        this.user = null;
        return;
      }

      try {
        this.user = JSON.parse(storedUser) as User;
      } catch {
        this.user = null;
        localStorage.removeItem(USER_KEY);
      }
    },

    clearAuthState() {
      this.token = null;
      this.user = null;
      this.isLoading = false;

      if (typeof window !== 'undefined') {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
      }
    },

    logout() {
      this.clearAuthState();
    },
  },
});
