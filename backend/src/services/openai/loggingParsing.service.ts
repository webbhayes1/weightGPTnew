/**
 * AI Logging Parsing Service
 * Phase 6: Q3.2 AI-Powered Logging
 *
 * v2 ARCHITECTURE:
 * - Meal parsing uses streamlined deterministic system (see mealParsing/v2/)
 * - Workout parsing uses streamlined deterministic system (see workoutParsing/v2/)
 * - AI only extracts info, follow-up logic is in TypeScript
 * - Deterministic follow-ups based on archetype + missing required fields
 */

import { PrismaClient } from '@prisma/client';

// Import v2 meal parsing system (universal archetypes + deterministic follow-ups)
import {
  parseMealInput as parseWithV2MealSystem,
  MealParseResponse,
} from '../mealParsing/v2';
import { ParsedMealItem } from '../mealParsing/v2/adapter';

// Import v2 workout parsing system (universal archetypes + deterministic follow-ups)
import { parseWorkoutInput as parseWithV2WorkoutSystem } from '../workoutParsing/v2';

const prisma = new PrismaClient();

// ============================================================================
// MEAL PARSING - Using new streamlined system
// ============================================================================

// Re-export types for backwards compatibility
export type { ParsedMealItem, MealParseResponse };

/**
 * Parse meal input using v2 system
 *
 * v2 Architecture:
 * - 10 Universal Archetypes (PASTA_GRAIN_BOWL, SALAD, SANDWICH_WRAP, etc.)
 * - Single AI call extracts archetype + structured attributes with confidence
 * - Deterministic follow-up engine based on archetype + missing required fields
 * - Nutrition lookup first, AI fallback for unknowns
 */
export async function parseMealInput(
  input: string,
  userId: string,
  followUpContext?: string
): Promise<MealParseResponse> {
  console.log('[MealParsing] Using v2 archetype system');
  console.log('[MealParsing] Input:', input);
  console.log('[MealParsing] Follow-up context:', followUpContext || 'none');

  try {
    const result = await parseWithV2MealSystem(input, userId, followUpContext);
    console.log('[MealParsing] Result:', JSON.stringify(result, null, 2));
    return result;
  } catch (error) {
    console.error('[MealParsing] Error:', error);

    // Fallback response
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
}

// ============================================================================
// WORKOUT PARSING - Using v2 streamlined system
// ============================================================================

// Re-export types for backwards compatibility
export interface ParsedExercise {
  name: string;
  sets?: number;
  reps?: number;
  weight?: number;
  weightUnit?: 'lbs' | 'kg';
  durationMin?: number;
  distance?: number;
  distanceUnit?: 'miles' | 'km' | 'meters';
}

export interface WorkoutParseResponse {
  type: 'cardio' | 'strength' | 'balanced';
  name: string;
  durationMinutes: number;
  intensity: 'easy' | 'moderate' | 'hard';
  exercises: ParsedExercise[];
  caloriesBurned: number;
  confidence: 'high' | 'medium' | 'low';
  followUpNeeded: boolean;
  followUpType?: string | null;
  followUpQuestion?: string | null;
  quickOptions?: string[] | null;
}

// Re-export calculateCaloriesBurned from v2 system
export { calculateCaloriesBurned } from '../workoutParsing/v2';

/**
 * Map v2 workout type to legacy type
 */
function mapWorkoutTypeToLegacy(archetype: string): 'cardio' | 'strength' | 'balanced' {
  const cardioTypes = ['RUNNING', 'CYCLING', 'SWIMMING', 'WALKING', 'CARDIO_MACHINE'];
  const strengthTypes = ['STRENGTH'];

  if (cardioTypes.includes(archetype)) return 'cardio';
  if (strengthTypes.includes(archetype)) return 'strength';
  return 'balanced';
}

/**
 * Parse workout input using v2 system
 *
 * v2 Architecture:
 * - 10 Universal Archetypes (RUNNING, CYCLING, STRENGTH, HIIT, etc.)
 * - Single AI call extracts archetype + structured attributes with confidence
 * - Deterministic follow-up engine based on archetype + missing required fields
 * - MET-based calorie calculation
 */
export async function parseWorkoutInput(
  input: string,
  userId: string,
  followUpContext?: string
): Promise<WorkoutParseResponse> {
  console.log('[WorkoutParsing] Using v2 archetype system');
  console.log('[WorkoutParsing] Input:', input);
  console.log('[WorkoutParsing] Follow-up context:', followUpContext || 'none');

  // Get user weight for calorie calculation
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { currentWeight: true },
  });

  const userWeightLbs = user?.currentWeight ? Number(user.currentWeight) : 160;

  try {
    const result = await parseWithV2WorkoutSystem(input, userId, userWeightLbs, followUpContext);
    console.log('[WorkoutParsing] v2 Result:', JSON.stringify(result, null, 2));

    // Convert v2 response to legacy format
    const legacyResponse: WorkoutParseResponse = {
      type: mapWorkoutTypeToLegacy(result.workoutType),
      name: result.workoutName || result.workoutType,
      durationMinutes: result.duration || 30,
      intensity: result.intensity || 'moderate',
      exercises: result.exercises,
      caloriesBurned: result.caloriesBurned || 0,
      confidence: result.confidence,
      followUpNeeded: result.followUpNeeded,
      followUpType: result.followUpType,
      followUpQuestion: result.followUpQuestion,
      quickOptions: result.quickOptions,
    };

    return legacyResponse;
  } catch (error) {
    console.error('[WorkoutParsing] Error:', error);

    // Fallback response
    return {
      type: 'balanced',
      name: 'Workout',
      durationMinutes: 30,
      intensity: 'moderate',
      exercises: [],
      caloriesBurned: 0,
      confidence: 'low',
      followUpNeeded: false,
    };
  }
}

// ============================================================================
// WEIGHT PARSING (Simple - no AI needed)
// ============================================================================

export interface WeightParseResponse {
  weightLbs: number;
  originalValue: number;
  originalUnit: 'lbs' | 'kg';
  confidence: 'high' | 'medium' | 'low';
}

/**
 * Parse weight input (simple regex-based, no AI needed)
 */
export function parseWeightInput(input: string, preferredUnit: 'lbs' | 'kg' = 'lbs'): WeightParseResponse {
  // Remove whitespace and convert to lowercase
  const cleaned = input.trim().toLowerCase();

  // Try to extract number and unit
  const kgMatch = cleaned.match(/^([\d.]+)\s*(kg|kilograms?)$/i);
  const lbsMatch = cleaned.match(/^([\d.]+)\s*(lbs?|pounds?)$/i);
  const numberOnly = cleaned.match(/^([\d.]+)$/);

  let originalValue: number;
  let originalUnit: 'lbs' | 'kg';
  let confidence: 'high' | 'medium' | 'low';

  if (kgMatch) {
    originalValue = parseFloat(kgMatch[1]);
    originalUnit = 'kg';
    confidence = 'high';
  } else if (lbsMatch) {
    originalValue = parseFloat(lbsMatch[1]);
    originalUnit = 'lbs';
    confidence = 'high';
  } else if (numberOnly) {
    originalValue = parseFloat(numberOnly[1]);
    originalUnit = preferredUnit; // Use user's preferred unit
    confidence = 'medium';
  } else {
    // Couldn't parse
    return {
      weightLbs: 0,
      originalValue: 0,
      originalUnit: preferredUnit,
      confidence: 'low',
    };
  }

  // Validate range (reasonable weight: 50-700 lbs or 20-320 kg)
  if (originalUnit === 'kg' && (originalValue < 20 || originalValue > 320)) {
    return { weightLbs: 0, originalValue, originalUnit, confidence: 'low' };
  }
  if (originalUnit === 'lbs' && (originalValue < 50 || originalValue > 700)) {
    return { weightLbs: 0, originalValue, originalUnit, confidence: 'low' };
  }

  // Convert to lbs for storage
  const weightLbs = originalUnit === 'kg'
    ? Math.round(originalValue * 2.20462 * 10) / 10
    : originalValue;

  return {
    weightLbs,
    originalValue,
    originalUnit,
    confidence,
  };
}
