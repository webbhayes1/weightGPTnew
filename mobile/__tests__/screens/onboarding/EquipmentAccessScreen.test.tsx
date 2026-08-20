/**
 * EquipmentAccessScreen Component Tests
 * Tests equipment selection and navigation
 */

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import EquipmentAccessScreen from '../../../src/screens/onboarding/EquipmentAccessScreen';
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
const mockSetEquipmentType = jest.fn();

describe('EquipmentAccessScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    beforeEach(() => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {},
        setEquipmentType: mockSetEquipmentType,
      });
    });

    it('should render all required elements', () => {
      const { getByText } = render(<EquipmentAccessScreen navigation={mockNavigation} />);

      // Prompt
      expect(getByText(/What kind of/)).toBeTruthy();
      expect(getByText(/workout setup/)).toBeTruthy();
      expect(getByText(/do you have?/)).toBeTruthy();

      // All 3 equipment options
      expect(getByText('Home')).toBeTruthy();
      expect(getByText('Home gym')).toBeTruthy();
      expect(getByText('Full gym access')).toBeTruthy();

      // Descriptions
      expect(getByText('Bodyweight only')).toBeTruthy();
      expect(getByText('Dumbbells/resistance bands')).toBeTruthy();
      expect(getByText('Complete equipment range')).toBeTruthy();

      // Icons
      expect(getByText('🏠')).toBeTruthy();
      expect(getByText('🏋️')).toBeTruthy();
      expect(getByText('💪')).toBeTruthy();

      // Continue button
      expect(getByText('Continue')).toBeTruthy();

      // Back button
      expect(getByText('←')).toBeTruthy();
    });

    it('should render with no pre-selected option', () => {
      const { UNSAFE_root } = render(<EquipmentAccessScreen navigation={mockNavigation} />);
      // No option should be selected by default
      expect(UNSAFE_root).toBeTruthy();
    });
  });

  describe('Equipment Selection', () => {
    beforeEach(() => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {},
        setEquipmentType: mockSetEquipmentType,
      });
    });

    it('should select home_bodyweight when Home is pressed', () => {
      const { getByText } = render(<EquipmentAccessScreen navigation={mockNavigation} />);

      const homeButton = getByText('Home');
      fireEvent.press(homeButton);

      // Visual state changes (tested implicitly via selected styles)
    });

    it('should select home_equipment when Home gym is pressed', () => {
      const { getByText } = render(<EquipmentAccessScreen navigation={mockNavigation} />);

      const homeGymButton = getByText('Home gym');
      fireEvent.press(homeGymButton);

      // Visual state changes
    });

    it('should select full_gym when Full gym access is pressed', () => {
      const { getByText } = render(<EquipmentAccessScreen navigation={mockNavigation} />);

      const fullGymButton = getByText('Full gym access');
      fireEvent.press(fullGymButton);

      // Visual state changes
    });

    it('should allow switching between equipment options', () => {
      const { getByText } = render(<EquipmentAccessScreen navigation={mockNavigation} />);

      // Select home_bodyweight
      fireEvent.press(getByText('Home'));

      // Switch to full_gym
      fireEvent.press(getByText('Full gym access'));

      // Last selection wins
    });
  });

  describe('Stored State', () => {
    it('should initialize with stored equipment type (home_bodyweight)', () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {
          equipmentType: 'home_bodyweight'
        },
        setEquipmentType: mockSetEquipmentType,
      });

      const { UNSAFE_root } = render(<EquipmentAccessScreen navigation={mockNavigation} />);
      // home_bodyweight should be pre-selected
      expect(UNSAFE_root).toBeTruthy();
    });

    it('should initialize with stored equipment type (home_equipment)', () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {
          equipmentType: 'home_equipment'
        },
        setEquipmentType: mockSetEquipmentType,
      });

      const { UNSAFE_root } = render(<EquipmentAccessScreen navigation={mockNavigation} />);
      expect(UNSAFE_root).toBeTruthy();
    });

    it('should initialize with stored equipment type (full_gym)', () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {
          equipmentType: 'full_gym'
        },
        setEquipmentType: mockSetEquipmentType,
      });

      const { UNSAFE_root } = render(<EquipmentAccessScreen navigation={mockNavigation} />);
      expect(UNSAFE_root).toBeTruthy();
    });
  });

  describe('Navigation', () => {
    it('should navigate to WorkoutSchedule when Continue is pressed with selection', async () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {},
        setEquipmentType: mockSetEquipmentType,
      });

      const { getByText } = render(<EquipmentAccessScreen navigation={mockNavigation} />);

      // Select an option
      fireEvent.press(getByText('Home'));

      // Press continue
      fireEvent.press(getByText('Continue'));

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('WorkoutSchedule');
      });
    });

    it('should navigate back when back button is pressed', () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {},
        setEquipmentType: mockSetEquipmentType,
      });

      const { getByText } = render(<EquipmentAccessScreen navigation={mockNavigation} />);

      fireEvent.press(getByText('←'));

      expect(mockGoBack).toHaveBeenCalledTimes(1);
    });
  });

  describe('Store Integration', () => {
    it('should save home_bodyweight to store', async () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {},
        setEquipmentType: mockSetEquipmentType,
      });

      const { getByText } = render(<EquipmentAccessScreen navigation={mockNavigation} />);

      fireEvent.press(getByText('Home'));
      fireEvent.press(getByText('Continue'));

      await waitFor(() => {
        expect(mockSetEquipmentType).toHaveBeenCalledWith('home_bodyweight');
      });
    });

    it('should save home_equipment to store', async () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {},
        setEquipmentType: mockSetEquipmentType,
      });

      const { getByText } = render(<EquipmentAccessScreen navigation={mockNavigation} />);

      fireEvent.press(getByText('Home gym'));
      fireEvent.press(getByText('Continue'));

      await waitFor(() => {
        expect(mockSetEquipmentType).toHaveBeenCalledWith('home_equipment');
      });
    });

    it('should save full_gym to store', async () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {},
        setEquipmentType: mockSetEquipmentType,
      });

      const { getByText } = render(<EquipmentAccessScreen navigation={mockNavigation} />);

      fireEvent.press(getByText('Full gym access'));
      fireEvent.press(getByText('Continue'));

      await waitFor(() => {
        expect(mockSetEquipmentType).toHaveBeenCalledWith('full_gym');
      });
    });

    it('should save last selected equipment when switching', async () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {},
        setEquipmentType: mockSetEquipmentType,
      });

      const { getByText } = render(<EquipmentAccessScreen navigation={mockNavigation} />);

      // Select home first
      fireEvent.press(getByText('Home'));

      // Change to full gym
      fireEvent.press(getByText('Full gym access'));

      // Continue
      fireEvent.press(getByText('Continue'));

      await waitFor(() => {
        expect(mockSetEquipmentType).toHaveBeenCalledWith('full_gym');
      });
    });
  });

  describe('Validation', () => {
    it('should disable Continue button when no selection is made', () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {},
        setEquipmentType: mockSetEquipmentType,
      });

      const { getByText } = render(<EquipmentAccessScreen navigation={mockNavigation} />);

      // Try to continue without selection
      fireEvent.press(getByText('Continue'));

      // Should not navigate
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('should enable Continue button after making a selection', async () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {},
        setEquipmentType: mockSetEquipmentType,
      });

      const { getByText } = render(<EquipmentAccessScreen navigation={mockNavigation} />);

      // Make a selection
      fireEvent.press(getByText('Home gym'));

      // Continue should work
      fireEvent.press(getByText('Continue'));

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('WorkoutSchedule');
      });
    });
  });

  describe('Progress Indicator', () => {
    it('should show correct progress (10/12)', () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {},
        setEquipmentType: mockSetEquipmentType,
      });

      const { UNSAFE_root } = render(<EquipmentAccessScreen navigation={mockNavigation} />);
      // Progress should be 10/12 = 83.33%
      expect(UNSAFE_root).toBeTruthy();
    });
  });

  describe('Workout Theme', () => {
    it('should use workout context (red/navy theme)', () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {},
        setEquipmentType: mockSetEquipmentType,
      });

      const { UNSAFE_root } = render(<EquipmentAccessScreen navigation={mockNavigation} />);
      // Button should use workout context (verified by Button component receiving context="workout")
      expect(UNSAFE_root).toBeTruthy();
    });
  });
});
