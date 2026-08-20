/**
 * Quick script to check if user exists
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkUser() {
  const firebaseUid = 'rc365SSkVXQSkukxNkRuI8ZmneE3';

  console.log(`Looking for user with Firebase UID: ${firebaseUid}`);

  const user = await prisma.user.findUnique({
    where: { firebaseUid },
  });

  if (user) {
    console.log('✅ User FOUND:');
    console.log(JSON.stringify(user, null, 2));
  } else {
    console.log('❌ User NOT FOUND');

    // Check all users
    const allUsers = await prisma.user.findMany({
      select: {
        id: true,
        firebaseUid: true,
        email: true,
        name: true,
      },
    });
    console.log('\nAll users in database:');
    console.log(JSON.stringify(allUsers, null, 2));
  }
}

checkUser()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
