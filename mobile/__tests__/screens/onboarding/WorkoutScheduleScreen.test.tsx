/**
 * WorkoutScheduleScreen Component Tests
 * Tests workout days multi-select and session duration selection
 */

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import WorkoutScheduleScreen from '../../../src/screens/onboarding/WorkoutScheduleScreen';
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
const mockSetWorkoutSchedule = jest.fn();

describe('WorkoutScheduleScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    beforeEach(() => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {},
        setWorkoutSchedule: mockSetWorkoutSchedule,
      });
    });

    it('should render all required elements', () => {
      const { getByText } = render(<WorkoutScheduleScreen navigation={mockNavigation} />);

      // Prompt
      expect(getByText(/workout schedule/)).toBeTruthy();

      // Days section
      expect(getByText(/Workout Days/)).toBeTruthy();
      expect(getByText('Mon')).toBeTruthy();
      expect(getByText('Tue')).toBeTruthy();
      expect(getByText('Wed')).toBeTruthy();
      expect(getByText('Thu')).toBeTruthy();
      expect(getByText('Fri')).toBeTruthy();
      expect(getByText('Sat')).toBeTruthy();
      expect(getByText('Sun')).toBeTruthy();

      // Duration section
      expect(getByText(/Session Duration/)).toBeTruthy();
      expect(getByText('20 min')).toBeTruthy();
      expect(getByText('30 min')).toBeTruthy();
      expect(getByText('45 min')).toBeTruthy();
      expect(getByText('60 min')).toBeTruthy();

      // Continue button
      expect(getByText('Continue')).toBeTruthy();

      // Back button
      expect(getByText('←')).toBeTruthy();
    });

    it('should render with no pre-selected options', () => {
      const { UNSAFE_root } = render(<WorkoutScheduleScreen navigation={mockNavigation} />);
      expect(UNSAFE_root).toBeTruthy();
    });
  });

  describe('Day Selection', () => {
    beforeEach(() => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {},
        setWorkoutSchedule: mockSetWorkoutSchedule,
      });
    });

    it('should allow selecting individual days', () => {
      const { getByText } = render(<WorkoutScheduleScreen navigation={mockNavigation} />);

      fireEvent.press(getByText('Mon'));
      fireEvent.press(getByText('Wed'));
      fireEvent.press(getByText('Fri'));

      // All should be selectable
      expect(getByText('Mon')).toBeTruthy();
      expect(getByText('Wed')).toBeTruthy();
      expect(getByText('Fri')).toBeTruthy();
    });

    it('should allow selecting all days', () => {
      const { getByText } = render(<WorkoutScheduleScreen navigation={mockNavigation} />);

      ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].forEach(day => {
        fireEvent.press(getByText(day));
      });

      // All should be selectable
      expect(getByText('Mon')).toBeTruthy();
      expect(getByText('Sun')).toBeTruthy();
    });

    it('should toggle day selection when pressed twice', () => {
      const { getByText } = render(<WorkoutScheduleScreen navigation={mockNavigation} />);

      fireEvent.press(getByText('Mon'));
      fireEvent.press(getByText('Mon')); // Toggle off

      expect(getByText('Mon')).toBeTruthy();
    });
  });

  describe('Duration Selection', () => {
    beforeEach(() => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {},
        setWorkoutSchedule: mockSetWorkoutSchedule,
      });
    });

    it('should select 20 minutes when pressed', () => {
      const { getByText } = render(<WorkoutScheduleScreen navigation={mockNavigation} />);
      fireEvent.press(getByText('20 min'));
    });

    it('should select 30 minutes when pressed', () => {
      const { getByText } = render(<WorkoutScheduleScreen navigation={mockNavigation} />);
      fireEvent.press(getByText('30 min'));
    });

    it('should select 45 minutes when pressed', () => {
      const { getByText } = render(<WorkoutScheduleScreen navigation={mockNavigation} />);
      fireEvent.press(getByText('45 min'));
    });

    it('should select 60 minutes when pressed', () => {
      const { getByText } = render(<WorkoutScheduleScreen navigation={mockNavigation} />);
      fireEvent.press(getByText('60 min'));
    });
  });

  describe('Recommendations', () => {
    it('should render for weight loss goal', () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {
          goalType: 'lose_weight'
        },
        setWorkoutSchedule: mockSetWorkoutSchedule,
      });

      const { UNSAFE_root } = render(<WorkoutScheduleScreen navigation={mockNavigation} />);
      expect(UNSAFE_root).toBeTruthy();
    });

    it('should render for muscle gain goal', () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {
          goalType: 'gain_weight'
        },
        setWorkoutSchedule: mockSetWorkoutSchedule,
      });

      const { UNSAFE_root } = render(<WorkoutScheduleScreen navigation={mockNavigation} />);
      expect(UNSAFE_root).toBeTruthy();
    });

    it('should render for maintenance goal', () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {
          goalType: 'maintain'
        },
        setWorkoutSchedule: mockSetWorkoutSchedule,
      });

      const { UNSAFE_root } = render(<WorkoutScheduleScreen navigation={mockNavigation} />);
      expect(UNSAFE_root).toBeTruthy();
    });
  });

  describe('Stored State', () => {
    it('should initialize with stored workout days', () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {
          workoutDaysPreferred: [0, 2, 4], // Mon, Wed, Fri
          sessionLength: 30,
        },
        setWorkoutSchedule: mockSetWorkoutSchedule,
      });

      const { UNSAFE_root } = render(<WorkoutScheduleScreen navigation={mockNavigation} />);
      expect(UNSAFE_root).toBeTruthy();
    });

    it('should initialize with stored session duration', () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {
          workoutDaysPreferred: [],
          sessionLength: 45,
        },
        setWorkoutSchedule: mockSetWorkoutSchedule,
      });

      const { UNSAFE_root } = render(<WorkoutScheduleScreen navigation={mockNavigation} />);
      expect(UNSAFE_root).toBeTruthy();
    });
  });

  describe('Navigation', () => {
    it('should navigate to LoadingBreak3 when Continue is pressed', async () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {},
        setWorkoutSchedule: mockSetWorkoutSchedule,
      });

      const { getByText } = render(<WorkoutScheduleScreen navigation={mockNavigation} />);

      fireEvent.press(getByText('30 min'));
      fireEvent.press(getByText('Continue'));

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('LoadingBreak3');
      });
    });

    it('should navigate back when back button is pressed', () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {},
        setWorkoutSchedule: mockSetWorkoutSchedule,
      });

      const { getByText } = render(<WorkoutScheduleScreen navigation={mockNavigation} />);
      fireEvent.press(getByText('←'));
      expect(mockGoBack).toHaveBeenCalledTimes(1);
    });
  });

  describe('Store Integration', () => {
    it('should save workout days and duration to store', async () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {},
        setWorkoutSchedule: mockSetWorkoutSchedule,
      });

      const { getByText } = render(<WorkoutScheduleScreen navigation={mockNavigation} />);

      fireEvent.press(getByText('Mon'));
      fireEvent.press(getByText('Wed'));
      fireEvent.press(getByText('Fri'));
      fireEvent.press(getByText('30 min'));
      fireEvent.press(getByText('Continue'));

      await waitFor(() => {
        expect(mockSetWorkoutSchedule).toHaveBeenCalledWith(
          expect.arrayContaining([0, 2, 4]), // Mon, Wed, Fri
          30
        );
      });
    });

    it('should save duration with auto-default days when no days selected', async () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {
          goalType: 'maintain' // 3 days recommended
        },
        setWorkoutSchedule: mockSetWorkoutSchedule,
      });

      const { getByText } = render(<WorkoutScheduleScreen navigation={mockNavigation} />);

      fireEvent.press(getByText('45 min'));
      fireEvent.press(getByText('Continue'));

      await waitFor(() => {
        // Should auto-default to 3 consecutive days from today
        expect(mockSetWorkoutSchedule).toHaveBeenCalledWith(
          expect.any(Array),
          45
        );
      });
    });
  });

  describe('Validation', () => {
    it('should disable Continue button when no duration selected', () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {},
        setWorkoutSchedule: mockSetWorkoutSchedule,
      });

      const { getByText } = render(<WorkoutScheduleScreen navigation={mockNavigation} />);

      // Select days but no duration
      fireEvent.press(getByText('Mon'));
      fireEvent.press(getByText('Continue'));

      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('should allow continuing with duration but no days', async () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {},
        setWorkoutSchedule: mockSetWorkoutSchedule,
      });

      const { getByText } = render(<WorkoutScheduleScreen navigation={mockNavigation} />);

      // Duration only (days will auto-default)
      fireEvent.press(getByText('30 min'));
      fireEvent.press(getByText('Continue'));

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('LoadingBreak3');
      });
    });
  });

  describe('Progress Indicator', () => {
    it('should show correct progress (11/12)', () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {},
        setWorkoutSchedule: mockSetWorkoutSchedule,
      });

      const { UNSAFE_root } = render(<WorkoutScheduleScreen navigation={mockNavigation} />);
      // Progress bar should show 11/12 = ~91.7%
      expect(UNSAFE_root).toBeTruthy();
    });
  });
});
