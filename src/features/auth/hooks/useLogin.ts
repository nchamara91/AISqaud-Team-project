/**
 * useLogin Hook
 * 
 * Custom hook for managing login form state and authentication logic.
 * Encapsulates all business logic for the login feature.
 */

import { useState, useCallback, useRef } from 'react';
import type {
  LoginFormValues,
  FieldError,
  SubmissionState,
  LoginResponse,
  AuthError,
} from '../types/auth.types';
import {
  validateLoginForm,
  validateField,
  sanitizeEmail,
  canSubmitForm,
} from '../validation/login.validation';
import { login } from '../services/auth.service';

/**
 * Initial form values
 */
const INITIAL_FORM_VALUES: LoginFormValues = {
  email: '',
  password: '',
  rememberMe: false,
};

/**
 * useLogin hook return type
 */
export interface UseLoginReturn {
  // Form state
  values: LoginFormValues;
  errors: FieldError[];
  touched: Partial<Record<keyof LoginFormValues, boolean>>;
  submissionState: SubmissionState;
  
  // Form handlers
  handleChange: (field: keyof LoginFormValues, value: string | boolean) => void;
  handleBlur: (field: keyof LoginFormValues) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  resetForm: () => void;
  
  // Computed state
  canSubmit: boolean;
  isSubmitting: boolean;
  
  // Error state
  authError: AuthError | null;
  getFieldError: (field: keyof LoginFormValues) => string | null;
  hasFieldError: (field: keyof LoginFormValues) => boolean;
}

/**
 * Options for useLogin hook
 */
export interface UseLoginOptions {
  /** Callback on successful login */
  onSuccess?: (response: LoginResponse) => void;
  /** Callback on login failure */
  onError?: (error: AuthError) => void;
  /** Validate on change (default: false) */
  validateOnChange?: boolean;
  /** Validate on blur (default: true) */
  validateOnBlur?: boolean;
}

/**
 * Custom hook for login form management
 */
export function useLogin(options: UseLoginOptions = {}): UseLoginReturn {
  const {
    onSuccess,
    onError,
    validateOnChange = false,
    validateOnBlur = true,
  } = options;

  // Form state
  const [values, setValues] = useState<LoginFormValues>(INITIAL_FORM_VALUES);
  const [errors, setErrors] = useState<FieldError[]>([]);
  const [touched, setTouched] = useState<Partial<Record<keyof LoginFormValues, boolean>>>({});
  const [submissionState, setSubmissionState] = useState<SubmissionState>('idle');
  const [authError, setAuthError] = useState<AuthError | null>(null);

  // Prevent duplicate submissions
  const isSubmittingRef = useRef(false);

  /**
   * Handle field value change
   */
  const handleChange = useCallback(
    (field: keyof LoginFormValues, value: string | boolean) => {
      setValues((prev) => ({
        ...prev,
        [field]: field === 'email' && typeof value === 'string' 
          ? sanitizeEmail(value)
          : value,
      }));

      // Clear auth error on change
      if (authError) {
        setAuthError(null);
      }

      // Validate on change if enabled
      if (validateOnChange && typeof value === 'string') {
        const fieldError = validateField(field, value);
        setErrors((prev) => {
          const filtered = prev.filter((err) => err.field !== field);
          return fieldError ? [...filtered, fieldError] : filtered;
        });
      } else if (validateOnChange) {
        // Clear error for non-string fields (like rememberMe)
        setErrors((prev) => prev.filter((err) => err.field !== field));
      }
    },
    [validateOnChange, authError]
  );

  /**
   * Handle field blur event
   */
  const handleBlur = useCallback(
    (field: keyof LoginFormValues) => {
      // Mark field as touched
      setTouched((prev) => ({ ...prev, [field]: true }));

      // Validate on blur if enabled
      if (validateOnBlur) {
        const value = values[field];
        if (typeof value === 'string') {
          const fieldError = validateField(field, value);
          setErrors((prev) => {
            const filtered = prev.filter((err) => err.field !== field);
            return fieldError ? [...filtered, fieldError] : filtered;
          });
        }
      }
    },
    [validateOnBlur, values]
  );

  /**
   * Handle form submission
   */
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      // Prevent duplicate submissions
      if (isSubmittingRef.current) {
        return;
      }

      // Validate entire form
      const validation = validateLoginForm(values);
      setErrors(validation.errors);

      // Mark all fields as touched
      setTouched({
        email: true,
        password: true,
        rememberMe: true,
      });

      if (!validation.isValid) {
        setSubmissionState('error');
        return;
      }

      // Start submission
      isSubmittingRef.current = true;
      setSubmissionState('submitting');
      setAuthError(null);

      try {
        const response = await login({
          email: values.email,
          password: values.password,
          rememberMe: values.rememberMe,
        });

        setSubmissionState('success');
        onSuccess?.(response);
      } catch (error) {
        const authErr = error as AuthError;
        setAuthError(authErr);
        setSubmissionState('error');
        onError?.(authErr);
      } finally {
        isSubmittingRef.current = false;
      }
    },
    [values, onSuccess, onError]
  );

  /**
   * Reset form to initial state
   */
  const resetForm = useCallback(() => {
    setValues(INITIAL_FORM_VALUES);
    setErrors([]);
    setTouched({});
    setSubmissionState('idle');
    setAuthError(null);
    isSubmittingRef.current = false;
  }, []);

  /**
   * Get error message for a specific field
   */
  const getFieldError = useCallback(
    (field: keyof LoginFormValues): string | null => {
      // Only show error if field has been touched
      if (!touched[field]) {
        return null;
      }
      const error = errors.find((err) => err.field === field);
      return error ? error.message : null;
    },
    [errors, touched]
  );

  /**
   * Check if a field has an error
   */
  const hasFieldError = useCallback(
    (field: keyof LoginFormValues): boolean => {
      return touched[field] === true && errors.some((err) => err.field === field);
    },
    [errors, touched]
  );

  // Computed values
  const canSubmit = canSubmitForm(values, submissionState === 'submitting');
  const isSubmitting = submissionState === 'submitting';

  return {
    // State
    values,
    errors,
    touched,
    submissionState,
    authError,

    // Handlers
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,

    // Computed
    canSubmit,
    isSubmitting,
    getFieldError,
    hasFieldError,
  };
}
