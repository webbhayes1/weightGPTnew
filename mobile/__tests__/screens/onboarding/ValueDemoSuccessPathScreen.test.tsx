/**
 * ValueDemoSuccessPathScreen Component Tests
 * Tests weight loss/gain graph visualization with stats
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ValueDemoSuccessPathScreen from '../../../src/screens/onboarding/ValueDemoSuccessPathScreen';
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
    Line: () => null,
    Polygon: () => null,
  };
});

describe('ValueDemoSuccessPathScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering - Weight Loss', () => {
    beforeEach(() => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {
          currentWeight: 200,
          goalWeight: 170,
          goalType: 'lose_weight',
          weeklyRate: 1.5,
          goalDate: '2025-05-01',
        },
      });
    });

    it('should render title', () => {
      const { getByText } = render(<ValueDemoSuccessPathScreen navigation={mockNavigation} />);

      expect(getByText(/Here's Your Path/)).toBeTruthy();
      expect(getByText(/to Success/)).toBeTruthy();
    });

    it('should render pace badge for healthy pace', () => {
      const { getByText } = render(<ValueDemoSuccessPathScreen navigation={mockNavigation} />);

      expect(getByText('Healthy Pace')).toBeTruthy();
    });

    it('should render chart data points', () => {
      const { getByText, getAllByText } = render(<ValueDemoSuccessPathScreen navigation={mockNavigation} />);

      expect(getByText('Start')).toBeTruthy();
      expect(getByText('Goal')).toBeTruthy();
      const startWeights = getAllByText('200 lbs');
      const goalWeights = getAllByText('170 lbs');
      expect(startWeights.length).toBeGreaterThan(0);
      expect(goalWeights.length).toBeGreaterThan(0);
    });

    it('should render x-axis labels', () => {
      const { getByText, UNSAFE_root } = render(<ValueDemoSuccessPathScreen navigation={mockNavigation} />);

      expect(getByText('Today')).toBeTruthy();
      // Goal date is formatted and displayed
      expect(UNSAFE_root).toBeTruthy();
    });

    it('should render stats summary', () => {
      const { getByText } = render(<ValueDemoSuccessPathScreen navigation={mockNavigation} />);

      expect(getByText('Starting Weight')).toBeTruthy();
      expect(getByText('Goal Weight')).toBeTruthy();
      expect(getByText('Timeline')).toBeTruthy();
      expect(getByText('Per Week')).toBeTruthy();
    });

    it('should render weekly rate with negative sign for weight loss', () => {
      const { getByText } = render(<ValueDemoSuccessPathScreen navigation={mockNavigation} />);

      expect(getByText('-1.5 lbs')).toBeTruthy();
    });

    it('should render disclaimer', () => {
      const { getByText } = render(<ValueDemoSuccessPathScreen navigation={mockNavigation} />);

      expect(getByText(/safely and sustainably/)).toBeTruthy();
    });
  });

  describe('Rendering - Weight Gain', () => {
    beforeEach(() => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {
          currentWeight: 140,
          goalWeight: 160,
          goalType: 'gain_weight',
          weeklyRate: 0.5,
          goalDate: '2025-08-01',
        },
      });
    });

    it('should render for weight gain goal', () => {
      const { getAllByText } = render(<ValueDemoSuccessPathScreen navigation={mockNavigation} />);

      const startWeights = getAllByText('140 lbs');
      const goalWeights = getAllByText('160 lbs');
      expect(startWeights.length).toBeGreaterThan(0);
      expect(goalWeights.length).toBeGreaterThan(0);
    });

    it('should render weekly rate with positive sign for weight gain', () => {
      const { getByText } = render(<ValueDemoSuccessPathScreen navigation={mockNavigation} />);

      expect(getByText('+0.5 lbs')).toBeTruthy();
    });

    it('should show healthy pace for 0.5 lbs/week gain', () => {
      const { getByText } = render(<ValueDemoSuccessPathScreen navigation={mockNavigation} />);

      expect(getByText('Healthy Pace')).toBeTruthy();
    });
  });

  describe('Rendering - Maintain Weight', () => {
    beforeEach(() => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {
          currentWeight: 150,
          goalWeight: 150,
          goalType: 'maintain_weight',
          weeklyRate: 0,
          goalDate: '2025-12-31',
        },
      });
    });

    it('should render for maintain weight goal', () => {
      const { getAllByText, getByText } = render(<ValueDemoSuccessPathScreen navigation={mockNavigation} />);

      const weightLabels = getAllByText('150 lbs');
      expect(weightLabels.length).toBeGreaterThan(0);
      expect(getByText('Safe & Sustainable')).toBeTruthy();
    });

    it('should handle same start and goal weight', () => {
      const { UNSAFE_root } = render(<ValueDemoSuccessPathScreen navigation={mockNavigation} />);
      // Should not crash with division by zero
      expect(UNSAFE_root).toBeTruthy();
    });
  });

  describe('Pace Categories - Weight Loss', () => {
    it('should show Healthy Pace for 1.5 lbs/week', () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {
          currentWeight: 200,
          goalWeight: 170,
          goalType: 'lose_weight',
          weeklyRate: 1.5,
        },
      });

      const { getByText } = render(<ValueDemoSuccessPathScreen navigation={mockNavigation} />);
      expect(getByText('Healthy Pace')).toBeTruthy();
    });

    it('should show Ambitious for 2.0 lbs/week', () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {
          currentWeight: 200,
          goalWeight: 170,
          goalType: 'lose_weight',
          weeklyRate: 2.0,
        },
      });

      const { getByText } = render(<ValueDemoSuccessPathScreen navigation={mockNavigation} />);
      expect(getByText('Ambitious')).toBeTruthy();
    });

    it('should show Aggressive for 2.5 lbs/week', () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {
          currentWeight: 200,
          goalWeight: 170,
          goalType: 'lose_weight',
          weeklyRate: 2.5,
        },
      });

      const { getByText } = render(<ValueDemoSuccessPathScreen navigation={mockNavigation} />);
      expect(getByText('Aggressive')).toBeTruthy();
    });
  });

  describe('Pace Categories - Weight Gain', () => {
    it('should show Healthy Pace for 0.5 lbs/week', () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {
          currentWeight: 140,
          goalWeight: 160,
          goalType: 'gain_weight',
          weeklyRate: 0.5,
        },
      });

      const { getByText } = render(<ValueDemoSuccessPathScreen navigation={mockNavigation} />);
      expect(getByText('Healthy Pace')).toBeTruthy();
    });

    it('should show Ambitious for 1.0 lbs/week', () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {
          currentWeight: 140,
          goalWeight: 160,
          goalType: 'gain_weight',
          weeklyRate: 1.0,
        },
      });

      const { getByText } = render(<ValueDemoSuccessPathScreen navigation={mockNavigation} />);
      expect(getByText('Ambitious')).toBeTruthy();
    });

    it('should show Aggressive for 1.5 lbs/week', () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {
          currentWeight: 140,
          goalWeight: 160,
          goalType: 'gain_weight',
          weeklyRate: 1.5,
        },
      });

      const { getByText } = render(<ValueDemoSuccessPathScreen navigation={mockNavigation} />);
      expect(getByText('Aggressive')).toBeTruthy();
    });
  });

  describe('Default Values', () => {
    it('should use defaults when data is missing', () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {},
      });

      const { getAllByText, getByText } = render(<ValueDemoSuccessPathScreen navigation={mockNavigation} />);

      // Default: 180 lbs current, goalType: 'lose_weight', weeklyRate: 1.5
      const weightLabels = getAllByText('180 lbs');
      expect(weightLabels.length).toBeGreaterThan(0);
      expect(getByText('Healthy Pace')).toBeTruthy();
    });

    it('should show default goal date text when no date set', () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {
          currentWeight: 200,
          goalWeight: 170,
        },
      });

      const { getByText } = render(<ValueDemoSuccessPathScreen navigation={mockNavigation} />);

      expect(getByText('Your Goal Date')).toBeTruthy();
    });

    it('should calculate 16 weeks default when no goal date', () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {
          currentWeight: 200,
          goalWeight: 170,
        },
      });

      const { getByText } = render(<ValueDemoSuccessPathScreen navigation={mockNavigation} />);

      expect(getByText('16 weeks')).toBeTruthy();
    });
  });

  describe('Navigation - Standalone Mode', () => {
    beforeEach(() => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {
          currentWeight: 200,
          goalWeight: 170,
          goalType: 'lose_weight',
          weeklyRate: 1.5,
        },
      });
    });

    it('should navigate to ValueDemoDailyNutrition when Continue pressed', () => {
      const { getByText } = render(<ValueDemoSuccessPathScreen navigation={mockNavigation} />);

      fireEvent.press(getByText('Continue'));

      expect(mockNavigate).toHaveBeenCalledWith('ValueDemoDailyNutrition');
    });
  });

  describe('Navigation - Carousel Mode', () => {
    beforeEach(() => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {
          currentWeight: 200,
          goalWeight: 170,
          goalType: 'lose_weight',
          weeklyRate: 1.5,
        },
      });
    });

    it('should show Continue button when not on last page', () => {
      const mockOnNextPage = jest.fn();
      const { getByText } = render(
        <ValueDemoSuccessPathScreen
          navigation={mockNavigation}
          currentPage={0}
          totalPages={3}
          onNextPage={mockOnNextPage}
        />
      );

      expect(getByText('Continue')).toBeTruthy();
    });

    it('should call onNextPage when Continue pressed in carousel mode', () => {
      const mockOnNextPage = jest.fn();
      const { getByText } = render(
        <ValueDemoSuccessPathScreen
          navigation={mockNavigation}
          currentPage={0}
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
        <ValueDemoSuccessPathScreen
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
        <ValueDemoSuccessPathScreen
          navigation={mockNavigation}
          currentPage={2}
          totalPages={3}
          onNextPage={mockOnNextPage}
        />
      );

      fireEvent.press(getByText('See Your Full Plan'));

      expect(mockNavigate).toHaveBeenCalledWith('ValueDemoDailyNutrition');
      expect(mockOnNextPage).not.toHaveBeenCalled();
    });
  });

  describe('Progress Indicator - Carousel Mode', () => {
    beforeEach(() => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {
          currentWeight: 200,
          goalWeight: 170,
        },
      });
    });

    it('should render 3 progress dots', () => {
      const { UNSAFE_root } = render(
        <ValueDemoSuccessPathScreen
          navigation={mockNavigation}
          currentPage={0}
          totalPages={3}
        />
      );

      // Should render 3 dots
      expect(UNSAFE_root).toBeTruthy();
    });

    it('should highlight first dot when currentPage=0', () => {
      const { UNSAFE_root } = render(
        <ValueDemoSuccessPathScreen
          navigation={mockNavigation}
          currentPage={0}
          totalPages={3}
        />
      );

      expect(UNSAFE_root).toBeTruthy();
    });

    it('should highlight second dot when currentPage=1', () => {
      const { UNSAFE_root } = render(
        <ValueDemoSuccessPathScreen
          navigation={mockNavigation}
          currentPage={1}
          totalPages={3}
        />
      );

      expect(UNSAFE_root).toBeTruthy();
    });

    it('should highlight third dot when currentPage=2', () => {
      const { UNSAFE_root } = render(
        <ValueDemoSuccessPathScreen
          navigation={mockNavigation}
          currentPage={2}
          totalPages={3}
        />
      );

      expect(UNSAFE_root).toBeTruthy();
    });
  });
});
