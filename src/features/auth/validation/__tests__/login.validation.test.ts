/**
 * Login Validation Tests
 * 
 * Unit tests for login form validation logic
 */

import {
  validateField,
  validateLoginForm,
  getFieldError,
  hasFieldError,
  sanitizeEmail,
  canSubmitForm,
} from '../login.validation';
import type { LoginFormValues, FieldError } from '../../types/auth.types';

describe('Login Validation', () => {
  describe('validateField', () => {
    describe('email validation', () => {
      it('should return error for empty email', () => {
        const error = validateField('email', '');
        expect(error).not.toBeNull();
        expect(error?.field).toBe('email');
        expect(error?.type).toBe('required');
        expect(error?.message).toBe('Email is required');
      });

      it('should return error for invalid email format', () => {
        const invalidEmails = [
          'invalid',
          'invalid@',
          '@invalid.com',
          'invalid @domain.com',
          'invalid..email@domain.com',
        ];

        invalidEmails.forEach((email) => {
          const error = validateField('email', email);
          expect(error).not.toBeNull();
          expect(error?.type).toBe('format');
        });
      });

      it('should return error for email exceeding max length', () => {
        const longEmail = 'a'.repeat(245) + '@domain.com'; // 256 characters
        const error = validateField('email', longEmail);
        expect(error).not.toBeNull();
        expect(error?.type).toBe('maxLength');
      });

      it('should return null for valid email', () => {
        const validEmails = [
          'user@example.com',
          'test.user@domain.co.uk',
          'user+tag@example.com',
          'user_name@sub.domain.com',
        ];

        validEmails.forEach((email) => {
          const error = validateField('email', email);
          expect(error).toBeNull();
        });
      });
    });

    describe('password validation', () => {
      it('should return error for empty password', () => {
        const error = validateField('password', '');
        expect(error).not.toBeNull();
        expect(error?.field).toBe('password');
        expect(error?.type).toBe('required');
      });

      it('should return error for password less than 8 characters', () => {
        const error = validateField('password', 'short');
        expect(error).not.toBeNull();
        expect(error?.type).toBe('minLength');
      });

      it('should return error for password exceeding max length', () => {
        const longPassword = 'a'.repeat(129);
        const error = validateField('password', longPassword);
        expect(error).not.toBeNull();
        expect(error?.type).toBe('maxLength');
      });

      it('should return null for valid password', () => {
        const validPasswords = [
          'password123',
          'MySecureP@ssw0rd!',
          'a'.repeat(8),
          'a'.repeat(128),
        ];

        validPasswords.forEach((password) => {
          const error = validateField('password', password);
          expect(error).toBeNull();
        });
      });
    });
  });

  describe('validateLoginForm', () => {
    it('should return errors for empty form', () => {
      const values: LoginFormValues = {
        email: '',
        password: '',
        rememberMe: false,
      };

      const result = validateLoginForm(values);
      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(2);
      expect(result.errors.find((e: FieldError) => e.field === 'email')).toBeDefined();
      expect(result.errors.find((e: FieldError) => e.field === 'password')).toBeDefined();
    });

    it('should return error for invalid email only', () => {
      const values: LoginFormValues = {
        email: 'invalid-email',
        password: 'validPassword123',
        rememberMe: false,
      };

      const result = validateLoginForm(values);
      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].field).toBe('email');
    });

    it('should return error for invalid password only', () => {
      const values: LoginFormValues = {
        email: 'valid@example.com',
        password: 'short',
        rememberMe: false,
      };

      const result = validateLoginForm(values);
      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].field).toBe('password');
    });

    it('should return no errors for valid form', () => {
      const values: LoginFormValues = {
        email: 'user@example.com',
        password: 'securePassword123',
        rememberMe: true,
      };

      const result = validateLoginForm(values);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe('getFieldError', () => {
    it('should return error message for field with error', () => {
      const errors: FieldError[] = [
        { field: 'email', message: 'Email is required', type: 'required' },
      ];

      const message = getFieldError(errors, 'email');
      expect(message).toBe('Email is required');
    });

    it('should return null for field without error', () => {
      const errors: FieldError[] = [
        { field: 'email', message: 'Email is required', type: 'required' },
      ];

      const message = getFieldError(errors, 'password');
      expect(message).toBeNull();
    });

    it('should return null for empty errors array', () => {
      const message = getFieldError([], 'email');
      expect(message).toBeNull();
    });
  });

  describe('hasFieldError', () => {
    it('should return true for field with error', () => {
      const errors: FieldError[] = [
        { field: 'email', message: 'Email is required', type: 'required' },
      ];

      expect(hasFieldError(errors, 'email')).toBe(true);
    });

    it('should return false for field without error', () => {
      const errors: FieldError[] = [
        { field: 'email', message: 'Email is required', type: 'required' },
      ];

      expect(hasFieldError(errors, 'password')).toBe(false);
    });
  });

  describe('sanitizeEmail', () => {
    it('should trim whitespace', () => {
      expect(sanitizeEmail('  user@example.com  ')).toBe('user@example.com');
      expect(sanitizeEmail('\tuser@example.com\n')).toBe('user@example.com');
    });

    it('should convert to lowercase', () => {
      expect(sanitizeEmail('User@Example.COM')).toBe('user@example.com');
      expect(sanitizeEmail('TEST@DOMAIN.COM')).toBe('test@domain.com');
    });

    it('should trim and lowercase together', () => {
      expect(sanitizeEmail('  User@Example.COM  ')).toBe('user@example.com');
    });
  });

  describe('canSubmitForm', () => {
    it('should return false when form is submitting', () => {
      const values: LoginFormValues = {
        email: 'user@example.com',
        password: 'validPassword123',
        rememberMe: false,
      };

      expect(canSubmitForm(values, true)).toBe(false);
    });

    it('should return false when form is invalid', () => {
      const values: LoginFormValues = {
        email: '',
        password: '',
        rememberMe: false,
      };

      expect(canSubmitForm(values, false)).toBe(false);
    });

    it('should return true when form is valid and not submitting', () => {
      const values: LoginFormValues = {
        email: 'user@example.com',
        password: 'validPassword123',
        rememberMe: false,
      };

      expect(canSubmitForm(values, false)).toBe(true);
    });
  });
});
