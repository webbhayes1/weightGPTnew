/**
 * Nutrition Lookup & Calculation Service
 *
 * Provides nutritional data for common foods.
 * Uses a lookup table first, falls back to AI for unknown foods.
 *
 * Benefits:
 * - Instant lookup for common foods (no AI call)
 * - Consistent values (no AI variability)
 * - Can be extended with real database later
 */

import OpenAI from 'openai';
import { ExtractionResponse, ExtractedItem } from './extraction.service';
import { SAUCE_CALORIES } from './foodCategories';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface NutritionInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  perUnit: string; // "per piece", "per oz", etc.
}

export interface CalculatedItem {
  name: string;
  quantity: number;
  unit: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

// Nutrition data per single unit (piece, item, etc.)
// Values are approximate and based on common sources
const NUTRITION_LOOKUP: Record<string, NutritionInfo> = {
  // Chicken items
  'chicken nugget': { calories: 48, protein: 2.5, carbs: 3, fat: 3, perUnit: 'per piece' },
  'chicken tender': { calories: 90, protein: 8, carbs: 6, fat: 4, perUnit: 'per piece' },
  'chicken wing': { calories: 100, protein: 9, carbs: 0, fat: 7, perUnit: 'per piece' },
  'chicken drumstick': { calories: 180, protein: 20, carbs: 0, fat: 11, perUnit: 'per piece' },
  'chicken thigh': { calories: 210, protein: 26, carbs: 0, fat: 11, perUnit: 'per piece' },
  'chicken breast': { calories: 165, protein: 31, carbs: 0, fat: 4, perUnit: 'per 4oz' },

  // Eggs
  'egg': { calories: 70, protein: 6, carbs: 0, fat: 5, perUnit: 'per egg' },
  'scrambled egg': { calories: 90, protein: 6, carbs: 1, fat: 7, perUnit: 'per egg' },
  'fried egg': { calories: 90, protein: 6, carbs: 0, fat: 7, perUnit: 'per egg' },
  'boiled egg': { calories: 70, protein: 6, carbs: 0, fat: 5, perUnit: 'per egg' },

  // Breakfast items
  'bacon strip': { calories: 45, protein: 3, carbs: 0, fat: 4, perUnit: 'per strip' },
  'sausage link': { calories: 80, protein: 4, carbs: 1, fat: 7, perUnit: 'per link' },
  'pancake': { calories: 90, protein: 2, carbs: 15, fat: 3, perUnit: 'per 4" pancake' },
  'waffle': { calories: 200, protein: 5, carbs: 25, fat: 10, perUnit: 'per waffle' },
  'toast': { calories: 80, protein: 3, carbs: 14, fat: 1, perUnit: 'per slice' },
  'bagel': { calories: 280, protein: 10, carbs: 55, fat: 2, perUnit: 'per bagel' },
  'croissant': { calories: 230, protein: 5, carbs: 26, fat: 12, perUnit: 'per croissant' },

  // Sandwiches & burgers
  'burger': { calories: 350, protein: 20, carbs: 30, fat: 17, perUnit: 'per burger' },
  'hot dog': { calories: 280, protein: 10, carbs: 25, fat: 15, perUnit: 'per hot dog' },
  'sandwich': { calories: 300, protein: 15, carbs: 35, fat: 12, perUnit: 'per sandwich' },

  // Mexican
  'taco': { calories: 180, protein: 8, carbs: 15, fat: 10, perUnit: 'per taco' },
  'burrito': { calories: 450, protein: 20, carbs: 50, fat: 18, perUnit: 'per burrito' },
  'quesadilla': { calories: 350, protein: 15, carbs: 30, fat: 18, perUnit: 'per quesadilla' },

  // Pizza
  'pizza slice': { calories: 280, protein: 12, carbs: 35, fat: 10, perUnit: 'per slice' },

  // Asian
  'dumpling': { calories: 45, protein: 2, carbs: 5, fat: 2, perUnit: 'per piece' },
  'spring roll': { calories: 100, protein: 3, carbs: 12, fat: 5, perUnit: 'per roll' },
  'egg roll': { calories: 150, protein: 5, carbs: 16, fat: 7, perUnit: 'per roll' },

  // Sides
  'french fry': { calories: 10, protein: 0, carbs: 1.5, fat: 0.5, perUnit: 'per fry' },
  'mozzarella stick': { calories: 80, protein: 4, carbs: 6, fat: 5, perUnit: 'per stick' },
  'onion ring': { calories: 75, protein: 1, carbs: 8, fat: 4, perUnit: 'per ring' },

  // Sweets
  'cookie': { calories: 150, protein: 2, carbs: 20, fat: 7, perUnit: 'per cookie' },
  'brownie': { calories: 180, protein: 2, carbs: 25, fat: 9, perUnit: 'per piece' },
  'donut': { calories: 250, protein: 3, carbs: 30, fat: 14, perUnit: 'per donut' },
  'muffin': { calories: 350, protein: 5, carbs: 50, fat: 15, perUnit: 'per muffin' },
  'cupcake': { calories: 280, protein: 3, carbs: 40, fat: 12, perUnit: 'per cupcake' },

  // Proteins
  'shrimp': { calories: 7, protein: 1.5, carbs: 0, fat: 0, perUnit: 'per shrimp' },
  'meatball': { calories: 70, protein: 4, carbs: 3, fat: 5, perUnit: 'per meatball' },
  'rib': { calories: 120, protein: 10, carbs: 0, fat: 9, perUnit: 'per rib' },
};

// Preparation modifiers (multiply base calories)
const PREPARATION_MODIFIERS: Record<string, number> = {
  'fried': 1.3,
  'deep fried': 1.4,
  'pan fried': 1.2,
  'grilled': 1.0,
  'baked': 1.0,
  'steamed': 0.95,
  'boiled': 0.95,
  'raw': 0.9,
  'air fried': 1.05,
};

/**
 * Calculate nutrition for all items in extraction
 */
export async function calculateNutrition(
  extraction: ExtractionResponse
): Promise<CalculatedItem[]> {
  const items: CalculatedItem[] = [];

  for (const item of extraction.items) {
    const calculated = await calculateItemNutrition(item);
    items.push(calculated);
  }

  // Add accompaniments (sauces, etc.)
  for (const accompaniment of extraction.accompaniments) {
    const sauce = findSauce(accompaniment);
    if (sauce) {
      items.push({
        name: accompaniment,
        quantity: 1,
        unit: 'serving',
        ...sauce,
      });
    }
  }

  return items;
}

/**
 * Calculate nutrition for a single item
 */
async function calculateItemNutrition(item: ExtractedItem): Promise<CalculatedItem> {
  // Try to find in lookup table
  const lookup = findInLookup(item.name);

  if (lookup) {
    // Use lookup data and scale by quantity
    const quantity = item.quantity || 1;
    const prepModifier = item.preparation
      ? (PREPARATION_MODIFIERS[item.preparation.toLowerCase()] || 1.0)
      : 1.0;

    return {
      name: item.name,
      quantity,
      unit: item.unit || lookup.perUnit.replace('per ', ''),
      calories: Math.round(lookup.calories * quantity * prepModifier),
      protein: Math.round(lookup.protein * quantity),
      carbs: Math.round(lookup.carbs * quantity),
      fat: Math.round(lookup.fat * quantity * prepModifier),
    };
  }

  // Fallback: use AI for unknown foods (minimal prompt)
  return await estimateWithAI(item);
}

/**
 * Find nutrition info in lookup table
 * Uses fuzzy matching for flexibility
 */
function findInLookup(name: string): NutritionInfo | null {
  const normalized = name.toLowerCase();

  // Direct match
  if (NUTRITION_LOOKUP[normalized]) {
    return NUTRITION_LOOKUP[normalized];
  }

  // Partial match - check if any key is contained in the name
  for (const [key, value] of Object.entries(NUTRITION_LOOKUP)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return value;
    }
  }

  // Singular/plural handling
  const singular = normalized.replace(/s$/, '');
  if (NUTRITION_LOOKUP[singular]) {
    return NUTRITION_LOOKUP[singular];
  }

  return null;
}

/**
 * Find sauce nutrition
 */
function findSauce(name: string): { calories: number; protein: number; carbs: number; fat: number } | null {
  const normalized = name.toLowerCase();

  // Direct match
  if (SAUCE_CALORIES[normalized]) {
    return SAUCE_CALORIES[normalized];
  }

  // Partial match
  for (const [key, value] of Object.entries(SAUCE_CALORIES)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return value;
    }
  }

  return null;
}

/**
 * Fallback: use AI to estimate nutrition for unknown foods
 * Uses minimal prompt for efficiency
 */
async function estimateWithAI(item: ExtractedItem): Promise<CalculatedItem> {
  const quantity = item.quantity || 1;
  const unit = item.unit || 'serving';
  const prep = item.preparation ? `, ${item.preparation}` : '';

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
          content: `${quantity} ${unit} ${item.name}${prep}`,
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
        name: item.name,
        quantity,
        unit,
        calories: parsed.calories || 0,
        protein: parsed.protein || 0,
        carbs: parsed.carbs || 0,
        fat: parsed.fat || 0,
      };
    }
  } catch (error) {
    console.error('[Nutrition] AI estimation failed:', error);
  }

  // Ultimate fallback - rough estimate
  return {
    name: item.name,
    quantity,
    unit,
    calories: 150 * quantity, // Rough average
    protein: 5 * quantity,
    carbs: 15 * quantity,
    fat: 7 * quantity,
  };
}

/**
 * Calculate totals from all items
 */
export function calculateTotals(items: CalculatedItem[]): {
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
