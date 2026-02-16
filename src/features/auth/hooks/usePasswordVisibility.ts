/**
 * usePasswordVisibility Hook
 * 
 * Custom hook for managing password visibility toggle.
 */

import { useState, useCallback } from 'react';
import type { PasswordVisibility } from '../types/auth.types';

/**
 * usePasswordVisibility hook return type
 */
export interface UsePasswordVisibilityReturn {
  /** Current password visibility state */
  isVisible: boolean;
  /** Password input type attribute */
  inputType: 'password' | 'text';
  /** Toggle password visibility */
  toggleVisibility: () => void;
  /** Aria label for toggle button */
  toggleAriaLabel: string;
}

/**
 * Custom hook for password visibility management
 */
export function usePasswordVisibility(): UsePasswordVisibilityReturn {
  const [visibility, setVisibility] = useState<PasswordVisibility>('hidden');

  const toggleVisibility = useCallback(() => {
    setVisibility((prev) => (prev === 'hidden' ? 'visible' : 'hidden'));
  }, []);

  const isVisible = visibility === 'visible';
  const inputType = isVisible ? 'text' : 'password';
  const toggleAriaLabel = isVisible ? 'Hide password' : 'Show password';

  return {
    isVisible,
    inputType,
    toggleVisibility,
    toggleAriaLabel,
  };
}
