<template>
  <q-header class="app-header">
    <div class="header-inner">
      <div class="header-left">
        <q-btn
          flat
          round
          dense
          icon="menu"
          class="menu-button"
          aria-label="Toggle navigation"
          @click="emit('toggle-drawer')"
        />

        <button type="button" class="brand" @click="goHome">
          <div class="brand-mark">
            <q-icon name="auto_awesome" size="17px" />
          </div>

          <div class="brand-copy">
            <span class="brand-name">ALT</span>
            <span class="brand-subtitle">My Anime List Tracker</span>
          </div>
        </button>
      </div>

      <div class="header-actions">
        <q-btn flat round dense icon="home" class="header-action" aria-label="Home" @click="goHome">
          <q-tooltip>My Anime</q-tooltip>
        </q-btn>

        <q-btn
          unelevated
          no-caps
          icon="add"
          label="Add Anime"
          class="add-button"
          @click="goToCreate"
        />

        <q-separator vertical class="header-separator" />

        <q-btn flat no-caps class="user-button" :ripple="false">
          <q-avatar size="32px" class="user-avatar">
            <span>
              {{ userInitial }}
            </span>
          </q-avatar>

          <div class="user-copy">
            <span class="user-name">
              {{ user?.username || 'User' }}
            </span>

            <span class="user-email">
              {{ user?.email || '' }}
            </span>
          </div>

          <q-icon name="expand_more" size="16px" class="user-chevron" />

          <q-menu anchor="bottom right" self="top right" :offset="[0, 8]" class="user-menu">
            <div class="user-menu-content">
              <div class="user-menu-profile">
                <q-avatar size="38px" class="user-avatar">
                  <span>
                    {{ userInitial }}
                  </span>
                </q-avatar>

                <div>
                  <strong>
                    {{ user?.username || 'User' }}
                  </strong>

                  <span>
                    {{ user?.email || '' }}
                  </span>
                </div>
              </div>

              <q-separator class="menu-separator" />

              <button type="button" class="menu-item logout-item" @click="handleLogout">
                <q-icon name="logout" size="17px" />

                <span>Sign Out</span>
              </button>
            </div>
          </q-menu>
        </q-btn>
      </div>
    </div>
  </q-header>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';

import { ROUTES } from '../../constants/routes';
import { useAuth } from '../../composables/useAuth';

const emit = defineEmits<{
  'toggle-drawer': [];
}>();

const router = useRouter();

const { user, logout } = useAuth();

const userInitial = computed(() => {
  const username = user.value?.username?.trim();

  if (!username) {
    return 'U';
  }

  return username.charAt(0).toUpperCase();
});

function goHome() {
  void router.push(ROUTES.HOME);
}

function goToCreate() {
  void router.push(ROUTES.ANIME_CREATE);
}

function handleLogout() {
  void logout();
  void router.push(ROUTES.LOGIN);
}
</script>

<style scoped lang="scss">
.app-header {
  height: 64px;
  border-bottom: 1px solid #181818;
  background: #070707;
  color: #ffffff;
}

.header-inner {
  display: flex;
  width: 100%;
  height: 64px;
  align-items: center;
  justify-content: space-between;
  padding: 0 22px;
}

.header-left,
.header-actions {
  display: flex;
  align-items: center;
}

.header-left {
  min-width: 0;
  gap: 10px;
}

.menu-button {
  color: #6f6f6f;
  transition:
    color 180ms ease,
    background-color 180ms ease;
}

.menu-button:hover {
  background: #111111;
  color: #d4d4d4;
}

.brand {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 9px;
  padding: 0;
  border: 0;
  outline: 0;
  background: transparent;
  color: inherit;
  cursor: pointer;
  text-align: left;
}

.brand-mark {
  display: flex;
  width: 31px;
  height: 31px;
  flex: 0 0 31px;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(139, 92, 246, 0.35);
  border-radius: 8px;
  background: rgba(139, 92, 246, 0.1);
  color: #a78bfa;
  transition:
    border-color 180ms ease,
    background-color 180ms ease,
    box-shadow 180ms ease;
}

.brand:hover .brand-mark {
  border-color: rgba(167, 139, 250, 0.55);
  background: rgba(139, 92, 246, 0.16);
  box-shadow: 0 0 18px rgba(139, 92, 246, 0.1);
}

.brand-copy {
  display: flex;
  min-width: 0;
  flex-direction: column;
}

.brand-name {
  color: #f1f1f1;
  font-size: 13px;
  font-weight: 800;
  line-height: 1;
  letter-spacing: 0.04em;
}

.brand-subtitle {
  margin-top: 4px;
  overflow: hidden;
  color: #555555;
  font-size: 8px;
  font-weight: 500;
  line-height: 1;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.header-actions {
  gap: 5px;
}

.header-action {
  color: #6f6f6f;
  transition:
    color 180ms ease,
    background-color 180ms ease;
}

.header-action:hover {
  background: #111111;
  color: #d4d4d4;
}

.add-button {
  min-height: 34px;
  margin-left: 2px;
  padding: 0 12px;
  border: 1px solid #8b5cf6;
  border-radius: 7px;
  background: #8b5cf6;
  color: #ffffff;
  font-size: 10px;
  font-weight: 700;
  transition:
    background-color 180ms ease,
    border-color 180ms ease,
    box-shadow 180ms ease,
    transform 180ms ease;
}

.add-button:hover {
  border-color: #a78bfa;
  background: #7c3aed;
  box-shadow: 0 6px 20px rgba(139, 92, 246, 0.15);
  transform: translateY(-1px);
}

.header-separator {
  height: 25px;
  margin: 0 7px;
  background: #222222;
}

.user-button {
  min-height: 40px;
  padding: 3px 5px 3px 7px;
  border-radius: 8px;
  color: #d4d4d4;
  transition:
    background-color 180ms ease,
    color 180ms ease;
}

.user-button:hover {
  background: #111111;
  color: #ffffff;
}

.user-avatar {
  border: 1px solid rgba(139, 92, 246, 0.28);
  background: #151515;
  color: #a78bfa;
  font-size: 11px;
  font-weight: 800;
}

.user-copy {
  display: flex;
  max-width: 130px;
  min-width: 0;
  flex-direction: column;
  margin-left: 7px;
  text-align: left;
}

.user-name {
  overflow: hidden;
  color: #d4d4d4;
  font-size: 10px;
  font-weight: 650;
  line-height: 1.2;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.user-email {
  overflow: hidden;
  margin-top: 3px;
  color: #505050;
  font-size: 8px;
  line-height: 1.2;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.user-chevron {
  margin-left: 4px;
  color: #555555;
}

.user-menu {
  min-width: 220px;
  overflow: hidden;
  border: 1px solid #242424;
  border-radius: 10px;
  background: #0b0b0b;
  box-shadow: 0 14px 40px rgba(0, 0, 0, 0.45);
}

.user-menu-content {
  padding: 7px;
}

.user-menu-profile {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 8px;
}

.user-menu-profile > div {
  display: flex;
  min-width: 0;
  flex-direction: column;
}

.user-menu-profile strong {
  overflow: hidden;
  color: #e5e5e5;
  font-size: 10px;
  font-weight: 700;
  line-height: 1.3;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.user-menu-profile span {
  overflow: hidden;
  margin-top: 3px;
  color: #555555;
  font-size: 8px;
  line-height: 1.3;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.menu-separator {
  margin: 5px 0;
  background: #1d1d1d;
}

.menu-item {
  display: flex;
  width: 100%;
  align-items: center;
  gap: 9px;
  padding: 9px;
  border: 0;
  border-radius: 7px;
  outline: 0;
  background: transparent;
  color: #777777;
  cursor: pointer;
  font-family: inherit;
  font-size: 10px;
  font-weight: 600;
  text-align: left;
  transition:
    color 180ms ease,
    background-color 180ms ease;
}

.menu-item:hover {
  background: #151515;
  color: #d4d4d4;
}

.logout-item:hover {
  color: #fca5a5;
}

@media (max-width: 760px) {
  .header-inner {
    padding: 0 14px;
  }

  .brand-subtitle {
    display: none;
  }

  .user-copy {
    display: none;
  }

  .user-chevron {
    display: none;
  }

  .header-separator {
    margin: 0 4px;
  }
}

@media (max-width: 520px) {
  .header-inner {
    padding: 0 10px;
  }

  .add-button {
    width: 34px;
    min-width: 34px;
    padding: 0;
    font-size: 0;
  }

  .add-button :deep(.q-icon) {
    margin: 0;
    font-size: 18px;
  }

  .header-action {
    display: none;
  }

  .brand-name {
    font-size: 12px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .menu-button,
  .brand-mark,
  .header-action,
  .add-button,
  .user-button,
  .menu-item {
    transition: none;
  }
}
</style>
