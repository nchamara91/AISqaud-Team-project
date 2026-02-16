/**
 * Authentication Service Tests
 * 
 * Unit tests for authentication service functions
 */

import { isValidRedirectUrl, getSafeRedirectUrl } from '../auth.service';

describe('Authentication Service', () => {
  describe('isValidRedirectUrl', () => {
    it('should reject empty or null URLs', () => {
      expect(isValidRedirectUrl('')).toBe(false);
      expect(isValidRedirectUrl('   ')).toBe(false);
    });

    it('should reject absolute URLs (external redirects)', () => {
      expect(isValidRedirectUrl('http://example.com')).toBe(false);
      expect(isValidRedirectUrl('https://example.com')).toBe(false);
      expect(isValidRedirectUrl('//example.com')).toBe(false);
    });

    it('should reject javascript: and data: URIs', () => {
      expect(isValidRedirectUrl('javascript:alert(1)')).toBe(false);
      expect(isValidRedirectUrl('data:text/html,<script>alert(1)</script>')).toBe(false);
    });

    it('should reject URLs not starting with /', () => {
      expect(isValidRedirectUrl('dashboard')).toBe(false);
      expect(isValidRedirectUrl('profile/settings')).toBe(false);
    });

    it('should accept valid internal routes', () => {
      expect(isValidRedirectUrl('/dashboard')).toBe(true);
      expect(isValidRedirectUrl('/profile')).toBe(true);
      expect(isValidRedirectUrl('/settings')).toBe(true);
      expect(isValidRedirectUrl('/')).toBe(true);
    });

    it('should accept sub-routes of allowed paths', () => {
      expect(isValidRedirectUrl('/dashboard/overview')).toBe(true);
      expect(isValidRedirectUrl('/profile/edit')).toBe(true);
      expect(isValidRedirectUrl('/settings/security')).toBe(true);
    });

    it('should reject routes not in whitelist', () => {
      expect(isValidRedirectUrl('/admin')).toBe(false);
      expect(isValidRedirectUrl('/unauthorized')).toBe(false);
    });
  });

  describe('getSafeRedirectUrl', () => {
    it('should return valid redirect URL when provided', () => {
      expect(getSafeRedirectUrl('/dashboard')).toBe('/dashboard');
      expect(getSafeRedirectUrl('/profile')).toBe('/profile');
    });

    it('should return default URL for invalid redirect URL', () => {
      expect(getSafeRedirectUrl('http://evil.com')).toBe('/dashboard');
      expect(getSafeRedirectUrl('javascript:alert(1)')).toBe('/dashboard');
      expect(getSafeRedirectUrl('/admin')).toBe('/dashboard');
    });

    it('should return default URL when no redirect URL provided', () => {
      expect(getSafeRedirectUrl(undefined)).toBe('/dashboard');
    });

    it('should use custom default URL when provided', () => {
      expect(getSafeRedirectUrl(undefined, '/home')).toBe('/home');
      expect(getSafeRedirectUrl('http://evil.com', '/home')).toBe('/home');
    });

    it('should prefer valid redirect URL over default', () => {
      expect(getSafeRedirectUrl('/profile', '/dashboard')).toBe('/profile');
    });
  });
});
