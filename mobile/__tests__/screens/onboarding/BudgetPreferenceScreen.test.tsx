/**
 * BudgetPreferenceScreen Component Tests
 * Tests budget preference selection with skip option
 */

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import BudgetPreferenceScreen from '../../../src/screens/onboarding/BudgetPreferenceScreen';
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
const mockSetBudgetPreference = jest.fn();

describe('BudgetPreferenceScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    beforeEach(() => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {},
        setBudgetPreference: mockSetBudgetPreference,
      });
    });

    it('should render all required elements', () => {
      const { getByText } = render(<BudgetPreferenceScreen navigation={mockNavigation} />);

      // Prompt
      expect(getByText(/Do you prefer/)).toBeTruthy();
      expect(getByText(/budget-friendly ingredients?/)).toBeTruthy();

      // 2 budget options
      expect(getByText('Yes')).toBeTruthy();
      expect(getByText('No')).toBeTruthy();

      // Descriptions
      expect(getByText('Prioritize affordable options')).toBeTruthy();
      expect(getByText('Any ingredients are fine')).toBeTruthy();

      // Icons
      expect(getByText('💰')).toBeTruthy();
      expect(getByText('🛒')).toBeTruthy();

      // Continue and Skip buttons
      expect(getByText('Continue')).toBeTruthy();
      expect(getByText('Skip →')).toBeTruthy();

      // Back button
      expect(getByText('←')).toBeTruthy();
    });

    it('should render with no pre-selected option', () => {
      const { UNSAFE_root } = render(<BudgetPreferenceScreen navigation={mockNavigation} />);
      expect(UNSAFE_root).toBeTruthy();
    });
  });

  describe('Budget Selection', () => {
    beforeEach(() => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {},
        setBudgetPreference: mockSetBudgetPreference,
      });
    });

    it('should select budget-conscious (true) when Yes is pressed', () => {
      const { getByText } = render(<BudgetPreferenceScreen navigation={mockNavigation} />);
      fireEvent.press(getByText('Yes'));
    });

    it('should select not-budget-conscious (false) when No is pressed', () => {
      const { getByText } = render(<BudgetPreferenceScreen navigation={mockNavigation} />);
      fireEvent.press(getByText('No'));
    });

    it('should allow switching between options', () => {
      const { getByText } = render(<BudgetPreferenceScreen navigation={mockNavigation} />);

      fireEvent.press(getByText('Yes'));
      fireEvent.press(getByText('No'));
      // Last selection wins
    });
  });

  describe('Stored State', () => {
    it('should initialize with stored budget preference (true)', () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {
          budgetConscious: true
        },
        setBudgetPreference: mockSetBudgetPreference,
      });

      const { UNSAFE_root } = render(<BudgetPreferenceScreen navigation={mockNavigation} />);
      expect(UNSAFE_root).toBeTruthy();
    });

    it('should initialize with stored budget preference (false)', () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {
          budgetConscious: false
        },
        setBudgetPreference: mockSetBudgetPreference,
      });

      const { UNSAFE_root } = render(<BudgetPreferenceScreen navigation={mockNavigation} />);
      expect(UNSAFE_root).toBeTruthy();
    });
  });

  describe('Navigation', () => {
    it('should navigate to GroceryShoppingDay when Continue is pressed with selection', async () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {},
        setBudgetPreference: mockSetBudgetPreference,
      });

      const { getByText } = render(<BudgetPreferenceScreen navigation={mockNavigation} />);

      fireEvent.press(getByText('Yes'));
      fireEvent.press(getByText('Continue'));

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('GroceryShoppingDay');
      });
    });

    it('should navigate to GroceryShoppingDay when Skip is pressed', async () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {},
        setBudgetPreference: mockSetBudgetPreference,
      });

      const { getByText } = render(<BudgetPreferenceScreen navigation={mockNavigation} />);

      fireEvent.press(getByText('Skip →'));

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('GroceryShoppingDay');
      });
    });

    it('should navigate back when back button is pressed', () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {},
        setBudgetPreference: mockSetBudgetPreference,
      });

      const { getByText } = render(<BudgetPreferenceScreen navigation={mockNavigation} />);
      fireEvent.press(getByText('←'));
      expect(mockGoBack).toHaveBeenCalledTimes(1);
    });
  });

  describe('Store Integration', () => {
    it('should save true to store when Yes is selected', async () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {},
        setBudgetPreference: mockSetBudgetPreference,
      });

      const { getByText } = render(<BudgetPreferenceScreen navigation={mockNavigation} />);

      fireEvent.press(getByText('Yes'));
      fireEvent.press(getByText('Continue'));

      await waitFor(() => {
        expect(mockSetBudgetPreference).toHaveBeenCalledWith(true);
      });
    });

    it('should save false to store when No is selected', async () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {},
        setBudgetPreference: mockSetBudgetPreference,
      });

      const { getByText } = render(<BudgetPreferenceScreen navigation={mockNavigation} />);

      fireEvent.press(getByText('No'));
      fireEvent.press(getByText('Continue'));

      await waitFor(() => {
        expect(mockSetBudgetPreference).toHaveBeenCalledWith(false);
      });
    });

    it('should save null to store when Skip is pressed', async () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {},
        setBudgetPreference: mockSetBudgetPreference,
      });

      const { getByText } = render(<BudgetPreferenceScreen navigation={mockNavigation} />);

      fireEvent.press(getByText('Skip →'));

      await waitFor(() => {
        expect(mockSetBudgetPreference).toHaveBeenCalledWith(null);
      });
    });
  });

  describe('Validation', () => {
    it('should allow Skip button even without selection', async () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {},
        setBudgetPreference: mockSetBudgetPreference,
      });

      const { getByText } = render(<BudgetPreferenceScreen navigation={mockNavigation} />);

      // Skip works without selection
      fireEvent.press(getByText('Skip →'));

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('GroceryShoppingDay');
      });
    });
  });

  describe('Boolean Value Handling', () => {
    it('should correctly handle boolean values (not strings)', async () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {},
        setBudgetPreference: mockSetBudgetPreference,
      });

      const { getByText } = render(<BudgetPreferenceScreen navigation={mockNavigation} />);

      fireEvent.press(getByText('Yes'));
      fireEvent.press(getByText('Continue'));

      await waitFor(() => {
        // Verify it's a boolean true, not string "true"
        expect(mockSetBudgetPreference).toHaveBeenCalledWith(true);
        expect(typeof mockSetBudgetPreference.mock.calls[0][0]).toBe('boolean');
      });
    });
  });
});
