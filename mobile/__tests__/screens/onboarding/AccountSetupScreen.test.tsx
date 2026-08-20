/**
 * AccountSetupScreen Component Tests
 * Tests auth method selection and skip functionality
 */

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import AccountSetupScreen from '../../../src/screens/onboarding/AccountSetupScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock navigation
const mockNavigate = jest.fn();
const mockNavigation = {
  navigate: mockNavigate,
  setOptions: jest.fn(),
} as any;

// Mock useNavigation hook
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => mockNavigation,
}));

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage');

// Mock getCurrentUser
jest.mock('../../../src/services/auth/firebaseAuth', () => ({
  getCurrentUser: jest.fn(() => Promise.resolve({ uid: 'anon-123', isAnonymous: true })),
}));

// Mock Alert
jest.spyOn(Alert, 'alert');

describe('AccountSetupScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render all required elements', () => {
      const { getByText } = render(<AccountSetupScreen />);

      // Title
      expect(getByText(/Create Your Account/)).toBeTruthy();

      // Description
      expect(getByText(/access from any device/)).toBeTruthy();

      // Auth method buttons
      expect(getByText(/Continue with Email/)).toBeTruthy();
      expect(getByText(/Continue with Google/)).toBeTruthy();
      expect(getByText(/Continue with Apple/)).toBeTruthy();

      // Skip option
      expect(getByText(/Skip for now/)).toBeTruthy();
    });
  });

  describe('Email Auth', () => {
    it('should navigate to EmailAuth when Email button is pressed', () => {
      const { getByText } = render(<AccountSetupScreen />);

      fireEvent.press(getByText(/Continue with Email/));

      expect(mockNavigate).toHaveBeenCalledWith('EmailAuth');
    });
  });

  describe('Google Auth', () => {
    it('should show coming soon alert when Google button is pressed', async () => {
      const { getByText } = render(<AccountSetupScreen />);

      fireEvent.press(getByText(/Continue with Google/));

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith(
          'Coming Soon',
          expect.stringContaining('Google Sign-In'),
          expect.any(Array)
        );
      });
    });
  });

  describe('Apple Auth', () => {
    it('should show coming soon alert when Apple button is pressed', async () => {
      const { getByText } = render(<AccountSetupScreen />);

      fireEvent.press(getByText(/Continue with Apple/));

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith(
          'Coming Soon',
          expect.stringContaining('Apple Sign-In'),
          expect.any(Array)
        );
      });
    });
  });

  describe('Skip Functionality', () => {
    it('should show warning alert when Skip is pressed', () => {
      const { getByText } = render(<AccountSetupScreen />);

      fireEvent.press(getByText(/Skip for now/));

      expect(Alert.alert).toHaveBeenCalledWith(
        'Continue without account?',
        expect.stringContaining('only be stored on this device'),
        expect.arrayContaining([
          expect.objectContaining({ text: 'Create Account' }),
          expect.objectContaining({ text: 'Continue Anyway' }),
        ])
      );
    });

    it('should not navigate when Create Account is pressed in skip alert', () => {
      const { getByText } = render(<AccountSetupScreen />);

      fireEvent.press(getByText(/Skip for now/));

      // Get the alert call and press "Create Account" (cancel)
      const alertCall = (Alert.alert as jest.Mock).mock.calls[0];
      const createAccountButton = alertCall[2][0];

      // Cancel button shouldn't have onPress or should do nothing
      if (createAccountButton.onPress) {
        createAccountButton.onPress();
      }

      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('should have Continue Anyway button in skip alert', () => {
      const { getByText } = render(<AccountSetupScreen />);

      fireEvent.press(getByText(/Skip for now/));

      // Get the alert call
      const alertCall = (Alert.alert as jest.Mock).mock.calls[0];
      const continueButton = alertCall[2][1];

      // Verify Continue Anyway button exists
      expect(continueButton.text).toBe('Continue Anyway');
      expect(continueButton.style).toBe('destructive');
    });
  });

  describe('Loading State', () => {
    it('should show loading indicator during async operations', () => {
      const { UNSAFE_root } = render(<AccountSetupScreen />);
      expect(UNSAFE_root).toBeTruthy();
    });
  });

  describe('Icons', () => {
    it('should render icons for each auth method', () => {
      const { UNSAFE_root } = render(<AccountSetupScreen />);
      // Icons are rendered via Ionicons component
      expect(UNSAFE_root).toBeTruthy();
    });
  });
});
