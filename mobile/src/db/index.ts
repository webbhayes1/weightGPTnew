/**
 * SQLite Database Initialization
 * Sets up expo-sqlite with Drizzle ORM for offline-first data storage
 */

import { drizzle } from 'drizzle-orm/expo-sqlite';
import { openDatabaseSync } from 'expo-sqlite';
import * as schema from './schema';

// Database name
const DATABASE_NAME = 'weightgpt.db';

// Initialize SQLite database
const expoDb = openDatabaseSync(DATABASE_NAME);

// Initialize Drizzle ORM with SQLite
export const db = drizzle(expoDb, { schema });

// =============================================================================
// DATABASE UTILITIES
// =============================================================================

/**
 * Initialize database tables
 * Creates all tables if they don't exist
 */
export const initializeDatabase = async (): Promise<void> => {
  try {
    console.log('[DB] Initializing SQLite database...');

    // Create tables using raw SQL (Drizzle migrations not yet available for expo-sqlite)
    await expoDb.execAsync(`
      -- Users table
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT NOT NULL,
        firebase_uid TEXT NOT NULL,
        goal TEXT,
        gender TEXT,
        age INTEGER,
        current_weight REAL,
        goal_weight REAL,
        height_inches INTEGER,
        activity_level TEXT,
        fitness_level TEXT,
        bmr INTEGER,
        tdee INTEGER,
        daily_calorie_target INTEGER,
        macros_protein INTEGER,
        macros_carbs INTEGER,
        macros_fat INTEGER,
        created_at INTEGER,
        updated_at INTEGER,
        synced_at INTEGER
      );

      -- Logged entries table
      CREATE TABLE IF NOT EXISTS logged_entries (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        entry_type TEXT NOT NULL,
        logged_at INTEGER NOT NULL,
        data TEXT NOT NULL,
        is_synced INTEGER DEFAULT 0,
        sync_error TEXT,
        created_at INTEGER
      );

      -- Meal plans table
      CREATE TABLE IF NOT EXISTS meal_plans (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        week_start TEXT NOT NULL,
        meals TEXT NOT NULL,
        version INTEGER DEFAULT 1,
        created_at INTEGER,
        updated_at INTEGER,
        synced_at INTEGER
      );

      -- Workout plans table
      CREATE TABLE IF NOT EXISTS workout_plans (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        week_start TEXT NOT NULL,
        workouts TEXT NOT NULL,
        version INTEGER DEFAULT 1,
        created_at INTEGER,
        updated_at INTEGER,
        synced_at INTEGER
      );

      -- Saved items table
      CREATE TABLE IF NOT EXISTS saved_items (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        item_type TEXT NOT NULL,
        name TEXT NOT NULL,
        data TEXT NOT NULL,
        favorited_at INTEGER,
        synced_at INTEGER
      );

      -- Sync queue table
      CREATE TABLE IF NOT EXISTS sync_queue (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        action_type TEXT NOT NULL,
        priority TEXT NOT NULL,
        payload TEXT NOT NULL,
        status TEXT DEFAULT 'pending',
        retry_count INTEGER DEFAULT 0,
        last_error TEXT,
        created_at INTEGER,
        processed_at INTEGER
      );

      -- Cache entries table
      CREATE TABLE IF NOT EXISTS cache_entries (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        cache_key TEXT NOT NULL,
        data TEXT NOT NULL,
        priority TEXT NOT NULL,
        expires_at INTEGER,
        created_at INTEGER
      );

      -- Weight entries table
      CREATE TABLE IF NOT EXISTS weight_entries (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        weight REAL NOT NULL,
        unit TEXT DEFAULT 'lbs',
        date TEXT NOT NULL,
        is_synced INTEGER DEFAULT 0,
        created_at INTEGER,
        synced_at INTEGER
      );

      -- Achievements table
      CREATE TABLE IF NOT EXISTS achievements (
        id TEXT PRIMARY KEY,
        achievement_type TEXT NOT NULL,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        icon_name TEXT,
        unlock_condition TEXT NOT NULL,
        synced_at INTEGER
      );

      -- User achievements table
      CREATE TABLE IF NOT EXISTS user_achievements (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        achievement_id TEXT NOT NULL,
        unlocked_at INTEGER,
        is_synced INTEGER DEFAULT 0,
        synced_at INTEGER
      );

      -- Create indexes for performance
      CREATE INDEX IF NOT EXISTS idx_logged_entries_user_id ON logged_entries(user_id);
      CREATE INDEX IF NOT EXISTS idx_logged_entries_logged_at ON logged_entries(logged_at);
      CREATE INDEX IF NOT EXISTS idx_logged_entries_is_synced ON logged_entries(is_synced);

      CREATE INDEX IF NOT EXISTS idx_meal_plans_user_week ON meal_plans(user_id, week_start);
      CREATE INDEX IF NOT EXISTS idx_workout_plans_user_week ON workout_plans(user_id, week_start);

      CREATE INDEX IF NOT EXISTS idx_saved_items_user_type ON saved_items(user_id, item_type);

      CREATE INDEX IF NOT EXISTS idx_sync_queue_user_status ON sync_queue(user_id, status);
      CREATE INDEX IF NOT EXISTS idx_sync_queue_priority ON sync_queue(priority, created_at);

      CREATE INDEX IF NOT EXISTS idx_cache_entries_user_key ON cache_entries(user_id, cache_key);
      CREATE INDEX IF NOT EXISTS idx_cache_entries_priority ON cache_entries(priority, expires_at);

      CREATE INDEX IF NOT EXISTS idx_weight_entries_user_date ON weight_entries(user_id, date);
      CREATE INDEX IF NOT EXISTS idx_weight_entries_is_synced ON weight_entries(is_synced);

      CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON user_achievements(user_id);
    `);

    console.log('[DB] Database initialized successfully');
  } catch (error) {
    console.error('[DB] Error initializing database:', error);
    throw error;
  }
};

/**
 * Clear all data from database (for testing/logout)
 */
export const clearDatabase = async (): Promise<void> => {
  try {
    console.log('[DB] Clearing database...');

    await expoDb.execAsync(`
      DELETE FROM users;
      DELETE FROM logged_entries;
      DELETE FROM meal_plans;
      DELETE FROM workout_plans;
      DELETE FROM saved_items;
      DELETE FROM sync_queue;
      DELETE FROM cache_entries;
      DELETE FROM weight_entries;
      DELETE FROM achievements;
      DELETE FROM user_achievements;
    `);

    console.log('[DB] Database cleared successfully');
  } catch (error) {
    console.error('[DB] Error clearing database:', error);
    throw error;
  }
};

/**
 * Get database statistics
 */
export const getDatabaseStats = async (): Promise<{
  totalEntries: number;
  pendingSyncItems: number;
  cachedMealPlans: number;
  cachedWorkoutPlans: number;
  savedItems: number;
}> => {
  try {
    const stats = await expoDb.getAllAsync(`
      SELECT
        (SELECT COUNT(*) FROM logged_entries) as total_entries,
        (SELECT COUNT(*) FROM sync_queue WHERE status = 'pending') as pending_sync,
        (SELECT COUNT(*) FROM meal_plans) as meal_plans,
        (SELECT COUNT(*) FROM workout_plans) as workout_plans,
        (SELECT COUNT(*) FROM saved_items) as saved_items
    `);

    const result = stats[0] as {
      total_entries: number;
      pending_sync: number;
      meal_plans: number;
      workout_plans: number;
      saved_items: number;
    };

    return {
      totalEntries: result.total_entries,
      pendingSyncItems: result.pending_sync,
      cachedMealPlans: result.meal_plans,
      cachedWorkoutPlans: result.workout_plans,
      savedItems: result.saved_items,
    };
  } catch (error) {
    console.error('[DB] Error getting database stats:', error);
    throw error;
  }
};

// Export everything
export * from './schema';
export default db;
