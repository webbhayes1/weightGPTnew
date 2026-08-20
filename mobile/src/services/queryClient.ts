/**
 * TanStack Query Client Setup
 * Configured with AsyncStorage persister for offline-first caching
 *
 * NOTE: Using AsyncStorage for Expo Go compatibility.
 * TODO: Switch to MMKV when moving to development build for better performance.
 * See: mobile/docs/MMKV_MIGRATION.md
 */

import { QueryClient } from '@tanstack/react-query';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create AsyncStorage adapter for TanStack Query
// NOTE: AsyncStorage is async, but we wrap it in a sync interface for the persister
const asyncStorageAdapter = {
  getItem: async (key: string) => {
    try {
      const value = await AsyncStorage.getItem(key);
      return value;
    } catch (error) {
      console.warn('[AsyncStorage] Failed to get item:', error);
      return null;
    }
  },
  setItem: async (key: string, value: string) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.error('[AsyncStorage] Failed to set item:', error);
    }
  },
  removeItem: async (key: string) => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('[AsyncStorage] Failed to remove item:', error);
    }
  },
};

// Create persister with error handling
export const persister = createSyncStoragePersister({
  storage: asyncStorageAdapter as any, // Type assertion needed for async storage
  key: 'REACT_QUERY_OFFLINE_CACHE',
  serialize: (data: unknown) => {
    try {
      return JSON.stringify(data);
    } catch (error) {
      console.error('[Persister] Failed to serialize:', error);
      return '';
    }
  },
  deserialize: (data: string) => {
    try {
      if (!data || data === '') {
        return undefined;
      }
      return JSON.parse(data);
    } catch (error) {
      console.error('[Persister] Failed to deserialize:', error);
      return undefined;
    }
  },
});

// Create Query Client with default options
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Cache time: 24 hours
      gcTime: 1000 * 60 * 60 * 24,

      // Stale time: 5 minutes
      staleTime: 1000 * 60 * 5,

      // Retry failed queries 3 times
      retry: 3,

      // Retry delay increases exponentially
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),

      // Refetch on window focus
      refetchOnWindowFocus: true,

      // Refetch on reconnect
      refetchOnReconnect: true,

      // Don't refetch on mount if data is fresh
      refetchOnMount: false,

      // Network mode: offlineFirst
      // - online: queries run normally
      // - offline: queries from cache, mutations queued
      // - always: queries always run (bypass offline check)
      networkMode: 'offlineFirst',
    },
    mutations: {
      // Retry failed mutations 2 times
      retry: 2,

      // Network mode for mutations
      networkMode: 'offlineFirst',
    },
  },
});

// Cache priority configuration (from Q3.7 Offline spec)
export const cachePriority = {
  // P0: Critical - Always cached, never evicted (8MB budget)
  P0_CURRENT_WEEK: 'current-week-meals-workouts',
  P0_USER_PROFILE: 'user-profile',
  P0_SAVED_ITEMS: 'saved-items-library',

  // P1: High - Cached, evicted only if storage full
  P1_LAST_3_WEEKS: 'last-3-weeks-history',
  P1_WEEKLY_SUMMARIES: 'weekly-summaries',
  P1_STREAK_DATA: 'streak-data',

  // P2: Medium - Cached, evicted after 7 days or if storage full
  P2_MONTHLY_SUMMARIES: 'monthly-summaries',
  P2_ACHIEVEMENTS: 'achievements',
  P2_BODY_MEASUREMENTS: 'body-measurements',

  // P3: Low - Cached, evicted after 24 hours or if storage full
  P3_AI_INSIGHTS: 'ai-insights',
  P3_GROCERY_LISTS: 'grocery-lists',
  P3_WEIGHT_GRAPH: 'weight-graph-data',
};

// Query keys (organized by feature)
export const queryKeys = {
  // Auth
  auth: {
    user: ['auth', 'user'],
  },

  // Meal Planning
  meals: {
    all: ['meals'],
    week: (weekStart: string) => ['meals', 'week', weekStart],
    detail: (id: string) => ['meals', 'detail', id],
    grocery: (weekStart: string) => ['meals', 'grocery', weekStart],
  },

  // Workout Planning
  workouts: {
    all: ['workouts'],
    week: (weekStart: string) => ['workouts', 'week', weekStart],
    detail: (id: string) => ['workouts', 'detail', id],
    library: ['workouts', 'library'],
  },

  // Logging
  logging: {
    daily: (date: string) => ['logging', 'daily', date],
    entry: (id: string) => ['logging', 'entry', id],
  },

  // Progress
  progress: {
    weight: ['progress', 'weight'],
    weekly: (weekStart: string) => ['progress', 'weekly', weekStart],
    monthly: (monthStart: string) => ['progress', 'monthly', monthStart],
    streak: ['progress', 'streak'],
    achievements: ['progress', 'achievements'],
    measurements: ['progress', 'measurements'],
  },

  // History & Saved
  history: {
    week: (weekStart: string) => ['history', 'week', weekStart],
    search: (query: string) => ['history', 'search', query],
  },
  saved: {
    all: ['saved', 'items'],
    byType: (type: string) => ['saved', 'items', type],
  },

  // Settings
  settings: {
    profile: ['settings', 'profile'],
    preferences: ['settings', 'preferences'],
  },
};

export default queryClient;
