/**
 * Script to test AI meal alternative generation
 * Usage: npx ts-node src/scripts/testMealAlternatives.ts <user-email>
 */

import { PrismaClient } from '@prisma/client';
import { generateMealAlternatives } from '../services/openai/mealGeneration.service';

const prisma = new PrismaClient();

async function testMealAlternatives(email: string) {
  try {
    console.log(`\n🍽️  Testing meal alternative generation for ${email}...\n`);

    // 1. Find user
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        dietaryRestrictions: true,
        dislikedFoods: true,
      },
    });

    if (!user) {
      console.error(`❌ User not found: ${email}`);
      process.exit(1);
    }

    console.log(`✅ Found user: ${user.email}`);
    console.log(`   Dietary Restrictions: ${JSON.stringify(user.dietaryRestrictions)}`);
    console.log(`   Disliked Foods: ${JSON.stringify(user.dislikedFoods)}`);

    // 2. Find a meal from user's current meal plan
    const meal = await prisma.meal.findFirst({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (!meal) {
      console.error(`❌ No meals found for user`);
      process.exit(1);
    }

    const macros = meal.macros as { protein: number; carbs: number; fat: number };

    console.log(`\n📋 Testing with meal:`);
    console.log(`   Name: ${meal.name}`);
    console.log(`   Type: ${meal.mealType}`);
    console.log(`   Calories: ${meal.calories}`);
    console.log(`   Protein: ${macros.protein}g`);
    console.log(`   Carbs: ${macros.carbs}g`);
    console.log(`   Fat: ${macros.fat}g`);

    // 3. Generate alternatives
    console.log(`\n🤖 Generating alternatives with OpenAI...`);
    const startTime = Date.now();

    const { alternatives } = await generateMealAlternatives(user.id, {
      name: meal.name,
      mealType: meal.mealType as 'breakfast' | 'lunch' | 'dinner' | 'snack',
      calories: meal.calories,
      protein: macros.protein,
      carbs: macros.carbs,
      fat: macros.fat,
    });

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`✅ Generated ${alternatives.length} alternatives in ${duration}s`);

    // 4. Display alternatives
    console.log(`\n📝 Alternatives:\n`);
    alternatives.forEach((alt, index) => {
      console.log(`${index + 1}. ${alt.name}`);
      console.log(`   Description: ${alt.description || 'N/A'}`);
      console.log(`   Calories: ${alt.calories} (Δ ${alt.calories - meal.calories})`);
      console.log(`   Protein: ${alt.protein}g (Δ ${alt.protein - macros.protein}g)`);
      console.log(`   Carbs: ${alt.carbs}g (Δ ${alt.carbs - macros.carbs}g)`);
      console.log(`   Fat: ${alt.fat}g (Δ ${alt.fat - macros.fat}g)`);
      console.log(`   Prep: ${alt.prepTimeMin || 0} min | Cook: ${alt.cookTimeMin || 0} min`);
      console.log(``);
    });

    // 5. Validate macros are within range
    console.log(`✅ Validation:`);
    let allValid = true;

    alternatives.forEach((alt, index) => {
      const calDiff = Math.abs(alt.calories - meal.calories);
      const proteinDiff = Math.abs(alt.protein - macros.protein);

      if (calDiff > 50) {
        console.log(`   ⚠️  Alternative ${index + 1} calories off by ${calDiff} (max ±50)`);
        allValid = false;
      }
      if (proteinDiff > 5) {
        console.log(`   ⚠️  Alternative ${index + 1} protein off by ${proteinDiff}g (max ±5g)`);
        allValid = false;
      }
    });

    if (allValid) {
      console.log(`   ✅ All alternatives within macro ranges!`);
    }

    console.log(`\n✨ Test complete!\n`);
  } catch (error) {
    console.error(`\n❌ Error:`, error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Get email from command line args
const email = process.argv[2];

if (!email) {
  console.error('Usage: npx ts-node src/scripts/testMealAlternatives.ts <user-email>');
  process.exit(1);
}

testMealAlternatives(email);
