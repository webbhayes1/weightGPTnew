/**
 * Navigation Type Definitions
 * Defines all navigation routes and params for type safety
 */

import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

/**
 * Root Stack Navigator (Main app navigation)
 */
export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<MainTabParamList>;
  Onboarding: undefined;
  // Add other root-level screens here (modals, etc.)
};

/**
 * Main Tab Navigator (Bottom tabs: Home, Log, Progress)
 */
export type MainTabParamList = {
  Home: NavigatorScreenParams<HomeStackParamList>;
  Log: NavigatorScreenParams<LogStackParamList>;
  Progress: undefined;
};

/**
 * Home Stack Navigator (nested in Home tab)
 */
export type HomeStackParamList = {
  HomeScreen: undefined;
  MealDetail: { mealId: string; date: string };
  WorkoutDetail: { workoutId: string; date: string };
  WeeklyMeals: undefined;
  WeeklyWorkouts: undefined;
  GroceryList: undefined;
  // Add more home-related screens
};

/**
 * Log Stack Navigator (nested in Log tab)
 */
export type LogStackParamList = {
  LogScreen: undefined;
  MealConfirmation: { parsedMeal: ParsedMealData; entryId?: string };
  WorkoutConfirmation: { parsedWorkout: ParsedWorkoutData; entryId?: string };
  WeightLog: undefined;
  ManualMealEntry: undefined;
  ManualWorkoutEntry: undefined;
};

// Logging data types
export interface ParsedMealItem {
  name: string;
  quantity: number;
  unit: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface ParsedMealData {
  items: ParsedMealItem[];
  confidence: 'high' | 'medium' | 'low';
  followUpNeeded: boolean;
  followUpType?: 'portion' | 'preparation' | 'restaurant' | 'confirmation' | 'brand' | 'specification' | 'quantity' | null;
  followUpQuestion?: string | null;
  quickOptions?: string[] | null; // AI-provided context-appropriate quick options
  isRestaurant?: boolean | null;
  restaurantName?: string | null;
}

export interface ParsedExercise {
  name: string;
  sets?: number;
  reps?: number;
  weight?: number;
  weightUnit?: 'lbs' | 'kg';
  durationMin?: number;
  distance?: number;
  distanceUnit?: 'miles' | 'km' | 'meters';
}

export interface ParsedWorkoutData {
  type: 'cardio' | 'strength' | 'balanced';
  name: string;
  durationMinutes: number;
  intensity: 'easy' | 'moderate' | 'hard';
  exercises: ParsedExercise[];
  caloriesBurned: number;
  confidence: 'high' | 'medium' | 'low';
  followUpNeeded: boolean;
  followUpType?: 'intensity' | 'duration' | 'exercises' | 'confirmation' | null;
  followUpQuestion?: string | null;
  quickOptions?: string[] | null; // AI-provided context-appropriate quick options
}

/**
 * Progress Stack Navigator (nested in Progress tab)
 */
export type ProgressStackParamList = {
  ProgressScreen: undefined;
  WeightGraph: undefined;
  Achievements: undefined;
  // Add more progress-related screens
};

// ==============================================================================
// SCREEN PROP TYPES
// ==============================================================================

// Root Stack Screen Props
export type RootStackScreenProps<T extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  T
>;

// Main Tab Screen Props
export type MainTabScreenProps<T extends keyof MainTabParamList> = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, T>,
  RootStackScreenProps<keyof RootStackParamList>
>;

// Home Stack Screen Props
export type HomeStackScreenProps<T extends keyof HomeStackParamList> = CompositeScreenProps<
  NativeStackScreenProps<HomeStackParamList, T>,
  MainTabScreenProps<'Home'>
>;

// Log Stack Screen Props
export type LogStackScreenProps<T extends keyof LogStackParamList> = CompositeScreenProps<
  NativeStackScreenProps<LogStackParamList, T>,
  MainTabScreenProps<'Log'>
>;

// Progress Stack Screen Props
export type ProgressStackScreenProps<T extends keyof ProgressStackParamList> = CompositeScreenProps<
  NativeStackScreenProps<ProgressStackParamList, T>,
  MainTabScreenProps<'Progress'>
>;

// ==============================================================================
// NAVIGATION HELPER TYPES
// ==============================================================================

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
