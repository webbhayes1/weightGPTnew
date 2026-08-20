import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function checkMealPlans() {
  const user = await prisma.user.findFirst({
    where: { email: { contains: 'webb@webbwebbwebb.com' } }
  });

  if (!user) {
    console.log('User not found');
    process.exit(1);
  }

  console.log('User ID:', user.id);
  console.log('Today:', new Date().toISOString().split('T')[0]);

  const mealPlans = await prisma.mealPlan.findMany({
    where: { userId: user.id },
    include: { meals: { orderBy: { dayOfWeek: 'asc' } } },
    orderBy: { weekStartDate: 'desc' }
  });

  console.log('\n=== MEAL PLANS ===');
  mealPlans.forEach(plan => {
    console.log(`\nPlan: ${plan.id}`);
    console.log(`  Status: ${plan.status}`);
    console.log(`  Week: ${plan.weekStartDate.toISOString().split('T')[0]} to ${plan.weekEndDate.toISOString().split('T')[0]}`);
    console.log(`  Meals: ${plan.meals.length}`);

    // Group by day
    const byDay: Record<number, any[]> = {};
    plan.meals.forEach(m => {
      if (!byDay[m.dayOfWeek]) byDay[m.dayOfWeek] = [];
      byDay[m.dayOfWeek].push(m);
    });

    Object.keys(byDay).map(Number).sort((a, b) => a - b).forEach(day => {
      const dayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][day];
      console.log(`  ${dayName} (day ${day}): ${byDay[day].length} meals`);
    });
  });

  await prisma.$disconnect();
}

checkMealPlans().catch(e => { console.error(e); process.exit(1); });
