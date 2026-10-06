import type { AuthResponse, LoginPayload, RegisterPayload } from '../types/auth';
import { apiRequest } from './api';

const AUTH_ENDPOINTS = {
  login: '/auth/login',
  register: '/auth/register',
} as const;

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  return apiRequest<AuthResponse>(AUTH_ENDPOINTS.login, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function register(payload: RegisterPayload): Promise<AuthResponse> {
  return apiRequest<AuthResponse>(AUTH_ENDPOINTS.register, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
