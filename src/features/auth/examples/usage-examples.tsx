/**
 * Login Feature Usage Examples
 * 
 * Comprehensive examples demonstrating various use cases
 */

import { LoginPage, useLogin } from '@/features/auth';
import type { LoginResponse, AuthError } from '@/features/auth';

// ============================================================================
// Example 1: Basic Usage
// ============================================================================

export function BasicLoginExample() {
  return <LoginPage />;
}

// ============================================================================
// Example 2: Custom Configuration
// ============================================================================

export function CustomizedLoginExample() {
  return (
    <LoginPage
      redirectTo="/dashboard"
      logoUrl="/assets/company-logo.svg"
      productName="Bargaining Bank"
      showRememberMe={true}
      showForgotPassword={true}
    />
  );
}

// ============================================================================
// Example 3: With Custom Handlers
// ============================================================================

export function LoginWithCustomHandlers() {
  const handleSuccess = (response: LoginResponse) => {
    // Send analytics event
    console.log('Login success analytics', {
      userId: response.user.id,
      timestamp: new Date().toISOString(),
    });

    // Custom session initialization
    sessionStorage.setItem('user', JSON.stringify(response.user));
    localStorage.setItem('token', response.token);
  };

  const handleError = (error: AuthError) => {
    // Log error to monitoring service
    console.error('Login error', {
      code: error.code,
      timestamp: new Date().toISOString(),
    });

    // Track failed login attempts
    if (error.code === 'INVALID_CREDENTIALS') {
      // Increment failed attempts counter
    }
  };

  return (
    <LoginPage
      onLoginSuccess={handleSuccess}
      onLoginError={handleError}
    />
  );
}

// ============================================================================
// Example 4: Custom Login Form Using useLogin Hook
// ============================================================================

export function CustomLoginForm() {
  const {
    values,
    errors: _errors,
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitting,
    canSubmit,
    getFieldError,
    hasFieldError,
    authError,
  } = useLogin({
    onSuccess: (response) => {
      console.log('Login successful:', response.user.name);
    },
    onError: (error) => {
      console.error('Login failed:', error.message);
    },
    validateOnBlur: true,
    validateOnChange: false,
  });

  return (
    <div className="custom-login-container">
      <h1>Custom Login</h1>

      {authError && (
        <div className="error-banner">
          {authError.message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={values.email}
            onChange={(e) => handleChange('email', e.target.value)}
            onBlur={() => handleBlur('email')}
            className={hasFieldError('email') ? 'error' : ''}
            disabled={isSubmitting}
          />
          {getFieldError('email') && (
            <span className="error-text">{getFieldError('email')}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={values.password}
            onChange={(e) => handleChange('password', e.target.value)}
            onBlur={() => handleBlur('password')}
            className={hasFieldError('password') ? 'error' : ''}
            disabled={isSubmitting}
          />
          {getFieldError('password') && (
            <span className="error-text">{getFieldError('password')}</span>
          )}
        </div>

        <div className="form-group">
          <label>
            <input
              type="checkbox"
              checked={values.rememberMe}
              onChange={(e) => handleChange('rememberMe', e.target.checked)}
              disabled={isSubmitting}
            />
            Remember me
          </label>
        </div>

        <button
          type="submit"
          disabled={!canSubmit || isSubmitting}
          className="submit-button"
        >
          {isSubmitting ? 'Logging in...' : 'Sign In'}
        </button>
      </form>
    </div>
  );
}

// ============================================================================
// Example 5: Login with Authentication Context
// ============================================================================

import { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  user: LoginResponse['user'] | null;
  login: (response: LoginResponse) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<LoginResponse['user'] | null>(null);

  const login = (response: LoginResponse) => {
    setUser(response.user);
    setIsAuthenticated(true);
    localStorage.setItem('token', response.token);
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

export function LoginWithContext() {
  const { login } = useAuth();

  return (
    <LoginPage
      onLoginSuccess={(response) => {
        login(response);
      }}
    />
  );
}

// ============================================================================
// Example 6: Login with React Router Protected Routes
// ============================================================================

import { Navigate, useLocation } from 'react-router-dom';

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

export function LoginWithRedirect() {
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || '/dashboard';

  return <LoginPage redirectTo={from} />;
}

// ============================================================================
// Example 7: Login with Error Tracking
// ============================================================================

export function LoginWithErrorTracking() {
  const trackError = (error: AuthError) => {
    // Send to error tracking service (e.g., Sentry)
    if (typeof window !== 'undefined' && (window as any).Sentry) {
      (window as any).Sentry.captureException(new Error(error.message), {
        tags: {
          errorCode: error.code,
          feature: 'login',
        },
      });
    }
  };

  return (
    <LoginPage
      onLoginError={(error) => {
        trackError(error);
      }}
    />
  );
}

// ============================================================================
// Example 8: Login with Analytics
// ============================================================================

export function LoginWithAnalytics() {
  const trackLoginSuccess = (response: LoginResponse) => {
    // Track with analytics service (e.g., Google Analytics)
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'login', {
        method: 'email',
        user_id: response.user.id,
      });
    }
  };

  const trackLoginFailure = (error: AuthError) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'login_failed', {
        error_code: error.code,
      });
    }
  };

  return (
    <LoginPage
      onLoginSuccess={trackLoginSuccess}
      onLoginError={trackLoginFailure}
    />
  );
}

// ============================================================================
// Example 9: Login with Loading Overlay
// ============================================================================

export function LoginWithLoadingOverlay() {
  const [isLoading, setIsLoading] = useState(false);


  const handleLoginComplete = () => {
    setIsLoading(false);
  };

  return (
    <>
      {isLoading && (
        <div className="loading-overlay">
          <div className="spinner">Loading...</div>
        </div>
      )}
      <LoginPage
        onLoginSuccess={(_response) => {
          handleLoginComplete();
          console.log('Login successful');
        }}
        onLoginError={(_error) => {
          handleLoginComplete();
          console.error('Login failed');
        }}
      />
    </>
  );
}

// ============================================================================
// Example 10: Multi-tenant Login
// ============================================================================

export function MultiTenantLogin() {
  const [tenant, setTenant] = useState('');

  return (
    <div>
      <div className="tenant-selector">
        <label htmlFor="tenant">Organization</label>
        <select
          id="tenant"
          value={tenant}
          onChange={(e) => setTenant(e.target.value)}
        >
          <option value="">Select Organization</option>
          <option value="company-a">Company A</option>
          <option value="company-b">Company B</option>
        </select>
      </div>

      {tenant && (
        <LoginPage
          productName={tenant === 'company-a' ? 'Company A Portal' : 'Company B Portal'}
          logoUrl={`/assets/logos/${tenant}.svg`}
          onLoginSuccess={(_response) => {
            // Store tenant context
            localStorage.setItem('tenant', tenant);
          }}
        />
      )}
    </div>
  );
}
