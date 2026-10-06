<template>
  <q-page class="register-page">
    <div class="register-layout">
      <section class="register-visual">
        <div class="register-visual-overlay"></div>

        <div class="register-visual-content">
          <div class="brand-mark">
            <span class="brand-mark-accent">A</span>
            <span>LT</span>
          </div>

          <div class="visual-copy">
            <p class="visual-eyebrow">MY ANIME LIST TRACKER</p>

            <h1 class="visual-title">
              Build your list.
              <br />
              Follow every episode.
            </h1>

            <p class="visual-description">
              Create your personal anime tracker and keep everything you're watching in one place.
            </p>
          </div>

          <div class="visual-features">
            <span>Favorites</span>
            <span>Progress</span>
            <span>Watch Status</span>
          </div>
        </div>
      </section>

      <section class="register-panel">
        <div class="register-container">
          <div class="mobile-brand">
            <div class="brand-mark">
              <span class="brand-mark-accent">A</span>
              <span>LT</span>
            </div>
          </div>

          <div class="register-heading">
            <p class="section-label">GET STARTED</p>

            <h2>Create your account</h2>

            <p>Start building your anime list and tracking your progress.</p>
          </div>

          <q-form class="register-form" greedy @submit.prevent="handleRegister">
            <div class="form-field">
              <label for="username">Username</label>

              <q-input
                id="username"
                v-model.trim="username"
                outlined
                dense
                dark
                autocomplete="username"
                placeholder="Choose a username"
                :error="Boolean(usernameError)"
                :error-message="usernameError"
                @update:model-value="clearFieldError('username')"
              >
                <template #prepend>
                  <q-icon name="person_outline" size="18px" />
                </template>
              </q-input>
            </div>

            <div class="form-field">
              <label for="email">Email</label>

              <q-input
                id="email"
                v-model.trim="email"
                outlined
                dense
                dark
                type="email"
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
              <label for="password">Password</label>

              <q-input
                id="password"
                v-model="password"
                outlined
                dense
                dark
                :type="showPassword ? 'text' : 'password'"
                autocomplete="new-password"
                placeholder="Create a password"
                :error="Boolean(passwordError)"
                :error-message="passwordError"
                @update:model-value="clearFieldError('password')"
              >
                <template #prepend>
                  <q-icon name="lock_outline" size="18px" />
                </template>

                <template #append>
                  <q-btn
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

            <div class="form-field">
              <label for="confirm-password">Confirm Password</label>

              <q-input
                id="confirm-password"
                v-model="confirmPassword"
                outlined
                dense
                dark
                :type="showConfirmPassword ? 'text' : 'password'"
                autocomplete="new-password"
                placeholder="Confirm your password"
                :error="Boolean(confirmPasswordError)"
                :error-message="confirmPasswordError"
                @update:model-value="clearFieldError('confirmPassword')"
              >
                <template #prepend>
                  <q-icon name="lock_outline" size="18px" />
                </template>

                <template #append>
                  <q-btn
                    flat
                    round
                    dense
                    :icon="showConfirmPassword ? 'visibility_off' : 'visibility'"
                    class="password-toggle"
                    :aria-label="showConfirmPassword ? 'Hide password' : 'Show password'"
                    @click="showConfirmPassword = !showConfirmPassword"
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
              class="register-button"
              :loading="isLoading"
              :disable="isLoading"
            >
              <span v-if="!isLoading">Create Account</span>
            </q-btn>
          </q-form>

          <div class="login-prompt">
            <span>Already have an account?</span>

            <q-btn
              flat
              no-caps
              label="Sign in"
              class="login-link"
              :disable="isLoading"
              @click="goToLogin"
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

const username = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');

const usernameError = ref('');
const emailError = ref('');
const passwordError = ref('');
const confirmPasswordError = ref('');
const formError = ref('');

const isLoading = ref(false);
const showPassword = ref(false);
const showConfirmPassword = ref(false);

function clearFieldError(field: 'username' | 'email' | 'password' | 'confirmPassword') {
  if (field === 'username') {
    usernameError.value = '';
  }

  if (field === 'email') {
    emailError.value = '';
  }

  if (field === 'password') {
    passwordError.value = '';
  }

  if (field === 'confirmPassword') {
    confirmPasswordError.value = '';
  }

  formError.value = '';
}

function validateForm(): boolean {
  usernameError.value = '';
  emailError.value = '';
  passwordError.value = '';
  confirmPasswordError.value = '';
  formError.value = '';

  let isValid = true;

  if (!username.value) {
    usernameError.value = 'Username is required.';
    isValid = false;
  } else if (username.value.length < 3) {
    usernameError.value = 'Username must be at least 3 characters.';
    isValid = false;
  } else if (username.value.length > 50) {
    usernameError.value = 'Username must not exceed 50 characters.';
    isValid = false;
  }

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
  } else if (password.value.length < 8) {
    passwordError.value = 'Password must be at least 8 characters.';
    isValid = false;
  }

  if (!confirmPassword.value) {
    confirmPasswordError.value = 'Please confirm your password.';
    isValid = false;
  } else if (confirmPassword.value !== password.value) {
    confirmPasswordError.value = 'Passwords do not match.';
    isValid = false;
  }

  return isValid;
}

async function handleRegister() {
  if (!validateForm()) {
    return;
  }

  isLoading.value = true;
  formError.value = '';

  try {
    const response = await authService.register({
      username: username.value,
      email: email.value,
      password: password.value,
    });

    authStore.setAuth(response.token, response.user);

    await router.push('/');
  } catch (error) {
    if (error instanceof ApiError) {
      formError.value = error.message || 'Unable to create your account. Please try again.';
    } else {
      formError.value = 'Unable to connect to the server. Please try again.';
    }
  } finally {
    isLoading.value = false;
  }
}

function goToLogin() {
  void router.push('/login');
}
</script>

<style scoped lang="scss">
.register-page {
  min-height: 100vh;
  background: #050505;
  color: #ffffff;
}

.register-layout {
  display: grid;
  min-height: 100vh;
  grid-template-columns: minmax(0, 1.15fr) minmax(400px, 0.85fr);
}

.register-visual {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  isolation: isolate;
  background:
    radial-gradient(circle at 35% 45%, rgba(139, 92, 246, 0.11), transparent 36%), #080808;
}

.register-visual::before {
  position: absolute;
  inset: 0;
  z-index: -2;
  content: '';
  background:
    linear-gradient(90deg, rgba(5, 5, 5, 0.06) 0%, rgba(5, 5, 5, 0.28) 60%, #050505 100%),
    linear-gradient(180deg, rgba(5, 5, 5, 0.1) 0%, transparent 45%, rgba(5, 5, 5, 0.82) 100%);
}

.register-visual::after {
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

.register-visual-content {
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

.visual-features {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.visual-features span {
  padding: 7px 11px;
  border: 1px solid #242424;
  border-radius: 999px;
  background: rgba(10, 10, 10, 0.7);
  color: #737373;
  font-size: 11px;
}

.register-panel {
  display: flex;
  align-items: center;
  min-height: 100vh;
  border-left: 1px solid #1c1c1c;
  background: #070707;
}

.register-container {
  width: min(100%, 460px);
  margin: 0 auto;
  padding: 48px;
}

.mobile-brand {
  display: none;
}

.register-heading {
  margin-bottom: 30px;
}

.register-heading h2 {
  margin: 10px 0;
  color: #ffffff;
  font-size: 30px;
  font-weight: 750;
  line-height: 1.1;
  letter-spacing: -0.035em;
}

.register-heading p:last-child {
  max-width: 390px;
  margin: 0;
  color: #737373;
  font-size: 13px;
  line-height: 1.65;
}

.register-form {
  display: flex;
  flex-direction: column;
  gap: 17px;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-field > label {
  color: #d4d4d4;
  font-size: 12px;
  font-weight: 600;
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

.register-button {
  width: 100%;
  min-height: 46px;
  margin-top: 4px;
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

.register-button:hover:not(:disabled) {
  border-color: #a78bfa;
  background: #7c3aed;
  box-shadow: 0 10px 30px rgba(139, 92, 246, 0.16);
  transform: translateY(-1px);
}

.form-error {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-top: 1px;
  padding: 11px 12px;
  border: 1px solid rgba(239, 68, 68, 0.24);
  border-radius: 8px;
  background: rgba(239, 68, 68, 0.07);
  color: #fca5a5;
  font-size: 12px;
  line-height: 1.5;
}

.login-prompt {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  margin-top: 26px;
  color: #666666;
  font-size: 12px;
}

.login-link {
  min-height: auto;
  padding: 0 4px;
  color: #a78bfa;
  font-size: 12px;
  font-weight: 600;
  transition: color 180ms ease;
}

.login-link:hover {
  color: #c4b5fd;
}

@media (max-width: 960px) {
  .register-layout {
    grid-template-columns: 1fr;
  }

  .register-visual {
    display: none;
  }

  .register-panel {
    min-height: 100vh;
    border-left: 0;
  }

  .register-container {
    width: min(100%, 520px);
    padding: 40px 28px;
  }

  .mobile-brand {
    display: block;
    margin-bottom: 42px;
  }
}

@media (max-width: 600px) {
  .register-container {
    padding: 28px 20px;
  }

  .mobile-brand {
    margin-bottom: 34px;
  }

  .register-heading h2 {
    font-size: 27px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .register-button,
  .login-link,
  .password-toggle {
    transition: none;
  }
}
</style>
