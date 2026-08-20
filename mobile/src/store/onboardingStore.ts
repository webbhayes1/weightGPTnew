/**
 * Onboarding Store
 * Zustand store for managing Q1 12-step onboarding flow state
 * (Removed: Meal Prep Time, Meal Variety, Budget, Grocery Day → moved to Settings)
 *
 * Persistence: Onboarding data is saved to AsyncStorage with Firebase UID as key
 * Format: `onboarding_data_${firebaseUid}`
 */

import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { OnboardingData, GoalType, ActivityLevel, EquipmentType, DietaryPreference, MealPrepTime, MealVarietyPreference } from '../types/onboarding.types';
import { getCurrentUser } from '../services/auth/firebaseAuth';

interface OnboardingStore {
  // Onboarding data
  data: OnboardingData;

  // Current step (1-16)
  currentStep: number;

  // Actions
  setGoalType: (goalType: GoalType) => void;
  setCurrentWeight: (weight: number, unit: 'lbs' | 'kg') => void;
  setGoalWeight: (weight: number) => void;
  setGoalDate: (date: Date, weeklyRate: number) => void;
  setPersonalDetails: (height: number, heightUnit: 'inches' | 'cm', age: number, sex: 'male' | 'female', hasParentalConsent?: boolean) => void;
  setActivityLevel: (level: ActivityLevel) => void;
  setCalculatedValues: (bmr: number, tdee: number, dailyCalories: number, macros: { protein_g: number; carbs_g: number; fat_g: number }) => void;
  setFoodPreferences: (dietaryPreference: DietaryPreference, avoidFoods: string[], preferredCuisines: string[]) => void;
  setMealPrepTime: (time: MealPrepTime) => void;
  setMealVarietyPreference: (preference: MealVarietyPreference) => void;
  setEatingPattern: (mealsPerDay: 2 | 3 | 4, mealPattern: string[], includesSnacks: boolean) => void;
  setBudgetPreference: (budgetConscious: boolean | null) => void;
  setGroceryShoppingDay: (day: 'sunday' | 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'flexible' | null) => void;
  setEquipmentType: (type: EquipmentType) => void;
  setWorkoutSchedule: (days: number[], sessionLength: 20 | 30 | 45 | 60) => void;
  setNotificationPreferences: (prefs: OnboardingData['notificationPreferences']) => void;
  setDisclaimerAccepted: (accepted: boolean) => void;

  // Navigation helpers
  nextStep: () => void;
  previousStep: () => void;
  goToStep: (step: number) => void;

  // Persistence helpers
  saveToStorage: () => Promise<void>;
  loadFromStorage: () => Promise<void>;

  // Reset store
  reset: () => void;
}

// Helper: Get storage key for current user
function getStorageKey(): string {
  const user = getCurrentUser();
  if (!user) {
    throw new Error('No user signed in - cannot save onboarding data');
  }
  return `onboarding_data_${user.uid}`;
}

// Initial state
const initialData: OnboardingData = {
  goalType: null,
  currentWeight: null,
  weightUnit: 'lbs',
  goalWeight: null,
  goalDate: null,
  weeklyRate: null,
  height: null,
  heightUnit: 'inches',
  age: null,
  sex: null,
  hasParentalConsent: false,
  activityLevel: null,
  bmr: null,
  tdee: null,
  dailyCalories: null,
  macros: null,
  dietaryPreference: null,
  avoidFoods: [],
  preferredCuisines: [],
  mealPrepTime: 'moderate', // Default (moved to Settings)
  mealVarietyPreference: 'balanced', // Default (moved to Settings)
  mealsPerDay: null,
  mealPattern: [],
  includesSnacks: false,
  budgetConscious: false, // Default (moved to Settings)
  weekStartDay: null, // Will be set on first plan generation
  equipmentType: null,
  workoutDaysPreferred: [],
  sessionLength: null,
  notificationPreferences: {
    dailyWeighIn: true,
    mealLogging: true,
    workoutReminders: true,
    motivationalCheckins: true,
  },
  disclaimerAccepted: false,
};

export const useOnboardingStore = create<OnboardingStore>((set) => ({
  data: initialData,
  currentStep: 1,

  // Step 2: Goal Type
  setGoalType: (goalType) =>
    set((state) => ({
      data: { ...state.data, goalType },
    })),

  // Step 3: Current Weight
  setCurrentWeight: (weight, unit) =>
    set((state) => ({
      data: {
        ...state.data,
        currentWeight: weight,
        weightUnit: unit,
      },
    })),

  // Step 4: Goal Weight
  setGoalWeight: (weight) =>
    set((state) => ({
      data: { ...state.data, goalWeight: weight },
    })),

  // Step 5: Goal Date
  setGoalDate: (date, weeklyRate) =>
    set((state) => ({
      data: {
        ...state.data,
        goalDate: date,
        weeklyRate,
      },
    })),

  // Step 6: Personal Details
  setPersonalDetails: (height, heightUnit, age, sex, hasParentalConsent = false) =>
    set((state) => ({
      data: {
        ...state.data,
        height,
        heightUnit,
        age,
        sex,
        hasParentalConsent,
      },
    })),

  // Step 7: Daily Activity Level
  setActivityLevel: (level) =>
    set((state) => ({
      data: { ...state.data, activityLevel: level },
    })),

  // Loading Break 1: Calculated values
  setCalculatedValues: (bmr, tdee, dailyCalories, macros) =>
    set((state) => ({
      data: {
        ...state.data,
        bmr,
        tdee,
        dailyCalories,
        macros,
      },
    })),

  // Step 8: Food Preferences
  setFoodPreferences: (dietaryPreference, avoidFoods, preferredCuisines) =>
    set((state) => ({
      data: {
        ...state.data,
        dietaryPreference,
        avoidFoods,
        preferredCuisines,
      },
    })),

  // Step 9: Meal Prep Time
  setMealPrepTime: (time) =>
    set((state) => ({
      data: { ...state.data, mealPrepTime: time },
    })),

  // Step 10: Meal Variety Preference
  setMealVarietyPreference: (preference) =>
    set((state) => ({
      data: { ...state.data, mealVarietyPreference: preference },
    })),

  // Step 11: Eating Pattern
  setEatingPattern: (mealsPerDay, mealPattern, includesSnacks) =>
    set((state) => ({
      data: {
        ...state.data,
        mealsPerDay,
        mealPattern,
        includesSnacks,
      },
    })),

  // Step 12: Budget Preference
  setBudgetPreference: (budgetConscious) =>
    set((state) => ({
      data: { ...state.data, budgetConscious },
    })),

  // Step 13: Grocery Shopping Day
  setGroceryShoppingDay: (day) =>
    set((state) => ({
      data: { ...state.data, weekStartDay: day },
    })),

  // Step 14: Equipment Access
  setEquipmentType: (type) =>
    set((state) => ({
      data: { ...state.data, equipmentType: type },
    })),

  // Step 15: Workout Schedule
  setWorkoutSchedule: (days, sessionLength) =>
    set((state) => ({
      data: {
        ...state.data,
        workoutDaysPreferred: days,
        sessionLength,
      },
    })),

  // Step 16: Notification Preferences
  setNotificationPreferences: (prefs) =>
    set((state) => ({
      data: { ...state.data, notificationPreferences: prefs },
    })),

  setDisclaimerAccepted: (accepted) =>
    set((state) => ({
      data: { ...state.data, disclaimerAccepted: accepted },
    })),

  // Navigation helpers
  nextStep: () =>
    set((state) => ({
      currentStep: state.currentStep + 1,
    })),

  previousStep: () =>
    set((state) => ({
      currentStep: Math.max(1, state.currentStep - 1),
    })),

  goToStep: (step) =>
    set(() => ({
      currentStep: step,
    })),

  // Persistence: Save onboarding data to AsyncStorage (keyed by Firebase UID)
  saveToStorage: async () => {
    try {
      const state = useOnboardingStore.getState();
      const key = getStorageKey();
      await AsyncStorage.setItem(key, JSON.stringify(state.data));
      console.log('[OnboardingStore] Saved to storage:', key);
    } catch (error) {
      console.error('[OnboardingStore] Failed to save to storage:', error);
    }
  },

  // Persistence: Load onboarding data from AsyncStorage (keyed by Firebase UID)
  loadFromStorage: async () => {
    try {
      const key = getStorageKey();
      const stored = await AsyncStorage.getItem(key);

      if (stored) {
        const data = JSON.parse(stored) as OnboardingData;
        set({ data });
        console.log('[OnboardingStore] Loaded from storage:', key);
      } else {
        console.log('[OnboardingStore] No stored data found for key:', key);
      }
    } catch (error) {
      console.error('[OnboardingStore] Failed to load from storage:', error);
    }
  },

  // Reset store
  reset: () =>
    set(() => ({
      data: initialData,
      currentStep: 1,
    })),
}));
