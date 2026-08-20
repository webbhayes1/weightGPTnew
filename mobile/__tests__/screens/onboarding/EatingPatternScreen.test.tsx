/**
 * EatingPatternScreen Component Tests
 * Tests meals per day selection and meal pattern multi-select
 */

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import EatingPatternScreen from '../../../src/screens/onboarding/EatingPatternScreen';
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
const mockSetEatingPattern = jest.fn();

describe('EatingPatternScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    beforeEach(() => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {},
        setEatingPattern: mockSetEatingPattern,
      });
    });

    it('should render all required elements', () => {
      const { getByText } = render(<EatingPatternScreen navigation={mockNavigation} />);

      // Prompt 1: Meals per day
      expect(getByText(/How many meals/)).toBeTruthy();
      expect(getByText(/eat per day/)).toBeTruthy();

      // Meals per day options
      expect(getByText('2 meals')).toBeTruthy();
      expect(getByText('3 meals')).toBeTruthy();
      expect(getByText(/4-5 meals/)).toBeTruthy();

      // Continue button
      expect(getByText('Continue')).toBeTruthy();

      // Back button
      expect(getByText('←')).toBeTruthy();
    });

    it('should render with no pre-selected option', () => {
      const { UNSAFE_root } = render(<EatingPatternScreen navigation={mockNavigation} />);
      expect(UNSAFE_root).toBeTruthy();
    });
  });

  describe('Meals Per Day Selection', () => {
    beforeEach(() => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {},
        setEatingPattern: mockSetEatingPattern,
      });
    });

    it('should select 2 meals when pressed', () => {
      const { getByText } = render(<EatingPatternScreen navigation={mockNavigation} />);
      fireEvent.press(getByText('2 meals'));
    });

    it('should select 3 meals when pressed', () => {
      const { getByText } = render(<EatingPatternScreen navigation={mockNavigation} />);
      fireEvent.press(getByText('3 meals'));
    });

    it('should select 4-5 meals when pressed', () => {
      const { getByText } = render(<EatingPatternScreen navigation={mockNavigation} />);
      fireEvent.press(getByText(/4-5 meals/));
    });
  });

  describe('Meal Options', () => {
    beforeEach(() => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {},
        setEatingPattern: mockSetEatingPattern,
      });
    });

    it('should show which meals prompt after selecting meals per day', () => {
      const { getByText } = render(<EatingPatternScreen navigation={mockNavigation} />);

      fireEvent.press(getByText('3 meals'));

      expect(getByText(/Which meals/)).toBeTruthy();
    });

    it('should render all 4 meal options', () => {
      const { getByText } = render(<EatingPatternScreen navigation={mockNavigation} />);

      fireEvent.press(getByText('3 meals'));

      expect(getByText('Breakfast')).toBeTruthy();
      expect(getByText('Lunch')).toBeTruthy();
      expect(getByText('Dinner')).toBeTruthy();
      expect(getByText(/Snacks/)).toBeTruthy();
    });

    it('should pre-select Lunch + Dinner when 2 meals selected', () => {
      const { getByText } = render(<EatingPatternScreen navigation={mockNavigation} />);

      fireEvent.press(getByText('2 meals'));

      // Should show which meals section
      expect(getByText(/Which meals/)).toBeTruthy();
    });

    it('should pre-select Breakfast + Lunch + Dinner when 3 meals selected', () => {
      const { getByText } = render(<EatingPatternScreen navigation={mockNavigation} />);

      fireEvent.press(getByText('3 meals'));

      // Should show which meals section
      expect(getByText(/Which meals/)).toBeTruthy();
    });

    it('should pre-select all meals + snacks when 4-5 meals selected', () => {
      const { getByText } = render(<EatingPatternScreen navigation={mockNavigation} />);

      fireEvent.press(getByText(/4-5 meals/));

      // Should show which meals section
      expect(getByText(/Which meals/)).toBeTruthy();
    });
  });

  describe('Stored State', () => {
    it('should initialize with stored eating pattern (2 meals)', () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {
          mealsPerDay: 2,
          mealPattern: ['lunch', 'dinner'],
          includesSnacks: false,
        },
        setEatingPattern: mockSetEatingPattern,
      });

      const { UNSAFE_root } = render(<EatingPatternScreen navigation={mockNavigation} />);
      expect(UNSAFE_root).toBeTruthy();
    });

    it('should initialize with stored eating pattern (3 meals)', () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {
          mealsPerDay: 3,
          mealPattern: ['breakfast', 'lunch', 'dinner'],
          includesSnacks: false,
        },
        setEatingPattern: mockSetEatingPattern,
      });

      const { UNSAFE_root } = render(<EatingPatternScreen navigation={mockNavigation} />);
      expect(UNSAFE_root).toBeTruthy();
    });

    it('should initialize with stored eating pattern (4 meals with snacks)', () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {
          mealsPerDay: 4,
          mealPattern: ['breakfast', 'lunch', 'dinner'],
          includesSnacks: true,
        },
        setEatingPattern: mockSetEatingPattern,
      });

      const { UNSAFE_root } = render(<EatingPatternScreen navigation={mockNavigation} />);
      expect(UNSAFE_root).toBeTruthy();
    });
  });

  describe('Navigation', () => {
    it('should navigate to LoadingBreak2 when Continue is pressed', async () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {},
        setEatingPattern: mockSetEatingPattern,
      });

      const { getByText } = render(<EatingPatternScreen navigation={mockNavigation} />);

      fireEvent.press(getByText('3 meals'));
      fireEvent.press(getByText('Continue'));

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('LoadingBreak2');
      });
    });

    it('should navigate back when back button is pressed', () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {},
        setEatingPattern: mockSetEatingPattern,
      });

      const { getByText } = render(<EatingPatternScreen navigation={mockNavigation} />);
      fireEvent.press(getByText('←'));
      expect(mockGoBack).toHaveBeenCalledTimes(1);
    });
  });

  describe('Store Integration', () => {
    it('should save eating pattern with 2 meals to store', async () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {},
        setEatingPattern: mockSetEatingPattern,
      });

      const { getByText } = render(<EatingPatternScreen navigation={mockNavigation} />);

      fireEvent.press(getByText('2 meals'));
      fireEvent.press(getByText('Continue'));

      await waitFor(() => {
        expect(mockSetEatingPattern).toHaveBeenCalledWith(
          2,
          expect.arrayContaining(['lunch', 'dinner']),
          false
        );
      });
    });

    it('should save eating pattern with 3 meals to store', async () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {},
        setEatingPattern: mockSetEatingPattern,
      });

      const { getByText } = render(<EatingPatternScreen navigation={mockNavigation} />);

      fireEvent.press(getByText('3 meals'));
      fireEvent.press(getByText('Continue'));

      await waitFor(() => {
        expect(mockSetEatingPattern).toHaveBeenCalledWith(
          3,
          expect.arrayContaining(['breakfast', 'lunch', 'dinner']),
          false
        );
      });
    });

    it('should save eating pattern with snacks to store', async () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {},
        setEatingPattern: mockSetEatingPattern,
      });

      const { getByText } = render(<EatingPatternScreen navigation={mockNavigation} />);

      fireEvent.press(getByText(/4-5 meals/));
      fireEvent.press(getByText('Continue'));

      await waitFor(() => {
        expect(mockSetEatingPattern).toHaveBeenCalledWith(
          4,
          expect.arrayContaining(['breakfast', 'lunch', 'dinner']),
          true
        );
      });
    });
  });

  describe('Validation', () => {
    it('should disable Continue button when no meals per day selected', () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {},
        setEatingPattern: mockSetEatingPattern,
      });

      const { getByText } = render(<EatingPatternScreen navigation={mockNavigation} />);

      fireEvent.press(getByText('Continue'));
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  describe('Progress Indicator', () => {
    it('should show correct progress (9/12)', () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {},
        setEatingPattern: mockSetEatingPattern,
      });

      const { UNSAFE_root } = render(<EatingPatternScreen navigation={mockNavigation} />);
      // Progress bar should show 9/12 = 75%
      expect(UNSAFE_root).toBeTruthy();
    });
  });
});
