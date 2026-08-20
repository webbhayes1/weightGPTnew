/**
 * Authentication Service
 * Handles user authentication, registration, and Firebase account linking
 */

import { PrismaClient } from '@prisma/client';
import { verifyIdToken } from '../config/firebase';
import { generateJWT } from '../utils/jwt.util';

const prisma = new PrismaClient();

// Types
export interface FirebaseLoginRequest {
  idToken: string;
  onboardingData?: OnboardingData;
}

export interface OnboardingData {
  // User Profile
  goal: 'lose_weight' | 'gain_weight' | 'maintain';
  currentWeight: number;
  goalWeight: number;
  goalDate?: string;
  height: number;
  age: number;
  sex: 'male' | 'female';
  activityLevel: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active';

  // Dietary Preferences
  dietaryRestrictions: string[];
  dislikedFoods: string[];
  preferredCuisines: string[];

  // Eating Pattern
  eatingPattern: {
    mealsPerDay: number;
    snacksPerDay: number;
    preferredMealTimes: {
      breakfast?: string;
      lunch?: string;
      dinner?: string;
    };
  };

  // Fitness Preferences
  workoutFrequency: number;
  workoutDuration?: number;
  availableEquipment: string[];
  fitnessLevel: 'beginner' | 'intermediate' | 'advanced';

  // Preferences
  shoppingDay?: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday' | 'flexible';
  weeklyResetDay?: 'monday' | 'sunday';
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string;
    firebaseUid: string;
    onboardingComplete: boolean;
  };
  token: string;
  isNewUser: boolean;
}

/**
 * Calculate BMR using Mifflin-St Jeor equation
 */
const calculateBMR = (weight: number, height: number, age: number, sex: 'male' | 'female'): number => {
  // Weight in lbs, height in inches
  const weightKg = weight * 0.453592;
  const heightCm = height * 2.54;

  if (sex === 'male') {
    return Math.round((10 * weightKg) + (6.25 * heightCm) - (5 * age) + 5);
  } else {
    return Math.round((10 * weightKg) + (6.25 * heightCm) - (5 * age) - 161);
  }
};

/**
 * Calculate TDEE based on BMR and activity level
 */
const calculateTDEE = (bmr: number, activityLevel: string): number => {
  const multipliers = {
    sedentary: 1.2,
    lightly_active: 1.375,
    moderately_active: 1.55,
    very_active: 1.725,
  };

  const multiplier = multipliers[activityLevel as keyof typeof multipliers] || 1.2;
  return Math.round(bmr * multiplier);
};

/**
 * Calculate daily calorie target based on goal
 */
const calculateDailyCalories = (tdee: number, goal: string): number => {
  if (goal === 'lose_weight') {
    return Math.round(tdee - 500); // 500 cal deficit
  } else if (goal === 'gain_weight') {
    return Math.round(tdee + 300); // 300 cal surplus
  } else {
    return tdee; // Maintenance
  }
};

/**
 * Calculate macros based on daily calories and goal
 */
const calculateMacros = (dailyCalories: number, goal: string) => {
  let proteinPercent = 0.30;
  let fatPercent = 0.30;
  let carbsPercent = 0.40;

  if (goal === 'lose_weight') {
    proteinPercent = 0.35;
    fatPercent = 0.30;
    carbsPercent = 0.35;
  } else if (goal === 'gain_weight') {
    proteinPercent = 0.30;
    fatPercent = 0.25;
    carbsPercent = 0.45;
  }

  return {
    protein_g: Math.round((dailyCalories * proteinPercent) / 4),
    carbs_g: Math.round((dailyCalories * carbsPercent) / 4),
    fat_g: Math.round((dailyCalories * fatPercent) / 9),
  };
};

/**
 * Firebase Login/Register
 * - Verifies Firebase ID token
 * - Creates user if new (with onboarding data)
 * - Updates existing user if found
 * - Returns custom JWT token
 */
export const firebaseLogin = async (
  idToken: string,
  onboardingData?: OnboardingData
): Promise<AuthResponse> => {
  // 1. Verify Firebase ID token
  const decodedToken = await verifyIdToken(idToken);
  const firebaseUid = decodedToken.uid;
  const email = decodedToken.email;

  if (!email) {
    throw new Error('Email is required for authentication');
  }

  // 2. Check if user exists by firebaseUid
  let user = await prisma.user.findUnique({
    where: { firebaseUid },
  });

  let isNewUser = false;

  // 3. If user doesn't exist, create new user
  if (!user) {
    isNewUser = true;

    if (!onboardingData) {
      throw new Error('Onboarding data is required for new users');
    }

    // Calculate metrics
    const bmr = calculateBMR(
      onboardingData.currentWeight,
      onboardingData.height,
      onboardingData.age,
      onboardingData.sex
    );

    const tdee = calculateTDEE(bmr, onboardingData.activityLevel);
    const dailyCalories = calculateDailyCalories(tdee, onboardingData.goal);
    const macros = calculateMacros(dailyCalories, onboardingData.goal);

    // Create user with onboarding data
    user = await prisma.user.create({
      data: {
        email,
        firebaseUid,
        name: decodedToken.name || email.split('@')[0],
        passwordHash: '', // Firebase handles auth, no password needed

        // Onboarding data
        onboardingComplete: true,
        goal: onboardingData.goal,
        currentWeight: onboardingData.currentWeight,
        goalWeight: onboardingData.goalWeight,
        goalDate: onboardingData.goalDate ? new Date(onboardingData.goalDate) : null,
        height: onboardingData.height,
        age: onboardingData.age,
        gender: onboardingData.sex,
        activityLevel: onboardingData.activityLevel,

        // Dietary preferences
        dietaryRestrictions: onboardingData.dietaryRestrictions,
        dislikedFoods: onboardingData.dislikedFoods,
        preferredCuisines: onboardingData.preferredCuisines,

        // Eating pattern
        eatingPattern: onboardingData.eatingPattern,

        // Fitness preferences
        workoutFrequency: onboardingData.workoutFrequency,
        workoutDuration: onboardingData.workoutDuration || 30,
        availableEquipment: onboardingData.availableEquipment,
        fitnessLevel: onboardingData.fitnessLevel,

        // Calculated metrics
        bmr,
        tdee,
        dailyCalories,
        macros,

        // Preferences
        shoppingDay: onboardingData.shoppingDay || 'flexible',
        weeklyResetDay: onboardingData.weeklyResetDay || 'monday',

        // Maintenance weight monitoring (for maintenance goal)
        initialMaintenanceWeight: onboardingData.goal === 'maintain'
          ? onboardingData.currentWeight
          : null,
      },
    });
  }

  // 4. Update last login timestamp
  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });

  // 5. Generate custom JWT token (7-day session)
  const token = generateJWT(user.id, user.email);

  // 6. Return auth response
  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      firebaseUid: user.firebaseUid!,
      onboardingComplete: user.onboardingComplete,
    },
    token,
    isNewUser,
  };
};

export default {
  firebaseLogin,
};
