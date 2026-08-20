/**
 * Authentication Store (Zustand)
 * Manages user authentication state and tokens
 */

import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';

// Types
export interface User {
  id: string;
  email: string;
  firebaseUid: string;
  createdAt: string;
}

interface AuthState {
  // State
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  // Actions
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => Promise<void>;
  setAnonymousSession: (user: User, token: string) => Promise<void>;
  login: (user: User, token: string) => Promise<void>;
  logout: () => Promise<void>;
  initialize: () => Promise<void>;
}

// Secure storage keys
const TOKEN_KEY = 'auth_token';
const USER_KEY = 'user_data';

/**
 * Authentication Store
 * - Persists token to SecureStore (iOS Keychain / Android Keystore)
 * - Persists user data to SecureStore
 * - Auto-initializes on app start
 */
export const useAuthStore = create<AuthState>((set) => ({
  // Initial state
  user: null,
  token: null,
  isLoading: true,
  isAuthenticated: false,

  // Set user
  setUser: (user) => {
    set({
      user,
      isAuthenticated: !!user,
    });

    // Persist user to secure storage
    if (user) {
      SecureStore.setItemAsync(USER_KEY, JSON.stringify(user)).catch((error) => {
        console.error('Failed to save user to SecureStore:', error);
      });
    } else {
      SecureStore.deleteItemAsync(USER_KEY).catch((error) => {
        console.error('Failed to delete user from SecureStore:', error);
      });
    }
  },

  // Set token
  setToken: async (token) => {
    set({ token });

    // Persist token to secure storage
    if (token) {
      await SecureStore.setItemAsync(TOKEN_KEY, token);
    } else {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
    }
  },

  // Set anonymous session (token for API calls during onboarding, but NOT authenticated)
  setAnonymousSession: async (user, token) => {
    // Update state - keep isAuthenticated = false so onboarding is shown
    set({
      user,
      token,
      isAuthenticated: false,
      isLoading: false,
    });

    // Don't persist to SecureStore - anonymous session is temporary
    // Only persist after completing onboarding (login() or device-only mode)
    console.log('[authStore] Anonymous session set (not authenticated yet)');
  },

  // Login (set user + token)
  login: async (user, token) => {
    // Update state IMMEDIATELY (synchronously)
    set({
      user,
      token,
      isAuthenticated: true,
      isLoading: false,
    });

    // Save to secure storage in background (asynchronously)
    SecureStore.setItemAsync(TOKEN_KEY, token).catch((error) => {
      console.error('Failed to save token to SecureStore:', error);
    });
    SecureStore.setItemAsync(USER_KEY, JSON.stringify(user)).catch((error) => {
      console.error('Failed to save user to SecureStore:', error);
    });
  },

  // Logout (clear user + token)
  logout: async () => {
    console.log('[authStore] 🚨 logout() called - clearing token');
    console.log('[authStore] Stack trace:', new Error().stack);

    // Clear secure storage
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    await SecureStore.deleteItemAsync(USER_KEY);

    // Clear state
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });

    console.log('[authStore] Token cleared');
  },

  // Initialize (load from secure storage on app start)
  initialize: async () => {
    try {
      set({ isLoading: true });

      // Load token and user from secure storage
      const [token, userData] = await Promise.all([
        SecureStore.getItemAsync(TOKEN_KEY),
        SecureStore.getItemAsync(USER_KEY),
      ]);

      if (token && userData) {
        const user = JSON.parse(userData) as User;

        set({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    } catch (error) {
      console.error('Failed to initialize auth store:', error);
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },
}));

// Selectors (for optimized re-renders)
export const selectUser = (state: AuthState) => state.user;
export const selectToken = (state: AuthState) => state.token;
export const selectIsAuthenticated = (state: AuthState) => state.isAuthenticated;
export const selectIsLoading = (state: AuthState) => state.isLoading;

export default useAuthStore;
