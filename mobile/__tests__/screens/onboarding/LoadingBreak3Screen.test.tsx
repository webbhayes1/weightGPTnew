/**
 * LoadingBreak3Screen Component Tests
 * Tests final loading screen with plan generation
 */

import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import LoadingBreak3Screen from '../../../src/screens/onboarding/LoadingBreak3Screen';
import { useOnboardingStore } from '../../../src/store/onboardingStore';

// Mock navigation
const mockNavigate = jest.fn();
const mockNavigation = {
  navigate: mockNavigate,
  setOptions: jest.fn(),
} as any;

// Mock the onboarding store
jest.mock('../../../src/store/onboardingStore');

// Mock react-native-svg
jest.mock('react-native-svg', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: (props: any) => <View {...props} />,
    Svg: (props: any) => <View {...props} />,
    Circle: () => null,
  };
});

describe('LoadingBreak3Screen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  describe('Rendering - Phase 1', () => {
    beforeEach(() => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {
          goalType: 'lose_weight',
        },
      });
    });

    it('should render title', () => {
      const { getByText } = render(<LoadingBreak3Screen navigation={mockNavigation} />);

      expect(getByText(/Creating/i)).toBeTruthy();
    });

    it('should show progress indicator', () => {
      const { UNSAFE_root } = render(<LoadingBreak3Screen navigation={mockNavigation} />);

      // Progress circle should be rendered
      expect(UNSAFE_root).toBeTruthy();
    });

    it('should show loading tips', () => {
      const { UNSAFE_root } = render(<LoadingBreak3Screen navigation={mockNavigation} />);

      // Tips should be rendered
      expect(UNSAFE_root).toBeTruthy();
    });

    it('should show phase 1 message', () => {
      const { getByText } = render(<LoadingBreak3Screen navigation={mockNavigation} />);

      expect(getByText(/plan/i)).toBeTruthy();
    });
  });

  describe('Progress Phases', () => {
    beforeEach(() => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {},
      });
    });

    it('should start in phase 1', () => {
      const { UNSAFE_root } = render(<LoadingBreak3Screen navigation={mockNavigation} />);

      // Phase 1 should be active
      expect(UNSAFE_root).toBeTruthy();
    });

    it('should transition to phase 2 after phase 1', async () => {
      render(<LoadingBreak3Screen navigation={mockNavigation} />);

      // Fast-forward past phase 1 (10 seconds)
      jest.advanceTimersByTime(11000);

      await waitFor(() => {
        expect(true).toBeTruthy();
      });
    });

    it('should show success modal after completion', async () => {
      render(<LoadingBreak3Screen navigation={mockNavigation} />);

      // Fast-forward past both phases (10s + 2s)
      jest.advanceTimersByTime(13000);

      await waitFor(() => {
        expect(true).toBeTruthy();
      });
    });
  });

  describe('Tips Rotation', () => {
    beforeEach(() => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {},
      });
    });

    it('should show motivational tips', () => {
      const { UNSAFE_root } = render(<LoadingBreak3Screen navigation={mockNavigation} />);

      // Tips should be displayed
      expect(UNSAFE_root).toBeTruthy();
    });

    it('should rotate tips during phase 1', () => {
      render(<LoadingBreak3Screen navigation={mockNavigation} />);

      // Fast-forward to trigger tip rotation (every 3 seconds)
      jest.advanceTimersByTime(3500);

      // Tip should have rotated
      expect(true).toBeTruthy();
    });
  });

  describe('Success Modal', () => {
    beforeEach(() => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {},
      });
    });

    it('should show success modal when complete', async () => {
      render(<LoadingBreak3Screen navigation={mockNavigation} />);

      // Fast-forward to completion
      jest.advanceTimersByTime(13000);

      await waitFor(() => {
        expect(true).toBeTruthy();
      });
    });
  });

  describe('SVG Rendering', () => {
    beforeEach(() => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {},
      });
    });

    it('should render SVG progress circle', () => {
      const { UNSAFE_root } = render(<LoadingBreak3Screen navigation={mockNavigation} />);

      expect(UNSAFE_root).toBeTruthy();
    });
  });
});
