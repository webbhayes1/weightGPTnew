/**
 * Authentication Controller
 * Handles HTTP requests for authentication endpoints
 */

import { Request, Response } from 'express';
import { firebaseLogin } from '../services/auth.service';

/**
 * POST /api/auth/firebase-login
 * Authenticate with Firebase ID token
 *
 * Request body:
 * - idToken: string (Firebase ID token)
 * - onboardingData?: OnboardingData (required for new users)
 *
 * Response:
 * - user: User object
 * - token: Custom JWT token
 * - isNewUser: boolean
 */
export const handleFirebaseLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { idToken, onboardingData } = req.body;

    // Validate request
    if (!idToken) {
      res.status(400).json({
        error: 'Bad Request',
        message: 'idToken is required',
      });
      return;
    }

    // Call service
    const result = await firebaseLogin(idToken, onboardingData);

    // Return success response
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('[AuthController] Firebase login failed:', error);

    // Handle specific errors
    if (error instanceof Error) {
      // Firebase token verification errors
      if (error.message.includes('Invalid') || error.message.includes('expired')) {
        res.status(401).json({
          error: 'Unauthorized',
          message: error.message,
        });
        return;
      }

      // Missing onboarding data for new users
      if (error.message.includes('Onboarding data is required')) {
        res.status(400).json({
          error: 'Bad Request',
          message: error.message,
        });
        return;
      }

      // Email required error
      if (error.message.includes('Email is required')) {
        res.status(400).json({
          error: 'Bad Request',
          message: error.message,
        });
        return;
      }
    }

    // Generic error
    res.status(500).json({
      error: 'Internal Server Error',
      message: error instanceof Error ? error.message : 'Authentication failed',
    });
  }
};

export default {
  handleFirebaseLogin,
};
