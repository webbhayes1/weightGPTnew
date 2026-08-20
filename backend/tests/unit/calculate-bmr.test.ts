/**
 * BMR Calculation Tests (Test-Driven Development)
 * Formula: Mifflin-St Jeor equation
 *
 * Male: BMR = (10 × weight_kg) + (6.25 × height_cm) - (5 × age) + 5
 * Female: BMR = (10 × weight_kg) + (6.25 × height_cm) - (5 × age) - 161
 */

import { calculateBMR } from '../../src/utils/calculations.util';

describe('calculateBMR', () => {
  describe('Male BMR Calculations', () => {
    it('should calculate BMR for 30-year-old male, 180 lbs (81.6 kg), 70 inches (178 cm)', () => {
      // Q1 typical user profile
      const weight_lbs = 180;
      const height_inches = 70;
      const age = 30;
      const sex = 'male';

      const result = calculateBMR(weight_lbs, height_inches, age, sex);

      // Manual calculation:
      // weight_kg = 180 * 0.453592 = 81.65 kg
      // height_cm = 70 * 2.54 = 177.8 cm
      // BMR = (10 × 81.65) + (6.25 × 177.8) - (5 × 30) + 5
      // BMR = 816.5 + 1111.25 - 150 + 5
      // BMR = 1782.75 ≈ 1783 cal/day
      expect(result).toBeCloseTo(1783, 0);
    });

    it('should calculate BMR for 25-year-old male, 150 lbs (68 kg), 68 inches (173 cm)', () => {
      const result = calculateBMR(150, 68, 25, 'male');
      // Expected: ~1640 cal/day
      expect(result).toBeCloseTo(1640, 0);
    });

    it('should calculate BMR for 40-year-old male, 220 lbs (100 kg), 72 inches (183 cm)', () => {
      const result = calculateBMR(220, 72, 40, 'male');
      // Expected: ~1946 cal/day
      expect(result).toBeCloseTo(1946, 0);
    });
  });

  describe('Female BMR Calculations', () => {
    it('should calculate BMR for 30-year-old female, 140 lbs (63.5 kg), 65 inches (165 cm)', () => {
      const result = calculateBMR(140, 65, 30, 'female');
      // Manual calculation:
      // weight_kg = 140 * 0.453592 = 63.5 kg
      // height_cm = 65 * 2.54 = 165.1 cm
      // BMR = (10 × 63.5) + (6.25 × 165.1) - (5 × 30) - 161
      // BMR = 635 + 1031.875 - 150 - 161
      // BMR = 1355.875 ≈ 1356 cal/day
      expect(result).toBeCloseTo(1356, 0);
    });

    it('should calculate BMR for 25-year-old female, 120 lbs (54.4 kg), 62 inches (157 cm)', () => {
      const result = calculateBMR(120, 62, 25, 'female');
      // Expected: ~1243 cal/day
      expect(result).toBeCloseTo(1243, 0);
    });

    it('should calculate BMR for 45-year-old female, 180 lbs (81.6 kg), 67 inches (170 cm)', () => {
      const result = calculateBMR(180, 67, 45, 'female');
      // Expected: ~1494 cal/day
      expect(result).toBeCloseTo(1494, 0);
    });
  });

  describe('Edge Cases', () => {
    it('should throw error for age < 13 (parental permission required)', () => {
      expect(() => calculateBMR(150, 65, 12, 'male')).toThrow(
        'Age must be 13 or older (parental permission required for ages 13-17)'
      );
    });

    it('should throw error for age > 100 (unrealistic)', () => {
      expect(() => calculateBMR(150, 65, 101, 'male')).toThrow(
        'Age must be 100 or younger'
      );
    });

    it('should throw error for weight < 80 lbs (underweight concern)', () => {
      expect(() => calculateBMR(79, 65, 30, 'female')).toThrow(
        'Weight must be at least 80 lbs'
      );
    });

    it('should throw error for weight > 400 lbs (data quality concern)', () => {
      expect(() => calculateBMR(401, 70, 30, 'male')).toThrow(
        'Weight must be 400 lbs or less'
      );
    });

    it('should throw error for height < 4 feet (unrealistic for adults)', () => {
      expect(() => calculateBMR(150, 47, 30, 'male')).toThrow(
        'Height must be at least 48 inches (4 feet)'
      );
    });

    it('should throw error for height > 7 feet (unrealistic)', () => {
      expect(() => calculateBMR(200, 85, 30, 'male')).toThrow(
        'Height must be 84 inches (7 feet) or less'
      );
    });

    it('should throw error for invalid sex', () => {
      expect(() => calculateBMR(150, 65, 30, 'other' as any)).toThrow(
        'Sex must be "male" or "female"'
      );
    });
  });

  describe('Boundary Cases (13-17 age range)', () => {
    it('should accept age 13 (minimum with parental permission)', () => {
      const result = calculateBMR(120, 60, 13, 'male');
      expect(result).toBeGreaterThan(0);
    });

    it('should accept age 17 (maximum minor age)', () => {
      const result = calculateBMR(160, 68, 17, 'male');
      expect(result).toBeGreaterThan(0);
    });
  });

  describe('Boundary Cases (65+ age range)', () => {
    it('should accept age 65 (senior with medical disclaimer)', () => {
      const result = calculateBMR(170, 68, 65, 'male');
      expect(result).toBeGreaterThan(0);
    });

    it('should accept age 80', () => {
      const result = calculateBMR(160, 66, 80, 'female');
      expect(result).toBeGreaterThan(0);
    });
  });

  describe('Return Value Validation', () => {
    it('should return a positive integer', () => {
      const result = calculateBMR(150, 65, 30, 'male');
      expect(result).toBeGreaterThan(0);
      expect(Number.isInteger(result)).toBe(true);
    });

    it('should return rounded value (no decimals)', () => {
      const result = calculateBMR(175, 69, 35, 'female');
      expect(result % 1).toBe(0); // No decimal part
    });
  });
});
