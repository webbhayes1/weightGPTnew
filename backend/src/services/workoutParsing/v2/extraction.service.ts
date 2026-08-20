/**
 * Workout Extraction Service
 * v2 Workout Parsing System
 *
 * Single AI call to extract archetype + structured attributes.
 * No multi-turn Q&A - follow-ups handled deterministically.
 */

import OpenAI from 'openai';
import { z } from 'zod';
import {
  WorkoutArchetype,
  UniversalWorkoutExtraction,
  ConfidenceScores,
} from './archetypes';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  timeout: parseInt(process.env.OPENAI_TIMEOUT || '30000'),
  maxRetries: parseInt(process.env.OPENAI_MAX_RETRIES || '2'),
});

// ============================================================================
// ZOD SCHEMAS FOR VALIDATION
// ============================================================================

const ExerciseSchema = z.object({
  name: z.string(),
  sets: z.number().optional(),
  reps: z.number().optional(),
  weight: z.number().optional(),
  weightUnit: z.enum(['lbs', 'kg']).optional(),
  durationMin: z.number().optional(),
});

const ConfidenceSchema = z.object({
  workout_type: z.number().min(0).max(1),
  duration: z.number().min(0).max(1),
  intensity: z.number().min(0).max(1),
  distance: z.number().min(0).max(1),
  exercises: z.number().min(0).max(1),
});

const ExtractionSchema = z.object({
  archetype: z.enum([
    'RUNNING', 'CYCLING', 'SWIMMING', 'WALKING', 'STRENGTH',
    'HIIT', 'YOGA_STRETCH', 'SPORTS', 'CARDIO_MACHINE', 'OTHER'
  ]),
  workout_name: z.string().nullable(),
  duration_minutes: z.number().nullable(),
  intensity: z.enum(['easy', 'moderate', 'hard']).nullable(),
  distance: z.number().nullable(),
  distance_unit: z.enum(['miles', 'km', 'meters']).nullable(),
  exercises: z.array(ExerciseSchema),
  location: z.string().nullable(),
  confidence: ConfidenceSchema,
});

// ============================================================================
// EXTRACTION PROMPT
// ============================================================================

const EXTRACTION_PROMPT = `You are a fitness AI. Extract workout information into structured data.

**ARCHETYPES (choose the best match):**
- RUNNING: Run, jog, sprint, track
- CYCLING: Bike, spin, cycling
- SWIMMING: Swim, laps, pool
- WALKING: Walk, hike, steps
- STRENGTH: Weights, gym, lifting, resistance training
- HIIT: HIIT, intervals, circuit training, Crossfit
- YOGA_STRETCH: Yoga, stretching, pilates, flexibility
- SPORTS: Basketball, soccer, tennis, golf, etc.
- CARDIO_MACHINE: Elliptical, rowing, stairmaster, treadmill
- OTHER: General workout, exercise

**INTENSITY LEVELS:**
- easy: Light effort, can hold conversation easily
- moderate: Breathing harder, can talk in short sentences
- hard: Pushing limits, difficult to talk

**OUTPUT JSON:**
{
  "archetype": "RUNNING" | "CYCLING" | etc.,
  "workout_name": "Morning run" | null,
  "duration_minutes": number | null,
  "intensity": "easy" | "moderate" | "hard" | null,
  "distance": number | null,
  "distance_unit": "miles" | "km" | "meters" | null,
  "exercises": [{"name": "string", "sets": N, "reps": N, "weight": N, "weightUnit": "lbs"|"kg"}],
  "location": "gym" | "home" | "outdoor" | null,
  "confidence": {
    "workout_type": 0.0-1.0,
    "duration": 0.0-1.0,
    "intensity": 0.0-1.0,
    "distance": 0.0-1.0,
    "exercises": 0.0-1.0
  }
}

**CONFIDENCE SCORING:**
- 1.0: Explicitly stated
- 0.7-0.9: Strongly implied
- 0.4-0.6: Weakly implied
- 0.0-0.3: Missing or guessed

**EXAMPLES:**
Input: "ran 3 miles"
→ archetype: RUNNING, duration: 30 (estimated), distance: 3, distance_unit: miles
→ confidence: {workout_type: 1.0, duration: 0.3, intensity: 0.3, distance: 1.0, exercises: 1.0}

Input: "went to the gym"
→ archetype: STRENGTH, duration: null, intensity: null
→ confidence: {workout_type: 0.7, duration: 0.0, intensity: 0.0, distance: 1.0, exercises: 0.0}

Input: "did yoga for 45 minutes"
→ archetype: YOGA_STRETCH, duration: 45, intensity: null
→ confidence: {workout_type: 1.0, duration: 1.0, intensity: 0.3, distance: 1.0, exercises: 1.0}

**IMPORTANT:** Return ONLY valid JSON.`;

// ============================================================================
// EXTRACTION FUNCTION
// ============================================================================

/**
 * Extract workout data from user input
 */
export async function extractWorkoutData(input: string): Promise<UniversalWorkoutExtraction> {
  console.log('[v2 Workout Extraction] Input:', input);

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: EXTRACTION_PROMPT },
        { role: 'user', content: input },
      ],
      temperature: 0.2,
      max_tokens: 600,
      response_format: { type: 'json_object' },
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from OpenAI');
    }

    const parsed = JSON.parse(content);
    const validated = ExtractionSchema.parse(parsed);

    console.log('[v2 Workout Extraction] Result:', validated.archetype);
    return validated as UniversalWorkoutExtraction;
  } catch (error) {
    console.error('[v2 Workout Extraction] Error:', error);

    // Return fallback extraction
    return createFallbackExtraction(input);
  }
}

/**
 * Create a fallback extraction for error cases
 */
function createFallbackExtraction(input: string): UniversalWorkoutExtraction {
  // Try to detect archetype from keywords
  const lowerInput = input.toLowerCase();
  let archetype: WorkoutArchetype = 'OTHER';

  if (lowerInput.includes('run') || lowerInput.includes('jog')) {
    archetype = 'RUNNING';
  } else if (lowerInput.includes('bike') || lowerInput.includes('cycl')) {
    archetype = 'CYCLING';
  } else if (lowerInput.includes('swim')) {
    archetype = 'SWIMMING';
  } else if (lowerInput.includes('walk') || lowerInput.includes('hike')) {
    archetype = 'WALKING';
  } else if (lowerInput.includes('gym') || lowerInput.includes('lift') || lowerInput.includes('weight')) {
    archetype = 'STRENGTH';
  } else if (lowerInput.includes('hiit') || lowerInput.includes('circuit') || lowerInput.includes('interval')) {
    archetype = 'HIIT';
  } else if (lowerInput.includes('yoga') || lowerInput.includes('stretch')) {
    archetype = 'YOGA_STRETCH';
  }

  return {
    archetype,
    workout_name: null,
    duration_minutes: null,
    intensity: null,
    distance: null,
    distance_unit: null,
    exercises: [],
    location: null,
    confidence: {
      workout_type: 0.5,
      duration: 0.0,
      intensity: 0.0,
      distance: 0.0,
      exercises: 0.0,
    },
  };
}

// ============================================================================
// APPLY FOLLOW-UP ANSWER
// ============================================================================

/**
 * Apply a follow-up answer to the extraction
 */
export function applyFollowUpToExtraction(
  extraction: UniversalWorkoutExtraction,
  field: keyof ConfidenceScores,
  answer: string
): UniversalWorkoutExtraction {
  const updated = { ...extraction, confidence: { ...extraction.confidence } };

  switch (field) {
    case 'duration':
      updated.duration_minutes = parseDuration(answer);
      updated.confidence.duration = 1.0;
      break;

    case 'intensity':
      updated.intensity = parseIntensity(answer);
      updated.confidence.intensity = 1.0;
      break;

    case 'distance':
      const { distance, unit } = parseDistance(answer);
      updated.distance = distance;
      updated.distance_unit = unit;
      updated.confidence.distance = 1.0;
      break;

    case 'exercises':
      // For exercise follow-up, we update the archetype or add context
      updated.confidence.exercises = 1.0;
      break;

    case 'workout_type':
      // Update archetype based on answer
      updated.archetype = parseWorkoutType(answer);
      updated.confidence.workout_type = 1.0;
      break;
  }

  console.log('[v2 Workout Extraction] Applied answer for', field, ':', answer);
  return updated;
}

/**
 * Parse duration from user answer
 */
function parseDuration(answer: string): number | null {
  const lower = answer.toLowerCase();

  // Try to extract number
  const match = lower.match(/(\d+(?:\.\d+)?)\s*(min|minute|hour|hr)?/);
  if (match) {
    let value = parseFloat(match[1]);
    const unit = match[2];

    if (unit && (unit.startsWith('hour') || unit === 'hr')) {
      value *= 60;
    }

    return Math.round(value);
  }

  // Try common phrases
  if (lower.includes('15 min')) return 15;
  if (lower.includes('20 min')) return 20;
  if (lower.includes('30 min')) return 30;
  if (lower.includes('45 min')) return 45;
  if (lower.includes('1 hour') || lower.includes('an hour')) return 60;
  if (lower.includes('1.5 hour')) return 90;

  return null;
}

/**
 * Parse intensity from user answer
 */
function parseIntensity(answer: string): 'easy' | 'moderate' | 'hard' | null {
  const lower = answer.toLowerCase();

  if (lower.includes('easy') || lower.includes('light') || lower.includes('casual') ||
      lower.includes('gentle') || lower.includes('slow')) {
    return 'easy';
  }

  if (lower.includes('hard') || lower.includes('intense') || lower.includes('fast') ||
      lower.includes('all out') || lower.includes('competitive') || lower.includes('race')) {
    return 'hard';
  }

  if (lower.includes('moderate') || lower.includes('medium') || lower.includes('brisk')) {
    return 'moderate';
  }

  return 'moderate'; // Default
}

/**
 * Parse distance from user answer
 */
function parseDistance(answer: string): { distance: number | null; unit: 'miles' | 'km' | 'meters' | null } {
  const lower = answer.toLowerCase();

  const match = lower.match(/(\d+(?:\.\d+)?)\s*(miles?|mi|km|kilometers?|meters?|m)?/);
  if (match) {
    const distance = parseFloat(match[1]);
    const unitStr = match[2] || '';

    let unit: 'miles' | 'km' | 'meters' | null = null;
    if (unitStr.startsWith('mi')) unit = 'miles';
    else if (unitStr.startsWith('km') || unitStr.startsWith('kilo')) unit = 'km';
    else if (unitStr.startsWith('m')) unit = 'meters';
    else unit = 'miles'; // Default to miles

    return { distance, unit };
  }

  return { distance: null, unit: null };
}

/**
 * Parse workout type from user answer
 */
function parseWorkoutType(answer: string): WorkoutArchetype {
  const lower = answer.toLowerCase();

  if (lower.includes('run') || lower.includes('jog')) return 'RUNNING';
  if (lower.includes('bike') || lower.includes('cycl') || lower.includes('spin')) return 'CYCLING';
  if (lower.includes('swim')) return 'SWIMMING';
  if (lower.includes('walk') || lower.includes('hike')) return 'WALKING';
  if (lower.includes('strength') || lower.includes('lift') || lower.includes('weight') || lower.includes('gym')) return 'STRENGTH';
  if (lower.includes('hiit') || lower.includes('circuit') || lower.includes('interval')) return 'HIIT';
  if (lower.includes('yoga') || lower.includes('stretch') || lower.includes('pilates')) return 'YOGA_STRETCH';
  if (lower.includes('elliptical') || lower.includes('row') || lower.includes('stair')) return 'CARDIO_MACHINE';

  return 'OTHER';
}
