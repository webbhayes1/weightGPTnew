/**
 * Check grocery list for high quantities
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkGroceryList() {
  console.log('Checking grocery list for high quantities...\n');

  const items = await prisma.groceryList.findMany({
    orderBy: { quantity: 'desc' },
    take: 30,
  });

  if (items.length === 0) {
    console.log('No grocery list items found.\n');
    await prisma.$disconnect();
    return;
  }

  console.log(`Top ${items.length} grocery items by quantity:\n`);

  items.forEach((item) => {
    const qty = Number(item.quantity);
    const emoji = qty > 100 ? '❌' : qty > 50 ? '⚠️' : '✅';
    console.log(`${emoji} ${item.itemName}: ${qty} ${item.unit} (category: ${item.category || 'none'})`);
  });

  console.log('\n--- Items with quantity > 100 ---\n');
  const highQtyItems = items.filter(item => Number(item.quantity) > 100);

  if (highQtyItems.length === 0) {
    console.log('None found.');
  } else {
    highQtyItems.forEach((item) => {
      console.log(`❌ ${item.itemName}: ${Number(item.quantity)} ${item.unit}`);
      console.log(`   ID: ${item.id}`);
      console.log(`   User ID: ${item.userId}`);
      console.log(`   Meal Plan ID: ${item.mealPlanId}\n`);
    });
  }

  await prisma.$disconnect();
}

checkGroceryList().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});
