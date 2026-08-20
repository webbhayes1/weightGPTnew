/**
 * Tests for Health & Fitness Calculations
 * Target: 100% code coverage for critical calculation functions
 *
 * Test Structure (AAA Pattern):
 * - Arrange: Set up test data
 * - Act: Execute function
 * - Assert: Verify result
 */

import {
  // Conversion functions
  lbsToKg,
  kgToLbs,
  inchesToCm,
  cmToInches,
  // Calculation functions
  calculateBMR,
  calculateTDEE,
  calculateDailyCalories,
  applySafeCalorieLimits,
  calculateMacros,
  validateTimeline,
  // Constants
  ACTIVITY_MULTIPLIERS,
  GOAL_ADJUSTMENTS,
  SAFE_RATES,
  CALORIE_LIMITS,
  MACRO_DISTRIBUTIONS,
} from '../../src/utils/calculations';

describe('Unit Conversion Functions', () => {
  describe('lbsToKg', () => {
    it('should convert pounds to kilograms correctly', () => {
      expect(lbsToKg(220)).toBeCloseTo(99.79, 2);
      expect(lbsToKg(150)).toBeCloseTo(68.04, 2);
      expect(lbsToKg(100)).toBeCloseTo(45.36, 2);
    });

    it('should handle edge cases', () => {
      expect(lbsToKg(0)).toBe(0);
      expect(lbsToKg(1)).toBeCloseTo(0.45, 2);
    });
  });

  describe('kgToLbs', () => {
    it('should convert kilograms to pounds correctly', () => {
      expect(kgToLbs(100)).toBeCloseTo(220.46, 2);
      expect(kgToLbs(70)).toBeCloseTo(154.32, 2);
      expect(kgToLbs(50)).toBeCloseTo(110.23, 2);
    });

    it('should handle edge cases', () => {
      expect(kgToLbs(0)).toBe(0);
      expect(kgToLbs(1)).toBeCloseTo(2.20, 2);
    });
  });

  describe('inchesToCm', () => {
    it('should convert inches to centimeters correctly', () => {
      expect(inchesToCm(70)).toBeCloseTo(177.8, 1);
      expect(inchesToCm(65)).toBeCloseTo(165.1, 1);
      expect(inchesToCm(72)).toBeCloseTo(182.88, 2);
    });

    it('should handle edge cases', () => {
      expect(inchesToCm(0)).toBe(0);
      expect(inchesToCm(1)).toBeCloseTo(2.54, 2);
    });
  });

  describe('cmToInches', () => {
    it('should convert centimeters to inches correctly', () => {
      expect(cmToInches(180)).toBeCloseTo(70.87, 2);
      expect(cmToInches(165)).toBeCloseTo(64.96, 2);
      expect(cmToInches(175)).toBeCloseTo(68.90, 2);
    });

    it('should handle edge cases', () => {
      expect(cmToInches(0)).toBe(0);
      expect(cmToInches(2.54)).toBeCloseTo(1, 2);
    });
  });
});

describe('calculateBMR', () => {
  describe('Male BMR calculations', () => {
    it('should calculate BMR correctly for 30-year-old male, 180 lbs, 70 inches', () => {
      const result = calculateBMR(180, 70, 30, 'male');
      expect(result).toBe(1783); // Mifflin-St Jeor formula actual result
    });

    it('should calculate BMR correctly for 25-year-old male, 200 lbs, 72 inches', () => {
      const result = calculateBMR(200, 72, 25, 'male');
      expect(result).toBeGreaterThan(1900);
      expect(result).toBeLessThan(2100);
    });

    it('should calculate BMR correctly for 45-year-old male, 150 lbs, 68 inches', () => {
      const result = calculateBMR(150, 68, 45, 'male');
      expect(result).toBeGreaterThan(1500);
      expect(result).toBeLessThan(1700);
    });
  });

  describe('Female BMR calculations', () => {
    it('should calculate BMR correctly for 25-year-old female, 140 lbs, 65 inches', () => {
      const result = calculateBMR(140, 65, 25, 'female');
      expect(result).toBeGreaterThan(1300);
      expect(result).toBeLessThan(1500);
    });

    it('should calculate BMR correctly for 30-year-old female, 160 lbs, 67 inches', () => {
      const result = calculateBMR(160, 67, 30, 'female');
      expect(result).toBeGreaterThan(1400);
      expect(result).toBeLessThan(1600);
    });

    it('should calculate lower BMR for females than males (same stats)', () => {
      const maleBMR = calculateBMR(170, 68, 30, 'male');
      const femaleBMR = calculateBMR(170, 68, 30, 'female');
      expect(femaleBMR).toBeLessThan(maleBMR);
      expect(maleBMR - femaleBMR).toBe(166); // Mifflin-St Jeor difference
    });
  });

  describe('Validation and error handling', () => {
    it('should throw error for age < 13', () => {
      expect(() => calculateBMR(150, 65, 12, 'male')).toThrow(
        'Age must be 13 or older'
      );
      expect(() => calculateBMR(150, 65, 10, 'female')).toThrow(
        'Age must be 13 or older'
      );
    });

    it('should throw error for invalid weight', () => {
      expect(() => calculateBMR(0, 65, 25, 'male')).toThrow(
        'Weight and height must be positive values'
      );
      expect(() => calculateBMR(-100, 65, 25, 'male')).toThrow(
        'Weight and height must be positive values'
      );
    });

    it('should throw error for invalid height', () => {
      expect(() => calculateBMR(150, 0, 25, 'male')).toThrow(
        'Weight and height must be positive values'
      );
      expect(() => calculateBMR(150, -65, 25, 'male')).toThrow(
        'Weight and height must be positive values'
      );
    });

    it('should throw error for invalid sex', () => {
      expect(() => calculateBMR(150, 65, 25, 'other' as any)).toThrow(
        'Sex must be "male" or "female"'
      );
      expect(() => calculateBMR(150, 65, 25, '' as any)).toThrow(
        'Sex must be "male" or "female"'
      );
    });

    it('should accept minimum valid age (13)', () => {
      expect(() => calculateBMR(120, 60, 13, 'female')).not.toThrow();
    });

    it('should accept maximum realistic age (100)', () => {
      expect(() => calculateBMR(140, 65, 100, 'female')).not.toThrow();
    });
  });

  describe('Edge cases', () => {
    it('should handle very tall person', () => {
      const result = calculateBMR(220, 84, 25, 'male'); // 7 feet tall
      expect(result).toBeGreaterThan(2200);
    });

    it('should handle very short person', () => {
      const result = calculateBMR(100, 54, 25, 'female'); // 4'6"
      expect(result).toBeGreaterThan(1000);
      expect(result).toBeLessThan(1300);
    });

    it('should handle senior age (65+)', () => {
      const result = calculateBMR(160, 67, 70, 'male');
      expect(result).toBeGreaterThan(1300);
      expect(result).toBeLessThan(1700);
    });
  });
});

describe('calculateTDEE', () => {
  const sampleBMR = 1820;

  it('should calculate TDEE for sedentary activity level', () => {
    const result = calculateTDEE(sampleBMR, 'sedentary');
    expect(result).toBe(Math.round(1820 * 1.2));
    expect(result).toBe(2184);
  });

  it('should calculate TDEE for lightly active level', () => {
    const result = calculateTDEE(sampleBMR, 'lightly_active');
    expect(result).toBe(Math.round(1820 * 1.375));
    expect(result).toBe(2503);
  });

  it('should calculate TDEE for moderately active level', () => {
    const result = calculateTDEE(sampleBMR, 'moderately_active');
    expect(result).toBe(Math.round(1820 * 1.55));
    expect(result).toBe(2821);
  });

  it('should calculate TDEE for very active level', () => {
    const result = calculateTDEE(sampleBMR, 'very_active');
    expect(result).toBe(Math.round(1820 * 1.725));
    expect(result).toBe(3140);
  });

  it('should calculate TDEE for extra active level', () => {
    const result = calculateTDEE(sampleBMR, 'extra_active');
    expect(result).toBe(Math.round(1820 * 1.9));
    expect(result).toBe(3458);
  });

  describe('Error handling', () => {
    it('should throw error for invalid BMR', () => {
      expect(() => calculateTDEE(0, 'moderately_active')).toThrow(
        'BMR must be a positive value'
      );
      expect(() => calculateTDEE(-1000, 'moderately_active')).toThrow(
        'BMR must be a positive value'
      );
    });

    it('should throw error for invalid activity level', () => {
      expect(() => calculateTDEE(1820, 'invalid' as any)).toThrow(
        'Invalid activity level: invalid'
      );
    });
  });
});

describe('calculateDailyCalories', () => {
  const sampleTDEE = 2821;

  it('should calculate calories for weight loss goal (20% deficit)', () => {
    const result = calculateDailyCalories(sampleTDEE, 'lose_weight');
    expect(result).toBe(Math.round(2821 * 0.8));
    expect(result).toBe(2257);
  });

  it('should calculate calories for weight gain goal (15% surplus)', () => {
    const result = calculateDailyCalories(sampleTDEE, 'gain_weight');
    expect(result).toBe(Math.round(2821 * 1.15));
    expect(result).toBe(3244);
  });

  it('should calculate calories for maintenance goal (no change)', () => {
    const result = calculateDailyCalories(sampleTDEE, 'maintain');
    expect(result).toBe(2821);
  });

  describe('Error handling', () => {
    it('should throw error for invalid TDEE', () => {
      expect(() => calculateDailyCalories(0, 'lose_weight')).toThrow(
        'TDEE must be a positive value'
      );
      expect(() => calculateDailyCalories(-2000, 'lose_weight')).toThrow(
        'TDEE must be a positive value'
      );
    });

    it('should throw error for invalid goal type', () => {
      expect(() => calculateDailyCalories(2821, 'invalid' as any)).toThrow(
        'Invalid goal type: invalid'
      );
    });
  });
});

describe('applySafeCalorieLimits', () => {
  describe('Female limits', () => {
    it('should not adjust calories within safe range', () => {
      const result = applySafeCalorieLimits(1500, 'female');
      expect(result.adjustedCalories).toBe(1500);
      expect(result.wasAdjusted).toBe(false);
      expect(result.reason).toBeUndefined();
    });

    it('should apply floor limit (1200) when calories too low', () => {
      const result = applySafeCalorieLimits(1000, 'female');
      expect(result.adjustedCalories).toBe(1200);
      expect(result.wasAdjusted).toBe(true);
      expect(result.reason).toBe('floor');
    });

    it('should apply ceiling limit (5000) when calories too high', () => {
      const result = applySafeCalorieLimits(6000, 'female');
      expect(result.adjustedCalories).toBe(5000);
      expect(result.wasAdjusted).toBe(true);
      expect(result.reason).toBe('ceiling');
    });

    it('should handle exact floor value', () => {
      const result = applySafeCalorieLimits(1200, 'female');
      expect(result.adjustedCalories).toBe(1200);
      expect(result.wasAdjusted).toBe(false);
    });
  });

  describe('Male limits', () => {
    it('should not adjust calories within safe range', () => {
      const result = applySafeCalorieLimits(2000, 'male');
      expect(result.adjustedCalories).toBe(2000);
      expect(result.wasAdjusted).toBe(false);
      expect(result.reason).toBeUndefined();
    });

    it('should apply floor limit (1500) when calories too low', () => {
      const result = applySafeCalorieLimits(1200, 'male');
      expect(result.adjustedCalories).toBe(1500);
      expect(result.wasAdjusted).toBe(true);
      expect(result.reason).toBe('floor');
    });

    it('should apply ceiling limit (5000) when calories too high', () => {
      const result = applySafeCalorieLimits(5500, 'male');
      expect(result.adjustedCalories).toBe(5000);
      expect(result.wasAdjusted).toBe(true);
      expect(result.reason).toBe('ceiling');
    });

    it('should handle exact floor value', () => {
      const result = applySafeCalorieLimits(1500, 'male');
      expect(result.adjustedCalories).toBe(1500);
      expect(result.wasAdjusted).toBe(false);
    });
  });
});

describe('calculateMacros', () => {
  describe('Weight loss macros (40% protein, 35% carbs, 25% fat)', () => {
    it('should calculate macros correctly for 2000 calories', () => {
      const result = calculateMacros(2000, 'lose_weight');
      expect(result.protein_g).toBe(200); // (2000 * 0.4) / 4
      expect(result.carbs_g).toBe(175); // (2000 * 0.35) / 4
      expect(result.fat_g).toBe(56); // (2000 * 0.25) / 9
    });

    it('should calculate macros correctly for 2257 calories', () => {
      const result = calculateMacros(2257, 'lose_weight');
      expect(result.protein_g).toBe(226); // (2257 * 0.4) / 4
      expect(result.carbs_g).toBe(197); // (2257 * 0.35) / 4
      expect(result.fat_g).toBe(63); // (2257 * 0.25) / 9
    });
  });

  describe('Weight gain macros (30% protein, 50% carbs, 20% fat)', () => {
    it('should calculate macros correctly for 3000 calories', () => {
      const result = calculateMacros(3000, 'gain_weight');
      expect(result.protein_g).toBe(225); // (3000 * 0.3) / 4
      expect(result.carbs_g).toBe(375); // (3000 * 0.5) / 4
      expect(result.fat_g).toBe(67); // (3000 * 0.2) / 9
    });
  });

  describe('Maintenance macros (30% protein, 45% carbs, 25% fat)', () => {
    it('should calculate macros correctly for 2500 calories', () => {
      const result = calculateMacros(2500, 'maintain');
      expect(result.protein_g).toBe(188); // (2500 * 0.3) / 4
      expect(result.carbs_g).toBe(281); // (2500 * 0.45) / 4
      expect(result.fat_g).toBe(69); // (2500 * 0.25) / 9
    });
  });

  describe('Error handling', () => {
    it('should throw error for invalid calories', () => {
      expect(() => calculateMacros(0, 'lose_weight')).toThrow(
        'Daily calories must be a positive value'
      );
      expect(() => calculateMacros(-1000, 'lose_weight')).toThrow(
        'Daily calories must be a positive value'
      );
    });

    it('should throw error for invalid goal type', () => {
      expect(() => calculateMacros(2000, 'invalid' as any)).toThrow(
        'Invalid goal type: invalid'
      );
    });
  });
});

describe('validateTimeline', () => {
  describe('Valid timelines', () => {
    it('should validate safe weight loss timeline (1.5 lbs/week)', () => {
      const now = new Date();
      const goalDate = new Date(now.getTime() + 20 * 7 * 24 * 60 * 60 * 1000); // 20 weeks
      const result = validateTimeline(200, 170, goalDate, 'lose_weight');

      expect(result.valid).toBe(true);
      expect(result.weeks).toBe(20);
      expect(result.requiredRate).toBeCloseTo(1.5, 1);
      expect(result.safeRate).toBe(2.0);
      expect(result.error).toBeUndefined();
    });

    it('should validate safe weight gain timeline (0.75 lbs/week)', () => {
      const now = new Date();
      const goalDate = new Date(now.getTime() + 16 * 7 * 24 * 60 * 60 * 1000); // 16 weeks
      const result = validateTimeline(150, 162, goalDate, 'gain_weight');

      expect(result.valid).toBe(true);
      expect(result.weeks).toBe(16);
      expect(result.requiredRate).toBeCloseTo(0.75, 1);
      expect(result.safeRate).toBe(1.0);
      expect(result.error).toBeUndefined();
    });

    it('should validate maximum safe rate (2 lbs/week for loss)', () => {
      const now = new Date();
      const goalDate = new Date(now.getTime() + 15 * 7 * 24 * 60 * 60 * 1000); // 15 weeks
      const result = validateTimeline(200, 170, goalDate, 'lose_weight');

      expect(result.valid).toBe(true);
      expect(result.requiredRate).toBe(2.0);
      expect(result.safeRate).toBe(2.0);
    });
  });

  describe('Invalid timelines - too aggressive', () => {
    it('should reject unsafe weight loss rate (3 lbs/week)', () => {
      const now = new Date();
      const goalDate = new Date(now.getTime() + 10 * 7 * 24 * 60 * 60 * 1000); // 10 weeks
      const result = validateTimeline(200, 170, goalDate, 'lose_weight');

      expect(result.valid).toBe(false);
      expect(result.requiredRate).toBe(3.0);
      expect(result.safeRate).toBe(2.0);
      expect(result.error).toContain('3.0 lbs/week exceeds safe maximum');
      expect(result.recommendedDate).toBeDefined();
    });

    it('should reject unsafe weight gain rate (2 lbs/week)', () => {
      const now = new Date();
      const goalDate = new Date(now.getTime() + 6 * 7 * 24 * 60 * 60 * 1000); // 6 weeks
      const result = validateTimeline(150, 162, goalDate, 'gain_weight');

      expect(result.valid).toBe(false);
      expect(result.requiredRate).toBe(2.0);
      expect(result.safeRate).toBe(1.0);
      expect(result.error).toContain('2.0 lbs/week exceeds safe maximum');
      expect(result.recommendedDate).toBeDefined();
    });
  });

  describe('Invalid timelines - too short', () => {
    it('should reject timeline under 4 weeks', () => {
      const now = new Date();
      const goalDate = new Date(now.getTime() + 2 * 7 * 24 * 60 * 60 * 1000); // 2 weeks
      const result = validateTimeline(200, 190, goalDate, 'lose_weight');

      expect(result.valid).toBe(false);
      expect(result.weeks).toBe(2);
      expect(result.error).toContain('Minimum 4 weeks required');
      expect(result.recommendedDate).toBeDefined();
    });
  });

  describe('Invalid timelines - too long', () => {
    it('should reject timeline over 52 weeks', () => {
      const now = new Date();
      const goalDate = new Date(now.getTime() + 60 * 7 * 24 * 60 * 60 * 1000); // 60 weeks
      const result = validateTimeline(200, 150, goalDate, 'lose_weight');

      expect(result.valid).toBe(false);
      expect(result.weeks).toBe(60);
      expect(result.error).toContain('Maximum 52 weeks allowed');
    });
  });

  describe('Edge cases', () => {
    it('should handle 1 week (rounds to minimum 1)', () => {
      const now = new Date();
      const goalDate = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000); // 3 days
      const result = validateTimeline(200, 199, goalDate, 'lose_weight');

      expect(result.weeks).toBe(1);
      expect(result.valid).toBe(false); // Still invalid (< 4 weeks)
    });

    it('should handle goal weight equal to current weight', () => {
      const now = new Date();
      const goalDate = new Date(now.getTime() + 12 * 7 * 24 * 60 * 60 * 1000);
      const result = validateTimeline(170, 170, goalDate, 'maintain');

      expect(result.requiredRate).toBe(0);
      expect(result.valid).toBe(true);
    });
  });
});

describe('Constants', () => {
  it('should have correct activity multipliers', () => {
    expect(ACTIVITY_MULTIPLIERS.sedentary).toBe(1.2);
    expect(ACTIVITY_MULTIPLIERS.lightly_active).toBe(1.375);
    expect(ACTIVITY_MULTIPLIERS.moderately_active).toBe(1.55);
    expect(ACTIVITY_MULTIPLIERS.very_active).toBe(1.725);
    expect(ACTIVITY_MULTIPLIERS.extra_active).toBe(1.9);
  });

  it('should have correct goal adjustments', () => {
    expect(GOAL_ADJUSTMENTS.lose_weight).toBe(-0.20);
    expect(GOAL_ADJUSTMENTS.gain_weight).toBe(0.15);
    expect(GOAL_ADJUSTMENTS.maintain).toBe(0);
  });

  it('should have correct safe rates', () => {
    expect(SAFE_RATES.max_loss_per_week).toBe(2.0);
    expect(SAFE_RATES.max_gain_per_week).toBe(1.0);
    expect(SAFE_RATES.min_timeline_weeks).toBe(4);
    expect(SAFE_RATES.max_timeline_weeks).toBe(52);
  });

  it('should have correct calorie limits', () => {
    expect(CALORIE_LIMITS.min_female).toBe(1200);
    expect(CALORIE_LIMITS.min_male).toBe(1500);
    expect(CALORIE_LIMITS.max).toBe(5000);
    expect(CALORIE_LIMITS.warning_threshold).toBe(4000);
  });

  it('should have correct macro distributions', () => {
    expect(MACRO_DISTRIBUTIONS.lose_weight).toEqual({ protein: 0.4, carbs: 0.35, fat: 0.25 });
    expect(MACRO_DISTRIBUTIONS.gain_weight).toEqual({ protein: 0.3, carbs: 0.5, fat: 0.2 });
    expect(MACRO_DISTRIBUTIONS.maintain).toEqual({ protein: 0.3, carbs: 0.45, fat: 0.25 });
  });
});
