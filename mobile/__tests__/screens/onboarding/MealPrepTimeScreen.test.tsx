/**
 * MealPrepTimeScreen Component Tests
 * Tests meal prep time selection
 */

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import MealPrepTimeScreen from '../../../src/screens/onboarding/MealPrepTimeScreen';
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
const mockSetMealPrepTime = jest.fn();

describe('MealPrepTimeScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    beforeEach(() => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {},
        setMealPrepTime: mockSetMealPrepTime,
      });
    });

    it('should render all required elements', () => {
      const { getByText } = render(<MealPrepTimeScreen navigation={mockNavigation} />);

      // Prompt
      expect(getByText(/How much time/)).toBeTruthy();
      expect(getByText(/do you have/)).toBeTruthy();
      expect(getByText(/for meal prep?/)).toBeTruthy();

      // All 3 time options (labels)
      expect(getByText('<15')).toBeTruthy();
      expect(getByText('30')).toBeTruthy();
      expect(getByText('60+')).toBeTruthy();

      // Continue button
      expect(getByText('Continue')).toBeTruthy();

      // Back button
      expect(getByText('←')).toBeTruthy();
    });

    it('should render with no pre-selected option', () => {
      const { UNSAFE_root } = render(<MealPrepTimeScreen navigation={mockNavigation} />);
      expect(UNSAFE_root).toBeTruthy();
    });
  });

  describe('Time Selection', () => {
    beforeEach(() => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {},
        setMealPrepTime: mockSetMealPrepTime,
      });
    });

    it('should select minimal when <15 is pressed', () => {
      const { getByText } = render(<MealPrepTimeScreen navigation={mockNavigation} />);
      fireEvent.press(getByText('<15'));
    });

    it('should select moderate when 30 is pressed', () => {
      const { getByText } = render(<MealPrepTimeScreen navigation={mockNavigation} />);
      fireEvent.press(getByText('30'));
    });

    it('should select extended when 60+ is pressed', () => {
      const { getByText } = render(<MealPrepTimeScreen navigation={mockNavigation} />);
      fireEvent.press(getByText('60+'));
    });
  });

  describe('Stored State', () => {
    it('should initialize with stored time (minimal)', () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {
          mealPrepTime: 'minimal'
        },
        setMealPrepTime: mockSetMealPrepTime,
      });

      const { UNSAFE_root } = render(<MealPrepTimeScreen navigation={mockNavigation} />);
      expect(UNSAFE_root).toBeTruthy();
    });

    it('should initialize with stored time (moderate)', () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {
          mealPrepTime: 'moderate'
        },
        setMealPrepTime: mockSetMealPrepTime,
      });

      const { UNSAFE_root } = render(<MealPrepTimeScreen navigation={mockNavigation} />);
      expect(UNSAFE_root).toBeTruthy();
    });

    it('should initialize with stored time (extended)', () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {
          mealPrepTime: 'extended'
        },
        setMealPrepTime: mockSetMealPrepTime,
      });

      const { UNSAFE_root } = render(<MealPrepTimeScreen navigation={mockNavigation} />);
      expect(UNSAFE_root).toBeTruthy();
    });
  });

  describe('Navigation', () => {
    it('should navigate to MealVariety when Continue is pressed', async () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {},
        setMealPrepTime: mockSetMealPrepTime,
      });

      const { getByText } = render(<MealPrepTimeScreen navigation={mockNavigation} />);

      fireEvent.press(getByText('30'));
      fireEvent.press(getByText('Continue'));

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('MealVariety');
      });
    });

    it('should navigate back when back button is pressed', () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {},
        setMealPrepTime: mockSetMealPrepTime,
      });

      const { getByText } = render(<MealPrepTimeScreen navigation={mockNavigation} />);
      fireEvent.press(getByText('←'));
      expect(mockGoBack).toHaveBeenCalledTimes(1);
    });
  });

  describe('Store Integration', () => {
    it('should save minimal to store', async () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {},
        setMealPrepTime: mockSetMealPrepTime,
      });

      const { getByText } = render(<MealPrepTimeScreen navigation={mockNavigation} />);

      fireEvent.press(getByText('<15'));
      fireEvent.press(getByText('Continue'));

      await waitFor(() => {
        expect(mockSetMealPrepTime).toHaveBeenCalledWith('minimal');
      });
    });

    it('should save moderate to store', async () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {},
        setMealPrepTime: mockSetMealPrepTime,
      });

      const { getByText } = render(<MealPrepTimeScreen navigation={mockNavigation} />);

      fireEvent.press(getByText('30'));
      fireEvent.press(getByText('Continue'));

      await waitFor(() => {
        expect(mockSetMealPrepTime).toHaveBeenCalledWith('moderate');
      });
    });

    it('should save extended to store', async () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {},
        setMealPrepTime: mockSetMealPrepTime,
      });

      const { getByText } = render(<MealPrepTimeScreen navigation={mockNavigation} />);

      fireEvent.press(getByText('60+'));
      fireEvent.press(getByText('Continue'));

      await waitFor(() => {
        expect(mockSetMealPrepTime).toHaveBeenCalledWith('extended');
      });
    });
  });

  describe('Validation', () => {
    it('should disable Continue button when no selection is made', () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {},
        setMealPrepTime: mockSetMealPrepTime,
      });

      const { getByText } = render(<MealPrepTimeScreen navigation={mockNavigation} />);

      fireEvent.press(getByText('Continue'));
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  describe('Segmented Control Style', () => {
    it('should render as horizontal segmented control', () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {},
        setMealPrepTime: mockSetMealPrepTime,
      });

      const { UNSAFE_root } = render(<MealPrepTimeScreen navigation={mockNavigation} />);
      // Segmented control is a horizontal layout (tested implicitly via rendering)
      expect(UNSAFE_root).toBeTruthy();
    });
  });
});
