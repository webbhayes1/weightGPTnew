/**
 * Calculation Utilities for WeightGPT
 * Formulas: Mifflin-St Jeor equation for BMR, standard activity multipliers for TDEE
 *
 * References:
 * - Mifflin-St Jeor: Mifflin et al. (1990) - A new predictive equation for resting energy expenditure
 * - Q1_Onboarding_FINAL.md - Application-specific requirements
 */

/**
 * Calculate Basal Metabolic Rate (BMR) using Mifflin-St Jeor equation
 *
 * @param weight_lbs - User weight in pounds
 * @param height_inches - User height in inches
 * @param age - User age in years
 * @param sex - User sex at birth ('male' or 'female')
 * @returns BMR in calories per day (rounded to nearest integer)
 *
 * @throws {Error} If parameters are out of valid range
 *
 * Formula:
 * - Male: BMR = (10 × weight_kg) + (6.25 × height_cm) - (5 × age) + 5
 * - Female: BMR = (10 × weight_kg) + (6.25 × height_cm) - (5 × age) - 161
 *
 * @example
 * const bmr = calculateBMR(180, 70, 30, 'male');
 * console.log(bmr); // 1783
 */
export function calculateBMR(
  weight_lbs: number,
  height_inches: number,
  age: number,
  sex: 'male' | 'female'
): number {
  // Validation: Age
  if (age < 13) {
    throw new Error(
      'Age must be 13 or older (parental permission required for ages 13-17)'
    );
  }
  if (age > 100) {
    throw new Error('Age must be 100 or younger');
  }

  // Validation: Weight
  if (weight_lbs < 80) {
    throw new Error('Weight must be at least 80 lbs');
  }
  if (weight_lbs > 400) {
    throw new Error('Weight must be 400 lbs or less');
  }

  // Validation: Height
  if (height_inches < 48) {
    // 4 feet
    throw new Error('Height must be at least 48 inches (4 feet)');
  }
  if (height_inches > 84) {
    // 7 feet
    throw new Error('Height must be 84 inches (7 feet) or less');
  }

  // Validation: Sex
  if (sex !== 'male' && sex !== 'female') {
    throw new Error('Sex must be "male" or "female"');
  }

  // Convert imperial to metric
  const weight_kg = weight_lbs * 0.453592; // 1 lb = 0.453592 kg
  const height_cm = height_inches * 2.54; // 1 inch = 2.54 cm

  // Mifflin-St Jeor formula
  let bmr = 10 * weight_kg + 6.25 * height_cm - 5 * age;

  // Adjust for sex
  if (sex === 'male') {
    bmr += 5;
  } else {
    bmr -= 161;
  }

  // Round to nearest integer
  return Math.round(bmr);
}

/**
 * Calculate Total Daily Energy Expenditure (TDEE)
 *
 * @param bmr - Basal Metabolic Rate (from calculateBMR)
 * @param activity_level - Activity level ('sedentary', 'moderate', 'active')
 * @returns TDEE in calories per day (rounded to nearest integer)
 *
 * Activity multipliers:
 * - sedentary: 1.2 (desk job, minimal movement)
 * - moderate: 1.55 (on your feet regularly)
 * - active: 1.725 (physical job, constantly moving)
 *
 * @example
 * const bmr = 1783;
 * const tdee = calculateTDEE(bmr, 'moderate');
 * console.log(tdee); // 2764
 */
export function calculateTDEE(
  bmr: number,
  activity_level: 'sedentary' | 'moderate' | 'active'
): number {
  // Validation
  if (bmr <= 0) {
    throw new Error('BMR must be positive');
  }

  // Activity multipliers (from Q1 spec Step 7)
  const activityMultipliers = {
    sedentary: 1.2, // Desk job, minimal movement
    moderate: 1.55, // On your feet regularly
    active: 1.725, // Physical job, constantly moving
  };

  if (!activityMultipliers[activity_level]) {
    throw new Error(
      'Activity level must be "sedentary", "moderate", or "active"'
    );
  }

  const tdee = bmr * activityMultipliers[activity_level];

  return Math.round(tdee);
}

/**
 * Calculate daily calorie target based on goal
 *
 * @param tdee - Total Daily Energy Expenditure
 * @param goal - User goal ('lose_weight', 'gain_weight', 'maintain')
 * @param weekly_rate - Desired rate in lbs/week (e.g., -1.5 for weight loss)
 * @returns Daily calorie target (rounded to nearest integer)
 *
 * Formula:
 * - 1 lb fat = 3500 calories
 * - Weekly deficit/surplus = weekly_rate × 3500
 * - Daily adjustment = (weekly_rate × 3500) / 7
 * - Target calories = TDEE + daily_adjustment
 *
 * @example
 * const tdee = 2764;
 * const target = calculateDailyCalories(tdee, 'lose_weight', -1.5);
 * console.log(target); // 2014 (750 cal/day deficit)
 */
export function calculateDailyCalories(
  tdee: number,
  goal: 'lose_weight' | 'gain_weight' | 'maintain',
  weekly_rate: number = 0
): number {
  // Validation
  if (tdee <= 0) {
    throw new Error('TDEE must be positive');
  }

  // Maintain weight: no adjustment
  if (goal === 'maintain') {
    return Math.round(tdee);
  }

  // Weight loss/gain: apply weekly rate
  // 1 lb fat = 3500 calories
  // Daily adjustment = (weekly_rate × 3500) / 7
  const daily_adjustment = (weekly_rate * 3500) / 7;
  const target_calories = tdee + daily_adjustment;

  return Math.round(target_calories);
}

/**
 * Calculate macro distribution (protein, carbs, fat)
 *
 * @param daily_calories - Daily calorie target
 * @param goal - User goal ('lose_weight', 'gain_weight', 'maintain')
 * @returns Macros in grams {protein_g, carbs_g, fat_g}
 *
 * Macro splits (from REQUIREMENTS.md):
 * - Weight Loss: 40% protein, 40% carbs, 20% fat
 * - Weight Gain: 35% protein, 50% carbs, 15% fat
 * - Maintain: 30% protein, 45% carbs, 25% fat
 *
 * Conversion:
 * - 1g protein = 4 calories
 * - 1g carbs = 4 calories
 * - 1g fat = 9 calories
 *
 * @example
 * const macros = calculateMacros(2000, 'lose_weight');
 * console.log(macros); // { protein_g: 200, carbs_g: 200, fat_g: 44 }
 */
export function calculateMacros(
  daily_calories: number,
  goal: 'lose_weight' | 'gain_weight' | 'maintain'
): { protein_g: number; carbs_g: number; fat_g: number } {
  // Validation
  if (daily_calories <= 0) {
    throw new Error('Daily calories must be positive');
  }

  // Macro splits by goal
  const macroSplits = {
    lose_weight: { protein: 0.4, carbs: 0.4, fat: 0.2 },
    gain_weight: { protein: 0.35, carbs: 0.5, fat: 0.15 },
    maintain: { protein: 0.3, carbs: 0.45, fat: 0.25 },
  };

  const split = macroSplits[goal];

  // Calculate calories per macro
  const protein_calories = daily_calories * split.protein;
  const carbs_calories = daily_calories * split.carbs;
  const fat_calories = daily_calories * split.fat;

  // Convert to grams
  const protein_g = Math.round(protein_calories / 4); // 4 cal/g
  const carbs_g = Math.round(carbs_calories / 4); // 4 cal/g
  const fat_g = Math.round(fat_calories / 9); // 9 cal/g

  return { protein_g, carbs_g, fat_g };
}

/**
 * Timeline Validation Result
 */
export interface TimelineValidationResult {
  valid: boolean;
  weekly_rate: number;
  weeks: number;
  error?: string;
  recommended_weeks?: number;
  recommended_date?: Date;
}

/**
 * Timeline Validation Input
 */
export interface TimelineInput {
  goal: 'lose_weight' | 'gain_weight' | 'maintain';
  current_weight: number;
  goal_weight: number;
  goal_date: Date;
}

/**
 * Validate timeline for weight loss/gain goals
 *
 * @param input - Timeline parameters
 * @returns Validation result with safe rate check
 *
 * Safety Limits:
 * - Weight Loss: Max 2 lbs/week
 * - Weight Gain: Max 1 lb/week
 * - Minimum timeline: 4 weeks
 * - Maximum timeline: 52 weeks
 *
 * @example
 * const result = validateTimeline({
 *   goal: 'lose_weight',
 *   current_weight: 200,
 *   goal_weight: 170,
 *   goal_date: new Date('2026-03-01')
 * });
 * if (result.valid) {
 *   console.log(`Safe rate: ${result.weekly_rate} lbs/week`);
 * } else {
 *   console.log(`Unsafe: ${result.error}`);
 *   console.log(`Recommended: ${result.recommended_weeks} weeks`);
 * }
 */
export function validateTimeline(input: TimelineInput): TimelineValidationResult {
  const { goal, current_weight, goal_weight, goal_date } = input;

  // Maintain goal always valid (no timeline needed)
  if (goal === 'maintain') {
    return {
      valid: true,
      weekly_rate: 0,
      weeks: 0,
    };
  }

  // Validate goal_date is in the future
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize to start of day
  const goalDate = new Date(goal_date);
  goalDate.setHours(0, 0, 0, 0);

  if (goalDate <= today) {
    return {
      valid: false,
      weekly_rate: 0,
      weeks: 0,
      error: 'Goal date must be in the future',
    };
  }

  // Calculate weeks from today to goal_date
  const millisecondsPerWeek = 7 * 24 * 60 * 60 * 1000;
  const weeks = Math.round((goalDate.getTime() - today.getTime()) / millisecondsPerWeek);

  // Validate timeline range (4-52 weeks)
  if (weeks < 4) {
    return {
      valid: false,
      weekly_rate: 0,
      weeks,
      error: 'Minimum timeline is 4 weeks',
    };
  }

  if (weeks > 52) {
    return {
      valid: false,
      weekly_rate: 0,
      weeks,
      error: 'Maximum timeline is 52 weeks (1 year)',
    };
  }

  // Calculate weight difference
  const weight_diff = goal_weight - current_weight;

  // Validate weight direction matches goal
  if (goal === 'lose_weight' && weight_diff >= 0) {
    return {
      valid: false,
      weekly_rate: 0,
      weeks,
      error: 'Goal weight must be lower than current weight for weight loss',
    };
  }

  if (goal === 'gain_weight' && weight_diff <= 0) {
    return {
      valid: false,
      weekly_rate: 0,
      weeks,
      error: 'Goal weight must be higher than current weight for weight gain',
    };
  }

  // Calculate weekly rate
  const weekly_rate = weight_diff / weeks;

  // Safety limits
  const MAX_LOSS_RATE = -2.0; // lbs/week (negative for loss)
  const MAX_GAIN_RATE = 1.0; // lbs/week (positive for gain)

  // Check weight loss rate
  if (goal === 'lose_weight') {
    if (weekly_rate < MAX_LOSS_RATE) {
      // Too fast - calculate recommended timeline
      const recommended_weeks = Math.ceil(Math.abs(weight_diff) / 2.0);
      const recommended_date = new Date(today);
      recommended_date.setDate(recommended_date.getDate() + recommended_weeks * 7);

      return {
        valid: false,
        weekly_rate,
        weeks,
        error: 'Maximum safe rate is 2 lbs/week for weight loss',
        recommended_weeks,
        recommended_date,
      };
    }
  }

  // Check weight gain rate
  if (goal === 'gain_weight') {
    if (weekly_rate > MAX_GAIN_RATE) {
      // Too fast - calculate recommended timeline
      const recommended_weeks = Math.ceil(Math.abs(weight_diff) / 1.0);
      const recommended_date = new Date(today);
      recommended_date.setDate(recommended_date.getDate() + recommended_weeks * 7);

      return {
        valid: false,
        weekly_rate,
        weeks,
        error: 'Maximum safe rate is 1 lb/week for weight gain',
        recommended_weeks,
        recommended_date,
      };
    }
  }

  // Timeline is safe
  return {
    valid: true,
    weekly_rate,
    weeks,
  };
}

/**
 * Calorie Adjustment Result
 */
export interface CalorieAdjustmentResult {
  calories: number;
  adjusted: boolean;
  warning?: string;
  original_calories?: number;
  new_timeline?: Date;
}

/**
 * Apply calorie floor and ceiling with automatic timeline adjustment
 *
 * @param calculated_calories - Calculated daily calorie target
 * @param sex - User sex ('male' or 'female') for minimum floor
 * @param goal - Weight goal type
 * @param weight_diff - Total weight to lose/gain (lbs)
 * @returns Adjusted calories with warnings if modified
 *
 * Safety Limits:
 * - Female minimum: 1200 cal/day
 * - Male minimum: 1500 cal/day
 * - Maximum: 5000 cal/day (hard cap)
 * - Warning: 4000+ cal/day requires confirmation
 *
 * @example
 * const result = applyCalorieBounds(900, 'female', 'lose_weight', -40);
 * console.log(result.calories); // 1200 (adjusted from 900)
 * console.log(result.adjusted); // true
 * console.log(result.warning); // "Target adjusted to minimum 1200 cal/day"
 */
export function applyCalorieBounds(
  calculated_calories: number,
  sex: 'male' | 'female',
  goal: 'lose_weight' | 'gain_weight' | 'maintain',
  weight_diff: number = 0
): CalorieAdjustmentResult {
  const MIN_FEMALE = 1200;
  const MIN_MALE = 1500;
  const MAX_CALORIES = 5000;
  const WARNING_THRESHOLD = 4000;

  const min_calories = sex === 'female' ? MIN_FEMALE : MIN_MALE;
  let final_calories = Math.round(calculated_calories);
  let adjusted = false;
  let warning: string | undefined;
  let new_timeline: Date | undefined;

  // Check minimum floor
  if (final_calories < min_calories) {
    adjusted = true;
    const original = final_calories;
    final_calories = min_calories;

    // Calculate extended timeline
    if (goal === 'lose_weight' && weight_diff < 0) {
      const deficit = calculated_calories - final_calories; // How much we reduced deficit
      const extended_weeks = Math.ceil(Math.abs(deficit * 7) / 3500); // Extra weeks needed
      new_timeline = new Date();
      new_timeline.setDate(new_timeline.getDate() + extended_weeks * 7);

      warning = `Target adjusted to minimum ${min_calories} cal/day for safety. Timeline extended by ~${extended_weeks} weeks.`;
    } else {
      warning = `Target adjusted to minimum ${min_calories} cal/day for safety.`;
    }

    return {
      calories: final_calories,
      adjusted,
      warning,
      original_calories: original,
      new_timeline,
    };
  }

  // Check maximum ceiling
  if (final_calories > MAX_CALORIES) {
    adjusted = true;
    const original = final_calories;
    final_calories = MAX_CALORIES;

    // Calculate extended timeline
    if (goal === 'gain_weight' && weight_diff > 0) {
      const surplus_reduction = original - final_calories; // How much we reduced surplus
      const extended_weeks = Math.ceil(Math.abs(surplus_reduction * 7) / 3500); // Extra weeks needed
      new_timeline = new Date();
      new_timeline.setDate(new_timeline.getDate() + extended_weeks * 7);

      warning = `Target adjusted to maximum ${MAX_CALORIES} cal/day for safety. Timeline extended by ~${extended_weeks} weeks.`;
    } else {
      warning = `Target adjusted to maximum ${MAX_CALORIES} cal/day for safety.`;
    }

    return {
      calories: final_calories,
      adjusted,
      warning,
      original_calories: original,
      new_timeline,
    };
  }

  // Check warning threshold (4000+)
  if (final_calories >= WARNING_THRESHOLD) {
    warning = `High calorie target (${final_calories} cal/day). Please confirm this is appropriate for your goals.`;
  }

  return {
    calories: final_calories,
    adjusted,
    warning,
  };
}
