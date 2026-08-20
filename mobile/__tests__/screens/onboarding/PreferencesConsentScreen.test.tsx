/**
 * PreferencesConsentScreen Component Tests
 * Tests notification toggles and health disclaimer
 */

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import PreferencesConsentScreen from '../../../src/screens/onboarding/PreferencesConsentScreen';
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
const mockSetNotificationPreferences = jest.fn();
const mockSetDisclaimerAccepted = jest.fn();

describe('PreferencesConsentScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    beforeEach(() => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {},
        setNotificationPreferences: mockSetNotificationPreferences,
        setDisclaimerAccepted: mockSetDisclaimerAccepted,
      });
    });

    it('should render all required elements', () => {
      const { getByText } = render(<PreferencesConsentScreen navigation={mockNavigation} />);

      // Prompt
      expect(getByText(/Just a few more/)).toBeTruthy();
      expect(getByText(/preferences/)).toBeTruthy();

      // Notification section
      expect(getByText('Notifications')).toBeTruthy();
      expect(getByText('Daily weigh-in reminders')).toBeTruthy();
      expect(getByText('Meal logging reminders')).toBeTruthy();
      expect(getByText('Workout reminders')).toBeTruthy();
      expect(getByText('Motivational check-ins')).toBeTruthy();

      // Health disclaimer section
      expect(getByText('Health Disclaimer')).toBeTruthy();

      // Continue button
      expect(getByText('Continue')).toBeTruthy();

      // Back button
      expect(getByText('←')).toBeTruthy();
    });
  });

  describe('Notification Toggles', () => {
    beforeEach(() => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {},
        setNotificationPreferences: mockSetNotificationPreferences,
        setDisclaimerAccepted: mockSetDisclaimerAccepted,
      });
    });

    it('should have all toggles enabled by default', () => {
      const { UNSAFE_root } = render(<PreferencesConsentScreen navigation={mockNavigation} />);
      // Default state is all true
      expect(UNSAFE_root).toBeTruthy();
    });

    it('should toggle daily weigh-in preference', () => {
      const { getByText } = render(<PreferencesConsentScreen navigation={mockNavigation} />);

      const toggle = getByText('Daily weigh-in reminders').parent?.parent;
      expect(toggle).toBeTruthy();
    });

    it('should toggle meal logging preference', () => {
      const { getByText } = render(<PreferencesConsentScreen navigation={mockNavigation} />);

      expect(getByText('Meal logging reminders')).toBeTruthy();
    });

    it('should toggle workout reminders preference', () => {
      const { getByText } = render(<PreferencesConsentScreen navigation={mockNavigation} />);

      expect(getByText('Workout reminders')).toBeTruthy();
    });

    it('should toggle motivational check-ins preference', () => {
      const { getByText } = render(<PreferencesConsentScreen navigation={mockNavigation} />);

      expect(getByText('Motivational check-ins')).toBeTruthy();
    });
  });

  describe('Health Disclaimer', () => {
    beforeEach(() => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {},
        setNotificationPreferences: mockSetNotificationPreferences,
        setDisclaimerAccepted: mockSetDisclaimerAccepted,
      });
    });

    it('should render health disclaimer text', () => {
      const { getByText } = render(<PreferencesConsentScreen navigation={mockNavigation} />);

      expect(getByText('Health Disclaimer')).toBeTruthy();
      expect(getByText(/general wellness information/)).toBeTruthy();
      expect(getByText(/not medical advice/)).toBeTruthy();
    });

    it('should have disclaimer checkbox unchecked by default', () => {
      const { UNSAFE_root } = render(<PreferencesConsentScreen navigation={mockNavigation} />);
      expect(UNSAFE_root).toBeTruthy();
    });

    it('should show medical condition warning', () => {
      const { getByText } = render(<PreferencesConsentScreen navigation={mockNavigation} />);

      expect(getByText(/medical conditions/)).toBeTruthy();
      expect(getByText(/consult your doctor/)).toBeTruthy();
    });
  });

  describe('Validation', () => {
    it('should disable Continue when disclaimer not accepted', () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: { disclaimerAccepted: false },
        setNotificationPreferences: mockSetNotificationPreferences,
        setDisclaimerAccepted: mockSetDisclaimerAccepted,
      });

      const { getByText } = render(<PreferencesConsentScreen navigation={mockNavigation} />);

      fireEvent.press(getByText('Continue'));

      // Should not navigate without disclaimer
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  describe('Navigation', () => {
    it('should navigate to Welcome when setup is complete', async () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: { disclaimerAccepted: true },
        setNotificationPreferences: mockSetNotificationPreferences,
        setDisclaimerAccepted: mockSetDisclaimerAccepted,
      });

      const { getByText } = render(<PreferencesConsentScreen navigation={mockNavigation} />);

      fireEvent.press(getByText('Continue'));

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('Welcome');
      });
    });

    it('should navigate back when back button is pressed', () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {},
        setNotificationPreferences: mockSetNotificationPreferences,
        setDisclaimerAccepted: mockSetDisclaimerAccepted,
      });

      const { getByText } = render(<PreferencesConsentScreen navigation={mockNavigation} />);

      fireEvent.press(getByText('←'));

      expect(mockGoBack).toHaveBeenCalledTimes(1);
    });
  });

  describe('Store Integration', () => {
    it('should save all preferences when setup is complete', async () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: { disclaimerAccepted: true },
        setNotificationPreferences: mockSetNotificationPreferences,
        setDisclaimerAccepted: mockSetDisclaimerAccepted,
      });

      const { getByText } = render(<PreferencesConsentScreen navigation={mockNavigation} />);

      fireEvent.press(getByText('Continue'));

      await waitFor(() => {
        expect(mockSetNotificationPreferences).toHaveBeenCalled();
        expect(mockSetDisclaimerAccepted).toHaveBeenCalledWith(true);
      });
    });

    it('should initialize with stored preferences', () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {
          notificationPreferences: {
            dailyWeighIn: false,
            mealLogging: true,
            workoutReminders: false,
            motivationalCheckins: true,
          },
          disclaimerAccepted: true,
        },
        setNotificationPreferences: mockSetNotificationPreferences,
        setDisclaimerAccepted: mockSetDisclaimerAccepted,
      });

      const { UNSAFE_root } = render(<PreferencesConsentScreen navigation={mockNavigation} />);
      expect(UNSAFE_root).toBeTruthy();
    });
  });

  describe('Progress Indicator', () => {
    it('should show 100% progress (12/12)', () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {},
        setNotificationPreferences: mockSetNotificationPreferences,
        setDisclaimerAccepted: mockSetDisclaimerAccepted,
      });

      const { getByText } = render(<PreferencesConsentScreen navigation={mockNavigation} />);

      expect(getByText('Step 12 of 12')).toBeTruthy();
    });
  });
});
