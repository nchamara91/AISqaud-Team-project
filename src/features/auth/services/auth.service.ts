/**
 * Authentication Service
 * 
 * Handles all authentication-related API calls.
 * Implements proper error handling and security practices.
 */

import type {
  LoginCredentials,
  LoginResponse,
  AuthError,
} from '../types/auth.types';

/**
 * API configuration
 */
const API_CONFIG = {
  baseUrl: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000, // 10 seconds
  endpoints: {
    login: '/auth/login',
    logout: '/auth/logout',
    refreshToken: '/auth/refresh',
  },
};

/**
 * HTTP request options
 */
interface RequestOptions {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  body?: unknown;
  timeout?: number;
}

/**
 * Generic fetch wrapper with timeout and error handling
 */
async function fetchWithTimeout<T>(
  url: string,
  options: RequestOptions
): Promise<T> {
  const { timeout = API_CONFIG.timeout, ...fetchOptions } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(`${API_CONFIG.baseUrl}${url}`, {
      ...fetchOptions,
      headers: {
        'Content-Type': 'application/json',
        ...fetchOptions.headers,
      },
      body: fetchOptions.body ? JSON.stringify(fetchOptions.body) : undefined,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw createAuthError(response.status, errorData);
    }

    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof Error && error.name === 'AbortError') {
      throw createAuthError(408, { message: 'Request timeout' });
    }

    if (error instanceof TypeError) {
      throw createAuthError(0, { message: 'Network error - please check your connection' });
    }

    throw error;
  }
}

/**
 * Create standardized auth error
 */
function createAuthError(status: number, data: Record<string, unknown>): AuthError {
  const errorMap: Record<number, AuthError> = {
    400: {
      code: 'VALIDATION_ERROR',
      message: 'Invalid login credentials format',
    },
    401: {
      code: 'INVALID_CREDENTIALS',
      message: 'Invalid email or password',
    },
    403: {
      code: 'ACCOUNT_DISABLED',
      message: 'Your account has been disabled',
    },
    408: {
      code: 'NETWORK_ERROR',
      message: 'Request timeout - please try again',
    },
    423: {
      code: 'ACCOUNT_LOCKED',
      message: 'Your account has been locked due to too many failed attempts',
    },
    429: {
      code: 'TOO_MANY_ATTEMPTS',
      message: 'Too many login attempts - please try again later',
    },
    500: {
      code: 'SERVER_ERROR',
      message: 'Server error - please try again later',
    },
    0: {
      code: 'NETWORK_ERROR',
      message: data.message as string || 'Network error occurred',
    },
  };

  return errorMap[status] || {
    code: 'SERVER_ERROR',
    message: 'An unexpected error occurred',
  };
}

/**
 * Login user with credentials
 * 
 * @param credentials - User login credentials
 * @returns Promise resolving to login response
 * @throws AuthError on failure
 */
export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  // Never log credentials
  console.info('[Auth] Attempting login...');

  try {
    const response = await fetchWithTimeout<LoginResponse>(
      API_CONFIG.endpoints.login,
      {
        method: 'POST',
        body: {
          email: credentials.email,
          password: credentials.password,
          rememberMe: credentials.rememberMe,
        },
      }
    );

    console.info('[Auth] Login successful');
    return response;
  } catch (error) {
    console.error('[Auth] Login failed:', {
      code: (error as AuthError).code,
      // Never log the actual error message in production
    });
    throw error;
  }
}

/**
 * Logout current user
 * 
 * @returns Promise resolving when logout complete
 */
export async function logout(): Promise<void> {
  console.info('[Auth] Logging out...');

  try {
    await fetchWithTimeout<void>(API_CONFIG.endpoints.logout, {
      method: 'POST',
    });

    console.info('[Auth] Logout successful');
  } catch (error) {
    console.error('[Auth] Logout failed');
    // Don't throw on logout failure - still clear local session
  }
}

/**
 * Validate redirect URL against whitelist
 * Prevents open redirect vulnerabilities
 * 
 * @param url - URL to validate
 * @returns True if URL is safe to redirect to
 */
export function isValidRedirectUrl(url: string): boolean {
  // Empty or null URLs are invalid
  if (!url || url.trim().length === 0) {
    return false;
  }

  // Prevent absolute URLs (external redirects)
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('//')) {
    return false;
  }

  // Prevent javascript: and data: URIs
  if (url.startsWith('javascript:') || url.startsWith('data:')) {
    return false;
  }

  // Must start with / for internal route
  if (!url.startsWith('/')) {
    return false;
  }

  // Additional whitelist check (implement based on requirements)
  const allowedPaths = ['/dashboard', '/profile', '/settings', '/'];
  
  // Check if URL starts with any allowed path
  return allowedPaths.some((path) => url === path || url.startsWith(`${path}/`));
}

/**
 * Get safe redirect URL or default
 * 
 * @param redirectUrl - Requested redirect URL
 * @param defaultUrl - Default redirect URL
 * @returns Safe redirect URL
 */
export function getSafeRedirectUrl(
  redirectUrl: string | undefined,
  defaultUrl: string = '/dashboard'
): string {
  if (redirectUrl && isValidRedirectUrl(redirectUrl)) {
    return redirectUrl;
  }
  return defaultUrl;
}
