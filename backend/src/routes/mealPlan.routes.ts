/**
 * Meal Plan Routes
 * GET /api/meal-plans/daily - Get meals for a specific date
 */

import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { verifyFirebaseToken } from '../middleware/auth.middleware';
import { generateWeeklyMealPlan, storeMealPlan, generateMealRecipe, autoExpireOldMealPlans } from '../services/openai/mealGeneration.service';

const router = Router();
const prisma = new PrismaClient();

// Helper function to get day of week from date (0 = Sunday, 1 = Monday, etc.)
function getDayOfWeek(date: Date): number {
  return date.getDay();
}

/**
 * GET /api/meal-plans/daily
 * Query params: date (YYYY-MM-DD format, defaults to today)
 * Returns: meals for the specified date with nutrition info
 */
router.get('/daily', verifyFirebaseToken, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // Auto-expire old meal plans (Phase-1 Hybrid logic)
    await autoExpireOldMealPlans(userId);

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

    // Find active meal plan for this week
    const mealPlan = await prisma.mealPlan.findFirst({
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
        meals: {
          where: {
            dayOfWeek,
            swappedOut: false, // Exclude swapped meals from active plan
          },
          orderBy: [
            {
              mealType: 'asc', // breakfast, lunch, dinner, snack in enum order
            },
          ],
          include: {
            ingredients: {
              orderBy: {
                displayOrder: 'asc',
              },
            },
            recipeSteps: {
              orderBy: {
                stepNumber: 'asc',
              },
            },
          },
        },
      },
    });

    if (!mealPlan) {
      // No meal plan found for this week
      return res.json({
        date: targetDate.toISOString().split('T')[0],
        dayOfWeek,
        meals: [],
        message: 'No meal plan found for this week',
      });
    }

    // Transform meals to match mobile interface
    const meals = mealPlan.meals.map((meal) => {
      // macros is stored as JsonB, expected shape: { protein: number, carbs: number, fat: number }
      const macros = meal.macros as { protein: number; carbs: number; fat: number };

      return {
        id: meal.id,
        name: meal.name,
        description: meal.description,
        imageUrl: meal.imageUrl,
        mealType: meal.mealType,
        calories: meal.calories,
        protein: macros.protein,
        carbs: macros.carbs,
        fat: macros.fat,
        prepTimeMin: meal.prepTimeMin,
        cookTimeMin: meal.cookTimeMin,
        isFavorite: meal.isFavorite,
        isLogged: meal.logged,
        loggedAt: meal.loggedAt?.toISOString(),
        ingredients: meal.ingredients.map((ing) => ({
          id: ing.id,
          name: ing.name,
          quantity: Number(ing.quantity),
          unit: ing.unit,
          category: ing.category,
          notes: ing.notes,
        })),
        recipeSteps: meal.recipeSteps.map((step) => ({
          stepNumber: step.stepNumber,
          instruction: step.instruction,
        })),
      };
    });

    // Calculate total nutrition for the day
    const totalNutrition = meals.reduce(
      (acc, meal) => {
        acc.calories += meal.calories;
        acc.protein += meal.protein;
        acc.carbs += meal.carbs;
        acc.fat += meal.fat;
        return acc;
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );

    const response = {
      date: targetDate.toISOString().split('T')[0],
      dayOfWeek,
      meals,
      totalNutrition,
      mealPlanId: mealPlan.id,
      weekStartDate: mealPlan.weekStartDate.toISOString().split('T')[0],
      weekEndDate: mealPlan.weekEndDate.toISOString().split('T')[0],
    };

    return res.json(response);
  } catch (error) {
    console.error('Error fetching daily meals:', error);
    return res.status(500).json({
      error: 'Failed to fetch daily meals',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * GET /api/meal-plans/weekly
 * Get the current active weekly meal plan with all meals
 * Returns: full meal plan with all meals for the week
 */
router.get('/weekly', verifyFirebaseToken, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // Find active meal plan
    const mealPlan = await prisma.mealPlan.findFirst({
      where: {
        userId,
        status: 'active',
      },
      include: {
        meals: {
          where: {
            swappedOut: false, // Exclude swapped meals from active plan
          },
          orderBy: [
            { dayOfWeek: 'asc' },
            { mealType: 'asc' },
          ],
          include: {
            ingredients: {
              orderBy: { displayOrder: 'asc' },
            },
            recipeSteps: {
              orderBy: { stepNumber: 'asc' },
            },
          },
        },
      },
    });

    if (!mealPlan) {
      return res.status(404).json({
        error: 'No active meal plan found',
        message: 'Generate a meal plan first',
      });
    }

    // Transform response
    const response = {
      id: mealPlan.id,
      weekStartDate: mealPlan.weekStartDate.toISOString().split('T')[0],
      weekEndDate: mealPlan.weekEndDate.toISOString().split('T')[0],
      status: mealPlan.status,
      mealCount: mealPlan.meals.length,
      meals: mealPlan.meals.map((meal) => {
        const macros = meal.macros as { protein: number; carbs: number; fat: number };
        return {
          id: meal.id,
          name: meal.name,
          description: meal.description,
          mealType: meal.mealType,
          dayOfWeek: meal.dayOfWeek,
          calories: meal.calories,
          protein: macros.protein,
          carbs: macros.carbs,
          fat: macros.fat,
          prepTimeMin: meal.prepTimeMin,
          cookTimeMin: meal.cookTimeMin,
          isLogged: meal.logged,
          isFavorite: meal.isFavorite,
          ingredients: meal.ingredients.map((ing) => ({
            id: ing.id,
            name: ing.name,
            quantity: Number(ing.quantity),
            unit: ing.unit,
            category: ing.category,
          })),
          recipeSteps: meal.recipeSteps.map((step) => ({
            stepNumber: step.stepNumber,
            instruction: step.instruction,
          })),
        };
      }),
    };

    return res.json(response);
  } catch (error) {
    console.error('Error fetching weekly meal plan:', error);
    return res.status(500).json({
      error: 'Failed to fetch weekly meal plan',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * POST /api/meal-plans/generate
 * Generate a new weekly meal plan using OpenAI
 * Body: { weekStartDate?: string } - Optional start date (defaults to next Monday)
 * Returns: generated meal plan with all meals
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
    const existingPlan = await prisma.mealPlan.findFirst({
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
      // Mark the existing plan as past
      await prisma.mealPlan.update({
        where: { id: existingPlan.id },
        data: { status: 'past' },
      });
    }

    // Generate meal plan using OpenAI
    const { meals, macroAnalysis } = await generateWeeklyMealPlan(userId);

    // Store the generated meal plan
    const mealPlanId = await storeMealPlan(userId, meals, weekStartDate);

    // Fetch the complete meal plan with all relations
    const mealPlan = await prisma.mealPlan.findUnique({
      where: { id: mealPlanId },
      include: {
        meals: {
          where: {
            swappedOut: false, // Exclude swapped meals from active plan
          },
          orderBy: [
            { dayOfWeek: 'asc' },
            { mealType: 'asc' },
          ],
          include: {
            ingredients: {
              orderBy: { displayOrder: 'asc' },
            },
            recipeSteps: {
              orderBy: { stepNumber: 'asc' },
            },
          },
        },
      },
    });

    if (!mealPlan) {
      throw new Error('Failed to retrieve generated meal plan');
    }

    // Start generating all recipes in the background (fire-and-forget)
    // This happens asynchronously so the user doesn't have to wait
    console.log(`[MealPlan] Starting background recipe generation for ${mealPlan.meals.length} meals`);
    Promise.all(
      mealPlan.meals.map(async (meal) => {
        try {
          const macros = meal.macros as { protein: number; carbs: number; fat: number };
          await generateMealRecipe(
            meal.id,
            meal.name,
            meal.description || '',
            {
              calories: meal.calories,
              protein: macros.protein,
              carbs: macros.carbs,
              fat: macros.fat,
            }
          );
          console.log(`[MealPlan] ✅ Recipe generated for: ${meal.name}`);
        } catch (error) {
          console.error(`[MealPlan] ❌ Failed to generate recipe for ${meal.name}:`, error);
        }
      })
    ).then(() => {
      console.log(`[MealPlan] ✅ All recipes generated successfully`);
    }).catch((error) => {
      console.error('[MealPlan] Some recipes failed to generate:', error);
    });

    // Calculate week end date
    const weekEndDate = new Date(weekStartDate);
    weekEndDate.setDate(weekEndDate.getDate() + 6);

    // Transform response
    const response = {
      id: mealPlan.id,
      weekStartDate: weekStartDate.toISOString().split('T')[0],
      weekEndDate: weekEndDate.toISOString().split('T')[0],
      status: mealPlan.status,
      macroAnalysis,
      mealCount: mealPlan.meals.length,
      meals: mealPlan.meals.map((meal) => {
        const macros = meal.macros as { protein: number; carbs: number; fat: number };
        return {
          id: meal.id,
          name: meal.name,
          description: meal.description,
          mealType: meal.mealType,
          dayOfWeek: meal.dayOfWeek,
          calories: meal.calories,
          protein: macros.protein,
          carbs: macros.carbs,
          fat: macros.fat,
          prepTimeMin: meal.prepTimeMin,
          cookTimeMin: meal.cookTimeMin,
          ingredients: meal.ingredients.map((ing) => ({
            id: ing.id,
            name: ing.name,
            quantity: Number(ing.quantity),
            unit: ing.unit,
            category: ing.category,
          })),
          recipeSteps: meal.recipeSteps.map((step) => ({
            stepNumber: step.stepNumber,
            instruction: step.instruction,
          })),
        };
      }),
    };

    return res.status(201).json(response);
  } catch (error) {
    console.error('Error generating meal plan:', error);
    return res.status(500).json({
      error: 'Failed to generate meal plan',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * POST /api/meal-plans/meals/:mealId/recipe
 * Generate recipe (ingredients + instructions) for a specific meal
 * This is called on-demand when user views a meal that doesn't have a recipe yet
 */
router.post('/meals/:mealId/recipe', verifyFirebaseToken, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { mealId } = req.params;

    // Fetch meal to ensure it exists and belongs to this user
    const meal = await prisma.meal.findFirst({
      where: {
        id: mealId,
        userId,
      },
      include: {
        ingredients: true,
        recipeSteps: true,
      },
    });

    if (!meal) {
      return res.status(404).json({ error: 'Meal not found' });
    }

    // Check if recipe already exists
    if (meal.ingredients.length > 0 && meal.recipeSteps.length > 0) {
      return res.json({
        success: true,
        message: 'Recipe already exists',
        data: {
          ingredients: meal.ingredients,
          instructions: meal.recipeSteps.map(step => step.instruction),
        },
      });
    }

    // Generate recipe
    const macros = meal.macros as { protein: number; carbs: number; fat: number };
    const recipe = await generateMealRecipe(
      mealId,
      meal.name,
      meal.description || '',
      {
        calories: meal.calories,
        protein: macros.protein,
        carbs: macros.carbs,
        fat: macros.fat,
      }
    );

    return res.json({
      success: true,
      message: 'Recipe generated successfully',
      data: recipe,
    });
  } catch (error) {
    console.error('Error generating meal recipe:', error);
    return res.status(500).json({
      error: 'Failed to generate recipe',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * GET /api/meal-plans/swapped
 * Returns swapped meals from the current week for swap history/undo
 */
router.get('/swapped', verifyFirebaseToken, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // Find active meal plan
    const mealPlan = await prisma.mealPlan.findFirst({
      where: {
        userId,
        status: 'active',
      },
      include: {
        meals: {
          where: {
            swappedOut: true, // Only fetch swapped meals
          },
          orderBy: [
            { swappedOutAt: 'desc' }, // Most recent swaps first
          ],
        },
      },
    });

    if (!mealPlan) {
      return res.json({ meals: [] });
    }

    // Transform meals to match mobile interface
    const swappedMeals = mealPlan.meals.map((meal) => {
      const macros = meal.macros as { protein: number; carbs: number; fat: number };

      return {
        id: meal.id,
        name: meal.name,
        description: meal.description,
        imageUrl: meal.imageUrl,
        mealType: meal.mealType,
        dayOfWeek: meal.dayOfWeek,
        calories: meal.calories,
        protein: macros.protein,
        carbs: macros.carbs,
        fat: macros.fat,
        prepTimeMin: meal.prepTimeMin,
        cookTimeMin: meal.cookTimeMin,
        swappedOutAt: meal.swappedOutAt?.toISOString(),
      };
    });

    return res.json({ meals: swappedMeals });
  } catch (error) {
    console.error('Error fetching swapped meals:', error);
    return res.status(500).json({
      error: 'Failed to fetch swapped meals',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router;
