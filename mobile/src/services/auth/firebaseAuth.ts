/**
 * Firebase Authentication Service
 * Handles all Firebase Auth operations:
 * - Anonymous sign-in
 * - Email/password authentication
 * - Account linking (anonymous → authenticated)
 * - Google Sign-In (future)
 * - Apple Sign-In (future)
 */

import {
  signInAnonymously as firebaseSignInAnonymously,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  linkWithCredential,
  EmailAuthProvider,
  onAuthStateChanged,
  signOut as firebaseSignOut,
  User as FirebaseUser,
  AuthError,
} from 'firebase/auth';
import { auth } from '../../config/firebase.config';

// ==============================================
// Types
// ==============================================

export interface AuthResult {
  user: FirebaseUser;
  isNewUser: boolean;
  isAnonymous: boolean;
}

export interface LinkAccountResult {
  user: FirebaseUser;
  previousUid: string; // Anonymous UID (for data migration)
  newUid: string; // Authenticated UID
}

// ==============================================
// Anonymous Authentication
// ==============================================

/**
 * Sign in anonymously
 * - Called automatically on app launch
 * - Allows users to complete onboarding without account
 * - Can be upgraded to authenticated account later
 *
 * @returns AuthResult with anonymous user
 * @throws AuthError if sign-in fails
 */
export async function signInAnonymously(): Promise<AuthResult> {
  try {
    console.log('[FirebaseAuth] Signing in anonymously...');

    const userCredential = await firebaseSignInAnonymously(auth);
    const user = userCredential.user;

    console.log('[FirebaseAuth] Anonymous sign-in successful');
    console.log('[FirebaseAuth] Anonymous UID:', user.uid);

    return {
      user,
      isNewUser: true, // Anonymous users are always "new"
      isAnonymous: true,
    };
  } catch (error) {
    console.error('[FirebaseAuth] Anonymous sign-in failed:', error);
    throw error as AuthError;
  }
}

// ==============================================
// Email/Password Authentication
// ==============================================

/**
 * Sign in with email and password
 *
 * @param email - User's email address
 * @param password - User's password
 * @returns AuthResult with authenticated user
 * @throws AuthError if sign-in fails
 */
export async function signInWithEmail(
  email: string,
  password: string
): Promise<AuthResult> {
  try {
    console.log('[FirebaseAuth] Signing in with email:', email);

    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    console.log('[FirebaseAuth] Email sign-in successful');
    console.log('[FirebaseAuth] User UID:', user.uid);

    return {
      user,
      isNewUser: false,
      isAnonymous: false,
    };
  } catch (error) {
    console.error('[FirebaseAuth] Email sign-in failed:', error);
    throw error as AuthError;
  }
}

/**
 * Sign up with email and password (create new account)
 *
 * @param email - User's email address
 * @param password - User's password (min 6 characters)
 * @returns AuthResult with new authenticated user
 * @throws AuthError if sign-up fails
 */
export async function signUpWithEmail(
  email: string,
  password: string
): Promise<AuthResult> {
  try {
    console.log('[FirebaseAuth] Creating account with email:', email);

    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    console.log('[FirebaseAuth] Account created successfully');
    console.log('[FirebaseAuth] User UID:', user.uid);

    return {
      user,
      isNewUser: true,
      isAnonymous: false,
    };
  } catch (error) {
    console.error('[FirebaseAuth] Sign-up failed:', error);
    throw error as AuthError;
  }
}

// ==============================================
// Account Linking (Anonymous → Authenticated)
// ==============================================

/**
 * Link anonymous account to email/password credential
 * - Upgrades anonymous user to authenticated user
 * - Preserves anonymous UID for data migration
 * - After linking, use previousUid to migrate data
 *
 * @param email - User's email address
 * @param password - User's password (min 6 characters)
 * @returns LinkAccountResult with previousUid and newUid for migration
 * @throws AuthError if linking fails
 */
export async function linkAnonymousToEmail(
  email: string,
  password: string
): Promise<LinkAccountResult> {
  try {
    const currentUser = auth.currentUser;

    if (!currentUser) {
      throw new Error('No user is currently signed in');
    }

    if (!currentUser.isAnonymous) {
      throw new Error('Current user is not anonymous');
    }

    console.log('[FirebaseAuth] Linking anonymous account to email...');
    console.log('[FirebaseAuth] Anonymous UID:', currentUser.uid);

    // Store anonymous UID before linking
    const previousUid = currentUser.uid;

    // Create email credential
    const credential = EmailAuthProvider.credential(email, password);

    // Link credential to anonymous account
    const userCredential = await linkWithCredential(currentUser, credential);
    const user = userCredential.user;

    console.log('[FirebaseAuth] Account linking successful');
    console.log('[FirebaseAuth] New UID:', user.uid);
    console.log('[FirebaseAuth] Previous UID:', previousUid);

    // NOTE: Firebase preserves the UID when linking, so previousUid === newUid
    // But we return both for clarity and future-proofing

    return {
      user,
      previousUid,
      newUid: user.uid,
    };
  } catch (error) {
    console.error('[FirebaseAuth] Account linking failed:', error);
    throw error as AuthError;
  }
}

// ==============================================
// Auth State Management
// ==============================================

/**
 * Get current authenticated user
 *
 * @returns FirebaseUser | null
 */
export function getCurrentUser(): FirebaseUser | null {
  return auth.currentUser;
}

/**
 * Listen to authentication state changes
 * - Called when user signs in, signs out, or token refreshes
 *
 * @param callback - Function to call when auth state changes
 * @returns Unsubscribe function
 */
export function onAuthStateChange(
  callback: (user: FirebaseUser | null) => void
): () => void {
  return onAuthStateChanged(auth, callback);
}

/**
 * Check if current user is anonymous
 *
 * @returns boolean
 */
export function isAnonymous(): boolean {
  const user = getCurrentUser();
  return user ? user.isAnonymous : false;
}

/**
 * Check if user is authenticated (not anonymous)
 *
 * @returns boolean
 */
export function isAuthenticated(): boolean {
  const user = getCurrentUser();
  return user ? !user.isAnonymous : false;
}

// ==============================================
// Sign Out
// ==============================================

/**
 * Sign out current user
 * - Clears Firebase auth state
 * - App should clear local storage (authStore, onboardingStore)
 */
export async function signOut(): Promise<void> {
  try {
    console.log('[FirebaseAuth] Signing out...');

    await firebaseSignOut(auth);

    console.log('[FirebaseAuth] Sign out successful');
  } catch (error) {
    console.error('[FirebaseAuth] Sign out failed:', error);
    throw error as AuthError;
  }
}

// ==============================================
// Error Handling Helpers
// ==============================================

/**
 * Get user-friendly error message from Firebase AuthError
 *
 * @param error - Firebase AuthError
 * @returns User-friendly error message
 */
export function getAuthErrorMessage(error: AuthError): string {
  switch (error.code) {
    // Anonymous auth errors
    case 'auth/operation-not-allowed':
      return 'Anonymous authentication is not enabled. Please contact support.';

    // Email/password errors
    case 'auth/email-already-in-use':
      return 'This email is already registered. Please sign in instead.';
    case 'auth/invalid-email':
      return 'Invalid email address format.';
    case 'auth/weak-password':
      return 'Password is too weak. Use at least 6 characters.';
    case 'auth/user-not-found':
      return 'No account found with this email.';
    case 'auth/wrong-password':
      return 'Incorrect password.';
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please try again later.';

    // Account linking errors
    case 'auth/provider-already-linked':
      return 'This account is already linked to this provider.';
    case 'auth/credential-already-in-use':
      return 'This email is already used by another account.';

    // Network errors
    case 'auth/network-request-failed':
      return 'Network error. Please check your internet connection.';

    // Generic errors
    default:
      return 'Authentication failed. Please try again.';
  }
}

// ==============================================
// Future: Google Sign-In
// ==============================================

// TODO: Implement Google Sign-In
// export async function signInWithGoogle(): Promise<AuthResult> {
//   // Requires: @react-native-google-signin/google-signin
//   // Implementation: Phase 2 of account creation
// }

// TODO: Implement link anonymous to Google
// export async function linkAnonymousToGoogle(): Promise<LinkAccountResult> {
//   // Requires: @react-native-google-signin/google-signin
//   // Implementation: Phase 2 of account creation
// }

// ==============================================
// Future: Apple Sign-In
// ==============================================

// TODO: Implement Apple Sign-In
// export async function signInWithApple(): Promise<AuthResult> {
//   // Requires: @invertase/react-native-apple-authentication
//   // Implementation: Phase 2 of account creation
// }

// TODO: Implement link anonymous to Apple
// export async function linkAnonymousToApple(): Promise<LinkAccountResult> {
//   // Requires: @invertase/react-native-apple-authentication
//   // Implementation: Phase 2 of account creation
// }
