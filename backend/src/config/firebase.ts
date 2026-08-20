/**
 * Firebase Admin SDK Configuration
 * Initializes Firebase Admin for server-side authentication
 */

import * as admin from 'firebase-admin';
import path from 'path';

let firebaseApp: admin.app.App | null = null;

/**
 * Initialize Firebase Admin SDK
 * Uses service account credentials from environment
 */
export const initializeFirebase = (): admin.app.App => {
  if (firebaseApp) {
    return firebaseApp;
  }

  const serviceAccountPath = process.env.FIREBASE_ADMIN_KEY_PATH || './firebase-admin-key.json';
  const projectId = process.env.FIREBASE_PROJECT_ID || 'weightgpt';

  try {
    // Load service account from file
    const serviceAccount = require(path.resolve(process.cwd(), serviceAccountPath));

    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId,
    });

    console.log('✅ Firebase Admin SDK initialized successfully');
    return firebaseApp;
  } catch (error) {
    console.error('❌ Firebase Admin SDK initialization failed:', error);
    throw new Error('Failed to initialize Firebase Admin SDK');
  }
};

/**
 * Get Firebase Admin instance
 * Initializes if not already initialized
 */
export const getFirebaseAdmin = (): admin.app.App => {
  if (!firebaseApp) {
    return initializeFirebase();
  }
  return firebaseApp;
};

/**
 * Get Firebase Auth instance
 */
export const getFirebaseAuth = (): admin.auth.Auth => {
  const app = getFirebaseAdmin();
  return app.auth();
};

/**
 * Verify Firebase ID token
 * Used in authentication middleware
 */
export const verifyIdToken = async (idToken: string): Promise<admin.auth.DecodedIdToken> => {
  try {
    const auth = getFirebaseAuth();
    const decodedToken = await auth.verifyIdToken(idToken);
    return decodedToken;
  } catch (error) {
    console.error('[Firebase] Token verification failed:', error);
    throw new Error(`Invalid or expired Firebase ID token: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export default {
  initializeFirebase,
  getFirebaseAdmin,
  getFirebaseAuth,
  verifyIdToken,
};
