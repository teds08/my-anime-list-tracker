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

function getDefaultErrorMessage(status: number): string {
  switch (status) {
    case 400:
      return 'The request could not be processed. Please check the information you entered.';

    case 401:
      return 'Your email or password is incorrect.';

    case 403:
      return 'You do not have permission to perform this action.';

    case 404:
      return 'The requested resource could not be found.';

    case 409:
      return 'This request conflicts with existing data.';

    case 422:
      return 'Some of the information provided is invalid.';

    case 429:
      return 'Too many requests. Please wait a moment and try again.';

    case 500:
      return 'Something went wrong on the server. Please try again later.';

    case 502:
    case 503:
    case 504:
      return 'The server is temporarily unavailable. Please try again later.';

    default:
      return 'Something went wrong. Please try again.';
  }
}

function extractErrorMessage(responseData: unknown, status: number): string {
  if (typeof responseData === 'object' && responseData !== null) {
    if (
      'message' in responseData &&
      typeof responseData.message === 'string' &&
      responseData.message.trim()
    ) {
      return responseData.message;
    }

    if (
      'error' in responseData &&
      typeof responseData.error === 'string' &&
      responseData.error.trim()
    ) {
      return responseData.error;
    }

    if (
      'errors' in responseData &&
      Array.isArray(responseData.errors) &&
      responseData.errors.length > 0
    ) {
      const firstError = responseData.errors[0];

      if (typeof firstError === 'string' && firstError.trim()) {
        return firstError;
      }

      if (
        typeof firstError === 'object' &&
        firstError !== null &&
        'message' in firstError &&
        typeof firstError.message === 'string'
      ) {
        return firstError.message;
      }
    }
  }

  if (typeof responseData === 'string' && responseData.trim()) {
    return responseData;
  }

  return getDefaultErrorMessage(status);
}

export async function apiRequest<T>(endpoint: string, options: ApiRequestOptions = {}): Promise<T> {
  const { token, headers: customHeaders, ...requestOptions } = options;

  const headers = new Headers(customHeaders);

  if (requestOptions.body && !(requestOptions.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  let response: Response;

  try {
    response = await fetch(`${API_URL}${endpoint}`, {
      ...requestOptions,
      headers,
    });
  } catch {
    throw new ApiError(
      'Unable to connect to the server. Please check your internet connection and try again.',
      0,
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const contentType = response.headers.get('content-type');

  let responseData: unknown;

  try {
    responseData = contentType?.includes('application/json')
      ? await response.json()
      : await response.text();
  } catch {
    responseData = null;
  }

  if (!response.ok) {
    const errorData =
      typeof responseData === 'object' && responseData !== null && 'success' in responseData
        ? (responseData as ApiErrorResponse)
        : undefined;

    const message = extractErrorMessage(responseData, response.status);

    throw new ApiError(message, response.status, errorData);
  }

  return responseData as T;
}
