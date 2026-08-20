/**
 * Cache Clear Utility
 * Helper function to clear corrupted cache data
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Clear all TanStack Query cache from AsyncStorage
 * Use this if you encounter JSON parse errors or corrupted cache
 */
export const clearQueryCache = async (): Promise<void> => {
  try {
    console.log('[Cache] Clearing TanStack Query cache...');
    await AsyncStorage.removeItem('REACT_QUERY_OFFLINE_CACHE');
    console.log('[Cache] Cache cleared successfully');
  } catch (error) {
    console.error('[Cache] Failed to clear cache:', error);
    throw error;
  }
};

/**
 * Clear all AsyncStorage data (use with caution!)
 * This will remove ALL cached data including auth tokens
 */
export const clearAllStorage = async (): Promise<void> => {
  try {
    console.log('[Cache] Clearing ALL AsyncStorage data...');
    await AsyncStorage.clear();
    console.log('[Cache] All storage cleared successfully');
  } catch (error) {
    console.error('[Cache] Failed to clear storage:', error);
    throw error;
  }
};

/**
 * Get cache statistics
 */
export const getCacheStats = async (): Promise<{
  keys: readonly string[];
  totalSize: number;
}> => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    let totalSize = 0;

    for (const key of keys) {
      const value = await AsyncStorage.getItem(key);
      if (value) {
        totalSize += value.length;
      }
    }

    return {
      keys,
      totalSize,
    };
  } catch (error) {
    console.error('[Cache] Failed to get cache stats:', error);
    throw error;
  }
};

export default {
  clearQueryCache,
  clearAllStorage,
  getCacheStats,
};
