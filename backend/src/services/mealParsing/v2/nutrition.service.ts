/**
 * Nutrition Lookup Service for v2 Meal Parsing
 *
 * Uses structured extraction data to look up nutrition.
 * Lookup first, AI fallback for unknown foods.
 */

import OpenAI from 'openai';
import { UniversalExtraction, MealArchetype } from './archetypes';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ============================================================================
// TYPES
// ============================================================================

export interface NutritionResult {
  name: string;
  quantity: number;
  unit: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface BaseNutrition {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  perUnit: string;
}

// ============================================================================
// NUTRITION LOOKUP TABLES
// ============================================================================

// Base foods - per typical serving
const BASE_FOOD_NUTRITION: Record<string, BaseNutrition> = {
  // Pasta & Grains
  'spaghetti': { calories: 220, protein: 8, carbs: 43, fat: 1, perUnit: 'per cup cooked' },
  'pasta': { calories: 220, protein: 8, carbs: 43, fat: 1, perUnit: 'per cup cooked' },
  'penne': { calories: 220, protein: 8, carbs: 43, fat: 1, perUnit: 'per cup cooked' },
  'fettuccine': { calories: 220, protein: 8, carbs: 43, fat: 1, perUnit: 'per cup cooked' },
  'rice': { calories: 205, protein: 4, carbs: 45, fat: 0, perUnit: 'per cup cooked' },
  'brown rice': { calories: 215, protein: 5, carbs: 45, fat: 2, perUnit: 'per cup cooked' },
  'quinoa': { calories: 220, protein: 8, carbs: 39, fat: 4, perUnit: 'per cup cooked' },
  'couscous': { calories: 175, protein: 6, carbs: 36, fat: 0, perUnit: 'per cup cooked' },

  // Salad bases
  'mixed greens': { calories: 10, protein: 1, carbs: 2, fat: 0, perUnit: 'per 2 cups' },
  'romaine': { calories: 8, protein: 1, carbs: 2, fat: 0, perUnit: 'per 2 cups' },
  'spinach': { calories: 7, protein: 1, carbs: 1, fat: 0, perUnit: 'per 2 cups' },
  'kale': { calories: 15, protein: 1, carbs: 3, fat: 0, perUnit: 'per 2 cups' },

  // Bread & wraps
  'white bread': { calories: 80, protein: 3, carbs: 15, fat: 1, perUnit: 'per slice' },
  'wheat bread': { calories: 80, protein: 4, carbs: 14, fat: 1, perUnit: 'per slice' },
  'tortilla': { calories: 140, protein: 4, carbs: 24, fat: 4, perUnit: 'per tortilla' },
  'wrap': { calories: 140, protein: 4, carbs: 24, fat: 4, perUnit: 'per wrap' },
  'bun': { calories: 120, protein: 4, carbs: 22, fat: 2, perUnit: 'per bun' },

  // Soups
  'chicken soup': { calories: 75, protein: 6, carbs: 8, fat: 2, perUnit: 'per cup' },
  'tomato soup': { calories: 90, protein: 2, carbs: 18, fat: 1, perUnit: 'per cup' },
  'vegetable soup': { calories: 70, protein: 3, carbs: 12, fat: 1, perUnit: 'per cup' },

  // Drinks
  'coffee': { calories: 5, protein: 0, carbs: 0, fat: 0, perUnit: 'per 8oz' },
  'latte': { calories: 150, protein: 8, carbs: 12, fat: 8, perUnit: 'per 12oz' },
  'cappuccino': { calories: 80, protein: 4, carbs: 6, fat: 4, perUnit: 'per 8oz' },
  'smoothie': { calories: 200, protein: 5, carbs: 40, fat: 3, perUnit: 'per 16oz' },
  'protein shake': { calories: 200, protein: 25, carbs: 10, fat: 5, perUnit: 'per shake' },

  // Snacks
  'chips': { calories: 150, protein: 2, carbs: 15, fat: 10, perUnit: 'per 1oz' },
  'cookies': { calories: 150, protein: 2, carbs: 20, fat: 7, perUnit: 'per cookie' },
  'ice cream': { calories: 200, protein: 3, carbs: 25, fat: 10, perUnit: 'per 1/2 cup' },
};

// Protein additions - per typical serving (4oz / 1 piece)
const PROTEIN_NUTRITION: Record<string, BaseNutrition> = {
  // Chicken
  'chicken': { calories: 165, protein: 31, carbs: 0, fat: 4, perUnit: 'per 4oz' },
  'grilled chicken': { calories: 165, protein: 31, carbs: 0, fat: 4, perUnit: 'per 4oz' },
  'chicken breast': { calories: 165, protein: 31, carbs: 0, fat: 4, perUnit: 'per 4oz' },
  'chicken cutlet': { calories: 180, protein: 28, carbs: 5, fat: 6, perUnit: 'per cutlet' },
  'chicken cutlets': { calories: 180, protein: 28, carbs: 5, fat: 6, perUnit: 'per cutlet' },
  'chicken thigh': { calories: 200, protein: 26, carbs: 0, fat: 11, perUnit: 'per thigh' },
  'chicken thighs': { calories: 200, protein: 26, carbs: 0, fat: 11, perUnit: 'per thigh' },
  'chicken wing': { calories: 80, protein: 8, carbs: 0, fat: 5, perUnit: 'per wing' },
  'chicken wings': { calories: 80, protein: 8, carbs: 0, fat: 5, perUnit: 'per wing' },
  'chicken drumstick': { calories: 110, protein: 14, carbs: 0, fat: 6, perUnit: 'per drumstick' },
  'chicken tender': { calories: 90, protein: 14, carbs: 3, fat: 3, perUnit: 'per tender' },
  'chicken tenders': { calories: 90, protein: 14, carbs: 3, fat: 3, perUnit: 'per tender' },
  'chicken strips': { calories: 90, protein: 14, carbs: 3, fat: 3, perUnit: 'per strip' },
  'fried chicken': { calories: 250, protein: 24, carbs: 10, fat: 14, perUnit: 'per piece' },

  // Beef
  'beef': { calories: 250, protein: 26, carbs: 0, fat: 15, perUnit: 'per 4oz' },
  'steak': { calories: 270, protein: 26, carbs: 0, fat: 18, perUnit: 'per 4oz' },
  'ground beef': { calories: 280, protein: 20, carbs: 0, fat: 22, perUnit: 'per 4oz' },
  'beef patty': { calories: 280, protein: 20, carbs: 0, fat: 22, perUnit: 'per patty' },
  'hamburger patty': { calories: 280, protein: 20, carbs: 0, fat: 22, perUnit: 'per patty' },
  'ribeye': { calories: 290, protein: 24, carbs: 0, fat: 22, perUnit: 'per 4oz' },
  'sirloin': { calories: 200, protein: 26, carbs: 0, fat: 10, perUnit: 'per 4oz' },
  'filet': { calories: 200, protein: 26, carbs: 0, fat: 10, perUnit: 'per 4oz' },
  'brisket': { calories: 300, protein: 24, carbs: 0, fat: 23, perUnit: 'per 4oz' },

  // Pork
  'pork': { calories: 200, protein: 26, carbs: 0, fat: 10, perUnit: 'per 4oz' },
  'pork chop': { calories: 200, protein: 26, carbs: 0, fat: 10, perUnit: 'per chop' },
  'pork loin': { calories: 180, protein: 28, carbs: 0, fat: 7, perUnit: 'per 4oz' },
  'pulled pork': { calories: 240, protein: 24, carbs: 4, fat: 14, perUnit: 'per 4oz' },
  'carnitas': { calories: 240, protein: 24, carbs: 2, fat: 14, perUnit: 'per 4oz' },
  'bacon': { calories: 180, protein: 12, carbs: 0, fat: 14, perUnit: 'per 3 strips' },
  'sausage': { calories: 200, protein: 10, carbs: 2, fat: 17, perUnit: 'per link' },
  'ham': { calories: 145, protein: 21, carbs: 2, fat: 6, perUnit: 'per 4oz' },

  // Seafood
  'shrimp': { calories: 100, protein: 24, carbs: 0, fat: 1, perUnit: 'per 4oz' },
  'salmon': { calories: 230, protein: 25, carbs: 0, fat: 14, perUnit: 'per 4oz' },
  'fish': { calories: 150, protein: 26, carbs: 0, fat: 5, perUnit: 'per 4oz' },
  'tuna': { calories: 130, protein: 29, carbs: 0, fat: 1, perUnit: 'per 4oz' },
  'cod': { calories: 90, protein: 20, carbs: 0, fat: 1, perUnit: 'per 4oz' },
  'tilapia': { calories: 110, protein: 23, carbs: 0, fat: 2, perUnit: 'per 4oz' },
  'crab': { calories: 100, protein: 20, carbs: 0, fat: 2, perUnit: 'per 4oz' },
  'lobster': { calories: 120, protein: 25, carbs: 0, fat: 1, perUnit: 'per 4oz' },
  'scallops': { calories: 100, protein: 20, carbs: 3, fat: 1, perUnit: 'per 4oz' },

  // Poultry
  'turkey': { calories: 150, protein: 30, carbs: 0, fat: 3, perUnit: 'per 4oz' },
  'turkey breast': { calories: 120, protein: 26, carbs: 0, fat: 1, perUnit: 'per 4oz' },
  'duck': { calories: 200, protein: 24, carbs: 0, fat: 11, perUnit: 'per 4oz' },

  // Other proteins
  'lamb': { calories: 250, protein: 25, carbs: 0, fat: 17, perUnit: 'per 4oz' },
  'lamb chop': { calories: 250, protein: 25, carbs: 0, fat: 17, perUnit: 'per chop' },
  'tofu': { calories: 90, protein: 10, carbs: 2, fat: 5, perUnit: 'per 4oz' },
  'tempeh': { calories: 160, protein: 15, carbs: 9, fat: 9, perUnit: 'per 4oz' },

  // Eggs & prepared meats
  'egg': { calories: 70, protein: 6, carbs: 0, fat: 5, perUnit: 'per egg' },
  'eggs': { calories: 140, protein: 12, carbs: 0, fat: 10, perUnit: 'per 2 eggs' },
  'meatballs': { calories: 210, protein: 12, carbs: 6, fat: 15, perUnit: 'per 3 meatballs' },
  'meatball': { calories: 70, protein: 4, carbs: 2, fat: 5, perUnit: 'per meatball' },
};

// Sauces & dressings - per serving
const SAUCE_NUTRITION: Record<string, BaseNutrition> = {
  'marinara': { calories: 70, protein: 1, carbs: 10, fat: 3, perUnit: 'per 1/2 cup' },
  'tomato sauce': { calories: 70, protein: 1, carbs: 10, fat: 3, perUnit: 'per 1/2 cup' },
  'alfredo': { calories: 200, protein: 4, carbs: 6, fat: 18, perUnit: 'per 1/4 cup' },
  'pesto': { calories: 180, protein: 3, carbs: 2, fat: 18, perUnit: 'per 2 tbsp' },
  'butter': { calories: 100, protein: 0, carbs: 0, fat: 12, perUnit: 'per tbsp' },
  'olive oil': { calories: 120, protein: 0, carbs: 0, fat: 14, perUnit: 'per tbsp' },
  'ranch': { calories: 130, protein: 0, carbs: 2, fat: 14, perUnit: 'per 2 tbsp' },
  'caesar': { calories: 150, protein: 1, carbs: 1, fat: 16, perUnit: 'per 2 tbsp' },
  'vinaigrette': { calories: 90, protein: 0, carbs: 2, fat: 9, perUnit: 'per 2 tbsp' },
  'italian': { calories: 80, protein: 0, carbs: 2, fat: 8, perUnit: 'per 2 tbsp' },
  'blue cheese': { calories: 160, protein: 1, carbs: 1, fat: 17, perUnit: 'per 2 tbsp' },
  'honey mustard': { calories: 110, protein: 0, carbs: 10, fat: 8, perUnit: 'per 2 tbsp' },
  'bbq sauce': { calories: 70, protein: 0, carbs: 16, fat: 0, perUnit: 'per 2 tbsp' },
  'sriracha': { calories: 15, protein: 0, carbs: 3, fat: 0, perUnit: 'per tbsp' },
  'none': { calories: 0, protein: 0, carbs: 0, fat: 0, perUnit: 'per serving' },
};

// Cooking method modifiers
const COOKING_MODIFIERS: Record<string, number> = {
  'grilled': 1.0,
  'baked': 1.0,
  'steamed': 0.95,
  'boiled': 0.95,
  'raw': 0.9,
  'fried': 1.3,
  'deep fried': 1.4,
  'pan fried': 1.2,
  'sauteed': 1.15,
  'sautéed': 1.15,
  'air fried': 1.05,
  'roasted': 1.05,
  'smoked': 1.0,
};

// Portion size multipliers
const PORTION_MULTIPLIERS: Record<string, number> = {
  // Generic sizes
  'small': 0.7,
  'medium': 1.0,
  'large': 1.5,
  'extra large': 2.0,

  // Specific portions
  '1 cup': 1.0,
  '1.5 cups': 1.5,
  '2 cups': 2.0,
  'half cup': 0.5,
  '1/2 cup': 0.5,

  // Bowl sizes
  'side': 0.5,
  'side salad': 0.5,
  'entree': 1.5,
  'entree salad': 1.5,
  'bowl': 1.5,
  'large bowl': 2.0,

  // Sandwich sizes
  'half': 0.5,
  'whole': 1.0,
  '6 inch': 0.75,
  'footlong': 1.5,

  // Drink sizes
  '8oz': 1.0,
  '12oz': 1.5,
  '16oz': 2.0,
  '20oz': 2.5,

  // Piece-based portions (protein items)
  '1 piece': 1.0,
  '2 pieces': 2.0,
  '3 pieces': 3.0,
  '4 pieces': 4.0,
  '1 cutlet': 1.0,
  '2 cutlets': 2.0,
  '3 cutlets': 3.0,
  '1 piece/cutlet': 1.0,
  '2 pieces/cutlets': 2.0,
  '1 strip': 0.5,
  '2 strips': 1.0,
  '3 strips': 1.5,
  '4 strips': 2.0,
  '1 patty': 1.0,
  '2 patties': 2.0,
  '1 fillet': 1.0,
  '2 fillets': 2.0,
  '1 breast': 1.5,
  '2 breasts': 3.0,
  '1 thigh': 1.0,
  '2 thighs': 2.0,
  '1 drumstick': 0.75,
  '2 drumsticks': 1.5,
  '1 wing': 0.5,
  '4 wings': 2.0,
  '6 wings': 3.0,
  '8 wings': 4.0,
  '10 wings': 5.0,

  // Weight-based (for protein portions, base is 4oz)
  '4 oz': 1.0,
  '4oz': 1.0,
  '4-6 oz': 1.25,
  '6 oz': 1.5,
  '6oz': 1.5,
  '6-8 oz': 1.75,
  '8 oz': 2.0,
  '8+ oz': 2.5,
  '12 oz': 3.0,
  '16 oz protein': 4.0,

  // Default
  '1 serving': 1.0,
};

// ============================================================================
// LOOKUP FUNCTIONS
// ============================================================================

/**
 * Look up nutrition for a food item
 */
function lookupNutrition(name: string, table: Record<string, BaseNutrition>): BaseNutrition | null {
  const normalized = name.toLowerCase().trim();

  // Direct match
  if (table[normalized]) {
    return table[normalized];
  }

  // Partial match - check if key is in name or name is in key
  for (const [key, value] of Object.entries(table)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return value;
    }
  }

  // Remove 's' for plural
  const singular = normalized.replace(/s$/, '');
  if (table[singular]) {
    return table[singular];
  }

  return null;
}

/**
 * Parse portion info including quantity and multiplier
 */
interface PortionInfo {
  multiplier: number;
  quantity: number;
  unit: string;
}

/**
 * Parse portion string to extract quantity and multiplier
 * Handles: "2 cutlets", "2 pieces", "large", "6 oz", etc.
 */
function parsePortionInfo(portion: string | null): PortionInfo {
  if (!portion) {
    return { multiplier: 1.0, quantity: 1, unit: 'serving' };
  }

  const normalized = portion.toLowerCase().trim();

  // Direct match in PORTION_MULTIPLIERS
  if (PORTION_MULTIPLIERS[normalized]) {
    // Extract number from string if present (e.g., "2 cutlets" -> quantity 2)
    const numMatch = normalized.match(/^(\d+)/);
    const quantity = numMatch ? parseInt(numMatch[1]) : 1;
    return {
      multiplier: PORTION_MULTIPLIERS[normalized],
      quantity,
      unit: normalized.replace(/^\d+\s*/, '').trim() || 'serving',
    };
  }

  // Check for partial matches in PORTION_MULTIPLIERS
  for (const [key, value] of Object.entries(PORTION_MULTIPLIERS)) {
    if (normalized.includes(key)) {
      const numMatch = normalized.match(/^(\d+)/);
      const quantity = numMatch ? parseInt(numMatch[1]) : 1;
      return {
        multiplier: value,
        quantity,
        unit: key,
      };
    }
  }

  // Extract number + unit pattern (e.g., "2 cutlets", "3 pieces", "6oz")
  const pieceMatch = normalized.match(/^(\d+(?:\.\d+)?)\s*(cutlet|piece|strip|fillet|patty|breast|thigh|drumstick|wing|slice|serving|oz|ounce)s?/i);
  if (pieceMatch) {
    const count = parseFloat(pieceMatch[1]);
    const unit = pieceMatch[2].toLowerCase();

    // Calculate multiplier based on unit type
    let baseMultiplier = 1.0;
    if (unit === 'cutlet' || unit === 'piece' || unit === 'patty' || unit === 'fillet') {
      baseMultiplier = 1.0; // Each piece is ~4oz
    } else if (unit === 'strip' || unit === 'slice') {
      baseMultiplier = 0.5; // Strips/slices are smaller
    } else if (unit === 'breast') {
      baseMultiplier = 1.5; // Breasts are larger
    } else if (unit === 'thigh') {
      baseMultiplier = 1.0;
    } else if (unit === 'drumstick') {
      baseMultiplier = 0.75;
    } else if (unit === 'wing') {
      baseMultiplier = 0.5;
    } else if (unit === 'oz' || unit === 'ounce') {
      baseMultiplier = count / 4; // Base is 4oz
      return { multiplier: baseMultiplier, quantity: count, unit: 'oz' };
    }

    return {
      multiplier: count * baseMultiplier,
      quantity: count,
      unit: unit + 's',
    };
  }

  // Try to extract any leading number (e.g., "2 servings" -> 2)
  const numberMatch = normalized.match(/^(\d+(?:\.\d+)?)/);
  if (numberMatch) {
    const count = parseFloat(numberMatch[1]);
    return {
      multiplier: count,
      quantity: count,
      unit: normalized.replace(/^\d+(?:\.\d+)?\s*/, '').trim() || 'serving',
    };
  }

  return { multiplier: 1.0, quantity: 1, unit: 'serving' };
}

/**
 * Get cooking modifier
 */
function getCookingModifier(method: string | null): number {
  if (!method) return 1.0;

  const normalized = method.toLowerCase().trim();
  return COOKING_MODIFIERS[normalized] || 1.0;
}

// ============================================================================
// MAIN CALCULATION
// ============================================================================

/**
 * Calculate nutrition for a universal extraction
 */
export async function calculateNutritionFromExtraction(
  extraction: UniversalExtraction
): Promise<NutritionResult[]> {
  const results: NutritionResult[] = [];
  const portionInfo = parsePortionInfo(extraction.portion);
  const cookingModifier = getCookingModifier(extraction.cooking_method);

  console.log('[v2 Nutrition] Portion info:', portionInfo);
  console.log('[v2 Nutrition] Archetype:', extraction.archetype);

  // For PLATED_MEAL where protein IS the main item (like "chicken cutlets"),
  // treat protein as the primary entry
  const isProteinMainItem = extraction.archetype === 'PLATED_MEAL' &&
    extraction.protein &&
    (!extraction.base_food || isProteinBasedBaseFood(extraction.base_food, extraction.protein));

  if (isProteinMainItem) {
    // Protein is the main dish - calculate it as the primary item
    const proteinResult = await calculateProteinNutrition(
      extraction.protein!,
      portionInfo,
      cookingModifier
    );
    if (proteinResult) {
      results.push(proteinResult);
    }

    // Add carb component separately if present (rice, pasta, etc.)
    if (extraction.carb_component) {
      const carbResult = await calculateCarbComponent(extraction.carb_component);
      if (carbResult) {
        results.push(carbResult);
      }
    }
  } else {
    // Standard flow: base food + separate protein

    // 1. Calculate base food nutrition
    const baseFoodResult = await calculateBaseFoodNutrition(extraction, portionInfo.multiplier, cookingModifier);
    if (baseFoodResult) {
      results.push(baseFoodResult);
    }

    // 2. Add protein if separate from base
    if (extraction.protein && !isProteinIncludedInBase(extraction)) {
      const proteinResult = await calculateProteinNutrition(
        extraction.protein,
        portionInfo,
        cookingModifier
      );
      if (proteinResult) {
        results.push(proteinResult);
      }
    }
  }

  // 3. Add sauce/dressing
  if (extraction.sauce_or_dressing) {
    const sauceResult = calculateSauceNutrition(extraction.sauce_or_dressing);
    if (sauceResult) {
      results.push(sauceResult);
    }
  }

  // 4. Add extras
  for (const extra of extraction.extras || []) {
    const extraResult = await calculateExtraNutrition(extra);
    if (extraResult) {
      results.push(extraResult);
    }
  }

  // If no results from lookup, use AI fallback
  if (results.length === 0) {
    const fallbackResult = await estimateWithAI(extraction);
    results.push(fallbackResult);
  }

  return results;
}

/**
 * Check if base_food is actually describing the protein
 * e.g., base_food: "chicken cutlets" when protein is also "chicken"
 */
function isProteinBasedBaseFood(baseFood: string, protein: string): boolean {
  const baseLower = baseFood.toLowerCase();
  const proteinLower = protein.toLowerCase();

  // Check if base food contains protein name
  if (baseLower.includes(proteinLower) || proteinLower.includes(baseLower)) {
    return true;
  }

  // Check for common protein keywords in base food
  const proteinKeywords = ['chicken', 'beef', 'steak', 'fish', 'salmon', 'shrimp', 'pork', 'lamb', 'turkey', 'tofu'];
  for (const keyword of proteinKeywords) {
    if (baseLower.includes(keyword)) {
      return true;
    }
  }

  return false;
}

/**
 * Calculate nutrition for carb component (rice, pasta, etc.)
 */
async function calculateCarbComponent(carb: string): Promise<NutritionResult | null> {
  const carbNutrition = lookupNutrition(carb, BASE_FOOD_NUTRITION);

  if (carbNutrition) {
    return {
      name: carb,
      quantity: 1,
      unit: 'serving',
      calories: carbNutrition.calories,
      protein: carbNutrition.protein,
      carbs: carbNutrition.carbs,
      fat: carbNutrition.fat,
    };
  }

  // AI fallback for unknown carbs
  return await estimateItemWithAI(carb, '1 serving', 1);
}

/**
 * Calculate base food nutrition
 */
async function calculateBaseFoodNutrition(
  extraction: UniversalExtraction,
  portionMultiplier: number,
  cookingModifier: number
): Promise<NutritionResult | null> {
  if (!extraction.base_food) return null;

  const baseNutrition = lookupNutrition(extraction.base_food, BASE_FOOD_NUTRITION);

  if (baseNutrition) {
    return {
      name: extraction.base_food,
      quantity: portionMultiplier,
      unit: extraction.portion || 'serving',
      calories: Math.round(baseNutrition.calories * portionMultiplier * cookingModifier),
      protein: Math.round(baseNutrition.protein * portionMultiplier),
      carbs: Math.round(baseNutrition.carbs * portionMultiplier),
      fat: Math.round(baseNutrition.fat * portionMultiplier * cookingModifier),
    };
  }

  // Fallback to AI for unknown base foods
  return await estimateItemWithAI(
    extraction.base_food,
    extraction.portion || '1 serving',
    portionMultiplier
  );
}

/**
 * Check if protein is included in the base food archetype
 */
function isProteinIncludedInBase(extraction: UniversalExtraction): boolean {
  // Some archetypes include protein in the base
  const proteinIncludedArchetypes: MealArchetype[] = ['SOUP_STEW', 'PACKAGED_FOOD'];
  return proteinIncludedArchetypes.includes(extraction.archetype);
}

/**
 * Calculate protein nutrition
 */
async function calculateProteinNutrition(
  protein: string,
  portionInfo: PortionInfo,
  cookingModifier: number
): Promise<NutritionResult | null> {
  const proteinNutrition = lookupNutrition(protein, PROTEIN_NUTRITION);

  // Build a descriptive name that includes quantity
  const displayName = portionInfo.quantity > 1
    ? `${protein} (${portionInfo.quantity} ${portionInfo.unit})`
    : protein;

  if (proteinNutrition) {
    return {
      name: displayName,
      quantity: portionInfo.quantity,
      unit: portionInfo.unit,
      calories: Math.round(proteinNutrition.calories * portionInfo.multiplier * cookingModifier),
      protein: Math.round(proteinNutrition.protein * portionInfo.multiplier),
      carbs: Math.round(proteinNutrition.carbs * portionInfo.multiplier),
      fat: Math.round(proteinNutrition.fat * portionInfo.multiplier * cookingModifier),
    };
  }

  // AI fallback - include quantity in request
  const unitStr = portionInfo.quantity > 1 ? portionInfo.unit : '4oz';
  return await estimateItemWithAI(
    displayName,
    unitStr,
    portionInfo.multiplier
  );
}

/**
 * Calculate sauce nutrition
 */
function calculateSauceNutrition(sauce: string): NutritionResult | null {
  const sauceNutrition = lookupNutrition(sauce, SAUCE_NUTRITION);

  if (sauceNutrition) {
    return {
      name: sauce,
      quantity: 1,
      unit: 'serving',
      calories: sauceNutrition.calories,
      protein: sauceNutrition.protein,
      carbs: sauceNutrition.carbs,
      fat: sauceNutrition.fat,
    };
  }

  // For unknown sauces, estimate small amount
  return {
    name: sauce,
    quantity: 1,
    unit: 'serving',
    calories: 50,
    protein: 0,
    carbs: 5,
    fat: 3,
  };
}

/**
 * Calculate extra/topping nutrition
 */
async function calculateExtraNutrition(extra: string): Promise<NutritionResult | null> {
  // Common extras lookup
  const EXTRAS_NUTRITION: Record<string, BaseNutrition> = {
    'cheese': { calories: 110, protein: 7, carbs: 0, fat: 9, perUnit: 'per oz' },
    'parmesan': { calories: 40, protein: 4, carbs: 0, fat: 3, perUnit: 'per tbsp' },
    'croutons': { calories: 60, protein: 1, carbs: 10, fat: 2, perUnit: 'per 1/4 cup' },
    'avocado': { calories: 120, protein: 1, carbs: 6, fat: 11, perUnit: 'per 1/2 avocado' },
    'bacon bits': { calories: 50, protein: 3, carbs: 0, fat: 4, perUnit: 'per tbsp' },
    'nuts': { calories: 100, protein: 3, carbs: 4, fat: 9, perUnit: 'per oz' },
    'olives': { calories: 25, protein: 0, carbs: 1, fat: 2, perUnit: 'per 5 olives' },
    'tomatoes': { calories: 10, protein: 0, carbs: 2, fat: 0, perUnit: 'per 2 slices' },
    'onions': { calories: 10, protein: 0, carbs: 2, fat: 0, perUnit: 'per 2 tbsp' },
    'mushrooms': { calories: 15, protein: 1, carbs: 2, fat: 0, perUnit: 'per 1/4 cup' },
    'peppers': { calories: 10, protein: 0, carbs: 2, fat: 0, perUnit: 'per 1/4 cup' },
  };

  const extraNutrition = lookupNutrition(extra, EXTRAS_NUTRITION);

  if (extraNutrition) {
    return {
      name: extra,
      quantity: 1,
      unit: 'serving',
      calories: extraNutrition.calories,
      protein: extraNutrition.protein,
      carbs: extraNutrition.carbs,
      fat: extraNutrition.fat,
    };
  }

  // For unknown extras, estimate small amount
  return {
    name: extra,
    quantity: 1,
    unit: 'serving',
    calories: 30,
    protein: 1,
    carbs: 3,
    fat: 1,
  };
}

// ============================================================================
// AI FALLBACK
// ============================================================================

/**
 * Estimate nutrition using AI when lookup fails
 */
async function estimateWithAI(extraction: UniversalExtraction): Promise<NutritionResult> {
  const description = buildMealDescription(extraction);

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'Estimate calories and macros. Return JSON: {"calories":N,"protein":N,"carbs":N,"fat":N}',
        },
        {
          role: 'user',
          content: description,
        },
      ],
      temperature: 0.1,
      max_tokens: 50,
      response_format: { type: 'json_object' },
    });

    const content = response.choices[0]?.message?.content;
    if (content) {
      const parsed = JSON.parse(content);
      return {
        name: extraction.base_food || 'Meal',
        quantity: 1,
        unit: extraction.portion || 'serving',
        calories: parsed.calories || 0,
        protein: parsed.protein || 0,
        carbs: parsed.carbs || 0,
        fat: parsed.fat || 0,
      };
    }
  } catch (error) {
    console.error('[v2 Nutrition] AI estimation failed:', error);
  }

  // Ultimate fallback
  return {
    name: extraction.base_food || 'Meal',
    quantity: 1,
    unit: extraction.portion || 'serving',
    calories: 300,
    protein: 15,
    carbs: 30,
    fat: 12,
  };
}

/**
 * Estimate single item with AI
 */
async function estimateItemWithAI(
  name: string,
  unit: string,
  multiplier: number
): Promise<NutritionResult> {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'Estimate calories and macros. Return JSON: {"calories":N,"protein":N,"carbs":N,"fat":N}',
        },
        {
          role: 'user',
          content: `${multiplier} ${unit} ${name}`,
        },
      ],
      temperature: 0.1,
      max_tokens: 50,
      response_format: { type: 'json_object' },
    });

    const content = response.choices[0]?.message?.content;
    if (content) {
      const parsed = JSON.parse(content);
      return {
        name,
        quantity: multiplier,
        unit,
        calories: parsed.calories || 0,
        protein: parsed.protein || 0,
        carbs: parsed.carbs || 0,
        fat: parsed.fat || 0,
      };
    }
  } catch (error) {
    console.error('[v2 Nutrition] AI item estimation failed:', error);
  }

  return {
    name,
    quantity: multiplier,
    unit,
    calories: 150 * multiplier,
    protein: 5 * multiplier,
    carbs: 15 * multiplier,
    fat: 7 * multiplier,
  };
}

/**
 * Build description for AI estimation
 */
function buildMealDescription(extraction: UniversalExtraction): string {
  const parts: string[] = [];

  if (extraction.portion) parts.push(extraction.portion);
  if (extraction.base_food) parts.push(extraction.base_food);
  if (extraction.protein) parts.push(`with ${extraction.protein}`);
  if (extraction.sauce_or_dressing) parts.push(`and ${extraction.sauce_or_dressing}`);
  if (extraction.cooking_method) parts.push(`(${extraction.cooking_method})`);

  return parts.join(' ') || 'meal';
}

/**
 * Calculate totals from nutrition results
 */
export function calculateTotals(items: NutritionResult[]): {
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
} {
  return items.reduce(
    (acc, item) => ({
      totalCalories: acc.totalCalories + item.calories,
      totalProtein: acc.totalProtein + item.protein,
      totalCarbs: acc.totalCarbs + item.carbs,
      totalFat: acc.totalFat + item.fat,
    }),
    { totalCalories: 0, totalProtein: 0, totalCarbs: 0, totalFat: 0 }
  );
}
