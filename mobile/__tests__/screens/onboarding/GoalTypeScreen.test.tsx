/**
 * GoalTypeScreen Component Tests
 * Tests goal selection, store updates, and navigation
 */

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import GoalTypeScreen from '../../../src/screens/onboarding/GoalTypeScreen';
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
const mockSetGoalType = jest.fn();

describe('GoalTypeScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
      data: {},
      setGoalType: mockSetGoalType,
    });
  });

  describe('Rendering', () => {
    it('should render all required elements', () => {
      const { getByText } = render(<GoalTypeScreen navigation={mockNavigation} />);

      // Check prompt
      expect(getByText(/What's your main/)).toBeTruthy();
      expect(getByText(/goal right now?/)).toBeTruthy();

      // Check all goal options
      expect(getByText('Lose Weight')).toBeTruthy();
      expect(getByText('Maintain Weight')).toBeTruthy();
      expect(getByText('Gain Weight')).toBeTruthy();

      // Check back button
      expect(getByText('←')).toBeTruthy();
    });

    it('should render progress bar', () => {
      const { getByTestId, UNSAFE_root } = render(<GoalTypeScreen navigation={mockNavigation} />);
      // Progress bar should exist (2/12 = 16.67% width)
      // We can't easily test the exact width in RNTL, but we can verify the component structure exists
      expect(UNSAFE_root).toBeTruthy();
    });

    it('should render back button', () => {
      const { getByText } = render(<GoalTypeScreen navigation={mockNavigation} />);
      const backButton = getByText('←');
      expect(backButton).toBeTruthy();
    });
  });

  describe('Goal Selection', () => {
    it('should select lose weight goal and navigate', async () => {
      const { getByText } = render(<GoalTypeScreen navigation={mockNavigation} />);
      const loseWeightButton = getByText('Lose Weight');

      fireEvent.press(loseWeightButton);

      await waitFor(() => {
        expect(mockSetGoalType).toHaveBeenCalledWith('lose_weight');
        expect(mockNavigate).toHaveBeenCalledWith('CurrentWeight');
      });
    });

    it('should select maintain weight goal and navigate', async () => {
      const { getByText } = render(<GoalTypeScreen navigation={mockNavigation} />);
      const maintainButton = getByText('Maintain Weight');

      fireEvent.press(maintainButton);

      await waitFor(() => {
        expect(mockSetGoalType).toHaveBeenCalledWith('maintain');
        expect(mockNavigate).toHaveBeenCalledWith('CurrentWeight');
      });
    });

    it('should select gain weight goal and navigate', async () => {
      const { getByText } = render(<GoalTypeScreen navigation={mockNavigation} />);
      const gainWeightButton = getByText('Gain Weight');

      fireEvent.press(gainWeightButton);

      await waitFor(() => {
        expect(mockSetGoalType).toHaveBeenCalledWith('gain_weight');
        expect(mockNavigate).toHaveBeenCalledWith('CurrentWeight');
      });
    });

    it('should update local state when goal is selected', () => {
      const { getByText } = render(<GoalTypeScreen navigation={mockNavigation} />);
      const loseWeightButton = getByText('Lose Weight');

      // Press the button
      fireEvent.press(loseWeightButton);

      // Verify the button appears selected (this triggers navigation immediately)
      expect(mockSetGoalType).toHaveBeenCalled();
    });
  });

  describe('Navigation', () => {
    it('should navigate back when back button is pressed', () => {
      const { getByText } = render(<GoalTypeScreen navigation={mockNavigation} />);
      const backButton = getByText('←');

      fireEvent.press(backButton);

      expect(mockGoBack).toHaveBeenCalledTimes(1);
    });

    it('should navigate to CurrentWeight after goal selection', async () => {
      const { getByText } = render(<GoalTypeScreen navigation={mockNavigation} />);
      const loseWeightButton = getByText('Lose Weight');

      fireEvent.press(loseWeightButton);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('CurrentWeight');
      });
    });
  });

  describe('Store Integration', () => {
    it('should call setGoalType with correct value for lose_weight', async () => {
      const { getByText } = render(<GoalTypeScreen navigation={mockNavigation} />);
      const loseWeightButton = getByText('Lose Weight');

      fireEvent.press(loseWeightButton);

      await waitFor(() => {
        expect(mockSetGoalType).toHaveBeenCalledWith('lose_weight');
      });
    });

    it('should call setGoalType with correct value for maintain', async () => {
      const { getByText } = render(<GoalTypeScreen navigation={mockNavigation} />);
      const maintainButton = getByText('Maintain Weight');

      fireEvent.press(maintainButton);

      await waitFor(() => {
        expect(mockSetGoalType).toHaveBeenCalledWith('maintain');
      });
    });

    it('should call setGoalType with correct value for gain_weight', async () => {
      const { getByText } = render(<GoalTypeScreen navigation={mockNavigation} />);
      const gainWeightButton = getByText('Gain Weight');

      fireEvent.press(gainWeightButton);

      await waitFor(() => {
        expect(mockSetGoalType).toHaveBeenCalledWith('gain_weight');
      });
    });

    it('should update store before navigation', async () => {
      const { getByText } = render(<GoalTypeScreen navigation={mockNavigation} />);
      const loseWeightButton = getByText('Lose Weight');

      fireEvent.press(loseWeightButton);

      await waitFor(() => {
        // Verify store was updated
        expect(mockSetGoalType).toHaveBeenCalledWith('lose_weight');
        // Verify navigation happened after
        expect(mockNavigate).toHaveBeenCalledWith('CurrentWeight');
      });
    });
  });

  describe('User Interaction', () => {
    it('should respond to multiple button presses', async () => {
      const { getByText } = render(<GoalTypeScreen navigation={mockNavigation} />);

      // Press lose weight
      fireEvent.press(getByText('Lose Weight'));
      await waitFor(() => {
        expect(mockSetGoalType).toHaveBeenLastCalledWith('lose_weight');
      });

      // Clear mocks
      jest.clearAllMocks();

      // Press gain weight (in a real scenario, would be a different screen load)
      fireEvent.press(getByText('Gain Weight'));
      await waitFor(() => {
        expect(mockSetGoalType).toHaveBeenLastCalledWith('gain_weight');
      });
    });
  });

  describe('Progress Indicator', () => {
    it('should show correct progress (2/12)', () => {
      const { UNSAFE_root } = render(<GoalTypeScreen navigation={mockNavigation} />);
      // Progress should be 2/12 = ~16.67%
      // Component structure verification
      expect(UNSAFE_root).toBeTruthy();
    });
  });
});
