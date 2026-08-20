/**
 * Grocery List Routes
 * Q3.4: Weekly Planning & Grocery Management
 *
 * Endpoints:
 * - GET /api/grocery-lists - Get current week's grocery list
 * - POST /api/grocery-lists/generate - Generate grocery list from meal plan
 * - PATCH /api/grocery-lists/:id - Update grocery item (check/uncheck, edit qty)
 * - POST /api/grocery-lists/items - Add custom item
 * - DELETE /api/grocery-lists/:id - Delete item
 */

import { Router, Request, Response } from 'express';
import { PrismaClient, Prisma } from '@prisma/client';
import { verifyFirebaseToken } from '../middleware/auth.middleware';
import { generateMealRecipe } from '../services/openai/mealGeneration.service';

const router = Router();
const prisma = new PrismaClient();

/**
 * GET /api/grocery-lists
 * Get current week's grocery list grouped by category
 */
router.get('/', verifyFirebaseToken, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // Find active meal plan
    const activeMealPlan = await prisma.mealPlan.findFirst({
      where: {
        userId,
        status: 'active',
      },
      orderBy: {
        weekStartDate: 'desc',
      },
    });

    if (!activeMealPlan) {
      return res.json({ items: [], total: 0 });
    }

    // Fetch all grocery items for this meal plan
    const groceryItems = await prisma.groceryList.findMany({
      where: {
        mealPlanId: activeMealPlan.id,
      },
      orderBy: [
        { displayOrder: 'asc' },
        { itemName: 'asc' },
      ],
    });

    // Group by category
    const categoryOrder = ['proteins', 'produce', 'dairy-eggs', 'pantry', 'spices', 'frozen', 'bakery', 'other'];

    const itemsByCategory = categoryOrder.reduce((acc, category) => {
      const categoryItems = groceryItems.filter(item => item.category === category);
      if (categoryItems.length > 0) {
        acc[category] = categoryItems.map(item => ({
          id: item.id,
          itemName: item.itemName,
          quantity: parseFloat(item.quantity.toString()),
          unit: item.unit,
          category: item.category,
          purchased: item.purchased,
          notes: item.notes,
        }));
      }
      return acc;
    }, {} as Record<string, any[]>);

    const totalItems = groceryItems.length;
    const checkedItems = groceryItems.filter(item => item.purchased).length;

    return res.json({
      items: itemsByCategory,
      total: totalItems,
      checked: checkedItems,
      weekStart: activeMealPlan.weekStartDate,
      weekEnd: activeMealPlan.weekEndDate,
    });
  } catch (error) {
    console.error('Error fetching grocery list:', error);
    return res.status(500).json({
      error: 'Failed to fetch grocery list',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * POST /api/grocery-lists/generate
 * Generate consolidated grocery list from current meal plan
 */
router.post('/generate', verifyFirebaseToken, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // Find active meal plan with meals and ingredients
    const activeMealPlan = await prisma.mealPlan.findFirst({
      where: {
        userId,
        status: 'active',
      },
      include: {
        meals: {
          where: {
            swappedOut: false, // Only include active meals
          },
          include: {
            ingredients: true,
          },
        },
      },
      orderBy: {
        weekStartDate: 'desc',
      },
    });

    if (!activeMealPlan) {
      return res.status(404).json({ error: 'No active meal plan found' });
    }

    // STEP 1: Auto-generate recipes for meals that don't have ingredients (IN PARALLEL)
    const mealsNeedingRecipes = activeMealPlan.meals.filter(m => m.ingredients.length === 0);
    console.log(`[GroceryList] Found ${mealsNeedingRecipes.length} meals needing recipes (out of ${activeMealPlan.meals.length} total)`);

    if (mealsNeedingRecipes.length > 0) {
      console.log(`[GroceryList] Generating ${mealsNeedingRecipes.length} recipes in parallel...`);
      const startTime = Date.now();

      // Generate all recipes in parallel using Promise.allSettled (continues even if some fail)
      const results = await Promise.allSettled(
        mealsNeedingRecipes.map(async (meal) => {
          const macros = meal.macros as { protein: number; carbs: number; fat: number };
          console.log(`[GroceryList] Starting recipe generation for: ${meal.name}`);

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

          return meal.name;
        })
      );

      const succeeded = results.filter(r => r.status === 'fulfilled').length;
      const failed = results.filter(r => r.status === 'rejected').length;
      const durationSec = ((Date.now() - startTime) / 1000).toFixed(1);

      console.log(`[GroceryList] Recipe generation complete in ${durationSec}s: ${succeeded} succeeded, ${failed} failed`);

      if (failed > 0) {
        results.forEach((result, idx) => {
          if (result.status === 'rejected') {
            console.error(`[GroceryList] Failed to generate recipe for ${mealsNeedingRecipes[idx].name}:`, result.reason);
          }
        });
      }
    } else {
      console.log(`[GroceryList] All meals already have recipes, skipping generation`);
    }

    // STEP 2: Re-fetch meal plan with all ingredients (including newly generated ones)
    const updatedMealPlan = await prisma.mealPlan.findFirst({
      where: {
        userId,
        status: 'active',
      },
      include: {
        meals: {
          where: {
            swappedOut: false,
          },
          include: {
            ingredients: true,
          },
        },
      },
      orderBy: {
        weekStartDate: 'desc',
      },
    });

    if (!updatedMealPlan) {
      return res.status(404).json({ error: 'Meal plan not found after recipe generation' });
    }

    // Delete existing grocery list for this meal plan
    await prisma.groceryList.deleteMany({
      where: {
        mealPlanId: activeMealPlan.id,
      },
    });

    // Consolidate ingredients
    const consolidatedItems = consolidateIngredients(updatedMealPlan.meals);

    // Filter out invalid items (NaN, Infinity, null, or too large)
    const MAX_QUANTITY = 999999.99; // Database limit for Decimal(8,2)
    const validItems = consolidatedItems.filter(item => {
      const isValid =
        item.quantity != null &&
        isFinite(item.quantity) &&
        !isNaN(item.quantity) &&
        item.quantity > 0 &&
        item.quantity <= MAX_QUANTITY;

      if (!isValid) {
        console.warn(`[GroceryList] Skipping invalid item: ${item.itemName} with quantity ${item.quantity} (unit: ${item.unit})`);
      }

      return isValid;
    });

    console.log(`[GroceryList] Saving ${validItems.length} valid items (filtered out ${consolidatedItems.length - validItems.length} invalid items)`);

    // Save grocery items to database
    const groceryItems = await Promise.all(
      validItems.map((item, index) =>
        prisma.groceryList.create({
          data: {
            userId,
            mealPlanId: activeMealPlan.id,
            itemName: item.itemName,
            quantity: new Prisma.Decimal(item.quantity),
            unit: item.unit,
            category: item.category,
            displayOrder: index,
          },
        })
      )
    );

    return res.json({
      message: 'Grocery list generated successfully',
      totalItems: groceryItems.length,
      items: groceryItems.map(item => ({
        id: item.id,
        itemName: item.itemName,
        quantity: parseFloat(item.quantity.toString()),
        unit: item.unit,
        category: item.category,
        purchased: item.purchased,
      })),
    });
  } catch (error) {
    console.error('Error generating grocery list:', error);
    return res.status(500).json({
      error: 'Failed to generate grocery list',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * PATCH /api/grocery-lists/:id
 * Update a grocery item (toggle purchased, edit quantity, etc.)
 */
router.patch('/:id', verifyFirebaseToken, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;
    const { purchased, quantity, unit, notes } = req.body;

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // Verify item belongs to user
    const item = await prisma.groceryList.findUnique({
      where: { id },
    });

    if (!item || item.userId !== userId) {
      return res.status(404).json({ error: 'Grocery item not found' });
    }

    // Update item
    const updateData: any = {};
    if (purchased !== undefined) updateData.purchased = purchased;
    if (quantity !== undefined) updateData.quantity = new Prisma.Decimal(quantity);
    if (unit !== undefined) updateData.unit = unit;
    if (notes !== undefined) updateData.notes = notes;

    const updatedItem = await prisma.groceryList.update({
      where: { id },
      data: updateData,
    });

    return res.json({
      id: updatedItem.id,
      itemName: updatedItem.itemName,
      quantity: parseFloat(updatedItem.quantity.toString()),
      unit: updatedItem.unit,
      category: updatedItem.category,
      purchased: updatedItem.purchased,
      notes: updatedItem.notes,
    });
  } catch (error) {
    console.error('Error updating grocery item:', error);
    return res.status(500).json({
      error: 'Failed to update grocery item',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * POST /api/grocery-lists/items
 * Add custom grocery item
 */
router.post('/items', verifyFirebaseToken, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { itemName, quantity, unit, category, notes } = req.body;

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    if (!itemName) {
      return res.status(400).json({ error: 'Item name is required' });
    }

    // Find active meal plan
    const activeMealPlan = await prisma.mealPlan.findFirst({
      where: {
        userId,
        status: 'active',
      },
      orderBy: {
        weekStartDate: 'desc',
      },
    });

    if (!activeMealPlan) {
      return res.status(404).json({ error: 'No active meal plan found' });
    }

    // Get max display order
    const maxOrder = await prisma.groceryList.findFirst({
      where: {
        mealPlanId: activeMealPlan.id,
      },
      orderBy: {
        displayOrder: 'desc',
      },
      select: {
        displayOrder: true,
      },
    });

    const newItem = await prisma.groceryList.create({
      data: {
        userId,
        mealPlanId: activeMealPlan.id,
        itemName,
        quantity: new Prisma.Decimal(quantity || 1),
        unit: unit || '',
        category: category || 'other',
        notes,
        displayOrder: (maxOrder?.displayOrder || 0) + 1,
      },
    });

    return res.json({
      id: newItem.id,
      itemName: newItem.itemName,
      quantity: parseFloat(newItem.quantity.toString()),
      unit: newItem.unit,
      category: newItem.category,
      purchased: newItem.purchased,
      notes: newItem.notes,
    });
  } catch (error) {
    console.error('Error adding grocery item:', error);
    return res.status(500).json({
      error: 'Failed to add grocery item',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * DELETE /api/grocery-lists/:id
 * Delete a grocery item
 */
router.delete('/:id', verifyFirebaseToken, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // Verify item belongs to user
    const item = await prisma.groceryList.findUnique({
      where: { id },
    });

    if (!item || item.userId !== userId) {
      return res.status(404).json({ error: 'Grocery item not found' });
    }

    await prisma.groceryList.delete({
      where: { id },
    });

    return res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Error deleting grocery item:', error);
    return res.status(500).json({
      error: 'Failed to delete grocery item',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * Consolidate ingredients from meals into grocery list
 * Per Q3.4 spec lines 1055-1186
 */
/**
 * Normalize ingredient name to handle singular/plural variations
 * Examples: "egg"/"eggs" → "eggs", "tomato"/"tomatoes" → "tomatoes"
 */
function normalizeIngredientName(name: string): string {
  const trimmed = name.toLowerCase().trim();

  // Common singular/plural patterns for US grocery items
  const pluralMappings: Record<string, string> = {
    'egg': 'eggs',
    'tomato': 'tomatoes',
    'potato': 'potatoes',
    'onion': 'onions',
    'carrot': 'carrots',
    'bell pepper': 'bell peppers',
    'chicken breast': 'chicken breasts',
    'avocado': 'avocados',
    'banana': 'bananas',
    'apple': 'apples',
    'orange': 'oranges',
    'lemon': 'lemons',
    'lime': 'limes',
  };

  // Check if it's a known singular form
  if (pluralMappings[trimmed]) {
    return pluralMappings[trimmed];
  }

  // Check if it ends with 's' and the singular form is mapped
  if (trimmed.endsWith('s')) {
    return trimmed; // Already plural
  }

  // Default: return as-is
  return trimmed;
}

/**
 * Get US grocery-standard unit for specific items
 * Prioritizes item-specific preferences over category defaults
 */
function getPreferredUnit(normalizedName: string): string | null {
  const itemUnits: Record<string, string> = {
    // Count items (whole produce)
    'eggs': 'count',
    'egg': 'count',
    'avocados': 'count',
    'avocado': 'count',
    'bell peppers': 'count',
    'bell pepper': 'count',
    'onions': 'count',
    'onion': 'count',
    'bananas': 'count',
    'banana': 'count',
    'apples': 'count',
    'apple': 'count',
    'oranges': 'count',
    'orange': 'count',
    'lemons': 'count',
    'lemon': 'count',
    'limes': 'count',
    'lime': 'count',
    'potatoes': 'count',
    'potato': 'count',

    // Vegetables - weight based (grocery store standard)
    'broccoli': 'lb',
    'tomatoes': 'lb',
    'tomato': 'lb',
    'cherry tomatoes': 'lb',
    'cherry tomato': 'lb',
    'spinach': 'lb',
    'kale': 'lb',
    'carrots': 'lb',
    'carrot': 'lb',
    'zucchini': 'lb',
    'mushrooms': 'lb',
    'green beans': 'lb',
    'asparagus': 'lb',
    'brussels sprouts': 'lb',
    'cauliflower': 'lb',
    'basil': 'oz',
    'fresh basil': 'oz',
    'basil leaves': 'oz',
    'fresh basil leaves': 'oz',

    // Dairy - fluid ounces for grocery shopping
    'milk': 'oz',
    'yogurt': 'oz',
    'greek yogurt': 'oz',
    'heavy cream': 'oz',
    'sour cream': 'oz',
    'cottage cheese': 'oz',

    // Cheese - weight based
    'cheddar cheese': 'oz',
    'mozzarella': 'oz',
    'parmesan': 'oz',
    'feta': 'oz',
    'cheese': 'oz',

    // Proteins - weight based
    'chicken breast': 'lb',
    'chicken breasts': 'lb',
    'chicken': 'lb',
    'ground beef': 'lb',
    'beef': 'lb',
    'salmon': 'lb',
    'shrimp': 'lb',
    'tofu': 'lb',
    'turkey': 'lb',
    'pork': 'lb',

    // Liquids - tablespoons for smaller quantities, oz for larger
    'olive oil': 'oz',
    'vegetable oil': 'oz',
    'soy sauce': 'oz',
    'vinegar': 'oz',
    'sesame oil': 'oz',

    // Aromatics
    'garlic': 'oz',
    'garlic cloves': 'clove',
    'garlic clove': 'clove',
    'clove garlic': 'clove',
    'cloves garlic': 'clove',

    // Bread items
    'baguette': 'count',
    'baguettes': 'count',
    'ciabatta': 'count',
    'ciabatta bread': 'count',
    'bread': 'oz',
    'whole grain bread': 'oz',

    // Pantry items - weight based (grocery store standard)
    'chia seeds': 'oz',
    'flax seeds': 'oz',
    'flaxseed': 'oz',
    'sesame seeds': 'oz',
    'sunflower seeds': 'oz',
    'pumpkin seeds': 'oz',
    'almonds': 'oz',
    'walnuts': 'oz',
    'pecans': 'oz',
    'cashews': 'oz',
    'peanuts': 'oz',
    'oats': 'oz',
    'rolled oats': 'oz',
    'quinoa': 'oz',
    'rice': 'oz',
    'brown rice': 'oz',
    'white rice': 'oz',
    'flour': 'oz',
    'all-purpose flour': 'oz',
    'whole wheat flour': 'oz',
    'sugar': 'oz',
    'brown sugar': 'oz',
    'honey': 'oz',
    'maple syrup': 'oz',
    'peanut butter': 'oz',
    'almond butter': 'oz',

    // Spices - small volume (keep as tsp for small quantities)
    'salt': 'tsp',
    'pepper': 'tsp',
    'black pepper': 'tsp',
    'garlic powder': 'tsp',
    'paprika': 'tsp',
    'cumin': 'tsp',
    'oregano': 'tsp',
    'dried basil': 'tsp',
    'cinnamon': 'tsp',
    'ginger': 'tsp',
    'turmeric': 'tsp',
    'chili powder': 'tsp',
    'cayenne pepper': 'tsp',
  };

  return itemUnits[normalizedName] || null;
}

function consolidateIngredients(meals: any[]): any[] {
  // Extract all ingredients from all meals
  const allIngredients: any[] = [];
  meals.forEach(meal => {
    if (meal.ingredients && meal.ingredients.length > 0) {
      meal.ingredients.forEach((ing: any) => {
        // Convert Prisma Decimal to number
        const quantity = typeof ing.quantity === 'object' && ing.quantity.toNumber
          ? ing.quantity.toNumber()
          : Number(ing.quantity);

        allIngredients.push({
          name: ing.name,
          quantity: quantity,
          unit: ing.unit,
          category: ing.category || 'other',
        });
      });
    }
  });

  console.log(`[GroceryList] Consolidating ${allIngredients.length} total ingredient entries`);

  // Group by normalized ingredient name
  const grouped = new Map<string, any[]>();
  allIngredients.forEach(ingredient => {
    const normalizedName = normalizeIngredientName(ingredient.name);
    if (!grouped.has(normalizedName)) {
      grouped.set(normalizedName, []);
    }
    grouped.get(normalizedName)!.push(ingredient);
  });

  console.log(`[GroceryList] Grouped into ${grouped.size} unique items`);

  // Consolidate quantities
  const consolidated: any[] = [];
  grouped.forEach((ingredients, normalizedName) => {
    const category = ingredients[0].category;

    // Prefer item-specific unit, fallback to category-based logic
    const preferredUnit = getPreferredUnit(normalizedName);
    const targetUnit = preferredUnit || determineTargetUnit(category, ingredients);

    // Detailed logging for eggs
    if (normalizedName === 'eggs' || normalizedName === 'egg') {
      console.log(`\n[GroceryList] EGGS DEBUG:`);
      console.log(`  Found ${ingredients.length} egg ingredient entries`);
      console.log(`  Target unit: ${targetUnit}`);
      ingredients.forEach((ing, idx) => {
        console.log(`  [${idx}] ${ing.name}: qty=${ing.quantity} (type: ${typeof ing.quantity}), unit=${ing.unit}`);
      });
    }

    // Log ingredient details for debugging
    if (ingredients.some(ing => ing.quantity > 100)) {
      console.log(`[GroceryList] High quantity detected for ${normalizedName}:`);
      ingredients.forEach(ing => {
        console.log(`  - ${ing.quantity} ${ing.unit} (category: ${ing.category})`);
      });
    }

    // Convert all to target unit and sum
    let totalQuantity = 0;
    let skippedCount = 0;
    ingredients.forEach(ing => {
      const converted = convertToUnit(ing.quantity, ing.unit, targetUnit);

      // More eggs logging
      if (normalizedName === 'eggs' || normalizedName === 'egg') {
        console.log(`  Converting ${ing.quantity} ${ing.unit} → ${converted} ${targetUnit}`);
      }

      if (converted !== null) {
        totalQuantity += converted;
      } else {
        skippedCount++;
        console.warn(`[GroceryList] Skipped ${normalizedName}: ${ing.quantity} ${ing.unit} (cannot convert to ${targetUnit})`);
      }
    });

    // Only add to list if we have a valid quantity
    if (totalQuantity > 0) {
      // Round to reasonable precision
      totalQuantity = roundQuantity(totalQuantity, targetUnit);

      // More eggs logging
      if (normalizedName === 'eggs' || normalizedName === 'egg') {
        console.log(`  FINAL TOTAL after rounding: ${totalQuantity} ${targetUnit}\n`);
      }

      // Capitalize first letter of name for display
      const displayName = normalizedName.charAt(0).toUpperCase() + normalizedName.slice(1);

      consolidated.push({
        itemName: displayName,
        quantity: totalQuantity,
        unit: targetUnit,
        category: category,
      });
    } else if (skippedCount > 0) {
      console.warn(`[GroceryList] Item '${normalizedName}' completely skipped - all entries had incompatible units`);
    }
  });

  // Sort by category order
  const categoryOrder = ['proteins', 'produce', 'dairy-eggs', 'pantry', 'spices', 'frozen', 'bakery', 'other'];
  consolidated.sort((a, b) => {
    const aIndex = categoryOrder.indexOf(a.category);
    const bIndex = categoryOrder.indexOf(b.category);
    return aIndex - bIndex;
  });

  console.log(`[GroceryList] Final consolidated list has ${consolidated.length} items`);

  return consolidated;
}

/**
 * Determine best unit for consolidation based on category
 * Fallback for when item-specific unit preference not found
 * Per Q3.4 spec lines 1121-1140
 */
function determineTargetUnit(category: string, ingredients: any[]): string {
  // Use the most common unit among the ingredients
  const unitCounts = new Map<string, number>();
  ingredients.forEach(ing => {
    unitCounts.set(ing.unit, (unitCounts.get(ing.unit) || 0) + 1);
  });

  // Find the most common unit
  let mostCommonUnit = ingredients[0].unit;
  let maxCount = 0;
  unitCounts.forEach((count, unit) => {
    if (count > maxCount) {
      maxCount = count;
      mostCommonUnit = unit;
    }
  });

  // Category-based preferences as fallback
  if (category === 'proteins') {
    return mostCommonUnit === 'oz' ? 'lb' : mostCommonUnit;
  } else if (category === 'produce') {
    // Produce can be count or weight - use whatever is most common
    return mostCommonUnit;
  } else if (category === 'dairy-eggs') {
    return mostCommonUnit;
  } else if (category === 'spices' || category === 'pantry') {
    const units = ingredients.map(ing => ing.unit);
    if (units.includes('tsp')) return 'tsp';
    if (units.includes('tbsp')) return 'tbsp';
    return 'cup';
  } else {
    return mostCommonUnit;
  }
}

/**
 * Convert quantity from one unit to another
 * Enhanced with US grocery-standard conversions
 * Per Q3.4 spec lines 1142-1166
 * Returns null if conversion is not possible (incompatible units)
 */
function convertToUnit(quantity: number, fromUnit: string, toUnit: string): number | null {
  if (fromUnit === toUnit) return quantity;

  // Normalize unit strings (handle case variations)
  const from = fromUnit.toLowerCase();
  const to = toUnit.toLowerCase();

  // Weight conversions
  if (from === 'oz' && to === 'lb') return quantity / 16;
  if (from === 'lb' && to === 'oz') return quantity * 16;

  // Volume conversions (US standard)
  // Base: 1 gallon = 4 quarts = 8 pints = 16 cups = 256 tbsp = 768 tsp

  // Gallon conversions
  if (from === 'gallon' && to === 'quart') return quantity * 4;
  if (from === 'gallon' && to === 'pint') return quantity * 8;
  if (from === 'gallon' && to === 'cup') return quantity * 16;
  if (from === 'gallon' && to === 'tbsp') return quantity * 256;
  if (from === 'gallon' && to === 'tsp') return quantity * 768;

  // Quart conversions
  if (from === 'quart' && to === 'gallon') return quantity / 4;
  if (from === 'quart' && to === 'pint') return quantity * 2;
  if (from === 'quart' && to === 'cup') return quantity * 4;
  if (from === 'quart' && to === 'tbsp') return quantity * 64;
  if (from === 'quart' && to === 'tsp') return quantity * 192;

  // Pint conversions
  if (from === 'pint' && to === 'gallon') return quantity / 8;
  if (from === 'pint' && to === 'quart') return quantity / 2;
  if (from === 'pint' && to === 'cup') return quantity * 2;
  if (from === 'pint' && to === 'tbsp') return quantity * 32;
  if (from === 'pint' && to === 'tsp') return quantity * 96;

  // Cup conversions
  if (from === 'cup' && to === 'gallon') return quantity / 16;
  if (from === 'cup' && to === 'quart') return quantity / 4;
  if (from === 'cup' && to === 'pint') return quantity / 2;
  if (from === 'cup' && to === 'oz') return quantity * 8; // 1 cup = 8 fl oz
  if (from === 'cup' && to === 'tbsp') return quantity * 16;
  if (from === 'cup' && to === 'tsp') return quantity * 48;

  // Fluid ounce conversions (oz as volume, not weight)
  if (from === 'oz' && to === 'gallon') return quantity / 128;
  if (from === 'oz' && to === 'quart') return quantity / 32;
  if (from === 'oz' && to === 'pint') return quantity / 16;
  if (from === 'oz' && to === 'cup') return quantity / 8;
  if (from === 'oz' && to === 'tbsp') return quantity * 2; // 1 fl oz = 2 tbsp
  if (from === 'oz' && to === 'tsp') return quantity * 6; // 1 fl oz = 6 tsp

  // Tablespoon conversions
  if (from === 'tbsp' && to === 'gallon') return quantity / 256;
  if (from === 'tbsp' && to === 'quart') return quantity / 64;
  if (from === 'tbsp' && to === 'pint') return quantity / 32;
  if (from === 'tbsp' && to === 'cup') return quantity / 16;
  if (from === 'tbsp' && to === 'oz') return quantity / 2; // 2 tbsp = 1 fl oz
  if (from === 'tbsp' && to === 'tsp') return quantity * 3;

  // Teaspoon conversions
  if (from === 'tsp' && to === 'gallon') return quantity / 768;
  if (from === 'tsp' && to === 'quart') return quantity / 192;
  if (from === 'tsp' && to === 'pint') return quantity / 96;
  if (from === 'tsp' && to === 'cup') return quantity / 48;
  if (from === 'tsp' && to === 'oz') return quantity / 6; // 6 tsp = 1 fl oz
  if (from === 'tsp' && to === 'tbsp') return quantity / 3;

  // Count conversions (dozen, cloves)
  if (from === 'count' && to === 'dozen') return quantity / 12;
  if (from === 'dozen' && to === 'count') return quantity * 12;
  if (from === 'count' && to === 'clove') return quantity; // count and clove are the same
  if (from === 'clove' && to === 'count') return quantity;
  if (from === 'clove' && to === 'dozen') return quantity / 12;
  if (from === 'dozen' && to === 'clove') return quantity * 12;

  // If no conversion found, return null (incompatible units)
  console.warn(`[GroceryList] Cannot convert ${fromUnit} to ${toUnit} - incompatible units. Skipping this ingredient entry.`);
  return null;
}

/**
 * Round quantity to reasonable precision for US grocery shopping
 * Per Q3.4 spec lines 1168-1185
 */
function roundQuantity(quantity: number, unit: string): number {
  const unitLower = unit.toLowerCase();

  switch (unitLower) {
    // Weight - 1 decimal place
    case 'lb':
    case 'oz':
      return Math.round(quantity * 10) / 10; // e.g., 1.3 lbs

    // Count - always whole numbers, round up
    case 'count':
    case 'dozen':
    case 'package':
    case 'can':
    case 'jar':
      return Math.ceil(quantity); // e.g., 3 eggs, 2 cans

    // Large volumes - quarter increments
    case 'gallon':
    case 'quart':
      return Math.round(quantity * 4) / 4; // e.g., 0.25 gallons, 1.5 quarts

    // Medium volumes - quarter increments
    case 'pint':
    case 'cup':
      return Math.round(quantity * 4) / 4; // e.g., 1.25 cups, 2.5 pints

    // Small volumes - half increments
    case 'tbsp':
    case 'tsp':
      return Math.round(quantity * 2) / 2; // e.g., 2.5 tsp, 1.5 tbsp

    // Default - 1 decimal place
    default:
      return Math.round(quantity * 10) / 10;
  }
}

export default router;
