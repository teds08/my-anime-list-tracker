<template>
  <q-layout view="hHh lpr fFf" class="main-layout">
    <AppHeader @toggle-drawer="isDrawerOpen = !isDrawerOpen" />

    <AppSidebar v-model="isDrawerOpen" />

    <q-page-container class="main-page-container">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import AppHeader from '../components/layout/AppHeader.vue';
import AppSidebar from '../components/layout/AppSidebar.vue';

const isDrawerOpen = ref(false);
</script>

<style scoped lang="scss">
.main-layout {
  min-height: 100vh;
  background: #050505;
  color: #ffffff;
}

.main-page-container {
  min-height: calc(100vh - 64px);
  background: #050505;
}
</style>
