import type { AuthResponse, LoginPayload, RegisterPayload } from '../types/auth';
import { apiRequest } from './api';

const AUTH_ENDPOINTS = {
  login: '/api/auth/login',
  register: '/api/auth/register',
} as const;

interface BackendAuthResponse {
  message: string;
  data: AuthResponse;
}

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const response = await apiRequest<BackendAuthResponse>(AUTH_ENDPOINTS.login, {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  return response.data;
}

export async function register(payload: RegisterPayload): Promise<AuthResponse> {
  const response = await apiRequest<BackendAuthResponse>(AUTH_ENDPOINTS.register, {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  return response.data;
}
