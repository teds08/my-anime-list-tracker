<template>
  <q-page class="alt-error-page flex flex-center">
    <div class="alt-error-content text-center">
      <div class="alt-error-code">404</div>

      <h1 class="alt-error-title">Page Not Found</h1>

      <p class="alt-error-message">The page you're looking for doesn't exist or has been moved.</p>

      <q-btn unelevated no-caps label="Back to ALT" class="alt-error-button" @click="goHome" />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

function goHome() {
  void router.push('/');
}
</script>

<style scoped lang="scss">
.alt-error-page {
  min-height: 100vh;
  background: #050505;
  color: #ffffff;
  padding: 24px;
}

.alt-error-content {
  width: 100%;
  max-width: 420px;
}

.alt-error-code {
  margin-bottom: 8px;
  font-size: clamp(72px, 15vw, 120px);
  font-weight: 800;
  line-height: 0.9;
  letter-spacing: -0.06em;
  color: #8b5cf6;
}

.alt-error-title {
  margin: 20px 0 8px;
  font-size: 24px;
  font-weight: 700;
}

.alt-error-message {
  margin: 0 auto 24px;
  max-width: 360px;
  color: #a3a3a3;
  font-size: 14px;
  line-height: 1.6;
}

.alt-error-button {
  min-height: 40px;
  padding: 0 20px;
  border: 1px solid #8b5cf6;
  border-radius: 8px;
  background: #8b5cf6;
  color: #ffffff;
  transition:
    background-color 180ms ease,
    border-color 180ms ease,
    transform 180ms ease;
}

.alt-error-button:hover {
  background: #7c3aed;
  border-color: #7c3aed;
  transform: translateY(-1px);
}
</style>
