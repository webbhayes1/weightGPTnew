/**
 * Daily Calorie Target Calculation Tests
 * Formula: Target = TDEE + (weekly_rate × 3500 / 7)
 * - 1 lb fat = 3500 calories
 */

import { calculateDailyCalories } from '../../src/utils/calculations.util';

describe('calculateDailyCalories', () => {
  const typical_tdee = 2764; // From TDEE tests (male, moderate activity)

  describe('Maintain Weight Goal', () => {
    it('should return TDEE unchanged for maintain goal', () => {
      const result = calculateDailyCalories(typical_tdee, 'maintain');
      expect(result).toBe(2764);
    });

    it('should ignore weekly_rate for maintain goal', () => {
      const result = calculateDailyCalories(typical_tdee, 'maintain', -1.5);
      expect(result).toBe(2764); // Should still be TDEE
    });
  });

  describe('Weight Loss Goal', () => {
    it('should calculate calorie deficit for -1 lb/week loss', () => {
      const result = calculateDailyCalories(typical_tdee, 'lose_weight', -1.0);
      // Daily deficit = (1 lb × 3500 cal) / 7 days = 500 cal/day
      // Target = 2764 - 500 = 2264
      expect(result).toBe(2264);
    });

    it('should calculate calorie deficit for -1.5 lbs/week loss', () => {
      const result = calculateDailyCalories(typical_tdee, 'lose_weight', -1.5);
      // Daily deficit = (1.5 lbs × 3500) / 7 = 750 cal/day
      // Target = 2764 - 750 = 2014
      expect(result).toBe(2014);
    });

    it('should calculate calorie deficit for -2 lbs/week loss (max safe rate)', () => {
      const result = calculateDailyCalories(typical_tdee, 'lose_weight', -2.0);
      // Daily deficit = (2 lbs × 3500) / 7 = 1000 cal/day
      // Target = 2764 - 1000 = 1764
      expect(result).toBe(1764);
    });

    it('should calculate calorie deficit for -0.5 lbs/week loss (slow loss)', () => {
      const result = calculateDailyCalories(typical_tdee, 'lose_weight', -0.5);
      // Daily deficit = (0.5 lbs × 3500) / 7 = 250 cal/day
      // Target = 2764 - 250 = 2514
      expect(result).toBe(2514);
    });
  });

  describe('Weight Gain Goal', () => {
    it('should calculate calorie surplus for +0.5 lbs/week gain', () => {
      const result = calculateDailyCalories(typical_tdee, 'gain_weight', 0.5);
      // Daily surplus = (0.5 lbs × 3500) / 7 = 250 cal/day
      // Target = 2764 + 250 = 3014
      expect(result).toBe(3014);
    });

    it('should calculate calorie surplus for +1 lb/week gain (max safe rate)', () => {
      const result = calculateDailyCalories(typical_tdee, 'gain_weight', 1.0);
      // Daily surplus = (1 lb × 3500) / 7 = 500 cal/day
      // Target = 2764 + 500 = 3264
      expect(result).toBe(3264);
    });

    it('should calculate calorie surplus for +0.75 lbs/week gain', () => {
      const result = calculateDailyCalories(typical_tdee, 'gain_weight', 0.75);
      // Daily surplus = (0.75 lbs × 3500) / 7 = 375 cal/day
      // Target = 2764 + 375 = 3139
      expect(result).toBe(3139);
    });
  });

  describe('Edge Cases', () => {
    it('should throw error for negative TDEE', () => {
      expect(() => calculateDailyCalories(-100, 'lose_weight', -1.0)).toThrow(
        'TDEE must be positive'
      );
    });

    it('should throw error for zero TDEE', () => {
      expect(() => calculateDailyCalories(0, 'maintain')).toThrow('TDEE must be positive');
    });
  });

  describe('Female Typical Values', () => {
    const female_tdee = 2102; // From TDEE tests (female, moderate activity)

    it('should calculate calorie deficit for female losing -1.5 lbs/week', () => {
      const result = calculateDailyCalories(female_tdee, 'lose_weight', -1.5);
      // Target = 2102 - 750 = 1352
      expect(result).toBe(1352);
    });

    it('should calculate calorie surplus for female gaining +0.5 lbs/week', () => {
      const result = calculateDailyCalories(female_tdee, 'gain_weight', 0.5);
      // Target = 2102 + 250 = 2352
      expect(result).toBe(2352);
    });
  });

  describe('Return Value Validation', () => {
    it('should return a positive integer', () => {
      const result = calculateDailyCalories(2000, 'lose_weight', -1.0);
      expect(result).toBeGreaterThan(0);
      expect(Number.isInteger(result)).toBe(true);
    });

    it('should return rounded value (no decimals)', () => {
      const result = calculateDailyCalories(2783, 'lose_weight', -1.25);
      expect(result % 1).toBe(0); // No decimal part
    });
  });
});
