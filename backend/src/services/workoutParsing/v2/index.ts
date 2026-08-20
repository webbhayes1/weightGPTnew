/**
 * v2 Workout Parsing - Main Orchestrator
 *
 * Architecture:
 * 1. Single AI call to extract workout data into universal schema
 * 2. Deterministic follow-up logic based on archetype + confidence
 * 3. MET-based calorie calculation
 * 4. Adapter for frontend compatibility
 *
 * Flow:
 * User input → AI Extraction → Follow-up Queue → (optional follow-ups) → Calorie Calc → Response
 */

import { UniversalWorkoutExtraction } from './archetypes';
import { extractWorkoutData, applyFollowUpToExtraction } from './extraction.service';
import {
  generateFollowUpQueue,
  getNextQuestion,
  advanceQueue,
  FollowUpQueue,
  FollowUpQuestion,
  parseFollowUpContext,
} from './followUp.service';
import {
  WorkoutParseResponse,
  createFollowUpResponse,
  createCompleteResponse,
  createErrorResponse,
} from './adapter';

// ============================================================================
// STATE MANAGEMENT
// ============================================================================

interface ParseState {
  extraction: UniversalWorkoutExtraction;
  queue: FollowUpQueue;
  answeredFields: Set<string>; // Track answered field keys
}

// In-memory cache for parse sessions (per user)
const parseStateCache = new Map<string, ParseState>();

/**
 * Get cache key for user
 */
function getCacheKey(userId: string): string {
  return `v2:${userId}:workout`;
}

// ============================================================================
// MAIN ENTRY POINT
// ============================================================================

/**
 * Parse workout input using v2 system
 *
 * @param input - User's workout description or follow-up answer
 * @param userId - User ID for session state
 * @param userWeightLbs - User's weight for calorie calculation
 * @param followUpContext - Context from previous follow-up (if any)
 */
export async function parseWorkoutInput(
  input: string,
  userId: string,
  userWeightLbs: number = 160,
  followUpContext?: string
): Promise<WorkoutParseResponse> {
  const cacheKey = getCacheKey(userId);

  console.log('[v2 Workout Orchestrator] ===========================================');
  console.log('[v2 Workout Orchestrator] Input:', input);
  console.log('[v2 Workout Orchestrator] Follow-up context:', followUpContext || 'none');

  try {
    // Check if this is a follow-up response
    if (followUpContext) {
      return await handleFollowUpResponse(cacheKey, input, followUpContext, userWeightLbs);
    }

    // Fresh parse
    return await handleFreshParse(cacheKey, input, userWeightLbs);
  } catch (error) {
    console.error('[v2 Workout Orchestrator] Error:', error);
    parseStateCache.delete(cacheKey);
    return createErrorResponse(error instanceof Error ? error.message : 'Unknown error');
  }
}

// ============================================================================
// FRESH PARSE
// ============================================================================

/**
 * Handle a fresh workout input (no prior context)
 */
async function handleFreshParse(
  cacheKey: string,
  input: string,
  userWeightLbs: number
): Promise<WorkoutParseResponse> {
  console.log('[v2 Workout Orchestrator] Fresh parse');

  // Clear any old state
  parseStateCache.delete(cacheKey);

  // Step 1: Extract workout data using AI
  const extraction = await extractWorkoutData(input);
  console.log('[v2 Workout Orchestrator] Extraction complete:', extraction.archetype);

  // Step 2: Generate follow-up queue
  const queue = generateFollowUpQueue(extraction);
  console.log('[v2 Workout Orchestrator] Follow-up queue:', queue.totalQuestions, 'questions');

  // Step 3: Check if we need follow-ups
  const nextQuestion = getNextQuestion(queue);

  if (nextQuestion) {
    // Need follow-up - cache state and return question
    console.log('[v2 Workout Orchestrator] Asking:', nextQuestion.field, '-', nextQuestion.question);

    parseStateCache.set(cacheKey, {
      extraction,
      queue,
      answeredFields: new Set(),
    });

    return createFollowUpResponse(extraction, nextQuestion);
  }

  // No follow-ups needed - calculate and return
  return createCompleteResponse(extraction, userWeightLbs);
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
  followUpContext: string,
  userWeightLbs: number
): Promise<WorkoutParseResponse> {
  console.log('[v2 Workout Orchestrator] Processing follow-up response');

  // Get cached state
  const state = parseStateCache.get(cacheKey);

  if (!state) {
    // No cached state - treat as fresh parse with context
    console.log('[v2 Workout Orchestrator] No cached state, re-extracting with context');
    parseStateCache.delete(cacheKey);
    return await handleFreshParse(cacheKey, `${followUpContext}. ${input}`, userWeightLbs);
  }

  // Parse the follow-up context to get the question and answer
  const parsed = parseFollowUpContext(followUpContext);
  const answer = parsed?.answer || input;
  console.log('[v2 Workout Orchestrator] Answer:', answer);

  // Get current question from queue
  const currentQuestion = getNextQuestion(state.queue);

  if (!currentQuestion) {
    // Queue is empty - this shouldn't happen, but complete the flow
    console.log('[v2 Workout Orchestrator] No pending question, completing');
    parseStateCache.delete(cacheKey);
    return createCompleteResponse(state.extraction, userWeightLbs);
  }

  console.log('[v2 Workout Orchestrator] Applying answer for field:', currentQuestion.field);

  // Apply the answer to the extraction
  const updatedExtraction = applyFollowUpToExtraction(
    state.extraction,
    currentQuestion.field,
    answer
  );

  // Advance the queue
  const newQueue = advanceQueue(state.queue);
  state.answeredFields.add(currentQuestion.field);

  // Check for more questions
  const nextQuestion = getNextQuestion(newQueue);

  if (nextQuestion) {
    // More follow-ups needed
    console.log('[v2 Workout Orchestrator] Next question:', nextQuestion.field);

    parseStateCache.set(cacheKey, {
      extraction: updatedExtraction,
      queue: newQueue,
      answeredFields: state.answeredFields,
    });

    return createFollowUpResponse(updatedExtraction, nextQuestion);
  }

  // All follow-ups complete
  console.log('[v2 Workout Orchestrator] All follow-ups complete');
  parseStateCache.delete(cacheKey);

  return createCompleteResponse(updatedExtraction, userWeightLbs);
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
  console.log('[v2 Workout Orchestrator] Cleared state for user:', userId);
}

/**
 * Check if user has pending follow-up
 */
export function hasPendingFollowUp(userId: string): boolean {
  const cacheKey = getCacheKey(userId);
  return parseStateCache.has(cacheKey);
}

// ============================================================================
// EXPORTS
// ============================================================================

// Re-export types for convenience
export type {
  WorkoutParseResponse,
  UniversalWorkoutExtraction,
  FollowUpQuestion,
  FollowUpQueue,
};

export { calculateCaloriesBurned } from './archetypes';
