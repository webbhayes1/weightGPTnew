/**
 * Seed Data for Current Anonymous User
 * Usage: npm run seed:user <firebase-uid>
 *
 * Quick development script to create test data for the authenticated user
 */

import { PrismaClient, Goal, Gender, ActivityLevel, FitnessLevel } from '@prisma/client';

const prisma = new PrismaClient();

async function seedForUser(firebaseUid: string) {
  console.log(`🌱 Creating seed data for Firebase UID: ${firebaseUid}`);

  // Create or update user with this Firebase UID
  const user = await prisma.user.upsert({
    where: { firebaseUid },
    update: {}, // Don't overwrite existing user data
    create: {
      firebaseUid,
      email: `${firebaseUid}@anon.weightgpt.com`, // Fake email for anonymous users
      passwordHash: 'FIREBASE_ANONYMOUS_USER', // Placeholder for Firebase users
      name: 'Test User',
      goal: Goal.lose_weight,
      currentWeight: 185.5,
      goalWeight: 175.0,
      height: 70.0, // 5'10"
      age: 30,
      gender: Gender.male,
      activityLevel: ActivityLevel.moderately_active,
      workoutFrequency: 4,
      fitnessLevel: FitnessLevel.intermediate,
      bmr: 1800,
      tdee: 2500,
      dailyCalories: 2200,
      macros: {
        protein: 165,
        carbs: 220,
        fat: 73,
      },
      eatingPattern: {
        mealsPerDay: 3,
        snacks: 1,
      },
      onboardingComplete: true,
    },
  });

  console.log(`✅ User created/found: ${user.id}`);

  // Get current week range (Monday to Sunday)
  const today = new Date();
  const dayOfWeek = today.getDay();
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() + mondayOffset);
  weekStart.setHours(0, 0, 0, 0);

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  weekEnd.setHours(23, 59, 59, 999);

  console.log(`📅 Week: ${weekStart.toISOString().split('T')[0]} to ${weekEnd.toISOString().split('T')[0]}`);

  // Delete existing plans (cascade deletes will remove meals/workouts automatically)
  await prisma.mealPlan.deleteMany({
    where: { userId: user.id },
  });
  await prisma.workoutPlan.deleteMany({
    where: { userId: user.id },
  });

  console.log('🗑️  Cleared existing plans');

  // Create meal plan
  const mealPlan = await prisma.mealPlan.create({
    data: {
      userId: user.id,
      weekStartDate: weekStart,
      weekEndDate: weekEnd,
      status: 'active',
    },
  });

  // Meal data for the week
  const mealData: Array<{
    day: number;
    type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
    name: string;
    calories: number;
    macros: { protein: number; carbs: number; fat: number };
  }> = [
    // Monday (dayOfWeek: 1)
    { day: 1, type: 'breakfast', name: 'Protein Pancakes with Berries', calories: 380, macros: { protein: 32, carbs: 45, fat: 12 } },
    { day: 1, type: 'lunch', name: 'Grilled Chicken Caesar Salad', calories: 520, macros: { protein: 41, carbs: 28, fat: 24 } },
    { day: 1, type: 'dinner', name: 'Baked Salmon with Quinoa', calories: 650, macros: { protein: 48, carbs: 62, fat: 22 } },
    { day: 1, type: 'snack', name: 'Greek Yogurt & Almonds', calories: 280, macros: { protein: 18, carbs: 22, fat: 14 } },

    // Tuesday (dayOfWeek: 2)
    { day: 2, type: 'breakfast', name: 'Oatmeal with Protein Powder', calories: 400, macros: { protein: 30, carbs: 52, fat: 10 } },
    { day: 2, type: 'lunch', name: 'Turkey & Avocado Wrap', calories: 480, macros: { protein: 38, carbs: 42, fat: 18 } },
    { day: 2, type: 'dinner', name: 'Lean Beef Stir-Fry', calories: 620, macros: { protein: 46, carbs: 58, fat: 20 } },
    { day: 2, type: 'snack', name: 'Protein Bar', calories: 250, macros: { protein: 20, carbs: 24, fat: 8 } },

    // Wednesday (dayOfWeek: 3)
    { day: 3, type: 'breakfast', name: 'Scrambled Eggs & Toast', calories: 420, macros: { protein: 28, carbs: 38, fat: 16 } },
    { day: 3, type: 'lunch', name: 'Tuna Salad Bowl', calories: 500, macros: { protein: 42, carbs: 32, fat: 22 } },
    { day: 3, type: 'dinner', name: 'Chicken Breast with Sweet Potato', calories: 580, macros: { protein: 50, carbs: 62, fat: 14 } },
    { day: 3, type: 'snack', name: 'Apple & Peanut Butter', calories: 240, macros: { protein: 8, carbs: 28, fat: 12 } },

    // Thursday (dayOfWeek: 4)
    { day: 4, type: 'breakfast', name: 'Protein Smoothie Bowl', calories: 390, macros: { protein: 32, carbs: 48, fat: 10 } },
    { day: 4, type: 'lunch', name: 'Grilled Chicken Bowl', calories: 520, macros: { protein: 41, carbs: 52, fat: 18 } },
    { day: 4, type: 'dinner', name: 'Salmon with Quinoa', calories: 650, macros: { protein: 48, carbs: 62, fat: 22 } },
    { day: 4, type: 'snack', name: 'Cottage Cheese & Berries', calories: 220, macros: { protein: 24, carbs: 20, fat: 6 } },

    // Friday (dayOfWeek: 5)
    { day: 5, type: 'breakfast', name: 'Egg White Omelette', calories: 360, macros: { protein: 30, carbs: 32, fat: 12 } },
    { day: 5, type: 'lunch', name: 'Shrimp & Veggie Pasta', calories: 540, macros: { protein: 38, carbs: 60, fat: 16 } },
    { day: 5, type: 'dinner', name: 'Turkey Meatballs with Zoodles', calories: 480, macros: { protein: 44, carbs: 38, fat: 18 } },
    { day: 5, type: 'snack', name: 'Protein Shake', calories: 280, macros: { protein: 30, carbs: 24, fat: 8 } },

    // Saturday (dayOfWeek: 6)
    { day: 6, type: 'breakfast', name: 'French Toast with Berries', calories: 440, macros: { protein: 26, carbs: 58, fat: 14 } },
    { day: 6, type: 'lunch', name: 'Grilled Steak Salad', calories: 580, macros: { protein: 46, carbs: 28, fat: 28 } },
    { day: 6, type: 'dinner', name: 'BBQ Chicken with Rice', calories: 620, macros: { protein: 50, carbs: 64, fat: 16 } },
    { day: 6, type: 'snack', name: 'Trail Mix', calories: 260, macros: { protein: 10, carbs: 28, fat: 14 } },

    // Sunday (dayOfWeek: 0)
    { day: 0, type: 'breakfast', name: 'Veggie Omelette', calories: 380, macros: { protein: 28, carbs: 24, fat: 20 } },
    { day: 0, type: 'lunch', name: 'Chicken Fajita Bowl', calories: 560, macros: { protein: 44, carbs: 56, fat: 18 } },
    { day: 0, type: 'dinner', name: 'Baked Cod with Vegetables', calories: 480, macros: { protein: 42, carbs: 38, fat: 16 } },
    { day: 0, type: 'snack', name: 'Protein Muffin', calories: 240, macros: { protein: 18, carbs: 26, fat: 8 } },
  ];

  for (const meal of mealData) {
    await prisma.meal.create({
      data: {
        userId: user.id,
        mealPlanId: mealPlan.id,
        dayOfWeek: meal.day,
        mealType: meal.type,
        name: meal.name,
        calories: meal.calories,
        macros: meal.macros,
      },
    });
  }

  console.log(`✅ Created ${mealData.length} meals`);

  // Create workout plan
  const workoutPlan = await prisma.workoutPlan.create({
    data: {
      userId: user.id,
      weekStartDate: weekStart,
      weekEndDate: weekEnd,
      status: 'active',
    },
  });

  // Workout data
  const workoutData = [
    { day: 1, name: 'Upper Body Strength', type: 'strength', duration: 45, calories: 280, category: 'upper_body' },
    { day: 3, name: 'Lower Body Power', type: 'strength', duration: 50, calories: 320, category: 'lower_body' },
    { day: 4, name: 'HIIT Cardio', type: 'cardio', duration: 30, calories: 220, category: 'hiit' },
    { day: 5, name: 'Full Body Circuit', type: 'strength', duration: 40, calories: 260, category: 'full_body' },
    { day: 6, name: 'Yoga & Stretching', type: 'cardio', duration: 30, calories: 120, category: 'flexibility' },
  ];

  for (const workout of workoutData) {
    await prisma.workout.create({
      data: {
        userId: user.id,
        workoutPlanId: workoutPlan.id,
        dayOfWeek: workout.day,
        name: workout.name,
        type: workout.type as 'strength' | 'cardio',
        workoutCategory: workout.category as any,
        durationMin: workout.duration,
        estimatedCalories: workout.calories,
      },
    });
  }

  console.log(`✅ Created ${workoutData.length} workouts`);
  console.log('🎉 Seed data created successfully!');
}

// Get Firebase UID from command line argument
const firebaseUid = process.argv[2];

if (!firebaseUid) {
  console.error('❌ Error: Firebase UID required');
  console.log('Usage: npm run seed:user <firebase-uid>');
  console.log('Example: npm run seed:user xK7mQ2pN3dR8sL9vT4w');
  process.exit(1);
}

seedForUser(firebaseUid)
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
