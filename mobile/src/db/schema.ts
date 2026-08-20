/**
 * Drizzle ORM Schema (SQLite)
 * Mobile-side database schema mirroring backend Prisma schema
 * Based on: project/implementation/DATABASE_SCHEMA.md
 */

import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

// ==============================================================================
// CORE TABLES (Phase 1 - Foundation)
// ==============================================================================

/**
 * Users Table (cached from backend)
 */
export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull(),
  firebaseUid: text('firebase_uid').notNull(),

  // Profile data
  goal: text('goal'), // lose_weight, gain_weight, maintain
  gender: text('gender'), // male, female
  age: integer('age'),
  currentWeight: real('current_weight'),
  goalWeight: real('goal_weight'),
  heightInches: integer('height_inches'),
  activityLevel: text('activity_level'),
  fitnessLevel: text('fitness_level'),

  // Calculated values
  bmr: integer('bmr'),
  tdee: integer('tdee'),
  dailyCalorieTarget: integer('daily_calorie_target'),
  macrosProtein: integer('macros_protein'),
  macrosCarbs: integer('macros_carbs'),
  macrosFat: integer('macros_fat'),

  // Timestamps
  createdAt: integer('created_at', { mode: 'timestamp' }),
  updatedAt: integer('updated_at', { mode: 'timestamp' }),
  syncedAt: integer('synced_at', { mode: 'timestamp' }), // Last sync with backend
});

/**
 * Logged Entries Table (offline logging queue)
 */
export const loggedEntries = sqliteTable('logged_entries', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  entryType: text('entry_type').notNull(), // meal, workout, weight
  loggedAt: integer('logged_at', { mode: 'timestamp' }).notNull(),

  // Entry data (JSONB equivalent - stored as TEXT)
  data: text('data').notNull(), // JSON string

  // Sync status
  isSynced: integer('is_synced', { mode: 'boolean' }).default(false),
  syncError: text('sync_error'),
  createdAt: integer('created_at', { mode: 'timestamp' }),
});

/**
 * Meal Plans Table (cached from backend)
 */
export const mealPlans = sqliteTable('meal_plans', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  weekStart: text('week_start').notNull(), // YYYY-MM-DD format

  // Meal data (JSONB equivalent)
  meals: text('meals').notNull(), // JSON string of meals array

  // Metadata
  version: integer('version').default(1),
  createdAt: integer('created_at', { mode: 'timestamp' }),
  updatedAt: integer('updated_at', { mode: 'timestamp' }),
  syncedAt: integer('synced_at', { mode: 'timestamp' }),
});

/**
 * Workout Plans Table (cached from backend)
 */
export const workoutPlans = sqliteTable('workout_plans', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  weekStart: text('week_start').notNull(),

  // Workout data (JSONB equivalent)
  workouts: text('workouts').notNull(), // JSON string

  // Metadata
  version: integer('version').default(1),
  createdAt: integer('created_at', { mode: 'timestamp' }),
  updatedAt: integer('updated_at', { mode: 'timestamp' }),
  syncedAt: integer('synced_at', { mode: 'timestamp' }),
});

/**
 * Saved Items Table (favorites library)
 */
export const savedItems = sqliteTable('saved_items', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  itemType: text('item_type').notNull(), // meal, workout
  name: text('name').notNull(),

  // Item data (JSONB equivalent)
  data: text('data').notNull(), // JSON string

  // Metadata
  favoritedAt: integer('favorited_at', { mode: 'timestamp' }),
  syncedAt: integer('synced_at', { mode: 'timestamp' }),
});

/**
 * Sync Queue Table (offline mutations queue)
 */
export const syncQueue = sqliteTable('sync_queue', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  actionType: text('action_type').notNull(), // log_meal, log_workout, log_weight, swap_meal, etc.
  priority: text('priority').notNull(), // critical, high, normal, low

  // Payload (JSONB equivalent)
  payload: text('payload').notNull(), // JSON string

  // Status
  status: text('status').default('pending'), // pending, processing, failed, completed
  retryCount: integer('retry_count').default(0),
  lastError: text('last_error'),

  // Timestamps
  createdAt: integer('created_at', { mode: 'timestamp' }),
  processedAt: integer('processed_at', { mode: 'timestamp' }),
});

/**
 * Cache Entries Table (general cache storage)
 */
export const cacheEntries = sqliteTable('cache_entries', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  cacheKey: text('cache_key').notNull(),

  // Cached data (JSONB equivalent)
  data: text('data').notNull(), // JSON string

  // Cache management
  priority: text('priority').notNull(), // P0, P1, P2, P3
  expiresAt: integer('expires_at', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' }),
});

/**
 * Weight Entries Table (weight tracking)
 */
export const weightEntries = sqliteTable('weight_entries', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  weight: real('weight').notNull(),
  unit: text('unit').default('lbs'), // lbs, kg
  date: text('date').notNull(), // YYYY-MM-DD

  // Sync status
  isSynced: integer('is_synced', { mode: 'boolean' }).default(false),
  createdAt: integer('created_at', { mode: 'timestamp' }),
  syncedAt: integer('synced_at', { mode: 'timestamp' }),
});

/**
 * Achievements Table (cached from backend)
 */
export const achievements = sqliteTable('achievements', {
  id: text('id').primaryKey(),
  achievementType: text('achievement_type').notNull(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  iconName: text('icon_name'),

  // Unlock condition (JSONB equivalent)
  unlockCondition: text('unlock_condition').notNull(), // JSON string

  syncedAt: integer('synced_at', { mode: 'timestamp' }),
});

/**
 * User Achievements Table (unlocked achievements)
 */
export const userAchievements = sqliteTable('user_achievements', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  achievementId: text('achievement_id').notNull(),
  unlockedAt: integer('unlocked_at', { mode: 'timestamp' }),

  isSynced: integer('is_synced', { mode: 'boolean' }).default(false),
  syncedAt: integer('synced_at', { mode: 'timestamp' }),
});

// ==============================================================================
// TYPE EXPORTS
// ==============================================================================

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type LoggedEntry = typeof loggedEntries.$inferSelect;
export type NewLoggedEntry = typeof loggedEntries.$inferInsert;

export type MealPlan = typeof mealPlans.$inferSelect;
export type NewMealPlan = typeof mealPlans.$inferInsert;

export type WorkoutPlan = typeof workoutPlans.$inferSelect;
export type NewWorkoutPlan = typeof workoutPlans.$inferInsert;

export type SavedItem = typeof savedItems.$inferSelect;
export type NewSavedItem = typeof savedItems.$inferInsert;

export type SyncQueueItem = typeof syncQueue.$inferSelect;
export type NewSyncQueueItem = typeof syncQueue.$inferInsert;

export type CacheEntry = typeof cacheEntries.$inferSelect;
export type NewCacheEntry = typeof cacheEntries.$inferInsert;

export type WeightEntry = typeof weightEntries.$inferSelect;
export type NewWeightEntry = typeof weightEntries.$inferInsert;

export type Achievement = typeof achievements.$inferSelect;
export type NewAchievement = typeof achievements.$inferInsert;

export type UserAchievement = typeof userAchievements.$inferSelect;
export type NewUserAchievement = typeof userAchievements.$inferInsert;
