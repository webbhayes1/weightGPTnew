/**
 * Macro Distribution Calculation Tests
 *
 * Macro Splits (from REQUIREMENTS.md):
 * - Weight Loss: 40% protein, 40% carbs, 20% fat
 * - Weight Gain: 35% protein, 50% carbs, 15% fat
 * - Maintain: 30% protein, 45% carbs, 25% fat
 *
 * Conversion:
 * - 1g protein = 4 calories
 * - 1g carbs = 4 calories
 * - 1g fat = 9 calories
 */

import { calculateMacros } from '../../src/utils/calculations.util';

describe('calculateMacros', () => {
  describe('Weight Loss Macros (40/40/20)', () => {
    it('should calculate macros for 2000 cal/day weight loss target', () => {
      const result = calculateMacros(2000, 'lose_weight');

      // 40% protein = 800 cal = 200g (800 / 4)
      // 40% carbs = 800 cal = 200g (800 / 4)
      // 20% fat = 400 cal = 44g (400 / 9)
      expect(result.protein_g).toBe(200);
      expect(result.carbs_g).toBe(200);
      expect(result.fat_g).toBe(44);
    });

    it('should calculate macros for 1500 cal/day weight loss target', () => {
      const result = calculateMacros(1500, 'lose_weight');

      // 40% protein = 600 cal = 150g
      // 40% carbs = 600 cal = 150g
      // 20% fat = 300 cal = 33g
      expect(result.protein_g).toBe(150);
      expect(result.carbs_g).toBe(150);
      expect(result.fat_g).toBe(33);
    });

    it('should calculate macros for 2500 cal/day weight loss target', () => {
      const result = calculateMacros(2500, 'lose_weight');

      // 40% protein = 1000 cal = 250g
      // 40% carbs = 1000 cal = 250g
      // 20% fat = 500 cal = 56g
      expect(result.protein_g).toBe(250);
      expect(result.carbs_g).toBe(250);
      expect(result.fat_g).toBe(56);
    });
  });

  describe('Weight Gain Macros (35/50/15)', () => {
    it('should calculate macros for 3000 cal/day weight gain target', () => {
      const result = calculateMacros(3000, 'gain_weight');

      // 35% protein = 1050 cal = 263g (1050 / 4)
      // 50% carbs = 1500 cal = 375g (1500 / 4)
      // 15% fat = 450 cal = 50g (450 / 9)
      expect(result.protein_g).toBe(263);
      expect(result.carbs_g).toBe(375);
      expect(result.fat_g).toBe(50);
    });

    it('should calculate macros for 2800 cal/day weight gain target', () => {
      const result = calculateMacros(2800, 'gain_weight');

      // 35% protein = 980 cal = 245g
      // 50% carbs = 1400 cal = 350g
      // 15% fat = 420 cal = 47g
      expect(result.protein_g).toBe(245);
      expect(result.carbs_g).toBe(350);
      expect(result.fat_g).toBe(47);
    });
  });

  describe('Maintain Weight Macros (30/45/25)', () => {
    it('should calculate macros for 2200 cal/day maintain target', () => {
      const result = calculateMacros(2200, 'maintain');

      // 30% protein = 660 cal = 165g
      // 45% carbs = 990 cal = 248g
      // 25% fat = 550 cal = 61g
      expect(result.protein_g).toBe(165);
      expect(result.carbs_g).toBe(248);
      expect(result.fat_g).toBe(61);
    });

    it('should calculate macros for 2000 cal/day maintain target', () => {
      const result = calculateMacros(2000, 'maintain');

      // 30% protein = 600 cal = 150g
      // 45% carbs = 900 cal = 225g
      // 25% fat = 500 cal = 56g
      expect(result.protein_g).toBe(150);
      expect(result.carbs_g).toBe(225);
      expect(result.fat_g).toBe(56);
    });
  });

  describe('Edge Cases', () => {
    it('should throw error for negative calories', () => {
      expect(() => calculateMacros(-100, 'lose_weight')).toThrow(
        'Daily calories must be positive'
      );
    });

    it('should throw error for zero calories', () => {
      expect(() => calculateMacros(0, 'maintain')).toThrow(
        'Daily calories must be positive'
      );
    });
  });

  describe('Minimum Calorie Floor (1200 female, 1500 male)', () => {
    it('should calculate macros for female minimum (1200 cal)', () => {
      const result = calculateMacros(1200, 'lose_weight');

      // 40% protein = 480 cal = 120g
      // 40% carbs = 480 cal = 120g
      // 20% fat = 240 cal = 27g
      expect(result.protein_g).toBe(120);
      expect(result.carbs_g).toBe(120);
      expect(result.fat_g).toBe(27);
    });

    it('should calculate macros for male minimum (1500 cal)', () => {
      const result = calculateMacros(1500, 'lose_weight');

      // 40% protein = 600 cal = 150g
      // 40% carbs = 600 cal = 150g
      // 20% fat = 300 cal = 33g
      expect(result.protein_g).toBe(150);
      expect(result.carbs_g).toBe(150);
      expect(result.fat_g).toBe(33);
    });
  });

  describe('Maximum Calorie Ceiling (5000 cal)', () => {
    it('should calculate macros for maximum calories (5000 cal)', () => {
      const result = calculateMacros(5000, 'gain_weight');

      // 35% protein = 1750 cal = 438g
      // 50% carbs = 2500 cal = 625g
      // 15% fat = 750 cal = 83g
      expect(result.protein_g).toBe(438);
      expect(result.carbs_g).toBe(625);
      expect(result.fat_g).toBe(83);
    });
  });

  describe('Return Value Validation', () => {
    it('should return positive integers only', () => {
      const result = calculateMacros(2200, 'maintain');

      expect(result.protein_g).toBeGreaterThan(0);
      expect(result.carbs_g).toBeGreaterThan(0);
      expect(result.fat_g).toBeGreaterThan(0);

      expect(Number.isInteger(result.protein_g)).toBe(true);
      expect(Number.isInteger(result.carbs_g)).toBe(true);
      expect(Number.isInteger(result.fat_g)).toBe(true);
    });

    it('should return object with correct keys', () => {
      const result = calculateMacros(2000, 'lose_weight');

      expect(result).toHaveProperty('protein_g');
      expect(result).toHaveProperty('carbs_g');
      expect(result).toHaveProperty('fat_g');
      expect(Object.keys(result)).toHaveLength(3);
    });
  });

  describe('Macro Total Validation', () => {
    it('should sum to approximately target calories (within 5% due to rounding)', () => {
      const target = 2000;
      const result = calculateMacros(target, 'lose_weight');

      // Convert back to calories
      const total_calories =
        result.protein_g * 4 + result.carbs_g * 4 + result.fat_g * 9;

      // Allow 5% tolerance for rounding
      const tolerance = target * 0.05;
      expect(total_calories).toBeGreaterThanOrEqual(target - tolerance);
      expect(total_calories).toBeLessThanOrEqual(target + tolerance);
    });

    it('should have reasonable macro distribution for weight loss', () => {
      const result = calculateMacros(2000, 'lose_weight');

      // Protein should be significant (high protein for muscle retention)
      expect(result.protein_g).toBeGreaterThanOrEqual(150);

      // Fat should be lower (for calorie deficit)
      expect(result.fat_g).toBeLessThanOrEqual(60);

      // Carbs should be balanced
      expect(result.carbs_g).toBeGreaterThanOrEqual(150);
    });
  });
});
