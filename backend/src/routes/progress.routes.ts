/**
 * Progress Routes
 * GET /api/progress/daily - Get daily progress data (nutrition + workout stats)
 */

import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { verifyFirebaseToken } from '../middleware/auth.middleware';

const router = Router();
const prisma = new PrismaClient();

// Helper function to get day of week from date (0 = Sunday, 1 = Monday, etc.)
function getDayOfWeek(date: Date): number {
  return date.getDay();
}

/**
 * GET /api/progress/daily
 * Query params: date (YYYY-MM-DD format, defaults to today)
 * Returns: aggregated nutrition and workout progress for the specified date
 */
router.get('/daily', verifyFirebaseToken, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

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

    // Fetch user profile to get nutrition targets
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        dailyCalories: true,
        macros: true, // JsonB: { protein: number, carbs: number, fat: number }
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Handle both macro formats: { protein, carbs, fat } and { protein_g, carbs_g, fat_g }
    // Note: macroTargets no longer used - we calculate targets from daily planned meals
    // const rawMacros = user.macros as any;
    // const macroTargets = {
    //   protein: rawMacros?.protein ?? rawMacros?.protein_g ?? 0,
    //   carbs: rawMacros?.carbs ?? rawMacros?.carbs_g ?? 0,
    //   fat: rawMacros?.fat ?? rawMacros?.fat_g ?? 0,
    // };

    // Find active meal plan for this week
    const mealPlan = await prisma.mealPlan.findFirst({
      where: {
        userId,
        status: 'active',
        weekStartDate: { lte: targetDate },
        weekEndDate: { gte: targetDate },
      },
      include: {
        meals: {
          where: {
            dayOfWeek,
          },
        },
      },
    });

    // Calculate consumed nutrition from logged meals and targets from all planned meals
    let nutritionConsumed = { calories: 0, protein: 0, carbs: 0, fat: 0 };
    let nutritionTargets = { calories: 0, protein: 0, carbs: 0, fat: 0 };

    if (mealPlan) {
      mealPlan.meals.forEach((meal) => {
        const macros = meal.macros as { protein: number; carbs: number; fat: number };

        // Add to targets (all planned meals for the day)
        nutritionTargets.calories += meal.calories;
        nutritionTargets.protein += macros.protein;
        nutritionTargets.carbs += macros.carbs;
        nutritionTargets.fat += macros.fat;

        // Add to consumed only if logged
        if (meal.logged) {
          nutritionConsumed.calories += meal.calories;
          nutritionConsumed.protein += macros.protein;
          nutritionConsumed.carbs += macros.carbs;
          nutritionConsumed.fat += macros.fat;
        }
      });
    }

    // Also fetch LoggedEntry items for this date (from AI parsing / manual entry)
    // These are separate from the meal plan
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    const loggedEntries = await prisma.loggedEntry.findMany({
      where: {
        userId,
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });

    // Add logged meal entries to consumed nutrition
    const loggedMeals = loggedEntries.filter((e) => e.type === 'meal');
    loggedMeals.forEach((entry) => {
      const meal = entry.meal as {
        totalCalories?: number;
        totalProtein?: number;
        totalCarbs?: number;
        totalFat?: number;
      } | null;
      if (meal) {
        nutritionConsumed.calories += meal.totalCalories || 0;
        nutritionConsumed.protein += meal.totalProtein || 0;
        nutritionConsumed.carbs += meal.totalCarbs || 0;
        nutritionConsumed.fat += meal.totalFat || 0;
      }
    });

    // Find active workout plan for this week
    const workoutPlan = await prisma.workoutPlan.findFirst({
      where: {
        userId,
        status: 'active',
        weekStartDate: { lte: targetDate },
        weekEndDate: { gte: targetDate },
      },
      include: {
        workouts: {
          where: {
            dayOfWeek,
          },
        },
      },
    });

    // Calculate workout stats
    let workoutStats = {
      warmUpMinutes: 0,
      mainWorkoutMinutes: 0,
      totalMinutes: 0,
      completedMinutes: 0,
      targetMinutes: 0,
      caloriesBurned: 0,
      caloriesTarget: 0,
      workoutsLogged: 0,
      workoutsTotal: 0,
    };

    if (workoutPlan) {
      workoutStats.workoutsTotal = workoutPlan.workouts.length;

      workoutPlan.workouts.forEach((workout) => {
        // For this iteration, we'll assume:
        // - Warm-up is 5 minutes (or 10% of workout duration)
        // - Main workout is the remaining time
        // TODO: In future, add warm-up/cool-down tracking to workout model
        const warmUpMin = Math.floor(workout.durationMin * 0.1);
        const mainWorkoutMin = workout.durationMin - warmUpMin;

        // Add to target (total planned duration for the day)
        workoutStats.targetMinutes += workout.durationMin;
        workoutStats.caloriesTarget += workout.estimatedCalories;

        if (workout.logged) {
          workoutStats.warmUpMinutes += warmUpMin;
          workoutStats.mainWorkoutMinutes += mainWorkoutMin;
          workoutStats.completedMinutes += workout.durationMin;
          workoutStats.totalMinutes += workout.durationMin;
          workoutStats.workoutsLogged += 1;
          workoutStats.caloriesBurned += workout.actualCaloriesBurned || workout.estimatedCalories;
        }
      });
    }

    // Add logged workout entries from LoggedEntry (from AI parsing / manual entry)
    const loggedWorkouts = loggedEntries.filter((e) => e.type === 'workout');
    loggedWorkouts.forEach((entry) => {
      const workout = entry.workout as {
        durationMinutes?: number;
        caloriesBurned?: number;
      } | null;
      if (workout) {
        const durationMin = workout.durationMinutes || 0;
        const warmUpMin = Math.floor(durationMin * 0.1);
        const mainWorkoutMin = durationMin - warmUpMin;

        workoutStats.warmUpMinutes += warmUpMin;
        workoutStats.mainWorkoutMinutes += mainWorkoutMin;
        workoutStats.completedMinutes += durationMin;
        workoutStats.totalMinutes += durationMin;
        workoutStats.workoutsLogged += 1;
        workoutStats.caloriesBurned += workout.caloriesBurned || 0;
      }
    });

    return res.json({
      date: targetDate.toISOString().split('T')[0],
      dayOfWeek,
      nutrition: {
        consumed: nutritionConsumed,
        targets: nutritionTargets,
      },
      workout: {
        warmUpMinutes: workoutStats.warmUpMinutes,
        mainWorkoutMinutes: workoutStats.mainWorkoutMinutes,
        totalMinutes: workoutStats.totalMinutes,
        completedMinutes: workoutStats.completedMinutes,
        targetMinutes: workoutStats.targetMinutes,
        caloriesBurned: workoutStats.caloriesBurned,
        caloriesTarget: workoutStats.caloriesTarget,
        workoutsLogged: workoutStats.workoutsLogged,
        workoutsTotal: workoutStats.workoutsTotal,
      },
    });
  } catch (error) {
    console.error('Error fetching daily progress:', error);
    return res.status(500).json({
      error: 'Failed to fetch daily progress',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router;
