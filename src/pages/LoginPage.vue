<template>
  <q-page class="login-page">
    <div class="login-layout">
      <section class="login-visual">
        <div class="login-visual-overlay"></div>

        <div class="login-visual-content">
          <div class="brand-mark">
            <span class="brand-mark-accent">A</span>
            <span>LT</span>
          </div>

          <div class="visual-copy">
            <p class="visual-eyebrow">MY ANIME LIST TRACKER</p>

            <h1 class="visual-title">
              Your anime.
              <br />
              Your progress.
              <br />
              Your list.
            </h1>

            <p class="visual-description">
              Keep track of what you're watching, what you've completed, and everything waiting in
              your watch list.
            </p>
          </div>

          <div class="visual-status">
            <span class="status-dot"></span>
            <span>Track your journey</span>
          </div>
        </div>
      </section>

      <section class="login-panel">
        <div class="login-container">
          <div class="mobile-brand">
            <div class="brand-mark">
              <span class="brand-mark-accent">A</span>
              <span>LT</span>
            </div>
          </div>

          <div class="login-heading">
            <p class="section-label">WELCOME BACK</p>

            <h2>Sign in to ALT</h2>

            <p>Continue managing your anime list and tracking your progress.</p>
          </div>

          <q-form class="login-form" greedy @submit.prevent="handleLogin">
            <div class="form-field">
              <q-input
                v-model.trim="email"
                outlined
                dense
                dark
                type="email"
                name="email"
                label="Email"
                autocomplete="email"
                placeholder="Enter your email"
                :error="Boolean(emailError)"
                :error-message="emailError"
                @update:model-value="clearFieldError('email')"
              >
                <template #prepend>
                  <q-icon name="mail_outline" size="18px" />
                </template>
              </q-input>
            </div>

            <div class="form-field">
              <q-input
                v-model="password"
                outlined
                dense
                dark
                :type="showPassword ? 'text' : 'password'"
                name="password"
                label="Password"
                autocomplete="current-password"
                placeholder="Enter your password"
                :error="Boolean(passwordError)"
                :error-message="passwordError"
                @update:model-value="clearFieldError('password')"
              >
                <template #prepend>
                  <q-icon name="lock_outline" size="18px" />
                </template>

                <template #append>
                  <q-btn
                    type="button"
                    flat
                    round
                    dense
                    size="sm"
                    :icon="showPassword ? 'visibility_off' : 'visibility'"
                    class="password-toggle"
                    :aria-label="showPassword ? 'Hide password' : 'Show password'"
                    @click="showPassword = !showPassword"
                  />
                </template>
              </q-input>
            </div>

            <div v-if="formError" class="form-error" role="alert">
              <q-icon name="error_outline" size="18px" />

              <span>{{ formError }}</span>
            </div>

            <q-btn
              type="submit"
              unelevated
              no-caps
              class="login-button"
              :loading="isLoading"
              :disable="isLoading"
            >
              <span v-if="!isLoading">Sign In</span>
            </q-btn>
          </q-form>

          <div class="register-prompt">
            <span>Don't have an account?</span>

            <q-btn
              flat
              no-caps
              label="Create one"
              class="register-link"
              :disable="isLoading"
              @click="goToRegister"
            />
          </div>
        </div>
      </section>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

import { ApiError } from '../services/api';
import * as authService from '../services/auth.service';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const email = ref('');
const password = ref('');

const emailError = ref('');
const passwordError = ref('');
const formError = ref('');

const isLoading = ref(false);
const showPassword = ref(false);

function clearFieldError(field: 'email' | 'password') {
  if (field === 'email') {
    emailError.value = '';
  }

  if (field === 'password') {
    passwordError.value = '';
  }

  formError.value = '';
}

function validateForm(): boolean {
  emailError.value = '';
  passwordError.value = '';
  formError.value = '';

  let isValid = true;

  if (!email.value) {
    emailError.value = 'Email is required.';
    isValid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    emailError.value = 'Please enter a valid email address.';
    isValid = false;
  }

  if (!password.value) {
    passwordError.value = 'Password is required.';
    isValid = false;
  }

  return isValid;
}

function getLoginErrorMessage(error: unknown): string {
  if (!(error instanceof ApiError)) {
    return 'Unable to connect to the server. Please check your connection and try again.';
  }

  switch (error.status) {
    case 400:
      return error.message || 'Please check your email and password.';

    case 401:
      return 'Incorrect email or password. Please try again.';

    case 403:
      return error.message || 'Your account is not allowed to sign in.';

    case 429:
      return error.message || 'Too many login attempts. Please wait a few minutes and try again.';

    case 500:
    case 502:
    case 503:
    case 504:
      return 'The server is temporarily unavailable. Please try again later.';

    default:
      return error.message || 'Unable to sign in. Please try again.';
  }
}

async function handleLogin() {
  if (!validateForm()) {
    return;
  }

  isLoading.value = true;
  formError.value = '';

  try {
    const response = await authService.login({
      email: email.value,
      password: password.value,
    });

    authStore.setAuth(response.token, response.user);

    await router.push('/');
  } catch (error) {
    formError.value = getLoginErrorMessage(error);
  } finally {
    isLoading.value = false;
  }
}

function goToRegister() {
  void router.push('/register');
}
</script>

<style scoped lang="scss">
.login-page {
  min-height: 100vh;
  background: #050505;
  color: #ffffff;
}

.login-layout {
  display: grid;
  min-height: 100vh;
  grid-template-columns: minmax(0, 1.15fr) minmax(400px, 0.85fr);
}

.login-visual {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  isolation: isolate;
  background:
    radial-gradient(circle at 30% 40%, rgba(139, 92, 246, 0.11), transparent 36%), #080808;
}

.login-visual::before {
  position: absolute;
  inset: 0;
  z-index: -2;
  content: '';
  background:
    linear-gradient(90deg, rgba(5, 5, 5, 0.06) 0%, rgba(5, 5, 5, 0.28) 60%, #050505 100%),
    linear-gradient(180deg, rgba(5, 5, 5, 0.12) 0%, transparent 45%, rgba(5, 5, 5, 0.8) 100%);
}

.login-visual::after {
  position: absolute;
  inset: 8%;
  z-index: -1;
  content: '';
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-radius: 28px;
  box-shadow:
    inset 0 0 100px rgba(5, 5, 5, 0.82),
    0 0 80px rgba(0, 0, 0, 0.3);
}

.login-visual-content {
  display: flex;
  min-height: 100vh;
  flex-direction: column;
  justify-content: space-between;
  padding: 48px;
}

.brand-mark {
  display: inline-flex;
  align-items: center;
  gap: 1px;
  width: fit-content;
  color: #ffffff;
  font-size: 22px;
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.06em;
}

.brand-mark-accent {
  color: #8b5cf6;
}

.visual-copy {
  max-width: 580px;
  margin: auto 0;
}

.visual-eyebrow,
.section-label {
  margin: 0;
  color: #a78bfa;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.16em;
}

.visual-title {
  margin: 16px 0 20px;
  font-size: clamp(48px, 5vw, 78px);
  font-weight: 800;
  line-height: 0.98;
  letter-spacing: -0.055em;
}

.visual-description {
  max-width: 460px;
  margin: 0;
  color: #a3a3a3;
  font-size: 15px;
  line-height: 1.75;
}

.visual-status {
  display: inline-flex;
  width: fit-content;
  align-items: center;
  gap: 9px;
  color: #737373;
  font-size: 12px;
}

.status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #8b5cf6;
  box-shadow: 0 0 12px rgba(139, 92, 246, 0.7);
}

.login-panel {
  display: flex;
  align-items: center;
  min-height: 100vh;
  border-left: 1px solid #1c1c1c;
  background: #070707;
}

.login-container {
  width: min(100%, 460px);
  margin: 0 auto;
  padding: 48px;
}

.mobile-brand {
  display: none;
}

.login-heading {
  margin-bottom: 34px;
}

.login-heading h2 {
  margin: 10px 0 10px;
  color: #ffffff;
  font-size: 30px;
  font-weight: 750;
  line-height: 1.1;
  letter-spacing: -0.035em;
}

.login-heading p:last-child {
  max-width: 390px;
  margin: 0;
  color: #737373;
  font-size: 13px;
  line-height: 1.65;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

:deep(.q-field--outlined .q-field__control) {
  min-height: 46px;
  border-radius: 9px;
  background: #0c0c0c;
}

:deep(.q-field--outlined .q-field__control::before) {
  border-color: #262626;
}

:deep(.q-field--outlined .q-field__control:hover::before) {
  border-color: #3a3a3a;
}

:deep(.q-field--outlined.q-field--focused .q-field__control::after) {
  border-color: #8b5cf6;
}

:deep(.q-field__label) {
  color: #d4d4d4;
  font-size: 12px;
  font-weight: 600;
}

:deep(.q-field--focused .q-field__label) {
  color: #a78bfa;
}

:deep(.q-field__native),
:deep(.q-field__prefix),
:deep(.q-field__suffix) {
  color: #f5f5f5;
  font-size: 13px;
}

:deep(.q-field__native::placeholder) {
  color: #525252;
  opacity: 1;
}

:deep(.q-field__prepend) {
  color: #666666;
}

:deep(.q-field--focused .q-field__prepend) {
  color: #a78bfa;
}

.password-toggle {
  color: #666666;
  transition: color 180ms ease;
}

.password-toggle:hover {
  color: #c4b5fd;
}

.login-button {
  width: 100%;
  min-height: 46px;
  margin-top: 2px;
  border: 1px solid #8b5cf6;
  border-radius: 9px;
  background: #8b5cf6;
  color: #ffffff;
  font-size: 13px;
  font-weight: 700;
  transition:
    background-color 180ms ease,
    border-color 180ms ease,
    transform 180ms ease,
    box-shadow 180ms ease;
}

.login-button:hover:not(:disabled) {
  border-color: #a78bfa;
  background: #7c3aed;
  box-shadow: 0 10px 30px rgba(139, 92, 246, 0.16);
  transform: translateY(-1px);
}

.form-error {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-top: -4px;
  padding: 11px 12px;
  border: 1px solid rgba(239, 68, 68, 0.24);
  border-radius: 8px;
  background: rgba(239, 68, 68, 0.07);
  color: #fca5a5;
  font-size: 12px;
  line-height: 1.5;
}

.register-prompt {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  margin-top: 28px;
  color: #666666;
  font-size: 12px;
}

.register-link {
  min-height: auto;
  padding: 0 4px;
  color: #a78bfa;
  font-size: 12px;
  font-weight: 600;
  transition: color 180ms ease;
}

.register-link:hover {
  color: #c4b5fd;
}

@media (max-width: 960px) {
  .login-layout {
    grid-template-columns: 1fr;
  }

  .login-visual {
    display: none;
  }

  .login-panel {
    min-height: 100vh;
    border-left: 0;
  }

  .login-container {
    width: min(100%, 520px);
    padding: 40px 28px;
  }

  .mobile-brand {
    display: block;
    margin-bottom: 48px;
  }
}

@media (max-width: 600px) {
  .login-container {
    padding: 28px 20px;
  }

  .mobile-brand {
    margin-bottom: 38px;
  }

  .login-heading h2 {
    font-size: 27px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .login-button,
  .register-link,
  .password-toggle {
    transition: none;
  }
}
</style>
