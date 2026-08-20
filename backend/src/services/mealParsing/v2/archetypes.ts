/**
 * Universal Meal Archetypes & Schema
 * v2 Meal Parsing System
 *
 * Every meal maps to one of 10 universal archetypes.
 * Same extraction schema works for ALL foods.
 */

// ============================================================================
// ARCHETYPES
// ============================================================================

export type MealArchetype =
  | 'SINGLE_ITEM'           // Apple, banana, protein bar
  | 'PASTA_GRAIN_BOWL'      // Pasta, rice bowl, quinoa bowl
  | 'SALAD'                 // Caesar salad, garden salad
  | 'SANDWICH_WRAP'         // Sandwich, wrap, burger, taco
  | 'SOUP_STEW'             // Soup, stew, curry, chili
  | 'PLATED_MEAL'           // Chicken with rice and broccoli
  | 'SNACK_DESSERT'         // Cookies, ice cream, chips
  | 'DRINK'                 // Coffee, smoothie, protein shake
  | 'PACKAGED_FOOD'         // Quest bar, Lean Cuisine, etc.
  | 'MULTI_ITEM';           // Multiple distinct items

// ============================================================================
// UNIVERSAL EXTRACTION SCHEMA
// ============================================================================

export interface ConfidenceScores {
  base_food: number;        // 0-1 confidence
  portion: number;
  protein: number;
  sauce_or_dressing: number;
  cooking_method: number;
  extras: number;
}

export interface UniversalExtraction {
  archetype: MealArchetype;
  base_food: string | null;           // Main food item (pasta, salad greens, bread)
  portion: string | null;             // "1 cup", "large", "6 oz"
  protein: string | null;             // Chicken, beef, tofu, none
  cooking_method: string | null;      // Grilled, fried, baked, raw
  carb_component: string | null;      // Rice, bread, pasta (if separate from base)
  fat_component: string | null;       // Butter, oil, cheese, avocado
  sauce_or_dressing: string | null;   // Marinara, ranch, alfredo
  extras: string[];                   // Toppings, add-ons, sides
  brand_or_name: string | null;       // Restaurant name or brand
  packaged_flag: boolean;             // Is it a packaged/branded item?
  confidence: ConfidenceScores;
}

// For MULTI_ITEM archetype, we extract multiple items
export interface MultiItemExtraction {
  archetype: 'MULTI_ITEM';
  items: UniversalExtraction[];
  overall_confidence: number;
}

export type ExtractionResult = UniversalExtraction | MultiItemExtraction;

// ============================================================================
// REQUIRED FIELDS PER ARCHETYPE
// ============================================================================

// Only these fields trigger follow-ups when missing/low-confidence
// Priority order: portion > cooking_method > sauce > protein > extras
export const REQUIRED_FIELDS: Record<MealArchetype, (keyof ConfidenceScores)[]> = {
  SINGLE_ITEM: ['base_food', 'portion'],
  PASTA_GRAIN_BOWL: ['portion', 'sauce_or_dressing', 'protein', 'cooking_method'],
  SALAD: ['portion', 'protein', 'sauce_or_dressing', 'cooking_method'],
  SANDWICH_WRAP: ['base_food', 'protein', 'portion', 'sauce_or_dressing'],
  SOUP_STEW: ['base_food', 'portion', 'protein'],
  PLATED_MEAL: ['portion', 'cooking_method', 'sauce_or_dressing'],  // protein usually mentioned
  SNACK_DESSERT: ['base_food', 'portion'],
  DRINK: ['base_food', 'portion', 'extras'],
  PACKAGED_FOOD: ['base_food', 'portion'],
  MULTI_ITEM: ['base_food', 'portion'], // Applied to main item only
};

// ============================================================================
// QUICK OPTIONS PER ARCHETYPE + FIELD
// ============================================================================

type QuickOptionsMap = Record<MealArchetype, Partial<Record<keyof ConfidenceScores | 'portion_size', string[]>>>;

export const QUICK_OPTIONS: QuickOptionsMap = {
  SINGLE_ITEM: {
    portion: ['Small', 'Medium', 'Large', '1 serving'],
  },

  PASTA_GRAIN_BOWL: {
    portion: ['Small (1 cup)', 'Medium (1.5 cups)', 'Large (2+ cups)', 'Bowl'],
    sauce_or_dressing: ['Marinara', 'Alfredo', 'Pesto', 'Butter/Oil', 'Tomato cream', 'Curry', 'Soy sauce', 'Teriyaki', 'None'],
    protein: ['Chicken', 'Beef', 'Shrimp', 'Meatballs', 'Sausage', 'Fish', 'Tofu', 'Eggs', 'None'],
    cooking_method: ['Grilled', 'Sautéed', 'Fried', 'Stir-fried', 'Baked', 'Raw'],
  },

  SALAD: {
    portion: ['Side salad', 'Entree salad', 'Large bowl'],
    sauce_or_dressing: ['Ranch', 'Caesar', 'Vinaigrette', 'Italian', 'Blue cheese', 'None'],
    protein: ['Grilled chicken', 'Steak', 'Shrimp', 'Salmon', 'Tofu', 'None'],
  },

  SANDWICH_WRAP: {
    portion: ['Half', 'Whole', '6 inch', 'Footlong', '1 taco', '2-3 tacos', 'Regular burrito', 'Bowl size'],
    protein: ['Turkey', 'Ham', 'Chicken', 'Roast beef', 'Tuna', 'Steak', 'Carnitas', 'Ground beef', 'Fish', 'Veggie'],
    base_food: ['White bread', 'Wheat bread', 'Wrap/tortilla', 'Bun', 'Croissant', 'Corn tortilla', 'Pita', 'Naan'],
    sauce_or_dressing: ['Mayo', 'Mustard', 'Ranch', 'Chipotle', 'Hot sauce', 'Salsa', 'Guac', 'Sour cream', 'None'],
    cooking_method: ['Toasted', 'Grilled', 'Cold/Fresh', 'Fried'],
  },

  SOUP_STEW: {
    portion: ['Cup', 'Bowl', 'Large bowl'],
    protein: ['Chicken', 'Beef', 'Pork', 'Shrimp', 'Beans only', 'None'],
    base_food: ['Tomato-based', 'Cream-based', 'Broth-based', 'Chili'],
  },

  PLATED_MEAL: {
    portion: ['1 piece/cutlet', '2 pieces/cutlets', '4-6 oz', '6-8 oz', '8+ oz'],
    protein: ['Chicken', 'Beef', 'Fish', 'Pork', 'Tofu', 'Shrimp', 'Lamb', 'Seafood'],
    cooking_method: ['Grilled', 'Pan-fried', 'Deep-fried', 'Air-fried', 'Baked', 'Roasted', 'Steamed', 'Sautéed', 'BBQ/Smoked', 'Braised', 'Raw/Sashimi'],
    sauce_or_dressing: ['None', 'Gravy', 'Teriyaki', 'BBQ sauce', 'Cream sauce', 'Curry', 'Salsa', 'Other'],
  },

  SNACK_DESSERT: {
    portion: ['1 serving', '2-3 pieces', 'Small', 'Large', 'Handful'],
    base_food: ['Chips', 'Cookies', 'Candy', 'Ice cream', 'Cake', 'Fruit'],
  },

  DRINK: {
    portion: ['Small (8oz)', 'Medium (12oz)', 'Large (16oz)', 'Extra large (20oz+)'],
    base_food: ['Coffee', 'Latte', 'Smoothie', 'Protein shake', 'Juice', 'Soda'],
  },

  PACKAGED_FOOD: {
    portion: ['1 serving', '1/2 package', 'Whole package'],
    base_food: ['Protein bar', 'Frozen meal', 'Snack pack', 'Ready-to-eat'],
  },

  MULTI_ITEM: {
    portion: ['Small portions', 'Regular portions', 'Large portions'],
  },
};

// ============================================================================
// FIELD DISPLAY NAMES (for follow-up questions)
// ============================================================================

export const FIELD_QUESTIONS: Record<keyof ConfidenceScores, string> = {
  base_food: 'What was the main food?',
  portion: 'How much did you have?',
  protein: 'Any protein with that?',
  sauce_or_dressing: 'What sauce or dressing?',
  cooking_method: 'How was it prepared?',
  extras: 'Any toppings or extras?',
};

// Archetype-specific question overrides
export const ARCHETYPE_QUESTIONS: Partial<Record<MealArchetype, Partial<Record<keyof ConfidenceScores, string>>>> = {
  PASTA_GRAIN_BOWL: {
    sauce_or_dressing: 'What sauce was on it?',
    protein: 'Any protein added?',
    portion: 'How much pasta/grain?',
    cooking_method: 'How was the protein cooked?',
  },
  SALAD: {
    sauce_or_dressing: 'What dressing?',
    protein: 'Any protein on top?',
    cooking_method: 'How was the protein cooked?',
  },
  SANDWICH_WRAP: {
    cooking_method: 'How was it prepared? (toasted, grilled, cold)',
    sauce_or_dressing: 'Any sauces or condiments?',
  },
  PLATED_MEAL: {
    protein: 'What was the main protein?',
    portion: 'How much protein? (e.g., 2 cutlets, 6oz)',
    cooking_method: 'How was it cooked? (fried, grilled, air-fried, baked)',
    sauce_or_dressing: 'Any sauce or gravy?',
  },
  DRINK: {
    base_food: 'What type of drink?',
    portion: 'What size?',
    extras: 'Any additions? (cream, sugar, syrup)',
  },
  SNACK_DESSERT: {
    portion: 'How much? (1 serving, handful, etc.)',
  },
};

// ============================================================================
// CONFIDENCE THRESHOLD
// ============================================================================

export const CONFIDENCE_THRESHOLD = 0.7; // Below this = needs follow-up

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Check if extraction is multi-item
 */
export function isMultiItem(extraction: ExtractionResult): extraction is MultiItemExtraction {
  return extraction.archetype === 'MULTI_ITEM' && 'items' in extraction;
}

/**
 * Get the main item from an extraction (first item for multi-item)
 */
export function getMainItem(extraction: ExtractionResult): UniversalExtraction {
  if (isMultiItem(extraction)) {
    return extraction.items[0];
  }
  return extraction;
}

/**
 * Get question text for a field
 */
export function getQuestionForField(archetype: MealArchetype, field: keyof ConfidenceScores): string {
  const archetypeOverride = ARCHETYPE_QUESTIONS[archetype]?.[field];
  if (archetypeOverride) return archetypeOverride;
  return FIELD_QUESTIONS[field];
}

/**
 * Get quick options for a field
 */
export function getQuickOptionsForField(archetype: MealArchetype, field: keyof ConfidenceScores): string[] {
  return QUICK_OPTIONS[archetype]?.[field] || [];
}
