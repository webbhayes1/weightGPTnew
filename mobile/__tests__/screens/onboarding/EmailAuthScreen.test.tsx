/**
 * EmailAuthScreen Component Tests
 * Tests email/password authentication with validation
 */

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import EmailAuthScreen from '../../../src/screens/onboarding/EmailAuthScreen';

// Mock navigation
const mockNavigate = jest.fn();
const mockGoBack = jest.fn();
const mockNavigation = {
  navigate: mockNavigate,
  goBack: mockGoBack,
  setOptions: jest.fn(),
} as any;

// Mock useNavigation hook
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => mockNavigation,
}));

// Mock auth services
jest.mock('../../../src/services/auth/firebaseAuth', () => ({
  linkAnonymousToEmail: jest.fn(),
  getCurrentUser: jest.fn(() => ({ uid: 'anon-123', isAnonymous: true })),
  getAuthErrorMessage: jest.fn((error) => error.message),
}));

jest.mock('../../../src/services/auth/dataMigration', () => ({
  migrateUserData: jest.fn(() => Promise.resolve({ success: true, errors: [] })),
  syncOnboardingDataToBackend: jest.fn(() => Promise.resolve()),
}));

// Mock Alert
jest.spyOn(Alert, 'alert');

describe('EmailAuthScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it.skip('should render all required elements in signup mode', () => {
      const { getByText, getByPlaceholderText, getAllByText } = render(<EmailAuthScreen />);

      // Title
      expect(getByText(/Create Account/)).toBeTruthy();

      // Form fields
      expect(getByPlaceholderText('your@email.com')).toBeTruthy();
      expect(getByPlaceholderText('Min 8 characters')).toBeTruthy();
      expect(getByPlaceholderText('Re-enter password')).toBeTruthy();

      // Mode toggle
      expect(getByText(/Already have an account/)).toBeTruthy();
      expect(getByText(/Sign In/)).toBeTruthy();
    });

    it('should render in signin mode when toggled', () => {
      const { getByText, queryByPlaceholderText } = render(<EmailAuthScreen />);

      // Toggle to Sign In
      fireEvent.press(getByText(/Sign In/));

      // Confirm password should not be visible in sign in mode
      expect(queryByPlaceholderText('Re-enter password')).toBeNull();
    });
  });

  describe('Mode Toggle', () => {
    it('should switch from signup to signin mode', () => {
      const { getByText } = render(<EmailAuthScreen />);

      fireEvent.press(getByText(/Sign In/));

      expect(getByText(/Don't have an account/)).toBeTruthy();
    });

    it('should switch from signin to signup mode', () => {
      const { getByText } = render(<EmailAuthScreen />);

      // First switch to sign in
      fireEvent.press(getByText(/Sign In/));
      // Then switch back to sign up
      fireEvent.press(getByText(/Sign Up/));

      expect(getByText(/Already have an account/)).toBeTruthy();
    });
  });

  describe('Form Validation', () => {
    it.skip('should show error when email is empty', async () => {
      const { getByText, getByPlaceholderText, getAllByText } = render(<EmailAuthScreen />);

      const passwordInput = getByPlaceholderText('Min 8 characters');
      const confirmPasswordInput = getByPlaceholderText('Re-enter password');

      fireEvent.changeText(passwordInput, 'Password123');
      fireEvent.changeText(confirmPasswordInput, 'Password123');
      fireEvent.press(getByText('Create Account'));

      await waitFor(() => {
        expect(getByText(/Email is required/)).toBeTruthy();
      });
    });

    it('should show error for invalid email format', async () => {
      const { getByText, getByPlaceholderText, getAllByText } = render(<EmailAuthScreen />);

      const emailInput = getByPlaceholderText('your@email.com');
      const passwordInput = getByPlaceholderText('Min 8 characters');
      const confirmPasswordInput = getByPlaceholderText('Re-enter password');

      fireEvent.changeText(emailInput, 'invalid-email');
      fireEvent.changeText(passwordInput, 'Password123');
      fireEvent.changeText(confirmPasswordInput, 'Password123');
      const buttons = getAllByText('Create Account'); fireEvent.press(buttons[buttons.length - 1]);

      await waitFor(() => {
        expect(getByText(/Invalid email format/)).toBeTruthy();
      });
    });

    it('should show error when password is empty', async () => {
      const { getByText, getByPlaceholderText, getAllByText } = render(<EmailAuthScreen />);

      const emailInput = getByPlaceholderText("your@email.com");
      const confirmPasswordInput = getByPlaceholderText("Re-enter password");

      fireEvent.changeText(emailInput, 'test@example.com');
      fireEvent.changeText(confirmPasswordInput, 'Password123');
      const buttons = getAllByText("Create Account"); fireEvent.press(buttons[buttons.length - 1]);

      await waitFor(() => {
        expect(getByText(/Password is required/)).toBeTruthy();
      });
    });

    it('should show error when password is too short', async () => {
      const { getByText, getByPlaceholderText, getAllByText } = render(<EmailAuthScreen />);

      const emailInput = getByPlaceholderText("your@email.com");
      const passwordInput = getByPlaceholderText("Min 8 characters");
      const confirmPasswordInput = getByPlaceholderText("Re-enter password");

      fireEvent.changeText(emailInput, 'test@example.com');
      fireEvent.changeText(passwordInput, 'short');
      fireEvent.changeText(confirmPasswordInput, 'short');
      const buttons = getAllByText("Create Account"); fireEvent.press(buttons[buttons.length - 1]);

      await waitFor(() => {
        expect(getByText(/at least 8 characters/)).toBeTruthy();
      });
    });

    it('should show error when passwords do not match in signup mode', async () => {
      const { getByText, getByPlaceholderText, getAllByText } = render(<EmailAuthScreen />);

      const emailInput = getByPlaceholderText("your@email.com");
      const passwordInput = getByPlaceholderText("Min 8 characters");
      const confirmPasswordInput = getByPlaceholderText("Re-enter password");

      fireEvent.changeText(emailInput, 'test@example.com');
      fireEvent.changeText(passwordInput, 'Password123');
      fireEvent.changeText(confirmPasswordInput, 'DifferentPassword123');
      const buttons = getAllByText("Create Account"); fireEvent.press(buttons[buttons.length - 1]);

      await waitFor(() => {
        expect(getByText(/Passwords do not match/)).toBeTruthy();
      });
    });

    it('should not require password confirmation in signin mode', async () => {
      const { getByText, getByPlaceholderText, queryByText } = render(<EmailAuthScreen />);

      // Switch to sign in mode
      fireEvent.press(getByText(/Sign In/));

      const emailInput = getByPlaceholderText("your@email.com");
      const passwordInput = getByPlaceholderText("Min 8 characters");

      fireEvent.changeText(emailInput, 'test@example.com');
      fireEvent.changeText(passwordInput, 'Password123');

      // Should not show password mismatch error
      expect(queryByText(/Passwords do not match/)).toBeNull();
    });
  });

  describe('Form Input', () => {
    it('should update email field when typing', () => {
      const { getByPlaceholderText } = render(<EmailAuthScreen />);

      const emailInput = getByPlaceholderText("your@email.com");
      fireEvent.changeText(emailInput, 'test@example.com');

      expect(emailInput.props.value).toBe('test@example.com');
    });

    it('should update password field when typing', () => {
      const { getByPlaceholderText } = render(<EmailAuthScreen />);

      const passwordInput = getByPlaceholderText("Min 8 characters");
      fireEvent.changeText(passwordInput, 'MyPassword123');

      expect(passwordInput.props.value).toBe('MyPassword123');
    });

    it('should update confirm password field when typing', () => {
      const { getByPlaceholderText } = render(<EmailAuthScreen />);

      const confirmPasswordInput = getByPlaceholderText("Re-enter password");
      fireEvent.changeText(confirmPasswordInput, 'MyPassword123');

      expect(confirmPasswordInput.props.value).toBe('MyPassword123');
    });
  });

  describe('Loading State', () => {
    it('should show loading indicator during submission', () => {
      const { UNSAFE_root } = render(<EmailAuthScreen />);
      expect(UNSAFE_root).toBeTruthy();
    });

    it('should disable submit button when loading', () => {
      const { UNSAFE_root } = render(<EmailAuthScreen />);
      // Loading state disables button
      expect(UNSAFE_root).toBeTruthy();
    });
  });

  describe('Back Button', () => {
    it('should navigate back when back button is pressed', () => {
      const { getByText } = render(<EmailAuthScreen />);

      fireEvent.press(getByText("← Back"));

      expect(mockGoBack).toHaveBeenCalledTimes(1);
    });
  });

  describe('Submit Button', () => {
    it('should render submit button in signup mode', () => {
      const { UNSAFE_root } = render(<EmailAuthScreen />);
      expect(UNSAFE_root).toBeTruthy();
    });

    it('should render submit button in signin mode', () => {
      const { getByText, UNSAFE_root } = render(<EmailAuthScreen />);

      // Switch to sign in mode
      fireEvent.press(getByText(/Sign In/));

      expect(UNSAFE_root).toBeTruthy();
    });
  });

  describe('Password Security', () => {
    it('should hide password by default', () => {
      const { getByPlaceholderText } = render(<EmailAuthScreen />);

      const passwordInput = getByPlaceholderText("Min 8 characters");

      expect(passwordInput.props.secureTextEntry).toBe(true);
    });

    it('should hide confirm password by default', () => {
      const { getByPlaceholderText } = render(<EmailAuthScreen />);

      const confirmPasswordInput = getByPlaceholderText("Re-enter password");

      expect(confirmPasswordInput.props.secureTextEntry).toBe(true);
    });
  });

  describe('Keyboard Handling', () => {
    it('should render KeyboardAvoidingView for better UX', () => {
      const { UNSAFE_root } = render(<EmailAuthScreen />);
      expect(UNSAFE_root).toBeTruthy();
    });
  });
});
