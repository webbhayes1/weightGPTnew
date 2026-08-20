/**
 * Database Seed Script
 * Creates test data for development
 */

import { PrismaClient, Goal, Gender, ActivityLevel, FitnessLevel } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create test user
  console.log('Creating test user...');
  const passwordHash = await bcrypt.hash('password123', 10);

  const user = await prisma.user.upsert({
    where: { email: 'test@weightgpt.com' },
    update: {},
    create: {
      email: 'test@weightgpt.com',
      name: 'Test User',
      passwordHash,
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
        protein: 165, // g
        carbs: 220,   // g
        fat: 73,      // g
      },
      eatingPattern: {
        mealsPerDay: 3,
        snacks: 1,
      },
      onboardingComplete: true,
    },
  });

  console.log(`✅ Created test user: ${user.email}`);

  // Clean up existing data for this user
  console.log('Cleaning up existing data...');
  // Delete exercises via their workouts
  await prisma.exercise.deleteMany({
    where: { workout: { userId: user.id } }
  });
  // Delete meal ingredients and recipe steps via their meals
  await prisma.ingredient.deleteMany({
    where: { meal: { userId: user.id } }
  });
  await prisma.recipeStep.deleteMany({
    where: { meal: { userId: user.id } }
  });
  await prisma.meal.deleteMany({ where: { userId: user.id } });
  await prisma.workout.deleteMany({ where: { userId: user.id } });
  await prisma.mealPlan.deleteMany({ where: { userId: user.id } });
  await prisma.workoutPlan.deleteMany({ where: { userId: user.id } });
  console.log('✅ Cleaned up existing data');

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

  console.log(`📅 Week range: ${weekStart.toISOString().split('T')[0]} to ${weekEnd.toISOString().split('T')[0]}`);

  // Create meal plan for this week
  console.log('Creating meal plan...');
  const mealPlan = await prisma.mealPlan.create({
    data: {
      userId: user.id,
      weekStartDate: weekStart,
      weekEndDate: weekEnd,
      status: 'active',
    },
  });

  // Create meals for each day of the week
  interface MealSeedData {
    day: number;
    type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
    name: string;
    calories: number;
    macros: { protein: number; carbs: number; fat: number };
    prepTime?: number;
    cookTime?: number;
    ingredients: Array<{ name: string; quantity: number; unit: string; category?: string }>;
    steps: string[];
  }

  const mealData: MealSeedData[] = [
    // Monday (dayOfWeek: 1)
    {
      day: 1, type: 'breakfast', name: 'Protein Pancakes with Berries', calories: 380, macros: { protein: 32, carbs: 45, fat: 12 },
      prepTime: 10, cookTime: 15,
      ingredients: [
        { name: 'Protein powder (vanilla)', quantity: 1, unit: 'count', category: 'proteins' },
        { name: 'Oat flour', quantity: 0.5, unit: 'cup', category: 'pantry' },
        { name: 'Egg whites', quantity: 3, unit: 'count', category: 'proteins' },
        { name: 'Greek yogurt', quantity: 0.25, unit: 'cup', category: 'dairy_eggs' },
        { name: 'Mixed berries', quantity: 0.5, unit: 'cup', category: 'produce' },
        { name: 'Maple syrup (sugar-free)', quantity: 2, unit: 'tbsp', category: 'pantry' },
      ],
      steps: [
        'Mix protein powder, oat flour, egg whites, and Greek yogurt in a bowl until smooth.',
        'Heat a non-stick pan over medium heat and lightly spray with cooking oil.',
        'Pour batter to form 4-inch pancakes, cook until bubbles form on surface.',
        'Flip and cook another 1-2 minutes until golden brown.',
        'Top with mixed berries and sugar-free maple syrup.',
      ],
    },
    {
      day: 1, type: 'lunch', name: 'Grilled Chicken Caesar Salad', calories: 520, macros: { protein: 41, carbs: 28, fat: 24 },
      prepTime: 15, cookTime: 12,
      ingredients: [
        { name: 'Chicken breast', quantity: 6, unit: 'oz', category: 'proteins' },
        { name: 'Romaine lettuce', quantity: 3, unit: 'cup', category: 'produce' },
        { name: 'Parmesan cheese', quantity: 2, unit: 'tbsp', category: 'dairy_eggs' },
        { name: 'Caesar dressing (light)', quantity: 2, unit: 'tbsp', category: 'pantry' },
        { name: 'Croutons', quantity: 0.25, unit: 'cup', category: 'pantry' },
        { name: 'Lemon juice', quantity: 1, unit: 'tbsp', category: 'pantry' },
      ],
      steps: [
        'Season chicken breast with salt, pepper, and garlic powder.',
        'Grill chicken over medium-high heat for 5-6 minutes per side until internal temp reaches 165°F.',
        'Let chicken rest for 5 minutes, then slice into strips.',
        'Toss romaine with Caesar dressing and lemon juice.',
        'Top with sliced chicken, parmesan, and croutons.',
      ],
    },
    {
      day: 1, type: 'dinner', name: 'Baked Salmon with Quinoa', calories: 650, macros: { protein: 48, carbs: 62, fat: 22 },
      prepTime: 10, cookTime: 25,
      ingredients: [
        { name: 'Salmon fillet', quantity: 6, unit: 'oz', category: 'proteins' },
        { name: 'Quinoa', quantity: 0.75, unit: 'cup', category: 'pantry' },
        { name: 'Asparagus', quantity: 6, unit: 'count', category: 'produce' },
        { name: 'Olive oil', quantity: 1, unit: 'tbsp', category: 'pantry' },
        { name: 'Lemon', quantity: 1, unit: 'count', category: 'produce' },
        { name: 'Dill (fresh)', quantity: 1, unit: 'tbsp', category: 'spices' },
        { name: 'Garlic', quantity: 2, unit: 'count', category: 'produce' },
      ],
      steps: [
        'Preheat oven to 400°F. Rinse quinoa and cook according to package directions.',
        'Place salmon on a lined baking sheet. Drizzle with olive oil, minced garlic, lemon juice, and dill.',
        'Arrange asparagus around salmon. Season everything with salt and pepper.',
        'Bake for 12-15 minutes until salmon flakes easily with a fork.',
        'Serve salmon over quinoa with roasted asparagus on the side.',
      ],
    },
    {
      day: 1, type: 'snack', name: 'Greek Yogurt & Almonds', calories: 280, macros: { protein: 18, carbs: 22, fat: 14 },
      prepTime: 2, cookTime: 0,
      ingredients: [
        { name: 'Greek yogurt (plain, 2%)', quantity: 1, unit: 'cup', category: 'dairy_eggs' },
        { name: 'Almonds (raw)', quantity: 1, unit: 'oz', category: 'pantry' },
        { name: 'Honey', quantity: 1, unit: 'tsp', category: 'pantry' },
      ],
      steps: [
        'Scoop Greek yogurt into a bowl.',
        'Top with almonds and drizzle with honey.',
        'Mix gently and enjoy immediately.',
      ],
    },

    // Tuesday (dayOfWeek: 2)
    { day: 2, type: 'breakfast', name: 'Oatmeal with Protein Powder', calories: 400, macros: { protein: 30, carbs: 52, fat: 10 }, prepTime: 5, cookTime: 5, ingredients: [{ name: 'Oats', quantity: 0.5, unit: 'cup', category: 'pantry' }, { name: 'Protein powder', quantity: 1, unit: 'count', category: 'proteins' }, { name: 'Almond milk', quantity: 1, unit: 'cup', category: 'dairy_eggs' }, { name: 'Banana', quantity: 1, unit: 'count', category: 'produce' }], steps: ['Cook oats with almond milk.', 'Stir in protein powder.', 'Top with sliced banana.'] },
    { day: 2, type: 'lunch', name: 'Turkey & Avocado Wrap', calories: 480, macros: { protein: 38, carbs: 42, fat: 18 }, prepTime: 10, cookTime: 0, ingredients: [{ name: 'Turkey breast', quantity: 4, unit: 'oz', category: 'proteins' }, { name: 'Avocado', quantity: 1, unit: 'count', category: 'produce' }, { name: 'Whole wheat wrap', quantity: 1, unit: 'count', category: 'bakery' }, { name: 'Lettuce', quantity: 1, unit: 'cup', category: 'produce' }], steps: ['Lay out wrap and add turkey.', 'Add sliced avocado and lettuce.', 'Roll up tightly and slice in half.'] },
    { day: 2, type: 'dinner', name: 'Lean Beef Stir-Fry', calories: 620, macros: { protein: 46, carbs: 58, fat: 20 }, prepTime: 15, cookTime: 12, ingredients: [{ name: 'Lean beef strips', quantity: 5, unit: 'oz', category: 'proteins' }, { name: 'Mixed vegetables', quantity: 2, unit: 'cup', category: 'produce' }, { name: 'Brown rice', quantity: 0.75, unit: 'cup', category: 'pantry' }, { name: 'Soy sauce', quantity: 2, unit: 'tbsp', category: 'pantry' }], steps: ['Cook brown rice according to package.', 'Stir-fry beef until browned.', 'Add vegetables and soy sauce.', 'Serve over rice.'] },
    { day: 2, type: 'snack', name: 'Protein Bar', calories: 250, macros: { protein: 20, carbs: 24, fat: 8 }, prepTime: 0, cookTime: 0, ingredients: [{ name: 'Protein bar', quantity: 1, unit: 'count', category: 'proteins' }], steps: ['Unwrap and enjoy.'] },

    // Wednesday (dayOfWeek: 3)
    { day: 3, type: 'breakfast', name: 'Scrambled Eggs & Toast', calories: 420, macros: { protein: 28, carbs: 38, fat: 16 }, prepTime: 5, cookTime: 8, ingredients: [{ name: 'Eggs', quantity: 3, unit: 'count', category: 'dairy_eggs' }, { name: 'Whole wheat toast', quantity: 2, unit: 'count', category: 'bakery' }, { name: 'Butter', quantity: 1, unit: 'tsp', category: 'dairy_eggs' }], steps: ['Scramble eggs in a non-stick pan.', 'Toast bread.', 'Serve eggs with buttered toast.'] },
    { day: 3, type: 'lunch', name: 'Tuna Salad Bowl', calories: 500, macros: { protein: 42, carbs: 32, fat: 22 }, prepTime: 10, cookTime: 0, ingredients: [{ name: 'Tuna (canned)', quantity: 5, unit: 'oz', category: 'proteins' }, { name: 'Mixed greens', quantity: 2, unit: 'cup', category: 'produce' }, { name: 'Cherry tomatoes', quantity: 0.5, unit: 'cup', category: 'produce' }, { name: 'Olive oil', quantity: 1, unit: 'tbsp', category: 'pantry' }], steps: ['Drain tuna and flake with a fork.', 'Arrange greens in a bowl.', 'Top with tuna and tomatoes.', 'Drizzle with olive oil.'] },
    { day: 3, type: 'dinner', name: 'Chicken Breast with Sweet Potato', calories: 580, macros: { protein: 50, carbs: 62, fat: 14 }, prepTime: 10, cookTime: 30, ingredients: [{ name: 'Chicken breast', quantity: 6, unit: 'oz', category: 'proteins' }, { name: 'Sweet potato', quantity: 1, unit: 'count', category: 'produce' }, { name: 'Broccoli', quantity: 1, unit: 'cup', category: 'produce' }], steps: ['Preheat oven to 400°F.', 'Bake chicken and sweet potato for 25-30 min.', 'Steam broccoli.', 'Serve together.'] },
    { day: 3, type: 'snack', name: 'Apple & Peanut Butter', calories: 240, macros: { protein: 8, carbs: 28, fat: 12 }, prepTime: 3, cookTime: 0, ingredients: [{ name: 'Apple', quantity: 1, unit: 'count', category: 'produce' }, { name: 'Peanut butter', quantity: 2, unit: 'tbsp', category: 'pantry' }], steps: ['Slice apple.', 'Serve with peanut butter for dipping.'] },

    // Thursday (dayOfWeek: 4)
    { day: 4, type: 'breakfast', name: 'Protein Smoothie Bowl', calories: 390, macros: { protein: 32, carbs: 48, fat: 10 }, prepTime: 5, cookTime: 0, ingredients: [{ name: 'Protein powder', quantity: 1, unit: 'count', category: 'proteins' }, { name: 'Frozen berries', quantity: 1, unit: 'cup', category: 'frozen' }, { name: 'Banana', quantity: 1, unit: 'count', category: 'produce' }, { name: 'Almond milk', quantity: 0.5, unit: 'cup', category: 'dairy_eggs' }, { name: 'Granola', quantity: 0.25, unit: 'cup', category: 'pantry' }], steps: ['Blend protein, berries, banana, and milk until thick.', 'Pour into bowl.', 'Top with granola.'] },
    { day: 4, type: 'lunch', name: 'Grilled Chicken Bowl', calories: 520, macros: { protein: 41, carbs: 52, fat: 18 }, prepTime: 10, cookTime: 15, ingredients: [{ name: 'Chicken breast', quantity: 5, unit: 'oz', category: 'proteins' }, { name: 'Brown rice', quantity: 0.75, unit: 'cup', category: 'pantry' }, { name: 'Black beans', quantity: 0.5, unit: 'cup', category: 'pantry' }, { name: 'Salsa', quantity: 0.25, unit: 'cup', category: 'pantry' }], steps: ['Grill chicken and slice.', 'Prepare rice.', 'Assemble bowl with chicken, rice, beans, and salsa.'] },
    { day: 4, type: 'dinner', name: 'Salmon with Quinoa', calories: 650, macros: { protein: 48, carbs: 62, fat: 22 }, prepTime: 10, cookTime: 20, ingredients: [{ name: 'Salmon fillet', quantity: 6, unit: 'oz', category: 'proteins' }, { name: 'Quinoa', quantity: 0.75, unit: 'cup', category: 'pantry' }, { name: 'Asparagus', quantity: 6, unit: 'count', category: 'produce' }], steps: ['Cook quinoa.', 'Bake salmon at 400°F for 12-15 min.', 'Roast asparagus.', 'Serve together.'] },
    { day: 4, type: 'snack', name: 'Cottage Cheese & Berries', calories: 220, macros: { protein: 24, carbs: 20, fat: 6 }, prepTime: 2, cookTime: 0, ingredients: [{ name: 'Cottage cheese', quantity: 1, unit: 'cup', category: 'dairy_eggs' }, { name: 'Mixed berries', quantity: 0.5, unit: 'cup', category: 'produce' }], steps: ['Scoop cottage cheese into bowl.', 'Top with berries.'] },

    // Friday (dayOfWeek: 5)
    { day: 5, type: 'breakfast', name: 'Egg White Omelette', calories: 360, macros: { protein: 30, carbs: 32, fat: 12 }, prepTime: 5, cookTime: 8, ingredients: [{ name: 'Egg whites', quantity: 5, unit: 'count', category: 'dairy_eggs' }, { name: 'Spinach', quantity: 1, unit: 'cup', category: 'produce' }, { name: 'Feta cheese', quantity: 1, unit: 'oz', category: 'dairy_eggs' }, { name: 'Whole wheat toast', quantity: 1, unit: 'count', category: 'bakery' }], steps: ['Cook egg whites in non-stick pan.', 'Add spinach and feta.', 'Fold and serve with toast.'] },
    { day: 5, type: 'lunch', name: 'Shrimp & Veggie Pasta', calories: 540, macros: { protein: 38, carbs: 60, fat: 16 }, prepTime: 10, cookTime: 15, ingredients: [{ name: 'Shrimp', quantity: 5, unit: 'oz', category: 'proteins' }, { name: 'Whole wheat pasta', quantity: 2, unit: 'oz', category: 'pantry' }, { name: 'Zucchini', quantity: 1, unit: 'count', category: 'produce' }, { name: 'Marinara sauce', quantity: 0.5, unit: 'cup', category: 'pantry' }], steps: ['Cook pasta according to package.', 'Sauté shrimp and zucchini.', 'Toss with pasta and marinara.'] },
    { day: 5, type: 'dinner', name: 'Turkey Meatballs with Zoodles', calories: 480, macros: { protein: 44, carbs: 38, fat: 18 }, prepTime: 15, cookTime: 20, ingredients: [{ name: 'Ground turkey', quantity: 5, unit: 'oz', category: 'proteins' }, { name: 'Zucchini noodles', quantity: 2, unit: 'cup', category: 'produce' }, { name: 'Marinara sauce', quantity: 0.5, unit: 'cup', category: 'pantry' }], steps: ['Form turkey into meatballs and bake at 400°F for 20 min.', 'Sauté zoodles.', 'Top with meatballs and marinara.'] },
    { day: 5, type: 'snack', name: 'Protein Shake', calories: 280, macros: { protein: 30, carbs: 24, fat: 8 }, prepTime: 3, cookTime: 0, ingredients: [{ name: 'Protein powder', quantity: 1, unit: 'count', category: 'proteins' }, { name: 'Almond milk', quantity: 1, unit: 'cup', category: 'dairy_eggs' }, { name: 'Banana', quantity: 1, unit: 'count', category: 'produce' }], steps: ['Blend all ingredients until smooth.', 'Serve immediately.'] },

    // Saturday (dayOfWeek: 6)
    { day: 6, type: 'breakfast', name: 'French Toast with Berries', calories: 440, macros: { protein: 26, carbs: 58, fat: 14 }, prepTime: 5, cookTime: 10, ingredients: [{ name: 'Whole wheat bread', quantity: 2, unit: 'count', category: 'bakery' }, { name: 'Eggs', quantity: 2, unit: 'count', category: 'dairy_eggs' }, { name: 'Vanilla extract', quantity: 0.5, unit: 'tsp', category: 'pantry' }, { name: 'Mixed berries', quantity: 0.5, unit: 'cup', category: 'produce' }], steps: ['Beat eggs with vanilla.', 'Dip bread and cook in pan until golden.', 'Top with berries.'] },
    { day: 6, type: 'lunch', name: 'Grilled Steak Salad', calories: 580, macros: { protein: 46, carbs: 28, fat: 28 }, prepTime: 10, cookTime: 12, ingredients: [{ name: 'Sirloin steak', quantity: 5, unit: 'oz', category: 'proteins' }, { name: 'Mixed greens', quantity: 3, unit: 'cup', category: 'produce' }, { name: 'Blue cheese', quantity: 1, unit: 'oz', category: 'dairy_eggs' }, { name: 'Balsamic vinaigrette', quantity: 2, unit: 'tbsp', category: 'pantry' }], steps: ['Grill steak to desired doneness.', 'Slice and arrange on greens.', 'Top with blue cheese and dressing.'] },
    { day: 6, type: 'dinner', name: 'BBQ Chicken with Rice', calories: 620, macros: { protein: 50, carbs: 64, fat: 16 }, prepTime: 10, cookTime: 25, ingredients: [{ name: 'Chicken breast', quantity: 6, unit: 'oz', category: 'proteins' }, { name: 'BBQ sauce', quantity: 2, unit: 'tbsp', category: 'pantry' }, { name: 'Brown rice', quantity: 0.75, unit: 'cup', category: 'pantry' }, { name: 'Corn', quantity: 0.5, unit: 'cup', category: 'produce' }], steps: ['Grill chicken and brush with BBQ sauce.', 'Cook rice.', 'Serve with corn.'] },
    { day: 6, type: 'snack', name: 'Trail Mix', calories: 260, macros: { protein: 10, carbs: 28, fat: 14 }, prepTime: 0, cookTime: 0, ingredients: [{ name: 'Mixed nuts', quantity: 1, unit: 'oz', category: 'pantry' }, { name: 'Dried fruit', quantity: 0.5, unit: 'oz', category: 'pantry' }], steps: ['Mix nuts and dried fruit.', 'Portion and enjoy.'] },

    // Sunday (dayOfWeek: 0)
    { day: 0, type: 'breakfast', name: 'Veggie Omelette', calories: 380, macros: { protein: 28, carbs: 24, fat: 20 }, prepTime: 10, cookTime: 8, ingredients: [{ name: 'Eggs', quantity: 3, unit: 'count', category: 'dairy_eggs' }, { name: 'Bell pepper', quantity: 0.5, unit: 'cup', category: 'produce' }, { name: 'Onion', quantity: 0.25, unit: 'cup', category: 'produce' }, { name: 'Cheese', quantity: 1, unit: 'oz', category: 'dairy_eggs' }], steps: ['Sauté vegetables.', 'Pour beaten eggs over vegetables.', 'Add cheese and fold.'] },
    { day: 0, type: 'lunch', name: 'Chicken Fajita Bowl', calories: 560, macros: { protein: 44, carbs: 56, fat: 18 }, prepTime: 15, cookTime: 15, ingredients: [{ name: 'Chicken breast', quantity: 5, unit: 'oz', category: 'proteins' }, { name: 'Bell peppers', quantity: 1, unit: 'cup', category: 'produce' }, { name: 'Brown rice', quantity: 0.75, unit: 'cup', category: 'pantry' }, { name: 'Salsa', quantity: 0.25, unit: 'cup', category: 'pantry' }], steps: ['Cook fajita-seasoned chicken with peppers.', 'Prepare rice.', 'Assemble bowl and top with salsa.'] },
    { day: 0, type: 'dinner', name: 'Baked Cod with Vegetables', calories: 480, macros: { protein: 42, carbs: 38, fat: 16 }, prepTime: 10, cookTime: 20, ingredients: [{ name: 'Cod fillet', quantity: 6, unit: 'oz', category: 'proteins' }, { name: 'Broccoli', quantity: 1, unit: 'cup', category: 'produce' }, { name: 'Carrots', quantity: 0.5, unit: 'cup', category: 'produce' }, { name: 'Lemon', quantity: 1, unit: 'count', category: 'produce' }], steps: ['Bake cod with lemon at 400°F for 15-20 min.', 'Steam broccoli and carrots.', 'Serve together.'] },
    { day: 0, type: 'snack', name: 'Protein Muffin', calories: 240, macros: { protein: 18, carbs: 26, fat: 8 }, prepTime: 0, cookTime: 0, ingredients: [{ name: 'Protein muffin', quantity: 1, unit: 'count', category: 'bakery' }], steps: ['Unwrap and enjoy.'] },
  ];

  let ingredientCount = 0;
  let stepCount = 0;

  for (const meal of mealData) {
    const createdMeal = await prisma.meal.create({
      data: {
        userId: user.id,
        mealPlanId: mealPlan.id,
        dayOfWeek: meal.day,
        mealType: meal.type,
        name: meal.name,
        calories: meal.calories,
        macros: meal.macros,
        prepTimeMin: meal.prepTime || null,
        cookTimeMin: meal.cookTime || null,
        // Mark Monday breakfast and lunch as logged
        logged: meal.day === 1 && (meal.type === 'breakfast' || meal.type === 'lunch'),
        loggedAt: meal.day === 1 && meal.type === 'breakfast' ? new Date('2025-11-11T08:15:00Z') :
                  meal.day === 1 && meal.type === 'lunch' ? new Date('2025-11-11T12:45:00Z') : null,
      },
    });

    // Create ingredients for this meal
    for (let i = 0; i < meal.ingredients.length; i++) {
      const ingredient = meal.ingredients[i];
      await prisma.ingredient.create({
        data: {
          mealId: createdMeal.id,
          name: ingredient.name,
          quantity: ingredient.quantity,
          unit: ingredient.unit as any,
          category: (ingredient.category || null) as any,
          displayOrder: i + 1,
        },
      });
      ingredientCount++;
    }

    // Create recipe steps for this meal
    for (let i = 0; i < meal.steps.length; i++) {
      await prisma.recipeStep.create({
        data: {
          mealId: createdMeal.id,
          stepNumber: i + 1,
          instruction: meal.steps[i],
        },
      });
      stepCount++;
    }
  }

  console.log(`✅ Created ${mealData.length} meals with ${ingredientCount} ingredients and ${stepCount} recipe steps`);

  // Create workout plan for this week
  console.log('Creating workout plan...');
  const workoutPlan = await prisma.workoutPlan.create({
    data: {
      userId: user.id,
      weekStartDate: weekStart,
      weekEndDate: weekEnd,
      status: 'active',
    },
  });

  // Create workouts for the week with exercises
  const workoutData = [
    // Monday - Upper Body
    {
      day: 1,
      name: 'Upper Body Strength',
      type: 'strength',
      duration: 45,
      calories: 280,
      category: 'upper_body',
      exercises: [
        { name: 'Bench Press', sets: 4, reps: 10, equipment: ['Barbell', 'Bench'], notes: '8-10 reps, focus on controlled descent' },
        { name: 'Overhead Press', sets: 3, reps: 12, equipment: ['Dumbbells'], notes: '10-12 reps, keep core engaged' },
        { name: 'Bent-Over Rows', sets: 4, reps: 10, equipment: ['Barbell'], notes: '8-10 reps, squeeze shoulder blades at top' },
        { name: 'Lateral Raises', sets: 3, reps: 15, equipment: ['Dumbbells'], notes: '12-15 reps, keep slight bend in elbows' },
        { name: 'Tricep Dips', sets: 3, reps: 12, equipment: ['Dip bars'], notes: '10-12 reps, go to 90 degrees elbow bend' },
        { name: 'Bicep Curls', sets: 3, reps: 12, equipment: ['Dumbbells'], notes: '10-12 reps, alternate arms for better form' },
      ],
    },
    // Wednesday - Lower Body
    {
      day: 3,
      name: 'Lower Body Power',
      type: 'strength',
      duration: 50,
      calories: 320,
      category: 'lower_body',
      exercises: [
        { name: 'Barbell Squats', sets: 4, reps: 10, equipment: ['Barbell', 'Squat Rack'], notes: '8-10 reps, keep chest up, knees tracking toes' },
        { name: 'Romanian Deadlifts', sets: 4, reps: 12, equipment: ['Barbell'], notes: '10-12 reps, hinge at hips, slight knee bend' },
        { name: 'Leg Press', sets: 3, reps: 15, equipment: ['Leg Press Machine'], notes: '12-15 reps, full range of motion' },
        { name: 'Walking Lunges', sets: 3, reps: 10, equipment: ['Dumbbells'], notes: '10 reps each leg, keep torso upright' },
        { name: 'Leg Curls', sets: 3, reps: 15, equipment: ['Leg Curl Machine'], notes: '12-15 reps, control the negative' },
        { name: 'Calf Raises', sets: 4, reps: 20, equipment: ['Smith Machine'], notes: '15-20 reps, full stretch at bottom' },
      ],
    },
    // Thursday - Cardio
    {
      day: 4,
      name: 'HIIT Cardio',
      type: 'cardio',
      duration: 30,
      calories: 220,
      category: 'hiit',
      exercises: [
        { name: 'Jump Squats', sets: 4, reps: null, equipment: [], notes: '30 sec each, land softly, explode up' },
        { name: 'Mountain Climbers', sets: 4, reps: null, equipment: [], notes: '30 sec each, keep hips level' },
        { name: 'Burpees', sets: 4, reps: null, equipment: [], notes: '30 sec each, full extension at top' },
        { name: 'High Knees', sets: 4, reps: null, equipment: [], notes: '30 sec each, drive knees to chest' },
        { name: 'Box Jumps', sets: 3, reps: 10, equipment: ['Plyo Box'], notes: 'Step down to protect knees' },
      ],
    },
    // Friday - Full Body
    {
      day: 5,
      name: 'Full Body Circuit',
      type: 'strength',
      duration: 40,
      calories: 260,
      category: 'full_body',
      exercises: [
        { name: 'Deadlifts', sets: 4, reps: 10, equipment: ['Barbell'], notes: '8-10 reps, flat back, engage lats' },
        { name: 'Push-Ups', sets: 3, reps: 20, equipment: [], notes: '15-20 reps, full range of motion' },
        { name: 'Pull-Ups', sets: 3, reps: 10, equipment: ['Pull-Up Bar'], notes: '8-10 reps, chin over bar' },
        { name: 'Dumbbell Thrusters', sets: 3, reps: 12, equipment: ['Dumbbells'], notes: 'Squat to press in one motion' },
        { name: 'Plank', sets: 3, reps: null, equipment: [], notes: '45 sec each, keep body in straight line' },
      ],
    },
    // Saturday - Active Recovery
    {
      day: 6,
      name: 'Yoga & Stretching',
      type: 'cardio',
      duration: 30,
      calories: 120,
      category: 'flexibility',
      exercises: [
        { name: 'Sun Salutations', sets: 3, reps: 5, equipment: ['Yoga Mat'], notes: '5 flows each, flow with breath' },
        { name: 'Downward Dog', sets: 1, reps: null, equipment: ['Yoga Mat'], notes: '60 sec hold, press heels toward floor' },
        { name: 'Pigeon Pose', sets: 1, reps: null, equipment: ['Yoga Mat'], notes: '60 sec each side, square hips to front' },
        { name: 'Seated Forward Fold', sets: 1, reps: null, equipment: ['Yoga Mat'], notes: '60 sec hold, hinge at hips, not waist' },
        { name: 'Supine Twist', sets: 1, reps: null, equipment: ['Yoga Mat'], notes: '45 sec each side, keep shoulders grounded' },
      ],
    },
  ];

  let exerciseCount = 0;
  for (const workout of workoutData) {
    const createdWorkout = await prisma.workout.create({
      data: {
        userId: user.id,
        workoutPlanId: workoutPlan.id,
        dayOfWeek: workout.day,
        name: workout.name,
        type: workout.type as 'strength' | 'cardio',
        workoutCategory: workout.category as any,
        durationMin: workout.duration,
        estimatedCalories: workout.calories,
        // Mark Monday's workout as logged
        logged: workout.day === 1,
        loggedAt: workout.day === 1 ? new Date('2025-11-11T06:30:00Z') : null,
        actualCaloriesBurned: workout.day === 1 ? 285 : null,
        isFavorite: workout.day === 1, // Favorite the Monday workout
      },
    });

    // Create exercises for this workout
    for (let i = 0; i < workout.exercises.length; i++) {
      const exercise = workout.exercises[i];
      await prisma.exercise.create({
        data: {
          workoutId: createdWorkout.id,
          name: exercise.name,
          sets: exercise.sets,
          reps: exercise.reps,
          equipment: exercise.equipment,
          notes: exercise.notes,
          displayOrder: i + 1,
        },
      });
      exerciseCount++;
    }
  }

  console.log(`✅ Created ${workoutData.length} workouts with ${exerciseCount} exercises`);

  console.log('🎉 Database seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
