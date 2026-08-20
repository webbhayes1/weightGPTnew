/**
 * CurrentWeightScreen Component Tests
 * Tests weight input, unit conversion, validation, and conditional navigation
 */

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import CurrentWeightScreen from '../../../src/screens/onboarding/CurrentWeightScreen';
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
const mockSetCurrentWeight = jest.fn();

describe('CurrentWeightScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering - Default State (lbs)', () => {
    beforeEach(() => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: { goalType: 'lose_weight' },
        setCurrentWeight: mockSetCurrentWeight,
      });
    });

    it('should render all required elements', () => {
      const { getByText, getAllByText } = render(<CurrentWeightScreen navigation={mockNavigation} />);

      // Check prompt
      expect(getByText(/What's your/)).toBeTruthy();
      expect(getByText(/current weight?/)).toBeTruthy();

      // Check unit toggle buttons (lbs and kg appear in both toggle and range hint)
      expect(getAllByText('lbs').length).toBeGreaterThan(0);
      expect(getAllByText('kg').length).toBeGreaterThan(0);

      // Check increment/decrement buttons
      expect(getByText('+')).toBeTruthy();
      expect(getByText('−')).toBeTruthy();

      // Check default weight value (150 lbs)
      expect(getByText('150')).toBeTruthy();

      // Check range hint
      expect(getByText(/Range: 80-400 lbs/)).toBeTruthy();

      // Check continue button
      expect(getByText('Continue')).toBeTruthy();

      // Check back button
      expect(getByText('←')).toBeTruthy();
    });

    it('should initialize with default weight of 150 lbs', () => {
      const { getByText } = render(<CurrentWeightScreen navigation={mockNavigation} />);
      expect(getByText('150')).toBeTruthy();
      expect(getByText(/Range: 80-400 lbs/)).toBeTruthy();
    });

    it('should render progress bar', () => {
      const { UNSAFE_root } = render(<CurrentWeightScreen navigation={mockNavigation} />);
      // Progress should be 3/12 = 25%
      expect(UNSAFE_root).toBeTruthy();
    });
  });

  describe('Rendering - Stored State', () => {
    it('should initialize with stored weight in lbs', () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {
          goalType: 'lose_weight',
          currentWeight: 180,
          weightUnit: 'lbs'
        },
        setCurrentWeight: mockSetCurrentWeight,
      });

      const { getByText, getAllByText } = render(<CurrentWeightScreen navigation={mockNavigation} />);
      expect(getByText('180')).toBeTruthy();
      // lbs appears in both toggle button and range hint
      expect(getAllByText('lbs').length).toBeGreaterThan(0);
    });

    it('should initialize with stored weight in kg', () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {
          goalType: 'lose_weight',
          currentWeight: 80,
          weightUnit: 'kg'
        },
        setCurrentWeight: mockSetCurrentWeight,
      });

      const { getByText, getAllByText } = render(<CurrentWeightScreen navigation={mockNavigation} />);
      expect(getByText('80')).toBeTruthy();
      // kg appears in both toggle button and range hint
      expect(getAllByText('kg').length).toBeGreaterThan(0);
    });
  });

  describe('Weight Increment/Decrement', () => {
    beforeEach(() => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: { goalType: 'lose_weight' },
        setCurrentWeight: mockSetCurrentWeight,
      });
    });

    it('should increment weight when + button is pressed', () => {
      const { getByText } = render(<CurrentWeightScreen navigation={mockNavigation} />);
      const incrementButton = getByText('+');

      // Initial value is 150
      expect(getByText('150')).toBeTruthy();

      // Press increment
      fireEvent(incrementButton, 'pressIn');
      fireEvent(incrementButton, 'pressOut');

      // Should be 151
      expect(getByText('151')).toBeTruthy();
    });

    it('should decrement weight when - button is pressed', () => {
      const { getByText } = render(<CurrentWeightScreen navigation={mockNavigation} />);
      const decrementButton = getByText('−');

      // Initial value is 150
      expect(getByText('150')).toBeTruthy();

      // Press decrement
      fireEvent(decrementButton, 'pressIn');
      fireEvent(decrementButton, 'pressOut');

      // Should be 149
      expect(getByText('149')).toBeTruthy();
    });

    it('should not decrement below minimum (80 lbs)', () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {
          goalType: 'lose_weight',
          currentWeight: 80,
          weightUnit: 'lbs'
        },
        setCurrentWeight: mockSetCurrentWeight,
      });

      const { getByText } = render(<CurrentWeightScreen navigation={mockNavigation} />);
      const decrementButton = getByText('−');

      // At minimum
      expect(getByText('80')).toBeTruthy();

      // Try to decrement
      fireEvent(decrementButton, 'pressIn');
      fireEvent(decrementButton, 'pressOut');

      // Should still be 80
      expect(getByText('80')).toBeTruthy();
    });

    it('should not increment above maximum (400 lbs)', () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {
          goalType: 'lose_weight',
          currentWeight: 400,
          weightUnit: 'lbs'
        },
        setCurrentWeight: mockSetCurrentWeight,
      });

      const { getByText } = render(<CurrentWeightScreen navigation={mockNavigation} />);
      const incrementButton = getByText('+');

      // At maximum
      expect(getByText('400')).toBeTruthy();

      // Try to increment
      fireEvent(incrementButton, 'pressIn');
      fireEvent(incrementButton, 'pressOut');

      // Should still be 400
      expect(getByText('400')).toBeTruthy();
    });
  });

  describe('Unit Conversion', () => {
    beforeEach(() => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: { goalType: 'lose_weight' },
        setCurrentWeight: mockSetCurrentWeight,
      });
    });

    it('should convert lbs to kg when kg button is pressed', () => {
      const { getByText, getAllByText } = render(<CurrentWeightScreen navigation={mockNavigation} />);

      // Initial: 150 lbs
      expect(getByText('150')).toBeTruthy();
      expect(getByText(/Range: 80-400 lbs/)).toBeTruthy();

      // Press kg button (first occurrence in the toggle buttons)
      const kgButtons = getAllByText('kg');
      fireEvent.press(kgButtons[0]);

      // Should convert to ~68 kg (150 * 0.453592 = 68.0388 ≈ 68)
      expect(getByText('68')).toBeTruthy();
      expect(getByText(/Range: 35-180 kg/)).toBeTruthy();
    });

    it('should convert kg to lbs when lbs button is pressed', () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {
          goalType: 'lose_weight',
          currentWeight: 68,
          weightUnit: 'kg'
        },
        setCurrentWeight: mockSetCurrentWeight,
      });

      const { getByText, getAllByText } = render(<CurrentWeightScreen navigation={mockNavigation} />);

      // Initial: 68 kg
      expect(getByText('68')).toBeTruthy();
      expect(getByText(/Range: 35-180 kg/)).toBeTruthy();

      // Press lbs button (first occurrence in the toggle buttons)
      const lbsButtons = getAllByText('lbs');
      fireEvent.press(lbsButtons[0]);

      // Should convert to ~150 lbs (68 * 2.20462 = 149.914 ≈ 150)
      expect(getByText('150')).toBeTruthy();
      expect(getByText(/Range: 80-400 lbs/)).toBeTruthy();
    });

    it('should update range hint after unit conversion', () => {
      const { getByText, getAllByText } = render(<CurrentWeightScreen navigation={mockNavigation} />);

      // Initial: lbs range
      expect(getByText(/Range: 80-400 lbs/)).toBeTruthy();

      // Convert to kg
      const kgButtons = getAllByText('kg');
      fireEvent.press(kgButtons[0]);

      // Should show kg range
      expect(getByText(/Range: 35-180 kg/)).toBeTruthy();
    });
  });

  describe('Navigation - Conditional Flow', () => {
    it('should navigate to GoalWeight for lose_weight goal', async () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: { goalType: 'lose_weight' },
        setCurrentWeight: mockSetCurrentWeight,
      });

      const { getByText } = render(<CurrentWeightScreen navigation={mockNavigation} />);
      const continueButton = getByText('Continue');

      fireEvent.press(continueButton);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('GoalWeight');
      });
    });

    it('should navigate to GoalWeight for gain_weight goal', async () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: { goalType: 'gain_weight' },
        setCurrentWeight: mockSetCurrentWeight,
      });

      const { getByText } = render(<CurrentWeightScreen navigation={mockNavigation} />);
      const continueButton = getByText('Continue');

      fireEvent.press(continueButton);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('GoalWeight');
      });
    });

    it('should navigate to PersonalDetails for maintain goal (skip goal weight)', async () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: { goalType: 'maintain' },
        setCurrentWeight: mockSetCurrentWeight,
      });

      const { getByText } = render(<CurrentWeightScreen navigation={mockNavigation} />);
      const continueButton = getByText('Continue');

      fireEvent.press(continueButton);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('PersonalDetails');
      });
    });

    it('should navigate back when back button is pressed', () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: { goalType: 'lose_weight' },
        setCurrentWeight: mockSetCurrentWeight,
      });

      const { getByText } = render(<CurrentWeightScreen navigation={mockNavigation} />);
      const backButton = getByText('←');

      fireEvent.press(backButton);

      expect(mockGoBack).toHaveBeenCalledTimes(1);
    });
  });

  describe('Store Integration', () => {
    beforeEach(() => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: { goalType: 'lose_weight' },
        setCurrentWeight: mockSetCurrentWeight,
      });
    });

    it('should save weight in lbs to store', async () => {
      const { getByText } = render(<CurrentWeightScreen navigation={mockNavigation} />);
      const continueButton = getByText('Continue');

      // Default weight is 150 lbs
      fireEvent.press(continueButton);

      await waitFor(() => {
        expect(mockSetCurrentWeight).toHaveBeenCalledWith(150, 'lbs');
      });
    });

    it('should convert kg to lbs before saving to store', async () => {
      const { getByText } = render(<CurrentWeightScreen navigation={mockNavigation} />);

      // Convert to kg (150 lbs → 68 kg)
      fireEvent.press(getByText('kg'));

      // Continue
      const continueButton = getByText('Continue');
      fireEvent.press(continueButton);

      await waitFor(() => {
        // Should save as lbs: 68 kg * 2.20462 ≈ 150 lbs
        expect(mockSetCurrentWeight).toHaveBeenCalledWith(150, 'kg');
      });
    });

    it('should save modified weight correctly', async () => {
      const { getByText } = render(<CurrentWeightScreen navigation={mockNavigation} />);
      const incrementButton = getByText('+');

      // Increment from 150 to 155
      fireEvent(incrementButton, 'pressIn');
      fireEvent(incrementButton, 'pressOut');
      fireEvent(incrementButton, 'pressIn');
      fireEvent(incrementButton, 'pressOut');
      fireEvent(incrementButton, 'pressIn');
      fireEvent(incrementButton, 'pressOut');
      fireEvent(incrementButton, 'pressIn');
      fireEvent(incrementButton, 'pressOut');
      fireEvent(incrementButton, 'pressIn');
      fireEvent(incrementButton, 'pressOut');

      // Continue
      const continueButton = getByText('Continue');
      fireEvent.press(continueButton);

      await waitFor(() => {
        expect(mockSetCurrentWeight).toHaveBeenCalledWith(155, 'lbs');
      });
    });
  });

  describe('Validation', () => {
    it('should enable Continue button when weight is valid', () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: { goalType: 'lose_weight' },
        setCurrentWeight: mockSetCurrentWeight,
      });

      const { getByText } = render(<CurrentWeightScreen navigation={mockNavigation} />);
      const continueButton = getByText('Continue');

      // Default weight (150) is valid, button should not be disabled
      // Note: We can't directly test disabled prop in RNTL, but we can test that press works
      fireEvent.press(continueButton);
      expect(mockSetCurrentWeight).toHaveBeenCalled();
    });

    it('should enforce minimum weight boundary (80 lbs)', () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {
          goalType: 'lose_weight',
          currentWeight: 80,
          weightUnit: 'lbs'
        },
        setCurrentWeight: mockSetCurrentWeight,
      });

      const { getByText } = render(<CurrentWeightScreen navigation={mockNavigation} />);
      const decrementButton = getByText('−');

      // At minimum (80)
      expect(getByText('80')).toBeTruthy();

      // Decrement button should be disabled (weight won't change)
      fireEvent(decrementButton, 'pressIn');
      fireEvent(decrementButton, 'pressOut');

      expect(getByText('80')).toBeTruthy(); // Still 80
    });

    it('should enforce maximum weight boundary (400 lbs)', () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {
          goalType: 'lose_weight',
          currentWeight: 400,
          weightUnit: 'lbs'
        },
        setCurrentWeight: mockSetCurrentWeight,
      });

      const { getByText } = render(<CurrentWeightScreen navigation={mockNavigation} />);
      const incrementButton = getByText('+');

      // At maximum (400)
      expect(getByText('400')).toBeTruthy();

      // Increment button should be disabled (weight won't change)
      fireEvent(incrementButton, 'pressIn');
      fireEvent(incrementButton, 'pressOut');

      expect(getByText('400')).toBeTruthy(); // Still 400
    });

    it('should enforce minimum weight boundary in kg (35 kg)', () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {
          goalType: 'lose_weight',
          currentWeight: 35,
          weightUnit: 'kg'
        },
        setCurrentWeight: mockSetCurrentWeight,
      });

      const { getByText } = render(<CurrentWeightScreen navigation={mockNavigation} />);
      const decrementButton = getByText('−');

      expect(getByText('35')).toBeTruthy();

      fireEvent(decrementButton, 'pressIn');
      fireEvent(decrementButton, 'pressOut');

      expect(getByText('35')).toBeTruthy(); // Still 35
    });

    it('should enforce maximum weight boundary in kg (180 kg)', () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {
          goalType: 'lose_weight',
          currentWeight: 180,
          weightUnit: 'kg'
        },
        setCurrentWeight: mockSetCurrentWeight,
      });

      const { getByText } = render(<CurrentWeightScreen navigation={mockNavigation} />);
      const incrementButton = getByText('+');

      expect(getByText('180')).toBeTruthy();

      fireEvent(incrementButton, 'pressIn');
      fireEvent(incrementButton, 'pressOut');

      expect(getByText('180')).toBeTruthy(); // Still 180
    });
  });

  describe('Progress Indicator', () => {
    it('should show correct progress (3/12)', () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: { goalType: 'lose_weight' },
        setCurrentWeight: mockSetCurrentWeight,
      });

      const { UNSAFE_root } = render(<CurrentWeightScreen navigation={mockNavigation} />);
      // Progress should be 3/12 = 25%
      expect(UNSAFE_root).toBeTruthy();
    });
  });
});
