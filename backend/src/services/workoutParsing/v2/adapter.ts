/**
 * Response Adapter for v2 Workout Parsing
 *
 * Converts new UniversalWorkoutExtraction schema to frontend-compatible format
 * for seamless transition.
 */

import {
  UniversalWorkoutExtraction,
  ConfidenceScores,
  calculateCaloriesBurned,
} from './archetypes';
import { FollowUpQuestion } from './followUp.service';

// ============================================================================
// FRONTEND RESPONSE TYPES
// ============================================================================

export interface WorkoutParseResponse {
  workoutType: string;
  workoutName: string | null;
  duration: number | null;
  intensity: 'easy' | 'moderate' | 'hard' | null;
  distance: number | null;
  distanceUnit: 'miles' | 'km' | 'meters' | null;
  caloriesBurned: number | null;
  exercises: ParsedExercise[];
  confidence: 'high' | 'medium' | 'low';
  followUpNeeded: boolean;
  followUpType: string | null;
  followUpQuestion: string | null;
  quickOptions: string[] | null;
}

export interface ParsedExercise {
  name: string;
  sets?: number;
  reps?: number;
  weight?: number;
  weightUnit?: 'lbs' | 'kg';
  durationMin?: number;
}

// ============================================================================
// FOLLOW-UP TYPE MAPPING
// ============================================================================

// Map our field names to frontend follow-up types
const FIELD_TO_FOLLOWUP_TYPE: Record<keyof ConfidenceScores, string> = {
  workout_type: 'type',
  duration: 'duration',
  intensity: 'intensity',
  distance: 'distance',
  exercises: 'exercises',
};

// ============================================================================
// ADAPTER FUNCTIONS
// ============================================================================

/**
 * Create a follow-up response (workout not fully parsed yet)
 */
export function createFollowUpResponse(
  extraction: UniversalWorkoutExtraction,
  question: FollowUpQuestion
): WorkoutParseResponse {
  return {
    workoutType: extraction.archetype,
    workoutName: extraction.workout_name,
    duration: extraction.duration_minutes,
    intensity: extraction.intensity,
    distance: extraction.distance,
    distanceUnit: extraction.distance_unit,
    caloriesBurned: null, // Don't calculate yet
    exercises: extraction.exercises.map(e => ({
      name: e.name,
      sets: e.sets ?? undefined,
      reps: e.reps ?? undefined,
      weight: e.weight ?? undefined,
      weightUnit: e.weightUnit ?? undefined,
      durationMin: e.durationMin ?? undefined,
    })),
    confidence: 'medium',
    followUpNeeded: true,
    followUpType: FIELD_TO_FOLLOWUP_TYPE[question.field] || 'clarification',
    followUpQuestion: question.question,
    quickOptions: question.quickOptions,
  };
}

/**
 * Create a complete response (all follow-ups answered)
 */
export function createCompleteResponse(
  extraction: UniversalWorkoutExtraction,
  userWeightLbs: number = 160 // Default weight for calorie calculation
): WorkoutParseResponse {
  // Calculate calories if we have duration
  let caloriesBurned: number | null = null;
  if (extraction.duration_minutes) {
    caloriesBurned = calculateCaloriesBurned(
      extraction.archetype,
      extraction.intensity || 'moderate',
      extraction.duration_minutes,
      userWeightLbs
    );
  }

  // Determine confidence
  const confidence = determineConfidence(extraction);

  return {
    workoutType: extraction.archetype,
    workoutName: extraction.workout_name,
    duration: extraction.duration_minutes,
    intensity: extraction.intensity,
    distance: extraction.distance,
    distanceUnit: extraction.distance_unit,
    caloriesBurned,
    exercises: extraction.exercises.map(e => ({
      name: e.name,
      sets: e.sets ?? undefined,
      reps: e.reps ?? undefined,
      weight: e.weight ?? undefined,
      weightUnit: e.weightUnit ?? undefined,
      durationMin: e.durationMin ?? undefined,
    })),
    confidence,
    followUpNeeded: false,
    followUpType: null,
    followUpQuestion: null,
    quickOptions: null,
  };
}

/**
 * Determine confidence level from extraction
 */
function determineConfidence(extraction: UniversalWorkoutExtraction): 'high' | 'medium' | 'low' {
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
export function createErrorResponse(error?: string): WorkoutParseResponse {
  console.error('[v2 Workout Adapter] Creating error response:', error);

  return {
    workoutType: 'OTHER',
    workoutName: null,
    duration: null,
    intensity: null,
    distance: null,
    distanceUnit: null,
    caloriesBurned: null,
    exercises: [],
    confidence: 'low',
    followUpNeeded: false,
    followUpType: null,
    followUpQuestion: null,
    quickOptions: null,
  };
}

/**
 * Format workout for display
 */
export function formatWorkoutSummary(extraction: UniversalWorkoutExtraction): string {
  const parts: string[] = [];

  // Add workout name or type
  if (extraction.workout_name) {
    parts.push(extraction.workout_name);
  } else {
    parts.push(formatArchetype(extraction.archetype));
  }

  // Add duration
  if (extraction.duration_minutes) {
    parts.push(`${extraction.duration_minutes} min`);
  }

  // Add intensity
  if (extraction.intensity) {
    parts.push(extraction.intensity);
  }

  // Add distance for cardio
  if (extraction.distance && extraction.distance_unit) {
    parts.push(`${extraction.distance} ${extraction.distance_unit}`);
  }

  return parts.join(' • ');
}

/**
 * Format archetype for display
 */
function formatArchetype(archetype: string): string {
  const displayNames: Record<string, string> = {
    RUNNING: 'Running',
    CYCLING: 'Cycling',
    SWIMMING: 'Swimming',
    WALKING: 'Walking',
    STRENGTH: 'Strength Training',
    HIIT: 'HIIT',
    YOGA_STRETCH: 'Yoga/Stretching',
    SPORTS: 'Sports',
    CARDIO_MACHINE: 'Cardio Machine',
    OTHER: 'Workout',
  };

  return displayNames[archetype] || 'Workout';
}
