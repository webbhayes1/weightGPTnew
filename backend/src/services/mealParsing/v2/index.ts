/**
 * v2 Meal Parsing - Main Orchestrator
 *
 * Architecture:
 * 1. Single AI call to extract meal data into universal schema
 * 2. Deterministic follow-up logic based on archetype + confidence
 * 3. Nutrition lookup with AI fallback
 * 4. Adapter for frontend compatibility
 *
 * Flow:
 * User input → AI Extraction → Follow-up Queue → (optional follow-ups) → Nutrition → Response
 */

import {
  ExtractionResult,
  UniversalExtraction,
  isMultiItem,
  getMainItem,
} from './archetypes';
import { extractMealData, applyFollowUpToExtraction } from './extraction.service';
import {
  generateFollowUpQueue,
  getNextQuestion,
  advanceQueue,
  FollowUpQueue,
  FollowUpQuestion,
  parseFollowUpContext,
} from './followUp.service';
import { calculateNutritionFromExtraction, NutritionResult } from './nutrition.service';
import {
  MealParseResponse,
  createFollowUpResponse,
  createCompleteResponse,
  createErrorResponse,
} from './adapter';

// ============================================================================
// STATE MANAGEMENT
// ============================================================================

interface ParseState {
  extraction: ExtractionResult;
  queue: FollowUpQueue;
  answeredFields: Set<string>; // Track answered field keys
}

// In-memory cache for parse sessions (per user)
const parseStateCache = new Map<string, ParseState>();

/**
 * Get cache key for user
 */
function getCacheKey(userId: string): string {
  return `v2:${userId}:meal`;
}

// ============================================================================
// MAIN ENTRY POINT
// ============================================================================

/**
 * Parse meal input using v2 system
 *
 * @param input - User's meal description or follow-up answer
 * @param userId - User ID for session state
 * @param followUpContext - Context from previous follow-up (if any)
 */
export async function parseMealInput(
  input: string,
  userId: string,
  followUpContext?: string
): Promise<MealParseResponse> {
  const cacheKey = getCacheKey(userId);

  console.log('[v2 Orchestrator] ===========================================');
  console.log('[v2 Orchestrator] Input:', input);
  console.log('[v2 Orchestrator] Follow-up context:', followUpContext || 'none');

  try {
    // Check if this is a follow-up response
    if (followUpContext) {
      return await handleFollowUpResponse(cacheKey, input, followUpContext);
    }

    // Fresh parse
    return await handleFreshParse(cacheKey, input);
  } catch (error) {
    console.error('[v2 Orchestrator] Error:', error);
    parseStateCache.delete(cacheKey);
    return createErrorResponse(error instanceof Error ? error.message : 'Unknown error');
  }
}

// ============================================================================
// FRESH PARSE
// ============================================================================

/**
 * Handle a fresh meal input (no prior context)
 */
async function handleFreshParse(cacheKey: string, input: string): Promise<MealParseResponse> {
  console.log('[v2 Orchestrator] Fresh parse');

  // Clear any old state
  parseStateCache.delete(cacheKey);

  // Step 1: Extract meal data using AI
  const extraction = await extractMealData(input);
  console.log('[v2 Orchestrator] Extraction complete:', extraction.archetype);

  // Step 2: Generate follow-up queue
  const queue = generateFollowUpQueue(extraction);
  console.log('[v2 Orchestrator] Follow-up queue:', queue.totalQuestions, 'questions');

  // Step 3: Check if we need follow-ups
  const nextQuestion = getNextQuestion(queue);

  if (nextQuestion) {
    // Need follow-up - cache state and return question
    console.log('[v2 Orchestrator] Asking:', nextQuestion.field, '-', nextQuestion.question);

    parseStateCache.set(cacheKey, {
      extraction,
      queue,
      answeredFields: new Set(),
    });

    return createFollowUpResponse(extraction, nextQuestion);
  }

  // No follow-ups needed - calculate nutrition and return
  return await completeParsingFlow(extraction);
}

// ============================================================================
// FOLLOW-UP HANDLING
// ============================================================================

/**
 * Handle a follow-up response
 */
async function handleFollowUpResponse(
  cacheKey: string,
  input: string,
  followUpContext: string
): Promise<MealParseResponse> {
  console.log('[v2 Orchestrator] Processing follow-up response');

  // Get cached state
  const state = parseStateCache.get(cacheKey);

  if (!state) {
    // No cached state - treat as fresh parse with context
    console.log('[v2 Orchestrator] No cached state, re-extracting with context');
    parseStateCache.delete(cacheKey);
    return await handleFreshParse(cacheKey, `${followUpContext}. ${input}`);
  }

  // Parse the follow-up context to get the question and answer
  const parsed = parseFollowUpContext(followUpContext);
  const answer = parsed?.answer || input;
  console.log('[v2 Orchestrator] Answer:', answer);

  // Get current question from queue
  const currentQuestion = getNextQuestion(state.queue);

  if (!currentQuestion) {
    // Queue is empty - this shouldn't happen, but complete the flow
    console.log('[v2 Orchestrator] No pending question, completing');
    parseStateCache.delete(cacheKey);
    return await completeParsingFlow(state.extraction);
  }

  console.log('[v2 Orchestrator] Applying answer for field:', currentQuestion.field);

  // Apply the answer to the extraction
  const mainItem = getMainItem(state.extraction);
  const updatedExtraction = applyFollowUpToExtraction(
    mainItem,
    currentQuestion.field,
    answer
  );

  // Update the extraction result
  let newExtractionResult: ExtractionResult;
  if (isMultiItem(state.extraction)) {
    // Update first item in multi-item extraction
    newExtractionResult = {
      ...state.extraction,
      items: [updatedExtraction, ...state.extraction.items.slice(1)],
    };
  } else {
    newExtractionResult = updatedExtraction;
  }

  // Advance the queue
  const newQueue = advanceQueue(state.queue);
  state.answeredFields.add(currentQuestion.field);

  // Check for more questions
  const nextQuestion = getNextQuestion(newQueue);

  if (nextQuestion) {
    // More follow-ups needed
    console.log('[v2 Orchestrator] Next question:', nextQuestion.field);

    parseStateCache.set(cacheKey, {
      extraction: newExtractionResult,
      queue: newQueue,
      answeredFields: state.answeredFields,
    });

    return createFollowUpResponse(newExtractionResult, nextQuestion);
  }

  // All follow-ups complete
  console.log('[v2 Orchestrator] All follow-ups complete');
  parseStateCache.delete(cacheKey);

  return await completeParsingFlow(newExtractionResult);
}

// ============================================================================
// COMPLETION
// ============================================================================

/**
 * Complete the parsing flow - calculate nutrition and return response
 */
async function completeParsingFlow(extraction: ExtractionResult): Promise<MealParseResponse> {
  console.log('[v2 Orchestrator] Completing parsing flow');

  const mainItem = getMainItem(extraction);

  // Calculate nutrition
  const nutritionResults = await calculateNutritionFromExtraction(mainItem);
  console.log('[v2 Orchestrator] Nutrition calculated:', nutritionResults.length, 'items');

  // Create complete response
  return createCompleteResponse(extraction, nutritionResults);
}

// ============================================================================
// UTILITIES
// ============================================================================

/**
 * Clear parse state for a user (e.g., on cancel)
 */
export function clearParseState(userId: string): void {
  const cacheKey = getCacheKey(userId);
  parseStateCache.delete(cacheKey);
  console.log('[v2 Orchestrator] Cleared state for user:', userId);
}

// ============================================================================
// EXPORTS
// ============================================================================

// Re-export types for convenience
export type {
  MealParseResponse,
  ExtractionResult,
  UniversalExtraction,
  FollowUpQuestion,
  FollowUpQueue,
  NutritionResult,
};

export { isMultiItem, getMainItem } from './archetypes';
