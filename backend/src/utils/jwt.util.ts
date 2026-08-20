/**
 * JWT Utility Functions
 * Handles creation and verification of custom 7-day JWT tokens
 * Used after Firebase authentication for session management
 */

import jwt from 'jsonwebtoken';

// Types for JWT payload
export interface JwtPayload {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
}

/**
 * Generate a custom JWT token for authenticated user
 * @param userId - User ID from database
 * @param email - User email
 * @returns JWT token string
 */
export const generateJWT = (userId: string, email: string): string => {
  const secret = process.env.JWT_SECRET;
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';

  if (!secret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }

  const payload: JwtPayload = {
    userId,
    email,
  };

  // @ts-ignore - expiresIn type is correct but types package has issue
  return jwt.sign(payload, secret, { expiresIn });
};

/**
 * Verify and decode a JWT token
 * @param token - JWT token string
 * @returns Decoded JWT payload
 * @throws Error if token is invalid or expired
 */
export const verifyJWT = (token: string): JwtPayload => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }

  try {
    const decoded = jwt.verify(token, secret) as JwtPayload;
    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('JWT token has expired');
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('Invalid JWT token');
    }
    throw new Error('JWT verification failed');
  }
};

/**
 * Decode JWT without verification (for debugging)
 * @param token - JWT token string
 * @returns Decoded JWT payload or null
 */
export const decodeJWT = (token: string): JwtPayload | null => {
  try {
    const decoded = jwt.decode(token) as JwtPayload;
    return decoded;
  } catch {
    return null;
  }
};

export default {
  generateJWT,
  verifyJWT,
  decodeJWT,
};
