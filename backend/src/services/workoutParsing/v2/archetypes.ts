/**
 * Universal Workout Archetypes & Schema
 * v2 Workout Parsing System
 *
 * Every workout maps to one of 8 universal archetypes.
 * Same extraction schema works for ALL workouts.
 */

// ============================================================================
// ARCHETYPES
// ============================================================================

export type WorkoutArchetype =
  | 'RUNNING'          // Run, jog, sprint
  | 'CYCLING'          // Bike, spin, cycling
  | 'SWIMMING'         // Swim, laps, pool
  | 'WALKING'          // Walk, hike, steps
  | 'STRENGTH'         // Weights, gym, lifting
  | 'HIIT'             // HIIT, circuit, intervals
  | 'YOGA_STRETCH'     // Yoga, stretching, pilates
  | 'SPORTS'           // Basketball, soccer, tennis, etc.
  | 'CARDIO_MACHINE'   // Elliptical, rowing, stairmaster
  | 'OTHER';           // General workout, exercise

// ============================================================================
// UNIVERSAL EXTRACTION SCHEMA
// ============================================================================

export interface ConfidenceScores {
  workout_type: number;   // 0-1 confidence
  duration: number;
  intensity: number;
  distance: number;
  exercises: number;
}

export interface ExtractedExercise {
  name: string;
  sets?: number;
  reps?: number;
  weight?: number;
  weightUnit?: 'lbs' | 'kg';
  durationMin?: number;
}

export interface UniversalWorkoutExtraction {
  archetype: WorkoutArchetype;
  workout_name: string | null;           // "Morning run", "Leg day", etc.
  duration_minutes: number | null;       // How long
  intensity: 'easy' | 'moderate' | 'hard' | null;
  distance: number | null;               // For cardio (miles/km)
  distance_unit: 'miles' | 'km' | 'meters' | null;
  exercises: ExtractedExercise[];        // For strength workouts
  location: string | null;               // "gym", "home", "outdoor", etc.
  confidence: ConfidenceScores;
}

// ============================================================================
// REQUIRED FIELDS PER ARCHETYPE
// ============================================================================

// Only these fields trigger follow-ups when missing/low-confidence
// Note: For cardio, we ask for distance OR duration (not both required)
export const REQUIRED_FIELDS: Record<WorkoutArchetype, (keyof ConfidenceScores)[]> = {
  RUNNING: ['distance', 'intensity'],      // Distance is primary for running
  CYCLING: ['distance', 'intensity'],      // Distance is primary for cycling
  SWIMMING: ['duration', 'intensity'],     // Duration more common for swimming
  WALKING: ['distance'],                   // Distance is primary for walking
  STRENGTH: ['duration', 'exercises'],
  HIIT: ['duration', 'intensity'],
  YOGA_STRETCH: ['duration'],
  SPORTS: ['duration', 'intensity'],
  CARDIO_MACHINE: ['duration', 'intensity'],
  OTHER: ['duration', 'intensity'],
};

// ============================================================================
// QUICK OPTIONS PER ARCHETYPE + FIELD
// ============================================================================

type QuickOptionsMap = Record<WorkoutArchetype, Partial<Record<keyof ConfidenceScores, string[]>>>;

export const QUICK_OPTIONS: QuickOptionsMap = {
  RUNNING: {
    distance: ['1 mile', '2 miles', '3 miles', '5 miles', '10K'],
    duration: ['15 minutes', '30 minutes', '45 minutes', '1 hour'],
    intensity: ['Easy jog', 'Moderate pace', 'Hard/fast run'],
  },

  CYCLING: {
    distance: ['5 miles', '10 miles', '15 miles', '25 miles', '50 miles'],
    duration: ['20 minutes', '30 minutes', '45 minutes', '1 hour', '1.5 hours'],
    intensity: ['Easy ride', 'Moderate effort', 'Hard/intense'],
  },

  SWIMMING: {
    duration: ['15 minutes', '30 minutes', '45 minutes', '1 hour'],
    intensity: ['Easy laps', 'Moderate pace', 'Hard/race pace'],
  },

  WALKING: {
    distance: ['0.5 miles', '1 mile', '2 miles', '3 miles', '5 miles'],
    duration: ['15 minutes', '30 minutes', '45 minutes', '1 hour'],
    intensity: ['Casual stroll', 'Brisk walk', 'Power walk/hike'],
  },

  STRENGTH: {
    duration: ['30 minutes', '45 minutes', '1 hour', '1.5 hours'],
    exercises: ['Upper body', 'Lower body', 'Full body', 'Core/abs'],
  },

  HIIT: {
    duration: ['15 minutes', '20 minutes', '30 minutes', '45 minutes'],
    intensity: ['Moderate intervals', 'High intensity', 'All out'],
  },

  YOGA_STRETCH: {
    duration: ['15 minutes', '30 minutes', '45 minutes', '1 hour'],
    intensity: ['Gentle/restorative', 'Moderate flow', 'Power yoga'],
  },

  SPORTS: {
    duration: ['30 minutes', '45 minutes', '1 hour', '1.5 hours', '2 hours'],
    intensity: ['Casual/recreational', 'Moderate effort', 'Competitive/intense'],
  },

  CARDIO_MACHINE: {
    duration: ['15 minutes', '20 minutes', '30 minutes', '45 minutes', '1 hour'],
    intensity: ['Easy pace', 'Moderate effort', 'Hard/intense'],
  },

  OTHER: {
    duration: ['15 minutes', '30 minutes', '45 minutes', '1 hour'],
    intensity: ['Light activity', 'Moderate effort', 'Hard/intense'],
  },
};

// ============================================================================
// FIELD DISPLAY NAMES (for follow-up questions)
// ============================================================================

export const FIELD_QUESTIONS: Record<keyof ConfidenceScores, string> = {
  workout_type: 'What type of workout was it?',
  duration: 'How long was your workout?',
  intensity: 'How intense was it?',
  distance: 'How far did you go?',
  exercises: 'What exercises did you do?',
};

// Archetype-specific question overrides
export const ARCHETYPE_QUESTIONS: Partial<Record<WorkoutArchetype, Partial<Record<keyof ConfidenceScores, string>>>> = {
  RUNNING: {
    duration: 'How long was your run?',
    intensity: 'What was your pace?',
  },
  CYCLING: {
    duration: 'How long was your ride?',
    intensity: 'How hard did you push?',
  },
  SWIMMING: {
    duration: 'How long did you swim?',
    intensity: 'What was your pace?',
  },
  STRENGTH: {
    duration: 'How long was your lifting session?',
    exercises: 'What muscle groups did you work?',
  },
  HIIT: {
    duration: 'How long was your HIIT session?',
    intensity: 'How intense were the intervals?',
  },
  YOGA_STRETCH: {
    duration: 'How long was your practice?',
  },
};

// ============================================================================
// CONFIDENCE THRESHOLD
// ============================================================================

export const CONFIDENCE_THRESHOLD = 0.7; // Below this = needs follow-up

// ============================================================================
// MET VALUES FOR CALORIE CALCULATION
// ============================================================================

export const MET_VALUES: Record<WorkoutArchetype, Record<string, number>> = {
  RUNNING: { easy: 6.0, moderate: 9.8, hard: 12.3 },
  CYCLING: { easy: 4.0, moderate: 8.0, hard: 12.0 },
  SWIMMING: { easy: 5.0, moderate: 7.0, hard: 10.0 },
  WALKING: { easy: 2.5, moderate: 3.5, hard: 5.0 },
  STRENGTH: { easy: 3.5, moderate: 5.0, hard: 6.0 },
  HIIT: { easy: 6.0, moderate: 8.0, hard: 12.0 },
  YOGA_STRETCH: { easy: 2.5, moderate: 3.0, hard: 4.0 },
  SPORTS: { easy: 5.0, moderate: 7.0, hard: 10.0 },
  CARDIO_MACHINE: { easy: 4.0, moderate: 6.0, hard: 9.0 },
  OTHER: { easy: 3.5, moderate: 5.0, hard: 7.0 },
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get question text for a field
 */
export function getQuestionForField(archetype: WorkoutArchetype, field: keyof ConfidenceScores): string {
  const archetypeOverride = ARCHETYPE_QUESTIONS[archetype]?.[field];
  if (archetypeOverride) return archetypeOverride;
  return FIELD_QUESTIONS[field];
}

/**
 * Get quick options for a field
 */
export function getQuickOptionsForField(archetype: WorkoutArchetype, field: keyof ConfidenceScores): string[] {
  return QUICK_OPTIONS[archetype]?.[field] || [];
}

/**
 * Calculate calories burned using MET values
 */
export function calculateCaloriesBurned(
  archetype: WorkoutArchetype,
  intensity: 'easy' | 'moderate' | 'hard',
  durationMinutes: number,
  weightLbs: number
): number {
  const weightKg = weightLbs * 0.453592;
  const metValues = MET_VALUES[archetype] || MET_VALUES.OTHER;
  const met = metValues[intensity] || metValues.moderate;

  // Calories = MET × weight (kg) × time (hours)
  return Math.round(met * weightKg * (durationMinutes / 60));
}
