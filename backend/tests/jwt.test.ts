/**
 * JWT Utility Tests
 * Tests for JWT generation and verification
 */

import { generateJWT, verifyJWT, decodeJWT } from '../src/utils/jwt.util';

describe('JWT Utilities', () => {
  const testUserId = 'test-user-123';
  const testEmail = 'test@example.com';

  describe('generateJWT', () => {
    it('should generate a valid JWT token', () => {
      const token = generateJWT(testUserId, testEmail);

      expect(typeof token).toBe('string');
      expect(token.length).toBeGreaterThan(0);
      expect(token.split('.')).toHaveLength(3); // JWT has 3 parts: header.payload.signature
    });

    it('should include userId and email in payload', () => {
      const token = generateJWT(testUserId, testEmail);
      const decoded = decodeJWT(token);

      expect(decoded).not.toBeNull();
      expect(decoded?.userId).toBe(testUserId);
      expect(decoded?.email).toBe(testEmail);
    });

    it('should include issued at (iat) timestamp', () => {
      const token = generateJWT(testUserId, testEmail);
      const decoded = decodeJWT(token);

      expect(decoded?.iat).toBeDefined();
      expect(typeof decoded?.iat).toBe('number');
    });

    it('should include expiration (exp) timestamp', () => {
      const token = generateJWT(testUserId, testEmail);
      const decoded = decodeJWT(token);

      expect(decoded?.exp).toBeDefined();
      expect(typeof decoded?.exp).toBe('number');

      // exp should be in the future
      expect(decoded!.exp!).toBeGreaterThan(Date.now() / 1000);
    });
  });

  describe('verifyJWT', () => {
    it('should verify a valid token', () => {
      const token = generateJWT(testUserId, testEmail);
      const verified = verifyJWT(token);

      expect(verified).toBeDefined();
      expect(verified.userId).toBe(testUserId);
      expect(verified.email).toBe(testEmail);
    });

    it('should throw error for invalid token', () => {
      const invalidToken = 'invalid.token.here';

      expect(() => verifyJWT(invalidToken)).toThrow('Invalid JWT token');
    });

    it('should throw error for malformed token', () => {
      const malformedToken = 'not-even-a-token';

      expect(() => verifyJWT(malformedToken)).toThrow();
    });

    it('should throw error for empty token', () => {
      expect(() => verifyJWT('')).toThrow();
    });
  });

  describe('decodeJWT', () => {
    it('should decode a valid token without verification', () => {
      const token = generateJWT(testUserId, testEmail);
      const decoded = decodeJWT(token);

      expect(decoded).not.toBeNull();
      expect(decoded?.userId).toBe(testUserId);
      expect(decoded?.email).toBe(testEmail);
    });

    it('should return null for invalid token', () => {
      const invalidToken = 'invalid.token.here';
      const decoded = decodeJWT(invalidToken);

      expect(decoded).toBeNull();
    });

    it('should return null for malformed token', () => {
      const malformedToken = 'not-even-a-token';
      const decoded = decodeJWT(malformedToken);

      expect(decoded).toBeNull();
    });
  });

  describe('Token Expiration', () => {
    it('should generate token that expires in 7 days by default', () => {
      const token = generateJWT(testUserId, testEmail);
      const decoded = decodeJWT(token);

      expect(decoded?.exp).toBeDefined();
      expect(decoded?.iat).toBeDefined();

      // Calculate expiration duration
      const duration = decoded!.exp! - decoded!.iat!;
      const sevenDaysInSeconds = 7 * 24 * 60 * 60;

      // Should be approximately 7 days (allow 1 second tolerance)
      expect(Math.abs(duration - sevenDaysInSeconds)).toBeLessThanOrEqual(1);
    });
  });
});
