/**
 * Meals Routes
 * GET /api/meals/:id - Get single meal details
 * POST /api/meals/:id/log - Toggle meal logged status
 * PATCH /api/meals/:id/favorite - Toggle meal favorite status
 * POST /api/meals/:id/generate-alternatives - Generate AI meal alternatives for swapping
 */

import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { verifyFirebaseToken } from '../middleware/auth.middleware';
import { generateMealRecipe, generateMealAlternatives } from '../services/openai/mealGeneration.service';

const router = Router();
const prisma = new PrismaClient();

/**
 * GET /api/meals/:id
 * Returns: full meal details with ingredients and recipe steps
 */
router.get('/:id', verifyFirebaseToken, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { id } = req.params;

    // Fetch meal with all related data
    const meal = await prisma.meal.findUnique({
      where: { id },
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
    });

    if (!meal) {
      return res.status(404).json({ error: 'Meal not found' });
    }

    // Ensure meal belongs to user
    if (meal.userId !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Auto-generate recipe if it doesn't exist (on-demand generation)
    if (meal.ingredients.length === 0 || meal.recipeSteps.length === 0) {
      console.log(`[Meals] Auto-generating recipe for meal ${meal.id}: ${meal.name}`);
      const macros = meal.macros as { protein: number; carbs: number; fat: number };
      try {
        await generateMealRecipe(
          meal.id,
          meal.name,
          meal.description || '',
          {
            calories: meal.calories,
            protein: macros.protein,
            carbs: macros.carbs,
            fat: macros.fat,
          },
          userId // Pass userId for dietary restrictions
        );

        // Re-fetch the meal with the newly generated recipe
        const updatedMeal = await prisma.meal.findUnique({
          where: { id },
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
        });

        if (updatedMeal) {
          meal.ingredients = updatedMeal.ingredients;
          meal.recipeSteps = updatedMeal.recipeSteps;
        }
      } catch (error) {
        console.error('[Meals] Failed to auto-generate recipe:', error);
        // Continue with empty recipe - will show as no recipe available
      }
    }

    // Transform macros from JsonB
    const macros = meal.macros as { protein: number; carbs: number; fat: number };

    return res.json({
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
      isFavorite: meal.isFavorite,
      isDisliked: meal.isDisliked,
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
    });
  } catch (error) {
    console.error('Error fetching meal:', error);
    return res.status(500).json({
      error: 'Failed to fetch meal',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * POST /api/meals/:id/log
 * Toggle the logged status of a meal
 * Body: { logged?: boolean } - if not provided, toggles current state
 * Returns: updated meal with logged status
 */
router.post('/:id/log', verifyFirebaseToken, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { id } = req.params;
    const { logged } = req.body;

    // Fetch current meal
    const meal = await prisma.meal.findUnique({
      where: { id },
    });

    if (!meal) {
      return res.status(404).json({ error: 'Meal not found' });
    }

    // Ensure meal belongs to user
    if (meal.userId !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Determine new logged state (toggle if not specified)
    const newLoggedState = logged !== undefined ? logged : !meal.logged;

    // Update meal
    const updatedMeal = await prisma.meal.update({
      where: { id },
      data: {
        logged: newLoggedState,
        loggedAt: newLoggedState ? new Date() : null,
      },
    });

    // Transform macros from JsonB
    const macros = updatedMeal.macros as { protein: number; carbs: number; fat: number };

    return res.json({
      id: updatedMeal.id,
      name: updatedMeal.name,
      mealType: updatedMeal.mealType,
      calories: updatedMeal.calories,
      protein: macros.protein,
      carbs: macros.carbs,
      fat: macros.fat,
      isLogged: updatedMeal.logged,
      loggedAt: updatedMeal.loggedAt?.toISOString(),
    });
  } catch (error) {
    console.error('Error logging meal:', error);
    return res.status(500).json({
      error: 'Failed to log meal',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * GET /api/meals/:id/alternatives
 * Get swap alternatives for a meal (same meal type from user's meals)
 * Returns: array of meals that can be swapped with the current meal
 */
router.get('/:id/alternatives', verifyFirebaseToken, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { id } = req.params;

    // Fetch the meal being swapped
    const currentMeal = await prisma.meal.findUnique({
      where: { id },
    });

    if (!currentMeal) {
      return res.status(404).json({ error: 'Meal not found' });
    }

    if (currentMeal.userId !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Find alternative meals of the same type
    const alternatives = await prisma.meal.findMany({
      where: {
        userId,
        mealType: currentMeal.mealType,
        id: { not: id }, // Exclude the current meal
        isDisliked: false, // Exclude disliked meals
      },
      orderBy: [
        { isFavorite: 'desc' }, // Favorites first
        { dayOfWeek: 'asc' },
      ],
    });

    // Transform to response format
    const response = alternatives.map((meal) => {
      const macros = meal.macros as { protein: number; carbs: number; fat: number };
      return {
        id: meal.id,
        name: meal.name,
        mealType: meal.mealType,
        dayOfWeek: meal.dayOfWeek,
        calories: meal.calories,
        protein: macros.protein,
        carbs: macros.carbs,
        fat: macros.fat,
        isFavorite: meal.isFavorite,
      };
    });

    return res.json({
      originalMeal: {
        id: currentMeal.id,
        name: currentMeal.name,
        mealType: currentMeal.mealType,
        calories: currentMeal.calories,
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
 * PATCH /api/meals/:id/swap
 * Swap two meals in the meal plan
 * Body: { replacementMealId: string }
 * Returns: updated meal information
 */
router.patch('/:id/swap', verifyFirebaseToken, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { id } = req.params;
    const { replacementMealId } = req.body;

    if (!replacementMealId) {
      return res.status(400).json({ error: 'replacementMealId is required' });
    }

    // Fetch both meals
    const [originalMeal, replacementMeal] = await Promise.all([
      prisma.meal.findUnique({ where: { id } }),
      prisma.meal.findUnique({ where: { id: replacementMealId } }),
    ]);

    if (!originalMeal || !replacementMeal) {
      return res.status(404).json({ error: 'One or both meals not found' });
    }

    // Verify ownership
    if (originalMeal.userId !== userId || replacementMeal.userId !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Verify same meal type
    if (originalMeal.mealType !== replacementMeal.mealType) {
      return res.status(400).json({
        error: 'Cannot swap meals of different types',
        originalType: originalMeal.mealType,
        replacementType: replacementMeal.mealType,
      });
    }

    // Swap the dayOfWeek values
    const originalDayOfWeek = originalMeal.dayOfWeek;
    const replacementDayOfWeek = replacementMeal.dayOfWeek;

    // Perform the swap using a transaction
    await prisma.$transaction([
      prisma.meal.update({
        where: { id: originalMeal.id },
        data: { dayOfWeek: replacementDayOfWeek },
      }),
      prisma.meal.update({
        where: { id: replacementMeal.id },
        data: { dayOfWeek: originalDayOfWeek },
      }),
    ]);

    // Fetch updated meals
    const [updatedOriginal, updatedReplacement] = await Promise.all([
      prisma.meal.findUnique({ where: { id } }),
      prisma.meal.findUnique({ where: { id: replacementMealId } }),
    ]);

    return res.json({
      success: true,
      message: 'Meals swapped successfully',
      swappedMeals: {
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
    console.error('Error swapping meals:', error);
    return res.status(500).json({
      error: 'Failed to swap meals',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * POST /api/meals/:id/feedback
 * Submit feedback for a meal (thumbs up/down with optional comments)
 * Body: { rating: 1 | -1, comment?: string, dislikedIngredients?: string[] }
 * Returns: updated meal with feedback status
 */
router.post('/:id/feedback', verifyFirebaseToken, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { id } = req.params;
    const { rating, comment, dislikedIngredients } = req.body;

    // Validate rating
    if (rating !== 1 && rating !== -1) {
      return res.status(400).json({ error: 'Rating must be 1 (thumbs up) or -1 (thumbs down)' });
    }

    // Fetch current meal
    const meal = await prisma.meal.findUnique({
      where: { id },
    });

    if (!meal) {
      return res.status(404).json({ error: 'Meal not found' });
    }

    // Ensure meal belongs to user
    if (meal.userId !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Build feedback text from comment and disliked ingredients
    let feedbackText = comment || '';
    if (dislikedIngredients && dislikedIngredients.length > 0) {
      // Fetch ingredient names
      const ingredients = await prisma.ingredient.findMany({
        where: {
          id: { in: dislikedIngredients },
          mealId: id,
        },
        select: { name: true },
      });
      const ingredientNames = ingredients.map((ing) => ing.name).join(', ');
      if (ingredientNames) {
        feedbackText = feedbackText
          ? `${feedbackText}\nDisliked ingredients: ${ingredientNames}`
          : `Disliked ingredients: ${ingredientNames}`;
      }
    }

    // Update meal with feedback
    const updatedMeal = await prisma.meal.update({
      where: { id },
      data: {
        isFavorite: rating === 1,
        isDisliked: rating === -1,
        feedbackText: feedbackText || null,
        feedbackAt: new Date(),
      },
    });

    return res.json({
      id: updatedMeal.id,
      name: updatedMeal.name,
      isFavorite: updatedMeal.isFavorite,
      isDisliked: updatedMeal.isDisliked,
      feedbackText: updatedMeal.feedbackText,
      feedbackAt: updatedMeal.feedbackAt?.toISOString(),
    });
  } catch (error) {
    console.error('Error submitting meal feedback:', error);
    return res.status(500).json({
      error: 'Failed to submit feedback',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * PATCH /api/meals/:id/favorite
 * Toggle the favorite status of a meal
 * Body: { isFavorite?: boolean } - if not provided, toggles current state
 * Returns: updated meal with favorite status
 */
router.patch('/:id/favorite', verifyFirebaseToken, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { id } = req.params;
    const { isFavorite } = req.body;

    // Fetch current meal
    const meal = await prisma.meal.findUnique({
      where: { id },
    });

    if (!meal) {
      return res.status(404).json({ error: 'Meal not found' });
    }

    // Ensure meal belongs to user
    if (meal.userId !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Determine new favorite state (toggle if not specified)
    const newFavoriteState = isFavorite !== undefined ? isFavorite : !meal.isFavorite;

    // Update meal
    const updatedMeal = await prisma.meal.update({
      where: { id },
      data: {
        isFavorite: newFavoriteState,
      },
    });

    return res.json({
      id: updatedMeal.id,
      name: updatedMeal.name,
      isFavorited: updatedMeal.isFavorite,
      isLogged: updatedMeal.logged,
    });
  } catch (error) {
    console.error('Error toggling meal favorite:', error);
    return res.status(500).json({
      error: 'Failed to toggle meal favorite',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * POST /api/meals/:id/generate-alternatives
 * Generate AI-powered meal alternatives for swapping
 * Returns: array of 3 alternative meals with similar macros
 */
router.post('/:id/generate-alternatives', verifyFirebaseToken, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { id } = req.params;

    // Fetch the original meal
    const meal = await prisma.meal.findUnique({
      where: { id },
    });

    if (!meal) {
      return res.status(404).json({ error: 'Meal not found' });
    }

    // Ensure meal belongs to user
    if (meal.userId !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Extract macros from meal
    const macros = meal.macros as { protein: number; carbs: number; fat: number };

    // Generate alternatives using OpenAI
    console.log(`[MealAlternatives] Generating alternatives for meal: ${meal.name}`);
    const { alternatives } = await generateMealAlternatives(userId, {
      name: meal.name,
      mealType: meal.mealType as 'breakfast' | 'lunch' | 'dinner' | 'snack',
      calories: meal.calories,
      protein: macros.protein,
      carbs: macros.carbs,
      fat: macros.fat,
    });

    console.log(`[MealAlternatives] Generated ${alternatives.length} alternatives`);

    // Transform response to match expected format
    const response = alternatives.map((alt) => ({
      name: alt.name,
      description: alt.description,
      mealType: alt.mealType,
      calories: alt.calories,
      protein: alt.protein,
      carbs: alt.carbs,
      fat: alt.fat,
      prepTimeMin: alt.prepTimeMin,
      cookTimeMin: alt.cookTimeMin,
    }));

    return res.json({
      originalMeal: {
        id: meal.id,
        name: meal.name,
        mealType: meal.mealType,
        calories: meal.calories,
        protein: macros.protein,
        carbs: macros.carbs,
        fat: macros.fat,
      },
      alternatives: response,
      count: response.length,
    });
  } catch (error) {
    console.error('Error generating meal alternatives:', error);
    return res.status(500).json({
      error: 'Failed to generate meal alternatives',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * POST /api/meals/:id/replace-with-alternative
 * Replace a meal with an AI-generated alternative
 * Body: { name, description, mealType, calories, protein, carbs, fat, prepTimeMin, cookTimeMin }
 * Returns: newly created meal
 */
router.post('/:id/replace-with-alternative', verifyFirebaseToken, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { id } = req.params;
    const { name, description, mealType, calories, protein, carbs, fat, prepTimeMin, cookTimeMin } = req.body;

    // Validate required fields
    if (!name || !mealType || calories === undefined || protein === undefined || carbs === undefined || fat === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Fetch the original meal to get its position in the plan
    const originalMeal = await prisma.meal.findUnique({
      where: { id },
    });

    if (!originalMeal) {
      return res.status(404).json({ error: 'Original meal not found' });
    }

    // Verify ownership
    if (originalMeal.userId !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Create new meal with alternative data, using original meal's position
    const newMeal = await prisma.meal.create({
      data: {
        userId,
        mealPlanId: originalMeal.mealPlanId,
        name,
        description: description || null,
        mealType: mealType as 'breakfast' | 'lunch' | 'dinner' | 'snack',
        dayOfWeek: originalMeal.dayOfWeek,
        calories,
        macros: {
          protein,
          carbs,
          fat,
        },
        prepTimeMin: prepTimeMin || null,
        cookTimeMin: cookTimeMin || null,
        logged: false,
        isFavorite: false,
      },
    });

    // Mark the original meal as swapped out (soft delete for swap history)
    await prisma.meal.update({
      where: { id },
      data: {
        swappedOut: true,
        swappedOutAt: new Date(),
      },
    });

    console.log(`[MealReplacement] Replaced meal ${originalMeal.name} with ${newMeal.name}`);

    return res.json({
      success: true,
      message: 'Meal replaced successfully',
      meal: {
        id: newMeal.id,
        name: newMeal.name,
        mealType: newMeal.mealType,
        dayOfWeek: newMeal.dayOfWeek,
        calories: newMeal.calories,
        macros: newMeal.macros,
      },
    });
  } catch (error) {
    console.error('Error replacing meal with alternative:', error);
    return res.status(500).json({
      error: 'Failed to replace meal',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router;
