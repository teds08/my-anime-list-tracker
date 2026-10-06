export function isTokenExpired(token: string): boolean {
  const payload = getTokenPayload(token);

  if (!payload || typeof payload.exp !== 'number') {
    return false;
  }

  return payload.exp * 1000 <= Date.now();
}

export function getTokenPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split('.');

    if (parts.length !== 3) {
      return null;
    }

    const base64Url = parts[1];

    if (!base64Url) {
      return null;
    }

    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

    const paddedBase64 = base64 + '='.repeat((4 - (base64.length % 4)) % 4);

    const decodedPayload = atob(paddedBase64);

    return JSON.parse(decodedPayload) as Record<string, unknown>;
  } catch {
    return null;
  }
}
