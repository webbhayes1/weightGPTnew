/**
 * Debug script: Check user's dislikedFoods and dietary restrictions
 * Usage: npx ts-node src/scripts/checkDislikedFoods.ts <email>
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkDislikedFoods(email: string) {
  console.log('\n🔍 Checking dislikedFoods for user:', email);

  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      dietaryRestrictions: true,
      dislikedFoods: true,
      preferredCuisines: true,
    },
  });

  if (!user) {
    console.error('❌ User not found:', email);
    return;
  }

  console.log('\n✅ User found!');
  console.log('ID:', user.id);
  console.log('Email:', user.email);
  console.log('\n📋 Dietary Restrictions:', user.dietaryRestrictions);
  console.log('🚫 Disliked Foods:', user.dislikedFoods);
  console.log('🍽️  Preferred Cuisines:', user.preferredCuisines);

  // Check if dislikedFoods is an array
  if (Array.isArray(user.dislikedFoods)) {
    console.log('\n✅ dislikedFoods is an array with', user.dislikedFoods.length, 'items');
    if (user.dislikedFoods.length === 0) {
      console.log('⚠️  Array is EMPTY - no foods to avoid saved!');
    }
  } else {
    console.log('\n❌ dislikedFoods is NOT an array:', typeof user.dislikedFoods);
  }
}

const email = process.argv[2];
if (!email) {
  console.error('Usage: npx ts-node src/scripts/checkDislikedFoods.ts <email>');
  process.exit(1);
}

checkDislikedFoods(email)
  .then(() => {
    console.log('\n✅ Check complete\n');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
