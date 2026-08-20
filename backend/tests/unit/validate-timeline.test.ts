/**
 * Timeline Validation Tests
 *
 * Validates user's goal timeline to ensure safe weight loss/gain rates
 *
 * Safety Limits:
 * - Weight Loss: Max 2 lbs/week
 * - Weight Gain: Max 1 lb/week
 * - Minimum timeline: 4 weeks
 * - Maximum timeline: 52 weeks (1 year)
 */

import { validateTimeline } from '../../src/utils/calculations.util';

describe('validateTimeline', () => {
  // Helper to create date N weeks from today
  const weeksFromNow = (weeks: number): Date => {
    const date = new Date();
    date.setDate(date.getDate() + weeks * 7);
    return date;
  };

  describe('Weight Loss - Safe Rates', () => {
    it('should validate safe weight loss of 1.5 lbs/week (within 2 lb limit)', () => {
      const result = validateTimeline({
        goal: 'lose_weight',
        current_weight: 200,
        goal_weight: 170, // -30 lbs
        goal_date: weeksFromNow(20), // 20 weeks from now
      });

      expect(result.valid).toBe(true);
      expect(result.weekly_rate).toBeCloseTo(-1.5, 1);
      expect(result.weeks).toBe(20);
    });

    it('should validate safe weight loss of 1 lb/week', () => {
      const result = validateTimeline({
        goal: 'lose_weight',
        current_weight: 180,
        goal_weight: 160, // -20 lbs
        goal_date: weeksFromNow(20), // 20 weeks
      });

      expect(result.valid).toBe(true);
      expect(result.weekly_rate).toBeCloseTo(-1.0, 1);
    });

    it('should validate safe weight loss of 0.5 lbs/week (slow loss)', () => {
      const result = validateTimeline({
        goal: 'lose_weight',
        current_weight: 160,
        goal_weight: 150, // -10 lbs
        goal_date: weeksFromNow(20), // 20 weeks
      });

      expect(result.valid).toBe(true);
      expect(result.weekly_rate).toBeCloseTo(-0.5, 1);
    });

    it('should validate maximum safe rate of 2 lbs/week', () => {
      const result = validateTimeline({
        goal: 'lose_weight',
        current_weight: 200,
        goal_weight: 180, // -20 lbs
        goal_date: weeksFromNow(10), // 10 weeks (2 lbs/week)
      });

      expect(result.valid).toBe(true);
      expect(result.weekly_rate).toBeCloseTo(-2.0, 1);
    });
  });

  describe('Weight Loss - Unsafe Rates', () => {
    it('should reject weight loss > 2 lbs/week (unsafe)', () => {
      const result = validateTimeline({
        goal: 'lose_weight',
        current_weight: 200,
        goal_weight: 170, // -30 lbs
        goal_date: weeksFromNow(10), // 10 weeks = 3 lbs/week (too fast)
      });

      expect(result.valid).toBe(false);
      expect(result.error).toContain('Maximum safe rate is 2 lbs/week');
      expect(result.weekly_rate).toBeCloseTo(-3.0, 1);
      expect(result.recommended_date).toBeDefined();
    });

    it('should reject extreme weight loss (5 lbs/week)', () => {
      const result = validateTimeline({
        goal: 'lose_weight',
        current_weight: 250,
        goal_weight: 200, // -50 lbs
        goal_date: weeksFromNow(6), // 6 weeks = 8.3 lbs/week (way too fast)
      });

      expect(result.valid).toBe(false);
      expect(result.weekly_rate).toBeCloseTo(-8.3, 1);
    });

    it('should provide recommended safe date for unsafe timeline', () => {
      const result = validateTimeline({
        goal: 'lose_weight',
        current_weight: 200,
        goal_weight: 160, // -40 lbs
        goal_date: weeksFromNow(5), // 5 weeks (too fast)
      });

      expect(result.valid).toBe(false);
      expect(result.recommended_date).toBeDefined();
      expect(result.recommended_weeks).toBe(20); // 40 lbs / 2 lbs/week
    });
  });

  describe('Weight Gain - Safe Rates', () => {
    it('should validate safe weight gain of 0.5 lbs/week', () => {
      const result = validateTimeline({
        goal: 'gain_weight',
        current_weight: 150,
        goal_weight: 165, // +15 lbs
        goal_date: weeksFromNow(30), // 30 weeks = 0.5 lbs/week
      });

      expect(result.valid).toBe(true);
      expect(result.weekly_rate).toBeCloseTo(0.5, 1);
    });

    it('should validate maximum safe rate of 1 lb/week', () => {
      const result = validateTimeline({
        goal: 'gain_weight',
        current_weight: 140,
        goal_weight: 155, // +15 lbs
        goal_date: weeksFromNow(15), // 15 weeks = 1 lb/week
      });

      expect(result.valid).toBe(true);
      expect(result.weekly_rate).toBeCloseTo(1.0, 1);
    });
  });

  describe('Weight Gain - Unsafe Rates', () => {
    it('should reject weight gain > 1 lb/week (unsafe)', () => {
      const result = validateTimeline({
        goal: 'gain_weight',
        current_weight: 150,
        goal_weight: 170, // +20 lbs
        goal_date: weeksFromNow(6), // 6 weeks = 3.3 lbs/week (too fast)
      });

      expect(result.valid).toBe(false);
      expect(result.error).toContain('Maximum safe rate is 1 lb/week');
      expect(result.weekly_rate).toBeCloseTo(3.3, 1);
    });

    it('should provide recommended safe date for unsafe weight gain', () => {
      const result = validateTimeline({
        goal: 'gain_weight',
        current_weight: 140,
        goal_weight: 160, // +20 lbs
        goal_date: weeksFromNow(5), // 5 weeks (too fast)
      });

      expect(result.valid).toBe(false);
      expect(result.recommended_weeks).toBe(20); // 20 lbs / 1 lb/week
    });
  });

  describe('Maintain Weight', () => {
    it('should always validate maintain goal (no timeline needed)', () => {
      const result = validateTimeline({
        goal: 'maintain',
        current_weight: 170,
        goal_weight: 170,
        goal_date: weeksFromNow(10), // Any date
      });

      expect(result.valid).toBe(true);
      expect(result.weekly_rate).toBe(0);
    });
  });

  describe('Edge Cases', () => {
    it('should reject timeline shorter than 4 weeks', () => {
      const result = validateTimeline({
        goal: 'lose_weight',
        current_weight: 160,
        goal_weight: 155, // -5 lbs (safe at 1.25 lbs/week)
        goal_date: weeksFromNow(2), // Only 2 weeks
      });

      expect(result.valid).toBe(false);
      expect(result.error).toContain('Minimum timeline is 4 weeks');
    });

    it('should reject timeline longer than 52 weeks (1 year)', () => {
      const result = validateTimeline({
        goal: 'lose_weight',
        current_weight: 200,
        goal_weight: 180,
        goal_date: weeksFromNow(60), // 60 weeks (> 52)
      });

      expect(result.valid).toBe(false);
      expect(result.error).toContain('Maximum timeline is 52 weeks');
    });

    it('should reject goal_weight higher than current_weight for weight loss', () => {
      const result = validateTimeline({
        goal: 'lose_weight',
        current_weight: 150,
        goal_weight: 160, // Higher than current (contradiction)
        goal_date: weeksFromNow(10),
      });

      expect(result.valid).toBe(false);
      expect(result.error).toContain('Goal weight must be lower than current weight');
    });

    it('should reject goal_weight lower than current_weight for weight gain', () => {
      const result = validateTimeline({
        goal: 'gain_weight',
        current_weight: 150,
        goal_weight: 140, // Lower than current (contradiction)
        goal_date: weeksFromNow(10),
      });

      expect(result.valid).toBe(false);
      expect(result.error).toContain('Goal weight must be higher than current weight');
    });

    it('should handle dates in the past', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      const result = validateTimeline({
        goal: 'lose_weight',
        current_weight: 180,
        goal_weight: 160,
        goal_date: yesterday, // Past date
      });

      expect(result.valid).toBe(false);
      expect(result.error).toContain('Goal date must be in the future');
    });
  });

  describe('Return Value Structure', () => {
    it('should return valid result with all required fields', () => {
      const result = validateTimeline({
        goal: 'lose_weight',
        current_weight: 200,
        goal_weight: 180,
        goal_date: weeksFromNow(15),
      });

      expect(result).toHaveProperty('valid');
      expect(result).toHaveProperty('weekly_rate');
      expect(result).toHaveProperty('weeks');

      if (result.valid) {
        expect(result.error).toBeUndefined();
      }
    });

    it('should return invalid result with error and recommendations', () => {
      const result = validateTimeline({
        goal: 'lose_weight',
        current_weight: 200,
        goal_weight: 150, // -50 lbs
        goal_date: weeksFromNow(5), // 5 weeks (too fast)
      });

      expect(result.valid).toBe(false);
      expect(result).toHaveProperty('error');
      expect(result).toHaveProperty('recommended_weeks');
      expect(result).toHaveProperty('recommended_date');
    });
  });
});
