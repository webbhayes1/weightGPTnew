/**
 * Onboarding Types
 * TypeScript interfaces for Q1 16-step onboarding flow
 * (Step 17 removed - account setup moved to after paywall)
 */

// Goal types from Q1 spec
export type GoalType = 'lose_weight' | 'gain_weight' | 'maintain';

// Activity levels from Q1 spec Step 7
export type ActivityLevel = 'sedentary' | 'moderately_active' | 'very_active';

// Equipment types from Q1 spec Step 14
export type EquipmentType = 'home_bodyweight' | 'home_equipment' | 'full_gym';

// Dietary preferences from Q1 spec Step 8
export type DietaryPreference = 'none' | 'vegetarian' | 'vegan' | 'pescatarian' | 'keto' | 'custom';

// Meal prep time from Q1 spec Step 9
export type MealPrepTime = 'minimal' | 'moderate' | 'extended';

// Meal variety preference from Q1 spec Step 10
export type MealVarietyPreference = 'meal_prep_style' | 'maximum_variety' | 'balanced';

// Onboarding data structure (maps to Q1 16-step flow)
export interface OnboardingData {
  // Step 2: Goal Type
  goalType: GoalType | null;

  // Step 3: Current Weight
  currentWeight: number | null; // in lbs
  weightUnit: 'lbs' | 'kg';

  // Step 4: Goal Weight (skipped for maintain)
  goalWeight: number | null; // in lbs

  // Step 5: Goal Date (skipped for maintain)
  goalDate: Date | null;
  weeklyRate: number | null; // calculated weight change per week

  // Step 6: Personal Details
  height: number | null; // in inches
  heightUnit: 'inches' | 'cm';
  age: number | null;
  sex: 'male' | 'female' | null;
  hasParentalConsent: boolean; // for age 13-17

  // Step 7: Daily Activity Level
  activityLevel: ActivityLevel | null;

  // Calculated values (from Loading Break 1)
  bmr: number | null;
  tdee: number | null;
  dailyCalories: number | null;
  macros: {
    protein_g: number;
    carbs_g: number;
    fat_g: number;
  } | null;

  // Step 8: Food Preferences
  dietaryPreference: DietaryPreference | null;
  avoidFoods: string[]; // array of food names to avoid
  preferredCuisines: string[]; // array of cuisine types

  // Step 9: Meal Prep Time
  mealPrepTime: MealPrepTime | null;

  // Step 10: Meal Variety Preference
  mealVarietyPreference: MealVarietyPreference | null;

  // Step 11: Eating Pattern
  mealsPerDay: 2 | 3 | 4 | null;
  mealPattern: string[]; // e.g., ["breakfast", "lunch", "dinner"]
  includesSnacks: boolean;

  // Step 12: Budget Preference (optional)
  budgetConscious: boolean | null;

  // Step 13: Grocery Shopping Day (optional)
  weekStartDay: 'sunday' | 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'flexible' | null;

  // Step 14: Equipment Access
  equipmentType: EquipmentType | null;

  // Step 15: Workout Schedule
  workoutDaysPreferred: number[]; // array of day indices (0=Sunday, 6=Saturday - standard JS)
  sessionLength: 20 | 30 | 45 | 60 | null;

  // Step 16: Preferences & Consent (FINAL)
  notificationPreferences: {
    dailyWeighIn: boolean;
    mealLogging: boolean;
    workoutReminders: boolean;
    motivationalCheckins: boolean;
  };
  disclaimerAccepted: boolean;
}

// Stack navigation params for onboarding screens
export type OnboardingStackParamList = {
  Welcome: undefined; // Step 1
  GoalType: undefined; // Step 2
  CurrentWeight: undefined; // Step 3
  GoalWeight: undefined; // Step 4
  GoalDate: undefined; // Step 5
  PersonalDetails: undefined; // Step 6
  DailyActivityLevel: undefined; // Step 7
  LoadingBreak1: undefined; // Loading screen
  FoodPreferences: undefined; // Step 8
  MealPrepTime: undefined; // Step 9
  MealVariety: undefined; // Step 10
  EatingPattern: undefined; // Step 11
  BudgetPreference: undefined; // Step 12
  GroceryShoppingDay: undefined; // Step 13
  EquipmentAccess: undefined; // Step 14
  LoadingBreak2: undefined; // Loading screen
  WorkoutSchedule: undefined; // Step 15
  PreferencesConsent: undefined; // Step 16 (FINAL)
  LoadingBreak3: undefined; // Final loading & plan generation
  // Phase 2.5: Value Demo Screens
  ValueDemoSuccessPath: undefined; // Value demo 1: Weight projection graph
  ValueDemoDailyNutrition: undefined; // Value demo 2: Calorie/macro targets
  ValueDemoWorkouts: undefined; // Value demo 3: Workout schedule preview
  // Phase 2.5: Paywall
  Paywall: undefined; // Subscription purchase flow
  // Session 35: Post-Paywall Account Creation
  AccountSetup: undefined; // Account creation screen (email/Google/Apple/skip)
  EmailAuth: undefined; // Email/password authentication screen
  // Post-Paywall Flow
  Rating: undefined; // App rating screen (after account setup)
};

// Timeline validation result (from backend calculations.util.ts)
export interface TimelineValidationResult {
  valid: boolean;
  weeklyRate: number;
  weeks: number;
  error?: string;
  recommendedWeeks?: number;
  recommendedDate?: Date;
}

// Calorie adjustment result (from backend calculations.util.ts)
export interface CalorieAdjustmentResult {
  calories: number;
  adjusted: boolean;
  warning?: string;
  originalCalories: number;
  newTimeline?: Date;
}
