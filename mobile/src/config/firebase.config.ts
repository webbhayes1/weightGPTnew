/**
 * Firebase Configuration
 * Initializes Firebase SDK with environment variables from Expo Constants
 */

import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import Constants from 'expo-constants';

// Get Firebase config from Expo Constants (loaded from app.config.js)
const extra = Constants.expoConfig?.extra || {};

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: extra.firebaseApiKey,
  authDomain: extra.firebaseAuthDomain,
  projectId: extra.firebaseProjectId,
  storageBucket: extra.firebaseStorageBucket,
  messagingSenderId: extra.firebaseMessagingSenderId,
  appId: extra.firebaseAppId,
  measurementId: extra.firebaseMeasurementId,
};

// Validate required configuration
const requiredKeys = [
  'apiKey',
  'authDomain',
  'projectId',
  'storageBucket',
  'messagingSenderId',
  'appId',
];

const missingKeys = requiredKeys.filter((key) => !firebaseConfig[key as keyof typeof firebaseConfig]);

if (missingKeys.length > 0) {
  throw new Error(
    `Missing required Firebase configuration: ${missingKeys.join(', ')}. ` +
    'Please check your .env file.'
  );
}

// Initialize Firebase
let app: FirebaseApp;
let auth: Auth;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);

  console.log('[Firebase] Initialized successfully');
  console.log('[Firebase] Project ID:', firebaseConfig.projectId);
} catch (error) {
  console.error('[Firebase] Initialization failed:', error);
  throw error;
}

export { app, auth };
export default { app, auth };
