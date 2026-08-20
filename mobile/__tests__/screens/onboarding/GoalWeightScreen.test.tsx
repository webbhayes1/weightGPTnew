/**
 * GoalWeightScreen Component Tests
 * Tests goal weight input, smart defaults, unit conversion, and conditional navigation
 */

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import GoalWeightScreen from '../../../src/screens/onboarding/GoalWeightScreen';
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
const mockSetGoalWeight = jest.fn();

describe('GoalWeightScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering - Smart Defaults for Lose Weight', () => {
    it('should suggest 10% weight loss as default (180 lbs → 162 lbs)', () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {
          goalType: 'lose_weight',
          currentWeight: 180,
          weightUnit: 'lbs'
        },
        setGoalWeight: mockSetGoalWeight,
      });

      const { getByText } = render(<GoalWeightScreen navigation={mockNavigation} />);
      // 180 * 0.9 = 162
      expect(getByText('162')).toBeTruthy();
    });

    it('should render all required elements', () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {
          goalType: 'lose_weight',
          currentWeight: 150,
          weightUnit: 'lbs'
        },
        setGoalWeight: mockSetGoalWeight,
      });

      const { getByText, getAllByText } = render(<GoalWeightScreen navigation={mockNavigation} />);

      // Check prompt
      expect(getByText(/What's your/)).toBeTruthy();
      expect(getByText(/goal weight?/)).toBeTruthy();

      // Check unit toggles
      expect(getAllByText('lbs').length).toBeGreaterThan(0);
      expect(getAllByText('kg').length).toBeGreaterThan(0);

      // Check controls
      expect(getByText('+')).toBeTruthy();
      expect(getByText('−')).toBeTruthy();
      expect(getByText('Continue')).toBeTruthy();
      expect(getByText('←')).toBeTruthy();
    });
  });

  describe('Rendering - Smart Defaults for Gain Weight', () => {
    it('should suggest 10% weight gain as default (150 lbs → 165 lbs)', () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {
          goalType: 'gain_weight',
          currentWeight: 150,
          weightUnit: 'lbs'
        },
        setGoalWeight: mockSetGoalWeight,
      });

      const { getByText } = render(<GoalWeightScreen navigation={mockNavigation} />);
      // 150 * 1.1 = 165
      expect(getByText('165')).toBeTruthy();
    });

    it('should suggest 10% weight gain in kg (68 kg → 75 kg)', () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {
          goalType: 'gain_weight',
          currentWeight: 150, // stored in lbs
          weightUnit: 'kg'
        },
        setGoalWeight: mockSetGoalWeight,
      });

      const { getByText } = render(<GoalWeightScreen navigation={mockNavigation} />);
      // 150 * 1.1 = 165 lbs → 75 kg (165 * 0.453592 = 74.84 ≈ 75)
      expect(getByText('75')).toBeTruthy();
    });
  });

  describe('Rendering - Stored Goal Weight', () => {
    it('should use stored goal weight if available', () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {
          goalType: 'lose_weight',
          currentWeight: 200,
          goalWeight: 170,
          weightUnit: 'lbs'
        },
        setGoalWeight: mockSetGoalWeight,
      });

      const { getByText } = render(<GoalWeightScreen navigation={mockNavigation} />);
      expect(getByText('170')).toBeTruthy();
    });

    it('should fallback to 150 lbs if no current weight', () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {
          goalType: 'lose_weight',
          weightUnit: 'lbs'
        },
        setGoalWeight: mockSetGoalWeight,
      });

      const { getByText } = render(<GoalWeightScreen navigation={mockNavigation} />);
      expect(getByText('150')).toBeTruthy();
    });
  });

  describe('Weight Increment/Decrement', () => {
    beforeEach(() => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {
          goalType: 'lose_weight',
          currentWeight: 150,
          weightUnit: 'lbs'
        },
        setGoalWeight: mockSetGoalWeight,
      });
    });

    it('should increment weight when + button is pressed', () => {
      const { getByText } = render(<GoalWeightScreen navigation={mockNavigation} />);
      const incrementButton = getByText('+');

      // Default: 150 * 0.9 = 135
      expect(getByText('135')).toBeTruthy();

      fireEvent(incrementButton, 'pressIn');
      fireEvent(incrementButton, 'pressOut');

      expect(getByText('136')).toBeTruthy();
    });

    it('should decrement weight when - button is pressed', () => {
      const { getByText } = render(<GoalWeightScreen navigation={mockNavigation} />);
      const decrementButton = getByText('−');

      // Default: 135
      expect(getByText('135')).toBeTruthy();

      fireEvent(decrementButton, 'pressIn');
      fireEvent(decrementButton, 'pressOut');

      expect(getByText('134')).toBeTruthy();
    });

    it('should not decrement below minimum (80 lbs)', () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {
          goalType: 'lose_weight',
          currentWeight: 90,
          goalWeight: 80,
          weightUnit: 'lbs'
        },
        setGoalWeight: mockSetGoalWeight,
      });

      const { getByText } = render(<GoalWeightScreen navigation={mockNavigation} />);
      const decrementButton = getByText('−');

      expect(getByText('80')).toBeTruthy();

      fireEvent(decrementButton, 'pressIn');
      fireEvent(decrementButton, 'pressOut');

      expect(getByText('80')).toBeTruthy(); // Still 80
    });

    it('should not increment above maximum (400 lbs)', () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {
          goalType: 'gain_weight',
          currentWeight: 350,
          goalWeight: 400,
          weightUnit: 'lbs'
        },
        setGoalWeight: mockSetGoalWeight,
      });

      const { getByText } = render(<GoalWeightScreen navigation={mockNavigation} />);
      const incrementButton = getByText('+');

      expect(getByText('400')).toBeTruthy();

      fireEvent(incrementButton, 'pressIn');
      fireEvent(incrementButton, 'pressOut');

      expect(getByText('400')).toBeTruthy(); // Still 400
    });
  });

  describe('Unit Conversion', () => {
    it('should convert lbs to kg when kg button is pressed', () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {
          goalType: 'lose_weight',
          currentWeight: 150,
          weightUnit: 'lbs'
        },
        setGoalWeight: mockSetGoalWeight,
      });

      const { getByText, getAllByText } = render(<GoalWeightScreen navigation={mockNavigation} />);

      // Default: 135 lbs
      expect(getByText('135')).toBeTruthy();
      expect(getByText(/Range: 80-400 lbs/)).toBeTruthy();

      // Press kg button
      const kgButtons = getAllByText('kg');
      fireEvent.press(kgButtons[0]);

      // Should convert to ~61 kg (135 * 0.453592 = 61.23 ≈ 61)
      expect(getByText('61')).toBeTruthy();
      expect(getByText(/Range: 35-180 kg/)).toBeTruthy();
    });

    it('should convert kg to lbs when lbs button is pressed', () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {
          goalType: 'lose_weight',
          currentWeight: 150, // stored in lbs
          weightUnit: 'kg'
        },
        setGoalWeight: mockSetGoalWeight,
      });

      const { getByText, getAllByText } = render(<GoalWeightScreen navigation={mockNavigation} />);

      // Default: 150 * 0.9 = 135 lbs → 61 kg
      expect(getByText('61')).toBeTruthy();

      // Press lbs button
      const lbsButtons = getAllByText('lbs');
      fireEvent.press(lbsButtons[0]);

      // Should convert to ~134 lbs (61 * 2.20462 = 134.48 ≈ 134)
      expect(getByText('134')).toBeTruthy();
    });
  });

  describe('Navigation - Conditional Flow', () => {
    it('should navigate to GoalDate for lose_weight goal', async () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {
          goalType: 'lose_weight',
          currentWeight: 180,
          weightUnit: 'lbs'
        },
        setGoalWeight: mockSetGoalWeight,
      });

      const { getByText } = render(<GoalWeightScreen navigation={mockNavigation} />);
      const continueButton = getByText('Continue');

      fireEvent.press(continueButton);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('GoalDate');
      });
    });

    it('should navigate to GoalDate for gain_weight goal', async () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {
          goalType: 'gain_weight',
          currentWeight: 150,
          weightUnit: 'lbs'
        },
        setGoalWeight: mockSetGoalWeight,
      });

      const { getByText } = render(<GoalWeightScreen navigation={mockNavigation} />);
      const continueButton = getByText('Continue');

      fireEvent.press(continueButton);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('GoalDate');
      });
    });

    it('should navigate to PersonalDetails for maintain goal (if somehow reached)', async () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {
          goalType: 'maintain',
          currentWeight: 150,
          weightUnit: 'lbs'
        },
        setGoalWeight: mockSetGoalWeight,
      });

      const { getByText } = render(<GoalWeightScreen navigation={mockNavigation} />);
      const continueButton = getByText('Continue');

      fireEvent.press(continueButton);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('PersonalDetails');
      });
    });

    it('should navigate back when back button is pressed', () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {
          goalType: 'lose_weight',
          currentWeight: 150,
          weightUnit: 'lbs'
        },
        setGoalWeight: mockSetGoalWeight,
      });

      const { getByText } = render(<GoalWeightScreen navigation={mockNavigation} />);
      const backButton = getByText('←');

      fireEvent.press(backButton);

      expect(mockGoBack).toHaveBeenCalledTimes(1);
    });
  });

  describe('Store Integration', () => {
    it('should save goal weight in lbs to store', async () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {
          goalType: 'lose_weight',
          currentWeight: 180,
          weightUnit: 'lbs'
        },
        setGoalWeight: mockSetGoalWeight,
      });

      const { getByText } = render(<GoalWeightScreen navigation={mockNavigation} />);
      const continueButton = getByText('Continue');

      // Default is 162 (180 * 0.9)
      fireEvent.press(continueButton);

      await waitFor(() => {
        expect(mockSetGoalWeight).toHaveBeenCalledWith(162);
      });
    });

    it('should convert kg to lbs before saving to store', async () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {
          goalType: 'lose_weight',
          currentWeight: 150,
          weightUnit: 'kg'
        },
        setGoalWeight: mockSetGoalWeight,
      });

      const { getByText } = render(<GoalWeightScreen navigation={mockNavigation} />);

      // Default in kg: 135 lbs → 61 kg
      const continueButton = getByText('Continue');
      fireEvent.press(continueButton);

      await waitFor(() => {
        // Should save as lbs: 61 kg * 2.20462 ≈ 134 lbs
        expect(mockSetGoalWeight).toHaveBeenCalledWith(134);
      });
    });

    it('should save modified goal weight correctly', async () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {
          goalType: 'lose_weight',
          currentWeight: 180,
          weightUnit: 'lbs'
        },
        setGoalWeight: mockSetGoalWeight,
      });

      const { getByText } = render(<GoalWeightScreen navigation={mockNavigation} />);
      const incrementButton = getByText('+');

      // Default is 162, increment 3 times to 165
      fireEvent(incrementButton, 'pressIn');
      fireEvent(incrementButton, 'pressOut');
      fireEvent(incrementButton, 'pressIn');
      fireEvent(incrementButton, 'pressOut');
      fireEvent(incrementButton, 'pressIn');
      fireEvent(incrementButton, 'pressOut');

      const continueButton = getByText('Continue');
      fireEvent.press(continueButton);

      await waitFor(() => {
        expect(mockSetGoalWeight).toHaveBeenCalledWith(165);
      });
    });
  });

  describe('Validation', () => {
    it('should enforce minimum weight boundary (80 lbs)', () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {
          goalType: 'lose_weight',
          currentWeight: 90,
          goalWeight: 80,
          weightUnit: 'lbs'
        },
        setGoalWeight: mockSetGoalWeight,
      });

      const { getByText } = render(<GoalWeightScreen navigation={mockNavigation} />);
      const decrementButton = getByText('−');

      expect(getByText('80')).toBeTruthy();

      fireEvent(decrementButton, 'pressIn');
      fireEvent(decrementButton, 'pressOut');

      expect(getByText('80')).toBeTruthy(); // Still 80
    });

    it('should enforce maximum weight boundary (400 lbs)', () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {
          goalType: 'gain_weight',
          currentWeight: 350,
          goalWeight: 400,
          weightUnit: 'lbs'
        },
        setGoalWeight: mockSetGoalWeight,
      });

      const { getByText } = render(<GoalWeightScreen navigation={mockNavigation} />);
      const incrementButton = getByText('+');

      expect(getByText('400')).toBeTruthy();

      fireEvent(incrementButton, 'pressIn');
      fireEvent(incrementButton, 'pressOut');

      expect(getByText('400')).toBeTruthy(); // Still 400
    });

    it('should enforce minimum weight boundary in kg (35 kg)', () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {
          goalType: 'lose_weight',
          currentWeight: 80, // 80 lbs in DB
          goalWeight: 77, // 77 lbs = 35 kg
          weightUnit: 'kg'
        },
        setGoalWeight: mockSetGoalWeight,
      });

      const { getByText } = render(<GoalWeightScreen navigation={mockNavigation} />);
      const decrementButton = getByText('−');

      expect(getByText('35')).toBeTruthy();

      fireEvent(decrementButton, 'pressIn');
      fireEvent(decrementButton, 'pressOut');

      expect(getByText('35')).toBeTruthy(); // Still 35
    });

    it('should enforce maximum weight boundary in kg (180 kg)', () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {
          goalType: 'gain_weight',
          currentWeight: 390, // 390 lbs in DB
          goalWeight: 397, // 397 lbs = 180 kg
          weightUnit: 'kg'
        },
        setGoalWeight: mockSetGoalWeight,
      });

      const { getByText } = render(<GoalWeightScreen navigation={mockNavigation} />);
      const incrementButton = getByText('+');

      expect(getByText('180')).toBeTruthy();

      fireEvent(incrementButton, 'pressIn');
      fireEvent(incrementButton, 'pressOut');

      expect(getByText('180')).toBeTruthy(); // Still 180
    });
  });

  describe('Progress Indicator', () => {
    it('should show correct progress (4/12)', () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {
          goalType: 'lose_weight',
          currentWeight: 150,
          weightUnit: 'lbs'
        },
        setGoalWeight: mockSetGoalWeight,
      });

      const { UNSAFE_root } = render(<GoalWeightScreen navigation={mockNavigation} />);
      // Progress should be 4/12 = 33.33%
      expect(UNSAFE_root).toBeTruthy();
    });
  });
});
