/**
 * Deterministic Follow-Up Engine
 * v2 Meal Parsing System
 *
 * No AI calls - pure logic based on archetype + missing/low-confidence fields.
 * Returns a queue of follow-up questions to ask one at a time.
 */

import {
  MealArchetype,
  UniversalExtraction,
  ExtractionResult,
  ConfidenceScores,
  REQUIRED_FIELDS,
  CONFIDENCE_THRESHOLD,
  getMainItem,
  getQuestionForField,
  getQuickOptionsForField,
} from './archetypes';

// ============================================================================
// TYPES
// ============================================================================

export interface FollowUpQuestion {
  field: keyof ConfidenceScores;
  question: string;
  quickOptions: string[];
  priority: number; // Lower = ask first
}

export interface FollowUpQueue {
  questions: FollowUpQuestion[];
  currentIndex: number;
  totalQuestions: number;
}

// ============================================================================
// PRIORITY MAP
// ============================================================================

// Which fields to ask first (lower = higher priority)
const FIELD_PRIORITY: Record<keyof ConfidenceScores, number> = {
  base_food: 1,
  portion: 2,
  protein: 3,
  sauce_or_dressing: 4,
  cooking_method: 5,
  extras: 6,
};

// ============================================================================
// FOLLOW-UP GENERATION
// ============================================================================

/**
 * Generate a queue of follow-up questions based on extraction
 */
export function generateFollowUpQueue(extraction: ExtractionResult): FollowUpQueue {
  // Get the main item (for MULTI_ITEM, just use first item for v1)
  const mainItem = getMainItem(extraction);
  const archetype = mainItem.archetype;

  // Get required fields for this archetype
  const requiredFields = REQUIRED_FIELDS[archetype] || [];

  // Find fields that need follow-up
  const questionsNeeded: FollowUpQuestion[] = [];

  for (const field of requiredFields) {
    const confidence = mainItem.confidence[field];
    const value = getFieldValue(mainItem, field);

    // Need follow-up if:
    // 1. Value is null/empty AND confidence is low
    // 2. OR confidence is below threshold
    const needsFollowUp =
      (value === null || value === '' || (Array.isArray(value) && value.length === 0)) &&
      confidence < CONFIDENCE_THRESHOLD;

    if (needsFollowUp) {
      questionsNeeded.push({
        field,
        question: getQuestionForField(archetype, field),
        quickOptions: getQuickOptionsForField(archetype, field),
        priority: FIELD_PRIORITY[field],
      });
    }
  }

  // Sort by priority (ask most important first)
  questionsNeeded.sort((a, b) => a.priority - b.priority);

  console.log('[v2 FollowUp] Generated queue:', questionsNeeded.length, 'questions for', archetype);
  questionsNeeded.forEach((q) => console.log(`  - ${q.field}: "${q.question}"`));

  return {
    questions: questionsNeeded,
    currentIndex: 0,
    totalQuestions: questionsNeeded.length,
  };
}

/**
 * Get the next question from the queue
 */
export function getNextQuestion(queue: FollowUpQueue): FollowUpQuestion | null {
  if (queue.currentIndex >= queue.questions.length) {
    return null;
  }
  return queue.questions[queue.currentIndex];
}

/**
 * Advance to the next question
 */
export function advanceQueue(queue: FollowUpQueue): FollowUpQueue {
  return {
    ...queue,
    currentIndex: queue.currentIndex + 1,
  };
}

/**
 * Check if all questions have been answered
 */
export function isQueueComplete(queue: FollowUpQueue): boolean {
  return queue.currentIndex >= queue.questions.length;
}

/**
 * Get field value from extraction
 */
function getFieldValue(extraction: UniversalExtraction, field: keyof ConfidenceScores): string | string[] | null {
  switch (field) {
    case 'base_food':
      return extraction.base_food;
    case 'portion':
      return extraction.portion;
    case 'protein':
      return extraction.protein;
    case 'sauce_or_dressing':
      return extraction.sauce_or_dressing;
    case 'cooking_method':
      return extraction.cooking_method;
    case 'extras':
      return extraction.extras;
    default:
      return null;
  }
}

// ============================================================================
// CONTEXT SERIALIZATION
// ============================================================================

/**
 * Serialize follow-up state for storage/transfer
 * Used to persist state between API calls
 */
export interface SerializedFollowUpState {
  extraction: UniversalExtraction;
  queue: FollowUpQueue;
  answeredFields: Record<string, string>;
}

export function serializeState(
  extraction: UniversalExtraction,
  queue: FollowUpQueue,
  answeredFields: Record<string, string> = {}
): string {
  const state: SerializedFollowUpState = {
    extraction,
    queue,
    answeredFields,
  };
  return JSON.stringify(state);
}

export function deserializeState(serialized: string): SerializedFollowUpState | null {
  try {
    return JSON.parse(serialized);
  } catch {
    return null;
  }
}

// ============================================================================
// FOLLOW-UP CONTEXT PARSING
// ============================================================================

/**
 * Parse follow-up context string to extract the answer
 * Context format: "User was asked: \"...\" and answered: \"...\""
 */
export function parseFollowUpContext(context: string): { question: string; answer: string } | null {
  const match = context.match(/User was asked: "(.+?)" and answered: "(.+?)"/);
  if (match) {
    return {
      question: match[1],
      answer: match[2],
    };
  }
  return null;
}

/**
 * Determine which field a question was about based on the question text
 */
export function getFieldFromQuestion(
  question: string,
  _archetype: MealArchetype
): keyof ConfidenceScores | null {
  const lowerQuestion = question.toLowerCase();

  // Check for portion-related questions
  if (
    lowerQuestion.includes('how much') ||
    lowerQuestion.includes('how big') ||
    lowerQuestion.includes('what size') ||
    lowerQuestion.includes('portion')
  ) {
    return 'portion';
  }

  // Check for protein-related questions
  if (
    lowerQuestion.includes('protein') ||
    lowerQuestion.includes('meat') ||
    lowerQuestion.includes('chicken') ||
    lowerQuestion.includes('beef')
  ) {
    return 'protein';
  }

  // Check for sauce/dressing questions
  if (
    lowerQuestion.includes('sauce') ||
    lowerQuestion.includes('dressing') ||
    lowerQuestion.includes('topping')
  ) {
    return 'sauce_or_dressing';
  }

  // Check for cooking method questions
  if (
    lowerQuestion.includes('cooked') ||
    lowerQuestion.includes('prepared') ||
    lowerQuestion.includes('how was')
  ) {
    return 'cooking_method';
  }

  // Check for base food questions
  if (
    lowerQuestion.includes('what was') ||
    lowerQuestion.includes('main food') ||
    lowerQuestion.includes('type of')
  ) {
    return 'base_food';
  }

  // Check for extras
  if (lowerQuestion.includes('extra') || lowerQuestion.includes('add-on')) {
    return 'extras';
  }

  return null;
}
