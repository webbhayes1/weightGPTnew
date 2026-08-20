/**
 * Check ingredients for a specific meal plan
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkMealPlanIngredients() {
  // Check the meal plan that has eggs: 444216
  const mealPlanId = 'f8fba19e-0a59-49e2-9a06-be9840718397';

  console.log(`Checking ingredients for meal plan ${mealPlanId}...\n`);

  // Get all meals for this meal plan
  const meals = await prisma.meal.findMany({
    where: { mealPlanId },
    include: {
      ingredients: {
        where: {
          name: {
            contains: 'egg',
            mode: 'insensitive',
          },
        },
      },
    },
  });

  console.log(`Found ${meals.length} meals with egg ingredients:\n`);

  let totalEggs = 0;
  meals.forEach((meal) => {
    if (meal.ingredients.length > 0) {
      console.log(`Meal: ${meal.name} (${meal.mealType}, Day ${meal.dayOfWeek})`);
      meal.ingredients.forEach((ing) => {
        console.log(`  - ${ing.name}: ${Number(ing.quantity)} ${ing.unit}`);
        totalEggs += Number(ing.quantity);
      });
      console.log();
    }
  });

  console.log(`Total eggs from individual ingredients: ${totalEggs}\n`);

  // Now check what the grocery list shows
  const groceryItem = await prisma.groceryList.findFirst({
    where: {
      mealPlanId,
      itemName: {
        contains: 'egg',
        mode: 'insensitive',
      },
    },
  });

  if (groceryItem) {
    console.log(`Grocery list item: ${groceryItem.itemName}: ${Number(groceryItem.quantity)} ${groceryItem.unit}`);
    console.log(`\nDISCREPANCY: ${Number(groceryItem.quantity)} in grocery list vs ${totalEggs} in recipes`);
  }

  await prisma.$disconnect();
}

checkMealPlanIngredients().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});
