import type { ApiErrorResponse } from '../types/api';

const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  console.warn('VITE_API_URL is not configured. Add it to your environment variables.');
}

export class ApiError extends Error {
  status: number;
  data: ApiErrorResponse | undefined;

  constructor(message: string, status: number, data: ApiErrorResponse | undefined = undefined) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

interface ApiRequestOptions extends RequestInit {
  token?: string | null;
}

export async function apiRequest<T>(endpoint: string, options: ApiRequestOptions = {}): Promise<T> {
  const { token, headers: customHeaders, ...requestOptions } = options;

  const headers = new Headers(customHeaders);

  if (requestOptions.body) {
    headers.set('Content-Type', 'application/json');
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...requestOptions,
    headers,
  });

  if (response.status === 204) {
    return undefined as T;
  }

  const contentType = response.headers.get('content-type');

  const responseData: unknown = contentType?.includes('application/json')
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const errorData =
      typeof responseData === 'object' && responseData !== null && 'success' in responseData
        ? (responseData as ApiErrorResponse)
        : undefined;

    const message =
      errorData?.message ||
      (typeof responseData === 'string' && responseData) ||
      `Request failed with status ${response.status}.`;

    throw new ApiError(message, response.status, errorData);
  }

  return responseData as T;
}
