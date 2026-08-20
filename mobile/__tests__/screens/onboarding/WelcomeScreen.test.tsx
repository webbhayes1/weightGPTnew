/**
 * WelcomeScreen Component Tests
 * Tests rendering, navigation, and user interactions
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import WelcomeScreen from '../../../src/screens/onboarding/WelcomeScreen';

// Mock navigation
const mockNavigate = jest.fn();
const mockNavigation = {
  navigate: mockNavigate,
  goBack: jest.fn(),
  setOptions: jest.fn(),
} as any;

describe('WelcomeScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render all required elements', () => {
      const { getByText } = render(<WelcomeScreen navigation={mockNavigation} />);

      // Check branding
      expect(getByText('WeightGPT')).toBeTruthy();
      expect(getByText('W')).toBeTruthy();

      // Check main prompt
      expect(getByText(/Let's build your/)).toBeTruthy();
      expect(getByText(/perfect plan/)).toBeTruthy();

      // Check supporting text
      expect(getByText(/Personalized nutrition and workouts/)).toBeTruthy();
      expect(getByText(/designed just for you/)).toBeTruthy();

      // Check footer
      expect(getByText('Takes about 2 minutes')).toBeTruthy();

      // Check CTA button
      expect(getByText('Start')).toBeTruthy();
    });

    it('should render the app logo with correct letter', () => {
      const { getByText } = render(<WelcomeScreen navigation={mockNavigation} />);
      const logoLetter = getByText('W');
      expect(logoLetter).toBeTruthy();
    });

    it('should have a Start button', () => {
      const { getByText } = render(<WelcomeScreen navigation={mockNavigation} />);
      const button = getByText('Start');
      expect(button).toBeTruthy();
    });
  });

  describe('Navigation', () => {
    it('should navigate to GoalType screen when Start button is pressed', () => {
      const { getByText } = render(<WelcomeScreen navigation={mockNavigation} />);
      const startButton = getByText('Start');

      fireEvent.press(startButton);

      expect(mockNavigate).toHaveBeenCalledTimes(1);
      expect(mockNavigate).toHaveBeenCalledWith('GoalType');
    });

    it('should call navigate with correct parameter', () => {
      const { getByText } = render(<WelcomeScreen navigation={mockNavigation} />);
      const startButton = getByText('Start');

      fireEvent.press(startButton);

      expect(mockNavigate).toHaveBeenCalledWith('GoalType');
    });
  });

  describe('User Interaction', () => {
    it('should be responsive to button press', () => {
      const { getByText } = render(<WelcomeScreen navigation={mockNavigation} />);
      const startButton = getByText('Start');

      // Press multiple times to ensure responsiveness
      fireEvent.press(startButton);
      fireEvent.press(startButton);

      expect(mockNavigate).toHaveBeenCalledTimes(2);
    });
  });

  describe('Content Accuracy', () => {
    it('should display correct time estimate', () => {
      const { getByText } = render(<WelcomeScreen navigation={mockNavigation} />);
      expect(getByText('Takes about 2 minutes')).toBeTruthy();
    });

    it('should display correct app name', () => {
      const { getByText } = render(<WelcomeScreen navigation={mockNavigation} />);
      expect(getByText('WeightGPT')).toBeTruthy();
    });

    it('should display correct main prompt text', () => {
      const { getByText } = render(<WelcomeScreen navigation={mockNavigation} />);
      expect(getByText(/Let's build your/)).toBeTruthy();
      expect(getByText(/perfect plan/)).toBeTruthy();
    });

    it('should display correct supporting text', () => {
      const { getByText } = render(<WelcomeScreen navigation={mockNavigation} />);
      expect(getByText(/Personalized nutrition and workouts/)).toBeTruthy();
      expect(getByText(/designed just for you/)).toBeTruthy();
    });
  });
});
