# Q0: Data Structures - Single Source of Truth

**Version:** 1.0
**Date:** November 6, 2025
**Purpose:** Centralized TypeScript interface definitions used across Q1, Q2, and Q3.0
**Status:** Reference Document

---

## Overview

This document serves as the **single source of truth** for all shared data structures across the WeightGPT application. All planning specifications (Q1, Q2, Q3.0) reference these interfaces to ensure consistency and prevent cross-document discrepancies.

---

## User & Profile

### UserProfile
```typescript
interface UserProfile {
  id: string;
  email: string;
  name: string;
  onboarding_complete: boolean;

  // From Q1 Onboarding
  goal: 'lose_weight' | 'gain_weight' | 'maintain';
  current_weight: number; // lbs
  goal_weight: number; // lbs (for maintain: goal_weight = current_weight)
  height: number; // inches
  age: number;
  gender: 'male' | 'female' | 'other';
  activity_level: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active';
  dietary_restrictions: string[]; // e.g., ['vegetarian', 'gluten_free']

  // Eating Pattern (Q1 v3.0)
  eating_pattern: {
    meals_per_day: 2 | 3 | 4;
    meal_pattern: ('breakfast' | 'lunch' | 'dinner' | 'snack')[]; // User's actual meal types
    includes_snacks: boolean;
  };

  workout_frequency: number; // days per week
  available_equipment: string[]; // e.g., ['dumbbells', 'barbell', 'gym']
  fitness_level: 'beginner' | 'intermediate' | 'advanced';

  // Calculated Metrics
  bmr: number; // Basal Metabolic Rate
  tdee: number; // Total Daily Energy Expenditure
  daily_calories: number; // Target calories/day
  macros: {
    protein_g: number;
    carbs_g: number;
    fat_g: number;
  };

  // Preferences
  favorites: string[]; // Meal/workout IDs
  dislikes: string[]; // Meal/workout IDs

  // Tracking
  streak_current: number;
  streak_longest: number;
  weekly_reset_day: 'monday' | 'sunday'; // Default: monday
  shopping_day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday' | 'flexible';
  notifications_enabled: boolean;

  // Maintenance Weight Monitoring (Q1 v3.1)
  maintenance_threshold?: number; // 0.05 = 5% variance (only for maintain goal)
  initial_maintenance_weight?: number; // Starting weight for maintenance users

  // Timestamps
  created_at: Date;
  updated_at: Date;
  subscription_status: 'trial' | 'active' | 'expired';
}
```

---

## Meals & Nutrition

### Meal
```typescript
interface Meal {
  id: string;
  user_id: string;
  meal_plan_id: string; // Parent weekly plan
  day_of_week: 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = Monday
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';

  // Meal Details
  name: string;
  description?: string;
  image_url?: string; // AI-generated or stock photo

  // Nutrition
  calories: number;
  macros: {
    protein_g: number;
    carbs_g: number;
    fat_g: number;
  };

  // Recipe
  ingredients: Ingredient[];
  recipe_steps: RecipeStep[];
  prep_time_min: number;
  cook_time_min: number;

  // Metadata
  is_favorite: boolean;
  feedback?: MealFeedback;
  logged: boolean;
  logged_at?: Date;
}
```

### Ingredient
```typescript
interface Ingredient {
  id: string;
  name: string;
  quantity: number;
  unit: 'count' | 'oz' | 'lb' | 'cup' | 'tbsp' | 'tsp' | 'package'; // US measurements only (v2.1)
  category: 'proteins' | 'produce' | 'dairy-eggs' | 'pantry' | 'spices' | 'frozen' | 'bakery' | 'other'; // Store section grouping (v2.1)
  notes?: string; // "(optional)" or "(or substitute X)"
}
```

### RecipeStep
```typescript
interface RecipeStep {
  step_number: number;
  instruction: string;
}
```

### MealFeedback
```typescript
interface MealFeedback {
  liked: boolean | null; // true = thumbs up, false = thumbs down, null = no rating
  feedback_text?: string;
  timestamp: Date;
}
```

### GroceryItem
```typescript
interface GroceryItem {
  item: string;
  quantity: number;
  unit: 'count' | 'oz' | 'lb' | 'cup' | 'tbsp' | 'tsp' | 'package'; // US measurements only (v2.1)
  category: 'proteins' | 'produce' | 'dairy-eggs' | 'pantry' | 'spices' | 'frozen' | 'bakery' | 'other'; // Categorized by store section (v2.1)
  purchased: boolean; // User can manually check off items they already have
}
```

---

## Workouts & Fitness

### Workout
```typescript
interface Workout {
  id: string;
  user_id: string;
  workout_plan_id: string;
  day_of_week: 0 | 1 | 2 | 3 | 4 | 5 | 6;

  // Workout Details
  name: string; // "Upper Body Strength", "HIIT Cardio"
  type: 'strength' | 'cardio';
  workout_category: 'upper_body' | 'lower_body' | 'full_body' | 'core' | 'cardio' | 'hiit' | 'flexibility';
  duration_min: number;
  estimated_calories: number;

  // Exercises
  exercises: Exercise[];

  // Metadata
  is_favorite: boolean;
  logged: boolean;
  logged_at?: Date;
  actual_calories_burned?: number; // If logged with actual data
}
```

### Exercise
```typescript
interface Exercise {
  id: string;
  name: string; // "Bench Press", "Squats"
  sets?: number; // For strength
  reps?: number; // For strength
  duration_min?: number; // For cardio
  equipment?: string[]; // ["barbell", "bench"]
  notes?: string;
}
```

---

## Logging & Tracking

### LoggedEntry
```typescript
interface LoggedEntry {
  id: string;
  user_id: string;
  date: Date; // Which day this entry applies to
  type: 'meal' | 'workout' | 'weight';

  // Meal-specific
  meal?: {
    name: string;
    meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
    calories: number;
    macros: {
      protein_g: number;
      carbs_g: number;
      fat_g: number;
    };
    source: 'planned' | 'custom'; // Planned from week or custom logged
    planned_meal_id?: string; // If source = 'planned'
    replaced_meal_id?: string; // If this entry replaced a planned meal
    image_url?: string;
  };

  // Workout-specific
  workout?: {
    name: string;
    type: 'strength' | 'cardio';
    duration_min: number;
    calories_burned: number;
    source: 'planned' | 'custom';
    planned_workout_id?: string;
    replaced_workout_id?: string;
  };

  // Weight-specific
  weight?: {
    weight_lbs: number;
    notes?: string;
  };

  // Metadata (v1.2)
  logged_at: Date;        // When user actually performed this meal/workout/weigh-in
  created_at: Date;       // When entry was first created in system
  updated_at?: Date;      // When entry was last modified (optional, only if edited)
  is_favorite: boolean;
  is_disliked: boolean;
}
```

### DailySummary
```typescript
interface DailySummary {
  user_id: string;
  date: Date;

  // Nutrition Totals
  calories_consumed: number;
  calories_target: number;
  macros_consumed: {
    protein_g: number;
    carbs_g: number;
    fat_g: number;
  };
  macros_target: {
    protein_g: number;
    carbs_g: number;
    fat_g: number;
  };

  // Workout Totals
  workouts_completed: number;
  workouts_planned: number;
  total_exercise_min: number;
  calories_burned: number;

  // Meals
  meals_logged: number;
  meals_planned: number;

  // Status
  all_meals_logged: boolean;
  all_workouts_logged: boolean;
  streak_maintained: boolean; // For streak calculation
}
```

---

## Plans

### MealPlan
```typescript
interface MealPlan {
  id: string;
  user_id: string;
  week_start_date: Date; // Monday
  week_end_date: Date; // Sunday
  status: 'active' | 'upcoming' | 'past';

  meals: Meal[]; // 14-28 meals depending on user's eating_pattern
  grocery_list: GroceryItem[];

  generated_at: Date;
  regeneration_count: number; // How many times user has regenerated this week
}
```

### WorkoutPlan
```typescript
interface WorkoutPlan {
  id: string;
  user_id: string;
  week_start_date: Date;
  week_end_date: Date;
  status: 'active' | 'upcoming' | 'past';

  workouts: Workout[]; // Based on user's workout_frequency (e.g., 3-5 per week)

  generated_at: Date;
}
```

---

## Progress & Analytics

### WeeklyProgress
```typescript
interface WeeklyProgress {
  user_id: string;
  week_start_date: Date;

  // Weight
  starting_weight: number;
  ending_weight: number;
  weight_change: number; // Can be negative

  // Adherence
  meals_logged: number;
  meals_planned: number;
  adherence_rate: number; // 0-1

  workouts_completed: number;
  workouts_planned: number;
  workout_adherence_rate: number;

  // Nutrition Averages
  avg_calories_per_day: number;
  avg_protein_per_day: number;

  // Streak
  days_with_full_logging: number; // 0-7
  streak_maintained: boolean;
}
```

### Achievement
```typescript
interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked_at?: Date;
  progress?: number; // 0-1 for partially completed achievements
}
```

---

## Validation Rules

### Calorie Validation Ranges (v1.2)
```typescript
const CALORIE_RANGES = {
  breakfast: { min: 150, max: 800 },
  lunch: { min: 300, max: 1200 },
  dinner: { min: 300, max: 1500 },
  snack: { min: 50, max: 400 },
};
```

### Macro Validation
```typescript
const MACRO_RANGES = {
  protein: { min: 0, max: 200 }, // grams per meal
  carbs: { min: 0, max: 300 },
  fat: { min: 0, max: 150 },
};
```

### Maintenance Weight Threshold (v3.1)
```typescript
const MAINTENANCE_VARIANCE = 0.05; // 5% variance triggers notification
```

---

## Enums & Constants

### Meal Types
```typescript
type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';
```

### Workout Types
```typescript
type WorkoutType = 'strength' | 'cardio';
```

### Goal Types
```typescript
type GoalType = 'lose_weight' | 'gain_weight' | 'maintain';
```

### Activity Levels
```typescript
type ActivityLevel = 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active';
```

### Measurement Units (US Only - v2.1)
```typescript
type MeasurementUnit = 'count' | 'oz' | 'lb' | 'cup' | 'tbsp' | 'tsp' | 'package';
```

### Ingredient Categories (Store Sections - v2.1)
```typescript
type IngredientCategory = 'proteins' | 'produce' | 'dairy-eggs' | 'pantry' | 'spices' | 'frozen' | 'bakery' | 'other';
```

---

## Notes

- **Timestamps:** All Date fields use ISO 8601 format in API responses
- **Measurements:** US units only (no metric) for ingredients (v2.1)
- **Meal Pattern:** Filtered based on user's eating_pattern from Q1 (v3.0)
- **Maintenance Tracking:** 5% variance monitoring added for maintain goal users (v3.1)
- **Data Sync:** All structures support offline mode with queued sync

---

**Document Version:** 1.0
**Created:** November 6, 2025
**Last Updated:** November 6, 2025
**Status:** Reference Document
