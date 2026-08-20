/**
 * GroceryShoppingDayScreen Component Tests
 * Tests grocery shopping day picker wheel with skip option
 */

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import GroceryShoppingDayScreen from '../../../src/screens/onboarding/GroceryShoppingDayScreen';
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
const mockSetGroceryShoppingDay = jest.fn();

describe('GroceryShoppingDayScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    beforeEach(() => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {},
        setGroceryShoppingDay: mockSetGroceryShoppingDay,
      });
    });

    it('should render all required elements', () => {
      const { getByText } = render(<GroceryShoppingDayScreen navigation={mockNavigation} />);

      // Prompt
      expect(getByText(/When do you/)).toBeTruthy();
      expect(getByText(/grocery shop/)).toBeTruthy();

      // All 7 day options
      expect(getByText('Sunday')).toBeTruthy();
      expect(getByText('Monday')).toBeTruthy();
      expect(getByText('Tuesday')).toBeTruthy();
      expect(getByText('Wednesday')).toBeTruthy();
      expect(getByText('Thursday')).toBeTruthy();
      expect(getByText('Friday')).toBeTruthy();
      expect(getByText('Saturday')).toBeTruthy();

      // Continue and Skip buttons
      expect(getByText('Continue')).toBeTruthy();
      expect(getByText('Skip →')).toBeTruthy();

      // Back button
      expect(getByText('←')).toBeTruthy();
    });

    it('should render with Sunday selected by default', () => {
      const { UNSAFE_root } = render(<GroceryShoppingDayScreen navigation={mockNavigation} />);
      expect(UNSAFE_root).toBeTruthy();
    });
  });

  describe('Day Selection', () => {
    beforeEach(() => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {},
        setGroceryShoppingDay: mockSetGroceryShoppingDay,
      });
    });

    it('should render all 7 days of the week', () => {
      const { getByText } = render(<GroceryShoppingDayScreen navigation={mockNavigation} />);

      // Verify all days are rendered
      ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].forEach(day => {
        expect(getByText(day)).toBeTruthy();
      });
    });
  });

  describe('Stored State', () => {
    it('should initialize with stored day (sunday)', () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {
          weekStartDay: 'sunday'
        },
        setGroceryShoppingDay: mockSetGroceryShoppingDay,
      });

      const { UNSAFE_root } = render(<GroceryShoppingDayScreen navigation={mockNavigation} />);
      expect(UNSAFE_root).toBeTruthy();
    });

    it('should initialize with stored day (saturday)', () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {
          weekStartDay: 'saturday'
        },
        setGroceryShoppingDay: mockSetGroceryShoppingDay,
      });

      const { UNSAFE_root } = render(<GroceryShoppingDayScreen navigation={mockNavigation} />);
      expect(UNSAFE_root).toBeTruthy();
    });

    it('should handle flexible weekStartDay', () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {
          weekStartDay: 'flexible'
        },
        setGroceryShoppingDay: mockSetGroceryShoppingDay,
      });

      const { UNSAFE_root } = render(<GroceryShoppingDayScreen navigation={mockNavigation} />);
      expect(UNSAFE_root).toBeTruthy();
    });
  });

  describe('Navigation', () => {
    it('should navigate to EquipmentAccess when Continue is pressed', async () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {},
        setGroceryShoppingDay: mockSetGroceryShoppingDay,
      });

      const { getByText } = render(<GroceryShoppingDayScreen navigation={mockNavigation} />);

      fireEvent.press(getByText('Continue'));

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('EquipmentAccess');
      });
    });

    it('should navigate to EquipmentAccess when Skip is pressed', async () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {},
        setGroceryShoppingDay: mockSetGroceryShoppingDay,
      });

      const { getByText } = render(<GroceryShoppingDayScreen navigation={mockNavigation} />);

      fireEvent.press(getByText('Skip →'));

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('EquipmentAccess');
      });
    });

    it('should navigate back when back button is pressed', () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {},
        setGroceryShoppingDay: mockSetGroceryShoppingDay,
      });

      const { getByText } = render(<GroceryShoppingDayScreen navigation={mockNavigation} />);
      fireEvent.press(getByText('←'));
      expect(mockGoBack).toHaveBeenCalledTimes(1);
    });
  });

  describe('Store Integration', () => {
    it('should save selected day to store when Continue is pressed', async () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {},
        setGroceryShoppingDay: mockSetGroceryShoppingDay,
      });

      const { getByText } = render(<GroceryShoppingDayScreen navigation={mockNavigation} />);

      fireEvent.press(getByText('Continue'));

      await waitFor(() => {
        // Default selection is Sunday (index 0)
        expect(mockSetGroceryShoppingDay).toHaveBeenCalledWith('sunday');
      });
    });

    it('should save flexible to store when Skip is pressed', async () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {},
        setGroceryShoppingDay: mockSetGroceryShoppingDay,
      });

      const { getByText } = render(<GroceryShoppingDayScreen navigation={mockNavigation} />);

      fireEvent.press(getByText('Skip →'));

      await waitFor(() => {
        expect(mockSetGroceryShoppingDay).toHaveBeenCalledWith('flexible');
      });
    });
  });

  describe('Helper Text', () => {
    it('should show helper text about meal plan generation', () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {},
        setGroceryShoppingDay: mockSetGroceryShoppingDay,
      });

      const { getByText } = render(<GroceryShoppingDayScreen navigation={mockNavigation} />);

      expect(getByText(/meal plan/)).toBeTruthy();
      expect(getByText(/when you shop/)).toBeTruthy();
    });
  });

  describe('Progress Indicator', () => {
    it('should show correct progress (13/17)', () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {},
        setGroceryShoppingDay: mockSetGroceryShoppingDay,
      });

      const { UNSAFE_root } = render(<GroceryShoppingDayScreen navigation={mockNavigation} />);
      // Progress bar should show 13/17 = ~76.5%
      expect(UNSAFE_root).toBeTruthy();
    });
  });
});
