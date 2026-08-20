/**
 * Authentication Routes
 * Defines all authentication-related endpoints
 */

import { Router } from 'express';
import { handleFirebaseLogin } from '../controllers/auth.controller';

const router = Router();

/**
 * POST /api/auth/firebase-login
 * Authenticate with Firebase ID token
 * - Verifies Firebase ID token
 * - Creates user if new (requires onboarding data)
 * - Returns custom JWT token for API access
 */
router.post('/firebase-login', handleFirebaseLogin);

export default router;
