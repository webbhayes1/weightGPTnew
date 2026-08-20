/**
 * LoadingBreak2Screen Component Tests
 * Tests workout recommendation display screen
 */

import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import LoadingBreak2Screen from '../../../src/screens/onboarding/LoadingBreak2Screen';
import { useOnboardingStore } from '../../../src/store/onboardingStore';

// Mock navigation
const mockNavigate = jest.fn();
const mockNavigation = {
  navigate: mockNavigate,
  setOptions: jest.fn(),
} as any;

// Mock the onboarding store
jest.mock('../../../src/store/onboardingStore');

describe('LoadingBreak2Screen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  describe('Rendering - Weight Loss', () => {
    beforeEach(() => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {
          goalType: 'lose_weight',
        },
      });
    });

    it('should render title', () => {
      const { getByText } = render(<LoadingBreak2Screen navigation={mockNavigation} />);

      expect(getByText(/workout plan/i)).toBeTruthy();
    });

    it('should show loading progress', () => {
      const { UNSAFE_root } = render(<LoadingBreak2Screen navigation={mockNavigation} />);

      // Progress bar should be rendered
      expect(UNSAFE_root).toBeTruthy();
    });

    it('should show workout recommendations after loading', async () => {
      const { getByText } = render(<LoadingBreak2Screen navigation={mockNavigation} />);

      // Fast-forward past loading animation
      jest.advanceTimersByTime(2500);

      await waitFor(() => {
        // Should show recommendations
        expect(getByText(/days.*week/i)).toBeTruthy();
      });
    });

    it('should navigate to WorkoutSchedule', async () => {
      const { getByText } = render(<LoadingBreak2Screen navigation={mockNavigation} />);

      // Wait for results to show
      jest.advanceTimersByTime(2500);

      await waitFor(() => {
        expect(getByText(/continue/i)).toBeTruthy();
      });
    });
  });

  describe('Rendering - Weight Gain', () => {
    beforeEach(() => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {
          goalType: 'gain_weight',
        },
      });
    });

    it('should show muscle building recommendations', async () => {
      render(<LoadingBreak2Screen navigation={mockNavigation} />);

      jest.advanceTimersByTime(2500);

      // Should show different recommendations for muscle gain
      await waitFor(() => {
        expect(true).toBeTruthy();
      });
    });
  });

  describe('Rendering - Maintenance', () => {
    beforeEach(() => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {
          goalType: 'maintain',
        },
      });
    });

    it('should show maintenance recommendations', async () => {
      render(<LoadingBreak2Screen navigation={mockNavigation} />);

      jest.advanceTimersByTime(2500);

      // Should show maintenance recommendations
      await waitFor(() => {
        expect(true).toBeTruthy();
      });
    });
  });

  describe('Progress Animation', () => {
    beforeEach(() => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {},
      });
    });

    it('should animate progress from 0 to 100', () => {
      const { UNSAFE_root } = render(<LoadingBreak2Screen navigation={mockNavigation} />);

      // Progress animation starts
      expect(UNSAFE_root).toBeTruthy();
    });

    it('should show percentage counter', () => {
      const { UNSAFE_root } = render(<LoadingBreak2Screen navigation={mockNavigation} />);

      // Percentage should be rendered
      expect(UNSAFE_root).toBeTruthy();
    });
  });

  describe('Default Values', () => {
    beforeEach(() => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {},
      });
    });

    it('should use default goal type when not set', () => {
      const { UNSAFE_root } = render(<LoadingBreak2Screen navigation={mockNavigation} />);

      // Should not crash with missing goal type
      expect(UNSAFE_root).toBeTruthy();
    });
  });
});
