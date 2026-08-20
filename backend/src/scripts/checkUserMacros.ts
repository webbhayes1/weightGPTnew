/**
 * Quick script to check user's macros field in database
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkUserMacros() {
  try {
    // Get all users with their macros
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        dailyCalories: true,
        macros: true,
      },
    });

    console.log('\n=== USER MACROS CHECK ===\n');

    users.forEach((user) => {
      console.log(`User: ${user.email}`);
      console.log(`  ID: ${user.id}`);
      console.log(`  Daily Calories: ${user.dailyCalories}`);
      console.log(`  Macros (raw):`, user.macros);
      console.log(`  Macros type:`, typeof user.macros);
      console.log('');
    });

    await prisma.$disconnect();
  } catch (error) {
    console.error('Error:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

checkUserMacros();
