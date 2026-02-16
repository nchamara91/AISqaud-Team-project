/**
 * Authentication Feature Exports
 * 
 * Public API for authentication feature module
 */

// Components
export { LoginPage } from './components/LoginPage';
export type { LoginPageProps } from './components/LoginPage';

// Hooks
export { useLogin } from './hooks/useLogin';
export type { UseLoginReturn, UseLoginOptions } from './hooks/useLogin';
export { usePasswordVisibility } from './hooks/usePasswordVisibility';
export type { UsePasswordVisibilityReturn } from './hooks/usePasswordVisibility';

// Types
export type {
  LoginCredentials,
  LoginResponse,
  AuthenticatedUser,
  UserRole,
  AuthError,
  AuthErrorCode,
  FieldError,
  ValidationErrorType,
  ValidationState,
  AuthState,
  LoginFormValues,
  PasswordVisibility,
  SubmissionState,
} from './types/auth.types';

export { isAuthError, isLoginResponse } from './types/auth.types';

// Validation
export {
  validateField,
  validateLoginForm,
  getFieldError,
  hasFieldError,
  sanitizeEmail,
  canSubmitForm,
} from './validation/login.validation';

// Services
export {
  login,
  logout,
  isValidRedirectUrl,
  getSafeRedirectUrl,
} from './services/auth.service';
