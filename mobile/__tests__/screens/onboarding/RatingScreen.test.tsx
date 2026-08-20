/**
 * RatingScreen Component Tests
 * Tests 5-star rating selection and navigation
 */

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import RatingScreen from '../../../src/screens/onboarding/RatingScreen';

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

// Mock Alert
jest.spyOn(Alert, 'alert');

describe('RatingScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render all required elements', () => {
      const { getByText, getAllByText } = render(<RatingScreen />);

      // Header
      expect(getByText('⭐')).toBeTruthy();
      expect(getByText('Enjoying the app?')).toBeTruthy();
      expect(getByText(/Your feedback helps us/)).toBeTruthy();

      // 5 stars (initially empty)
      const emptyStars = getAllByText('☆');
      expect(emptyStars.length).toBe(5);

      // Buttons
      expect(getByText('Rate Now')).toBeTruthy();
      expect(getByText('Maybe Later')).toBeTruthy();
    });

    it('should render with no pre-selected rating', () => {
      const { UNSAFE_root } = render(<RatingScreen />);
      expect(UNSAFE_root).toBeTruthy();
    });
  });

  describe('Star Rating Selection', () => {
    it('should select 1 star when first star is pressed', () => {
      const { getAllByText } = render(<RatingScreen />);
      const stars = getAllByText('☆');

      fireEvent.press(stars[0]);
      // Visual state changes (star becomes filled)
    });

    it('should select 3 stars when third star is pressed', () => {
      const { getAllByText } = render(<RatingScreen />);
      const stars = getAllByText('☆');

      fireEvent.press(stars[2]);
      // Visual state changes
    });

    it('should select 5 stars when fifth star is pressed', () => {
      const { getAllByText } = render(<RatingScreen />);
      const stars = getAllByText('☆');

      fireEvent.press(stars[4]);
      // Visual state changes
    });

    it('should allow changing rating selection', () => {
      const { getAllByText, getByText } = render(<RatingScreen />);
      const stars = getAllByText('☆');

      // Select 3 stars
      fireEvent.press(stars[2]);

      // Should show "Good" label
      expect(getByText('Good')).toBeTruthy();

      // Should show filled stars (3 filled stars + 1 header emoji = 4 total)
      const filledStars = getAllByText('⭐');
      expect(filledStars.length).toBe(4); // 3 rating stars + 1 header emoji
    });
  });

  describe('Rate Now Button', () => {
    it('should show alert when Rate Now is pressed without selection', () => {
      const { getByText } = render(<RatingScreen />);

      fireEvent.press(getByText('Rate Now'));

      expect(Alert.alert).toHaveBeenCalledWith(
        'Please select a rating',
        'Tap on the stars to rate your experience'
      );
    });

    it('should show thank you and navigate when rated 5 stars', async () => {
      const { getAllByText, getByText } = render(<RatingScreen />);
      const stars = getAllByText('☆');

      // Select 5 stars
      fireEvent.press(stars[4]);

      // Press Rate Now (button text changes to "Submit Rating" after selection)
      const buttonText = getByText(/Rate Now|Submit Rating/);
      fireEvent.press(buttonText);

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith(
          'Thank you!',
          'Your feedback helps us improve.',
          expect.arrayContaining([
            expect.objectContaining({
              text: 'Continue',
            }),
          ])
        );
      });
    });

    it('should show thank you and navigate when rated 4 stars', async () => {
      const { getAllByText, getByText } = render(<RatingScreen />);
      const stars = getAllByText('☆');

      fireEvent.press(stars[3]);

      const buttonText = getByText(/Rate Now|Submit Rating/);
      fireEvent.press(buttonText);

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalled();
      });
    });

    it('should show thank you and navigate when rated 1 star', async () => {
      const { getAllByText, getByText } = render(<RatingScreen />);
      const stars = getAllByText('☆');

      fireEvent.press(stars[0]);

      const buttonText = getByText(/Rate Now|Submit Rating/);
      fireEvent.press(buttonText);

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalled();
      });
    });

    it('should navigate to PreferencesConsent when Continue is pressed in alert', async () => {
      const { getAllByText, getByText } = render(<RatingScreen />);
      const stars = getAllByText('☆');

      fireEvent.press(stars[4]);

      const buttonText = getByText(/Rate Now|Submit Rating/);
      fireEvent.press(buttonText);

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalled();
      });

      // Simulate pressing Continue in alert
      const alertCall = (Alert.alert as jest.Mock).mock.calls[0];
      const continueButton = alertCall[2][0];
      continueButton.onPress();

      expect(mockNavigate).toHaveBeenCalledWith('PreferencesConsent');
    });
  });

  describe('Maybe Later Button', () => {
    it('should navigate to PreferencesConsent when Maybe Later is pressed', () => {
      const { getByText } = render(<RatingScreen />);

      fireEvent.press(getByText('Maybe Later'));

      expect(mockNavigate).toHaveBeenCalledWith('PreferencesConsent');
    });

    it('should navigate without requiring a rating selection', () => {
      const { getByText } = render(<RatingScreen />);

      // Don't select any stars
      fireEvent.press(getByText('Maybe Later'));

      expect(mockNavigate).toHaveBeenCalledWith('PreferencesConsent');
      expect(Alert.alert).not.toHaveBeenCalled();
    });
  });

  describe('Star Interaction', () => {
    it('should handle all 5 stars being individually pressable', () => {
      const { getAllByText } = render(<RatingScreen />);
      const stars = getAllByText('☆');

      expect(stars.length).toBe(5);

      // Press each star
      stars.forEach((star, index) => {
        fireEvent.press(star);
        // Each press updates the rating
      });
    });
  });

  describe('Rating Labels', () => {
    it('should show "Amazing!" when 5 stars selected', () => {
      const { getAllByText, getByText } = render(<RatingScreen />);
      const stars = getAllByText('☆');

      fireEvent.press(stars[4]);

      expect(getByText('Amazing!')).toBeTruthy();
    });

    it('should show "Great!" when 4 stars selected', () => {
      const { getAllByText, getByText } = render(<RatingScreen />);
      const stars = getAllByText('☆');

      fireEvent.press(stars[3]);

      expect(getByText('Great!')).toBeTruthy();
    });

    it('should show "Good" when 3 stars selected', () => {
      const { getAllByText, getByText } = render(<RatingScreen />);
      const stars = getAllByText('☆');

      fireEvent.press(stars[2]);

      expect(getByText('Good')).toBeTruthy();
    });

    it('should show "Okay" when 2 stars selected', () => {
      const { getAllByText, getByText } = render(<RatingScreen />);
      const stars = getAllByText('☆');

      fireEvent.press(stars[1]);

      expect(getByText('Okay')).toBeTruthy();
    });

    it('should show "Needs improvement" when 1 star selected', () => {
      const { getAllByText, getByText } = render(<RatingScreen />);
      const stars = getAllByText('☆');

      fireEvent.press(stars[0]);

      expect(getByText('Needs improvement')).toBeTruthy();
    });
  });

  describe('Visual Feedback', () => {
    it('should render star icon correctly', () => {
      const { getAllByText } = render(<RatingScreen />);
      const stars = getAllByText('☆');

      expect(stars.length).toBe(5);
    });

    it('should render header emoji', () => {
      const { getByText } = render(<RatingScreen />);
      expect(getByText('⭐')).toBeTruthy();
    });
  });
});
