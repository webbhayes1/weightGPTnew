/**
 * Logging Routes
 * Phase 6: Q3.2 AI-Powered Logging
 *
 * Endpoints for AI-powered logging of meals, workouts, and weight
 */

import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { requireAuth } from '../middleware/auth.middleware';
import {
  parseMealInput,
  parseWorkoutInput,
  parseWeightInput,
  MealParseResponse,
  WorkoutParseResponse,
  WeightParseResponse,
} from '../services/openai/loggingParsing.service';

const router = Router();
const prisma = new PrismaClient();

// All routes require authentication
router.use(requireAuth);

// ============================================================================
// AI PARSING ENDPOINTS
// ============================================================================

/**
 * POST /api/logging/parse/meal
 * Parse natural language meal input using AI
 */
const MealParseRequestSchema = z.object({
  input: z.string().min(1).max(500),
  followUpContext: z.string().optional(),
});

router.post('/parse/meal', async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { input, followUpContext } = MealParseRequestSchema.parse(req.body);

    const result: MealParseResponse = await parseMealInput(input, userId, followUpContext);

    return res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('[Logging] Error parsing meal:', error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Invalid request',
        details: error.errors,
      });
    }

    return res.status(500).json({
      error: 'Failed to parse meal',
      manualEntryRequired: true,
    });
  }
});

/**
 * POST /api/logging/parse/workout
 * Parse natural language workout input using AI
 */
const WorkoutParseRequestSchema = z.object({
  input: z.string().min(1).max(500),
  followUpContext: z.string().optional(),
});

router.post('/parse/workout', async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { input, followUpContext } = WorkoutParseRequestSchema.parse(req.body);

    const result: WorkoutParseResponse = await parseWorkoutInput(input, userId, followUpContext);

    return res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('[Logging] Error parsing workout:', error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Invalid request',
        details: error.errors,
      });
    }

    return res.status(500).json({
      error: 'Failed to parse workout',
      manualEntryRequired: true,
    });
  }
});

/**
 * POST /api/logging/parse/weight
 * Parse weight input (simple, no AI needed)
 */
const WeightParseRequestSchema = z.object({
  input: z.string().min(1).max(50),
  preferredUnit: z.enum(['lbs', 'kg']).optional(),
});

router.post('/parse/weight', async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { input, preferredUnit } = WeightParseRequestSchema.parse(req.body);

    // Get user's preferred unit if not specified
    let unitToUse = preferredUnit;
    if (!unitToUse) {
      const userSettings = await prisma.userSettings.findUnique({
        where: { userId },
        select: { weightUnit: true },
      });
      unitToUse = userSettings?.weightUnit === 'kg' ? 'kg' : 'lbs';
    }

    const result: WeightParseResponse = parseWeightInput(input, unitToUse);

    return res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('[Logging] Error parsing weight:', error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Invalid request',
        details: error.errors,
      });
    }

    return res.status(500).json({
      error: 'Failed to parse weight',
    });
  }
});

// ============================================================================
// LOGGED ENTRIES CRUD
// ============================================================================

/**
 * POST /api/logging/entries
 * Create a new logged entry (meal, workout, or weight)
 */
const CreateLoggedEntrySchema = z.object({
  type: z.enum(['meal', 'workout', 'weight']),
  date: z.string().transform((str) => new Date(str)),
  meal: z.object({
    items: z.array(z.object({
      name: z.string(),
      quantity: z.number(),
      unit: z.string(),
      calories: z.number(),
      protein: z.number(),
      carbs: z.number(),
      fat: z.number(),
    })),
    totalCalories: z.number(),
    totalProtein: z.number(),
    totalCarbs: z.number(),
    totalFat: z.number(),
    mealType: z.enum(['breakfast', 'lunch', 'dinner', 'snack']).optional(),
    isManualEntry: z.boolean().optional(),
    restaurantName: z.string().nullable().optional(),
  }).optional(),
  workout: z.object({
    name: z.string(),
    type: z.enum(['cardio', 'strength', 'balanced']),
    durationMinutes: z.number(),
    intensity: z.enum(['easy', 'moderate', 'hard']),
    caloriesBurned: z.number(),
    exercises: z.array(z.object({
      name: z.string(),
      sets: z.number().optional(),
      reps: z.number().optional(),
      weight: z.number().optional(),
      weightUnit: z.enum(['lbs', 'kg']).optional(),
      durationMin: z.number().optional(),
    })).optional(),
    isManualEntry: z.boolean().optional(),
  }).optional(),
  weight: z.object({
    weightLbs: z.number(),
    originalValue: z.number(),
    originalUnit: z.enum(['lbs', 'kg']),
  }).optional(),
  isFavorite: z.boolean().optional(),
});

router.post('/entries', async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const data = CreateLoggedEntrySchema.parse(req.body);

    // Validate that the correct data field is provided for the type
    if (data.type === 'meal' && !data.meal) {
      return res.status(400).json({ error: 'Meal data required for meal entries' });
    }
    if (data.type === 'workout' && !data.workout) {
      return res.status(400).json({ error: 'Workout data required for workout entries' });
    }
    if (data.type === 'weight' && !data.weight) {
      return res.status(400).json({ error: 'Weight data required for weight entries' });
    }

    // Create the logged entry
    const entry = await prisma.loggedEntry.create({
      data: {
        userId,
        type: data.type,
        date: data.date,
        meal: data.meal as any,
        workout: data.workout as any,
        weight: data.weight as any,
        isFavorite: data.isFavorite || false,
      },
    });

    // If it's a weight entry, also create a WeightEntry record
    if (data.type === 'weight' && data.weight) {
      await prisma.weightEntry.create({
        data: {
          userId,
          weightLbs: data.weight.weightLbs,
          loggedAt: new Date(),
        },
      });

      // Update user's current weight
      await prisma.user.update({
        where: { id: userId },
        data: { currentWeight: data.weight.weightLbs },
      });
    }

    // Update daily summary for meals/workouts
    if (data.type === 'meal' || data.type === 'workout') {
      await updateDailySummary(userId, data.date);
    }

    return res.status(201).json({
      success: true,
      data: entry,
    });
  } catch (error) {
    console.error('[Logging] Error creating entry:', error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Invalid request',
        details: error.errors,
      });
    }

    return res.status(500).json({
      error: 'Failed to create logged entry',
    });
  }
});

/**
 * GET /api/logging/entries
 * Get logged entries for a user (with filters)
 */
router.get('/entries', async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { type, date, startDate, endDate, limit = '50', offset = '0' } = req.query;

    const where: any = { userId };

    if (type && typeof type === 'string') {
      where.type = type;
    }

    if (date && typeof date === 'string') {
      // Query for the entire day (from start of day to end of day)
      // Parse the date as local time by adding time component
      const [year, month, day] = date.split('-').map(Number);
      const dayStart = new Date(year, month - 1, day, 0, 0, 0, 0);
      const dayEnd = new Date(year, month - 1, day, 23, 59, 59, 999);

      console.log(`[Logging] GET /entries - date filter: ${date}, dayStart: ${dayStart.toISOString()}, dayEnd: ${dayEnd.toISOString()}`);

      where.date = {
        gte: dayStart,
        lte: dayEnd,
      };
    } else if (startDate || endDate) {
      where.date = {};
      if (startDate && typeof startDate === 'string') {
        where.date.gte = new Date(startDate);
      }
      if (endDate && typeof endDate === 'string') {
        where.date.lte = new Date(endDate);
      }
    }

    console.log(`[Logging] GET /entries - where: ${JSON.stringify(where)}`);

    const entries = await prisma.loggedEntry.findMany({
      where,
      orderBy: { loggedAt: 'desc' },
      take: parseInt(limit as string),
      skip: parseInt(offset as string),
    });

    console.log(`[Logging] GET /entries - found ${entries.length} entries`);
    if (entries.length > 0) {
      entries.forEach((e) => {
        console.log(`  - Entry ${e.id}: type=${e.type}, date=${e.date}, loggedAt=${e.loggedAt}`);
      });
    }

    const total = await prisma.loggedEntry.count({ where });

    return res.json({
      success: true,
      data: entries,
      pagination: {
        total,
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
      },
    });
  } catch (error) {
    console.error('[Logging] Error fetching entries:', error);
    return res.status(500).json({ error: 'Failed to fetch logged entries' });
  }
});

/**
 * GET /api/logging/entries/:id
 * Get a single logged entry
 */
router.get('/entries/:id', async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { id } = req.params;

    const entry = await prisma.loggedEntry.findFirst({
      where: { id, userId },
    });

    if (!entry) {
      return res.status(404).json({ error: 'Entry not found' });
    }

    return res.json({
      success: true,
      data: entry,
    });
  } catch (error) {
    console.error('[Logging] Error fetching entry:', error);
    return res.status(500).json({ error: 'Failed to fetch logged entry' });
  }
});

/**
 * PATCH /api/logging/entries/:id
 * Update a logged entry
 */
const UpdateLoggedEntrySchema = z.object({
  meal: z.object({
    items: z.array(z.object({
      name: z.string(),
      quantity: z.number(),
      unit: z.string(),
      calories: z.number(),
      protein: z.number(),
      carbs: z.number(),
      fat: z.number(),
    })),
    totalCalories: z.number(),
    totalProtein: z.number(),
    totalCarbs: z.number(),
    totalFat: z.number(),
    mealType: z.enum(['breakfast', 'lunch', 'dinner', 'snack']).optional(),
  }).optional(),
  workout: z.object({
    name: z.string(),
    type: z.enum(['cardio', 'strength', 'balanced']),
    durationMinutes: z.number(),
    intensity: z.enum(['easy', 'moderate', 'hard']),
    caloriesBurned: z.number(),
    exercises: z.array(z.any()).optional(),
  }).optional(),
  weight: z.object({
    weightLbs: z.number(),
    originalValue: z.number(),
    originalUnit: z.enum(['lbs', 'kg']),
  }).optional(),
  isFavorite: z.boolean().optional(),
  isDisliked: z.boolean().optional(),
});

router.patch('/entries/:id', async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { id } = req.params;
    const updates = UpdateLoggedEntrySchema.parse(req.body);

    // Verify ownership
    const existing = await prisma.loggedEntry.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Entry not found' });
    }

    const entry = await prisma.loggedEntry.update({
      where: { id },
      data: {
        meal: updates.meal as any,
        workout: updates.workout as any,
        weight: updates.weight as any,
        isFavorite: updates.isFavorite,
        isDisliked: updates.isDisliked,
      },
    });

    // Update user's current weight if applicable
    if (existing.type === 'weight' && updates.weight) {
      await prisma.user.update({
        where: { id: userId },
        data: { currentWeight: updates.weight.weightLbs },
      });
    }

    // Update daily summary
    if (existing.type === 'meal' || existing.type === 'workout') {
      await updateDailySummary(userId, existing.date);
    }

    return res.json({
      success: true,
      data: entry,
    });
  } catch (error) {
    console.error('[Logging] Error updating entry:', error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Invalid request',
        details: error.errors,
      });
    }

    return res.status(500).json({ error: 'Failed to update logged entry' });
  }
});

/**
 * DELETE /api/logging/entries/:id
 * Delete a logged entry
 */
router.delete('/entries/:id', async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { id } = req.params;

    // Verify ownership
    const existing = await prisma.loggedEntry.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Entry not found' });
    }

    await prisma.loggedEntry.delete({
      where: { id },
    });

    // Update daily summary
    if (existing.type === 'meal' || existing.type === 'workout') {
      await updateDailySummary(userId, existing.date);
    }

    return res.json({
      success: true,
      message: 'Entry deleted',
    });
  } catch (error) {
    console.error('[Logging] Error deleting entry:', error);
    return res.status(500).json({ error: 'Failed to delete logged entry' });
  }
});

/**
 * GET /api/logging/recent
 * Get recent logged entries for quick-log suggestions
 */
router.get('/recent', async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { type, limit = '5' } = req.query;

    const where: any = { userId };
    if (type && typeof type === 'string') {
      where.type = type;
    }

    const entries = await prisma.loggedEntry.findMany({
      where,
      orderBy: { loggedAt: 'desc' },
      take: parseInt(limit as string),
    });

    return res.json({
      success: true,
      data: entries,
    });
  } catch (error) {
    console.error('[Logging] Error fetching recent entries:', error);
    return res.status(500).json({ error: 'Failed to fetch recent entries' });
  }
});

/**
 * GET /api/logging/favorites
 * Get favorited logged entries
 */
router.get('/favorites', async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { type, limit = '50' } = req.query;

    const where: any = { userId, isFavorite: true };
    if (type && typeof type === 'string') {
      where.type = type;
    }

    const entries = await prisma.loggedEntry.findMany({
      where,
      orderBy: { loggedAt: 'desc' },
      take: parseInt(limit as string),
    });

    return res.json({
      success: true,
      data: entries,
    });
  } catch (error) {
    console.error('[Logging] Error fetching favorites:', error);
    return res.status(500).json({ error: 'Failed to fetch favorites' });
  }
});

/**
 * GET /api/logging/weight-history
 * Get weight history for trend analysis
 */
router.get('/weight-history', async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { days = '30' } = req.query;
    const daysNum = parseInt(days as string);

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysNum);
    startDate.setHours(0, 0, 0, 0);

    const entries = await prisma.weightEntry.findMany({
      where: {
        userId,
        loggedAt: { gte: startDate },
      },
      orderBy: { loggedAt: 'asc' },
    });

    // Calculate trend
    let trend: { direction: 'up' | 'down' | 'stable'; amount: number } | null = null;
    if (entries.length >= 2) {
      const first = Number(entries[0].weightLbs);
      const last = Number(entries[entries.length - 1].weightLbs);
      const diff = last - first;
      trend = {
        direction: diff > 0.5 ? 'up' : diff < -0.5 ? 'down' : 'stable',
        amount: Math.abs(Math.round(diff * 10) / 10),
      };
    }

    // Get previous weight for comparison
    const previousEntry = await prisma.weightEntry.findFirst({
      where: { userId },
      orderBy: { loggedAt: 'desc' },
      skip: 1, // Skip the most recent
    });

    return res.json({
      success: true,
      data: {
        entries: entries.map(e => ({
          ...e,
          weightLbs: Number(e.weightLbs),
          changeFromLast: e.changeFromLast ? Number(e.changeFromLast) : null,
          changeFromStart: e.changeFromStart ? Number(e.changeFromStart) : null,
        })),
        trend,
        previousWeight: previousEntry ? Number(previousEntry.weightLbs) : null,
      },
    });
  } catch (error) {
    console.error('[Logging] Error fetching weight history:', error);
    return res.status(500).json({ error: 'Failed to fetch weight history' });
  }
});

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Update daily summary after logging meals/workouts
 */
async function updateDailySummary(userId: string, date: Date): Promise<void> {
  try {
    // Get all logged entries for this date using date range
    // to account for timezone differences in stored dates
    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59, 999);

    const entries = await prisma.loggedEntry.findMany({
      where: {
        userId,
        date: {
          gte: dayStart,
          lte: dayEnd,
        },
      },
    });

    // Calculate meal totals
    const mealEntries = entries.filter((e) => e.type === 'meal');
    let caloriesConsumed = 0;
    let proteinConsumed = 0;
    let carbsConsumed = 0;
    let fatConsumed = 0;

    for (const entry of mealEntries) {
      const meal = entry.meal as any;
      if (meal) {
        caloriesConsumed += meal.totalCalories || 0;
        proteinConsumed += meal.totalProtein || 0;
        carbsConsumed += meal.totalCarbs || 0;
        fatConsumed += meal.totalFat || 0;
      }
    }

    // Calculate workout totals
    const workoutEntries = entries.filter((e) => e.type === 'workout');
    const workoutsCompleted = workoutEntries.length;
    let totalExerciseMin = 0;
    let caloriesBurned = 0;

    for (const entry of workoutEntries) {
      const workout = entry.workout as any;
      if (workout) {
        totalExerciseMin += workout.durationMinutes || 0;
        caloriesBurned += workout.caloriesBurned || 0;
      }
    }

    // Get user targets
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        dailyCalories: true,
        macros: true,
      },
    });

    const macros = user?.macros as any || {};
    const caloriesTarget = user?.dailyCalories || 2000;
    const macrosTarget = {
      protein_g: macros.protein || 150,
      carbs_g: macros.carbs || 200,
      fat_g: macros.fat || 65,
    };

    // Upsert daily summary
    await prisma.dailySummary.upsert({
      where: {
        userId_date: { userId, date },
      },
      create: {
        userId,
        date,
        caloriesConsumed,
        caloriesTarget,
        macrosConsumed: {
          protein_g: proteinConsumed,
          carbs_g: carbsConsumed,
          fat_g: fatConsumed,
        },
        macrosTarget,
        workoutsCompleted,
        totalExerciseMin,
        caloriesBurned,
        mealsLogged: mealEntries.length,
      },
      update: {
        caloriesConsumed,
        macrosConsumed: {
          protein_g: proteinConsumed,
          carbs_g: carbsConsumed,
          fat_g: fatConsumed,
        },
        workoutsCompleted,
        totalExerciseMin,
        caloriesBurned,
        mealsLogged: mealEntries.length,
      },
    });
  } catch (error) {
    console.error('[Logging] Error updating daily summary:', error);
    // Don't throw - this is a non-critical operation
  }
}

export default router;
