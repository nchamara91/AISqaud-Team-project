/**
 * Validation Schema and Rules
 * 
 * Comprehensive validation logic for login form fields.
 * All validation functions are pure and testable.
 */

import type {
  LoginFormValues,
  FieldError,
  ValidationState,
  ValidationErrorType,
} from '../types/auth.types';

/**
 * Validation rule configuration
 */
interface ValidationRule {
  test: (value: string) => boolean;
  message: string;
  type: ValidationErrorType;
}

/**
 * Email validation regex (RFC 5322 simplified)
 */
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

/**
 * Validation rules for email field
 */
const emailRules: ValidationRule[] = [
  {
    test: (value: string) => value.trim().length > 0,
    message: 'Email is required',
    type: 'required',
  },
  {
    test: (value: string) => EMAIL_REGEX.test(value.trim()),
    message: 'Please enter a valid email address',
    type: 'format',
  },
  {
    test: (value: string) => value.trim().length <= 254,
    message: 'Email must not exceed 254 characters',
    type: 'maxLength',
  },
];

/**
 * Validation rules for password field
 */
const passwordRules: ValidationRule[] = [
  {
    test: (value: string) => value.length > 0,
    message: 'Password is required',
    type: 'required',
  },
  {
    test: (value: string) => value.length >= 8,
    message: 'Password must be at least 8 characters',
    type: 'minLength',
  },
  {
    test: (value: string) => value.length <= 128,
    message: 'Password must not exceed 128 characters',
    type: 'maxLength',
  },
];

/**
 * Validate a single field value
 * 
 * @param field - Field name to validate
 * @param value - Field value
 * @returns Field error or null if valid
 */
export function validateField(
  field: keyof LoginFormValues,
  value: string
): FieldError | null {
  const rules = field === 'email' ? emailRules : field === 'password' ? passwordRules : [];

  for (const rule of rules) {
    if (!rule.test(value)) {
      return {
        field,
        message: rule.message,
        type: rule.type,
      };
    }
  }

  return null;
}

/**
 * Validate entire login form
 * 
 * @param values - Form values to validate
 * @returns Validation state with errors
 */
export function validateLoginForm(values: LoginFormValues): ValidationState {
  const errors: FieldError[] = [];

  // Validate email
  const emailError = validateField('email', values.email);
  if (emailError) {
    errors.push(emailError);
  }

  // Validate password
  const passwordError = validateField('password', values.password);
  if (passwordError) {
    errors.push(passwordError);
  }

  return {
    errors,
    isValid: errors.length === 0,
    touched: {},
  };
}

/**
 * Get error message for a specific field
 * 
 * @param errors - Array of field errors
 * @param field - Field name to get error for
 * @returns Error message or null
 */
export function getFieldError(
  errors: FieldError[],
  field: keyof LoginFormValues
): string | null {
  const error = errors.find((err) => err.field === field);
  return error ? error.message : null;
}

/**
 * Check if a field has an error
 * 
 * @param errors - Array of field errors
 * @param field - Field name to check
 * @returns True if field has error
 */
export function hasFieldError(
  errors: FieldError[],
  field: keyof LoginFormValues
): boolean {
  return errors.some((err) => err.field === field);
}

/**
 * Sanitize email input (trim whitespace, lowercase)
 * 
 * @param email - Raw email input
 * @returns Sanitized email
 */
export function sanitizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/**
 * Check if form can be submitted
 * 
 * @param values - Form values
 * @param isSubmitting - Current submission state
 * @returns True if form can be submitted
 */
export function canSubmitForm(
  values: LoginFormValues,
  isSubmitting: boolean
): boolean {
  if (isSubmitting) {
    return false;
  }

  const validation = validateLoginForm(values);
  return validation.isValid;
}
