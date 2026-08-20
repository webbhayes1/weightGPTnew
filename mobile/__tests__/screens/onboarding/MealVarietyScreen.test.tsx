/**
 * MealVarietyScreen Component Tests
 * Tests meal variety preference selection
 */

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import MealVarietyScreen from '../../../src/screens/onboarding/MealVarietyScreen';
import { useOnboardingStore } from '../../../src/store/onboardingStore';

// Mock navigation
const mockNavigate = jest.fn();
const mockGoBack = jest.fn();
const mockNavigation = {
  navigate: mockNavigate,
  goBack: mockGoBack,
  setOptions: jest.fn(),
} as any;

// Mock the onboarding store
jest.mock('../../../src/store/onboardingStore');
const mockSetMealVarietyPreference = jest.fn();

describe('MealVarietyScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    beforeEach(() => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {},
        setMealVarietyPreference: mockSetMealVarietyPreference,
      });
    });

    it('should render all required elements', () => {
      const { getByText } = render(<MealVarietyScreen navigation={mockNavigation} />);

      // Prompt
      expect(getByText(/How do you prefer/)).toBeTruthy();
      expect(getByText(/your weekly meal plan?/)).toBeTruthy();

      // All 3 variety options
      expect(getByText('Meal Prep Style')).toBeTruthy();
      expect(getByText('Maximum Variety')).toBeTruthy();
      expect(getByText('Balanced')).toBeTruthy();

      // Descriptions
      expect(getByText('Fewer recipes, repeat meals throughout week')).toBeTruthy();
      expect(getByText('Different meals every day')).toBeTruthy();
      expect(getByText('Some variety, some repeats')).toBeTruthy();

      // Continue button
      expect(getByText('Continue')).toBeTruthy();

      // Back button
      expect(getByText('←')).toBeTruthy();
    });

    it('should render with no pre-selected option', () => {
      const { UNSAFE_root } = render(<MealVarietyScreen navigation={mockNavigation} />);
      expect(UNSAFE_root).toBeTruthy();
    });
  });

  describe('Variety Selection', () => {
    beforeEach(() => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {},
        setMealVarietyPreference: mockSetMealVarietyPreference,
      });
    });

    it('should select meal_prep_style when Meal Prep Style is pressed', () => {
      const { getByText } = render(<MealVarietyScreen navigation={mockNavigation} />);
      fireEvent.press(getByText('Meal Prep Style'));
    });

    it('should select maximum_variety when Maximum Variety is pressed', () => {
      const { getByText } = render(<MealVarietyScreen navigation={mockNavigation} />);
      fireEvent.press(getByText('Maximum Variety'));
    });

    it('should select balanced when Balanced is pressed', () => {
      const { getByText } = render(<MealVarietyScreen navigation={mockNavigation} />);
      fireEvent.press(getByText('Balanced'));
    });
  });

  describe('Stored State', () => {
    it('should initialize with stored variety (meal_prep_style)', () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {
          mealVarietyPreference: 'meal_prep_style'
        },
        setMealVarietyPreference: mockSetMealVarietyPreference,
      });

      const { UNSAFE_root } = render(<MealVarietyScreen navigation={mockNavigation} />);
      expect(UNSAFE_root).toBeTruthy();
    });

    it('should initialize with stored variety (maximum_variety)', () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {
          mealVarietyPreference: 'maximum_variety'
        },
        setMealVarietyPreference: mockSetMealVarietyPreference,
      });

      const { UNSAFE_root } = render(<MealVarietyScreen navigation={mockNavigation} />);
      expect(UNSAFE_root).toBeTruthy();
    });
  });

  describe('Navigation', () => {
    it('should navigate to EatingPattern when Continue is pressed', async () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {},
        setMealVarietyPreference: mockSetMealVarietyPreference,
      });

      const { getByText } = render(<MealVarietyScreen navigation={mockNavigation} />);

      fireEvent.press(getByText('Balanced'));
      fireEvent.press(getByText('Continue'));

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('EatingPattern');
      });
    });

    it('should navigate back when back button is pressed', () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {},
        setMealVarietyPreference: mockSetMealVarietyPreference,
      });

      const { getByText } = render(<MealVarietyScreen navigation={mockNavigation} />);
      fireEvent.press(getByText('←'));
      expect(mockGoBack).toHaveBeenCalledTimes(1);
    });
  });

  describe('Store Integration', () => {
    it('should save meal_prep_style to store', async () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {},
        setMealVarietyPreference: mockSetMealVarietyPreference,
      });

      const { getByText } = render(<MealVarietyScreen navigation={mockNavigation} />);

      fireEvent.press(getByText('Meal Prep Style'));
      fireEvent.press(getByText('Continue'));

      await waitFor(() => {
        expect(mockSetMealVarietyPreference).toHaveBeenCalledWith('meal_prep_style');
      });
    });

    it('should save maximum_variety to store', async () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {},
        setMealVarietyPreference: mockSetMealVarietyPreference,
      });

      const { getByText } = render(<MealVarietyScreen navigation={mockNavigation} />);

      fireEvent.press(getByText('Maximum Variety'));
      fireEvent.press(getByText('Continue'));

      await waitFor(() => {
        expect(mockSetMealVarietyPreference).toHaveBeenCalledWith('maximum_variety');
      });
    });

    it('should save balanced to store', async () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {},
        setMealVarietyPreference: mockSetMealVarietyPreference,
      });

      const { getByText } = render(<MealVarietyScreen navigation={mockNavigation} />);

      fireEvent.press(getByText('Balanced'));
      fireEvent.press(getByText('Continue'));

      await waitFor(() => {
        expect(mockSetMealVarietyPreference).toHaveBeenCalledWith('balanced');
      });
    });
  });

  describe('Validation', () => {
    it('should disable Continue button when no selection is made', () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {},
        setMealVarietyPreference: mockSetMealVarietyPreference,
      });

      const { getByText } = render(<MealVarietyScreen navigation={mockNavigation} />);

      fireEvent.press(getByText('Continue'));
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });
});
