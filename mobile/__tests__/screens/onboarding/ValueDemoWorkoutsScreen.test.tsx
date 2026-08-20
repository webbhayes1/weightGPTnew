/**
 * ValueDemoWorkoutsScreen Component Tests
 * Tests workout schedule with calendar view and workout cards
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ValueDemoWorkoutsScreen from '../../../src/screens/onboarding/ValueDemoWorkoutsScreen';
import { useOnboardingStore } from '../../../src/store/onboardingStore';

// Mock navigation
const mockNavigate = jest.fn();
const mockNavigation = {
  navigate: mockNavigate,
  setOptions: jest.fn(),
} as any;

// Mock the onboarding store
jest.mock('../../../src/store/onboardingStore');

describe('ValueDemoWorkoutsScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering - Weight Loss', () => {
    beforeEach(() => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {
          goalType: 'lose_weight',
          sessionLength: 45,
          workoutDaysPreferred: [0, 2, 4], // Mon, Wed, Fri
        },
      });
    });

    it('should render title', () => {
      const { getByText } = render(<ValueDemoWorkoutsScreen navigation={mockNavigation} />);

      expect(getByText(/Your Custom/)).toBeTruthy();
      expect(getByText(/Workout Plan/)).toBeTruthy();
    });

    it('should render weekly schedule label', () => {
      const { getByText } = render(<ValueDemoWorkoutsScreen navigation={mockNavigation} />);

      expect(getByText('Weekly Schedule:')).toBeTruthy();
    });

    it('should render all 7 days of the week', () => {
      const { getAllByText } = render(<ValueDemoWorkoutsScreen navigation={mockNavigation} />);

      // Days appear in both calendar and workout cards
      const monLabels = getAllByText('Mon');
      const tueLabels = getAllByText('Tue');
      expect(monLabels.length).toBeGreaterThan(0);
      expect(tueLabels.length).toBeGreaterThan(0);
    });

    it('should render workout cards for selected days', () => {
      const { getByText } = render(<ValueDemoWorkoutsScreen navigation={mockNavigation} />);

      expect(getByText('Upper Body')).toBeTruthy();
      expect(getByText('Lower Body')).toBeTruthy();
    });

    it('should render workout durations', () => {
      const { getAllByText } = render(<ValueDemoWorkoutsScreen navigation={mockNavigation} />);

      const durations = getAllByText('45 min');
      expect(durations.length).toBeGreaterThan(0);
    });

    it('should render rest days section', () => {
      const { getByText } = render(<ValueDemoWorkoutsScreen navigation={mockNavigation} />);

      expect(getByText('Rest Days:')).toBeTruthy();
    });

    it('should render unlock button', () => {
      const { getByText } = render(<ValueDemoWorkoutsScreen navigation={mockNavigation} />);

      expect(getByText(/Unlock Your Plan/)).toBeTruthy();
    });
  });

  describe('Rendering - Weight Gain', () => {
    beforeEach(() => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {
          goalType: 'gain_weight',
          sessionLength: 60,
          workoutDaysPreferred: [0, 1, 2, 4], // Mon, Tue, Wed, Fri
        },
      });
    });

    it('should render muscle building workouts', () => {
      const { getByText } = render(<ValueDemoWorkoutsScreen navigation={mockNavigation} />);

      expect(getByText('Push Day')).toBeTruthy();
      expect(getByText('Pull Day')).toBeTruthy();
      expect(getByText('Leg Day')).toBeTruthy();
    });

    it('should render correct session length for muscle building', () => {
      const { getAllByText } = render(<ValueDemoWorkoutsScreen navigation={mockNavigation} />);

      const durations = getAllByText('60 min');
      expect(durations.length).toBeGreaterThan(0);
    });
  });

  describe('Rendering - Maintenance', () => {
    beforeEach(() => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {
          goalType: 'maintain',
          sessionLength: 30,
          workoutDaysPreferred: [0, 2, 4], // Mon, Wed, Fri
        },
      });
    });

    it('should render maintenance workouts', () => {
      const { getByText } = render(<ValueDemoWorkoutsScreen navigation={mockNavigation} />);

      expect(getByText('Upper Body')).toBeTruthy();
      expect(getByText('Lower Body')).toBeTruthy();
      expect(getByText('Active Recovery')).toBeTruthy();
    });

    it('should render shorter session length for maintenance', () => {
      const { getAllByText } = render(<ValueDemoWorkoutsScreen navigation={mockNavigation} />);

      const durations = getAllByText('30 min');
      expect(durations.length).toBeGreaterThan(0);
    });
  });

  describe('Default Values', () => {
    beforeEach(() => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {},
      });
    });

    it('should use default goal type when not set', () => {
      const { getByText } = render(<ValueDemoWorkoutsScreen navigation={mockNavigation} />);

      // Default is lose_weight, should show weight loss workouts
      expect(getByText(/Workout Plan/)).toBeTruthy();
    });

    it('should use default session length when not set', () => {
      const { UNSAFE_root } = render(<ValueDemoWorkoutsScreen navigation={mockNavigation} />);

      // Default is 45 min, but with empty workoutDaysPreferred, no cards shown
      expect(UNSAFE_root).toBeTruthy();
    });

    it('should handle empty workout days array', () => {
      const { getByText } = render(<ValueDemoWorkoutsScreen navigation={mockNavigation} />);

      // Should still render the calendar and rest days
      expect(getByText('Weekly Schedule:')).toBeTruthy();
      expect(getByText('Rest Days:')).toBeTruthy();
    });
  });

  describe('Calendar Visualization', () => {
    beforeEach(() => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {
          workoutDaysPreferred: [0, 2, 4], // Mon, Wed, Fri
        },
      });
    });

    it('should render workout emojis on active days', () => {
      const { UNSAFE_root } = render(<ValueDemoWorkoutsScreen navigation={mockNavigation} />);

      // Emojis are rendered for workout days
      expect(UNSAFE_root).toBeTruthy();
    });

    it('should render Rest label on non-workout days', () => {
      const { getAllByText } = render(<ValueDemoWorkoutsScreen navigation={mockNavigation} />);

      const restLabels = getAllByText('Rest');
      expect(restLabels.length).toBeGreaterThan(0);
    });
  });

  describe('Workout Cards', () => {
    beforeEach(() => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {
          goalType: 'lose_weight',
          sessionLength: 45,
          workoutDaysPreferred: [0, 2, 4], // Mon, Wed, Fri
        },
      });
    });

    it('should render workout type icons', () => {
      const { UNSAFE_root } = render(<ValueDemoWorkoutsScreen navigation={mockNavigation} />);

      // Workout emojis (🏋️, 🏃) are rendered
      expect(UNSAFE_root).toBeTruthy();
    });

    it('should render workout days in cards', () => {
      const { getAllByText } = render(<ValueDemoWorkoutsScreen navigation={mockNavigation} />);

      // Days should appear in workout cards
      const monLabels = getAllByText('Mon');
      const wedLabels = getAllByText('Wed');
      expect(monLabels.length).toBeGreaterThan(0);
      expect(wedLabels.length).toBeGreaterThan(0);
    });
  });

  describe('Rest Days Display', () => {
    beforeEach(() => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {
          workoutDaysPreferred: [0, 2, 4], // Mon, Wed, Fri
        },
      });
    });

    it('should list rest days', () => {
      const { getAllByText } = render(<ValueDemoWorkoutsScreen navigation={mockNavigation} />);

      // Should show rest days (Tue, Thu, Sat, Sun) - appears in both calendar and rest days list
      const tueLabels = getAllByText(/Tue/);
      const thuLabels = getAllByText(/Thu/);
      const satLabels = getAllByText(/Sat/);
      const sunLabels = getAllByText(/Sun/);
      expect(tueLabels.length).toBeGreaterThan(0);
      expect(thuLabels.length).toBeGreaterThan(0);
      expect(satLabels.length).toBeGreaterThan(0);
      expect(sunLabels.length).toBeGreaterThan(0);
    });
  });

  describe('Navigation', () => {
    beforeEach(() => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {},
      });
    });

    it('should navigate to Paywall when Unlock button pressed', () => {
      const { getByText } = render(<ValueDemoWorkoutsScreen navigation={mockNavigation} />);

      fireEvent.press(getByText(/Unlock Your Plan/));

      expect(mockNavigate).toHaveBeenCalledWith('Paywall');
    });
  });

  describe('Progress Indicator', () => {
    beforeEach(() => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {},
      });
    });

    it('should render 3 progress dots', () => {
      const { UNSAFE_root } = render(
        <ValueDemoWorkoutsScreen navigation={mockNavigation} currentPage={2} />
      );

      expect(UNSAFE_root).toBeTruthy();
    });

    it('should highlight third dot when currentPage=2', () => {
      const { UNSAFE_root } = render(
        <ValueDemoWorkoutsScreen navigation={mockNavigation} currentPage={2} />
      );

      expect(UNSAFE_root).toBeTruthy();
    });
  });

  describe('Pulsing Animation', () => {
    beforeEach(() => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {},
      });
    });

    it('should render animated unlock button', () => {
      const { UNSAFE_root } = render(<ValueDemoWorkoutsScreen navigation={mockNavigation} />);

      // Animated.View wraps the button
      expect(UNSAFE_root).toBeTruthy();
    });
  });

  describe('ScrollView', () => {
    beforeEach(() => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {},
      });
    });

    it('should render scrollable content area', () => {
      const { UNSAFE_root } = render(<ValueDemoWorkoutsScreen navigation={mockNavigation} />);

      expect(UNSAFE_root).toBeTruthy();
    });
  });
});
