/**
 * Deterministic Follow-Up Engine
 * v2 Workout Parsing System
 *
 * No AI calls - pure logic based on archetype + missing/low-confidence fields.
 * Returns a queue of follow-up questions to ask one at a time.
 */

import {
  UniversalWorkoutExtraction,
  ConfidenceScores,
  REQUIRED_FIELDS,
  CONFIDENCE_THRESHOLD,
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
  workout_type: 1,
  duration: 2,
  intensity: 3,
  distance: 4,
  exercises: 5,
};

// ============================================================================
// FOLLOW-UP GENERATION
// ============================================================================

/**
 * Generate a queue of follow-up questions based on extraction
 */
export function generateFollowUpQueue(extraction: UniversalWorkoutExtraction): FollowUpQueue {
  const archetype = extraction.archetype;

  // Get required fields for this archetype
  const requiredFields = REQUIRED_FIELDS[archetype] || [];

  // Find fields that need follow-up
  const questionsNeeded: FollowUpQuestion[] = [];

  for (const field of requiredFields) {
    const confidence = extraction.confidence[field];
    const value = getFieldValue(extraction, field);

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

  console.log('[v2 Workout FollowUp] Generated queue:', questionsNeeded.length, 'questions for', archetype);
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
function getFieldValue(
  extraction: UniversalWorkoutExtraction,
  field: keyof ConfidenceScores
): string | number | object[] | null {
  switch (field) {
    case 'workout_type':
      return extraction.archetype;
    case 'duration':
      return extraction.duration_minutes;
    case 'intensity':
      return extraction.intensity;
    case 'distance':
      return extraction.distance;
    case 'exercises':
      return extraction.exercises;
    default:
      return null;
  }
}

// ============================================================================
// CONTEXT SERIALIZATION
// ============================================================================

/**
 * Serialize follow-up state for storage/transfer
 */
export interface SerializedFollowUpState {
  extraction: UniversalWorkoutExtraction;
  queue: FollowUpQueue;
  answeredFields: Record<string, string>;
}

export function serializeState(
  extraction: UniversalWorkoutExtraction,
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
export function getFieldFromQuestion(question: string): keyof ConfidenceScores | null {
  const lowerQuestion = question.toLowerCase();

  // Check for duration-related questions
  if (
    lowerQuestion.includes('how long') ||
    lowerQuestion.includes('duration') ||
    lowerQuestion.includes('minutes') ||
    lowerQuestion.includes('time')
  ) {
    return 'duration';
  }

  // Check for intensity-related questions
  if (
    lowerQuestion.includes('intensity') ||
    lowerQuestion.includes('how hard') ||
    lowerQuestion.includes('effort') ||
    lowerQuestion.includes('pace')
  ) {
    return 'intensity';
  }

  // Check for distance-related questions
  if (
    lowerQuestion.includes('distance') ||
    lowerQuestion.includes('how far') ||
    lowerQuestion.includes('miles') ||
    lowerQuestion.includes('km')
  ) {
    return 'distance';
  }

  // Check for exercise-related questions
  if (
    lowerQuestion.includes('exercise') ||
    lowerQuestion.includes('what did you do') ||
    lowerQuestion.includes('which muscles')
  ) {
    return 'exercises';
  }

  // Check for workout type questions
  if (
    lowerQuestion.includes('type of workout') ||
    lowerQuestion.includes('what kind') ||
    lowerQuestion.includes('what workout')
  ) {
    return 'workout_type';
  }

  return null;
}
