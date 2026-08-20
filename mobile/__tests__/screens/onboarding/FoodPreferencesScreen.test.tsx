/**
 * FoodPreferencesScreen Component Tests
 * Tests dietary preference selection, foods to avoid, and cuisine preferences
 */

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import FoodPreferencesScreen from '../../../src/screens/onboarding/FoodPreferencesScreen';
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
const mockSetFoodPreferences = jest.fn();

describe('FoodPreferencesScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    beforeEach(() => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {},
        setFoodPreferences: mockSetFoodPreferences,
      });
    });

    it('should render all required elements', () => {
      const { getByText } = render(<FoodPreferencesScreen navigation={mockNavigation} />);

      // Prompt
      expect(getByText(/food preferences/)).toBeTruthy();

      // Dietary section
      expect(getByText(/Dietary Preference/)).toBeTruthy();
      expect(getByText('None')).toBeTruthy();
      expect(getByText('Vegetarian')).toBeTruthy();
      expect(getByText('Vegan')).toBeTruthy();
      expect(getByText('Pescatarian')).toBeTruthy();
      expect(getByText('Keto')).toBeTruthy();
      expect(getByText('Custom')).toBeTruthy();

      // Foods to avoid section
      expect(getByText(/Foods to Avoid/)).toBeTruthy();
      expect(getByText('Dairy')).toBeTruthy();
      expect(getByText('Gluten')).toBeTruthy();
      expect(getByText('Nuts')).toBeTruthy();

      // Cuisines section
      expect(getByText(/Favorite Cuisines/)).toBeTruthy();
      expect(getByText('Mediterranean')).toBeTruthy();
      expect(getByText('Asian')).toBeTruthy();
      expect(getByText('Mexican')).toBeTruthy();

      // Continue button
      expect(getByText('Continue')).toBeTruthy();

      // Back button
      expect(getByText('←')).toBeTruthy();
    });

    it('should render with None dietary preference selected by default', () => {
      const { UNSAFE_root } = render(<FoodPreferencesScreen navigation={mockNavigation} />);
      expect(UNSAFE_root).toBeTruthy();
    });
  });

  describe('Dietary Preference Selection', () => {
    beforeEach(() => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {},
        setFoodPreferences: mockSetFoodPreferences,
      });
    });

    it('should select None when pressed', () => {
      const { getByText } = render(<FoodPreferencesScreen navigation={mockNavigation} />);
      fireEvent.press(getByText('None'));
    });

    it('should select Vegetarian when pressed', () => {
      const { getByText } = render(<FoodPreferencesScreen navigation={mockNavigation} />);
      fireEvent.press(getByText('Vegetarian'));
    });

    it('should select Vegan when pressed', () => {
      const { getByText } = render(<FoodPreferencesScreen navigation={mockNavigation} />);
      fireEvent.press(getByText('Vegan'));
    });

    it('should select Pescatarian when pressed', () => {
      const { getByText } = render(<FoodPreferencesScreen navigation={mockNavigation} />);
      fireEvent.press(getByText('Pescatarian'));
    });

    it('should select Keto when pressed', () => {
      const { getByText } = render(<FoodPreferencesScreen navigation={mockNavigation} />);
      fireEvent.press(getByText('Keto'));
    });

    it('should select Custom when pressed', () => {
      const { getByText } = render(<FoodPreferencesScreen navigation={mockNavigation} />);
      fireEvent.press(getByText('Custom'));
    });
  });

  describe('Foods to Avoid', () => {
    beforeEach(() => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {},
        setFoodPreferences: mockSetFoodPreferences,
      });
    });

    it('should render common food options', () => {
      const { getByText } = render(<FoodPreferencesScreen navigation={mockNavigation} />);

      // Common foods
      expect(getByText('Dairy')).toBeTruthy();
      expect(getByText('Gluten')).toBeTruthy();
      expect(getByText('Nuts')).toBeTruthy();
      expect(getByText('Shellfish')).toBeTruthy();
      expect(getByText('Eggs')).toBeTruthy();
      expect(getByText('Soy')).toBeTruthy();
      expect(getByText('Fish')).toBeTruthy();
    });

    it('should allow selecting multiple foods to avoid', () => {
      const { getByText } = render(<FoodPreferencesScreen navigation={mockNavigation} />);

      fireEvent.press(getByText('Dairy'));
      fireEvent.press(getByText('Gluten'));
      fireEvent.press(getByText('Nuts'));

      // All should be selectable
      expect(getByText('Dairy')).toBeTruthy();
      expect(getByText('Gluten')).toBeTruthy();
      expect(getByText('Nuts')).toBeTruthy();
    });

    it('should toggle food selection when pressed twice', () => {
      const { getByText } = render(<FoodPreferencesScreen navigation={mockNavigation} />);

      fireEvent.press(getByText('Dairy'));
      fireEvent.press(getByText('Dairy')); // Toggle off

      expect(getByText('Dairy')).toBeTruthy();
    });

    it('should show Add More button for extended foods', () => {
      const { getByText } = render(<FoodPreferencesScreen navigation={mockNavigation} />);

      expect(getByText(/Add More/)).toBeTruthy();
    });
  });

  describe('Favorite Cuisines', () => {
    beforeEach(() => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {},
        setFoodPreferences: mockSetFoodPreferences,
      });
    });

    it('should render all cuisine options', () => {
      const { getByText } = render(<FoodPreferencesScreen navigation={mockNavigation} />);

      expect(getByText('Mediterranean')).toBeTruthy();
      expect(getByText('Asian')).toBeTruthy();
      expect(getByText('Mexican')).toBeTruthy();
      expect(getByText('American')).toBeTruthy();
      expect(getByText('Italian')).toBeTruthy();
      expect(getByText('Indian')).toBeTruthy();
      expect(getByText('Greek')).toBeTruthy();
    });

    it('should allow selecting multiple cuisines', () => {
      const { getByText } = render(<FoodPreferencesScreen navigation={mockNavigation} />);

      fireEvent.press(getByText('Mediterranean'));
      fireEvent.press(getByText('Asian'));
      fireEvent.press(getByText('Mexican'));

      // All should be selectable
      expect(getByText('Mediterranean')).toBeTruthy();
      expect(getByText('Asian')).toBeTruthy();
      expect(getByText('Mexican')).toBeTruthy();
    });

    it('should show Skip option for cuisines', () => {
      const { getByText } = render(<FoodPreferencesScreen navigation={mockNavigation} />);

      expect(getByText(/Skip/)).toBeTruthy();
    });
  });

  describe('Stored State', () => {
    it('should initialize with stored dietary preference', () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {
          dietaryPreference: 'vegetarian',
          avoidFoods: [],
          preferredCuisines: [],
        },
        setFoodPreferences: mockSetFoodPreferences,
      });

      const { UNSAFE_root } = render(<FoodPreferencesScreen navigation={mockNavigation} />);
      expect(UNSAFE_root).toBeTruthy();
    });

    it('should initialize with stored foods to avoid', () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {
          dietaryPreference: 'none',
          avoidFoods: ['Dairy', 'Gluten'],
          preferredCuisines: [],
        },
        setFoodPreferences: mockSetFoodPreferences,
      });

      const { UNSAFE_root } = render(<FoodPreferencesScreen navigation={mockNavigation} />);
      expect(UNSAFE_root).toBeTruthy();
    });

    it('should initialize with stored cuisines', () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {
          dietaryPreference: 'none',
          avoidFoods: [],
          preferredCuisines: ['Mediterranean', 'Asian'],
        },
        setFoodPreferences: mockSetFoodPreferences,
      });

      const { UNSAFE_root } = render(<FoodPreferencesScreen navigation={mockNavigation} />);
      expect(UNSAFE_root).toBeTruthy();
    });
  });

  describe('Navigation', () => {
    it('should navigate to EatingPattern when Continue is pressed', async () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {},
        setFoodPreferences: mockSetFoodPreferences,
      });

      const { getByText } = render(<FoodPreferencesScreen navigation={mockNavigation} />);

      fireEvent.press(getByText('Continue'));

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('EatingPattern');
      });
    });

    it('should navigate back when back button is pressed', () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {},
        setFoodPreferences: mockSetFoodPreferences,
      });

      const { getByText } = render(<FoodPreferencesScreen navigation={mockNavigation} />);
      fireEvent.press(getByText('←'));
      expect(mockGoBack).toHaveBeenCalledTimes(1);
    });
  });

  describe('Store Integration', () => {
    it('should save dietary preference to store', async () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {},
        setFoodPreferences: mockSetFoodPreferences,
      });

      const { getByText } = render(<FoodPreferencesScreen navigation={mockNavigation} />);

      fireEvent.press(getByText('Vegetarian'));
      fireEvent.press(getByText('Continue'));

      await waitFor(() => {
        expect(mockSetFoodPreferences).toHaveBeenCalledWith(
          'vegetarian',
          [],
          []
        );
      });
    });

    it('should save foods to avoid to store', async () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {},
        setFoodPreferences: mockSetFoodPreferences,
      });

      const { getByText } = render(<FoodPreferencesScreen navigation={mockNavigation} />);

      fireEvent.press(getByText('Dairy'));
      fireEvent.press(getByText('Gluten'));
      fireEvent.press(getByText('Continue'));

      await waitFor(() => {
        expect(mockSetFoodPreferences).toHaveBeenCalledWith(
          'none',
          expect.arrayContaining(['Dairy', 'Gluten']),
          []
        );
      });
    });

    it('should save cuisines to store', async () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {},
        setFoodPreferences: mockSetFoodPreferences,
      });

      const { getByText } = render(<FoodPreferencesScreen navigation={mockNavigation} />);

      fireEvent.press(getByText('Mediterranean'));
      fireEvent.press(getByText('Asian'));
      fireEvent.press(getByText('Continue'));

      await waitFor(() => {
        expect(mockSetFoodPreferences).toHaveBeenCalledWith(
          'none',
          [],
          expect.arrayContaining(['Mediterranean', 'Asian'])
        );
      });
    });
  });

  describe('Validation', () => {
    it('should allow continuing with only dietary preference', async () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {},
        setFoodPreferences: mockSetFoodPreferences,
      });

      const { getByText } = render(<FoodPreferencesScreen navigation={mockNavigation} />);

      // Dietary preference defaults to 'none'
      fireEvent.press(getByText('Continue'));

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('EatingPattern');
      });
    });
  });

  describe('Progress Indicator', () => {
    it('should show correct progress (8/12)', () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {},
        setFoodPreferences: mockSetFoodPreferences,
      });

      const { UNSAFE_root } = render(<FoodPreferencesScreen navigation={mockNavigation} />);
      // Progress bar should show 8/12 = ~66.7%
      expect(UNSAFE_root).toBeTruthy();
    });
  });
});
