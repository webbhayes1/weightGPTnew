/**
 * Auto Seed Script
 * Automatically finds the most recent Firebase user and creates test data
 * Usage: npm run seed:auto
 */

import { PrismaClient, Goal, Gender, ActivityLevel, FitnessLevel } from '@prisma/client';

const prisma = new PrismaClient();

async function seedAuto() {
  console.log('🔍 Looking for most recent user...');

  // Find the most recently created user
  const recentUser = await prisma.user.findFirst({
    orderBy: {
      createdAt: 'desc',
    },
  });

  if (!recentUser) {
    console.error('❌ No users found in database');
    console.log('💡 Make sure the app has launched and Firebase anonymous auth has run');
    process.exit(1);
  }

  console.log(`✅ Found user: ${recentUser.firebaseUid}`);
  console.log(`   Email: ${recentUser.email}`);
  console.log(`   Created: ${recentUser.createdAt}`);

  // Check if user already has meal plan
  const existingMealPlan = await prisma.mealPlan.findFirst({
    where: { userId: recentUser.id },
  });

  if (existingMealPlan) {
    console.log('⚠️  User already has a meal plan. Deleting old data...');

    // Delete old data
    await prisma.meal.deleteMany({ where: { userId: recentUser.id } });
    await prisma.workout.deleteMany({ where: { userId: recentUser.id } });
    await prisma.mealPlan.deleteMany({ where: { userId: recentUser.id } });
    await prisma.workoutPlan.deleteMany({ where: { userId: recentUser.id } });

    console.log('✅ Old data cleared');
  }

  // Update user with sample data
  await prisma.user.update({
    where: { id: recentUser.id },
    data: {
      goal: Goal.lose_weight,
      currentWeight: 185.5,
      goalWeight: 175.0,
      height: 70.0,
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

  console.log('✅ Updated user profile with sample data');

  // Get current week
  const today = new Date();
  const dayOfWeek = today.getDay();
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() + mondayOffset);
  weekStart.setHours(0, 0, 0, 0);

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  weekEnd.setHours(23, 59, 59, 999);

  console.log(`📅 Creating plans for: ${weekStart.toISOString().split('T')[0]} to ${weekEnd.toISOString().split('T')[0]}`);

  // Create meal plan
  const mealPlan = await prisma.mealPlan.create({
    data: {
      userId: recentUser.id,
      weekStartDate: weekStart,
      weekEndDate: weekEnd,
      status: 'active',
    },
  });

  // Sample meals
  const meals = [
    // Monday
    { day: 1, type: 'breakfast', name: 'Protein Pancakes with Berries', calories: 380, macros: { protein: 32, carbs: 45, fat: 12 } },
    { day: 1, type: 'lunch', name: 'Grilled Chicken Caesar Salad', calories: 520, macros: { protein: 41, carbs: 28, fat: 24 } },
    { day: 1, type: 'dinner', name: 'Baked Salmon with Quinoa', calories: 650, macros: { protein: 48, carbs: 62, fat: 22 } },
    { day: 1, type: 'snack', name: 'Greek Yogurt & Almonds', calories: 280, macros: { protein: 18, carbs: 22, fat: 14 } },
    // Tuesday
    { day: 2, type: 'breakfast', name: 'Oatmeal with Protein Powder', calories: 400, macros: { protein: 30, carbs: 52, fat: 10 } },
    { day: 2, type: 'lunch', name: 'Turkey & Avocado Wrap', calories: 480, macros: { protein: 38, carbs: 42, fat: 18 } },
    { day: 2, type: 'dinner', name: 'Lean Beef Stir-Fry', calories: 620, macros: { protein: 46, carbs: 58, fat: 20 } },
    { day: 2, type: 'snack', name: 'Protein Bar', calories: 250, macros: { protein: 20, carbs: 24, fat: 8 } },
    // Wednesday
    { day: 3, type: 'breakfast', name: 'Scrambled Eggs & Toast', calories: 420, macros: { protein: 28, carbs: 38, fat: 16 } },
    { day: 3, type: 'lunch', name: 'Tuna Salad Bowl', calories: 500, macros: { protein: 42, carbs: 32, fat: 22 } },
    { day: 3, type: 'dinner', name: 'Chicken Breast with Sweet Potato', calories: 580, macros: { protein: 50, carbs: 62, fat: 14 } },
    { day: 3, type: 'snack', name: 'Apple & Peanut Butter', calories: 240, macros: { protein: 8, carbs: 28, fat: 12 } },
    // Thursday
    { day: 4, type: 'breakfast', name: 'Protein Smoothie Bowl', calories: 390, macros: { protein: 32, carbs: 48, fat: 10 } },
    { day: 4, type: 'lunch', name: 'Grilled Chicken Bowl', calories: 520, macros: { protein: 41, carbs: 52, fat: 18 } },
    { day: 4, type: 'dinner', name: 'Salmon with Quinoa', calories: 650, macros: { protein: 48, carbs: 62, fat: 22 } },
    { day: 4, type: 'snack', name: 'Cottage Cheese & Berries', calories: 220, macros: { protein: 24, carbs: 20, fat: 6 } },
    // Friday
    { day: 5, type: 'breakfast', name: 'Egg White Omelette', calories: 360, macros: { protein: 30, carbs: 32, fat: 12 } },
    { day: 5, type: 'lunch', name: 'Shrimp & Veggie Pasta', calories: 540, macros: { protein: 38, carbs: 60, fat: 16 } },
    { day: 5, type: 'dinner', name: 'Turkey Meatballs with Zoodles', calories: 480, macros: { protein: 44, carbs: 38, fat: 18 } },
    { day: 5, type: 'snack', name: 'Protein Shake', calories: 280, macros: { protein: 30, carbs: 24, fat: 8 } },
    // Saturday
    { day: 6, type: 'breakfast', name: 'French Toast with Berries', calories: 440, macros: { protein: 26, carbs: 58, fat: 14 } },
    { day: 6, type: 'lunch', name: 'Grilled Steak Salad', calories: 580, macros: { protein: 46, carbs: 28, fat: 28 } },
    { day: 6, type: 'dinner', name: 'BBQ Chicken with Rice', calories: 620, macros: { protein: 50, carbs: 64, fat: 16 } },
    { day: 6, type: 'snack', name: 'Trail Mix', calories: 260, macros: { protein: 10, carbs: 28, fat: 14 } },
    // Sunday
    { day: 0, type: 'breakfast', name: 'Veggie Omelette', calories: 380, macros: { protein: 28, carbs: 24, fat: 20 } },
    { day: 0, type: 'lunch', name: 'Chicken Fajita Bowl', calories: 560, macros: { protein: 44, carbs: 56, fat: 18 } },
    { day: 0, type: 'dinner', name: 'Baked Cod with Vegetables', calories: 480, macros: { protein: 42, carbs: 38, fat: 16 } },
    { day: 0, type: 'snack', name: 'Protein Muffin', calories: 240, macros: { protein: 18, carbs: 26, fat: 8 } },
  ];

  for (const meal of meals) {
    await prisma.meal.create({
      data: {
        userId: recentUser.id,
        mealPlanId: mealPlan.id,
        dayOfWeek: meal.day,
        mealType: meal.type as any,
        name: meal.name,
        calories: meal.calories,
        macros: meal.macros,
      },
    });
  }

  console.log(`✅ Created ${meals.length} meals`);

  // Create workout plan
  const workoutPlan = await prisma.workoutPlan.create({
    data: {
      userId: recentUser.id,
      weekStartDate: weekStart,
      weekEndDate: weekEnd,
      status: 'active',
    },
  });

  // Sample workouts
  const workouts = [
    { day: 1, name: 'Upper Body Strength', type: 'strength', duration: 45, calories: 280, category: 'upper_body' },
    { day: 3, name: 'Lower Body Power', type: 'strength', duration: 50, calories: 320, category: 'lower_body' },
    { day: 4, name: 'HIIT Cardio', type: 'cardio', duration: 30, calories: 220, category: 'hiit' },
    { day: 5, name: 'Full Body Circuit', type: 'strength', duration: 40, calories: 260, category: 'full_body' },
    { day: 6, name: 'Yoga & Stretching', type: 'cardio', duration: 30, calories: 120, category: 'flexibility' },
  ];

  for (const workout of workouts) {
    await prisma.workout.create({
      data: {
        userId: recentUser.id,
        workoutPlanId: workoutPlan.id,
        dayOfWeek: workout.day,
        name: workout.name,
        type: workout.type as any,
        workoutCategory: workout.category as any,
        durationMin: workout.duration,
        estimatedCalories: workout.calories,
      },
    });
  }

  console.log(`✅ Created ${workouts.length} workouts`);
  console.log('🎉 Seed complete! Pull down to refresh in the app.');
}

seedAuto()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
