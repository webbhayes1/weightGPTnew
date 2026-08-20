/**
 * Diagnostic script to investigate why Monday data isn't showing
 * Usage: npx ts-node src/scripts/diagnoseMondayIssue.ts <user-email>
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function diagnoseMondayIssue(email: string) {
  try {
    console.log(`\n🔍 Diagnosing Monday issue for ${email}...\n`);

    // 1. Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      console.error(`❌ User not found`);
      process.exit(1);
    }

    console.log(`✅ User: ${user.email}\n`);

    // 2. Find active meal plan
    const mealPlan = await prisma.mealPlan.findFirst({
      where: {
        userId: user.id,
        status: 'active',
      },
      include: {
        meals: {
          orderBy: {
            dayOfWeek: 'asc',
          },
        },
      },
    });

    if (mealPlan) {
      console.log(`📅 Meal Plan:`);
      console.log(`   ID: ${mealPlan.id}`);
      console.log(`   Week Start: ${mealPlan.weekStartDate.toISOString().split('T')[0]}`);
      console.log(`   Week End: ${mealPlan.weekEndDate.toISOString().split('T')[0]}`);
      console.log(`   Total Meals: ${mealPlan.meals.length}\n`);

      // Group meals by day
      const mealsByDay: { [key: number]: any[] } = {};
      mealPlan.meals.forEach((meal) => {
        if (!mealsByDay[meal.dayOfWeek]) {
          mealsByDay[meal.dayOfWeek] = [];
        }
        mealsByDay[meal.dayOfWeek].push(meal);
      });

      console.log(`📊 Meals by Day of Week:`);
      const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      for (let day = 0; day < 7; day++) {
        const meals = mealsByDay[day] || [];
        console.log(`   ${dayNames[day]} (${day}): ${meals.length} meals`);
        meals.forEach((meal) => {
          console.log(`      - ${meal.name} (${meal.mealType})`);
        });
      }
    } else {
      console.log(`❌ No active meal plan found`);
    }

    // 3. Find active workout plan
    const workoutPlan = await prisma.workoutPlan.findFirst({
      where: {
        userId: user.id,
        status: 'active',
      },
      include: {
        workouts: {
          orderBy: {
            dayOfWeek: 'asc',
          },
        },
      },
    });

    if (workoutPlan) {
      console.log(`\n🏋️  Workout Plan:`);
      console.log(`   ID: ${workoutPlan.id}`);
      console.log(`   Week Start: ${workoutPlan.weekStartDate.toISOString().split('T')[0]}`);
      console.log(`   Week End: ${workoutPlan.weekEndDate.toISOString().split('T')[0]}`);
      console.log(`   Total Workouts: ${workoutPlan.workouts.length}\n`);

      // Group workouts by day
      const workoutsByDay: { [key: number]: any[] } = {};
      workoutPlan.workouts.forEach((workout) => {
        if (!workoutsByDay[workout.dayOfWeek]) {
          workoutsByDay[workout.dayOfWeek] = [];
        }
        workoutsByDay[workout.dayOfWeek].push(workout);
      });

      console.log(`📊 Workouts by Day of Week:`);
      const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      for (let day = 0; day < 7; day++) {
        const workouts = workoutsByDay[day] || [];
        console.log(`   ${dayNames[day]} (${day}): ${workouts.length} workouts`);
        workouts.forEach((workout) => {
          console.log(`      - ${workout.name} (${workout.type})`);
        });
      }
    } else {
      console.log(`\n❌ No active workout plan found`);
    }

    // 4. Test today's date calculation
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayDayOfWeek = today.getDay();
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    console.log(`\n📆 Today's Date Info:`);
    console.log(`   Date: ${today.toISOString().split('T')[0]}`);
    console.log(`   Day of Week: ${todayDayOfWeek} (${dayNames[todayDayOfWeek]})`);

    // 5. Calculate current week's Monday
    const daysSinceMonday = todayDayOfWeek === 0 ? 6 : todayDayOfWeek - 1;
    const weekStartDate = new Date(today);
    weekStartDate.setDate(today.getDate() - daysSinceMonday);
    weekStartDate.setHours(0, 0, 0, 0);

    console.log(`\n📅 Current Week Calculation:`);
    console.log(`   Days Since Monday: ${daysSinceMonday}`);
    console.log(`   Calculated Week Start (Monday): ${weekStartDate.toISOString().split('T')[0]}`);

    console.log(`\n✨ Diagnosis complete!\n`);
  } catch (error) {
    console.error(`\n❌ Error:`, error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

const email = process.argv[2];
if (!email) {
  console.error('Usage: npx ts-node src/scripts/diagnoseMondayIssue.ts <user-email>');
  process.exit(1);
}

diagnoseMondayIssue(email);
