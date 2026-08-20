/**
 * Meal Parsing Service - Main Orchestrator
 *
 * This is the entry point for the new streamlined meal parsing system.
 * It coordinates:
 * 1. AI Extraction (minimal prompt)
 * 2. Deterministic follow-up logic
 * 3. Nutrition lookup/calculation
 *
 * Architecture:
 * - AI only extracts information (doesn't make decisions)
 * - Follow-up logic is in TypeScript (predictable, testable)
 * - Nutrition uses lookup tables first, AI fallback for unknowns
 */

import { extractMealInfo, ExtractionResponse } from './extraction.service';
import {
  applyFollowUpAnswer,
  toFrontendFollowUpType,
  FollowUp,
} from './followUp.service';
import { calculateNutrition, CalculatedItem } from './nutrition.service';

// Types that match the existing frontend expectations
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
  followUpType?: string | null;
  followUpQuestion?: string | null;
  quickOptions?: string[] | null;
  isRestaurant: boolean;
  restaurantName?: string | null;
}

// State stored between follow-up calls
interface ParseState {
  extraction: ExtractionResponse;
  answeredFollowUpKeys: string[]; // Track by unique key: "type:itemIndex"
  pendingFollowUp: FollowUp | null; // The follow-up we're waiting for answer to
}

// Cache for ongoing parsing sessions
const parseStateCache = new Map<string, ParseState>();

// Generate unique key for a follow-up
function getFollowUpKey(followUp: FollowUp): string {
  return `${followUp.type}:${followUp.itemIndex}`;
}

/**
 * Main entry point: Parse meal input
 *
 * @param input - User's meal description
 * @param userId - User ID for caching state
 * @param followUpContext - Previous context if this is a follow-up
 */
export async function parseMealInput(
  input: string,
  userId: string,
  followUpContext?: string
): Promise<MealParseResponse> {
  // Generate cache key
  const cacheKey = `${userId}:meal`;

  let extraction: ExtractionResponse;
  let answeredFollowUpKeys: string[] = [];

  console.log('[MealParsing:Orchestrator] Input:', input);
  console.log('[MealParsing:Orchestrator] followUpContext:', followUpContext || 'none');

  if (followUpContext) {
    // This is a follow-up answer - retrieve and update state
    const state = parseStateCache.get(cacheKey);
    console.log('[MealParsing:Orchestrator] Cache state:', state ? 'found' : 'not found');

    if (state && state.pendingFollowUp) {
      // Extract the actual answer from followUpContext
      // Format: 'User was asked: "question" and answered: "answer"'
      const answerMatch = followUpContext.match(/and answered:\s*"([^"]+)"/i);
      const actualAnswer = answerMatch ? answerMatch[1] : input;
      console.log('[MealParsing:Orchestrator] Extracted answer:', actualAnswer);

      // Apply the answer to the pending follow-up
      console.log('[MealParsing:Orchestrator] Pending follow-up:', state.pendingFollowUp.type);
      extraction = applyFollowUpAnswer(state.extraction, state.pendingFollowUp, actualAnswer);
      answeredFollowUpKeys = [...state.answeredFollowUpKeys, getFollowUpKey(state.pendingFollowUp)];
      console.log('[MealParsing:Orchestrator] Applied answer, extraction updated');
      console.log('[MealParsing:Orchestrator] Answered keys:', answeredFollowUpKeys);
    } else {
      // No cached state or no pending follow-up, extract fresh with context
      console.log('[MealParsing:Orchestrator] No pending follow-up, re-extracting');
      extraction = await extractMealInfo(`${followUpContext}. ${input}`);
    }
  } else {
    // Fresh parse - extract from input
    console.log('[MealParsing:Orchestrator] Fresh parse');
    extraction = await extractMealInfo(input);
    // Clear any old state
    parseStateCache.delete(cacheKey);
  }

  console.log('[MealParsing:Orchestrator] Extraction:', JSON.stringify(extraction, null, 2));

  // Check if we need more follow-ups
  const { getRequiredFollowUps } = await import('./followUp.service');
  const allFollowUps = getRequiredFollowUps(extraction);
  console.log('[MealParsing:Orchestrator] All required follow-ups:', allFollowUps.map(f => `${f.type}:${f.itemIndex}`));

  // Filter out ones we've already asked (by unique key)
  const remainingFollowUps = allFollowUps.filter(f => !answeredFollowUpKeys.includes(getFollowUpKey(f)));
  console.log('[MealParsing:Orchestrator] Remaining follow-ups:', remainingFollowUps.map(f => `${f.type}:${f.itemIndex}`));

  const nextFollowUp = remainingFollowUps.length > 0 ? remainingFollowUps[0] : null;

  if (nextFollowUp) {
    // Need more info - cache state with pending follow-up
    console.log('[MealParsing:Orchestrator] Asking follow-up:', nextFollowUp.type, 'for item', nextFollowUp.itemIndex);
    parseStateCache.set(cacheKey, {
      extraction,
      answeredFollowUpKeys,
      pendingFollowUp: nextFollowUp,
    });

    return {
      items: [], // Don't calculate yet
      confidence: 'medium',
      followUpNeeded: true,
      followUpType: toFrontendFollowUpType(nextFollowUp.type),
      followUpQuestion: nextFollowUp.question,
      quickOptions: nextFollowUp.quickOptions,
      isRestaurant: extraction.source !== null && extraction.source !== 'homemade',
      restaurantName: extraction.source !== 'homemade' ? extraction.source : null,
    };
  }

  // All info collected - calculate nutrition
  console.log('[MealParsing:Orchestrator] All follow-ups complete, calculating nutrition');
  const calculatedItems = await calculateNutrition(extraction);

  // Clear cache - we're done
  parseStateCache.delete(cacheKey);
  console.log('[MealParsing:Orchestrator] Calculated items:', calculatedItems.length);

  // Convert to frontend format
  const items: ParsedMealItem[] = calculatedItems.map(item => ({
    name: item.name,
    quantity: item.quantity,
    unit: item.unit,
    calories: item.calories,
    protein: item.protein,
    carbs: item.carbs,
    fat: item.fat,
  }));

  // Determine confidence based on what we know
  const confidence = determineConfidence(extraction, calculatedItems);

  return {
    items,
    confidence,
    followUpNeeded: false,
    followUpType: null,
    followUpQuestion: null,
    quickOptions: null,
    isRestaurant: extraction.source !== null && extraction.source !== 'homemade',
    restaurantName: extraction.source !== 'homemade' ? extraction.source : null,
  };
}

/**
 * Determine confidence level based on data quality
 */
function determineConfidence(
  extraction: ExtractionResponse,
  items: CalculatedItem[]
): 'high' | 'medium' | 'low' {
  // High: all items have quantity and preparation specified
  const allComplete = extraction.items.every(
    item => item.quantity !== null
  );

  if (allComplete && extraction.items.length > 0) {
    return 'high';
  }

  // Low: no items or very incomplete data
  if (extraction.items.length === 0 || items.length === 0) {
    return 'low';
  }

  // Medium: partial data
  return 'medium';
}

/**
 * Clear parse state for a user (call on cancel)
 */
export function clearParseState(userId: string): void {
  parseStateCache.delete(`${userId}:meal`);
}

// Re-export types for convenience
export type { ExtractionResponse, CalculatedItem, FollowUp };
