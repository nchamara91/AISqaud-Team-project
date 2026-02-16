/**
 * LoginPage Component Tests
 * 
 * Component tests using React Testing Library
 */

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { LoginPage } from '../LoginPage';
import * as authService from '../../services/auth.service';
import type { LoginResponse } from '../../types/auth.types';

// Mock the auth service
jest.mock('../../services/auth.service');

// Mock navigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('LoginPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderLoginPage = (props = {}) => {
    return render(
      <BrowserRouter>
        <LoginPage {...props} />
      </BrowserRouter>
    );
  };

  describe('Rendering', () => {
    it('should render login form with all fields', () => {
      renderLoginPage();

      expect(screen.getByRole('heading', { name: /sign in to/i })).toBeInTheDocument();
      expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/remember me/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    });

    it('should render forgot password link when enabled', () => {
      renderLoginPage({ showForgotPassword: true });
      expect(screen.getByText(/forgot your password/i)).toBeInTheDocument();
    });

    it('should not render forgot password link when disabled', () => {
      renderLoginPage({ showForgotPassword: false });
      expect(screen.queryByText(/forgot your password/i)).not.toBeInTheDocument();
    });

    it('should render remember me checkbox when enabled', () => {
      renderLoginPage({ showRememberMe: true });
      expect(screen.getByLabelText(/remember me/i)).toBeInTheDocument();
    });

    it('should not render remember me when disabled', () => {
      renderLoginPage({ showRememberMe: false });
      expect(screen.queryByLabelText(/remember me/i)).not.toBeInTheDocument();
    });

    it('should render custom product name', () => {
      renderLoginPage({ productName: 'Test App' });
      expect(screen.getByText(/sign in to test app/i)).toBeInTheDocument();
    });

    it('should render logo when provided', () => {
      renderLoginPage({ logoUrl: '/logo.png', productName: 'Test' });
      const logo = screen.getByAltText('Test logo');
      expect(logo).toBeInTheDocument();
      expect(logo).toHaveAttribute('src', '/logo.png');
    });
  });

  describe('Form Validation', () => {
    it('should show error for empty email on blur', async () => {
      const user = userEvent.setup();
      renderLoginPage();

      const emailInput = screen.getByLabelText(/email address/i);
      await user.click(emailInput);
      await user.tab();

      await waitFor(() => {
        expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      });
    });

    it('should show error for invalid email format', async () => {
      const user = userEvent.setup();
      renderLoginPage();

      const emailInput = screen.getByLabelText(/email address/i);
      await user.type(emailInput, 'invalid-email');
      await user.tab();

      await waitFor(() => {
        expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument();
      });
    });

    it('should show error for empty password on blur', async () => {
      const user = userEvent.setup();
      renderLoginPage();

      const passwordInput = screen.getByLabelText(/^password$/i);
      await user.click(passwordInput);
      await user.tab();

      await waitFor(() => {
        expect(screen.getByText(/password is required/i)).toBeInTheDocument();
      });
    });

    it('should show error for password less than 8 characters', async () => {
      const user = userEvent.setup();
      renderLoginPage();

      const passwordInput = screen.getByLabelText(/^password$/i);
      await user.type(passwordInput, 'short');
      await user.tab();

      await waitFor(() => {
        expect(screen.getByText(/password must be at least 8 characters/i)).toBeInTheDocument();
      });
    });

    it('should not show errors for valid inputs', async () => {
      const user = userEvent.setup();
      renderLoginPage();

      const emailInput = screen.getByLabelText(/email address/i);
      const passwordInput = screen.getByLabelText(/^password$/i);

      await user.type(emailInput, 'user@example.com');
      await user.type(passwordInput, 'validPassword123');
      await user.tab();

      await waitFor(() => {
        expect(screen.queryByRole('alert')).not.toBeInTheDocument();
      });
    });
  });

  describe('Password Visibility Toggle', () => {
    it('should toggle password visibility', async () => {
      const user = userEvent.setup();
      renderLoginPage();

      const passwordInput = screen.getByLabelText(/^password$/i) as HTMLInputElement;
      const toggleButton = screen.getByLabelText(/show password/i);

      expect(passwordInput.type).toBe('password');

      await user.click(toggleButton);
      expect(passwordInput.type).toBe('text');

      await user.click(toggleButton);
      expect(passwordInput.type).toBe('password');
    });
  });

  describe('Form Submission', () => {
    const mockLoginResponse: LoginResponse = {
      token: 'test-token',
      refreshToken: 'refresh-token',
      user: {
        id: '1',
        email: 'user@example.com',
        name: 'Test User',
        role: 'user',
      },
      expiresAt: Date.now() + 3600000,
    };

    it('should submit form with valid credentials', async () => {
      const user = userEvent.setup();
      const mockLogin = jest.spyOn(authService, 'login').mockResolvedValue(mockLoginResponse);
      
      renderLoginPage();

      await user.type(screen.getByLabelText(/email address/i), 'user@example.com');
      await user.type(screen.getByLabelText(/^password$/i), 'password123');
      await user.click(screen.getByRole('button', { name: /sign in/i }));

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith({
          email: 'user@example.com',
          password: 'password123',
          rememberMe: false,
        });
      });
    });

    it('should include rememberMe in submission when checked', async () => {
      const user = userEvent.setup();
      const mockLogin = jest.spyOn(authService, 'login').mockResolvedValue(mockLoginResponse);
      
      renderLoginPage();

      await user.type(screen.getByLabelText(/email address/i), 'user@example.com');
      await user.type(screen.getByLabelText(/^password$/i), 'password123');
      await user.click(screen.getByLabelText(/remember me/i));
      await user.click(screen.getByRole('button', { name: /sign in/i }));

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith({
          email: 'user@example.com',
          password: 'password123',
          rememberMe: true,
        });
      });
    });

    it('should show loading state during submission', async () => {
      const user = userEvent.setup();
      jest.spyOn(authService, 'login').mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve(mockLoginResponse), 100))
      );
      
      renderLoginPage();

      await user.type(screen.getByLabelText(/email address/i), 'user@example.com');
      await user.type(screen.getByLabelText(/^password$/i), 'password123');
      await user.click(screen.getByRole('button', { name: /sign in/i }));

      expect(screen.getByText(/signing in/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /signing in/i })).toBeDisabled();
    });

    it('should navigate on successful login', async () => {
      const user = userEvent.setup();
      jest.spyOn(authService, 'login').mockResolvedValue(mockLoginResponse);
      
      renderLoginPage();

      await user.type(screen.getByLabelText(/email address/i), 'user@example.com');
      await user.type(screen.getByLabelText(/^password$/i), 'password123');
      await user.click(screen.getByRole('button', { name: /sign in/i }));

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/dashboard', { replace: true });
      });
    });

    it('should display error message on failed login', async () => {
      const user = userEvent.setup();
      const mockError = {
        code: 'INVALID_CREDENTIALS' as const,
        message: 'Invalid email or password',
      };
      jest.spyOn(authService, 'login').mockRejectedValue(mockError);
      
      renderLoginPage();

      await user.type(screen.getByLabelText(/email address/i), 'user@example.com');
      await user.type(screen.getByLabelText(/^password$/i), 'wrongpassword');
      await user.click(screen.getByRole('button', { name: /sign in/i }));

      await waitFor(() => {
        expect(screen.getByText(/invalid email or password/i)).toBeInTheDocument();
      });
    });

    it('should prevent submission with invalid form', async () => {
      const user = userEvent.setup();
      const mockLogin = jest.spyOn(authService, 'login');
      
      renderLoginPage();

      await user.click(screen.getByRole('button', { name: /sign in/i }));

      expect(mockLogin).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      renderLoginPage();

      expect(screen.getByLabelText(/email address/i)).toHaveAttribute('aria-required', 'true');
      expect(screen.getByLabelText(/^password$/i)).toHaveAttribute('aria-required', 'true');
    });

    it('should link errors to inputs with aria-describedby', async () => {
      const user = userEvent.setup();
      renderLoginPage();

      const emailInput = screen.getByLabelText(/email address/i);
      await user.click(emailInput);
      await user.tab();

      await waitFor(() => {
        expect(emailInput).toHaveAttribute('aria-describedby', 'email-error');
        expect(emailInput).toHaveAttribute('aria-invalid', 'true');
      });
    });

    it('should support keyboard navigation', async () => {
      const user = userEvent.setup();
      renderLoginPage();

      await user.tab(); // Email input
      expect(screen.getByLabelText(/email address/i)).toHaveFocus();

      await user.tab(); // Password input
      expect(screen.getByLabelText(/^password$/i)).toHaveFocus();

      await user.tab(); // Password toggle
      expect(screen.getByLabelText(/show password/i)).toHaveFocus();

      await user.tab(); // Remember me
      expect(screen.getByLabelText(/remember me/i)).toHaveFocus();
    });

    it('should submit form on Enter key press', async () => {
      const user = userEvent.setup();
      const mockLogin = jest.spyOn(authService, 'login').mockResolvedValue({
        token: 'test',
        refreshToken: 'test',
        user: { id: '1', email: 'test@test.com', name: 'Test', role: 'user' },
        expiresAt: Date.now(),
      });
      
      renderLoginPage();

      await user.type(screen.getByLabelText(/email address/i), 'user@example.com');
      await user.type(screen.getByLabelText(/^password$/i), 'password123{Enter}');

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalled();
      });
    });
  });
});
