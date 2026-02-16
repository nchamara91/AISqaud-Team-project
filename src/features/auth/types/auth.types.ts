/**
 * Authentication Type Definitions
 * 
 * Comprehensive type definitions for authentication feature
 * following strict TypeScript guidelines with zero any types.
 */

/**
 * Login credentials submitted by user
 */
export interface LoginCredentials {
  /** User email address (primary identifier) */
  email: string;
  /** User password */
  password: string;
  /** Remember user session preference */
  rememberMe: boolean;
}

/**
 * Successful authentication response from backend
 */
export interface LoginResponse {
  /** Authentication token */
  token: string;
  /** Refresh token for session renewal */
  refreshToken: string;
  /** Authenticated user information */
  user: AuthenticatedUser;
  /** Optional redirect URL after successful login */
  redirectUrl?: string;
  /** Session expiry timestamp */
  expiresAt: number;
}

/**
 * Authenticated user information
 */
export interface AuthenticatedUser {
  /** Unique user identifier */
  id: string;
  /** User email address */
  email: string;
  /** User display name */
  name: string;
  /** User role for authorization */
  role: UserRole;
  /** User avatar URL */
  avatarUrl?: string;
}

/**
 * User roles for authorization
 */
export type UserRole = 'admin' | 'user' | 'guest';

/**
 * Authentication error response from backend
 */
export interface AuthError {
  /** Error code for programmatic handling */
  code: AuthErrorCode;
  /** Human-readable error message */
  message: string;
  /** Additional error details */
  details?: Record<string, unknown>;
}

/**
 * Authentication error codes
 */
export type AuthErrorCode =
  | 'INVALID_CREDENTIALS'
  | 'ACCOUNT_LOCKED'
  | 'ACCOUNT_DISABLED'
  | 'TOO_MANY_ATTEMPTS'
  | 'SESSION_EXPIRED'
  | 'NETWORK_ERROR'
  | 'SERVER_ERROR'
  | 'VALIDATION_ERROR';

/**
 * Field-level validation error
 */
export interface FieldError {
  /** Field name that has error */
  field: keyof LoginCredentials;
  /** Validation error message */
  message: string;
  /** Error type for programmatic handling */
  type: ValidationErrorType;
}

/**
 * Validation error types
 */
export type ValidationErrorType =
  | 'required'
  | 'format'
  | 'minLength'
  | 'maxLength'
  | 'custom';

/**
 * Form validation state
 */
export interface ValidationState {
  /** Field-level errors */
  errors: FieldError[];
  /** Overall form validity */
  isValid: boolean;
  /** Touched fields tracking */
  touched: Partial<Record<keyof LoginCredentials, boolean>>;
}

/**
 * Authentication state for global context
 */
export interface AuthState {
  /** Current authenticated user */
  user: AuthenticatedUser | null;
  /** Authentication token */
  token: string | null;
  /** Loading state during authentication */
  isLoading: boolean;
  /** Error state */
  error: AuthError | null;
  /** Authentication status */
  isAuthenticated: boolean;
}

/**
 * Login form field values
 */
export interface LoginFormValues {
  email: string;
  password: string;
  rememberMe: boolean;
}

/**
 * Password visibility state
 */
export type PasswordVisibility = 'visible' | 'hidden';

/**
 * Login form submission state
 */
export type SubmissionState = 'idle' | 'submitting' | 'success' | 'error';

/**
 * Type guard to check if error is AuthError
 */
export function isAuthError(error: unknown): error is AuthError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    'message' in error
  );
}

/**
 * Type guard to check if response is LoginResponse
 */
export function isLoginResponse(response: unknown): response is LoginResponse {
  return (
    typeof response === 'object' &&
    response !== null &&
    'token' in response &&
    'user' in response
  );
}
