/**
 * TDEE Calculation Tests
 * Formula: TDEE = BMR × Activity Multiplier
 */

import { calculateTDEE } from '../../src/utils/calculations.util';

describe('calculateTDEE', () => {
  const typical_male_bmr = 1783; // From BMR tests
  const typical_female_bmr = 1356; // From BMR tests

  describe('Activity Levels', () => {
    it('should calculate TDEE for sedentary activity level (1.2x)', () => {
      const result = calculateTDEE(typical_male_bmr, 'sedentary');
      // 1783 × 1.2 = 2139.6 ≈ 2140
      expect(result).toBe(2140);
    });

    it('should calculate TDEE for moderate activity level (1.55x)', () => {
      const result = calculateTDEE(typical_male_bmr, 'moderate');
      // 1783 × 1.55 = 2763.65 ≈ 2764
      expect(result).toBe(2764);
    });

    it('should calculate TDEE for active activity level (1.725x)', () => {
      const result = calculateTDEE(typical_male_bmr, 'active');
      // 1783 × 1.725 = 3075.675 ≈ 3076
      expect(result).toBe(3076);
    });
  });

  describe('Female TDEE Calculations', () => {
    it('should calculate TDEE for female with sedentary activity', () => {
      const result = calculateTDEE(typical_female_bmr, 'sedentary');
      // 1356 × 1.2 = 1627.2 ≈ 1627
      expect(result).toBe(1627);
    });

    it('should calculate TDEE for female with moderate activity', () => {
      const result = calculateTDEE(typical_female_bmr, 'moderate');
      // 1356 × 1.55 = 2101.8 ≈ 2102
      expect(result).toBe(2102);
    });

    it('should calculate TDEE for female with active lifestyle', () => {
      const result = calculateTDEE(typical_female_bmr, 'active');
      // 1356 × 1.725 = 2339.1 ≈ 2339
      expect(result).toBe(2339);
    });
  });

  describe('Edge Cases', () => {
    it('should throw error for negative BMR', () => {
      expect(() => calculateTDEE(-100, 'moderate')).toThrow('BMR must be positive');
    });

    it('should throw error for zero BMR', () => {
      expect(() => calculateTDEE(0, 'moderate')).toThrow('BMR must be positive');
    });

    it('should throw error for invalid activity level', () => {
      expect(() => calculateTDEE(1783, 'very_active' as any)).toThrow(
        'Activity level must be "sedentary", "moderate", or "active"'
      );
    });
  });

  describe('Return Value Validation', () => {
    it('should return a positive integer', () => {
      const result = calculateTDEE(1500, 'moderate');
      expect(result).toBeGreaterThan(0);
      expect(Number.isInteger(result)).toBe(true);
    });

    it('should return rounded value (no decimals)', () => {
      const result = calculateTDEE(1783, 'active');
      expect(result % 1).toBe(0); // No decimal part
    });
  });

  describe('Realistic Range Validation', () => {
    it('should produce TDEE within realistic range for sedentary (1500-3000)', () => {
      const result = calculateTDEE(2000, 'sedentary');
      expect(result).toBeGreaterThanOrEqual(1500);
      expect(result).toBeLessThanOrEqual(3000);
    });

    it('should produce TDEE within realistic range for active (2000-4500)', () => {
      const result = calculateTDEE(2500, 'active');
      expect(result).toBeGreaterThanOrEqual(2000);
      expect(result).toBeLessThanOrEqual(4500);
    });
  });
});
