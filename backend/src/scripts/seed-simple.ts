/**
 * Simple Database Seed Script
 * Creates standalone meals and workouts without meal/workout plans
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Mock user ID (from anonymous Firebase auth)
const MOCK_USER_ID = 'vyFQKpuGfygvtIfIwSqpdc9hrSw2';

async function main() {
  console.log('🌱 Starting simple database seed...');

  // Clear existing data for this user
  console.log('🧹 Clearing existing data...');
  await prisma.meal.deleteMany({ where: { userId: MOCK_USER_ID } });
  await prisma.workout.deleteMany({ where: { userId: MOCK_USER_ID } });

  // Get today's date at midnight
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  console.log('🍽️  Creating meals...');

  // Breakfast
  await prisma.meal.create({
    data: {
      userId: MOCK_USER_ID,
      name: 'Greek Yogurt Parfait with Berries',
      imageUrl: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800',
      mealType: 'breakfast',
      dayOfWeek: today.getDay(),
      calories: 420,
      macros: { protein: 28, carbs: 52, fat: 10 },
      prepTimeMin: 5,
      cookTimeMin: 0,
      servings: 1,
      ingredients: {
        create: [
          { name: 'Greek yogurt', quantity: 1, unit: 'cup', category: 'dairy_eggs', displayOrder: 1 },
          { name: 'Mixed berries', quantity: 0.5, unit: 'cup', category: 'produce', displayOrder: 2 },
          { name: 'Granola', quantity: 0.25, unit: 'cup', category: 'pantry', displayOrder: 3 },
          { name: 'Honey', quantity: 1, unit: 'tbsp', category: 'pantry', displayOrder: 4 },
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
  await prisma.meal.create({
    data: {
      userId: MOCK_USER_ID,
      name: 'Grilled Chicken & Quinoa Bowl',
      imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800',
      mealType: 'lunch',
      dayOfWeek: today.getDay(),
      calories: 520,
      macros: { protein: 41, carbs: 52, fat: 18 },
      prepTimeMin: 15,
      cookTimeMin: 25,
      isFavorite: true,
      ingredients: {
        create: [
          { name: 'Chicken breast', quantity: 6, unit: 'oz', category: 'proteins', displayOrder: 1 },
          { name: 'Quinoa', quantity: 0.5, unit: 'cup', category: 'pantry', displayOrder: 2 },
          { name: 'Mixed vegetables', quantity: 1, unit: 'cup', category: 'produce', displayOrder: 3 },
          { name: 'Lemon', quantity: 0.5, unit: 'count', category: 'produce', displayOrder: 4 },
          { name: 'Garlic powder', quantity: 1, unit: 'tsp', category: 'spices', displayOrder: 5 },
          { name: 'Salt', quantity: 0.5, unit: 'tsp', category: 'spices', displayOrder: 6 },
          { name: 'Pepper', quantity: 0.25, unit: 'tsp', category: 'spices', displayOrder: 7 },
        ],
      },
      recipeSteps: {
        create: [
          { stepNumber: 1, instruction: 'Cook quinoa according to package directions.' },
          { stepNumber: 2, instruction: 'Season chicken with garlic powder, salt, and pepper.' },
          { stepNumber: 3, instruction: 'Grill chicken for 6-7 minutes per side until 165°F.' },
          { stepNumber: 4, instruction: 'Steam vegetables until tender-crisp.' },
          { stepNumber: 5, instruction: 'Assemble bowl with quinoa, veggies, and sliced chicken.' },
          { stepNumber: 6, instruction: 'Squeeze lemon over top and serve.' },
        ],
      },
    },
  });

  // Snack
  await prisma.meal.create({
    data: {
      userId: MOCK_USER_ID,
      name: 'Protein Smoothie',
      imageUrl: 'https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=800',
      mealType: 'snack',
      dayOfWeek: today.getDay(),
      calories: 280,
      macros: { protein: 25, carbs: 32, fat: 8 },
      prepTimeMin: 5,
      cookTimeMin: 0,
      ingredients: {
        create: [
          { name: 'Protein powder', quantity: 1, unit: 'package', category: 'proteins', displayOrder: 1 },
          { name: 'Banana', quantity: 1, unit: 'count', category: 'produce', displayOrder: 2 },
          { name: 'Almond milk', quantity: 1, unit: 'cup', category: 'dairy_eggs', displayOrder: 3 },
          { name: 'Peanut butter', quantity: 1, unit: 'tbsp', category: 'pantry', displayOrder: 4 },
        ],
      },
      recipeSteps: {
        create: [
          { stepNumber: 1, instruction: 'Add all ingredients to a blender.' },
          { stepNumber: 2, instruction: 'Blend until smooth.' },
          { stepNumber: 3, instruction: 'Pour and enjoy!' },
        ],
      },
    },
  });

  // Dinner
  await prisma.meal.create({
    data: {
      userId: MOCK_USER_ID,
      name: 'Baked Salmon with Sweet Potato',
      imageUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800',
      mealType: 'dinner',
      dayOfWeek: today.getDay(),
      calories: 580,
      macros: { protein: 38, carbs: 48, fat: 24 },
      prepTimeMin: 10,
      cookTimeMin: 30,
      isFavorite: true,
      ingredients: {
        create: [
          { name: 'Salmon fillet', quantity: 6, unit: 'oz', category: 'proteins', displayOrder: 1 },
          { name: 'Sweet potato', quantity: 1, unit: 'count', category: 'produce', displayOrder: 2 },
          { name: 'Asparagus', quantity: 8, unit: 'count', category: 'produce', displayOrder: 3 },
          { name: 'Lemon', quantity: 1, unit: 'count', category: 'produce', displayOrder: 4 },
          { name: 'Dill', quantity: 1, unit: 'tbsp', category: 'spices', displayOrder: 5 },
        ],
      },
      recipeSteps: {
        create: [
          { stepNumber: 1, instruction: 'Preheat oven to 400°F.' },
          { stepNumber: 2, instruction: 'Pierce sweet potato and microwave 5 minutes.' },
          { stepNumber: 3, instruction: 'Place salmon on baking sheet.' },
          { stepNumber: 4, instruction: 'Season with lemon juice and dill.' },
          { stepNumber: 5, instruction: 'Add asparagus around salmon.' },
          { stepNumber: 6, instruction: 'Bake 12-15 minutes until salmon flakes.' },
          { stepNumber: 7, instruction: 'Serve with sweet potato.' },
        ],
      },
    },
  });

  console.log('✅ Seed completed successfully!');
  console.log(`📝 Created 4 meals for user ${MOCK_USER_ID}`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
