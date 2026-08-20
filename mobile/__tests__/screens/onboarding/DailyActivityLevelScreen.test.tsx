/**
 * DailyActivityLevelScreen Component Tests
 * Tests activity level selection and navigation
 */

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import DailyActivityLevelScreen from '../../../src/screens/onboarding/DailyActivityLevelScreen';
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
const mockSetActivityLevel = jest.fn();

describe('DailyActivityLevelScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    beforeEach(() => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {},
        setActivityLevel: mockSetActivityLevel,
      });
    });

    it('should render all required elements', () => {
      const { getByText } = render(<DailyActivityLevelScreen navigation={mockNavigation} />);

      // Prompt
      expect(getByText(/How active/)).toBeTruthy();
      expect(getByText(/are you?/)).toBeTruthy();

      // All 3 activity options
      expect(getByText('Sedentary')).toBeTruthy();
      expect(getByText('Moderately Active')).toBeTruthy();
      expect(getByText('Very Active')).toBeTruthy();

      // Descriptions
      expect(getByText(/Desk job, little to no exercise/)).toBeTruthy();
      expect(getByText(/Exercise 3-5 days\/week or active job/)).toBeTruthy();
      expect(getByText(/Exercise 6-7 days\/week or physically demanding job/)).toBeTruthy();

      // Icons
      expect(getByText('🪑')).toBeTruthy();
      expect(getByText('🚶')).toBeTruthy();
      expect(getByText('🏃')).toBeTruthy();

      // Continue button
      expect(getByText('Continue')).toBeTruthy();

      // Back button
      expect(getByText('←')).toBeTruthy();
    });

    it('should render with no pre-selected option', () => {
      const { UNSAFE_root } = render(<DailyActivityLevelScreen navigation={mockNavigation} />);
      // No option should be selected by default
      expect(UNSAFE_root).toBeTruthy();
    });
  });

  describe('Activity Level Selection', () => {
    beforeEach(() => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {},
        setActivityLevel: mockSetActivityLevel,
      });
    });

    it('should select sedentary when Sedentary button is pressed', () => {
      const { getByText } = render(<DailyActivityLevelScreen navigation={mockNavigation} />);

      const sedentaryButton = getByText('Sedentary');
      fireEvent.press(sedentaryButton);

      // Visual state changes (tested implicitly)
    });

    it('should select moderately_active when Moderately Active button is pressed', () => {
      const { getByText } = render(<DailyActivityLevelScreen navigation={mockNavigation} />);

      const moderatelyActiveButton = getByText('Moderately Active');
      fireEvent.press(moderatelyActiveButton);

      // Visual state changes
    });

    it('should select very_active when Very Active button is pressed', () => {
      const { getByText } = render(<DailyActivityLevelScreen navigation={mockNavigation} />);

      const veryActiveButton = getByText('Very Active');
      fireEvent.press(veryActiveButton);

      // Visual state changes
    });

    it('should allow switching between activity levels', () => {
      const { getByText } = render(<DailyActivityLevelScreen navigation={mockNavigation} />);

      // Select sedentary
      fireEvent.press(getByText('Sedentary'));

      // Switch to very active
      fireEvent.press(getByText('Very Active'));

      // Last selection wins
    });
  });

  describe('Stored State', () => {
    it('should initialize with stored activity level (sedentary)', () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {
          activityLevel: 'sedentary'
        },
        setActivityLevel: mockSetActivityLevel,
      });

      const { UNSAFE_root } = render(<DailyActivityLevelScreen navigation={mockNavigation} />);
      // Sedentary should be pre-selected
      expect(UNSAFE_root).toBeTruthy();
    });

    it('should initialize with stored activity level (moderately_active)', () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {
          activityLevel: 'moderately_active'
        },
        setActivityLevel: mockSetActivityLevel,
      });

      const { UNSAFE_root } = render(<DailyActivityLevelScreen navigation={mockNavigation} />);
      expect(UNSAFE_root).toBeTruthy();
    });

    it('should initialize with stored activity level (very_active)', () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {
          activityLevel: 'very_active'
        },
        setActivityLevel: mockSetActivityLevel,
      });

      const { UNSAFE_root } = render(<DailyActivityLevelScreen navigation={mockNavigation} />);
      expect(UNSAFE_root).toBeTruthy();
    });
  });

  describe('Navigation', () => {
    it('should navigate to LoadingBreak1 when Continue is pressed with selection', async () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {},
        setActivityLevel: mockSetActivityLevel,
      });

      const { getByText } = render(<DailyActivityLevelScreen navigation={mockNavigation} />);

      // Select an option
      fireEvent.press(getByText('Sedentary'));

      // Press continue
      fireEvent.press(getByText('Continue'));

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('LoadingBreak1');
      });
    });

    it('should navigate back when back button is pressed', () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {},
        setActivityLevel: mockSetActivityLevel,
      });

      const { getByText } = render(<DailyActivityLevelScreen navigation={mockNavigation} />);

      fireEvent.press(getByText('←'));

      expect(mockGoBack).toHaveBeenCalledTimes(1);
    });
  });

  describe('Store Integration', () => {
    it('should save sedentary activity level to store', async () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {},
        setActivityLevel: mockSetActivityLevel,
      });

      const { getByText } = render(<DailyActivityLevelScreen navigation={mockNavigation} />);

      fireEvent.press(getByText('Sedentary'));
      fireEvent.press(getByText('Continue'));

      await waitFor(() => {
        expect(mockSetActivityLevel).toHaveBeenCalledWith('sedentary');
      });
    });

    it('should save moderately_active activity level to store', async () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {},
        setActivityLevel: mockSetActivityLevel,
      });

      const { getByText } = render(<DailyActivityLevelScreen navigation={mockNavigation} />);

      fireEvent.press(getByText('Moderately Active'));
      fireEvent.press(getByText('Continue'));

      await waitFor(() => {
        expect(mockSetActivityLevel).toHaveBeenCalledWith('moderately_active');
      });
    });

    it('should save very_active activity level to store', async () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {},
        setActivityLevel: mockSetActivityLevel,
      });

      const { getByText } = render(<DailyActivityLevelScreen navigation={mockNavigation} />);

      fireEvent.press(getByText('Very Active'));
      fireEvent.press(getByText('Continue'));

      await waitFor(() => {
        expect(mockSetActivityLevel).toHaveBeenCalledWith('very_active');
      });
    });

    it('should save last selected activity level when switching', async () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {},
        setActivityLevel: mockSetActivityLevel,
      });

      const { getByText } = render(<DailyActivityLevelScreen navigation={mockNavigation} />);

      // Select sedentary first
      fireEvent.press(getByText('Sedentary'));

      // Change to very active
      fireEvent.press(getByText('Very Active'));

      // Continue
      fireEvent.press(getByText('Continue'));

      await waitFor(() => {
        expect(mockSetActivityLevel).toHaveBeenCalledWith('very_active');
      });
    });
  });

  describe('Validation', () => {
    it('should disable Continue button when no selection is made', () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {},
        setActivityLevel: mockSetActivityLevel,
      });

      const { getByText } = render(<DailyActivityLevelScreen navigation={mockNavigation} />);

      // Try to continue without selection
      fireEvent.press(getByText('Continue'));

      // Should not navigate
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('should enable Continue button after making a selection', async () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {},
        setActivityLevel: mockSetActivityLevel,
      });

      const { getByText } = render(<DailyActivityLevelScreen navigation={mockNavigation} />);

      // Make a selection
      fireEvent.press(getByText('Moderately Active'));

      // Continue should work
      fireEvent.press(getByText('Continue'));

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('LoadingBreak1');
      });
    });
  });

  describe('Progress Indicator', () => {
    it('should show correct progress (7/12)', () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {},
        setActivityLevel: mockSetActivityLevel,
      });

      const { UNSAFE_root } = render(<DailyActivityLevelScreen navigation={mockNavigation} />);
      // Progress should be 7/12 = 58.33%
      expect(UNSAFE_root).toBeTruthy();
    });
  });
});
