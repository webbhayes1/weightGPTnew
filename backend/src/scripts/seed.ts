/**
 * Database Seed Script
 * Populates the database with mock meal plans, workouts, and progress data for testing
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Mock user ID (from anonymous Firebase auth)
const MOCK_USER_ID = 'vyFQKpuGfygvtIfIwSqpdc9hrSw2';

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing data for this user
  console.log('🧹 Clearing existing data...');
  await prisma.meal.deleteMany({ where: { userId: MOCK_USER_ID } });
  await prisma.workout.deleteMany({ where: { userId: MOCK_USER_ID } });
  await prisma.mealPlan.deleteMany({ where: { userId: MOCK_USER_ID } });
  await prisma.workoutPlan.deleteMany({ where: { userId: MOCK_USER_ID } });

  // Get today's date at midnight
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  console.log('🍽️  Creating meals...');

  // Breakfast
  const breakfast = await prisma.meal.create({
    data: {
      userId: MOCK_USER_ID,
      name: 'Greek Yogurt Parfait with Berries',
      description: 'High-protein breakfast with fresh berries and granola',
      imageUrl: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800',
      mealType: 'breakfast',
      dayOfWeek: today.getDay(),
      calories: 420,
      macros: { protein: 28, carbs: 52, fat: 10 },
      prepTimeMin: 5,
      cookTimeMin: 0,
      servings: 1,
      isFavorite: false,
      isDisliked: false,
      logged: false,
      ingredients: {
        create: [
          { name: 'Greek yogurt', quantity: 1, unit: 'cup', category: 'dairy', displayOrder: 1 },
          { name: 'Mixed berries', quantity: 0.5, unit: 'cup', category: 'fruit', displayOrder: 2 },
          { name: 'Granola', quantity: 0.25, unit: 'cup', category: 'grains', displayOrder: 3 },
          { name: 'Honey', quantity: 1, unit: 'tbsp', category: 'sweetener', displayOrder: 4 },
        ],
      },
      recipeSteps: {
        create: [
          { stepNumber: 1, instruction: 'Add Greek yogurt to a bowl.' },
          { stepNumber: 2, instruction: 'Top with mixed berries and granola.' },
          { stepNumber: 3, instruction: 'Drizzle with honey and serve immediately.' },
        ],
      },
    },
  });

  // Lunch
  const lunch = await prisma.meal.create({
    data: {
      userId: MOCK_USER_ID,
      name: 'Grilled Chicken & Quinoa Bowl',
      description: 'Lean protein with complex carbs and colorful veggies',
      imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800',
      mealType: 'lunch',
      dayOfWeek: today.getDay(),
      calories: 520,
      macros: { protein: 41, carbs: 52, fat: 18 },
      prepTimeMin: 15,
      cookTimeMin: 25,
      servings: 1,
      isFavorite: true,
      isDisliked: false,
      logged: false,
      ingredients: {
        create: [
          { name: 'Chicken breast', quantity: 6, unit: 'oz', category: 'protein', displayOrder: 1 },
          { name: 'Quinoa', quantity: 0.5, unit: 'cup', category: 'grains', displayOrder: 2 },
          { name: 'Olive oil', quantity: 1, unit: 'tbsp', category: 'fat', displayOrder: 3 },
          { name: 'Mixed vegetables', quantity: 1, unit: 'cup', category: 'vegetables', displayOrder: 4 },
          { name: 'Lemon', quantity: 0.5, unit: 'count', category: 'produce', displayOrder: 5 },
          { name: 'Garlic powder', quantity: 1, unit: 'tsp', category: 'spices', displayOrder: 6 },
          { name: 'Salt', quantity: 0.5, unit: 'tsp', category: 'spices', displayOrder: 7 },
          { name: 'Black pepper', quantity: 0.25, unit: 'tsp', category: 'spices', displayOrder: 8 },
        ],
      },
      recipeSteps: {
        create: [
          { stepNumber: 1, instruction: 'Cook quinoa according to package directions. Set aside.' },
          { stepNumber: 2, instruction: 'Season chicken breast with garlic powder, salt, and pepper.' },
          { stepNumber: 3, instruction: 'Heat olive oil in a large skillet over medium-high heat.' },
          { stepNumber: 4, instruction: 'Add chicken and cook for 6-7 minutes per side until internal temperature reaches 165°F.' },
          { stepNumber: 5, instruction: 'While chicken cooks, steam or sauté mixed vegetables until tender-crisp.' },
          { stepNumber: 6, instruction: 'Remove chicken from heat and let rest for 5 minutes.' },
          { stepNumber: 7, instruction: 'Slice chicken into strips.' },
          { stepNumber: 8, instruction: 'Assemble bowl with quinoa, vegetables, and sliced chicken. Squeeze lemon over top and serve.' },
        ],
      },
    },
  });

  // Snack
  const snack = await prisma.meal.create({
    data: {
      userId: MOCK_USER_ID,
      name: 'Protein Smoothie',
      description: 'Quick and easy protein-packed snack',
      imageUrl: 'https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=800',
      mealType: 'snack',
      dayOfWeek: today.getDay(),
      calories: 280,
      macros: { protein: 25, carbs: 32, fat: 8 },
      prepTimeMin: 5,
      cookTimeMin: 0,
      servings: 1,
      isFavorite: false,
      isDisliked: false,
      logged: false,
      ingredients: {
        create: [
          { name: 'Protein powder', quantity: 1, unit: 'scoop', category: 'protein', displayOrder: 1 },
          { name: 'Banana', quantity: 1, unit: 'count', category: 'fruit', displayOrder: 2 },
          { name: 'Almond milk', quantity: 1, unit: 'cup', category: 'dairy', displayOrder: 3 },
          { name: 'Peanut butter', quantity: 1, unit: 'tbsp', category: 'fat', displayOrder: 4 },
          { name: 'Ice', quantity: 0.5, unit: 'cup', category: 'other', displayOrder: 5 },
        ],
      },
      recipeSteps: {
        create: [
          { stepNumber: 1, instruction: 'Add all ingredients to a blender.' },
          { stepNumber: 2, instruction: 'Blend on high for 30-60 seconds until smooth.' },
          { stepNumber: 3, instruction: 'Pour into a glass and enjoy immediately.' },
        ],
      },
    },
  });

  // Dinner
  const dinner = await prisma.meal.create({
    data: {
      userId: MOCK_USER_ID,
      name: 'Baked Salmon with Sweet Potato',
      description: 'Omega-3 rich salmon with nutrient-dense sweet potato',
      imageUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800',
      mealType: 'dinner',
      dayOfWeek: today.getDay(),
      calories: 580,
      macros: { protein: 38, carbs: 48, fat: 24 },
      prepTimeMin: 10,
      cookTimeMin: 30,
      servings: 1,
      isFavorite: true,
      isDisliked: false,
      logged: false,
      ingredients: {
        create: [
          { name: 'Salmon fillet', quantity: 6, unit: 'oz', category: 'protein', displayOrder: 1 },
          { name: 'Sweet potato', quantity: 1, unit: 'medium', category: 'carbs', displayOrder: 2 },
          { name: 'Asparagus', quantity: 8, unit: 'spears', category: 'vegetables', displayOrder: 3 },
          { name: 'Olive oil', quantity: 1.5, unit: 'tbsp', category: 'fat', displayOrder: 4 },
          { name: 'Lemon', quantity: 1, unit: 'count', category: 'produce', displayOrder: 5 },
          { name: 'Garlic', quantity: 2, unit: 'cloves', category: 'aromatics', displayOrder: 6 },
          { name: 'Dill', quantity: 1, unit: 'tbsp', category: 'herbs', displayOrder: 7 },
        ],
      },
      recipeSteps: {
        create: [
          { stepNumber: 1, instruction: 'Preheat oven to 400°F (200°C).' },
          { stepNumber: 2, instruction: 'Pierce sweet potato with a fork and microwave for 5 minutes to par-cook.' },
          { stepNumber: 3, instruction: 'Place salmon on a baking sheet lined with parchment paper.' },
          { stepNumber: 4, instruction: 'Drizzle salmon with olive oil, squeeze lemon juice, and sprinkle with dill, salt, and pepper.' },
          { stepNumber: 5, instruction: 'Arrange asparagus around salmon, drizzle with remaining olive oil.' },
          { stepNumber: 6, instruction: 'Bake for 12-15 minutes until salmon flakes easily with a fork.' },
          { stepNumber: 7, instruction: 'While salmon bakes, finish cooking sweet potato in microwave for 3-5 more minutes.' },
          { stepNumber: 8, instruction: 'Serve salmon with sweet potato and asparagus.' },
        ],
      },
    },
  });

  console.log('🏋️  Creating workouts...');

  // Morning workout
  const morningWorkout = await prisma.workout.create({
    data: {
      userId: MOCK_USER_ID,
      name: 'Morning HIIT Cardio',
      description: '20-minute high-intensity interval training session',
      dayOfWeek: today.getDay(),
      durationMinutes: 25, // 5 min warmup + 20 min HIIT
      estimatedCalories: 280,
      exerciseCount: 6,
      logged: false,
      isFavorited: false,
    },
  });

  // Afternoon workout
  const afternoonWorkout = await prisma.workout.create({
    data: {
      userId: MOCK_USER_ID,
      name: 'Upper Body Strength',
      description: 'Chest, shoulders, and triceps workout',
      dayOfWeek: today.getDay(),
      durationMinutes: 45,
      estimatedCalories: 350,
      exerciseCount: 8,
      logged: false,
      isFavorited: true,
    },
  });

  console.log('📊 Creating meal and workout plans...');

  // Create meal plan for today
  await prisma.mealPlan.create({
    data: {
      userId: MOCK_USER_ID,
      weekStartDate: today,
      meals: {
        connect: [
          { id: breakfast.id },
          { id: lunch.id },
          { id: snack.id },
          { id: dinner.id },
        ],
      },
      totalCalories: breakfast.calories + lunch.calories + snack.calories + dinner.calories,
      totalProtein: 132, // Sum of all meal proteins
      totalCarbs: 184, // Sum of all meal carbs
      totalFat: 60, // Sum of all meal fats
    },
  });

  // Create workout plan for today
  await prisma.workoutPlan.create({
    data: {
      userId: MOCK_USER_ID,
      weekStartDate: today,
      workouts: {
        connect: [
          { id: morningWorkout.id },
          { id: afternoonWorkout.id },
        ],
      },
      totalDurationMinutes: morningWorkout.durationMinutes + afternoonWorkout.durationMinutes,
      totalCaloriesBurned: (morningWorkout.estimatedCalories || 0) + (afternoonWorkout.estimatedCalories || 0),
    },
  });

  console.log('✅ Seed completed successfully!');
  console.log(`📝 Created ${4} meals and ${2} workouts for user ${MOCK_USER_ID}`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
