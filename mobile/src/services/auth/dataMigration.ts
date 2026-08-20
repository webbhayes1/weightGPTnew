/**
 * Data Migration Service
 * Handles migrating user data from anonymous UID to authenticated UID
 * after account linking (anonymous → email/Google/Apple)
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { OnboardingData } from '../../types/onboarding.types';

// ==============================================
// Types
// ==============================================

export interface MigrationResult {
  success: boolean;
  migratedKeys: string[];
  errors: string[];
}

// ==============================================
// Storage Keys
// ==============================================

const STORAGE_KEYS = {
  onboardingData: (uid: string) => `onboarding_data_${uid}`,
  onboardingComplete: (uid: string) => `onboarding_complete_${uid}`,
  deviceOnlyMode: 'device_only_mode', // Not UID-specific
};

// ==============================================
// Migration Functions
// ==============================================

/**
 * Migrate all user data from anonymous UID to authenticated UID
 *
 * Flow:
 * 1. Read data from anonymous UID keys
 * 2. Write data to authenticated UID keys
 * 3. Delete anonymous UID keys
 * 4. Return migration result
 *
 * @param anonymousUid - Anonymous user's Firebase UID
 * @param authenticatedUid - Authenticated user's Firebase UID
 * @returns MigrationResult with success status and details
 */
export async function migrateUserData(
  anonymousUid: string,
  authenticatedUid: string
): Promise<MigrationResult> {
  console.log('[DataMigration] Starting migration...');
  console.log('[DataMigration] From UID:', anonymousUid);
  console.log('[DataMigration] To UID:', authenticatedUid);

  const migratedKeys: string[] = [];
  const errors: string[] = [];

  try {
    // Migrate onboarding data
    await migrateOnboardingData(anonymousUid, authenticatedUid, migratedKeys, errors);

    // Migrate onboarding completion flag
    await migrateOnboardingComplete(anonymousUid, authenticatedUid, migratedKeys, errors);

    // TODO: Add more data migration as needed
    // - Cached meal plans
    // - Cached workout plans
    // - Sync queue
    // - Offline data

    console.log('[DataMigration] Migration complete');
    console.log('[DataMigration] Migrated keys:', migratedKeys);
    console.log('[DataMigration] Errors:', errors);

    return {
      success: errors.length === 0,
      migratedKeys,
      errors,
    };
  } catch (error) {
    console.error('[DataMigration] Migration failed:', error);
    errors.push(error instanceof Error ? error.message : 'Unknown error');

    return {
      success: false,
      migratedKeys,
      errors,
    };
  }
}

/**
 * Migrate onboarding data
 */
async function migrateOnboardingData(
  anonymousUid: string,
  authenticatedUid: string,
  migratedKeys: string[],
  errors: string[]
): Promise<void> {
  const anonymousKey = STORAGE_KEYS.onboardingData(anonymousUid);
  const authenticatedKey = STORAGE_KEYS.onboardingData(authenticatedUid);

  try {
    console.log('[DataMigration] Migrating onboarding data...');

    // Read from anonymous key
    const data = await AsyncStorage.getItem(anonymousKey);

    if (data) {
      // Validate data structure
      const parsed = JSON.parse(data) as OnboardingData;

      // Write to authenticated key
      await AsyncStorage.setItem(authenticatedKey, JSON.stringify(parsed));

      // Delete anonymous key
      await AsyncStorage.removeItem(anonymousKey);

      migratedKeys.push(anonymousKey);
      console.log('[DataMigration] Onboarding data migrated successfully');
    } else {
      console.log('[DataMigration] No onboarding data found for anonymous user');
    }
  } catch (error) {
    console.error('[DataMigration] Failed to migrate onboarding data:', error);
    errors.push(`Onboarding data: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Migrate onboarding completion flag
 */
async function migrateOnboardingComplete(
  anonymousUid: string,
  authenticatedUid: string,
  migratedKeys: string[],
  errors: string[]
): Promise<void> {
  const anonymousKey = STORAGE_KEYS.onboardingComplete(anonymousUid);
  const authenticatedKey = STORAGE_KEYS.onboardingComplete(authenticatedUid);

  try {
    console.log('[DataMigration] Migrating onboarding completion flag...');

    const complete = await AsyncStorage.getItem(anonymousKey);

    if (complete) {
      await AsyncStorage.setItem(authenticatedKey, complete);
      await AsyncStorage.removeItem(anonymousKey);

      migratedKeys.push(anonymousKey);
      console.log('[DataMigration] Onboarding completion flag migrated');
    } else {
      console.log('[DataMigration] No onboarding completion flag found');
    }
  } catch (error) {
    console.error('[DataMigration] Failed to migrate onboarding completion flag:', error);
    errors.push(`Onboarding complete: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// ==============================================
// Backend Sync
// ==============================================

/**
 * Transform mobile OnboardingData format to backend expected format
 */
function transformOnboardingDataForBackend(mobileData: OnboardingData): any {
  // Map activity level (mobile uses 3 options, backend uses 4)
  const activityLevelMap: Record<string, string> = {
    'sedentary': 'sedentary',
    'moderately_active': 'moderately_active',
    'very_active': 'very_active',
  };

  // Map equipment type to array
  const equipmentMap: Record<string, string[]> = {
    'home_bodyweight': ['bodyweight'],
    'home_equipment': ['dumbbells', 'resistance_bands'],
    'full_gym': ['full_gym', 'machines', 'cables', 'dumbbells', 'barbells'],
  };

  // Build eating pattern object
  const eatingPattern = {
    mealsPerDay: mobileData.mealsPerDay || 3,
    snacksPerDay: mobileData.includesSnacks ? 2 : 0,
    preferredMealTimes: {
      breakfast: mobileData.mealPattern?.includes('breakfast') ? '08:00' : undefined,
      lunch: mobileData.mealPattern?.includes('lunch') ? '12:00' : undefined,
      dinner: mobileData.mealPattern?.includes('dinner') ? '18:00' : undefined,
    },
  };

  // Build dietary restrictions array from dietaryPreference
  const dietaryRestrictions: string[] = [];
  if (mobileData.dietaryPreference && mobileData.dietaryPreference !== 'none') {
    dietaryRestrictions.push(mobileData.dietaryPreference);
  }

  // Map fitness level based on workout frequency
  const workoutFrequency = mobileData.workoutDaysPreferred?.length || 0;
  let fitnessLevel: 'beginner' | 'intermediate' | 'advanced' = 'beginner';
  if (workoutFrequency >= 5) {
    fitnessLevel = 'advanced';
  } else if (workoutFrequency >= 3) {
    fitnessLevel = 'intermediate';
  }

  return {
    goal: mobileData.goalType || 'maintain',
    currentWeight: mobileData.currentWeight || 150,
    goalWeight: mobileData.goalWeight || mobileData.currentWeight || 150,
    goalDate: mobileData.goalDate ? new Date(mobileData.goalDate).toISOString() : undefined,
    height: mobileData.height || 70,
    age: mobileData.age || 30,
    sex: mobileData.sex || 'male',
    activityLevel: activityLevelMap[mobileData.activityLevel || 'sedentary'] || 'sedentary',
    dietaryRestrictions,
    dislikedFoods: mobileData.avoidFoods || [],
    preferredCuisines: mobileData.preferredCuisines || [],
    eatingPattern,
    workoutFrequency,
    workoutDuration: mobileData.sessionLength || 30,
    availableEquipment: equipmentMap[mobileData.equipmentType || 'home_bodyweight'] || ['bodyweight'],
    fitnessLevel,
    shoppingDay: mobileData.weekStartDay || 'flexible',
    weeklyResetDay: 'monday',
  };
}

/**
 * Send onboarding data to backend after account creation
 *
 * @param authenticatedUid - Authenticated user's Firebase UID
 * @param idToken - Firebase ID token for authentication
 * @returns Success boolean
 */
export async function syncOnboardingDataToBackend(
  authenticatedUid: string,
  idToken: string
): Promise<boolean> {
  try {
    console.log('[DataMigration] Syncing onboarding data to backend...');

    // Read onboarding data from authenticated UID key
    const key = STORAGE_KEYS.onboardingData(authenticatedUid);
    const dataString = await AsyncStorage.getItem(key);

    if (!dataString) {
      console.warn('[DataMigration] No onboarding data to sync');
      return false;
    }

    const mobileData = JSON.parse(dataString) as OnboardingData;

    // Transform mobile format to backend format
    const onboardingData = transformOnboardingDataForBackend(mobileData);
    console.log('[DataMigration] Transformed onboarding data:', JSON.stringify(onboardingData, null, 2));

    // Send to backend (get API URL from expo-constants)
    const extra = Constants.expoConfig?.extra || {};
    const apiUrl = extra.apiUrl || 'http://localhost:3000';
    const response = await fetch(`${apiUrl}/api/auth/firebase-login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        idToken,
        onboardingData,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[DataMigration] Backend response:', errorText);
      throw new Error(`Backend sync failed: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();

    console.log('[DataMigration] Backend sync successful');
    console.log('[DataMigration] User ID:', result.data?.user?.id);

    return true;
  } catch (error) {
    console.error('[DataMigration] Backend sync failed:', error);
    throw error; // Re-throw to allow caller to handle
  }
}

// ==============================================
// Utility Functions
// ==============================================

/**
 * Check if user has onboarding data stored
 *
 * @param uid - Firebase UID
 * @returns boolean
 */
export async function hasOnboardingData(uid: string): Promise<boolean> {
  const key = STORAGE_KEYS.onboardingData(uid);
  const data = await AsyncStorage.getItem(key);
  return !!data;
}

/**
 * Get onboarding data for user
 *
 * @param uid - Firebase UID
 * @returns OnboardingData or null
 */
export async function getOnboardingData(uid: string): Promise<OnboardingData | null> {
  try {
    const key = STORAGE_KEYS.onboardingData(uid);
    const data = await AsyncStorage.getItem(key);

    if (data) {
      return JSON.parse(data) as OnboardingData;
    }

    return null;
  } catch (error) {
    console.error('[DataMigration] Failed to get onboarding data:', error);
    return null;
  }
}

/**
 * Delete all data for a specific UID (cleanup)
 *
 * @param uid - Firebase UID
 */
export async function deleteUserData(uid: string): Promise<void> {
  try {
    console.log('[DataMigration] Deleting user data for UID:', uid);

    const keysToDelete = [
      STORAGE_KEYS.onboardingData(uid),
      STORAGE_KEYS.onboardingComplete(uid),
    ];

    await Promise.all(keysToDelete.map((key) => AsyncStorage.removeItem(key)));

    console.log('[DataMigration] User data deleted');
  } catch (error) {
    console.error('[DataMigration] Failed to delete user data:', error);
  }
}
