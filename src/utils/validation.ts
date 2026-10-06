export interface FieldErrors {
  [field: string]: string;
}

export function required(value: string | null | undefined, fieldName: string): string | null {
  if (!value?.trim()) {
    return `${fieldName} is required.`;
  }

  return null;
}

export function minLength(value: string, length: number, fieldName: string): string | null {
  if (value.trim().length < length) {
    return `${fieldName} must be at least ${length} characters.`;
  }

  return null;
}

export function maxLength(value: string, length: number, fieldName: string): string | null {
  if (value.trim().length > length) {
    return `${fieldName} must not exceed ${length} characters.`;
  }

  return null;
}

export function email(value: string): string | null {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return 'Email is required.';
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedValue)) {
    return 'Please enter a valid email address.';
  }

  return null;
}

export function password(value: string): string | null {
  if (!value) {
    return 'Password is required.';
  }

  if (value.length < 8) {
    return 'Password must be at least 8 characters.';
  }

  return null;
}

export function confirmPassword(passwordValue: string, confirmationValue: string): string | null {
  if (!confirmationValue) {
    return 'Please confirm your password.';
  }

  if (passwordValue !== confirmationValue) {
    return 'Passwords do not match.';
  }

  return null;
}

export function positiveInteger(value: number, fieldName: string): string | null {
  if (!Number.isInteger(value)) {
    return `${fieldName} must be a whole number.`;
  }

  if (value <= 0) {
    return `${fieldName} must be greater than 0.`;
  }

  return null;
}

export function nonNegativeInteger(value: number, fieldName: string): string | null {
  if (!Number.isInteger(value)) {
    return `${fieldName} must be a whole number.`;
  }

  if (value < 0) {
    return `${fieldName} cannot be negative.`;
  }

  return null;
}

export function url(value: string | null | undefined): string | null {
  const trimmedValue = value?.trim() ?? '';

  if (!trimmedValue) {
    return null;
  }

  try {
    const parsedUrl = new URL(trimmedValue);

    if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
      return 'URL must use HTTP or HTTPS.';
    }
  } catch {
    return 'Please enter a valid URL.';
  }

  return null;
}

export function hasErrors(errors: FieldErrors): boolean {
  return Object.keys(errors).length > 0;
}
