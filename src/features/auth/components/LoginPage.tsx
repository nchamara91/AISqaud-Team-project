/**
 * LoginPage Component
 * 
 * Main login page component with form, validation, and authentication.
 * Implements WCAG 2.1 AA accessibility standards.
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLogin } from '../hooks/useLogin';
import { usePasswordVisibility } from '../hooks/usePasswordVisibility';
import { getSafeRedirectUrl } from '../services/auth.service';
import type { LoginResponse, AuthError } from '../types/auth.types';

/**
 * LoginPage component props
 */
export interface LoginPageProps {
  /** Optional redirect URL after successful login */
  redirectTo?: string;
  /** Optional brand logo URL */
  logoUrl?: string;
  /** Optional product name */
  productName?: string;
  /** Show "Remember Me" checkbox */
  showRememberMe?: boolean;
  /** Show "Forgot Password" link */
  showForgotPassword?: boolean;
  /** Custom success handler */
  onLoginSuccess?: (response: LoginResponse) => void;
  /** Custom error handler */
  onLoginError?: (error: AuthError) => void;
}

/**
 * LoginPage Component
 * 
 * Accessible login form with email, password, and remember me fields.
 * Includes comprehensive error handling and keyboard navigation.
 */
export function LoginPage({
  redirectTo,
  logoUrl,
  productName = 'Bargaining Bank',
  showRememberMe = true,
  showForgotPassword = true,
  onLoginSuccess,
  onLoginError,
}: LoginPageProps) {
  const navigate = useNavigate();
  const passwordVisibility = usePasswordVisibility();

  // Custom login success handler
  const handleLoginSuccess = React.useCallback(
    (response: LoginResponse) => {
      // Get safe redirect URL
      const safeRedirectUrl = getSafeRedirectUrl(
        redirectTo || response.redirectUrl,
        '/dashboard'
      );

      // Call custom handler if provided
      onLoginSuccess?.(response);

      // Navigate to redirect URL
      navigate(safeRedirectUrl, { replace: true });
    },
    [navigate, redirectTo, onLoginSuccess]
  );

  // Custom login error handler
  const handleLoginError = React.useCallback(
    (error: AuthError) => {
      // Call custom handler if provided
      onLoginError?.(error);
    },
    [onLoginError]
  );

  const {
    values,
    errors: _errors,
    submissionState: _submissionState,
    authError,
    handleChange,
    handleBlur,
    handleSubmit,
    canSubmit,
    isSubmitting,
    getFieldError,
    hasFieldError,
  } = useLogin({
    onSuccess: handleLoginSuccess,
    onError: handleLoginError,
    validateOnBlur: true,
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          {logoUrl && (
            <img
              src={logoUrl}
              alt={`${productName} logo`}
              className="mx-auto h-12 w-auto"
            />
          )}
          <h1 className="mt-6 text-3xl font-extrabold text-gray-900">
            Sign in to {productName}
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Enter your credentials to access your account
          </p>
        </div>

        {/* Login Form */}
        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-6"
          noValidate
          aria-label="Login form"
        >
          {/* Authentication Error Alert */}
          {authError && (
            <div
              role="alert"
              aria-live="assertive"
              className="rounded-md bg-red-50 p-4 border border-red-200"
            >
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Authentication failed
                  </h3>
                  <p className="mt-1 text-sm text-red-700">{authError.message}</p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                aria-required="true"
                aria-invalid={hasFieldError('email') ? 'true' : 'false'}
                aria-describedby={hasFieldError('email') ? 'email-error' : undefined}
                value={values.email}
                onChange={(e) => handleChange('email', e.target.value)}
                onBlur={() => handleBlur('email')}
                disabled={isSubmitting}
                className={`
                  appearance-none block w-full px-3 py-2 border rounded-md shadow-sm
                  placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-0
                  sm:text-sm transition-colors
                  ${
                    hasFieldError('email')
                      ? 'border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500'
                      : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                  }
                  disabled:bg-gray-100 disabled:cursor-not-allowed
                `}
                placeholder="you@example.com"
              />
              {hasFieldError('email') && (
                <p
                  id="email-error"
                  className="mt-1 text-sm text-red-600"
                  role="alert"
                >
                  {getFieldError('email')}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={passwordVisibility.inputType}
                  autoComplete="current-password"
                  required
                  aria-required="true"
                  aria-invalid={hasFieldError('password') ? 'true' : 'false'}
                  aria-describedby={
                    hasFieldError('password') ? 'password-error' : undefined
                  }
                  value={values.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  onBlur={() => handleBlur('password')}
                  disabled={isSubmitting}
                  className={`
                    appearance-none block w-full px-3 py-2 pr-10 border rounded-md shadow-sm
                    placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-0
                    sm:text-sm transition-colors
                    ${
                      hasFieldError('password')
                        ? 'border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500'
                        : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                    }
                    disabled:bg-gray-100 disabled:cursor-not-allowed
                  `}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={passwordVisibility.toggleVisibility}
                  disabled={isSubmitting}
                  aria-label={passwordVisibility.toggleAriaLabel}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded disabled:cursor-not-allowed"
                >
                  {passwordVisibility.isVisible ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  )}
                </button>
              </div>
              {hasFieldError('password') && (
                <p
                  id="password-error"
                  className="mt-1 text-sm text-red-600"
                  role="alert"
                >
                  {getFieldError('password')}
                </p>
              )}
            </div>
          </div>

          {/* Remember Me and Forgot Password */}
          <div className="flex items-center justify-between">
            {showRememberMe && (
              <div className="flex items-center">
                <input
                  id="rememberMe"
                  name="rememberMe"
                  type="checkbox"
                  checked={values.rememberMe}
                  onChange={(e) => handleChange('rememberMe', e.target.checked)}
                  disabled={isSubmitting}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:cursor-not-allowed"
                />
                <label
                  htmlFor="rememberMe"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Remember me
                </label>
              </div>
            )}

            {showForgotPassword && (
              <div className="text-sm">
                <a
                  href="/forgot-password"
                  className="font-medium text-blue-600 hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                >
                  Forgot your password?
                </a>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={!canSubmit || isSubmitting}
              aria-busy={isSubmitting ? 'true' : 'false'}
              className={`
                group relative w-full flex justify-center py-2 px-4 border border-transparent
                text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 
                focus:ring-offset-2 focus:ring-blue-500 transition-colors
                ${
                  !canSubmit || isSubmitting
                    ? 'bg-blue-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                }
              `}
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
