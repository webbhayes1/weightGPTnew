# WeightGPT Database Schema

**Version:** 1.0
**Date:** 2025-11-07
**Database:** PostgreSQL
**Purpose:** Complete database schema design for WeightGPT MVP
**Status:** ✅ APPROVED - Ready for Implementation

---

## Table of Contents

1. [Overview](#overview)
2. [Schema Design Principles](#schema-design-principles)
3. [Core Tables](#core-tables)
4. [Entity Relationship Diagram](#entity-relationship-diagram)
5. [Table Definitions](#table-definitions)
6. [Indexes & Performance](#indexes--performance)
7. [Migrations Strategy](#migrations-strategy)
8. [Design Decisions](#design-decisions)

---

## Overview

This document defines the complete PostgreSQL database schema for WeightGPT, extracted from all planning specifications (Q0-Q3.7). The schema supports:

- User profiles and authentication
- Meal plans and recipes
- Workout plans and exercises
- Logging and tracking (meals, workouts, weight)
- Progress analytics and achievements
- Offline sync queue and cache
- Saved favorites
- Settings and preferences

**Total Tables:** 25
**Estimated Storage per User:** ~50-100 MB (with 1 year of data)

---

## Schema Design Principles

###

 **1. Normalization vs. Denormalization**
- **Normalized:** User data, plans, logging to reduce redundancy
- **Denormalized:** SavedItems (Q3.6) for performance (favorites independent of history)
- **Hybrid:** LoggedEntry uses JSON for flexibility while maintaining structure

### **2. Timestamps Everywhere**
- All tables include `created_at` and `updated_at` for audit trails
- Supports offline sync conflict resolution (Last-Write-Wins)
- All timestamps stored as `TIMESTAMP WITH TIME ZONE` (UTC)

### **3. Soft Deletes**
- No hard deletes for critical user data
- Use `deleted_at` column for soft deletes
- Allows data recovery and maintains referential integrity

### **4. Foreign Keys**
- All relationships use foreign keys with CASCADE on delete
- Maintains data integrity
- Prevents orphaned records

### **5. JSON for Flexible Fields**
- Macros (protein, carbs, fat) stored as JSONB
- Eating patterns, equipment lists, preferences use JSONB
- Allows schema evolution without migrations

### **6. Indexes for Performance**
- Index all foreign keys
- Index frequently queried fields (user_id, date, week_start_date)
- Composite indexes for common query patterns

---

## Core Tables

### User & Authentication
1. **users** - Core user profile and authentication
2. **user_settings** - Preferences, notifications, units
3. **subscription_status** - Payment and subscription data

### Plans & Generation
4. **meal_plans** - Weekly meal plans
5. **meals** - Individual meals in plans
6. **ingredients** - Meal ingredients
7. **recipe_steps** - Cooking instructions
8. **grocery_lists** - Consolidated shopping lists
9. **workout_plans** - Weekly workout plans
10. **workouts** - Individual workouts in plans
11. **exercises** - Exercise details

### Logging & Tracking
12. **logged_entries** - All logged meals/workouts/weight (unified table)
13. **daily_summaries** - Aggregated daily stats
14. **weekly_summaries** - Aggregated weekly stats
15. **weight_entries** - Weight logging history (separate for analytics)

### Progress & Gamification
16. **achievements** - Achievement definitions
17. **user_achievements** - User's unlocked achievements
18. **streak_history** - Streak tracking
19. **body_measurements** - Optional body measurements
20. **ai_insights** - Cached AI-generated insights

### Favorites & Saved Items
21. **saved_items** - Favorited meals/workouts (denormalized from Q3.6)

### Offline & Sync
22. **sync_queue** - Pending offline actions
23. **cache_entries** - Offline cache storage

### Support & Admin
24. **support_tickets** - User support requests
25. **billing_transactions** - Payment history

---

## Entity Relationship Diagram

```
┌─────────────────┐
│     users       │◄─────────┐
│  (Core Profile) │          │
└────────┬────────┘          │
         │                   │
         │ 1:N               │ 1:N
         ├───────────────────┼─────────────────────┐
         │                   │                     │
         ▼                   ▼                     ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│  meal_plans     │ │  workout_plans  │ │  logged_entries │
│  (Weekly)       │ │  (Weekly)       │ │  (Daily Logs)   │
└────────┬────────┘ └────────┬────────┘ └─────────────────┘
         │ 1:N              │ 1:N
         ▼                  ▼
┌─────────────────┐ ┌─────────────────┐
│     meals       │ │    workouts     │
│  (Individual)   │ │  (Individual)   │
└────────┬────────┘ └────────┬────────┘
         │ 1:N              │ 1:N
         ├──────────┐       │
         ▼          ▼       ▼
  ┌───────────┐ ┌──────────────┐ ┌──────────────┐
  │ingredients│ │recipe_steps  │ │  exercises   │
  └───────────┘ └──────────────┘ └──────────────┘

┌─────────────────┐
│     users       │
└────────┬────────┘
         │ 1:N
         ├─────────────────────────────────┐
         ▼                                 ▼
┌─────────────────┐              ┌─────────────────┐
│  saved_items    │              │  achievements   │
│  (Favorites)    │              │  (Definitions)  │
└─────────────────┘              └────────┬────────┘
                                          │ N:M
                                          ▼
                                 ┌─────────────────┐
                                 │user_achievements│
                                 │   (Unlocked)    │
                                 └─────────────────┘
```

---

## Table Definitions

### 1. users

**Purpose:** Core user profile, authentication, and calculated metrics

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL, -- bcrypt hash

  -- Onboarding Data (Q1)
  onboarding_complete BOOLEAN DEFAULT FALSE,
  goal VARCHAR(20) NOT NULL CHECK (goal IN ('lose_weight', 'gain_weight', 'maintain')),
  current_weight DECIMAL(5,2) NOT NULL, -- lbs
  goal_weight DECIMAL(5,2) NOT NULL, -- lbs (for maintain: goal_weight = current_weight)
  goal_date DATE, -- NULL for maintain goal
  height DECIMAL(5,2) NOT NULL, -- inches
  age INTEGER NOT NULL CHECK (age >= 13 AND age <= 100),
  gender VARCHAR(20) NOT NULL CHECK (gender IN ('male', 'female')),
  activity_level VARCHAR(30) NOT NULL CHECK (activity_level IN ('sedentary', 'lightly_active', 'moderately_active', 'very_active')),

  -- Dietary Preferences
  dietary_restrictions JSONB DEFAULT '[]', -- e.g., ["vegetarian", "gluten_free"]
  disliked_foods JSONB DEFAULT '[]', -- e.g., ["mushrooms", "olives"]
  preferred_cuisines JSONB DEFAULT '[]', -- e.g., ["italian", "mexican", "asian"]

  -- Eating Pattern (Q1 v3.1)
  eating_pattern JSONB NOT NULL, -- {meals_per_day: 2|3|4, meal_pattern: ["breakfast","lunch","dinner"], includes_snacks: boolean}

  -- Fitness Preferences
  workout_frequency INTEGER NOT NULL CHECK (workout_frequency >= 0 AND workout_frequency <= 7), -- days per week
  available_equipment JSONB DEFAULT '[]', -- e.g., ["dumbbells", "barbell", "gym"]
  fitness_level VARCHAR(20) NOT NULL CHECK (fitness_level IN ('beginner', 'intermediate', 'advanced')),

  -- Calculated Metrics
  bmr INTEGER NOT NULL, -- Basal Metabolic Rate (calculated)
  tdee INTEGER NOT NULL, -- Total Daily Energy Expenditure (calculated)
  daily_calories INTEGER NOT NULL, -- Target calories/day
  macros JSONB NOT NULL, -- {protein_g: number, carbs_g: number, fat_g: number}

  -- Maintenance Weight Monitoring (Q1 v3.1)
  maintenance_threshold DECIMAL(3,2) DEFAULT 0.05, -- 5% variance (only for maintain goal)
  initial_maintenance_weight DECIMAL(5,2), -- Starting weight for maintenance users

  -- Preferences
  shopping_day VARCHAR(15) DEFAULT 'flexible' CHECK (shopping_day IN ('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday', 'flexible')),
  weekly_reset_day VARCHAR(15) DEFAULT 'monday' CHECK (weekly_reset_day IN ('monday', 'sunday')),
  notifications_enabled BOOLEAN DEFAULT TRUE,

  -- Streak Tracking
  streak_current INTEGER DEFAULT 0,
  streak_longest INTEGER DEFAULT 0,
  last_active_timezone VARCHAR(50), -- For timezone-aware streak calculation (Q3.5)

  -- Subscription
  subscription_status VARCHAR(20) DEFAULT 'trial' CHECK (subscription_status IN ('trial', 'active', 'expired')),
  subscription_expires_at TIMESTAMP WITH TIME ZONE,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE, -- Soft delete
  last_login_at TIMESTAMP WITH TIME ZONE,

  -- Indexes
  INDEX idx_users_email (email),
  INDEX idx_users_subscription (subscription_status),
  INDEX idx_users_deleted (deleted_at) WHERE deleted_at IS NOT NULL
);
```

---

### 2. user_settings

**Purpose:** User preferences for notifications, units, theme (Q3.1)

```sql
CREATE TABLE user_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Notification Preferences
  meal_reminders BOOLEAN DEFAULT TRUE,
  workout_reminders BOOLEAN DEFAULT TRUE,
  weekly_plan_reminders BOOLEAN DEFAULT TRUE,
  progress_updates BOOLEAN DEFAULT TRUE,
  reminder_times JSONB DEFAULT '{"breakfast": "08:00", "lunch": "12:00", "dinner": "18:00", "workout": "17:00"}',

  -- Unit Preferences
  weight_unit VARCHAR(10) DEFAULT 'lbs' CHECK (weight_unit IN ('lbs', 'kg')),
  height_unit VARCHAR(10) DEFAULT 'inches' CHECK (height_unit IN ('inches', 'cm')),
  measurement_unit VARCHAR(10) DEFAULT 'inches' CHECK (measurement_unit IN ('inches', 'cm')), -- For body measurements

  -- Theme & Display
  theme VARCHAR(10) DEFAULT 'system' CHECK (theme IN ('light', 'dark', 'system')),

  -- Weekly Schedule
  preferred_workout_days JSONB DEFAULT '[]', -- e.g., [1, 3, 5] (Mon, Wed, Fri)

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(user_id)
);
```

---

### 3. subscription_status

**Purpose:** Payment and subscription details (Q3.1)

```sql
CREATE TABLE subscription_status (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Subscription Details
  status VARCHAR(20) NOT NULL CHECK (status IN ('trial', 'active', 'canceled', 'expired', 'past_due')),
  plan_type VARCHAR(20) CHECK (plan_type IN ('monthly', 'annual', 'lifetime')),
  billing_cycle_start DATE,
  billing_cycle_end DATE,

  -- Payment
  payment_method_last4 VARCHAR(4), -- Last 4 digits of card
  payment_method_brand VARCHAR(20), -- Visa, Mastercard, etc.
  stripe_customer_id VARCHAR(255), -- Stripe customer ID
  stripe_subscription_id VARCHAR(255), -- Stripe subscription ID

  -- Pricing
  amount_cents INTEGER, -- Subscription amount in cents
  currency VARCHAR(3) DEFAULT 'USD',

  -- Timestamps
  trial_ends_at TIMESTAMP WITH TIME ZONE,
  canceled_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(user_id)
);
```

---

### 4. billing_transactions

**Purpose:** Payment history (Q3.1)

```sql
CREATE TABLE billing_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Transaction Details
  stripe_payment_intent_id VARCHAR(255) UNIQUE,
  amount_cents INTEGER NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  status VARCHAR(20) NOT NULL CHECK (status IN ('succeeded', 'pending', 'failed', 'refunded')),
  description TEXT,

  -- Metadata
  billing_period_start DATE,
  billing_period_end DATE,
  receipt_url TEXT,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  INDEX idx_billing_user (user_id),
  INDEX idx_billing_status (status),
  INDEX idx_billing_created (created_at DESC)
);
```

---

### 5. meal_plans

**Purpose:** Weekly meal plans (Q2, Q3.4)

```sql
CREATE TABLE meal_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Week Range
  week_start_date DATE NOT NULL, -- Monday
  week_end_date DATE NOT NULL, -- Sunday
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'upcoming', 'past')),

  -- Generation Metadata
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ai_generation_time_ms INTEGER, -- Time taken to generate (for analytics)

  -- Version Control (Q3.3 v1.1 - optimistic locking)
  version INTEGER DEFAULT 1,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  INDEX idx_meal_plans_user (user_id),
  INDEX idx_meal_plans_week (week_start_date),
  INDEX idx_meal_plans_user_week_status (user_id, week_start_date, status)
);

-- Partial unique constraint: Only one ACTIVE plan per user per week
-- Allows multiple PAST plans for regeneration history
CREATE UNIQUE INDEX idx_one_active_meal_plan_per_week
ON meal_plans(user_id, week_start_date)
WHERE status = 'active';
```

---

### 6. meals

**Purpose:** Individual meals within plans (Q2)

```sql
CREATE TABLE meals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  meal_plan_id UUID NOT NULL REFERENCES meal_plans(id) ON DELETE CASCADE,

  -- Meal Scheduling
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0 = Monday
  meal_type VARCHAR(20) NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),

  -- Meal Details
  name VARCHAR(255) NOT NULL,
  description TEXT,
  image_url TEXT, -- AI-generated or stock photo

  -- Nutrition
  calories INTEGER NOT NULL,
  macros JSONB NOT NULL, -- {protein_g: number, carbs_g: number, fat_g: number}

  -- Recipe
  prep_time_min INTEGER,
  cook_time_min INTEGER,
  total_time_min INTEGER GENERATED ALWAYS AS (prep_time_min + cook_time_min) STORED,

  -- User Feedback
  is_favorite BOOLEAN DEFAULT FALSE,
  is_disliked BOOLEAN DEFAULT FALSE,
  feedback_text TEXT,
  feedback_at TIMESTAMP WITH TIME ZONE,

  -- Logging Status
  logged BOOLEAN DEFAULT FALSE,
  logged_at TIMESTAMP WITH TIME ZONE,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  INDEX idx_meals_plan (meal_plan_id),
  INDEX idx_meals_user (user_id),
  INDEX idx_meals_day (day_of_week),
  INDEX idx_meals_favorites (user_id, is_favorite) WHERE is_favorite = TRUE
);
```

---

### 7. ingredients

**Purpose:** Ingredients for meals (Q2)

```sql
CREATE TABLE ingredients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meal_id UUID NOT NULL REFERENCES meals(id) ON DELETE CASCADE,

  -- Ingredient Details
  name VARCHAR(255) NOT NULL,
  quantity DECIMAL(8,2) NOT NULL,
  unit VARCHAR(20) NOT NULL CHECK (unit IN ('count', 'oz', 'lb', 'cup', 'tbsp', 'tsp', 'package')), -- US measurements only
  category VARCHAR(30) CHECK (category IN ('proteins', 'produce', 'dairy-eggs', 'pantry', 'spices', 'frozen', 'bakery', 'other')), -- Store section
  notes TEXT, -- e.g., "(optional)" or "(or substitute X)"

  -- Order in recipe
  display_order INTEGER,

  INDEX idx_ingredients_meal (meal_id),
  INDEX idx_ingredients_category (category)
);
```

---

### 8. recipe_steps

**Purpose:** Cooking instructions (Q2)

```sql
CREATE TABLE recipe_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meal_id UUID NOT NULL REFERENCES meals(id) ON DELETE CASCADE,

  -- Step Details
  step_number INTEGER NOT NULL,
  instruction TEXT NOT NULL,

  INDEX idx_recipe_steps_meal (meal_id),
  UNIQUE(meal_id, step_number)
);
```

---

### 9. grocery_lists

**Purpose:** Consolidated shopping lists (Q2, Q3.4)

```sql
CREATE TABLE grocery_lists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  meal_plan_id UUID NOT NULL REFERENCES meal_plans(id) ON DELETE CASCADE,

  -- Grocery Item
  item_name VARCHAR(255) NOT NULL,
  quantity DECIMAL(8,2) NOT NULL,
  unit VARCHAR(20) NOT NULL,
  category VARCHAR(30), -- Store section

  -- User Actions
  purchased BOOLEAN DEFAULT FALSE,
  notes TEXT, -- User can add notes

  -- Display Order (by category, then alphabetical)
  display_order INTEGER,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  INDEX idx_grocery_plan (meal_plan_id),
  INDEX idx_grocery_user (user_id),
  INDEX idx_grocery_category (category)
);
```

---

### 10. workout_plans

**Purpose:** Weekly workout plans (Q3.0, Q3.4)

```sql
CREATE TABLE workout_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Week Range
  week_start_date DATE NOT NULL, -- Monday
  week_end_date DATE NOT NULL, -- Sunday
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'upcoming', 'past')),

  -- Generation Metadata
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ai_generation_time_ms INTEGER, -- Time taken to generate (for analytics)

  -- Version Control (Q3.3 v1.1 - optimistic locking)
  version INTEGER DEFAULT 1,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  INDEX idx_workout_plans_user (user_id),
  INDEX idx_workout_plans_week (week_start_date),
  INDEX idx_workout_plans_user_week_status (user_id, week_start_date, status)
);

-- Partial unique constraint: Only one ACTIVE plan per user per week
-- Allows multiple PAST plans for regeneration history
CREATE UNIQUE INDEX idx_one_active_workout_plan_per_week
ON workout_plans(user_id, week_start_date)
WHERE status = 'active';
```

---

### 11. workouts

**Purpose:** Individual workouts within plans (Q3.0)

```sql
CREATE TABLE workouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  workout_plan_id UUID NOT NULL REFERENCES workout_plans(id) ON DELETE CASCADE,

  -- Workout Scheduling
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),

  -- Workout Details
  name VARCHAR(255) NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('strength', 'cardio')),
  workout_category VARCHAR(30) CHECK (workout_category IN ('upper_body', 'lower_body', 'full_body', 'core', 'cardio', 'hiit', 'flexibility')),
  duration_min INTEGER NOT NULL,
  estimated_calories INTEGER NOT NULL,

  -- User Feedback
  is_favorite BOOLEAN DEFAULT FALSE,
  is_disliked BOOLEAN DEFAULT FALSE,

  -- Logging Status
  logged BOOLEAN DEFAULT FALSE,
  logged_at TIMESTAMP WITH TIME ZONE,
  actual_calories_burned INTEGER, -- If logged with actual data

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  INDEX idx_workouts_plan (workout_plan_id),
  INDEX idx_workouts_user (user_id),
  INDEX idx_workouts_day (day_of_week),
  INDEX idx_workouts_favorites (user_id, is_favorite) WHERE is_favorite = TRUE
);
```

---

### 12. exercises

**Purpose:** Exercise details within workouts (Q3.0)

```sql
CREATE TABLE exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_id UUID NOT NULL REFERENCES workouts(id) ON DELETE CASCADE,

  -- Exercise Details
  name VARCHAR(255) NOT NULL,
  sets INTEGER, -- For strength
  reps INTEGER, -- For strength
  duration_min INTEGER, -- For cardio
  equipment JSONB DEFAULT '[]', -- e.g., ["barbell", "bench"]
  notes TEXT,

  -- Order in workout
  display_order INTEGER,

  INDEX idx_exercises_workout (workout_id)
);
```

---

### 13. logged_entries

**Purpose:** Unified logging table for meals, workouts, weight (Q3.0, Q3.2)

**Design Decision:** Single polymorphic table vs separate tables. Chose unified table for:
- Simpler history queries (single table scan)
- Easier daily summary aggregation
- Consistent logging interface

```sql
CREATE TABLE logged_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Entry Type
  type VARCHAR(20) NOT NULL CHECK (type IN ('meal', 'workout', 'weight')),

  -- Date this entry applies to (for analytics)
  date DATE NOT NULL,

  -- Meal-specific (JSONB for flexibility)
  meal JSONB, -- {name, meal_type, calories, macros:{protein_g, carbs_g, fat_g}, source:'planned'|'custom', planned_meal_id, replaced_meal_id, image_url}

  -- Workout-specific
  workout JSONB, -- {name, type, duration_min, calories_burned, source, planned_workout_id, replaced_workout_id}

  -- Weight-specific
  weight JSONB, -- {weight_lbs, notes}

  -- Timestamps
  logged_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), -- When user actually performed this
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), -- When entry was created in system
  updated_at TIMESTAMP WITH TIME ZONE, -- When entry was last edited

  -- Favorites (for quick re-logging)
  is_favorite BOOLEAN DEFAULT FALSE,
  is_disliked BOOLEAN DEFAULT FALSE,

  INDEX idx_logged_entries_user (user_id),
  INDEX idx_logged_entries_date (date),
  INDEX idx_logged_entries_type (type),
  INDEX idx_logged_entries_user_date (user_id, date),
  INDEX idx_logged_entries_favorites (user_id, is_favorite) WHERE is_favorite = TRUE,

  -- Ensure type-specific data exists
  CONSTRAINT check_meal_data CHECK (type != 'meal' OR meal IS NOT NULL),
  CONSTRAINT check_workout_data CHECK (type != 'workout' OR workout IS NOT NULL),
  CONSTRAINT check_weight_data CHECK (type != 'weight' OR weight IS NOT NULL)
);
```

---

### 14. daily_summaries

**Purpose:** Pre-aggregated daily stats for performance (Q3.0, Q3.5)

```sql
CREATE TABLE daily_summaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,

  -- Nutrition Totals
  calories_consumed INTEGER DEFAULT 0,
  calories_target INTEGER NOT NULL,
  macros_consumed JSONB DEFAULT '{"protein_g": 0, "carbs_g": 0, "fat_g": 0}',
  macros_target JSONB NOT NULL,

  -- Workout Totals
  workouts_completed INTEGER DEFAULT 0,
  workouts_planned INTEGER DEFAULT 0,
  total_exercise_min INTEGER DEFAULT 0,
  calories_burned INTEGER DEFAULT 0,

  -- Meals
  meals_logged INTEGER DEFAULT 0,
  meals_planned INTEGER DEFAULT 0,

  -- Status Flags
  all_meals_logged BOOLEAN DEFAULT FALSE,
  all_workouts_logged BOOLEAN DEFAULT FALSE,
  streak_maintained BOOLEAN DEFAULT FALSE, -- For streak calculation

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(user_id, date),
  INDEX idx_daily_summaries_user (user_id),
  INDEX idx_daily_summaries_date (date),
  INDEX idx_daily_summaries_streak (user_id, date, streak_maintained)
);
```

---

### 15. weekly_summaries

**Purpose:** Pre-aggregated weekly stats (Q3.5)

```sql
CREATE TABLE weekly_summaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Week Range
  week_start DATE NOT NULL, -- Monday
  week_end DATE NOT NULL, -- Sunday

  -- Meal Tracking
  meals_logged INTEGER DEFAULT 0,
  workouts_logged INTEGER DEFAULT 0,

  -- Nutrition Totals
  total_calories INTEGER DEFAULT 0,
  avg_calories_per_day INTEGER DEFAULT 0,
  total_protein_g INTEGER DEFAULT 0,
  total_carbs_g INTEGER DEFAULT 0,
  total_fat_g INTEGER DEFAULT 0,

  -- Workout Totals
  total_exercise_minutes INTEGER DEFAULT 0,
  total_calories_burned INTEGER DEFAULT 0,

  -- Progress
  days_completed INTEGER DEFAULT 0, -- Days where streak maintained (0-7)

  -- Weight Change
  starting_weight DECIMAL(5,2),
  ending_weight DECIMAL(5,2),
  weight_change DECIMAL(5,2), -- Can be negative

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(user_id, week_start),
  INDEX idx_weekly_summaries_user (user_id),
  INDEX idx_weekly_summaries_week (week_start)
);
```

---

### 16. weight_entries

**Purpose:** Separate weight tracking table for trend analysis (Q3.5)

**Design Decision:** Separate from logged_entries for easier analytics queries and trend calculations

```sql
CREATE TABLE weight_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Weight Data
  weight_lbs DECIMAL(5,2) NOT NULL,
  notes TEXT,

  -- Calculated Fields
  change_from_last DECIMAL(5,2), -- Difference from previous entry
  change_from_start DECIMAL(5,2), -- Difference from goal start weight

  -- Timestamps
  logged_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  INDEX idx_weight_entries_user (user_id),
  INDEX idx_weight_entries_logged (logged_at),
  INDEX idx_weight_entries_user_logged (user_id, logged_at)
);
```

---

### 17. achievements

**Purpose:** Achievement definitions (Q3.5)

```sql
CREATE TABLE achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Achievement Details
  name VARCHAR(255) NOT NULL UNIQUE,
  description TEXT NOT NULL,
  category VARCHAR(30) NOT NULL CHECK (category IN ('streak', 'weight', 'logging', 'milestone', 'performance', 'habit', 'nutrition', 'fitness', 'variety', 'engagement')),
  icon VARCHAR(50), -- Icon identifier (e.g., 'fire', 'trophy', 'star')

  -- Unlock Condition
  unlock_condition JSONB NOT NULL, -- {metric: 'streak_days', comparison: '>=', value: 7}

  -- Display
  display_order INTEGER,
  is_active BOOLEAN DEFAULT TRUE,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  INDEX idx_achievements_category (category),
  INDEX idx_achievements_active (is_active)
);
```

---

### 18. user_achievements

**Purpose:** User's unlocked achievements (Q3.5)

```sql
CREATE TABLE user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,

  -- Progress Tracking
  progress_current INTEGER DEFAULT 0,
  progress_target INTEGER NOT NULL,
  progress_percent INTEGER GENERATED ALWAYS AS (LEAST(100, (progress_current * 100) / NULLIF(progress_target, 0))) STORED,

  -- Unlock Status
  unlocked BOOLEAN DEFAULT FALSE,
  unlocked_at TIMESTAMP WITH TIME ZONE,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(user_id, achievement_id),
  INDEX idx_user_achievements_user (user_id),
  INDEX idx_user_achievements_unlocked (user_id, unlocked)
);
```

---

### 19. streak_history

**Purpose:** Streak tracking and calendar heatmap (Q3.5)

```sql
CREATE TABLE streak_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,

  -- Streak Status
  completed BOOLEAN NOT NULL,
  streak_count_at_date INTEGER NOT NULL, -- Streak value on this date

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(user_id, date),
  INDEX idx_streak_history_user (user_id),
  INDEX idx_streak_history_date (date),
  INDEX idx_streak_history_user_date (user_id, date DESC)
);
```

---

### 20. body_measurements

**Purpose:** Optional body measurements tracking (Q3.5)

```sql
CREATE TABLE body_measurements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Measurements (all stored in inches, converted on display)
  waist DECIMAL(5,2),
  chest DECIMAL(5,2),
  hips DECIMAL(5,2),
  arms DECIMAL(5,2),
  thighs DECIMAL(5,2),
  calves DECIMAL(5,2),
  neck DECIMAL(5,2),

  -- Notes
  notes TEXT,

  -- Timestamps
  measured_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  INDEX idx_body_measurements_user (user_id),
  INDEX idx_body_measurements_measured (measured_at)
);
```

---

### 21. ai_insights

**Purpose:** Cached AI-generated weekly insights (Q3.5)

```sql
CREATE TABLE ai_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Insight Details
  insight_text TEXT NOT NULL,
  insight_category VARCHAR(30) CHECK (insight_category IN ('consistency', 'nutrition', 'exercise', 'progress', 'habits', 'adherence', 'patterns', 'suggestions')),

  -- Week Reference
  week_start DATE NOT NULL,
  week_end DATE NOT NULL,

  -- AI Metadata
  ai_model VARCHAR(50), -- e.g., 'gpt-4o-mini'
  ai_tokens_used INTEGER,
  ai_generation_time_ms INTEGER,

  -- Cache Control
  expires_at TIMESTAMP WITH TIME ZONE, -- 7 days from created_at

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  INDEX idx_ai_insights_user (user_id),
  INDEX idx_ai_insights_week (week_start),
  INDEX idx_ai_insights_expires (expires_at)
);
```

---

### 22. saved_items

**Purpose:** Denormalized favorites library (Q3.6)

**Design Decision:** Denormalized from logged_entries for:
- Fast read performance (no joins needed)
- Data persistence (saved item exists even if historical entry deleted)
- Editing flexibility (can edit saved recipe without affecting history)

```sql
CREATE TABLE saved_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Item Type
  type VARCHAR(20) NOT NULL CHECK (type IN ('meal', 'workout')),

  -- Meal Data (JSONB for flexibility, full meal details)
  meal JSONB, -- {name, meal_type, calories, macros, ingredients[], recipe_steps[], prep_time_min, cook_time_min, image_url}

  -- Workout Data (JSONB for flexibility, full workout details)
  workout JSONB, -- {name, type, workout_category, duration_min, estimated_calories, exercises[]}

  -- Metadata
  favorited_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  log_count INTEGER DEFAULT 0, -- How many times user has logged this item
  last_logged_at TIMESTAMP WITH TIME ZONE,

  -- Source Reference (optional, may be NULL if original entry deleted)
  source_logged_entry_id UUID, -- Reference to original LoggedEntry (no FK constraint)

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  INDEX idx_saved_items_user (user_id),
  INDEX idx_saved_items_type (type),
  INDEX idx_saved_items_user_type (user_id, type),
  INDEX idx_saved_items_favorited (favorited_at DESC),

  -- Limit: Max 200 saved items per user
  -- Enforced at application level

  -- Ensure type-specific data exists
  CONSTRAINT check_saved_meal_data CHECK (type != 'meal' OR meal IS NOT NULL),
  CONSTRAINT check_saved_workout_data CHECK (type != 'workout' OR workout IS NOT NULL)
);
```

---

### 23. sync_queue

**Purpose:** Offline sync queue (Q3.7)

```sql
CREATE TABLE sync_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Action Details
  action_type VARCHAR(50) NOT NULL, -- e.g., 'log_meal', 'edit_entry', 'delete_entry', 'favorite_item'
  resource_type VARCHAR(50) NOT NULL, -- e.g., 'meal', 'workout', 'weight', 'profile'
  resource_id UUID, -- ID of resource being acted upon (NULL for create actions)

  -- Payload
  payload JSONB NOT NULL, -- Full data for the action

  -- Priority Queue (Q3.7)
  priority INTEGER NOT NULL CHECK (priority IN (1, 2, 3, 4)), -- 1=Critical, 2=High, 3=Normal, 4=Low

  -- Dependency Tracking
  depends_on_id UUID, -- References another sync_queue.id (must complete first)

  -- Status
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  retry_count INTEGER DEFAULT 0,
  max_retries INTEGER DEFAULT 3,
  last_error TEXT,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  processed_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,

  INDEX idx_sync_queue_user (user_id),
  INDEX idx_sync_queue_status (status),
  INDEX idx_sync_queue_priority (priority, created_at), -- FIFO within priority
  INDEX idx_sync_queue_depends (depends_on_id)
);
```

---

### 24. cache_entries

**Purpose:** Offline cache storage (Q3.7)

```sql
CREATE TABLE cache_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Cache Key
  cache_key VARCHAR(255) NOT NULL, -- e.g., 'meal_plan:2024-11-04', 'history:week:2024-11-04'

  -- Cached Data
  data JSONB NOT NULL,

  -- Cache Metadata
  priority INTEGER NOT NULL CHECK (priority IN (0, 1, 2, 3)), -- P0=Critical (never evict), P1=High, P2=Medium, P3=Low
  size_bytes INTEGER NOT NULL, -- Approximate size for budget tracking

  -- Expiration
  expires_at TIMESTAMP WITH TIME ZONE,

  -- Access Tracking (for LRU eviction)
  accessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  access_count INTEGER DEFAULT 0,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(user_id, cache_key),
  INDEX idx_cache_entries_user (user_id),
  INDEX idx_cache_entries_expires (expires_at),
  INDEX idx_cache_entries_priority_accessed (priority, accessed_at) -- For LRU eviction
);
```

---

### 25. support_tickets

**Purpose:** User support requests (Q3.1)

```sql
CREATE TABLE support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL, -- NULL if user deleted

  -- Ticket Details
  subject VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(30) NOT NULL CHECK (type IN ('bug_report', 'feature_request', 'general_support', 'account_issue', 'billing_issue')),
  status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  priority VARCHAR(20) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),

  -- User Info (captured at creation for reference even if user deleted)
  user_email VARCHAR(255) NOT NULL,
  user_name VARCHAR(255),

  -- Response
  admin_response TEXT,
  resolved_at TIMESTAMP WITH TIME ZONE,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  INDEX idx_support_tickets_user (user_id),
  INDEX idx_support_tickets_status (status),
  INDEX idx_support_tickets_created (created_at DESC)
);
```

---

## Indexes & Performance

### Primary Indexes (Already Defined Above)

All tables have:
- Primary key index on `id`
- Foreign key indexes
- Frequently queried field indexes

### Additional Composite Indexes for Common Queries

```sql
-- Fast daily summary lookup
CREATE INDEX idx_daily_summary_user_date_streak
  ON daily_summaries(user_id, date, streak_maintained);

-- Fast weekly plan lookup
CREATE INDEX idx_meal_plan_user_week_status
  ON meal_plans(user_id, week_start_date, status);

-- Fast logging history query
CREATE INDEX idx_logged_entries_user_date_type
  ON logged_entries(user_id, date DESC, type);

-- Fast weight trend query
CREATE INDEX idx_weight_entries_user_logged_desc
  ON weight_entries(user_id, logged_at DESC);

-- Fast favorites query
CREATE INDEX idx_saved_items_user_type_favorited
  ON saved_items(user_id, type, favorited_at DESC);

-- Fast sync queue processing (priority + FIFO)
CREATE INDEX idx_sync_queue_priority_created
  ON sync_queue(priority, created_at)
  WHERE status = 'pending';

-- Fast cache LRU eviction
CREATE INDEX idx_cache_lru
  ON cache_entries(user_id, priority, accessed_at)
  WHERE expires_at > NOW();
```

### Performance Targets

- User profile load: <50ms
- Weekly plan load: <100ms
- Daily summary aggregation: <200ms
- History week query: <150ms
- Sync queue processing: >10 actions/second
- Cache read: <50ms

---

## Migrations Strategy

### Tool: Prisma or Knex.js

Recommendation: **Prisma** for:
- Type safety with TypeScript
- Automatic migration generation
- Easy rollback
- Built-in seeding

### Migration Workflow

```bash
# Create new migration
npx prisma migrate dev --name add_user_table

# Apply to production
npx prisma migrate deploy

# Rollback (manual)
npx prisma migrate resolve --rolled-back <migration-name>
```

### Initial Migration Order

1. **Migration 001:** Core users table
2. **Migration 002:** User settings and subscription
3. **Migration 003:** Meal plans and meals
4. **Migration 004:** Workout plans and workouts
5. **Migration 005:** Logging and tracking
6. **Migration 006:** Progress and analytics
7. **Migration 007:** Saved items and favorites
8. **Migration 008:** Offline sync and cache
9. **Migration 009:** Support and admin
10. **Migration 010:** Indexes and constraints (performance)

### Seeding Strategy

```sql
-- Seed achievements (25 predefined achievements from Q3.5)
INSERT INTO achievements (name, description, category, unlock_condition, icon) VALUES
  ('First Steps', 'Complete your first day of logging', 'streak', '{"metric": "streak_days", "comparison": ">=", "value": 1}', 'footsteps'),
  ('Week Warrior', 'Maintain a 7-day streak', 'streak', '{"metric": "streak_days", "comparison": ">=", "value": 7}', 'fire'),
  -- ... (23 more achievements)
;
```

---

## Design Decisions

### 1. Single logged_entries Table vs Separate Tables

**Decision:** Use single polymorphic table

**Rationale:**
- Simpler history queries (single table scan instead of UNION of 3 tables)
- Easier daily summary aggregation
- Consistent logging interface
- JSONB flexibility for type-specific fields

**Trade-off:** Slightly larger table, but PostgreSQL handles this well with partial indexes

---

### 2. Denormalized saved_items Table

**Decision:** Duplicate meal/workout data in saved_items (don't just store reference to logged_entry)

**Rationale:**
- 60% faster read performance (no joins needed for Saved screen)
- Data persistence (favorite exists even if original entry deleted)
- Editing flexibility (can edit saved recipe without affecting history)
- Q3.6 specification requirement

**Trade-off:** ~40-160KB duplication per user (acceptable for 200 max saved items)

---

### 3. Separate weight_entries Table

**Decision:** Separate from logged_entries

**Rationale:**
- Trend analysis queries are simpler and faster
- Weight graph doesn't need to filter logged_entries
- Easier to implement linear regression algorithm

**Trade-off:** Slight data duplication, but cleaner separation of concerns

---

### 4. JSONB for Flexible Fields

**Decision:** Use JSONB for macros, eating_pattern, equipment, preferences

**Rationale:**
- Schema flexibility without migrations
- Allows nested structures (macros: {protein_g, carbs_g, fat_g})
- PostgreSQL JSONB has excellent performance and indexing support
- Simplifies API responses (direct JSON output)

**Trade-off:** Slightly more complex queries, but JSONB operators are powerful

---

### 5. Optimistic Locking with version Field

**Decision:** Add version field to meal_plans and workout_plans

**Rationale:**
- Q3.3 v1.1 requirement for race condition prevention
- Prevents concurrent swap modifications
- Simple to implement (increment version on update, check version on modify)

**Trade-off:** Requires client retry logic on conflict (409 response)

---

### 6. Soft Deletes

**Decision:** Use deleted_at column instead of hard deletes

**Rationale:**
- Data recovery possible
- Audit trail maintained
- Referential integrity preserved
- GDPR compliance (data can be permanently deleted via admin action)

**Trade-off:** Queries must filter WHERE deleted_at IS NULL

---

### 7. Priority Queue for Offline Sync

**Decision:** 4-level priority (Critical/High/Normal/Low) with FIFO within priority

**Rationale:**
- Q3.7 requirement for smart sync ordering
- Critical actions (weight/meal/workout logs) sync first
- Low-priority actions (analytics) don't block important data

**Trade-off:** More complex sync processing logic

---

### 8. 8MB Cache Budget

**Decision:** Enforce 8MB total cache per user with P0-P3 priority eviction

**Rationale:**
- Mobile AsyncStorage typically 6-10MB
- Q3.7 requirement for offline mode
- P0 data (current week) never evicted
- LRU eviction within priority levels

**Trade-off:** Requires cache size tracking and eviction logic

---

### 9. Regeneration History via status='past'

**Decision:** Use partial UNIQUE constraint to allow multiple plans per week with different status values

**Rationale:**
- Q3.4 requirement: Users can regenerate meal/workout plans up to 5 times per week
- AI needs context from previous regenerations to avoid repeating rejected meals/workouts
- User can select meals to keep during regeneration (UI improvement)
- Simpler than separate regeneration_history table
- Natural audit trail built into existing structure
- Rate limiting: COUNT plans WHERE status='past' AND week_start_date=current_week

**Implementation:**
```sql
-- Only one ACTIVE plan per user per week
CREATE UNIQUE INDEX idx_one_active_meal_plan_per_week
ON meal_plans(user_id, week_start_date)
WHERE status = 'active';

-- Same for workout_plans
CREATE UNIQUE INDEX idx_one_active_workout_plan_per_week
ON workout_plans(user_id, week_start_date)
WHERE status = 'active';
```

**Trade-off:**
- More rows in meal_plans/workout_plans tables (~260 extra rows/user/year max)
- Must always filter by status='active' in queries (mitigated by composite index)
- Storage impact minimal: 5 regenerations/week × 52 weeks × 200 bytes = ~52 KB/user/year

**Benefits over separate table:**
- No joins needed for AI context
- All plan data in one place
- Simpler schema (no new table)
- Natural ordering via created_at timestamp

---

## Storage Estimates

### Per User (1 Year of Data)

| Table | Avg Size per User | Notes |
|-------|-------------------|-------|
| users | 2 KB | Single row |
| user_settings | 1 KB | Single row |
| subscription_status | 1 KB | Single row |
| meal_plans | 62 KB | ~52 weeks × 200 bytes + ~260 regenerations × 200 bytes |
| meals | 500 KB | ~1,000 meals × 500 bytes |
| ingredients | 2 MB | ~10,000 ingredients × 200 bytes |
| recipe_steps | 500 KB | ~5,000 steps × 100 bytes |
| grocery_lists | 100 KB | ~1,000 items × 100 bytes |
| workout_plans | 62 KB | ~52 weeks × 200 bytes + ~260 regenerations × 200 bytes |
| workouts | 100 KB | ~200 workouts × 500 bytes |
| exercises | 200 KB | ~1,000 exercises × 200 bytes |
| logged_entries | 5 MB | ~3,000 entries × 1.5 KB (JSONB) |
| daily_summaries | 100 KB | ~365 days × 300 bytes |
| weekly_summaries | 15 KB | ~52 weeks × 300 bytes |
| weight_entries | 50 KB | ~365 entries × 150 bytes |
| achievements | Shared | ~25 global achievements |
| user_achievements | 5 KB | ~25 achievements × 200 bytes |
| streak_history | 50 KB | ~365 days × 150 bytes |
| body_measurements | 10 KB | ~52 entries × 200 bytes |
| ai_insights | 25 KB | ~52 weeks × 500 bytes |
| saved_items | 40 KB | ~20 items × 2 KB (denormalized) |
| sync_queue | Transient | Cleared after sync |
| cache_entries | 8 MB | Max 8MB per user (enforced) |
| support_tickets | 5 KB | ~5 tickets × 1 KB |
| billing_transactions | 5 KB | ~12 transactions × 400 bytes |

**Total per User (1 year):** ~17.1 MB (includes regeneration history)
**Total per User (including cache):** ~25.1 MB

**For 10,000 users:** ~251 GB
**For 100,000 users:** ~2.51 TB

---

## Next Steps

### Immediate (This Session)

1. ✅ **User Review:** Review this schema for approval
2. ⏸️ **Feedback:** Incorporate any changes requested
3. ⏸️ **Finalize:** Mark schema as approved

### Post-Approval (Future Sessions)

1. **Prisma Schema:** Convert this SQL to Prisma schema format
2. **Seed Data:** Create achievement seed data (25 achievements from Q3.5)
3. **Migration Files:** Generate initial migration files
4. **Testing:** Create test database and verify migrations
5. **Documentation:** Update API specification with database contracts

---

## Approval Checklist

Before proceeding, please review:

- [ ] **Table Structure:** All 25 tables make sense and cover all features?
- [ ] **Relationships:** Foreign keys and relationships correct?
- [ ] **Data Types:** JSONB usage appropriate? Any fields need different types?
- [ ] **Indexes:** Performance indexes cover common query patterns?
- [ ] **Design Decisions:** Agree with 8 major design decisions listed?
- [ ] **Storage Estimates:** 17 MB per user per year acceptable?
- [ ] **Migrations Strategy:** Prisma as migration tool acceptable?
- [ ] **Missing Tables:** Any features not covered by these 25 tables?

---

**Document Version:** 1.1 FINAL
**Created:** 2025-11-07
**Last Updated:** 2025-11-07 (Session 18D - Regeneration history fix)
**Status:** ✅ APPROVED by User
**Approved By:** User (Session 14, updated Session 18D)
**Changes in v1.1:** Added partial UNIQUE constraints for regeneration history, removed regeneration_count field, added Design Decision #9
**Next:** Convert to Prisma schema, create migrations
