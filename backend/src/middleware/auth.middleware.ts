/**
 * Authentication Middleware
 * Handles Firebase ID token verification and custom JWT verification
 */

import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { verifyIdToken } from '../config/firebase';
import { verifyJWT, JwtPayload } from '../utils/jwt.util';

const prisma = new PrismaClient();

// Extend Express Request to include user info
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
        firebaseUid?: string;
      };
    }
  }
}

/**
 * Extract token from Authorization header
 * Supports "Bearer <token>" format
 */
const extractToken = (authHeader: string | undefined): string | null => {
  if (!authHeader) {
    return null;
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return null;
  }

  return parts[1];
};

/**
 * Middleware: Verify Firebase ID token
 * Used during registration/login to verify Firebase authentication
 */
export const verifyFirebaseToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // DEBUG: Log the raw authorization header
    console.log('[verifyFirebaseToken] Authorization header:', req.headers.authorization ? `${req.headers.authorization.substring(0, 50)}...` : 'NO HEADER');

    const token = extractToken(req.headers.authorization);

    if (!token) {
      console.log('[verifyFirebaseToken] No token extracted from header');
      res.status(401).json({
        error: 'Authentication required',
        message: 'No authorization token provided',
      });
      return;
    }

    console.log('[verifyFirebaseToken] Token extracted:', token.substring(0, 20) + '...');

    // Verify Firebase ID token
    console.log('[verifyFirebaseToken] Verifying Firebase token...');
    const decodedToken = await verifyIdToken(token);
    console.log('[verifyFirebaseToken] Token verified! Firebase UID:', decodedToken.uid);

    // Look up user in database by Firebase UID
    console.log('[verifyFirebaseToken] Looking up user by Firebase UID:', decodedToken.uid);
    let user = await prisma.user.findUnique({
      where: { firebaseUid: decodedToken.uid },
    });
    console.log('[verifyFirebaseToken] User lookup result:', user ? `Found: ${user.id}` : 'NOT FOUND');

    // If not found by Firebase UID, try to find by email and link accounts
    if (!user && decodedToken.email) {
      console.log('[verifyFirebaseToken] Trying to find user by email:', decodedToken.email);
      const userByEmail = await prisma.user.findUnique({
        where: { email: decodedToken.email },
      });

      if (userByEmail) {
        console.log('[verifyFirebaseToken] Found user by email! Linking Firebase UID to existing account:', userByEmail.id);
        // Link the Firebase UID to the existing user
        user = await prisma.user.update({
          where: { id: userByEmail.id },
          data: { firebaseUid: decodedToken.uid },
        });
        console.log('[verifyFirebaseToken] Successfully linked Firebase UID to user:', user.id);
      }
    }

    // Auto-create user if doesn't exist (for anonymous users)
    if (!user) {
      console.log('[verifyFirebaseToken] User not found - auto-creating for anonymous Firebase user');
      try {
        user = await prisma.user.create({
          data: {
            firebaseUid: decodedToken.uid,
            email: decodedToken.email || `anonymous-${decodedToken.uid}@placeholder.com`,
            // Placeholder values for required fields (will be filled during onboarding)
            name: 'Anonymous User',
            passwordHash: 'FIREBASE_AUTH', // Placeholder, not used for Firebase auth
            goal: 'lose_weight',
            currentWeight: 150,
            goalWeight: 140,
            height: 68,
            age: 30,
            gender: 'male',
            activityLevel: 'lightly_active',
            eatingPattern: { meals: 3, snacks: 1 },
            workoutFrequency: 3,
            fitnessLevel: 'beginner',
            bmr: 1500,
            tdee: 1800,
            dailyCalories: 1600,
            macros: { protein_g: 120, carbs_g: 150, fat_g: 50 },
            // Anonymous users haven't completed onboarding yet
            onboardingComplete: false,
          },
        });
        console.log('[verifyFirebaseToken] User auto-created with ID:', user.id);
      } catch (createError: any) {
        // Handle race condition: user was created by another parallel request
        if (createError.code === 'P2002') {
          console.log('[verifyFirebaseToken] Race condition detected - user created by parallel request, retrying lookup');
          user = await prisma.user.findUnique({
            where: { firebaseUid: decodedToken.uid },
          });
          if (!user) {
            throw new Error('Failed to create or find user after race condition');
          }
          console.log('[verifyFirebaseToken] User found after retry:', user.id);
        } else {
          throw createError;
        }
      }
    }

    // Attach user info to request with database UUID (not Firebase UID)
    req.user = {
      userId: user.id, // Database UUID, not Firebase UID!
      email: user.email,
      firebaseUid: user.firebaseUid || undefined,
    };

    console.log('[verifyFirebaseToken] Auth successful! userId:', user.id);
    next();
  } catch (error) {
    console.error('[verifyFirebaseToken] ERROR:', error);
    res.status(401).json({
      error: 'Authentication failed',
      message: error instanceof Error ? error.message : 'Invalid Firebase token',
    });
  }
};

/**
 * Middleware: Verify custom JWT token
 * Used for all protected routes after initial authentication
 */
export const verifyCustomJWT = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = extractToken(req.headers.authorization);

    if (!token) {
      res.status(401).json({
        error: 'Authentication required',
        message: 'No authorization token provided',
      });
      return;
    }

    // Verify custom JWT
    const decoded: JwtPayload = verifyJWT(token);

    // Attach user info to request
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
    };

    next();
  } catch (error) {
    res.status(401).json({
      error: 'Authentication failed',
      message: error instanceof Error ? error.message : 'Invalid or expired token',
    });
  }
};

/**
 * Middleware: Require authentication
 * Use this for all protected routes
 *
 * Uses Firebase token verification since the mobile app sends Firebase ID tokens.
 * If you need custom JWT auth, use verifyCustomJWT directly.
 */
export const requireAuth = verifyFirebaseToken;

/**
 * Middleware: Optional authentication
 * Attaches user info if token is present, but doesn't block request
 */
export const optionalAuth = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = extractToken(req.headers.authorization);

    if (token) {
      const decoded: JwtPayload = verifyJWT(token);
      req.user = {
        userId: decoded.userId,
        email: decoded.email,
      };
    }

    next();
  } catch {
    // Token is invalid, but we don't block the request
    next();
  }
};

export default {
  verifyFirebaseToken,
  verifyCustomJWT,
  requireAuth,
  optionalAuth,
};
