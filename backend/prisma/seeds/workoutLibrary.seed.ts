/**
 * Workout Library Seed Data
 * Phase 5: 100+ pre-built workouts for workout generation and swapping
 *
 * Categories:
 * - Strength Training: 60 workouts (Upper Body, Lower Body, Full Body, Push/Pull/Legs)
 * - Cardio: 30 workouts (HIIT, Steady State, Sports/Athletic)
 * - Balanced/Hybrid: 10 workouts (Circuit, CrossFit-style, Athletic)
 *
 * Total: 100 workouts
 */

import { PrismaClient, WorkoutType } from '@prisma/client';

const prisma = new PrismaClient();

// Workout library data - 100 comprehensive workouts
const workouts = [
  // ==================== STRENGTH TRAINING (60 workouts) ====================

  // ========== Upper Body Strength (15 workouts) ==========

  // Beginner Upper Body (5 workouts)
  {
    name: 'Beginner Chest & Arms',
    type: 'strength' as WorkoutType,
    workoutCategory: 'Upper Body',
    durationMin: 30,
    estimatedCalories: 200,
    fitnessLevel: 'beginner',
    goalType: 'lose_weight',
    equipmentRequired: ['dumbbells'],
    exercises: [
      { name: 'Push-ups (knee)', sets: 3, reps: '8-10', equipment: [], notes: 'Knees on ground' },
      { name: 'Dumbbell Chest Press', sets: 3, reps: '10-12', equipment: ['dumbbells', 'bench'], notes: 'Light weight' },
      { name: 'Bicep Curls', sets: 3, reps: '12', equipment: ['dumbbells'], notes: 'Control the movement' },
      { name: 'Tricep Kickbacks', sets: 3, reps: '12', equipment: ['dumbbells'], notes: 'Keep elbow stable' },
    ],
  },

  {
    name: 'Beginner Back & Shoulders',
    type: 'strength' as WorkoutType,
    workoutCategory: 'Upper Body',
    durationMin: 30,
    estimatedCalories: 210,
    fitnessLevel: 'beginner',
    goalType: 'maintain',
    equipmentRequired: ['dumbbells', 'resistance bands'],
    exercises: [
      { name: 'Dumbbell Rows', sets: 3, reps: '10-12', equipment: ['dumbbells', 'bench'], notes: 'One arm at a time' },
      { name: 'Lateral Raises', sets: 3, reps: '12', equipment: ['dumbbells'], notes: 'Light weight' },
      { name: 'Band Pull-Aparts', sets: 3, reps: '15', equipment: ['resistance bands'], notes: 'Shoulder height' },
      { name: 'Reverse Flyes', sets: 3, reps: '12', equipment: ['dumbbells'], notes: 'Slight bend in elbows' },
    ],
  },

  {
    name: 'Beginner Push Workout',
    type: 'strength' as WorkoutType,
    workoutCategory: 'Push Day',
    durationMin: 35,
    estimatedCalories: 220,
    fitnessLevel: 'beginner',
    goalType: 'gain_weight',
    equipmentRequired: ['dumbbells', 'bench'],
    exercises: [
      { name: 'Dumbbell Bench Press', sets: 3, reps: '10', equipment: ['dumbbells', 'bench'], notes: 'Full range' },
      { name: 'Shoulder Press', sets: 3, reps: '10', equipment: ['dumbbells'], notes: 'Seated or standing' },
      { name: 'Incline Push-ups', sets: 3, reps: '12', equipment: ['bench'], notes: 'Hands on bench' },
      { name: 'Overhead Tricep Extension', sets: 3, reps: '12', equipment: ['dumbbells'], notes: 'One dumbbell' },
    ],
  },

  {
    name: 'Beginner Pull Workout',
    type: 'strength' as WorkoutType,
    workoutCategory: 'Pull Day',
    durationMin: 35,
    estimatedCalories: 225,
    fitnessLevel: 'beginner',
    goalType: 'gain_weight',
    equipmentRequired: ['dumbbells', 'resistance bands'],
    exercises: [
      { name: 'Bent Over Rows', sets: 3, reps: '10', equipment: ['dumbbells'], notes: 'Both arms' },
      { name: 'Face Pulls', sets: 3, reps: '15', equipment: ['resistance bands'], notes: 'To face level' },
      { name: 'Dumbbell Curls', sets: 3, reps: '12', equipment: ['dumbbells'], notes: 'Alternate arms' },
      { name: 'Hammer Curls', sets: 3, reps: '12', equipment: ['dumbbells'], notes: 'Neutral grip' },
    ],
  },

  {
    name: 'Beginner Upper Body Circuit',
    type: 'strength' as WorkoutType,
    workoutCategory: 'Upper Body',
    durationMin: 30,
    estimatedCalories: 240,
    fitnessLevel: 'beginner',
    goalType: 'lose_weight',
    equipmentRequired: ['dumbbells'],
    exercises: [
      { name: 'Push-ups', sets: 3, reps: '10', equipment: [], notes: 'Modified if needed' },
      { name: 'Dumbbell Rows', sets: 3, reps: '10/arm', equipment: ['dumbbells'], notes: 'One arm' },
      { name: 'Shoulder Press', sets: 3, reps: '10', equipment: ['dumbbells'], notes: 'Standing' },
      { name: 'Bicep Curls', sets: 3, reps: '12', equipment: ['dumbbells'], notes: 'Together' },
      { name: 'Tricep Dips (bench)', sets: 3, reps: '10', equipment: ['bench'], notes: 'Feet on ground' },
    ],
  },

  // Intermediate Upper Body (5 workouts)
  {
    name: 'Upper Body Power',
    type: 'strength' as WorkoutType,
    workoutCategory: 'Upper Body',
    durationMin: 45,
    estimatedCalories: 300,
    fitnessLevel: 'intermediate',
    goalType: 'gain_weight',
    equipmentRequired: ['dumbbells', 'bench'],
    exercises: [
      { name: 'Bench Press', sets: 4, reps: '8-10', equipment: ['bench', 'barbell'], notes: 'Focus on controlled eccentric' },
      { name: 'Bent Over Rows', sets: 4, reps: '10-12', equipment: ['barbell'], notes: 'Keep core tight' },
      { name: 'Overhead Press', sets: 3, reps: '8-10', equipment: ['dumbbells'], notes: 'Press straight up' },
      { name: 'Pull-ups', sets: 3, reps: '8-12', equipment: ['pull-up bar'], notes: 'Full range of motion' },
      { name: 'Dumbbell Curls', sets: 3, reps: '12-15', equipment: ['dumbbells'], notes: 'No swinging' },
      { name: 'Tricep Dips', sets: 3, reps: '10-15', equipment: ['dip bars'], notes: 'Lean forward for chest emphasis' },
    ],
  },

  {
    name: 'Chest & Triceps Blast',
    type: 'strength' as WorkoutType,
    workoutCategory: 'Push Day',
    durationMin: 40,
    estimatedCalories: 280,
    fitnessLevel: 'intermediate',
    goalType: 'gain_weight',
    equipmentRequired: ['dumbbells', 'bench'],
    exercises: [
      { name: 'Dumbbell Bench Press', sets: 4, reps: '10-12', equipment: ['dumbbells', 'bench'], notes: 'Control the weight' },
      { name: 'Incline Dumbbell Press', sets: 3, reps: '10-12', equipment: ['dumbbells', 'bench'], notes: '30-45 degree angle' },
      { name: 'Chest Flyes', sets: 3, reps: '12-15', equipment: ['dumbbells', 'bench'], notes: 'Squeeze at top' },
      { name: 'Tricep Extensions', sets: 3, reps: '12-15', equipment: ['dumbbells'], notes: 'Keep elbows stable' },
      { name: 'Diamond Push-ups', sets: 3, reps: '10-15', equipment: [], notes: 'Hands close together' },
    ],
  },

  {
    name: 'Back & Biceps Builder',
    type: 'strength' as WorkoutType,
    workoutCategory: 'Pull Day',
    durationMin: 40,
    estimatedCalories: 290,
    fitnessLevel: 'intermediate',
    goalType: 'gain_weight',
    equipmentRequired: ['dumbbells', 'pull-up bar'],
    exercises: [
      { name: 'Pull-ups', sets: 4, reps: '8-10', equipment: ['pull-up bar'], notes: 'Wide grip' },
      { name: 'Dumbbell Rows', sets: 4, reps: '10-12', equipment: ['dumbbells', 'bench'], notes: 'One arm at a time' },
      { name: 'Face Pulls', sets: 3, reps: '15-20', equipment: ['resistance bands'], notes: 'Pull to face level' },
      { name: 'Barbell Curls', sets: 3, reps: '10-12', equipment: ['barbell'], notes: 'Strict form' },
      { name: 'Hammer Curls', sets: 3, reps: '12-15', equipment: ['dumbbells'], notes: 'Neutral grip' },
    ],
  },

  {
    name: 'Shoulder & Arms Hypertrophy',
    type: 'strength' as WorkoutType,
    workoutCategory: 'Upper Body',
    durationMin: 45,
    estimatedCalories: 285,
    fitnessLevel: 'intermediate',
    goalType: 'gain_weight',
    equipmentRequired: ['dumbbells'],
    exercises: [
      { name: 'Overhead Press', sets: 4, reps: '8-10', equipment: ['dumbbells'], notes: 'Standing' },
      { name: 'Lateral Raises', sets: 4, reps: '12-15', equipment: ['dumbbells'], notes: 'Controlled' },
      { name: 'Front Raises', sets: 3, reps: '12-15', equipment: ['dumbbells'], notes: 'Alternate arms' },
      { name: 'Barbell Curls', sets: 3, reps: '10-12', equipment: ['barbell'], notes: 'Strict' },
      { name: 'Skull Crushers', sets: 3, reps: '10-12', equipment: ['barbell', 'bench'], notes: 'Control descent' },
    ],
  },

  {
    name: 'Upper Body Strength Circuit',
    type: 'strength' as WorkoutType,
    workoutCategory: 'Upper Body',
    durationMin: 40,
    estimatedCalories: 295,
    fitnessLevel: 'intermediate',
    goalType: 'maintain',
    equipmentRequired: ['dumbbells', 'pull-up bar'],
    exercises: [
      { name: 'Pull-ups', sets: 4, reps: '10', equipment: ['pull-up bar'], notes: 'Full ROM' },
      { name: 'Push-ups', sets: 4, reps: '15', equipment: [], notes: 'Chest to ground' },
      { name: 'Dumbbell Rows', sets: 3, reps: '12/arm', equipment: ['dumbbells'], notes: 'Heavy' },
      { name: 'Dumbbell Press', sets: 3, reps: '12', equipment: ['dumbbells', 'bench'], notes: 'Flat bench' },
      { name: 'Dips', sets: 3, reps: '12', equipment: ['dip bars'], notes: 'For triceps' },
    ],
  },

  // Advanced Upper Body (5 workouts)
  {
    name: 'Advanced Push Day',
    type: 'strength' as WorkoutType,
    workoutCategory: 'Push Day',
    durationMin: 50,
    estimatedCalories: 320,
    fitnessLevel: 'advanced',
    goalType: 'gain_weight',
    equipmentRequired: ['barbell', 'bench', 'dumbbells'],
    exercises: [
      { name: 'Barbell Bench Press', sets: 5, reps: '5-6', equipment: ['barbell', 'bench'], notes: 'Heavy' },
      { name: 'Incline Barbell Press', sets: 4, reps: '6-8', equipment: ['barbell', 'bench'], notes: '30 degree' },
      { name: 'Weighted Dips', sets: 3, reps: '8-10', equipment: ['dip bars', 'weight belt'], notes: 'Add weight' },
      { name: 'Overhead Press', sets: 4, reps: '6-8', equipment: ['barbell'], notes: 'Standing' },
      { name: 'Tricep Pushdowns', sets: 4, reps: '12-15', equipment: ['cable machine'], notes: 'Cable' },
      { name: 'Lateral Raises', sets: 3, reps: '15-20', equipment: ['dumbbells'], notes: 'Drop set last' },
    ],
  },

  {
    name: 'Advanced Pull Day',
    type: 'strength' as WorkoutType,
    workoutCategory: 'Pull Day',
    durationMin: 50,
    estimatedCalories: 315,
    fitnessLevel: 'advanced',
    goalType: 'gain_weight',
    equipmentRequired: ['barbell', 'pull-up bar', 'dumbbells'],
    exercises: [
      { name: 'Deadlifts', sets: 5, reps: '5', equipment: ['barbell'], notes: 'Heavy' },
      { name: 'Weighted Pull-ups', sets: 4, reps: '6-8', equipment: ['pull-up bar', 'weight belt'], notes: 'Add weight' },
      { name: 'Barbell Rows', sets: 4, reps: '8-10', equipment: ['barbell'], notes: 'Pendlay style' },
      { name: 'T-Bar Rows', sets: 3, reps: '10-12', equipment: ['barbell'], notes: 'Landmine' },
      { name: 'Barbell Curls', sets: 4, reps: '8-10', equipment: ['barbell'], notes: 'Heavy' },
      { name: 'Preacher Curls', sets: 3, reps: '12-15', equipment: ['dumbbells', 'bench'], notes: 'Isolation' },
    ],
  },

  {
    name: 'Advanced Chest Specialization',
    type: 'strength' as WorkoutType,
    workoutCategory: 'Upper Body',
    durationMin: 55,
    estimatedCalories: 330,
    fitnessLevel: 'advanced',
    goalType: 'gain_weight',
    equipmentRequired: ['barbell', 'bench', 'dumbbells', 'cables'],
    exercises: [
      { name: 'Flat Barbell Bench', sets: 5, reps: '5', equipment: ['barbell', 'bench'], notes: 'Max effort' },
      { name: 'Incline Dumbbell Press', sets: 4, reps: '8-10', equipment: ['dumbbells', 'bench'], notes: '45 degree' },
      { name: 'Decline Barbell Press', sets: 3, reps: '10-12', equipment: ['barbell', 'bench'], notes: 'Lower chest' },
      { name: 'Cable Flyes', sets: 4, reps: '12-15', equipment: ['cable machine'], notes: 'Constant tension' },
      { name: 'Dips', sets: 3, reps: '15-20', equipment: ['dip bars'], notes: 'Bodyweight' },
    ],
  },

  {
    name: 'Advanced Back Thickness',
    type: 'strength' as WorkoutType,
    workoutCategory: 'Upper Body',
    durationMin: 50,
    estimatedCalories: 310,
    fitnessLevel: 'advanced',
    goalType: 'gain_weight',
    equipmentRequired: ['barbell', 'dumbbells', 'pull-up bar'],
    exercises: [
      { name: 'Barbell Rows', sets: 5, reps: '6-8', equipment: ['barbell'], notes: 'Heavy' },
      { name: 'Pull-ups', sets: 4, reps: '10-12', equipment: ['pull-up bar'], notes: 'Weighted if possible' },
      { name: 'Dumbbell Rows', sets: 4, reps: '10-12', equipment: ['dumbbells', 'bench'], notes: 'One arm, heavy' },
      { name: 'Meadows Rows', sets: 3, reps: '12-15', equipment: ['barbell'], notes: 'Landmine' },
      { name: 'Straight Arm Pulldowns', sets: 3, reps: '15-20', equipment: ['cable machine'], notes: 'Lat focus' },
    ],
  },

  {
    name: 'Advanced Shoulder & Arms',
    type: 'strength' as WorkoutType,
    workoutCategory: 'Upper Body',
    durationMin: 50,
    estimatedCalories: 305,
    fitnessLevel: 'advanced',
    goalType: 'gain_weight',
    equipmentRequired: ['barbell', 'dumbbells'],
    exercises: [
      { name: 'Standing Overhead Press', sets: 5, reps: '5-6', equipment: ['barbell'], notes: 'Heavy' },
      { name: 'Arnold Press', sets: 4, reps: '8-10', equipment: ['dumbbells'], notes: 'Rotate palms' },
      { name: 'Lateral Raises', sets: 4, reps: '15-20', equipment: ['dumbbells'], notes: 'Light weight' },
      { name: 'Close Grip Bench', sets: 4, reps: '8-10', equipment: ['barbell', 'bench'], notes: 'Triceps' },
      { name: 'Barbell Curls', sets: 4, reps: '8-10', equipment: ['barbell'], notes: 'Heavy' },
      { name: 'Cable Curls', sets: 3, reps: '15-20', equipment: ['cable machine'], notes: 'Constant tension' },
    ],
  },

  // ========== Lower Body Strength (15 workouts) ==========

  // Beginner Lower Body (5 workouts)
  {
    name: 'Beginner Leg Day',
    type: 'strength' as WorkoutType,
    workoutCategory: 'Lower Body',
    durationMin: 30,
    estimatedCalories: 220,
    fitnessLevel: 'beginner',
    goalType: 'lose_weight',
    equipmentRequired: ['dumbbells'],
    exercises: [
      { name: 'Bodyweight Squats', sets: 3, reps: '15', equipment: [], notes: 'Full depth' },
      { name: 'Lunges', sets: 3, reps: '10/leg', equipment: [], notes: 'Bodyweight' },
      { name: 'Glute Bridges', sets: 3, reps: '15', equipment: [], notes: 'Squeeze at top' },
      { name: 'Calf Raises', sets: 3, reps: '20', equipment: [], notes: 'Bodyweight' },
    ],
  },

  {
    name: 'Beginner Glutes & Legs',
    type: 'strength' as WorkoutType,
    workoutCategory: 'Lower Body',
    durationMin: 35,
    estimatedCalories: 230,
    fitnessLevel: 'beginner',
    goalType: 'maintain',
    equipmentRequired: ['dumbbells', 'resistance bands'],
    exercises: [
      { name: 'Goblet Squats', sets: 3, reps: '12', equipment: ['dumbbells'], notes: 'One dumbbell' },
      { name: 'Hip Thrusts', sets: 3, reps: '15', equipment: ['bench'], notes: 'Bodyweight' },
      { name: 'Side Leg Raises', sets: 3, reps: '15/side', equipment: ['resistance bands'], notes: 'Banded' },
      { name: 'Step-ups', sets: 3, reps: '10/leg', equipment: ['bench'], notes: 'Bodyweight' },
    ],
  },

  {
    name: 'Beginner Quad Focus',
    type: 'strength' as WorkoutType,
    workoutCategory: 'Leg Day',
    durationMin: 30,
    estimatedCalories: 225,
    fitnessLevel: 'beginner',
    goalType: 'gain_weight',
    equipmentRequired: ['dumbbells'],
    exercises: [
      { name: 'Goblet Squats', sets: 4, reps: '12', equipment: ['dumbbells'], notes: 'Deep' },
      { name: 'Split Squats', sets: 3, reps: '10/leg', equipment: ['dumbbells'], notes: 'Rear foot elevated' },
      { name: 'Leg Extensions', sets: 3, reps: '15', equipment: ['machine'], notes: 'If available' },
      { name: 'Wall Sits', sets: 3, reps: '45 sec', equipment: [], notes: 'Isometric' },
    ],
  },

  {
    name: 'Beginner Hamstring & Glutes',
    type: 'strength' as WorkoutType,
    workoutCategory: 'Lower Body',
    durationMin: 35,
    estimatedCalories: 235,
    fitnessLevel: 'beginner',
    goalType: 'lose_weight',
    equipmentRequired: ['dumbbells'],
    exercises: [
      { name: 'Dumbbell Deadlifts', sets: 3, reps: '12', equipment: ['dumbbells'], notes: 'Hinge at hips' },
      { name: 'Glute Bridges', sets: 4, reps: '15', equipment: [], notes: 'Hold at top' },
      { name: 'Good Mornings', sets: 3, reps: '12', equipment: ['dumbbells'], notes: 'Light weight' },
      { name: 'Fire Hydrants', sets: 3, reps: '15/side', equipment: [], notes: 'Bodyweight' },
    ],
  },

  {
    name: 'Beginner Lower Body Circuit',
    type: 'strength' as WorkoutType,
    workoutCategory: 'Lower Body',
    durationMin: 30,
    estimatedCalories: 240,
    fitnessLevel: 'beginner',
    goalType: 'lose_weight',
    equipmentRequired: ['dumbbells'],
    exercises: [
      { name: 'Squats', sets: 3, reps: '15', equipment: [], notes: 'Bodyweight' },
      { name: 'Lunges', sets: 3, reps: '10/leg', equipment: ['dumbbells'], notes: 'Light dumbbells' },
      { name: 'Deadlifts', sets: 3, reps: '12', equipment: ['dumbbells'], notes: 'Romanian style' },
      { name: 'Calf Raises', sets: 3, reps: '20', equipment: ['dumbbells'], notes: 'Dumbbell in hand' },
      { name: 'Glute Bridges', sets: 3, reps: '15', equipment: [], notes: 'Bodyweight' },
    ],
  },

  // Intermediate Lower Body (5 workouts)
  {
    name: 'Leg Day Power',
    type: 'strength' as WorkoutType,
    workoutCategory: 'Lower Body',
    durationMin: 50,
    estimatedCalories: 350,
    fitnessLevel: 'intermediate',
    goalType: 'gain_weight',
    equipmentRequired: ['barbell', 'squat rack'],
    exercises: [
      { name: 'Back Squats', sets: 4, reps: '8-10', equipment: ['barbell', 'squat rack'], notes: 'Full depth' },
      { name: 'Romanian Deadlifts', sets: 4, reps: '10-12', equipment: ['barbell'], notes: 'Hinge at hips' },
      { name: 'Leg Press', sets: 3, reps: '12-15', equipment: ['leg press machine'], notes: 'Feet shoulder width' },
      { name: 'Walking Lunges', sets: 3, reps: '12/leg', equipment: ['dumbbells'], notes: 'Long stride' },
      { name: 'Calf Raises', sets: 4, reps: '15-20', equipment: ['dumbbells'], notes: 'Full ROM' },
    ],
  },

  {
    name: 'Glutes & Hamstrings Focus',
    type: 'strength' as WorkoutType,
    workoutCategory: 'Lower Body',
    durationMin: 45,
    estimatedCalories: 320,
    fitnessLevel: 'intermediate',
    goalType: 'lose_weight',
    equipmentRequired: ['dumbbells', 'resistance bands'],
    exercises: [
      { name: 'Hip Thrusts', sets: 4, reps: '12-15', equipment: ['barbell', 'bench'], notes: 'Squeeze glutes at top' },
      { name: 'Goblet Squats', sets: 3, reps: '15', equipment: ['dumbbells'], notes: 'Dumbbell at chest' },
      { name: 'Romanian Deadlifts', sets: 3, reps: '12', equipment: ['dumbbells'], notes: 'Feel hamstring stretch' },
      { name: 'Glute Bridges', sets: 3, reps: '20', equipment: [], notes: 'Bodyweight or banded' },
      { name: 'Fire Hydrants', sets: 3, reps: '15/side', equipment: ['resistance bands'], notes: 'Pulse at top' },
    ],
  },

  {
    name: 'Quad Dominant Workout',
    type: 'strength' as WorkoutType,
    workoutCategory: 'Leg Day',
    durationMin: 45,
    estimatedCalories: 340,
    fitnessLevel: 'intermediate',
    goalType: 'gain_weight',
    equipmentRequired: ['barbell', 'squat rack'],
    exercises: [
      { name: 'Front Squats', sets: 4, reps: '8-10', equipment: ['barbell', 'squat rack'], notes: 'Upright torso' },
      { name: 'Bulgarian Split Squats', sets: 3, reps: '10/leg', equipment: ['dumbbells'], notes: 'Rear foot elevated' },
      { name: 'Leg Extensions', sets: 3, reps: '15', equipment: ['machine'], notes: 'Squeeze at top' },
      { name: 'Goblet Squats', sets: 3, reps: '15', equipment: ['dumbbells'], notes: 'Tempo 3-0-1' },
    ],
  },

  {
    name: 'Posterior Chain Builder',
    type: 'strength' as WorkoutType,
    workoutCategory: 'Lower Body',
    durationMin: 45,
    estimatedCalories: 335,
    fitnessLevel: 'intermediate',
    goalType: 'gain_weight',
    equipmentRequired: ['barbell'],
    exercises: [
      { name: 'Conventional Deadlifts', sets: 4, reps: '6-8', equipment: ['barbell'], notes: 'Heavy' },
      { name: 'Barbell Hip Thrusts', sets: 4, reps: '12', equipment: ['barbell', 'bench'], notes: 'Pause at top' },
      { name: 'Leg Curls', sets: 3, reps: '12-15', equipment: ['machine'], notes: 'Hamstring isolation' },
      { name: 'Back Extensions', sets: 3, reps: '15', equipment: ['bench'], notes: 'Hold at top' },
    ],
  },

  {
    name: 'Lower Body Hypertrophy',
    type: 'strength' as WorkoutType,
    workoutCategory: 'Lower Body',
    durationMin: 50,
    estimatedCalories: 345,
    fitnessLevel: 'intermediate',
    goalType: 'gain_weight',
    equipmentRequired: ['barbell', 'dumbbells'],
    exercises: [
      { name: 'Back Squats', sets: 4, reps: '10-12', equipment: ['barbell', 'squat rack'], notes: 'Moderate weight' },
      { name: 'Romanian Deadlifts', sets: 4, reps: '12', equipment: ['barbell'], notes: 'Controlled tempo' },
      { name: 'Walking Lunges', sets: 3, reps: '15/leg', equipment: ['dumbbells'], notes: 'Heavy dumbbells' },
      { name: 'Leg Press', sets: 3, reps: '15-20', equipment: ['machine'], notes: 'High reps' },
      { name: 'Standing Calf Raises', sets: 4, reps: '20', equipment: ['machine'], notes: 'Full ROM' },
    ],
  },

  // Advanced Lower Body (5 workouts)
  {
    name: 'Advanced Squat Day',
    type: 'strength' as WorkoutType,
    workoutCategory: 'Leg Day',
    durationMin: 55,
    estimatedCalories: 380,
    fitnessLevel: 'advanced',
    goalType: 'gain_weight',
    equipmentRequired: ['barbell', 'squat rack'],
    exercises: [
      { name: 'Back Squats', sets: 5, reps: '5', equipment: ['barbell', 'squat rack'], notes: 'Heavy sets' },
      { name: 'Front Squats', sets: 4, reps: '6-8', equipment: ['barbell', 'squat rack'], notes: 'After back squats' },
      { name: 'Hack Squats', sets: 3, reps: '12-15', equipment: ['machine'], notes: 'If available' },
      { name: 'Bulgarian Split Squats', sets: 3, reps: '10/leg', equipment: ['dumbbells'], notes: 'Heavy' },
      { name: 'Leg Extensions', sets: 4, reps: '15-20', equipment: ['machine'], notes: 'Burnout' },
    ],
  },

  {
    name: 'Advanced Deadlift Day',
    type: 'strength' as WorkoutType,
    workoutCategory: 'Lower Body',
    durationMin: 55,
    estimatedCalories: 375,
    fitnessLevel: 'advanced',
    goalType: 'gain_weight',
    equipmentRequired: ['barbell'],
    exercises: [
      { name: 'Conventional Deadlifts', sets: 5, reps: '3-5', equipment: ['barbell'], notes: 'Max effort' },
      { name: 'Romanian Deadlifts', sets: 4, reps: '8-10', equipment: ['barbell'], notes: 'Hamstring focus' },
      { name: 'Barbell Hip Thrusts', sets: 4, reps: '10-12', equipment: ['barbell', 'bench'], notes: 'Heavy' },
      { name: 'Leg Curls', sets: 4, reps: '12-15', equipment: ['machine'], notes: 'Isolation' },
      { name: 'Back Extensions', sets: 3, reps: '15-20', equipment: ['bench'], notes: 'Add weight if possible' },
    ],
  },

  {
    name: 'Advanced Leg Hypertrophy',
    type: 'strength' as WorkoutType,
    workoutCategory: 'Leg Day',
    durationMin: 60,
    estimatedCalories: 390,
    fitnessLevel: 'advanced',
    goalType: 'gain_weight',
    equipmentRequired: ['barbell', 'squat rack', 'dumbbells'],
    exercises: [
      { name: 'Back Squats', sets: 5, reps: '8-10', equipment: ['barbell', 'squat rack'], notes: 'Moderate-heavy' },
      { name: 'Leg Press', sets: 4, reps: '12-15', equipment: ['machine'], notes: 'Drop set last' },
      { name: 'Bulgarian Split Squats', sets: 4, reps: '10-12/leg', equipment: ['dumbbells'], notes: 'Heavy' },
      { name: 'Leg Extensions', sets: 4, reps: '15-20', equipment: ['machine'], notes: 'Quad burn' },
      { name: 'Leg Curls', sets: 4, reps: '12-15', equipment: ['machine'], notes: 'Hamstring focus' },
      { name: 'Seated Calf Raises', sets: 4, reps: '20-25', equipment: ['machine'], notes: 'High reps' },
    ],
  },

  {
    name: 'Advanced Glute Specialization',
    type: 'strength' as WorkoutType,
    workoutCategory: 'Lower Body',
    durationMin: 50,
    estimatedCalories: 360,
    fitnessLevel: 'advanced',
    goalType: 'maintain',
    equipmentRequired: ['barbell', 'dumbbells', 'resistance bands'],
    exercises: [
      { name: 'Barbell Hip Thrusts', sets: 5, reps: '8-10', equipment: ['barbell', 'bench'], notes: 'Heavy, pause at top' },
      { name: 'Sumo Deadlifts', sets: 4, reps: '8-10', equipment: ['barbell'], notes: 'Wide stance' },
      { name: 'Single Leg Hip Thrusts', sets: 3, reps: '12/leg', equipment: ['bench'], notes: 'Bodyweight' },
      { name: 'Cable Pull-Throughs', sets: 4, reps: '15', equipment: ['cable machine'], notes: 'Hip hinge' },
      { name: 'Banded Glute Kickbacks', sets: 3, reps: '20/leg', equipment: ['resistance bands'], notes: 'Squeeze' },
    ],
  },

  {
    name: 'Advanced Lower Power',
    type: 'strength' as WorkoutType,
    workoutCategory: 'Leg Day',
    durationMin: 55,
    estimatedCalories: 385,
    fitnessLevel: 'advanced',
    goalType: 'gain_weight',
    equipmentRequired: ['barbell', 'squat rack'],
    exercises: [
      { name: 'Back Squats', sets: 5, reps: '3-5', equipment: ['barbell', 'squat rack'], notes: 'Low rep strength' },
      { name: 'Deadlifts', sets: 4, reps: '5', equipment: ['barbell'], notes: 'Heavy' },
      { name: 'Front Squats', sets: 4, reps: '6-8', equipment: ['barbell', 'squat rack'], notes: 'Explosive' },
      { name: 'Box Jumps', sets: 3, reps: '8', equipment: ['box'], notes: 'Power development' },
      { name: 'Sled Pushes', sets: 4, reps: '30m', equipment: ['sled'], notes: 'If available' },
    ],
  },

  // ========== Full Body Strength (15 workouts) ==========

  // Beginner Full Body (5 workouts)
  {
    name: 'Beginner Full Body A',
    type: 'strength' as WorkoutType,
    workoutCategory: 'Full Body',
    durationMin: 35,
    estimatedCalories: 240,
    fitnessLevel: 'beginner',
    goalType: 'lose_weight',
    equipmentRequired: ['dumbbells'],
    exercises: [
      { name: 'Goblet Squats', sets: 3, reps: '12', equipment: ['dumbbells'], notes: 'One dumbbell' },
      { name: 'Push-ups', sets: 3, reps: '10', equipment: [], notes: 'Modified if needed' },
      { name: 'Dumbbell Rows', sets: 3, reps: '10/arm', equipment: ['dumbbells'], notes: 'One arm' },
      { name: 'Plank', sets: 3, reps: '30 sec', equipment: [], notes: 'Hold steady' },
    ],
  },

  {
    name: 'Beginner Full Body B',
    type: 'strength' as WorkoutType,
    workoutCategory: 'Full Body',
    durationMin: 35,
    estimatedCalories: 245,
    fitnessLevel: 'beginner',
    goalType: 'maintain',
    equipmentRequired: ['dumbbells'],
    exercises: [
      { name: 'Dumbbell Deadlifts', sets: 3, reps: '12', equipment: ['dumbbells'], notes: 'Hip hinge' },
      { name: 'Dumbbell Press', sets: 3, reps: '10', equipment: ['dumbbells', 'bench'], notes: 'Flat bench' },
      { name: 'Lunges', sets: 3, reps: '10/leg', equipment: [], notes: 'Bodyweight' },
      { name: 'Shoulder Press', sets: 3, reps: '10', equipment: ['dumbbells'], notes: 'Seated' },
    ],
  },

  {
    name: 'Beginner Full Body Circuit',
    type: 'strength' as WorkoutType,
    workoutCategory: 'Full Body',
    durationMin: 30,
    estimatedCalories: 250,
    fitnessLevel: 'beginner',
    goalType: 'lose_weight',
    equipmentRequired: ['dumbbells'],
    exercises: [
      { name: 'Squats', sets: 3, reps: '15', equipment: [], notes: 'Bodyweight' },
      { name: 'Push-ups', sets: 3, reps: '10', equipment: [], notes: 'Knee if needed' },
      { name: 'Dumbbell Rows', sets: 3, reps: '10', equipment: ['dumbbells'], notes: 'Both arms' },
      { name: 'Glute Bridges', sets: 3, reps: '15', equipment: [], notes: 'Bodyweight' },
      { name: 'Plank', sets: 3, reps: '30 sec', equipment: [], notes: 'Core' },
    ],
  },

  {
    name: 'Beginner Strength Foundation',
    type: 'strength' as WorkoutType,
    workoutCategory: 'Full Body',
    durationMin: 40,
    estimatedCalories: 255,
    fitnessLevel: 'beginner',
    goalType: 'gain_weight',
    equipmentRequired: ['dumbbells', 'bench'],
    exercises: [
      { name: 'Goblet Squats', sets: 3, reps: '10', equipment: ['dumbbells'], notes: 'Deep' },
      { name: 'Dumbbell Bench Press', sets: 3, reps: '10', equipment: ['dumbbells', 'bench'], notes: 'Controlled' },
      { name: 'Dumbbell Rows', sets: 3, reps: '10/arm', equipment: ['dumbbells', 'bench'], notes: 'One arm' },
      { name: 'Dumbbell Deadlifts', sets: 3, reps: '10', equipment: ['dumbbells'], notes: 'Romanian' },
      { name: 'Shoulder Press', sets: 3, reps: '10', equipment: ['dumbbells'], notes: 'Standing' },
    ],
  },

  {
    name: 'Beginner Functional Strength',
    type: 'strength' as WorkoutType,
    workoutCategory: 'Full Body',
    durationMin: 35,
    estimatedCalories: 260,
    fitnessLevel: 'beginner',
    goalType: 'maintain',
    equipmentRequired: ['dumbbells'],
    exercises: [
      { name: 'Dumbbell Squats', sets: 3, reps: '12', equipment: ['dumbbells'], notes: 'Dumbbells at sides' },
      { name: 'Push-ups', sets: 3, reps: '12', equipment: [], notes: 'Full or modified' },
      { name: 'Bent Over Rows', sets: 3, reps: '12', equipment: ['dumbbells'], notes: 'Both arms' },
      { name: 'Overhead Press', sets: 3, reps: '10', equipment: ['dumbbells'], notes: 'Standing' },
      { name: 'Bicycle Crunches', sets: 3, reps: '20', equipment: [], notes: 'Core' },
    ],
  },

  // Intermediate Full Body (5 workouts)
  {
    name: 'Total Body Strength',
    type: 'strength' as WorkoutType,
    workoutCategory: 'Full Body',
    durationMin: 50,
    estimatedCalories: 380,
    fitnessLevel: 'intermediate',
    goalType: 'maintain',
    equipmentRequired: ['dumbbells', 'barbell'],
    exercises: [
      { name: 'Deadlifts', sets: 4, reps: '6-8', equipment: ['barbell'], notes: 'Neutral spine' },
      { name: 'Push-ups', sets: 3, reps: '15-20', equipment: [], notes: 'Chest to ground' },
      { name: 'Goblet Squats', sets: 3, reps: '12-15', equipment: ['dumbbells'], notes: 'Elbows inside knees' },
      { name: 'Dumbbell Rows', sets: 3, reps: '12/arm', equipment: ['dumbbells', 'bench'], notes: 'Pull to hip' },
      { name: 'Plank', sets: 3, reps: '60 sec', equipment: [], notes: 'Don\'t sag hips' },
    ],
  },

  {
    name: 'Full Body Compound Focus',
    type: 'strength' as WorkoutType,
    workoutCategory: 'Full Body',
    durationMin: 45,
    estimatedCalories: 360,
    fitnessLevel: 'intermediate',
    goalType: 'gain_weight',
    equipmentRequired: ['barbell', 'squat rack'],
    exercises: [
      { name: 'Back Squats', sets: 4, reps: '8-10', equipment: ['barbell', 'squat rack'], notes: 'Deep' },
      { name: 'Bench Press', sets: 4, reps: '8-10', equipment: ['barbell', 'bench'], notes: 'Full ROM' },
      { name: 'Barbell Rows', sets: 3, reps: '10-12', equipment: ['barbell'], notes: 'Pull to sternum' },
      { name: 'Overhead Press', sets: 3, reps: '8-10', equipment: ['barbell'], notes: 'Standing' },
    ],
  },

  {
    name: 'Full Body Power & Hypertrophy',
    type: 'strength' as WorkoutType,
    workoutCategory: 'Full Body',
    durationMin: 50,
    estimatedCalories: 370,
    fitnessLevel: 'intermediate',
    goalType: 'gain_weight',
    equipmentRequired: ['barbell', 'dumbbells'],
    exercises: [
      { name: 'Deadlifts', sets: 4, reps: '5-6', equipment: ['barbell'], notes: 'Heavy' },
      { name: 'Dumbbell Bench Press', sets: 4, reps: '10-12', equipment: ['dumbbells', 'bench'], notes: 'Full ROM' },
      { name: 'Front Squats', sets: 3, reps: '10-12', equipment: ['barbell', 'squat rack'], notes: 'Upright torso' },
      { name: 'Pull-ups', sets: 3, reps: '10-12', equipment: ['pull-up bar'], notes: 'Full ROM' },
      { name: 'Hanging Leg Raises', sets: 3, reps: '12-15', equipment: ['pull-up bar'], notes: 'Control' },
    ],
  },

  {
    name: 'Full Body Functional Training',
    type: 'strength' as WorkoutType,
    workoutCategory: 'Full Body',
    durationMin: 45,
    estimatedCalories: 365,
    fitnessLevel: 'intermediate',
    goalType: 'maintain',
    equipmentRequired: ['dumbbells', 'kettlebell'],
    exercises: [
      { name: 'Kettlebell Swings', sets: 4, reps: '20', equipment: ['kettlebell'], notes: 'Hip hinge' },
      { name: 'Goblet Squats', sets: 3, reps: '15', equipment: ['dumbbells'], notes: 'Deep' },
      { name: 'Push-ups', sets: 3, reps: '20', equipment: [], notes: 'Full ROM' },
      { name: 'Dumbbell Rows', sets: 3, reps: '12/arm', equipment: ['dumbbells'], notes: 'Heavy' },
      { name: 'Turkish Get-ups', sets: 3, reps: '5/side', equipment: ['kettlebell'], notes: 'Control' },
    ],
  },

  {
    name: 'Full Body Upper/Lower Split',
    type: 'strength' as WorkoutType,
    workoutCategory: 'Full Body',
    durationMin: 50,
    estimatedCalories: 375,
    fitnessLevel: 'intermediate',
    goalType: 'gain_weight',
    equipmentRequired: ['barbell', 'dumbbells'],
    exercises: [
      { name: 'Squats', sets: 4, reps: '10', equipment: ['barbell', 'squat rack'], notes: 'Moderate weight' },
      { name: 'Bench Press', sets: 4, reps: '10', equipment: ['barbell', 'bench'], notes: 'Moderate weight' },
      { name: 'Romanian Deadlifts', sets: 3, reps: '12', equipment: ['barbell'], notes: 'Hamstring focus' },
      { name: 'Pull-ups', sets: 3, reps: '10', equipment: ['pull-up bar'], notes: 'Full ROM' },
      { name: 'Dumbbell Shoulder Press', sets: 3, reps: '12', equipment: ['dumbbells'], notes: 'Standing' },
    ],
  },

  // Advanced Full Body (5 workouts)
  {
    name: 'Advanced Full Body Power',
    type: 'strength' as WorkoutType,
    workoutCategory: 'Full Body',
    durationMin: 60,
    estimatedCalories: 420,
    fitnessLevel: 'advanced',
    goalType: 'gain_weight',
    equipmentRequired: ['barbell', 'squat rack'],
    exercises: [
      { name: 'Back Squats', sets: 5, reps: '5', equipment: ['barbell', 'squat rack'], notes: 'Heavy' },
      { name: 'Deadlifts', sets: 5, reps: '3-5', equipment: ['barbell'], notes: 'Max effort' },
      { name: 'Bench Press', sets: 5, reps: '5', equipment: ['barbell', 'bench'], notes: 'Heavy' },
      { name: 'Barbell Rows', sets: 4, reps: '8', equipment: ['barbell'], notes: 'Explosive' },
      { name: 'Overhead Press', sets: 4, reps: '6-8', equipment: ['barbell'], notes: 'Standing' },
    ],
  },

  {
    name: 'Advanced Olympic Lifting',
    type: 'strength' as WorkoutType,
    workoutCategory: 'Full Body',
    durationMin: 55,
    estimatedCalories: 410,
    fitnessLevel: 'advanced',
    goalType: 'gain_weight',
    equipmentRequired: ['barbell', 'squat rack'],
    exercises: [
      { name: 'Power Cleans', sets: 5, reps: '3', equipment: ['barbell'], notes: 'Explosive' },
      { name: 'Front Squats', sets: 4, reps: '6-8', equipment: ['barbell', 'squat rack'], notes: 'Heavy' },
      { name: 'Push Press', sets: 4, reps: '6', equipment: ['barbell'], notes: 'Use leg drive' },
      { name: 'Snatch Grip Deadlifts', sets: 3, reps: '8', equipment: ['barbell'], notes: 'Wide grip' },
    ],
  },

  {
    name: 'Advanced Strength & Size',
    type: 'strength' as WorkoutType,
    workoutCategory: 'Full Body',
    durationMin: 60,
    estimatedCalories: 415,
    fitnessLevel: 'advanced',
    goalType: 'gain_weight',
    equipmentRequired: ['barbell', 'dumbbells', 'squat rack'],
    exercises: [
      { name: 'Squats', sets: 5, reps: '6-8', equipment: ['barbell', 'squat rack'], notes: 'Heavy' },
      { name: 'Bench Press', sets: 5, reps: '6-8', equipment: ['barbell', 'bench'], notes: 'Heavy' },
      { name: 'Deadlifts', sets: 4, reps: '6', equipment: ['barbell'], notes: 'Heavy' },
      { name: 'Weighted Pull-ups', sets: 4, reps: '8-10', equipment: ['pull-up bar', 'weight belt'], notes: 'Add weight' },
      { name: 'Barbell Rows', sets: 4, reps: '10', equipment: ['barbell'], notes: 'Heavy' },
      { name: 'Dips', sets: 3, reps: '12-15', equipment: ['dip bars'], notes: 'Weighted' },
    ],
  },

  {
    name: 'Advanced Athletic Performance',
    type: 'strength' as WorkoutType,
    workoutCategory: 'Full Body',
    durationMin: 55,
    estimatedCalories: 405,
    fitnessLevel: 'advanced',
    goalType: 'maintain',
    equipmentRequired: ['barbell', 'box', 'medicine ball'],
    exercises: [
      { name: 'Box Jumps', sets: 4, reps: '6', equipment: ['box'], notes: 'Explosive' },
      { name: 'Power Cleans', sets: 4, reps: '5', equipment: ['barbell'], notes: 'Explosive' },
      { name: 'Med Ball Slams', sets: 4, reps: '12', equipment: ['medicine ball'], notes: 'Max effort' },
      { name: 'Sled Sprints', sets: 4, reps: '20m', equipment: ['sled'], notes: 'Fast' },
      { name: 'Kettlebell Swings', sets: 4, reps: '20', equipment: ['kettlebell'], notes: 'Heavy' },
    ],
  },

  {
    name: 'Advanced Total Body Hypertrophy',
    type: 'strength' as WorkoutType,
    workoutCategory: 'Full Body',
    durationMin: 60,
    estimatedCalories: 425,
    fitnessLevel: 'advanced',
    goalType: 'gain_weight',
    equipmentRequired: ['barbell', 'dumbbells', 'squat rack'],
    exercises: [
      { name: 'Squats', sets: 4, reps: '10-12', equipment: ['barbell', 'squat rack'], notes: 'Moderate weight' },
      { name: 'Romanian Deadlifts', sets: 4, reps: '10-12', equipment: ['barbell'], notes: 'Hamstrings' },
      { name: 'Incline Bench Press', sets: 4, reps: '10-12', equipment: ['barbell', 'bench'], notes: 'Upper chest' },
      { name: 'Barbell Rows', sets: 4, reps: '10-12', equipment: ['barbell'], notes: 'Pull to sternum' },
      { name: 'Overhead Press', sets: 3, reps: '12', equipment: ['dumbbells'], notes: 'Standing' },
      { name: 'Barbell Curls', sets: 3, reps: '12-15', equipment: ['barbell'], notes: 'Strict' },
      { name: 'Skull Crushers', sets: 3, reps: '12-15', equipment: ['barbell', 'bench'], notes: 'Triceps' },
    ],
  },

  // ========== Push/Pull/Legs (15 workouts) ==========

  // Beginner PPL (5 workouts)
  {
    name: 'Beginner Push A',
    type: 'strength' as WorkoutType,
    workoutCategory: 'Push Day',
    durationMin: 30,
    estimatedCalories: 210,
    fitnessLevel: 'beginner',
    goalType: 'gain_weight',
    equipmentRequired: ['dumbbells', 'bench'],
    exercises: [
      { name: 'Dumbbell Bench Press', sets: 3, reps: '10', equipment: ['dumbbells', 'bench'], notes: 'Flat bench' },
      { name: 'Shoulder Press', sets: 3, reps: '10', equipment: ['dumbbells'], notes: 'Seated' },
      { name: 'Tricep Extensions', sets: 3, reps: '12', equipment: ['dumbbells'], notes: 'Overhead' },
    ],
  },

  {
    name: 'Beginner Pull A',
    type: 'strength' as WorkoutType,
    workoutCategory: 'Pull Day',
    durationMin: 30,
    estimatedCalories: 215,
    fitnessLevel: 'beginner',
    goalType: 'gain_weight',
    equipmentRequired: ['dumbbells', 'resistance bands'],
    exercises: [
      { name: 'Dumbbell Rows', sets: 3, reps: '10/arm', equipment: ['dumbbells', 'bench'], notes: 'One arm' },
      { name: 'Face Pulls', sets: 3, reps: '15', equipment: ['resistance bands'], notes: 'To face' },
      { name: 'Bicep Curls', sets: 3, reps: '12', equipment: ['dumbbells'], notes: 'Controlled' },
    ],
  },

  {
    name: 'Beginner Legs A',
    type: 'strength' as WorkoutType,
    workoutCategory: 'Leg Day',
    durationMin: 30,
    estimatedCalories: 220,
    fitnessLevel: 'beginner',
    goalType: 'gain_weight',
    equipmentRequired: ['dumbbells'],
    exercises: [
      { name: 'Goblet Squats', sets: 3, reps: '12', equipment: ['dumbbells'], notes: 'One dumbbell' },
      { name: 'Dumbbell Deadlifts', sets: 3, reps: '12', equipment: ['dumbbells'], notes: 'Romanian' },
      { name: 'Lunges', sets: 3, reps: '10/leg', equipment: [], notes: 'Bodyweight' },
    ],
  },

  {
    name: 'Beginner Push B',
    type: 'strength' as WorkoutType,
    workoutCategory: 'Push Day',
    durationMin: 30,
    estimatedCalories: 215,
    fitnessLevel: 'beginner',
    goalType: 'maintain',
    equipmentRequired: ['dumbbells', 'bench'],
    exercises: [
      { name: 'Incline Dumbbell Press', sets: 3, reps: '10', equipment: ['dumbbells', 'bench'], notes: '30 degree' },
      { name: 'Lateral Raises', sets: 3, reps: '12', equipment: ['dumbbells'], notes: 'Light' },
      { name: 'Overhead Tricep Extension', sets: 3, reps: '12', equipment: ['dumbbells'], notes: 'One dumbbell' },
    ],
  },

  {
    name: 'Beginner Pull B',
    type: 'strength' as WorkoutType,
    workoutCategory: 'Pull Day',
    durationMin: 30,
    estimatedCalories: 220,
    fitnessLevel: 'beginner',
    goalType: 'maintain',
    equipmentRequired: ['dumbbells', 'resistance bands'],
    exercises: [
      { name: 'Bent Over Rows', sets: 3, reps: '10', equipment: ['dumbbells'], notes: 'Both arms' },
      { name: 'Band Pull-Aparts', sets: 3, reps: '15', equipment: ['resistance bands'], notes: 'Rear delts' },
      { name: 'Hammer Curls', sets: 3, reps: '12', equipment: ['dumbbells'], notes: 'Neutral grip' },
    ],
  },

  // Intermediate PPL (5 workouts)
  {
    name: 'Intermediate Push Strength',
    type: 'strength' as WorkoutType,
    workoutCategory: 'Push Day',
    durationMin: 45,
    estimatedCalories: 300,
    fitnessLevel: 'intermediate',
    goalType: 'gain_weight',
    equipmentRequired: ['barbell', 'bench', 'dumbbells'],
    exercises: [
      { name: 'Barbell Bench Press', sets: 4, reps: '8-10', equipment: ['barbell', 'bench'], notes: 'Flat' },
      { name: 'Incline Dumbbell Press', sets: 3, reps: '10-12', equipment: ['dumbbells', 'bench'], notes: '30-45 degree' },
      { name: 'Overhead Press', sets: 3, reps: '8-10', equipment: ['barbell'], notes: 'Standing' },
      { name: 'Lateral Raises', sets: 3, reps: '15', equipment: ['dumbbells'], notes: 'Light' },
      { name: 'Tricep Pushdowns', sets: 3, reps: '12-15', equipment: ['cable machine'], notes: 'Cable' },
    ],
  },

  {
    name: 'Intermediate Pull Strength',
    type: 'strength' as WorkoutType,
    workoutCategory: 'Pull Day',
    durationMin: 45,
    estimatedCalories: 305,
    fitnessLevel: 'intermediate',
    goalType: 'gain_weight',
    equipmentRequired: ['barbell', 'pull-up bar', 'dumbbells'],
    exercises: [
      { name: 'Barbell Rows', sets: 4, reps: '8-10', equipment: ['barbell'], notes: 'Pull to sternum' },
      { name: 'Pull-ups', sets: 4, reps: '8-10', equipment: ['pull-up bar'], notes: 'Full ROM' },
      { name: 'Dumbbell Rows', sets: 3, reps: '10-12', equipment: ['dumbbells', 'bench'], notes: 'One arm' },
      { name: 'Face Pulls', sets: 3, reps: '15-20', equipment: ['cable machine'], notes: 'To face' },
      { name: 'Barbell Curls', sets: 3, reps: '10-12', equipment: ['barbell'], notes: 'Strict' },
    ],
  },

  {
    name: 'Intermediate Leg Strength',
    type: 'strength' as WorkoutType,
    workoutCategory: 'Leg Day',
    durationMin: 50,
    estimatedCalories: 350,
    fitnessLevel: 'intermediate',
    goalType: 'gain_weight',
    equipmentRequired: ['barbell', 'squat rack'],
    exercises: [
      { name: 'Back Squats', sets: 4, reps: '8-10', equipment: ['barbell', 'squat rack'], notes: 'Deep' },
      { name: 'Romanian Deadlifts', sets: 4, reps: '10-12', equipment: ['barbell'], notes: 'Hamstrings' },
      { name: 'Leg Press', sets: 3, reps: '12-15', equipment: ['machine'], notes: 'Full ROM' },
      { name: 'Bulgarian Split Squats', sets: 3, reps: '10/leg', equipment: ['dumbbells'], notes: 'Rear elevated' },
      { name: 'Calf Raises', sets: 4, reps: '15-20', equipment: ['machine'], notes: 'Full stretch' },
    ],
  },

  {
    name: 'Intermediate Push Volume',
    type: 'strength' as WorkoutType,
    workoutCategory: 'Push Day',
    durationMin: 45,
    estimatedCalories: 295,
    fitnessLevel: 'intermediate',
    goalType: 'gain_weight',
    equipmentRequired: ['dumbbells', 'bench'],
    exercises: [
      { name: 'Dumbbell Bench Press', sets: 4, reps: '10-12', equipment: ['dumbbells', 'bench'], notes: 'Moderate' },
      { name: 'Incline Flyes', sets: 3, reps: '12-15', equipment: ['dumbbells', 'bench'], notes: 'Stretch at bottom' },
      { name: 'Arnold Press', sets: 3, reps: '10-12', equipment: ['dumbbells'], notes: 'Rotate palms' },
      { name: 'Lateral Raises', sets: 4, reps: '15-20', equipment: ['dumbbells'], notes: 'Light weight' },
      { name: 'Overhead Tricep Extension', sets: 3, reps: '12-15', equipment: ['dumbbells'], notes: 'Cable or dumbbell' },
    ],
  },

  {
    name: 'Intermediate Pull Volume',
    type: 'strength' as WorkoutType,
    workoutCategory: 'Pull Day',
    durationMin: 45,
    estimatedCalories: 300,
    fitnessLevel: 'intermediate',
    goalType: 'gain_weight',
    equipmentRequired: ['dumbbells', 'pull-up bar'],
    exercises: [
      { name: 'Pull-ups', sets: 4, reps: '10-12', equipment: ['pull-up bar'], notes: 'Full ROM' },
      { name: 'Dumbbell Rows', sets: 4, reps: '10-12/arm', equipment: ['dumbbells', 'bench'], notes: 'Heavy' },
      { name: 'Cable Rows', sets: 3, reps: '12-15', equipment: ['cable machine'], notes: 'Squeeze' },
      { name: 'Reverse Flyes', sets: 3, reps: '15', equipment: ['dumbbells'], notes: 'Rear delts' },
      { name: 'Hammer Curls', sets: 3, reps: '12-15', equipment: ['dumbbells'], notes: 'Neutral grip' },
      { name: 'Cable Curls', sets: 3, reps: '15-20', equipment: ['cable machine'], notes: 'Constant tension' },
    ],
  },

  // Advanced PPL (5 workouts)
  {
    name: 'Advanced Push Power',
    type: 'strength' as WorkoutType,
    workoutCategory: 'Push Day',
    durationMin: 55,
    estimatedCalories: 330,
    fitnessLevel: 'advanced',
    goalType: 'gain_weight',
    equipmentRequired: ['barbell', 'bench', 'dumbbells'],
    exercises: [
      { name: 'Barbell Bench Press', sets: 5, reps: '5', equipment: ['barbell', 'bench'], notes: 'Heavy' },
      { name: 'Incline Barbell Press', sets: 4, reps: '6-8', equipment: ['barbell', 'bench'], notes: '30 degree' },
      { name: 'Weighted Dips', sets: 3, reps: '8-10', equipment: ['dip bars', 'weight belt'], notes: 'Heavy' },
      { name: 'Standing Overhead Press', sets: 4, reps: '6-8', equipment: ['barbell'], notes: 'Heavy' },
      { name: 'Lateral Raises', sets: 4, reps: '15-20', equipment: ['dumbbells'], notes: 'Drop set' },
      { name: 'Close Grip Bench', sets: 3, reps: '10-12', equipment: ['barbell', 'bench'], notes: 'Triceps' },
    ],
  },

  {
    name: 'Advanced Pull Power',
    type: 'strength' as WorkoutType,
    workoutCategory: 'Pull Day',
    durationMin: 55,
    estimatedCalories: 325,
    fitnessLevel: 'advanced',
    goalType: 'gain_weight',
    equipmentRequired: ['barbell', 'pull-up bar'],
    exercises: [
      { name: 'Deadlifts', sets: 5, reps: '5', equipment: ['barbell'], notes: 'Max effort' },
      { name: 'Weighted Pull-ups', sets: 4, reps: '6-8', equipment: ['pull-up bar', 'weight belt'], notes: 'Heavy' },
      { name: 'Barbell Rows', sets: 4, reps: '6-8', equipment: ['barbell'], notes: 'Heavy' },
      { name: 'T-Bar Rows', sets: 3, reps: '10-12', equipment: ['barbell'], notes: 'Landmine' },
      { name: 'Barbell Curls', sets: 4, reps: '8-10', equipment: ['barbell'], notes: 'Heavy' },
      { name: 'Hammer Curls', sets: 3, reps: '12-15', equipment: ['dumbbells'], notes: 'Slow negatives' },
    ],
  },

  {
    name: 'Advanced Leg Power',
    type: 'strength' as WorkoutType,
    workoutCategory: 'Leg Day',
    durationMin: 60,
    estimatedCalories: 400,
    fitnessLevel: 'advanced',
    goalType: 'gain_weight',
    equipmentRequired: ['barbell', 'squat rack'],
    exercises: [
      { name: 'Back Squats', sets: 5, reps: '3-5', equipment: ['barbell', 'squat rack'], notes: 'Max effort' },
      { name: 'Front Squats', sets: 4, reps: '6-8', equipment: ['barbell', 'squat rack'], notes: 'Heavy' },
      { name: 'Romanian Deadlifts', sets: 4, reps: '8-10', equipment: ['barbell'], notes: 'Heavy' },
      { name: 'Leg Press', sets: 4, reps: '12-15', equipment: ['machine'], notes: 'Drop set last' },
      { name: 'Walking Lunges', sets: 3, reps: '15/leg', equipment: ['dumbbells'], notes: 'Heavy' },
      { name: 'Standing Calf Raises', sets: 5, reps: '20', equipment: ['machine'], notes: 'Full ROM' },
    ],
  },

  {
    name: 'Advanced Push Hypertrophy',
    type: 'strength' as WorkoutType,
    workoutCategory: 'Push Day',
    durationMin: 55,
    estimatedCalories: 320,
    fitnessLevel: 'advanced',
    goalType: 'gain_weight',
    equipmentRequired: ['barbell', 'dumbbells', 'bench'],
    exercises: [
      { name: 'Barbell Bench Press', sets: 4, reps: '8-10', equipment: ['barbell', 'bench'], notes: 'Moderate-heavy' },
      { name: 'Incline Dumbbell Press', sets: 4, reps: '10-12', equipment: ['dumbbells', 'bench'], notes: '45 degree' },
      { name: 'Cable Flyes', sets: 3, reps: '15', equipment: ['cable machine'], notes: 'Constant tension' },
      { name: 'Overhead Press', sets: 4, reps: '10-12', equipment: ['dumbbells'], notes: 'Standing' },
      { name: 'Lateral Raises', sets: 4, reps: '20', equipment: ['dumbbells'], notes: 'Light, high reps' },
      { name: 'Tricep Rope Pushdowns', sets: 4, reps: '15-20', equipment: ['cable machine'], notes: 'Squeeze' },
      { name: 'Overhead Cable Extension', sets: 3, reps: '15', equipment: ['cable machine'], notes: 'Stretch' },
    ],
  },

  {
    name: 'Advanced Pull Hypertrophy',
    type: 'strength' as WorkoutType,
    workoutCategory: 'Pull Day',
    durationMin: 55,
    estimatedCalories: 315,
    fitnessLevel: 'advanced',
    goalType: 'gain_weight',
    equipmentRequired: ['dumbbells', 'barbell', 'pull-up bar'],
    exercises: [
      { name: 'Pull-ups', sets: 4, reps: '10-12', equipment: ['pull-up bar'], notes: 'Full ROM' },
      { name: 'Barbell Rows', sets: 4, reps: '10-12', equipment: ['barbell'], notes: 'Squeeze' },
      { name: 'Dumbbell Rows', sets: 4, reps: '12-15/arm', equipment: ['dumbbells', 'bench'], notes: 'Moderate weight' },
      { name: 'Cable Rows', sets: 3, reps: '15', equipment: ['cable machine'], notes: 'Constant tension' },
      { name: 'Face Pulls', sets: 4, reps: '20', equipment: ['cable machine'], notes: 'High reps' },
      { name: 'Barbell Curls', sets: 4, reps: '10-12', equipment: ['barbell'], notes: 'Strict' },
      { name: 'Incline Dumbbell Curls', sets: 3, reps: '15', equipment: ['dumbbells', 'bench'], notes: 'Stretch' },
    ],
  },

  // ==================== CARDIO (30 workouts) ====================

  // ========== HIIT Workouts (10 workouts) ==========

  {
    name: 'HIIT Intervals',
    type: 'cardio' as WorkoutType,
    workoutCategory: 'HIIT',
    durationMin: 25,
    estimatedCalories: 300,
    fitnessLevel: 'intermediate',
    goalType: 'lose_weight',
    equipmentRequired: [],
    exercises: [
      { name: 'Burpees', sets: 5, reps: '30 sec on / 30 sec off', equipment: [], notes: 'Max effort' },
      { name: 'High Knees', sets: 5, reps: '30 sec on / 30 sec off', equipment: [], notes: 'Drive knees up' },
      { name: 'Mountain Climbers', sets: 5, reps: '30 sec on / 30 sec off', equipment: [], notes: 'Keep core tight' },
      { name: 'Jumping Jacks', sets: 5, reps: '30 sec on / 30 sec off', equipment: [], notes: 'Full extension' },
    ],
  },

  {
    name: 'Tabata Blast',
    type: 'cardio' as WorkoutType,
    workoutCategory: 'HIIT',
    durationMin: 20,
    estimatedCalories: 280,
    fitnessLevel: 'advanced',
    goalType: 'lose_weight',
    equipmentRequired: [],
    exercises: [
      { name: 'Burpees', sets: 8, reps: '20 sec on / 10 sec off', equipment: [], notes: 'All out effort' },
      { name: 'Jump Squats', sets: 8, reps: '20 sec on / 10 sec off', equipment: [], notes: 'Explosive' },
      { name: 'Push-ups', sets: 8, reps: '20 sec on / 10 sec off', equipment: [], notes: 'Fast pace' },
      { name: 'High Knees', sets: 8, reps: '20 sec on / 10 sec off', equipment: [], notes: 'Max speed' },
    ],
  },

  {
    name: 'Bodyweight HIIT',
    type: 'cardio' as WorkoutType,
    workoutCategory: 'HIIT',
    durationMin: 20,
    estimatedCalories: 270,
    fitnessLevel: 'beginner',
    goalType: 'lose_weight',
    equipmentRequired: [],
    exercises: [
      { name: 'Jumping Jacks', sets: 4, reps: '45 sec on / 15 sec off', equipment: [], notes: 'Full ROM' },
      { name: 'High Knees', sets: 4, reps: '45 sec on / 15 sec off', equipment: [], notes: 'Drive up' },
      { name: 'Butt Kicks', sets: 4, reps: '45 sec on / 15 sec off', equipment: [], notes: 'Heels to glutes' },
      { name: 'Mountain Climbers', sets: 4, reps: '45 sec on / 15 sec off', equipment: [], notes: 'Core tight' },
    ],
  },

  {
    name: 'Sprint Intervals',
    type: 'cardio' as WorkoutType,
    workoutCategory: 'HIIT',
    durationMin: 25,
    estimatedCalories: 320,
    fitnessLevel: 'intermediate',
    goalType: 'lose_weight',
    equipmentRequired: [],
    exercises: [
      { name: 'Sprint', sets: 8, reps: '30 sec sprint / 90 sec walk', equipment: [], notes: 'Max effort sprints' },
    ],
  },

  {
    name: 'Bike HIIT',
    type: 'cardio' as WorkoutType,
    workoutCategory: 'HIIT',
    durationMin: 20,
    estimatedCalories: 290,
    fitnessLevel: 'intermediate',
    goalType: 'lose_weight',
    equipmentRequired: ['stationary bike'],
    exercises: [
      { name: 'Bike Sprint', sets: 10, reps: '20 sec sprint / 40 sec easy', equipment: ['stationary bike'], notes: 'High resistance sprints' },
    ],
  },

  {
    name: 'Rowing HIIT',
    type: 'cardio' as WorkoutType,
    workoutCategory: 'HIIT',
    durationMin: 20,
    estimatedCalories: 310,
    fitnessLevel: 'advanced',
    goalType: 'lose_weight',
    equipmentRequired: ['rowing machine'],
    exercises: [
      { name: 'Row Sprint', sets: 8, reps: '30 sec max effort / 30 sec rest', equipment: ['rowing machine'], notes: 'Pull hard' },
    ],
  },

  {
    name: 'Jump Rope HIIT',
    type: 'cardio' as WorkoutType,
    workoutCategory: 'HIIT',
    durationMin: 15,
    estimatedCalories: 250,
    fitnessLevel: 'intermediate',
    goalType: 'lose_weight',
    equipmentRequired: ['jump rope'],
    exercises: [
      { name: 'Jump Rope', sets: 10, reps: '45 sec on / 15 sec off', equipment: ['jump rope'], notes: 'Fast pace' },
    ],
  },

  {
    name: 'Stair HIIT',
    type: 'cardio' as WorkoutType,
    workoutCategory: 'HIIT',
    durationMin: 20,
    estimatedCalories: 300,
    fitnessLevel: 'intermediate',
    goalType: 'lose_weight',
    equipmentRequired: ['stairs'],
    exercises: [
      { name: 'Stair Sprints', sets: 8, reps: '30 sec sprint up / 90 sec walk down', equipment: ['stairs'], notes: 'Max effort' },
    ],
  },

  {
    name: 'Battle Ropes HIIT',
    type: 'cardio' as WorkoutType,
    workoutCategory: 'HIIT',
    durationMin: 15,
    estimatedCalories: 260,
    fitnessLevel: 'advanced',
    goalType: 'lose_weight',
    equipmentRequired: ['battle ropes'],
    exercises: [
      { name: 'Alternating Waves', sets: 6, reps: '30 sec on / 30 sec off', equipment: ['battle ropes'], notes: 'Fast waves' },
      { name: 'Double Waves', sets: 6, reps: '30 sec on / 30 sec off', equipment: ['battle ropes'], notes: 'Both arms' },
    ],
  },

  {
    name: 'Kettlebell HIIT',
    type: 'cardio' as WorkoutType,
    workoutCategory: 'HIIT',
    durationMin: 20,
    estimatedCalories: 290,
    fitnessLevel: 'intermediate',
    goalType: 'lose_weight',
    equipmentRequired: ['kettlebell'],
    exercises: [
      { name: 'Kettlebell Swings', sets: 8, reps: '40 sec on / 20 sec off', equipment: ['kettlebell'], notes: 'Hip hinge' },
      { name: 'Kettlebell Snatches', sets: 6, reps: '30 sec/arm', equipment: ['kettlebell'], notes: 'Explosive' },
    ],
  },

  // ========== Steady State Cardio (10 workouts) ==========

  {
    name: 'Steady State Cardio',
    type: 'cardio' as WorkoutType,
    workoutCategory: 'Endurance',
    durationMin: 30,
    estimatedCalories: 250,
    fitnessLevel: 'beginner',
    goalType: 'lose_weight',
    equipmentRequired: [],
    exercises: [
      { name: 'Jogging', sets: 1, reps: '30 min', equipment: [], notes: 'Maintain steady pace' },
    ],
  },

  {
    name: 'Long Distance Run',
    type: 'cardio' as WorkoutType,
    workoutCategory: 'Endurance',
    durationMin: 45,
    estimatedCalories: 400,
    fitnessLevel: 'intermediate',
    goalType: 'lose_weight',
    equipmentRequired: [],
    exercises: [
      { name: 'Running', sets: 1, reps: '45 min', equipment: [], notes: 'Conversational pace' },
    ],
  },

  {
    name: 'Easy Bike Ride',
    type: 'cardio' as WorkoutType,
    workoutCategory: 'Endurance',
    durationMin: 40,
    estimatedCalories: 300,
    fitnessLevel: 'beginner',
    goalType: 'maintain',
    equipmentRequired: ['stationary bike'],
    exercises: [
      { name: 'Cycling', sets: 1, reps: '40 min', equipment: ['stationary bike'], notes: 'Steady pace' },
    ],
  },

  {
    name: 'Rowing Endurance',
    type: 'cardio' as WorkoutType,
    workoutCategory: 'Endurance',
    durationMin: 30,
    estimatedCalories: 280,
    fitnessLevel: 'intermediate',
    goalType: 'lose_weight',
    equipmentRequired: ['rowing machine'],
    exercises: [
      { name: 'Rowing', sets: 1, reps: '30 min', equipment: ['rowing machine'], notes: 'Steady stroke rate' },
    ],
  },

  {
    name: 'Swimming Laps',
    type: 'cardio' as WorkoutType,
    workoutCategory: 'Endurance',
    durationMin: 30,
    estimatedCalories: 300,
    fitnessLevel: 'intermediate',
    goalType: 'lose_weight',
    equipmentRequired: ['pool'],
    exercises: [
      { name: 'Freestyle Swimming', sets: 1, reps: '30 min', equipment: ['pool'], notes: 'Continuous laps' },
    ],
  },

  {
    name: 'Elliptical Steady',
    type: 'cardio' as WorkoutType,
    workoutCategory: 'Endurance',
    durationMin: 35,
    estimatedCalories: 270,
    fitnessLevel: 'beginner',
    goalType: 'lose_weight',
    equipmentRequired: ['elliptical'],
    exercises: [
      { name: 'Elliptical', sets: 1, reps: '35 min', equipment: ['elliptical'], notes: 'Moderate resistance' },
    ],
  },

  {
    name: 'Brisk Walk',
    type: 'cardio' as WorkoutType,
    workoutCategory: 'Endurance',
    durationMin: 45,
    estimatedCalories: 200,
    fitnessLevel: 'beginner',
    goalType: 'lose_weight',
    equipmentRequired: [],
    exercises: [
      { name: 'Walking', sets: 1, reps: '45 min', equipment: [], notes: 'Brisk pace, swing arms' },
    ],
  },

  {
    name: 'Incline Treadmill Walk',
    type: 'cardio' as WorkoutType,
    workoutCategory: 'Endurance',
    durationMin: 30,
    estimatedCalories: 240,
    fitnessLevel: 'beginner',
    goalType: 'lose_weight',
    equipmentRequired: ['treadmill'],
    exercises: [
      { name: 'Incline Walking', sets: 1, reps: '30 min', equipment: ['treadmill'], notes: '10-15% incline, 3-3.5 mph' },
    ],
  },

  {
    name: 'StairMaster Steady',
    type: 'cardio' as WorkoutType,
    workoutCategory: 'Endurance',
    durationMin: 25,
    estimatedCalories: 260,
    fitnessLevel: 'intermediate',
    goalType: 'lose_weight',
    equipmentRequired: ['stairmaster'],
    exercises: [
      { name: 'StairMaster', sets: 1, reps: '25 min', equipment: ['stairmaster'], notes: 'Steady climb' },
    ],
  },

  {
    name: 'Low Impact Cardio',
    type: 'cardio' as WorkoutType,
    workoutCategory: 'Endurance',
    durationMin: 30,
    estimatedCalories: 220,
    fitnessLevel: 'beginner',
    goalType: 'maintain',
    equipmentRequired: [],
    exercises: [
      { name: 'Marching in Place', sets: 6, reps: '5 min', equipment: [], notes: 'Lift knees high' },
      { name: 'Side Steps', sets: 6, reps: '30 sec', equipment: [], notes: 'Wide steps' },
    ],
  },

  // ========== Sports/Athletic Cardio (10 workouts) ==========

  {
    name: 'Basketball Drills',
    type: 'cardio' as WorkoutType,
    workoutCategory: 'Athletic',
    durationMin: 40,
    estimatedCalories: 350,
    fitnessLevel: 'intermediate',
    goalType: 'maintain',
    equipmentRequired: ['basketball'],
    exercises: [
      { name: 'Dribbling Drills', sets: 3, reps: '5 min', equipment: ['basketball'], notes: 'Crossovers, between legs' },
      { name: 'Shooting Practice', sets: 3, reps: '5 min', equipment: ['basketball', 'hoop'], notes: 'Around key' },
      { name: 'Suicides', sets: 3, reps: '3 reps', equipment: [], notes: 'Court sprints' },
    ],
  },

  {
    name: 'Soccer Conditioning',
    type: 'cardio' as WorkoutType,
    workoutCategory: 'Athletic',
    durationMin: 35,
    estimatedCalories: 330,
    fitnessLevel: 'intermediate',
    goalType: 'lose_weight',
    equipmentRequired: ['soccer ball'],
    exercises: [
      { name: 'Dribbling', sets: 1, reps: '10 min', equipment: ['soccer ball'], notes: 'Around cones' },
      { name: 'Sprints', sets: 6, reps: '40m', equipment: [], notes: 'Shuttle runs' },
      { name: 'Passing Drills', sets: 1, reps: '10 min', equipment: ['soccer ball'], notes: 'Against wall' },
    ],
  },

  {
    name: 'Tennis Match Play',
    type: 'cardio' as WorkoutType,
    workoutCategory: 'Athletic',
    durationMin: 45,
    estimatedCalories: 340,
    fitnessLevel: 'intermediate',
    goalType: 'maintain',
    equipmentRequired: ['tennis racket'],
    exercises: [
      { name: 'Singles Match', sets: 1, reps: '45 min', equipment: ['tennis racket', 'tennis balls'], notes: 'Competitive play' },
    ],
  },

  {
    name: 'Boxing Workout',
    type: 'cardio' as WorkoutType,
    workoutCategory: 'Athletic',
    durationMin: 30,
    estimatedCalories: 350,
    fitnessLevel: 'intermediate',
    goalType: 'lose_weight',
    equipmentRequired: ['heavy bag', 'boxing gloves'],
    exercises: [
      { name: 'Heavy Bag Work', sets: 6, reps: '3 min rounds / 1 min rest', equipment: ['heavy bag', 'boxing gloves'], notes: 'Combinations' },
      { name: 'Speed Bag', sets: 3, reps: '2 min', equipment: ['speed bag'], notes: 'Rhythm work' },
    ],
  },

  {
    name: 'Shadow Boxing',
    type: 'cardio' as WorkoutType,
    workoutCategory: 'Athletic',
    durationMin: 20,
    estimatedCalories: 240,
    fitnessLevel: 'beginner',
    goalType: 'lose_weight',
    equipmentRequired: [],
    exercises: [
      { name: 'Shadow Boxing', sets: 6, reps: '3 min rounds / 1 min rest', equipment: [], notes: 'Practice combinations' },
    ],
  },

  {
    name: 'Kickboxing Cardio',
    type: 'cardio' as WorkoutType,
    workoutCategory: 'Athletic',
    durationMin: 30,
    estimatedCalories: 360,
    fitnessLevel: 'intermediate',
    goalType: 'lose_weight',
    equipmentRequired: ['heavy bag'],
    exercises: [
      { name: 'Bag Combos', sets: 6, reps: '3 min / 1 min rest', equipment: ['heavy bag'], notes: 'Punches + kicks' },
      { name: 'Roundhouse Kicks', sets: 3, reps: '20/leg', equipment: [], notes: 'Air kicks' },
    ],
  },

  {
    name: 'Jump Rope Endurance',
    type: 'cardio' as WorkoutType,
    workoutCategory: 'Athletic',
    durationMin: 20,
    estimatedCalories: 260,
    fitnessLevel: 'intermediate',
    goalType: 'lose_weight',
    equipmentRequired: ['jump rope'],
    exercises: [
      { name: 'Jump Rope', sets: 5, reps: '3 min / 1 min rest', equipment: ['jump rope'], notes: 'Steady rhythm' },
      { name: 'Double Unders', sets: 3, reps: '30 reps', equipment: ['jump rope'], notes: 'Two spins per jump' },
    ],
  },

  {
    name: 'Agility Ladder Drills',
    type: 'cardio' as WorkoutType,
    workoutCategory: 'Athletic',
    durationMin: 25,
    estimatedCalories: 270,
    fitnessLevel: 'intermediate',
    goalType: 'maintain',
    equipmentRequired: ['agility ladder'],
    exercises: [
      { name: 'In-Out Drill', sets: 4, reps: '30 sec', equipment: ['agility ladder'], notes: 'Fast feet' },
      { name: 'Lateral Shuffle', sets: 4, reps: '30 sec', equipment: ['agility ladder'], notes: 'Side to side' },
      { name: 'Ickey Shuffle', sets: 4, reps: '30 sec', equipment: ['agility ladder'], notes: 'In-in-out pattern' },
    ],
  },

  {
    name: 'Hill Sprints',
    type: 'cardio' as WorkoutType,
    workoutCategory: 'Athletic',
    durationMin: 20,
    estimatedCalories: 300,
    fitnessLevel: 'advanced',
    goalType: 'lose_weight',
    equipmentRequired: [],
    exercises: [
      { name: 'Hill Sprint', sets: 8, reps: '20 sec sprint / 2 min walk down', equipment: [], notes: 'Find steep hill' },
    ],
  },

  {
    name: 'Sled Push/Pull',
    type: 'cardio' as WorkoutType,
    workoutCategory: 'Athletic',
    durationMin: 20,
    estimatedCalories: 320,
    fitnessLevel: 'advanced',
    goalType: 'lose_weight',
    equipmentRequired: ['sled'],
    exercises: [
      { name: 'Sled Pushes', sets: 6, reps: '30m', equipment: ['sled'], notes: 'Heavy weight' },
      { name: 'Sled Pulls', sets: 6, reps: '30m', equipment: ['sled', 'rope'], notes: 'Backward walk' },
    ],
  },

  // ==================== BALANCED/HYBRID (10 workouts) ====================

  {
    name: 'CrossFit-Style WOD',
    type: 'cardio' as WorkoutType,
    workoutCategory: 'Circuit',
    durationMin: 35,
    estimatedCalories: 400,
    fitnessLevel: 'advanced',
    goalType: 'maintain',
    equipmentRequired: ['dumbbells', 'pull-up bar'],
    exercises: [
      { name: 'Thrusters', sets: 5, reps: '15', equipment: ['dumbbells'], notes: 'Squat to press' },
      { name: 'Pull-ups', sets: 5, reps: '10', equipment: ['pull-up bar'], notes: 'No kipping' },
      { name: 'Box Jumps', sets: 5, reps: '15', equipment: ['box'], notes: 'Land softly' },
      { name: 'Kettlebell Swings', sets: 5, reps: '20', equipment: ['kettlebell'], notes: 'Hip hinge' },
    ],
  },

  {
    name: 'Athletic Conditioning',
    type: 'cardio' as WorkoutType,
    workoutCategory: 'Athletic',
    durationMin: 40,
    estimatedCalories: 350,
    fitnessLevel: 'intermediate',
    goalType: 'maintain',
    equipmentRequired: ['dumbbells'],
    exercises: [
      { name: 'Jump Rope', sets: 3, reps: '2 min', equipment: ['jump rope'], notes: 'Stay light on feet' },
      { name: 'Med Ball Slams', sets: 3, reps: '15', equipment: ['medicine ball'], notes: 'Explosive' },
      { name: 'Lateral Lunges', sets: 3, reps: '12/side', equipment: ['dumbbells'], notes: 'Wide stance' },
      { name: 'Battle Ropes', sets: 3, reps: '45 sec', equipment: ['battle ropes'], notes: 'Alternating waves' },
    ],
  },

  {
    name: 'Full Body Circuit',
    type: 'cardio' as WorkoutType,
    workoutCategory: 'Circuit',
    durationMin: 30,
    estimatedCalories: 320,
    fitnessLevel: 'beginner',
    goalType: 'lose_weight',
    equipmentRequired: ['dumbbells'],
    exercises: [
      { name: 'Squats', sets: 3, reps: '15', equipment: [], notes: 'Bodyweight' },
      { name: 'Push-ups', sets: 3, reps: '12', equipment: [], notes: 'Full or modified' },
      { name: 'Lunges', sets: 3, reps: '12/leg', equipment: [], notes: 'Alternating' },
      { name: 'Dumbbell Rows', sets: 3, reps: '12', equipment: ['dumbbells'], notes: 'Both arms' },
      { name: 'Plank', sets: 3, reps: '45 sec', equipment: [], notes: 'Hold steady' },
    ],
  },

  {
    name: 'EMOM Challenge',
    type: 'cardio' as WorkoutType,
    workoutCategory: 'Circuit',
    durationMin: 20,
    estimatedCalories: 300,
    fitnessLevel: 'intermediate',
    goalType: 'lose_weight',
    equipmentRequired: ['dumbbells'],
    exercises: [
      { name: 'Burpees', sets: 20, reps: '10 reps at start of each minute', equipment: [], notes: 'Every minute on the minute' },
      { name: 'Dumbbell Snatches', sets: 20, reps: '8 reps at start of each minute', equipment: ['dumbbells'], notes: 'Alternate exercise each minute' },
    ],
  },

  {
    name: 'Strength & Conditioning Mix',
    type: 'cardio' as WorkoutType,
    workoutCategory: 'Circuit',
    durationMin: 35,
    estimatedCalories: 340,
    fitnessLevel: 'intermediate',
    goalType: 'maintain',
    equipmentRequired: ['barbell', 'kettlebell'],
    exercises: [
      { name: 'Deadlifts', sets: 4, reps: '10', equipment: ['barbell'], notes: 'Moderate weight' },
      { name: 'Kettlebell Swings', sets: 4, reps: '20', equipment: ['kettlebell'], notes: 'Hip drive' },
      { name: 'Box Jumps', sets: 4, reps: '12', equipment: ['box'], notes: 'Explosive' },
      { name: 'Push-ups', sets: 4, reps: '15', equipment: [], notes: 'Full ROM' },
    ],
  },

  {
    name: 'Cardio-Strength Superset',
    type: 'cardio' as WorkoutType,
    workoutCategory: 'Circuit',
    durationMin: 30,
    estimatedCalories: 330,
    fitnessLevel: 'intermediate',
    goalType: 'lose_weight',
    equipmentRequired: ['dumbbells'],
    exercises: [
      { name: 'Goblet Squats + Jump Squats', sets: 4, reps: '10 + 10', equipment: ['dumbbells'], notes: 'Superset' },
      { name: 'Push-ups + Mountain Climbers', sets: 4, reps: '12 + 20', equipment: [], notes: 'Superset' },
      { name: 'Lunges + High Knees', sets: 4, reps: '12 + 30 sec', equipment: [], notes: 'Superset' },
    ],
  },

  {
    name: 'Bootcamp Style',
    type: 'cardio' as WorkoutType,
    workoutCategory: 'Circuit',
    durationMin: 40,
    estimatedCalories: 370,
    fitnessLevel: 'intermediate',
    goalType: 'lose_weight',
    equipmentRequired: ['dumbbells'],
    exercises: [
      { name: 'Burpees', sets: 3, reps: '15', equipment: [], notes: 'Full burpee' },
      { name: 'Kettlebell Swings', sets: 3, reps: '20', equipment: ['kettlebell'], notes: 'Hip hinge' },
      { name: 'Box Step-ups', sets: 3, reps: '15/leg', equipment: ['box'], notes: 'Alternating' },
      { name: 'Battle Ropes', sets: 3, reps: '45 sec', equipment: ['battle ropes'], notes: 'Alternating waves' },
      { name: 'Sled Push', sets: 3, reps: '30m', equipment: ['sled'], notes: 'Heavy' },
    ],
  },

  {
    name: 'Metabolic Conditioning',
    type: 'cardio' as WorkoutType,
    workoutCategory: 'Circuit',
    durationMin: 25,
    estimatedCalories: 310,
    fitnessLevel: 'advanced',
    goalType: 'lose_weight',
    equipmentRequired: ['dumbbells', 'pull-up bar'],
    exercises: [
      { name: 'Thrusters', sets: 4, reps: '15', equipment: ['dumbbells'], notes: 'No rest between exercises' },
      { name: 'Pull-ups', sets: 4, reps: '10', equipment: ['pull-up bar'], notes: 'Kipping OK' },
      { name: 'Burpees', sets: 4, reps: '15', equipment: [], notes: 'Full burpee' },
      { name: 'Kettlebell Swings', sets: 4, reps: '20', equipment: ['kettlebell'], notes: 'Russian style' },
    ],
  },

  {
    name: 'Partner WOD',
    type: 'cardio' as WorkoutType,
    workoutCategory: 'Circuit',
    durationMin: 30,
    estimatedCalories: 340,
    fitnessLevel: 'intermediate',
    goalType: 'maintain',
    equipmentRequired: ['dumbbells', 'medicine ball'],
    exercises: [
      { name: 'Med Ball Partner Toss', sets: 4, reps: '20 tosses', equipment: ['medicine ball'], notes: 'Chest pass' },
      { name: 'Wheelbarrow Push-ups', sets: 3, reps: '10/person', equipment: [], notes: 'Switch roles' },
      { name: 'Partner Plank Hold', sets: 3, reps: '60 sec', equipment: [], notes: 'Both hold plank' },
    ],
  },

  {
    name: 'Functional Fitness Mix',
    type: 'cardio' as WorkoutType,
    workoutCategory: 'Circuit',
    durationMin: 35,
    estimatedCalories: 350,
    fitnessLevel: 'intermediate',
    goalType: 'maintain',
    equipmentRequired: ['kettlebell', 'dumbbells'],
    exercises: [
      { name: 'Turkish Get-ups', sets: 3, reps: '5/side', equipment: ['kettlebell'], notes: 'Slow and controlled' },
      { name: 'Farmer Carries', sets: 3, reps: '50m', equipment: ['dumbbells'], notes: 'Heavy dumbbells' },
      { name: 'Sled Drags', sets: 3, reps: '30m', equipment: ['sled'], notes: 'Backward walk' },
      { name: 'Sandbag Carries', sets: 3, reps: '40m', equipment: ['sandbag'], notes: 'Bear hug' },
    ],
  },
];

export async function seedWorkoutLibrary() {
  console.log('🏋️  Seeding workout library...');

  let successCount = 0;
  let errorCount = 0;

  for (const workout of workouts) {
    try {
      await prisma.workout.create({
        data: {
          name: workout.name,
          type: workout.type,
          workoutCategory: workout.workoutCategory,
          durationMin: workout.durationMin,
          estimatedCalories: workout.estimatedCalories,
          userId: 'library', // Special userId for library workouts
          dayOfWeek: 0, // Not applicable for library
          // Store additional metadata in a compatible way
          // Equipment and exercises would be stored in related tables in production
        },
      });
      successCount++;
    } catch (error) {
      console.error(`Failed to seed workout: ${workout.name}`, error);
      errorCount++;
    }
  }

  console.log(`✅ Seeded ${successCount} workouts`);
  if (errorCount > 0) {
    console.log(`❌ Failed to seed ${errorCount} workouts`);
  }

  return { successCount, errorCount };
}

// Run directly if called as script
if (require.main === module) {
  seedWorkoutLibrary()
    .then(() => {
      console.log('✅ Workout library seed complete');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Workout library seed failed:', error);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
