/**
 * Script to generate a workout plan for a specific user
 * Usage: npx ts-node src/scripts/generateWorkoutPlan.ts <user-email>
 */

import { PrismaClient } from '@prisma/client';
import { generateWeeklyWorkoutPlan, storeWorkoutPlan, generateWorkoutExercises } from '../services/openai/workoutGeneration.service';

const prisma = new PrismaClient();

async function generateWorkoutPlanForUser(email: string) {
  try {
    console.log(`\n🏋️  Generating workout plan for ${email}...`);

    // 1. Find user
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        fitnessLevel: true,
        availableEquipment: true,
        goal: true,
      },
    });

    if (!user) {
      console.error(`❌ User not found: ${email}`);
      process.exit(1);
    }

    console.log(`✅ Found user: ${user.email}`);
    console.log(`   Fitness Level: ${user.fitnessLevel}`);
    console.log(`   Goal: ${user.goal}`);
    console.log(`   Equipment: ${JSON.stringify(user.availableEquipment)}`);

    // 2. Determine week start date (current week Monday)
    const today = new Date();
    const dayOfWeek = today.getDay();
    const daysSinceMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const weekStartDate = new Date(today);
    weekStartDate.setDate(today.getDate() - daysSinceMonday);
    weekStartDate.setHours(0, 0, 0, 0);

    const weekEndDate = new Date(weekStartDate);
    weekEndDate.setDate(weekEndDate.getDate() + 6);

    console.log(`\n📅 Week: ${weekStartDate.toISOString().split('T')[0]} to ${weekEndDate.toISOString().split('T')[0]}`);

    // 3. Check for existing active plan
    const existingPlan = await prisma.workoutPlan.findFirst({
      where: {
        userId: user.id,
        status: 'active',
        weekStartDate: {
          lte: weekStartDate,
        },
        weekEndDate: {
          gte: weekStartDate,
        },
      },
    });

    if (existingPlan) {
      console.log(`\n⚠️  Existing active plan found (ID: ${existingPlan.id})`);
      console.log(`   Deleting old plan...`);
      await prisma.workoutPlan.delete({
        where: { id: existingPlan.id },
      });
      console.log(`✅ Old plan deleted`);
    }

    // 4. Generate workout plan using OpenAI
    console.log(`\n🤖 Generating workout plan with OpenAI...`);
    const { workouts } = await generateWeeklyWorkoutPlan(user.id);
    console.log(`✅ Generated ${workouts.length} workouts`);

    // 5. Store workout plan in database
    console.log(`\n💾 Storing workout plan...`);
    const workoutPlanId = await storeWorkoutPlan(user.id, workouts, weekStartDate);
    console.log(`✅ Workout plan stored (ID: ${workoutPlanId})`);

    // 6. Fetch the complete workout plan
    const workoutPlan = await prisma.workoutPlan.findUnique({
      where: { id: workoutPlanId },
      include: {
        workouts: {
          orderBy: { dayOfWeek: 'asc' },
        },
      },
    });

    if (!workoutPlan) {
      throw new Error('Failed to retrieve generated workout plan');
    }

    // 7. Generate exercises for all workouts
    console.log(`\n🎯 Generating exercises for ${workoutPlan.workouts.length} workouts...`);
    await Promise.all(
      workoutPlan.workouts.map(async (workout, index) => {
        try {
          console.log(`   ${index + 1}/${workoutPlan.workouts.length} Generating exercises for: ${workout.name} (Day ${workout.dayOfWeek})...`);
          await generateWorkoutExercises(
            workout.id,
            workout.name,
            workout.type,
            workout.workoutCategory || 'full_body',
            workout.durationMin,
            user.fitnessLevel,
            user.availableEquipment as string[]
          );
          console.log(`      ✅ Exercises generated`);
        } catch (error) {
          console.error(`      ❌ Failed to generate exercises: ${error}`);
        }
      })
    );

    // 8. Fetch final workout plan with exercises
    const finalWorkoutPlan = await prisma.workoutPlan.findUnique({
      where: { id: workoutPlanId },
      include: {
        workouts: {
          orderBy: { dayOfWeek: 'asc' },
          include: {
            exercises: {
              orderBy: { displayOrder: 'asc' },
            },
          },
        },
      },
    });

    // 9. Display summary
    console.log(`\n\n✅ WORKOUT PLAN GENERATED SUCCESSFULLY!\n`);
    console.log(`📋 Summary:`);
    console.log(`   Plan ID: ${finalWorkoutPlan!.id}`);
    console.log(`   Week: ${weekStartDate.toISOString().split('T')[0]} to ${weekEndDate.toISOString().split('T')[0]}`);
    console.log(`   Total Workouts: ${finalWorkoutPlan!.workouts.length}`);
    console.log(`\n📅 Workouts by Day:`);

    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    finalWorkoutPlan!.workouts.forEach((workout) => {
      const exerciseCount = workout.exercises.length;
      console.log(`   ${dayNames[workout.dayOfWeek]}: ${workout.name} (${workout.durationMin} min, ${workout.estimatedCalories} cal, ${exerciseCount} exercises)`);
    });

    console.log(`\n✨ Done!\n`);
  } catch (error) {
    console.error(`\n❌ Error generating workout plan:`, error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Get email from command line args
const email = process.argv[2];

if (!email) {
  console.error('Usage: npx ts-node src/scripts/generateWorkoutPlan.ts <user-email>');
  process.exit(1);
}

generateWorkoutPlanForUser(email);
