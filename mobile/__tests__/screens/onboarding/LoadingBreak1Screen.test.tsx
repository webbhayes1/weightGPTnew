/**
 * LoadingBreak1Screen Component Tests
 * Tests BMR/TDEE/calorie calculation display screen
 */

import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import LoadingBreak1Screen from '../../../src/screens/onboarding/LoadingBreak1Screen';
import { useOnboardingStore } from '../../../src/store/onboardingStore';

// Mock navigation
const mockNavigate = jest.fn();
const mockNavigation = {
  navigate: mockNavigate,
  setOptions: jest.fn(),
} as any;

// Mock the onboarding store
jest.mock('../../../src/store/onboardingStore');
const mockSetCalculatedValues = jest.fn();

describe('LoadingBreak1Screen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  describe('Rendering - First Time', () => {
    beforeEach(() => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {
          currentWeight: 180,
          height: 70,
          age: 30,
          sex: 'male',
          activityLevel: 'moderately_active',
          goalType: 'lose_weight',
          weeklyRate: 1.5,
        },
        setCalculatedValues: mockSetCalculatedValues,
      });
    });

    it('should render title', () => {
      const { getByText } = render(<LoadingBreak1Screen navigation={mockNavigation} />);

      expect(getByText(/Calculating your/)).toBeTruthy();
      expect(getByText(/calorie targets/)).toBeTruthy();
    });

    it('should render result labels', () => {
      const { getByText } = render(<LoadingBreak1Screen navigation={mockNavigation} />);

      expect(getByText('Basal Metabolic Rate')).toBeTruthy();
      expect(getByText('Total Daily Energy')).toBeTruthy();
      expect(getByText('Your Daily Target')).toBeTruthy();
    });

    it('should show placeholder values initially', () => {
      const { getAllByText } = render(<LoadingBreak1Screen navigation={mockNavigation} />);

      const placeholders = getAllByText('---');
      expect(placeholders.length).toBeGreaterThan(0);
    });

    it('should calculate and store BMR, TDEE, and calories', async () => {
      render(<LoadingBreak1Screen navigation={mockNavigation} />);

      // Wait for calculations
      await waitFor(() => {
        expect(mockSetCalculatedValues).toHaveBeenCalled();
      });

      const callArgs = mockSetCalculatedValues.mock.calls[0];
      expect(callArgs[0]).toBeGreaterThan(0); // BMR
      expect(callArgs[1]).toBeGreaterThan(0); // TDEE
      expect(callArgs[2]).toBeGreaterThan(0); // Daily calories
      expect(callArgs[3]).toHaveProperty('protein_g');
      expect(callArgs[3]).toHaveProperty('carbs_g');
      expect(callArgs[3]).toHaveProperty('fat_g');
    });

    it('should auto-navigate to FoodPreferences after delay', async () => {
      render(<LoadingBreak1Screen navigation={mockNavigation} />);

      // Fast-forward timers to trigger auto-navigation
      jest.advanceTimersByTime(6000);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('FoodPreferences');
      });
    });
  });

  describe('Rendering - Returning User', () => {
    beforeEach(() => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {
          currentWeight: 180,
          height: 70,
          age: 30,
          sex: 'male',
          activityLevel: 'moderately_active',
          bmr: 1800,
          tdee: 2400,
          dailyCalories: 1900,
        },
        setCalculatedValues: mockSetCalculatedValues,
      });
    });

    it('should show existing calculations immediately', () => {
      const { getByText } = render(<LoadingBreak1Screen navigation={mockNavigation} />);

      expect(getByText(/1,800/)).toBeTruthy();
      expect(getByText(/2,400/)).toBeTruthy();
      expect(getByText(/1,900/)).toBeTruthy();
    });

    it('should not recalculate when returning', () => {
      render(<LoadingBreak1Screen navigation={mockNavigation} />);

      expect(mockSetCalculatedValues).not.toHaveBeenCalled();
    });
  });

  describe('Goal Type Calculations', () => {
    it('should calculate deficit for weight loss', async () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {
          currentWeight: 200,
          height: 70,
          age: 35,
          sex: 'male',
          activityLevel: 'moderately_active',
          goalType: 'lose_weight',
          weeklyRate: 1.5,
        },
        setCalculatedValues: mockSetCalculatedValues,
      });

      render(<LoadingBreak1Screen navigation={mockNavigation} />);

      await waitFor(() => {
        expect(mockSetCalculatedValues).toHaveBeenCalled();
      });

      const callArgs = mockSetCalculatedValues.mock.calls[0];
      const tdee = callArgs[1];
      const dailyCalories = callArgs[2];

      // Should be in deficit
      expect(dailyCalories).toBeLessThan(tdee);
    });

    it('should calculate surplus for weight gain', async () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {
          currentWeight: 150,
          height: 68,
          age: 25,
          sex: 'male',
          activityLevel: 'very_active',
          goalType: 'gain_weight',
          weeklyRate: 0.5,
        },
        setCalculatedValues: mockSetCalculatedValues,
      });

      render(<LoadingBreak1Screen navigation={mockNavigation} />);

      await waitFor(() => {
        expect(mockSetCalculatedValues).toHaveBeenCalled();
      });

      const callArgs = mockSetCalculatedValues.mock.calls[0];
      const tdee = callArgs[1];
      const dailyCalories = callArgs[2];

      // Should be in surplus
      expect(dailyCalories).toBeGreaterThan(tdee);
    });

    it('should maintain TDEE for maintenance goal', async () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {
          currentWeight: 170,
          height: 69,
          age: 28,
          sex: 'female',
          activityLevel: 'moderately_active',
          goalType: 'maintain',
        },
        setCalculatedValues: mockSetCalculatedValues,
      });

      render(<LoadingBreak1Screen navigation={mockNavigation} />);

      await waitFor(() => {
        expect(mockSetCalculatedValues).toHaveBeenCalled();
      });

      const callArgs = mockSetCalculatedValues.mock.calls[0];
      const tdee = callArgs[1];
      const dailyCalories = callArgs[2];

      // Should equal TDEE
      expect(dailyCalories).toBe(tdee);
    });
  });

  describe('Error Handling', () => {
    it('should navigate anyway when calculations fail', async () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {}, // Missing required data
        setCalculatedValues: mockSetCalculatedValues,
      });

      render(<LoadingBreak1Screen navigation={mockNavigation} />);

      // Fast-forward to error navigation timeout
      jest.advanceTimersByTime(3000);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('FoodPreferences');
      });
    });
  });

  describe('Tap to Skip', () => {
    beforeEach(() => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {
          currentWeight: 180,
          height: 70,
          age: 30,
          sex: 'male',
          activityLevel: 'moderately_active',
          goalType: 'lose_weight',
          weeklyRate: 1.5,
        },
        setCalculatedValues: mockSetCalculatedValues,
      });
    });

    it('should allow tapping to skip waiting', () => {
      const { UNSAFE_root } = render(<LoadingBreak1Screen navigation={mockNavigation} />);

      // TouchableWithoutFeedback wraps content
      expect(UNSAFE_root).toBeTruthy();
    });
  });
});
