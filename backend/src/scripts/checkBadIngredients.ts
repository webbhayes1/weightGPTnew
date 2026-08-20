/**
 * Check for ingredients with absurdly high quantities
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkBadIngredients() {
  console.log('Checking for ingredients with quantity > 1000...\n');

  const badIngredients = await prisma.ingredient.findMany({
    where: {
      quantity: {
        gt: 1000,
      },
    },
    include: {
      meal: {
        select: {
          id: true,
          name: true,
          mealType: true,
          dayOfWeek: true,
        },
      },
    },
    orderBy: {
      quantity: 'desc',
    },
  });

  console.log(`Found ${badIngredients.length} ingredients with quantity > 1000:\n`);

  badIngredients.forEach((ing) => {
    console.log(`❌ ${ing.name}: ${ing.quantity} ${ing.unit}`);
    console.log(`   Meal: ${ing.meal.name} (${ing.meal.mealType}, Day ${ing.meal.dayOfWeek})`);
    console.log(`   Ingredient ID: ${ing.id}`);
    console.log(`   Meal ID: ${ing.meal.id}\n`);
  });

  await prisma.$disconnect();
}

checkBadIngredients().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});
