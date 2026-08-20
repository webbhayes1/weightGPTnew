/**
 * Response Adapter for v2 Meal Parsing
 *
 * Converts new UniversalExtraction schema to old MealParseResponse format
 * for frontend compatibility during transition.
 */

import {
  UniversalExtraction,
  ExtractionResult,
  getMainItem,
  ConfidenceScores,
} from './archetypes';
import { FollowUpQuestion } from './followUp.service';
import { NutritionResult } from './nutrition.service';

// ============================================================================
// OLD FRONTEND TYPES (for compatibility)
// ============================================================================

export interface ParsedMealItem {
  name: string;
  quantity: number;
  unit: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface MealParseResponse {
  items: ParsedMealItem[];
  confidence: 'high' | 'medium' | 'low';
  followUpNeeded: boolean;
  followUpType: string | null;
  followUpQuestion: string | null;
  quickOptions: string[] | null;
  isRestaurant: boolean;
  restaurantName: string | null;
}

// ============================================================================
// FOLLOW-UP TYPE MAPPING
// ============================================================================

// Map our field names to frontend follow-up types
const FIELD_TO_FOLLOWUP_TYPE: Record<keyof ConfidenceScores, string> = {
  base_food: 'clarification',
  portion: 'portion',
  protein: 'protein',
  sauce_or_dressing: 'sauce',
  cooking_method: 'preparation',
  extras: 'extras',
};

// ============================================================================
// ADAPTER FUNCTIONS
// ============================================================================

/**
 * Convert nutrition results to ParsedMealItem array
 */
export function nutritionToItems(nutritionResults: NutritionResult[]): ParsedMealItem[] {
  return nutritionResults.map(result => ({
    name: result.name,
    quantity: result.quantity,
    unit: result.unit,
    calories: result.calories,
    protein: result.protein,
    carbs: result.carbs,
    fat: result.fat,
  }));
}

/**
 * Create a follow-up response (no nutrition calculated yet)
 */
export function createFollowUpResponse(
  extraction: ExtractionResult,
  question: FollowUpQuestion
): MealParseResponse {
  const mainItem = getMainItem(extraction);

  return {
    items: [], // Don't calculate nutrition yet
    confidence: 'medium',
    followUpNeeded: true,
    followUpType: FIELD_TO_FOLLOWUP_TYPE[question.field] || 'clarification',
    followUpQuestion: question.question,
    quickOptions: question.quickOptions,
    isRestaurant: mainItem.brand_or_name !== null,
    restaurantName: mainItem.brand_or_name,
  };
}

/**
 * Create a complete response (all follow-ups answered)
 */
export function createCompleteResponse(
  extraction: ExtractionResult,
  nutritionResults: NutritionResult[]
): MealParseResponse {
  const mainItem = getMainItem(extraction);
  const items = nutritionToItems(nutritionResults);

  // Determine confidence
  const confidence = determineConfidence(mainItem);

  return {
    items,
    confidence,
    followUpNeeded: false,
    followUpType: null,
    followUpQuestion: null,
    quickOptions: null,
    isRestaurant: mainItem.brand_or_name !== null,
    restaurantName: mainItem.brand_or_name,
  };
}

/**
 * Determine confidence level from extraction
 */
function determineConfidence(extraction: UniversalExtraction): 'high' | 'medium' | 'low' {
  const { confidence } = extraction;

  // Average all confidence scores
  const scores = Object.values(confidence);
  const avgConfidence = scores.reduce((a, b) => a + b, 0) / scores.length;

  if (avgConfidence >= 0.8) return 'high';
  if (avgConfidence >= 0.5) return 'medium';
  return 'low';
}

/**
 * Create error/fallback response
 */
export function createErrorResponse(error?: string): MealParseResponse {
  console.error('[v2 Adapter] Creating error response:', error);

  return {
    items: [],
    confidence: 'low',
    followUpNeeded: false,
    followUpType: null,
    followUpQuestion: null,
    quickOptions: null,
    isRestaurant: false,
    restaurantName: null,
  };
}
