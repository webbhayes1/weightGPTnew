/**
 * Health & Fitness Calculations
 * Based on Q1 Onboarding Specification (Mifflin-St Jeor formulas)
 *
 * References:
 * - BMR: Mifflin-St Jeor equation (most accurate for modern populations)
 * - TDEE: BMR × activity multiplier
 * - Macros: Protein/Carbs/Fat distribution based on goal type
 * - Timeline: Safe weight loss/gain rate validation
 */

/**
 * Activity Level Multipliers for TDEE calculation
 */
export const ACTIVITY_MULTIPLIERS = {
  sedentary: 1.2, // Little to no exercise
  lightly_active: 1.375, // Light exercise 1-3 days/week
  moderately_active: 1.55, // Moderate exercise 3-5 days/week
  very_active: 1.725, // Hard exercise 6-7 days/week
  extra_active: 1.9, // Very hard exercise + physical job
} as const;

/**
 * Calorie adjustment based on goal type
 */
export const GOAL_ADJUSTMENTS = {
  lose_weight: -0.20, // 20% deficit
  gain_weight: 0.15, // 15% surplus
  maintain: 0, // No adjustment
} as const;

/**
 * Safe weight change rates (lbs per week)
 */
export const SAFE_RATES = {
  max_loss_per_week: 2.0, // Maximum 2 lbs/week for weight loss
  max_gain_per_week: 1.0, // Maximum 1 lb/week for muscle gain
  min_timeline_weeks: 4, // Minimum 4 weeks for any goal
  max_timeline_weeks: 52, // Maximum 52 weeks (1 year)
} as const;

/**
 * Calorie floors and ceilings for safety
 */
export const CALORIE_LIMITS = {
  min_female: 1200,
  min_male: 1500,
  max: 5000,
  warning_threshold: 4000,
} as const;

/**
 * Macro distribution by goal type (percentages)
 */
export const MACRO_DISTRIBUTIONS = {
  lose_weight: { protein: 0.4, carbs: 0.35, fat: 0.25 },
  gain_weight: { protein: 0.3, carbs: 0.5, fat: 0.2 },
  maintain: { protein: 0.3, carbs: 0.45, fat: 0.25 },
} as const;

export type ActivityLevel = keyof typeof ACTIVITY_MULTIPLIERS;
export type GoalType = keyof typeof GOAL_ADJUSTMENTS;

/**
 * Convert pounds to kilograms
 */
export function lbsToKg(lbs: number): number {
  return lbs * 0.453592;
}

/**
 * Convert kilograms to pounds
 */
export function kgToLbs(kg: number): number {
  return kg * 2.20462;
}

/**
 * Convert inches to centimeters
 */
export function inchesToCm(inches: number): number {
  return inches * 2.54;
}

/**
 * Convert centimeters to inches
 */
export function cmToInches(cm: number): number {
  return cm / 2.54;
}

/**
 * Calculate Basal Metabolic Rate (BMR) using Mifflin-St Jeor equation
 *
 * @param weightLbs - Weight in pounds
 * @param heightInches - Height in inches
 * @param age - Age in years
 * @param sex - Biological sex ('male' or 'female')
 * @returns BMR in calories per day
 *
 * @throws Error if age < 13 or inputs are invalid
 *
 * Formula:
 * - Male: (10 × weight_kg) + (6.25 × height_cm) - (5 × age) + 5
 * - Female: (10 × weight_kg) + (6.25 × height_cm) - (5 × age) - 161
 *
 * @example
 * const bmr = calculateBMR(180, 70, 30, 'male'); // Returns ~1820
 */
export function calculateBMR(
  weightLbs: number,
  heightInches: number,
  age: number,
  sex: 'male' | 'female'
): number {
  // Validation
  if (age < 13) {
    throw new Error(
      'Age must be 13 or older (parental permission required for ages 13-17)'
    );
  }
  if (weightLbs <= 0 || heightInches <= 0) {
    throw new Error('Weight and height must be positive values');
  }
  if (sex !== 'male' && sex !== 'female') {
    throw new Error('Sex must be "male" or "female"');
  }

  // Convert to metric
  const weightKg = lbsToKg(weightLbs);
  const heightCm = inchesToCm(heightInches);

  // Mifflin-St Jeor formula
  let bmr = 10 * weightKg + 6.25 * heightCm - 5 * age;

  // Adjust for sex
  if (sex === 'male') {
    bmr += 5;
  } else {
    bmr -= 161;
  }

  return Math.round(bmr);
}

/**
 * Calculate Total Daily Energy Expenditure (TDEE)
 *
 * @param bmr - Basal Metabolic Rate
 * @param activityLevel - Activity level category
 * @returns TDEE in calories per day
 *
 * @example
 * const tdee = calculateTDEE(1820, 'moderately_active'); // Returns ~2821
 */
export function calculateTDEE(bmr: number, activityLevel: ActivityLevel): number {
  if (bmr <= 0) {
    throw new Error('BMR must be a positive value');
  }
  if (!(activityLevel in ACTIVITY_MULTIPLIERS)) {
    throw new Error(`Invalid activity level: ${activityLevel}`);
  }

  const multiplier = ACTIVITY_MULTIPLIERS[activityLevel];
  return Math.round(bmr * multiplier);
}

/**
 * Calculate daily calorie target based on goal
 *
 * @param tdee - Total Daily Energy Expenditure
 * @param goalType - Weight goal type
 * @returns Daily calorie target
 *
 * @example
 * const target = calculateDailyCalories(2821, 'lose_weight'); // Returns ~2257 (20% deficit)
 */
export function calculateDailyCalories(tdee: number, goalType: GoalType): number {
  if (tdee <= 0) {
    throw new Error('TDEE must be a positive value');
  }
  if (!(goalType in GOAL_ADJUSTMENTS)) {
    throw new Error(`Invalid goal type: ${goalType}`);
  }

  const adjustment = GOAL_ADJUSTMENTS[goalType];
  const target = tdee * (1 + adjustment);
  return Math.round(target);
}

/**
 * Apply calorie floor and ceiling limits for safety
 *
 * @param calories - Raw calorie target
 * @param sex - Biological sex
 * @returns Adjusted calories within safe limits
 */
export function applySafeCalorieLimits(
  calories: number,
  sex: 'male' | 'female'
): {
  adjustedCalories: number;
  wasAdjusted: boolean;
  reason?: 'floor' | 'ceiling';
} {
  const minCalories = sex === 'female' ? CALORIE_LIMITS.min_female : CALORIE_LIMITS.min_male;
  const maxCalories = CALORIE_LIMITS.max;

  if (calories < minCalories) {
    return {
      adjustedCalories: minCalories,
      wasAdjusted: true,
      reason: 'floor',
    };
  }

  if (calories > maxCalories) {
    return {
      adjustedCalories: maxCalories,
      wasAdjusted: true,
      reason: 'ceiling',
    };
  }

  return {
    adjustedCalories: calories,
    wasAdjusted: false,
  };
}

/**
 * Calculate macro distribution in grams
 *
 * @param dailyCalories - Daily calorie target
 * @param goalType - Weight goal type
 * @returns Macros in grams { protein_g, carbs_g, fat_g }
 *
 * @example
 * const macros = calculateMacros(2257, 'lose_weight');
 * // Returns: { protein_g: 226, carbs_g: 197, fat_g: 63 }
 */
export function calculateMacros(
  dailyCalories: number,
  goalType: GoalType
): {
  protein_g: number;
  carbs_g: number;
  fat_g: number;
} {
  if (dailyCalories <= 0) {
    throw new Error('Daily calories must be a positive value');
  }
  if (!(goalType in MACRO_DISTRIBUTIONS)) {
    throw new Error(`Invalid goal type: ${goalType}`);
  }

  const distribution = MACRO_DISTRIBUTIONS[goalType];

  // Calories per gram: protein = 4, carbs = 4, fat = 9
  const proteinCalories = dailyCalories * distribution.protein;
  const carbsCalories = dailyCalories * distribution.carbs;
  const fatCalories = dailyCalories * distribution.fat;

  return {
    protein_g: Math.round(proteinCalories / 4),
    carbs_g: Math.round(carbsCalories / 4),
    fat_g: Math.round(fatCalories / 9),
  };
}

/**
 * Validate timeline safety (weight loss/gain rate)
 *
 * @param currentWeight - Current weight in lbs
 * @param goalWeight - Goal weight in lbs
 * @param goalDate - Target date for goal
 * @param goalType - Weight goal type
 * @returns Validation result with safety check
 *
 * @example
 * const result = validateTimeline(200, 170, new Date('2025-04-01'), 'lose_weight');
 * // Returns: { valid: true, requiredRate: 1.5, safeRate: 2.0, weeks: 20 }
 */
export function validateTimeline(
  currentWeight: number,
  goalWeight: number,
  goalDate: Date,
  goalType: GoalType
): {
  valid: boolean;
  requiredRate: number; // lbs per week
  safeRate: number; // Max safe rate for goal type
  weeks: number;
  error?: string;
  recommendedDate?: Date;
} {
  // Calculate weeks between now and goal date
  const now = new Date();
  const msPerWeek = 7 * 24 * 60 * 60 * 1000;
  const weeks = Math.max(1, Math.round((goalDate.getTime() - now.getTime()) / msPerWeek));

  // Calculate weight difference
  const weightDiff = Math.abs(goalWeight - currentWeight);
  const requiredRate = weightDiff / weeks;

  // Determine safe rate based on goal type
  const safeRate =
    goalType === 'lose_weight' ? SAFE_RATES.max_loss_per_week : SAFE_RATES.max_gain_per_week;

  // Validate minimum timeline
  if (weeks < SAFE_RATES.min_timeline_weeks) {
    const recommendedDate = new Date(now.getTime() + SAFE_RATES.min_timeline_weeks * msPerWeek);
    return {
      valid: false,
      requiredRate,
      safeRate,
      weeks,
      error: `Timeline too short. Minimum ${SAFE_RATES.min_timeline_weeks} weeks required for safety.`,
      recommendedDate,
    };
  }

  // Validate maximum timeline
  if (weeks > SAFE_RATES.max_timeline_weeks) {
    return {
      valid: false,
      requiredRate,
      safeRate,
      weeks,
      error: `Timeline too long. Maximum ${SAFE_RATES.max_timeline_weeks} weeks allowed.`,
    };
  }

  // Validate rate is safe
  if (requiredRate > safeRate) {
    const safeWeeks = Math.ceil(weightDiff / safeRate);
    const recommendedDate = new Date(now.getTime() + safeWeeks * msPerWeek);

    return {
      valid: false,
      requiredRate,
      safeRate,
      weeks,
      error: `Rate of ${requiredRate.toFixed(1)} lbs/week exceeds safe maximum of ${safeRate} lbs/week.`,
      recommendedDate,
    };
  }

  return {
    valid: true,
    requiredRate,
    safeRate,
    weeks,
  };
}
