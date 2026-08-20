/**
 * Workout Plan Routes
 * GET /api/workout-plans/daily - Get workouts for a specific date
 * GET /api/workout-plans/weekly - Get full weekly workout plan
 * POST /api/workout-plans/generate - Generate new weekly workout plan
 * GET /api/workout-plans/workouts/:id - Get single workout with exercises
 * POST /api/workout-plans/workouts/:id/log - Toggle workout logged status
 * PATCH /api/workout-plans/workouts/:id/favorite - Toggle workout favorite status
 */

import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { verifyFirebaseToken } from '../middleware/auth.middleware';
import { generateWeeklyWorkoutPlan, storeWorkoutPlan, generateWorkoutExercises, autoExpireOldWorkoutPlans } from '../services/openai/workoutGeneration.service';

const router = Router();
const prisma = new PrismaClient();

// Helper function to get day of week from date (0 = Sunday, 1 = Monday, etc.)
function getDayOfWeek(date: Date): number {
  return date.getDay();
}

/**
 * GET /api/workout-plans/daily
 * Query params: date (YYYY-MM-DD format, defaults to today)
 * Returns: workouts for the specified date with exercise details
 */
router.get('/daily', verifyFirebaseToken, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // Auto-expire old workout plans (Phase-1 Hybrid logic)
    await autoExpireOldWorkoutPlans(userId);

    // Parse date from query param or use today
    const dateParam = req.query.date as string | undefined;
    let targetDate: Date;
    if (dateParam) {
      // Parse date string in local timezone (not UTC) to avoid off-by-one errors
      const parts = dateParam.split('-');
      targetDate = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
    } else {
      targetDate = new Date();
    }
    targetDate.setHours(0, 0, 0, 0);

    const dayOfWeek = getDayOfWeek(targetDate);

    // Find active workout plan for this week
    const workoutPlan = await prisma.workoutPlan.findFirst({
      where: {
        userId,
        status: 'active',
        weekStartDate: {
          lte: targetDate,
        },
        weekEndDate: {
          gte: targetDate,
        },
      },
      include: {
        workouts: {
          where: {
            dayOfWeek,
          },
          include: {
            exercises: {
              orderBy: {
                displayOrder: 'asc',
              },
            },
          },
        },
      },
    });

    if (!workoutPlan) {
      // No workout plan found for this week
      return res.json({
        date: targetDate.toISOString().split('T')[0],
        dayOfWeek,
        workouts: [],
        message: 'No workout plan found for this week',
      });
    }

    // Transform workouts to match mobile interface
    const workouts = workoutPlan.workouts.map((workout) => {
      return {
        id: workout.id,
        name: workout.name,
        type: workout.type,
        workoutCategory: workout.workoutCategory,
        durationMinutes: workout.durationMin,
        estimatedCalories: workout.estimatedCalories,
        actualCalories: workout.actualCaloriesBurned,
        exerciseCount: workout.exercises.length,
        isFavorited: workout.isFavorite,
        isDisliked: workout.isDisliked,
        isLogged: workout.logged,
        loggedAt: workout.loggedAt?.toISOString(),
        exercises: workout.exercises.map((exercise) => ({
          id: exercise.id,
          name: exercise.name,
          sets: exercise.sets,
          reps: exercise.reps,
          durationMin: exercise.durationMin,
          equipment: exercise.equipment as string[], // JsonB field
          notes: exercise.notes,
        })),
      };
    });

    // Calculate total duration and calories for the day
    const totalStats = workouts.reduce(
      (acc, workout) => {
        acc.totalDuration += workout.durationMinutes;
        acc.totalCalories += workout.actualCalories || workout.estimatedCalories;
        return acc;
      },
      { totalDuration: 0, totalCalories: 0 }
    );

    const response = {
      date: targetDate.toISOString().split('T')[0],
      dayOfWeek,
      workouts,
      totalStats,
      workoutPlanId: workoutPlan.id,
      weekStartDate: workoutPlan.weekStartDate.toISOString().split('T')[0],
      weekEndDate: workoutPlan.weekEndDate.toISOString().split('T')[0],
    };

    return res.json(response);
  } catch (error) {
    console.error('Error fetching daily workouts:', error);
    return res.status(500).json({
      error: 'Failed to fetch daily workouts',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * GET /api/workout-plans/weekly
 * Get the current active weekly workout plan with all workouts
 * Returns: full workout plan with all workouts for the week
 */
router.get('/weekly', verifyFirebaseToken, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // Find active workout plan
    const workoutPlan = await prisma.workoutPlan.findFirst({
      where: {
        userId,
        status: 'active',
      },
      include: {
        workouts: {
          orderBy: [
            { dayOfWeek: 'asc' },
          ],
          include: {
            exercises: {
              orderBy: { displayOrder: 'asc' },
            },
          },
        },
      },
    });

    if (!workoutPlan) {
      return res.status(404).json({
        error: 'No active workout plan found',
        message: 'Generate a workout plan first',
      });
    }

    // Transform response
    const response = {
      id: workoutPlan.id,
      weekStartDate: workoutPlan.weekStartDate.toISOString().split('T')[0],
      weekEndDate: workoutPlan.weekEndDate.toISOString().split('T')[0],
      status: workoutPlan.status,
      workoutCount: workoutPlan.workouts.length,
      workouts: workoutPlan.workouts.map((workout) => ({
        id: workout.id,
        name: workout.name,
        type: workout.type,
        workoutCategory: workout.workoutCategory,
        dayOfWeek: workout.dayOfWeek,
        durationMinutes: workout.durationMin,
        estimatedCalories: workout.estimatedCalories,
        isLogged: workout.logged,
        isFavorite: workout.isFavorite,
        exercises: workout.exercises.map((exercise) => ({
          id: exercise.id,
          name: exercise.name,
          sets: exercise.sets,
          reps: exercise.reps,
          durationMin: exercise.durationMin,
          equipment: exercise.equipment as string[],
          notes: exercise.notes,
        })),
      })),
    };

    return res.json(response);
  } catch (error) {
    console.error('Error fetching weekly workout plan:', error);
    return res.status(500).json({
      error: 'Failed to fetch weekly workout plan',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * POST /api/workout-plans/generate
 * Generate a new weekly workout plan using OpenAI
 * Body: { weekStartDate?: string } - Optional start date (defaults to current week Monday)
 * Returns: generated workout plan with all workouts
 */
router.post('/generate', verifyFirebaseToken, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // Determine week start date
    let weekStartDate: Date;
    if (req.body.weekStartDate) {
      weekStartDate = new Date(req.body.weekStartDate);
    } else {
      // Default to most recent Monday (current week, including today)
      const today = new Date();
      const dayOfWeek = today.getDay(); // 0=Sunday, 1=Monday, ..., 6=Saturday
      const daysSinceMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Sunday = 6 days since Monday
      weekStartDate = new Date(today);
      weekStartDate.setDate(today.getDate() - daysSinceMonday); // Go back to most recent Monday
    }
    weekStartDate.setHours(0, 0, 0, 0);

    // Check if user already has an active plan for this week
    const existingPlan = await prisma.workoutPlan.findFirst({
      where: {
        userId,
        status: 'active',
        weekStartDate: {
          lte: weekStartDate,
        },
        weekEndDate: {
          gte: weekStartDate,
        },
      },
    });

    if (existingPlan) {
      // Delete the existing plan (regenerating replaces it)
      await prisma.workoutPlan.delete({
        where: { id: existingPlan.id },
      });
    }

    // Generate workout plan using OpenAI
    const { workouts } = await generateWeeklyWorkoutPlan(userId);

    // Store the generated workout plan
    const workoutPlanId = await storeWorkoutPlan(userId, workouts, weekStartDate);

    // Fetch the complete workout plan with all relations
    const workoutPlan = await prisma.workoutPlan.findUnique({
      where: { id: workoutPlanId },
      include: {
        workouts: {
          orderBy: [
            { dayOfWeek: 'asc' },
          ],
          include: {
            exercises: {
              orderBy: { displayOrder: 'asc' },
            },
          },
        },
      },
    });

    if (!workoutPlan) {
      throw new Error('Failed to retrieve generated workout plan');
    }

    // Fetch user for equipment and fitness level (needed for exercise generation)
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        fitnessLevel: true,
        availableEquipment: true,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Generate all exercises synchronously (like meal recipes)
    // Wait for all exercises to be ready before returning response
    console.log(`[WorkoutPlan] Generating exercises for ${workoutPlan.workouts.length} workouts...`);
    await Promise.all(
      workoutPlan.workouts.map(async (workout) => {
        try {
          await generateWorkoutExercises(
            workout.id,
            workout.name,
            workout.type,
            workout.workoutCategory || 'full_body',
            workout.durationMin,
            user.fitnessLevel,
            user.availableEquipment as string[]
          );
          console.log(`[WorkoutPlan] ✅ Exercises generated for: ${workout.name}`);
        } catch (error) {
          console.error(`[WorkoutPlan] ❌ Failed to generate exercises for ${workout.name}:`, error);
        }
      })
    );
    console.log(`[WorkoutPlan] ✅ All exercises generated successfully`);

    // Re-fetch workout plan to include the newly generated exercises
    const updatedWorkoutPlan = await prisma.workoutPlan.findUnique({
      where: { id: workoutPlanId },
      include: {
        workouts: {
          orderBy: [
            { dayOfWeek: 'asc' },
          ],
          include: {
            exercises: {
              orderBy: { displayOrder: 'asc' },
            },
          },
        },
      },
    });

    if (!updatedWorkoutPlan) {
      throw new Error('Failed to retrieve updated workout plan');
    }

    // Calculate week end date
    const weekEndDate = new Date(weekStartDate);
    weekEndDate.setDate(weekEndDate.getDate() + 6);

    // Transform response
    const response = {
      id: updatedWorkoutPlan.id,
      weekStartDate: weekStartDate.toISOString().split('T')[0],
      weekEndDate: weekEndDate.toISOString().split('T')[0],
      status: updatedWorkoutPlan.status,
      workoutCount: updatedWorkoutPlan.workouts.length,
      workouts: updatedWorkoutPlan.workouts.map((workout) => ({
        id: workout.id,
        name: workout.name,
        type: workout.type,
        workoutCategory: workout.workoutCategory,
        dayOfWeek: workout.dayOfWeek,
        durationMinutes: workout.durationMin,
        estimatedCalories: workout.estimatedCalories,
        exercises: workout.exercises.map((exercise) => ({
          id: exercise.id,
          name: exercise.name,
          sets: exercise.sets,
          reps: exercise.reps,
          durationMin: exercise.durationMin,
          equipment: exercise.equipment as string[],
          notes: exercise.notes,
        })),
      })),
    };

    return res.status(201).json(response);
  } catch (error) {
    console.error('Error generating workout plan:', error);
    return res.status(500).json({
      error: 'Failed to generate workout plan',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * GET /api/workout-plans/workouts/:id
 * Get single workout with full exercise details
 * Returns: workout with exercises, equipment, and notes
 */
router.get('/workouts/:id', verifyFirebaseToken, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { id } = req.params;

    // Fetch workout with exercises
    let workout = await prisma.workout.findUnique({
      where: { id },
      include: {
        exercises: {
          orderBy: {
            displayOrder: 'asc',
          },
        },
      },
    });

    if (!workout) {
      return res.status(404).json({ error: 'Workout not found' });
    }

    // Ensure workout belongs to user
    if (workout.userId !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Auto-generate exercises if they don't exist (on-demand generation)
    if (workout.exercises.length === 0) {
      console.log(`[Workouts] Auto-generating exercises for workout ${workout.id}: ${workout.name}`);

      // Fetch user for equipment and fitness level
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          fitnessLevel: true,
          availableEquipment: true,
        },
      });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      try {
        await generateWorkoutExercises(
          workout.id,
          workout.name,
          workout.type,
          workout.workoutCategory || 'full_body',
          workout.durationMin,
          user.fitnessLevel,
          user.availableEquipment as string[]
        );

        // Re-fetch the workout with the newly generated exercises
        const updatedWorkout = await prisma.workout.findUnique({
          where: { id },
          include: {
            exercises: {
              orderBy: {
                displayOrder: 'asc',
              },
            },
          },
        });

        if (updatedWorkout) {
          workout = updatedWorkout;
        }
      } catch (error) {
        console.error('[Workouts] Failed to auto-generate exercises:', error);
        // Continue with empty exercises - will show as no exercises available
      }
    }

    return res.json({
      id: workout.id,
      name: workout.name,
      type: workout.type,
      workoutCategory: workout.workoutCategory,
      durationMinutes: workout.durationMin,
      estimatedCalories: workout.estimatedCalories,
      actualCalories: workout.actualCaloriesBurned,
      isFavorited: workout.isFavorite,
      isDisliked: workout.isDisliked,
      isLogged: workout.logged,
      loggedAt: workout.loggedAt?.toISOString(),
      exercises: workout.exercises.map((exercise) => ({
        id: exercise.id,
        name: exercise.name,
        sets: exercise.sets,
        reps: exercise.reps,
        durationMin: exercise.durationMin,
        equipment: exercise.equipment as string[],
        notes: exercise.notes,
      })),
    });
  } catch (error) {
    console.error('Error fetching workout:', error);
    return res.status(500).json({
      error: 'Failed to fetch workout',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * POST /api/workout-plans/workouts/:id/log
 * Toggle the logged status of a workout
 * Body: { logged?: boolean, actualCalories?: number } - if logged not provided, toggles current state
 * Returns: updated workout with logged status
 */
router.post('/workouts/:id/log', verifyFirebaseToken, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { id } = req.params;
    const { logged, actualCalories } = req.body;

    // Fetch current workout
    const workout = await prisma.workout.findUnique({
      where: { id },
    });

    if (!workout) {
      return res.status(404).json({ error: 'Workout not found' });
    }

    // Ensure workout belongs to user
    if (workout.userId !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Determine new logged state (toggle if not specified)
    const newLoggedState = logged !== undefined ? logged : !workout.logged;

    // Update workout
    const updatedWorkout = await prisma.workout.update({
      where: { id },
      data: {
        logged: newLoggedState,
        loggedAt: newLoggedState ? new Date() : null,
        // Update actual calories if provided, or use estimated if logging
        actualCaloriesBurned: newLoggedState
          ? (actualCalories !== undefined ? actualCalories : workout.estimatedCalories)
          : null,
      },
    });

    return res.json({
      id: updatedWorkout.id,
      name: updatedWorkout.name,
      type: updatedWorkout.type,
      durationMinutes: updatedWorkout.durationMin,
      estimatedCalories: updatedWorkout.estimatedCalories,
      actualCalories: updatedWorkout.actualCaloriesBurned,
      isLogged: updatedWorkout.logged,
      loggedAt: updatedWorkout.loggedAt?.toISOString(),
      isFavorited: updatedWorkout.isFavorite,
    });
  } catch (error) {
    console.error('Error logging workout:', error);
    return res.status(500).json({
      error: 'Failed to log workout',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * GET /api/workout-plans/workouts/:id/alternatives
 * Get swap alternatives for a workout (other workouts from user's plan)
 * Returns: array of workouts that can be swapped with the current workout
 */
router.get('/workouts/:id/alternatives', verifyFirebaseToken, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { id } = req.params;

    // Fetch the workout being swapped
    const currentWorkout = await prisma.workout.findUnique({
      where: { id },
    });

    if (!currentWorkout) {
      return res.status(404).json({ error: 'Workout not found' });
    }

    if (currentWorkout.userId !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Find alternative workouts (exclude current, exclude disliked)
    const alternatives = await prisma.workout.findMany({
      where: {
        userId,
        id: { not: id }, // Exclude the current workout
        isDisliked: false, // Exclude disliked workouts
      },
      orderBy: [
        { isFavorite: 'desc' }, // Favorites first
        { dayOfWeek: 'asc' },
      ],
    });

    // Transform to response format
    const response = alternatives.map((workout) => ({
      id: workout.id,
      name: workout.name,
      type: workout.type,
      workoutCategory: workout.workoutCategory,
      dayOfWeek: workout.dayOfWeek,
      durationMinutes: workout.durationMin,
      estimatedCalories: workout.estimatedCalories,
      isFavorite: workout.isFavorite,
    }));

    return res.json({
      originalWorkout: {
        id: currentWorkout.id,
        name: currentWorkout.name,
        type: currentWorkout.type,
        workoutCategory: currentWorkout.workoutCategory,
        durationMinutes: currentWorkout.durationMin,
        estimatedCalories: currentWorkout.estimatedCalories,
      },
      alternatives: response,
    });
  } catch (error) {
    console.error('Error fetching swap alternatives:', error);
    return res.status(500).json({
      error: 'Failed to fetch swap alternatives',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * PATCH /api/workout-plans/workouts/:id/swap
 * Swap two workouts in the workout plan
 * Body: { replacementWorkoutId: string }
 * Returns: updated workout information
 */
router.patch('/workouts/:id/swap', verifyFirebaseToken, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { id } = req.params;
    const { replacementWorkoutId } = req.body;

    if (!replacementWorkoutId) {
      return res.status(400).json({ error: 'replacementWorkoutId is required' });
    }

    // Fetch both workouts
    const [originalWorkout, replacementWorkout] = await Promise.all([
      prisma.workout.findUnique({ where: { id } }),
      prisma.workout.findUnique({ where: { id: replacementWorkoutId } }),
    ]);

    if (!originalWorkout || !replacementWorkout) {
      return res.status(404).json({ error: 'One or both workouts not found' });
    }

    // Verify ownership
    if (originalWorkout.userId !== userId || replacementWorkout.userId !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Swap the dayOfWeek values
    const originalDayOfWeek = originalWorkout.dayOfWeek;
    const replacementDayOfWeek = replacementWorkout.dayOfWeek;

    // Perform the swap using a transaction
    await prisma.$transaction([
      prisma.workout.update({
        where: { id: originalWorkout.id },
        data: { dayOfWeek: replacementDayOfWeek },
      }),
      prisma.workout.update({
        where: { id: replacementWorkout.id },
        data: { dayOfWeek: originalDayOfWeek },
      }),
    ]);

    // Fetch updated workouts
    const [updatedOriginal, updatedReplacement] = await Promise.all([
      prisma.workout.findUnique({ where: { id } }),
      prisma.workout.findUnique({ where: { id: replacementWorkoutId } }),
    ]);

    return res.json({
      success: true,
      message: 'Workouts swapped successfully',
      swappedWorkouts: {
        original: {
          id: updatedOriginal!.id,
          name: updatedOriginal!.name,
          newDayOfWeek: updatedOriginal!.dayOfWeek,
        },
        replacement: {
          id: updatedReplacement!.id,
          name: updatedReplacement!.name,
          newDayOfWeek: updatedReplacement!.dayOfWeek,
        },
      },
    });
  } catch (error) {
    console.error('Error swapping workouts:', error);
    return res.status(500).json({
      error: 'Failed to swap workouts',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * PATCH /api/workout-plans/workouts/:id/favorite
 * Toggle the favorite status of a workout
 * Body: { isFavorite?: boolean } - if not provided, toggles current state
 * Returns: updated workout with favorite status
 */
router.patch('/workouts/:id/favorite', verifyFirebaseToken, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { id } = req.params;
    const { isFavorite } = req.body;

    // Fetch current workout
    const workout = await prisma.workout.findUnique({
      where: { id },
    });

    if (!workout) {
      return res.status(404).json({ error: 'Workout not found' });
    }

    // Ensure workout belongs to user
    if (workout.userId !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Determine new favorite state (toggle if not specified)
    const newFavoriteState = isFavorite !== undefined ? isFavorite : !workout.isFavorite;

    // Update workout
    const updatedWorkout = await prisma.workout.update({
      where: { id },
      data: {
        isFavorite: newFavoriteState,
      },
    });

    return res.json({
      id: updatedWorkout.id,
      name: updatedWorkout.name,
      isFavorited: updatedWorkout.isFavorite,
      isLogged: updatedWorkout.logged,
    });
  } catch (error) {
    console.error('Error toggling workout favorite:', error);
    return res.status(500).json({
      error: 'Failed to toggle workout favorite',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router;
