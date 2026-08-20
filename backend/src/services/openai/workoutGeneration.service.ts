/**
 * Workout Generation Service
 * OpenAI-powered workout plan and exercise generation
 * Mirrors mealGeneration.service.ts pattern for workouts
 */

import OpenAI from 'openai';
import { PrismaClient, FitnessLevel, WorkoutCategory } from '@prisma/client';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const prisma = new PrismaClient();

/**
 * Auto-expire old workout plans (Phase-1 Hybrid Logic)
 * Marks workout plans as 'past' if their weekEndDate has passed
 */
export async function autoExpireOldWorkoutPlans(userId: string): Promise<void> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  await prisma.workoutPlan.updateMany({
    where: {
      userId,
      status: 'active',
      weekEndDate: {
        lt: today,
      },
    },
    data: {
      status: 'past',
    },
  });
}

/**
 * Generate a weekly workout plan using OpenAI
 * Respects user's workout frequency and preferred days
 */
export async function generateWeeklyWorkoutPlan(userId: string) {
  // Fetch user profile
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error('User not found');
  }

  const workoutFrequency = user.workoutFrequency; // Days per week
  // @ts-ignore - preferredWorkoutDays exists in schema but may not be in generated types yet
  const preferredDays = (user.preferredWorkoutDays || []) as number[]; // Array of day numbers (0=Sunday, 1=Monday, etc.)
  const workoutDuration = user.workoutDuration || 30; // Default to 30 minutes if not set
  const fitnessLevel = user.fitnessLevel;
  const goal = user.goal;
  const availableEquipment = user.availableEquipment as string[];

  // Build fitness level description
  const levelDescription = {
    beginner: 'New to fitness, focus on form and foundational movements',
    intermediate: 'Some fitness experience, can handle moderate intensity',
    advanced: 'Experienced athlete, can handle high intensity and complex movements',
  }[fitnessLevel];

  // Build goal description
  const goalDescription = {
    lose_weight: 'Weight loss with higher calorie burn, mix of cardio and strength',
    gain_weight: 'Muscle building with strength-focused workouts',
    maintain: 'Balanced mix of cardio and strength for maintenance',
  }[goal];

  // Build equipment context with strict restrictions
  const equipmentContext = availableEquipment.length > 0
    ? `AVAILABLE EQUIPMENT (STRICT): ${availableEquipment.join(', ')}. DO NOT suggest exercises requiring any other equipment.`
    : 'NO EQUIPMENT AVAILABLE - BODYWEIGHT EXERCISES ONLY. Do not suggest any exercises that require dumbbells, barbells, machines, or any equipment.';

  // Determine which days should have workouts
  const workoutDays = preferredDays.length > 0 && preferredDays.length === workoutFrequency
    ? preferredDays
    : generateOptimalWorkoutDays(workoutFrequency);

  // Create workout schedule description
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const scheduledDayNames = workoutDays.map(d => dayNames[d]).join(', ');

  const prompt = `You are a certified personal trainer creating a weekly workout plan.

**USER PROFILE:**
- Fitness Goal: ${goal.replace('_', ' ')}
- Fitness Level: ${fitnessLevel}
- Workout Frequency: ${workoutFrequency} days per week
- Scheduled Days: ${scheduledDayNames}
- ${equipmentContext}

**WORKOUT PHILOSOPHY:**
- ${levelDescription}
- ${goalDescription}

**CRITICAL REQUIREMENTS:**
1. Generate EXACTLY ${workoutFrequency} workouts total for the week
2. Assign workouts to these specific days: ${JSON.stringify(workoutDays)} (0=Sunday, 1=Monday, etc.)
3. Each workout must include: name, type (strength/cardio), workoutCategory, dayOfWeek, durationMin, estimatedCalories
4. DO NOT include exercises yet (those will be generated separately)
5. Balance workout types based on goal:
   - Lose weight: 60% cardio, 40% strength
   - Gain weight: 80% strength, 20% cardio
   - Maintain: 50% cardio, 50% strength
6. Distribute across muscle groups:
   - Upper body, lower body, full body, core
   - Never hit same muscle group on consecutive days
7. Duration requirement:
   - ALL workouts must be EXACTLY ${workoutDuration} minutes (durationMin: ${workoutDuration})
   - Do not vary from this duration
8. Calorie burn estimates (for ${workoutDuration}-minute workouts):
   - Cardio: ${Math.round(workoutDuration * 8)}-${Math.round(workoutDuration * 12)} calories (8-12 cal/min × ${workoutDuration} min)
   - Strength: ${Math.round(workoutDuration * 5)}-${Math.round(workoutDuration * 8)} calories (5-8 cal/min × ${workoutDuration} min)

**WORKOUT CATEGORIES (choose appropriately):**
- upper_body, lower_body, full_body, core, cardio, hiit, flexibility

**OUTPUT FORMAT (JSON only, no markdown):**
{
  "workouts": [
    {
      "name": "string",
      "type": "strength" | "cardio",
      "workoutCategory": "upper_body" | "lower_body" | "full_body" | "core" | "cardio" | "hiit" | "flexibility",
      "dayOfWeek": number (0-6),
      "durationMin": number,
      "estimatedCalories": number
    }
  ]
}

Generate the workout plan now.`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      response_format: { type: 'json_object' },
    });

    const responseText = completion.choices[0].message.content;
    if (!responseText) {
      throw new Error('Empty response from OpenAI');
    }

    const parsedResponse = JSON.parse(responseText);
    const workouts = parsedResponse.workouts;

    // Validate we got the right number of workouts
    if (workouts.length !== workoutFrequency) {
      console.warn(`Expected ${workoutFrequency} workouts, got ${workouts.length}. Adjusting...`);
    }

    return { workouts };
  } catch (error) {
    console.error('Error generating workout plan:', error);
    throw error;
  }
}

/**
 * Generate optimal workout days when user hasn't specified preferences
 * Distributes workouts evenly throughout the week
 */
function generateOptimalWorkoutDays(frequency: number): number[] {
  // Common optimal schedules
  const schedules: { [key: number]: number[] } = {
    1: [1], // Monday
    2: [1, 4], // Monday, Thursday
    3: [1, 3, 5], // Monday, Wednesday, Friday
    4: [1, 2, 4, 5], // Monday, Tuesday, Thursday, Friday
    5: [1, 2, 3, 4, 5], // Monday-Friday
    6: [1, 2, 3, 4, 5, 6], // Monday-Saturday
    7: [0, 1, 2, 3, 4, 5, 6], // Every day
  };

  return schedules[frequency] || schedules[3]; // Default to 3 days if invalid
}

/**
 * Store a generated workout plan in the database
 */
export async function storeWorkoutPlan(
  userId: string,
  workouts: Array<{
    name: string;
    type: 'strength' | 'cardio';
    workoutCategory: string;
    dayOfWeek: number;
    durationMin: number;
    estimatedCalories: number;
  }>,
  weekStartDate: Date
): Promise<string> {
  // Calculate week end date (Sunday)
  const weekEndDate = new Date(weekStartDate);
  weekEndDate.setDate(weekEndDate.getDate() + 6);

  // Create workout plan
  const workoutPlan = await prisma.workoutPlan.create({
    data: {
      user: {
        connect: { id: userId },
      },
      weekStartDate,
      weekEndDate,
      status: 'active',
      workouts: {
        create: workouts.map((workout) => ({
          user: {
            connect: { id: userId },
          },
          name: workout.name,
          type: workout.type,
          workoutCategory: workout.workoutCategory as WorkoutCategory,
          dayOfWeek: workout.dayOfWeek,
          durationMin: workout.durationMin,
          estimatedCalories: workout.estimatedCalories,
          logged: false,
          isFavorite: false,
          isDisliked: false,
        })),
      },
    },
  });

  return workoutPlan.id;
}

/**
 * Filter exercises based on available equipment
 * Removes exercises that require equipment the user doesn't have
 */
function filterExercisesByEquipment(
  exercises: Array<{ name: string; equipment: string[]; [key: string]: unknown }>,
  availableEquipment: string[]
): Array<{ name: string; equipment: string[]; [key: string]: unknown }> {
  // Equipment aliases to handle variations
  const equipmentAliases: Record<string, string[]> = {
    'bodyweight': ['bodyweight', 'body weight', 'none', 'no equipment'],
    'dumbbells': ['dumbbells', 'dumbbell', 'dbs'],
    'resistance_bands': ['resistance_bands', 'resistance bands', 'bands', 'band'],
    'barbells': ['barbells', 'barbell', 'bar'],
    'machines': ['machines', 'machine', 'cable machine'],
    'cables': ['cables', 'cable'],
    'kettlebells': ['kettlebells', 'kettlebell', 'kb'],
    'full_gym': ['full_gym', 'gym'],
  };

  // Build a set of all acceptable equipment (including aliases)
  const acceptableEquipment = new Set<string>();

  // Always allow bodyweight exercises
  acceptableEquipment.add('bodyweight');
  acceptableEquipment.add('body weight');
  acceptableEquipment.add('none');
  acceptableEquipment.add('no equipment');

  for (const equip of availableEquipment) {
    const normalizedEquip = equip.toLowerCase().trim();
    acceptableEquipment.add(normalizedEquip);

    // Add all aliases for this equipment
    for (const [canonical, aliases] of Object.entries(equipmentAliases)) {
      if (normalizedEquip === canonical || aliases.includes(normalizedEquip)) {
        aliases.forEach(alias => acceptableEquipment.add(alias));
      }
    }

    // If full_gym, allow all equipment
    if (normalizedEquip === 'full_gym' || normalizedEquip === 'gym') {
      Object.values(equipmentAliases).forEach(aliases => {
        aliases.forEach(alias => acceptableEquipment.add(alias));
      });
    }
  }

  return exercises.filter(exercise => {
    const exerciseEquipment = exercise.equipment || [];

    // If no equipment required, always allow
    if (exerciseEquipment.length === 0) {
      return true;
    }

    // Check if all required equipment is available
    const allEquipmentAvailable = exerciseEquipment.every((equip: string) => {
      const normalizedEquip = equip.toLowerCase().trim();
      return acceptableEquipment.has(normalizedEquip);
    });

    if (!allEquipmentAvailable) {
      console.log(`[Workout] Filtering out exercise "${exercise.name}" - requires: [${exerciseEquipment.join(', ')}], available: [${availableEquipment.join(', ')}]`);
    }

    return allEquipmentAvailable;
  });
}

/**
 * Generate exercises for a specific workout using OpenAI
 * Called on-demand or in background after workout plan creation
 */
export async function generateWorkoutExercises(
  workoutId: string,
  workoutName: string,
  workoutType: 'strength' | 'cardio',
  workoutCategory: string,
  durationMin: number,
  fitnessLevel: FitnessLevel,
  availableEquipment: string[]
) {
  const equipmentContext = availableEquipment.length > 0
    ? `AVAILABLE EQUIPMENT (STRICT): ${availableEquipment.join(', ')}`
    : 'NO EQUIPMENT - BODYWEIGHT EXERCISES ONLY';

  // Build list of forbidden equipment for bodyweight users
  const forbiddenEquipment = availableEquipment.length === 0 || (availableEquipment.length === 1 && availableEquipment[0] === 'bodyweight')
    ? 'FORBIDDEN (not available): dumbbells, barbells, machines, cables, kettlebells, weight plates, benches, racks'
    : '';

  const prompt = `You are a certified personal trainer creating exercises for a specific workout.

**WORKOUT DETAILS:**
- Name: ${workoutName}
- Type: ${workoutType}
- Category: ${workoutCategory}
- Duration: ${durationMin} minutes
- Fitness Level: ${fitnessLevel}
- ${equipmentContext}
${forbiddenEquipment ? `- ${forbiddenEquipment}` : ''}

**CRITICAL EQUIPMENT RESTRICTIONS:**
- ONLY use exercises that require the equipment listed above
- If user has "bodyweight" only, ONLY use bodyweight exercises (push-ups, squats, lunges, planks, burpees, etc.)
- DO NOT suggest any exercise requiring equipment the user doesn't have
- Every exercise's "equipment" array must only contain items from the available list

**EXERCISE REQUIREMENTS:**
1. Generate 5-8 exercises for this ${durationMin}-minute workout
2. For STRENGTH workouts, include sets and reps (e.g., 3 sets of 10 reps) - **reps must be a single integer, not a range**
3. For CARDIO workouts, include duration in minutes (e.g., 5 min running)
4. Each exercise must include: name, sets (null for cardio), reps (null for cardio), durationMin (null for strength), equipment array, notes
5. STRICTLY use only equipment from the available list - any other equipment means the user CANNOT do the exercise
6. Progression should match fitness level:
   - Beginner: Focus on form, lower volume
   - Intermediate: Moderate volume, some advanced variations
   - Advanced: Higher volume, complex movements
7. For the workout category "${workoutCategory}", focus exercises on that area

**EQUIPMENT MAPPING:**
- If "dumbbells" available: can use for rows, curls, presses, etc.
- If "resistance bands" available: can use for pull-aparts, rows, presses
- If "bodyweight": push-ups, squats, lunges, planks, etc.

**OUTPUT FORMAT (JSON only, no markdown):**
{
  "exercises": [
    {
      "name": "string",
      "sets": number | null,
      "reps": number | null,
      "durationMin": number | null,
      "equipment": ["string"],
      "notes": "string (form cues, breathing, modifications)"
    }
  ]
}

IMPORTANT: reps must be a single number (e.g., 10), NOT a range (NOT "10-12")

Generate the exercises now.`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      response_format: { type: 'json_object' },
    });

    const responseText = completion.choices[0].message.content;
    if (!responseText) {
      throw new Error('Empty response from OpenAI');
    }

    const parsedResponse = JSON.parse(responseText);
    let exercises = parsedResponse.exercises;

    // Validate and filter exercises based on available equipment
    const validatedExercises = filterExercisesByEquipment(exercises, availableEquipment);

    if (validatedExercises.length < exercises.length) {
      console.log(`[Workout] Filtered ${exercises.length - validatedExercises.length} exercises due to equipment restrictions`);
    }

    exercises = validatedExercises;

    // Store exercises in database
    for (let i = 0; i < exercises.length; i++) {
      const exercise = exercises[i];

      // Parse reps to ensure it's a number (handle strings like "8-10", "10", etc.)
      let reps: number | null = null;
      if (exercise.reps !== null && exercise.reps !== undefined) {
        if (typeof exercise.reps === 'number') {
          reps = exercise.reps;
        } else if (typeof exercise.reps === 'string') {
          // Extract first number from string (e.g., "8-10" -> 8, "10" -> 10)
          const match = exercise.reps.match(/\d+/);
          reps = match ? parseInt(match[0], 10) : null;
          console.log(`[Workout] Parsed reps string "${exercise.reps}" -> ${reps} for exercise: ${exercise.name}`);
        } else {
          console.warn(`[Workout] Invalid reps type for ${exercise.name}:`, typeof exercise.reps, exercise.reps);
        }
      }

      // Parse sets to ensure it's a number
      let sets: number | null = null;
      if (exercise.sets !== null && exercise.sets !== undefined) {
        if (typeof exercise.sets === 'number') {
          sets = exercise.sets;
        } else if (typeof exercise.sets === 'string') {
          sets = parseInt(exercise.sets, 10);
          console.log(`[Workout] Parsed sets string "${exercise.sets}" -> ${sets} for exercise: ${exercise.name}`);
        }
      }

      // Parse durationMin to ensure it's a number
      let durationMin: number | null = null;
      if (exercise.durationMin !== null && exercise.durationMin !== undefined) {
        if (typeof exercise.durationMin === 'number') {
          durationMin = exercise.durationMin;
        } else if (typeof exercise.durationMin === 'string') {
          durationMin = parseInt(exercise.durationMin, 10);
          console.log(`[Workout] Parsed durationMin string "${exercise.durationMin}" -> ${durationMin} for exercise: ${exercise.name}`);
        }
      }

      await prisma.exercise.create({
        data: {
          workoutId,
          name: exercise.name,
          sets,
          reps,
          durationMin,
          equipment: exercise.equipment,
          notes: exercise.notes,
          displayOrder: i,
        },
      });
    }

    return { exercises };
  } catch (error) {
    console.error('Error generating workout exercises:', error);
    throw error;
  }
}
