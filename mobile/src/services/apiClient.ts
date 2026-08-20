/**
 * API Client
 * Axios instance configured with authentication interceptors and error handling
 */

import axios, { AxiosError, InternalAxiosRequestConfig, AxiosRequestConfig, AxiosResponse } from 'axios';
import Constants from 'expo-constants';
import { useAuthStore } from '../store/authStore';
import { auth } from '../config/firebase.config';
import { onAuthStateChanged, User } from 'firebase/auth';

// =============================================================================
// FIREBASE AUTH STATE HELPER
// =============================================================================

// Promise that resolves when Firebase auth state is ready
let authReadyPromise: Promise<User | null> | null = null;
let authReadyResolved = false;

/**
 * Wait for Firebase auth to be ready (session restored from persistence)
 * This is needed because auth.currentUser may be null on app start until
 * Firebase finishes restoring the session from secure storage.
 */
function waitForAuthReady(): Promise<User | null> {
  // If we've already resolved once and have a current user, use it
  if (authReadyResolved && auth.currentUser) {
    return Promise.resolve(auth.currentUser);
  }

  // If we already have a pending promise, return it
  if (authReadyPromise && !authReadyResolved) {
    return authReadyPromise;
  }

  // If auth.currentUser is already set, return immediately
  if (auth.currentUser) {
    authReadyResolved = true;
    return Promise.resolve(auth.currentUser);
  }

  // Wait for the first auth state change (Firebase restoring session)
  authReadyPromise = new Promise((resolve) => {
    console.log('[apiClient] Setting up onAuthStateChanged listener...');
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      authReadyResolved = true;
      console.log('[apiClient] Firebase auth ready via listener, user:', user ? `UID: ${user.uid}` : 'NULL');
      resolve(user);
    });

    // Timeout after 3 seconds to avoid hanging forever
    setTimeout(() => {
      if (!authReadyResolved) {
        authReadyResolved = true;
        console.log('[apiClient] Firebase auth ready timeout (3s), using current state:', auth.currentUser ? 'has user' : 'no user');
        resolve(auth.currentUser);
      }
    }, 3000);
  });

  return authReadyPromise;
}

// Reset auth promise when user signs out (so next request waits again)
onAuthStateChanged(auth, (user) => {
  if (!user && authReadyResolved) {
    console.log('[apiClient] User signed out, resetting auth ready state');
    authReadyPromise = null;
    authReadyResolved = false;
  }
});

// API base URL from environment variables (via expo-constants)
const extra = Constants.expoConfig?.extra || {};
const API_URL = extra.apiUrl || 'http://localhost:3000';
const API_TIMEOUT = parseInt(extra.apiTimeout || '120000', 10); // 120 seconds for meal plan generation

// Create Axios instance
export const apiClient = axios.create({
  baseURL: `${API_URL}/api`,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// =============================================================================
// REQUEST INTERCEPTOR - Add auth token to requests
// =============================================================================

apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    console.log('[apiClient] 🔐 Request interceptor called for:', config.url);
    try {
      // Wait for Firebase auth to be ready (session restored from persistence)
      console.log('[apiClient] Waiting for Firebase auth to be ready...');
      const currentUser = await waitForAuthReady();
      console.log('[apiClient] Firebase currentUser:', currentUser ? `UID: ${currentUser.uid}` : 'NULL');

      if (currentUser) {
        // getIdToken(true) forces a refresh if the token is expired
        console.log('[apiClient] Calling getIdToken(true)...');
        const token = await currentUser.getIdToken(true);
        config.headers['authorization'] = `Bearer ${token}`;
        console.log('[apiClient] ✅ Set FRESH Firebase token:', `Bearer ${token.substring(0, 30)}...`);

        // Also update the store with the fresh token
        useAuthStore.getState().setToken(token);
      } else {
        // Fallback to stored token if no current user (shouldn't happen normally)
        console.log('[apiClient] ⚠️ No Firebase currentUser after waiting, checking stored token...');
        const storedToken = useAuthStore.getState().token;
        if (storedToken) {
          config.headers['authorization'] = `Bearer ${storedToken}`;
          console.log('[apiClient] Using STORED token (no Firebase user):', `Bearer ${storedToken.substring(0, 30)}...`);
        } else {
          console.log('[apiClient] ❌ No token available at all');
        }
      }

      return config;
    } catch (error) {
      console.error('[apiClient] ❌ Error getting fresh auth token:', error);
      // Fallback to stored token on error
      const storedToken = useAuthStore.getState().token;
      if (storedToken) {
        config.headers['authorization'] = `Bearer ${storedToken}`;
        console.log('[apiClient] Using STORED token after error');
      }
      return config;
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

// =============================================================================
// RESPONSE INTERCEPTOR - Handle errors and token refresh
// =============================================================================

apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Return successful responses as-is
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Handle 401 Unauthorized - token expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Don't logout on 401 for non-critical endpoints
      // These endpoints should fail gracefully without logging the user out
      const url = originalRequest.url || '';
      // All logging endpoints are non-critical - they should show errors, not logout
      const isNonCritical = url.includes('/logging/');

      if (isNonCritical) {
        console.log('[apiClient] Got 401 on non-critical endpoint - not logging out:', url);
        throw new Error('Authentication required for this feature.');
      }

      // Only logout if we currently have a token
      // This prevents logout() cascade during Fast Refresh reloads
      const currentToken = useAuthStore.getState().token;
      if (currentToken) {
        console.log('[apiClient] Got 401 with valid token - logging out');
        // Token expired - logout user
        // TODO: Implement token refresh flow with Firebase in Phase 2
        useAuthStore.getState().logout();
        throw new Error('Session expired. Please login again.');
      } else {
        console.log('[apiClient] Got 401 but no token in store - skipping logout');
        throw new Error('Authentication required.');
      }
    }

    // Handle other errors
    return Promise.reject(error);
  }
);

// =============================================================================
// TYPED API ERROR
// =============================================================================

export interface ApiError {
  message: string;
  code?: string;
  statusCode?: number;
  details?: unknown;
}

/**
 * Extract error message from Axios error
 */
export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ error?: string; message?: string }>;

    // Server error response
    if (axiosError.response?.data) {
      const data = axiosError.response.data;
      return data.error || data.message || 'An error occurred';
    }

    // Network error
    if (axiosError.message === 'Network Error') {
      return 'Unable to connect to server. Please check your internet connection.';
    }

    // Timeout error
    if (axiosError.code === 'ECONNABORTED') {
      return 'Request timeout. Please try again.';
    }

    // Generic axios error
    return axiosError.message;
  }

  // Generic error
  if (error instanceof Error) {
    return error.message;
  }

  return 'An unknown error occurred';
};

/**
 * Create typed API error
 */
export const createApiError = (error: unknown): ApiError => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ error?: string; message?: string; code?: string }>;

    return {
      message: getErrorMessage(error),
      code: axiosError.response?.data?.code || axiosError.code,
      statusCode: axiosError.response?.status,
      details: axiosError.response?.data,
    };
  }

  return {
    message: getErrorMessage(error),
  };
};

// =============================================================================
// API CLIENT METHODS
// =============================================================================

/**
 * GET request
 */
export const get = async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
  const response = await apiClient.get<T>(url, config);
  return response.data;
};

/**
 * POST request
 */
export const post = async <T>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig
): Promise<T> => {
  const response = await apiClient.post<T>(url, data, config);
  return response.data;
};

/**
 * PUT request
 */
export const put = async <T>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig
): Promise<T> => {
  const response = await apiClient.put<T>(url, data, config);
  return response.data;
};

/**
 * PATCH request
 */
export const patch = async <T>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig
): Promise<T> => {
  const response = await apiClient.patch<T>(url, data, config);
  return response.data;
};

/**
 * DELETE request
 */
export const del = async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
  const response = await apiClient.delete<T>(url, config);
  return response.data;
};

export default apiClient;
