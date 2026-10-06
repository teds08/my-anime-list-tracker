<template>
  <q-drawer
    :model-value="modelValue"
    :breakpoint="900"
    bordered
    class="app-sidebar"
    @update:model-value="handleDrawerUpdate"
  >
    <div class="sidebar-content">
      <div class="sidebar-brand">
        <div class="brand-mark">
          <span class="brand-mark-accent">A</span>
          <span>LT</span>
        </div>

        <div class="sidebar-brand-text">
          <strong>My Anime List</strong>
          <span>Tracker</span>
        </div>
      </div>

      <div class="sidebar-section">
        <span class="sidebar-label">TRACKER</span>

        <q-list class="navigation-list">
          <q-item
            v-ripple
            clickable
            class="nav-item"
            :class="{ 'nav-item-active': isActive('/') }"
            @click="goHome"
          >
            <q-item-section avatar>
              <q-icon name="view_grid" size="19px" />
            </q-item-section>

            <q-item-section>
              <q-item-label>My Anime</q-item-label>
            </q-item-section>
          </q-item>

          <q-item
            v-ripple
            clickable
            class="nav-item"
            :class="{
              'nav-item-active': isActive('/anime/create'),
            }"
            @click="goToCreate"
          >
            <q-item-section avatar>
              <q-icon name="add_circle_outline" size="19px" />
            </q-item-section>

            <q-item-section>
              <q-item-label>Add Anime</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </div>

      <q-space />

      <div class="sidebar-footer">
        <div class="sidebar-footer-line"></div>

        <div class="sidebar-user">
          <div class="user-avatar">
            {{ userInitial }}
          </div>

          <div class="sidebar-user-info">
            <strong>{{ userName }}</strong>
            <span>Anime tracker</span>
          </div>

          <q-btn
            flat
            round
            dense
            icon="logout"
            class="logout-button"
            aria-label="Sign out"
            @click="handleLogout"
          >
            <q-tooltip>Sign Out</q-tooltip>
          </q-btn>
        </div>
      </div>
    </div>
  </q-drawer>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { ROUTES } from '../../constants/routes';
import { useAuth } from '../../composables/useAuth';

interface Props {
  modelValue: boolean;
}

defineProps<Props>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
}>();

const router = useRouter();
const route = useRoute();

const { user, logout } = useAuth();

const userName = computed(() => {
  return user.value?.username || 'Anime Fan';
});

const userInitial = computed(() => {
  const name = user.value?.username?.trim();

  if (!name) {
    return 'A';
  }

  return name.charAt(0).toUpperCase();
});

function isActive(path: string): boolean {
  return route.path === path;
}

function handleDrawerUpdate(value: boolean) {
  emit('update:modelValue', value);
}

function closeDrawer() {
  emit('update:modelValue', false);
}

function goHome() {
  closeDrawer();
  void router.push(ROUTES.HOME);
}

function goToCreate() {
  closeDrawer();
  void router.push(ROUTES.ANIME_CREATE);
}

async function handleLogout() {
  closeDrawer();
  await logout();
}
</script>

<style scoped lang="scss">
.app-sidebar {
  border-right: 1px solid #151515;
  background: #050505;
  color: #ffffff;
}

.app-sidebar :deep(.q-drawer) {
  border-right: 1px solid #151515;
  background: #050505;
}

.app-sidebar :deep(.q-drawer__content) {
  background: #050505;
}

.sidebar-content {
  display: flex;
  height: 100%;
  min-height: calc(100vh - 64px);
  flex-direction: column;
  padding: 22px 14px 16px;
  background: #050505;
}

.sidebar-brand {
  display: flex;
  align-items: center;
  gap: 11px;
  padding: 3px 9px 28px;
}

.brand-mark {
  display: inline-flex;
  align-items: center;
  gap: 1px;
  color: #f5f5f5;
  font-size: 21px;
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.06em;
}

.brand-mark-accent {
  color: #8b5cf6;
}

.sidebar-brand-text {
  display: flex;
  flex-direction: column;
  line-height: 1.25;
}

.sidebar-brand-text strong {
  color: #dcdcdc;
  font-size: 12px;
  font-weight: 700;
}

.sidebar-brand-text span {
  color: #454545;
  font-size: 10px;
}

.sidebar-section {
  margin-top: 2px;
}

.sidebar-label {
  display: block;
  padding: 0 12px 7px;
  color: #393939;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.15em;
}

.navigation-list {
  padding: 0;
}

.nav-item {
  min-height: 42px;
  margin-bottom: 3px;
  border: 1px solid transparent;
  border-radius: 8px;
  background: transparent;
  color: #656565;
  transition:
    background-color 180ms ease,
    border-color 180ms ease,
    color 180ms ease,
    transform 180ms ease;
}

.nav-item:hover {
  border-color: #181818;
  background: #090909;
  color: #bdbdbd;
  transform: translateX(1px);
}

.nav-item-active {
  border-color: rgba(139, 92, 246, 0.16);
  background: rgba(139, 92, 246, 0.07);
  color: #bcaef5;
}

.nav-item-active:hover {
  border-color: rgba(139, 92, 246, 0.22);
  background: rgba(139, 92, 246, 0.09);
  color: #c4b5fd;
}

.nav-item :deep(.q-item__section--avatar) {
  min-width: 38px;
  color: inherit;
}

.nav-item :deep(.q-item__label) {
  font-size: 12px;
  font-weight: 600;
}

.sidebar-footer {
  margin-top: auto;
}

.sidebar-footer-line {
  height: 1px;
  margin: 0 8px 14px;
  background: #161616;
}

.sidebar-user {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 7px 8px;
}

.user-avatar {
  display: flex;
  width: 32px;
  height: 32px;
  align-items: center;
  justify-content: center;
  flex: 0 0 32px;
  border: 1px solid rgba(139, 92, 246, 0.28);
  border-radius: 50%;
  background: #0a0a0a;
  color: #b8a7f2;
  font-size: 12px;
  font-weight: 700;
}

.sidebar-user-info {
  display: flex;
  min-width: 0;
  flex: 1;
  flex-direction: column;
}

.sidebar-user-info strong {
  overflow: hidden;
  color: #cecece;
  font-size: 11px;
  font-weight: 600;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.sidebar-user-info span {
  margin-top: 2px;
  color: #414141;
  font-size: 9px;
}

.logout-button {
  color: #484848;
  transition:
    color 180ms ease,
    background-color 180ms ease;
}

.logout-button:hover {
  background: rgba(239, 68, 68, 0.06);
  color: #e79a9a;
}

@media (max-width: 480px) {
  .sidebar-content {
    padding: 18px 12px 14px;
  }

  .sidebar-brand {
    padding-bottom: 22px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .nav-item,
  .logout-button {
    transition: none;
  }
}
</style>
