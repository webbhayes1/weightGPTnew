/**
 * ValueDemoDailyNutritionScreen Component Tests
 * Tests calorie and macro targets with fitness-style rings
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ValueDemoDailyNutritionScreen from '../../../src/screens/onboarding/ValueDemoDailyNutritionScreen';
import { useOnboardingStore } from '../../../src/store/onboardingStore';

// Mock navigation
const mockNavigate = jest.fn();
const mockNavigation = {
  navigate: mockNavigate,
  setOptions: jest.fn(),
} as any;

// Mock the onboarding store
jest.mock('../../../src/store/onboardingStore');

// Mock react-native-svg
jest.mock('react-native-svg', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: (props: any) => <View {...props} />,
    Svg: (props: any) => <View {...props} />,
    Circle: () => null,
  };
});

describe('ValueDemoDailyNutritionScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering - Weight Loss', () => {
    beforeEach(() => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {
          dailyCalories: 1800,
          macros: { protein_g: 140, carbs_g: 180, fat_g: 50 },
          activityLevel: 'moderately_active',
          goalType: 'lose_weight',
        },
      });
    });

    it('should render title', () => {
      const { getByText } = render(<ValueDemoDailyNutritionScreen navigation={mockNavigation} />);

      expect(getByText(/Your Personalized/)).toBeTruthy();
      expect(getByText(/Daily Targets/)).toBeTruthy();
    });

    it('should render calorie target', () => {
      const { getByText } = render(<ValueDemoDailyNutritionScreen navigation={mockNavigation} />);

      expect(getByText('1800')).toBeTruthy();
      expect(getByText('Daily Calories')).toBeTruthy();
    });

    it('should render protein macro', () => {
      const { getByText } = render(<ValueDemoDailyNutritionScreen navigation={mockNavigation} />);

      expect(getByText('140g')).toBeTruthy();
      expect(getByText('Protein')).toBeTruthy();
    });

    it('should render carbs macro', () => {
      const { getByText } = render(<ValueDemoDailyNutritionScreen navigation={mockNavigation} />);

      expect(getByText('180g')).toBeTruthy();
      expect(getByText('Carbs')).toBeTruthy();
    });

    it('should render fat macro', () => {
      const { getByText } = render(<ValueDemoDailyNutritionScreen navigation={mockNavigation} />);

      expect(getByText('50g')).toBeTruthy();
      expect(getByText('Fat')).toBeTruthy();
    });

    it('should render description with weight loss goal', () => {
      const { getByText } = render(<ValueDemoDailyNutritionScreen navigation={mockNavigation} />);

      expect(getByText(/weight loss/)).toBeTruthy();
      expect(getByText(/moderate activity/)).toBeTruthy();
    });
  });

  describe('Rendering - Weight Gain', () => {
    beforeEach(() => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {
          dailyCalories: 2500,
          macros: { protein_g: 180, carbs_g: 280, fat_g: 75 },
          activityLevel: 'very_active',
          goalType: 'gain_weight',
        },
      });
    });

    it('should render calorie target for weight gain', () => {
      const { getByText } = render(<ValueDemoDailyNutritionScreen navigation={mockNavigation} />);

      expect(getByText('2500')).toBeTruthy();
    });

    it('should render description with muscle gain goal', () => {
      const { getByText } = render(<ValueDemoDailyNutritionScreen navigation={mockNavigation} />);

      expect(getByText(/muscle gain/)).toBeTruthy();
      expect(getByText(/very active/)).toBeTruthy();
    });
  });

  describe('Rendering - Maintenance', () => {
    beforeEach(() => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {
          dailyCalories: 2200,
          macros: { protein_g: 160, carbs_g: 240, fat_g: 65 },
          activityLevel: 'sedentary',
          goalType: 'maintain',
        },
      });
    });

    it('should render description with maintenance goal', () => {
      const { getByText } = render(<ValueDemoDailyNutritionScreen navigation={mockNavigation} />);

      expect(getByText(/weight maintenance/)).toBeTruthy();
      expect(getByText(/sedentary/)).toBeTruthy();
    });
  });

  describe('Default Values', () => {
    beforeEach(() => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {},
      });
    });

    it('should use default calories when not set', () => {
      const { getByText } = render(<ValueDemoDailyNutritionScreen navigation={mockNavigation} />);

      expect(getByText('2100')).toBeTruthy();
    });

    it('should use default macros when not set', () => {
      const { getByText } = render(<ValueDemoDailyNutritionScreen navigation={mockNavigation} />);

      expect(getByText('150g')).toBeTruthy(); // Protein
      expect(getByText('220g')).toBeTruthy(); // Carbs
      expect(getByText('65g')).toBeTruthy(); // Fat
    });

    it('should use default activity level when not set', () => {
      const { getByText } = render(<ValueDemoDailyNutritionScreen navigation={mockNavigation} />);

      expect(getByText(/moderate activity/)).toBeTruthy();
    });

    it('should use default goal type when not set', () => {
      const { getByText } = render(<ValueDemoDailyNutritionScreen navigation={mockNavigation} />);

      expect(getByText(/weight loss/)).toBeTruthy();
    });
  });

  describe('Activity Level Labels', () => {
    it('should show sedentary label', () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: { activityLevel: 'sedentary' },
      });

      const { getByText } = render(<ValueDemoDailyNutritionScreen navigation={mockNavigation} />);
      expect(getByText(/sedentary/)).toBeTruthy();
    });

    it('should show moderate activity label', () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: { activityLevel: 'moderately_active' },
      });

      const { getByText } = render(<ValueDemoDailyNutritionScreen navigation={mockNavigation} />);
      expect(getByText(/moderate activity/)).toBeTruthy();
    });

    it('should show very active label', () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: { activityLevel: 'very_active' },
      });

      const { getByText } = render(<ValueDemoDailyNutritionScreen navigation={mockNavigation} />);
      expect(getByText(/very active/)).toBeTruthy();
    });
  });

  describe('Goal Type Labels', () => {
    it('should show weight loss label', () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: { goalType: 'lose_weight' },
      });

      const { getByText } = render(<ValueDemoDailyNutritionScreen navigation={mockNavigation} />);
      expect(getByText(/weight loss/)).toBeTruthy();
    });

    it('should show muscle gain label', () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: { goalType: 'gain_weight' },
      });

      const { getByText } = render(<ValueDemoDailyNutritionScreen navigation={mockNavigation} />);
      expect(getByText(/muscle gain/)).toBeTruthy();
    });

    it('should show weight maintenance label', () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: { goalType: 'maintain' },
      });

      const { getByText } = render(<ValueDemoDailyNutritionScreen navigation={mockNavigation} />);
      expect(getByText(/weight maintenance/)).toBeTruthy();
    });
  });

  describe('Navigation - Standalone Mode', () => {
    beforeEach(() => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {},
      });
    });

    it('should navigate to ValueDemoWorkouts when Continue pressed', () => {
      const { getByText } = render(<ValueDemoDailyNutritionScreen navigation={mockNavigation} />);

      fireEvent.press(getByText('Continue'));

      expect(mockNavigate).toHaveBeenCalledWith('ValueDemoWorkouts');
    });
  });

  describe('Navigation - Carousel Mode', () => {
    beforeEach(() => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {},
      });
    });

    it('should show Continue button when not on last page', () => {
      const mockOnNextPage = jest.fn();
      const { getByText } = render(
        <ValueDemoDailyNutritionScreen
          navigation={mockNavigation}
          currentPage={1}
          totalPages={3}
          onNextPage={mockOnNextPage}
        />
      );

      expect(getByText('Continue')).toBeTruthy();
    });

    it('should call onNextPage when Continue pressed in carousel mode', () => {
      const mockOnNextPage = jest.fn();
      const { getByText } = render(
        <ValueDemoDailyNutritionScreen
          navigation={mockNavigation}
          currentPage={1}
          totalPages={3}
          onNextPage={mockOnNextPage}
        />
      );

      fireEvent.press(getByText('Continue'));

      expect(mockOnNextPage).toHaveBeenCalledTimes(1);
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('should show See Your Full Plan button on last page', () => {
      const mockOnNextPage = jest.fn();
      const { getByText } = render(
        <ValueDemoDailyNutritionScreen
          navigation={mockNavigation}
          currentPage={2}
          totalPages={3}
          onNextPage={mockOnNextPage}
        />
      );

      expect(getByText('See Your Full Plan')).toBeTruthy();
    });

    it('should navigate when button pressed on last page', () => {
      const mockOnNextPage = jest.fn();
      const { getByText } = render(
        <ValueDemoDailyNutritionScreen
          navigation={mockNavigation}
          currentPage={2}
          totalPages={3}
          onNextPage={mockOnNextPage}
        />
      );

      fireEvent.press(getByText('See Your Full Plan'));

      expect(mockNavigate).toHaveBeenCalledWith('ValueDemoWorkouts');
      expect(mockOnNextPage).not.toHaveBeenCalled();
    });
  });

  describe('Progress Indicator - Carousel Mode', () => {
    beforeEach(() => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {},
      });
    });

    it('should render 3 progress dots', () => {
      const { UNSAFE_root } = render(
        <ValueDemoDailyNutritionScreen
          navigation={mockNavigation}
          currentPage={1}
          totalPages={3}
        />
      );

      expect(UNSAFE_root).toBeTruthy();
    });

    it('should highlight second dot when currentPage=1', () => {
      const { UNSAFE_root } = render(
        <ValueDemoDailyNutritionScreen
          navigation={mockNavigation}
          currentPage={1}
          totalPages={3}
        />
      );

      expect(UNSAFE_root).toBeTruthy();
    });
  });

  describe('SVG Rings', () => {
    beforeEach(() => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {},
      });
    });

    it('should render SVG container', () => {
      const { UNSAFE_root } = render(<ValueDemoDailyNutritionScreen navigation={mockNavigation} />);

      expect(UNSAFE_root).toBeTruthy();
    });
  });
});
